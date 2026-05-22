import React, { useState } from 'react';

const ThreatPredictionLab: React.FC = () => {
  const [packetRate, setPacketRate] = useState(450);
  const [loginFails, setLoginFails] = useState(18);
  const [trafficSpike, setTrafficSpike] = useState(0.65);
  const [unusualPorts, setUnusualPorts] = useState(4);

  // Simple heuristic/regression simulation matching backend ML weights
  const baseRisk = (packetRate / 1000) * 0.35 + (loginFails / 50) * 0.25 + trafficSpike * 0.25 + (unusualPorts / 10) * 0.15;
  const threatProb = Math.min(99.8, Math.max(5.0, baseRisk * 100));
  const anomalyScore = Math.min(9.9, Math.max(0.2, (threatProb / 10) + (trafficSpike * 2)));

  let severity = 'LOW';
  let badgeColor = 'bg-green-500/20 text-green-400 border-green-500/30';
  if (threatProb >= 75) {
    severity = 'CRITICAL';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(255,0,60,0.4)]';
  } else if (threatProb >= 50) {
    severity = 'HIGH';
    badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(255,100,0,0.3)]';
  } else if (threatProb >= 25) {
    severity = 'MEDIUM';
    badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
  }

  // Dynamic graph coordinates based on threatProb
  const points = [
    { x: 0, y: 150 - (threatProb * 1.2) },
    { x: 100, y: 150 - (Math.min(99, threatProb * 1.05) * 1.2) },
    { x: 200, y: 150 - (Math.min(99, threatProb * 1.15) * 1.2) },
    { x: 300, y: 150 - (Math.min(99, threatProb * 0.95) * 1.2) },
    { x: 400, y: 150 - (Math.min(99, threatProb * 1.25) * 1.2) },
    { x: 500, y: 150 - (Math.min(99, threatProb * 1.35) * 1.2) },
    { x: 600, y: 150 - (Math.min(99, threatProb * 1.4) * 1.2) },
  ];
  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `${linePath} L 600,150 L 0,150 Z`;

  // Dynamic AI recommendations
  const getAiRecommendations = () => {
    if (threatProb >= 75) {
      return [
        'IMMEDIATE ACTION: Initiate BGP Blackholing on upstream routers.',
        'Deploy aggressive rate-limiting (max 50 req/s) across all API gateway endpoints.',
        'Enforce strict geo-blocking for anomalous origin ASNs.',
        'Rotate all active JWT signing keys and terminate idle sessions.'
      ];
    } else if (threatProb >= 50) {
      return [
        'ELEVATED RISK: Enable CAPTCHA challenges for all authentication endpoints.',
        'Throttle connection requests exceeding 200 packets/sec per IP.',
        'Inspect payload headers for SQLi / XSS anomaly signatures.'
      ];
    }
    return [
      'SYSTEM STABLE: Maintain standard automated SIEM log ingestion.',
      'Conduct routine vulnerability scanning on exposed edge microservices.',
      'Ensure automatic daily backups of core transactional databases are verified.'
    ];
  };

  return (
    <div className="space-y-8 font-sans text-gray-300">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-mono flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(255,0,60,0.8)]" />
          Threat Prediction Lab & AI Forecasting
        </h1>
        <p className="text-sm text-gray-400 font-mono">Interactive machine learning attack forecasting, anomaly scoring & regression modeling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ML Interactive Feature Sliders */}
        <div className="bg-[#14040a] border border-red-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,0,60,0.1)] space-y-8 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
            <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]"></span>
              ML Feature Vector Inputs
            </h2>
            <span className="text-xs font-mono font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30">MODEL: RF-LOGREG ENSEMBLE</span>
          </div>

          <div className="space-y-6 font-mono">
            <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Packet Velocity (PKT/S)</span>
                <span className="text-red-400 font-bold text-sm">{packetRate} PPS</span>
              </div>
              <input
                type="range" min="10" max="1000" value={packetRate}
                onChange={(e) => setPacketRate(Number(e.target.value))}
                className="w-full accent-red-500 bg-black/40 h-2 rounded-full border border-white/10"
              />
            </div>

            <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Failed Login Attempts (/MIN)</span>
                <span className="text-red-400 font-bold text-sm">{loginFails}</span>
              </div>
              <input
                type="range" min="0" max="50" value={loginFails}
                onChange={(e) => setLoginFails(Number(e.target.value))}
                className="w-full accent-red-500 bg-black/40 h-2 rounded-full border border-white/10"
              />
            </div>

            <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Traffic Spike Ratio (0 - 1)</span>
                <span className="text-red-400 font-bold text-sm">{trafficSpike.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05" value={trafficSpike}
                onChange={(e) => setTrafficSpike(Number(e.target.value))}
                className="w-full accent-red-500 bg-black/40 h-2 rounded-full border border-white/10"
              />
            </div>

            <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Unusual Ports Accessed</span>
                <span className="text-red-400 font-bold text-sm">{unusualPorts}</span>
              </div>
              <input
                type="range" min="0" max="10" value={unusualPorts}
                onChange={(e) => setUnusualPorts(Number(e.target.value))}
                className="w-full accent-red-500 bg-black/40 h-2 rounded-full border border-white/10"
              />
            </div>
          </div>
        </div>

        {/* Prediction Output & Forecast Curves */}
        <div className="bg-[#14040a] border border-red-500/20 rounded-2xl p-8 flex flex-col justify-between space-y-8 shadow-[0_0_40px_rgba(255,0,60,0.1)] backdrop-blur-xl">
          <div>
            <div className="flex items-center justify-between border-b border-red-500/20 pb-4 mb-6">
              <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]"></span>
                AI Forecast Output
              </h2>
              <span className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-widest font-bold border ${badgeColor}`}>
                {severity} SEVERITY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 font-mono">
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Attack Probability</div>
                <div className="text-4xl font-bold text-white">{threatProb.toFixed(1)}%</div>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
                <div className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wider">Anomaly Score</div>
                <div className="text-4xl font-bold text-red-400">{anomalyScore.toFixed(1)} / 10</div>
              </div>
            </div>

            <div className="space-y-3 font-mono">
              <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-2">Model Weight Breakdown</div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-semibold">Random Forest Classifier</span>
                  <span className="text-red-400 font-bold">35% Weight</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-semibold">Logistic Regression</span>
                  <span className="text-red-500 font-bold">25% Weight</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-semibold">Support Vector Machine</span>
                  <span className="text-orange-400 font-bold">20% Weight</span>
                </div>
                <div className="flex justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-semibold">Decision Tree</span>
                  <span className="text-yellow-400 font-bold">20% Weight</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-4 font-mono text-xs text-red-300 shadow-[0_0_20px_rgba(255,0,60,0.15)]">
            <span className="text-2xl animate-bounce">💡</span>
            <div>
              <span className="font-bold text-white block mb-1 uppercase tracking-wider text-sm">PREDICTED ATTACK VECTOR</span>
              {threatProb > 70 ? 'High probability of coordinated Botnet Brute Force / DDoS campaign. Automated rate-limiting recommended.' : 'Network telemetry within normal baseline parameters. No imminent intrusion vectors forecasted.'}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Trend Graph */}
      <div className="bg-[#14040a] border border-red-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,0,60,0.1)] backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]" />
            Threat Probability Forecasting Trend (Next 12 Hours)
          </h3>
          <span className="text-xs font-mono text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30">FORECAST HORIZON: T+12H</span>
        </div>
        <div className="h-56 w-full relative flex items-end pt-4">
          {/* SVG Line Graph */}
          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 150">
            <defs>
              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff003c" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ff003c" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            <line x1="0" y1="30" x2="600" y2="30" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="75" x2="600" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Area path */}
            <path d={areaPath} fill="url(#redGrad)" />
            {/* Line path */}
            <path d={linePath} fill="none" stroke="#ff003c" strokeWidth="3" filter="drop-shadow(0 0 6px #ff003c)" />
            
            {/* Dots */}
            {points.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#ff003c" strokeWidth="2" className="animate-pulse shadow-[0_0_8px_rgba(255,0,60,1)]" />
            ))}
          </svg>
        </div>
        <div className="flex justify-between text-xs font-mono text-gray-500 pt-2 border-t border-white/5 font-semibold">
          <span>NOW</span>
          <span>T+2H</span>
          <span>T+4H</span>
          <span>T+6H</span>
          <span>T+8H</span>
          <span>T+10H</span>
          <span>T+12H</span>
        </div>
      </div>

      {/* AI Recommendations Panel */}
      <div className="bg-[#14040a] border border-red-500/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,0,60,0.1)] backdrop-blur-xl space-y-4">
        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2 border-b border-red-500/20 pb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(0,255,100,0.8)]" />
          AI-Generated Security Recommendations
        </h3>
        <ul className="space-y-3 font-mono text-xs">
          {getAiRecommendations().map((rec, i) => (
            <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5 text-gray-300">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThreatPredictionLab;
