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
    crop.rescuePlan?.active ? crop.rescuePlan.issueId : null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isChangingIssue, setIsChangingIssue] = useState<boolean>(false);

  // Active plan state with full dynamic localization
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

  useScrollLock(true);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
    >
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
                  {isEn ? 'Rescue Mode: Plant First Aid' : 'Tryb Ratunkowy: Pogotowie Roślinne'}
                </h3>
                {activePlan && !isChangingIssue && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                    {isEn ? 'Active' : 'Aktywny'}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
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
                        {isEn ? `Diagnosed Issue • ${activePlan.symptomBadge}` : `Zdiagnozowany problem • ${activePlan.symptomBadge}`}
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
                      <span>{isEn ? 'Change diagnosis' : 'Zmień diagnozę'}</span>
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
                      <span>{isEn ? 'Standard Watering Schedule: SUSPENDED' : 'Normalny harmonogram podlewania: ZAWIESZONY'}</span>
                      {activePlan.suspendedWateringUntil && (
                        <span className="text-[11px] font-normal px-2 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {isSuspended
                            ? (isEn ? `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} remaining (until ${activePlan.suspendedWateringUntil})` : `Jeszcze ${remainingDays} ${remainingDays === 1 ? 'dzień' : 'dni'} (do ${activePlan.suspendedWateringUntil})`)
                            : (isEn ? 'Suspension period expired' : 'Okres karencji minął')}
                        </span>
                      )}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {isSuspended
                        ? (isEn ? 'Watering in this condition would starve roots of oxygen and worsen root rot. Follow the rescue steps below.' : 'Podlewanie w tym stanie zablokowałoby dostęp tlenu do korzeni i pogłębiło chorobę. Zastosuj się do poniższych kroków ratunkowych.')
                        : (isEn ? 'Water suspension period has ended. Test soil moisture 3cm deep with your finger – if dry, resume gentle bottom watering.' : 'Okres całkowitego wstrzymania wody dobiegł końca. Sprawdź palcem wilgotność gleby na 3 cm – jeśli sucho, możesz wznowić delikatne podlewanie.')}
                    </p>
                  </div>
                </div>
              </div>

              {/* DIAGNOSIS & REASON */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? 'Diagnosis & cause on balcony' : 'Diagnoza i przyczyna na balkonie'}</span>
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
                    <span>{isEn ? 'Rescue action plan (Steps to complete):' : 'Jednoetapowy plan ratunkowy (Kroki do wykonania):'}</span>
                  </h5>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
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
                  <div className="font-bold text-amber-900 dark:text-amber-200">{isEn ? 'What to avoid:' : 'Czego unikać:'}</div>
                  <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                    {activePlan.whatToAvoid}
                  </p>
                </div>
              </div>

              {/* RECOVERY TIMELINE & ACTION BUTTONS */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-stone-800 dark:text-stone-200 font-semibold">{isEn ? 'Expected recovery:' : 'Oczekiwana poprawa:'}</strong>{' '}
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
                    {isEn ? 'Select symptom observed on your plant:' : 'Wybierz objaw, który zaobserwowałeś na roślinie:'}
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                    {isEn
                      ? 'The app will immediately suspend standard watering for this pot and provide an actionable emergency recovery plan tailored to balcony conditions.'
                      : 'Aplikacja natychmiast zawiesi standardowy harmonogram podlewania dla tej donicy i przygotuje dedykowany, jednoetapowy plan ratunkowy skrojony pod specyfikę balkonu.'}
                  </p>
                </div>
              </div>

              {/* CATEGORY FILTER PILLS */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
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
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer font-medium ${
                      categoryFilter === cat.id
                        ? 'bg-stone-900 text-white dark:bg-emerald-600 dark:text-white font-bold shadow-xs'
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

              {/* EXPANDED PREVIEW OF THE SELECTED ISSUE'S SINGLE-STAGE RESCUE PLAN */}
              {previewIssue && (
                <div className="p-5 rounded-3xl bg-stone-50 dark:bg-stone-850 border-2 border-amber-400/80 dark:border-amber-600 shadow-sm space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{previewIssue.icon}</span>
                      <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                        {isEn ? `Recommended rescue plan: ${previewIssue.title}` : `Proponowany plan ratunkowy: ${previewIssue.title}`}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                      {previewIssue.suspendedWateringDays > 0
                        ? (isEn ? `Watering suspended for ${previewIssue.suspendedWateringDays} days` : `Podlewanie wstrzymane na ${previewIssue.suspendedWateringDays} dni`)
                        : (isEn ? 'Bottom watering' : 'Nawadnianie podsiąkowe')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
                    <div className="font-bold text-stone-800 dark:text-stone-200">
                      {isEn ? 'Diagnosis:' : 'Rozpoznanie:'} {previewIssue.diagnosis}
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                      {previewIssue.cause}
                    </p>
                  </div>

                  {/* IMMEDIATE RESCUE STEPS */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      {isEn ? 'Immediate rescue steps:' : 'Natychmiastowe kroki ratunkowe:'}
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
                    <strong>{isEn ? 'What not to do:' : 'Czego nie robić:'}</strong> {previewIssue.whatToAvoid}
                  </div>

                  {/* CONFIRMATION BUTTON */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    {isChangingIssue && (
                      <button
                        type="button"
                        onClick={() => setIsChangingIssue(false)}
                        className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition"
                      >
                        {isEn ? 'Cancel change' : 'Anuluj zmianę'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleConfirmActivation}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-sm transition shadow-md cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      <LifeBuoy className="w-5 h-5 text-white" />
                      <span>{isEn ? 'Activate rescue mode & suspend watering' : 'Aktywuj tryb ratunkowy i zawieś podlewanie'}</span>
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

