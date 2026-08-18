# Déploiement Vercel — Trust Elite Travel

Le projet est une application **Next.js App Router** sans backend métier. Toutes les pages et les sept fiches services sont pré-rendues au build.

## Configuration recommandée

1. Importer le dépôt dans Vercel.
2. Laisser Vercel détecter automatiquement le preset **Next.js**.
3. Utiliser Node.js 22.x et pnpm.
4. Ajouter la variable facultative `NEXT_PUBLIC_SITE_URL=https://trust-elite-travels.com`.
5. Déployer.

Les commandes détectées sont :

| Étape | Commande |
|---|---|
| Installation | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Démarrage local | `pnpm start` |

Aucun secret de base de données, SMTP, OAuth, Forge ou Manus n’est nécessaire.

## Contrôles avant publication

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build
```

Après le déploiement, vérifier les routes `/`, `/services`, `/a-propos`, `/contact`, `/robots.txt` et `/sitemap.xml`, puis envoyer une demande test vers WhatsApp depuis un mobile.
