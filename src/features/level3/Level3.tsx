import React, { useState, useCallback } from 'react';
import { T } from '@/data/texts';
import { generateTerrain } from '@/core/terrain';
import { getPixel } from '@/core/grid';
import { boxBlur } from '@/core/kernels';
import PixelGrid from '@/components/PixelGrid';
import StepCalculator from '@/components/StepCalculator';

const GRID_SIZE = 6;
const SEED = 24;
const TERRAIN_6X6 = generateTerrain('massif', SEED, GRID_SIZE);
const REQUIRED_CALCS = 4;

interface Level3Props {
  onComplete: () => void;
}

/**
 * Level 3 (Étape 2): "La fenêtre 3×3 (Le Cœur du Calcul)".
 * The user clicks a pixel on a 6×6 grid to visualize the 3×3 field of view,
 * reviews the dot products, and validates the calculation.
 * Success: 4 pixels computed.
 */
export default function Level3({ onComplete }: Level3Props): React.JSX.Element {
  const [selectedPos, setSelectedPos] = useState<{ x: number; y: number } | null>(null);
  const [calculatedCells, setCalculatedCells] = useState<Set<number>>(new Set());

  const handleCellClick = useCallback((x: number, y: number) => {
    setSelectedPos({ x, y });
  }, []);

  const handleValidateCalculation = () => {
    if (!selectedPos) return;

    setCalculatedCells((prev) => {
      const next = new Set(prev);
      next.add(selectedPos.y * TERRAIN_6X6.width + selectedPos.x);
      if (next.size >= REQUIRED_CALCS) {
        onComplete();
      }
      return next;
    });
  };

  const neighbours = selectedPos
    ? Array.from({ length: 9 }, (_, idx) => {
        const kx = (idx % 3) - 1;
        const ky = Math.floor(idx / 3) - 1;
        return getPixel(TERRAIN_6X6, selectedPos.x + kx, selectedPos.y + ky, 'clamp');
      })
    : null;

  const levelInfo = T.levels.find((l) => l.id === 2);

  return (
    <div className="space-y-6">
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-stone-700 leading-relaxed">
        <p>{levelInfo?.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Wood-framed Grid */}
        <div className="lg:col-span-5 flex flex-col items-center gap-4">
          <div className="w-full max-w-[380px] wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
            <PixelGrid
              grid={TERRAIN_6X6}
              cellSize={44}
              showNumbers={true}
              showGrid={true}
              useTopo={false}
              highlightWindow={selectedPos}
              highlightedCells={calculatedCells}
              onCellClick={handleCellClick}
              ariaLabel="Grille 6x6 d'altitude avec fenêtrage 3x3"
            />
          </div>

          {/* Wooden sign for calculations progress */}
          <div className="w-full max-w-[380px] wood-sign-plate rounded-xl p-3 text-white text-xs relative shadow-xs">
            <span className="wood-rivet absolute top-2 left-2" />
            <span className="wood-rivet absolute top-2 right-2" />
            <div className="parchment-panel rounded-lg p-2.5 text-stone-900 flex justify-between items-center font-bold">
              <span className="flex items-center gap-1.5">
                <span>🥾</span>
                <span>Calculs validés :</span>
              </span>
              <span className="font-mono text-orange-700">
                {calculatedCells.size} / {REQUIRED_CALCS}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Step Calculator */}
        <div className="lg:col-span-7 space-y-4">
          {selectedPos && neighbours ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <StepCalculator
                  pixels={neighbours}
                  coefficients={boxBlur.values}
                  divisor={boxBlur.divisor}
                  offset={boxBlur.offset}
                />
              </div>

              <button
                type="button"
                onClick={handleValidateCalculation}
                className="w-full py-3 px-5 rounded-xl font-black text-xs sm:text-sm bg-orange-600 hover:bg-orange-500 text-white shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 transform active:scale-95"
              >
                <span>✓</span>
                <span>
                  Valider le calcul pour la case (x: {selectedPos.x}, y: {selectedPos.y})
                </span>
              </button>
            </div>
          ) : (
            <div className="wood-board rounded-2xl p-8 text-center text-white relative shadow-md">
              <span className="wood-rivet absolute top-3 left-3" />
              <span className="wood-rivet absolute top-3 right-3" />
              <span className="wood-rivet absolute bottom-3 left-3" />
              <span className="wood-rivet absolute bottom-3 right-3" />

              <div className="parchment-panel rounded-xl p-6 text-stone-800 space-y-2">
                <span className="text-4xl block mb-2" aria-hidden="true">
                  🔭
                </span>
                <p className="text-base font-extrabold text-[#7a4115]">
                  Posez le marcheur sur la carte
                </p>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Cliquez sur n'importe quelle case de la grille pour poser le randonneur
                  et ouvrir sa fenêtre de vue 3×3 avec ses 8 voisins immédiats.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
