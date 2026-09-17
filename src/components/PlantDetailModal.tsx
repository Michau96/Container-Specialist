import React from 'react';
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
} from 'lucide-react';
import { Plant } from '../types';
import { FertilizerAndSprayCard } from './FertilizerAndSprayCard';

interface Props {
  plant: Plant | null;
  onClose: () => void;
  onOpenPotCalc?: (plant: Plant) => void;
  isMyCrop?: boolean;
  onToggleMyCrop?: (plantId: string) => void;
}

export const PlantDetailModal: React.FC<Props> = ({
  plant,
  onClose,
  onOpenPotCalc,
  isMyCrop = false,
  onToggleMyCrop,
}) => {
  if (!plant) return null;

  const suit = plant.suitability;
  const score = suit?.score ?? 75;

  const topVarieties = plant.top_varieties && plant.top_varieties.length > 0
    ? plant.top_varieties
    : plant.varieties.map((v) => ({
        name: v,
        badge: 'Polecana do pojemników',
        reason: 'Sprawdzona odmiana o kompaktowym pokroju dostosowana do uprawy balkonowej.',
      }));

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
          label: 'Warzywo balkonowe',
        };
      case 'owoce':
        return {
          headerBg: 'bg-fuchsia-900 dark:bg-fuchsia-950 border-fuchsia-950 dark:border-fuchsia-900',
          badgeText: 'text-fuchsia-200 bg-fuchsia-950/80 border-fuchsia-700/60',
          btnBg: 'bg-fuchsia-800 hover:bg-fuchsia-700 border-fuchsia-700/70',
          icon: '🍓',
          label: 'Owoc balkonowy',
        };
      case 'kielki':
        return {
          headerBg: 'bg-sky-900 dark:bg-sky-950 border-sky-950 dark:border-sky-900',
          badgeText: 'text-sky-200 bg-sky-950/80 border-sky-700/60',
          btnBg: 'bg-sky-800 hover:bg-sky-700 border-sky-700/70',
          icon: '🌱',
          label: 'Mikrolistki i kiełki',
        };
      case 'grzyby':
        return {
          headerBg: 'bg-stone-800 dark:bg-stone-900 border-stone-900 dark:border-stone-800',
          badgeText: 'text-stone-200 bg-stone-900/80 border-stone-700/60',
          btnBg: 'bg-stone-700 hover:bg-stone-600 border-stone-600/70',
          icon: '🍄',
          label: 'Grzyb uprawny',
        };
      case 'ozdobne':
        return {
          headerBg: 'bg-violet-900 dark:bg-violet-950 border-violet-950 dark:border-violet-900',
          badgeText: 'text-violet-200 bg-violet-950/80 border-violet-700/60',
          btnBg: 'bg-violet-800 hover:bg-violet-700 border-violet-700/70',
          icon: '🌸',
          label: 'Roślina ozdobna',
        };
      case 'ziola':
      default:
        return {
          headerBg: 'bg-teal-900 dark:bg-teal-950 border-teal-950 dark:border-teal-900',
          badgeText: 'text-teal-200 bg-teal-950/80 border-teal-700/60',
          btnBg: 'bg-teal-800 hover:bg-teal-700 border-teal-700/70',
          icon: '🌿',
          label: 'Zioło balkonowe',
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
        <div className={`${headerTheme.headerBg} text-white p-5 sm:p-6 flex items-start justify-between border-b transition-colors`}>
          <div>
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
                  {score}% dopasowania do Twojego balkonu
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {plant.name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 mt-1">
              Top 5 rekomendowanych odmian do donic:{' '}
              <strong className="text-white">{topVarieties.map((v) => v.name).join(', ')}</strong>
            </p>
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
                    <span>W Moich uprawach (usuń)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+ Dodaj do Moich upraw</span>
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
                <span>Kalkulator Twojej donicy</span>
              </button>
            )}
            <button
              id="close-plant-modal-btn"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
              aria-label="Zamknij okno"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-stone-850 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Pojemność donicy</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                min. {plant.pot.min_volume_l}L
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">głęb. {plant.pot.min_depth_cm} cm</div>
            </div>

            <div className="bg-white dark:bg-stone-850 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Odczyn pH</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">{plant.soil.ph}</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">lekko kwaśne/obojętne</div>
            </div>

            <div className="bg-white dark:bg-stone-850 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Nasłonecznienie</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1 truncate" title={plant.sun_preference}>
                {plant.orientations.join(', ')}
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{plant.sun_preference.split('(')[0]}</div>
            </div>

            <div className="bg-white dark:bg-stone-850 p-3 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
              <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Trudność (1-10)</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">{plant.difficulty} / 10</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                {plant.difficulty <= 3 ? 'Dla początkujących' : 'Średnia'}
              </div>
            </div>
          </div>

          {/* Streszczenie uprawy */}
          <div className="bg-stone-100/90 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Streszczenie uprawy w donicy</span>
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{plant.summary}</p>
          </div>

          {/* OGÓLNE INFORMACJE O PODŁOŻU I ODNOŚNIK DO SCHEMATU DONICY (zgodnie z życzeniem usera) */}
          <div id="plant-soil-general-section" className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-150 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Wymagania glebowe i ogólne zasady podłoża
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Podstawowe parametry ziemi dla tej uprawy
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
                  Zalecany typ ziemi:
                </div>
                <p className="text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                  {plant.soil.type}
                </p>
              </div>

              <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                  Drenaż i struktura:
                </div>
                <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  Konieczny drenaż z keramzytu (2–4 cm na dnie donicy) oraz domieszka perlitu dla dotlenienia korzeni i ochrony przed przelaniem.
                </p>
              </div>
            </div>

            <div className="bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 p-3.5 rounded-xl flex items-start gap-3">
              <span className="text-xl leading-none">💡</span>
              <div className="text-xs text-amber-950 dark:text-amber-200 space-y-1">
                <p className="font-semibold text-[12px]">
                  Indywidualny schemat warstw podłoża w donicy:
                </p>
                <p className="text-amber-900 dark:text-amber-300 leading-relaxed text-[11px]">
                  Szczegółowy przekrój warstw donicy, dokładne proporcje keramzytu, perlitu oraz łączną objętość ziemi dobierzesz w zakładce <strong>„Projektant donicy i rozstawy”</strong> po skomponowaniu upraw.
                </p>
                {onOpenPotCalc && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPotCalc(plant);
                    }}
                    className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    <span>📐 Przejdź do schematu donicy</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CZYM NAWOZIĆ I CZY STOSOWAĆ OPRYSK */}
          <div id="plant-fertilizer-spray-section">
            <FertilizerAndSprayCard
              fertilizerGuide={plant.fertilizer_guide}
              sprayGuide={plant.spray_guide}
              fallbackFertilizer={plant.soil.fertilizer}
            />
          </div>

          {/* ROZSTAWA, GŁĘBOKOŚĆ I PODPORY */}
          {plant.spacing_guide && (
            <div className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-stone-800 dark:bg-stone-700 text-white flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Rozstawa, siew i podpory</h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">Zasady rozmieszczenia sadzonek w pojemnikach</p>
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
                    Otwórz szkicownik donicy →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase block mb-1">
                    Rozstawa między roślinami:
                  </span>
                  <span className="text-base font-bold text-stone-900 dark:text-stone-100">
                    co {plant.spacing_guide.spacing_cm} cm
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block mt-1">
                    Głębokość siewu/sadzenia: <strong>{plant.spacing_guide.planting_depth_cm > 0 ? `${plant.spacing_guide.planting_depth_cm} cm` : 'powierzchniowo'}</strong>
                  </span>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase block mb-1">
                    Pojemność standardowych donic:
                  </span>
                  <span className="text-xs text-stone-800 dark:text-stone-200 block">
                    Skrzynka 60cm: <strong>max {plant.spacing_guide.max_plants_per_standard_box_60cm} szt.</strong>
                  </span>
                  <span className="text-xs text-stone-800 dark:text-stone-200 block mt-1">
                    Doniczka ⌀ 30cm: <strong>max {plant.spacing_guide.max_plants_per_round_pot_30cm} szt.</strong>
                  </span>
                </div>

                <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase block mb-1">
                    Podpory i prowadzenie:
                  </span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block leading-tight">
                    {plant.spacing_guide.supports_needed}
                  </span>
                </div>
              </div>

              {/* Dedykowane moduły: Palik Bambusowy oraz Metoda Siewu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {/* 1. Palik bambusowy */}
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    plant.spacing_guide.requires_bamboo_stake
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                      : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base leading-none">🎋</span>
                    <span className="font-bold text-[11px] uppercase tracking-wide">
                      Palik bambusowy:{' '}
                      {plant.spacing_guide.requires_bamboo_stake ? (
                        <span className="text-amber-800 dark:text-amber-300 font-extrabold underline decoration-amber-500">
                          ZWRÓĆ UWAGĘ: NIEZBĘDNY DO UPRAWY
                        </span>
                      ) : (
                        <span className="text-stone-500 dark:text-stone-400 font-semibold">
                          Zbędny (brak konieczności)
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {plant.spacing_guide.bamboo_stake_desc ||
                      (plant.spacing_guide.requires_bamboo_stake
                        ? 'Wbij palik bambusowy przy wysadzaniu rośliny, aby nie uszkodzić rozwijającej się bryły korzeniowej.'
                        : 'Roślina samonośna, płożąca lub niska – nie wymaga palikowania.')}
                  </p>
                </div>

                {/* 2. Siew gniazdowy vs pojedynczy vs rzutowy */}
                <div className="p-3.5 rounded-xl border bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base leading-none">🌱</span>
                    <span className="font-bold text-[11px] uppercase tracking-wide text-stone-800 dark:text-stone-200">
                      Metoda siewu / sadzenia:{' '}
                      <span className="font-extrabold underline decoration-stone-400">
                        {plant.spacing_guide.sowing_type === 'gniazdowo'
                          ? 'SIEW GNIAZDOWY'
                          : plant.spacing_guide.sowing_type === 'pojedynczo'
                          ? 'SIEW POJEDYNCZY'
                          : plant.spacing_guide.sowing_type === 'rzutowo'
                          ? 'SIEW RZUTOWY GĘSTY'
                          : plant.spacing_guide.sowing_type === 'grzybnia'
                          ? 'ZASZCZEPIENIE GRZYBNIĄ'
                          : 'SADZENIE ROZSADY'}
                      </span>
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-stone-700 dark:text-stone-300">
                    {plant.spacing_guide.sowing_type_details ||
                      plant.spacing_guide.planting_method}
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200/80 dark:border-stone-700">
                <strong>Zalecenie agrotechniczne:</strong> {plant.spacing_guide.planting_method}
              </div>
            </div>
          )}

          {/* Analiza dopasowania do Twojego balkonu z rygorystyczną paletą Czerwony / Żółty / Zielony */}
          {suit && (
            <div className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ocena warunków na Twoim balkonie ({suit.suitability_level})</span>
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
                        <strong className="font-semibold">Potwierdzone:</strong> {r}
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
                          <strong className="font-semibold">Wysokie ryzyko:</strong> {w}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={i}
                        className="text-xs text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 p-2.5 rounded-xl flex items-start gap-2 border border-amber-300 dark:border-amber-800"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="font-semibold">Zwróć uwagę:</strong> {w}
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
                      <span>💡 <strong className="font-semibold">Zwróć uwagę / Porada:</strong> {t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEKCJA: WARTOŚCI ODŻYWCZE, WITAMINY I MINERAŁY */}
          {plant.nutrition && (
            <div id="plant-nutrition-section" className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-100 dark:border-stone-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 flex items-center justify-center font-bold">
                    <Heart className="w-4 h-4 fill-pink-500 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      Wartości odżywcze, witaminy i wpływ na zdrowie
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Dlaczego warto zrywać prosto z krzaczka na balkonie
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                  100% naturalne bio
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
                    Kluczowe witaminy i minerały:
                  </div>
                  <p className="text-stone-900 dark:text-stone-100 font-semibold leading-relaxed">
                    {plant.nutrition.vitamins}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1">
                    Główne korzyści dla organizmu:
                  </div>
                  <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                    {plant.nutrition.key_benefits}
                  </p>
                </div>
              </div>

              {plant.nutrition.antioxidants && (
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs">
                  <span className="font-bold text-stone-700 dark:text-stone-300 text-[11px] uppercase tracking-wide">
                    Antyoksydanty i fitoskładniki:
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

          {/* Sekcja: Top 5 Polecanych Odmian do Donic */}
          <div className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Top 5 odmian, którymi warto się zainteresować
                  </h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Wyselekcjonowane odmiany genetycznie karłowe, o zwartym pokroju i wysokiej plenności w donicach
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full border border-stone-200 dark:border-stone-700">
                5 polecanych
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
                        <strong className="text-stone-700 dark:text-stone-300">Dlaczego warto: </strong>
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sekcja: Dokładny Opis Uprawy (Krok po kroku) - Markdown rendered */}
          <div className="bg-white dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-700">
              <BookOpen className="w-4 h-4 text-stone-800 dark:text-stone-200" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Dokładny przewodnik uprawy krok po kroku
              </h3>
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

          {/* Sekcja: Zweryfikowane Źródła Portali Ogrodniczych */}
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                <span>Zweryfikowane źródła wiedzy ogrodniczej (krajowe i zagraniczne):</span>
              </span>
              <span className="text-[10px] text-stone-600 dark:text-stone-400 bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded-full font-medium">
                Porady i zalecenia w 100% po polsku
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {plant.sources && plant.sources.map((src, idx) => {
                if (typeof src === 'string') {
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300"
                    >
                      • {src}
                    </div>
                  );
                }
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col justify-between hover:border-stone-400 transition"
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
                        <span>Zobacz publikację / źródło</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {onToggleMyCrop && (
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
                    <span>W Moich uprawach (usuń)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Dodaj do Moich upraw</span>
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
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-800 dark:bg-stone-700 hover:bg-stone-700 dark:hover:bg-stone-600 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ruler className="w-4 h-4" />
                <span>Dopasuj moją donicę i naszkicuj rozstawę</span>
              </button>
            )}
          </div>

          <button
            id="close-plant-detail-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Zamknij przewodnik
          </button>
        </div>
      </div>
    </div>
  );
};
