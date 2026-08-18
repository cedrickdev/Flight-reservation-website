# Trust Elite Travel

Landing page bilingue de Trust Elite Travel, développée avec Next.js App Router et pré-rendue pour de bonnes performances et un référencement robuste.

## Démarrage

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Le site est disponible par défaut sur [http://localhost:3000](http://localhost:3000).

## Vérification de production

```bash
pnpm check
pnpm build
pnpm start
```

## Architecture

- Next.js App Router, React et TypeScript strict
- pages et fiches services pré-rendues
- métadonnées, sitemap, robots, manifeste et données structurées natifs
- contenu bilingue français/anglais côté interface
- formulaire sans backend : préparation d’un lead structuré vers WhatsApp avec alternative e-mail
- images et logos servis localement depuis `public/assets`

Le projet n’utilise ni base de données, ni API Express, ni bucket Manus.

## Configuration

Copier `.env.example` vers `.env.local` uniquement si le domaine canonique doit être modifié :

```bash
NEXT_PUBLIC_SITE_URL=https://trust-elite-travels.com
```
