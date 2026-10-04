# Le Merkez — site

> « Nous avons fait de vous des peuples et des tribus afin que vous vous connaissiez. »

Site du Merkez, sous la direction du Shaykh Mohamed Faouzi Al Karkari.
Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

Node ≥ 20.9. Hébergé sur **Cloudflare Workers** via l'adaptateur [OpenNext](https://opennext.js.org/cloudflare)
(voir « Déploiement Cloudflare » ci-dessous). Fonctionne aussi sur Vercel ou tout hébergeur Node (`next start`).
Variables d'environnement : voir `.env.example` (au minimum `NEXT_PUBLIC_SITE_URL` en production).

---

## Le récit et la métaphore

Le site raconte : **des peuples différents → des histoires différentes → des rencontres → des liens → une communauté → un lieu → le Merkez.**

La **muraqaa** (vêtement composé de carrés de tissus différents) est le langage visuel du site :
chaque carré = une personne, une culture, une tradition. Les fragments textiles sont générés en CSS
(`src/lib/patchwork.ts`) — aucune image n'est nécessaire pour qu'ils existent.

| Section | Animation |
| --- | --- |
| Hero | photos qui coulissent (le projet du Merkez, puis nos actions), avec les fragments qui s'assemblent en emblème et « LE MERKEZ » ; photos dans `heroSlides` (`home.ts`) |
| Hero (animation) | fragments épars → ils dérivent, se rapprochent, se cousent en un emblème 3×3 → « LE MERKEZ » |
| Transitions | lisières de tissu qui se cousent au scroll (`FragmentDivider`) |
| Le Merkez (vision) | 35 fragments dispersés convergent en mosaïque, la phrase de vision s'écrit au centre |
| Nos actions | défilement horizontal ; les images traversent les grands titres |
| En action | Rencontrer → Échanger → Transmettre → Servir → Construire, sur fond clair aux halos colorés mouvants |
| Fil de lumière | un point lumineux descend le long d'une ligne verticale au fil du scroll (toutes les pages) |
| Galerie | mosaïque de personnes → une seule image ; photos qui sortent de leurs cadres, parallaxe |
| Le lieu | plan conceptuel : huit espaces cousus autour d'un centre (la même forme que l'emblème) |
| Dons | compteur / barre de progression **uniquement** si un objectif chiffré réel est saisi |

Mobile : animations allégées (moins de fragments, pas de défilement horizontal, distances réduites).
`prefers-reduced-motion` : aucune animation, tout le contenu est affiché. Sans JavaScript : contenu lisible.

---

## Modifier le contenu

Tout le contenu est dans **`src/content/`** — pas besoin de toucher aux composants.

| Fichier | Contenu |
| --- | --- |
| `site.ts` | titre, description, navigation, réseaux sociaux, coordonnées, affichage des étiquettes `[À FOURNIR]` |
| `home.ts` | verset, hero (+ vidéo), phrase de vision, « en action », récit final |
| `actions.ts` | les 5 axes **et les articles** (actions menées) par catégorie |
| `books.ts` | catalogue des ouvrages (éditions Les 7 Lectures) + sélection de l'accueil |
| `gallery.ts` | photos de la galerie (format : portrait / landscape / square / full) |
| `shaykh.ts` | page /le-shaykh : portrait, biographie, enseignements, conférences, vidéos, publications |
| `events.ts` | prochain événement affiché sur la page Actualités (le plus proche dans le futur) |
| `merkez.ts` | page « Le Merkez » (/le-merkez) : idée, muraqaa, lieu, participer |
| `place.ts` | le futur lieu (espaces, textes, futures photos) |
| `donation.ts` | montants, objectifs (montants réels uniquement), lien de don externe |

### Images et vidéos
Déposer les fichiers dans `public/images/…` ou `public/videos/…`, puis renseigner `src` (ex. `"/images/muraqaa.jpg"`).
Tant que `src` vaut `null`, un visuel textile avec une étiquette `[PHOTO À FOURNIR]` est affiché.
Pour masquer toutes les étiquettes : `showPlaceholderLabels: false` dans `site.ts`.

- **Vidéo du hero** : `home.ts → hero.video` (mp4 + webm optionnel + poster). Prévoir ~10–20 s, ≤ 6 Mo.
- **Palette** : `src/lib/palette.ts` et `@theme` dans `src/app/globals.css` (à affiner d'après la photo).

### Publier une action (article)
Ajouter un objet dans `articles` (`src/content/actions.ts`) :

```ts
{
  category: "actions-humanitaires",
  slug: "maraude-hiver",
  title: "…",
  date: "2026-01-15",
  location: "…",
  excerpt: "…",
  cover: { src: "/images/actions/maraude.jpg", alt: "…" },
  body: ["Paragraphe 1", "Paragraphe 2"],
}
```
La page `/actions/<categorie>/<slug>` et le sitemap sont générés automatiquement.
Supprimer ensuite les articles modèles (`placeholder: true`, non indexés).

---

## Dons — intégration du paiement

Aucun paiement n'est simulé. Deux chemins :

1. **Sans code** : renseigner `externalDonationUrl` dans `donation.ts` (ex. formulaire HelloAsso) → le bouton y redirige.
2. **Intégré** : `POST /api/donate` (`src/app/api/donate/route.ts`) valide le montant puis délègue au prestataire
   défini par `PAYMENT_PROVIDER` (`stripe` | `paypal` | `helloasso`). Implémenter `createCheckout` dans
   `src/lib/payments/<prestataire>.ts` (la marche à suivre est en commentaire) ; la page de retour est `/merci`.
   Tant qu'aucun prestataire n'est configuré, l'API répond `503 not_configured` et le formulaire affiche
   « Le paiement en ligne sera bientôt disponible ».

## Librairie — future boutique
`src/lib/commerce.ts` centralise disponibilité et prix. Aujourd'hui : lien d'achat externe (`purchaseUrl`) ou
« Bientôt disponible ». Pour une boutique (Stripe Checkout, Shopify, Snipcart…), brancher le panier ici en
s'appuyant sur `book.sku` ; les composants n'ont pas à changer.

---

## Déploiement Cloudflare

Configuration : `wrangler.jsonc` (Worker `le-merkez`) et `open-next.config.ts`.

```bash
npm run preview   # build OpenNext + aperçu local dans le runtime Cloudflare (http://localhost:8787)
npm run deploy    # build + déploiement direct (nécessite `npx wrangler login`)
```

Déploiement automatique depuis GitHub (Workers Builds) :
- Commande de build : `npx opennextjs-cloudflare build`
- Commande de déploiement : `npx opennextjs-cloudflare deploy`
- Variable de build : `NEXT_PUBLIC_SITE_URL` = URL publique du site
- Le nom du Worker dans Cloudflare doit être `le-merkez` (identique à `wrangler.jsonc`).

Les images (`next/image`) sont servies sans optimisation à la volée : fournir des fichiers déjà compressés.
Les clés de paiement (Stripe, PayPal, HelloAsso) se déclarent en *secrets* du Worker.

## SEO
Métadonnées + Open Graph + Twitter Cards (`src/app/layout.tsx`), image de partage générée
(`opengraph-image.tsx`), favicon (`icon.svg`, `apple-icon.tsx`), `sitemap.xml`, `robots.txt`, manifest,
données structurées JSON-LD (`Organization`, `WebSite`). Les liens sociaux renseignés alimentent `sameAs`.

## Structure

```
src/
  app/                    pages, SEO, API /api/donate
  components/
    layout/               Nav, Footer, FragmentDivider, PageHeader
    motion/               gsap (plugins + media queries), SmoothScroll (Lenis), RevealText
    sections/             Hero, InAction, Vision, ActionChapters,
                          chapters/{Interfaith,Retreats,Conferences,Humanitarian}, ArticlesBoard,
                          Books, InAction, Gallery, PhysicalPlace, Shaykh, Donation
    ui/                   Button, Photo, PatchField, Emblem, BookCover, ArticleCard, SectionHeading
  content/                ← tout le contenu modifiable
  lib/                    palette, patchwork, payments/, commerce, format
```

## À fournir (placeholders actuels)
Photo de la muraqaa · vidéo du hero · photos (actions, galerie, groupe, retraites) · portrait et biographie
vérifiée du Shaykh · enseignements, conférences, vidéos, publications · livres (titres, auteurs, couvertures,
prix) · articles des actions menées (dates, lieux) · objectifs chiffrés des dons (si souhaités) · mentions
légales / fiscalité des dons · liens Instagram, YouTube, Facebook, TikTok · e-mail, téléphone, adresse ·
URL du site.
