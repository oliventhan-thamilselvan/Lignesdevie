import { useMemo } from 'react';
import { LEVELS } from '../utils/constants';
import { LevelSection } from './LevelSection';

interface HorizontalExperienceProps {
  horizontalPosition?: number;
  playerX?: number;
  scrollPosition?: number;
}

/**
 * Wrapper pour l'expérience horizontale
 * Gère l'illusion de déplacement horizontal via scroll vertical
 */
export function HorizontalExperience({ 
  horizontalPosition = 0,
  playerX = 0,
  scrollPosition = 0
}: HorizontalExperienceProps) {
  // Calculer les positions cumulées pour chaque niveau
  const levelOffsets = useMemo(() => {
    let offset = 0;
    return LEVELS.map((level) => {
      const current = offset;
      offset += level.width;
      return { level, offset: current };
    });
  }, []);
  
  // Déterminer quel niveau est actif
  const activeLevel = useMemo(() => {
    let accumulatedWidth = 0;
    for (let i = 0; i < LEVELS.length; i++) {
      if (horizontalPosition < accumulatedWidth + LEVELS[i].width) {
        return LEVELS[i].id;
      }
      accumulatedWidth += LEVELS[i].width;
    }
    return LEVELS[LEVELS.length - 1].id;
  }, [horizontalPosition]);
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Container qui se déplace horizontalement */}
      <div
        className="absolute top-0 left-0 h-full transition-transform duration-100 ease-out"
        style={{
          transform: `translateX(-${horizontalPosition}px)`,
          willChange: 'transform',
        }}
      >
        {levelOffsets.map(({ level, offset }) => (
          <LevelSection
            key={level.id}
            level={level}
            offsetX={offset}
            playerX={playerX}
            scrollPosition={scrollPosition}
            isActive={activeLevel === level.id}
          />
        ))}
      </div>
      
      {/* Gradient edges pour depth */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[var(--bg-deep)] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[var(--bg-deep)] to-transparent pointer-events-none z-10" />
    </div>
  );
}
