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

const BootSequence: React.FC<BootSequenceProps> = ({
  bootLines,
  percent,
  typedLength,
  packetSent,
  packetReceived,
  stage,
}) => {
  const COMMAND_LINE = 'CONNECTING TO GLOBAL THREAT GRID...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="bg-black/60 border-2 border-red-500/30 rounded-xl p-6 font-mono text-sm backdrop-blur-md shadow-[0_0_40px_rgba(255,0,60,0.15)]"
    >
      {/* Title */}
      <div className="text-xs font-bold text-red-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]" />
        NEURAL INTERFACE BOOT SEQUENCE
      </div>

      {/* Terminal Output */}
      <div className="space-y-1.5 mb-6 h-[220px] overflow-y-auto custom-scrollbar">
        {bootLines.map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * idx, duration: 0.3 }}
            className="text-green-400 text-xs leading-relaxed"
            style={{
              textShadow: '0 0 10px rgba(138, 255, 154, 0.3)',
              fontWeight: 500,
            }}
          >
            {line}
          </motion.div>
        ))}

        {/* Blinking Cursor */}
        {stage === 2 && bootLines.length < 8 && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-green-400"
          >
            {'█'}
          </motion.div>
        )}
      </div>

      {/* Command Line Typing */}
      {stage === 2 && (
        <div className="mb-4 pb-4 border-t border-red-500/20 pt-4">
          <div className="text-green-400 text-xs">
            <span>{'> '}</span>
            <span>{COMMAND_LINE.substring(0, typedLength)}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="text-green-500"
            >
              {'█'}
            </motion.span>
          </div>
        </div>
      )}

      {/* Progress Bar and Stats */}
      <div className="space-y-3">
        {/* Loading Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] text-gray-400 uppercase tracking-wider">
            <span>INITIALIZATION PROGRESS</span>
            <span className="text-red-500 font-bold">{percent}%</span>
          </div>
          <div className="w-full h-2 bg-black/80 border border-red-500/20 rounded overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded"
              style={{ width: `${percent}%` }}
              animate={{
                boxShadow: [
                  '0 0 15px rgba(255, 0, 60, 0.5)',
                  '0 0 25px rgba(255, 0, 60, 0.8)',
                  '0 0 15px rgba(255, 0, 60, 0.5)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        </div>

        {/* Network Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-red-950/20 border border-red-500/20 rounded px-3 py-2">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">PACKETS SENT</div>
            <div className="text-sm font-bold text-red-400">{packetSent.toLocaleString()}</div>
          </div>
          <div className="bg-red-950/20 border border-red-500/20 rounded px-3 py-2">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-1">PACKETS RCV</div>
            <div className="text-sm font-bold text-green-400">{packetReceived.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mt-4 pt-4 border-t border-red-500/10 flex items-center gap-2 text-[10px]">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-gray-400">
          {stage === 1
            ? 'PERFORMING SYSTEM INTEGRITY SCAN...'
            : stage === 2
              ? 'BOOTING NEURAL CORE COMPONENTS...'
              : 'BOOT SEQUENCE COMPLETE'}
        </span>
      </div>
    </motion.div>
  );
};

export default BootSequence;
