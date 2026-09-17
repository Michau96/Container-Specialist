import React from 'react';
import {
  Sparkles,
  Maximize2,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Layers,
  Heart,
  Plus,
  Check,
} from 'lucide-react';
import { Plant } from '../types';

interface Props {
  plant: Plant;
  onSelect: (plant: Plant) => void;
  onOpenPotCalc?: (plant: Plant) => void;
  isMyCrop?: boolean;
  cropCount?: number;
  onToggleMyCrop?: (plantId: string) => void;
  onRequestAddVariety?: (plant: Plant) => void;
}

export const PlantCard: React.FC<Props> = ({
  plant,
  onSelect,
  onOpenPotCalc,
  isMyCrop = false,
  cropCount = 0,
  onToggleMyCrop,
  onRequestAddVariety,
}) => {
  const suitability = plant.suitability;
  const score = suitability?.score ?? 75;

  // Strict compliance color system:
  // Red = non-compliant / high risk (<50%)
  // Yellow = attention / tooltip (50-74%)
  // Green = confirmed compliant (>=75%)
  const getScoreBadge = (val: number) => {
    if (val >= 75) {
      return 'bg-emerald-700 dark:bg-emerald-800 text-white ring-1 ring-emerald-600/40';
    }
    if (val >= 50) {
      return 'bg-amber-600 dark:bg-amber-700 text-white ring-1 ring-amber-500/40';
    }
    return 'bg-red-700 dark:bg-red-800 text-white ring-1 ring-red-600/40';
  };

  // Plant group colors - strictly avoid green/red so green/red are reserved for status
  const getGroupTheme = (group: 'warzywa' | 'owoce' | 'ziola' | 'ozdobne' | 'kielki' | 'grzyby') => {
    switch (group) {
      case 'warzywa':
        return {
          cardBg: 'bg-gradient-to-b from-indigo-50/50 via-slate-50/20 to-white dark:from-indigo-950/20 dark:via-stone-900/60 dark:to-stone-900',
          border: 'border-indigo-200 dark:border-indigo-900/70 hover:border-indigo-400 dark:hover:border-indigo-600',
          topBar: 'bg-indigo-600 dark:bg-indigo-500',
          badgeBg: 'bg-indigo-100/90 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800',
          badgeIcon: '🥕',
          badgeLabel: 'Warzywo balkonowe',
          nutritionBox: 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/50 text-indigo-950 dark:text-indigo-200',
          nutritionTitle: 'text-indigo-900 dark:text-indigo-300',
          nutritionTag: 'bg-white dark:bg-stone-800 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
          buttonHover: 'bg-indigo-800 hover:bg-indigo-900 dark:bg-indigo-700 dark:hover:bg-indigo-600',
          accentText: 'group-hover:text-indigo-900 dark:group-hover:text-indigo-300',
        };
      case 'owoce':
        return {
          cardBg: 'bg-gradient-to-b from-fuchsia-50/50 via-purple-50/20 to-white dark:from-fuchsia-950/20 dark:via-stone-900/60 dark:to-stone-900',
          border: 'border-fuchsia-200 dark:border-fuchsia-900/70 hover:border-fuchsia-400 dark:hover:border-fuchsia-600',
          topBar: 'bg-fuchsia-600 dark:bg-fuchsia-500',
          badgeBg: 'bg-fuchsia-100/90 dark:bg-fuchsia-950/80 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-200 dark:border-fuchsia-800',
          badgeIcon: '🍓',
          badgeLabel: 'Owoc balkonowy',
          nutritionBox: 'bg-fuchsia-50/50 dark:bg-fuchsia-950/30 border-fuchsia-200/80 dark:border-fuchsia-900/50 text-fuchsia-950 dark:text-fuchsia-200',
          nutritionTitle: 'text-fuchsia-900 dark:text-fuchsia-300',
          nutritionTag: 'bg-white dark:bg-stone-800 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800',
          buttonHover: 'bg-fuchsia-800 hover:bg-fuchsia-900 dark:bg-fuchsia-700 dark:hover:bg-fuchsia-600',
          accentText: 'group-hover:text-fuchsia-900 dark:group-hover:text-fuchsia-300',
        };
      case 'kielki':
        return {
          cardBg: 'bg-gradient-to-b from-sky-50/60 via-slate-50/20 to-white dark:from-sky-950/20 dark:via-stone-900/60 dark:to-stone-900',
          border: 'border-sky-200 dark:border-sky-900/70 hover:border-sky-400 dark:hover:border-sky-600',
          topBar: 'bg-sky-600 dark:bg-sky-500',
          badgeBg: 'bg-sky-100/90 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-800',
          badgeIcon: '🌱',
          badgeLabel: 'Mikrolistki i kiełki',
          nutritionBox: 'bg-sky-50/50 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-900/50 text-sky-950 dark:text-sky-200',
          nutritionTitle: 'text-sky-900 dark:text-sky-300',
          nutritionTag: 'bg-white dark:bg-stone-800 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
          buttonHover: 'bg-sky-800 hover:bg-sky-900 dark:bg-sky-700 dark:hover:bg-sky-600',
          accentText: 'group-hover:text-sky-900 dark:group-hover:text-sky-300',
        };
      case 'grzyby':
        return {
          cardBg: 'bg-gradient-to-b from-stone-100/70 via-stone-50/30 to-white dark:from-stone-800/40 dark:via-stone-900/60 dark:to-stone-900',
          border: 'border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500',
          topBar: 'bg-stone-600 dark:bg-stone-500',
          badgeBg: 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-200 border-stone-300 dark:border-stone-700',
          badgeIcon: '🍄',
          badgeLabel: 'Grzyb uprawny',
          nutritionBox: 'bg-stone-100/60 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-200',
          nutritionTitle: 'text-stone-800 dark:text-stone-300',
          nutritionTag: 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
          buttonHover: 'bg-stone-800 hover:bg-stone-900 dark:bg-stone-700 dark:hover:bg-stone-600',
          accentText: 'group-hover:text-stone-950 dark:group-hover:text-stone-200',
        };
      case 'ozdobne':
        return {
          cardBg: 'bg-gradient-to-b from-violet-50/50 via-purple-50/20 to-white dark:from-violet-950/20 dark:via-stone-900/60 dark:to-stone-900',
          border: 'border-violet-200 dark:border-violet-900/70 hover:border-violet-400 dark:hover:border-violet-600',
          topBar: 'bg-violet-600 dark:bg-violet-500',
          badgeBg: 'bg-violet-100/90 dark:bg-violet-950/80 text-violet-900 dark:text-violet-200 border-violet-200 dark:border-violet-800',
          badgeIcon: '🌸',
          badgeLabel: 'Roślina ozdobna',
          nutritionBox: 'bg-violet-50/50 dark:bg-violet-950/30 border-violet-200/80 dark:border-violet-900/50 text-violet-950 dark:text-violet-200',
          nutritionTitle: 'text-violet-900 dark:text-violet-300',
          nutritionTag: 'bg-white dark:bg-stone-800 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800',
          buttonHover: 'bg-violet-800 hover:bg-violet-900 dark:bg-violet-700 dark:hover:bg-violet-600',
          accentText: 'group-hover:text-violet-900 dark:group-hover:text-violet-300',
        };
      case 'ziola':
      default:
        return {
          cardBg: 'bg-gradient-to-b from-teal-50/50 via-cyan-50/20 to-white dark:from-teal-950/20 dark:via-stone-900/60 dark:to-stone-900',
          border: 'border-teal-200 dark:border-teal-900/70 hover:border-teal-400 dark:hover:border-teal-600',
          topBar: 'bg-teal-600 dark:bg-teal-500',
          badgeBg: 'bg-teal-100/90 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 border-teal-200 dark:border-teal-800',
          badgeIcon: '🌿',
          badgeLabel: 'Zioło balkonowe',
          nutritionBox: 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-200/80 dark:border-teal-900/50 text-teal-950 dark:text-teal-200',
          nutritionTitle: 'text-teal-900 dark:text-teal-300',
          nutritionTag: 'bg-white dark:bg-stone-800 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
          buttonHover: 'bg-teal-800 hover:bg-teal-900 dark:bg-teal-700 dark:hover:bg-teal-600',
          accentText: 'group-hover:text-teal-900 dark:group-hover:text-teal-300',
        };
    }
  };

  const theme = getGroupTheme(plant.plant_group);

  const safeReasons = (suitability?.reasons || []).filter(
    (r) => !r.includes('Idealna ekspozycja')
  );

  return (
    <div
      id={`plant-card-${plant.id}`}
      className={`rounded-[1.5rem] border ${theme.border} ${theme.cardBg} shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group relative dark:bg-stone-900`}
    >
      {/* Top Type Indicator Stripe */}
      <div className={`h-1.5 w-full ${theme.topBar}`} />

      {/* Top Banner / Category & Suitability */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${theme.badgeBg}`}
            >
              <span>{theme.badgeIcon}</span>
              <span>{theme.badgeLabel}</span>
            </span>
            <span className="text-[11px] font-medium text-stone-600 dark:text-stone-300 bg-white/90 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-200/80 dark:border-stone-700">
              {plant.category}
            </span>
          </div>

          {suitability && (
            <div
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs shrink-0 ${getScoreBadge(
                score
              )}`}
              title="Dopasowanie do specyfiki Twojego balkonu"
            >
              <Sparkles className="w-3 h-3 text-white/90" />
              <span>{score}% dopasowania</span>
            </div>
          )}
        </div>

        {/* Title & Varieties */}
        <h3
          className={`text-lg font-bold text-stone-900 dark:text-stone-100 ${theme.accentText} transition tracking-tight`}
        >
          {plant.name}
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
          Odmiany w donice:{' '}
          <span className="text-stone-700 dark:text-stone-300 font-medium">
            {plant.varieties.join(', ')}
          </span>
        </p>

        {/* 10-point complexity bar (Neutral theme to preserve red/yellow/green for status) */}
        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-600 dark:text-stone-400 font-medium">
              Trudność uprawy w donicy:
            </span>
            <span className="px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-[11px] font-semibold">
              {plant.difficulty}/10 •{' '}
              {plant.difficulty <= 2
                ? 'Bardzo łatwa'
                : plant.difficulty <= 4
                ? 'Łatwa'
                : 'Wymagająca'}
            </span>
          </div>

          <div className="grid grid-cols-10 gap-1 h-1.5 w-full bg-stone-100 dark:bg-stone-800 rounded-full p-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-full rounded-full transition ${
                  i < plant.difficulty
                    ? 'bg-stone-600 dark:bg-stone-400'
                    : 'bg-stone-200 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Key Requirements Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
          <div className="bg-white/80 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-medium">
              <Maximize2 className="w-3 h-3 text-stone-600 dark:text-stone-400" />
              <span>Wymóg donicy</span>
            </div>
            <div className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5">
              min. {plant.pot.min_volume_l}L (głęb. {plant.pot.min_depth_cm}cm)
            </div>
          </div>

          <div className="bg-white/80 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1 font-medium">
              <Layers className="w-3 h-3 text-stone-600 dark:text-stone-400" />
              <span>Gleba i odczyn pH</span>
            </div>
            <div
              className="font-semibold text-stone-800 dark:text-stone-200 mt-0.5 truncate"
              title={plant.soil.ph}
            >
              pH {plant.soil.ph}
            </div>
          </div>
        </div>

        {/* Informacje o witaminach i składnikach odżywczych */}
        {plant.nutrition && (
          <div className={`mt-3 p-2.5 rounded-xl border text-xs ${theme.nutritionBox}`}>
            <div className="flex items-center justify-between gap-1 mb-1">
              <div
                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${theme.nutritionTitle}`}
              >
                <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
                <span>Witaminy i składniki:</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                Zdrowie z donicy
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 leading-snug line-clamp-1">
              {plant.nutrition.vitamins}
            </div>
            <div className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-1 mt-0.5">
              {plant.nutrition.key_benefits}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {plant.nutrition.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shadow-2xs ${theme.nutritionTag}`}
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Streszczenie uprawy */}
        <div className="mt-3 bg-white/90 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
          <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1 text-[11px] uppercase tracking-wider">
            Streszczenie uprawy:
          </span>
          <p className="line-clamp-2 leading-relaxed text-stone-600 dark:text-stone-400">
            {plant.summary}
          </p>
        </div>

        {/* Bezpośrednie wytyczne pielęgnacyjne: Nawożenie i Oprysk */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2 flex items-start gap-2">
            <span className="text-amber-700 dark:text-amber-400 font-bold shrink-0">💧 Nawóz:</span>
            <span className="text-stone-800 dark:text-stone-200 line-clamp-1 font-medium">
              {plant.fertilizer_guide ? plant.fertilizer_guide.what : plant.soil.fertilizer}
            </span>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2 flex items-start gap-2">
            <span className="text-sky-700 dark:text-sky-400 font-bold shrink-0">🛡️ Oprysk:</span>
            <span className="text-stone-800 dark:text-stone-200 line-clamp-1 font-medium">
              {plant.spray_guide ? plant.spray_guide.apply_label : 'W razie potrzeby naturalne preparaty'}
            </span>
          </div>

          {plant.spacing_guide && (
            <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-stone-600 dark:text-stone-400 font-medium">📐 Siew i rozstawa:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {plant.spacing_guide.sowing_type === 'gniazdowo'
                    ? 'Siew gniazdowy (gniazdowo)'
                    : plant.spacing_guide.sowing_type === 'pojedynczo'
                    ? 'Siew pojedynczy (pojedynczo)'
                    : plant.spacing_guide.sowing_type === 'rzutowo'
                    ? 'Siew rzutowy'
                    : plant.spacing_guide.sowing_type === 'grzybnia'
                    ? 'Grzybnia w podłożu'
                    : 'Rozsada'}{' '}
                  • co {plant.spacing_guide.spacing_cm} cm
                </span>
              </div>
              {plant.spacing_guide.requires_bamboo_stake && (
                <div className="flex items-center justify-between pt-1 border-t border-stone-200/80 dark:border-stone-700">
                  <span className="text-amber-900 dark:text-amber-300 font-medium flex items-center gap-1">
                    <span>🎋</span>
                    <span>Palik bambusowy:</span>
                  </span>
                  <span className="font-extrabold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700 text-[10px] uppercase tracking-wide">
                    Niezbędny do uprawy
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Balcony feedback notes with strict Red / Yellow / Green semantic color coding */}
        {suitability && (suitability.warnings.length > 0 || safeReasons.length > 0) && (
          <div className="mt-3 space-y-1">
            {/* Warnings: RED if score < 50 (mocno ryzykowne / nie spełnia wymagań), YELLOW if 50-74 (zwróć uwagę) */}
            {suitability.warnings.slice(0, 1).map((warn, i) => {
              const isHighRisk = score < 50;
              return isHighRisk ? (
                <div
                  key={i}
                  className="text-[11px] text-red-900 dark:text-red-200 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 p-2 rounded-lg flex items-start gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    <strong className="font-semibold">Wysokie ryzyko:</strong> {warn}
                  </span>
                </div>
              ) : (
                <div
                  key={i}
                  className="text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-2 rounded-lg flex items-start gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    <strong className="font-semibold">Zwróć uwagę:</strong> {warn}
                  </span>
                </div>
              );
            })}

            {/* Confirmed positive requirements met: GREEN */}
            {suitability.warnings.length === 0 && safeReasons.slice(0, 1).map((reason, i) => (
              <div
                key={i}
                className="text-[11px] text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-2 rounded-lg flex items-start gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  <strong className="font-semibold">Potwierdzone:</strong> {reason}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / CTA Buttons */}
      <div className="p-4 pt-2 border-t border-stone-100 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 space-y-2">
        {onRequestAddVariety ? (
          <button
            id={`add-my-crop-variety-btn-${plant.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onRequestAddVariety(plant);
            }}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              isMyCrop
                ? 'bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white border-emerald-800 shadow-xs'
            }`}
          >
            {isMyCrop ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>W uprawach ({cropCount > 1 ? `${cropCount}x` : 'dodano'}) • Dodaj kolejną donicę +</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Wybierz odmianę i dodaj do upraw</span>
              </>
            )}
          </button>
        ) : onToggleMyCrop ? (
          <button
            id={`toggle-my-crop-btn-${plant.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleMyCrop(plant.id);
            }}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
              isMyCrop
                ? 'bg-emerald-100/90 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700 shadow-xs'
            }`}
          >
            {isMyCrop ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>W Twoich uprawach (kliknij aby usunąć)</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>+ Dodaj do Moich upraw</span>
              </>
            )}
          </button>
        ) : null}

        <button
          id={`open-guide-btn-${plant.id}`}
          onClick={() => onSelect(plant)}
          className={`w-full py-2 px-4 ${theme.buttonHover} text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Szczegółowy przewodnik uprawy</span>
        </button>

        {onOpenPotCalc && (
          <button
            id={`open-pot-calc-btn-${plant.id}`}
            onClick={() => onOpenPotCalc(plant)}
            className="w-full py-1.5 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer border border-stone-200 dark:border-stone-700"
          >
            <span>📐</span>
            <span>Dopasuj donicę i sprawdź rozstawę</span>
          </button>
        )}
      </div>
    </div>
  );
};
