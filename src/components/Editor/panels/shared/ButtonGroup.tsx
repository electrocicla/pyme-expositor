/**
 * ButtonGroup - Reusable button group for single/multi selection
 * Single Responsibility: Handle selection from visual button options
 */

import type { ReactNode } from 'react';
import { buttonGroupActiveClasses, buttonGroupInactiveClasses, gridColsClasses, gapClasses } from './constants';

interface ButtonGroupOption<T> {
  value: T;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface ButtonGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: ButtonGroupOption<T>[];
  label?: string;
  columns?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
  /** If true, clicking the selected option will deselect it (set to defaultValue or 'none') */
  allowDeselect?: boolean;
  /** Value to set when deselecting (defaults to 'none') */
  defaultValue?: T;
}

export function ButtonGroup<T extends string>({
  value,
  onChange,
  options,
  label,
  columns = 3,
  gap = 'sm',
  size = 'md',
  showLabels = true,
  disabled = false,
  className = '',
  allowDeselect = false,
  defaultValue,
}: ButtonGroupProps<T>): React.ReactElement {
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className={`grid ${gridColsClasses[columns] || 'grid-cols-3'} ${gapClasses[gap] || 'gap-2'}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          const handleClick = () => {
            if (disabled) return;
            if (allowDeselect && isSelected && option.value !== (defaultValue ?? 'none' as T)) {
              // Deselect: set to default value
              onChange((defaultValue ?? 'none') as T);
            } else {
              onChange(option.value);
            }
          };
          
          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={handleClick}
              disabled={disabled}
              className={`${sizeClasses[size]} rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                isSelected
                  ? buttonGroupActiveClasses
                  : buttonGroupInactiveClasses
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={option.description}
            >
            {option.icon && (
              <div className={`${showLabels ? 'mb-1' : ''} text-current`}>
                {option.icon}
              </div>
            )}
            {showLabels && (
              <div className={`${textSizeClasses[size]} text-current capitalize`}>
                {option.label}
              </div>
            )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ButtonGroup;
