/**
 * HeroMediaTab Component
 * Single Responsibility: Manage hero media settings (gallery, display mode, transitions, styling)
 */

import React from 'react';
import type { HeroConfig } from '../../../../types/config';
import { Select, Toggle, SectionHeader, Section, Slider } from '../shared';
import {
  displayModeOptions,
  transitionOptions,
  mediaStyleOptions,
  mediaSizeOptions,
  mediaFitOptions,
  mediaRoundedOptions,
  mediaShadowOptions,
  dualMediaLayoutOptions,
  dualMediaSplitOptions,
} from './constants';
import HeroMediaGallery from '../HeroMediaGallery';
import { LogoSelector } from '../LogoSelector';

interface HeroMediaTabProps {
  config: HeroConfig;
  onUpdate: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void;
  onCommit?: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => Promise<void>;
}

export const HeroMediaTab: React.FC<HeroMediaTabProps> = ({ config, onUpdate, onCommit }) => {
  const showSliderSettings = ['slider', 'carousel', 'fade'].includes(config.mediaDisplayMode || 'single');
  const showVideoControls = config.mediaItems?.some(item => item.type === 'video') || config.mediaType === 'video';
  const isDualMediaEnabled = config.dualMediaLayout && config.dualMediaLayout !== 'disabled';

  return (
    <div className="space-y-6">
      {/* Dual Media Layout */}
      <Section>
        <SectionHeader
          title="Dual Media Layout"
          description="Show two media items side by side (e.g., logo + main media)"
        />
        <div className="space-y-4">
          <Select
            label="Layout Mode"
            value={config.dualMediaLayout || 'disabled'}
            onChange={(value) => onUpdate('dualMediaLayout', value as HeroConfig['dualMediaLayout'])}
            options={dualMediaLayoutOptions.map(opt => ({
              value: opt.value,
              label: `${opt.label} - ${opt.desc}`
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
              <div className="p-3 bg-slate-800/30 rounded-lg border border-white/5 space-y-3">
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Secondary Media (Left Side)
                </div>
                <LogoSelector
                  value={config.secondaryMediaUrl || ''}
                  onChange={(url) => onUpdate('secondaryMediaUrl', url)}
                  onSaveChanges={onCommit ? async (url) => onCommit('secondaryMediaUrl', url) : undefined}
                  allowedTypes={['image', 'video']}
                />
                
                {config.secondaryMediaUrl && (
                  <div className="space-y-3 pt-2">
                    <Select
                      label="Fit"
                      value={config.secondaryMediaFit || 'contain'}
                      onChange={(value) => onUpdate('secondaryMediaFit', value as HeroConfig['secondaryMediaFit'])}
                      options={mediaFitOptions}
                    />
                    <Select
                      label="Border Radius"
                      value={config.secondaryMediaRounded || 'lg'}
                      onChange={(value) => onUpdate('secondaryMediaRounded', value as HeroConfig['secondaryMediaRounded'])}
                      options={mediaRoundedOptions}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </Section>

      {/* Primary Media Gallery */}
      <Section>
        <SectionHeader
          title={isDualMediaEnabled ? "Primary Media Gallery (Right Side)" : "Media Gallery"}
          description="Add images and videos to your hero"
        />
        <HeroMediaGallery
          items={config.mediaItems || []}
          onChange={(items) => onUpdate('mediaItems', items)}
          maxItems={10}
        />
      </Section>

      {/* Display Mode */}
      <Section>
        <SectionHeader
          title="Display Mode"
          description="How multiple media items are shown"
        />
        <div className="grid grid-cols-3 gap-2">
          {displayModeOptions.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onUpdate('mediaDisplayMode', mode.id)}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                config.mediaDisplayMode === mode.id
                  ? 'border-purple-500 bg-purple-500/20 text-white shadow-md shadow-purple-500/20'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50 hover:bg-gray-700/50'
              }`}
            >
              {mode.icon}
              <span className="text-xs font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Transition Effect */}
      {showSliderSettings && (
        <Section>
          <SectionHeader
            title="Transition Effect"
            description="Animation between slides"
          />
          <div className="flex gap-2">
            {transitionOptions.map((transition) => (
              <button
                key={transition.id}
                onClick={() => onUpdate('sliderTransition', transition.id)}
                className={`flex-1 p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                  config.sliderTransition === transition.id
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-gray-600 text-gray-400 hover:border-purple-500/50'
                }`}
              >
                {transition.icon}
                <span className="text-[10px]">{transition.name}</span>
              </button>
            ))}
          </div>
        </Section>
      )}

      {/* Slider Settings */}
      {showSliderSettings && (
        <Section>
          <SectionHeader
            title="Slider Settings"
            description="Autoplay and navigation controls"
          />
          <div className="space-y-4">
            <Toggle
              label="Autoplay"
              checked={config.sliderAutoplay ?? true}
              onChange={(checked) => onUpdate('sliderAutoplay', checked)}
            />
            
            {config.sliderAutoplay && (
              <Slider
                label="Interval (seconds)"
                value={(config.sliderInterval ?? 5000) / 1000}
                onChange={(value) => onUpdate('sliderInterval', value * 1000)}
                min={2}
                max={15}
                step={1}
              />
            )}
            
            <Toggle
              label="Show Navigation Dots"
              checked={config.sliderShowDots ?? true}
              onChange={(checked) => onUpdate('sliderShowDots', checked)}
            />
            
            <Toggle
              label="Show Arrows"
              checked={config.sliderShowArrows ?? true}
              onChange={(checked) => onUpdate('sliderShowArrows', checked)}
            />
            
            <Toggle
              label="Pause on Hover"
              checked={config.sliderPauseOnHover ?? true}
              onChange={(checked) => onUpdate('sliderPauseOnHover', checked)}
            />
          </div>
        </Section>
      )}

      {/* Media Style (ReactBits Effects) */}
      <Section>
        <SectionHeader
          title="Media Style"
          description="Apply visual effects from ReactBits"
        />
        <div className="grid grid-cols-3 gap-2">
          {mediaStyleOptions.map((style) => (
            <button
              key={style.id}
              onClick={() => onUpdate('mediaDisplayStyle', style.id)}
              className={`p-2.5 rounded-lg border flex flex-col items-center gap-1.5 transition-all ${
                config.mediaDisplayStyle === style.id
                  ? 'border-purple-500 bg-purple-500/20 text-white shadow-md shadow-purple-500/20'
                  : 'border-gray-600 text-gray-400 hover:border-purple-500/50 hover:bg-gray-700/50'
              }`}
            >
              {style.icon}
              <span className="text-[10px] font-medium">{style.label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Media Size & Styling */}
      <Section>
        <SectionHeader
          title="Primary Media Appearance"
          description="Size, shape, and shadow"
        />
        <div className="space-y-4">
          <Select
            label="Size"
            value={config.mediaSize || 'lg'}
            onChange={(value) => onUpdate('mediaSize', value as HeroConfig['mediaSize'])}
            options={mediaSizeOptions}
          />
          
          <Select
            label="Object Fit"
            value={config.mediaFit || 'cover'}
            onChange={(value) => onUpdate('mediaFit', value as HeroConfig['mediaFit'])}
            options={mediaFitOptions}
          />
          
          <Select
            label="Border Radius"
            value={config.mediaRounded || 'lg'}
            onChange={(value) => onUpdate('mediaRounded', value as HeroConfig['mediaRounded'])}
            options={mediaRoundedOptions}
          />
          
          <Select
            label="Shadow"
            value={config.mediaShadow || 'lg'}
            onChange={(value) => onUpdate('mediaShadow', value as HeroConfig['mediaShadow'])}
            options={mediaShadowOptions}
          />
        </div>
      </Section>

      {/* Video Controls */}
      {showVideoControls && (
        <Section>
          <SectionHeader
            title="Video Settings"
            description="Controls for video media"
          />
          <div className="space-y-4">
            <Toggle
              label="Autoplay"
              checked={config.mediaAutoplay ?? true}
              onChange={(checked) => onUpdate('mediaAutoplay', checked)}
            />
            <Toggle
              label="Loop"
              checked={config.mediaLoop ?? true}
              onChange={(checked) => onUpdate('mediaLoop', checked)}
            />
            <Toggle
              label="Muted"
              description="Required for autoplay on most browsers"
              checked={config.mediaMuted ?? true}
              onChange={(checked) => onUpdate('mediaMuted', checked)}
            />
            <Toggle
              label="Show Controls"
              checked={config.mediaControls ?? false}
              onChange={(checked) => onUpdate('mediaControls', checked)}
            />
          </div>
        </Section>
      )}
    </div>
  );
};

export default HeroMediaTab;
