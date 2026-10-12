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
  LifeBuoy,
  Bandage,
  ShieldAlert,
  Camera,
  Play,
  Film,
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
  CropPhotoEntry,
} from '../types';
import { DailyRecommendationCard } from './DailyRecommendationCard';
import { DailyHeroTasks } from './DailyHeroTasks';
import { MyCropsCalendar } from './MyCropsCalendar';
import { CropPotSowingModal } from './CropPotSowingModal';
import { CropGrowthPhaseTimeline } from './CropGrowthPhaseTimeline';
import { SelectVarietyModal } from './SelectVarietyModal';
import { RescueFlowModal } from './RescueFlowModal';
import { TimelapseModal } from './TimelapseModal';
import { AddCropPhotoModal } from './AddCropPhotoModal';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';
import { getPlantGreenhouseInfo, getGreenhouseDailyCareTip } from '../lib/greenhouse';
import { isWateringSuspended, getDaysRemainingInSuspension } from '../lib/rescueData';
import { getPlantVisual } from '../lib/plantImages';
import { SAMPLE_TOMATO_TIMELAPSE, getPhotoCadenceInfo } from '../lib/cropPhotos';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
  myCrops: MyCropItem[];
  allPlants: Plant[];
  weather: WeatherData | null;
  userSpec: UserBalconySpec;
  dailyRecommendation: DailyCropsRecommendation;
  currentUser?: UserAccount | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
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
  currentUser,
  isLoading = false,
  error = null,
  onRetry,
  onRemoveCrop,
  onUpdateCrop,
  onAddCropWithVariety,
  onSelectPlant,
  onOpenPotCalc,
  onNavigateToSearch,
  onSwitchToFullCalendar,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  // Main view tab inside MyCropsView
  const [activeSection, setActiveSection] = useState<'crops' | 'daily' | 'calendar'>('crops');

  // Selected crop for inspection
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);

  // Sub-tab inside the selected crop card details (default to pot parameters)
  const [activeCropDetailTab, setActiveCropDetailTab] = useState<'pot' | 'timeline' | 'photos' | 'greenhouse' | 'notes'>('pot');

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

  // Modal for plant rescue flow (disaster recovery / health issues)
  const [rescueCropPlant, setRescueCropPlant] = useState<{
    plant: Plant;
    crop: MyCropItem;
  } | null>(null);

  // Modal for Timelapse viewer
  const [timelapseCropPlant, setTimelapseCropPlant] = useState<{
    plant: Plant;
    crop: MyCropItem;
    initialIndex?: number;
  } | null>(null);

  // Modal for adding a new crop photo
  const [addPhotoCropPlant, setAddPhotoCropPlant] = useState<{
    plant: Plant;
    crop: MyCropItem;
    phaseId?: string;
  } | null>(null);

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
  const selectedPlantVisual = selectedPlant ? getPlantVisual(selectedPlant.id, selectedPlant.plant_group) : null;

  // Get timeline info for selected crop
  const timelineInfo = selectedPlant && selectedCrop ? getCropTimelineInfo(selectedPlant, selectedCrop) : null;
  const greenhouseInfo = selectedPlant ? getPlantGreenhouseInfo(selectedPlant) : null;
  const greenhouseCareTip =
    selectedPlant && selectedCrop
      ? getGreenhouseDailyCareTip(selectedPlant, !!selectedCrop.inGreenhouse, weather)
      : null;

  // Rescue Flow status for selected crop
  const isSelectedCropRescueActive = !!selectedCrop?.rescuePlan?.active;
  const isSelectedCropWateringSuspended = isWateringSuspended(selectedCrop?.rescuePlan);
  const selectedCropSuspensionDaysRemaining = getDaysRemainingInSuspension(selectedCrop?.rescuePlan);

  return (
    <div className="w-full space-y-6">
      {/* 1. Header Banner & View Switcher Tabs (Full Width) */}
      <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-sm rounded-[2rem] p-5 sm:p-7 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>{isEn ? 'Your balcony zone' : 'Twoja strefa balkonowa'}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              {isEn ? 'My Crops' : 'Moje uprawy'}
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
              {myCrops.length} {myCrops.length === 1 ? (isEn ? 'plant' : 'roślina') : myCrops.length < 5 ? (isEn ? 'plants' : 'rośliny') : (isEn ? 'plants' : 'roślin')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
            {isEn
              ? 'Track the status of your pots, growth phases, and scheduled tasks in one clear dashboard.'
              : 'Śledź stan swoich donic, fazy rozwoju i zaplanowane prace w jednym przejrzystym miejscu.'}
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
              <span>{isEn ? 'Plants' : 'Rośliny'} ({myCrops.length})</span>
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
              <span>{isEn ? 'Daily Tips' : 'Zalecenia dnia'}</span>
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
              <span>{isEn ? 'Schedule' : 'Harmonogram'}</span>
            </button>
          </div>

          <button
            id="add-new-crops-nav-btn"
            onClick={onNavigateToSearch}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>{isEn ? 'Add plant' : 'Dodaj roślinę'}</span>
          </button>
        </div>
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <div
          role="status"
          aria-busy="true"
          data-testid="my-crops-loading-state"
          className="space-y-4"
        >
          <div className="flex items-center gap-2.5 text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-bold bg-emerald-50 dark:bg-emerald-950/60 px-4 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <div className="w-4 h-4 rounded-full border-2 border-emerald-600 dark:border-emerald-400 border-t-transparent animate-spin shrink-0" />
            <span data-testid="dashboard-loading-status-text">
              {isEn ? 'Loading your crops schedule and tasks...' : 'Ładowanie terminarza Twoich upraw i zadań...'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="h-64 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 animate-pulse" />
            <div className="h-64 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 animate-pulse hidden md:block" />
            <div className="h-64 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 animate-pulse hidden lg:block" />
          </div>
        </div>
      )}

      {/* 3. Error State */}
      {!isLoading && error && (
        <div
          role="alert"
          data-testid="my-crops-error-state"
          className="bg-white dark:bg-stone-900 rounded-[2rem] border-2 border-rose-300 dark:border-rose-900/80 p-6 sm:p-8 text-center space-y-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h3 data-testid="my-crops-error-heading" className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100">
            {isEn ? 'Dashboard error' : 'Błąd ładowania upraw'}
          </h3>
          <p data-testid="my-crops-error-message" className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
            {error}
          </p>
          {onRetry && (
            <div className="pt-2">
              <button
                id="my-crops-retry-btn"
                data-testid="my-crops-retry-btn"
                onClick={onRetry}
                className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer"
              >
                {isEn ? 'Retry' : 'Spróbuj ponownie'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. Empty State when no crops are added */}
      {!isLoading && !error && myCrops.length === 0 && (
        <div
          data-testid="my-crops-empty-state"
          className="text-center py-16 bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/30 dark:to-stone-900 rounded-[2rem] border-2 border-emerald-200/80 dark:border-stone-800 p-6 sm:p-10 space-y-6 shadow-sm"
        >
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sprout className="w-10 h-10 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="space-y-3">
            <div
              data-testid="empty-collection-badge"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs"
            >
              <span data-testid="empty-collection-label">Moje uprawy</span>
              <span>•</span>
              <span data-testid="empty-collection-count">0</span>
            </div>

            <h4
              data-testid="my-crops-empty-heading"
              className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight"
            >
              {isEn ? 'Moje uprawy (0): Start your balcony garden! 🌱' : 'Moje uprawy (0): Zacznij swój balkonowy ogród! 🌱'}
            </h4>
            <p
              data-testid="my-crops-empty-message"
              className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 max-w-md mx-auto leading-relaxed"
            >
              {isEn
                ? 'Your balcony collection "Moje uprawy" has 0 plants right now. Add your first crop by selecting one of the easiest and most popular plants below.'
                : 'Twoja kolekcja „Moje uprawy” zawiera obecnie 0 roślin. Dodaj swoją pierwszą uprawę wybierając jedną z najłatwiejszych i najchętniej wybieranych roślin poniżej.'}
            </p>
          </div>

          {popularStarterPlants.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto pt-2">
              {popularStarterPlants.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setVarietyPickerPlant(p)}
                  className="px-4 py-2.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-stone-800 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-200 rounded-2xl border border-stone-300 dark:border-stone-700 text-xs font-bold transition shadow-xs hover:shadow-sm flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{p.name}</span>
                </button>
              ))}
            </div>
          )}

          <div className="pt-2">
            <button
              id="empty-action-navigate-search"
              data-testid="empty-action-navigate-search"
              onClick={onNavigateToSearch}
              className="px-6 py-3.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition cursor-pointer inline-flex items-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>{isEn ? 'Browse full plant catalog' : 'Przeglądaj pełny katalog roślin'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. When crops exist: Sub-views based on activeSection */}
      {!isLoading && !error && myCrops.length > 0 && (
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
                onOpenRescueModal={(crop, plant) => setRescueCropPlant({ crop, plant })}
              />

              {/* Horizontal Plant Carousel / Selector Pills (Wide & Breathable) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 px-1 uppercase tracking-wider">
                  <span>{isEn ? 'Select crop to preview' : 'Wybierz roślinę do podglądu'}</span>
                  <span>{myCrops.length} {myCrops.length === 1 ? (isEn ? 'item' : 'pozycja') : (isEn ? 'items' : 'pozycje')}</span>
                </div>

                <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {myCrops.map((crop, index) => {
                    const cropKey = getCropKey(crop, index);
                    const plant = allPlants.find((p) => p.id === crop.plantId);
                    const isSelected = selectedCropKey === cropKey;
                    const plantVisual = plant ? getPlantVisual(plant.id, plant.plant_group) : null;
                    const rawCropVariety =
                      crop.selectedVariety || plant?.top_varieties?.[0]?.name || plant?.varieties?.[0];
                    const varietyName =
                      typeof rawCropVariety === 'string'
                        ? rawCropVariety
                        : (rawCropVariety as any)?.name || (isEn ? 'Standard' : 'Standardowa');
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
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xs ${
                            isSelected
                              ? 'ring-2 ring-emerald-300/80'
                              : 'bg-stone-100 dark:bg-stone-800'
                          }`}
                        >
                          {plantVisual?.imageUrl ? (
                            <img
                              src={plantVisual.imageUrl}
                              alt={plantVisual.alt}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover object-center relative z-10"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : null}
                          <Sprout className="w-4 h-4 text-emerald-600/50 pointer-events-none absolute" />
                        </div>
                        <div className="min-w-0 pr-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs truncate max-w-[130px] sm:max-w-[180px]">
                              {plant?.name || (isEn ? 'Crop' : 'Roślina')}
                            </span>
                            {crop.rescuePlan?.active && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-rose-900 text-rose-200 border border-rose-700'
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                                }`}
                                title={isEn ? 'Active rescue mode for this crop' : 'Aktywny tryb ratunkowy dla tej uprawy'}
                              >
                                {isEn ? '🛟 Rescue' : '🛟 Ratunek'}
                              </span>
                            )}
                            {crop.inGreenhouse && (
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                                  isSelected
                                    ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                }`}
                                title={isEn ? 'Growing in balcony greenhouse' : 'Uprawa w szklarni balkonowej'}
                              >
                                {isEn ? '🏡 Greenhouse' : '🏡 Szklarnia'}
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
                    <span>{isEn ? '+ Add another' : 'Dodaj kolejną'}</span>
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
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100/70 dark:from-emerald-950/50 dark:to-stone-800 border border-emerald-100/80 dark:border-emerald-900/60 relative overflow-hidden flex items-center justify-center shadow-xs shrink-0 select-none">
                        {selectedPlantVisual?.imageUrl ? (
                          <img
                            src={selectedPlantVisual.imageUrl}
                            alt={selectedPlantVisual.alt}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center relative z-10"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <Sprout className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600/50 pointer-events-none absolute" />
                      </div>

                      {/* Nazwa i prosty wskaźnik fazy/zdrowia */}
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
                            {selectedPlant.name}
                          </h3>
                          {(selectedCrop.potCount || 1) > 1 && (
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                              {selectedCrop.potCount}x {isEn ? 'in cultivation' : 'w uprawie'}
                            </span>
                          )}
                        </div>

                        <div className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2 flex-wrap font-medium">
                          <span>
                            {isEn ? 'Variety:' : 'Odmiana:'}{' '}
                            <strong className="text-stone-800 dark:text-stone-200 font-semibold">
                              {selectedCrop.selectedVariety ||
                                selectedPlant.top_varieties?.[0]?.name ||
                                (typeof selectedPlant.varieties?.[0] === 'string'
                                  ? selectedPlant.varieties?.[0]
                                  : (selectedPlant.varieties?.[0] as any)?.name) ||
                                (isEn ? 'Standard' : 'Standardowa')}
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
                                {isEn ? '🏡 In greenhouse' : '🏡 W szklarni'}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Wskaźnik zdrowia/fazy LUB Alert Trybu Ratunkowego */}
                        <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
                          {isSelectedCropRescueActive ? (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs font-bold shadow-2xs">
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                              </span>
                              <span>
                                {isEn ? '🚨 Rescue Mode:' : '🚨 Tryb ratunkowy:'} {selectedCrop.rescuePlan?.issueTitle}
                              </span>
                              {isSelectedCropWateringSuspended && (
                                <span className="text-[10px] font-semibold text-rose-800 dark:text-rose-200 bg-rose-200/80 dark:bg-rose-900 px-1.5 py-0.2 rounded-md">
                                  {isEn ? 'Watering paused' : 'Podlewanie wstrzymane'} ({selectedCropSuspensionDaysRemaining} {selectedCropSuspensionDaysRemaining === 1 ? (isEn ? 'day' : 'dzień') : (isEn ? 'days' : 'dni')})
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/70 text-emerald-900 dark:text-emerald-200 text-xs font-semibold shadow-2xs">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              <span>
                                {isEn ? 'Healthy Growth • Phase:' : 'Zdrowy wzrost • Faza:'}{' '}
                                <strong className="font-bold text-stone-900 dark:text-stone-100">
                                  {timelineInfo?.currentPhase.name || (isEn ? 'Growth' : 'Wzrost')}
                                </strong>
                              </span>
                              <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                                ({isEn ? 'Day' : 'Dzień'} {timelineInfo?.daysSinceSowing || 1} {isEn ? 'of' : 'z'} ~{timelineInfo?.totalDaysToHarvest || 80})
                              </span>
                            </div>
                          )}

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

                    {/* Right: Główne akcje (Podlewanie + Tryb Ratunkowy "Coś jest nie tak") */}
                    <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-stretch sm:self-auto justify-end flex-wrap sm:flex-nowrap">
                      {isSelectedCropRescueActive ? (
                        <>
                          {/* Przycisk aktywnego planu ratunkowego */}
                          <button
                            type="button"
                            id={`rescue-active-btn-${selectedCropKey}`}
                            onClick={() => setRescueCropPlant({ crop: selectedCrop, plant: selectedPlant })}
                            className="flex-1 sm:flex-initial px-5 py-3.5 sm:py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-sm group"
                            title={isEn ? 'Open rescue plan card or report another issue' : 'Otwórz kartę planu ratunkowego lub zgłoś inny problem'}
                          >
                            <LifeBuoy className="w-5 h-5 text-white group-hover:rotate-45 transition-transform shrink-0" />
                            <div className="text-left">
                              <div className="leading-tight">{isEn ? 'Rescue Plan' : 'Plan ratunkowy'}</div>
                              <div className="text-[10px] font-normal text-rose-100 opacity-90">
                                {selectedCrop.rescuePlan?.issueTitle} • {isEn ? 'Open' : 'Otwórz'}
                              </div>
                            </div>
                          </button>

                          {/* Status wstrzymanego podlewania lub opcja ostrożnego wznowienia */}
                          {isSelectedCropWateringSuspended ? (
                            <div
                              className="flex-1 sm:flex-initial px-4 py-3 sm:py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-200 flex items-center gap-2.5"
                              title={isEn ? 'Watering paused under rescue plan' : 'Podlewanie wstrzymane w ramach planu ratunkowego'}
                            >
                              <span className="text-lg shrink-0">⏸️</span>
                              <div className="text-left">
                                <div className="text-xs font-bold leading-tight">{isEn ? 'Watering suspended' : 'Podlewanie zawieszone'}</div>
                                <div className="text-[10px] text-rose-700 dark:text-rose-300">
                                  {isEn ? 'Remaining:' : 'Zostało'} {selectedCropSuspensionDaysRemaining} {selectedCropSuspensionDaysRemaining === 1 ? (isEn ? 'day' : 'dzień') : (isEn ? 'days' : 'dni')}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleWaterCrop(selectedCrop)}
                              className="flex-1 sm:flex-initial px-4 py-3 sm:py-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                              title={isEn ? 'Grace period over – you can water after checking soil moisture' : 'Karencja minęła – możesz podlać po sprawdzeniu wilgotności podłoża'}
                            >
                              <span>💧</span>
                              <span>{isEn ? 'Resume careful watering' : 'Wznów ostrożne podlewanie'}</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {/* Standardowy przycisk podlewania */}
                          {selectedCrop.lastWateredDate === new Date().toISOString().split('T')[0] ? (
                            <button
                              type="button"
                              onClick={() => handleToggleWaterCrop(selectedCrop)}
                              className="flex-1 sm:flex-initial px-5 py-3.5 sm:py-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-400/80 dark:border-emerald-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer group shadow-2xs"
                              title={isEn ? 'Click to undo watered status' : 'Kliknij, aby cofnąć oznaczenie podlania'}
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0" />
                              <div className="text-left">
                                <div className="leading-tight flex items-center gap-1.5">
                                  <span>{isEn ? 'Watered today' : 'Podlane dzisiaj'}</span>
                                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.2 rounded-md font-bold">
                                    ✓
                                  </span>
                                </div>
                                <div className="text-[10px] font-normal text-emerald-700 dark:text-emerald-300 opacity-90">
                                  {isEn ? 'Done for today • Undo' : 'Zrobione na dziś • Cofnij'}
                                </div>
                              </div>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleToggleWaterCrop(selectedCrop)}
                              className="flex-1 sm:flex-initial px-6 py-3.5 sm:py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform shrink-0">💦</span>
                              <div className="text-left">
                                <div className="leading-tight">{isEn ? 'Water today' : 'Podlej dzisiaj'}</div>
                                <div className="text-[10px] font-normal text-emerald-100 opacity-90">
                                  {timelineInfo?.currentPhase.shortName === 'Kiełkowanie'
                                    ? (isEn ? 'Mist gently with sprayer' : 'Zraszaj mgiełką ze zraszacza')
                                    : (isEn ? 'Moderate watering' : 'Umiarkowana dawka wody')}
                                </div>
                              </div>
                            </button>
                          )}

                          {/* Wyraźny przycisk Trybu Ratunkowego: "Coś jest nie tak" */}
                          <button
                            type="button"
                            id={`rescue-btn-${selectedCropKey}`}
                            onClick={() => setRescueCropPlant({ crop: selectedCrop, plant: selectedPlant })}
                            className="flex-1 sm:flex-initial px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-amber-50 hover:bg-amber-100/90 active:scale-[0.98] dark:bg-amber-950/40 dark:hover:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-2 border-amber-300/90 dark:border-amber-700/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-2xs group"
                            title={isEn ? 'Report issue: yellowing leaves, mold, wilting, pests – start rescue plan' : 'Zgłoś problem: żółknięcie liści, biały nalot, więdnięcie, szkodniki – uruchom plan ratunkowy'}
                          >
                            <Bandage className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                            <div className="text-left">
                              <div className="leading-tight">{isEn ? 'Something is wrong' : 'Coś jest nie tak'}</div>
                              <div className="text-[10px] font-normal text-amber-700 dark:text-amber-300 opacity-90">
                                {isEn ? 'Plant First Aid' : 'Pogotowie roślinne'}
                              </div>
                            </div>
                          </button>

                          {/* Wyraźny przycisk Dziennika zdjęć i animacji poklatkowej (Timelapse) */}
                          <button
                            type="button"
                            id={`timelapse-btn-${selectedCropKey}`}
                            onClick={() => {
                              if (selectedCrop.photos && selectedCrop.photos.length > 0) {
                                setTimelapseCropPlant({ crop: selectedCrop, plant: selectedPlant });
                              } else {
                                setAddPhotoCropPlant({ crop: selectedCrop, plant: selectedPlant });
                              }
                            }}
                            className="flex-1 sm:flex-initial px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 active:scale-[0.98] dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border-2 border-emerald-300/80 dark:border-emerald-700/80 text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition cursor-pointer shadow-2xs group"
                            title={isEn ? 'Photo journal and timelapse animation of crop growth' : 'Dziennik zdjęć i animacja poklatkowa (Timelapse) ze wzrostu rośliny'}
                          >
                            <Camera className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0" />
                            <div className="text-left">
                              <div className="leading-tight flex items-center gap-1.5">
                                <span>Timelapse</span>
                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 font-extrabold">
                                  {selectedCrop.photos?.length || 0}
                                </span>
                              </div>
                              <div className="text-[10px] font-normal text-emerald-700 dark:text-emerald-300 opacity-90">
                                {selectedCrop.photos && selectedCrop.photos.length >= 2
                                  ? (isEn ? 'Play timelapse' : 'Odtwórz animację')
                                  : (isEn ? 'Add growth frame' : 'Dodaj kadr wzrostu')}
                              </div>
                            </div>
                          </button>
                        </>
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
                          title={isEn ? 'Pot & substrate parameters' : 'Parametry donicy i podłoża'}
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
                          title={isEn ? 'Add note or location' : 'Dodaj notatkę lub lokalizację'}
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveCrop(selectedCrop.id || selectedCrop.plantId)}
                          className="p-3 text-stone-400 hover:text-rose-600 bg-stone-50 dark:bg-stone-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-2xl transition border border-stone-200/80 dark:border-stone-700 hover:border-rose-200 cursor-pointer shadow-2xs"
                          title={isEn ? 'Delete crop' : 'Usuń uprawę'}
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
                          {isEn ? 'Custom pot name / location:' : 'Nazwa własna / Lokalizacja donicy:'}
                        </label>
                        <input
                          type="text"
                          value={editPotName}
                          onChange={(e) => setEditPotName(e.target.value)}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder={isEn ? 'e.g. East balcony rail pot' : 'np. Donica na balustradzie wschodniej'}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                          {isEn ? 'Your notes for this plant:' : 'Twoje notatki o tej roślinie:'}
                        </label>
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={2}
                          className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                          placeholder={isEn ? 'Record sprouting date, fertilizing, observations...' : 'Zapisz datę wschodu, nawożenie, obserwacje...'}
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingCropId(null)}
                          className="px-3 py-1 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
                        >
                          {isEn ? 'Cancel' : 'Anuluj'}
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(selectedCrop)}
                          className="px-4 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-800"
                        >
                          {isEn ? 'Save changes' : 'Zapisz zmiany'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 1.5. ACTIVE RESCUE PLAN BANNER & CHECKLIST */}
                  {isSelectedCropRescueActive && selectedCrop.rescuePlan && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/90 via-amber-50/50 to-orange-50/70 dark:from-rose-950/40 dark:via-stone-900 dark:to-amber-950/30 border-2 border-rose-300 dark:border-rose-800/80 shadow-xs space-y-3.5">
                      <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-rose-300 dark:border-rose-700 shrink-0 bg-stone-100 dark:bg-stone-800 relative shadow-2xs">
                            {selectedCrop.rescuePlan.imageUrl ? (
                              <img
                                src={selectedCrop.rescuePlan.imageUrl}
                                alt={selectedCrop.rescuePlan.issueTitle}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center text-2xl">
                                {selectedCrop.rescuePlan.issueIcon}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                                {selectedCrop.rescuePlan.symptomBadge}
                              </span>
                              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                                {isEn ? '🚨 Rescue plan in progress' : '🚨 Plan ratunkowy w toku'}
                              </span>
                            </div>
                            <h4 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 mt-0.5">
                              {selectedCrop.rescuePlan.issueTitle}
                            </h4>
                            <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed">
                              {selectedCrop.rescuePlan.diagnosis}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <button
                            type="button"
                            onClick={() => setRescueCropPlant({ crop: selectedCrop, plant: selectedPlant })}
                            className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-700 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <LifeBuoy className="w-3.5 h-3.5 text-rose-600" />
                            <span>{isEn ? 'Details / Change' : 'Szczegóły / Zmień'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...selectedCrop,
                                rescuePlan: undefined,
                              };
                              onUpdateCrop(updated);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                            title={isEn ? 'Click when plant recovered to resume normal schedule' : 'Kliknij, gdy roślina wyzdrowiała, aby wznowić normalny harmonogram'}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Plant recovered ✓' : 'Roślina wyzdrowiała ✓'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Suspension Notice */}
                      {isSelectedCropWateringSuspended ? (
                        <div className="p-3 rounded-xl bg-rose-100/80 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 text-xs text-rose-950 dark:text-rose-100 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2 font-medium">
                            <span>⏸️</span>
                            <span>
                              <strong>{isEn ? 'Regular watering paused:' : 'Normalne podlewanie zawieszone:'}</strong> {isEn ? 'let top soil layer dry to aerate roots.' : 'pozwól przeschnąć wierzchniej warstwie ziemi, by dotlenić korzenie.'}
                            </span>
                          </div>
                          <span className="font-bold text-rose-800 dark:text-rose-200 bg-white/80 dark:bg-stone-900/80 px-2.5 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                            {isEn ? 'Remaining:' : 'Zostało:'} {selectedCropSuspensionDaysRemaining} {selectedCropSuspensionDaysRemaining === 1 ? (isEn ? 'day' : 'dzień') : (isEn ? 'days' : 'dni')}
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                          <span>💧</span>
                          <span>
                            {isEn ? 'Pause period ended. Check soil moisture 2-3cm deep before watering.' : 'Okres wstrzymania minął. Przed podlaniem zbadaj ziemię palcem na głębokość 2-3 cm.'}
                          </span>
                        </div>
                      )}

                      {/* Interactive Checklist of Steps */}
                      <div className="space-y-2 pt-1">
                        <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-between">
                          <span>{isEn ? 'Rescue action plan (complete steps below):' : 'Jednoetapowy plan ratunkowy (wykonaj poniższe kroki):'}</span>
                          <span className="text-[11px] font-normal text-stone-500">
                            {isEn ? 'Click to check off completed step' : 'Kliknij, aby odznaczyć wykonany krok'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-1.5">
                          {selectedCrop.rescuePlan.steps.map((step, idx) => {
                            const isDone = !!selectedCrop.rescuePlan?.completedSteps?.[idx];
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  const currentSteps = { ...(selectedCrop.rescuePlan?.completedSteps || {}) };
                                  currentSteps[idx] = !isDone;
                                  const updated = {
                                    ...selectedCrop,
                                    rescuePlan: {
                                      ...selectedCrop.rescuePlan!,
                                      completedSteps: currentSteps,
                                    },
                                  };
                                  onUpdateCrop(updated);
                                }}
                                className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-start gap-2.5 ${
                                  isDone
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 line-through text-stone-500 dark:text-stone-400'
                                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 hover:border-amber-300'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                                    isDone
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800'
                                  }`}
                                >
                                  {isDone && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="leading-relaxed flex-1">{step}</span>
                              </button>
                            );
                          })}
                        </div>
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
                            <span>{isEn ? 'Crop Details' : 'Szczegóły uprawy'}</span>
                            <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400 hidden sm:inline">
                              {isEn ? '(Pot volume, drainage, sprouting guide, misting instructions)' : '(Pojemność donicy, drenaż, opis kiełkowania, instrukcje zraszania)'}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 sm:hidden">
                            {isEn ? 'Volume, drainage, phase, misting' : 'Pojemność, drenaż, faza, zraszanie'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 px-3.5 py-1.5 rounded-xl bg-white dark:bg-stone-700 border border-stone-200/90 dark:border-stone-600 shadow-2xs group-hover:border-emerald-300 transition-colors">
                        <span>{isCropCardExpanded ? (isEn ? 'Hide details' : 'Zwiń szczegóły') : (isEn ? 'Show details' : 'Pokaż szczegóły')}</span>
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
                            <span>{isEn ? '🪴 Pot & Drainage' : '🪴 Donica i drenaż'}</span>
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
                            <span>{isEn ? '🌱 Schedule & Growth Phases' : '🌱 Harmonogram i fazy rozwoju'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCropDetailTab('photos')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                              activeCropDetailTab === 'photos'
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>{isEn ? 'Photo Journal & Timelapse' : 'Dziennik zdjęć & Timelapse'} ({selectedCrop.photos?.length || 0})</span>
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
                            <span>{isEn ? '🏡 Greenhouse & Microclimate' : '🏡 Szklarnia i mikroklimat'}</span>
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
                            <span>{isEn ? '📝 Journal & Notes' : '📝 Dziennik i notatki'}</span>
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
                                    {isEn ? 'Pot Volume' : 'Pojemność donicy'}
                                  </span>
                                  <span className="text-lg">🪴</span>
                                </div>
                                <div>
                                  <div className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                                    {selectedCrop.pot?.volumeL || selectedPlant.pot?.min_volume_l || 10} {isEn ? 'liters' : 'litrów'}
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                    {isEn ? 'Recommended minimum for this variety:' : 'Zalecane minimum dla tej odmiany:'} {selectedPlant.pot?.min_volume_l || 5}L
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
                                    <span>{isEn ? 'Customize pot dimensions' : 'Dostosuj wymiary donicy'}</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              {/* Karta 2: Obecność drenażu */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                    {isEn ? 'Drainage Layer' : 'Warstwa drenażowa'}
                                  </span>
                                  <span className="text-lg">💧</span>
                                </div>
                                <div>
                                  <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                    {selectedCrop.pot?.hasDrainage !== false ? (
                                      <span className="text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                                        <CheckCircle2 className="w-4 h-4" /> {isEn ? 'Drainage present' : 'Drenaż obecny'}
                                      </span>
                                    ) : (
                                      <span className="text-amber-800 dark:text-amber-400 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" /> {isEn ? 'No drainage layer' : 'Brak warstwy drenażu'}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                                    {isEn ? '3–5 cm clay pebble layer prevents root rot after heavy rainfall.' : 'Warstwa 3–5 cm keramzytu na dnie zabezpiecza korzenie przed gniciem po ulewnych deszczach.'}
                                  </p>
                                </div>
                                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                                  {isEn ? 'Drainage holes: Required in bottom' : 'Otwory odpływowe: Wymagane w dnie'}
                                </div>
                              </div>

                              {/* Karta 3: Podłoże i rozstawa */}
                              <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                    {isEn ? 'Soil & Spacing' : 'Podłoże & rozstawa'}
                                  </span>
                                  <span className="text-lg">📏</span>
                                </div>
                                <div>
                                  <div className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                                    {isEn ? 'Spacing:' : 'Rozstawa:'} {selectedPlant.spacing_guide?.spacing_cm || 25} cm
                                  </div>
                                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                    {isEn ? 'Min depth:' : 'Głębokość min.:'} {selectedCrop.pot?.depthCm || selectedPlant.pot?.min_depth_cm || 20} cm • pH: 6.0–6.8
                                  </p>
                                </div>
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => onOpenPotCalc(selectedPlant)}
                                    className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>{isEn ? 'Open pot calculator' : 'Otwórz kalkulator donic'}</span>
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
                                      {timelineInfo?.currentPhase.name || (isEn ? 'Growth' : 'Wzrost')} ({isEn ? 'Day' : 'Dzień'} {timelineInfo?.daysSinceSowing || 1})
                                    </h4>
                                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                      {isEn ? 'Phase description & expected progress' : 'Opis etapu i spodziewany rozwój'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                                  {timelineInfo?.currentPhase.whatToExpect ||
                                    (isEn ? 'Plant is actively developing root system and true leaves.' : 'Roślina dynamicznie rozwija system korzeniowy oraz pierwsze liście właściwe.')}
                                </p>
                                <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 pt-1">
                                  {isEn ? 'Key task:' : 'Kluczowe zadanie:'} {timelineInfo?.currentPhase.keyCareAction || (isEn ? 'Ensure optimal sunlight.' : 'Zapewnij optymalne nasłonecznienie.')}
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
                                      {isEn ? 'Watering & Misting' : 'Nawadnianie & zraszanie'}
                                    </h4>
                                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                                      {isEn ? 'Recommendations for current phase' : 'Zalecenia dla bieżącej fazy'}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                                  {timelineInfo?.currentPhase.wateringTip ||
                                    (isEn ? 'Keep soil consistently moist, but not soggy.' : 'Utrzymuj podłoże stale lekko wilgotne, ale nie mokre.')}
                                </p>
                                <div className="text-xs text-stone-500 dark:text-stone-400 pt-1">
                                  💡 <strong>{isEn ? 'Tip:' : 'Wskazówka:'}</strong>{' '}
                                  {timelineInfo?.currentPhase.shortName === 'Kiełkowanie'
                                    ? (isEn ? 'Use fine mist sprayer only to avoid washing away seeds or damaging young roots.' : 'Używaj wyłącznie delikatnej mgiełki ze zraszacza, by nie wypłukać nasion ani nie uszkodzić drobnych korzonków.')
                                    : (isEn ? 'Water in morning at base of stem, avoid wetting foliage under direct sun.' : 'Podlewaj rano u nasady łodygi, unikając moczenia liści w pełnym słońcu.')}
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
                                onUpdateCrop={onUpdateCrop}
                                onOpenAddPhoto={(phaseId) =>
                                  setAddPhotoCropPlant({
                                    plant: selectedPlant,
                                    crop: selectedCrop,
                                    phaseId,
                                  })
                                }
                                onOpenTimelapse={(initialIndex) =>
                                  setTimelapseCropPlant({
                                    plant: selectedPlant,
                                    crop: selectedCrop,
                                    initialIndex,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}

                        {/* TAB: DZIENNIK ZDJĘĆ & ANIMACJA POKLATKOWA (TIMELAPSE) */}
                        {activeCropDetailTab === 'photos' && (
                          <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-5 shadow-sm">
                            {/* Header Banner */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-stone-700/60">
                              <div>
                                <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                  <span>{isEn ? '📸 Growth Journal & Timelapse Animation' : '📸 Dziennik wzrostu & Animacja poklatkowa (Timelapse)'}</span>
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 max-w-2xl leading-relaxed">
                                  {isEn
                                    ? 'Take 1 photo every 1–2 weeks. The app automatically maps them to phenological growth stages and generates a commemorative timelapse showing full transformation from seed to harvest.'
                                    : 'Rób 1 zdjęcie co 1–2 tygodnie. Aplikacja automatycznie dopasuje je do etapów rozwoju fenologicznego i wygeneruje pamiątkową animację poklatkową, ukazując pełną przemianę od nasionka po zbiory.'}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                                {selectedCrop.photos && selectedCrop.photos.length >= 2 ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setTimelapseCropPlant({
                                        plant: selectedPlant,
                                        crop: selectedCrop,
                                      })
                                    }
                                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-xs"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>{isEn ? `Play timelapse (${selectedCrop.photos.length} frames)` : `Odtwórz timelapse (${selectedCrop.photos.length} klatek)`}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated: MyCropItem = {
                                        ...selectedCrop,
                                        photos: SAMPLE_TOMATO_TIMELAPSE,
                                      };
                                      onUpdateCrop(updated);
                                      setTimelapseCropPlant({
                                        plant: selectedPlant,
                                        crop: updated,
                                      });
                                    }}
                                    className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                                    title={isEn ? 'Load 6 sample tomato growth stages to instantly test animation' : 'Załaduj 6 przykładowych zdjęć etapów wzrostu pomidora, by natychmiast przetestować animację'}
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    <span>{isEn ? 'Load demo timelapse (Tomato)' : 'Załaduj demo timelapse (Pomidor)'}</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() =>
                                    setAddPhotoCropPlant({
                                      plant: selectedPlant,
                                      crop: selectedCrop,
                                    })
                                  }
                                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <span>{isEn ? '+ Add photo' : '+ Dodaj zdjęcie'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Cadence Status Bar */}
                            {(() => {
                              const cadence = getPhotoCadenceInfo(selectedCrop, selectedPlant);
                              return (
                                <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                                      🗓️
                                    </div>
                                    <div>
                                      <span className="font-bold text-stone-900 dark:text-stone-100 block">
                                        {isEn ? 'Recommended cadence: 1 photo every 1–2 weeks' : 'Rekomendowany rytm: 1 zdjęcie na 1–2 tygodnie'}
                                      </span>
                                      <span className="text-stone-500 dark:text-stone-400">
                                        {cadence.cadenceMessage}
                                      </span>
                                    </div>
                                  </div>

                                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] self-start sm:self-auto shrink-0">
                                    {cadence.badgeLabel}
                                  </span>
                                </div>
                              );
                            })()}

                            {/* Photos Grid or Empty State */}
                            {!selectedCrop.photos || selectedCrop.photos.length === 0 ? (
                              <div className="p-8 sm:p-12 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-2xl bg-stone-50/50 dark:bg-stone-900/20 text-center space-y-4 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-3xl">
                                  🌱
                                </div>
                                <div className="max-w-md space-y-1">
                                  <h5 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                                    {isEn ? 'Your growth album is still empty' : 'Twój album wzrostu jest jeszcze pusty'}
                                  </h5>
                                  <p className="text-xs text-stone-500 dark:text-stone-400">
                                    {isEn
                                      ? 'Add your first photo of the seedling or sprout. Each subsequent photo spaced 7–14 days apart will create a unique keepsake from your entire balcony season!'
                                      : 'Dodaj pierwsze zdjęcie siewki lub sadzonki. Każde kolejne zdjęcie w odstępach 7–14 dni stworzy niepowtarzalną pamiątkę z całego sezonu balkonowego!'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap justify-center pt-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setAddPhotoCropPlant({
                                        plant: selectedPlant,
                                        crop: selectedCrop,
                                      })
                                    }
                                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <Camera className="w-4 h-4" />
                                    <span>{isEn ? 'Take / Add 1st photo' : 'Zrób / Dodaj 1. zdjęcie'}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated: MyCropItem = {
                                        ...selectedCrop,
                                        photos: SAMPLE_TOMATO_TIMELAPSE,
                                      };
                                      onUpdateCrop(updated);
                                      setTimelapseCropPlant({
                                        plant: selectedPlant,
                                        crop: updated,
                                      });
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-stone-100"
                                  >
                                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                    <span>{isEn ? 'Test with 6 demo frames' : 'Przetestuj z 6 klatkami demo'}</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...selectedCrop.photos]
                                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                  .map((photo, idx) => (
                                    <div
                                      key={photo.id}
                                      className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                                    >
                                      {/* Image Box */}
                                      <div
                                        onClick={() =>
                                          setTimelapseCropPlant({
                                            plant: selectedPlant,
                                            crop: selectedCrop,
                                            initialIndex: idx,
                                          })
                                        }
                                        className="relative aspect-[4/3] bg-black overflow-hidden cursor-pointer flex items-center justify-center"
                                        title={isEn ? 'Click to play animation from this frame' : 'Kliknij, aby odtworzyć animację od tej klatki'}
                                      >
                                        <img
                                          src={photo.imageUrl}
                                          alt={photo.caption || `${isEn ? 'Frame' : 'Kadr'} ${idx + 1}`}
                                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                          referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                          <div className="px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5">
                                            <Play className="w-3.5 h-3.5 fill-current" />
                                            <span>{isEn ? 'Play in timelapse' : 'Odtwórz w timelapse'}</span>
                                          </div>
                                        </div>

                                        {/* Frame badge */}
                                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold">
                                          {isEn ? 'Frame' : 'Kadr'} {idx + 1}
                                        </span>

                                        {/* Week badge */}
                                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-xs border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                                          {isEn ? 'Week' : 'Tydzień'} {photo.weekNumber}
                                        </span>
                                      </div>

                                      {/* Info Box */}
                                      <div className="p-3 flex-1 flex flex-col justify-between space-y-2 text-xs">
                                        <div>
                                          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
                                            <span className="font-semibold">{photo.date}</span>
                                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                                              {isEn ? 'Day' : 'Dzień'} {photo.dayNumber}
                                            </span>
                                          </div>

                                          {photo.phaseName && (
                                            <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                                              {photo.phaseName}
                                            </div>
                                          )}

                                          {photo.caption && (
                                            <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2 mt-1 italic">
                                              &ldquo;{photo.caption}&rdquo;
                                            </p>
                                          )}
                                        </div>

                                        <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setTimelapseCropPlant({
                                                plant: selectedPlant,
                                                crop: selectedCrop,
                                                initialIndex: idx,
                                              })
                                            }
                                            className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                                          >
                                            <Play className="w-3 h-3 fill-current" />
                                            <span>{isEn ? 'Show' : 'Pokaż'}</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (!window.confirm(isEn ? 'Are you sure you want to delete this photo?' : 'Czy na pewno chcesz usunąć to zdjęcie?')) return;
                                              const remaining = (selectedCrop.photos || []).filter((p) => p.id !== photo.id);
                                              onUpdateCrop({
                                                ...selectedCrop,
                                                photos: remaining,
                                              });
                                            }}
                                            className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer"
                                            title={isEn ? 'Delete photo' : 'Usuń zdjęcie'}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* TAB 3: SZKLARNIA I MIKROKLIMAT */}
                        {activeCropDetailTab === 'greenhouse' && (
                          <div className="p-5 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-200/70 dark:border-stone-800 space-y-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-stone-700/60">
                              <div>
                                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                                  <span>{isEn ? '🏡 Greenhouse Conditions & Microclimate' : '🏡 Warunki szklarniowe i mikroklimat'}</span>
                                  <span className="text-xs font-normal text-stone-500">
                                    ({selectedCrop.inGreenhouse ? (isEn ? 'In balcony greenhouse' : 'W szklarence balkonowej') : (isEn ? 'Open balcony' : 'Otwarty balkon')})
                                  </span>
                                </h4>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                                  {isEn
                                    ? 'A greenhouse provides a thermal buffer of +3°C to +8°C, but requires regular ventilation.'
                                    : 'Szklarnia zapewnia bufor cieplny +3°C do +8°C, ale wymaga regularnego wietrzenia.'}
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
                                    ? (isEn ? '✓ In greenhouse (Click to change)' : '✓ W szklarni (Kliknij by zmienić)')
                                    : (isEn ? 'Move to greenhouse' : 'Przenieś do szklarni')}
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
                                  {isEn ? '💨 Air Circulation' : '💨 Cyrkulacja powietrza'}
                                </span>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                  {isEn
                                    ? 'On sunny days, open zipper vents or windows to prevent temperatures exceeding 32°C.'
                                    : 'W słoneczne dni uchylaj suwak lub okienko szklarni, aby temperatura nie przekroczyła 32°C.'}
                                </p>
                              </div>
                              <div className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-700">
                                <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                                  {isEn ? '🐝 Flower Pollination' : '🐝 Zapylanie kwiatów'}
                                </span>
                                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                                  {isEn
                                    ? 'During flowering, gently shake stems once daily or allow access for pollinating insects.'
                                    : 'W fazie kwitnienia lekko potrząsaj pędami raz dziennie lub zapewnij dostęp owadom zapylającym.'}
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
                                {isEn ? 'Grower Journal & Notes' : 'Dziennik hodowcy & notatki'}
                              </h4>
                              <button
                                type="button"
                                onClick={() => startEdit(selectedCrop, selectedCropKey)}
                                className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{isEn ? 'Edit note' : 'Edytuj notatkę'}</span>
                              </button>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-700 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
                              {selectedCrop.notes ? (
                                <p className="whitespace-pre-wrap">{selectedCrop.notes}</p>
                              ) : (
                                <p className="text-stone-400 italic">
                                  {isEn
                                    ? 'No notes yet. Click "Edit note" to record germination date, fertilizer type, or plant observations.'
                                    : 'Brak wpisanych notatek. Kliknij "Edytuj notatkę", aby zapisać datę kiełkowania, rodzaj zastosowanego nawozu lub uwagi o roślinie.'}
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

      {/* Modal for Plant Rescue Flow (Tryb Ratunkowy / Pogotowie Roślinne) */}
      {rescueCropPlant && (
        <RescueFlowModal
          isOpen={true}
          crop={rescueCropPlant.crop}
          plant={rescueCropPlant.plant}
          onClose={() => setRescueCropPlant(null)}
          onActivatePlan={(plan) => {
            const updatedCrop: MyCropItem = {
              ...rescueCropPlant.crop,
              rescuePlan: plan,
            };
            onUpdateCrop(updatedCrop);
            setRescueCropPlant(null);
          }}
          onDismissPlan={() => {
            const updatedCrop: MyCropItem = {
              ...rescueCropPlant.crop,
              rescuePlan: undefined,
            };
            onUpdateCrop(updatedCrop);
            setRescueCropPlant(null);
          }}
          onUpdateCrop={(updated) => {
            onUpdateCrop(updated);
            setRescueCropPlant({
              ...rescueCropPlant,
              crop: updated,
            });
          }}
        />
      )}

      {/* Modal for Timelapse playback */}
      {timelapseCropPlant && (
        <TimelapseModal
          isOpen={true}
          onClose={() => setTimelapseCropPlant(null)}
          crop={timelapseCropPlant.crop}
          plant={timelapseCropPlant.plant}
          initialFrameIndex={timelapseCropPlant.initialIndex}
          onOpenAddPhoto={() => {
            const { crop, plant } = timelapseCropPlant;
            setTimelapseCropPlant(null);
            setAddPhotoCropPlant({ crop, plant });
          }}
          onUpdateCrop={(updatedCrop) => {
            onUpdateCrop(updatedCrop);
            setTimelapseCropPlant({
              ...timelapseCropPlant,
              crop: updatedCrop,
            });
          }}
        />
      )}

      {/* Modal for adding a photo to the crop progress journal */}
      {addPhotoCropPlant && (
        <AddCropPhotoModal
          isOpen={true}
          onClose={() => setAddPhotoCropPlant(null)}
          crop={addPhotoCropPlant.crop}
          plant={addPhotoCropPlant.plant}
          defaultPhaseId={addPhotoCropPlant.phaseId}
          onSavePhoto={(newPhoto) => {
            const current = addPhotoCropPlant.crop.photos || [];
            const updatedCrop: MyCropItem = {
              ...addPhotoCropPlant.crop,
              photos: [...current, newPhoto],
            };
            onUpdateCrop(updatedCrop);
            setAddPhotoCropPlant(null);
          }}
        />
      )}
    </div>
  );
};
