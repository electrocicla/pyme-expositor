/**
 * TypewriterText Component Tests
 * Comprehensive test coverage for typewriter animation functionality
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TypewriterText } from './TypewriterText';

describe('TypewriterText', () => {
  const testText = 'Hello';

  it('renders empty text initially', () => {
    render(<TypewriterText text={testText} speed={0} />);
    // Should contain cursor only
    expect(screen.getByText('|')).toBeInTheDocument();
  });

  it('renders complete text immediately with speed 0', async () => {
    render(<TypewriterText text={testText} speed={0} />);
    await waitFor(() => {
      expect(screen.getByText(testText)).toBeInTheDocument();
    });
  });

  it('shows blinking cursor by default', () => {
    render(<TypewriterText text={testText} speed={0} />);
    const cursor = screen.getByText('|');
    expect(cursor).toBeInTheDocument();
    expect(cursor).toHaveClass('animate-pulse');
  });

  it('hides cursor when cursor prop is false', () => {
    render(<TypewriterText text={testText} speed={0} cursor={false} />);
    expect(screen.queryByText('|')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TypewriterText text={testText} speed={0} className="custom-class" />);
    const container = screen.getByText(testText).closest('span');
    expect(container).toHaveClass('custom-class');
  });

  it('calls onComplete callback when animation finishes', async () => {
    const mockOnComplete = vi.fn();
    render(<TypewriterText text="Hi" speed={10} onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 100 });
  });

  it('loops animation when loop is true', async () => {
    const mockOnComplete = vi.fn();
    render(<TypewriterText text="Hi" speed={10} loop={true} onComplete={mockOnComplete} />);

    // Wait for first completion
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 100 });

    // Wait for second completion (loop) - simplified timing
    await new Promise(resolve => setTimeout(resolve, 2100));
    expect(mockOnComplete).toHaveBeenCalledTimes(2);
  });

  it('does not loop when loop is false', async () => {
    const mockOnComplete = vi.fn();
    render(<TypewriterText text={testText} speed={1} loop={false} onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledTimes(1);
    }, { timeout: testText.length * 1 + 200 });

    // Wait longer to ensure no second call
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('handles empty text', () => {
    render(<TypewriterText text="" speed={0} />);
    // Should only have cursor
    expect(screen.getByText('|')).toBeInTheDocument();
  });

  it('handles single character text', async () => {
    const mockOnComplete = vi.fn();
    render(<TypewriterText text="A" speed={1} onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
    }, { timeout: 50 });

    // Give a bit more time for the callback
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });
});