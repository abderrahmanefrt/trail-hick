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

const STAGE_CONFIG: Record<number, { label: string; badge: string; icon: string }> = {
  1: { label: '1. Lire la carte...', badge: 'LES BASES', icon: '🗺️' },
  2: { label: '2. La fenêtre 3×3...', badge: 'LE CALCUL', icon: '🔍' },
  3: { label: '3. Flou, Poids...', badge: 'LES POIDS', icon: '🔎' },
  4: { label: '4. Détecter r...', badge: 'DÉTECTION', icon: '📐' },
  5: { label: "5. L'Atelier Lib...", badge: 'EXPÉRIMENTATION', icon: '📜' },
};

/**
 * Detailed Mountain Peak Illustration matching the exact mockup.
 */
function MountainGraphic(): React.JSX.Element {
  return (
    <div className="shrink-0 flex items-center justify-center mr-2 select-none">
      <svg
        width="82"
        height="56"
        viewBox="0 0 90 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
        aria-hidden="true"
      >
        {/* Foothills green base */}
        <path
          d="M2 56 C 20 48, 45 52, 70 50 C 78 49, 86 52, 88 56 L 88 58 L 2 58 Z"
          fill="#4f883c"
        />
        <path d="M6 56 C 25 50, 50 53, 75 51 C 82 50, 86 53, 88 56 Z" fill="#3b692c" />

        {/* Left background slope */}
        <polygon points="10,56 28,24 46,56" fill="#8f7e6e" />
        <polygon points="28,24 35,34 28,32 22,35" fill="#ffffff" />

        {/* Right background slope */}
        <polygon points="46,56 65,28 82,56" fill="#7a6c5e" />
        <polygon points="65,28 71,36 65,34 60,37" fill="#ffffff" />

        {/* Main central high peak */}
        <polygon points="18,56 42,10 66,56" fill="#675647" />

        {/* Main peak shaded left facet */}
        <polygon points="18,56 42,10 42,56" fill="#57473a" />

        {/* Snow cap on central summit */}
        <polygon
          points="42,10 52,26 47,24 42,28 36,23 32,27 30,22 42,10"
          fill="#ffffff"
        />
        <polygon points="42,10 42,28 36,23 32,27 30,22" fill="#e2e8f0" />

        {/* Little pine trees on foothills */}
        <path d="M8 55 L11 48 L14 55 Z" fill="#204b19" />
        <path d="M14 56 L17 49 L20 56 Z" fill="#1b3f15" />
        <path d="M72 55 L75 49 L78 55 Z" fill="#204b19" />
        <path d="M78 56 L81 50 L84 56 Z" fill="#1b3f15" />
      </svg>
    </div>
  );
}

/**
 * ProgressTrail matching the exact top navigation stepper from the reference image.
 */
export default function ProgressTrail({
  stages,
  currentId,
  onSelect,
}: ProgressTrailProps): React.JSX.Element {
  return (
    <nav aria-label={T.nav.progress} className="w-full py-2.5">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {/* Mountain illustration anchor */}
        <MountainGraphic />

        {/* 5 Stages Trail */}
        <ol className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {stages.map((stage, idx) => {
            const isCurrent = stage.id === currentId;
            const isLocked = !stage.unlocked;
            const meta = STAGE_CONFIG[stage.id] ?? {
              label: stage.title,
              badge: stage.difficulty,
              icon: '⛺',
            };

            return (
              <li key={stage.id} className="flex items-center">
                {/* Dashed trail line between steps */}
                {idx > 0 && (
                  <div className="flex items-center px-1 select-none" aria-hidden="true">
                    <span className="border-b-2 border-dashed border-[#b89f82] w-3 sm:w-5 inline-block" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => !isLocked && onSelect(stage.id)}
                  disabled={isLocked}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={isLocked ? `${stage.title} (verrouillé)` : stage.title}
                  className={`group relative flex flex-col items-center justify-between rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 transition-all cursor-pointer min-w-[110px] sm:min-w-[130px] h-[68px] ${
                    isLocked
                      ? 'bg-[#ece5d8] text-stone-400 border border-stone-300 cursor-not-allowed opacity-60'
                      : isCurrent
                        ? 'bg-gradient-to-b from-[#ffeed2] to-[#fedfa6] text-stone-900 border-2 border-orange-500 shadow-md ring-2 ring-orange-300 ring-offset-1 font-bold'
                        : stage.complete
                          ? 'bg-gradient-to-b from-[#fbf4e5] to-[#f4e4c9] text-stone-800 border border-[#c9b292] hover:border-orange-400 shadow-xs'
                          : 'bg-[#fffaf0] text-stone-700 border border-[#dfd2be] hover:border-orange-400 shadow-xs'
                  }`}
                >
                  {/* Top-right completed checkmark badge */}
                  {stage.complete && (
                    <span
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#16a34a] text-white text-[10px] flex items-center justify-center font-black shadow-xs ring-1 ring-white"
                      title="Étape complétée"
                    >
                      ✓
                    </span>
                  )}

                  {/* Icon & Label */}
                  <div className="flex items-center gap-1.5 text-center mt-0.5 w-full justify-center">
                    <span className="text-sm shrink-0" aria-hidden="true">
                      {isLocked ? '🔒' : meta.icon}
                    </span>
                    <span
                      className={`text-[11px] sm:text-xs leading-tight line-clamp-1 ${
                        isCurrent ? 'font-bold text-stone-950' : 'font-semibold'
                      }`}
                    >
                      {meta.label}
                    </span>
                  </div>

                  {/* Bottom Subtitle Badge */}
                  <span
                    className={`text-[9px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full mt-1 ${
                      isCurrent
                        ? 'bg-orange-500 text-white shadow-xs'
                        : stage.complete
                          ? 'bg-[#ded0b6] text-stone-800'
                          : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {meta.badge}
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
