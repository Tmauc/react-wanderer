import React from "react";

interface LiveStatsProps {
  stats: {
    collisionCount: number;
    currentSpeed: number;
    currentPosition: { x: number; y: number };
    fps: number;
    isHovered: boolean;
  };
}

const LiveStats: React.FC<LiveStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
      <h3 className="text-sm font-semibold text-white mb-2">📊 Statistiques</h3>

      <div className="grid grid-cols-5 gap-2">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">
            {stats.collisionCount}
          </div>
          <div className="text-xs text-gray-400">Collisions</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {stats.currentSpeed.toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Vitesse</div>
        </div>

        <div className="text-center">
          <div className="text-sm font-bold text-purple-400">
            ({stats.currentPosition.x.toFixed(0)},{" "}
            {stats.currentPosition.y.toFixed(0)})
          </div>
          <div className="text-xs text-gray-400">Position</div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">{stats.fps}</div>
          <div className="text-xs text-gray-400">FPS</div>
        </div>

        <div className="text-center">
          <div
            className={`text-lg font-bold ${
              stats.isHovered ? "text-red-400" : "text-gray-400"
            }`}
          >
            {stats.isHovered ? "🟢" : "⚪"}
          </div>
          <div className="text-xs text-gray-400">Survol</div>
        </div>
      </div>

      {/* Barre de progression pour la vitesse */}
      <div className="mt-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Vitesse</span>
          <span>{stats.currentSpeed.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-1.5 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min((stats.currentSpeed / 10) * 100, 100)}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LiveStats;
