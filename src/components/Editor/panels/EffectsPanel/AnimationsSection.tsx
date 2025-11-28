/**
 * AnimationsSection Component
 * Single Responsibility: Manage entry animations configuration
 */

import React from 'react';
import type { EffectsConfig } from '../../../../types/config';
import { Select, Toggle, SectionHeader, Section } from '../shared';
import { animationTypeOptions, animationDurationOptions } from './constants';

interface AnimationsSectionProps {
  animations: EffectsConfig['animations'];
  onChange: (animations: EffectsConfig['animations']) => void;
}

export const AnimationsSection: React.FC<AnimationsSectionProps> = ({ animations, onChange }) => {
  const updateAnimations = <K extends keyof EffectsConfig['animations']>(
    key: K,
    value: EffectsConfig['animations'][K]
  ) => {
    onChange({ ...animations, [key]: value });
  };

  return (
    <Section>
      <SectionHeader
        title="Entry Animations"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
      <div className="space-y-3">
        <Toggle
          label="Enable Animations"
          description="Smooth entrance animations on scroll"
          checked={animations.enabled}
          onChange={(checked) => updateAnimations('enabled', checked)}
        />
        
        {animations.enabled && (
          <div className="pl-3 space-y-3 border-l-2 border-emerald-500/30">
            <Select
              label="Animation Type"
              value={animations.type}
              onChange={(value) => updateAnimations('type', value as EffectsConfig['animations']['type'])}
              options={animationTypeOptions}
            />
            <Select
              label="Duration"
              value={animations.duration}
              onChange={(value) => updateAnimations('duration', value as EffectsConfig['animations']['duration'])}
              options={animationDurationOptions}
            />
            <Toggle
              label="Stagger Children"
              description="Animate items one after another"
              checked={animations.stagger}
              onChange={(checked) => updateAnimations('stagger', checked)}
            />
          </div>
        )}
      </div>
    </Section>
  );
};

export default AnimationsSection;
