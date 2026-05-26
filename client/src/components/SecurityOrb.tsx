import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';

interface SecurityOrbProps {
  open: boolean;
  onClick: () => void;
}

const SecurityOrb: React.FC<SecurityOrbProps> = ({ open, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ scale: 1.04 }}
      className="security-orb group relative flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-[#12000d]/80 shadow-[0_0_40px_rgba(255,0,60,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
      aria-label={open ? 'Close security panel' : 'Open security panel'}
    >
      <span className="absolute inset-0 rounded-full bg-red-500/20 blur-xl opacity-70" />
      <span className="absolute inset-1 rounded-full border border-red-500/30" />
      <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-[0_0_25px_rgba(255,0,60,0.3)]">
        <FiMessageCircle size={22} />
      </div>
      <span className="security-orb-ring absolute inset-0 rounded-full border border-red-500/20 opacity-80" />
    </motion.button>
  );
};

export default SecurityOrb;
