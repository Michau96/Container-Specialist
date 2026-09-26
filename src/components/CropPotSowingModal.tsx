import React, { useState } from 'react';
import {
  X,
  Ruler,
  Calendar,
  Check,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Plus,
  Minus,
  Layers,
  CopyPlus,
  Droplets,
} from 'lucide-react';
import {
  Plant,
  MyCropItem,
  PotConfig,
  SowingConfig,
  PotType,
  PotMaterial,
  SowingMethod,
} from '../types';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';
import { getPlantVarieties, getEffectivePlantRequirements } from '../lib/varietyData';
import { evaluatePotMaterial } from '../lib/potSupportEvaluations';
import { getPlantGreenhouseInfo } from '../lib/greenhouse';
import { CropCostEstimatorCard } from './CropCostEstimatorCard';
import { SoilShoppingGuideCard } from './SoilShoppingGuideCard';
import { useLanguage } from '../lib/LanguageContext';
import { getPlantName } from '../lib/plantTranslations';

interface Props {
  plant: Plant | null;
  crop: MyCropItem | null;
  onClose: () => void;
  onSave: (updatedCrop: MyCropItem) => void;
  onAddAsNewCrop?: (plant: Plant, varietyName: string, potCount: number) => void;
}

const getPotTypes = (isEn: boolean): { key: PotType; label: string; icon: string; desc: string }[] => [
  {
    key: 'okragla',
    label: isEn ? 'Round Pot' : 'Donica okrągła',
    icon: '🪴',
    desc: isEn ? 'Classic deep floor pot' : 'Klasyczna głęboka donica na podłodze',
  },
  {
    key: 'skrzynka',
    label: isEn ? 'Window Box / Planter' : 'Skrzynka podłużna',
    icon: '🪟',
    desc: isEn ? 'Hangs on railing or windowsill 40–80 cm' : 'Zawieszana na barierce lub na parapecie 40–80 cm',
  },
  {
    key: 'kwadratowa',
    label: isEn ? 'Square Pot' : 'Donica kwadratowa',
    icon: '📦',
    desc: isEn ? 'Stable floor and corner planter' : 'Stabilna donica podłogowa i narożna',
  },
  {
    key: 'worek_growbag',
    label: isEn ? 'Growbag Fabric Pot' : 'Worek tkaninowy Growbag',
    icon: '🎒',
    desc: isEn ? 'Air breathable, prevents root circling' : 'Przepuszcza powietrze, zapobiega skręcaniu korzeni',
  },
  {
    key: 'samonawadniajaca',
    label: isEn ? 'Self-Watering Planter' : 'Skrzynka samonawadniająca',
    icon: '💧',
    desc: isEn ? 'Double bottom with water reservoir' : 'Z podwójnym dnem i wlewem rezerwowym',
  },
  {
    key: 'wiszaca',
    label: isEn ? 'Hanging Basket' : 'Kosz wiszący amplia',
    icon: '🧺',
    desc: isEn ? 'Suspended from ceiling or railing' : 'Podwieszany do sufitu lub barierki',
  },
];

const getPotMaterials = (isEn: boolean): { key: PotMaterial; label: string; note: string }[] => [
  {
    key: 'plastik',
    label: isEn ? 'Plastic / Synthetic' : 'Plastik / Tworzywo sztuczne',
    note: isEn ? 'Lightweight and moisture retaining' : 'Lekki i szczelny, dobrze trzyma wilgoć',
  },
  {
    key: 'ceramika_terakota',
    label: isEn ? 'Terracotta / Unglazed Ceramic' : 'Ceramika / Terakota nieszkliwiona',
    note: isEn ? 'Breathable, naturally cools roots' : 'Oddychająca i porowata, naturalnie chłodzi korzenie',
  },
  {
    key: 'tkanina',
    label: isEn ? 'Fabric / Smart Pot' : 'Agrowłóknina / Tkanina / Smart Pot',
    note: isEn ? 'Maximum root aeration and air-pruning' : 'Maksymalne napowietrzenie korzeni i air-pruning',
  },
  {
    key: 'drewno',
    label: isEn ? 'Natural Wood' : 'Drewno naturalne',
    note: isEn ? 'Great thermal root insulation' : 'Świetna naturalna termoizolacja bryły korzeniowej',
  },
];

export const CropPotSowingModal: React.FC<Props> = ({
  plant,
  crop,
  onClose,
  onSave,
  onAddAsNewCrop,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  if (!plant || !crop) return null;

  const POT_TYPES = getPotTypes(isEn);
  const POT_MATERIALS = getPotMaterials(isEn);

  const availableVarieties = getPlantVarieties(plant);
  const initialVarietyStr =
    typeof crop.selectedVariety === 'string'
      ? crop.selectedVariety
      : (crop.selectedVariety as any)?.name || (availableVarieties[0]?.name ?? (isEn ? 'Standard' : 'Standardowa'));
  const [selectedVariety, setSelectedVariety] = useState<string>(initialVarietyStr);

  const varietyDetails = getEffectivePlantRequirements(plant, selectedVariety);

  // Pot state
  const [potCount, setPotCount] = useState<number>(crop.potCount || crop.pot?.quantity || 1);
  const [potType, setPotType] = useState<PotType>(crop.pot?.potType || 'okragla');
  const [volumeL, setVolumeL] = useState<number>(
    crop.pot?.volumeL || varietyDetails.minVolumeL || plant.pot.min_volume_l || 10
  );
  const [material, setMaterial] = useState<PotMaterial>(crop.pot?.material || 'plastik');
  const [hasDrainage, setHasDrainage] = useState<boolean>(crop.pot?.hasDrainage ?? true);
  const [locationNote, setLocationNote] = useState<string>(crop.pot?.locationNote || crop.customPotName || '');

  const [depthCm, setDepthCm] = useState<number>(crop.pot?.depthCm || plant.pot.min_depth_cm || 20);
  const [diameterOrWidthCm, setDiameterOrWidthCm] = useState<number>(crop.pot?.diameterOrWidthCm || 25);

  const greenhouseInfo = getPlantGreenhouseInfo(plant);
  const [inGreenhouse, setInGreenhouse] = useState<boolean>(
    crop.inGreenhouse ?? (greenhouseInfo.suitability === 'recommended')
  );

  const [sowingMethod, setSowingMethod] = useState<SowingMethod>(crop.sowing?.method || 'nasiona');
  const [sowingDate, setSowingDate] = useState<string>(
    crop.sowing?.date || new Date().toISOString().split('T')[0]
  );
  const [sowingLocation, setSowingLocation] = useState<'parapet_wewnetrzny' | 'balkon_bezposrednio' | 'szklarenka'>(
    crop.sowing?.sowingLocation || 'balkon_bezposrednio'
  );

  // Quick date helper
  const setRelativeDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    setSowingDate(d.toISOString().split('T')[0]);
  };

  // Preview timeline info on the fly
  const tempCrop: MyCropItem = {
    ...crop,
    selectedVariety,
    potCount,
    pot: {
      potType,
      volumeL,
      material,
      hasDrainage,
      locationNote,
      depthCm,
      diameterOrWidthCm,
      quantity: potCount,
    },
    sowing: {
      method: sowingMethod,
      date: sowingDate,
      sowingLocation,
    },
  };

  const previewInfo = getCropTimelineInfo(plant, tempCrop);

  const handleSave = () => {
    const updatedPot: PotConfig = {
      potType,
      volumeL: Number(volumeL),
      material,
      hasDrainage,
      locationNote: locationNote.trim(),
      depthCm: Number(depthCm),
      diameterOrWidthCm: Number(diameterOrWidthCm),
      quantity: potCount,
    };

    const updatedSowing: SowingConfig = {
      method: sowingMethod,
      date: sowingDate,
      sowingLocation,
    };

    const matched = availableVarieties.find((v) => v.name === selectedVariety);

    const updatedCrop: MyCropItem = {
      ...crop,
      selectedVariety,
      varietyBadge: matched?.badge || crop.varietyBadge || (isEn ? 'Container Variety' : 'Odmiana donicowa'),
      potCount,
      customPotName:
        locationNote.trim() ||
        `${potCount > 1 ? `${potCount}x ` : ''}${volumeL}L (${POT_TYPES.find((p) => p.key === potType)?.label})`,
      pot: updatedPot,
      sowing: updatedSowing,
      inGreenhouse,
      stage:
        previewInfo.currentPhase.id === 'kielkowanie'
          ? 'siew'
          : previewInfo.currentPhase.id.includes('liscie')
          ? 'rozsada'
          : previewInfo.currentPhase.id.includes('kwitn')
          ? 'kwitnie'
          : previewInfo.currentPhase.id.includes('owoc') || previewInfo.currentPhase.id.includes('dojrzew')
          ? 'owocuje'
          : previewInfo.currentPhase.id.includes('zbior')
          ? 'zbior'
          : 'rosnie',
    };

    onSave(updatedCrop);
    onClose();
  };

  const minReqVolume = varietyDetails.minVolumeL;
  const isTooSmall = volumeL < minReqVolume * 0.8;
  const isOptimal = volumeL >= minReqVolume;
  const totalVolumeAllPots = volumeL * potCount;

  return (
    <div
      id="crop-pot-sowing-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Variety specs, pots & sowing calendar' : 'Parametry odmiany, donic i terminarz siewu'}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
              <span>{getPlantName(plant, language)}</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-800/80 text-emerald-200 border border-emerald-700">
                {isEn ? 'Variety:' : 'Odmiana:'} {selectedVariety}
              </span>
              {potCount > 1 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-stone-800 text-stone-200 border border-stone-700">
                  {potCount}x {isEn ? 'identical pots' : 'identyczne donice'}
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-lg">
              {isEn
                ? 'Customize variety, pot dimensions and count for precise watering doses, soil requirements and care calendar.'
                : 'Dopasuj odmianę, wymiary pojedynczej donicy oraz ich liczbę, aby uzyskać dokładne dawki wody, zapotrzebowanie na ziemię i kalendarz pielęgnacji.'}
            </p>
          </div>

          <button
            id="close-sowing-modal-btn"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
            title={isEn ? 'Close' : 'Zamknij'}
            aria-label={isEn ? 'Close' : 'Zamknij'}
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-7 max-h-[75vh] overflow-y-auto text-stone-800 dark:text-stone-200">
          
          {/* SECTION 0: VARIETY PICKER & AGRONOMIC IMPACT */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? 'Selected variety / cultivar:' : 'Wybrana odmiana / gatunek uprawny:'}</span>
              </label>

              {/* Variety dropdown */}
              <select
                value={selectedVariety}
                onChange={(e) => {
                  const newVar = e.target.value;
                  setSelectedVariety(newVar);
                  const reqs = getEffectivePlantRequirements(plant, newVar);
                  if (volumeL < reqs.minVolumeL) {
                    setVolumeL(reqs.minVolumeL);
                  }
                }}
                className="p-2 bg-white dark:bg-stone-900 border border-emerald-400 dark:border-emerald-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100"
              >
                {availableVarieties.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.badge}) – min. {v.min_pot_vol_l || plant.pot.min_volume_l}L
                  </option>
                ))}
              </select>
            </div>

            {/* Variety Agronomic specifics banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2.5 bg-white/90 dark:bg-stone-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
                  {isEn ? '🌿 Habit & Min. Pot:' : '🌿 Pokrój i min. donica:'}
                </span>
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block">
                  {varietyDetails.habit}
                </span>
                <span className="text-[11px] text-stone-600 dark:text-stone-300">
                  {isEn ? `Min. ${varietyDetails.minVolumeL}L soil • spacing ${varietyDetails.spacingCm} cm` : `Min. ${varietyDetails.minVolumeL}L ziemi • rozstawa ${varietyDetails.spacingCm} cm`}
                </span>
              </div>

              <div className="p-2.5 bg-white/90 dark:bg-stone-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block">
                  {isEn ? '💧 Watering Profile:' : '💧 Wymagania wodne odmiany:'}
                </span>
                <span className="text-[11px] text-stone-800 dark:text-stone-200 leading-snug">
                  {varietyDetails.wateringProfile}
                </span>
              </div>
            </div>

            {/* Sowing & Bamboo Stake Agronomic Alert for Variety */}
            <div className="pt-1 space-y-1.5">
              {/* Sowing method badge */}
              <div className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs flex items-center justify-between">
                <span className="text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5">
                  <span>🌱</span>
                  <span>{isEn ? 'Sowing pattern:' : 'Metoda siewu w schemacie:'}</span>
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    plant.spacing_guide?.sowing_type === 'gniazdowo'
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                  }`}
                >
                  {plant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? (isEn ? 'Cluster sowing (in hills)' : 'Siew gniazdowy (gniazdowo)')
                    : plant.spacing_guide?.sowing_type === 'pojedynczo'
                    ? (isEn ? 'Single seed sowing' : 'Siew pojedynczy (pojedynczo)')
                    : plant.spacing_guide?.sowing_type === 'rzutowo'
                    ? (isEn ? 'Broadcast sowing' : 'Siew rzutowy')
                    : plant.spacing_guide?.sowing_type === 'grzybnia'
                    ? (isEn ? 'Mycelium spawn' : 'Grzybnia')
                    : (isEn ? 'Seedling transplant' : 'Sadzenie sadzonki')}
                </span>
              </div>

              {/* Bamboo stake - POKAZYWANY TYLKO GDY NIEZBĘDNY */}
              {(varietyDetails.requiresSupport || plant.spacing_guide?.requires_bamboo_stake) && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-300 dark:border-amber-800 text-xs flex items-center justify-between text-amber-950 dark:text-amber-200">
                  <span className="font-semibold flex items-center gap-1.5 text-amber-900 dark:text-amber-200">
                    <span>🎋</span>
                    <span>{isEn ? 'Bamboo stake support:' : 'Palik bambusowy:'}</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-200/90 dark:bg-amber-900 text-amber-950 dark:text-amber-100 px-2 py-0.5 rounded-md border border-amber-400 dark:border-amber-700">
                    {isEn ? 'Essential for growth' : 'Niezbędny do uprawy'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 1: TWOJA DONICA & QUANTITY */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Ruler className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? '1. Pot Configuration & Quantity' : '1. Konfiguracja i liczba donic'}</span>
              </div>
              <span className="text-xs font-medium text-stone-500">
                {isEn ? 'Requirement for' : 'Wymóg dla'} '{selectedVariety}': <strong className="text-emerald-700 dark:text-emerald-400">min. {minReqVolume}L</strong>
              </span>
            </div>

            {/* IDENTICAL POT QUANTITY COUNTER */}
            <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <span>{isEn ? 'Number of identical pots (e.g. 2x 30cm pot):' : 'Liczba identycznych donic (np. 2x donica 30cm):'}</span>
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isEn
                    ? `Set how many identical containers of '${selectedVariety}' you have on your balcony.`
                    : `Ustaw, ile takich samych pojemników z odmianą '${selectedVariety}' masz na balkonie.`}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPotCount((c) => Math.max(1, c - 1))}
                  disabled={potCount <= 1}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer shadow-2xs border border-stone-300 dark:border-stone-700"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-12 text-center font-black text-base text-stone-900 dark:text-stone-100">
                  {potCount}x
                </span>

                <button
                  type="button"
                  onClick={() => setPotCount((c) => Math.min(20, c + 1))}
                  className="w-8 h-8 rounded-xl bg-emerald-800 hover:bg-emerald-900 flex items-center justify-center font-bold text-white cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Pot Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                {isEn ? 'Single container type:' : 'Typ pojedynczego pojemnika:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POT_TYPES.map((pt) => {
                  const isSelected = potType === pt.key;
                  return (
                    <button
                      key={pt.key}
                      type="button"
                      onClick={() => setPotType(pt.key)}
                      className={`p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-2xs ring-1 ring-emerald-600'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-sm font-bold">
                        <span>{pt.icon}</span>
                        <span className="text-xs leading-tight">{pt.label}</span>
                      </div>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 leading-tight">
                        {pt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume in Liters with presets */}
            <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {isEn ? '1 Pot volume (in liters):' : 'Pojemność 1 donicy (w litrach):'}
                </label>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isTooSmall
                      ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      : isOptimal
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {isTooSmall
                    ? (isEn ? `⚠️ Too small (min. ${minReqVolume}L for this variety)` : `⚠️ Zbyt mała (min. ${minReqVolume}L dla tej odmiany)`)
                    : (isEn ? `✅ Optimal volume (${volumeL}L)` : `✅ Odpowiednia pojemność (${volumeL}L)`)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={volumeL}
                  onChange={(e) => setVolumeL(Math.max(1, Number(e.target.value)))}
                  className="w-24 p-2.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-center text-base font-bold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
                <span className="text-xs font-semibold text-stone-500">
                  {isEn ? 'liters per 1 pot' : 'litrów na 1 donicę'}
                </span>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                  <span className="text-[11px] text-stone-500">{isEn ? 'Quick pick:' : 'Szybki wybór:'}</span>
                  {[3, 5, 10, 15, 20, 30].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVolumeL(v)}
                      className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                        volumeL === v
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {v}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Total volume indicator if multiple pots */}
              {potCount > 1 && (
                <div className="p-2.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/40 text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <span>{isEn ? `Total soil for ${potCount}x identical pots:` : `Łączne podłoże dla ${potCount}x identycznych donic:`}</span>
                  <span className="text-sm font-black">
                    {potCount} × {volumeL}L = {totalVolumeAllPots} {isEn ? 'liters of soil' : 'litrów ziemi'}
                  </span>
                </div>
              )}

              {isTooSmall && (
                <p className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {isEn
                      ? 'In a small pot, soil dries out 2x faster in the heat and yield will be reduced. Requires frequent watering!'
                      : 'W małej donicy ziemia schnie 2x szybciej w upale, a plon będzie mniejszy. Wymaga częstszego podlewania!'}
                  </span>
                </p>
              )}
            </div>

            {/* Material & Description */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    {isEn ? 'Pot material:' : 'Materiał donicy:'}
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value as PotMaterial)}
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-900 dark:text-stone-100"
                  >
                    {POT_MATERIALS.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    {isEn ? 'Custom pot name / balcony position:' : 'Własna nazwa / lokalizacja na balkonie:'}
                  </label>
                  <input
                    type="text"
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                    placeholder={isEn ? 'e.g. 2x 60cm boxes in full sun' : 'np. 2x Skrzynki 60cm od słońca'}
                    className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              {/* Dynamic Agronomic Material Evaluation */}
              {(() => {
                const matEval = evaluatePotMaterial(material, plant, selectedVariety);
                return (
                  <div
                    className={`p-3 rounded-xl border text-xs transition-all ${
                      matEval.rating === 'good'
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : matEval.rating === 'warning'
                        ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                        : 'bg-red-50/90 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                        <span>🧪</span>
                        <span>{isEn ? `Material rating for ${getPlantName(plant, language)} (${selectedVariety}):` : `Ocena materiału dla ${plant.name} (${selectedVariety}):`}</span>
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border uppercase tracking-wide ${
                          matEval.rating === 'good'
                            ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 border-emerald-300 dark:border-emerald-700'
                            : matEval.rating === 'warning'
                            ? 'bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-700'
                            : 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700'
                        }`}
                      >
                        {isEn ? matEval.badgeTextEn : matEval.badgeText}
                      </span>
                    </div>
                    <div className="font-semibold text-[11px] text-stone-800 dark:text-stone-200">
                      {isEn ? (matEval.titleEn || matEval.title) : matEval.title}
                    </div>
                    <p className="text-[11px] leading-relaxed mt-0.5 text-stone-700 dark:text-stone-300 font-normal">
                      {isEn ? (matEval.descriptionEn || matEval.description) : matEval.description}
                    </p>
                  </div>
                );
              })()}
            </div>

            {/* Drainage checkbox */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pot-drainage-toggle"
                  checked={hasDrainage}
                  onChange={(e) => setHasDrainage(e.target.checked)}
                  className="w-4 h-4 rounded-md text-emerald-700 focus:ring-emerald-600"
                />
                <label htmlFor="pot-drainage-toggle" className="text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer">
                  {isEn ? 'Pot has drainage holes in the bottom' : 'Donica posiada otwory odpływowe (drenaż) w dnie'}
                </label>
              </div>
              <span className="text-[11px] text-stone-500">
                {hasDrainage ? (isEn ? '✅ Drainage active' : '✅ Odpływ aktywny') : (isEn ? '🚨 No drainage holes!' : '🚨 Brak odpływu!')}
              </span>
            </div>

            {/* Balkonowa mini-szklarnia toggle & guidance */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🏡</span>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <span>{isEn ? 'Balcony Greenhouse / Foil Cover Rack' : 'Balkonowa szklarnia / regał z folią'}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          greenhouseInfo.badgeTone === 'emerald'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                            : greenhouseInfo.badgeTone === 'amber'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                            : greenhouseInfo.badgeTone === 'rose'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                            : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 border-stone-300'
                        }`}
                      >
                        {greenhouseInfo.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isEn
                        ? 'Indicate whether this pot is kept in a mini-greenhouse or foil shelf on your balcony.'
                        : 'Oznacz, czy donica stoi w mini-szklarni lub regale foliowym na balkonie.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setInGreenhouse(!inGreenhouse)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    inGreenhouse ? 'bg-emerald-600' : 'bg-stone-300 dark:bg-stone-600'
                  }`}
                  role="switch"
                  aria-checked={inGreenhouse}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      inGreenhouse ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {inGreenhouse ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-900 dark:text-emerald-100">
                    <span>{isEn ? '✅ Pot marked as: In balcony greenhouse' : '✅ Donica oznaczona jako: W szklarni balkonowej'}</span>
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                      ({greenhouseInfo.temperatureGain})
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/90 dark:text-emerald-200/90 leading-relaxed">
                    {greenhouseInfo.reason}
                  </p>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
                    ⚠️ {greenhouseInfo.risksAndVentilation}
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-stone-100/80 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-750 text-xs text-stone-600 dark:text-stone-400">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{isEn ? '🌿 Location: Open Balcony' : '🌿 Stanowisko: Otwarty balkon'}</span> —{' '}
                  {greenhouseInfo.suitability === 'recommended'
                    ? (isEn ? 'A mini-greenhouse is recommended for this crop – speeds up start and harvesting by 2–3 weeks on cool days.' : 'Dla tej rośliny mini-szklarnia jest zalecana – w chłodne dni przyspiesza start i owocowanie o 2–3 tygodnie.')
                    : greenhouseInfo.reason}
                </div>
              )}
            </div>

            {/* Callout promoting adding different pots as separate crops */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <span>💡</span>
                  <span>{isEn ? 'Have other pots (different sizes) for this plant?' : 'Masz inne donice (o różnych wymiarach) dla tej rośliny?'}</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">
                  {isEn
                    ? 'If you have another pot with different dimensions or exposure — add it as a separate crop.'
                    : 'Jeśli masz jeszcze inną donicę o innych wymiarach lub na innym stanowisku — dodaj ją jako osobną uprawę.'}
                </p>
              </div>

              {onAddAsNewCrop && (
                <button
                  type="button"
                  onClick={() => {
                    onAddAsNewCrop(plant, selectedVariety, 1);
                    onClose();
                  }}
                  className="px-3 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                >
                  <CopyPlus className="w-3.5 h-3.5" />
                  <span>{isEn ? '+ Add in different pot' : '+ Dodaj w innej donicy'}</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 2: METODA I DATA SIEWU / POSADZENIA */}
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? '2. Sowing Method & Start Date' : '2. Metoda i data rozpoczęcia uprawy'}</span>
              </div>
              <span className="text-xs text-stone-500">
                {isEn ? 'Growth days counter' : 'Licznik dni fenologicznych'}
              </span>
            </div>

            {/* Sowing Method Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSowingMethod('nasiona')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  sowingMethod === 'nasiona'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-2xs ring-1 ring-emerald-600'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-2xl">🌱</span>
                <div>
                  <div className="text-xs font-bold">{isEn ? 'Sown from seed' : 'Siane z nasion'}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {isEn ? 'Full cycle from seed: germination, cotyledons, potting on.' : 'Pełny cykl od zera: kiełkowanie, pierwsze liścienie, pikowanie siewek.'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSowingMethod('sadzonka')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  sowingMethod === 'sadzonka'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-2xs ring-1 ring-emerald-600'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-2xl">🌿</span>
                <div>
                  <div className="text-xs font-bold">{isEn ? 'Nursery seedling / plant' : 'Gotowa sadzonka / rozsada'}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {isEn ? 'Purchased nursery plug (~3–4 weeks old), reaches harvest sooner.' : 'Kupiona na targu/w sklepie. Sadzonka ma już ok. 3–4 tygodnie, szybciej zakwitnie.'}
                  </div>
                </div>
              </button>
            </div>

            {/* Sowing Date Input & Shortcuts */}
            <div className="bg-stone-50 dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {isEn ? 'Sowing / transplant date into pot:' : 'Data siewu nasion / wsadzenia sadzonki do donicy:'}
                </label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="p-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Quick Date Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-stone-500">{isEn ? 'Shortcuts:' : 'Skróty daty:'}</span>
                <button
                  type="button"
                  onClick={() => setRelativeDate(0)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  {isEn ? 'Today' : 'Dzisiaj'}
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(7)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  {isEn ? '1 week ago' : 'Tydzień temu'}
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(14)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  {isEn ? '2 weeks ago' : '2 tygodnie temu'}
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(30)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  {isEn ? '1 month ago' : 'Miesiąc temu'}
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(60)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  {isEn ? '2 months ago' : '2 miesiące temu'}
                </button>
              </div>

              {/* Live Status Calculation Card */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                  <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>
                    {isEn ? 'Plant age:' : 'Wiek rośliny:'} <strong>{previewInfo.daysSinceSowing} {isEn ? 'days' : 'dni'}</strong> {isEn ? 'from start' : 'od startu'}
                  </span>
                </div>
                <div className="text-emerald-800 dark:text-emerald-300 font-semibold">
                  {isEn ? 'Current phase:' : 'Aktualna faza:'} {previewInfo.currentPhase.icon} {previewInfo.currentPhase.name}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SZACUNEK KOSZTÓW ZAŁOŻENIA UPRAWY */}
          <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <span>💰</span>
                <span>{isEn ? `3. Estimated Crop Budget (${potCount > 1 ? `${potCount}x pots` : '1 pot'})` : `3. Szacunkowy kosztorys uprawy (${potCount > 1 ? `${potCount}x donice` : '1 donica'})`}</span>
              </div>
              <span className="text-xs text-stone-500">
                {isEn ? 'Seeds / Seedling + Soil + Pot' : 'Nasiona / Sadzonka + Ziemia + Donica'}
              </span>
            </div>

            <CropCostEstimatorCard
              plant={plant}
              varietyName={selectedVariety}
              sowingMethod={sowingMethod}
              potVolumeLiters={volumeL}
              potMaterial={material}
              potType={potType}
              potCount={potCount}
              supportType={varietyDetails.requiresSupport ? 'stake' : 'none'}
              onSowingMethodChange={(m) => setSowingMethod(m)}
            />

            <SoilShoppingGuideCard plant={plant} isCompact={true} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
          >
            {isEn ? 'Cancel' : 'Anuluj'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>{isEn ? `Save Configuration (${potCount > 1 ? `${potCount}x ` : ''}'${selectedVariety}')` : `Zapisz konfigurację (${potCount > 1 ? `${potCount}x ` : ''}'${selectedVariety}')`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

