import type { Velocity } from "./physics";
import { getRandomVelocity } from "./physics";

export interface MovementConfig {
  baseSpeed?: number;
  speedVariation?: number;
  speedChangeFrequency?: number;
  enableRandomSpeed?: boolean;
}

// Change la vitesse de base aléatoirement
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

// Vérifie si un changement de vitesse doit avoir lieu
export const shouldChangeSpeed = (speedChangeFrequency: number): boolean => {
  return Math.random() < speedChangeFrequency;
};

// Applique les effets physiques au mouvement
export const applyPhysics = (
  velocity: Velocity,
  enableGravity: boolean,
  gravityStrength: number,
  enableFriction: boolean,
  frictionCoefficient: number
): Velocity => {
  const newVelocity = { ...velocity };

  // Application de la gravité
  if (enableGravity) {
    newVelocity.dy += gravityStrength;
  }

  // Application de la friction
  if (enableFriction) {
    newVelocity.dx *= frictionCoefficient;
    newVelocity.dy *= frictionCoefficient;
  }

  return newVelocity;
};
