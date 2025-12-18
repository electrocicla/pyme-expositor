import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders with label and value', () => {
    render(
      <Input
        label="Test Label"
        value="test value"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <Input
        value="test value"
        onChange={() => {}}
      />
    );

    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Input
        label="Test Label"
        description="Test description"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with error', () => {
    render(
      <Input
        label="Test Label"
        error="Test error"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveClass('border-red-500');
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Input
        label="Test Label"
        value="initial"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText('Test Label');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('renders with placeholder', () => {
    render(
      <Input
        label="Test Label"
        placeholder="Enter text"
        value=""
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('renders with different input types', () => {
    render(
      <Input
        label="Email"
        type="email"
        value="test@example.com"
        onChange={() => {}}
      />
    );

    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders disabled state', () => {
    render(
      <Input
        label="Disabled Input"
        value="disabled value"
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByLabelText('Disabled Input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(
      <Input
        label="Test Label"
        value=""
        onChange={() => {}}
        className="custom-class"
      />
    );

    const container = screen.getByLabelText('Test Label').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders with min and max attributes for number type', () => {
    render(
      <Input
        label="Number Input"
        type="number"
        value="5"
        onChange={() => {}}
        min={0}
        max={10}
      />
    );

    const input = screen.getByLabelText('Number Input');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '10');
  });
});