/**
 * HeaderLinkStyleTab Component
 * Single Responsibility: Manage navigation link styling options
 * Separated into: Container Styles (Tailwind), Effects (ReactBits), and Colors
 */

import React from 'react';
import { Lightbulb, Sparkles, Palette } from 'lucide-react';
import type { HeaderConfig } from './constants';
import {
  navLinkContainerStyleOptions,
  navLinkEffectOptions,
  navLinkHoverAnimationOptions,
  navLinkSizeOptions,
  navLinkWeightOptions,
  navLinkSpacingOptions,
  navLinkGapOptions,
  navStarBorderSpeedOptions,
  navMagnetStrengthOptions,
  navGlowIntensityOptions,
} from './constants';
import { SectionHeader, Section, Select, ColorPicker } from '../shared';

interface HeaderLinkStyleTabProps {
  header: HeaderConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const HeaderLinkStyleTab: React.FC<HeaderLinkStyleTabProps> = ({ header, onUpdate }) => {
  const currentContainerStyle = header.navLinkContainerStyle || 'none';
  const currentEffect = header.navLinkEffect || 'none';

  const isStarBorder = currentEffect === 'star-border';
  const isMagnet = currentEffect === 'magnet';
  const isGlow = currentEffect === 'glow';

  return (
    <div className="space-y-6">
      {/* Container Style Selection */}
      <Section>
        <SectionHeader
          title="Container Style"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
          }
        />
        <p className="text-xs text-white/40 mb-3">Shape and background style for link buttons</p>
        <div className="grid grid-cols-2 gap-2">
          {navLinkContainerStyleOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate('navLinkContainerStyle', option.value)}
              className={`p-2.5 rounded-lg text-xs font-medium transition-all border text-left ${
                currentContainerStyle === option.value
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
              }`}
              title={option.desc}
            >
              <span className="block">{option.label}</span>
              <span className="block text-[10px] opacity-60 mt-0.5">{option.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Effects Selection (ReactBits) */}
      <Section>
        <SectionHeader
          title="Advanced Effect"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
        <p className="text-xs text-white/40 mb-3">Interactive effects powered by React Bits</p>
        <div className="grid grid-cols-2 gap-2">
          {navLinkEffectOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate('navLinkEffect', option.value)}
              className={`p-2.5 rounded-lg text-xs font-medium transition-all border text-left ${
                currentEffect === option.value
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
              }`}
              title={option.desc}
            >
              <span className="block">{option.label}</span>
              <span className="block text-[10px] opacity-60 mt-0.5">{option.desc}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Effect-Specific Options */}
      {isStarBorder && (
        <Section>
          <SectionHeader
            title="Star Border Settings"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
          />
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Border Color</label>
              <ColorPicker
                value={header.navStarBorderColor || '#6366f1'}
                onChange={(value: string) => onUpdate('navStarBorderColor', value)}
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Animation Speed</label>
              <Select
                value={header.navStarBorderSpeed || 'normal'}
                options={navStarBorderSpeedOptions}
                onChange={(value: string) => onUpdate('navStarBorderSpeed', value)}
              />
            </div>
          </div>
        </Section>
      )}

      {isMagnet && (
        <Section>
          <SectionHeader
            title="Magnet Settings"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            }
          />
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Pull Strength</label>
            <Select
              value={header.navMagnetStrength || 'normal'}
              options={navMagnetStrengthOptions}
              onChange={(value: string) => onUpdate('navMagnetStrength', value)}
            />
          </div>
        </Section>
      )}

      {isGlow && (
        <Section>
          <SectionHeader
            title="Glow Settings"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
          />
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Glow Color</label>
              <ColorPicker
                value={header.navGlowColor || '#6366f1'}
                onChange={(value: string) => onUpdate('navGlowColor', value)}
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Glow Intensity</label>
              <Select
                value={header.navGlowIntensity || 'normal'}
                options={navGlowIntensityOptions}
                onChange={(value: string) => onUpdate('navGlowIntensity', value)}
              />
            </div>
          </div>
        </Section>
      )}

      {/* Color Options */}
      <Section>
        <SectionHeader
          title="Colors"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          }
        />
        <p className="text-xs text-white/40 mb-3">Leave empty to use theme colors</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Text Color</label>
            <ColorPicker
              value={header.navLinkColor || ''}
              onChange={(value: string) => onUpdate('navLinkColor', value || undefined)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Text Hover</label>
            <ColorPicker
              value={header.navLinkHoverColor || ''}
              onChange={(value: string) => onUpdate('navLinkHoverColor', value || undefined)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Background</label>
            <ColorPicker
              value={header.navLinkBgColor || ''}
              onChange={(value: string) => onUpdate('navLinkBgColor', value || undefined)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Bg Hover</label>
            <ColorPicker
              value={header.navLinkBgHoverColor || ''}
              onChange={(value: string) => onUpdate('navLinkBgHoverColor', value || undefined)}
            />
          </div>
        </div>
      </Section>

      {/* Typography Options */}
      <Section>
        <SectionHeader
          title="Typography"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          }
        />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Size</label>
            <Select
              value={header.navLinkSize || 'sm'}
              options={navLinkSizeOptions}
              onChange={(value: string) => onUpdate('navLinkSize', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Weight</label>
            <Select
              value={header.navLinkWeight || 'medium'}
              options={navLinkWeightOptions}
              onChange={(value: string) => onUpdate('navLinkWeight', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Letter Spacing</label>
            <Select
              value={header.navLinkSpacing || 'normal'}
              options={navLinkSpacingOptions}
              onChange={(value: string) => onUpdate('navLinkSpacing', value)}
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Gap Between</label>
            <Select
              value={header.navLinkGap || 'md'}
              options={navLinkGapOptions}
              onChange={(value: string) => onUpdate('navLinkGap', value)}
            />
          </div>
        </div>
      </Section>

      {/* Hover Animation */}
      <Section>
        <SectionHeader
          title="Hover Animation"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <div className="grid grid-cols-3 gap-2">
          {navLinkHoverAnimationOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate('navLinkHoverAnimation', option.value)}
              className={`p-2 rounded-lg text-xs font-medium transition-all border ${
                (header.navLinkHoverAnimation || 'none') === option.value
                  ? 'bg-green-500/20 border-green-500/50 text-green-400'
                  : 'bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Info Note */}
      <div className="text-xs text-white/40 text-center p-3 bg-slate-800/30 rounded-lg space-y-1">
        <p className="flex items-center justify-center gap-1"><Lightbulb className="w-3 h-3" /> <strong>Container Style:</strong> Shape and background (Tailwind)</p>
        <p className="flex items-center justify-center gap-1"><Sparkles className="w-3 h-3" /> <strong>Advanced Effect:</strong> Interactive animations (React Bits)</p>
        <p className="flex items-center justify-center gap-1"><Palette className="w-3 h-3" /> <strong>Colors:</strong> Custom or inherit from theme</p>
      </div>
    </div>
  );
};

export default HeaderLinkStyleTab;
