/**
 * WaveSeparator - SVG wave separator component
 * Single Responsibility: Create animated wave dividers between sections
 */

import { useEffect, useState } from 'react';

interface WaveSeparatorProps {
  variant?: 'top' | 'bottom' | 'both';
  color?: string;
  height?: number;
  className?: string;
  animated?: boolean;
  flip?: boolean; // flip the wave direction
}

export function WaveSeparator({
  variant = 'bottom',
  color = '#6366f1',
  height = 60,
  className = '',
  animated = false,
  flip = false,
}: WaveSeparatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const wavePath = flip
    ? `M0,${height} Q250,0 500,${height} T1000,${height} V${height + 10} H0 Z`
    : `M0,0 Q250,${height} 500,0 T1000,0 V${-10} H0 Z`;

  const renderWave = (transform = '', opacity = 1) => (
    <path
      d={wavePath}
      fill={color}
      fillOpacity={opacity}
      transform={transform}
      className={animated ? 'animate-pulse' : ''}
    />
  );

  const separatorClasses = `wave-separator ${className} ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
  } transition-all duration-1000 ease-out`;

  if (variant === 'both') {
    return (
      <div className={separatorClasses}>
        <svg
          viewBox="0 0 1000 120"
          className="w-full"
          style={{ height: height + 20 }}
          preserveAspectRatio="none"
        >
          {/* Top wave */}
          <g transform={`translate(0, ${height + 20}) scale(1, -1)`}>
            {renderWave('', 0.8)}
            {renderWave('translate(50, 10)', 0.4)}
          </g>
          {/* Bottom wave */}
          <g transform={`translate(0, ${height + 20})`}>
            {renderWave('', 0.8)}
            {renderWave('translate(50, 10)', 0.4)}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={separatorClasses}>
      <svg
        viewBox="0 0 1000 120"
        className="w-full"
        style={{ height: height + 20 }}
        preserveAspectRatio="none"
      >
        <g transform={variant === 'top' ? `translate(0, ${height + 20}) scale(1, -1)` : ''}>
          {renderWave('', 0.8)}
          {renderWave('translate(50, 10)', 0.4)}
        </g>
      </svg>
    </div>
  );
}

export default WaveSeparator;