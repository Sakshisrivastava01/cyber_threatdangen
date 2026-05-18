import { create } from 'zustand';

export type ThreatSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ThreatEvent {
  id: string;
  ip: string;
  type: string;
  severity: ThreatSeverity;
  timestamp: string;
  confidence: number;
  country?: string;
}

interface DangenState {
  events: ThreatEvent[];
  activeThreats: number;
  blockedAttacks: number;
  confidenceScore: number;
  systemBooting: boolean;
  completeBoot: () => void;
  addEvent: (event: Omit<ThreatEvent, 'id' | 'timestamp'>) => void;
  updateMetrics: (active: number, blocked: number, confidence: number) => void;
  connectWebSocket: () => void;
}

let wsInstance: WebSocket | null = null;

export const useDangenTelemetry = create<DangenState>((set, get) => ({
  events: [],
  activeThreats: 12,
  blockedAttacks: 1420,
  confidenceScore: 94,
  systemBooting: true,

  completeBoot: () => set({ systemBooting: false }),

  addEvent: (event) => set((state) => {
    const newEvent: ThreatEvent = {
      ...event,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
    };
    return {
      events: [newEvent, ...state.events].slice(0, 50),
    };
  }),

  updateMetrics: (active, blocked, confidence) => set({
    activeThreats: active,
    blockedAttacks: blocked,
    confidenceScore: confidence,
  }),

  connectWebSocket: () => {
    if (wsInstance && (wsInstance.readyState === WebSocket.OPEN || wsInstance.readyState === WebSocket.CONNECTING)) {
      return;
    }
    const wsUrl = window.location.hostname === 'localhost' 
      ? 'ws://localhost:8000/ws/neural-feed' 
      : `wss://${window.location.host}/ws/neural-feed`;

    const ws = new WebSocket(wsUrl);
    wsInstance = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'threat_event' && msg.data) {
          const { ip, attack_type, severity, confidence, country } = msg.data;
          const newEvent: ThreatEvent = {
            id: Math.random().toString(36).substring(7),
            ip,
            type: attack_type,
            severity: severity as ThreatSeverity,
            timestamp: new Date().toLocaleTimeString(),
            confidence,
            country,
          };
          set((state) => ({
            events: [newEvent, ...state.events].slice(0, 50),
            activeThreats: state.activeThreats + 1,
            blockedAttacks: state.blockedAttacks + (severity === 'critical' || severity === 'high' ? 1 : 0),
            confidenceScore: Math.min(99, Math.max(85, state.confidenceScore + (Math.random() > 0.5 ? 1 : -1))),
          }));
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('Dangen WebSocket error:', err);
    };

    ws.onclose = () => {
      wsInstance = null;
      console.log('Dangen WebSocket closed. Retrying connection in 5s...');
      setTimeout(() => {
        get().connectWebSocket();
      }, 5000);
    };
  },
}));
