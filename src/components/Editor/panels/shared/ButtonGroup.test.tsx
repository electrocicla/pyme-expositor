import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1', icon: '🔧' },
    { value: 'option2', label: 'Option 2', icon: '⚙️' },
    { value: 'option3', label: 'Option 3', icon: '🔨' },
  ];

  it('renders with label and options', () => {
    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        label="Select Option"
      />
    );

    expect(screen.getByText('Select Option')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('highlights selected option', () => {
    render(
      <ButtonGroup
        value="option2"
        onChange={() => {}}
        options={mockOptions}
      />
    );

    const buttons = screen.getAllByRole('button');
    const selectedButton = buttons.find(button => button.textContent?.includes('Option 2'));
    expect(selectedButton).toHaveClass('border-blue-500', 'bg-blue-500/20');
  });

  it('calls onChange when option is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <ButtonGroup
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
      />
    );

    const option2Button = screen.getByText('Option 2').closest('button');
    fireEvent.click(option2Button!);

    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('renders with different column counts', () => {
    const { rerender } = render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        columns={2}
      />
    );

    let container = screen.getByText('Option 1').closest('.grid');
    expect(container).toHaveClass('grid-cols-2');

    rerender(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        columns={4}
      />
    );

    container = screen.getByText('Option 1').closest('.grid');
    expect(container).toHaveClass('grid-cols-4');
  });

  it('renders with different gap sizes', () => {
    const { rerender } = render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        gap="xs"
      />
    );

    let container = screen.getByText('Option 1').closest('.grid');
    expect(container).toHaveClass('gap-1');

    rerender(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        gap="lg"
      />
    );

    container = screen.getByText('Option 1').closest('.grid');
    expect(container).toHaveClass('gap-4');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        size="sm"
      />
    );

    let button = screen.getByText('Option 1').closest('button');
    expect(button).toHaveClass('p-2');

    rerender(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        size="lg"
      />
    );

    button = screen.getByText('Option 1').closest('button');
    expect(button).toHaveClass('p-4');
  });

  it('renders without labels when showLabels is false', () => {
    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        showLabels={false}
      />
    );

    // Should not show text labels, only icons
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        disabled
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });
  });

  it('does not call onChange when disabled', () => {
    const mockOnChange = vi.fn();
    render(
      <ButtonGroup
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        disabled
      />
    );

    const option2Button = screen.getByText('Option 2').closest('button');
    fireEvent.click(option2Button!);

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={mockOptions}
        className="custom-class"
      />
    );

    const container = screen.getByText('Option 1').closest('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('handles allowDeselect functionality', () => {
    const mockOnChange = vi.fn();
    render(
      <ButtonGroup
        value="option1"
        onChange={mockOnChange}
        options={mockOptions}
        allowDeselect
        defaultValue="none"
      />
    );

    const option1Button = screen.getByText('Option 1').closest('button');
    fireEvent.click(option1Button!);

    expect(mockOnChange).toHaveBeenCalledWith('none');
  });

  it('renders with descriptions as titles', () => {
    const optionsWithDescriptions = [
      { value: 'option1', label: 'Option 1', description: 'First option' },
      { value: 'option2', label: 'Option 2', description: 'Second option' },
    ];

    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={optionsWithDescriptions}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveAttribute('title', 'First option');
    expect(buttons[1]).toHaveAttribute('title', 'Second option');
  });

  it('handles options without icons', () => {
    const optionsWithoutIcons = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    render(
      <ButtonGroup
        value="option1"
        onChange={() => {}}
        options={optionsWithoutIcons}
      />
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });
});