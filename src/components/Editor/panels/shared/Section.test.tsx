import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Section } from './Section';

describe('Section', () => {
  it('renders with children', () => {
    render(<Section><div>Test content</div></Section>);

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with default variant', () => {
    render(<Section><div>Default section</div></Section>);

    const container = screen.getByText('Default section').parentElement;
    expect(container).toHaveClass('space-y-3');
  });

  it('renders with highlight variant', () => {
    render(<Section variant="highlight"><div>Highlight section</div></Section>);

    const container = screen.getByText('Highlight section').parentElement;
    expect(container).toHaveClass('p-3', 'bg-gradient-to-br', 'from-blue-500/10', 'to-purple-500/10', 'rounded-lg', 'border', 'border-blue-500/20');
  });

  it('renders with warning variant', () => {
    render(<Section variant="warning"><div>Warning section</div></Section>);

    const container = screen.getByText('Warning section').parentElement;
    expect(container).toHaveClass('p-4', 'bg-yellow-500/10', 'border', 'border-yellow-500/30', 'rounded-lg');
  });

  it('renders with info variant', () => {
    render(<Section variant="info"><div>Info section</div></Section>);

    const container = screen.getByText('Info section').parentElement;
    expect(container).toHaveClass('p-3', 'bg-blue-500/10', 'border', 'border-blue-500/30', 'rounded-lg');
  });

  it('renders with none variant', () => {
    render(<Section variant="none"><div>None section</div></Section>);

    const container = screen.getByText('None section').parentElement;
    expect(container).toHaveClass('space-y-3');
  });

  it('renders with animation when animate is true', () => {
    render(<Section animate><div>Animated section</div></Section>);

    const container = screen.getByText('Animated section').parentElement;
    expect(container).toHaveClass('animate-in', 'fade-in', 'duration-200');
  });

  it('renders without animation when animate is false', () => {
    render(<Section animate={false}><div>Non-animated section</div></Section>);

    const container = screen.getByText('Non-animated section').parentElement;
    expect(container).not.toHaveClass('animate-in', 'fade-in', 'duration-300');
  });

  it('applies custom className', () => {
    render(<Section className="custom-class"><div>Custom section</div></Section>);

    const container = screen.getByText('Custom section').parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('applies borderColor style', () => {
    render(<Section borderColor="#ff0000"><div>Border section</div></Section>);

    const container = screen.getByText('Border section').parentElement;
    expect(container).toHaveStyle({
      borderLeft: '2px solid #ff0000',
      paddingLeft: '12px'
    });
  });

  it('combines variant, animation, and custom class', () => {
    render(
      <Section
        variant="highlight"
        animate
        className="custom-class"
        borderColor="#00ff00"
      >
        <div>Combined section</div>
      </Section>
    );

    const container = screen.getByText('Combined section').parentElement;
    expect(container).toHaveClass('p-3', 'bg-gradient-to-br', 'from-blue-500/10', 'to-purple-500/10', 'rounded-lg', 'border', 'border-blue-500/20');
    expect(container).toHaveClass('animate-in', 'fade-in', 'duration-200');
    expect(container).toHaveClass('custom-class');
    expect(container).toHaveStyle({
      borderLeft: '2px solid #00ff00',
      paddingLeft: '12px'
    });
  });
});