import React from 'react';
import { useConfig } from '../../../../contexts/ConfigContext';
import type { HeroConfig } from '../../../../types/config';
import { Select, InfoBox } from '../shared';
import { Sparkles } from 'lucide-react';

export const HeroEffectsTab: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { hero } = config;

  const updateHero = (updates: Partial<HeroConfig>) => {
    setConfig({
      ...config,
      hero: { ...hero, ...updates },
    });
  };

  const effectOptions = [
    { value: 'none', label: 'None' },
    { value: 'parallax', label: 'Parallax Scroll' },
    { value: 'tilt', label: '3D Tilt' },
    { value: 'glass', label: 'Glassmorphism' },
    { value: 'gradient', label: 'Animated Gradient' },
    { value: 'fade', label: 'Fade In' },
    { value: 'blur-in', label: 'Blur Reveal' },
    { value: 'splash', label: 'Splash Cursor' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <InfoBox 
        icon={<Sparkles className="w-4 h-4 text-purple-400" />}
        variant="info"
      >
        Apply modern visual effects to your hero section. These effects are powered by React Bits.
      </InfoBox>

      <div className="space-y-4">
        <Select
          label="Primary Effect"
          value={hero.effect}
          onChange={(value) => updateHero({ effect: value as HeroConfig['effect'] })}
          options={effectOptions}
          description="Choose the main visual effect for this section."
        />

        {hero.effect === 'parallax' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            Parallax effect creates depth by moving background elements slower than foreground elements as you scroll.
          </div>
        )}

        {hero.effect === 'tilt' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            3D Tilt effect makes the hero card respond to mouse movement.
          </div>
        )}

        {hero.effect === 'glass' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            Glassmorphism adds a frosted glass look to the content container.
          </div>
        )}
      </div>
    </div>
  );
};
