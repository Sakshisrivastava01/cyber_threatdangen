import React, { useEffect, useState } from 'react';
import { useDangenTelemetry, ThreatEvent } from '../neural-hooks/useDangenTelemetry';

const ThreatTimeline: React.FC = () => {
  const events = useDangenTelemetry((state) => state.events);
  const [fallbackEvents, setFallbackEvents] = useState<ThreatEvent[]>([]);

  useEffect(() => {
    const types = ['SQL Injection', 'DDoS Attempt', 'Port Scan', 'Unauthorized Access', 'Malware Signature', 'Zero-Day Exploit', 'Botnet C2 Signal'];
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    
    const interval = setInterval(() => {
      const newEvent: ThreatEvent = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString(),
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        type: types[Math.floor(Math.random() * types.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        confidence: Math.floor(Math.random() * 20) + 80,
      };
      
      setFallbackEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Use real WebSocket events if available, otherwise fallback simulation
  const displayEvents = events.length > 0 ? events.slice(0, 5) : fallbackEvents;

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(255,46,99,0.2)]';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-3 font-mono">
      {displayEvents.length === 0 ? (
        <div className="text-center text-gray-500 py-6 text-sm animate-pulse">⚡ LISTENING FOR NEURAL ANOMALIES & DARKNET SIGNALS...</div>
      ) : (
        displayEvents.map((event) => (
          <div key={event.id} className="flex items-center gap-4 p-3.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:border-cyan-500/30 shadow-sm">
            <span className="text-xs text-cyan-400/80 w-24">{event.timestamp}</span>
            <span className={`text-xs px-2.5 py-1 rounded border uppercase ${getSeverityColor(event.severity)} w-24 text-center font-bold tracking-wider`}>
              {event.severity}
            </span>
            <span className="text-sm text-gray-300 w-36 font-semibold">{event.ip}</span>
            <span className="text-sm text-gray-100 flex-1 font-medium">{event.type}</span>
            {event.country && (
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 border border-white/10">{event.country}</span>
            )}
            <span className="text-xs text-cyan-400/60 font-mono">{event.confidence}% CONF</span>
          </div>
        ))
      )}
    </div>
  );
};

export default ThreatTimeline;
