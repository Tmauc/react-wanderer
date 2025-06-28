import { useEffect } from "react";
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
  initialized: boolean;
  updatePosition: (x: number, y: number) => void;
  updateVelocity: (velocity: { dx: number; dy: number }) => void;
  setInitialized: (init: boolean) => void;
  enableRandomSpeed: boolean;
}

export const useWandererInitialization = (config: InitializationConfig) => {
  useEffect(() => {
    const parent = config.parentRef.current;
    if (!parent || config.initialized) return;

    // Calcul de la position de départ
    const startPos = calculateStartPosition(
      config.startPosition,
      parent.clientWidth,
      parent.clientHeight,
      config.width,
      config.height
    );

    // Génération de la vélocité initiale
    const initialVelocity = getRandomVelocity(
      config.baseSpeed,
      config.speedVariation,
      undefined, // angle aléatoire
      config.enableRandomSpeed // respecter la configuration
    );

    // Mise à jour de l'état
    config.updatePosition(startPos.x, startPos.y);
    config.updateVelocity(initialVelocity);

    // Mise à jour du DOM
    if (config.wandererRef.current) {
      config.wandererRef.current.style.left = `${startPos.x}px`;
      config.wandererRef.current.style.top = `${startPos.y}px`;
    }

    config.setInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    config.parentRef,
    config.wandererRef,
    config.width,
    config.height,
    config.startPosition,
    config.baseSpeed,
    config.speedVariation,
    config.initialized,
    config.updatePosition,
    config.updateVelocity,
    config.setInitialized,
    config.enableRandomSpeed,
  ]);
};
