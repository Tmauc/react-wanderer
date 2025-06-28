import { useEffect } from "react";
import type { Velocity } from "../utils/physics";
import { getRandomVelocity } from "../utils/physics";
import { handleBoundaryCollision } from "../utils/boundary";
import { handleMouseCollision } from "../utils/mouseInteraction";
import { applyPhysics } from "../utils/movement";
import { changeSpeed, shouldChangeSpeed } from "../utils/movement";
import {
  shouldChangeSpinSpeed,
  getRandomSpinDuration,
} from "../utils/animation";

export interface AnimationConfig {
  parentRef: React.RefObject<HTMLElement | null>;
  wandererRef: React.RefObject<HTMLImageElement | null>;
  width: number;
  height: number;
  frameRate: number;
  enableDebug: boolean;

  // State
  position: { x: number; y: number };
  velocity: Velocity;
  mousePosition: { x: number; y: number };
  lastEscapeTime: number;

  // Configurations
  movement: {
    baseSpeed: number;
    speedVariation: number;
    speedChangeFrequency: number;
    enableRandomSpeed: boolean;
  };
  mouseInteraction: {
    enabled: boolean;
    detectionDistance: number;
    safetyZone: number;
    escapeSpeedMultiplier: number;
    escapeAngleVariation: number;
    throttleDelay: number;
  };
  animation: {
    enableRotation: boolean;
    rotationDurations: number[];
    rotationChangeFrequency: number;
    enableSpinVariation: boolean;
  };
  bounce: {
    enabled: boolean;
    bounceAngleVariation: number;
    enableRandomBounce: boolean;
  };
  behavior: {
    startPosition: "random" | "center" | { x: number; y: number };
    boundaryBehavior: "bounce" | "wrap" | "stop" | "reverse";
    enableGravity: boolean;
    gravityStrength: number;
    enableFriction: boolean;
    frictionCoefficient: number;
  };

  // Callbacks
  callbacks: {
    onCollision: (type: "wall" | "mouse" | "element") => void;
    onSpeedChange: (newSpeed: number) => void;
    onPositionChange: (x: number, y: number) => void;
    onAnimationComplete: () => void;
  };

  // State setters
  updatePosition: (x: number, y: number) => void;
  updateVelocity: (velocity: Velocity) => void;
  updateSpeed: (speed: number) => void;
  updateLastEscapeTime: (time: number) => void;
  setSpinDuration: (duration: number) => void;
}

export const useWandererAnimation = (config: AnimationConfig) => {
  useEffect(() => {
    const frameInterval = 1000 / config.frameRate;

    const move = () => {
      const parent = config.parentRef.current;
      const wanderer = config.wandererRef.current;

      if (!parent || !wanderer) return;

      const maxX = parent.clientWidth - config.width;
      const maxY = parent.clientHeight - config.height;

      let { x, y } = config.position;
      let { dx, dy } = config.velocity;

      // Application des effets physiques
      const physicsVelocity = applyPhysics(
        { dx, dy },
        config.behavior.enableGravity,
        config.behavior.gravityStrength,
        config.behavior.enableFriction,
        config.behavior.frictionCoefficient
      );

      dx = physicsVelocity.dx;
      dy = physicsVelocity.dy;

      x += dx;
      y += dy;

      // Gestion des bords
      const boundaryResult = handleBoundaryCollision(
        x,
        y,
        { dx, dy },
        maxX,
        maxY,
        config.behavior.boundaryBehavior,
        config.bounce.enabled
      );

      x = boundaryResult.position.x;
      y = boundaryResult.position.y;
      dx = boundaryResult.velocity.dx;
      dy = boundaryResult.velocity.dy;

      if (boundaryResult.rebounded) {
        config.callbacks.onCollision("wall");
      }

      // Gestion de la collision avec la souris
      const mouseResult = handleMouseCollision(
        x,
        y,
        config.mousePosition,
        { dx, dy },
        config.movement.baseSpeed,
        config.mouseInteraction,
        config.lastEscapeTime,
        config.callbacks.onCollision
      );

      dx = mouseResult.velocity.dx;
      dy = mouseResult.velocity.dy;
      config.updateLastEscapeTime(mouseResult.lastEscapeTime);

      // Si rebond avec rebonds aléatoires activés, recalcul de la direction
      if (boundaryResult.rebounded && config.bounce.enableRandomBounce) {
        const newVelocity = getRandomVelocity(
          config.movement.baseSpeed,
          config.movement.speedVariation,
          boundaryResult.angle,
          config.movement.enableRandomSpeed
        );
        dx = newVelocity.dx;
        dy = newVelocity.dy;
      }

      // Changements aléatoires
      if (shouldChangeSpeed(config.movement.speedChangeFrequency)) {
        const newVelocity = changeSpeed(
          { dx, dy },
          config.movement.baseSpeed,
          config.movement.speedVariation,
          config.movement.enableRandomSpeed,
          config.callbacks.onSpeedChange
        );
        dx = newVelocity.dx;
        dy = newVelocity.dy;
      }

      if (shouldChangeSpinSpeed(config.animation.rotationChangeFrequency)) {
        const newDuration = getRandomSpinDuration(
          config.animation.rotationDurations
        );
        config.setSpinDuration(newDuration);
      }

      // Mise à jour de l'état
      config.updatePosition(x, y);
      config.updateVelocity({ dx, dy });

      // Mise à jour du DOM
      wanderer.style.left = `${x}px`;
      wanderer.style.top = `${y}px`;

      config.callbacks.onPositionChange(x, y);

      if (config.enableDebug) {
        console.log(`Wanderer position: (${x.toFixed(2)}, ${y.toFixed(2)})`);
      }
    };

    const interval = setInterval(move, frameInterval);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.parentRef,
    config.wandererRef,
    config.width,
    config.height,
    config.frameRate,
    config.enableDebug,
    config.movement,
    config.mouseInteraction,
    config.animation,
    config.bounce,
    config.behavior,
    config.callbacks,
    config.position,
    config.velocity,
    config.mousePosition,
    config.lastEscapeTime,
    config.updatePosition,
    config.updateVelocity,
    config.updateSpeed,
    config.updateLastEscapeTime,
    config.setSpinDuration,
  ]);
};
