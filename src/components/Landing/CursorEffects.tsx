/**
 * Cursor Effects Component
 * Following SRP: Only handles cursor effect rendering
 * Following OCP: Easy to add new cursor types
 */

import React from 'react';
import type { CursorEffectsConfig } from './useEffectsConfig';

// Lazy load cursor components
const SplashCursor = React.lazy(() => import('../ReactBits/SplashCursor'));
const SpotlightCursor = React.lazy(() => import('../ReactBits/SpotlightCursor'));
const RippleCursor = React.lazy(() => import('../ReactBits/RippleCursor'));
const TrailCursor = React.lazy(() => import('../ReactBits/TrailCursor'));
const NeonCursor = React.lazy(() => import('../ReactBits/NeonCursor'));
const GlitterCursor = React.lazy(() => import('../ReactBits/GlitterCursor'));
const ClickSpark = React.lazy(() => import('../ReactBits/ClickSpark'));

interface CursorEffectsProps {
  config: CursorEffectsConfig;
}

const CursorEffects: React.FC<CursorEffectsProps> = ({ config }) => {
  // Debug logging
  console.log('CursorEffects render: config =', config);
  console.log('CursorEffects render: enabled =', config.enabled, 'type =', config.type);

  if (!config.enabled) {
    console.log('CursorEffects: Returning null because enabled is false');
    return null;
  }

  console.log('CursorEffects: Rendering cursor type:', config.type);

  return (
    <React.Suspense fallback={null}>
      {config.type === 'splash' && <SplashCursor />}
      {config.type === 'spotlight' && (
        <SpotlightCursor color={config.color} size={400} opacity={0.15} />
      )}
      {config.type === 'ripple' && (
        <RippleCursor color={config.color} maxSize={80} rippleDuration={800} />
      )}
      {config.type === 'trail' && (
        <TrailCursor color={config.color} trailLength={25} size={10} />
      )}
      {config.type === 'neon' && (
        <NeonCursor color={config.color} size={10} glowSize={25} trailLength={12} />
      )}
      {config.type === 'glitter' && (
        <GlitterCursor 
          colors={[config.color, '#ffd700', '#ff69b4', '#00ffff']} 
          particleCount={4} 
          particleSize={8}
        />
      )}
      {config.type === 'click-spark' && (
        <ClickSpark 
          sparkColor={config.color}
          sparkCount={12}
          sparkRadius={20}
          sparkSize={12}
          duration={500}
        />
      )}
    </React.Suspense>
  );
};

export default CursorEffects;
