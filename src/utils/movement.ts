import type { Velocity } from "../types";
import { getRandomVelocity } from "./physics";

// Randomly change speed magnitude and direction
export const changeSpeed = (
  currentVelocity: Velocity,
  baseSpeed: number,
  speedVariation: number,
  enableRandomSpeed: boolean,
  onSpeedChange: (newSpeed: number) => void
): Velocity => {
  if (!enableRandomSpeed) return currentVelocity;

  const newSpeed = baseSpeed * (0.8 + Math.random() * 2.4);
  onSpeedChange(newSpeed);

  const currentAngle = Math.atan2(currentVelocity.dy, currentVelocity.dx);
  return getRandomVelocity(
    newSpeed,
    speedVariation,
    currentAngle,
    enableRandomSpeed
  );
};

// Check if a speed change should occur (probabilistic)
export const shouldChangeSpeed = (speedChangeFrequency: number): boolean => {
  return Math.random() < speedChangeFrequency;
};

// Apply physics effects (gravity + friction) to velocity
export const applyPhysics = (
  velocity: Velocity,
  enableGravity: boolean,
  gravityStrength: number,
  enableFriction: boolean,
  frictionCoefficient: number
): Velocity => {
  const newVelocity = { ...velocity };

  if (enableGravity) {
    newVelocity.dy += gravityStrength;
  }

  if (enableFriction) {
    newVelocity.dx *= frictionCoefficient;
    newVelocity.dy *= frictionCoefficient;
  }

  return newVelocity;
};
