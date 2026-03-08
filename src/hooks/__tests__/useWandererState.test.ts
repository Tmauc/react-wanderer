import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWandererState } from "../useWandererState";

describe("useWandererState", () => {
  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useWandererState(5));

    expect(result.current.positionRef.current).toEqual({ x: 0, y: 0 });
    expect(result.current.velocityRef.current).toEqual({ dx: 0, dy: 0 });
    expect(result.current.speedRef.current).toBe(5);
    expect(result.current.spinDuration).toBe(2);
    expect(result.current.mousePositionRef.current).toEqual({ x: 0, y: 0 });
    expect(result.current.lastEscapeTimeRef.current).toBe(0);
    expect(result.current.isHovered).toBe(false);
    expect(result.current.initializedRef.current).toBe(false);
  });

  it("should mutate position ref when updatePosition is called", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updatePosition(100, 200);
    });

    expect(result.current.positionRef.current).toEqual({ x: 100, y: 200 });
  });

  it("should mutate velocity ref when updateVelocity is called", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updateVelocity({ dx: 3, dy: 4 });
    });

    expect(result.current.velocityRef.current).toEqual({ dx: 3, dy: 4 });
  });

  it("should mutate speed ref when updateSpeed is called", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updateSpeed(7);
    });

    expect(result.current.speedRef.current).toBe(7);
  });

  it("should mutate mouse position ref when updateMousePosition is called", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updateMousePosition({ x: 150, y: 250 });
    });

    expect(result.current.mousePositionRef.current).toEqual({ x: 150, y: 250 });
  });

  it("should mutate last escape time ref when updateLastEscapeTime is called", () => {
    const { result } = renderHook(() => useWandererState(2));
    const timestamp = Date.now();

    act(() => {
      result.current.updateLastEscapeTime(timestamp);
    });

    expect(result.current.lastEscapeTimeRef.current).toBe(timestamp);
  });

  it("should update hover state correctly (triggers re-render)", () => {
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

  it("should mutate initialized ref when setInitialized is called", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.setInitialized(true);
    });

    expect(result.current.initializedRef.current).toBe(true);
  });

  it("should update spin duration correctly (triggers re-render)", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.setSpinDurationState(3.5);
    });

    expect(result.current.spinDuration).toBe(3.5);
  });

  it("should maintain all refs after multiple updates", () => {
    const { result } = renderHook(() => useWandererState(3));

    act(() => {
      result.current.updatePosition(50, 75);
      result.current.updateVelocity({ dx: 2, dy: 1 });
      result.current.updateSpeed(4);
      result.current.setHovered(true);
      result.current.setInitialized(true);
    });

    expect(result.current.positionRef.current).toEqual({ x: 50, y: 75 });
    expect(result.current.velocityRef.current).toEqual({ dx: 2, dy: 1 });
    expect(result.current.speedRef.current).toBe(4);
    expect(result.current.isHovered).toBe(true);
    expect(result.current.initializedRef.current).toBe(true);
  });

  it("should handle multiple rapid position updates (last value wins)", () => {
    const { result } = renderHook(() => useWandererState(1));

    act(() => {
      result.current.updatePosition(10, 20);
      result.current.updatePosition(15, 25);
      result.current.updatePosition(20, 30);
    });

    expect(result.current.positionRef.current).toEqual({ x: 20, y: 30 });
  });

  it("should handle negative values", () => {
    const { result } = renderHook(() => useWandererState(2));

    act(() => {
      result.current.updatePosition(-10, -20);
      result.current.updateVelocity({ dx: -3, dy: -4 });
    });

    expect(result.current.positionRef.current).toEqual({ x: -10, y: -20 });
    expect(result.current.velocityRef.current).toEqual({ dx: -3, dy: -4 });
  });

  it("should handle zero values", () => {
    const { result } = renderHook(() => useWandererState(0));

    expect(result.current.speedRef.current).toBe(0);

    act(() => {
      result.current.updatePosition(0, 0);
      result.current.updateVelocity({ dx: 0, dy: 0 });
      result.current.updateSpeed(0);
    });

    expect(result.current.positionRef.current).toEqual({ x: 0, y: 0 });
    expect(result.current.velocityRef.current).toEqual({ dx: 0, dy: 0 });
    expect(result.current.speedRef.current).toBe(0);
  });

  it("should provide all required ref properties", () => {
    const { result } = renderHook(() => useWandererState(3));

    expect(result.current).toHaveProperty("positionRef");
    expect(result.current).toHaveProperty("velocityRef");
    expect(result.current).toHaveProperty("speedRef");
    expect(result.current).toHaveProperty("spinDuration");
    expect(result.current).toHaveProperty("mousePositionRef");
    expect(result.current).toHaveProperty("lastEscapeTimeRef");
    expect(result.current).toHaveProperty("isHovered");
    expect(result.current).toHaveProperty("initializedRef");
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

  it("should return stable setter function references across re-renders", () => {
    const { result, rerender } = renderHook(() => useWandererState(2));

    const firstUpdatePosition = result.current.updatePosition;
    const firstUpdateVelocity = result.current.updateVelocity;

    rerender();

    expect(result.current.updatePosition).toBe(firstUpdatePosition);
    expect(result.current.updateVelocity).toBe(firstUpdateVelocity);
  });

  it("should return stable ref objects across re-renders", () => {
    const { result, rerender } = renderHook(() => useWandererState(2));

    const firstPositionRef = result.current.positionRef;
    const firstVelocityRef = result.current.velocityRef;

    rerender();

    expect(result.current.positionRef).toBe(firstPositionRef);
    expect(result.current.velocityRef).toBe(firstVelocityRef);
  });
});
