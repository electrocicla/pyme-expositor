import { type ReactNode, useRef, useState, type MouseEvent } from 'react';

interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  borderRadius?: number;
  gradientColors?: string[];
  backgroundColor?: string;
  animated?: boolean;
  animationDuration?: number;
  style?: React.CSSProperties;
}

const GradientBorderCard: React.FC<GradientBorderCardProps> = ({
  children,
  className = '',
  borderWidth = 2,
  borderRadius = 16,
  gradientColors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
  backgroundColor = '#ffffff',
  animated = true,
  animationDuration = 3,
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  // Mouse-tracking rotation
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || animated) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const angleDeg = (angleRad * 180) / Math.PI + 180;
    
    setAngle(angleDeg);
  };

  const gradientString = gradientColors.join(', ');
  const backgroundGradient = animated
    ? `linear-gradient(var(--gradient-angle, 0deg), ${gradientString})`
    : `linear-gradient(${angle}deg, ${gradientString})`;

  const animationStyle: React.CSSProperties = animated
    ? {
        animation: `gradient-rotate ${animationDuration}s linear infinite`,
      }
    : {};

  return (
    <>
      {animated && (
        <style>{`
          @property --gradient-angle {
            syntax: '<angle>';
            initial-value: 0deg;
            inherits: false;
          }
          @keyframes gradient-rotate {
            from { --gradient-angle: 0deg; }
            to { --gradient-angle: 360deg; }
          }
        `}</style>
      )}
      <div
        ref={cardRef}
        className={`relative ${className}`}
        style={{
          ...style,
          padding: borderWidth,
          borderRadius,
          background: backgroundGradient,
          backgroundSize: '200% 200%',
          ...animationStyle,
        }}
        onMouseMove={handleMouseMove}
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
    </>
  );
};

export default GradientBorderCard;
