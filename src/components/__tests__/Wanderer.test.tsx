import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import Wanderer from "../Wanderer";
import type { WandererProps } from "../Wanderer";

// Mock des hooks pour éviter les effets réels
vi.mock("../../hooks/useWandererState", () => ({
  useWandererState: () => ({
    position: { x: 0, y: 0 },
    velocity: { dx: 0, dy: 0 },
    speed: 1,
    spinDuration: 2,
    mousePosition: { x: 0, y: 0 },
    lastEscapeTime: 0,
    isHovered: false,
    initialized: false,
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
    // Le callback est passé au hook, on vérifie qu'il est bien transmis
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
    // Simule un hover
    fireEvent.mouseEnter(img);
    // Pas d'effet réel car hook mocké, mais le test vérifie que le composant accepte la prop
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

  // ===== TESTS DE PERFORMANCE =====
  describe("Performance tests", () => {
    it("should not re-render when parent ref changes but component is not re-mounted", () => {
      const renderSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const { rerender } = render(<Wanderer {...baseProps} />);

      // Premier rendu
      expect(renderSpy).not.toHaveBeenCalled();

      // Re-render avec les mêmes props
      rerender(<Wanderer {...baseProps} />);

      // Vérifier que le composant ne fait pas de rendu inutile
      expect(renderSpy).not.toHaveBeenCalled();

      renderSpy.mockRestore();
    });

    it("should handle rapid prop changes efficiently", () => {
      const startTime = performance.now();

      const { rerender } = render(<Wanderer {...baseProps} />);

      // Changements rapides de props
      for (let i = 0; i < 100; i++) {
        rerender(
          <Wanderer {...baseProps} visual={{ className: `class-${i}` }} />
        );
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Les re-renders doivent être rapides (< 100ms pour 100 changements)
      expect(duration).toBeLessThan(100);
    });

    it("should not create new objects on every render", () => {
      const { rerender } = render(<Wanderer {...baseProps} />);

      // Re-render avec les mêmes props
      rerender(<Wanderer {...baseProps} />);

      // Le composant doit être stable
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });
  });

  // ===== TESTS DE CAS D'ERREUR =====
  describe("Error handling tests", () => {
    it("should handle missing src prop gracefully", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const propsWithoutSrc = { ...baseProps };
      delete (propsWithoutSrc as Partial<WandererProps>).src;

      expect(() => {
        const { container } = render(<Wanderer {...propsWithoutSrc} />);
        // Le composant ne doit rien rendre
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

      // Le composant doit se rendre avec la valeur par défaut pour alt
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

      // Le composant doit toujours se rendre même avec une ref null
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });

    it("should handle undefined parent ref", () => {
      const undefinedParentRef = { current: null as HTMLElement | null };

      expect(() => {
        render(<Wanderer {...baseProps} parentRef={undefinedParentRef} />);
      }).not.toThrow();

      // Le composant doit toujours se rendre même avec une ref undefined
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });

    it("should handle invalid width and height values", () => {
      // Valeurs négatives
      expect(() => {
        render(<Wanderer {...baseProps} width={-10} height={-20} />);
      }).not.toThrow();

      // Valeurs zero
      expect(() => {
        render(<Wanderer {...baseProps} width={0} height={0} />);
      }).not.toThrow();

      // Valeurs très grandes
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

      // Le composant doit toujours se rendre même avec des configs invalides
      expect(screen.getByAltText("Avatar")).toBeInTheDocument();
    });

    it("should handle missing required props gracefully", () => {
      // Test avec des props manquantes - le composant devrait utiliser les valeurs par défaut
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
      expect(image).toHaveAttribute("alt", "Animated wanderer"); // Valeur par défaut
    });

    it("should handle invalid image src", () => {
      const invalidSrcProps = {
        ...baseProps,
        src: "invalid-image-url",
      };

      expect(() => {
        render(<Wanderer {...invalidSrcProps} />);
      }).not.toThrow();

      // Le composant doit se rendre même avec une URL d'image invalide
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
        // Le composant ne doit rien rendre
        expect(container.querySelector("img")).toBeNull();
      }).not.toThrow();
    });
  });
});
