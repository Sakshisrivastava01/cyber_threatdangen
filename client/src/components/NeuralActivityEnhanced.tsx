import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NeuralActivityProps {
  values?: number[];
  height?: number;
}

const NeuralActivityPanel: React.FC<NeuralActivityProps> = ({ values = [], height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valuesRef = useRef<number[]>(values);
  const networkRef = useRef<number[]>([]);

  // Update neural network nodes when values change
  useEffect(() => {
    if (values.length > 0) {
      valuesRef.current = values;
    }
  }, [values]);

  // Initialize and animate neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initialize network nodes if empty
    if (networkRef.current.length === 0) {
      networkRef.current = Array.from({ length: 24 }, () => 0);
    }

    let animationId: number;

    const animate = () => {
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(11, 0, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, height);

      const now = Date.now() * 0.001; // Convert to seconds
      const centerX = (canvas.width / window.devicePixelRatio) / 2;
      const centerY = height / 2;
      const nodeRadius = 4;
      const orbits = 4;
      const nodesPerOrbit = 6;

      // Draw connections between nodes
      ctx.strokeStyle = 'rgba(255, 0, 60, 0.2)';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;

      for (let orbit = 1; orbit < orbits; orbit++) {
        for (let i = 0; i < nodesPerOrbit; i++) {
          const angle1 = (i / nodesPerOrbit) * Math.PI * 2;
          const nextAngle = ((i + 1) / nodesPerOrbit) * Math.PI * 2;
          const radius = 30 + orbit * 25;

          const x1 = centerX + Math.cos(angle1) * radius;
          const y1 = centerY + Math.sin(angle1) * radius;
          const x2 = centerX + Math.cos(nextAngle) * radius;
          const y2 = centerY + Math.sin(nextAngle) * radius;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // Draw nodes
      ctx.globalAlpha = 1;
      let nodeIndex = 0;

      for (let orbit = 1; orbit < orbits; orbit++) {
        for (let i = 0; i < nodesPerOrbit; i++) {
          const angle = (i / nodesPerOrbit) * Math.PI * 2 + now * 0.3;
          const radius = 30 + orbit * 25;

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Update node value
          if (valuesRef.current.length > 0 && nodeIndex < valuesRef.current.length) {
            networkRef.current[nodeIndex] = Math.max(
              networkRef.current[nodeIndex] - 2,
              valuesRef.current[nodeIndex] / 30
            );
          } else {
            networkRef.current[nodeIndex] = Math.max(networkRef.current[nodeIndex] - 1, 0);
          }

          const nodeValue = networkRef.current[nodeIndex];
          const glowSize = nodeRadius + nodeValue * 3;
          const brightness = Math.min(1, nodeValue);

          // Draw glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowSize * 2);
          gradient.addColorStop(0, `rgba(255, 0, 60, ${brightness * 0.6})`);
          gradient.addColorStop(0.5, `rgba(255, 0, 60, ${brightness * 0.2})`);
          gradient.addColorStop(1, `rgba(255, 0, 60, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, glowSize * 2, 0, Math.PI * 2);
          ctx.fill();

          // Draw core node
          ctx.fillStyle = `rgba(255, ${Math.floor(60 + brightness * 100)}, ${Math.floor(60 + brightness * 100)}, 1)`;
          ctx.shadowColor = `rgba(255, 0, 60, ${brightness * 0.8})`;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          nodeIndex++;
        }
      }

      // Draw center core
      ctx.fillStyle = 'rgba(255, 0, 60, 0.9)';
      ctx.shadowColor = 'rgba(255, 0, 60, 0.8)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nodeRadius * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw pulsing energy ring
      ctx.strokeStyle = `rgba(255, 0, 60, ${0.3 + Math.sin(now * 3) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 90 + Math.sin(now * 2) * 10, 0, Math.PI * 2);
      ctx.stroke();

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [height]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.8 }}
      className="bg-black/60 border-2 border-red-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,0,60,0.15)]"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-red-500/20 bg-red-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(255,0,60,0.8)]" />
            <span className="text-xs font-bold text-red-500 uppercase tracking-[0.3em]">NEURAL NETWORK ACTIVITY</span>
          </div>
          <span className="text-[9px] text-gray-400 uppercase tracking-wider">REAL-TIME</span>
        </div>
      </div>

      {/* Canvas Visualization */}
      <div className="relative overflow-hidden" style={{ height }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            boxShadow: 'inset 0 0 30px rgba(255, 0, 60, 0.05)',
          }}
        />
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-3 border-t border-red-500/20 bg-red-950/5 grid grid-cols-3 gap-2 text-[8px] text-gray-500 uppercase tracking-widest">
        <div className="text-center">
          <span>NODES</span>
          <div className="text-red-400 font-bold text-xs">24</div>
        </div>
        <div className="text-center border-l border-r border-red-950">
          <span>THROUGHPUT</span>
          <div className="text-green-400 font-bold text-xs">2.4GB/s</div>
        </div>
        <div className="text-center">
          <span>LATENCY</span>
          <div className="text-yellow-400 font-bold text-xs">12ms</div>
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralActivityPanel;
