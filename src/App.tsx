import React, { useState, useEffect } from 'react';
import type { UserProgress, SeasonId, AppView } from '@/types/trailvision';
import { SEASONS, TRAILVISION_TEXT } from '@/data/trailvisionTexts';
import {
  loadTrailProgress,
  completeSeasonMission,
  resetTrailProgress,
  saveTrailProgress,
} from '@/core/trailStorage';
import { useSound } from '@/hooks/useSound';

import SeasonalParticles from '@/components/SeasonalParticles';
import Trailbot from '@/components/Trailbot';
import LandingHero from '@/components/LandingHero';
import SeasonSelector from '@/components/SeasonSelector';
import FinalReveal from '@/components/FinalReveal';

import SpringMission from '@/features/missions/SpringMission';
import SummerMission from '@/features/missions/SummerMission';
import FallMission from '@/features/missions/FallMission';
import WinterMission from '@/features/missions/WinterMission';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-amber-300 text-center space-y-4 shadow-xl">
          <span className="text-4xl">🏔️</span>
          <h2 className="text-xl font-black text-stone-900">Une pause sur le sentier !</h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Un imprévu est survenu lors de l'affichage de cette vue.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs uppercase cursor-pointer shadow-md"
            >
              Recharger l'Expédition
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App(): React.JSX.Element {
  const [progress, setProgress] = useState<UserProgress>(() => loadTrailProgress());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { enabled: soundEnabled, toggle: toggleSound, playSuccessChime } = useSound();

  // Keep progress in localStorage
  useEffect(() => {
    saveTrailProgress(progress);
  }, [progress]);

  const handleSelectSeason = (season: SeasonId) => {
    setProgress((prev) => ({
      ...prev,
      activeSeason: season,
      currentView: 'mission',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMissionCompleted = (season: SeasonId) => {
    playSuccessChime();
    setProgress((prev) => completeSeasonMission(prev, season));
  };

  const handleRestartFullAdventure = () => {
    setProgress((prev) => ({
      ...prev,
      completedMissions: {
        spring: false,
        summer: false,
        fall: false,
        winter: false,
      },
      activeSeason: 'spring',
      currentView: 'mission',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetCurrentMission = () => {
    setProgress((prev) => ({
      ...prev,
      completedMissions: {
        ...prev.completedMissions,
        [prev.activeSeason]: false,
      },
    }));
  };

  const handleReset = () => {
    const fresh = resetTrailProgress();
    setProgress(fresh);
    setShowResetConfirm(false);
  };

  const activeMeta = SEASONS[progress.activeSeason];
  const allCompleted =
    progress.completedMissions.spring &&
    progress.completedMissions.summer &&
    progress.completedMissions.fall &&
    progress.completedMissions.winter;

  const seasonsList: SeasonId[] = ['spring', 'summer', 'fall', 'winter'];
  const currentIndex = seasonsList.indexOf(progress.activeSeason);
  const nextSeason = seasonsList[(currentIndex + 1) % seasonsList.length];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-stone-900 font-sans flex flex-col selection:bg-amber-200">
      {/* Background Seasonal Particles */}
      <SeasonalParticles
        season={progress.currentView === 'mission' ? progress.activeSeason : 'spring'}
        density={24}
      />

      {/* Persistent Navigation Bar (Cinematic Expedition Topbar) */}
      <header className="sticky top-0 z-50 bg-[#16120E]/95 text-stone-100 border-b border-[#3B291D] backdrop-blur-md shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setProgress((p) => ({ ...p, currentView: 'landing' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl hover:scale-110 transition-transform cursor-pointer"
              aria-label="Return to Base Camp"
            >
              🏔️
            </button>
            <button
              type="button"
              onClick={() => {
                setProgress((p) => ({ ...p, currentView: 'landing' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group cursor-pointer"
            >
              <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight text-white group-hover:text-amber-400 transition-colors">
                {TRAILVISION_TEXT.app.title}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                {TRAILVISION_TEXT.app.tagline}
              </p>
            </button>
          </div>

          {/* Navigation Links & Expedition Stats */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* View links */}
            <div className="hidden sm:flex items-center gap-1 bg-stone-900/80 px-2 py-1 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setProgress((p) => ({ ...p, currentView: 'landing' }))}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  progress.currentView === 'landing'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {TRAILVISION_TEXT.app.navHome}
              </button>
              <button
                type="button"
                onClick={() => setProgress((p) => ({ ...p, currentView: 'seasons' }))}
                className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  progress.currentView === 'seasons'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {TRAILVISION_TEXT.app.navSeasons}
              </button>
              {(progress.revealUnlocked || allCompleted) && (
                <button
                  type="button"
                  onClick={() => setProgress((p) => ({ ...p, currentView: 'reveal' }))}
                  className={`px-3 py-1 rounded-lg font-black transition-colors cursor-pointer flex items-center gap-1 ${
                    progress.currentView === 'reveal'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-md'
                      : 'text-amber-300 hover:text-amber-200 animate-pulse'
                  }`}
                >
                  <span>✨</span>
                  <span>{TRAILVISION_TEXT.app.navReveal}</span>
                </button>
              )}
            </div>

            {/* Elevation Meter */}
            <div
              className="flex items-center gap-1.5 bg-[#251C15] px-3 py-1.5 rounded-xl border border-[#4A3728] text-stone-200 font-mono shadow-xs"
              title="Accumulated Expedition Elevation Gain"
            >
              <span className="text-amber-400 font-bold">▲</span>
              <span className="font-bold text-white">{progress.elevationMeters}</span>
              <span className="text-stone-400 text-[10px]">m D+</span>
            </div>

            {/* Badges Mini-Display */}
            <div className="flex items-center gap-1 bg-[#251C15] px-2 py-1.5 rounded-xl border border-[#4A3728]">
              {seasonsList.map((sid) => (
                <span
                  key={sid}
                  className={`text-xs transition-opacity ${
                    progress.badges[sid] ? 'opacity-100 scale-105' : 'opacity-25 grayscale'
                  }`}
                  title={`${SEASONS[sid].badgeName} (${progress.badges[sid] ? 'Earned' : 'Locked'})`}
                >
                  {SEASONS[sid].badgeIcon}
                </span>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-sm transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                  : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Disable expedition sound' : 'Enable expedition sound'}
              aria-label="Sound control"
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>

            {/* Reset Expedition */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-stone-900 transition-colors cursor-pointer"
              title="Reset Expedition Progress"
              aria-label="Reset Expedition"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 w-full">
        <ErrorBoundary>
          {progress.currentView === 'landing' && (
          <LandingHero
            progress={progress}
            onStartAdventure={() => {
              setProgress((p) => ({ ...p, activeSeason: 'spring', currentView: 'mission' }));
            }}
            onExploreSeasons={() => {
              setProgress((p) => ({ ...p, currentView: 'seasons' }));
            }}
            onSelectSeason={handleSelectSeason}
          />
        )}

        {progress.currentView === 'seasons' && (
          <SeasonSelector
            progress={progress}
            onSelectSeason={handleSelectSeason}
            onGoToReveal={() => setProgress((p) => ({ ...p, currentView: 'reveal' }))}
            onBackToHome={() => setProgress((p) => ({ ...p, currentView: 'landing' }))}
          />
        )}

        {progress.currentView === 'mission' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            {/* Mission Stage Header */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              {/* Breadcrumb & Navigation */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProgress((p) => ({ ...p, currentView: 'seasons' }))}
                    className="text-xs font-bold text-stone-500 hover:text-stone-900 cursor-pointer"
                  >
                    ← All Expeditions
                  </button>
                  <span className="text-stone-300">/</span>
                  <span
                    className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: activeMeta.colors.primary }}
                  >
                    {activeMeta.name} Expedition
                  </span>
                </div>

                {progress.completedMissions[progress.activeSeason] && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetCurrentMission}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-300 transition-colors cursor-pointer flex items-center gap-1"
                      title="Rejouer ce défi depuis le début"
                    >
                      <span>↺</span>
                      <span>Rejouer ce défi</span>
                    </button>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                      <span>✓</span>
                      <span>{activeMeta.badgeName} Unlocked</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Title & Atmosphere */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-serif italic text-stone-500">
                  <span>{activeMeta.badgeIcon}</span>
                  <span>« {activeMeta.heroTitle} »</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  {activeMeta.missionTitle}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-3xl leading-relaxed">
                  {activeMeta.description}
                </p>
              </div>
            </div>

            {/* Active Mission Interactive Component */}
            <div className="animate-in fade-in">
              {progress.activeSeason === 'spring' && (
                <SpringMission
                  key={`spring_${progress.completedMissions.spring ? 'done' : 'fresh'}`}
                  onComplete={() => handleMissionCompleted('spring')}
                  isCompleted={progress.completedMissions.spring}
                />
              )}

              {progress.activeSeason === 'summer' && (
                <SummerMission
                  key={`summer_${progress.completedMissions.summer ? 'done' : 'fresh'}`}
                  onComplete={() => handleMissionCompleted('summer')}
                  isCompleted={progress.completedMissions.summer}
                />
              )}

              {progress.activeSeason === 'fall' && (
                <FallMission
                  key={`fall_${progress.completedMissions.fall ? 'done' : 'fresh'}`}
                  onComplete={() => handleMissionCompleted('fall')}
                  isCompleted={progress.completedMissions.fall}
                />
              )}

              {progress.activeSeason === 'winter' && (
                <WinterMission
                  key={`winter_${progress.completedMissions.winter ? 'done' : 'fresh'}`}
                  onComplete={() => handleMissionCompleted('winter')}
                  isCompleted={progress.completedMissions.winter}
                />
              )}
            </div>

            {/* Mission Completion Banner & Next Trail Transition */}
            {progress.completedMissions[progress.activeSeason] && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/40 animate-in slide-in-from-bottom-3">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    🌿 Mission Completed!
                  </span>
                  <h4 className="text-xl font-black text-white">
                    You’ve Earned the {activeMeta.badgeName}!
                  </h4>
                  <p className="text-xs text-stone-300">
                    +250 m D+ Elevation gained. Your explorer senses are tuning into nature’s hidden geometry.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {allCompleted ? (
                    <button
                      type="button"
                      onClick={() => setProgress((p) => ({ ...p, currentView: 'reveal' }))}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>✨</span>
                      <span>Enter The Big Reveal</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectSeason(nextSeason!)}
                      className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Proceed to {SEASONS[nextSeason!].name}</span>
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

          {progress.currentView === 'reveal' && (
            <FinalReveal
              progress={progress}
              onRestartFullAdventure={handleRestartFullAdventure}
              onReplaySeasons={() => {
                setProgress((p) => ({ ...p, currentView: 'seasons' }));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectSeason={handleSelectSeason}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Floating Animated Companion: TRAILBOT */}
      <Trailbot
        season={progress.currentView === 'mission' ? progress.activeSeason : undefined}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4 text-stone-900">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-base font-black">Reset All Expedition Progress?</h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              This will clear all 4 seasonal achievement badges and reset your elevation to 0 m D+. You can start the expedition afresh.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
