import React, { useState, useMemo } from 'react';
import {
  LifeBuoy,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Calendar,
  Check,
} from 'lucide-react';
import { Plant, MyCropItem, CropRescuePlan } from '../types';
import {
  RESCUE_ISSUES,
  RescueIssueDefinition,
  createRescuePlan,
  isWateringSuspended,
  getDaysRemainingInSuspension,
} from '../lib/rescueData';

interface RescueFlowModalProps {
  isOpen: boolean;
  crop: MyCropItem;
  plant: Plant;
  onClose: () => void;
  onActivatePlan: (plan: CropRescuePlan) => void;
  onDismissPlan: () => void;
  onUpdateCrop: (updated: MyCropItem) => void;
}

export const RescueFlowModal: React.FC<RescueFlowModalProps> = ({
  isOpen,
  crop,
  plant,
  onClose,
  onActivatePlan,
  onDismissPlan,
  onUpdateCrop,
}) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
    crop.rescuePlan?.active ? crop.rescuePlan.issueId : null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isChangingIssue, setIsChangingIssue] = useState<boolean>(false);

  // Active plan state
  const activePlan = crop.rescuePlan?.active ? crop.rescuePlan : null;
  const isSuspended = isWateringSuspended(activePlan ?? undefined);
  const remainingDays = getDaysRemainingInSuspension(activePlan ?? undefined);

  // Filtered issues
  const filteredIssues = useMemo(() => {
    if (categoryFilter === 'all') return RESCUE_ISSUES;
    return RESCUE_ISSUES.filter((i) => i.category === categoryFilter);
  }, [categoryFilter]);

  // Selected issue definition for previewing before activation
  const previewIssue = useMemo<RescueIssueDefinition | undefined>(() => {
    return RESCUE_ISSUES.find((i) => i.id === selectedIssueId);
  }, [selectedIssueId]);

  if (!isOpen) return null;

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
  };

  const handleConfirmActivation = () => {
    if (!selectedIssueId) return;
    const newPlan = createRescuePlan(selectedIssueId, plant.name);
    if (newPlan) {
      onActivatePlan(newPlan);
      setIsChangingIssue(false);
    }
  };

  const handleToggleStepCompleted = (stepIdx: number) => {
    if (!activePlan) return;
    const currentSteps = { ...(activePlan.completedSteps || {}) };
    currentSteps[stepIdx] = !currentSteps[stepIdx];

    const updatedPlan: CropRescuePlan = {
      ...activePlan,
      completedSteps: currentSteps,
    };

    onUpdateCrop({
      ...crop,
      rescuePlan: updatedPlan,
    });
  };

  const handleMarkRecovered = () => {
    onDismissPlan();
    onClose();
  };

  const cropVariety =
    crop.selectedVariety ||
    plant.top_varieties?.[0]?.name ||
    (typeof plant.varieties?.[0] === 'string' ? plant.varieties?.[0] : (plant.varieties?.[0] as any)?.name) ||
    'Standardowa';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 dark:bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div
        className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-850/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 tracking-tight">
                  Tryb Ratunkowy: Pogotowie Roślinne
                </h3>
                {activePlan && !isChangingIssue && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                    Aktywny
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                Pacjent: <strong>{plant.name}</strong> ({cropVariety}) {crop.customPotName ? `• ${crop.customPotName}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 transition cursor-pointer"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200">
          {/* SCENARIO A: ACTIVE RESCUE PLAN VIEW (When plan is already running and user didn't request changing it) */}
          {activePlan && !isChangingIssue ? (
            <div className="space-y-6">
              {/* STATUS BANNER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/50 to-orange-50 dark:from-rose-950/40 dark:via-amber-950/20 dark:to-orange-950/30 border-2 border-rose-200 dark:border-rose-800/80 shadow-xs space-y-3">
                <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-800 shadow-2xs">
                      {activePlan.issueIcon}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                        Zdiagnozowany problem • {activePlan.symptomBadge}
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                        {activePlan.issueTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsChangingIssue(true)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                      <span>Zmień diagnozę</span>
                    </button>
                  </div>
                </div>

                {/* WATERING SUSPENSION HIGHLIGHT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-rose-200 dark:border-rose-800 flex items-start sm:items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 shrink-0 mt-0.5 sm:mt-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 flex-wrap">
                      <span>Normalny harmonogram podlewania: ZAWIESZONY</span>
                      {activePlan.suspendedWateringUntil && (
                        <span className="text-[11px] font-normal px-2 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {isSuspended
                            ? `Jeszcze ${remainingDays} ${remainingDays === 1 ? 'dzień' : 'dni'} (do ${activePlan.suspendedWateringUntil})`
                            : 'Okres karencji minął'}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {isSuspended
                        ? 'Podlewanie w tym stanie zablokowałoby dostęp tlenu do korzeni i pogłębiło chorobę. Zastosuj się do poniższych kroków ratunkowych.'
                        : 'Okres całkowitego wstrzymania wody dobiegł końca. Sprawdź palcem wilgotność gleby na 3 cm – jeśli sucho, możesz wznowić delikatne podlewanie.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* DIAGNOSIS & REASON */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Diagnoza i przyczyna na balkonie</span>
                </div>
                <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {activePlan.diagnosis}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {activePlan.cause}
                </p>
              </div>

              {/* ACTION STEPS (INTERACTIVE CHECKLIST) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Jednoetapowy plan ratunkowy (Kroki do wykonania):</span>
                  </h5>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Zaznacz wykonane
                  </span>
                </div>

                <div className="space-y-2">
                  {activePlan.steps.map((step, idx) => {
                    const isDone = Boolean(activePlan.completedSteps?.[idx]);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleStepCompleted(idx)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-stone-500 dark:text-stone-400 line-through'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-400 text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition mt-0.5 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="text-xs sm:text-sm leading-relaxed">{step}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DANGERS TO AVOID */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-amber-900 dark:text-amber-200">Czego unikać:</div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {activePlan.whatToAvoid}
                  </p>
                </div>
              </div>

              {/* RECOVERY TIMELINE & ACTION BUTTONS */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-stone-800 dark:text-stone-200 font-semibold">Oczekiwana poprawa:</strong>{' '}
                  {activePlan.recoveryTimeline}
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold text-xs transition cursor-pointer"
                >
                  Zamknij okno
                </button>

                <button
                  type="button"
                  onClick={handleMarkRecovered}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>Roślina wyzdrowiała – wznów normalny harmonogram</span>
                </button>
              </div>
            </div>
          ) : (
            /* SCENARIO B: ISSUE SELECTION & CONFIRMATION FLOW */
            <div className="space-y-6">
              {/* INTRO EXPLANATION */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-200">
                    Wybierz objaw, który zaobserwowałeś na roślinie:
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    Aplikacja natychmiast zawiesi standardowy harmonogram podlewania dla tej donicy i
                    przygotuje dedykowany, jednoetapowy plan ratunkowy skrojony pod specyfikę balkonu.
                  </p>
                </div>
              </div>

              {/* CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: 'Wszystkie objawy' },
                  { id: 'water', label: '💧 Woda i przelanie' },
                  { id: 'disease', label: '🍄 Mączniak i grzyb' },
                  { id: 'sun', label: '☀️ Upał i słońce' },
                  { id: 'pest', label: '🐛 Szkodniki' },
                  { id: 'soil', label: '🪴 Podłoże i pleśń' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer font-medium ${
                      categoryFilter === cat.id
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* GRID OF VISUAL ISSUE TILES (OBRAZKOWA LISTA OBJAWÓW) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredIssues.map((issue) => {
                  const isSelected = selectedIssueId === issue.id;
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => handleSelectIssue(issue.id)}
                      className={`group overflow-hidden rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 dark:border-amber-500 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700/60 hover:bg-amber-50/20'
                      }`}
                    >
                      {/* Visual symptom thumbnail image */}
                      <div className="relative h-28 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                        <img
                          src={issue.imageUrl}
                          alt={issue.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

                        {/* Badges on the image */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="text-xl p-1 rounded-lg bg-stone-900/80 backdrop-blur-xs shadow-xs">
                            {issue.icon}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-300 uppercase tracking-wider">
                            {issue.symptomBadge}
                          </span>
                        </div>

                        <div
                          className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                              : 'border-white/80 bg-stone-900/60 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>

                        <div className="absolute bottom-2 left-3 right-3">
                          <h4 className="font-extrabold text-sm text-white drop-shadow-xs leading-tight">
                            {issue.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                          {issue.shortSymptom}
                        </p>

                        <div className="pt-2 border-t border-stone-150 dark:border-stone-800/80 flex items-center justify-between text-[11px]">
                          <span className="font-medium text-stone-500 dark:text-stone-400">
                            Zawieszenie podlewania:
                          </span>
                          <span className="font-bold text-rose-700 dark:text-rose-400">
                            {issue.suspendedWateringDays > 0
                              ? `⏸️ ${issue.suspendedWateringDays} ${issue.suspendedWateringDays === 1 ? 'dzień' : 'dni'}`
                              : '💧 Nawadnianie podsiąkowe'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* EXPANDED PREVIEW OF THE SELECTED ISSUE'S SINGLE-STAGE RESCUE PLAN */}
              {previewIssue && (
                <div className="p-5 rounded-3xl bg-stone-50 dark:bg-stone-850 border-2 border-amber-400/80 dark:border-amber-600 shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{previewIssue.icon}</span>
                      <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                        Proponowany plan ratunkowy: {previewIssue.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                      {previewIssue.suspendedWateringDays > 0
                        ? `Podlewanie wstrzymane na ${previewIssue.suspendedWateringDays} dni`
                        : 'Nawadnianie podsiąkowe'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div className="font-bold text-stone-800 dark:text-stone-200">
                      Rozpoznanie: {previewIssue.diagnosis}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {previewIssue.cause}
                    </p>
                  </div>

                  {/* IMMEDIATE RESCUE STEPS */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Natychmiastowe kroki ratunkowe:
                    </div>
                    <ol className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                      {previewIssue.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-stone-200/80 dark:border-stone-800">
                          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* WARNING */}
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200">
                    <strong>Czego nie robić:</strong> {previewIssue.whatToAvoid}
                  </div>

                  {/* CONFIRMATION BUTTON */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {isChangingIssue && (
                      <button
                        type="button"
                        onClick={() => setIsChangingIssue(false)}
                        className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      >
                        Anuluj zmianę
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirmActivation}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      <LifeBuoy className="w-5 h-5 text-white" />
                      <span>Aktywuj tryb ratunkowy i zawieś podlewanie</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
