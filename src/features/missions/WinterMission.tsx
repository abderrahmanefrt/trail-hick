import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SEASONS } from '@/data/trailvisionTexts';

interface WinterMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

type FogPreset = 'clear' | 'light' | 'heavy';

export default function WinterMission({
  onComplete,
  isCompleted,
}: WinterMissionProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [blurLevel, setBlurLevel] = useState<number>(1); // 0 = clear, 1 = light, 2 = heavy
  const [normalize, setNormalize] = useState<boolean>(true); // Divisor active
  const [beaconFound, setBeaconFound] = useState<boolean>(false);

  const rawImageBufferRef = useRef<ImageData | null>(null);

  const meta = SEASONS.winter;

  // Render snowy peak with noise, then apply true 3x3 neighbor convolution
  const drawWinterScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = 640);
    const height = (canvas.height = 400);

    // 1. Draw snowy mountain landscape
    // Pale winter sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.7);
    skyGrad.addColorStop(0, '#6286A8');
    skyGrad.addColorStop(0.5, '#A8C5DF');
    skyGrad.addColorStop(1, '#EAF1F8');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Distant jagged snowy ridges
    ctx.fillStyle = '#CBD5E1';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.45);
    ctx.lineTo(width * 0.2, height * 0.25);
    ctx.lineTo(width * 0.45, height * 0.4);
    ctx.lineTo(width * 0.7, height * 0.2);
    ctx.lineTo(width, height * 0.42);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Foreground snowy slopes
    const snowGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
    snowGrad.addColorStop(0, '#E2E8F0');
    snowGrad.addColorStop(1, '#F8FAFC');
    ctx.fillStyle = snowGrad;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.6);
    ctx.lineTo(width * 0.4, height * 0.5);
    ctx.lineTo(width * 0.75, height * 0.68);
    ctx.lineTo(width, height * 0.55);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Dark pine trees dotted in snow
    ctx.fillStyle = '#1E293B';
    const treePositions = [
      [80, 260], [120, 275], [170, 290],
      [420, 280], [470, 270], [530, 295],
    ];
    for (const [tx, ty] of treePositions) {
      if (!tx || !ty) continue;
      ctx.beginPath();
      ctx.moveTo(tx, ty - 26);
      ctx.lineTo(tx + 12, ty);
      ctx.lineTo(tx - 12, ty);
      ctx.fill();
    }

    // The Warm Refuge Cabin with Glowing Beacon Light
    const hutX = width * 0.62;
    const hutY = height * 0.46;

    // Hut body
    ctx.fillStyle = '#451A03';
    ctx.fillRect(hutX - 16, hutY - 12, 32, 22);

    // Hut roof
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.moveTo(hutX - 22, hutY - 12);
    ctx.lineTo(hutX, hutY - 26);
    ctx.lineTo(hutX + 22, hutY - 12);
    ctx.fill();

    // Glowing Golden Beacon on roof!
    ctx.save();
    ctx.shadowColor = '#FBBF24';
    ctx.shadowBlur = 25;
    ctx.fillStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(hutX, hutY - 28, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Add high-frequency blizzard speckle noise
    const preNoise = ctx.getImageData(0, 0, width, height);
    const pData = preNoise.data;
    for (let i = 0; i < pData.length; i += 16) {
      if (Math.random() > 0.4) {
        const noise = (Math.random() - 0.5) * 80;
        pData[i] = Math.max(0, Math.min(255, (pData[i] ?? 0) + noise));
        pData[i + 1] = Math.max(0, Math.min(255, (pData[i + 1] ?? 0) + noise));
        pData[i + 2] = Math.max(0, Math.min(255, (pData[i + 2] ?? 0) + noise));
      }
    }
    ctx.putImageData(preNoise, 0, 0);

    const baseData = ctx.getImageData(0, 0, width, height);
    rawImageBufferRef.current = baseData;

    // 2. Perform Real Spatial Convolution Filtering
    if (blurLevel > 0) {
      const src = baseData.data;
      const out = ctx.createImageData(width, height);
      const dst = out.data;

      // Gaussian / Box kernel weights
      // 3x3 Gaussian approximation:
      // [1, 2, 1,
      //  2, 4, 2,
      //  1, 2, 1] / 16
      const weights = blurLevel === 1
        ? [1, 2, 1, 2, 4, 2, 1, 2, 1] // Gaussian
        : [1, 1, 1, 1, 1, 1, 1, 1, 1]; // Heavy Box

      const divisor = normalize ? (blurLevel === 1 ? 16 : 9) : 1; // Demonstration of saturation if 1!

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let sumR = 0;
          let sumG = 0;
          let sumB = 0;

          let k = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const w = weights[k++] ?? 1;
              const idx = ((y + ky) * width + (x + kx)) * 4;

              sumR += (src[idx] ?? 0) * w;
              sumG += (src[idx + 1] ?? 0) * w;
              sumB += (src[idx + 2] ?? 0) * w;
            }
          }

          const outIdx = (y * width + x) * 4;
          // Clamping to [0, 255]
          dst[outIdx] = Math.min(255, Math.round(sumR / divisor));
          dst[outIdx + 1] = Math.min(255, Math.round(sumG / divisor));
          dst[outIdx + 2] = Math.min(255, Math.round(sumB / divisor));
          dst[outIdx + 3] = 255;
        }
      }

      ctx.putImageData(out, 0, 0);
    }
  }, [blurLevel, normalize]);

  useEffect(() => {
    drawWinterScene();
  }, [drawWinterScene]);

  // Click on the beacon light in the blizzard
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Hut beacon target around 62%, 46%
    const dist = Math.hypot(xPct - 62, yPct - 42);
    if (dist < 10) {
      setBeaconFound(true);
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Objective Ribbon */}
      <div className="p-4 rounded-2xl bg-[#EAF1F8] border border-[#6286A8]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">❄️</span>
          <div>
            <h4 className="text-sm font-black tracking-tight text-[#192B40]">
              MISSION OBJECTIVE: Smooth the Blizzard Noise to Locate the Alpine Refuge
            </h4>
            <p className="text-xs text-stone-600">
              High-frequency snowflakes disrupt vision. Adjust your goggle filter to average neighboring pixels and click the glowing refuge beacon light!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white/90 px-3.5 py-1.5 rounded-xl border border-sky-300 font-mono text-xs font-bold text-sky-950">
          <span>Refuge Beacon:</span>
          <span className={beaconFound ? 'text-emerald-600 font-bold' : 'text-amber-700'}>
            {beaconFound ? 'Refuge Located! ✓' : 'Search in blizzard'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Canvas & Visibility Slider */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border-4 border-[#192B40] bg-[#0c141d] p-1.5 shadow-2xl overflow-hidden relative">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto block rounded-2xl cursor-pointer"
            />

            {/* Refuge Beacon Callout if found */}
            {beaconFound && (
              <div className="absolute top-1/3 left-[62%] -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-emerald-950/90 border border-emerald-400 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce shadow-xl">
                <span>🏔️</span>
                <span>Refuge Beacon Locked!</span>
              </div>
            )}
          </div>

          {/* Visibility Controls */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-stone-800">
              <span className="uppercase tracking-wider">Alpine Goggle Filter Controls</span>
              <span className="font-mono text-sky-800 font-bold">
                {blurLevel === 0 ? 'Clear (Raw Sensor Grain)' : blurLevel === 1 ? 'Mild Smoothing (Gaussian /16)' : 'Heavy Fog (Box Blur /9)'}
              </span>
            </div>

            {/* Preset Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBlurLevel(0)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  blurLevel === 0
                    ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                1. Clear Vision (Noisy)
              </button>
              <button
                type="button"
                onClick={() => setBlurLevel(1)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  blurLevel === 1
                    ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                2. Light Fog (Gaussian)
              </button>
              <button
                type="button"
                onClick={() => setBlurLevel(2)}
                className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  blurLevel === 2
                    ? 'bg-sky-700 text-white border-sky-800 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                3. Heavy Fog (Box Blur)
              </button>
            </div>

            {/* Normalization Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
              <span className="text-stone-600">
                Divisor / Weight Balance: <strong>{normalize ? 'Enabled (Balanced)' : 'Disabled (Divisor = 1)'}</strong>
              </span>

              <button
                type="button"
                onClick={() => setNormalize(!normalize)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer border ${
                  !normalize
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-stone-100 border-stone-300 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {!normalize ? '⚠️ Whiteout Warning Active!' : 'Test Without Divisor (Whiteout)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 3x3 Neighborhood Averaging Visualizer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h5 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                Neighbor Blending Lens
              </h5>
              <span className="text-xs text-stone-400 font-mono">Mission 04</span>
            </div>

            {/* 3x3 Grid Demonstration */}
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
              <span className="block text-xs font-black text-sky-950 uppercase">
                How 9 Neighbors Average Noise
              </span>
              <p className="text-[11px] text-sky-900 leading-relaxed">
                When a random snowflake hits a single pixel, its isolated bright spike is absorbed by averaging the 8 surrounding pixels.
              </p>

              {/* 3x3 Matrix Grid */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 max-w-[210px] mx-auto text-center font-mono text-xs">
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">1</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">2</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">1</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">2</div>
                <div className="p-2 bg-amber-100 rounded-lg border border-amber-300 font-black text-amber-900">4 •</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">2</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">1</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">2</div>
                <div className="p-2 bg-white rounded-lg border border-sky-200 font-bold text-sky-800">1</div>
              </div>

              <div className="text-center font-mono text-xs text-sky-950 pt-1">
                Sum of 9 weights = <strong>16</strong> &rarr; Divided by <strong>16</strong>
              </div>
            </div>

            {/* Saturation lesson */}
            {!normalize && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-300 text-xs text-red-950 space-y-1 animate-in fade-in">
                <strong className="block font-bold">⚠️ Avalanche of Saturation:</strong>
                <p className="text-[11px] leading-relaxed text-red-900">
                  Without dividing by the sum of weights, values explode past 255. The screen becomes blinding white snow!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
