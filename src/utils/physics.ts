// Utilitaires pour les calculs physiques et mathématiques

export interface Vector2D {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

// Calcule la distance entre deux points
export const getDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// Génère un vecteur vitesse aléatoire
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

  // Si les changements aléatoires sont désactivés, utiliser la vitesse de base
  const finalSpeed = enableRandomSpeed
    ? baseSpeed + (Math.random() - 0.5) * 2 * speedVariation
    : baseSpeed;

  return {
    dx: Math.cos(angle) * finalSpeed,
    dy: Math.sin(angle) * finalSpeed,
  };
};

// Applique la gravité à une vélocité
export const applyGravity = (
  velocity: Velocity,
  gravityStrength: number
): Velocity => {
  return {
    dx: velocity.dx,
    dy: velocity.dy + gravityStrength,
  };
};

// Applique la friction à une vélocité
export const applyFriction = (
  velocity: Velocity,
  frictionCoefficient: number
): Velocity => {
  return {
    dx: velocity.dx * frictionCoefficient,
    dy: velocity.dy * frictionCoefficient,
  };
};

// Calcule l'angle entre deux points
export const getAngle = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.atan2(y2 - y1, x2 - x1);
};

// Calcule la vitesse d'échappement basée sur la distance
export const calculateEscapeSpeed = (
  baseSpeed: number,
  escapeSpeedMultiplier: number,
  distance: number,
  detectionDistance: number
): number => {
  const distanceFactor = Math.max(0.2, 1 - distance / detectionDistance);
  return Math.max(baseSpeed * escapeSpeedMultiplier + distanceFactor * 6, 5);
};
