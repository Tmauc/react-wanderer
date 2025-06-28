import React, { useState } from "react";
import type { WandererConfig } from "./InteractiveDemo";

interface CodeDisplayProps {
  config: WandererConfig;
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({ config }) => {
  const [activeTab, setActiveTab] = useState<"tsx" | "json">("tsx");

  const generateTSXCode = () => {
    const indent = (level: number) => "  ".repeat(level);

    const formatValue = (value: unknown, level: number = 0): string => {
      if (typeof value === "boolean") {
        return value.toString();
      }
      if (typeof value === "number") {
        return value.toString();
      }
      if (typeof value === "string") {
        return `"${value}"`;
      }
      if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return `[\n${indent(level + 1)}${value
          .map((v) => formatValue(v, level + 1))
          .join(",\n" + indent(level + 1))}\n${indent(level)}]`;
      }
      if (typeof value === "object" && value !== null) {
        const entries = Object.entries(value);
        if (entries.length === 0) return "{}";
        return `{\n${entries
          .map(
            ([k, v]) => `${indent(level + 1)}${k}: ${formatValue(v, level + 1)}`
          )
          .join(",\n")}\n${indent(level)}}`;
      }
      return "null";
    };

    const sections = Object.entries(config)
      .map(([sectionName, sectionConfig]) => {
        const entries = Object.entries(sectionConfig).filter(
          ([, value]) => value !== undefined
        );
        if (entries.length === 0) return null;

        return `${indent(2)}${sectionName}: {\n${entries
          .map(([key, value]) => `${indent(3)}${key}: ${formatValue(value, 3)}`)
          .join(",\n")}\n${indent(2)}}`;
      })
      .filter(Boolean);

    return `import Wanderer from "./components/Wanderer";

function MyWanderer() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="w-full h-96 relative overflow-hidden">
      <Wanderer
        src="/path/to/image.png"
        alt="Mon Wanderer"
        width={50}
        height={50}
        parentRef={containerRef}
${sections.join(",\n")}
      />
    </div>
  );
}`;
  };

  const generateJSONCode = () => {
    return JSON.stringify(config, null, 2);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Vous pourriez ajouter une notification de succès ici
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sous-onglets pour le type de code */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("tsx")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === "tsx"
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            TypeScript/React
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === "json"
                ? "bg-blue-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            JSON
          </button>
        </div>

        <button
          onClick={() =>
            copyToClipboard(
              activeTab === "tsx" ? generateTSXCode() : generateJSONCode()
            )
          }
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          📋 Copier le code
        </button>
      </div>

      {/* Zone de code */}
      <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-y-auto max-h-96">
        <pre className="text-sm text-gray-300 h-full">
          <code>
            {activeTab === "tsx" ? generateTSXCode() : generateJSONCode()}
          </code>
        </pre>
      </div>

      {/* Informations */}
      <div className="mt-4 text-xs text-gray-400">
        <p>
          💡 Le code ci-dessus reflète exactement la configuration actuelle de
          votre Wanderer.
        </p>
        <p>
          🎯 Utilisez ce code comme point de départ pour intégrer le Wanderer
          dans votre projet.
        </p>
      </div>
    </div>
  );
};

export default CodeDisplay;
