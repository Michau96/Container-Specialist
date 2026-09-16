import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Wind,
  AlertTriangle,
  RefreshCw,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
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
  const regionInfo = POLAND_REGIONS[userSpec.region];

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-8 h-8 text-amber-500 animate-pulse" />;
    if (code === 1 || code === 2) return <CloudSun className="w-8 h-8 text-amber-400" />;
    if (code >= 51 && code <= 80) return <CloudRain className="w-8 h-8 text-sky-500" />;
    return <Cloud className="w-8 h-8 text-stone-400" />;
  };

  return (
    <div
      id="weather-widget"
      className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-stone-200/80 shadow-xs relative overflow-hidden"
    >
      {/* Subtle sunny gradient bar on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-amber-400 to-sky-500" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Weather overview */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-2xl flex items-center justify-center shrink-0">
            {weather ? getWeatherIcon(weather.weather_code) : <Sun className="w-8 h-8 text-amber-500" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Pogoda na żywo • {regionInfo ? regionInfo.name.split('(')[0].trim() : 'Polska'}
              </span>
              <button
                id="refresh-weather-btn"
                onClick={onRefresh}
                disabled={loading}
                title="Odśwież dane z Open-Meteo"
                className="text-stone-400 hover:text-stone-700 transition p-0.5 rounded-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                {weather ? `${weather.temperature}°C` : '--°C'}
              </span>
              <span className="text-xs text-stone-500">
                odczuwalna {weather ? `${weather.apparent_temperature}°C` : '--'}
              </span>
              <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full ml-1">
                {weather?.weather_desc || 'Pobieranie danych...'}
              </span>
            </div>

            {/* Sub-metrics */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600 mt-1.5">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-600" />
                <span>Wiatr na {userSpec.floor}. p.: </span>
                <strong className="text-stone-800">
                  {weather?.balcony_advice?.adjusted_wind_at_floor ?? weather?.wind_speed ?? 10} km/h
                </strong>
              </span>

              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                <span>Wilgotność: </span>
                <strong className="text-stone-800">{weather?.humidity ?? 60}%</strong>
              </span>

              {weather && weather.precipitation > 0 && (
                <span className="flex items-center gap-1 text-sky-700 font-medium">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Opady: {weather.precipitation} mm</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Balcony Container Watering Advisor */}
        <div className="md:max-w-md w-full p-3.5 rounded-xl bg-[#F7FAF7] border border-emerald-200/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-700" />
              <span>Balkonowy Doradca Nawadniania</span>
            </span>
            {weather?.balcony_advice?.frost_risk && (
              <span className="text-[11px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Ryzyko przymrozku
              </span>
            )}
            {weather?.balcony_advice?.wind_risk && !weather?.balcony_advice?.frost_risk && (
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Wind className="w-3 h-3" />
                Mocny wiatr
              </span>
            )}
            {!weather?.balcony_advice?.frost_risk && !weather?.balcony_advice?.wind_risk && (
              <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Optymalne warunki
              </span>
            )}
          </div>

          <p className="text-xs text-stone-700 leading-relaxed font-normal">
            {weather?.balcony_advice?.watering_status ||
              'Umiarkowane podlewanie rano. Zawsze sprawdzaj wilgotność gleby palcem przed podlaniem.'}
          </p>

          <div className="text-[11px] text-emerald-900/80 mt-1 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
            <span>{weather?.balcony_advice?.summary || 'Stabilna aura dla upraw doniczkowych.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
