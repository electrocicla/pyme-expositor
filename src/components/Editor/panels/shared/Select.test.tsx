import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from './Select';

describe('Select', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2', description: 'Description for option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
  ];

  it('renders with label and options', () => {
    render(
      <Select
        label="Test Select"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <Select
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const select = screen.getByDisplayValue('Option 1');
    expect(select).toBeInTheDocument();
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Select
        label="Test Select"
        description="Test description"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('renders with error', () => {
    render(
      <Select
        label="Test Select"
        error="Test error"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    const select = screen.getByLabelText('Test Select');
    expect(select).toHaveClass('border-red-500');
  });

  it('calls onChange when selection changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Select
        label="Test Select"
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );

    const select = screen.getByLabelText('Test Select');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('renders disabled state', () => {
    render(
      <Select
        label="Disabled Select"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        disabled
      />
    );

    const select = screen.getByLabelText('Disabled Select');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('renders disabled options', () => {
    render(
      <Select
        label="Test Select"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const disabledOption = screen.getByText('Option 3');
    expect(disabledOption).toBeDisabled();
  });

  it('applies custom className', () => {
    render(
      <Select
        label="Test Select"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        className="custom-class"
      />
    );

    const container = screen.getByLabelText('Test Select').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders all options', () => {
    render(
      <Select
        label="Test Select"
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('handles generic type parameter', () => {
    const stringOptions = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
    ];

    render(
      <Select<string>
        label="Generic Select"
        value="a"
        onChange={() => {}}
        options={stringOptions}
      />
    );

    expect(screen.getByLabelText('Generic Select')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A')).toBeInTheDocument();
  });
});