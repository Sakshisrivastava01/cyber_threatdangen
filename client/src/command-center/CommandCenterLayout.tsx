import React, { type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { FiActivity, FiShield, FiMap, FiServer, FiCpu, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import FloatingAssistant from '../components/FloatingAssistant';

interface LayoutProps {
  children: ReactNode;
}

const sidebarVariants: Variants = {
  hidden: { x: -250, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 50, damping: 20 }
  }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.5 }
  }
};

const NAV_ITEMS = [
  { path: '/dashboard',           label: 'Command Center',       icon: <FiActivity size={18} />,    desc: 'Live threat overview' },
  { path: '/intrusion',           label: 'Neural Intrusion',     icon: <FiShield size={18} />,      desc: 'Attack pattern matrix' },
  { path: '/radar',               label: 'Quantum Radar',        icon: <FiMap size={18} />,         desc: 'Global threat sweep' },
  { path: '/darknet',             label: 'Darknet Signals',      icon: <FiServer size={18} />,      desc: 'Underground tor scraper' },
  { path: '/device-intelligence', label: 'Device Intelligence',  icon: <FiCpu size={18} />,         desc: 'AI device & IP scanner' },
  { path: '/threat-lab',          label: 'Threat Prediction Lab',icon: <FiTrendingUp size={18} />,  desc: 'ML forecasting & curves' },
  { path: '/ai-analytics',        label: 'AI Analytics Core',    icon: <FiCheckCircle size={18} />, desc: 'Autonomous copilot advice' },
];

const CommandCenterLayout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentItem = NAV_ITEMS.find(item => item.path === location.pathname) || NAV_ITEMS[0];

  return (
    <div className="flex h-screen bg-[#060913] text-gray-300 font-sans overflow-hidden">

      {/* Animated Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="w-72 border-r border-white/10 bg-[#0B1020]/90 backdrop-blur-xl flex flex-col z-20 shrink-0"
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl translate-x-10 -translate-y-10 pointer-events-none" />
          <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,60,0.3)] z-10 overflow-hidden">
            <img src="/dangen-logo.jpg" alt="DANGEN Logo" className="w-full h-full object-cover" />
          </div>
          <div className="z-10">
            <h1 className="text-base font-bold tracking-[0.2em] text-white leading-tight font-mono">DANGEN</h1>
            <span className="text-red-500 text-[10px] uppercase tracking-widest leading-none block font-mono mt-1">Warfare Command OS</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest px-3 pt-1 pb-2 font-mono font-semibold">Core Systems & Intel</p>
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${
                  active
                    ? 'bg-red-500/15 text-red-500 border border-red-500/40 shadow-[0_0_15px_rgba(255,0,60,0.25)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={active ? 'text-red-500' : 'text-gray-500 group-hover:text-gray-300 transition-colors'}>{item.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-sm leading-tight truncate font-semibold">{item.label}</div>
                  <div className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors truncate mt-0.5">{item.desc}</div>
                </div>
                {active && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0 shadow-[0_0_8px_#ff003c]" />}
              </button>
            );
          })}
        </nav>

        {/* Status footer */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-white/[0.02]">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>NEURAL NET</span>
            <span className="text-red-500 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
            <span>QUANTUM SHIELD</span>
            <span className="text-red-500 font-bold">ACTIVE</span>
          </div>
          <div className="h-1 bg-white/5 rounded overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 w-[94%] rounded animate-pulse" />
          </div>
          <p className="text-[10px] text-gray-600 font-mono">THREAT MITIGATION: 94.2%</p>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative min-w-0">

        {/* Cyber grid background */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none ambient-grid" />
        <div className="absolute inset-0 z-0 pointer-events-none noise-layer" />

        {/* Top bar */}
        <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 z-10 bg-[#0B000F]/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white tracking-wider font-mono uppercase">
              {currentItem.label}
            </h2>
            <span className="text-red-500/60 text-xs font-mono hidden sm:block">
              — {currentItem.desc}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded text-[10px] font-mono text-red-500 shadow-[0_0_8px_rgba(255,0,60,0.2)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              QUANTUM SHIELD ACTIVE
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto z-10 custom-scrollbar">
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
        <FloatingAssistant />
      </div>
    </div>
  );
};

export default CommandCenterLayout;
