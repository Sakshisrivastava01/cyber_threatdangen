import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDangenTelemetry } from '../neural-hooks/useDangenTelemetry';

const LiveTerminal: React.FC = () => {
  const { events } = useDangenTelemetry();

  const terminalLines = useMemo(() => {
    const lines = events.slice(0, 12).map((ev) => {
      const source = ev.source_country || ev.country || 'UNKNOWN';
      const target = ev.target_country || 'US';
      return `[${ev.timestamp}] [${ev.severity?.toUpperCase() || 'HIGH'}] ${ev.type.toUpperCase()} ${source}→${target} ${ev.ip}`;
    });

    return lines.length > 0 ? lines : [
      '[00:00:04] [INFO] Initializing neural feed scanner...',
      '[00:00:09] [WARN] Elevated botnet signature density detected.',
      '[00:00:15] [CRIT] Malicious payload staging observed in east-west segment.',
      '[00:00:22] [INFO] Quantum shield layer is fully engaged.',
      '[00:00:30] [OK] Endpoint firewall rules updated successfully.',
    ];
  }, [events]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="glass-panel p-5"
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Live Terminal</p>
          <h2 className="mt-2 text-lg font-semibold text-white">SOC Ops console</h2>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400">STREAMING</div>
      </div>

      <div className="rounded-3xl border border-red-500/10 bg-black/60 p-4 font-mono text-[11px] leading-6 text-gray-300 overflow-y-auto max-h-[420px] custom-scrollbar">
        {terminalLines.map((line, idx) => (
          <div key={idx} className="mb-2">
            <span className="text-red-400">›</span> <span>{line}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default LiveTerminal;
