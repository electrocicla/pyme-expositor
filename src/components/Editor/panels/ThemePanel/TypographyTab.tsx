/**
 * TypographyTab Component
 * Single Responsibility: Manage theme typography settings
 */

import React from 'react';
import type { ThemeConfig } from './constants';
import { Select, SectionHeader, Section, ButtonGroup } from '../shared';
import {
  fontOptions,
  fontSizeOptions,
  headingWeightOptions,
  bodyWeightOptions,
  letterSpacingOptions,
  lineHeightOptions,
} from './constants';

interface TypographyTabProps {
  theme: ThemeConfig;
  onUpdate: <K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => void;
}

export const TypographyTab: React.FC<TypographyTabProps> = ({ theme, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Body Font */}
      <Section>
        <SectionHeader
          title="Body Font"
          description="Main text font"
        />
        <Select
          value={theme.fontFamily || 'Inter'}
          onChange={(value) => onUpdate('fontFamily', value)}
          options={fontOptions}
        />
      </Section>

      {/* Heading Font */}
      <Section>
        <SectionHeader
          title="Heading Font"
          description="Titles and headings"
        />
        <Select
          value={theme.headingFont || 'Inter'}
          onChange={(value) => onUpdate('headingFont', value)}
          options={fontOptions}
        />
      </Section>

      {/* Base Font Size */}
      <Section>
        <SectionHeader
          title="Base Font Size"
          description="Overall text scale"
        />
        <ButtonGroup
          value={theme.baseFontSize || 'md'}
          onChange={(value) => onUpdate('baseFontSize', value as ThemeConfig['baseFontSize'])}
          options={fontSizeOptions}
        />
      </Section>

      {/* Heading Weight */}
      <Section>
        <SectionHeader
          title="Heading Weight"
          description="Bold level for headings"
        />
        <div className="grid grid-cols-4 gap-2">
          {headingWeightOptions.map((weight) => (
            <button
              key={weight.value}
              onClick={() => onUpdate('headingWeight', weight.value)}
              className={`p-2 rounded-lg border text-xs font-medium capitalize transition-all ${
                theme.headingWeight === weight.value
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-600 text-gray-300 hover:border-purple-500/50'
              }`}
            >
              {weight.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Body Weight */}
      <Section>
        <SectionHeader
          title="Body Weight"
          description="Weight for body text"
        />
        <ButtonGroup
          value={theme.bodyWeight || 'normal'}
          onChange={(value) => onUpdate('bodyWeight', value as ThemeConfig['bodyWeight'])}
          options={bodyWeightOptions}
        />
      </Section>

      {/* Letter Spacing */}
      <Section>
        <SectionHeader
          title="Letter Spacing"
          description="Space between characters"
        />
        <ButtonGroup
          value={theme.letterSpacing || 'normal'}
          onChange={(value) => onUpdate('letterSpacing', value as ThemeConfig['letterSpacing'])}
          options={letterSpacingOptions}
        />
      </Section>

      {/* Line Height */}
      <Section>
        <SectionHeader
          title="Line Height"
          description="Space between lines"
        />
        <ButtonGroup
          value={theme.lineHeight || 'normal'}
          onChange={(value) => onUpdate('lineHeight', value as ThemeConfig['lineHeight'])}
          options={lineHeightOptions}
        />
      </Section>

      {/* Typography Preview */}
      <Section>
        <SectionHeader
          title="Preview"
          description="Typography settings preview"
        />
        <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <h2
            className={`mb-2 ${
              theme.baseFontSize === 'sm' ? 'text-xl' :
              theme.baseFontSize === 'lg' ? 'text-3xl' : 'text-2xl'
            } ${
              theme.headingWeight === 'medium' ? 'font-medium' :
              theme.headingWeight === 'semibold' ? 'font-semibold' :
              theme.headingWeight === 'extrabold' ? 'font-extrabold' : 'font-bold'
            } text-white`}
            style={{ fontFamily: theme.headingFont }}
          >
            Heading Example
          </h2>
          <p
            className={`${
              theme.baseFontSize === 'sm' ? 'text-sm' :
              theme.baseFontSize === 'lg' ? 'text-lg' : 'text-base'
            } ${
              theme.bodyWeight === 'light' ? 'font-light' :
              theme.bodyWeight === 'medium' ? 'font-medium' : 'font-normal'
            } ${
              theme.letterSpacing === 'tight' ? 'tracking-tight' :
              theme.letterSpacing === 'wide' ? 'tracking-wide' : 'tracking-normal'
            } ${
              theme.lineHeight === 'tight' ? 'leading-tight' :
              theme.lineHeight === 'relaxed' ? 'leading-relaxed' : 'leading-normal'
            } text-gray-400`}
            style={{ fontFamily: theme.fontFamily }}
          >
            This is a preview of your body text settings. The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </Section>
    </div>
  );
};

export default TypographyTab;
