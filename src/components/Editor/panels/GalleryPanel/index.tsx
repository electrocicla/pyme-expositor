/**
 * GalleryPanel Component
 * Single Responsibility: Compose and orchestrate gallery configuration tabs
 * 
 * This is the main entry point for the Gallery Panel, following composition over inheritance.
 * Each tab is a separate component with its own responsibility.
 */

import React, { useState, useCallback } from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { PanelHeader, TabNavigation } from '../shared';
import { galleryTabs, type GalleryTabType } from './constants';
import { GalleryContentTab } from './GalleryContentTab';
import { GalleryLayoutTab } from './GalleryLayoutTab';
import { GalleryEffectsTab } from './GalleryEffectsTab';
import { GalleryResponsiveTab } from './GalleryResponsiveTab';

/**
 * Main GalleryPanel component
 * Manages tab navigation and delegates to specialized sub-components
 */
export const GalleryPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<GalleryTabType>('content');

  const gallery = config.gallery;

  // Generic update handler
  const handleUpdate = useCallback((key: string, value: any) => {
    setConfig({
      ...config,
      gallery: {
        ...gallery,
        [key]: value,
      },
    });
  }, [config, gallery, setConfig]);

  // Render the active tab content
  const renderTabContent = () => {
    const props = {
      gallery,
      onUpdate: handleUpdate,
    };

    switch (activeTab) {
      case 'content':
        return <GalleryContentTab {...props} />;
      case 'layout':
        return <GalleryLayoutTab {...props} />;
      case 'effects':
        return <GalleryEffectsTab {...props} />;
      case 'responsive':
        return <GalleryResponsiveTab {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Gallery Settings"
        subtitle="Configure your media gallery"
      />
      
      <TabNavigation
        tabs={galleryTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default GalleryPanel;
