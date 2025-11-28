/**
 * PresetButton - Reusable button for applying presets
 * Single Responsibility: Display and apply preset configurations
 */

import type { ReactNode } from 'react';

interface PresetButtonProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  colors?: {
    from: string;
    to: string;
    border: string;
    text: string;
  };
  className?: string;
}

export const PresetButton: React.FC<PresetButtonProps> = ({
  label,
  icon,
  onClick,
  colors = {
    from: 'from-slate-600/20',
    to: 'to-slate-700/20',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
  },
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 bg-linear-to-br ${colors.from} ${colors.to} border ${colors.border} rounded-lg text-xs ${colors.text} hover:opacity-90 transition-all duration-200 flex items-center gap-1.5 ${className}`}
  >
    {icon}
    {label}
  </button>
);

export default PresetButton;
