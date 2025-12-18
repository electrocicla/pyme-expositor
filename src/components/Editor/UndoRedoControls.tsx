import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';

interface UndoRedoControlsProps {
  className?: string;
}

export const UndoRedoControls: React.FC<UndoRedoControlsProps> = ({
  className = ''
}) => {
  const { canUndo, canRedo, undo, redo } = useConfig();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`
          p-2 rounded-lg transition-colors duration-200
          ${canUndo
            ? 'text-slate-300 hover:text-white hover:bg-slate-700 focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            : 'text-slate-500 cursor-not-allowed'
          }
        `}
        title="Undo (Ctrl+Z)"
        aria-label="Undo last change"
      >
        <Undo2 size={18} />
      </button>

      <button
        onClick={redo}
        disabled={!canRedo}
        className={`
          p-2 rounded-lg transition-colors duration-200
          ${canRedo
            ? 'text-slate-300 hover:text-white hover:bg-slate-700 focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            : 'text-slate-500 cursor-not-allowed'
          }
        `}
        title="Redo (Ctrl+Y)"
        aria-label="Redo last undone change"
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
};