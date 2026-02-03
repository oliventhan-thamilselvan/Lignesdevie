import { useState, useEffect } from 'react';

/**
 * Hook pour tracker la progression du scroll (0 à 1)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0;
      
      setScrollY(scrollTop);
      setProgress(Math.min(Math.max(scrollProgress, 0), 1));
    };
    
    handleScroll(); // init
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return { progress, scrollY };
}
