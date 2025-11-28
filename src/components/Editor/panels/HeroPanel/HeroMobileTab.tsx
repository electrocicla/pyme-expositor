/**
 * HeroMobileTab Component
 * Single Responsibility: Manage hero mobile/responsive settings
 */

import React from 'react';
import type { HeroConfig } from '../../../../types/config';
import { Toggle, SectionHeader, Section, InfoBox } from '../shared';
import {
  textAlignOptions,
  titleSizeOptions,
  subtitleSizeOptions,
  paddingYOptions,
  paddingXOptions,
} from './constants';

interface HeroMobileTabProps {
  config: HeroConfig;
  onUpdate: <K extends keyof HeroConfig>(key: K, value: HeroConfig[K]) => void;
}

export const HeroMobileTab: React.FC<HeroMobileTabProps> = ({ config, onUpdate }) => {
  const mobile = config.mobile || {};

  const updateMobile = <K extends keyof NonNullable<HeroConfig['mobile']>>(
    key: K,
    value: NonNullable<HeroConfig['mobile']>[K]
  ) => {
    onUpdate('mobile', {
      ...mobile,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <InfoBox variant="info">
        These settings only apply on mobile devices (screens smaller than 768px).
        Leave options unchanged to inherit from desktop settings.
      </InfoBox>

      {/* Mobile Text Alignment */}
      <Section>
        <SectionHeader
          title="Text Alignment"
          description="Override desktop alignment on mobile"
        />
        <div className="flex gap-2">
          {textAlignOptions.map((align) => (
            <button
              key={align.value}
              onClick={() => updateMobile('textAlign', align.value)}
              className={`flex-1 p-3 rounded-lg border flex items-center justify-center transition-all ${
                mobile.textAlign === align.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-purple-500/50'
              }`}
              title={align.value.charAt(0).toUpperCase() + align.value.slice(1)}
            >
              {align.icon}
            </button>
          ))}
        </div>
        {mobile.textAlign && (
          <button
            onClick={() => updateMobile('textAlign', undefined)}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300"
          >
            Reset to desktop value
          </button>
        )}
      </Section>

      {/* Mobile Title Size */}
      <Section>
        <SectionHeader
          title="Title Size"
          description="Smaller title for mobile screens"
        />
        <div className="flex flex-wrap gap-2">
          {titleSizeOptions.filter(s => s.value !== '3xl').map((size) => (
            <button
              key={size.value}
              onClick={() => updateMobile('titleSize', size.value as NonNullable<HeroConfig['mobile']>['titleSize'])}
              className={`flex-1 min-w-10 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                mobile.titleSize === size.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
        {mobile.titleSize && (
          <button
            onClick={() => updateMobile('titleSize', undefined)}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300"
          >
            Reset to desktop value
          </button>
        )}
      </Section>

      {/* Mobile Subtitle Size */}
      <Section>
        <SectionHeader
          title="Subtitle Size"
          description="Subtitle size on mobile"
        />
        <div className="flex gap-2">
          {subtitleSizeOptions.map((size) => (
            <button
              key={size.value}
              onClick={() => updateMobile('subtitleSize', size.value)}
              className={`flex-1 px-3 py-2 rounded border text-sm font-medium transition-all ${
                mobile.subtitleSize === size.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
        {mobile.subtitleSize && (
          <button
            onClick={() => updateMobile('subtitleSize', undefined)}
            className="mt-2 text-xs text-purple-400 hover:text-purple-300"
          >
            Reset to desktop value
          </button>
        )}
      </Section>

      {/* Mobile Padding */}
      <Section>
        <SectionHeader
          title="Mobile Padding"
          description="Adjusted spacing for mobile"
        />
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Vertical (Y)</label>
            <div className="flex gap-2">
              {paddingYOptions.map((padding) => (
                <button
                  key={padding.value}
                  onClick={() => updateMobile('paddingY', padding.value)}
                  className={`flex-1 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                    mobile.paddingY === padding.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {padding.label}
                </button>
              ))}
            </div>
            {mobile.paddingY && (
              <button
                onClick={() => updateMobile('paddingY', undefined)}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300"
              >
                Reset to desktop value
              </button>
            )}
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Horizontal (X)</label>
            <div className="flex gap-2">
              {paddingXOptions.map((padding) => (
                <button
                  key={padding.value}
                  onClick={() => updateMobile('paddingX', padding.value)}
                  className={`flex-1 px-2 py-1.5 rounded border text-xs font-medium transition-all ${
                    mobile.paddingX === padding.value
                      ? 'border-purple-500 bg-purple-500/20 text-white'
                      : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
                  }`}
                >
                  {padding.label}
                </button>
              ))}
            </div>
            {mobile.paddingX && (
              <button
                onClick={() => updateMobile('paddingX', undefined)}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300"
              >
                Reset to desktop value
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Hide Media on Mobile */}
      <Section>
        <SectionHeader
          title="Media Visibility"
          description="Control media on small screens"
        />
        <Toggle
          label="Hide Media on Mobile"
          description="Useful for faster loading and cleaner mobile layouts"
          checked={mobile.hideMedia ?? false}
          onChange={(checked) => updateMobile('hideMedia', checked)}
        />
      </Section>

      {/* Mobile Preview Hint */}
      <Section>
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-16 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
              <div className="w-6 h-10 bg-gray-600 rounded-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-300">Test on Mobile</p>
              <p className="text-xs text-gray-500">
                Use your browser's responsive mode (F12) or test on a real device to see these changes.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HeroMobileTab;
