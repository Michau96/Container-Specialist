import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X,
  Maximize2,
  Layers,
  Sparkles,
  BookOpen,
  Sun,
  Wind,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  Heart,
  Star,
  Ruler,
  ExternalLink,
  Globe,
  Plus,
  Check,
  Calendar,
  Sprout,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Plant } from '../types';
import { FertilizerAndSprayCard } from './FertilizerAndSprayCard';
import { CropCostEstimatorCard } from './CropCostEstimatorCard';
import { getPlantTimingInfo } from '../lib/cropTiming';
import { getPlantGreenhouseInfo } from '../lib/greenhouse';
import { getPlantVarieties } from '../lib/varietyData';
import { getPlantVisual } from '../lib/plantImages';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
  plant: Plant | null;
  onClose: () => void;
  onOpenPotCalc?: (plant: Plant) => void;
  isMyCrop?: boolean;
  cropCount?: number;
  onToggleMyCrop?: (plantId: string) => void;
  onRequestAddVariety?: (plant: Plant, varietyName?: string, varietyBadge?: string) => void;
}

export const PlantDetailModal: React.FC<Props> = ({
  plant,
  onClose,
  onOpenPotCalc,
  isMyCrop = false,
  cropCount = 0,
  onToggleMyCrop,
  onRequestAddVariety,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  if (!plant) return null;

  const suit = plant.suitability;
  const score = suit?.score ?? 75;
  const timing = getPlantTimingInfo(plant, new Date(), isEn);
  const greenhouse = getPlantGreenhouseInfo(plant);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const topVarieties = getPlantVarieties(plant);

  const cleanReasons = suit?.reasons.filter((r) => !r.includes('Idealna ekspozycja')) || [];

  // Group theme: strictly avoid green/red as group identity so green/red are reserved for status
  const getHeaderTheme = (group: string) => {
    switch (group) {
      case 'warzywa':
        return {
          headerBg: 'bg-indigo-900 dark:bg-indigo-950 border-indigo-950 dark:border-indigo-900',
          badgeText: 'text-indigo-200 bg-indigo-950/80 border-indigo-700/60',
          btnBg: 'bg-indigo-800 hover:bg-indigo-700 border-indigo-700/70',
          icon: '🥕',
          label: isEn ? 'Balcony Vegetable' : 'Warzywo balkonowe',
        };
      case 'owoce':
        return {
          headerBg: 'bg-fuchsia-900 dark:bg-fuchsia-950 border-fuchsia-950 dark:border-fuchsia-900',
          badgeText: 'text-fuchsia-200 bg-fuchsia-950/80 border-fuchsia-700/60',
          btnBg: 'bg-fuchsia-800 hover:bg-fuchsia-700 border-fuchsia-700/70',
          icon: '🍓',
          label: isEn ? 'Balcony Fruit' : 'Owoc balkonowy',
        };
      case 'kielki':
        return {
          headerBg: 'bg-sky-900 dark:bg-sky-950 border-sky-950 dark:border-sky-900',
          badgeText: 'text-sky-200 bg-sky-950/80 border-sky-700/60',
          btnBg: 'bg-sky-800 hover:bg-sky-700 border-sky-700/70',
          icon: '🌱',
          label: isEn ? 'Microgreens & Sprouts' : 'Mikrolistki i kiełki',
        };
      case 'grzyby':
        return {
          headerBg: 'bg-stone-800 dark:bg-stone-900 border-stone-900 dark:border-stone-800',
          badgeText: 'text-stone-200 bg-stone-900/80 border-stone-700/60',
          btnBg: 'bg-stone-700 hover:bg-stone-600 border-stone-600/70',
          icon: '🍄',
          label: isEn ? 'Cultivated Mushroom' : 'Grzyb uprawny',
        };
      case 'ozdobne':
        return {
          headerBg: 'bg-violet-900 dark:bg-violet-950 border-violet-950 dark:border-violet-900',
          badgeText: 'text-violet-200 bg-violet-950/80 border-violet-700/60',
          btnBg: 'bg-violet-800 hover:bg-violet-700 border-violet-700/70',
          icon: '🌸',
          label: isEn ? 'Ornamental Plant' : 'Roślina ozdobna',
        };
      case 'ziola':
      default:
        return {
          headerBg: 'bg-teal-900 dark:bg-teal-950 border-teal-950 dark:border-teal-900',
          badgeText: 'text-teal-200 bg-teal-950/80 border-teal-700/60',
          btnBg: 'bg-teal-800 hover:bg-teal-700 border-teal-700/70',
          icon: '🌿',
          label: isEn ? 'Balcony Herb' : 'Zioło balkonowe',
        };
    }
  };

  const headerTheme = getHeaderTheme(plant.plant_group);

  // Semantic score badge:
  // Red = non-compliant / high risk (<50%)
  // Yellow = attention / tooltip (50-74%)
  // Green = confirmed compliant (>=75%)
  const getSuitabilityBadge = (val: number) => {
    if (val >= 75) {
      return 'bg-emerald-700 text-white ring-1 ring-emerald-500/50';
    }
    if (val >= 50) {
      return 'bg-amber-600 text-white ring-1 ring-amber-400/50';
    }
    return 'bg-red-700 text-white ring-1 ring-red-500/50';
  };

  const visual = getPlantVisual(plant.id, plant.plant_group);

  return (
    <div
      id="plant-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="plant-detail-dialog"
        className="bg-[#FAF8F5] dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
      >
        {/* Header */}
        <div className={`${headerTheme.headerBg} text-white p-5 sm:p-6 flex items-start justify-between border-b transition-colors gap-4`}>
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            {/* Real Plant Photography Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-md relative bg-black/25">
              <img
                src={visual.imageUrl}
                alt={visual.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none -z-0">
                {visual.emoji}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`text-xs font-bold ${headerTheme.badgeText} px-2.5 py-0.5 rounded-md flex items-center gap-1 border`}>
                  <span>{headerTheme.icon}</span> {headerTheme.label}
                </span>
                <span className="text-xs font-bold text-stone-200 uppercase tracking-wider bg-black/30 px-2.5 py-0.5 rounded-md border border-white/10">
                  {plant.category}
                </span>
                {suit && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${getSuitabilityBadge(score)}`}>
                    <Sparkles className="w-3 h-3 text-white/90" />
                    {score}% {isEn ? 'match for your balcony' : 'dopasowania do Twojego balkonu'}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {plant.name}
              </h2>
              <p className="text-xs sm:text-sm text-stone-200 mt-1">
                {isEn ? 'Top 5 recommended varieties for pots: ' : 'Top 5 rekomendowanych odmian do donic: '}
                <strong className="text-white">{topVarieties.map((v) => v.name).join(', ')}</strong>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onToggleMyCrop && (
              <button
                id="modal-toggle-my-crop-btn"
                onClick={() => onToggleMyCrop(plant.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isMyCrop
                    ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-red-600 hover:border-red-500'
                    : 'bg-white text-stone-900 border-white hover:bg-stone-100 shadow-xs'
                }`}
              >
                {isMyCrop ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isEn ? 'In My Crops (remove)' : 'W Moich uprawach (usuń)'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{isEn ? '+ Add to My Crops' : '+ Dodaj do Moich upraw'}</span>
                  </>
                )}
              </button>
            )}

            {onOpenPotCalc && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPotCalc(plant);
                }}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 ${headerTheme.btnBg} text-white text-xs font-semibold rounded-xl border transition cursor-pointer`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{isEn ? 'Your Pot Calculator' : 'Kalkulator Twojej donicy'}</span>
              </button>
            )}
            <button
              id="close-plant-modal-btn"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
              aria-label={isEn ? 'Close window' : 'Zamknij okno'}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* 1. Highlighted Top Decision Metrics (Pojemność, Odczyn pH, Nasłonecznienie, Trudność) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Pojemność donicy */}
            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border-2 border-emerald-500/30 dark:border-emerald-500/40 shadow-xs hover:border-emerald-500/60 transition flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <span>{isEn ? 'Pot Volume' : 'Pojemność donicy'}</span>
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {isEn ? `depth ${plant.pot.min_depth_cm} cm` : `głęb. ${plant.pot.min_depth_cm} cm`}
                </span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  min. {plant.pot.min_volume_l} L
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {plant.pot.recommended_volume_l
                    ? (isEn ? `recommended: ${plant.pot.recommended_volume_l} L` : `zalecana: ${plant.pot.recommended_volume_l} L`)
                    : (isEn ? 'per 1 seedling' : 'na 1 sadzonkę')}
                </div>
              </div>
            </div>

            {/* Odczyn pH */}
            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border-2 border-amber-500/30 dark:border-amber-500/40 shadow-xs hover:border-amber-500/60 transition flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span>{isEn ? 'Soil pH' : 'Odczyn pH'}</span>
                </span>
                <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                  {isEn ? 'soil' : 'podłoże'}
                </span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  pH {plant.soil.ph}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  {plant.soil.ph.includes('5')
                    ? (isEn ? 'slightly acidic' : 'lekko kwaśne')
                    : (isEn ? 'neutral / universal' : 'obojętne / uniwersalne')}
                </div>
              </div>
            </div>

            {/* Nasłonecznienie */}
            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border-2 border-orange-500/30 dark:border-orange-500/40 shadow-xs hover:border-orange-500/60 transition flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                    <Sun className="w-4 h-4" />
                  </div>
                  <span>{isEn ? 'Sunlight' : 'Nasłonecznienie'}</span>
                </span>
                <span className="text-[10px] font-semibold text-orange-800 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/70 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                  {isEn ? 'exposure' : 'wystawa'}
                </span>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight truncate" title={plant.orientations.join(', ')}>
                  {plant.orientations.join(', ')}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate" title={plant.sun_preference}>
                  {plant.sun_preference.split('(')[0]}
                </div>
              </div>
            </div>

            {/* Trudność */}
            <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border-2 border-sky-500/30 dark:border-sky-500/40 shadow-xs hover:border-sky-500/60 transition flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <div className="p-1 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span>{isEn ? 'Difficulty' : 'Trudność'}</span>
                </span>
                <span className="text-[10px] font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
                  {isEn ? 'scale 1-10' : 'skala 1-10'}
                </span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
                  {plant.difficulty} / 10
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  {plant.difficulty <= 3
                    ? (isEn ? 'Beginner friendly' : 'Dla początkujących')
                    : plant.difficulty <= 6
                    ? (isEn ? 'Moderate' : 'Średnio wymagająca')
                    : (isEn ? 'Demanding' : 'Wymagająca')}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Streszczenie uprawy w donicy (kluczowe podsumowanie) */}
          <div className="bg-stone-100/90 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{isEn ? 'Summary of Pot Cultivation' : 'Streszczenie uprawy w donicy'}</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{plant.summary}</p>
          </div>

          {/* Seasonality, Current Date Suitability & Optimal Sowing/Transplanting Windows */}
          <div className="bg-gradient-to-br from-stone-50 via-white to-stone-50 dark:from-stone-850 dark:via-stone-900 dark:to-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Gardening Calendar & Today’s Status' : 'Terminarz ogrodniczy i status na dziś'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isEn ? 'Analysis of the current date and recommended agrotechnical windows' : 'Analiza bieżącej daty oraz rekomendowane okna agrotechniczne'}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs flex items-center gap-1.5 ${
                  timing.badgeTone === 'emerald'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                    : timing.badgeTone === 'amber'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    : timing.badgeTone === 'rose'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                    : timing.badgeTone === 'sky'
                    ? 'bg-sky-100 dark:bg-sky-950 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-700'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700'
                }`}
              >
                <span>{timing.badgeLabel}</span>
              </span>
            </div>

            {/* Current Date Explanation */}
            <div className="p-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {timing.dateExplanation}
            </div>

            {/* Best Sowing & Best Transplanting schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  <Sprout className="w-4 h-4" />
                  <span>{isEn ? 'Best sowing window:' : 'Kiedy najlepszy termin na sianie:'}</span>
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1.5">
                  {timing.bestSowingLabel}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {timing.sowingMethodLabel}
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/80 bg-white dark:bg-stone-800/60 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  <Sun className="w-4 h-4" />
                  <span>{isEn ? 'Best transplanting window:' : 'Kiedy najlepszy termin na sadzenie:'}</span>
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1.5">
                  {timing.bestTransplantingLabel}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  {timing.transplantingNote}
                </div>
              </div>
            </div>
          </div>



          {/* ROZSTAWA, GŁĘBOKOŚĆ I PODPORY */}
          {plant.spacing_guide && (
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 dark:bg-stone-700 text-white flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Spacing, Sowing & Supports' : 'Rozstawa, siew i podpory'}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isEn ? 'Seedling layout rules for container growing' : 'Zasady rozmieszczenia sadzonek w pojemnikach'}
                    </p>
                  </div>
                </div>
                {onOpenPotCalc && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPotCalc(plant);
                    }}
                    className="text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 bg-stone-100 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 transition cursor-pointer"
                  >
                    {isEn ? 'Open Pot Designer →' : 'Otwórz szkicownik donicy →'}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase block mb-1">
                    {isEn ? 'Spacing between plants:' : 'Rozstawa między roślinami:'}
                  </span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? `every ${plant.spacing_guide.spacing_cm} cm` : `co ${plant.spacing_guide.spacing_cm} cm`}
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-1">
                    {isEn ? 'Sowing/planting depth: ' : 'Głębokość siewu/sadzenia: '}
                    <strong>
                      {plant.spacing_guide.planting_depth_cm > 0
                        ? `${plant.spacing_guide.planting_depth_cm} cm`
                        : (isEn ? 'surface level' : 'powierzchniowo')}
                    </strong>
                  </span>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase block mb-1">
                    {isEn ? 'Standard pot capacity:' : 'Pojemność standardowych donic:'}
                  </span>
                  <span className="text-xs text-stone-800 dark:text-stone-200 block">
                    {isEn ? 'Box 60cm: ' : 'Skrzynka 60cm: '}
                    <strong>{isEn ? `max ${plant.spacing_guide.max_plants_per_standard_box_60cm} pcs.` : `max ${plant.spacing_guide.max_plants_per_standard_box_60cm} szt.`}</strong>
                  </span>
                  <span className="text-xs text-stone-800 dark:text-stone-200 block mt-1">
                    {isEn ? 'Round pot ⌀ 30cm: ' : 'Doniczka ⌀ 30cm: '}
                    <strong>{isEn ? `max ${plant.spacing_guide.max_plants_per_round_pot_30cm} pcs.` : `max ${plant.spacing_guide.max_plants_per_round_pot_30cm} szt.`}</strong>
                  </span>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase block mb-1">
                    {isEn ? 'Supports & Training:' : 'Podpory i prowadzenie:'}
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block leading-tight">
                    {plant.spacing_guide.supports_needed}
                  </span>
                </div>
              </div>

              {/* Dedykowane moduły: Palik Bambusowy (tylko gdy niezbędny) oraz Metoda Siewu */}
              <div className={`mt-3 grid gap-3 ${plant.spacing_guide.requires_bamboo_stake ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {/* 1. Palik bambusowy - TYLKO GDY NIEZBĘDNY */}
                {plant.spacing_guide.requires_bamboo_stake && (
                  <div className="p-3.5 rounded-xl border text-xs bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="flex items-center gap-1.5 font-bold text-xs text-amber-900 dark:text-amber-200">
                        <span>🎋</span>
                        <span>{isEn ? 'Bamboo stake:' : 'Palik bambusowy:'}</span>
                      </span>
                      <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded border border-amber-400 dark:border-amber-700">
                        {isEn ? 'Essential for growth' : 'Niezbędny do uprawy'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed font-medium">
                      {plant.spacing_guide.bamboo_stake_desc ||
                        (isEn
                          ? 'Insert a bamboo stake (60–80 cm) to the bottom of the pot during transplanting to protect developing root balls. Tie shoots in a figure-eight.'
                          : 'Wbij palik bambusowy (60–80 cm) w dno donicy już przy wysadzaniu rośliny, aby nie uszkodzić rozwijającej się bryły korzeniowej. Pędy podwiązuj w ósemkę.')}
                    </p>
                  </div>
                )}

                {/* 2. Siew gniazdowy vs pojedynczy vs rzutowy */}
                <div className="p-3.5 rounded-xl border bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
                      <span>🌱</span>
                      <span>{isEn ? 'Sowing pattern:' : 'Metoda siewu w schemacie:'}</span>
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        plant.spacing_guide.sowing_type === 'gniazdowo'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                      }`}
                    >
                      {plant.spacing_guide.sowing_type === 'gniazdowo'
                        ? (isEn ? 'CLUSTER SOWING' : 'SIEW GNIAZDOWY')
                        : plant.spacing_guide.sowing_type === 'pojedynczo'
                        ? (isEn ? 'SINGLE SEED SOWING' : 'SIEW POJEDYNCZY')
                        : plant.spacing_guide.sowing_type === 'rzutowo'
                        ? (isEn ? 'BROADCAST SOWING' : 'SIEW RZUTOWY GĘSTY')
                        : plant.spacing_guide.sowing_type === 'grzybnia'
                        ? (isEn ? 'MYCELIUM INOCULATION' : 'ZASZCZEPIENIE GRZYBNIĄ')
                        : (isEn ? 'SEEDLING TRANSPLANTING' : 'SADZENIE ROZSADY')}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300 font-medium">
                    {plant.spacing_guide.sowing_type === 'gniazdowo'
                      ? (isEn
                          ? `👉 Cluster sowing: place 2–3 seeds in one hole every ${plant.spacing_guide.spacing_cm} cm. Thin to 1 strongest seedling after sprouting.`
                          : '👉 Siać GNIAZDOWO: umieszczaj po 2–3 nasiona w jednym dołku co ' +
                            plant.spacing_guide.spacing_cm +
                            ' cm. Po wschodach zostaw 1 najsilniejszą siewkę.')
                      : plant.spacing_guide.sowing_type === 'pojedynczo'
                      ? (isEn
                          ? `👉 Single sowing: plant 1 seed (or 1 seedling) per spacing spot every ${plant.spacing_guide.spacing_cm} cm.`
                          : '👉 Siać POJEDYNCZO: wysiewaj punktowo po 1 nasionku (lub sadź 1 sadzonkę) w każdym punkcie rozstawy co ' +
                            plant.spacing_guide.spacing_cm +
                            ' cm.')
                      : plant.spacing_guide.sowing_type_details ||
                        plant.spacing_guide.planting_method}
                  </p>
                  {plant.spacing_guide.sowing_type_details &&
                    plant.spacing_guide.sowing_type !== 'gniazdowo' &&
                    plant.spacing_guide.sowing_type !== 'pojedynczo' && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        {plant.spacing_guide.sowing_type_details}
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-3 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200/80 dark:border-stone-700">
                <strong>{isEn ? 'Agrotechnical recommendation: ' : 'Zalecenie agrotechniczne: '}</strong> {plant.spacing_guide.planting_method}
              </div>
            </div>
          )}

          {/* Analiza dopasowania do Twojego balkonu z rygorystyczną paletą Czerwony / Żółty / Zielony */}
          {suit && (
            <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>
                  {isEn
                    ? `Balcony Conditions Assessment (${suit.suitability_level})`
                    : `Ocena warunków na Twoim balkonie (${suit.suitability_level})`}
                </span>
              </h3>

              {/* Potwierdzone spełnienie wymagań (ZIELONY) */}
              {cleanReasons.length > 0 && (
                <div className="space-y-1.5">
                  {cleanReasons.map((r, i) => (
                    <div
                      key={i}
                      className="text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 p-2.5 rounded-xl flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold">{isEn ? 'Confirmed: ' : 'Potwierdzone: '}</strong> {r}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Ostrzeżenia i ryzyka: CZERWONY gdy score < 50, ŻÓŁTY gdy 50-74 */}
              {suit.warnings.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-700">
                  {suit.warnings.map((w, i) => {
                    const isHighRisk = score < 50;
                    return isHighRisk ? (
                      <div
                        key={i}
                        className="text-xs text-red-900 dark:text-red-200 bg-red-50 dark:bg-red-950/60 p-2.5 rounded-xl flex items-start gap-2 border border-red-300 dark:border-red-800"
                      >
                        <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-semibold">{isEn ? 'High risk: ' : 'Wysokie ryzyko: '}</strong> {w}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-xl flex items-start gap-2 border border-amber-300 dark:border-amber-800"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-semibold">{isEn ? 'Note: ' : 'Zwróć uwagę: '}</strong> {w}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tooltipy i porady (ŻÓŁTY) */}
              {suit.tips.length > 0 && (
                <div className="space-y-1 pt-1">
                  {suit.tips.map((t, i) => (
                    <div
                      key={i}
                      className="text-xs text-amber-950 dark:text-amber-200 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 p-2 rounded-lg flex items-center gap-1.5"
                    >
                      <span>💡 <strong className="font-semibold">{isEn ? 'Tip / Note:' : 'Zwróć uwagę / Porada:'}</strong> {t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sekcja: Top 5 Polecanych Odmian do Donic */}
          <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Top 5 varieties worth considering' : 'Top 5 odmian, którymi warto się zainteresować'}
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isEn
                      ? 'Selected genetically dwarf, compact varieties with high container yield'
                      : 'Wyselekcjonowane odmiany genetycznie karłowe, o zwartym pokroju i wysokiej plenności w donicach'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                {isEn ? '5 recommended' : '5 polecanych'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {topVarieties.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-semibold text-stone-700 dark:text-stone-300 bg-stone-200/80 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                        <strong className="text-stone-700 dark:text-stone-300">
                          {isEn ? 'Why choose it: ' : 'Dlaczego warto: '}
                        </strong>
                        {item.reason}
                      </p>
                    </div>
                  </div>

                  {onRequestAddVariety && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onRequestAddVariety(plant, item.name, item.badge);
                      }}
                      className="shrink-0 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer self-start sm:self-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Select this variety 🌱' : 'Wybierz tę odmianę 🌱'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AKORDEON: WSKAZÓWKI DLA ZAAWANSOWANYCH (Progressive Disclosure) */}
          <div className="border border-stone-200 dark:border-stone-700 rounded-2xl bg-white dark:bg-stone-800/90 overflow-hidden shadow-xs">
            <button
              type="button"
              id="toggle-advanced-plant-details-btn"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-stone-50 dark:hover:bg-stone-800/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-lg shrink-0">
                  🛠️
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Advanced Tips & Specifications' : 'Wskazówki dla zaawansowanych'}
                    </h3>
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                      {isEn ? 'Greenhouse, fertilizer, costs, vitamins, guide' : 'Szklarnia, nawożenie, koszty, witaminy, przewodnik'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {isAdvancedOpen
                      ? (isEn ? 'Click to collapse detailed modules' : 'Kliknij, aby zwinąć szczegółowe moduły i wskazówki')
                      : (isEn ? 'Expand to view greenhouse guide, soil composition, spraying, costs, and sources' : 'Rozwiń, aby zobaczyć instrukcję szklarniową, skład gleby, opryski, koszty i źródła')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 hidden sm:inline">
                  {isAdvancedOpen ? (isEn ? 'Collapse' : 'Zwiń') : (isEn ? 'Expand' : 'Rozwiń')}
                </span>
                <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {isAdvancedOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </button>

            {isAdvancedOpen && (
              <div className="p-4 sm:p-6 border-t border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-900/40 space-y-6">
                {/* 1. Balkonowa mini-szklarnia i mikroklimat */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-stone-100 dark:border-stone-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-base">
                        {greenhouse.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span>{isEn ? 'Balcony Greenhouse / Foil Cover Cultivation' : 'Uprawa w szklarni balkonowej / mini-folii'}</span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                              greenhouse.badgeTone === 'emerald'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                                : greenhouse.badgeTone === 'amber'
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                                : greenhouse.badgeTone === 'rose'
                                ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300'
                            }`}
                          >
                            {greenhouse.label}
                          </span>
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-400">
                          {isEn ? 'Microclimate assessment of foil racks, cold frames, and balcony greenhouses' : 'Ocena mikroklimatu regałów foliowych, inspektów i szklarni balkonowych'}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-xl border border-emerald-200/80 dark:border-emerald-800">
                      🌡️ {greenhouse.temperatureGain}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    {greenhouse.reason}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs">
                      <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>{isEn ? 'Ventilation & Overheating Risk:' : 'Wietrzenie i ryzyko przegrzania:'}</span>
                      </div>
                      <div className="text-amber-950 dark:text-amber-300/90 leading-relaxed">
                        {greenhouse.risksAndVentilation}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs">
                      <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 mb-1">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{isEn ? 'Practical Balcony Tip:' : 'Praktyczna wskazówka balkonowa:'}</span>
                      </div>
                      <div className="text-emerald-950 dark:text-emerald-300/90 leading-relaxed">
                        {greenhouse.practicalTip}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Wymagania glebowe i ogólne zasady podłoża */}
                <div id="plant-soil-general-section" className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-150 dark:border-stone-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold">
                        <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {isEn ? 'Soil Requirements & Substrate Rules' : 'Wymagania glebowe i ogólne zasady podłoża'}
                        </h4>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {isEn ? 'Primary soil parameters for this crop' : 'Podstawowe parametry ziemi dla tej uprawy'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700">
                      pH {plant.soil.ph}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                      <div className="text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                        {isEn ? 'Recommended soil type:' : 'Zalecany typ ziemi:'}
                      </div>
                      <p className="text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                        {plant.soil.type}
                      </p>
                    </div>

                    <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                      <div className="text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                        {isEn ? 'Drainage & structure:' : 'Drenaż i struktura:'}
                      </div>
                      <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                        {isEn
                          ? 'Expanded clay aggregate drainage (2–4 cm at bottom of pot) and perlite admixture required for root aeration and overwatering protection.'
                          : 'Konieczny drenaż z keramzytu (2–4 cm na dnie donicy) oraz domieszka perlitu dla dotlenienia korzeni i ochrony przed przelaniem.'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3.5 rounded-xl flex items-start gap-3">
                    <span className="text-xl leading-none">💡</span>
                    <div className="text-xs text-amber-950 dark:text-amber-200 space-y-1">
                      <p className="font-semibold text-[12px]">
                        {isEn ? 'Custom pot soil layer design:' : 'Indywidualny schemat warstw podłoża w donicy:'}
                      </p>
                      <p className="text-amber-900 dark:text-amber-300 leading-relaxed text-[11px]">
                        {isEn
                          ? 'Detailed layer breakdown, exact clay/perlite proportions, and total soil volume can be designed in the "Pot & Spacing Designer" tab after planning your crops.'
                          : 'Szczegółowy przekrój warstw donicy, dokładne proporcje keramzytu, perlitu oraz łączną objętość ziemi dobierzesz w zakładce „Projektant donicy i rozstawy” po skomponowaniu upraw.'}
                      </p>
                      {onOpenPotCalc && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenPotCalc(plant);
                          }}
                          className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          <span>{isEn ? '📐 Go to pot designer' : '📐 Przejdź do schematu donicy'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Czym nawozić i czy stosować oprysk */}
                <div id="plant-fertilizer-spray-section">
                  <FertilizerAndSprayCard
                    fertilizerGuide={plant.fertilizer_guide}
                    sprayGuide={plant.spray_guide}
                    fallbackFertilizer={plant.soil.fertilizer}
                  />
                </div>

                {/* 4. Szacunek kosztów uprawy tej rośliny */}
                <CropCostEstimatorCard
                  plant={plant}
                  potVolumeLiters={plant.pot.recommended_volume_l || 15}
                  potMaterial="plastic"
                  supportType={plant.spacing_guide?.requires_bamboo_stake ? 'stake' : 'none'}
                  isCompact={true}
                />

                {/* 5. Wartości odżywcze, witaminy i wpływ na zdrowie */}
                {plant.nutrition && (
                  <div id="plant-nutrition-section" className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-100 dark:border-stone-700">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 flex items-center justify-center font-bold">
                          <Heart className="w-4 h-4 fill-pink-500 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {isEn ? 'Nutritional Value, Vitamins & Health Benefits' : 'Wartości odżywcze, witaminy i wpływ na zdrowie'}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {isEn ? 'Why picking fresh from your balcony bush is unbeatable' : 'Dlaczego warto zrywać prosto z krzaczka na balkonie'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                        {isEn ? '100% natural bio' : '100% naturalne bio'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                        <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
                          {isEn ? 'Key vitamins & minerals:' : 'Kluczowe witaminy i minerały:'}
                        </div>
                        <p className="text-stone-900 dark:text-stone-100 font-semibold leading-relaxed">
                          {plant.nutrition.vitamins}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                        <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
                          {isEn ? 'Main health benefits:' : 'Główne korzyści dla organizmu:'}
                        </div>
                        <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                          {plant.nutrition.key_benefits}
                        </p>
                      </div>
                    </div>

                    {plant.nutrition.antioxidants && (
                      <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs">
                        <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px] uppercase tracking-wide">
                          {isEn ? 'Antioxidants & phytonutrients:' : 'Antyoksydanty i fitoskładniki:'}
                        </span>
                        <p className="text-stone-800 dark:text-stone-200 mt-0.5 leading-relaxed">
                          {plant.nutrition.antioxidants}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {plant.nutrition.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-2.5 py-0.5 rounded-full"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Dokładny Opis Uprawy (Krok po kroku) - Markdown rendered */}
                <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-700">
                    <BookOpen className="w-4 h-4 text-stone-800 dark:text-stone-200" />
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {isEn ? 'Step-by-step Detailed Growing Guide' : 'Dokładny przewodnik uprawy krok po kroku'}
                    </h4>
                  </div>
                  <div className="markdown-body text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-stone-300 font-sans">
                    <ReactMarkdown
                      components={{
                        h3: ({ children }) => (
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 mt-4 mb-2 pb-1 border-b border-stone-200 dark:border-stone-700 flex items-center gap-1.5">
                            {children}
                          </h4>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3 leading-relaxed text-stone-700 dark:text-stone-300">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-1.5 mb-3 text-stone-700 dark:text-stone-300">
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed">
                            {children}
                          </li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-stone-950 dark:text-stone-100">
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {plant.detailed_guide}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* 7. Zweryfikowane Źródła Portali Ogrodniczych */}
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                      <span>{isEn ? 'Verified gardening sources & publications:' : 'Zweryfikowane źródła wiedzy ogrodniczej (krajowe i zagraniczne):'}</span>
                    </span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 px-2 py-0.5 rounded-full font-medium">
                      {isEn ? 'Peer-reviewed horticultural guidance' : 'Porady i zalecenia w 100% po polsku'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {plant.sources && plant.sources.map((src, idx) => {
                      if (typeof src === 'string') {
                        return (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300"
                          >
                            • {src}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-col justify-between hover:border-stone-400 transition"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <span className="font-bold text-stone-900 dark:text-stone-100 text-xs leading-snug">
                                {src.title}
                              </span>
                              {src.country && (
                                <span className="text-[10px] uppercase font-bold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded border border-stone-300 dark:border-stone-600 shrink-0">
                                  {src.country}
                                </span>
                              )}
                            </div>
                            {src.institution && (
                              <p className="text-[10px] text-stone-600 dark:text-stone-400 font-medium mb-0.5">
                                {src.institution}
                              </p>
                            )}
                            {src.notes && (
                              <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                                {src.notes}
                              </p>
                            )}
                          </div>
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white transition underline"
                            >
                              <span>{isEn ? 'View publication / source' : 'Zobacz publikację / źródło'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-stone-400 dark:text-stone-500 pt-3 text-center sm:text-left leading-relaxed">
                    {isEn
                      ? '* Data developed on the basis of literature and verified gardening sources. Due to the specificity of particular balcony microclimates, double verification is recommended.'
                      : '* Dane opracowano na bazie literatury i zweryfikowanych źródeł ogrodniczych. Ze względu na specyfikę poszczególnych mikroklimatów balkonowych informacje mogą zawierać nieścisłości — zalecana jest podwójna weryfikacja.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {onRequestAddVariety ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onRequestAddVariety(plant);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-800 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {isMyCrop
                      ? (isEn ? '+ Add another variety or pot' : '+ Dodaj kolejną odmianę lub inną donicę')
                      : (isEn ? '+ Choose variety & add to crops' : '+ Wybierz odmianę i dodaj do upraw')}
                  </span>
                </button>

                {isMyCrop && onToggleMyCrop && (
                  <button
                    onClick={() => onToggleMyCrop(plant.id)}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-stone-200 dark:bg-stone-700 hover:bg-red-100 hover:text-red-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    title={isEn ? 'Remove all pots of this plant from My Crops' : 'Usuń wszystkie donice tej rośliny z Moich upraw'}
                  >
                    <span>{isEn ? 'Remove from crops' : 'Usuń z upraw'}</span>
                  </button>
                )}
              </>
            ) : (
              onToggleMyCrop && (
                <button
                  onClick={() => onToggleMyCrop(plant.id)}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border ${
                    isMyCrop
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white border-emerald-800 shadow-xs'
                  }`}
                >
                  {isMyCrop ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                      <span>{isEn ? 'In My Crops (remove)' : 'W Moich uprawach (usuń)'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isEn ? '+ Add to My Crops' : '+ Dodaj do Moich upraw'}</span>
                    </>
                  )}
                </button>
              )
            )}

            {onOpenPotCalc && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPotCalc(plant);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ruler className="w-4 h-4" />
                <span>{isEn ? 'Fit my pot & sketch spacing' : 'Dopasuj moją donicę i naszkicuj rozstawę'}</span>
              </button>
            )}
          </div>

          <button
            id="close-plant-detail-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            {isEn ? 'Close Guide' : 'Zamknij przewodnik'}
          </button>
        </div>
      </div>
    </div>
  );
};
