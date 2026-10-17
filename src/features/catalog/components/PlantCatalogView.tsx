import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Sprout, Calendar, CheckCircle2 } from 'lucide-react';
import { Plant, UserBalconySpec } from '../../../types';
import { usePlantRecommendations } from '../hooks/usePlantRecommendations';
import { PlantMatchBadge } from './PlantMatchBadge';
import { getPlantTimingInfo } from '../../../lib/cropTiming';

export type QuickFilterType = 'all' | 'sow_now' | 'transplant_now' | 'perfect_match';

export interface PlantCatalogViewProps {
  plants: Plant[];
  balconySpec?: Partial<UserBalconySpec> | null;
  onSelectPlant?: (plant: Plant) => void;
  onAddPlantToBalcony?: (plant: Plant) => void;
  todayDate?: Date;
  initialSearchQuery?: string;
  initialQuickFilter?: QuickFilterType;
  debounceMs?: number;
}

const CATEGORY_PILLS = [
  { key: 'wszystkie', label: 'Wszystkie' },
  { key: 'warzywa', label: 'Warzywa' },
  { key: 'ziola', label: 'Zioła' },
  { key: 'owoce', label: 'Owoce' },
  { key: 'ozdobne', label: 'Ozdobne' },
  { key: 'kielki', label: 'Kiełki' },
  { key: 'grzyby', label: 'Grzyby' },
];

const QUICK_FILTERS = [
  {
    id: 'sow_now' as const,
    label: 'Wysiej teraz',
    icon: <Sprout className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  {
    id: 'transplant_now' as const,
    label: 'Sadź teraz',
    icon: <Calendar className="w-3.5 h-3.5" aria-hidden="true" />,
  },
  {
    id: 'perfect_match' as const,
    label: '100% dopasowania',
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
  },
];

export const PlantCatalogView: React.FC<PlantCatalogViewProps> = ({
  plants,
  balconySpec,
  onSelectPlant,
  onAddPlantToBalcony,
  todayDate,
  initialSearchQuery = '',
  initialQuickFilter = 'all',
  debounceMs = 150,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilterType>(initialQuickFilter);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Debounce search input by 150ms for instant responsive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  // Focus search input when navigating with ?focus=search
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('focus') === 'search') {
        searchInputRef.current?.focus();
      }
    }
  }, []);

  const handleClear = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    searchInputRef.current?.focus();
  };

  const { plants: plantsWithScores } = usePlantRecommendations(plants, balconySpec);

  const filteredPlants = useMemo(() => {
    const q = debouncedQuery.toLowerCase().trim();
    const effectiveToday = todayDate || new Date();

    return plantsWithScores.filter((plant) => {
      // 1. Category filter
      const matchesCategory =
        selectedCategory === 'wszystkie' || plant.plant_group === selectedCategory;

      // 2. Search query match
      const matchesSearch =
        !q ||
        plant.name.toLowerCase().includes(q) ||
        (plant.common_name && plant.common_name.toLowerCase().includes(q)) ||
        (plant.summary && plant.summary.toLowerCase().includes(q)) ||
        (plant.category && plant.category.toLowerCase().includes(q)) ||
        (plant.search_keywords && plant.search_keywords.some((k) => k.toLowerCase().includes(q)));

      // 3. Quick-filter pills ("Wysiej teraz", "Sadź teraz", "100% dopasowania")
      let matchesQuickFilter = true;
      if (activeQuickFilter === 'sow_now') {
        const timing = getPlantTimingInfo(plant, effectiveToday);
        matchesQuickFilter =
          timing.status === 'sow_now' ||
          timing.status === 'year_round' ||
          timing.isGoodTimeToPlantNow;
      } else if (activeQuickFilter === 'transplant_now') {
        const timing = getPlantTimingInfo(plant, effectiveToday);
        matchesQuickFilter = timing.status === 'transplant_now' || timing.isGoodTimeToPlantNow;
      } else if (activeQuickFilter === 'perfect_match') {
        matchesQuickFilter =
          plant.matchPercentage >= 100 || plant.recommendation?.badgeLabel === '100% dopasowania';
      }

      return matchesCategory && matchesSearch && matchesQuickFilter;
    });
  }, [plantsWithScores, selectedCategory, debouncedQuery, activeQuickFilter, todayDate]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Sticky sub-header container with Search Input & Quick-filter Pills */}
      <div className="sticky top-[64px] z-30 w-full bg-background/90 backdrop-blur-md border-b border-border/60 py-3 px-4 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj roślin (np. Pomidor, Bazylia, Rzodkiewka)..."
              aria-label="Wyszukaj rośliny w katalogu"
              data-testid="plant-search-input"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-colors shadow-2xs"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Wyczyść wyszukiwanie"
                data-testid="clear-search-button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick-filter Pills ("Wysiej teraz", "Sadź teraz", "100% dopasowania") */}
          <div
            className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar py-1 shrink-0"
            role="group"
            aria-label="Szybkie filtry katalogu"
          >
            {QUICK_FILTERS.map((pill) => {
              const isActive = activeQuickFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  data-testid={`quick-filter-${pill.id}`}
                  aria-pressed={isActive}
                  onClick={() =>
                    setActiveQuickFilter((prev) => (prev === pill.id ? 'all' : pill.id))
                  }
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-card text-foreground border-border hover:bg-muted hover:border-emerald-400'
                  }`}
                >
                  {pill.icon}
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Category Filter Pills Row */}
      <div className="max-w-7xl mx-auto w-full px-4 pt-4 sm:px-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_PILLS.map((pill) => {
            const isActive = selectedCategory === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                data-testid={`category-pill-${pill.key}`}
                onClick={() => setSelectedCategory(pill.key)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-card text-foreground border border-border hover:bg-muted'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Content or Empty State */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1">
        {filteredPlants.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-12 px-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Brak roślin spełniających kryteria wyszukiwania.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setDebouncedQuery('');
                setActiveQuickFilter('all');
                setSelectedCategory('wszystkie');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              Wyczyść filtry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlants.map((plant) => (
              <div
                key={plant.id}
                data-testid={`catalog-plant-${plant.id}`}
                className="flex flex-col justify-between bg-card text-foreground border border-border rounded-2xl p-4 shadow-xs hover:shadow-md transition cursor-pointer"
                onClick={() => onSelectPlant?.(plant)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold text-muted-foreground">
                      {plant.category}
                    </span>
                    <PlantMatchBadge matchPercentage={plant.matchPercentage} />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-1">
                    {plant.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {plant.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddPlantToBalcony?.(plant);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    + Dodaj do balkonu
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CropsSearch = PlantCatalogView;
export default PlantCatalogView;
