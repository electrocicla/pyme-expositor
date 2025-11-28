/**
 * Font loading utilities
 * Following SRP: Only handles font loading
 */

const loadedFonts = new Set<string>();

/**
 * Load a Google Font dynamically
 */
export const loadGoogleFont = (fontFamily: string): void => {
  if (!fontFamily || loadedFonts.has(fontFamily)) return;
  
  const fontName = fontFamily.replace(/\s+/g, '+');
  const linkId = `google-font-${fontName}`;
  
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontFamily);
    return;
  }
  
  const link = document.createElement('link');
  link.id = linkId;
  link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700;800;900&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  
  loadedFonts.add(fontFamily);
};

/**
 * Preload multiple Google Fonts
 */
export const preloadFonts = (fonts: string[]): void => {
  fonts.forEach(loadGoogleFont);
};

/**
 * Check if a font is already loaded
 */
export const isFontLoaded = (fontFamily: string): boolean => {
  return loadedFonts.has(fontFamily);
};
