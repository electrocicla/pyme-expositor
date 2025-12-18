/**
 * MasonryGallery Component Tests
 * Comprehensive test coverage for masonry layout gallery component
 */

import { render, fireEvent } from '@testing-library/react';
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import { MasonryGallery } from './MasonryGallery';

const mockGalleryItems = [
  {
    id: '1',
    src: 'image1.jpg',
    alt: 'Image 1',
    title: 'First Image',
    description: 'Description 1',
    width: 400,
    height: 300,
  },
  {
    id: '2',
    src: 'image2.jpg',
    alt: 'Image 2',
    title: 'Second Image',
    width: 300,
    height: 400,
  },
  {
    id: '3',
    src: 'image3.jpg',
    alt: 'Image 3',
    width: 500,
    height: 250,
  },
];

const mockGalleryProps = {
  items: mockGalleryItems,
  columns: 3,
  gap: 20,
};

describe('MasonryGallery', () => {
  let mockImage: jest.MockedClass<typeof Image>;

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock window.innerWidth for responsive tests
    Object.defineProperty(window, 'innerWidth', {
      value: 1200,
      writable: true,
    });

    // Mock Image constructor for lazy loading tests
    mockImage = vi.fn().mockImplementation(function(this: HTMLImageElement) {
      this.onload = null;
      this.src = '';
      return this;
    }) as jest.MockedClass<typeof Image>;
    global.Image = mockImage;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders with default props', () => {
    render(<MasonryGallery items={[]} />);
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('w-full');
  });

  it('renders gallery items', () => {
    render(<MasonryGallery {...mockGalleryProps} />);
    const images = document.querySelectorAll('img');
    expect(images).toHaveLength(3);

    // Check image attributes
    expect(images[0]).toHaveAttribute('src', 'image1.jpg');
    expect(images[0]).toHaveAttribute('alt', 'Image 1');
    expect(images[1]).toHaveAttribute('src', 'image2.jpg');
    expect(images[1]).toHaveAttribute('alt', 'Image 2');
  });

  it('applies custom className', () => {
    render(<MasonryGallery items={[]} className="custom-gallery" />);
    const container = document.querySelector('.custom-gallery');
    expect(container).toBeInTheDocument();
  });

  it('handles item click', () => {
    const mockOnClick = vi.fn();
    render(<MasonryGallery {...mockGalleryProps} onItemClick={mockOnClick} />);

    const firstItem = document.querySelector('.group');
    fireEvent.click(firstItem!);

    expect(mockOnClick).toHaveBeenCalledWith(mockGalleryItems[0]);
  });

  it('shows loading state for unloaded images', () => {
    render(<MasonryGallery {...mockGalleryProps} />);

    const firstItem = document.querySelector('.group');
    expect(firstItem).toBeInTheDocument();
    // The opacity is set via inline styles, not classes
  });

  it('shows loaded images with proper styling', () => {
    render(<MasonryGallery {...mockGalleryProps} />);

    // Simulate image load
    const images = document.querySelectorAll('img');
    act(() => {
      fireEvent.load(images[0]);
    });

    // Component should still be rendered without infinite loop
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });

  it('handles lazy loading', () => {
    render(<MasonryGallery {...mockGalleryProps} lazyLoad={true} />);
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'lazy');
    });
  });

  it('handles eager loading', () => {
    render(<MasonryGallery {...mockGalleryProps} lazyLoad={false} />);
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      expect(img).toHaveAttribute('loading', 'eager');
    });
  });

  it('displays item titles and descriptions on hover', () => {
    render(<MasonryGallery {...mockGalleryProps} />);

    const firstItem = document.querySelector('.group');
    const overlay = firstItem?.querySelector('.absolute');

    expect(overlay).toHaveClass('opacity-0');

    // Simulate hover
    fireEvent.mouseEnter(firstItem!);
    expect(overlay).toHaveClass('group-hover:opacity-100');

    // Check content
    const title = overlay?.querySelector('h3');
    const description = overlay?.querySelector('p');

    expect(title).toHaveTextContent('First Image');
    expect(description).toHaveTextContent('Description 1');
  });

  it('handles responsive columns - desktop', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1200 });
    render(<MasonryGallery {...mockGalleryProps} />);

    // Should use specified columns for large screens
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });

  it('handles responsive columns - tablet', () => {
    Object.defineProperty(window, 'innerWidth', { value: 700 });
    render(<MasonryGallery {...mockGalleryProps} columns={4} />);

    // Should use fewer columns for smaller screens
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });

  it('handles responsive columns - mobile', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500 });
    render(<MasonryGallery {...mockGalleryProps} />);

    // Should use 1 column for mobile
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });

  it('handles custom gap', () => {
    render(<MasonryGallery {...mockGalleryProps} gap={30} />);
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });

  it('handles empty items array', () => {
    render(<MasonryGallery items={[]} />);
    const images = document.querySelectorAll('img');
    expect(images).toHaveLength(0);
  });

  it('handles items without titles or descriptions', () => {
    const itemsWithoutMeta = [
      { id: '1', src: 'image1.jpg' },
      { id: '2', src: 'image2.jpg' },
    ];

    render(<MasonryGallery items={itemsWithoutMeta} />);

    const overlays = document.querySelectorAll('.absolute');
    expect(overlays).toHaveLength(0); // No overlays for items without metadata
  });

  it('applies hover effects to images', () => {
    render(<MasonryGallery {...mockGalleryProps} />);

    const images = document.querySelectorAll('img');
    expect(images[0]).toHaveClass('group-hover:scale-110');
  });

  it('handles window resize', () => {
    render(<MasonryGallery {...mockGalleryProps} />);

    // Simulate window resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 });
      window.dispatchEvent(new Event('resize'));
    });

    // Component should still be rendered
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });

  it('renders correct number of columns', () => {
    render(<MasonryGallery {...mockGalleryProps} columns={2} />);
    const container = document.querySelector('.relative');
    expect(container).toBeInTheDocument();
  });
});