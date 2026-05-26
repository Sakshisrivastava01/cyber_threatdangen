import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const INITIAL_LOGS = [
  { id: 1, time: '14:38:02', source: '185.220.101.45', target: 'US-EAST-01', type: 'SQL Injection', severity: 'CRITICAL', status: 'BLOCKED' },
  { id: 2, time: '14:38:15', source: '45.142.195.12', target: 'EU-CENTRAL-04', type: 'Brute Force SSH', severity: 'HIGH', status: 'MITIGATED' },
  { id: 3, time: '14:38:29', source: '194.165.16.89', target: 'AP-SOUTH-02', type: 'DDoS Flood', severity: 'CRITICAL', status: 'SCRUBBING' },
  { id: 4, time: '14:38:42', source: '91.108.56.11', target: 'US-WEST-02', type: 'Zero-Day Exploit', severity: 'HIGH', status: 'CONTAINED' },
  { id: 5, time: '14:38:55', source: '5.188.206.50', target: 'SA-EAST-01', type: 'Botnet C2 Beacon', severity: 'MEDIUM', status: 'INTERCEPTED' },
];

const VECTORS = [
  { name: 'SQL Injection', count: 1429, risk: '94%', trend: '+12%' },
  { name: 'DDoS Flood', count: 3841, risk: '88%', trend: '+25%' },
  { name: 'Brute Force SSH', count: 892, risk: '75%', trend: '-5%' },
  { name: 'Zero-Day Exploit', count: 156, risk: '98%', trend: '+40%' },
];

const NeuralIntrusion: React.FC = () => {
  const [logs, setLogs] = useState(INITIAL_LOGS);

  useEffect(() => {
    const interval = setInterval(() => {
      const types = ['SQL Injection', 'Brute Force SSH', 'DDoS Flood', 'Zero-Day Exploit', 'Botnet C2 Beacon', 'XSS Injection'];
      const severities = ['MEDIUM', 'HIGH', 'CRITICAL'];
      const statuses = ['BLOCKED', 'MITIGATED', 'SCRUBBING', 'CONTAINED', 'INTERCEPTED'];
      
      const newLog = {
        id: Date.now(),
        time: new Date().toTimeString().split(' ')[0],
        source: `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
        target: ['US-EAST-01', 'EU-CENTRAL-04', 'AP-SOUTH-02', 'US-WEST-02', 'SA-EAST-01'][Math.floor(Math.random()*5)],
        type: types[Math.floor(Math.random()*types.length)],
        severity: severities[Math.floor(Math.random()*severities.length)],
        status: statuses[Math.floor(Math.random()*statuses.length)],
      };

      setLogs(prev => [newLog, ...prev.slice(0, 7)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 font-sans text-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 font-mono">Neural Intrusion Matrix</h1>
        <p className="text-sm text-gray-500 font-mono">Real-time attack pattern analysis & vector classification</p>
      </div>

      {/* Vector Classification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {VECTORS.map((vec, i) => (
          <motion.div
            key={vec.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
            <div className="flex justify-between items-start mb-3">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{vec.name}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">{vec.risk} RISK</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-mono font-bold text-white">{vec.count}</span>
              <span className="text-xs font-mono text-red-400">{vec.trend}</span>
            </div>
            <div className="h-1 bg-white/5 rounded mt-3 overflow-hidden">
              <div className="h-full bg-purple-500 rounded" style={{ width: vec.risk }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Mitigation Confidence */}
        <div className="glass-panel p-6 space-y-6">
          <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Mitigation Engine
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Signature Matching', val: 98.4, color: 'bg-cyan-500' },
              { label: 'Behavioral Heuristics', val: 94.2, color: 'bg-purple-500' },
              { ml: 'Quantum Scrubbing', val: 91.8, color: 'bg-green-500' },
              { label: 'Zero-Day Prediction', val: 87.5, color: 'bg-yellow-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">{item.label || item.ml}</span>
                  <span className="text-white font-bold">{item.val}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded overflow-hidden">
                  <div className={`h-full ${item.color} rounded`} style={{ width: `${item.val}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg space-y-2">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">AUTONOMOUS STATUS</div>
            <p className="text-xs text-gray-400 leading-relaxed font-mono">
              Neural DNA synchronization active. All incoming malicious packets are currently scrubbed at the quantum ingress layer before reaching internal infrastructure.
            </p>
          </div>
        </div>

        {/* Right: Live Intrusion Logs */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Intrusion Intercepts
            </h2>
            <span className="text-xs font-mono text-gray-500">AUTONOMOUS INTERCEPT</span>
          </div>
          <div className="overflow-x-auto flex-1 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">SOURCE IP</th>
                  <th className="py-3 px-4">TARGET NODE</th>
                  <th className="py-3 px-4">ATTACK TYPE</th>
                  <th className="py-3 px-4">SEVERITY</th>
                  <th className="py-3 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {logs.map((log) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, backgroundColor: 'rgba(255,46,99,0.2)' }}
                    animate={{ opacity: 1, backgroundColor: 'transparent' }}
                    transition={{ duration: 0.5 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-400">{log.time}</td>
                    <td className="py-3 px-4 text-cyan-400">{log.source}</td>
                    <td className="py-3 px-4 text-gray-300">{log.target}</td>
                    <td className="py-3 px-4 text-purple-400">{log.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_8px_rgba(255,46,99,0.3)]' :
                        log.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                        {log.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralIntrusion;
