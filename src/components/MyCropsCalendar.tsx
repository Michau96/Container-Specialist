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

const CALENDAR_PERIODS_ORDER: { id: string; name: string; short: string; month: number; half: number }[] = [
  { id: '01_1', name: 'I połowa Stycznia', short: 'Sty I', month: 1, half: 1 },
  { id: '01_2', name: 'II połowa Stycznia', short: 'Sty II', month: 1, half: 2 },
  { id: '02_1', name: 'I połowa Lutego', short: 'Lut I', month: 2, half: 1 },
  { id: '02_2', name: 'II połowa Lutego', short: 'Lut II', month: 2, half: 2 },
  { id: '03_1', name: 'I połowa Marca', short: 'Mar I', month: 3, half: 1 },
  { id: '03_2', name: 'II połowa Marca', short: 'Mar II', month: 3, half: 2 },
  { id: '04_1', name: 'I połowa Kwietnia', short: 'Kwi I', month: 4, half: 1 },
  { id: '04_2', name: 'II połowa Kwietnia', short: 'Kwi II', month: 4, half: 2 },
  { id: '05_1', name: 'I połowa Maja', short: 'Maj I', month: 5, half: 1 },
  { id: '05_2', name: 'II połowa Maja', short: 'Maj II', month: 5, half: 2 },
  { id: '06_1', name: 'I połowa Czerwca', short: 'Cze I', month: 6, half: 1 },
  { id: '06_2', name: 'II połowa Czerwca', short: 'Cze II', month: 6, half: 2 },
  { id: '07_1', name: 'I połowa Lipca', short: 'Lip I', month: 7, half: 1 },
  { id: '07_2', name: 'II połowa Lipca', short: 'Lip II', month: 7, half: 2 },
  { id: '08_1', name: 'I połowa Sierpnia', short: 'Sie I', month: 8, half: 1 },
  { id: '08_2', name: 'II połowa Sierpnia', short: 'Sie II', month: 8, half: 2 },
  { id: '09_1', name: 'I połowa Września', short: 'Wrz I', month: 9, half: 1 },
  { id: '09_2', name: 'II połowa Września', short: 'Wrz II', month: 9, half: 2 },
  { id: '10_1', name: 'I połowa Października', short: 'Paź I', month: 10, half: 1 },
  { id: '10_2', name: 'II połowa Października', short: 'Paź II', month: 10, half: 2 },
  { id: '11_1', name: 'I połowa Listopada', short: 'Lis I', month: 11, half: 1 },
  { id: '11_2', name: 'II połowa Listopada', short: 'Lis II', month: 11, half: 2 },
  { id: '12_1', name: 'I połowa Grudnia', short: 'Gru I', month: 12, half: 1 },
  { id: '12_2', name: 'II połowa Grudnia', short: 'Gru II', month: 12, half: 2 },
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
        .map(([pId]) => CALENDAR_PERIODS_ORDER.find((p) => p.id === pId)?.short)
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

  const getActionCategoryIcon = (label: string) => {
    if (label.includes('Wysiew w domu')) return '🏠';
    if (label.includes('Siew wprost')) return '🌱';
    if (label.includes('Hartowanie')) return '🌤️';
    if (label.includes('Sadzenie docelowe')) return '🪴';
    if (label.includes('pielęgnacja')) return '💧';
    if (label.includes('Zbiory')) return '🧺';
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
            <span>Spersonalizowany kalendarz • Tylko Twoje uprawy</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Indywidualny kalendarz prac dla Moich upraw
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Ten widok zawiera wyłącznie zadania, przypomnienia i etapy dla {myPlants.length}{' '}
            {myPlants.length === 1 ? 'rośliny' : 'roślin'} dodanych do Twojego balkonu.
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
              Na dany okres
            </button>
            <button
              onClick={() => setViewMode('all_stages')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                viewMode === 'all_stages'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Wszystkie daty roczne
            </button>
          </div>

          <button
            onClick={onSwitchToFullCalendar}
            className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>🌐 Pełny kalendarz (Wszystko co możliwe)</span>
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
                <span>Wybierz okres na osi roku:</span>
                <span className="text-stone-400 font-normal">
                  ({currentPeriodObj?.name})
                </span>
              </div>
              <button
                onClick={() => setSelectedPeriodId(currentPeriodId)}
                className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Przeskocz do dzisiaj ({currentPeriodId.replace('_', '/')})</span>
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
                      <span className="text-[10px] font-bold block">{period.short}</span>
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
                Pobieranie kalendarza Twoich upraw...
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
                          {actionLabel}
                        </h4>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          Dotyczy {items.length} {items.length === 1 ? 'Twojej rośliny' : 'Twoich roślin'}
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
                                  title={isCompleted ? 'Oznacz jako niewykonane' : 'Oznacz jako wykonane'}
                                >
                                  {isCompleted ? (
                                    <CheckSquare className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                                  ) : (
                                    <Square className="w-5 h-5 text-stone-400" />
                                  )}
                                </button>
                                <div>
                                  <h5
                                    className={`font-bold text-sm tracking-tight ${
                                      isCompleted
                                        ? 'line-through text-stone-500 dark:text-stone-400'
                                        : 'text-stone-900 dark:text-stone-100'
                                    }`}
                                  >
                                    {item.plant_name} {crop?.selectedVariety ? `– ${crop.selectedVariety}` : ''}
                                  </h5>
                                  {crop?.selectedVariety && (
                                    <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300">
                                      🌱 Odmiana: {crop.selectedVariety} {crop.potCount && crop.potCount > 1 ? `(${crop.potCount}x)` : ''}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
                                {crop?.pot?.volumeL ? `Twoja: ${crop.pot.volumeL}L` : `Wymóg: ${item.pot_vol}L`}
                              </span>
                            </div>

                            {crop?.sowing?.date && (
                              <div className="text-[10px] text-stone-500 dark:text-stone-400 mb-1.5 flex items-center gap-1">
                                <span>{crop.sowing.method === 'sadzonka' ? '🌿' : '🌱'}</span>
                                <span>Rozpoczęcie: {crop.sowing.date} ({crop.sowing.method === 'sadzonka' ? 'sadzonka' : 'nasiona'})</span>
                              </div>
                            )}

                            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
                              {item.tip}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
                            <span className="text-[11px] text-stone-500">
                              {isCompleted ? '✓ Wykonano w tym okresie' : 'Do zrobienia'}
                            </span>
                            <button
                              onClick={() => onSelectPlantById(item.plant_id)}
                              className="font-semibold text-emerald-800 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <span>Poradnik</span>
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
                Brak aktywnych siewów lub zbiorów dla Twoich upraw w okresie {currentPeriodObj?.name}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
                W tym okresie Twoje rośliny na balkonie wymagają jedynie bieżącego podlewania i kontroli szkodników.
                Wybierz inny termin z osi czasu powyżej lub sprawdź widok wszystkich dat.
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
              Roczny harmonogram terminów dla każdej z Twoich upraw
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Przegląd wszystkich kluczowych dat od wysiewu aż po zbiory w donicach.
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
                      {plant.name}
                    </h5>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      Aktualny etap: <strong className="text-stone-800 dark:text-stone-200 capitalize">{crop?.stage || 'Rośnie'}</strong>
                      {crop?.customPotName && ` • ${crop.customPotName}`}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectPlantById(plant.id)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 transition cursor-pointer"
                    title="Otwórz pełny poradnik"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  {sowHome.length > 0 && (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700">
                      <span className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5 font-medium">
                        <span>🏠</span>
                        <span>Wysiew w domu na rozsadę:</span>
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
                        <span>Siew wprost do donicy:</span>
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
                        <span>Hartowanie rozsad na balkonie:</span>
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
                        <span>Wysadzenie po przymrozkach:</span>
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
                        <span>Okres zbioru plonów:</span>
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
