import React, { useState, useEffect } from 'react';
import { T } from '@/data/texts';
import { generateTerrain } from '@/core/terrain';
import PixelGrid from '@/components/PixelGrid';
import HikerMascot from '@/components/HikerMascot';
import type { TrailKernelProgress } from '@/core/storage';
import { getRankFromElevation } from '@/core/storage';

interface HomeHeroProps {
  progress: TrailKernelProgress;
  onStart: (levelId: number) => void;
  onOpenNotebook: () => void;
}

const DEMO_SIZE = 10;
const DEMO_GRID = generateTerrain('massif', 99, DEMO_SIZE);

/**
 * Interactive Landing Page featuring an animated hiker scanning a 3×3 convolution window,
 * direct action buttons, genuine real-time statistics, and a trail preview.
 */
export default function HomeHero({
  progress,
  onStart,
  onOpenNotebook,
}: HomeHeroProps): React.JSX.Element {
  // Coordinates of the 3x3 window scanner
  const [scannerPos, setScannerPos] = useState<{ x: number; y: number }>({ x: 2, y: 2 });

  // Animated sweep across the grid
  useEffect(() => {
    // Respect user's motion preferences
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      setScannerPos((prev) => {
        let nextX = prev.x + 1;
        let nextY = prev.y;

        if (nextX >= DEMO_SIZE - 1) {
          nextX = 1;
          nextY = prev.y + 1;
          if (nextY >= DEMO_SIZE - 1) {
            nextY = 1;
          }
        }
        return { x: nextX, y: nextY };
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const rankInfo = getRankFromElevation(progress.elevationGainMeters);
  const nextLevel = progress.lastActiveLevel || 1;
  const isStarted = progress.completedLevels.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-b from-[#1c1917] to-[#2b241c] text-stone-100 p-6 sm:p-10 shadow-xl border-2 border-[#5a3215] overflow-hidden relative">
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-orange-600/30 text-orange-300 border border-orange-500/40">
            <span>🥾</span>
            <span>Simulation Pédagogique Interactive</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {T.home.heroTitle}
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            {T.home.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onStart(nextLevel)}
              className="px-6 py-3 rounded-xl font-black text-sm bg-orange-600 hover:bg-orange-500 text-white shadow-lg transition-all cursor-pointer flex items-center gap-2 transform active:scale-95"
            >
              <span>⛰️</span>
              <span>{isStarted ? T.home.continueTrail : T.home.startTrail}</span>
            </button>

            <button
              type="button"
              onClick={onOpenNotebook}
              className="px-5 py-3 rounded-xl font-bold text-sm bg-[#3a2c20] hover:bg-[#4d3a2b] text-stone-200 border border-[#6b4b32] transition-all cursor-pointer flex items-center gap-2"
            >
              <span>📓</span>
              <span>{T.home.readNotebook}</span>
            </button>
          </div>
        </div>

        {/* Decorative background mountain ridge */}
        <div
          className="absolute -right-8 -bottom-12 opacity-15 pointer-events-none select-none text-[180px] font-mono leading-none text-white"
          aria-hidden="true"
        >
          ▲
        </div>
      </div>

      {/* Live Animated 3x3 Window Scanning Demo */}
      <div className="rounded-3xl border border-[#ded0b4] bg-white p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="inline-block text-xs font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Démonstration interactive
          </span>
          <h3 className="text-2xl font-black text-stone-900 tracking-tight">
            Le balayage de la fenêtre 3×3
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
            {T.home.demoCaption}
          </p>
          <div className="text-xs text-stone-700 bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/90 font-mono">
            Position sondeur : (x: {scannerPos.x}, y: {scannerPos.y}) | Fenêtre explorée :
            9 pixels
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
            <PixelGrid
              grid={DEMO_GRID}
              cellSize={26}
              showNumbers={true}
              showGrid={true}
              useTopo={true}
              allowColorToggle={false}
              highlightWindow={scannerPos}
              ariaLabel="Démonstration animée de la fenêtre 3x3 balayant la carte"
            />
          </div>
        </div>
      </div>

      {/* Honest Genuine Player Progression Statistics */}
      <div className="rounded-3xl border border-[#ded0b4] bg-white p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-600">
          Votre carnet d'expédition (Statistiques réelles)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e5d8c1] space-y-1">
            <span className="text-xs text-stone-600 font-semibold">
              {T.gamification.dPlus}
            </span>
            <div className="text-2xl font-black text-stone-900 font-mono">
              {progress.elevationGainMeters}{' '}
              <span className="text-xs font-normal text-stone-500">m D+</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e5d8c1] space-y-1">
            <span className="text-xs text-stone-600 font-semibold">
              {T.gamification.rank}
            </span>
            <div className="text-sm font-black text-orange-700">{rankInfo.badge}</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e5d8c1] space-y-1">
            <span className="text-xs text-stone-600 font-semibold">Étapes validées</span>
            <div className="text-2xl font-black text-emerald-700 font-mono">
              {progress.completedLevels.length} / {T.levels.length}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e5d8c1] space-y-1">
            <span className="text-xs text-stone-600 font-semibold">
              Fiches de terrain
            </span>
            <div className="text-2xl font-black text-amber-800 font-mono">
              {progress.unlockedNotebooks.length} / {T.notebook.length}
            </div>
          </div>
        </div>
      </div>

      {/* Mascot Welcome message */}
      <HikerMascot
        message="« Bienvenue au camp de base ! Je suis Bastien, votre guide. À chaque refuge du sentier, nous percerons ensemble les secrets de la convolution numérique. Enfilez vos chaussures et rejoignez-moi ! »"
        size="md"
      />
    </div>
  );
}
