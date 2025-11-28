import { useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  transitionSpeed?: number;
  glareEnabled?: boolean;
  glareMaxOpacity?: number;
  glareColor?: string;
  style?: React.CSSProperties;
}

const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  transitionSpeed = 400,
  glareEnabled = true,
  glareMaxOpacity = 0.25,
  glareColor = 'rgba(255, 255, 255, 0.8)',
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)');
  const [glareTransform, setGlareTransform] = useState({ x: 50, y: 50 });
  const [glareOpacity, setGlareOpacity] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`);

    // Glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlareTransform({ x: glareX, y: glareY });
    
    // Glare intensity based on position
    const distanceFromCenter = Math.sqrt(
      Math.pow(mouseX / (rect.width / 2), 2) + 
      Math.pow(mouseY / (rect.height / 2), 2)
    );
    setGlareOpacity(Math.min(distanceFromCenter * glareMaxOpacity, glareMaxOpacity));
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform('rotateX(0deg) rotateY(0deg) scale(1)');
    setGlareOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          transform,
          transition: isHovering ? 'none' : `transform ${transitionSpeed}ms ease-out`,
          transformStyle: 'preserve-3d',
          height: '100%',
        }}
      >
        {children}
        
        {/* Glare effect */}
        {glareEnabled && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glareTransform.x}% ${glareTransform.y}%, ${glareColor} 0%, transparent 60%)`,
              opacity: glareOpacity,
              transition: isHovering ? 'none' : `opacity ${transitionSpeed}ms ease-out`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default TiltCard;
