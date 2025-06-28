import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useWandererInitialization } from "../useWandererInitialization";
import * as physics from "../../utils/physics";
import * as boundary from "../../utils/boundary";

// Mock des modules utilitaires
vi.mock("../../utils/physics", () => ({
  getRandomVelocity: vi.fn(() => ({ dx: 2, dy: 1 })),
}));

vi.mock("../../utils/boundary", () => ({
  calculateStartPosition: vi.fn(() => ({ x: 100, y: 100 })),
}));

describe("useWandererInitialization", () => {
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const createMockConfig = (overrides = {}) => ({
    parentRef: mockParentRef,
    wandererRef: mockWandererRef,
    width: 50,
    height: 50,
    startPosition: "center" as const,
    baseSpeed: 3,
    speedVariation: 0.5,
    initialized: false,
    updatePosition: vi.fn(),
    updateVelocity: vi.fn(),
    setInitialized: vi.fn(),
    enableRandomSpeed: true,
    ...overrides,
  });

  it("should not initialize when parent ref is null", () => {
    const config = createMockConfig({
      parentRef: { current: null },
    });

    renderHook(() => useWandererInitialization(config));

    expect(config.updatePosition).not.toHaveBeenCalled();
    expect(config.updateVelocity).not.toHaveBeenCalled();
    expect(config.setInitialized).not.toHaveBeenCalled();
  });

  it("should not initialize when already initialized", () => {
    const config = createMockConfig({
      initialized: true,
    });

    renderHook(() => useWandererInitialization(config));

    expect(config.updatePosition).not.toHaveBeenCalled();
    expect(config.updateVelocity).not.toHaveBeenCalled();
    expect(config.setInitialized).not.toHaveBeenCalled();
  });

  it("should initialize with center position", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 375, y: 275 });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: 1 });

    const config = createMockConfig({
      startPosition: "center",
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockCalculateStartPosition).toHaveBeenCalledWith(
      "center",
      800,
      600,
      50,
      50
    );
    expect(config.updatePosition).toHaveBeenCalledWith(375, 275);
    expect(config.updateVelocity).toHaveBeenCalledWith({ dx: 2, dy: 1 });
    expect(config.setInitialized).toHaveBeenCalledWith(true);
  });

  it("should initialize with random position", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 200, y: 150 });
    mockGetRandomVelocity.mockReturnValue({ dx: -1, dy: 3 });

    const config = createMockConfig({
      startPosition: "random",
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockCalculateStartPosition).toHaveBeenCalledWith(
      "random",
      800,
      600,
      50,
      50
    );
    expect(config.updatePosition).toHaveBeenCalledWith(200, 150);
    expect(config.updateVelocity).toHaveBeenCalledWith({ dx: -1, dy: 3 });
    expect(config.setInitialized).toHaveBeenCalledWith(true);
  });

  it("should initialize with custom position", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    const customPosition = { x: 300, y: 400 };
    mockCalculateStartPosition.mockReturnValue(customPosition);
    mockGetRandomVelocity.mockReturnValue({ dx: 1, dy: -2 });

    const config = createMockConfig({
      startPosition: customPosition,
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockCalculateStartPosition).toHaveBeenCalledWith(
      customPosition,
      800,
      600,
      50,
      50
    );
    expect(config.updatePosition).toHaveBeenCalledWith(300, 400);
    expect(config.updateVelocity).toHaveBeenCalledWith({ dx: 1, dy: -2 });
    expect(config.setInitialized).toHaveBeenCalledWith(true);
  });

  it("should update DOM element position", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 250, y: 300 });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: 1 });

    const config = createMockConfig();

    renderHook(() => useWandererInitialization(config));

    expect(mockWanderer.style.left).toBe("250px");
    expect(mockWanderer.style.top).toBe("300px");
  });

  it("should not update DOM when wanderer ref is null", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 100, y: 100 });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: 1 });

    const config = createMockConfig({
      wandererRef: { current: null },
    });

    renderHook(() => useWandererInitialization(config));

    // Should still call state updates but not DOM updates
    expect(config.updatePosition).toHaveBeenCalled();
    expect(config.updateVelocity).toHaveBeenCalled();
    expect(config.setInitialized).toHaveBeenCalled();
  });

  it("should call getRandomVelocity with correct parameters", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 100, y: 100 });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: 1 });

    const config = createMockConfig({
      baseSpeed: 5,
      speedVariation: 0.8,
      enableRandomSpeed: false,
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockGetRandomVelocity).toHaveBeenCalledWith(
      5, // baseSpeed
      0.8, // speedVariation
      undefined, // angle aléatoire
      false // enableRandomSpeed
    );
  });

  it("should handle different speed configurations", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 100, y: 100 });
    mockGetRandomVelocity.mockReturnValue({ dx: 3, dy: 2 });

    const config = createMockConfig({
      baseSpeed: 10,
      speedVariation: 0.2,
      enableRandomSpeed: true,
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockGetRandomVelocity).toHaveBeenCalledWith(
      10, // baseSpeed
      0.2, // speedVariation
      undefined, // angle aléatoire
      true // enableRandomSpeed
    );
  });

  it("should handle zero speed configuration", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 100, y: 100 });
    mockGetRandomVelocity.mockReturnValue({ dx: 0, dy: 0 });

    const config = createMockConfig({
      baseSpeed: 0,
      speedVariation: 0,
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockGetRandomVelocity).toHaveBeenCalledWith(
      0, // baseSpeed
      0, // speedVariation
      undefined, // angle aléatoire
      true // enableRandomSpeed
    );
    expect(config.updateVelocity).toHaveBeenCalledWith({ dx: 0, dy: 0 });
  });

  it("should handle edge case dimensions", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 0, y: 0 });
    mockGetRandomVelocity.mockReturnValue({ dx: 1, dy: 1 });

    const config = createMockConfig({
      width: 0,
      height: 0,
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockCalculateStartPosition).toHaveBeenCalledWith(
      "center",
      800,
      600,
      0,
      0
    );
    expect(config.updatePosition).toHaveBeenCalledWith(0, 0);
  });

  it("should handle large dimensions", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 750, y: 550 });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: 1 });

    const config = createMockConfig({
      width: 100,
      height: 100,
    });

    renderHook(() => useWandererInitialization(config));

    expect(mockCalculateStartPosition).toHaveBeenCalledWith(
      "center",
      800,
      600,
      100,
      100
    );
    expect(config.updatePosition).toHaveBeenCalledWith(750, 550);
  });

  it("should only initialize once per configuration change", () => {
    const mockCalculateStartPosition = vi.mocked(
      boundary.calculateStartPosition
    );
    const mockGetRandomVelocity = vi.mocked(physics.getRandomVelocity);

    mockCalculateStartPosition.mockReturnValue({ x: 100, y: 100 });
    mockGetRandomVelocity.mockReturnValue({ dx: 2, dy: 1 });

    const config = createMockConfig();

    const { rerender } = renderHook(() => useWandererInitialization(config));

    // Première initialisation
    expect(config.setInitialized).toHaveBeenCalledTimes(1);

    // Re-render avec la même config
    rerender();

    // Ne devrait pas être appelé à nouveau
    expect(config.setInitialized).toHaveBeenCalledTimes(1);
  });
});
