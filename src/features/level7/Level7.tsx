import React, { useState, useMemo, useCallback } from 'react';
import { T } from '@/data/texts';
import { generateTerrain } from '@/core/terrain';
import { sobelComponents, findSteepestPixel } from '@/core/slope';
import PixelGrid from '@/components/PixelGrid';
import HikerMascot from '@/components/HikerMascot';

const GRID_SIZE = 14;
const SEED = 42;
const TERRAIN = generateTerrain('massif', SEED, GRID_SIZE);

interface Level7Props {
  onComplete: () => void;
}

/**
 * Level 7 (Étape 4): "Détecter les Falaises (Sobel & Pente)".
 * Displays Sobel X and Sobel Y partial derivatives separately,
 * then combines them into a slope difficulty map (green -> yellow -> red).
 * Condition: Locate and click the steepest area of the massif.
 */
export default function Level7({ onComplete }: Level7Props): React.JSX.Element {
  const [inspectedPos, setInspectedPos] = useState<{ x: number; y: number } | null>(null);
  const [foundSteepest, setFoundSteepest] = useState(false);

  // Compute Sobel components using the core library
  const { gxVisual, gyVisual, magnitude } = useMemo(() => {
    return sobelComponents(TERRAIN, 'clamp');
  }, []);

  // Locate the true steepest pixel deterministically via core
  const steepest = useMemo(() => {
    return findSteepestPixel(magnitude);
  }, [magnitude]);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      setInspectedPos({ x, y });

      // Check distance to the steepest pixel (allow 1 pixel tolerance for friendly UX)
      const dist = Math.hypot(x - steepest.x, y - steepest.y);
      if (dist <= 1.5) {
        setFoundSteepest(true);
        onComplete();
      }
    },
    [steepest, onComplete],
  );

  const inspectedSlope =
    inspectedPos !== null
      ? (magnitude.data[inspectedPos.y * magnitude.width + inspectedPos.x] ?? 0)
      : null;

  const levelInfo = T.levels.find((l) => l.id === 4);

  return (
    <div className="space-y-6">
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-stone-700 leading-relaxed">
        <p>{levelInfo?.description}</p>
      </div>

      <HikerMascot
        message="« Le gradient mesure la raideur du sol. Plus la falaise est abrupte, plus le contraste s'enflamme ! Cliquez sur la zone rouge écarlate où la falaise plonge dans le vide. »"
        size="sm"
      />

      {/* Sobel X & Sobel Y side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs font-black text-stone-800 uppercase tracking-wide">
            {T.filters.sobelX.name} (Dérivée Est-Ouest)
          </span>
          <p className="text-[11px] text-stone-500 text-center">
            Pentes vers l'est en clair, vers l'ouest en sombre, plat = gris 128.
          </p>
          <div className="wood-frame rounded-xl p-1.5 bg-[#fdfaf3]">
            <PixelGrid
              grid={gxVisual}
              cellSize={18}
              showNumbers={false}
              showGrid={true}
              allowColorToggle={false}
              ariaLabel="Sobel X visuel"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs font-black text-stone-800 uppercase tracking-wide">
            {T.filters.sobelY.name} (Dérivée Nord-Sud)
          </span>
          <p className="text-[11px] text-stone-500 text-center">
            Pentes vers le sud en clair, vers le nord en sombre, plat = gris 128.
          </p>
          <div className="wood-frame rounded-xl p-1.5 bg-[#fdfaf3]">
            <PixelGrid
              grid={gyVisual}
              cellSize={18}
              showNumbers={false}
              showGrid={true}
              allowColorToggle={false}
              ariaLabel="Sobel Y visuel"
            />
          </div>
        </div>
      </div>

      {/* Magnitude Difficulty Map */}
      <div className="flex flex-col items-center gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
        <div className="text-center space-y-1">
          <span className="inline-block text-xs font-black uppercase tracking-wider text-orange-800 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Carte de difficulté des pentes : √(gx² + gy²)
          </span>
          <h4 className="text-sm font-extrabold text-stone-900">
            Cliquez sur la carte pour sonder la raideur locale (Cible : Falaise abrupte)
          </h4>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-stone-700 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#16a34a] shadow-xs" /> Douce
            (0-30)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#eab308] shadow-xs" /> Moyenne
            (70-120)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#f97316] shadow-xs" /> Raide
            (120-180)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-red-700">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#dc2626] shadow-xs" /> Falaise
            (&gt;180)
          </span>
        </div>

        <div className="wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
          <PixelGrid
            grid={magnitude}
            cellSize={24}
            showNumbers={false}
            showGrid={true}
            colorMode="slopeDifficulty"
            allowColorToggle={false}
            highlightWindow={inspectedPos}
            onCellClick={handleCellClick}
            ariaLabel="Carte de raideur de pente"
          />
        </div>

        {inspectedPos && inspectedSlope !== null && (
          <div className="w-full max-w-md wood-sign-plate rounded-xl p-3.5 text-white relative shadow-xs font-mono text-xs">
            <span className="wood-rivet absolute top-2 left-2" />
            <span className="wood-rivet absolute top-2 right-2" />
            <div className="parchment-panel rounded-lg p-3 text-stone-900 space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Position sondée :</span>
                <span className="font-bold">
                  (x: {inspectedPos.x}, y: {inspectedPos.y})
                </span>
              </div>
              <div className="flex justify-between font-black">
                <span>Magnitude du gradient :</span>
                <span
                  className={
                    inspectedSlope > 180 ? 'text-red-700 text-sm' : 'text-stone-800'
                  }
                >
                  {inspectedSlope} / 255
                </span>
              </div>
              {foundSteepest && (
                <div className="pt-1.5 text-emerald-800 font-extrabold font-sans text-xs border-t border-stone-200">
                  ✓ Superbe ! Vous avez localisé la falaise la plus abrupte (raideur{' '}
                  {steepest.maxSlope}).
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
