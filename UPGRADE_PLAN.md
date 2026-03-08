# React-Wanderer - Analyse Profonde & Plan d'Upgrade

## 1. ANALYSE DU PROJET

### Vue d'ensemble
**react-wanderer** est un composant React qui crée un objet animé se déplaçant aléatoirement dans un conteneur parent, rebondissant sur les murs et fuyant les interactions souris avec une physique réaliste.

- **Version**: 1.0.0
- **Auteur**: Mauc
- **Licence**: MIT
- **Stack**: React 19 + TypeScript 5.8 + Vite 7 + Vitest 3.2
- **Tests**: 133 tests, 10 fichiers de test, tous passants

### Architecture actuelle

```
src/
├── components/
│   ├── Wanderer.tsx          # Composant principal (lib export)
│   ├── InteractiveDemo.tsx   # Demo app
│   ├── ControlPanel.tsx      # Demo UI
│   ├── CodeDisplay.tsx       # Demo UI
│   ├── LiveStats.tsx         # Demo UI
│   ├── PresetSelector.tsx    # Demo UI
│   └── Tabs.tsx              # Demo UI
├── hooks/
│   ├── useWandererAnimation.ts    # Boucle d'animation (setInterval)
│   ├── useWandererEvents.ts       # Gestion événements souris
│   ├── useWandererInitialization.ts # Initialisation position/vélocité
│   └── useWandererState.ts        # État centralisé (refs + state)
├── utils/
│   ├── animation.ts          # Styles CSS, rotation
│   ├── boundary.ts           # Collision avec les bords
│   ├── defaults.ts           # Valeurs par défaut
│   ├── mouseInteraction.ts   # Collision souris
│   ├── movement.ts           # Physique du mouvement
│   └── physics.ts            # Calculs mathématiques/physiques
├── config/
│   └── presets.ts            # Presets de configuration
└── index.ts                  # Point d'entrée de la lib
```

---

## 2. PROBLEMES CRITIQUES IDENTIFIES

### P1 - Sécurité (14 vulnérabilités npm)
- **4 HIGH**: rollup (path traversal), minimatch (ReDoS), tar (multiple)
- **9 MODERATE**: ajv, vite, js-yaml, lodash, @eslint/plugin-kit
- **1 LOW**
- **Action**: `npm audit fix` pour résoudre la majorité

### P2 - Bug Performance: Animation avec `setInterval` + re-render loop
Le hook `useWandererAnimation` a un **problème fondamental**:
- L'`useEffect` a `config.position` et `config.velocity` dans ses dépendances
- Ces valeurs changent à CHAQUE frame (60fps)
- Cela provoque un **teardown + setup de l'interval à chaque frame**
- L'animation crée/détruit un `setInterval` 60 fois par seconde au lieu d'en avoir un seul

**Impact**: Performance dégradée, potentielle fuite mémoire, animation saccadée.

**Solution**: Utiliser `requestAnimationFrame` au lieu de `setInterval`, et lire position/velocity depuis les refs directement dans la callback au lieu de les passer comme dépendances.

### P3 - `useWandererState` retourne `ref.current` directement
```typescript
return {
  position: positionRef.current,  // Ceci capture la valeur au moment du render
  velocity: velocityRef.current,  // Pas la ref elle-même
}
```
Les refs sont mutées mais le composant ne re-render pas quand elles changent. Combiné avec le P2, chaque frame recrée l'effect qui re-lit les refs. C'est fonctionnel mais inefficace.

### P4 - Interfaces dupliquées
Les interfaces `MovementConfig`, `MouseInteractionConfig`, `AnimationConfig`, etc. sont définies dans:
1. `components/Wanderer.tsx`
2. `utils/animation.ts`
3. `utils/mouseInteraction.ts`
4. `utils/movement.ts`
5. `hooks/useWandererAnimation.ts`

Pas de fichier de types centralisé.

### P5 - `prismjs` et `@types/prismjs` en `dependencies` au lieu de `devDependencies`
Ces packages sont utilisés uniquement dans la demo (CodeDisplay), pas dans la lib exportée. Ils alourdissent le package npm inutilement.

### P6 - Package.json manque `"type": "module"`
ESLint affiche un warning car le module type n'est pas spécifié. Le projet utilise ESM partout.

### P7 - Exports trop larges dans `index.ts`
Toutes les fonctions utilitaires internes sont exportées (`export *`), y compris des helpers qui ne devraient pas faire partie de l'API publique.

### P8 - Aucune validation d'input sur les props
Le composant spreading `{...movement}` directement sans validation. Des valeurs null/undefined/NaN peuvent casser l'animation silencieusement.

---

## 3. PROBLEMES SECONDAIRES

### S1 - Pas de `React.memo` sur le composant Wanderer
Chaque re-render du parent re-render le Wanderer, même si les props n'ont pas changé.

### S2 - `eslint-disable-next-line react-hooks/exhaustive-deps` partout
Indique que les dépendances des hooks ne sont pas correctement structurées.

### S3 - Pas de `@keyframes spin` dans la lib
Le composant génère `animation: "spin Xs linear infinite"` mais ne fournit pas le keyframe CSS. Le consommateur doit le définir lui-même.

### S4 - Commentaires en français dans le code source
Pour un package npm public, les commentaires devraient être en anglais.

### S5 - `enablePerformanceMode` et `collisionDetection: "elements" | "both"` non implémentés
Ces options existent dans l'interface mais n'ont aucun effet dans le code.

### S6 - Tests trop mockés
- Les tests de `useWandererState` vérifient seulement que les fonctions existent (`toBeDefined()`), pas qu'elles fonctionnent correctement avec les refs
- Le test de callback `onCollision` vérifie juste `typeof onCollision === 'function'`
- Pas de tests d'intégration

### S7 - Pas de CI/CD
Aucun fichier GitHub Actions.

### S8 - `@vitest/coverage-v8` n'est pas dans devDependencies
Le script `test:coverage` existe mais la dépendance manque.

---

## 4. PLAN D'UPGRADE

### Phase 1: Fondations (Correctifs critiques)

#### 1.1 - Corriger les vulnérabilités npm
```bash
npm audit fix
```

#### 1.2 - Ajouter `"type": "module"` dans package.json

#### 1.3 - Déplacer `prismjs` et `@types/prismjs` en devDependencies
```bash
npm install --save-dev prismjs @types/prismjs
```

#### 1.4 - Créer un fichier de types centralisé
Créer `src/types.ts` avec toutes les interfaces et supprimer les duplications.

#### 1.5 - Ajouter `@vitest/coverage-v8` en devDependencies

### Phase 2: Performance (Refactoring critique)

#### 2.1 - Migrer de `setInterval` vers `requestAnimationFrame`
- Supprimer la boucle setInterval/clearInterval qui se recrée à chaque frame
- Utiliser `requestAnimationFrame` avec throttle basé sur `animationFrameRate`
- Lire position/velocity depuis les refs directement dans le RAF callback

#### 2.2 - Refactorer `useWandererState`
- Retourner les refs elles-mêmes (pas `.current`) pour les valeurs qui changent à chaque frame
- Garder `useState` uniquement pour `spinDuration` et `isHovered` (qui triggent un re-render)

#### 2.3 - Envelopper `Wanderer` avec `React.memo`

#### 2.4 - Nettoyer les dépendances des useEffect
- Supprimer les `eslint-disable` en restructurant correctement

### Phase 3: API publique

#### 3.1 - Restreindre les exports dans `index.ts`
Exporter uniquement:
- `Wanderer` (composant)
- Les types/interfaces nécessaires au consommateur
- Éventuellement les presets

#### 3.2 - Fournir le keyframe `@keyframes spin` dans la lib
Injecter automatiquement le CSS nécessaire via un `<style>` tag ou le documenter clairement.

#### 3.3 - Implémenter ou retirer les features non implémentées
- `enablePerformanceMode`: implémenter (réduire les calculs, skip frames)
- `collisionDetection: "elements" | "both"`: implémenter ou retirer de l'interface

#### 3.4 - Validation des props
Ajouter une validation minimale pour les valeurs critiques (speed > 0, dimensions > 0, etc.)

### Phase 4: Qualité & Tests

#### 4.1 - Améliorer la couverture des tests
- Tests `useWandererState`: vérifier que les refs sont réellement mutées
- Tests d'intégration: rendre le composant sans mocks et vérifier le mouvement
- Tests edge cases: dimensions 0, speed 0, parent resize

#### 4.2 - Ajouter des tests pour les features manquantes
- Test que `@keyframes spin` est injecté
- Test de `React.memo` (pas de re-render inutile)
- Test de `requestAnimationFrame` (si migré)

#### 4.3 - Internationaliser les commentaires
Traduire tous les commentaires FR -> EN pour le package public.

### Phase 5: Packaging & Distribution

#### 5.1 - Ajouter GitHub Actions CI
```yaml
# .github/workflows/ci.yml
- Lint
- Type check (tsc --noEmit)
- Tests
- Build lib
```

#### 5.2 - Ajouter `tsc --noEmit` comme script
Pour vérifier les types sans build.

#### 5.3 - Configurer `npm pack --dry-run`
Vérifier que seuls les fichiers nécessaires sont inclus dans le package.

#### 5.4 - Ajouter un CHANGELOG.md

---

## 5. MATRICE DE PRIORISATION

| Tâche | Impact | Effort | Priorité |
|-------|--------|--------|----------|
| P2 - RAF au lieu de setInterval | CRITIQUE | Moyen | 1 |
| P3 - Refs dans useWandererState | CRITIQUE | Faible | 1 |
| P1 - npm audit fix | HIGH | Faible | 2 |
| P4 - Types centralisés | MEDIUM | Moyen | 2 |
| P5 - prismjs en devDep | MEDIUM | Faible | 2 |
| P6 - type: module | LOW | Faible | 2 |
| P7 - Exports trop larges | MEDIUM | Faible | 3 |
| S1 - React.memo | MEDIUM | Faible | 3 |
| S3 - @keyframes spin | MEDIUM | Faible | 3 |
| S5 - Features non implémentées | MEDIUM | Moyen | 3 |
| S6 - Tests améliorés | HIGH | Moyen | 4 |
| S7 - CI/CD | HIGH | Moyen | 4 |
| S4 - Commentaires EN | LOW | Faible | 5 |
| P8 - Validation props | MEDIUM | Moyen | 5 |

---

## 6. METRIQUES ACTUELLES

| Métrique | Valeur |
|----------|--------|
| Tests | 133 passants / 0 échouant |
| Fichiers de test | 10 |
| Taille bundle ESM | 21.70 kB (6.52 kB gzip) |
| Taille bundle CJS | 15.45 kB (5.61 kB gzip) |
| Vulnérabilités npm | 14 (4 high, 9 moderate, 1 low) |
| Lint warnings | 1 (type: module manquant) |
| Lint errors | 0 |
| TypeScript strict | Oui |
