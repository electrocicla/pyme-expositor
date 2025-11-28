/**
 * CardEffectsSection Component
 * Single Responsibility: Manage card and media effects configuration
 */

import React from 'react';
import type { EffectsConfig } from '../../../../types/config';
import { Select, Toggle, SectionHeader, Section } from '../shared';
import { cardTypeOptions, cardHoverOptions } from './constants';

interface CardEffectsSectionProps {
  cards: EffectsConfig['cards'];
  onChange: (cards: EffectsConfig['cards']) => void;
}

export const CardEffectsSection: React.FC<CardEffectsSectionProps> = ({ cards, onChange }) => {
  const updateCards = <K extends keyof EffectsConfig['cards']>(
    key: K,
    value: EffectsConfig['cards'][K]
  ) => {
    onChange({ ...cards, [key]: value });
  };

  return (
    <Section>
      <SectionHeader
        title="Card & Media Effects"
        icon={
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
      <div className="space-y-3">
        <Toggle
          label="Enable Card Effects"
          description="Glassmorphism, tilt, and hover effects"
          checked={cards.enabled}
          onChange={(checked) => updateCards('enabled', checked)}
        />
        
        {cards.enabled && (
          <div className="pl-3 space-y-3 border-l-2 border-pink-500/30">
            <Select
              label="Card Style"
              value={cards.type}
              onChange={(value) => updateCards('type', value as EffectsConfig['cards']['type'])}
              options={cardTypeOptions}
            />
            <Select
              label="Hover Effect"
              value={cards.hover}
              onChange={(value) => updateCards('hover', value as EffectsConfig['cards']['hover'])}
              options={cardHoverOptions}
            />
          </div>
        )}
      </div>
    </Section>
  );
};

export default CardEffectsSection;
