import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Sprout,
  Calendar as CalendarIcon,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Ruler,
} from 'lucide-react';
import { UserBalconySpec, Plant, WeatherData, PlantGroup } from './types';
import {
  loadSavedSpec,
  saveUserSpec,
  hasUserOnboarded,
  fetchRecommendations,
  fetchWeather,
  POLAND_REGIONS,
} from './lib/api';
import { Header } from './components/Header';
import { WeatherWidget } from './components/WeatherWidget';
import { PlantCard } from './components/PlantCard';
import { PlantDetailModal } from './components/PlantDetailModal';
import { CalendarView } from './components/CalendarView';
import { ContainerKnowledgeGuide } from './components/ContainerKnowledgeGuide';
import { BalconySetupModal } from './components/BalconySetupModal';
import { PotCalculator } from './components/PotCalculator';

export default function App() {
  const [userSpec, setUserSpec] = useState<UserBalconySpec>(() => loadSavedSpec());
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(() => !hasUserOnboarded());
  const [activeTab, setActiveTab] = useState<'recommendations' | 'calculator' | 'calendar' | 'knowledge'>('recommendations');

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
    <div className="min-h-screen bg-[#FBF9F4] text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userSpec={userSpec}
        onOpenSetup={() => setIsSetupModalOpen(true)}
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

        {/* Tab 1: Rekomendacje dla Twojego Balkonu */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* Banner & Filter Bar */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Dopasowane do Twojego balkonu</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                    {selectedGroup === 'wszystkie' && 'Rekomendacje do Uprawy w Donicach na Balkonie'}
                    {selectedGroup === 'warzywa' && 'Warzywa w Donicach na Balkonie'}
                    {selectedGroup === 'owoce' && 'Owoce w Donicach na Balkonie'}
                    {selectedGroup === 'ziola' && 'Świeże Zioła w Donicach na Balkonie'}
                    {selectedGroup === 'ozdobne' && 'Rośliny Ozdobne i Kwiaty w Donicach na Balkonie'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
                    Każda uprawa została przeliczona pod kątem Twojej ekspozycji (
                    <strong>{userSpec.orientation}</strong>), piętra (<strong>{userSpec.floor}. piętro</strong>),
                    wielkości donic oraz strefy mrozowej regionu <strong>{POLAND_REGIONS[userSpec.region]?.name.split('(')[0]}</strong>.
                  </p>
                </div>

                {/* Quick stats badge */}
                <div className="flex items-center gap-3 bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-2xl shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm">
                    {groupFilteredPlants.filter((p) => (p.suitability?.score ?? 0) >= 80).length}
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-emerald-950">Idealne odmiany</div>
                    <div className="text-stone-500 text-[11px]">&gt;80% dopasowania do Twoich warunków</div>
                  </div>
                </div>
              </div>

              {/* Jasny podział na warzywa, owoce, zioła i rośliny ozdobne */}
              <div className="mt-5 pt-4 border-t border-stone-100">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">
                  Wybierz grupę roślin:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  <button
                    id="group-filter-wszystkie"
                    onClick={() => handleGroupChange('wszystkie')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'wszystkie'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/10'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🪴</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'wszystkie'
                            ? 'bg-stone-800 text-stone-200'
                            : 'bg-white text-stone-700 border border-stone-200'
                        }`}
                      >
                        {groupCounts.wszystkie}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Wszystkie</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'wszystkie' ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        Pełna baza donicowa
                      </div>
                    </div>
                  </button>

                  <button
                    id="group-filter-warzywa"
                    onClick={() => handleGroupChange('warzywa')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'warzywa'
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm ring-2 ring-emerald-600/20'
                        : 'bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950 border-emerald-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🥕</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'warzywa'
                            ? 'bg-emerald-900 text-emerald-100'
                            : 'bg-white text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {groupCounts.warzywa}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Warzywa</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'warzywa' ? 'text-emerald-200' : 'text-stone-500'
                        }`}
                      >
                        Pomidory, papryki, sałaty...
                      </div>
                    </div>
                  </button>

                  <button
                    id="group-filter-owoce"
                    onClick={() => handleGroupChange('owoce')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'owoce'
                        ? 'bg-rose-800 text-white border-rose-800 shadow-sm ring-2 ring-rose-600/20'
                        : 'bg-rose-50/50 hover:bg-rose-50 text-rose-950 border-rose-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🍓</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'owoce'
                            ? 'bg-rose-900 text-rose-100'
                            : 'bg-white text-rose-900 border border-rose-200'
                        }`}
                      >
                        {groupCounts.owoce}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Owoce</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'owoce' ? 'text-rose-200' : 'text-stone-500'
                        }`}
                      >
                        Truskawki, borówki, maliny...
                      </div>
                    </div>
                  </button>

                  <button
                    id="group-filter-ziola"
                    onClick={() => handleGroupChange('ziola')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'ziola'
                        ? 'bg-teal-800 text-white border-teal-800 shadow-sm ring-2 ring-teal-600/20'
                        : 'bg-teal-50/50 hover:bg-teal-50 text-teal-950 border-teal-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌿</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'ziola'
                            ? 'bg-teal-900 text-teal-100'
                            : 'bg-white text-teal-900 border border-teal-200'
                        }`}
                      >
                        {groupCounts.ziola}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Zioła</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'ziola' ? 'text-teal-200' : 'text-stone-500'
                        }`}
                      >
                        Bazylia, mięta, tymianek...
                      </div>
                    </div>
                  </button>

                  <button
                    id="group-filter-ozdobne"
                    onClick={() => handleGroupChange('ozdobne')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      selectedGroup === 'ozdobne'
                        ? 'bg-purple-900 text-white border-purple-900 shadow-sm ring-2 ring-purple-600/20'
                        : 'bg-purple-50/50 hover:bg-purple-50 text-purple-950 border-purple-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🌸</span>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          selectedGroup === 'ozdobne'
                            ? 'bg-purple-950 text-purple-100'
                            : 'bg-white text-purple-900 border border-purple-200'
                        }`}
                      >
                        {groupCounts.ozdobne}
                      </span>
                    </div>
                    <div className="mt-2.5">
                      <div className="font-bold text-sm">Ozdobne</div>
                      <div
                        className={`text-[11px] ${
                          selectedGroup === 'ozdobne' ? 'text-purple-200' : 'text-stone-500'
                        }`}
                      >
                        Pelargonie, lawenda, bratki...
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Controls */}
              <div className="mt-4 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                        ? 'Szukaj zioła (np. bazylia, mięta, pietruszka)...'
                        : selectedGroup === 'ozdobne'
                        ? 'Szukaj rośliny ozdobnej (np. pelargonia, surfinia, lawenda)...'
                        : 'Szukaj rośliny lub odmiany (np. pomidor, rzodkiewka, Vilma)...'
                    }
                    className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-stone-50/60 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
                    >
                      Wyczyść
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-stone-500 font-medium hidden sm:inline">Sortuj:</span>
                  <select
                    id="sort-plants-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="text-xs p-2 rounded-xl border border-stone-200 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
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
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Plants Grid */}
            {loadingPlants ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200">
                <div className="inline-block animate-spin w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full mb-2" />
                <p className="text-xs text-stone-500">Przeliczanie bazy wiedzy o donicach...</p>
              </div>
            ) : filteredPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlants.map((plant) => (
                  <PlantCard
                    key={plant.id}
                    plant={plant}
                    onSelect={setSelectedPlant}
                    onOpenPotCalc={handleOpenPotCalcForPlant}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6">
                <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="text-base font-semibold text-stone-800">
                  {searchQuery ? 'Brak wyników wyszukiwania' : 'Brak pozycji w tej kategorii'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
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
                  className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-semibold hover:bg-emerald-900 transition cursor-pointer"
                >
                  Pokaż wszystkie rośliny ({plants.length})
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Kalkulator Wymiarów Donic i Szkicownik Rozstawy */}
        {activeTab === 'calculator' && (
          <PotCalculator
            plants={plants}
            initialPlant={selectedPotPlant || plants[0]}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
          />
        )}

        {/* Tab 3: Interaktywny Kalendarz 24 Okresów */}
        {activeTab === 'calendar' && (
          <CalendarView userSpec={userSpec} onSelectPlantById={handleSelectPlantById} />
        )}

        {/* Tab 4: ABC Uprawy w Donicach (Baza wiedzy) */}
        {activeTab === 'knowledge' && <ContainerKnowledgeGuide />}
      </main>

      {/* Detail Modal for Selected Plant */}
      <PlantDetailModal
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onOpenPotCalc={handleOpenPotCalcForPlant}
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
      <footer className="bg-white border-t border-stone-200 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>Donicowy Specjalista</strong> • Profesjonalny poradnik uprawy warzyw, owoców, ziół i roślin ozdobnych w donicach
          </div>
          <div className="text-[11px] text-stone-400">
            Darmowe dane pogodowe: Open-Meteo API • Strefy klimatyczne Polski: IMGW / Działkowiec
          </div>
        </div>
      </footer>
    </div>
  );
}

