/**
 * Drag and Drop Hook
 * Manages HTML5 drag-and-drop operations
 */

import { useState, useCallback, useRef } from 'react';
import type {
  DragState,
  DragItem,
  DropTarget,
  DragHandlers,
  DropValidator,
} from '../types/drag-drop';

interface UseDragAndDropOptions {
  validator?: DropValidator;
  onDragStart?: (item: DragItem) => void;
  onDrop?: (item: DragItem, target: DropTarget) => void;
  onDragEnd?: () => void;
}

export function useDragAndDrop(options: UseDragAndDropOptions = {}) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragItem: null,
    dragOverTarget: null,
    ghostPosition: null,
  });

  const dragDataRef = useRef<DragItem | null>(null);

  /**
   * Start dragging an item
   */
  const handleDragStart = useCallback((
    event: React.DragEvent<HTMLElement>,
    item: DragItem
  ) => {
    dragDataRef.current = item;
    
    // Set drag data
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/json', JSON.stringify(item));
    
    // Set drag image
    if (event.dataTransfer.setDragImage) {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      event.dataTransfer.setDragImage(
        target,
        rect.width / 2,
        rect.height / 2
      );
    }

    setDragState({
      isDragging: true,
      dragItem: item,
      dragOverTarget: null,
      ghostPosition: null,
    });

    options.onDragStart?.(item);
  }, [options]);

  /**
   * Handle drag over a drop target
   */
  const handleDragOver = useCallback((
    event: React.DragEvent<HTMLElement>,
    target: DropTarget
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const item = dragDataRef.current;
    if (!item) return;

    // Validate drop
    let canDrop = target.canDrop;
    let reason = target.reason;

    if (options.validator && canDrop) {
      const validation = options.validator(item, target);
      canDrop = validation.canDrop;
      reason = validation.reason;
    }

    // Update cursor
    event.dataTransfer.dropEffect = canDrop ? 'move' : 'none';

    setDragState(prev => ({
      ...prev,
      dragOverTarget: { ...target, canDrop, reason },
      ghostPosition: {
        x: event.clientX,
        y: event.clientY,
      },
    }));
  }, [options]);

  /**
   * Handle leaving a drop target
   */
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    // Only clear if we're leaving the actual target
    const relatedTarget = event.relatedTarget as HTMLElement;
    const currentTarget = event.currentTarget as HTMLElement;
    
    if (!currentTarget.contains(relatedTarget)) {
      setDragState(prev => ({
        ...prev,
        dragOverTarget: null,
      }));
    }
  }, []);

  /**
   * Handle drop
   */
  const handleDrop = useCallback((
    event: React.DragEvent<HTMLElement>,
    target: DropTarget
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const item = dragDataRef.current;
    if (!item) return;

    // Validate drop
    let canDrop = target.canDrop;
    if (options.validator) {
      const validation = options.validator(item, target);
      canDrop = validation.canDrop;
    }

    if (canDrop) {
      options.onDrop?.(item, target);
    }

    // Reset state
    dragDataRef.current = null;
    setDragState({
      isDragging: false,
      dragItem: null,
      dragOverTarget: null,
      ghostPosition: null,
    });
  }, [options]);

  /**
   * Handle drag end
   */
  const handleDragEnd = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    
    dragDataRef.current = null;
    setDragState({
      isDragging: false,
      dragItem: null,
      dragOverTarget: null,
      ghostPosition: null,
    });

    options.onDragEnd?.();
  }, [options]);

  /**
   * Cancel drag operation
   */
  const cancelDrag = useCallback(() => {
    dragDataRef.current = null;
    setDragState({
      isDragging: false,
      dragItem: null,
      dragOverTarget: null,
      ghostPosition: null,
    });
  }, []);

  const handlers: DragHandlers = {
    onDragStart: (item: DragItem) => {
      dragDataRef.current = item;
      setDragState(prev => ({ ...prev, isDragging: true, dragItem: item }));
      options.onDragStart?.(item);
    },
    onDragOver: (target: DropTarget) => {
      setDragState(prev => ({ ...prev, dragOverTarget: target }));
    },
    onDragEnd: () => {
      dragDataRef.current = null;
      setDragState({
        isDragging: false,
        dragItem: null,
        dragOverTarget: null,
        ghostPosition: null,
      });
      options.onDragEnd?.();
    },
    onDrop: (item: DragItem, target: DropTarget) => {
      options.onDrop?.(item, target);
      dragDataRef.current = null;
      setDragState({
        isDragging: false,
        dragItem: null,
        dragOverTarget: null,
        ghostPosition: null,
      });
    },
    onDragCancel: cancelDrag,
  };

  return {
    dragState,
    handlers,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    cancelDrag,
  };
}
