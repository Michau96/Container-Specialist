import React from 'react';
import {
  Box,
  Circle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { POT_MATERIAL_OPTIONS, POT_SUPPORT_OPTIONS } from '../lib/potSupportEvaluations';
import { useLanguage } from '../lib/LanguageContext';
export { PotConfigurationStep } from './PotConfigurationStep';
export type { PotConfigurationStepProps } from './PotConfigurationStep';

export interface PotConfigStepProps {
  availablePlants: Plant[];
  selectedPlantId: string;
  onSelectPlantId: (id: string) => void;
  currentPlant: Plant;
  shape: PotShape;
  setShape: (shape: PotShape) => void;
  lengthCm: number;
  setLengthCm: (v: number) => void;
  widthCm: number;
  setWidthCm: (v: number) => void;
  rectHeightCm: number;
  setRectHeightCm: (v: number) => void;
  diameterCm: number;
  setDiameterCm: (v: number) => void;
  roundHeightCm: number;
  setRoundHeightCm: (v: number) => void;
  volumeLiters: number;
  minPlantVol: number;
  recPlantVol: number;
  minDepth: number;
  material: LegacyPotMaterial;
  setMaterial: (m: LegacyPotMaterial) => void;
  materialEvaluation: any;
  supports: SupportType;
  setSupports: (s: SupportType) => void;
  supportEvaluation: any;
  potCount: number;
  setPotCount: (n: number) => void;
  sowingMethod: 'nasiona' | 'sadzonka';
  setSowingMethod: (m: 'nasiona' | 'sadzonka') => void;
  onApplyPreset: (preset: 'box60' | 'pot30' | 'large40' | 'bucket15') => void;
  onCalculate: () => void;
  activeStep?: 'configuration' | 'dimensions' | 'material' | 'all';
}

export const PotConfigStep: React.FC<PotConfigStepProps> = ({
  availablePlants,
  selectedPlantId,
  onSelectPlantId,
  currentPlant,
  shape,
  setShape,
  lengthCm,
  setLengthCm,
  widthCm,
  setWidthCm,
  rectHeightCm,
  setRectHeightCm,
  diameterCm,
  setDiameterCm,
  roundHeightCm,
  setRoundHeightCm,
  volumeLiters,
  minPlantVol,
  recPlantVol,
  minDepth,
  material,
  setMaterial,
  materialEvaluation,
  supports,
  setSupports,
  supportEvaluation,
  potCount,
  setPotCount,
  sowingMethod,
  setSowingMethod,
  onApplyPreset,
  onCalculate,
  activeStep = 'all',
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const getMaterialLabel = (key: LegacyPotMaterial) => {
    if (isEn) {
      switch (key) {
        case 'plastic':
          return 'Plastic / Synthetic';
        case 'terracotta':
          return 'Terracotta / Unglazed ceramic';
        case 'wood':
          return 'Natural wood';
        case 'fabric':
          return 'Geotextile / Fabric pot / Smart Pot';
        case 'ceramic':
          return 'Glazed ceramic';
        default:
          return key;
      }
    }
    return POT_MATERIAL_OPTIONS.find((o) => o.key === key)?.label || key;
  };

  const getSupportLabel = (key: SupportType) => {
    if (isEn) {
      switch (key) {
        case 'none':
          return 'No support';
        case 'stake':
          return 'Bamboo stake';
        case 'trellis':
          return 'Balcony trellis / Wall grid';
        case 'balcony_railing':
          return 'Balcony railing';
        case 'cage':
          return 'Plant cage / Spiral';
        default:
          return key;
      }
    }
    return POT_SUPPORT_OPTIONS.find((o) => o.key === key)?.label || key;
  };

  const currentHeightCm = shape === 'rectangular' ? rectHeightCm : roundHeightCm;
  const isDimensionsValid = volumeLiters >= minPlantVol && currentHeightCm >= minDepth;

  // --- SEKCJA 1: WYBÓR ROŚLINY ---
  const renderPlantSelection = () => (
    <div className="bg-stone-50 dark:bg-stone-800/90 p-4 sm:p-5 rounded-2xl border border-stone-300 dark:border-stone-700">
      <label
        htmlFor="pot-calc-plant-select"
        className="block text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-2"
      >
        {isEn ? '1. Select crop to grow:' : '1. Wybierz uprawianą roślinę:'}
      </label>
      <select
        id="pot-calc-plant-select"
        name="pot-calc-plant"
        data-testid="pot-calc-plant-select"
        value={selectedPlantId}
        onChange={(e) => onSelectPlantId(e.target.value)}
        className="w-full min-h-[44px] bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-400 focus:outline-none"
      >
        <optgroup label={isEn ? '🥕 Vegetables' : '🥕 Warzywa'}>
          {availablePlants
            .filter((p) => p.plant_group === 'warzywa')
            .map((p) => (
              <option key={p.id} value={p.id}>
                🥕 {p.name}
              </option>
            ))}
        </optgroup>
        <optgroup label={isEn ? '🍓 Fruit' : '🍓 Owoce'}>
          {availablePlants
            .filter((p) => p.plant_group === 'owoce')
            .map((p) => (
              <option key={p.id} value={p.id}>
                🍓 {p.name}
              </option>
            ))}
        </optgroup>
        <optgroup label={isEn ? '🌿 Herbs' : '🌿 Zioła'}>
          {availablePlants
            .filter((p) => p.plant_group === 'ziola')
            .map((p) => (
              <option key={p.id} value={p.id}>
                🌿 {p.name}
              </option>
            ))}
        </optgroup>
        <optgroup label={isEn ? '🌸 Flowers & Ornamentals' : '🌸 Rośliny ozdobne (kwiaty)'}>
          {availablePlants
            .filter((p) => p.plant_group === 'ozdobne')
            .map((p) => (
              <option key={p.id} value={p.id}>
                🌸 {p.name}
              </option>
            ))}
        </optgroup>
        <optgroup label={isEn ? '🌱 Microgreens & Sprouts' : '🌱 Mikrolistki i kiełki'}>
          {availablePlants
            .filter((p) => p.plant_group === 'kielki')
            .map((p) => (
              <option key={p.id} value={p.id}>
                🌱 {p.name}
              </option>
            ))}
        </optgroup>
        <optgroup label={isEn ? '🍄 Cultivated Mushrooms' : '🍄 Grzyby uprawne'}>
          {availablePlants
            .filter((p) => p.plant_group === 'grzyby')
            .map((p) => (
              <option key={p.id} value={p.id}>
                🍄 {p.name}
              </option>
            ))}
        </optgroup>
      </select>

      <div className="flex flex-wrap items-center justify-between text-xs text-stone-700 dark:text-stone-300 mt-2.5 pt-2.5 border-t border-stone-300 dark:border-stone-700 gap-1.5">
        <span className="font-medium">{isEn ? `Requirements for ${currentPlant.name}:` : `Wymagania dla ${currentPlant.name}:`}</span>
        <span className="font-bold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2.5 py-1 rounded-lg border border-stone-300 dark:border-stone-700">
          {isEn
            ? `min. ${minPlantVol}L (rec. ${recPlantVol}L) • depth min. ${minDepth} cm`
            : `min. ${minPlantVol}L (zalec. ${recPlantVol}L) • głębokość min. ${minDepth} cm`}
        </span>
      </div>
    </div>
  );

  // --- SEKCJA 2: KSZTAŁT I PRESETY DONICY ---
  const renderShapeAndPresets = () => (
    <div className="space-y-4">
      {/* 2. Kształt donicy */}
      <div>
        <label className="block text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-2">
          {isEn ? '2. Container Shape:' : '2. Kształt Twojej donicy:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="pot-calc-shape-rectangular"
            onClick={() => setShape('rectangular')}
            className={`min-h-[56px] p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              shape === 'rectangular'
                ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
                : 'border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-600 dark:hover:border-emerald-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <Box className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold">{isEn ? 'Rectangular' : 'Prostokątna'}</div>
                <div className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                  {isEn ? 'Window box, planter trough' : 'Skrzynka, korytko, rynna'}
                </div>
              </div>
            </div>
            {shape === 'rectangular' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            )}
          </button>

          <button
            type="button"
            id="pot-calc-shape-round"
            onClick={() => setShape('round')}
            className={`min-h-[56px] p-3.5 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              shape === 'round'
                ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
                : 'border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-600 dark:hover:border-emerald-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold">{isEn ? 'Round' : 'Okrągła'}</div>
                <div className="text-xs text-stone-600 dark:text-stone-300 font-normal">
                  {isEn ? 'Pot, bowl, bucket' : 'Misa, doniczka, wiadro'}
                </div>
              </div>
            </div>
            {shape === 'round' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Szybkie presety typowych donic */}
      <div>
        <div className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
          {isEn ? 'Quick common container presets:' : 'Szybkie typowe wymiary donic:'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => onApplyPreset('box60')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-left cursor-pointer transition font-semibold flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
          >
            {isEn ? 'Window box 60×20×18 cm' : 'Skrzynka 60×20×18 cm'}
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('pot30')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-left cursor-pointer transition font-semibold flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
          >
            {isEn ? 'Round pot ⌀ 30 cm' : 'Misa okrągła ⌀ 30 cm'}
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('large40')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-left cursor-pointer transition font-semibold flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
          >
            {isEn ? 'Square planter 40×40 cm' : 'Kwadratowa 40×40 cm'}
          </button>
          <button
            type="button"
            onClick={() => onApplyPreset('bucket15')}
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-left cursor-pointer transition font-semibold flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
          >
            {isEn ? 'Deep bucket ⌀ 28 cm' : 'Głęboka donica ⌀ 28 cm'}
          </button>
        </div>
      </div>
    </div>
  );

  // --- SEKCJA 3: SUWAKI WYMIARÓW ---
  const renderDimensionSliders = () => (
    <div className="bg-stone-50 dark:bg-stone-800/90 p-4 sm:p-5 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
          {isEn ? '3. Dimensions (in cm):' : '3. Wymiary donicy (w cm):'}
        </span>
        <span
          id="pot-calc-live-capacity"
          aria-live="polite"
          className="text-xs font-bold text-emerald-950 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/80 border border-emerald-300 dark:border-emerald-700 px-3 py-1 rounded-xl shadow-2xs"
        >
          {isEn ? `Capacity: ${volumeLiters} L` : `Pojemność: ${volumeLiters} L`}
        </span>
      </div>

      {/* Screen reader live announcement for dimension slider updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isEn
          ? `Pot dimensions updated: volume ${volumeLiters} liters, shape ${shape}`
          : `Wymiary donicy zaktualizowane: objętość ${volumeLiters} litrów, kształt ${shape}`}
      </div>

      {shape === 'rectangular' ? (
        <>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label htmlFor="pot-slider-length" className="text-stone-800 dark:text-stone-200">
                {isEn ? 'Box length (L):' : 'Długość skrzynki (L):'}
              </label>
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-300 dark:border-stone-600">
                {lengthCm} cm
              </span>
            </div>
            <div className="py-1">
              <input
                id="pot-slider-length"
                name="pot-length"
                data-testid="pot-slider-length"
                type="range"
                min="0"
                max="120"
                step="5"
                value={lengthCm}
                aria-valuenow={lengthCm}
                aria-valuemin={0}
                aria-valuemax={120}
                aria-valuetext={`${lengthCm} cm`}
                aria-label={isEn ? 'Box length in centimeters' : 'Długość skrzynki w centymetrach'}
                onChange={(e) => setLengthCm(Number(e.target.value))}
                className="w-full accent-emerald-700 dark:accent-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label htmlFor="pot-slider-width" className="text-stone-800 dark:text-stone-200">
                {isEn ? 'Width / Depth (W):' : 'Szerokość / głębokość (W):'}
              </label>
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-300 dark:border-stone-600">
                {widthCm} cm
              </span>
            </div>
            <div className="py-1">
              <input
                id="pot-slider-width"
                name="pot-width"
                data-testid="pot-slider-width"
                type="range"
                min="0"
                max="50"
                step="2"
                value={widthCm}
                aria-valuenow={widthCm}
                aria-valuemin={0}
                aria-valuemax={50}
                aria-valuetext={`${widthCm} cm`}
                aria-label={isEn ? 'Box width in centimeters' : 'Szerokość skrzynki w centymetrach'}
                onChange={(e) => setWidthCm(Number(e.target.value))}
                className="w-full accent-emerald-700 dark:accent-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label htmlFor="pot-slider-rect-height" className="text-stone-800 dark:text-stone-200">
                {isEn ? 'Height (H):' : 'Wysokość donicy (H):'}
              </label>
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-300 dark:border-stone-600">
                {rectHeightCm} cm
              </span>
            </div>
            <div className="py-1">
              <input
                id="pot-slider-rect-height"
                name="pot-rect-height"
                data-testid="pot-slider-rect-height"
                type="range"
                min="0"
                max="50"
                step="1"
                value={rectHeightCm}
                aria-valuenow={rectHeightCm}
                aria-valuemin={0}
                aria-valuemax={50}
                aria-valuetext={`${rectHeightCm} cm`}
                aria-label={isEn ? 'Box height in centimeters' : 'Wysokość skrzynki w centymetrach'}
                onChange={(e) => setRectHeightCm(Number(e.target.value))}
                className="w-full accent-emerald-700 dark:accent-emerald-400"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label htmlFor="pot-slider-diameter" className="text-stone-800 dark:text-stone-200">
                {isEn ? 'Top diameter (⌀):' : 'Średnica górna (⌀):'}
              </label>
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-300 dark:border-stone-600">
                {diameterCm} cm
              </span>
            </div>
            <div className="py-1">
              <input
                id="pot-slider-diameter"
                name="pot-diameter"
                data-testid="pot-slider-diameter"
                type="range"
                min="15"
                max="65"
                step="1"
                value={diameterCm}
                aria-valuenow={diameterCm}
                aria-valuemin={15}
                aria-valuemax={65}
                aria-valuetext={`${diameterCm} cm`}
                aria-label={isEn ? 'Pot diameter in centimeters' : 'Średnica donicy w centymetrach'}
                onChange={(e) => setDiameterCm(Number(e.target.value))}
                className="w-full accent-emerald-700 dark:accent-emerald-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <label htmlFor="pot-slider-round-height" className="text-stone-800 dark:text-stone-200">
                {isEn ? 'Height (H):' : 'Wysokość donicy (H):'}
              </label>
              <span className="font-bold text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2 py-0.5 rounded-md border border-stone-300 dark:border-stone-600">
                {roundHeightCm} cm
              </span>
            </div>
            <div className="py-1">
              <input
                id="pot-slider-round-height"
                name="pot-round-height"
                data-testid="pot-slider-round-height"
                type="range"
                min="12"
                max="50"
                step="1"
                value={roundHeightCm}
                aria-valuenow={roundHeightCm}
                aria-valuemin={12}
                aria-valuemax={50}
                aria-valuetext={`${roundHeightCm} cm`}
                aria-label={isEn ? 'Pot height in centimeters' : 'Wysokość donicy w centymetrach'}
                onChange={(e) => setRoundHeightCm(Number(e.target.value))}
                className="w-full accent-emerald-700 dark:accent-emerald-400"
              />
            </div>
          </div>
        </>
      )}

      {/* Live calculation badge right below dimension input fields */}
      {volumeLiters > 0 && (
        <div
          data-testid="pot-volume-live-badge"
          className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-medium border border-emerald-200"
        >
          <span>
            🪴 Szacowana objętość: <strong>{volumeLiters} L</strong> podłoża
          </span>
        </div>
      )}

      {/* Sub-requirement 7: Do not hide validation errors inside collapsed sections */}
      {!isDimensionsValid && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100 flex items-start gap-2.5"
        >
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold">
              {isEn ? 'Warning: Dimensions below plant requirements' : 'Uwaga: Wymiary poniżej minimalnych wymagań rośliny'}
            </div>
            <p className="leading-relaxed">
              {isEn
                ? `Current pot volume is ${volumeLiters} L and height is ${currentHeightCm} cm. ${currentPlant.name} requires min. ${minPlantVol} L (rec. ${recPlantVol} L) and min. ${minDepth} cm depth.`
                : `Obecna objętość donicy to ${volumeLiters} L, a wysokość ${currentHeightCm} cm. ${currentPlant.name} wymaga min. ${minPlantVol} L (zalec. ${recPlantVol} L) oraz min. ${minDepth} cm głębokości.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // --- SEKCJA 4: MATERIAŁ DONICY I OCENA ---
  const renderMaterialSelection = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="pot-calc-material-select"
          className="block text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider"
        >
          {isEn ? '4. Container Material:' : '4. Materiał donicy:'}
        </label>
        <select
          id="pot-calc-material-select"
          name="pot-calc-material"
          data-testid="pot-calc-material-select"
          value={material}
          onChange={(e) => setMaterial(e.target.value as LegacyPotMaterial)}
          className="w-full min-h-[44px] bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-400 focus:outline-none"
        >
          {POT_MATERIAL_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {getMaterialLabel(opt.key)}
            </option>
          ))}
        </select>

        {/* Ocena wybranego materiału */}
        <div
          className={`p-3.5 rounded-xl border text-xs transition-all ${
            materialEvaluation.rating === 'good'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              : materialEvaluation.rating === 'warning'
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              : 'bg-red-50 dark:bg-red-950/50 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
              {materialEvaluation.rating === 'good' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              ) : materialEvaluation.rating === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-700 dark:text-red-400 shrink-0" />
              )}
              <span>{isEn ? 'Material evaluation:' : 'Ocena materiału:'}</span>
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                materialEvaluation.rating === 'good'
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700'
                  : materialEvaluation.rating === 'warning'
                  ? 'bg-amber-100 dark:bg-amber-900 text-amber-950 dark:text-amber-100 border-amber-300 dark:border-amber-700'
                  : 'bg-red-100 dark:bg-red-900 text-red-950 dark:text-red-100 border-red-300 dark:border-red-700'
              }`}
            >
              {isEn
                ? materialEvaluation.rating === 'good'
                  ? 'Good choice'
                  : materialEvaluation.rating === 'warning'
                  ? 'Average / with cautions'
                  : 'Poor choice'
                : materialEvaluation.badgeText}
            </span>
          </div>
          <div className="font-bold text-xs mt-0.5 text-stone-900 dark:text-stone-100">
            {isEn ? (materialEvaluation.titleEn || materialEvaluation.title) : materialEvaluation.title}
          </div>
          <p className="text-xs leading-relaxed mt-0.5 text-stone-800 dark:text-stone-200 font-normal">
            {isEn ? (materialEvaluation.descriptionEn || materialEvaluation.description) : materialEvaluation.description}
          </p>
        </div>
      </div>

      {/* Podsumowanie wybranych parametrów przed obliczeniem */}
      <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs space-y-2">
        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-stone-500" />
          <span>{isEn ? 'Container summary before calculation:' : 'Podsumowanie donicy przed obliczeniem:'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-stone-700 dark:text-stone-300">
          <div>🌱 {isEn ? 'Plant: ' : 'Roślina: '}<strong>{currentPlant.name}</strong></div>
          <div>🏺 {isEn ? 'Material: ' : 'Materiał: '}<strong>{getMaterialLabel(material)}</strong></div>
          <div>
            📐 {isEn ? 'Shape & size: ' : 'Kształt: '}
            <strong>
              {shape === 'rectangular'
                ? `${lengthCm}×${widthCm}×${rectHeightCm} cm`
                : `⌀ ${diameterCm} cm, wys. ${roundHeightCm} cm`}
            </strong>
          </div>
          <div>💧 {isEn ? 'Volume: ' : 'Pojemność: '}<strong>{volumeLiters} L</strong></div>
        </div>
      </div>
    </div>
  );

  // --- SEKCJA 5: PODPORY, LICZBA DONIC I SPOSÓB STARTU ---
  const renderSupportsAndQuantity = () => (
    <div className="p-4 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-300 dark:border-stone-700 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label
          htmlFor="pot-calc-support-select"
          className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider"
        >
          {isEn ? 'Container Support:' : 'Podpora w donicy:'}
        </label>
        <select
          id="pot-calc-support-select"
          name="pot-calc-support"
          data-testid="pot-calc-support-select"
          value={supports}
          onChange={(e) => setSupports(e.target.value as SupportType)}
          className="min-h-[44px] bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-400 focus:outline-none"
        >
          {POT_SUPPORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {getSupportLabel(opt.key)}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2.5 border-t border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
          {isEn ? 'Pot count (qty):' : 'Liczba donic (szt.):'}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[1, 2, 3, 4, 6].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setPotCount(num)}
              className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                potCount === num
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs border-2 border-stone-900 dark:border-white'
                  : 'bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2.5 border-t border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
          {isEn ? 'Start method:' : 'Sposób startu:'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSowingMethod('nasiona')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
              sowingMethod === 'nasiona'
                ? 'bg-emerald-800 text-white border-2 border-emerald-800 shadow-xs'
                : 'bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100'
            }`}
          >
            <span>🌱</span>
            <span>{isEn ? 'From Seed' : 'Z nasion'}</span>
          </button>
          <button
            type="button"
            onClick={() => setSowingMethod('sadzonka')}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
              sowingMethod === 'sadzonka'
                ? 'bg-emerald-800 text-white border-2 border-emerald-800 shadow-xs'
                : 'bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100'
            }`}
          >
            <span>🌿</span>
            <span>{isEn ? 'Seedling' : 'Rozsada'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // KROK 1: TYLKO KONFIGURACJA (Roślina, podpory, liczba donic, sposób startu)
  if (activeStep === 'configuration') {
    return (
      <div className="space-y-5">
        {renderPlantSelection()}
        {renderSupportsAndQuantity()}
      </div>
    );
  }

  // KROK 2: TYLKO WYMIARY (Kształt, presety, suwaki wymiarów)
  if (activeStep === 'dimensions') {
    return (
      <div className="space-y-5">
        {renderShapeAndPresets()}
        {renderDimensionSliders()}
      </div>
    );
  }

  // KROK 3: TYLKO MATERIAŁ (Wybór materiału i ocena agronomiczna)
  if (activeStep === 'material') {
    return (
      <div className="space-y-5">
        {renderMaterialSelection()}
      </div>
    );
  }

  // DOMYŚLNY WIDOK: ALL (Wszystkie kontrolki razem, w tym testowany przycisk "Oblicz")
  return (
    <div className="space-y-6">
      {/* 2-kolumnowy układ formularza na większych ekranach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolumna 1: Wybór rośliny, kształtu donicy i presety */}
        <div className="space-y-5">
          {renderPlantSelection()}
          {renderShapeAndPresets()}
        </div>

        {/* Kolumna 2: Suwaki wymiarów, materiał i podpory */}
        <div className="space-y-5">
          {renderDimensionSliders()}
          {renderMaterialSelection()}
          {renderSupportsAndQuantity()}
        </div>
      </div>

      {/* DUŻY PRZYCISK "OBLICZ" NA DOLE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-stone-800 dark:text-stone-200 space-y-0.5 text-center sm:text-left">
          <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isEn ? 'Ready for calculation & layout generation' : 'Gotowy do kalkulacji i wygenerowania makiety'}</span>
          </div>
          <p className="text-stone-700 dark:text-stone-300 text-xs">
            {isEn ? 'Plant: ' : 'Roślina: '}<strong>{currentPlant.name}</strong> • {isEn ? 'Volume: ' : 'Objętość: '}<strong>{volumeLiters} L</strong> •{' '}
            {shape === 'rectangular'
              ? `${lengthCm}×${widthCm}×${rectHeightCm} cm`
              : (isEn ? `⌀ ${diameterCm} cm, height ${roundHeightCm} cm` : `⌀ ${diameterCm} cm, wys. ${roundHeightCm} cm`)}
          </p>
        </div>

        <button
          type="button"
          id="pot-calc-submit-btn"
          data-testid="pot-calculator-submit"
          onClick={onCalculate}
          className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-xl text-base font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400"
        >
          <span>{isEn ? 'Calculate' : 'Oblicz'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
