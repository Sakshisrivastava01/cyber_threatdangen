import React, { type ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#060913] text-gray-300 font-sans flex flex-col relative overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>
      
      {/* Navbar */}
      <header className="h-16 border-b border-white/10 bg-dangen-dark/80 backdrop-blur-md z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-dangen-cyan/20 border border-dangen-cyan flex items-center justify-center neon-border">
            <span className="text-dangen-cyan font-bold text-xl leading-none">D</span>
          </div>
          <h1 className="text-xl font-display font-bold tracking-widest text-white">
            DANGEN <span className="text-dangen-cyan text-sm font-normal">AI DEFENSE</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dangen-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-dangen-green"></span>
            </span>
            <span className="text-xs uppercase tracking-wider text-dangen-green">System Active</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 z-10 relative overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
