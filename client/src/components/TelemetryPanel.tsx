import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TelemetryEntry {
  id: number;
  timestamp: string;
  type: 'attack' | 'threat' | 'scan' | 'intrusion';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  sourceCountry?: string;
  targetCountry?: string;
}

interface TelemetryPanelProps {
  entries?: string[];
  maxEntries?: number;
}

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ entries = [], maxEntries = 6 }) => {
  const [telemetryData, setTelemetryData] = useState<TelemetryEntry[]>([]);
  const entryCounterRef = useRef(0);

  // Convert incoming string list to structures
  useEffect(() => {
    if (entries.length > 0) {
      const lastEntry = entries[0];
      const isNewEntry = !telemetryData.some((e) => e.message === lastEntry);

      if (isNewEntry) {
        const severities: TelemetryEntry['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
        const types: TelemetryEntry['type'][] = ['attack', 'threat', 'scan', 'intrusion'];

        const newEntry: TelemetryEntry = {
          id: entryCounterRef.current++,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: lastEntry,
          sourceCountry: ['RU', 'CN', 'KP', 'IR', 'SY', 'VN'][Math.floor(Math.random() * 6)],
          targetCountry: ['US', 'UK', 'DE', 'JP', 'AU'][Math.floor(Math.random() * 5)],
        };

        setTelemetryData((prev) => [newEntry, ...prev].slice(0, maxEntries));
      }
    }
  }, [entries, maxEntries]);

  // Fallback simulator if no entries are injected from parents
  useEffect(() => {
    if (entries.length === 0) {
      const interval = setInterval(() => {
        const mockMessages = [
          'PORT SCAN INTRUSION: SSH port brute force detected from external range',
          'DDoS FLOOD CONCURRENT: 80,000 PPS attack targeted at gateway router',
          'QUANTUM ENCRYPTION ERROR: Cryptographic sync warning on outer network shield',
          'MALWARE BEACON SIGNAL: Known threat actor signature matching APT28 IP range',
          'CREDENTIAL CRACK INCOMING: Active spray pattern against administrative portal',
          'FIREWALL MITIGATION ALERT: Blocking outbound telemetry sync from unauthorized node',
          'DATA INTEGRITY SWEEP: Suspicious registry modification checked by security service',
        ];

        const severities: TelemetryEntry['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
        const types: TelemetryEntry['type'][] = ['attack', 'threat', 'scan', 'intrusion'];

        const newEntry: TelemetryEntry = {
          id: entryCounterRef.current++,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
          sourceCountry: ['RU', 'CN', 'KP', 'IR', 'SY', 'VN'][Math.floor(Math.random() * 6)],
          targetCountry: ['US', 'UK', 'DE', 'JP', 'AU'][Math.floor(Math.random() * 5)],
        };

        setTelemetryData((prev) => [newEntry, ...prev].slice(0, maxEntries));
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [entries.length, maxEntries]);

  const getSeverityStyle = (severity: TelemetryEntry['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-500 bg-red-950/30 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] font-bold';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/20 border-orange-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-950/20 border-yellow-500/20';
      case 'LOW':
        return 'text-green-400 bg-green-950/20 border-green-500/20';
    }
  };

  const getTypeIndicator = (type: TelemetryEntry['type']) => {
    switch (type) {
      case 'attack':
        return '⚔️';
      case 'threat':
        return '⚠️';
      case 'scan':
        return '🔍';
      case 'intrusion':
        return '🚨';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-black/60 border border-red-500/30 rounded-lg p-5 font-mono text-xs backdrop-blur-md shadow-[0_0_30px_rgba(255,0,60,0.15)] overflow-hidden flex flex-col gap-4"
    >
      {/* HUD borders */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,60,0.04),transparent_55%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ff003c]" />
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em]">
            LIVE THREAT TELEMETRY
          </span>
        </div>
        <span className="text-[8px] bg-red-950/40 border border-red-500/30 px-1.5 py-0.5 rounded text-red-400 font-bold">
          LIVE STREAMING
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-3 h-[240px] overflow-y-auto custom-scrollbar pr-1">
        <AnimatePresence initial={false} mode="popLayout">
          {telemetryData.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="border border-red-950/40 bg-red-950/5 hover:bg-red-950/15 p-3 rounded flex flex-col gap-2 transition"
            >
              <div className="flex items-center justify-between text-[9px]">
                <span className="text-gray-500 font-bold">{entry.timestamp}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs">{getTypeIndicator(entry.type)}</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[8px] tracking-wider font-semibold ${getSeverityStyle(entry.severity)}`}>
                    {entry.severity}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 leading-snug font-medium text-[11px]">
                {entry.message}
              </p>

              {entry.sourceCountry && entry.targetCountry && (
                <div className="flex items-center gap-2 text-[9px] text-gray-500 font-semibold pt-1 border-t border-red-950/20">
                  <span className="text-red-400">{entry.sourceCountry}</span>
                  <span className="text-red-500 font-bold">➔</span>
                  <span className="text-emerald-400">{entry.targetCountry}</span>
                  <div className="flex-1" />
                  <span className="text-[8px] text-gray-600">ROUTING COMPLETE</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {telemetryData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <span>WAITING FOR DATA CONNECTION...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TelemetryPanel;
