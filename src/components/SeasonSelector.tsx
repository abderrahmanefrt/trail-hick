import React from 'react';
import type { SeasonId, UserProgress } from '@/types/trailvision';
import { SEASONS } from '@/data/trailvisionTexts';

interface SeasonSelectorProps {
  progress: UserProgress;
  onSelectSeason: (season: SeasonId) => void;
  onGoToReveal: () => void;
  onBackToHome: () => void;
}

export default function SeasonSelector({
  progress,
  onSelectSeason,
  onGoToReveal,
  onBackToHome,
}: SeasonSelectorProps): React.JSX.Element {
  const seasons: SeasonId[] = ['spring', 'summer', 'fall', 'winter'];
  const completedCount = seasons.filter((s) => progress.completedMissions[s]).length;
  const canReveal = completedCount === 4;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-300">
        <div>
          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 flex items-center gap-1.5 mb-2 cursor-pointer transition-colors"
          >
            <span>←</span>
            <span>Return to Base Camp</span>
          </button>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Choose Your Seasonal Expedition
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
            Four diverse wilderness environments. Four unique sensory challenges. Complete all four to unlock the final secret of nature.
          </p>
        </div>

        {/* Global Progress Card */}
        <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm shrink-0">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Expedition Progress
            </span>
            <span className="text-base font-black text-stone-900">
              {completedCount} of 4 Badges
            </span>
          </div>
          <div className="flex gap-1.5 text-lg">
            {seasons.map((sid) => (
              <span
                key={sid}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                  progress.badges[sid]
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-800'
                    : 'border-stone-200 bg-stone-100 text-stone-400 opacity-60'
                }`}
                title={SEASONS[sid].badgeName}
              >
                {SEASONS[sid].badgeIcon}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Seasonal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seasons.map((sid, index) => {
          const s = SEASONS[sid];
          const isCompleted = progress.completedMissions[sid];

          return (
            <div
              key={sid}
              className="group relative flex flex-col justify-between rounded-3xl border border-stone-200/90 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              style={{
                borderTop: `6px solid ${s.colors.primary}`,
              }}
            >
              {/* Background Accent Soft Tint */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none transition-opacity group-hover:opacity-25"
                style={{ backgroundColor: s.colors.main }}
              />

              <div className="relative z-10 space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-full text-white shadow-xs"
                      style={{ backgroundColor: s.colors.badgeBg }}
                    >
                      MISSION 0{index + 1}
                    </span>
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {s.name}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                      <span>✓</span>
                      <span>{s.badgeName}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-stone-400">
                      Badge Pending
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-2xl font-black text-stone-900 tracking-tight group-hover:text-amber-800 transition-colors">
                    {s.missionTitle}
                  </h3>
                  <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                    « {s.heroTitle} » — {s.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                  {s.description}
                </p>

                {/* Atmospheric Environment Box */}
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600 flex items-start gap-2.5">
                  <span className="text-base shrink-0">{s.badgeIcon}</span>
                  <div>
                    <strong className="block text-stone-800 font-semibold mb-0.5">
                      Expedition Environment
                    </strong>
                    <span>{s.environment}</span>
                  </div>
                </div>

                {/* Companion Outfit Notice */}
                <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium">
                  <span>🎒</span>
                  <span>TRAILBOT Gear: <strong>{s.accessoryName}</strong></span>
                </div>
              </div>

              {/* Action Button Row */}
              <div className="relative z-10 pt-5 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-stone-500">
                  +250 m D+ Elevation
                </span>

                <button
                  type="button"
                  onClick={() => onSelectSeason(sid)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                  style={{ backgroundColor: s.colors.primary }}
                >
                  <span>{isCompleted ? 'Replay Mission' : 'Explore Mission'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Reveal Banner Unlocked */}
      {canReveal && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white shadow-2xl border-2 border-amber-400/50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in zoom-in-95">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-amber-300 text-xs font-black tracking-widest uppercase">
              <span>🌟</span>
              <span>All 4 Expeditions Mastered!</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white">
              The Grand Discovery Awaits You
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              You’ve gathered the four pieces of the puzzle. Now uncover the single, breathtaking principle that unites every trail you walked.
            </p>
          </div>

          <button
            type="button"
            onClick={onGoToReveal}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 font-black text-sm tracking-wide uppercase shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 border border-amber-300 flex items-center gap-2"
          >
            <span>✨</span>
            <span>ENTER THE REVEAL</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
