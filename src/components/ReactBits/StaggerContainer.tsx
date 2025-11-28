import { Children, cloneElement, isValidElement, type ReactNode, type ReactElement } from 'react';

type AnimationType = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'zoom' 
  | 'blur' 
  | 'flip';

type DurationType = 'fast' | 'normal' | 'slow' | 'very-slow';

interface StaggerContainerProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: DurationType;
  staggerDelay?: number;
  className?: string;
  containerClassName?: string;
}

const durationMap: Record<DurationType, number> = {
  fast: 200,
  normal: 400,
  slow: 600,
  'very-slow': 1000,
};

const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  animation = 'slide-up',
  duration = 'normal',
  staggerDelay = 100,
  className = '',
  containerClassName = '',
}) => {
  const durationMs = durationMap[duration];

  const getInitialStyles = (): React.CSSProperties => {
    switch (animation) {
      case 'fade':
        return { opacity: 0 };
      case 'slide-up':
        return { opacity: 0, transform: 'translateY(30px)' };
      case 'slide-down':
        return { opacity: 0, transform: 'translateY(-30px)' };
      case 'slide-left':
        return { opacity: 0, transform: 'translateX(30px)' };
      case 'slide-right':
        return { opacity: 0, transform: 'translateX(-30px)' };
      case 'zoom':
        return { opacity: 0, transform: 'scale(0.85)' };
      case 'blur':
        return { opacity: 0, filter: 'blur(8px)' };
      case 'flip':
        return { opacity: 0, transform: 'perspective(600px) rotateX(-80deg)' };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimatedStyles = (): React.CSSProperties => {
    switch (animation) {
      case 'fade':
        return { opacity: 1 };
      case 'slide-up':
      case 'slide-down':
      case 'slide-left':
      case 'slide-right':
        return { opacity: 1, transform: 'translate(0, 0)' };
      case 'zoom':
        return { opacity: 1, transform: 'scale(1)' };
      case 'blur':
        return { opacity: 1, filter: 'blur(0px)' };
      case 'flip':
        return { opacity: 1, transform: 'perspective(600px) rotateX(0deg)' };
      default:
        return { opacity: 1 };
    }
  };

  // Process children and add stagger effect
  const processedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child;

    const delay = index * staggerDelay;

    return (
      <StaggerItem
        key={index}
        delay={delay}
        duration={durationMs}
        initialStyles={getInitialStyles()}
        animatedStyles={getAnimatedStyles()}
        className={className}
      >
        {child}
      </StaggerItem>
    );
  });

  return <div className={containerClassName}>{processedChildren}</div>;
};

interface StaggerItemProps {
  children: ReactElement;
  delay: number;
  duration: number;
  initialStyles: React.CSSProperties;
  animatedStyles: React.CSSProperties;
  className?: string;
}

import { useEffect, useRef, useState } from 'react';

const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  delay,
  duration,
  initialStyles,
  animatedStyles,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const styles: React.CSSProperties = {
    ...(isVisible ? animatedStyles : initialStyles),
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform, filter',
  };

  return (
    <div ref={ref} className={className} style={styles}>
      {cloneElement(children)}
    </div>
  );
};

export default StaggerContainer;
