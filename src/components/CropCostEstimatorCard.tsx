import React, { useState } from 'react';
import {
  Coins,
  Receipt,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import {
  calculateCropCostEstimates,
  CostCalculationParams,
  CropCostSummary,
} from '../lib/cropCostEstimates';

interface Props extends CostCalculationParams {
  className?: string;
  isCompact?: boolean;
  onSowingMethodChange?: (method: 'nasiona' | 'sadzonka') => void;
}

export const CropCostEstimatorCard: React.FC<Props> = ({
  className = '',
  isCompact = false,
  onSowingMethodChange,
  ...calcParams
}) => {
  const [scenario, setScenario] = useState<'full' | 'have_pot' | 'seeds_only'>('full');
  const [showDetails, setShowDetails] = useState<boolean>(!isCompact);
  const [showTips, setShowTips] = useState<boolean>(false);

  const costSummary: CropCostSummary = calculateCropCostEstimates(calcParams);

  // Zależnie od wybranego scenariusza (od zera vs mam donicę vs same nasiona)
  const displayedMin =
    scenario === 'full'
      ? costSummary.totalMin
      : scenario === 'have_pot'
      ? costSummary.starterOnlyMin
      : costSummary.seedsOnlyMin;

  const displayedMax =
    scenario === 'full'
      ? costSummary.totalMax
      : scenario === 'have_pot'
      ? costSummary.starterOnlyMax
      : costSummary.seedsOnlyMax;

  const displayedAvg = Math.round((displayedMin + displayedMax) / 2);

  const activeItems = costSummary.items.filter((item) => {
    if (scenario === 'seeds_only') return item.category === 'seed';
    if (scenario === 'have_pot') return item.category !== 'pot';
    return true;
  });

  return (
    <div
      id="crop-cost-estimator-card"
      className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Header bar */}
      <div className="p-4 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent dark:from-amber-950/30 dark:via-emerald-950/20 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center justify-center text-amber-900 dark:text-amber-200 font-bold text-sm shrink-0">
            <Coins className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Szacunkowy koszt założenia uprawy
              </h3>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
                Orientacyjnie
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Nasiona / sadzonka + donica + ziemia warzywna + drenaż
            </p>
          </div>
        </div>

        {/* Total Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/80 dark:bg-stone-800 px-3.5 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700/70 shadow-2xs">
          <div className="text-right">
            <div className="text-[10px] text-stone-500 font-semibold uppercase tracking-wider">
              {scenario === 'full'
                ? 'Koszt całości od zera'
                : scenario === 'have_pot'
                ? 'Gdy masz już donicę'
                : 'Sam materiał siewny'}
            </div>
            <div className="text-sm sm:text-base font-extrabold text-amber-900 dark:text-amber-300">
              ok. {displayedMin} – {displayedMax} zł
              <span className="text-xs font-medium text-stone-500 ml-1">(śr. ~{displayedAvg} zł)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Scenarios / Quick Presets */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center justify-between">
            <span>Wariant kalkulacji kosztów:</span>
            {onSowingMethodChange && (
              <div className="flex items-center gap-1 normal-case text-stone-600 dark:text-stone-400 font-medium">
                <span>Metoda:</span>
                <button
                  type="button"
                  onClick={() => onSowingMethodChange('nasiona')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    calcParams.sowingMethod === 'nasiona'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  🌱 Z nasion
                </button>
                <button
                  type="button"
                  onClick={() => onSowingMethodChange('sadzonka')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    calcParams.sowingMethod === 'sadzonka'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  🌿 Gotowa rozsada
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setScenario('full')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                scenario === 'full'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <div>
                <div className="text-xs font-bold">1. Od zera (komplet)</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">Donica + ziemia + nasiona</div>
              </div>
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                {costSummary.totalMin}–{costSummary.totalMax} zł
              </span>
            </button>

            <button
              type="button"
              onClick={() => setScenario('have_pot')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                scenario === 'have_pot'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <div>
                <div className="text-xs font-bold">2. Mam już donicę</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">Tylko ziemia + nasiona</div>
              </div>
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                {costSummary.starterOnlyMin}–{costSummary.starterOnlyMax} zł
              </span>
            </button>

            <button
              type="button"
              onClick={() => setScenario('seeds_only')}
              className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                scenario === 'seeds_only'
                  ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <div>
                <div className="text-xs font-bold">3. Tylko siew/sadzonka</div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400">Mam ziemię i donicę</div>
              </div>
              <span className="text-xs font-extrabold text-amber-900 dark:text-amber-300">
                {costSummary.seedsOnlyMin}–{costSummary.seedsOnlyMax} zł
              </span>
            </button>
          </div>
        </div>

        {/* Itemized Breakdown Accordion / List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-stone-500" />
              <span>Szczegółowe rozbicie pozycji (co za ile):</span>
            </span>
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showDetails ? (
                <>
                  <span>Zwiń listę</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Pokaż listę ({activeItems.length})</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {showDetails && (
            <div className="space-y-2 pt-1">
              <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-stone-50/50 dark:bg-stone-800/50">
                {activeItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <span className="text-base shrink-0 select-none mt-0.5">{item.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-stone-600 dark:text-stone-400 bg-stone-200/70 dark:bg-stone-700/60 px-1.5 py-0.5 rounded font-medium">
                            {item.quantityText}
                          </span>
                          {item.optional && (
                            <span className="text-[9px] text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-900/40 px-1 py-0.2 rounded font-semibold">
                              Opcjonalnie
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">
                          {item.note}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 self-end sm:self-center pl-7 sm:pl-0">
                      <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 shadow-2xs">
                        {item.totalRange.min === item.totalRange.max
                          ? `${item.totalRange.min} zł`
                          : `${item.totalRange.min} – ${item.totalRange.max} zł`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total footer summary */}
              <div className="p-3 bg-stone-100 dark:bg-stone-800/70 rounded-xl border border-stone-200 dark:border-stone-700/80 flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  Łączna suma orientacyjna ({scenario === 'full' ? 'komplet' : scenario === 'have_pot' ? 'bez donicy' : 'tylko nasiona'}):
                </span>
                <span className="text-sm font-black text-emerald-800 dark:text-emerald-300">
                  {displayedMin} – {displayedMax} PLN
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer / Informacja o szacunkowości */}
        <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-[11px] text-amber-900 dark:text-amber-100">
              Informacja o szacunkach kosztowych:
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
              {costSummary.disclaimer}
            </p>
          </div>
        </div>

        {/* Saving Tips Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{showTips ? 'Ukryj wskazówki oszczędnościowe' : 'Jak zoptymalizować koszty uprawy? (Porady)'}</span>
            {showTips ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showTips && (
            <div className="mt-2 p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs space-y-1.5">
              <div className="font-bold text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Praktyczne sposoby na obniżenie kosztów:</span>
              </div>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-950 dark:text-emerald-200/90">
                {costSummary.savingTips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
