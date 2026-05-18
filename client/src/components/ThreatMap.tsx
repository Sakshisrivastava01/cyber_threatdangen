import React, { useEffect, useRef } from 'react';

const ThreatMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    const resize = () => {
      width = canvas.parentElement?.clientWidth || 800;
      height = canvas.parentElement?.clientHeight || 400;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Mock nodes
    const nodes = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      isTarget: Math.random() > 0.8
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw map grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw nodes
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isTarget ? '#00E5FF' : 'rgba(255,255,255,0.3)';
        
        if (node.isTarget) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#00E5FF';
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      });

      // Draw connections
      ctx.shadowBlur = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(123, 97, 255, ${1 - dist / 100})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Random attack pulses
            if (Math.random() > 0.99) {
               ctx.beginPath();
               ctx.arc((nodes[i].x + nodes[j].x)/2, (nodes[i].y + nodes[j].y)/2, 3, 0, Math.PI*2);
               ctx.fillStyle = '#00FFA3';
               ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-dangen-dark/50" />
  );
};

export default ThreatMap;
