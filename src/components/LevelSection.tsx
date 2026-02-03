import { PhotoLayer } from './PhotoLayer';
import { useMemo } from 'react';
import { Level } from '../utils/constants';

interface LevelSectionProps {
  level: Level;
  offsetX?: number;
  playerX?: number;
  scrollPosition?: number;
  isActive?: boolean;
}

/**
 * Section pour un niveau spécifique
 * Contient photos, ambiance visuelle, overlay texte
 */
export function LevelSection({ 
  level, 
  offsetX = 0,
  playerX = 0,
  scrollPosition = 0,
  isActive = false
}: LevelSectionProps) {
  // Photos réelles pour chaque niveau
  const photos = useMemo(() => {
    const photosByLevel: Record<string, any[]> = {
      chaos: [
        { 
          src: '/images/oli1.jpg',
          type: 'reveal',
          x: offsetX + 300,
          y: 100,
          width: 500,
          height: 400,
          revealThreshold: 450,
        },
        {
          src: '/images/oli2.jpg',
          type: 'parallax',
          x: offsetX + 900,
          y: 250,
          width: 450,
          height: 350,
          depth: 0.6,
        },
        {
          src: '/images/oli3.jpg',
          type: 'reveal',
          x: offsetX + 1400,
          y: 50,
          width: 400,
          height: 300,
          revealThreshold: 400,
        },
      ],
      constraint: [
        {
          src: '/images/oli4.jpg',
          type: 'reveal',
          x: offsetX + 400,
          y: 150,
          width: 350,
          height: 400,
          revealThreshold: 350,
        },
        {
          src: '/images/oli5.jpg',
          type: 'parallax',
          x: offsetX + 1000,
          y: 200,
          width: 400,
          height: 350,
          depth: 0.4,
        },
      ],
      displacement: [
        {
          src: '/images/oli6.jpg',
          type: 'parallax',
          x: offsetX + 500,
          y: 100,
          width: 600,
          height: 400,
          depth: 0.7,
        },
        {
          src: '/images/oli7.jpg',
          type: 'reveal',
          x: offsetX + 1300,
          y: 250,
          width: 450,
          height: 300,
          revealThreshold: 500,
        },
      ],
      reconstruction: [
        {
          src: '/images/oli8.jpg',
          type: 'reveal',
          x: offsetX + 400,
          y: 120,
          width: 500,
          height: 380,
          revealThreshold: 400,
        },
        {
          src: '/images/oli9.jpg',
          type: 'parallax',
          x: offsetX + 1100,
          y: 200,
          width: 450,
          height: 350,
          depth: 0.5,
        },
      ],
      light: [
        {
          src: '/images/oli10.jpg',
          type: 'parallax',
          x: offsetX + 600,
          y: 80,
          width: 700,
          height: 450,
          depth: 0.8,
        },
        {
          src: '/images/oli11.jpg',
          type: 'reveal',
          x: offsetX + 1500,
          y: 150,
          width: 600,
          height: 400,
          revealThreshold: 600,
        },
      ],
    };
    
    return photosByLevel[level.id] || [];
  }, [level, offsetX]);
  
  return (
    <div
      className="absolute top-0 h-screen pointer-events-none"
      style={{
        left: `${offsetX}px`,
        width: `${level.width}px`,
      }}
    >
      {/* Background gradient selon le niveau */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: `linear-gradient(90deg, ${level.color}10, transparent 50%, ${level.color}10)`,
          opacity: isActive ? 1 : 0.3,
        }}
      />
      
      {/* Photos */}
      <PhotoLayer
        photos={photos}
        playerX={playerX}
        scrollPosition={scrollPosition}
        levelVisual={level.visual}
      />
      
      {/* Overlay texte (optionnel) */}
      {isActive && (
        <div className="absolute top-1/3 left-20 max-w-md space-y-4 animate-fadeIn">
          <div 
            className="text-xs tracking-widest uppercase opacity-60"
            style={{ color: level.color }}
          >
            {level.subtitle}
          </div>
        </div>
      )}
      
      {/* Vignette selon niveau */}
      {level.visual.vignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
            opacity: level.visual.vignette,
          }}
        />
      )}
    </div>
  );
}
