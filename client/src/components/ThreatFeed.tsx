import React from 'react';
import TelemetryFeed from './TelemetryFeed';
import type { ThreatEvent } from '../neural-hooks/useDangenTelemetry';

interface ThreatFeedProps {
  events: ThreatEvent[];
  maxEntries?: number;
}

const ThreatFeed: React.FC<ThreatFeedProps> = ({ events, maxEntries = 8 }) => {
  const entries = events.slice(0, maxEntries).map((event) => {
    const source = event.source_country || event.country || 'SRC';
    const target = event.target_country || 'US';
    return `${event.type?.toUpperCase() || 'ALERT'} ${source} → ${target} • ${event.severity?.toUpperCase() || 'HIGH'}`;
  });

  return <TelemetryFeed entries={entries} />;
};

export default ThreatFeed;
