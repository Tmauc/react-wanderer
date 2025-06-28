export { default as Wanderer } from "./components/Wanderer";
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
} from "./components/Wanderer";

export * from "./utils/physics";
export * from "./utils/boundary";
export * from "./utils/mouseInteraction";
export * from "./utils/animation";
export * from "./utils/movement";
export * from "./utils/defaults";

export * from "./hooks/useWandererState";
export * from "./hooks/useWandererInitialization";
export * from "./hooks/useWandererEvents";
export * from "./hooks/useWandererAnimation";
