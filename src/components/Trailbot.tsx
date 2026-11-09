import React, { useState } from 'react';
import type { SeasonId } from '@/types/trailvision';
import { SEASONS, TRAILVISION_TEXT } from '@/data/trailvisionTexts';

interface TrailbotProps {
  season?: SeasonId;
  customMessage?: string;
  hint?: string;
  className?: string;
}

export default function Trailbot({
  season,
  customMessage,
  hint,
  className = '',
}: TrailbotProps): React.JSX.Element {
  const [minimized, setMinimized] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const meta = season ? SEASONS[season] : null;
  const defaultSpeech = season
    ? TRAILVISION_TEXT.companion.greetings[season]
    : TRAILVISION_TEXT.companion.greetings.welcome;

  const currentSpeech = customMessage || defaultSpeech;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex flex-col items-end transition-all duration-300 ${className}`}
      role="region"
      aria-label="Hiking companion TRAILBOT"
    >
      {/* Speech Bubble */}
      {!minimized && (
        <div className="mb-2 max-w-xs sm:max-w-sm rounded-2xl border border-stone-300/80 bg-white/95 p-4 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 text-stone-900">
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black tracking-wider uppercase text-stone-700">
                {TRAILVISION_TEXT.companion.name}
              </span>
              {meta && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  {meta.accessoryName}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setMinimized(true)}
              className="text-stone-400 hover:text-stone-700 text-xs px-1 rounded cursor-pointer"
              title="Minimize companion"
              aria-label="Minimize companion"
            >
              ✕
            </button>
          </div>

          <p className="text-xs leading-relaxed text-stone-800 font-medium">
            {currentSpeech}
          </p>

          {hint && (
            <div className="mt-2.5 pt-2 border-t border-dashed border-stone-200">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <span>💡</span>
                <span>{showHint ? 'Hide expedition hint' : 'Need a trail hint?'}</span>
              </button>
              {showHint && (
                <p className="mt-1 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 leading-normal animate-in fade-in">
                  {hint}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Companion Character Button */}
      <button
        type="button"
        onClick={() => setMinimized(!minimized)}
        className="group relative flex items-center gap-2 rounded-full border-2 border-stone-400/80 bg-[#221c17] p-2 pr-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:border-amber-400 cursor-pointer"
        aria-label={minimized ? 'Expand TRAILBOT speech' : 'Minimize TRAILBOT'}
      >
        {/* Animated Avatar Graphic */}
        <div className="relative h-12 w-12 rounded-full bg-stone-800 border border-stone-600 flex items-center justify-center overflow-visible shadow-inner">
          <svg
            viewBox="0 0 64 64"
            className="h-10 w-10 drop-shadow-md transition-transform group-hover:scale-110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Robot Head Body */}
            <rect
              x="14"
              y="18"
              width="36"
              height="28"
              rx="10"
              fill="#E5E7EB"
              stroke="#374151"
              strokeWidth="2.5"
            />
            {/* Screen Visor */}
            <rect
              x="18"
              y="22"
              width="28"
              height="15"
              rx="6"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="1.5"
            />
            {/* Eyes */}
            {season === 'summer' ? (
              // Sunglasses for Summer
              <g>
                <rect x="20" y="25" width="10" height="7" rx="3" fill="#F59E0B" />
                <rect x="34" y="25" width="10" height="7" rx="3" fill="#F59E0B" />
                <line x1="30" y1="28" x2="34" y2="28" stroke="#F59E0B" strokeWidth="2" />
              </g>
            ) : (
              // Glowing Eyes
              <g>
                <circle cx="25" cy="29" r="3" fill="#10B981" />
                <circle cx="39" cy="29" r="3" fill="#10B981" />
                <circle cx="26" cy="28" r="1" fill="#FFFFFF" />
                <circle cx="40" cy="28" r="1" fill="#FFFFFF" />
              </g>
            )}

            {/* Antenna with Blinking Beacon */}
            <line x1="32" y1="18" x2="32" y2="9" stroke="#4B5563" strokeWidth="2" />
            <circle cx="32" cy="7" r="3" fill="#EF4444" className="animate-ping origin-center" />
            <circle cx="32" cy="7" r="3" fill="#DC2626" />

            {/* Cheek blush */}
            <ellipse cx="21" cy="33" rx="2" ry="1" fill="#FCA5A5" opacity="0.7" />
            <ellipse cx="43" cy="33" rx="2" ry="1" fill="#FCA5A5" opacity="0.7" />

            {/* Seasonal Hat / Gear */}
            {season === 'spring' && (
              // Spring Flower Hat
              <g>
                <path d="M12 19 C20 12, 44 12, 52 19" stroke="#15803D" strokeWidth="3" />
                {/* Flower on hat */}
                <circle cx="44" cy="13" r="3.5" fill="#F472B6" />
                <circle cx="44" cy="13" r="1.5" fill="#FEF08A" />
              </g>
            )}

            {season === 'summer' && (
              // Safari Sun Visor
              <path
                d="M10 18 Q32 10 54 18"
                stroke="#D97706"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {season === 'fall' && (
              // Cozy Autumn Scarf around neck
              <path
                d="M16 44 Q32 49 48 44 Q32 42 16 44"
                stroke="#B45309"
                strokeWidth="5"
                strokeLinecap="round"
              />
            )}

            {season === 'winter' && (
              // Winter Thermal Beanie & Pompom
              <g>
                <path
                  d="M16 19 C18 10, 46 10, 48 19 Z"
                  fill="#2563EB"
                  stroke="#1E40AF"
                  strokeWidth="2"
                />
                <circle cx="32" cy="8" r="4" fill="#FFFFFF" />
              </g>
            )}
          </svg>

          {/* Compass badge on chest */}
          <span
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white shadow-xs font-bold"
            title="Alpine Compass"
          >
            🧭
          </span>
        </div>

        <div className="flex flex-col text-left">
          <span className="text-[11px] font-black tracking-wide text-amber-300">
            {TRAILVISION_TEXT.companion.name}
          </span>
          <span className="text-[9px] text-stone-300">
            {minimized ? 'Click for guide tips' : 'Guide active'}
          </span>
        </div>
      </button>
    </div>
  );
}
