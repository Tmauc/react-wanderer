import type { Velocity } from "../types";

export type { Vector2D, Velocity } from "../types";

// Calculate Euclidean distance between two points
export const getDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// Generate a random velocity vector
export const getRandomVelocity = (
  baseSpeed: number,
  speedVariation: number,
  baseAngle?: number,
  enableRandomSpeed: boolean = true
): Velocity => {
  const angle =
    baseAngle !== undefined
      ? baseAngle + ((Math.random() - 0.5) * Math.PI) / 4
      : Math.random() * 2 * Math.PI;

  const finalSpeed = enableRandomSpeed
    ? baseSpeed + (Math.random() - 0.5) * 2 * speedVariation
    : baseSpeed;

  return {
    dx: Math.cos(angle) * finalSpeed,
    dy: Math.sin(angle) * finalSpeed,
  };
};

// Apply gravity to a velocity
export const applyGravity = (
  velocity: Velocity,
  gravityStrength: number
): Velocity => {
  return {
    dx: velocity.dx,
    dy: velocity.dy + gravityStrength,
  };
};

// Apply friction to a velocity
export const applyFriction = (
  velocity: Velocity,
  frictionCoefficient: number
): Velocity => {
  return {
    dx: velocity.dx * frictionCoefficient,
    dy: velocity.dy * frictionCoefficient,
  };
};

// Calculate angle between two points
export const getAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.atan2(y2 - y1, x2 - x1);
};

// Calculate escape speed based on distance to cursor
export const calculateEscapeSpeed = (
  baseSpeed: number,
  escapeSpeedMultiplier: number,
  distance: number,
  detectionDistance: number
): number => {
  const distanceFactor = Math.max(0.2, 1 - distance / detectionDistance);
  return Math.max(baseSpeed * escapeSpeedMultiplier + distanceFactor * 6, 5);
};
