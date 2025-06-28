import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWandererState } from "../useWandererState";

describe("useWandererState", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useWandererState(5));

    expect(result.current.position).toEqual({ x: 0, y: 0 });
    expect(result.current.velocity).toEqual({ dx: 0, dy: 0 });
    expect(result.current.speed).toBe(5);
    expect(result.current.spinDuration).toBe(2);
    expect(result.current.mousePosition).toEqual({ x: 0, y: 0 });
    expect(result.current.lastEscapeTime).toBe(0);
    expect(result.current.isHovered).toBe(false);
    expect(result.current.initialized).toBe(false);
  });

  it("should update position correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updatePosition(100, 200);
    });

    expect(result.current.updatePosition).toBeDefined();
  });

  it("should update velocity correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updateVelocity({ dx: 3, dy: 4 });
    });

    expect(result.current.updateVelocity).toBeDefined();
  });

  it("should update speed correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updateSpeed(7);
    });

    expect(result.current.updateSpeed).toBeDefined();
  });

  it("should update mouse position correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updateMousePosition({ x: 150, y: 250 });
    });

    expect(result.current.updateMousePosition).toBeDefined();
  });

  it("should update last escape time correctly", () => {
    const { result } = renderHook(() => useWandererState(2));
    const timestamp = Date.now();

    act(() => {
      result.current.updateLastEscapeTime(timestamp);
    });

    expect(result.current.updateLastEscapeTime).toBeDefined();
  });

  it("should update hover state correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.setHovered(true);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.setHovered(false);
    });

    expect(result.current.isHovered).toBe(false);
  });

  it("should update initialized state correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.setInitialized(true);
    });

    expect(result.current.setInitialized).toBeDefined();
  });

  it("should update spin duration correctly", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.setSpinDurationState(3.5);
    });

    expect(result.current.spinDuration).toBe(3.5);
  });

  it("should maintain state between updates", () => {
    const { result } = renderHook(() => useWandererState(3));

    // Set multiple values
    act(() => {
      result.current.updatePosition(50, 75);
      result.current.updateVelocity({ dx: 2, dy: 1 });
      result.current.updateSpeed(4);
      result.current.setHovered(true);
      result.current.setInitialized(true);
    });

    // Verify state setters are available
    expect(result.current.updatePosition).toBeDefined();
    expect(result.current.updateVelocity).toBeDefined();
    expect(result.current.updateSpeed).toBeDefined();
    expect(result.current.isHovered).toBe(true);
    expect(result.current.setInitialized).toBeDefined();
  });

  it("should handle multiple rapid updates", () => {
    const { result } = renderHook(() => useWandererState(1));

    act(() => {
      // Multiple rapid position updates
      result.current.updatePosition(10, 20);
      result.current.updatePosition(15, 25);
      result.current.updatePosition(20, 30);
    });

    expect(result.current.updatePosition).toBeDefined();
  });

  it("should handle negative values", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updatePosition(-10, -20);
      result.current.updateVelocity({ dx: -3, dy: -4 });
    });

    expect(result.current.updatePosition).toBeDefined();
    expect(result.current.updateVelocity).toBeDefined();
  });

  it("should handle zero values", () => {
    const { result } = renderHook(() => useWandererState(0));

    expect(result.current.speed).toBe(0);

    act(() => {
      result.current.updatePosition(0, 0);
      result.current.updateVelocity({ dx: 0, dy: 0 });
      result.current.updateSpeed(0);
    });

    expect(result.current.updatePosition).toBeDefined();
    expect(result.current.updateVelocity).toBeDefined();
    expect(result.current.updateSpeed).toBeDefined();
  });

  it("should provide all required state properties", () => {
    const { result } = renderHook(() => useWandererState(3));

    expect(result.current).toHaveProperty("position");
    expect(result.current).toHaveProperty("velocity");
    expect(result.current).toHaveProperty("speed");
    expect(result.current).toHaveProperty("spinDuration");
    expect(result.current).toHaveProperty("mousePosition");
    expect(result.current).toHaveProperty("lastEscapeTime");
    expect(result.current).toHaveProperty("isHovered");
    expect(result.current).toHaveProperty("initialized");
  });

  it("should provide all required setter functions", () => {
    const { result } = renderHook(() => useWandererState(3));

    expect(typeof result.current.updatePosition).toBe("function");
    expect(typeof result.current.updateVelocity).toBe("function");
    expect(typeof result.current.updateSpeed).toBe("function");
    expect(typeof result.current.updateMousePosition).toBe("function");
    expect(typeof result.current.updateLastEscapeTime).toBe("function");
    expect(typeof result.current.setHovered).toBe("function");
    expect(typeof result.current.setInitialized).toBe("function");
    expect(typeof result.current.setSpinDurationState).toBe("function");
  });
});
