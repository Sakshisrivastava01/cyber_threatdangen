import React, { useEffect, useRef } from 'react';

interface MatrixStreamProps {
  opacity?: number;
}

const MatrixStream: React.FC<MatrixStreamProps> = ({ opacity = 0.15 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resizeCanvas();

    // Characters: Hex numbers, binary, and cyber symbols
    const chars = '0123456789ABCDEF<>[]{}/\\_-+=*!#$@%&☠☣⚡🛡';
    const charArray = chars.split('');

    const fontSize = 14;
    let columns = Math.floor(canvas.width / fontSize);

    // Drops coordinates: y position for each column
    let drops: number[] = [];
    const initDrops = () => {
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.random() * -100; // start off-screen to stagger onset
      }
    };
    initDrops();

    const draw = () => {
      // Slightly translucent dark background to create trail effect
      ctx.fillStyle = 'rgba(11, 0, 15, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw first character in each stream brighter (white-red glow)
        if (Math.random() > 0.94) {
          ctx.fillStyle = '#ffccd5';
        } else {
          ctx.fillStyle = 'rgba(255, 0, 60, 0.6)';
        }

        ctx.fillText(text, x, y);

        // Reset drops if off-screen, with random delay
        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resizeCanvas();
      initDrops();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      style={{ opacity }}
    />
  );
};

export default MatrixStream;
