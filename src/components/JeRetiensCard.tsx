import React, { useState } from 'react';
import type { RecapCard, MiniQuestion } from '@/data/texts';

interface JeRetiensCardProps {
  card: RecapCard;
  miniQuestion: MiniQuestion;
  isQuestionAnswered: boolean;
  onQuestionAnswered: () => void;
}

/**
 * "Je retiens" card that appears upon completing each level.
 * Features:
 * - One crystal-clear pedagogical sentence.
 * - SOBER CSS animation respecting prefers-reduced-motion.
 * - Mini comprehension question (1 question, 3 choices) required before moving to the next level.
 */
export default function JeRetiensCard({
  card,
  miniQuestion,
  isQuestionAnswered,
  onQuestionAnswered,
}: JeRetiensCardProps): React.JSX.Element {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const selectedOpt = miniQuestion.options.find((opt) => opt.id === selectedOptionId);
  const isCorrect = selectedOpt?.correct === true;

  const handleSelect = (optId: string) => {
    setSelectedOptionId(optId);
    setAttempted(true);

    const chosen = miniQuestion.options.find((opt) => opt.id === optId);
    if (chosen?.correct) {
      onQuestionAnswered();
    }
  };

  return (
    <div
      className="rounded-2xl border-2 border-orange-300 bg-linear-to-b from-amber-50 to-orange-50/50 p-5 sm:p-6 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
      role="region"
      aria-label={`Fiche de synthèse : ${card.title}`}
    >
      {/* Header of the card */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-200/80 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-hidden="true">
            💡
          </span>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-800 bg-orange-200/70 px-2.5 py-0.5 rounded-md">
              {card.badge}
            </span>
            <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight mt-0.5">
              JE RETIENS
            </h3>
          </div>
        </div>

        <span className="text-xs font-semibold text-green-800 bg-green-100/80 border border-green-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
          <span>📓</span>
          <span>Ajouté à ton carnet de rando !</span>
        </span>
      </div>

      {/* The Single Core Idea Sentence */}
      <div className="rounded-xl bg-white border border-orange-200 p-4 shadow-xs">
        <p className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
          « {card.takeaway} »
        </p>
      </div>

      {/* Mini Comprehension Question before next level */}
      <div className="rounded-xl bg-white/90 border border-stone-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-hidden="true">
            ❓
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Mini-vérification pour Amine avant de continuer :
          </h4>
        </div>

        <p className="text-sm font-semibold text-stone-900 leading-relaxed">
          {miniQuestion.question}
        </p>

        {/* 3 Choices */}
        <div
          className="grid grid-cols-1 gap-2 pt-1"
          role="group"
          aria-label="Choix de réponse"
        >
          {miniQuestion.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnClasses =
              'w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between';

            if (!attempted || (!isCorrect && !isSelected)) {
              btnClasses += isSelected
                ? ' bg-orange-600 text-white border-orange-700'
                : ' bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-300';
            } else if (isSelected) {
              btnClasses += opt.correct
                ? ' bg-green-600 border-green-700 text-white shadow-xs font-bold'
                : ' bg-red-600 border-red-700 text-white font-bold';
            } else if (opt.correct && attempted) {
              btnClasses += ' bg-green-100 border-green-400 text-green-950 font-bold';
            } else {
              btnClasses +=
                ' bg-stone-50 border-stone-200 text-stone-400 opacity-60 cursor-default';
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                disabled={isQuestionAnswered}
                className={btnClasses}
                aria-pressed={isSelected}
              >
                <span>{opt.label}</span>
                {attempted && opt.correct && <span>✓</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback message */}
        {attempted && (
          <div
            className={`p-3 rounded-xl text-xs leading-relaxed border ${
              isCorrect
                ? 'bg-green-50 border-green-200 text-green-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="font-bold mb-0.5">
              {isCorrect ? '🎉 Parfaitement compris !' : '❌ Pas tout à fait...'}
            </div>
            <div>
              {isCorrect
                ? miniQuestion.explanation
                : 'Relis bien la carte "Je retiens" ci-dessus et choisis la réponse qui correspond.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
