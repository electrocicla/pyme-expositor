/**
 * Layout Element Registry
 * Defines all available elements that can be placed in layouts
 */

import type { LayoutElement } from '../../../types/layout';

/**
 * All available layout elements
 */
export const LAYOUT_ELEMENTS: readonly LayoutElement[] = [
  // Display Elements
  {
    id: 'editor-display',
    name: 'Editor Display',
    category: 'display',
    description: 'Main visual editor and preview area',
    icon: 'Monitor',
    defaultSize: { width: 8, height: 8 },
    minSize: { width: 4, height: 4 },
    resizable: true,
    allowMultiple: false,
  },
  {
    id: 'mini-feed',
    name: 'Mini Feed',
    category: 'display',
    description: 'Compact activity feed',
    icon: 'List',
    defaultSize: { width: 4, height: 4 },
    minSize: { width: 2, height: 3 },
    resizable: true,
    allowMultiple: false,
  },
  {
    id: 'stream-preview',
    name: 'Stream Preview',
    category: 'display',
    description: 'Live stream preview window',
    icon: 'Video',
    defaultSize: { width: 6, height: 4 },
    minSize: { width: 4, height: 3 },
    resizable: true,
    allowMultiple: false,
  },
  {
    id: 'recording-preview',
    name: 'Recording Preview',
    category: 'display',
    description: 'Recording output preview',
    icon: 'Circle',
    defaultSize: { width: 6, height: 4 },
    minSize: { width: 4, height: 3 },
    resizable: true,
    allowMultiple: false,
  },
  {
    id: 'website',
    name: 'Website',
    category: 'display',
    description: 'Embedded website preview',
    icon: 'Globe',
    defaultSize: { width: 6, height: 6 },
    minSize: { width: 3, height: 3 },
    resizable: true,
    allowMultiple: true,
  },
  
  // Control Elements
  {
    id: 'audio-mixer',
    name: 'Audio Mixer',
    category: 'controls',
    description: 'Audio levels and mixing controls',
    icon: 'AudioWaveform',
    defaultSize: { width: 4, height: 6 },
    minSize: { width: 3, height: 4 },
    resizable: true,
    allowMultiple: false,
  },
  
  // Source Elements
  {
    id: 'scene-selector',
    name: 'Scene Selector',
    category: 'sources',
    description: 'Switch between different scenes',
    icon: 'Layers',
    defaultSize: { width: 4, height: 5 },
    minSize: { width: 3, height: 4 },
    resizable: true,
    allowMultiple: false,
  },
  {
    id: 'source-selector',
    name: 'Source Selector',
    category: 'sources',
    description: 'Manage and select sources',
    icon: 'FolderOpen',
    defaultSize: { width: 4, height: 5 },
    minSize: { width: 3, height: 4 },
    resizable: true,
    allowMultiple: false,
  },
  
  // Utility Elements
  {
    id: 'legacy-events',
    name: 'Legacy Events',
    category: 'utilities',
    description: 'Event log and history',
    icon: 'Clock',
    defaultSize: { width: 4, height: 4 },
    minSize: { width: 3, height: 3 },
    resizable: true,
    allowMultiple: false,
  },
] as const;

/**
 * Get element by ID
 */
export function getLayoutElement(id: string): LayoutElement | undefined {
  return LAYOUT_ELEMENTS.find(element => element.id === id);
}

/**
 * Get elements by category
 */
export function getElementsByCategory(category: string): LayoutElement[] {
  return LAYOUT_ELEMENTS.filter(element => element.category === category);
}

/**
 * Get all element categories
 */
export function getElementCategories(): string[] {
  const categories = new Set(LAYOUT_ELEMENTS.map(element => element.category));
  return Array.from(categories);
}

/**
 * Check if element type allows multiple instances
 */
export function canPlaceMultiple(elementType: string): boolean {
  const element = getLayoutElement(elementType);
  return element?.allowMultiple ?? false;
}

/**
 * Validate element size
 */
export function validateElementSize(
  elementType: string,
  width: number,
  height: number
): { valid: boolean; reason?: string } {
  const element = getLayoutElement(elementType);
  
  if (!element) {
    return { valid: false, reason: 'Unknown element type' };
  }
  
  if (width < element.minSize.width || height < element.minSize.height) {
    return { 
      valid: false, 
      reason: `Minimum size is ${element.minSize.width}×${element.minSize.height}` 
    };
  }
  
  if (element.maxSize) {
    if (width > element.maxSize.width || height > element.maxSize.height) {
      return { 
        valid: false, 
        reason: `Maximum size is ${element.maxSize.width}×${element.maxSize.height}` 
      };
    }
  }
  
  return { valid: true };
}
