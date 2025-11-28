/**
 * useConfigSection - Custom hook for managing config section state
 * DRY principle - Reusable config update logic across all panels
 * 
 * @param sectionKey - The key of the config section to manage (e.g., 'hero', 'header')
 */

import { useCallback, useMemo } from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import type { SiteConfig } from '../../../../types/config';

type ConfigSectionKey = keyof SiteConfig;

export function useConfigSection<K extends ConfigSectionKey>(sectionKey: K) {
  const { config, setConfig } = useConfig();
  
  // Get the current section config
  const sectionConfig = useMemo(() => config[sectionKey], [config, sectionKey]);
  
  // Generic update handler for the section
  const updateSection = useCallback(<T extends keyof SiteConfig[K]>(
    key: T,
    value: SiteConfig[K][T]
  ) => {
    setConfig({
      ...config,
      [sectionKey]: {
        ...config[sectionKey],
        [key]: value,
      },
    });
  }, [config, setConfig, sectionKey]);
  
  // Batch update handler for multiple properties
  const updateSectionBatch = useCallback((
    updates: Partial<SiteConfig[K]>
  ) => {
    setConfig({
      ...config,
      [sectionKey]: {
        ...config[sectionKey],
        ...updates,
      },
    });
  }, [config, setConfig, sectionKey]);
  
  // Reset section to default values
  const resetSection = useCallback((defaultValues: SiteConfig[K]) => {
    setConfig({
      ...config,
      [sectionKey]: defaultValues,
    });
  }, [config, setConfig, sectionKey]);
  
  return {
    config: sectionConfig,
    fullConfig: config,
    updateSection,
    updateSectionBatch,
    resetSection,
    setFullConfig: setConfig,
  };
}

export default useConfigSection;
