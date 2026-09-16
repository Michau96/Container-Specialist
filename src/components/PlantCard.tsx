import React from 'react';
import {
  Sparkles,
  Maximize2,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Layers,
  Heart,
} from 'lucide-react';
import { Plant } from '../types';

interface Props {
  plant: Plant;
  onSelect: (plant: Plant) => void;
  onOpenPotCalc?: (plant: Plant) => void;
}

export const PlantCard: React.FC<Props> = ({ plant, onSelect, onOpenPotCalc }) => {
  const suitability = plant.suitability;
  const score = suitability?.score ?? 75;

  // 10-point difficulty badge color
  const getDifficultyColor = (diff: number) => {
    if (diff <= 2) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (diff <= 4) return 'bg-lime-100 text-lime-900 border-lime-300';
    if (diff <= 6) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-orange-100 text-orange-950 border-orange-300';
  };

  const getScoreBadge = (val: number) => {
    if (val >= 80) return 'bg-emerald-800 text-white';
    if (val >= 60) return 'bg-amber-700 text-white';
    return 'bg-stone-600 text-white';
  };

  // Color themes based on plant_group (Warzywa / Owoce / Zioła / Ozdobne)
  const getGroupTheme = (group: 'warzywa' | 'owoce' | 'ziola' | 'ozdobne') => {
    switch (group) {
      case 'ozdobne':
        return {
          cardBg: 'bg-gradient-to-b from-purple-50/70 via-fuchsia-50/20 to-white',
          border: 'border-purple-200 hover:border-purple-400',
          topBar: 'bg-purple-600',
          badgeBg: 'bg-purple-100/90 text-purple-900 border-purple-200',
          badgeIcon: '🌸',
          badgeLabel: 'Roślina ozdobna',
          nutritionBox: 'bg-purple-50/70 border-purple-200/90 text-purple-950',
          nutritionTitle: 'text-purple-900',
          nutritionTag: 'bg-white text-purple-800 border-purple-200',
          buttonHover: 'bg-purple-800 hover:bg-purple-900',
          accentText: 'group-hover:text-purple-900',
        };
      case 'owoce':
        return {
          cardBg: 'bg-gradient-to-b from-rose-50/70 via-rose-50/20 to-white',
          border: 'border-rose-200 hover:border-rose-400',
          topBar: 'bg-rose-500',
          badgeBg: 'bg-rose-100/90 text-rose-900 border-rose-200',
          badgeIcon: '🍓',
          badgeLabel: 'Owoc balkonowy',
          nutritionBox: 'bg-rose-50/70 border-rose-200/90 text-rose-950',
          nutritionTitle: 'text-rose-900',
          nutritionTag: 'bg-white text-rose-800 border-rose-200',
          buttonHover: 'bg-rose-800 hover:bg-rose-900',
          accentText: 'group-hover:text-rose-900',
        };
      case 'ziola':
        return {
          cardBg: 'bg-gradient-to-b from-teal-50/70 via-teal-50/20 to-white',
          border: 'border-teal-200 hover:border-teal-400',
          topBar: 'bg-teal-600',
          badgeBg: 'bg-teal-100/90 text-teal-900 border-teal-200',
          badgeIcon: '🌿',
          badgeLabel: 'Zioło balkonowe',
          nutritionBox: 'bg-teal-50/70 border-teal-200/90 text-teal-950',
          nutritionTitle: 'text-teal-900',
          nutritionTag: 'bg-white text-teal-800 border-teal-200',
          buttonHover: 'bg-teal-800 hover:bg-teal-900',
          accentText: 'group-hover:text-teal-900',
        };
      case 'warzywa':
      default:
        return {
          cardBg: 'bg-gradient-to-b from-emerald-50/70 via-emerald-50/20 to-white',
          border: 'border-emerald-200 hover:border-emerald-400',
          topBar: 'bg-emerald-600',
          badgeBg: 'bg-emerald-100/90 text-emerald-900 border-emerald-200',
          badgeIcon: '🥕',
          badgeLabel: 'Warzywo balkonowe',
          nutritionBox: 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950',
          nutritionTitle: 'text-emerald-900',
          nutritionTag: 'bg-white text-emerald-800 border-emerald-200',
          buttonHover: 'bg-emerald-800 hover:bg-emerald-900',
          accentText: 'group-hover:text-emerald-900',
        };
    }
  };

  const theme = getGroupTheme(plant.plant_group);

  // Filter out any lingering "Idealna ekspozycja" mentions
  const safeReasons = (suitability?.reasons || []).filter(
    (r) => !r.includes('Idealna ekspozycja')
  );

  return (
    <div
      id={`plant-card-${plant.id}`}
      className={`rounded-2xl border ${theme.border} ${theme.cardBg} shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group relative`}
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
            <span className="text-[11px] font-medium text-stone-600 bg-white/90 px-2 py-0.5 rounded-md border border-stone-200/80">
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
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{score}% dopasowania</span>
            </div>
          )}
        </div>

        {/* Title & Varieties */}
        <h3
          className={`text-lg font-bold text-stone-900 ${theme.accentText} transition tracking-tight`}
        >
          {plant.name}
        </h3>
        <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
          Odmiany w donice:{' '}
          <span className="text-stone-700 font-medium">{plant.varieties.join(', ')}</span>
        </p>

        {/* 10-point complexity bar */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-stone-600 font-medium">Trudność uprawy w donicy:</span>
            <span
              className={`px-2 py-0.5 rounded-md border text-[11px] font-bold ${getDifficultyColor(
                plant.difficulty
              )}`}
            >
              {plant.difficulty}/10 •{' '}
              {plant.difficulty <= 2
                ? 'Bardzo łatwa'
                : plant.difficulty <= 4
                ? 'Łatwa'
                : 'Wymagająca'}
            </span>
          </div>

          {/* 10-segment scale bar */}
          <div className="grid grid-cols-10 gap-1 h-1.5 w-full bg-stone-100 rounded-full p-0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`h-full rounded-full transition ${
                  i < plant.difficulty
                    ? plant.difficulty <= 3
                      ? 'bg-emerald-600'
                      : plant.difficulty <= 6
                      ? 'bg-amber-500'
                      : 'bg-orange-600'
                    : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Key Requirements Grid */}
        <div className="grid grid-cols-2 gap-2 mt-3.5 text-xs">
          <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200/70">
            <div className="text-[11px] text-stone-500 flex items-center gap-1 font-medium">
              <Maximize2 className="w-3 h-3 text-emerald-700" />
              <span>Wymóg donicy</span>
            </div>
            <div className="font-semibold text-stone-800 mt-0.5">
              min. {plant.pot.min_volume_l}L (głęb. {plant.pot.min_depth_cm}cm)
            </div>
          </div>

          <div className="bg-white/80 p-2.5 rounded-xl border border-stone-200/70">
            <div className="text-[11px] text-stone-500 flex items-center gap-1 font-medium">
              <Layers className="w-3 h-3 text-amber-700" />
              <span>Gleba & pH</span>
            </div>
            <div className="font-semibold text-stone-800 mt-0.5 truncate" title={plant.soil.ph}>
              pH {plant.soil.ph}
            </div>
          </div>
        </div>

        {/* Informacje o witaminach i składnikach odżywczych */}
        {plant.nutrition && (
          <div className={`mt-3 p-2.5 rounded-xl border text-xs ${theme.nutritionBox}`}>
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${theme.nutritionTitle}`}>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>Witaminy & Składniki:</span>
              </div>
              <span className="text-[10px] font-semibold text-stone-500">
                Zdrowie z donicy
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-900 leading-snug line-clamp-1">
              {plant.nutrition.vitamins}
            </div>
            <div className="text-[11px] text-stone-600 line-clamp-1 mt-0.5">
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
        <div className="mt-3 bg-white/70 p-3 rounded-xl border border-stone-200/70 text-xs text-stone-700">
          <span className="font-semibold text-stone-900 block mb-1 text-[11px] uppercase tracking-wider text-emerald-950">
            Streszczenie uprawy:
          </span>
          <p className="line-clamp-2 leading-relaxed text-stone-600">{plant.summary}</p>
        </div>

        {/* Bezpośrednie wytyczne pielęgnacyjne: Nawożenie i Oprysk */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2 flex items-start gap-2">
            <span className="text-amber-700 font-bold shrink-0">💧 Nawóz:</span>
            <span className="text-stone-800 line-clamp-1 font-medium">
              {plant.fertilizer_guide ? plant.fertilizer_guide.what : plant.soil.fertilizer}
            </span>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2 flex items-start gap-2">
            <span className="text-blue-700 font-bold shrink-0">🛡️ Oprysk:</span>
            <span className="text-stone-800 line-clamp-1 font-medium">
              {plant.spray_guide ? plant.spray_guide.apply_label : 'W razie potrzeby naturalne preparaty'}
            </span>
          </div>

          {plant.spacing_guide && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-2 flex items-center justify-between text-[11px]">
              <span className="text-stone-600 font-medium">📐 Rozstawa & Podpora:</span>
              <span className="font-bold text-stone-900">
                co {plant.spacing_guide.spacing_cm} cm • {plant.spacing_guide.supports_needed}
              </span>
            </div>
          )}
        </div>

        {/* Balcony feedback notes if present */}
        {suitability && (suitability.warnings.length > 0 || safeReasons.length > 0) && (
          <div className="mt-3 space-y-1">
            {suitability.warnings.slice(0, 1).map((warn, i) => (
              <div
                key={i}
                className="text-[11px] text-amber-900 bg-amber-50/90 border border-amber-200 p-2 rounded-lg flex items-start gap-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{warn}</span>
              </div>
            ))}
            {suitability.warnings.length === 0 && safeReasons.slice(0, 1).map((reason, i) => (
              <div
                key={i}
                className="text-[11px] text-emerald-900 bg-emerald-50/70 border border-emerald-200 p-2 rounded-lg flex items-start gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{reason}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / CTA Buttons */}
      <div className="p-4 pt-2 border-t border-stone-100 bg-white/60 space-y-2">
        <button
          id={`open-guide-btn-${plant.id}`}
          onClick={() => onSelect(plant)}
          className={`w-full py-2.5 px-4 ${theme.buttonHover} text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Szczegółowy przewodnik uprawy</span>
        </button>

        {onOpenPotCalc && (
          <button
            id={`open-pot-calc-btn-${plant.id}`}
            onClick={() => onOpenPotCalc(plant)}
            className="w-full py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📐</span>
            <span>Dopasuj donicę i sprawdź rozstawę</span>
          </button>
        )}
      </div>
    </div>
  );
};
