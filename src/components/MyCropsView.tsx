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
  Sun,
  Flower2,
  CheckCircle2,
  ListChecks,
  Compass,
  Building,
  Maximize2,
  X,
} from 'lucide-react';
import {
  Plant,
  MyCropItem,
  CropGrowthStage,
  WeatherData,
  UserBalconySpec,
  DailyCropsRecommendation,
  PlantGrowthPhase,
  UserAccount,
} from '../types';
import { DailyRecommendationCard } from './DailyRecommendationCard';
import { DailyHeroTasks } from './DailyHeroTasks';
import { MyCropsCalendar } from './MyCropsCalendar';
import { CropPotSowingModal } from './CropPotSowingModal';
import { CropGrowthPhaseTimeline } from './CropGrowthPhaseTimeline';
import { SelectVarietyModal } from './SelectVarietyModal';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';
import { getPlantGreenhouseInfo, getGreenhouseDailyCareTip } from '../lib/greenhouse';

interface Props {
  myCrops: MyCropItem[];
  allPlants: Plant[];
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  dailyRecommendation: DailyCropsRecommendation;
  currentUser?: UserAccount | null;
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

function getPlantEmoji(plant?: Plant | null): string {
  if (!plant) return '🌱';
  const name = plant.name.toLowerCase();
  if (name.includes('pomidor')) return '🍅';
  if (name.includes('truskawk') || name.includes('poziomk')) return '🍓';
  if (name.includes('papryk') || name.includes('chili')) return '🌶️';
  if (name.includes('ogórek') || name.includes('ogorek')) return '🥒';
  if (name.includes('marchew')) return '🥕';
  if (name.includes('rzodkiew')) return '🌱';
  if (name.includes('sałat') || name.includes('szpinak') || name.includes('rukola') || name.includes('roszponka')) return '🥬';
  if (name.includes('bazylia') || name.includes('mięta') || name.includes('rozmaryn') || name.includes('oregano') || name.includes('tymianek') || name.includes('pietruszk') || name.includes('szczypiorek') || name.includes('kolendra')) return '🌿';
  if (name.includes('borówk') || name.includes('jagod')) return '🫐';
  if (name.includes('bakłażan') || name.includes('oberżyn')) return '🍆';
  if (name.includes('cukinia') || name.includes('dynia')) return '🎃';
  if (name.includes('fasol') || name.includes('groszek') || name.includes('bób')) return '🫛';
  if (name.includes('czosnek') || name.includes('cebul')) return '🧅';
  if (name.includes('lawenda') || name.includes('aksamitk') || name.includes('pelargoni') || name.includes('petuni') || name.includes('bratki') || name.includes('nasturcj')) return '🌸';
  if (name.includes('boczniak') || name.includes('pieczark') || name.includes('grzyb')) return '🍄';
  if (plant.plant_group === 'ziola') return '🌿';
  if (plant.plant_group === 'owoce') return '🍓';
  if (plant.plant_group === 'ozdobne') return '🌸';
  if (plant.plant_group === 'grzyby') return '🍄';
  return '🌱';
}

export const MyCropsView: React.FC<Props> = ({
  myCrops,
  allPlants,
  weather,
  userSpec,
  dailyRecommendation,
  currentUser,
  onRemoveCrop,
  onUpdateCrop,
  onAddCropWithVariety,
  onSelectPlant,
  onOpenPotCalc,
  onNavigateToSearch,
  onSwitchToFullCalendar,
}) => {
  // Main view tab inside MyCropsView
  const [activeSection, setActiveSection] = useState<'crops' | 'daily' | 'calendar'>('crops');

  // Selected crop for inspection
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // Sub-tab inside the selected crop card details (default to pot parameters)
  const [activeCropDetailTab, setActiveCropDetailTab] = useState<'pot' | 'timeline' | 'greenhouse' | 'notes'>('pot');

  // Friendly UX: Progressive disclosure accordion (default collapsed for zero cognitive overload)
  const [showDailyAlert, setShowDailyAlert] = useState<boolean>(true);
  const [isCropCardExpanded, setIsCropCardExpanded] = useState<boolean>(false);

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

  // Sync selectedCropId with myCrops
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

  const handleToggleWaterCrop = (crop: MyCropItem) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isCurrentlyWatered = crop.lastWateredDate === todayStr;
    onUpdateCrop({
      ...crop,
      lastWateredDate: isCurrentlyWatered ? undefined : todayStr,
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
  const getCropKey = (crop: MyCropItem, index: number) =>
    crop.id || `${crop.plantId}_${crop.selectedVariety || index}`;

  // Find currently selected crop & plant
  const selectedIndex = myCrops.findIndex((c, i) => getCropKey(c, i) === selectedCropId);
  const selectedCrop = selectedIndex >= 0 ? myCrops[selectedIndex] : myCrops[0] || null;
  const selectedPlant = selectedCrop ? allPlants.find((p) => p.id === selectedCrop.plantId) || null : null;
  const selectedCropKey = selectedCrop ? getCropKey(selectedCrop, selectedIndex >= 0 ? selectedIndex : 0) : '';

  // Get timeline info for selected crop
  const timelineInfo = selectedPlant && selectedCrop ? getCropTimelineInfo(selectedPlant, selectedCrop) : null;
  const greenhouseInfo = selectedPlant ? getPlantGreenhouseInfo(selectedPlant) : null;
  const greenhouseCareTip =
    selectedPlant && selectedCrop
      ? getGreenhouseDailyCareTip(selectedPlant, !!selectedCrop.inGreenhouse, weather)
      : null;

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Banner & View Switcher Tabs (Full Width) */}
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm rounded-[2rem] p-5 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>Twoja strefa balkonowa</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Moje uprawy
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              {myCrops.length} {myCrops.length === 1 ? 'roślina' : myCrops.length < 5 ? 'rośliny' : 'roślin'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Śledź stan swoich donic, fazy rozwoju i zaplanowane prace w jednym przejrzystym miejscu.
          </p>
        </div>

        {/* Action Controls: Sub-navigation buttons & Add crop button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200/80 dark:border-stone-700">
            <button
              onClick={() => setActiveSection('crops')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'crops'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>Rośliny ({myCrops.length})</span>
            </button>
            <button
              onClick={() => setActiveSection('daily')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'daily'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Zalecenia dnia</span>
            </button>
            <button
              onClick={() => setActiveSection('calendar')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSection === 'calendar'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-500" />
              <span>Harmonogram</span>
            </button>
          </div>

          <button
            id="add-new-crops-nav-btn"
            onClick={onNavigateToSearch}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj roślinę</span>
          </button>
        </div>
      </div>

      {/* 2. Empty State when no crops are added */}
      {myCrops.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-stone-900 rounded-[2rem] border border-emerald-100/50 dark:border-stone-800 p-8 space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sprout className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-2xl font-black text-stone-800 dark:text-stone-100 tracking-tight">
              Zacznij swój balkonowy ogród! 🌱
            </h4>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-2 max-w-md mx-auto leading-relaxed">
              Twój balkon ma duży potencjał. Dodaj swoją pierwszą uprawę wybierając jedną z najłatwiejszych i najchętniej wybieranych roślin poniżej.
            </p>
          </div>

          {popularStarterPlants.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto pt-2">
              {popularStarterPlants.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setVarietyPickerPlant(p)}
                  className="px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-stone-700 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 rounded-2xl border border-stone-200/80 dark:border-stone-700 text-xs font-bold transition shadow-xs hover:shadow-sm flex items-center gap-2 cursor-pointer"
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
              className="mt-4 px-6 py-3 bg-emerald-700 dark:bg-emerald-600 text-white dark:text-white rounded-2xl text-sm font-bold hover:bg-emerald-800 dark:hover:bg-emerald-700 shadow-sm hover:shadow-md transition cursor-pointer inline-flex items-center gap-2"
            >
              Przeglądaj pełny katalog roślin
            </button>
          </div>
        </div>
      )}

      {/* 3. When crops exist: Sub-views based on activeSection */}
      {myCrops.length > 0 && (
        <>
          {/* SECTION 1: ROŚLINY W DONICACH (CROPS VIEW) */}
          {activeSection === 'crops' && (
            <div className="space-y-6">
              {/* Hero To-Do List Section with Task Cards and Empty State */}
              <DailyHeroTasks
                crops={myCrops}
                allPlants={allPlants}
                weather={weather}
                userSpec={userSpec}
                dailyRecommendation={dailyRecommendation}
                currentUser={currentUser}
                onToggleWaterCrop={handleToggleWaterCrop}
                onUpdateCrop={onUpdateCrop}
                onSelectCrop={(cropKey) => {
                  setSelectedCropId(cropKey);
                  setActiveCropDetailTab('pot');
                }}
                onNavigateToSearch={onNavigateToSearch}
              />

              {/* Horizontal Plant Carousel / Selector Pills (Wide & Breathable) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 px-1 uppercase tracking-wider">
                  <span>Wybierz roślinę do podglądu</span>
                  <span>{myCrops.length} {myCrops.length === 1 ? 'pozycja' : 'pozycje'}</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {myCrops.map((crop, index) => {
                    const cropKey = getCropKey(crop, index);
                    const plant = allPlants.find((p) => p.id === crop.plantId);
                    const isSelected = selectedCropKey === cropKey;
                    const varietyName =
                      crop.selectedVariety || plant?.top_varieties?.[0]?.name || plant?.varieties?.[0] || 'Standardowa';
                    const potCount = crop.potCount || crop.pot?.quantity || 1;

                    return (
                      <button
                        key={cropKey}
                        onClick={() => {
                          setSelectedCropId(cropKey);
                          setActiveCropDetailTab('pot');
                        }}
                        className={`px-4 py-2.5 rounded-2xl border text-left transition-all shrink-0 cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-md scale-[1.02]'
                            : 'bg-white dark:bg-stone-900 border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {getPlantEmoji(plant)}
                        </div>
                        <div className="min-w-0 pr-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs truncate max-w-[130px] sm:max-w-[180px]">
                              {plant?.name || 'Roślina'}
                            </span>
                            {crop.inGreenhouse && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                }`}
                                title="Uprawa w szklarni balkonowej"
                              >
                                🏡 Szklarnia
                              </span>
                            )}
                            {potCount > 1 && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-emerald-950 text-emerald-200'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                                }`}
                              >
                                {potCount}x
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[10px] truncate max-w-[130px] sm:max-w-[180px] ${
                              isSelected ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'
                            }`}
                          >
                            {varietyName}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  <button
                    onClick={onNavigateToSearch}
                    className="px-3.5 py-2.5 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 text-stone-500 hover:text-emerald-700 hover:border-emerald-400 dark:hover:text-emerald-400 bg-white/50 dark:bg-stone-900/50 text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dodaj kolejną</span>
                  </button>
                </div>
              </div>

              {/* Main Selected Crop Card (Apple Health / Airbnb Style with Progressive Disclosure) */}
              {selectedCrop && selectedPlant && (
                <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/70 dark:border-stone-800 shadow-sm p-6 sm:p-8 transition-all space-y-6">
                  {/* 1. PRIMARY MINIMALIST VIEW (Avatar, Name, Health/Phase, and Large Call to Action) */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Avatar + Identity + Health/Phase */}
                    <div className="flex items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                      {/* Avatar / Zdjęcie rośliny */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/70 dark:from-emerald-950/50 dark:to-stone-800 border border-emerald-100/80 dark:border-emerald-900/60 flex items-center justify-center text-4xl sm:text-5xl shadow-xs shrink-0 select-none">
                        {getPlantEmoji(selectedPlant)}
                      </div>

                      {/* Nazwa i prosty wskaźnik fazy/zdrowia */}
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
                            {selectedPlant.name}
                          </h3>
                          {(selectedCrop.potCount || 1) > 1 && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                              {selectedCrop.potCount}x w uprawie
                            </span>
                          )}
                        </div>

                        <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2 flex-wrap font-medium">
                          <span>
                            Odmiana:{' '}
                            <strong className="text-stone-800 dark:text-stone-200 font-semibold">
                              {selectedCrop.selectedVariety ||
                                selectedPlant.top_varieties?.[0]?.name ||
                                selectedPlant.varieties?.[0] ||
                                'Standardowa'}
                            </strong>
                          </span>
                          {selectedCrop.customPotName && (
                            <>
                              <span className="text-stone-300 dark:text-stone-700">•</span>
                              <span className="text-emerald-800 dark:text-emerald-300">
                                📍 {selectedCrop.customPotName}
                              </span>
                            </>
                          )}
                          {selectedCrop.inGreenhouse && (
                            <>
                              <span className="text-stone-300 dark:text-stone-700">•</span>
                              <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                                🏡 W szklarni
                              </span>
                            </>
                          )}
                        </div>

                        {/* Bardzo prosty wskaźnik zdrowia/fazy (Apple Health Style) */}
                        <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200 text-xs font-semibold shadow-2xs">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>
                              Zdrowy wzrost • Faza:{' '}
                              <strong className="font-bold text-stone-900 dark:text-stone-100">
                                {timelineInfo?.currentPhase.name || 'Wzrost'}
                              </strong>
                            </span>
                            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                              (Dzień {timelineInfo?.daysSinceSowing || 1} z ~{timelineInfo?.totalDaysToHarvest || 80})
                            </span>
                          </div>

                          {/* Dyskretny pasek postępu cyklu */}
                          {timelineInfo && (
                            <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-medium pl-1">
                              <div className="w-20 sm:w-28 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                  style={{ width: `${timelineInfo.progressPercent}%` }}
                                />
                              </div>
                              <span>{timelineInfo.progressPercent}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Duży, wyraźny przycisk głównej akcji (Call to Action) */}
                    <div className="flex items-center gap-3 shrink-0 self-stretch sm:self-auto justify-end flex-wrap sm:flex-nowrap">
                      {selectedCrop.lastWateredDate === new Date().toISOString().split('T')[0] ? (
                        <button
                          type="button"
                          onClick={() => handleToggleWaterCrop(selectedCrop)}
                          className="flex-1 sm:flex-initial px-6 py-3.5 sm:py-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-400/80 dark:border-emerald-600 font-bold text-sm sm:text-base flex items-center justify-center gap-3 transition-all cursor-pointer group shadow-2xs"
                          title="Kliknij, aby cofnąć oznaczenie podlania"
                        >
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform" />
                          <div className="text-left">
                            <div className="leading-tight flex items-center gap-1.5">
                              <span>Podlane dzisiaj</span>
                              <span className="text-xs bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.2 rounded-md font-bold">
                                ✓
                              </span>
                            </div>
                            <div className="text-[11px] font-normal text-emerald-700 dark:text-emerald-300 opacity-90">
                              Zrobione na dziś • Kliknij by cofnąć
                            </div>
                          </div>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleWaterCrop(selectedCrop)}
                          className="flex-1 sm:flex-initial px-7 py-3.5 sm:py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform">💦</span>
                          <div className="text-left">
                            <div className="leading-tight">Podlej dzisiaj</div>
                            <div className="text-[11px] font-normal text-emerald-100 opacity-90">
                              {timelineInfo?.currentPhase.shortName === 'Kiełkowanie'
                                ? 'Zraszaj mgiełką ze zraszacza'
                                : 'Umiarkowana dawka wody'}
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Dyskretne przyciski narzędziowe */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setConfiguringCropPlant({
                              plant: selectedPlant,
                              crop: selectedCrop,
                            })
                          }
                          className="p-3 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-2xl transition border border-stone-200/80 dark:border-stone-700 cursor-pointer shadow-2xs"
                          title="Parametry donicy i podłoża"
                        >
                          <Settings2 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            editingCropId === selectedCropKey
                              ? saveEdit(selectedCrop)
                              : startEdit(selectedCrop, selectedCropKey)
                          }
                          className={`p-3 rounded-2xl transition border cursor-pointer shadow-2xs ${
                            editingCropId === selectedCropKey
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700 border-stone-200/80 dark:border-stone-700'
                          }`}
                          title="Dodaj notatkę lub lokalizację"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveCrop(selectedCrop.id || selectedCrop.plantId)}
                          className="p-3 text-stone-400 hover:text-rose-600 bg-stone-50 dark:bg-stone-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition border border-stone-200/80 dark:border-stone-700 hover:border-rose-200 cursor-pointer shadow-2xs"
                          title="Usuń uprawę"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Note Editor when triggered */}
                  {editingCropId === selectedCropKey && (
                    <div className="p-4 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3 animate-fade-in">
                      <div>
                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Nazwa własna / Lokalizacja donicy:
                        </label>
                        <input
                          type="text"
                          value={editPotName}
                          onChange={(e) => setEditPotName(e.target.value)}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="np. Donica na balustradzie wschodniej"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                          Twoje notatki o tej roślinie:
                        </label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          placeholder="Zapisz datę wschodu, nawożenie, obserwacje..."
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCropId(null)}
                          className="px-3 py-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
                        >
                          Anuluj
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(selectedCrop)}
                          className="px-4 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800"
                        >
                          Zapisz zmiany
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 2. PROGRESSIVE DISCLOSURE ACCORDION: "Szczegóły uprawy" (domyślnie zwinięty) */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                    <button
                      type="button"
                      onClick={() => setIsCropCardExpanded(!isCropCardExpanded)}
                      className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer group ${
                        isCropCardExpanded
                          ? 'bg-stone-50/80 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                          : 'bg-stone-50/40 hover:bg-stone-100/70 dark:bg-stone-800/30 dark:hover:bg-stone-800/60 border-stone-200/70 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-stone-700 border border-stone-200/80 dark:border-stone-600 flex items-center justify-center text-stone-700 dark:text-stone-200 shadow-2xs">
                          <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span>Szczegóły uprawy</span>
                            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400 hidden sm:inline">
                              (Pojemność donicy, drenaż, opis kiełkowania, instrukcje zraszania)
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 sm:hidden">
                            Pojemność, drenaż, faza, zraszanie
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-200/90 dark:border-stone-600 shadow-2xs group-hover:border-emerald-300 transition-colors">
                        <span>{isCropCardExpanded ? 'Zwiń szczegóły' : 'Pokaż szczegóły'}</span>
                        {isCropCardExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* EXPANDED ACCORDION CONTENT: Apple Health / Airbnb Tabbed Architecture */}
                    {isCropCardExpanded && (
                      <div className="mt-5 space-y-6 animate-fade-in">
                        {/* Tabs Bar */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-stone-200/70 dark:border-stone-800">
                          <button
                            type="button"
                            onClick={() => setActiveCropDetailTab('pot')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                              activeCropDetailTab === 'pot'
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                          >
                            <span>🪴 Donica i drenaż</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCropDetailTab('timeline')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                              activeCropDetailTab === 'timeline'
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                          >
                            <span>🌱 Faza rozwoju i zraszanie</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCropDetailTab('greenhouse')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                              activeCropDetailTab === 'greenhouse'
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                          >
                            <span>🏡 Szklarnia i mikroklimat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCropDetailTab('notes')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                              activeCropDetailTab === 'notes'
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                          >
                            <span>📝 Dziennik i notatki</span>
                          </button>
                        </div>

                        {/* TAB 1: DONICA I DRENAŻ */}
                        {activeCropDetailTab === 'pot' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Karta 1: Pojemność donicy */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                    Pojemność donicy
                                  </span>
                                  <span className="text-lg">🪴</span>
                                </div>
                                <div>
                                  <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                                    {selectedCrop.pot?.volumeL || selectedPlant.pot?.min_volume_l || 10} litrów
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                    Zalecane minimum dla tej odmiany: {selectedPlant.pot?.min_volume_l || 5}L
                                  </p>
                                </div>
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setConfiguringCropPlant({
                                        plant: selectedPlant,
                                        crop: selectedCrop,
                                      })
                                    }
                                    className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Dostosuj wymiary donicy</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Karta 2: Obecność drenażu */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                    Warstwa drenażowa
                                  </span>
                                  <span className="text-lg">💧</span>
                                </div>
                                <div>
                                  <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                    {selectedCrop.pot?.hasDrainage !== false ? (
                                      <span className="text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" /> Drenaż obecny
                                      </span>
                                    ) : (
                                      <span className="text-amber-800 dark:text-amber-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> Brak warstwy drenażu
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                                    Warstwa 3–5 cm keramzytu na dnie zabezpiecza korzenie przed gniciem po ulewnych deszczach.
                                  </p>
                                </div>
                                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                                  Otwory odpływowe: Wymagane w dnie
                                </div>
                              </div>

                              {/* Karta 3: Podłoże i rozstawa */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                    Podłoże & rozstawa
                                  </span>
                                  <span className="text-lg">📏</span>
                                </div>
                                <div>
                                  <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                                    Rozstawa: {selectedPlant.spacing_guide?.spacing_cm || 25} cm
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                    Głębokość min.: {selectedCrop.pot?.depthCm || selectedPlant.pot?.min_depth_cm || 20} cm • pH: 6.0–6.8
                                  </p>
                                </div>
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => onOpenPotCalc(selectedPlant)}
                                    className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>Otwórz kalkulator donic</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 2: FAZA ROZWOJU & ZRZASZANIE */}
                        {activeCropDetailTab === 'timeline' && (
                          <div className="space-y-4">
                            {/* Detailed Phenological Guidance Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Opis bieżącego etapu / kiełkowania */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl">{timelineInfo?.currentPhase.icon || '🌱'}</span>
                                  <div>
                                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                      {timelineInfo?.currentPhase.name || 'Wzrost'} (Dzień {timelineInfo?.daysSinceSowing || 1})
                                    </h4>
                                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                      Opis etapu i spodziewany rozwój
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                                  {timelineInfo?.currentPhase.whatToExpect ||
                                    'Roślina dynamicznie rozwija system korzeniowy oraz pierwsze liście właściwe.'}
                                </p>
                                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 pt-1">
                                  Kluczowe zadanie: {timelineInfo?.currentPhase.keyCareAction || 'Zapewnij optymalne nasłonecznienie.'}
                                </div>
                              </div>

                              {/* Instrukcje zraszania i nawadniania */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                                    <Droplets className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                      Nawadnianie & zraszanie
                                    </h4>
                                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                      Zalecenia dla bieżącej fazy
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                                  {timelineInfo?.currentPhase.wateringTip ||
                                    'Utrzymuj podłoże stale lekko wilgotne, ale nie mokre.'}
                                </p>
                                <div className="text-xs text-stone-500 dark:text-stone-400 pt-1">
                                  💡 <strong>Wskazówka:</strong>{' '}
                                  {timelineInfo?.currentPhase.shortName === 'Kiełkowanie'
                                    ? 'Używaj wyłącznie delikatnej mgiełki ze zraszacza, by nie wypłukać nasion ani nie uszkodzić drobnych korzonków.'
                                    : 'Podlewaj rano u nasady łodygi, unikając moczenia liści w pełnym słońcu.'}
                                </div>
                              </div>
                            </div>

                            {/* Full Interactive Stepper Timeline */}
                            <div className="pt-2">
                              <CropGrowthPhaseTimeline
                                plant={selectedPlant}
                                crop={selectedCrop}
                                onOpenPotSowingModal={() =>
                                  setConfiguringCropPlant({
                                    plant: selectedPlant,
                                    crop: selectedCrop,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        {/* TAB 3: SZKLARNIA I MIKROKLIMAT */}
                        {activeCropDetailTab === 'greenhouse' && (
                          <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-stone-700/60">
                              <div>
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                  <span>🏡 Warunki szklarniowe i mikroklimat</span>
                                  <span className="text-xs font-normal text-stone-500">
                                    ({selectedCrop.inGreenhouse ? 'W szklarence balkonowej' : 'Otwarty balkon'})
                                  </span>
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                  Szklarnia zapewnia bufor cieplny +3°C do +8°C, ale wymaga regularnego wietrzenia.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateCrop({
                                    ...selectedCrop,
                                    inGreenhouse: !selectedCrop.inGreenhouse,
                                  });
                                }}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
                                  selectedCrop.inGreenhouse
                                    ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                                    : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300'
                                }`}
                              >
                                <span>
                                  {selectedCrop.inGreenhouse
                                    ? '✓ W szklarni (Kliknij by zmienić)'
                                    : 'Przenieś do szklarni'}
                                </span>
                              </button>
                            </div>

                            {greenhouseCareTip && (
                              <div className="p-4 rounded-xl bg-white dark:bg-stone-900/80 border border-emerald-200/80 dark:border-emerald-800/80 space-y-1">
                                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                                  <span>{greenhouseCareTip.actionRequired ? '⚠️' : '💡'}</span>
                                  <span>{greenhouseCareTip.headline}</span>
                                </div>
                                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                                  {greenhouseCareTip.detail}
                                </p>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-700">
                                <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                                  💨 Cyrkulacja powietrza
                                </span>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                  W słoneczne dni uchylaj suwak lub okienko szklarni, aby temperatura nie przekroczyła 32°C.
                                </p>
                              </div>
                              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-700">
                                <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                                  🐝 Zapylanie kwiatów
                                </span>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                  W fazie kwitnienia lekko potrząsaj pędami raz dziennie lub zapewnij dostęp owadom zapylającym.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TAB 4: NOTATKI I DZIENNIK */}
                        {activeCropDetailTab === 'notes' && (
                          <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-4 shadow-sm">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                Dziennik hodowcy & notatki
                              </h4>
                              <button
                                type="button"
                                onClick={() => startEdit(selectedCrop, selectedCropKey)}
                                className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edytuj notatkę</span>
                              </button>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                              {selectedCrop.notes ? (
                                <p className="whitespace-pre-wrap">{selectedCrop.notes}</p>
                              ) : (
                                <p className="text-stone-400 italic">
                                  Brak wpisanych notatek. Kliknij &quot;Edytuj notatkę&quot;, aby zapisać datę kiełkowania, rodzaj zastosowanego nawozu lub uwagi o roślinie.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: ZALECENIA DNIA (DAILY RECOMMENDATIONS FULL WIDTH) */}
          {activeSection === 'daily' && (
            <div className="space-y-4">
              <DailyRecommendationCard
                recommendation={dailyRecommendation}
                weather={weather}
                userSpec={userSpec}
                cropsCount={myCrops.length}
                layout="horizontal"
              />
            </div>
          )}

          {/* SECTION 3: KALENDARZ PRAC I ZADAŃ (FULL WIDTH) */}
          {activeSection === 'calendar' && (
            <div className="space-y-4">
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
            </div>
          )}
        </>
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
  );
};
