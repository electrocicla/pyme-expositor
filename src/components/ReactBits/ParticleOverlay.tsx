/**
 * ParticleOverlay - Floating particles overlay component
 * Single Responsibility: Create animated floating particles background effect
 */

import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface ParticleOverlayProps {
  density?: number; // particles per 1000px²
  colors?: string[];
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
  className?: string;
  style?: React.CSSProperties;
}

export function ParticleOverlay({
  density = 50,
  colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'],
  size = { min: 2, max: 6 },
  speed = { min: 0.5, max: 2 },
  className = '',
  style = {},
}: ParticleOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    const area = (width * height) / 1000000; // area in 1000px² units
    const particleCount = Math.floor(density * area);

    const newParticles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * (size.max - size.min) + size.min,
        speedX: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
        speedY: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return newParticles;
  };

  // Update canvas size
  useEffect(() => {
    const updateDimensions = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }

      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize particles when dimensions change
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setParticles(initParticles(dimensions.width, dimensions.height));
    }
  }, [dimensions, density, colors, size.min, size.max]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Wrap around edges
          if (newX < 0) newX = dimensions.width;
          if (newX > dimensions.width) newX = 0;
          if (newY < 0) newY = dimensions.height;
          if (newY > dimensions.height) newY = 0;

          const updatedParticle = {
            ...particle,
            x: newX,
            y: newY,
          };

          // Draw particle
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(updatedParticle.x, updatedParticle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          return updatedParticle;
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particles.length, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}

export default ParticleOverlay;