import { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  speed?: 'slow' | 'normal' | 'fast';
  intensity?: number;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
  speed = 'normal',
  intensity = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const speedMultiplier = speed === 'slow' ? 0.3 : speed === 'fast' ? 1.2 : 0.6;
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

    const drawAuroraBand = (
      yStart: number,
      height: number,
      color: { r: number; g: number; b: number },
      phase: number,
      waveStrength: number
    ) => {
      ctx.beginPath();
      
      // Start from left edge
      ctx.moveTo(0, canvas.height);
      
      // Draw wavy top edge
      for (let x = 0; x <= canvas.width; x += 10) {
        const normalizedX = x / canvas.width;
        const wave1 = Math.sin(normalizedX * 4 + time * speedMultiplier + phase) * waveStrength;
        const wave2 = Math.sin(normalizedX * 8 + time * speedMultiplier * 1.3 + phase * 2) * (waveStrength * 0.5);
        const wave3 = Math.sin(normalizedX * 2 + time * speedMultiplier * 0.7 + phase * 0.5) * (waveStrength * 1.5);
        
        const y = yStart + wave1 + wave2 + wave3;
        ctx.lineTo(x, y);
      }
      
      // Complete the shape
      ctx.lineTo(canvas.width, yStart + height);
      ctx.lineTo(0, yStart + height);
      ctx.closePath();

      // Create vertical gradient for aurora effect
      const gradient = ctx.createLinearGradient(0, yStart - waveStrength * 3, 0, yStart + height);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      gradient.addColorStop(0.3, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * 0.6})`);
      gradient.addColorStop(0.6, `rgba(${color.r}, ${color.g}, ${color.b}, ${intensity * 0.8})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const drawStars = () => {
      // Random stars (seeded for consistency)
      const starCount = 100;
      for (let i = 0; i < starCount; i++) {
        // Pseudo-random positions based on index
        const x = ((i * 7919) % canvas.width);
        const y = ((i * 104729) % (canvas.height * 0.6));
        const size = ((i * 13) % 3) * 0.5 + 0.5;
        const twinkle = Math.sin(time * 2 + i) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.5})`;
        ctx.fill();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const primaryRgb = hexToRgb(primaryColor);
      const secondaryRgb = hexToRgb(secondaryColor);

      if (!primaryRgb || !secondaryRgb) return;

      // Draw stars in background
      drawStars();

      // Mix colors for variety
      const mixedColor = {
        r: Math.floor((primaryRgb.r + secondaryRgb.r) / 2),
        g: Math.floor((primaryRgb.g + secondaryRgb.g) / 2),
        b: Math.floor((primaryRgb.b + secondaryRgb.b) / 2),
      };

      // Draw multiple aurora bands with different colors
      drawAuroraBand(canvas.height * 0.3, canvas.height * 0.5, primaryRgb, 0, 60);
      drawAuroraBand(canvas.height * 0.35, canvas.height * 0.4, secondaryRgb, Math.PI / 3, 50);
      drawAuroraBand(canvas.height * 0.4, canvas.height * 0.3, mixedColor, Math.PI / 1.5, 40);
      drawAuroraBand(canvas.height * 0.25, canvas.height * 0.6, primaryRgb, Math.PI, 70);

      // Add some glowing highlights
      const glowX = canvas.width * 0.5 + Math.sin(time * speedMultiplier * 0.5) * canvas.width * 0.3;
      const glowY = canvas.height * 0.3 + Math.cos(time * speedMultiplier * 0.3) * 50;
      
      const glowGradient = ctx.createRadialGradient(glowX, glowY, 0, glowX, glowY, 300);
      glowGradient.addColorStop(0, `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, ${intensity * 0.4})`);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [primaryColor, secondaryColor, speed, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AuroraBackground;
