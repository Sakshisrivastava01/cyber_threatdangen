import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import { motion } from 'framer-motion';

interface CinematicBackgroundProps {
  stage: number;
}

const CinematicBackground: FC<CinematicBackgroundProps> = ({ stage }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    const particles = Array.from({ length: 72 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.6 + 0.4,
      speed: Math.random() * 0.0025 + 0.001,
      drift: (Math.random() - 0.5) * 0.12,
    }));

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resize();

    const draw = () => {
      if (!canvas.width || !canvas.height) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(11, 0, 15, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const intensity = stage >= 3 ? 0.12 : 0.08;
      ctx.strokeStyle = `rgba(255, 0, 65, ${intensity})`;
      ctx.lineWidth = 0.8;

      for (let x = 0; x < canvas.width; x += 96) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 96) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255, 0, 80, 0.12)';
      particles.forEach((particle) => {
        particle.y -= particle.speed * canvas.height;
        particle.x += particle.drift;
        if (particle.y < 0) particle.y = 1;
        if (particle.x < 0) particle.x = 1;
        if (particle.x > 1) particle.x = 0;

        ctx.beginPath();
        const px = particle.x * canvas.width;
        const py = particle.y * canvas.height;
        ctx.arc(px, py, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId = requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, [stage]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
        style={{ filter: 'blur(0.6px)' }}
      />
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: stage >= 2 ? 0.9 : 0.95 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{
          background: 'radial-gradient(circle at 50% 20%, rgba(255, 0, 90, 0.08), transparent 18%), radial-gradient(circle at 80% 70%, rgba(255, 0, 50, 0.04), transparent 16%)',
        }}
      />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,0,60,0.02),rgba(255,0,60,0.02)1px,transparent 1px,transparent 5px)] opacity-40" />
    </div>
  );
};

export default CinematicBackground;
