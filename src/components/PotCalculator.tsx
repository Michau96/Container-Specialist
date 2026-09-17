import React, { useState, useMemo } from 'react';
import {
  Box,
  Circle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Layers,
  Ruler,
  Compass,
  ShieldCheck,
  Info,
  Coins,
} from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { SoilCrossSection } from './SoilCrossSection';
import { CropCostEstimatorCard } from './CropCostEstimatorCard';
import {
  POT_MATERIAL_OPTIONS,
  POT_SUPPORT_OPTIONS,
  evaluatePotMaterial,
  evaluatePlantSupport,
} from '../lib/potSupportEvaluations';

interface Props {
  plants: Plant[];
  initialPlant?: Plant | null;
  onSelectPlant?: (plant: Plant) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const PotCalculator: React.FC<Props> = ({
  plants,
  initialPlant,
  onSelectPlant,
  onClose,
  isModal = false,
}) => {
  // Wybrana roślina
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    initialPlant ? initialPlant.id : plants[0]?.id ?? 'pomidor-karlowy'
  );

  // Kształt donicy
  const [shape, setShape] = useState<PotShape>('rectangular');

  // Wymiary w cm
  // Prostokątna:
  const [lengthCm, setLengthCm] = useState<number>(60);
  const [widthCm, setWidthCm] = useState<number>(20);
  const [rectHeightCm, setRectHeightCm] = useState<number>(20);

  // Okrągła:
  const [diameterCm, setDiameterCm] = useState<number>(30);
  const [roundHeightCm, setRoundHeightCm] = useState<number>(25);

  // Materiał
  const [material, setMaterial] = useState<LegacyPotMaterial>('plastic');

  // Podpora
  const [supports, setSupports] = useState<SupportType>('stake');

  // Liczba donic
  const [potCount, setPotCount] = useState<number>(1);

  // Metoda startu: nasiona vs gotowa sadzonka
  const [sowingMethod, setSowingMethod] = useState<'nasiona' | 'sadzonka'>('nasiona');

  // Wyświetlany widok schematu: 'top_layout' (szkic z góry), 'soil_layers' (warstwy podłoża), lub 'cost_estimates' (szacunek kosztów)
  const [activeSchemaView, setActiveSchemaView] = useState<'top_layout' | 'soil_layers' | 'cost_estimates'>('top_layout');

  const currentPlant = useMemo(() => {
    return plants.find((p) => p.id === selectedPlantId) ?? plants[0];
  }, [plants, selectedPlantId]);

  // Ocena agronomiczna materiału i podpory dla wybranej rośliny
  const materialEvaluation = useMemo(() => {
    return evaluatePotMaterial(material, currentPlant);
  }, [material, currentPlant]);

  const supportEvaluation = useMemo(() => {
    return evaluatePlantSupport(supports, currentPlant);
  }, [supports, currentPlant]);

  // Obliczenia objętości donicy w litrach
  const heightCm = shape === 'rectangular' ? rectHeightCm : roundHeightCm;

  const volumeLiters = useMemo(() => {
    if (shape === 'rectangular') {
      return Number(((lengthCm * widthCm * rectHeightCm) / 1000).toFixed(1));
    } else {
      const radius = diameterCm / 2;
      return Number(((Math.PI * radius * radius * roundHeightCm) / 1000).toFixed(1));
    }
  }, [shape, lengthCm, widthCm, rectHeightCm, diameterCm, roundHeightCm]);

  // Wymogi rośliny
  const minPlantVol = currentPlant?.pot.min_volume_l ?? 5;
  const recPlantVol = currentPlant?.pot.recommended_volume_l ?? 10;
  const minDepth = currentPlant?.pot.min_depth_cm ?? 18;
  const spacingCm = currentPlant?.spacing_guide?.spacing_cm ?? 20;
  const plantingDepth = currentPlant?.spacing_guide?.planting_depth_cm ?? 2;
  const plantingMethod = currentPlant?.spacing_guide?.planting_method ?? 'Sadź na głębokość bryły korzeniowej.';
  const requiredSupports = currentPlant?.spacing_guide?.supports_needed ?? 'Palik lub brak';

  // Obliczenie maksymalnej liczby roślin mieszczących się w donicy
  const capacityInfo = useMemo(() => {
    const maxByVol = Math.floor(volumeLiters / minPlantVol);
    let maxByGeometry = 1;
    let points: { x: number; y: number; label: string }[] = [];

    if (shape === 'rectangular') {
      const usableLength = lengthCm - 10; // 5 cm marginesu z każdego brzegu
      const spotsCount = Math.max(1, Math.floor(usableLength / spacingCm) + 1);
      maxByGeometry = spotsCount;

      const finalCount = Math.max(1, Math.min(maxByVol, maxByGeometry));

      if (finalCount === 1) {
        points = [{ x: 50, y: 50, label: 'Roślina 1' }];
      } else {
        const step = 80 / (finalCount - 1);
        for (let i = 0; i < finalCount; i++) {
          points.push({
            x: 10 + i * step,
            y: 50,
            label: `Roślina ${i + 1}`,
          });
        }
      }

      return {
        recommendedCount: finalCount,
        maxByGeometry,
        maxByVol,
        points,
        dimensionText: `${lengthCm} cm × ${widthCm} cm, wys. ${rectHeightCm} cm`,
      };
    } else {
      if (diameterCm < 24 || minPlantVol > 8) {
        maxByGeometry = 1;
        points = [{ x: 50, y: 50, label: 'Roślina 1' }];
      } else if (diameterCm < 35) {
        maxByGeometry = spacingCm <= 15 ? 3 : 2;
        if (maxByGeometry === 2) {
          points = [
            { x: 35, y: 50, label: 'Roślina 1' },
            { x: 65, y: 50, label: 'Roślina 2' },
          ];
        } else {
          points = [
            { x: 50, y: 32, label: 'Roślina 1' },
            { x: 33, y: 65, label: 'Roślina 2' },
            { x: 67, y: 65, label: 'Roślina 3' },
          ];
        }
      } else {
        maxByGeometry = spacingCm <= 15 ? 4 : 3;
        points = [
          { x: 32, y: 35, label: 'Roślina 1' },
          { x: 68, y: 35, label: 'Roślina 2' },
          { x: 50, y: 70, label: 'Roślina 3' },
        ];
      }

      const finalCount = Math.max(1, Math.min(maxByVol, maxByGeometry));
      return {
        recommendedCount: finalCount,
        maxByGeometry,
        maxByVol,
        points: points.slice(0, finalCount),
        dimensionText: `Średnica ⌀ ${diameterCm} cm, wys. ${roundHeightCm} cm`,
      };
    }
  }, [shape, lengthCm, widthCm, rectHeightCm, diameterCm, roundHeightCm, volumeLiters, minPlantVol, spacingCm]);

  // Ocena dopasowania donicy
  const isDepthOk = heightCm >= minDepth;
  const isVolOk = volumeLiters >= minPlantVol;

  // Presety donic
  const applyPreset = (preset: 'box60' | 'pot30' | 'large40' | 'bucket15') => {
    if (preset === 'box60') {
      setShape('rectangular');
      setLengthCm(60);
      setWidthCm(20);
      setRectHeightCm(18);
    } else if (preset === 'pot30') {
      setShape('round');
      setDiameterCm(30);
      setRoundHeightCm(25);
    } else if (preset === 'large40') {
      setShape('rectangular');
      setLengthCm(40);
      setWidthCm(40);
      setRectHeightCm(35);
    } else if (preset === 'bucket15') {
      setShape('round');
      setDiameterCm(28);
      setRoundHeightCm(30);
    }
  };

  return (
    <div
      className={`bg-white dark:bg-stone-900 rounded-3xl transition-colors ${
        isModal ? 'p-6 max-w-4xl w-full mx-auto' : 'p-6 border border-stone-200 dark:border-stone-800 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-stone-100 dark:border-stone-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
            <Ruler className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            <span>Kalkulator i szkicownik siewu donicowego</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Dopasuj donicę i zobacz szkic rozstawy
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Podaj dokładne wymiary swojej donicy, materiał i podpory – system przeliczy objętość i naszkicuje optymalne rozmieszczenie roślin.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="self-end sm:self-center px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
          >
            Zamknij
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lewa kolumna: Formularz parametrów donicy (5 kolumn) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Wybór rośliny */}
          <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-750">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5">
              Wybierz uprawianą roślinę:
            </label>
            <select
              id="pot-calc-plant-select"
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500 focus:outline-none"
            >
              <optgroup label="Warzywa">
                {plants
                  .filter((p) => p.plant_group === 'warzywa')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🥕 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Owoce">
                {plants
                  .filter((p) => p.plant_group === 'owoce')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🍓 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Zioła">
                {plants
                  .filter((p) => p.plant_group === 'ziola')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🌿 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Rośliny ozdobne (kwiaty)">
                {plants
                  .filter((p) => p.plant_group === 'ozdobne')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🌸 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Mikrolistki i kiełki">
                {plants
                  .filter((p) => p.plant_group === 'kielki')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🌱 {p.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Grzyby uprawne">
                {plants
                  .filter((p) => p.plant_group === 'grzyby')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      🍄 {p.name}
                    </option>
                  ))}
              </optgroup>
            </select>

            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mt-2 pt-2 border-t border-stone-200/60 dark:border-stone-700/60">
              <span>Wymóg rośliny:</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Min. {minPlantVol}L (zalec. {recPlantVol}L), głębokość min. {minDepth} cm
              </span>
            </div>
          </div>

          {/* Szybkie presety */}
          <div>
            <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              Szybkie typowe wymiary donic:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyPreset('box60')}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Skrzynka 60×20×18 cm
              </button>
              <button
                type="button"
                onClick={() => applyPreset('pot30')}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Misa okrągła ⌀ 30 cm
              </button>
              <button
                type="button"
                onClick={() => applyPreset('large40')}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Kwadratowa 40×40 cm
              </button>
              <button
                type="button"
                onClick={() => applyPreset('bucket15')}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-left cursor-pointer transition font-medium"
              >
                Głęboka donica ⌀ 28 cm
              </button>
            </div>
          </div>

          {/* 2. Kształt donicy */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Kształt Twojej donicy:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShape('rectangular')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                  shape === 'rectangular'
                    ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold ring-2 ring-stone-500/20'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Box className="w-5 h-5 text-stone-800 dark:text-stone-200 shrink-0" />
                <div>
                  <div className="text-xs">Prostokątna</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Skrzynka, korytko, rynna</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShape('round')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition flex items-center gap-3 ${
                  shape === 'round'
                    ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold ring-2 ring-stone-500/20'
                    : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Circle className="w-5 h-5 text-stone-800 dark:text-stone-200 shrink-0" />
                <div>
                  <div className="text-xs">Okrągła</div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Misa, doniczka, wiadro</div>
                </div>
              </button>
            </div>
          </div>

          {/* 3. Wymiary */}
          <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-750 space-y-3.5">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
              Wprowadź wymiary (w cm):
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

            {/* Wyliczona objętość */}
            <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400 font-medium">Obliczona objętość donicy:</span>
              <span className="text-base font-bold text-stone-900 dark:text-stone-100 bg-stone-200/80 dark:bg-stone-700 px-2.5 py-0.5 rounded-lg">
                {volumeLiters} litrów
              </span>
            </div>
          </div>

          {/* 4. Materiał donicy */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Materiał donicy:
            </label>
            <select
              id="pot-calc-material-select"
              value={material}
              onChange={(e) => setMaterial(e.target.value as LegacyPotMaterial)}
              className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500"
            >
              {POT_MATERIAL_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Ocena wybranego materiału dla tej konkretnej rośliny */}
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

          {/* 5. Podpory */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
              Podpora w donicy:
            </label>
            <select
              id="pot-calc-support-select"
              value={supports}
              onChange={(e) => setSupports(e.target.value as SupportType)}
              className="w-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-stone-500"
            >
              {POT_SUPPORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Panel statusu: Czy podpora jest potrzebna + Ocena wybranej podpory */}
            <div className="space-y-2">
              {/* 1. Wskazanie: Czy podpora jest potrzebna dla wybranej rośliny */}
              <div
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                  supportEvaluation.isSupportNeeded
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                    : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200'
                }`}
              >
                <span className="font-semibold text-[11px] flex items-center gap-1.5">
                  <span>🎋</span>
                  <span>Czy roślina wymaga podpory?</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                    supportEvaluation.isSupportNeeded
                      ? 'bg-amber-200/90 dark:bg-amber-900 text-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-700'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                  }`}
                >
                  {supportEvaluation.needBadgeText}
                </span>
              </div>

              {/* 2. Ocena wybranej podpory: Dobry wybór / Średni z zastrzeżeniami / Zły wybór */}
              <div
                className={`p-3 rounded-xl border text-xs transition-all ${
                  supportEvaluation.rating === 'good'
                    ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : supportEvaluation.rating === 'warning'
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                    : 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                    {supportEvaluation.rating === 'good' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : supportEvaluation.rating === 'warning' ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0" />
                    )}
                    <span>Ocena wybranej podpory:</span>
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                      supportEvaluation.rating === 'good'
                        ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700'
                        : supportEvaluation.rating === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700'
                        : 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700'
                    }`}
                  >
                    {supportEvaluation.badgeText}
                  </span>
                </div>
                <div className="font-semibold text-[11px] mt-0.5 text-stone-800 dark:text-stone-200">
                  {supportEvaluation.title}
                </div>
                <p className="text-[11px] leading-relaxed mt-0.5 text-stone-700 dark:text-stone-300 font-normal">
                  {supportEvaluation.description}
                </p>
                {supportEvaluation.practicalTip && (
                  <div className="mt-1.5 pt-1.5 border-t border-stone-200/60 dark:border-stone-700/60 text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                    💡 Wskazówka: {supportEvaluation.practicalTip}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 6. Liczba donic i metoda uprawy */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Liczba donic (sztuki):
              </label>
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
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Sposób startu:
              </label>
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

        {/* Prawa kolumna: Wyniki, Rekomendacje & Interaktywny Szkic 2D (7 kolumn) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Status dopasowania donicy - STRICT SEMANTIC COLORING */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isVolOk && isDepthOk
                ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
            }`}
          >
            {isVolOk && isDepthOk ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                {isVolOk && isDepthOk ? 'Potwierdzone: donica spełnia wymagania' : 'Donica nie spełnia wymagań (za mała):'}
              </div>
              <p className="text-xs leading-relaxed mt-0.5">
                Twoja donica ma <strong>{volumeLiters}L</strong> i głębokość <strong>{heightCm} cm</strong>.
                Dla <strong>{currentPlant.name}</strong> zalecane jest min. {minPlantVol}L oraz głębokość min. {minDepth} cm.
                {capacityInfo.recommendedCount > 0 ? (
                  <span className="block mt-1 font-semibold text-emerald-900 dark:text-emerald-300">
                    💡 Rekomendacja: w {potCount > 1 ? `${potCount} takich donicach` : 'tej donicy'} możesz posadzić łącznie <strong>{capacityInfo.recommendedCount * potCount} {capacityInfo.recommendedCount * potCount === 1 ? 'sztukę' : capacityInfo.recommendedCount * potCount < 5 ? 'sztuki' : 'sztuk'}</strong> w optymalnej rozstawie co <strong>{spacingCm} cm</strong>.
                  </span>
                ) : (
                  <span className="block mt-1 text-red-800 dark:text-red-300 font-semibold">
                    Pojemnik jest za mały dla tej rośliny – korzenie szybko ulegną skarłowaceniu lub wyschną.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Przełącznik zakładek szkicu: Rzut z góry (2D layout) vs Przekrój podłoża vs Koszty */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-stone-200 dark:border-stone-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveSchemaView('top_layout')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeSchemaView === 'top_layout'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Szkic z góry (rozstawa)</span>
            </button>

            <button
              onClick={() => setActiveSchemaView('soil_layers')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeSchemaView === 'soil_layers'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Przekrój podłoża ({volumeLiters}L)</span>
            </button>

            <button
              onClick={() => setActiveSchemaView('cost_estimates')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeSchemaView === 'cost_estimates'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Szacunek kosztów (PLN)</span>
            </button>
          </div>

          {/* Widok 1: Interaktywny szkic 2D planu siewu z góry */}
          {activeSchemaView === 'top_layout' ? (
            <div className="bg-stone-100/90 dark:bg-stone-850 rounded-2xl p-4 sm:p-5 border border-stone-300 dark:border-stone-700 flex flex-col items-center">
              <div className="w-full flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mb-3">
                <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  📐 Szkic rozmieszczenia ({capacityInfo.dimensionText})
                </span>
                <span className="text-[11px] bg-white dark:bg-stone-800 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300">
                  Rozstawa: <strong>{spacingCm} cm</strong>
                </span>
              </div>

              {/* Obszar rysunku SVG */}
              <div className="w-full max-w-lg bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-300 dark:border-stone-700 shadow-inner flex flex-col items-center">
                <svg
                  viewBox="0 0 400 180"
                  className="w-full h-44 drop-shadow-sm select-none"
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
                        stroke={material === 'terracotta' ? '#c86d51' : material === 'wood' ? '#8b5a2b' : '#44403c'}
                        strokeWidth="8"
                      />
                      {/* Wnętrze ziemi */}
                      <rect
                        x="34"
                        y="34"
                        width="332"
                        height="92"
                        rx="10"
                        fill="#52392f"
                      />

                      {/* Podpora na tylnej ściance jeśli wybrano kratkę */}
                      {supports === 'trellis' && (
                        <line x1="34" y1="36" x2="366" y2="36" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="6 4" />
                      )}

                      {/* Linie wymiarowe L */}
                      <line x1="30" y1="150" x2="370" y2="150" stroke="#78716c" strokeWidth="1.5" />
                      <line x1="30" y1="145" x2="30" y2="155" stroke="#78716c" strokeWidth="1.5" />
                      <line x1="370" y1="145" x2="370" y2="155" stroke="#78716c" strokeWidth="1.5" />
                      <text x="200" y="165" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
                        Długość: {lengthCm} cm
                      </text>

                      {/* Szerokość W */}
                      <line x1="15" y1="30" x2="15" y2="130" stroke="#78716c" strokeWidth="1.5" />
                      <line x1="10" y1="30" x2="20" y2="30" stroke="#78716c" strokeWidth="1.5" />
                      <line x1="10" y1="130" x2="20" y2="130" stroke="#78716c" strokeWidth="1.5" />
                      <text x="12" y="85" textAnchor="middle" fontSize="10" fill="#78716c" transform="rotate(-90 12 85)">
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
                        stroke={material === 'terracotta' ? '#c86d51' : material === 'wood' ? '#8b5a2b' : '#44403c'}
                        strokeWidth="8"
                      />
                      <ellipse
                        cx="200"
                        cy="80"
                        rx="94"
                        ry="54"
                        fill="#52392f"
                      />

                      {/* Linia średnicy */}
                      <line x1="100" y1="150" x2="300" y2="150" stroke="#78716c" strokeWidth="1.5" />
                      <line x1="100" y1="145" x2="100" y2="155" stroke="#78716c" strokeWidth="1.5" />
                      <line x1="300" y1="145" x2="300" y2="155" stroke="#78716c" strokeWidth="1.5" />
                      <text x="200" y="166" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
                        Średnica: ⌀ {diameterCm} cm
                      </text>
                    </g>
                  )}

                  {/* Punkty sadzonek */}
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
                        <circle cx={cx} cy={cy + 2} r="14" fill="#2d1c15" opacity="0.6" />
                        {/* Koronka / rozeta rośliny */}
                        <circle cx={cx} cy={cy} r="13" fill="#2e7d32" stroke="#a5d6a7" strokeWidth="2.5" />
                        {/* Ikona podpory (palik) przy roślinie */}
                        {supports === 'stake' && (
                          <circle cx={cx + 10} cy={cy - 8} r="4" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
                        )}
                        {/* Numer sadzonki */}
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
                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-600 dark:text-stone-400 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#2e7d32] border border-green-200 inline-block" />
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

              {/* Informacje instruktażowe siewu */}
              <div className="w-full mt-4 bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200 pb-1.5 border-b border-stone-100 dark:border-stone-800">
                  <span>Instrukcja agrotechniczna dla: {currentPlant.name}</span>
                  <span className="text-stone-700 dark:text-stone-300 font-semibold">
                    Głębokość:{' '}
                    {plantingDepth > 0 ? `${plantingDepth} cm` : 'powierzchniowo'}
                  </span>
                </div>

                {/* Siew gniazdowy / pojedynczy / rzutowy */}
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 space-y-1.5">
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
                  {currentPlant.spacing_guide?.sowing_type_details &&
                    currentPlant.spacing_guide?.sowing_type !== 'gniazdowo' &&
                    currentPlant.spacing_guide?.sowing_type !== 'pojedynczo' && (
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {currentPlant.spacing_guide.sowing_type_details}
                      </p>
                    )}
                </div>

                {/* Palik bambusowy - WIDOCZNY TYLKO GDY NIEZBĘDNY DO UPRAWY */}
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
                  {supports === 'none' && currentPlant.spacing_guide?.requires_bamboo_stake && (
                    <span className="text-red-700 dark:text-red-400 font-bold block mt-1">
                      ⚠️ Uwaga: wybrano brak podpory w kalkulatorze, a ta roślina bezwzględnie wymaga stabilizacji palikiem bambusowym pod ciężarem plonów!
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : activeSchemaView === 'soil_layers' ? (
            /* Widok 2: Schemat warstw podłoża w tej konkretnej donicy */
            <SoilCrossSection
              soilLayers={currentPlant.soil_layers}
              potHeightCm={heightCm}
              potVolumeLiters={volumeLiters}
              plant={currentPlant}
            />
          ) : (
            /* Widok 3: Pełny szacunek kosztów uprawy z rozbiciem */
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

          {/* Jeśli użytkownik jest w widoku szkicu lub warstw podłoża, wyświetlamy pod spodem podsumowanie kosztowe */}
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
        </div>
      </div>
    </div>
  );
};
