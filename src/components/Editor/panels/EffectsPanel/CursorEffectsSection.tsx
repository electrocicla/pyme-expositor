/**
 * CursorEffectsSection Component
 * Single Responsibility: Manage cursor effects configuration
 */

import React from 'react';
import type { EffectsConfig } from '../../../../types/config';
import { Select, Toggle, ColorPicker, SectionHeader, Section } from '../shared';
import { cursorTypeOptions, effectColorPresets } from './constants';

interface CursorEffectsSectionProps {
  cursor: EffectsConfig['cursor'];
  onChange: (cursor: EffectsConfig['cursor']) => void;
}

export const CursorEffectsSection: React.FC<CursorEffectsSectionProps> = ({ cursor, onChange }) => {
  const updateCursor = <K extends keyof EffectsConfig['cursor']>(
    key: K,
    value: EffectsConfig['cursor'][K]
  ) => {
    onChange({ ...cursor, [key]: value });
  };

  return (
    <Section>
      <SectionHeader
        title="Cursor Effects"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        }
      />
      <div className="space-y-3">
        <Toggle
          label="Enable Cursor Effect"
          description="Interactive cursor trails and effects"
          checked={cursor.enabled}
          onChange={(checked) => updateCursor('enabled', checked)}
        />
        
        {cursor.enabled && (
          <div className="pl-3 space-y-3 border-l-2 border-blue-500/30">
            <Select
              label="Cursor Type"
              value={cursor.type}
              onChange={(value) => updateCursor('type', value as EffectsConfig['cursor']['type'])}
              options={cursorTypeOptions}
            />
            
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Effect Color</label>
              <ColorPicker
                value={cursor.color}
                onChange={(value) => updateCursor('color', value)}
                presets={effectColorPresets}
              />
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default CursorEffectsSection;
