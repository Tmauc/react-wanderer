import { describe, it, expect } from "vitest";
import { handleBoundaryCollision } from "../boundary";

describe("Boundary Utils", () => {
  describe("handleBoundaryCollision", () => {
    const maxX = 100;
    const maxY = 100;

    describe("bounce behavior", () => {
      it("should bounce off left wall", () => {
        const result = handleBoundaryCollision(
          -5,
          50, // position outside left
          { dx: -2, dy: 0 }, // velocity moving left
          maxX,
          maxY,
          "bounce",
          true
        );

        expect(result.position.x).toBe(0);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBeGreaterThan(0); // should reverse
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(true);
      });

      it("should bounce off right wall", () => {
        const result = handleBoundaryCollision(
          105,
          50, // position outside right
          { dx: 2, dy: 0 }, // velocity moving right
          maxX,
          maxY,
          "bounce",
          true
        );

        expect(result.position.x).toBe(maxX);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBeLessThan(0); // should reverse
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(true);
      });

      it("should bounce off top wall", () => {
        const result = handleBoundaryCollision(
          50,
          -5, // position outside top
          { dx: 0, dy: -2 }, // velocity moving up
          maxX,
          maxY,
          "bounce",
          true
        );

        expect(result.position.x).toBe(50);
        expect(result.position.y).toBe(0);
        expect(result.velocity.dx).toBe(0);
        expect(result.velocity.dy).toBeGreaterThan(0); // should reverse
        expect(result.rebounded).toBe(true);
      });

      it("should bounce off bottom wall", () => {
        const result = handleBoundaryCollision(
          50,
          105, // position outside bottom
          { dx: 0, dy: 2 }, // velocity moving down
          maxX,
          maxY,
          "bounce",
          true
        );

        expect(result.position.x).toBe(50);
        expect(result.position.y).toBe(maxY);
        expect(result.velocity.dx).toBe(0);
        expect(result.velocity.dy).toBeLessThan(0); // should reverse
        expect(result.rebounded).toBe(true);
      });

      it("should not bounce when inside boundaries", () => {
        const result = handleBoundaryCollision(
          50,
          50, // position inside
          { dx: 2, dy: 1 }, // velocity
          maxX,
          maxY,
          "bounce",
          true
        );

        expect(result.position.x).toBe(50);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(2);
        expect(result.velocity.dy).toBe(1);
        expect(result.rebounded).toBe(false);
      });
    });

    describe("wrap behavior", () => {
      it("should wrap from left to right", () => {
        const result = handleBoundaryCollision(
          -5,
          50, // position outside left
          { dx: -2, dy: 0 }, // velocity moving left
          maxX,
          maxY,
          "wrap",
          false
        );

        expect(result.position.x).toBe(maxX);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(-2); // velocity unchanged
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(false);
      });

      it("should wrap from right to left", () => {
        const result = handleBoundaryCollision(
          105,
          50, // position outside right
          { dx: 2, dy: 0 }, // velocity moving right
          maxX,
          maxY,
          "wrap",
          false
        );

        expect(result.position.x).toBe(0);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(2); // velocity unchanged
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(false);
      });

      it("should wrap from top to bottom", () => {
        const result = handleBoundaryCollision(
          50,
          -5, // position outside top
          { dx: 0, dy: -2 }, // velocity moving up
          maxX,
          maxY,
          "wrap",
          false
        );

        expect(result.position.x).toBe(50);
        expect(result.position.y).toBe(maxY);
        expect(result.velocity.dx).toBe(0);
        expect(result.velocity.dy).toBe(-2); // velocity unchanged
        expect(result.rebounded).toBe(false);
      });

      it("should wrap from bottom to top", () => {
        const result = handleBoundaryCollision(
          50,
          105, // position outside bottom
          { dx: 0, dy: 2 }, // velocity moving down
          maxX,
          maxY,
          "wrap",
          false
        );

        expect(result.position.x).toBe(50);
        expect(result.position.y).toBe(0);
        expect(result.velocity.dx).toBe(0);
        expect(result.velocity.dy).toBe(2); // velocity unchanged
        expect(result.rebounded).toBe(false);
      });
    });

    describe("stop behavior", () => {
      it("should stop at left wall", () => {
        const result = handleBoundaryCollision(
          -5,
          50, // position outside left
          { dx: -2, dy: 0 }, // velocity moving left
          maxX,
          maxY,
          "stop",
          false
        );

        expect(result.position.x).toBe(0);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(0); // stopped
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(false);
      });

      it("should stop at right wall", () => {
        const result = handleBoundaryCollision(
          105,
          50, // position outside right
          { dx: 2, dy: 0 }, // velocity moving right
          maxX,
          maxY,
          "stop",
          false
        );

        expect(result.position.x).toBe(maxX);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(0); // stopped
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(false);
      });
    });

    describe("reverse behavior", () => {
      it("should reverse direction at left wall", () => {
        const result = handleBoundaryCollision(
          -5,
          50, // position outside left
          { dx: -2, dy: 0 }, // velocity moving left
          maxX,
          maxY,
          "reverse",
          false
        );

        expect(result.position.x).toBe(0);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(2); // reversed
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(true);
      });

      it("should reverse direction at right wall", () => {
        const result = handleBoundaryCollision(
          105,
          50, // position outside right
          { dx: 2, dy: 0 }, // velocity moving right
          maxX,
          maxY,
          "reverse",
          false
        );

        expect(result.position.x).toBe(maxX);
        expect(result.position.y).toBe(50);
        expect(result.velocity.dx).toBe(-2); // reversed
        expect(result.velocity.dy).toBe(0);
        expect(result.rebounded).toBe(true);
      });
    });

    it("should handle corner cases", () => {
      const result = handleBoundaryCollision(
        -5,
        -5, // position outside top-left corner
        { dx: -2, dy: -2 }, // velocity moving up-left
        maxX,
        maxY,
        "bounce",
        true
      );

      expect(result.position.x).toBe(0);
      expect(result.position.y).toBe(0);
      expect(result.velocity.dx).toBeGreaterThan(0); // should reverse
      expect(result.velocity.dy).toBeGreaterThan(0); // should reverse
      expect(result.rebounded).toBe(true);
    });
  });
});
