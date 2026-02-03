# LIGNES DE VIE

Expérience interactive immersive — Projet de fin d'études BUT MMI  
**Thème :** Réenchanter le monde

---

## 🎮 Concept

"LIGNES DE VIE" transforme un parcours de résilience en une expérience jouable. L'utilisateur contrôle une ligne lumineuse à travers 5 niveaux narratifs, du chaos vers la lumière, représentant un voyage personnel de Sri Lanka à un club de football professionnel en France.

### Gameplay : LINE OF SURVIVAL

- **Contrôle :** Scroll vertical = propulsion / Souris = stabilisation verticale
- **Règle d'or :** Pas de game over. La ligne avance toujours, quoi qu'il arrive.
- **Mécanique :** Physique temps réel (friction, gravité, turbulence) variant selon le niveau

---

## 🌊 Les 5 Niveaux

### 1. CHAOS (Sri Lanka, guerre)
- Physique : haute turbulence, gravité instable
- Visuel : grain élevé, contraste faible, flou
- Couleur : Rouge sombre (#d14545)

### 2. CONTRAINTE (Prison, 3 ans)
- Physique : friction élevée, champs de force invisibles
- Visuel : vignette forte, saturation basse
- Couleur : Violet (#8b4a9e)

### 3. DÉPLACEMENT (Inde → France, 2014)
- Physique : gravité inversée par zones, dérive
- Visuel : grain moyen, parallaxe prononcée
- Couleur : Bleu (#4a7c9e)

### 4. RECONSTRUCTION (Apprentissage, France)
- Physique : friction réduite, stabilisation progressive
- Visuel : clarté croissante, saturation restaurée
- Couleur : Vert (#5a9e6b)

### 5. LUMIÈRE (Football professionnel)
- Physique : fluidité maximale, turbulence minimale
- Visuel : luminosité élevée, aucun filtre
- Couleur : Or (#f4c542)

---

## 🏗️ Architecture Technique

### Stack
- **Framework :** React 18+
- **Styling :** Tailwind CSS v4
- **Animation :** Canvas API + requestAnimationFrame
- **Scroll :** Mapping vertical → horizontal (illusion)

### Structure des fichiers

```
/
├── components/
│   ├── HorizontalExperience.jsx  # Orchestration scroll horizontal
│   ├── LevelSection.jsx          # Section par niveau
│   ├── PhotoLayer.jsx            # Gestion photos (reveal/parallax)
│   ├── PhotoReveal.jsx           # Révélation progressive
│   ├── PhotoParallax.jsx         # Effet de profondeur
│   ├── GameCanvas.jsx            # Moteur de jeu Canvas
│   ├── GameHUD.jsx               # Interface utilisateur
│   └── EndScene.jsx              # Scène finale
│
├── hooks/
│   ├── useScrollProgress.js      # Progression 0-1
│   ├── useHorizontalScroll.js    # Position horizontale
│   ├── useGameLoop.js            # Boucle RAF
│   └── useAudioBus.js            # Audio (placeholder)
│
├── utils/
│   ├── physics.js                # Moteur physique
│   ├── noise.js                  # Générateur de bruit
│   └── constants.js              # Config niveaux
│
└── App.jsx                       # Point d'entrée
```

---

## ✨ Fonctionnalités Implémentées

✅ **Scroll horizontal** : Mapping vertical → horizontal seamless  
✅ **Jeu Canvas** : Ligne lumineuse avec trail, glow, inertie  
✅ **Physique par niveau** : Friction, gravité, turbulence dynamiques  
✅ **Photos reveal** : Apparition progressive selon proximité du joueur  
✅ **Photos parallax** : Profondeur multi-couches  
✅ **5 niveaux distincts** : Visuels et mécaniques uniques  
✅ **HUD minimaliste** : Progression, niveau actuel, phrases  
✅ **Scène finale** : Célébration du parcours  

---

## 🚀 Extensions Possibles (TODO)

### Physique avancée
- [ ] **Champs de force invisibles** (niveau CONTRAINTE)
- [ ] **Zones de gravité inversée** (niveau DÉPLACEMENT)
- [ ] **Obstacles dynamiques** avec collision

### Effets visuels
- [ ] **Particules** déclenchées par vitesse élevée
- [ ] **Camera shake** lors de turbulence forte
- [ ] **Post-processing** Canvas (bloom, chromatic aberration)

### Audio (Web Audio API)
- [ ] **Ambiances** par niveau avec crossfade
- [ ] **Sons interactifs** (friction, impact, accélération)
- [ ] **Musique adaptive** selon l'intensité

### Photos
- [ ] Remplacer les placeholders par **photos d'archives réelles**
- [ ] Système de **masque SVG** pour révélation artistique
- [ ] **Captions** contextuelles au hover

### Performance
- [ ] **Virtualisation** des photos (render uniquement visible viewport)
- [ ] **WebGL** pour effets avancés
- [ ] **Service Worker** pour chargement offline

---

## 🎨 Guide de Personnalisation

### Modifier un niveau

Éditer `/utils/constants.js` :

```javascript
{
  id: 'custom_level',
  name: 'NIVEAU CUSTOM',
  color: '#hexcolor',
  title: 'Phrase courte.',
  subtitle: 'Contexte',
  physics: {
    friction: 0.90,      // 0-1 (1 = aucune friction)
    gravity: 0.2,        // force gravitationnelle
    turbulence: 0.5,     // 0-1 (chaos)
    maxSpeed: 5,         // vitesse max
    stabilityFactor: 0.5 // auto-stabilisation
  },
  visual: {
    grain: 0.5,          // 0-1
    blur: 2,             // px
    contrast: 0.8,       // 0-1+
    saturation: 0.6      // 0-1+
  },
  width: 2000           // largeur en px
}
```

### Ajouter des photos

Dans `/components/LevelSection.jsx`, éditer `photosByLevel` :

```javascript
levelId: [
  {
    type: 'reveal',  // ou 'parallax'
    src: 'url_image',
    x: offsetX + 300,
    y: 100,
    width: 500,
    height: 400,
    revealThreshold: 400  // distance reveal (px)
    // ou depth: 0.5 pour parallax
  }
]
```

---

## 📦 Installation & Lancement

L'application fonctionne directement dans Figma Make. Aucune installation requise.

Pour développement local :
1. Exporter le code
2. `npm install` (React + Tailwind déjà configuré)
3. `npm run dev`

---

## 🌟 Objectifs Pédagogiques (BUT MMI)

✅ **Maîtrise technique** : Canvas, physique, scroll avancé  
✅ **Direction artistique** : Cohérence visuelle, storytelling  
✅ **UX innovante** : Interaction immersive, pas de game over  
✅ **Code propre** : Architecture modulaire, commentaires  
✅ **Performance** : 60fps constant, optimisations  

---

## 📸 Crédits

- **Concept & Développement** : Projet BUT MMI 2026
- **Photos** : Unsplash (placeholders à remplacer)
- **Thème** : "Réenchanter le monde"

---

**Note :** Ce projet est une démonstration artistique et technique. Les photos sont des placeholders. Pour la version finale, intégrer vos propres archives photographiques.
