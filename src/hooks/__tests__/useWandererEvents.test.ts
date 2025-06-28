import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWandererEvents } from "../useWandererEvents";

describe("useWandererEvents", () => {
  let mockParent: HTMLElement;
  let mockParentRef: React.RefObject<HTMLElement>;

  beforeEach(() => {
    // Mock du DOM element
    mockParent = document.createElement("div");
    mockParentRef = { current: mockParent };

    // Mock de getBoundingClientRect
    mockParent.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 0,
          top: 0,
          width: 100,
          height: 100,
          right: 100,
          bottom: 100,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect)
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not add event listeners when parent ref is null", () => {
    const nullRef = { current: null };
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: nullRef,
      mouseInteractionEnabled: true,
      hoverEffectsEnabled: true,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Should not throw and should not add event listeners
    expect(mockUpdateMousePosition).not.toHaveBeenCalled();
    expect(mockSetHovered).not.toHaveBeenCalled();
  });

  it("should add mousemove listener when mouse interaction is enabled", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: true,
      hoverEffectsEnabled: false,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate mousemove event
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: 50,
      clientY: 75,
    });

    mockParent.dispatchEvent(mouseEvent);

    expect(mockUpdateMousePosition).toHaveBeenCalledWith({ x: 50, y: 75 });
  });

  it("should not add mousemove listener when mouse interaction is disabled", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: false,
      hoverEffectsEnabled: false,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate mousemove event
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: 50,
      clientY: 75,
    });

    mockParent.dispatchEvent(mouseEvent);

    expect(mockUpdateMousePosition).not.toHaveBeenCalled();
  });

  it("should add mouseenter listener when hover effects are enabled", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: false,
      hoverEffectsEnabled: true,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate mouseenter event
    const mouseEnterEvent = new MouseEvent("mouseenter");
    mockParent.dispatchEvent(mouseEnterEvent);

    expect(mockSetHovered).toHaveBeenCalledWith(true);
  });

  it("should add mouseleave listener when hover effects are enabled", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: false,
      hoverEffectsEnabled: true,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate mouseleave event
    const mouseLeaveEvent = new MouseEvent("mouseleave");
    mockParent.dispatchEvent(mouseLeaveEvent);

    expect(mockSetHovered).toHaveBeenCalledWith(false);
  });

  it("should not add hover listeners when hover effects are disabled", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: false,
      hoverEffectsEnabled: false,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate hover events
    const mouseEnterEvent = new MouseEvent("mouseenter");
    const mouseLeaveEvent = new MouseEvent("mouseleave");

    mockParent.dispatchEvent(mouseEnterEvent);
    mockParent.dispatchEvent(mouseLeaveEvent);

    expect(mockSetHovered).not.toHaveBeenCalled();
  });

  it("should handle mouse position calculation correctly with offset", () => {
    // Mock getBoundingClientRect with offset
    mockParent.getBoundingClientRect = vi.fn(
      () =>
        ({
          left: 100,
          top: 200,
          width: 100,
          height: 100,
          right: 200,
          bottom: 300,
          x: 100,
          y: 200,
          toJSON: () => ({}),
        } as DOMRect)
    );

    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: true,
      hoverEffectsEnabled: false,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate mousemove event with global coordinates
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: 150, // Global X
      clientY: 250, // Global Y
    });

    mockParent.dispatchEvent(mouseEvent);

    // Should calculate relative position (150-100, 250-200)
    expect(mockUpdateMousePosition).toHaveBeenCalledWith({ x: 50, y: 50 });
  });

  it("should handle multiple events correctly", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: true,
      hoverEffectsEnabled: true,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Simulate multiple events
    const mouseMoveEvent = new MouseEvent("mousemove", {
      clientX: 25,
      clientY: 35,
    });
    const mouseEnterEvent = new MouseEvent("mouseenter");
    const mouseLeaveEvent = new MouseEvent("mouseleave");

    mockParent.dispatchEvent(mouseMoveEvent);
    mockParent.dispatchEvent(mouseEnterEvent);
    mockParent.dispatchEvent(mouseLeaveEvent);

    expect(mockUpdateMousePosition).toHaveBeenCalledWith({ x: 25, y: 35 });
    expect(mockSetHovered).toHaveBeenCalledWith(true);
    expect(mockSetHovered).toHaveBeenCalledWith(false);
  });

  it("should handle edge case coordinates", () => {
    const mockUpdateMousePosition = vi.fn();
    const mockSetHovered = vi.fn();

    const config = {
      parentRef: mockParentRef,
      mouseInteractionEnabled: true,
      hoverEffectsEnabled: false,
      updateMousePosition: mockUpdateMousePosition,
      setHovered: mockSetHovered,
    };

    renderHook(() => useWandererEvents(config));

    // Test edge cases
    const edgeCases = [
      { clientX: 0, clientY: 0, expected: { x: 0, y: 0 } },
      { clientX: 100, clientY: 100, expected: { x: 100, y: 100 } },
      { clientX: -10, clientY: -20, expected: { x: -10, y: -20 } },
    ];

    edgeCases.forEach(({ clientX, clientY, expected }) => {
      const mouseEvent = new MouseEvent("mousemove", { clientX, clientY });
      mockParent.dispatchEvent(mouseEvent);

      // Clear previous calls to check only the last one
      mockUpdateMousePosition.mockClear();
      mockParent.dispatchEvent(mouseEvent);

      expect(mockUpdateMousePosition).toHaveBeenCalledWith(expected);
    });
  });
});
