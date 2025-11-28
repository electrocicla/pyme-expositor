/**
 * Header Section Component
 * Following SRP: Only handles header rendering
 * Following OCP: Props allow customization without modification
 */

import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import type { DynamicStyles } from './useDynamicStyles';
import Magnet from '../ReactBits/Magnet';
import StarBorder from '../ReactBits/StarBorder';

interface HeaderSectionProps {
  styles: DynamicStyles;
}

// Map logo size values to actual heights
const logoSizeMap: Record<string, string> = {
  'xs': '24px',
  'sm': '32px',
  'md': '40px',
  'lg': '48px',
  'xl': '56px',
  '2xl': '64px',
  '3xl': '80px',
};

// Map max width values
const logoMaxWidthMap: Record<string, string> = {
  'auto': 'none',
  '80': '80px',
  '120': '120px',
  '160': '160px',
  '200': '200px',
  '250': '250px',
  '300': '300px',
  '400': '400px',
};

// Map aspect ratio values
const logoAspectMap: Record<string, string | undefined> = {
  'auto': undefined,
  'square': '1 / 1',
  'wide': '16 / 9',
  'ultrawide': '21 / 9',
  'portrait': '3 / 4',
};

// Map nav link sizes
const navLinkSizeMap: Record<string, string> = {
  'xs': 'text-xs',
  'sm': 'text-sm',
  'md': 'text-base',
  'lg': 'text-lg',
};

// Map nav link weights
const navLinkWeightMap: Record<string, string> = {
  'normal': 'font-normal',
  'medium': 'font-medium',
  'semibold': 'font-semibold',
  'bold': 'font-bold',
};

// Map nav link letter spacing
const navLinkSpacingMap: Record<string, string> = {
  'tight': 'tracking-tight',
  'normal': 'tracking-normal',
  'wide': 'tracking-wide',
};

// Map nav link gap
const navLinkGapMap: Record<string, string> = {
  'sm': 'gap-3',
  'md': 'gap-6',
  'lg': 'gap-8',
  'xl': 'gap-12',
};

// Star border speed map
const starBorderSpeedMap: Record<string, string> = {
  'slow': '8s',
  'normal': '5s',
  'fast': '3s',
};

// Magnet strength map
const magnetStrengthMap: Record<string, number> = {
  'light': 4,
  'normal': 2,
  'strong': 1,
};

// Glow intensity map
const glowIntensityMap: Record<string, string> = {
  'subtle': '0 0 8px',
  'normal': '0 0 15px',
  'strong': '0 0 25px',
  'intense': '0 0 40px',
};

const HeaderSection: React.FC<HeaderSectionProps> = ({ styles }) => {
  const { config } = useConfig();
  
  // Get logo settings
  const logoSize = config.header.logoSize || 'md';
  const logoMaxWidth = config.header.logoMaxWidth || 'auto';
  const logoFit = config.header.logoFit || 'contain';
  const logoAspect = config.header.logoAspect || 'auto';
  const hideTitle = config.header.hideTitle ?? false;

  // Get nav link settings - NEW SEPARATED APPROACH
  const navLinkContainerStyle = config.header.navLinkContainerStyle || 'none';
  const navLinkEffect = config.header.navLinkEffect || 'none';
  const navLinkHoverAnimation = config.header.navLinkHoverAnimation || 'none';
  const navLinkSize = config.header.navLinkSize || 'sm';
  const navLinkWeight = config.header.navLinkWeight || 'medium';
  const navLinkSpacing = config.header.navLinkSpacing || 'normal';
  const navLinkGap = config.header.navLinkGap || 'md';

  // Color settings (new)
  const navLinkColor = config.header.navLinkColor || undefined;
  const navLinkHoverColor = config.header.navLinkHoverColor || undefined;
  const navLinkBgColor = config.header.navLinkBgColor || undefined;
  const navLinkBgHoverColor = config.header.navLinkBgHoverColor || undefined;

  // Effect settings
  const starBorderColor = config.header.navStarBorderColor || styles.primaryColor;
  const starBorderSpeed = config.header.navStarBorderSpeed || 'normal';
  const magnetStrength = config.header.navMagnetStrength || 'normal';
  const glowColor = config.header.navGlowColor || styles.primaryColor;
  const glowIntensity = config.header.navGlowIntensity || 'normal';

  // Build logo styles
  const logoStyle: React.CSSProperties = {
    height: logoSizeMap[logoSize] || '40px',
    maxWidth: logoMaxWidthMap[logoMaxWidth] || 'none',
    objectFit: logoFit as React.CSSProperties['objectFit'],
    ...(logoAspectMap[logoAspect] && { aspectRatio: logoAspectMap[logoAspect] }),
  };

  // Build base nav link classes
  const baseNavLinkClasses = `
    ${navLinkSizeMap[navLinkSize]}
    ${navLinkWeightMap[navLinkWeight]}
    ${navLinkSpacingMap[navLinkSpacing]}
    transition-all duration-300
  `.trim();

  // Get container style classes (Tailwind only - shape/background)
  const getContainerStyleClasses = (isHovered: boolean): string => {
    switch (navLinkContainerStyle) {
      case 'underline':
        return `relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 ${isHovered ? 'after:w-full' : 'after:w-0'}`;
      case 'pill':
        return `px-4 py-1.5 rounded-full`;
      case 'pill-outline':
        return `px-4 py-1.5 rounded-full border border-current`;
      case 'rounded':
        return `px-3 py-1.5 rounded-lg`;
      case 'rounded-outline':
        return `px-3 py-1.5 rounded-lg border border-current`;
      case 'square':
        return `px-3 py-1.5 rounded-none`;
      case 'square-outline':
        return `px-3 py-1.5 rounded-none border border-current`;
      default:
        return '';
    }
  };

  // Get hover animation classes
  const getHoverAnimationClasses = (): string => {
    switch (navLinkHoverAnimation) {
      case 'fade':
        return 'hover:opacity-80';
      case 'slide-up':
        return 'hover:-translate-y-0.5';
      case 'slide-down':
        return 'hover:translate-y-0.5';
      case 'scale':
        return 'hover:scale-105';
      case 'bounce':
        return 'hover:animate-bounce';
      default:
        return '';
    }
  };

  // Get link colors with custom or fallback to theme
  const getLinkColors = (isHovered: boolean): React.CSSProperties => {
    const textColor = isHovered 
      ? (navLinkHoverColor || styles.hoverColor) 
      : (navLinkColor || styles.textMuted);
    
    // Background colors for container styles that need them
    let backgroundColor: string | undefined;
    if (['pill', 'rounded', 'square'].includes(navLinkContainerStyle)) {
      backgroundColor = isHovered 
        ? (navLinkBgHoverColor || 'rgba(255,255,255,0.15)')
        : (navLinkBgColor || 'rgba(255,255,255,0.05)');
    }

    // Glow effect for glow effect type
    let boxShadow: string | undefined;
    if (navLinkEffect === 'glow' && isHovered) {
      boxShadow = `${glowIntensityMap[glowIntensity]} ${glowColor}`;
    }

    return {
      color: textColor,
      ...(backgroundColor && { backgroundColor }),
      ...(boxShadow && { boxShadow }),
    };
  };

  // Render a single navigation link based on style and effect
  const renderNavLink = (link: { id: string; label: string; url: string }) => {
    const [isHovered, setIsHovered] = React.useState(false);
    
    const linkClasses = `
      ${baseNavLinkClasses}
      ${getContainerStyleClasses(isHovered)}
      ${getHoverAnimationClasses()}
    `.trim();

    const linkStyles = getLinkColors(isHovered);

    const linkContent = (
      <a 
        href={link.url}
        className={linkClasses}
        style={linkStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {link.label}
      </a>
    );

    // Wrap with ReactBits effects based on navLinkEffect
    if (navLinkEffect === 'magnet') {
      return (
        <Magnet
          key={link.id}
          padding={50}
          magnetStrength={magnetStrengthMap[magnetStrength]}
        >
          {linkContent}
        </Magnet>
      );
    }

    if (navLinkEffect === 'star-border') {
      return (
        <StarBorder
          key={link.id}
          as="span"
          color={starBorderColor}
          speed={starBorderSpeedMap[starBorderSpeed]}
          thickness={1}
          className="rounded-full!"
        >
          <a 
            href={link.url}
            className={`${baseNavLinkClasses} px-4 py-1.5`}
            style={{ 
              color: isHovered ? (navLinkHoverColor || styles.hoverColor) : (navLinkColor || styles.textMuted)
            }}
            onMouseEnter={(e) => {
              setIsHovered(true);
              e.currentTarget.style.color = navLinkHoverColor || styles.hoverColor;
            }}
            onMouseLeave={(e) => {
              setIsHovered(false);
              e.currentTarget.style.color = navLinkColor || styles.textMuted;
            }}
          >
            {link.label}
          </a>
        </StarBorder>
      );
    }

    return <React.Fragment key={link.id}>{linkContent}</React.Fragment>;
  };

  return (
    <header 
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={styles.headerStyle}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center ${
        config.header.layout === 'centered' ? 'justify-center relative' : 'justify-between'
      }`}>
        {/* Logo and Title */}
        <div className={`flex items-center gap-3 ${config.header.layout === 'centered' ? 'absolute left-4' : ''}`}>
          {config.header.logoUrl ? (
            <img 
              src={config.header.logoUrl} 
              alt="Logo" 
              className="w-auto"
              style={logoStyle}
            />
          ) : (
            <div 
              className="w-8 h-8 flex items-center justify-center rounded-lg"
              style={styles.logoBackground}
            >
              <span className="text-white font-bold text-sm">{config.header.title.charAt(0)}</span>
            </div>
          )}
          {!hideTitle && (
            <h1 
              className="text-xl sm:text-2xl font-bold"
              style={styles.titleColor}
            >
              {config.header.title}
            </h1>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`hidden md:flex items-center ${navLinkGapMap[navLinkGap]} ${config.header.layout === 'centered' ? 'mx-auto' : ''}`}>
          {config.header.links.map(link => renderNavLink(link))}
        </nav>

        {/* Right Side Actions */}
        <div className={`flex items-center gap-4 ${config.header.layout === 'centered' ? 'absolute right-4' : ''}`}>
          {/* Color indicator dot showing primary color */}
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: styles.primaryColor }}
            title="Primary Color"
          />
        </div>
      </div>
    </header>
  );
};

export default HeaderSection;
