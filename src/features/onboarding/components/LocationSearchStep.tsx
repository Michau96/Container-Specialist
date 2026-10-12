import React from 'react';
import { Search, Check, ArrowRight } from 'lucide-react';
import { POLAND_REGIONS } from '../../../lib/api';
import { PolandRegionKey } from '../../../types';

export interface LocationSearchStepProps {
  regionSearch: string;
  onRegionSearchChange: (value: string) => void;
  filteredRegions: PolandRegionKey[];
  selectedRegion: PolandRegionKey | null;
  handleSelectRegion: (regKey: PolandRegionKey) => void;
  isEn?: boolean;
}

export const LocationSearchStep: React.FC<LocationSearchStepProps> = ({
  regionSearch,
  onRegionSearchChange,
  filteredRegions,
  selectedRegion,
  handleSelectRegion,
  isEn = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredRegions.length === 1) {
      e.preventDefault();
      handleSelectRegion(filteredRegions[0]);
    }
  };

  const isSingleRemaining = filteredRegions.length === 1;

  return (
    <div className="space-y-3">
      <div className="relative">
        <label
          htmlFor="region-search-input"
          id="region-search-label"
          className="sr-only"
        >
          {isEn ? 'Search city or region' : 'Wyszukaj miasto lub województwo'}
        </label>
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          id="region-search-input"
          name="region-search"
          data-testid="location-search"
          value={regionSearch}
          onChange={(e) => onRegionSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isEn ? 'Search city or region, e.g. Warsaw, Krakow, Wroclaw, Gdansk...' : 'Wpisz np. Warszawa, Kraków, Wrocław, Gdańsk, Poznań...'}
          className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 shadow-xs"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-0.5 scrollbar-none">
        {filteredRegions.map((regKey) => {
          const reg = POLAND_REGIONS[regKey];
          const isSelected = selectedRegion === regKey;
          return (
            <button
              type="button"
              key={regKey}
              id={`region-${regKey}`}
              data-testid={`location-option-${regKey}`}
              data-region={regKey}
              aria-pressed={isSelected}
              onClick={() => handleSelectRegion(regKey)}
              className={`group min-h-[44px] min-w-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs ring-2 ring-emerald-600/30 dark:ring-emerald-400/30 ring-offset-2 ring-offset-white dark:ring-offset-stone-900'
                  : isSingleRemaining
                  ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 text-stone-900 dark:text-stone-100 ring-2 ring-emerald-500/50 dark:ring-emerald-400/50 ring-offset-1 ring-offset-white dark:ring-offset-stone-900 shadow-xs'
                  : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100'
              }`}
            >
              <span className="truncate pr-2">{reg.name}</span>
              <div className="flex items-center gap-1.5 shrink-0">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-950 dark:text-emerald-100 font-bold bg-emerald-100 dark:bg-emerald-900/90 px-2 py-0.5 rounded-md border border-emerald-400 dark:border-emerald-600">
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[3]" />
                    <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
