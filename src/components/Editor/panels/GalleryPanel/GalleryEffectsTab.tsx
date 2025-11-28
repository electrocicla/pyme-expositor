/**
 * GalleryEffectsTab Component
 * Single Responsibility: Manage gallery card and hover effects
 */

import React from 'react';
import type { GalleryConfig } from './constants';
import { Toggle, SectionHeader, Section } from '../shared';
import { cardEffectOptions, hoverEffectOptions, cardEffectDescriptions } from './constants';

interface GalleryEffectsTabProps {
  gallery: GalleryConfig;
  onUpdate: (key: string, value: any) => void;
}

export const GalleryEffectsTab: React.FC<GalleryEffectsTabProps> = ({ gallery, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Card Style */}
      <Section>
        <SectionHeader
          title="Card & Hover Effects"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Card Style</label>
            <div className="grid grid-cols-2 gap-2">
              {cardEffectOptions.map((style) => (
                <button
                  key={style.value}
                  onClick={() => onUpdate('cardEffect', style.value)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    gallery.cardEffect === style.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="text-white/80">{style.icon}</span>
                  <span className="text-xs text-white/70">{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Hover Effect</label>
            <div className="grid grid-cols-2 gap-2">
              {hoverEffectOptions.map((effect) => (
                <button
                  key={effect.value}
                  onClick={() => onUpdate('hoverEffect', effect.value)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                    gallery.hoverEffect === effect.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/30'
                  }`}
                >
                  <span className="text-white/80">{effect.icon}</span>
                  <span className="text-xs text-white/70">{effect.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Scroll Animation */}
      <Section>
        <Toggle
          label="Animate on Scroll"
          description="Items fade/slide in when scrolling into view"
          checked={gallery.animateOnScroll ?? true}
          onChange={(checked) => onUpdate('animateOnScroll', checked)}
        />
      </Section>

      {/* Effect Description */}
      <Section>
        <div className="p-3 bg-white/5 rounded-lg text-xs text-white/50">
          {gallery.cardEffect && cardEffectDescriptions[gallery.cardEffect]
            ? cardEffectDescriptions[gallery.cardEffect]
            : 'Select a card style to see description'}
        </div>
      </Section>
    </div>
  );
};

export default GalleryEffectsTab;
