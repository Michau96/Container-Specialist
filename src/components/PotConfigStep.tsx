import React from 'react';
import {
  Box,
  Circle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { POT_MATERIAL_OPTIONS, POT_SUPPORT_OPTIONS } from '../lib/potSupportEvaluations';

interface PotConfigStepProps {
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
}) => {
  return (
    <div className="space-y-6">
      {/* 2-kolumnowy układ formularza na większych ekranach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kolumna 1: Wybór rośliny, kształtu donicy i presety */}
        <div className="space-y-5">
          {/* 1. Wybór rośliny */}
          <div className="bg-stone-50 dark:bg-stone-800/90 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
            <label
              htmlFor="pot-calc-plant-select"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2"
            >
              1. Wybierz uprawianą roślinę:
            </label>
            <select
              id="pot-calc-plant-select"
              value={selectedPlantId}
              onChange={(e) => onSelectPlantId(e.target.value)}
              className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:outline-none"
            >
              <optgroup label="🥕 Warzywa">
                {availablePlants
                  .filter((p) => p.plant_group === 'warzywa')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🥕 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🍓 Owoce">
                {availablePlants
                  .filter((p) => p.plant_group === 'owoce')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🍓 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌿 Zioła">
                {availablePlants
                  .filter((p) => p.plant_group === 'ziola')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🌿 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌸 Rośliny ozdobne (kwiaty)">
                {availablePlants
                  .filter((p) => p.plant_group === 'ozdobne')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🌸 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🌱 Mikrolistki i kiełki">
                {availablePlants
                  .filter((p) => p.plant_group === 'kielki')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🌱 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="🍄 Grzyby uprawne">
                {availablePlants
                  .filter((p) => p.plant_group === 'grzyby')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🍄 {p.name}
                    </option>
                  ))}
              </optgroup>
            </select>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-600 dark:text-stone-300 mt-2.5 pt-2.5 border-t border-stone-200 dark:border-stone-700/80 gap-1.5">
              <span>Wymagania dla {currentPlant.name}:</span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700">
                min. {minPlantVol}L (zalec. {recPlantVol}L) • głębokość min. {minDepth} cm
              </span>
            </div>
          </div>

          {/* 2. Kształt donicy */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              2. Kształt Twojej donicy:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShape('rectangular')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                  shape === 'rectangular'
                    ? 'border-stone-900 dark:border-stone-200 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold ring-2 ring-stone-500/20'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Box className="w-5 h-5 text-stone-800 dark:text-stone-200 shrink-0" />
                <div>
                  <div className="text-xs">Prostokątna</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                    Skrzynka, korytko, rynna
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShape('round')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                  shape === 'round'
                    ? 'border-stone-900 dark:border-stone-200 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold ring-2 ring-stone-500/20'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Circle className="w-5 h-5 text-stone-800 dark:text-stone-200 shrink-0" />
                <div>
                  <div className="text-xs">Okrągła</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">
                    Misa, doniczka, wiadro
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Szybkie presety typowych donic */}
          <div>
            <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              Szybkie typowe wymiary donic:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => onApplyPreset('box60')}
                className="px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Skrzynka 60×20×18 cm
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset('pot30')}
                className="px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Misa okrągła ⌀ 30 cm
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset('large40')}
                className="px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Kwadratowa 40×40 cm
              </button>
              <button
                type="button"
                onClick={() => onApplyPreset('bucket15')}
                className="px-2.5 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Głęboka donica ⌀ 28 cm
              </button>
            </div>
          </div>
        </div>

        {/* Kolumna 2: Suwaki wymiarów, materiał i podpory */}
        <div className="space-y-5">
          {/* 3. Wymiary w cm */}
          <div className="bg-stone-50 dark:bg-stone-800/90 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                3. Wymiary donicy (w cm):
              </span>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100 bg-stone-200/90 dark:bg-stone-700 px-2.5 py-0.5 rounded-lg">
                Pojemność: {volumeLiters} L
              </span>
            </div>

            {shape === 'rectangular' ? (
              <>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600 dark:text-stone-400">Długość skrzynki (L):</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{lengthCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="5"
                    value={lengthCm}
                    onChange={(e) => setLengthCm(Number(e.target.value))}
                    className="w-full accent-stone-700 dark:accent-stone-300"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600 dark:text-stone-400">Szerokość / głębokość (W):</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{widthCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="50"
                    step="2"
                    value={widthCm}
                    onChange={(e) => setWidthCm(Number(e.target.value))}
                    className="w-full accent-stone-700 dark:accent-stone-300"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600 dark:text-stone-400">Wysokość donicy (H):</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{rectHeightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="50"
                    step="1"
                    value={rectHeightCm}
                    onChange={(e) => setRectHeightCm(Number(e.target.value))}
                    className="w-full accent-stone-700 dark:accent-stone-300"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600 dark:text-stone-400">Średnica górna (⌀):</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{diameterCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="65"
                    step="1"
                    value={diameterCm}
                    onChange={(e) => setDiameterCm(Number(e.target.value))}
                    className="w-full accent-stone-700 dark:accent-stone-300"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-600 dark:text-stone-400">Wysokość donicy (H):</span>
                    <span className="font-bold text-stone-900 dark:text-stone-100">{roundHeightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="50"
                    step="1"
                    value={roundHeightCm}
                    onChange={(e) => setRoundHeightCm(Number(e.target.value))}
                    className="w-full accent-stone-700 dark:accent-stone-300"
                  />
                </div>
              </>
            )}
          </div>

          {/* 4. Materiał donicy */}
          <div className="space-y-2">
            <label
              htmlFor="pot-calc-material-select"
              className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider"
            >
              4. Materiał donicy:
            </label>
            <select
              id="pot-calc-material-select"
              value={material}
              onChange={(e) => setMaterial(e.target.value as LegacyPotMaterial)}
              className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500"
            >
              {POT_MATERIAL_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Ocena wybranego materiału */}
            <div
              className={`p-3 rounded-xl border text-xs transition-all ${
                materialEvaluation.rating === 'good'
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                  : materialEvaluation.rating === 'warning'
                  ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                  : 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                  {materialEvaluation.rating === 'good' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : materialEvaluation.rating === 'warning' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                  <span>Ocena materiału:</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                    materialEvaluation.rating === 'good'
                      ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700'
                      : materialEvaluation.rating === 'warning'
                      ? 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700'
                      : 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700'
                  }`}
                >
                  {materialEvaluation.badgeText}
                </span>
              </div>
              <div className="font-semibold text-[11px] mt-0.5 text-stone-800 dark:text-stone-200">
                {materialEvaluation.title}
              </div>
              <p className="text-[11px] leading-relaxed mt-0.5 text-stone-700 dark:text-stone-300 font-normal">
                {materialEvaluation.description}
              </p>
            </div>
          </div>

          {/* 5. Podpora i liczba donic */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/90 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex items-center justify-between">
              <label
                htmlFor="pot-calc-support-select"
                className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider"
              >
                Podpora w donicy:
              </label>
              <select
                id="pot-calc-support-select"
                value={supports}
                onChange={(e) => setSupports(e.target.value as SupportType)}
                className="bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600 rounded-lg px-2.5 py-1 text-xs font-semibold text-stone-900 dark:text-stone-100"
              >
                {POT_SUPPORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Liczba donic (szt.):
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPotCount(num)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                      potCount === num
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs'
                        : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Sposób startu:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSowingMethod('nasiona')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    sowingMethod === 'nasiona'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                >
                  🌱 Z nasion
                </button>
                <button
                  type="button"
                  onClick={() => setSowingMethod('sadzonka')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    sowingMethod === 'sadzonka'
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                  }`}
                >
                  🌿 Rozsada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DUŻY PRZYCISK "OBLICZ" NA DOLE KROKU 1 */}
      <div className="p-4 sm:p-5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-stone-700 dark:text-stone-300 space-y-0.5 text-center sm:text-left">
          <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Gotowy do kalkulacji i wygenerowania makiety</span>
          </div>
          <p className="text-stone-500 dark:text-stone-400 text-[11px]">
            Roślina: <strong>{currentPlant.name}</strong> • Objętość: <strong>{volumeLiters} L</strong> •{' '}
            {shape === 'rectangular'
              ? `${lengthCm}×${widthCm}×${rectHeightCm} cm`
              : `⌀ ${diameterCm} cm, wys. ${roundHeightCm} cm`}
          </p>
        </div>

        <button
          type="button"
          id="pot-calc-submit-btn"
          onClick={onCalculate}
          className="w-full sm:w-auto px-8 py-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white rounded-2xl text-base font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-3 cursor-pointer"
        >
          <span>Oblicz</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
