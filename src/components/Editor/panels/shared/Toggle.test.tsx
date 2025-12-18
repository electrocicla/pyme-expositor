import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders regular toggle with label and description', () => {
    render(
      <Toggle
        label="Test Toggle"
        description="Test description"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Test Toggle')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'false');
  });

  it('renders compact toggle', () => {
    render(
      <Toggle
        label="Compact Toggle"
        checked={true}
        onChange={() => {}}
        compact
      />
    );

    expect(screen.getByText('Compact Toggle')).toBeInTheDocument();
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <Toggle
        label="Test Toggle"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('does not call onChange when disabled', () => {
    const mockOnChange = vi.fn();
    render(
      <Toggle
        label="Disabled Toggle"
        checked={false}
        onChange={mockOnChange}
        disabled
      />
    );

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('renders disabled state', () => {
    render(
      <Toggle
        label="Disabled Toggle"
        checked={true}
        onChange={() => {}}
        disabled
      />
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });

  it('applies custom className', () => {
    render(
      <Toggle
        label="Test Toggle"
        checked={false}
        onChange={() => {}}
        className="custom-class"
      />
    );

    const container = screen.getByRole('switch').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('toggles checked state correctly', () => {
    const mockOnChange = vi.fn();
    const { rerender } = render(
      <Toggle
        label="Test Toggle"
        checked={false}
        onChange={mockOnChange}
      />
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(mockOnChange).toHaveBeenCalledWith(true);

    rerender(
      <Toggle
        label="Test Toggle"
        checked={true}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('renders compact toggle without description', () => {
    render(
      <Toggle
        label="Compact Toggle"
        checked={false}
        onChange={() => {}}
        compact
      />
    );

    expect(screen.getByText('Compact Toggle')).toBeInTheDocument();
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });
});