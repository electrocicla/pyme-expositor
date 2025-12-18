import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with label and value', () => {
    render(
      <Textarea
        label="Test Textarea"
        value="Sample text"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Textarea')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sample text')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <Textarea
        value="Content without label"
        onChange={() => {}}
      />
    );

    const textarea = screen.getByDisplayValue('Content without label');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Textarea
        label="Test Textarea"
        description="Enter your message here"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Enter your message here')).toBeInTheDocument();
  });

  it('renders with error', () => {
    render(
      <Textarea
        label="Test Textarea"
        error="This field is required"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveClass('border-red-500');
  });

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Textarea
        label="Test Textarea"
        value="Initial text"
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByLabelText('Test Textarea');
    fireEvent.change(textarea, { target: { value: 'Updated text' } });

    expect(mockOnChange).toHaveBeenCalledWith('Updated text');
  });

  it('renders with placeholder', () => {
    render(
      <Textarea
        label="Test Textarea"
        placeholder="Type something..."
        value=""
        onChange={() => {}}
      />
    );

    const textarea = screen.getByPlaceholderText('Type something...');
    expect(textarea).toBeInTheDocument();
  });

  it('renders with custom rows', () => {
    render(
      <Textarea
        label="Test Textarea"
        value="Test"
        onChange={() => {}}
        rows={5}
      />
    );

    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('renders with default rows', () => {
    render(
      <Textarea
        label="Test Textarea"
        value="Test"
        onChange={() => {}}
      />
    );

    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('renders with resize enabled', () => {
    render(
      <Textarea
        label="Test Textarea"
        value="Test"
        onChange={() => {}}
        resize
      />
    );

    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).not.toHaveClass('resize-none');
  });

  it('renders with resize disabled by default', () => {
    render(
      <Textarea
        label="Test Textarea"
        value="Test"
        onChange={() => {}}
      />
    );

    const textarea = screen.getByLabelText('Test Textarea');
    expect(textarea).toHaveClass('resize-none');
  });

  it('renders disabled state', () => {
    render(
      <Textarea
        label="Disabled Textarea"
        value="Disabled content"
        onChange={() => {}}
        disabled
      />
    );

    const textarea = screen.getByLabelText('Disabled Textarea');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(
      <Textarea
        label="Test Textarea"
        value="Test"
        onChange={() => {}}
        className="custom-class"
      />
    );

    const container = screen.getByLabelText('Test Textarea').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('handles multiline text', () => {
    const multilineText = 'Line 1\nLine 2\nLine 3';
    const mockOnChange = vi.fn();

    render(
      <Textarea
        label="Multiline Textarea"
        value={multilineText}
        onChange={mockOnChange}
      />
    );

    const textarea = screen.getByLabelText('Multiline Textarea');
    expect(textarea).toHaveValue(multilineText);

    const newText = 'New line 1\nNew line 2';
    fireEvent.change(textarea, { target: { value: newText } });
    expect(mockOnChange).toHaveBeenCalledWith(newText);
  });
});