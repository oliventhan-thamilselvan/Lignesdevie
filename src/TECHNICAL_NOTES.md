# Notes Techniques — LIGNES DE VIE

Documentation pour extensions et améliorations futures.

---

## 🧪 Système de Physique

### Architecture actuelle

Le moteur physique (`/utils/physics.js`) applique séquentiellement :

1. **Propulsion scroll** → Vélocité X
2. **Influence souris** → Vélocité Y
3. **Friction** → Ralentissement général
4. **Gravité** → Force verticale
5. **Turbulence** → Bruit aléatoire
6. **Stabilisation** → Retour vers centre
7. **Limite vitesse** → Clamp maxSpeed
8. **Bounds check** → Rebond sur bords

### Extensions à implémenter

#### Champs de force (niveau CONTRAINTE)

```javascript
// Dans physics.js
export function applyForceField(position, velocity, forceFields = []) {
  let newVelocity = { ...velocity };
  
  forceFields.forEach(field => {
    const dist = distance(position, field.center);
    
    if (dist < field.radius) {
      // Force répulsive ou attractive
      const strength = field.strength * (1 - dist / field.radius);
      const angle = Math.atan2(
        position.y - field.center.y,
        position.x - field.center.x
      );
      
      newVelocity.x += Math.cos(angle) * strength;
      newVelocity.y += Math.sin(angle) * strength;
    }
  });
  
  return newVelocity;
}

// Dans constants.js
constraint: {
  // ...
  forceFields: [
    { center: { x: 400, y: 300 }, radius: 150, strength: 0.5 },
    { center: { x: 800, y: 250 }, radius: 120, strength: -0.3 }
  ]
}
```

#### Gravité inversée par zones (niveau DÉPLACEMENT)

```javascript
// Dans GameCanvas.jsx updateGame()
if (currentLevel.physics.invertGravity) {
  // Déterminer la zone selon player.x
  const zoneWidth = 500;
  const zoneIndex = Math.floor(player.x / zoneWidth);
  const shouldInvert = zoneIndex % 2 === 0;
  
  velocity = applyGravity(velocity, physics.gravity, shouldInvert);
} else {
  velocity = applyGravity(velocity, physics.gravity);
}
```

#### Collisions avec obstacles

```javascript
// Nouveau fichier : /utils/collision.js
export function checkCollisions(position, velocity, obstacles = []) {
  for (const obstacle of obstacles) {
    if (isPointInRect(position, obstacle.rect)) {
      // Calculer vecteur de réflexion
      const normal = getNormalVector(position, obstacle);
      return reflectVelocity(velocity, normal, obstacle.bounciness);
    }
  }
  return velocity;
}

function isPointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
```

---

## 🎨 Effets Visuels Avancés

### Système de particules

```javascript
// Dans GameCanvas.jsx
const particlesRef = useRef([]);

// Dans updateGame(), après mise à jour position
if (Math.sqrt(velocity.x ** 2 + velocity.y ** 2) > 5) {
  // Émettre particules
  particlesRef.current.push({
    x: player.x,
    y: player.y,
    vx: -velocity.x * 0.2 + (Math.random() - 0.5),
    vy: -velocity.y * 0.2 + (Math.random() - 0.5),
    life: 1,
    color: currentLevel.color
  });
}

// Update particules
particlesRef.current = particlesRef.current
  .map(p => ({
    ...p,
    x: p.x + p.vx,
    y: p.y + p.vy,
    life: p.life - 0.02
  }))
  .filter(p => p.life > 0);

// Dans renderGame()
particlesRef.current.forEach(p => {
  ctx.globalAlpha = p.life;
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x, p.y, 3, 3);
});
ctx.globalAlpha = 1;
```

### Camera follow avec shake

```javascript
// Dans GameCanvas.jsx
const cameraRef = useRef({ x: 0, y: 0, shakeX: 0, shakeY: 0 });

// Dans updateGame()
// Smooth camera follow
const targetCameraX = player.x - width / 2;
cameraRef.current.x += (targetCameraX - cameraRef.current.x) * 0.1;

// Camera shake selon turbulence
const shakeStrength = physics.turbulence * 2;
cameraRef.current.shakeX = (Math.random() - 0.5) * shakeStrength;
cameraRef.current.shakeY = (Math.random() - 0.5) * shakeStrength;

// Dans renderGame(), appliquer transform
ctx.save();
ctx.translate(
  -cameraRef.current.x + cameraRef.current.shakeX,
  cameraRef.current.shakeY
);

// ... dessiner tout ...

ctx.restore();
```

### Post-processing Canvas

```javascript
// Bloom effect simplifié
function applyBloom(ctx, width, height) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Extract bright pixels
  const brightData = new Uint8ClampedArray(data.length);
  const threshold = 200;
  
  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
    if (brightness > threshold) {
      brightData[i] = data[i];
      brightData[i+1] = data[i+1];
      brightData[i+2] = data[i+2];
      brightData[i+3] = data[i+3];
    }
  }
  
  // Blur brightData (gaussian blur simplifié)
  // ... puis additive blend avec original
}
```

---

## 🔊 Sound Design (Web Audio API)

### Architecture proposée

```javascript
// Extension de /hooks/useAudioBus.js

export function useAudioBus() {
  const audioContextRef = useRef(null);
  const ambienceNodesRef = useRef({});
  const sfxNodesRef = useRef({});
  
  const initAudio = useCallback(() => {
    const ctx = new AudioContext();
    audioContextRef.current = ctx;
    
    // Créer des oscillateurs pour ambiances
    LEVELS.forEach(level => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = getFrequencyForLevel(level.id);
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      gain.gain.value = 0;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      
      ambienceNodesRef.current[level.id] = { osc, gain, filter };
    });
  }, []);
  
  const setAmbience = useCallback((levelId, fadeTime = 2) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const now = ctx.currentTime;
    
    // Fade out tous sauf le niveau actuel
    Object.keys(ambienceNodesRef.current).forEach(id => {
      const targetGain = id === levelId ? 0.3 : 0;
      ambienceNodesRef.current[id].gain.gain
        .linearRampToValueAtTime(targetGain, now + fadeTime);
    });
  }, []);
  
  const playSFX = useCallback((type, intensity = 1) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;
    
    const now = ctx.currentTime;
    
    switch(type) {
      case 'friction':
        // Bruit blanc filtré
        const bufferSize = ctx.sampleRate * 0.1;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * intensity;
        }
        
        const source = ctx.createBufferSource();
        const gain = ctx.createGain();
        source.buffer = buffer;
        gain.gain.value = 0.1;
        
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(now);
        break;
        
      case 'boost':
        // Sweep montant
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        oscGain.gain.setValueAtTime(0.2, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
    }
  }, []);
  
  return { initAudio, setAmbience, playSFX };
}

function getFrequencyForLevel(levelId) {
  const frequencies = {
    chaos: 80,
    constraint: 110,
    displacement: 150,
    reconstruction: 220,
    light: 330
  };
  return frequencies[levelId] || 100;
}
```

### Intégration dans GameCanvas

```javascript
// Dans GameCanvas.jsx
const { playSFX } = useAudioBus();

// Dans updateGame()
const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);

// Son de friction proportionnel à la turbulence
if (physics.turbulence > 0.5 && speed > 2) {
  playSFX('friction', physics.turbulence);
}

// Son de boost lors d'accélération forte
if (scrollDelta > 5) {
  playSFX('boost', Math.min(scrollDelta / 10, 1));
}
```

---

## 📸 Système Photo Avancé

### Masques SVG pour révélation artistique

```javascript
// PhotoReveal.jsx étendu
export function PhotoReveal({ mask = null, ... }) {
  const maskId = useMemo(() => `mask-${Math.random()}`, []);
  
  return (
    <div className="relative" style={{ opacity, ...style }}>
      {mask && (
        <svg className="absolute inset-0 w-0 h-0">
          <defs>
            <mask id={maskId}>
              <path d={mask.path} fill="white" />
            </mask>
          </defs>
        </svg>
      )}
      <img
        src={src}
        alt={alt}
        style={{ 
          maskImage: mask ? `url(#${maskId})` : undefined,
          WebkitMaskImage: mask ? `url(#${maskId})` : undefined
        }}
      />
    </div>
  );
}

// Utilisation dans LevelSection
{
  type: 'reveal',
  src: '...',
  mask: {
    path: 'M 0,0 L 100,0 L 100,100 L 0,100 Z' // SVG path
  }
}
```

### Captions contextuelles

```javascript
// Nouveau composant : PhotoCaption.jsx
export function PhotoCaption({ text, playerX, photoX, threshold = 200 }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(Math.abs(playerX - photoX) < threshold);
  }, [playerX, photoX, threshold]);
  
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded animate-fadeIn">
      <p className="text-sm">{text}</p>
    </div>
  );
}
```

---

## ⚡ Optimisations Performance

### Virtualisation des photos

```javascript
// Dans PhotoLayer.jsx
const visiblePhotos = useMemo(() => {
  const viewportLeft = playerX - window.innerWidth;
  const viewportRight = playerX + window.innerWidth;
  
  return photos.filter(photo => {
    return photo.x + photo.width > viewportLeft && 
           photo.x < viewportRight;
  });
}, [photos, playerX]);

// Render uniquement visiblePhotos
```

### Debounce resize

```javascript
// Dans GameCanvas.jsx
const debouncedResize = useMemo(
  () => debounce(handleResize, 100),
  []
);

useEffect(() => {
  window.addEventListener('resize', debouncedResize);
  return () => window.removeEventListener('resize', debouncedResize);
}, [debouncedResize]);
```

### Canvas offscreen pour trail

```javascript
const offscreenCanvasRef = useRef(null);

useEffect(() => {
  offscreenCanvasRef.current = new OffscreenCanvas(width, height);
}, [width, height]);

// Dessiner le trail sur offscreen canvas
// Puis blit sur canvas principal
```

---

## 🧩 Intégration Photos Personnelles

### Structure recommandée

```
/public/
  /photos/
    /chaos/
      - 001.jpg (Sri Lanka, enfance)
      - 002.jpg (contexte guerre)
    /constraint/
      - 001.jpg (symbolique)
    /displacement/
      - 001.jpg (Inde)
      - 002.jpg (voyage)
    /reconstruction/
      - 001.jpg (France)
      - 002.jpg (apprentissage)
    /light/
      - 001.jpg (stade)
      - 002.jpg (équipe)
```

### Import dynamique

```javascript
// Dans LevelSection.jsx
const photos = useMemo(() => {
  const photoData = {
    chaos: [
      { src: '/photos/chaos/001.jpg', caption: 'Sri Lanka, 1992' },
      { src: '/photos/chaos/002.jpg', caption: 'Traces' }
    ],
    // ...
  };
  
  return photoData[level.id].map((photo, i) => ({
    ...photo,
    type: i % 2 === 0 ? 'reveal' : 'parallax',
    x: offsetX + (i * 500),
    y: 100 + Math.random() * 200,
    width: 400,
    height: 300
  }));
}, [level, offsetX]);
```

---

## 🎯 Checklist Finale

Avant présentation BUT MMI :

- [ ] Remplacer toutes les photos Unsplash par archives personnelles
- [ ] Ajouter captions contextuelles sur chaque photo
- [ ] Tester sur mobile/tablette (touch events)
- [ ] Optimiser pour 60fps constant
- [ ] Ajouter sons d'ambiance (optionnel)
- [ ] Créer version accessible (mode sans scroll)
- [ ] Documentation utilisateur simple
- [ ] Credits complets (photos, code)
- [ ] Tester sur navigateurs : Chrome, Firefox, Safari

---

**Rappel :** Ce projet démontre maîtrise technique ET sensibilité artistique. L'équilibre entre les deux est crucial pour "Réenchanter le monde".
