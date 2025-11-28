import React, { useState, type ReactNode } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import {
  HeaderPanel,
  HeroPanel,
  GalleryPanel,
  FooterPanel,
  ThemePanel,
  EffectsPanel,
} from './panels';

type Tab = 'theme' | 'effects' | 'header' | 'hero' | 'gallery' | 'footer';

// Toast notification component
const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-500/90 border-emerald-400',
    error: 'bg-red-500/90 border-red-400',
    info: 'bg-blue-500/90 border-blue-400',
  };

  const icons = {
    success: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div className={`fixed top-4 right-4 z-[100] flex items-center gap-2 px-4 py-3 rounded-lg border text-white text-sm font-medium shadow-lg backdrop-blur-sm animate-fade-in ${colors[type]}`}>
      {icons[type]}
      {message}
    </div>
  );
};

const tabIcons: Record<Tab, ReactNode> = {
  theme: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  effects: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  header: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  hero: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  gallery: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  footer: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
};

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [localSaving, setLocalSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { saveConfig, publishConfig, isDirty, isLoading, isSaving: contextSaving, lastSaved } = useConfig();

  const isSaving = localSaving || contextSaving;

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleSave = async () => {
    if (!isDirty || isLoading || isSaving) return;
    setLocalSaving(true);
    try {
      await saveConfig();
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      console.error('Save failed:', error);
      showToast('Failed to save changes. Please try again.', 'error');
    } finally {
      setLocalSaving(false);
    }
  };

  const handlePublish = async () => {
    if (isLoading || isPublishing) return;
    
    if (isDirty) {
      setLocalSaving(true);
      try {
        await saveConfig();
      } catch (error) {
        console.error('Save failed:', error);
        showToast('Failed to save before publishing.', 'error');
        setLocalSaving(false);
        return;
      }
      setLocalSaving(false);
    }

    setIsPublishing(true);
    try {
      await publishConfig();
      showToast('Site published successfully!', 'success');
    } catch (error) {
      console.error('Publish failed:', error);
      showToast('Failed to publish. Please try again.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const sectionTabs: { id: Tab; label: string }[] = [
    { id: 'header', label: 'Header' },
    { id: 'hero', label: 'Hero' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'footer', label: 'Footer' },
  ];

  const isStylesActive = activeTab === 'theme' || activeTab === 'effects';
  const isSectionsActive = ['header', 'hero', 'gallery', 'footer'].includes(activeTab);

  return (
    <div className="w-80 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 h-full flex flex-col overflow-hidden">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-slate-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-white">Site Editor</h2>
            <p className="text-xs text-slate-400">Visual page builder</p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-white/10 bg-slate-800/30">
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isStylesActive ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tabIcons.theme}
          <span>Styles</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex-1 px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isSectionsActive ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
          <span>Sections</span>
        </button>
      </div>

      {/* Styles Sub-tabs */}
      {isStylesActive && (
        <div className="flex border-b border-white/10 overflow-x-auto bg-slate-900/50 scrollbar-hide">
          <button
            onClick={() => setActiveTab('theme')}
            className={`relative flex-1 px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
              activeTab === 'theme' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Theme
            {activeTab === 'theme' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
          </button>
          <button
            onClick={() => setActiveTab('effects')}
            className={`relative flex-1 px-4 py-2.5 text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200 ${
              activeTab === 'effects' ? 'text-purple-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Effects
            {activeTab === 'effects' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />}
          </button>
        </div>
      )}

      {/* Sections Sub-tabs */}
      {isSectionsActive && (
        <div className="flex border-b border-white/10 overflow-x-auto bg-slate-900/50 scrollbar-hide">
          {sectionTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 px-3 py-2.5 text-xs font-medium whitespace-nowrap flex items-center justify-center gap-1 transition-all duration-200 ${
                activeTab === tab.id ? 'text-blue-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tabIcons[tab.id]}
              <span>{tab.label}</span>
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
            </button>
          ))}
        </div>
      )}

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {activeTab === 'theme' && <ThemePanel />}
        {activeTab === 'effects' && <EffectsPanel />}
        {activeTab === 'header' && <HeaderPanel />}
        {activeTab === 'hero' && <HeroPanel />}
        {activeTab === 'gallery' && <GalleryPanel />}
        {activeTab === 'footer' && <FooterPanel />}
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="p-4 border-t border-white/10 bg-slate-900/95 space-y-3">
        {/* Status indicator */}
        <div className="flex items-center justify-between text-xs">
          <span className={`flex items-center gap-1.5 ${
            isSaving ? 'text-blue-400' : isDirty ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {isSaving ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Auto-saving...
              </>
            ) : (
              <>
                <span className={`w-2 h-2 rounded-full ${isDirty ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                {isDirty ? 'Unsaved changes' : 'All changes saved'}
              </>
            )}
          </span>
          {lastSaved && !isDirty && !isSaving && (
            <span className="text-slate-500">{lastSaved.toLocaleTimeString()}</span>
          )}
        </div>

        {/* Save and Publish Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!isDirty || isLoading || isSaving}
            className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isDirty && !isSaving
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25'
                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Draft
              </>
            )}
          </button>
          <button
            onClick={handlePublish}
            disabled={isLoading || isPublishing}
            className={`flex-1 px-4 py-2.5 text-sm rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isPublishing 
                ? 'bg-slate-700/50 text-slate-400'
                : 'bg-linear-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/25'
            }`}
          >
            {isPublishing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Publish Live
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
