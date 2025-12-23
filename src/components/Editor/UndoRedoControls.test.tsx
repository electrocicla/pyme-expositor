import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UndoRedoControls } from './UndoRedoControls';

// Mock the useConfig hook
const mockUseConfig = vi.fn();
vi.mock('../../contexts/ConfigContext', () => ({
  useConfig: () => mockUseConfig(),
  ConfigProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('UndoRedoControls', () => {
  it('renders undo and redo buttons', () => {
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: true,
      undo: vi.fn(),
      redo: vi.fn(),
    });

    render(<UndoRedoControls />);

    expect(screen.getByLabelText('Undo last change')).toBeInTheDocument();
    expect(screen.getByLabelText('Redo last undone change')).toBeInTheDocument();
  });

  it('enables undo button when canUndo is true', () => {
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: false,
      undo: vi.fn(),
      redo: vi.fn(),
    });

    render(<UndoRedoControls />);

    const undoButton = screen.getByLabelText('Undo last change');
    expect(undoButton).not.toBeDisabled();
    expect(undoButton).toHaveClass('text-slate-300');
  });

  it('disables undo button when canUndo is false', () => {
    mockUseConfig.mockReturnValue({
      canUndo: false,
      canRedo: true,
      undo: vi.fn(),
      redo: vi.fn(),
    });

    render(<UndoRedoControls />);

    const undoButton = screen.getByLabelText('Undo last change');
    expect(undoButton).toBeDisabled();
    expect(undoButton).toHaveClass('text-slate-500', 'cursor-not-allowed');
  });

  it('enables redo button when canRedo is true', () => {
    mockUseConfig.mockReturnValue({
      canUndo: false,
      canRedo: true,
      undo: vi.fn(),
      redo: vi.fn(),
    });

    render(<UndoRedoControls />);

    const redoButton = screen.getByLabelText('Redo last undone change');
    expect(redoButton).not.toBeDisabled();
    expect(redoButton).toHaveClass('text-slate-300');
  });

  it('disables redo button when canRedo is false', () => {
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: false,
      undo: vi.fn(),
      redo: vi.fn(),
    });

    render(<UndoRedoControls />);

    const redoButton = screen.getByLabelText('Redo last undone change');
    expect(redoButton).toBeDisabled();
    expect(redoButton).toHaveClass('text-slate-500', 'cursor-not-allowed');
  });

  it('calls undo when undo button is clicked', () => {
    const mockUndo = vi.fn();
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: true,
      undo: mockUndo,
      redo: vi.fn(),
    });

    render(<UndoRedoControls />);

    const undoButton = screen.getByLabelText('Undo last change');
    fireEvent.click(undoButton);

    expect(mockUndo).toHaveBeenCalledTimes(1);
  });

  it('calls redo when redo button is clicked', () => {
    const mockRedo = vi.fn();
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: true,
      undo: vi.fn(),
      redo: mockRedo,
    });

    render(<UndoRedoControls />);

    const redoButton = screen.getByLabelText('Redo last undone change');
    fireEvent.click(redoButton);

    expect(mockRedo).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    mockUseConfig.mockReturnValue({
      canUndo: true,
      canRedo: true,
      undo: vi.fn(),
      redo: vi.fn(),
    });

    render(<UndoRedoControls className="custom-class" />);

    const container = screen.getByLabelText('Undo last change').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});