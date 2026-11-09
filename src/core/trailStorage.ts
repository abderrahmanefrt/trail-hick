import type { SeasonId, UserProgress } from '@/types/trailvision';

const STORAGE_KEY = 'trailvision_expedition_v2';

const DEFAULT_PROGRESS: UserProgress = {
  version: 2,
  currentView: 'landing',
  activeSeason: 'spring',
  completedMissions: {
    spring: false,
    summer: false,
    fall: false,
    winter: false,
  },
  badges: {
    spring: false,
    summer: false,
    fall: false,
    winter: false,
  },
  elevationMeters: 0,
  revealUnlocked: false,
  soundEnabled: true,
};

export function loadTrailProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;

    const parsed = JSON.parse(raw) as Partial<UserProgress>;
    if (parsed.version !== 2) {
      return DEFAULT_PROGRESS;
    }

    const completed = {
      spring: Boolean(parsed.completedMissions?.spring),
      summer: Boolean(parsed.completedMissions?.summer),
      fall: Boolean(parsed.completedMissions?.fall),
      winter: Boolean(parsed.completedMissions?.winter),
    };

    const allDone = completed.spring && completed.summer && completed.fall && completed.winter;

    return {
      version: 2,
      currentView: parsed.currentView ?? 'landing',
      activeSeason: parsed.activeSeason ?? 'spring',
      completedMissions: completed,
      badges: {
        spring: Boolean(parsed.badges?.spring || completed.spring),
        summer: Boolean(parsed.badges?.summer || completed.summer),
        fall: Boolean(parsed.badges?.fall || completed.fall),
        winter: Boolean(parsed.badges?.winter || completed.winter),
      },
      elevationMeters: typeof parsed.elevationMeters === 'number' ? parsed.elevationMeters : 0,
      revealUnlocked: Boolean(parsed.revealUnlocked || allDone),
      soundEnabled: parsed.soundEnabled ?? true,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveTrailProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // LocalStorage quota or private mode protection
  }
}

export function completeSeasonMission(
  prev: UserProgress,
  season: SeasonId,
): UserProgress {
  const isFirstTime = !prev.completedMissions[season];
  const newCompleted = {
    ...prev.completedMissions,
    [season]: true,
  };
  const newBadges = {
    ...prev.badges,
    [season]: true,
  };

  const allCompleted =
    newCompleted.spring && newCompleted.summer && newCompleted.fall && newCompleted.winter;

  const updated: UserProgress = {
    ...prev,
    completedMissions: newCompleted,
    badges: newBadges,
    elevationMeters: isFirstTime ? prev.elevationMeters + 250 : prev.elevationMeters,
    revealUnlocked: prev.revealUnlocked || allCompleted,
  };

  saveTrailProgress(updated);
  return updated;
}

export function resetTrailProgress(): UserProgress {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return DEFAULT_PROGRESS;
}
