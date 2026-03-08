import React, { useRef } from "react";
import type { WandererProps } from "../types";
import { generateAnimationStyles, injectSpinKeyframe } from "../utils/animation";
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
import { useWandererState } from "../hooks/useWandererState";
import { useWandererInitialization } from "../hooks/useWandererInitialization";
import { useWandererEvents } from "../hooks/useWandererEvents";
import { useWandererAnimation } from "../hooks/useWandererAnimation";

// Re-export types for backward compatibility
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
} from "../types";

// Inject the spin keyframe CSS once when the module loads
injectSpinKeyframe();

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
  // Validate critical props
  const safeWidth = Math.max(0, width || 0);
  const safeHeight = Math.max(0, height || 0);

  // Merge with defaults
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

  const wandererRef = useRef<HTMLImageElement>(null);

  const state = useWandererState(finalMovement.baseSpeed);

  useWandererInitialization({
    parentRef,
    wandererRef,
    width: safeWidth,
    height: safeHeight,
    startPosition: finalBehavior.startPosition,
    baseSpeed: finalMovement.baseSpeed,
    speedVariation: finalMovement.speedVariation,
    enableRandomSpeed: finalMovement.enableRandomSpeed,
    initializedRef: state.initializedRef,
    updatePosition: state.updatePosition,
    updateVelocity: state.updateVelocity,
    setInitialized: state.setInitialized,
  });

  useWandererEvents({
    parentRef,
    mouseInteractionEnabled: finalMouseInteraction.enabled,
    hoverEffectsEnabled: finalVisual.enableHoverEffects,
    updateMousePosition: state.updateMousePosition,
    setHovered: state.setHovered,
  });

  useWandererAnimation({
    parentRef,
    wandererRef,
    width: safeWidth,
    height: safeHeight,
    frameRate: finalAdvanced.animationFrameRate,
    enableDebug: finalAdvanced.enableDebug,
    enablePerformanceMode: finalAdvanced.enablePerformanceMode,

    positionRef: state.positionRef,
    velocityRef: state.velocityRef,
    mousePositionRef: state.mousePositionRef,
    lastEscapeTimeRef: state.lastEscapeTimeRef,

    movement: finalMovement,
    mouseInteraction: finalMouseInteraction,
    animation: finalAnimation,
    bounce: finalBounce,
    behavior: finalBehavior,

    callbacks: finalCallbacks,

    updatePosition: state.updatePosition,
    updateVelocity: state.updateVelocity,
    updateSpeed: state.updateSpeed,
    updateLastEscapeTime: state.updateLastEscapeTime,
    setSpinDuration: state.setSpinDurationState,
  });

  const dynamicStyles = generateAnimationStyles(
    finalAnimation.enableRotation,
    state.spinDuration,
    finalVisual.enableHoverEffects,
    state.isHovered,
    finalVisual.hoverScale,
    finalVisual.transitionDuration,
    finalVisual.style
  );

  if (!src) return null;

  return (
    <img
      ref={wandererRef}
      src={src}
      alt={alt}
      width={safeWidth}
      height={safeHeight}
      className={finalVisual.className}
      style={dynamicStyles}
    />
  );
};

export default React.memo(Wanderer);
