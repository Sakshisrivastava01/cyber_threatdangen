import React, { useEffect, useRef, useState } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import type { GeoProjection } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

interface CyberAttackMapProps {
  onAttackTriggered?: (log: string, color: string) => void;
  showHud?: boolean;
}

const COUNTRIES = [
  { name: 'US-EAST', lat: 37.09, lon: -95.71 },
  { name: 'RU-WEST', lat: 61.52, lon: 105.31 },
  { name: 'CN-NORTH', lat: 35.86, lon: 104.20 },
  { name: 'IN-SOUTH', lat: 20.59, lon: 78.96 },
  { name: 'DE-CENTRAL', lat: 51.16, lon: 10.45 },
  { name: 'UK-NORTH', lat: 55.37, lon: -3.43 },
  { name: 'AU-EAST', lat: -25.27, lon: 133.77 },
  { name: 'BR-SOUTH', lat: -14.23, lon: -51.92 },
  { name: 'ZA-EAST', lat: -30.55, lon: 22.93 },
  { name: 'JP-TOKYO', lat: 36.20, lon: 138.25 },
  { name: 'IR-TEHRAN', lat: 32.42, lon: 53.68 },
  { name: 'KP-PYONG', lat: 40.33, lon: 127.51 },
];

const ATTACK_TYPES = [
  { name: 'DDOS', color: '#ff003c', label: 'DDoS' },          // Neon Red
  { name: 'MALWARE', color: '#ff9f1c', label: 'Malware' },    // Neon Orange
  { name: 'PHISHING', color: '#b5179e', label: 'Phishing' },  // Neon Purple
  { name: 'SQLI', color: '#f72585', label: 'SQL Injection' },  // Neon Pink
];

interface LiveAttack {
  from: typeof COUNTRIES[0];
  to: typeof COUNTRIES[0];
  type: typeof ATTACK_TYPES[0];
  progress: number;
  speed: number;
  id: number;
  arcs: { x: number; y: number }[];
}

interface LogEntry {
  time: string;
  type: string;
  src: string;
  dest: string;
  color: string;
  status: string;
}

const CyberAttackMap: React.FC<CyberAttackMapProps> = ({ onAttackTriggered, showHud }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialLogs: LogEntry[] = [
    { time: '08:15:20', type: 'DDOS', src: 'RU-WEST', dest: 'US-EAST', color: '#ff003c', status: 'MITIGATED' },
    { time: '08:15:21', type: 'MALWARE', src: 'CN-NORTH', dest: 'DE-CENTRAL', color: '#ff9f1c', status: 'QUARANTINED' },
    { time: '08:15:23', type: 'PHISHING', src: 'BR-SOUTH', dest: 'UK-NORTH', color: '#b5179e', status: 'BLOCKED' },
  ];
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [totalBlocked, setTotalBlocked] = useState(48291);
  const nextIdRef = useRef(1);

  // initial logs provided via useState initializer

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let worldData: GeoJSON.FeatureCollection | GeoJSON.Feature | null = null;
    const activeAttacks: LiveAttack[] = [];
    const pings: Array<{ x: number; y: number; radius: number; maxRadius: number; color: string; opacity: number }> = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Fetch and load GeoJSON map
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        worldData = feature(topo, (topo as Topology).objects.countries);
      })
      .catch((e) => console.error('Failed to load world map:', e));

    const project = (projection: GeoProjection, lon: number, lat: number): [number, number] | null => {
      const p = projection([lon, lat]);
      return p ? [p[0], p[1]] : null;
    };

    // Helper to spawn a new attack curve
    const spawnAttack = (projection: GeoProjection) => {
      const fromIdx = Math.floor(Math.random() * COUNTRIES.length);
      let toIdx = Math.floor(Math.random() * COUNTRIES.length);
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * COUNTRIES.length);
      }

      const fromCountry = COUNTRIES[fromIdx];
      const toCountry = COUNTRIES[toIdx];
      const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];

      const fromPt = project(projection, fromCountry.lon, fromCountry.lat);
      const toPt = project(projection, toCountry.lon, toCountry.lat);

      if (!fromPt || !toPt) return;

      // Add a live log entry
      const timeStr = new Date().toTimeString().split(' ')[0];
      const newLog: LogEntry = {
        time: timeStr,
        type: type.name,
        src: fromCountry.name,
        dest: toCountry.name,
        color: type.color,
        status: Math.random() > 0.35 ? 'MITIGATED' : 'BLOCKED',
      };

      setLogs(prev => [newLog, ...prev.slice(0, 7)]);
      setTotalBlocked(prev => prev + 1);

      if (onAttackTriggered) {
        onAttackTriggered(`[${type.name}] ${fromCountry.name} ➔ ${toCountry.name} [SUCCESSFULLY BLOCKED]`, type.color);
      }

      activeAttacks.push({
        id: nextIdRef.current++,
        from: fromCountry,
        to: toCountry,
        type,
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        arcs: [],
      });
    };

    let lastSpawn = 0;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Deep space grid texture
      ctx.fillStyle = '#050109';
      ctx.fillRect(0, 0, W, H);

      const projection = geoNaturalEarth1()
        .scale(W / 6.0)
        .translate([W / 2, H / 1.95]);
      const pathGen = geoPath(projection, ctx);

      // 1. Map grid lines (Holographic Lat/Lon)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.05)';
      ctx.lineWidth = 0.5;
      for (let lon = -180; lon <= 180; lon += 20) {
        const start = projection([lon, -80]);
        const end = projection([lon, 80]);
        if (start && end) {
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
        }
      }
      for (let lat = -80; lat <= 80; lat += 20) {
        const start = projection([-180, lat]);
        const end = projection([180, lat]);
        if (start && end) {
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
        }
      }
      ctx.stroke();

      // Draw map coordinates labels on the grid lines
      ctx.fillStyle = 'rgba(255, 0, 60, 0.2)';
      ctx.font = '7px monospace';
      for (let lon = -120; lon <= 120; lon += 60) {
        const p = projection([lon, 0]);
        if (p) {
          ctx.fillText(`${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`, p[0] + 2, H / 2 - 5);
        }
      }

      // 2. Render countries
      if (worldData) {
        ctx.beginPath();
        pathGen(worldData);
        ctx.fillStyle = 'rgba(20, 2, 8, 0.6)';
        ctx.fill();

        // Neon border
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 0, 60, 0.6)';
        ctx.strokeStyle = 'rgba(255, 0, 60, 0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 3. Render country labels and core pings
      COUNTRIES.forEach((c) => {
        const p = project(projection, c.lon, c.lat);
        if (!p) return;
        const [x, y] = p;

        // Static target radar ticks
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 60, 0.4)';
        ctx.fill();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '6px monospace';
        ctx.fillText(c.name, x + 5, y - 2);
      });

      // Spawn new attack at intervals
      const now = Date.now();
      if (now - lastSpawn > 1400 + Math.random() * 2000) {
        spawnAttack(projection);
        lastSpawn = now;
      }

      // 4. Animate & Draw active attack laser arcs
      for (let i = activeAttacks.length - 1; i >= 0; i--) {
        const attack = activeAttacks[i];
        attack.progress += attack.speed;

        const fromPt = project(projection, attack.from.lon, attack.from.lat);
        const toPt = project(projection, attack.to.lon, attack.to.lat);

        if (!fromPt || !toPt) {
          activeAttacks.splice(i, 1);
          continue;
        }

        const [fx, fy] = fromPt;
        const [tx, ty] = toPt;

        // Curved arc path calculation (Bezier curve control point)
        const dx = tx - fx;
        const dy = ty - fy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Midpoint and height factor based on distance
        const mx = (fx + tx) / 2;
        const my = (fy + ty) / 2;
        const h = dist * 0.35; // arc curvature depth
        
        // Orthogonal offset vector
        const nx = -dy / dist;
        const ny = dx / dist;
        
        // Control point
        const cx = mx + nx * h;
        const cy = my + ny * h;

        // Draw bezier arc line (the path itself)
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(cx, cy, tx, ty);
        ctx.strokeStyle = `rgba(255, 0, 60, 0.08)`;
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Calculate current position (quadratic bezier formula)
        const t = attack.progress;
        const tStart = Math.max(0, t - 0.12); // laser tail length

        // Draw glowing laser trail
        ctx.beginPath();
        for (let step = tStart; step <= t; step += 0.02) {
          const sx = (1 - step) * (1 - step) * fx + 2 * (1 - step) * step * cx + step * step * tx;
          const sy = (1 - step) * (1 - step) * fy + 2 * (1 - step) * step * cy + step * step * ty;
          if (step === tStart) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }

        ctx.shadowBlur = 12;
        ctx.shadowColor = attack.type.color;
        ctx.strokeStyle = attack.type.color;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Laser beam head dot
        const headX = (1 - t) * (1 - t) * fx + 2 * (1 - t) * t * cx + t * t * tx;
        const headY = (1 - t) * (1 - t) * fy + 2 * (1 - t) * t * cy + t * t * ty;

        ctx.beginPath();
        ctx.arc(headX, headY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = attack.type.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // If attack reaches destination, trigger impact ping and remove
        if (t >= 1) {
          pings.push({
            x: tx,
            y: ty,
            radius: 2,
            maxRadius: 28,
            color: attack.type.color,
            opacity: 1,
          });
          activeAttacks.splice(i, 1);
        }
      }

      // 5. Draw explosion impact pings
      for (let j = pings.length - 1; j >= 0; j--) {
        const ping = pings[j];
        ping.radius += 0.8;
        ping.opacity = 1 - ping.radius / ping.maxRadius;

        ctx.beginPath();
        ctx.arc(ping.x, ping.y, ping.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ping.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = ping.opacity;
        ctx.stroke();
        ctx.globalAlpha = 1.0;

        if (ping.radius >= ping.maxRadius) {
          pings.splice(j, 1);
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [onAttackTriggered]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <canvas ref={canvasRef} className="w-full h-full opacity-65" />

      {/* Holographic Radar HUD overlay */}
      <div className="absolute top-24 right-6 w-72 glass-panel p-4 font-mono z-30 select-text pointer-events-auto flex flex-col gap-3">
        <div className="flex justify-between items-center border-b border-red-500/20 pb-1.5">
          <span className="text-[10px] text-red-500 font-bold tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            LIVE THREAT RADAR
          </span>
          <span className="text-[9px] text-red-400/60">SYS: ACTIVE</span>
        </div>

        {/* Threat statistics indicators */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2 border border-red-950 bg-red-950/10 rounded">
            <div className="text-[8px] text-gray-500">BLOCKED ATTACKS</div>
            <div className="text-sm font-bold text-red-500">{totalBlocked.toLocaleString()}</div>
          </div>
          <div className="p-2 border border-red-950 bg-red-950/10 rounded">
            <div className="text-[8px] text-gray-500">DEFENSE FACTOR</div>
            <div className="text-sm font-bold text-red-400">99.98%</div>
          </div>
        </div>

        {/* Interactive Event log stream */}
        <div className="flex flex-col gap-1 min-h-[140px] max-h-[140px] overflow-hidden custom-scrollbar">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className="text-[9px] flex justify-between items-center py-0.5 border-b border-red-950/20 last:border-b-0"
              style={{ color: log.color }}
            >
              <span className="text-gray-500 text-[8px]">{log.time}</span>
              <span className="font-bold">{log.src} ➔ {log.dest}</span>
              <span className="px-1 py-0.2 border border-current rounded-[2px] text-[7px] leading-tight">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cybernetic Attack Color Legend */}
      {showHud !== false && (
        <div className="absolute top-24 right-6 w-72 glass-panel p-4 font-mono z-30 select-text pointer-events-auto flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-red-500/20 pb-1.5">
            <span className="text-[10px] text-red-500 font-bold tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
              LIVE THREAT RADAR
            </span>
            <span className="text-[9px] text-red-400/60">SYS: ACTIVE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            <div className="p-2 border border-red-950 bg-red-950/10 rounded">
              <div className="text-[8px] text-gray-500">BLOCKED ATTACKS</div>
              <div className="text-sm font-bold text-red-500">{totalBlocked.toLocaleString()}</div>
            </div>
            <div className="p-2 border border-red-950 bg-red-950/10 rounded">
              <div className="text-[8px] text-gray-500">DEFENSE FACTOR</div>
              <div className="text-sm font-bold text-red-400">99.98%</div>
            </div>
          </div>

          <div className="flex flex-col gap-1 min-h-[140px] max-h-[140px] overflow-hidden custom-scrollbar">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className="text-[9px] flex justify-between items-center py-0.5 border-b border-red-950/20 last:border-b-0"
                style={{ color: log.color }}
              >
                <span className="text-gray-500 text-[8px]">{log.time}</span>
                <span className="font-bold">{log.src} ➔ {log.dest}</span>
                <span className="px-1 py-0.2 border border-current rounded-[2px] text-[7px] leading-tight">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHud !== false && (
        <div className="absolute bottom-16 left-6 glass-panel px-4 py-2 font-mono flex gap-4 text-[9px] text-gray-400 z-30 select-text pointer-events-auto">
          {ATTACK_TYPES.map((type) => (
            <div key={type.name} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: type.color, color: type.color }} />
              <span>{type.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CyberAttackMap;
