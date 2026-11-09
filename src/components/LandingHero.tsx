import React from 'react';
import type { UserProgress, SeasonId } from '@/types/trailvision';
import { SEASONS, TRAILVISION_TEXT } from '@/data/trailvisionTexts';

interface LandingHeroProps {
  progress: UserProgress;
  onStartAdventure: () => void;
  onExploreSeasons: () => void;
  onSelectSeason: (season: SeasonId) => void;
}

export default function LandingHero({
  progress,
  onStartAdventure,
  onExploreSeasons,
  onSelectSeason,
}: LandingHeroProps): React.JSX.Element {
  const completedCount = Object.values(progress.completedMissions).filter(Boolean).length;
  const seasonsList: SeasonId[] = ['spring', 'summer', 'fall', 'winter'];

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden text-stone-100">
      {/* Background Graphic with Atmospheric Mountain Silhouette Layers */}
      <div className="absolute inset-0 z-0 bg-[#0c141d]">
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a121d] via-[#162333] to-[#261d18]" />

        {/* Alpine Sun / Moon glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-amber-500/15 via-orange-400/10 to-transparent blur-3xl" />

        {/* Cinematic SVG Mountain Range Silhouette Layers */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-[55%] object-cover opacity-75"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Distant icy peaks */}
          <path
            d="M0 320L180 210L360 290L580 150L780 270L980 170L1200 280L1440 190V600H0Z"
            fill="#1e2c3d"
            opacity="0.6"
          />
          {/* Middle mountain ridges */}
          <path
            d="M0 390L220 280L440 370L700 230L940 360L1180 270L1440 380V600H0Z"
            fill="#151e28"
            opacity="0.85"
          />
          {/* Foreground pine slopes and trail crest */}
          <path
            d="M0 470L280 390L620 460L890 380L1140 450L1440 390V600H0Z"
            fill="#0b1016"
          />
        </svg>

        {/* Subtle grid contour overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 pt-16 sm:pt-24 pb-12 flex flex-col items-center text-center">
        {/* Expedition Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-widest text-amber-300 mb-6 shadow-lg animate-in fade-in duration-700">
          <span>🧭</span>
          <span>{TRAILVISION_TEXT.app.tagline}</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white max-w-4xl drop-shadow-md">
          THE WORLD IS FULL OF{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-emerald-300">
            HIDDEN PATTERNS.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg sm:text-2xl font-serif italic text-stone-200/90 max-w-2xl">
          {TRAILVISION_TEXT.app.heroSubtitle}
        </p>

        {/* Description */}
        <p className="mt-4 text-xs sm:text-base text-stone-300 max-w-2xl leading-relaxed font-normal">
          {TRAILVISION_TEXT.app.heroDescription}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onStartAdventure}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm tracking-wide uppercase shadow-2xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 border border-amber-400/30"
          >
            <span>🥾</span>
            <span>{TRAILVISION_TEXT.app.startAdventure}</span>
          </button>

          <button
            type="button"
            onClick={onExploreSeasons}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide uppercase backdrop-blur-md border border-white/25 hover:border-white/50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🗺️</span>
            <span>{TRAILVISION_TEXT.app.exploreSeasons}</span>
          </button>
        </div>

        {/* Progress Bar / Expedition Summary */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-300">
          <div className="flex items-center gap-2 bg-stone-900/60 px-4 py-2 rounded-xl border border-stone-700/60 backdrop-blur-xs">
            <span className="text-amber-400 font-bold">▲ {progress.elevationMeters} m D+</span>
            <span className="text-stone-500">|</span>
            <span>Expedition Altitude</span>
          </div>

          <div className="flex items-center gap-2 bg-stone-900/60 px-4 py-2 rounded-xl border border-stone-700/60 backdrop-blur-xs">
            <span>🎒 {completedCount} / 4 Missions Completed</span>
            {completedCount === 4 && (
              <span className="text-emerald-400 font-bold">✓ Ready for The Reveal!</span>
            )}
          </div>
        </div>
      </div>

      {/* Seasonal Carousel Preview Strip */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {seasonsList.map((sid) => {
            const s = SEASONS[sid];
            const isDone = progress.completedMissions[sid];

            return (
              <button
                key={sid}
                type="button"
                onClick={() => onSelectSeason(sid)}
                className="group relative text-left p-3.5 sm:p-4 rounded-2xl border border-white/15 bg-stone-900/40 hover:bg-stone-900/70 backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-amber-400/60 cursor-pointer shadow-lg overflow-hidden"
              >
                {/* Accent border top indicator */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: s.colors.primary }}
                />

                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-lg">{s.badgeIcon}</span>
                  {isDone ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700">
                      Completed ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-stone-400">
                      Mission 0{seasonsList.indexOf(sid) + 1}
                    </span>
                  )}
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                  {s.name}: {s.missionTitle}
                </h3>
                <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                  {s.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
