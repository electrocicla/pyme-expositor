import { useEffect, useRef } from 'react';

interface AnimatedGridProps {
  color?: string;
  secondaryColor?: string;
  speed?: 'slow' | 'normal' | 'fast';
  cellSize?: number;
  lineWidth?: number;
  pulseIntensity?: number;
}

const AnimatedGrid: React.FC<AnimatedGridProps> = ({
  color = '#6366f1',
  secondaryColor = '#8b5cf6',
  speed = 'normal',
  cellSize = 50,
  lineWidth = 1,
  pulseIntensity = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryRgb = hexToRgb(color);
      const secondaryRgb = hexToRgb(secondaryColor);

      if (!primaryRgb || !secondaryRgb) return;

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += cellSize) {
        const pulse = Math.sin(time * speedMultiplier + x * 0.01) * pulseIntensity;
        const opacity = 0.1 + Math.abs(pulse) * 0.15;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.strokeStyle = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += cellSize) {
        const pulse = Math.sin(time * speedMultiplier + y * 0.01) * pulseIntensity;
        const opacity = 0.1 + Math.abs(pulse) * 0.15;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.strokeStyle = `rgba(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}, ${opacity})`;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Draw glowing intersection points
      for (let x = 0; x <= canvas.width; x += cellSize) {
        for (let y = 0; y <= canvas.height; y += cellSize) {
          const distance = Math.sqrt(
            Math.pow((x - canvas.width / 2) / canvas.width, 2) +
            Math.pow((y - canvas.height / 2) / canvas.height, 2)
          );
          const pulse = Math.sin(time * speedMultiplier * 2 - distance * 10) * 0.5 + 0.5;
          const size = 2 + pulse * 3;
          const opacity = 0.3 + pulse * 0.4;

          // Mix colors based on position
          const mixFactor = (x / canvas.width + y / canvas.height) / 2;
          const r = Math.floor(primaryRgb.r * (1 - mixFactor) + secondaryRgb.r * mixFactor);
          const g = Math.floor(primaryRgb.g * (1 - mixFactor) + secondaryRgb.g * mixFactor);
          const b = Math.floor(primaryRgb.b * (1 - mixFactor) + secondaryRgb.b * mixFactor);

          // Glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.beginPath();
          ctx.arc(x, y, size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity + 0.2})`;
          ctx.fill();
        }
      }

      // Scanning line effect
      const scanY = (Math.sin(time * speedMultiplier * 0.5) * 0.5 + 0.5) * canvas.height;
      const scanGradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      scanGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      scanGradient.addColorStop(0.5, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`);
      scanGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY - 50, canvas.width, 100);

      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [color, secondaryColor, speed, cellSize, lineWidth, pulseIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedGrid;
