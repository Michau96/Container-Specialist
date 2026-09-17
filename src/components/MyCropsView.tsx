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
  Minus,
  CopyPlus,
  Layers,
  Droplets,
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
import { SelectVarietyModal } from './SelectVarietyModal';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';
import { getEffectivePlantRequirements, getPlantVarieties } from '../lib/varietyData';

interface Props {
  myCrops: MyCropItem[];
  allPlants: Plant[];
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  dailyRecommendation: DailyCropsRecommendation;
  onRemoveCrop: (cropIdOrPlantId: string) => void;
  onUpdateCrop: (updated: MyCropItem) => void;
  onAddCropWithVariety: (
    plantId: string,
    varietyName: string,
    varietyBadge: string,
    potCount: number,
    openConfigurator?: boolean
  ) => void;
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
  onAddCropWithVariety,
  onSelectPlant,
  onOpenPotCalc,
  onNavigateToSearch,
  onSwitchToFullCalendar,
}) => {
  const [editingCropId, setEditingCropId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editPotName, setEditPotName] = useState<string>('');

  // Modal for pot and sowing configuration
  const [configuringCropPlant, setConfiguringCropPlant] = useState<{
    plant: Plant;
    crop: MyCropItem;
  } | null>(null);

  // Modal for selecting variety when adding starter plants
  const [varietyPickerPlant, setVarietyPickerPlant] = useState<Plant | null>(null);

  // Toggle expanded growth phase timeline per crop card
  const [expandedTimelines, setExpandedTimelines] = useState<Record<string, boolean>>({
    'pomidor-karlowy': true,
  });

  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // Sync selectedCropId with myCrops if it gets deleted or if it's the first load
  React.useEffect(() => {
    if (myCrops.length > 0) {
      const allKeys = myCrops.map((c, i) => c.id || `${c.plantId}_${c.selectedVariety || i}`);
      if (!selectedCropId || !allKeys.includes(selectedCropId)) {
        setSelectedCropId(allKeys[0]);
      }
    } else {
      setSelectedCropId(null);
    }
  }, [myCrops, selectedCropId]);

  const toggleTimeline = (cropKey: string) => {
    setExpandedTimelines((prev) => ({
      ...prev,
      [cropKey]: !prev[cropKey],
    }));
  };

  const startEdit = (crop: MyCropItem, cropKey: string) => {
    setEditingCropId(cropKey);
    setEditNotes(crop.notes || '');
    setEditPotName(crop.customPotName || '');
  };

  const saveEdit = (crop: MyCropItem) => {
    onUpdateCrop({
      ...crop,
      notes: editNotes,
      customPotName: editPotName,
    });
    setEditingCropId(null);
  };

  const handleStageChange = (crop: MyCropItem, newStage: CropGrowthStage) => {
    onUpdateCrop({
      ...crop,
      stage: newStage,
    });
  };

  const handleQuantityChange = (crop: MyCropItem, delta: number) => {
    const currentCount = crop.potCount || crop.pot?.quantity || 1;
    const newCount = Math.max(1, currentCount + delta);
    onUpdateCrop({
      ...crop,
      potCount: newCount,
      pot: crop.pot
        ? {
            ...crop.pot,
            quantity: newCount,
          }
        : undefined,
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

  // Unique plants in my crops
  const uniquePlantIds = Array.from(new Set(myCrops.map((c) => c.plantId)));
  const myPlants = allPlants.filter((p) => uniquePlantIds.includes(p.id));

  // Popular quick adds for empty or small gardens
  const popularStarterPlants = allPlants.filter((p) =>
    ['pomidor-karlowy', 'bazylia-pospolita', 'truskawka-zwisajaca', 'rzodkiewka', 'szpinak-balkonowy', 'papryka-chili'].includes(
      p.id
    ) && !myCrops.some((c) => c.plantId === p.id)
  );

  // Helper for crop key
  const getCropKey = (crop: MyCropItem, index: number) => crop.id || `${crop.plantId}_${crop.selectedVariety || index}`;

  // Group crops for the sidebar
  const groupedCrops = myCrops.reduce((acc, crop, index) => {
    const plant = allPlants.find((p) => p.id === crop.plantId);
    const group = plant?.plant_group || 'inne';
    if (!acc[group]) acc[group] = [];
    acc[group].push({ crop, plant, cropKey: getCropKey(crop, index) });
    return acc;
  }, {} as Record<string, { crop: MyCropItem; plant?: Plant; cropKey: string }[]>);

  const groupLabels: Record<string, string> = {
    warzywa: 'Warzywa',
    owoce: 'Owoce',
    ziola: 'Zioła',
    ozdobne: 'Ozdobne',
    kielki: 'Kiełki',
    grzyby: 'Grzyby',
    inne: 'Inne',
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start w-full">
      {/* 1. Left Sidebar: Szybki wybór uprawy */}
      {myCrops.length > 0 && (
            <div className="order-2 xl:order-1 w-full xl:w-72 hidden md:block shrink-0 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2rem] p-4 xl:sticky xl:top-24 max-h-[80vh] overflow-y-auto shadow-xs">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-4 px-2">
                Szybki wybór uprawy
              </h3>
              
              <div className="space-y-4">
                {Object.entries(groupedCrops).map(([group, items]) => (
                  <div key={group} className="space-y-1.5">
                    <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 px-2 pb-1">
                      {groupLabels[group] || group}
                    </h4>
                    {items.map(({ crop, plant, cropKey }) => {
                      const isSelected = selectedCropId === cropKey;
                      const varietyName = crop.selectedVariety || plant?.top_varieties?.[0]?.name || plant?.varieties?.[0] || 'Standardowa';
                      const potCount = crop.potCount || crop.pot?.quantity || 1;
                      return (
                        <button
                          key={cropKey}
                          onClick={() => setSelectedCropId(cropKey)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition cursor-pointer flex flex-col gap-1 border ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 shadow-2xs'
                              : 'bg-transparent border-transparent hover:bg-stone-50 dark:hover:bg-stone-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-semibold ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-stone-700 dark:text-stone-300'}`}>
                              {plant?.name || 'Nieznana roślina'}
                            </span>
                            {potCount > 1 && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200">
                                {potCount}x
                              </span>
                            )}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`}>
                            {varietyName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

                  )}
      {/* 2. Main Content (Header + Details + Calendar) */}
      <div className="order-1 xl:order-2 flex-1 min-w-0 w-full flex flex-col gap-8">
        {/* 1. Header Banner of My Crops */}
      <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-5 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>Twoja przestrzeń uprawna</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-3">
            <span>Moje uprawy na balkonie</span>
            <span className="text-sm font-bold px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              {myCrops.length} {myCrops.length === 1 ? 'uprawa' : myCrops.length < 5 ? 'uprawy' : 'upraw'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Tutaj zarządzasz swoimi roślinami z uwzględnieniem ich <strong>konkretnych odmian</strong>,
            liczbą <strong>identycznych donic</strong> (np. 2x 30cm) oraz osobnymi uprawami dla różnych pojemników.
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

              {/* 3. Kafelki Moich Upraw (Details only) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                <span>Kafelki Moich upraw</span>
                <span className="text-xs font-normal text-stone-500">
                  (z nazwą odmiany i liczbą jednakowych donic)
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Każdy kafelek prezentuje precyzyjną odmianę, liczbę identycznych donic, schemat faz wzrostu oraz dedykowane zalecenia podlewania.
              </p>
            </div>
            <button
              onClick={onNavigateToSearch}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>+ Dodaj kolejną roślinę z bazy</span>
            </button>
          </div>
        {myCrops.length === 0 ? (
          <div className="text-center py-20 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-stone-900 rounded-[2rem] border border-emerald-100/50 dark:border-stone-800 p-8 space-y-6 shadow-sm">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Sprout className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-stone-800 dark:text-stone-100 tracking-tight">
                Zacznij swój balkonowy ogród! 🌱
              </h4>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
                Twój balkon ma duży potencjał. Dodaj swoją pierwszą uprawę wybierając jedną z najłatwiejszych i najchętniej wybieranych roślin poniżej. Pomożemy Ci zadbać o nią krok po kroku.
              </p>
            </div>

            {popularStarterPlants.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto pt-2">
                {popularStarterPlants.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setVarietyPickerPlant(p)}
                    className="px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-stone-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-2xl border border-stone-200/80 dark:border-stone-700 text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
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
                className="mt-6 px-6 py-3 bg-emerald-700 dark:bg-emerald-600 text-white dark:text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 dark:hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 mx-auto"
              >
                Przeglądaj pełny katalog roślin
              </button>
            </div>
          </div>
        ) : (
            <div className="flex-1 min-w-0 w-full">
              {myCrops.map((crop, index) => {
                const cropKey = getCropKey(crop, index);
                if (cropKey !== selectedCropId) return null;
                const plant = allPlants.find((p) => p.id === crop.plantId);
                if (!plant) return null;

                const varietyName = crop.selectedVariety || plant?.top_varieties?.[0]?.name || plant?.varieties?.[0] || 'Standardowa';
                const potCount = crop.potCount || crop.pot?.quantity || 1;
                const isEditing = editingCropId === cropKey;

                return (
                  <div key={cropKey} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[2rem] p-5 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 overflow-hidden shrink-0 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-3xl">
                          <Sprout className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">{plant.name}</h2>
                            {potCount > 1 && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                                {potCount} sztuki
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-lg">
                              Odmiana: {varietyName}
                            </span>
                            {crop.customPotName && (
                              <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                📍 {crop.customPotName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setConfiguringCropPlant({ plant, crop })}
                          className="p-2 text-stone-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-stone-800 rounded-xl transition tooltip-trigger"
                          title="Skonfiguruj donicę i siew"
                        >
                          <Settings2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => isEditing ? saveEdit(crop) : startEdit(crop, cropKey)}
                          className={`p-2 rounded-xl transition ${isEditing ? 'text-white bg-emerald-600 hover:bg-emerald-700' : 'text-stone-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-stone-800'}`}
                          title={isEditing ? 'Zapisz notatki' : 'Edytuj notatki'}
                        >
                          {isEditing ? <Check className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
                        </button>
                        <button
                          onClick={() => onRemoveCrop(crop.id || crop.plantId)}
                          className="p-2 text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-stone-800 rounded-xl transition"
                          title="Usuń uprawę"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="mb-6 space-y-4 p-4 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-stone-200 dark:border-stone-700">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                            Własna nazwa (np. "Barierka lewa")
                          </label>
                          <input
                            type="text"
                            value={editPotName}
                            onChange={(e) => setEditPotName(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500"
                            placeholder="Wpisz nazwę własną uprawy..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 uppercase tracking-wider">
                            Prywatne notatki
                          </label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 min-h-[80px] resize-none"
                            placeholder="Dodaj notatki (np. data wschodu, zaobserwowane szkodniki)..."
                          />
                        </div>
                      </div>
                    )}

                    {!isEditing && crop.notes && (
                      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-sm text-amber-900 dark:text-amber-200">
                        <div className="font-bold flex items-center gap-1 mb-1 text-xs uppercase tracking-wider">
                          <BookOpen className="w-3.5 h-3.5" /> Twoje notatki:
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{crop.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 border-t border-stone-100 dark:border-stone-800 pt-6">
                      <CropGrowthPhaseTimeline
                        plant={plant}
                        crop={crop}
                        onOpenPotSowingModal={() => setConfiguringCropPlant({ plant, crop })}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      {/* 4. Indywidualny Kalendarz Moich Upraw */}
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
          onAddAsNewCrop={(p, varName, pCount) => {
            onAddCropWithVariety(p.id, varName, 'Odmiana donicowa', pCount, true);
          }}
        />
      )}

      {/* Modal for selecting variety on Starter plants */}
      {varietyPickerPlant && (
        <SelectVarietyModal
          plant={varietyPickerPlant}
          isOpen={true}
          onClose={() => setVarietyPickerPlant(null)}
          onConfirmAdd={(plantId, varName, varBadge, pCount, openConfig) => {
            onAddCropWithVariety(plantId, varName, varBadge, pCount, openConfig);
            setVarietyPickerPlant(null);
          }}
          existingCropCountForPlant={myCrops.filter((c) => c.plantId === varietyPickerPlant.id).length}
        />
      )}
      </div>

      {/* 3. Right Sidebar: Daily Recommendations */}
      <div className="order-3 w-full xl:w-80 shrink-0 xl:sticky xl:top-24 flex flex-col gap-6">
      {/* 2. Dzienna rekomendacja z uwzględnieniem odmian i donic */}
      <DailyRecommendationCard
        recommendation={dailyRecommendation}
        weather={weather}
        userSpec={userSpec}
        cropsCount={myCrops.length}
      layout="vertical"
      />

            </div>
    </div>
  );
};
