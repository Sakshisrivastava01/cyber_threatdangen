import { create } from 'zustand';

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ThreatEvent {
  id: string;
  ip: string;
  type: string;
  severity: ThreatSeverity;
  timestamp: string;
  confidence: number;
  country?: string;

  // Existing extended fields
  source_country?: string;
  target_country?: string;
  source_ip?: string;
  target_ip?: string;
  packets_per_second?: number;
  threat_level?: string;

  // New realistic cyber warfare telemetry fields
  asn?: string;
  isp?: string;
  protocol?: string;
  target_port?: number;
  malware_family?: string;
  cve?: string;
  threat_actor?: string;
}

export interface CountryAttackCount {
  country: string;
  count: number;
}

export interface CountryPairCount {
  pair: string;
  count: number;
}

export type WsStatus = 'connecting' | 'connected' | 'reconnecting' | 'error';

interface DangenState {
  events: ThreatEvent[];
  activeThreats: number;
  blockedAttacks: number;
  confidenceScore: number;
  systemBooting: boolean;
  globalIntensity: number;
  topAttackingCountries: CountryAttackCount[];
  countryPairCounters: CountryPairCount[];
  wsStatus: WsStatus;
  completeBoot: () => void;
  addEvent: (event: Omit<ThreatEvent, 'id' | 'timestamp'>) => void;
  updateMetrics: (active: number, blocked: number, confidence: number) => void;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
}

let wsInstance: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempt = 0;

export const useDangenTelemetry = create<DangenState>((set, get) => ({
  events: [],
  activeThreats: 12,
  blockedAttacks: 1420,
  confidenceScore: 94,
  systemBooting: true,
  globalIntensity: 68,
  wsStatus: 'connecting',
  topAttackingCountries: [
    { country: 'RU', count: 18 },
    { country: 'CN', count: 14 },
    { country: 'KP', count: 9 },
    { country: 'IR', count: 7 },
  ],
  countryPairCounters: [
    { pair: 'RU → US', count: 12 },
    { pair: 'CN → DE', count: 8 },
    { pair: 'KP → JP', count: 6 },
  ],

  completeBoot: () => set({ systemBooting: false }),

  addEvent: (event) => set((state) => {
    const newEvent: ThreatEvent = {
      ...event,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      source_country: event.country || 'UNKNOWN',
      target_country: 'US',
      source_ip: event.ip,
      target_ip: '10.0.0.1',
      packets_per_second: Math.floor(Math.random() * 50000) + 10000,
      threat_level: event.severity.toUpperCase(),
      asn: event.asn || 'AS12389 Rostelecom',
      isp: event.isp || 'Rostelecom',
      protocol: event.protocol || 'TCP',
      target_port: event.target_port || 443,
      malware_family: event.malware_family || 'LockBit 3.0',
      cve: event.cve || 'CVE-2023-38606',
      threat_actor: event.threat_actor || 'APT29 (Cozy Bear)',
    };
    return {
      events: [newEvent, ...state.events].slice(0, 100), // Max buffer limit 100
    };
  }),

  updateMetrics: (active, blocked, confidence) => set({
    activeThreats: active,
    blockedAttacks: blocked,
    confidenceScore: confidence,
  }),

  disconnectWebSocket: () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
    if (wsInstance) {
      wsInstance.onclose = null;
      wsInstance.onerror = null;
      wsInstance.onmessage = null;
      wsInstance.onopen = null;
      wsInstance.close();
      wsInstance = null;
    }
    set({ wsStatus: 'error' });
  },

  connectWebSocket: () => {
    if (wsInstance && (wsInstance.readyState === WebSocket.OPEN || wsInstance.readyState === WebSocket.CONNECTING)) {
      return;
    }

    set({ wsStatus: reconnectAttempt > 0 ? 'reconnecting' : 'connecting' });

    const wsUrl = import.meta.env.VITE_WS_URL || 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `ws://${window.location.hostname}:8000/ws/neural-feed` 
        : `wss://${window.location.host}/ws/neural-feed`);

    const ws = new WebSocket(wsUrl);
    wsInstance = ws;

    ws.onopen = () => {
      reconnectAttempt = 0;
      set({ wsStatus: 'connected' });
      console.log('Dangen Neural Feed WebSocket Connected.');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'threat_event' && msg.data) {
          const { 
            ip, attack_type, severity, confidence, country,
            source_country, target_country, source_ip, target_ip, packets_per_second, threat_level, timestamp,
            asn, isp, protocol, target_port, malware_family, cve, threat_actor
          } = msg.data;

          const sCountry = source_country || country || 'UNKNOWN';
          const tCountry = target_country || 'US';
          const sIp = source_ip || ip || '0.0.0.0';
          const tIp = target_ip || '10.0.0.1';
          const pps = packets_per_second || Math.floor(Math.random() * 50000) + 10000;
          const tLevel = threat_level || severity || 'HIGH';

          const newEvent: ThreatEvent = {
            id: Math.random().toString(36).substring(7),
            ip: sIp,
            type: attack_type,
            severity: (severity || tLevel.toLowerCase()) as ThreatSeverity,
            timestamp: timestamp || new Date().toLocaleTimeString(),
            confidence: confidence || 92,
            country: sCountry,
            source_country: sCountry,
            target_country: tCountry,
            source_ip: sIp,
            target_ip: tIp,
            packets_per_second: pps,
            threat_level: tLevel,
            asn: asn || 'AS12389 Rostelecom',
            isp: isp || 'Rostelecom',
            protocol: protocol || 'TCP',
            target_port: target_port || 443,
            malware_family: malware_family || 'LockBit 3.0',
            cve: cve || 'CVE-2023-38606',
            threat_actor: threat_actor || 'APT29 (Cozy Bear)',
          };

          set((state) => {
            // Deduplication & Buffer limit 100
            const filtered = state.events.filter(e => e.id !== newEvent.id);
            const nextEvents = [newEvent, ...filtered].slice(0, 100);

            // Calculate top attacking countries
            const countryCounts: Record<string, number> = {};
            const pairCounts: Record<string, number> = {};
            
            nextEvents.forEach(ev => {
              const sc = ev.source_country || ev.country || 'UNKNOWN';
              const tc = ev.target_country || 'US';
              countryCounts[sc] = (countryCounts[sc] || 0) + 1;
              const pair = `${sc} → ${tc}`;
              pairCounts[pair] = (pairCounts[pair] || 0) + 1;
            });

            const topAttackingCountries = Object.entries(countryCounts)
              .map(([c, count]) => ({ country: c, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);

            const countryPairCounters = Object.entries(pairCounts)
              .map(([pair, count]) => ({ pair, count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5);

            // Global intensity based on recent packet rate and active events
            const avgPps = nextEvents.reduce((acc, curr) => acc + (curr.packets_per_second || 0), 0) / (nextEvents.length || 1);
            const globalIntensity = Math.min(100, Math.max(20, Math.floor((avgPps / 85000) * 100)));

            return {
              events: nextEvents,
              activeThreats: state.activeThreats + 1,
              blockedAttacks: state.blockedAttacks + (tLevel === 'CRITICAL' || tLevel === 'HIGH' || severity === 'critical' || severity === 'high' ? 1 : 0),
              confidenceScore: Math.min(99, Math.max(85, state.confidenceScore + (Math.random() > 0.5 ? 1 : -1))),
              globalIntensity,
              topAttackingCountries,
              countryPairCounters,
            };
          });
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('Dangen WebSocket error:', err);
      set({ wsStatus: 'error' });
    };

    ws.onclose = () => {
      wsInstance = null;
      set({ wsStatus: 'reconnecting' });
      reconnectAttempt += 1;
      const backoff = Math.min(10000, 1000 * Math.pow(2, reconnectAttempt));
      console.log(`Dangen WebSocket closed. Retrying connection in ${backoff / 1000}s...`);
      reconnectTimeout = setTimeout(() => {
        get().connectWebSocket();
      }, backoff);
    };
  },
}));
