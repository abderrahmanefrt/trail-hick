import React, { useState, useCallback } from 'react';
import { T } from '@/data/texts';
import { generateTerrain } from '@/core/terrain';
import PixelGrid from '@/components/PixelGrid';
import { useSound } from '@/hooks/useSound';

const TERRAIN_SIZE = 16;
const TERRAIN_SEED = 42;
const TERRAIN = generateTerrain('massif', TERRAIN_SEED, TERRAIN_SIZE);
const REQUIRED_CLICKS = T.levels[0]?.requiredClicks ?? 6;

interface Level1Props {
  onComplete: () => void;
}

function getAltitudeDescriptor(altitude: number): string {
  if (altitude < 35) return 'Fond de lac paisible 🛶';
  if (altitude < 90) return 'Vallée verdoyante 🌲';
  if (altitude < 160) return 'Alpage & pente moyenne 🐑';
  if (altitude < 220) return 'Crête rocailleuse 🧗';
  return 'Sommet enneigé ❄️';
}

/**
 * Level 1: "Lire la carte".
 * Explains that grayscale images are digital elevation models (DEM).
 * Condition: User explores 6 distinct cells.
 */
export default function Level1({ onComplete }: Level1Props): React.JSX.Element {
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [currentCell, setCurrentCell] = useState<{
    x: number;
    y: number;
    val: number;
  } | null>(null);

  const { enabled, toggle, playAltitude } = useSound();

  const handleCellClick = useCallback(
    (x: number, y: number, value: number) => {
      setCurrentCell({ x, y, val: value });
      playAltitude(value);

      setVisited((prev) => {
        const next = new Set(prev);
        next.add(y * TERRAIN.width + x);
        if (next.size >= REQUIRED_CLICKS) {
          onComplete();
        }
        return next;
      });
    },
    [onComplete, playAltitude],
  );

  const levelInfo = T.levels[0];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-50 p-3 rounded-lg border border-stone-200">
        <p className="text-sm text-stone-700 max-w-xl">{levelInfo?.description}</p>
        <button
          type="button"
          onClick={toggle}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer shadow-xs"
        >
          {enabled ? T.sound.disable : T.sound.enable}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 flex justify-center">
          <PixelGrid
            grid={TERRAIN}
            cellSize={24}
            showNumbers={false}
            showGrid={true}
            useTopo={true}
            highlightedCells={visited}
            onCellClick={handleCellClick}
            ariaLabel="Carte d'altitude 16x16"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              📍 Altimètre de poche
            </h4>
            {currentCell ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-500 font-mono">
                  <span>Coordonnées :</span>
                  <span>
                    (x: {currentCell.x}, y: {currentCell.y})
                  </span>
                </div>
                <div className="text-3xl font-black text-stone-900 font-mono">
                  {currentCell.val}{' '}
                  <span className="text-sm font-normal text-stone-500">/ 255</span>
                </div>
                <p className="text-xs font-medium text-stone-700 bg-stone-100 p-2 rounded-md">
                  {getAltitudeDescriptor(currentCell.val)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                Cliquez sur n'importe quelle case de la carte pour mesurer l'altitude du
                point.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Progression de la reconnaissance
            </h4>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
              <div
                className="bg-green-600 h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (visited.size / REQUIRED_CLICKS) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-stone-600 mt-2 font-mono">
              {visited.size} / {REQUIRED_CLICKS} cases explorées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
