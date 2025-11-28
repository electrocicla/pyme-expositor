/**
 * Slider - Reusable range slider component
 * Single Responsibility: Handle numeric range selection
 */

import type { BaseInputProps } from './types';

interface SliderProps extends BaseInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  accentColor?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  description,
  value,
  onChange,
  min,
  max,
  step = 1,
  showValue = true,
  formatValue,
  accentColor = 'blue',
  disabled = false,
  className = '',
}) => {
  const displayValue = formatValue ? formatValue(value) : value;

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-slate-300 mb-1.5">
          {label}
          {showValue && (
            <span className="float-right text-slate-400">{displayValue}</span>
          )}
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${accentColor}-500 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default Slider;
