/**
 * HeaderBehaviorTab Component
 * Single Responsibility: Manage header behavior settings
 */

import React from 'react';
import { Lightbulb } from 'lucide-react';
import type { HeaderConfig } from './constants';
import { Toggle, SectionHeader, Section, InfoBox } from '../shared';

interface HeaderBehaviorTabProps {
  header: HeaderConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const HeaderBehaviorTab: React.FC<HeaderBehaviorTabProps> = ({ header, onUpdate }) => {
  return (
    <div className="space-y-6">
      <Section>
        <SectionHeader
          title="Header Behavior"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          }
        />
        
        <div className="space-y-4">
          <Toggle
            label="Sticky Header"
            description="Keep header fixed at top when scrolling"
            checked={header.sticky ?? true}
            onChange={(checked) => onUpdate('sticky', checked)}
          />
          
          <Toggle
            label="Transparent Background"
            description="Header starts transparent, fills on scroll"
            checked={header.transparent ?? false}
            onChange={(checked) => onUpdate('transparent', checked)}
          />
          
          <Toggle
            label="Backdrop Blur"
            description="Apply glass blur effect to header"
            checked={header.blur ?? true}
            onChange={(checked) => onUpdate('blur', checked)}
          />
          
          <Toggle
            label="Hide on Scroll Down"
            description="Header hides when scrolling down, shows on scroll up"
            checked={header.hideOnScroll ?? false}
            onChange={(checked) => onUpdate('hideOnScroll', checked)}
          />
        </div>
      </Section>

      {/* Tip */}
      <InfoBox variant="info">
        <div className="flex items-center gap-2 text-xs text-blue-300">
          <Lightbulb className="w-4 h-4 shrink-0" />
          These behaviors combine together. Try sticky + transparent + blur for a modern glassmorphism effect.
        </div>
      </InfoBox>
    </div>
  );
};

export default HeaderBehaviorTab;
