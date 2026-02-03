import { useState, useEffect } from 'react';
import { TOTAL_WIDTH } from '../utils/constants';
import { useObstacleStore } from '../stores/obstacleStore';

/**
 * Hook pour mapper le scroll vertical en position horizontale
 * Avec blocage par obstacles
 */
export function useHorizontalScroll() {
  const [horizontalPosition, setHorizontalPosition] = useState(0);
  const { maxScrollPosition, updateMaxScroll } = useObstacleStore();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      
      // Mapper progress (0-1) sur la largeur totale
      let position = progress * TOTAL_WIDTH;
      
      // Limiter la position à maxScrollPosition si un obstacle bloque
      if (position > maxScrollPosition) {
        position = maxScrollPosition;
      } else {
        // Mettre à jour la position max atteinte
        updateMaxScroll(position);
      }
      
      setHorizontalPosition(position);
    };
    
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxScrollPosition, updateMaxScroll]);
  
  return horizontalPosition;
}