import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InfoBox } from './InfoBox';

describe('InfoBox', () => {
  it('renders with default info variant', () => {
    render(<InfoBox>Test message</InfoBox>);

    // Find the outer container by looking for the element with the background class
    const container = document.querySelector('.bg-blue-500\\/10');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('border-blue-500/30');
  });

  it('renders with title', () => {
    render(
      <InfoBox title="Test Title">
        Test message
      </InfoBox>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders with warning variant', () => {
    render(<InfoBox variant="warning">Warning message</InfoBox>);

    const container = document.querySelector('.bg-yellow-500\\/10');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('border-yellow-500/30');
  });

  it('renders with tip variant', () => {
    render(<InfoBox variant="tip">Tip message</InfoBox>);

    const container = document.querySelector('.bg-green-500\\/10');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('border-green-500/30');
  });

  it('renders with success variant', () => {
    render(<InfoBox variant="success">Success message</InfoBox>);

    const container = document.querySelector('.bg-emerald-500\\/10');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('border-emerald-500/30');
  });

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">Custom</span>;
    render(
      <InfoBox icon={customIcon}>
        Test message
      </InfoBox>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('InfoIcon')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <InfoBox className="custom-class">
        Test message
      </InfoBox>
    );

    const container = document.querySelector('.bg-blue-500\\/10');
    expect(container).toHaveClass('custom-class');
  });

  it('renders complex children', () => {
    render(
      <InfoBox>
        <strong>Bold text</strong> and <em>italic text</em>
      </InfoBox>
    );

    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('and')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
  });
});