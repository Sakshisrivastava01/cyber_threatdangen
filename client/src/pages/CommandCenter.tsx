import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ThreatMap from '../components/ThreatMap';
import ThreatPulseChart from '../threat-core/ThreatPulseChart';
import ThreatTimeline from '../components/ThreatTimeline';
import { useDangenTelemetry } from '../neural-hooks/useDangenTelemetry';
import SystemStatusBar from '../components/SystemStatusBar';
import ThreatPanel from '../components/ThreatPanel';
import ThreatFeed from '../components/ThreatFeed';
import NeuralActivity from '../components/NeuralActivity';
import QuantumShield from '../components/QuantumShield';
import ThreatStatistics from '../components/ThreatStatistics';
import LiveTerminal from '../components/LiveTerminal';

const CommandCenter: React.FC = () => {
  const { events, confidenceScore } = useDangenTelemetry();

  const neuralValues = useMemo(
    () => Array.from({ length: 24 }, (_, index) => Math.max(8, Math.min(28, Math.round(12 + Math.sin(index * 0.45) * 8 + (confidenceScore - 80) * 0.35)))),
    [confidenceScore]
  );

  return (
    <motion.div
      className="space-y-6 relative"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <SystemStatusBar />

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="glass-panel p-0 overflow-hidden border-red-500/30 shadow-[0_0_40px_rgba(255,0,60,0.1)]"
          style={{ minHeight: '700px' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.06),transparent_40%)] pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-transparent to-red-500 opacity-80" />
          <div className="relative z-10 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">GeoPulse Command Grid</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Global threat surface visualization</h2>
              </div>
              <div className="rounded-full border border-red-500/20 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-red-300">
                Integrated threat mesh live
              </div>
            </div>
          </div>
          <ThreatMap />
        </motion.div>

        <div className="space-y-6">
          <ThreatPanel />
          <ThreatFeed events={events} />
          <div className="grid gap-6 lg:grid-cols-2">
            <NeuralActivity values={neuralValues} />
            <QuantumShield />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
        <ThreatStatistics />
        <LiveTerminal />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.06 }}
          className="glass-panel p-6 bg-[#080b14]/90 border border-red-500/20"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Risk Forecast</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Adaptive risk intelligence</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gray-400">AUTOMATED</span>
          </div>
          <ThreatPulseChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="glass-panel p-6 bg-[#080b14]/90 border border-red-500/20"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Threat Timeline</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Live evolution</h2>
            </div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gray-400">Historical</span>
          </div>
          <ThreatTimeline />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommandCenter;
