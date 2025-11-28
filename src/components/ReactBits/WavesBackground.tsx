import { useEffect, useRef } from 'react';

interface WavesBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  speed?: 'slow' | 'normal' | 'fast';
  opacity?: number;
}

const WavesBackground: React.FC<WavesBackgroundProps> = ({
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
  speed = 'normal',
  opacity = 0.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'fast' ? 2 : 1;
    let time = 0;

    const drawWave = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      color: string,
      waveOpacity: number,
      phaseShift: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 5) {
        const y =
          yOffset +
          Math.sin((x * frequency) / 1000 + time * speedMultiplier + phaseShift) * amplitude +
          Math.sin((x * frequency * 0.5) / 1000 + time * speedMultiplier * 1.5 + phaseShift) * (amplitude * 0.5);
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();

      ctx.fillStyle = color.replace(')', `, ${waveOpacity})`).replace('rgb', 'rgba');
      ctx.fill();
    };

    const hexToRgb = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
      }
      return hex;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryRgb = hexToRgb(primaryColor);
      const secondaryRgb = hexToRgb(secondaryColor);

      // Multiple wave layers for depth
      drawWave(canvas.height * 0.85, 30, 2, primaryRgb, opacity * 0.3, 0);
      drawWave(canvas.height * 0.8, 40, 1.5, secondaryRgb, opacity * 0.4, Math.PI / 4);
      drawWave(canvas.height * 0.75, 50, 1, primaryRgb, opacity * 0.5, Math.PI / 2);
      drawWave(canvas.height * 0.7, 35, 2.5, secondaryRgb, opacity * 0.6, Math.PI);

      time += 0.02;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [primaryColor, secondaryColor, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default WavesBackground;
