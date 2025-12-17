/**
 * Effects configuration hook
 * Following SRP: Only handles effects configuration extraction
 */

import { useMemo } from 'react';
import type { SiteConfig, EffectsConfig } from '../../types/config';

export interface CursorEffectsConfig {
  enabled: boolean;
  type: EffectsConfig['cursor']['type'];
  color: string;
}

export interface BackgroundEffectsConfig {
  enabled: boolean;
  type: EffectsConfig['background']['type'];
  speed: EffectsConfig['background']['speed'];
}

export interface CardsConfig {
  enabled: boolean;
  type: EffectsConfig['cards']['type'];
  hover: EffectsConfig['cards']['hover'];
}

export interface AnimationsConfig {
  enabled: boolean;
  type: EffectsConfig['animations']['type'];
  duration: EffectsConfig['animations']['duration'];
  stagger: boolean;
}

export interface ParticlesConfig {
  enabled: boolean;
  count: number;
  color: string;
  size?: number;
  speed?: string;
  shape?: string;
}

export interface EffectsConfigResult {
  cursor: CursorEffectsConfig;
  background: BackgroundEffectsConfig;
  cards: CardsConfig;
  animations: AnimationsConfig;
  particles: ParticlesConfig;
}

const DEFAULT_EFFECTS: EffectsConfigResult = {
  cursor: { enabled: false, type: 'splash', color: '#6366f1' },
  background: { enabled: false, type: 'gradient', speed: 'normal' },
  cards: { enabled: false, type: 'glass', hover: 'lift' },
  animations: { enabled: true, type: 'fade', duration: 'normal', stagger: true },
  particles: { enabled: false, count: 50, color: '#6366f1' },
};

export function useEffectsConfig(config: SiteConfig): EffectsConfigResult {
  return useMemo(() => {
    const effects = config.effects;
    
    console.warn('useEffectsConfig: config.effects =', effects);
    console.warn('useEffectsConfig: cursor enabled =', effects?.cursor?.enabled);
    
    if (!effects) {
      console.warn('useEffectsConfig: No effects, returning defaults');
      return DEFAULT_EFFECTS;
    }
    
    const result = {
      cursor: {
        enabled: effects.cursor?.enabled ?? false,
        type: effects.cursor?.type ?? 'splash',
        color: effects.cursor?.color ?? '#6366f1',
      },
      background: {
        enabled: effects.background?.enabled ?? false,
        type: effects.background?.type ?? 'gradient',
        speed: effects.background?.speed ?? 'normal',
      },
      cards: {
        enabled: effects.cards?.enabled ?? false,
        type: effects.cards?.type ?? 'glass',
        hover: effects.cards?.hover ?? 'lift',
      },
      animations: {
        enabled: effects.animations?.enabled ?? true,
        type: effects.animations?.type ?? 'fade',
        duration: effects.animations?.duration ?? 'normal',
        stagger: effects.animations?.stagger ?? true,
      },
      particles: {
        enabled: effects.particles?.enabled ?? false,
        count: effects.particles?.count ?? 50,
        color: effects.particles?.color ?? '#6366f1',
      },
    };
    
    console.warn('useEffectsConfig: Returning config with cursor.enabled =', result.cursor.enabled);
    return result;
  }, [config]);
}

export default useEffectsConfig;
