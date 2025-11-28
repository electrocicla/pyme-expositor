/**
 * Features Section Component
 * Following SRP: Only handles features/pixel cards section
 */

import React from 'react';
import AnimateOnScroll from '../ReactBits/AnimateOnScroll';
import StaggerContainer from '../ReactBits/StaggerContainer';
import PixelCard from '../ReactBits/PixelCard';
import type { DynamicStyles } from './useDynamicStyles';
import type { AnimationsConfig } from './useEffectsConfig';

interface FeaturesSectionProps {
  styles: DynamicStyles;
  animations: AnimationsConfig;
  transparentBg?: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ styles, animations, transparentBg = false }) => {
  return (
    <section 
      className="py-20" 
      style={transparentBg ? { backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' } : styles.sectionSecondary}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll animation={animations.type} duration={animations.duration}>
          <div className="text-center mb-16">
            <h2 
              className="text-3xl font-bold mb-4"
              style={{ color: styles.textColor }}
            >
              Interactive Features
            </h2>
            <p style={{ color: styles.textMuted }} className="max-w-2xl mx-auto">
              Experience our cutting-edge interface components powered by React Bits.
            </p>
          </div>
        </AnimateOnScroll>
        
        <StaggerContainer 
          animation={animations.type}
          duration={animations.duration}
          staggerDelay={150}
          containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
        >
          <PixelCard variant="blue" className="cursor-pointer">
            <div className="text-center p-6 relative z-10 pointer-events-none">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Analytics</h3>
              <p className="text-slate-600">Real-time data visualization</p>
            </div>
          </PixelCard>
          
          <PixelCard variant="pink" className="cursor-pointer">
            <div className="text-center p-6 relative z-10 pointer-events-none">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Design</h3>
              <p className="text-slate-600">Pixel-perfect precision</p>
            </div>
          </PixelCard>

          <PixelCard variant="yellow" className="cursor-pointer">
            <div className="text-center p-6 relative z-10 pointer-events-none">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Speed</h3>
              <p className="text-slate-600">Lightning fast performance</p>
            </div>
          </PixelCard>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturesSection;
