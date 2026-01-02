/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { defaultConfig } from '../types/config';
import type { SiteConfig } from '../types/config';
import { api } from '../utils/api';

interface ConfigContextType {
  config: SiteConfig;
  setConfig: (config: SiteConfig) => void;
  saveConfig: (configOverride?: SiteConfig) => Promise<void>;
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

// State and Reducer for Config History
interface ConfigState {
  config: SiteConfig;
  history: SiteConfig[];
  historyIndex: number;
}

type ConfigAction = 
  | { type: 'SET_CONFIG'; payload: SiteConfig; skipHistory?: boolean }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET_HISTORY'; payload: SiteConfig };

const configReducer = (state: ConfigState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case 'SET_CONFIG': {
      const newConfig = action.payload;
      // Deep comparison to avoid unnecessary updates
      if (JSON.stringify(newConfig) === JSON.stringify(state.config)) {
        return state;
      }

      if (action.skipHistory) {
        return {
          ...state,
          config: newConfig,
          // If we're at the start, update history too
          history: state.historyIndex === 0 && state.history.length === 1 ? [newConfig] : state.history,
        };
      }

      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(newConfig);
      
      // Limit history to 50 states
      const finalHistory = newHistory.length > 50 ? newHistory.slice(1) : newHistory;
      
      return {
        config: newConfig,
        history: finalHistory,
        historyIndex: finalHistory.length - 1,
      };
    }
    case 'UNDO': {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          config: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    }
    case 'REDO': {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          config: state.history[newIndex],
          historyIndex: newIndex,
        };
      }
      return state;
    }
    case 'RESET_HISTORY': {
      return {
        config: action.payload,
        history: [action.payload],
        historyIndex: 0,
      };
    }
    default:
      return state;
  }
};

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
  const [state, dispatch] = useReducer(configReducer, {
    config: defaultConfig,
    history: [defaultConfig],
    historyIndex: 0,
  });

  const { config, history, historyIndex } = state;
  const [isLoading, setIsLoading] = useState(mode === 'editor' ? false : true);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Undo/Redo functionality
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const resetHistory = useCallback(() => {
    dispatch({ type: 'RESET_HISTORY', payload: config });
  }, [config]);

  // Stable setConfig that doesn't trigger infinite loops
  const setConfig = useCallback((newConfig: SiteConfig, skipHistory = false) => {
    dispatch({ type: 'SET_CONFIG', payload: newConfig, skipHistory });
  }, []);
  
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
    let isMounted = true;

    // In editor mode, we start with default config immediately and load draft in background
    if (mode === 'editor') {
      const fetchDraftConfig = async () => {
        try {
          console.warn(`ConfigContext: Fetching draft config in background...`);
          const data = await api.getConfig('draft');
          if (data && typeof data === 'object' && isMounted) {
            const mergedConfig = deepMerge(defaultConfig as unknown as Record<string, unknown>, data as unknown as Partial<Record<string, unknown>>) as unknown as SiteConfig;
            console.warn(`ConfigContext: Loaded draft config:`, mergedConfig);
            setConfig(mergedConfig, true); // skipHistory = true
          }
        } catch (error) {
          console.warn('ConfigContext: Failed to load draft config, using defaults:', error);
        }
      };
      fetchDraftConfig();
    } else {
      // Public mode: load published config and show loading state
      const fetchConfig = async () => {
        try {
          console.warn(`ConfigContext: Fetching published config...`);
          const data = await api.getConfig('published');
          if (data && typeof data === 'object' && isMounted) {
            const mergedConfig = deepMerge(defaultConfig as unknown as Record<string, unknown>, data as unknown as Partial<Record<string, unknown>>) as unknown as SiteConfig;
            setConfig(mergedConfig, true);
          }
        } catch (error) {
          console.error('Failed to load published config', error);
        } finally {
          if (isMounted) setIsLoading(false);
        }
      };
      fetchConfig();
    }

    return () => {
      isMounted = false;
    };
  }, [mode, setConfig]);

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
  }, [scheduleSave, setConfig]);

  const saveConfig = useCallback(async (configOverride?: SiteConfig) => {
    if (mode !== 'editor') return;
    
    // Cancel pending auto-save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    const configToSave = configOverride ?? configRef.current;
    // Keep the ref in sync to avoid saving stale state in follow-up calls.
    configRef.current = configToSave;

    setIsSaving(true);
    try {
      await api.saveConfig(configToSave);
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
