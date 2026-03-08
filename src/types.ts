import type React from "react";

// Core physics types
export interface Vector2D {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

// Configuration interfaces
export interface MovementConfig {
  baseSpeed?: number;
  speedVariation?: number;
  speedChangeFrequency?: number;
  enableRandomSpeed?: boolean;
}

export interface MouseInteractionConfig {
  enabled?: boolean;
  detectionDistance?: number;
  safetyZone?: number;
  escapeSpeedMultiplier?: number;
  escapeAngleVariation?: number;
  throttleDelay?: number;
}

export interface AnimationConfig {
  enableRotation?: boolean;
  rotationDurations?: number[];
  rotationChangeFrequency?: number;
  enableSpinVariation?: boolean;
}

export interface BounceConfig {
  enabled?: boolean;
  bounceAngleVariation?: number;
  enableRandomBounce?: boolean;
}

export interface VisualConfig {
  className?: string;
  style?: React.CSSProperties;
  enableHoverEffects?: boolean;
  hoverScale?: number;
  transitionDuration?: number;
}

export interface BehaviorConfig {
  startPosition?: "random" | "center" | { x: number; y: number };
  boundaryBehavior?: "bounce" | "wrap" | "stop" | "reverse";
  enableGravity?: boolean;
  gravityStrength?: number;
  enableFriction?: boolean;
  frictionCoefficient?: number;
}

export interface AdvancedConfig {
  animationFrameRate?: number;
  enableDebug?: boolean;
  enablePerformanceMode?: boolean;
}

export interface Callbacks {
  onCollision?: (type: "wall" | "mouse") => void;
  onSpeedChange?: (newSpeed: number) => void;
  onPositionChange?: (x: number, y: number) => void;
  onAnimationComplete?: () => void;
}

// Main component props
export interface WandererProps {
  height: number;
  parentRef: React.RefObject<HTMLElement | null>;
  src: string;
  width: number;
  alt?: string;
  movement?: Partial<MovementConfig>;
  mouseInteraction?: Partial<MouseInteractionConfig>;
  animation?: Partial<AnimationConfig>;
  bounce?: Partial<BounceConfig>;
  visual?: Partial<VisualConfig>;
  behavior?: Partial<BehaviorConfig>;
  advanced?: Partial<AdvancedConfig>;
  callbacks?: Partial<Callbacks>;
}

// Boundary collision result
export interface BoundaryResult {
  position: { x: number; y: number };
  velocity: Velocity;
  rebounded: boolean;
  angle?: number;
}

// Wanderer state interface
export interface WandererState {
  position: { x: number; y: number };
  velocity: Velocity;
  speed: number;
  spinDuration: number;
  mousePosition: MousePosition;
  lastEscapeTime: number;
  isHovered: boolean;
  initialized: boolean;
}
