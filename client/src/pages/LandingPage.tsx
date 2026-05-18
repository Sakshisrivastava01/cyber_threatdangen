import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberGlobe from '../threat-core/CyberGlobe';

interface LandingPageProps {
  onEnter: () => void;
}

const BOOT_LINES = [
  '> INITIALIZING DANGEN CORE v4.0...',
  '> CONNECTING GLOBAL NEURAL NODES...',
  '> ACTIVATING QUANTUM SHIELD MATRIX...',
  '> SCANNING INTERNATIONAL NETWORKS...',
  '> DETECTING ACTIVE INTRUSION VECTORS...',
  '> THREAT MATRIX ONLINE. DEFENSE ENGAGED.',
];

const LIVE_EVENTS = [
  { id: 1, text: 'INTRUSION DETECTED — 185.220.101.45 → US-EAST', color: '#FF2E63' },
  { id: 2, text: 'NEURAL BLOCK APPLIED — DARKNET SIGNAL SUPPRESSED', color: '#00FFA3' },
  { id: 3, text: 'DDoS WAVE IDENTIFIED — 43,000 PACKETS/SEC', color: '#FF2E63' },
  { id: 4, text: 'AI MITIGATION PROTOCOL ACTIVE — THREAT CONTAINED', color: '#00E5FF' },
  { id: 5, text: 'ZERO-DAY SIGNATURE FLAGGED — CONFIDENCE: 97.3%', color: '#7B61FF' },
];

const STATS = [
  { label: 'THREATS BLOCKED', value: 48291, suffix: '' },
  { label: 'NODES ONLINE', value: 1842, suffix: '' },
  { label: 'AI CONFIDENCE', value: 97, suffix: '%' },
  { label: 'UPTIME', value: 99.98, suffix: '%' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [liveEventIdx, setLiveEventIdx] = useState(0);
  const [stats, setStats] = useState(STATS.map(s => ({ ...s, current: 0 })));
  const [warningVisible, setWarningVisible] = useState(false);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    let cancelled = false;

    const runLine = () => {
      if (cancelled) return;
      if (i >= BOOT_LINES.length) {
        setTimeout(() => { if (!cancelled) setBootDone(true); }, 500);
        return;
      }
      setBootLines(prev => [...prev, BOOT_LINES[i]]);
      i++;
      setTimeout(runLine, 420);
    };

    // Small initial delay so StrictMode double-invoke doesn't race
    const startTimer = setTimeout(runLine, 100);
    return () => {
      cancelled = true;
      clearTimeout(startTimer);
    };
  }, []);


  // Animate counters after boot
  useEffect(() => {
    if (!bootDone) return;
    const duration = 1500;
    const steps = 40;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats(STATS.map(s => ({
        ...s,
        current: +(s.value * Math.min(progress, 1)).toFixed(s.value < 100 ? 2 : 0),
      })));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    // Automatic transition after 4.5 seconds of admiring the hero screen
    const autoEnterTimer = setTimeout(() => {
      onEnter();
    }, 4500);

    return () => {
      clearInterval(timer);
      clearTimeout(autoEnterTimer);
    };
  }, [bootDone, onEnter]);

  // Rotate live events
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveEventIdx(i => (i + 1) % LIVE_EVENTS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Flashing warning pulse
  useEffect(() => {
    const interval = setInterval(() => setWarningVisible(v => !v), 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050816]">
      {/* Animated World Map */}
      <CyberGlobe />

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 4px)'
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,8,22,0.85) 100%)' }}
      />

      {/* Top header bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-4 border-b border-cyan-500/20 bg-[#050816]/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-cyan-400 bg-cyan-400/10 rounded flex items-center justify-center shadow-[0_0_12px_#00E5FF]">
            <span className="text-cyan-400 font-bold text-lg">D</span>
          </div>
          <div>
            <span className="text-white font-bold tracking-[0.2em] text-sm">DANGEN</span>
            <span className="text-cyan-400 text-[10px] tracking-widest ml-2">NEURAL OS v4.0</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className={`px-2 py-1 border rounded transition-colors ${warningVisible ? 'border-red-500/70 text-red-400 bg-red-500/10' : 'border-red-500/30 text-red-500/50 bg-transparent'}`}>
            ⚠ GLOBAL THREAT ACTIVE
          </div>
          <div className="flex items-center gap-2 text-cyan-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            QUANTUM SHIELD ACTIVE
          </div>
        </div>
      </div>

      {/* Main content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8">
        <AnimatePresence>
          {!bootDone ? (
            // Boot terminal
            <motion.div
              key="boot"
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
              className="w-full max-w-2xl bg-[#050816]/80 border border-cyan-500/30 rounded-xl p-8 backdrop-blur-md shadow-[0_0_60px_rgba(0,229,255,0.1)]"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-500/20">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-cyan-400/60 text-xs font-mono">dangen-os — neural-boot-sequence</span>
              </div>
              <div className="space-y-2 min-h-[160px]">
                {bootLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono text-sm text-cyan-300"
                  >
                    {line}
                  </motion.div>
                ))}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="font-mono text-cyan-400 text-sm"
                >█</motion.span>
              </div>
            </motion.div>
          ) : (
            // Main hero content
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Warning badge */}
              <motion.div
                animate={{ opacity: warningVisible ? 1 : 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 border border-red-500/50 rounded-full bg-red-500/10 text-red-400 text-xs font-mono mb-8 shadow-[0_0_20px_rgba(255,46,99,0.2)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block"></span>
                GLOBAL THREAT DETECTED — 6 ACTIVE ATTACK VECTORS
              </motion.div>

              {/* Main title */}
              <motion.h1
                initial={{ letterSpacing: '0.5em', opacity: 0 }}
                animate={{ letterSpacing: '0.15em', opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-[0.15em]"
                style={{ textShadow: '0 0 40px rgba(0,229,255,0.4), 0 0 80px rgba(0,229,255,0.1)' }}
              >
                DANGEN
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-cyan-400 text-lg md:text-2xl font-light tracking-[0.3em] mb-2"
              >
                AI CYBER DEFENSE
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-gray-400 text-sm tracking-widest mb-12 font-mono"
              >
                REAL-TIME AUTONOMOUS THREAT INTELLIGENCE
              </motion.p>

              {/* Live stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="grid grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto"
              >
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="text-2xl font-mono font-bold text-cyan-400">{stat.current}{stat.suffix}</div>
                    <div className="text-[10px] text-gray-500 tracking-wider mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={onEnter}
                  className="px-8 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 font-mono text-sm tracking-widest rounded hover:bg-cyan-400/30 transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] active:scale-95"
                >
                  ⚡ LAUNCH COMMAND CENTER
                </button>
                <button
                  className="px-8 py-3 bg-purple-500/10 border border-purple-500/50 text-purple-300 font-mono text-sm tracking-widest rounded hover:bg-purple-500/20 transition-all hover:shadow-[0_0_25px_rgba(123,97,255,0.3)] active:scale-95"
                >
                  🧬 ACTIVATE NEURAL SCAN
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom live event feed */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/10 bg-[#050816]/70 backdrop-blur-sm px-8 py-3 flex items-center justify-between">
        <span className="text-[10px] font-mono text-gray-600 tracking-widest">LIVE NEURAL FEED</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={liveEventIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[11px] tracking-wider"
            style={{ color: LIVE_EVENTS[liveEventIdx].color }}
          >
            {LIVE_EVENTS[liveEventIdx].text}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] font-mono text-gray-600 tracking-widest">{new Date().toUTCString()}</span>
      </div>
    </div>
  );
};

export default LandingPage;
