import { useEffect, useRef } from 'react';

interface Blob {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface MeshGradientProps {
  colors?: string[];
  speed?: 'slow' | 'normal' | 'fast';
  blobCount?: number;
  blur?: number;
  opacity?: number;
}

const MeshGradient: React.FC<MeshGradientProps> = ({
  colors = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4'],
  speed = 'normal',
  blobCount = 4,
  blur = 100,
  opacity = 0.4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const speedMultiplier = speed === 'slow' ? 0.3 : speed === 'fast' ? 1.2 : 0.6;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBlobs();
    };

    const initBlobs = () => {
      blobsRef.current = [];
      const minDimension = Math.min(canvas.width, canvas.height);
      
      for (let i = 0; i < blobCount; i++) {
        blobsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speedMultiplier * 2,
          vy: (Math.random() - 0.5) * speedMultiplier * 2,
          radius: minDimension * (0.2 + Math.random() * 0.3),
          color: colors[i % colors.length],
        });
      }
    };

    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw blobs
      blobsRef.current.forEach((blob) => {
        // Update position with smooth movement
        blob.x += blob.vx;
        blob.y += blob.vy;

        // Soft bounce at edges with some randomness
        if (blob.x < -blob.radius * 0.5) {
          blob.vx = Math.abs(blob.vx) * (0.8 + Math.random() * 0.4);
        } else if (blob.x > canvas.width + blob.radius * 0.5) {
          blob.vx = -Math.abs(blob.vx) * (0.8 + Math.random() * 0.4);
        }
        
        if (blob.y < -blob.radius * 0.5) {
          blob.vy = Math.abs(blob.vy) * (0.8 + Math.random() * 0.4);
        } else if (blob.y > canvas.height + blob.radius * 0.5) {
          blob.vy = -Math.abs(blob.vy) * (0.8 + Math.random() * 0.4);
        }

        // Draw blob with radial gradient
        const rgb = hexToRgb(blob.color);
        if (rgb) {
          const gradient = ctx.createRadialGradient(
            blob.x, blob.y, 0,
            blob.x, blob.y, blob.radius
          );
          gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity * 0.5})`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [colors, speed, blobCount, blur, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        filter: `blur(${blur}px)`,
      }}
    />
  );
};

export default MeshGradient;
