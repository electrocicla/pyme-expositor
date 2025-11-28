import React, { useEffect, useRef } from 'react';

interface NeonCursorProps {
  color?: string;
  glowColor?: string;
  size?: number;
  glowSize?: number;
  trailLength?: number;
}

const NeonCursor: React.FC<NeonCursorProps> = ({
  color = '#00ff88',
  glowColor,
  size = 12,
  glowSize = 30,
  trailLength = 15,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const actualGlowColor = glowColor || color;

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add current position to trail
      trailRef.current.push({ ...mouseRef.current });
      if (trailRef.current.length > trailLength) {
        trailRef.current.shift();
      }

      // Draw glowing trail
      if (trailRef.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);

        for (let i = 1; i < trailRef.current.length; i++) {
          const point = trailRef.current[i];
          ctx.lineTo(point.x, point.y);
        }

        // Outer glow
        ctx.strokeStyle = actualGlowColor;
        ctx.lineWidth = glowSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.1;
        ctx.filter = `blur(${glowSize / 2}px)`;
        ctx.stroke();

        // Middle glow
        ctx.lineWidth = glowSize / 2;
        ctx.globalAlpha = 0.2;
        ctx.stroke();

        // Core line
        ctx.filter = 'none';
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
      }

      // Draw neon cursor dot with glow
      const { x, y } = mouseRef.current;

      // Outer glow
      ctx.beginPath();
      ctx.arc(x, y, glowSize, 0, Math.PI * 2);
      ctx.fillStyle = actualGlowColor;
      ctx.globalAlpha = 0.15;
      ctx.filter = `blur(${glowSize / 2}px)`;
      ctx.fill();

      // Middle glow
      ctx.beginPath();
      ctx.arc(x, y, size * 2, 0, Math.PI * 2);
      ctx.globalAlpha = 0.4;
      ctx.fill();

      // Core
      ctx.filter = 'none';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Bright center
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.8;
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [color, glowColor, size, glowSize, trailLength]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default NeonCursor;
