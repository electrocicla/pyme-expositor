/**
 * FooterLegalTab Component
 * Single Responsibility: Manage footer legal links (Privacy Policy, Terms, etc.)
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { FooterConfig, LegalLink } from './constants';
import { quickLegalLinks } from './constants';
import { SectionHeader, Section, InfoBox } from '../shared';

interface FooterLegalTabProps {
  footer: FooterConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const FooterLegalTab: React.FC<FooterLegalTabProps> = ({ footer, onUpdate }) => {
  const legalLinks = footer.legalLinks || [];

  const addLegalLink = () => {
    const newLink: LegalLink = { 
      id: `legal-${Date.now()}`, 
      label: 'New Legal Link', 
      url: '#' 
    };
    onUpdate('legalLinks', [...legalLinks, newLink]);
  };

  const updateLegalLink = (index: number, field: 'label' | 'url', value: string) => {
    const updated = [...legalLinks];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate('legalLinks', updated);
  };

  const removeLegalLink = (index: number) => {
    onUpdate('legalLinks', legalLinks.filter((_: LegalLink, i: number) => i !== index));
  };

  const addQuickLink = (item: typeof quickLegalLinks[number]) => {
    if (!legalLinks.some((l: LegalLink) => l.label === item.label)) {
      onUpdate('legalLinks', [...legalLinks, { id: `legal-${Date.now()}`, ...item }]);
    }
  };

  return (
    <div className="space-y-6">
      <Section>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader
            title="Legal Links"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <button
            onClick={addLegalLink}
            className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition-all"
          >
            <Plus className="w-3 h-3" />
            Add Link
          </button>
        </div>

        <InfoBox>
          Add links to your Privacy Policy, Terms of Service, and other legal pages.
        </InfoBox>

        {legalLinks.length === 0 ? (
          <div className="text-center py-6 text-white/40 text-xs border border-dashed border-slate-700/50 rounded-lg">
            No legal links added yet
          </div>
        ) : (
          <div className="space-y-2">
            {legalLinks.map((link: LegalLink, index: number) => (
              <div 
                key={link.id} 
                className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg border border-slate-700/30"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLegalLink(index, 'label', e.target.value)}
                  placeholder="Link Label (e.g., Privacy Policy)"
                  className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLegalLink(index, 'url', e.target.value)}
                  placeholder="/privacy"
                  className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={() => removeLegalLink(index)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                  title="Remove link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Quick Add Section */}
      <Section>
        <SectionHeader
          title="Quick Add"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <div className="flex flex-wrap gap-2">
          {quickLegalLinks.map((item) => {
            const isAdded = legalLinks.some((l: LegalLink) => l.label === item.label);
            return (
              <button
                key={item.label}
                onClick={() => addQuickLink(item)}
                disabled={isAdded}
                className={`text-xs px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                  isAdded
                    ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                    : 'bg-slate-800/50 border border-slate-700/50 text-white/70 hover:border-blue-500/50 hover:text-blue-400'
                }`}
              >
                {isAdded && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

export default FooterLegalTab;
