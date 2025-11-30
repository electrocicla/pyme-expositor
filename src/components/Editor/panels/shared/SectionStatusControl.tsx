/**
 * SectionStatusControl Component
 * Shows section visibility status with toggle to add/remove from page
 * Provides immediate feedback about section presence in the live preview
 */

import React from 'react';
import { Eye, EyeOff, ArrowUp, ArrowDown, Info } from 'lucide-react';

interface SectionStatusControlProps {
  /** Whether the section is currently visible on the page */
  enabled: boolean;
  /** Current order position of the section */
  order: number;
  /** Total number of sections */
  totalSections: number;
  /** Section display name */
  sectionName: string;
  /** Whether this section can be disabled (e.g., Header/Footer might be required) */
  canDisable?: boolean;
  /** Callback when visibility is toggled */
  onToggle: (enabled: boolean) => void;
  /** Callback to move section up in order */
  onMoveUp?: () => void;
  /** Callback to move section down in order */
  onMoveDown?: () => void;
}

export const SectionStatusControl: React.FC<SectionStatusControlProps> = ({
  enabled,
  order,
  totalSections,
  sectionName,
  canDisable = true,
  onToggle,
  onMoveUp,
  onMoveDown,
}) => {
  const isFirst = order === 1;
  const isLast = order === totalSections;

  return (
    <div className={`mb-4 p-4 rounded-xl border transition-all duration-300 ${
      enabled 
        ? 'bg-emerald-500/10 border-emerald-500/30' 
        : 'bg-slate-800/50 border-white/10'
    }`}>
      {/* Status Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {enabled ? (
            <Eye className="w-5 h-5 text-emerald-400" />
          ) : (
            <EyeOff className="w-5 h-5 text-slate-500" />
          )}
          <span className={`font-medium ${enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
            {enabled ? 'Visible on Page' : 'Hidden from Page'}
          </span>
        </div>
        
        {/* Order indicator */}
        {enabled && (
          <span className="text-xs text-slate-400 bg-slate-800/80 px-2 py-1 rounded-full">
            Position: {order} of {totalSections}
          </span>
        )}
      </div>

      {/* Actions Row */}
      <div className="flex items-center gap-3">
        {/* Enable/Disable Button */}
        {canDisable ? (
          <button
            onClick={() => onToggle(!enabled)}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              enabled
                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {enabled ? (
              <>
                <EyeOff className="w-4 h-4" />
                Remove {sectionName} from Page
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Add {sectionName} to Page
              </>
            )}
          </button>
        ) : (
          <div className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-slate-700/50 text-slate-500 flex items-center justify-center gap-2">
            <Info className="w-4 h-4" />
            {sectionName} is required and cannot be removed
          </div>
        )}

        {/* Reorder Buttons */}
        {enabled && onMoveUp && onMoveDown && (
          <div className="flex gap-1">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className={`p-2 rounded-lg transition-colors ${
                isFirst 
                  ? 'text-slate-600 bg-slate-800/30 cursor-not-allowed' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700 bg-slate-800/50'
              }`}
              title="Move section up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className={`p-2 rounded-lg transition-colors ${
                isLast 
                  ? 'text-slate-600 bg-slate-800/30 cursor-not-allowed' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700 bg-slate-800/50'
              }`}
              title="Move section down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Info message when hidden */}
      {!enabled && (
        <p className="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
          <Info className="w-3 h-3" />
          Configure the section below, then click "Add to Page" to make it visible.
        </p>
      )}
    </div>
  );
};

export default SectionStatusControl;
