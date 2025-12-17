/**
 * Hero Panel Configuration Constants
 * Single Responsibility: Define all Hero panel options and configurations
 */

import {
  FileText,
  Layout,
  Film,
  Type,
  Smartphone,
  ArrowLeftRight,
  RotateCw,
  Sparkles,
  Layers,
  Image as ImageIcon,
  ArrowRight,
  Search,
  RefreshCw,
  Box,
  Camera,
  Shapes,
  Lightbulb,
  Rainbow,
  SlidersHorizontal,
  Video,
  Star,
  Maximize,
  Square,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import type { HeroConfig } from '../../../../types/config';
import type { SelectOption, TabConfig } from '../shared/types';

// Tab Configuration
export type HeroTabType = 'content' | 'layout' | 'media' | 'typography' | 'responsive' | 'effects';

export const heroTabs: TabConfig<HeroTabType>[] = [
  { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { id: 'media', label: 'Media', icon: <Film className="w-4 h-4" /> },
  { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
  { id: 'effects', label: 'Effects', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'responsive', label: 'Mobile', icon: <Smartphone className="w-4 h-4" /> },
];

// Template Options
export const templateOptions: Array<{ id: HeroConfig['template']; label: string; desc: string }> = [
  { id: 'simple', label: 'Simple', desc: 'Text only' },
  { id: 'split', label: 'Split', desc: 'Text + Media side by side' },
  { id: 'dual-media', label: 'Dual Media', desc: 'Two media items, no text' },
  { id: 'full-screen', label: 'Full Screen', desc: 'Media background' },
  { id: 'media-background', label: 'Media BG', desc: 'Large media with text overlay' },
  { id: 'media-overlay', label: 'Overlay', desc: 'Text overlapping media' },
];

// Dual Media Layout Options
export const dualMediaLayoutOptions = [
  { value: 'disabled' as const, label: 'Single Media', desc: 'Show one media only' },
  { value: 'side-by-side' as const, label: 'Side by Side', desc: 'Two media horizontally' },
  { value: 'stacked' as const, label: 'Stacked', desc: 'Two media vertically' },
  { value: 'featured-thumb' as const, label: 'Featured + Thumbnail', desc: 'One large, one small' },
  { value: 'logo-media' as const, label: 'Logo + Media', desc: 'Logo left, media right' },
];

// Dual Media Split Ratio
export const dualMediaSplitOptions: SelectOption<string>[] = [
  { value: '50-50', label: '50% / 50%' },
  { value: '60-40', label: '60% / 40%' },
  { value: '70-30', label: '70% / 30%' },
  { value: '40-60', label: '40% / 60%' },
  { value: '30-70', label: '30% / 70%' },
];

// Height Options
export const heroHeightOptions: Array<{ id: HeroConfig['heroHeight']; label: string }> = [
  { id: 'auto', label: 'Auto' },
  { id: 'sm', label: 'S' },
  { id: 'md', label: 'M' },
  { id: 'lg', label: 'L' },
  { id: 'full', label: 'Full' },
];

// Text Alignment Options
export const textAlignOptions = [
  { value: 'left' as const, icon: <AlignLeft className="w-4 h-4" /> },
  { value: 'center' as const, icon: <AlignCenter className="w-4 h-4" /> },
  { value: 'right' as const, icon: <AlignRight className="w-4 h-4" /> },
];

// Vertical Alignment Options
export const verticalAlignOptions: SelectOption<NonNullable<HeroConfig['verticalAlign']>>[] = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
];

// Content Width Options
export const contentWidthOptions: SelectOption<NonNullable<HeroConfig['contentMaxWidth']>>[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: 'full', label: 'Full' },
];

// Padding Options
export const paddingYOptions: SelectOption<NonNullable<HeroConfig['paddingY']>>[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
];

export const paddingXOptions: SelectOption<NonNullable<HeroConfig['paddingX']>>[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

// Media Display Mode Options
export const displayModeOptions = [
  { id: 'slider' as const, label: 'Slider', icon: <ArrowLeftRight className="w-5 h-5" />, desc: 'Slide left/right' },
  { id: 'carousel' as const, label: 'Carousel', icon: <RotateCw className="w-5 h-5" />, desc: 'Auto-rotate' },
  { id: 'fade' as const, label: 'Fade', icon: <Sparkles className="w-5 h-5" />, desc: 'Crossfade' },
  { id: 'stack' as const, label: 'Stack', icon: <Layers className="w-5 h-5" />, desc: 'Stacked cards' },
  { id: 'single' as const, label: 'Single', icon: <ImageIcon className="w-5 h-5" />, desc: 'First only' },
];

// Transition Effect Options
export const transitionOptions = [
  { id: 'fade' as const, icon: <Sparkles className="w-4 h-4" />, name: 'Fade' },
  { id: 'slide' as const, icon: <ArrowRight className="w-4 h-4" />, name: 'Slide' },
  { id: 'zoom' as const, icon: <Search className="w-4 h-4" />, name: 'Zoom' },
  { id: 'flip' as const, icon: <RefreshCw className="w-4 h-4" />, name: 'Flip' },
  { id: 'cube' as const, icon: <Box className="w-4 h-4" />, name: 'Cube' },
];

// Media Display Style Options
export const mediaStyleOptions = [
  { id: 'default' as const, label: 'Default', icon: <Camera className="w-4 h-4" /> },
  { id: 'glass' as const, label: 'Glass', icon: <Shapes className="w-4 h-4" /> },
  { id: 'pixel' as const, label: 'Pixel', icon: <Square className="w-4 h-4" /> },
  { id: 'tilt' as const, label: 'Tilt', icon: <Maximize className="w-4 h-4" /> },
  { id: 'glow' as const, label: 'Glow', icon: <Lightbulb className="w-4 h-4" /> },
  { id: 'gradient-border' as const, label: 'Gradient', icon: <Rainbow className="w-4 h-4" /> },
  { id: 'parallax' as const, label: 'Parallax', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { id: 'ken-burns' as const, label: 'Ken Burns', icon: <Video className="w-4 h-4" /> },
  { id: 'reveal' as const, label: 'Reveal', icon: <Star className="w-4 h-4" /> },
];

// Media Size Options
export const mediaSizeOptions: SelectOption<NonNullable<HeroConfig['mediaSize']>>[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: 'full', label: 'Full' },
];

// Media Fit Options
export const mediaFitOptions: SelectOption<NonNullable<HeroConfig['mediaFit']>>[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: 'fill', label: 'Fill' },
];

// Media Rounded Options
export const mediaRoundedOptions: SelectOption<NonNullable<HeroConfig['mediaRounded']>>[] = [
  { value: 'none', label: '0' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: 'full', label: 'Full' },
];

// Media Shadow Options
export const mediaShadowOptions: SelectOption<NonNullable<HeroConfig['mediaShadow']>>[] = [
  { value: 'none', label: '0' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
];

// Typography Options
export const titleSizeOptions: SelectOption<NonNullable<HeroConfig['titleSize']>>[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
];

export const titleWeightOptions: SelectOption<NonNullable<HeroConfig['titleWeight']>>[] = [
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
  { value: 'bold', label: 'Bold' },
  { value: 'extrabold', label: 'Extrabold' },
];

export const subtitleSizeOptions: SelectOption<NonNullable<HeroConfig['subtitleSize']>>[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

// New Typography Options
export const titleLetterSpacingOptions: SelectOption<string>[] = [
  { value: 'tighter', label: 'Tighter' },
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
  { value: 'wider', label: 'Wider' },
  { value: 'widest', label: 'Widest' },
];

export const titleLineHeightOptions: SelectOption<string>[] = [
  { value: 'none', label: 'None (1)' },
  { value: 'tight', label: 'Tight (1.25)' },
  { value: 'snug', label: 'Snug (1.375)' },
  { value: 'normal', label: 'Normal (1.5)' },
  { value: 'relaxed', label: 'Relaxed (1.625)' },
  { value: 'loose', label: 'Loose (2)' },
];

export const titleTransformOptions: SelectOption<string>[] = [
  { value: 'none', label: 'Normal' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

export const subtitleWeightOptions: SelectOption<string>[] = [
  { value: 'light', label: 'Light' },
  { value: 'normal', label: 'Normal' },
  { value: 'medium', label: 'Medium' },
  { value: 'semibold', label: 'Semibold' },
];

export const subtitleOpacityOptions: SelectOption<string>[] = [
  { value: '100', label: '100%' },
  { value: '90', label: '90%' },
  { value: '80', label: '80%' },
  { value: '70', label: '70%' },
  { value: '60', label: '60%' },
  { value: '50', label: '50%' },
];

// Text Effect Options
export const textEffectOptions: SelectOption<NonNullable<HeroConfig['effect']>>[] = [
  { value: 'none', label: 'None' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'glass', label: 'Glass' },
  { value: 'fade', label: 'Fade' },
  { value: 'blur-in', label: 'Blur In' },
  { value: 'splash', label: 'Splash' },
];

// Overlay Gradient Options
export const overlayGradientOptions: Array<{ id: HeroConfig['overlayGradient'] | undefined; label: string }> = [
  { id: undefined, label: 'None' },
  { id: 'top', label: 'T' },
  { id: 'bottom', label: 'B' },
  { id: 'left', label: 'L' },
  { id: 'right', label: 'R' },
];
