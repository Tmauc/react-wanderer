import { useEffect, useRef } from "react";
import type { Velocity, MovementConfig, MouseInteractionConfig, AnimationConfig, BounceConfig, BehaviorConfig, Callbacks } from "../types";
import { getRandomVelocity } from "../utils/physics";
import { handleBoundaryCollision } from "../utils/boundary";
import { handleMouseCollision } from "../utils/mouseInteraction";
import { applyPhysics } from "../utils/movement";
import { changeSpeed, shouldChangeSpeed } from "../utils/movement";
import {
  shouldChangeSpinSpeed,
  getRandomSpinDuration,
} from "../utils/animation";

export interface AnimationHookConfig {
  parentRef: React.RefObject<HTMLElement | null>;
  wandererRef: React.RefObject<HTMLImageElement | null>;
  width: number;
  height: number;
  frameRate: number;
  enableDebug: boolean;
  enablePerformanceMode: boolean;

  // Refs (read directly in animation loop, no re-render needed)
  positionRef: React.RefObject<{ x: number; y: number }>;
  velocityRef: React.RefObject<Velocity>;
  mousePositionRef: React.RefObject<{ x: number; y: number }>;
  lastEscapeTimeRef: React.RefObject<number>;

  // Configuration objects
  movement: Required<MovementConfig>;
  mouseInteraction: Required<MouseInteractionConfig>;
  animation: Required<AnimationConfig>;
  bounce: Required<BounceConfig>;
  behavior: Required<BehaviorConfig>;

  // Callbacks
  callbacks: Required<Callbacks>;

  // State setters
  updatePosition: (x: number, y: number) => void;
  updateVelocity: (velocity: Velocity) => void;
  updateSpeed: (speed: number) => void;
  updateLastEscapeTime: (time: number) => void;
  setSpinDuration: (duration: number) => void;
}

export const useWandererAnimation = (config: AnimationHookConfig) => {
  // Store config in a ref so the RAF callback always reads the latest values
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const frameInterval = 1000 / config.frameRate;
    let lastFrameTime = 0;
    let rafId: number;
    let frameSkipCounter = 0;

    const tick = (timestamp: number) => {
      rafId = requestAnimationFrame(tick);

      // Throttle to configured frame rate
      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;

      const cfg = configRef.current;
      const parent = cfg.parentRef.current;
      const wanderer = cfg.wandererRef.current;
      if (!parent || !wanderer) return;

      // Performance mode: skip every other frame
      if (cfg.enablePerformanceMode) {
        frameSkipCounter++;
        if (frameSkipCounter % 2 !== 0) return;
      }

      const maxX = parent.clientWidth - cfg.width;
      const maxY = parent.clientHeight - cfg.height;

      let { x, y } = cfg.positionRef.current;
      let { dx, dy } = cfg.velocityRef.current;

      // Apply physics (gravity, friction)
      const physicsVelocity = applyPhysics(
        { dx, dy },
        cfg.behavior.enableGravity,
        cfg.behavior.gravityStrength,
        cfg.behavior.enableFriction,
        cfg.behavior.frictionCoefficient
      );

      dx = physicsVelocity.dx;
      dy = physicsVelocity.dy;

      x += dx;
      y += dy;

      // Boundary collision handling
      const boundaryResult = handleBoundaryCollision(
        x,
        y,
        { dx, dy },
        maxX,
        maxY,
        cfg.behavior.boundaryBehavior,
        cfg.bounce.enabled
      );

      x = boundaryResult.position.x;
      y = boundaryResult.position.y;
      dx = boundaryResult.velocity.dx;
      dy = boundaryResult.velocity.dy;

      if (boundaryResult.rebounded) {
        cfg.callbacks.onCollision("wall");
      }

      // Mouse collision handling
      const mouseResult = handleMouseCollision(
        x,
        y,
        cfg.mousePositionRef.current,
        { dx, dy },
        cfg.movement.baseSpeed,
        cfg.mouseInteraction,
        cfg.lastEscapeTimeRef.current,
        cfg.callbacks.onCollision
      );

      dx = mouseResult.velocity.dx;
      dy = mouseResult.velocity.dy;
      cfg.updateLastEscapeTime(mouseResult.lastEscapeTime);

      // Random bounce on wall collision
      if (boundaryResult.rebounded && cfg.bounce.enableRandomBounce) {
        const newVelocity = getRandomVelocity(
          cfg.movement.baseSpeed,
          cfg.movement.speedVariation,
          boundaryResult.angle,
          cfg.movement.enableRandomSpeed
        );
        dx = newVelocity.dx;
        dy = newVelocity.dy;
      }

      // Random speed changes
      if (shouldChangeSpeed(cfg.movement.speedChangeFrequency)) {
        const newVelocity = changeSpeed(
          { dx, dy },
          cfg.movement.baseSpeed,
          cfg.movement.speedVariation,
          cfg.movement.enableRandomSpeed,
          cfg.callbacks.onSpeedChange
        );
        dx = newVelocity.dx;
        dy = newVelocity.dy;
      }

      // Random spin speed changes
      if (shouldChangeSpinSpeed(cfg.animation.rotationChangeFrequency)) {
        const newDuration = getRandomSpinDuration(
          cfg.animation.rotationDurations
        );
        cfg.setSpinDuration(newDuration);
      }

      // Update state refs
      cfg.updatePosition(x, y);
      cfg.updateVelocity({ dx, dy });

      // Update DOM directly (no React re-render)
      wanderer.style.left = `${x}px`;
      wanderer.style.top = `${y}px`;

      cfg.callbacks.onPositionChange(x, y);

      if (cfg.enableDebug) {
        console.log(`Wanderer position: (${x.toFixed(2)}, ${y.toFixed(2)})`);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [config.frameRate]);
};
