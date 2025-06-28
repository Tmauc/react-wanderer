import React, { useState } from "react";
import Wanderer from "./Wanderer";
import ControlPanel from "./ControlPanel";
import LiveStats from "./LiveStats";
import CodeDisplay from "./CodeDisplay";
import PresetSelector from "./PresetSelector";
import Tabs from "./Tabs";
import type { TabItem } from "./Tabs";
import type {
  MovementConfig,
  MouseInteractionConfig,
  AnimationConfig,
  BounceConfig,
  VisualConfig,
  BehaviorConfig,
  AdvancedConfig,
  Callbacks,
} from "./Wanderer";
import { defaultConfig } from "../config/presets";

export interface WandererConfig {
  movement: MovementConfig;
  mouseInteraction: MouseInteractionConfig;
  animation: AnimationConfig;
  bounce: BounceConfig;
  visual: VisualConfig;
  behavior: BehaviorConfig;
  advanced: AdvancedConfig;
}

type MainTabType = "demo" | "code";

const InteractiveDemo: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("demo");

  // État pour les configurations
  const [config, setConfig] = useState<WandererConfig>(defaultConfig);

  // État pour les statistiques en temps réel
  const [stats, setStats] = useState({
    collisionCount: 0,
    currentSpeed: 2,
    currentPosition: { x: 0, y: 0 },
    fps: 0,
    isHovered: false,
  });

  // Callbacks pour les événements
  const callbacks: Callbacks = {
    onCollision: (type) => {
      setStats((prev) => ({
        ...prev,
        collisionCount: prev.collisionCount + 1,
      }));
      console.log(`Collision détectée: ${type}`);
    },
    onSpeedChange: (newSpeed) => {
      setStats((prev) => ({ ...prev, currentSpeed: newSpeed }));
    },
    onPositionChange: (x, y) => {
      setStats((prev) => ({ ...prev, currentPosition: { x, y } }));
    },
  };

  // Mise à jour de la configuration
  const updateConfig = (
    section: keyof WandererConfig,
    newConfig: Partial<WandererConfig[keyof WandererConfig]>
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...newConfig },
    }));
  };

  // Application d'un preset
  const applyPreset = (presetConfig: WandererConfig) => {
    setConfig(presetConfig);
  };

  const mainTabs: TabItem[] = [
    { id: "demo", label: "Démonstration", icon: "🎯" },
    { id: "code", label: "Code", icon: "💻" },
  ];

  const handleMainTabChange = (tabId: string) => {
    setActiveMainTab(tabId as MainTabType);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 md:overflow-hidden space-y-4">
      {/* Header fixe */}
      <div className="h-24 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="!text-xl md:text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            🎮 Wanderer - Démo Interactive
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Explorez toutes les possibilités du composant Wanderer
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
        {/* Sélecteur de presets */}
        <PresetSelector onPresetSelect={applyPreset} />
        <div className="flex items-center px-6"></div>

        {/* Zone principale */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 px-6 pb-6 min-h-0">
          {/* Zone de démo/code principale */}
          <div className="flex-1 flex flex-col">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-full flex flex-col p-4">
              {/* Onglets principaux */}
              <Tabs
                items={mainTabs}
                activeTab={activeMainTab}
                onTabChange={handleMainTabChange}
              />

              {/* Contenu de l'onglet principal */}
              <div className="flex-1 p-4 min-h-0">
                {activeMainTab === "demo" ? (
                  <div className="h-full flex flex-col">
                    {/* Statistiques en temps réel */}
                    <div className="mb-4">
                      <LiveStats stats={stats} />
                    </div>

                    {/* Zone de test */}
                    <div className="flex-1 min-h-0">
                      <div
                        ref={containerRef}
                        className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-white/30 relative overflow-hidden"
                      >
                        <Wanderer
                          src="/ugo.png"
                          alt="Wanderer Interactif"
                          width={50}
                          height={50}
                          parentRef={containerRef}
                          movement={config.movement}
                          mouseInteraction={config.mouseInteraction}
                          animation={config.animation}
                          bounce={config.bounce}
                          visual={config.visual}
                          behavior={config.behavior}
                          advanced={config.advanced}
                          callbacks={callbacks}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    <CodeDisplay config={config} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panneau de contrôle */}
          <div className="w-80 flex-shrink-0">
            <ControlPanel config={config} onConfigChange={updateConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;
