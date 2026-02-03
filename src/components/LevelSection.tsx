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
          src: 'https://images.unsplash.com/photo-1636314532830-9ac680a00537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXIlMjBkYXJrJTIwc21va2UlMjBkZXN0cnVjdGlvbnxlbnwxfHx8fDE3NzAwNzk2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'reveal',
          x: offsetX + 300,
          y: 100,
          width: 500,
          height: 400,
          revealThreshold: 450,
        },
        {
          src: 'https://images.unsplash.com/photo-1636314532830-9ac680a00537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXIlMjBkYXJrJTIwc21va2UlMjBkZXN0cnVjdGlvbnxlbnwxfHx8fDE3NzAwNzk2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'parallax',
          x: offsetX + 900,
          y: 250,
          width: 450,
          height: 350,
          depth: 0.6,
        },
        {
          src: 'https://images.unsplash.com/photo-1636314532830-9ac680a00537?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXIlMjBkYXJrJTIwc21va2UlMjBkZXN0cnVjdGlvbnxlbnwxfHx8fDE3NzAwNzk2OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
          src: 'https://images.unsplash.com/photo-1768329956182-aa45e02670f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmlzb24lMjBiYXJzJTIwc2hhZG93JTIwY29uZmluZW1lbnR8ZW58MXx8fHwxNzcwMDc5NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'reveal',
          x: offsetX + 400,
          y: 150,
          width: 350,
          height: 400,
          revealThreshold: 350,
        },
        {
          src: 'https://images.unsplash.com/photo-1768329956182-aa45e02670f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmlzb24lMjBiYXJzJTIwc2hhZG93JTIwY29uZmluZW1lbnR8ZW58MXx8fHwxNzcwMDc5NjkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
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
          src: 'https://images.unsplash.com/photo-1545369134-7850c95a8858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmV5JTIwcm9hZCUyMGhvcml6b24lMjBtaWdyYXRpb258ZW58MXx8fHwxNzcwMDc5Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'parallax',
          x: offsetX + 500,
          y: 100,
          width: 600,
          height: 400,
          depth: 0.7,
        },
        {
          src: 'https://images.unsplash.com/photo-1545369134-7850c95a8858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmV5JTIwcm9hZCUyMGhvcml6b24lMjBtaWdyYXRpb258ZW58MXx8fHwxNzcwMDc5Njk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
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
          src: 'https://images.unsplash.com/photo-1668715612964-2a44ce84dbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3BlJTIwbGlnaHQlMjByZWJ1aWxkaW5nJTIwZGF3bnxlbnwxfHx8fDE3NzAwNzk2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'reveal',
          x: offsetX + 400,
          y: 120,
          width: 500,
          height: 380,
          revealThreshold: 400,
        },
        {
          src: 'https://images.unsplash.com/photo-1668715612964-2a44ce84dbcc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3BlJTIwbGlnaHQlMjByZWJ1aWxkaW5nJTIwZGF3bnxlbnwxfHx8fDE3NzAwNzk2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
          src: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBwcm9mZXNzaW9uYWwlMjBmaWVsZHxlbnwxfHx8fDE3NzAwNzk2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          type: 'parallax',
          x: offsetX + 600,
          y: 80,
          width: 700,
          height: 450,
          depth: 0.8,
        },
        {
          src: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBwcm9mZXNzaW9uYWwlMjBmaWVsZHxlbnwxfHx8fDE3NzAwNzk2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
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
