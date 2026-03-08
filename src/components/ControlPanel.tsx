import React, { useState } from "react";
import Tabs from "./Tabs";
import type { TabItem } from "./Tabs";
import type { WandererConfig } from "./InteractiveDemo";

interface ControlPanelProps {
  config: WandererConfig;
  onConfigChange: (
    section: keyof WandererConfig,
    newConfig: Partial<WandererConfig[keyof WandererConfig]>
  ) => void;
}

type TabType =
  | "movement"
  | "mouse"
  | "animation"
  | "bounce"
  | "visual"
  | "behavior"
  | "advanced";

const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("movement");

  const tabs: TabItem[] = [
    { id: "movement", label: "Mouvement", icon: "⚡", color: "blue" },
    { id: "mouse", label: "Souris", icon: "🎯", color: "green" },
    { id: "animation", label: "Animation", icon: "🌀", color: "purple" },
    { id: "bounce", label: "Rebonds", icon: "🏓", color: "yellow" },
    { id: "visual", label: "Visuel", icon: "🎨", color: "red" },
    { id: "behavior", label: "Comportement", icon: "🌍", color: "indigo" },
    { id: "advanced", label: "Avancé", icon: "⚙️", color: "cyan" },
  ];

  const createSlider = (
    section: keyof WandererConfig,
    key: string,
    min: number,
    max: number,
    step: number,
    label: string,
    description?: string
  ) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={
          config[section][
            key as keyof (typeof config)[typeof section]
          ] as number
        }
        onChange={(e) =>
          onConfigChange(section, { [key]: parseFloat(e.target.value) })
        }
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{min}</span>
        <span className="font-mono">
          {config[section][key as keyof (typeof config)[typeof section]]}
        </span>
        <span>{max}</span>
      </div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  const createToggle = (
    section: keyof WandererConfig,
    key: string,
    label: string,
    description?: string
  ) => (
    <div className="mb-3">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={
            config[section][
              key as keyof (typeof config)[typeof section]
            ] as boolean
          }
          onChange={(e) => onConfigChange(section, { [key]: e.target.checked })}
          className="sr-only"
        />
        <div className="relative">
          <div className="block bg-gray-700 w-10 h-6 rounded-full"></div>
          <div
            className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${
              (config[section][
                key as keyof (typeof config)[typeof section]
              ] as boolean)
                ? "transform translate-x-4"
                : ""
            }`}
          ></div>
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-300">{label}</div>
          {description && (
            <div className="text-xs text-gray-500">{description}</div>
          )}
        </div>
      </label>
    </div>
  );

  const createSelect = (
    section: keyof WandererConfig,
    key: string,
    label: string,
    options: { value: string; label: string }[],
    description?: string
  ) => (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <select
        value={
          config[section][
            key as keyof (typeof config)[typeof section]
          ] as string
        }
        onChange={(e) => onConfigChange(section, { [key]: e.target.value })}
        className="w-full bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "movement":
        return (
          <div className="space-y-3">
            {createSlider(
              "movement",
              "baseSpeed",
              0.1,
              10,
              0.1,
              "Vitesse de base",
              "Vitesse de déplacement en pixels par frame"
            )}
            {createSlider(
              "movement",
              "speedVariation",
              0,
              5,
              0.1,
              "Variation de vitesse",
              "Amplitude de variation de la vitesse"
            )}
            {createSlider(
              "movement",
              "speedChangeFrequency",
              0,
              0.1,
              0.001,
              "Fréquence de changement",
              "Probabilité de changement de vitesse par frame"
            )}
            {createToggle(
              "movement",
              "enableRandomSpeed",
              "Vitesse aléatoire",
              "Active les changements de vitesse aléatoires"
            )}
          </div>
        );

      case "mouse":
        return (
          <div className="space-y-3">
            {createToggle(
              "mouseInteraction",
              "enabled",
              "Interaction activée",
              "Active la détection de la souris"
            )}
            {createSlider(
              "mouseInteraction",
              "detectionDistance",
              10,
              200,
              5,
              "Distance de détection",
              "Distance en pixels pour détecter la souris"
            )}
            {createSlider(
              "mouseInteraction",
              "safetyZone",
              10,
              100,
              5,
              "Zone de sécurité",
              "Distance minimale à maintenir avec la souris"
            )}
            {createSlider(
              "mouseInteraction",
              "escapeSpeedMultiplier",
              1,
              10,
              0.1,
              "Multiplicateur de fuite",
              "Multiplicateur de vitesse lors de la fuite"
            )}
            {createSlider(
              "mouseInteraction",
              "escapeAngleVariation",
              0,
              Math.PI,
              0.1,
              "Variation d'angle de fuite",
              "Variation de l'angle de fuite en radians"
            )}
            {createSlider(
              "mouseInteraction",
              "throttleDelay",
              0,
              500,
              10,
              "Délai de throttling",
              "Délai entre les mises à jour de position en ms"
            )}
          </div>
        );

      case "animation":
        return (
          <div className="space-y-3">
            {createToggle(
              "animation",
              "enableRotation",
              "Rotation activée",
              "Active la rotation de l'image"
            )}
            {createSlider(
              "animation",
              "rotationChangeFrequency",
              0,
              0.02,
              0.001,
              "Fréquence de changement de rotation",
              "Probabilité de changement de rotation par frame"
            )}
            {createToggle(
              "animation",
              "enableSpinVariation",
              "Variation de rotation",
              "Active les variations de durée de rotation"
            )}
          </div>
        );

      case "bounce":
        return (
          <div className="space-y-3">
            {createToggle(
              "bounce",
              "enabled",
              "Rebonds activés",
              "Active les rebonds sur les bords"
            )}
            {createSlider(
              "bounce",
              "bounceAngleVariation",
              0,
              Math.PI,
              0.1,
              "Variation d'angle de rebond",
              "Variation de l'angle après rebond en radians"
            )}
            {createToggle(
              "bounce",
              "enableRandomBounce",
              "Rebonds aléatoires",
              "Active les rebonds avec angles aléatoires"
            )}
          </div>
        );

      case "visual":
        return (
          <div className="space-y-3">
            {createToggle(
              "visual",
              "enableHoverEffects",
              "Effets de survol",
              "Active les effets visuels au survol"
            )}
            {createSlider(
              "visual",
              "hoverScale",
              1,
              3,
              0.1,
              "Échelle au survol",
              "Facteur d'échelle lors du survol"
            )}
            {createSlider(
              "visual",
              "transitionDuration",
              0.1,
              2,
              0.1,
              "Durée de transition",
              "Durée des transitions en secondes"
            )}
          </div>
        );

      case "behavior":
        return (
          <div className="space-y-3">
            {createSelect(
              "behavior",
              "startPosition",
              "Position de départ",
              [
                { value: "random", label: "Aléatoire" },
                { value: "center", label: "Centre" },
              ],
              "Position initiale du wanderer"
            )}
            {createSelect(
              "behavior",
              "boundaryBehavior",
              "Comportement aux bords",
              [
                { value: "bounce", label: "Rebondir" },
                { value: "wrap", label: "Traverser" },
                { value: "stop", label: "S'arrêter" },
                { value: "reverse", label: "Inverser" },
              ],
              "Comportement quand le wanderer atteint les bords"
            )}
            {createToggle(
              "behavior",
              "enableGravity",
              "Gravité",
              "Active l'effet de gravité"
            )}
            {createSlider(
              "behavior",
              "gravityStrength",
              0,
              1,
              0.01,
              "Force de gravité",
              "Intensité de l'effet de gravité"
            )}
            {createToggle(
              "behavior",
              "enableFriction",
              "Friction",
              "Active l'effet de friction"
            )}
            {createSlider(
              "behavior",
              "frictionCoefficient",
              0.8,
              1,
              0.01,
              "Coefficient de friction",
              "Facteur de ralentissement (1 = pas de friction)"
            )}
          </div>
        );

      case "advanced":
        return (
          <div className="space-y-3">
            {createSlider(
              "advanced",
              "animationFrameRate",
              30,
              120,
              1,
              "FPS",
              "Taux de rafraîchissement de l'animation"
            )}
            {createToggle(
              "advanced",
              "enableDebug",
              "Mode debug",
              "Active les informations de debug"
            )}
            {createToggle(
              "advanced",
              "enablePerformanceMode",
              "Mode performance",
              "Optimise les performances (skip every other frame)"
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabType);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-full flex flex-col">
      <h2 className="text-xl font-bold text-white p-4 border-b border-white/10">
        🎛️ Contrôles
      </h2>

      {/* Onglets */}
      <Tabs items={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Contenu de l'onglet */}
      <div className="flex-1 overflow-y-auto p-4">{renderTabContent()}</div>
    </div>
  );
};

export default ControlPanel;
