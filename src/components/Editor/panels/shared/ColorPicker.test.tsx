import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ColorPicker } from './ColorPicker';

describe('ColorPicker', () => {
  it('renders with label and color input', () => {
    render(
      <ColorPicker
        label="Background Color"
        value="#ff0000"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Background Color')).toBeInTheDocument();
    const inputs = screen.getAllByDisplayValue('#ff0000');
    const colorInput = inputs.find(input => input.type === 'color');
    expect(colorInput).toBeInTheDocument();
    expect(colorInput).toHaveAttribute('type', 'color');
  });

  it('renders with text input when showInput is true', () => {
    render(
      <ColorPicker
        label="Text Color"
        value="#00ff00"
        onChange={() => {}}
        showInput={true}
      />
    );

    const inputs = screen.getAllByDisplayValue('#00ff00');
    const textInput = inputs.find(input => input.type === 'text');
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveAttribute('type', 'text');
  });

  it('renders without text input when showInput is false', () => {
    render(
      <ColorPicker
        label="Accent Color"
        value="#0000ff"
        onChange={() => {}}
        showInput={false}
      />
    );

    const colorInputs = screen.getAllByDisplayValue('#0000ff');
    expect(colorInputs).toHaveLength(1);
    expect(colorInputs[0]).toHaveAttribute('type', 'color');
  });

  it('renders with description', () => {
    render(
      <ColorPicker
        label="Primary Color"
        description="Choose your primary color"
        value="#ffffff"
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Choose your primary color')).toBeInTheDocument();
  });

  it('renders presets by default', () => {
    render(
      <ColorPicker
        label="Theme Color"
        value="#ff0000"
        onChange={() => {}}
      />
    );

    // Should have preset buttons (from quickColorPresets)
    const presetButtons = screen.getAllByRole('button');
    expect(presetButtons.length).toBeGreaterThan(0);
  });

  it('renders without presets when showPresets is false', () => {
    render(
      <ColorPicker
        label="Custom Color"
        value="#000000"
        onChange={() => {}}
        showPresets={false}
      />
    );

    // Should only have the color input, no preset buttons
    const buttons = screen.queryAllByRole('button');
    expect(buttons).toHaveLength(0);
  });

  it('calls onChange when color input changes', () => {
    const mockOnChange = vi.fn();
    render(
      <ColorPicker
        label="Color Input"
        value="#ff0000"
        onChange={mockOnChange}
      />
    );

    const inputs = screen.getAllByDisplayValue('#ff0000');
    const colorInput = inputs.find(input => input.type === 'color');
    fireEvent.change(colorInput!, { target: { value: '#00ff00' } });

    expect(mockOnChange).toHaveBeenCalledWith('#00ff00');
  });

  it('calls onChange when text input changes', () => {
    const mockOnChange = vi.fn();
    render(
      <ColorPicker
        label="Text Input Color"
        value="#ff0000"
        onChange={mockOnChange}
        showInput={true}
      />
    );

    const inputs = screen.getAllByDisplayValue('#ff0000');
    const textInput = inputs.find(input => input.type === 'text');
    fireEvent.change(textInput!, { target: { value: '#00ff00' } });

    expect(mockOnChange).toHaveBeenCalledWith('#00ff00');
  });

  it('calls onChange when preset button is clicked', () => {
    const mockOnChange = vi.fn();
    render(
      <ColorPicker
        label="Preset Color"
        value="#ff0000"
        onChange={mockOnChange}
        presets={['#ff0000', '#00ff00', '#0000ff']}
      />
    );

    const presetButtons = screen.getAllByRole('button');
    const greenButton = presetButtons.find(button =>
      button.style.backgroundColor === 'rgb(0, 255, 0)' ||
      button.title === '#00ff00'
    );

    if (greenButton) {
      fireEvent.click(greenButton);
      expect(mockOnChange).toHaveBeenCalledWith('#00ff00');
    }
  });

  it('renders with custom presets', () => {
    const customPresets = ['#ff0000', '#00ff00', '#0000ff'];
    render(
      <ColorPicker
        label="Custom Presets"
        value="#ff0000"
        onChange={() => {}}
        presets={customPresets}
      />
    );

    // Should have 3 preset buttons
    const presetButtons = screen.getAllByRole('button');
    expect(presetButtons).toHaveLength(3);
  });

  it('highlights selected preset', () => {
    render(
      <ColorPicker
        label="Selected Preset"
        value="#00ff00"
        onChange={() => {}}
        presets={['#ff0000', '#00ff00', '#0000ff']}
      />
    );

    const presetButtons = screen.getAllByRole('button');
    const selectedButton = presetButtons.find(button =>
      button.classList.contains('border-white') &&
      button.classList.contains('scale-110')
    );

    expect(selectedButton).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(
      <ColorPicker
        label="Disabled Color"
        value="#ff0000"
        onChange={() => {}}
        disabled
      />
    );

    const inputs = screen.getAllByDisplayValue('#ff0000');
    const colorInput = inputs.find(input => input.type === 'color');
    const textInput = inputs.find(input => input.type === 'text');
    expect(colorInput).toBeDisabled();
    expect(textInput).toBeDisabled();

    const presetButtons = screen.getAllByRole('button');
    presetButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  it('applies custom className', () => {
    render(
      <ColorPicker
        label="Custom Class"
        value="#ff0000"
        onChange={() => {}}
        className="custom-class"
      />
    );

    const container = screen.getByText('Custom Class').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('does not call onChange when preset clicked in disabled state', () => {
    const mockOnChange = vi.fn();
    render(
      <ColorPicker
        label="Disabled Preset"
        value="#ff0000"
        onChange={mockOnChange}
        presets={['#ff0000', '#00ff00']}
        disabled
      />
    );

    const presetButtons = screen.getAllByRole('button');
    fireEvent.click(presetButtons[1]);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});