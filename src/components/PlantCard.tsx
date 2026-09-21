import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Check,
  BookOpen,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Plant } from '../types';
import { getPlantTimingInfo } from '../lib/cropTiming';
import { getPlantVisual } from '../lib/plantImages';
import { getPlantLifestylePills } from '../lib/plantLifestyle';

interface Props {
  plant: Plant;
  onSelect: (plant: Plant) => void;
  onOpenPotCalc?: (plant: Plant) => void;
  isMyCrop?: boolean;
  cropCount?: number;
  onToggleMyCrop?: (plantId: string) => void;
  onRequestAddVariety?: (plant: Plant) => void;
  forceDetailed?: boolean;
}

export const PlantCard: React.FC<Props> = ({
  plant,
  onSelect,
  onOpenPotCalc,
  isMyCrop = false,
  cropCount = 0,
  onToggleMyCrop,
  onRequestAddVariety,
  forceDetailed = false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(forceDetailed);

  const suitability = plant.suitability;
  const score = suitability?.score ?? 88;
  const timing = getPlantTimingInfo(plant);
  const visual = getPlantVisual(plant.id, plant.plant_group);
  const lifestylePills = getPlantLifestylePills(plant);

  // Trust badge styling based on score (clean, high-contrast, non-slop)
  const getTrustBadgeClass = (val: number) => {
    if (val >= 80) {
      return 'bg-emerald-600/95 text-white border-emerald-400/40 ring-1 ring-emerald-500/30';
    }
    if (val >= 60) {
      return 'bg-amber-600/95 text-white border-amber-400/40 ring-1 ring-amber-500/30';
    }
    return 'bg-stone-800/90 text-stone-100 border-stone-600/50';
  };

  return (
    <div
      id={`plant-card-${plant.id}`}
      onClick={() => onSelect(plant)}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* 60% VISUAL SECTION (Beautiful photo / illustration) */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-stone-100 dark:bg-stone-800/80">
        {/* Ambient Gradient / Placeholder backdrop */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${visual.placeholderBg} flex items-center justify-center`}
        >
          <span className="text-6xl select-none opacity-40 group-hover:scale-110 transition-transform duration-500">
            {visual.emoji}
          </span>
        </div>

        {/* Real Plant Photography */}
        {!imageError && (
          <img
            src={visual.imageUrl}
            alt={visual.alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Vignette & Soft Gradient at bottom of image for seamless contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-stone-950/30 pointer-events-none" />

        {/* EXPOSED TRUST SIGNAL: "99% dopasowania do Twojego balkonu" */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md backdrop-blur-md border ${getTrustBadgeClass(
              score
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>{score}% dopasowania do Twojego balkonu</span>
          </div>
        </div>

        {/* Status Indicator (W uprawach or Siew) on Top-Right */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
          {isMyCrop ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/95 text-white shadow-md backdrop-blur-md border border-emerald-400/40">
              <Check className="w-3.5 h-3.5" />
              <span>{cropCount > 1 ? `${cropCount}x w uprawach` : 'W uprawach'}</span>
            </div>
          ) : timing.isGoodTimeToPlantNow ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-900/80 text-emerald-300 shadow-sm backdrop-blur-md border border-emerald-500/30">
              <span>🌱</span>
              <span>Termin aktywny</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* 40% CONTENT SECTION (Clean, Bold, Emotion-Driven) */}
      <div className="p-5 flex flex-col justify-between flex-1 gap-4 bg-white dark:bg-stone-900">
        <div className="space-y-2.5">
          {/* Plant Name (Bold, High Contrast) */}
          <div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {plant.name}
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
              {plant.varieties && plant.varieties.length > 0 ? (
                <>
                  Odmiany do donic:{' '}
                  <span className="font-semibold text-stone-700 dark:text-stone-300">
                    {plant.varieties
                      .slice(0, 3)
                      .map((v) => (typeof v === 'string' ? v : v?.name || ''))
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </>
              ) : (
                plant.summary
              )}
            </p>
          </div>

          {/* Friendly Lifestyle Pills/Chips (e.g. "Szybko rosnące", "Zero wysiłku", "Do sałatki") */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {lifestylePills.map((pill) => (
              <span
                key={pill.id}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-2xs ${pill.className}`}
                title={pill.description}
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Primary Call To Action in shadcn/ui style */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-2.5">
          {onRequestAddVariety ? (
            <button
              id={`add-plant-cta-${plant.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestAddVariety(plant);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] ${
                isMyCrop
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              {isMyCrop ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>
                    W uprawach ({cropCount > 1 ? `${cropCount}x` : 'dodano'}) • Dodaj kolejną +
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Dodaj do balkonu</span>
                </>
              )}
            </button>
          ) : onToggleMyCrop ? (
            <button
              id={`toggle-my-crop-btn-${plant.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMyCrop(plant.id);
              }}
              className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] ${
                isMyCrop
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              {isMyCrop ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>W Twoich uprawach</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Dodaj do balkonu</span>
                </>
              )}
            </button>
          ) : null}

          {/* Secondary Quick Links */}
          <div className="flex items-center justify-between text-xs px-0.5">
            <button
              id={`open-guide-link-${plant.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(plant);
              }}
              className="text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Przewodnik uprawy</span>
            </button>

            {onOpenPotCalc && (
              <button
                id={`open-pot-calc-link-${plant.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPotCalc(plant);
                }}
                className="text-stone-500 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 font-medium inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>📐 Kalkulator donicy</span>
              </button>
            )}
          </div>
        </div>

        {/* Optional Detailed Metrics (Only shown if forceDetailed or toggled by user) */}
        {forceDetailed && (
          <div className="mt-2 pt-2 border-t border-dashed border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-1">
            <div className="flex justify-between">
              <span>Rekomendowana donica:</span>
              <strong className="text-stone-800 dark:text-stone-200">min. {plant.pot.min_volume_l}L</strong>
            </div>
            <div className="flex justify-between">
              <span>Optymalny siew:</span>
              <strong className="text-stone-800 dark:text-stone-200">{timing.bestSowingLabel}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
