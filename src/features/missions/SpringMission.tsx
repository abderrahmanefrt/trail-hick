import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { FlowerTarget } from '@/types/trailvision';
import { SEASONS } from '@/data/trailvisionTexts';

interface SpringMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const INITIAL_FLOWERS: FlowerTarget[] = [
  {
    id: 'edelweiss',
    name: 'Glacial Edelweiss',
    description: 'Star-shaped white petals adapted to high-altitude limestone rocks.',
    x: 28,
    y: 35,
    radius: 12,
    found: false,
    color: '#F8FAFC',
  },
  {
    id: 'gentian',
    name: 'Alpine Blue Gentian',
    description: 'Deep cobalt trumpet blossom with intense contrast against dark moss.',
    x: 74,
    y: 28,
    radius: 12,
    found: false,
    color: '#3B82F6',
  },
  {
    id: 'rose',
    name: 'Wild Alpine Rose',
    description: 'Vibrant magenta cluster with serrated green leaves.',
    x: 48,
    y: 72,
    radius: 12,
    found: false,
    color: '#EC4899',
  },
  {
    id: 'arnica',
    name: 'Golden Mountain Arnica',
    description: 'Sun-gold radiant petals arranged in sharp radial symmetry.',
    x: 82,
    y: 78,
    radius: 12,
    found: false,
    color: '#EAB308',
  },
];

export default function SpringMission({
  onComplete,
  isCompleted,
}: SpringMissionProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [flowers, setFlowers] = useState<FlowerTarget[]>(INITIAL_FLOWERS);
  const [lensPos, setLensPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [activeMatch, setActiveMatch] = useState<{ flower: FlowerTarget; score: number } | null>(
    null,
  );
  const [recentlyFound, setRecentlyFound] = useState<string | null>(null);

  const meta = SEASONS.spring;
  const foundCount = flowers.filter((f) => f.found).length;

  // Draw procedural forest meadow on canvas
  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Rich forest floor gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#263B2D');
    bgGrad.addColorStop(0.5, '#2F4836');
    bgGrad.addColorStop(1, '#1E2F24');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Forest moss & organic stone textures
    ctx.fillStyle = '#395340';
    for (let i = 0; i < 90; i++) {
      const rx = ((i * 137) % width);
      const ry = ((i * 241) % height);
      const rw = 20 + ((i * 23) % 45);
      const rh = 12 + ((i * 17) % 30);
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rh, i * 0.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pine needles and grass blades
    ctx.strokeStyle = '#4A6B53';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 220; i++) {
      const gx = (i * 73) % width;
      const gy = (i * 109) % height;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + ((i % 5) - 2) * 5, gy - 8 - (i % 12));
      ctx.stroke();
    }

    // Sunlight dappling rays
    ctx.save();
    ctx.globalAlpha = 0.12;
    const sunGrad = ctx.createRadialGradient(width * 0.3, height * 0.2, 30, width * 0.3, height * 0.2, width * 0.7);
    sunGrad.addColorStop(0, '#FEF08A');
    sunGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Draw Flowers
    for (const f of flowers) {
      const fx = (f.x / 100) * width;
      const fy = (f.y / 100) * height;

      ctx.save();
      ctx.translate(fx, fy);

      // Leaves around flower
      ctx.fillStyle = '#1D5A34';
      for (let a = 0; a < 4; a++) {
        ctx.save();
        ctx.rotate((a * Math.PI) / 2 + 0.4);
        ctx.beginPath();
        ctx.ellipse(0, 10, 4, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // If discovered, make it glow brightly with indicator
      if (f.found) {
        ctx.save();
        ctx.shadowColor = f.color;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Petals
      const petalCount = f.id === 'edelweiss' ? 8 : f.id === 'rose' ? 6 : 5;
      ctx.fillStyle = f.color;
      for (let p = 0; p < petalCount; p++) {
        ctx.save();
        ctx.rotate((p * Math.PI * 2) / petalCount);
        ctx.beginPath();
        if (f.id === 'edelweiss') {
          ctx.ellipse(0, 8, 3, 9, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(0, 7, 5, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.restore();
      }

      // Center disc
      ctx.fillStyle = f.id === 'gentian' ? '#1E3A8A' : '#F59E0B';
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }, [flowers]);

  // Canvas size sync & initial render
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    canvas.width = container.clientWidth || 600;
    canvas.height = 400;
    drawScene();
  }, [drawScene]);

  // Handle pointer scanning
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const xPct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));

    setLensPos({ x: xPct, y: yPct });

    // Calculate pattern similarity against hidden flower targets
    let bestMatch: { flower: FlowerTarget; score: number } | null = null;
    for (const f of flowers) {
      const dist = Math.hypot(xPct - f.x, yPct - f.y);
      if (dist < f.radius * 1.8) {
        // High correlation score as lens gets closer
        const score = Math.max(0, Math.min(98, Math.round(100 - (dist / (f.radius * 1.8)) * 100)));
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { flower: f, score };
        }
      }
    }

    setActiveMatch(bestMatch);
  };

  const handleCapturePattern = () => {
    if (!activeMatch || activeMatch.score < 65) return;

    const targetId = activeMatch.flower.id;
    setFlowers((prev) =>
      prev.map((f) => (f.id === targetId ? { ...f, found: true } : f)),
    );
    setRecentlyFound(activeMatch.flower.name);

    setTimeout(() => {
      setRecentlyFound(null);
    }, 3500);

    const newFoundCount = flowers.filter((f) => f.id === targetId || f.found).length;
    if (newFoundCount >= 3) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Expedition Objective Ribbon */}
      <div className="p-4 rounded-2xl bg-[#E8F3E8] border border-[#B7D7B0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-800 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌸</span>
          <div>
            <h4 className="text-sm font-black tracking-tight text-[#263B2D]">
              MISSION OBJECTIVE: Discover 3 Hidden Wildflower Patterns
            </h4>
            <p className="text-xs text-stone-600">
              Drag your botanical scanning lens across the forest floor. When the pattern correlation meter peaks, capture the flower!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white/80 px-3.5 py-1.5 rounded-xl border border-[#79A98A]/40 font-mono text-xs font-bold text-[#263B2D]">
          <span>Patterns Identified:</span>
          <span className="text-base text-[#2E7D32]">{foundCount} / 3</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: The Interactive Canvas with Magnifying Scanning Lens */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div
            ref={containerRef}
            onPointerMove={handlePointerMove}
            onClick={handleCapturePattern}
            className="relative w-full rounded-3xl border-4 border-[#263B2D] shadow-2xl overflow-hidden cursor-crosshair select-none touch-none bg-[#1E2F24]"
            style={{ minHeight: '400px' }}
          >
            {/* The Canvas */}
            <canvas ref={canvasRef} className="block w-full h-auto" />

            {/* The Interactive Scanning Lens Reticle */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full transition-all duration-75"
              style={{
                left: `${lensPos.x}%`,
                top: `${lensPos.y}%`,
                width: '110px',
                height: '110px',
                border: activeMatch && activeMatch.score > 70 ? '3px solid #F59E0B' : '2px dashed #79A98A',
                boxShadow:
                  activeMatch && activeMatch.score > 70
                    ? '0 0 25px rgba(245, 158, 11, 0.6), inset 0 0 15px rgba(245, 158, 11, 0.3)'
                    : '0 0 15px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(121, 169, 138, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'brightness(1.15) contrast(1.1)',
              }}
            >
              {/* Reticle Crosshairs */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/40" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/40" />

              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-amber-300" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-amber-300" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-amber-300" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-amber-300" />
            </div>

            {/* Live Lens Telemetry HUD */}
            <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono text-[11px] flex items-center gap-3">
              <span>SCANNER: [{Math.round(lensPos.x)}, {Math.round(lensPos.y)}]</span>
              <span className="text-stone-400">|</span>
              <span className={activeMatch && activeMatch.score > 70 ? 'text-amber-400 font-bold' : 'text-stone-300'}>
                PATTERN MATCH: {activeMatch ? `${activeMatch.score}%` : '0%'}
              </span>
            </div>

            {/* Notification popup when pattern found */}
            {recentlyFound && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-emerald-900/95 border border-emerald-400 text-white px-4 py-2 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-3">
                <span>✨</span>
                <span>PATTERN LOGGED: {recentlyFound}!</span>
              </div>
            )}
          </div>

          {/* Capture Trigger Button for Touch / Click */}
          <div className="mt-3 flex items-center gap-3 w-full justify-between">
            <span className="text-xs text-stone-500 italic">
              Move scanner over flowers and click or tap the capture button.
            </span>

            <button
              type="button"
              onClick={handleCapturePattern}
              disabled={!activeMatch || activeMatch.score < 65}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                activeMatch && activeMatch.score >= 65
                  ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 animate-bounce'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60'
              }`}
            >
              <span>🔍</span>
              <span>Capture Flower Pattern</span>
            </button>
          </div>
        </div>

        {/* Right: Botanical Field Journal */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h5 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                Botanical Field Journal
              </h5>
              <span className="text-xs text-stone-400 font-mono">Mission 01</span>
            </div>

            <div className="space-y-3">
              {flowers.map((f) => (
                <div
                  key={f.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    f.found
                      ? 'border-emerald-300 bg-emerald-50/70 text-emerald-950'
                      : 'border-stone-200 bg-stone-50 text-stone-500'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span
                        className="inline-block h-3 w-3 rounded-full border border-stone-400"
                        style={{ backgroundColor: f.color }}
                      />
                      <span>{f.name}</span>
                    </div>
                    {f.found ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Identified ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-stone-400">Undiscovered</span>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-600">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Educational observation note */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <strong className="block font-bold">🌿 Expedition Insight:</strong>
              <p className="leading-relaxed text-[11px] text-amber-900">
                Notice how your eye and lens recognize a flower by comparing surrounding organic texture against a clear, symmetrical local shape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
