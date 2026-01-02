/**
 * HeaderPanel - Refactored Index
 * Composes all header configuration tabs following SRP
 */

import React, { useCallback } from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { useEditor } from '../../../../contexts/EditorContext';
import { headerTabs } from './constants';
import { PanelHeader, TabNavigation, SectionStatusControl } from '../shared';
import { useTabNavigation } from '../hooks';
import { HeaderContentTab } from './HeaderContentTab';
import { HeaderLayoutTab } from './HeaderLayoutTab';
import { HeaderBehaviorTab } from './HeaderBehaviorTab';
import { HeaderLinksTab } from './HeaderLinksTab';
import { HeaderLinkStyleTab } from './HeaderLinkStyleTab';
import type { SectionsConfig } from '../../../../types/config';

export const HeaderPanel: React.FC = () => {
  const { config, setConfig, saveConfig } = useConfig();
  const { device } = useEditor();
  const { activeTab, setActiveTab } = useTabNavigation(headerTabs[0].id);

  const sections = config.sections;

  // Section visibility helpers
  const isEnabled = sections.header.enabled;
  const currentOrder = sections.header.order;
  const totalSections = Object.values(sections).filter(s => s.enabled).length;

  const handleToggleSection = useCallback((enabled: boolean) => {
    setConfig({
      ...config,
      sections: {
        ...sections,
        header: { ...sections.header, enabled },
      },
    });
  }, [config, sections, setConfig]);

  const handleMoveSection = useCallback((direction: 'up' | 'down') => {
    const currentOrder = sections.header.order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the section to swap with
    const swapKey = Object.entries(sections).find(([, v]) => v.order === targetOrder)?.[0] as keyof SectionsConfig | undefined;
    
    if (!swapKey) return;
    
    setConfig({
      ...config,
      sections: {
        ...sections,
        header: { ...sections.header, order: targetOrder },
        [swapKey]: { ...sections[swapKey], order: currentOrder },
      },
    });
  }, [config, sections, setConfig]);

  const handleHeaderUpdate = (key: string, value: unknown) => {
    if (device === 'desktop') {
      setConfig({
        ...config,
        header: {
          ...config.header,
          [key]: value,
        },
      });
    } else {
      const deviceConfig = config.header[device] || {};
      setConfig({
        ...config,
        header: {
          ...config.header,
          [device]: {
            ...deviceConfig,
            [key]: value,
          },
        },
      });
    }
  };

  const handleHeaderCommit = useCallback(async (key: string, value: unknown) => {
    const nextConfig = device === 'desktop'
      ? {
          ...config,
          header: {
            ...config.header,
            [key]: value,
          },
        }
      : {
          ...config,
          header: {
            ...config.header,
            [device]: {
              ...(config.header[device] || {}),
              [key]: value,
            },
          },
        };

    setConfig(nextConfig);
    await saveConfig(nextConfig);
  }, [config, device, saveConfig, setConfig]);

  const renderActiveTab = () => {
    const effectiveHeader = device === 'desktop'
      ? config.header
      : { ...config.header, ...config.header[device] };

    switch (activeTab) {
      case 'content':
        return <HeaderContentTab header={effectiveHeader} onUpdate={handleHeaderUpdate} onCommit={handleHeaderCommit} />;
      case 'layout':
        return <HeaderLayoutTab header={effectiveHeader} onUpdate={handleHeaderUpdate} />;
      case 'behavior':
        return <HeaderBehaviorTab header={effectiveHeader} onUpdate={handleHeaderUpdate} />;
      case 'links':
        return <HeaderLinksTab header={effectiveHeader} onUpdate={handleHeaderUpdate} />;
      case 'linkstyle':
        return <HeaderLinkStyleTab header={effectiveHeader} onUpdate={handleHeaderUpdate} />;
      default:
        return <HeaderContentTab header={effectiveHeader} onUpdate={handleHeaderUpdate} onCommit={handleHeaderCommit} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Header Settings"
        subtitle={`Configure your site's navigation header (${device})`}
      />

      <TabNavigation
        tabs={headerTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {/* Section Status Control - Header is required but shows position */}
        <SectionStatusControl
          enabled={isEnabled}
          order={currentOrder}
          totalSections={totalSections || 1}
          sectionName="Header"
          canDisable={false}
          onToggle={handleToggleSection}
          onMoveUp={() => handleMoveSection('up')}
          onMoveDown={() => handleMoveSection('down')}
        />
        
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default HeaderPanel;
