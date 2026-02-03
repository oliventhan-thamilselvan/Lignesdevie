import { PhotoReveal } from './PhotoReveal';
import { PhotoParallax } from './PhotoParallax';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LevelVisual } from '../utils/constants';

interface Photo {
  src: string;
  alt?: string;
  type: 'reveal' | 'parallax' | 'static';
  x: number;
  y?: number;
  width?: number;
  height?: number;
  revealThreshold?: number;
  depth?: number;
  className?: string;
}

interface PhotoLayerProps {
  photos?: Photo[];
  playerX?: number;
  scrollPosition?: number;
  levelVisual?: LevelVisual;
}

/**
 * Gestionnaire de couches photos pour une section
 * Combine parallaxe et reveal selon le type
 */
export function PhotoLayer({ 
  photos = [], 
  playerX = 0, 
  scrollPosition = 0,
  levelVisual = {} as LevelVisual
}: PhotoLayerProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {photos.map((photo, index) => {
        const isReveal = photo.type === 'reveal';
        const isParallax = photo.type === 'parallax';
        
        // Style avec filtres visuels du niveau
        const visualStyle: React.CSSProperties = {
          filter: `
            grayscale(${levelVisual.grain || 0}) 
            blur(${levelVisual.blur || 0}px) 
            contrast(${levelVisual.contrast || 1}) 
            saturate(${levelVisual.saturation || 1})
            brightness(${levelVisual.brightness || 1})
          `,
        };
        
        if (isReveal) {
          return (
            <PhotoReveal
              key={`photo-${index}`}
              src={photo.src}
              alt={photo.alt || ''}
              playerX={playerX}
              photoX={photo.x || 0}
              revealThreshold={photo.revealThreshold || 400}
              style={{
                left: `${photo.x}px`,
                top: `${photo.y || 0}px`,
                width: `${photo.width || 400}px`,
                height: `${photo.height || 300}px`,
                ...visualStyle,
              }}
              className={photo.className || ''}
            />
          );
        }
        
        if (isParallax) {
          return (
            <PhotoParallax
              key={`photo-${index}`}
              src={photo.src}
              alt={photo.alt || ''}
              scrollPosition={scrollPosition}
              depth={photo.depth || 0.5}
              style={{
                left: `${photo.x}px`,
                top: `${photo.y || 0}px`,
                width: `${photo.width || 400}px`,
                height: `${photo.height || 300}px`,
                ...visualStyle,
              }}
              className={photo.className || ''}
            />
          );
        }
        
        // Photo statique par défaut
        return (
          <div
            key={`photo-${index}`}
            className={`absolute ${photo.className || ''}`}
            style={{
              left: `${photo.x}px`,
              top: `${photo.y || 0}px`,
              width: `${photo.width || 400}px`,
              height: `${photo.height || 300}px`,
              ...visualStyle,
            }}
          >
            <ImageWithFallback
              src={photo.src}
              alt={photo.alt || ''}
              className="w-full h-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
