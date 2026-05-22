import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import MatrixStream from '../components/MatrixStream';
import DragonCore3D from '../components/DragonCore3D';
import CyberAttackMap from '../components/CyberAttackMap';
import CinematicBackground from '../components/CinematicBackground';
import SystemBootSequence from '../components/SystemBootSequence';
import NeuralActivityPanel from '../components/NeuralActivityPanel';
import QuantumShieldPanel from '../components/QuantumShieldPanel';
import TelemetryFeed from '../components/TelemetryFeed';

interface LandingPageProps {
  onEnter: () => void;
}

const BOOT_LINES = [
  'INITIALIZING DANGEN CORE PROTOCOLS...',
  'LOADING COGNITIVE NEURAL INTERFACE...',
  'CONNECTING TO THREAT CORRELATION SHIELD...',
  'SYNCHRONIZING SECURE QUANTUM NODES...',
  'DEPLOYING DEFENSE MATRIX DEFLECTORS...',
  'CALIBRATING MACHINE LEARNING MODULES...',
  'SCANNING GLOBAL FIREWALL INFRASTRUCTURE...',
  'ESTABLISHING ENCRYPTED COMM TUNNELS...',
];

const STAGE_INFO = [
  { title: 'SYSTEM BOOT', subtitle: 'INITIATING secure launch protocols and hardware integrity scan.' },
  { title: 'CORE AUTHENTICATION', subtitle: 'Loading the dragon AI core and synchronizing neural mesh nodes.' },
  { title: 'TACTICAL INTEL ONLINE', subtitle: 'Acquiring global threat telemetry, tactical panels coming online.' },
  { title: 'SYSTEM ONLINE', subtitle: 'Primary command interface ready. Awaiting operator activation.' },
];

const COMMAND_LINE = 'CONNECTING TO GLOBAL THREAT GRID...';


const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [stage, setStage] = useState(1);
  const [percent, setPercent] = useState(0);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [activeLogText, setActiveLogText] = useState('STANDBY: WAITING FOR DEFENSE HANDSHAKE...');
  const [activeLogColor, setActiveLogColor] = useState('#ff003c');
  const [audioOscillation, setAudioOscillation] = useState<number[]>([]);
  const [telemetryEntries, setTelemetryEntries] = useState<string[]>([
    'INITIALIZING INTEL LATTICE...',
    'PROBING EXTERNAL GRID NODES...',
    'LOCKING ENCRYPTED CHANNELS...',
    'CALIBRATING THREAT PRIORITY BUFFER...',
  ]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [typedLength, setTypedLength] = useState(0);
  const [packetSent, setPacketSent] = useState(0);
  const [packetReceived, setPacketReceived] = useState(0);
  const [isActivating, setIsActivating] = useState(false);
  const [activationProgress, setActivationProgress] = useState(0);
  const stageBadgeRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const activationOverlayRef = useRef<HTMLDivElement>(null);
  const mouseRafRef = useRef<number | null>(null);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  
  // Create audio equalizer simulation data
  useEffect(() => {
    const interval = setInterval(() => {
      const bars = Array.from({ length: 16 }, () => Math.floor(Math.random() * 24) + 6);
      setAudioOscillation(bars);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  // Mouse-driven parallax for cinematic depth
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!pageRef.current) return;
      const bounds = pageRef.current.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 16;
      lastMouseRef.current = { x, y };
      if (mouseRafRef.current === null) {
        mouseRafRef.current = requestAnimationFrame(() => {
          setMouseOffset(lastMouseRef.current);
          mouseRafRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (mouseRafRef.current) cancelAnimationFrame(mouseRafRef.current);
    };
  }, []);

  // Typewriter-style command line during Stage 2
  useEffect(() => {
    if (stage !== 2) return;

    setTypedLength(0);
    const interval = window.setInterval(() => {
      setTypedLength(prev => {
        const next = Math.min(prev + 1, COMMAND_LINE.length);
        return next;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [stage]);

  // Packet transfer simulation during Stage 2
  useEffect(() => {
    if (stage !== 2) return;

    setPacketSent(0);
    setPacketReceived(0);
    const interval = window.setInterval(() => {
      setPacketSent(prev => prev + Math.max(1, Math.floor(Math.random() * 5)));
      setPacketReceived(prev => prev + Math.max(1, Math.floor(Math.random() * 4)));
    }, 180);

    return () => clearInterval(interval);
  }, [stage]);

  const handleActivate = () => {
    if (isActivating) return;
    setIsActivating(true);
    setActivationProgress(0);
    let progress = 0;

    const interval = window.setInterval(() => {
      progress = Math.min(100, progress + Math.floor(Math.random() * 12) + 8);
      setActivationProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => onEnter(), 360);
      }
    }, 60);

    if (activationOverlayRef.current) {
      gsap.fromTo(
        activationOverlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power1.out' }
      );
    }
  };

  // Handle stage progression
  useEffect(() => {
    if (stage === 1) {
      // Stage 1 duration: 2.8s
      const timer = setTimeout(() => setStage(2), 2800);
      return () => clearTimeout(timer);
    }

    if (stage === 2) {
      // Stage 2 (Boot Terminal): Counts percentage from 0 to 100
      let currentPct = 0;
      const interval = setInterval(() => {
        currentPct += 1.5;
        if (currentPct >= 100) {
          currentPct = 100;
          clearInterval(interval);
          setTimeout(() => setStage(3), 600);
        }
        setPercent(Math.floor(currentPct));
      }, 55);

      return () => clearInterval(interval);
    }

    if (stage === 3) {
      // Stage 3 (Map Activation): Displays attack lines
      const timer = setTimeout(() => setStage(4), 3200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Synchronize typewriter terminal lines with percent progress in Stage 2
  useEffect(() => {
    if (stage !== 2) return;

    const lineThresholds = [10, 22, 35, 48, 60, 72, 85, 96];
    const updatedLines: string[] = [];

    lineThresholds.forEach((threshold, idx) => {
      if (percent >= threshold) {
        updatedLines.push(`> ${BOOT_LINES[idx]}... [ OK ]`);
      }
    });

    // Blinking cursor added to the latest line if still booting
    if (percent < 100 && updatedLines.length < BOOT_LINES.length) {
      const nextLineIndex = updatedLines.length;
      updatedLines.push(`> ${BOOT_LINES[nextLineIndex]}...`);
    }

    setBootLines(updatedLines);
  }, [percent, stage]);

  const handleSkip = () => {
    setStage(4);
    setPercent(100);
    setBootLines(BOOT_LINES.map(line => `> ${line}... [ OK ]`));
  };

  // Receive telemetry updates from CyberAttackMap to keep feed active
  const handleAttackTriggered = (logText: string, color: string) => {
    setActiveLogText(logText);
    setActiveLogColor(color);
    setTelemetryEntries((prev) => [
      `${new Date().toLocaleTimeString([], { hour12: false })} ${logText}`,
      ...prev,
    ].slice(0, 6));
  };

  useEffect(() => {
    if (!stageBadgeRef.current) return;

    gsap.fromTo(
      stageBadgeRef.current,
      { y: -18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' }
    );
  }, [stage]);

  useEffect(() => {
    if (stage === 1) {
      setActiveLogText('BOOT SEQUENCE INITIATED. SECURE ROUTINES ONLINE.');
      setActiveLogColor('#ff3b58');
    }
    if (stage === 2) {
      setActiveLogText('NEURAL CORE SYNCING... ANTICIPATING DATA STREAMS.');
      setActiveLogColor('#ff5a7a');
    }
    if (stage === 3) {
      setActiveLogText('TACTICAL INTEL ACQUIRED. LOCKING GLOBAL THREAT GRID.');
      setActiveLogColor('#ff0066');
    }
    if (stage === 4) {
      setActiveLogText('SYSTEM ONLINE. AWAITING OPERATOR COMMAND...');
      setActiveLogColor('#8aff9a');
    }
  }, [stage]);

  return (
    <div
      ref={pageRef}
      className="relative w-screen h-screen overflow-hidden bg-[#0b000f] text-white flex flex-col justify-between p-6 select-none font-mono"
      style={{
        perspective: 1400,
        transformStyle: 'preserve-3d',
        '--parallax-x': `${mouseOffset.x}px`,
        '--parallax-y': `${mouseOffset.y}px`,
      } as React.CSSProperties}
    >
      <CinematicBackground stage={stage} />

      {/* Ambient Matrix Code Rain during Boot */}
      {stage === 2 && <MatrixStream opacity={0.2} />}

      {/* Live 3D Dragon Core (Three.js) */}
      {stage >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: stage === 1 ? 0.35 : 1, 
              scale: stage === 4 ? 1.0 : 0.95 
            }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="w-full max-w-lg md:max-w-2xl aspect-square flex items-center justify-center"
            style={{ transform: 'translate3d(calc(var(--parallax-x) * 0.8), calc(var(--parallax-y) * 0.8), 0)' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border border-red-500/20 blur-2xl opacity-30"
              animate={{ scale: [1, 1.04, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <DragonCore3D bootStage={stage} />
          </motion.div>
        </div>
      )}

      {/* Cyber Warfare Attack Map */}
      {stage >= 3 && (
        <div className="absolute inset-0 z-5 pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
            <CyberAttackMap onAttackTriggered={handleAttackTriggered} showHud={false} />
          </motion.div>
        </div>
      )}

      {/* SKIP INTRO BUTTON */}
      {stage < 4 && (
        <button
          onClick={handleSkip}
          className="absolute top-24 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-8 z-50 px-4 py-1.5 border border-red-500/40 text-red-400 bg-red-950/20 text-[10px] tracking-[0.2em] rounded hover:bg-red-500/20 hover:border-red-500 active:scale-95 transition-all cursor-pointer pointer-events-auto"
        >
          SKIP INITIALIZATION [ESC]
        </button>
      )}

      {/* ==================== 1. GLOBAL HEADER BAR ==================== */}
      <header
        className="relative w-full z-40 border-b border-red-500/20 bg-[#0b000f]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between rounded-lg shadow-[0_0_15px_rgba(255,0,60,0.05)]"
        style={{ transform: 'translate3d(calc(var(--parallax-x) / 2), calc(var(--parallax-y) / 2), 0)' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-red-500 bg-red-500/10 rounded flex items-center justify-center shadow-[0_0_20px_rgba(255,0,60,0.3)] overflow-hidden">
            <img src="/dangen-logo.jpg" alt="DANGEN Logo" className="w-full h-full object-cover scale-110" />
          </div>
          <div className="text-left">
            <h1 className="text-white font-bold tracking-[0.2em] text-sm">DANGEN</h1>
            <p className="text-red-500 text-[9px] tracking-widest font-bold">AI CYBER DEFENSE SYSTEM</p>
          </div>
        </div>
        
        <div className="hidden md:block text-center">
          <span className="text-gray-500 text-[10px] tracking-[0.25em]">DANGEN NEURAL INTERFACE v7.2.1</span>
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-2 text-red-500 font-bold bg-red-950/20 border border-red-500/30 px-3 py-1 rounded">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span>SHIELD MATRIX: ONLINE</span>
          </div>
        </div>
      </header>

      <div
        className="absolute left-1/2 top-[110px] -translate-x-1/2 z-40 pointer-events-none"
        ref={stageBadgeRef}
        style={{ transform: 'translate3d(calc(var(--parallax-x) / 1.6), calc(var(--parallax-y) / 1.6), 0)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="inline-flex flex-col items-center gap-2 rounded-3xl border border-red-500/20 bg-black/30 px-4 py-3 shadow-[0_0_35px_rgba(255,0,60,0.14)] backdrop-blur-xl"
        >
          <span className="text-[10px] uppercase tracking-[0.35em] text-red-400">{STAGE_INFO[stage - 1].title}</span>
          <span className="text-[9px] text-gray-400 max-w-[18rem] text-center">{STAGE_INFO[stage - 1].subtitle}</span>
        </motion.div>
      </div>

      {/* ==================== 2. MAIN CENTER HUD CONTAINER ==================== */}
      <main
        className="relative flex-grow flex flex-col lg:flex-row items-start justify-between gap-6 py-6 z-20 pointer-events-none"
        style={{ transform: 'translate3d(calc(var(--parallax-x) / 2.2), calc(var(--parallax-y) / 2.2), 0)' }}
      >
        <div className="flex flex-col gap-4 w-full lg:w-[28rem] pointer-events-auto">
          <SystemBootSequence
            bootLines={bootLines}
            percent={percent}
            typedLength={typedLength}
            packetSent={packetSent}
            packetReceived={packetReceived}
            stage={stage}
            onSkip={handleSkip}
          />

          {stage >= 3 && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <NeuralActivityPanel values={audioOscillation} />
              <QuantumShieldPanel />
            </div>
          )}
        </div>

        <div className="relative w-full lg:w-[42rem] pointer-events-none flex flex-col items-center justify-center">
          {stage === 4 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center text-center px-6">
              <motion.h2
                initial={{ opacity: 0, scale: 0.95, letterSpacing: '0.4em' }}
                animate={{ opacity: 1, scale: 1, letterSpacing: '0.25em' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="text-4xl md:text-6xl font-bold tracking-[0.25em] text-white"
                style={{ textShadow: '0 0 35px rgba(255,0,60,0.6), 0 0 70px rgba(255,0,60,0.2)' }}
              >
                WELCOME COMMANDER
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1.0 }}
                className="text-red-500/80 text-[10px] md:text-xs tracking-[0.4em] uppercase mt-4 font-bold"
              >
                ALL SYSTEMS OPERATIONAL — RED TEAM AI ONLINE
              </motion.p>
            </div>
          )}

          {stage >= 3 && (
            <TelemetryFeed entries={telemetryEntries} />
          )}
        </div>
      </main>

      {/* ==================== 3. SYSTEM LOADER BAR ==================== */}
      <footer className="relative w-full z-40 flex flex-col items-center gap-4">
        {/* Loading Progress Bar */}
        {stage <= 3 && (
          <div className="w-full max-w-2xl bg-black/50 border border-red-500/20 rounded p-4 backdrop-blur-md flex flex-col gap-2">
            <div className="flex justify-between text-[10px] text-red-400">
              <span className="animate-pulse">
                {stage === 1 ? 'SWEEPING SYSTEMS LASER SCAN...' : 'INITIALIZING SYSTEM INTERFACE...'}
              </span>
              <span className="font-bold">{stage === 1 ? 'SWEEP' : `${percent}%`}</span>
            </div>
            
            <div className="w-full h-1.5 bg-red-950/40 rounded overflow-hidden relative">
              {stage === 1 ? (
                // Scanner laser sweep
                <motion.div
                  className="h-full bg-red-500 w-1/3 rounded"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                />
              ) : (
                // Fill load percentage
                <div
                  className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded transition-all duration-75"
                  style={{ width: `${percent}%` }}
                />
              )}
            </div>
          </div>
        )}

        {/* CTA Launch Controls (Reveal in Stage 4) */}
        <AnimatePresence>
          {stage === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 80 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-2xl px-6 pointer-events-auto"
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-red-500/20 blur-xl opacity-40"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.12, 0.4] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.button
                  onClick={handleActivate}
                  whileHover={{ scale: 1.02, x: [0, 1, -1, 0], y: [0, -1, 1, 0] }}
                  whileTap={{ scale: 0.98 }}
                  className="relative z-10 w-full sm:w-auto px-10 py-3 bg-red-500/15 border border-red-400/60 text-red-100 font-mono text-sm tracking-[0.25em] rounded-full shadow-[0_0_30px_rgba(255,0,60,0.24)] hover:border-red-100 hover:bg-red-500/25 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_45%)] opacity-40" />
                  <span className="relative z-10">ACTIVATE DRAGON AI CORE</span>
                </motion.button>
                <span className="absolute inset-x-0 -bottom-5 text-[9px] text-gray-400 uppercase tracking-[0.35em]">
                  {isActivating ? `ENGAGING CORE ${activationProgress}%` : 'FINAL CORE ENGAGEMENT READY'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Sub-Logs & Telemetry Status Bar */}
        <div className="w-full border-t border-red-500/25 bg-[#0b000f]/80 backdrop-blur-md px-6 py-3 flex flex-col md:flex-row items-center justify-between text-[9px] text-gray-500 gap-2 mt-4 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-red-500 tracking-[0.1em] uppercase animate-pulse">NEURAL FEED</span>
            <span className="text-gray-300 tracking-wider font-semibold border-l border-red-950 pl-3 transition-colors" style={{ color: activeLogColor }}>
              {activeLogText}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="tracking-widest">RED TEAM AI ONLINE</span>
            <span className="tracking-widest">© 2026 DANGEN AI CYBER DEFENSE PLATFORM. ALL RIGHTS RESERVED.</span>
          </div>
        </div>
      </footer>

      {isActivating && (
        <div ref={activationOverlayRef} className="absolute inset-0 z-50 pointer-events-none bg-[#ff0016]/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,60,0.25),transparent_24%)] opacity-60" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center">
            <div className="relative w-72 h-72 rounded-full border border-red-400/30 blur-2xl opacity-70" />
          </div>
          <div className="absolute inset-x-0 top-[58%] flex justify-center">
            <div className="w-64 h-1 bg-red-400/30 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* STAGE 1 SCANNER LINE SWEEP EFFECT */}
      {stage === 1 && (
        <motion.div
          className="absolute left-0 right-0 h-1 bg-red-500/90 shadow-[0_0_20px_#ff003c] z-30 pointer-events-none"
          initial={{ top: '0%' }}
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};

export default LandingPage;
