/**
 * Cursor Effects Component
 * Following SRP: Only handles cursor effect rendering
 * Following OCP: Easy to add new cursor types
 */

import React from 'react';
import type { CursorEffectsConfig } from './useEffectsConfig';

// Import cursor components directly instead of lazy loading
// This ensures they work correctly in production builds
import SplashCursor from '../ReactBits/SplashCursor';
import SpotlightCursor from '../ReactBits/SpotlightCursor';
import RippleCursor from '../ReactBits/RippleCursor';
import TrailCursor from '../ReactBits/TrailCursor';
import NeonCursor from '../ReactBits/NeonCursor';
import GlitterCursor from '../ReactBits/GlitterCursor';
import ClickSpark from '../ReactBits/ClickSpark';

interface CursorEffectsProps {
  config: CursorEffectsConfig;
}

const CursorEffects: React.FC<CursorEffectsProps> = ({ config }) => {
  if (!config.enabled) {
    return null;
  }

  return (
    <>
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
    </>
  );
};

export default CursorEffects;
