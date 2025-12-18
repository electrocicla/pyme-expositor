/**
 * MasonryGallery - Masonry layout gallery component
 * Single Responsibility: Display images in a responsive masonry grid layout
 */

import { useState, useEffect, useRef } from 'react';

interface GalleryItem {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  width?: number;
  height?: number;
}

interface MasonryGalleryProps {
  items: GalleryItem[];
  columns?: number;
  gap?: number;
  className?: string;
  onItemClick?: (item: GalleryItem) => void;
  lazyLoad?: boolean;
}

export function MasonryGallery({
  items,
  columns = 3,
  gap = 16,
  className = '',
  onItemClick,
  lazyLoad = true,
}: MasonryGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [columnHeights, setColumnHeights] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize column heights
  useEffect(() => {
    setColumnHeights(new Array(columns).fill(0));
  }, [columns]);

  // Calculate responsive columns based on screen size
  const getResponsiveColumns = () => {
    if (typeof window === 'undefined') return columns;

    const width = window.innerWidth;
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // tablet
    if (width < 1024) return Math.min(columns, 3); // small desktop
    return columns; // large desktop
  };

  const responsiveColumns = getResponsiveColumns();

  // Update columns when responsive columns change
  useEffect(() => {
    setColumnHeights(new Array(responsiveColumns).fill(0));
  }, [responsiveColumns]);

  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => new Set(prev).add(itemId));
  };

  const getItemStyle = (item: GalleryItem) => {
    if (!loadedImages.has(item.id)) {
      return {
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      };
    }

    // Calculate which column this item goes in (shortest column)
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

    // Calculate position
    const columnWidth = `calc(${100 / responsiveColumns}% - ${(gap * (responsiveColumns - 1)) / responsiveColumns}px)`;
    const left = `calc(${shortestColumnIndex * (100 / responsiveColumns)}% + ${shortestColumnIndex * gap}px)`;

    // Update column height (approximate based on aspect ratio)
    const aspectRatio = item.width && item.height ? item.height / item.width : 1;
    const estimatedHeight = 300 * aspectRatio; // assuming base width of 300px

    setColumnHeights(prev => {
      const newHeights = [...prev];
      newHeights[shortestColumnIndex] += estimatedHeight + gap;
      return newHeights;
    });

    return {
      position: 'absolute' as const,
      left,
      top: `${columnHeights[shortestColumnIndex]}px`,
      width: columnWidth,
      opacity: 1,
      transform: 'translateY(0)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
    };
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      style={{
        height: Math.max(...columnHeights) + 100, // Add some buffer
        minHeight: '400px',
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className="group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          style={getItemStyle(item)}
          onClick={() => onItemClick?.(item)}
        >
          <div className="relative overflow-hidden">
            <img
              src={item.src}
              alt={item.alt || item.title || `Gallery item ${index + 1}`}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
              loading={lazyLoad ? 'lazy' : 'eager'}
              onLoad={() => handleImageLoad(item.id)}
            />

            {/* Overlay with title/description */}
            {(item.title || item.description) && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white">
                  {item.title && (
                    <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-sm text-white/90">{item.description}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MasonryGallery;