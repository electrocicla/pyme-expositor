/**
 * Hero Section Component
 * Following SRP: Only handles hero section rendering
 * Following OCP: Supports multiple templates through config
 * Supports new media options: sizes, overlays, video controls
 * Supports multi-media gallery with slider/carousel modes
 * Supports dual media layout (logo + main media)
 */

import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import AnimateOnScroll from '../ReactBits/AnimateOnScroll';
import HeroMediaSlider from '../ReactBits/HeroMediaSlider';
import TypewriterText from '../ReactBits/TypewriterText';
import ParallaxSection from '../ReactBits/ParallaxSection';
import TiltCard from '../ReactBits/TiltCard';
import GlassCard from '../ReactBits/GlassCard';
import FadeIn from '../ReactBits/FadeIn';
import StaggerContainer from '../ReactBits/StaggerContainer';
import type { DynamicStyles } from './useDynamicStyles';
import type { AnimationsConfig } from './useEffectsConfig';

interface HeroSectionProps {
  styles: DynamicStyles;
  animations: AnimationsConfig;
  bgEffectsEnabled: boolean;
  bgType: string;
  isDarkMode: boolean;
  device?: 'desktop' | 'tablet' | 'mobile';
}

// Hero height mappings
const heightClasses: Record<string, string> = {
  auto: '',
  sm: 'min-h-[40vh]',
  md: 'min-h-[60vh]',
  lg: 'min-h-[80vh]',
  full: 'min-h-screen',
};

// Media size classes
const mediaSizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'w-full',
};

// Media rounded classes
const mediaRoundedClasses: Record<string, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

// Media shadow classes
const mediaShadowClasses: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
};

// Dual media split ratios
const dualMediaSplitStyles: Record<string, { left: string; right: string }> = {
  '50-50': { left: 'w-1/2', right: 'w-1/2' },
  '60-40': { left: 'w-[60%]', right: 'w-[40%]' },
  '70-30': { left: 'w-[70%]', right: 'w-[30%]' },
  '40-60': { left: 'w-[40%]', right: 'w-[60%]' },
  '30-70': { left: 'w-[30%]', right: 'w-[70%]' },
};

const HeroSection: React.FC<HeroSectionProps> = ({
  styles,
  animations,
  bgEffectsEnabled,
  bgType,
  isDarkMode,
  device = 'desktop',
}) => {
  const { config } = useConfig();
  
  const hero = React.useMemo(() => {
    if (device === 'desktop') return config.hero;
    return { ...config.hero, ...config.hero[device] };
  }, [config.hero, device]);

  // Get height class
  const getHeightClass = (): string => {
    return heightClasses[hero.heroHeight || 'lg'];
  };

  // Check if we have any media
  const hasMedia = hero.mediaUrl || (hero.mediaItems && hero.mediaItems.length > 0);

  // Build media items array
  const mediaItems = React.useMemo(() => {
    const items = [];

    // Add primary media
    if (hero.mediaUrl) {
      items.push({
        id: 'primary-media',
        url: hero.mediaUrl,
        type: hero.mediaType || 'image',
        alt: 'Hero media',
      });
    }

    // Add additional media items
    if (hero.mediaItems) {
      items.push(...hero.mediaItems);
    }

    return items;
  }, [hero.mediaUrl, hero.mediaType, hero.mediaItems]);

  // Check if this is a background media template
  const isBackgroundMediaTemplate = hero.template === 'media-background' || hero.template === 'media-overlay';

  // Render background media
  const renderBackgroundMedia = () => {
    if (!isBackgroundMediaTemplate || !hasMedia) return null;

    return (
      <>
        <div className="absolute inset-0">
          <HeroMediaSlider
            items={mediaItems}
            displayMode={hero.mediaDisplayMode || 'single'}
            displayStyle={hero.mediaDisplayStyle || 'default'}
            autoplay={hero.sliderAutoplay !== false}
            interval={hero.sliderInterval || 5000}
            transition={hero.sliderTransition || 'fade'}
            showDots={hero.sliderShowDots !== false}
            showArrows={hero.sliderShowArrows !== false}
            pauseOnHover={hero.sliderPauseOnHover !== false}
            mediaFit={hero.mediaFit || 'cover'}
            mediaRounded="none"
            mediaShadow="none"
            videoAutoplay={hero.mediaAutoplay !== false}
            videoLoop={hero.mediaLoop !== false}
            videoMuted={hero.mediaMuted !== false}
            videoControls={hero.mediaControls === true}
            className="w-full h-full"
          />
        </div>
        {/* Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            backgroundColor: hero.overlayColor || '#000000',
            opacity: hero.overlayOpacity ?? 0.5,
            ...(hero.overlayGradient && {
              background: `linear-gradient(to ${hero.overlayGradient}, transparent, ${hero.overlayColor || '#000000'})`
            })
          }}
        />
      </>
    );
  };

  // Render split template media (supports dual media)
  const renderSplitMedia = () => {
    if (hero.template !== 'split') return null;

    const mediaSize = hero.mediaSize || 'full';
    const mediaRounded = hero.mediaRounded || 'lg';
    const mediaShadow = hero.mediaShadow || 'xl';
    const isDualMediaEnabled = hero.dualMediaLayout && hero.dualMediaLayout !== 'disabled';
    const dualSplit = dualMediaSplitStyles[hero.dualMediaSplit || '50-50'];
    const secondaryRounded = hero.secondaryMediaRounded || 'lg';
    const secondaryFit = hero.secondaryMediaFit || 'contain';

    // Dual media layout
    if (isDualMediaEnabled && hero.secondaryMediaUrl) {
      const isDualStacked = hero.dualMediaLayout === 'stacked';
      const isFeaturedThumb = hero.dualMediaLayout === 'featured-thumb';
      const isLogoMedia = hero.dualMediaLayout === 'logo-media';

      return (
        <AnimateOnScroll
          animation={animations.enabled ? 'zoom' : 'fade'}
          duration={animations.duration}
          delay={animations.stagger ? 300 : 0}
          className="lg:w-1/2 flex-shrink-0"
        >
          <div
            className={`flex ${isDualStacked ? 'flex-col' : 'flex-row'} gap-4 items-center ${
              mediaSizeClasses[mediaSize]
            }`}
          >
            {/* Secondary Media (Left/Top) */}
            <div
              className={`relative overflow-hidden transition-transform duration-500 ${
                isDualStacked ? 'w-full' :
                isFeaturedThumb ? 'w-1/4' :
                isLogoMedia ? 'w-2/5' :
                dualSplit.left
              } ${mediaRoundedClasses[secondaryRounded]}`}
            >
              {hero.secondaryMediaType === 'video' ? (
                <video
                  src={hero.secondaryMediaUrl}
                  className={`w-full h-full ${
                    secondaryFit === 'cover' ? 'object-cover' :
                    secondaryFit === 'contain' ? 'object-contain' :
                    'object-fill'
                  }`}
                  autoPlay={hero.mediaAutoplay !== false}
                  loop={hero.mediaLoop !== false}
                  muted={hero.mediaMuted !== false}
                  playsInline
                />
              ) : (
                <img
                  src={hero.secondaryMediaUrl}
                  alt="Secondary media"
                  className={`w-full h-full ${
                    secondaryFit === 'cover' ? 'object-cover' :
                    secondaryFit === 'contain' ? 'object-contain' :
                    'object-fill'
                  }`}
                />
              )}
            </div>

            {/* Primary Media (Right/Bottom) */}
            <div
              className={`relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 ${
                isDualStacked ? 'w-full' :
                isFeaturedThumb ? 'w-3/4' :
                isLogoMedia ? 'w-3/5' :
                dualSplit.right
              } ${mediaRoundedClasses[mediaRounded]} ${mediaShadowClasses[mediaShadow]}`}
            >
              <HeroMediaSlider
                items={mediaItems}
                displayMode={hero.mediaDisplayMode || 'single'}
                displayStyle={hero.mediaDisplayStyle || 'default'}
                autoplay={hero.sliderAutoplay !== false}
                interval={hero.sliderInterval || 5000}
                transition={hero.sliderTransition || 'fade'}
                showDots={hero.sliderShowDots !== false && mediaItems.length > 1}
                showArrows={hero.sliderShowArrows !== false && mediaItems.length > 1}
                pauseOnHover={hero.sliderPauseOnHover !== false}
                mediaFit={hero.mediaFit || 'cover'}
                mediaRounded={mediaRounded}
                mediaShadow="none"
                videoAutoplay={hero.mediaAutoplay !== false}
                videoLoop={hero.mediaLoop !== false}
                videoMuted={hero.mediaMuted !== false}
                videoControls={hero.mediaControls === true}
                className="w-full aspect-video"
              />
            </div>
          </div>
        </AnimateOnScroll>
      );
    }

    // Single media layout (original behavior)
    if (hasMedia) {
      return (
        <AnimateOnScroll
          animation={animations.enabled ? 'zoom' : 'fade'}
          duration={animations.duration}
          delay={animations.stagger ? 300 : 0}
          className="lg:w-1/2 flex-shrink-0"
        >
          <div
            className={`relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-500 ${
              mediaSizeClasses[mediaSize]
            }`}
          >
            <HeroMediaSlider
              items={mediaItems}
              displayMode={hero.mediaDisplayMode || 'single'}
              displayStyle={hero.mediaDisplayStyle || 'default'}
              autoplay={hero.sliderAutoplay !== false}
              interval={hero.sliderInterval || 5000}
              transition={hero.sliderTransition || 'fade'}
              showDots={hero.sliderShowDots !== false && mediaItems.length > 1}
              showArrows={hero.sliderShowArrows !== false && mediaItems.length > 1}
              pauseOnHover={hero.sliderPauseOnHover !== false}
              mediaFit={hero.mediaFit || 'cover'}
              mediaRounded={mediaRounded}
              mediaShadow={mediaShadow}
              videoAutoplay={hero.mediaAutoplay !== false}
              videoLoop={hero.mediaLoop !== false}
              videoMuted={hero.mediaMuted !== false}
              videoControls={hero.mediaControls === true}
              className="w-full aspect-video"
            />
          </div>
        </AnimateOnScroll>
      );
    }

    // Placeholder when no media
    return (
      <div
        className={`lg:w-1/2 flex-shrink-0 relative overflow-hidden border ${mediaRoundedClasses[mediaRounded]} ${mediaShadowClasses[mediaShadow]}`}
        style={styles.cardStyle}
      >
        <div
          className="aspect-video flex items-center justify-center"
          style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
        >
          <span style={{ color: styles.textMuted }}>Hero Media</span>
        </div>
      </div>
    );
  };

  // Render pure dual media template (no text, just two media items)
  const renderDualMediaTemplate = () => {
    const mediaRounded = hero.mediaRounded || 'lg';
    const mediaShadow = hero.mediaShadow || 'xl';
    const dualSplit = dualMediaSplitStyles[hero.dualMediaSplit || '50-50'];
    const secondaryRounded = hero.secondaryMediaRounded || 'lg';
    const secondaryFit = hero.secondaryMediaFit || 'contain';
    const isDualMediaEnabled = hero.dualMediaLayout && hero.dualMediaLayout !== 'disabled';
    const isDualStacked = isDualMediaEnabled && hero.dualMediaLayout === 'stacked';

    // If dual media is disabled, render only primary media (even if secondaryMediaUrl exists)
    if (!isDualMediaEnabled || !hero.secondaryMediaUrl) {
      return (
        <div className="w-full max-w-6xl mx-auto">
          <AnimateOnScroll
            animation={animations.enabled ? 'zoom' : 'fade'}
            duration={animations.duration}
            delay={animations.stagger ? 200 : 0}
            className="w-full"
          >
            <div className={`relative overflow-hidden ${mediaRoundedClasses[mediaRounded]} ${mediaShadowClasses[mediaShadow]}`}>
              <HeroMediaSlider
                items={mediaItems}
                displayMode={hero.mediaDisplayMode || 'single'}
                displayStyle={hero.mediaDisplayStyle || 'default'}
                autoplay={hero.sliderAutoplay !== false}
                interval={hero.sliderInterval || 5000}
                transition={hero.sliderTransition || 'fade'}
                showDots={hero.sliderShowDots !== false && mediaItems.length > 1}
                showArrows={hero.sliderShowArrows !== false && mediaItems.length > 1}
                pauseOnHover={hero.sliderPauseOnHover !== false}
                mediaFit={hero.mediaFit || 'cover'}
                mediaRounded={mediaRounded}
                mediaShadow="none"
                videoAutoplay={hero.mediaAutoplay !== false}
                videoLoop={hero.mediaLoop !== false}
                videoMuted={hero.mediaMuted !== false}
                videoControls={hero.mediaControls === true}
                className="w-full aspect-video"
              />
            </div>
          </AnimateOnScroll>
        </div>
      );
    }

    return (
      <div className={`flex ${isDualStacked ? 'flex-col' : 'flex-row'} gap-6 items-center justify-center w-full max-w-6xl mx-auto`}>
        {/* Secondary Media (Left/Top) */}
        {hero.secondaryMediaUrl && (
          <AnimateOnScroll
            animation={animations.enabled ? 'slide-right' : 'fade'}
            duration={animations.duration}
            delay={0}
            className={`${isDualStacked ? 'w-full' : dualSplit.left}`}
          >
            <div
              className={`relative overflow-hidden ${mediaRoundedClasses[secondaryRounded]}`}
            >
              {hero.secondaryMediaType === 'video' ? (
                <video
                  src={hero.secondaryMediaUrl}
                  className={`w-full h-auto ${
                    secondaryFit === 'cover' ? 'object-cover' :
                    secondaryFit === 'contain' ? 'object-contain' :
                    'object-fill'
                  }`}
                  autoPlay={hero.mediaAutoplay !== false}
                  loop={hero.mediaLoop !== false}
                  muted={hero.mediaMuted !== false}
                  playsInline
                />
              ) : (
                <img
                  src={hero.secondaryMediaUrl}
                  alt="Secondary media"
                  className={`w-full h-auto ${
                    secondaryFit === 'cover' ? 'object-cover' :
                    secondaryFit === 'contain' ? 'object-contain' :
                    'object-fill'
                  }`}
                />
              )}
            </div>
          </AnimateOnScroll>
        )}

        {/* Primary Media (Right/Bottom) */}
        <AnimateOnScroll
          animation={animations.enabled ? 'slide-left' : 'fade'}
          duration={animations.duration}
          delay={animations.stagger ? 200 : 0}
          className={`${isDualStacked ? 'w-full' : dualSplit.right}`}
        >
          <div
            className={`relative overflow-hidden ${mediaRoundedClasses[mediaRounded]} ${mediaShadowClasses[mediaShadow]}`}
          >
            <HeroMediaSlider
              items={mediaItems}
              displayMode={hero.mediaDisplayMode || 'single'}
              displayStyle={hero.mediaDisplayStyle || 'default'}
              autoplay={hero.sliderAutoplay !== false}
              interval={hero.sliderInterval || 5000}
              transition={hero.sliderTransition || 'fade'}
              showDots={hero.sliderShowDots !== false && mediaItems.length > 1}
              showArrows={hero.sliderShowArrows !== false && mediaItems.length > 1}
              pauseOnHover={hero.sliderPauseOnHover !== false}
              mediaFit={hero.mediaFit || 'cover'}
              mediaRounded={mediaRounded}
              mediaShadow="none"
              videoAutoplay={hero.mediaAutoplay !== false}
              videoLoop={hero.mediaLoop !== false}
              videoMuted={hero.mediaMuted !== false}
              videoControls={hero.mediaControls === true}
              className="w-full aspect-video"
            />
          </div>
        </AnimateOnScroll>
      </div>
    );
  };

  // Check if this is a dual-media only template
  const isDualMediaTemplate = hero.template === 'dual-media';

  // Render content with hero effects applied
  const renderContentWithEffects = () => {
    const content = (
      <div className={`max-w-7xl mx-auto w-full relative z-10 ${
        hero.paddingX === 'sm' ? 'px-2 sm:px-4' :
        hero.paddingX === 'md' ? 'px-4 sm:px-6 lg:px-8' :
        hero.paddingX === 'lg' ? 'px-6 sm:px-8 lg:px-12' :
        'px-8 sm:px-12 lg:px-16'
      }`}>
        {/* Dual Media Template - Pure media, no text */}
        {isDualMediaTemplate ? (
          renderDualMediaTemplate()
        ) : (
          <div className={`${
            hero.template === 'split'
              ? `flex flex-col lg:flex-row gap-12 ${hero.mediaPosition === 'left' ? 'lg:flex-row-reverse' : ''}`
              : 'grid gap-12'
          } ${
            hero.verticalAlign === 'top' ? 'items-start' :
            hero.verticalAlign === 'bottom' ? 'items-end' :
            'items-center'
          }`}>
          {/* Text Content */}
          <div
            className={`space-y-8 ${
              hero.template === 'split'
                ? (hero.mediaPosition === 'left' ? 'lg:order-2' : 'lg:order-1') + ' ' + 'lg:w-1/2'
                : 'text-center'
            }`}
          >
            {/* Title */}
            {(() => {
              const titleContent = hero.titleTypewriter ? (
                <TypewriterText
                  text={hero.title}
                  speed={hero.typewriterSpeed || 50}
                  delay={hero.typewriterDelay || 1000}
                  loop={hero.typewriterLoop || false}
                  cursor={hero.typewriterCursor !== false}
                />
              ) : (
                hero.title
              );

              return (
                <AnimateOnScroll
                  animation={animations.enabled ? animations.type : 'fade'}
                  duration={animations.duration}
                  delay={0}
                >
                  <h1
                    className={`font-bold leading-tight ${
                      hero.template === 'split' ? 'text-left' : 'text-center'
                    }`}
                    style={{
                      color: styles.titleColor.color,
                    }}
                  >
                    {titleContent}
                  </h1>
                </AnimateOnScroll>
              );
            })()}

            {/* Subtitle */}
            {hero.subtitle && (
              <AnimateOnScroll
                animation={animations.enabled ? animations.type : 'fade'}
                duration={animations.duration}
                delay={animations.stagger ? 100 : 0}
              >
                <p
                  className={`text-xl leading-relaxed ${
                    hero.template === 'split' ? 'text-left' : 'text-center'
                  }`}
                  style={{
                    color: styles.textMuted,
                  }}
                >
                  {hero.subtitleTypewriter ? (
                    <TypewriterText
                      text={hero.subtitle}
                      speed={hero.typewriterSpeed || 50}
                      delay={hero.typewriterDelay || 2000}
                      loop={hero.typewriterLoop || false}
                      cursor={hero.typewriterCursor !== false}
                    />
                  ) : (
                    hero.subtitle
                  )}
                </p>
              </AnimateOnScroll>
            )}

            {/* CTA Buttons */}
            <AnimateOnScroll
              animation={animations.enabled ? animations.type : 'fade'}
              duration={animations.duration}
              delay={animations.stagger ? 200 : 0}
            >
              <div className={`flex flex-wrap gap-4 ${
                hero.textAlign === 'left' ? 'justify-start' :
                hero.textAlign === 'right' ? 'justify-end' :
                'justify-center'
              }`}>
                <a
                  href={hero.ctaUrl}
                  className="px-8 py-3 font-medium transition-all duration-200 hover:opacity-90 hover:scale-105"
                  style={{
                    ...styles.buttonPrimary,
                    ...styles.shadowPrimary,
                  }}
                >
                  {hero.ctaText}
                </a>
                {hero.showSecondaryButton && (
                  <a
                    href={hero.secondaryButtonUrl || '#about'}
                    className="px-8 py-3 font-medium transition-all duration-200 hover:opacity-90"
                    style={styles.buttonSecondary}
                  >
                    {hero.secondaryButtonText || 'Learn More'}
                  </a>
                )}
              </div>
            </AnimateOnScroll>
          </div>

          {/* Split Template Media */}
          {renderSplitMedia()}
        </div>
        )}
      </div>
    );

    // Apply hero effects
    switch (hero.effect) {
      case 'parallax':
        return (
          <ParallaxSection speed={0.5} className="w-full">
            {content}
          </ParallaxSection>
        );

      case 'tilt':
        return (
          <TiltCard className="w-full">
            {content}
          </TiltCard>
        );

      case 'glass':
        return (
          <GlassCard className="w-full">
            {content}
          </GlassCard>
        );

      case 'fade-in':
        return (
          <FadeIn className="w-full">
            {content}
          </FadeIn>
        );

      case 'animate-on-scroll':
        return (
          <AnimateOnScroll
            animation="fade"
            duration="normal"
            className="w-full"
          >
            {content}
          </AnimateOnScroll>
        );

      case 'stagger':
        return (
          <StaggerContainer
            staggerDelay={100}
            className="w-full"
          >
            {content}
          </StaggerContainer>
        );

      default:
        return content;
    }
  };

  return (
    <section
      className={`relative overflow-hidden ${getHeightClass()}`}
      style={
        bgEffectsEnabled
          ? { backgroundColor: 'transparent' }  // Transparent when effects enabled
          : (bgType === 'gradient' ? styles.animatedGradientBg : styles.gradientBg)
      }
    >
      {/* Background Media */}
      {renderBackgroundMedia()}

      {/* Content with Effects */}
      {renderContentWithEffects()}
    </section>
  );
};

export default HeroSection;