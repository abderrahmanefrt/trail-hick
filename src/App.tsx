import React, { useState, useMemo, useEffect } from 'react';
import { T } from '@/data/texts';
import ProgressTrail, { type TrailStage } from '@/components/ProgressTrail';
import CarnetModal from '@/components/CarnetModal';
import HomeHero from '@/components/HomeHero';
import JeRetiensCard from '@/components/JeRetiensCard';
import FinalRecapScreen from '@/components/FinalRecapScreen';
import { useSound } from '@/hooks/useSound';

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

const STAGE_SUBTITLES: Record<number, string> = {
  1: 'LES BASES',
  2: 'LE CALCUL',
  3: 'LES POIDS',
  4: 'DÉTECTION',
  5: 'EXPÉRIMENTATION',
};

export default function App(): React.JSX.Element {
  const [progress, setProgress] = useState<TrailKernelProgress>(() => loadProgress());
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [view, setView] = useState<'home' | 'trail'>('trail');
  const [isCarnetOpen, setIsCarnetOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [answeredMiniQuestions, setAnsweredMiniQuestions] = useState<
    Record<number, boolean>
  >({});

  const { enabled: soundEnabled, toggle: toggleSound } = useSound();

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
  const stageSubtitle =
    STAGE_SUBTITLES[currentLevelId] ?? currentLevelData?.difficulty ?? 'ÉTAPE';

  return (
    <div className="min-h-screen bg-topo-pattern flex flex-col text-stone-900 font-sans selection:bg-orange-200">
      {/* Top Alpine Header (Dark timber look) */}
      <header className="bg-[#1c1917] text-stone-100 border-b-2 border-[#5a3215] shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & title */}
          <div className="flex items-center gap-2.5">
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
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            {/* Elevation gain badge */}
            <div
              className="flex items-center gap-1.5 bg-[#29221b] px-3 py-1.5 rounded-lg border border-[#4d3623] text-stone-200 shadow-xs"
              title="Dénivelé positif accumulé (XP)"
            >
              <span className="text-orange-400 font-bold">▲</span>
              <span className="font-bold text-white">{progress.elevationGainMeters}</span>
              <span className="text-stone-400 text-[10px]">m D+</span>
            </div>

            {/* Rank badge */}
            <div
              className="hidden md:flex items-center gap-1.5 bg-[#29221b] px-3 py-1.5 rounded-lg border border-[#4d3623] text-stone-300 font-sans font-semibold shadow-xs"
              title="Votre rang d'alpiniste"
            >
              <span>{rankInfo.badge}</span>
            </div>

            {/* Carnet de Rando trigger */}
            <button
              type="button"
              onClick={() => setIsCarnetOpen(true)}
              className="px-3 py-1.5 rounded-lg font-sans font-semibold text-xs bg-[#29221b] hover:bg-[#3d2f23] text-stone-200 border border-[#4d3623] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              aria-label="Ouvrir le carnet de rando"
            >
              <span>📓</span>
              <span className="hidden sm:inline">{T.nav.notebook}</span>
            </button>

            {/* Home / Trail Toggle Button */}
            <button
              type="button"
              onClick={() => setView((v) => (v === 'home' ? 'trail' : 'home'))}
              className="px-3 py-1.5 rounded-lg font-sans font-bold text-xs bg-orange-600 hover:bg-orange-500 text-white transition-colors cursor-pointer shadow-xs"
            >
              {view === 'home' ? 'Sentier →' : 'Accueil'}
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border text-sm transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-800 border-emerald-600 text-emerald-200'
                  : 'bg-[#29221b] border-[#4d3623] text-stone-400 hover:text-stone-200'
              }`}
              title={soundEnabled ? 'Désactiver le son' : 'Activer le son'}
              aria-label="Contrôle du son"
            >
              {soundEnabled ? '🔊' : '🔇'}
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

      {/* Progress Trail Bar */}
      {view === 'trail' && (
        <div className="bg-[#fefaf2]/90 border-b border-[#e2d5bf] shadow-xs backdrop-blur-xs">
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
        {/* Onboarding Guide Box (Styled as authentic carved wood board with rivets) */}
        {showHowToPlay && (
          <div className="mb-6 wood-board rounded-2xl p-4 sm:p-5 text-white relative shadow-lg">
            {/* Corner rivets */}
            <span className="wood-rivet absolute top-2.5 left-2.5" />
            <span className="wood-rivet absolute top-2.5 right-2.5" />
            <span className="wood-rivet absolute bottom-2.5 left-2.5" />
            <span className="wood-rivet absolute bottom-2.5 right-2.5" />

            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#a86e3f]">
              <div className="flex items-center gap-2">
                <span className="text-base" aria-hidden="true">
                  ⚠️
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-amber-200">
                  {T.howToPlay.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="text-xs text-amber-200 hover:text-white font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
                title="Masquer le guide"
              >
                ✕ Masquer
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-900">
              <div className="parchment-panel p-3.5 rounded-xl space-y-1.5 shadow-sm">
                <p className="font-extrabold text-[#7a4115] text-[13px]">
                  {T.howToPlay.step1Title}
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px] sm:text-xs">
                  {T.howToPlay.step1Desc}
                </p>
              </div>

              <div className="parchment-panel p-3.5 rounded-xl space-y-1.5 shadow-sm">
                <p className="font-extrabold text-[#7a4115] text-[13px]">
                  {T.howToPlay.step2Title}
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px] sm:text-xs">
                  {T.howToPlay.step2Desc}
                </p>
              </div>

              <div className="parchment-panel p-3.5 rounded-xl space-y-1.5 shadow-sm">
                <p className="font-extrabold text-[#7a4115] text-[13px]">
                  {T.howToPlay.step3Title}
                </p>
                <p className="text-stone-700 leading-relaxed text-[11px] sm:text-xs">
                  {T.howToPlay.step3Desc}
                </p>
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
            <section className="bg-white rounded-3xl border border-[#ded0b4] shadow-md p-5 sm:p-7 space-y-6">
              {/* Level Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-200">
                <div className="space-y-2 max-w-2xl">
                  {/* Step badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                      ÉTAPE {currentLevelData.id} / {T.levels.length} — {stageSubtitle}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                      +{ELEVATION_PER_LEVEL} m D+
                    </span>
                    {isCurrentComplete && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                        <span>✓</span>
                        <span>Étape validée</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Objective */}
                  <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight leading-snug">
                    {currentLevelData.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-medium leading-relaxed">
                    {currentLevelData.objective}
                  </p>

                  {/* Mission Ribbon Banner */}
                  <div className="mission-ribbon mt-3 p-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5">
                    <span className="text-base shrink-0" aria-hidden="true">
                      ⏱️
                    </span>
                    <span className="tracking-wide">
                      VOTRE MISSION : {currentLevelData.instructions}
                    </span>
                    <span className="text-base shrink-0 ml-auto" aria-hidden="true">
                      🔭
                    </span>
                  </div>
                </div>
              </div>

              {/* Success celebration banner */}
              {isCurrentComplete && currentLevelData.successMessage && (
                <div className="success-banner rounded-2xl p-4 text-xs sm:text-sm font-semibold text-emerald-950 flex items-center gap-3">
                  <span className="text-2xl shrink-0" role="img" aria-label="Succès">
                    🌿
                  </span>
                  <div className="flex-1">
                    <strong>Objectif atteint ! Bravo !</strong>{' '}
                    {currentLevelData.successMessage}
                  </div>
                  <span className="text-2xl shrink-0" role="img" aria-hidden="true">
                    ⭐
                  </span>
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

              {/* "Je retiens" Card + Mini Question */}
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
                <div className="pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {!isQuestionAnswered ? (
                    <p className="text-xs text-amber-900 font-bold bg-amber-100/90 px-3 py-2 rounded-xl border border-amber-300">
                      ⚠️ Répondez à la mini-question ci-dessus pour débloquer l'étape
                      suivante !
                    </p>
                  ) : (
                    <span className="text-xs text-emerald-800 font-extrabold flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Idée validée, en route pour le refuge suivant !</span>
                    </span>
                  )}

                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setCurrentLevelId(nextLevelId)}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl font-black text-sm bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <span>Passer à l'étape suivante →</span>
                  </button>
                </div>
              )}
            </section>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-5 px-4 text-xs text-stone-600 border-t border-[#ded0b4] bg-[#fbf7ee]">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>TrailKernel — L'art de la convolution en haute montagne</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCarnetOpen(true)}
              className="text-stone-700 hover:text-stone-900 underline font-medium cursor-pointer"
            >
              Carnet de rando
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setView('home')}
              className="text-stone-700 hover:text-stone-900 underline font-medium cursor-pointer"
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
