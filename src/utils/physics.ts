// Moteur de physique simple pour la ligne

export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Applique la friction à la vélocité
 */
export function applyFriction(velocity: Vector2D, friction: number): Vector2D {
  return {
    x: velocity.x * friction,
    y: velocity.y * friction,
  };
}

/**
 * Applique la gravité
 */
export function applyGravity(velocity: Vector2D, gravity: number, inverted: boolean = false): Vector2D {
  return {
    x: velocity.x,
    y: velocity.y + (inverted ? -gravity : gravity),
  };
}

/**
 * Applique la turbulence (bruit aléatoire)
 */
export function applyTurbulence(velocity: Vector2D, turbulenceStrength: number): Vector2D {
  if (turbulenceStrength <= 0) return velocity;
  
  const noise = {
    x: (Math.random() - 0.5) * turbulenceStrength,
    y: (Math.random() - 0.5) * turbulenceStrength,
  };
  
  return {
    x: velocity.x + noise.x,
    y: velocity.y + noise.y,
  };
}

/**
 * Limite la vitesse maximale
 */
export function clampSpeed(velocity: Vector2D, maxSpeed: number): Vector2D {
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  
  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    return {
      x: velocity.x * scale,
      y: velocity.y * scale,
    };
  }
  
  return velocity;
}

/**
 * Stabilise la position Y vers le centre (optionnel)
 */
export function stabilizeY(position: Vector2D, velocity: Vector2D, targetY: number, stabilityFactor: number): Vector2D {
  const diff = targetY - position.y;
  const stabilizationForce = diff * stabilityFactor * 0.01;
  
  return {
    x: velocity.x,
    y: velocity.y + stabilizationForce,
  };
}

/**
 * Simule un champ de force invisible (pour niveau CONTRAINTE)
 * TODO: implémenter des zones de force avec positions définies
 */
export function applyForceField(position: Vector2D, velocity: Vector2D, forceFields: any[] = []): Vector2D {
  if (!forceFields || forceFields.length === 0) return velocity;
  
  // Placeholder: ajouter la logique des champs de force
  // Example: if (distance(position, fieldCenter) < fieldRadius) { apply force }
  
  return velocity;
}

/**
 * Calcule la distance entre deux points
 */
export function distance(p1: Vector2D, p2: Vector2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Interpolation linéaire
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Vérifie les collisions avec les bords du canvas
 */
export function checkBounds(position: Vector2D, velocity: Vector2D, width: number, height: number, padding: number = 50): Vector2D {
  let newVelocity = { ...velocity };
  
  // Rebond sur les bords verticaux
  if (position.y < padding) {
    newVelocity.y = Math.abs(velocity.y) * 0.5;
  } else if (position.y > height - padding) {
    newVelocity.y = -Math.abs(velocity.y) * 0.5;
  }
  
  return newVelocity;
}
