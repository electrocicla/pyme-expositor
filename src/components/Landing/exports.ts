/**
 * Landing Page Module Exports
 * Central export point for all Landing page components and hooks
 */

// Main Component
export { default } from './index';

// Section Components
export { default as HeaderSection } from './HeaderSection';
export { default as HeroSection } from './HeroSection';
export { default as FeaturesSection } from './FeaturesSection';
export { default as GallerySection } from './GallerySection';
export { default as FooterSection } from './FooterSection';

// Effect Components
export { default as CursorEffects } from './CursorEffects';
export { default as BackgroundEffects } from './BackgroundEffects';

// Hooks
export { useDynamicStyles } from './useDynamicStyles';
export { useEffectsConfig } from './useEffectsConfig';

// Types
export type { DynamicStyles } from './useDynamicStyles';
export type { 
  CursorEffectsConfig, 
  BackgroundEffectsConfig, 
  CardsConfig, 
  AnimationsConfig, 
  ParticlesConfig,
  EffectsConfigResult 
} from './useEffectsConfig';
