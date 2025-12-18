/**
 * VideoHero Component Tests
 * Comprehensive test coverage for video hero background component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { VideoHero } from './VideoHero';

const mockVideoProps = {
  videoSrc: 'hero-video.mp4',
  posterSrc: 'hero-poster.jpg',
  title: 'Welcome to Our Platform',
  subtitle: 'Discover amazing features',
};

describe('VideoHero', () => {
  beforeEach(() => {
    // No mock function to clear since we don't have onCtaClick anymore
  });

  it('renders video element with correct attributes', () => {
    render(<VideoHero {...mockVideoProps} />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', 'hero-video.mp4');
    expect(video).toHaveAttribute('poster', 'hero-poster.jpg');
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsInline');
  });

  it('renders title and subtitle', () => {
    render(<VideoHero {...mockVideoProps} />);
    expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
    expect(screen.getByText('Discover amazing features')).toBeInTheDocument();
  });

  it('renders children when provided', () => {
    render(
      <VideoHero {...mockVideoProps}>
        <button>Get Started</button>
      </VideoHero>
    );
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('applies default styling classes', () => {
    render(<VideoHero {...mockVideoProps} />);
    const container = document.querySelector('section');
    expect(container).toHaveClass('relative', 'overflow-hidden');
    expect(container).toHaveStyle('height: 100vh');
  });

  it('renders video with autoplay when specified', () => {
    render(<VideoHero {...mockVideoProps} autoPlay={true} />);
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('autoPlay');
  });

  it('does not autoplay video when disabled', () => {
    render(<VideoHero {...mockVideoProps} autoPlay={false} />);
    const video = document.querySelector('video');
    expect(video).not.toHaveAttribute('autoPlay');
  });

  it('applies custom className', () => {
    render(<VideoHero {...mockVideoProps} className="custom-hero" />);
    const container = document.querySelector('.custom-hero');
    expect(container).toBeInTheDocument();
  });

  it('renders overlay with default opacity', () => {
    render(<VideoHero {...mockVideoProps} />);
    const overlay = document.querySelector('.absolute.inset-0.bg-black');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveStyle('opacity: 0.5');
  });

  it('renders overlay with custom opacity', () => {
    render(<VideoHero {...mockVideoProps} overlayOpacity={0.7} />);
    const overlay = document.querySelector('.absolute.inset-0.bg-black');
    expect(overlay).toHaveStyle('opacity: 0.7');
  });

  it('renders content container with correct positioning', () => {
    render(<VideoHero {...mockVideoProps} />);
    const contentContainer = document.querySelector('.relative.z-10');
    expect(contentContainer).toHaveClass('flex', 'items-center', 'justify-center', 'h-full');
  });

  it('renders text content with correct styling', () => {
    render(<VideoHero {...mockVideoProps} />);
    const title = screen.getByText('Welcome to Our Platform');
    const subtitle = screen.getByText('Discover amazing features');

    expect(title).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl', 'font-bold', 'mb-4', 'leading-tight');
    expect(subtitle).toHaveClass('text-lg', 'md:text-xl', 'lg:text-2xl', 'mb-8', 'text-white/90', 'leading-relaxed');
  });

  it('renders controls when enabled', () => {
    render(<VideoHero {...mockVideoProps} controls={true} />);
    const playButton = screen.getByLabelText('Pause video');
    const muteButton = screen.getByLabelText('Unmute video');
    expect(playButton).toBeInTheDocument();
    expect(muteButton).toBeInTheDocument();
  });

  it('does not render controls by default', () => {
    render(<VideoHero {...mockVideoProps} />);
    const playButton = screen.queryByLabelText('Pause video');
    const muteButton = screen.queryByLabelText('Mute video');
    expect(playButton).not.toBeInTheDocument();
    expect(muteButton).not.toBeInTheDocument();
  });

  it('handles video load event', async () => {
    render(<VideoHero {...mockVideoProps} />);
    const video = document.querySelector('video');

    fireEvent.load(video!);

    // Video should be visible after loading
    await waitFor(() => {
      expect(video).toBeVisible();
    });
  });

  it('renders without poster when not provided', () => {
    const propsWithoutPoster = { ...mockVideoProps };
    delete propsWithoutPoster.posterSrc;

    render(<VideoHero {...propsWithoutPoster} />);
    const video = document.querySelector('video');
    expect(video).not.toHaveAttribute('poster');
  });

  it('renders with custom height', () => {
    render(<VideoHero {...mockVideoProps} height="50vh" />);
    const container = document.querySelector('section');
    expect(container).toHaveStyle('height: 50vh');
  });

  it('renders with custom subtitle styling via children', () => {
    render(
      <VideoHero {...mockVideoProps}>
        <p className="custom-subtitle">Custom styled subtitle</p>
      </VideoHero>
    );
    const customSubtitle = screen.getByText('Custom styled subtitle');
    expect(customSubtitle).toHaveClass('custom-subtitle');
  });

  it('renders with custom CTA button styling via children', () => {
    render(
      <VideoHero {...mockVideoProps}>
        <button className="custom-cta">Get Started</button>
      </VideoHero>
    );
    const ctaButton = screen.getByRole('button', { name: 'Get Started' });
    expect(ctaButton).toHaveClass('custom-cta');
  });

  it('renders without CTA button when no children provided', () => {
    render(<VideoHero {...mockVideoProps} />);
    // Since there's no children, no button should be rendered
    const buttons = screen.queryAllByRole('button');
    // Only control buttons if controls are enabled, otherwise no buttons
    expect(buttons.length).toBe(0);
  });

  it('renders without subtitle when not provided', () => {
    const propsWithoutSubtitle = { ...mockVideoProps };
    delete propsWithoutSubtitle.subtitle;

    render(<VideoHero {...propsWithoutSubtitle} />);
    expect(screen.queryByText('Discover amazing features')).not.toBeInTheDocument();
  });

  it('handles video error gracefully', () => {
    render(<VideoHero {...mockVideoProps} />);
    const video = document.querySelector('video');

    // Mock console.error to avoid test output pollution
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    fireEvent.error(video!);

    // Component should still render despite video error
    expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });

  it('applies responsive design classes', () => {
    render(<VideoHero {...mockVideoProps} />);
    const title = screen.getByText('Welcome to Our Platform');
    const subtitle = screen.getByText('Discover amazing features');

    // Check for responsive text sizing
    expect(title).toHaveClass('text-4xl', 'md:text-6xl', 'lg:text-7xl');
    expect(subtitle).toHaveClass('text-lg', 'md:text-xl', 'lg:text-2xl');
  });

  it('renders video with object-cover styling', () => {
    render(<VideoHero {...mockVideoProps} />);
    const video = document.querySelector('video');
    expect(video).toHaveClass('w-full', 'h-full', 'object-cover');
  });
});