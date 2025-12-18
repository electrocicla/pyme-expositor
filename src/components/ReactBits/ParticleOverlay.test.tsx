/**
 * ParticleOverlay Component Tests
 * Basic test coverage for floating particles overlay component
 */

import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { ParticleOverlay } from './ParticleOverlay';

describe('ParticleOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders canvas element', () => {
    render(<ParticleOverlay />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('absolute', 'inset-0', 'pointer-events-none');
  });

  it('applies custom className', () => {
    render(<ParticleOverlay className="custom-particles" />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveClass('custom-particles');
  });

  it('applies custom style', () => {
    const customStyle = { zIndex: 10 };
    render(<ParticleOverlay style={customStyle} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toHaveStyle('z-index: 10');
  });

  it('renders with custom density', () => {
    render(<ParticleOverlay density={25} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom colors', () => {
    render(<ParticleOverlay colors={['#ff0000', '#00ff00']} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom size range', () => {
    render(<ParticleOverlay size={{ min: 1, max: 8 }} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with custom speed range', () => {
    render(<ParticleOverlay speed={{ min: 0.1, max: 3 }} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders with all custom props', () => {
    render(<ParticleOverlay
      density={25}
      colors={['#ff0000', '#00ff00']}
      size={{ min: 1, max: 4 }}
      speed={{ min: 0.2, max: 1 }}
    />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});