import React, { useState, useEffect } from 'react';
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

const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ entries = [], maxEntries = 8 }) => {
  const [telemetryData, setTelemetryData] = useState<TelemetryEntry[]>([]);
  const entryCounterRef = React.useRef(0);

  // Convert string entries to telemetry format and add new ones
  useEffect(() => {
    if (entries.length > 0) {
      const lastEntry = entries[0];
      const isNewEntry = !telemetryData.some((e) => e.message === lastEntry);

      if (isNewEntry) {
        const severities: TelemetryEntry['severity'][] = [
          'CRITICAL',
          'HIGH',
          'HIGH',
          'MEDIUM',
          'LOW',
        ];
        const types: TelemetryEntry['type'][] = [
          'attack',
          'threat',
          'scan',
          'intrusion',
        ];

        const newEntry: TelemetryEntry = {
          id: entryCounterRef.current++,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: lastEntry,
          sourceCountry: ['RU', 'CN', 'KP', 'IR', 'SY'][Math.floor(Math.random() * 5)],
          targetCountry: ['US', 'UK', 'DE', 'JP'][Math.floor(Math.random() * 4)],
        };

        setTelemetryData((prev) => [newEntry, ...prev].slice(0, maxEntries));
      }
    }
  }, [entries, maxEntries, telemetryData]);

  // Generate mock telemetry periodically if no entries provided
  useEffect(() => {
    if (entries.length === 0) {
      const interval = setInterval(() => {
        const mockMessages = [
          'PORT SCAN DETECTED: 185.220.101.45 — Multiple port probes detected',
          'DDoS ATTACK INCOMING: Volumetric flood from botnet C2 infrastructure',
          'CREDENTIAL THEFT ALERT: Phishing campaign targeting executives',
          'MALWARE SIGNATURE MATCH: Known APT29 payload detected in network traffic',
          'PRIVILEGE ESCALATION: Unauthorized sudo command execution attempt',
          'DATA EXFILTRATION: Large unencrypted data transfer to external IP',
          'LATERAL MOVEMENT: Suspicious SMB enumeration across subnet',
          'RANSOMWARE DETECTION: Wannacry-variant encrypted files in file server',
        ];

        const severities: TelemetryEntry['severity'][] = [
          'CRITICAL',
          'HIGH',
          'HIGH',
          'MEDIUM',
          'LOW',
        ];
        const types: TelemetryEntry['type'][] = [
          'attack',
          'threat',
          'scan',
          'intrusion',
        ];

        const newEntry: TelemetryEntry = {
          id: entryCounterRef.current++,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: mockMessages[Math.floor(Math.random() * mockMessages.length)],
          sourceCountry: ['RU', 'CN', 'KP', 'IR', 'SY'][Math.floor(Math.random() * 5)],
          targetCountry: ['US', 'UK', 'DE', 'JP'][Math.floor(Math.random() * 4)],
        };

        setTelemetryData((prev) => [newEntry, ...prev].slice(0, maxEntries));
      }, 3500);

      return () => clearInterval(interval);
    }
  }, [entries.length, maxEntries]);

  const getSeverityColor = (severity: TelemetryEntry['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-500 bg-red-950/20 border-red-500/40';
      case 'HIGH':
        return 'text-orange-400 bg-orange-950/20 border-orange-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-950/20 border-yellow-500/20';
      case 'LOW':
        return 'text-green-400 bg-green-950/20 border-green-500/20';
    }
  };

  const getTypeIcon = (type: TelemetryEntry['type']) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="bg-black/60 border-2 border-red-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,0,60,0.15)]"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-red-500/20 bg-red-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.3em]">LIVE THREAT TELEMETRY</span>
          </div>
          <span className="text-[9px] text-gray-400 uppercase tracking-wider">
            {telemetryData.length} / {maxEntries} ACTIVE
          </span>
        </div>
      </div>

      {/* Feed Container */}
      <div className="max-h-[420px] overflow-y-auto custom-scrollbar font-mono">
        <AnimatePresence mode="popLayout">
          {telemetryData.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="border-b border-red-950/30 p-4 hover:bg-red-950/10 transition-colors group"
            >
              {/* Row 1: Timestamp, Type, Severity */}
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-[9px] text-gray-500 tracking-widest uppercase flex-shrink-0">
                  {entry.timestamp}
                </span>
                <span className="text-sm">{getTypeIcon(entry.type)}</span>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${getSeverityColor(
                    entry.severity
                  )}`}
                >
                  {entry.severity}
                </span>
              </div>

              {/* Row 2: Message */}
              <p className="text-xs text-gray-300 mb-2 leading-tight line-clamp-2">
                {entry.message}
              </p>

              {/* Row 3: Source/Target if available */}
              {entry.sourceCountry && entry.targetCountry && (
                <div className="flex items-center gap-2 text-[8px] text-gray-500">
                  <span className="font-mono">{entry.sourceCountry}</span>
                  <span className="text-red-500">→</span>
                  <span className="font-mono">{entry.targetCountry}</span>
                  <div className="flex-1" />
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-red-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {telemetryData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
          >
            <div className="text-4xl mb-3 opacity-40">🔍</div>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-mono">
              WAITING FOR THREAT TELEMETRY...
            </p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-red-500/20 bg-red-950/5 flex items-center justify-between text-[8px] text-gray-500 uppercase tracking-widest">
        <span>REAL-TIME THREAT FEED</span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          LIVE MONITORING
        </span>
      </div>
    </motion.div>
  );
};

export default TelemetryPanel;
