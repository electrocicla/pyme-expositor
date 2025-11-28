/**
 * TabNavigation - Reusable tab navigation component
 * Single Responsibility: Handle tab-based navigation
 */

import type { ReactNode } from 'react';
import { tabActiveClasses, tabInactiveClasses } from './constants';

interface TabConfig<T extends string> {
  id: T;
  label: string;
  icon?: ReactNode;
}

interface TabNavigationProps<T extends string> {
  tabs: TabConfig<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  variant?: 'default' | 'pills' | 'underline';
  showLabels?: boolean;
  className?: string;
}

export function TabNavigation<T extends string>({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  showLabels = true,
  className = '',
}: TabNavigationProps<T>): React.ReactElement {
  const containerClasses = {
    default: 'flex flex-wrap gap-1 p-1 bg-white/5 rounded-lg',
    pills: 'flex flex-wrap gap-2',
    underline: 'flex border-b border-white/10',
  };

  const getTabClasses = (isActive: boolean) => {
    const base = 'flex items-center justify-center gap-1.5 transition-all duration-200';
    
    switch (variant) {
      case 'pills':
        return `${base} px-4 py-2 rounded-full text-sm ${
          isActive
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
        }`;
      case 'underline':
        return `${base} px-4 py-3 text-sm border-b-2 -mb-px ${
          isActive
            ? 'border-blue-500 text-blue-300'
            : 'border-transparent text-white/60 hover:text-white/80 hover:border-white/30'
        }`;
      default:
        return `${base} flex-1 min-w-fit px-3 py-2 text-sm rounded-md ${
          isActive ? tabActiveClasses : tabInactiveClasses
        }`;
    }
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={getTabClasses(activeTab === tab.id)}
        >
          {tab.icon}
          {showLabels && (
            <span className={variant === 'default' ? 'hidden sm:inline' : ''}>
              {tab.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default TabNavigation;
