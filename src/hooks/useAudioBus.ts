import { useRef, useCallback } from 'react';

/**
 * Hook placeholder pour le sound design
 * TODO: intégrer Web Audio API pour ambiances par niveau
 * TODO: sons de friction, particules, transitions
 */
export function useAudioBus() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundsRef = useRef<Record<string, any>>({});
  
  // Initialiser le contexte audio (nécessite interaction utilisateur)
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API non supportée', e);
      }
    }
  }, []);
  
  // Jouer un son (placeholder)
  const playSound = useCallback((soundId: string, volume: number = 1) => {
    // TODO: implémenter la lecture de sons
    console.log(`[Audio] Playing: ${soundId} at volume ${volume}`);
  }, []);
  
  // Changer l'ambiance selon le niveau
  const setAmbience = useCallback((levelId: string) => {
    // TODO: crossfade entre ambiances
    console.log(`[Audio] Switching ambience to: ${levelId}`);
  }, []);
  
  // Arrêter tous les sons
  const stopAll = useCallback(() => {
    // TODO: fade out et stop
    console.log('[Audio] Stopping all sounds');
  }, []);
  
  return {
    initAudio,
    playSound,
    setAmbience,
    stopAll,
  };
}
