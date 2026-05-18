import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchProps {
  onComplete: () => void;
}

const GlitchTransition: React.FC<GlitchProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#050816] z-50 flex flex-col items-center justify-center overflow-hidden font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glitch Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,229,255,0.05) 0px, rgba(0,229,255,0.05) 1px, transparent 1px, transparent 4px)'
        }}
      />

      {/* Cyber Grid Pulse */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ repeat: Infinity, duration: 0.4 }}
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Center Synchronization HUD */}
      <div className="z-20 text-center space-y-6 max-w-lg px-6">
        <motion.div
          animate={{ x: [-10, 10, -5, 5, 0], opacity: [1, 0.4, 1, 0.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.3 }}
          className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-white"
          style={{ textShadow: '0 0 30px rgba(0,229,255,0.8), 0 0 60px rgba(255,46,99,0.8)' }}
        >
          DANGEN
        </motion.div>

        <div className="p-4 bg-cyan-500/10 border border-cyan-400/50 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.3)] backdrop-blur-md relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
          />

          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            className="text-cyan-400 text-sm md:text-base tracking-[0.3em] font-bold"
          >
            HOLOGRAPHIC SYNCHRONIZATION...
          </motion.div>

          <div className="mt-4 text-[10px] md:text-xs text-gray-400 space-y-1 font-mono text-left">
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.1 }}>&gt; ACTIVATING NEURAL DNA SCANNER...</motion.div>
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.1, delay: 0.3 }}>&gt; DEPLOYING QUANTUM RADAR SENSORS...</motion.div>
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.1, delay: 0.6 }}>&gt; INGRESS SCRUBBING ONLINE...</motion.div>
            <motion.div animate={{ opacity: [0, 1] }} transition={{ duration: 0.1, delay: 0.9 }} className="text-green-400">&gt; SECURE HANDSHAKE ESTABLISHED.</motion.div>
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,229,255,0.4)]">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default GlitchTransition;
