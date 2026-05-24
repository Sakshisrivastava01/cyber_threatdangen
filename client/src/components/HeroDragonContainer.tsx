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
      initial={{ opacity: 0, scale: 0.8, y: 28 }}
      animate={{
        opacity: stage === 1 ? 0.35 : 1,
        scale: stage === 4 ? 1.0 : 0.95,
        y: stage >= 3 ? -18 : 16,
      }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="relative w-full max-w-lg md:max-w-2xl aspect-square flex items-center justify-center"
      style={{
        transform: `translate3d(calc(${mouseOffset.x}px * 0.8), calc(${mouseOffset.y}px * 0.8), 0)`,
      }}
    >
      {/* Outer pulsing energy ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-red-500/30 shadow-[0_0_40px_rgba(255,0,60,0.4)]"
        animate={{
          scale: [1, 1.08, 1],
          borderColor: [
            'rgba(255, 0, 60, 0.3)',
            'rgba(255, 0, 60, 0.6)',
            'rgba(255, 0, 60, 0.3)',
          ],
          boxShadow: [
            '0 0 40px rgba(255,0,60,0.4)',
            '0 0 60px rgba(255,0,60,0.8)',
            '0 0 40px rgba(255,0,60,0.4)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Secondary rotating ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-red-500/20"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
        style={{
          boxShadow: '0 0 30px rgba(255,0,60,0.2), inset 0 0 30px rgba(255,0,60,0.1)',
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(255,0,60,0.8)]" />
      </motion.div>

      {/* Tertiary fast-rotating ring */}
      <motion.div
        className="absolute inset-8 rounded-full border border-red-500/10"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
        style={{
          boxShadow: '0 0 20px rgba(255,0,60,0.15)',
        }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(255,0,60,0.6)]" />
      </motion.div>

      {/* Inner glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          boxShadow: [
            '0 0 60px rgba(255,0,60,0.4), inset 0 0 40px rgba(255,0,60,0.15)',
            '0 0 100px rgba(255,0,60,0.6), inset 0 0 60px rgba(255,0,60,0.25)',
            '0 0 60px rgba(255,0,60,0.4), inset 0 0 40px rgba(255,0,60,0.15)',
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dragon 3D Model */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <DragonCore3D bootStage={stage} />
      </div>

      {/* Scanning laser sweep (Stage 1) */}
      {stage === 1 && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent pointer-events-none"
          animate={{
            borderColor: [
              'rgba(255, 0, 60, 0)',
              'rgba(255, 0, 60, 0.8)',
              'rgba(255, 0, 60, 0)',
            ],
            boxShadow: [
              'inset 0 0 0px rgba(255,0,60,0)',
              'inset 0 0 40px rgba(255,0,60,0.6)',
              'inset 0 0 0px rgba(255,0,60,0)',
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            times: [0, 0.5, 1],
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Stage 3 Attack pulse indicator */}
      {stage >= 3 && (
        <motion.div
          className="absolute -inset-12 rounded-full border border-red-500/10 pointer-events-none"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeOut',
          }}
        />
      )}
    </motion.div>
  );
};

export default HeroDragonContainer;
