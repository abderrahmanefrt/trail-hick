import React, { useState } from 'react';
import { T } from '@/data/texts';

interface CarnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedLevelIds: number[];
  unlockedCardIds?: number[];
}

/**
 * Carnet de Rando modal displaying:
 * 1) The "Je retiens" pedagogical cards unlocked by Amine.
 * 2) The real-world applications in mountain, satellite, and robotic environments.
 */
export default function CarnetModal({
  isOpen,
  onClose,
  unlockedLevelIds,
  unlockedCardIds = unlockedLevelIds,
}: CarnetModalProps): React.JSX.Element | null {
  const [activeTab, setActiveTab] = useState<'cards' | 'applications'>('cards');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="carnet-title"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-stone-50 rounded-3xl border border-stone-300 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-hidden="true">
              📓
            </span>
            <div>
              <h2
                id="carnet-title"
                className="text-lg font-black tracking-tight text-white"
              >
                {T.nav.notebook} d'Amine
              </h2>
              <p className="text-xs text-stone-400">
                Idées retenues et applications réelles de la vision par ordinateur
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Fermer le carnet"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-white px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('cards')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cards'
                ? 'border-orange-600 text-orange-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>💡</span>
            <span>
              Mes cartes "Je retiens" ({unlockedCardIds.length}/{T.recapCards.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('applications')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applications'
                ? 'border-orange-600 text-orange-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>🛰️</span>
            <span>
              Applications Réelles ({unlockedLevelIds.length}/{T.notebook.length})
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'cards' ? (
            <div className="space-y-3">
              <div className="text-xs text-stone-600 bg-amber-50 border border-amber-200 p-3 rounded-xl">
                Ces 5 cartes résument toute la progression. Chaque niveau terminé y dépose
                son idée clé !
              </div>

              <div className="grid grid-cols-1 gap-3">
                {T.recapCards.map((card) => {
                  const isUnlocked = unlockedCardIds.includes(card.levelId);

                  return (
                    <div
                      key={card.levelId}
                      className={`rounded-2xl border p-4 transition-all ${
                        isUnlocked
                          ? 'bg-white border-orange-200 shadow-xs'
                          : 'bg-stone-100/60 border-stone-200/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isUnlocked
                              ? 'bg-orange-600 text-white'
                              : 'bg-stone-300 text-stone-600'
                          }`}
                        >
                          {card.levelId}
                        </span>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-100/70 px-2 py-0.5 rounded">
                              {card.badge}
                            </span>
                            {!isUnlocked && (
                              <span className="text-[10px] text-stone-400 font-semibold">
                                🔒 À débloquer au refuge {card.levelId}
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-sm text-stone-900">
                            {isUnlocked ? card.title : 'Idée encore cachée'}
                          </h3>

                          <p className="text-xs text-stone-700 font-medium leading-relaxed">
                            {isUnlocked
                              ? `« ${card.takeaway} »`
                              : 'Terminez ce refuge sur le sentier pour révéler cette idée essentielle.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-stone-600 bg-orange-50 border border-orange-200 p-3 rounded-xl">
                Chaque étape franchie débloque une fiche concrète utilisée par les
                scientifiques et secouristes !
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {T.notebook.map((entry) => {
                  const isUnlocked = unlockedLevelIds.includes(entry.levelId);

                  return (
                    <div
                      key={entry.levelId}
                      className={`rounded-2xl border p-4 transition-all ${
                        isUnlocked
                          ? 'bg-white border-stone-200 shadow-xs'
                          : 'bg-stone-100/70 border-stone-200/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="text-2xl shrink-0 p-2 bg-stone-100 rounded-xl"
                          role="img"
                          aria-hidden="true"
                        >
                          {isUnlocked ? entry.icon : '🔒'}
                        </span>
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded">
                              {entry.category} (Étape {entry.levelId})
                            </span>
                            {!isUnlocked && (
                              <span className="text-[10px] font-semibold text-stone-400">
                                Terminez l'étape {entry.levelId}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-stone-800">
                            {isUnlocked ? entry.title : 'Fiche de terrain verrouillée'}
                          </h3>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            {isUnlocked
                              ? entry.application
                              : 'Franchissez ce refuge pour débloquer cette application professionnelle.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white transition-colors cursor-pointer"
          >
            Fermer le carnet
          </button>
        </div>
      </div>
    </div>
  );
}
