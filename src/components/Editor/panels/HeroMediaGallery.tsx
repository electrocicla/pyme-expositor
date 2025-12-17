/**
 * HeroMediaGallery - Multi-media selector for Hero section
 * Allows selecting multiple images/videos from the media library
 * Supports drag-and-drop reordering
 * Uses React Portal for proper full-screen modal rendering
 */

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  Camera, 
  X, 
  Check, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon, 
  Video, 
  Layers, 
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';
import { api, type ApiMedia } from '../../../utils/api';
import type { HeroMediaItem } from '../../../types/config';

interface HeroMediaGalleryProps {
  items: HeroMediaItem[];
  onChange: (items: HeroMediaItem[]) => void;
  maxItems?: number;
}

// Modal component rendered via portal
function MediaSelectorModal({
  isOpen,
  onClose,
  items,
  onChange,
  maxItems,
}: {
  isOpen: boolean;
  onClose: () => void;
  items: HeroMediaItem[];
  onChange: (items: HeroMediaItem[]) => void;
  maxItems: number;
}) {
  const [media, setMedia] = useState<ApiMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<HeroMediaItem[]>(items);

  // Sync selected items when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedItems(items);
      fetchMedia();
    }
  }, [isOpen, items]);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getMedia();
      console.warn('HeroMediaGallery: Fetched media:', data);
      setMedia(data || []);
    } catch (err) {
      setError('Error loading media library');
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = media.filter((m) => {
    if (filter === 'all') return true;
    if (filter === 'images') return m.type === 'image';
    if (filter === 'videos') return m.type === 'video';
    return true;
  });

  const isSelected = useCallback((url: string) => {
    return selectedItems.some(item => item.url === url);
  }, [selectedItems]);

  const handleMediaClick = useCallback((mediaItem: ApiMedia) => {
    console.warn('HeroMediaGallery: Click on media:', mediaItem.title);
    const alreadySelected = isSelected(mediaItem.url);
    
    if (alreadySelected) {
      // Remove from selection
      const newItems = selectedItems.filter(item => item.url !== mediaItem.url);
      console.warn('HeroMediaGallery: Removing item, new count:', newItems.length);
      setSelectedItems(newItems);
    } else {
      // Add to selection (if under limit)
      if (selectedItems.length < maxItems) {
        const newItem: HeroMediaItem = {
          id: `hero-media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: mediaItem.url,
          type: mediaItem.type,
          title: mediaItem.title,
          alt: mediaItem.description || mediaItem.title,
        };
        const newItems = [...selectedItems, newItem];
        console.warn('HeroMediaGallery: Adding item, new count:', newItems.length);
        setSelectedItems(newItems);
      } else {
        console.warn('HeroMediaGallery: Max items reached');
      }
    }
  }, [selectedItems, maxItems, isSelected]);

  const clearAll = () => {
    setSelectedItems([]);
  };

  const handleDone = () => {
    console.warn('HeroMediaGallery: Done clicked, saving', selectedItems.length, 'items');
    onChange(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 rounded-2xl w-[90vw] max-w-5xl h-[85vh] overflow-hidden border border-white/20 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-800/50 shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Camera className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Select Hero Media</h3>
              <p className="text-sm text-white/50">
                Choose images and videos for your hero section ({selectedItems.length}/{maxItems})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white/70" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-white/10 bg-slate-800/30 shrink-0">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setFilter('images')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === 'images'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Images
            </button>
            <button
              onClick={() => setFilter('videos')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === 'videos'
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              Videos
            </button>
            
            <button
              onClick={fetchMedia}
              className="ml-auto p-2.5 hover:bg-white/10 rounded-xl transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-white/50 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-white/50 text-lg">Loading media library...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-400 text-lg mb-3">{error}</p>
              <button
                onClick={fetchMedia}
                className="px-4 py-2 text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Camera className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-white/50 text-lg mb-2">No media found</p>
              <p className="text-sm text-white/30">
                Upload media in the Media section first
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredMedia.map((m) => {
                const selected = isSelected(m.url);
                const canSelect = selected || selectedItems.length < maxItems;
                
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      console.warn('HeroMediaGallery: Button clicked for', m.title);
                      if (canSelect) {
                        handleMediaClick(m);
                      }
                    }}
                    disabled={!canSelect}
                    className={`relative aspect-4/3 rounded-xl overflow-hidden text-left transition-all transform group ${
                      selected
                        ? 'ring-4 ring-blue-500 shadow-xl shadow-blue-500/30 scale-[1.02]'
                        : canSelect
                        ? 'ring-2 ring-transparent hover:ring-white/40 hover:scale-[1.02]'
                        : 'opacity-40 cursor-not-allowed'
                    }`}
                  >
                    {/* Media Preview */}
                    {m.type === 'video' ? (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover bg-slate-800"
                        muted
                        playsInline
                        poster=""
                        onError={(e) => {
                          console.error('Video load error:', m.url);
                          // Hide broken video, show fallback
                          (e.target as HTMLVideoElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <img
                        src={m.url}
                        alt={m.title}
                        className="w-full h-full object-cover bg-slate-800"
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image load error:', m.url);
                          // Set fallback image or hide
                          (e.target as HTMLImageElement).style.opacity = '0.3';
                          (e.target as HTMLImageElement).alt = 'Failed to load';
                        }}
                      />
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Hover overlay */}
                    {canSelect && !selected && (
                      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform scale-90 group-hover:scale-100">
                          <div className="px-4 py-2 bg-blue-500 rounded-full text-white text-sm font-semibold shadow-lg">
                            Click to Select
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Type indicator */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
                      {m.type === 'video' ? (
                        <Video className="w-4 h-4 text-white" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-white" />
                      )}
                      <span className="text-xs text-white font-medium capitalize">{m.type}</span>
                    </div>
                    
                    {/* Title */}
                    {m.title && (
                      <div className="absolute bottom-3 right-3 max-w-[50%]">
                        <span className="text-xs text-white/90 truncate block text-right font-medium">
                          {m.title}
                        </span>
                      </div>
                    )}
                    
                    {/* Selection indicator */}
                    <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      selected 
                        ? 'bg-blue-500 scale-100 shadow-lg' 
                        : 'bg-black/50 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      {selected ? (
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      ) : (
                        <Plus className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-slate-800/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
              <Check className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">{selectedItems.length}</span>
              <span className="text-white/50">of {maxItems} selected</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={clearAll}
              className="px-5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
              disabled={selectedItems.length === 0}
            >
              Clear All
            </button>
            <button
              onClick={handleDone}
              className="px-8 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Check className="w-5 h-5" />
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render outside the sidebar
  return createPortal(modalContent, document.body);
}

export function HeroMediaGallery({ items, onChange, maxItems = 10 }: HeroMediaGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const clearAll = () => {
    onChange([]);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [removed] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, removed);
    onChange(newItems);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null || draggedIndex === index) return;
    moveItem(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-3">
      {/* Selected Items Preview */}
      {items.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              {items.length} media selected
            </span>
            <button
              onClick={clearAll}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-grab group transition-all ${
                  draggedIndex === index 
                    ? 'border-blue-500 opacity-50 scale-95' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    onError={(e) => {
                      console.error('Video preview load error:', item.url);
                      (e.target as HTMLVideoElement).style.opacity = '0.3';
                    }}
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt || item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image preview load error:', item.url);
                      (e.target as HTMLImageElement).style.opacity = '0.3';
                    }}
                  />
                )}
                
                {/* Drag handle */}
                <div className="absolute top-1 left-1 p-1 bg-black/60 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-3 h-3 text-white" />
                </div>
                
                {/* Order badge */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow">
                  {index + 1}
                </div>
                
                {/* Type indicator */}
                <div className="absolute bottom-1 left-1 p-1 bg-black/60 rounded">
                  {item.type === 'video' ? (
                    <Video className="w-3 h-3 text-white" />
                  ) : (
                    <ImageIcon className="w-3 h-3 text-white" />
                  )}
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(item.id);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-white/40 flex items-center gap-1">
            <GripVertical className="w-3 h-3" />
            Drag to reorder
          </p>
        </div>
      )}

      {/* Add Media Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
      >
        <div className="text-center">
          <div className="flex justify-center mb-2">
            {items.length === 0 ? (
              <Camera className="w-8 h-8 text-white/50 group-hover:text-blue-400 transition-colors" />
            ) : (
              <Plus className="w-8 h-8 text-white/50 group-hover:text-blue-400 transition-colors" />
            )}
          </div>
          <div className="text-sm text-white/70 group-hover:text-white transition-colors">
            {items.length === 0 ? 'Select Media' : 'Add More Media'}
          </div>
          <div className="text-xs text-white/40 mt-1">
            {items.length}/{maxItems} selected
          </div>
        </div>
      </button>

      {/* Media Library Modal (rendered via Portal) */}
      <MediaSelectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onChange={onChange}
        maxItems={maxItems}
      />
    </div>
  );
}

export default HeroMediaGallery;
