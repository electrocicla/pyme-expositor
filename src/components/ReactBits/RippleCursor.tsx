import React, { useEffect, useRef } from 'react';

interface RippleCursorProps {
  color?: string;
  maxRipples?: number;
  rippleDuration?: number;
  maxSize?: number;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  id: number;
}

const RippleCursor: React.FC<RippleCursorProps> = ({
  color = '#3b82f6',
  maxRipples = 20,
  rippleDuration = 1000,
  maxSize = 100,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const idCounter = useRef(0);
  const lastClickTime = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Handle mouse movement for ripple trail
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle ripple creation
      if (now - lastClickTime.current < 50) return;
      lastClickTime.current = now;

      if (ripplesRef.current.length >= maxRipples) {
        ripplesRef.current.shift();
      }

      ripplesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        startTime: now,
        id: idCounter.current++,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    let animationId: number;
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const elapsed = timestamp - ripple.startTime;
        if (elapsed >= rippleDuration) return false;

        const progress = elapsed / rippleDuration;
        const size = progress * maxSize;
        const opacity = 1 - progress;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, size, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 * (1 - progress);
        ctx.globalAlpha = opacity * 0.5;
        ctx.stroke();

        // Inner ripple
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, size * 0.6, 0, Math.PI * 2);
        ctx.globalAlpha = opacity * 0.3;
        ctx.stroke();

        return true;
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, [color, maxRipples, rippleDuration, maxSize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default RippleCursor;
