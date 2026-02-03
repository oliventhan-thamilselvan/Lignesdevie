import { useMemo } from 'react';
import { LEVELS } from '../utils/constants';

interface GameHUDProps {
  progress?: number;
  horizontalPosition?: number;
}

/**
 * HUD discret : progression, niveau actuel, phrase
 */
export function GameHUD({ progress = 0, horizontalPosition = 0 }: GameHUDProps) {
  // Déterminer le niveau actuel
  const currentLevel = useMemo(() => {
    let accumulatedWidth = 0;
    for (const level of LEVELS) {
      if (horizontalPosition < accumulatedWidth + level.width) {
        return level;
      }
      accumulatedWidth += level.width;
    }
    return LEVELS[LEVELS.length - 1];
  }, [horizontalPosition]);

  return (
    <div className="fixed top-0 left-0 w-full h-screen z-30 pointer-events-none">
      {/* Barre de progression */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[var(--bg-dark)]">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${progress * 100}%`,
            backgroundColor: currentLevel.color,
            boxShadow: `0 0 10px ${currentLevel.color}`,
          }}
        />
      </div>

      {/* Indicateur de niveau */}
      <div className="absolute top-8 left-8 space-y-2">
        <div
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontWeight: 300,
            letterSpacing: '0.35em',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            opacity: 0.6,
            color: currentLevel.color,
          }}
        >
          {currentLevel.name}
        </div>

        <div
          style={{
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.8rem',
            opacity: 0.4,
          }}
        >
          {currentLevel.subtitle}
        </div>
      </div>

      {/* 🧠 TITRE NARRATIF — EN BAS */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center transition-all duration-700"
        style={{
          top: '9.5vh', // ← ajuste ici (4–8vh recommandé)
        }}
      >
        <h2
          style={{
            fontFamily: '"Anton", sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(1.1rem, 2.4vw, 2rem)',
            letterSpacing: '0.25em',
            lineHeight: 1.1,
            color: currentLevel.color,
            opacity: 0.50,
            textTransform: 'uppercase',
          }}
        >
          {currentLevel.title}
        </h2>
      </div>

      {/* Instructions (début uniquement) */}
      {progress < 0.05 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center animate-pulse-slow">
          <div className="text-sm opacity-60">
            Scroll pour avancer • Souris pour stabiliser
          </div>
        </div>
      )}
            {/* Instructions (début uniquement) */}
            {progress > 0.05 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center animate-pulse-slow">
          <div className="text-sm opacity-60">
            Attrape les étoiles pour remporter des points
          </div>
        </div>
      )}
    </div>
  );
}
