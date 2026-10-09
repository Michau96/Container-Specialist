import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Check,
  Plus,
  Minus,
  Layers,
  Droplets,
  Sprout,
  HelpCircle,
  ArrowRight,
  SlidersHorizontal,
  PackagePlus,
} from 'lucide-react';
import { Plant, PlantVariety } from '../types';
import { getPlantVarieties, getEffectivePlantRequirements } from '../lib/varietyData';
import { getPlantGreenhouseInfo } from '../lib/greenhouse';
import { useLanguage } from '../lib/LanguageContext';
import { getPlantName } from '../lib/plantTranslations';

interface Props {
  plant: Plant | null;
  isOpen: boolean;
  initialVarietyName?: string;
  onClose: () => void;
  onConfirmAdd: (
    plantId: string,
    varietyName: string,
    varietyBadge: string,
    potCount: number,
    openConfigurator?: boolean,
    inGreenhouse?: boolean
  ) => void;
  existingCropCountForPlant?: number;
}

export const SelectVarietyModal: React.FC<Props> = ({
  plant,
  isOpen,
  initialVarietyName,
  onClose,
  onConfirmAdd,
  existingCropCountForPlant = 0,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [selectedVarietyName, setSelectedVarietyName] = useState<string>('');
  const [customVarietyInput, setCustomVarietyInput] = useState<string>('');
  const [isCustomVarietyMode, setIsCustomVarietyMode] = useState<boolean>(false);
  const [potCount, setPotCount] = useState<number>(1);
  const [inGreenhouse, setInGreenhouse] = useState<boolean>(false);

  const varieties = plant ? getPlantVarieties(plant) : [];
  const greenhouseInfo = plant ? getPlantGreenhouseInfo(plant) : null;

  useEffect(() => {
    if (plant && varieties.length > 0) {
      if (initialVarietyName) {
        const found = varieties.find((v) => v.name.toLowerCase() === initialVarietyName.toLowerCase());
        if (found) {
          setSelectedVarietyName(found.name);
          setIsCustomVarietyMode(false);
        } else {
          setSelectedVarietyName('');
          setCustomVarietyInput(initialVarietyName);
          setIsCustomVarietyMode(true);
        }
      } else {
        setSelectedVarietyName(varieties[0].name);
        setIsCustomVarietyMode(false);
        setCustomVarietyInput('');
      }
      setPotCount(1);
      const ghInfo = getPlantGreenhouseInfo(plant);
      setInGreenhouse(ghInfo.suitability === 'recommended');
    }
  }, [plant, initialVarietyName]);

  if (!isOpen || !plant) return null;

  const defaultCustomName = isEn ? 'Custom Variety' : 'Własna odmiana';
  const activeVarietyName = isCustomVarietyMode
    ? (customVarietyInput.trim() || defaultCustomName)
    : selectedVarietyName;

  const currentDetails = getEffectivePlantRequirements(plant, activeVarietyName);
  const matchedVariety = varieties.find((v) => v.name === selectedVarietyName) || varieties[0];
  const activeBadge = isCustomVarietyMode
    ? (isEn ? 'Custom seed variety' : 'Własna odmiana z nasion')
    : (matchedVariety?.badge || (isEn ? 'Container variety' : 'Odmiana donicowa'));

  const handleSave = (openConfigurator = false) => {
    if (!plant) return;
    const finalVarietyName = isCustomVarietyMode
      ? (customVarietyInput.trim() || defaultCustomName)
      : selectedVarietyName;

    onConfirmAdd(plant.id, finalVarietyName, activeBadge, potCount, openConfigurator, inGreenhouse);
    onClose();
  };

  const displayName = getPlantName(plant, language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold tracking-wide uppercase border border-emerald-400/30">
                {isEn ? 'Select Variety & Potted Count' : 'Wymuszony wybór gatunku i odmiany'}
              </span>
              {existingCropCountForPlant > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[11px] font-semibold border border-amber-400/30">
                  {isEn ? `You already have ${existingCropCountForPlant}x this plant` : `Posiadasz już ${existingCropCountForPlant}x tę roślinę w uprawach`}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>{displayName}</span>
              <span className="text-emerald-300 text-sm font-medium">({plant.category})</span>
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-lg">
              {isEn
                ? 'Each species and variety has distinct container volume, spacing, and watering needs. Choose your specific variety and pot count.'
                : 'Każdy gatunek i odmiana ma inne zapotrzebowanie na wielkość donicy, rozstawę i profil podlewania. Wybierz konkretną odmianę oraz ilość jednakowych donic.'}
            </p>
          </div>

          <button
            id="close-variety-modal-btn"
            data-testid="plant-details-close"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
            title={isEn ? 'Close' : 'Zamknij'}
            aria-label={isEn ? 'Close' : 'Zamknij'}
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200">
          
          {/* STEP 1: VARIETY SELECTION */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2.5">
              {isEn ? '1. Select plant variety / cultivar (required):' : '1. Wybierz odmianę / gatunek rośliny (obowiązkowe):'}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {varieties.map((v) => {
                const isSelected = !isCustomVarietyMode && selectedVarietyName === v.name;
                return (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => {
                      setSelectedVarietyName(v.name);
                      setIsCustomVarietyMode(false);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer relative ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-600/60 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="text-sm font-bold flex items-center gap-1.5">
                          <span>{v.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 inline" />}
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-200/70 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 mt-1 inline-block">
                          {v.badge}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-stone-700 dark:text-stone-300 bg-white/90 dark:bg-stone-800 px-2 py-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                        min. {v.min_pot_vol_l || plant.pot.min_volume_l}L
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug">
                      {v.reason}
                    </p>

                    {v.habit && (
                      <div className="text-[10px] font-medium text-emerald-800 dark:text-emerald-300 mt-2 flex items-center gap-1">
                        <span>🌱</span>
                        <span>{v.habit}</span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Custom Variety Option */}
              <button
                type="button"
                onClick={() => setIsCustomVarietyMode(true)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isCustomVarietyMode
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 ring-2 ring-emerald-600/60 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold flex items-center gap-1.5 text-stone-900 dark:text-stone-100">
                    <PackagePlus className="w-4 h-4 text-emerald-600" />
                    <span>{isEn ? 'Other / Custom Variety' : 'Inna / Własna odmiana'}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    {isEn ? 'Type the cultivar name from your seed packet or nursery tag.' : 'Wpisz nazwę odmiany ze swojej torebki nasion lub etykiety sadzonki.'}
                  </p>
                </div>
              </button>
            </div>

            {/* Custom variety text input */}
            {isCustomVarietyMode && (
              <div className="mt-3 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  {isEn ? 'Enter custom variety name:' : 'Wpisz nazwę własnej odmiany:'}
                </label>
                <input
                  type="text"
                  value={customVarietyInput}
                  onChange={(e) => setCustomVarietyInput(e.target.value)}
                  placeholder={isEn ? 'e.g. Sweet 100, Tumbling Tom, Red Robin...' : 'np. Koralik, Betalux, Red Robin...'}
                  className="w-full p-2.5 bg-white dark:bg-stone-900 border border-emerald-400 dark:border-emerald-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* VARIETY IMPACT DETAILS */}
          <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2.5">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>{isEn ? `Specifics for '${activeVarietyName}':` : `Specyfika wybranej odmiany '${activeVarietyName}':`}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-600 dark:text-stone-400 block text-[11px]">
                  {isEn ? '📐 Pot size & Spacing:' : '📐 Wymagana donica i rozstawa:'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  {isEn ? `Min. ${currentDetails.minVolumeL}L soil • spacing ${currentDetails.spacingCm} cm` : `Min. ${currentDetails.minVolumeL}L ziemi • rozstawa ${currentDetails.spacingCm} cm`}
                </span>
                {currentDetails.requiresSupport && (
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold block mt-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                    {isEn ? '🎋 Bamboo stake: Required for growth' : '🎋 Palik bambusowy: Niezbędny do uprawy'}
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-600 dark:text-stone-400 block text-[11px]">
                  {isEn ? '🌱 Sowing & Watering profile:' : '🌱 Siew i profil nawadniania:'}
                </span>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block mb-0.5">
                  {plant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? (isEn ? 'Cluster sowing (2–3 seeds per hole)' : 'Siew gniazdowy (gniazdowo po 2–3 nasiona)')
                    : plant.spacing_guide?.sowing_type === 'pojedynczo'
                    ? (isEn ? 'Single seed sowing' : 'Siew pojedynczy (pojedynczo)')
                    : plant.spacing_guide?.sowing_type === 'rzutowo'
                    ? (isEn ? 'Broadcast sowing' : 'Siew rzutowy')
                    : plant.spacing_guide?.sowing_type === 'grzybnia'
                    ? (isEn ? 'Mycelium in moist substrate' : 'Grzybnia w wilgotnym podłożu')
                    : (isEn ? 'Planting seedling' : 'Sadzenie sadzonki')}
                </span>
                <span className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug block">
                  {currentDetails.wateringProfile}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
              <span className="font-semibold text-stone-600 dark:text-stone-400 block text-[11px]">
                {isEn ? '🌱 Substrate and pH:' : '🌱 Podłoże i pH dla odmiany:'}
              </span>
              <span className="text-[11px] text-stone-800 dark:text-stone-200">
                pH {currentDetails.soilPh} — {currentDetails.soilNotes}
              </span>
            </div>
          </div>

          {/* STEP 2: QUANTITY OF IDENTICAL POTS & PROMOTION OF DIFFERENT POTS */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                  {isEn ? '2. Number of identical pots (e.g. 2x 30cm pots):' : '2. Liczba identycznych donic (np. 2x donice 30cm):'}
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {isEn
                    ? 'If you have several identical pots with this variety, manage them together in one card.'
                    : 'Jeśli masz kilka takich samych donic z tą odmianą, zarządzaj nimi wspólnie w jednym kafelku.'}
                </p>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setPotCount((c) => Math.max(1, c - 1))}
                  disabled={potCount <= 1}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center font-bold text-stone-700 dark:text-stone-300 disabled:opacity-40 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer shadow-2xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-10 text-center font-black text-sm text-stone-900 dark:text-stone-100">
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

            {potCount > 1 && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
                <span className="text-lg">📦</span>
                <span>
                  {isEn
                    ? `You will create a group of ${potCount}x identical pots for '${activeVarietyName}'. Watering and feeding advice will account for total volume (${potCount * currentDetails.minVolumeL}L+).`
                    : `Utworzysz grupę ${potCount}x identycznych donic dla odmiany '${activeVarietyName}'. Rekomendacje podlewania i nawożenia uwzględnią sumaryczną objętość (${potCount * currentDetails.minVolumeL}L+).`}
                </span>
              </div>
            )}

            {/* Promote Adding Different Pots as Separate Crops */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>💡</span>
                <span>{isEn ? 'Have different pots for the same plant?' : 'Masz różne donice na balkonie dla tej samej rośliny?'}</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                {isEn
                  ? 'If one pot is a round 30cm pot and another is a 60cm planter box with different sun exposure — add them as separate crops for independent tracking.'
                  : 'Jeśli jedna donica to np. okrągła 30cm, a druga to długa skrzynka 60cm lub w innym nasłonecznieniu — dodaj je jako osobne uprawy. Pozwoli to na niezależne liczniki dni, drenażu i indywidualne dawkowanie wody!'}
              </p>
            </div>
          </div>

          {/* STEP 3: GREENHOUSE / MICROCLIMATE */}
          {greenhouseInfo && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                      {isEn ? '3. Location: Balcony greenhouse / mini cover:' : '3. Stanowisko: Balkonowa szklarnia / regał z folią:'}
                    </label>
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
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {greenhouseInfo.reason}
                  </p>
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {inGreenhouse ? (isEn ? 'In greenhouse' : 'W szklarni') : (isEn ? 'Open balcony' : 'Otwarty')}
                  </span>
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
              </div>

              <div
                className={`p-2.5 rounded-xl border text-[11px] ${
                  inGreenhouse
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                {inGreenhouse ? (
                  <span>
                    {isEn
                      ? `🏡 Cultivation marked in greenhouse (${greenhouseInfo.temperatureGain}). Weather alerts and ventilation advice will adjust accordingly.`
                      : `🏡 Uprawa oznaczona w szklarni (${greenhouseInfo.temperatureGain}). System dostosuje porady pogodowe (wietrzenie, osłona).`}
                  </span>
                ) : (
                  <span>
                    {isEn
                      ? '🌿 Open balcony cultivation – standard sunlight and natural air circulation profile.'
                      : '🌿 Uprawa na otwartym balkonie – standardowy profil nasłonecznienia i naturalnej cyrkulacji powietrza.'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
          >
            {isEn ? 'Cancel' : 'Anuluj'}
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-stone-300 dark:border-stone-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isEn ? 'Add & Configure Pot 📐' : 'Dodaj i dopasuj donicę 📐'}</span>
            </button>

            <button
              type="button"
              id="confirm-add-variety-btn"
              name="add-plant-button"
              data-testid="add-plant-button"
              onClick={() => handleSave(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>
                {isEn ? `Add ${potCount > 1 ? `${potCount}x ` : ''}'${activeVarietyName}' to crops` : `Dodaj ${potCount > 1 ? `${potCount}x ` : ''}'${activeVarietyName}' do upraw`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

