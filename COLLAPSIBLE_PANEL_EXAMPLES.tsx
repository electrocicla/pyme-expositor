// Example Usage of CollapsiblePanel Component
// This demonstrates how to use the new reusable CollapsiblePanel component in panels

import { CollapsiblePanel } from '../shared';
import { Settings, Package, Zap } from 'lucide-react';

export const ExamplePanelUsage: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Basic Usage - Default appearance */}
      <CollapsiblePanel
        title="Basic Settings"
        defaultOpen={true}
      >
        <p>Simple content that expands and collapses smoothly.</p>
      </CollapsiblePanel>

      {/* With Icon and Description */}
      <CollapsiblePanel
        title="Header Configuration"
        icon={<Settings className="w-4 h-4 text-blue-400" />}
        description="Configure navigation and branding"
        colorScheme="primary"
        defaultOpen={false}
      >
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Header title" 
            className="w-full px-3 py-2 rounded bg-slate-700 text-white"
          />
          <input 
            type="text" 
            placeholder="Subtitle" 
            className="w-full px-3 py-2 rounded bg-slate-700 text-white"
          />
        </div>
      </CollapsiblePanel>

      {/* With Badge and Color Scheme */}
      <CollapsiblePanel
        title="Advanced Features"
        icon={<Zap className="w-4 h-4 text-purple-400" />}
        badge="Pro"
        colorScheme="success"
        defaultOpen={true}
      >
        <p className="text-sm text-slate-300">
          Premium features for advanced users with real-time preview.
        </p>
      </CollapsiblePanel>

      {/* With onChange Callback */}
      <CollapsiblePanel
        title="Section Visibility"
        icon={<Package className="w-4 h-4 text-emerald-400" />}
        colorScheme="warning"
        onChange={(isOpen) => {
          if (isOpen) {
            console.warn('Section expanded - load more data if needed');
          }
        }}
      >
        <label className="flex items-center gap-2">
          <input type="checkbox" className="rounded" />
          <span>Visible on page</span>
        </label>
      </CollapsiblePanel>

      {/* Color Scheme Examples */}
      <div className="grid grid-cols-2 gap-4">
        <CollapsiblePanel title="Default" colorScheme="default">
          <span className="text-xs">Standard appearance</span>
        </CollapsiblePanel>
        
        <CollapsiblePanel title="Primary" colorScheme="primary">
          <span className="text-xs">Blue themed</span>
        </CollapsiblePanel>
        
        <CollapsiblePanel title="Success" colorScheme="success">
          <span className="text-xs">Green themed</span>
        </CollapsiblePanel>
        
        <CollapsiblePanel title="Warning" colorScheme="warning">
          <span className="text-xs">Amber themed</span>
        </CollapsiblePanel>
      </div>
    </div>
  );
};

// Integration in Existing Panels Example
// src/components/Editor/panels/SomePanel/index.tsx

import React, { useState } from 'react';
import { CollapsiblePanel } from '../shared';
import { useConfig } from '../../../../contexts/ConfigContext';

export const SomePanelWithCollapsibles: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [expandedSections, setExpandedSections] = useState({
    appearance: true,
    content: false,
    behavior: false,
  });

  const handleSectionToggle = (section: string, isOpen: boolean) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: isOpen,
    }));
    // Optional: Analytics or state tracking
    console.warn(`${section} section ${isOpen ? 'opened' : 'closed'}`);
  };

  return (
    <div className="space-y-3">
      <CollapsiblePanel
        title="Appearance"
        colorScheme="primary"
        defaultOpen={expandedSections.appearance}
        onChange={(isOpen) => handleSectionToggle('appearance', isOpen)}
      >
        {/* Appearance controls */}
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Font family"
            value={config.someField || ''}
            onChange={(e) => setConfig({ ...config, someField: e.target.value })}
          />
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Content"
        colorScheme="success"
        defaultOpen={expandedSections.content}
        onChange={(isOpen) => handleSectionToggle('content', isOpen)}
      >
        {/* Content controls */}
      </CollapsiblePanel>

      <CollapsiblePanel
        title="Behavior"
        colorScheme="warning"
        defaultOpen={expandedSections.behavior}
        onChange={(isOpen) => handleSectionToggle('behavior', isOpen)}
      >
        {/* Behavior controls */}
      </CollapsiblePanel>
    </div>
  );
};

// Sidebar Collapse Feature Showcase
// The main sidebar now supports collapsing with this structure:

/*
EditorLayout (state management)
├── Sidebar (receives isExpanded prop)
│   ├── Header with collapse button
│   ├── Tabs (hidden when collapsed)
│   ├── Content panels (hidden when collapsed)
│   └── Action buttons (hidden when collapsed)
│
└── Preview Area (expands when sidebar collapses)

CSS Animation Flow:
- Sidebar container: transition-all duration-300
- When collapsed: w-0 (overflow: hidden)
- When expanded: w-80 (full width)
- Chevron button: transition-transform duration-300 with rotate-180

User Experience:
1. Click collapse button in sidebar header
2. Sidebar smoothly animates to 0 width
3. Preview area expands to fill space
4. Only collapse button visible on far left
5. Click again to expand and return to normal layout
*/
