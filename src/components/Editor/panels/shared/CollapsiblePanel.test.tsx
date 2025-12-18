import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CollapsiblePanel } from './CollapsiblePanel';

describe('CollapsiblePanel', () => {
  it('renders with title and children', () => {
    render(
      <CollapsiblePanel title="Test Panel">
        <div>Test content</div>
      </CollapsiblePanel>
    );

    expect(screen.getByText('Test Panel')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <CollapsiblePanel title="Panel with Icon" icon={<span>🔧</span>}>
        <div>Content</div>
      </CollapsiblePanel>
    );

    expect(screen.getByText('🔧')).toBeInTheDocument();
  });

  it('renders with description', () => {
    render(
      <CollapsiblePanel
        title="Panel with Description"
        description="This is a description"
      >
        <div>Content</div>
      </CollapsiblePanel>
    );

    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('renders with badge', () => {
    render(
      <CollapsiblePanel title="Panel with Badge" badge={<span>NEW</span>}>
        <div>Content</div>
      </CollapsiblePanel>
    );

    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('is open by default', () => {
    render(
      <CollapsiblePanel title="Default Open Panel">
        <div>Content</div>
      </CollapsiblePanel>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Content')).toBeVisible();
  });

  it('is closed when defaultOpen is false', () => {
    render(
      <CollapsiblePanel title="Closed Panel" defaultOpen={false}>
        <div>Content</div>
      </CollapsiblePanel>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // In jsdom, elements with opacity-0 are still considered visible, so we check the aria-expanded instead
  });

  it('toggles open/closed when clicked', () => {
    render(
      <CollapsiblePanel title="Toggle Panel" defaultOpen={true}>
        <div>Content</div>
      </CollapsiblePanel>
    );

    const button = screen.getByRole('button');

    // Initially open
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onChange when toggled', () => {
    const mockOnChange = vi.fn();
    render(
      <CollapsiblePanel title="Change Panel" onChange={mockOnChange}>
        <div>Content</div>
      </CollapsiblePanel>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('renders with different color schemes', () => {
    const { rerender } = render(
      <CollapsiblePanel title="Primary Panel" colorScheme="primary">
        <div>Content</div>
      </CollapsiblePanel>
    );

    let container = screen.getByRole('button').closest('.border');
    expect(container).toHaveClass('border-blue-500/20');

    rerender(
      <CollapsiblePanel title="Success Panel" colorScheme="success">
        <div>Content</div>
      </CollapsiblePanel>
    );

    container = screen.getByRole('button').closest('.border');
    expect(container).toHaveClass('border-emerald-500/20');
  });

  it('renders without divider when showDivider is false', () => {
    render(
      <CollapsiblePanel title="No Divider Panel" showDivider={false}>
        <div>Content</div>
      </CollapsiblePanel>
    );

    // Should not have divider elements
    const dividers = screen.queryAllByRole('separator');
    expect(dividers).toHaveLength(0);
  });

  it('applies custom className', () => {
    render(
      <CollapsiblePanel title="Custom Class Panel" className="custom-class">
        <div>Content</div>
      </CollapsiblePanel>
    );

    const container = screen.getByRole('button').closest('.border');
    expect(container).toHaveClass('custom-class');
  });

  it('handles complex children', () => {
    render(
      <CollapsiblePanel title="Complex Panel">
        <div>
          <h4>Subheading</h4>
          <p>Paragraph content</p>
          <button>Action Button</button>
        </div>
      </CollapsiblePanel>
    );

    expect(screen.getByText('Subheading')).toBeInTheDocument();
    expect(screen.getByText('Paragraph content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  it('maintains accessibility attributes', () => {
    render(
      <CollapsiblePanel title="Accessible Panel">
        <div>Content</div>
      </CollapsiblePanel>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');

    // Chevron should have aria-hidden
    const chevron = document.querySelector('svg');
    expect(chevron).toHaveAttribute('aria-hidden', 'true');
  });

  it('handles empty children gracefully', () => {
    render(
      <CollapsiblePanel title="Empty Panel">
        {null}
      </CollapsiblePanel>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });
});