import type { SeasonId, SeasonMeta } from '@/types/trailvision';

export const SEASONS: Record<SeasonId, SeasonMeta> = {
  spring: {
    id: 'spring',
    name: 'Spring',
    missionTitle: 'The Flower Hunter',
    tagline: 'Discovering hidden patterns in nature',
    heroTitle: 'Every Detail Has a Secret',
    description:
      'Explore the awakening forest and discover the hidden patterns scattered throughout nature.',
    environment:
      'A lush spring alpine forest dense with emerald pine moss, blooming wildflowers, gentle morning sunbeams, and intricate organic textures.',
    colors: {
      main: '#E8F3E8',
      primary: '#79A98A',
      secondary: '#B7D7B0',
      accent: '#E6AFAF',
      text: '#263B2D',
      badgeBg: '#34523c',
    },
    badgeName: 'Spring Explorer',
    badgeIcon: '🌸',
    accessoryName: 'Wildflower Botanical Hat',
    educationalConceptPreview: 'Recognizing localized visual motifs in complex scenery',
    scientificConceptRevealed: 'Pattern Detection & Feature Extraction',
    scientificExplanation:
      'In computer vision, machines scan an image with small specialized templates. When the math under the window correlates strongly with the target shape, a feature is detected—just like your scanning lens found hidden flowers in the forest!',
  },
  summer: {
    id: 'summer',
    name: 'Summer',
    missionTitle: 'The Sunlight Explorer',
    tagline: 'Understanding brightness and image values',
    heroTitle: 'Chase the Light',
    description:
      'Follow the sun and discover how light transforms everything you see.',
    environment:
      'A sun-drenched canyon and alpine lake trail with turquoise waters, granite precipices, and dazzling solar illumination.',
    colors: {
      main: '#FFF3DC',
      primary: '#FFB347',
      secondary: '#FF7F50',
      accent: '#F4D35E',
      text: '#3B2922',
      badgeBg: '#7c3f15',
    },
    badgeName: 'Summer Light Seeker',
    badgeIcon: '☀️',
    accessoryName: 'Polarized Sunglasses & Safari Hat',
    educationalConceptPreview: 'Translating light levels into numerical matrices (0 to 255)',
    scientificConceptRevealed: 'Pixel Intensity & Digital Image Representation',
    scientificExplanation:
      'Computers don’t see colors or feelings—they see a grid of numbers. Black is 0, pure blinding white is 255, and every shade of grey or color is a number in between. Every image operation begins with these numerical values.',
  },
  fall: {
    id: 'fall',
    name: 'Fall',
    missionTitle: 'The Hidden Trail',
    tagline: 'Discovering boundaries and visual details',
    heroTitle: 'Find the Path Beneath the Leaves',
    description:
      'The forest hides its boundaries. Can you distinguish the trail from everything around it?',
    environment:
      'A cinematic autumn mountainside with golden larches, crimson maples, scattered stone boulders, and a trail masked by fallen leaves.',
    colors: {
      main: '#F3E5D0',
      primary: '#B86B3D',
      secondary: '#8C4A32',
      accent: '#D99A52',
      text: '#39251C',
      badgeBg: '#592917',
    },
    badgeName: 'Autumn Trail Detective',
    badgeIcon: '🍂',
    accessoryName: 'Cozy Checked Autumn Scarf',
    educationalConceptPreview: 'Identifying sharp transitions between neighboring surfaces',
    scientificConceptRevealed: 'Edge Detection & Gradient Operators (Sobel)',
    scientificExplanation:
      'Edges exist where pixel values change abruptly. By subtracting neighboring pixels from left-to-right (horizontal gradient) and top-to-bottom (vertical gradient), computer vision highlights contours and path boundaries while ignoring uniform surfaces.',
  },
  winter: {
    id: 'winter',
    name: 'Winter',
    missionTitle: 'The Frozen Vision',
    tagline: 'Image smoothing, blur and neighboring information',
    heroTitle: 'When the World Becomes Unclear',
    description:
      'Snow and fog change the way you see the mountain. Learn to explore through changing visibility.',
    environment:
      'A frozen high-altitude peak blanketed in powder snow, dense winter mist, pine silhouettes, and swirling crystalline blizzards.',
    colors: {
      main: '#EAF1F8',
      primary: '#6286A8',
      secondary: '#A8C5DF',
      accent: '#B8C8D9',
      text: '#192B40',
      badgeBg: '#213a52',
    },
    badgeName: 'Winter Vision Master',
    badgeIcon: '❄️',
    accessoryName: 'Thermal Beanie & High-Altitude Parka',
    educationalConceptPreview: 'Blending neighboring points to reduce noise and clarify structure',
    scientificConceptRevealed: 'Spatial Smoothing & Kernel Normalization',
    scientificExplanation:
      'Blizzard flurries act like digital sensor noise (grain). When you replace each pixel with a weighted average of its 8 immediate neighbors, isolated noisy specks vanish, producing a smooth image. Dividing by the total weight keeps the brightness balanced!',
  },
};

export const TRAILVISION_TEXT = {
  app: {
    title: 'TRAILVISION',
    tagline: 'Explore Nature. Discover How Machines See.',
    heroSubtitle: 'Four seasons. Four adventures. One extraordinary discovery.',
    heroDescription:
      'Embark on an interactive expedition through four seasonal mountain landscapes. Solve environmental mysteries, calibrate your senses to the wilderness, and uncover a profound secret hidden in plain sight.',
    startAdventure: 'START YOUR ADVENTURE',
    exploreSeasons: 'EXPLORE THE SEASONS',
    howToPlayBadge: 'TRAIL GUIDE',
    navHome: 'Base Camp',
    navSeasons: 'Seasons',
    navReveal: 'The Reveal',
    resetProgress: 'Reset Expedition',
  },
  companion: {
    name: 'TRAILBOT',
    role: 'Autonomous Expedition Guide',
    greetings: {
      welcome:
        "Greetings, Explorer! I'm TRAILBOT, your high-altitude hiking companion. Strap on your boots—nature has fascinating patterns to show us today!",
      spring:
        'Look at this spring forest! The ground seems chaotic, but look closely: nature repeats delicate geometric patterns everywhere.',
      summer:
        "Phew, high noon in the canyon! Look at that bright sun. Did you know our eyes and digital sensors quantify light in very specific ways?",
      fall:
        'Careful on this ridge! The fallen leaves hide the trail completely. We’ll need to spot subtle border differences to find the safe path.',
      winter:
        'Visibility is plunging! In this blizzard, isolated snowflakes create optical chaos. We need to average out the scene to see the refuge ahead.',
      reveal:
        'Hold on to your hiking poles! You haven’t just conquered four seasons of trails... You’ve secretly mastered the core foundation of Computer Vision!',
    },
    quips: [
      'Did you know alpine moss always grows thicker on the moist side of granite boulders?',
      'Always pack an extra layer in the mountains—light and weather shift in seconds!',
      'Look at your surroundings: even the grandest mountain is just a mosaic of tiny details.',
      'Checking my compass... All bearings indicate high curiosity ahead!',
    ],
  },
  reveal: {
    teaser1: "YOU'VE BEEN SEEING THE WORLD DIFFERENTLY…",
    teaser2: 'BUT DID YOU KNOW WHAT YOU JUST LEARNED?',
    bigWord: 'CONVOLUTION',
    subtitle: 'You have just experienced the fundamentals of convolution in computer vision.',
    narrative:
      'Throughout your four expeditions, you weren’t just playing outdoor games. You were intuitively calculating the exact matrix transformations that power autonomous vehicles, medical imaging, facial recognition, and satellite Earth observation.',
    interactiveLabTitle: 'The Interactive Kernel Laboratory',
    interactiveLabSubtitle:
      'See how a tiny 3×3 grid of numbers (called a Kernel) glides across an image, multiplying and summing neighboring pixels to transform the visual world.',
    filters: {
      blur: '🌫️ Smoothing Blur (Winter Box Filter)',
      gaussian: '🌥️ Soft Fog (Gaussian /16)',
      edge: '📐 Contour Detection (Fall Sobel)',
      sharpen: '🔭 Telescopic Sharpen (Spring Feature Boost)',
      emboss: '🌄 Mountain Hillshade (3D Relief)',
    },
    replayCta: 'EXPLORE THE SEASONS AGAIN',
    congratsTitle: 'EXPEDITION COMPLETE • MASTER COMPUTER VISIONARY',
  },
};
