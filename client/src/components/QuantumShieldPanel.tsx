import { motion } from 'framer-motion';
import type { FC } from 'react';

interface QuantumShieldPanelProps {
  status?: string;
}

const QuantumShieldPanel: FC<QuantumShieldPanelProps> = ({ status = 'ACTIVE' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="glass-panel p-5 flex flex-col gap-4 pointer-events-auto"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-bold">QUANTUM SHIELD</div>
          <div className="text-[8px] text-gray-400 uppercase tracking-[0.4em] mt-1">CORE DEFENSE MATRIX</div>
        </div>
        <span className="text-[8px] text-green-400 uppercase tracking-[0.35em]">{status}</span>
      </div>

      <div className="relative w-full h-36 rounded-3xl bg-black/20 border border-red-500/15 overflow-hidden">
        <motion.div
          className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_center,rgba(255,0,80,0.18),transparent_42%)]"
          animate={{ opacity: [0.35, 0.12, 0.35] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-24 h-24 rounded-full border border-red-500/30 backdrop-blur-sm">
            <div className="absolute inset-0 rounded-full border border-red-500/40 blur-xl opacity-60" />
            <div className="absolute inset-5 rounded-full bg-red-500/15" />
            <div className="absolute inset-12 rounded-full bg-red-500/40 blur-sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400">
        <div className="bg-black/30 rounded border border-red-500/10 p-3">
          <div className="text-[8px] uppercase tracking-[0.35em] text-red-300">FIELD STRENGTH</div>
          <div className="text-white font-semibold mt-1">98.9%</div>
        </div>
        <div className="bg-black/30 rounded border border-red-500/10 p-3">
          <div className="text-[8px] uppercase tracking-[0.35em] text-red-300">RESPONSE</div>
          <div className="text-white font-semibold mt-1">14ms</div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuantumShieldPanel;
