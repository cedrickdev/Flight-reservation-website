# Déploiement Vercel de Trust Elite Travel

## Configuration du projet

Le frontend est une application React/Vite, et non une application Next.js. Dans Vercel, utiliser le preset **Vite** ou **Other** avec les paramètres suivants :

| Paramètre | Valeur |
|---|---|
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist/public` |
| Node.js | `22.x` |

Le dépôt déclare `pnpm@10.4.1` dans `package.json`, utilise un lockfile `pnpm-lock.yaml` et autorise les scripts natifs nécessaires à Tailwind et esbuild dans `pnpm-workspace.yaml`.

## Variables d’environnement

Pour le frontend statique seul, aucune variable serveur n’est suffisante pour rendre les pages. Pour le formulaire full-stack, le serveur doit également être déployé sur une cible compatible avec le serveur Express/tRPC actuel, ou être converti en fonctions Vercel. Les variables serveur à prévoir sur cette cible sont `DATABASE_URL`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `CONTACT_EMAIL`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `OAUTH_SERVER_URL`, `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID` et `OWNER_NAME`. Les variables de stockage S3 et les autres secrets doivent être renseignés uniquement via les variables sécurisées du fournisseur.

## Limite actuelle du backend

Le build Vercel configuré ici publie correctement le frontend Vite dans `dist/public`. Le backend du projet démarre actuellement un serveur Express avec `server.listen(...)`; il ne devient donc pas automatiquement une fonction serverless Vercel. Si le frontend est déployé sur Vercel sans adaptation backend, les pages peuvent fonctionner mais les appels `/api/trpc` du formulaire peuvent retourner `404`. Il faut alors conserver le backend sur l’hébergement full-stack existant ou créer une couche `api/` Vercel dédiée avant de déplacer le formulaire.

## Vérification locale

La séquence validée localement est :

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

Après le push GitHub, relancer un déploiement Vercel et vérifier séparément le chargement des pages et l’appel réel à `/api/trpc` avant de considérer le formulaire comme opérationnel sur Vercel.
