import { useEffect, useRef } from 'react';
import { geoNaturalEarth1, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';

// Attack sources/targets with lat/long
const ATTACKS = [
  { from: [55.75, 37.62], to: [38.89, -77.03], label: 'RU → US' },
  { from: [39.91, 116.39], to: [28.61, 77.21], label: 'CN → IN' },
  { from: [39.03, 125.75], to: [52.52, 13.40], label: 'KP → DE' },
  { from: [35.68, 139.69], to: [51.50, -0.12], label: 'JP → UK' },
  { from: [55.75, 37.62], to: [48.85, 2.35], label: 'RU → FR' },
  { from: [31.22, 121.47], to: [-33.86, 151.20], label: 'CN → AU' },
];

interface AttackArc {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  progress: number;
  speed: number;
  color: string;
}

function project(projection: any, lon: number, lat: number): [number, number] | null {
  const p = projection([lon, lat]);
  return p ? [p[0], p[1]] : null;
}

const CyberGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let worldData: any = null;
    let arcs: AttackArc[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        worldData = feature(topo, (topo as any).objects.countries);

        // Initialize attack arcs
        arcs = ATTACKS.map(_atk => ({
          fromX: 0, fromY: 0, toX: 0, toY: 0,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          color: '#FF2E63',
        }));
      });

    const draw = () => {
      if (!canvas) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Deep space background
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
      bg.addColorStop(0, '#060D1F');
      bg.addColorStop(1, '#020510');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Scanline overlay
      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, y, W, 2);
      }

      const projection = geoNaturalEarth1()
        .scale(W / 6.5)
        .translate([W / 2, H / 2]);
      const pathGen = geoPath(projection, ctx);

      // Graticule grid
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.08)';
      ctx.lineWidth = 0.5;
      for (let lon = -180; lon <= 180; lon += 30) {
        const start = projection([lon, -90]);
        const end = projection([lon, 90]);
        if (start && end) {
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
        }
      }
      for (let lat = -90; lat <= 90; lat += 30) {
        const start = projection([-180, lat]);
        const end = projection([180, lat]);
        if (start && end) {
          ctx.moveTo(start[0], start[1]);
          ctx.lineTo(end[0], end[1]);
        }
      }
      ctx.stroke();

      // Countries
      if (worldData) {
        ctx.beginPath();
        pathGen(worldData);
        ctx.fillStyle = 'rgba(255, 0, 60, 0.05)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 60, 0.4)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Glowing country borders
        ctx.beginPath();
        pathGen(worldData);
        ctx.strokeStyle = 'rgba(255, 0, 60, 0.15)';
        ctx.lineWidth = 2.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff003c';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animate attack arcs
        arcs.forEach((arc, i) => {
          arc.progress += arc.speed;
          if (arc.progress >= 1) arc.progress = 0;

          const atk = ATTACKS[i];
          const fromPt = project(projection, atk.from[1], atk.from[0]);
          const toPt = project(projection, atk.to[1], atk.to[0]);

          if (!fromPt || !toPt) return;

          const [fx, fy] = fromPt;
          const [tx, ty] = toPt;

          // Control point for arc
          const cx = (fx + tx) / 2;
          const cy = (fy + ty) / 2 - Math.abs(tx - fx) * 0.4;

          // Draw arc trail
          const t = arc.progress;
          const trailLen = 0.15;
          const tStart = Math.max(0, t - trailLen);

          ctx.beginPath();
          for (let s = tStart; s <= t; s += 0.01) {
            const bx = (1 - s) * (1 - s) * fx + 2 * (1 - s) * s * cx + s * s * tx;
            const by = (1 - s) * (1 - s) * fy + 2 * (1 - s) * s * cy + s * s * ty;
            if (s === tStart) ctx.moveTo(bx, by);
            else ctx.lineTo(bx, by);
          }
          const alpha = t > trailLen ? 1 : t / trailLen;
          ctx.strokeStyle = `rgba(255, 46, 99, ${alpha * 0.9})`;
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#FF2E63';
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Pulse dot at current position
          const px = (1 - t) * (1 - t) * fx + 2 * (1 - t) * t * cx + t * t * tx;
          const py = (1 - t) * (1 - t) * fy + 2 * (1 - t) * t * cy + t * t * ty;

          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FF2E63';
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#FF2E63';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Origin ping
          ctx.beginPath();
          ctx.arc(fx, fy, 6 + Math.sin(Date.now() / 400 + i) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255,46,99,0.5)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Target blip
          ctx.beginPath();
          ctx.arc(tx, ty, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#FF2E63';
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

export default CyberGlobe;
