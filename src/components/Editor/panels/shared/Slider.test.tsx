import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('renders with label and value', () => {
    render(
      <Slider
        label="Test Slider"
        value={50}
        onChange={() => {}}
        min={0}
        max={100}
      />
    );

    expect(screen.getByText('Test Slider')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('value', '50');
  });

  it('renders without label', () => {
    render(
      <Slider
        value={25}
        onChange={() => {}}
        min={0}
        max={100}
        showValue={false}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('value', '25');
    expect(screen.queryByText(/25/)).not.toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <Slider
        label="Test Slider"
        description="Adjust the value"
        value={75}
        onChange={() => {}}
        min={0}
        max={100}
      />
    );

    expect(screen.getByText('Adjust the value')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const mockOnChange = vi.fn();
    render(
      <Slider
        label="Test Slider"
        value={30}
        onChange={mockOnChange}
        min={0}
        max={100}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '70' } });

    expect(mockOnChange).toHaveBeenCalledWith(70);
  });

  it('renders with custom min, max, and step', () => {
    render(
      <Slider
        label="Custom Slider"
        value={15}
        onChange={() => {}}
        min={10}
        max={50}
        step={5}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '10');
    expect(slider).toHaveAttribute('max', '50');
    expect(slider).toHaveAttribute('step', '5');
  });

  it('renders with default step', () => {
    render(
      <Slider
        label="Default Step Slider"
        value={20}
        onChange={() => {}}
        min={0}
        max={100}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('step', '1');
  });

  it('renders with showValue disabled', () => {
    render(
      <Slider
        label="Hidden Value Slider"
        value={40}
        onChange={() => {}}
        min={0}
        max={100}
        showValue={false}
      />
    );

    expect(screen.getByText('Hidden Value Slider')).toBeInTheDocument();
    expect(screen.queryByText('40')).not.toBeInTheDocument();
  });

  it('renders with custom formatValue', () => {
    render(
      <Slider
        label="Formatted Slider"
        value={25}
        onChange={() => {}}
        min={0}
        max={100}
        formatValue={(val) => `${val}%`}
      />
    );

    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('renders with custom accentColor', () => {
    render(
      <Slider
        label="Colored Slider"
        value={60}
        onChange={() => {}}
        min={0}
        max={100}
        accentColor="green"
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveClass('accent-green-500');
  });

  it('renders with default accentColor', () => {
    render(
      <Slider
        label="Default Color Slider"
        value={45}
        onChange={() => {}}
        min={0}
        max={100}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveClass('accent-blue-500');
  });

  it('renders disabled state', () => {
    render(
      <Slider
        label="Disabled Slider"
        value={80}
        onChange={() => {}}
        min={0}
        max={100}
        disabled
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toBeDisabled();
    expect(slider).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('applies custom className', () => {
    render(
      <Slider
        label="Custom Class Slider"
        value={35}
        onChange={() => {}}
        min={0}
        max={100}
        className="custom-class"
      />
    );

    const container = screen.getByText('Custom Class Slider').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('handles edge values', () => {
    const mockOnChange = vi.fn();

    render(
      <Slider
        label="Edge Value Slider"
        value={5}
        onChange={mockOnChange}
        min={0}
        max={10}
      />
    );

    const slider = screen.getByRole('slider');

    // Change to max value
    fireEvent.change(slider, { target: { value: '10' } });
    expect(mockOnChange).toHaveBeenCalledWith(10);

    // Change to min value
    fireEvent.change(slider, { target: { value: '0' } });
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });
});