import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';
import { useDangenTelemetry, type ThreatEvent } from '../neural-hooks/useDangenTelemetry';

const getTopAttackTypes = (events: ThreatEvent[]) => {
  const counts = events.reduce<Record<string, number>>((acc, ev) => {
    const type = ev.type || 'UNKNOWN';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => ({ type, count }));
};

const ThreatPanel: React.FC = () => {
  const { events, confidenceScore, activeThreats, globalIntensity } = useDangenTelemetry();

  const trends = useMemo(() => getTopAttackTypes(events), [events]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="glass-panel p-5 space-y-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Threat Advisory</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Predictive attack posture</h2>
        </div>
        <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-red-300">
          {confidenceScore > 92 ? 'Secure' : 'Monitoring'}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Most likely vector</p>
          <p className="mt-3 text-2xl font-semibold text-white">{trends[0]?.type || 'Adaptive defense'}</p>
          <p className="mt-2 text-xs text-gray-400">Estimated escalation from current neural attack surface.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Threat curve</p>
          <p className="mt-3 text-2xl font-semibold text-white">{globalIntensity}%</p>
          <p className="mt-2 text-xs text-gray-400">Live risk intensity as measured across the network mesh.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Confidence</div>
          <div className="mt-3 text-3xl font-semibold text-white">{confidenceScore}%</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Threat horizon</div>
          <div className="mt-3 text-3xl font-semibold text-red-300">{activeThreats}</div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Active models</div>
          <div className="mt-3 text-3xl font-semibold text-white">14</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0b0d17]/80 p-4 text-sm text-gray-300 space-y-3">
        <div className="flex items-center gap-2 text-gray-400 text-[10px] uppercase tracking-[0.35em] font-semibold">
          <FiAlertTriangle size={14} className="text-red-400" /> Security Recommendations
        </div>
        <ul className="space-y-2">
          <li className="rounded-2xl border border-red-500/15 bg-red-500/5 px-3 py-2">Increase IDS sensitivity on remote access gateways.</li>
          <li className="rounded-2xl border border-red-500/15 bg-red-500/5 px-3 py-2">Elevate authentication checks for anomalous east-west traffic.</li>
          <li className="rounded-2xl border border-red-500/15 bg-red-500/5 px-3 py-2">Deploy containment rules for the top predicted vector.</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ThreatPanel;
