/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { defaultConfig } from '../types/config';
import type { SiteConfig } from '../types/config';
import { api } from '../utils/api';

interface ConfigContextType {
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  saveConfig: () => Promise<void>;
  publishConfig: () => Promise<void>;
  isLoading: boolean;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

// Deep merge function to combine defaultConfig with loaded config
const isPlainObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object' && !Array.isArray(v);

const deepMerge = <T extends Record<string, unknown>>(target: T, source: Partial<T>): T => {
  const result: Record<string, unknown> = { ...target } as Record<string, unknown>;
  for (const key of Object.keys(source) as Array<keyof T>) {
    const srcVal = source[key];
    if (isPlainObject(srcVal) && isPlainObject(result[key as string])) {
      result[key as string] = deepMerge(result[key as string] as Record<string, unknown>, srcVal as Record<string, unknown>);
    } else if (srcVal !== undefined) {
      result[key as string] = srcVal;
    }
  }
  return result as T;
};

export const ConfigProvider: React.FC<{ children: React.ReactNode; mode: 'public' | 'editor' }> = ({ children, mode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Refs for stable references
  const configRef = useRef(config);
  const isDirtyRef = useRef(isDirty);
  const isSavingRef = useRef(isSaving);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs up to date
  useEffect(() => {
    configRef.current = config;
  }, [config]);
  
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);
  
  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  // Load config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const key = mode === 'editor' ? 'draft' : 'published';
        console.warn(`ConfigContext: Fetching ${key} config...`);
        const data = await api.getConfig(key);
        console.warn(`ConfigContext: Raw ${key} config from API:`, data);
        console.warn(`ConfigContext: Effects from API:`, data && typeof data === 'object' ? (data as Record<string, unknown>).effects : undefined);
        // Always merge with defaultConfig to ensure all properties exist
        if (data && typeof data === 'object') {
          const mergedConfig = deepMerge(defaultConfig as unknown as Record<string, unknown>, data as unknown as Partial<Record<string, unknown>>) as unknown as SiteConfig;
          console.warn(`ConfigContext: Merged config effects:`, mergedConfig.effects);
          setConfig(mergedConfig);
        }
      } catch (error) {
        console.error('Failed to load config', error);
        // Keep using defaultConfig on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, [mode]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Debounced save function - uses refs to avoid dependency issues
  const scheduleSave = useCallback(() => {
    if (mode !== 'editor') return;
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Schedule new save after 3 seconds
    saveTimeoutRef.current = setTimeout(async () => {
        // Check refs at execution time
      if (!isDirtyRef.current || isSavingRef.current) return;
      
      setIsSaving(true);
        try {
          await api.saveConfig(configRef.current);
          setIsDirty(false);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setIsSaving(false);
        }
    }, 3000);
  }, [mode]);

  const handleSetConfig = useCallback((newConfig: SiteConfig) => {
    setConfig(newConfig);
    setIsDirty(true);
    scheduleSave();
  }, [scheduleSave]);

  const saveConfig = useCallback(async () => {
    if (mode !== 'editor') return;
    
    // Cancel pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    setIsSaving(true);
    try {
      await api.saveConfig(configRef.current);
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save config', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [mode]);

  const publishConfig = useCallback(async () => {
    if (mode !== 'editor') return;
    
    // Save first if dirty
    if (isDirtyRef.current) {
      await saveConfig();
    }
    
    console.warn('ConfigContext: Publishing config...');
    console.warn('ConfigContext: Current config effects:', configRef.current?.effects);
    
    try {
      await api.publishConfig();
      console.warn('ConfigContext: Publish successful');
    } catch (error) {
      console.error('Failed to publish config', error);
      throw error;
    }
  }, [mode, saveConfig]);

  return (
    <ConfigContext.Provider value={{ 
      config, 
      setConfig: handleSetConfig, 
      saveConfig, 
      publishConfig, 
      isLoading, 
      isDirty,
      isSaving,
      lastSaved,
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
