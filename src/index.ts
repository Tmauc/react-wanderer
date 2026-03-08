// Main component
export { default as Wanderer } from "./components/Wanderer";

// Types (public API)
export type {
  WandererProps,
  MovementConfig,
  MouseInteractionConfig,
  AnimationConfig,
  BounceConfig,
  VisualConfig,
  BehaviorConfig,
  AdvancedConfig,
  Callbacks,
  Velocity,
  Vector2D,
  MousePosition,
  BoundaryResult,
} from "./types";

// Default configurations (useful for consumers extending defaults)
export {
  defaultMovement,
  defaultMouseInteraction,
  defaultAnimation,
  defaultBounce,
  defaultVisual,
  defaultBehavior,
  defaultAdvanced,
  defaultCallbacks,
} from "./utils/defaults";
