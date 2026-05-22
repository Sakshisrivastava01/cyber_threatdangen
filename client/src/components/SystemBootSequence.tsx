import { motion } from 'framer-motion';
import type { FC } from 'react';

interface SystemBootSequenceProps {
  bootLines: string[];
  percent: number;
  typedLength: number;
  packetSent: number;
  packetReceived: number;
  stage: number;
  onSkip: () => void;
}

const COMMAND_LINE = 'CONNECTING TO GLOBAL THREAT GRID...';
const STATUS_LINE = '[ SUCCESS ]';

const SystemBootSequence: FC<SystemBootSequenceProps> = ({ bootLines, percent, typedLength, packetSent, packetReceived, stage, onSkip }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="glass-panel p-5 select-text pointer-events-auto flex flex-col gap-4 max-h-[80vh] overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] text-red-500 font-bold uppercase tracking-[0.3em]">SYSTEM BOOT</div>
          <div className="text-[8px] text-gray-400 uppercase tracking-[0.4em] mt-1">DANGEN CORE INITIALIZATION</div>
        </div>
        <button
          onClick={onSkip}
          className="text-[8px] text-red-300 uppercase tracking-[0.35em] border border-red-500/30 rounded px-2 py-1 hover:bg-red-500/10 transition"
        >
          SKIP
        </button>
      </div>

      <div className="flex flex-col gap-1 text-[10px] font-mono text-red-300 min-h-[210px] overflow-hidden">
        {bootLines.map((line, idx) => (
          <div key={idx} className="whitespace-nowrap overflow-hidden text-left text-red-300/90">{line}</div>
        ))}

        {stage === 2 && (
          <div className="mt-2 space-y-2">
            <div className="whitespace-nowrap overflow-hidden text-left text-red-200">
              {'> '}
              <span>{COMMAND_LINE.slice(0, typedLength)}</span>
              <span className="text-red-400 font-bold">{typedLength < COMMAND_LINE.length ? '█' : ''}</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-red-400 mt-1">
              <span className="uppercase tracking-[0.2em] font-bold">SYSTEM STATUS</span>
              <motion.span
                animate={{ opacity: stage === 2 && typedLength === COMMAND_LINE.length ? [0.9, 0.2, 0.9] : [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className={typedLength === COMMAND_LINE.length ? 'text-emerald-300' : 'text-red-300'}
              >
                {typedLength === COMMAND_LINE.length ? STATUS_LINE : '[ ESTABLISHING ]'}
              </motion.span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[8px] text-gray-400 mt-3">
              <div className="bg-black/40 border border-red-500/15 rounded px-2 py-2">
                <div className="text-red-300 uppercase tracking-[0.25em]">PACKETS TX</div>
                <div className="text-white font-semibold">{packetSent.toLocaleString()}</div>
              </div>
              <div className="bg-black/40 border border-red-500/15 rounded px-2 py-2">
                <div className="text-red-300 uppercase tracking-[0.25em]">PACKETS RX</div>
                <div className="text-white font-semibold">{packetReceived.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="w-full h-2 bg-red-950/40 rounded overflow-hidden mt-2 border border-red-500/10">
        <motion.div
          className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-300"
          animate={{ width: `${Math.max(percent, 5)}%` }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

export default SystemBootSequence;
