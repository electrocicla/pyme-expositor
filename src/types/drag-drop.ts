/**
 * Drag and Drop Type Definitions
 * Native HTML5 Drag and Drop API types
 */

import type { LayoutElementType, LayoutPosition } from './layout';

/**
 * Types of drag operations
 */
export type DragType = 'element' | 'instance' | 'resize';

/**
 * Data being dragged
 */
export interface DragItem {
  type: DragType;
  elementType?: LayoutElementType;  // When dragging from palette
  instanceId?: string;               // When dragging existing instance
  sourceAreaId?: string;             // Area where drag started
  originalPosition?: LayoutPosition; // Original position for cancel
}

/**
 * Drop target information
 */
export interface DropTarget {
  areaId: string;
  position: LayoutPosition;
  canDrop: boolean;
  reason?: string;  // Why can't drop if canDrop is false
}

/**
 * Current drag state
 */
export interface DragState {
  isDragging: boolean;
  dragItem: DragItem | null;
  dragOverTarget: DropTarget | null;
  ghostPosition: { x: number; y: number } | null;
}

/**
 * Drag event handlers
 */
export interface DragHandlers {
  onDragStart: (item: DragItem) => void;
  onDragOver: (target: DropTarget) => void;
  onDragEnd: () => void;
  onDrop: (item: DragItem, target: DropTarget) => void;
  onDragCancel: () => void;
}

/**
 * Drop validation function type
 */
export type DropValidator = (
  item: DragItem,
  target: DropTarget
) => { canDrop: boolean; reason?: string };

/**
 * Drag data transfer object
 */
export interface DragTransferData {
  type: DragType;
  payload: Record<string, unknown>;
}

/**
 * Resize handle position
 */
export type ResizeHandle = 
  | 'n'  | 'ne' | 'e'  | 'se'
  | 's'  | 'sw' | 'w'  | 'nw';

/**
 * Resize state
 */
export interface ResizeState {
  isResizing: boolean;
  instanceId: string | null;
  handle: ResizeHandle | null;
  startPosition: { x: number; y: number } | null;
  startSize: { width: number; height: number } | null;
}
