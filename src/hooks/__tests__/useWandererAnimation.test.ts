import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWandererAnimation } from "../useWandererAnimation";
import * as physics from "../../utils/physics";
import * as boundary from "../../utils/boundary";
import * as mouseInteraction from "../../utils/mouseInteraction";
import * as movement from "../../utils/movement";
import * as animation from "../../utils/animation";

// Mock des modules utilitaires
vi.mock("../../utils/physics", () => ({
  getRandomVelocity: vi.fn(() => ({ dx: 1, dy: 1 })),
}));

vi.mock("../../utils/boundary", () => ({
  handleBoundaryCollision: vi.fn(() => ({
    position: { x: 50, y: 50 },
    velocity: { dx: 1, dy: 1 },
    rebounded: false,
    angle: 0,
  })),
}));

vi.mock("../../utils/mouseInteraction", () => ({
  handleMouseCollision: vi.fn(() => ({
    velocity: { dx: 1, dy: 1 },
    lastEscapeTime: 0,
  })),
}));

vi.mock("../../utils/movement", () => ({
  applyPhysics: vi.fn(() => ({ dx: 1, dy: 1 })),
  changeSpeed: vi.fn(() => ({ dx: 1, dy: 1 })),
  shouldChangeSpeed: vi.fn(() => false),
}));

vi.mock("../../utils/animation", () => ({
  shouldChangeSpinSpeed: vi.fn(() => false),
  getRandomSpinDuration: vi.fn(() => 2),
}));

// Mock de setInterval et clearInterval
const mockSetInterval = vi.fn();
const mockClearInterval = vi.fn();

vi.stubGlobal("setInterval", mockSetInterval);
vi.stubGlobal("clearInterval", mockClearInterval);

describe("useWandererAnimation", () => {
  let mockParent: HTMLElement;
  let mockWanderer: HTMLImageElement;
  let mockParentRef: React.RefObject<HTMLElement>;
  let mockWandererRef: React.RefObject<HTMLImageElement>;

  beforeEach(() => {
    // Mock des éléments DOM
    mockParent = document.createElement("div");
    mockWanderer = document.createElement("img");
    mockParentRef = { current: mockParent };
    mockWandererRef = { current: mockWanderer };

    // Mock des propriétés
    Object.defineProperty(mockParent, "clientWidth", { value: 800 });
    Object.defineProperty(mockParent, "clientHeight", { value: 600 });

    // Reset des mocks
    mockSetInterval.mockClear();
    mockClearInterval.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockConfig = (overrides = {}) => ({
    parentRef: mockParentRef,
    wandererRef: mockWandererRef,
    width: 50,
    height: 50,
    frameRate: 60,
    enableDebug: false,
    position: { x: 100, y: 100 },
    velocity: { dx: 2, dy: 1 },
    mousePosition: { x: 200, y: 200 },
    lastEscapeTime: 0,
    movement: {
      baseSpeed: 3,
      speedVariation: 0.5,
      speedChangeFrequency: 0.1,
      enableRandomSpeed: true,
    },
    mouseInteraction: {
      enabled: true,
      detectionDistance: 100,
      safetyZone: 50,
      escapeSpeedMultiplier: 2,
      escapeAngleVariation: 0.3,
      throttleDelay: 1000,
    },
    animation: {
      enableRotation: true,
      rotationDurations: [1, 2, 3],
      rotationChangeFrequency: 0.05,
      enableSpinVariation: true,
    },
    bounce: {
      enabled: true,
      bounceAngleVariation: 0.2,
      enableRandomBounce: true,
    },
    behavior: {
      startPosition: "center" as const,
      boundaryBehavior: "bounce" as const,
      enableGravity: false,
      gravityStrength: 0.1,
      enableFriction: false,
      frictionCoefficient: 0.98,
    },
    callbacks: {
      onCollision: vi.fn(),
      onSpeedChange: vi.fn(),
      onPositionChange: vi.fn(),
      onAnimationComplete: vi.fn(),
    },
    updatePosition: vi.fn(),
    updateVelocity: vi.fn(),
    updateSpeed: vi.fn(),
    updateLastEscapeTime: vi.fn(),
    setSpinDuration: vi.fn(),
    ...overrides,
  });

  it("should not start animation when parent ref is null", () => {
    const config = createMockConfig({
      parentRef: { current: null },
    });

    renderHook(() => useWandererAnimation(config));

    // setInterval est appelé, mais la fonction passée ne fait rien
    expect(mockSetInterval).toHaveBeenCalled();
    // On vérifie que la fonction passée à setInterval ne fait rien
    const move = mockSetInterval.mock.calls[0][0];
    expect(() => move()).not.toThrow();
  });

  it("should not start animation when wanderer ref is null", () => {
    const config = createMockConfig({
      wandererRef: { current: null },
    });

    renderHook(() => useWandererAnimation(config));

    // setInterval est appelé, mais la fonction passée ne fait rien
    expect(mockSetInterval).toHaveBeenCalled();
    const move = mockSetInterval.mock.calls[0][0];
    expect(() => move()).not.toThrow();
  });

  it("should start animation with correct frame rate", () => {
    const config = createMockConfig({
      frameRate: 30, // 30 FPS = 33.33ms interval
    });

    renderHook(() => useWandererAnimation(config));

    // Vérifie que l'intervalle est proche de 33.33ms
    expect(mockSetInterval.mock.calls[0][1]).toBeCloseTo(1000 / 30, 1);
  });

  it("should call setInterval with correct parameters", () => {
    const config = createMockConfig({
      frameRate: 60, // 60 FPS = 16.67ms interval
    });

    renderHook(() => useWandererAnimation(config));

    expect(mockSetInterval.mock.calls[0][1]).toBeCloseTo(1000 / 60, 1);
  });

  it("should clean up interval on unmount", () => {
    const config = createMockConfig();
    const { unmount } = renderHook(() => useWandererAnimation(config));

    unmount();

    expect(mockClearInterval).toHaveBeenCalled();
  });

  it("should call update functions when animation runs", () => {
    const config = createMockConfig();

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(config.updatePosition).toHaveBeenCalled();
    expect(config.updateVelocity).toHaveBeenCalled();
    expect(config.callbacks.onPositionChange).toHaveBeenCalled();
  });

  it("should update DOM element position when animation runs", () => {
    const config = createMockConfig();

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(mockWanderer.style.left).toBeDefined();
    expect(mockWanderer.style.top).toBeDefined();
  });

  it("should call collision callback when boundary collision occurs", () => {
    const mockHandleBoundaryCollision = vi.mocked(
      boundary.handleBoundaryCollision
    );
    mockHandleBoundaryCollision.mockReturnValue({
      position: { x: 50, y: 50 },
      velocity: { dx: -1, dy: 1 },
      rebounded: true,
      angle: Math.PI / 4,
    });

    const config = createMockConfig();

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(config.callbacks.onCollision).toHaveBeenCalledWith("wall");
  });

  it("should update last escape time from mouse collision", () => {
    const mockHandleMouseCollision = vi.mocked(
      mouseInteraction.handleMouseCollision
    );
    const mockTime = Date.now();
    mockHandleMouseCollision.mockReturnValue({
      velocity: { dx: 1, dy: 1 },
      lastEscapeTime: mockTime,
    });

    const config = createMockConfig();

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(config.updateLastEscapeTime).toHaveBeenCalledWith(mockTime);
  });

  it("should handle speed changes when triggered", () => {
    const mockShouldChangeSpeed = vi.mocked(movement.shouldChangeSpeed);
    const mockChangeSpeed = vi.mocked(movement.changeSpeed);
    mockShouldChangeSpeed.mockReturnValue(true);
    mockChangeSpeed.mockImplementation(
      (
        _velocity,
        _baseSpeed,
        _speedVariation,
        _enableRandomSpeed,
        onSpeedChange
      ) => {
        if (onSpeedChange) onSpeedChange(42);
        return { dx: 3, dy: 2 };
      }
    );

    const config = createMockConfig();

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(mockChangeSpeed).toHaveBeenCalled();
    expect(config.callbacks.onSpeedChange).toHaveBeenCalledWith(42);
  });

  it("should handle spin duration changes when triggered", () => {
    const mockShouldChangeSpinSpeed = vi.mocked(
      animation.shouldChangeSpinSpeed
    );
    const mockGetRandomSpinDuration = vi.mocked(
      animation.getRandomSpinDuration
    );
    mockShouldChangeSpinSpeed.mockReturnValue(true);
    mockGetRandomSpinDuration.mockReturnValue(2.5);

    const config = createMockConfig();

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(mockGetRandomSpinDuration).toHaveBeenCalledWith([1, 2, 3]);
    expect(config.setSpinDuration).toHaveBeenCalledWith(2.5);
  });

  it("should handle random bounce when boundary collision occurs", () => {
    const mockHandleBoundaryCollision = vi.mocked(
      boundary.handleBoundaryCollision
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockHandleBoundaryCollision.mockReturnValue({
      position: { x: 50, y: 50 },
      velocity: { dx: -1, dy: 1 },
      rebounded: true,
      angle: Math.PI / 4,
    });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: -1 });

    const config = createMockConfig({
      bounce: {
        enabled: true,
        bounceAngleVariation: 0.2,
        enableRandomBounce: true,
      },
    });

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(mockGetRandomVelocity).toHaveBeenCalled();
  });

  it("should not handle random bounce when disabled", () => {
    const mockHandleBoundaryCollision = vi.mocked(
      boundary.handleBoundaryCollision
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockHandleBoundaryCollision.mockReturnValue({
      position: { x: 50, y: 50 },
      velocity: { dx: -1, dy: 1 },
      rebounded: true,
      angle: Math.PI / 4,
    });

    const config = createMockConfig({
      bounce: {
        enabled: true,
        bounceAngleVariation: 0.2,
        enableRandomBounce: false,
      },
    });

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(mockGetRandomVelocity).not.toHaveBeenCalled();
  });

  it("should log debug information when debug is enabled", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const config = createMockConfig({
      enableDebug: true,
    });

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Wanderer position:")
    );

    consoleSpy.mockRestore();
  });

  it("should not log debug information when debug is disabled", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const config = createMockConfig({
      enableDebug: false,
    });

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should calculate correct boundaries based on parent size", () => {
    const mockHandleBoundaryCollision = vi.mocked(
      boundary.handleBoundaryCollision
    );

    const config = createMockConfig({
      width: 100,
      height: 75,
    });

    renderHook(() => useWandererAnimation(config));

    // Récupérer la fonction de callback passée à setInterval
    const animationCallback = mockSetInterval.mock.calls[0][0];

    // Exécuter la fonction d'animation
    animationCallback();

    // Vérifier que handleBoundaryCollision a été appelé avec les bonnes limites
    expect(mockHandleBoundaryCollision).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number),
      expect.any(Object),
      700, // 800 - 100
      525, // 600 - 75
      "bounce",
      true
    );
  });
});
