import { useEffect, useState } from 'react';
import { HorizontalExperience } from './components/HorizontalExperience';
import { GameCanvas } from './components/GameCanvas';
import { GameHUD } from './components/GameHUD';
import { EndScene } from './components/EndScene';
import { PolaroidHoverOverlay } from './components/PolaroidHoverOverlay';

import { useScrollProgress } from './hooks/useScrollProgress';
import { useHorizontalScroll } from './hooks/useHorizontalScroll';
import { useAudioBus } from './hooks/useAudioBus';

import { TOTAL_WIDTH, LEVELS } from './utils/constants';

export default function App() {
  /* =======================
     POLAROID HOVER
  ======================= */
  const [hoveredPolaroid, setHoveredPolaroid] = useState<null | {
    image: string;
    title: string;
    text2?: string;  // ⬅️ En optionnel
  }>(null);

  /* =======================
     SCROLL & AUDIO
  ======================= */
  const { progress, scrollY } = useScrollProgress();
  const horizontalPosition = useHorizontalScroll();
  const { initAudio, setAmbience } = useAudioBus();

  const [audioReady, setAudioReady] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [endVisible, setEndVisible] = useState(false);

  /* =======================
     LEVEL
  ======================= */
  const getCurrentLevel = () => {
    let acc = 0;
    for (const level of LEVELS) {
      if (horizontalPosition < acc + level.width) return level;
      acc += level.width;
    }
    return LEVELS[LEVELS.length - 1];
  };

  const currentLevel = getCurrentLevel();

  /* =======================
     AUDIO INIT
  ======================= */
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

  /* =======================
     INTRO / END
  ======================= */
  useEffect(() => {
    setIntroVisible(scrollY < 10);
  }, [scrollY]);

  useEffect(() => {
    setEndVisible(progress >= 0.98);
  }, [progress]);

  useEffect(() => {
    setAmbience(currentLevel.id);
  }, [currentLevel]);

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="relative bg-[var(--bg-deep)] text-[var(--text-bright)] overflow-x-hidden">

      {/* SCROLL SPACER */}
      <div style={{ height: `${TOTAL_WIDTH * 0.5}px` }} />

      {/* EXPERIENCE BACKGROUND */}
      <div className="fixed inset-0 z-10">
        <HorizontalExperience
          horizontalPosition={horizontalPosition}
          playerX={horizontalPosition}
          scrollPosition={scrollY}
        />
      </div>

      {/* GAME CANVAS */}
      <GameCanvas
        scrollY={scrollY}
        horizontalPosition={horizontalPosition}
        onPolaroidHover={setHoveredPolaroid}
      />

      {/* HUD */}
      {!endVisible && (
        <GameHUD
          progress={progress}
          horizontalPosition={horizontalPosition}
        />
      )}

      {/* 🖼️ POLAROID HOVER OVERLAY */}
      {hoveredPolaroid && (
        <PolaroidHoverOverlay polaroid={hoveredPolaroid} />
      )}

      {/* END SCENE */}
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
          <h1 className="text-6xl md:text-8xl font-extralight tracking-widest">
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
