/**
 * SectionsPanel Component
 * Manages section visibility and order
 */

import React, { useCallback, type ReactNode } from 'react';
import { LayoutTemplate, Star, Sparkles, Image, MapPin, FileText } from 'lucide-react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { useEditor } from '../../../../contexts/EditorContext';
import { PanelHeader, Section, SectionHeader, Toggle, InfoBox } from '../shared';
import type { SectionsConfig } from '../../../../types/config';

type SectionKey = keyof Omit<SectionsConfig, 'mobile' | 'tablet'>;

interface SectionItemProps {
  id: SectionKey;
  name: string;
  description: string;
  icon: ReactNode;
  enabled: boolean;
  order: number;
  canDisable: boolean;
  onToggle: (enabled: boolean) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const SectionItem: React.FC<SectionItemProps> = ({
  name,
  description,
  icon,
  enabled,
  canDisable,
  onToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  return (
    <div className={`p-4 rounded-lg border transition-all ${
      enabled 
        ? 'bg-slate-800/50 border-white/10' 
        : 'bg-slate-900/50 border-white/5 opacity-60'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-blue-400">{icon}</span>
        <div className="flex-1">
          <h4 className="font-medium text-white">{name}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Reorder buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst || !enabled}
              className={`p-1 rounded transition-colors ${
                isFirst || !enabled 
                  ? 'text-slate-600 cursor-not-allowed' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast || !enabled}
              className={`p-1 rounded transition-colors ${
                isLast || !enabled 
                  ? 'text-slate-600 cursor-not-allowed' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          {/* Enable toggle */}
          {canDisable ? (
            <Toggle
              label=""
              checked={enabled}
              onChange={onToggle}
              compact
            />
          ) : (
            <span className="text-xs text-slate-500 italic">Required</span>
          )}
        </div>
      </div>
    </div>
  );
};

const sectionMeta: Record<SectionKey, { name: string; description: string; icon: ReactNode; canDisable: boolean }> = {
  header: { name: 'Header', description: 'Navigation bar with logo and links', icon: <LayoutTemplate className="w-5 h-5" />, canDisable: false },
  hero: { name: 'Hero', description: 'Main hero section with title and media', icon: <Star className="w-5 h-5" />, canDisable: true },
  features: { name: 'Features', description: 'Feature cards with effects', icon: <Sparkles className="w-5 h-5" />, canDisable: true },
  gallery: { name: 'Gallery', description: 'Media gallery with filters', icon: <Image className="w-5 h-5" />, canDisable: true },
  location: { name: 'Location', description: 'Google Maps and contact info', icon: <MapPin className="w-5 h-5" />, canDisable: true },
  footer: { name: 'Footer', description: 'Footer with links and social media', icon: <FileText className="w-5 h-5" />, canDisable: false },
};

export const SectionsPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const { device } = useEditor();
  
  // Calculate effective sections based on device
  const sections = React.useMemo(() => {
    if (device === 'desktop') return config.sections;
    
    const deviceOverrides = config.sections[device] || {};
    const effectiveSections = { ...config.sections };
    
    // Apply overrides
    Object.keys(deviceOverrides).forEach((key) => {
      const sectionKey = key as SectionKey;
      if (effectiveSections[sectionKey]) {
        effectiveSections[sectionKey] = {
          ...effectiveSections[sectionKey],
          ...deviceOverrides[sectionKey],
        };
      }
    });
    
    return effectiveSections;
  }, [config.sections, device]);

  // Get sorted sections by order
  const sortedSections = Object.entries(sections)
    .filter(([key]) => key !== 'mobile' && key !== 'tablet')
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key]) => key as SectionKey);

  const handleToggle = useCallback((key: SectionKey, enabled: boolean) => {
    if (device === 'desktop') {
      setConfig({
        ...config,
        sections: {
          ...config.sections,
          [key]: { ...config.sections[key], enabled },
        },
      });
    } else {
      const deviceOverrides = config.sections[device] || {};
      setConfig({
        ...config,
        sections: {
          ...config.sections,
          [device]: {
            ...deviceOverrides,
            [key]: { 
               ...(deviceOverrides[key] || config.sections[key]),
               enabled 
            },
          },
        },
      });
    }
  }, [config, setConfig, device]);

  const handleMove = useCallback((key: SectionKey, direction: 'up' | 'down') => {
    const currentOrder = sections[key].order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the section to swap with
    const swapKey = sortedSections.find(k => sections[k].order === targetOrder);
    
    if (!swapKey) return;
    
    if (device === 'desktop') {
      setConfig({
        ...config,
        sections: {
          ...config.sections,
          [key]: { ...config.sections[key], order: targetOrder },
          [swapKey]: { ...config.sections[swapKey], order: currentOrder },
        },
      });
    } else {
      const deviceOverrides = config.sections[device] || {};
      
      setConfig({
        ...config,
        sections: {
          ...config.sections,
          [device]: {
            ...deviceOverrides,
            [key]: { 
              ...(deviceOverrides[key] || config.sections[key]),
              order: targetOrder 
            },
            [swapKey]: { 
              ...(deviceOverrides[swapKey] || config.sections[swapKey]),
              order: currentOrder 
            },
          },
        },
      });
    }
  }, [config, sections, setConfig, device, sortedSections]);

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Manage Sections"
        subtitle={`Enable, disable, and reorder page sections (${device})`}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <InfoBox variant="info">
          Toggle sections on/off to show or hide them. Use the arrows to reorder sections on your page.
        </InfoBox>
        
        <Section className="mt-4">
          <SectionHeader title="Page Sections" />
          <div className="space-y-2">
            {sortedSections.map((key, index) => {
              const meta = sectionMeta[key];
              const sectionConfig = sections[key];
              return (
                <SectionItem
                  key={key}
                  id={key}
                  name={meta.name}
                  description={meta.description}
                  icon={meta.icon}
                  enabled={sectionConfig.enabled}
                  order={sectionConfig.order}
                  canDisable={meta.canDisable}
                  onToggle={(enabled) => handleToggle(key, enabled)}
                  onMoveUp={() => handleMove(key, 'up')}
                  onMoveDown={() => handleMove(key, 'down')}
                  isFirst={index === 0}
                  isLast={index === sortedSections.length - 1}
                />
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SectionsPanel;
