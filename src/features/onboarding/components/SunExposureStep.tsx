import React, { useState } from 'react';
import { Sun, Sunrise, Sunset, CloudSun, Check, ArrowRight, Info, Sparkles } from 'lucide-react';
import { Orientation } from '../../../types';
import { ORIENTATION_OPTIONS, OrientationOption } from '../../../lib/api';

export interface SunExposureStepProps {
  selectedOrientation: Orientation | null;
  onSelectOrientation: (key: Orientation) => void;
  recommendedOrientation?: Orientation | null;
  exposureFilter?: 'main' | 'all';
  onExposureFilterChange?: (filter: 'main' | 'all') => void;
  visibleOrientations?: OrientationOption[];
  isEn?: boolean;
}

interface ExposureVisual {
  title: string;
  titleEn: string;
  sub: string;
  subEn: string;
  icon: React.ReactNode;
}

const EXPOSURE_VISUALS: Record<string, ExposureVisual> = {
  E: {
    title: 'Wschód',
    titleEn: 'East (E)',
    sub: 'Łagodne słońce o poranku',
    subEn: 'Gentle morning sun',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
  },
  S: {
    title: 'Południe',
    titleEn: 'South (S)',
    sub: 'Pełne słońce przez cały dzień',
    subEn: 'Full sun all day',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
  },
  W: {
    title: 'Zachód',
    titleEn: 'West (W)',
    sub: 'Ciepłe popołudnie i wieczór',
    subEn: 'Warm afternoon and evening',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
  },
  N: {
    title: 'Północ',
    titleEn: 'North (N)',
    sub: 'Kojący cień i chłód',
    subEn: 'Soothing shade and coolness',
    icon: <CloudSun className="w-5 h-5 text-sky-500" />,
  },
  SE: {
    title: 'Południowy Wschód',
    titleEn: 'South-East (SE)',
    sub: 'Poranek i południe bez upału',
    subEn: 'Morning & midday without scorching heat',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
  },
  SW: {
    title: 'Południowy Zachód',
    titleEn: 'South-West (SW)',
    sub: 'Najcieplejsza, długa wystawa',
    subEn: 'Warmest, long afternoon exposure',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
  },
  NE: {
    title: 'Północny Wschód',
    titleEn: 'North-East (NE)',
    sub: 'Poranny blask, potem cień',
    subEn: 'Morning glow, afternoon shade',
    icon: <Sunrise className="w-5 h-5 text-sky-500" />,
  },
  NW: {
    title: 'Północny Zachód',
    titleEn: 'North-West (NW)',
    sub: 'Cień w dzień, słońce pod wieczór',
    subEn: 'Daytime shade, late afternoon sun',
    icon: <Sunset className="w-5 h-5 text-orange-400" />,
  },
};

const getSunlightSemanticKey = (key: string): string => {
  switch (key) {
    case 'S':
      return 'full-sun';
    case 'SE':
    case 'SW':
    case 'E':
    case 'W':
      return 'moderate-sun';
    case 'NE':
    case 'NW':
      return 'partial-sun';
    case 'N':
      return 'shade';
    default:
      return key.toLowerCase().replace(/_/g, '-');
  }
};

export const SunExposureStep: React.FC<SunExposureStepProps> = ({
  selectedOrientation,
  onSelectOrientation,
  recommendedOrientation,
  exposureFilter = 'main',
  onExposureFilterChange,
  visibleOrientations,
  isEn = false,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const orientations =
    visibleOrientations ||
    (exposureFilter === 'main'
      ? ORIENTATION_OPTIONS.filter((o) => o.group === 'glowne' || o.group === 'posrednie')
      : ORIENTATION_OPTIONS);

  return (
    <div data-testid="sun-exposure-step" className="space-y-4 w-full">
      {/* Category Filter for Orientation */}
      {onExposureFilterChange && (
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>{isEn ? 'Compass orientation' : 'Kierunek świata'}</span>
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              id="sunlight-filter-main-btn"
              data-testid="sunlight-filter-main"
              onClick={() => onExposureFilterChange('main')}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                exposureFilter === 'main'
                  ? 'bg-stone-900 dark:bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800'
              }`}
            >
              {isEn ? 'Main (8)' : 'Główne (8)'}
            </button>
            <button
              type="button"
              id="sunlight-filter-all-btn"
              data-testid="sunlight-filter-all"
              onClick={() => onExposureFilterChange('all')}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                exposureFilter === 'all'
                  ? 'bg-stone-900 dark:bg-emerald-700 text-white font-bold shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800'
              }`}
            >
              {isEn ? 'All (23)' : 'Wszystkie (23)'}
            </button>
          </div>
        </div>
      )}

      {/* Non-blocking Recommendation Banner */}
      {recommendedOrientation && (
        <div
          data-testid="sunlight-recommendation-banner"
          className="p-3.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 flex items-center justify-between text-xs text-amber-950 dark:text-amber-100 shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-200 dark:bg-amber-900/80 flex items-center justify-center shrink-0 text-amber-900 dark:text-amber-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">
                {isEn ? 'Balcony recommendation: ' : 'Wskazówka dla Twojego balkonu: '}
              </span>
              <span className="text-amber-900 dark:text-amber-200 font-medium">
                {isEn
                  ? `Based on your floor and location, South (${recommendedOrientation}) is typically optimal.`
                  : `Na podstawie wybranego piętra i regionu sugerujemy wystawę południową (${recommendedOrientation}).`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* World Orientation Selector Component Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
        {orientations.map((item) => {
          const isSelected = selectedOrientation === item.key;
          const isRecommended = item.key === recommendedOrientation;
          const visual = EXPOSURE_VISUALS[item.key] || {
            title: item.label.split('(')[0].trim(),
            titleEn: item.label.split('(')[0].trim(),
            sub: item.badge,
            subEn: item.badge,
            icon: <Sun className="w-5 h-5 text-amber-500" />,
          };
          const isTooltipOpen = activeTooltip === item.key;
          const sunlightSemanticKey = getSunlightSemanticKey(item.key);

          return (
            <div key={item.key} className="relative flex flex-col">
              <button
                type="button"
                role="button"
                id={`orient-card-${item.key}`}
                data-testid={`sunlight-option-${sunlightSemanticKey}`}
                data-orientation={item.key}
                data-selected={isSelected ? 'true' : 'false'}
                aria-label={isEn ? visual.titleEn : visual.title}
                aria-pressed={isSelected}
                aria-describedby={`sunlight-desc-${sunlightSemanticKey}`}
                onClick={() => onSelectOrientation(item.key as Orientation)}
                className={`w-full group relative p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer min-h-[56px] min-h-[110px] min-w-[44px] flex flex-col justify-between select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500/30 ring-offset-2 ring-offset-white dark:ring-offset-stone-900'
                    : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-stone-850 text-stone-900 dark:text-stone-100 shadow-2xs'
                }`}
              >
                {/* Card Top: Icon + Title + Badges underneath */}
                <div className="w-full">
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      {visual.icon}
                    </div>
                  </div>

                  <h4 className="whitespace-normal break-words text-sm font-semibold leading-tight text-stone-900 dark:text-stone-100">
                    {isEn ? visual.titleEn : item.label}
                  </h4>

                  <div className="text-xs text-muted-foreground flex flex-col gap-1 mt-1 text-stone-600 dark:text-stone-400">
                    {isRecommended && (
                      <span
                        data-testid="sunlight-recommended-badge"
                        className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400"
                      >
                        <span>{isEn ? 'Recommended ☀️' : 'Rekomendowane ☀️'}</span>
                      </span>
                    )}
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {item.badge}
                    </span>
                  </div>
                </div>

                {/* Bottom action pill: Wybrano / Wybierz */}
                <div className="mt-3 pt-2 w-full flex items-center justify-between border-t border-stone-100 dark:border-stone-800/80">
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-xs whitespace-nowrap">
                      <span>{isEn ? 'Selected ✓' : 'Wybrano ✓'}</span>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:bg-emerald-100 group-hover:text-emerald-900 text-xs font-semibold transition-all whitespace-nowrap">
                      <span>{isEn ? 'Select' : 'Wybierz'}</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>

                <span id={`sunlight-desc-${sunlightSemanticKey}`} className="sr-only">
                  {isEn ? visual.subEn : visual.sub}
                </span>
              </button>

              {/* Info Help Trigger Button */}
              <button
                type="button"
                id={`tooltip-trigger-${item.key}`}
                data-testid={`sunlight-info-${sunlightSemanticKey}`}
                aria-label={isEn ? `Show detailed sunlight description for ${visual.titleEn}` : `Pokaż szczegóły dla ${item.label}`}
                aria-expanded={isTooltipOpen}
                title={isEn ? 'Show details' : 'Pokaż szczegóły'}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip(activeTooltip === item.key ? null : item.key);
                }}
                className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 min-w-[28px] min-h-[28px] rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-stone-100/90 hover:bg-stone-200 dark:bg-stone-800/90 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                  isTooltipOpen ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/70 border-emerald-400' : ''
                }`}
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* Expandable details section */}
              {isTooltipOpen && (
                <div
                  data-testid={`sunlight-details-${sunlightSemanticKey}`}
                  className="mt-2 p-3.5 rounded-xl bg-stone-900 text-white dark:bg-stone-950 dark:border dark:border-stone-700 text-xs shadow-xl animate-fade-in"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <strong className="font-bold text-emerald-300 text-sm">{item.label}</strong>
                    <button
                      type="button"
                      onClick={() => setActiveTooltip(null)}
                      className="text-stone-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-stone-300 leading-relaxed mb-2">{item.desc}</p>
                  <div className="text-[11px] font-medium text-emerald-400 bg-stone-800/80 px-2 py-1 rounded">
                    ☀️ {item.sunHours} • {item.thermal}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
