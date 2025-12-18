/**
 * Lightbox - Modal component for viewing media
 * Single Responsibility: Display images/videos in a modal overlay with navigation
 */

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MediaItem {
  id: string;
  src: string;
  alt?: string;
  type?: 'image' | 'video';
  title?: string;
  description?: string;
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  media: MediaItem[];
  initialIndex?: number;
  className?: string;
}

export function Lightbox({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
  className = '',
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentItem = media[currentIndex];

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setRotation(0);
      setIsTransitioning(false);
    }
  }, [isOpen, initialIndex]);

  const goToPrevious = useCallback(() => {
    if (media.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev === 0 ? media.length - 1 : prev - 1));
      setZoom(1);
      setRotation(0);
      setIsTransitioning(false);
    }, 150);
  }, [media.length]);

  const goToNext = useCallback(() => {
    if (media.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev => (prev === media.length - 1 ? 0 : prev + 1));
      setZoom(1);
      setRotation(0);
      setIsTransitioning(false);
    }, 150);
  }, [media.length]);

  const handleZoom = useCallback((delta: number) => {
    setZoom(prev => Math.max(0.25, Math.min(3, prev + delta)));
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case '+':
        case '=':
          handleZoom(0.25);
          break;
        case '-':
          handleZoom(-0.25);
          break;
        case 'r':
        case 'R':
          setRotation(prev => prev + 90);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, media.length, goToNext, goToPrevious, onClose, handleZoom]);

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
  };

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm ${className}`}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>

      {/* Navigation buttons */}
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleZoom(0.25); }}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleZoom(-0.25); }}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut size={20} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); resetTransform(); }}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          aria-label="Reset zoom and rotation"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Media content */}
      <div
        className={`relative max-w-[90vw] max-h-[90vh] transition-transform duration-300 ${
          isTransitioning ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.type === 'video' ? (
          <video
            src={currentItem.src}
            controls
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
          />
        ) : (
          <img
            src={currentItem.src}
            alt={currentItem.alt || currentItem.title || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease',
            }}
            draggable={false}
          />
        )}

        {/* Caption */}
        {(currentItem.title || currentItem.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 rounded-b-lg">
            {currentItem.title && (
              <h3 className="text-lg font-semibold mb-1">{currentItem.title}</h3>
            )}
            {currentItem.description && (
              <p className="text-sm text-white/80">{currentItem.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Image counter */}
      {media.length > 1 && (
        <div className="absolute bottom-4 right-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {media.length}
        </div>
      )}
    </div>
  );
}

export default Lightbox;