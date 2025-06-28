import React from "react";

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  color?: string;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ items, activeTab, onTabChange }) => {
  const getTabColor = (color?: string) => {
    if (!color) return "border-blue-400 bg-blue-500/20 text-blue-300";

    const colors = {
      blue: "border-blue-400 bg-blue-500/20 text-blue-300",
      green: "border-green-400 bg-green-500/20 text-green-300",
      purple: "border-purple-400 bg-purple-500/20 text-purple-300",
      yellow: "border-yellow-400 bg-yellow-500/20 text-yellow-300",
      red: "border-red-400 bg-red-500/20 text-red-300",
      indigo: "border-indigo-400 bg-indigo-500/20 text-indigo-300",
      cyan: "border-cyan-400 bg-cyan-500/20 text-cyan-300",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="p-2 border-b border-white/10">
      <div className="flex gap-1 overflow-x-auto justify-center">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && onTabChange(item.id)}
            disabled={item.disabled}
            className={`flex-shrink-0 p-1 md:px-3 md:py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              activeTab === item.id
                ? item.color
                  ? `${getTabColor(item.color)} border-2 shadow-lg`
                  : "bg-blue-500/20 text-blue-300 border-b-2 border-blue-400"
                : item.disabled
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-400 hover:text-gray-300 hover:bg-white/5 border-2 border-transparent"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {item.icon && (
                <span className="text-sm hidden md:inline">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
