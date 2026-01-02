/**
 * Layout System Type Definitions
 * Defines the structure for drag-and-drop layout system
 */

/**
 * Available layout template types
 */
export type LayoutTemplateType = 
  | 'single-panel'      // Full screen single area
  | 'two-column'        // 50-50 split vertical
  | 'three-column'      // Three equal columns
  | 'grid-2x2'          // 2x2 grid
  | 'l-shape'           // Large left, stacked right
  | 'dashboard';        // Header + 3 bottom panels

/**
 * Element categories for organization
 */
export type ElementCategory = 
  | 'display'    // Visual display elements
  | 'controls'   // Control panels
  | 'sources'    // Source selectors
  | 'utilities'; // Utility panels

/**
 * Position within a layout area
 */
export interface LayoutPosition {
  x: number;        // Grid column
  y: number;        // Grid row
  width: number;    // Columns span
  height: number;   // Rows span
}

/**
 * A region within a layout template where elements can be placed
 */
export interface LayoutArea {
  id: string;
  position: LayoutPosition;
  minWidth?: number;
  minHeight?: number;
  maxElements?: number;
}

/**
 * Definition of a layout template
 */
export interface LayoutTemplate {
  id: LayoutTemplateType;
  name: string;
  description: string;
  areas: LayoutArea[];
  columns: number;      // Total grid columns
  rows: number;         // Total grid rows
  preview: string;      // SVG or description for preview
}

/**
 * Available element types that can be placed
 */
export type LayoutElementType = 
  | 'editor-display'
  | 'mini-feed'
  | 'scene-selector'
  | 'source-selector'
  | 'audio-mixer'
  | 'stream-preview'
  | 'recording-preview'
  | 'website'
  | 'legacy-events';

/**
 * Definition of an available element
 */
export interface LayoutElement {
  id: LayoutElementType;
  name: string;
  category: ElementCategory;
  description: string;
  icon: string;           // lucide-react icon name
  defaultSize: {
    width: number;
    height: number;
  };
  minSize: {
    width: number;
    height: number;
  };
  maxSize?: {
    width: number;
    height: number;
  };
  resizable: boolean;
  allowMultiple: boolean;  // Can be placed multiple times
}

/**
 * An element instance placed in the layout
 */
export interface LayoutElementInstance {
  id: string;                      // Unique instance id
  elementType: LayoutElementType;  // Type of element
  areaId: string;                  // Which area it's in
  position: LayoutPosition;        // Position within area
  settings?: Record<string, unknown>; // Element-specific settings
  locked?: boolean;                // Prevent moving/resizing
}

/**
 * Complete layout configuration
 */
export interface CustomLayout {
  id: string;
  name: string;
  template: LayoutTemplateType;
  elements: LayoutElementInstance[];
  createdAt: Date;
  updatedAt: Date;
  isPreset?: boolean;
}

/**
 * Grid configuration
 */
export interface LayoutGrid {
  enabled: boolean;
  size: number;         // Grid cell size in pixels
  snap: boolean;        // Snap elements to grid
  visible: boolean;     // Show grid overlay
  color?: string;       // Grid line color
}

/**
 * Layout editor state
 */
export interface LayoutEditorState {
  activeTemplate: LayoutTemplateType;
  currentLayout: CustomLayout | null;
  savedLayouts: CustomLayout[];
  grid: LayoutGrid;
  selectedElement: string | null;  // Selected element instance id
  mode: 'edit' | 'preview';
}

/**
 * Layout change history for undo/redo
 */
export interface LayoutHistoryEntry {
  timestamp: Date;
  layout: CustomLayout;
  action: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
