import React, { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import type { SectionType } from '../../contexts/EditorContext';
import { 
  Layout, 
  Image, 
  Grid, 
  MapPin, 
  Palette, 
  Sparkles,
  Menu,
  Monitor,
  Layers,
  Box,
} from 'lucide-react';
import { LayoutSelector } from './Layout/LayoutSelector';
import { ElementPalette } from './Layout/ElementPalette';

const sections = [
  { id: 'header' as SectionType, label: 'Header', icon: <Menu size={18} /> },
  { id: 'hero' as SectionType, label: 'Hero Section', icon: <Monitor size={18} /> },
  { id: 'features' as SectionType, label: 'Features', icon: <Grid size={18} /> },
  { id: 'gallery' as SectionType, label: 'Gallery', icon: <Image size={18} /> },
  { id: 'media' as SectionType, label: 'Media', icon: <Layers size={18} /> },
  { id: 'location' as SectionType, label: 'Location', icon: <MapPin size={18} /> },
  { id: 'footer' as SectionType, label: 'Footer', icon: <Layout size={18} /> },
];

const settings = [
  { id: 'theme' as SectionType, label: 'Theme & Colors', icon: <Palette size={18} /> },
  { id: 'effects' as SectionType, label: 'Global Effects', icon: <Sparkles size={18} /> },
];

type TabType = 'sections' | 'layouts' | 'elements';

export const LeftSidebar: React.FC = () => {
  const { activeSection, setActiveSection, isLeftPanelOpen, editorMode } = useEditor();
  const [activeTab, setActiveTab] = useState<TabType>('sections');

  if (!isLeftPanelOpen) return null;

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-white/10">
      {/* Tab Navigation */}
      {editorMode === 'layout' && (
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('sections')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'sections'
                ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }
            `}
            aria-pressed={activeTab === 'sections'}
          >
            <Menu size={16} />
            Structure
          </button>
          <button
            onClick={() => setActiveTab('layouts')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'layouts'
                ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }
            `}
            aria-pressed={activeTab === 'layouts'}
          >
            <Layout size={16} />
            Layouts
          </button>
          <button
            onClick={() => setActiveTab('elements')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors
              ${activeTab === 'elements'
                ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }
            `}
            aria-pressed={activeTab === 'elements'}
          >
            <Box size={16} />
            Elements
          </button>
        </div>
      )}
      
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {editorMode === 'layout' ? (
          <>
            {activeTab === 'sections' && (
              <div className="h-full overflow-y-auto">
                <div className="p-4 border-b border-white/10">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Structure</h2>
                </div>
                
                <div className="py-2">
                  <div className="px-4 mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">Page Sections</span>
                  </div>
                  <div className="space-y-1 px-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id as SectionType)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {section.icon}
                        {section.label}
                      </button>
                    ))}
                  </div>

                  <div className="px-4 mt-6 mb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">Global Settings</span>
                  </div>
                  <div className="space-y-1 px-2">
                    {settings.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id as SectionType)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layouts' && <LayoutSelector />}
            {activeTab === 'elements' && <ElementPalette />}
          </>
        ) : (
          // Content mode - original functionality
          <div className="h-full overflow-y-auto">
            <div className="p-4 border-b border-white/10">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Structure</h2>
            </div>
            
            <div className="py-2">
              <div className="px-4 mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase">Page Sections</span>
              </div>
              <div className="space-y-1 px-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as SectionType)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {section.icon}
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="px-4 mt-6 mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase">Global Settings</span>
              </div>
              <div className="space-y-1 px-2">
                {settings.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SectionType)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-white/10 bg-slate-900/50">
        <div className="text-xs text-slate-500 text-center">
          v1.0.0 • {editorMode === 'layout' ? 'Layout Mode' : 'Editor Mode'}
        </div>
      </div>
    </div>
  );
};
