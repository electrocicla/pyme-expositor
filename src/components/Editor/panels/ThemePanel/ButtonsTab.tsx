/**
 * ButtonsTab Component
 * Single Responsibility: Manage theme button styles
 */

import React from 'react';
import type { ThemeConfig } from './constants';
import { SectionHeader, Section } from '../shared';
import { buttonStyleOptions, buttonRoundedOptions, getBorderRadiusValue } from './constants';

interface ButtonsTabProps {
  theme: ThemeConfig;
  onUpdate: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
}

export const ButtonsTab: React.FC<ButtonsTabProps> = ({ theme, onUpdate }) => {
  const borderRadius = getBorderRadiusValue(theme.buttonRounded);

  return (
    <div className="space-y-6">
      {/* Button Style */}
      <Section>
        <SectionHeader
          title="Button Style"
          description="Overall button appearance"
        />
        <div className="grid grid-cols-2 gap-2">
          {buttonStyleOptions.map((style) => (
            <button
              key={style.value}
              onClick={() => onUpdate('buttonStyle', style.value)}
              className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                theme.buttonStyle === style.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Button Roundness */}
      <Section>
        <SectionHeader
          title="Button Roundness"
          description="Corner rounding"
        />
        <div className="grid grid-cols-5 gap-2">
          {buttonRoundedOptions.map((radius) => (
            <button
              key={radius.value}
              onClick={() => onUpdate('buttonRounded', radius.value)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                theme.buttonRounded === radius.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {radius.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Button Preview */}
      <Section>
        <SectionHeader
          title="Preview"
          description="See your button styles"
        />
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Primary Button */}
            {theme.buttonStyle === 'solid' && (
              <button
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius,
                }}
                className="px-4 py-2 text-white text-sm font-medium transition-transform hover:scale-105"
              >
                Primary Button
              </button>
            )}
            {theme.buttonStyle === 'outline' && (
              <button
                style={{
                  borderColor: theme.primaryColor,
                  color: theme.primaryColor,
                  borderRadius,
                }}
                className="px-4 py-2 text-sm font-medium border-2 bg-transparent transition-transform hover:scale-105"
              >
                Primary Button
              </button>
            )}
            {theme.buttonStyle === 'ghost' && (
              <button
                style={{
                  color: theme.primaryColor,
                  borderRadius,
                }}
                className="px-4 py-2 text-sm font-medium hover:bg-white/10 transition-all"
              >
                Primary Button
              </button>
            )}
            {theme.buttonStyle === 'gradient' && (
              <button
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor || theme.secondaryColor})`,
                  borderRadius,
                }}
                className="px-4 py-2 text-white text-sm font-medium transition-transform hover:scale-105"
              >
                Primary Button
              </button>
            )}

            {/* Secondary Button Example */}
            <button
              style={{
                borderColor: theme.accentColor || '#f59e0b',
                color: theme.accentColor || '#f59e0b',
                borderRadius,
              }}
              className="px-4 py-2 text-sm font-medium border-2 bg-transparent transition-transform hover:scale-105"
            >
              Secondary
            </button>
          </div>
        </div>
      </Section>

      {/* Button Usage Tips */}
      <Section>
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-xs text-blue-300">
            <strong>Tip:</strong> Solid buttons work well for primary actions. 
            Use outline or ghost for secondary actions to create visual hierarchy.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default ButtonsTab;
