/**
 * Noise Background Effect
 * Creates an animated noise/grain texture overlay
 */

import { useEffect, useRef } from 'react';

interface NoiseBackgroundProps {
  opacity?: number;
  speed?: 'slow' | 'normal' | 'fast';
  color?: string;
  blend?: 'overlay' | 'soft-light' | 'multiply' | 'screen';
}

const NoiseBackground: React.FC<NoiseBackgroundProps> = ({
  opacity = 0.15,
  speed = 'normal',
  color = '#ffffff',
  blend = 'overlay',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const speedMultiplier = speed === 'slow' ? 100 : speed === 'fast' ? 30 : 50;
    let lastTime = 0;

    const resize = () => {
      // Use lower resolution for performance
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
    };

    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 255, g: 255, b: 255 };
    };

    resize();
    window.addEventListener('resize', resize);

    const rgb = hexToRgb(color);

    const generateNoise = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = rgb.r;     // R
        data[i + 1] = rgb.g; // G
        data[i + 2] = rgb.b; // B
        data[i + 3] = noise * opacity; // A
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const animate = (time: number) => {
      if (time - lastTime > speedMultiplier) {
        generateNoise();
        lastTime = time;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [opacity, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 2,
        mixBlendMode: blend,
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default NoiseBackground;
