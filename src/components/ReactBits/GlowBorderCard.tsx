import { type ReactNode, useRef, type MouseEvent, useState } from 'react';

interface GlowBorderCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  borderRadius?: number;
  glowColor?: string;
  backgroundColor?: string;
  glowIntensity?: number;
  animated?: boolean;
  style?: React.CSSProperties;
}

const GlowBorderCard: React.FC<GlowBorderCardProps> = ({
  children,
  className = '',
  borderWidth = 2,
  borderRadius = 16,
  glowColor = '#6366f1',
  backgroundColor = '#ffffff',
  glowIntensity = 0.5,
  animated = true,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !animated) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const gradientStyle = animated && isHovering
    ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, ${glowColor} 0%, transparent 60%)`
    : `linear-gradient(135deg, ${glowColor}80 0%, ${glowColor}20 50%, ${glowColor}80 100%)`;

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        ...style,
        padding: borderWidth,
        borderRadius,
        background: gradientStyle,
        boxShadow: isHovering 
          ? `0 0 ${30 * glowIntensity}px ${10 * glowIntensity}px ${glowColor}40`
          : `0 0 ${15 * glowIntensity}px ${5 * glowIntensity}px ${glowColor}20`,
        transition: 'box-shadow 300ms ease',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        style={{
          backgroundColor,
          borderRadius: borderRadius - borderWidth,
          height: '100%',
          width: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GlowBorderCard;
