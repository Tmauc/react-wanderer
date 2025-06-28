export interface AnimationConfig {
  enableRotation?: boolean;
  rotationDurations?: number[];
  rotationChangeFrequency?: number;
  enableSpinVariation?: boolean;
}

export interface VisualConfig {
  className?: string;
  style?: React.CSSProperties;
  enableHoverEffects?: boolean;
  hoverScale?: number;
  transitionDuration?: number;
}

// Change la vitesse de rotation aléatoirement
export const getRandomSpinDuration = (rotationDurations: number[]): number => {
  if (rotationDurations.length === 0) {
    return 1; // Valeur par défaut si le tableau est vide
  }
  return rotationDurations[
    Math.floor(Math.random() * rotationDurations.length)
  ];
};

// Génère les styles d'animation CSS
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

  // Styles d'animation de rotation (CSS pur)
  if (enableRotation) {
    baseStyles.animation = `spin ${spinDuration}s linear infinite`;
  }

  return baseStyles;
};

// Vérifie si un changement de rotation doit avoir lieu
export const shouldChangeSpinSpeed = (
  rotationChangeFrequency: number
): boolean => {
  return Math.random() < rotationChangeFrequency;
};
