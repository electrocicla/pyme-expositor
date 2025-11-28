/**
 * Section - Reusable container for panel sections
 * Single Responsibility: Provide consistent section styling
 */

import type { ReactNode } from 'react';
import { sectionContainerClasses, highlightContainerClasses, warningContainerClasses, infoContainerClasses, fadeInClasses } from './constants';

type SectionVariant = 'default' | 'highlight' | 'warning' | 'info' | 'none';

interface SectionProps {
  children: ReactNode;
  variant?: SectionVariant;
  animate?: boolean;
  className?: string;
  borderColor?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  variant = 'default',
  animate = false,
  className = '',
  borderColor,
}) => {
  const variantClasses = {
    default: sectionContainerClasses,
    highlight: highlightContainerClasses,
    warning: warningContainerClasses,
    info: infoContainerClasses,
    none: 'space-y-3',
  };

  const borderStyle = borderColor
    ? { borderLeft: `2px solid ${borderColor}`, paddingLeft: '12px' }
    : {};

  return (
    <div
      className={`${variantClasses[variant]} ${animate ? fadeInClasses : ''} ${className}`}
      style={borderStyle}
    >
      {children}
    </div>
  );
};

export default Section;
