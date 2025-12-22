/**
 * Location Section Component
 * Displays Google Maps and contact information
 */

import React from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import AnimateOnScroll from '../ReactBits/AnimateOnScroll';
import type { DynamicStyles } from './useDynamicStyles';
import type { AnimationsConfig } from './useEffectsConfig';

interface LocationSectionProps {
  styles: DynamicStyles;
  animations: AnimationsConfig;
  transparentBg?: boolean;
  device?: 'desktop' | 'tablet' | 'mobile';
}

const mapHeights = {
  sm: '300px',
  md: '400px',
  lg: '500px',
  xl: '600px',
};

const LocationSection: React.FC<LocationSectionProps> = ({ 
  styles, 
  animations, 
  transparentBg = false,
  device = 'desktop',
}) => {
  const { config } = useConfig();
  
  const location = React.useMemo(() => {
    if (device === 'desktop') return config.location;
    return { ...config.location, ...config.location[device] };
  }, [config.location, device]);

  const theme = config.theme;

  // Check if section has any content to display
  const hasMapContent = location.googleMapsEmbedUrl;
  const hasContactContent = location.address || location.contactInfo?.phone || location.contactInfo?.email || location.contactInfo?.hours;
  const hasAnyContent = hasMapContent || hasContactContent;

  const mapStyles: Record<string, React.CSSProperties> = {
    default: {},
    rounded: { borderRadius: theme.borderRadius },
    glass: { 
      borderRadius: theme.borderRadius,
      boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    bordered: {
      borderRadius: theme.borderRadius,
      border: `2px solid ${theme.primaryColor}`,
    },
  };

  const renderMap = () => {
    if (!location.googleMapsEmbedUrl) return null;
    
    return (
      <div 
        className="overflow-hidden w-full"
        style={{
          height: mapHeights[location.mapHeight],
          ...mapStyles[location.mapStyle],
        }}
      >
        <iframe
          src={location.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </div>
    );
  };

  const renderContactInfo = () => {
    const hasContactInfo = location.address || location.contactInfo?.phone || location.contactInfo?.email || location.contactInfo?.hours;
    
    if (!hasContactInfo && !location.showDirectionsButton) return null;
    
    return (
      <div className="space-y-4">
        {location.showAddress && location.address && (
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-sm" style={{ color: styles.textColor }}>Address</h4>
              <p className="text-sm" style={{ color: styles.textMuted }}>{location.address}</p>
            </div>
          </div>
        )}

        {location.contactInfo?.phone && (
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <div>
              <h4 className="font-medium text-sm" style={{ color: styles.textColor }}>Phone</h4>
              <a href={`tel:${location.contactInfo.phone}`} className="text-sm hover:underline" style={{ color: theme.primaryColor }}>
                {location.contactInfo.phone}
              </a>
            </div>
          </div>
        )}

        {location.contactInfo?.email && (
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h4 className="font-medium text-sm" style={{ color: styles.textColor }}>Email</h4>
              <a href={`mailto:${location.contactInfo.email}`} className="text-sm hover:underline" style={{ color: theme.primaryColor }}>
                {location.contactInfo.email}
              </a>
            </div>
          </div>
        )}

        {location.contactInfo?.hours && (
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: theme.primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-sm" style={{ color: styles.textColor }}>Hours</h4>
              <p className="text-sm whitespace-pre-line" style={{ color: styles.textMuted }}>{location.contactInfo.hours}</p>
            </div>
          </div>
        )}

        {location.showDirectionsButton && location.googleMapsUrl && (
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.primaryColor,
              color: '#ffffff',
              borderRadius: theme.borderRadius,
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {location.directionsButtonText || 'Get Directions'}
          </a>
        )}
      </div>
    );
  };

  const renderContent = () => {
    const hasInfo = location.layout !== 'map-only';
    
    if (!hasInfo) {
      return renderMap();
    }

    const layoutClasses: Record<string, string> = {
      'map-left': 'grid grid-cols-1 lg:grid-cols-2 gap-8',
      'map-right': 'grid grid-cols-1 lg:grid-cols-2 gap-8',
      'map-top': 'flex flex-col gap-8',
    };

    const isMapFirst = location.layout === 'map-left' || location.layout === 'map-top';

    return (
      <div className={layoutClasses[location.layout]}>
        {isMapFirst ? (
          <>
            <div className={location.layout === 'map-right' ? 'order-2 lg:order-1' : ''}>
              {renderMap()}
            </div>
            <div className={`flex flex-col justify-center ${location.layout === 'map-right' ? 'order-1 lg:order-2' : ''}`}>
              {renderContactInfo()}
            </div>
          </>
        ) : (
          <>
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              {renderContactInfo()}
            </div>
            <div className="order-1 lg:order-2">
              {renderMap()}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <section 
      className="py-20" 
      style={transparentBg ? { backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' } : styles.sectionSecondary}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {location.showTitle && (
          <AnimateOnScroll animation={animations.type} duration={animations.duration}>
            <div className="text-center mb-12">
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ color: styles.textColor }}
              >
                {location.title}
              </h2>
              {location.subtitle && (
                <p style={{ color: styles.textMuted }} className="max-w-2xl mx-auto">
                  {location.subtitle}
                </p>
              )}
            </div>
          </AnimateOnScroll>
        )}
        
        <AnimateOnScroll animation={animations.type} duration={animations.duration}>
          {hasAnyContent ? renderContent() : (
            <div 
              className="text-center py-16 px-8 rounded-xl border-2 border-dashed"
              style={{ borderColor: styles.textMuted, backgroundColor: 'rgba(0,0,0,0.2)' }}
            >
              <svg 
                className="w-16 h-16 mx-auto mb-4 opacity-50" 
                style={{ color: styles.textMuted }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-lg font-medium mb-2" style={{ color: styles.textMuted }}>
                Location section is enabled
              </p>
              <p className="text-sm" style={{ color: styles.textMuted, opacity: 0.7 }}>
                Add a Google Maps URL in the editor to display your location
              </p>
            </div>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default LocationSection;
