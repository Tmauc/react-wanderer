import { useRef, useState } from "react";
import type { Velocity } from "../utils/physics";
import type { MousePosition } from "../utils/mouseInteraction";

export interface WandererState {
  position: { x: number; y: number };
  velocity: Velocity;
  speed: number;
  spinDuration: number;
  mousePosition: MousePosition;
  lastEscapeTime: number;
  isHovered: boolean;
  initialized: boolean;
}

export const useWandererState = (initialSpeed: number) => {
  const [spinDuration, setSpinDuration] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ dx: 0, dy: 0 });
  const speedRef = useRef(initialSpeed);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastEscapeTimeRef = useRef(0);
  const initializedRef = useRef(false);

  const updatePosition = (x: number, y: number) => {
    positionRef.current = { x, y };
  };

  const updateVelocity = (velocity: Velocity) => {
    velocityRef.current = velocity;
  };

  const updateSpeed = (speed: number) => {
    speedRef.current = speed;
  };

  const updateMousePosition = (position: MousePosition) => {
    mousePositionRef.current = position;
  };

  const updateLastEscapeTime = (time: number) => {
    lastEscapeTimeRef.current = time;
  };

  const setHovered = (hovered: boolean) => {
    setIsHovered(hovered);
  };

  const setInitialized = (init: boolean) => {
    initializedRef.current = init;
  };

  const setSpinDurationState = (duration: number) => {
    setSpinDuration(duration);
  };

  return {
    // State
    position: positionRef.current,
    velocity: velocityRef.current,
    speed: speedRef.current,
    spinDuration,
    mousePosition: mousePositionRef.current,
    lastEscapeTime: lastEscapeTimeRef.current,
    isHovered,
    initialized: initializedRef.current,

    // Setters
    updatePosition,
    updateVelocity,
    updateSpeed,
    updateMousePosition,
    updateLastEscapeTime,
    setHovered,
    setInitialized,
    setSpinDurationState,
  };
};
