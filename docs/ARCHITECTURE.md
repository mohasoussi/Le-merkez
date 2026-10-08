# Architecture — Plateforme agence web

Ce document résume l'analyse du cahier des charges, les choix techniques et leurs raisons.

## 1. Lecture du besoin

Un seul système doit couvrir tout le cycle :
**ATTIRER → QUALIFIER → CONVERTIR → PRODUIRE → LIVRER → FIDÉLISER**

| Étape | Brique |
| --- | --- |
| Attirer | Landing page publique mobile-first, SEO, capture des UTM |
| Qualifier | Formulaire de qualification → `Lead` en base, pipeline Kanban, fiche prospect, notes, historique |
| Convertir | Devis (`Quote`), suivi acompte/solde (`Payment`), conversion prospect → `Client` sans ressaisie |
| Produire | `Project` (statuts, progression, preview), brief client, dépôt de fichiers |
| Livrer | Validation, URL finale, timeline côté client, messages |
| Fidéliser | `MaintenanceSubscription`, revenus récurrents |

Trois espaces : **public** (`/`), **administration** (`/admin`), **client** (`/client`).

## 2. Stack retenue

| Couche | Choix | Pourquoi |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router) + **React 19** + TypeScript | Front + back dans un seul projet, rendu serveur (rapide sur mobile), Server Actions protégées contre le CSRF par défaut, déploiement simple. |
| Style | **Tailwind CSS 4** | Pas de CSS mort, design system cohérent, aucun JS ajouté. |
| Base de données | **PostgreSQL 16** | Relationnel (le domaine l'est), fiable, hébergements gratuits/peu chers (Neon, Supabase, Scaleway, VPS). |
| ORM | **Prisma 7** (adaptateur `pg`) | Schéma lisible, migrations versionnées, requêtes typées et paramétrées (pas d'injection SQL). La 8.0 est encore en RC : non retenue. |
| Validation | **Zod 4** | Mêmes schémas côté navigateur et serveur. |
| Authentification | **Maison, sessions en base** + **Argon2id** (`@node-rs/argon2`) | Besoin simple (email + mot de passe, 2 rôles). Une solution maison de ~200 lignes, auditable, évite une dépendance lourde. Jeton aléatoire 256 bits en cookie `HttpOnly`/`Secure`/`SameSite=Lax`, seul son hash SHA-256 est stocké. |
| Fichiers | Interface `Storage` avec 2 pilotes : **disque local** (dev / VPS) et **S3-compatible** (Cloudflare R2, Scaleway, AWS) | Les fichiers clients ne sont jamais publics : ils passent par une route qui vérifie les droits. |
| Emails | Interface `Mailer` : pilote **console** (dev) ou **SMTP** (`nodemailer`) | SMTP fonctionne avec tous les fournisseurs (Brevo, Resend, OVH, Gmail…). Un échec d'email ne bloque jamais l'action. |
| Kanban | `@dnd-kit/core` | Glisser-déposer accessible, support tactile (mobile). |
| Export | CSV (UTF-8 + BOM, séparateur `;` pour Excel FR) + XLSX (`write-excel-file`, léger) | |
| Tests | **Vitest** (intégration sur une vraie base PostgreSQL de test) + **Playwright** (parcours de bout en bout) | |

Écartés volontairement : GraphQL, Redux, librairie de composants lourde, librairie de graphiques (barres en CSS), Redis (le rate-limit est stocké en base), CMS externe (le contenu est éditable dans `/admin`).

## 3. Organisation du code

```
prisma/
  schema.prisma          schéma de la base
  migrations/            migrations SQL versionnées
  seed.ts                contenu réel (offres, FAQ, réglages) + données fictives (option --demo)
scripts/create-admin.ts  création du premier administrateur
src/
  app/
    (public)/            landing, formulaire, pages légales
    connexion/ activation/ mot-de-passe-oublie/
    admin/               CRM (protégé ADMIN)
    client/              espace client (protégé CLIENT)
    api/                 route handlers : leads, uploads, fichiers, exports
  components/            composants UI réutilisables (ui/, landing/, admin/, client/)
  lib/                   utilitaires purs (format, constantes métier, libellés)
  server/
    db.ts                client Prisma
    auth/                sessions, mots de passe, garde-fous de rôles
    services/            LOGIQUE MÉTIER + contrôle des droits (testée)
    validation/          schémas Zod
    email/               mailer + gabarits
    storage/             pilotes de stockage
    security/            rate limit, anti-spam, origine, IP
    actions/             Server Actions (fines couches qui appellent les services)
tests/                   tests d'intégration (Vitest) et e2e (Playwright)
```

Règle : **les pages et actions ne parlent jamais directement à Prisma pour écrire** ; elles appellent un service qui reçoit l'utilisateur courant et vérifie ses droits. C'est ce qui rend l'isolation entre clients testable.

## 4. Modèle de données (résumé)

```
User ──< Session                 User.role = ADMIN | CLIENT ; User.clientId → Client (comptes client)
Lead ──1:1── Client ──< Project ──1:1── Brief
  │            │            ├──< ProjectFile
  │            │            └──< Message
  │            ├──< Payment (DEPOSIT | BALANCE | MAINTENANCE | OTHER)
  │            └──< MaintenanceSubscription ──> Offer (type MAINTENANCE)
  ├──< Quote ──< QuoteItem
  ├──< Note
  └──< Activity (historique ; aussi liée à Client / Project)
Offer (SITE | MAINTENANCE) · OfferOption · PortfolioProject · Faq · SiteSettings (singleton)
AuthToken (invitation / réinitialisation) · RateLimit
```

Choix notables :
- **Montants en centimes (entiers)** : aucune erreur d'arrondi.
- **`ProjectStatus` et `PipelineStage` sont des enums** et non des tables : ils pilotent la logique (timeline client, statistiques) ; les libellés et la progression par défaut vivent dans `src/lib/constants.ts`.
- Le devis est rattaché au **prospect** (il est envoyé avant la signature), le client y accède via la relation 1:1 Lead → Client.
- `ProjectFile` plutôt que `File` pour ne pas masquer le type `File` natif du navigateur.
- `isDemo` sur les prospects/clients de démonstration : identifiables et supprimables en une commande.

## 5. Sécurité

- Mots de passe Argon2id ; sessions en base, révocables ; cookie `__Host-` en production.
- Contrôle d'accès **côté serveur dans chaque service** (le `proxy` Next ne fait qu'une redirection de confort).
- Server Actions : vérification d'origine intégrée à Next ; routes API mutantes : vérification `Origin`.
- Zod sur toutes les entrées ; Prisma = requêtes paramétrées ; React échappe le HTML ; aucun `dangerouslySetInnerHTML` avec une donnée utilisateur.
- Rate limiting en base (formulaire, connexion, uploads, messages) ; anti-spam : honeypot + délai minimal de saisie + Cloudflare Turnstile optionnel.
- Uploads : liste blanche d'extensions **et** vérification de la signature binaire, taille max, noms de fichiers régénérés, SVG refusé, téléchargement avec `Content-Disposition` + `nosniff`.
- En-têtes : CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Secrets uniquement dans les variables d'environnement ; `.env` ignoré par git.

## 6. RGPD (architecture technique, pas un avis juridique)

- Consentement explicite et horodaté (version du texte stockée) sur le formulaire.
- Pas de cookie de suivi : les UTM sont gardés en `sessionStorage` jusqu'à l'envoi du formulaire ; seul le cookie de session (strictement nécessaire) est posé.
- Export JSON des données d'un prospect/client, suppression définitive depuis l'admin, export par le client de ses propres données.
- Page politique de confidentialité et mentions légales alimentées par les réglages (à faire valider juridiquement).

## 7. Déploiement

- **Option A (coût minimal, recommandé pour démarrer)** : un VPS (Hetzner, OVH, Scaleway ~5 €/mois) avec `docker compose` (app + PostgreSQL), stockage disque local, sauvegardes `pg_dump`.
- **Option B (zéro serveur à gérer)** : Vercel + Neon (PostgreSQL) + Cloudflare R2 (fichiers, pilote S3).

Cloudflare Workers (utilisé pour le site du Merkez) n'est pas retenu ici : Prisma + uploads + Argon2 natif y sont plus contraignants.
