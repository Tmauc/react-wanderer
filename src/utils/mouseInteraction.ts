import type { Velocity } from "./physics";
import { getDistance, getAngle, calculateEscapeSpeed } from "./physics";

export interface MouseInteractionConfig {
  enabled?: boolean;
  detectionDistance?: number;
  safetyZone?: number;
  escapeSpeedMultiplier?: number;
  escapeAngleVariation?: number;
  throttleDelay?: number;
}

export interface MousePosition {
  x: number;
  y: number;
}

// Gère la collision avec la souris
export const handleMouseCollision = (
  x: number,
  y: number,
  mousePosition: MousePosition,
  currentVelocity: Velocity,
  baseSpeed: number,
  config: Required<MouseInteractionConfig>,
  lastEscapeTime: number,
  onCollision: (type: "wall" | "mouse" | "element") => void
): { velocity: Velocity; lastEscapeTime: number } => {
  if (!config.enabled) {
    return { velocity: currentVelocity, lastEscapeTime };
  }

  const distance = getDistance(x, y, mousePosition.x, mousePosition.y);
  const currentTime = Date.now();

  // Zone de sécurité
  if (distance < config.safetyZone) {
    const angle = getAngle(mousePosition.x, mousePosition.y, x, y);
    const escapeSpeed = baseSpeed * config.escapeSpeedMultiplier * 2;
    const randomAngle = angle + ((Math.random() - 0.5) * Math.PI) / 2;

    onCollision("mouse");
    return {
      velocity: {
        dx: Math.cos(randomAngle) * escapeSpeed,
        dy: Math.sin(randomAngle) * escapeSpeed,
      },
      lastEscapeTime: currentTime,
    };
  }

  // Zone de collision normale
  if (distance < config.detectionDistance) {
    if (currentTime - lastEscapeTime < config.throttleDelay) {
      return { velocity: currentVelocity, lastEscapeTime };
    }

    const angle = getAngle(mousePosition.x, mousePosition.y, x, y);
    const escapeSpeed = calculateEscapeSpeed(
      baseSpeed,
      config.escapeSpeedMultiplier,
      distance,
      config.detectionDistance
    );
    const randomAngle =
      angle + (Math.random() - 0.5) * config.escapeAngleVariation;

    onCollision("mouse");
    return {
      velocity: {
        dx: Math.cos(randomAngle) * escapeSpeed,
        dy: Math.sin(randomAngle) * escapeSpeed,
      },
      lastEscapeTime: currentTime,
    };
  }

  return { velocity: currentVelocity, lastEscapeTime };
};

// Calcule la position de la souris relative au conteneur
export const calculateMousePosition = (
  event: MouseEvent,
  parentElement: HTMLElement
): MousePosition => {
  const rect = parentElement.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};
