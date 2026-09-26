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
import { useLanguage } from '../lib/LanguageContext';

interface Props {
  recommendation: DailyCropsRecommendation;
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  cropsCount: number;
  layout?: 'horizontal' | 'vertical';
}

export const DailyRecommendationCard: React.FC<Props> = ({
  recommendation,
  weather,
  userSpec,
  cropsCount,
  layout = 'horizontal',
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  const { watering, fertilizing, pruning, spraying, specialAlerts } = recommendation;

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950 text-emerald-50 rounded-[2rem] p-5 sm:p-7 shadow-lg border border-emerald-800/80 shadow-emerald-900/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-emerald-800/50">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isEn ? 'Daily Balcony Assistant • Today\'s Recommendations' : 'Codzienny asystent balkonu • Dzisiejsze rekomendacje'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{isEn ? 'What to keep in mind today for your crops?' : 'O czym pamiętać dzisiaj w Twoich uprawach?'}</span>
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            {isEn
              ? `Personalized care advice calculated from live local weather, conditions on your ${userSpec.floor}th floor, and ${cropsCount} plants in your crops.`
              : `Spersonalizowane zalecenia pielęgnacyjne przeliczone na podstawie aktualnej pogody w regionie, warunków na Twoim ${userSpec.floor}. piętrze oraz ${cropsCount} roślin w Twoich uprawach.`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-700/60 text-xs text-emerald-200">
          <Clock className="w-3.5 h-3.5 text-emerald-300" />
          <span>{isEn ? `Refreshed: today ${recommendation.lastUpdated}` : `Odświeżono: dzisiaj ${recommendation.lastUpdated}`}</span>
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
      <div className={layout === 'vertical' ? "flex flex-col gap-4 mt-5" : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-5"}>
        {/* 1. Podlewanie */}
        <div
          id="daily-rec-watering"
          className="bg-emerald-900/40 hover:bg-emerald-900/70 rounded-[1.5rem] p-4 sm:p-5 border border-emerald-800/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800/50">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
                    {isEn ? 'Pillar 1: Irrigation' : 'Filar 1: Nawadnianie'}
                  </div>
                  <h4 className="text-base font-bold text-white">{isEn ? 'Pot watering' : 'Podlewanie donic'}</h4>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                  watering.isGoodDay
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                    : watering.status === 'wstrzymaj'
                    ? 'bg-amber-950 text-amber-300 border-amber-700/60'
                    : 'bg-stone-800 text-emerald-200 border-stone-700'
                }`}
              >
                {watering.isGoodDay ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>
                  {watering.status === 'obfite'
                    ? (isEn ? 'Water thoroughly' : 'Podlej obficie')
                    : watering.status === 'wstrzymaj'
                    ? (isEn ? 'Hold watering' : 'Wstrzymaj się')
                    : (isEn ? 'Water after check' : 'Podlej po teście')}
                </span>
              </div>
            </div>

            <h5 className="text-sm font-semibold text-white mt-2">{watering.title}</h5>
            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{watering.advice}</p>

            {watering.specifics.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-emerald-200 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                {watering.specifics.map((spec, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-200">
                    <span className="text-sky-400 font-bold">•</span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>
              {isEn ? 'Current humidity:' : 'Aktualna wilgotność:'} <strong>{weather?.humidity ?? 60}%</strong>
            </span>
            <span>
              {isEn ? 'Rainfall:' : 'Opady:'} <strong>{weather?.precipitation ?? 0} mm</strong>
            </span>
          </div>
        </div>

        {/* 2. Nawożenie */}
        <div
          id="daily-rec-fertilizing"
          className="bg-emerald-900/40 hover:bg-emerald-900/70 rounded-[1.5rem] p-4 sm:p-5 border border-emerald-800/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {isEn ? 'Pillar 2: Feeding' : 'Filar 2: Zasilanie'}
                  </div>
                  <h4 className="text-base font-bold text-white">{isEn ? 'Fertilization' : 'Nawożenie podłoża'}</h4>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                  fertilizing.isGoodDay
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                    : 'bg-stone-800 text-emerald-200 border-stone-700'
                }`}
              >
                {fertilizing.isGoodDay ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-emerald-300" />
                )}
                <span>{fertilizing.isGoodDay ? (isEn ? 'Good day to feed' : 'Dobry dzień na nawóz') : (isEn ? 'Skip today' : 'Pomiń dzisiaj')}</span>
              </div>
            </div>

            <h5 className="text-sm font-semibold text-white mt-2">{fertilizing.title}</h5>
            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{fertilizing.advice}</p>

            <div className="mt-3 text-xs text-emerald-200 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
              <span className="text-amber-400 font-bold block mb-0.5 text-[11px] uppercase tracking-wider">
                {isEn ? 'Dosage tip:' : 'Wskazówka dawkowania:'}
              </span>
              <p className="text-[11px] text-emerald-200 leading-relaxed">{fertilizing.dosageTip}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>
              {isEn ? 'Temperature:' : 'Temperatura:'} <strong>{weather?.temperature ?? 19}°C</strong>
            </span>
            <span>{isEn ? 'Rule: moist soil before fertilizer' : 'Reguła: wilgotna bryła przed nawozem'}</span>
          </div>
        </div>

        {/* 3. Przycinanie */}
        <div
          id="daily-rec-pruning"
          className="bg-emerald-900/40 hover:bg-emerald-900/70 rounded-[1.5rem] p-4 sm:p-5 border border-emerald-800/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/50">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                    {isEn ? 'Pillar 3: Pruning' : 'Filar 3: Formowanie'}
                  </div>
                  <h4 className="text-base font-bold text-white">{isEn ? 'Pruning & pinching' : 'Przycinanie i uszczykiwanie'}</h4>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/50">
                {isEn
                  ? `${pruning.plantTasks.length} ${pruning.plantTasks.length === 1 ? 'task' : 'tasks'}`
                  : `${pruning.plantTasks.length} ${pruning.plantTasks.length === 1 ? 'zadanie' : 'zadania'}`}
              </span>
            </div>

            <h5 className="text-sm font-semibold text-white mt-2">{pruning.title}</h5>
            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{pruning.advice}</p>

            <div className="mt-3 space-y-1.5">
              {pruning.plantTasks.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-stone-900/70 p-2.5 rounded-xl border border-stone-800 text-xs flex items-start gap-2"
                >
                  <span className="text-base shrink-0">{t.icon}</span>
                  <div>
                    <strong className="text-stone-200 block text-[11px]">{t.plantName}:</strong>
                    <span className="text-emerald-200 text-[11px] leading-relaxed">{t.task}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-emerald-300">
            {isEn ? 'Tool: use sanitized blade or clean shears' : 'Narzędzie: używaj zdezynfekowanego nożyka lub ostrych nożyczek'}
          </div>
        </div>

        {/* 4. Opryski i ochrona */}
        <div
          id="daily-rec-spraying"
          className="bg-emerald-900/40 hover:bg-emerald-900/70 rounded-[1.5rem] p-4 sm:p-5 border border-emerald-800/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-950/80 text-purple-400 border border-purple-800/50">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">
                    {isEn ? 'Pillar 4: Protection' : 'Filar 4: Ochrona'}
                  </div>
                  <h4 className="text-base font-bold text-white">{isEn ? 'Preventive spraying' : 'Oprysk profilaktyczny'}</h4>
                </div>
              </div>

              {/* Status Badge */}
              <div
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                  spraying.isGoodDay
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                    : 'bg-stone-800 text-emerald-200 border-stone-700'
                }`}
              >
                {spraying.isGoodDay ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{spraying.isGoodDay ? (isEn ? 'Good day for spray' : 'Dobry dzień na oprysk') : (isEn ? 'Poor time for spray' : 'Zły moment na oprysk')}</span>
              </div>
            </div>

            <h5 className="text-sm font-semibold text-white mt-2">{spraying.title}</h5>
            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{spraying.advice}</p>

            {spraying.recommendedOrganicSolution && (
              <div className="mt-3 text-xs text-emerald-200 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                <span className="text-purple-400 font-bold block mb-0.5 text-[11px] uppercase tracking-wider">
                  {isEn ? 'Organic recipe:' : 'Receptura ekologiczna:'}
                </span>
                <p className="text-[11px] text-emerald-200 leading-relaxed">
                  {spraying.recommendedOrganicSolution}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-700/40 text-[11px] text-emerald-300 flex items-center justify-between">
            <span>
              {isEn ? 'Floor wind:' : 'Wiatr na piętrze:'} <strong>{Math.round(weather?.balcony_advice?.adjusted_wind_at_floor ?? (weather?.wind_speed ?? 12))} km/h</strong>
            </span>
            <span>{isEn ? 'Apply in the evening after bees return' : 'Wykonuj wieczorem po oblocie pszczół'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
