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
  // Undo/Redo functionality
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
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
  // Custom undo/redo state management
  const [config, setConfigState] = useState<SiteConfig>(defaultConfig);
  const [history, setHistory] = useState<SiteConfig[]>([defaultConfig]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(mode === 'editor' ? false : true); // Editor starts with default config immediately
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Undo/Redo functionality
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setConfigState(history[newIndex]);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setConfigState(history[newIndex]);
    }
  }, [canRedo, historyIndex, history]);

  const resetHistory = useCallback(() => {
    setHistory([config]);
    setHistoryIndex(0);
  }, [config]);

  // Enhanced setConfig with history tracking
  const setConfig = useCallback((newConfig: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
    setConfigState(currentConfig => {
      const resolvedConfig = typeof newConfig === 'function' ? newConfig(currentConfig) : newConfig;

      // Only add to history if the config actually changed
      if (JSON.stringify(resolvedConfig) !== JSON.stringify(currentConfig)) {
        setHistory(prevHistory => {
          // Remove any history after current index (for when we're not at the end)
          const newHistory = prevHistory.slice(0, historyIndex + 1);
          // Add the new state
          newHistory.push(resolvedConfig);
          // Limit history to 50 states to prevent memory issues
          if (newHistory.length > 50) {
            newHistory.shift();
            setHistoryIndex(newHistory.length - 1);
          } else {
            setHistoryIndex(newHistory.length - 1);
          }
          return newHistory;
        });
      }

      return resolvedConfig;
    });
  }, [historyIndex]);
  
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
    // In editor mode, we start with default config immediately and load draft in background
    if (mode === 'editor') {
      const fetchDraftConfig = async () => {
        try {
          console.warn(`ConfigContext: Fetching draft config in background...`);
          const data = await api.getConfig('draft');
          if (data && typeof data === 'object') {
            const mergedConfig = deepMerge(defaultConfig as unknown as Record<string, unknown>, data as unknown as Partial<Record<string, unknown>>) as unknown as SiteConfig;
            console.warn(`ConfigContext: Loaded draft config:`, mergedConfig);
            setConfig(mergedConfig);
          }
        } catch (error) {
          console.warn('ConfigContext: Failed to load draft config, using defaults:', error);
          // Keep using defaultConfig on error
        }
      };
      fetchDraftConfig();
      return;
    }

    // Public mode: load published config and show loading state
    const fetchConfig = async () => {
      try {
        console.warn(`ConfigContext: Fetching published config...`);
        const data = await api.getConfig('published');
        console.warn(`ConfigContext: Raw published config from API:`, data);
        // Always merge with defaultConfig to ensure all properties exist
        if (data && typeof data === 'object') {
          const mergedConfig = deepMerge(defaultConfig as unknown as Record<string, unknown>, data as unknown as Partial<Record<string, unknown>>) as unknown as SiteConfig;
          console.warn(`ConfigContext: Merged config:`, mergedConfig);
          setConfig(mergedConfig);
        }
      } catch (error) {
        console.error('Failed to load published config', error);
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
      canUndo,
      canRedo,
      undo,
      redo,
      resetHistory,
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
