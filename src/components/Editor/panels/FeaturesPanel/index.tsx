/**
 * FeaturesPanel Component
 * Configures the Features/Interactive section (formerly hardcoded)
 */

import React, { useState, useCallback } from 'react';
import { FileText, Layout, Sparkles } from 'lucide-react';
import { useConfig } from '../../../../contexts/ConfigContext';
import { PanelHeader, TabNavigation, Section, SectionHeader, Input, Textarea, Toggle, ButtonGroup, Select, SectionStatusControl } from '../shared';
import type { TabConfig, SelectOption } from '../shared/types';
import type { FeaturesConfig, SectionsConfig } from '../../../../types/config';

type FeaturesTabType = 'content' | 'layout' | 'effects';

const featuresTabs: TabConfig<FeaturesTabType>[] = [
  { id: 'content', label: 'Content', icon: <FileText className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { id: 'effects', label: 'Effects', icon: <Sparkles className="w-4 h-4" /> },
];

const layoutOptions: SelectOption[] = [
  { value: 'grid', label: 'Grid' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'list', label: 'List' },
];

const columnsOptions: SelectOption[] = [
  { value: '2', label: '2 Columns' },
  { value: '3', label: '3 Columns' },
  { value: '4', label: '4 Columns' },
];

const containerEffectOptions = [
  { value: 'none', label: 'None' },
  { value: 'glass', label: 'Glass' },
  { value: 'pixel', label: 'Pixel' },
  { value: 'blur', label: 'Blur' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'glow', label: 'Glow' },
];

const colorOptions: SelectOption[] = [
  { value: 'blue', label: 'Blue' },
  { value: 'pink', label: 'Pink' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'orange', label: 'Orange' },
];

interface FeatureItemEditorProps {
  item: FeaturesConfig['items'][0];
  onChange: (item: FeaturesConfig['items'][0]) => void;
  onRemove: () => void;
}

const FeatureItemEditor: React.FC<FeatureItemEditorProps> = ({ item, onChange, onRemove }) => {
  return (
    <div className="p-3 bg-slate-800/50 rounded-lg border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Feature Item</span>
        <button
          onClick={onRemove}
          className="text-red-400 hover:text-red-300 text-xs"
        >
          Remove
        </button>
      </div>
      <Input
        label="Title"
        value={item.title}
        onChange={(value) => onChange({ ...item, title: value })}
      />
      <Textarea
        label="Description"
        value={item.description}
        onChange={(value) => onChange({ ...item, description: value })}
        rows={2}
      />
      <Select
        label="Color"
        value={item.color || 'blue'}
        options={colorOptions}
        onChange={(value) => onChange({ ...item, color: value as any })}
      />
    </div>
  );
};

export const FeaturesPanel: React.FC = () => {
  const { config, setConfig } = useConfig();
  const [activeTab, setActiveTab] = useState<FeaturesTabType>('content');

  const features = config.features;
  const sections = config.sections;

  // Section visibility helpers
  const isEnabled = sections.features.enabled;
  const currentOrder = sections.features.order;
  const totalSections = Object.values(sections).filter(s => s.enabled).length;

  const handleToggleSection = useCallback((enabled: boolean) => {
    setConfig({
      ...config,
      sections: {
        ...sections,
        features: { ...sections.features, enabled },
      },
    });
  }, [config, sections, setConfig]);

  const handleMoveSection = useCallback((direction: 'up' | 'down') => {
    const currentOrder = sections.features.order;
    const targetOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
    
    // Find the section to swap with
    const swapKey = Object.entries(sections).find(([, v]) => v.order === targetOrder)?.[0] as keyof SectionsConfig | undefined;
    
    if (!swapKey) return;
    
    setConfig({
      ...config,
      sections: {
        ...sections,
        features: { ...sections.features, order: targetOrder },
        [swapKey]: { ...sections[swapKey], order: currentOrder },
      },
    });
  }, [config, sections, setConfig]);

  const handleUpdate = useCallback((key: keyof FeaturesConfig, value: any) => {
    setConfig({
      ...config,
      features: {
        ...features,
        [key]: value,
      },
    });
  }, [config, features, setConfig]);

  const handleItemUpdate = useCallback((index: number, item: FeaturesConfig['items'][0]) => {
    const newItems = [...features.items];
    newItems[index] = item;
    handleUpdate('items', newItems);
  }, [features.items, handleUpdate]);

  const handleItemRemove = useCallback((index: number) => {
    const newItems = features.items.filter((_, i) => i !== index);
    handleUpdate('items', newItems);
  }, [features.items, handleUpdate]);

  const handleAddItem = useCallback(() => {
    const newItem = {
      id: Date.now().toString(),
      title: 'New Feature',
      description: 'Feature description',
      color: 'blue' as const,
    };
    handleUpdate('items', [...features.items, newItem]);
  }, [features.items, handleUpdate]);

  const renderContentTab = () => (
    <div className="space-y-6">
      <Section>
        <SectionHeader title="Section Header" />
        <Toggle
          label="Show Title"
          checked={features.showTitle}
          onChange={(checked) => handleUpdate('showTitle', checked)}
        />
        <Input
          label="Title"
          value={features.title}
          onChange={(value) => handleUpdate('title', value)}
        />
        <Textarea
          label="Subtitle"
          value={features.subtitle}
          onChange={(value) => handleUpdate('subtitle', value)}
          rows={2}
        />
      </Section>

      <Section>
        <SectionHeader title="Feature Items" />
        <div className="space-y-3">
          {features.items.map((item, index) => (
            <FeatureItemEditor
              key={item.id}
              item={item}
              onChange={(updated) => handleItemUpdate(index, updated)}
              onRemove={() => handleItemRemove(index)}
            />
          ))}
        </div>
        <button
          onClick={handleAddItem}
          className="w-full mt-3 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium rounded-lg border border-blue-500/30 transition-colors"
        >
          + Add Feature
        </button>
      </Section>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="space-y-6">
      <Section>
        <SectionHeader title="Layout" />
        <Select
          label="Layout Style"
          value={features.layout}
          options={layoutOptions}
          onChange={(value) => handleUpdate('layout', value)}
        />
        <Select
          label="Columns"
          value={features.columns}
          options={columnsOptions}
          onChange={(value) => handleUpdate('columns', value)}
        />
      </Section>
    </div>
  );

  const renderEffectsTab = () => (
    <div className="space-y-6">
      <Section>
        <SectionHeader title="Container Effect" description="Visual effect for feature cards" />
        <ButtonGroup
          options={containerEffectOptions}
          value={features.containerEffect}
          onChange={(value) => handleUpdate('containerEffect', value)}
          columns={3}
        />
      </Section>

      <Section>
        <SectionHeader title="Animation" />
        <Toggle
          label="Animate on Scroll"
          checked={features.animateOnScroll}
          onChange={(checked) => handleUpdate('animateOnScroll', checked)}
        />
      </Section>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContentTab();
      case 'layout':
        return renderLayoutTab();
      case 'effects':
        return renderEffectsTab();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PanelHeader
        title="Features Settings"
        subtitle="Configure the features section"
      />
      
      <TabNavigation
        tabs={featuresTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Section Status Control - Add/Remove from Page */}
        <SectionStatusControl
          enabled={isEnabled}
          order={currentOrder}
          totalSections={totalSections || 1}
          sectionName="Features"
          canDisable={true}
          onToggle={handleToggleSection}
          onMoveUp={() => handleMoveSection('up')}
          onMoveDown={() => handleMoveSection('down')}
        />
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FeaturesPanel;
