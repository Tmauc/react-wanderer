import type React from "react";

// Inject the spin keyframe CSS into the document (idempotent)
const SPIN_STYLE_ID = "react-wanderer-spin-keyframe";

export const injectSpinKeyframe = (): void => {
  if (typeof document === "undefined") return;
  if (document.getElementById(SPIN_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = SPIN_STYLE_ID;
  style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
};

// Pick a random spin duration from the configured list
export const getRandomSpinDuration = (rotationDurations: number[]): number => {
  if (rotationDurations.length === 0) {
    return 1;
  }
  return rotationDurations[
    Math.floor(Math.random() * rotationDurations.length)
  ];
};

// Generate CSS animation styles for the wanderer element
export const generateAnimationStyles = (
  enableRotation: boolean,
  spinDuration: number,
  enableHoverEffects: boolean,
  isHovered: boolean,
  hoverScale: number,
  transitionDuration: number,
  customStyle?: React.CSSProperties
): React.CSSProperties => {
  const baseStyles: React.CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    pointerEvents: "none",
    userSelect: "none",
    transition: enableHoverEffects
      ? `transform ${transitionDuration}s ease-in-out`
      : "none",
    transform:
      enableHoverEffects && isHovered ? `scale(${hoverScale})` : "scale(1)",
    ...customStyle,
  };

  if (enableRotation) {
    baseStyles.animation = `spin ${spinDuration}s linear infinite`;
  }

  return baseStyles;
};

// Check if a spin speed change should occur (probabilistic)
export const shouldChangeSpinSpeed = (
  rotationChangeFrequency: number
): boolean => {
  return Math.random() < rotationChangeFrequency;
};
