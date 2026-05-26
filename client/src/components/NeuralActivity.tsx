import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralActivityProps {
  values?: number[];
  height?: number;
}

const NeuralActivity: React.FC<NeuralActivityProps> = ({ values = [], height = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valuesRef = useRef<number[]>(values);
  const [integrity, setIntegrity] = useState(98.42);
  const [blocked, setBlocked] = useState(1284);
  const [equalizerBars, setEqualizerBars] = useState<number[]>([]);

  // Periodically update mock metrics to make the UI look alive
  useEffect(() => {
    const timer = setInterval(() => {
      setIntegrity(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return parseFloat(Math.min(100, Math.max(90, prev + change)).toFixed(2));
      });
      setBlocked(prev => prev + Math.floor(Math.random() * 2));
    }, 1500);

    const eqTimer = setInterval(() => {
      const bars = Array.from({ length: 12 }, () => Math.floor(Math.random() * 45) + 5);
      setEqualizerBars(bars);
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(eqTimer);
    };
  }, []);

  useEffect(() => {
    if (values.length > 0) {
      valuesRef.current = values;
    }
  }, [values]);

  // Canvas-based neural network node drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = height;
    canvas.width = w * scale;
    canvas.height = h * scale;
    ctx.scale(scale, scale);

    let animationId: number;
    const nodeCount = 14;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: 35 + Math.random() * (w - 70),
      y: 25 + Math.random() * (h - 50),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      pulse: Math.random() * Math.PI,
      val: Math.random() * 10,
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(11, 0, 15, 0.22)';
      ctx.fillRect(0, 0, w, h);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (dist < 85) {
            const alpha = (1 - dist / 85) * 0.25;
            ctx.strokeStyle = `rgba(255, 0, 60, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n, idx) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.03;

        // Bounce off walls
        if (n.x < 15 || n.x > w - 15) n.vx *= -1;
        if (n.y < 15 || n.y > h - 15) n.vy *= -1;

        const pulseScale = 0.8 + 0.2 * Math.sin(n.pulse);
        const radius = 3 * pulseScale;

        // Gradient outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
        grad.addColorStop(0, 'rgba(255, 0, 60, 0.4)');
        grad.addColorStop(1, 'rgba(255, 0, 60, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Node center
        ctx.fillStyle = idx % 3 === 0 ? '#ff8a9a' : '#ff003c';
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [height]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
      className="relative bg-black/60 border border-red-500/30 rounded-lg p-5 font-mono text-xs backdrop-blur-md shadow-[0_0_30px_rgba(255,0,60,0.15)] overflow-hidden flex flex-col gap-4"
    >
      {/* Background radial effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,0,60,0.04),transparent_55%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-[0.25em]">
            NEURAL ANALYSIS SYSTEM
          </span>
        </div>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest">
          FIREWALL LAYER 4
        </span>
      </div>

      {/* Visual Canvas (Neural Activity Network) */}
      <div className="relative border border-red-950 bg-black/30 rounded overflow-hidden" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute top-2 left-2 bg-black/50 border border-red-500/20 px-1.5 py-0.5 rounded text-[8px] text-red-300 font-bold uppercase tracking-wider">
          SYNAPTIC MESH
        </div>
      </div>

      {/* Firewall metrics and equalizers */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* Equalizer Bars */}
        <div className="border border-red-950 bg-black/30 rounded p-2.5 flex flex-col justify-between">
          <span className="text-[9px] text-gray-500 uppercase tracking-wider mb-2">NEURAL GAIN</span>
          <div className="flex items-end justify-between h-8 gap-0.5 px-0.5">
            {equalizerBars.map((val, idx) => (
              <div
                key={idx}
                className="w-full bg-gradient-to-t from-red-800 to-red-500 rounded-t"
                style={{ height: `${val}%` }}
              />
            ))}
          </div>
        </div>

        {/* Live metrics stats */}
        <div className="border border-red-950 bg-black/30 rounded p-2.5 flex flex-col justify-between gap-1.5">
          <div>
            <div className="flex justify-between text-[8px] text-gray-500 uppercase tracking-wider">
              <span>FIREWALL INT.</span>
              <span className="text-red-400 font-bold">{integrity}%</span>
            </div>
            <div className="w-full h-1 bg-red-950/40 rounded overflow-hidden mt-1">
              <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${integrity}%` }} />
            </div>
          </div>
          <div className="flex justify-between items-center text-[9px] mt-1">
            <span className="text-gray-500 uppercase tracking-wider">BLOCKED SCANS</span>
            <span className="font-bold text-red-400">{blocked.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralActivity;
