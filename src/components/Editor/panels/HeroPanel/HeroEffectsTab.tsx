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
    { value: 'tilt', label: '3D Tilt Hover' },
    { value: 'glass', label: 'Glassmorphism' },
    { value: 'fade-in', label: 'Fade In Animation' },
    { value: 'animate-on-scroll', label: 'Scroll Animation' },
    { value: 'stagger', label: 'Stagger Animation' },
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
            3D Tilt effect makes the hero card respond to mouse movement with smooth 3D transformations.
          </div>
        )}

        {hero.effect === 'glass' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            Glassmorphism adds a frosted glass look with backdrop blur and transparency effects.
          </div>
        )}

        {hero.effect === 'fade-in' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            Smooth fade-in animation when the hero section enters the viewport.
          </div>
        )}

        {hero.effect === 'animate-on-scroll' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            Elements animate as they come into view while scrolling.
          </div>
        )}

        {hero.effect === 'stagger' && (
          <div className="p-4 bg-slate-800/50 rounded-lg border border-white/5 text-sm text-slate-400">
            Child elements animate in sequence with a staggered delay effect.
          </div>
        )}
      </div>
    </div>
  );
};
