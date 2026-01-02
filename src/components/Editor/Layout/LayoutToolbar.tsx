/**
 * Layout Toolbar
 * Control bar for layout operations
 */

import React, { useState } from 'react';
import { 
  Save, 
  RotateCcw, 
  Grid3x3, 
  Magnet,
  Eye,
  Edit3,
  Undo2,
  Redo2,
} from 'lucide-react';
import { useLayout } from '../../../contexts/LayoutContext';

export const LayoutToolbar: React.FC = () => {
  const {
    grid,
    mode,
    canUndo,
    canRedo,
    toggleGrid,
    toggleGridSnap,
    resetLayout,
    saveLayout,
    setMode,
    undo,
    redo,
  } = useLayout();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const layoutName = window.prompt('Enter layout name:');
    if (!layoutName) return;

    setIsSaving(true);
    try {
      await saveLayout(layoutName);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset layout? This will remove all elements.')) {
      resetLayout();
    }
  };

  return (
    <div className="h-14 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
      {/* Left: Mode Toggle */}
      <div className="flex items-center gap-2">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setMode('edit')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${mode === 'edit'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
            aria-pressed={mode === 'edit'}
          >
            <Edit3 size={16} />
            Edit
          </button>
          <button
            onClick={() => setMode('preview')}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${mode === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
            aria-pressed={mode === 'preview'}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-2 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-2 rounded text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Grid Controls */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={toggleGrid}
            className={`
              p-2 rounded transition-colors
              ${grid.visible
                ? 'text-blue-400'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
            aria-label="Toggle grid visibility"
            title="Toggle Grid"
            aria-pressed={grid.visible}
          >
            <Grid3x3 size={16} />
          </button>
          <button
            onClick={toggleGridSnap}
            className={`
              p-2 rounded transition-colors
              ${grid.snap
                ? 'text-blue-400'
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
            aria-label="Toggle snap to grid"
            title="Snap to Grid"
            aria-pressed={grid.snap}
          >
            <Magnet size={16} />
          </button>
        </div>

        {/* Save/Reset */}
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-50 transition-colors"
            aria-label="Save layout"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Reset layout"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Right: Info */}
      <div className="text-xs text-slate-500">
        {mode === 'edit' ? 'Edit Mode' : 'Preview Mode'}
      </div>
    </div>
  );
};
