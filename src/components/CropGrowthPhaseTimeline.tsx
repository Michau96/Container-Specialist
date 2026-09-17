import React, { useState } from 'react';
import {
  Plant,
  MyCropItem,
  PlantGrowthPhase,
  CropTimelineInfo,
} from '../types';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';
import {
  Clock,
  CheckCircle2,
  Calendar,
  Droplets,
  Zap,
  Scissors,
  AlertTriangle,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  plant: Plant;
  crop: MyCropItem;
  onOpenPotSowingModal?: () => void;
  compact?: boolean;
}

export const CropGrowthPhaseTimeline: React.FC<Props> = ({
  plant,
  crop,
  onOpenPotSowingModal,
  compact = false,
}) => {
  const info: CropTimelineInfo = getCropTimelineInfo(plant, crop);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number>(info.currentPhaseIndex);
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);

  const selectedPhase: PlantGrowthPhase = info.phases[selectedPhaseIndex] || info.currentPhase;
  const isSelectedCurrent = selectedPhaseIndex === info.currentPhaseIndex;

  return (
    <div className="bg-stone-50/80 dark:bg-stone-850/80 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-4 sm:p-5 space-y-4">
      {/* 1. Header: Current Day & Countdown to Next Stage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Schemat rozwoju fenologicznego</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Dzień {info.daysSinceSowing} z ~{info.totalDaysToHarvest}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5 flex items-center gap-2">
            <span>Faza {info.currentPhase.order}/{info.phases.length}:</span>
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span>{info.currentPhase.icon}</span>
              <span>{info.currentPhase.name}</span>
            </span>
          </h4>
        </div>

        {/* Next Stage Countdown Badge or Config Button */}
        <div className="flex items-center gap-2">
          {info.daysUntilNextPhase !== null ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Za <strong className="font-bold">{info.daysUntilNextPhase} dni</strong>: {info.phases[info.currentPhaseIndex + 1]?.shortName}
              </span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold">
              🧺 Czas na zbiory!
            </div>
          )}

          {compact && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-700/50 transition cursor-pointer"
              title={isExpanded ? 'Zwiń schemat' : 'Rozwiń schemat'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* 2. Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${info.progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-600 dark:text-stone-400 font-medium">
          <span>Start (siew/sadzonka)</span>
          <span>Postęp cyklu: {info.progressPercent}%</span>
          <span>Pełne zbiory</span>
        </div>
      </div>

      {/* 3. The Visual Phase Stepper Pipeline */}
      {isExpanded && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
            {info.phases.map((phase, idx) => {
              const isPast = idx < info.currentPhaseIndex;
              const isCurrent = idx === info.currentPhaseIndex;
              const isSelected = idx === selectedPhaseIndex;

              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhaseIndex(idx)}
                  className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-emerald-600 bg-white dark:bg-stone-800 border-emerald-600 shadow-xs'
                      : isCurrent
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400/80 text-stone-900 dark:text-stone-100'
                      : isPast
                      ? 'bg-stone-100/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Top indicators */}
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-stone-600 dark:text-stone-400">Krok {phase.order}</span>
                    {isPast ? (
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-tight animate-pulse">
                        Teraz
                      </span>
                    ) : (
                      <span className="text-stone-600 dark:text-stone-400 font-normal">
                        od d.{phase.dayStart}
                      </span>
                    )}
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="text-lg">{phase.icon}</span>
                    <span className="text-xs font-bold leading-snug line-clamp-1">
                      {phase.shortName}
                    </span>
                  </div>

                  {/* Day range */}
                  <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-1">
                    Dni {phase.dayStart}–{phase.dayEnd}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 4. Active Selected Phase Detail Card: "Czego się spodziewać i co robić wtedy" */}
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPhase.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                      {selectedPhase.name} (Dni {selectedPhase.dayStart}–{selectedPhase.dayEnd})
                    </h5>
                    {isSelectedCurrent && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Twoja roślina jest w tej fazie!
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Kliknij inne kroki powyżej, by sprawdzić harmonogram kolejnych faz i przygotować się z wyprzedzeniem.
                  </p>
                </div>
              </div>

              {onOpenPotSowingModal && (
                <button
                  type="button"
                  onClick={onOpenPotSowingModal}
                  className="px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Zmień datę siewu / donicę</span>
                </button>
              )}
            </div>

            {/* "Czego się spodziewać" */}
            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200/70 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>Czego się spodziewać:</span>
              </div>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {selectedPhase.whatToExpect}
              </p>
            </div>

            {/* "Co robić wtedy - Kluczowe zadanie" */}
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Co robić wtedy (Kluczowa akcja ogrodnika):</span>
              </div>
              <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                {selectedPhase.keyCareAction}
              </p>
            </div>

            {/* 3 Pillars of Care for this Phase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Watering */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Podlewanie w tej fazie</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                  {selectedPhase.wateringTip}
                </p>
              </div>

              {/* Fertilizing */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Nawożenie w tej fazie</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                  {selectedPhase.fertilizingTip}
                </p>
              </div>

              {/* Pruning / Supports */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Pielęgnacja & Podpory</span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                  {selectedPhase.pruningOrSupportTip ||
                    'Zapewnij optymalne nasłonecznienie, obracaj donicę i usuwaj zwiędłe listki.'}
                </p>
              </div>
            </div>

            {/* 5. Custom Advice based on User's Pot */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-base">🪴</span>
                <div>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    Wpływ Twojej donicy:
                  </span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">
                    {info.potAssessment.message} {info.potAssessment.wateringImpact}
                  </span>
                </div>
              </div>

              {crop.pot ? (
                <span className="shrink-0 font-semibold text-[11px] text-emerald-800 dark:text-emerald-400">
                  {info.potAssessment.badge}
                </span>
              ) : (
                onOpenPotSowingModal && (
                  <button
                    type="button"
                    onClick={onOpenPotSowingModal}
                    className="shrink-0 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    + Skonfiguruj swoją donicę
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
