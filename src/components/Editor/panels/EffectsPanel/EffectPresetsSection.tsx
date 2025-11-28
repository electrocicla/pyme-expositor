/**
 * EffectPresetsSection Component
 * Single Responsibility: Display and apply effect presets
 */

import React from 'react';
import { Sparkles, Target, Star, Gamepad2 } from 'lucide-react';
import type { EffectsConfig } from '../../../../types/config';
import { effectPresets } from './constants';

interface EffectPresetsSectionProps {
  onApplyPreset: (config: EffectsConfig) => void;
}

// Map icon names to components
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Target,
  Star,
  Gamepad2,
};

export const EffectPresetsSection: React.FC<EffectPresetsSectionProps> = ({ onApplyPreset }) => {
  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Presets</h3>
      <div className="grid grid-cols-2 gap-2">
        {effectPresets.map((preset) => {
          const IconComponent = iconMap[preset.icon];
          return (
            <button
              key={preset.id}
              onClick={() => onApplyPreset(preset.config)}
              className={`px-3 py-2 bg-linear-to-br ${preset.colors.from} ${preset.colors.to} border ${preset.colors.border} rounded-lg text-xs ${preset.colors.text} hover:opacity-80 transition-all duration-200 flex items-center gap-1.5`}
            >
              {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EffectPresetsSection;
