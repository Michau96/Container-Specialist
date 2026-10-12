import React, { useState, useMemo } from 'react';
import { Plant, UserBalconySpec } from '../../../types';
import { usePlantRecommendations } from '../hooks/usePlantRecommendations';
import { PlantMatchBadge } from './PlantMatchBadge';

export interface PlantCatalogViewProps {
  plants: Plant[];
  balconySpec?: Partial<UserBalconySpec> | null;
  onSelectPlant?: (plant: Plant) => void;
  onAddPlantToBalcony?: (plant: Plant) => void;
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

export const PlantCatalogView: React.FC<PlantCatalogViewProps> = ({
  plants,
  balconySpec,
  onSelectPlant,
  onAddPlantToBalcony,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('wszystkie');

  const { plants: plantsWithScores } = usePlantRecommendations(plants, balconySpec);

  const filteredPlants = useMemo(() => {
    return plantsWithScores.filter((plant) => {
      const matchesCategory =
        selectedCategory === 'wszystkie' || plant.plant_group === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        plant.name.toLowerCase().includes(q) ||
        (plant.summary && plant.summary.toLowerCase().includes(q)) ||
        (plant.category && plant.category.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [plantsWithScores, selectedCategory, searchQuery]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Sticky Header with Search & Category Pills */}
      <div className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 px-4 shadow-sm transition-shadow">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj roślin (np. pomidor, bazylia)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
            />
            <span className="absolute left-3.5 top-2.5 text-stone-400 text-sm">🔍</span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {CATEGORY_PILLS.map((pill) => {
              const isActive = selectedCategory === pill.key;
              return (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setSelectedCategory(pill.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              data-testid={`catalog-plant-${plant.id}`}
              className="flex flex-col justify-between bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition cursor-pointer"
              onClick={() => onSelectPlant?.(plant)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-stone-400">
                    {plant.category}
                  </span>
                  <PlantMatchBadge matchPercentage={plant.matchPercentage} />
                </div>
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {plant.name}
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                  {plant.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
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
      </div>
    </div>
  );
};
