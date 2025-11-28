/**
 * Panels Index
 * Exports all refactored panel components following SOLID principles
 * 
 * Migration Guide:
 * - Old: import { HeroPanel } from './panels/HeroPanel'
 * - New: import { HeroPanel } from './panels'
 * 
 * Each panel has been refactored from a single monolithic file into
 * a modular folder structure with separate components for each tab/section.
 */

// Refactored Panels (modular folder structure)
export { HeroPanel } from './HeroPanel';
export { EffectsPanel } from './EffectsPanel';
export { ThemePanel } from './ThemePanel';
export { GalleryPanel } from './GalleryPanel';
export { HeaderPanel } from './HeaderPanel';
export { FooterPanel } from './FooterPanel';
export { MediaPanel } from './MediaPanel';

// Shared Components & Utilities
export { MediaSelector } from './MediaSelector';
export { HeroMediaGallery } from './HeroMediaGallery';

// Shared UI Components (for custom panel development)
export * from './shared';

// Custom Hooks
export * from './hooks';
