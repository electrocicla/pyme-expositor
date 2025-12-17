/**
 * HeaderLinksTab Component
 * Single Responsibility: Manage header navigation links
 */

import React from 'react';
import { Plus, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import type { HeaderConfig } from './constants';
import { SectionHeader, Section } from '../shared';

interface HeaderLinksTabProps {
  header: HeaderConfig;
  onUpdate: (key: string, value: unknown) => void;
}

export const HeaderLinksTab: React.FC<HeaderLinksTabProps> = ({ header, onUpdate }) => {
  const handleLinkChange = (id: string, key: 'label' | 'url', value: string) => {
    const newLinks = header.links.map((link) =>
      link.id === id ? { ...link, [key]: value } : link
    );
    onUpdate('links', newLinks);
  };

  const addLink = () => {
    const newLink = { id: Date.now().toString(), label: 'New Link', url: '#' };
    onUpdate('links', [...header.links, newLink]);
  };

  const removeLink = (id: string) => {
    onUpdate('links', header.links.filter((link) => link.id !== id));
  };

  const moveLink = (id: string, direction: 'up' | 'down') => {
    const links = [...header.links];
    const index = links.findIndex((l) => l.id === id);
    if (direction === 'up' && index > 0) {
      [links[index], links[index - 1]] = [links[index - 1], links[index]];
    } else if (direction === 'down' && index < links.length - 1) {
      [links[index], links[index + 1]] = [links[index + 1], links[index]];
    }
    onUpdate('links', links);
  };

  return (
    <div className="space-y-6">
      <Section>
        <SectionHeader
          title="Navigation Links"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          }
        />
        
        <div className="space-y-2">
          {header.links.map((link, index) => (
            <div
              key={link.id}
              className="group p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 font-mono">#{index + 1}</span>
                <div className="flex-1" />
                <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
                  <button
                    onClick={() => moveLink(link.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded disabled:opacity-30"
                    title="Move up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveLink(link.id, 'down')}
                    disabled={index === header.links.length - 1}
                    className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded disabled:opacity-30"
                    title="Move down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                    title="Remove link"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleLinkChange(link.id, 'label', e.target.value)}
                  placeholder="Label"
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                  placeholder="#section or URL"
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={addLink}
          className="w-full py-2.5 text-sm text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 hover:border-blue-500/50 transition-all flex items-center justify-center gap-2 mt-3"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>

        <div className="text-xs text-white/40 text-center mt-3">
          Hover to reorder • Use #section for same-page links
        </div>
      </Section>
    </div>
  );
};

export default HeaderLinksTab;
