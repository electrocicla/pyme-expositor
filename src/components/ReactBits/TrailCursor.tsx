import React, { useEffect, useRef } from 'react';

interface TrailCursorProps {
  color?: string;
  trailLength?: number;
  size?: number;
  fadeSpeed?: number;
}

interface Point {
  x: number;
  y: number;
  age: number;
}

const TrailCursor: React.FC<TrailCursorProps> = ({
  color = '#6366f1',
  trailLength = 20,
  size = 8,
  fadeSpeed = 0.05,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
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

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add new point at mouse position
      pointsRef.current.push({
        x: mouseRef.current.x,
        y: mouseRef.current.y,
        age: 1,
      });

      // Keep only the last N points
      if (pointsRef.current.length > trailLength) {
        pointsRef.current.shift();
      }

      // Draw trail
      pointsRef.current.forEach((point, index) => {
        point.age -= fadeSpeed;
        if (point.age <= 0) return;

        const progress = index / pointsRef.current.length;
        const currentSize = size * progress * point.age;
        const opacity = point.age * progress;

        ctx.beginPath();
        ctx.arc(point.x, point.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      // Draw main cursor dot
      ctx.beginPath();
      ctx.arc(mouseRef.current.x, mouseRef.current.y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 1;
      ctx.fill();

      // Remove dead points
      pointsRef.current = pointsRef.current.filter(p => p.age > 0);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [color, trailLength, size, fadeSpeed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default TrailCursor;
