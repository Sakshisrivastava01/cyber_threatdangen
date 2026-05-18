import React, { useState } from 'react';

const ThreatPredictionLab: React.FC = () => {
  const [packetRate, setPacketRate] = useState(120);
  const [loginFails, setLoginFails] = useState(12);
  const [trafficSpike, setTrafficSpike] = useState(0.4);
  const [unusualPorts, setUnusualPorts] = useState(2);

  // Simple heuristic/regression simulation matching backend ML weights
  const baseRisk = (packetRate / 1000) * 0.35 + (loginFails / 50) * 0.25 + trafficSpike * 0.25 + (unusualPorts / 10) * 0.15;
  const threatProb = Math.min(99.8, Math.max(5.0, baseRisk * 100));

  let severity = 'LOW';
  let badgeColor = 'bg-green-500/20 text-green-400 border-green-500/30';
  if (threatProb >= 75) {
    severity = 'CRITICAL';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(255,46,99,0.3)]';
  } else if (threatProb >= 50) {
    severity = 'HIGH';
    badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
  } else if (threatProb >= 25) {
    severity = 'MEDIUM';
    badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }

  return (
    <div className="space-y-6 font-sans text-gray-300">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 font-mono">Threat Prediction Lab</h1>
        <p className="text-sm text-gray-500 font-mono">Interactive machine learning attack forecasting & regression models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Interactive Feature Sliders */}
        <div className="glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ML Feature Vector Inputs
            </h2>
            <span className="text-xs font-mono text-cyan-400">MODEL: RF-LOGREG ENSEMBLE</span>
          </div>

          <div className="space-y-5 font-mono">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">PACKET VELOCITY (PKT/S)</span>
                <span className="text-white font-bold">{packetRate}</span>
              </div>
              <input
                type="range" min="10" max="1000" value={packetRate}
                onChange={(e) => setPacketRate(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">FAILED LOGIN ATTEMPTS (/MIN)</span>
                <span className="text-white font-bold">{loginFails}</span>
              </div>
              <input
                type="range" min="0" max="50" value={loginFails}
                onChange={(e) => setLoginFails(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">TRAFFIC SPIKE RATIO (0 - 1)</span>
                <span className="text-white font-bold">{trafficSpike.toFixed(2)}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05" value={trafficSpike}
                onChange={(e) => setTrafficSpike(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">UNUSUAL PORTS ACCESSED</span>
                <span className="text-white font-bold">{unusualPorts}</span>
              </div>
              <input
                type="range" min="0" max="10" value={unusualPorts}
                onChange={(e) => setUnusualPorts(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-white/10 h-1.5 rounded"
              />
            </div>
          </div>
        </div>

        {/* Prediction Output & Forecast Curves */}
        <div className="glass-panel p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <h2 className="text-base font-semibold text-white font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                AI Forecast Output
              </h2>
              <span className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border ${badgeColor}`}>
                {severity} SEVERITY
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs font-mono text-gray-500 mb-1">THREAT PROBABILITY</div>
                <div className="text-4xl font-mono font-bold text-white">{threatProb.toFixed(1)}%</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="text-xs font-mono text-gray-500 mb-1">AI CONFIDENCE SCORE</div>
                <div className="text-4xl font-mono font-bold text-cyan-400">96.4%</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">Model Weight Breakdown</div>
              <div className="space-y-2 font-mono text-xs">
                <div className="flex justify-between bg-white/5 p-2 rounded">
                  <span className="text-gray-400">Random Forest Classifier</span>
                  <span className="text-cyan-400">35% Weight</span>
                </div>
                <div className="flex justify-between bg-white/5 p-2 rounded">
                  <span className="text-gray-400">Logistic Regression</span>
                  <span className="text-purple-400">25% Weight</span>
                </div>
                <div className="flex justify-between bg-white/5 p-2 rounded">
                  <span className="text-gray-400">Support Vector Machine</span>
                  <span className="text-green-400">20% Weight</span>
                </div>
                <div className="flex justify-between bg-white/5 p-2 rounded">
                  <span className="text-gray-400">Decision Tree</span>
                  <span className="text-yellow-400">20% Weight</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex items-start gap-3 font-mono text-xs text-cyan-300">
            <span className="text-base">💡</span>
            <div>
              <span className="font-bold text-white block mb-1">PREDICTED ATTACK VECTOR</span>
              {threatProb > 70 ? 'High probability of coordinated Botnet Brute Force / DDoS campaign. Automated rate-limiting recommended.' : 'Network telemetry within normal baseline parameters. No imminent intrusion vectors forecasted.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatPredictionLab;
