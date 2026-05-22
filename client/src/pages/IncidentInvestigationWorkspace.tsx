import React from 'react';

const IncidentInvestigationWorkspace: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Incident Investigation Workspace</h1>
        <p className="text-sm text-gray-500 font-mono">Centralized incident workbench for forensic summaries and response playbooks.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">Active Incident</h2>
          <p className="mt-3 text-gray-300 text-sm">Ransomware attack campaign detected inside enterprise DMZ.</p>
          <div className="mt-5 space-y-2 text-xs text-gray-400">
            <div>Severity: <span className="text-white">CRITICAL</span></div>
            <div>Vector: <span className="text-white">C2 Beaconing</span></div>
            <div>Affected Host: <span className="text-white">10.0.5.52</span></div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">Forensic Timeline</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-300">
            <li>• Initial beacon detected 00:14 UTC</li>
            <li>• Lateral movement observed 00:18 UTC</li>
            <li>• Backup resource accessed 00:22 UTC</li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">Response Playbook</h2>
          <ol className="mt-3 space-y-2 text-sm text-gray-300 list-decimal list-inside">
            <li>Isolate the affected DMZ segment.</li>
            <li>Collect volatile memory snapshots.</li>
            <li>Engage the SOC incident team.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default IncidentInvestigationWorkspace;
