import { useEffect, useState } from 'react';
import { HorizontalExperience } from './components/HorizontalExperience';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { EndScene } from './components/EndScene';
import { LevelPhotos } from './components/LevelPhotos';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';
import { useAudioBus } from './hooks/useAudioBus';
import { TOTAL_WIDTH, LEVELS } from './utils/constants';

/**
 * LIGNES DE VIE
 * Expérience interactive immersive - Projet BUT MMI
 */
export default function App() {
  const { progress, scrollY } = useScrollProgress();
  const horizontalPosition = useHorizontalScroll();
  const { initAudio, setAmbience } = useAudioBus();
  
  const [hasStarted, setHasStarted] = useState(false);
  const [showEndScene, setShowEndScene] = useState(false);
  
  // Déterminer le niveau actuel
  const getCurrentLevel = () => {
    let accumulatedWidth = 0;
    for (const level of LEVELS) {
      if (horizontalPosition < accumulatedWidth + level.width) {
        return level;
      }
      accumulatedWidth += level.width;
    }
    return LEVELS[LEVELS.length - 1];
  };
  
  const currentLevel = getCurrentLevel();
  
  // Initialiser l'audio au premier clic
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasStarted) {
        initAudio();
        setHasStarted(true);
      }
    };
    
    window.addEventListener('click', handleFirstInteraction, { once: true });
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [hasStarted, initAudio]);
  
  // Afficher la scène finale
  useEffect(() => {
    if (progress >= 0.95) {
      setShowEndScene(true);
    }
  }, [progress]);
  
  // Changer l'ambiance audio selon le niveau
  useEffect(() => {
    setAmbience(currentLevel.id);
  }, [currentLevel]);
  
  return (
    <div className="relative bg-[var(--bg-deep)] text-[var(--text-bright)]">
      {/* Spacer pour créer le scroll vertical */}
      <div style={{ height: `${TOTAL_WIDTH * 0.5}px` }} />
      
      {/* Expérience horizontale (fixed) */}
      <div className="fixed top-0 left-0 w-full h-screen">
        <HorizontalExperience
          horizontalPosition={horizontalPosition}
          playerX={horizontalPosition}
          scrollPosition={scrollY}
        />
      </div>
      
      {/* Canvas de jeu */}
      <GameCanvas
        scrollY={scrollY}
        horizontalPosition={horizontalPosition}
      />
      
      {/* HUD */}
      <GameHUD
        progress={progress}
        horizontalPosition={horizontalPosition}
      />
      
      {/* Photos et textes du niveau actuel */}
      {hasStarted && !showEndScene && (
        <LevelPhotos
          levelId={currentLevel.id}
          levelName={currentLevel.name}
          levelTitle={currentLevel.title}
          levelSubtitle={currentLevel.subtitle}
        />
      )}
      
      {/* Scène finale */}
      <EndScene isVisible={showEndScene} />
      
      {/* Intro overlay (disparaît au premier scroll) */}
      {!hasStarted && progress === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-deep)] transition-opacity duration-1000">
          <div className="text-center space-y-8 max-w-2xl px-8">
            <h1 
              className="text-6xl md:text-8xl font-extralight tracking-widest"
              style={{ 
                color: 'var(--text-bright)',
                textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
              }}
            >
              LIGNES DE VIE
            </h1>
            
            <p className="text-lg opacity-60">
              Une expérience interactive immersive
            </p>
            
            <div className="pt-12 animate-pulse-slow">
              <p className="text-sm opacity-40">
                Scroll pour commencer
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}