/**
 * ThemePanel Component
 * Single Responsibility: Compose and orchestrate theme configuration tabs
 * 
 * This is the main entry point for the Theme Panel, following composition over inheritance.
 * Each tab is a separate component with its own responsibility.
 */

import React, { useState, useCallback } from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { PanelHeader, TabNavigation } from '../shared';
import {
  themeTabs,
  defaultTheme,
  type ThemeConfig,
  type ThemeTabType,
  type ColorPreset,
} from './constants';
import { ColorsTab } from './ColorsTab';
import { TypographyTab } from './TypographyTab';
import { ButtonsTab } from './ButtonsTab';
import { AdvancedTab } from './AdvancedTab';

/**
 * Main ThemePanel component
 * Manages tab navigation and delegates to specialized sub-components
 */
export const ThemePanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<ThemeTabType>('colors');

  // Initialize theme config if not present
  const theme: ThemeConfig = config.theme || defaultTheme;

  // Memoized update handler
  const handleUpdate = useCallback(<K extends keyof ThemeConfig>(
    key: K,
    value: ThemeConfig[K]
  ) => {
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        [key]: value,
      },
    });
  }, [config, setConfig]);

  // Apply a color preset
  const applyColorPreset = useCallback((preset: ColorPreset) => {
    setConfig({
      ...config,
      theme: {
        ...config.theme,
        primaryColor: preset.primary,
        secondaryColor: preset.secondary,
        accentColor: preset.accent,
      },
    });
  }, [config, setConfig]);

  // Reset theme to defaults
  const resetTheme = useCallback(() => {
    setConfig({
      ...config,
      theme: defaultTheme,
    });
  }, [config, setConfig]);

  // Render the active tab content
  const renderTabContent = () => {
    const baseProps = {
      theme,
      onUpdate: handleUpdate,
    };

    switch (activeTab) {
      case 'colors':
        return <ColorsTab {...baseProps} onApplyPreset={applyColorPreset} />;
      case 'typography':
        return <TypographyTab {...baseProps} />;
      case 'buttons':
        return <ButtonsTab {...baseProps} />;
      case 'advanced':
        return <AdvancedTab {...baseProps} onResetTheme={resetTheme} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Theme"
        subtitle="Colors, typography, and styles"
      />
      
      <TabNavigation
        tabs={themeTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ThemePanel;
