import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders with title', () => {
    render(<SectionHeader title="Test Title" />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Title');
  });

  it('renders with icon', () => {
    render(<SectionHeader title="Icon Title" icon={<span>🔧</span>} />);

    expect(screen.getByText('🔧')).toBeInTheDocument();
    const iconContainer = screen.getByText('🔧').parentElement;
    expect(iconContainer).toHaveClass('w-6', 'h-6', 'rounded-md', 'bg-linear-to-br', 'from-blue-500/20', 'to-purple-500/20');
  });

  it('renders with description', () => {
    render(<SectionHeader title="Title with Description" description="This is a description" />);

    expect(screen.getByText('This is a description')).toBeInTheDocument();
    const description = screen.getByText('This is a description');
    expect(description).toHaveClass('text-xs', 'text-slate-400', 'mt-0.5');
  });

  it('renders without icon', () => {
    render(<SectionHeader title="No Icon Title" />);

    expect(screen.getByText('No Icon Title')).toBeInTheDocument();
    // Should not have icon container
    const icons = screen.queryAllByText('🔧');
    expect(icons).toHaveLength(0);
  });

  it('applies custom className', () => {
    render(<SectionHeader title="Custom Class Title" className="custom-class" />);

    const container = screen.getByText('Custom Class Title').parentElement?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('has correct base classes', () => {
    render(<SectionHeader title="Base Classes Title" />);

    const container = screen.getByText('Base Classes Title').parentElement?.parentElement;
    expect(container).toHaveClass('flex', 'items-center', 'gap-2', 'mb-3');
  });

  it('does not have mb-3 when description is present', () => {
    render(<SectionHeader title="No Margin Title" description="Description" />);

    const container = screen.getByText('No Margin Title').closest('div');
    expect(container).not.toHaveClass('mb-3');
  });

  it('renders icon with correct styling', () => {
    render(<SectionHeader title="Styled Icon" icon={<span>⚙️</span>} />);

    const iconContainer = screen.getByText('⚙️').parentElement;
    expect(iconContainer).toHaveClass('flex', 'items-center', 'justify-center', 'text-blue-400');
  });

  it('renders title with correct styling', () => {
    render(<SectionHeader title="Styled Title" />);

    const title = screen.getByText('Styled Title');
    expect(title).toHaveClass('text-sm', 'font-semibold', 'text-white');
  });
});