/**
 * GalleryResponsiveTab Component
 * Single Responsibility: Manage gallery responsive settings
 */

import React from 'react';
import { Monitor, Tablet, Smartphone, Info, Lightbulb } from 'lucide-react';
import type { GalleryConfig } from './constants';
import { Select, SectionHeader, Section, InfoBox } from '../shared';
import {
  desktopColumnOptions,
  tabletColumnOptions,
  mobileColumnOptions,
} from './constants';

interface GalleryResponsiveTabProps {
  gallery: GalleryConfig;
  onUpdate: (key: string, value: any) => void;
}

export const GalleryResponsiveTab: React.FC<GalleryResponsiveTabProps> = ({ gallery, onUpdate }) => {
  return (
    <div className="space-y-6">
      <Section>
        <SectionHeader
          title="Responsive Settings"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <div className="flex items-center gap-2 text-xs text-white/50 mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <Lightbulb className="w-4 h-4 shrink-0" />
          Configure how the gallery appears on different screen sizes.
        </div>
      </Section>

      {/* Desktop */}
      <Section>
        <div className="p-3 bg-white/5 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-white/70" />
            <label className="text-sm font-medium text-white/70">Desktop (1024px+)</label>
          </div>
          <Select
            label="Columns"
            value={gallery.columns || '3'}
            onChange={(value) => onUpdate('columns', value)}
            options={desktopColumnOptions}
          />
        </div>
      </Section>

      {/* Tablet */}
      <Section>
        <div className="p-3 bg-white/5 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Tablet className="w-5 h-5 text-white/70" />
            <label className="text-sm font-medium text-white/70">Tablet (768px - 1023px)</label>
          </div>
          <Select
            label="Columns"
            value={gallery.tabletColumns || '2'}
            onChange={(value) => onUpdate('tabletColumns', value)}
            options={tabletColumnOptions}
          />
        </div>
      </Section>

      {/* Mobile */}
      <Section>
        <div className="p-3 bg-white/5 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-white/70" />
            <label className="text-sm font-medium text-white/70">Mobile (&lt;768px)</label>
          </div>
          <Select
            label="Columns"
            value={gallery.mobileColumns || '1'}
            onChange={(value) => onUpdate('mobileColumns', value)}
            options={mobileColumnOptions}
          />
        </div>
      </Section>

      {/* Preview Info */}
      <InfoBox variant="success">
        <div className="flex items-center gap-2 text-xs text-green-300">
          <Info className="w-4 h-4 shrink-0" />
          Use the device preview buttons in the editor toolbar to test your responsive settings.
        </div>
      </InfoBox>
    </div>
  );
};

export default GalleryResponsiveTab;
