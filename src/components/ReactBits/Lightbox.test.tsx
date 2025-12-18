/**
 * Lightbox Component Tests
 * Comprehensive test coverage for lightbox modal functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Lightbox } from './Lightbox';

const mockMedia = [
  {
    id: '1',
    src: 'image1.jpg',
    alt: 'Test Image 1',
    type: 'image' as const,
    title: 'Image 1',
    description: 'Description 1'
  },
  {
    id: '2',
    src: 'image2.jpg',
    alt: 'Test Image 2',
    type: 'image' as const,
    title: 'Image 2',
    description: 'Description 2'
  },
  {
    id: '3',
    src: 'video1.mp4',
    alt: 'Test Video 1',
    type: 'video' as const,
    title: 'Video 1',
    description: 'Video Description 1'
  }
];

describe('Lightbox', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Lightbox
        isOpen={false}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders image when isOpen is true', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const image = screen.getByAltText('Test Image 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'image1.jpg');
  });

  it('renders video when current item is video', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={2}
      />
    );
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'video1.mp4');
  });

  it('shows close button', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const closeButton = screen.getByLabelText('Close lightbox');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const closeButton = screen.getByLabelText('Close lightbox');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const overlay = screen.getByRole('img').parentElement?.parentElement;
    fireEvent.click(overlay!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when media content is clicked', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const image = screen.getByAltText('Test Image 1');
    fireEvent.click(image);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows navigation buttons when multiple media items exist', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const prevButton = screen.getByLabelText('Previous image');
    const nextButton = screen.getByLabelText('Next image');
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it('does not show navigation buttons for single media item', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={[mockMedia[0]]}
      />
    );
    const prevButton = screen.queryByLabelText('Previous image');
    const nextButton = screen.queryByLabelText('Next image');
    expect(prevButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });

  it('navigates to next image', async () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    await waitFor(() => {
      const image = screen.getByAltText('Test Image 2');
      expect(image).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('navigates to previous image', async () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={1}
      />
    );

    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    await waitFor(() => {
      const image = screen.getByAltText('Test Image 1');
      expect(image).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('wraps to last image when going previous from first', async () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={0}
      />
    );

    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    await waitFor(() => {
      const video = document.querySelector('video');
      expect(video).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('wraps to first image when going next from last', async () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={2}
      />
    );

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    await waitFor(() => {
      const image = screen.getByAltText('Test Image 1');
      expect(image).toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('shows zoom controls', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const zoomInButton = screen.getByLabelText('Zoom in');
    const zoomOutButton = screen.getByLabelText('Zoom out');
    const resetButton = screen.getByLabelText('Reset zoom and rotation');
    expect(zoomInButton).toBeInTheDocument();
    expect(zoomOutButton).toBeInTheDocument();
    expect(resetButton).toBeInTheDocument();
  });

  it('zooms in when zoom in button is clicked', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const zoomInButton = screen.getByLabelText('Zoom in');
    const image = screen.getByAltText('Test Image 1');

    fireEvent.click(zoomInButton);
    expect(image).toHaveStyle('transform: scale(1.25) rotate(0deg)');
  });

  it('zooms out when zoom out button is clicked', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const zoomOutButton = screen.getByLabelText('Zoom out');
    const image = screen.getByAltText('Test Image 1');

    fireEvent.click(zoomOutButton);
    expect(image).toHaveStyle('transform: scale(0.75) rotate(0deg)');
  });

  it('resets zoom and rotation when reset button is clicked', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const zoomInButton = screen.getByLabelText('Zoom in');
    const resetButton = screen.getByLabelText('Reset zoom and rotation');
    const image = screen.getByAltText('Test Image 1');

    fireEvent.click(zoomInButton);
    expect(image).toHaveStyle('transform: scale(1.25) rotate(0deg)');

    fireEvent.click(resetButton);
    expect(image).toHaveStyle('transform: scale(1) rotate(0deg)');
  });

  it('handles keyboard navigation - Escape closes', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation - Arrow keys navigate', async () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    await waitFor(() => {
      const image = screen.getByAltText('Test Image 2');
      expect(image).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    await waitFor(() => {
      const image = screen.getByAltText('Test Image 1');
      expect(image).toBeInTheDocument();
    });
  });

  it('handles keyboard zoom controls', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const image = screen.getByAltText('Test Image 1');

    fireEvent.keyDown(document, { key: '+' });
    expect(image).toHaveStyle('transform: scale(1.25) rotate(0deg)');

    fireEvent.keyDown(document, { key: '-' });
    expect(image).toHaveStyle('transform: scale(1) rotate(0deg)');
  });

  it('handles keyboard rotation', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const image = screen.getByAltText('Test Image 1');

    fireEvent.keyDown(document, { key: 'r' });
    expect(image).toHaveStyle('transform: scale(1) rotate(90deg)');
  });

  it('shows caption when title or description exists', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const title = screen.getByText('Image 1');
    const description = screen.getByText('Description 1');
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  it('shows image counter for multiple items', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
      />
    );
    const counter = screen.getByText('1 / 3');
    expect(counter).toBeInTheDocument();
  });

  it('does not show image counter for single item', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={[mockMedia[0]]}
      />
    );
    const counter = screen.queryByText('1 / 1');
    expect(counter).not.toBeInTheDocument();
  });

  it('resets state when reopening with different initialIndex', () => {
    const { rerender } = render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={0}
      />
    );

    // Zoom in
    const zoomInButton = screen.getByLabelText('Zoom in');
    fireEvent.click(zoomInButton);

    // Close and reopen with different index
    rerender(
      <Lightbox
        isOpen={false}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={0}
      />
    );

    rerender(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        initialIndex={1}
      />
    );

    const image = screen.getByAltText('Test Image 2');
    expect(image).toHaveStyle('transform: scale(1) rotate(0deg)');
  });

  it('applies custom className', () => {
    render(
      <Lightbox
        isOpen={true}
        onClose={mockOnClose}
        media={mockMedia}
        className="custom-lightbox"
      />
    );
    const overlay = screen.getByRole('img').parentElement?.parentElement;
    expect(overlay).toHaveClass('custom-lightbox');
  });
});