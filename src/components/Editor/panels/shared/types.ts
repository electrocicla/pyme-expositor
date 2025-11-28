/**
 * Shared types for panel UI components
 * Following Single Responsibility Principle - types are centralized
 */

import type { ReactNode } from 'react';

// Base option type for selects and button groups
export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

// Tab configuration
export interface TabConfig<T extends string = string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

// Size variants following Tailwind conventions
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

// Common component props
export interface BaseInputProps {
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

// Color preset configuration
export interface ColorPreset {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

// Effect preset configuration
export interface EffectPreset {
  id: string;
  name: string;
  icon: ReactNode;
  colors: {
    from: string;
    to: string;
    border: string;
    text: string;
  };
  config: Record<string, unknown>;
}

// Grid column configuration for responsive design
export interface GridConfig {
  cols: number;
  gap?: 'sm' | 'md' | 'lg';
}
