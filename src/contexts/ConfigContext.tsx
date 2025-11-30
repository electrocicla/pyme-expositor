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
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else if (source[key] !== undefined) {
      result[key] = source[key];
    }
  }
  return result;
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
        console.log(`ConfigContext: Fetching ${key} config...`);
        const data = await api.getConfig(key);
        console.log(`ConfigContext: Raw ${key} config from API:`, data);
        console.log(`ConfigContext: Effects from API:`, data?.effects);
        // Always merge with defaultConfig to ensure all properties exist
        if (data && typeof data === 'object') {
          const mergedConfig = deepMerge(defaultConfig, data);
          console.log(`ConfigContext: Merged config effects:`, mergedConfig.effects);
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
    console.log('ConfigContext: setConfig called');
    console.log('ConfigContext: sections update:', newConfig.sections);
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
    
    console.log('ConfigContext: Publishing config...');
    console.log('ConfigContext: Current config effects:', configRef.current.effects);
    
    try {
      await api.publishConfig();
      console.log('ConfigContext: Publish successful');
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
