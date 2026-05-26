# Changelog

## 1.0.2

### Fixed

- **Le wanderer ne bougeait quasiment plus** (~1px toutes les quelques secondes).
  La boucle d'animation lisait `position`/`velocity` depuis des _snapshots_ de
  state capturés au render, et ne ré-incrémentait donc qu'à chaque re-render React
  (déclenché uniquement par un changement de `spinDuration`). La boucle lit
  désormais des **refs vivantes** et tourne via des deps `useEffect` **stables**
  (un seul `setInterval` pour toute la durée de vie, config lue via une ref) — le
  mouvement s'accumule frame par frame, indépendamment du cycle de render.
- **Rotation auto-suffisante** : `animation: spin ...` dépendait d'un `@keyframes
  spin` global (fourni par Tailwind & co, absent sinon). La lib injecte maintenant
  ce keyframe elle-même (idempotent, safe SSR).
- **Initialisation sur conteneur non dimensionné** : si le parent faisait 0px au
  montage (layout en cours, `display:none`), le wanderer était placé à des
  coordonnées négatives et n'était jamais re-mesuré. L'init attend désormais via
  `ResizeObserver` que le parent ait une taille.

### Notes

- Aucun changement d'API publique côté consommateur (`<Wanderer />` et ses props
  sont identiques). La signature interne de `useWandererAnimation` expose des refs
  d'état au lieu de snapshots.
