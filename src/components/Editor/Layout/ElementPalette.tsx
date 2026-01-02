/**
 * Element Palette Panel
 * Displays available elements that can be dragged into layouts
 */

import React, { useState, useMemo } from 'react';
import { Search, Box } from 'lucide-react';
import { LAYOUT_ELEMENTS, getElementCategories, LAYOUT_ELEMENT_ICONS } from './ElementRegistry';
import type { LayoutElement } from '../../../types/layout';
import type { DragItem } from '../../../types/drag-drop';

interface ElementPaletteProps {
  onDragStart?: (item: DragItem) => void;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({ onDragStart }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return ['all', ...getElementCategories()];
  }, []);

  const filteredElements = useMemo(() => {
    return LAYOUT_ELEMENTS.filter(element => {
      const matchesSearch = element.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        element.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, element: LayoutElement) => {
    const dragItem: DragItem = {
      type: 'element',
      elementType: element.id,
    };

    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify(dragItem));

    onDragStart?.(dragItem);
  };

  const getIcon = (element: LayoutElement) => {
    const Icon = LAYOUT_ELEMENT_ICONS[element.icon];
    return Icon ? <Icon size={18} /> : <Box size={18} />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <Box size={18} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Elements
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Drag and drop to edit.
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search elements..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            aria-label="Search elements"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }
              `}
              aria-pressed={selectedCategory === category}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredElements.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No elements found
          </div>
        ) : (
          filteredElements.map(element => (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              className="
                flex items-start gap-3 p-3 rounded-lg
                bg-slate-800/50 border border-slate-700
                hover:bg-slate-800 hover:border-slate-600
                cursor-grab active:cursor-grabbing
                transition-all duration-200
              "
              role="button"
              tabIndex={0}
              aria-label={`Drag ${element.name} to add to layout`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Keyboard drag support could be added here
                }
              }}
            >
              {/* Drag handle */}
              <div className="flex-shrink-0 mt-0.5 text-slate-400">
                <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                  <circle cx="3" cy="3" r="1.5" />
                  <circle cx="9" cy="3" r="1.5" />
                  <circle cx="3" cy="10" r="1.5" />
                  <circle cx="9" cy="10" r="1.5" />
                  <circle cx="3" cy="17" r="1.5" />
                  <circle cx="9" cy="17" r="1.5" />
                </svg>
              </div>

              {/* Icon */}
              <div className="flex-shrink-0 p-2 rounded bg-slate-900 text-purple-400">
                {getIcon(element)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-200 mb-0.5">
                  {element.name}
                </div>
                <div className="text-xs text-slate-400 line-clamp-2">
                  {element.description}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
