/**
 * Theme Panel Configuration Constants
 * Single Responsibility: Define all Theme panel options and configurations
 */

import { Palette, Type, MousePointer, Settings } from 'lucide-react';
import type { SiteConfig } from '../../../../types/config';
import type { SelectOption, TabConfig } from '../shared/types';

export type ThemeConfig = NonNullable<SiteConfig['theme']>;
export type ThemeTabType = 'colors' | 'typography' | 'buttons' | 'advanced';

// Tab Configuration
export const themeTabs: TabConfig<ThemeTabType>[] = [
  { id: 'colors', label: 'Colors', icon: <Palette className="w-4 h-4" /> },
  { id: 'typography', label: 'Typography', icon: <Type className="w-4 h-4" /> },
  { id: 'buttons', label: 'Buttons', icon: <MousePointer className="w-4 h-4" /> },
  { id: 'advanced', label: 'Advanced', icon: <Settings className="w-4 h-4" /> },
];

// Color Presets
export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export const colorPresets: ColorPreset[] = [
  { name: 'Ocean Blue', primary: '#3b82f6', secondary: '#1e293b', accent: '#0ea5e9' },
  { name: 'Forest Green', primary: '#22c55e', secondary: '#14532d', accent: '#4ade80' },
  { name: 'Royal Purple', primary: '#8b5cf6', secondary: '#1e1b4b', accent: '#a78bfa' },
  { name: 'Sunset Orange', primary: '#f97316', secondary: '#431407', accent: '#fb923c' },
  { name: 'Rose Pink', primary: '#ec4899', secondary: '#500724', accent: '#f472b6' },
  { name: 'Slate Gray', primary: '#64748b', secondary: '#0f172a', accent: '#94a3b8' },
  { name: 'Amber Gold', primary: '#f59e0b', secondary: '#451a03', accent: '#fbbf24' },
  { name: 'Teal Cyan', primary: '#14b8a6', secondary: '#134e4a', accent: '#2dd4bf' },
];

// Font Options
export const fontOptions: SelectOption<string>[] = [
  { value: 'Inter', label: 'Inter (Modern Sans)' },
  { value: 'Roboto', label: 'Roboto (Clean Sans)' },
  { value: 'Poppins', label: 'Poppins (Geometric)' },
  { value: 'Montserrat', label: 'Montserrat (Elegant)' },
  { value: 'Open Sans', label: 'Open Sans (Friendly)' },
  { value: 'Lato', label: 'Lato (Warm)' },
  { value: 'Playfair Display', label: 'Playfair Display (Serif)' },
  { value: 'Merriweather', label: 'Merriweather (Readable Serif)' },
  { value: 'Source Code Pro', label: 'Source Code Pro (Mono)' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono (Tech)' },
];

// Font Size Options
export const fontSizeOptions = [
  { value: 'sm' as const, label: 'Small' },
  { value: 'md' as const, label: 'Medium' },
  { value: 'lg' as const, label: 'Large' },
];

// Heading Weight Options
export const headingWeightOptions = [
  { value: 'medium' as const, label: 'Medium' },
  { value: 'semibold' as const, label: 'Semibold' },
  { value: 'bold' as const, label: 'Bold' },
  { value: 'extrabold' as const, label: 'Extrabold' },
];

// Body Weight Options
export const bodyWeightOptions = [
  { value: 'light' as const, label: 'Light' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'medium' as const, label: 'Medium' },
];

// Letter Spacing Options
export const letterSpacingOptions = [
  { value: 'tight' as const, label: 'Tight' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'wide' as const, label: 'Wide' },
];

// Line Height Options
export const lineHeightOptions = [
  { value: 'tight' as const, label: 'Tight' },
  { value: 'normal' as const, label: 'Normal' },
  { value: 'relaxed' as const, label: 'Relaxed' },
];

// Button Style Options
export const buttonStyleOptions = [
  { value: 'solid' as const, label: 'Solid' },
  { value: 'outline' as const, label: 'Outline' },
  { value: 'ghost' as const, label: 'Ghost' },
  { value: 'gradient' as const, label: 'Gradient' },
];

// Button Roundness Options
export const buttonRoundedOptions = [
  { value: 'none' as const, label: 'Square' },
  { value: 'sm' as const, label: 'SM' },
  { value: 'md' as const, label: 'MD' },
  { value: 'lg' as const, label: 'LG' },
  { value: 'full' as const, label: 'Pill' },
];

// Shadow Intensity Options
export const shadowIntensityOptions = [
  { value: 'none' as const, label: 'None' },
  { value: 'sm' as const, label: 'SM' },
  { value: 'md' as const, label: 'MD' },
  { value: 'lg' as const, label: 'LG' },
];

// Default Theme Configuration
export const defaultTheme: ThemeConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#1e293b',
  accentColor: '#f59e0b',
  fontFamily: 'Inter',
  headingFont: 'Inter',
  borderRadius: '0.5rem',
  mode: 'dark',
  baseFontSize: 'md',
  headingWeight: 'bold',
  bodyWeight: 'normal',
  letterSpacing: 'normal',
  lineHeight: 'normal',
  buttonStyle: 'solid',
  buttonRounded: 'md',
  shadowIntensity: 'md',
};

// Get border radius CSS value
export const getBorderRadiusValue = (rounded: ThemeConfig['buttonRounded']): string => {
  switch (rounded) {
    case 'none': return '0';
    case 'sm': return '0.25rem';
    case 'md': return '0.5rem';
    case 'lg': return '0.75rem';
    case 'full': return '9999px';
    default: return '0.5rem';
  }
};
