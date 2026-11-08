import React from 'react';
import { T } from '@/data/texts';
import HikerMascot from '@/components/HikerMascot';

interface FinalRecapScreenProps {
  onOpenCarnet: () => void;
  onReplayLevel: (levelId: number) => void;
}

/**
 * End-of-Level 5 recap screen: "Ce que tu sais maintenant".
 * Displays all 5 pedagogical cards in order to celebrate Amine's complete understanding.
 */
export default function FinalRecapScreen({
  onOpenCarnet,
  onReplayLevel,
}: FinalRecapScreenProps): React.JSX.Element {
  return (
    <div
      className="rounded-3xl border-2 border-green-500 bg-linear-to-b from-green-50/70 to-emerald-50/30 p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 motion-reduce:animate-none"
      role="region"
      aria-label="Récapitulatif final : Ce que tu sais maintenant"
    >
      {/* Celebration Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-4xl block" role="img" aria-hidden="true">
          🏆
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {T.finalSummary.title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {T.finalSummary.subtitle}
        </p>
      </div>

      {/* The 5 Cards in strict sequential order */}
      <div className="grid grid-cols-1 gap-3.5 max-w-2xl mx-auto">
        {T.recapCards.map((card, idx) => (
          <div
            key={card.levelId}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs hover:border-orange-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {idx + 1}
            </div>
            <div className="space-y-0.5 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/70 px-2 py-0.5 rounded">
                Étape {card.levelId}
              </span>
              <p className="text-sm font-bold text-stone-900 leading-snug pt-1">
                « {card.takeaway} »
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mascot congratulations */}
      <div className="max-w-2xl mx-auto">
        <HikerMascot
          message="« Chapeau l'artiste ! Tu es parti de zéro et tu as compris pas à pas comment les ordinateurs voient et transforment le monde. Tu as mérité ton brevet de Guide de Haute Montagne ! »"
          size="md"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onOpenCarnet}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-green-700 hover:bg-green-800 text-white shadow-sm transition-all cursor-pointer flex items-center gap-2"
        >
          <span>📓</span>
          <span>{T.finalSummary.openCarnet}</span>
        </button>

        <button
          type="button"
          onClick={() => onReplayLevel(1)}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-all cursor-pointer"
        >
          Recommencer la balade au refuge 1
        </button>
      </div>
    </div>
  );
}
