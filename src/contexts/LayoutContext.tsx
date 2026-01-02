/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type {
  LayoutTemplateType,
  CustomLayout,
  LayoutElementInstance,
  LayoutEditorState,
  LayoutElementType,
  LayoutPosition,
} from '../types/layout';
import { getDefaultTemplate } from '../components/Editor/Layout/LayoutTemplates';

interface LayoutContextType extends LayoutEditorState {
  // Template operations
  selectTemplate: (templateId: LayoutTemplateType) => void;
  
  // Element operations
  addElement: (elementType: LayoutElementType, areaId: string, position: LayoutPosition) => void;
  removeElement: (instanceId: string) => void;
  moveElement: (instanceId: string, areaId: string, position: LayoutPosition) => void;
  resizeElement: (instanceId: string, position: LayoutPosition) => void;
  selectElement: (instanceId: string | null) => void;
  updateElementSettings: (instanceId: string, settings: Record<string, unknown>) => void;
  toggleElementLock: (instanceId: string) => void;
  
  // Layout operations
  saveLayout: (name: string) => Promise<void>;
  loadLayout: (layoutId: string) => void;
  deleteLayout: (layoutId: string) => void;
  resetLayout: () => void;
  duplicateLayout: (layoutId: string) => void;
  
  // Grid operations
  toggleGrid: () => void;
  toggleGridSnap: () => void;
  setGridSize: (size: number) => void;
  
  // Mode operations
  setMode: (mode: 'edit' | 'preview') => void;
  
  // History operations (for undo/redo)
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<LayoutEditorState>(() => {
    const defaultTemplate = getDefaultTemplate();
    return {
      activeTemplate: defaultTemplate.id,
      currentLayout: null,
      savedLayouts: [],
      grid: {
        enabled: true,
        size: 20,
        snap: true,
        visible: false,
        color: 'rgba(255, 255, 255, 0.1)',
      },
      selectedElement: null,
      mode: 'edit',
    };
  });

  // History management
  const [history, setHistory] = useState<CustomLayout[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((layout: CustomLayout) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(layout);
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Template operations
  const selectTemplate = useCallback((templateId: LayoutTemplateType) => {
    setState(prev => ({
      ...prev,
      activeTemplate: templateId,
      currentLayout: prev.currentLayout ? {
        ...prev.currentLayout,
        template: templateId,
        elements: [], // Clear elements when changing template
        updatedAt: new Date(),
      } : null,
    }));
  }, []);

  // Element operations
  const addElement = useCallback((
    elementType: LayoutElementType,
    areaId: string,
    position: LayoutPosition
  ) => {
    setState(prev => {
      const newInstance: LayoutElementInstance = {
        id: `${elementType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        elementType,
        areaId,
        position,
        settings: {},
        locked: false,
      };

      const currentLayout = prev.currentLayout;
      const elements = currentLayout ? [...currentLayout.elements, newInstance] : [newInstance];
      
      const updatedLayout: CustomLayout = currentLayout ? {
        ...currentLayout,
        elements,
        updatedAt: new Date(),
      } : {
        id: `layout-${Date.now()}`,
        name: 'Untitled Layout',
        template: prev.activeTemplate,
        elements,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addToHistory(updatedLayout);

      return {
        ...prev,
        currentLayout: updatedLayout,
      };
    });
  }, [addToHistory]);

  const removeElement = useCallback((instanceId: string) => {
    setState(prev => {
      if (!prev.currentLayout) return prev;

      const elements = prev.currentLayout.elements.filter(el => el.id !== instanceId);
      const updatedLayout: CustomLayout = {
        ...prev.currentLayout,
        elements,
        updatedAt: new Date(),
      };

      addToHistory(updatedLayout);

      return {
        ...prev,
        currentLayout: updatedLayout,
        selectedElement: prev.selectedElement === instanceId ? null : prev.selectedElement,
      };
    });
  }, [addToHistory]);

  const moveElement = useCallback((
    instanceId: string,
    areaId: string,
    position: LayoutPosition
  ) => {
    setState(prev => {
      if (!prev.currentLayout) return prev;

      const elements = prev.currentLayout.elements.map(el =>
        el.id === instanceId ? { ...el, areaId, position } : el
      );

      const updatedLayout: CustomLayout = {
        ...prev.currentLayout,
        elements,
        updatedAt: new Date(),
      };

      addToHistory(updatedLayout);

      return {
        ...prev,
        currentLayout: updatedLayout,
      };
    });
  }, [addToHistory]);

  const resizeElement = useCallback((instanceId: string, position: LayoutPosition) => {
    setState(prev => {
      if (!prev.currentLayout) return prev;

      const elements = prev.currentLayout.elements.map(el =>
        el.id === instanceId ? { ...el, position } : el
      );

      const updatedLayout: CustomLayout = {
        ...prev.currentLayout,
        elements,
        updatedAt: new Date(),
      };

      return {
        ...prev,
        currentLayout: updatedLayout,
      };
    });
  }, []);

  const selectElement = useCallback((instanceId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedElement: instanceId,
    }));
  }, []);

  const updateElementSettings = useCallback((
    instanceId: string,
    settings: Record<string, unknown>
  ) => {
    setState(prev => {
      if (!prev.currentLayout) return prev;

      const elements = prev.currentLayout.elements.map(el =>
        el.id === instanceId ? { ...el, settings: { ...el.settings, ...settings } } : el
      );

      const updatedLayout: CustomLayout = {
        ...prev.currentLayout,
        elements,
        updatedAt: new Date(),
      };

      return {
        ...prev,
        currentLayout: updatedLayout,
      };
    });
  }, []);

  const toggleElementLock = useCallback((instanceId: string) => {
    setState(prev => {
      if (!prev.currentLayout) return prev;

      const elements = prev.currentLayout.elements.map(el =>
        el.id === instanceId ? { ...el, locked: !el.locked } : el
      );

      const updatedLayout: CustomLayout = {
        ...prev.currentLayout,
        elements,
        updatedAt: new Date(),
      };

      return {
        ...prev,
        currentLayout: updatedLayout,
      };
    });
  }, []);

  // Layout operations
  const saveLayout = useCallback(async (name: string) => {
    if (!state.currentLayout) return;

    const layoutToSave: CustomLayout = {
      ...state.currentLayout,
      name,
      updatedAt: new Date(),
    };

    // TODO: Integrate with API service
    setState(prev => ({
      ...prev,
      savedLayouts: [...prev.savedLayouts, layoutToSave],
      currentLayout: layoutToSave,
    }));
  }, [state.currentLayout]);

  const loadLayout = useCallback((layoutId: string) => {
    setState(prev => {
      const layout = prev.savedLayouts.find(l => l.id === layoutId);
      if (!layout) return prev;

      return {
        ...prev,
        currentLayout: layout,
        activeTemplate: layout.template,
      };
    });
  }, []);

  const deleteLayout = useCallback((layoutId: string) => {
    setState(prev => ({
      ...prev,
      savedLayouts: prev.savedLayouts.filter(l => l.id !== layoutId),
      currentLayout: prev.currentLayout?.id === layoutId ? null : prev.currentLayout,
    }));
  }, []);

  const resetLayout = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentLayout: null,
      selectedElement: null,
    }));
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const duplicateLayout = useCallback((layoutId: string) => {
    setState(prev => {
      const layout = prev.savedLayouts.find(l => l.id === layoutId);
      if (!layout) return prev;

      const duplicated: CustomLayout = {
        ...layout,
        id: `layout-${Date.now()}`,
        name: `${layout.name} (Copy)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return {
        ...prev,
        savedLayouts: [...prev.savedLayouts, duplicated],
      };
    });
  }, []);

  // Grid operations
  const toggleGrid = useCallback(() => {
    setState(prev => ({
      ...prev,
      grid: { ...prev.grid, visible: !prev.grid.visible },
    }));
  }, []);

  const toggleGridSnap = useCallback(() => {
    setState(prev => ({
      ...prev,
      grid: { ...prev.grid, snap: !prev.grid.snap },
    }));
  }, []);

  const setGridSize = useCallback((size: number) => {
    setState(prev => ({
      ...prev,
      grid: { ...prev.grid, size },
    }));
  }, []);

  // Mode operations
  const setMode = useCallback((mode: 'edit' | 'preview') => {
    setState(prev => ({
      ...prev,
      mode,
    }));
  }, []);

  // History operations
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setState(prev => ({
        ...prev,
        currentLayout: history[historyIndex - 1],
      }));
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setState(prev => ({
        ...prev,
        currentLayout: history[historyIndex + 1],
      }));
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <LayoutContext.Provider
      value={{
        ...state,
        selectTemplate,
        addElement,
        removeElement,
        moveElement,
        resizeElement,
        selectElement,
        updateElementSettings,
        toggleElementLock,
        saveLayout,
        loadLayout,
        deleteLayout,
        resetLayout,
        duplicateLayout,
        toggleGrid,
        toggleGridSnap,
        setGridSize,
        setMode,
        canUndo,
        canRedo,
        undo,
        redo,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
