import React from 'react';
import { motion } from 'framer-motion';
import ThreatMap from '../components/ThreatMap';

const NODES = [
  { country: 'United States', code: 'US-EAST', latency: '12ms', status: 'ACTIVE', load: '68%' },
  { country: 'Germany', code: 'EU-CENTRAL', latency: '24ms', status: 'ACTIVE', load: '82%' },
  { country: 'Japan', code: 'AP-NORTHEAST', latency: '45ms', status: 'ACTIVE', load: '54%' },
  { country: 'Singapore', code: 'AP-SOUTHEAST', latency: '38ms', status: 'ACTIVE', load: '91%' },
  { country: 'Brazil', code: 'SA-EAST', latency: '62ms', status: 'ACTIVE', load: '43%' },
];

const QuantumRadar: React.FC = () => {
  return (
    <div className="space-y-6 font-sans text-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 font-mono">Quantum Radar</h1>
        <p className="text-sm text-gray-500 font-mono">Global darknet signals sweep & international node telemetry</p>
      </div>

      {/* Main Radar Map */}
      <div className="glass-panel p-0 overflow-hidden relative" style={{ height: '500px' }}>
        <div className="absolute top-6 left-6 z-10 bg-[#0B1020]/90 p-4 rounded-xl border border-cyan-500/40 backdrop-blur-md shadow-[0_0_25px_rgba(0,229,255,0.25)] space-y-3 max-w-xs">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#00E5FF]"></span>
            <div>
              <h2 className="text-sm font-semibold text-white font-mono leading-none">Quantum Sweep</h2>
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-widest mt-1 block">360° Darknet Sensor</span>
            </div>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">RADAR FREQ:</span>
              <span className="text-cyan-300">142.8 GHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">NODES TRACKED:</span>
              <span className="text-white">1,842</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ANOMALY INDEX:</span>
              <span className="text-purple-400">0.042 (LOW)</span>
            </div>
          </div>
        </div>
        <ThreatMap />
      </div>

      {/* International Nodes Table */}
      <div className="glass-panel p-6 flex flex-col overflow-hidden">
        <h2 className="text-base font-semibold text-white font-mono mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          International Shield Nodes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {NODES.map((node, i) => (
            <motion.div
              key={node.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-mono font-bold text-white">{node.code}</div>
                  <div className="text-[10px] text-gray-500">{node.country}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                  {node.status}
                </span>
              </div>
              <div className="space-y-1 pt-2 border-t border-white/5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Latency:</span>
                  <span className="text-cyan-400">{node.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Node Load:</span>
                  <span className="text-white">{node.load}</span>
                </div>
              </div>
              <div className="h-1 bg-white/5 rounded overflow-hidden">
                <div className="h-full bg-cyan-400 rounded" style={{ width: node.load }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuantumRadar;
