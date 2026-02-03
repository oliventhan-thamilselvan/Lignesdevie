import { useState, useEffect } from 'react';

interface PhotoRevealProps {
  src: string;
  alt?: string;
  revealThreshold?: number;
  playerX?: number;
  photoX?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Composant pour révéler une photo lorsque la ligne passe à proximité
 */
export function PhotoReveal({ 
  src, 
  alt = '', 
  revealThreshold = 300, 
  playerX = 0, 
  photoX = 0,
  style = {},
  className = ''
}: PhotoRevealProps) {
  const [revealed, setRevealed] = useState(false);
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    const distance = Math.abs(playerX - photoX);
    
    if (distance < revealThreshold) {
      setRevealed(true);
      // Calcul de l'opacité selon la distance
      const revealAmount = 1 - (distance / revealThreshold);
      setOpacity(Math.max(0, Math.min(1, revealAmount)));
    } else if (revealed && distance > revealThreshold * 1.5) {
      // Fade out si le joueur s'éloigne trop
      setOpacity(0);
    }
  }, [playerX, photoX, revealThreshold, revealed]);
  
  return (
    <div
      className={`absolute transition-opacity duration-500 ${className}`}
      style={{
        opacity,
        ...style,
      }}
    >
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
