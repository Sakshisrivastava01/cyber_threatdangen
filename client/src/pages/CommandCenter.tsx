import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ThreatMap from '../components/ThreatMap';
import ThreatPulseChart from '../threat-core/ThreatPulseChart';
import ThreatTimeline from '../components/ThreatTimeline';
import { useDangenTelemetry } from '../neural-hooks/useDangenTelemetry';
import { fetchGeoThreats } from '../services/api';

const CommandCenter: React.FC = () => {
  const { activeThreats, blockedAttacks, confidenceScore, wsStatus } = useDangenTelemetry();
  const [, setGeoThreats] = useState([]);

  useEffect(() => {
    async function loadThreats() {
      try {
        const data = await fetchGeoThreats();
        console.log('Geo Threats:', data);
        setGeoThreats(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadThreats();
  }, []);

  const socAlerts = [
    { tag: 'CRITICAL', message: 'Malware beacon detected from RU node...', tone: 'bg-red-500/15 text-red-300 border-red-500/30' },
    { tag: 'WARNING', message: 'Suspicious login attempt from VPN cluster...', tone: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    { tag: 'DDoS', message: 'Traffic anomaly detected on gateway cores...', tone: 'bg-pink-500/15 text-pink-300 border-pink-500/30' },
    { tag: 'ALERT', message: 'Phishing domain blacklisted by RAG enforcement...', tone: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  ];

  const analystActivities = [
    { time: 'now', action: 'Tier 1 analyst escalated suspicious beacon to containment mode.' },
    { time: '2m', action: 'Automated classifier flagged anomalous outbound traffic.' },
    { time: '5m', action: 'RAG assistant enriched IP reputation with darknet context.' },
    { time: '8m', action: 'Threat map updated with new RU → US intrusion vectors.' },
  ];

  const systemMetrics = [
    { label: 'Threat cycle', value: `${activeThreats + 12} active`, icon: 'LIVE' },
    { label: 'Shield latency', value: '18ms', icon: 'PING' },
    { label: 'Circuit health', value: `${confidenceScore}%`, icon: 'OK' },
  ];

  return (
    <motion.div
      className="space-y-6 relative"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <div className="glass-panel p-5 border-red-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.08),transparent_80%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500/30 shadow-[0_0_20px_rgba(255,0,60,0.15)]" />
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Live SOC Alert Ticker</p>
              <h2 className="mt-2 text-xl font-semibold text-white font-mono">Realtime threat feed</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-black/30 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-red-300">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              SEGMENT ACTIVE
            </div>
          </div>
          <div className="ticker-window rounded-3xl border border-white/10 bg-[#07090f]/90 px-4 py-3">
            <div className="ticker-track">
              {[...socAlerts, ...socAlerts].map((alert, index) => (
                <div key={`${alert.tag}-${index}`} className="ticker-entry rounded-full border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-200 border-white/10 bg-[#09080f]/80">
                  <span className={`ticker-tag ${alert.tone}`}>{alert.tag}</span>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="glass-panel p-5 relative overflow-hidden border-red-500/30"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.08),transparent_70%)] pointer-events-none" />
          <div className="panel-shimmer" />
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Analyst Activity Stream</p>
              <h3 className="text-lg font-semibold text-white">Live command center cadence</h3>
            </div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gray-400">{wsStatus === 'connected' ? 'NEURAL FEED LIVE' : 'RECONNECTING'}</span>
          </div>
          <div className="space-y-3 text-[12px] text-gray-300">
            {analystActivities.map((entry, index) => (
              <div key={index} className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-red-500/30 hover:bg-black/40">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-gray-500 font-mono">
                  <span>{entry.time}</span>
                  <span className="text-red-400">ACTIVE</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-100">{entry.action}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="glass-panel p-5 relative overflow-hidden border-red-500/30"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.06),transparent_70%)] pointer-events-none" />
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-red-300 font-mono">Tactical SOC Metrics</p>
              <h3 className="text-lg font-semibold text-white">System readiness</h3>
            </div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gray-400">{confidenceScore > 90 ? 'OPTIMAL' : 'STABLE'}</span>
          </div>
          <div className="space-y-3">
            {systemMetrics.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition hover:border-red-500/30 hover:bg-black/40">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-gray-500 font-mono mb-2">
                  <span>{stat.label}</span>
                  <span className="text-red-300">{stat.icon}</span>
                </div>
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          className="glass-panel p-6 relative overflow-hidden border-red-500/30 shadow-[0_0_40px_rgba(255,0,60,0.1)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.08),transparent_25%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-3 text-xs uppercase tracking-[0.35em] text-red-400 font-mono">Neural DNA Scanner</div>
            <p className="text-5xl font-semibold text-white font-mono drop-shadow-[0_0_15px_rgba(255,0,60,0.25)]">{confidenceScore}%</p>
            <p className="mt-3 text-sm text-gray-400">Predictive confidence across active threat surfaces.</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          className="glass-panel p-6 relative overflow-hidden border-red-500/30 shadow-[0_0_40px_rgba(255,0,60,0.1)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_30%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-3 text-xs uppercase tracking-[0.35em] text-red-400 font-mono">Neural Intrusion Matrix</div>
            <p className="text-5xl font-semibold text-red-300 font-mono drop-shadow-[0_0_15px_rgba(255,0,60,0.25)]">{activeThreats}</p>
            <p className="mt-3 text-sm text-gray-400">Threat vectors currently mapped across global feeds.</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          className="glass-panel p-6 relative overflow-hidden border-red-500/30 shadow-[0_0_40px_rgba(255,0,60,0.1)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,0,60,0.07),transparent_30%)] pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-3 text-xs uppercase tracking-[0.35em] text-red-400 font-mono">Quantum Shield Status</div>
            <p className="text-5xl font-semibold text-white font-mono drop-shadow-[0_0_15px_rgba(255,0,60,0.25)]">{blockedAttacks}</p>
            <p className="mt-3 text-sm text-gray-400">Hostile connections neutralized in the current cycle.</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="lg:col-span-2 glass-panel p-0 overflow-hidden relative"
          style={{ height: '420px' }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="cyber-particle left-10 top-12 h-24 w-24" />
            <div className="cyber-particle right-12 bottom-16 h-16 w-16" style={{ animationDuration: '9s' }} />
            <div className="cyber-particle left-1/2 top-24 h-20 w-20" style={{ animationDuration: '11s' }} />
          </div>
          <div className="absolute inset-0 scanline-overlay" />
          <div className="absolute top-4 left-4 z-20 bg-[#0B1020]/80 p-3 rounded-lg border border-red-500/20 backdrop-blur-sm shadow-[0_0_18px_rgba(255,0,60,0.2)]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              GeoPulse Radar
            </h2>
            <p className="text-xs text-red-300 font-mono mt-1">Cinematic geopolitical attack visualization</p>
          </div>
          <ThreatMap />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="glass-panel p-4 flex flex-col h-[420px] overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.08),transparent_35%)] pointer-events-none" />
          <h2 className="text-lg font-semibold text-white mb-4 font-mono">Adaptive Risk Intelligence</h2>
          <ThreatPulseChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.12 }}
        className="glass-panel p-6 relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500/20 pointer-events-none" />
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold text-white mb-4 font-mono">Live Threat Evolution Timeline</h2>
            <ThreatTimeline />
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#0b0e16]/70 p-5 shadow-[0_0_30px_rgba(255,0,60,0.12)]">
            <h3 className="text-sm uppercase tracking-[0.35em] text-red-300 mb-4">Tactical Overview</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <span>Agent availability</span>
                <span className="text-red-300 font-bold">94%</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <span>Threat radar latency</span>
                <span className="text-red-300 font-bold">18ms</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/5 p-4">
                <span>Alert priority</span>
                <span className="text-red-300 font-bold">Critical</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CommandCenter;
