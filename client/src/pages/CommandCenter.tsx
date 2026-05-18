import React from 'react';
import AIConfidenceCard from '../components/AIConfidenceCard';
import ThreatMap from '../components/ThreatMap';
import ThreatPulseChart from '../threat-core/ThreatPulseChart';
import ThreatTimeline from '../components/ThreatTimeline';
import { useDangenTelemetry } from '../neural-hooks/useDangenTelemetry';

const CommandCenter: React.FC = () => {
  const { activeThreats, blockedAttacks, confidenceScore } = useDangenTelemetry();

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AIConfidenceCard
          title="Neural DNA Scanner"
          value={`${confidenceScore}%`}
          status={confidenceScore > 90 ? 'Secure' : 'Alert'}
        />
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors"></div>
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2 z-10 font-mono">Neural Intrusion Matrix</h3>
          <p className="text-5xl font-mono text-purple-400 font-bold z-10 drop-shadow-[0_0_10px_rgba(123,97,255,0.8)]">{activeThreats}</p>
        </div>
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors"></div>
          <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2 z-10 font-mono">Quantum Shield Status</h3>
          <p className="text-5xl font-mono text-green-400 font-bold z-10 drop-shadow-[0_0_10px_rgba(0,255,163,0.8)]">{blockedAttacks}</p>
        </div>
      </div>

      {/* Middle Radar & Pulse Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-0 overflow-hidden relative" style={{ height: '400px' }}>
          <div className="absolute top-4 left-4 z-10 bg-[#0B1020]/80 p-3 rounded-lg border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              GeoPulse Radar
            </h2>
            <p className="text-xs text-cyan-400 font-mono mt-1">Scanning Global Darknet Signals</p>
          </div>
          <ThreatMap />
        </div>
        <div className="glass-panel p-4 flex flex-col h-[400px] overflow-hidden">
          <h2 className="text-lg font-semibold text-white mb-4 font-mono">Adaptive Risk Intelligence</h2>
          <ThreatPulseChart />
        </div>
      </div>

      {/* Bottom Timeline */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-white mb-4 font-mono">Live Threat Evolution Timeline</h2>
        <ThreatTimeline />
      </div>
    </div>
  );
};

export default CommandCenter;
