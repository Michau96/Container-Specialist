import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, Sprout, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Plant, UserBalconySpec } from '../../../types';
import { usePlantRecommendations } from '../hooks/usePlantRecommendations';
import { PlantMatchBadge } from './PlantMatchBadge';
import { getPlantTimingInfo } from '../../../lib/cropTiming';
import { getPlantVisual } from '../../../lib/plantImages';
import { ImageWithFallback } from '../../../components/ImageWithFallback';
import { ScrollToTopButton } from '../../../components/ScrollToTopButton';

export type QuickFilterType =
  | 'all'
  | 'perfect_match'
  | 'active_timing'
  | 'sow_now'
  | 'transplant_now';

export interface PlantCatalogViewProps {
  plants: Plant[];
  balconySpec?: Partial<UserBalconySpec> | null;
  onSelectPlant?: (plant: Plant) => void;
  onAddPlantToBalcony?: (plant: Plant) => void;
  todayDate?: Date;
  initialSearchQuery?: string;
  initialQuickFilter?: QuickFilterType;
  debounceMs?: number;
  placeholder?: string;
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
    id: 'perfect_match' as const,
    label: '100% dopasowania',
    icon: <CheckCircle2 className="w-4 h-4" aria-hidden="true" />,
  },
  {
    id: 'active_timing' as const,
    label: 'Termin aktywny',
    icon: <Clock className="w-4 h-4" aria-hidden="true" />,
  },
  {
    id: 'sow_now' as const,
    label: 'Wysiej teraz',
    icon: <Sprout className="w-4 h-4" aria-hidden="true" />,
  },
  {
    id: 'transplant_now' as const,
    label: 'Sadź teraz',
    icon: <Calendar className="w-4 h-4" aria-hidden="true" />,
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
  placeholder = 'Szukaj nowych upraw',
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

      // 3. Quick-filter pills ("100% dopasowania", "Termin aktywny", "Wysiej teraz", "Sadź teraz")
      let matchesQuickFilter = true;
      if (activeQuickFilter === 'perfect_match') {
        matchesQuickFilter =
          plant.matchPercentage >= 100 ||
          plant.recommendation?.badgeLabel === '100% dopasowania' ||
          (plant.suitability && plant.suitability.score >= 90);
      } else if (activeQuickFilter === 'active_timing') {
        const timing = getPlantTimingInfo(plant, effectiveToday);
        matchesQuickFilter =
          timing.status === 'sow_now' ||
          timing.status === 'transplant_now' ||
          timing.status === 'growing_season' ||
          timing.status === 'last_call' ||
          timing.status === 'year_round' ||
          timing.isGoodTimeToPlantNow;
      } else if (activeQuickFilter === 'sow_now') {
        const timing = getPlantTimingInfo(plant, effectiveToday);
        matchesQuickFilter =
          timing.status === 'sow_now' ||
          timing.status === 'year_round' ||
          timing.isGoodTimeToPlantNow;
      } else if (activeQuickFilter === 'transplant_now') {
        const timing = getPlantTimingInfo(plant, effectiveToday);
        matchesQuickFilter = timing.status === 'transplant_now' || timing.isGoodTimeToPlantNow;
      }

      return matchesCategory && matchesSearch && matchesQuickFilter;
    });
  }, [plantsWithScores, selectedCategory, debouncedQuery, activeQuickFilter, todayDate]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 relative">
      {/* Sticky header container wrapping search input & active filter pills */}
      <div className="sticky top-0 z-30 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-stone-800 py-3 px-4 shadow-sm transition-all duration-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input with minimum 44px height and accessible clear button */}
          <div className="relative w-full md:flex-1">
            <Search className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              aria-label="Wyszukaj rośliny w katalogu"
              data-testid="plant-search-input"
              className="w-full min-h-[44px] pl-10 pr-12 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm transition-colors shadow-2xs"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Wyczyść wyszukiwanie"
                data-testid="clear-search-button"
                className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] p-2.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Quick-Filter Pills ("100% dopasowania", "Termin aktywny", "Wysiej teraz", "Sadź teraz") */}
          <div
            className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1 shrink-0"
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
                  className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700 hover:bg-emerald-50 dark:hover:bg-stone-700 hover:border-emerald-400'
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

      {/* Category Filter Pills Row with minimum 44px touch targets */}
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
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
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
            <p className="text-sm text-stone-500 dark:text-stone-400">
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
              className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
            >
              Wyczyść filtry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPlants.map((plant) => {
              const plantImg = plant.imageUrl || getPlantVisual(plant.id, plant.plant_group).imageUrl;
              return (
                <div
                  key={plant.id}
                  data-testid={`catalog-plant-${plant.id}`}
                  className="flex flex-col justify-between bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer"
                  onClick={() => onSelectPlant?.(plant)}
                >
                  <ImageWithFallback
                    src={plantImg}
                    alt={plant.name}
                    fallbackSrc="/assets/plants/default-cultivation.webp"
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase font-bold text-emerald-800 dark:text-emerald-400">
                          {plant.category}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-2">
                        {plant.name}
                      </h4>

                      {/* Horizontal container for compatibility badge and pot requirements */}
                      <div className="flex flex-wrap items-center gap-2">
                        <PlantMatchBadge matchPercentage={plant.matchPercentage} />
                        {plant.pot?.min_volume_l && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-300 dark:border-stone-700">
                            <span aria-hidden="true">🪴</span>
                            <span>Donica: min. {plant.pot.min_volume_l}L</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                        {plant.summary}
                      </p>
                    </div>

                    <div className="mt-auto pt-2 border-t border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddPlantToBalcony?.(plant);
                        }}
                        className="w-full mt-2 min-h-[44px] py-2.5 px-4 rounded-xl font-medium transition-all hover:brightness-105 active:scale-[0.98] bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        + Dodaj do balkonu
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export const CropsSearch = PlantCatalogView;
export const CatalogPage = PlantCatalogView;
export default PlantCatalogView;
