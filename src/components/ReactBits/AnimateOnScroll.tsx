import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '../../utils/accessibility';

type AnimationType = 
  | 'fade' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right' 
  | 'zoom' 
  | 'blur' 
  | 'flip'
  | 'rotate'
  | 'bounce';

type DurationType = 'fast' | 'normal' | 'slow' | 'very-slow';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: AnimationType;
  duration?: DurationType;
  delay?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  easing?: string;
}

const durationMap: Record<DurationType, number> = {
  fast: 200,
  normal: 400,
  slow: 600,
  'very-slow': 1000,
};

const getInitialStyles = (animation: AnimationType): React.CSSProperties => {
  switch (animation) {
    case 'fade':
      return { opacity: 0 };
    case 'slide-up':
      return { opacity: 0, transform: 'translateY(40px)' };
    case 'slide-down':
      return { opacity: 0, transform: 'translateY(-40px)' };
    case 'slide-left':
      return { opacity: 0, transform: 'translateX(40px)' };
    case 'slide-right':
      return { opacity: 0, transform: 'translateX(-40px)' };
    case 'zoom':
      return { opacity: 0, transform: 'scale(0.8)' };
    case 'blur':
      return { opacity: 0, filter: 'blur(10px)' };
    case 'flip':
      return { opacity: 0, transform: 'perspective(600px) rotateX(-90deg)' };
    case 'rotate':
      return { opacity: 0, transform: 'rotate(-15deg) scale(0.9)' };
    case 'bounce':
      return { opacity: 0, transform: 'translateY(60px) scale(0.95)' };
    default:
      return { opacity: 0 };
  }
};

const getAnimatedStyles = (animation: AnimationType): React.CSSProperties => {
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
    case 'rotate':
      return { opacity: 1, transform: 'rotate(0deg) scale(1)' };
    case 'bounce':
      return { opacity: 1, transform: 'translateY(0) scale(1)' };
    default:
      return { opacity: 1 };
  }
};

const getEasing = (animation: AnimationType, customEasing?: string): string => {
  if (customEasing) return customEasing;
  
  switch (animation) {
    case 'bounce':
      return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    case 'flip':
      return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    default:
      return 'cubic-bezier(0.4, 0, 0.2, 1)';
  }
};

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
  children,
  animation = 'fade',
  duration = 'normal',
  delay = 0,
  threshold = 0.1,
  className = '',
  once = true,
  easing,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const durationMs = durationMap[duration];
  const easingFunction = getEasing(animation, easing);
  const shouldAnimate = !prefersReducedMotion();

  useEffect(() => {
    if (!shouldAnimate) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasAnimated || !once) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
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
  }, [threshold, once, hasAnimated, shouldAnimate]);

  const styles: React.CSSProperties = {
    ...(isVisible || !shouldAnimate ? getAnimatedStyles(animation) : getInitialStyles(animation)),
    ...(shouldAnimate ? {
      transition: `all ${durationMs}ms ${easingFunction}`,
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform, filter',
    } : {}),
  };

  return (
    <div ref={ref} className={className} style={styles}>
      {children}
    </div>
  );
};

export default AnimateOnScroll;
