# Vérification layout shift

- Images JSX contrôlées : 11
- Images sans dimensions explicites : 0
- Section globe avec règles de hauteur/padding détectées : oui

## Constat

Les images contrôlées déclarent leurs dimensions intrinsèques avant le chargement, et les visuels hors hero utilisent le chargement différé. Le globe est un background dans une section dont la géométrie est fixée par les styles de section ; aucun ajustement supplémentaire n’a été nécessaire après les captures desktop et mobile.

## Détails

- Aucun problème détecté.
