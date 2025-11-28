/**
 * Gradient Orbs Background Effect
 * Creates floating gradient orbs with blur effect
 */

import { useEffect, useRef } from 'react';

interface GradientOrbsBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  speed?: 'slow' | 'normal' | 'fast';
  orbCount?: number;
  blur?: number;
}

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  phase: number;
}

const GradientOrbsBackground: React.FC<GradientOrbsBackgroundProps> = ({
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
  tertiaryColor = '#ec4899',
  speed = 'normal',
  orbCount = 5,
  blur = 80,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<Orb[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const speedMultiplier = speed === 'slow' ? 0.3 : speed === 'fast' ? 1.5 : 0.8;
    const colors = [primaryColor, secondaryColor, tertiaryColor];
    
    // Initialize orbs
    orbsRef.current = [];
    for (let i = 0; i < orbCount; i++) {
      orbsRef.current.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 300 + 200,
        color: colors[i % colors.length],
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const animate = () => {
      orbsRef.current.forEach((orb, index) => {
        // Smooth movement using sine waves
        const newX = orb.x + Math.sin(time * speedMultiplier + orb.phase) * 0.1 + orb.vx * speedMultiplier;
        const newY = orb.y + Math.cos(time * speedMultiplier + orb.phase * 1.5) * 0.1 + orb.vy * speedMultiplier;
        
        // Bounce off edges
        if (newX < -20 || newX > 120) orb.vx *= -1;
        if (newY < -20 || newY > 120) orb.vy *= -1;
        
        orb.x = Math.max(-20, Math.min(120, newX));
        orb.y = Math.max(-20, Math.min(120, newY));

        // Update DOM element
        const orbEl = container.children[index] as HTMLDivElement;
        if (orbEl) {
          orbEl.style.left = `${orb.x}%`;
          orbEl.style.top = `${orb.y}%`;
          orbEl.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(time * speedMultiplier * 0.5 + orb.phase) * 0.1})`;
        }
      });

      time += 0.016;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [primaryColor, secondaryColor, tertiaryColor, speed, orbCount]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 1, filter: `blur(${blur}px)` }}
    >
      {orbsRef.current.length === 0 && Array.from({ length: orbCount }).map((_, i) => {
        const colors = [primaryColor, secondaryColor, tertiaryColor];
        return (
          <div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              width: `${Math.random() * 300 + 200}px`,
              height: `${Math.random() * 300 + 200}px`,
              background: `radial-gradient(circle, ${colors[i % colors.length]} 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
      {orbsRef.current.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-60"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

export default GradientOrbsBackground;
