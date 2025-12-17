/**
 * GalleryContentTab Component
 * Single Responsibility: Manage gallery content settings
 */

import React from 'react';
import type { GalleryConfig } from './constants';
import { Input, Toggle, SectionHeader, Section, InfoBox, NumberInput } from '../shared';

interface GalleryContentTabProps {
  gallery: GalleryConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const GalleryContentTab: React.FC<GalleryContentTabProps> = ({ gallery, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Section Title */}
      <Section>
        <SectionHeader
          title="Section Content"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <div className="space-y-4">
          <Toggle
            label="Show Section Title"
            description="Display title and subtitle above gallery"
            checked={gallery.showTitle ?? true}
            onChange={(checked) => onUpdate('showTitle', checked)}
          />

          {(gallery.showTitle ?? true) && (
            <div className="space-y-3 pl-3 border-l-2 border-blue-500/30">
              <Input
                label="Section Title"
                value={gallery.title}
                onChange={(value) => onUpdate('title', value)}
                placeholder="Selected Works"
              />
              <Input
                label="Section Subtitle"
                value={gallery.subtitle || ''}
                onChange={(value) => onUpdate('subtitle', value)}
                placeholder="Check out some of my recent projects"
              />
            </div>
          )}
        </div>
      </Section>

      {/* Display Options */}
      <Section>
        <SectionHeader title="Display Options" />
        <div className="space-y-4">
          <Toggle
            label="Show Category Filters"
            description="Display filter buttons for categories"
            checked={gallery.showFilters}
            onChange={(checked) => onUpdate('showFilters', checked)}
          />

          <Toggle
            label="Enable Lightbox"
            description="Open media in fullscreen modal on click"
            checked={gallery.lightbox ?? true}
            onChange={(checked) => onUpdate('lightbox', checked)}
          />
        </div>
      </Section>

      {/* View All Button */}
      <Section>
        <SectionHeader title="View All Button" />
        <div className="space-y-4">
          <Toggle
            label="Show 'View All' Button"
            description="Display a button to see all projects"
            checked={gallery.showViewAll ?? false}
            onChange={(checked) => onUpdate('showViewAll', checked)}
          />
          
          {gallery.showViewAll && (
            <div className="space-y-3 pl-3 border-l-2 border-blue-500/30">
              <Input
                label="Button Text"
                value={gallery.viewAllText || ''}
                onChange={(value) => onUpdate('viewAllText', value)}
                placeholder="View All Projects"
              />
              <Input
                label="Button URL"
                value={gallery.viewAllUrl || ''}
                onChange={(value) => onUpdate('viewAllUrl', value)}
                placeholder="/portfolio"
              />
            </div>
          )}
        </div>
      </Section>

      {/* Max Items */}
      <Section>
        <NumberInput
          label="Max Items to Display (0 = all)"
          value={gallery.maxItems || 0}
          onChange={(value) => onUpdate('maxItems', value)}
          min={0}
          max={50}
        />
      </Section>

      {/* Info Box */}
      <InfoBox variant="info">
        <h4 className="text-sm font-medium text-white mb-1">Media Management</h4>
        <p className="text-xs text-slate-400">
          Upload and manage your media files in the <strong className="text-blue-400">Media</strong> tab of the main Dashboard.
        </p>
      </InfoBox>
    </div>
  );
};

export default GalleryContentTab;
