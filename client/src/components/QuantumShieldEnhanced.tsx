import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface QuantumShieldProps {
  height?: number;
}

const QuantumShieldPanel: React.FC<QuantumShieldProps> = ({ height = 200 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    let animationId: number;

    const animate = () => {
      const now = Date.now() * 0.0005;
      const w = canvas.width / window.devicePixelRatio;
      const h = height;

      // Clear canvas with fade
      ctx.fillStyle = 'rgba(11, 0, 15, 0.12)';
      ctx.fillRect(0, 0, w, h);

      // Draw quantum grid
      const gridSize = 25;
      const gridCols = Math.ceil(w / gridSize) + 2;
      const gridRows = Math.ceil(h / gridSize) + 2;

      ctx.strokeStyle = 'rgba(138, 255, 154, 0.1)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let i = -1; i < gridCols; i++) {
        const x = i * gridSize;
        const offsetY = Math.sin(now + x * 0.02) * 3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + offsetY, h);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = -1; i < gridRows; i++) {
        const y = i * gridSize;
        const offsetX = Math.cos(now + y * 0.02) * 3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + offsetX);
        ctx.stroke();
      }

      // Draw quantum nodes at grid intersections
      ctx.globalAlpha = 0.6;

      for (let i = -1; i < gridCols; i++) {
        for (let j = -1; j < gridRows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;

          // Calculate distance-based pulsing effect
          const distToCenter = Math.sqrt(
            Math.pow(x - w / 2, 2) + Math.pow(y - h / 2, 2)
          );
          const pulse =
            0.5 +
            0.5 * Math.sin(now * 3 - distToCenter * 0.008);

          // Determine node color based on position and time
          const hueShift = (i + j) * 0.1 + now;
          const isActive = Math.sin(hueShift * 5) > 0.3;

          if (isActive) {
            // Active node - green quantum state
            ctx.fillStyle = `rgba(138, 255, 154, ${pulse * 0.8})`;
            ctx.shadowColor = 'rgba(138, 255, 154, 0.6)';
          } else {
            // Dormant node - red quantum state
            ctx.fillStyle = `rgba(255, 0, 60, ${pulse * 0.4})`;
            ctx.shadowColor = 'rgba(255, 0, 60, 0.3)';
          }

          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(x, y, 3 + pulse * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw connecting energy flows between active nodes
      ctx.strokeStyle = 'rgba(138, 255, 154, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.3;

      for (let i = 0; i < gridCols - 1; i++) {
        for (let j = 0; j < gridRows - 1; j++) {
          const x1 = i * gridSize;
          const y1 = j * gridSize;

          // Right connection
          const flow1 = Math.sin(now * 2 + i * 0.5 + j * 0.3) * 0.5 + 0.5;
          if (flow1 > 0.4) {
            ctx.globalAlpha = (flow1 - 0.4) * 0.8;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1 + gridSize, y1);
            ctx.stroke();
          }

          // Down connection
          const flow2 = Math.sin(now * 2 + i * 0.3 + j * 0.5) * 0.5 + 0.5;
          if (flow2 > 0.4) {
            ctx.globalAlpha = (flow2 - 0.4) * 0.8;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y1 + gridSize);
            ctx.stroke();
          }
        }
      }

      // Draw core quantum singularity
      ctx.globalAlpha = 1;
      const centerX = w / 2;
      const centerY = h / 2;
      const singularitySize = 15 + Math.sin(now * 3) * 5;
      const singularityPulse = 0.7 + 0.3 * Math.sin(now * 2);

      // Outer rings
      for (let ring = 3; ring > 0; ring--) {
        ctx.strokeStyle = `rgba(138, 255, 154, ${singularityPulse * 0.4 / ring})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, singularitySize + ring * 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Core
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        singularitySize
      );
      coreGradient.addColorStop(0, `rgba(138, 255, 154, ${singularityPulse})`);
      coreGradient.addColorStop(0.7, `rgba(138, 255, 154, ${singularityPulse * 0.3})`);
      coreGradient.addColorStop(1, 'rgba(138, 255, 154, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, singularitySize, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [height]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="bg-black/60 border-2 border-red-500/30 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_0_40px_rgba(255,0,60,0.15)]"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-red-500/20 bg-red-950/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(138,255,154,0.8)]" />
            <span className="text-xs font-bold text-green-500 uppercase tracking-[0.3em]">QUANTUM SHIELD MATRIX</span>
          </div>
          <span className="text-[9px] text-gray-400 uppercase tracking-wider">STABLE</span>
        </div>
      </div>

      {/* Canvas Visualization */}
      <div className="relative overflow-hidden" style={{ height }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{
            boxShadow: 'inset 0 0 30px rgba(138, 255, 154, 0.08)',
          }}
        />
      </div>

      {/* Footer Status */}
      <div className="px-6 py-3 border-t border-red-500/20 bg-red-950/5 grid grid-cols-3 gap-2 text-[8px] text-gray-500 uppercase tracking-widest">
        <div className="text-center">
          <span>ENCRYPTION</span>
          <div className="text-green-400 font-bold text-xs">AES-256</div>
        </div>
        <div className="text-center border-l border-r border-red-950">
          <span>SHIELD STATUS</span>
          <div className="text-green-400 font-bold text-xs">100%</div>
        </div>
        <div className="text-center">
          <span>INTEGRITY</span>
          <div className="text-green-400 font-bold text-xs">VERIFIED</div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuantumShieldPanel;
