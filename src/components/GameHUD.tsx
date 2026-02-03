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

  // 🔽 AJUSTEMENT VERTICAL DU TITRE (zone sûre)
  const TITLE_BASE_TOP = '60%'; // ← change ici si tu veux encore plus bas
  
  return (
    <div className="fixed top-0 left-0 w-full z-30 pointer-events-none">
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
          className="text-xs font-light tracking-widest uppercase opacity-60"
          style={{ color: currentLevel.color }}
        >
          {currentLevel.name}
        </div>
        <div className="text-sm opacity-40">
          {currentLevel.subtitle}
        </div>
      </div>

      {/* 🔥 TITRE CENTRAL (DESCENDU) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none transition-all duration-700"
        style={{ top: TITLE_BASE_TOP }}
      >
        <h2
          className="text-2xl md:text-4xl font-light tracking-wide"
          style={{
            color: currentLevel.color,
            textShadow: `0 0 20px ${currentLevel.color}40`,
          }}
        >
          {currentLevel.title}
        </h2>
      </div>

      {/* Instructions (visible au début) */}
      {progress < 0.05 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center animate-pulse-slow">
          <div className="text-sm opacity-60">
            Scroll pour avancer • Souris pour stabiliser
          </div>
        </div>
      )}
    </div>
  );
}
