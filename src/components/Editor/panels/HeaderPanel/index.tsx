/**
 * HeaderPanel - Refactored Index
 * Composes all header configuration tabs following SRP
 */

import React from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { headerTabs } from './constants';
import { PanelHeader, TabNavigation } from '../shared';
import { useTabNavigation } from '../hooks';
import { HeaderContentTab } from './HeaderContentTab';
import { HeaderLayoutTab } from './HeaderLayoutTab';
import { HeaderBehaviorTab } from './HeaderBehaviorTab';
import { HeaderLinksTab } from './HeaderLinksTab';
import { HeaderLinkStyleTab } from './HeaderLinkStyleTab';

export const HeaderPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { activeTab, setActiveTab } = useTabNavigation(headerTabs[0].id);

  const handleHeaderUpdate = (key: string, value: any) => {
    setConfig({
      ...config,
      header: {
        ...config.header,
        [key]: value,
      },
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'content':
        return <HeaderContentTab header={config.header} onUpdate={handleHeaderUpdate} />;
      case 'layout':
        return <HeaderLayoutTab header={config.header} onUpdate={handleHeaderUpdate} />;
      case 'behavior':
        return <HeaderBehaviorTab header={config.header} onUpdate={handleHeaderUpdate} />;
      case 'links':
        return <HeaderLinksTab header={config.header} onUpdate={handleHeaderUpdate} />;
      case 'linkstyle':
        return <HeaderLinkStyleTab header={config.header} onUpdate={handleHeaderUpdate} />;
      default:
        return <HeaderContentTab header={config.header} onUpdate={handleHeaderUpdate} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Header Settings"
        subtitle="Configure your site's navigation header"
      />

      <TabNavigation
        tabs={headerTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default HeaderPanel;
