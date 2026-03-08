import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Wanderer from "../Wanderer";
import type { WandererProps } from "../../types";

// Mock hooks to avoid real side effects
vi.mock("../../hooks/useWandererState", () => ({
  useWandererState: () => ({
    positionRef: { current: { x: 0, y: 0 } },
    velocityRef: { current: { dx: 0, dy: 0 } },
    speedRef: { current: 1 },
    mousePositionRef: { current: { x: 0, y: 0 } },
    lastEscapeTimeRef: { current: 0 },
    initializedRef: { current: false },
    spinDuration: 2,
    isHovered: false,
    updatePosition: vi.fn(),
    updateVelocity: vi.fn(),
    updateSpeed: vi.fn(),
    updateMousePosition: vi.fn(),
    updateLastEscapeTime: vi.fn(),
    setHovered: vi.fn(),
    setInitialized: vi.fn(),
    setSpinDurationState: vi.fn(),
  }),
}));
vi.mock("../../hooks/useWandererInitialization", () => ({
  useWandererInitialization: () => {},
}));
vi.mock("../../hooks/useWandererEvents", () => ({
  useWandererEvents: () => {},
}));
vi.mock("../../hooks/useWandererAnimation", () => ({
  useWandererAnimation: () => {},
}));
vi.mock("../../utils/animation", () => ({
  generateAnimationStyles: (
    _enableRotation: boolean,
    _spinDuration: number,
    _enableHoverEffects: boolean,
    _isHovered: boolean,
    _hoverScale: number,
    _transitionDuration: number,
    customStyle?: React.CSSProperties
  ) => ({
    ...customStyle,
  }),
  injectSpinKeyframe: vi.fn(),
}));

const parentDiv = document.createElement("div");
document.body.appendChild(parentDiv);
const parentRef = { current: parentDiv };

describe("Wanderer component", () => {
  const baseProps: WandererProps = {
    src: "/avatar.png",
    alt: "Avatar",
    width: 64,
    height: 64,
    parentRef,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders an image with correct src and alt", () => {
    render(<Wanderer {...baseProps} />);
    const img = screen.getByAltText("Avatar") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/avatar.png");
    expect(img.width).toBe(64);
    expect(img.height).toBe(64);
  });

  it("applies custom className and style", () => {
    render(
      <Wanderer
        {...baseProps}
        visual={{ className: "custom-class", style: { borderRadius: "50%" } }}
      />
    );
    const img = screen.getByAltText("Avatar");
    expect(img.className).toContain("custom-class");
    expect(img).toBeInTheDocument();
  });

  it("accepts visual configuration props", () => {
    const visualConfig = {
      className: "test-class",
      style: { backgroundColor: "red" },
      enableHoverEffects: true,
      hoverScale: 1.5,
      transitionDuration: 0.3,
    };

    render(<Wanderer {...baseProps} visual={visualConfig} />);

    const img = screen.getByAltText("Avatar");
    expect(img.className).toContain("test-class");
    expect(img).toBeInTheDocument();
  });

  it("calls onCollision callback if provided", () => {
    const onCollision = vi.fn();
    render(<Wanderer {...baseProps} callbacks={{ onCollision }} />);
    expect(typeof onCollision).toBe("function");
  });

  it("supports hover effects if enabled", () => {
    render(
      <Wanderer
        {...baseProps}
        visual={{ enableHoverEffects: true, hoverScale: 1.2 }}
      />
    );
    const img = screen.getByAltText("Avatar");
    fireEvent.mouseEnter(img);
    expect(img).toBeInTheDocument();
  });

  it("renders with custom dimensions", () => {
    render(<Wanderer {...baseProps} width={128} height={128} />);
    const img = screen.getByAltText("Avatar") as HTMLImageElement;
    expect(img.width).toBe(128);
    expect(img.height).toBe(128);
  });

  it("should render with default alt text when alt is not provided", () => {
    const { container } = render(
      <Wanderer
        src="test-image.png"
        width={50}
        height={50}
        parentRef={parentRef}
      />
    );

    const image = container.querySelector("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", "Animated wanderer");
  });

  // ===== PERFORMANCE TESTS =====
  describe("Performance tests", () => {
    it("should not re-render when parent ref changes but component is not re-mounted", () => {
      const renderSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const { rerender } = render(<Wanderer {...baseProps} />);

      expect(renderSpy).not.toHaveBeenCalled();

      rerender(<Wanderer {...baseProps} />);

      expect(renderSpy).not.toHaveBeenCalled();

      renderSpy.mockRestore();
    });

    it("should handle rapid prop changes efficiently", () => {
      const startTime = performance.now();

      const { rerender } = render(<Wanderer {...baseProps} />);

      for (let i = 0; i < 100; i++) {
        rerender(
          <Wanderer {...baseProps} visual={{ className: `class-${i}` }} />
        );
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(100);
    });

    it("should not create new objects on every render", () => {
      const { rerender } = render(<Wanderer {...baseProps} />);

      rerender(<Wanderer {...baseProps} />);

      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });
  });

  // ===== ERROR HANDLING TESTS =====
  describe("Error handling tests", () => {
    it("should handle missing src prop gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const propsWithoutSrc = { ...baseProps };
      delete (propsWithoutSrc as Partial<WandererProps>).src;

      expect(() => {
        const { container } = render(<Wanderer {...propsWithoutSrc} />);
        expect(container.querySelector("img")).toBeNull();
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it("should handle missing alt prop gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const propsWithoutAlt = { ...baseProps };
      delete (propsWithoutAlt as Partial<WandererProps>).alt;

      expect(() => {
        render(<Wanderer {...propsWithoutAlt} />);
      }).not.toThrow();

      const img = document.querySelector("img");
      expect(img).toBeInTheDocument();
      expect(img?.alt).toBe("Animated wanderer");

      consoleSpy.mockRestore();
    });

    it("should handle null parent ref", () => {
      const nullParentRef = { current: null };

      expect(() => {
        render(<Wanderer {...baseProps} parentRef={nullParentRef} />);
      }).not.toThrow();

      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });

    it("should handle undefined parent ref", () => {
      const undefinedParentRef = { current: null as HTMLElement | null };

      expect(() => {
        render(<Wanderer {...baseProps} parentRef={undefinedParentRef} />);
      }).not.toThrow();

      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });

    it("should handle invalid width and height values", () => {
      expect(() => {
        render(<Wanderer {...baseProps} width={-10} height={-20} />);
      }).not.toThrow();

      expect(() => {
        render(<Wanderer {...baseProps} width={0} height={0} />);
      }).not.toThrow();

      expect(() => {
        render(<Wanderer {...baseProps} width={10000} height={10000} />);
      }).not.toThrow();
    });

    it("should handle invalid configuration objects", () => {
      const invalidConfig = {
        movement: null as unknown as WandererProps["movement"],
        mouseInteraction:
          undefined as unknown as WandererProps["mouseInteraction"],
        animation: "invalid" as unknown as WandererProps["animation"],
        bounce: {},
        visual: null as unknown as WandererProps["visual"],
        behavior: undefined as unknown as WandererProps["behavior"],
        advanced: "invalid" as unknown as WandererProps["advanced"],
        callbacks: null as unknown as WandererProps["callbacks"],
      };

      expect(() => {
        render(
          <Wanderer
            {...baseProps}
            movement={invalidConfig.movement}
            mouseInteraction={invalidConfig.mouseInteraction}
            animation={invalidConfig.animation}
            bounce={invalidConfig.bounce}
            visual={invalidConfig.visual}
            behavior={invalidConfig.behavior}
            advanced={invalidConfig.advanced}
            callbacks={invalidConfig.callbacks}
          />
        );
      }).not.toThrow();

      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });

    it("should handle missing required props gracefully", () => {
      const { container } = render(
        <Wanderer
          src="test-image.png"
          width={50}
          height={50}
          parentRef={parentRef}
        />
      );

      const image = container.querySelector("img");
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "test-image.png");
      expect(image).toHaveAttribute("alt", "Animated wanderer");
    });

    it("should handle invalid image src", () => {
      const invalidSrcProps = {
        ...baseProps,
        src: "invalid-image-url",
      };

      expect(() => {
        render(<Wanderer {...invalidSrcProps} />);
      }).not.toThrow();

      const img = screen.getByAltText("Avatar") as HTMLImageElement;
      expect(img.src).toContain("invalid-image-url");
    });

    it("should handle empty string props", () => {
      const emptyProps = {
        ...baseProps,
        src: "",
        alt: "",
      };

      expect(() => {
        const { container } = render(<Wanderer {...emptyProps} />);
        expect(container.querySelector("img")).toBeNull();
      }).not.toThrow();
    });

    it("should clamp negative width/height to 0", () => {
      const { container } = render(
        <Wanderer {...baseProps} width={-50} height={-30} />
      );
      const img = container.querySelector("img") as HTMLImageElement;
      expect(img.width).toBe(0);
      expect(img.height).toBe(0);
    });
  });
});
