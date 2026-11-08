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
 * Level 1: "Lire la carte (Pixel = Altitude)".
 * Demonstrates that a grayscale or topographic digital image is a grid of elevations (0 to 255).
 * Styled with authentic wooden trail signs, walkie-talkie audio, and an altitude gauge.
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
    <div className="space-y-6">
      {/* Explanatory intro & walkie-talkie altimeter trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-stone-700">
        <p className="max-w-xl leading-relaxed">{levelInfo?.description}</p>

        {/* Walkie-talkie style audio trigger */}
        <button
          type="button"
          onClick={toggle}
          className={`shrink-0 flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
            enabled
              ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-300'
              : 'bg-[#5b3c25] hover:bg-[#4d321d] text-amber-100 border-[#3c2514]'
          }`}
          aria-pressed={enabled}
          title={
            enabled ? 'Désactiver le son de l’altimètre' : 'Activer le son de l’altimètre'
          }
        >
          <span className="text-base" aria-hidden="true">
            📻
          </span>
          <span>{enabled ? T.sound.disable : T.sound.enable}</span>
        </button>
      </div>

      {/* Main 2-column layout: Map on Left, Wooden Signboards on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Column */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[420px] wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
            <PixelGrid
              grid={TERRAIN}
              cellSize={23}
              showNumbers={false}
              showGrid={true}
              useTopo={true}
              highlightedCells={visited}
              onCellClick={handleCellClick}
              ariaLabel="Carte d'altitude 16x16"
            />
          </div>
        </div>

        {/* Trail Signs Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Sign 1: Altimètre de poche */}
          <div className="wood-board rounded-2xl p-4 text-white relative shadow-md">
            {/* Corner rivets */}
            <span className="wood-rivet absolute top-2.5 left-2.5" />
            <span className="wood-rivet absolute top-2.5 right-2.5" />
            <span className="wood-rivet absolute bottom-2.5 left-2.5" />
            <span className="wood-rivet absolute bottom-2.5 right-2.5" />

            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#a86e3f]">
              <span className="text-base">📍</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-200">
                Altimètre de poche
              </h4>
            </div>

            {currentCell ? (
              <div className="parchment-panel rounded-xl p-3 text-stone-900 space-y-1.5 shadow-inner">
                <div className="flex justify-between text-[11px] text-stone-600 font-mono">
                  <span>Coordonnées :</span>
                  <span className="font-bold">
                    (x: {currentCell.x}, y: {currentCell.y})
                  </span>
                </div>
                <div className="text-3xl font-black text-stone-900 font-mono tracking-tight">
                  {currentCell.val}{' '}
                  <span className="text-sm font-semibold text-stone-500">/ 255 m</span>
                </div>
                <div className="text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2 py-1 rounded-md border border-emerald-300/80">
                  {getAltitudeDescriptor(currentCell.val)}
                </div>
              </div>
            ) : (
              <div className="parchment-panel rounded-xl p-3 text-stone-600 text-xs italic text-center">
                Cliquez sur une case de la carte pour mesurer son altitude au capteur.
              </div>
            )}
          </div>

          {/* Sign 2: Progression de la reconnaissance */}
          <div className="wood-sign-plate rounded-2xl p-4 text-white relative shadow-md">
            {/* Corner rivets */}
            <span className="wood-rivet absolute top-2.5 left-2.5" />
            <span className="wood-rivet absolute top-2.5 right-2.5" />
            <span className="wood-rivet absolute bottom-2.5 left-2.5" />
            <span className="wood-rivet absolute bottom-2.5 right-2.5" />

            <h4 className="text-xs font-black uppercase tracking-wider text-amber-100 mb-2">
              Progression de la reconnaissance
            </h4>

            <div className="parchment-panel rounded-xl p-3 text-stone-900 space-y-2">
              {/* Trail path indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <span>🥾</span>
                  <span>
                    {visited.size} / {REQUIRED_CLICKS} cases explorées
                  </span>
                </span>
                <span className="font-mono text-orange-700">
                  {Math.round((visited.size / REQUIRED_CLICKS) * 100)}%
                </span>
              </div>

              {/* Progress bar styled as trail */}
              <div className="w-full bg-[#e3d7c3] h-3.5 rounded-full overflow-hidden border border-[#c5b59b] p-0.5">
                <div
                  className="bg-gradient-to-r from-orange-500 to-emerald-600 h-full rounded-full transition-all duration-300 shadow-xs"
                  style={{
                    width: `${Math.min(100, (visited.size / REQUIRED_CLICKS) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sign 3: Échelle altimétrique (Color Bar Gauge) */}
          <div className="rounded-2xl border-2 border-stone-400 bg-stone-800 p-3.5 shadow-md text-stone-200">
            <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              <span>0 (Vallée)</span>
              <span>Échelle d'altitude</span>
              <span>255 (Cime)</span>
            </div>

            {/* Gradient gauge */}
            <div className="relative h-5 rounded-lg overflow-hidden border border-stone-600 bg-gradient-to-r from-blue-700 via-green-600 via-amber-500 via-orange-600 to-white shadow-inner">
              {currentCell && (
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-black border-x border-white shadow-md transition-all duration-150"
                  style={{
                    left: `calc(${(currentCell.val / 255) * 100}% - 3px)`,
                  }}
                  title={`Altitude : ${currentCell.val}`}
                />
              )}
            </div>

            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>Lac bleu</span>
              <span>Alpage vert</span>
              <span>Falaise ocre</span>
              <span>Neige</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
