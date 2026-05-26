import React from 'react';
import { motion } from 'framer-motion';
import { useDangenTelemetry } from '../neural-hooks/useDangenTelemetry';

const ThreatStatistics: React.FC = () => {
  const { topAttackingCountries, countryPairCounters, activeThreats, globalIntensity } = useDangenTelemetry();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className="glass-panel p-5 space-y-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Threat Statistics</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Operational metrics</h2>
        </div>
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-red-300 border border-red-500/20">
          {activeThreats} vectors
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Top attack sources</div>
          <div className="mt-4 space-y-3">
            {topAttackingCountries.map((country) => (
              <div key={country.country} className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/10 bg-black/20 p-3">
                <div>
                  <p className="text-sm font-semibold text-white">{country.country}</p>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Threat pulses</p>
                </div>
                <span className="text-sm font-semibold text-red-300">{country.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#080b14]/90 p-4">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-500">Attack vectors</div>
          <div className="mt-4 space-y-3">
            {countryPairCounters.map((pair) => (
              <div key={pair.pair} className="rounded-2xl border border-red-500/10 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-2 text-sm text-white">
                  <span>{pair.pair}</span>
                  <span className="text-red-300 font-semibold">{pair.count}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-300" style={{ width: `${Math.min(100, pair.count * 9)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0b0d17]/80 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-gray-500">
          <span>Network risk saturation</span>
          <span className="text-red-300 font-semibold">{globalIntensity}%</span>
        </div>
        <div className="mt-3 h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-red-600 via-red-500 to-red-300" style={{ width: `${globalIntensity}%` }} />
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatStatistics;
