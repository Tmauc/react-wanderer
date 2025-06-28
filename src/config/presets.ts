import type { WandererConfig } from "../components/InteractiveDemo";

export const presets: {
  name: string;
  config: WandererConfig;
}[] = [
  {
    name: "Défaut",
    config: {
      movement: {
        baseSpeed: 2,
        speedVariation: 0,
        speedChangeFrequency: 0,
        enableRandomSpeed: false,
      },
      mouseInteraction: {
        enabled: true,
        detectionDistance: 60,
        safetyZone: 30,
        escapeSpeedMultiplier: 2,
        escapeAngleVariation: Math.PI / 3,
        throttleDelay: 100,
      },
      animation: {
        enableRotation: true,
        rotationDurations: [6, 4, 2, 1, 0.5],
        rotationChangeFrequency: 0.005,
        enableSpinVariation: true,
      },
      bounce: {
        enabled: true,
        bounceAngleVariation: 0,
        enableRandomBounce: false,
      },
      visual: {
        className: "",
        style: {},
        enableHoverEffects: false,
        hoverScale: 1.1,
        transitionDuration: 0.3,
      },
      behavior: {
        startPosition: "random",
        boundaryBehavior: "bounce",
        enableGravity: false,
        gravityStrength: 0.1,
        enableFriction: false,
        frictionCoefficient: 0.98,
      },
      advanced: {
        animationFrameRate: 60,
        enableDebug: false,
        enablePerformanceMode: false,
        collisionDetection: "mouse",
        customCollisionElements: [],
      },
    },
  },
  {
    name: "Rapide",
    config: {
      movement: {
        baseSpeed: 5,
        speedVariation: 2,
        speedChangeFrequency: 0.02,
        enableRandomSpeed: true,
      },
      mouseInteraction: {
        enabled: true,
        detectionDistance: 80,
        safetyZone: 20,
        escapeSpeedMultiplier: 3,
        escapeAngleVariation: Math.PI / 2,
        throttleDelay: 50,
      },
      animation: {
        enableRotation: true,
        rotationDurations: [2, 1, 0.5, 0.3, 0.1],
        rotationChangeFrequency: 0.01,
        enableSpinVariation: true,
      },
      bounce: {
        enabled: true,
        bounceAngleVariation: Math.PI / 6,
        enableRandomBounce: true,
      },
      visual: {
        className: "",
        style: {},
        enableHoverEffects: true,
        hoverScale: 1.3,
        transitionDuration: 0.2,
      },
      behavior: {
        startPosition: "random",
        boundaryBehavior: "bounce",
        enableGravity: false,
        gravityStrength: 0.1,
        enableFriction: false,
        frictionCoefficient: 0.98,
      },
      advanced: {
        animationFrameRate: 60,
        enableDebug: false,
        enablePerformanceMode: false,
        collisionDetection: "mouse",
        customCollisionElements: [],
      },
    },
  },
  {
    name: "Lent",
    config: {
      movement: {
        baseSpeed: 0.8,
        speedVariation: 0.3,
        speedChangeFrequency: 0.005,
        enableRandomSpeed: true,
      },
      mouseInteraction: {
        enabled: true,
        detectionDistance: 100,
        safetyZone: 50,
        escapeSpeedMultiplier: 1.5,
        escapeAngleVariation: Math.PI / 4,
        throttleDelay: 200,
      },
      animation: {
        enableRotation: true,
        rotationDurations: [10, 8, 6, 4, 2],
        rotationChangeFrequency: 0.002,
        enableSpinVariation: true,
      },
      bounce: {
        enabled: true,
        bounceAngleVariation: 0,
        enableRandomBounce: false,
      },
      visual: {
        className: "",
        style: {},
        enableHoverEffects: true,
        hoverScale: 1.05,
        transitionDuration: 0.5,
      },
      behavior: {
        startPosition: "center",
        boundaryBehavior: "bounce",
        enableGravity: false,
        gravityStrength: 0.1,
        enableFriction: true,
        frictionCoefficient: 0.99,
      },
      advanced: {
        animationFrameRate: 30,
        enableDebug: false,
        enablePerformanceMode: true,
        collisionDetection: "mouse",
        customCollisionElements: [],
      },
    },
  },
  {
    name: "Chaotique",
    config: {
      movement: {
        baseSpeed: 3,
        speedVariation: 4,
        speedChangeFrequency: 0.05,
        enableRandomSpeed: true,
      },
      mouseInteraction: {
        enabled: true,
        detectionDistance: 120,
        safetyZone: 10,
        escapeSpeedMultiplier: 4,
        escapeAngleVariation: Math.PI,
        throttleDelay: 30,
      },
      animation: {
        enableRotation: true,
        rotationDurations: [0.5, 0.3, 0.1, 0.05, 0.02],
        rotationChangeFrequency: 0.02,
        enableSpinVariation: true,
      },
      bounce: {
        enabled: true,
        bounceAngleVariation: Math.PI / 2,
        enableRandomBounce: true,
      },
      visual: {
        className: "",
        style: {},
        enableHoverEffects: true,
        hoverScale: 1.5,
        transitionDuration: 0.1,
      },
      behavior: {
        startPosition: "random",
        boundaryBehavior: "bounce",
        enableGravity: true,
        gravityStrength: 0.3,
        enableFriction: false,
        frictionCoefficient: 0.95,
      },
      advanced: {
        animationFrameRate: 120,
        enableDebug: true,
        enablePerformanceMode: false,
        collisionDetection: "both",
        customCollisionElements: [],
      },
    },
  },
  {
    name: "Calme",
    config: {
      movement: {
        baseSpeed: 1.2,
        speedVariation: 0.1,
        speedChangeFrequency: 0.001,
        enableRandomSpeed: false,
      },
      mouseInteraction: {
        enabled: false,
        detectionDistance: 60,
        safetyZone: 30,
        escapeSpeedMultiplier: 2,
        escapeAngleVariation: Math.PI / 3,
        throttleDelay: 100,
      },
      animation: {
        enableRotation: true,
        rotationDurations: [8, 6, 4, 2, 1],
        rotationChangeFrequency: 0.001,
        enableSpinVariation: false,
      },
      bounce: {
        enabled: true,
        bounceAngleVariation: 0,
        enableRandomBounce: false,
      },
      visual: {
        className: "",
        style: {},
        enableHoverEffects: false,
        hoverScale: 1.1,
        transitionDuration: 0.4,
      },
      behavior: {
        startPosition: "center",
        boundaryBehavior: "bounce",
        enableGravity: false,
        gravityStrength: 0.1,
        enableFriction: true,
        frictionCoefficient: 0.995,
      },
      advanced: {
        animationFrameRate: 45,
        enableDebug: false,
        enablePerformanceMode: true,
        collisionDetection: "mouse",
        customCollisionElements: [],
      },
    },
  },
];

export const defaultConfig: WandererConfig = presets[0].config;
