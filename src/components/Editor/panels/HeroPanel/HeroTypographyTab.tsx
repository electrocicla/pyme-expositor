/**
 * HeroTypographyTab Component
 * Single Responsibility: Manage hero typography and text effect settings
 */

import React from 'react';
import type { HeroConfig } from '../../../../types/config';
import { Select, SectionHeader, Section, ColorPicker } from '../shared';
import {
  titleSizeOptions,
  titleWeightOptions,
  subtitleSizeOptions,
  textEffectOptions,
  titleLetterSpacingOptions,
  titleLineHeightOptions,
  titleTransformOptions,
  subtitleWeightOptions,
  subtitleOpacityOptions,
} from './constants';

interface HeroTypographyTabProps {
  config: HeroConfig;
  onUpdate: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void;
}

export const HeroTypographyTab: React.FC<HeroTypographyTabProps> = ({ config, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Title Typography */}
      <Section>
        <SectionHeader
          title="Title"
          description="Main heading style"
        />
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Size</label>
            <div className="flex gap-2">
              {titleSizeOptions.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onUpdate('titleSize', size.value)}
                  className={`flex-1 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                    config.titleSize === size.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          
          <Select
            label="Weight"
            value={config.titleWeight || 'bold'}
            onChange={(value) => onUpdate('titleWeight', value as HeroConfig['titleWeight'])}
            options={titleWeightOptions}
          />
          
          <Select
            label="Letter Spacing"
            value={config.titleLetterSpacing || 'normal'}
            onChange={(value) => onUpdate('titleLetterSpacing', value as HeroConfig['titleLetterSpacing'])}
            options={titleLetterSpacingOptions}
          />
          
          <Select
            label="Line Height"
            value={config.titleLineHeight || 'tight'}
            onChange={(value) => onUpdate('titleLineHeight', value as HeroConfig['titleLineHeight'])}
            options={titleLineHeightOptions}
          />
          
          <Select
            label="Transform"
            value={config.titleTransform || 'none'}
            onChange={(value) => onUpdate('titleTransform', value as HeroConfig['titleTransform'])}
            options={titleTransformOptions}
          />
        </div>
      </Section>

      {/* Subtitle Typography */}
      <Section>
        <SectionHeader
          title="Subtitle"
          description="Secondary text style"
        />
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Size</label>
            <div className="flex gap-2">
              {subtitleSizeOptions.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onUpdate('subtitleSize', size.value)}
                  className={`flex-1 px-3 py-2 rounded border text-sm font-medium transition-all ${
                    config.subtitleSize === size.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          
          <Select
            label="Weight"
            value={config.subtitleWeight || 'normal'}
            onChange={(value) => onUpdate('subtitleWeight', value as HeroConfig['subtitleWeight'])}
            options={subtitleWeightOptions}
          />
          
          <Select
            label="Opacity"
            value={config.subtitleOpacity || '70'}
            onChange={(value) => onUpdate('subtitleOpacity', value as HeroConfig['subtitleOpacity'])}
            options={subtitleOpacityOptions}
          />
        </div>
      </Section>

      {/* Text Effect */}
      <Section>
        <SectionHeader
          title="Text Effect"
          description="Animation and visual effects"
        />
        <div className="grid grid-cols-3 gap-2">
          {textEffectOptions.map((effect) => (
            <button
              key={effect.value}
              onClick={() => onUpdate('effect', effect.value)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                config.effect === effect.value
                  ? 'border-purple-500 bg-purple-500/20 text-white shadow-md shadow-purple-500/20'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50 hover:bg-gray-700/50'
              }`}
            >
              {effect.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Overlay Color (for templates with overlay) */}
      {['full-screen', 'media-background', 'media-overlay'].includes(config.template) && (
        <Section>
          <SectionHeader
            title="Overlay Color"
            description="Background color behind text"
          />
          <ColorPicker
            value={config.overlayColor || '#000000'}
            onChange={(value) => onUpdate('overlayColor', value)}
          />
        </Section>
      )}

      {/* Typography Preview */}
      <Section>
        <SectionHeader
          title="Preview"
          description="Live preview of typography settings"
        />
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div
            className={`mb-2 ${
              config.titleSize === 'sm' ? 'text-xl' :
              config.titleSize === 'md' ? 'text-2xl' :
              config.titleSize === 'lg' ? 'text-3xl' :
              config.titleSize === 'xl' ? 'text-4xl' :
              config.titleSize === '2xl' ? 'text-5xl' :
              'text-6xl'
            } ${
              config.titleWeight === 'normal' ? 'font-normal' :
              config.titleWeight === 'medium' ? 'font-medium' :
              config.titleWeight === 'semibold' ? 'font-semibold' :
              config.titleWeight === 'bold' ? 'font-bold' :
              'font-extrabold'
            } ${
              config.titleLetterSpacing === 'tighter' ? 'tracking-tighter' :
              config.titleLetterSpacing === 'tight' ? 'tracking-tight' :
              config.titleLetterSpacing === 'wide' ? 'tracking-wide' :
              config.titleLetterSpacing === 'wider' ? 'tracking-wider' :
              config.titleLetterSpacing === 'widest' ? 'tracking-widest' :
              'tracking-normal'
            } ${
              config.titleTransform === 'uppercase' ? 'uppercase' :
              config.titleTransform === 'lowercase' ? 'lowercase' :
              config.titleTransform === 'capitalize' ? 'capitalize' :
              ''
            } text-white`}
          >
            {config.title || 'Hero Title'}
          </div>
          <div
            className={`${
              config.subtitleSize === 'sm' ? 'text-sm' :
              config.subtitleSize === 'md' ? 'text-base' :
              config.subtitleSize === 'lg' ? 'text-lg' :
              'text-xl'
            } ${
              config.subtitleWeight === 'light' ? 'font-light' :
              config.subtitleWeight === 'medium' ? 'font-medium' :
              config.subtitleWeight === 'semibold' ? 'font-semibold' :
              'font-normal'
            } text-gray-400`}
            style={{ opacity: Number(config.subtitleOpacity || '70') / 100 }}
          >
            {config.subtitle || 'This is the subtitle text'}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HeroTypographyTab;
