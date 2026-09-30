import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Check,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Plant } from '../types';
import { getPlantTimingInfo } from '../lib/cropTiming';
import { getPlantVisual } from '../lib/plantImages';
import { getPlantLifestylePills } from '../lib/plantLifestyle';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
  plant: Plant;
  onSelect: (plant: Plant) => void;
  onOpenPotCalc?: (plant: Plant) => void;
  isMyCrop?: boolean;
  cropCount?: number;
  onToggleMyCrop?: (plantId: string) => void;
  onRequestAddVariety?: (plant: Plant) => void;
  onAddCrop?: (plant: Plant) => void;
  isAdding?: boolean;
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
  onAddCrop,
  isAdding = false,
  forceDetailed = false,
}) => {
  const { language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(forceDetailed);

  // Sync expanded state if forceDetailed changes
  React.useEffect(() => {
    if (forceDetailed) {
      setIsExpanded(true);
    }
  }, [forceDetailed]);

  const suitability = plant.suitability;
  const score = suitability?.score ?? 88;
  const timing = getPlantTimingInfo(plant, new Date(), language === 'en');
  const visual = getPlantVisual(plant.id, plant.plant_group);
  const lifestylePills = getPlantLifestylePills(plant, language);

  // Trust badge styling based on score
  const getTrustBadgeClass = (val: number) => {
    if (val >= 80) {
      return 'bg-emerald-600/95 text-white border-emerald-400/40 ring-1 ring-emerald-500/30';
    }
    if (val >= 60) {
      return 'bg-amber-600/95 text-white border-amber-400/40 ring-1 ring-amber-500/30';
    }
    return 'bg-stone-800/90 text-stone-100 border-stone-600/50';
  };

  const varietiesList = plant.varieties && plant.varieties.length > 0
    ? plant.varieties
        .slice(0, 4)
        .map((v) => (typeof v === 'string' ? v : v?.name || ''))
        .filter(Boolean)
        .join(', ')
    : null;

  return (
    <div
      id={`plant-card-${plant.id}`}
      data-testid={`plant-card-${plant.id}`}
      data-plant-id={plant.id}
      onClick={() => onSelect(plant)}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 shadow-xs hover:shadow-xl hover:border-emerald-600 dark:hover:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-700 dark:focus-within:ring-emerald-400 focus-within:ring-offset-2 transition-all duration-300 overflow-hidden cursor-pointer min-h-[440px] sm:min-h-[460px]"
    >
      {/* 1. FIRST VIEWPORT ELEMENT: PLANT IMAGE */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-100 dark:bg-stone-800/80 shrink-0">
        {/* Placeholder backdrop with emoji */}
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
            data-testid={`plant-image-${plant.id}`}
            data-plant-id={plant.id}
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

        {/* Soft Vignette Gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/15 to-stone-950/30 pointer-events-none" />

        {/* Trust badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md border ${getTrustBadgeClass(
              score
            )}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
            <span>
              {language === 'en'
                ? `${score}% match for your balcony`
                : `${score}% dopasowania do Twojego balkonu`}
            </span>
          </div>
        </div>

        {/* Status Indicator (W uprawach or Active season) on Top-Right */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5">
          {isMyCrop ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600/95 text-white shadow-md backdrop-blur-md border border-emerald-400/40">
              <Check className="w-3.5 h-3.5" />
              <span>
                {language === 'en'
                  ? cropCount > 1
                    ? `${cropCount}x in crops`
                    : 'In your crops'
                  : cropCount > 1
                  ? `${cropCount}x w uprawach`
                  : 'W uprawach'}
              </span>
            </div>
          ) : timing.isGoodTimeToPlantNow ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-900/80 text-emerald-300 shadow-sm backdrop-blur-md border border-emerald-500/30">
              <span>🌱</span>
              <span>{language === 'en' ? 'Active season' : 'Termin aktywny'}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* CONTENT SECTION (Streamlined first viewport: name, 1-2 key attributes, primary action) */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3 bg-white dark:bg-stone-900">
        <div className="space-y-2">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span
              data-testid={`plant-category-${plant.id}`}
              data-plant-id={plant.id}
              className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400"
            >
              {plant.category}
            </span>
          </div>

          {/* 2. FIRST VIEWPORT ELEMENT: PLANT NAME */}
          <h3
            data-testid={`plant-title-${plant.id}`}
            data-plant-id={plant.id}
            title={plant.name}
            className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-snug group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 min-h-[1.75rem]"
          >
            {plant.name}
          </h3>

          {/* 3. FIRST VIEWPORT ELEMENT: ONE OR TWO KEY GROWING ATTRIBUTES */}
          <div
            data-testid={`plant-key-attributes-${plant.id}`}
            className="flex items-center gap-2 flex-wrap pt-0.5"
          >
            {/* Key attribute 1: Pot requirement */}
            <div
              data-testid={`plant-attr-pot-${plant.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-300 dark:border-stone-700"
            >
              <span aria-hidden="true">🪴</span>
              <span>
                {language === 'en'
                  ? `Pot: min. ${plant.pot.min_volume_l}L`
                  : `Donica: min. ${plant.pot.min_volume_l}L`}
              </span>
            </div>

            {/* Key attribute 2: Sun / Light requirement or Best Sowing */}
            <div
              data-testid={`plant-attr-sun-${plant.id}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 text-xs font-semibold border border-amber-300 dark:border-amber-700"
            >
              <span aria-hidden="true">☀️</span>
              <span>
                {plant.sun_preference ||
                  (language === 'en' ? 'Full sun' : 'Pełne słońce')}
              </span>
            </div>
          </div>

          {/* Compact summary (Req 4 & 5): strictly clamped to prevent unpredictable layout shifts, full text accessible to AT */}
          <div className="relative pt-0.5">
            <p
              data-testid={`plant-description-${plant.id}`}
              data-plant-id={plant.id}
              title={plant.summary}
              className="text-xs text-stone-700 dark:text-stone-300 line-clamp-1 leading-relaxed"
            >
              {plant.summary}
            </p>
            {/* Accessible full text for screen readers */}
            <span
              className="sr-only"
              data-testid={`plant-accessible-description-${plant.id}`}
            >
              {plant.summary}
            </span>
          </div>
        </div>

        {/* 4. FIRST VIEWPORT ELEMENT: ONE PRIMARY ACTION + EQUAL HEIGHT ACTION AREA */}
        <div
          data-testid={`plant-action-area-${plant.id}`}
          className="mt-auto pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2"
        >
          {/* Primary CTA button with equal height min-h-[44px] */}
          {onAddCrop ? (
            <button
              id={`add-plant-cta-${plant.id}`}
              data-testid={`plant-add-btn-${plant.id}`}
              data-plant-id={plant.id}
              type="button"
              disabled={isAdding}
              aria-busy={isAdding}
              onClick={(e) => {
                e.stopPropagation();
                if (isAdding) return;
                onAddCrop(plant);
              }}
              className={`w-full min-h-[44px] h-11 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                isAdding
                  ? 'bg-emerald-600/70 text-white cursor-wait opacity-80'
                  : isMyCrop
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'en' ? 'Adding...' : 'Dodawanie...'}</span>
                </>
              ) : isMyCrop ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                  <span>
                    {language === 'en'
                      ? `In crops (${cropCount > 1 ? `${cropCount}x` : 'added'}) • Add another +`
                      : `W uprawach (${cropCount > 1 ? `${cropCount}x` : 'dodano'}) • Dodaj kolejną +`}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Add to balcony' : 'Dodaj do balkonu'}</span>
                </>
              )}
            </button>
          ) : onRequestAddVariety ? (
            <button
              id={`add-plant-cta-${plant.id}`}
              data-testid={`plant-add-btn-${plant.id}`}
              data-plant-id={plant.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestAddVariety(plant);
              }}
              className={`w-full min-h-[44px] h-11 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                isMyCrop
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              {isMyCrop ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                  <span>
                    {language === 'en'
                      ? `In crops (${cropCount > 1 ? `${cropCount}x` : 'added'}) • Add another +`
                      : `W uprawach (${cropCount > 1 ? `${cropCount}x` : 'dodano'}) • Dodaj kolejną +`}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Add to balcony' : 'Dodaj do balkonu'}</span>
                </>
              )}
            </button>
          ) : onToggleMyCrop ? (
            <button
              id={`toggle-my-crop-btn-${plant.id}`}
              data-testid={`plant-add-btn-${plant.id}`}
              data-plant-id={plant.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleMyCrop(plant.id);
              }}
              className={`w-full min-h-[44px] h-11 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                isMyCrop
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
              }`}
            >
              {isMyCrop ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[2.5]" />
                  <span>{language === 'en' ? 'In your crops' : 'W Twoich uprawach'}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{language === 'en' ? 'Add to balcony' : 'Dodaj do balkonu'}</span>
                </>
              )}
            </button>
          ) : null}

          {/* Collapsible Details Area Toggle Button */}
          <button
            id={`toggle-details-btn-${plant.id}`}
            data-testid={`plant-toggle-details-btn-${plant.id}`}
            type="button"
            aria-expanded={isExpanded}
            aria-controls={`plant-details-panel-${plant.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="w-full min-h-[44px] py-2 px-3 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-colors flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
          >
            <span>
              {isExpanded
                ? language === 'en'
                  ? 'Hide details'
                  : 'Zwiń szczegóły uprawy'
                : language === 'en'
                ? 'Growing details'
                : 'Pokaż szczegóły uprawy'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            )}
          </button>
        </div>

        {/* 2. ADVANCED ATTRIBUTES IN COLLAPSIBLE DETAILS AREA */}
        {isExpanded && (
          <div
            id={`plant-details-panel-${plant.id}`}
            data-testid={`plant-details-panel-${plant.id}`}
            className="mt-2 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 space-y-3"
          >
            {/* Full untruncated description exposed via details action */}
            <div
              data-testid={`plant-full-description-${plant.id}`}
              className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200/60 dark:border-stone-700/60"
            >
              <div className="font-bold text-stone-900 dark:text-stone-100 text-[11px] uppercase tracking-wider mb-1">
                {language === 'en' ? 'Complete overview' : 'Pełny opis uprawy'}
              </div>
              <p>{plant.summary}</p>
            </div>

            {/* Varieties List */}
            {varietiesList && (
              <div
                data-testid={`plant-varieties-list-${plant.id}`}
                className="text-xs text-stone-600 dark:text-stone-400"
              >
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {language === 'en' ? 'Recommended varieties: ' : 'Odmiany: '}
                </span>
                <span>{varietiesList}</span>
              </div>
            )}

            {/* Lifestyle Pills (Friendly chips) */}
            {lifestylePills.length > 0 && (
              <div
                data-testid={`plant-lifestyle-pills-${plant.id}`}
                className="flex flex-wrap items-center gap-1.5 pt-0.5"
              >
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
            )}

            {/* Detailed Agronomic Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-stone-700 dark:text-stone-300">
              <div>
                <span className="text-xs text-stone-700 dark:text-stone-300 uppercase font-semibold block">
                  {language === 'en' ? 'Recommended pot:' : 'Rekomendowana donica:'}
                </span>
                <strong className="text-stone-900 dark:text-stone-100 font-bold">
                  min. {plant.pot.min_volume_l}L ({plant.pot.min_depth_cm || 20} cm)
                </strong>
              </div>
              <div>
                <span className="text-xs text-stone-700 dark:text-stone-300 uppercase font-semibold block">
                  {language === 'en' ? 'Optimal sowing:' : 'Optymalny siew:'}
                </span>
                <strong className="text-stone-900 dark:text-stone-100 font-bold">
                  {timing.bestSowingLabel}
                </strong>
              </div>
            </div>

            {/* Secondary Quick Links */}
            <div className="flex items-center justify-between text-xs px-0.5 pt-1">
              <button
                id={`open-guide-link-${plant.id}`}
                data-testid={`plant-open-guide-link-${plant.id}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(plant);
                }}
                className="min-h-[44px] px-2 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
              >
                <BookOpen className="w-4 h-4" />
                <span>{language === 'en' ? 'Growing guide' : 'Przewodnik uprawy'}</span>
              </button>

              {onOpenPotCalc && (
                <button
                  id={`open-pot-calc-link-${plant.id}`}
                  data-testid={`plant-open-potcalc-link-${plant.id}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenPotCalc(plant);
                  }}
                  className="min-h-[44px] px-2 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
                >
                  <span>{language === 'en' ? '📐 Pot calculator' : '📐 Kalkulator donicy'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
