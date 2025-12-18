/**
 * TabNavigation Component Tests
 * Comprehensive test coverage for tab navigation functionality
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TabNavigation } from './TabNavigation';

describe('TabNavigation', () => {
  const mockTabs = [
    { id: 'tab1', label: 'Tab 1', icon: <span>📁</span> },
    { id: 'tab2', label: 'Tab 2', icon: <span>⚙️</span> },
    { id: 'tab3', label: 'Tab 3' },
  ];

  const defaultProps = {
    tabs: mockTabs,
    activeTab: 'tab1' as const,
    onChange: vi.fn(),
  };

  it('renders all tabs with correct labels and icons', () => {
    render(<TabNavigation {...defaultProps} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();

    // Check icons are rendered
    expect(screen.getByText('📁')).toBeInTheDocument();
    expect(screen.getByText('⚙️')).toBeInTheDocument();
  });

  it('applies active styling to the active tab', () => {
    render(<TabNavigation {...defaultProps} />);

    const activeTab = screen.getByText('Tab 1').closest('button');
    expect(activeTab).toHaveClass('bg-blue-500/30', 'text-blue-300');
  });

  it('applies inactive styling to inactive tabs', () => {
    render(<TabNavigation {...defaultProps} />);

    const inactiveTab = screen.getByText('Tab 2').closest('button');
    expect(inactiveTab).toHaveClass('text-white/60');
  });

  it('calls onChange when a tab is clicked', () => {
    const mockOnChange = vi.fn();
    render(<TabNavigation {...defaultProps} onChange={mockOnChange} />);

    fireEvent.click(screen.getByText('Tab 2'));

    expect(mockOnChange).toHaveBeenCalledWith('tab2');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('renders with pills variant', () => {
    render(<TabNavigation {...defaultProps} variant="pills" />);

    const container = screen.getByText('Tab 1').closest('div');
    expect(container).toHaveClass('flex', 'flex-wrap', 'gap-2');
  });

  it('renders with underline variant', () => {
    render(<TabNavigation {...defaultProps} variant="underline" />);

    const container = screen.getByText('Tab 1').closest('div');
    expect(container).toHaveClass('flex', 'border-b', 'border-white/10');
  });

  it('renders with default variant', () => {
    render(<TabNavigation {...defaultProps} variant="default" />);

    const container = screen.getByText('Tab 1').closest('div');
    expect(container).toHaveClass('flex', 'flex-wrap', 'gap-1', 'p-1', 'bg-white/5', 'rounded-lg');
  });

  it('hides labels when showLabels is false', () => {
    render(<TabNavigation {...defaultProps} showLabels={false} />);

    expect(screen.queryByText('Tab 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Tab 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Tab 3')).not.toBeInTheDocument();

    // Icons should still be visible
    expect(screen.getByText('📁')).toBeInTheDocument();
    expect(screen.getByText('⚙️')).toBeInTheDocument();
  });

  it('shows labels on small screens for default variant when showLabels is true', () => {
    render(<TabNavigation {...defaultProps} variant="default" showLabels={true} />);

    const labelSpan = screen.getByText('Tab 1');
    expect(labelSpan).toHaveClass('hidden', 'sm:inline');
  });

  it('shows labels always for non-default variants', () => {
    render(<TabNavigation {...defaultProps} variant="pills" showLabels={true} />);

    const labelSpan = screen.getByText('Tab 1').parentElement;
    expect(labelSpan).not.toHaveClass('hidden');
  });

  it('applies custom className', () => {
    render(<TabNavigation {...defaultProps} className="custom-class" />);

    const container = screen.getByText('Tab 1').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('renders tabs without icons', () => {
    const tabsWithoutIcons = [
      { id: 'tab1', label: 'Tab 1' },
      { id: 'tab2', label: 'Tab 2' },
    ];

    render(<TabNavigation {...defaultProps} tabs={tabsWithoutIcons} />);

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();

    // No icons should be present
    expect(screen.queryByText('📁')).not.toBeInTheDocument();
  });

  it('handles empty tabs array', () => {
    const { container } = render(<TabNavigation {...defaultProps} tabs={[]} />);

    // Should render empty container without crashing
    const tabContainer = container.firstChild;
    expect(tabContainer).toBeInTheDocument();
    expect(tabContainer).toHaveClass('flex', 'flex-wrap', 'gap-1', 'p-1', 'bg-white/5', 'rounded-lg');
    expect(tabContainer?.childNodes).toHaveLength(0);
  });

  it('renders with different active tab', () => {
    render(<TabNavigation {...defaultProps} activeTab="tab3" />);

    const activeTab = screen.getByText('Tab 3').closest('button');
    expect(activeTab).toHaveClass('bg-blue-500/30', 'text-blue-300');

    const inactiveTab = screen.getByText('Tab 1').closest('button');
    expect(inactiveTab).toHaveClass('text-white/60');
  });

  it('maintains button type as button', () => {
    render(<TabNavigation {...defaultProps} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('applies correct pills variant styling', () => {
    render(<TabNavigation {...defaultProps} variant="pills" activeTab="tab1" />);

    const activeTab = screen.getByText('Tab 1').closest('button');
    expect(activeTab).toHaveClass('bg-blue-500', 'text-white', 'shadow-lg');

    const inactiveTab = screen.getByText('Tab 2').closest('button');
    expect(inactiveTab).toHaveClass('bg-white/5', 'text-white/60');
  });

  it('applies correct underline variant styling', () => {
    render(<TabNavigation {...defaultProps} variant="underline" activeTab="tab1" />);

    const activeTab = screen.getByText('Tab 1').closest('button');
    expect(activeTab).toHaveClass('border-blue-500', 'text-blue-300');

    const inactiveTab = screen.getByText('Tab 2').closest('button');
    expect(inactiveTab).toHaveClass('border-transparent', 'text-white/60');
  });
});