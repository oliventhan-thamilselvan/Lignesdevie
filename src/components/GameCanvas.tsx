import { useRef, useEffect, useCallback, useState } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { Vector2D } from '../utils/physics';
import { GAME_CONFIG, LEVELS, Level } from '../utils/constants';

interface GameCanvasProps {
  scrollY?: number;
  horizontalPosition?: number;
}

interface Player {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  trail: Vector2D[];
  lastScrollY?: number;
}

interface Mouse {
  x: number;
  y: number;
  isOver: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface PathSegment {
  x: number;
  y: number;
}

interface Collectible {
  id: string;
  worldX: number;
  worldY: number;
  type: 'star' | 'memory' | 'heart';
  collected: boolean;
  floatOffset: number;
  glowIntensity: number;
}

interface InteractiveZone {
  id: string;
  worldX: number;
  worldY: number;
  width: number;
  height: number;
  type: 'wind' | 'gravity' | 'bounce' | 'slow';
  strength: number;
  active: boolean;
}

interface VisualEffect {
  id: string;
  x: number;
  y: number;
  type: 'explosion' | 'sparkle' | 'ripple' | 'collect';
  life: number;
  maxLife: number;
  particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[];
}

interface BackgroundPhoto {
  id: string;
  worldX: number;
  worldY: number;
  imageUrl: string;
  text: string;
  title: string;
  side: 'left' | 'right';
  width: number;
  height: number;
  revealProgress: number; // 0 à 1
}

/**
 * Composant Canvas principal pour le jeu "LIGNES DE VIE"
 * Bonhomme qui parcourt un chemin narratif
 */
export function GameCanvas({ scrollY = 0, horizontalPosition = 0 }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: GAME_CONFIG.canvasHeight });
  
  // Particules d'ambiance
  const particlesRef = useRef<Particle[]>([]);
  
  // Chemin visuel
  const pathRef = useRef<PathSegment[]>([]);
  
  // État du joueur
  const playerRef = useRef<Player>({
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    trail: [],
  });
  
  const mouseRef = useRef<Mouse>({ x: 0, y: 0, isOver: false });
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const worldOffsetRef = useRef<number>(0);
  
  // Nouveaux systèmes interactifs
  const [collectibles, setCollectibles] = useState<Collectible[]>([
    { id: 's1', worldX: 500, worldY: 150, type: 'star', collected: false, floatOffset: 0, glowIntensity: 1 },
    { id: 'm1', worldX: 1200, worldY: 200, type: 'memory', collected: false, floatOffset: 0, glowIntensity: 1 },
    { id: 'h1', worldX: 2000, worldY: 180, type: 'heart', collected: false, floatOffset: 0, glowIntensity: 1 },
    { id: 's2', worldX: 2800, worldY: 220, type: 'star', collected: false, floatOffset: 0, glowIntensity: 1 },
    { id: 'm2', worldX: 3600, worldY: 160, type: 'memory', collected: false, floatOffset: 0, glowIntensity: 1 },
    { id: 'h2', worldX: 4400, worldY: 190, type: 'heart', collected: false, floatOffset: 0, glowIntensity: 1 },
    { id: 's3', worldX: 5200, worldY: 170, type: 'star', collected: false, floatOffset: 0, glowIntensity: 1 },
  ]);
  
  const [interactiveZones, setInteractiveZones] = useState<InteractiveZone[]>([
    { id: 'w1', worldX: 800, worldY: 200, width: 200, height: 300, type: 'wind', strength: 1, active: false },
    { id: 'g1', worldX: 2200, worldY: 250, width: 150, height: 250, type: 'gravity', strength: 1.5, active: false },
    { id: 'b1', worldX: 3800, worldY: 200, width: 180, height: 280, type: 'bounce', strength: 2, active: false },
    { id: 's1', worldX: 4800, worldY: 220, width: 200, height: 300, type: 'slow', strength: 0.5, active: false },
  ]);
  
  const [visualEffects, setVisualEffects] = useState<VisualEffect[]>([]);
  const [score, setScore] = useState(0);
  
  // Photos de fond avec narratif - utiliser useRef pour permettre les mutations directes
  const backgroundPhotosRef = useRef<BackgroundPhoto[]>([
    {
      id: 'p1',
      worldX: 400,
      worldY: 200,
      imageUrl: '/images/oli1.jpg',
      title: 'Né au Sri Lanka',
      text: 'Une enfance marquée par la violence et l’instabilité dès la naissance.',
      side: 'left',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p2',
      worldX: 1100,
      worldY: 280,
      imageUrl: '/images/oli2.jpg',
      title: 'Père décédé - 3 ans',
      text: 'Une perte précoce qui a laissé un vide profond et durable',
      side: 'right',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p3',
      worldX: 1800,
      worldY: 200,
      imageUrl: '/images/oli3.jpg',
      title: '3 ans de prison',
      text: 'Une période sombre, faite d’enfermement et de survie',
      side: 'left',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p4',
      worldX: 2500,
      worldY: 260,
      imageUrl: '/images/oli4.jpg',
      title: 'Évasion vers l\'Inde',
      text: 'Une fuite risquée, guidée par l’instinct de vivre libre',
      side: 'right',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p5',
      worldX: 3200,
      worldY: 200,
      imageUrl: '/images/oli5.jpg',
      title: 'France - 2014',
      text: 'Un nouveau départ, sans repères mais plein d’espoir',
      side: 'left',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p6',
      worldX: 3900,
      worldY: 270,
      imageUrl: '/images/oli6.jpg',
      title: 'Apprentissage du français',
      text: 'Un combat quotidien pour comprendre, parler et s’intégrer',
      side: 'right',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p7',
      worldX: 4600,
      worldY: 200,
      imageUrl: '/images/oli7.jpg',
      title: 'Loin de ma mère',
      text: 'La séparation, car elle devait travailler pour subvenir aux besoins',
      side: 'left',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p8',
      worldX: 5300,
      worldY: 250,
      imageUrl: '/images/oli8.jpg',
      title: 'Vivre tout seul',
      text: 'Grandir trop vite, apprendre à se débrouiller sans soutien',
      side: 'right',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p9',
      worldX: 6000,
      worldY: 200,
      imageUrl: '/images/oli9.jpg',
      title: 'Perdu à l\'université',
      text: 'Désorientation, mauvaises décisions et perte de sens',
      side: 'left',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p10',
      worldX: 6700,
      worldY: 260,
      imageUrl: '/images/oli10.jpg',
      title: 'Se reprendre en main',
      text: 'Prise de conscience et volonté de changer de trajectoire',
      side: 'right',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p11',
      worldX: 7400,
      worldY: 200,
      imageUrl: '/images/oli11.jpg',
      title: 'Reconstruction',
      text: 'Bâtir une stabilité, une identité et une confiance retrouvée',
      side: 'left',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
    {
      id: 'p12',
      worldX: 8100,
      worldY: 240,
      imageUrl: '/images/oli12.jpg',
      title: 'Alternance au FCSM',
      text: 'Un rêve d’enfant devenu réalité : travailler dans le football',
      side: 'right',
      width: 280,
      height: 210,
      revealProgress: 0,
    },
  ]);
  const backgroundPhotos = backgroundPhotosRef.current;
  
  // Phrases inspirantes pour la fin
  const inspirationalQuotes = [
    { text: "Ton passé ne définit pas ton futur", worldX: 8600, worldY: 180 },
    { text: "Chaque obstacle est une opportunité", worldX: 9000, worldY: 280 },
    { text: "La résilience est ton super-pouvoir", worldX: 9400, worldY: 200 },
    { text: "Crois en tes rêves, même les plus fous", worldX: 9800, worldY: 260 },
    { text: "Tu es plus fort que tu ne le penses", worldX: 10200, worldY: 220 },
    { text: "L'échec n'est qu'une étape vers la réussite", worldX: 10600, worldY: 190 },
    { text: "Ose rêver grand, ose agir maintenant", worldX: 11000, worldY: 270 },
    { text: "Ta différence est ta plus grande force", worldX: 11400, worldY: 210 },
    { text: "Chaque jour est une nouvelle chance", worldX: 11800, worldY: 240 },
    { text: "N'abandonne jamais, jamais, jamais", worldX: 12200, worldY: 200 },
  ];
  
  // Cache pour les images
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  
  // Initialiser le chemin et les particules
  useEffect(() => {
    // Créer le chemin visuel
    if (dimensions.width > 0 && dimensions.height > 0) {
      const centerY = dimensions.height / 2;
      const path: PathSegment[] = [];
      
      for (let i = 0; i < 200; i++) {
        const x = i * 50;
        const wave = Math.sin(i * 0.3) * 20;
        path.push({ x, y: centerY + wave });
      }
      
      pathRef.current = path;
    }
    
    // Initialiser les particules
    if (particlesRef.current.length === 0 && dimensions.width > 0) {
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5,
          color: currentLevel.color,
        });
      }
    }
  }, [dimensions, currentLevel]);
  
  // Initialiser la position du joueur
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      playerRef.current.x = centerX;
      playerRef.current.y = centerY;
    }
  }, [dimensions]);
  
  // Déterminer le niveau actuel
  useEffect(() => {
    let accumulatedWidth = 0;
    for (const level of LEVELS) {
      if (horizontalPosition < accumulatedWidth + level.width) {
        setCurrentLevel(level);
        break;
      }
      accumulatedWidth += level.width;
    }
  }, [horizontalPosition]);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: GAME_CONFIG.canvasHeight });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Gestion de la souris
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isOver: true,
      };
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.isOver = false;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Logique de jeu
  const updateGame = useCallback((deltaTime: number) => {
    const player = playerRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;
    
    const centerY = height / 2;
    
    // Mise à jour des particules
    particlesRef.current.forEach(particle => {
      particle.x += particle.speedX - 1; // Défilement vers la gauche
      particle.y += particle.speedY;
      
      if (particle.x < -10) {
        particle.x = width + 10;
        particle.y = Math.random() * height;
      }
      
      particle.color = currentLevel.color;
    });
    
    // Suivre le scroll
    worldOffsetRef.current = horizontalPosition;
    
    // Gestion de la position verticale du joueur (souris)
    if (mouseRef.current.isOver) {
      const targetY = mouseRef.current.y;
      const diff = targetY - player.y;
      player.y += diff * 0.05;
    }
    
    const diffToCenter = centerY - player.y;
    player.y += diffToCenter * 0.02;
    
    player.y = Math.max(80, Math.min(height - 80, player.y));
    
    // Trail
    player.trail.push({ x: player.x, y: player.y });
    if (player.trail.length > 100) {
      player.trail.shift();
    }
    
    // Rendu
    renderGame(ctx, width, height, player);
  }, [dimensions, horizontalPosition, currentLevel]);
  
  // Fonction de rendu stylée
  const renderGame = (ctx: CanvasRenderingContext2D, width: number, height: number, player: Player) => {
    const centerY = height / 2;
    
    // Calculer la progression globale (0 à 1)
    const totalWorldWidth = LEVELS.reduce((sum, level) => sum + level.width, 0);
    const globalProgress = Math.min(1, worldOffsetRef.current / totalWorldWidth);
    
    // Palette minimaliste : DARK → MOINS FONCÉ
    const colorStart = { r: 10, g: 12, b: 20 }; // Noir bleuté profond
    const colorEnd = { r: 60, g: 65, b: 75 }; // Gris anthracite clair
    
    const interpolateColor = (start: { r: number; g: number; b: number }, end: { r: number; g: number; b: number }, progress: number) => {
      const r = Math.round(start.r + (end.r - start.r) * progress);
      const g = Math.round(start.g + (end.g - start.g) * progress);
      const b = Math.round(start.b + (end.b - start.b) * progress);
      return `rgb(${r}, ${g}, ${b})`;
    };
    
    const bgColor = interpolateColor(colorStart, colorEnd, globalProgress);
    
    // Couleur de texte adaptative
    const textColor = globalProgress < 0.5 ? '#F0F0F0' : '#E8E8E8';
    
    // Fond uni minimaliste qui s'éclaircit vers le jaune
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Vignette sombre au début qui s'atténue
    if (globalProgress < 0.7) {
      const vignetteStrength = (1 - globalProgress / 0.7) * 0.6;
      const vignetteGradient = ctx.createRadialGradient(
        width / 2, centerY, 0,
        width / 2, centerY, Math.max(width, height) * 0.6
      );
      vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteStrength})`);
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Lumière solaire radiale qui apparaît progressivement
    if (globalProgress > 0.3) {
      const lightStrength = (globalProgress - 0.3) / 0.7;
      const lightGradient = ctx.createRadialGradient(
        width / 2, centerY, 0,
        width / 2, centerY, Math.max(width, height) * 0.5
      );
      lightGradient.addColorStop(0, `rgba(255, 240, 120, ${lightStrength * 0.25})`);
      lightGradient.addColorStop(0.5, `rgba(255, 220, 80, ${lightStrength * 0.15})`);
      lightGradient.addColorStop(1, 'rgba(255, 200, 60, 0)');
      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Rayons de soleil subtils à la fin
    if (globalProgress > 0.6) {
      const raysStrength = (globalProgress - 0.6) / 0.4;
      ctx.save();
      ctx.globalAlpha = raysStrength * 0.1;
      ctx.translate(width / 2, centerY);
      
      for (let i = 0; i < 12; i++) {
        ctx.rotate(Math.PI / 6);
        const rayGradient = ctx.createLinearGradient(0, 0, 0, height / 2);
        rayGradient.addColorStop(0, 'rgba(255, 230, 100, 0.3)');
        rayGradient.addColorStop(1, 'rgba(255, 230, 100, 0)');
        ctx.fillStyle = rayGradient;
        ctx.fillRect(-20, 0, 40, height / 2);
      }
      
      ctx.restore();
    }
    
    // Ligne d'horizon ultra-minimaliste
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = currentLevel.color;
    ctx.lineWidth = 1;
    ctx.setLineDash([15, 30]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    
    // Grille discrète qui devient plus visible avec la lumière
    const gridOpacity = 0.03 + (globalProgress * 0.05);
    ctx.globalAlpha = gridOpacity;
    ctx.strokeStyle = currentLevel.color;
    ctx.lineWidth = 0.5;
    
    const gridSpacing = 120;
    const gridOffset = (worldOffsetRef.current * 0.3) % gridSpacing;
    
    for (let x = -gridOffset; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // Barre de navigation minimaliste
    const navHeight = 45;
    
    // Barre supérieure transparente
    ctx.fillStyle = globalProgress < 0.5 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(0, 0, width, navHeight);
    
    // Ligne de séparation fine
    ctx.strokeStyle = currentLevel.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(0, navHeight);
    ctx.lineTo(width, navHeight);
    ctx.stroke();
    ctx.globalAlpha = 1;
    
    // PHOTOS DE FOND
    backgroundPhotos.forEach(photo => {
      const photoX = photo.worldX - worldOffsetRef.current + width / 2;
      const photoY = photo.worldY;
      
      // Garder les photos visibles extrêmement longtemps (5000px au lieu de 400px)
      if (photoX < -photo.width - 5000 || photoX > width + 5000) return;
      
      // Définir les dimensions du polaroid d'abord
      const polaroidPadding = 12;
      const polaroidBottomPadding = 40;
      const polaroidWidth = photo.width + polaroidPadding * 2;
      const polaroidHeight = photo.height + polaroidPadding + polaroidBottomPadding;
      
      // Calculer la distance entre le joueur et la photo pour l'effet d'écriture
      const distanceToPlayer = Math.abs(worldOffsetRef.current - photo.worldX);
      const revealDistance = 800; // Distance à laquelle le texte commence à s'écrire - réduite pour apparition plus tardive
      
      // Calculer la progression de révélation (0 à 1)
      let newRevealProgress = 0;
      if (distanceToPlayer < revealDistance) {
        // Phase d'apparition
        newRevealProgress = 1 - (distanceToPlayer / revealDistance);
        newRevealProgress = Math.pow(newRevealProgress, 1.2); // Courbe plus douce
      } else {
        // Phase de maintien complet - reste à 100% tant que visible
        newRevealProgress = 1;
      }
      
      // Vérifier si le texte sort de l'écran pour la disparition TRÈS PROGRESSIVE
      // Le texte est à droite du polaroid, donc on vérifie s'il sort à gauche
      const textX = photoX + polaroidWidth / 2 + 60;
      const fadeOutStartX = -1500; // Commence à disparaître très loin
      const fadeOutDistance = 2000; // Distance sur laquelle s'effectue le fade out (très long)
      
      if (textX < fadeOutStartX) {
        // Disparition TRÈS progressive sur une grande distance
        const fadeProgress = Math.min(1, (fadeOutStartX - textX) / fadeOutDistance);
        newRevealProgress = 1 - fadeProgress;
      }
      
      // Mise à jour progressive du revealProgress avec interpolation lisse
      photo.revealProgress = Math.min(1, photo.revealProgress + (newRevealProgress - photo.revealProgress) * 0.08);
      
      // Charger l'image si elle n'est pas déjà dans le cache
      let image = imageCache.current.get(photo.id);
      if (!image) {
        image = new Image();
        image.src = photo.imageUrl;
        image.crossOrigin = 'anonymous';
        imageCache.current.set(photo.id, image);
      }
      
      // Animation de flottement subtile
      const floatOffset = Math.sin(Date.now() * 0.001 + parseFloat(photo.id.slice(1))) * 8;
      const finalPhotoY = photoY + floatOffset;
      
      // Rotation subtile basée sur le côté
      const rotationAngle = photo.side === 'left' ? -0.03 : 0.03;
      const hoverRotation = photo.revealProgress * 0.02;
      
      ctx.save();
      ctx.translate(photoX, finalPhotoY);
      ctx.rotate(rotationAngle + hoverRotation);
      
      // Polaroid ultra-stylé (polaroidPadding et dimensions déjà définies plus haut)
      
      // Ombre portée profonde et moderne (triple couche)
      ctx.shadowBlur = 60;
      ctx.shadowColor = globalProgress < 0.5 ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
      ctx.shadowOffsetX = photo.side === 'left' ? -8 : 8;
      ctx.shadowOffsetY = 20;
      
      // Cadre principal blanc pur
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(
        -polaroidWidth / 2,
        -polaroidHeight / 2,
        polaroidWidth,
        polaroidHeight
      );
      
      // Réinitialiser l'ombre
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Bordure extérieure avec dégradé subtil
      const borderGradient = ctx.createLinearGradient(
        -polaroidWidth / 2, -polaroidHeight / 2,
        polaroidWidth / 2, polaroidHeight / 2
      );
      borderGradient.addColorStop(0, currentLevel.color);
      borderGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      borderGradient.addColorStop(1, currentLevel.color);
      
      ctx.strokeStyle = borderGradient;
      ctx.lineWidth = 3;
      ctx.strokeRect(
        -polaroidWidth / 2,
        -polaroidHeight / 2,
        polaroidWidth,
        polaroidHeight
      );
      
      // Glow coloré autour du polaroid
      ctx.save();
      ctx.globalAlpha = photo.revealProgress * 0.4;
      ctx.shadowBlur = 40;
      ctx.shadowColor = currentLevel.color;
      ctx.strokeStyle = currentLevel.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(
        -polaroidWidth / 2,
        -polaroidHeight / 2,
        polaroidWidth,
        polaroidHeight
      );
      ctx.restore();
      
      // Dessiner l'image dans le cadre avec clip
      if (image.complete) {
        ctx.save();
        
        // Clip pour l'image
        ctx.beginPath();
        ctx.rect(
          -photo.width / 2,
          -photo.height / 2 - polaroidBottomPadding / 2 + polaroidPadding / 2,
          photo.width,
          photo.height
        );
        ctx.clip();
        
        // Effet de saturation progressive
        if (globalProgress < 0.3) {
          ctx.filter = `grayscale(${(1 - globalProgress / 0.3) * 0.7}) sepia(0.3)`;
        }
        
        ctx.drawImage(
          image,
          -photo.width / 2,
          -photo.height / 2 - polaroidBottomPadding / 2 + polaroidPadding / 2,
          photo.width,
          photo.height
        );
        
        ctx.filter = 'none';
        ctx.restore();
        
        // Overlay de brillance sur l'image
        ctx.save();
        ctx.globalAlpha = 0.15;
        const shineGradient = ctx.createLinearGradient(
          -photo.width / 2, -photo.height / 2,
          photo.width / 2, photo.height / 2
        );
        shineGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        shineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        shineGradient.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
        ctx.fillStyle = shineGradient;
        ctx.fillRect(
          -photo.width / 2,
          -photo.height / 2 - polaroidBottomPadding / 2 + polaroidPadding / 2,
          photo.width,
          photo.height
        );
        ctx.restore();
      }
      
      // Légende en haut du polaroid (style écriture manuscrite)
      ctx.save();
      ctx.fillStyle = globalProgress < 0.5 ? '#1a1a1a' : '#2d2d2d';
      ctx.font = 'italic 14px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const captionY = -photo.height / 2 - polaroidBottomPadding / 2 + polaroidPadding / 2 + 12;
      const phaseNumber = parseInt(photo.id.slice(1));
      ctx.fillText(`Phase ${phaseNumber}/12`, 0, captionY);
      ctx.restore();
      
      // Coin plié (effet 3D subtil)
      if (photo.side === 'right') {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.moveTo(polaroidWidth / 2 - 20, -polaroidHeight / 2);
        ctx.lineTo(polaroidWidth / 2, -polaroidHeight / 2);
        ctx.lineTo(polaroidWidth / 2, -polaroidHeight / 2 + 20);
        ctx.closePath();
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.moveTo(polaroidWidth / 2 - 20, -polaroidHeight / 2);
        ctx.lineTo(polaroidWidth / 2, -polaroidHeight / 2 + 20);
        ctx.lineTo(polaroidWidth / 2 - 15, -polaroidHeight / 2 + 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      
      ctx.restore();
      
      // Texte narratif ultra-stylé avec effet néon - TOUJOURS À DROITE
      const textAlign = 'left';
      
      ctx.save();
      
      // Typographie moderne avec glow
      ctx.textAlign = textAlign;
      ctx.textBaseline = 'middle';
      
      // Titre avec effet néon
      ctx.save();
      ctx.shadowBlur = 20;
      ctx.shadowColor = currentLevel.color;
      ctx.fillStyle = currentLevel.color;
      ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif';
      ctx.letterSpacing = '1.5px';
      
      const titleLength = photo.title.length;
      const revealedTitleChars = Math.floor(titleLength * photo.revealProgress);
      const displayedTitle = photo.title.substring(0, revealedTitleChars);
      
      // Curseur clignotant stylé
      const showCursor = photo.revealProgress < 1 && Math.floor(Date.now() / 400) % 2 === 0;
      const cursorChar = showCursor && revealedTitleChars < titleLength ? '│' : '';
      
      ctx.fillText(displayedTitle + cursorChar, textX, centerY - 15);
      
      // Double glow pour effet néon renforcé
      ctx.globalAlpha = 0.6;
      ctx.shadowBlur = 40;
      ctx.fillText(displayedTitle + cursorChar, textX, centerY - 15);
      ctx.restore();
      
      // Ligne décorative sous le titre - toujours alignée à gauche
      ctx.save();
      const lineWidth = ctx.measureText(displayedTitle).width;
      const lineX = textX;
      ctx.strokeStyle = currentLevel.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(lineX, centerY - 3);
      ctx.lineTo(lineX + lineWidth * photo.revealProgress, centerY - 3);
      ctx.stroke();
      ctx.restore();
      
      // Texte descriptif élégant
      ctx.fillStyle = textColor;
      ctx.globalAlpha = 0.85;
      ctx.font = '400 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif';
      ctx.shadowBlur = 8;
      ctx.shadowColor = globalProgress < 0.5 ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
      
      // Séparer le texte en lignes
      const lines = photo.text.split('\\\\\\\\n');
      
      // Calculer le nombre total de caractères révélés
      const revealedChars = Math.floor(photo.text.length * photo.revealProgress);
      
      // Afficher le texte ligne par ligne
      let charCount = 0;
      lines.forEach((line, index) => {
        const lineStart = charCount;
        
        if (revealedChars > lineStart) {
          const charsToShow = Math.min(revealedChars - lineStart, line.length);
          const displayedLine = line.substring(0, charsToShow);
          
          ctx.fillText(displayedLine, textX, centerY + 18 + index * 28);
          
          // Curseur minimaliste pour les lignes - toujours à droite
          if (charsToShow < line.length && Math.floor(Date.now() / 500) % 2 === 0) {
            const cursorX = textX + ctx.measureText(displayedLine).width + 3;
            ctx.fillText('│', cursorX, centerY + 18 + index * 28);
          }
        }
        
        charCount += line.length + 1;
      });
      
      ctx.restore();
    });
    
    // Trail lumineux du bonhomme
    if (player.trail.length > 1) {
      const trailGradient = ctx.createLinearGradient(
        player.trail[0].x, player.trail[0].y,
        player.x, player.y
      );
      trailGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      trailGradient.addColorStop(1, currentLevel.color);
      
      ctx.strokeStyle = currentLevel.color;
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 25;
      ctx.shadowColor = currentLevel.color;
      
      ctx.beginPath();
      ctx.moveTo(player.trail[0].x, player.trail[0].y);
      
      for (let i = 1; i < player.trail.length; i++) {
        const alpha = (i / player.trail.length) * 0.6;
        ctx.globalAlpha = alpha;
        ctx.lineTo(player.trail[i].x, player.trail[i].y);
      }
      
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
    
    // Bonhomme stylisé
    const size = 45;
    const headRadius = size / 3;
    const bodyHeight = size / 2;
    
    // Aura du bonhomme
    ctx.shadowBlur = 40;
    ctx.shadowColor = currentLevel.color;
    
    // Halo
    const haloGradient = ctx.createRadialGradient(
      player.x, player.y, 0,
      player.x, player.y, size * 1.5
    );
    haloGradient.addColorStop(0, currentLevel.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
    haloGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = haloGradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Tête avec dégradé
    const headGradient = ctx.createRadialGradient(
      player.x - 3, player.y - size / 3 - 3, 2,
      player.x, player.y - size / 3, headRadius
    );
    headGradient.addColorStop(0, '#FFFFFF');
    headGradient.addColorStop(1, '#E0E0E0');
    
    ctx.fillStyle = headGradient;
    ctx.beginPath();
    ctx.arc(player.x, player.y - size / 3, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Corps lumineux
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - size / 3 + headRadius);
    ctx.lineTo(player.x, player.y + bodyHeight);
    ctx.stroke();
    
    // Animation de marche fluide
    const walkCycle = Math.sin(Date.now() * 0.01) * 0.5;
    
    // Bras
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - size / 3, player.y + size / 3 + Math.sin(walkCycle) * 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + size / 3, player.y + size / 3 - Math.sin(walkCycle) * 10);
    ctx.stroke();
    
    // Jambes
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + bodyHeight);
    ctx.lineTo(player.x - size / 4, player.y + size + Math.sin(walkCycle + Math.PI) * 12);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(player.x, player.y + bodyHeight);
    ctx.lineTo(player.x + size / 4, player.y + size - Math.sin(walkCycle + Math.PI) * 12);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // COLLECTIBLES INTERACTIFS
    collectibles.forEach((collectible) => {
      if (collectible.collected) return;
      
      const collectibleX = collectible.worldX - worldOffsetRef.current + width / 2;
      const collectibleY = collectible.worldY + Math.sin(Date.now() * 0.003 + parseFloat(collectible.id.slice(1))) * 10;
      
      if (collectibleX < -100 || collectibleX > width + 100) return;
      
      const size = 30;
      
      // Détection de collision avec le joueur
      const dist = Math.hypot(collectibleX - player.x, collectibleY - player.y);
      if (dist < 40) {
        setCollectibles(prev => prev.map(c => 
          c.id === collectible.id ? { ...c, collected: true } : c
        ));
        setScore(prev => prev + 10);
        
        // Créer effet visuel de collecte
        const newEffect: VisualEffect = {
          id: `collect_${Date.now()}`,
          x: collectibleX,
          y: collectibleY,
          type: 'collect',
          life: 0,
          maxLife: 30,
          particles: Array.from({ length: 15 }, () => ({
            x: collectibleX,
            y: collectibleY,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 2,
            size: Math.random() * 4 + 2,
            color: currentLevel.color
          }))
        };
        setVisualEffects(prev => [...prev, newEffect]);
        return;
      }
      
      // Glow pulsant
      const glowSize = size + Math.sin(Date.now() * 0.005) * 8;
      ctx.shadowBlur = 30;
      ctx.shadowColor = collectible.type === 'star' ? '#FFC700' : 
                        collectible.type === 'heart' ? '#FF6B9D' :
                        '#4ECDC4';
      
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = collectible.type === 'star' ? '#FFC700' : 
                      collectible.type === 'heart' ? '#FF6B9D' :
                      '#4ECDC4';
      ctx.beginPath();
      ctx.arc(collectibleX, collectibleY, glowSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Symbole géométrique professionnel
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.fillStyle = collectible.type === 'star' ? '#FFC700' : 
                      collectible.type === 'heart' ? '#FF6B9D' :
                      '#4ECDC4';
      
      // Dessiner un symbole géométrique selon le type
      if (collectible.type === 'star') {
        // Étoile géométrique à 5 branches
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const x = collectibleX + Math.cos(angle) * 12;
          const y = collectibleY + Math.sin(angle) * 12;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      } else if (collectible.type === 'heart') {
        // Cercle simple pour cœur
        ctx.beginPath();
        ctx.arc(collectibleX, collectibleY, 10, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Carré pour mémoire
        ctx.fillRect(collectibleX - 10, collectibleY - 10, 20, 20);
      }
      
      ctx.restore();
      ctx.shadowBlur = 0;
    });
    
    // ZONES INTERACTIVES
    interactiveZones.forEach((zone) => {
      const zoneX = zone.worldX - worldOffsetRef.current + width / 2;
      const zoneY = zone.worldY;
      
      if (zoneX < -zone.width - 100 || zoneX > width + 100) return;
      
      // Détection si le joueur est dans la zone
      const inZone = 
        player.x >= zoneX - zone.width / 2 &&
        player.x <= zoneX + zone.width / 2 &&
        player.y >= zoneY - zone.height / 2 &&
        player.y <= zoneY + zone.height / 2;
      
      setInteractiveZones(prev => prev.map(z =>
        z.id === zone.id ? { ...z, active: inZone } : z
      ));
      
      // Effet visuel de la zone
      ctx.save();
      ctx.globalAlpha = inZone ? 0.3 : 0.15;
      
      const zoneColor = zone.type === 'wind' ? '#6DD5FA' :       // Bleu cyan clair
                        zone.type === 'gravity' ? '#A78BFA' :    // Violet doux
                        zone.type === 'bounce' ? '#FFC700' :     // Or vif
                        '#FF6B9D';                               // Rose corail
      
      const zoneGradient = ctx.createRadialGradient(
        zoneX, zoneY, 0,
        zoneX, zoneY, zone.width / 2
      );
      zoneGradient.addColorStop(0, zoneColor);
      zoneGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = zoneGradient;
      ctx.fillRect(
        zoneX - zone.width / 2,
        zoneY - zone.height / 2,
        zone.width,
        zone.height
      );
      
      // Particules de zone
      if (inZone) {
        for (let i = 0; i < 5; i++) {
          const px = zoneX + (Math.random() - 0.5) * zone.width;
          const py = zoneY + (Math.random() - 0.5) * zone.height;
          ctx.fillStyle = zoneColor;
          ctx.globalAlpha = Math.random() * 0.5;
          ctx.beginPath();
          ctx.arc(px, py, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
      ctx.shadowBlur = 0;
    });
    
    // EFFETS VISUELS
    visualEffects.forEach((effect) => {
      effect.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.3; // Gravité
        p.vx *= 0.98; // Friction
        
        const life = effect.life / effect.maxLife;
        const particleSize = Math.max(0.5, p.size * (1 - life * 0.5)); // S'assurer que le rayon reste positif
        
        ctx.globalAlpha = 1 - life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
        ctx.fill();
      });
      
      effect.life++;
    });
    
    setVisualEffects(prev => prev.filter(e => e.life < e.maxLife));
    ctx.globalAlpha = 1;
    
    // Score affiché dans les perforations
    if (score > 0) {
      ctx.save();
      ctx.fillStyle = currentLevel.color;
      ctx.font = 'bold 20px "Arial Black"';
      ctx.textAlign = 'right';
      ctx.shadowBlur = 15;
      ctx.shadowColor = currentLevel.color;
      ctx.fillText(`${score} pts`, width - 30, 35);
      ctx.restore();
    }
    
    // Barre de progression élégante
    const progressBarWidth = 300;
    const progressBarHeight = 8;
    const progressBarX = 30;
    const progressBarY = 30;
    
    ctx.save();
    
    // Fond de la barre
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
    
    // Remplissage progressif avec dégradé
    const progressGradient = ctx.createLinearGradient(
      progressBarX, progressBarY,
      progressBarX + progressBarWidth * globalProgress, progressBarY
    );
    
    if (globalProgress < 0.5) {
      progressGradient.addColorStop(0, 'rgba(255, 200, 120, 0.8)');
      progressGradient.addColorStop(1, 'rgba(255, 220, 150, 1)');
    } else {
      progressGradient.addColorStop(0, currentLevel.color);
      progressGradient.addColorStop(1, currentLevel.color.replace('rgb', 'rgba').replace(')', ', 0.6)'));
    }
    
    ctx.fillStyle = progressGradient;
    ctx.fillRect(progressBarX, progressBarY, progressBarWidth * globalProgress, progressBarHeight);
    
    // Bordure lumineuse
    ctx.strokeStyle = currentLevel.color;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.6;
    ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
    
    // Texte de progression
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#000';
    ctx.globalAlpha = 1;
    ctx.fillText(`${Math.floor(globalProgress * 100)}%`, progressBarX, progressBarY - 8);
    
    // Indicateur de phase actuelle
    ctx.font = 'italic 12px Georgia';
    ctx.fillStyle = currentLevel.color;
    ctx.fillText(currentLevel.name, progressBarX + progressBarWidth + 15, progressBarY + 6);
    
    ctx.restore();
    
    // Particules d'ambiance améliorées avec profondeur
    particlesRef.current.forEach(particle => {
      const depth = particle.size / 4;
      const parallaxX = particle.x - (worldOffsetRef.current * 0.1 * depth);
      
      ctx.save();
      ctx.globalAlpha = particle.opacity * 0.6;
      
      // Étoiles scintillantes pour partie moderne
      if (globalProgress > 0.5) {
        const twinkle = Math.sin(Date.now() * 0.005 + particle.x) * 0.5 + 0.5;
        ctx.shadowBlur = particle.size * 3 * twinkle;
        ctx.shadowColor = currentLevel.color;
        ctx.fillStyle = currentLevel.color;
      } else {
        // Poussières vintage
        ctx.fillStyle = 'rgba(255, 240, 220, 0.5)';
      }
      
      ctx.beginPath();
      ctx.arc(parallaxX, particle.y, particle.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    
    // PHRASES INSPIRANTES POUR LA FIN
    inspirationalQuotes.forEach(quote => {
      const quoteX = quote.worldX - worldOffsetRef.current + width / 2;
      const quoteY = quote.worldY;
      
      if (quoteX < -400 || quoteX > width + 400) return;
      
      // Calculer la distance entre le joueur et la phrase pour l'effet d'écriture
      const distanceToPlayer = Math.abs(worldOffsetRef.current - quote.worldX);
      const revealDistance = 600; // Distance à laquelle le texte commence à s'écrire
      
      // Calculer la progression de révélation (0 à 1)
      let quoteRevealProgress = 0;
      if (distanceToPlayer < revealDistance) {
        quoteRevealProgress = 1 - (distanceToPlayer / revealDistance);
        quoteRevealProgress = Math.pow(quoteRevealProgress, 1.2); // Courbe plus douce
      }
      
      // Typographie moderne avec glow
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Titre avec effet néon - couleur adaptative pour lisibilité
      ctx.save();
      ctx.shadowBlur = 20;
      const quoteColor = globalProgress > 0.7 ? '#1A1A1A' : currentLevel.color;
      ctx.shadowColor = globalProgress > 0.7 ? 'rgba(0, 0, 0, 0.3)' : currentLevel.color;
      ctx.fillStyle = quoteColor;
      ctx.font = '700 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif';
      ctx.letterSpacing = '1.5px';
      
      const titleLength = quote.text.length;
      const revealedTitleChars = Math.floor(titleLength * quoteRevealProgress);
      const displayedTitle = quote.text.substring(0, revealedTitleChars);
      
      // Curseur clignotant stylé
      const showCursor = quoteRevealProgress < 1 && Math.floor(Date.now() / 400) % 2 === 0;
      const cursorChar = showCursor && revealedTitleChars < titleLength ? '│' : '';
      
      ctx.fillText(displayedTitle + cursorChar, quoteX, quoteY);
      
      // Double glow pour effet néon renforcé
      ctx.globalAlpha = 0.6;
      ctx.shadowBlur = 40;
      ctx.fillText(displayedTitle + cursorChar, quoteX, quoteY);
      ctx.restore();
    });
  };
  
  useGameLoop(updateGame, true);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
  }, [dimensions]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed top-1/2 left-0 w-full -translate-y-1/2 z-20 pointer-events-auto"
      style={{ height: `${GAME_CONFIG.canvasHeight}px` }}
    />
  );
}