# Plateforme agence web — landing, CRM, projets, espace client

Application complète pour vendre et produire des sites internet :
**ATTIRER → QUALIFIER → CONVERTIR → PRODUIRE → LIVRER → FIDÉLISER**.

- **Site public** : landing page mobile-first, offres, réalisations, FAQ, formulaire de qualification en 4 étapes.
- **CRM** (`/admin`) : tableau de bord, pipeline Kanban, fiches prospects, clients, projets, devis, paiements, maintenance, statistiques, contenus du site.
- **Espace client** (`/client`) : avancement du projet, brief avec sauvegarde automatique, dépôt de fichiers, messages.

Stack : Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · PostgreSQL · Prisma 7 · Zod 4 · scrypt.
Hébergement prévu : **Cloudflare Workers** (via OpenNext) + PostgreSQL Neon + Cloudflare R2. Docker/VPS reste possible.
Choix techniques et modèle de données : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 1. Installation

Prérequis : **Node.js ≥ 20.9** (22 recommandé) et **PostgreSQL ≥ 14**.

```bash
git clone <votre-depot> && cd <votre-depot>
npm install            # installe les dépendances et génère le client Prisma
cp .env.example .env   # puis complétez .env (voir §3)
```

## 2. Configuration

Tout se configure par variables d'environnement (`.env` en local, panneau de l'hébergeur en production).
Le fichier `.env` est ignoré par git : **ne commitez jamais de secret**.

Générer un secret : `openssl rand -base64 48`

## 3. Variables d'environnement

| Variable | Obligatoire | Rôle |
| --- | --- | --- |
| `DATABASE_URL` | oui | Connexion PostgreSQL (`postgresql://user:mdp@hote:5432/base?schema=public`) |
| `APP_URL` | oui | URL publique sans `/` final (liens des emails, SEO, contrôle d'origine) |
| `APP_SECRET` | oui | Secret ≥ 32 caractères (anti-spam, empreinte des IP) |
| `TRUST_PROXY` | conseillé | `true` si l'app est derrière un proxy/CDN de confiance (Vercel, Nginx, Caddy, Cloudflare). Nécessaire pour que le rate-limit distingue les visiteurs. **Ne pas activer** si l'app est exposée directement (en-têtes falsifiables). |
| `EMAIL_DRIVER` | non | `console` (emails affichés dans les logs), `resend` (API HTTP — **à utiliser sur Cloudflare**) ou `smtp` |
| `RESEND_API_KEY` | si resend | Clé d'API Resend (resend.com, offre gratuite 3 000 emails/mois) |
| `EMAIL_FROM` | si smtp | Expéditeur, ex. `"Mon Studio <contact@mondomaine.fr>"` |
| `ADMIN_NOTIFICATION_EMAIL` | conseillé | Reçoit : nouveau prospect, nouveau client, brief terminé, nouveau fichier, message client |
| `SMTP_HOST` `SMTP_PORT` `SMTP_SECURE` `SMTP_USER` `SMTP_PASSWORD` | si smtp | Brevo, Resend, OVH, Gmail… |
| `STORAGE_DRIVER` | non | `local` (disque), `r2` (liaison Cloudflare R2 « FILES », **sur Cloudflare**) ou `s3` |
| `STORAGE_LOCAL_DIR` | si local | Dossier des fichiers (défaut `./storage`, à sauvegarder !) |
| `S3_ENDPOINT` `S3_REGION` `S3_BUCKET` `S3_ACCESS_KEY_ID` `S3_SECRET_ACCESS_KEY` | si s3 | Cloudflare R2, Scaleway, AWS… Le bucket doit rester **privé** |
| `UPLOAD_MAX_MB` | non | Taille max d'un fichier (défaut 15) |
| `TURNSTILE_SITE_KEY` `TURNSTILE_SECRET_KEY` | non | Anti-robot Cloudflare Turnstile (sinon : honeypot + délai + rate-limit) |
| `POSTGRES_PASSWORD` | Docker | Mot de passe de la base dans `docker-compose.yml` |

## 4. Base de données

```bash
npm run db:migrate      # développement : applique / crée les migrations
npm run db:deploy       # production : applique les migrations existantes
npm run db:seed         # contenu de départ : offres, options, FAQ, réglages (sans risque, n'écrase rien)
npm run db:studio       # explorer la base dans le navigateur
```

## 5. Migrations

Le schéma est dans `prisma/schema.prisma`. Après une modification :

```bash
npm run db:migrate -- --name description_du_changement   # crée prisma/migrations/<date>_…
```

Commitez le dossier `prisma/migrations/`. En production, `npm run db:deploy` applique les migrations en attente.

## 6. Lancement local

```bash
npm run dev                 # http://localhost:3000
npm run db:seed:demo        # facultatif : données FICTIVES (10 prospects, 5 clients/projets, 4 réalisations)
npm run db:demo:clear       # supprime toutes les données fictives
```

Les données de démonstration sont clairement identifiées : entreprises suffixées « (fictif) », emails `@example.com`,
badge « Donnée fictive » dans le CRM. Elles créent aussi un compte client de test : `client.demo@example.com` / `ClientDemo-2026!`
(modifiable via `DEMO_CLIENT_PASSWORD`). **N'exécutez pas le seed de démo en production.**

## 7. Créer le premier administrateur

```bash
npm run admin:create -- --email vous@mondomaine.fr --name "Prénom Nom"
# le mot de passe est demandé de façon masquée (ou via la variable ADMIN_PASSWORD pour un usage non interactif)
```

Puis connectez-vous sur `/connexion`. Commencez par **Paramètres** (nom de marque, coordonnées, réseaux, mentions légales).

### Donner accès à un client
Fiche prospect → **Convertir en client** → fiche client → **Créer l'accès client**. Le client reçoit un lien d'activation
(valable 7 jours) pour choisir son mot de passe. En mode `EMAIL_DRIVER=console`, le lien s'affiche dans le CRM pour être copié.

## 8. Déploiement

Le build ne nécessite pas de base de données. Le site public est rendu à la demande ; une modification faite dans l'admin
est visible immédiatement.

### Cloudflare Workers (hébergement retenu)

L'application tourne sur Workers grâce à [OpenNext](https://opennext.js.org/cloudflare). Le code est déjà adapté :
mots de passe en scrypt (pas de module natif), client Prisma « workerd », fichiers dans **R2**, emails via **Resend** (HTTP),
une connexion base par requête. Testé en local dans le runtime Cloudflare (`npm run preview`) avec le parcours e2e complet.

**Pré-requis** : offre **Workers Paid (5 $/mois)**. L'offre gratuite limite le CPU à 10 ms par requête et le Worker à 3 Mo ;
cette application en fait ~4,5 Mo compressés et le rendu des pages + la vérification des mots de passe dépassent 10 ms.

1. **Base de données — Neon** (gratuit) : créez un projet PostgreSQL, région *Europe (Frankfurt)*. Copiez la chaîne de connexion.
2. **Initialiser la base** depuis votre ordinateur (Node 22 installé), à la racine du projet :
   ```bash
   npm install
   DATABASE_URL="<chaîne Neon>" npm run db:deploy
   DATABASE_URL="<chaîne Neon>" npm run db:seed
   DATABASE_URL="<chaîne Neon>" npm run admin:create -- --email vous@domaine.fr --name "Prénom Nom"
   ```
3. **Fichiers — R2** : tableau de bord Cloudflare → R2 → *Créer un bucket* nommé **`agence-web-fichiers`** (laisser privé).
4. **Emails — Resend** : créez un compte, vérifiez votre domaine d'envoi, créez une clé d'API.
5. **Connexion à la base (conseillé) — Hyperdrive** : *Stockage et bases de données → Hyperdrive → Créer*, collez la chaîne Neon,
   **désactivez la mise en cache**, puis copiez l'identifiant et décommentez la ligne `hyperdrive` de `wrangler.jsonc` avec cet identifiant.
   (Sans Hyperdrive, l'application se connecte directement via le secret `DATABASE_URL`, un peu plus lentement.)
6. **Créer le Worker relié à GitHub** : *Workers & Pages → Créer → Importer un dépôt* → ce dépôt, branche de production
   `claude/agence-web-platform`.
   - Commande de build : `npm run cf:build`
   - Commande de déploiement : `npx opennextjs-cloudflare deploy`
7. **Variables et secrets** (Worker `agence-web` → Paramètres → Variables et secrets) :

   | Nom | Type | Valeur |
   | --- | --- | --- |
   | `APP_URL` | texte | `https://agence-web.<votre-sous-domaine>.workers.dev` (puis votre domaine) |
   | `APP_SECRET` | secret | `openssl rand -base64 48` |
   | `DATABASE_URL` | secret | chaîne Neon (inutile si Hyperdrive est configuré, mais sans risque) |
   | `RESEND_API_KEY` | secret | clé Resend |
   | `EMAIL_FROM` | texte | `Votre Marque <contact@votre-domaine.fr>` |
   | `ADMIN_NOTIFICATION_EMAIL` | texte | votre adresse |

   `STORAGE_DRIVER=r2`, `EMAIL_DRIVER=resend` et `TRUST_PROXY=true` sont déjà dans `wrangler.jsonc`.
8. **Déployer** : chaque `git push` sur la branche déclenche un déploiement. Le site est alors en ligne sur
   **`https://agence-web.<votre-sous-domaine>.workers.dev`**. Domaine personnalisé : Worker → *Paramètres → Domaines et routes*.

Tester le Worker en local avant de pousser : `cp .dev.vars.example .dev.vars` (à compléter) puis `npm run preview` → http://localhost:8787.
Déployer depuis votre poste (au lieu de GitHub) : `npx wrangler login` puis `npm run deploy`.

### Option A — VPS + Docker
Un VPS 2 Go (Hetzner, OVH, Scaleway…) suffit.

```bash
cp .env.example .env    # APP_URL, APP_SECRET, POSTGRES_PASSWORD, SMTP, ADMIN_NOTIFICATION_EMAIL, TRUST_PROXY=true
docker compose up -d --build                     # PostgreSQL + migrations + contenu de départ + application
docker compose run --rm migrate npx tsx --conditions=react-server scripts/create-admin.ts --email vous@mondomaine.fr --name "Prénom Nom"
```

L'application écoute sur `127.0.0.1:3000` : placez un reverse proxy HTTPS devant, par exemple **Caddy** (`/etc/caddy/Caddyfile`) :

```
mondomaine.fr {
  reverse_proxy 127.0.0.1:3000
}
```

Les fichiers clients sont dans le volume Docker `uploads`, la base dans `db-data`.

### Option B — Vercel + Neon + Cloudflare R2 (aucun serveur à gérer)
1. Base : créer une base PostgreSQL sur Neon (ou Supabase) → `DATABASE_URL`.
2. Fichiers : créer un bucket **privé** R2 → `STORAGE_DRIVER=s3`, `S3_ENDPOINT=https://<id>.r2.cloudflarestorage.com`, `S3_REGION=auto`, clés d'API.
   (Le stockage `local` ne fonctionne pas sur Vercel : le disque y est éphémère.)
3. Vercel : importer le dépôt, renseigner les variables, `TRUST_PROXY=true`.
4. Depuis votre poste, avec la `DATABASE_URL` de production : `npm run db:deploy && npm run db:seed && npm run admin:create -- --email …`

## 9. Maintenance

| Tâche | Commande / action |
| --- | --- |
| Sauvegarde base (Docker) | `docker compose exec db pg_dump -U agence agence > sauvegarde-$(date +%F).sql` (à planifier chaque jour, conserver hors du serveur) |
| Sauvegarde fichiers | volume `uploads` (ou bucket S3) |
| Mise à jour de l'app | `git pull && docker compose up -d --build` (les migrations s'appliquent automatiquement) |
| Santé | `GET /api/health` → `{"status":"ok"}` |
| Logs | `docker compose logs -f app` (JSON, une ligne par événement ; les erreurs portent `"level":"error"`) |
| Dépendances | `npm outdated` puis `npm audit` régulièrement |
| Données de démo | `npm run db:demo:clear` |
| Mot de passe admin perdu | `npm run admin:create -- --email vous@domaine.fr --reset` |

## Tests

```bash
npm test                 # 50+ tests d'intégration sur une vraie base PostgreSQL de test
npm run test:e2e         # parcours complet dans un navigateur (formulaire → CRM → client → brief → fichiers)
npm run typecheck
```

- Base des tests d'intégration : `TEST_DATABASE_URL` (défaut `postgresql://agence:agence@localhost:5432/agence_test`). **Elle est vidée à chaque test** : n'utilisez jamais une base contenant des données réelles.
- Base e2e : `E2E_DATABASE_URL` (défaut `…/agence_e2e`), jamais vidée (données uniques à chaque exécution).
- Navigateur e2e : `npx playwright install chromium`, ou `PLAYWRIGHT_CHROMIUM_PATH=/chemin/vers/chromium`.

Couvert : création de prospect, validation (front/back, messages FR), anti-spam, rate-limit, conversion prospect → client,
authentification (scrypt, sessions, invitation, réinitialisation), permissions admin/client, projets et statuts (synchronisation du pipeline),
acompte → ouverture du brief, brief, upload (types, signatures, taille), **isolation stricte entre clients** (projets, brief, fichiers, messages, export),
devis (numérotation, totaux, statuts), contenus administrables, statistiques exactes, cohérence constantes ↔ schéma.

## Sécurité (résumé)

Mots de passe scrypt (paramètres OWASP) · sessions en base révocables, cookie `__Host-` HttpOnly/Secure/SameSite · contrôle d'accès dans chaque service ·
Zod sur toutes les entrées · requêtes Prisma paramétrées · protection CSRF (Server Actions + vérification d'`Origin`) · rate-limit en base ·
honeypot + jeton horodaté signé + Turnstile optionnel · uploads en liste blanche avec vérification de signature binaire, SVG refusé,
téléchargements authentifiés en `attachment` · en-têtes CSP/HSTS/X-Frame-Options · aucun secret dans le code ni dans le navigateur.

Note : `npm audit` signale une vulnérabilité dans `deepmerge-ts`, dépendance de l'**outil en ligne de commande** Prisma (développement uniquement,
non embarquée dans l'application) ; `mysql2` (même origine) est forcé en version corrigée via `overrides`.

## RGPD

L'architecture fournit : consentement horodaté et versionné, absence de cookies de suivi, export JSON des données (admin et client),
suppression définitive (prospect, client), pages Confidentialité et Mentions légales alimentées par les Paramètres.
**Ces éléments ne constituent pas une validation juridique** : faites relire vos textes et votre registre de traitements par un professionnel.

## Organisation du code

```
prisma/            schéma, migrations, seed (contenu réel + démo fictive)
scripts/           création d'administrateur
src/app/           pages (public, admin, client, auth) et routes API
src/components/    UI réutilisable (ui/, landing/, admin/, client/, project/, forms/)
src/lib/           constantes métier, formats, validation partagée
src/server/        auth, services métier (droits vérifiés ici), actions, email, stockage, sécurité
tests/             intégration (Vitest) et bout en bout (Playwright)
```
