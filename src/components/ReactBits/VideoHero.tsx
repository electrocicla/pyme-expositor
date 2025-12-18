/**
 * VideoHero - Video background hero component
 * Single Responsibility: Display video background with overlay content and controls
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoHeroProps {
  videoSrc: string;
  posterSrc?: string; // fallback image
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  height?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
}

export function VideoHero({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  children,
  height = '100vh',
  overlay = true,
  overlayOpacity = 0.5,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = false,
  className = '',
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoading(false);
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVideoClick = () => {
    if (controls) {
      togglePlay();
    }
  };

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        {hasError ? (
          // Fallback to poster image or gradient
          <div
            className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
            style={{
              backgroundImage: posterSrc ? `url(${posterSrc})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            playsInline
            onClick={handleVideoClick}
            style={{ cursor: controls ? 'pointer' : 'default' }}
          />
        )}

        {/* Loading overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          {title && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
              {subtitle}
          </p>
          )}
          {children}
        </div>
      </div>

      {/* Controls */}
      {controls && !hasError && (
        <div className="absolute bottom-6 right-6 z-20 flex gap-3">
          <button
            onClick={togglePlay}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={toggleMute}
            className="p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-sm"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <div className="absolute bottom-4 left-4 z-20 bg-red-500/90 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          Video failed to load
        </div>
      )}
    </section>
  );
}

export default VideoHero;