import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import {
  HeaderPanel,
  HeroPanel,
  GalleryPanel,
  FooterPanel,
  ThemePanel,
  EffectsPanel,
  MediaPanel,
  FeaturesPanel,
  LocationPanel,
  SectionsPanel,
} from './panels';

export const RightSidebar: React.FC = () => {
  const { activeSection, isRightPanelOpen } = useEditor();

  if (!isRightPanelOpen) return null;

  const renderPanel = () => {
    switch (activeSection) {
      case 'header':
        return <HeaderPanel />;
      case 'hero':
        return <HeroPanel />;
      case 'features':
        return <FeaturesPanel />;
      case 'gallery':
        return <GalleryPanel />;
      case 'media':
        return <MediaPanel />;
      case 'location':
        return <LocationPanel />;
      case 'footer':
        return <FooterPanel />;
      case 'theme':
        return <ThemePanel />;
      case 'effects':
        return <EffectsPanel />;
      case 'sections':
        return <SectionsPanel />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
            <p>Select a section from the left sidebar to edit its properties.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-l border-white/10">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Properties</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderPanel()}
      </div>
    </div>
  );
};
