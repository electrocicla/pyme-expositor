/**
 * Layout Canvas Component
 * Main workspace area for the layout system
 */

import React, { useCallback } from 'react';
import { useLayout } from '../../../contexts/LayoutContext';
import { useDragAndDrop } from '../../../hooks/useDragAndDrop';
import { getLayoutTemplate } from './LayoutTemplates';
import { DropZone } from './DropZone';
import { ElementInstance } from './ElementInstance';
import type { DragItem, DropTarget } from '../../../types/drag-drop';
import type { LayoutElementType } from '../../../types/layout';

export const LayoutCanvas: React.FC = () => {
  const {
    activeTemplate,
    currentLayout,
    selectedElement,
    grid,
    addElement,
    removeElement,
    moveElement,
    selectElement,
    toggleElementLock,
  } = useLayout();

  const template = getLayoutTemplate(activeTemplate);

  const handleDrop = useCallback((item: DragItem, target: DropTarget) => {
    if (item.type === 'element' && item.elementType) {
      // Adding new element
      addElement(item.elementType as LayoutElementType, target.areaId, target.position);
    } else if (item.type === 'instance' && item.instanceId) {
      // Moving existing element
      moveElement(item.instanceId, target.areaId, target.position);
    }
  }, [addElement, moveElement]);

  const { dragState, handleDragStart, handleDragOver, handleDragLeave, handleDrop: onDrop } = useDragAndDrop({
    onDrop: handleDrop,
  });

  if (!template) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950 text-slate-400">
        <div className="text-center">
          <p className="text-lg mb-2">No layout template selected</p>
          <p className="text-sm">Select a layout from the left sidebar</p>
        </div>
      </div>
    );
  }

  const handleAreaDragOver = (event: React.DragEvent<HTMLDivElement>, areaId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const area = template.areas.find(a => a.id === areaId);
    if (!area) return;

    const elements = currentLayout?.elements.filter(el => el.areaId === areaId) || [];
    const isMaxed = area.maxElements !== undefined && elements.length >= area.maxElements;

    const target: DropTarget = {
      areaId,
      position: { x: 0, y: 0, width: area.position.width, height: area.position.height },
      canDrop: !isMaxed,
      reason: isMaxed ? 'Area is full' : undefined,
    };

    handleDragOver(event, target);
  };

  const handleAreaDrop = (event: React.DragEvent<HTMLDivElement>, areaId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const area = template.areas.find(a => a.id === areaId);
    if (!area) return;

    const elements = currentLayout?.elements.filter(el => el.areaId === areaId) || [];
    const isMaxed = area.maxElements !== undefined && elements.length >= area.maxElements;

    if (isMaxed) return;

    const target: DropTarget = {
      areaId,
      position: { x: 0, y: 0, width: area.position.width, height: area.position.height },
      canDrop: true,
    };

    onDrop(event, target);
  };

  const handleElementDragStart = (event: React.DragEvent<HTMLDivElement>, instanceId: string) => {
    const instance = currentLayout?.elements.find(el => el.id === instanceId);
    if (!instance) return;

    const dragItem: DragItem = {
      type: 'instance',
      instanceId: instance.id,
      sourceAreaId: instance.areaId,
      originalPosition: instance.position,
    };

    handleDragStart(event, dragItem);
  };

  return (
    <div className="h-full bg-slate-950 p-4 overflow-auto">
      <div className="max-w-[1800px] mx-auto h-full">
        {/* Grid Container */}
        <div
          className="grid gap-3 h-full relative"
          style={{
            gridTemplateColumns: `repeat(${template.columns}, 1fr)`,
            gridTemplateRows: `repeat(${template.rows}, 1fr)`,
          }}
        >
          {/* Grid overlay */}
          {grid.visible && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(${grid.color} 1px, transparent 1px),
                  linear-gradient(90deg, ${grid.color} 1px, transparent 1px)
                `,
                backgroundSize: `${grid.size}px ${grid.size}px`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Layout Areas */}
          {template.areas.map(area => {
            const areaElements = currentLayout?.elements.filter(el => el.areaId === area.id) || [];
            const isDragOver = dragState.dragOverTarget?.areaId === area.id;
            const canDrop = dragState.dragOverTarget?.canDrop ?? true;

            return (
              <div
                key={area.id}
                style={{
                  gridColumn: `${area.position.x + 1} / span ${area.position.width}`,
                  gridRow: `${area.position.y + 1} / span ${area.position.height}`,
                }}
              >
                <DropZone
                  area={area}
                  elements={areaElements}
                  isDragOver={isDragOver}
                  canDrop={canDrop}
                  onDragOver={(e) => handleAreaDragOver(e, area.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleAreaDrop(e, area.id)}
                >
                  {/* Render elements in this area */}
                  <div className="h-full space-y-2">
                    {areaElements.map(element => (
                      <ElementInstance
                        key={element.id}
                        instance={element}
                        isSelected={selectedElement === element.id}
                        onSelect={() => selectElement(element.id)}
                        onRemove={() => removeElement(element.id)}
                        onToggleLock={() => toggleElementLock(element.id)}
                        onDragStart={(e) => handleElementDragStart(e, element.id)}
                      />
                    ))}
                  </div>
                </DropZone>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
