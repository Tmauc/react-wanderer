import { useRef, useState, useCallback } from "react";
import type { Velocity, MousePosition } from "../types";

export const useWandererState = (initialSpeed: number) => {
  const [spinDuration, setSpinDuration] = useState(2);
  const [isHovered, setIsHovered] = useState(false);

  const positionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef<Velocity>({ dx: 0, dy: 0 });
  const speedRef = useRef(initialSpeed);
  const mousePositionRef = useRef<MousePosition>({ x: 0, y: 0 });
  const lastEscapeTimeRef = useRef(0);
  const initializedRef = useRef(false);

  const updatePosition = useCallback((x: number, y: number) => {
    positionRef.current = { x, y };
  }, []);

  const updateVelocity = useCallback((velocity: Velocity) => {
    velocityRef.current = velocity;
  }, []);

  const updateSpeed = useCallback((speed: number) => {
    speedRef.current = speed;
  }, []);

  const updateMousePosition = useCallback((position: MousePosition) => {
    mousePositionRef.current = position;
  }, []);

  const updateLastEscapeTime = useCallback((time: number) => {
    lastEscapeTimeRef.current = time;
  }, []);

  const setHovered = useCallback((hovered: boolean) => {
    setIsHovered(hovered);
  }, []);

  const setInitialized = useCallback((init: boolean) => {
    initializedRef.current = init;
  }, []);

  const setSpinDurationState = useCallback((duration: number) => {
    setSpinDuration(duration);
  }, []);

  return {
    // Refs (stable references for animation loop)
    positionRef,
    velocityRef,
    speedRef,
    mousePositionRef,
    lastEscapeTimeRef,
    initializedRef,

    // Reactive state (triggers re-render)
    spinDuration,
    isHovered,

    // Stable setter functions
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
