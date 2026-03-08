import { useEffect } from "react";
import { calculateMousePosition } from "../utils/mouseInteraction";

export interface EventConfig {
  parentRef: React.RefObject<HTMLElement | null>;
  mouseInteractionEnabled: boolean;
  hoverEffectsEnabled: boolean;
  updateMousePosition: (position: { x: number; y: number }) => void;
  setHovered: (hovered: boolean) => void;
}

export const useWandererEvents = (config: EventConfig) => {
  useEffect(() => {
    const parent = config.parentRef.current;
    if (!parent) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (config.mouseInteractionEnabled) {
        const position = calculateMousePosition(event, parent);
        config.updateMousePosition(position);
      }
    };

    const handleMouseEnter = () => {
      if (config.hoverEffectsEnabled) {
        config.setHovered(true);
      }
    };

    const handleMouseLeave = () => {
      if (config.hoverEffectsEnabled) {
        config.setHovered(false);
      }
    };

    if (config.mouseInteractionEnabled) {
      parent.addEventListener("mousemove", handleMouseMove);
    }

    if (config.hoverEffectsEnabled) {
      parent.addEventListener("mouseenter", handleMouseEnter);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [config]);
};
