import React, { useState, useMemo } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import {
  LifeBuoy,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Droplets,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Plant, MyCropItem, CropRescuePlan } from '../types';
import {
  RESCUE_ISSUES,
  RescueIssueDefinition,
  createRescuePlan,
  isWateringSuspended,
  getDaysRemainingInSuspension,
  getLocalizedRescueIssue,
  getLocalizedRescuePlan,
} from '../lib/rescueData';
import { useLanguage } from '../lib/LanguageContext';
import { getPlantName } from '../lib/plantTranslations';

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
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(
    crop.rescuePlan?.active ? crop.rescuePlan.issueId : (RESCUE_ISSUES[0]?.id || 'yellow_leaves')
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isChangingIssue, setIsChangingIssue] = useState<boolean>(false);

  // Active plan state with dynamic localization
  const rawActivePlan = crop.rescuePlan?.active ? crop.rescuePlan : null;
  const activePlan = rawActivePlan ? getLocalizedRescuePlan(rawActivePlan, isEn ? 'en' : 'pl') : null;
  const isSuspended = isWateringSuspended(rawActivePlan ?? undefined);
  const remainingDays = getDaysRemainingInSuspension(rawActivePlan ?? undefined);

  // Filtered issues localized
  const filteredIssues = useMemo(() => {
    const list = categoryFilter === 'all' ? RESCUE_ISSUES : RESCUE_ISSUES.filter((i) => i.category === categoryFilter);
    return list.map((i) => getLocalizedRescueIssue(i, isEn ? 'en' : 'pl'));
  }, [categoryFilter, isEn]);

  // Selected issue definition for previewing before activation
  const previewIssue = useMemo<RescueIssueDefinition | undefined>(() => {
    const raw = RESCUE_ISSUES.find((i) => i.id === selectedIssueId);
    return raw ? getLocalizedRescueIssue(raw, isEn ? 'en' : 'pl') : undefined;
  }, [selectedIssueId, isEn]);

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSelectIssue = (issueId: string) => {
    setSelectedIssueId(issueId);
  };

  const handleConfirmActivation = () => {
    if (!selectedIssueId) return;
    const newPlan = createRescuePlan(selectedIssueId, getPlantName(plant, language), isEn ? 'en' : 'pl');
    if (newPlan) {
      onActivatePlan(newPlan);
      setIsChangingIssue(false);
    }
  };

  const handleToggleStepCompleted = (stepIdx: number) => {
    if (!crop.rescuePlan) return;
    const currentSteps = { ...(crop.rescuePlan.completedSteps || {}) };
    currentSteps[stepIdx] = !currentSteps[stepIdx];

    const updatedPlan: CropRescuePlan = {
      ...crop.rescuePlan,
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
    (isEn ? 'Standard' : 'Standardowa');

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in"
    >
      <div
        className="flex flex-col max-h-[85vh] md:max-h-[750px] w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="shrink-0 p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700/60 flex items-center justify-center shrink-0">
              <LifeBuoy className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {isEn ? 'Rescue Mode: Plant First Aid' : 'Tryb Ratunkowy: Pogotowie Roślinne'}
                </h3>
                {activePlan && !isChangingIssue && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                    {isEn ? 'Active' : 'Aktywny'}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                {isEn ? 'Plant:' : 'Pacjent:'} <strong>{getPlantName(plant, language)}</strong> ({cropVariety}) {crop.customPotName ? `• ${crop.customPotName}` : ''}
              </p>
            </div>
          </div>

          <button
            id="close-rescue-modal-btn"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
            title={isEn ? 'Close' : 'Zamknij'}
            aria-label={isEn ? 'Close' : 'Zamknij'}
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* MODAL BODY: Independently scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 text-neutral-800 dark:text-neutral-200">
          {/* SCENARIO A: ACTIVE RESCUE PLAN VIEW */}
          {activePlan && !isChangingIssue ? (
            <div className="space-y-4">
              {/* STATUS BANNER */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 via-amber-50/50 to-orange-50 dark:from-rose-950/40 dark:via-amber-950/20 dark:to-orange-950/30 border-2 border-rose-200 dark:border-rose-800/80 shadow-xs space-y-3">
                <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl p-2 rounded-2xl bg-white dark:bg-neutral-850 border border-rose-200 dark:border-rose-800 shadow-2xs">
                      {activePlan.issueIcon}
                    </span>
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                        {isEn ? `Diagnosed Issue • ${activePlan.symptomBadge}` : `Zdiagnozowany problem • ${activePlan.symptomBadge}`}
                      </div>
                      <h4 className="text-lg sm:text-xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {activePlan.issueTitle}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingIssue(true)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{isEn ? 'Change diagnosis' : 'Zmień diagnozę'}</span>
                    </button>
                  </div>
                </div>

                {/* WATERING SUSPENSION HIGHLIGHT */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/90 dark:bg-neutral-900/90 border border-rose-200 dark:border-rose-800 flex items-start sm:items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 shrink-0 mt-0.5 sm:mt-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2 flex-wrap">
                      <span>{isEn ? 'Standard Watering Schedule: SUSPENDED' : 'Normalny harmonogram podlewania: ZAWIESZONY'}</span>
                      {activePlan.suspendedWateringUntil && (
                        <span className="text-[11px] font-normal px-2 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {isSuspended
                            ? (isEn ? `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} remaining (until ${activePlan.suspendedWateringUntil})` : `Jeszcze ${remainingDays} ${remainingDays === 1 ? 'dzień' : 'dni'} (do ${activePlan.suspendedWateringUntil})`)
                            : (isEn ? 'Suspension period expired' : 'Okres karencji minął')}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {isSuspended
                        ? (isEn ? 'Watering in this condition would starve roots of oxygen and worsen root rot. Follow the rescue steps below.' : 'Podlewanie w tym stanie zablokowałoby dostęp tlenu do korzeni i pogłębiło chorobę. Zastosuj się do poniższych kroków ratunkowych.')
                        : (isEn ? 'Water suspension period has ended. Test soil moisture 3cm deep with your finger – if dry, resume gentle bottom watering.' : 'Okres całkowitego wstrzymania wody dobiegł końca. Sprawdź palcem wilgotność gleby na 3 cm – jeśli sucho, możesz wznowić delikatne podlewanie.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* DIAGNOSIS & REASON */}
              <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? 'Diagnosis & cause on balcony' : 'Diagnoza i przyczyna na balkonie'}</span>
                </div>
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {activePlan.diagnosis}
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {activePlan.cause}
                </p>
              </div>

              {/* ACTION STEPS (INTERACTIVE CHECKLIST) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isEn ? 'Rescue action plan (Steps to complete):' : 'Plan ratunkowy (Kroki do wykonania):'}</span>
                  </h5>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {isEn ? 'Check when done' : 'Zaznacz wykonane'}
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
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-neutral-500 dark:text-neutral-400 line-through'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition mt-0.5 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'border-2 border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
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
                  <div className="font-bold text-amber-900 dark:text-amber-200">{isEn ? 'What to avoid:' : 'Czego unikać:'}</div>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {activePlan.whatToAvoid}
                  </p>
                </div>
              </div>

              {/* RECOVERY TIMELINE */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{isEn ? 'Expected recovery:' : 'Oczekiwana poprawa:'}</strong>{' '}
                  {activePlan.recoveryTimeline}
                </div>
              </div>
            </div>
          ) : (
            /* SCENARIO B: ISSUE SELECTION & CONFIRMATION FLOW */
            <div className="space-y-4">
              {/* INTRO EXPLANATION BANNER */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-200">
                    {isEn ? 'Select symptom observed on your plant:' : 'Wybierz objaw zaobserwowany na roślinie:'}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {isEn
                      ? 'The app will immediately suspend standard watering for this pot and provide an actionable emergency recovery plan tailored to balcony conditions.'
                      : 'Aplikacja natychmiast zawiesi standardowy harmonogram podlewania dla tej donicy i przygotuje dedykowany plan ratunkowy.'}
                  </p>
                </div>
              </div>

              {/* CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: 'all', label: isEn ? 'All Symptoms' : 'Wszystkie objawy' },
                  { id: 'water', label: isEn ? '💧 Water & Overwatering' : '💧 Woda i przelanie' },
                  { id: 'disease', label: isEn ? '🍄 Mildew & Fungus' : '🍄 Mączniak i grzyb' },
                  { id: 'sun', label: isEn ? '☀️ Heat & Sun Scorch' : '☀️ Upał i słońce' },
                  { id: 'pest', label: isEn ? '🐛 Pests' : '🐛 Szkodniki' },
                  { id: 'soil', label: isEn ? '🪴 Soil & Mold' : '🪴 Podłoże i pleśń' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer font-medium ${
                      categoryFilter === cat.id
                        ? 'bg-neutral-900 text-white dark:bg-emerald-600 dark:text-white font-bold shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* GRID OF VISUAL SYMPTOM TILES (e.g. 🍂 PRZELANIE / KORZENIE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-amber-300 dark:hover:border-amber-700/60 hover:bg-amber-50/20'
                      }`}
                    >
                      {/* Visual symptom thumbnail image */}
                      <div className="relative h-24 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={issue.imageUrl}
                          alt={issue.imageAlt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/30 to-transparent" />

                        {/* Badges on the image (e.g. 🍂 PRZELANIE / KORZENIE) */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-900/85 backdrop-blur-xs text-amber-300 uppercase tracking-wider flex items-center gap-1 shadow-xs border border-amber-400/30">
                            <span>{issue.icon}</span>
                            <span>{issue.symptomBadge.toUpperCase()}</span>
                          </span>
                        </div>

                        <div
                          className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-white shadow-sm'
                              : 'border-white/80 bg-neutral-900/60 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>

                        <div className="absolute bottom-1.5 left-2.5 right-2.5">
                          <h4 className="font-extrabold text-xs sm:text-sm text-white drop-shadow-xs leading-tight">
                            {issue.title}
                          </h4>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                          {issue.shortSymptom}
                        </p>

                        <div className="pt-1.5 border-t border-neutral-150 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                          <span className="font-medium text-neutral-500 dark:text-neutral-400">
                            {isEn ? 'Watering suspension:' : 'Zawieszenie podlewania:'}
                          </span>
                          <span className="font-bold text-rose-700 dark:text-rose-400">
                            {issue.suspendedWateringDays > 0
                              ? (isEn ? `⏸️ ${issue.suspendedWateringDays} ${issue.suspendedWateringDays === 1 ? 'day' : 'days'}` : `⏸️ ${issue.suspendedWateringDays} ${issue.suspendedWateringDays === 1 ? 'dzień' : 'dni'}`)
                              : (isEn ? '💧 Bottom watering' : '💧 Nawadnianie podsiąkowe')}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* EXPANDED PREVIEW OF THE SELECTED ISSUE'S RESCUE PLAN */}
              {previewIssue && (
                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-850 border-2 border-amber-400/80 dark:border-amber-600 shadow-xs space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{previewIssue.icon}</span>
                      <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                        {isEn ? `Recommended rescue plan: ${previewIssue.title}` : `Proponowany plan ratunkowy: ${previewIssue.title}`}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                      {previewIssue.suspendedWateringDays > 0
                        ? (isEn ? `Watering suspended for ${previewIssue.suspendedWateringDays} days` : `Podlewanie wstrzymane na ${previewIssue.suspendedWateringDays} dni`)
                        : (isEn ? 'Bottom watering' : 'Nawadnianie podsiąkowe')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <div className="font-bold text-neutral-800 dark:text-neutral-200">
                      {isEn ? 'Diagnosis:' : 'Rozpoznanie:'} {previewIssue.diagnosis}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {previewIssue.cause}
                    </p>
                  </div>

                  {/* IMMEDIATE RESCUE STEPS */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                      {isEn ? 'Immediate rescue steps:' : 'Natychmiastowe kroki ratunkowe:'}
                    </div>
                    <ol className="space-y-1 text-xs text-neutral-800 dark:text-neutral-200">
                      {previewIssue.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
                          <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* WARNING */}
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200">
                    <strong>{isEn ? 'What not to do:' : 'Czego nie robić:'}</strong> {previewIssue.whatToAvoid}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STICKY ACTION FOOTER (Always visible regardless of symptom list scroll length) */}
        <div className="shrink-0 sticky bottom-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
          {activePlan && !isChangingIssue ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-xs sm:text-sm transition cursor-pointer"
              >
                {isEn ? 'Close window' : 'Zamknij okno'}
              </button>

              <button
                type="button"
                onClick={handleMarkRecovered}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{isEn ? 'Plant recovered – resume normal care' : 'Roślina wyzdrowiała – wznów normalny harmonogram'}</span>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-start">
                {isChangingIssue ? (
                  <button
                    type="button"
                    onClick={() => setIsChangingIssue(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  >
                    {isEn ? 'Cancel change' : 'Anuluj zmianę'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  >
                    {isEn ? 'Cancel' : 'Anuluj'}
                  </button>
                )}
                {previewIssue && (
                  <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 hidden sm:inline-flex items-center gap-1.5">
                    <span>{previewIssue.icon}</span>
                    <span className="truncate max-w-[200px]">{previewIssue.title}</span>
                  </span>
                )}
              </div>

              <button
                id="activate-rescue-plan-btn"
                data-testid="activate-rescue-plan-btn"
                type="button"
                onClick={handleConfirmActivation}
                disabled={!selectedIssueId}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl px-5 py-3 w-full sm:w-auto shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                <LifeBuoy className="w-4 h-4 text-white" />
                <span>Aktywuj tryb ratunkowy i zawieś podlewanie</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
