/**
 * French UI texts for TrailKernel.
 * Essential 5-level curriculum for fast and intuitive understanding.
 */

export const T = {
  app: {
    title: 'TrailKernel',
    subtitle: 'La convolution d\'image expliquée simplement par la montagne',
  },
  howToPlay: {
    badge: '💡 Comprendre la convolution en 1 minute chrono',
    title: 'Comment ça marche ?',
    step1Title: '1. Une image est une carte d\'altitude',
    step1Desc: 'Chaque case (pixel) contient un nombre de 0 (fond de vallée sombre) à 255 (sommet blanc éclatant).',
    step2Title: '2. La loupe 3×3 du randonneur',
    step2Desc: 'À chaque pas, le marcheur regarde les 9 cases autour de lui (ses 8 voisins immédiats et ses pieds).',
    step3Title: '3. Le calcul de convolution',
    step3Desc: 'On multiplie chaque voisin par un poids, on additionne tout, et on divise : le nouveau point est né !',
  },
  nav: {
    levels: 'Sentier des 5 Essentiels',
    progress: 'Votre progression',
    notebook: 'Carnet de rando',
    home: 'Accueil',
    reset: 'Réinitialiser',
  },
  gamification: {
    dPlus: 'Dénivelé positif (D+)',
    rank: 'Rang montagnard',
    nextRankAt: 'Prochain rang à',
    maxRank: 'Guide Suprême atteint !',
    completedCount: 'Étapes validées',
    elevationUnit: 'm D+',
  },
  level: {
    locked: '🔒 Étape suivante verrouillée',
    complete: '✓ Étape validée',
    start: 'Démarrer l\'étape',
    next: 'Passer à l\'étape suivante →',
    success: 'Objectif atteint !',
    tryAgain: 'Réessayer',
    difficulty: {
      easy: 'Étape 1',
      medium: 'Étape 2 & 3',
      hard: 'Étape 4 & 5',
    },
  },
  levels: [
    {
      id: 1,
      title: '🗺️ 1. Lire la carte (Pixel = Altitude)',
      difficulty: 'Les bases',
      objective: 'Comprendre qu\'une image en noir et blanc est juste une grille de nombres',
      instructions: '🎯 VOTRE MISSION : Cliquez sur 6 cases différentes de la carte pour mesurer leur altitude.',
      description:
        'Chaque case est un pixel contenant une valeur de 0 à 255. 0 est une vallée d\'ombre, 255 est un pic enneigé. L\'altimètre sonore monte dans les aigus quand vous montez en altitude !',
      successMessage: 'Bravo ! Vous comprenez qu\'une image numérique est une simple matrice de nombres.',
      requiredClicks: 6,
    },
    {
      id: 2,
      title: '🔭 2. La fenêtre 3×3 (Le Cœur du Calcul)',
      difficulty: 'Le calcul',
      objective: 'Comprendre comment la convolution calcule un nouveau pixel à partir de ses 9 voisins',
      instructions: '🎯 VOTRE MISSION : Cliquez sur une case pour poser le marcheur, observez ses 9 voisins, puis cliquez sur « Valider le calcul » (faites 4 cases).',
      description:
        'Pour chaque pixel, on regarde le carré 3×3 centré sur lui. On multiplie chaque voisin par le coefficient du masque, on fait la somme des 9 résultats, et on divise par 9 pour obtenir la moyenne.',
      successMessage: 'Félicitations ! Vous maîtrisez la fenêtre glissante 3×3 : c\'est le cœur de toute convolution !',
      requiredCalc: 4,
    },
    {
      id: 3,
      title: '⚖️ 3. Flou, Poids & Saturation',
      difficulty: 'Les filtres',
      objective: 'Découvrir comment les poids transforment l\'image et pourquoi le diviseur est vital',
      instructions: '🎯 VOTRE MISSION : Comparez le flou uniforme et le flou gaussien, testez l\'effet sans diviseur (saturation blanche), puis répondez aux 3 questions.',
      description:
        'Si les 9 poids sont égaux, on obtient un brouillard uniforme. Si le centre pèse plus lourd (Gaussien /16), les détails résistent mieux. Et si on oublie de diviser par la somme des poids... tout devient blanc (255) !',
      successMessage: 'Vous comprenez le rôle fondamental du diviseur et de la pondération des coefficients.',
      requiredPredictions: 3,
    },
    {
      id: 4,
      title: '📐 4. Détecter les Falaises (Sobel & Pentes)',
      difficulty: 'Détection',
      objective: 'Utiliser la dérivée pour repérer les pentes raides et les corniches abruptes',
      instructions: '🎯 VOTRE MISSION : Observez la décomposition Est-Ouest et Nord-Sud, puis cliquez sur la zone rouge écarlate (la falaise la plus abrupte).',
      description:
        'Quand l\'altitude change brusquement entre deux voisins, le sol est raide ! Le filtre de Sobel calcule la pente horizontale (Gx) et verticale (Gy). La formule √(Gx² + Gy²) allume les falaises dangereuses en rouge vif.',
      successMessage: 'Impressionnant ! Vous savez utiliser la convolution pour isoler les ruptures de pente.',
    },
    {
      id: 5,
      title: '🛠️ 5. L\'Atelier Libre du Cartographe',
      difficulty: 'Expérimentation',
      objective: 'Manipuler librement tous les outils de cartographie ou forger votre propre noyau',
      instructions: '🎯 VOTRE MISSION : Testez au moins 3 outils différents (Brouillard, Jumelles, Crêtes, Ombrage...) sur le massif de votre choix.',
      description:
        'Brouillard pour adoucir, jumelles pour contraster, laplacien pour les lignes de crête, ombrage 3D pour la lumière rasante... Vous avez maintenant tous les outils du cartographe entre les mains !',
      successMessage: 'Sommet conquis ! Vous avez exploré l\'ensemble des concepts clés de la convolution d\'image.',
      requiredFilters: 3,
    },
  ],
  notebook: [
    {
      levelId: 1,
      title: 'Modèles Numériques de Terrain (MNT / DEM)',
      category: 'Topographie IGN & Satellites',
      application:
        'L\'IGN et les satellites spatiaux cartographient la Terre sous forme de matrices de pixels où chaque valeur représente l\'altitude réelle en mètres.',
      icon: '🛰️',
    },
    {
      levelId: 2,
      title: 'Vision par ordinateur & Caméras embarquées',
      category: 'Drones & Robotique alpine',
      application:
        'Les caméras des drones de secours en montagne balayent le sol case par case (fenêtres 3×3) pour repérer des anomalies ou des crevasses en direct.',
      icon: '🚁',
    },
    {
      levelId: 3,
      title: 'Radiométrie & Saturation de capteurs',
      category: 'Optique spatiale',
      application:
        'La division par la somme des poids évite l\'éblouissement du capteur sur les névés et les glaciers, conservant les nuances du relief.',
      icon: '☀️',
    },
    {
      levelId: 4,
      title: 'Cartographie des Risques d\'Avalanches',
      category: 'Sécurité en montagne',
      application:
        'Le gradient de Sobel calcule la raideur exacte du terrain : toute pente supérieure à 30° est immédiatement identifiée comme couloir d\'avalanche potentiel.',
      icon: '⚠️',
    },
    {
      levelId: 5,
      title: 'Deep Learning & Réseaux Convolutifs (CNN)',
      category: 'Intelligence Artificielle',
      application:
        'Les voitures autonomes et les logiciels d\'analyse satellite empilent des dizaines de filtres de convolution 3×3 pour reconnaître routes, roches et forêts.',
      icon: '🧠',
    },
  ],
  filters: {
    boxBlur: {
      name: '🌫️ Brouillard (Box Blur /9)',
      description: 'Moyenne uniforme 3×3 : tous les voisins ont le même poids (diviseur 9). Adoucit le relief.',
    },
    gaussian: {
      name: '🌥️ Brume légère (Gaussien /16)',
      description: 'Noyau pondéré [1,2,1, 2,4,2, 1,2,1]/16 : le centre prédomine sur les coins.',
    },
    sharpen: {
      name: '🔭 Jumelles (Netteté)',
      description: 'Accentue les contrastes locaux en renforçant le centre et en soustrayant les 4 voisins directs.',
    },
    laplacian: {
      name: '🏔️ Crêtes & falaises (Laplacien)',
      description: 'Détecte les ruptures de pente dans toutes les directions. Un plateau uniforme donne 0.',
    },
    emboss: {
      name: '🌄 Ombrage du relief (Emboss)',
      description: 'Simule une lumière rasante du soleil couchant. Décalage +128 pour centrer la visualisation.',
    },
    sobelX: {
      name: '↔️ Pentes Est-Ouest (Sobel X)',
      description: 'Dérivée partielle horizontale : met en valeur les versants verticaux orientés est/ouest.',
    },
    sobelY: {
      name: '↕️ Pentes Nord-Sud (Sobel Y)',
      description: 'Dérivée partielle verticale : met en valeur les versants horizontaux orientés nord/sud.',
    },
    slope: {
      name: '📐 Carte des pentes (Sobel Magnitude)',
      description: 'Magnitude totale du gradient sqrt(gx² + gy²) : les falaises abruptes sont rouges, les plaines vertes.',
    },
  },
  borderModes: {
    clamp: {
      name: 'Répéter (Clamp)',
      description: 'Les pixels de lisière sont recopiés vers l\'extérieur. Évite les artefacts de contour artificiel.',
    },
    zero: {
      name: 'Zéro (Bord noir)',
      description: 'L\'extérieur est considéré comme une altitude nulle (fond d\'abîme). Crée un encadrement sombre.',
    },
    wrap: {
      name: 'Boucler (Wrap / Tore)',
      description: 'La carte se raccorde sur elle-même : le bord gauche lit les coordonnées du bord droit.',
    },
  },
  calculator: {
    title: 'Calcul pas à pas du pixel',
    direction: 'Orientation',
    pixel: 'Altitude voisine',
    coeff: 'Coeff. noyau',
    product: 'Produit pondéré',
    sum: 'Somme des 9 produits',
    divided: '÷ Diviseur',
    offset: '+ Décalage d\'affichage',
    clamped: 'Valeur finale écrêtée [0, 255]',
    result: 'Altitude résultante',
  },
  sound: {
    enable: '🔊 Activer l\'altimètre sonore',
    disable: '🔇 Couper le son',
  },
  contours: {
    toggle: 'Palette topo / Niveaux de gris',
  },
  quiz: {
    higher: 'Plus haut',
    lower: 'Plus bas',
    same: 'Identique',
    correct: '✓ Exact !',
    wrong: '✗ Pas tout à fait.',
  },
  mascot: {
    name: 'Bastien le Guide',
    role: 'Guide de haute montagne',
    tips: [
      '« Une image n\'est pas un dessin magique, c\'est juste un tableau de nombres représentant la hauteur du sol ! »',
      '« La convolution 3×3, c\'est comme poser une petite tente de 9 places sur le terrain et faire la moyenne de ceux qui y dorment. »',
      '« Ne marchez jamais sans diviseur sur vos coefficients, sous peine d\'avalanche de saturation blanche ! »',
      '« Quand la pente change d\'un coup sec, Sobel s\'allume en rouge : attention aux falaises ! »',
    ],
  },
  home: {
    heroTitle: 'Comprendre la Convolution en 5 Étapes Simples',
    heroSubtitle:
      'Pas besoin d\'être fort en maths ! Découvrez pas à pas comment une image est filtrée, lissée ou contrastée, comme un randonneur arpentant une carte de montagne.',
    startTrail: 'Démarrer l\'étape 1 : La Carte',
    continueTrail: 'Continuer le sentier',
    readNotebook: 'Voir les applications réelles (Carnet)',
    demoCaption: 'Regardez le carré 3×3 bouger : il lit les 9 altitudes locales pour calculer la nouvelle carte !',
  },
} as const;
