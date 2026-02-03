// Générateur de bruit simple (Perlin-like simplifié)
// Utilisé pour la turbulence et les variations organiques

class SimplexNoise {
  private seed: number;
  private perm: number[];

  constructor(seed: number = Math.random()) {
    this.seed = seed;
    this.perm = this.buildPermutationTable();
  }
  
  private buildPermutationTable(): number[] {
    const p: number[] = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    
    // Fisher-Yates shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((this.seed * (i + 1)) % (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
      this.seed = (this.seed * 1103515245 + 12345) % 2147483648;
    }
    
    return [...p, ...p]; // double pour éviter les overflow
  }
  
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }
  
  private grad(hash: number, x: number): number {
    const h = hash & 15;
    const grad = 1 + (h & 7);
    return (h & 8 ? -grad : grad) * x;
  }
  
  noise1D(x: number): number {
    const X = Math.floor(x) & 255;
    x -= Math.floor(x);
    const u = this.fade(x);
    
    const a = this.perm[X];
    const b = this.perm[X + 1];
    
    return this.lerp(this.grad(this.perm[a], x), this.grad(this.perm[b], x - 1), u);
  }
  
  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    
    x -= Math.floor(x);
    y -= Math.floor(y);
    
    const u = this.fade(x);
    const v = this.fade(y);
    
    const a = this.perm[X] + Y;
    const b = this.perm[X + 1] + Y;
    
    return this.lerp(
      this.lerp(this.grad(this.perm[a], x), this.grad(this.perm[b], x - 1), u),
      this.lerp(this.grad(this.perm[a + 1], x), this.grad(this.perm[b + 1], x - 1), u),
      v
    );
  }
}

// Instance globale
let noiseGenerator = new SimplexNoise();

export function setNoiseSeed(seed: number): void {
  noiseGenerator = new SimplexNoise(seed);
}

export function noise1D(x: number): number {
  return noiseGenerator.noise1D(x);
}

export function noise2D(x: number, y: number): number {
  return noiseGenerator.noise2D(x, y);
}

// Bruit octave (plusieurs couches de bruit)
export function octaveNoise2D(x: number, y: number, octaves: number = 4, persistence: number = 0.5): number {
  let total = 0;
  let frequency = 1;
  let amplitude = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    total += noiseGenerator.noise2D(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  
  return total / maxValue;
}
