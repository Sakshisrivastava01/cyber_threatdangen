import React from 'react';
import { motion } from 'framer-motion';

interface BootSequenceProps {
  bootLines: string[];
  percent: number;
  typedLength: number;
  packetSent: number;
  packetReceived: number;
  stage: number;
  onSkip?: () => void;
}

const COMMAND_LINE = 'CONNECTING TO GLOBAL THREAT GRID...';

const BootSequence: React.FC<BootSequenceProps> = ({
  bootLines,
  percent,
  typedLength,
  packetSent,
  packetReceived,
  stage,
  onSkip,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-black/60 border border-red-500/30 rounded-lg p-5 font-mono text-xs backdrop-blur-md shadow-[0_0_30px_rgba(255,0,60,0.15)] overflow-hidden"
    >
      {/* HUD futuristic grid background & corners */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,60,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em]">
            SYSTEM BOOT TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">
            SECURE ROUTE: ON
          </span>
          {onSkip && stage < 4 && (
            <button
              onClick={onSkip}
              className="text-[9px] text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded hover:bg-red-500/20 hover:text-white transition"
            >
              SKIP
            </button>
          )}
        </div>
      </div>

      {/* Terminal Log Output */}
      <div className="space-y-1 h-[180px] overflow-y-auto custom-scrollbar select-text pr-1 mb-4">
        {bootLines.map((line, idx) => (
          <div
            key={idx}
            className="text-red-400/90 leading-relaxed font-semibold flex items-center justify-between"
            style={{
              textShadow: '0 0 8px rgba(255, 59, 88, 0.2)',
            }}
          >
            <span className="truncate">{line}</span>
            <span className="text-[9px] text-emerald-400 font-bold opacity-80 shrink-0 ml-2">
              [OK]
            </span>
          </div>
        ))}

        {/* Typing Line */}
        {stage === 2 && (
          <div className="text-red-300 font-bold flex items-center">
            <span>&gt;&nbsp;</span>
            <span className="truncate">{COMMAND_LINE.substring(0, typedLength)}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-red-500"
            >
              █
            </motion.span>
          </div>
        )}

        {/* Blinking idle line when done booting */}
        {stage >= 3 && (
          <div className="text-gray-500 italic text-[10px]">
            &gt; STACK DAEMON READY. LISTEN_PORT: 8000
          </div>
        )}
      </div>

      {/* Metrics Section */}
      <div className="space-y-3 pt-3 border-t border-red-500/20">
        {/* Loading Progress */}
        <div>
          <div className="flex justify-between text-[9px] text-gray-400 uppercase tracking-widest mb-1">
            <span>CORE SYNCHRONIZATION</span>
            <span className="text-red-500 font-bold tracking-normal">{percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/60 border border-red-500/20 rounded overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400"
              style={{ width: `${percent}%` }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(255, 0, 60, 0.4)',
                  '0 0 18px rgba(255, 0, 60, 0.7)',
                  '0 0 10px rgba(255, 0, 60, 0.4)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2.2 }}
            />
          </div>
        </div>

        {/* Live Packet counters */}
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <div className="bg-red-950/15 border border-red-500/20 rounded px-2.5 py-1.5 flex flex-col">
            <span className="text-gray-500 uppercase tracking-wider mb-0.5">PACKETS TX</span>
            <span className="font-bold text-red-400">{packetSent.toLocaleString()}</span>
          </div>
          <div className="bg-red-950/15 border border-red-500/20 rounded px-2.5 py-1.5 flex flex-col">
            <span className="text-gray-500 uppercase tracking-wider mb-0.5">PACKETS RX</span>
            <span className="font-bold text-emerald-400">{packetReceived.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BootSequence;
