/**
 * KenBurns - Ken Burns effect component for images
 * Single Responsibility: Apply smooth zoom and pan animation to images
 */

import { useEffect, useState } from 'react';

interface KenBurnsProps {
  src: string;
  alt?: string;
  duration?: number; // animation duration in seconds
  direction?: 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'pan-up' | 'pan-down';
  className?: string;
  style?: React.CSSProperties;
}

export function KenBurns({
  src,
  alt = '',
  duration = 15,
  direction = 'zoom-in',
  className = '',
  style = {},
}: KenBurnsProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [src]);

  const getAnimationStyle = () => {
    const baseStyle: React.CSSProperties = {
      animationDuration: `${duration}s`,
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationDirection: 'alternate',
    };

    switch (direction) {
      case 'zoom-in':
        return {
          ...baseStyle,
          animationName: 'ken-burns-zoom-in',
        };
      case 'zoom-out':
        return {
          ...baseStyle,
          animationName: 'ken-burns-zoom-out',
        };
      case 'pan-left':
        return {
          ...baseStyle,
          animationName: 'ken-burns-pan-left',
        };
      case 'pan-right':
        return {
          ...baseStyle,
          animationName: 'ken-burns-pan-right',
        };
      case 'pan-up':
        return {
          ...baseStyle,
          animationName: 'ken-burns-pan-up',
        };
      case 'pan-down':
        return {
          ...baseStyle,
          animationName: 'ken-burns-pan-down',
        };
      default:
        return {
          ...baseStyle,
          animationName: 'ken-burns-zoom-in',
        };
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ken-burns-zoom-in {
            0% { transform: scale(1) translate(0, 0); }
            100% { transform: scale(1.1) translate(-5%, -5%); }
          }
          @keyframes ken-burns-zoom-out {
            0% { transform: scale(1.1) translate(-5%, -5%); }
            100% { transform: scale(1) translate(0, 0); }
          }
          @keyframes ken-burns-pan-left {
            0% { transform: scale(1.1) translate(0, 0); }
            100% { transform: scale(1.1) translate(-10%, 0); }
          }
          @keyframes ken-burns-pan-right {
            0% { transform: scale(1.1) translate(-10%, 0); }
            100% { transform: scale(1.1) translate(0, 0); }
          }
          @keyframes ken-burns-pan-up {
            0% { transform: scale(1.1) translate(0, 0); }
            100% { transform: scale(1.1) translate(0, -10%); }
          }
          @keyframes ken-burns-pan-down {
            0% { transform: scale(1.1) translate(0, -10%); }
            100% { transform: scale(1.1) translate(0, 0); }
          }
        `
      }} />

      <div
        className={`ken-burns-container overflow-hidden ${className}`}
        style={style}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={isLoaded ? getAnimationStyle() : {}}
        />
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    </>
  );
}

export default KenBurns;