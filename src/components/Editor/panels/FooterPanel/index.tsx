/**
 * FooterPanel - Refactored Index
 * Composes all footer configuration tabs following SRP
 */

import React from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { footerTabs } from './constants';
import { PanelHeader, TabNavigation } from '../shared';
import { useTabNavigation } from '../hooks';
import { FooterLayoutTab } from './FooterLayoutTab';
import { FooterContentTab } from './FooterContentTab';
import { FooterSocialTab } from './FooterSocialTab';
import { FooterLegalTab } from './FooterLegalTab';

export const FooterPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { activeTab, setActiveTab } = useTabNavigation(footerTabs[0].id);

  const footer = config.footer || {};

  const handleFooterUpdate = (key: string, value: any) => {
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
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default FooterPanel;
