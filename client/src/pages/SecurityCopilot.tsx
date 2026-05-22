import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ThreatIntelPanel from '../components/ThreatIntelPanel';

const SecurityCopilot: React.FC = () => {
  const [query, setQuery] = useState('Investigate suspicious outbound traffic to the darknet.');
  const [mode, setMode] = useState<'idle' | 'thinking' | 'streaming'>('idle');
  const [displayed, setDisplayed] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sampleResponse = `Initiating secure analysis module...\nCorrelating event streams with active threat intel...\nRecommended action: deploy containment rules to the affected segments, escalate the anomaly to Tier 1, and verify the asset shield integrity at the next checkpoint.`;

  useEffect(() => {
    if (mode === 'streaming') {
      let index = 0;
      const interval = window.setInterval(() => {
        if (index < sampleResponse.length) {
          setDisplayed((prev) => prev + sampleResponse[index]);
          index += 1;
        } else {
          window.clearInterval(interval);
          setMode('idle');
        }
      }, 22);

      return () => window.clearInterval(interval);
    }
    return undefined;
  }, [mode]);

  const handleRunQuery = () => {
    if (!query.trim()) {
      setError('Please enter a query to continue.');
      return;
    }

    setError(null);
    setDisplayed('');
    setMode('thinking');

    window.setTimeout(() => {
      setMode('streaming');
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="space-y-6 font-sans text-gray-300"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white mb-1 font-mono tracking-[0.04em]">AI Security Copilot</h1>
        <p className="text-sm text-gray-400 font-mono max-w-2xl">
          Cinematic command-grade analysis, live breach triage, and analyst-driven decision support.
        </p>
      </div>

      <div className="glass-panel p-6 grid gap-6 lg:grid-cols-[1.4fr_1fr] relative overflow-hidden">
        <div className="absolute inset-0 scanline-overlay opacity-50 pointer-events-none" />
        <div className="space-y-4 relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-red-300 font-semibold">Query Workspace</div>
          <div className="rounded-3xl border border-red-500/10 bg-[#0b0e16]/90 p-5 shadow-[0_0_30px_rgba(255,0,60,0.1)]">
            <p className="text-sm text-gray-300">Insert an incident query and watch the AI command stream render the next-level security response.</p>
            <textarea
              value={query}
              onChange={(evt) => setQuery(evt.target.value)}
              rows={5}
              className="mt-4 w-full rounded-3xl border border-red-500/20 bg-black/40 px-4 py-4 text-white outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-500/20 resize-none"
            />
            <button
              onClick={handleRunQuery}
              className="mt-4 inline-flex items-center justify-center rounded-3xl border border-red-500 bg-red-500/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/20 hover:border-red-400"
            >
              Run Analysis
            </button>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          </div>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="rounded-3xl border border-red-500/15 bg-[#0b0e16]/90 p-5 shadow-[0_0_30px_rgba(255,0,60,0.1)]">
            <div className="flex items-center justify-between text-sm font-mono text-gray-400 mb-4">
              <span>AI Response Engine</span>
              <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em] ${mode === 'thinking' ? 'bg-amber-500/15 text-amber-200 border border-amber-400/20' : 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/20'}`}>
                {mode === 'thinking' ? 'THINKING' : 'READY'}
              </span>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <p>• Terminal-grade analysis stream with flicker and typing realism.</p>
              <p>• Severity badges, intelligence citations, and tactical remediation guidance.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Inference Mode', value: 'Realtime' },
              { title: 'Response Style', value: 'Tactical' },
              { title: 'Citations', value: 'Enabled' },
              { title: 'Output Delay', value: 'Simulated' },
            ].map(item => (
              <div key={item.title} className="rounded-3xl border border-red-500/10 bg-black/40 p-4">
                <div className="text-xs uppercase tracking-[0.18em] text-gray-500">{item.title}</div>
                <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 relative overflow-hidden border-red-500/20 shadow-[0_0_40px_rgba(255,0,60,0.12)]">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500/30" />
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-3/5 rounded-3xl border border-red-500/10 bg-[#0b0e16]/90 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,60,0.12)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-red-300">AI Thinking State</p>
                <h2 className="text-xl font-semibold text-white font-mono">Terminal Stream</h2>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gray-400">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE
              </div>
            </div>

            <div className="relative rounded-3xl border border-red-500/10 bg-black/60 p-4 text-[13px] leading-6 text-gray-300 font-mono min-h-[240px] overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b0e16] to-transparent pointer-events-none" />
              <AnimatePresence>
                {mode === 'thinking' && (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-gray-400"
                  >
                    <p>Initializing quantum reasoning...</p>
                    <p>Performing cross-correlation of attacker signatures...</p>
                    <p>Rendering tactical mitigation suggestions...</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <pre className={`whitespace-pre-wrap ${mode === 'streaming' ? 'terminal-flicker' : ''}`}>
                {mode === 'idle' ? 'Awaiting directive. Enter a query and deploy analysis.' : displayed}
              </pre>
            </div>
          </div>

          <div className="lg:w-2/5 space-y-4">
            <div className="rounded-3xl border border-red-500/10 bg-[#0b0e16]/90 p-5 shadow-[0_0_20px_rgba(255,0,60,0.12)]">
              <h3 className="text-xs uppercase tracking-[0.25em] text-red-300 mb-3">Severity Overview</h3>
              <div className="space-y-3">
                {[
                  { label: 'Safe', value: 'Minimal risk', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
                  { label: 'Caution', value: 'Elevated risk', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
                  { label: 'Critical', value: 'Immediate action', color: 'bg-red-500/10 text-red-300 border-red-500/20' },
                ].map(item => (
                  <div key={item.label} className={`rounded-2xl border px-4 py-3 ${item.color}`}>
                    <div className="flex items-center justify-between text-sm font-semibold text-white">
                      <span>{item.label}</span>
                      <span className="text-xs uppercase tracking-[0.25em] text-gray-400">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-red-500/10 bg-[#0b0e16]/90 p-5 shadow-[0_0_20px_rgba(255,0,60,0.12)]">
              <h3 className="text-xs uppercase tracking-[0.25em] text-red-300 mb-3">Intelligence Cards</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="rounded-2xl border border-red-500/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Signature Match</p>
                  <p className="mt-2 text-white font-semibold">High fidelity rule-based indicators</p>
                </div>
                <div className="rounded-2xl border border-red-500/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">Confidence</p>
                  <p className="mt-2 text-white font-semibold">AI-assisted inference stream</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 mt-6">
        <ThreatIntelPanel />
      </div>
    </motion.div>
  );
};

export default SecurityCopilot;
