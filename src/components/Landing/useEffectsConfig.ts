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

export function useEffectsConfig(config: SiteConfig, device: 'desktop' | 'tablet' | 'mobile' = 'desktop'): EffectsConfigResult {
  return useMemo(() => {
    let effects = config.effects;
    
    if (device !== 'desktop' && effects && effects[device]) {
        // Deep merge for effects categories
        const overrides = effects[device];
        effects = {
            cursor: { ...effects.cursor, ...overrides?.cursor } as EffectsConfig['cursor'],
            background: { ...effects.background, ...overrides?.background } as EffectsConfig['background'],
            cards: { ...effects.cards, ...overrides?.cards } as EffectsConfig['cards'],
            animations: { ...effects.animations, ...overrides?.animations } as EffectsConfig['animations'],
            particles: { ...effects.particles, ...overrides?.particles } as EffectsConfig['particles'],
        };
    }
    
    console.warn('useEffectsConfig: config.effects =', effects);
    console.warn('useEffectsConfig: cursor enabled =', effects?.cursor?.enabled);
    
    if (!effects) {
      console.warn('useEffectsConfig: No effects, returning defaults');
      return DEFAULT_EFFECTS;
    }
    
    const result = {
      cursor: {
        enabled: effects.cursor?.enabled ?? DEFAULT_EFFECTS.cursor.enabled,
        type: effects.cursor?.type ?? DEFAULT_EFFECTS.cursor.type,
        color: effects.cursor?.color ?? DEFAULT_EFFECTS.cursor.color,
      },
      background: {
        enabled: effects.background?.enabled ?? DEFAULT_EFFECTS.background.enabled,
        type: effects.background?.type ?? DEFAULT_EFFECTS.background.type,
        speed: effects.background?.speed ?? DEFAULT_EFFECTS.background.speed,
      },
      cards: {
        enabled: effects.cards?.enabled ?? DEFAULT_EFFECTS.cards.enabled,
        type: effects.cards?.type ?? DEFAULT_EFFECTS.cards.type,
        hover: effects.cards?.hover ?? DEFAULT_EFFECTS.cards.hover,
      },
      animations: {
        enabled: effects.animations?.enabled ?? DEFAULT_EFFECTS.animations.enabled,
        type: effects.animations?.type ?? DEFAULT_EFFECTS.animations.type,
        duration: effects.animations?.duration ?? DEFAULT_EFFECTS.animations.duration,
        stagger: effects.animations?.stagger ?? DEFAULT_EFFECTS.animations.stagger,
      },
      particles: {
        enabled: effects.particles?.enabled ?? DEFAULT_EFFECTS.particles.enabled,
        count: effects.particles?.count ?? DEFAULT_EFFECTS.particles.count,
        color: effects.particles?.color ?? DEFAULT_EFFECTS.particles.color,
      },
    };

    // Override animations config with gallery-specific settings if they exist
    if (config.gallery?.animateOnScroll !== undefined) {
      result.animations.enabled = config.gallery.animateOnScroll;
    }
    
    console.warn('useEffectsConfig: Returning config with cursor.enabled =', result.cursor.enabled);
    return result;
  }, [config, device]);
}

export default useEffectsConfig;
