import React, { useEffect, useRef, useState } from 'react';

interface SpotlightCursorProps {
  color?: string;
  size?: number;
  opacity?: number;
  blur?: number;
}

const SpotlightCursor: React.FC<SpotlightCursorProps> = ({
  color = '#ffffff',
  size = 400,
  opacity = 0.15,
  blur = 80,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsVisible(true);
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      style={{ mixBlendMode: 'soft-light' }}
    >
      <div
        className="absolute rounded-full transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          left: position.x - size / 2,
          top: position.y - size / 2,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: isVisible ? opacity : 0,
          filter: `blur(${blur}px)`,
        }}
      />
    </div>
  );
};

export default SpotlightCursor;
