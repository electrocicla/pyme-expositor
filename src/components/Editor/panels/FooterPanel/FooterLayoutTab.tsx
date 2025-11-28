/**
 * FooterLayoutTab Component
 * Single Responsibility: Manage footer layout and visual settings
 */

import React from 'react';
import type { FooterConfig } from './constants';
import { layoutOptions } from './constants';
import { SectionHeader, Section, Toggle, ColorPicker } from '../shared';

interface FooterLayoutTabProps {
  footer: FooterConfig;
  onUpdate: (key: string, value: any) => void;
}

export const FooterLayoutTab: React.FC<FooterLayoutTabProps> = ({ footer, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Layout Style */}
      <Section>
        <SectionHeader
          title="Layout Style"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />
        <div className="grid grid-cols-2 gap-2">
          {layoutOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdate('layout', option.value)}
              className={`p-3 rounded-lg border-2 transition-all text-xs font-medium ${
                footer.layout === option.value
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700/50 bg-slate-800/30 text-white/70 hover:border-slate-600/50 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Background Color */}
      <Section>
        <SectionHeader
          title="Background Color"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          }
        />
        <ColorPicker
          value={footer.backgroundColor || '#1f2937'}
          onChange={(value) => onUpdate('backgroundColor', value)}
        />
      </Section>

      {/* Visibility Toggles */}
      <Section>
        <SectionHeader
          title="Visibility"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <div className="space-y-3">
          <Toggle
            label="Show Logo"
            checked={footer.showLogo ?? false}
            onChange={(value) => onUpdate('showLogo', value)}
          />
          <Toggle
            label="Show Top Divider"
            checked={footer.showDivider ?? false}
            onChange={(value) => onUpdate('showDivider', value)}
          />
          <Toggle
            label="Show Copyright"
            checked={footer.showCopyright !== false}
            onChange={(value) => onUpdate('showCopyright', value)}
          />
          <Toggle
            label="Show Newsletter Section"
            checked={footer.showNewsletter ?? false}
            onChange={(value) => onUpdate('showNewsletter', value)}
          />
        </div>
      </Section>
    </div>
  );
};

export default FooterLayoutTab;
