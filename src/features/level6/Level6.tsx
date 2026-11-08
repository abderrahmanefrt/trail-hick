import React, { useState, useCallback, useMemo } from 'react';
import { T } from '@/data/texts';
import { generateTerrain, type TerrainPreset } from '@/core/terrain';
import { convolve2d, type Kernel2D } from '@/core/convolve2d';
import { slopeMap } from '@/core/slope';
import {
  boxBlur,
  gaussian,
  sharpen,
  laplacian,
  emboss,
  sobelX,
  sobelY,
} from '@/core/kernels';
import { getPixel, type BorderMode } from '@/core/grid';
import PixelGrid from '@/components/PixelGrid';
import KernelEditor from '@/components/KernelEditor';
import StepCalculator from '@/components/StepCalculator';

const REQUIRED_FILTERS = 3;

type PresetKey =
  | 'boxBlur'
  | 'gaussian'
  | 'sharpen'
  | 'laplacian'
  | 'emboss'
  | 'sobelX'
  | 'sobelY'
  | 'slope';

interface FilterConfig {
  kernel: Kernel2D;
  isSlope: boolean;
  name: string;
}

const FILTER_PRESETS: Record<PresetKey, FilterConfig> = {
  boxBlur: { kernel: boxBlur, isSlope: false, name: T.filters.boxBlur.name },
  gaussian: { kernel: gaussian, isSlope: false, name: T.filters.gaussian.name },
  sharpen: { kernel: sharpen, isSlope: false, name: T.filters.sharpen.name },
  laplacian: { kernel: laplacian, isSlope: false, name: T.filters.laplacian.name },
  emboss: { kernel: emboss, isSlope: false, name: T.filters.emboss.name },
  sobelX: { kernel: sobelX, isSlope: false, name: T.filters.sobelX.name },
  sobelY: { kernel: sobelY, isSlope: false, name: T.filters.sobelY.name },
  slope: { kernel: sobelX, isSlope: true, name: T.filters.slope.name },
};

const DEFAULT_CUSTOM: Kernel2D = {
  values: [0, -1, 0, -1, 4, -1, 0, -1, 0],
  divisor: 1,
  offset: 0,
};

interface Level6Props {
  onComplete: () => void;
}

/**
 * Level 6 (Étape 5): "L'Atelier Libre du Cartographe".
 * Full cartographer toolkit: presets (blur, sharpen, edges, hillshade, slope),
 * custom 3x3 kernel editor, live pixel inspector, and massif/plateau terrain presets.
 * Success: 3 filters tested.
 */
export default function Level6({ onComplete }: Level6Props): React.JSX.Element {
  const [terrainType, setTerrainType] = useState<TerrainPreset>('massif');
  const [activeFilterKey, setActiveFilterKey] = useState<PresetKey | 'custom'>('boxBlur');
  const [customKernel, setCustomKernel] = useState<Kernel2D>(DEFAULT_CUSTOM);
  const [testedFilters, setTestedFilters] = useState<Set<string>>(new Set());
  const [inspectedPos, setInspectedPos] = useState<{ x: number; y: number } | null>(null);
  const [borderMode] = useState<BorderMode>('clamp');

  const terrain = useMemo(() => {
    return generateTerrain(terrainType, 73, 16);
  }, [terrainType]);

  const activeConfig =
    activeFilterKey === 'custom'
      ? { kernel: customKernel, isSlope: false, name: '✏️ Noyau sur mesure' }
      : (FILTER_PRESETS[activeFilterKey] ?? FILTER_PRESETS.boxBlur);

  const filteredGrid = useMemo(() => {
    if (activeConfig.isSlope) {
      return slopeMap(terrain, borderMode);
    }
    return convolve2d(terrain, activeConfig.kernel, { borderMode });
  }, [terrain, activeConfig, borderMode]);

  const handleSelectFilter = useCallback(
    (key: PresetKey | 'custom') => {
      setActiveFilterKey(key);
      setTestedFilters((prev) => {
        const next = new Set(prev);
        next.add(key);
        if (next.size >= REQUIRED_FILTERS) {
          onComplete();
        }
        return next;
      });
    },
    [onComplete],
  );

  const inspectedNeighbours = inspectedPos
    ? Array.from({ length: 9 }, (_, idx) => {
        const kx = (idx % 3) - 1;
        const ky = Math.floor(idx / 3) - 1;
        return getPixel(terrain, inspectedPos.x + kx, inspectedPos.y + ky, borderMode);
      })
    : null;

  const levelInfo = T.levels.find((l) => l.id === 5);
  const requiresDisplayShift =
    activeFilterKey === 'emboss' ||
    activeFilterKey === 'laplacian' ||
    activeFilterKey === 'sobelX' ||
    activeFilterKey === 'sobelY';

  return (
    <div className="space-y-6">
      <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-stone-700 leading-relaxed">
        <p>{levelInfo?.description}</p>
      </div>

      {/* Terrain Switch & Tool Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-stone-600 uppercase tracking-wide">
            Relief :
          </span>
          <button
            type="button"
            onClick={() => setTerrainType('massif')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              terrainType === 'massif'
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            🏔️ Massif (Sommets & Lac)
          </button>
          <button
            type="button"
            onClick={() => setTerrainType('plateau')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
              terrainType === 'plateau'
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
            }`}
          >
            🗻 Plateau (Ligne de falaise)
          </button>
        </div>

        <div className="text-xs font-bold text-stone-700 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-300">
          Outils testés : {testedFilters.size} / {REQUIRED_FILTERS}
        </div>
      </div>

      {/* Preset Toolbar */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_PRESETS) as PresetKey[]).map((key) => {
          const cfg = FILTER_PRESETS[key];
          if (!cfg) return null;
          const isSelected = activeFilterKey === key;
          const isDone = testedFilters.has(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'bg-orange-600 text-white border-orange-700 shadow-sm ring-1 ring-orange-300'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              } ${isDone && !isSelected ? 'border-emerald-500' : ''}`}
            >
              {cfg.name}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handleSelectFilter('custom')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs ${
            activeFilterKey === 'custom'
              ? 'bg-orange-600 text-white border-orange-700 shadow-sm'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          ✏️ Personnalisé
        </button>
      </div>

      {requiresDisplayShift && (
        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs shadow-xs leading-relaxed">
          <strong>Note de cartographie :</strong> Ce filtre différentiel génère des
          valeurs négatives ou au-delà de 255.
          {activeFilterKey === 'emboss'
            ? ' Un décalage de +128 est appliqué pour centrer la lumière neutre sur le gris moyen.'
            : ' Les valeurs négatives sont ramenées à 0 (noir) et les dépassements à 255 (blanc) pour la visualisation.'}
        </div>
      )}

      {/* Side-by-side Canvases with Wooden Frames */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Carte source (cliquez pour inspecter)
          </span>
          <div className="wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
            <PixelGrid
              grid={terrain}
              cellSize={20}
              showNumbers={false}
              showGrid={true}
              highlightWindow={inspectedPos}
              onCellClick={(x, y) => setInspectedPos({ x, y })}
              ariaLabel="Carte d'altitude source"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
            {activeConfig.name}
          </span>
          <div className="wood-frame rounded-2xl p-2 bg-[#fdfaf3]">
            <PixelGrid
              grid={filteredGrid}
              cellSize={20}
              showNumbers={false}
              showGrid={true}
              ariaLabel="Résultat de la convolution"
            />
          </div>
        </div>
      </div>

      {activeFilterKey === 'custom' && (
        <div className="wood-board rounded-2xl p-5 max-w-md mx-auto text-white relative shadow-md">
          <span className="wood-rivet absolute top-2.5 left-2.5" />
          <span className="wood-rivet absolute top-2.5 right-2.5" />
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-200 mb-3 text-center">
            Atelier de forge du noyau 3×3
          </h4>
          <div className="parchment-panel rounded-xl p-4 text-stone-900">
            <KernelEditor kernel={customKernel} onChange={setCustomKernel} />
          </div>
        </div>
      )}

      {inspectedPos && inspectedNeighbours && (
        <div className="pt-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-stone-700 mb-2">
            Inspection en direct du point ({inspectedPos.x}, {inspectedPos.y})
          </h4>
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <StepCalculator
              pixels={inspectedNeighbours}
              coefficients={activeConfig.kernel.values}
              divisor={activeConfig.kernel.divisor}
              offset={activeConfig.kernel.offset}
            />
          </div>
        </div>
      )}
    </div>
  );
}
