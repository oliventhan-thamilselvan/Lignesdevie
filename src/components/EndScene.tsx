import { useEffect, useState } from 'react';
import { DreamAI } from './DreamAI';

interface EndSceneProps {
  isVisible?: boolean;
}

/**
 * Scène finale - Football / Lumière
 * Apparaît lorsque progress >= 0.95
 */
export function EndScene({ isVisible = false }: EndSceneProps) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShow(true), 300);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className={`fixed inset-0 z-40 flex items-center justify-center bg-[var(--bg-deep)] transition-opacity duration-1000 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center space-y-8 max-w-2xl px-8">
        {/* Titre final */}
        <h1 
          className="text-5xl md:text-7xl font-light tracking-wide animate-fadeIn"
          style={{ 
            color: 'var(--accent-light)',
            textShadow: '0 0 30px rgba(244, 197, 66, 0.5)',
          }}
        >
          LUMIÈRE
        </h1>
        
        {/* Message */}
        <p className="text-xl md:text-2xl opacity-80 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          La ligne continue.
        </p>
        
        <p className="text-base opacity-60 animate-fadeIn" style={{ animationDelay: '1s' }}>
        Oliventhan Thamilselvan • Strat UX • 2022-2026
        </p>
        
        <DreamAI />

        
        {/* Credits discrets */}
        <div className="pt-12 text-sm opacity-40 animate-fadeIn" style={{ animationDelay: '2s' }}>
          <p>Projet individuel • S6 BUT MMI</p>
          <p className="mt-2">Réenchanter le monde</p>
        </div>
      </div>
    </div>
  );
}
