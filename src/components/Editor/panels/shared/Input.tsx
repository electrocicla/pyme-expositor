/**
 * Input - Reusable text input component
 * Single Responsibility: Handle text input with consistent styling
 */

import type { BaseInputProps } from './types';
import { inputBaseClasses } from './constants';

interface InputProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url' | 'tel' | 'number';
  min?: number;
  max?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  description,
  value,
  onChange,
  placeholder,
  type = 'text',
  min,
  max,
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
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
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

export default Input;
