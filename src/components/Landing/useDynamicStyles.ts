/**
 * Dynamic styles hook for Landing page
 * Following SRP: Only handles style generation based on theme config
 */

import { useMemo } from 'react';
import type { SiteConfig } from '../../types/config';
import { hexToRgb, isLightColor, lightenColor } from '../../utils/colors';

export interface DynamicStyles {
  containerStyle: React.CSSProperties;
  headerStyle: React.CSSProperties;
  buttonPrimary: React.CSSProperties;
  buttonSecondary: React.CSSProperties;
  logoBackground: React.CSSProperties;
  titleColor: React.CSSProperties;
  cardStyle: React.CSSProperties;
  sectionSecondary: React.CSSProperties;
  gradientBg: React.CSSProperties;
  animatedGradientBg: React.CSSProperties;
  footerStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
  spinnerStyle: React.CSSProperties;
  filterActive: React.CSSProperties;
  filterInactive: React.CSSProperties;
  shadowPrimary: React.CSSProperties;
  primaryColor: string;
  textColor: string;
  textMuted: string;
  hoverColor: string;
}

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  fontFamily: string;
  headingFont?: string;
  borderRadius: string;
  mode?: 'light' | 'dark';
}

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#3b82f6',
  secondaryColor: '#1e293b',
  fontFamily: 'Inter',
  borderRadius: '0.5rem',
  mode: 'dark',
};

export function useDynamicStyles(config: SiteConfig): DynamicStyles {
  const theme = config?.theme ?? DEFAULT_THEME;
  const isDarkMode = theme.mode === 'dark';

  return useMemo(() => {
    const primary = theme.primaryColor;
    const secondary = theme.secondaryColor;
    const primaryRgb = hexToRgb(primary);
    const secondaryRgb = hexToRgb(secondary);
    const borderRadius = theme.borderRadius;
    const fontFamily = theme.fontFamily;
    const primaryTextColor = isLightColor(primary) ? '#1e293b' : '#ffffff';
    
    // Theme-aware colors
    const bgColor = isDarkMode ? secondary : '#ffffff';
    const bgColorAlt = isDarkMode ? lightenColor(secondary, 3) : '#f8fafc';
    const textColor = isDarkMode ? '#ffffff' : '#0f172a';
    const textMuted = isDarkMode ? '#94a3b8' : '#64748b';
    const borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
    
    return {
      containerStyle: {
        fontFamily: `"${fontFamily}", system-ui, -apple-system, sans-serif`,
        backgroundColor: bgColor,
        color: textColor,
      },
      
      headerStyle: {
        backgroundColor: isDarkMode ? `rgba(${secondaryRgb}, 0.9)` : 'rgba(255, 255, 255, 0.9)',
        borderColor: borderColor,
      },
      
      buttonPrimary: {
        backgroundColor: primary,
        color: primaryTextColor,
        borderRadius: borderRadius,
      },
      
      buttonSecondary: {
        backgroundColor: isDarkMode ? lightenColor(secondary, 15) : '#f1f5f9',
        color: isDarkMode ? '#ffffff' : '#334155',
        borderRadius: borderRadius,
      },
      
      logoBackground: {
        backgroundColor: primary,
        borderRadius: borderRadius,
      },
      
      titleColor: {
        color: primary,
      },
      
      cardStyle: {
        backgroundColor: isDarkMode ? lightenColor(secondary, 8) : '#ffffff',
        borderColor: borderColor,
        borderRadius: borderRadius,
      },
      
      sectionSecondary: {
        backgroundColor: bgColorAlt,
      },
      
      gradientBg: {
        background: `linear-gradient(135deg, ${secondary}, ${lightenColor(secondary, 10)}, ${secondary})`,
      },
      
      animatedGradientBg: {
        background: `linear-gradient(-45deg, ${secondary}, ${lightenColor(secondary, 15)}, ${secondary}, ${lightenColor(secondary, 10)})`,
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
      },
      
      footerStyle: {
        backgroundColor: isDarkMode ? lightenColor(secondary, 3) : '#f8fafc',
        borderColor: borderColor,
      },
      
      inputStyle: {
        backgroundColor: isDarkMode ? lightenColor(secondary, 10) : '#ffffff',
        borderColor: borderColor,
        borderRadius: borderRadius,
        color: textColor,
      },
      
      spinnerStyle: {
        borderColor: isDarkMode ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
        borderTopColor: primary,
      },
      
      filterActive: {
        backgroundColor: `rgba(${primaryRgb}, 0.2)`,
        color: primary,
        borderRadius: borderRadius,
      },
      
      filterInactive: {
        backgroundColor: 'transparent',
        color: textMuted,
        borderRadius: borderRadius,
      },
      
      shadowPrimary: {
        boxShadow: `0 4px 14px 0 rgba(${primaryRgb}, 0.39)`,
      },
      
      primaryColor: primary,
      textColor,
      textMuted,
      hoverColor: primary,
    };
  }, [theme, isDarkMode]);
}

export default useDynamicStyles;
