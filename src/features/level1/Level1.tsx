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
 * Walkie-talkie device SVG illustration matching the reference screenshot.
 */
function WalkieTalkieGraphic(): React.JSX.Element {
  return (
    <svg
      width="36"
      height="46"
      viewBox="0 0 36 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm"
      aria-hidden="true"
    >
      {/* Antenna */}
      <rect x="7" y="0" width="3" height="14" rx="1.5" fill="#332a24" />
      <rect x="8" y="0" width="1" height="14" fill="#52453c" />
      {/* Volume knob */}
      <rect x="23" y="4" width="6" height="5" rx="1" fill="#332a24" />

      {/* Main body */}
      <rect
        x="2"
        y="9"
        width="32"
        height="36"
        rx="6"
        fill="#4d3a2b"
        stroke="#2b1f16"
        strokeWidth="1.5"
      />
      {/* Rubber grips */}
      <rect x="0.5" y="15" width="2" height="24" rx="1" fill="#2b1f16" />
      <rect x="33.5" y="15" width="2" height="24" rx="1" fill="#2b1f16" />

      {/* LCD Screen */}
      <rect
        x="7"
        y="14"
        width="22"
        height="11"
        rx="2"
        fill="#7fa668"
        stroke="#37482d"
        strokeWidth="1"
      />
      {/* Screen text line */}
      <rect x="9" y="17" width="14" height="2" rx="0.5" fill="#26351e" />
      <rect x="9" y="21" width="10" height="2" rx="0.5" fill="#26351e" />

      {/* Speaker grill holes */}
      <circle cx="11" cy="31" r="1.2" fill="#2b1f16" />
      <circle cx="16" cy="31" r="1.2" fill="#2b1f16" />
      <circle cx="21" cy="31" r="1.2" fill="#2b1f16" />
      <circle cx="25" cy="31" r="1.2" fill="#2b1f16" />
      <circle cx="13" cy="35" r="1.2" fill="#2b1f16" />
      <circle cx="18" cy="35" r="1.2" fill="#2b1f16" />
      <circle cx="23" cy="35" r="1.2" fill="#2b1f16" />
      <circle cx="15" cy="39" r="1.2" fill="#2b1f16" />
      <circle cx="20" cy="39" r="1.2" fill="#2b1f16" />
    </svg>
  );
}

/**
 * Level 1: "Lire la carte (Pixel = Altitude)".
 * Crafted to match every detail of the reference mountain signboard UI mockup.
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

  return (
    <div className="space-y-6">
      {/* Top Explanatory Note & Walkie-Talkie Button Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left message bubble */}
        <div className="flex-1 p-3.5 rounded-2xl bg-[#f4f7f6] border border-[#d6e0dd] text-stone-700 text-xs leading-relaxed shadow-xs">
          Chaque case est un pixel contenant une valeur de 0 à 255. 0 est une vallée
          d'ombre, 255 est un pic enneigé. L'altimètre sonore monte dans les aigus quand
          vous montez en altitude !
        </div>

        {/* Right Walkie-talkie toggle */}
        <button
          type="button"
          onClick={toggle}
          className={`shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all cursor-pointer shadow-sm border ${
            enabled
              ? 'bg-[#244b20] text-emerald-100 border-[#183515] ring-2 ring-emerald-400'
              : 'bg-[#4a5840] hover:bg-[#3d4a34] text-amber-50 border-[#303c28]'
          }`}
          aria-pressed={enabled}
        >
          <WalkieTalkieGraphic />
          <div className="text-left font-sans">
            <span className="block text-xs font-bold leading-tight">
              {enabled ? '📻 Altimètre sonore actif' : "📻 Activer l'altimètre sonore"}
            </span>
            <span className="text-[10px] text-amber-200/80">
              {enabled ? 'Cliquez pour couper' : 'Volume selon altitude'}
            </span>
          </div>
        </button>
      </div>

      {/* Main 2-column layout: Map on Left, Directional Signpost on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Canvas Map framed in rich wood */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-[420px] map-wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
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

        {/* Right Column: 3 Directional Trail Signs mounted on wooden posts */}
        <div className="lg:col-span-5 relative flex flex-col gap-3.5 pt-1">
          {/* Two vertical wooden poles running behind the sign boards */}
          <div
            className="absolute left-10 top-0 bottom-0 w-3 bg-gradient-to-r from-[#593418] via-[#754622] to-[#4e2b12] rounded-full shadow-inner pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute right-10 top-0 bottom-0 w-3 bg-gradient-to-r from-[#593418] via-[#754622] to-[#4e2b12] rounded-full shadow-inner pointer-events-none"
            aria-hidden="true"
          />

          {/* Plank 1: Altimètre de poche (Carved wood plank) */}
          <div className="relative z-10 wood-plank-brown rounded-2xl p-4 text-white shadow-md">
            <span className="screw-rivet-gold absolute top-2.5 left-2.5" />
            <span className="screw-rivet-gold absolute top-2.5 right-2.5" />
            <span className="screw-rivet-gold absolute bottom-2.5 left-2.5" />
            <span className="screw-rivet-gold absolute bottom-2.5 right-2.5" />

            <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-[#b57a4a]/60">
              <span className="text-base">📍</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-100">
                Altimètre de poche
              </h4>
            </div>

            {currentCell ? (
              <div className="parchment-box rounded-xl p-3 text-stone-900 space-y-1.5 shadow-inner">
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
                <div className="text-xs font-bold text-emerald-900 bg-emerald-100/90 px-2 py-1 rounded-md border border-emerald-300">
                  {getAltitudeDescriptor(currentCell.val)}
                </div>
              </div>
            ) : (
              <div className="parchment-box rounded-xl p-3 text-stone-700 text-xs italic text-center leading-relaxed">
                Cliquez sur n'importe quelle case de la carte pour mesurer l'altitude du
                point.
              </div>
            )}
          </div>

          {/* Plank 2: Progression de la reconnaissance (Weathered green wood plank) */}
          <div className="relative z-10 wood-plank-green rounded-2xl p-4 text-white shadow-md">
            <span className="screw-rivet-gold absolute top-2.5 left-2.5" />
            <span className="screw-rivet-gold absolute top-2.5 right-2.5" />
            <span className="screw-rivet-gold absolute bottom-2.5 left-2.5" />
            <span className="screw-rivet-gold absolute bottom-2.5 right-2.5" />

            <h4 className="text-xs font-black uppercase tracking-wider text-amber-100 mb-2.5 text-center">
              Progression de la reconnaissance
            </h4>

            <div className="parchment-box rounded-xl p-3 text-stone-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-stone-700">
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

              {/* Dotted path with hiker milestone icon */}
              <div className="relative py-1">
                <div className="w-full border-b-2 border-dashed border-[#bda688] my-2" />
                <div
                  className="absolute -top-1 transition-all duration-300 text-sm"
                  style={{
                    left: `calc(${Math.min(90, (visited.size / REQUIRED_CLICKS) * 90)}%)`,
                  }}
                >
                  🚩
                </div>
              </div>
            </div>
          </div>

          {/* Plank 3: Metallic Slate Bezel Altitude Gauge */}
          <div className="relative z-10 metal-bezel-panel rounded-2xl p-4 text-white shadow-md">
            <span className="screw-rivet-silver absolute top-2.5 left-2.5" />
            <span className="screw-rivet-silver absolute top-2.5 right-2.5" />
            <span className="screw-rivet-silver absolute bottom-2.5 left-2.5" />
            <span className="screw-rivet-silver absolute bottom-2.5 right-2.5" />

            {/* Color spectrum bar with 5 sections: Red -> Orange -> Yellow -> Light Green -> Dark Green */}
            <div className="relative h-6 rounded-lg overflow-hidden border-2 border-stone-800 shadow-inner flex">
              <div className="h-full flex-1 bg-[#dc2626]" title="Vallée basse / Rouge" />
              <div className="h-full flex-1 bg-[#ea580c]" title="Pente basse / Orange" />
              <div className="h-full flex-1 bg-[#eab308]" title="Plateau moyen / Jaune" />
              <div className="h-full flex-1 bg-[#84cc16]" title="Alpage / Vert clair" />
              <div
                className="h-full flex-1 bg-[#15803d]"
                title="Forêt haute / Vert foncé"
              />

              {/* Needle cursor */}
              {currentCell && (
                <div
                  className="absolute top-0 bottom-0 w-2 bg-white border border-black shadow-lg transition-all duration-150"
                  style={{
                    left: `calc(${(currentCell.val / 255) * 100}% - 4px)`,
                  }}
                  title={`Altitude : ${currentCell.val}`}
                />
              )}
            </div>

            <div className="mt-2 text-center text-[11px] font-mono text-stone-300 font-bold">
              {visited.size} / {REQUIRED_CLICKS} cases explorées
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
