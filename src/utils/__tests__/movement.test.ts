import { describe, it, expect, vi } from "vitest";
import { changeSpeed, shouldChangeSpeed, applyPhysics } from "../movement";
import type { Velocity } from "../physics";

describe("Movement Utils", () => {
  describe("changeSpeed", () => {
    beforeEach(() => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
    });

    it("should return current velocity if random speed is disabled", () => {
      const velocity: Velocity = { dx: 2, dy: 2 };
      const onSpeedChange = vi.fn();
      const result = changeSpeed(velocity, 2, 0, false, onSpeedChange);
      expect(result).toBe(velocity);
      expect(onSpeedChange).not.toHaveBeenCalled();
    });

    it("should call onSpeedChange and return new velocity if enabled", () => {
      const velocity: Velocity = { dx: 2, dy: 0 };
      const onSpeedChange = vi.fn();
      const result = changeSpeed(velocity, 2, 1, true, onSpeedChange);
      expect(result).not.toBe(velocity);
      expect(onSpeedChange).toHaveBeenCalled();
      // The new speed should be in the expected range
      const newSpeed = onSpeedChange.mock.calls[0][0];
      expect(newSpeed).toBeGreaterThanOrEqual(2 * 0.8);
      expect(newSpeed).toBeLessThanOrEqual(2 * 3.2);
    });
  });

  describe("shouldChangeSpeed", () => {
    it("should return true if random < frequency", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.01);
      expect(shouldChangeSpeed(0.05)).toBe(true);
    });
    it("should return false if random >= frequency", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
      expect(shouldChangeSpeed(0.05)).toBe(false);
    });
  });

  describe("applyPhysics", () => {
    it("should apply gravity if enabled", () => {
      const velocity: Velocity = { dx: 1, dy: 1 };
      const result = applyPhysics(velocity, true, 0.5, false, 1);
      expect(result.dy).toBeCloseTo(1.5);
      expect(result.dx).toBe(1);
    });
    it("should apply friction if enabled", () => {
      const velocity: Velocity = { dx: 2, dy: 2 };
      const result = applyPhysics(velocity, false, 0, true, 0.5);
      expect(result.dx).toBeCloseTo(1);
      expect(result.dy).toBeCloseTo(1);
    });
    it("should apply both gravity and friction", () => {
      const velocity: Velocity = { dx: 2, dy: 2 };
      const result = applyPhysics(velocity, true, 1, true, 0.5);
      // gravity first, then friction
      expect(result.dx).toBeCloseTo(1);
      expect(result.dy).toBeCloseTo(1.5);
    });
    it("should return unchanged velocity if both disabled", () => {
      const velocity: Velocity = { dx: 3, dy: 4 };
      const result = applyPhysics(velocity, false, 0, false, 1);
      expect(result.dx).toBe(3);
      expect(result.dy).toBe(4);
    });
  });
});
