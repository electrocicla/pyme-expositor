/**
 * CollapsiblePanel - Reusable collapsible section component
 * Provides smooth expand/collapse animations with accessible controls
 * Follows Tailwind best practices for smooth transitions
 */

import React, { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsiblePanelProps {
  /** Title/header text for the collapsible panel */
  title: string;
  /** Content to display when expanded */
  children: ReactNode;
  /** Whether the panel should be open by default */
  defaultOpen?: boolean;
  /** Optional icon to display alongside title */
  icon?: ReactNode;
  /** Optional description text */
  description?: string;
  /** Optional custom class for the container */
  className?: string;
  /** Callback when collapsed/expanded state changes */
  onChange?: (isOpen: boolean) => void;
  /** Optional badge or status indicator */
  badge?: ReactNode;
  /** Whether to show a divider line */
  showDivider?: boolean;
  /** Color scheme for the panel */
  colorScheme?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const colorSchemes = {
  default: {
    header: 'hover:bg-slate-700/50',
    content: 'bg-slate-800/30',
    border: 'border-white/10',
    text: 'text-slate-100',
    accent: 'text-slate-400',
  },
  primary: {
    header: 'hover:bg-blue-600/20',
    content: 'bg-blue-500/5',
    border: 'border-blue-500/20',
    text: 'text-slate-100',
    accent: 'text-blue-400',
  },
  success: {
    header: 'hover:bg-emerald-600/20',
    content: 'bg-emerald-500/5',
    border: 'border-emerald-500/20',
    text: 'text-slate-100',
    accent: 'text-emerald-400',
  },
  warning: {
    header: 'hover:bg-amber-600/20',
    content: 'bg-amber-500/5',
    border: 'border-amber-500/20',
    text: 'text-slate-100',
    accent: 'text-amber-400',
  },
  danger: {
    header: 'hover:bg-red-600/20',
    content: 'bg-red-500/5',
    border: 'border-red-500/20',
    text: 'text-slate-100',
    accent: 'text-red-400',
  },
};

export const CollapsiblePanel: React.FC<CollapsiblePanelProps> = ({
  title,
  children,
  defaultOpen = true,
  icon,
  description,
  className = '',
  onChange,
  badge,
  showDivider = true,
  colorScheme = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const scheme = colorSchemes[colorScheme];

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onChange?.(newState);
  };

  return (
    <div className={`border rounded-lg transition-all duration-300 ${scheme.border} ${className}`}>
      {/* Header */}
      <button
        onClick={handleToggle}
        className={`w-full px-4 py-3.5 flex items-center justify-between text-left transition-all duration-200 ${scheme.header} group`}
        aria-expanded={isOpen}
      >
        {/* Left side - Icon and Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className="shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-sm ${scheme.text} truncate`}>
              {title}
            </h3>
            {description && (
              <p className={`text-xs ${scheme.accent} mt-0.5 line-clamp-1`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right side - Badge and Chevron */}
        <div className="flex items-center gap-2 ml-2 shrink-0">
          {badge && (
            <div className={`text-xs font-medium ${scheme.accent}`}>
              {badge}
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 ${scheme.accent} transition-transform duration-300 ease-out ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </div>
      </button>

      {/* Divider */}
      {showDivider && isOpen && (
        <div className={`h-px bg-linear-to-r from-${scheme.border.split('-')[1]}/0 to-${scheme.border.split('-')[1]}/0`} />
      )}

      {/* Content Container with smooth collapse animation */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`${scheme.content} p-4 space-y-3`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapsiblePanel;
