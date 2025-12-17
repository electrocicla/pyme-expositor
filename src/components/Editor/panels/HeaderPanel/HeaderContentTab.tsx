/**
 * HeaderContentTab Component
 * Single Responsibility: Manage header content settings (title, logo, CTA)
 */

import React from 'react';
import type { HeaderConfig } from './constants';
import { logoSizeOptions, logoMaxWidthOptions, logoFitOptions, logoAspectOptions } from './constants';
import { Input, Toggle, SectionHeader, Section, Select } from '../shared';
import { LogoSelector } from '../LogoSelector';

interface HeaderContentTabProps {
  header: HeaderConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const HeaderContentTab: React.FC<HeaderContentTabProps> = ({ header, onUpdate }) => {
  return (
    <div className="space-y-6">
      {/* Site Identity */}
      <Section>
        <SectionHeader
          title="Site Identity"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        
        <div className="space-y-4">
          <Input
            label="Site Title"
            value={header.title}
            onChange={(value) => onUpdate('title', value)}
            placeholder="My Portfolio"
          />
          
          {/* Logo Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-300">Logo</label>
            <LogoSelector
              value={header.logoUrl || ''}
              onChange={(url) => onUpdate('logoUrl', url)}
              allowedTypes={['image']}
            />
          </div>
          
          {/* Logo Settings - Only show when logo is selected */}
          {header.logoUrl && (
            <div className="space-y-4 p-3 bg-slate-800/30 rounded-lg border border-white/5">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Logo Settings
              </div>
              
              {/* Height */}
              <Select
                label="Logo Height"
                value={header.logoSize || 'md'}
                onChange={(value) => onUpdate('logoSize', value)}
                options={logoSizeOptions.map(opt => ({
                  value: opt.value,
                  label: `${opt.label} (${opt.height})`
                }))}
              />
              
              {/* Max Width - for horizontal logos */}
              <Select
                label="Max Width"
                value={header.logoMaxWidth || 'auto'}
                onChange={(value) => onUpdate('logoMaxWidth', value)}
                options={logoMaxWidthOptions.map(opt => ({
                  value: opt.value,
                  label: opt.label
                }))}
              />
              
              {/* Object Fit */}
              <Select
                label="Logo Fit"
                value={header.logoFit || 'contain'}
                onChange={(value) => onUpdate('logoFit', value)}
                options={logoFitOptions.map(opt => ({
                  value: opt.value,
                  label: opt.label
                }))}
              />
              
              {/* Aspect Ratio */}
              <Select
                label="Aspect Ratio"
                value={header.logoAspect || 'auto'}
                onChange={(value) => onUpdate('logoAspect', value)}
                options={logoAspectOptions.map(opt => ({
                  value: opt.value,
                  label: opt.label
                }))}
              />
              
              {/* Hide title when logo is shown */}
              <Toggle
                label="Hide Site Title"
                description="Show only the logo without text"
                checked={header.hideTitle ?? false}
                onChange={(checked) => onUpdate('hideTitle', checked)}
              />
            </div>
          )}
        </div>
      </Section>

      {/* CTA Button */}
      <Section>
        <SectionHeader
          title="Call to Action"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          }
        />
        
        <div className="space-y-4">
          <Toggle
            label="Show CTA Button"
            description="Display a prominent action button in header"
            checked={header.showCta ?? false}
            onChange={(checked) => onUpdate('showCta', checked)}
          />
          
          {header.showCta && (
            <div className="space-y-3 pl-3 border-l-2 border-blue-500/30">
              <Input
                label="Button Text"
                value={header.ctaText || ''}
                onChange={(value) => onUpdate('ctaText', value)}
                placeholder="Get Started"
              />
              <Input
                label="Button URL"
                value={header.ctaUrl || ''}
                onChange={(value) => onUpdate('ctaUrl', value)}
                placeholder="#contact"
              />
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default HeaderContentTab;
