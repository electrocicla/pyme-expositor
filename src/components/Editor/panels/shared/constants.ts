/**
 * Shared constants and style configurations
 * DRY principle - all reusable values centralized
 */

// Tailwind class mappings for consistent styling
export const inputBaseClasses = 
  'w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm ' +
  'placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ' +
  'transition-all duration-200';

export const selectBaseClasses =
  'w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ' +
  'transition-all duration-200 appearance-none cursor-pointer';

export const selectArrowSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`;

export const toggleActiveClasses = 'bg-blue-600';
export const toggleInactiveClasses = 'bg-slate-700';
export const toggleKnobActiveClasses = 'translate-x-5';
export const toggleKnobInactiveClasses = 'translate-x-0';

export const buttonGroupActiveClasses = 'border-blue-500 bg-blue-500/20 text-blue-300';
export const buttonGroupInactiveClasses = 'border-white/10 bg-white/5 hover:border-white/30 text-white/60 hover:text-white/80';

export const tabActiveClasses = 'bg-blue-500/30 text-blue-300 shadow-sm';
export const tabInactiveClasses = 'text-white/60 hover:text-white/80 hover:bg-white/5';

// Section container styles
export const sectionContainerClasses = 'p-3 bg-white/5 rounded-lg space-y-3';
export const highlightContainerClasses = 'p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20';
export const warningContainerClasses = 'p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg';
export const infoContainerClasses = 'p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg';

// Animation classes
export const fadeInClasses = 'animate-in fade-in duration-200';

// Quick color presets for effects
export const quickColorPresets = [
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#00ffff', // Cyan
];

// Grid column classes mapping
export const gridColsClasses: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
};

// Gap classes mapping
export const gapClasses: Record<string, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
};
