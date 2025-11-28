/**
 * NumberInput - Reusable number input with min/max
 * Single Responsibility: Handle numeric input with constraints
 */

import type { BaseInputProps } from './types';
import { inputBaseClasses } from './constants';

interface NumberInputProps extends BaseInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  placeholder,
  disabled = false,
  className = '',
  error,
}) => (
  <div className={className}>
    {label && (
      <label className="block text-xs font-medium text-slate-300 mb-1.5">
        {label}
      </label>
    )}
    <input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      min={min}
      max={max}
      step={step}
      placeholder={placeholder}
      disabled={disabled}
      className={`${inputBaseClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-500' : ''}`}
    />
    {description && (
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    )}
    {error && (
      <p className="text-xs text-red-400 mt-1">{error}</p>
    )}
  </div>
);

export default NumberInput;
