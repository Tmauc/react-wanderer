import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getRandomVelocity,
  applyGravity,
  applyFriction,
  getDistance,
  getAngle,
  calculateEscapeSpeed,
  type Velocity,
} from "../physics";

describe("Physics Utils", () => {
  beforeEach(() => {
    // Reset Math.random pour des tests déterministes
    vi.spyOn(Math, "random").mockReturnValue(0.5);
  });

  describe("getRandomVelocity", () => {
    it("should return velocity with correct base speed", () => {
      const velocity = getRandomVelocity(5, 2, 0, true);

      expect(velocity).toHaveProperty("dx");
      expect(velocity).toHaveProperty("dy");
      expect(typeof velocity.dx).toBe("number");
      expect(typeof velocity.dy).toBe("number");
    });

    it("should respect speed variation", () => {
      const baseSpeed = 5;
      const speedVariation = 2;
      const velocity = getRandomVelocity(baseSpeed, speedVariation, 0, true);

      const speed = Math.sqrt(velocity.dx ** 2 + velocity.dy ** 2);
      expect(speed).toBeGreaterThanOrEqual(baseSpeed - speedVariation);
      expect(speed).toBeLessThanOrEqual(baseSpeed + speedVariation);
    });

    it("should use provided angle when given", () => {
      const angle = Math.PI / 4; // 45 degrees
      const velocity = getRandomVelocity(5, 0, angle, false);

      const calculatedAngle = Math.atan2(velocity.dy, velocity.dx);
      expect(calculatedAngle).toBeCloseTo(angle, 1);
    });
  });

  describe("applyGravity", () => {
    it("should apply gravity to velocity", () => {
      const velocity: Velocity = { dx: 2, dy: 0 };
      const result = applyGravity(velocity, 0.5);

      expect(result.dy).toBeGreaterThan(velocity.dy);
      expect(result.dx).toBe(velocity.dx);
    });

    it("should handle zero gravity", () => {
      const velocity: Velocity = { dx: 3, dy: 4 };
      const result = applyGravity(velocity, 0);

      expect(result.dx).toBe(velocity.dx);
      expect(result.dy).toBe(velocity.dy);
    });
  });

  describe("applyFriction", () => {
    it("should apply friction to velocity", () => {
      const velocity: Velocity = { dx: 10, dy: 10 };
      const result = applyFriction(velocity, 0.8);

      expect(Math.abs(result.dx)).toBeLessThan(Math.abs(velocity.dx));
      expect(Math.abs(result.dy)).toBeLessThan(Math.abs(velocity.dy));
    });

    it("should handle zero friction", () => {
      const velocity: Velocity = { dx: 5, dy: 5 };
      const result = applyFriction(velocity, 0);

      expect(result.dx).toBe(0);
      expect(result.dy).toBe(0);
    });

    it("should handle full friction", () => {
      const velocity: Velocity = { dx: 3, dy: 4 };
      const result = applyFriction(velocity, 1);

      expect(result.dx).toBe(velocity.dx);
      expect(result.dy).toBe(velocity.dy);
    });
  });

  describe("getDistance", () => {
    it("should calculate correct distance between two points", () => {
      const distance = getDistance(0, 0, 3, 4);
      expect(distance).toBe(5); // 3-4-5 triangle
    });

    it("should return 0 for same points", () => {
      const distance = getDistance(5, 5, 5, 5);
      expect(distance).toBe(0);
    });

    it("should handle negative coordinates", () => {
      const distance = getDistance(-3, -4, 0, 0);
      expect(distance).toBe(5);
    });
  });

  describe("getAngle", () => {
    it("should calculate correct angle between two points", () => {
      const angle = getAngle(0, 0, 1, 1);
      expect(angle).toBeCloseTo(Math.PI / 4, 3); // 45 degrees
    });

    it("should handle vertical line", () => {
      const angle = getAngle(0, 0, 0, 5);
      expect(angle).toBeCloseTo(Math.PI / 2, 3); // 90 degrees
    });

    it("should handle horizontal line", () => {
      const angle = getAngle(0, 0, 5, 0);
      expect(angle).toBeCloseTo(0, 3); // 0 degrees
    });
  });

  describe("calculateEscapeSpeed", () => {
    it("should calculate higher speed when closer to detection distance", () => {
      const baseSpeed = 2;
      const escapeSpeedMultiplier = 3;
      const detectionDistance = 100;

      const closeDistance = 10;
      const farDistance = 80;

      const closeSpeed = calculateEscapeSpeed(
        baseSpeed,
        escapeSpeedMultiplier,
        closeDistance,
        detectionDistance
      );
      const farSpeed = calculateEscapeSpeed(
        baseSpeed,
        escapeSpeedMultiplier,
        farDistance,
        detectionDistance
      );

      expect(closeSpeed).toBeGreaterThan(farSpeed);
    });

    it("should respect minimum speed", () => {
      const baseSpeed = 1;
      const escapeSpeedMultiplier = 1;
      const distance = 50;
      const detectionDistance = 100;

      const speed = calculateEscapeSpeed(
        baseSpeed,
        escapeSpeedMultiplier,
        distance,
        detectionDistance
      );
      expect(speed).toBeGreaterThanOrEqual(5);
    });

    it("should handle distance at detection limit", () => {
      const baseSpeed = 2;
      const escapeSpeedMultiplier = 2;
      const distance = 100;
      const detectionDistance = 100;

      const speed = calculateEscapeSpeed(
        baseSpeed,
        escapeSpeedMultiplier,
        distance,
        detectionDistance
      );
      expect(speed).toBeGreaterThan(baseSpeed * escapeSpeedMultiplier);
    });
  });
});
