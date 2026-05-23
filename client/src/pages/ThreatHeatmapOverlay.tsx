import React from 'react';

const ThreatHeatmapOverlay: React.FC = () => {
  return (
    <div className="space-y-6 text-gray-300 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white font-mono">Threat Heatmap Overlay</h1>
        <p className="text-sm text-gray-500 font-mono">High-resolution heatmap view of global attack concentration and risk zones.</p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-slate-950/70">
        <div className="h-[320px] rounded-3xl bg-gradient-to-br from-red-900/40 via-orange-600/20 to-black/20 border border-white/10">
          <div className="flex h-full flex-col items-center justify-center text-center text-white/80 px-10">
            <h2 className="text-xl font-semibold">Global Threat Density</h2>
            <p className="mt-3 text-sm text-gray-400">Simulated heatmap terrain for top attack regions and live scoring.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-6 text-sm text-gray-300">
          {[
            { label: 'Critical Zones', value: '3' },
            { label: 'Hotspots', value: '8' },
            { label: 'Live Streams', value: '12' },
          ].map(item => (
            <div key={item.label} className="rounded-3xl border border-white/10 bg-black/40 p-4">
              <div className="text-gray-500 uppercase tracking-[0.18em] text-xs">{item.label}</div>
              <div className="mt-2 text-white font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatHeatmapOverlay;
