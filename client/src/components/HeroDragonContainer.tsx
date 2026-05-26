import React from 'react';
import { motion } from 'framer-motion';
import DragonCore3D from './DragonCore3D';

interface HeroDragonContainerProps {
  stage: number;
  mouseOffset?: { x: number; y: number };
}

const HeroDragonContainer: React.FC<HeroDragonContainerProps> = ({
  stage,
  mouseOffset = { x: 0, y: 0 },
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, y: 35 }}
      animate={{
        opacity: stage === 1 ? 0.35 : 1,
        scale: stage === 4 ? 1.0 : 0.94,
        y: stage >= 3 ? -10 : 25,
      }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg md:max-w-xl aspect-square flex items-center justify-center"
      style={{
        transform: `translate3d(calc(${mouseOffset.x}px * 0.75), calc(${mouseOffset.y}px * 0.75), 0)`,
      }}
    >
      {/* Outer spinning cyber radar ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-red-500/25"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        style={{
          boxShadow: '0 0 45px rgba(255, 0, 60, 0.05)',
        }}
      />

      {/* Layer 2 Pulsing glow border */}
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-red-500/20 shadow-[0_0_50px_rgba(255,0,60,0.35)]"
        animate={{
          scale: [1, 1.05, 1],
          borderColor: ['rgba(255, 0, 60, 0.2)', 'rgba(255, 0, 60, 0.45)', 'rgba(255, 0, 60, 0.2)'],
          boxShadow: [
            '0 0 50px rgba(255,0,60,0.35)',
            '0 0 70px rgba(255,0,60,0.65)',
            '0 0 50px rgba(255,0,60,0.35)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Layer 3 Fast-spinning ring */}
      <motion.div
        className="absolute inset-8 rounded-full border border-red-500/15"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
        style={{
          boxShadow: 'inset 0 0 25px rgba(255,0,60,0.15)',
        }}
      >
        {/* Glowing node coordinates */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,0,60,0.85)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,0,60,0.85)]" />
      </motion.div>

      {/* Layer 4 Orbiting rings */}
      <motion.div
        className="absolute inset-16 rounded-full border border-red-500/10"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(255,0,60,0.6)]" />
      </motion.div>

      {/* Core 3D Dragon Canvas */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <DragonCore3D bootStage={stage} />
      </div>

      {/* Laser target grids sweep (Stage 1 boot) */}
      {stage === 1 && (
        <motion.div
          className="absolute inset-0 rounded-full border border-red-500/80 pointer-events-none"
          animate={{
            scale: [0.3, 1.1, 0.3],
            opacity: [0.1, 0.9, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.8,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Stage 3 Threat shockwaves */}
      {stage >= 3 && (
        <motion.div
          className="absolute -inset-16 rounded-full border border-red-500/10 pointer-events-none"
          animate={{
            scale: [1, 1.22, 1],
            opacity: [0.25, 0, 0.25],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.div>
  );
};

export default HeroDragonContainer;
