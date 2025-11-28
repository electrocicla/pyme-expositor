/**
 * useTabNavigation - Custom hook for tab navigation state
 * DRY principle - Reusable tab state logic across all panels
 */

import { useState, useCallback } from 'react';

export function useTabNavigation<T extends string>(initialTab: T) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);
  
  const changeTab = useCallback((tab: T) => {
    setActiveTab(tab);
  }, []);
  
  const isActive = useCallback((tab: T) => activeTab === tab, [activeTab]);
  
  return {
    activeTab,
    setActiveTab,
    changeTab,
    isActive,
  };
}

export default useTabNavigation;
