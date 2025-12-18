/**
 * WaveSeparator Component Tests
 * Comprehensive test coverage for wave separator functionality
 */

import { render, screen } from '@testing-library/react';
import { WaveSeparator } from './WaveSeparator';

describe('WaveSeparator', () => {
  beforeEach(() => {
    // Mock timers for animation testing
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    render(<WaveSeparator />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 1000 120');
  });

  it('renders with custom height', () => {
    render(<WaveSeparator height={100} />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveStyle({ height: '120px' }); // height + 20
  });

  it('renders with custom color', () => {
    render(<WaveSeparator color="#ff0000" />);
    const paths = screen.getAllByRole('img', { hidden: true }).filter(el =>
      el.tagName.toLowerCase() === 'path'
    );
    expect(paths.length).toBeGreaterThan(0);
    // Note: Testing fill color would require more complex setup
  });

  it('renders bottom variant by default', () => {
    render(<WaveSeparator />);
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('wave-separator');
  });

  it('renders top variant', () => {
    render(<WaveSeparator variant="top" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
  });

  it('renders both variant with multiple waves', () => {
    render(<WaveSeparator variant="both" />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    // Both variant should have more paths
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(2);
  });

  it('applies custom className', () => {
    render(<WaveSeparator className="custom-class" />);
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies animated class when animated prop is true', () => {
    render(<WaveSeparator animated={true} />);
    const paths = screen.getAllByRole('img', { hidden: true }).filter(el =>
      el.tagName.toLowerCase() === 'path'
    );
    const animatedPaths = paths.filter(path => path.classList.contains('animate-pulse'));
    expect(animatedPaths.length).toBeGreaterThan(0);
  });

  it('does not apply animated class when animated prop is false', () => {
    render(<WaveSeparator animated={false} />);
    const paths = screen.getAllByRole('img', { hidden: true }).filter(el =>
      el.tagName.toLowerCase() === 'path'
    );
    const animatedPaths = paths.filter(path => path.classList.contains('animate-pulse'));
    expect(animatedPaths.length).toBe(0);
  });

  it('renders with flip prop', () => {
    render(<WaveSeparator flip={true} />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
    // The flip affects the wave path, but we can't easily test the path content
  });

  it('has proper accessibility attributes', () => {
    render(<WaveSeparator />);
    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveAttribute('preserveAspectRatio', 'none');
  });

  it('animates on mount', () => {
    render(<WaveSeparator />);
    const container = screen.getByRole('img', { hidden: true }).parentElement;

    // Initially should have opacity-0 and translate-y-4
    expect(container).toHaveClass('opacity-0', 'translate-y-4');

    // After timeout, should animate to visible
    jest.advanceTimersByTime(100);
    expect(container).toHaveClass('opacity-100', 'translate-y-0');
  });

  it('cleans up timer on unmount', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    const { unmount } = render(<WaveSeparator />);

    unmount();
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });

  it('renders correct number of paths for different variants', () => {
    // Bottom variant
    const { rerender } = render(<WaveSeparator variant="bottom" />);
    let paths = screen.getAllByRole('img', { hidden: true }).filter(el =>
      el.tagName.toLowerCase() === 'path'
    );
    expect(paths.length).toBe(2); // 2 paths for single wave

    // Top variant
    rerender(<WaveSeparator variant="top" />);
    paths = screen.getAllByRole('img', { hidden: true }).filter(el =>
      el.tagName.toLowerCase() === 'path'
    );
    expect(paths.length).toBe(2); // 2 paths for single wave

    // Both variant
    rerender(<WaveSeparator variant="both" />);
    paths = screen.getAllByRole('img', { hidden: true }).filter(el =>
      el.tagName.toLowerCase() === 'path'
    );
    expect(paths.length).toBe(4); // 4 paths for both waves
  });
});