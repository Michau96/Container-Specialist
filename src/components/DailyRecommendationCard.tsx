import React, { useState } from 'react';
import {
  Droplets,
  Sparkles,
  Scissors,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { DailyCropsRecommendation, WeatherData, UserBalconySpec } from '../types';

interface Props {
  recommendation: DailyCropsRecommendation;
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  cropsCount: number;
}

export const DailyRecommendationCard: React.FC<Props> = ({
  recommendation,
  weather,
  userSpec,
  cropsCount,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const { watering, fertilizing, pruning, spraying, specialAlerts } = recommendation;

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-stone-100 rounded-3xl p-5 sm:p-7 shadow-md border border-stone-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Codzienny asystent balkonu • Dzisiejsze rekomendacje</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>O czym pamiętać dzisiaj w Twoich uprawach?</span>
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
            Spersonalizowane zalecenia pielęgnacyjne przeliczone na podstawie aktualnej pogody w regionie,
            warunków na Twoim {userSpec.floor}. piętrze oraz {cropsCount} roślin w Twoich uprawach.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center bg-stone-800/80 px-3 py-1.5 rounded-xl border border-stone-700/60 text-xs text-stone-300">
          <Clock className="w-3.5 h-3.5 text-stone-400" />
          <span>Odświeżono: dzisiaj {recommendation.lastUpdated}</span>
        </div>
      </div>

      {/* Special Alerts Banner if any */}
      {specialAlerts.length > 0 && (
        <div className="mt-4 space-y-2">
          {specialAlerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-amber-500/15 border border-amber-400/40 rounded-2xl text-amber-200 text-xs sm:text-sm font-medium flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{alert}</span>
            </div>
          ))}
        </div>
      )}

      {/* 4 Pillars of Daily Care Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* 1. Podlewanie */}
        <div
          id="daily-rec-watering"
          className="bg-stone-800/60 hover:bg-stone-800/90 rounded-2xl p-4 sm:p-5 border border-stone-700/60 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800/50">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                    Filar 1: Nawadnianie
                  </div>
                  <h4 className="text-base font-bold text-white">Podlewanie donic</h4>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                  watering.isGoodDay
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                    : watering.status === 'wstrzymaj'
                    ? 'bg-amber-950 text-amber-300 border-amber-700/60'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                {watering.isGoodDay ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {watering.status === 'obfite'
                    ? 'Podlej obficie'
                    : watering.status === 'wstrzymaj'
                    ? 'Wstrzymaj się'
                    : 'Podlej po teście'}
                </span>
              </div>
            </div>

            <h5 className="text-sm font-semibold text-stone-100 mt-2">{watering.title}</h5>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">{watering.advice}</p>

            {watering.specifics.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                {watering.specifics.map((spec, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-stone-300">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-stone-400 flex items-center justify-between">
            <span>
              Aktualna wilgotność: <strong>{weather?.humidity ?? 60}%</strong>
            </span>
            <span>
              Opady: <strong>{weather?.precipitation ?? 0} mm</strong>
            </span>
          </div>
        </div>

        {/* 2. Nawożenie */}
        <div
          id="daily-rec-fertilizing"
          className="bg-stone-800/60 hover:bg-stone-800/90 rounded-2xl p-4 sm:p-5 border border-stone-700/60 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Filar 2: Zasilanie
                  </div>
                  <h4 className="text-base font-bold text-white">Nawożenie podłoża</h4>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                  fertilizing.isGoodDay
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                {fertilizing.isGoodDay ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span>{fertilizing.isGoodDay ? 'Dobry dzień na nawóz' : 'Pomiń dzisiaj'}</span>
              </div>
            </div>

            <h5 className="text-sm font-semibold text-stone-100 mt-2">{fertilizing.title}</h5>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">{fertilizing.advice}</p>

            <div className="mt-3 text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
              <span className="text-amber-400 font-bold block mb-0.5 text-[11px] uppercase tracking-wider">
                Wskazówka dawkowania:
              </span>
              <p className="text-[11px] text-stone-300 leading-relaxed">{fertilizing.dosageTip}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-stone-400 flex items-center justify-between">
            <span>
              Temperatura: <strong>{weather?.temperature ?? 19}°C</strong>
            </span>
            <span>Reguła: wilgotna bryła przed nawozem</span>
          </div>
        </div>

        {/* 3. Przycinanie */}
        <div
          id="daily-rec-pruning"
          className="bg-stone-800/60 hover:bg-stone-800/90 rounded-2xl p-4 sm:p-5 border border-stone-700/60 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/50">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    Filar 3: Formowanie
                  </div>
                  <h4 className="text-base font-bold text-white">Przycinanie i uszczykiwanie</h4>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/50">
                {pruning.plantTasks.length} {pruning.plantTasks.length === 1 ? 'zadanie' : 'zadania'}
              </span>
            </div>

            <h5 className="text-sm font-semibold text-stone-100 mt-2">{pruning.title}</h5>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">{pruning.advice}</p>

            <div className="mt-3 space-y-1.5">
              {pruning.plantTasks.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-stone-900/70 p-2.5 rounded-xl border border-stone-800 text-xs flex items-start gap-2"
                >
                  <span className="text-base shrink-0">{t.icon}</span>
                  <div>
                    <strong className="text-stone-200 block text-[11px]">{t.plantName}:</strong>
                    <span className="text-stone-300 text-[11px] leading-relaxed">{t.task}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-stone-400">
            Narzędzie: używaj zdezynfekowanego nożyka lub ostrych nożyczek
          </div>
        </div>

        {/* 4. Opryski i ochrona */}
        <div
          id="daily-rec-spraying"
          className="bg-stone-800/60 hover:bg-stone-800/90 rounded-2xl p-4 sm:p-5 border border-stone-700/60 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    Filar 4: Ochrona
                  </div>
                  <h4 className="text-base font-bold text-white">Oprysk profilaktyczny</h4>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                  spraying.isGoodDay
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                {spraying.isGoodDay ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{spraying.isGoodDay ? 'Dobry dzień na oprysk' : 'Zły moment na oprysk'}</span>
              </div>
            </div>

            <h5 className="text-sm font-semibold text-stone-100 mt-2">{spraying.title}</h5>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">{spraying.advice}</p>

            {spraying.recommendedOrganicSolution && (
              <div className="mt-3 text-xs text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="text-purple-400 font-bold block mb-0.5 text-[11px] uppercase tracking-wider">
                  Receptura ekologiczna:
                </span>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  {spraying.recommendedOrganicSolution}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-stone-400 flex items-center justify-between">
            <span>
              Wiatr na piętrze: <strong>{Math.round(weather?.balcony_advice?.adjusted_wind_at_floor ?? (weather?.wind_speed ?? 12))} km/h</strong>
            </span>
            <span>Wykonuj wieczorem po oblocie pszczół</span>
          </div>
        </div>
      </div>
    </div>
  );
};
