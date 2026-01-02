import React from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { useConfig } from '../../contexts/ConfigContext';
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
  const { isDirty, isSaving, lastSaved, isLoading } = useConfig();

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
      <div className="p-4 border-b border-white/10 flex justify-between items-center gap-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Properties</h2>

        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
          <span
            className={`flex items-center gap-1.5 ${
              isLoading ? 'text-slate-500' : isSaving ? 'text-blue-400' : isDirty ? 'text-amber-400' : 'text-emerald-400'
            }`}
            aria-live="polite"
          >
            {isLoading ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </>
            ) : isSaving ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Auto-saving...
              </>
            ) : (
              <>
                <span
                  className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}
                  aria-hidden="true"
                />
                {isDirty ? 'Unsaved changes' : 'All changes saved'}
              </>
            )}
          </span>

          {lastSaved && !isDirty && !isSaving && !isLoading && (
            <span className="text-slate-500">{lastSaved.toLocaleTimeString()}</span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderPanel()}
      </div>
    </div>
  );
};
