import React, { useEffect, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10, geoInterpolate, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import type { Topology } from 'topojson-specification';
import { motion, AnimatePresence } from 'framer-motion';
import { useDangenTelemetry, type ThreatEvent } from '../neural-hooks/useDangenTelemetry';

// Approximate ISO to Lat/Long mapping for attack vectors & heatmap overlay
const COUNTRY_COORDS: Record<string, [number, number]> = {
  US: [-95.7129, 37.0902],
  RU: [105.3188, 61.5240],
  CN: [104.1954, 35.8617],
  DE: [10.4515, 51.1657],
  KP: [127.5101, 40.3399],
  IR: [53.6880, 32.4279],
  BR: [-51.9253, -14.2350],
  IN: [78.9629, 20.5937],
  UK: [-3.4360, 55.3781],
  FR: [2.2137, 46.2276],
  JP: [138.2529, 36.2048],
  AU: [133.7751, -25.2744],
  CA: [-106.3468, 56.1304],
  VN: [108.2772, 14.0583],
  BY: [27.9534, 53.7098],
};

interface AttackArc {
  id: string;
  fromLonLat: [number, number];
  toLonLat: [number, number];
  progress: number;
  speed: number;
  type: string;
  severity: string;
  color: string;
  event: ThreatEvent;
}

const ThreatMap: React.FC = () => {
  const { events, globalIntensity, topAttackingCountries, countryPairCounters, wsStatus } = useDangenTelemetry();
  const [selectedEvent, setSelectedEvent] = useState<ThreatEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef<number>(0);
  const scanAngleRef = useRef<number>(0);
  const worldDataRef = useRef<GeoJSON.FeatureCollection | GeoJSON.Feature | null>(null);
  const activeArcsRef = useRef<AttackArc[]>([]);

  // Initial REST API fetch & TopoJSON loading
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? `http://${window.location.hostname}:8000` 
        : ``);

    // Fetch initial REST threats
    fetch(`${apiUrl}/api/threats/geo`)
      .then(res => res.json())
      .then(data => {
        console.log("REST /api/threats/geo loaded:", data);
      })
      .catch(err => console.error("REST geo fetch error:", err));

    // Fetch World Atlas TopoJSON
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then((topo: Topology) => {
        worldDataRef.current = feature(topo, (topo as Topology).objects.countries) as GeoJSON.FeatureCollection | GeoJSON.Feature;
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('World TopoJSON fetch error:', err);
        setIsLoading(false);
      });
  }, []);

  // Sync active attack arcs from telemetry events
  useEffect(() => {
    const recentEvents = events.slice(0, 20);
    const existingIds = new Set(activeArcsRef.current.map(a => a.id));

    recentEvents.forEach(ev => {
      if (!existingIds.has(ev.id)) {
        const sc = ev.source_country || ev.country || 'UNKNOWN';
        const tc = ev.target_country || 'US';
        const fromLonLat = COUNTRY_COORDS[sc.toUpperCase()] || [105.3188, 61.5240];
        const toLonLat = COUNTRY_COORDS[tc.toUpperCase()] || [-95.7129, 37.0902];

        let color = '#ff003c';
        if (ev.type.toLowerCase().includes('ddos')) color = '#ff1744';
        else if (ev.type.toLowerCase().includes('malware')) color = '#ff4d6d';
        else if (ev.type.toLowerCase().includes('sql')) color = '#7a0019';

        activeArcsRef.current.push({
          id: ev.id,
          fromLonLat,
          toLonLat,
          progress: 0,
          speed: 0.005 + Math.random() * 0.005,
          type: ev.type,
          severity: ev.severity,
          color,
          event: ev
        });
      }
    });

    // Keep max 25 active arcs to ensure pristine 60fps GPU performance
    if (activeArcsRef.current.length > 25) {
      activeArcsRef.current = activeArcsRef.current.slice(-25);
    }
  }, [events]);

  // Main GPU-Optimized 60fps Canvas Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      if (!canvas) return;
      const W = canvas.width;
      const H = canvas.height;

      // Increment 3D globe rotation & radar scan angle
      rotationRef.current = (rotationRef.current + 0.2) % 360;
      scanAngleRef.current = (scanAngleRef.current + 1.5) % 360;

      ctx.clearRect(0, 0, W, H);

      // Deep space cyber background
      const bg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
      bg.addColorStop(0, '#0b000f');
      bg.addColorStop(1, '#050008');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Configure D3 Orthographic 3D Projection with subtle breathing motion
      const tilt = 15; // Planetary tilt
      const globeScale = 1 + Math.sin(Date.now() / 2800) * 0.006;
      const projection = geoOrthographic()
        .scale((Math.min(W, H) / 2.6) * globeScale)
        .translate([W / 2, H / 2])
        .rotate([rotationRef.current, -tilt, 0]);

      const pathGen = geoPath(projection, ctx);

      // Outer atmospheric glowing halo
      ctx.beginPath();
      ctx.arc(W / 2, H / 2, Math.min(W, H) / 2.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 0, 60, 0.03)';
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#ff003c';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Graticule grid lines
      ctx.beginPath();
      pathGen(geoGraticule10());
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.12)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      // Country Heatmap Intensity Overlays
      if (worldDataRef.current) {
        // Base country fill
        ctx.beginPath();
        pathGen(worldDataRef.current);
        ctx.fillStyle = 'rgba(20, 4, 10, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 60, 0.35)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Highlight top attacking countries with glowing heatmap intensity
        topAttackingCountries.forEach(tc => {
          const coords = COUNTRY_COORDS[tc.country.toUpperCase()];
          if (coords) {
            // Check if country coordinate is on front side of 3D globe
            const dist = geoDistance(coords, [-rotationRef.current, tilt]);
            if (dist < Math.PI / 2) {
              const pt = projection(coords);
              if (pt) {
                const intensity = Math.min(1, tc.count / 15);
                ctx.beginPath();
                ctx.arc(pt[0], pt[1], 25 + intensity * 20, 0, Math.PI * 2);
                const grad = ctx.createRadialGradient(pt[0], pt[1], 0, pt[0], pt[1], 25 + intensity * 20);
                grad.addColorStop(0, `rgba(255, 0, 60, ${0.4 * intensity})`);
                grad.addColorStop(1, 'rgba(255, 0, 60, 0)');
                ctx.fillStyle = grad;
                ctx.fill();
              }
            }
          }
        });
      }

      // Attack Clustering & Hotspot Visualization
      const clusterZones = ['US', 'DE', 'RU', 'CN'];
      clusterZones.forEach(zone => {
        const coords = COUNTRY_COORDS[zone];
        if (coords) {
          const dist = geoDistance(coords, [-rotationRef.current, tilt]);
          if (dist < Math.PI / 2) {
            const pt = projection(coords);
            if (pt) {
              // Pulsating concentric rings
              const pulseR = (Date.now() / 40) % 35;
              ctx.beginPath();
              ctx.arc(pt[0], pt[1], pulseR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 0, 60, ${1 - pulseR / 35})`;
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Hotspot core
              ctx.beginPath();
              ctx.arc(pt[0], pt[1], 4, 0, Math.PI * 2);
              ctx.fillStyle = '#ffffff';
              ctx.shadowBlur = 10;
              ctx.shadowColor = '#ff003c';
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      });

      // Packet Particle Trails along 3D Attack Arcs
      activeArcsRef.current.forEach(arc => {
        arc.progress += arc.speed;
        if (arc.progress >= 1) arc.progress = 0;

        const fromDist = geoDistance(arc.fromLonLat, [-rotationRef.current, tilt]);
        const toDist = geoDistance(arc.toLonLat, [-rotationRef.current, tilt]);
        const isFromVisible = fromDist < Math.PI / 2;
        const isToVisible = toDist < Math.PI / 2;

        const fromPt = projection(arc.fromLonLat);
        const toPt = projection(arc.toLonLat);

        if (!fromPt || !toPt) return;

        // Draw curved attack arc if both endpoints or intermediate points are visible
        if (isFromVisible || isToVisible) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(fromPt[0], fromPt[1]);
          const cx = (fromPt[0] + toPt[0]) / 2;
          const cy = (fromPt[1] + toPt[1]) / 2 - Math.abs(toPt[0] - fromPt[0]) * 0.25;
          ctx.quadraticCurveTo(cx, cy, toPt[0], toPt[1]);
          const grad = ctx.createLinearGradient(fromPt[0], fromPt[1], toPt[0], toPt[1]);
          grad.addColorStop(0, 'rgba(255, 0, 60, 0.15)');
          grad.addColorStop(0.5, `${arc.color}`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.65)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.setLineDash([8, 14]);
          ctx.lineDashOffset = -(Date.now() / 60) % 22;
          ctx.stroke();
          ctx.restore();
        }

        // Calculate exact 3D intermediate packet particle coordinate
        const interpolator = geoInterpolate(arc.fromLonLat, arc.toLonLat);
        const currentLonLat = interpolator(arc.progress);
        const currentDist = geoDistance(currentLonLat, [-rotationRef.current, tilt]);

        // Draw glowing packet particle if on the front side of the 3D globe
        if (currentDist < Math.PI / 2) {
          const currentPt = projection(currentLonLat);
          if (currentPt) {
            ctx.beginPath();
            ctx.arc(currentPt[0], currentPt[1], 4, 0, Math.PI * 2);
            ctx.fillStyle = arc.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = arc.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Packet trail comet head
            ctx.beginPath();
            ctx.arc(currentPt[0], currentPt[1], 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Impact ripple at the destination when progress is near the end
            const rippleFactor = Math.max(0, Math.min(1, (arc.progress - 0.6) / 0.4));
            if (rippleFactor > 0) {
              ctx.beginPath();
              ctx.arc(toPt[0], toPt[1], 10 + rippleFactor * 16, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 * (1 - rippleFactor)})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }
      });

      // Animated Radar Pulse Scan Sweep across the Globe
      const scanRad = (scanAngleRef.current * Math.PI) / 180;
      const scanX = W / 2 + Math.cos(scanRad) * (Math.min(W, H) / 2.6);
      const scanY = H / 2 + Math.sin(scanRad) * (Math.min(W, H) / 2.6);

      ctx.beginPath();
      ctx.moveTo(W / 2, H / 2);
      ctx.lineTo(scanX, scanY);
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.6)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff003c';
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [topAttackingCountries]);

  return (
    <div className="relative w-full h-[700px] bg-[#0b000f] rounded-2xl border border-red-500/30 overflow-hidden shadow-[0_0_50px_rgba(255,0,60,0.2)] flex flex-col lg:flex-row font-mono">
      {/* Loading Skeleton Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-40 bg-[#0b000f]/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-4 border border-red-500/20">
          <div className="w-16 h-16 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin" />
          <div className="text-sm font-mono text-red-400 font-bold tracking-widest animate-pulse uppercase">
            INITIALIZING 3D GEOPULSE RADAR & NEURAL TOPOLOGY...
          </div>
        </div>
      )}

      {/* Graceful WebSocket Reconnect State Overlay */}
      {wsStatus === 'reconnecting' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-red-950/90 border border-red-500 text-red-400 px-6 py-2.5 rounded-full shadow-[0_0_30px_rgba(255,0,60,0.6)] backdrop-blur-md flex items-center gap-3 animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-bold tracking-widest uppercase">⚠️ NEURAL FEED DISCONNECTED — RECONNECTING...</span>
        </div>
      )}

      {/* 3D Rotating Globe Canvas Area */}
      <div className="flex-1 h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_center,transparent_20%,#0b000f_100%)]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

        {/* Global Threat Intensity Meter */}
        <div className="absolute top-6 left-6 z-20 bg-[#14040a]/90 border border-red-500/40 rounded-xl p-4 backdrop-blur-md shadow-[0_0_25px_rgba(255,0,60,0.25)] w-72">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wider text-red-500">GLOBAL INTENSITY</span>
            <span className="text-sm font-bold text-red-400">{globalIntensity}%</span>
          </div>
          <div className="h-2 bg-red-950/50 rounded-full overflow-hidden border border-red-500/20">
            <motion.div 
              className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400"
              animate={{ width: `${globalIntensity}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400">
            <span>STATUS: {globalIntensity > 75 ? 'CRITICAL' : globalIntensity > 50 ? 'HIGH' : 'ELEVATED'}</span>
            <span className="text-red-500 animate-pulse font-bold">● LIVE TELEMETRY</span>
          </div>
        </div>

        {/* Radar Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-[#14040a]/80 border border-red-500/20 rounded-xl p-4 backdrop-blur-md space-y-2 text-[10px] text-gray-400">
          <div className="font-bold text-white mb-1 uppercase tracking-wider border-b border-red-500/20 pb-1">3D RADAR LEGEND</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ff1744] shadow-[0_0_6px_#ff1744]" /> DDoS Flood Beam</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ff4d6d] shadow-[0_0_6px_#ff4d6d]" /> Malware Glitch Stream</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#7a0019] shadow-[0_0_6px_#7a0019]" /> SQLi / Exploit Trajectory</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" /> Attack Hotspot Convergence</div>
        </div>
      </div>

      {/* Floating Realistic Cyber Telemetry & Terminal Logs Sidebar */}
      <div className="w-full lg:w-[420px] border-t lg:border-t-0 lg:border-l border-red-500/30 bg-[#14040a]/85 backdrop-blur-xl p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar z-20">
        {/* Top Attacking Countries */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Top Attacking Countries
          </h3>
          <div className="space-y-2">
            {topAttackingCountries.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-gray-300">
                  <span className="text-red-500 font-bold">{i + 1}.</span>
                  <span>{item.country}</span>
                </div>
                <div className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                  {item.count} attacks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country-to-Country Attack Counter */}
        <div>
          <h3 className="text-xs font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Active Attack Vectors
          </h3>
          <div className="space-y-2">
            {countryPairCounters.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-300 font-semibold">{item.pair}</span>
                <span className="text-xs text-red-400 font-bold">{item.count} waves</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Live Terminal Threat Logs */}
        <div className="flex-1 flex flex-col min-h-[280px]">
          <h3 className="text-xs font-bold tracking-widest text-white uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Terminal Threat Logs
          </h3>
          <div className="flex-1 bg-black/50 border border-red-500/20 rounded-xl p-3 overflow-y-auto custom-scrollbar space-y-2.5 text-[11px]">
            <AnimatePresence initial={false}>
              {events.slice(0, 15).map((ev) => (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedEvent(ev)}
                  className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg hover:border-red-500/50 cursor-pointer transition-all group space-y-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <div className="flex items-center justify-between text-[10px] border-b border-red-500/10 pb-1">
                    <span className="text-red-500 font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      {ev.type}
                    </span>
                    <span className="text-gray-500">{ev.timestamp}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[10px]">
                    <div><span className="text-gray-500">ACTOR:</span> <span className="text-red-400 font-bold">{ev.threat_actor || 'APT29'}</span></div>
                    <div><span className="text-gray-500">MALWARE:</span> <span className="text-white font-bold">{ev.malware_family || 'LockBit 3.0'}</span></div>
                    <div><span className="text-gray-500">CVE:</span> <span className="text-orange-400 font-bold">{ev.cve || 'CVE-2023-38606'}</span></div>
                    <div><span className="text-gray-500">PORT:</span> <span className="text-red-400 font-bold">{ev.protocol || 'TCP'}/{ev.target_port || 443}</span></div>
                    <div className="col-span-2"><span className="text-gray-500">ASN:</span> <span className="text-gray-300">{ev.asn || 'AS12389 Rostelecom'}</span></div>
                    <div className="col-span-2"><span className="text-gray-500">ISP:</span> <span className="text-gray-300">{ev.isp || 'Rostelecom'}</span></div>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                    <span className="text-gray-400 font-bold">{ev.ip} ({ev.source_country || ev.country || 'RU'})</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      ev.severity === 'critical' || ev.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_8px_rgba(255,0,60,0.4)]' :
                      ev.severity === 'high' || ev.severity === 'HIGH' ? 'bg-red-800/20 text-red-300 border border-red-800/50' :
                      'bg-red-950/20 text-gray-400 border border-red-900/30'
                    }`}>
                      {ev.threat_level || ev.severity.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Rich Cyber Telemetry Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#14040a] border border-red-500 rounded-2xl p-6 max-w-lg w-full shadow-[0_0_50px_rgba(255,0,60,0.4)] font-mono space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-red-500/20 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping shadow-[0_0_10px_#ff003c]" />
                  Advanced Threat Telemetry Profile
                </h3>
                <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-white text-2xl">&times;</button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-black/40 p-4 rounded-xl border border-red-500/20">
                <div><span className="text-gray-500 block mb-1">THREAT ACTOR:</span><span className="text-red-400 font-bold text-sm">{selectedEvent.threat_actor || 'APT29 (Cozy Bear)'}</span></div>
                <div><span className="text-gray-500 block mb-1">MALWARE FAMILY:</span><span className="text-white font-bold text-sm">{selectedEvent.malware_family || 'LockBit 3.0'}</span></div>
                <div><span className="text-gray-500 block mb-1">EXPLOITED CVE:</span><span className="text-orange-400 font-bold text-sm">{selectedEvent.cve || 'CVE-2023-38606'}</span></div>
                <div><span className="text-gray-500 block mb-1">TARGET PROTOCOL/PORT:</span><span className="text-red-400 font-bold text-sm">{selectedEvent.protocol || 'TCP'} / {selectedEvent.target_port || 443}</span></div>
                <div className="col-span-2"><span className="text-gray-500 block mb-1">AUTONOMOUS SYSTEM (ASN):</span><span className="text-gray-300 font-bold">{selectedEvent.asn || 'AS12389 Rostelecom'}</span></div>
                <div className="col-span-2"><span className="text-gray-500 block mb-1">INTERNET SERVICE PROVIDER (ISP):</span><span className="text-gray-300 font-bold">{selectedEvent.isp || 'Rostelecom'}</span></div>
              </div>

              <div className="space-y-2.5 text-xs bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                <div className="flex justify-between"><span className="text-gray-500">Attack ID:</span><span className="text-red-400 font-bold">{selectedEvent.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Vector Type:</span><span className="text-white font-bold">{selectedEvent.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Source IP:</span><span className="text-red-400 font-bold">{selectedEvent.ip}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Target IP:</span><span className="text-white">{selectedEvent.target_ip || '10.0.0.1'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Source Country:</span><span className="text-white font-bold">{selectedEvent.source_country || selectedEvent.country || 'UNKNOWN'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Packet Velocity:</span><span className="text-red-500 font-bold">{selectedEvent.packets_per_second?.toLocaleString() || 45210} PPS</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Threat Level:</span><span className="text-red-500 font-bold">{selectedEvent.threat_level || selectedEvent.severity.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">AI Confidence:</span><span className="text-green-400 font-bold">{selectedEvent.confidence}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Timestamp:</span><span className="text-gray-400">{selectedEvent.timestamp}</span></div>
              </div>

              <div className="mt-6 pt-4 border-t border-red-500/20 flex justify-end gap-3">
                <button onClick={() => setSelectedEvent(null)} className="px-6 py-2.5 bg-red-500 border border-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold shadow-[0_0_15px_rgba(255,0,60,0.4)]">
                  CLOSE TELEMETRY PROFILE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThreatMap;
