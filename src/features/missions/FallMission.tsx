import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { TrailCheckpoint } from '@/types/trailvision';
import { SEASONS } from '@/data/trailvisionTexts';

interface FallMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

type VisionMode = 'normal' | 'boundary' | 'enhanced';

const INITIAL_CHECKPOINTS: TrailCheckpoint[] = [
  { id: 'cairn1', label: 'Trailhead Rock Cairn', x: 22, y: 72, visited: false },
  { id: 'cairn2', label: 'Mid-Ridge Pass', x: 50, y: 48, visited: false },
  { id: 'cairn3', label: 'Mountain Refuge Gate', x: 78, y: 26, visited: false },
];

export default function FallMission({
  onComplete,
  isCompleted,
}: FallMissionProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visionMode, setVisionMode] = useState<VisionMode>('normal');
  const [checkpoints, setCheckpoints] = useState<TrailCheckpoint[]>(INITIAL_CHECKPOINTS);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  // Fallback / pre-rendered original ImageData
  const rawImageBufferRef = useRef<ImageData | null>(null);

  const meta = SEASONS.fall;
  const visitedCount = checkpoints.filter((c) => c.visited).length;

  // Draw autumn forest landscape and compute genuine Sobel edge detection
  const drawAutumnScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = (canvas.width = 640);
    const height = (canvas.height = 400);

    // 1. Draw base autumn forest with winding trail
    // Mountain background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#592917');
    bgGrad.addColorStop(0.4, '#8C4A32');
    bgGrad.addColorStop(1, '#39251C');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Autumn forest floor carpet of leaves (orange, amber, ochre)
    ctx.fillStyle = '#9C4F2B';
    for (let i = 0; i < 140; i++) {
      const rx = (i * 197) % width;
      const ry = 150 + ((i * 123) % (height - 150));
      ctx.beginPath();
      ctx.fillStyle = i % 3 === 0 ? '#B86B3D' : i % 3 === 1 ? '#D99A52' : '#8A3B14';
      ctx.ellipse(rx, ry, 12, 6, (i * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }

    // Hidden winding trail under leaves (drawn with distinct stone boundaries)
    ctx.save();
    ctx.lineWidth = 36;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#6B4226'; // Trail path dirt color
    ctx.beginPath();
    ctx.moveTo(width * 0.15, height * 0.85);
    ctx.bezierCurveTo(
      width * 0.25, height * 0.65,
      width * 0.45, height * 0.65,
      width * 0.5, height * 0.48
    );
    ctx.bezierCurveTo(
      width * 0.55, height * 0.35,
      width * 0.7, height * 0.35,
      width * 0.82, height * 0.22
    );
    ctx.stroke();

    // Trail border stones (high contrast edges for Sobel)
    ctx.strokeStyle = '#D1D5DB';
    ctx.lineWidth = 3;
    for (let t = 0; t <= 1; t += 0.05) {
      const px = width * 0.15 + t * (width * 0.67) + Math.sin(t * 8) * 20;
      const py = height * 0.85 - t * (height * 0.63) + Math.cos(t * 6) * 15;
      ctx.fillStyle = '#E5E7EB';
      ctx.beginPath();
      ctx.arc(px - 16, py, 4, 0, Math.PI * 2);
      ctx.arc(px + 16, py, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    // Rocky bluffs and autumn trees
    ctx.fillStyle = '#4A2810';
    // Left tree trunks
    ctx.fillRect(width * 0.08, 60, 24, height - 60);
    ctx.fillRect(width * 0.88, 40, 28, height - 40);

    // Save the raw color image data
    const rawData = ctx.getImageData(0, 0, width, height);
    rawImageBufferRef.current = rawData;

    // Apply Vision Modes using real 2D mathematical Convolution
    if (visionMode === 'boundary' || visionMode === 'enhanced') {
      const src = rawData.data;
      const out = ctx.createImageData(width, height);
      const dst = out.data;

      // 3x3 Sobel kernels
      // Gx: [-1, 0, 1, -2, 0, 2, -1, 0, 1]
      // Gy: [-1, -2, -1, 0, 0, 0, 1, 2, 1]
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let gx = 0;
          let gy = 0;

          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4;
              // Grayscale luminance of pixel
              const lum =
                0.299 * (src[idx] ?? 0) +
                0.587 * (src[idx + 1] ?? 0) +
                0.114 * (src[idx + 2] ?? 0);

              // Sobel X weights
              const wx = kx === 0 ? 0 : kx * (ky === 0 ? 2 : 1);
              // Sobel Y weights
              const wy = ky === 0 ? 0 : ky * (kx === 0 ? 2 : 1);

              gx += lum * wx;
              gy += lum * wy;
            }
          }

          const mag = Math.min(255, Math.hypot(gx, gy));
          const outIdx = (y * width + x) * 4;

          if (visionMode === 'boundary') {
            // High contrast neon boundary lines against dark obsidian
            if (mag > 45) {
              dst[outIdx] = 245;     // R (Gold/Amber edge)
              dst[outIdx + 1] = 160; // G
              dst[outIdx + 2] = 60;  // B
              dst[outIdx + 3] = 255;
            } else {
              dst[outIdx] = 18;
              dst[outIdx + 1] = 14;
              dst[outIdx + 2] = 12;
              dst[outIdx + 3] = 255;
            }
          } else {
            // Enhanced mode: Overlay boundary lines over color image
            if (mag > 45) {
              dst[outIdx] = 255;
              dst[outIdx + 1] = 215;
              dst[outIdx + 2] = 0;
              dst[outIdx + 3] = 255;
            } else {
              dst[outIdx] = src[outIdx] ?? 0;
              dst[outIdx + 1] = src[outIdx + 1] ?? 0;
              dst[outIdx + 2] = src[outIdx + 2] ?? 0;
              dst[outIdx + 3] = 255;
            }
          }
        }
      }

      ctx.putImageData(out, 0, 0);
    }

    // Draw the 3 Trail Checkpoints (Stone Cairns)
    for (const cp of checkpoints) {
      const cx = (cp.x / 100) * width;
      const cy = (cp.y / 100) * height;

      ctx.save();
      ctx.translate(cx, cy);

      // Outer beacon aura
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.fillStyle = cp.visited ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.35)';
      ctx.fill();

      // Stone Cairn icon
      ctx.fillStyle = cp.visited ? '#10B981' : '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Checkpoint Flag
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cp.visited ? '✓' : '▲', 0, 3.5);

      ctx.restore();
    }
  }, [visionMode, checkpoints]);

  useEffect(() => {
    drawAutumnScene();
  }, [drawAutumnScene]);

  // Click on canvas to discover trail checkpoints
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Check hit against checkpoints
    let hitAny = false;
    setCheckpoints((prev) =>
      prev.map((cp) => {
        const dist = Math.hypot(xPct - cp.x, yPct - cp.y);
        if (dist < 8) {
          hitAny = true;
          setSelectedPoint(cp.label);
          return { ...cp, visited: true };
        }
        return cp;
      }),
    );

    const nextVisited = checkpoints.filter((c) => c.visited || Math.hypot(xPct - c.x, yPct - c.y) < 8).length;
    if (nextVisited >= 3) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Objective Ribbon */}
      <div className="p-4 rounded-2xl bg-[#F3E5D0] border border-[#B86B3D]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🍂</span>
          <div>
            <h4 className="text-sm font-black tracking-tight text-[#39251C]">
              MISSION OBJECTIVE: Uncover the Hidden Trail Boundaries
            </h4>
            <p className="text-xs text-stone-700">
              The fallen leaves mask the path. Toggle <strong>Boundary Vision</strong> to isolate sudden brightness changes, then click the 3 Trail Cairns (▲).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white/90 px-3.5 py-1.5 rounded-xl border border-amber-300 font-mono text-xs font-bold text-amber-950">
          <span>Trail Cairns Logged:</span>
          <span className="text-base text-amber-700">{visitedCount} / 3</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Interactive Canvas with Vision Modes */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border-4 border-[#39251C] bg-[#120E0C] p-1.5 shadow-2xl overflow-hidden relative">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto block rounded-2xl cursor-pointer"
            />

            {/* Vision Mode Selector Pills */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="bg-stone-900/85 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-white font-mono text-[11px] pointer-events-auto">
                MODE: {visionMode.toUpperCase()}
              </span>

              <div className="flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md p-1 rounded-xl border border-white/20 text-xs font-bold text-white shadow-lg pointer-events-auto">
                <button
                  type="button"
                  onClick={() => setVisionMode('normal')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    visionMode === 'normal'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Normal Vision
                </button>
                <button
                  type="button"
                  onClick={() => setVisionMode('boundary')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    visionMode === 'boundary'
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Boundary Vision ⚡
                </button>
                <button
                  type="button"
                  onClick={() => setVisionMode('enhanced')}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    visionMode === 'enhanced'
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  Enhanced Trail
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 px-2">
            <span>💡 Tip: Click on the glowing trail cairns (▲) along the path.</span>
            {selectedPoint && (
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Reached: {selectedPoint} ✓
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Ridge & Boundary Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h5 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                Trail Boundary Radar
              </h5>
              <span className="text-xs text-stone-400 font-mono">Mission 03</span>
            </div>

            <div className="space-y-3">
              {checkpoints.map((cp, idx) => (
                <div
                  key={cp.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    cp.visited
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                      : 'border-stone-200 bg-stone-50 text-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-1">
                    <span>Waypoint 0{idx + 1}: {cp.label}</span>
                    <span>{cp.visited ? '✓ Checked' : '▲ Pending'}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Location: [{Math.round(cp.x)}%, {Math.round(cp.y)}%] along the stone border
                  </p>
                </div>
              ))}
            </div>

            {/* Scientific Explanation Disguised as Outdoor Scouting */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
              <strong className="block font-bold">🍂 How Boundary Vision Works:</strong>
              <p className="leading-relaxed text-[11px] text-amber-900">
                Notice what happens when you switch to <strong>Boundary Vision</strong>: areas where neighboring stones meet the dirt produce sharp brightness contrasts. By comparing pixels on the left against the right, the computer traces sharp contour lines!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
