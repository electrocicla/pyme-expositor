/**
 * HeroMediaSlider - Advanced media slider/carousel for Hero section
 * Supports multiple display modes and React Bits style effects
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { HeroMediaItem, HeroConfig } from '../../types/config';
import { Image as ImageIcon } from 'lucide-react';

interface HeroMediaSliderProps {
  items: HeroMediaItem[];
  displayMode: HeroConfig['mediaDisplayMode'];
  displayStyle: HeroConfig['mediaDisplayStyle'];
  autoplay?: boolean;
  interval?: number;
  transition?: HeroConfig['sliderTransition'];
  showDots?: boolean;
  showArrows?: boolean;
  pauseOnHover?: boolean;
  mediaFit?: HeroConfig['mediaFit'];
  mediaRounded?: HeroConfig['mediaRounded'];
  mediaShadow?: HeroConfig['mediaShadow'];
  videoAutoplay?: boolean;
  videoLoop?: boolean;
  videoMuted?: boolean;
  videoControls?: boolean;
  className?: string;
}

// Rounded classes mapping
const roundedClasses: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

// Shadow classes mapping
const shadowClasses: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
};

// Object fit classes
const fitClasses: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
};

const HeroMediaSlider: React.FC<HeroMediaSliderProps> = ({
  items,
  displayMode = 'single',
  displayStyle = 'default',
  autoplay = true,
  interval = 5000,
  transition = 'fade',
  showDots = true,
  showArrows = true,
  pauseOnHover = true,
  mediaFit = 'cover',
  mediaRounded = 'lg',
  mediaShadow = 'lg',
  videoAutoplay = true,
  videoLoop = true,
  videoMuted = true,
  videoControls = false,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalItems = items.length;
  const hasMultiple = totalItems > 1;

  // Auto-advance slides
  useEffect(() => {
    if (!autoplay || !hasMultiple || (pauseOnHover && isHovered)) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, interval, hasMultiple, isHovered, pauseOnHover, currentIndex]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
    setTimeout(() => setIsAnimating(false), 500);
  }, [totalItems, isAnimating]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    setTimeout(() => setIsAnimating(false), 500);
  }, [totalItems, isAnimating]);

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Get transition styles based on type
  const getTransitionStyles = (index: number) => {
    const isActive = index === currentIndex;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      inset: 0,
      transition: 'all 0.5s ease-in-out',
    };

    switch (transition) {
      case 'slide':
        return {
          ...baseStyle,
          transform: `translateX(${(index - currentIndex) * 100}%)`,
          opacity: 1,
        };
      case 'zoom':
        return {
          ...baseStyle,
          transform: isActive ? 'scale(1)' : 'scale(1.1)',
          opacity: isActive ? 1 : 0,
        };
      case 'flip':
        return {
          ...baseStyle,
          transform: isActive ? 'rotateY(0deg)' : 'rotateY(90deg)',
          opacity: isActive ? 1 : 0,
        };
      case 'cube':
        return {
          ...baseStyle,
          transform: isActive ? 'perspective(1000px) rotateY(0deg)' : `perspective(1000px) rotateY(${(index - currentIndex) * 90}deg)`,
          transformOrigin: index > currentIndex ? 'left center' : 'right center',
          opacity: isActive ? 1 : 0,
        };
      case 'fade':
      default:
        return {
          ...baseStyle,
          opacity: isActive ? 1 : 0,
        };
    }
  };

  // Get style effect classes
  const getStyleEffectClasses = () => {
    switch (displayStyle) {
      case 'glass':
        return 'backdrop-blur-sm bg-white/10 border border-white/20';
      case 'pixel':
        return 'border-4 border-black shadow-[4px_4px_0_0_#000]';
      case 'tilt':
        return 'transform hover:rotate-1 transition-transform';
      case 'glow':
        return 'shadow-[0_0_30px_rgba(59,130,246,0.5)]';
      case 'gradient-border':
        return 'p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500';
      case 'parallax':
        return 'overflow-hidden';
      case 'ken-burns':
        return 'overflow-hidden';
      case 'reveal':
        return 'overflow-hidden';
      default:
        return '';
    }
  };

  // Render single media item
  const renderMedia = (item: HeroMediaItem, index: number) => {
    const isVideo = item.type === 'video';
    const mediaClasses = `w-full h-full ${fitClasses[mediaFit || 'cover']}`;
    
    // Ken Burns animation
    const kenBurnsStyle: React.CSSProperties = displayStyle === 'ken-burns' ? {
      animation: index === currentIndex ? 'kenBurns 20s ease-in-out infinite' : 'none',
    } : {};

    if (isVideo) {
      return (
        <video
          key={item.id}
          src={item.url}
          className={mediaClasses}
          autoPlay={videoAutoplay}
          loop={videoLoop}
          muted={videoMuted}
          controls={videoControls}
          playsInline
          style={kenBurnsStyle}
        />
      );
    }

    return (
      <img
        key={item.id}
        src={item.url}
        alt={item.alt || item.title || ''}
        className={mediaClasses}
        style={kenBurnsStyle}
        loading={index === 0 ? 'eager' : 'lazy'}
      />
    );
  };

  // Handle empty state
  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-white/5 ${roundedClasses[mediaRounded || 'lg']} ${className}`}>
        <div className="text-center p-8">
          <div className="flex justify-center mb-2"><ImageIcon className="w-10 h-10 text-white/50" /></div>
          <p className="text-white/50 text-sm">Hero Media</p>
        </div>
      </div>
    );
  }

  // Single mode
  if (displayMode === 'single' || items.length === 1) {
    return (
      <div 
        className={`relative overflow-hidden ${roundedClasses[mediaRounded || 'lg']} ${shadowClasses[mediaShadow || 'lg']} ${getStyleEffectClasses()} ${className}`}
      >
        {renderMedia(items[0], 0)}
      </div>
    );
  }

  // Stack mode
  if (displayMode === 'stack') {
    return (
      <div className={`relative ${className}`} style={{ height: '100%' }}>
        {items.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className={`absolute ${roundedClasses[mediaRounded || 'lg']} ${shadowClasses[mediaShadow || 'lg']} overflow-hidden ${getStyleEffectClasses()}`}
            style={{
              top: index * 16,
              left: index * 16,
              right: -index * 16,
              bottom: -index * 16,
              zIndex: 3 - index,
              opacity: 1 - index * 0.15,
            }}
          >
            {renderMedia(item, index)}
          </div>
        ))}
      </div>
    );
  }

  // Slider/Carousel/Fade modes
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${roundedClasses[mediaRounded || 'lg']} ${shadowClasses[mediaShadow || 'lg']} ${getStyleEffectClasses()} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            style={getTransitionStyles(index)}
            className="w-full h-full"
          >
            {renderMedia(item, index)}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && hasMultiple && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 z-10"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (for carousel mode) */}
      {displayMode === 'carousel' && autoplay && hasMultiple && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-white/70 transition-all"
            style={{
              width: `${((currentIndex + 1) / totalItems) * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      )}

      {/* Slide Counter */}
      {hasMultiple && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/40 rounded-full text-white text-xs z-10">
          {currentIndex + 1} / {totalItems}
        </div>
      )}

      {/* Ken Burns animation styles */}
      <style>{`
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(1.1) translate(-1%, -1%); }
          50% { transform: scale(1.15) translate(1%, 1%); }
          75% { transform: scale(1.1) translate(-1%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default HeroMediaSlider;
