import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PanelHeader } from './PanelHeader';

describe('PanelHeader', () => {
  it('renders with title', () => {
    render(<PanelHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Title');
  });

  it('renders with subtitle', () => {
    render(<PanelHeader title="Main Title" subtitle="Subtitle text" />);

    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle text')).toBeInTheDocument();
  });

  it('renders without subtitle', () => {
    render(<PanelHeader title="Title Only" />);

    expect(screen.getByText('Title Only')).toBeInTheDocument();
    expect(screen.queryByText(/subtitle/i)).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PanelHeader title="Custom Class" className="custom-class" />);

    const container = screen.getByText('Custom Class').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('has correct heading hierarchy', () => {
    render(<PanelHeader title="Heading Test" subtitle="With subtitle" />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('text-lg', 'font-semibold', 'text-white/90');
  });

  it('renders subtitle with correct styling', () => {
    render(<PanelHeader title="Title" subtitle="Test subtitle" />);

    const subtitle = screen.getByText('Test subtitle');
    expect(subtitle).toHaveClass('text-sm', 'text-white/50', 'mt-1');
  });
});