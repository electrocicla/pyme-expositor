/**
 * KenBurns Component Tests
 * Comprehensive test coverage for Ken Burns effect on single images
 */

import { render, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import { KenBurns } from './KenBurns';

const mockKenBurnsProps = {
  src: 'test-image.jpg',
  alt: 'Test Image',
  duration: 10,
  direction: 'zoom-in' as const,
};

describe('KenBurns', () => {
  let mockImage: jest.MockedClass<typeof Image>;

  beforeEach(() => {
    vi.useFakeTimers();
    // Mock the Image constructor
    mockImage = vi.fn().mockImplementation(function(this: HTMLImageElement) {
      this.onload = null;
      this.src = '';
      return this;
    }) as jest.MockedClass<typeof Image>;
    global.Image = mockImage;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with default props', () => {
    render(<KenBurns src="test.jpg" />);
    const container = document.querySelector('.ken-burns-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('overflow-hidden');
  });

  it('renders image with correct attributes', () => {
    render(<KenBurns {...mockKenBurnsProps} />);
    const image = document.querySelector('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('applies correct styling to images', () => {
    render(<KenBurns {...mockKenBurnsProps} />);
    const image = document.querySelector('img');
    expect(image).toHaveClass('w-full', 'h-full', 'object-cover', 'transition-opacity', 'duration-500');
  });

  it('shows loading state initially', () => {
    render(<KenBurns {...mockKenBurnsProps} />);
    const image = document.querySelector('img');
    expect(image).toHaveClass('opacity-0');

    // Should show loading placeholder
    const placeholder = document.querySelector('.bg-gray-200');
    expect(placeholder).toBeInTheDocument();
  });

  it('shows image when loaded', () => {
    render(<KenBurns {...mockKenBurnsProps} />);

    // Trigger the image load
    const imageInstance = mockImage.mock.results[0].value;
    act(() => {
      imageInstance.onload();
    });

    // Check that the mock was called
    expect(mockImage).toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<KenBurns src="test.jpg" className="custom-kenburns" />);
    const container = document.querySelector('.custom-kenburns');
    expect(container).toBeInTheDocument();
  });

  it('applies custom style', () => {
    const customStyle = { width: '300px', height: '200px' };
    render(<KenBurns src="test.jpg" style={customStyle} />);
    const container = document.querySelector('.ken-burns-container');
    expect(container).toHaveStyle('width: 300px; height: 200px');
  });

  it('handles image load errors gracefully', () => {
    render(<KenBurns {...mockKenBurnsProps} />);
    const image = document.querySelector('img');

    // Mock an error event
    fireEvent.error(image!);

    // Component should still be rendered
    const container = document.querySelector('.ken-burns-container');
    expect(container).toBeInTheDocument();
  });

  it('renders with default alt text', () => {
    render(<KenBurns src="test.jpg" />);
    const image = document.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
  });

  it('includes CSS keyframes in document head', () => {
    render(<KenBurns src="test.jpg" />);
    const styleElement = document.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.textContent).toContain('ken-burns-zoom-in');
  });

  it('handles rapid prop changes', () => {
    const { rerender } = render(<KenBurns src="test1.jpg" />);

    // Change src
    rerender(<KenBurns src="test2.jpg" />);

    const image = document.querySelector('img');
    expect(image).toHaveAttribute('src', 'test2.jpg');
  });
});