import React, { useState } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WeatherData, UserBalconySpec } from '../types';
import { POLAND_REGIONS } from '../lib/api';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  userSpec: UserBalconySpec;
  onRefresh: () => void;
}

export const WeatherWidget: React.FC<Props> = ({ weather, loading, userSpec, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      return localStorage.getItem('balcony_weather_expanded') === 'true';
    } catch {
      return false;
    }
  });

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('balcony_weather_expanded', String(next));
      } catch {}
      return next;
    });
  };

  const regionInfo = POLAND_REGIONS[userSpec.region];
  const cityName = regionInfo ? regionInfo.name.split('(')[0].trim() : 'Polska';

  const getWeatherIcon = (code: number, sizeClass = 'w-6 h-6') => {
    if (code === 0) return <Sun className={`${sizeClass} text-amber-500`} />;
    if (code === 1 || code === 2) return <CloudSun className={`${sizeClass} text-amber-400`} />;
    if (code >= 51 && code <= 80) return <CloudRain className={`${sizeClass} text-sky-500`} />;
    return <Cloud className={`${sizeClass} text-stone-400`} />;
  };

  return (
    <div
      id="weather-widget"
      className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs relative overflow-hidden transition-all duration-200"
    >
      {/* Friendly Compact Header Bar (Always visible) */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center shrink-0">
            {weather ? getWeatherIcon(weather.weather_code, 'w-6 h-6') : <Sun className="w-6 h-6 text-amber-500" />}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              {weather ? `${weather.temperature}°C` : '--°C'}
            </span>
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {cityName}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              ({weather?.weather_desc || 'Pobieranie danych...'})
            </span>

            {/* Quick Status Pill */}
            {weather?.balcony_advice?.frost_risk ? (
              <span className="text-[11px] font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-300 dark:border-red-800 ml-1">
                <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                Ryzyko przymrozku
              </span>
            ) : weather?.balcony_advice?.wind_risk ? (
              <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 dark:border-amber-800 ml-1">
                <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                Wiatr na {userSpec.floor}. p.
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60 ml-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                Dobre warunki do wegetacji
              </span>
            )}
          </div>
        </div>

        {/* Controls: Refresh + Expand/Collapse */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            id="refresh-weather-btn"
            onClick={onRefresh}
            disabled={loading}
            title="Odśwież dane pogodowe"
            className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            id="toggle-weather-details-btn"
            onClick={toggleExpand}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>{isExpanded ? 'Zwiń szczegóły' : 'Szczegóły pogody'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Detailed Meteorological & Watering Advisor View */}
      {isExpanded && (
        <div className="border-t border-stone-100 dark:border-stone-800 p-4 sm:p-5 bg-stone-50/50 dark:bg-stone-900/50 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Weather Metrics */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 block">
                Parametry aury dla {userSpec.floor}. piętra:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-150 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Odczuwalna</span>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {weather ? `${weather.apparent_temperature}°C` : '--'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-150 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Wind className="w-3 h-3 text-stone-500" />
                    <span>Wiatr na {userSpec.floor}. p.</span>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {weather?.balcony_advice?.adjusted_wind_at_floor ?? weather?.wind_speed ?? 10} km/h
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-850 border border-stone-150 dark:border-stone-700">
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-blue-500" />
                    <span>Wilgotność</span>
                  </div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {weather?.humidity ?? 60}%
                  </div>
                </div>
              </div>

              {weather && weather.precipitation > 0 && (
                <div className="mt-2 text-xs text-sky-700 dark:text-sky-300 font-medium flex items-center gap-1 bg-sky-50 dark:bg-sky-950/40 p-2 rounded-lg border border-sky-200 dark:border-sky-800">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Dzisiejsze opady deszczu: {weather.precipitation} mm</span>
                </div>
              )}
            </div>

            {/* Right: Container Watering Advisor */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Rekomendacja podlewania donic na dziś</span>
                  </span>
                </div>

                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                  {weather?.balcony_advice?.watering_status ||
                    'Umiarkowane podlewanie rano lub wieczorem. Zawsze sprawdzaj wilgotność ziemi palcem.'}
                </p>
              </div>

              <div className="text-[11px] text-stone-600 dark:text-stone-400 mt-2 flex items-center gap-1.5 font-medium pt-2 border-t border-stone-100 dark:border-stone-700">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{weather?.balcony_advice?.summary || 'Stabilna aura dla roślin na Twoim balkonie.'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
