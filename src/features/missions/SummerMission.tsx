import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SEASONS } from '@/data/trailvisionTexts';

interface SummerMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

type TimeOfDay = 'morning' | 'noon' | 'afternoon' | 'sunset' | 'night';

const TIME_STEPS: Array<{ id: TimeOfDay; label: string; icon: string; sunFactor: number }> = [
  { id: 'morning', label: 'Morning Dawn', icon: '🌅', sunFactor: 0.65 },
  { id: 'noon', label: 'High Noon', icon: '☀️', sunFactor: 1.0 },
  { id: 'afternoon', label: 'Afternoon Heat', icon: '🌤️', sunFactor: 0.85 },
  { id: 'sunset', label: 'Golden Sunset', icon: '🌇', sunFactor: 0.55 },
  { id: 'night', label: 'Canyon Night', icon: '🌙', sunFactor: 0.2 },
];

export default function SummerMission({
  onComplete,
  isCompleted,
}: SummerMissionProps): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timeIndex, setTimeIndex] = useState<number>(1); // Noon default
  const [selectedPixel, setSelectedPixel] = useState<{
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
    intensity: number;
    label: string;
  } | null>({
    x: 120,
    y: 180,
    r: 235,
    g: 210,
    b: 140,
    intensity: 220,
    label: 'Sunlit Granite Peak',
  });

  const [viewMode, setViewMode] = useState<'color' | 'sensor'>('color');
  const [foundShadow, setFoundShadow] = useState<boolean>(false);
  const [foundPeak, setFoundPeak] = useState<boolean>(false);

  const currentTime = TIME_STEPS[timeIndex] ?? TIME_STEPS[1]!;

  // Render canyon landscape under variable sunlight onto Canvas
  const drawCanyon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const sf = currentTime.sunFactor;

    // Sky gradient according to time
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    if (currentTime.id === 'morning') {
      skyGrad.addColorStop(0, '#534368');
      skyGrad.addColorStop(0.6, '#C07D7B');
      skyGrad.addColorStop(1, '#F8B17A');
    } else if (currentTime.id === 'noon') {
      skyGrad.addColorStop(0, '#1E6BB8');
      skyGrad.addColorStop(0.7, '#60A5FA');
      skyGrad.addColorStop(1, '#BAE6FD');
    } else if (currentTime.id === 'afternoon') {
      skyGrad.addColorStop(0, '#2563EB');
      skyGrad.addColorStop(0.7, '#93C5FD');
      skyGrad.addColorStop(1, '#FED7AA');
    } else if (currentTime.id === 'sunset') {
      skyGrad.addColorStop(0, '#311E48');
      skyGrad.addColorStop(0.5, '#99334F');
      skyGrad.addColorStop(0.85, '#D95338');
      skyGrad.addColorStop(1, '#FBBF24');
    } else {
      // Night
      skyGrad.addColorStop(0, '#060B12');
      skyGrad.addColorStop(0.6, '#0F1A29');
      skyGrad.addColorStop(1, '#1A293D');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Celestial body (Sun / Moon)
    const sunX =
      currentTime.id === 'morning'
        ? width * 0.2
        : currentTime.id === 'noon'
          ? width * 0.5
          : currentTime.id === 'afternoon'
            ? width * 0.75
            : currentTime.id === 'sunset'
              ? width * 0.88
              : width * 0.3;

    const sunY =
      currentTime.id === 'noon'
        ? height * 0.18
        : currentTime.id === 'sunset'
          ? height * 0.55
          : height * 0.35;

    ctx.save();
    if (currentTime.id === 'night') {
      // Crescent Moon
      ctx.fillStyle = '#E2E8F0';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F1A29';
      ctx.beginPath();
      ctx.arc(sunX + 6, sunY - 4, 15, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Blazing sun with glow
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 90);
      sunGlow.addColorStop(0, `rgba(255, 255, 240, ${0.9 * sf})`);
      sunGlow.addColorStop(0.4, `rgba(251, 191, 36, ${0.5 * sf})`);
      sunGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Distant canyon cliffs
    ctx.fillStyle = currentTime.id === 'night' ? '#121C2B' : `rgb(${Math.round(180 * sf)}, ${Math.round(110 * sf)}, ${Math.round(80 * sf)})`;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width * 0.25, height * 0.32);
    ctx.lineTo(width * 0.55, height * 0.42);
    ctx.lineTo(width * 0.85, height * 0.28);
    ctx.lineTo(width, height * 0.48);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Foreground sunlit granite cliffs & deep shadow crevasses
    // Sunny side (Left peak)
    const peakColor =
      currentTime.id === 'night'
        ? 'rgb(24, 38, 56)'
        : `rgb(${Math.min(255, Math.round(245 * sf))}, ${Math.min(255, Math.round(175 * sf))}, ${Math.round(100 * sf)})`;
    ctx.fillStyle = peakColor;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.65);
    ctx.lineTo(width * 0.35, height * 0.38);
    ctx.lineTo(width * 0.52, height * 0.65);
    ctx.lineTo(0, height);
    ctx.fill();

    // Deep shadow crevasse (Right side of left peak)
    const shadowColor =
      currentTime.id === 'night'
        ? 'rgb(6, 12, 20)'
        : `rgb(${Math.round(55 * sf)}, ${Math.round(35 * sf)}, ${Math.round(45 * sf)})`;
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.moveTo(width * 0.35, height * 0.38);
    ctx.lineTo(width * 0.52, height * 0.65);
    ctx.lineTo(width * 0.42, height * 0.72);
    ctx.lineTo(width * 0.32, height * 0.52);
    ctx.fill();

    // Canyon Lake / River at bottom (Turquoise / deep navy)
    const waterGrad = ctx.createLinearGradient(0, height * 0.75, 0, height);
    if (currentTime.id === 'night') {
      waterGrad.addColorStop(0, '#091A2E');
      waterGrad.addColorStop(1, '#040C16');
    } else {
      waterGrad.addColorStop(0, `rgb(${Math.round(20 * sf)}, ${Math.round(160 * sf)}, ${Math.round(180 * sf)})`);
      waterGrad.addColorStop(1, `rgb(${Math.round(10 * sf)}, ${Math.round(90 * sf)}, ${Math.round(120 * sf)})`);
    }
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, height * 0.75, width, height * 0.25);

    // If Sensor View is active: convert entire canvas to pure grayscale pixel intensity
    if (viewMode === 'sensor') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] ?? 0;
        const g = data[i + 1] ?? 0;
        const b = data[i + 2] ?? 0;
        // Standard luminance formula
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      ctx.putImageData(imgData, 0, 0);
    }
  }, [currentTime, viewMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 640;
    canvas.height = 380;
    drawCanyon();
  }, [drawCanyon]);

  // Click on canvas to sample pixel intensity
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const p = ctx.getImageData(x, y, 1, 1).data;
    const r = p[0] ?? 0;
    const g = p[1] ?? 0;
    const b = p[2] ?? 0;
    const intensity = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

    let label = 'Mid-tone Terrain';
    if (intensity < 50) {
      label = 'Deep Shadow Crevasse 🌑';
      setFoundShadow(true);
    } else if (intensity > 215) {
      label = 'Blazing Sunlit Peak ☀️';
      setFoundPeak(true);
    } else if (y > canvas.height * 0.75) {
      label = 'Turquoise Canyon River 🛶';
    }

    setSelectedPixel({ x, y, r, g, b, intensity, label });

    if ((foundShadow || intensity < 50) && (foundPeak || intensity > 215)) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Objective Banner */}
      <div className="p-4 rounded-2xl bg-[#FFF3DC] border border-[#FFB347]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-stone-900 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">☀️</span>
          <div>
            <h4 className="text-sm font-black tracking-tight text-[#3B2922]">
              MISSION OBJECTIVE: Calibrate the Sunlight Matrix (0 to 255)
            </h4>
            <p className="text-xs text-stone-700">
              Shift time of day to transform the light. Click on the canyon to locate a shadow zone (&lt; 50) and a peak sunlit zone (&gt; 215).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 bg-white/90 px-3.5 py-1.5 rounded-xl border border-amber-300 font-mono text-xs font-bold text-amber-950">
          <span>Calibration:</span>
          <span className="text-emerald-700">
            {foundShadow && foundPeak ? 'Calibrated 2/2 ✓' : foundShadow || foundPeak ? '1/2 Calibrated' : '0/2 Targets'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Time-of-Day Simulator Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-3xl border-4 border-[#3B2922] bg-[#0c141d] p-1.5 shadow-2xl overflow-hidden relative">
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-auto block rounded-2xl cursor-pointer"
            />

            {/* View Mode Toggle Pill */}
            <div className="absolute top-4 right-4 flex items-center bg-stone-900/85 backdrop-blur-md p-1 rounded-xl border border-white/20 text-xs font-bold text-white shadow-lg">
              <button
                type="button"
                onClick={() => setViewMode('color')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'color' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
                }`}
              >
                Nature Color
              </button>
              <button
                type="button"
                onClick={() => setViewMode('sensor')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'sensor' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-300 hover:text-white'
                }`}
              >
                Sensor Matrix (0–255)
              </button>
            </div>

            {/* Selected Pixel Reticle Callout */}
            {selectedPixel && (
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{
                  left: `${(selectedPixel.x / 640) * 100}%`,
                  top: `${(selectedPixel.y / 380) * 100}%`,
                }}
              >
                <div className="h-6 w-6 rounded-full border-2 border-amber-400 bg-amber-400/20 animate-ping" />
                <div className="absolute h-2 w-2 rounded-full bg-white shadow-xs" />
              </div>
            )}
          </div>

          {/* Time-of-Day Slider Controls */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-stone-700">
              <span className="uppercase tracking-wider">Time of Day Simulator</span>
              <span className="text-amber-700 font-bold flex items-center gap-1">
                <span>{currentTime.icon}</span>
                <span>{currentTime.label}</span>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 pt-1">
              {TIME_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setTimeIndex(idx)}
                  className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                    timeIndex === idx
                      ? 'bg-amber-500 border-amber-600 text-stone-950 font-black shadow-md scale-105'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 font-medium'
                  }`}
                >
                  <span className="block text-base">{step.icon}</span>
                  <span className="block text-[10px] mt-0.5 leading-tight">{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Pixel Intensity Sensor */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h5 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                Digital Sensor Photometer
              </h5>
              <span className="text-xs text-stone-400 font-mono">Mission 02</span>
            </div>

            {selectedPixel ? (
              <div className="space-y-4">
                {/* Visual Swatch & Label */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                  <div
                    className="h-12 w-12 rounded-xl border border-stone-300 shadow-inner shrink-0"
                    style={{
                      backgroundColor: `rgb(${selectedPixel.r}, ${selectedPixel.g}, ${selectedPixel.b})`,
                    }}
                  />
                  <div>
                    <span className="block text-xs font-black text-stone-900">
                      {selectedPixel.label}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      Coordinate: [{selectedPixel.x}, {selectedPixel.y}]
                    </span>
                  </div>
                </div>

                {/* 0 to 255 Numeric Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-stone-500">Luminance / Intensity:</span>
                    <span className="text-base text-amber-700">
                      {selectedPixel.intensity} <span className="text-xs text-stone-400">/ 255</span>
                    </span>
                  </div>

                  {/* Gradient Meter Bar */}
                  <div className="relative h-4 w-full rounded-full bg-gradient-to-r from-black via-stone-400 to-white border border-stone-300 overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 w-2 bg-amber-500 border border-white shadow-sm -translate-x-1"
                      style={{ left: `${(selectedPixel.intensity / 255) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-stone-400">
                    <span>0 (Dark Abyss)</span>
                    <span>128 (Neutral)</span>
                    <span>255 (Solar White)</span>
                  </div>
                </div>

                {/* RGB Matrix breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-red-50 border border-red-200">
                    <span className="block text-[10px] text-red-700 font-bold">RED</span>
                    <span className="text-sm font-black text-red-950">{selectedPixel.r}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-green-50 border border-green-200">
                    <span className="block text-[10px] text-green-700 font-bold">GREEN</span>
                    <span className="text-sm font-black text-green-950">{selectedPixel.g}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="block text-[10px] text-blue-700 font-bold">BLUE</span>
                    <span className="text-sm font-black text-blue-950">{selectedPixel.b}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic p-4 text-center">
                Click anywhere on the canyon image to inspect pixel values!
              </p>
            )}

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <strong className="block text-stone-800 font-bold">Calibration Targets:</strong>
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  foundShadow ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <span>🌑 Shadow Crevasse (&lt; 50)</span>
                <span>{foundShadow ? '✓ Calibrated' : 'Pending'}</span>
              </div>
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between ${
                  foundPeak ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-stone-50 border-stone-200 text-stone-500'
                }`}
              >
                <span>☀️ Blazing Peak (&gt; 215)</span>
                <span>{foundPeak ? '✓ Calibrated' : 'Pending'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
