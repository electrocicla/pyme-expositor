/**
 * Select - Reusable select dropdown component
 * Single Responsibility: Handle selection from predefined options
 */

import type { BaseInputProps, SelectOption } from './types';
import { selectBaseClasses, selectArrowSvg } from './constants';

interface SelectProps<T extends string = string> extends BaseInputProps {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
}

export function Select<T extends string = string>({
  label,
  description,
  value,
  onChange,
  options,
  disabled = false,
  className = '',
  error,
}: SelectProps<T>): React.ReactElement {
  const selectId = label ? `select-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        className={`${selectBaseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-500' : ''}`}
        style={{
          backgroundImage: selectArrowSvg,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '16px',
        }}
      >
        {options.map((opt) => (
          <option 
            key={String(opt.value)} 
            value={opt.value} 
            disabled={opt.disabled}
            className="bg-slate-800"
          >
            {opt.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}

export default Select;
