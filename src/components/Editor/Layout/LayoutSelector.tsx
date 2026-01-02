/**
 * Layout Selector Panel
 * Displays available layout templates for selection
 */

import React from 'react';
import { Layout, Check } from 'lucide-react';
import { LAYOUT_TEMPLATES } from './LayoutTemplates';
import { useLayout } from '../../../contexts/LayoutContext';
import type { LayoutTemplateType } from '../../../types/layout';
import { SavedLayoutsPanel } from './SavedLayoutsPanel';

export const LayoutSelector: React.FC = () => {
  const { activeTemplate, selectTemplate } = useLayout();

  const handleSelectTemplate = (templateId: LayoutTemplateType) => {
    if (window.confirm('Changing the layout will clear all placed elements. Continue?')) {
      selectTemplate(templateId);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
              Layouts
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {LAYOUT_TEMPLATES.map((template) => {
              const isActive = activeTemplate === template.id;
              
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`
                    relative p-4 rounded-lg border-2 transition-all duration-200
                    ${isActive
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    }
                  `}
                  aria-pressed={isActive}
                  aria-label={`Select ${template.name} layout`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute top-2 right-2">
                      <Check size={16} className="text-blue-400" />
                    </div>
                  )}

                  {/* Layout preview */}
                  <div className="w-full aspect-square mb-3 bg-slate-900 rounded flex items-center justify-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full p-2"
                      aria-hidden="true"
                    >
                      <path
                        d={template.preview}
                        fill="currentColor"
                        className={isActive ? 'text-blue-400' : 'text-slate-600'}
                      />
                    </svg>
                  </div>

                  {/* Template info */}
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-200 mb-1">
                      {template.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {template.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              Select a layout template to organize your workspace. You can drag and drop elements into the layout areas.
            </p>
          </div>
        </div>

        <SavedLayoutsPanel />
      </div>
    </div>
  );
};
