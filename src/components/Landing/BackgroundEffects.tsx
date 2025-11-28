/**
 * Background Effects Component
 * Following SRP: Only handles background effect rendering
 * Following OCP: Easy to add new background effects
 */

import React from 'react';
import type { BackgroundEffectsConfig, ParticlesConfig } from './useEffectsConfig';

// Lazy load background components
const WavesBackground = React.lazy(() => import('../ReactBits/WavesBackground'));
const FloatingParticles = React.lazy(() => import('../ReactBits/FloatingParticles'));
const AnimatedGrid = React.lazy(() => import('../ReactBits/AnimatedGrid'));
const MeshGradient = React.lazy(() => import('../ReactBits/MeshGradient'));
const AuroraBackground = React.lazy(() => import('../ReactBits/AuroraBackground'));

interface BackgroundEffectsProps {
  backgroundConfig: BackgroundEffectsConfig;
  particlesConfig: ParticlesConfig;
  primaryColor: string;
  secondaryColor: string;
  className?: string;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({
  backgroundConfig,
  particlesConfig,
  primaryColor,
  secondaryColor,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <React.Suspense fallback={null}>
        {/* Background Animation */}
        {backgroundConfig.enabled && (
          <>
            {backgroundConfig.type === 'aurora' && (
              <AuroraBackground 
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                speed={backgroundConfig.speed}
                intensity={0.6}
              />
            )}
            {backgroundConfig.type === 'waves' && (
              <WavesBackground 
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                speed={backgroundConfig.speed}
                opacity={0.4}
              />
            )}
            {backgroundConfig.type === 'particles' && (
              <FloatingParticles 
                count={60}
                color={primaryColor}
                secondaryColor={secondaryColor}
                speed={backgroundConfig.speed}
                showConnections={true}
              />
            )}
            {backgroundConfig.type === 'grid' && (
              <AnimatedGrid 
                color={primaryColor}
                secondaryColor={secondaryColor}
                speed={backgroundConfig.speed}
                cellSize={60}
              />
            )}
            {backgroundConfig.type === 'mesh' && (
              <MeshGradient 
                colors={[primaryColor, secondaryColor]}
                speed={backgroundConfig.speed}
                blobCount={4}
                opacity={0.5}
              />
            )}
          </>
        )}

        {/* Particles */}
        {particlesConfig.enabled && (
          <FloatingParticles 
            count={particlesConfig.count}
            color={particlesConfig.color}
            secondaryColor={secondaryColor}
            speed="normal"
            showConnections={false}
          />
        )}
      </React.Suspense>
    </div>
  );
};

export default BackgroundEffects;
