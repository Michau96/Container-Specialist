import React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Compass,
  Layers,
  Coins,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { SoilCrossSection } from './SoilCrossSection';
import { CropCostEstimatorCard } from './CropCostEstimatorCard';
import { POT_MATERIAL_OPTIONS } from '../lib/potSupportEvaluations';

interface PotResultStepProps {
  currentPlant: Plant;
  volumeLiters: number;
  heightCm: number;
  minPlantVol: number;
  recPlantVol: number;
  minDepth: number;
  spacingCm: number;
  plantingDepth: number;
  plantingMethod: string;
  requiredSupports: string;
  supports: SupportType;
  material: LegacyPotMaterial;
  potCount: number;
  sowingMethod: 'nasiona' | 'sadzonka';
  setSowingMethod: (m: 'nasiona' | 'sadzonka') => void;
  shape: PotShape;
  lengthCm: number;
  widthCm: number;
  rectHeightCm: number;
  diameterCm: number;
  roundHeightCm: number;
  capacityInfo: {
    recommendedCount: number;
    maxByGeometry: number;
    maxByVol: number;
    points: { x: number; y: number; label: string }[];
    dimensionText: string;
  };
  isDepthOk: boolean;
  isVolOk: boolean;
  activeSchemaView: 'top_layout' | 'soil_layers' | 'cost_estimates';
  setActiveSchemaView: (v: 'top_layout' | 'soil_layers' | 'cost_estimates') => void;
  onBackToConfig: () => void;
  onSelectPlant?: (plant: Plant) => void;
}

export const PotResultStep: React.FC<PotResultStepProps> = ({
  currentPlant,
  volumeLiters,
  heightCm,
  minPlantVol,
  recPlantVol,
  minDepth,
  spacingCm,
  plantingDepth,
  plantingMethod,
  requiredSupports,
  supports,
  material,
  potCount,
  sowingMethod,
  setSowingMethod,
  shape,
  lengthCm,
  widthCm,
  rectHeightCm,
  diameterCm,
  roundHeightCm,
  capacityInfo,
  isDepthOk,
  isVolOk,
  activeSchemaView,
  setActiveSchemaView,
  onBackToConfig,
  onSelectPlant,
}) => {
  const isPotSuitable = isVolOk && isDepthOk;
  const materialLabel = POT_MATERIAL_OPTIONS.find((o) => o.key === material)?.label || material;

  return (
    <div className="space-y-6">
      {/* Pasek nawigacyjny wyników z podsumowaniem i przyciskiem powrotu */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 gap-3">
        <button
          type="button"
          onClick={onBackToConfig}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition cursor-pointer self-start sm:self-center"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wróć do konfiguracji (Krok 1)</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
            🌱 {currentPlant.name}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
            📐 {capacityInfo.dimensionText} ({volumeLiters} L)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
            🏺 {materialLabel}
          </span>
        </div>
      </div>

      {/* BANER STATUSU DOPASOWANIA DONICY - STRICT SEMANTIC COLORING */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 shadow-xs transition-all ${
          isPotSuitable
            ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
            : 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
        }`}
      >
        {isPotSuitable ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 w-full">
          <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-between">
            <span>
              {isPotSuitable
                ? 'POTWIERDZONE: DONICA SPEŁNIA WYMAGANIA'
                : 'DONICA NIE SPEŁNIA WYMAGAŃ (ZA MAŁA)'}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isPotSuitable
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
                  : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100'
              }`}
            >
              {isPotSuitable ? 'Zalecana do uprawy' : 'Wymaga korekty'}
            </span>
          </div>

          <p className="text-xs leading-relaxed font-medium">
            Twoja donica ma <strong>{volumeLiters}L</strong> oraz głębokość <strong>{heightCm} cm</strong>.
            Dla <strong>{currentPlant.name}</strong> wymagana jest objętość min. {minPlantVol}L (zalecana {recPlantVol}L) oraz głębokość min. {minDepth} cm.
          </p>

          {isPotSuitable ? (
            <div className="pt-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              💡 Rekomendacja: W {potCount > 1 ? `${potCount} takich donicach` : 'tej donicy'} możesz posadzić łącznie{' '}
              <strong>
                {capacityInfo.recommendedCount * potCount}{' '}
                {capacityInfo.recommendedCount * potCount === 1
                  ? 'sztukę'
                  : capacityInfo.recommendedCount * potCount < 5
                  ? 'sztuki'
                  : 'sztuk'}
              </strong>{' '}
              w optymalnej rozstawie co <strong>{spacingCm} cm</strong>.
            </div>
          ) : (
            <div className="pt-2 text-xs font-semibold text-red-900 dark:text-red-200 space-y-1">
              <p>
                ⚠️ Pojemnik jest za mały dla tej rośliny – system korzeniowy ulegnie skarłowaceniu, a podłoże na balkonie będzie przesychać w ciągu kilku godzin.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onBackToConfig}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Kliknij tutaj, aby wrócić i zwiększyć wymiary donicy</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Przełącznik widoków: Szkic z góry (2D layout) vs Przekrój podłoża vs Koszty */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSchemaView('top_layout')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSchemaView === 'top_layout'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Szkic z góry (rozstawa)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSchemaView('soil_layers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSchemaView === 'soil_layers'
              ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Przekrój podłoża ({volumeLiters}L)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSchemaView('cost_estimates')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeSchemaView === 'cost_estimates'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Szacunek kosztów (PLN)</span>
        </button>
      </div>

      {/* Widok 1: Interaktywna zielona makieta 2D planu siewu z góry */}
      {activeSchemaView === 'top_layout' ? (
        <div className="bg-stone-50 dark:bg-stone-800/90 rounded-2xl p-4 sm:p-6 border border-stone-200 dark:border-stone-700 flex flex-col items-center space-y-4">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-2">
            <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <span>📐</span>
              <span>Zielona makieta rozmieszczenia ({capacityInfo.dimensionText})</span>
            </span>
            <span className="text-[11px] bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold self-start sm:self-auto">
              Zalecana rozstawa: <strong>{spacingCm} cm</strong>
            </span>
          </div>

          {/* Obszar rysunku SVG - Zielona makieta */}
          <div className="w-full max-w-xl bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-inner flex flex-col items-center">
            <svg
              viewBox="0 0 400 180"
              className="w-full h-48 drop-shadow-sm select-none"
              aria-label="Rzut z góry rozmieszczenia sadzonek w donicy"
            >
              {/* Tło i obrys donicy */}
              {shape === 'rectangular' ? (
                <g>
                  {/* Rant donicy */}
                  <rect
                    x="30"
                    y="30"
                    width="340"
                    height="100"
                    rx="14"
                    fill="#f7f5f0"
                    stroke={
                      material === 'terracotta'
                        ? '#c86d51'
                        : material === 'wood'
                        ? '#8b5a2b'
                        : material === 'fabric'
                        ? '#65a30d'
                        : '#44403c'
                    }
                    strokeWidth="8"
                  />
                  {/* Wnętrze ziemi */}
                  <rect
                    x="34"
                    y="34"
                    width="332"
                    height="92"
                    rx="10"
                    fill="#3d2817"
                  />

                  {/* Podpora na tylnej ściance jeśli wybrano kratkę */}
                  {supports === 'trellis' && (
                    <line
                      x1="34"
                      y1="36"
                      x2="366"
                      y2="36"
                      stroke="#0ea5e9"
                      strokeWidth="4"
                      strokeDasharray="6 4"
                    />
                  )}

                  {/* Linie wymiarowe L */}
                  <line x1="30" y1="150" x2="370" y2="150" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <line x1="30" y1="145" x2="30" y2="155" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <line x1="370" y1="145" x2="370" y2="155" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <text
                    x="200"
                    y="165"
                    textAnchor="middle"
                    fontSize="11"
                    fill="currentColor"
                    className="text-stone-700 dark:text-stone-200"
                    fontWeight="bold"
                  >
                    Długość: {lengthCm} cm
                  </text>

                  {/* Szerokość W */}
                  <line x1="15" y1="30" x2="15" y2="130" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <line x1="10" y1="30" x2="20" y2="30" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <line x1="10" y1="130" x2="20" y2="130" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <text
                    x="12"
                    y="85"
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    className="text-stone-700 dark:text-stone-200"
                    transform="rotate(-90 12 85)"
                  >
                    {widthCm} cm
                  </text>
                </g>
              ) : (
                <g>
                  {/* Donica okrągła */}
                  <ellipse
                    cx="200"
                    cy="80"
                    rx="100"
                    ry="60"
                    fill="#f7f5f0"
                    stroke={
                      material === 'terracotta'
                        ? '#c86d51'
                        : material === 'wood'
                        ? '#8b5a2b'
                        : material === 'fabric'
                        ? '#65a30d'
                        : '#44403c'
                    }
                    strokeWidth="8"
                  />
                  <ellipse
                    cx="200"
                    cy="80"
                    rx="94"
                    ry="54"
                    fill="#3d2817"
                  />

                  {/* Linia średnicy */}
                  <line x1="100" y1="150" x2="300" y2="150" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <line x1="100" y1="145" x2="100" y2="155" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <line x1="300" y1="145" x2="300" y2="155" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                  <text
                    x="200"
                    y="166"
                    textAnchor="middle"
                    fontSize="11"
                    fill="currentColor"
                    className="text-stone-700 dark:text-stone-200"
                    fontWeight="bold"
                  >
                    Średnica: ⌀ {diameterCm} cm
                  </text>
                </g>
              )}

              {/* Punkty sadzonek w donicy */}
              {capacityInfo.points.map((pt, idx) => {
                let cx = 0;
                let cy = 0;
                if (shape === 'rectangular') {
                  cx = 30 + (pt.x / 100) * 340;
                  cy = 30 + (pt.y / 100) * 100;
                } else {
                  cx = 200 + ((pt.x - 50) / 50) * 65;
                  cy = 80 + ((pt.y - 50) / 50) * 35;
                }

                return (
                  <g key={idx}>
                    {/* Cień sadzonki */}
                    <circle cx={cx} cy={cy + 2} r="14" fill="#1b120c" opacity="0.6" />
                    {/* Koronka / rozeta zielonej rośliny */}
                    <circle cx={cx} cy={cy} r="13" fill="#2e7d32" stroke="#81c784" strokeWidth="2.5" />
                    {/* Ikona podpory (palik bambusowy) */}
                    {supports === 'stake' && (
                      <circle cx={cx + 10} cy={cy - 8} r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                    )}
                    {/* Numer rośliny */}
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#ffffff"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legenda pod szkicem */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-600 dark:text-stone-400 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-[#2e7d32] border border-green-300 inline-block" />
                <span>
                  {currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? 'Gniazdo siewu (2–3 nasiona)'
                    : 'Punkt siewu / sadzonka'}
                </span>
              </div>
              {currentPlant.spacing_guide?.requires_bamboo_stake && (
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-800 inline-block" />
                  <span className="font-semibold text-amber-800 dark:text-amber-300">
                    🎋 Palik bambusowy (niezbędny)
                  </span>
                </div>
              )}
              {supports === 'trellis' && (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-1 bg-sky-500 inline-block" />
                  <span>Kratka na tylnej ściance</span>
                </div>
              )}
            </div>
          </div>

          {/* Instrukcja agrotechniczna dla wybranej rośliny */}
          <div className="w-full bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-3">
            <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200 pb-2 border-b border-stone-100 dark:border-stone-800">
              <span>Instrukcja agrotechniczna: {currentPlant.name}</span>
              <span className="text-stone-600 dark:text-stone-300 font-semibold">
                Głębokość siewu: {plantingDepth > 0 ? `${plantingDepth} cm` : 'powierzchniowo'}
              </span>
            </div>

            {/* Siew gniazdowy / pojedynczy / rzutowy */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-[11px] flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                  <span>🌱</span>
                  <span>Metoda siewu w schemacie:</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                  }`}
                >
                  {currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? 'Siew gniazdowy (gniazdowo)'
                    : currentPlant.spacing_guide?.sowing_type === 'pojedynczo'
                    ? 'Siew pojedynczy (pojedynczo)'
                    : currentPlant.spacing_guide?.sowing_type === 'rzutowo'
                    ? 'Siew rzutowy (na gęsto)'
                    : currentPlant.spacing_guide?.sowing_type === 'grzybnia'
                    ? 'Zaszczepienie grzybnią'
                    : 'Sadzenie pojedynczej rozsady'}
                </span>
              </div>

              <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                  ? '👉 Siać GNIAZDOWO: w każdym punkcie siewu umieszczaj po 2–3 nasiona w jednym dołku. Po wykiełkowaniu wykonaj selekcję (przerywkę), zostawiając 1 najsilniejszą siewkę.'
                  : currentPlant.spacing_guide?.sowing_type === 'pojedynczo'
                  ? '👉 Siać POJEDYNCZO: wysiewaj punktowo po 1 nasionku (lub sadź 1 sadzonkę) w każdym wyznaczonym punkcie bez potrzeby późniejszej przerywki.'
                  : currentPlant.spacing_guide?.sowing_type_details || plantingMethod}
              </p>
            </div>

            {/* Palik bambusowy */}
            {currentPlant.spacing_guide?.requires_bamboo_stake && (
              <div className="p-3 rounded-xl border bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200">
                <div className="font-bold text-[11px] flex items-center justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                    <span>🎋</span>
                    <span>Palik bambusowy:</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded border border-amber-400 dark:border-amber-700">
                    Niezbędny do uprawy
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed font-medium">
                  {currentPlant.spacing_guide?.bamboo_stake_desc ||
                    'Wbij palik bambusowy w dno donicy już na etapie sadzenia/siewu, aby nie uszkodzić korzeni. Pędy podwiązuj elastycznym sznurkiem w ósemkę.'}
                </p>
              </div>
            )}

            <div className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
              <strong>Zalecana podpora:</strong> {requiredSupports}.
            </div>
          </div>
        </div>
      ) : activeSchemaView === 'soil_layers' ? (
        /* Widok 2: Schemat warstw podłoża w tej donicy */
        <SoilCrossSection
          soilLayers={currentPlant.soil_layers}
          potHeightCm={heightCm}
          potVolumeLiters={volumeLiters}
          plant={currentPlant}
        />
      ) : (
        /* Widok 3: Pełny szacunek kosztów uprawy */
        <CropCostEstimatorCard
          plant={currentPlant}
          sowingMethod={sowingMethod}
          potVolumeLiters={volumeLiters}
          potMaterial={material}
          potCount={potCount}
          supportType={supports}
          onSowingMethodChange={setSowingMethod}
        />
      )}

      {/* Kompaktowe podsumowanie kosztów, gdy aktywny jest szkic lub warstwy podłoża */}
      {activeSchemaView !== 'cost_estimates' && (
        <CropCostEstimatorCard
          plant={currentPlant}
          sowingMethod={sowingMethod}
          potVolumeLiters={volumeLiters}
          potMaterial={material}
          potCount={potCount}
          supportType={supports}
          isCompact={true}
          onSowingMethodChange={setSowingMethod}
        />
      )}

      {/* Dolne przyciski nawigacyjne */}
      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToConfig}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Zmień parametry donicy (Krok 1)</span>
        </button>

        {onSelectPlant && (
          <button
            type="button"
            onClick={() => onSelectPlant(currentPlant)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Zobacz profil rośliny: {currentPlant.name}</span>
          </button>
        )}
      </div>
    </div>
  );
};
