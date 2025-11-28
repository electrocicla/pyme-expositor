/**
 * Header Panel Configuration Constants
 * Single Responsibility: Define all Header panel options and configurations
 */

import { FileText, Layout, Settings, Link, Sparkles } from 'lucide-react';
import type { SiteConfig } from '../../../../types/config';
import type { TabConfig, SelectOption } from '../shared/types';

export type HeaderConfig = SiteConfig['header'];
export type HeaderTabType = 'content' | 'layout' | 'behavior' | 'links' | 'linkstyle';

// Tab Configuration
export const headerTabs: TabConfig<HeaderTabType>[] = [
  { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { id: 'behavior', label: 'Behavior', icon: <Settings className="w-4 h-4" /> },
  { id: 'links', label: 'Links', icon: <Link className="w-4 h-4" /> },
  { id: 'linkstyle', label: 'Link Style', icon: <Sparkles className="w-4 h-4" /> },
];

// Layout Style Options
export const layoutStyleOptions = [
  { value: 'left-logo' as const, label: 'Logo Left', icon: '◀ ═══' },
  { value: 'centered' as const, label: 'Centered', icon: '═ ◆ ═' },
  { value: 'compact' as const, label: 'Compact', icon: '◀═══▶' },
  { value: 'minimal' as const, label: 'Minimal', icon: '◆' },
];

// Header Height Options
export const headerHeightOptions: SelectOption<'sm' | 'md' | 'lg'>[] = [
  { value: 'sm', label: 'Small (48px)' },
  { value: 'md', label: 'Medium (64px)' },
  { value: 'lg', label: 'Large (80px)' },
];

// Mobile Menu Style Options
export const mobileMenuStyleOptions: SelectOption<'slide' | 'full' | 'dropdown'>[] = [
  { value: 'slide', label: 'Slide from side' },
  { value: 'full', label: 'Full screen overlay' },
  { value: 'dropdown', label: 'Dropdown' },
];

// Logo Size Options (Height)
export const logoSizeOptions = [
  { value: 'xs', label: 'Extra Small', height: '24px' },
  { value: 'sm', label: 'Small', height: '32px' },
  { value: 'md', label: 'Medium', height: '40px' },
  { value: 'lg', label: 'Large', height: '48px' },
  { value: 'xl', label: 'Extra Large', height: '56px' },
  { value: '2xl', label: '2X Large', height: '64px' },
  { value: '3xl', label: '3X Large', height: '80px' },
] as const;

export type LogoSize = typeof logoSizeOptions[number]['value'];

// Logo Max Width Options (for horizontal logos)
export const logoMaxWidthOptions = [
  { value: 'auto', label: 'Auto' },
  { value: '80', label: '80px' },
  { value: '120', label: '120px' },
  { value: '160', label: '160px' },
  { value: '200', label: '200px' },
  { value: '250', label: '250px' },
  { value: '300', label: '300px' },
  { value: '400', label: '400px' },
] as const;

export type LogoMaxWidth = typeof logoMaxWidthOptions[number]['value'];

// Logo Fit Options
export const logoFitOptions = [
  { value: 'contain', label: 'Contain (no crop)' },
  { value: 'cover', label: 'Cover (may crop)' },
  { value: 'fill', label: 'Fill (may stretch)' },
  { value: 'scale-down', label: 'Scale Down' },
] as const;

export type LogoFit = typeof logoFitOptions[number]['value'];

// Logo Aspect Ratio Options
export const logoAspectOptions = [
  { value: 'auto', label: 'Auto (original)' },
  { value: 'square', label: 'Square (1:1)' },
  { value: 'wide', label: 'Wide (16:9)' },
  { value: 'ultrawide', label: 'Ultra Wide (21:9)' },
  { value: 'portrait', label: 'Portrait (3:4)' },
] as const;

export type LogoAspect = typeof logoAspectOptions[number]['value'];

// Navigation Link Container Style Options (Tailwind-based shapes)
export const navLinkContainerStyleOptions = [
  { value: 'none' as const, label: 'None', desc: 'Plain text, no container' },
  { value: 'underline' as const, label: 'Underline', desc: 'Line under text on hover' },
  { value: 'pill' as const, label: 'Pill', desc: 'Pill shape with background' },
  { value: 'pill-outline' as const, label: 'Pill Outline', desc: 'Pill shape with border' },
  { value: 'rounded' as const, label: 'Rounded', desc: 'Rounded rect with background' },
  { value: 'rounded-outline' as const, label: 'Rounded Outline', desc: 'Rounded rect with border' },
  { value: 'square' as const, label: 'Square', desc: 'Rectangle with background' },
  { value: 'square-outline' as const, label: 'Square Outline', desc: 'Rectangle with border' },
];

// Navigation Link Effect Options (ReactBits-based)
export const navLinkEffectOptions = [
  { value: 'none' as const, label: 'None', desc: 'No special effect' },
  { value: 'magnet' as const, label: 'Magnet', desc: 'Magnetic pull on hover' },
  { value: 'star-border' as const, label: 'Star Border', desc: 'Animated sparkle border' },
  { value: 'glow' as const, label: 'Glow', desc: 'Glow effect on hover' },
];

// Navigation Link Hover Animation Options
export const navLinkHoverAnimationOptions = [
  { value: 'none' as const, label: 'None' },
  { value: 'fade' as const, label: 'Fade' },
  { value: 'slide-up' as const, label: 'Slide Up' },
  { value: 'slide-down' as const, label: 'Slide Down' },
  { value: 'scale' as const, label: 'Scale' },
  { value: 'bounce' as const, label: 'Bounce' },
];

// Navigation Link Size Options
export const navLinkSizeOptions = [
  { value: 'xs' as const, label: 'Extra Small' },
  { value: 'sm' as const, label: 'Small' },
  { value: 'md' as const, label: 'Medium' },
  { value: 'lg' as const, label: 'Large' },
];

// Navigation Link Weight Options
export const navLinkWeightOptions = [
  { value: 'normal' as const, label: 'Normal' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'semibold' as const, label: 'Semibold' },
  { value: 'bold' as const, label: 'Bold' },
];

// Navigation Link Spacing Options
export const navLinkSpacingOptions = [
  { value: 'tight' as const, label: 'Tight' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'wide' as const, label: 'Wide' },
];

// Navigation Link Gap Options
export const navLinkGapOptions = [
  { value: 'sm' as const, label: 'Small' },
  { value: 'md' as const, label: 'Medium' },
  { value: 'lg' as const, label: 'Large' },
  { value: 'xl' as const, label: 'Extra Large' },
];

// Star Border Speed Options
export const navStarBorderSpeedOptions = [
  { value: 'slow' as const, label: 'Slow (8s)' },
  { value: 'normal' as const, label: 'Normal (5s)' },
  { value: 'fast' as const, label: 'Fast (3s)' },
];

// Magnet Strength Options
export const navMagnetStrengthOptions = [
  { value: 'light' as const, label: 'Light' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'strong' as const, label: 'Strong' },
];

// Glow Intensity Options
export const navGlowIntensityOptions = [
  { value: 'soft' as const, label: 'Soft' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'strong' as const, label: 'Strong' },
];

