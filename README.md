# WCE Association

Plateforme SaaS multi-tenant permettant à toute association de créer et personnaliser
le site web de son organisation (page d'accueil modulable, images, couleurs, en-tête,
pied de page), avec un système d'abonnement payant.

## Stack technique

- **Next.js 16** (App Router, Server Actions, Route Handlers) + TypeScript
- **PostgreSQL** via **Prisma** (schéma multi-tenant à base partagée : chaque table
  métier porte un `organizationId`)
- **Tailwind CSS v4** pour le rendu du site public et de l'espace d'administration
- **Paiement** : abstraction `PaymentProvider` (`src/lib/payments`) avec deux
  implémentations : `mock` (simulateur intégré, pour développer/tester sans compte
  réel) et `saspay` (agrégateur mobile money / carte, https://docs.saspay.me)

## Démarrage rapide

```bash
# 1. Démarrer PostgreSQL (docker-compose.yml est au niveau racine du projet)
docker compose up -d

# 2. Installer les dépendances
npm install --legacy-peer-deps

# 3. Copier la config d'environnement puis l'ajuster si besoin
cp .env.example .env

# 4. Appliquer le schéma et charger les données de démonstration
npx prisma migrate dev
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

Comptes créés par le seed :

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Super-admin plateforme | `issaadmin` | `GG@@ssppeerr7755admin` |
| Admin de l'association démo | `admin@boulangers-afrique.org` | `ChangeMe123!` |

- Site public de démonstration : http://localhost:3000/site/boulangers-afrique
- Back-office association : http://localhost:3000/admin
- Back-office plateforme (gestion des associations/forfaits) : http://localhost:3000/platform

## Multi-tenant : comment ça marche

Chaque association abonnée a son propre sous-domaine : `{slug}.APP_BASE_DOMAIN`
(en local : `boulangers-afrique.localhost:3000` — la plupart des navigateurs/OS
résolvent `*.localhost` vers la machine locale sans configuration DNS). `src/proxy.ts`
détecte le sous-domaine (ou un nom de domaine personnalisé enregistré sur
`Organization.customDomain`) et réécrit la requête vers `/site/{slug}`, de façon
transparente pour le visiteur.

Pour tester sans sous-domaine, la route `/site/{slug}` fonctionne aussi directement.

## Personnalisation de la page d'accueil

La page d'accueil de chaque association est composée de **sections** ordonnées et
activables/désactivables (`Section` en base, type `HERO`, `STATS`, `FEATURES`,
`NETWORK_MAP`, `NEWS_NEWSLETTER`, `COMMUNITY_GRID`, `TESTIMONIAL`, `CTA_FOOTER`,
`CUSTOM_HTML`). Le contenu de chaque section (textes, images, liens, icônes) est un
JSON validé par un schéma Zod dédié (`src/lib/sections/schema.ts`), édité depuis
`/admin/site`. L'apparence globale (logo, couleurs, menu, pied de page) se gère depuis
`/admin/site/settings`. Les images sont importées depuis `/admin/media` et stockées
sous `public/uploads/{organizationId}/` (voir `src/lib/media/storage.ts` — une
abstraction facilement remplaçable par un stockage objet type S3 en production).

## Abonnement & paiement (SasPay)

`PAYMENT_PROVIDER` dans `.env` bascule entre :

- `mock` (par défaut) : aucune dépendance externe, une page `/mock-pay/[paymentId]`
  simule la page de paiement hébergée avec deux boutons « paiement réussi » /
  « échec », ce qui permet de tester tout le cycle d'abonnement sans compte SasPay.
- `saspay` : utilise la vraie API SasPay (checkout hébergé). Il faut renseigner
  `SASPAY_API_KEY`, `SASPAY_BASE_URL` et `SASPAY_WEBHOOK_SECRET` dans `.env`, et
  configurer un webhook dans le dashboard SasPay pointant vers
  `{APP_BASE_URL}/api/webhooks/saspay`.

Le webhook SasPay ne documentant pas de champ garanti reliant une transaction à notre
session de paiement, `src/lib/payments/reconcile.ts` revérifie aussi périodiquement
les paiements récents en attente directement auprès de l'API (comportement recommandé
par la documentation SasPay elle-même).

## Structure du projet

```
prisma/schema.prisma        Modèle de données (tenants, sections, médias, abonnements, paiements)
prisma/seed.ts               Données de démonstration
src/proxy.ts                 Routage multi-tenant par sous-domaine / domaine personnalisé
src/lib/sections/            Schémas de contenu des sections + icônes
src/lib/payments/            Abstraction de paiement (mock + SasPay) et réconciliation
src/lib/actions/             Server Actions (auth, sections, médias, facturation, membres)
src/components/site/         Rendu du site public (header, footer, sections)
src/components/admin/        Éditeur de page d'accueil et médiathèque
src/app/site/[slug]/         Site public d'une association
src/app/admin/               Back-office d'une association (ORG_ADMIN)
src/app/platform/            Back-office de la plateforme (PLATFORM_ADMIN)
```

## Limites connues / prochaines étapes

- L'espace membre (`/espace-membre`) est volontairement minimal (inscription +
  connexion) : c'est une base à enrichir (annuaire, forum, mentorat...) si besoin.
- Les domaines personnalisés sont supportés au niveau applicatif (`customDomain` +
  proxy) ; la partie infrastructure (DNS, certificat TLS) reste à mettre en place
  selon l'hébergeur choisi.
- Le stockage des médias est local au serveur ; pour un déploiement multi-instance,
  remplacer `src/lib/media/storage.ts` par un provider S3-compatible.
