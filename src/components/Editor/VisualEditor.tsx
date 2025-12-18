import React, { useState, useCallback } from 'react';
import type { SiteConfig, HeroConfig } from '../../types/config';
import { useConfig } from '../../contexts/ConfigContext';
import Landing from '../Landing/index';
import { api } from '../../utils/api';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { UndoRedoControls } from './UndoRedoControls';
import {
  Menu,
  Monitor,
  Image,
  Layout,
  Palette,
  Save,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';

type EditorPanel = 'header' | 'hero' | 'gallery' | 'footer' | 'theme';

const panels = [
  { id: 'header' as EditorPanel, label: 'Header', icon: Menu },
  { id: 'hero' as EditorPanel, label: 'Hero', icon: Monitor },
  { id: 'gallery' as EditorPanel, label: 'Gallery', icon: Image },
  { id: 'footer' as EditorPanel, label: 'Footer', icon: Layout },
  { id: 'theme' as EditorPanel, label: 'Theme', icon: Palette },
];

interface VisualEditorProps {
  className?: string;
  onSave?: (config: SiteConfig) => void;
  onPublish?: (config: SiteConfig) => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  className = '',
  onSave,
  onPublish
}) => {
  const { config, setConfig } = useConfig();
  const [activePanel, setActivePanel] = useState<EditorPanel>('hero');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  const updateConfig = useCallback(<K extends keyof SiteConfig>(
    section: K,
    updates: Partial<SiteConfig[K]>
  ) => {
    setConfig({
      ...config,
      [section]: { ...config[section], ...updates }
    });
  }, [config, setConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.saveConfig(config);
      onSave?.(config);
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await api.saveConfig(config);
      await api.publishConfig();
      onPublish?.(config);
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={config.hero.title}
                onChange={e => updateConfig('hero', { title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter hero title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subtitle
              </label>
              <textarea
                value={config.hero.subtitle}
                onChange={e => updateConfig('hero', { subtitle: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24 resize-none"
                placeholder="Enter hero subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Call-to-Action Text
              </label>
              <input
                type="text"
                value={config.hero.ctaText}
                onChange={e => updateConfig('hero', { ctaText: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter CTA text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Call-to-Action URL
              </label>
              <input
                type="url"
                value={config.hero.ctaUrl}
                onChange={e => updateConfig('hero', { ctaUrl: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Template
              </label>
              <select
                value={config.hero.template}
                onChange={e => updateConfig('hero', { template: e.target.value as HeroConfig['template'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="simple">Simple</option>
                <option value="split">Split</option>
                <option value="full-screen">Full Screen</option>
                <option value="media-background">Media Background</option>
                <option value="media-overlay">Media Overlay</option>
                <option value="dual-media">Dual Media</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Effect
              </label>
              <select
                value={config.hero.effect}
                onChange={e => updateConfig('hero', { effect: e.target.value as HeroConfig['effect'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="none">None</option>
                <option value="gradient">Gradient</option>
                <option value="parallax">Parallax</option>
                <option value="tilt">Tilt</option>
                <option value="glass">Glass</option>
                <option value="fade">Fade</option>
                <option value="blur-in">Blur In</option>
                <option value="splash">Splash</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Text Alignment
              </label>
              <select
                value={config.hero.textAlign}
                onChange={e => updateConfig('hero', { textAlign: e.target.value as HeroConfig['textAlign'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Vertical Alignment
              </label>
              <select
                value={config.hero.verticalAlign}
                onChange={e => updateConfig('hero', { verticalAlign: e.target.value as HeroConfig['verticalAlign'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="top">Top</option>
                <option value="center">Center</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={config.header.title}
                onChange={e => updateConfig('header', { title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Site title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Layout
              </label>
              <select
                value={config.header.layout}
                onChange={e => updateConfig('header', { layout: e.target.value as SiteConfig['header']['layout'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="centered">Centered</option>
                <option value="left-logo">Left Logo</option>
                <option value="compact">Compact</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Logo Size
              </label>
              <select
                value={config.header.logoSize}
                onChange={e => updateConfig('header', { logoSize: e.target.value as SiteConfig['header']['logoSize'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="xs">Extra Small</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">Extra Large</option>
                <option value="2xl">2X Large</option>
                <option value="3xl">3X Large</option>
              </select>
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={config.gallery.title}
                onChange={e => updateConfig('gallery', { title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Gallery title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Layout
              </label>
              <select
                value={config.gallery.layout}
                onChange={e => updateConfig('gallery', { layout: e.target.value as SiteConfig['gallery']['layout'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="masonry">Masonry</option>
                <option value="carousel">Carousel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Columns
              </label>
              <select
                value={config.gallery.columns}
                onChange={e => updateConfig('gallery', { columns: e.target.value as SiteConfig['gallery']['columns'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="2">2 Columns</option>
                <option value="3">3 Columns</option>
                <option value="4">4 Columns</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showFilters"
                checked={config.gallery.showFilters}
                onChange={e => updateConfig('gallery', { showFilters: e.target.checked })}
                className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showFilters" className="text-sm text-slate-300">
                Show Filters
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="lightbox"
                checked={config.gallery.lightbox}
                onChange={e => updateConfig('gallery', { lightbox: e.target.checked })}
                className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="lightbox" className="text-sm text-slate-300">
                Enable Lightbox
              </label>
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Layout
              </label>
              <select
                value={config.footer.layout}
                onChange={e => updateConfig('footer', { layout: e.target.value as SiteConfig['footer']['layout'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="simple">Simple</option>
                <option value="columns">Columns</option>
                <option value="centered">Centered</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={config.footer.tagline || ''}
                onChange={e => updateConfig('footer', { tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Footer tagline"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showNewsletter"
                checked={config.footer.showNewsletter}
                onChange={e => updateConfig('footer', { showNewsletter: e.target.checked })}
                className="rounded border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="showNewsletter" className="text-sm text-slate-300">
                Show Newsletter Signup
              </label>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={config.theme.primaryColor}
                onChange={e => updateConfig('theme', { primaryColor: e.target.value })}
                className="w-full h-10 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Secondary Color
              </label>
              <input
                type="color"
                value={config.theme.secondaryColor}
                onChange={e => updateConfig('theme', { secondaryColor: e.target.value })}
                className="w-full h-10 bg-slate-800 border border-slate-600 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Font Family
              </label>
              <select
                value={config.theme.fontFamily}
                onChange={e => updateConfig('theme', { fontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Border Radius
              </label>
              <select
                value={config.theme.borderRadius}
                onChange={e => updateConfig('theme', { borderRadius: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="0rem">Sharp</option>
                <option value="0.25rem">Small</option>
                <option value="0.5rem">Medium</option>
                <option value="0.75rem">Large</option>
                <option value="1rem">Extra Large</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mode
              </label>
              <select
                value={config.theme.mode}
                onChange={e => updateConfig('theme', { mode: e.target.value as SiteConfig['theme']['mode'] })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-slate-400 py-8">
            Select a panel to configure
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen bg-slate-950 text-white ${className}`}>
      {/* Sidebar */}
      <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white mb-2">Visual Editor</h2>
          <p className="text-sm text-slate-400">Configure your site sections</p>
        </div>

        {/* Panel Tabs */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2 mb-6">
            {panels.map((panel) => {
              const Icon = panel.icon;
              return (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activePanel === panel.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {panel.label}
                </button>
              );
            })}
          </div>

          {/* Panel Content */}
          <div className="space-y-4">
            {renderPanelContent()}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            <Upload size={16} />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex flex-col bg-slate-100">
        {/* Preview Header */}
        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h3 className="font-medium text-slate-900">Live Preview</h3>
            <UndoRedoControls />
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              {isPreviewMode ? <EyeOff size={14} /> : <Eye size={14} />}
              {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto">
          <div className={`transition-all duration-300 ${isPreviewMode ? 'scale-100' : 'scale-95'}`}>
            <Landing />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualEditor;