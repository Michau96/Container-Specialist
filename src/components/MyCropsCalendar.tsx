import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  Layers,
  ChevronRight,
  Sun,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import {
  UserBalconySpec,
  Plant,
  MyCropItem,
  CalendarPeriod,
  CalendarResponse,
  CalendarActionItem,
} from '../types';
import { fetchCalendar, getCurrentPeriodId } from '../lib/api';
import { useLanguage } from '../lib/LanguageContext';
import { getPlantName, getTranslatedPlantTip } from '../lib/plantTranslations';

const CALENDAR_PERIODS_ORDER: { id: string; name: string; nameEn: string; short: string; shortEn: string; month: number; half: number }[] = [
  { id: '01_1', name: 'I połowa Stycznia', nameEn: '1st half of Jan', short: 'Sty I', shortEn: 'Jan I', month: 1, half: 1 },
  { id: '01_2', name: 'II połowa Stycznia', nameEn: '2nd half of Jan', short: 'Sty II', shortEn: 'Jan II', month: 1, half: 2 },
  { id: '02_1', name: 'I połowa Lutego', nameEn: '1st half of Feb', short: 'Lut I', shortEn: 'Feb I', month: 2, half: 1 },
  { id: '02_2', name: 'II połowa Lutego', nameEn: '2nd half of Feb', short: 'Lut II', shortEn: 'Feb II', month: 2, half: 2 },
  { id: '03_1', name: 'I połowa Marca', nameEn: '1st half of Mar', short: 'Mar I', shortEn: 'Mar I', month: 3, half: 1 },
  { id: '03_2', name: 'II połowa Marca', nameEn: '2nd half of Mar', short: 'Mar II', shortEn: 'Mar II', month: 3, half: 2 },
  { id: '04_1', name: 'I połowa Kwietnia', nameEn: '1st half of Apr', short: 'Kwi I', shortEn: 'Apr I', month: 4, half: 1 },
  { id: '04_2', name: 'II połowa Kwietnia', nameEn: '2nd half of Apr', short: 'Kwi II', shortEn: 'Apr II', month: 4, half: 2 },
  { id: '05_1', name: 'I połowa Maja', nameEn: '1st half of May', short: 'Maj I', shortEn: 'May I', month: 5, half: 1 },
  { id: '05_2', name: 'II połowa Maja', nameEn: '2nd half of May', short: 'Maj II', shortEn: 'May II', month: 5, half: 2 },
  { id: '06_1', name: 'I połowa Czerwca', nameEn: '1st half of Jun', short: 'Cze I', shortEn: 'Jun I', month: 6, half: 1 },
  { id: '06_2', name: 'II połowa Czerwca', nameEn: '2nd half of Jun', short: 'Cze II', shortEn: 'Jun II', month: 6, half: 2 },
  { id: '07_1', name: 'I połowa Lipca', nameEn: '1st half of Jul', short: 'Lip I', shortEn: 'Jul I', month: 7, half: 1 },
  { id: '07_2', name: 'II połowa Lipca', nameEn: '2nd half of Jul', short: 'Lip II', shortEn: 'Jul II', month: 7, half: 2 },
  { id: '08_1', name: 'I połowa Sierpnia', nameEn: '1st half of Aug', short: 'Sie I', shortEn: 'Aug I', month: 8, half: 1 },
  { id: '08_2', name: 'II połowa Sierpnia', nameEn: '2nd half of Aug', short: 'Sie II', shortEn: 'Aug II', month: 8, half: 2 },
  { id: '09_1', name: 'I połowa Września', nameEn: '1st half of Sep', short: 'Wrz I', shortEn: 'Sep I', month: 9, half: 1 },
  { id: '09_2', name: 'II połowa Września', nameEn: '2nd half of Sep', short: 'Wrz II', shortEn: 'Sep II', month: 9, half: 2 },
  { id: '10_1', name: 'I połowa Października', nameEn: '1st half of Oct', short: 'Paź I', shortEn: 'Oct I', month: 10, half: 1 },
  { id: '10_2', name: 'II połowa Października', nameEn: '2nd half of Oct', short: 'Paź II', shortEn: 'Oct II', month: 10, half: 2 },
  { id: '11_1', name: 'I połowa Listopada', nameEn: '1st half of Nov', short: 'Lis I', shortEn: 'Nov I', month: 11, half: 1 },
  { id: '11_2', name: 'II połowa Listopada', nameEn: '2nd half of Nov', short: 'Lis II', shortEn: 'Nov II', month: 11, half: 2 },
  { id: '12_1', name: 'I połowa Grudnia', nameEn: '1st half of Dec', short: 'Gru I', shortEn: 'Dec I', month: 12, half: 1 },
  { id: '12_2', name: 'II połowa Grudnia', nameEn: '2nd half of Dec', short: 'Gru II', shortEn: 'Dec II', month: 12, half: 2 },
];

interface Props {
  userSpec: UserBalconySpec;
  myPlants: Plant[];
  myCrops: MyCropItem[];
  onToggleTask: (plantId: string, taskKey: string) => void;
  onSelectPlantById: (plantId: string) => void;
  onSwitchToFullCalendar: () => void;
}

export const MyCropsCalendar: React.FC<Props> = ({
  userSpec,
  myPlants,
  myCrops,
  onToggleTask,
  onSelectPlantById,
  onSwitchToFullCalendar,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const currentPeriodId = getCurrentPeriodId();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(currentPeriodId);
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'current_period' | 'all_stages'>('current_period');

  const myPlantIds = myPlants.map((p) => p.id);

  // Fetch calendar filtered by user's crops
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchCalendar(userSpec, selectedPeriodId, myPlantIds)
      .then((data) => {
        if (isMounted) {
          setCalendarData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch crops calendar:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userSpec, selectedPeriodId, myPlants.length]);

  // Compute key milestones for each crop across the year
  const cropMilestones = myPlants.map((plant) => {
    const crop = myCrops.find((c) => c.plantId === plant.id);
    const schedule = plant.schedule || {};

    const periodsForAction = (code: string) =>
      Object.entries(schedule)
        .filter(([_, a]) => a === code)
        .map(([pId]) => {
          const item = CALENDAR_PERIODS_ORDER.find((p) => p.id === pId);
          return isEn ? (item?.shortEn || item?.short) : item?.short;
        })
        .filter(Boolean);

    return {
      plant,
      crop,
      sowHome: periodsForAction('rozsada_dom'),
      sowDirect: periodsForAction('siew_donica'),
      hardening: periodsForAction('hartowanie'),
      plantOut: periodsForAction('sadzenie_balkon'),
      care: periodsForAction('pielegnacja'),
      harvest: periodsForAction('zbior'),
    };
  });

  const getActionCategoryTitle = (label: string) => {
    if (!isEn) return label;
    if (label.includes('Wysiew w domu')) return 'Indoor Seedling Sowing';
    if (label.includes('Siew wprost')) return 'Direct Sowing into Containers';
    if (label.includes('Hartowanie')) return 'Hardening Off Seedlings';
    if (label.includes('Sadzenie docelowe') || label.includes('Sadzenie')) return 'Potting / Planting Out on Balcony';
    if (label.includes('pielęgnacja') || label.includes('Pielęgnacja')) return 'Care, Feeding & Watering';
    if (label.includes('Zbiory') || label.includes('Zbiór')) return 'Harvesting Crops';
    if (label.includes('Likwidacja')) return 'End of Season & Clearing';
    if (label.includes('Przeniesienie donic')) return 'Moving Containers Indoors';
    if (label.includes('Zabezpieczenie mrozoodporne')) return 'Winterizing Balcony Pots';
    return label;
  };

  const getActionCategoryIcon = (label: string) => {
    if (label.includes('Wysiew w domu') || label.toLowerCase().includes('indoor')) return '🏠';
    if (label.includes('Siew wprost') || label.toLowerCase().includes('direct')) return '🌱';
    if (label.includes('Hartowanie') || label.toLowerCase().includes('hardening')) return '🌤️';
    if (label.includes('Sadzenie docelowe') || label.toLowerCase().includes('potting')) return '🪴';
    if (label.includes('pielęgnacja') || label.toLowerCase().includes('care')) return '💧';
    if (label.includes('Zbiory') || label.toLowerCase().includes('harvest')) return '🧺';
    return '📅';
  };

  const currentPeriodObj = CALENDAR_PERIODS_ORDER.find((p) => p.id === selectedPeriodId);

  return (
    <div className="space-y-6">
      {/* Top Banner / Switcher */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{isEn ? 'Personalized Calendar • Your Crops Only' : 'Spersonalizowany kalendarz • Tylko Twoje uprawy'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {isEn ? 'Individual Schedule for My Crops' : 'Indywidualny kalendarz prac dla Moich upraw'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            {isEn
              ? `This view includes only tasks, reminders, and stages for ${myPlants.length} ${myPlants.length === 1 ? 'plant' : 'plants'} added to your balcony.`
              : `Ten widok zawiera wyłącznie zadania, przypomnienia i etapy dla ${myPlants.length} ${myPlants.length === 1 ? 'rośliny' : 'roślin'} dodanych do Twojego balkonu.`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('current_period')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                viewMode === 'current_period'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'By period' : 'Na dany okres'}
            </button>
            <button
              onClick={() => setViewMode('all_stages')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                viewMode === 'all_stages'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'All yearly dates' : 'Wszystkie daty roczne'}
            </button>
          </div>

          <button
            onClick={onSwitchToFullCalendar}
            className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>{isEn ? '🌐 Full Global Calendar' : '🌐 Pełny kalendarz (Wszystko co możliwe)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Period-by-period interactive timeline */}
      {viewMode === 'current_period' && (
        <div className="space-y-6">
          {/* Timeline Bar (24 Half-Month Periods) */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>{isEn ? 'Select timeline period:' : 'Wybierz okres na osi roku:'}</span>
                <span className="text-stone-400 font-normal">
                  ({isEn ? currentPeriodObj?.nameEn : currentPeriodObj?.name})
                </span>
              </div>
              <button
                onClick={() => setSelectedPeriodId(currentPeriodId)}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? `Jump to today (${currentPeriodId.replace('_', '/')})` : `Przeskocz do dzisiaj (${currentPeriodId.replace('_', '/')})`}</span>
              </button>
            </div>

            {/* Scrollable timeline rail */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
              <div className="flex gap-1.5 min-w-[760px]">
                {CALENDAR_PERIODS_ORDER.map((period) => {
                  const isCurrent = period.id === currentPeriodId;
                  const isSelected = period.id === selectedPeriodId;

                  return (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriodId(period.id)}
                      className={`flex-1 min-w-[42px] py-2 px-1.5 rounded-xl text-center transition flex flex-col items-center justify-between cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-800 text-white border-emerald-800 dark:bg-emerald-700 shadow-xs'
                          : isCurrent
                          ? 'bg-amber-100/80 dark:bg-amber-950/60 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                          : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200/80 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold block">{isEn ? period.shortEn : period.short}</span>
                      {isCurrent && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1 ${
                            isSelected ? 'bg-amber-300' : 'bg-amber-500'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Cards for the Selected Period */}
          {loading ? (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-stone-700 dark:border-stone-300 border-t-transparent rounded-full mb-2" />
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isEn ? 'Loading crops calendar...' : 'Pobieranie kalendarza Twoich upraw...'}
              </p>
            </div>
          ) : calendarData && Object.keys(calendarData.actions_by_type).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(calendarData.actions_by_type).map(([actionLabel, items]) => (
                <div
                  key={actionLabel}
                  className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getActionCategoryIcon(actionLabel)}</span>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                          {getActionCategoryTitle(actionLabel)}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          {isEn
                            ? `Applies to ${items.length} of your ${items.length === 1 ? 'crop' : 'crops'}`
                            : `Dotyczy ${items.length} ${items.length === 1 ? 'Twojej rośliny' : 'Twoich roślin'}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {items.map((item) => {
                      const crop = myCrops.find((c) => c.plantId === item.plant_id);
                      const taskKey = `${selectedPeriodId}_${item.action_code}`;
                      const isCompleted = crop?.completedTasks?.[taskKey] || false;

                      return (
                        <div
                          key={item.plant_id}
                          className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                            isCompleted
                              ? 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 opacity-70'
                              : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-400'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => onToggleTask(item.plant_id, taskKey)}
                                  className="text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
                                  title={isCompleted ? (isEn ? 'Mark as undone' : 'Oznacz jako niewykonane') : (isEn ? 'Mark as done' : 'Oznacz jako wykonane')}
                                >
                                  {isCompleted ? (
                                    <CheckSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                                  ) : (
                                    <Square className="w-5 h-5 text-stone-400" />
                                  )}
                                </button>
                                <div>
                                  {(() => {
                                    const safeVariety =
                                      typeof crop?.selectedVariety === 'string'
                                        ? crop.selectedVariety
                                        : (crop?.selectedVariety as any)?.name || '';
                                    return (
                                      <>
                                        <h5
                                          className={`font-bold text-sm tracking-tight ${
                                            isCompleted
                                              ? 'line-through text-stone-500 dark:text-stone-400'
                                              : 'text-stone-900 dark:text-stone-100'
                                          }`}
                                        >
                                          {getPlantName(item.plant_id || item.plant_name, language)} {safeVariety ? `– ${safeVariety}` : ''}
                                        </h5>
                                        {safeVariety && (
                                          <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                                            🌱 {isEn ? 'Variety:' : 'Odmiana:'} {safeVariety} {crop?.potCount && crop.potCount > 1 ? `(${crop.potCount}x)` : ''}
                                          </span>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                                {crop?.pot?.volumeL ? (isEn ? `Yours: ${crop.pot.volumeL}L` : `Twoja: ${crop.pot.volumeL}L`) : (isEn ? `Required: ${item.pot_vol}L` : `Wymóg: ${item.pot_vol}L`)}
                              </span>
                            </div>

                            {crop?.sowing?.date && (
                              <div className="text-[10px] text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                                <span>{crop.sowing.method === 'sadzonka' ? '🌿' : '🌱'}</span>
                                <span>{isEn ? 'Started:' : 'Rozpoczęcie:'} {crop.sowing.date} ({crop.sowing.method === 'sadzonka' ? (isEn ? 'seedling' : 'sadzonka') : (isEn ? 'seeds' : 'nasiona')})</span>
                              </div>
                            )}

                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                              {getTranslatedPlantTip(item.plant_id, item.tip, language)}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-stone-500">
                              {isCompleted ? (isEn ? '✓ Completed in this period' : '✓ Wykonano w tym okresie') : (isEn ? 'To do' : 'Do zrobienia')}
                            </span>
                            <button
                              onClick={() => onSelectPlantById(item.plant_id)}
                              className="font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>{isEn ? 'Guide' : 'Poradnik'}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
              <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <h4 className="text-base font-semibold text-stone-800 dark:text-stone-200">
                {isEn
                  ? `No active sowing or harvest for your crops in period ${currentPeriodObj?.nameEn || currentPeriodObj?.name}`
                  : `Brak aktywnych siewów lub zbiorów dla Twoich upraw w okresie ${currentPeriodObj?.name}`}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
                {isEn
                  ? 'During this period, your balcony plants require only routine watering and pest monitoring. Select another timeline period above or check all yearly dates.'
                  : 'W tym okresie Twoje rośliny na balkonie wymagają jedynie bieżącego podlewania i kontroli szkodników. Wybierz inny termin z osi czasu powyżej lub sprawdź widok wszystkich dat.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: All Yearly Stages per Crop Table / Grid */}
      {viewMode === 'all_stages' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6">
          <div>
            <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {isEn ? 'Yearly Timeline Schedule for Each of Your Crops' : 'Roczny harmonogram terminów dla każdej z Twoich upraw'}
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {isEn ? 'Overview of all key milestones from sowing to container harvests.' : 'Przegląd wszystkich kluczowych dat od wysiewu aż po zbiory w donicach.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cropMilestones.map(({ plant, crop, sowHome, sowDirect, hardening, plantOut, care, harvest }) => (
              <div
                key={plant.id}
                className="p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-stone-200/80 dark:border-stone-800">
                  <div>
                    <h5 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                      {getPlantName(plant, language)}
                    </h5>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      {isEn ? 'Current stage:' : 'Aktualny etap:'}{' '}
                      <strong className="text-stone-800 dark:text-stone-200 capitalize">
                        {crop?.stage
                          ? isEn
                            ? crop.stage === 'planowanie'
                              ? 'Planning'
                              : crop.stage === 'siew'
                              ? 'Sowing'
                              : crop.stage === 'rozsada'
                              ? 'Seedling'
                              : crop.stage === 'rosnie'
                              ? 'Growing'
                              : crop.stage === 'kwitnie'
                              ? 'Flowering'
                              : crop.stage === 'owocuje'
                              ? 'Fruiting'
                              : crop.stage === 'zbior'
                              ? 'Harvest'
                              : crop.stage
                            : crop.stage
                          : isEn
                          ? 'Growing'
                          : 'Rośnie'}
                      </strong>
                      {crop?.customPotName && ` • ${crop.customPotName}`}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectPlantById(plant.id)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
                    title={isEn ? 'Open full guide' : 'Otwórz pełny poradnik'}
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {sowHome.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                        <span>🏠</span>
                        <span>{isEn ? 'Indoor seedling sowing:' : 'Wysiew w domu na rozsadę:'}</span>
                      </span>
                      <span className="font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                        {sowHome.join(', ')}
                      </span>
                    </div>
                  )}

                  {sowDirect.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                        <span>🌱</span>
                        <span>{isEn ? 'Direct sowing into pot:' : 'Siew wprost do donicy:'}</span>
                      </span>
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                        {sowDirect.join(', ')}
                      </span>
                    </div>
                  )}

                  {hardening.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                        <span>🌤️</span>
                        <span>{isEn ? 'Hardening seedlings on balcony:' : 'Hartowanie rozsad na balkonie:'}</span>
                      </span>
                      <span className="font-bold text-sky-900 dark:text-sky-200 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                        {hardening.join(', ')}
                      </span>
                    </div>
                  )}

                  {plantOut.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                        <span>🪴</span>
                        <span>{isEn ? 'Planting out after frost:' : 'Wysadzenie po przymrozkach:'}</span>
                      </span>
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                        {plantOut.join(', ')}
                      </span>
                    </div>
                  )}

                  {harvest.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                        <span>🧺</span>
                        <span>{isEn ? 'Harvesting window:' : 'Okres zbioru plonów:'}</span>
                      </span>
                      <span className="font-bold text-teal-900 dark:text-teal-200 bg-teal-100 dark:bg-teal-950 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800">
                        {harvest.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

