/**
 * FooterPanel - Refactored Index
 * Composes all footer configuration tabs following SRP
 */

import React, { useCallback } from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { footerTabs } from './constants';
import { PanelHeader, TabNavigation, SectionStatusControl } from '../shared';
import { useTabNavigation } from '../hooks';
import { FooterLayoutTab } from './FooterLayoutTab';
import { FooterContentTab } from './FooterContentTab';
import { FooterSocialTab } from './FooterSocialTab';
import { FooterLegalTab } from './FooterLegalTab';
import type { SectionsConfig } from '../../../../types/config';

export const FooterPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { activeTab, setActiveTab } = useTabNavigation(footerTabs[0].id);

  const footer = config.footer || {};
  const sections = config.sections;

  // Section visibility helpers
  const isEnabled = sections.footer.enabled;
  const currentOrder = sections.footer.order;
  const totalSections = Object.values(sections).filter(s => s.enabled).length;

  const handleToggleSection = useCallback((enabled: boolean) => {
    setConfig({
      ...config,
      sections: {
        ...sections,
        footer: { ...sections.footer, enabled },
      },
    });
  }, [config, sections, setConfig]);

  const handleMoveSection = useCallback((direction: 'up' | 'down') => {
    const currentOrder = sections.footer.order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the section to swap with
    const swapKey = Object.entries(sections).find(([, v]) => v.order === targetOrder)?.[0] as keyof SectionsConfig | undefined;
    
    if (!swapKey) return;
    
    setConfig({
      ...config,
      sections: {
        ...sections,
        footer: { ...sections.footer, order: targetOrder },
        [swapKey]: { ...sections[swapKey], order: currentOrder },
      },
    });
  }, [config, sections, setConfig]);

  const handleFooterUpdate = (key: string, value: unknown) => {
    setConfig({
      ...config,
      footer: {
        ...config.footer,
        [key]: value,
      },
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'layout':
        return <FooterLayoutTab footer={footer} onUpdate={handleFooterUpdate} />;
      case 'content':
        return <FooterContentTab footer={footer} onUpdate={handleFooterUpdate} />;
      case 'social':
        return <FooterSocialTab footer={footer} onUpdate={handleFooterUpdate} />;
      case 'legal':
        return <FooterLegalTab footer={footer} onUpdate={handleFooterUpdate} />;
      default:
        return <FooterLayoutTab footer={footer} onUpdate={handleFooterUpdate} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Footer Settings"
        subtitle="Configure your site's footer section"
      />

      <TabNavigation
        tabs={footerTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {/* Section Status Control - Footer is required but shows position */}
        <SectionStatusControl
          enabled={isEnabled}
          order={currentOrder}
          totalSections={totalSections || 1}
          sectionName="Footer"
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

export default FooterPanel;
