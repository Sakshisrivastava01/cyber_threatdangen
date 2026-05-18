import React, { useState } from 'react';

const AIAnalyticsCore: React.FC = () => {
  const [anomalyScore] = useState(14.2);
  const [leakRisk] = useState(28.5);
  const [activeMitigations] = useState([
    { id: 1, name: 'IP Rate Limiting (185.220.*)', status: 'ACTIVE', impact: '-42% Malicious Packets' },
    { id: 2, name: 'Quantum Header Scrubbing', status: 'ACTIVE', impact: '100% Injection Block' },
    { id: 3, name: 'Tor Exit Node Blacklist', status: 'ACTIVE', impact: '842 Nodes Blocked' },
  ]);

  return (
    <div className="space-y-6 font-sans text-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 font-mono">AI Analytics Core</h1>
        <p className="text-sm text-gray-500 font-mono">Autonomous security recommendations & behavioral anomaly telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Behavioral Anomaly Scanner */}
        <div className="glass-panel p-6 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-colors pointer-events-none" />
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Behavioral Anomaly Index
          </h2>
          <div className="flex items-baseline justify-between">
            <span className="text-5xl font-mono font-bold text-cyan-400">{anomalyScore}%</span>
            <span className="text-xs font-mono text-cyan-300">BASELINE STABLE</span>
          </div>
          <div className="h-2 bg-white/5 rounded overflow-hidden">
            <div className="h-full bg-cyan-400 rounded" style={{ width: `${anomalyScore}%` }} />
          </div>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            Measures deviation from standard user session behavior and internal microservice communication baselines.
          </p>
        </div>

        {/* Data Leak Probability Meter */}
        <div className="glass-panel p-6 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-colors pointer-events-none" />
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            Data Leak Risk Index
          </h2>
          <div className="flex items-baseline justify-between">
            <span className="text-5xl font-mono font-bold text-yellow-400">{leakRisk}%</span>
            <span className="text-xs font-mono text-yellow-300">MODERATE</span>
          </div>
          <div className="h-2 bg-white/5 rounded overflow-hidden">
            <div className="h-full bg-yellow-500 rounded" style={{ width: `${leakRisk}%` }} />
          </div>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            Evaluates unencrypted outbound payload signatures and third-party API token exposure probability.
          </p>
        </div>

        {/* Autonomous Mitigation Assistant */}
        <div className="glass-panel p-6 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors pointer-events-none" />
          <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Autonomous Defense Status
          </h2>
          <div className="flex items-baseline justify-between">
            <span className="text-5xl font-mono font-bold text-purple-400">99.4%</span>
            <span className="text-xs font-mono text-green-400">OPTIMAL</span>
          </div>
          <div className="h-2 bg-white/5 rounded overflow-hidden">
            <div className="h-full bg-purple-500 rounded w-[99.4%]" />
          </div>
          <p className="text-xs text-gray-400 font-mono leading-relaxed">
            AI copilot actively deploying real-time kernel-level firewall rules and scrubbing policies.
          </p>
        </div>
      </div>

      {/* Active Mitigations Table */}
      <div className="glass-panel p-6 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Active Automated Mitigations
          </h2>
          <span className="text-xs font-mono text-cyan-400">AI COPILOT v4.0</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {activeMitigations.map(mit => (
            <div key={mit.id} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-white">{mit.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">
                  {mit.status}
                </span>
              </div>
              <div className="text-xs text-cyan-300 pt-2 border-t border-white/5">
                Impact: {mit.impact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Security Recommendations */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
          AI Security Recommendations & Mitigation Advice
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {[
            { title: 'Enforce Strict 2FA', desc: 'Require FIDO2 / hardware keys on all root SSH and AWS IAM accounts to prevent credential stuffing.' },
            { title: 'Revoke Excessive Permissions', desc: 'Audit internal microservices and revoke unused database write permissions within the staging cluster.' },
            { title: 'Close Suspicious Sessions', desc: 'Terminate 14 active user sessions originating from known Tor exit nodes in Eastern Europe.' },
            { title: 'Update Browser Security Patches', desc: 'Deploy automated MDM policy forcing Chrome/Edge update to v124 to patch CVE-2026-3041.' },
          ].map((rec, i) => (
            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-2 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center gap-2 text-white font-bold">
                <span className="text-cyan-400">✓</span> {rec.title}
              </div>
              <p className="text-gray-400 leading-relaxed">{rec.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsCore;
