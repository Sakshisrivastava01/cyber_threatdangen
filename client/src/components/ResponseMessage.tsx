import React from 'react';
import { motion } from 'framer-motion';

export type ResponseMessageRole = 'core' | 'user' | 'system';

interface ResponseMessageProps {
  role: ResponseMessageRole;
  text: string;
  time: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

const severityStyles = {
  low: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  high: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-300 border-red-500/20',
};

const ResponseMessage: React.FC<ResponseMessageProps> = ({ role, text, time, severity }) => {
  const label = role === 'user' ? 'COMMAND' : role === 'core' ? 'DANGEN CORE' : 'SYSTEM';
  const accent = role === 'core' ? 'border-red-500/20 bg-[#100712]/90' : 'border-white/10 bg-white/5';
  const glowClass = role === 'core' && severity === 'high' ? 'intel-response-glow' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-3xl border p-4 shadow-[0_0_20px_rgba(0,0,0,0.18)] ${accent} ${glowClass}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.32em] font-mono text-gray-400">
        <span>{label}</span>
        <span>{time}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-100 whitespace-pre-wrap">{text}</p>
      {severity ? (
        <div className={`mt-4 inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] ${severityStyles[severity]}`}>
          {severity.toUpperCase()}
        </div>
      ) : null}
    </motion.div>
  );
};

export default ResponseMessage;
