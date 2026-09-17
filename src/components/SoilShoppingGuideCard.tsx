import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { Plant } from '../types';
import { getSoilShoppingAdvice, SoilProducer } from '../lib/soilRecommendations';

interface Props {
  plant?: Plant | null;
  className?: string;
  isCompact?: boolean;
}

export const SoilShoppingGuideCard: React.FC<Props> = ({
  plant,
  className = '',
  isCompact = false,
}) => {
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [showAllProducers, setShowAllProducers] = useState<boolean>(!isCompact);
  const [showTips, setShowTips] = useState<boolean>(!isCompact);

  const advice = getSoilShoppingAdvice(plant);

  const copyToClipboard = (term: string) => {
    navigator.clipboard.writeText(term);
    setCopiedTerm(term);
    setTimeout(() => {
      setCopiedTerm(null);
    }, 2000);
  };

  const visibleProducers = showAllProducers
    ? advice.recommendedProducers
    : advice.recommendedProducers.slice(0, 3);

  return (
    <div
      id="soil-shopping-guide-card"
      className={`rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm overflow-hidden transition-all ${className}`}
    >
      {/* Nagłówek */}
      <div className="p-4 bg-gradient-to-r from-amber-700/10 via-emerald-700/5 to-transparent dark:from-amber-950/40 dark:via-emerald-950/20 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-800 dark:bg-amber-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
            <span>🌱</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Wybór i zakup ziemi – hasła i sprawdzeni producenci
              </h4>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
                pH {advice.idealPh}
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              Pod jakimi nazwami szukać podłoża w sklepach ogrodniczych i marketach
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 text-[11px] text-amber-950 dark:text-amber-200 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Najlepsze: BIO z perlitem i biohumusem</span>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs">
        {/* Sekcja 1: Hasła wyszukiwania w sklepach */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Sugerowane hasła do wyszukiwarki (kliknij, aby skopiować):</span>
            </span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              Sklepy ogrodnicze / markety / Allegro
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {advice.searchKeywords.map((kw, idx) => {
              const isCopied = copiedTerm === kw;
              const isPrimary = idx === 0;
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => copyToClipboard(kw)}
                  className={`group px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isPrimary
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-100 shadow-2xs hover:bg-amber-100'
                      : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-750 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                  title="Kliknij, aby skopiować frazę"
                >
                  <Tag className={`w-3 h-3 ${isPrimary ? 'text-amber-600' : 'text-stone-400'}`} />
                  <span>{kw}</span>
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                  ) : (
                    <Copy className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition shrink-0 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
            Główna rekomendacja: szukaj pod hasłem <strong>„{advice.primarySearchTerm}”</strong> z oznaczeniem BIO lub do pojemników/donic.
          </p>
        </div>

        {/* Sekcja 2: Sprawdzeni producenci z dobrymi opiniami */}
        <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Popularni producenci ziemi z wysokimi ocenami ogrodników:</span>
            </span>
            {advice.recommendedProducers.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllProducers(!showAllProducers)}
                className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                {showAllProducers ? (
                  <>
                    <span>Mniej</span>
                    <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    <span>Zobacz wszystkich ({advice.recommendedProducers.length})</span>
                    <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {visibleProducers.map((producer) => (
              <div
                key={producer.name}
                className="p-3 bg-stone-50 dark:bg-stone-850/70 border border-stone-200 dark:border-stone-800 rounded-xl space-y-1.5 hover:border-amber-300 dark:hover:border-amber-700 transition"
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">
                    {producer.name}
                  </div>
                  <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800 px-1.5 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                    Cena: {producer.priceLevel}
                  </span>
                </div>

                <div className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400">
                  {producer.badge}
                </div>

                <div className="text-[11px] text-stone-600 dark:text-stone-300 leading-snug">
                  {producer.whyGood}
                </div>

                <div className="pt-1 border-t border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block mb-0.5">
                    Polecane serie:
                  </span>
                  <ul className="text-[10px] text-stone-700 dark:text-stone-300 space-y-0.5 list-disc pl-3">
                    {producer.recommendedProducts.slice(0, 2).map((prod, pIdx) => (
                      <li key={pIdx}>{prod}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sekcja 3: Na co zwrócić uwagę na worku + Czego unikać (Rozwijane) */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={() => setShowTips(!showTips)}
            className="w-full py-1 text-left flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Na co zwrócić uwagę na etykiecie worka? (Porady agrotechniczne)</span>
            </span>
            {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTips && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2.5">
              {/* Wskazówki składu */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-1.5">
                <div className="font-bold text-[11px] text-emerald-900 dark:text-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Dobre cechy podłoża do donic:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-emerald-950 dark:text-emerald-200/90 leading-relaxed">
                  {advice.compositionTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                  <li>
                    <strong>pH: {advice.idealPh}</strong> – sprawdź odczyn na tylnej etykiecie.
                  </li>
                </ul>
              </div>

              {/* Czego unikać */}
              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-1.5">
                <div className="font-bold text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Czego unikać przy zakupie:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-amber-950 dark:text-amber-200/90 leading-relaxed">
                  {advice.whatToAvoid.map((avoid, idx) => (
                    <li key={idx}>{avoid}</li>
                  ))}
                  <li>
                    Worków leżących miesiącami na deszczu na paletach przed marketem (często są przemoczone, mają wypłukane składniki i pleśń).
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
