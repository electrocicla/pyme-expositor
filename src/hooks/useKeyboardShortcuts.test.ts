import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

// Mock the useConfig hook
const mockUseConfig = vi.fn();
vi.mock('../contexts/ConfigContext', () => ({
  useConfig: () => mockUseConfig(),
}));

describe('useKeyboardShortcuts', () => {
  let mockUndo: ReturnType<typeof vi.fn>;
  let mockRedo: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUndo = vi.fn();
    mockRedo = vi.fn();
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: true,
      undo: mockUndo,
      redo: mockRedo,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calls undo on Ctrl+Z', () => {
    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockUndo).toHaveBeenCalledTimes(1);
  });

  it('calls undo on Cmd+Z on Mac', () => {
    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        metaKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockUndo).toHaveBeenCalledTimes(1);
  });

  it('calls redo on Ctrl+Y', () => {
    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockRedo).toHaveBeenCalledTimes(1);
  });

  it('calls redo on Cmd+Y on Mac', () => {
    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'y',
        metaKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockRedo).toHaveBeenCalledTimes(1);
  });

  it('calls redo on Ctrl+Shift+Z', () => {
    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'Z',
        ctrlKey: true,
        shiftKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockRedo).toHaveBeenCalledTimes(1);
  });

  it('calls redo on Cmd+Shift+Z on Mac', () => {
    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'Z',
        metaKey: true,
        shiftKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockRedo).toHaveBeenCalledTimes(1);
  });

  it('does not call undo when canUndo is false', () => {
    mockUseConfig.mockReturnValue({
      canUndo: false,
      canRedo: true,
      undo: mockUndo,
      redo: mockRedo,
    });

    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockUndo).not.toHaveBeenCalled();
  });

  it('does not call redo when canRedo is false', () => {
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: false,
      undo: mockUndo,
      redo: mockRedo,
    });

    renderHook(() => useKeyboardShortcuts());

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'y',
        ctrlKey: true,
      });
      document.dispatchEvent(event);
    });

    expect(mockRedo).not.toHaveBeenCalled();
  });

  it('ignores shortcuts when typing in input', () => {
    renderHook(() => useKeyboardShortcuts());

    // Create a mock input element
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });
      // Simulate the event coming from the input
      Object.defineProperty(event, 'target', { value: input });
      document.dispatchEvent(event);
    });

    expect(mockUndo).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('ignores shortcuts when typing in textarea', () => {
    renderHook(() => useKeyboardShortcuts());

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.focus();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });
      Object.defineProperty(event, 'target', { value: textarea });
      document.dispatchEvent(event);
    });

    expect(mockUndo).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('ignores shortcuts when typing in contenteditable', () => {
    renderHook(() => useKeyboardShortcuts());

    const div = document.createElement('div');
    div.contentEditable = 'true';
    document.body.appendChild(div);
    div.focus();

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'z',
        ctrlKey: true,
      });
      Object.defineProperty(event, 'target', { value: div });
      document.dispatchEvent(event);
    });

    expect(mockUndo).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });
});