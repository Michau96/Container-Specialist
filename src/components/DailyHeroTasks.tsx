import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Droplets,
  Sun,
  Sparkles,
  Sprout,
  Wind,
  Scissors,
  ShieldCheck,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  Coffee,
  Heart,
  Calendar,
  Layers,
  LifeBuoy,
} from 'lucide-react';
import {
  MyCropItem,
  Plant,
  WeatherData,
  UserBalconySpec,
  DailyCropsRecommendation,
  UserAccount,
} from '../types';
import { isWateringSuspended, getDaysRemainingInSuspension } from '../lib/rescueData';
import { useLanguage } from '../lib/LanguageContext';

export interface DailyTaskItem {
  id: string;
  type: 'water' | 'greenhouse' | 'fertilize' | 'prune' | 'inspect' | 'rescue';
  cropId?: string;
  plantId?: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: 'sky' | 'emerald' | 'amber' | 'violet' | 'rose';
  icon: string;
  iconBg: string;
  actionText: string;
  isCompleted: boolean;
  crop?: MyCropItem;
  plant?: Plant;
}

interface Props {
  crops: MyCropItem[];
  allPlants: Plant[];
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  dailyRecommendation: DailyCropsRecommendation;
  currentUser?: UserAccount | null;
  onToggleWaterCrop: (crop: MyCropItem) => void;
  onUpdateCrop: (updated: MyCropItem) => void;
  onSelectCrop?: (cropId: string) => void;
  onNavigateToSearch?: () => void;
  onOpenRescueModal?: (crop: MyCropItem, plant: Plant) => void;
}

export const DailyHeroTasks: React.FC<Props> = ({
  crops,
  allPlants,
  weather,
  userSpec,
  dailyRecommendation,
  currentUser,
  onToggleWaterCrop,
  onUpdateCrop,
  onSelectCrop,
  onNavigateToSearch,
  onOpenRescueModal,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const storageKey = `balcony_daily_tasks_done_${todayStr}`;

  // Local state for generic task completions for today (persisted in localStorage)
  const [genericCompletedTaskIds, setGenericCompletedTaskIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Save completed generic task IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(genericCompletedTaskIds));
    } catch {
      // ignore
    }
  }, [genericCompletedTaskIds, storageKey]);

  // Toggle state to review completed tasks inside the Empty State
  const [showCompletedList, setShowCompletedList] = useState<boolean>(false);

  // Dynamic user name greeting
  const greetingName = useMemo(() => {
    if (currentUser?.username) {
      const trimmed = currentUser.username.trim();
      if (trimmed.toLowerCase() === 'michał' || trimmed.toLowerCase() === 'michal') {
        return isEn ? 'Michael' : 'Michale';
      }
      return trimmed;
    }
    return isEn ? 'Gardener' : 'Michale';
  }, [currentUser, isEn]);

  // Generate dynamic, context-aware task cards
  const allTasks = useMemo<DailyTaskItem[]>(() => {
    const tasks: DailyTaskItem[] = [];

    // Helper to find plant
    const findPlant = (plantId: string) => allPlants.find((p) => p.id === plantId);

    // 1. Watering & Rescue Tasks for crops
    // If a crop is in Rescue Mode, normal watering is suspended and replaced with a rescue task
    crops.forEach((crop, index) => {
      const plant = findPlant(crop.plantId);
      const cropKey = crop.id || `${crop.plantId}_${crop.selectedVariety || index}`;
      const rawVariety = crop.selectedVariety || plant?.top_varieties?.[0]?.name || plant?.varieties?.[0] || '';
      const variety = typeof rawVariety === 'string' ? rawVariety : (rawVariety as any)?.name || '';
      const plantName = plant?.name || (isEn ? 'Plant' : 'Roślina');

      // CHECK FOR ACTIVE RESCUE MODE FIRST
      if (crop.rescuePlan?.active) {
        const isSuspended = isWateringSuspended(crop.rescuePlan);
        const daysLeft = getDaysRemainingInSuspension(crop.rescuePlan);
        const rescueTaskId = `rescue_${cropKey}_${todayStr}`;
        const isRescueDoneToday = genericCompletedTaskIds.includes(rescueTaskId);

        const rescueTitle = isEn
          ? `🚨 Rescue ${plantName.toLowerCase()}: ${crop.rescuePlan.issueTitle}`
          : `🚨 Ratuj ${plantName.toLowerCase()}: ${crop.rescuePlan.issueTitle}`;
        
        const rescueSubtitle = isSuspended
          ? isEn
            ? `Watering schedule SUSPENDED (${daysLeft > 0 ? `${daysLeft} days left` : 'holding period'}). ${crop.rescuePlan.immediateAction}`
            : `Harmonogram podlewania ZAWIESZONY (${daysLeft > 0 ? `jeszcze ${daysLeft} dni` : 'karencja'}). ${crop.rescuePlan.immediateAction}`
          : isEn
          ? `Water suspension ended. Follow steps: ${crop.rescuePlan.immediateAction}`
          : `Karencja wstrzymania wody minęła. Wykonaj zalecenia: ${crop.rescuePlan.immediateAction}`;

        tasks.push({
          id: rescueTaskId,
          type: 'rescue',
          cropId: cropKey,
          plantId: crop.plantId,
          title: rescueTitle,
          subtitle: rescueSubtitle,
          badge: isEn ? '🚑 Rescue Mode' : '🚑 Tryb ratunkowy',
          badgeTone: 'rose',
          icon: crop.rescuePlan.issueIcon || '🚑',
          iconBg: 'from-rose-500/20 to-amber-500/20 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
          actionText: isRescueDoneToday ? (isEn ? 'Steps Done' : 'Kroki wykonane') : (isEn ? 'Rescue Steps' : 'Kroki ratunkowe'),
          isCompleted: isRescueDoneToday,
          crop,
          plant,
        });
        // Important: Return early so standard watering task is suspended!
        return;
      }

      const isWateredToday = crop.lastWateredDate === todayStr;

      // Specific watering advice tailored to plant
      let waterSubtitle = isEn
        ? 'Moderate water at root base (avoid wetting leaves).'
        : 'Umiarkowana dawka wody u nasady łodygi (nie mocz liści).';
      let taskIcon = '💧';
      if (plantName.toLowerCase().includes('pomidor') || plantName.toLowerCase().includes('tomato')) {
        taskIcon = '🍅';
        waterSubtitle = isEn
          ? `Thorough root watering (${crop.pot?.volumeL || 15}L pot). Early morning or evening.`
          : `Obfite podlewanie podłoża u nasady (${crop.pot?.volumeL || 15}L donica). Rano lub pod wieczór.`;
      } else if (plantName.toLowerCase().includes('bazyli') || plantName.toLowerCase().includes('basil') || plant?.plant_group === 'ziola') {
        taskIcon = '🌿';
        waterSubtitle = isEn
          ? 'Herbs prefer slightly damp, warm soil. Gently mist surface.'
          : 'Zioła lubią lekko wilgotne, ciepłe podłoże. Zroś delikatnie glebę.';
      } else if (plantName.toLowerCase().includes('truskawk') || plantName.toLowerCase().includes('strawberr')) {
        taskIcon = '🍓';
        waterSubtitle = isEn
          ? 'Consistent moisture at root level; water early before midday sun.'
          : 'Stała wilgotność w strefie korzeniowej; podlewaj rano przed silnym słońcem.';
      } else if (plantName.toLowerCase().includes('papryk') || plantName.toLowerCase().includes('pepper') || plantName.toLowerCase().includes('chili')) {
        taskIcon = '🌶️';
        waterSubtitle = isEn
          ? 'Warm room-temperature water. Avoid completely drying out root ball.'
          : 'Ciepła woda o temperaturze pokojowej. Unikaj przesuszenia bryły korzeniowej.';
      }

      const waterTitle = isEn
        ? `Water ${plantName.toLowerCase()}${variety ? ` (${variety})` : ''}`
        : `Podlej ${plantName.toLowerCase()}${variety ? ` (${variety})` : ''}`;

      tasks.push({
        id: `water_${cropKey}`,
        type: 'water',
        cropId: cropKey,
        plantId: crop.plantId,
        title: waterTitle,
        subtitle: waterSubtitle,
        badge: isWateredToday
          ? (isEn ? '✅ Watered Today' : '✅ Podlane dzisiaj')
          : (isEn ? '💧 Watering' : '💧 Podlewanie'),
        badgeTone: isWateredToday ? 'emerald' : 'sky',
        icon: taskIcon,
        iconBg: 'from-sky-500/15 to-emerald-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
        actionText: isWateredToday ? (isEn ? 'Done' : 'Zrobione') : (isEn ? 'Mark as Watered' : 'Oznacz jako podlane'),
        isCompleted: isWateredToday,
        crop,
        plant,
      });
    });

    // 2. Greenhouse care task (if any crop is in balcony greenhouse)
    const cropsInGreenhouse = crops.filter((c) => c.inGreenhouse);
    if (cropsInGreenhouse.length > 0) {
      const ghTaskId = `greenhouse_ventilation_${todayStr}`;
      const isGhDone = genericCompletedTaskIds.includes(ghTaskId);
      tasks.push({
        id: ghTaskId,
        type: 'greenhouse',
        title: isEn ? 'Ventilate balcony greenhouse' : 'Uchyl szklarnię balkonową',
        subtitle: isEn
          ? 'Ventilation prevents moisture condensation and overheating above 28°C during sunny hours.'
          : 'Wietrzenie zapobiega kondensacji i przegrzaniu powyżej 28°C w słoneczne godziny.',
        badge: isEn ? '🏡 Greenhouse' : '🏡 Szklarnia',
        badgeTone: 'amber',
        icon: '💨',
        iconBg: 'from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
        actionText: isGhDone ? (isEn ? 'Done' : 'Zrobione') : (isEn ? 'Ventilated' : 'Przewietrzone'),
        isCompleted: isGhDone,
      });
    }

    // 3. Fertilizing or Soil Care task (based on today's recommendation)
    if (dailyRecommendation.fertilizing.isGoodDay) {
      const fertTaskId = `fertilize_care_${todayStr}`;
      const isFertDone = genericCompletedTaskIds.includes(fertTaskId);
      tasks.push({
        id: fertTaskId,
        type: 'fertilize',
        title: isEn ? 'Feed plants with bio-fertilizer' : 'Zasil rośliny bio-humusem',
        subtitle: isEn
          ? 'Optimal moisture conditions today to provide organic micronutrients.'
          : 'Dobre warunki wilgotnościowe do dostarczenia organicznych mikroelementów.',
        badge: isEn ? '🌱 Nutrition' : '🌱 Odżywianie',
        badgeTone: 'emerald',
        icon: '✨',
        iconBg: 'from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
        actionText: isFertDone ? (isEn ? 'Done' : 'Zrobione') : (isEn ? 'Fed' : 'Zasilone'),
        isCompleted: isFertDone,
      });
    }

    // 4. Balcony Microclimate & Pest inspection task
    const inspectTaskId = `inspect_microclimate_${todayStr}`;
    const isInspectDone = genericCompletedTaskIds.includes(inspectTaskId);
    const floorLabel = userSpec.floor
      ? isEn ? `Floor ${userSpec.floor}` : `${userSpec.floor}. piętro`
      : isEn ? 'balcony' : 'balkon';
    tasks.push({
      id: inspectTaskId,
      type: 'inspect',
      title: isEn ? `Check leaves and soil (${floorLabel})` : `Przegląd liści i podłoża (${floorLabel})`,
      subtitle: isEn
        ? 'Inspect underside of leaves for pests and check soil moisture at 3 cm depth.'
        : 'Sprawdź spodnią stronę liści pod kątem szkodników i wilgotność na głębokości 3 cm.',
      badge: isEn ? '🔍 Inspection' : '🔍 Kontrola',
      badgeTone: 'violet',
      icon: '🪴',
      iconBg: 'from-purple-500/15 to-pink-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      actionText: isInspectDone ? (isEn ? 'Done' : 'Zrobione') : (isEn ? 'Inspected' : 'Sprawdzone'),
      isCompleted: isInspectDone,
    });

    return tasks;
  }, [crops, allPlants, todayStr, genericCompletedTaskIds, dailyRecommendation, userSpec, isEn]);

  // Split tasks into pending and completed
  const pendingTasks = useMemo(() => allTasks.filter((t) => !t.isCompleted), [allTasks]);
  const completedTasks = useMemo(() => allTasks.filter((t) => t.isCompleted), [allTasks]);
  const totalCount = allTasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 100;
  const isAllCompleted = totalCount > 0 && pendingTasks.length === 0;

  // Toggle a task's status
  const handleToggleTask = (task: DailyTaskItem) => {
    if (task.type === 'water' && task.crop) {
      onToggleWaterCrop(task.crop);
    } else {
      setGenericCompletedTaskIds((prev) =>
        prev.includes(task.id) ? prev.filter((id) => id !== task.id) : [...prev, task.id]
      );
    }
  };

  // Reset all tasks for testing or new cycle
  const handleResetTasks = () => {
    crops.forEach((crop) => {
      if (crop.lastWateredDate === todayStr) {
        onToggleWaterCrop(crop);
      }
    });
    setGenericCompletedTaskIds([]);
  };

  return (
    <section
      id="daily-hero-tasks-section"
      className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-[2.25rem] border border-stone-200/80 dark:border-stone-800 shadow-sm p-5 sm:p-7 space-y-6 transition-all"
    >
      {/* 1. Header: Greeting & Gamified Daily Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>{isEn ? 'Daily Balcony Ritual' : 'Codzienny rytuał balkonu'}</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span>{isEn ? `Floor ${userSpec.floor}` : `${userSpec.floor}. piętro`}</span>
            {weather?.temperature !== undefined && (
              <>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-stone-600 dark:text-stone-300 font-semibold">{weather.temperature}°C</span>
              </>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
            <span>{isEn ? `Your tasks for today, ${greetingName} 👋` : `Twoje zadania na dziś, ${greetingName} 👋`}</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            {isAllCompleted
              ? isEn
                ? 'All plants received their care today. Your balcony garden is thriving!'
                : 'Wszystkie rośliny otrzymały dzisiejszą opiekę. Twój balkonowy ogród ma się świetnie!'
              : isEn
              ? `${pendingTasks.length} ${pendingTasks.length === 1 ? 'task' : 'tasks'} remaining to keep your plants healthy and lush.`
              : `Pozostało ${pendingTasks.length} ${
                  pendingTasks.length === 1 ? 'zadanie' : pendingTasks.length < 5 ? 'zadania' : 'zadań'
                } do wykonania, aby Twoje rośliny rosły zdrowo i obficie.`}
          </p>
        </div>

        {/* Progress Metric & Badge */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="bg-stone-50 dark:bg-stone-800/80 p-3 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 min-w-[170px]">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-200 mb-1.5">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEn ? 'Task progress' : 'Postęp zadań'}</span>
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT: Task Cards OR Rewarding Empty State */}
      {!isAllCompleted ? (
        <div className="space-y-4">
          {/* Section Subtitle */}
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 px-1">
            <span>{isEn ? `TASKS TO COMPLETE (${pendingTasks.length})` : `KARTY ZADAŃ DO WYKONANIA (${pendingTasks.length})`}</span>
            {completedCount > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ {isEn ? `${completedCount} completed` : `${completedCount} wykonane`}
              </span>
            )}
          </div>

          {/* Interactive Task Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="bg-stone-50/60 dark:bg-stone-800/40 hover:bg-white dark:hover:bg-stone-800/90 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 hover:border-emerald-400 dark:hover:border-emerald-600 p-4 sm:p-5 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between gap-4 group"
              >
                {/* Top: Icon + Badge + Title + Subtitle */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${task.iconBg} border flex items-center justify-center text-xl shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                    >
                      {task.icon}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        task.badgeTone === 'rose'
                          ? 'bg-rose-100 dark:bg-rose-950/90 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-800'
                          : task.badgeTone === 'sky'
                          ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                          : task.badgeTone === 'amber'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          : task.badgeTone === 'violet'
                          ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {task.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                      {task.title}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed">
                      {task.subtitle}
                    </p>

                    {task.type === 'rescue' && task.crop && task.plant && onOpenRescueModal && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (task.crop && task.plant && onOpenRescueModal) {
                            onOpenRescueModal(task.crop, task.plant);
                          }
                        }}
                        className="mt-2.5 w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-950/90 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
                      >
                        <LifeBuoy className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-pulse" />
                        <span>{isEn ? 'View rescue steps' : 'Zobacz zalecenia ratunkowe'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom: Big Interactive Action Button / Checkbox */}
                <button
                  onClick={() => handleToggleTask(task)}
                  className="w-full py-3 px-4 rounded-xl border-2 border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/80 hover:bg-emerald-600 hover:border-emerald-600 text-stone-700 dark:text-stone-200 hover:text-white font-extrabold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer active:scale-[0.98] flex items-center justify-between group/btn"
                  title={isEn ? 'Click to mark task as completed' : 'Kliknij, aby oznaczyć zadanie jako wykonane'}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full border-2 border-stone-400 dark:border-stone-500 group-hover/btn:border-white group-hover/btn:bg-white/20 flex items-center justify-center transition-colors">
                      <Check className="w-3.5 h-3.5 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity stroke-[3]" />
                    </span>
                    <span>{isEn ? 'Mark as done' : 'Oznacz jako zrobione'}</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700 group-hover/btn:bg-emerald-700 group-hover/btn:text-emerald-100 transition-colors">
                    {isEn ? 'Done ✓' : 'Gotowe ✓'}
                  </span>
                </button>
              </div>
            ))}
          </div>

          {/* Optional: Show Completed Tasks Accordion */}
          {completedCount > 0 && (
            <div className="pt-2">
              <button
                onClick={() => setShowCompletedList((prev) => !prev)}
                className="text-xs font-bold text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 inline-flex items-center gap-1.5 cursor-pointer py-1"
              >
                <span>{isEn ? `Completed today (${completedCount})` : `Ukończone dzisiaj (${completedCount})`}</span>
                {showCompletedList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCompletedList && (
                <div className="mt-2 space-y-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-stone-700 dark:text-stone-300 line-through truncate">
                          {task.title}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="text-[11px] font-bold text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer underline shrink-0"
                      >
                        {isEn ? 'Undo' : 'Cofnij'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 3. REWARDING EMPTY STATE: Happy Plant Illustration & Relax Banner */
        <div
          id="daily-tasks-empty-state"
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-50 via-teal-50/70 to-amber-50/40 dark:from-emerald-950/40 dark:via-stone-900 dark:to-stone-900 border-2 border-emerald-200 dark:border-emerald-800/80 p-6 sm:p-10 text-center space-y-5 shadow-xs transition-all"
        >
          {/* Subtle decorative background glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Happy Thriving Plant Illustration */}
          <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg
              className="w-full h-full drop-shadow-md animate-bounce duration-1000"
              style={{ animationDuration: '3s' }}
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Smiling Sun rays in background */}
              <circle cx="125" cy="35" r="18" fill="#FBBF24" fillOpacity="0.85" />
              <path d="M125 10V14M125 56V60M100 35H104M146 35H150M107 17L110 20M140 50L143 53M107 53L110 50M140 20L143 17" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

              {/* Terracotta Plant Pot */}
              <path
                d="M50 85H110L103 140C102.5 143 99.8 145 96.5 145H63.5C60.2 145 57.5 143 57 140L50 85Z"
                fill="#EA580C"
                className="dark:fill-amber-700"
              />
              {/* Pot rim */}
              <rect x="46" y="77" width="68" height="12" rx="4" fill="#C2410C" />
              {/* Happy face on pot */}
              <circle cx="70" cy="110" r="3" fill="#FFF" />
              <circle cx="90" cy="110" r="3" fill="#FFF" />
              {/* Rosy cheeks */}
              <circle cx="64" cy="116" r="3.5" fill="#FCA5A5" fillOpacity="0.8" />
              <circle cx="96" cy="116" r="3.5" fill="#FCA5A5" fillOpacity="0.8" />
              {/* Smiling mouth */}
              <path d="M74 118C77 123 83 123 86 118" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />

              {/* Plant Stems & Lush Leaves */}
              <path d="M80 77V42" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
              {/* Left Leaf */}
              <path
                d="M80 60C62 55 58 38 68 32C78 26 80 50 80 60Z"
                fill="#22C55E"
                stroke="#15803D"
                strokeWidth="1.5"
              />
              {/* Right Leaf */}
              <path
                d="M80 52C98 47 102 30 92 24C82 18 80 42 80 52Z"
                fill="#4ADE80"
                stroke="#16A34A"
                strokeWidth="1.5"
              />
              {/* Top Fresh Sprout with Flower/Heart */}
              <circle cx="80" cy="38" r="7" fill="#F43F5E" />
              <circle cx="75" cy="35" r="5" fill="#FB7185" />
              <circle cx="85" cy="35" r="5" fill="#FB7185" />
              <circle cx="80" cy="32" r="5" fill="#FDA4AF" />
              <circle cx="80" cy="36" r="3" fill="#FEF08A" />

              {/* Sparkling droplets & stars */}
              <path d="M38 70C38 66 43 62 43 62C43 62 48 66 48 70C48 73 45.8 75 43 75C40.2 75 38 73 38 70Z" fill="#38BDF8" />
              <path d="M120 85L122 90L127 92L122 94L120 99L118 94L113 92L118 90L120 85Z" fill="#FBBF24" />
            </svg>
          </div>

          {/* Congratulatory Headline & Copy */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs border border-emerald-300 dark:border-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isEn ? 'Mission complete • 100% happy plants' : 'Misja wykonana • 100% zadowolonych roślin'}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
              {isEn ? 'All done for today! Time to relax 🌿' : 'Wszystko gotowe na dziś! Czas na relaks 🌿'}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-lg mx-auto">
              {isEn
                ? `Great job, ${greetingName}! All crops on your floor have been watered and cared for. Soil moisture is optimal and your plants are growing nicely. Grab a coffee and enjoy the greenery on your balcony! ☕`
                : `Świetna robota, ${greetingName}! Wszystkie rośliny na Twoim ${userSpec.floor}. piętrze zostały podlane i zaopiekowane. Gleba ma odpowiednią wilgotność, a Twoje uprawy zdrowo rosną. Zaparz kawę i ciesz się zielenią na balkonie! ☕`}
            </p>
          </div>

          {/* Reward Badges Grid */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-bold">
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-200 flex items-center gap-2 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isEn ? `${completedCount} of ${totalCount} tasks completed` : `${completedCount} z ${totalCount} zadań odhaczonych`}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-200 flex items-center gap-2 shadow-2xs">
              <Coffee className="w-4 h-4 text-amber-600" />
              <span>{isEn ? 'Time to relax and unwind' : 'Czas na relaks i spokój'}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-200 flex items-center gap-2 shadow-2xs">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{isEn ? 'Balcony: 100% vigor' : 'Balkon: 100% wigoru'}</span>
            </div>
          </div>

          {/* Action buttons inside Empty State */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setShowCompletedList((prev) => !prev)}
              className="px-4 py-2 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold transition cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <span>{showCompletedList ? (isEn ? 'Hide task list' : 'Ukryj listę zadań') : (isEn ? 'Show completed tasks' : 'Pokaż wykonane zadania')}</span>
              {showCompletedList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleResetTasks}
              title={isEn ? 'Reset tasks state' : 'Przywróć stan zadań (przydatne do testów)'}
              className="px-3.5 py-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-xl text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isEn ? 'Reset tasks' : 'Resetuj zadania'}</span>
            </button>
          </div>

          {/* Completed tasks list reveal */}
          {showCompletedList && (
            <div className="mt-4 pt-4 border-t border-emerald-200/60 dark:border-stone-800 max-w-lg mx-auto text-left space-y-2">
              <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider px-1">
                {isEn ? 'Completed today:' : 'Wykonane dzisiaj:'}
              </div>
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                      {task.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="text-xs font-bold text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer underline shrink-0"
                  >
                    {isEn ? 'Undo' : 'Cofnij'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
