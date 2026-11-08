/**
 * Typed LocalStorage persistence for TrailKernel gamification and progress.
 * Includes schema versioning, fault-tolerant try/catch, and reset controls.
 */

export const STORAGE_VERSION = 2;
export const STORAGE_KEY = 'trailkernel_progression_v2';
export const LEGACY_STORAGE_KEY_V1 = 'trailkernel_progression_v1';

export type HikerRank =
  'Marcheur' | 'Randonneur' | 'Alpiniste' | 'Guide de haute montagne';

export interface TrailKernelProgress {
  version: number;
  completedLevels: number[];
  elevationGainMeters: number; // D+ in meters (XP)
  unlockedNotebooks: number[];
  unlockedCards: number[]; // IDs of unlocked "Je retiens" pedagogical cards (1 to 5)
  examScore: number | null;
  lastActiveLevel: number;
}

export const DEFAULT_PROGRESS: TrailKernelProgress = {
  version: STORAGE_VERSION,
  completedLevels: [],
  elevationGainMeters: 0,
  unlockedNotebooks: [],
  unlockedCards: [],
  examScore: null,
  lastActiveLevel: 1,
};

/**
 * Determine hiker rank based on accumulated positive elevation gain (D+).
 */
export function getRankFromElevation(dPlus: number): {
  rank: HikerRank;
  badge: string;
  nextThreshold: number | null;
} {
  if (dPlus >= 1200) {
    return {
      rank: 'Guide de haute montagne',
      badge: '🎖️ Guide Suprême',
      nextThreshold: null,
    };
  }
  if (dPlus >= 700) {
    return { rank: 'Alpiniste', badge: '🧗 Alpiniste Chevronné', nextThreshold: 1200 };
  }
  if (dPlus >= 300) {
    return { rank: 'Randonneur', badge: '🥾 Randonneur Aguerri', nextThreshold: 700 };
  }
  return { rank: 'Marcheur', badge: '🌲 Marcheur Initié', nextThreshold: 300 };
}

/**
 * Load progress from localStorage with graceful migration from v1.
 */
export function loadProgress(): TrailKernelProgress {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...DEFAULT_PROGRESS };
  }

  try {
    // 1. Try reading current v2 storage
    const rawV2 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      const parsed = JSON.parse(rawV2) as Partial<TrailKernelProgress>;
      if (parsed.version === STORAGE_VERSION) {
        return {
          version: STORAGE_VERSION,
          completedLevels: Array.isArray(parsed.completedLevels)
            ? parsed.completedLevels
            : [],
          elevationGainMeters:
            typeof parsed.elevationGainMeters === 'number'
              ? parsed.elevationGainMeters
              : 0,
          unlockedNotebooks: Array.isArray(parsed.unlockedNotebooks)
            ? parsed.unlockedNotebooks
            : [],
          unlockedCards: Array.isArray(parsed.unlockedCards)
            ? parsed.unlockedCards
            : Array.isArray(parsed.completedLevels)
              ? parsed.completedLevels
              : [],
          examScore: typeof parsed.examScore === 'number' ? parsed.examScore : null,
          lastActiveLevel:
            typeof parsed.lastActiveLevel === 'number' ? parsed.lastActiveLevel : 1,
        };
      }
    }

    // 2. Fallback: migrate from legacy v1 storage if available
    const rawV1 = window.localStorage.getItem(LEGACY_STORAGE_KEY_V1);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1) as Record<string, unknown>;
      const completed = Array.isArray(parsedV1.completedLevels)
        ? (parsedV1.completedLevels as number[])
        : [];

      const migrated: TrailKernelProgress = {
        version: STORAGE_VERSION,
        completedLevels: completed,
        elevationGainMeters:
          typeof parsedV1.elevationGainMeters === 'number'
            ? parsedV1.elevationGainMeters
            : 0,
        unlockedNotebooks: Array.isArray(parsedV1.unlockedNotebooks)
          ? (parsedV1.unlockedNotebooks as number[])
          : completed,
        unlockedCards: completed, // auto-unlock cards for already completed levels
        examScore: typeof parsedV1.examScore === 'number' ? parsedV1.examScore : null,
        lastActiveLevel:
          typeof parsedV1.lastActiveLevel === 'number' ? parsedV1.lastActiveLevel : 1,
      };

      saveProgress(migrated);
      return migrated;
    }

    return { ...DEFAULT_PROGRESS };
  } catch (err) {
    console.warn('Unable to load TrailKernel progress from localStorage', err);
    return { ...DEFAULT_PROGRESS };
  }
}

/**
 * Save progress to localStorage safely.
 */
export function saveProgress(progress: TrailKernelProgress): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch (err) {
    console.warn('Unable to save TrailKernel progress to localStorage', err);
    return false;
  }
}

/**
 * Reset all saved progress to initial state.
 */
export function resetProgress(): TrailKernelProgress {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY_V1);
    } catch {
      // Ignore
    }
  }
  return { ...DEFAULT_PROGRESS };
}

/**
 * Mark a level complete and grant elevation gain (+D meters), unlock notebook entry and "Je retiens" card.
 */
export function grantLevelReward(
  current: TrailKernelProgress,
  levelId: number,
  elevationAward: number,
): TrailKernelProgress {
  const isAlreadyCompleted = current.completedLevels.includes(levelId);
  const nextCompleted = isAlreadyCompleted
    ? current.completedLevels
    : [...current.completedLevels, levelId];

  const nextNotebooks = current.unlockedNotebooks.includes(levelId)
    ? current.unlockedNotebooks
    : [...current.unlockedNotebooks, levelId];

  const nextCards = current.unlockedCards.includes(levelId)
    ? current.unlockedCards
    : [...current.unlockedCards, levelId];

  const nextElevation = isAlreadyCompleted
    ? current.elevationGainMeters
    : current.elevationGainMeters + elevationAward;

  const updated: TrailKernelProgress = {
    ...current,
    completedLevels: nextCompleted,
    elevationGainMeters: nextElevation,
    unlockedNotebooks: nextNotebooks,
    unlockedCards: nextCards,
    lastActiveLevel: levelId,
  };

  saveProgress(updated);
  return updated;
}
