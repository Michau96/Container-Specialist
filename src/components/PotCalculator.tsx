import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Ruler,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Plant, PotShape, LegacyPotMaterial, SupportType } from '../types';
import { PotConfigStep } from './PotConfigStep';
import { PotResultStep } from './PotResultStep';
import {
  evaluatePotMaterial,
  evaluatePlantSupport,
} from '../lib/potSupportEvaluations';
import {
  calculatePotFullSpecs,
  PotCalculationResult,
  POT_CALCULATION_VERSION,
} from '../lib/potCalculations';
import {
  PotCalculationSubmitPayload,
  generatePotCalculationIdempotencyKey,
} from '../types/potCalculationContract';
import { useLanguage } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';

const defaultPlants = defaultPlantsData as unknown as Plant[];

type Step = 1 | 2 | 3 | 4;

const STORAGE_KEY = 'doniczkowy_calculator_state';

interface StoredState {
  selectedPlantId: string;
  shape: PotShape;
  lengthCm: number;
  widthCm: number;
  rectHeightCm: number;
  diameterCm: number;
  roundHeightCm: number;
  material: LegacyPotMaterial;
  supports: SupportType;
  potCount: number;
  sowingMethod: 'nasiona' | 'sadzonka';
  step: Step;
  isSuccess: boolean;
  savedPayload?: PotCalculationSubmitPayload;
  savedTimestamp?: string;
  idempotencyKey?: string;
}

export interface PotCalculatorProps {
  plants: Plant[];
  initialPlant?: Plant | null;
  onSelectPlant?: (plant: Plant) => void;
  onClose?: () => void;
  isModal?: boolean;
  onSaveCalculation?: (result: PotCalculationResult, config: any) => Promise<void> | void;
  requestTimeoutMs?: number;
  simulateScenario?: 'timeout' | '400' | '500';
}

const STEPS = [
  {
    num: 1,
    id: 'configuration',
    titlePl: 'Krok 1: Konfiguracja',
    titleEn: 'Step 1: Configuration',
    subtitlePl: 'Wybór rośliny i sposobu startu',
    subtitleEn: 'Plant choice & start method',
  },
  {
    num: 2,
    id: 'dimensions',
    titlePl: 'Krok 2: Wymiary',
    titleEn: 'Step 2: Dimensions',
    subtitlePl: 'Kształt i wymiary w cm',
    subtitleEn: 'Shape & dimensions in cm',
  },
  {
    num: 3,
    id: 'material',
    titlePl: 'Krok 3: Materiał',
    titleEn: 'Step 3: Material',
    subtitlePl: 'Tworzywo i ocena agronomiczna',
    subtitleEn: 'Material & agronomic review',
  },
  {
    num: 4,
    id: 'summary',
    titlePl: 'Krok 4: Podsumowanie',
    titleEn: 'Step 4: Summary',
    subtitlePl: 'Wynik, makieta i weryfikacja',
    subtitleEn: 'Results, layout & verification',
  },
] as const;

export const PotCalculator: React.FC<PotCalculatorProps> = ({
  plants,
  initialPlant,
  onSelectPlant,
  onClose,
  isModal = false,
  onSaveCalculation,
  requestTimeoutMs = 8000,
  simulateScenario,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Gwarantujemy, że lista roślin nigdy nie jest pusta
  const availablePlants = useMemo(() => {
    return plants && plants.length > 0 ? plants : defaultPlants;
  }, [plants]);

  // Wczytywanie zapisanego stanu dla obsługi re-entry (Wymaganie 7 i 9)
  const savedState = useMemo(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as StoredState;
      }
    } catch {
      // Ignore parse errors
    }
    return null;
  }, []);

  // Stan kroków kalkulatora: 1 = Konfiguracja, 2 = Wymiary, 3 = Materiał, 4 = Podsumowanie
  const [step, setStep] = useState<Step>(savedState?.step ?? 1);

  // Wybrana roślina
  const [selectedPlantId, setSelectedPlantId] = useState<string>(
    savedState?.selectedPlantId || (initialPlant ? initialPlant.id : (availablePlants[0]?.id ?? 'pomidor-karlowy'))
  );

  // Synchronizacja przy zmianie initialPlant (jeśli nie było zapisanego stanu)
  useEffect(() => {
    if (initialPlant?.id && !savedState?.selectedPlantId) {
      setSelectedPlantId(initialPlant.id);
    }
  }, [initialPlant?.id, savedState?.selectedPlantId]);

  // Synchronizacja jeśli selectedPlantId nie istnieje w dostępnych roślinach
  useEffect(() => {
    if (availablePlants.length > 0 && !availablePlants.some((p) => p.id === selectedPlantId)) {
      setSelectedPlantId(availablePlants[0].id);
    }
  }, [availablePlants, selectedPlantId]);

  // Kształt donicy
  const [shape, setShape] = useState<PotShape>(savedState?.shape || 'rectangular');

  // Wymiary w cm
  // Prostokątna:
  const [lengthCm, setLengthCm] = useState<number>(savedState?.lengthCm ?? 60);
  const [widthCm, setWidthCm] = useState<number>(savedState?.widthCm ?? 20);
  const [rectHeightCm, setRectHeightCm] = useState<number>(savedState?.rectHeightCm ?? 20);

  // Okrągła:
  const [diameterCm, setDiameterCm] = useState<number>(savedState?.diameterCm ?? 30);
  const [roundHeightCm, setRoundHeightCm] = useState<number>(savedState?.roundHeightCm ?? 25);

  // Materiał
  const [material, setMaterial] = useState<LegacyPotMaterial>(savedState?.material || 'plastic');

  // Podpora
  const [supports, setSupports] = useState<SupportType>(savedState?.supports || 'stake');

  // Liczba donic
  const [potCount, setPotCount] = useState<number>(savedState?.potCount ?? 1);

  // Metoda startu: nasiona vs gotowa sadzonka
  const [sowingMethod, setSowingMethod] = useState<'nasiona' | 'sadzonka'>(savedState?.sowingMethod || 'nasiona');

  // Statusy zapisu / kalkulacji: pending, success, error (Wymaganie 5, 6, 9)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(savedState?.isSuccess ?? false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedPayload, setSavedPayload] = useState<PotCalculationSubmitPayload | undefined>(savedState?.savedPayload);

  // Wyświetlany widok schematu w kroku 4 dla kompatybilności wstecznej
  const [activeSchemaView, setActiveSchemaView] = useState<'top_layout' | 'soil_layers' | 'cost_estimates' | 'technical_load'>('top_layout');

  // Obsługa nawigacji wstecz przeglądarki (Wymaganie 7 i 8: browser back navigation)
  useEffect(() => {
    const handlePopState = () => {
      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
            const restored = JSON.parse(raw) as StoredState;
            if (restored) {
              if (restored.selectedPlantId) setSelectedPlantId(restored.selectedPlantId);
              if (restored.shape) setShape(restored.shape);
              if (typeof restored.lengthCm === 'number') setLengthCm(restored.lengthCm);
              if (typeof restored.widthCm === 'number') setWidthCm(restored.widthCm);
              if (typeof restored.rectHeightCm === 'number') setRectHeightCm(restored.rectHeightCm);
              if (typeof restored.diameterCm === 'number') setDiameterCm(restored.diameterCm);
              if (typeof restored.roundHeightCm === 'number') setRoundHeightCm(restored.roundHeightCm);
              if (restored.material) setMaterial(restored.material);
              if (restored.supports) setSupports(restored.supports);
              if (typeof restored.potCount === 'number') setPotCount(restored.potCount);
              if (restored.sowingMethod) setSowingMethod(restored.sowingMethod);
              if (restored.step) setStep(restored.step);
              if (typeof restored.isSuccess === 'boolean') setIsSuccess(restored.isSuccess);
            }
          }
        }
      } catch {
        // Ignore popstate parsing errors
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Obliczenia objętości donicy w litrach i pełnych parametrów agrotechnicznych
  const heightCm = shape === 'rectangular' ? rectHeightCm : roundHeightCm;

  const potCalcResult: PotCalculationResult = useMemo(() => {
    return calculatePotFullSpecs({
      shape,
      material,
      length: shape === 'rectangular' ? lengthCm : undefined,
      width: shape === 'rectangular' ? widthCm : undefined,
      height: heightCm,
      diameter: shape === 'round' ? diameterCm : undefined,
      potCount,
    });
  }, [shape, material, lengthCm, widthCm, heightCm, diameterCm, potCount]);

  const volumeLiters = potCalcResult.volume.grossVolumeL;

  // Walidacja czy istnieje poprawny wynik kalkulacji (Wymaganie 4)
  const hasValidCalculationResult = useMemo(() => {
    if (!potCalcResult) return false;
    const vol = potCalcResult.volume?.grossVolumeL;
    if (typeof vol !== 'number' || isNaN(vol) || vol <= 0) return false;
    if (shape === 'rectangular') {
      if (typeof lengthCm !== 'number' || isNaN(lengthCm) || lengthCm <= 0) return false;
      if (typeof widthCm !== 'number' || isNaN(widthCm) || widthCm <= 0) return false;
      if (typeof rectHeightCm !== 'number' || isNaN(rectHeightCm) || rectHeightCm <= 0) return false;
    } else {
      if (typeof diameterCm !== 'number' || isNaN(diameterCm) || diameterCm <= 0) return false;
      if (typeof roundHeightCm !== 'number' || isNaN(roundHeightCm) || roundHeightCm <= 0) return false;
    }
    return true;
  }, [potCalcResult, shape, lengthCm, widthCm, rectHeightCm, diameterCm, roundHeightCm]);

  // Zapis do localStorage w celu zachowania wartości przy re-entry (Wymaganie 6, 7, 9)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stateToSave: StoredState = {
          selectedPlantId,
          shape,
          lengthCm,
          widthCm,
          rectHeightCm,
          diameterCm,
          roundHeightCm,
          material,
          supports,
          potCount,
          sowingMethod,
          step,
          isSuccess,
          savedPayload,
          idempotencyKey: savedPayload?.idempotencyKey,
          savedTimestamp: savedPayload?.timestamp,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [
    selectedPlantId,
    shape,
    lengthCm,
    widthCm,
    rectHeightCm,
    diameterCm,
    roundHeightCm,
    material,
    supports,
    potCount,
    sowingMethod,
    step,
    isSuccess,
    savedPayload,
  ]);

  // Wymogi rośliny
  const minPlantVol = currentPlant?.pot.min_volume_l ?? 5;
  const recPlantVol = currentPlant?.pot.recommended_volume_l ?? 10;
  const minDepth = currentPlant?.pot.min_depth_cm ?? 18;
  const spacingCm = currentPlant?.spacing_guide?.spacing_cm ?? 20;
  const plantingDepth = currentPlant?.spacing_guide?.planting_depth_cm ?? 2;
  const plantingMethod = currentPlant?.spacing_guide?.planting_method ?? (isEn ? 'Plant to root ball depth.' : 'Sadź na głębokość bryły korzeniowej.');
  const requiredSupports = currentPlant?.spacing_guide?.supports_needed ?? (isEn ? 'Stake or none' : 'Palik lub brak');

  // Obliczenie maksymalnej liczby roślin mieszczących się w donicy
  const capacityInfo = useMemo(() => {
    const plantLabelPrefix = isEn ? 'Plant' : 'Roślina';
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
        points = [{ x: 50, y: 50, label: `${plantLabelPrefix} 1` }];
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
              label: `${plantLabelPrefix} ${placed + 1}`,
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
        dimensionText: isEn
          ? `${lengthCm} cm × ${widthCm} cm, height ${rectHeightCm} cm`
          : `${lengthCm} cm × ${widthCm} cm, wys. ${rectHeightCm} cm`,
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
        points = [{ x: 50, y: 50, label: `${plantLabelPrefix} 1` }];
      } else if (finalCount === 2) {
        points = [
          { x: 35, y: 50, label: `${plantLabelPrefix} 1` },
          { x: 65, y: 50, label: `${plantLabelPrefix} 2` },
        ];
      } else if (finalCount === 3) {
        points = [
          { x: 50, y: 32, label: `${plantLabelPrefix} 1` },
          { x: 33, y: 65, label: `${plantLabelPrefix} 2` },
          { x: 67, y: 65, label: `${plantLabelPrefix} 3` },
        ];
      } else if (finalCount === 4) {
        points = [
          { x: 35, y: 35, label: `${plantLabelPrefix} 1` },
          { x: 65, y: 35, label: `${plantLabelPrefix} 2` },
          { x: 35, y: 65, label: `${plantLabelPrefix} 3` },
          { x: 65, y: 65, label: `${plantLabelPrefix} 4` },
        ];
      } else {
        points.push({ x: 50, y: 50, label: `${plantLabelPrefix} 1` });
        const remaining = finalCount - 1;
        const radius = remaining < 6 ? 25 : 35;
        const angleStep = (2 * Math.PI) / remaining;
        for (let i = 0; i < remaining; i++) {
          points.push({
            x: 50 + radius * Math.cos(i * angleStep),
            y: 50 + radius * Math.sin(i * angleStep),
            label: `${plantLabelPrefix} ${i + 2}`,
          });
        }
      }

      return {
        recommendedCount: finalCount,
        maxByGeometry,
        maxByVol,
        points: points.slice(0, finalCount),
        dimensionText: isEn
          ? `Diameter ⌀ ${diameterCm} cm, height ${roundHeightCm} cm`
          : `Średnica ⌀ ${diameterCm} cm, wys. ${roundHeightCm} cm`,
      };
    }
  }, [shape, lengthCm, widthCm, rectHeightCm, diameterCm, roundHeightCm, volumeLiters, minPlantVol, spacingCm, isEn]);

  // Ocena dopasowania donicy
  const isDepthOk = heightCm >= minDepth;
  const isVolOk = volumeLiters >= minPlantVol;
  const isPotSuitable = isDepthOk && isVolOk;

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

  const handleGoToStep = (newStep: Step) => {
    setStep(newStep);
    const element = document.getElementById('pot-calculator-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Główna funkcja wykonania kalkulacji i zapisu (Wymaganie 1, 2, 3, 4, 5, 6)
  const handleCalculate = useCallback(async () => {
    if (!hasValidCalculationResult || isLoading) return; // Zapobieganie zduplikowanym zgłoszeniom (Wymaganie 4, 5)

    setIsLoading(true);
    setServerError(null);

    // Generowanie klucza idempotencji na podstawie konfiguracji parametrów (Wymaganie 3)
    const idempotencyKey = generatePotCalculationIdempotencyKey({
      plantId: selectedPlantId,
      shape,
      lengthCm: shape === 'rectangular' ? lengthCm : undefined,
      widthCm: shape === 'rectangular' ? widthCm : undefined,
      heightCm,
      diameterCm: shape === 'round' ? diameterCm : undefined,
      material,
      potCount,
      sowingMethod,
      formulaVersion: POT_CALCULATION_VERSION,
    });

    const timestamp = new Date().toISOString();

    // Pełny jawny kontrakt danych kalkulacji (Wymaganie 1 i 2)
    const submitPayload: PotCalculationSubmitPayload = {
      idempotencyKey,
      plantId: selectedPlantId,
      plantName: currentPlant.name,
      shape,
      material,
      dimensions: {
        lengthCm: shape === 'rectangular' ? lengthCm : undefined,
        widthCm: shape === 'rectangular' ? widthCm : undefined,
        heightCm,
        diameterCm: shape === 'round' ? diameterCm : undefined,
        unit: 'cm',
      },
      potCount,
      sowingMethod,
      formulaVersion: POT_CALCULATION_VERSION,
      resultValues: {
        grossVolumeL: potCalcResult.volume.grossVolumeL,
        netUsableVolumeL: potCalcResult.volume.netUsableVolumeL,
        soilVolumeL: potCalcResult.substrate.soilVolumeL,
        drainageVolumeL: potCalcResult.substrate.drainageVolumeL,
        bagCount50L: potCalcResult.bags.soilBags50L,
        bagCount20L: potCalcResult.bags.soilBags20L,
        totalWetMassKg: potCalcResult.mass.wetTotalMassKg,
        balconyLoadKgPerM2: potCalcResult.balconyLoad.distributedLoadKgM2,
        calculationVersion: potCalcResult.version,
      },
      fullResult: potCalcResult,
      timestamp,
    };

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => {
      controller.abort();
    }, requestTimeoutMs);

    try {
      if (onSaveCalculation) {
        await onSaveCalculation(potCalcResult, submitPayload);
      } else {
        const bodyToSend: any = { ...submitPayload };
        if (simulateScenario === '500') bodyToSend.simulate500 = true;
        if (simulateScenario === '400') bodyToSend.simulate400 = true;
        if (simulateScenario === 'timeout') bodyToSend.simulateTimeout = true;

        const response = await fetch('/api/pot-calculations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify(bodyToSend),
        });

        if (!response.ok) {
          const errJson = await response.json().catch(() => ({}));
          const defaultMsg =
            response.status >= 500
              ? (isEn ? `Server error (${response.status})` : `Błąd serwera (${response.status})`)
              : (isEn ? `Client error (${response.status})` : `Błąd zapytania (${response.status})`);
          throw new Error(errJson.error || defaultMsg);
        }
      }

      setIsSuccess(true);
      setSavedPayload(submitPayload);
      setStep(4);

      // Aktualizacja stanu zapisanego w pamięci (Wymaganie 2 i 8)
      try {
        if (typeof window !== 'undefined') {
          const stateToSave: StoredState = {
            selectedPlantId,
            shape,
            lengthCm,
            widthCm,
            rectHeightCm,
            diameterCm,
            roundHeightCm,
            material,
            supports,
            potCount,
            sowingMethod,
            step: 4,
            isSuccess: true,
            savedPayload: submitPayload,
            savedTimestamp: timestamp,
            idempotencyKey,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }
      } catch {
        // Ignore localStorage error
      }
    } catch (err: any) {
      // Zachowanie wprowadzonych wartości i wyświetlenie akcji ponowienia (Wymaganie 6)
      setIsSuccess(false);
      if (err?.name === 'AbortError') {
        setServerError(
          isEn
            ? 'Request timed out. Please try again.'
            : 'Przekroczono limit czasu połączenia (timeout). Spróbuj ponownie.'
        );
      } else {
        setServerError(
          err?.message ||
            (isEn
              ? 'Server error occurred during calculation'
              : 'Wystąpił błąd serwera podczas zapisu obliczeń')
        );
      }
    } finally {
      clearTimeout(timeoutTimer);
      setIsLoading(false);
    }
  }, [
    hasValidCalculationResult,
    isLoading,
    onSaveCalculation,
    potCalcResult,
    selectedPlantId,
    shape,
    material,
    lengthCm,
    widthCm,
    rectHeightCm,
    heightCm,
    diameterCm,
    roundHeightCm,
    potCount,
    sowingMethod,
    currentPlant.name,
    requestTimeoutMs,
    simulateScenario,
    isEn,
    supports,
  ]);

  // Jawny reset formularza - wykonywany TYLKO na żądanie użytkownika (Wymaganie 7)
  const handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
    setSelectedPlantId(availablePlants[0]?.id ?? 'pomidor-karlowy');
    setShape('rectangular');
    setLengthCm(60);
    setWidthCm(20);
    setRectHeightCm(20);
    setDiameterCm(30);
    setRoundHeightCm(25);
    setMaterial('plastic');
    setSupports('stake');
    setPotCount(1);
    setSowingMethod('nasiona');
    setStep(1);
    setIsSuccess(false);
    setSavedPayload(undefined);
    setServerError(null);
    setIsLoading(false);
  };

  // Etykieta głównego przycisku CTA - stały polski string "Oblicz" (Wymaganie 1)
  const ctaLabel = isEn ? 'Calculate' : 'Oblicz';

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
            <span>{isEn ? 'Pot Calculator & Layout Planner (4 Steps)' : 'Kalkulator i szkicownik donicowy (Proces 4-krokowy)'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            {step === 1
              ? (isEn ? 'Step 1: Container & Plant Configuration' : 'Krok 1: Konfiguracja donicy i rośliny')
              : step === 2
              ? (isEn ? 'Step 2: Container Shape & Dimensions' : 'Krok 2: Kształt i wymiary donicy')
              : step === 3
              ? (isEn ? 'Step 3: Container Material & Review' : 'Krok 3: Materiał donicy i ocena agronomiczna')
              : (isEn ? 'Step 4: Results, Layout & Requirement Verification' : 'Krok 4: Wynik, makieta i weryfikacja wymogów')}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {step === 1
              ? (isEn
                  ? 'Select your crop, start method, and quantity of containers.'
                  : 'Wybierz uprawianą roślinę, sposób startu oraz liczbę donic do uprawy.')
              : step === 2
              ? (isEn
                  ? 'Set container shape and exact dimensions in centimeters.'
                  : 'Wybierz kształt pojemnika i ustaw precyzyjne wymiary w centymetrach.')
              : step === 3
              ? (isEn
                  ? 'Select container material and review agronomic evaluation for your plant.'
                  : 'Wybierz materiał donicy i zapoznaj się z oceną agronomiczną dla wybranej rośliny.')
              : (isEn
                  ? 'Check if the container meets agronomic requirements and view the 2D spacing layout.'
                  : 'Sprawdź, czy donica spełnia minimalne wymagania i zobacz zieloną makietę rozmieszczenia rozstawy.')}
          </p>
        </div>

        {isModal && onClose && (
          <button
            id="close-pot-calculator-modal-btn"
            type="button"
            onClick={onClose}
            className="self-end sm:self-center min-w-[44px] min-h-[44px] px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
            aria-label={isEn ? 'Close' : 'Zamknij'}
          >
            {isEn ? 'Close' : 'Zamknij'}
          </button>
        )}
      </div>

      {/* PASEK KROKÓW (STEPPER) Z DOSTĘPNYM ANONSOWANIEM */}
      <nav aria-label={isEn ? 'Pot calculator steps' : 'Kroki kalkulatora donic'} className="mb-6">
        {/* Anons dla czytników ekranowych o aktualnym kroku */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {isEn
            ? `Step ${step} of 4: ${STEPS[step - 1].titleEn}. ${STEPS[step - 1].subtitleEn}`
            : `Krok ${step} z 4: ${STEPS[step - 1].titlePl}. ${STEPS[step - 1].subtitlePl}`}
        </div>

        <ol role="list" className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-1.5 sm:p-2 border border-stone-200 dark:border-stone-700">
          {STEPS.map((s) => {
            const isCurrent = step === s.num;
            const isCompleted = step > s.num;
            return (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => handleGoToStep(s.num as Step)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`w-full p-2.5 sm:p-3 rounded-xl flex items-center gap-2.5 sm:gap-3 transition text-left cursor-pointer ${
                    isCurrent
                      ? 'bg-white dark:bg-stone-900 shadow-xs border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 font-bold'
                      : isCompleted
                      ? 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700/60'
                      : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100/50 dark:hover:bg-stone-700/30'
                  }`}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-emerald-700 text-white'
                        : isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> : s.num}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">
                      {isEn ? s.titleEn : s.titlePl}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate hidden sm:block font-normal">
                      {isEn ? s.subtitleEn : s.subtitlePl}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* KOMUNIKAT BŁĘDU SERWERA I PRZYCISK PONOWIENIA (WYMAGANIE 9) */}
      {serverError && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/80 border border-red-300 dark:border-red-700 text-red-950 dark:text-red-100 flex items-center justify-between gap-3 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-semibold">{serverError}</span>
          </div>
          <button
            type="button"
            onClick={handleCalculate}
            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold text-xs transition cursor-pointer shrink-0"
          >
            {isEn ? 'Retry' : 'Ponów próbę'}
          </button>
        </div>
      )}

      {/* BANER POTWIERDZENIA SUKCESU (WYMAGANIE 6 & 8: data-testid="pot-calculator-success") */}
      {isSuccess && (
        <div
          role="status"
          data-testid="pot-calculator-success"
          className="mb-6 p-4 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">
              {isEn
                ? 'Calculation completed and saved successfully!'
                : 'Obliczenia wykonane pomyślnie! Parametry zostały zachowane.'}
            </span>
          </div>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-emerald-200 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 shrink-0">
            {volumeLiters} L
          </span>
        </div>
      )}

      {/* KROK 1: TYLKO KONFIGURACJA */}
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
          activeStep="configuration"
        />
      )}

      {/* KROK 2: TYLKO WYMIARY */}
      {step === 2 && (
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
          activeStep="dimensions"
        />
      )}

      {/* KROK 3: TYLKO MATERIAŁ */}
      {step === 3 && (
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
          activeStep="material"
        />
      )}

      {/* KROK 4: WYNIK, OSTRZEŻENIA, MAKIETA I AKORDEONY */}
      {step === 4 && (
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
          calculationResult={potCalcResult}
          onBackToConfig={() => handleGoToStep(1)}
          onSelectPlant={onSelectPlant}
        />
      )}

      {/* PRZYKLEJONA STOPKA (STICKY FOOTER NA MOBILE I DESKTOP - WYMAGANIE 2, 3, 4, 5, 8) */}
      <div className="sticky bottom-0 z-30 -mx-5 sm:-mx-7 -mb-5 sm:-mb-7 mt-6 p-4 sm:p-5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 shadow-lg rounded-b-3xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-full">
          {/* Podgląd stanu donicy */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-stone-700 dark:text-stone-300">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
              <span>🌱</span>
              <span>{currentPlant.name}</span>
            </span>
            <span className="text-stone-400">•</span>
            <span>
              {shape === 'rectangular'
                ? `${lengthCm}×${widthCm}×${rectHeightCm} cm`
                : `⌀ ${diameterCm} cm, wys. ${roundHeightCm} cm`}
            </span>
            <span className="text-stone-400">•</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              {volumeLiters} L
            </span>
          </div>

          {/* Przyciski nawigacyjne oraz GŁÓWNY PRZYCISK CTA (Wymaganie 1, 3, 4, 5, 8) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Przycisk jawnego startu od nowa - nie resetuje formularza automatycznie (Wymaganie 7) */}
            <button
              type="button"
              data-testid="pot-calculator-reset"
              onClick={handleReset}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isEn ? 'Start over' : 'Zacznij od nowa'}</span>
            </button>

            {/* Nawigacja wstecz */}
            {step > 1 && (
              <button
                type="button"
                onClick={() => handleGoToStep((step - 1) as Step)}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isEn ? 'Back' : 'Wstecz'}</span>
              </button>
            )}

            {/* Nawigacja do kolejnych kroków konfiguracji */}
            {step === 1 && (
              <button
                type="button"
                onClick={() => handleGoToStep(2)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{isEn ? 'Next: Dimensions' : 'Dalej: Wymiary'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => handleGoToStep(3)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-600 text-xs font-bold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>{isEn ? 'Next: Material' : 'Dalej: Materiał'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* GŁÓWNY PRZYCISK CTA "OBLICZ" (WYMAGANIE 1, 3, 4, 5, 8) */}
            <button
              type="button"
              id="pot-calc-submit-btn"
              data-testid="pot-calculator-submit"
              disabled={!hasValidCalculationResult || isLoading}
              aria-disabled={!hasValidCalculationResult || isLoading}
              aria-busy={isLoading}
              onClick={handleCalculate}
              className="min-h-[48px] px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-stone-300 dark:disabled:bg-stone-700 disabled:text-stone-500 dark:disabled:text-stone-400 disabled:shadow-none disabled:active:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{ctaLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
