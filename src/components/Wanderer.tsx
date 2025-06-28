import React, { useRef } from "react";

// Import des utilitaires
import { generateAnimationStyles } from "../utils/animation";
import {
  defaultMovement,
  defaultMouseInteraction,
  defaultAnimation,
  defaultBounce,
  defaultVisual,
  defaultBehavior,
  defaultAdvanced,
  defaultCallbacks,
} from "../utils/defaults";

// Import des hooks
import { useWandererState } from "../hooks/useWandererState";
import { useWandererInitialization } from "../hooks/useWandererInitialization";
import { useWandererEvents } from "../hooks/useWandererEvents";
import { useWandererAnimation } from "../hooks/useWandererAnimation";

// Interfaces pour les configurations
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
  collisionDetection?: "mouse" | "elements" | "both";
  customCollisionElements?: HTMLElement[];
}

export interface Callbacks {
  onCollision?: (type: "wall" | "mouse" | "element") => void;
  onSpeedChange?: (newSpeed: number) => void;
  onPositionChange?: (x: number, y: number) => void;
  onAnimationComplete?: () => void;
}

// Interface principale étendue
export interface WandererProps {
  // Props obligatoires (inchangées)
  height: number;
  parentRef: React.RefObject<HTMLElement | null>;
  src: string;
  width: number;

  // Props optionnelles
  alt?: string;

  // Nouvelles props optionnelles
  movement?: Partial<MovementConfig>;
  mouseInteraction?: Partial<MouseInteractionConfig>;
  animation?: Partial<AnimationConfig>;
  bounce?: Partial<BounceConfig>;
  visual?: Partial<VisualConfig>;
  behavior?: Partial<BehaviorConfig>;
  advanced?: Partial<AdvancedConfig>;
  callbacks?: Partial<Callbacks>;
}

const Wanderer: React.FC<WandererProps> = ({
  src,
  alt = "Animated wanderer",
  width,
  height,
  parentRef,
  movement = {},
  mouseInteraction = {},
  animation = {},
  bounce = {},
  visual = {},
  behavior = {},
  advanced = {},
  callbacks = {},
}) => {
  // Fusion avec les valeurs par défaut
  const finalMovement = { ...defaultMovement, ...movement };
  const finalMouseInteraction = {
    ...defaultMouseInteraction,
    ...mouseInteraction,
  };
  const finalAnimation = { ...defaultAnimation, ...animation };
  const finalBounce = { ...defaultBounce, ...bounce };
  const finalVisual = { ...defaultVisual, ...visual };
  const finalBehavior = { ...defaultBehavior, ...behavior };
  const finalAdvanced = { ...defaultAdvanced, ...advanced };
  const finalCallbacks = { ...defaultCallbacks, ...callbacks };

  // Refs
  const wandererRef = useRef<HTMLImageElement>(null);

  // Hook pour gérer l'état
  const state = useWandererState(finalMovement.baseSpeed);

  // Hook pour l'initialisation
  useWandererInitialization({
    parentRef,
    wandererRef,
    width,
    height,
    startPosition: finalBehavior.startPosition,
    baseSpeed: finalMovement.baseSpeed,
    speedVariation: finalMovement.speedVariation,
    enableRandomSpeed: finalMovement.enableRandomSpeed,
    initialized: state.initialized,
    updatePosition: state.updatePosition,
    updateVelocity: state.updateVelocity,
    setInitialized: state.setInitialized,
  });

  // Hook pour les événements
  useWandererEvents({
    parentRef,
    mouseInteractionEnabled: finalMouseInteraction.enabled,
    hoverEffectsEnabled: finalVisual.enableHoverEffects,
    updateMousePosition: state.updateMousePosition,
    setHovered: state.setHovered,
  });

  // Hook pour l'animation
  useWandererAnimation({
    parentRef,
    wandererRef,
    width,
    height,
    frameRate: finalAdvanced.animationFrameRate,
    enableDebug: finalAdvanced.enableDebug,

    // State
    position: state.position,
    velocity: state.velocity,
    mousePosition: state.mousePosition,
    lastEscapeTime: state.lastEscapeTime,

    // Configurations
    movement: finalMovement,
    mouseInteraction: finalMouseInteraction,
    animation: finalAnimation,
    bounce: finalBounce,
    behavior: finalBehavior,

    // Callbacks
    callbacks: finalCallbacks,

    // State setters
    updatePosition: state.updatePosition,
    updateVelocity: state.updateVelocity,
    updateSpeed: state.updateSpeed,
    updateLastEscapeTime: state.updateLastEscapeTime,
    setSpinDuration: state.setSpinDurationState,
  });

  // Styles dynamiques
  const dynamicStyles = generateAnimationStyles(
    finalAnimation.enableRotation,
    state.spinDuration,
    finalVisual.enableHoverEffects,
    state.isHovered,
    finalVisual.hoverScale,
    finalVisual.transitionDuration,
    finalVisual.style
  );

  // Ne pas rendre l'image si src est vide, null ou undefined
  if (!src) return null;

  return (
    <img
      ref={wandererRef}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={finalVisual.className}
      style={dynamicStyles}
    />
  );
};

export default Wanderer;
