/// <reference types="vitest/globals" />
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock pour requestAnimationFrame
Object.defineProperty(window, "requestAnimationFrame", {
  value: vi.fn((callback: FrameRequestCallback) => {
    setTimeout(callback, 16); // ~60fps
    return 1;
  }),
});

// Mock pour cancelAnimationFrame
Object.defineProperty(window, "cancelAnimationFrame", {
  value: vi.fn(),
});

// Mock pour getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(
  () =>
    ({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      bottom: 100,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
);

// Mock pour ResizeObserver
Object.defineProperty(window, "ResizeObserver", {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock pour IntersectionObserver
Object.defineProperty(window, "IntersectionObserver", {
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
});

// Mock pour matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
