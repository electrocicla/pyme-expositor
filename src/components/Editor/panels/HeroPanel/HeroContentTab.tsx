/**
 * HeroContentTab Component
 * Single Responsibility: Manage hero content settings (template, height, text, CTA)
 */

import React from 'react';
import type { HeroConfig } from '../../../../types/config';
import { Input, Textarea, Toggle, SectionHeader, Section, Select } from '../shared';
import { templateOptions, heroHeightOptions, dualMediaLayoutOptions, dualMediaSplitOptions } from './constants';
import { LogoSelector } from '../LogoSelector';

interface HeroContentTabProps {
  config: HeroConfig;
  onUpdate: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void;
}

export const HeroContentTab: React.FC<HeroContentTabProps> = ({ config, onUpdate }) => {
  const isDualMediaEnabled = config.dualMediaLayout && config.dualMediaLayout !== 'disabled';
  const showDualMediaOptions = config.template === 'split' || config.template === 'dual-media';
  const isDualMediaTemplate = config.template === 'dual-media';

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Section>
        <SectionHeader
          title="Template"
          description="Choose your hero layout style"
        />
        <div className="grid grid-cols-2 gap-2">
          {templateOptions.map((template) => (
            <button
              key={template.id}
              onClick={() => onUpdate('template', template.id)}
              className={`p-3 rounded-lg border transition-all text-left ${
                config.template === template.id
                  ? 'border-purple-500 bg-purple-500/20 shadow-md shadow-purple-500/20'
                  : 'border-gray-600 hover:border-purple-500/50 hover:bg-gray-700/50'
              }`}
            >
              <div className="font-medium text-sm text-white">{template.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{template.desc}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Dual Media Layout - Only show for Split template */}
      {showDualMediaOptions && (
        <Section>
          <SectionHeader
            title="Dual Media"
            description="Show two media items side by side"
          />
          <div className="space-y-4">
            <Select
              label="Layout Mode"
              value={config.dualMediaLayout || 'disabled'}
              onChange={(value) => onUpdate('dualMediaLayout', value as HeroConfig['dualMediaLayout'])}
              options={dualMediaLayoutOptions.map(opt => ({
                value: opt.value,
                label: opt.label
              }))}
            />
            
            {isDualMediaEnabled && (
              <>
                <Select
                  label="Split Ratio"
                  value={config.dualMediaSplit || '50-50'}
                  onChange={(value) => onUpdate('dualMediaSplit', value as HeroConfig['dualMediaSplit'])}
                  options={dualMediaSplitOptions}
                />
                
                {/* Secondary Media Selector */}
                <div className="p-3 bg-slate-800/50 rounded-lg border border-white/10 space-y-3">
                  <div className="text-xs font-medium text-slate-300">
                    Secondary Media (Left)
                  </div>
                  <LogoSelector
                    value={config.secondaryMediaUrl || ''}
                    onChange={(url) => onUpdate('secondaryMediaUrl', url)}
                    allowedTypes={['image', 'video']}
                  />
                </div>
              </>
            )}
          </div>
        </Section>
      )}

      {/* Hero Height */}
      <Section>
        <SectionHeader
          title="Hero Height"
          description="Control the overall height"
        />
        <div className="grid grid-cols-5 gap-1.5">
          {heroHeightOptions.map((height) => (
            <button
              key={height.id}
              onClick={() => onUpdate('heroHeight', height.id)}
              className={`px-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                config.heroHeight === height.id
                  ? 'border-purple-500 bg-purple-500/20 text-white shadow-md shadow-purple-500/20'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50 hover:bg-gray-700/50'
              }`}
            >
              {height.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Title & Subtitle - Hide for dual-media template */}
      {!isDualMediaTemplate && (
        <Section>
          <SectionHeader
            title="Content"
            description="Main text content"
          />
          <div className="space-y-4">
            <Input
              label="Title"
              value={config.title || ''}
              onChange={(value) => onUpdate('title', value)}
              placeholder="Enter hero title..."
            />
            <Textarea
              label="Subtitle"
              value={config.subtitle || ''}
              onChange={(value) => onUpdate('subtitle', value)}
              placeholder="Enter subtitle or description..."
              rows={3}
            />
          </div>
        </Section>
      )}

      {/* CTA Button - Hide for dual-media template */}
      {!isDualMediaTemplate && (
        <Section>
          <SectionHeader
            title="Call to Action"
            description="Primary action button"
          />
          <div className="space-y-4">
            <Input
              label="Button Text"
              value={config.ctaText || ''}
              onChange={(value) => onUpdate('ctaText', value)}
              placeholder="Ver productos"
            />
            <Input
              label="Button Link"
              value={config.ctaUrl || ''}
              onChange={(value) => onUpdate('ctaUrl', value)}
              placeholder="#gallery"
            />
          </div>
        </Section>
      )}

      {/* Secondary CTA - Hide for dual-media template */}
      {!isDualMediaTemplate && (
        <Section>
          <SectionHeader
            title="Secondary CTA"
            description="Optional second button"
          />
          <div className="space-y-4">
            <Toggle
              label="Show Secondary Button"
              checked={config.showSecondaryButton ?? false}
              onChange={(checked) => onUpdate('showSecondaryButton', checked)}
            />
            
            {config.showSecondaryButton && (
              <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
                <Input
                  label="Button Text"
                  value={config.secondaryButtonText || ''}
                  onChange={(value) => onUpdate('secondaryButtonText', value)}
                  placeholder="Contactar"
                />
                <Input
                  label="Button Link"
                  value={config.secondaryButtonUrl || ''}
                  onChange={(value) => onUpdate('secondaryButtonUrl', value)}
                  placeholder="#contact"
                />
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
};

export default HeroContentTab;
