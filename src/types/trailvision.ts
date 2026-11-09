/**
 * Core type definitions for TRAILVISION — The Hidden Science of Hiking.
 */

export type SeasonId = 'spring' | 'summer' | 'fall' | 'winter';

export type AppView = 'landing' | 'seasons' | 'mission' | 'reveal';

export interface SeasonalColors {
  main: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  badgeBg: string;
}

export interface SeasonMeta {
  id: SeasonId;
  name: string;
  missionTitle: string;
  tagline: string;
  heroTitle: string;
  description: string;
  environment: string;
  colors: SeasonalColors;
  badgeName: string;
  badgeIcon: string;
  accessoryName: string;
  educationalConceptPreview: string;
  scientificConceptRevealed: string;
  scientificExplanation: string;
}

export interface UserProgress {
  version: 2;
  currentView: AppView;
  activeSeason: SeasonId;
  completedMissions: Record<SeasonId, boolean>;
  badges: Record<SeasonId, boolean>;
  elevationMeters: number;
  revealUnlocked: boolean;
  soundEnabled: boolean;
}

export interface FlowerTarget {
  id: string;
  name: string;
  description: string;
  x: number; // 0..100 percentage
  y: number; // 0..100 percentage
  radius: number; // detection radius percentage
  found: boolean;
  color: string;
}

export interface TrailCheckpoint {
  id: string;
  label: string;
  x: number; // 0..100
  y: number; // 0..100
  visited: boolean;
}
