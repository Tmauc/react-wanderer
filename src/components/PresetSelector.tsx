import React from "react";
import Tabs from "./Tabs";
import type { TabItem } from "./Tabs";
import type { WandererConfig } from "./InteractiveDemo";
import { presets } from "../config/presets";

interface PresetSelectorProps {
  onPresetSelect: (config: WandererConfig) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onPresetSelect }) => {
  const tabs: TabItem[] = presets.map((preset, index) => ({
    id: preset.name.toLowerCase().replace(/\s+/g, "-"),
    label: preset.name,
    icon: ["🎯", "⚡", "🐌", "🌀", "😌"][index] || "📋",
    color: ["blue", "green", "purple", "yellow", "red"][index] || "blue",
  }));

  const [activeTab, setActiveTab] = React.useState(tabs[0].id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const preset = presets.find(
      (p) => p.name.toLowerCase().replace(/\s+/g, "-") === tabId
    );
    if (preset) {
      onPresetSelect(preset.config);
    }
  };

  return (
    <Tabs items={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
  );
};

export default PresetSelector;
