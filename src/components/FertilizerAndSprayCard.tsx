import React from 'react';
import { Droplet, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, FlaskConical } from 'lucide-react';
import { FertilizerGuideInfo, SprayGuideInfo } from '../types';

interface Props {
  fertilizerGuide?: FertilizerGuideInfo;
  sprayGuide?: SprayGuideInfo;
  fallbackFertilizer?: string;
}

export const FertilizerAndSprayCard: React.FC<Props> = ({
  fertilizerGuide,
  sprayGuide,
  fallbackFertilizer,
}) => {
  const fert = fertilizerGuide ?? {
    what: fallbackFertilizer ?? 'Nawóz płynny wieloskładnikowy lub biohumus',
    frequency: 'Co 10-14 dni w okresie intensywnego wzrostu',
    npk_focus: 'Zrównoważony NPK z mikroelementami',
    organic_options: ['Płynny biohumus dżdżownicowy', 'Kompost dosypany na wierzch'],
    warnings: 'Nawadniaj zawsze wilgotną ziemię, by nie przypalić korzeni.',
  };

  const spray = sprayGuide ?? {
    apply_sprays: 'w_razie_potrzeby' as const,
    apply_label: 'Interwencyjnie w razie wystąpienia szkodników',
    preventive: ['Wietrzenie i podlewanie pod korzeń bez zwilżania liści.'],
    intervention: ['Mydło potasowe z czosnkiem przeciw mszycom.'],
    safety_note: 'Pryskaj wyłącznie po zachodzie słońca.',
  };

  const isPreventive = spray.apply_sprays === 'tak_profilaktyka';
  const isNeededOnly = spray.apply_sprays === 'w_razie_potrzeby';
  const isRedundant = spray.apply_sprays === 'zbedne';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Karta: Czym nawozić */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-700 text-white flex items-center justify-center shrink-0">
                <Droplet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Czym i jak nawozić</h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Zalecane dawki i kompozycja NPK</p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded-md border border-stone-200 dark:border-stone-700">
              Zasilanie
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
              <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                Zalecany nawóz główny:
              </div>
              <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-medium">{fert.what}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-0.5">Częstotliwość</div>
                <div className="text-stone-800 dark:text-stone-200 font-semibold text-[11px] leading-tight">{fert.frequency}</div>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-0.5">Proporcja NPK</div>
                <div className="text-stone-800 dark:text-stone-200 font-semibold text-[11px] leading-tight">{fert.npk_focus}</div>
              </div>
            </div>

            {fert.organic_options && fert.organic_options.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ekologiczne warianty bez chemii:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {fert.organic_options.map((opt, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-lg"
                    >
                      🌱 {opt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {fert.warnings && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200 bg-amber-50/80 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong className="font-semibold">Zwróć uwagę:</strong> {fert.warnings}
            </span>
          </div>
        )}
      </div>

      {/* 2. Karta: Czy stosować oprysk */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white ${
                  isRedundant ? 'bg-emerald-700 dark:bg-emerald-800' : isPreventive ? 'bg-sky-700 dark:bg-sky-800' : 'bg-stone-700 dark:bg-stone-600'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Czy stosować oprysk?</h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">Ochrona profilaktyczna i interwencyjna</p>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                isRedundant
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                  : isPreventive
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-800'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
              }`}
            >
              {isRedundant ? 'Potwierdzone: zbędny' : isPreventive ? 'Profilaktyka' : 'W razie potrzeby'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Werdykt */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                isRedundant
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : isPreventive
                  ? 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-950 dark:text-sky-200'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-200'
              }`}
            >
              {isRedundant ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <FlaskConical className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider">Status ochrony:</div>
                <div className="font-semibold text-xs mt-0.5">{spray.apply_label}</div>
              </div>
            </div>

            {/* Działania profilaktyczne */}
            {spray.preventive && spray.preventive.length > 0 && (
              <div>
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200 mb-1">
                  🛡️ Naturalna profilaktyka (zapobieganie):
                </div>
                <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400 list-disc pl-4">
                  {spray.preventive.map((prev, i) => (
                    <li key={i} className="leading-snug">
                      {prev}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Działania interwencyjne */}
            {spray.intervention && spray.intervention.length > 0 && !isRedundant && (
              <div>
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200 mb-1">
                  ⚔️ Interwencja (gdy pojawią się szkodniki lub grzyb):
                </div>
                <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-400 list-disc pl-4">
                  {spray.intervention.map((interv, i) => (
                    <li key={i} className="leading-snug">
                      {interv}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {spray.safety_note && (
          <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-start gap-2 text-[11px] text-stone-500 dark:text-stone-400">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Zasada bezpieczeństwa:</span>
            <span>{spray.safety_note}</span>
          </div>
        )}
      </div>
    </div>
  );
};
