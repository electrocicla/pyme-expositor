/**
 * GalleryLayoutTab Component
 * Single Responsibility: Manage gallery layout settings
 */

import React from 'react';
import type { GalleryConfig } from './constants';
import { Select, SectionHeader, Section } from '../shared';
import {
  layoutTypeOptions,
  desktopColumnOptions,
  gapOptions,
  aspectRatioOptions,
} from './constants';

interface GalleryLayoutTabProps {
  gallery: GalleryConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const GalleryLayoutTab: React.FC<GalleryLayoutTabProps> = ({ gallery, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Layout Type */}
      <Section>
        <SectionHeader
          title="Gallery Layout"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          }
        />
        
        <div className="grid grid-cols-3 gap-2">
          {layoutTypeOptions.map((layout) => (
            <button
              key={layout.value}
              onClick={() => onUpdate('layout', layout.value)}
              className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${
                gallery.layout === layout.value
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/30'
              }`}
            >
              <div className="mb-1 text-white/80">{layout.icon}</div>
              <div className="text-xs text-white/70">{layout.label}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Columns */}
      <Section>
        <Select
          label="Desktop Columns"
          value={gallery.columns || '3'}
          onChange={(value) => onUpdate('columns', value)}
          options={desktopColumnOptions}
        />
      </Section>

      {/* Gap */}
      <Section>
        <Select
          label="Item Gap / Spacing"
          value={gallery.gap || 'md'}
          onChange={(value) => onUpdate('gap', value)}
          options={gapOptions}
        />
      </Section>

      {/* Aspect Ratio */}
      <Section>
        <Select
          label="Image Aspect Ratio"
          value={gallery.aspectRatio || 'video'}
          onChange={(value) => onUpdate('aspectRatio', value)}
          options={aspectRatioOptions}
        />
      </Section>

      {/* Layout Preview */}
      <Section>
        <label className="block text-xs font-medium text-slate-300 mb-2">Preview</label>
        <div className={`grid gap-2 p-3 bg-slate-800/30 rounded-lg ${
          gallery.columns === '2' ? 'grid-cols-2' :
          gallery.columns === '4' ? 'grid-cols-4' : 'grid-cols-3'
        }`}>
          {Array.from({ length: parseInt(gallery.columns || '3') * 2 }).map((_, i) => (
            <div
              key={i}
              className={`bg-slate-700/50 rounded ${
                gallery.aspectRatio === 'square' ? 'aspect-square' :
                gallery.aspectRatio === 'portrait' ? 'aspect-4/5' :
                gallery.aspectRatio === 'auto' ? 'aspect-auto h-8' : 'aspect-video'
              }`}
            />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default GalleryLayoutTab;
