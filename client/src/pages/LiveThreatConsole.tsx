import React from 'react';

const LiveThreatConsole: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Live Threat Intelligence Console</h1>
        <p className="text-sm text-gray-500 font-mono">Stream threat events and severity scoring from the DANGEN neural engine.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-panel p-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">Realtime Alert Feed</div>
          <div className="rounded-3xl bg-slate-950/70 p-4 border border-white/10">
            <div className="space-y-3 text-sm text-gray-300">
              <p>• Attack stream ingestion from edge telemetry.</p>
              <p>• Severity and confidence computed per event.</p>
              <p>• SOC-grade triage pipeline ready for integration.</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Attack Scoring</div>
          <div className="rounded-3xl bg-slate-950/70 p-4 border border-white/10">
            <div className="text-3xl font-bold text-yellow-300">87%</div>
            <div className="text-sm text-gray-400">Current global attack severity rating</div>
          </div>
        </div>

        <div className="glass-panel p-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">AI Confidence</div>
          <div className="rounded-3xl bg-slate-950/70 p-4 border border-white/10">
            <div className="text-3xl font-bold text-pink-300">94%</div>
            <div className="text-sm text-gray-400">Confidence across attack classification models</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Event Highlights</div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>• New suspicious SSH brute force cluster detected from RU.</li>
            <li>• Phishing campaign flagged targeting employee account portals.</li>
            <li>• Ransomware beacon traffic elevated on segmentation boundary.</li>
          </ul>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <div className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4">Operational Guidance</div>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>• Apply immediate ACL updates for anomalous C2 flows.</li>
            <li>• Validate employee MFA activity for suspicious login attempts.</li>
            <li>• Lock down legacy SMB endpoints in the affected segment.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiveThreatConsole;
