import { useEffect, useRef } from "react";
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

type RefObj<T> = { current: T };

export interface AnimationConfig {
  parentRef: React.RefObject<HTMLElement | null>;
  wandererRef: React.RefObject<HTMLImageElement | null>;
  width: number;
  height: number;
  frameRate: number;
  enableDebug: boolean;

  // Refs d'état vivant (lues/écrites à chaque frame, indépendamment du render React)
  positionRef: RefObj<{ x: number; y: number }>;
  velocityRef: RefObj<Velocity>;
  mousePositionRef: RefObj<{ x: number; y: number }>;
  lastEscapeTimeRef: RefObj<number>;

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
  // La config est recréée à chaque render (objets fusionnés, callbacks...). On la
  // garde dans une ref pour que la boucle lise toujours la dernière version sans
  // avoir à se reconstruire — donc des deps stables et un seul setInterval.
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const frameInterval = 1000 / config.frameRate;

    const move = () => {
      const cfg = configRef.current;
      const parent = cfg.parentRef.current;
      const wanderer = cfg.wandererRef.current;

      if (!parent || !wanderer) return;

      const maxX = parent.clientWidth - cfg.width;
      const maxY = parent.clientHeight - cfg.height;

      // Lecture de la position/vélocité VIVANTES (pas un snapshot de render).
      let { x, y } = cfg.positionRef.current;
      let { dx, dy } = cfg.velocityRef.current;

      // Application des effets physiques
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

      // Gestion des bords
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

      // Gestion de la collision avec la souris
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

      // Si rebond avec rebonds aléatoires activés, recalcul de la direction
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

      // Changements aléatoires
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

      if (shouldChangeSpinSpeed(cfg.animation.rotationChangeFrequency)) {
        const newDuration = getRandomSpinDuration(
          cfg.animation.rotationDurations
        );
        cfg.setSpinDuration(newDuration);
      }

      // Mise à jour de l'état vivant
      cfg.updatePosition(x, y);
      cfg.updateVelocity({ dx, dy });

      // Mise à jour du DOM (impérative, hors cycle de render)
      wanderer.style.left = `${x}px`;
      wanderer.style.top = `${y}px`;

      cfg.callbacks.onPositionChange(x, y);

      if (cfg.enableDebug) {
        console.log(`Wanderer position: (${x.toFixed(2)}, ${y.toFixed(2)})`);
      }
    };

    const interval = setInterval(move, frameInterval);
    return () => clearInterval(interval);
    // Deps stables : refs (identité figée) + frameRate (primitive). La boucle vit
    // une seule fois et lit la config courante via configRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.parentRef, config.wandererRef, config.frameRate]);
};
