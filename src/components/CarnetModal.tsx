import React from 'react';
import { T } from '@/data/texts';

interface CarnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedLevelIds: number[];
}

/**
 * Carnet de Rando modal displaying real-world industrial and scientific applications
 * of image convolution in mountain, geospatial, and robotic environments.
 */
export default function CarnetModal({
  isOpen,
  onClose,
  unlockedLevelIds,
}: CarnetModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="carnet-title"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-stone-50 rounded-2xl border border-stone-300 shadow-2xl flex flex-col overflow-hidden">
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
                {T.nav.notebook}
              </h2>
              <p className="text-xs text-stone-400">
                Applications réelles de la convolution en milieu alpin et spatial
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

        {/* Notebook Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="text-xs text-stone-600 bg-orange-50 border border-orange-200 p-3 rounded-xl">
            <strong>Fiches de terrain débloquées :</strong> {unlockedLevelIds.length} /{' '}
            {T.notebook.length}. Chaque niveau franchi enrichit votre carnet d'une
            application professionnelle concrète !
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {T.notebook.map((entry) => {
              const isUnlocked = unlockedLevelIds.includes(entry.levelId);

              return (
                <div
                  key={entry.levelId}
                  className={`rounded-xl border p-4 transition-all ${
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
                          {entry.category} (Niveau {entry.levelId})
                        </span>
                        {!isUnlocked && (
                          <span className="text-[10px] font-semibold text-stone-400">
                            Terminez le niveau {entry.levelId}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-stone-800">
                        {isUnlocked ? entry.title : 'Fiche confidentielle verrouillée'}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        {isUnlocked
                          ? entry.application
                          : 'Progressez le long du sentier de convolution pour révéler cette application industrielle.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
