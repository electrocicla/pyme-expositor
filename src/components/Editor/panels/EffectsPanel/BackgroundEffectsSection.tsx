/**
 * BackgroundEffectsSection Component
 * Single Responsibility: Manage background effects configuration
 */

import React from 'react';
import type { EffectsConfig } from '../../../../types/config';
import { Select, Toggle, SectionHeader, Section } from '../shared';
import { backgroundTypeOptions, backgroundSpeedOptions } from './constants';

interface BackgroundEffectsSectionProps {
  background: EffectsConfig['background'];
  onChange: (background: EffectsConfig['background']) => void;
}

export const BackgroundEffectsSection: React.FC<BackgroundEffectsSectionProps> = ({ background, onChange }) => {
  const updateBackground = <K extends keyof EffectsConfig['background']>(
    key: K,
    value: EffectsConfig['background'][K]
  ) => {
    onChange({ ...background, [key]: value });
  };

  return (
    <Section>
      <SectionHeader
        title="Background Effects"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
      <div className="space-y-3">
        <Toggle
          label="Animated Background"
          description="Dynamic gradient and pattern animations"
          checked={background.enabled}
          onChange={(checked) => updateBackground('enabled', checked)}
        />
        
        {background.enabled && (
          <div className="pl-3 space-y-3 border-l-2 border-purple-500/30">
            <Select
              label="Background Type"
              value={background.type}
              onChange={(value) => updateBackground('type', value as EffectsConfig['background']['type'])}
              options={backgroundTypeOptions}
            />
            <Select
              label="Animation Speed"
              value={background.speed}
              onChange={(value) => updateBackground('speed', value as EffectsConfig['background']['speed'])}
              options={backgroundSpeedOptions}
            />
          </div>
        )}
      </div>
    </Section>
  );
};

export default BackgroundEffectsSection;
