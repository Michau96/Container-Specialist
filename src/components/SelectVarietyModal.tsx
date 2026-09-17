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
    openConfigurator?: boolean
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
  const [selectedVarietyName, setSelectedVarietyName] = useState<string>('');
  const [customVarietyInput, setCustomVarietyInput] = useState<string>('');
  const [isCustomVarietyMode, setIsCustomVarietyMode] = useState<boolean>(false);
  const [potCount, setPotCount] = useState<number>(1);

  const varieties = plant ? getPlantVarieties(plant) : [];

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
    }
  }, [plant, initialVarietyName]);

  if (!isOpen || !plant) return null;

  const activeVarietyName = isCustomVarietyMode
    ? (customVarietyInput.trim() || 'Własna odmiana')
    : selectedVarietyName;

  const currentDetails = getEffectivePlantRequirements(plant, activeVarietyName);
  const matchedVariety = varieties.find((v) => v.name === selectedVarietyName) || varieties[0];
  const activeBadge = isCustomVarietyMode
    ? 'Własna odmiana z nasion'
    : (matchedVariety?.badge || 'Odmiana donicowa');

  const handleSave = (openConfigurator = false) => {
    if (!plant) return;
    const finalVarietyName = isCustomVarietyMode
      ? (customVarietyInput.trim() || 'Własna odmiana')
      : selectedVarietyName;

    onConfirmAdd(plant.id, finalVarietyName, activeBadge, potCount, openConfigurator);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[11px] font-bold tracking-wide uppercase border border-emerald-400/30">
                Wymuszony wybór gatunku i odmiany
              </span>
              {existingCropCountForPlant > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[11px] font-semibold border border-amber-400/30">
                  Posiadasz już {existingCropCountForPlant}x tę roślinę w uprawach
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>{plant.name}</span>
              <span className="text-emerald-300 text-sm font-medium">({plant.category})</span>
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-lg">
              Każdy gatunek i odmiana ma inne zapotrzebowanie na wielkość donicy, rozstawę i profil podlewania. Wybierz konkretną odmianę oraz ilość jednakowych donic.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition cursor-pointer shrink-0"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 dark:text-stone-200">
          
          {/* STEP 1: VARIETY SELECTION */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2.5">
              1. Wybierz odmianę / gatunek rośliny (obowiązkowe):
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
                    <span>Inna / Własna odmiana</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                    Wpisz nazwę odmiany ze swojej torebki nasion lub etykiety sadzonki.
                  </p>
                </div>
              </button>
            </div>

            {/* Custom variety text input */}
            {isCustomVarietyMode && (
              <div className="mt-3 p-3.5 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
                <label className="block text-xs font-bold text-emerald-950 dark:text-emerald-200 mb-1">
                  Wpisz nazwę własnej odmiany:
                </label>
                <input
                  type="text"
                  value={customVarietyInput}
                  onChange={(e) => setCustomVarietyInput(e.target.value)}
                  placeholder="np. Koralik, Betalux, Red Robin..."
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
              <span>Specyfika wybranej odmiany '{activeVarietyName}':</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-600 dark:text-stone-400 block text-[11px]">📐 Wymagana donica i rozstawa:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">
                  Min. {currentDetails.minVolumeL}L ziemi • rozstawa {currentDetails.spacingCm} cm
                </span>
                {currentDetails.requiresSupport && (
                  <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold block mt-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                    🎋 Palik bambusowy: Niezbędny do uprawy
                  </span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="font-semibold text-stone-600 dark:text-stone-400 block text-[11px]">🌱 Siew i profil nawadniania:</span>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400 block mb-0.5">
                  {plant.spacing_guide?.sowing_type === 'gniazdowo'
                    ? 'Siew gniazdowy (gniazdowo po 2–3 nasiona)'
                    : plant.spacing_guide?.sowing_type === 'pojedynczo'
                    ? 'Siew pojedynczy (pojedynczo)'
                    : plant.spacing_guide?.sowing_type === 'rzutowo'
                    ? 'Siew rzutowy'
                    : plant.spacing_guide?.sowing_type === 'grzybnia'
                    ? 'Grzybnia w wilgotnym podłożu'
                    : 'Sadzenie sadzonki'}
                </span>
                <span className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug block">
                  {currentDetails.wateringProfile}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs">
              <span className="font-semibold text-stone-600 dark:text-stone-400 block text-[11px]">🌱 Podłoże i pH dla odmiany:</span>
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
                  2. Liczba identycznych donic (np. 2x donice 30cm):
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Jeśli masz kilka takich samych donic z tą odmianą, zarządzaj nimi wspólnie w jednym kafelku.
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
                  Utworzysz grupę <strong>{potCount}x identycznych donic</strong> dla odmiany <strong>'{activeVarietyName}'</strong>. Rekomendacje podlewania i nawożenia uwzględnią sumaryczną objętość ({potCount * currentDetails.minVolumeL}L+).
                </span>
              </div>
            )}

            {/* Promote Adding Different Pots as Separate Crops */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <span>💡</span>
                <span>Masz różne donice na balkonie dla tej samej rośliny?</span>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                Jeśli jedna donica to np. okrągła 30cm, a druga to długa skrzynka 60cm lub w innym nasłonecznieniu — <strong>dodaj je jako osobne uprawy</strong>. Pozwoli to na niezależne liczniki dni, drenażu i indywidualne dawkowanie wody!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
          >
            Anuluj
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto px-4 py-2.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-stone-300 dark:border-stone-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Dodaj i dopasuj donicę 📐</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>
                Dodaj {potCount > 1 ? `${potCount}x ` : ''}'{activeVarietyName}' do upraw
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
