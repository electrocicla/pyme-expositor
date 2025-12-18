/**
 * ColorPicker - Reusable color selection component
 * Single Responsibility: Handle color selection with presets
 */

import type { BaseInputProps } from './types';
import { quickColorPresets } from './constants';

interface ColorPickerProps extends BaseInputProps {
  value: string;
  onChange: (value: string) => void;
  presets?: string[];
  showPresets?: boolean;
  showInput?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  description,
  value,
  onChange,
  presets = quickColorPresets,
  showPresets = true,
  showInput = true,
  disabled = false,
  className = '',
}) => {
  const colorInputId = label ? `color-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={colorInputId} className="block text-xs font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="flex gap-2">
        <input
          id={colorInputId}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`h-9 w-12 rounded-lg cursor-pointer border border-slate-700/50 bg-slate-800/50 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        {showInput && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        )}
      </div>
      {showPresets && (
        <div className="flex gap-1.5 mt-2">
          {presets.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => !disabled && onChange(color)}
              disabled={disabled}
              className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                value === color
                  ? 'border-white scale-110'
                  : 'border-transparent hover:scale-105'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      )}
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default ColorPicker;
