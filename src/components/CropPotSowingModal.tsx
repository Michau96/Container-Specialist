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

interface Props {
  plant: Plant | null;
  crop: MyCropItem | null;
  onClose: () => void;
  onSave: (updatedCrop: MyCropItem) => void;
}

const POT_TYPES: { key: PotType; label: string; icon: string; desc: string }[] = [
  { key: 'okragla', label: 'Donica okrągła', icon: '🪴', desc: 'Klasyczna głęboka donica na podłodze' },
  { key: 'skrzynka', label: 'Skrzynka podłużna', icon: '🪟', desc: 'Zawieszana na barierce lub na parapecie (40–80cm)' },
  { key: 'kwadratowa', label: 'Donica kwadratowa', icon: '📦', desc: 'Stabilna donica podłogowa / narożna' },
  { key: 'worek_growbag', label: 'Worek tkaninowy (Growbag)', icon: '🎒', desc: 'Przepuszcza powietrze, zapobiega skręcaniu korzeni' },
  { key: 'samonawadniajaca', label: 'Skrzynka samonawadniająca', icon: '💧', desc: 'Z podwójnym dnem i wlewem rezerwowym' },
  { key: 'wiszaca', label: 'Kosz wiszący / amplia', icon: '🧺', desc: 'Podwieszany do sufitu lub barierki' },
];

const POT_MATERIALS: { key: PotMaterial; label: string; note: string }[] = [
  { key: 'plastik', label: 'Plastik / Tworzywo', note: 'Lekki, trzyma wilgoć dłużej, łatwy w czyszczeniu' },
  { key: 'ceramika_terakota', label: 'Ceramika / Terakota', note: 'Porowata, paruje ściankami (szybciej schnie), ciężka i stabilna' },
  { key: 'tkanina', label: 'Agrowłóknina / Tkanina', note: 'Znakomite napowietrzenie korzeni, woda szybko przesiąka' },
  { key: 'drewno', label: 'Drewno naturalne', note: 'Dobra izolacja termiczna, wymaga wyłożenia folią z odpływem' },
];

export const CropPotSowingModal: React.FC<Props> = ({
  plant,
  crop,
  onClose,
  onSave,
}) => {
  if (!plant || !crop) return null;

  // Initialize form state
  const [potType, setPotType] = useState<PotType>(crop.pot?.potType || 'okragla');
  const [volumeL, setVolumeL] = useState<number>(crop.pot?.volumeL || plant.pot.min_volume_l || 10);
  const [material, setMaterial] = useState<PotMaterial>(crop.pot?.material || 'plastik');
  const [hasDrainage, setHasDrainage] = useState<boolean>(crop.pot?.hasDrainage ?? true);
  const [locationNote, setLocationNote] = useState<string>(crop.pot?.locationNote || crop.customPotName || '');

  const [depthCm, setDepthCm] = useState<number>(crop.pot?.depthCm || plant.pot.min_depth_cm || 20);
  const [diameterOrWidthCm, setDiameterOrWidthCm] = useState<number>(crop.pot?.diameterOrWidthCm || 25);

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
    pot: {
      potType,
      volumeL,
      material,
      hasDrainage,
      locationNote,
      depthCm,
      diameterOrWidthCm,
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
    };

    const updatedSowing: SowingConfig = {
      method: sowingMethod,
      date: sowingDate,
      sowingLocation,
    };

    const updatedCrop: MyCropItem = {
      ...crop,
      customPotName: locationNote.trim() || `${volumeL}L (${POT_TYPES.find((p) => p.key === potType)?.label})`,
      pot: updatedPot,
      sowing: updatedSowing,
      // Update stage automatically if aligned with timeline
      stage: previewInfo.currentPhase.id === 'kielkowanie'
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

  const minReqVolume = plant.pot.min_volume_l;
  const isTooSmall = volumeL < minReqVolume * 0.8;
  const isOptimal = volumeL >= minReqVolume;

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
              <span>Parametry donicy & Terminarz siewu</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>{plant.name}</span>
              {crop.selectedVariety && (
                <span className="text-sm font-normal text-stone-300">
                  (odmiana: {crop.selectedVariety})
                </span>
              )}
            </h3>
            <p className="text-xs text-stone-400 mt-1 max-w-lg">
              Podaj wymiary pojemnika i datę wysiewu/posadzenia, aby aplikacja wyliczyła wiek rośliny,
              aktywowała schemat faz wzrostu oraz podawała precyzyjne zalecenia podlewania i nawożenia.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-7 max-h-[75vh] overflow-y-auto">
          {/* SECTION 1: TWOJA DONICA */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Ruler className="w-4 h-4 text-emerald-600" />
                <span>1. Konfiguracja donicy / pojemnika</span>
              </div>
              <span className="text-xs font-medium text-stone-500">
                Wymóg rośliny: <strong className="text-emerald-700 dark:text-emerald-400">min. {minReqVolume}L</strong>
              </span>
            </div>

            {/* Pot Type Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Typ pojemnika:
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
                          : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
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
            <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Rzeczywista pojemność podłoża (w litrach):
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
                    ? `⚠️ Zbyt mała (min. ${minReqVolume}L)`
                    : `✅ Odpowiednia pojemność (${volumeL}L)`}
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
                <span className="text-xs font-semibold text-stone-500">litrów ziemi</span>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap ml-auto">
                  <span className="text-[11px] text-stone-500">Szybki wybór:</span>
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

              {isTooSmall && (
                <p className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    W małej donicy ziemia schnie 2x szybciej w upale, a plon będzie mniejszy. Wymaga częstszego podlewania!
                  </span>
                </p>
              )}
            </div>

            {/* Material & Drainage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Materiał donicy:
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as PotMaterial)}
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                >
                  {POT_MATERIALS.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label} – {m.note}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Własny opis / miejsce na balkonie:
                </label>
                <input
                  type="text"
                  value={locationNote}
                  onChange={(e) => setLocationNote(e.target.value)}
                  placeholder="np. Skrzynka 60cm na barierce od słońca"
                  className="w-full p-2.5 bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Drainage checkbox */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pot-drainage-toggle"
                  checked={hasDrainage}
                  onChange={(e) => setHasDrainage(e.target.checked)}
                  className="w-4 h-4 rounded-md text-emerald-700 focus:ring-emerald-600"
                />
                <label htmlFor="pot-drainage-toggle" className="text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer">
                  Donica posiada otwory odpływowe (drenaż) w dnie
                </label>
              </div>
              <span className="text-[11px] text-stone-500">
                {hasDrainage ? '✅ Odpływ aktywny' : '🚨 Brak odpływu!'}
              </span>
            </div>

            {!hasDrainage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>
                  <strong>Uwaga na gnicie korzeni:</strong> Donica bez dziur w dnie zatrzymuje wodę deszczową.
                  Zalecamy nawiercenie kilku otworów lub bardzo ostrożne dawkowanie wody z aptekarską precyzją.
                </span>
              </div>
            )}
          </div>

          {/* SECTION 2: METODA I DATA SIEWU / POSADZENIA */}
          <div className="space-y-4 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>2. Metoda i data rozpoczęcia uprawy</span>
              </div>
              <span className="text-xs text-stone-500">
                Licznik dni fenologicznych
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
                    : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-2xl">🌱</span>
                <div>
                  <div className="text-xs font-bold">Siane z nasion</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Pełny cykl od zera: kiełkowanie, pierwsze liścienie, pikowanie siewek.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSowingMethod('sadzonka')}
                className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                  sowingMethod === 'sadzonka'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-600 text-emerald-900 dark:text-emerald-100 shadow-2xs ring-1 ring-emerald-600'
                    : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span className="text-2xl">🌿</span>
                <div>
                  <div className="text-xs font-bold">Gotowa sadzonka / rozsada</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Kupiona na targu/w sklepie. Sadzonka ma już ok. 3–4 tygodnie, szybciej zakwitnie.
                  </div>
                </div>
              </button>
            </div>

            {/* Sowing Date Input & Shortcuts */}
            <div className="bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Data siewu nasion / wsadzenia sadzonki do donicy:
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
                <span className="text-[11px] text-stone-500">Skróty daty:</span>
                <button
                  type="button"
                  onClick={() => setRelativeDate(0)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  Dzisiaj
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(7)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  Tydzień temu
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(14)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  2 tygodnie temu
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(30)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  Miesiąc temu
                </button>
                <button
                  type="button"
                  onClick={() => setRelativeDate(60)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-[11px] text-stone-700 dark:text-stone-300 hover:bg-stone-100 cursor-pointer"
                >
                  2 miesiące temu
                </button>
              </div>

              {/* Live Status Calculation Card */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                  <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>
                    Wiek rośliny: <strong>{previewInfo.daysSinceSowing} dni</strong> od startu
                  </span>
                </div>
                <div className="text-emerald-800 dark:text-emerald-300 font-semibold">
                  Aktualna faza: {previewInfo.currentPhase.icon} {previewInfo.currentPhase.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-100 dark:bg-stone-850 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
          >
            Anuluj
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Zapisz konfigurację i zaktualizuj rekomendacje</span>
          </button>
        </div>
      </div>
    </div>
  );
};
