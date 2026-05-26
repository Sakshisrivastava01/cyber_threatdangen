import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface QuantumShieldProps {
  height?: number;
}

const QuantumShield: React.FC<QuantumShieldProps> = ({ height = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [integrity, setIntegrity] = useState(100);
  const [frequency, setFrequency] = useState(482.5);

  useEffect(() => {
    const timer = setInterval(() => {
      setIntegrity(prev => {
        // Keep it near 100 but make it fluctuate slightly
        const delta = (Math.random() - 0.5) * 0.05;
        return parseFloat(Math.min(100, Math.max(99.8, prev + delta)).toFixed(2));
      });
      setFrequency(prev => {
        const delta = (Math.random() - 0.5) * 1.2;
        return parseFloat(Math.min(500, Math.max(450, prev + delta)).toFixed(1));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Canvas drawing
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

    const animate = () => {
      const time = Date.now() * 0.0015;
      ctx.fillStyle = 'rgba(11, 0, 15, 0.2)';
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2;

      // Draw grid lattice background
      ctx.strokeStyle = 'rgba(138, 255, 154, 0.04)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw shield rings
      const rings = 4;
      for (let i = 1; i <= rings; i++) {
        const radius = i * 22 + Math.sin(time + i) * 3;
        const opacity = (1 - (i / (rings + 1))) * 0.35;
        ctx.strokeStyle = `rgba(138, 255, 154, ${opacity})`;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting node on ring
        const angle = time * (1.2 / i) + (i * Math.PI / 2);
        const nodeX = centerX + Math.cos(angle) * radius;
        const nodeY = centerY + Math.sin(angle) * radius;

        ctx.fillStyle = '#8aff9a';
        ctx.shadowColor = '#8aff9a';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw central shield core
      const coreRadius = 8 + Math.sin(time * 3) * 1.5;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreRadius * 2.5);
      coreGrad.addColorStop(0, 'rgba(138, 255, 154, 0.8)');
      coreGrad.addColorStop(0.5, 'rgba(138, 255, 154, 0.25)');
      coreGrad.addColorStop(1, 'rgba(138, 255, 154, 0)');
      
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8aff9a';
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [height]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      className="relative bg-black/60 border border-red-500/30 rounded-lg p-5 font-mono text-xs backdrop-blur-md shadow-[0_0_30px_rgba(255,0,60,0.15)] overflow-hidden flex flex-col gap-4"
    >
      {/* HUD futuristic grid background & corners */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(138,255,154,0.03),transparent_55%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-500" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-red-500" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-red-500" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-500" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#8aff9a]" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.25em]">
            QUANTUM SHIELD MATRIX
          </span>
        </div>
        <span className="text-[9px] text-gray-500 uppercase tracking-widest">
          NODE-SHIELD
        </span>
      </div>

      {/* Visual Canvas (Quantum Grid) */}
      <div className="relative border border-red-950 bg-black/30 rounded overflow-hidden" style={{ height }}>
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute top-2 left-2 bg-black/50 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[8px] text-emerald-300 font-bold uppercase tracking-wider">
          STABILITY VECTOR
        </div>
      </div>

      {/* Stats display */}
      <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[9px] uppercase tracking-widest text-gray-500">
        <div className="border border-red-950/40 bg-black/30 rounded py-1.5">
          <span>ENCRYPTION</span>
          <div className="text-emerald-400 font-bold mt-0.5 text-[10px]">Q-AES</div>
        </div>
        <div className="border border-red-950/40 bg-black/30 rounded py-1.5">
          <span>SHIELD INT.</span>
          <div className="text-emerald-400 font-bold mt-0.5 text-[10px]">{integrity}%</div>
        </div>
        <div className="border border-red-950/40 bg-black/30 rounded py-1.5">
          <span>FREQUENCY</span>
          <div className="text-emerald-400 font-bold mt-0.5 text-[10px]">{frequency} THz</div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuantumShield;
