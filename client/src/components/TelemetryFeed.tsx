import { motion } from 'framer-motion';
import type { FC } from 'react';

interface TelemetryFeedProps {
  entries: string[];
}

const TelemetryFeed: FC<TelemetryFeedProps> = ({ entries }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="glass-panel p-5 flex flex-col gap-4 pointer-events-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-bold">TELEMETRY FEED</div>
          <div className="text-[8px] text-gray-400 uppercase tracking-[0.4em] mt-1">LIVE THREAT STREAM</div>
        </div>
        <span className="text-[8px] text-red-300 uppercase tracking-[0.35em]">REALTIME</span>
      </div>

      <div className="space-y-2 text-[9px] font-mono text-red-200 overflow-hidden">
        {entries.slice(0, 6).map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 bg-black/30 border border-red-500/10 rounded px-3 py-2">
            <span className="text-gray-400 text-[8px] uppercase tracking-[0.35em]">{entry.split(' ')[0]}</span>
            <span className="break-words text-white/90">{entry}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 text-[8px] text-gray-400 uppercase tracking-[0.35em]">
        <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        <span>NODE PACKETS STREAMING</span>
      </div>
    </motion.div>
  );
};

export default TelemetryFeed;
