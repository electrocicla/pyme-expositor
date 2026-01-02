/**
 * Drop Zone Component
 * Represents a droppable area within a layout
 */

import React from 'react';
import { Plus } from 'lucide-react';
import type { LayoutArea, LayoutElementInstance } from '../../../types/layout';

interface DropZoneProps {
  area: LayoutArea;
  elements: LayoutElementInstance[];
  isDragOver: boolean;
  canDrop: boolean;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  children?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({
  area,
  elements,
  isDragOver,
  canDrop,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}) => {
  const isEmpty = elements.length === 0;
  const isMaxed = area.maxElements !== undefined && elements.length >= area.maxElements;

  return (
    <div
      className={`
        relative h-full rounded-lg border-2 transition-all duration-200
        ${isDragOver && canDrop
          ? 'border-blue-500 bg-blue-500/10'
          : isDragOver && !canDrop
          ? 'border-red-500 bg-red-500/10'
          : 'border-slate-700 border-dashed'
        }
        ${isEmpty ? 'flex items-center justify-center' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      data-area-id={area.id}
      role="region"
      aria-label={`Drop zone for ${area.id}`}
    >
      {/* Empty state */}
      {isEmpty && (
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-slate-500 mb-3">
            <Plus size={24} />
          </div>
          <p className="text-sm text-slate-400">
            Drop elements here
          </p>
        </div>
      )}

      {/* Drop zone content */}
      {!isEmpty && (
        <div className="h-full p-2">
          {children}
        </div>
      )}

      {/* Drag overlay */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-lg pointer-events-none">
          <div className={`
            px-4 py-2 rounded-lg font-medium text-sm
            ${canDrop
              ? 'bg-blue-500 text-white'
              : 'bg-red-500 text-white'
            }
          `}>
            {canDrop ? 'Drop here' : isMaxed ? 'Area is full' : 'Cannot drop here'}
          </div>
        </div>
      )}
    </div>
  );
};
