/**
 * Effects Panel Configuration Constants
 * Single Responsibility: Define all Effects panel options and configurations
 */

import type { EffectsConfig } from '../../../../types/config';
import type { SelectOption } from '../shared/types';

// Cursor Effect Options
export const cursorTypeOptions: SelectOption<EffectsConfig['cursor']['type']>[] = [
  { value: 'splash', label: 'Fluid Splash (Psychedelic)' },
  { value: 'spotlight', label: 'Spotlight (Light follow)' },
  { value: 'ripple', label: 'Ripple (Water rings)' },
  { value: 'trail', label: 'Trail (Dot follow)' },
  { value: 'neon', label: 'Neon (Glow trail)' },
  { value: 'glitter', label: 'Glitter (Sparkles)' },
  { value: 'click-spark', label: 'Click Spark (Fireworks)' },
];

// Background Effect Options
export const backgroundTypeOptions: SelectOption<EffectsConfig['background']['type']>[] = [
  { value: 'gradient', label: 'Animated Gradient' },
  { value: 'mesh', label: 'Mesh Gradient' },
  { value: 'aurora', label: 'Aurora Borealis' },
  { value: 'waves', label: 'Waves' },
  { value: 'particles', label: 'Floating Particles' },
  { value: 'grid', label: 'Animated Grid' },
  { value: 'starfield', label: 'Starfield (Space)' },
  { value: 'orbs', label: 'Gradient Orbs' },
  { value: 'noise', label: 'Noise Texture' },
  { value: 'geometric', label: 'Geometric Shapes' },
];

export const backgroundSpeedOptions: SelectOption<EffectsConfig['background']['speed']>[] = [
  { value: 'slow', label: 'Slow (Subtle)' },
  { value: 'normal', label: 'Normal' },
  { value: 'fast', label: 'Fast (Dynamic)' },
];

// Card Effect Options
export const cardTypeOptions: SelectOption<EffectsConfig['cards']['type']>[] = [
  { value: 'glass', label: 'Glassmorphism' },
  { value: 'pixel', label: 'Pixel Card (React Bits)' },
  { value: 'tilt', label: '3D Tilt' },
  { value: 'glow', label: 'Glow Border' },
  { value: 'gradient-border', label: 'Gradient Border' },
];

export const cardHoverOptions: SelectOption<EffectsConfig['cards']['hover']>[] = [
  { value: 'none', label: 'None' },
  { value: 'lift', label: 'Lift Up' },
  { value: 'scale', label: 'Scale' },
  { value: 'glow', label: 'Glow' },
  { value: 'tilt', label: 'Tilt 3D' },
];

// Animation Options
export const animationTypeOptions: SelectOption<EffectsConfig['animations']['type']>[] = [
  { value: 'fade', label: 'Fade In' },
  { value: 'slide-up', label: 'Slide Up' },
  { value: 'slide-down', label: 'Slide Down' },
  { value: 'slide-left', label: 'Slide Left' },
  { value: 'slide-right', label: 'Slide Right' },
  { value: 'zoom', label: 'Zoom In' },
  { value: 'blur', label: 'Blur In' },
  { value: 'flip', label: 'Flip' },
];

export const animationDurationOptions: SelectOption<EffectsConfig['animations']['duration']>[] = [
  { value: 'fast', label: 'Fast (200ms)' },
  { value: 'normal', label: 'Normal (400ms)' },
  { value: 'slow', label: 'Slow (600ms)' },
  { value: 'very-slow', label: 'Very Slow (1000ms)' },
];

// Quick color presets for cursor/particles
export const effectColorPresets = [
  '#6366f1', // indigo
  '#ec4899', // pink
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#00ffff', // cyan
];

// Effect Presets
export interface EffectPreset {
  id: string;
  name: string;
  icon: string; // Icon name for lucide
  colors: {
    from: string;
    to: string;
    border: string;
    text: string;
  };
  config: EffectsConfig;
}

export const effectPresets: EffectPreset[] = [
  {
    id: 'modern',
    name: 'Modern',
    icon: 'Sparkles',
    colors: {
      from: 'from-indigo-600/20',
      to: 'to-purple-600/20',
      border: 'border-indigo-500/30',
      text: 'text-indigo-300',
    },
    config: {
      cursor: { enabled: true, type: 'splash', color: '#6366f1' },
      background: { enabled: true, type: 'gradient', speed: 'slow' },
      cards: { enabled: true, type: 'glass', hover: 'lift' },
      animations: { enabled: true, type: 'fade', duration: 'normal', stagger: true },
      particles: { enabled: false, count: 50, color: '#6366f1' },
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: 'Target',
    colors: {
      from: 'from-slate-600/20',
      to: 'to-slate-700/20',
      border: 'border-slate-500/30',
      text: 'text-slate-300',
    },
    config: {
      cursor: { enabled: false, type: 'splash', color: '#6366f1' },
      background: { enabled: false, type: 'gradient', speed: 'normal' },
      cards: { enabled: false, type: 'glass', hover: 'none' },
      animations: { enabled: true, type: 'fade', duration: 'fast', stagger: false },
      particles: { enabled: false, count: 50, color: '#6366f1' },
    },
  },
  {
    id: 'stunning',
    name: 'Stunning',
    icon: 'Star',
    colors: {
      from: 'from-pink-600/20',
      to: 'to-rose-600/20',
      border: 'border-pink-500/30',
      text: 'text-pink-300',
    },
    config: {
      cursor: { enabled: true, type: 'glitter', color: '#f472b6' },
      background: { enabled: true, type: 'aurora', speed: 'normal' },
      cards: { enabled: true, type: 'glow', hover: 'glow' },
      animations: { enabled: true, type: 'zoom', duration: 'slow', stagger: true },
      particles: { enabled: true, count: 80, color: '#f472b6' },
    },
  },
  {
    id: 'retro',
    name: 'Retro',
    icon: 'Gamepad2',
    colors: {
      from: 'from-cyan-600/20',
      to: 'to-teal-600/20',
      border: 'border-cyan-500/30',
      text: 'text-cyan-300',
    },
    config: {
      cursor: { enabled: true, type: 'neon', color: '#22d3ee' },
      background: { enabled: true, type: 'grid', speed: 'slow' },
      cards: { enabled: true, type: 'pixel', hover: 'tilt' },
      animations: { enabled: true, type: 'slide-up', duration: 'normal', stagger: true },
      particles: { enabled: false, count: 30, color: '#22d3ee' },
    },
  },
];

// Default effects configuration
export const defaultEffects: EffectsConfig = {
  cursor: { enabled: false, type: 'splash', color: '#6366f1' },
  background: { enabled: false, type: 'gradient', speed: 'normal' },
  cards: { enabled: false, type: 'glass', hover: 'lift' },
  animations: { enabled: true, type: 'fade', duration: 'normal', stagger: true },
  particles: { enabled: false, count: 50, color: '#6366f1' },
};
