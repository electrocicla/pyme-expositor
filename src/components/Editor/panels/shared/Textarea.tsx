/**
 * Textarea - Reusable textarea component
 * Single Responsibility: Handle multiline text input
 */

import type { BaseInputProps } from './types';
import { inputBaseClasses } from './constants';

interface TextareaProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  resize?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  description,
  value,
  onChange,
  placeholder,
  rows = 3,
  resize = false,
  disabled = false,
  className = '',
  error,
}) => {
  const textareaId = label ? `textarea-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`${inputBaseClasses} ${resize ? '' : 'resize-none'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${error ? 'border-red-500' : ''}`}
      />
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
};

export default Textarea;
