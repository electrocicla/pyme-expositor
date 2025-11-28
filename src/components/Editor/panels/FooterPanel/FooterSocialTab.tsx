/**
 * FooterSocialTab Component
 * Single Responsibility: Manage footer social media links
 */

import React from 'react';
import { socialPlatforms, type FooterConfig, type SocialKey } from './constants';
import { SectionHeader, Section, Input, InfoBox } from '../shared';

interface FooterSocialTabProps {
  footer: FooterConfig;
  onUpdate: (key: string, value: any) => void;
}

export const FooterSocialTab: React.FC<FooterSocialTabProps> = ({ footer, onUpdate }) => {
  const socials = footer.socials || {};

  const updateSocial = (platform: SocialKey, url: string) => {
    onUpdate('socials', { ...socials, [platform]: url });
  };

  const activeSocialsCount = Object.values(socials).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <Section>
        <SectionHeader
          title="Social Media Links"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          }
        />

        <InfoBox>
          Add your social media profile URLs. Leave empty to hide.
        </InfoBox>

        {/* Active count badge */}
        {activeSocialsCount > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-white/50">Active:</span>
            <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full">
              {activeSocialsCount} platform{activeSocialsCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        <div className="space-y-3">
          {socialPlatforms.map((platform) => (
            <div key={platform.key}>
              <Input
                label={platform.label}
                type="url"
                value={socials[platform.key] || ''}
                onChange={(value) => updateSocial(platform.key, value)}
                placeholder={platform.placeholder}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Preview of active social links */}
      {activeSocialsCount > 0 && (
        <Section>
          <SectionHeader
            title="Preview"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <div className="flex flex-wrap gap-2">
            {socialPlatforms
              .filter((p) => socials[p.key])
              .map((platform) => (
                <span
                  key={platform.key}
                  className="text-xs px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded-md text-white/70"
                >
                  {platform.label}
                </span>
              ))}
          </div>
        </Section>
      )}
    </div>
  );
};

export default FooterSocialTab;
