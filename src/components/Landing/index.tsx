/**
 * Landing Page Main Component
 * Following SOLID principles:
 * - SRP: Orchestrates sections, doesn't handle rendering details
 * - OCP: Easily extensible with new sections
 * - LSP: All sections follow consistent interface
 * - ISP: Each section receives only what it needs
 * - DIP: Depends on abstractions (hooks/utils) not concretions
 */

import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { ConfigProvider, useConfig } from '../../contexts/ConfigContext';
import { api, type ApiMedia } from '../../utils/api';
import { loadGoogleFont } from '../../utils/fonts';

// Hooks
import { useDynamicStyles } from './useDynamicStyles';
import { useEffectsConfig } from './useEffectsConfig';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

// Section Components
import CursorEffects from './CursorEffects';
import HeaderSection from './HeaderSection';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import GallerySection from './GallerySection';
import LocationSection from './LocationSection';
import FooterSection from './FooterSection';

// Background Effects (lazy-loaded for performance)
const AuroraBackground = lazy(() => import('../ReactBits/AuroraBackground'));
const WavesBackground = lazy(() => import('../ReactBits/WavesBackground'));
const FloatingParticles = lazy(() => import('../ReactBits/FloatingParticles'));
const AnimatedGrid = lazy(() => import('../ReactBits/AnimatedGrid'));
const MeshGradient = lazy(() => import('../ReactBits/MeshGradient'));
const StarfieldBackground = lazy(() => import('../ReactBits/StarfieldBackground'));
const GradientOrbsBackground = lazy(() => import('../ReactBits/GradientOrbsBackground'));
const GeometricBackground = lazy(() => import('../ReactBits/GeometricBackground'));
const NoiseBackground = lazy(() => import('../ReactBits/NoiseBackground'));
const WaveSeparator = lazy(() => import('../ReactBits/WaveSeparator'));
const ParticleOverlay = lazy(() => import('../ReactBits/ParticleOverlay'));
import { lightenColor } from '../../utils/colors';

import type { SectionsConfig } from '../../types/config';

/**
 * Full-screen loading component
 * Shows while the published config is being fetched
 */
const LoadingScreen: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        backgroundColor: '#0f172a',
        // Use CSS to ensure this covers everything during initial load
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated logo/spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-slate-700" />
          <div 
            className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"
            style={{ animationDuration: '1s' }}
          />
        </div>
        {/* Optional: subtle loading text */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm font-medium">Loading</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * Inner landing content component
 */
interface LandingContentProps {
  device?: 'desktop' | 'tablet' | 'mobile';
}

const LandingContent: React.FC<LandingContentProps> = ({ device: propDevice }) => {
  const [media, setMedia] = useState<ApiMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const { config, isLoading } = useConfig();
  
  const detectedDevice = useDeviceDetection();
  const device = propDevice || detectedDevice;

  // Get theme safely
  const theme = config?.theme ?? {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    fontFamily: 'Inter',
    borderRadius: '0.5rem',
    mode: 'dark'
  };

  const isDarkMode = theme.mode === 'dark';

  // Use custom hooks for styles and effects
  const styles = useDynamicStyles(config, device);
  const effects = useEffectsConfig(config, device);

  // Sort sections by order and filter enabled
  // Memoize based on the actual sections object reference
  const sortedSections = useMemo(() => {
    const sectionsData = config?.sections ?? {
      header: { enabled: true, order: 1 },
      hero: { enabled: true, order: 2 },
      features: { enabled: true, order: 3 },
      gallery: { enabled: true, order: 4 },
      location: { enabled: false, order: 5 },
      footer: { enabled: true, order: 6 },
    };
    
    // Get base sections (excluding mobile/tablet keys)
    const baseSections = Object.entries(sectionsData)
      .filter(([key]) => key !== 'mobile' && key !== 'tablet')
      .reduce((acc, [key, val]) => {
        acc[key] = val;
        return acc;
      }, {} as Record<string, any>);

    // Apply overrides if needed
    if (device !== 'desktop' && sectionsData[device]) {
      const overrides = sectionsData[device];
      if (overrides) {
        Object.entries(overrides).forEach(([key, val]) => {
          if (baseSections[key]) {
            baseSections[key] = { ...baseSections[key], ...val };
          }
        });
      }
    }
    
    const sorted = Object.entries(baseSections)
      .filter(([, v]) => v.enabled)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key]) => key as keyof SectionsConfig);
    
    return sorted;
  }, [
    config?.sections,
    device
  ]);

  // Load Google Font
  useEffect(() => {
    if (theme.fontFamily) {
      loadGoogleFont(theme.fontFamily);
    }
  }, [theme.fontFamily]);

  // Fetch media
  useEffect(() => {
    api.getMedia()
      .then((data: ApiMedia[]) => {
        setMedia(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Animation keyframes (injected once)
  useEffect(() => {
    const styleId = 'dynamic-animations';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
      @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
    `;
  }, []);

  // Mark as ready once config is loaded
  // Small delay to ensure smooth transition
  useEffect(() => {
    if (!isLoading) {
      // Small timeout to ensure all styles are applied
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Render a section by key
  const renderSection = (sectionKey: keyof SectionsConfig) => {
    switch (sectionKey) {
      case 'header':
        return <HeaderSection key="header" styles={styles} device={device} />;
      case 'hero':
        return (
          <HeroSection 
            key="hero"
            styles={styles}
            animations={effects.animations}
            bgEffectsEnabled={effects.background.enabled}
            bgType={effects.background.type}
            isDarkMode={isDarkMode}
            device={device}
          />
        );
      case 'features':
        return (
          <FeaturesSection 
            key="features"
            styles={styles}
            animations={effects.animations}
            transparentBg={effects.background.enabled}
            device={device}
          />
        );
      case 'gallery':
        return (
          <GallerySection 
            key="gallery"
            styles={styles}
            animations={effects.animations}
            cards={effects.cards}
            media={media}
            loading={loading}
            isDarkMode={isDarkMode}
            transparentBg={effects.background.enabled}
            device={device}
          />
        );
      case 'location':
        return (
          <LocationSection 
            key="location"
            styles={styles}
            animations={effects.animations}
            transparentBg={effects.background.enabled}
            device={device}
          />
        );
      case 'footer':
        return <FooterSection key="footer" styles={styles} transparentBg={effects.background.enabled} device={device} />;
      default:
        return null;
    }
  };

  // Show loading screen until config is fully loaded and ready
  if (isLoading || !isReady) {
    return <LoadingScreen />;
  }

  return (
    <div 
      style={styles.containerStyle} 
      className="min-h-screen transition-colors duration-500 relative animate-in fade-in"
    >
      {/* Cursor Effects */}
      <CursorEffects config={effects.cursor} />

      {/* Global Background Effects Layer - Now with proper z-index */}
      {effects.background.enabled && (
        <Suspense fallback={<div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />}>
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            {effects.background.type === 'aurora' && (
              <AuroraBackground 
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
                speed={effects.background.speed}
                intensity={0.8}
              />
            )}
            {effects.background.type === 'waves' && (
              <WavesBackground 
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
                speed={effects.background.speed}
                opacity={0.6}
              />
            )}
            {effects.background.type === 'particles' && (
              <FloatingParticles 
                count={80}
                color={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
                speed={effects.background.speed}
                showConnections={true}
              />
            )}
            {effects.background.type === 'grid' && (
              <AnimatedGrid 
                color={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
                speed={effects.background.speed}
                cellSize={60}
              />
            )}
            {effects.background.type === 'mesh' && (
              <MeshGradient 
                colors={[theme.primaryColor, theme.secondaryColor, lightenColor(theme.primaryColor, 30)]}
                speed={effects.background.speed}
                blobCount={5}
                opacity={0.7}
              />
            )}
            {effects.background.type === 'starfield' && (
              <StarfieldBackground 
                starCount={250}
                speed={effects.background.speed}
                color={theme.primaryColor}
                showShootingStars={true}
              />
            )}
            {effects.background.type === 'orbs' && (
              <GradientOrbsBackground 
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
                tertiaryColor={lightenColor(theme.primaryColor, 30)}
                speed={effects.background.speed}
                orbCount={6}
                blur={100}
              />
            )}
            {effects.background.type === 'geometric' && (
              <GeometricBackground 
                primaryColor={theme.primaryColor}
                secondaryColor={theme.secondaryColor}
                speed={effects.background.speed}
                shapeCount={20}
              />
            )}
            {effects.background.type === 'noise' && (
              <NoiseBackground 
                opacity={0.1}
                speed={effects.background.speed}
                color={theme.primaryColor}
                blend="overlay"
              />
            )}
            {effects.background.type === 'particle-overlay' && (
              <ParticleOverlay
                density={0.0001}
                speed={{ min: 0.5, max: 2 }}
                colors={[theme.primaryColor, theme.secondaryColor]}
                size={{ min: 2, max: 4 }}
                className="opacity-60"
              />
            )}
          </div>
        </Suspense>
      )}

      {/* Global floating particles (separate from background effects) */}
      {effects.particles.enabled && (
        <Suspense fallback={<div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />}>
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <FloatingParticles 
              count={effects.particles.count}
              color={effects.particles.color}
              secondaryColor={theme.secondaryColor}
              speed="normal"
              showConnections={false}
            />
          </div>
        </Suspense>
      )}

      {/* Page Content - rendered in order based on config */}
      <div className="relative" style={{ zIndex: 2 }}>
        {sortedSections.map((sectionKey, index) => (
          <React.Fragment key={sectionKey}>
            {renderSection(sectionKey)}
            {index < sortedSections.length - 1 && (
              <Suspense fallback={<div className="h-16 bg-gradient-to-b from-transparent to-slate-50" />}>
                <WaveSeparator
                  variant="both"
                  color={theme.primaryColor}
                  height={80}
                  animated={true}
                  className="my-8"
                />
              </Suspense>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Landing Component
 * Provides ConfigContext when not in preview mode
 */
interface LandingProps {
  previewMode?: boolean;
  device?: 'desktop' | 'tablet' | 'mobile';
}

const Landing: React.FC<LandingProps> = ({ previewMode = false, device }) => {
  if (previewMode) {
    return <LandingContent device={device} />;
  }
  
  return (
    <ConfigProvider mode="public">
      <LandingContent device={device} />
    </ConfigProvider>
  );
};

export default Landing;
export type { LandingProps };
