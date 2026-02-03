import { useMemo } from 'react';

interface PhotoParallaxProps {
  src: string;
  alt?: string;
  scrollPosition?: number;
  depth?: number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Composant photo avec effet parallaxe
 */
export function PhotoParallax({ 
  src, 
  alt = '', 
  scrollPosition = 0, 
  depth = 0.5,
  style = {},
  className = ''
}: PhotoParallaxProps) {
  // Calculer le décalage parallaxe
  const parallaxOffset = useMemo(() => {
    return scrollPosition * depth * -0.3;
  }, [scrollPosition, depth]);
  
  return (
    <div
      className={`absolute ${className}`}
      style={{
        transform: `translateX(${parallaxOffset}px)`,
        willChange: 'transform',
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
