import React from 'react';

const NeuralAttackTimeline: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Neural Attack Timeline</h1>
        <p className="text-sm text-gray-500 font-mono">Visualize the sequence of active attack phases and alert escalation.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            {[
              { label: '00:12', desc: 'Recon scan completed' },
              { label: '00:14', desc: 'Initial C2 beaconing' },
              { label: '00:18', desc: 'Credential abuse observed' },
            ].map(item => (
              <div key={item.label} className="rounded-2xl bg-black/40 p-4 border border-white/10">
                <div className="text-xs text-cyan-300 uppercase tracking-[0.2em]">{item.label}</div>
                <div className="mt-2 text-white font-semibold">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Threat Phase Progress</div>
            <div className="mt-5 space-y-3">
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-red-500" style={{ width: '70%' }} />
              </div>
              <div className="text-sm text-gray-300">70% of the attack kill chain has been observed; containment suggested.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralAttackTimeline;
