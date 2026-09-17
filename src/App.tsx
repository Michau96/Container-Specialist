import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Info,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { UserBalconySpec, Plant, WeatherData, PlantGroup, MyCropItem } from './types';
import {
  loadSavedSpec,
  saveUserSpec,
  hasUserOnboarded,
  fetchRecommendations,
  fetchWeather,
  loadSavedMyCrops,
  saveMyCrops,
  POLAND_REGIONS,
} from './lib/api';
import { Header, ActiveNavTab } from './components/Header';
import { WeatherWidget } from './components/WeatherWidget';
import { PlantCard } from './components/PlantCard';
import { PlantDetailModal } from './components/PlantDetailModal';
import { CalendarView } from './components/CalendarView';
import { BalconySetupModal } from './components/BalconySetupModal';
import { PotCalculator } from './components/PotCalculator';
import { MyCropsView } from './components/MyCropsView';
import { computeDailyRecommendation } from './lib/dailyRecommendations';

export default function App() {
  const [userSpec, setUserSpec] = useState<UserBalconySpec>(() => loadSavedSpec());
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(() => !hasUserOnboarded());
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('my_crops');

  // My Crops persistent state
  const [myCrops, setMyCrops] = useState<MyCropItem[]>(() => loadSavedMyCrops());

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState<boolean>(true);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedPotPlant, setSelectedPotPlant] = useState<Plant | null>(null);

  // Filters for recommendations
  const [selectedGroup, setSelectedGroup] = useState<PlantGroup>('wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [sortOrder, setSortOrder] = useState<'score' | 'difficulty' | 'name'>('score');

  // Load recommendations & weather when userSpec changes
  useEffect(() => {
    let isMounted = true;
    setLoadingPlants(true);

    fetchRecommendations(userSpec)
      .then((data) => {
        if (isMounted) {
          setPlants(data);
          setLoadingPlants(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch recommendations:', err);
        if (isMounted) setLoadingPlants(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userSpec]);

  // Load weather
  const loadWeather = () => {
    setWeatherLoading(true);
    fetchWeather(userSpec)
      .then((w) => {
        setWeather(w);
        setWeatherLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch weather:', err);
        setWeatherLoading(false);
      });
  };

  useEffect(() => {
    loadWeather();
  }, [userSpec.region, userSpec.floor, userSpec.orientation]);

  // Handle saving new balcony spec
  const handleSaveSpec = (newSpec: UserBalconySpec) => {
    setUserSpec(newSpec);
    saveUserSpec(newSpec);
    setIsSetupModalOpen(false);
  };

  // Find plant by id (used by calendar view to open modal)
  const handleSelectPlantById = (plantId: string) => {
    const found = plants.find((p) => p.id === plantId);
    if (found) {
      setSelectedPlant(found);
    }
  };

  // Open pot calculator with specific plant
  const handleOpenPotCalcForPlant = (plant: Plant) => {
    setSelectedPotPlant(plant);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // My Crops operations
  const handleToggleMyCrop = (plantId: string) => {
    setMyCrops((prev) => {
      const exists = prev.some((c) => c.plantId === plantId);
      let next: MyCropItem[];
      if (exists) {
        next = prev.filter((c) => c.plantId !== plantId);
      } else {
        next = [
          ...prev,
          {
            plantId,
            addedAt: new Date().toISOString(),
            stage: 'rosnie' as const,
          },
        ];
      }
      saveMyCrops(next);
      return next;
    });
  };

  const handleAddCrop = (plantId: string) => {
    setMyCrops((prev) => {
      if (prev.some((c) => c.plantId === plantId)) return prev;
      const next: MyCropItem[] = [
        ...prev,
        {
          plantId,
          addedAt: new Date().toISOString(),
          stage: 'rosnie' as const,
        },
      ];
      saveMyCrops(next);
      return next;
    });
  };

  const handleRemoveCrop = (plantId: string) => {
    setMyCrops((prev) => {
      const next = prev.filter((c) => c.plantId !== plantId);
      saveMyCrops(next);
      return next;
    });
  };

  const handleUpdateCrop = (updated: MyCropItem) => {
    setMyCrops((prev) => {
      const next = prev.map((c) => (c.plantId === updated.plantId ? updated : c));
      saveMyCrops(next);
      return next;
    });
  };

  const myCropIds = useMemo(() => myCrops.map((c) => c.plantId), [myCrops]);

  const myPlants = useMemo(() => {
    return plants.filter((p) => myCropIds.includes(p.id));
  }, [plants, myCropIds]);

  const dailyRecommendation = useMemo(() => {
    return computeDailyRecommendation(weather, userSpec, myPlants, myCrops);
  }, [weather, userSpec, myPlants, myCrops]);

  // Switch plant group (Wszystkie / Warzywa / Owoce / Zioła / Ozdobne)
  const handleGroupChange = (group: PlantGroup) => {
    setSelectedGroup(group);
    setSelectedCategory('Wszystkie');
  };

  // Group-filtered plants
  const groupFilteredPlants = useMemo(() => {
    if (selectedGroup === 'wszystkie') return plants;
    return plants.filter((p) => p.plant_group === selectedGroup);
  }, [plants, selectedGroup]);

  // Counts for each group
  const groupCounts = useMemo(() => {
    return {
      wszystkie: plants.length,
      warzywa: plants.filter((p) => p.plant_group === 'warzywa').length,
      owoce: plants.filter((p) => p.plant_group === 'owoce').length,
      ziola: plants.filter((p) => p.plant_group === 'ziola').length,
      ozdobne: plants.filter((p) => p.plant_group === 'ozdobne').length,
      kielki: plants.filter((p) => p.plant_group === 'kielki').length,
      grzyby: plants.filter((p) => p.plant_group === 'grzyby').length,
    };
  }, [plants]);

  // Categories list for the currently active group
  const categories = useMemo(() => {
    const set = new Set<string>();
    groupFilteredPlants.forEach((p) => set.add(p.category));
    return ['Wszystkie', ...Array.from(set)];
  }, [groupFilteredPlants]);

  // Filtered & Sorted recommendations
  const filteredPlants = useMemo(() => {
    return groupFilteredPlants
      .filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.varieties.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase())) ||
          p.summary.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategory === 'Wszystkie' || p.category === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortOrder === 'score') {
          return (b.suitability?.score ?? 0) - (a.suitability?.score ?? 0);
        }
        if (sortOrder === 'difficulty') {
          return a.difficulty - b.difficulty;
        }
        return a.name.localeCompare(b.name);
      });
  }, [groupFilteredPlants, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userSpec={userSpec}
        onOpenSetup={() => setIsSetupModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        myCropsCount={myCrops.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Weather & Soil Watering Status Bar */}
        <WeatherWidget
          weather={weather}
          loading={weatherLoading}
          userSpec={userSpec}
          onRefresh={loadWeather}
        />

        {/* Tab 1: Moje uprawy & Indywidualny kalendarz & Dzienna rekomendacja */}
        {activeTab === 'my_crops' && (
          <MyCropsView
            myCrops={myCrops}
            allPlants={plants}
            weather={weather}
            userSpec={userSpec}
            dailyRecommendation={dailyRecommendation}
            onRemoveCrop={handleRemoveCrop}
            onUpdateCrop={handleUpdateCrop}
            onAddCrop={handleAddCrop}
            onSelectPlant={setSelectedPlant}
            onOpenPotCalc={handleOpenPotCalcForPlant}
            onNavigateToSearch={() => setActiveTab('search_crops')}
            onSwitchToFullCalendar={() => setActiveTab('calendar')}
          />
        )}

        {/* Tab 2: Szukaj nowych upraw (pełna baza wiedzy) */}
        {activeTab === 'search_crops' && (
          <div className="space-y-6">
            {/* Navigation Quick Bar */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Katalog: Szukaj nowych upraw do donic
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Kliknij przycisk „+ Dodaj do Moich upraw” przy dowolnej roślinie, aby przenieść ją do osobistego terminarza.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('my_crops')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sprout className="w-4 h-4" />
                  <span>Przejdź do Moich upraw ({myCrops.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Pełny kalendarz</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                </button>
              </div>
            </div>

            {/* Banner & Filter Bar */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Dopasowane do Twojego balkonu</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                    {selectedGroup === 'wszystkie' && 'Wszystkie rekomendacje do uprawy w donicach'}
                    {selectedGroup === 'warzywa' && 'Warzywa w donicach na balkonie'}
                    {selectedGroup === 'owoce' && 'Owoce w donicach na balkonie'}
                    {selectedGroup === 'ziola' && 'Świeże zioła w donicach na balkonie'}
                    {selectedGroup === 'ozdobne' && 'Rośliny ozdobne i kwiaty w donicach na balkonie'}
                    {selectedGroup === 'kielki' && 'Mikrolistki i kiełki w pojemnikach'}
                    {selectedGroup === 'grzyby' && 'Grzyby uprawne w pojemnikach'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                    Każda uprawa została przeliczona pod kątem Twojej ekspozycji (
                    <strong className="text-stone-800 dark:text-stone-200">{userSpec.orientation}</strong>), piętra (
                    <strong className="text-stone-800 dark:text-stone-200">{userSpec.floor}. piętro</strong>),
                    wielkości donic oraz strefy mrozowej regionu{' '}
                    <strong className="text-stone-800 dark:text-stone-200">
                      {POLAND_REGIONS[userSpec.region]?.name.split('(')[0]}
                    </strong>.
                  </p>
                </div>

                {/* Quick stats badge: green reserved for confirmed high compliance */}
                <div className="flex items-center gap-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-3 rounded-2xl shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {groupFilteredPlants.filter((p) => (p.suitability?.score ?? 0) >= 80).length}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-emerald-950 dark:text-emerald-200">Potwierdzone jako optymalne</div>
                    <div className="text-stone-500 dark:text-stone-400 text-[11px]">&gt;80% dopasowania do Twoich warunków</div>
                  </div>
                </div>
              </div>

              {/* Jasny podział na grupy roślin - bez zielonego/czerwonego w grupach */}
              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800">
                <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5">
                  Wybierz grupę roślin:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
                  {/* Wszystkie */}
                  <button
                    id="group-filter-wszystkie"
                    onClick={() => handleGroupChange('wszystkie')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'wszystkie'
                        ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🪴</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'wszystkie'
                            ? 'bg-stone-800 dark:bg-stone-200 text-stone-200 dark:text-stone-800'
                            : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600'
                        }`}
                      >
                        {groupCounts.wszystkie}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Wszystkie</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'wszystkie'
                            ? 'text-stone-300 dark:text-stone-600'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Pełna baza donicowa
                      </div>
                    </div>
                  </button>

                  {/* Warzywa - Indigo theme */}
                  <button
                    id="group-filter-warzywa"
                    onClick={() => handleGroupChange('warzywa')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'warzywa'
                        ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/30'
                        : 'bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 border-indigo-200/80 dark:border-indigo-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🥕</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'warzywa'
                            ? 'bg-indigo-950 text-indigo-100'
                            : 'bg-white dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700'
                        }`}
                      >
                        {groupCounts.warzywa}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Warzywa</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'warzywa' ? 'text-indigo-200' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Pomidory, papryki, sałaty...
                      </div>
                    </div>
                  </button>

                  {/* Owoce - Fuchsia theme */}
                  <button
                    id="group-filter-owoce"
                    onClick={() => handleGroupChange('owoce')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'owoce'
                        ? 'bg-fuchsia-900 text-white border-fuchsia-900 shadow-sm ring-2 ring-fuchsia-500/30'
                        : 'bg-fuchsia-50/50 dark:bg-fuchsia-950/30 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/50 text-fuchsia-950 dark:text-fuchsia-200 border-fuchsia-200/80 dark:border-fuchsia-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🍓</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'owoce'
                            ? 'bg-fuchsia-950 text-fuchsia-100'
                            : 'bg-white dark:bg-fuchsia-900/60 text-fuchsia-900 dark:text-fuchsia-200 border border-fuchsia-200 dark:border-fuchsia-700'
                        }`}
                      >
                        {groupCounts.owoce}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Owoce</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'owoce' ? 'text-fuchsia-200' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Truskawki, borówki, maliny...
                      </div>
                    </div>
                  </button>

                  {/* Zioła - Teal theme */}
                  <button
                    id="group-filter-ziola"
                    onClick={() => handleGroupChange('ziola')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'ziola'
                        ? 'bg-teal-900 text-white border-teal-900 shadow-sm ring-2 ring-teal-500/30'
                        : 'bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-teal-950 dark:text-teal-200 border-teal-200/80 dark:border-teal-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌿</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'ziola'
                            ? 'bg-teal-950 text-teal-100'
                            : 'bg-white dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-700'
                        }`}
                      >
                        {groupCounts.ziola}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Zioła</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'ziola' ? 'text-teal-200' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Bazylia, mięta, tymianek...
                      </div>
                    </div>
                  </button>

                  {/* Ozdobne - Violet theme */}
                  <button
                    id="group-filter-ozdobne"
                    onClick={() => handleGroupChange('ozdobne')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'ozdobne'
                        ? 'bg-violet-900 text-white border-violet-900 shadow-sm ring-2 ring-violet-500/30'
                        : 'bg-violet-50/50 dark:bg-violet-950/30 hover:bg-violet-50 dark:hover:bg-violet-950/50 text-violet-950 dark:text-violet-200 border-violet-200/80 dark:border-violet-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌸</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'ozdobne'
                            ? 'bg-violet-950 text-violet-100'
                            : 'bg-white dark:bg-violet-900/60 text-violet-900 dark:text-violet-200 border border-violet-200 dark:border-violet-700'
                        }`}
                      >
                        {groupCounts.ozdobne}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Ozdobne</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'ozdobne' ? 'text-violet-200' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Pelargonie, lawenda, bratki...
                      </div>
                    </div>
                  </button>

                  {/* Kiełki - Sky theme */}
                  <button
                    id="group-filter-kielki"
                    onClick={() => handleGroupChange('kielki')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'kielki'
                        ? 'bg-sky-900 text-white border-sky-900 shadow-sm ring-2 ring-sky-500/30'
                        : 'bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-200/80 dark:border-sky-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌱</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'kielki'
                            ? 'bg-sky-950 text-sky-100'
                            : 'bg-white dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700'
                        }`}
                      >
                        {groupCounts.kielki}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Mikrolistki i kiełki</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'kielki' ? 'text-sky-200' : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Rzeżucha, rzodkiewka, słonecznik...
                      </div>
                    </div>
                  </button>

                  {/* Grzyby - Stone/Amber theme */}
                  <button
                    id="group-filter-grzyby"
                    onClick={() => handleGroupChange('grzyby')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'grzyby'
                        ? 'bg-stone-800 text-white border-stone-800 dark:bg-stone-200 dark:text-stone-900 dark:border-stone-200 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🍄</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'grzyby'
                            ? 'bg-stone-900 dark:bg-stone-300 text-stone-100 dark:text-stone-900'
                            : 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600'
                        }`}
                      >
                        {groupCounts.grzyby}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Grzyby uprawne</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'grzyby'
                            ? 'text-stone-300 dark:text-stone-600'
                            : 'text-stone-500 dark:text-stone-400'
                        }`}
                      >
                        Boczniaki, pieczarki, soplówka...
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="search-vegetables-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      selectedGroup === 'owoce'
                        ? 'Szukaj owocu (np. truskawka, borówka, poziomka)...'
                        : selectedGroup === 'ziola'
                        ? 'Szukaj zioła (np. bazylia, mięta, rozmaryn)...'
                        : selectedGroup === 'ozdobne'
                        ? 'Szukaj rośliny ozdobnej (np. pelargonia, surfinia, lawenda)...'
                        : 'Szukaj rośliny lub odmiany (np. pomidor, Vilma, rzodkiewka)...'
                    }
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">Sortuj:</span>
                  <select
                    id="sort-plants-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="text-xs p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-500"
                  >
                    <option value="score">Najlepsze dopasowanie (%)</option>
                    <option value="difficulty">Najłatwiejsze w donicy (1-10)</option>
                    <option value="name">Alfabetycznie (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Categories Pills */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    id={`category-filter-${cat}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition text-xs cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Plants Grid */}
            {loadingPlants ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-stone-700 dark:border-stone-300 border-t-transparent rounded-full mb-2" />
                <p className="text-xs text-stone-500 dark:text-stone-400">Przeliczanie bazy wiedzy o donicach...</p>
              </div>
            ) : filteredPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onSelect={setSelectedPlant}
                    onOpenPotCalc={handleOpenPotCalcForPlant}
                    isMyCrop={myCropIds.includes(plant.id)}
                    onToggleMyCrop={handleToggleMyCrop}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6">
                <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
                  {searchQuery ? 'Brak wyników wyszukiwania' : 'Brak pozycji w tej kategorii'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                  {searchQuery
                    ? `Żadna roślina nie spełnia kryteriów wyszukiwania "${searchQuery}". Spróbuj zresetować filtry.`
                    : 'Brak roślin w wybranej podkategorii. Zmień filtry lub wybierz inną grupę.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Wszystkie');
                    setSelectedGroup('wszystkie');
                  }}
                  className="mt-4 px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition cursor-pointer"
                >
                  Pokaż wszystkie rośliny ({plants.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Kalkulator wymiarów donic i szkicownik rozstawy */}
        {activeTab === 'calculator' && (
          <PotCalculator
            plants={plants}
            initialPlant={selectedPotPlant || plants[0]}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
          />
        )}

        {/* Tab 4: Kalendarz siewu, rozsady i zbiorów (z 2 trybami) */}
        {activeTab === 'calendar' && (
          <CalendarView
            userSpec={userSpec}
            onSelectPlantById={handleSelectPlantById}
            initialMode={myCrops.length > 0 ? 'my_crops' : 'all'}
            myCropIds={myCropIds}
            onNavigateToSearch={() => setActiveTab('search_crops')}
          />
        )}
      </main>

      {/* Detail Modal for Selected Plant */}
      <PlantDetailModal
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onOpenPotCalc={handleOpenPotCalcForPlant}
        isMyCrop={selectedPlant ? myCropIds.includes(selectedPlant.id) : false}
        onToggleMyCrop={handleToggleMyCrop}
      />

      {/* Balcony Setup & Onboarding Modal */}
      <BalconySetupModal
        isOpen={isSetupModalOpen}
        initialSpec={userSpec}
        onSave={handleSaveSpec}
        onClose={() => setIsSetupModalOpen(false)}
        isFirstTime={!hasUserOnboarded()}
      />

      {/* Minimal Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-6 mt-12 text-center text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Donicowy Specjalista</strong> • Poradnik uprawy warzyw, owoców, ziół i roślin ozdobnych w donicach
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500">
            Darmowe dane pogodowe: Open-Meteo API • Strefy klimatyczne Polski: IMGW / Działkowiec
          </div>
        </div>
      </footer>
    </div>
  );
}
