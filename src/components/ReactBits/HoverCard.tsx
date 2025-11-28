import { type ReactNode, useState, useRef, type MouseEvent } from 'react';

type HoverType = 'none' | 'lift' | 'scale' | 'glow' | 'tilt';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  hover?: HoverType;
  glowColor?: string;
  liftAmount?: number;
  scaleAmount?: number;
  tiltAmount?: number;
  transitionDuration?: number;
  style?: React.CSSProperties;
}

const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className = '',
  hover = 'lift',
  glowColor = '#6366f1',
  liftAmount = 8,
  scaleAmount = 1.03,
  tiltAmount = 5,
  transitionDuration = 300,
  style = {},
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (hover !== 'tilt' || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -tiltAmount;
    const rotateY = (mouseX / (rect.width / 2)) * tiltAmount;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTiltStyle({});
  };

  const getHoverStyles = (): React.CSSProperties => {
    if (!isHovering || hover === 'none') {
      return {
        transform: 'translateY(0) scale(1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
      };
    }

    switch (hover) {
      case 'lift':
        return {
          transform: `translateY(-${liftAmount}px)`,
          boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.25)`,
        };
      case 'scale':
        return {
          transform: `scale(${scaleAmount})`,
          boxShadow: `0 15px 30px -8px rgba(0, 0, 0, 0.2)`,
        };
      case 'glow':
        return {
          transform: 'translateY(-2px)',
          boxShadow: `0 0 30px 5px ${glowColor}50, 0 10px 20px -5px rgba(0, 0, 0, 0.2)`,
        };
      case 'tilt':
        return {
          ...tiltStyle,
        };
      default:
        return {};
    }
  };

  const baseStyles: React.CSSProperties = {
    ...style,
    transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    ...getHoverStyles(),
  };

  return (
    <div
      ref={cardRef}
      className={`${className}`}
      style={baseStyles}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default HoverCard;
