/**
 * HeroLayoutTab Component
 * Single Responsibility: Manage hero layout and positioning settings
 */

import React from 'react';
import type { HeroConfig } from '../../../../types/config';
import { Select, Toggle, SectionHeader, Section } from '../shared';
import {
  textAlignOptions,
  verticalAlignOptions,
  contentWidthOptions,
  paddingYOptions,
  paddingXOptions,
  overlayGradientOptions,
} from './constants';
import { Slider } from '../shared/Slider';

interface HeroLayoutTabProps {
  config: HeroConfig;
  onUpdate: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void;
}

export const HeroLayoutTab: React.FC<HeroLayoutTabProps> = ({ config, onUpdate }) => {
  const showOverlayControls = ['full-screen', 'media-background', 'media-overlay'].includes(config.template);
  const showMediaPositionControl = config.template === 'split';

  return (
    <div className="space-y-6">
      {/* Text Alignment */}
      <Section>
        <SectionHeader
          title="Text Alignment"
          description="Horizontal alignment of content"
        />
        <div className="flex gap-2">
          {textAlignOptions.map((align) => (
            <button
              key={align.value}
              onClick={() => onUpdate('textAlign', align.value)}
              className={`flex-1 p-3 rounded-lg border flex items-center justify-center transition-all ${
                config.textAlign === align.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-purple-500/50'
              }`}
              title={align.value.charAt(0).toUpperCase() + align.value.slice(1)}
            >
              {align.icon}
            </button>
          ))}
        </div>
      </Section>

      {/* Vertical Alignment */}
      <Section>
        <SectionHeader
          title="Vertical Alignment"
          description="Vertical positioning of content"
        />
        <Select
          value={config.verticalAlign || 'center'}
          onChange={(value) => onUpdate('verticalAlign', value as HeroConfig['verticalAlign'])}
          options={verticalAlignOptions}
        />
      </Section>

      {/* Content Width */}
      <Section>
        <SectionHeader
          title="Content Width"
          description="Maximum width of text content"
        />
        <div className="flex gap-2">
          {contentWidthOptions.map((width) => (
            <button
              key={width.value}
              onClick={() => onUpdate('contentMaxWidth', width.value)}
              className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                config.contentMaxWidth === width.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {width.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Padding */}
      <Section>
        <SectionHeader
          title="Padding"
          description="Internal spacing"
        />
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Vertical (Y)</label>
            <div className="flex gap-2">
              {paddingYOptions.map((padding) => (
                <button
                  key={padding.value}
                  onClick={() => onUpdate('paddingY', padding.value)}
                  className={`flex-1 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                    config.paddingY === padding.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {padding.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Horizontal (X)</label>
            <div className="flex gap-2">
              {paddingXOptions.map((padding) => (
                <button
                  key={padding.value}
                  onClick={() => onUpdate('paddingX', padding.value)}
                  className={`flex-1 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                    config.paddingX === padding.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {padding.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Media Position (Split Template) */}
      {showMediaPositionControl && (
        <Section>
          <SectionHeader
            title="Media Position"
            description="Side where media appears"
          />
          <div className="flex gap-2">
            {(['left', 'right'] as const).map((pos) => (
              <button
                key={pos}
                onClick={() => onUpdate('mediaPosition', pos)}
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium capitalize transition-all ${
                  config.mediaPosition === pos
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Overlay Controls */}
      {showOverlayControls && (
        <Section>
          <SectionHeader
            title="Overlay"
            description="Darkening layer over media"
          />
          <div className="space-y-4">
            <Slider
              label="Opacity"
              value={config.overlayOpacity ?? 0.5}
              onChange={(value) => onUpdate('overlayOpacity', value)}
              min={0}
              max={1}
              step={0.05}
            />
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Gradient Direction</label>
              <div className="flex gap-2">
                {overlayGradientOptions.map((gradient) => (
                  <button
                    key={gradient.label}
                    onClick={() => onUpdate('overlayGradient', gradient.id)}
                    className={`flex-1 px-3 py-2 rounded border text-xs font-medium transition-all ${
                      config.overlayGradient === gradient.id
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                    }`}
                  >
                    {gradient.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Text Over Media */}
      <Section>
        <SectionHeader
          title="Text Placement"
          description="Text overlay options"
        />
        <div className="space-y-4">
          <Toggle
            label="Text Over Media"
            description="Position text on top of media"
            checked={config.textOverMedia ?? false}
            onChange={(checked) => onUpdate('textOverMedia', checked)}
          />
          
          {config.textOverMedia && (
            <Toggle
              label="Text Backdrop"
              description="Add semi-transparent backdrop behind text"
              checked={config.textBackdrop ?? false}
              onChange={(checked) => onUpdate('textBackdrop', checked)}
            />
          )}
        </div>
      </Section>
    </div>
  );
};

export default HeroLayoutTab;
