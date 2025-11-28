/**
 * ParticlesSection Component
 * Single Responsibility: Manage floating particles configuration
 */

import React from 'react';
import type { EffectsConfig } from '../../../../types/config';
import { Toggle, SectionHeader, Section, Slider, ColorPicker } from '../shared';
import { effectColorPresets } from './constants';

interface ParticlesSectionProps {
  particles: EffectsConfig['particles'];
  onChange: (particles: EffectsConfig['particles']) => void;
}

export const ParticlesSection: React.FC<ParticlesSectionProps> = ({ particles, onChange }) => {
  const updateParticles = <K extends keyof EffectsConfig['particles']>(
    key: K,
    value: EffectsConfig['particles'][K]
  ) => {
    onChange({ ...particles, [key]: value });
  };

  return (
    <Section>
      <SectionHeader
        title="Floating Particles"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        }
      />
      <div className="space-y-3">
        <Toggle
          label="Show Particles"
          description="Floating ambient particles effect"
          checked={particles.enabled}
          onChange={(checked) => updateParticles('enabled', checked)}
        />
        
        {particles.enabled && (
          <div className="pl-3 space-y-3 border-l-2 border-amber-500/30">
            <Slider
              label={`Particle Count: ${particles.count}`}
              value={particles.count}
              onChange={(value) => updateParticles('count', value)}
              min={10}
              max={150}
              step={5}
            />
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Particle Color</label>
              <ColorPicker
                value={particles.color}
                onChange={(value) => updateParticles('color', value)}
                presets={effectColorPresets}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default ParticlesSection;
