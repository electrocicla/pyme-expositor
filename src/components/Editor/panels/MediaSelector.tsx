import { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { AlertTriangle, Video, FolderOpen } from 'lucide-react';

interface Media {
  id: number;
  title: string;
  description: string;
  url: string;
  type: 'image' | 'video';  // This matches the API response
  order_index?: number;
}

interface MediaSelectorProps {
  value: string;
  onChange: (url: string, type: 'image' | 'video') => void;
  allowedTypes?: ('image' | 'video')[];
}

export function MediaSelector({ value, onChange, allowedTypes = ['image', 'video'] }: MediaSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen]);

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
      
      // Ensure all items have required properties with safe defaults
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
      console.error('Failed to fetch media:', err);
      setError('Failed to load media. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter media based on type - safely handle missing type
  const filteredMedia = media.filter((item) => {
    // First filter by allowed types
    if (!allowedTypes.includes(item.type)) return false;
    
    // Then filter by selected filter
    if (filter === 'all') return true;
    if (filter === 'images') return item.type === 'image';
    if (filter === 'videos') return item.type === 'video';
    return true;
  });

  const handleSelect = (item: Media) => {
    onChange(item.url, item.type);
    setIsOpen(false);
  };

  // Find the selected media item
  const selectedMedia = media.find((m) => m.url === value);

  // Determine if we have a selected item even if not in the fetched list
  const hasSelection = !!value;

  return (
    <div className="relative">
      {/* Selected Preview / Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full p-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3"
      >
        {hasSelection ? (
          <>
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 shrink-0">
              {selectedMedia?.type === 'video' || value.includes('.mp4') || value.includes('.webm') ? (
                <video src={value} className="w-full h-full object-cover" muted />
              ) : (
                <img src={value} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm text-white truncate">
                {selectedMedia?.title || 'Selected media'}
              </div>
              <div className="text-xs text-white/50">Click to change</div>
            </div>
          </>
        ) : (
          <div className="flex-1 text-center py-2">
            <div className="text-white/60 text-sm">Select Media</div>
            <div className="text-white/40 text-xs">Click to browse uploaded files</div>
          </div>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden border border-white/10">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Select Media</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="p-3 border-b border-white/10 flex gap-2">
              {(['all', 'images', 'videos'] as const).map((f) => {
                // Hide filter options that aren't in allowedTypes
                if (f === 'images' && !allowedTypes.includes('image')) return null;
                if (f === 'videos' && !allowedTypes.includes('video')) return null;
                
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      filter === f
                        ? 'bg-blue-500/30 text-blue-300'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                );
              })}
            </div>

            {/* Media Grid */}
            <div className="p-4 overflow-y-auto max-h-[50vh]">
              {error ? (
                <div className="text-center py-12 text-red-400">
                  <div className="flex justify-center mb-2"><AlertTriangle className="w-10 h-10" /></div>
                  <div>{error}</div>
                  <button 
                    onClick={fetchMedia}
                    className="mt-3 px-4 py-2 bg-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/40 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="text-center py-12 text-white/50">
                  <div className="flex justify-center mb-2"><FolderOpen className="w-10 h-10" /></div>
                  <div>No media found</div>
                  <div className="text-xs mt-1">Upload media from the Dashboard first</div>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all group ${
                        value === item.url
                          ? 'border-blue-500 ring-2 ring-blue-500/30'
                          : 'border-transparent hover:border-white/30'
                      }`}
                    >
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/60 rounded">
                          Select
                        </span>
                      </div>
                      {item.type === 'video' && (
                        <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5 text-xs text-white flex items-center gap-1">
                          <Video className="w-3 h-3" /> Video
                        </div>
                      )}
                      {value === item.url && (
                        <div className="absolute top-2 left-2 bg-blue-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between items-center">
              <div className="text-xs text-white/40">
                {filteredMedia.length} {filter === 'all' ? 'files' : filter}
              </div>
              <div className="flex gap-2">
                {value && (
                  <button
                    onClick={() => {
                      onChange('', 'image');
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Remove Selection
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaSelector;
