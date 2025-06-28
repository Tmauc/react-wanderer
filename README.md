# React Wanderer

Un composant React avancé qui crée un wanderer animé qui se déplace à l'écran et réagit aux interactions de la souris. L'wanderer rebondit sur les murs, change de direction aléatoirement, et fuit le curseur de la souris quand il s'approche trop près.

## ✨ Fonctionnalités

- 🎯 **Interactions souris** : L'wanderer fuit le curseur quand il s'approche
- 🎲 **Mouvement aléatoire** : Déplacement continu avec changements de direction aléatoires
- 🏓 **Rebonds sur les murs** : L'wanderer rebondit sur les bords du conteneur
- 🌀 **Animation de rotation** : Rotation continue avec vitesse variable
- ⚡ **Performance optimisée** : Animation fluide à 60 FPS
- 🎛️ **Personnalisation avancée** : 8 catégories de paramètres configurables
- 📱 **Support TypeScript** : Définitions TypeScript complètes incluses
- 🔧 **Rétrocompatibilité** : API simple pour une utilisation basique

## 📦 Installation

```bash
npm install react-wanderer
```

ou

```bash
yarn add react-wanderer
```

## 🚀 Utilisation basique

```tsx
import React, { useRef } from "react";
import { Wanderer } from "react-wanderer";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Wanderer
        src="/path/to/your/wanderer.png"
        alt="Animated Wanderer"
        width={64}
        height={64}
        parentRef={containerRef}
      />
    </div>
  );
}
```

## ⚙️ Configuration avancée

Le composant Wanderer accepte 8 catégories de paramètres optionnels pour personnaliser complètement son comportement :

### Props obligatoires

| Prop        | Type                                   | Description                               |
| ----------- | -------------------------------------- | ----------------------------------------- |
| `src`       | `string`                               | URL source de l'image de l'wanderer       |
| `alt`       | `string`                               | Texte alternatif pour l'accessibilité     |
| `width`     | `number`                               | Largeur de l'wanderer en pixels           |
| `height`    | `number`                               | Hauteur de l'wanderer en pixels           |
| `parentRef` | `React.RefObject<HTMLElement \| null>` | Référence vers l'élément conteneur parent |

### 🔄 Paramètres de mouvement (`movement`)

```tsx
movement={{
  baseSpeed: 2,                    // Vitesse de base (px/frame)
  speedVariation: 0,               // Variation de vitesse (±px/frame)
  speedChangeFrequency: 0,         // Fréquence de changement de vitesse (0-1)
  enableRandomSpeed: false,        // Activer les changements aléatoires de vitesse
}}
```

| Paramètre              | Type      | Défaut  | Description                                   |
| ---------------------- | --------- | ------- | --------------------------------------------- |
| `baseSpeed`            | `number`  | `2`     | Vitesse de base en pixels par frame           |
| `speedVariation`       | `number`  | `0`     | Variation maximale de vitesse (±px/frame)     |
| `speedChangeFrequency` | `number`  | `0`     | Probabilité de changement de vitesse (0-1)    |
| `enableRandomSpeed`    | `boolean` | `false` | Activer les changements aléatoires de vitesse |

### 🖱️ Interactions souris (`mouseInteraction`)

```tsx
mouseInteraction={{
  enabled: true,                   // Activer les interactions souris
  detectionDistance: 60,           // Distance de détection (px)
  safetyZone: 30,                  // Zone de sécurité (px)
  escapeSpeedMultiplier: 2,        // Multiplicateur de vitesse de fuite
  escapeAngleVariation: Math.PI/3, // Variation d'angle de fuite (radians)
  throttleDelay: 100,              // Délai de throttling (ms)
}}
```

| Paramètre               | Type      | Défaut      | Description                                      |
| ----------------------- | --------- | ----------- | ------------------------------------------------ |
| `enabled`               | `boolean` | `true`      | Activer les interactions avec la souris          |
| `detectionDistance`     | `number`  | `60`        | Distance à laquelle l'wanderer détecte la souris |
| `safetyZone`            | `number`  | `30`        | Distance minimale à maintenir avec la souris     |
| `escapeSpeedMultiplier` | `number`  | `2`         | Multiplicateur de vitesse lors de la fuite       |
| `escapeAngleVariation`  | `number`  | `Math.PI/3` | Variation d'angle pour la direction de fuite     |
| `throttleDelay`         | `number`  | `100`       | Délai entre les calculs d'interaction (ms)       |

### 🎬 Animation (`animation`)

```tsx
animation={{
  enableRotation: true,            // Activer la rotation
  rotationDurations: [6,4,2,1,0.5], // Durées de rotation possibles (secondes)
  rotationChangeFrequency: 0.005,  // Fréquence de changement de rotation
  enableSpinVariation: true,       // Activer les variations de rotation
}}
```

| Paramètre                 | Type       | Défaut          | Description                                   |
| ------------------------- | ---------- | --------------- | --------------------------------------------- |
| `enableRotation`          | `boolean`  | `true`          | Activer l'animation de rotation               |
| `rotationDurations`       | `number[]` | `[6,4,2,1,0.5]` | Durées de rotation possibles (secondes)       |
| `rotationChangeFrequency` | `number`   | `0.005`         | Probabilité de changement de rotation         |
| `enableSpinVariation`     | `boolean`  | `true`          | Activer les variations de vitesse de rotation |

### 🏓 Rebonds (`bounce`)

```tsx
bounce={{
  enabled: true,                   // Activer les rebonds
  bounceAngleVariation: 0,         // Variation d'angle de rebond (radians)
  enableRandomBounce: false,       // Activer les rebonds aléatoires
}}
```

| Paramètre              | Type      | Défaut  | Description                                    |
| ---------------------- | --------- | ------- | ---------------------------------------------- |
| `enabled`              | `boolean` | `true`  | Activer les rebonds sur les bords              |
| `bounceAngleVariation` | `number`  | `0`     | Variation d'angle lors des rebonds             |
| `enableRandomBounce`   | `boolean` | `false` | Générer des directions aléatoires après rebond |

### 🎨 Visuel (`visual`)

```tsx
visual={{
  className: "",                   // Classes CSS personnalisées
  style: {},                       // Styles CSS inline
  enableHoverEffects: false,       // Activer les effets de survol
  hoverScale: 1.1,                 // Échelle lors du survol
  transitionDuration: 0.3,         // Durée des transitions (secondes)
}}
```

| Paramètre            | Type                  | Défaut  | Description                          |
| -------------------- | --------------------- | ------- | ------------------------------------ |
| `className`          | `string`              | `""`    | Classes CSS à appliquer à l'wanderer |
| `style`              | `React.CSSProperties` | `{}`    | Styles CSS inline                    |
| `enableHoverEffects` | `boolean`             | `false` | Activer les effets visuels au survol |
| `hoverScale`         | `number`              | `1.1`   | Facteur d'échelle lors du survol     |
| `transitionDuration` | `number`              | `0.3`   | Durée des transitions CSS (secondes) |

### 🧠 Comportement (`behavior`)

```tsx
behavior={{
  startPosition: "random",         // Position de départ
  boundaryBehavior: "bounce",      // Comportement aux bords
  enableGravity: false,            // Activer la gravité
  gravityStrength: 0.1,            // Force de la gravité
  enableFriction: false,           // Activer la friction
  frictionCoefficient: 0.98,       // Coefficient de friction
}}
```

| Paramètre             | Type                                             | Défaut     | Description                          |
| --------------------- | ------------------------------------------------ | ---------- | ------------------------------------ |
| `startPosition`       | `"random" \| "center" \| {x: number, y: number}` | `"random"` | Position initiale de l'wanderer      |
| `boundaryBehavior`    | `"bounce" \| "wrap" \| "stop" \| "reverse"`      | `"bounce"` | Comportement aux bords du conteneur  |
| `enableGravity`       | `boolean`                                        | `false`    | Activer l'effet de gravité           |
| `gravityStrength`     | `number`                                         | `0.1`      | Force de la gravité (px/frame²)      |
| `enableFriction`      | `boolean`                                        | `false`    | Activer la friction (ralentissement) |
| `frictionCoefficient` | `number`                                         | `0.98`     | Coefficient de friction (0-1)        |

### ⚡ Avancé (`advanced`)

```tsx
advanced={{
  animationFrameRate: 60,          // Taux de rafraîchissement (FPS)
  enableDebug: false,              // Activer le mode debug
  enablePerformanceMode: false,    // Activer le mode performance
  collisionDetection: "mouse",     // Type de détection de collision
  customCollisionElements: [],     // Éléments de collision personnalisés
}}
```

| Paramètre                 | Type                              | Défaut    | Description                                  |
| ------------------------- | --------------------------------- | --------- | -------------------------------------------- |
| `animationFrameRate`      | `number`                          | `60`      | Taux de rafraîchissement de l'animation      |
| `enableDebug`             | `boolean`                         | `false`   | Afficher les logs de debug dans la console   |
| `enablePerformanceMode`   | `boolean`                         | `false`   | Optimiser pour les performances              |
| `collisionDetection`      | `"mouse" \| "elements" \| "both"` | `"mouse"` | Type de détection de collision               |
| `customCollisionElements` | `HTMLElement[]`                   | `[]`      | Éléments HTML pour la détection de collision |

### 📞 Callbacks (`callbacks`)

```tsx
callbacks={{
  onCollision: (type) => {},       // Appelé lors d'une collision
  onSpeedChange: (speed) => {},    // Appelé lors d'un changement de vitesse
  onPositionChange: (x, y) => {},  // Appelé lors d'un changement de position
  onAnimationComplete: () => {},   // Appelé à la fin d'une animation
}}
```

| Callback              | Signature                                        | Description                             |
| --------------------- | ------------------------------------------------ | --------------------------------------- |
| `onCollision`         | `(type: "wall" \| "mouse" \| "element") => void` | Appelé lors d'une collision             |
| `onSpeedChange`       | `(newSpeed: number) => void`                     | Appelé lors d'un changement de vitesse  |
| `onPositionChange`    | `(x: number, y: number) => void`                 | Appelé lors d'un changement de position |
| `onAnimationComplete` | `() => void`                                     | Appelé à la fin d'une animation         |

## 🎯 Exemples d'utilisation

### Wanderer rapide et imprévisible

```tsx
<Wanderer
  src="/wanderer.png"
  alt="Wanderer Rapide"
  width={50}
  height={50}
  parentRef={containerRef}
  movement={{
    baseSpeed: 5,
    speedVariation: 6,
    speedChangeFrequency: 0.05,
    enableRandomSpeed: true,
  }}
/>
```

### Wanderer timide qui fuit la souris

```tsx
<Wanderer
  src="/wanderer.png"
  alt="Wanderer Timide"
  width={50}
  height={50}
  parentRef={containerRef}
  mouseInteraction={{
    detectionDistance: 100,
    safetyZone: 50,
    escapeSpeedMultiplier: 4,
    escapeAngleVariation: Math.PI / 2,
  }}
/>
```

### Wanderer avec gravité et friction

```tsx
<Wanderer
  src="/wanderer.png"
  alt="Wanderer Physique"
  width={50}
  height={50}
  parentRef={containerRef}
  behavior={{
    enableGravity: true,
    gravityStrength: 0.2,
    enableFriction: true,
    frictionCoefficient: 0.95,
  }}
/>
```

### Wanderer qui traverse les bords

```tsx
<Wanderer
  src="/wanderer.png"
  alt="Wanderer Traverseur"
  width={50}
  height={50}
  parentRef={containerRef}
  behavior={{
    boundaryBehavior: "wrap",
  }}
/>
```

### Wanderer avec effets visuels

```tsx
<Wanderer
  src="/wanderer.png"
  alt="Wanderer Visuel"
  width={50}
  height={50}
  parentRef={containerRef}
  animation={{
    enableRotation: false,
  }}
  visual={{
    enableHoverEffects: true,
    hoverScale: 1.5,
    transitionDuration: 0.5,
    className: "drop-shadow-lg",
  }}
/>
```

### Wanderer avec callbacks

```tsx
<Wanderer
  src="/wanderer.png"
  alt="Wanderer Interactif"
  width={50}
  height={50}
  parentRef={containerRef}
  callbacks={{
    onCollision: (type) => {
      console.log(`Collision détectée: ${type}`);
    },
    onSpeedChange: (speed) => {
      console.log(`Nouvelle vitesse: ${speed}`);
    },
    onPositionChange: (x, y) => {
      console.log(`Nouvelle position: (${x}, ${y})`);
    },
  }}
/>
```

## 🔧 Comportements aux bords

Le paramètre `boundaryBehavior` contrôle comment l'wanderer réagit aux bords du conteneur :

- **`"bounce"`** : L'wanderer rebondit sur les bords (comportement par défaut)
- **`"wrap"`** : L'wanderer apparaît de l'autre côté du conteneur
- **`"stop"`** : L'wanderer s'arrête aux bords
- **`"reverse"`** : L'wanderer inverse sa direction aux bords

## 🎮 Positions de départ

Le paramètre `startPosition` contrôle la position initiale de l'wanderer :

- **`"random"`** : Position aléatoire dans le conteneur (par défaut)
- **`"center"`** : Centre du conteneur
- **`{x: number, y: number}`** : Position spécifique en pixels

## 🧪 Tests

Ce projet inclut une suite de tests complète utilisant **Vitest** et **Testing Library** pour garantir la qualité et la fiabilité du code.

### 🚀 Scripts de tests disponibles

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer l'interface graphique des tests
npm run test:ui

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests par catégorie
npm run test:utils      # Tests des utilitaires
npm run test:hooks      # Tests des hooks React
npm run test:components # Tests des composants
```

### 📊 Couverture des tests

Le projet inclut des tests pour :

#### 🛠️ **Utilitaires** (`src/utils/`)

- **Physics** : Calculs de vélocité, forces physiques
- **Boundary** : Gestion des collisions avec les bords
- **Mouse Interaction** : Détection et réaction aux interactions souris
- **Animation** : Styles d'animation et durées de rotation
- **Movement** : Logique de mouvement et changements de vitesse

#### 🪝 **Hooks React** (`src/hooks/`)

- **useWandererState** : Gestion de l'état global du wanderer
- **useWandererEvents** : Gestion des événements souris et hover
- **useWandererAnimation** : Boucle d'animation et mise à jour des positions
- **useWandererInitialization** : Initialisation de la position et vélocité

#### 🧩 **Composants** (`src/components/`)

- **Wanderer** : Rendu du composant principal, props, styles

### 🎯 Exemples de tests

#### Test d'utilitaire (Physics)

```typescript
describe("getRandomVelocity", () => {
  it("should return velocity with correct speed", () => {
    const velocity = getRandomVelocity(5, 1, Math.PI / 4, true);
    const speed = Math.sqrt(velocity.dx ** 2 + velocity.dy ** 2);
    expect(speed).toBeCloseTo(5, 1);
  });
});
```

#### Test de hook (useWandererState)

```typescript
describe("useWandererState", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useWandererState(5));
    expect(result.current.speed).toBe(5);
    expect(result.current.isHovered).toBe(false);
  });
});
```

#### Test de composant (Wanderer)

```typescript
describe("Wanderer component", () => {
  it("renders an image with correct src and alt", () => {
    render(<Wanderer {...baseProps} />);
    const img = screen.getByAltText("Avatar");
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/avatar.png");
  });
});
```

### 🔧 Configuration des tests

Les tests utilisent :

- **Vitest** : Runner de tests rapide et moderne
- **Testing Library** : Utilitaires pour tester les composants React
- **jsdom** : Environnement DOM pour les tests
- **Mocks** : Isolation des dépendances externes

### 📈 Métriques de qualité

- **Couverture de code** : Tests unitaires pour tous les modules
- **Tests d'intégration** : Vérification du comportement global
- **Tests de régression** : Prévention des régressions
- **Tests de performance** : Validation des optimisations

## 🛡️ Comportement en cas de props manquantes ou invalides

- **src** :  
  Si la prop `src` est vide (`""`), `null` ou `undefined`, le composant ne rend rien (aucune balise `<img>` n'est générée).  
  Cela évite tout comportement inattendu ou warning dans le navigateur.

- **alt** :  
  La prop `alt` est désormais optionnelle. Si elle n'est pas fournie, la valeur par défaut `"Animated wanderer"` est utilisée pour garantir l'accessibilité.

---

## 🧪 Tests

- Les tests vérifient que le composant ne rend rien si `src` est vide ou absent.
- Les tests s'assurent que l'attribut `alt` a bien une valeur par défaut si non fourni.
- Le comportement attendu en cas de props manquantes a évolué :
  - **Avant** : le composant rendait une image même si `src` était vide (ce qui pouvait générer un warning).
  - **Maintenant** : le composant ne rend rien si `src` est vide ou absent.

## ♿ Accessibilité

- Le composant garantit toujours un texte alternatif (`alt`) pour l'accessibilité, même si la prop n'est pas renseignée.

## 📋 Prérequis

- React 16.8.0 ou supérieur (pour le support des hooks)
- Un élément conteneur avec `position: relative` ou `absolute`

## 🌐 Support navigateur

- Navigateurs modernes avec support ES6+
- CSS transforms et animations
- Événements souris

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.
