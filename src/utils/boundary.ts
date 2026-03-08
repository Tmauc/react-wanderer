import type { Velocity, BoundaryResult } from "../types";

export type { BoundaryResult } from "../types";

// Handle boundary collision behavior
export const handleBoundaryCollision = (
  x: number,
  y: number,
  velocity: Velocity,
  maxX: number,
  maxY: number,
  boundaryBehavior: "bounce" | "wrap" | "stop" | "reverse",
  enableBounce: boolean
): BoundaryResult => {
  let newX = x;
  let newY = y;
  let newVelocity = { ...velocity };
  let rebounded = false;
  let angle: number | undefined;

  switch (boundaryBehavior) {
    case "bounce":
      if (enableBounce) {
        if (x <= 0 || x >= maxX) {
          rebounded = true;
          newX = Math.max(0, Math.min(maxX, x));
          newVelocity.dx = -newVelocity.dx;
          angle = Math.atan2(velocity.dy, -velocity.dx);
        }
        if (y <= 0 || y >= maxY) {
          rebounded = true;
          newY = Math.max(0, Math.min(maxY, y));
          newVelocity.dy = -newVelocity.dy;
          angle = Math.atan2(-velocity.dy, velocity.dx);
        }
      }
      break;

    case "wrap":
      if (x < 0) newX = maxX;
      if (x > maxX) newX = 0;
      if (y < 0) newY = maxY;
      if (y > maxY) newY = 0;
      break;

    case "stop":
      newX = Math.max(0, Math.min(maxX, x));
      newY = Math.max(0, Math.min(maxY, y));
      if (x <= 0 || x >= maxX || y <= 0 || y >= maxY) {
        newVelocity = { dx: 0, dy: 0 };
      }
      break;

    case "reverse":
      if (x <= 0 || x >= maxX) {
        newX = Math.max(0, Math.min(maxX, x));
        newVelocity.dx = -newVelocity.dx;
        rebounded = true;
      }
      if (y <= 0 || y >= maxY) {
        newY = Math.max(0, Math.min(maxY, y));
        newVelocity.dy = -newVelocity.dy;
        rebounded = true;
      }
      break;
  }

  return {
    position: { x: newX, y: newY },
    velocity: newVelocity,
    rebounded,
    angle,
  };
};

// Calculate start position based on configuration
export const calculateStartPosition = (
  startPosition: "random" | "center" | { x: number; y: number },
  parentWidth: number,
  parentHeight: number,
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } => {
  switch (startPosition) {
    case "center": {
      return {
        x: (parentWidth - elementWidth) / 2,
        y: (parentHeight - elementHeight) / 2,
      };
    }

    case "random": {
      const maxX = parentWidth - elementWidth;
      const maxY = parentHeight - elementHeight;
      return {
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      };
    }

    default:
      return startPosition;
  }
};
