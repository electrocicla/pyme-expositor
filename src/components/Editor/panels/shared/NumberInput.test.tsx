import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NumberInput } from './NumberInput';

describe('NumberInput', () => {
  it('renders with label and value', () => {
    render(
      <NumberInput
        label="Test Number"
        value={42}
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Number')).toBeInTheDocument();
    expect(screen.getByDisplayValue('42')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <NumberInput
        value={25}
        onChange={() => {}}
      />
    );

    const input = screen.getByDisplayValue('25');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <NumberInput
        label="Test Number"
        description="Enter a number between 0 and 100"
        value={50}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Enter a number between 0 and 100')).toBeInTheDocument();
  });

  it('renders with error', () => {
    render(
      <NumberInput
        label="Test Number"
        error="Value must be between 0 and 100"
        value={150}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Value must be between 0 and 100')).toBeInTheDocument();
    const input = screen.getByLabelText('Test Number');
    expect(input).toHaveClass('border-red-500');
  });

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <NumberInput
        label="Test Number"
        value={10}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Test Number');
    fireEvent.change(input, { target: { value: '25' } });

    expect(mockOnChange).toHaveBeenCalledWith(25);
  });

  it('handles empty value correctly', () => {
    const mockOnChange = vi.fn();
    render(
      <NumberInput
        label="Test Number"
        value={10}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Test Number');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  it('renders with placeholder', () => {
    render(
      <NumberInput
        label="Test Number"
        placeholder="Enter number"
        value={0}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Enter number');
    expect(input).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(
      <NumberInput
        label="Disabled Number"
        value={30}
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByLabelText('Disabled Number');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(
      <NumberInput
        label="Test Number"
        value={15}
        onChange={() => {}}
        className="custom-class"
      />
    );

    const container = screen.getByLabelText('Test Number').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders with min, max, and step attributes', () => {
    render(
      <NumberInput
        label="Constrained Number"
        value={50}
        onChange={() => {}}
        min={10}
        max={90}
        step={5}
      />
    );

    const input = screen.getByLabelText('Constrained Number');
    expect(input).toHaveAttribute('min', '10');
    expect(input).toHaveAttribute('max', '90');
    expect(input).toHaveAttribute('step', '5');
  });

  it('uses default min, max, and step values', () => {
    render(
      <NumberInput
        label="Default Number"
        value={75}
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Default Number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toHaveAttribute('step', '1');
  });

  it('handles decimal values', () => {
    const mockOnChange = vi.fn();
    render(
      <NumberInput
        label="Decimal Number"
        value={3.14}
        onChange={mockOnChange}
        step={0.01}
      />
    );

    const input = screen.getByLabelText('Decimal Number');
    expect(screen.getByDisplayValue('3.14')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '2.71' } });
    expect(mockOnChange).toHaveBeenCalledWith(2.71);
  });
});