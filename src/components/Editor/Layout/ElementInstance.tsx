/**
 * Element Instance Component
 * Renders a placed element in the layout with controls
 */

import React from 'react';
import { X, Lock, Unlock, GripVertical, Box } from 'lucide-react';
import type { LayoutElementInstance } from '../../../types/layout';
import { getLayoutElement, LAYOUT_ELEMENT_ICONS } from './ElementRegistry';

interface ElementInstanceProps {
  instance: LayoutElementInstance;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onToggleLock: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
}

export const ElementInstance: React.FC<ElementInstanceProps> = ({
  instance,
  isSelected,
  onSelect,
  onRemove,
  onToggleLock,
  onDragStart,
}) => {
  const elementDef = getLayoutElement(instance.elementType);

  if (!elementDef) {
    return (
      <div className="h-full bg-red-500/10 border border-red-500 rounded flex items-center justify-center text-red-400 text-sm">
        Unknown element
      </div>
    );
  }

  const getIcon = () => {
    const Icon = LAYOUT_ELEMENT_ICONS[elementDef.icon];
    return Icon ? <Icon size={16} /> : <Box size={16} />;
  };

  return (
    <div
      className={`
        relative h-full rounded-lg border-2 transition-all duration-200
        ${isSelected
          ? 'border-blue-500 bg-slate-800'
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
        }
        ${instance.locked ? 'cursor-default' : 'cursor-move'}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      draggable={!instance.locked}
      onDragStart={instance.locked ? undefined : onDragStart}
      role="button"
      tabIndex={0}
      aria-label={`${elementDef.name} element${instance.locked ? ' (locked)' : ''}`}
      aria-pressed={isSelected}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-slate-700">
        {/* Drag handle + Icon */}
        <div className="flex items-center gap-2">
          {!instance.locked && (
            <div className="text-slate-500 cursor-grab active:cursor-grabbing">
              <GripVertical size={14} />
            </div>
          )}
          <div className="text-slate-400">
            {getIcon()}
          </div>
          <span className="text-xs font-medium text-slate-300">
            {elementDef.name}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label={instance.locked ? 'Unlock element' : 'Lock element'}
            title={instance.locked ? 'Unlock' : 'Lock'}
          >
            {instance.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            aria-label={`Remove ${elementDef.name}`}
            title="Remove"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex items-center justify-center text-slate-500 text-sm">
        <div className="text-center">
          <div className="mb-2">
            {getIcon()}
          </div>
          <div>{elementDef.name}</div>
        </div>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      )}
    </div>
  );
};
