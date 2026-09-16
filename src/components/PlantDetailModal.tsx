import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  X,
  Maximize2,
  Layers,
  Sparkles,
  BookOpen,
  Sun,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Heart,
  ShieldCheck,
  Zap,
  Star,
  Ruler,
} from 'lucide-react';
import { Plant } from '../types';
import { SoilCrossSection } from './SoilCrossSection';
import { FertilizerAndSprayCard } from './FertilizerAndSprayCard';

interface Props {
  plant: Plant | null;
  onClose: () => void;
  onOpenPotCalc?: (plant: Plant) => void;
}

export const PlantDetailModal: React.FC<Props> = ({ plant, onClose, onOpenPotCalc }) => {
  if (!plant) return null;

  const suit = plant.suitability;
  const topVarieties = plant.top_varieties && plant.top_varieties.length > 0
    ? plant.top_varieties
    : plant.varieties.map((v) => ({
        name: v,
        badge: 'Polecana do pojemników',
        reason: 'Sprawdzona odmiana o kompaktowym pokroju dostosowana do uprawy balkonowej.',
      }));

  const cleanReasons = suit?.reasons.filter((r) => !r.includes('Idealna ekspozycja')) || [];

  return (
    <div
      id="plant-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="plant-detail-dialog"
        className="bg-[#FAF8F5] text-stone-900 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-emerald-950">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {plant.plant_group === 'ozdobne' && (
                <span className="text-xs font-bold text-purple-200 bg-purple-950/80 border border-purple-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>🌸</span> Roślina ozdobna
                </span>
              )}
              {plant.plant_group === 'owoce' && (
                <span className="text-xs font-bold text-rose-200 bg-rose-950/80 border border-rose-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>🍓</span> Owoc balkonowy
                </span>
              )}
              {plant.plant_group === 'ziola' && (
                <span className="text-xs font-bold text-teal-200 bg-teal-950/80 border border-teal-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>🌿</span> Zioło balkonowe
                </span>
              )}
              {plant.plant_group === 'warzywa' && (
                <span className="text-xs font-bold text-emerald-200 bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <span>🥕</span> Warzywo balkonowe
                </span>
              )}
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider bg-emerald-800/80 px-2.5 py-0.5 rounded-md">
                {plant.category}
              </span>
              {suit && (
                <span className="text-xs font-semibold bg-emerald-700/80 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {suit.score}% dopasowania do Twojego balkonu
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {plant.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1">
              Top 5 rekomendowanych odmian do donic:{' '}
              <strong className="text-white">{topVarieties.map((v) => v.name).join(', ')}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onOpenPotCalc && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPotCalc(plant);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl border border-emerald-700/70 transition cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Kalkulator Twojej donicy</span>
              </button>
            )}
            <button
              id="close-plant-modal-btn"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-2 rounded-xl hover:bg-emerald-800 transition cursor-pointer"
              aria-label="Zamknij okno"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Quick specs grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Pojemność donicy</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1">
                min. {plant.pot.min_volume_l}L
              </div>
              <div className="text-[11px] text-stone-500">głęb. {plant.pot.min_depth_cm} cm</div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>pH podłoża</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1">{plant.soil.ph}</div>
              <div className="text-[11px] text-stone-500">lekko kwaśne/obojętne</div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Nasłonecznienie</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1 truncate" title={plant.sun_preference}>
                {plant.orientations.join(', ')}
              </div>
              <div className="text-[11px] text-stone-500 truncate">{plant.sun_preference.split('(')[0]}</div>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
              <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-700" />
                <span>Trudność (1-10)</span>
              </div>
              <div className="text-sm font-bold text-stone-900 mt-1">{plant.difficulty} / 10</div>
              <div className="text-[11px] text-stone-500 truncate">{plant.difficulty <= 3 ? 'Dla początkujących' : 'Średnia'}</div>
            </div>
          </div>

          {/* Streszczenie uprawy */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2 mb-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              <span>Streszczenie uprawy w donicy</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">{plant.summary}</p>
          </div>

          {/* SCHEMAT PODŁOŻA W DONICY */}
          <div id="plant-soil-layers-section">
            <SoilCrossSection
              soilLayers={plant.soil_layers}
              potHeightCm={Math.max(25, plant.pot.min_depth_cm + 5)}
              potVolumeLiters={plant.pot.recommended_volume_l}
            />
          </div>

          {/* CZYM NAWOZIĆ I CZY STOSOWAĆ OPRYSK */}
          <div id="plant-fertilizer-spray-section">
            <FertilizerAndSprayCard
              fertilizerGuide={plant.fertilizer_guide}
              sprayGuide={plant.spray_guide}
              fallbackFertilizer={plant.soil.fertilizer}
            />
          </div>

          {/* ROZSTAWA, GŁĘBOKOŚĆ I PODPORY */}
          {plant.spacing_guide && (
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">Rozstawa, Siew i Podpory</h3>
                    <p className="text-[11px] text-stone-500">Zasady rozmieszczenia sadzonek w pojemnikach</p>
                  </div>
                </div>
                {onOpenPotCalc && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPotCalc(plant);
                    }}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 transition cursor-pointer"
                  >
                    Otwórz szkicownik donicy →
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                    Rozstawa między roślinami:
                  </span>
                  <span className="text-base font-bold text-stone-900">
                    co {plant.spacing_guide.spacing_cm} cm
                  </span>
                  <span className="text-[11px] text-stone-500 block mt-1">
                    Głębokość: <strong>{plant.spacing_guide.planting_depth_cm} cm</strong>
                  </span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                    Pojemność standardowych donic:
                  </span>
                  <span className="text-xs text-stone-800 block">
                    Skrzynka 60cm: <strong>max {plant.spacing_guide.max_plants_per_standard_box_60cm} szt.</strong>
                  </span>
                  <span className="text-xs text-stone-800 block mt-1">
                    Doniczka ⌀ 30cm: <strong>max {plant.spacing_guide.max_plants_per_round_pot_30cm} szt.</strong>
                  </span>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 uppercase block mb-1">
                    Wymagane podpory:
                  </span>
                  <span className="font-semibold text-stone-900 block leading-tight">
                    {plant.spacing_guide.supports_needed}
                  </span>
                </div>
              </div>

              <div className="mt-3 text-xs text-stone-600 bg-stone-50/70 p-3 rounded-xl border border-stone-200/80">
                <strong>Wskazówka sadzenia:</strong> {plant.spacing_guide.planting_method}
              </div>
            </div>
          )}

          {/* Analiza dopasowania do Twojego balkonu */}
          {suit && (
            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ocena warunków na Twoim balkonie ({suit.suitability_level})</span>
              </h3>

              {cleanReasons.length > 0 && (
                <div className="space-y-1.5">
                  {cleanReasons.map((r, i) => (
                    <div key={i} className="text-xs text-stone-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {suit.warnings.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-stone-100">
                  {suit.warnings.map((w, i) => (
                    <div key={i} className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl flex items-start gap-2 border border-amber-200">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {suit.tips.length > 0 && (
                <div className="space-y-1 pt-1">
                  {suit.tips.map((t, i) => (
                    <div key={i} className="text-xs text-emerald-800 italic flex items-center gap-1.5">
                      <span>💡 Porada: {t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SEKCJA: WARTOŚCI ODŻYWCZE, WITAMINY I MINERAŁY */}
          {plant.nutrition && (
            <div id="plant-nutrition-section" className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Wartości odżywcze, witaminy i wpływ na zdrowie
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Dlaczego warto zrywać prosto z krzaczka na balkonie
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  100% naturalne bio
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-700" />
                    <span>Główne Witaminy:</span>
                  </div>
                  <div className="text-xs font-semibold text-stone-900 leading-snug">
                    {plant.nutrition.vitamins}
                  </div>
                </div>

                <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3.5">
                  <div className="text-[11px] font-bold text-sky-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-700" />
                    <span>Minerały i Bio-składniki:</span>
                  </div>
                  <div className="text-xs font-semibold text-stone-900 leading-snug">
                    {plant.nutrition.minerals}
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5">
                <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>Działanie prozdrowotne:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {plant.nutrition.key_benefits}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {plant.nutrition.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold bg-white border border-stone-300 text-stone-800 px-2.5 py-0.5 rounded-full shadow-2xs"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOP 5 NAJLEPSZYCH ODMIAN NA BALKON */}
          <div id="top-5-varieties-section" className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Top 5 odmian, którymi warto się zainteresować
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Wyselekcjonowane odmiany genetycznie karłowe, o zwartym pokroju i wysokiej plenności w donicach
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                5 polecanych
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {topVarieties.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50/90 border border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-stone-200/80 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-stone-900">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                        <strong className="text-stone-700">Dlaczego warto: </strong>
                        {item.reason}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sekcja: Dokładny Opis Uprawy (Krok po kroku) - Markdown rendered */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <h3 className="text-sm font-bold text-stone-900">
                Dokładny przewodnik uprawy krok po kroku
              </h3>
            </div>
            <div className="markdown-body text-xs sm:text-[13px] leading-relaxed text-stone-700 font-sans">
              <ReactMarkdown
                components={{
                  h3: ({ children }) => (
                    <h4 className="text-xs sm:text-sm font-bold text-emerald-950 mt-4 mb-2 pb-1 border-b border-emerald-100/80 flex items-center gap-1.5">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 leading-relaxed text-stone-700">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 space-y-1.5 mb-3 text-stone-700">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-stone-950">
                      {children}
                    </strong>
                  ),
                }}
              >
                {plant.detailed_guide}
              </ReactMarkdown>
            </div>
          </div>

          {/* Sekcja: Zweryfikowane Źródła Portali Ogrodniczych */}
          <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200 text-xs text-stone-600">
            <span className="font-semibold text-stone-800 block mb-1">
              Zweryfikowane źródła wiedzy ogrodniczej (uprawa w donicach):
            </span>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-stone-500">
              {plant.sources.map((src, idx) => (
                <li key={idx}>{src}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onOpenPotCalc ? (
            <button
              onClick={() => {
                onClose();
                onOpenPotCalc(plant);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Ruler className="w-4 h-4" />
              <span>Dopasuj moją donicę i naszkicuj rozstawę</span>
            </button>
          ) : (
            <div />
          )}

          <button
            id="close-plant-detail-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Zamknij przewodnik
          </button>
        </div>
      </div>
    </div>
  );
};


