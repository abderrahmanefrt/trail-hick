import React, { useState } from 'react';
import { T } from '@/data/texts';

export interface QuizOption {
  label: string;
  value: string;
  correct: boolean;
  explanation: string;
}

interface QuizProps {
  question: string;
  options: readonly QuizOption[];
  onCorrect: () => void;
}

/**
 * Quiz presents multiple-choice interactive questions with instant feedback
 * and clear mathematical explanations for educational reinforcement.
 */
export default function Quiz({
  question,
  options,
  onCorrect,
}: QuizProps): React.JSX.Element {
  const [selectedVal, setSelectedVal] = useState<string | null>(null);

  const answered = selectedVal !== null;
  const chosenOption = options.find((opt) => opt.value === selectedVal);
  const isCorrect = chosenOption?.correct ?? false;

  const handleSelect = (val: string) => {
    if (answered) return;
    setSelectedVal(val);
    const opt = options.find((o) => o.value === val);
    if (opt?.correct) {
      onCorrect();
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs space-y-3">
      <p className="font-semibold text-stone-800 text-sm leading-snug">{question}</p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Options de réponse">
        {options.map((opt) => {
          const isSelected = selectedVal === opt.value;

          let btnClass =
            'px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer';

          if (!answered) {
            btnClass +=
              ' bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100 hover:border-stone-400';
          } else if (isSelected) {
            btnClass += opt.correct
              ? ' bg-green-600 border-green-700 text-white'
              : ' bg-red-600 border-red-700 text-white';
          } else if (opt.correct) {
            btnClass += ' bg-green-100 border-green-400 text-green-900 font-bold';
          } else {
            btnClass +=
              ' bg-stone-50 border-stone-200 text-stone-400 opacity-60 cursor-default';
          }

          return (
            <button
              key={opt.value}
              type="button"
              disabled={answered}
              onClick={() => handleSelect(opt.value)}
              className={btnClass}
              aria-pressed={isSelected}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {answered && chosenOption && (
        <div
          className={`rounded-lg p-3 text-xs leading-relaxed border ${
            isCorrect
              ? 'bg-green-50 border-green-200 text-green-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <span className="font-bold mr-1">
            {isCorrect ? T.quiz.correct : T.quiz.wrong}
          </span>
          {chosenOption.explanation}
        </div>
      )}
    </div>
  );
}
