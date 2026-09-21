import React, { useState, useMemo, useEffect } from 'react';
import { Ruler, Sparkles, CheckCircle2 } from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { PotConfigStep } from './PotConfigStep';
import { PotResultStep } from './PotResultStep';
import {
  evaluatePotMaterial,
  evaluatePlantSupport,
} from '../lib/potSupportEvaluations';
import defaultPlantsData from '../data/plants.json';

const defaultPlants = defaultPlantsData as unknown as Plant[];

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
  // Gwarantujemy, że lista roślin nigdy nie jest pusta
  const availablePlants = useMemo(() => {
    return plants && plants.length > 0 ? plants : defaultPlants;
  }, [plants]);

  // Stan kroków kreatora: 1 = Konfiguracja, 2 = Wynik
  const [step, setStep] = useState<1 | 2>(1);

  // Wybrana roślina
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    initialPlant ? initialPlant.id : (availablePlants[0]?.id ?? 'pomidor-karlowy')
  );

  // Synchronizacja przy zmianie initialPlant
  useEffect(() => {
    if (initialPlant?.id) {
      setSelectedPlantId(initialPlant.id);
    }
  }, [initialPlant?.id]);

  // Synchronizacja jeśli selectedPlantId nie istnieje w dostępnych roślinach
  useEffect(() => {
    if (availablePlants.length > 0 && !availablePlants.some((p) => p.id === selectedPlantId)) {
      setSelectedPlantId(availablePlants[0].id);
    }
  }, [availablePlants, selectedPlantId]);

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

  // Wyświetlany widok schematu w kroku 2: 'top_layout' | 'soil_layers' | 'cost_estimates'
  const [activeSchemaView, setActiveSchemaView] = useState<'top_layout' | 'soil_layers' | 'cost_estimates'>('top_layout');

  const currentPlant = useMemo(() => {
    return (
      availablePlants.find((p) => p.id === selectedPlantId) ??
      availablePlants[0] ??
      defaultPlants[0]
    );
  }, [availablePlants, selectedPlantId]);

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
      const usableLength = Math.max(0, lengthCm - 10);
      const usableWidth = Math.max(0, widthCm - 10);

      const spotsPerRow = Math.max(1, Math.floor(usableLength / spacingCm) + 1);
      const rowsCount = Math.max(1, Math.floor(usableWidth / spacingCm) + 1);

      maxByGeometry = spotsPerRow * rowsCount;
      const finalCount = Math.max(1, Math.min(maxByVol, maxByGeometry));

      if (finalCount === 1) {
        points = [{ x: 50, y: 50, label: 'Roślina 1' }];
      } else {
        let placed = 0;
        const actualRows = Math.ceil(finalCount / spotsPerRow);
        const yStep = actualRows > 1 ? 80 / (actualRows - 1) : 0;

        for (let r = 0; r < actualRows; r++) {
          const rowSpots = Math.min(spotsPerRow, finalCount - placed);
          const xStep = spotsPerRow > 1 ? 80 / (spotsPerRow - 1) : 0;
          const xOffset = spotsPerRow > 1 ? 10 + ((spotsPerRow - rowSpots) * xStep) / 2 : 50;

          for (let c = 0; c < rowSpots; c++) {
            points.push({
              x: rowSpots === 1 && spotsPerRow === 1 ? 50 : xOffset + c * xStep,
              y: actualRows === 1 ? 50 : 10 + r * yStep,
              label: `Roślina ${placed + 1}`,
            });
            placed++;
            if (placed >= finalCount) break;
          }
          if (placed >= finalCount) break;
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
      const usableDiameter = Math.max(0, diameterCm - 10);
      const area = Math.PI * Math.pow(usableDiameter / 2, 2);
      const plantArea = Math.pow(spacingCm, 2);

      if (diameterCm < 24 || minPlantVol > 8) {
        maxByGeometry = 1;
      } else {
        const estimatedGeom = Math.floor((area / plantArea) * 0.85);
        maxByGeometry = Math.max(1, estimatedGeom);
      }

      const finalCount = Math.max(1, Math.min(maxByVol, maxByGeometry));

      if (finalCount === 1) {
        points = [{ x: 50, y: 50, label: 'Roślina 1' }];
      } else if (finalCount === 2) {
        points = [
          { x: 35, y: 50, label: 'Roślina 1' },
          { x: 65, y: 50, label: 'Roślina 2' },
        ];
      } else if (finalCount === 3) {
        points = [
          { x: 50, y: 32, label: 'Roślina 1' },
          { x: 33, y: 65, label: 'Roślina 2' },
          { x: 67, y: 65, label: 'Roślina 3' },
        ];
      } else if (finalCount === 4) {
        points = [
          { x: 35, y: 35, label: 'Roślina 1' },
          { x: 65, y: 35, label: 'Roślina 2' },
          { x: 35, y: 65, label: 'Roślina 3' },
          { x: 65, y: 65, label: 'Roślina 4' },
        ];
      } else {
        points.push({ x: 50, y: 50, label: 'Roślina 1' });
        const remaining = finalCount - 1;
        const radius = remaining < 6 ? 25 : 35;
        const angleStep = (2 * Math.PI) / remaining;
        for (let i = 0; i < remaining; i++) {
          points.push({
            x: 50 + radius * Math.cos(i * angleStep),
            y: 50 + radius * Math.sin(i * angleStep),
            label: `Roślina ${i + 2}`,
          });
        }
      }

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

  const handleCalculate = () => {
    setStep(2);
    // Delikatne przewinięcie na górę kalkulatora
    const element = document.getElementById('pot-calculator-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToConfig = () => {
    setStep(1);
    const element = document.getElementById('pot-calculator-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      id="pot-calculator-container"
      className={`bg-white dark:bg-stone-900 rounded-3xl transition-colors ${
        isModal
          ? 'p-5 sm:p-7 max-w-4xl w-full mx-auto'
          : 'p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-stone-100 dark:border-stone-800 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
            <Ruler className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Kalkulator i szkicownik donicowy (Proces 2-krokowy)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {step === 1 ? 'Krok 1: Konfiguracja donicy i rośliny' : 'Krok 2: Wynik, makieta i weryfikacja wymogów'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {step === 1
              ? 'Wprowadź wymiary donicy, wybierz roślinę i materiał, a następnie kliknij przycisk „Oblicz”.'
              : 'Sprawdź, czy donica spełnia minimalne wymagania i zobacz zieloną makietę rozmieszczenia rozstawy.'}
          </p>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-center px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
          >
            Zamknij
          </button>
        )}
      </div>

      {/* PASEK KROKÓW (STEPPER) */}
      <div className="mb-6 bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-1.5 sm:p-2 border border-stone-200 dark:border-stone-700">
        <div className="grid grid-cols-2 gap-2">
          {/* Krok 1 */}
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`p-3 rounded-xl flex items-center gap-3 transition text-left cursor-pointer ${
              step === 1
                ? 'bg-white dark:bg-stone-900 shadow-xs border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700/60'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                step === 1
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              1
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Krok 1: Konfiguracja</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate hidden sm:block">
                Wybór rośliny, wymiary i materiał
              </div>
            </div>
          </button>

          {/* Krok 2 */}
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`p-3 rounded-xl flex items-center gap-3 transition text-left cursor-pointer ${
              step === 2
                ? 'bg-white dark:bg-stone-900 shadow-xs border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100'
                : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700/60'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                step === 2
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
              }`}
            >
              2
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">Krok 2: Wynik i makieta</div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate hidden sm:block">
                Weryfikacja, szkic 2D i rozstawa
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ZAWARTOSC KROKU 1: KONFIGURACJA */}
      {step === 1 && (
        <PotConfigStep
          availablePlants={availablePlants}
          selectedPlantId={selectedPlantId}
          onSelectPlantId={setSelectedPlantId}
          currentPlant={currentPlant}
          shape={shape}
          setShape={setShape}
          lengthCm={lengthCm}
          setLengthCm={setLengthCm}
          widthCm={widthCm}
          setWidthCm={setWidthCm}
          rectHeightCm={rectHeightCm}
          setRectHeightCm={setRectHeightCm}
          diameterCm={diameterCm}
          setDiameterCm={setDiameterCm}
          roundHeightCm={roundHeightCm}
          setRoundHeightCm={setRoundHeightCm}
          volumeLiters={volumeLiters}
          minPlantVol={minPlantVol}
          recPlantVol={recPlantVol}
          minDepth={minDepth}
          material={material}
          setMaterial={setMaterial}
          materialEvaluation={materialEvaluation}
          supports={supports}
          setSupports={setSupports}
          supportEvaluation={supportEvaluation}
          potCount={potCount}
          setPotCount={setPotCount}
          sowingMethod={sowingMethod}
          setSowingMethod={setSowingMethod}
          onApplyPreset={applyPreset}
          onCalculate={handleCalculate}
        />
      )}

      {/* ZAWARTOSC KROKU 2: WYNIK, OSTRZEZENIA I MAKIETA ROZSTAWY */}
      {step === 2 && (
        <PotResultStep
          currentPlant={currentPlant}
          volumeLiters={volumeLiters}
          heightCm={heightCm}
          minPlantVol={minPlantVol}
          recPlantVol={recPlantVol}
          minDepth={minDepth}
          spacingCm={spacingCm}
          plantingDepth={plantingDepth}
          plantingMethod={plantingMethod}
          requiredSupports={requiredSupports}
          supports={supports}
          material={material}
          potCount={potCount}
          sowingMethod={sowingMethod}
          setSowingMethod={setSowingMethod}
          shape={shape}
          lengthCm={lengthCm}
          widthCm={widthCm}
          rectHeightCm={rectHeightCm}
          diameterCm={diameterCm}
          roundHeightCm={roundHeightCm}
          capacityInfo={capacityInfo}
          isDepthOk={isDepthOk}
          isVolOk={isVolOk}
          activeSchemaView={activeSchemaView}
          setActiveSchemaView={setActiveSchemaView}
          onBackToConfig={handleBackToConfig}
          onSelectPlant={onSelectPlant}
        />
      )}
    </div>
  );
};
