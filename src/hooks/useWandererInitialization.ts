import { useEffect } from "react";
import type { Velocity } from "../types";
import { getRandomVelocity } from "../utils/physics";
import { calculateStartPosition } from "../utils/boundary";

export interface InitializationConfig {
  parentRef: React.RefObject<HTMLElement | null>;
  wandererRef: React.RefObject<HTMLImageElement | null>;
  width: number;
  height: number;
  startPosition: "random" | "center" | { x: number; y: number };
  baseSpeed: number;
  speedVariation: number;
  initializedRef: React.RefObject<boolean>;
  updatePosition: (x: number, y: number) => void;
  updateVelocity: (velocity: Velocity) => void;
  setInitialized: (init: boolean) => void;
  enableRandomSpeed: boolean;
}

export const useWandererInitialization = (config: InitializationConfig) => {
  useEffect(() => {
    const parent = config.parentRef.current;
    if (!parent || config.initializedRef.current) return;

    const startPos = calculateStartPosition(
      config.startPosition,
      parent.clientWidth,
      parent.clientHeight,
      config.width,
      config.height
    );

    const initialVelocity = getRandomVelocity(
      config.baseSpeed,
      config.speedVariation,
      undefined,
      config.enableRandomSpeed
    );

    config.updatePosition(startPos.x, startPos.y);
    config.updateVelocity(initialVelocity);

    if (config.wandererRef.current) {
      config.wandererRef.current.style.left = `${startPos.x}px`;
      config.wandererRef.current.style.top = `${startPos.y}px`;
    }

    config.setInitialized(true);
  }, [config]);
};
