import React, { useState, useMemo } from 'react';
import { T } from '@/data/texts';
import { getExamQuestions, type ExamQuestion } from '@/core/exam';
import HikerMascot from '@/components/HikerMascot';

interface Level11Props {
  onComplete: () => void;
  onNavigateLevel: (levelId: number) => void;
}

const PASS_SCORE = 70;

/**
 * Level 11: "Le Sommet" — 100-Point Alpine Convolution Examination.
 * 10 questions calculated dynamically by src/core.
 * Includes instant diagnostic breakdown by skill with quick revision navigation buttons.
 */
export default function Level11({
  onComplete,
  onNavigateLevel,
}: Level11Props): React.JSX.Element {
  const questions: ExamQuestion[] = useMemo(() => getExamQuestions(), []);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectAnswer = (questionId: number, optionId: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const { score, totalPossible, diagnosticResults } = useMemo(() => {
    let earned = 0;
    const total = questions.reduce((sum, q) => sum + q.points, 0);

    const diagnostics = questions.map((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctId;
      if (isCorrect) {
        earned += q.points;
      }
      return {
        question: q,
        selected,
        isCorrect,
      };
    });

    return { score: earned, totalPossible: total, diagnosticResults: diagnostics };
  }, [questions, answers]);

  const handleSubmit = () => {
    setSubmitted(true);
    if (score >= PASS_SCORE) {
      onComplete();
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;
  const isPassed = submitted && score >= PASS_SCORE;

  const levelInfo = T.levels.find((l) => l.id === 5) ?? T.levels[0];

  return (
    <div className="space-y-6">
      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
        <p className="text-sm text-stone-700">{levelInfo?.description}</p>
      </div>

      <HikerMascot
        message={
          submitted
            ? isPassed
              ? "« Félicitations ! Vous avez brillamment réussi l'examen du Sommet. Votre compréhension de la convolution spatiale est totale ! »"
              : '« Belle tentative ! Consultez votre bilan de compétences ci-dessous et révisez les refuges où vous avez hésité avant de retenter. »'
            : "« Bienvenue à l'épreuve finale du Sommet ! 10 cas pratiques alpins pour tester votre science de la convolution. Prenez votre temps et analysez chaque question. »"
        }
        size="md"
      />

      {/* Summary Score Banner when submitted */}
      {submitted && (
        <div
          className={`p-6 rounded-2xl border text-center space-y-3 ${
            isPassed
              ? 'bg-green-50 border-green-300 text-green-950 shadow-sm'
              : 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm'
          }`}
        >
          <span className="text-3xl block" role="img" aria-hidden="true">
            {isPassed ? '🎖️' : '🧗'}
          </span>
          <h3 className="text-xl font-black">
            {isPassed ? 'Brevet de Guide Validé !' : 'Ascension Incomplète'}
          </h3>
          <div className="text-3xl font-black font-mono">
            {score} / {totalPossible} points
          </div>
          <p className="text-xs sm:text-sm max-w-md mx-auto text-stone-600">
            {isPassed
              ? "Vous avez franchi le seuil d'admissibilité de 70 points. Le titre de Guide de Haute Montagne Convolutif vous est décerné !"
              : "Le seuil d'admission est fixé à 70 points. Utilisez le bilan diagnostique ci-dessous pour réviser les notions nécessaires."}
          </p>

          {!isPassed && (
            <button
              type="button"
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Réessayer l'examen
            </button>
          )}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          const isCorrect = selected === q.correctId;

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-2xl border bg-white shadow-xs space-y-3 ${
                submitted
                  ? isCorrect
                    ? 'border-green-300'
                    : 'border-red-300'
                  : 'border-stone-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-800 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    {q.skill}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-stone-500">
                  {q.points} points
                </span>
              </div>

              <h4 className="font-bold text-stone-900 text-sm">{q.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{q.context}</p>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt) => {
                  const isOptSelected = selected === opt.id;
                  let btnClasses =
                    'p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between cursor-pointer';

                  if (!submitted) {
                    btnClasses += isOptSelected
                      ? ' bg-orange-600 text-white border-orange-700 shadow-xs'
                      : ' bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100';
                  } else {
                    if (opt.id === q.correctId) {
                      btnClasses +=
                        ' bg-green-100 text-green-900 border-green-400 font-bold';
                    } else if (isOptSelected) {
                      btnClasses += ' bg-red-100 text-red-900 border-red-300';
                    } else {
                      btnClasses +=
                        ' bg-stone-50 text-stone-400 border-stone-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectAnswer(q.id, opt.id)}
                      className={btnClasses}
                    >
                      <span>{opt.label}</span>
                      {submitted && opt.id === q.correctId && <span>✓</span>}
                    </button>
                  );
                })}
              </div>

              {/* Explanation when submitted */}
              {submitted && (
                <div
                  className={`p-3 rounded-xl text-xs leading-relaxed border ${
                    isCorrect
                      ? 'bg-green-50 border-green-200 text-green-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  <span className="font-bold mr-1">
                    {isCorrect ? '✓ Exact !' : '✗ Erreur :'}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      {!submitted && (
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-600 font-mono">
            Questions complétées :{' '}
            <strong className="text-stone-900">
              {answeredCount} / {questions.length}
            </strong>
          </div>
          <button
            type="button"
            disabled={!isAllAnswered}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-xs transition-colors cursor-pointer"
          >
            Soumettre ma copie d'examen 🏔️
          </button>
        </div>
      )}

      {/* Diagnostic breakdown by skill with direct level revision buttons */}
      {submitted && (
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-stone-800">
            📊 Bilan Diagnostique par Compétence
          </h4>

          <div className="divide-y divide-stone-100">
            {diagnosticResults.map((item) => (
              <div
                key={item.question.id}
                className="py-3 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                      item.isCorrect ? 'bg-green-600' : 'bg-red-600'
                    }`}
                  >
                    {item.isCorrect ? '✓' : '✗'}
                  </span>
                  <span className="font-semibold text-stone-800">
                    {item.question.skill}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-stone-500">
                    {item.isCorrect ? `+${item.question.points} pts` : '0 pt'}
                  </span>
                  {!item.isCorrect && (
                    <button
                      type="button"
                      onClick={() => onNavigateLevel(item.question.levelToReview)}
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-100 hover:bg-orange-200 text-orange-900 transition-colors cursor-pointer"
                    >
                      Réviser le Niveau {item.question.levelToReview} →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
