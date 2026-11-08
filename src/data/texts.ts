/**
 * French UI texts for TrailKernel.
 * Essential 5-level pedagogical journey for Amine the hiker.
 * Strict vocabulary progression:
 * - "noyau" is ONLY used starting at Level 3.
 * - "convolution" is ONLY named explicitly at Level 5.
 */

export interface RecapCard {
  levelId: number;
  badge: string;
  title: string;
  takeaway: string;
}

export interface MiniQuestion {
  levelId: number;
  question: string;
  options: Array<{ id: string; label: string; correct: boolean }>;
  explanation: string;
}

export const T = {
  app: {
    title: 'TrailKernel',
    subtitle: 'La vision par ordinateur expliquée simplement à travers la montagne',
  },
  howToPlay: {
    badge: "💡 Le voyage d'Amine en 1 minute",
    title: 'Comment ça marche ?',
    step1Title: '1. Une image est une grille de nombres',
    step1Desc:
      'Chaque case (pixel) contient un nombre de 0 (vallée sombre) à 255 (sommet blanc éclatant).',
    step2Title: '2. La fenêtre 3×3 du marcheur',
    step2Desc:
      'À chaque pas, le marcheur regarde les 9 cases sous ses yeux (ses 8 voisins immédiats et ses pieds).',
    step3Title: '3. Le calcul pas à pas',
    step3Desc:
      'On multiplie par des poids, on additionne, et on divise : le nouveau paysage apparaît !',
  },
  nav: {
    levels: 'Sentier des 5 Idées Clés',
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
    complete: '✓ Étape franchie',
    start: "Démarrer l'étape",
    next: "Passer à l'étape suivante →",
    success: 'Refuge atteint !',
    tryAgain: 'Réessayer',
    difficulty: {
      easy: 'Étape 1',
      medium: 'Étape 2 & 3',
      hard: 'Étape 4 & 5',
    },
  },
  recapCards: [
    {
      levelId: 1,
      badge: 'Idée 1',
      title: 'Une image est une grille de nombres',
      takeaway: 'Une image est une grille de nombres (0 à 255).',
    },
    {
      levelId: 2,
      badge: 'Idée 2',
      title: 'Le calcul à partir des 8 voisins',
      takeaway:
        'Un nouveau pixel se calcule à partir de ses 8 voisins : multiplier, additionner, diviser.',
    },
    {
      levelId: 3,
      badge: 'Idée 3',
      title: 'Le rôle du noyau et du diviseur',
      takeaway:
        "Les coefficients (le noyau) décident de l'effet ; la division évite la saturation.",
    },
    {
      levelId: 4,
      badge: 'Idée 4',
      title: 'La détection des contours',
      takeaway:
        'Un autre noyau (Sobel) détecte les changements brusques, donc les contours.',
    },
    {
      levelId: 5,
      badge: 'Idée 5',
      title: 'La convolution enfin révélée',
      takeaway:
        "Une même opération avec des noyaux différents donne des effets différents : c'est la convolution.",
    },
  ] as readonly RecapCard[],
  miniQuestions: [
    {
      levelId: 1,
      question: "Qu'est-ce qu'une image numérique en noir et blanc pour l'ordinateur ?",
      options: [
        {
          id: 'a',
          label: 'Une simple grille de nombres allant de 0 à 255.',
          correct: true,
        },
        {
          id: 'b',
          label: "Un fichier texte avec des lettres de l'alphabet.",
          correct: false,
        },
        {
          id: 'c',
          label: 'Une couleur aléatoire sans rapport avec les cases voisines.',
          correct: false,
        },
      ],
      explanation:
        "Exact ! Chaque pixel est un simple nombre entre 0 (vallée d'ombre) et 255 (sommet enneigé).",
    },
    {
      levelId: 2,
      question:
        "Dans quel ordre calcule-t-on la nouvelle valeur d'un pixel central avec ses 8 voisins ?",
      options: [
        {
          id: 'a',
          label: 'On additionne les cases au hasard puis on soustrait 10.',
          correct: false,
        },
        {
          id: 'b',
          label:
            'On multiplie chaque case par son poids, on additionne tout, puis on divise.',
          correct: true,
        },
        {
          id: 'c',
          label: 'On garde uniquement le nombre le plus grand parmi les 8 voisins.',
          correct: false,
        },
      ],
      explanation:
        'Parfait ! Les 3 temps indispensables : multiplier, additionner, diviser.',
    },
    {
      levelId: 3,
      question: 'À quoi sert la division par la somme des coefficients du noyau ?',
      options: [
        { id: 'a', label: "Elle rend l'image complètement noire.", correct: false },
        {
          id: 'b',
          label:
            "Elle préserve l'équilibre moyen et évite la saturation en blanc total (255).",
          correct: true,
        },
        {
          id: 'c',
          label: "Elle modifie la taille de l'écran de l'ordinateur.",
          correct: false,
        },
      ],
      explanation:
        "Tout à fait ! Sans division, les 9 nombres additionnés dépassent 255 : c'est l'avalanche blanche.",
    },
    {
      levelId: 4,
      question:
        'Pourquoi le noyau de Sobel permet-il de repérer les falaises et contours ?',
      options: [
        {
          id: 'a',
          label:
            "Parce qu'il détecte les changements brusques de hauteur entre voisins opposés.",
          correct: true,
        },
        {
          id: 'b',
          label: "Parce qu'il efface tous les contrastes pour créer du brouillard.",
          correct: false,
        },
        { id: 'c', label: "Parce qu'il mesure la température de l'air.", correct: false },
      ],
      explanation:
        "Exact ! En soustrayant les voisins d'un côté à l'autre, toute cassure de pente abrupte est mise en valeur.",
    },
    {
      levelId: 5,
      question: "Finalement Amine, qu'est-ce que la convolution ?",
      options: [
        {
          id: 'a',
          label:
            'Une même opération de fenêtre glissante qui produit des effets différents selon le noyau choisi.',
          correct: true,
        },
        {
          id: 'b',
          label: 'Un simple effet de flou pour appareil photo.',
          correct: false,
        },
        { id: 'c', label: 'Un bogue de carte mémoire.', correct: false },
      ],
      explanation:
        "Bravo Amine ! La convolution est cette unique formule universelle qui transforme l'image selon le noyau utilisé.",
    },
  ] as readonly MiniQuestion[],
  finalSummary: {
    title: '🎓 Ce que tu sais maintenant, Amine !',
    subtitle:
      'Tu as commencé la marche sans rien connaître. Regarde tout le chemin parcouru :',
    congrats:
      "Tu maîtrises maintenant le cœur mathématique de la vision par ordinateur et du traitement d'image numérique !",
    replayButton: 'Revoir le sentier',
    openCarnet: 'Ouvrir mon carnet de rando 📓',
  },
  levels: [
    {
      id: 1,
      title: '🗺️ 1. Lire la carte (Pixel = Altitude)',
      difficulty: 'Idée 1/5',
      objective:
        "Comprendre qu'une image en noir et blanc est juste une grille de nombres",
      instructions:
        '🎯 MISSION : Cliquez sur 6 cases différentes de la carte pour mesurer leur altitude.',
      description:
        "Chaque case est un pixel contenant une valeur de 0 à 255. 0 est une vallée d'ombre, 255 est un pic enneigé. L'altimètre sonore monte dans les aigus quand vous grimpez vers un sommet !",
      successMessage:
        "Bravo Amine ! Tu as compris qu'une image numérique est une simple grille de nombres.",
      requiredClicks: 6,
    },
    {
      id: 2,
      title: '🔭 2. La fenêtre 3×3 (Calculer un pixel)',
      difficulty: 'Idée 2/5',
      objective: 'Calculer un nouveau pixel à partir de ses 8 voisins immédiats',
      instructions:
        '🎯 MISSION : Cliquez sur une case pour poser le marcheur, observez ses 8 voisins, puis cliquez sur « Valider le calcul » (faites 4 cases).',
      description:
        'Pour chaque case, on regarde le carré 3×3 centré sur elle. On multiplie chaque voisin par le coefficient correspondant, on fait la somme des 9 résultats, et on divise par 9 pour obtenir la moyenne.',
      successMessage:
        'Félicitations ! Tu as compris la règle des 8 voisins : multiplier, additionner, diviser.',
      requiredCalc: 4,
    },
    {
      id: 3,
      title: '⚖️ 3. Poids, Noyau & Saturation',
      difficulty: 'Idée 3/5',
      objective:
        "Comprendre que les coefficients (le noyau) décident de l'effet, et que la division évite la saturation",
      instructions:
        "🎯 MISSION : Comparez le flou uniforme et le flou gaussien, testez l'effet sans diviseur (saturation blanche), puis répondez aux 3 questions.",
      description:
        "Ce petit tableau de coefficients s'appelle le noyau ! Si tous les poids sont égaux, on obtient un brouillard. Si le centre pèse plus lourd, les détails résistent. Et si on oublie de diviser par la somme des poids... tout devient blanc (255) !",
      successMessage:
        "Parfait ! Tu comprends le rôle du noyau et pourquoi la division évite l'avalanche blanche.",
      requiredPredictions: 3,
    },
    {
      id: 4,
      title: '📐 4. Détecter les Falaises (Noyau de Sobel)',
      difficulty: 'Idée 4/5',
      objective:
        'Utiliser un autre noyau (Sobel) pour détecter les changements brusques et trouver les contours',
      instructions:
        '🎯 MISSION : Observez les pentes Est-Ouest et Nord-Sud, puis cliquez sur la falaise rouge écarlate.',
      description:
        "Quand l'altitude change brusquement entre voisins, le sol est raide ! Un autre noyau, le noyau de Sobel, mesure la pente horizontale et verticale. La formule √(Gx² + Gy²) fait ressortir les falaises et les contours en rouge vif.",
      successMessage:
        "Impressionnant ! Tu sais maintenant qu'un autre noyau peut détecter les contours.",
    },
    {
      id: 5,
      title: "🛠️ 5. L'Atelier du Cartographe : La Convolution !",
      difficulty: 'Idée 5/5',
      objective:
        "Comprendre qu'une même opération avec des noyaux différents donne des effets différents : c'est la convolution",
      instructions:
        '🎯 MISSION : Testez au moins 3 outils différents (Brouillard, Jumelles, Crêtes, Ombrage...) sur le massif de votre choix.',
      description:
        "Regardez bien : le mécanisme de calcul est toujours exactement le même ! C'est en changeant simplement les 9 chiffres du noyau qu'on obtient du flou, du contraste, des crêtes ou du relief 3D. Cette opération universelle s'appelle la CONVOLUTION !",
      successMessage:
        "Sommet conquis ! Tu connais maintenant le grand secret de la convolution d'image.",
      requiredFilters: 3,
    },
  ],
  notebook: [
    {
      levelId: 1,
      title: 'Modèles Numériques de Terrain (MNT / DEM)',
      category: 'Topographie IGN & Satellites',
      application:
        "L'IGN et les satellites spatiaux cartographient la Terre sous forme de matrices de pixels où chaque valeur représente l'altitude réelle en mètres.",
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
        "La division par la somme des poids évite l'éblouissement du capteur sur les névés et les glaciers, conservant les nuances du relief.",
      icon: '☀️',
    },
    {
      levelId: 4,
      title: "Cartographie des Risques d'Avalanches",
      category: 'Sécurité en montagne',
      application:
        "Le gradient de Sobel calcule la raideur exacte du terrain : toute pente supérieure à 30° est immédiatement identifiée comme couloir d'avalanche potentiel.",
      icon: '⚠️',
    },
    {
      levelId: 5,
      title: 'Deep Learning & Réseaux Convolutifs (CNN)',
      category: 'Intelligence Artificielle',
      application:
        "Les voitures autonomes et les logiciels d'analyse satellite empilent des dizaines de filtres de convolution 3×3 pour reconnaître routes, roches et forêts.",
      icon: '🧠',
    },
  ],
  filters: {
    boxBlur: {
      name: '🌫️ Brouillard (Box Blur /9)',
      description:
        'Moyenne uniforme 3×3 : tous les voisins ont le même poids (diviseur 9). Adoucit le relief.',
    },
    gaussian: {
      name: '🌥️ Brume légère (Gaussien /16)',
      description:
        'Noyau pondéré [1,2,1, 2,4,2, 1,2,1]/16 : le centre prédomine sur les coins.',
    },
    sharpen: {
      name: '🔭 Jumelles (Netteté)',
      description:
        'Accentue les contrastes locaux en renforçant le centre et en soustrayant les 4 voisins directs.',
    },
    laplacian: {
      name: '🏔️ Crêtes & falaises (Laplacien)',
      description:
        'Détecte les ruptures de pente dans toutes les directions. Un plateau uniforme donne 0.',
    },
    emboss: {
      name: '🌄 Ombrage du relief (Emboss)',
      description:
        'Simule une lumière rasante du soleil couchant. Décalage +128 pour centrer la visualisation.',
    },
    sobelX: {
      name: '↔️ Pentes Est-Ouest (Sobel X)',
      description:
        'Dérivée partielle horizontale : met en valeur les versants verticaux orientés est/ouest.',
    },
    sobelY: {
      name: '↕️ Pentes Nord-Sud (Sobel Y)',
      description:
        'Dérivée partielle verticale : met en valeur les versants horizontaux orientés nord/sud.',
    },
    slope: {
      name: '📐 Carte des pentes (Sobel Magnitude)',
      description:
        'Magnitude totale du gradient sqrt(gx² + gy²) : les falaises abruptes sont rouges, les plaines vertes.',
    },
  },
  borderModes: {
    clamp: {
      name: 'Répéter (Clamp)',
      description:
        "Les pixels de lisière sont recopiés vers l'extérieur. Évite les artefacts de contour artificiel.",
    },
    zero: {
      name: 'Zéro (Bord noir)',
      description:
        "L'extérieur est considéré comme une altitude nulle (fond d'abîme). Crée un encadrement sombre.",
    },
    wrap: {
      name: 'Boucler (Wrap / Tore)',
      description:
        'La carte se raccorde sur elle-même : le bord gauche lit les coordonnées du bord droit.',
    },
  },
  calculator: {
    title: 'Calcul pas à pas du pixel',
    direction: 'Orientation',
    pixel: 'Altitude voisine',
    coeff: 'Coeff.',
    product: 'Produit',
    sum: 'Somme des 9 produits',
    divided: '÷ Diviseur',
    offset: "+ Décalage d'affichage",
    clamped: 'Valeur finale écrêtée [0, 255]',
    result: 'Altitude résultante',
  },
  sound: {
    enable: "🔊 Activer l'altimètre sonore",
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
      "« Une image n'est pas un dessin magique, c'est juste un tableau de nombres représentant la hauteur du sol ! »",
      "« Regarde bien tes 8 voisins : multiplier, additionner, diviser, c'est la clé de toute la vision numérique. »",
      "« Ne marche jamais sans diviseur sur ton noyau, sous peine d'avalanche de saturation blanche ! »",
      "« Quand la hauteur change d'un coup sec, Sobel s'allume en rouge : attention aux falaises ! »",
    ],
  },
  home: {
    heroTitle: "Le Parcours d'Amine : La Convolution en 5 Idées Simples",
    heroSubtitle:
      'Tu ne connais rien à la convolution ? Parfait ! Suis Bastien le Guide sur le sentier : chaque refuge te fera comprendre une seule idée essentielle.',
    startTrail: "Démarrer l'Étape 1 : La Carte",
    continueTrail: 'Continuer le sentier',
    readNotebook: 'Voir mon carnet de rando 📓',
    demoCaption:
      'Regarde le carré 3×3 bouger : il lit les 9 altitudes locales pour calculer le nouveau paysage !',
  },
} as const;
