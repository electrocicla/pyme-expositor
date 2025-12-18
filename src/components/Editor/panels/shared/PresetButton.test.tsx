import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PresetButton } from './PresetButton';

describe('PresetButton', () => {
  it('renders with label', () => {
    render(<PresetButton label="Test Preset" onClick={() => {}} />);

    expect(screen.getByText('Test Preset')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Test Preset');
  });

  it('renders with icon', () => {
    render(<PresetButton label="Icon Preset" icon={<span>🔧</span>} onClick={() => {}} />);

    expect(screen.getByText('🔧')).toBeInTheDocument();
    expect(screen.getByText('Icon Preset')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<PresetButton label="Click Me" onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with default colors', () => {
    render(<PresetButton label="Default Colors" onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-linear-to-br',
      'from-slate-600/20',
      'to-slate-700/20',
      'border-slate-500/30',
      'text-slate-300'
    );
  });

  it('renders with custom colors', () => {
    const customColors = {
      from: 'from-blue-500/20',
      to: 'to-blue-600/20',
      border: 'border-blue-400/30',
      text: 'text-blue-300',
    };

    render(<PresetButton label="Custom Colors" colors={customColors} onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'bg-linear-to-br',
      'from-blue-500/20',
      'to-blue-600/20',
      'border-blue-400/30',
      'text-blue-300'
    );
  });

  it('applies custom className', () => {
    render(<PresetButton label="Custom Class" className="custom-class" onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has correct base classes', () => {
    render(<PresetButton label="Base Classes" onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-3',
      'py-2',
      'rounded-lg',
      'text-xs',
      'hover:opacity-90',
      'transition-all',
      'duration-200',
      'flex',
      'items-center',
      'gap-1.5'
    );
  });

  it('renders without icon', () => {
    render(<PresetButton label="No Icon" onClick={() => {}} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('No Icon');
    // Should not have any icon spans
    const icons = button.querySelectorAll('span');
    expect(icons).toHaveLength(0);
  });
});