import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Home,
  Sprout,
  Sun,
  Droplets,
  Scissors,
  Shield,
  Sparkles,
  Info,
} from 'lucide-react';
import { CalendarResponse, CalendarActionItem, UserBalconySpec } from '../types';
import { fetchCalendar, getCurrentPeriodId } from '../lib/api';

interface Props {
  userSpec: UserBalconySpec;
  onSelectPlantById: (plantId: string) => void;
  initialMode?: 'my_crops' | 'all';
  myCropIds?: string[];
  onNavigateToSearch?: () => void;
}

export const CalendarView: React.FC<Props> = ({
  userSpec,
  onSelectPlantById,
  initialMode = 'all',
  myCropIds = [],
  onNavigateToSearch,
}) => {
  const currentPeriodId = getCurrentPeriodId();
  const [calendarMode, setCalendarMode] = useState<'my_crops' | 'all'>(
    initialMode === 'my_crops' && myCropIds.length > 0 ? 'my_crops' : 'all'
  );
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(currentPeriodId);
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSuitabilityOnly, setFilterSuitabilityOnly] = useState<boolean>(false);
  const [calendarGroupFilter, setCalendarGroupFilter] = useState<'wszystkie' | 'warzywa' | 'owoce' | 'ziola'>('wszystkie');

  const activePlantFilterIds = calendarMode === 'my_crops' ? myCropIds : undefined;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCalendar(userSpec, selectedPeriodId, activePlantFilterIds)
      .then((data) => {
        if (isMounted) {
          setCalendarData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching calendar:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userSpec, selectedPeriodId, calendarMode, myCropIds.length]);

  const months = [
    { num: 1, name: 'Styczeń' },
    { num: 2, name: 'Luty' },
    { num: 3, name: 'Marzec' },
    { num: 4, name: 'Kwiecień' },
    { num: 5, name: 'Maj' },
    { num: 6, name: 'Czerwiec' },
    { num: 7, name: 'Lipiec' },
    { num: 8, name: 'Sierpień' },
    { num: 9, name: 'Wrzesień' },
    { num: 10, name: 'Październik' },
    { num: 11, name: 'Listopad' },
    { num: 12, name: 'Grudzień' },
  ];

  const getActionCategoryIcon = (actionLabel: string) => {
    if (actionLabel.includes('rozsadę') || actionLabel.includes('domu'))
      return <Home className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    if (actionLabel.includes('Siew wprost') || actionLabel.includes('donicy'))
      return <Sprout className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
    if (actionLabel.includes('Sadzenie') || actionLabel.includes('przesadzanie'))
      return <Sun className="w-4 h-4 text-amber-500" />;
    if (actionLabel.includes('Zbiory') || actionLabel.includes('Zbiór'))
      return <Scissors className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    if (actionLabel.includes('Zimowanie') || actionLabel.includes('zabezpieczenie'))
      return <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    return <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <div id="calendar-container" className="space-y-6">
      {/* Dual Calendar Mode Selector */}
      <div className="bg-stone-900 text-white rounded-3xl p-4 sm:p-5 border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-800/80 text-emerald-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Wybór trybu kalendarza:
            </div>
            <div className="text-sm font-semibold text-stone-200">
              {calendarMode === 'my_crops'
                ? `Wyświetlasz zadania tylko dla ${myCropIds.length} ${myCropIds.length === 1 ? 'uprawy' : 'upraw'} z Twojego balkonu`
                : 'Wyświetlasz zadania dla wszystkich możliwych upraw z bazy wiedzy'}
            </div>
          </div>
        </div>

        <div className="inline-flex p-1 bg-stone-800 rounded-2xl border border-stone-700 w-full sm:w-auto">
          <button
            id="cal-mode-my-crops"
            onClick={() => setCalendarMode('my_crops')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              calendarMode === 'my_crops'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🌱 Moje uprawy</span>
            <span className="text-[11px] px-2 py-0.2 rounded-full bg-stone-900/60 text-emerald-300 font-bold border border-emerald-500/30">
              {myCropIds.length}
            </span>
          </button>

          <button
            id="cal-mode-all"
            onClick={() => setCalendarMode('all')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              calendarMode === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <span>🌐 Wszystko co możliwe</span>
          </button>
        </div>
      </div>

      {calendarMode === 'my_crops' && myCropIds.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              Nie masz jeszcze dodanych roślin do "Moich upraw". Dodaj pierwsze rośliny z katalogu lub przełącz na "Wszystko co możliwe".
            </span>
          </div>
          {onNavigateToSearch && (
            <button
              onClick={onNavigateToSearch}
              className="px-3 py-1.5 bg-amber-800 text-white text-xs font-semibold rounded-lg hover:bg-amber-900 shrink-0 cursor-pointer"
            >
              Szukaj upraw
            </button>
          )}
        </div>
      )}

      {/* Calendar Header with Live Date Indicator */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
            <CalendarIcon className="w-4 h-4 text-stone-600 dark:text-stone-400" />
            <span>
              {calendarMode === 'my_crops' ? 'Indywidualny terminarz Moich upraw' : 'Ogólny kalendarz 24 okresów uprawy'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {calendarMode === 'my_crops' ? 'Co robić przy Twoich uprawach?' : 'Co robić na balkonie w donicach?'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-xl">
            {calendarMode === 'my_crops'
              ? `Terminy prac dostosowane do ${myCropIds.length} roślin w Twoich pojemnikach.`
              : 'Kalendarz uwzględnia aktualną datę oraz mikroklimat Twojego balkonu (piętro, ekspozycję i strefę mrozową Polski).'}
          </p>
        </div>

        {/* Quick return to today button and filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          {/* Group Switcher: indigo for veg, fuchsia for fruit, teal for herbs */}
          <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200/80 dark:border-stone-700 text-xs">
            <button
              id="cal-group-all"
              onClick={() => setCalendarGroupFilter('wszystkie')}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                calendarGroupFilter === 'wszystkie'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Wszystkie
            </button>
            <button
              id="cal-group-veg"
              onClick={() => setCalendarGroupFilter('warzywa')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                calendarGroupFilter === 'warzywa'
                  ? 'bg-indigo-900 text-white shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🥕</span> Warzywa
            </button>
            <button
              id="cal-group-fruit"
              onClick={() => setCalendarGroupFilter('owoce')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                calendarGroupFilter === 'owoce'
                  ? 'bg-fuchsia-900 text-white shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🍓</span> Owoce
            </button>
            <button
              id="cal-group-herbs"
              onClick={() => setCalendarGroupFilter('ziola')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                calendarGroupFilter === 'ziola'
                  ? 'bg-teal-900 text-white shadow-2xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🌿</span> Zioła
            </button>
          </div>

          <div className="flex items-center gap-2">
            {selectedPeriodId !== currentPeriodId && (
              <button
                id="jump-to-current-period-btn"
                onClick={() => setSelectedPeriodId(currentPeriodId)}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
                <span>Wróć do dzisiaj</span>
              </button>
            )}

            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700 transition">
              <input
                id="filter-suitability-checkbox"
                type="checkbox"
                checked={filterSuitabilityOnly}
                onChange={(e) => setFilterSuitabilityOnly(e.target.checked)}
                className="rounded text-stone-700 focus:ring-stone-500 w-3.5 h-3.5"
              />
              <span>Dopasowane (&gt;75%)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 24-Period Timeline Selector */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
        <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Wybierz 2-tygodniowy okres z osi roku:</span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-normal">
            Podświetlony punkt = dziś ({currentPeriodId === selectedPeriodId ? 'aktywny okres' : 'przeglądasz inny okres'})
          </span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin">
          <div className="flex gap-2 min-w-[820px]">
            {months.map((m) => {
              const p1 = `${String(m.num).padStart(2, '0')}_1`;
              const p2 = `${String(m.num).padStart(2, '0')}_2`;

              const isP1Current = p1 === currentPeriodId;
              const isP2Current = p2 === currentPeriodId;
              const isP1Selected = p1 === selectedPeriodId;
              const isP2Selected = p2 === selectedPeriodId;

              return (
                <div
                  key={m.num}
                  className="flex-1 bg-stone-50/90 dark:bg-stone-800/60 rounded-2xl p-2 border border-stone-200/60 dark:border-stone-700/60"
                >
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 text-center mb-1.5">
                    {m.name}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Połowa I */}
                    <button
                      id={`period-btn-${p1}`}
                      onClick={() => setSelectedPeriodId(p1)}
                      className={`py-1.5 px-1 text-[11px] rounded-lg font-semibold transition flex flex-col items-center justify-center relative cursor-pointer ${
                        isP1Selected
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                          : isP1Current
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-bold'
                          : 'bg-white dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600'
                      }`}
                    >
                      <span>I</span>
                      {isP1Current && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1"
                          title="Aktualny dzień"
                        />
                      )}
                    </button>

                    {/* Połowa II */}
                    <button
                      id={`period-btn-${p2}`}
                      onClick={() => setSelectedPeriodId(p2)}
                      className={`py-1.5 px-1 text-[11px] rounded-lg font-semibold transition flex flex-col items-center justify-center relative cursor-pointer ${
                        isP2Selected
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                          : isP2Current
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-bold'
                          : 'bg-white dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-600'
                      }`}
                    >
                      <span>II</span>
                      {isP2Current && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1"
                          title="Aktualny dzień"
                        />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Period Details Banner */}
      {calendarData && (
        <div className="bg-stone-800 dark:bg-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-stone-700 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
              <span>Przeglądany okres:</span>
              {calendarData.is_current_period && (
                <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  Bieżący okres (dzisiaj)
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {calendarData.period.name}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              Sprawdź poniżej listę rekomendowanych prac ogrodniczych i siewów dla tego okresu.
            </p>
          </div>

          {calendarData.season_tips.length > 0 && (
            <div className="sm:max-w-md w-full bg-stone-700/60 dark:bg-stone-800/80 rounded-2xl p-3.5 border border-stone-600/60 text-xs space-y-1.5">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Wskazówki sezonowe dla donic:</span>
              </div>
              {calendarData.season_tips.map((tip, idx) => (
                <div key={idx} className="text-stone-200 text-[11px] leading-relaxed">
                  • {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Groups List */}
      {loading ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-stone-700 dark:border-stone-300 border-t-transparent rounded-full mb-2" />
          <p className="text-xs text-stone-500 dark:text-stone-400">Przeliczanie kalendarza dla wybranego okresu...</p>
        </div>
      ) : calendarData && Object.keys(calendarData.actions_by_type).length > 0 ? (
        <div className="space-y-6">
          {(Object.entries(calendarData.actions_by_type) as [string, CalendarActionItem[]][]).map(
            ([actionLabel, items]) => {
              const filteredItems = items.filter((it: CalendarActionItem) => {
                const matchesSuit = !filterSuitabilityOnly || it.suitability_score >= 75;
                const matchesGroup =
                  calendarGroupFilter === 'wszystkie' || it.plant_group === calendarGroupFilter;
                return matchesSuit && matchesGroup;
              });

              if (filteredItems.length === 0) return null;

              return (
                <div
                  key={actionLabel}
                  className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs transition-colors"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shadow-2xs">
                      {getActionCategoryIcon(actionLabel)}
                    </div>
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                        {actionLabel}
                      </h4>
                      <span className="text-xs text-stone-500 dark:text-stone-400">
                        Dotyczy {filteredItems.length} {filteredItems.length === 1 ? 'rośliny' : 'roślin'}
                      </span>
                    </div>
                  </div>

                  {/* Grid of plants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredItems.map((item) => {
                      const isFruit = item.plant_group === 'owoce';
                      const isHerb = item.plant_group === 'ziola';

                      const cardTheme = isFruit
                        ? 'bg-fuchsia-50/40 dark:bg-fuchsia-950/20 border-fuchsia-200/80 dark:border-fuchsia-900/40 hover:border-fuchsia-400'
                        : isHerb
                        ? 'bg-teal-50/40 dark:bg-teal-950/20 border-teal-200/80 dark:border-teal-900/40 hover:border-teal-400'
                        : 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-900/40 hover:border-indigo-400';

                      const groupLabel = isFruit ? 'Owoc' : isHerb ? 'Zioło' : 'Warzywo';
                      const groupBadge = isFruit
                        ? 'bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-200 dark:border-fuchsia-800'
                        : isHerb
                        ? 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 border-teal-200 dark:border-teal-800'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';

                      // Strict semantic score: green >= 75%, yellow 50-74%, red < 50%
                      const scoreBadge =
                        item.suitability_score >= 75
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                          : item.suitability_score >= 50
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800'
                          : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';

                      return (
                        <div
                          key={item.plant_id}
                          id={`cal-item-${item.plant_id}`}
                          onClick={() => onSelectPlantById(item.plant_id)}
                          className={`p-4 rounded-2xl border ${cardTheme} shadow-2xs hover:shadow-sm transition cursor-pointer flex flex-col justify-between`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-1 mb-1.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${groupBadge}`}
                                >
                                  <span>{isFruit ? '🍓' : isHerb ? '🌿' : '🥕'}</span>
                                  <span>{groupLabel}</span>
                                </span>
                                <h5 className="font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
                                  {item.plant_name}
                                </h5>
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${scoreBadge}`}
                              >
                                {item.suitability_score}%
                              </span>
                            </div>

                            {/* Top variety recommendation */}
                            {item.recommended_variety && (
                              <div className="text-[11px] font-medium text-stone-700 dark:text-stone-300 bg-white/80 dark:bg-stone-800/80 px-2 py-1 rounded-lg border border-stone-200/60 dark:border-stone-700 mt-1 flex items-center justify-between">
                                <span className="truncate">
                                  Odmiana: <strong>{item.recommended_variety}</strong>
                                </span>
                                {item.variety_badge && (
                                  <span className="text-[9px] font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.2 rounded-md shrink-0 ml-1 border border-amber-200 dark:border-amber-800">
                                    {item.variety_badge}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Nutrition micro-pill */}
                            {item.nutrition && (
                              <div className="text-[10px] text-stone-600 dark:text-stone-400 mt-1.5 line-clamp-1">
                                🌱 <span className="font-semibold text-stone-800 dark:text-stone-200">Witaminy:</span>{' '}
                                {item.nutrition.vitamins}
                              </div>
                            )}

                            <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 mt-1.5 leading-relaxed">
                              {item.tip}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-stone-200/60 dark:border-stone-700 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
                            <span>Donica: min. {item.pot_vol}L</span>
                            <span className="text-stone-900 dark:text-stone-100 font-semibold hover:underline">
                              Zobacz poradnik →
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
          <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-stone-800 dark:text-stone-200">Brak aktywnych prac w tym okresie</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
            W tym terminie wegetacja na balkonie odpoczywa lub trwa rutynowe podlewanie. Wybierz inny okres z osi czasu powyżej.
          </p>
        </div>
      )}
    </div>
  );
};
