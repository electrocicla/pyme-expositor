import React, { useMemo, useState } from 'react';
import { Copy, Download, Save, Trash2, Share2 } from 'lucide-react';
import { useLayout } from '../../../contexts/LayoutContext';
import { getAuthToken } from '../../../utils/api';
import { layoutService } from '../../../services/layoutService';

const toDisplayDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const SavedLayoutsPanel: React.FC = () => {
  const {
    savedLayouts,
    currentLayout,
    saveLayout,
    loadLayout,
    deleteLayout,
    duplicateLayout,
  } = useLayout();

  const isAuthed = Boolean(getAuthToken());

  const [layoutName, setLayoutName] = useState<string>('');
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);

  const sortedLayouts = useMemo(() => {
    return [...savedLayouts].sort((a, b) => {
      const aTime = new Date(a.updatedAt).getTime();
      const bTime = new Date(b.updatedAt).getTime();
      return bTime - aTime;
    });
  }, [savedLayouts]);

  const canSave = isAuthed && layoutName.trim().length > 0 && Boolean(currentLayout);

  const onSave = async (): Promise<void> => {
    if (!canSave) return;
    setIsSaving(true);
    try {
      await saveLayout(layoutName.trim());
      setLayoutName('');
    } finally {
      setIsSaving(false);
    }
  };

  const runAction = async (layoutId: string, action: () => Promise<void>): Promise<void> => {
    setPendingActionId(layoutId);
    try {
      await action();
    } finally {
      setPendingActionId(null);
    }
  };

  const handlePublish = async (layoutId: string): Promise<void> => {
    setIsPublishing(layoutId);
    try {
      await layoutService.publish(layoutId);
      console.warn(`Layout ${layoutId} published successfully`);
    } catch (error) {
      console.error('Failed to publish layout:', error);
    } finally {
      setIsPublishing(null);
    }
  };

  return (
    <div className="p-4 space-y-4 border-t border-slate-700">
      <div className="flex items-center gap-2">
        <Save size={18} className="text-purple-400" />
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Saved Layouts</h3>
      </div>

      {!isAuthed ? (
        <div className="text-xs text-slate-400 bg-slate-800/50 border border-slate-700 rounded-lg p-3">
          Login to load and save layouts.
        </div>
      ) : (
        <div className="space-y-2">
          <div>
            <label htmlFor="layout-save-name" className="block text-xs font-medium text-slate-400 mb-1">
              Layout name
            </label>
            <input
              id="layout-save-name"
              type="text"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              placeholder={currentLayout ? 'e.g. Streaming Workspace' : 'Place an element to enable saving'}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              disabled={!currentLayout || isSaving}
            />
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={!canSave || isSaving}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Save current layout"
          >
            <Save size={16} />
            {isSaving ? 'Saving…' : 'Save current layout'}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {sortedLayouts.length === 0 ? (
          <div className="text-xs text-slate-500">No saved layouts yet.</div>
        ) : (
          <div className="space-y-2">
            {sortedLayouts.map((layout) => {
              const isCurrent = currentLayout?.id === layout.id;
              const pending = pendingActionId === layout.id;
              return (
                <div
                  key={layout.id}
                  className={`rounded-lg border p-3 ${
                    isCurrent
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-slate-700 bg-slate-800/40'
                  }`}
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-200 truncate">{layout.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Updated {toDisplayDate(layout.updatedAt)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => runAction(layout.id, () => loadLayout(layout.id))}
                        disabled={!isAuthed || pending}
                        className="p-2 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Load layout ${layout.name}`}
                        title="Load"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => runAction(layout.id, () => duplicateLayout(layout.id))}
                        disabled={!isAuthed || pending}
                        className="p-2 rounded hover:bg-slate-700 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Duplicate layout ${layout.name}`}
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePublish(layout.id)}
                        disabled={!isAuthed || isPublishing === layout.id}
                        className="p-2 rounded hover:bg-green-500/20 text-slate-300 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Publish layout ${layout.name}`}
                        title="Publish"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => runAction(layout.id, () => deleteLayout(layout.id))}
                        disabled={!isAuthed || pending}
                        className="p-2 rounded hover:bg-red-500/20 text-slate-300 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Delete layout ${layout.name}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
