/**
 * Accessibility utilities
 */

/**
 * Check if the user prefers reduced motion
 * @returns true if the user has set prefers-reduced-motion: reduce
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};