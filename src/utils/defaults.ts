import type {
  MovementConfig,
  MouseInteractionConfig,
  AnimationConfig,
  BounceConfig,
  VisualConfig,
  BehaviorConfig,
  AdvancedConfig,
  Callbacks,
} from "../components/Wanderer";

// Configuration par défaut (Wanderer classique)
export const defaultMovement: Required<MovementConfig> = {
  baseSpeed: 2,
  speedVariation: 0, // Pas de variation de vitesse
  speedChangeFrequency: 0, // Pas de changement de vitesse
  enableRandomSpeed: false, // Vitesse constante
};

export const defaultMouseInteraction: Required<MouseInteractionConfig> = {
  enabled: true,
  detectionDistance: 60,
  safetyZone: 30,
  escapeSpeedMultiplier: 2,
  escapeAngleVariation: Math.PI / 3,
  throttleDelay: 100,
};

export const defaultAnimation: Required<AnimationConfig> = {
  enableRotation: true,
  rotationDurations: [6, 4, 2, 1, 0.5],
  rotationChangeFrequency: 0.005,
  enableSpinVariation: true,
};

export const defaultBounce: Required<BounceConfig> = {
  enabled: true,
  bounceAngleVariation: 0, // Rebonds classiques sans variation
  enableRandomBounce: false, // Pas de rebonds aléatoires
};

export const defaultVisual: Required<VisualConfig> = {
  className: "",
  style: {},
  enableHoverEffects: false,
  hoverScale: 1.1,
  transitionDuration: 0.3,
};

export const defaultBehavior: Required<BehaviorConfig> = {
  startPosition: "random",
  boundaryBehavior: "bounce",
  enableGravity: false,
  gravityStrength: 0.1,
  enableFriction: false,
  frictionCoefficient: 0.98,
};

export const defaultAdvanced: Required<AdvancedConfig> = {
  animationFrameRate: 60,
  enableDebug: false,
  enablePerformanceMode: false,
  collisionDetection: "mouse",
  customCollisionElements: [],
};

export const defaultCallbacks: Required<Callbacks> = {
  onCollision: () => {},
  onSpeedChange: () => {},
  onPositionChange: () => {},
  onAnimationComplete: () => {},
};
