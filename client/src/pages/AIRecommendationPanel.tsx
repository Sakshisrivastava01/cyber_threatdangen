import React from 'react';
import { motion } from 'framer-motion';

const AIRecommendationPanel: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 text-gray-300 font-sans"
    >
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">AI Recommendation Engine</h1>
        <p className="text-sm text-gray-500 font-mono">Managed defense playbooks and prioritized remediation guidance from DANGEN AI.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-[0.22em] text-cyan-400">Top Recommendations</span>
            <span className="text-xs text-gray-400">live</span>
          </div>
          <div className="space-y-4 text-sm text-gray-300">
            <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
              <div className="font-semibold text-white">Enforce adaptive MFA</div>
              <div className="text-gray-400">Apply step-up authentication for high-risk sessions and administrator access.</div>
            </div>
            <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
              <div className="font-semibold text-white">Segment high-value assets</div>
              <div className="text-gray-400">Isolate sensitive systems and limit east-west lateral movement with microsegmentation.</div>
            </div>
            <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
              <div className="font-semibold text-white">Validate telemetry integrity</div>
              <div className="text-gray-400">Ensure alert pipelines are authenticated and encrypted end-to-end.</div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
          <div className="mb-4 text-xs uppercase tracking-[0.22em] text-yellow-400">Confidence Scoring</div>
          <div className="grid gap-4 text-sm text-gray-300">
            <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
              <div className="text-white font-semibold">Attack Priority</div>
              <div className="text-gray-400 mt-2">Priority assignments drawn from model confidence and impact estimation.</div>
            </div>
            <div className="rounded-2xl bg-black/30 p-4 border border-white/10">
              <div className="text-white font-semibold">Containment Urgency</div>
              <div className="text-gray-400 mt-2">High confidence recommendations are surfaced for immediate SOC action.</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIRecommendationPanel;
