/**
 * Gallery Panel Configuration Constants
 * Single Responsibility: Define all Gallery panel options and configurations
 */

import {
  FileText,
  Layout,
  Sparkles,
  Smartphone,
  Grid3X3,
  LayoutGrid,
  RotateCw,
  Square,
  GlassWater,
  Gamepad2,
  Rainbow,
  Ban,
  Search,
  ArrowUp,
  Maximize,
  Lightbulb,
  Wind,
} from 'lucide-react';
import type { SiteConfig } from '../../../../types/config';
import type { TabConfig, SelectOption } from '../shared/types';

export type GalleryConfig = SiteConfig['gallery'];
export type GalleryTabType = 'content' | 'layout' | 'effects' | 'responsive';

// Tab Configuration
export const galleryTabs: TabConfig<GalleryTabType>[] = [
  { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { id: 'effects', label: 'Effects', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'responsive', label: 'Responsive', icon: <Smartphone className="w-4 h-4" /> },
];

// Layout Type Options
export const layoutTypeOptions = [
  { value: 'grid' as const, label: 'Grid', icon: <Grid3X3 className="w-5 h-5" /> },
  { value: 'masonry' as const, label: 'Masonry', icon: <LayoutGrid className="w-5 h-5" /> },
  { value: 'carousel' as const, label: 'Carousel', icon: <RotateCw className="w-5 h-5" /> },
];

// Column Options
export const desktopColumnOptions: SelectOption<'2' | '3' | '4'>[] = [
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
];

export const tabletColumnOptions: SelectOption<'1' | '2' | '3'>[] = [
  { value: '1', label: '1 Column' },
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
];

export const mobileColumnOptions: SelectOption<'1' | '2'>[] = [
  { value: '1', label: '1 Column' },
  { value: '2', label: '2 Columns' },
];

// Gap Options
export const gapOptions: SelectOption<'sm' | 'md' | 'lg' | 'xl'>[] = [
  { value: 'sm', label: 'Small (8px)' },
  { value: 'md', label: 'Medium (16px)' },
  { value: 'lg', label: 'Large (24px)' },
  { value: 'xl', label: 'Extra Large (32px)' },
];

// Aspect Ratio Options
export const aspectRatioOptions: SelectOption<'square' | 'video' | 'portrait' | 'auto'>[] = [
  { value: 'square', label: '1:1 Square' },
  { value: 'video', label: '16:9 Video' },
  { value: 'portrait', label: '4:5 Portrait' },
  { value: 'auto', label: 'Auto (Original)' },
];

// Card Effect Options
export const cardEffectOptions = [
  { value: 'none' as const, label: 'Simple', icon: <Square className="w-4 h-4" /> },
  { value: 'glass' as const, label: 'Glass', icon: <GlassWater className="w-4 h-4" /> },
  { value: 'pixel' as const, label: 'Pixel', icon: <Gamepad2 className="w-4 h-4" /> },
  { value: 'glow' as const, label: 'Glow', icon: <Sparkles className="w-4 h-4" /> },
  { value: 'gradient' as const, label: 'Gradient', icon: <Rainbow className="w-4 h-4" /> },
];

// Hover Effect Options
export const hoverEffectOptions = [
  { value: 'none' as const, label: 'None', icon: <Ban className="w-4 h-4" /> },
  { value: 'zoom' as const, label: 'Zoom', icon: <Search className="w-4 h-4" /> },
  { value: 'lift' as const, label: 'Lift', icon: <ArrowUp className="w-4 h-4" /> },
  { value: 'tilt' as const, label: '3D Tilt', icon: <Maximize className="w-4 h-4" /> },
  { value: 'glow' as const, label: 'Glow', icon: <Lightbulb className="w-4 h-4" /> },
  { value: 'blur' as const, label: 'Blur', icon: <Wind className="w-4 h-4" /> },
];

// Card Effect Descriptions
export const cardEffectDescriptions: Record<string, string> = {
  glass: 'Glassmorphism effect with blur and transparency',
  pixel: 'Retro pixel-art style cards with animated borders',
  glow: 'Subtle glow effect around card borders',
  gradient: 'Animated gradient border effect',
  none: 'Clean, minimal card design',
};
