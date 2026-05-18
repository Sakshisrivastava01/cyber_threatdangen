import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:8000';

type Tab = 'ip' | 'url' | 'mobile' | 'ml';

interface RiskResult {
  [key: string]: any;
}

const SeverityBadge = ({ level }: { level: string }) => {
  const map: Record<string, string> = {
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(255,46,99,0.3)]',
    HIGH:     'bg-orange-500/20 text-orange-400 border-orange-500/50',
    MEDIUM:   'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    LOW:      'bg-green-500/20 text-green-400 border-green-500/50',
    DANGEROUS:'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(255,46,99,0.3)]',
    SUSPICIOUS:'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    SAFE:     'bg-green-500/20 text-green-400 border-green-500/50',
  };
  const cls = map[level?.toUpperCase()] ?? 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  return (
    <span className={`px-3 py-1 rounded border text-xs font-mono uppercase tracking-wider ${cls}`}>
      {level}
    </span>
  );
};

const RiskMeter = ({ value, label }: { value: number; label: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs font-mono text-gray-400">
      <span>{label}</span>
      <span className={value >= 70 ? 'text-red-400' : value >= 40 ? 'text-yellow-400' : 'text-green-400'}>
        {value}%
      </span>
    </div>
    <div className="h-2 bg-white/5 rounded overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-full rounded ${value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
        style={{ boxShadow: value >= 70 ? '0 0 8px rgba(255,46,99,0.6)' : '' }}
      />
    </div>
  </div>
);

const ResultPanel = ({ result, loading }: { result: RiskResult | null; loading: boolean }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent"
        />
        <p className="text-cyan-400 font-mono text-sm animate-pulse">NEURAL ANALYSIS IN PROGRESS...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-600 space-y-3">
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-3xl">🛡</div>
        <p className="font-mono text-sm">Submit data above to begin AI analysis</p>
      </div>
    );
  }

  if (result.error) {
    return <p className="text-red-400 font-mono text-sm p-4">{result.error}</p>;
  }

  const riskScore       = result.risk_score ?? result.phishing_probability ?? 0;
  const severity        = result.severity ?? result.status;
  const indicators      = result.indicators ?? [];
  const recommendations = result.recommendations ?? [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <SeverityBadge level={severity} />
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block" />
          AI CONFIDENCE: <span className="text-cyan-400">{result.ai_confidence ?? 92}%</span>
        </div>
      </div>

      {/* Risk meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <RiskMeter value={Math.round(riskScore)} label="Overall Risk" />
        {result.phishing_probability !== undefined && (
          <RiskMeter value={Math.round(result.phishing_probability)} label="Phishing Probability" />
        )}
        {result.malware_probability !== undefined && (
          <RiskMeter value={Math.round(result.malware_probability)} label="Malware Probability" />
        )}
        {result.data_leak_risk !== undefined && (
          <RiskMeter value={Math.round(result.data_leak_risk)} label="Data Leak Risk" />
        )}
        {result.spyware_probability !== undefined && (
          <RiskMeter value={Math.round(result.spyware_probability)} label="Spyware Probability" />
        )}
        {result.threat_probability !== undefined && (
          <RiskMeter value={Math.round(result.threat_probability)} label="Threat Probability" />
        )}
      </div>

      {/* Attack vectors / predicted attack */}
      {result.predicted_attack && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-xs text-gray-400 font-mono mb-1">PREDICTED ATTACK TYPE</p>
          <p className="text-red-400 font-mono text-sm font-semibold">{result.predicted_attack}</p>
        </div>
      )}

      {/* ML model breakdown */}
      {result.model_breakdown && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">ML Model Breakdown</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(result.model_breakdown).map(([model, val]: [string, any]) => (
              <div key={model} className="flex justify-between text-xs font-mono bg-white/5 rounded px-3 py-2">
                <span className="text-gray-400 capitalize">{model.replace('_', ' ')}</span>
                <span className="text-cyan-400">{val}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attack vectors */}
      {result.attack_vectors?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Probable Attack Vectors</p>
          <div className="flex flex-wrap gap-2">
            {result.attack_vectors.map((v: string) => (
              <span key={v} className="px-2 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded">{v}</span>
            ))}
          </div>
        </div>
      )}

      {/* Indicators */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Risk Indicators</p>
        <ul className="space-y-1">
          {indicators.map((ind: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs font-mono text-gray-300">
              <span className="text-yellow-400 mt-0.5">⚠</span> {ind}
            </li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">AI Recommendations</p>
        <ul className="space-y-1">
          {recommendations.map((rec: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs font-mono text-gray-300">
              <span className="text-green-400 mt-0.5">✓</span> {rec}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default function DeviceAnalyzer() {
  const [tab, setTab] = useState<Tab>('ip');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  // IP form
  const [ip, setIp] = useState('');
  const [ports, setPorts] = useState('');
  const [failedLogins, setFailedLogins] = useState('0');
  const [trafficSpike, setTrafficSpike] = useState('0');

  // URL form
  const [url, setUrl] = useState('');

  // Mobile form
  const [apps, setApps] = useState('');
  const [permissions, setPermissions] = useState('');
  const [unknownSources, setUnknownSources] = useState(false);
  const [suspiciousUrls, setSuspiciousUrls] = useState('');

  // ML form
  const [mlPacketRate, setMlPacketRate] = useState('50');
  const [mlFailedLogins, setMlFailedLogins] = useState('1');
  const [mlSuspiciousReqs, setMlSuspiciousReqs] = useState('2');
  const [mlTrafficSpike, setMlTrafficSpike] = useState('0.05');
  const [mlGeoMismatch, setMlGeoMismatch] = useState('0.1');

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      let res;
      if (tab === 'ip') {
        res = await axios.post(`${API}/api/device/analyze-ip`, {
          ip, open_ports: ports ? ports.split(',').map(Number) : [],
          failed_logins: Number(failedLogins), traffic_spike: Number(trafficSpike),
        });
      } else if (tab === 'url') {
        res = await axios.post(`${API}/api/device/analyze-url`, { url });
      } else if (tab === 'mobile') {
        res = await axios.post(`${API}/api/device/mobile-risk`, {
          apps: apps ? apps.split(',').map(s => s.trim()) : [],
          permissions: permissions ? permissions.split(',').map(s => s.trim()) : [],
          unknown_sources: unknownSources,
          suspicious_urls: suspiciousUrls ? suspiciousUrls.split(',').map(s => s.trim()) : [],
        });
      } else {
        res = await axios.post(`${API}/api/ml/predict`, {
          packet_rate: Number(mlPacketRate),
          failed_logins: Number(mlFailedLogins),
          suspicious_reqs: Number(mlSuspiciousReqs),
          traffic_spike: Number(mlTrafficSpike),
          unusual_ports: 0.5,
          geo_mismatch: Number(mlGeoMismatch),
        });
      }
      setResult(res.data);
    } catch {
      setResult({ error: 'Analysis failed. Ensure backend is running at localhost:8000' });
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'ip',     label: 'IP Analysis',    icon: '🌐' },
    { id: 'url',    label: 'URL Scanner',     icon: '🔗' },
    { id: 'mobile', label: 'Mobile Risk',     icon: '📱' },
    { id: 'ml',     label: 'ML Predictor',    icon: '🧠' },
  ];

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 placeholder-gray-600 transition-colors";
  const labelClass = "block text-xs text-gray-500 font-mono uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Device Intelligence</h1>
        <p className="text-sm text-gray-500 font-mono">AI-powered threat analysis — provide data explicitly for scanning</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-mono transition-all flex items-center gap-2 ${
              tab === t.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            INPUT DATA FOR ANALYSIS
          </h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {tab === 'ip' && (
                <>
                  <div><label className={labelClass}>IP Address</label>
                    <input className={inputClass} placeholder="e.g. 185.220.101.45" value={ip} onChange={e => setIp(e.target.value)} /></div>
                  <div><label className={labelClass}>Open Ports (comma-separated)</label>
                    <input className={inputClass} placeholder="e.g. 22, 445, 3389" value={ports} onChange={e => setPorts(e.target.value)} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelClass}>Failed Logins</label>
                      <input className={inputClass} type="number" value={failedLogins} onChange={e => setFailedLogins(e.target.value)} /></div>
                    <div><label className={labelClass}>Traffic Spike (0–1)</label>
                      <input className={inputClass} type="number" step="0.1" value={trafficSpike} onChange={e => setTrafficSpike(e.target.value)} /></div>
                  </div>
                </>
              )}

              {tab === 'url' && (
                <div><label className={labelClass}>URL to Scan</label>
                  <input className={inputClass} placeholder="e.g. http://suspicious-login.xyz/verify" value={url} onChange={e => setUrl(e.target.value)} /></div>
              )}

              {tab === 'mobile' && (
                <>
                  <div><label className={labelClass}>Installed Apps (comma-separated)</label>
                    <input className={inputClass} placeholder="e.g. lucky_patcher, unknown_apk" value={apps} onChange={e => setApps(e.target.value)} /></div>
                  <div><label className={labelClass}>Granted Permissions (comma-separated)</label>
                    <input className={inputClass} placeholder="e.g. READ_SMS, ACCESS_FINE_LOCATION" value={permissions} onChange={e => setPermissions(e.target.value)} /></div>
                  <div><label className={labelClass}>Suspicious URLs Visited</label>
                    <input className={inputClass} placeholder="e.g. http://fake-bank.xyz/login" value={suspiciousUrls} onChange={e => setSuspiciousUrls(e.target.value)} /></div>
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-mono text-gray-400">
                    <input type="checkbox" checked={unknownSources} onChange={e => setUnknownSources(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
                    Unknown Sources Enabled
                  </label>
                </>
              )}

              {tab === 'ml' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Packet Rate /s', mlPacketRate, setMlPacketRate],
                    ['Failed Logins', mlFailedLogins, setMlFailedLogins],
                    ['Suspicious Requests', mlSuspiciousReqs, setMlSuspiciousReqs],
                    ['Traffic Spike (0–1)', mlTrafficSpike, setMlTrafficSpike],
                    ['Geo Mismatch (0–1)', mlGeoMismatch, setMlGeoMismatch],
                  ].map(([label, val, setter]: any) => (
                    <div key={label}><label className={labelClass}>{label}</label>
                      <input className={inputClass} type="number" step="0.01" value={val} onChange={e => setter(e.target.value)} /></div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-2 px-6 py-3 bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 font-mono text-sm tracking-widest rounded-lg hover:bg-cyan-400/30 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {loading ? '⚡ ANALYZING...' : '⚡ RUN AI ANALYSIS'}
          </button>
        </div>

        {/* Result panel */}
        <div className="glass-panel p-6">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            NEURAL ANALYSIS OUTPUT
          </h2>
          <ResultPanel result={result} loading={loading} />
        </div>
      </div>
    </div>
  );
}
