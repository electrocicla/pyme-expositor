/**
 * Gallery Section Component
 * Following SRP: Only handles gallery/media rendering
 * Following OCP: Supports multiple card types through config
 */

import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import AnimateOnScroll from '../ReactBits/AnimateOnScroll';
import GlassCard from '../ReactBits/GlassCard';
import TiltCard from '../ReactBits/TiltCard';
import HoverCard from '../ReactBits/HoverCard';
import GlowBorderCard from '../ReactBits/GlowBorderCard';
import GradientBorderCard from '../ReactBits/GradientBorderCard';
import PixelCard from '../ReactBits/PixelCard';
import { hexToRgb, lightenColor } from '../../utils/colors';
import type { DynamicStyles } from './useDynamicStyles';
import type { AnimationsConfig, CardsConfig } from './useEffectsConfig';
import type { ApiMedia } from '../../utils/api';

interface GallerySectionProps {
  styles: DynamicStyles;
  animations: AnimationsConfig;
  cards: CardsConfig;
  media: ApiMedia[];
  loading: boolean;
  isDarkMode: boolean;
  transparentBg?: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  styles,
  animations,
  cards,
  media,
  loading,
  isDarkMode,
  transparentBg = false,
}) => {
  const { config } = useConfig();
  const theme = config.theme;

  // Render card content (shared across all card types)
  const renderCardContent = (item: ApiMedia) => (
    <>
      <div className="aspect-video overflow-hidden">
        {item.type === 'video' ? (
          <video
            src={item.url}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            controls
            onError={(e) => {
              console.error('GallerySection: Video load error:', item.url);
              (e.target as HTMLVideoElement).style.opacity = '0.3';
            }}
          />
        ) : (
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              console.error('GallerySection: Image load error:', item.url);
              (e.target as HTMLImageElement).style.opacity = '0.3';
            }}
          />
        )}
      </div>
      <div className="p-4">
        <h3 
          className="font-semibold text-lg mb-1"
          style={{ color: styles.textColor }}
        >
          {item.title}
        </h3>
        <p 
          className="text-sm line-clamp-2"
          style={{ color: styles.textMuted }}
        >
          {item.description}
        </p>
      </div>
    </>
  );

  // Render card based on type
  const renderCard = (item: ApiMedia, index: number) => {
    const delay = animations.stagger ? index * 100 : 0;

    // Helper to wrap with animation
    const withAnimation = (cardComponent: React.ReactNode) => (
      <AnimateOnScroll 
        key={item.id}
        animation={animations.enabled ? animations.type : 'fade'}
        duration={animations.duration}
        delay={delay}
      >
        {cardComponent}
      </AnimateOnScroll>
    );

    // If card effects are enabled, use special card components
    if (cards.enabled) {
      switch (cards.type) {
        case 'glass':
          return withAnimation(
            <GlassCard className="group overflow-hidden" blur="lg" opacity={isDarkMode ? 15 : 10}>
              <HoverCard hover={cards.hover} glowColor={theme.primaryColor}>
                {renderCardContent(item)}
              </HoverCard>
            </GlassCard>
          );
        case 'tilt':
          return withAnimation(
            <TiltCard 
              className="group overflow-hidden shadow-md border"
              style={styles.cardStyle}
              maxTilt={10}
              glareEnabled={true}
              glareColor={`rgba(${hexToRgb(theme.primaryColor)}, 0.3)`}
            >
              {renderCardContent(item)}
            </TiltCard>
          );
        case 'glow':
          return withAnimation(
            <GlowBorderCard
              className="group overflow-hidden"
              glowColor={theme.primaryColor}
              backgroundColor={isDarkMode ? lightenColor(theme.secondaryColor, 8) : '#ffffff'}
              borderRadius={parseInt(theme.borderRadius) || 8}
            >
              <HoverCard hover={cards.hover} glowColor={theme.primaryColor}>
                {renderCardContent(item)}
              </HoverCard>
            </GlowBorderCard>
          );
        case 'gradient-border':
          return withAnimation(
            <GradientBorderCard
              className="group overflow-hidden"
              gradientColors={[theme.primaryColor, theme.secondaryColor]}
              backgroundColor={isDarkMode ? lightenColor(theme.secondaryColor, 8) : '#ffffff'}
              borderRadius={parseInt(theme.borderRadius) || 8}
              animated={true}
            >
              <HoverCard hover={cards.hover} glowColor={theme.primaryColor}>
                {renderCardContent(item)}
              </HoverCard>
            </GradientBorderCard>
          );
        case 'pixel':
          return withAnimation(
            <PixelCard
              className="group overflow-hidden shadow-md border w-full h-full"
              variant="default"
              gap={5}
              speed={35}
              colors="#f8fafc,#f1f5f9,#cbd5e1"
              style={styles.cardStyle}
            >
              <HoverCard hover={cards.hover} glowColor={theme.primaryColor}>
                {renderCardContent(item)}
              </HoverCard>
            </PixelCard>
          );
      }
    }

    // Default card (no card effects enabled)
    return withAnimation(
      <div 
        className="group relative overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border"
        style={styles.cardStyle}
      >
        {renderCardContent(item)}
      </div>
    );
  };

  return (
    <section 
      className="py-20" 
      style={
        transparentBg 
          ? { backgroundColor: 'transparent' } 
          : { backgroundColor: styles.containerStyle.backgroundColor as string }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 
            className="text-3xl font-bold mb-4"
            style={{ color: styles.textColor }}
          >
            {config.gallery.title}
          </h2>
          {config.gallery.showFilters && (
            <div className="flex justify-center gap-2 mt-4">
              <button 
                className="px-4 py-1.5 text-sm font-medium transition-all"
                style={styles.filterActive}
              >
                All
              </button>
              <button 
                className="px-4 py-1.5 text-sm font-medium transition-all hover:opacity-80"
                style={styles.filterInactive}
              >
                Images
              </button>
              <button 
                className="px-4 py-1.5 text-sm font-medium transition-all hover:opacity-80"
                style={styles.filterInactive}
              >
                Videos
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div 
              className="w-12 h-12 border-4 rounded-full animate-spin"
              style={styles.spinnerStyle}
            />
          </div>
        ) : (
          /* Media Grid */
          <div className={`grid gap-8 ${
            config.gallery.columns === '2' ? 'grid-cols-1 sm:grid-cols-2' :
            config.gallery.columns === '4' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}>
            {media.map((item, index) => renderCard(item, index))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
