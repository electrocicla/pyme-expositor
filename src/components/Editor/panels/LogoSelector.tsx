/**
 * LogoSelector - Enhanced single media selector for logos
 * Uses a large modal similar to HeroMediaGallery
 * Designed specifically for selecting a single logo image
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Camera, 
  X, 
  Check, 
  Image as ImageIcon, 
  Video,
  Layers, 
  RefreshCw,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { api } from '../../../utils/api';

interface Media {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';
  order_index?: number;
}

interface LogoSelectorProps {
  value: string;
  onChange: (url: string) => void;
  allowedTypes?: ('image' | 'video')[];
}

// Modal component rendered via portal
function LogoSelectorModal({
  isOpen,
  onClose,
  value,
  onChange,
  allowedTypes,
}: {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (url: string) => void;
  allowedTypes: ('image' | 'video')[];
}) {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [error, setError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string>(value);

  // Sync selected when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(value);
      fetchMedia();
    }
  }, [isOpen, value]);

  const fetchMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getProtectedMedia();
      // Handle different response formats
      let mediaList: Media[] = [];
      if (Array.isArray(data)) {
        mediaList = data;
      } else if (data?.results && Array.isArray(data.results)) {
        mediaList = data.results;
      } else if (data?.data && Array.isArray(data.data)) {
        mediaList = data.data;
      }
      
      // Ensure all items have required properties
      mediaList = mediaList.map((item: any) => ({
        id: item.id ?? 0,
        title: item.title ?? 'Untitled',
        description: item.description ?? '',
        url: item.url ?? '',
        type: item.type ?? 'image',
        order_index: item.order_index ?? 0,
      }));
      
      setMedia(mediaList);
    } catch (err) {
      setError('Error loading media library');
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedia = media.filter((m) => {
    // Filter by allowed types
    if (!allowedTypes.includes(m.type)) return false;
    
    if (filter === 'all') return true;
    if (filter === 'images') return m.type === 'image';
    if (filter === 'videos') return m.type === 'video';
    return true;
  });

  const handleMediaClick = (mediaItem: Media) => {
    if (selectedUrl === mediaItem.url) {
      setSelectedUrl(''); // Deselect
    } else {
      setSelectedUrl(mediaItem.url);
    }
  };

  const handleDone = () => {
    onChange(selectedUrl);
    onClose();
  };

  const handleRemove = () => {
    setSelectedUrl('');
    onChange('');
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
              <h3 className="text-xl font-bold text-white">Select Logo</h3>
              <p className="text-sm text-white/50">
                Choose an image for your site logo
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
            {allowedTypes.includes('image') && (
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
            )}
            {allowedTypes.includes('video') && (
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
            )}
            
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
                const isSelected = selectedUrl === m.url;
                
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleMediaClick(m)}
                    className={`relative aspect-4/3 rounded-xl overflow-hidden text-left transition-all transform group ${
                      isSelected
                        ? 'ring-4 ring-blue-500 shadow-xl shadow-blue-500/30 scale-[1.02]'
                        : 'ring-2 ring-transparent hover:ring-white/40 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Media Preview */}
                    {m.type === 'video' ? (
                      <video
                        src={m.url}
                        className="w-full h-full object-cover bg-slate-800"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={m.url}
                        alt={m.title}
                        className="w-full h-full object-cover bg-slate-800"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Hover overlay */}
                    {!isSelected && (
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
                      isSelected 
                        ? 'bg-blue-500 scale-100 shadow-lg' 
                        : 'bg-black/50 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100'
                    }`}>
                      <Check className={`w-5 h-5 text-white ${isSelected ? '' : 'opacity-50'}`} strokeWidth={3} />
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
            {selectedUrl && (
              <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700">
                  <img src={selectedUrl} alt="Selected" className="w-full h-full object-cover" />
                </div>
                <span className="text-white/70 text-sm">Logo selected</span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {value && (
              <button
                onClick={handleRemove}
                className="px-5 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Logo
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
            >
              Cancel
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

export function LogoSelector({ value, onChange, allowedTypes = ['image'] }: LogoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      {/* Current Logo Preview */}
      {value ? (
        <div className="relative group">
          <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-white/20 bg-slate-800/50 flex items-center justify-center p-4">
            <img
              src={value}
              alt="Current logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {/* Overlay buttons */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Change Logo
            </button>
            <button
              onClick={() => onChange('')}
              className="px-4 py-2 bg-red-500/80 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full aspect-video border-2 border-dashed border-white/20 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group flex flex-col items-center justify-center gap-3"
        >
          <Camera className="w-10 h-10 text-white/40 group-hover:text-blue-400 transition-colors" />
          <div className="text-center">
            <div className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">
              Select Logo
            </div>
            <div className="text-xs text-white/40 mt-1">
              Click to browse your media library
            </div>
          </div>
        </button>
      )}

      {/* Logo Selector Modal */}
      <LogoSelectorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={onChange}
        allowedTypes={allowedTypes}
      />
    </div>
  );
}

export default LogoSelector;
