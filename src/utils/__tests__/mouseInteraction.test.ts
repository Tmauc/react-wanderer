import { describe, it, expect, vi } from "vitest";
import {
  handleMouseCollision,
  type MouseInteractionConfig,
} from "../mouseInteraction";

describe("Mouse Interaction Utils", () => {
  describe("handleMouseCollision", () => {
    const baseSpeed = 2;
    const mouseInteraction: Required<MouseInteractionConfig> = {
      enabled: true,
      detectionDistance: 60,
      safetyZone: 30,
      escapeSpeedMultiplier: 2,
      escapeAngleVariation: Math.PI / 3,
      throttleDelay: 100,
    };

    beforeEach(() => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
    });

    it("should not trigger escape when mouse is far away", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 200, y: 200 }; // Far away
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      expect(result.velocity.dx).toBe(velocity.dx);
      expect(result.velocity.dy).toBe(velocity.dy);
      expect(result.lastEscapeTime).toBe(lastEscapeTime);
      expect(onCollision).not.toHaveBeenCalled();
    });

    it("should trigger escape when mouse is within detection distance", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 130, y: 100 }; // Within detection distance
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      expect(result.velocity.dx).not.toBe(velocity.dx);
      expect(result.velocity.dy).not.toBe(velocity.dy);
      expect(result.lastEscapeTime).toBeGreaterThan(lastEscapeTime);
      expect(onCollision).toHaveBeenCalledWith("mouse");
    });

    it("should respect throttle delay", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 130, y: 100 };
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = Date.now() - 50; // Recent escape
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      expect(result.velocity.dx).toBe(velocity.dx);
      expect(result.velocity.dy).toBe(velocity.dy);
      expect(result.lastEscapeTime).toBe(lastEscapeTime);
      expect(onCollision).not.toHaveBeenCalled();
    });

    it("should calculate escape direction away from mouse", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 130, y: 100 }; // Mouse to the right
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      // Should move left (away from mouse)
      expect(result.velocity.dx).toBeLessThan(0);
    });

    it("should apply escape speed multiplier", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 130, y: 100 };
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      const originalSpeed = Math.sqrt(velocity.dx ** 2 + velocity.dy ** 2);
      const escapeSpeed = Math.sqrt(
        result.velocity.dx ** 2 + result.velocity.dy ** 2
      );

      expect(escapeSpeed).toBeGreaterThan(originalSpeed);
    });

    it("should not trigger escape when mouse interaction is disabled", () => {
      const disabledConfig: Required<MouseInteractionConfig> = {
        ...mouseInteraction,
        enabled: false,
      };

      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 130, y: 100 }; // Within detection distance
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        disabledConfig,
        lastEscapeTime,
        onCollision
      );

      expect(result.velocity.dx).toBe(velocity.dx);
      expect(result.velocity.dy).toBe(velocity.dy);
      expect(result.lastEscapeTime).toBe(lastEscapeTime);
      expect(onCollision).not.toHaveBeenCalled();
    });

    it("should handle mouse at exact detection distance", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 159, y: 100 }; // Just below detection distance (60px)
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      expect(result.velocity.dx).not.toBe(velocity.dx);
      expect(result.velocity.dy).not.toBe(velocity.dy);
      expect(onCollision).toHaveBeenCalledWith("mouse");
    });

    it("should handle mouse very close to wanderer", () => {
      const wandererX = 100;
      const wandererY = 100;
      const mousePosition = { x: 105, y: 100 }; // Very close
      const velocity = { dx: 1, dy: 1 };
      const lastEscapeTime = 0;
      const onCollision = vi.fn();

      const result = handleMouseCollision(
        wandererX,
        wandererY,
        mousePosition,
        velocity,
        baseSpeed,
        mouseInteraction,
        lastEscapeTime,
        onCollision
      );

      expect(result.velocity.dx).not.toBe(velocity.dx);
      expect(result.velocity.dy).not.toBe(velocity.dy);
      expect(onCollision).toHaveBeenCalledWith("mouse");
    });
  });
});
