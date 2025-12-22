/**
 * EffectsPanel Component
 * Single Responsibility: Compose and orchestrate effects configuration sections
 * 
 * This is the main entry point for the Effects Panel, following composition over inheritance.
 * Each section is a separate component with its own responsibility.
 */

import React, { useCallback } from 'react';
import type { EffectsConfig } from '../../../../types/config';
import { useConfig } from '../../../../contexts/ConfigContext';
import { useEditor } from '../../../../contexts/EditorContext';
import { PanelHeader } from '../shared';
import { defaultEffects } from './constants';
import { CursorEffectsSection } from './CursorEffectsSection';
import { BackgroundEffectsSection } from './BackgroundEffectsSection';
import { CardEffectsSection } from './CardEffectsSection';
import { AnimationsSection } from './AnimationsSection';
import { ParticlesSection } from './ParticlesSection';
import { EffectPresetsSection } from './EffectPresetsSection';

/**
 * Main EffectsPanel component
 * Manages state and delegates to specialized sub-components
 */
export const EffectsPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { device } = useEditor();

  // Initialize effects config if not present
  const effects = device === 'desktop'
    ? (config.effects || defaultEffects)
    : { ...(config.effects || defaultEffects), ...(config.effects?.[device] || {}) };

  // Generic update handler for any effect section
  const updateEffects = useCallback(<K extends keyof EffectsConfig>(
    key: K,
    value: EffectsConfig[K]
  ) => {
    if (device === 'desktop') {
      setConfig({
        ...config,
        effects: {
          ...config.effects,
          [key]: value,
        },
      });
    } else {
      const deviceConfig = config.effects?.[device] || {};
      setConfig({
        ...config,
        effects: {
          ...config.effects,
          [device]: {
            ...deviceConfig,
            [key]: value,
          },
        },
      });
    }
  }, [config, setConfig, device]);

  // Apply a complete preset
  const applyPreset = useCallback((preset: EffectsConfig) => {
    if (device === 'desktop') {
      setConfig({
        ...config,
        effects: preset,
      });
    } else {
      setConfig({
        ...config,
        effects: {
          ...config.effects,
          [device]: preset,
        },
      });
    }
  }, [config, setConfig, device]);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Visual Effects"
        subtitle={`Cursor, background, and animation effects (${device})`}
      />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <CursorEffectsSection
          cursor={effects.cursor}
          onChange={(cursor) => updateEffects('cursor', cursor)}
        />
        
        <BackgroundEffectsSection
          background={effects.background}
          onChange={(background) => updateEffects('background', background)}
        />
        
        <CardEffectsSection
          cards={effects.cards}
          onChange={(cards) => updateEffects('cards', cards)}
        />
        
        <AnimationsSection
          animations={effects.animations}
          onChange={(animations) => updateEffects('animations', animations)}
        />
        
        <ParticlesSection
          particles={effects.particles}
          onChange={(particles) => updateEffects('particles', particles)}
        />
        
        <EffectPresetsSection onApplyPreset={applyPreset} />
      </div>
    </div>
  );
};

export default EffectsPanel;
