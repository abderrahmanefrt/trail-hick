import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { UserProgress, SeasonId } from '@/types/trailvision';
import { SEASONS, TRAILVISION_TEXT } from '@/data/trailvisionTexts';

interface FinalRevealProps {
  progress: UserProgress;
  onRestartFullAdventure: () => void;
  onReplaySeasons: () => void;
  onSelectSeason: (s: SeasonId) => void;
}

interface KernelPreset {
  id: string;
  name: string;
  icon: string;
  values: number[];
  divisor: number;
  offset: number;
  description: string;
  seasonOrigin: string;
}

const PRESET_KERNELS: KernelPreset[] = [
  {
    id: 'blur',
    name: 'Uniform Box Blur',
    icon: '🌫️',
    values: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    divisor: 9,
    offset: 0,
    description: 'Averages the 8 immediate neighbors equally. Reduces high-frequency grain and noise.',
    seasonOrigin: 'Mission 04: Winter (Fog)',
  },
  {
    id: 'gaussian',
    name: 'Gaussian Smoothing',
    icon: '🌥️',
    values: [1, 2, 1, 2, 4, 2, 1, 2, 1],
    divisor: 16,
    offset: 0,
    description: 'Weights the central pixel more heavily (25%) than edges and corners. Preserves structure while smoothing.',
    seasonOrigin: 'Mission 04: Winter (Blizzard)',
  },
  {
    id: 'edges',
    name: 'Ridge & Edge Detector',
    icon: '📐',
    values: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    divisor: 1,
    offset: 0,
    description: 'Sums to 0 in flat zones. When neighboring pixels differ sharply, edges glow brightly!',
    seasonOrigin: 'Mission 03: Fall (Trail Borders)',
  },
  {
    id: 'sharpen',
    name: 'Telescopic Sharpen',
    icon: '🔭',
    values: [0, -1, 0, -1, 5, -1, 0, -1, 0],
    divisor: 1,
    offset: 0,
    description: 'Boosts local contrast by subtracting surrounding neighbors and amplifying the center.',
    seasonOrigin: 'Mission 01: Spring (Feature Extraction)',
  },
  {
    id: 'emboss',
    name: 'Sunlight Relief (Emboss)',
    icon: '🌄',
    values: [-2, -1, 0, -1, 1, 1, 0, 1, 2],
    divisor: 1,
    offset: 128,
    description: 'Simulates a low-angle sunset casting realistic 3D shadows across topography.',
    seasonOrigin: 'Mission 02: Summer (Light Angles)',
  },
];

export default function FinalReveal({
  progress,
  onReplaySeasons,
  onSelectSeason,
}: FinalRevealProps): React.JSX.Element {
  const [activePreset, setActivePreset] = useState<KernelPreset>(PRESET_KERNELS[2]!); // Edge detector default
  const [customValues, setCustomValues] = useState<number[]>(PRESET_KERNELS[2]!.values);
  const [customDivisor, setCustomDivisor] = useState<number>(1);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  const srcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>({ x: 14, y: 14 });

  // Draw source image on source canvas (Mountain with trail, trees, and lake)
  const drawSourceImage = useCallback(() => {
    const srcCanvas = srcCanvasRef.current;
    if (!srcCanvas) return;
    const ctx = srcCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = (srcCanvas.width = 180);
    const h = (srcCanvas.height = 180);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.5);
    sky.addColorStop(0, '#38BDF8');
    sky.addColorStop(1, '#BAE6FD');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Peak
    ctx.fillStyle = '#64748B';
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.6);
    ctx.lineTo(w * 0.5, h * 0.15);
    ctx.lineTo(w * 0.9, h * 0.65);
    ctx.fill();

    // Snowcap
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.15);
    ctx.lineTo(w * 0.38, h * 0.32);
    ctx.lineTo(w * 0.46, h * 0.28);
    ctx.lineTo(w * 0.54, h * 0.34);
    ctx.lineTo(w * 0.62, h * 0.3);
    ctx.fill();

    // Foreground grass and lake
    ctx.fillStyle = '#15803D';
    ctx.fillRect(0, h * 0.6, w, h * 0.4);

    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.8, w * 0.4, h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  // Run live 3x3 convolution
  const runConvolution = useCallback(() => {
    const srcCanvas = srcCanvasRef.current;
    const outCanvas = outCanvasRef.current;
    if (!srcCanvas || !outCanvas) return;

    const srcCtx = srcCanvas.getContext('2d', { willReadFrequently: true });
    const outCtx = outCanvas.getContext('2d');
    if (!srcCtx || !outCtx) return;

    const w = (outCanvas.width = srcCanvas.width);
    const h = (outCanvas.height = srcCanvas.height);

    const srcImg = srcCtx.getImageData(0, 0, w, h);
    const src = srcImg.data;
    const outImg = outCtx.createImageData(w, h);
    const dst = outImg.data;

    const vals = isCustomMode ? customValues : activePreset.values;
    const div = Math.max(0.001, isCustomMode ? customDivisor : activePreset.divisor);
    const offset = activePreset.offset;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        let sumR = 0;
        let sumG = 0;
        let sumB = 0;

        let ki = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const weight = vals[ki++] ?? 0;
            const idx = ((y + ky) * w + (x + kx)) * 4;
            sumR += (src[idx] ?? 0) * weight;
            sumG += (src[idx + 1] ?? 0) * weight;
            sumB += (src[idx + 2] ?? 0) * weight;
          }
        }

        const outIdx = (y * w + x) * 4;
        dst[outIdx] = Math.max(0, Math.min(255, Math.round(sumR / div + offset)));
        dst[outIdx + 1] = Math.max(0, Math.min(255, Math.round(sumG / div + offset)));
        dst[outIdx + 2] = Math.max(0, Math.min(255, Math.round(sumB / div + offset)));
        dst[outIdx + 3] = 255;
      }
    }

    outCtx.putImageData(outImg, 0, 0);
  }, [activePreset, isCustomMode, customValues, customDivisor]);

  useEffect(() => {
    drawSourceImage();
    runConvolution();
  }, [drawSourceImage, runConvolution]);

  const handleSelectPreset = (p: KernelPreset) => {
    setActivePreset(p);
    setCustomValues([...p.values]);
    setCustomDivisor(p.divisor);
    setIsCustomMode(false);
  };

  const handleUpdateCustomCell = (idx: number, val: number) => {
    setIsCustomMode(true);
    setCustomValues((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12 animate-in fade-in duration-700">
      {/* Dramatic Revelation Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0F172A] p-8 sm:p-12 text-white shadow-2xl border-2 border-amber-400/40 text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <p className="text-xs sm:text-sm font-black tracking-widest uppercase text-amber-300">
            {TRAILVISION_TEXT.reveal.teaser1}
          </p>

          <p className="text-stone-300 text-sm italic">
            {TRAILVISION_TEXT.reveal.teaser2}
          </p>

          <h2 className="text-4xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-rose-200 drop-shadow-lg">
            {TRAILVISION_TEXT.reveal.bigWord}
          </h2>

          <p className="text-base sm:text-xl font-serif text-stone-200">
            {TRAILVISION_TEXT.reveal.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl mx-auto pt-2">
            {TRAILVISION_TEXT.reveal.narrative}
          </p>
        </div>

        {/* 4 Seasonal Badges Unlocked Showcase */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {(['spring', 'summer', 'fall', 'winter'] as SeasonId[]).map((sid) => {
            const s = SEASONS[sid];
            return (
              <div
                key={sid}
                className="p-3 rounded-2xl bg-white/5 border border-white/15 backdrop-blur-md flex flex-col items-center text-center space-y-1"
              >
                <span className="text-2xl">{s.badgeIcon}</span>
                <span className="text-xs font-black text-amber-300">{s.badgeName}</span>
                <span className="text-[10px] text-stone-400">{s.name} Mission</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 4-Way Scientific Connection Grid */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            How Your 4 Hiking Expeditions Secretly Taught You Computer Vision
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            Every seasonal mystery you solved maps to a core mathematical operation in machine perception.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {(['spring', 'summer', 'fall', 'winter'] as SeasonId[]).map((sid) => {
            const s = SEASONS[sid];
            return (
              <div
                key={sid}
                className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-2.5 relative overflow-hidden"
                style={{ borderLeft: `6px solid ${s.colors.primary}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-stone-400">
                    {s.name} Expedition
                  </span>
                  <span className="text-lg">{s.badgeIcon}</span>
                </div>

                <h4 className="text-base font-black text-stone-900">
                  {s.scientificConceptRevealed}
                </h4>

                <p className="text-xs text-stone-700 leading-relaxed">
                  {s.scientificExplanation}
                </p>

                <div className="pt-2 text-[11px] text-stone-500 font-medium">
                  Outdoor Disguise: <em>{s.missionTitle}</em>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Interactive Kernel Laboratory */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>🔬</span>
              <span>{TRAILVISION_TEXT.reveal.interactiveLabTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
              {TRAILVISION_TEXT.reveal.interactiveLabSubtitle}
            </p>
          </div>

          <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full border border-amber-300">
            Real Canvas Convolution Engine
          </span>
        </div>

        {/* Filter Presets Toolbar */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-stone-500">
            Select a 3×3 Convolution Kernel:
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESET_KERNELS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  activePreset.id === p.id && !isCustomMode
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* The Live Interactive Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left Canvas: Source Image */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-stone-600">
              1. Original Input Image
            </span>
            <div className="rounded-2xl border-4 border-stone-300 bg-stone-900 p-1 shadow-md">
              <canvas ref={srcCanvasRef} className="block w-[180px] h-[180px] rounded-xl" />
            </div>
            <span className="text-[11px] text-stone-500">Matrix of RGB Pixel Values</span>
          </div>

          {/* Center: The 3x3 Sliding Kernel Grid Editor */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-3 bg-stone-50 p-4 rounded-3xl border border-stone-200">
            <div className="text-center space-y-0.5">
              <span className="block text-xs font-black uppercase text-stone-800">
                2. 3×3 Sliding Window (Kernel)
              </span>
              <p className="text-[11px] text-stone-500">
                {activePreset.description}
              </p>
            </div>

            {/* 3x3 Numerical Matrix */}
            <div className="grid grid-cols-3 gap-1.5 max-w-[190px]">
              {(isCustomMode ? customValues : activePreset.values).map((v, idx) => (
                <input
                  key={idx}
                  type="number"
                  value={v}
                  onChange={(e) => handleUpdateCustomCell(idx, parseFloat(e.target.value) || 0)}
                  className={`w-14 h-12 text-center font-mono font-black text-sm rounded-xl border transition-colors shadow-xs ${
                    idx === 4
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                      : 'bg-white border-stone-300 text-stone-800'
                  }`}
                  title={`Kernel Coefficient [${idx % 3}, ${Math.floor(idx / 3)}]`}
                />
              ))}
            </div>

            {/* Divisor & Offset info */}
            <div className="flex items-center justify-between w-full text-xs font-mono px-2 pt-1 border-t border-stone-200">
              <span className="text-stone-500">
                Divisor: <strong>÷ {isCustomMode ? customDivisor : activePreset.divisor}</strong>
              </span>
              <span className="text-stone-500">
                Offset: <strong>+ {activePreset.offset}</strong>
              </span>
            </div>
          </div>

          {/* Right Canvas: Output Transformed Image */}
          <div className="lg:col-span-4 flex flex-col items-center space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
              3. Convolved Result
            </span>
            <div className="rounded-2xl border-4 border-emerald-600 bg-stone-900 p-1 shadow-md">
              <canvas ref={outCanvasRef} className="block w-[180px] h-[180px] rounded-xl" />
            </div>
            <span className="text-[11px] text-emerald-700 font-bold">
              Transformed Image Output
            </span>
          </div>
        </div>

        {/* Step-by-step arithmetic summary */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧮</span>
            <div>
              <strong className="block font-bold">The Universal Mathematical Formula:</strong>
              <span className="font-mono text-[11px] text-amber-900">
                NewPixel(x, y) = [ ∑ (Neighbor_i × Weight_i) ] ÷ Divisor + Offset
              </span>
            </div>
          </div>

          <span className="text-xs font-serif italic text-amber-900">
            One single formula transforms the world!
          </span>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-8 sm:p-10 rounded-3xl bg-stone-900 text-white text-center space-y-6 shadow-2xl border-2 border-amber-400/30">
        <div className="space-y-2">
          <span className="text-3xl" role="img" aria-label="Trophy">
            🏆
          </span>
          <h4 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
            {TRAILVISION_TEXT.reveal.congratsTitle}
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            “You didn’t just explore four seasons. You discovered how machines see the world.”
          </p>
        </div>

        {/* Action Buttons to Replay */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
          {/* Primary Action: Replay Full Adventure from Mission 1 */}
          <button
            type="button"
            onClick={onRestartFullAdventure}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-amber-300/40"
          >
            <span>🔄</span>
            <span>Rejouer toute l'Aventure (Recommencer)</span>
          </button>

          {/* Secondary Action: Choose a specific season */}
          <button
            type="button"
            onClick={onReplaySeasons}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🗺️</span>
            <span>Choisir une Saison</span>
          </button>
        </div>
      </div>
    </div>
  );
}
