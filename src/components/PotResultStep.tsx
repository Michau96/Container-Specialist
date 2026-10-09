import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Scale,
  Package,
  Weight,
  ShieldCheck,
  Info,
  ChevronDown,
  Layers,
  Coins,
  ArrowLeft,
} from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { SoilCrossSection } from './SoilCrossSection';
import { CropCostEstimatorCard } from './CropCostEstimatorCard';
import { POT_MATERIAL_OPTIONS } from '../lib/potSupportEvaluations';
import {
  PotCalculationResult,
  calculatePotFullSpecs,
} from '../lib/potCalculations';
import { useLanguage } from '../lib/LanguageContext';

export interface PotResultStepProps {
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
  activeSchemaView?: 'top_layout' | 'soil_layers' | 'cost_estimates' | 'technical_load';
  setActiveSchemaView?: (v: 'top_layout' | 'soil_layers' | 'cost_estimates' | 'technical_load') => void;
  calculationResult?: PotCalculationResult;
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
  calculationResult,
  onBackToConfig,
  onSelectPlant,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Dostępne akordeony dla sekcji drugorzędnych (Wymaganie 3)
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isCostsOpen, setIsCostsOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false);

  const calc: PotCalculationResult = calculationResult || calculatePotFullSpecs({
    shape,
    material,
    length: shape === 'rectangular' ? lengthCm : undefined,
    width: shape === 'rectangular' ? widthCm : undefined,
    height: heightCm,
    diameter: shape === 'round' ? diameterCm : undefined,
    potCount,
  });

  const isPotSuitable = isVolOk && isDepthOk;
  const getMaterialLabel = (key: LegacyPotMaterial) => {
    if (isEn) {
      switch (key) {
        case 'plastic':
          return 'Plastic / Synthetic';
        case 'terracotta':
          return 'Terracotta / Ceramic';
        case 'wood':
          return 'Natural wood';
        case 'fabric':
          return 'Fabric / Smart Pot';
        case 'ceramic':
          return 'Glazed ceramic';
        default:
          return key;
      }
    }
    return POT_MATERIAL_OPTIONS.find((o) => o.key === key)?.label || key;
  };
  const materialLabel = getMaterialLabel(material);

  const totalPlants = capacityInfo.recommendedCount * potCount;
  const plantsUnitText = isEn
    ? totalPlants === 1
      ? 'plant'
      : 'plants'
    : totalPlants === 1
    ? 'sztukę'
    : totalPlants < 5
    ? 'sztuki'
    : 'sztuk';

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
          <span>{isEn ? 'Back to Config' : 'Wróć do konfiguracji'}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
            🌱 {currentPlant.name}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
            📐 {capacityInfo.dimensionText} ({calc.formatted.volumeGrossText})
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
            🏺 {materialLabel}
          </span>
          <span
            className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-bold text-[10px]"
            title="Wersja algorytmu obliczeń parametrów donicy"
          >
            v{calc.version}
          </span>
        </div>
      </div>

      {/* BANER STATUSU DOPASOWANIA DONICY - ZAWSZE WIDOCZNY, NIEZWINIĘTY (WYMAGANIE 7) */}
      <div
        role="alert"
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
                ? (isEn ? 'CONFIRMED: CONTAINER MEETS REQUIREMENTS' : 'POTWIERDZONE: DONICA SPEŁNIA WYMAGANIA')
                : (isEn ? 'CONTAINER DOES NOT MEET REQUIREMENTS (TOO SMALL)' : 'DONICA NIE SPEŁNIA WYMAGAŃ (ZA MAŁA)')}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold border ${
                isPotSuitable
                  ? 'bg-emerald-100 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100'
                  : 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100'
              }`}
            >
              {isPotSuitable ? (isEn ? 'Recommended for cultivation' : 'Zalecana do uprawy') : (isEn ? 'Adjustment required' : 'Wymaga korekty')}
            </span>
          </div>

          <p className="text-xs leading-relaxed font-medium">
            {isEn
              ? `Your pot has ${calc.formatted.volumeGrossText} volume and ${heightCm} cm depth. For ${currentPlant.name}, min. ${minPlantVol} l (rec. ${recPlantVol} l) volume and min. ${minDepth} cm depth are required.`
              : `Twoja donica ma ${calc.formatted.volumeGrossText} oraz głębokość ${heightCm} cm. Dla ${currentPlant.name} wymagana jest objętość min. ${minPlantVol} l (zalecana ${recPlantVol} l) oraz głębokość min. ${minDepth} cm.`}
          </p>

          {isPotSuitable ? (
            <div className="pt-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
              {isEn ? (
                <>
                  💡 Recommendation: In {potCount > 1 ? `${potCount} such containers` : 'this container'}, you can plant a total of{' '}
                  <strong>{totalPlants} {plantsUnitText}</strong> with optimal spacing of <strong>{spacingCm} cm</strong>.
                </>
              ) : (
                <>
                  💡 Rekomendacja: W {potCount > 1 ? `${potCount} takich donicach` : 'tej donicy'} możesz posadzić łącznie{' '}
                  <strong>{totalPlants} {plantsUnitText}</strong> w optymalnej rozstawie co <strong>{spacingCm} cm</strong>.
                </>
              )}
            </div>
          ) : (
            <div className="pt-2 text-xs font-semibold text-red-900 dark:text-red-200 space-y-1">
              <p>
                {isEn
                  ? '⚠️ Container is too small for this plant – root system will be stunted, and balcony soil will dry out within hours.'
                  : '⚠️ Pojemnik jest za mały dla tej rośliny – system korzeniowy ulegnie skarłowaceniu, a podłoże na balkonie będzie przesychać w ciągu kilku godzin.'}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onBackToConfig}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-800 dark:text-red-300 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Click here to return and increase pot dimensions' : 'Kliknij tutaj, aby wrócić i zwiększyć wymiary donicy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PROMINENT SUMMARY CARD (WYMAGANIE 4: rounded-2xl, border, shadow-sm) */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                {isEn ? 'Primary Results Summary & Balcony Load' : 'Parametry techniczne i obciążenie balkonu (PN-EN 1991-1-1)'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isEn
                  ? `Summary for ${currentPlant.name} • ${potCount > 1 ? `${potCount} containers` : '1 container'}`
                  : `Podsumowanie dla ${currentPlant.name} • ${potCount > 1 ? `${potCount} donic` : '1 donica'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[10px] text-stone-500 font-semibold">
              {isEn ? 'Formula engine: ' : 'Wersja algorytmu: '}
              <strong className="text-stone-700 dark:text-stone-300">v{calc.version}</strong>
            </span>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${
              calc.balconyLoad.safetyRating === 'safe'
                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                : calc.balconyLoad.safetyRating === 'caution'
                ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                : 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700'
            }`}>
              {calc.balconyLoad.safetyRating === 'safe'
                ? (isEn ? 'SAFE LOAD' : 'BEZPIECZNE')
                : calc.balconyLoad.safetyRating === 'caution'
                ? (isEn ? 'MODERATE LOAD' : 'UMIARKOWANE')
                : (isEn ? 'HIGH LOAD' : 'UWAGA: DUŻA WAGA')}
            </span>
          </div>
        </div>

        {/* 5 kluczowych pól z jednostkami przy każdym wyniku */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Objętość (Volume) */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {isEn ? 'Pot Volume' : 'Objętość donicy'}
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {calc.formatted.volumeGrossText}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {isEn ? `net usable: ${calc.formatted.volumeNetText}` : `użytkowa: ${calc.formatted.volumeNetText}`}
              </div>
            </div>
          </div>

          {/* 2. Zapotrzebowanie na podłoże (Substrate) */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {isEn ? 'Substrate Amount' : 'Ilość podłoża'}
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-300 tracking-tight">
                {calc.formatted.soilVolumeText}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {isEn ? `+ ${calc.formatted.drainageVolumeText} drainage` : `+ ${calc.formatted.drainageVolumeText} drenażu`}
              </div>
            </div>
          </div>

          {/* 3. Liczba worków (Bag Count) */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {isEn ? 'Substrate Bags' : 'Zakup worków'}
            </div>
            <div className="mt-1">
              <div className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {isEn ? calc.formatted.bagCountTextEn : calc.formatted.bagCountTextPl}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {isEn
                  ? `(or ${calc.bags.soilBags20L} bags × 20 l)`
                  : `(lub ${calc.bags.soilBags20L} worki po 20 l)`}
              </div>
            </div>
          </div>

          {/* 4. Masa (Mass) */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {isEn ? 'Saturated Wet Mass' : 'Waga po podlaniu'}
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {calc.formatted.wetMassText}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {isEn ? `dry: ${calc.formatted.dryMassText}` : `na sucho: ${calc.formatted.dryMassText}`}
              </div>
            </div>
          </div>

          {/* 5. Obciążenie balkonu (Balcony Load) */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
              {isEn ? 'Balcony Load' : 'Obciążenie balkonu'}
            </div>
            <div className="mt-1">
              <div className="text-base sm:text-lg font-black text-amber-800 dark:text-amber-300 tracking-tight">
                {calc.formatted.balconyLoadText}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                {isEn ? `footprint ${calc.formatted.footprintText}` : `podstawa ${calc.formatted.footprintText}`}
              </div>
            </div>
          </div>
        </div>

        {/* Podsumowanie rozstawy i pojemności */}
        <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <div className="font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <span>🌱</span>
            <span>
              {isEn ? 'Container Capacity:' : 'Pojemność donicy:'}{' '}
              <strong>{totalPlants} {plantsUnitText}</strong> {isEn ? `at ${spacingCm} cm spacing` : `w rozstawie co ${spacingCm} cm`}
            </span>
          </div>
          <div className="text-[11px] text-stone-600 dark:text-stone-400">
            {isEn ? `Dimensions: ${capacityInfo.dimensionText}` : `Wymiary: ${capacityInfo.dimensionText}`}
          </div>
        </div>
      </div>

      {/* GŁÓWNA ZIELONA MAKIETA 2D I INSTRUKCJA AGROTECHNICZNA (ZAWSZE WIDOCZNA W WYNIKACH) */}
      <div className="bg-stone-50 dark:bg-stone-800/90 rounded-2xl p-4 sm:p-6 border border-stone-200 dark:border-stone-700 flex flex-col items-center space-y-4">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-2">
          <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <span>📐</span>
            <span>{isEn ? `2D Spacing Mockup (${capacityInfo.dimensionText})` : `Zielona makieta rozmieszczenia (${capacityInfo.dimensionText})`}</span>
          </span>
          <span className="text-[11px] bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold self-start sm:self-auto">
            {isEn ? 'Recommended spacing:' : 'Zalecana rozstawa:'} <strong>{spacingCm} cm</strong>
          </span>
        </div>

        {/* Obszar rysunku SVG - Zielona makieta */}
        <div className="w-full max-w-xl bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-inner flex flex-col items-center">
          <svg
            viewBox="0 0 400 180"
            className="w-full h-48 drop-shadow-sm select-none"
            aria-label={isEn ? 'Top view of crop arrangement in pot' : 'Rzut z góry rozmieszczenia sadzonek w donicy'}
          >
            {/* Tło i obrys donicy */}
            {shape === 'rectangular' ? (
              <g>
                <rect
                  x="30"
                  y="30"
                  width="340"
                  height="100"
                  rx="14"
                  fill="#78350f"
                  opacity="0.15"
                />
                <rect
                  x="30"
                  y="30"
                  width="340"
                  height="100"
                  rx="14"
                  fill="none"
                  stroke="#854d0e"
                  strokeWidth="3.5"
                />
                <line x1="30" y1="145" x2="370" y2="145" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                <line x1="30" y1="140" x2="30" y2="150" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                <line x1="370" y1="140" x2="370" y2="150" stroke="currentColor" className="text-stone-400 dark:text-stone-400" strokeWidth="1.5" />
                <text
                  x="200"
                  y="162"
                  textAnchor="middle"
                  fontSize="11"
                  fill="currentColor"
                  className="text-stone-700 dark:text-stone-200"
                  fontWeight="bold"
                >
                  {isEn ? `Length: ${lengthCm} cm` : `Długość: ${lengthCm} cm`}
                </text>
              </g>
            ) : (
              <g>
                <ellipse cx="200" cy="80" rx="100" ry="50" fill="#78350f" opacity="0.15" />
                <ellipse cx="200" cy="80" rx="100" ry="50" fill="none" stroke="#854d0e" strokeWidth="3.5" />
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
                  {isEn ? `Diameter: ⌀ ${diameterCm} cm` : `Średnica: ⌀ ${diameterCm} cm`}
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
                  <circle cx={cx} cy={cy + 2} r="14" fill="#1b120c" opacity="0.6" />
                  <circle cx={cx} cy={cy} r="13" fill="#2e7d32" stroke="#81c784" strokeWidth="2.5" />
                  {supports === 'stake' && (
                    <circle cx={cx + 10} cy={cy - 8} r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                  )}
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
                  ? (isEn ? 'Sowing cluster (2–3 seeds)' : 'Gniazdo siewu (2–3 nasiona)')
                  : (isEn ? 'Planting point / seedling' : 'Punkt siewu / sadzonka')}
              </span>
            </div>
            {currentPlant.spacing_guide?.requires_bamboo_stake && (
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-800 inline-block" />
                <span className="font-semibold text-amber-800 dark:text-amber-300">
                  🎋 {isEn ? 'Bamboo stake (essential)' : 'Palik bambusowy (niezbędny)'}
                </span>
              </div>
            )}
            {supports === 'trellis' && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-1 bg-sky-500 inline-block" />
                <span>{isEn ? 'Back wall trellis' : 'Kratka na tylnej ściance'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instrukcja agrotechniczna dla wybranej rośliny */}
        <div className="w-full bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs space-y-3">
          <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200 pb-2 border-b border-stone-100 dark:border-stone-800">
            <span>{isEn ? `Growing Guide: ${currentPlant.name}` : `Instrukcja agrotechniczna: ${currentPlant.name}`}</span>
            <span className="text-stone-600 dark:text-stone-300 font-semibold">
              {isEn
                ? `Sowing depth: ${plantingDepth > 0 ? `${plantingDepth} cm` : 'surface'}`
                : `Głębokość siewu: ${plantingDepth > 0 ? `${plantingDepth} cm` : 'powierzchniowo'}`}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="font-bold text-[11px] flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                <span>🌱</span>
                <span>{isEn ? 'Sowing method in layout:' : 'Metoda siewu w schemacie:'}</span>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {isEn
                  ? currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? 'Cluster sowing (cluster)'
                    : currentPlant.spacing_guide?.sowing_type === 'pojedynczo'
                    ? 'Single seed sowing'
                    : currentPlant.spacing_guide?.sowing_type === 'rzutowo'
                    ? 'Broadcast sowing'
                    : currentPlant.spacing_guide?.sowing_type === 'grzybnia'
                    ? 'Mycelium inoculation'
                    : 'Single seedling planting'
                  : currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
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
              {isEn
                ? currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                  ? '👉 SOW IN CLUSTERS: place 2–3 seeds in each hole. After sprouting, thin out to leave the 1 strongest seedling.'
                  : currentPlant.spacing_guide?.sowing_type === 'pojedynczo'
                  ? '👉 SOW INDIVIDUALLY: place 1 seed (or plant 1 seedling) at each designated point without subsequent thinning.'
                  : currentPlant.spacing_guide?.sowing_type_details || plantingMethod
                : currentPlant.spacing_guide?.sowing_type === 'gniazdowo'
                ? '👉 Siać GNIAZDOWO: w każdym punkcie siewu umieszczaj po 2–3 nasiona w jednym dołku. Po wykiełkowaniu wykonaj selekcję (przerywkę), zostawiając 1 najsilniejszą siewkę.'
                : currentPlant.spacing_guide?.sowing_type === 'pojedynczo'
                ? '👉 Siać POJEDYNCZO: wysiewaj punktowo po 1 nasionku (lub sadź 1 sadzonkę) w każdym wyznaczonym punkcie bez potrzeby późniejszej przerywki.'
                : currentPlant.spacing_guide?.sowing_type_details || plantingMethod}
            </p>
          </div>

          {currentPlant.spacing_guide?.requires_bamboo_stake && (
            <div className="p-3 rounded-xl border bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200">
              <div className="font-bold text-[11px] flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                  <span>🎋</span>
                  <span>{isEn ? 'Bamboo Stake:' : 'Palik bambusowy:'}</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-2 py-0.5 rounded border border-amber-400 dark:border-amber-700">
                  {isEn ? 'Essential for growth' : 'Niezbędny do uprawy'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed font-medium">
                {isEn
                  ? 'Insert a bamboo stake into the bottom of the pot at planting time to avoid damaging root system. Tie shoots with soft garden twine in a figure-eight.'
                  : currentPlant.spacing_guide?.bamboo_stake_desc ||
                    'Wbij palik bambusowy w dno donicy już na etapie sadzenia/siewu, aby nie uszkodzić korzeni. Pędy podwiązuj elastycznym sznurkiem w ósemkę.'}
              </p>
            </div>
          )}

          <div className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
            <strong>{isEn ? 'Recommended support:' : 'Zalecana podpora:'}</strong> {requiredSupports}.
          </div>
        </div>
      </div>

      {/* SEKCJE DRUGORZĘDNE W DOSTĘPNYCH AKORDEONACH (WYMAGANIE 3) */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider px-1">
          {isEn ? 'Detailed Sections & Engineering Breakdowns:' : 'Szczegółowe analizy i kalkulacje (sekcje rozwijane):'}
        </div>

        {/* AKORDEON 1: WARSTWY PODŁOŻA */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          <button
            type="button"
            id="accordion-layers-header"
            aria-controls="accordion-layers-panel"
            aria-expanded={isLayersOpen}
            onClick={() => setIsLayersOpen(!isLayersOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {isEn ? `Soil Layers (${calc.formatted.volumeGrossText})` : `Przekrój podłoża (${calc.formatted.volumeGrossText})`}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn ? 'Detailed soil, drainage, and rim layers diagram' : 'Szczegółowy podział warstw: drenaż, ziemia i margines rantu'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline">
                {isLayersOpen ? (isEn ? 'Collapse' : 'Zwiń') : (isEn ? 'Expand' : 'Rozwiń')}
              </span>
              <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform duration-200 ${isLayersOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <div
            id="accordion-layers-panel"
            role="region"
            aria-labelledby="accordion-layers-header"
            className={`${isLayersOpen ? 'block' : 'hidden'} border-t border-stone-100 dark:border-stone-800 p-4 sm:p-6 bg-stone-50/50 dark:bg-stone-800/30`}
          >
            <SoilCrossSection
              soilLayers={currentPlant.soil_layers}
              potHeightCm={heightCm}
              potVolumeLiters={volumeLiters}
              plant={currentPlant}
            />
          </div>
        </div>

        {/* AKORDEON 2: SZACUNEK KOSZTÓW UPRAWY */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          <button
            type="button"
            id="accordion-costs-header"
            aria-controls="accordion-costs-panel"
            aria-expanded={isCostsOpen}
            onClick={() => setIsCostsOpen(!isCostsOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                <Coins className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {isEn ? 'Cost Estimates (PLN)' : 'Szacunek kosztów (PLN)'}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn ? 'Substrate bags, seeds/seedlings, fertilizer and supports cost breakdown' : 'Kalkulacja wydatków na ziemię, sadzonki/nasiona, keramzyt i podpory'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline">
                {isCostsOpen ? (isEn ? 'Collapse' : 'Zwiń') : (isEn ? 'Expand' : 'Rozwiń')}
              </span>
              <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform duration-200 ${isCostsOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <div
            id="accordion-costs-panel"
            role="region"
            aria-labelledby="accordion-costs-header"
            className={`${isCostsOpen ? 'block' : 'hidden'} border-t border-stone-100 dark:border-stone-800 p-4 sm:p-6 bg-stone-50/50 dark:bg-stone-800/30`}
          >
            <CropCostEstimatorCard
              plant={currentPlant}
              sowingMethod={sowingMethod}
              potVolumeLiters={volumeLiters}
              potMaterial={material}
              potCount={potCount}
              supportType={supports}
              onSowingMethodChange={setSowingMethod}
            />
          </div>
        </div>

        {/* AKORDEON 3: NOTATKI TECHNICZNE I OBCIĄŻENIE EUROKOD */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          <button
            type="button"
            id="accordion-tech-header"
            aria-controls="accordion-tech-panel"
            aria-expanded={isTechOpen}
            onClick={() => setIsTechOpen(!isTechOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-stone-50 dark:hover:bg-stone-800/50 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
          >
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                <Scale className="w-5 h-5" />
              </span>
              <div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {isEn ? 'Engineering Specs & Eurocode Load (PN-EN 1991-1-1)' : 'Inżynieryjna specyfikacja obciążenia i zakupu podłoża'}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn ? 'Normalized mm dimensions, bag breakdowns, tare vs wet mass, and balcony limits' : 'Wymiary znormalizowane w mm, waga tary, obciążenie posadzki i limity Eurokodu'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-stone-500 hidden sm:inline">
                {isTechOpen ? (isEn ? 'Collapse' : 'Zwiń') : (isEn ? 'Expand' : 'Rozwiń')}
              </span>
              <ChevronDown className={`w-5 h-5 text-stone-500 transition-transform duration-200 ${isTechOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          <div
            id="accordion-tech-panel"
            role="region"
            aria-labelledby="accordion-tech-header"
            className={`${isTechOpen ? 'block' : 'hidden'} border-t border-stone-100 dark:border-stone-800 p-4 sm:p-6 bg-stone-50/50 dark:bg-stone-800/30 space-y-5`}
          >
            {/* 4 karty analityczne ze ściśle przypisanymi jednostkami */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Karta 1: Kubatura i znormalizowane wymiary */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>📐</span>
                  <span>{isEn ? 'Dimensions & Normalized Geometry' : 'Geometria i wymiary znormalizowane'}</span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Container shape:' : 'Kształt donicy:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 capitalize">{shape}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Input dimensions:' : 'Wymiary w centymetrach:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{capacityInfo.dimensionText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Normalized (mm):' : 'Wymiary znormalizowane (mm):'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">
                      {calc.normalizedDimensions.lengthMm
                        ? `${calc.normalizedDimensions.lengthMm} mm × ${calc.normalizedDimensions.widthMm} mm × ${calc.normalizedDimensions.heightMm} mm`
                        : `⌀ ${calc.normalizedDimensions.diameterMm} mm × ${calc.normalizedDimensions.heightMm} mm`}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Gross geometric volume:' : 'Objętość geometryczna brutto:'}</span>
                    <span className="font-black text-stone-900 dark:text-stone-100">{calc.formatted.volumeGrossText}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{isEn ? 'Net usable volume (5% rim margin):' : 'Objętość użytkowa netto (z marginesem rantu):'}</span>
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">{calc.formatted.volumeNetText}</span>
                  </div>
                </div>
              </div>

              {/* Karta 2: Zakupy podłoża i worki */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>{isEn ? 'Substrate Breakdown & Shopping Bags' : 'Zapotrzebowanie na ziemię i worki'}</span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Potting soil volume:' : 'Ziemia warzywna (główna warstwa):'}</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{calc.formatted.soilVolumeText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Keramzite drainage volume:' : 'Drenaż keramzytowy (dno donicy):'}</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{calc.formatted.drainageVolumeText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Recommended soil bags:' : 'Zalecany zakup worków ziemi:'}</span>
                    <span className="font-black text-amber-700 dark:text-amber-400">
                      {isEn ? calc.formatted.bagCountTextEn : calc.formatted.bagCountTextPl}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'In 20 l bags equivalent:' : 'W workach po 20 l:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{calc.bags.soilBags20L} szt.</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{isEn ? 'Drainage keramzite (5 l bags):' : 'Keramzyt w workach po 5 l:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{calc.bags.drainageBags5L} szt.</span>
                  </div>
                </div>
              </div>

              {/* Karta 3: Masa i ciężar fizyczny */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Weight className="w-4 h-4 text-sky-600" />
                  <span>{isEn ? 'Container Mass & Physical Weight' : 'Masa donicy i ciężar po podlaniu'}</span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Container material:' : 'Materiał pojemnika:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{materialLabel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Empty container tare:' : 'Waga pustej donicy (tara):'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{calc.formatted.tareMassText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Dry setup mass:' : 'Masa zestawu przed podlaniem:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{calc.formatted.dryMassText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Saturated wet mass (after rain):' : 'Waga po podlaniu / nasyceniu deszczem:'}</span>
                    <span className="font-black text-stone-900 dark:text-stone-100">{calc.formatted.wetMassText}</span>
                  </div>
                  {potCount > 1 && (
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">{isEn ? `Total for ${potCount} containers:` : `Łącznie dla ${potCount} donic:`}</span>
                      <span className="font-bold text-sky-700 dark:text-sky-300">{calc.formatted.totalMassAllPotsText}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Karta 4: Obciążenie konstrukcyjne balkonu */}
              <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isEn ? 'Balcony Structural Safety & Load Limit' : 'Bezpieczeństwo konstrukcyjne balkonu'}</span>
                </div>
                <div className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Base footprint area:' : 'Powierzchnia podstawy donicy:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{calc.formatted.footprintText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Point load on floor:' : 'Nacisk punktowy na posadzkę:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{calc.formatted.wetMassText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Distributed load:' : 'Nacisk powierzchniowy:'}</span>
                    <span className="font-black text-amber-800 dark:text-amber-300">{calc.formatted.balconyLoadText}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-stone-500">{isEn ? 'Eurocode PN-EN standard limit:' : 'Polska norma użytkowa balkonów:'}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">250.0 kg/m²</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-stone-500">{isEn ? 'Structural status:' : 'Ocena bezpieczeństwa:'}</span>
                    <span className={`font-bold ${
                      calc.balconyLoad.safetyRating === 'safe'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : calc.balconyLoad.safetyRating === 'caution'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      {calc.balconyLoad.safetyRating === 'safe'
                        ? (isEn ? 'Safe (< 160 kg/m²)' : 'Bezpieczne (< 160 kg/m²)')
                        : calc.balconyLoad.safetyRating === 'caution'
                        ? (isEn ? 'Moderate (160–250 kg/m²)' : 'Umiarkowane (160–250 kg/m²)')
                        : (isEn ? 'High (> 250 kg/m²)' : 'Wysokie (> 250 kg/m²)')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200">
              <p className="leading-relaxed font-medium">
                💡 {isEn ? calc.balconyLoad.safetyMessageEn : calc.balconyLoad.safetyMessagePl}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dolne przyciski nawigacyjne */}
      <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToConfig}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-bold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isEn ? 'Change pot settings' : 'Zmień parametry donicy'}</span>
        </button>

        {onSelectPlant && (
          <button
            type="button"
            onClick={() => onSelectPlant(currentPlant)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEn ? `View plant profile: ${currentPlant.name}` : `Zobacz profil rośliny: ${currentPlant.name}`}</span>
          </button>
        )}
      </div>
    </div>
  );
};
