/**
 * FooterSocialTab Component
 * Single Responsibility: Manage footer social media links
 */

import React from 'react';
import { Share2, Eye } from 'lucide-react';
import { socialPlatforms, type FooterConfig, type SocialKey } from './constants';
import { SectionHeader, Section, InfoBox } from '../shared';

interface FooterSocialTabProps {
  footer: FooterConfig;
  onUpdate: (key: string, value: unknown) => void;
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
          icon={<Share2 className="w-3.5 h-3.5" />}
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
          {socialPlatforms.map((platform) => {
            const IconComponent = platform.icon;
            const isActive = Boolean(socials[platform.key]);
            
            return (
              <div 
                key={platform.key}
                className={`p-3 rounded-lg border transition-all ${
                  isActive 
                    ? 'bg-slate-800/60 border-slate-600/50' 
                    : 'bg-slate-900/30 border-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'opacity-100' : 'opacity-40'
                    }`}
                    style={{ backgroundColor: isActive ? `${platform.color}20` : 'transparent' }}
                  >
                    <IconComponent 
                      className="w-4 h-4" 
                      style={{ color: isActive ? platform.color : 'rgba(255,255,255,0.5)' }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-white/50'
                  }`}>
                    {platform.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <input
                  type="url"
                  value={socials[platform.key] || ''}
                  onChange={(e) => updateSocial(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700/50 rounded-md text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            );
          })}
        </div>
      </Section>

      {/* Preview of active social links */}
      {activeSocialsCount > 0 && (
        <Section>
          <SectionHeader
            title="Preview"
            icon={<Eye className="w-3.5 h-3.5" />}
          />
          <div className="flex flex-wrap gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/30">
            {socialPlatforms
              .filter((p) => socials[p.key])
              .map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <a
                    key={platform.key}
                    href={socials[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: `${platform.color}20` }}
                    title={platform.label}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: platform.color }}
                    />
                  </a>
                );
              })}
          </div>
        </Section>
      )}
    </div>
  );
};

export default FooterSocialTab;
