/**
 * Features Section Component
 * Following SRP: Only handles features/pixel cards section
 * Now configurable from the editor
 */

import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import AnimateOnScroll from '../ReactBits/AnimateOnScroll';
import StaggerContainer from '../ReactBits/StaggerContainer';
import PixelCard from '../ReactBits/PixelCard';
import GlassCard from '../ReactBits/GlassCard';
import GlowBorderCard from '../ReactBits/GlowBorderCard';
import GradientBorderCard from '../ReactBits/GradientBorderCard';
import type { DynamicStyles } from './useDynamicStyles';
import type { AnimationsConfig } from './useEffectsConfig';
import type { FeaturesConfig } from '../../types/config';

interface FeaturesSectionProps {
  styles: DynamicStyles;
  animations: AnimationsConfig;
  transparentBg?: boolean;
}

// Map color names to PixelCard variants
const colorToVariant: Record<string, 'blue' | 'pink' | 'yellow'> = {
  blue: 'blue',
  pink: 'pink',
  yellow: 'yellow',
  green: 'blue', // fallback
  purple: 'pink', // fallback
  orange: 'yellow', // fallback
};

interface FeatureCardProps {
  item: FeaturesConfig['items'][0];
  containerEffect: FeaturesConfig['containerEffect'];
  styles: DynamicStyles;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ item, containerEffect, styles }) => {
  const { config } = useConfig();
  const theme = config.theme;

  const content = (
    <div className="text-center p-6 relative z-10 pointer-events-none">
      <h3 className="text-2xl font-bold text-slate-800 mb-2">{item.title}</h3>
      <p className="text-slate-600">{item.description}</p>
    </div>
  );

  const contentDark = (
    <div className="text-center p-6 relative z-10">
      <h3 className="text-2xl font-bold mb-2" style={{ color: styles.textColor }}>{item.title}</h3>
      <p style={{ color: styles.textMuted }}>{item.description}</p>
    </div>
  );

  switch (containerEffect) {
    case 'pixel':
      return (
        <PixelCard variant={colorToVariant[item.color || 'blue']} className="cursor-pointer">
          {content}
        </PixelCard>
      );
    case 'glass':
      return (
        <GlassCard className="cursor-pointer" blur="lg" opacity={15}>
          {contentDark}
        </GlassCard>
      );
    case 'glow':
      return (
        <GlowBorderCard 
          className="cursor-pointer"
          glowColor={theme.primaryColor}
          backgroundColor={theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'}
          borderRadius={parseInt(theme.borderRadius) || 8}
        >
          {contentDark}
        </GlowBorderCard>
      );
    case 'gradient':
      return (
        <GradientBorderCard
          className="cursor-pointer"
          gradientColors={[theme.primaryColor, theme.secondaryColor]}
          backgroundColor={theme.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)'}
          borderRadius={parseInt(theme.borderRadius) || 8}
          animated={true}
        >
          {contentDark}
        </GradientBorderCard>
      );
    case 'blur':
      return (
        <div 
          className="cursor-pointer backdrop-blur-lg rounded-xl p-1"
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: theme.borderRadius,
          }}
        >
          {contentDark}
        </div>
      );
    case 'none':
    default:
      return (
        <div 
          className="cursor-pointer rounded-xl shadow-lg"
          style={{ 
            ...styles.cardStyle,
            borderRadius: theme.borderRadius,
          }}
        >
          {contentDark}
        </div>
      );
  }
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ styles, animations, transparentBg = false }) => {
  const { config } = useConfig();
  const features = config.features;

  // If no items, don't render
  if (!features.items || features.items.length === 0) {
    return null;
  }

  const columnsClass = {
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section 
      className="py-20" 
      style={transparentBg ? { backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' } : styles.sectionSecondary}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.showTitle && (
          <AnimateOnScroll animation={animations.type} duration={animations.duration}>
            <div className="text-center mb-16">
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ color: styles.textColor }}
              >
                {features.title}
              </h2>
              <p style={{ color: styles.textMuted }} className="max-w-2xl mx-auto">
                {features.subtitle}
              </p>
            </div>
          </AnimateOnScroll>
        )}
        
        <StaggerContainer 
          animation={animations.type}
          duration={animations.duration}
          staggerDelay={150}
          containerClassName={`grid ${columnsClass[features.columns]} gap-8 justify-items-center`}
        >
          {features.items.map((item) => (
            <FeatureCard
              key={item.id}
              item={item}
              containerEffect={features.containerEffect}
              styles={styles}
            />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default FeaturesSection;
