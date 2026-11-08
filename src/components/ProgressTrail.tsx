import React from 'react';
import { T } from '@/data/texts';

export interface TrailStage {
  id: number;
  title: string;
  difficulty: string;
  complete: boolean;
  unlocked: boolean;
}

interface ProgressTrailProps {
  stages: TrailStage[];
  currentId: number;
  onSelect: (id: number) => void;
}

const STAGE_SUBTITLES: Record<number, { subtitle: string; icon: string }> = {
  1: { subtitle: 'LES BASES', icon: '🗺️' },
  2: { subtitle: 'LE CALCUL', icon: '🔍' },
  3: { subtitle: 'LES POIDS', icon: '🔎' },
  4: { subtitle: 'DÉTECTION', icon: '📐' },
  5: { subtitle: 'EXPÉRIMENTATION', icon: '📜' },
};

/**
 * Illustrated Mountain graphic displayed at the start of the trail.
 */
function TrailMountainIcon(): React.JSX.Element {
  return (
    <div className="shrink-0 flex items-center justify-center pr-2">
      <svg
        width="64"
        height="48"
        viewBox="0 0 70 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
        aria-hidden="true"
      >
        {/* Grass foothills */}
        <path
          d="M2 48 C 15 42, 30 46, 45 44 C 55 42, 65 46, 68 48 L 68 50 L 2 50 Z"
          fill="#4f8a3e"
        />
        {/* Left mountain slope */}
        <polygon points="12,48 28,18 42,48" fill="#8c7e6c" />
        <polygon points="28,18 34,28 28,26 23,29" fill="#ffffff" />
        {/* Main central mountain */}
        <polygon points="20,48 38,8 56,48" fill="#6e5d4d" />
        {/* Snow cap */}
        <polygon
          points="38,8 45,22 41,20 38,24 34,19 31,23"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="0.5"
        />
        {/* Right smaller hill */}
        <polygon points="40,48 54,24 64,48" fill="#7a6b5a" />
        <polygon points="54,24 58,32 54,30 50,33" fill="#ffffff" />
        {/* Little pine trees */}
        <path d="M10 47 L12 42 L14 47 Z" fill="#2d5e23" />
        <path d="M15 48 L17 43 L19 48 Z" fill="#244d1b" />
        <path d="M60 48 L62 44 L64 48 Z" fill="#2d5e23" />
      </svg>
    </div>
  );
}

/**
 * ProgressTrail renders the sequence of 5 mountain shelters styled as
 * authentic outdoor wooden trail signs connected by a dotted hiking path.
 */
export default function ProgressTrail({
  stages,
  currentId,
  onSelect,
}: ProgressTrailProps): React.JSX.Element {
  return (
    <nav aria-label={T.nav.progress} className="w-full py-2">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {/* Mountain illustration anchor */}
        <TrailMountainIcon />

        {/* Trail Stations */}
        <ol className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
          {stages.map((stage, idx) => {
            const isCurrent = stage.id === currentId;
            const isLocked = !stage.unlocked;
            const stageMeta = STAGE_SUBTITLES[stage.id] ?? {
              subtitle: stage.difficulty,
              icon: '⛺',
            };

            return (
              <li key={stage.id} className="flex items-center">
                {/* Dotted trail connection */}
                {idx > 0 && (
                  <div
                    className="flex items-center px-1 sm:px-2 select-none"
                    aria-hidden="true"
                  >
                    <span className="border-b-2 border-dashed border-[#b89f82] w-3 sm:w-6 inline-block" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => !isLocked && onSelect(stage.id)}
                  disabled={isLocked}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={isLocked ? `${stage.title} (verrouillé)` : stage.title}
                  className={`group relative flex flex-col items-center justify-between rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs transition-all cursor-pointer min-w-[105px] sm:min-w-[125px] h-[66px] ${
                    isLocked
                      ? 'bg-stone-200/60 text-stone-400 border border-stone-300 cursor-not-allowed opacity-60'
                      : isCurrent
                        ? 'bg-gradient-to-b from-[#ffeed2] to-[#fde1b0] text-stone-900 border-2 border-orange-500 shadow-md ring-2 ring-orange-300 ring-offset-1 scale-102 font-bold'
                        : stage.complete
                          ? 'bg-gradient-to-b from-[#fbf4e6] to-[#f4e6ce] text-stone-800 border border-[#c9b192] hover:border-orange-400 shadow-xs'
                          : 'bg-white text-stone-700 border border-stone-300 hover:border-orange-400 shadow-xs'
                  }`}
                >
                  {/* Top-right completed checkmark badge */}
                  {stage.complete && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-600 text-white text-[10px] flex items-center justify-center font-black shadow-xs"
                      title="Étape complétée"
                    >
                      ✓
                    </span>
                  )}

                  {/* Icon & Title */}
                  <div className="flex items-center gap-1.5 text-center mt-0.5">
                    <span className="text-sm shrink-0" aria-hidden="true">
                      {isLocked ? '🔒' : stageMeta.icon}
                    </span>
                    <span
                      className={`text-[11px] sm:text-xs leading-tight line-clamp-1 ${
                        isCurrent ? 'font-bold text-stone-950' : 'font-medium'
                      }`}
                    >
                      {stage.title}
                    </span>
                  </div>

                  {/* Subtitle badge / placard */}
                  <span
                    className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full mt-1 ${
                      isCurrent
                        ? 'bg-orange-500 text-white shadow-xs'
                        : stage.complete
                          ? 'bg-[#dfceb3] text-stone-800'
                          : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {stageMeta.subtitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
