/**
 * HeaderLayoutTab Component
 * Single Responsibility: Manage header layout settings
 */

import React from 'react';
import type { HeaderConfig } from './constants';
import { Select, SectionHeader, Section } from '../shared';
import { layoutStyleOptions, headerHeightOptions, mobileMenuStyleOptions } from './constants';

interface HeaderLayoutTabProps {
  header: HeaderConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const HeaderLayoutTab: React.FC<HeaderLayoutTabProps> = ({ header, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Layout Style */}
      <Section>
        <SectionHeader
          title="Header Layout"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
          }
        />
        
        <div className="grid grid-cols-2 gap-2">
          {layoutStyleOptions.map((layout) => (
            <button
              key={layout.value}
              onClick={() => onUpdate('layout', layout.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                header.layout === layout.value
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="text-xs text-white/40 font-mono mb-1">{layout.icon}</div>
              <div className="text-xs text-white/70">{layout.label}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Height */}
      <Section>
        <Select
          label="Header Height"
          value={header.height || 'md'}
          onChange={(value) => onUpdate('height', value)}
          options={headerHeightOptions}
        />
      </Section>

      {/* Mobile Menu */}
      <Section>
        <Select
          label="Mobile Menu Style"
          value={header.mobileMenuStyle || 'slide'}
          onChange={(value) => onUpdate('mobileMenuStyle', value)}
          options={mobileMenuStyleOptions}
        />
      </Section>

      {/* Layout Preview */}
      <Section>
        <label className="block text-xs font-medium text-slate-300 mb-2">Preview</label>
        <div
          className={`h-12 rounded-lg flex items-center px-4 transition-all ${
            header.transparent ? 'bg-white/5' : 'bg-slate-800/80'
          } ${header.blur ? 'backdrop-blur-sm' : ''}`}
        >
          <div className={`flex items-center w-full ${
            header.layout === 'centered' ? 'justify-center' :
            header.layout === 'minimal' ? 'justify-center' : 'justify-between'
          }`}>
            <div className="w-6 h-6 bg-blue-500/30 rounded" />
            {header.layout !== 'minimal' && (
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-2 bg-slate-600 rounded" />
                ))}
              </div>
            )}
            {header.showCta && header.layout !== 'minimal' && (
              <div className="w-16 h-6 bg-blue-500/50 rounded-md" />
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};

export default HeaderLayoutTab;
