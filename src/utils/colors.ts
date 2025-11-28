/**
 * Color utility functions
 * Following SRP: Only handles color transformations
 */

/**
 * Convert hex color to RGB string
 */
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '59, 130, 246';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

/**
 * Convert hex to RGB object
 */
export const hexToRgbObject = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

/**
 * Determine if a color is light or dark based on luminance
 */
export const isLightColor = (hex: string): boolean => {
  const rgb = hexToRgbObject(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
};

/**
 * Lighten a hex color by a percentage
 */
export const lightenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgbObject(hex);
  if (!rgb) return hex;
  const r = Math.min(255, rgb.r + Math.round(255 * percent / 100));
  const g = Math.min(255, rgb.g + Math.round(255 * percent / 100));
  const b = Math.min(255, rgb.b + Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Darken a hex color by a percentage
 */
export const darkenColor = (hex: string, percent: number): string => {
  const rgb = hexToRgbObject(hex);
  if (!rgb) return hex;
  const r = Math.max(0, rgb.r - Math.round(255 * percent / 100));
  const g = Math.max(0, rgb.g - Math.round(255 * percent / 100));
  const b = Math.max(0, rgb.b - Math.round(255 * percent / 100));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Add alpha to a hex color
 */
export const withAlpha = (hex: string, alpha: number): string => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb}, ${alpha})`;
};

/**
 * Get contrasting text color (black or white) for a background
 */
export const getContrastingColor = (hex: string): string => {
  return isLightColor(hex) ? '#1e293b' : '#ffffff';
};
