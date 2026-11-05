# 🏔️ TrailKernel — La Convolution d'Image en Haute Montagne

**TrailKernel** est une application web éducative professionnelle conçue pour enseigner la **convolution d'image pas à pas**, du niveau débutant au niveau expert, à travers une métaphore alpine immersive.

> **Public cible** : Randonneurs, lycéens, étudiants et curieux sans bagage mathématique supérieur.  
> **Principe directeur** : Le thème de la montagne sert l'explication sans jamais la remplacer. Tous les calculs matriciels restent transparents, explicites et vérifiables.

---

## 🎯 Idée Centrale

| Concept d'image / mathématique | Métaphore de randonnée |
| :--- | :--- |
| **Matrice en niveaux de gris (0–255)** | **Carte d'altitude (MNT)** : `0` = fond de lac / vallée, `255` = sommet enneigé. |
| **Fenêtre glissante 3×3** | **Champ de vision du randonneur** observant ses 8 voisins immédiats et ses pieds à chaque pas. |
| **Produit de convolution & somme pondérée** | **Pondération locale** : moyenne des altitudes environnantes. |
| **Diviseur & normalisation** | **Préservation de l'altitude moyenne** (éviter l'avalanche de saturation blanche). |
| **Flou uniforme (Box Blur)** | **Brouillard alpin** : estompe les aspérités et adoucit le relief. |
| **Flou gaussien (Gaussian Blur)** | **Brume légère** : le centre pèse plus lourd que les coins lointains. |
| **Filtre de netteté (Sharpen)** | **Jumelles de montagne** : amplifie les contrastes locaux. |
| **Laplacien 8-connexe** | **Détecteur de crêtes & falaises** : nul sur un plateau plat, vif sur les corniches. |
| **Embossage (Emboss)** | **Ombrage du relief (Hillshade)** : simule le soleil couchant rasant. |
| **Opérateurs de Sobel (Gx & Gy)** | **Gradients de pente directionnels** : versants est-ouest et nord-sud. |
| **Magnitude du gradient $\sqrt{G_x^2 + G_y^2}$** | **Carte de difficulté & risque d'avalanche** : vert = doux, rouge = à-pic. |
| **Vraie convolution vs corrélation croisée** | **Retournement à 180° du masque** : identique pour un noyau symétrique, différent sur Sobel. |

---

## 🗺️ Sentier Pédagogique (11 Niveaux)

### 🟢 Facile — Les Fondations
1. **🗺️ Lire la carte** : Découverte des Modèles Numériques de Terrain (MNT), lecture interactive des altitudes au clic, altimètre sonore Web Audio proportionnel à la hauteur.
2. **📈 Le profil du sentier** : Traitement d'un signal GPS 1D parasité, lissage par moyenne glissante `[1, 1, 1] ÷ 3` et élimination du pic de bruit.
3. **🔭 La fenêtre 3×3** : Décomposition pas à pas des 9 produits, de la somme, de la division et de l'écrêtage `[0, 255]`.

### 🟡 Moyen — Les Outils du Cartographe
4. **⚖️ Les coefficients** : Comparaison flou uniforme `/9` vs flou gaussien `/16`, démonstration choc de la saturation sans diviseur (`÷1`).
5. **🧭 Les bords de la carte** : Comparaison côte à côte des trois stratégies de lisière : *clamp* (répéter), *zero* (fond d'abîme) et *wrap* (tore périodique).
6. **🛠️ L'atelier du cartographe** : Palette d'outils (brouillard, jumelles, crêtes, ombrage, Sobel), inspecteur de pixel en direct sur reliefs « massif » et « plateau ».

### 🔴 Difficile — L'Analyse Spatiale Avancée
7. **📐 La carte des pentes** : Décomposition Sobel X / Sobel Y et magnitude globale transformée en carte de raideur de pente (vert à rouge).
8. **🕵️ Quelle carte est-ce ?** : Défi de reconnaissance à l'aveugle du filtre ayant produit la carte affichée, avec explications texturées.
9. **🎯 Le défi du guide** : Forge libre d'un noyau 3×3 pour isoler une ligne de crête, évalué en temps réel par Écart Moyen Absolu (MAE) avec indices progressifs.
10. **🔄 Convolution vs Corrélation & Composition** : Démonstration visuelle de la rotation à 180° du noyau ; preuve expérimentale que deux convolutions 3×3 successives équivalent à un filtre 5×5 pyramidal (`÷81`).

### 🏆 Expert — Le Test Ultime
11. **🏔️ Le Sommet (Examen Final de 100 points)** : 10 questions de mise en situation alpine. **Chaque réponse attendue est strictement calculée par le moteur mathématique** (zéro valeur arbitraire codée en dur). Bilan diagnostique par compétence avec bouton de révision vers le refuge concerné.

---

## 🎒 Gamification & Carnet de Rando

- **Progression en Dénivelé Positif (D+)** : Chaque étape rapporte des mètres d'ascension cumulés.
- **Rangs d'alpiniste** :
  - 🌲 *Marcheur Initié* (0 – 299 m D+)
  - 🥾 *Randonneur Aguerri* (300 – 699 m D+)
  - 🧗 *Alpiniste Chevronné* (700 – 1 199 m D+)
  - 🎖️ *Guide de Haute Montagne* (1 200+ m D+)
- **Carnet de Rando interactif** : 11 fiches d'applications réelles débloquées au fil de l'eau (radar satellitaire SAR, drones de secours du PGHM, prévision des avalanches, réseaux profonds CNN).
- **Mascotte originale** : *Bastien le Guide*, montagnard bienveillant en illustration vectorielle SVG exclusive.
- **Sauvegarde locale résiliente** : `localStorage` versionné, protégé par `try/catch` avec bouton de réinitialisation.

---

## 📸 Aperçu & Captures d'Écran

<!-- Emplacement prévu pour vos captures d'écran de l'application -->
```
[Capture d'écran 1 : Page d'accueil avec balayage animé de la fenêtre 3x3]
[Capture d'écran 2 : Décomposition transparente dans le StepCalculator]
[Capture d'écran 3 : Carte des pentes de Sobel en fausses couleurs vert/rouge]
[Capture d'écran 4 : Bilan diagnostique de l'examen final "Le Sommet"]
```

---

## 🛠️ Stack Technique

- **Bundler / Serveur** : Vite 8
- **UI & Rendu** : React 19, HTML5 Canvas API (pixel art natif)
- **Typage** : TypeScript 5.7 (strict, `noUncheckedIndexedAccess`)
- **Styles & Design System** : Tailwind CSS 4, Design Tokens montagnards (`src/styles/tokens.ts`)
- **Tests Unitaires** : Vitest (54 tests exhaustifs)
- **Qualité & Formatage** : ESLint (flat config) + Prettier + EditorConfig
- **Zéro dépendance lourde** : Aucun framework UI lourd, aucun code emprunté.

---

## 📂 Architecture du Projet

```
TrailKernel/
├── src/
│   ├── core/                  # Moteur mathématique pur (zéro DOM, zéro React)
│   │   ├── grid.ts            # Type Grid, setPixel, getPixel (clamp/zero/wrap), clampByte
│   │   ├── convolve1d.ts      # Convolution 1D (profils d'altitude)
│   │   ├── convolve2d.ts      # Convolution 2D 3×3 (corrélation ou vraie convolution)
│   │   ├── kernels.ts         # Définition des noyaux (Box, Gaussien, Sobel, Laplacien...)
│   │   ├── slope.ts           # Sobel X/Y, magnitude et détection de la pente maximale
│   │   ├── composition.ts     # Cascade 3×3 vers 5×5 et produit de convolution matriciel
│   │   ├── metrics.ts         # Calcul d'Écart Moyen Absolu (MAE) et score de similarité
│   │   ├── terrain.ts         # Générateur déterministe de relief (massif et plateau)
│   │   ├── random.ts          # Générateur pseudo-aléatoire Mulberry32 avec graine
│   │   ├── exam.ts            # Calculateur dynamique des 10 questions du Sommet
│   │   ├── storage.ts         # Persistance typée localStorage et gestion des rangs
│   │   └── index.ts           # Barrel export
│   ├── components/            # Composants UI interactifs
│   │   ├── PixelGrid.tsx      # Rendu Canvas 2D avec palettes (niveaux de gris, topo, pente)
│   │   ├── KernelEditor.tsx   # Matrice 3×3 éditable avec normalisation automatique
│   │   ├── StepCalculator.tsx # Détail arithmétique pas à pas (9 produits, somme, division)
│   │   ├── ProgressTrail.tsx  # Sentier balisé avec refuges et déblocage séquentiel
│   │   ├── HikerMascot.tsx    # Mascotte originale SVG « Bastien le Guide »
│   │   ├── CarnetModal.tsx    # Modal du carnet de terrain des applications réelles
│   │   ├── HomeHero.tsx       # Page d'accueil avec balayage 3×3 animé et vraies statistiques
│   │   └── Quiz.tsx           # QCM pédagogique avec explication immédiate
│   ├── features/              # Les 11 refuges (niveaux) de l'ascension
│   │   ├── level1/Level1.tsx  # Lire la carte
│   │   ├── level2/Level2.tsx  # Le profil du sentier
│   │   ├── level3/Level3.tsx  # La fenêtre 3×3
│   │   ├── level4/Level4.tsx  # Les coefficients
│   │   ├── level5/Level5.tsx  # Les bords de la carte
│   │   ├── level6/Level6.tsx  # L'atelier du cartographe
│   │   ├── level7/Level7.tsx  # La carte des pentes
│   │   ├── level8/Level8.tsx  # Quelle carte est-ce ?
│   │   ├── level9/Level9.tsx  # Le défi du guide
│   │   ├── level10/Level10.tsx# Convolution vs Corrélation & Composition
│   │   └── level11/Level11.tsx# Le Sommet (Examen 100 points)
│   ├── data/
│   │   └── texts.ts           # Unique source de vérité pour tous les textes en français
│   ├── hooks/
│   │   ├── useCanvasGrid.ts   # Logique de dessin et de coordonnées du canvas
│   │   └── useSound.ts        # Altimètre sonore Web Audio (désactivé par défaut)
│   ├── styles/
│   │   ├── tokens.ts          # Tokens (forêt, roche, neige, coucher de soleil)
│   │   └── global.css         # Import Tailwind et styles d'accessibilité
│   ├── __tests__/             # 54 tests Vitest
│   │   ├── core.test.ts       # Validation mathématique des filtres et modes de bord
│   │   └── advanced.test.ts   # Validation de l'examen, de la composition et des métriques
│   ├── App.tsx                # Shell de l'application et navigation
│   └── main.tsx               # Point d'entrée React 19
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** 20+ et **npm**

### Installation
```bash
npm install
```

### Commandes disponibles
| Commande | Action |
| :--- | :--- |
| `npm run dev` | Démarre le serveur local Vite en mode développement |
| `npm run build` | Compile TypeScript (`tsc`) et génère le bundle de production Vite |
| `npm run test` | Exécute les 54 tests unitaires avec Vitest |
| `npm run lint` | Analyse le code source avec ESLint |
| `npm run format` | Met en forme le code avec Prettier |
| `npm run preview` | Prévisualise localement le build de production |

---

## ♿ Accessibilité & Éthique Numérique

- **Clavier & Focus** : Navigation possible au clavier avec anneaux de focus contrastés (`outline: 3px solid var(--color-sunset-500)`).
- **Sensibilité au mouvement** : Respect strict de la directive système `prefers-reduced-motion` (désactivation de l'animation de balayage).
- **Environnement sonore respectueux** : Retour audio par synthèse Web Audio **désactivé par défaut**.
- **Honnêteté statistique** : Aucune fausse statistique générée ; le dénivelé et les fiches reflètent rigoureusement la progression réelle de l'utilisateur.

---

## 📄 Licence

Projet conçu à des fins éducatives et de vulgarisation scientifique.
Tous droits réservés © 2026 TrailKernel.
