import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiShield, FiZap, FiWifi } from 'react-icons/fi';
import { useDangenTelemetry } from '../neural-hooks/useDangenTelemetry';

const SystemStatusBar: React.FC = () => {
  const { activeThreats, blockedAttacks, confidenceScore, globalIntensity, wsStatus } = useDangenTelemetry();

  const statusBadge = wsStatus === 'connected'
    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
    : 'text-amber-300 bg-amber-500/10 border-amber-500/20';

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="glass-panel p-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
    >
      <div className="col-span-2 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-gray-400">
            <span>Active Threats</span>
            <FiActivity size={18} className="text-red-400" />
          </div>
          <div className="mt-4 text-4xl font-semibold text-white">{activeThreats}</div>
          <p className="mt-2 text-xs text-gray-500">Live attack vectors currently mapped.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-gray-400">
            <span>Blocked Attacks</span>
            <FiShield size={18} className="text-red-400" />
          </div>
          <div className="mt-4 text-4xl font-semibold text-white">{blockedAttacks}</div>
          <p className="mt-2 text-xs text-gray-500">Threats neutralized by DANGEN defenses.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-gray-400">
          <span>System Confidence</span>
          <FiZap size={18} className="text-red-400" />
        </div>
        <div className="mt-4 text-4xl font-semibold text-white">{confidenceScore}%</div>
        <p className="mt-2 text-xs text-gray-500">Classification confidence across SOC models.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-gray-400">
          <span>Global Intensity</span>
          <FiWifi size={18} className="text-red-400" />
        </div>
        <div className="mt-4 text-4xl font-semibold text-white">{globalIntensity}%</div>
        <p className="mt-2 text-xs text-gray-500">Threat saturation and risk velocity.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.28em] text-gray-400">
          <span>Neural Feed</span>
          <span className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${statusBadge}`}>
            {wsStatus.toUpperCase()}
          </span>
        </div>
        <div className="mt-4 text-sm text-gray-300 leading-6">
          Live threat telemetry streaming into the command center with adaptive reconnection and continuous integrity checks.
        </div>
      </div>
    </motion.section>
  );
};

export default SystemStatusBar;
