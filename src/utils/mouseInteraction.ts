import type { Velocity, MouseInteractionConfig, MousePosition } from "../types";
import { getDistance, getAngle, calculateEscapeSpeed } from "./physics";

export type { MousePosition, MouseInteractionConfig } from "../types";

// Handle mouse collision and escape behavior
export const handleMouseCollision = (
  x: number,
  y: number,
  mousePosition: MousePosition,
  currentVelocity: Velocity,
  baseSpeed: number,
  config: Required<MouseInteractionConfig>,
  lastEscapeTime: number,
  onCollision: (type: "wall" | "mouse") => void
): { velocity: Velocity; lastEscapeTime: number } => {
  if (!config.enabled) {
    return { velocity: currentVelocity, lastEscapeTime };
  }

  const distance = getDistance(x, y, mousePosition.x, mousePosition.y);
  const currentTime = Date.now();

  // Safety zone: immediate strong escape
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

  // Normal detection zone with throttling
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

// Calculate mouse position relative to the container
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
