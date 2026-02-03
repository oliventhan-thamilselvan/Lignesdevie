import { useEffect, useRef } from 'react';

/**
 * Hook pour créer une boucle de jeu avec requestAnimationFrame
 * @param callback - fonction appelée à chaque frame (reçoit deltaTime en ms)
 * @param isActive - active/désactive la boucle
 */
export function useGameLoop(callback: (deltaTime: number) => void, isActive: boolean = true) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  useEffect(() => {
    if (!isActive) return;
    
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [callback, isActive]);
}
