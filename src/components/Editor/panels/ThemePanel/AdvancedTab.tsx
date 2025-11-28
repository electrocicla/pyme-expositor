/**
 * AdvancedTab Component
 * Single Responsibility: Manage advanced theme settings
 */

import React from 'react';
import type { ThemeConfig } from './constants';
import { Input, SectionHeader, Section } from '../shared';
import { shadowIntensityOptions } from './constants';

interface AdvancedTabProps {
  theme: ThemeConfig;
  onUpdate: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
  onResetTheme: () => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ theme, onUpdate, onResetTheme }) => {
  return (
    <div className="space-y-6">
      {/* Global Border Radius */}
      <Section>
        <SectionHeader
          title="Global Border Radius"
          description="Default rounding for elements"
        />
        <Input
          value={theme.borderRadius || '0.5rem'}
          onChange={(value) => onUpdate('borderRadius', value)}
          placeholder="0.5rem"
        />
        <p className="text-xs text-gray-500 mt-2">
          Use CSS values like 0.5rem, 8px, 0, etc.
        </p>
      </Section>

      {/* Shadow Intensity */}
      <Section>
        <SectionHeader
          title="Shadow Intensity"
          description="Global shadow depth"
        />
        <div className="grid grid-cols-4 gap-2">
          {shadowIntensityOptions.map((shadow) => (
            <button
              key={shadow.value}
              onClick={() => onUpdate('shadowIntensity', shadow.value)}
              className={`p-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                theme.shadowIntensity === shadow.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {shadow.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Shadow Preview */}
      <Section>
        <SectionHeader
          title="Shadow Preview"
          description="Visual shadow example"
        />
        <div className="p-6 bg-gray-700/50 rounded-lg flex justify-center">
          <div
            className={`w-24 h-24 bg-white dark:bg-gray-600 rounded-lg ${
              theme.shadowIntensity === 'none' ? ''
              : theme.shadowIntensity === 'sm' ? 'shadow-sm'
              : theme.shadowIntensity === 'md' ? 'shadow-md'
              : 'shadow-lg'
            }`}
            style={{ borderRadius: theme.borderRadius }}
          />
        </div>
      </Section>

      {/* Theme Summary */}
      <Section>
        <SectionHeader
          title="Current Theme"
          description="Summary of your settings"
        />
        <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-400">Mode:</span>
            <span className="text-white capitalize">{theme.mode || 'dark'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Primary:</span>
            <span className="text-white">{theme.primaryColor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Font:</span>
            <span className="text-white">{theme.fontFamily}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Button Style:</span>
            <span className="text-white capitalize">{theme.buttonStyle}</span>
          </div>
        </div>
      </Section>

      {/* Reset Theme */}
      <Section>
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={onResetTheme}
            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-200 transition-colors"
          >
            Reset to Defaults
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            This will reset all theme settings to their defaults
          </p>
        </div>
      </Section>
    </div>
  );
};

export default AdvancedTab;
