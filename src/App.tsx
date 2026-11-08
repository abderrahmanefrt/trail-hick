import React, { useState, useMemo, useEffect } from 'react';
import { T } from '@/data/texts';
import ProgressTrail, { type TrailStage } from '@/components/ProgressTrail';
import CarnetModal from '@/components/CarnetModal';
import HomeHero from '@/components/HomeHero';
import JeRetiensCard from '@/components/JeRetiensCard';
import FinalRecapScreen from '@/components/FinalRecapScreen';

import Level1 from '@/features/level1/Level1';
import Level3 from '@/features/level3/Level3';
import Level4 from '@/features/level4/Level4';
import Level7 from '@/features/level7/Level7';
import Level6 from '@/features/level6/Level6';

import {
  loadProgress,
  resetProgress,
  grantLevelReward,
  getRankFromElevation,
  type TrailKernelProgress,
} from '@/core/storage';

const ELEVATION_PER_LEVEL = 250;

export default function App(): React.JSX.Element {
  const [progress, setProgress] = useState<TrailKernelProgress>(() => loadProgress());
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [view, setView] = useState<'home' | 'trail'>('home');
  const [isCarnetOpen, setIsCarnetOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [answeredMiniQuestions, setAnsweredMiniQuestions] = useState<
    Record<number, boolean>
  >({});

  // Sync state if initial storage loads
  useEffect(() => {
    if (
      progress.lastActiveLevel &&
      progress.lastActiveLevel >= 1 &&
      progress.lastActiveLevel <= T.levels.length
    ) {
      setCurrentLevelId(progress.lastActiveLevel);
    }
  }, [progress.lastActiveLevel]);

  const handleLevelComplete = (id: number) => {
    setProgress((prev) => grantLevelReward(prev, id, ELEVATION_PER_LEVEL));
  };

  const handleStartFromHome = (targetLevelId: number) => {
    const validId = Math.min(Math.max(1, targetLevelId), T.levels.length);
    setCurrentLevelId(validId);
    setView('trail');
  };

  const handleReset = () => {
    const fresh = resetProgress();
    setProgress(fresh);
    setCurrentLevelId(1);
    setAnsweredMiniQuestions({});
    setView('home');
    setShowResetConfirm(false);
  };

  const stages: TrailStage[] = useMemo(() => {
    return T.levels.map((lvl, index) => {
      const isComplete = progress.completedLevels.includes(lvl.id);
      const isUnlocked =
        index === 0 || progress.completedLevels.includes(T.levels[index - 1]?.id ?? 0);

      return {
        id: lvl.id,
        title: lvl.title,
        difficulty: lvl.difficulty,
        complete: isComplete,
        unlocked: isUnlocked,
      };
    });
  }, [progress.completedLevels]);

  const currentLevelData = T.levels.find((lvl) => lvl.id === currentLevelId);
  const isCurrentComplete = progress.completedLevels.includes(currentLevelId);
  const isQuestionAnswered = Boolean(
    answeredMiniQuestions[currentLevelId] ||
    (isCurrentComplete && progress.completedLevels.includes(currentLevelId + 1)),
  );

  const nextLevelId = currentLevelId + 1;
  const hasNext = nextLevelId <= T.levels.length;
  const canGoNext = hasNext && isCurrentComplete && isQuestionAnswered;

  const currentRecapCard = T.recapCards.find((c) => c.levelId === currentLevelId);
  const currentMiniQuestion = T.miniQuestions.find((q) => q.levelId === currentLevelId);

  const rankInfo = getRankFromElevation(progress.elevationGainMeters);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col text-stone-900 font-sans selection:bg-orange-200">
      {/* Top Alpine Header */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView('home')}
              className="text-2xl hover:scale-110 transition-transform cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              🏔️
            </button>
            <div>
              <button
                type="button"
                onClick={() => setView('home')}
                className="text-left cursor-pointer group"
              >
                <h1 className="text-lg font-black tracking-tight leading-tight text-white group-hover:text-orange-400 transition-colors">
                  {T.app.title}
                </h1>
                <p className="text-[11px] text-stone-400 hidden sm:block">
                  {T.app.subtitle}
                </p>
              </button>
            </div>
          </div>

          {/* Gamification Bar & Actions */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-xs font-mono">
            {/* Elevation gain badge */}
            <div
              className="flex items-center gap-1.5 bg-stone-800/90 px-3 py-1.5 rounded-lg border border-stone-700 text-stone-200"
              title="Dénivelé positif accumulé (XP)"
            >
              <span className="text-orange-400 font-bold">▲</span>
              <span className="font-bold text-white">{progress.elevationGainMeters}</span>
              <span className="text-stone-400 text-[10px]">m D+</span>
            </div>

            {/* Rank badge */}
            <div
              className="hidden md:flex items-center gap-1 bg-stone-800/90 px-3 py-1.5 rounded-lg border border-stone-700 text-stone-300 font-sans font-semibold"
              title="Votre rang d'alpiniste"
            >
              <span>{rankInfo.badge}</span>
            </div>

            {/* Carnet de Rando trigger */}
            <button
              type="button"
              onClick={() => setIsCarnetOpen(true)}
              className="px-3 py-1.5 rounded-lg font-sans font-semibold text-xs bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Ouvrir le carnet de rando"
            >
              <span>📓</span>
              <span className="hidden sm:inline">{T.nav.notebook}</span>
            </button>

            {/* Home / Trail Toggle */}
            <button
              type="button"
              onClick={() => setView((v) => (v === 'home' ? 'trail' : 'home'))}
              className="px-3 py-1.5 rounded-lg font-sans font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer"
            >
              {view === 'home' ? 'Sentier (5 étapes) →' : 'Accueil'}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors cursor-pointer"
              title="Réinitialiser la progression"
              aria-label="Réinitialiser la progression"
            >
              🔄
            </button>
          </div>
        </div>
      </header>

      {/* Progress Trail Bar (Always accessible when in trail view) */}
      {view === 'trail' && (
        <div className="bg-white border-b border-stone-200 shadow-xs">
          <div className="max-w-6xl mx-auto px-2">
            <ProgressTrail
              stages={stages}
              currentId={currentLevelId}
              onSelect={(id) => setCurrentLevelId(id)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 py-6 w-full flex-1">
        {/* Onboarding Guide Box (Always accessible) */}
        {showHowToPlay && (
          <div className="mb-6 rounded-2xl bg-amber-50/80 border border-amber-300/80 p-4 sm:p-5 shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
                {T.howToPlay.badge}
              </span>
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="text-xs text-amber-700 hover:text-amber-950 font-bold px-2 py-0.5 rounded cursor-pointer"
                title="Masquer le guide"
              >
                ✕ Masquer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-amber-950">
              <div className="p-3 bg-white/80 rounded-xl border border-amber-200 space-y-1">
                <p className="font-bold text-amber-900">{T.howToPlay.step1Title}</p>
                <p className="text-stone-600 leading-relaxed">{T.howToPlay.step1Desc}</p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200 space-y-1">
                <p className="font-bold text-amber-900">{T.howToPlay.step2Title}</p>
                <p className="text-stone-600 leading-relaxed">{T.howToPlay.step2Desc}</p>
              </div>

              <div className="p-3 bg-white/80 rounded-xl border border-amber-200 space-y-1">
                <p className="font-bold text-amber-900">{T.howToPlay.step3Title}</p>
                <p className="text-stone-600 leading-relaxed">{T.howToPlay.step3Desc}</p>
              </div>
            </div>
          </div>
        )}

        {view === 'home' ? (
          <HomeHero
            progress={progress}
            onStart={handleStartFromHome}
            onOpenNotebook={() => setIsCarnetOpen(true)}
          />
        ) : (
          currentLevelData && (
            <section className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-6">
              {/* Level header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-md">
                      Refuge {currentLevelData.id} / {T.levels.length} —{' '}
                      {currentLevelData.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500 font-bold">
                      +{ELEVATION_PER_LEVEL} m D+
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-stone-800 tracking-tight">
                    {currentLevelData.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Objectif : {currentLevelData.objective}
                  </p>

                  {/* Explicit Mission Instruction */}
                  <div className="mt-2 p-2.5 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-950 flex items-center gap-2">
                    <span>👉</span>
                    <span>{currentLevelData.instructions}</span>
                  </div>
                </div>

                {isCurrentComplete && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-bold shadow-xs">
                    <span>✓</span>
                    <span>{T.level.complete}</span>
                  </div>
                )}
              </div>

              {/* Success celebration banner */}
              {isCurrentComplete && currentLevelData.successMessage && (
                <div className="rounded-xl bg-green-50 border border-green-300 p-4 text-xs sm:text-sm font-medium text-green-900 flex items-center gap-2.5 shadow-xs">
                  <span className="text-xl shrink-0" role="img" aria-hidden="true">
                    🎉
                  </span>
                  <div>
                    <strong>{T.level.success}</strong> {currentLevelData.successMessage}
                  </div>
                </div>
              )}

              {/* Active Level Feature Component */}
              <div className="py-2">
                {currentLevelId === 1 && (
                  <Level1 onComplete={() => handleLevelComplete(1)} />
                )}
                {currentLevelId === 2 && (
                  <Level3 onComplete={() => handleLevelComplete(2)} />
                )}
                {currentLevelId === 3 && (
                  <Level4 onComplete={() => handleLevelComplete(3)} />
                )}
                {currentLevelId === 4 && (
                  <Level7 onComplete={() => handleLevelComplete(4)} />
                )}
                {currentLevelId === 5 && (
                  <Level6 onComplete={() => handleLevelComplete(5)} />
                )}
              </div>

              {/* "Je retiens" Card + Mini Question (appears when level objective is achieved) */}
              {isCurrentComplete && currentRecapCard && currentMiniQuestion && (
                <JeRetiensCard
                  card={currentRecapCard}
                  miniQuestion={currentMiniQuestion}
                  isQuestionAnswered={isQuestionAnswered}
                  onQuestionAnswered={() =>
                    setAnsweredMiniQuestions((prev) => ({
                      ...prev,
                      [currentLevelId]: true,
                    }))
                  }
                />
              )}

              {/* Final Summary Screen for Level 5 ("Ce que tu sais maintenant") */}
              {currentLevelId === 5 && isCurrentComplete && isQuestionAnswered && (
                <FinalRecapScreen
                  onOpenCarnet={() => setIsCarnetOpen(true)}
                  onReplayLevel={(lvl) => setCurrentLevelId(lvl)}
                />
              )}

              {/* Next Level navigation button */}
              {hasNext && isCurrentComplete && (
                <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  {!isQuestionAnswered ? (
                    <p className="text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                      ⚠️ Répondez à la mini-question ci-dessus pour débloquer l'étape
                      suivante !
                    </p>
                  ) : (
                    <span className="text-xs text-green-700 font-bold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Idée validée, en route pour le refuge suivant !</span>
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setCurrentLevelId(nextLevelId)}
                    className="px-6 py-3 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition-all cursor-pointer flex items-center gap-2 transform active:scale-95"
                  >
                    <span>{T.level.next}</span>
                  </button>
                </div>
              )}
            </section>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-5 px-4 text-xs text-stone-500 border-t border-stone-200 bg-stone-50">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>TrailKernel — Le parcours d'Amine en 5 étapes clés</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCarnetOpen(true)}
              className="text-stone-600 hover:text-stone-900 underline cursor-pointer"
            >
              Fiches de terrain
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setView('home')}
              className="text-stone-600 hover:text-stone-900 underline cursor-pointer"
            >
              Accueil
            </button>
          </div>
        </div>
      </footer>

      {/* Carnet de Rando Modal */}
      <CarnetModal
        isOpen={isCarnetOpen}
        onClose={() => setIsCarnetOpen(false)}
        unlockedLevelIds={progress.unlockedNotebooks}
        unlockedCardIds={progress.unlockedCards}
      />

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-stone-300 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-stone-900">
              Réinitialiser l'ascension ?
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Toutes les étapes franchies, les cartes retenues et le dénivelé accumulé
              seront remis à zéro.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              >
                Confirmer la réinitialisation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
