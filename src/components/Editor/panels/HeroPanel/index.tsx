/**
 * HeroPanel Component
 * Single Responsibility: Compose and orchestrate hero configuration tabs
 * 
 * This is the main entry point for the Hero Panel, following composition over inheritance.
 * Each tab is a separate component with its own responsibility.
 */

import React, { useState, useCallback } from 'react';
import type { HeroConfig, SectionsConfig } from '../../../../types/config';
import { useConfig } from '../../../../contexts/ConfigContext';
import { PanelHeader, TabNavigation, SectionStatusControl } from '../shared';
import { heroTabs, type HeroTabType } from './constants';
import { HeroContentTab } from './HeroContentTab';
import { HeroLayoutTab } from './HeroLayoutTab';
import { HeroMediaTab } from './HeroMediaTab';
import { HeroTypographyTab } from './HeroTypographyTab';
import { HeroMobileTab } from './HeroMobileTab';

/**
 * Main HeroPanel component
 * Manages tab navigation and delegates to specialized sub-components
 */
export const HeroPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<HeroTabType>('content');

  const sections = config.sections;

  // Section visibility helpers
  const isEnabled = sections.hero.enabled;
  const currentOrder = sections.hero.order;
  const totalSections = Object.values(sections).filter(s => s.enabled).length;

  const handleToggleSection = useCallback((enabled: boolean) => {
    setConfig({
      ...config,
      sections: {
        ...sections,
        hero: { ...sections.hero, enabled },
      },
    });
  }, [config, sections, setConfig]);

  const handleMoveSection = useCallback((direction: 'up' | 'down') => {
    const currentOrder = sections.hero.order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the section to swap with
    const swapKey = Object.entries(sections).find(([, v]) => v.order === targetOrder)?.[0] as keyof SectionsConfig | undefined;
    
    if (!swapKey) return;
    
    setConfig({
      ...config,
      sections: {
        ...sections,
        hero: { ...sections.hero, order: targetOrder },
        [swapKey]: { ...sections[swapKey], order: currentOrder },
      },
    });
  }, [config, sections, setConfig]);

  // Memoized update handler to prevent unnecessary re-renders
  const handleUpdate = useCallback(<K extends keyof HeroConfig>(
    key: K,
    value: HeroConfig[K]
  ) => {
    setConfig({
      ...config,
      hero: {
        ...config.hero,
        [key]: value,
      },
    });
  }, [config, setConfig]);

  // Render the active tab content
  const renderTabContent = () => {
    const props = {
      config: config.hero,
      onUpdate: handleUpdate,
    };

    switch (activeTab) {
      case 'content':
        return <HeroContentTab {...props} />;
      case 'layout':
        return <HeroLayoutTab {...props} />;
      case 'media':
        return <HeroMediaTab {...props} />;
      case 'typography':
        return <HeroTypographyTab {...props} />;
      case 'responsive':
        return <HeroMobileTab {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Hero Section"
        subtitle="Configure your landing page hero"
      />
      
      <TabNavigation
        tabs={heroTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Section Status Control - Add/Remove from Page */}
        <SectionStatusControl
          enabled={isEnabled}
          order={currentOrder}
          totalSections={totalSections || 1}
          sectionName="Hero"
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

export default HeroPanel;
