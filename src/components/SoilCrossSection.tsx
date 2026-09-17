import React from 'react';
import { Layers, Droplets, ArrowDown } from 'lucide-react';
import { Plant, SoilLayersInfo } from '../types';
import { SoilShoppingGuideCard } from './SoilShoppingGuideCard';

interface Props {
  soilLayers?: SoilLayersInfo;
  potHeightCm?: number;
  potVolumeLiters?: number;
  plant?: Plant | null;
  showShoppingGuide?: boolean;
}

export const SoilCrossSection: React.FC<Props> = ({
  soilLayers,
  potHeightCm = 25,
  potVolumeLiters,
  plant,
  showShoppingGuide = true,
}) => {
  const drainageCm = soilLayers?.drainage_cm ?? 3;
  const topMarginCm = soilLayers?.top_margin_cm ?? 2.5;
  const substrateCm = Math.max(10, potHeightCm - drainageCm - topMarginCm);
  const totalHeight = potHeightCm;

  // Obliczenia proporcji objętości
  const drainageLiters = potVolumeLiters ? ((drainageCm / totalHeight) * potVolumeLiters).toFixed(1) : null;
  const substrateLiters = potVolumeLiters ? ((substrateCm / totalHeight) * potVolumeLiters).toFixed(1) : null;

  return (
    <div className="bg-stone-50 dark:bg-stone-850 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-750 transition-colors">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Schemat warstw podłoża w donicy
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Prawidłowy przekrój pionowy zapobiegający gniciu korzeni i przelaniu
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
          pH: {soilLayers?.ph_range ?? '6.0 - 6.8'}
        </span>
      </div>

      {/* Wizualny przekrój donicy */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Kolumna 1: Schemat graficzny przekroju (5 kolumn na md) */}
        <div className="md:col-span-5 bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-2 tracking-wider flex items-center justify-between">
            <span>Przekrój pionowy donicy</span>
            <span>Wysokość: ~{totalHeight} cm</span>
          </div>

          <div className="relative border-x-4 border-b-4 border-stone-700 dark:border-stone-600 rounded-b-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 flex flex-col justify-between shadow-inner">
            {/* 1. Wolny brzeg / margines na wodę (góra) */}
            <div
              style={{ height: '34px' }}
              className="bg-sky-50/70 dark:bg-sky-950/40 border-b border-dashed border-sky-300 dark:border-sky-800 flex items-center justify-between px-3 text-[11px] text-sky-800 dark:text-sky-300 font-medium"
            >
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Margines na wodę</span>
              </div>
              <span className="font-bold text-[10px] bg-white/80 dark:bg-stone-800 px-1.5 py-0.5 rounded text-sky-900 dark:text-sky-200">
                {topMarginCm} cm
              </span>
            </div>

            {/* Opcjonalna ściółka */}
            {soilLayers?.mulch_layer && soilLayers.mulch_layer !== 'Brak' && (
              <div className="bg-amber-100/90 dark:bg-amber-950/60 border-b border-amber-300 dark:border-amber-800 px-3 py-1 flex items-center justify-between text-[10px] text-amber-900 dark:text-amber-200 font-medium">
                <span>Ściółka wierzchnia (mulcz)</span>
                <span className="text-[9px] bg-amber-200/80 dark:bg-amber-900 px-1 rounded">1-2 cm</span>
              </div>
            )}

            {/* 2. Warstwa główna podłoża */}
            <div
              style={{ minHeight: '110px' }}
              className="bg-[#5c4033] dark:bg-[#3d2b22] text-stone-100 p-3 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-200">Główna mieszanka podłoża</div>
                  <div className="text-[10px] text-stone-200 leading-snug mt-1 max-w-[180px]">
                    {soilLayers?.substrate_mix ?? 'Ziemia ogrodnicza + perlit + biohumus'}
                  </div>
                </div>
                <span className="font-bold text-[10px] bg-black/40 px-2 py-0.5 rounded text-amber-300 shrink-0">
                  ~{substrateCm} cm
                </span>
              </div>

              {substrateLiters && (
                <div className="text-[10px] text-stone-300 bg-black/40 px-2 py-0.5 rounded self-start mt-2">
                  Objętość gleby: <strong>{substrateLiters} L</strong>
                </div>
              )}
            </div>

            {/* 3. Warstwa separacyjna (agrowłóknina / siatka) */}
            {soilLayers?.separator_recommended && (
              <div className="bg-stone-400 dark:bg-stone-700 py-0.5 px-3 flex items-center justify-between text-[9px] text-stone-900 dark:text-stone-100 font-semibold border-y border-stone-500">
                <span>Agrowłóknina / siatka drenażowa</span>
                <span className="text-[8px] uppercase tracking-wider">Filtr</span>
              </div>
            )}

            {/* 4. Dno: Warstwa drenażowa */}
            <div
              style={{ minHeight: '44px' }}
              className="bg-stone-300 dark:bg-stone-750 border-t border-stone-400 dark:border-stone-700 p-2.5 flex items-center justify-between text-stone-800 dark:text-stone-200"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-800 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Drenaż (keramzyt)</div>
                  <div className="text-[9px] text-stone-600 dark:text-stone-400">Otwory odpływowe na dnie</div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-[10px] bg-white/80 dark:bg-stone-850 px-2 py-0.5 rounded text-stone-900 dark:text-stone-100">
                  {drainageCm} cm
                </span>
                {drainageLiters && (
                  <div className="text-[9px] text-stone-600 dark:text-stone-400 mt-0.5">~{drainageLiters} L</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-2.5 text-[10px] text-stone-500 dark:text-stone-400">
            <ArrowDown className="w-3 h-3 text-stone-400" />
            <span>Woda odpływa swobodnie do podstawka</span>
          </div>
        </div>

        {/* Kolumna 2: Szczegółowy opis warstw i instrukcja krok po kroku (7 kolumn na md) */}
        <div className="md:col-span-7 space-y-3">
          {/* Krok 1: Dno */}
          <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-700 text-white text-[10px] flex items-center justify-center font-mono">
                  1
                </span>
                Dno: drenaż ({drainageCm} cm)
              </span>
              <span className="text-[10px] font-semibold text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">
                Obowiązkowe otwory
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              <strong>{soilLayers?.drainage_material ?? 'Keramzyt ogrodniczy (frakcja 8-16 mm)'}</strong>.
              Nigdy nie sadź bezpośrednio do donicy bez otworów w dnie! Stojąca woda odcina tlen od korzeni i w kilka dni prowadzi do zgnilizny korzeniowej.
            </p>
          </div>

          {/* Krok 2: Separacja */}
          <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-stone-700 dark:bg-stone-600 text-white text-[10px] flex items-center justify-center font-mono">
                  2
                </span>
                Przegroda filtrująca (siatka / agrowłóknina)
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400">Zalecana</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Połóż kawałek agrowłókniny lub drobnej siatki na keramzycie. Zapobiegnie to przesypywaniu się ziemi między kulki drenażu i zatykaniu otworów odpływowych.
            </p>
          </div>

          {/* Krok 3: Mieszanka podłoża */}
          <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-stone-800 dark:bg-stone-700 text-white text-[10px] flex items-center justify-center font-mono">
                  3
                </span>
                Główna warstwa podłoża ({substrateCm} cm)
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                pH {soilLayers?.ph_range ?? '6.0-6.8'}
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              <strong>Mieszanka:</strong> {soilLayers?.substrate_mix ?? 'Ziemia kompostowa z perlitem i biohumusem'}.
              Domieszka perlitu (15-25%) jest kluczowa w donicach – gwarantuje napowietrzenie i nie pozwala ziemi zbijać się w twardą bryłę.
            </p>
          </div>

          {/* Krok 4: Margines na wodę & Ściółka */}
          <div className="bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-sky-700 text-white text-[10px] flex items-center justify-center font-mono">
                  4
                </span>
                Margines na wodę ({topMarginCm} cm) i ściółka
              </span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Zostaw <strong>{topMarginCm} cm</strong> wolnej przestrzeni od rantu donicy. Dzięki temu podczas podlewania woda nie przelewa się brudnym strumieniem na posadzkę balkonu.
              {soilLayers?.mulch_layer && soilLayers.mulch_layer !== 'Brak' && (
                <span className="block mt-1 text-amber-800 dark:text-amber-300">
                  <strong>Ściółka:</strong> {soilLayers.mulch_layer}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {showShoppingGuide && (
        <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800">
          <SoilShoppingGuideCard plant={plant} />
        </div>
      )}
    </div>
  );
};
