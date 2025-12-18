import { useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';

export const useKeyboardShortcuts = () => {
  const { canUndo, canRedo, undo, redo } = useConfig();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if we're in an input/textarea/contenteditable to avoid interfering with typing
      const target = event.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' ||
                     target.tagName === 'TEXTAREA' ||
                     target.contentEditable === 'true';

      // Also check for contenteditable parents (safely handle jsdom)
      if (!isInput && target.closest && typeof target.closest === 'function') {
        const contentEditableParent = target.closest('[contenteditable="true"]');
        if (contentEditableParent) {
          return;
        }
      }

      if (isInput) return;

      // Undo: Ctrl+Z or Cmd+Z
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo) {
          undo();
        }
      }

      // Redo: Ctrl+Y or Cmd+Y, or Ctrl+Shift+Z or Cmd+Shift+Z
      if (((event.ctrlKey || event.metaKey) && event.key === 'y') ||
          ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'Z')) {
        event.preventDefault();
        if (canRedo) {
          redo();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);
};