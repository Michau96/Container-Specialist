import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Trash2,
  Edit3,
  Check,
  Ruler,
  BookOpen,
  Sparkles,
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp,
  Settings2,
} from 'lucide-react';
import {
  Plant,
  MyCropItem,
  CropGrowthStage,
  WeatherData,
  UserBalconySpec,
  DailyCropsRecommendation,
} from '../types';
import { DailyRecommendationCard } from './DailyRecommendationCard';
import { MyCropsCalendar } from './MyCropsCalendar';
import { CropPotSowingModal } from './CropPotSowingModal';
import { CropGrowthPhaseTimeline } from './CropGrowthPhaseTimeline';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';

interface Props {
  myCrops: MyCropItem[];
  allPlants: Plant[];
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  dailyRecommendation: DailyCropsRecommendation;
  onRemoveCrop: (plantId: string) => void;
  onUpdateCrop: (updated: MyCropItem) => void;
  onAddCrop: (plantId: string) => void;
  onSelectPlant: (plant: Plant) => void;
  onOpenPotCalc: (plant: Plant) => void;
  onNavigateToSearch: () => void;
  onSwitchToFullCalendar: () => void;
}

const STAGES: { key: CropGrowthStage; label: string; icon: string }[] = [
  { key: 'planowanie', label: 'Planowanie', icon: '📝' },
  { key: 'siew', label: 'Wysiane', icon: '🌱' },
  { key: 'rozsada', label: 'Rozsada', icon: '🌤️' },
  { key: 'rosnie', label: 'Rośnie w donicy', icon: '🌿' },
  { key: 'kwitnie', label: 'Kwitnie', icon: '🌸' },
  { key: 'owocuje', label: 'Zawiązuje owoce', icon: '🍅' },
  { key: 'zbior', label: 'Czas zbiorów', icon: '🧺' },
];

export const MyCropsView: React.FC<Props> = ({
  myCrops,
  allPlants,
  weather,
  userSpec,
  dailyRecommendation,
  onRemoveCrop,
  onUpdateCrop,
  onAddCrop,
  onSelectPlant,
  onOpenPotCalc,
  onNavigateToSearch,
  onSwitchToFullCalendar,
}) => {
  const [editingPlantId, setEditingPlantId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editPotName, setEditPotName] = useState<string>('');

  // Modal for pot and sowing configuration
  const [configuringCropPlant, setConfiguringCropPlant] = useState<{
    plant: Plant;
    crop: MyCropItem;
  } | null>(null);

  // Toggle expanded growth phase timeline per plant card
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({
    'pomidor-karlowy': true, // Keep the first popular one open by default for rich visual showcase
  });

  const toggleTimeline = (plantId: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [plantId]: !prev[plantId],
    }));
  };

  const myPlants = allPlants.filter((p) => myCrops.some((c) => c.plantId === p.id));

  const startEdit = (crop: MyCropItem) => {
    setEditingPlantId(crop.plantId);
    setEditNotes(crop.notes || '');
    setEditPotName(crop.customPotName || '');
  };

  const saveEdit = (crop: MyCropItem) => {
    onUpdateCrop({
      ...crop,
      notes: editNotes,
      customPotName: editPotName,
    });
    setEditingPlantId(null);
  };

  const handleStageChange = (crop: MyCropItem, newStage: CropGrowthStage) => {
    onUpdateCrop({
      ...crop,
      stage: newStage,
    });
  };

  const handleToggleTask = (plantId: string, taskKey: string) => {
    const crop = myCrops.find((c) => c.plantId === plantId);
    if (!crop) return;
    const currentCompleted = crop.completedTasks || {};
    const updated = {
      ...crop,
      completedTasks: {
        ...currentCompleted,
        [taskKey]: !currentCompleted[taskKey],
      },
    };
    onUpdateCrop(updated);
  };

  // Popular quick adds for empty or small gardens
  const popularStarterPlants = allPlants.filter((p) =>
    ['pomidor-karlowy', 'bazylia-pospolita', 'truskawka-zwisajaca', 'rzodkiewka', 'szpinak-balkonowy', 'papryka-chili'].includes(
      p.id
    ) && !myCrops.some((c) => c.plantId === p.id)
  );

  return (
    <div className="space-y-8">
      {/* 1. Header Banner of My Crops */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>Twoja przestrzeń uprawna</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-3">
            <span>Moje uprawy na balkonie</span>
            <span className="text-sm font-bold px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              {myPlants.length} {myPlants.length === 1 ? 'roślina' : 'rośliny'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Tutaj konfigurujesz parametry donicy i datę siewu, sprawdzasz schemat faz fenologicznych (czego i za ile dni się spodziewać),
            odbierasz dzienne rekomendacje pielęgnacyjne oraz korzystasz z indywidualnego kalendarza terminów.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            id="add-new-crops-nav-btn"
            onClick={onNavigateToSearch}
            className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Szukaj nowych upraw do dodania</span>
          </button>
        </div>
      </div>

      {/* 2. Dzienna rekomendacja - o czym pamiętać dzisiaj (Podlewanie, Nawóz, Przycinanie, Prysk) z uwzględnieniem donic i faz */}
      <DailyRecommendationCard
        recommendation={dailyRecommendation}
        weather={weather}
        userSpec={userSpec}
        cropsCount={myPlants.length}
      />

      {/* 3. Kafelki Moich Upraw ze schematem faz i konfiguracją donicy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
              <span>Kafelki Moich upraw</span>
              <span className="text-xs font-normal text-stone-500">
                (zapisywanie donic, terminów siewu i schemat faz)
              </span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Zapisz parametry donicy i datę siewu, aby odblokować dokładny licznik dni, odliczanie do kolejnych etapów oraz dedykowane zalecenia.
            </p>
          </div>

          <button
            onClick={onNavigateToSearch}
            className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Dodaj kolejną roślinę z bazy</span>
          </button>
        </div>

        {myPlants.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 space-y-4">
            <Sprout className="w-12 h-12 text-stone-400 mx-auto" />
            <div>
              <h4 className="text-lg font-bold text-stone-800 dark:text-stone-200">
                Nie masz jeszcze żadnych roślin w Moich uprawach
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
                Dodaj pierwsze rośliny z katalogu rekomendacji lub wybierz poniższe popularne uprawy balkonowe:
              </p>
            </div>

            {popularStarterPlants.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto pt-2">
                {popularStarterPlants.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onAddCrop(p.id)}
                    className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-800 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-300 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            <div>
              <button
                onClick={onNavigateToSearch}
                className="mt-2 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition cursor-pointer"
              >
                Przejdź do katalogu "Szukaj nowych upraw"
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myPlants.map((plant) => {
              const crop = myCrops.find((c) => c.plantId === plant.id)!;
              const isEditing = editingPlantId === plant.id;
              const currentStageObj = STAGES.find((s) => s.key === (crop.stage || 'rosnie'));
              const timelineInfo = getCropTimelineInfo(plant, crop);
              const isTimelineOpen = !!expandedTimelines[plant.id];

              return (
                <div
                  key={plant.id}
                  id={`my-crop-card-${plant.id}`}
                  className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  {/* Card Header & Main Info */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                            {plant.category}
                          </span>
                          {plant.suitability && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {plant.suitability.score}% dopasowania do balkonu
                            </span>
                          )}
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            Wymóg min. {plant.pot.min_volume_l}L ziemi
                          </span>
                        </div>

                        {/* Title & Variety */}
                        <h4 className="text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                          <span>{plant.name}</span>
                          {crop.selectedVariety && (
                            <span className="text-xs font-normal px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-md">
                              odmiana: {crop.selectedVariety}
                            </span>
                          )}
                        </h4>
                      </div>

                      {/* Right controls: Configure Pot & Sowing Button, Delete */}
                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setConfiguringCropPlant({ plant, crop })}
                          className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Zmień parametry donicy lub datę wysiewu"
                        >
                          <Settings2 className="w-3.5 h-3.5" />
                          <span>Zmień donicę / siew</span>
                        </button>

                        <button
                          onClick={() => onRemoveCrop(plant.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                          title="Usuń z Moich upraw"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Summary Bar: Current Pot, Sowing Date, and Active Phase */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Pot summary */}
                      <div
                        onClick={() => setConfiguringCropPlant({ plant, crop })}
                        className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 cursor-pointer hover:border-emerald-500/50 transition group"
                      >
                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                          <span className="font-semibold flex items-center gap-1">
                            <Ruler className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Twoja donica</span>
                          </span>
                          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold group-hover:underline">
                            Edytuj ✏️
                          </span>
                        </div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span>🪴</span>
                          <span>
                            {crop.pot
                              ? `${crop.pot.volumeL}L (${crop.pot.potType === 'okragla' ? 'Okrągła' : crop.pot.potType === 'skrzynka' ? 'Skrzynka' : crop.pot.potType === 'worek_growbag' ? 'Growbag' : crop.pot.potType === 'wiszaca' ? 'Wisząca' : 'Kwadratowa'})`
                              : crop.customPotName || 'Kliknij, aby ustawić'}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
                          {crop.pot?.hasDrainage ? (
                            <span className="text-emerald-700 dark:text-emerald-400">✅ Odpływ aktywny</span>
                          ) : crop.pot ? (
                            <span className="text-red-600 dark:text-red-400 font-bold">⚠️ Brak drenażu!</span>
                          ) : (
                            <span>Wymóg rośliny: min. {plant.pot.min_volume_l}L</span>
                          )}
                        </div>
                      </div>

                      {/* Sowing / Start Period summary */}
                      <div
                        onClick={() => setConfiguringCropPlant({ plant, crop })}
                        className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 cursor-pointer hover:border-emerald-500/50 transition group"
                      >
                        <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                          <span className="font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Okres & Start siewu</span>
                          </span>
                          <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-bold group-hover:underline">
                            Zmień datę 📅
                          </span>
                        </div>
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <span>{crop.sowing?.method === 'sadzonka' ? '🌿' : '🌱'}</span>
                          <span>
                            {crop.sowing?.date
                              ? `${crop.sowing.date} (${crop.sowing.method === 'sadzonka' ? 'sadzonka' : 'z nasion'})`
                              : 'Kliknij, aby podać datę'}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                          Wiek: <strong className="text-stone-700 dark:text-stone-200">{timelineInfo.daysSinceSowing} dni</strong> od startu
                        </div>
                      </div>

                      {/* Current Phase & Countdown */}
                      <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center justify-between text-[11px] text-emerald-900 dark:text-emerald-300 mb-1">
                          <span className="font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Aktualna faza</span>
                          </span>
                          <span className="text-[10px] font-bold">
                            Faza {timelineInfo.currentPhase.order}/{timelineInfo.phases.length}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5 truncate">
                          <span>{timelineInfo.currentPhase.icon}</span>
                          <span className="truncate">{timelineInfo.currentPhase.name}</span>
                        </div>
                        <div className="text-[10px] text-emerald-900 dark:text-emerald-300 mt-1 font-medium">
                          {timelineInfo.daysUntilNextPhase !== null ? (
                            <span>
                              Za <strong>{timelineInfo.daysUntilNextPhase} dni</strong>: {timelineInfo.phases[timelineInfo.currentPhaseIndex + 1]?.shortName}
                            </span>
                          ) : (
                            <span>Zbiór plonów w toku! 🧺</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Button to toggle the full interactive growth phase schema */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => toggleTimeline(plant.id)}
                        className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>
                          {isTimelineOpen
                            ? 'Ukryj schemat faz i zalecenia'
                            : 'Pokaż schemat faz – czego za ile się spodziewać (kiełkowanie, liście, owoce, zbiór)'}
                        </span>
                        {isTimelineOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <span className="text-[11px] text-stone-500">
                        Cykl: ~{timelineInfo.totalDaysToHarvest} dni do pierwszego zbioru
                      </span>
                    </div>

                    {/* Integrated Growth Phase Timeline & Expectations */}
                    {isTimelineOpen && (
                      <CropGrowthPhaseTimeline
                        plant={plant}
                        crop={crop}
                        onOpenPotSowingModal={() => setConfiguringCropPlant({ plant, crop })}
                        compact={false}
                      />
                    )}

                    {/* Growth Stage Selector (manual override) */}
                    <div className="p-2.5 rounded-2xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200/70 dark:border-stone-800">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-stone-500 dark:text-stone-400 font-medium">
                          Ręczna korekta etapu (jeśli roślina rośnie szybciej/wolniej):
                        </span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                          <span>{currentStageObj?.icon}</span>
                          <span>{currentStageObj?.label}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {STAGES.map((s) => {
                          const isSelected = (crop.stage || 'rosnie') === s.key;
                          return (
                            <button
                              key={s.key}
                              onClick={() => handleStageChange(crop, s.key)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                                isSelected
                                  ? 'bg-emerald-800 text-white border-emerald-800 dark:bg-emerald-700 shadow-2xs'
                                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200/80 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-750'
                              }`}
                            >
                              <span>{s.icon}</span> {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Notes Edit Mode */}
                    {isEditing ? (
                      <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 space-y-2">
                        <div>
                          <label className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block mb-0.5">
                            Twoja donica / lokalizacja:
                          </label>
                          <input
                            type="text"
                            value={editPotName}
                            onChange={(e) => setEditPotName(e.target.value)}
                            placeholder="np. Skrzynka 60cm na parapecie"
                            className="w-full text-xs p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 block mb-0.5">
                            Twoje notatki:
                          </label>
                          <textarea
                            rows={2}
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="np. Podlewana deszczówką, kwitnie obficie"
                            className="w-full text-xs p-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                          />
                        </div>
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => setEditingPlantId(null)}
                            className="px-2.5 py-1 text-[11px] text-stone-600 dark:text-stone-400 hover:bg-stone-200 rounded-md cursor-pointer"
                          >
                            Anuluj
                          </button>
                          <button
                            onClick={() => saveEdit(crop)}
                            className="px-3 py-1 bg-emerald-800 text-white text-[11px] font-semibold rounded-md hover:bg-emerald-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Zapisz</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      crop.notes && (
                        <div className="p-2 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-600 dark:text-stone-400">
                          <span className="italic">"{crop.notes}"</span>
                          <button
                            onClick={() => startEdit(crop)}
                            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                            title="Edytuj notatkę"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectPlant(plant)}
                        className="py-2 px-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Karta rośliny & Poradnik</span>
                      </button>

                      <button
                        onClick={() => onOpenPotCalc(plant)}
                        className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 border border-emerald-200/80 dark:border-emerald-800 cursor-pointer"
                      >
                        <Ruler className="w-3.5 h-3.5" />
                        <span>Kalkulator donicy</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setConfiguringCropPlant({ plant, crop })}
                      className="py-2 px-3.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      <span>Konfiguruj donicę i termin siewu</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Indywidualny Kalendarz Moich Upraw z kafelkami przypominającymi o datach */}
      {myPlants.length > 0 && (
        <MyCropsCalendar
          userSpec={userSpec}
          myPlants={myPlants}
          myCrops={myCrops}
          onToggleTask={handleToggleTask}
          onSelectPlantById={(pId) => {
            const found = allPlants.find((p) => p.id === pId);
            if (found) onSelectPlant(found);
          }}
          onSwitchToFullCalendar={onSwitchToFullCalendar}
        />
      )}

      {/* Modal for Pot & Sowing Configuration */}
      {configuringCropPlant && (
        <CropPotSowingModal
          plant={configuringCropPlant.plant}
          crop={configuringCropPlant.crop}
          onClose={() => setConfiguringCropPlant(null)}
          onSave={(updated) => {
            onUpdateCrop(updated);
            setConfiguringCropPlant(null);
          }}
        />
      )}
    </div>
  );
};

