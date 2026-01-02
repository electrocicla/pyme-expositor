/**
 * Layout Templates Configuration
 * Defines 6 predefined layout templates
 */

import type { LayoutTemplate } from '../../../types/layout';

/**
 * Single Panel Layout
 * One full-screen area for maximum focus
 */
const SINGLE_PANEL: LayoutTemplate = {
  id: 'single-panel',
  name: 'Single Panel',
  description: 'One large workspace area',
  columns: 12,
  rows: 12,
  areas: [
    {
      id: 'main',
      position: { x: 0, y: 0, width: 12, height: 12 },
      minWidth: 4,
      minHeight: 4,
    },
  ],
  preview: 'M0 0h100v100H0z',
};

/**
 * Two Column Layout
 * Vertical split into two equal areas
 */
const TWO_COLUMN: LayoutTemplate = {
  id: 'two-column',
  name: 'Two Column',
  description: 'Split screen with two equal columns',
  columns: 12,
  rows: 12,
  areas: [
    {
      id: 'left',
      position: { x: 0, y: 0, width: 6, height: 12 },
      minWidth: 3,
      minHeight: 4,
    },
    {
      id: 'right',
      position: { x: 6, y: 0, width: 6, height: 12 },
      minWidth: 3,
      minHeight: 4,
    },
  ],
  preview: 'M0 0h45v100H0zM55 0h45v100H55z',
};

/**
 * Three Column Layout
 * Three equal vertical columns
 */
const THREE_COLUMN: LayoutTemplate = {
  id: 'three-column',
  name: 'Three Column',
  description: 'Three equal columns for multitasking',
  columns: 12,
  rows: 12,
  areas: [
    {
      id: 'left',
      position: { x: 0, y: 0, width: 4, height: 12 },
      minWidth: 2,
      minHeight: 4,
    },
    {
      id: 'center',
      position: { x: 4, y: 0, width: 4, height: 12 },
      minWidth: 2,
      minHeight: 4,
    },
    {
      id: 'right',
      position: { x: 8, y: 0, width: 4, height: 12 },
      minWidth: 2,
      minHeight: 4,
    },
  ],
  preview: 'M0 0h30v100H0zM35 0h30v100H35zM70 0h30v100H70z',
};

/**
 * Grid 2x2 Layout
 * Four equal quadrants
 */
const GRID_2X2: LayoutTemplate = {
  id: 'grid-2x2',
  name: 'Grid 2×2',
  description: 'Four equal areas in a grid',
  columns: 12,
  rows: 12,
  areas: [
    {
      id: 'top-left',
      position: { x: 0, y: 0, width: 6, height: 6 },
      minWidth: 3,
      minHeight: 3,
    },
    {
      id: 'top-right',
      position: { x: 6, y: 0, width: 6, height: 6 },
      minWidth: 3,
      minHeight: 3,
    },
    {
      id: 'bottom-left',
      position: { x: 0, y: 6, width: 6, height: 6 },
      minWidth: 3,
      minHeight: 3,
    },
    {
      id: 'bottom-right',
      position: { x: 6, y: 6, width: 6, height: 6 },
      minWidth: 3,
      minHeight: 3,
    },
  ],
  preview: 'M0 0h45v45H0zM55 0h45v45H55zM0 55h45v45H0zM55 55h45v45H55z',
};

/**
 * L-Shape Layout
 * Large left area with two stacked right areas
 */
const L_SHAPE: LayoutTemplate = {
  id: 'l-shape',
  name: 'L-Shape',
  description: 'Large main area with sidebar stack',
  columns: 12,
  rows: 12,
  areas: [
    {
      id: 'main',
      position: { x: 0, y: 0, width: 8, height: 12 },
      minWidth: 6,
      minHeight: 6,
    },
    {
      id: 'side-top',
      position: { x: 8, y: 0, width: 4, height: 6 },
      minWidth: 2,
      minHeight: 3,
    },
    {
      id: 'side-bottom',
      position: { x: 8, y: 6, width: 4, height: 6 },
      minWidth: 2,
      minHeight: 3,
    },
  ],
  preview: 'M0 0h65v100H0zM70 0h30v45H70zM70 55h30v45H70z',
};

/**
 * Dashboard Layout
 * Header area with three bottom panels
 */
const DASHBOARD: LayoutTemplate = {
  id: 'dashboard',
  name: 'Dashboard',
  description: 'Header with three bottom panels',
  columns: 12,
  rows: 12,
  areas: [
    {
      id: 'header',
      position: { x: 0, y: 0, width: 12, height: 5 },
      minWidth: 6,
      minHeight: 3,
      maxElements: 1,
    },
    {
      id: 'bottom-left',
      position: { x: 0, y: 5, width: 4, height: 7 },
      minWidth: 2,
      minHeight: 3,
    },
    {
      id: 'bottom-center',
      position: { x: 4, y: 5, width: 4, height: 7 },
      minWidth: 2,
      minHeight: 3,
    },
    {
      id: 'bottom-right',
      position: { x: 8, y: 5, width: 4, height: 7 },
      minWidth: 2,
      minHeight: 3,
    },
  ],
  preview: 'M0 0h100v40H0zM0 45h30v55H0zM35 45h30v55H35zM70 45h30v55H70z',
};

/**
 * All available layout templates
 */
export const LAYOUT_TEMPLATES: readonly LayoutTemplate[] = [
  SINGLE_PANEL,
  TWO_COLUMN,
  THREE_COLUMN,
  GRID_2X2,
  L_SHAPE,
  DASHBOARD,
] as const;

/**
 * Get a template by ID
 */
export function getLayoutTemplate(id: string): LayoutTemplate | undefined {
  return LAYOUT_TEMPLATES.find(template => template.id === id);
}

/**
 * Get default template
 */
export function getDefaultTemplate(): LayoutTemplate {
  return SINGLE_PANEL;
}
