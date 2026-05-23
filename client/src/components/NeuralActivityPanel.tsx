import { motion } from 'framer-motion';
import type { FC } from 'react';

interface NeuralActivityPanelProps {
  values: number[];
}

const NeuralActivityPanel: FC<NeuralActivityPanelProps> = ({ values }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="glass-panel p-5 flex flex-col gap-4 pointer-events-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-bold">NEURAL ACTIVITY</div>
          <div className="text-[8px] text-gray-400 uppercase tracking-[0.4em] mt-1">LIVE NETWORK FEED</div>
        </div>
        <span className="text-[8px] text-green-400 uppercase tracking-[0.35em]">SYNCED</span>
      </div>

      <div className="relative h-24 bg-black/20 border border-red-500/10 rounded overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,0,60,0.05),transparent)] animate-[scan_4s_linear_infinite]" />
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-1 px-2 pb-2">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              animate={{ height: `${Math.max(8, value)}px` }}
              transition={{ duration: 0.12, ease: 'easeOut' }}
              className="w-[6px] bg-red-400 rounded-t-md"
              style={{ height: `${Math.max(8, value)}px` }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
        <div className="bg-black/30 rounded border border-red-500/10 p-3">
          <div className="text-[8px] uppercase tracking-[0.35em] text-red-300">FIREWALL NODE</div>
          <div className="text-white font-semibold mt-1">8/8 ACTIVE</div>
        </div>
        <div className="bg-black/30 rounded border border-red-500/10 p-3">
          <div className="text-[8px] uppercase tracking-[0.35em] text-red-300">AI THREAT SCORE</div>
          <div className="text-white font-semibold mt-1">97.4%</div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralActivityPanel;
