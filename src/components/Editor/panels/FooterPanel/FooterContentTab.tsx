/**
 * FooterContentTab Component
 * Single Responsibility: Manage footer content (tagline, copyright, contact, newsletter, columns)
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { FooterConfig, FooterColumn } from './constants';
import { SectionHeader, Section, Input, Textarea } from '../shared';

interface FooterContentTabProps {
  footer: FooterConfig;
  onUpdate: (key: string, value: any) => void;
}

export const FooterContentTab: React.FC<FooterContentTabProps> = ({ footer, onUpdate }) => {
  const contact = footer.contact || {};
  const columns = footer.columns || [];

  const updateContact = (field: 'email' | 'phone' | 'address', value: string) => {
    onUpdate('contact', { ...contact, [field]: value });
  };

  // Column management
  const addColumn = () => {
    const newColumn: FooterColumn = { 
      id: `col-${Date.now()}`, 
      title: 'New Column', 
      links: [] 
    };
    onUpdate('columns', [...columns, newColumn]);
  };

  const updateColumn = (index: number, field: keyof FooterColumn, value: any) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate('columns', updated);
  };

  const removeColumn = (index: number) => {
    onUpdate('columns', columns.filter((_: FooterColumn, i: number) => i !== index));
  };

  const addColumnLink = (columnIndex: number) => {
    const updated = [...columns];
    const currentLinks = updated[columnIndex].links || [];
    updated[columnIndex] = {
      ...updated[columnIndex],
      links: [...currentLinks, { id: `link-${Date.now()}`, label: 'New Link', url: '#' }]
    };
    onUpdate('columns', updated);
  };

  const updateColumnLink = (columnIndex: number, linkIndex: number, field: 'label' | 'url', value: string) => {
    const updated = [...columns];
    const links = [...(updated[columnIndex].links || [])];
    links[linkIndex] = { ...links[linkIndex], [field]: value };
    updated[columnIndex] = { ...updated[columnIndex], links };
    onUpdate('columns', updated);
  };

  const removeColumnLink = (columnIndex: number, linkIndex: number) => {
    const updated = [...columns];
    updated[columnIndex] = {
      ...updated[columnIndex],
      links: (updated[columnIndex].links || []).filter((_: any, i: number) => i !== linkIndex)
    };
    onUpdate('columns', updated);
  };

  return (
    <div className="space-y-6">
      {/* Tagline & Copyright */}
      <Section>
        <SectionHeader
          title="Brand Content"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <div className="space-y-3">
          <Input
            label="Tagline"
            value={footer.tagline || ''}
            onChange={(value) => onUpdate('tagline', value)}
            placeholder="A short description about your business..."
          />
          <Input
            label="Copyright Text"
            value={footer.copyrightText || ''}
            onChange={(value) => onUpdate('copyrightText', value)}
            placeholder="© 2024 Your Company. All rights reserved."
          />
        </div>
      </Section>

      {/* Contact Information */}
      <Section>
        <SectionHeader
          title="Contact Information"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <div className="space-y-3">
          <Input
            label="Email"
            type="email"
            value={contact.email || ''}
            onChange={(value) => updateContact('email', value)}
            placeholder="contact@example.com"
          />
          <Input
            label="Phone"
            type="tel"
            value={contact.phone || ''}
            onChange={(value) => updateContact('phone', value)}
            placeholder="+1 (555) 123-4567"
          />
          <Textarea
            label="Address"
            value={contact.address || ''}
            onChange={(value) => updateContact('address', value)}
            placeholder="123 Main St, City, State, ZIP"
            rows={2}
          />
        </div>
      </Section>

      {/* Newsletter Section */}
      {footer.showNewsletter && (
        <Section>
          <SectionHeader
            title="Newsletter"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            }
          />
          <div className="space-y-3">
            <Input
              label="Title"
              value={footer.newsletterTitle || ''}
              onChange={(value) => onUpdate('newsletterTitle', value)}
              placeholder="Subscribe to our newsletter"
            />
            <Textarea
              label="Description"
              value={footer.newsletterDescription || ''}
              onChange={(value) => onUpdate('newsletterDescription', value)}
              placeholder="Get the latest updates and news..."
              rows={2}
            />
          </div>
        </Section>
      )}

      {/* Footer Columns (when layout is 'columns') */}
      {footer.layout === 'columns' && (
        <Section>
          <div className="flex items-center justify-between mb-3">
            <SectionHeader
              title="Footer Columns"
              icon={
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              }
            />
            <button
              onClick={addColumn}
              className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-2 py-1 rounded flex items-center gap-1 transition-all"
            >
              <Plus className="w-3 h-3" />
              Add Column
            </button>
          </div>

          <div className="space-y-3">
            {columns.map((column: FooterColumn, columnIndex: number) => (
              <div 
                key={column.id} 
                className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/30 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={column.title}
                    onChange={(e) => updateColumn(columnIndex, 'title', e.target.value)}
                    placeholder="Column Title"
                    className="flex-1 px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    onClick={() => removeColumn(columnIndex)}
                    className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                    title="Remove column"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Links */}
                <div className="ml-2 space-y-1.5">
                  {(column.links || []).map((link: any, linkIndex: number) => (
                    <div key={link.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateColumnLink(columnIndex, linkIndex, 'label', e.target.value)}
                        placeholder="Link Label"
                        className="flex-1 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateColumnLink(columnIndex, linkIndex, 'url', e.target.value)}
                        placeholder="URL"
                        className="flex-1 px-2 py-1 bg-slate-800/50 border border-slate-700/50 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <button
                        onClick={() => removeColumnLink(columnIndex, linkIndex)}
                        className="p-0.5 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addColumnLink(columnIndex)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Link
                  </button>
                </div>
              </div>
            ))}

            {columns.length === 0 && (
              <div className="text-center py-4 text-white/40 text-xs">
                No columns added yet. Click "Add Column" to create one.
              </div>
            )}
          </div>
        </Section>
      )}
    </div>
  );
};

export default FooterContentTab;
