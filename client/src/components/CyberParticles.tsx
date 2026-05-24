import React, { useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  type: 'spark' | 'glow' | 'digital';
}

const CyberParticles: React.FC<{ intensity?: number; className?: string }> = ({ intensity = 0.6, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const particleCounterRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create new particles
    const createParticle = (): Particle => {
      const types = ['spark', 'glow', 'digital'] as const;
      const type = types[Math.floor(Math.random() * types.length)];
      
      return {
        id: particleCounterRef.current++,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5 - 0.3,
        life: 1.0,
        size: Math.random() * 2 + 0.5,
        type,
      };
    };

    // Animation loop
    const animate = () => {
      // Spawn new particles based on intensity
      const particleSpawnRate = Math.floor(8 * intensity);
      for (let i = 0; i < particleSpawnRate; i++) {
        if (particlesRef.current.length < 120) {
          particlesRef.current.push(createParticle());
        }
      }

      // Clear canvas with trail effect
      ctx.fillStyle = 'rgba(11, 0, 15, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and render particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.life -= 0.008;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.02; // Slight gravity

        if (particle.life <= 0) return false;

        const alpha = Math.max(0, particle.life);

        if (particle.type === 'spark') {
          ctx.fillStyle = `rgba(255, 0, 60, ${alpha * 0.8})`;
          ctx.shadowColor = `rgba(255, 0, 60, ${alpha * 0.6})`;
          ctx.shadowBlur = 8;
          ctx.fillRect(particle.x, particle.y, particle.size, particle.size * 2);
        } else if (particle.type === 'glow') {
          ctx.fillStyle = `rgba(255, 100, 150, ${alpha * 0.4})`;
          ctx.shadowColor = `rgba(255, 0, 60, ${alpha * 0.8})`;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'digital') {
          ctx.fillStyle = `rgba(138, 255, 154, ${alpha * 0.5})`;
          ctx.shadowColor = `rgba(138, 255, 154, ${alpha * 0.4})`;
          ctx.shadowBlur = 6;
          const char = String.fromCharCode(0x00A0 + Math.floor(Math.random() * 16));
          ctx.font = `${particle.size * 8}px monospace`;
          ctx.fillText(char, particle.x, particle.y);
        }

        return true;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  );
};

export default CyberParticles;
