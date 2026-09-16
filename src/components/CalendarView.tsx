import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Sprout,
  Sun,
  Droplets,
  Scissors,
  Shield,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { CalendarResponse, CalendarPeriod, CalendarActionItem, UserBalconySpec, Plant } from '../types';
import { fetchCalendar, getCurrentPeriodId } from '../lib/api';

interface Props {
  userSpec: UserBalconySpec;
  onSelectPlantById: (plantId: string) => void;
}

export const CalendarView: React.FC<Props> = ({ userSpec, onSelectPlantById }) => {
  const currentPeriodId = getCurrentPeriodId();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(currentPeriodId);
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterSuitabilityOnly, setFilterSuitabilityOnly] = useState<boolean>(false);
  const [calendarGroupFilter, setCalendarGroupFilter] = useState<'wszystkie' | 'warzywa' | 'owoce' | 'ziola'>('wszystkie');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchCalendar(userSpec, selectedPeriodId)
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
  }, [userSpec, selectedPeriodId]);

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
      return <Home className="w-4 h-4 text-amber-700" />;
    if (actionLabel.includes('Siew wprost') || actionLabel.includes('donicy'))
      return <Sprout className="w-4 h-4 text-emerald-700" />;
    if (actionLabel.includes('Sadzenie') || actionLabel.includes('przesadzanie'))
      return <Sun className="w-4 h-4 text-sky-700" />;
    if (actionLabel.includes('Zbiory') || actionLabel.includes('Zbiór'))
      return <Scissors className="w-4 h-4 text-rose-700" />;
    if (actionLabel.includes('Zimowanie') || actionLabel.includes('zabezpieczenie'))
      return <Shield className="w-4 h-4 text-indigo-700" />;
    return <Droplets className="w-4 h-4 text-blue-700" />;
  };

  const getActionCategoryBadgeStyle = (actionLabel: string) => {
    if (actionLabel.includes('rozsadę')) return 'bg-amber-50 text-amber-950 border-amber-200';
    if (actionLabel.includes('Siew wprost')) return 'bg-emerald-50 text-emerald-950 border-emerald-200';
    if (actionLabel.includes('Sadzenie')) return 'bg-sky-50 text-sky-950 border-sky-200';
    if (actionLabel.includes('Zbiory')) return 'bg-rose-50 text-rose-950 border-rose-200';
    return 'bg-stone-50 text-stone-900 border-stone-200';
  };

  return (
    <div id="calendar-container" className="space-y-6">
      {/* Calendar Header with Live Date Indicator */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            <CalendarIcon className="w-4 h-4 text-emerald-700" />
            <span>Interaktywny Kalendarz 24 Okresów Uprawy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
            Co robić na balkonie w donicach?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Kalendarz uwzględnia aktualną datę oraz mikroklimat Twojego balkonu (piętro, ekspozycję i strefę mrozową Polski).
          </p>
        </div>

        {/* Quick return to today button and filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          {/* Easy Switcher: Warzywa, Owoce, Zioła in Calendar */}
          <div className="flex items-center p-1 bg-stone-100 rounded-xl border border-stone-200/80 text-xs">
            <button
              id="cal-group-all"
              onClick={() => setCalendarGroupFilter('wszystkie')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                calendarGroupFilter === 'wszystkie'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Wszystkie
            </button>
            <button
              id="cal-group-veg"
              onClick={() => setCalendarGroupFilter('warzywa')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                calendarGroupFilter === 'warzywa'
                  ? 'bg-emerald-800 text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🥕</span> Warzywa
            </button>
            <button
              id="cal-group-fruit"
              onClick={() => setCalendarGroupFilter('owoce')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                calendarGroupFilter === 'owoce'
                  ? 'bg-rose-800 text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🍓</span> Owoce
            </button>
            <button
              id="cal-group-herbs"
              onClick={() => setCalendarGroupFilter('ziola')}
              className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                calendarGroupFilter === 'ziola'
                  ? 'bg-teal-800 text-white shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
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
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Wróć do dziś</span>
              </button>
            )}

            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-stone-100 transition">
              <input
                id="filter-suitability-checkbox"
                type="checkbox"
                checked={filterSuitabilityOnly}
                onChange={(e) => setFilterSuitabilityOnly(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-600 w-3.5 h-3.5"
              />
              <span>Dopasowane (&gt;75%)</span>
            </label>
          </div>
        </div>
      </div>

      {/* 24-Period Timeline Selector (Interactive Horizontal Scroller) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs">
        <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Wybierz 2-tygodniowy okres z osi roku:</span>
          <span className="text-[11px] text-stone-500 font-normal">
            Podświetlony punkt = Dziś ({currentPeriodId === selectedPeriodId ? 'Aktywny okres' : 'Przeglądasz inny okres'})
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
                <div key={m.num} className="flex-1 bg-stone-50/90 rounded-2xl p-2 border border-stone-200/60">
                  <div className="text-[11px] font-bold text-stone-700 text-center mb-1.5">{m.name}</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* Połowa I */}
                    <button
                      id={`period-btn-${p1}`}
                      onClick={() => setSelectedPeriodId(p1)}
                      className={`py-1.5 px-1 text-[11px] rounded-lg font-semibold transition flex flex-col items-center justify-center relative ${
                        isP1Selected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : isP1Current
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span>I</span>
                      {isP1Current && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" title="Aktualny dzień" />
                      )}
                    </button>

                    {/* Połowa II */}
                    <button
                      id={`period-btn-${p2}`}
                      onClick={() => setSelectedPeriodId(p2)}
                      className={`py-1.5 px-1 text-[11px] rounded-lg font-semibold transition flex flex-col items-center justify-center relative ${
                        isP2Selected
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : isP2Current
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span>II</span>
                      {isP2Current && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" title="Aktualny dzień" />
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
        <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
              <span>Przeglądany okres:</span>
              {calendarData.is_current_period && (
                <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  BIEŻĄCY OKRES (DZISIAJ)
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {calendarData.period.name}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Sprawdź poniżej listę rekomendowanych prac ogrodniczych i siewów dla tego okresu.
            </p>
          </div>

          {calendarData.season_tips.length > 0 && (
            <div className="sm:max-w-md w-full bg-emerald-800/80 rounded-2xl p-3.5 border border-emerald-700/60 text-xs space-y-1.5">
              <div className="font-semibold text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Wskazówki sezonowe dla donic:</span>
              </div>
              {calendarData.season_tips.map((tip, idx) => (
                <div key={idx} className="text-emerald-100 text-[11px] leading-relaxed">
                  • {tip}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions Groups List */}
      {loading ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full mb-2" />
          <p className="text-xs text-stone-500">Przeliczanie kalendarza dla wybranego okresu...</p>
        </div>
      ) : calendarData && Object.keys(calendarData.actions_by_type).length > 0 ? (
        <div className="space-y-6">
          {(Object.entries(calendarData.actions_by_type) as [string, CalendarActionItem[]][]).map(([actionLabel, items]) => {
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
                className={`bg-white rounded-3xl p-5 sm:p-6 border shadow-xs ${getActionCategoryBadgeStyle(
                  actionLabel
                )}`}
              >
                {/* Category Header */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                  <div className="p-2 rounded-xl bg-white shadow-2xs">
                    {getActionCategoryIcon(actionLabel)}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-stone-900">
                      {actionLabel}
                    </h4>
                    <span className="text-xs text-stone-500">
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
                      ? 'bg-rose-50/40 border-rose-200/90 hover:border-rose-400 hover:bg-rose-50/70'
                      : isHerb
                      ? 'bg-teal-50/40 border-teal-200/90 hover:border-teal-400 hover:bg-teal-50/70'
                      : 'bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-400 hover:bg-emerald-50/70';

                    const groupLabel = isFruit ? 'Owoc' : isHerb ? 'Zioło' : 'Warzywo';
                    const groupBadge = isFruit
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : isHerb
                      ? 'bg-teal-100 text-teal-800 border-teal-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200';

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
                              <h5 className="font-bold text-stone-900 text-sm tracking-tight">
                                {item.plant_name}
                              </h5>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                item.suitability_score >= 80
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : item.suitability_score >= 60
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-stone-100 text-stone-700'
                              }`}
                            >
                              {item.suitability_score}%
                            </span>
                          </div>

                          {/* Top variety recommendation */}
                          {item.recommended_variety && (
                            <div className="text-[11px] font-medium text-stone-700 bg-white/80 px-2 py-1 rounded-lg border border-stone-200/60 mt-1 flex items-center justify-between">
                              <span className="truncate">
                                Odmiana: <strong>{item.recommended_variety}</strong>
                              </span>
                              {item.variety_badge && (
                                <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-md shrink-0 ml-1">
                                  {item.variety_badge}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Nutrition micro-pill */}
                          {item.nutrition && (
                            <div className="text-[10px] text-stone-600 mt-1.5 line-clamp-1">
                              🌱 <span className="font-semibold text-stone-800">Witaminy:</span>{' '}
                              {item.nutrition.vitamins}
                            </div>
                          )}

                          <p className="text-[11px] text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                            {item.tip}
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
                          <span>Donica: min. {item.pot_vol}L</span>
                          <span className="text-emerald-900 font-semibold hover:underline">
                            Zobacz poradnik →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 p-6">
          <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-stone-800">Brak aktywnych prac w tym okresie</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            W tym terminie wegetacja na balkonie odpoczywa lub trwa rutynowe podlewanie. Wybierz inny okres z osi czasu powyżej.
          </p>
        </div>
      )}
    </div>
  );
};
