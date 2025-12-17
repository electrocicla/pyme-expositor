import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { 
  Layout, 
  Image, 
  Grid, 
  MapPin, 
  Palette, 
  Sparkles,
  Menu,
  Monitor,
  Layers
} from 'lucide-react';

const sections = [
  { id: 'header', label: 'Header', icon: <Menu size={18} /> },
  { id: 'hero', label: 'Hero Section', icon: <Monitor size={18} /> },
  { id: 'features', label: 'Features', icon: <Grid size={18} /> },
  { id: 'gallery', label: 'Gallery', icon: <Image size={18} /> },
  { id: 'media', label: 'Media', icon: <Layers size={18} /> },
  { id: 'location', label: 'Location', icon: <MapPin size={18} /> },
  { id: 'footer', label: 'Footer', icon: <Layout size={18} /> },
];

const settings = [
  { id: 'theme', label: 'Theme & Colors', icon: <Palette size={18} /> },
  { id: 'effects', label: 'Global Effects', icon: <Sparkles size={18} /> },
];

export const LeftSidebar: React.FC = () => {
  const { activeSection, setActiveSection, isLeftPanelOpen } = useEditor();

  if (!isLeftPanelOpen) return null;

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Structure</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-4 mb-2">
          <span className="text-xs font-medium text-slate-500 uppercase">Page Sections</span>
        </div>
        <div className="space-y-1 px-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
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
              onClick={() => setActiveSection(item.id as any)}
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
      
      <div className="p-4 border-t border-white/10 bg-slate-900/50">
        <div className="text-xs text-slate-500 text-center">
          v1.0.0 • Editor Mode
        </div>
      </div>
    </div>
  );
};
