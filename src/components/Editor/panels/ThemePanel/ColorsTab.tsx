/**
 * ColorsTab Component
 * Single Responsibility: Manage theme color settings
 */

import React from 'react';
import type { ThemeConfig } from './constants';
import { Toggle, ColorPicker, SectionHeader, Section } from '../shared';
import { colorPresets, type ColorPreset } from './constants';

interface ColorsTabProps {
  theme: ThemeConfig;
  onUpdate: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
  onApplyPreset: (preset: ColorPreset) => void;
}

export const ColorsTab: React.FC<ColorsTabProps> = ({ theme, onUpdate, onApplyPreset }) => {
  return (
    <div className="space-y-6">
      {/* Dark Mode Toggle */}
      <Section>
        <Toggle
          label="Dark Mode"
          checked={theme.mode === 'dark'}
          onChange={(checked) => onUpdate('mode', checked ? 'dark' : 'light')}
        />
      </Section>

      {/* Color Presets */}
      <Section>
        <SectionHeader
          title="Color Presets"
          description="Quick color schemes"
        />
        <div className="grid grid-cols-4 gap-2">
          {colorPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onApplyPreset(preset)}
              title={preset.name}
              className="group relative h-10 rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all"
            >
              <div className="absolute inset-0 flex">
                <div className="flex-1" style={{ backgroundColor: preset.primary }} />
                <div className="flex-1" style={{ backgroundColor: preset.secondary }} />
                <div className="flex-1" style={{ backgroundColor: preset.accent }} />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </Section>

      {/* Primary Color */}
      <Section>
        <SectionHeader
          title="Primary Color"
          description="Main brand color"
        />
        <ColorPicker
          value={theme.primaryColor || '#3b82f6'}
          onChange={(value) => onUpdate('primaryColor', value)}
        />
      </Section>

      {/* Secondary Color */}
      <Section>
        <SectionHeader
          title="Secondary Color"
          description="Background & accents"
        />
        <ColorPicker
          value={theme.secondaryColor || '#1e293b'}
          onChange={(value) => onUpdate('secondaryColor', value)}
        />
      </Section>

      {/* Accent Color */}
      <Section>
        <SectionHeader
          title="Accent Color"
          description="Highlights & CTAs"
        />
        <ColorPicker
          value={theme.accentColor || '#f59e0b'}
          onChange={(value) => onUpdate('accentColor', value)}
        />
      </Section>

      {/* Color Preview */}
      <Section>
        <SectionHeader
          title="Preview"
          description="See your colors in action"
        />
        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.secondaryColor || '#1e293b' }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: theme.primaryColor }}>
            Primary Heading
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            This is body text on your secondary background color.
          </p>
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: theme.accentColor || '#f59e0b' }}
          >
            Accent Button
          </button>
        </div>
      </Section>
    </div>
  );
};

export default ColorsTab;
