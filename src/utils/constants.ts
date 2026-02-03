// Configuration des 5 niveaux narratifs
export interface LevelPhysics {
  friction: number;
  gravity: number;
  turbulence: number;
  maxSpeed: number;
  stabilityFactor: number;
  forceFields?: boolean;
  invertGravity?: boolean;
}

export interface LevelVisual {
  grain: number;
  blur: number;
  contrast: number;
  saturation: number;
  vignette?: number;
  drift?: boolean;
  brightness?: number;
}

export interface Level {
  id: string;
  name: string;
  color: string;
  title: string;
  subtitle: string;
  physics: LevelPhysics;
  visual: LevelVisual;
  width: number;
}

export const LEVELS: Level[] = [
  {
    id: 'chaos',
    name: 'CHAOS',
    color: '#e8e8f0',
    title: 'Naître dans le bruit.',
    subtitle: 'Tamil Eelam, 2004-2009',
    physics: {
      friction: 0.92,
      gravity: 0.3,
      turbulence: 0.8,
      maxSpeed: 4,
      stabilityFactor: 0.3,
    },
    visual: {
      grain: 0.8,
      blur: 4,
      contrast: 0.6,
      saturation: 0.4,
    },
    width: 2000,
  },
  {
    id: 'constraint',
    name: 'CONTRAINTE',
    color: '#ffffff',
    title: 'Tenir dans le noir.',
    subtitle: '3 ans',
    physics: {
      friction: 0.85,
      gravity: 0.15,
      turbulence: 0.5,
      maxSpeed: 3,
      stabilityFactor: 0.4,
      forceFields: true,
    },
    visual: {
      grain: 0.6,
      blur: 2,
      contrast: 0.7,
      saturation: 0.3,
      vignette: 0.8,
    },
    width: 1800,
  },
  {
    id: 'displacement',
    name: 'DÉPLACEMENT',
    color: '#ffffff',
    title: 'Trouver une sortie.',
    subtitle: 'Inde → France, 2014',
    physics: {
      friction: 0.88,
      gravity: 0.2,
      turbulence: 0.6,
      maxSpeed: 5,
      stabilityFactor: 0.5,
      invertGravity: true,
    },
    visual: {
      grain: 0.5,
      blur: 1,
      contrast: 0.8,
      saturation: 0.5,
      drift: true,
    },
    width: 2200,
  },
  {
    id: 'reconstruction',
    name: 'RECONSTRUCTION',
    color: '#ffffff',
    title: 'Recommencer. Respirer.',
    subtitle: 'France, apprentissage',
    physics: {
      friction: 0.94,
      gravity: 0.05,
      turbulence: 0.3,
      maxSpeed: 6,
      stabilityFactor: 0.7,
    },
    visual: {
      grain: 0.3,
      blur: 0.5,
      contrast: 0.9,
      saturation: 0.7,
    },
    width: 2000,
  },
  {
    id: 'light',
    name: 'LUMIÈRE',
    color: '#f4c542',
    title: 'Courir vers la lumière.',
    subtitle: 'Football professionnel',
    physics: {
      friction: 0.96,
      gravity: 0,
      turbulence: 0.1,
      maxSpeed: 8,
      stabilityFactor: 0.9,
    },
    visual: {
      grain: 0.1,
      blur: 0,
      contrast: 1,
      saturation: 1,
      brightness: 1.2,
    },
    width: 2500,
  },
];

// Calculer la largeur totale
export const TOTAL_WIDTH = LEVELS.reduce((sum, level) => sum + level.width, 0);

// Configuration du joueur (ligne lumineuse)
export const PLAYER_CONFIG = {
  initialX: 100,
  initialY: 300,
  lineWidth: 4,
  lineLength: 60,
  trailLength: 30,
  trailFade: 0.95,
  glowRadius: 20,
  color: '#ffffff',
};

// Configuration générale
export const GAME_CONFIG = {
  canvasHeight: 600,
  scrollMultiplier: 0.5,
  mouseInfluence: 0.15,
};
