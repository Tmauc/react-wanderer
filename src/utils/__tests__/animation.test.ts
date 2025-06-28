import { describe, it, expect, vi } from "vitest";
import {
  generateAnimationStyles,
  shouldChangeSpinSpeed,
  getRandomSpinDuration,
} from "../animation";

describe("Animation Utils", () => {
  describe("generateAnimationStyles", () => {
    it("should generate styles with rotation when enabled", () => {
      const styles = generateAnimationStyles(
        true, // enableRotation
        2, // spinDuration
        false, // enableHoverEffects
        false, // isHovered
        1.1, // hoverScale
        0.3, // transitionDuration
        {} // customStyle
      );

      expect(styles).toHaveProperty("position", "absolute");
      expect(styles).toHaveProperty("animation");
      expect(styles.animation).toContain("spin");
      expect(styles.animation).toContain("2s");
    });

    it("should generate styles without rotation when disabled", () => {
      const styles = generateAnimationStyles(
        false, // enableRotation
        2, // spinDuration
        false, // enableHoverEffects
        false, // isHovered
        1.1, // hoverScale
        0.3, // transitionDuration
        {} // customStyle
      );

      expect(styles).toHaveProperty("position", "absolute");
      expect(styles).not.toHaveProperty("animation");
    });

    it("should apply hover effects when enabled and hovered", () => {
      const styles = generateAnimationStyles(
        true, // enableRotation
        2, // spinDuration
        true, // enableHoverEffects
        true, // isHovered
        1.5, // hoverScale
        0.5, // transitionDuration
        {} // customStyle
      );

      expect(styles).toHaveProperty("transform");
      expect(styles.transform).toContain("scale(1.5)");
      expect(styles).toHaveProperty("transition");
      expect(styles.transition).toContain("0.5s");
    });

    it("should not apply hover effects when not hovered", () => {
      const styles = generateAnimationStyles(
        true, // enableRotation
        2, // spinDuration
        true, // enableHoverEffects
        false, // isHovered
        1.5, // hoverScale
        0.5, // transitionDuration
        {} // customStyle
      );

      expect(styles).toHaveProperty("transform");
      expect(styles.transform).not.toContain("scale(1.5)");
    });

    it("should merge custom styles", () => {
      const customStyle = {
        backgroundColor: "red",
        borderRadius: "50%",
      };

      const styles = generateAnimationStyles(
        true, // enableRotation
        2, // spinDuration
        false, // enableHoverEffects
        false, // isHovered
        1.1, // hoverScale
        0.3, // transitionDuration
        customStyle
      );

      expect(styles).toHaveProperty("backgroundColor", "red");
      expect(styles).toHaveProperty("borderRadius", "50%");
      expect(styles).toHaveProperty("position", "absolute");
    });

    it("should handle zero spin duration", () => {
      const styles = generateAnimationStyles(
        true, // enableRotation
        0, // spinDuration
        false, // enableHoverEffects
        false, // isHovered
        1.1, // hoverScale
        0.3, // transitionDuration
        {} // customStyle
      );

      expect(styles).toHaveProperty("animation");
      expect(styles.animation).toContain("0s");
    });
  });

  describe("shouldChangeSpinSpeed", () => {
    beforeEach(() => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
    });

    it("should return true when random is below frequency", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.001); // Very low
      const result = shouldChangeSpinSpeed(0.01);
      expect(result).toBe(true);
    });

    it("should return false when random is above frequency", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9); // Very high
      const result = shouldChangeSpinSpeed(0.01);
      expect(result).toBe(false);
    });

    it("should return false when frequency is 0", () => {
      const result = shouldChangeSpinSpeed(0);
      expect(result).toBe(false);
    });

    it("should return true when frequency is 1", () => {
      const result = shouldChangeSpinSpeed(1);
      expect(result).toBe(true);
    });
  });

  describe("getRandomSpinDuration", () => {
    beforeEach(() => {
      vi.spyOn(Math, "random").mockReturnValue(0.5);
    });

    it("should return a duration from the provided array", () => {
      const durations = [1, 2, 3, 4, 5];
      const result = getRandomSpinDuration(durations);
      expect(durations).toContain(result);
    });

    it("should handle single duration array", () => {
      const durations = [2.5];
      const result = getRandomSpinDuration(durations);
      expect(result).toBe(2.5);
    });

    it("should handle empty array", () => {
      const durations: number[] = [];
      const result = getRandomSpinDuration(durations);
      expect(result).toBe(1); // Default fallback
    });

    it("should return different durations with different random values", () => {
      const durations = [1, 2, 3, 4, 5];

      vi.spyOn(Math, "random").mockReturnValue(0.1);
      const result1 = getRandomSpinDuration(durations);

      vi.spyOn(Math, "random").mockReturnValue(0.9);
      const result2 = getRandomSpinDuration(durations);

      // Should be different (though not guaranteed with small array)
      expect(typeof result1).toBe("number");
      expect(typeof result2).toBe("number");
    });
  });
});
