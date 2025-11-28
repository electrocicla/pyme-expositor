/**
 * useNestedConfig - Custom hook for managing nested config objects
 * Useful for mobile configs, effects sub-objects, etc.
 */

import { useCallback } from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import type { SiteConfig } from '../../../../types/config';

type ConfigSectionKey = keyof SiteConfig;

export function useNestedConfig<
  K extends ConfigSectionKey,
  N extends keyof NonNullable<SiteConfig[K]>
>(
  sectionKey: K,
  nestedKey: N
) {
  const { config, setConfig } = useConfig();
  
  const sectionConfig = config[sectionKey] as Record<string, unknown>;
  const nestedConfig = (sectionConfig?.[nestedKey as string] || {}) as Record<string, unknown>;
  
  const updateNested = useCallback(<T extends string>(
    key: T,
    value: unknown
  ) => {
    setConfig({
      ...config,
      [sectionKey]: {
        ...config[sectionKey],
        [nestedKey]: {
          ...nestedConfig,
          [key]: value,
        },
      },
    });
  }, [config, setConfig, sectionKey, nestedKey, nestedConfig]);
  
  const updateNestedBatch = useCallback((updates: Record<string, unknown>) => {
    setConfig({
      ...config,
      [sectionKey]: {
        ...config[sectionKey],
        [nestedKey]: {
          ...nestedConfig,
          ...updates,
        },
      },
    });
  }, [config, setConfig, sectionKey, nestedKey, nestedConfig]);
  
  return {
    nestedConfig,
    updateNested,
    updateNestedBatch,
  };
}

export default useNestedConfig;
