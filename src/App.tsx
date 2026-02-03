import { useEffect, useState } from 'react';
import { HorizontalExperience } from './components/HorizontalExperience';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { EndScene } from './components/EndScene';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';
import { useAudioBus } from './hooks/useAudioBus';
import { TOTAL_WIDTH, LEVELS } from './utils/constants';

export default function App() {
  const { progress, scrollY } = useScrollProgress();
  const horizontalPosition = useHorizontalScroll();
  const { initAudio, setAmbience } = useAudioBus();

  const [audioReady, setAudioReady] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [endVisible, setEndVisible] = useState(false);

  // Niveau actuel
  const getCurrentLevel = () => {
    let acc = 0;
    for (const level of LEVELS) {
      if (horizontalPosition < acc + level.width) return level;
      acc += level.width;
    }
    return LEVELS[LEVELS.length - 1];
  };

  const currentLevel = getCurrentLevel();

  // Init audio UNE FOIS
  useEffect(() => {
    const init = () => {
      if (!audioReady) {
        initAudio();
        setAudioReady(true);
      }
    };
    window.addEventListener('click', init, { once: true });
    window.addEventListener('wheel', init, { once: true });
    return () => {
      window.removeEventListener('click', init);
      window.removeEventListener('wheel', init);
    };
  }, [audioReady, initAudio]);

  // Intro visible uniquement en haut
  useEffect(() => {
    setIntroVisible(scrollY < 10);
  }, [scrollY]);

  // End scene
  useEffect(() => {
    setEndVisible(progress >= 0.98);
  }, [progress]);

  // Ambiance audio
  useEffect(() => {
    setAmbience(currentLevel.id);
  }, [currentLevel]);

  return (
    <div className="relative bg-[var(--bg-deep)] text-[var(--text-bright)] overflow-x-hidden">

      {/* Scroll spacer */}
      <div style={{ height: `${TOTAL_WIDTH * 0.5}px` }} />

      {/* EXPÉRIENCE */}
      <div className="fixed inset-0 z-10">
        <HorizontalExperience
          horizontalPosition={horizontalPosition}
          playerX={horizontalPosition}
          scrollPosition={scrollY}
        />
      </div>

      <GameCanvas
        scrollY={scrollY}
        horizontalPosition={horizontalPosition}
      />

      {!endVisible && (
        <GameHUD
          progress={progress}
          horizontalPosition={horizontalPosition}
        />
      )}

      {/* END SCENE — fond opaque, PAS de dégradé */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg-deep)]
        transition-opacity duration-1000
        ${endVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <EndScene isVisible={endVisible} />
      </div>

      {/* INTRO */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center
        bg-[var(--bg-deep)] transition-opacity duration-1000
        ${introVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="text-center space-y-8 max-w-2xl px-8">
          <h1
            className="text-6xl md:text-8xl font-extralight tracking-widest"
            style={{
              textShadow: '0 0 40px rgba(255,255,255,0.3)',
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

    </div>
  );
}
