import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchThreatIntel } from '../services/api';

interface ThreatIntelData {
  ip: string;
  reputation: string;
  malicious_score: number;
  abuse_score: number;
  asn?: string | null;
  country?: string | null;
  open_ports: number[];
  confidence_score: number;
}

const severityStyles: Record<string, { label: string; badge: string; glow: string }> = {
  benign: {
    label: 'SAFE',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.25)]',
  },
  suspicious: {
    label: 'SUSPICIOUS',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.25)]',
  },
  malicious: {
    label: 'MALICIOUS',
    badge: 'bg-red-500/15 text-red-300 border-red-400/30',
    glow: 'shadow-[0_0_30px_rgba(248,113,113,0.25)]',
  },
};

const getSeverity = (reputation: string) => {
  return severityStyles[reputation] ?? severityStyles.benign;
};

const ThreatIntelPanel: React.FC = () => {
  const [ip, setIp] = useState('');
  const [data, setData] = useState<ThreatIntelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setError(null);
    setData(null);

    if (!ip.trim()) {
      setError('Enter a valid IP address to analyze.');
      return;
    }

    setLoading(true);

    try {
      const result = await fetchThreatIntel(ip.trim());
      setData(result);
    } catch (e) {
      console.error(e);
      setError('Unable to fetch threat intelligence. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activeStyle = data ? getSeverity(data.reputation) : severityStyles.benign;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="glass-panel border-red-500/30 bg-[#090b12]/80 shadow-[0_0_40px_rgba(255,0,0,0.15)] overflow-hidden"
    >
      <div className="relative overflow-hidden rounded-3xl border border-red-500/30 p-6">
        <motion.div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-transparent to-red-500 opacity-80"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
        />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white font-mono">Threat Intelligence Panel</h2>
              <p className="text-sm text-gray-400 mt-1">Analyze IP reputation and live cyber risk signals.</p>
            </div>
            <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${activeStyle.badge}`}> 
              {data ? activeStyle.label : 'READY'}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1.8fr_1fr] mb-5">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.3em] text-gray-600">IP Address</label>
              <input
                type="text"
                value={ip}
                onChange={(event) => setIp(event.target.value)}
                placeholder="e.g. 8.8.8.8"
                className="w-full rounded-2xl border border-white/10 bg-[#07090f]/90 px-4 py-3 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="h-full rounded-2xl border border-red-400 bg-red-500/10 px-6 text-sm font-semibold text-red-200 transition hover:border-red-300 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Analyze'}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#0b0e16]/80 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Summary</p>
                  <h3 className="text-lg font-semibold text-white">Threat Snapshot</h3>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${activeStyle.badge}`}> 
                  {data ? `${data.confidence_score}% Confidence` : 'Awaiting scan'}
                </span>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map((item) => (
                    <div key={item} className="h-4 w-full animate-pulse rounded-xl bg-white/10" />
                  ))
                ) : (
                  <div className="space-y-4 text-sm text-gray-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Reputation</p>
                        <p className="mt-2 text-lg font-semibold text-white">{data?.reputation.toUpperCase() ?? 'N/A'}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Malicious Score</p>
                        <p className="mt-2 text-lg font-semibold text-white">{data?.malicious_score ?? '--'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Abuse Score</p>
                        <p className="mt-2 text-lg font-semibold text-white">{data?.abuse_score ?? '--'}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-gray-500">ASN</p>
                        <p className="mt-2 text-lg font-semibold text-white">{data?.asn ?? 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#0b0e16]/80 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Infrastructure</p>
                  <h3 className="text-lg font-semibold text-white">Network Enrichment</h3>
                </div>
                <div className={activeStyle.glow} />
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Country</p>
                  <p className="mt-2 text-lg font-semibold text-white">{data?.country ?? 'Unknown'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Open Ports</p>
                  <p className="mt-2 text-lg font-semibold text-white">{data?.open_ports?.length ?? 0}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data?.open_ports?.length
                      ? data.open_ports.map((port) => (
                          <span key={port} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                            {port}
                          </span>
                        ))
                      : <span className="text-xs text-gray-500">No open port data</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreatIntelPanel;
