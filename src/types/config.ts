export interface EffectsConfig {
  cursor: {
    enabled: boolean;
    type: 'splash' | 'spotlight' | 'ripple' | 'trail' | 'neon' | 'glitter' | 'click-spark';
    color: string;
  };
  background: {
    enabled: boolean;
    type: 'gradient' | 'mesh' | 'aurora' | 'waves' | 'particles' | 'grid' | 'starfield' | 'orbs' | 'geometric' | 'noise';
    speed: 'slow' | 'normal' | 'fast';
  };
  cards: {
    enabled: boolean;
    type: 'glass' | 'pixel' | 'tilt' | 'glow' | 'gradient-border';
    hover: 'none' | 'lift' | 'scale' | 'glow' | 'tilt';
  };
  animations: {
    enabled: boolean;
    type: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'blur' | 'flip';
    duration: 'fast' | 'normal' | 'slow' | 'very-slow';
    stagger: boolean;
  };
  particles: {
    enabled: boolean;
    count: number;
    color: string;
  };
}

// Hero Media Item - represents a single media in the hero gallery
export interface HeroMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  alt?: string;
}

export interface HeroConfig {
  template: 'simple' | 'split' | 'full-screen' | 'media-background' | 'media-overlay' | 'dual-media';
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  // Legacy single media (kept for backward compatibility)
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  // New multi-media gallery support
  mediaItems?: HeroMediaItem[];  // Multiple media items
  mediaDisplayMode?: 'single' | 'slider' | 'carousel' | 'fade' | 'stack';  // How to display multiple media
  mediaDisplayStyle?: 'default' | 'glass' | 'pixel' | 'tilt' | 'glow' | 'gradient-border' | 'parallax' | 'ken-burns' | 'reveal';  // React Bits style effects
  // Slider/Carousel specific options
  sliderAutoplay?: boolean;
  sliderInterval?: number;  // ms between slides (3000, 5000, 7000, 10000)
  sliderTransition?: 'slide' | 'fade' | 'zoom' | 'flip' | 'cube';
  sliderShowDots?: boolean;
  sliderShowArrows?: boolean;
  sliderPauseOnHover?: boolean;
  // Effect
  effect: 'none' | 'parallax' | 'tilt' | 'glass' | 'gradient' | 'fade' | 'blur-in' | 'splash';
  // Text positioning
  textAlign: 'left' | 'center' | 'right';
  verticalAlign: 'top' | 'center' | 'bottom';
  // Typography
  titleSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  titleWeight: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  subtitleSize: 'sm' | 'md' | 'lg' | 'xl';
  // Enhanced Typography
  titleLetterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
  titleLineHeight?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
  titleTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  subtitleWeight?: 'light' | 'normal' | 'medium' | 'semibold';
  subtitleOpacity?: '100' | '90' | '80' | '70' | '60' | '50';
  // Spacing/Padding
  paddingY: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  paddingX: 'sm' | 'md' | 'lg' | 'xl';
  contentMaxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  // Mobile specific overrides
  mobile?: {
    textAlign?: 'left' | 'center' | 'right';
    titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    subtitleSize?: 'sm' | 'md' | 'lg' | 'xl';
    paddingY?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    paddingX?: 'sm' | 'md' | 'lg' | 'xl';
    hideMedia?: boolean;
  };
  // Media positioning for split layout
  mediaPosition?: 'left' | 'right';
  mediaFit?: 'cover' | 'contain' | 'fill';
  overlayOpacity?: number;
  showSecondaryButton?: boolean;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  // New enhanced media options
  mediaSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';  // Size of media in split layouts
  mediaRounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';  // Border radius for media
  mediaShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';  // Shadow for media
  textOverMedia?: boolean;  // Whether text overlaps media
  textBackdrop?: boolean;  // Show backdrop behind text when over media
  heroHeight?: 'auto' | 'sm' | 'md' | 'lg' | 'full';  // Hero section height
  mediaAutoplay?: boolean;  // Autoplay videos
  mediaLoop?: boolean;  // Loop videos
  mediaMuted?: boolean;  // Mute videos
  mediaControls?: boolean;  // Show video controls
  overlayGradient?: 'top' | 'bottom' | 'left' | 'right';  // Gradient overlay direction
  overlayColor?: string;  // Custom overlay color
  // Dual Media Options
  dualMediaLayout?: 'disabled' | 'side-by-side' | 'stacked' | 'featured-thumb' | 'logo-media';
  dualMediaSplit?: '50-50' | '60-40' | '70-30' | '40-60' | '30-70';
  secondaryMediaUrl?: string;  // URL for second media
  secondaryMediaType?: 'image' | 'video';
  secondaryMediaFit?: 'cover' | 'contain' | 'fill';
  secondaryMediaRounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

// Navigation Link Container Style Types (Tailwind-based)
export type NavLinkContainerStyle = 
  | 'none'             // No container, just text
  | 'underline'        // Underline on hover
  | 'pill'             // Pill-shaped with background
  | 'pill-outline'     // Pill-shaped with border only
  | 'rounded'          // Rounded rectangle with background
  | 'rounded-outline'  // Rounded rectangle with border only
  | 'square'           // Square/rectangle with background
  | 'square-outline';  // Square/rectangle with border only

// Navigation Link Effect Types (ReactBits-based)
export type NavLinkEffect = 
  | 'none'             // No special effect
  | 'magnet'           // Magnetic pull effect
  | 'star-border'      // Animated star border
  | 'glow';            // Glow effect on hover

export type NavLinkHoverAnimation = 
  | 'none'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'scale'
  | 'bounce';

export interface SiteConfig {
  header: {
    title: string;
    logoUrl?: string;
    logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    logoMaxWidth?: 'auto' | '80' | '120' | '160' | '200' | '250' | '300' | '400';
    logoFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
    logoAspect?: 'auto' | 'square' | 'wide' | 'ultrawide' | 'portrait';
    hideTitle?: boolean;
    layout: 'centered' | 'left-logo' | 'compact' | 'minimal';
    links: Array<{ label: string; url: string; id: string }>;
    // New header options
    sticky?: boolean;
    transparent?: boolean;
    blur?: boolean;
    showCta?: boolean;
    ctaText?: string;
    ctaUrl?: string;
    height?: 'sm' | 'md' | 'lg';
    hideOnScroll?: boolean;
    mobileMenuStyle?: 'slide' | 'full' | 'dropdown';
    // Navigation Link Styling
    navLinkContainerStyle?: NavLinkContainerStyle;  // Container/shape style
    navLinkEffect?: NavLinkEffect;                   // ReactBits effect
    navLinkHoverAnimation?: NavLinkHoverAnimation;   // Hover animation
    navLinkSize?: 'xs' | 'sm' | 'md' | 'lg';
    navLinkWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    navLinkSpacing?: 'tight' | 'normal' | 'wide';
    navLinkGap?: 'sm' | 'md' | 'lg' | 'xl';
    // Color options
    navLinkColor?: string;           // Text color
    navLinkHoverColor?: string;      // Text color on hover
    navLinkBgColor?: string;         // Background/border color
    navLinkBgHoverColor?: string;    // Background/border color on hover
    // Effect-specific options
    navStarBorderColor?: string;
    navStarBorderSpeed?: 'slow' | 'normal' | 'fast';
    navMagnetStrength?: 'light' | 'normal' | 'strong';
    navGlowColor?: string;
    navGlowIntensity?: 'soft' | 'normal' | 'strong';
  };
  hero: HeroConfig;
  gallery: {
    title: string;
    subtitle?: string;
    showTitle?: boolean;
    showFilters: boolean;
    layout?: 'grid' | 'masonry' | 'carousel';
    columns?: '2' | '3' | '4';
    tabletColumns?: '1' | '2' | '3';
    mobileColumns?: '1' | '2';
    gap?: 'sm' | 'md' | 'lg' | 'xl';
    aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
    cardEffect?: 'none' | 'glass' | 'pixel' | 'glow' | 'gradient';
    hoverEffect?: 'none' | 'zoom' | 'lift' | 'tilt' | 'glow' | 'blur';
    lightbox?: boolean;
    maxItems?: number;
    showViewAll?: boolean;
    viewAllText?: string;
    viewAllUrl?: string;
    animateOnScroll?: boolean;
  };
  footer: {
    layout?: 'simple' | 'columns' | 'centered' | 'minimal';
    showLogo?: boolean;
    logoUrl?: string;
    tagline?: string;
    backgroundColor?: string;
    columns?: Array<{
      id: string;
      title: string;
      links: Array<{ label: string; url: string; id: string }>;
    }>;
    socials: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      threads?: string;
      whatsapp?: string;
      linkedin?: string;
      tiktok?: string;
      github?: string;
    };
    contact: {
      email?: string;
      phone?: string;
      address?: string;
    };
    showNewsletter: boolean;
    newsletterTitle?: string;
    newsletterDescription?: string;
    showCopyright: boolean;
    copyrightText?: string;
    showDivider?: boolean;
    legalLinks?: Array<{ label: string; url: string; id: string }>;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor?: string;
    fontFamily: string;
    headingFont?: string;
    borderRadius: string;
    mode?: 'light' | 'dark';
    // New typography options
    baseFontSize?: 'sm' | 'md' | 'lg';
    headingWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    bodyWeight?: 'light' | 'normal' | 'medium';
    letterSpacing?: 'tight' | 'normal' | 'wide';
    lineHeight?: 'tight' | 'normal' | 'relaxed';
    // Button styles
    buttonStyle?: 'solid' | 'outline' | 'ghost' | 'gradient';
    buttonRounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    // Shadow
    shadowIntensity?: 'none' | 'sm' | 'md' | 'lg';
  };
  effects?: EffectsConfig;
}

export const defaultConfig: SiteConfig = {
  header: {
    title: 'My Portfolio',
    layout: 'left-logo',
    logoSize: 'md',
    links: [
      { id: '1', label: 'About', url: '#about' },
      { id: '2', label: 'Work', url: '#work' },
      { id: '3', label: 'Contact', url: '#contact' },
    ],
    sticky: true,
    transparent: false,
    blur: true,
    showCta: false,
    ctaText: 'Get Started',
    ctaUrl: '#contact',
    height: 'md',
    hideOnScroll: false,
    mobileMenuStyle: 'slide',
    // Navigation Link Styling defaults
    navLinkContainerStyle: 'none',
    navLinkEffect: 'none',
    navLinkHoverAnimation: 'none',
    navLinkSize: 'sm',
    navLinkWeight: 'medium',
    navLinkSpacing: 'normal',
    navLinkGap: 'md',
    // Color defaults (undefined = use theme colors)
    navLinkColor: undefined,
    navLinkHoverColor: undefined,
    navLinkBgColor: undefined,
    navLinkBgHoverColor: undefined,
    // Effect defaults
    navStarBorderColor: '#6366f1',
    navStarBorderSpeed: 'normal',
    navMagnetStrength: 'normal',
    navGlowColor: '#6366f1',
    navGlowIntensity: 'normal',
  },
  hero: {
    template: 'simple',
    title: 'Welcome to my creative space',
    subtitle: 'I build digital experiences',
    ctaText: 'View Work',
    ctaUrl: '#work',
    effect: 'gradient',
    // Text positioning
    textAlign: 'center',
    verticalAlign: 'center',
    // Typography
    titleSize: 'xl',
    titleWeight: 'bold',
    subtitleSize: 'lg',
    // Spacing
    paddingY: 'xl',
    paddingX: 'md',
    contentMaxWidth: 'lg',
    // Mobile overrides
    mobile: {
      textAlign: 'center',
      titleSize: 'lg',
      subtitleSize: 'md',
      paddingY: 'lg',
      paddingX: 'sm',
    },
    // Media
    mediaPosition: 'right',
    mediaFit: 'cover',
    overlayOpacity: 0.5,
    showSecondaryButton: true,
    secondaryButtonText: 'Learn More',
    secondaryButtonUrl: '#about',
    // New media options
    mediaSize: 'lg',
    mediaRounded: 'lg',
    mediaShadow: 'lg',
    textOverMedia: false,
    textBackdrop: false,
    heroHeight: 'auto',
    mediaAutoplay: true,
    mediaLoop: true,
    mediaMuted: true,
    mediaControls: false,
    overlayGradient: undefined,
    overlayColor: '#000000',
    // Multi-media gallery
    mediaItems: [],
    mediaDisplayMode: 'single',
    mediaDisplayStyle: 'default',
    sliderAutoplay: true,
    sliderInterval: 5000,
    sliderTransition: 'fade',
    sliderShowDots: true,
    sliderShowArrows: true,
    sliderPauseOnHover: true,
  },
  gallery: {
    title: 'Selected Works',
    subtitle: 'Check out some of my recent projects',
    showTitle: true,
    showFilters: true,
    layout: 'grid',
    columns: '3',
    tabletColumns: '2',
    mobileColumns: '1',
    gap: 'md',
    aspectRatio: 'video',
    cardEffect: 'glass',
    hoverEffect: 'zoom',
    lightbox: true,
    maxItems: 0,
    showViewAll: false,
    viewAllText: 'View All Projects',
    viewAllUrl: '/portfolio',
    animateOnScroll: true,
  },
  footer: {
    layout: 'columns',
    showLogo: true,
    tagline: 'Building digital experiences that matter.',
    socials: {},
    contact: {},
    columns: [],
    showNewsletter: true,
    newsletterTitle: 'Stay Updated',
    newsletterDescription: 'Subscribe to get the latest updates.',
    showCopyright: true,
    copyrightText: '© 2025 All rights reserved.',
    showDivider: true,
    legalLinks: [
      { id: '1', label: 'Privacy Policy', url: '/privacy' },
      { id: '2', label: 'Terms of Service', url: '/terms' },
    ],
  },
  theme: {
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
  },
  effects: {
    cursor: { enabled: false, type: 'splash', color: '#6366f1' },
    background: { enabled: false, type: 'gradient', speed: 'slow' },
    cards: { enabled: false, type: 'glass', hover: 'lift' },
    animations: { enabled: true, type: 'fade', duration: 'normal', stagger: true },
    particles: { enabled: false, count: 50, color: '#6366f1' },
  },
};
