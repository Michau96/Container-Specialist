import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronRight, Check } from 'lucide-react';
import { POLAND_REGIONS } from '../../../lib/api';
import { PolandRegionKey } from '../../../types';

export interface LocationAutocompleteProps {
  regionSearch: string;
  onRegionSearchChange: (value: string) => void;
  filteredRegions: PolandRegionKey[];
  selectedRegion: PolandRegionKey | null;
  onSelectRegion: (regKey: PolandRegionKey) => void;
  isEn?: boolean;
}

export const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  regionSearch,
  onRegionSearchChange,
  filteredRegions,
  selectedRegion,
  onSelectRegion,
  isEn = false,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset active index when search results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [regionSearch, filteredRegions.length]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredRegions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = activeIndex < filteredRegions.length - 1 ? activeIndex + 1 : 0;
      setActiveIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = activeIndex > 0 ? activeIndex - 1 : filteredRegions.length - 1;
      setActiveIndex(prevIndex);
      itemRefs.current[prevIndex]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredRegions.length) {
        onSelectRegion(filteredRegions[activeIndex]);
      } else if (filteredRegions.length === 1) {
        onSelectRegion(filteredRegions[0]);
      }
    }
  };

  const handleItemKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
    regKey: PolandRegionKey
  ) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (index + 1) % filteredRegions.length;
      setActiveIndex(nextIndex);
      itemRefs.current[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index === 0) {
        setActiveIndex(-1);
        inputRef.current?.focus();
      } else {
        const prevIndex = index - 1;
        setActiveIndex(prevIndex);
        itemRefs.current[prevIndex]?.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectRegion(regKey);
    }
  };

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
          ref={inputRef}
          type="text"
          id="region-search-input"
          name="region-search"
          data-testid="location-search"
          value={regionSearch}
          onChange={(e) => onRegionSearchChange(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={
            isEn
              ? 'Search city or region, e.g. Warsaw, Krakow, Wroclaw, Gdansk...'
              : 'Wpisz np. Warszawa, Kraków, Wrocław, Gdańsk, Poznań...'
          }
          className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 shadow-xs"
        />
      </div>

      {filteredRegions.length === 0 && (
        <div
          data-testid="location-empty-state"
          className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 animate-fade-in my-2"
        >
          <p className="font-semibold">
            Nie znaleziono lokalizacji. Wybierz województwo ręcznie z listy.
          </p>
        </div>
      )}

      <div
        ref={listRef}
        id="location-suggestions-list"
        aria-label={isEn ? 'Region suggestions' : 'Podpowiedzi województw'}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-0.5 scrollbar-none"
      >
        {filteredRegions.map((regKey, index) => {
          const reg = POLAND_REGIONS[regKey];
          const isSelected = selectedRegion === regKey;
          const isFocused = activeIndex === index;
          const isSingleRemaining = filteredRegions.length === 1;

          return (
            <button
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              key={regKey}
              id={`region-${regKey}`}
              data-testid={`location-option-${regKey}`}
              data-region={regKey}
              aria-pressed={isSelected}
              onClick={() => onSelectRegion(regKey)}
              onKeyDown={(e) => handleItemKeyDown(e, index, regKey)}
              className={`p-3 rounded-xl border border-border bg-card hover:bg-emerald-50 hover:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none transition-colors cursor-pointer flex items-center justify-between group min-h-[44px] min-w-[44px] text-left text-xs sm:text-sm font-semibold dark:border-stone-800 dark:bg-stone-900 dark:hover:bg-emerald-950/40 dark:hover:border-emerald-500 ${
                isSelected
                  ? 'border-2 border-emerald-500 bg-emerald-50/50 dark:border-emerald-400 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/30'
                  : isSingleRemaining
                  ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 text-stone-900 dark:text-stone-100 ring-2 ring-emerald-500/50 dark:ring-emerald-400/50 shadow-xs'
                  : isFocused
                  ? 'ring-2 ring-emerald-500 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/60'
                  : 'text-stone-900 dark:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 shrink-0 transition-colors" />
                <span className="truncate">{reg.name}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-950 dark:text-emerald-100 font-bold bg-emerald-100 dark:bg-emerald-900/90 px-2 py-0.5 rounded-md border border-emerald-400 dark:border-emerald-600">
                    <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[3]" />
                    <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LocationAutocomplete;
