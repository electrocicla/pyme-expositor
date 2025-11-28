/**
 * Starfield Background Effect
 * Creates an animated star field with twinkling stars and optional shooting stars
 */

import { useEffect, useRef } from 'react';

interface StarfieldBackgroundProps {
  starCount?: number;
  speed?: 'slow' | 'normal' | 'fast';
  color?: string;
  showShootingStars?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  starCount = 200,
  speed = 'normal',
  color = '#ffffff',
  showShootingStars = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);

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
      initStars();
    };

    const initStars = () => {
      starsRef.current = [];
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          twinkleSpeed: Math.random() * 2 + 0.5,
          twinklePhase: Math.random() * Math.PI * 2,
          brightness: Math.random() * 0.5 + 0.5,
        });
      }
      
      // Initialize shooting stars
      shootingStarsRef.current = [];
      for (let i = 0; i < 3; i++) {
        shootingStarsRef.current.push({
          x: 0,
          y: 0,
          length: 0,
          speed: 0,
          angle: 0,
          opacity: 0,
          active: false,
        });
      }
    };

    const hexToRgb = (hex: string): string => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return '255, 255, 255';
      return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    };

    const spawnShootingStar = (star: ShootingStar) => {
      star.x = Math.random() * canvas.width;
      star.y = Math.random() * canvas.height * 0.5;
      star.length = Math.random() * 80 + 40;
      star.speed = Math.random() * 10 + 5;
      star.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5;
      star.opacity = 1;
      star.active = true;
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rgb = hexToRgb(color);

      // Draw stars
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed * speedMultiplier + star.twinklePhase) * 0.3 + 0.7;
        const alpha = star.brightness * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.fill();
        
        // Add glow to larger stars
        if (star.size > 1.5) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 3);
          gradient.addColorStop(0, `rgba(${rgb}, ${alpha * 0.3})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(star.x - star.size * 3, star.y - star.size * 3, star.size * 6, star.size * 6);
        }
      });

      // Draw shooting stars
      if (showShootingStars) {
        shootingStarsRef.current.forEach((star) => {
          if (!star.active && Math.random() < 0.002 * speedMultiplier) {
            spawnShootingStar(star);
          }
          
          if (star.active) {
            // Draw shooting star trail
            const gradient = ctx.createLinearGradient(
              star.x, star.y,
              star.x - Math.cos(star.angle) * star.length,
              star.y - Math.sin(star.angle) * star.length
            );
            gradient.addColorStop(0, `rgba(${rgb}, ${star.opacity})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(
              star.x - Math.cos(star.angle) * star.length,
              star.y - Math.sin(star.angle) * star.length
            );
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Update position
            star.x += Math.cos(star.angle) * star.speed * speedMultiplier;
            star.y += Math.sin(star.angle) * star.speed * speedMultiplier;
            star.opacity -= 0.01 * speedMultiplier;
            
            if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
              star.active = false;
            }
          }
        });
      }

      time += 0.016;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [starCount, speed, color, showShootingStars]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
};

export default StarfieldBackground;
