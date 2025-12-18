import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SectionStatusControl } from './SectionStatusControl';

describe('SectionStatusControl', () => {
  const defaultProps = {
    enabled: true,
    order: 2,
    totalSections: 4,
    sectionName: 'Hero Section',
    canDisable: true,
    onToggle: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
  };

  it('renders enabled state correctly', () => {
    render(<SectionStatusControl {...defaultProps} />);

    expect(screen.getByText('Visible on Page')).toBeInTheDocument();
    expect(screen.getByText('Position: 2 of 4')).toBeInTheDocument();
    expect(screen.getByText('Remove Hero Section from Page')).toBeInTheDocument();
  });

  it('renders disabled state correctly', () => {
    render(<SectionStatusControl {...defaultProps} enabled={false} />);

    expect(screen.getByText('Hidden from Page')).toBeInTheDocument();
    expect(screen.queryByText(/Position:/)).not.toBeInTheDocument();
    expect(screen.getByText('Add Hero Section to Page')).toBeInTheDocument();
    expect(screen.getByText('Configure the section below, then click "Add to Page" to make it visible.')).toBeInTheDocument();
  });

  it('calls onToggle when toggle button is clicked', () => {
    const mockOnToggle = vi.fn();
    render(<SectionStatusControl {...defaultProps} onToggle={mockOnToggle} />);

    const toggleButton = screen.getByText('Remove Hero Section from Page');
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith(false);
  });

  it('calls onToggle with true when adding to page', () => {
    const mockOnToggle = vi.fn();
    render(<SectionStatusControl {...defaultProps} enabled={false} onToggle={mockOnToggle} />);

    const toggleButton = screen.getByText('Add Hero Section to Page');
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith(true);
  });

  it('shows required message when canDisable is false', () => {
    render(<SectionStatusControl {...defaultProps} canDisable={false} />);

    expect(screen.getByText('Hero Section is required and cannot be removed')).toBeInTheDocument();
    expect(screen.queryByText(/Remove.*from Page/)).not.toBeInTheDocument();
  });

  it('renders move up button when enabled and callbacks provided', () => {
    render(<SectionStatusControl {...defaultProps} />);

    const moveUpButton = screen.getByTitle('Move section up');
    expect(moveUpButton).toBeInTheDocument();
    expect(moveUpButton).not.toBeDisabled();
  });

  it('renders move down button when enabled and callbacks provided', () => {
    render(<SectionStatusControl {...defaultProps} />);

    const moveDownButton = screen.getByTitle('Move section down');
    expect(moveDownButton).toBeInTheDocument();
    expect(moveDownButton).not.toBeDisabled();
  });

  it('disables move up button when at first position', () => {
    render(<SectionStatusControl {...defaultProps} order={1} />);

    const moveUpButton = screen.getByTitle('Move section up');
    expect(moveUpButton).toBeDisabled();
  });

  it('disables move down button when at last position', () => {
    render(<SectionStatusControl {...defaultProps} order={4} totalSections={4} />);

    const moveDownButton = screen.getByTitle('Move section down');
    expect(moveDownButton).toBeDisabled();
  });

  it('calls onMoveUp when move up button is clicked', () => {
    const mockOnMoveUp = vi.fn();
    render(<SectionStatusControl {...defaultProps} onMoveUp={mockOnMoveUp} />);

    const moveUpButton = screen.getByTitle('Move section up');
    fireEvent.click(moveUpButton);

    expect(mockOnMoveUp).toHaveBeenCalledTimes(1);
  });

  it('calls onMoveDown when move down button is clicked', () => {
    const mockOnMoveDown = vi.fn();
    render(<SectionStatusControl {...defaultProps} onMoveDown={mockOnMoveDown} />);

    const moveDownButton = screen.getByTitle('Move section down');
    fireEvent.click(moveDownButton);

    expect(mockOnMoveDown).toHaveBeenCalledTimes(1);
  });

  it('does not render move buttons when disabled', () => {
    render(<SectionStatusControl {...defaultProps} enabled={false} />);

    expect(screen.queryByTitle('Move section up')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Move section down')).not.toBeInTheDocument();
  });

  it('does not render move buttons when callbacks not provided', () => {
    render(<SectionStatusControl {...defaultProps} onMoveUp={undefined} onMoveDown={undefined} />);

    expect(screen.queryByTitle('Move section up')).not.toBeInTheDocument();
    expect(screen.queryByTitle('Move section down')).not.toBeInTheDocument();
  });

  it('applies correct styling for enabled state', () => {
    render(<SectionStatusControl {...defaultProps} />);

    const container = screen.getByText('Visible on Page').parentElement?.parentElement?.parentElement;
    expect(container).toHaveClass('bg-emerald-500/10', 'border-emerald-500/30');
  });

  it('applies correct styling for disabled state', () => {
    render(<SectionStatusControl {...defaultProps} enabled={false} />);

    const container = screen.getByText('Hidden from Page').parentElement?.parentElement?.parentElement;
    expect(container).toHaveClass('bg-slate-800/50', 'border-white/10');
  });

  it('shows correct position text', () => {
    render(<SectionStatusControl {...defaultProps} order={1} totalSections={3} />);

    expect(screen.getByText('Position: 1 of 3')).toBeInTheDocument();
  });
});