/**
 * LocationPanel Component
 * Configures the Location section with Google Maps integration
 */

import React, { useState, useCallback } from 'react';
import { MapPin, Layout, Palette } from 'lucide-react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { PanelHeader, TabNavigation, Section, SectionHeader, Input, Textarea, Toggle, ButtonGroup, Select, InfoBox, SectionStatusControl } from '../shared';
import type { TabConfig, SelectOption } from '../shared/types';
import type { LocationConfig, SectionsConfig } from '../../../../types/config';

type LocationTabType = 'content' | 'layout' | 'style';

const locationTabs: TabConfig<LocationTabType>[] = [
  { id: 'content', label: 'Content', icon: <MapPin className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { id: 'style', label: 'Style', icon: <Palette className="w-4 h-4" /> },
];

const layoutOptions: SelectOption[] = [
  { value: 'map-only', label: 'Map Only' },
  { value: 'map-left', label: 'Map Left + Info' },
  { value: 'map-right', label: 'Map Right + Info' },
  { value: 'map-top', label: 'Map Top + Info' },
];

const mapHeightOptions: SelectOption[] = [
  { value: 'sm', label: 'Small (300px)' },
  { value: 'md', label: 'Medium (400px)' },
  { value: 'lg', label: 'Large (500px)' },
  { value: 'xl', label: 'Extra Large (600px)' },
];

const mapStyleOptions = [
  { value: 'default', label: 'Default' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'glass', label: 'Glass' },
  { value: 'bordered', label: 'Bordered' },
];

// Helper to extract Google Maps embed URL from share link
const extractEmbedUrl = (shareUrl: string): string => {
  // If already an embed URL, return as is
  if (shareUrl.includes('/embed')) {
    return shareUrl;
  }
  
  // Try to extract place ID or coordinates
  // From: https://www.google.com/maps/place/...
  // To: https://www.google.com/maps/embed/v1/place?key=...&q=...
  // OR use the direct embed approach without API key
  
  // Check if it's a short URL or full URL
  if (shareUrl.includes('maps.app.goo.gl') || shareUrl.includes('goo.gl/maps')) {
    // Short URLs need the user to convert manually
    return '';
  }
  
  // Extract coordinates or place from URL
  const coordMatch = shareUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const [, lat, lng] = coordMatch;
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }
  
  // Try to extract place name
  const placeMatch = shareUrl.match(/place\/([^/@]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&z=15&output=embed`;
  }
  
  return '';
};

export const LocationPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<LocationTabType>('content');

  const location = config.location;
  const sections = config.sections;

  // Section visibility helpers
  const isEnabled = sections.location.enabled;
  const currentOrder = sections.location.order;
  const totalSections = Object.values(sections).filter(s => s.enabled).length;

  const handleToggleSection = useCallback((enabled: boolean) => {
    console.log('LocationPanel: Toggling section to:', enabled);
    console.log('LocationPanel: Current sections:', sections);
    const newConfig = {
      ...config,
      sections: {
        ...sections,
        location: { ...sections.location, enabled },
      },
    };
    console.log('LocationPanel: New sections:', newConfig.sections);
    setConfig(newConfig);
  }, [config, sections, setConfig]);

  const handleMoveSection = useCallback((direction: 'up' | 'down') => {
    const currentOrder = sections.location.order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the section to swap with
    const swapKey = Object.entries(sections).find(([, v]) => v.order === targetOrder)?.[0] as keyof SectionsConfig | undefined;
    
    if (!swapKey) return;
    
    setConfig({
      ...config,
      sections: {
        ...sections,
        location: { ...sections.location, order: targetOrder },
        [swapKey]: { ...sections[swapKey], order: currentOrder },
      },
    });
  }, [config, sections, setConfig]);

  const handleUpdate = useCallback((key: keyof LocationConfig, value: any) => {
    setConfig({
      ...config,
      location: {
        ...location,
        [key]: value,
      },
    });
  }, [config, location, setConfig]);

  const handleContactUpdate = useCallback((key: string, value: string) => {
    setConfig({
      ...config,
      location: {
        ...location,
        contactInfo: {
          ...location.contactInfo,
          [key]: value,
        },
      },
    });
  }, [config, location, setConfig]);

  const handleGoogleMapsUrlChange = (url: string) => {
    handleUpdate('googleMapsUrl', url);
    // Try to auto-generate embed URL
    const embedUrl = extractEmbedUrl(url);
    if (embedUrl) {
      handleUpdate('googleMapsEmbedUrl', embedUrl);
    }
  };

  const renderContentTab = () => (
    <div className="space-y-6">
      <Section>
        <SectionHeader title="Section Header" />
        <Toggle
          label="Show Title"
          checked={location.showTitle}
          onChange={(checked) => handleUpdate('showTitle', checked)}
        />
        <Input
          label="Title"
          value={location.title}
          onChange={(value) => handleUpdate('title', value)}
        />
        <Textarea
          label="Subtitle"
          value={location.subtitle || ''}
          onChange={(value) => handleUpdate('subtitle', value)}
          rows={2}
        />
      </Section>

      <Section>
        <SectionHeader title="Google Maps" />
        <InfoBox variant="info">
          Paste your Google Maps share link or embed URL. Go to Google Maps, find your location, click "Share" → "Embed a map" and copy the src URL from the iframe code.
        </InfoBox>
        <Input
          label="Google Maps Share URL"
          placeholder="https://www.google.com/maps/place/..."
          value={location.googleMapsUrl || ''}
          onChange={(value) => handleGoogleMapsUrlChange(value)}
        />
        <Textarea
          label="Embed URL (auto-generated or manual)"
          placeholder="https://maps.google.com/maps?q=...&output=embed"
          value={location.googleMapsEmbedUrl || ''}
          onChange={(value) => handleUpdate('googleMapsEmbedUrl', value)}
          rows={2}
        />
      </Section>

      <Section>
        <SectionHeader title="Address & Contact" />
        <Toggle
          label="Show Address"
          checked={location.showAddress}
          onChange={(checked) => handleUpdate('showAddress', checked)}
        />
        <Textarea
          label="Address"
          placeholder="123 Main Street, City, Country"
          value={location.address || ''}
          onChange={(value) => handleUpdate('address', value)}
          rows={2}
        />
        <Toggle
          label="Show Directions Button"
          checked={location.showDirectionsButton}
          onChange={(checked) => handleUpdate('showDirectionsButton', checked)}
        />
        {location.showDirectionsButton && (
          <Input
            label="Button Text"
            value={location.directionsButtonText || 'Get Directions'}
            onChange={(value) => handleUpdate('directionsButtonText', value)}
          />
        )}
      </Section>

      <Section>
        <SectionHeader title="Contact Info" description="Optional contact details to display" />
        <Input
          label="Phone"
          placeholder="+1 234 567 8900"
          value={location.contactInfo?.phone || ''}
          onChange={(value) => handleContactUpdate('phone', value)}
        />
        <Input
          label="Email"
          placeholder="contact@example.com"
          value={location.contactInfo?.email || ''}
          onChange={(value) => handleContactUpdate('email', value)}
        />
        <Textarea
          label="Business Hours"
          placeholder="Mon-Fri: 9am-6pm"
          value={location.contactInfo?.hours || ''}
          onChange={(value) => handleContactUpdate('hours', value)}
          rows={2}
        />
      </Section>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <Section>
        <SectionHeader title="Layout" />
        <Select
          label="Layout Style"
          value={location.layout}
          options={layoutOptions}
          onChange={(value) => handleUpdate('layout', value)}
        />
      </Section>

      <Section>
        <SectionHeader title="Map Size" />
        <Select
          label="Map Height"
          value={location.mapHeight}
          options={mapHeightOptions}
          onChange={(value) => handleUpdate('mapHeight', value)}
        />
      </Section>
    </div>
  );

  const renderStyleTab = () => (
    <div className="space-y-6">
      <Section>
        <SectionHeader title="Map Style" />
        <ButtonGroup
          options={mapStyleOptions}
          value={location.mapStyle}
          onChange={(value) => handleUpdate('mapStyle', value)}
          columns={2}
        />
      </Section>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
      case 'layout':
        return renderLayoutTab();
      case 'style':
        return renderStyleTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Location Settings"
        subtitle="Configure the location/map section"
      />
      
      <TabNavigation
        tabs={locationTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Section Status Control - Add/Remove from Page */}
        <SectionStatusControl
          enabled={isEnabled}
          order={currentOrder}
          totalSections={totalSections || 1}
          sectionName="Location"
          canDisable={true}
          onToggle={handleToggleSection}
          onMoveUp={() => handleMoveSection('up')}
          onMoveDown={() => handleMoveSection('down')}
        />
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default LocationPanel;
