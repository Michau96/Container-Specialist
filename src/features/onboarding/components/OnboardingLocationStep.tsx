import React, { useState, useMemo } from 'react';
import { Search, MapPin, Check, ChevronRight, AlertCircle } from 'lucide-react';
import { PolandRegionKey } from '../../../types';

export interface VoivodeshipItem {
  id: PolandRegionKey;
  name: string;
  cities: string[];
  displayLabel: string;
}

export const voivodeships: VoivodeshipItem[] = [
  {
    id: 'pomorskie',
    name: 'Pomorskie',
    cities: ['Gdańsk', 'Gdynia', 'Sopot', 'Słupsk', 'Tczew', 'Wejherowo', 'Starogard Gdański', 'Malbork'],
    displayLabel: 'Pomorskie (np. Gdańsk, Gdynia, Słupsk)',
  },
  {
    id: 'mazowieckie',
    name: 'Mazowieckie',
    cities: ['Warszawa', 'Radom', 'Płock', 'Siedlce', 'Pruszków', 'Ostrołęka', 'Legionowo'],
    displayLabel: 'Mazowieckie (np. Warszawa, Radom, Płock)',
  },
  {
    id: 'dolnoslaskie',
    name: 'Dolnośląskie',
    cities: ['Wrocław', 'Legnica', 'Wałbrzych', 'Jelenia Góra', 'Lubin', 'Głogów', 'Świdnica'],
    displayLabel: 'Dolnośląskie (np. Wrocław, Legnica, Wałbrzych)',
  },
  {
    id: 'kujawsko_pomorskie',
    name: 'Kujawsko-Pomorskie',
    cities: ['Bydgoszcz', 'Toruń', 'Włocławek', 'Grudziądz', 'Inowrocław'],
    displayLabel: 'Kujawsko-Pomorskie (np. Bydgoszcz, Toruń, Włocławek)',
  },
  {
    id: 'lubelskie',
    name: 'Lubelskie',
    cities: ['Lublin', 'Zamość', 'Chełm', 'Biała Podlaska', 'Puławy', 'Świdnik'],
    displayLabel: 'Lubelskie (np. Lublin, Zamość, Chełm)',
  },
  {
    id: 'lubuskie',
    name: 'Lubuskie',
    cities: ['Zielona Góra', 'Gorzów Wielkopolski', 'Gorzów Wlkp.', 'Nowa Sól', 'Żary'],
    displayLabel: 'Lubuskie (np. Zielona Góra, Gorzów Wlkp.)',
  },
  {
    id: 'lodzkie',
    name: 'Łódzkie',
    cities: ['Łódź', 'Piotrków Trybunalski', 'Piotrków Tryb.', 'Pabianice', 'Tomaszów Mazowiecki', 'Bełchatów', 'Zgierz'],
    displayLabel: 'Łódzkie (np. Łódź, Piotrków Tryb., Pabianice)',
  },
  {
    id: 'malopolskie',
    name: 'Małopolskie',
    cities: ['Kraków', 'Tarnów', 'Nowy Sącz', 'Oświęcim', 'Chrzanów', 'Olkusz', 'Zakopane'],
    displayLabel: 'Małopolskie (np. Kraków, Tarnów, Nowy Sącz)',
  },
  {
    id: 'opolskie',
    name: 'Opolskie',
    cities: ['Opole', 'Kędzierzyn-Koźle', 'Nysa', 'Brzeg', 'Kluczbork'],
    displayLabel: 'Opolskie (np. Opole, Kędzierzyn-Koźle, Nysa)',
  },
  {
    id: 'podkarpackie',
    name: 'Podkarpackie',
    cities: ['Rzeszów', 'Przemyśl', 'Krosno', 'Mielec', 'Tarnobrzeg', 'Stalowa Wola'],
    displayLabel: 'Podkarpackie (np. Rzeszów, Przemyśl, Krosno)',
  },
  {
    id: 'podlaskie',
    name: 'Podlaskie',
    cities: ['Białystok', 'Suwałki', 'Łomża', 'Augustów', 'Bielsk Podlaski'],
    displayLabel: 'Podlaskie (np. Białystok, Suwałki, Łomża)',
  },
  {
    id: 'slaskie',
    name: 'Śląskie',
    cities: ['Katowice', 'Częstochowa', 'Sosnowiec', 'Gliwice', 'Zabrze', 'Bielsko-Biała', 'Bytom', 'Rybnik'],
    displayLabel: 'Śląskie (np. Katowice, Bielsko-Biała, Gliwice)',
  },
  {
    id: 'swietokrzyskie',
    name: 'Świętokrzyskie',
    cities: ['Kielce', 'Ostrowiec Świętokrzyski', 'Ostrowiec Św.', 'Starachowice', 'Skarżysko-Kamienna', 'Sandomierz'],
    displayLabel: 'Świętokrzyskie (np. Kielce, Ostrowiec Św., Sandomierz)',
  },
  {
    id: 'warminsko_mazurskie',
    name: 'Warmińsko-Mazurskie',
    cities: ['Olsztyn', 'Elbląg', 'Ełk', 'Iława', 'Ostróda', 'Giżycko'],
    displayLabel: 'Warmińsko-Mazurskie (np. Olsztyn, Elbląg, Ełk)',
  },
  {
    id: 'wielkopolskie',
    name: 'Wielkopolskie',
    cities: ['Poznań', 'Kalisz', 'Konin', 'Piła', 'Ostrów Wielkopolski', 'Gniezno', 'Leszno'],
    displayLabel: 'Wielkopolskie (np. Poznań, Kalisz, Konin)',
  },
  {
    id: 'zachodniopomorskie',
    name: 'Zachodniopomorskie',
    cities: ['Szczecin', 'Koszalin', 'Stargard', 'Kołobrzeg', 'Świnoujście'],
    displayLabel: 'Zachodniopomorskie (np. Szczecin, Koszalin, Świnoujście)',
  },
];

export interface OnboardingLocationStepProps {
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  selectedVoivodeship?: PolandRegionKey | null;
  onSelectVoivodeship?: (id: PolandRegionKey) => void;
  onNext?: () => void;
  onBack?: () => void;
  isEn?: boolean;
  // Aliases for compatibility
  regionSearch?: string;
  onRegionSearchChange?: (query: string) => void;
  selectedRegion?: PolandRegionKey | null;
  handleSelectRegion?: (id: PolandRegionKey) => void;
  onSelectRegion?: (id: PolandRegionKey) => void;
}

export const OnboardingLocationStep: React.FC<OnboardingLocationStepProps> = ({
  searchQuery: propQuery,
  onSearchQueryChange: propOnQueryChange,
  selectedVoivodeship: propSelected,
  onSelectVoivodeship: propOnSelect,
  onNext,
  onBack,
  isEn = false,
  regionSearch,
  onRegionSearchChange,
  selectedRegion,
  handleSelectRegion,
  onSelectRegion,
}) => {
  // Support both controlled and uncontrolled search query
  const [internalQuery, setInternalQuery] = useState('');
  const searchQuery = propQuery ?? regionSearch ?? internalQuery;
  const handleQueryChange = (val: string) => {
    setInternalQuery(val);
    if (propOnQueryChange) propOnQueryChange(val);
    if (onRegionSearchChange) onRegionSearchChange(val);
  };

  // Support both controlled and uncontrolled selection
  const [internalSelected, setInternalSelected] = useState<PolandRegionKey | null>(null);
  const activeSelected = propSelected ?? selectedRegion ?? internalSelected;
  const handleSelect = (id: PolandRegionKey) => {
    setInternalSelected(id);
    if (propOnSelect) propOnSelect(id);
    if (handleSelectRegion) handleSelectRegion(id);
    if (onSelectRegion) onSelectRegion(id);
  };

  // Real-time client-side filtering mapping city names to respective voivodeships
  const filteredVoivodeships = useMemo(() => {
    if (!searchQuery.trim()) return voivodeships;
    const q = searchQuery.toLowerCase().trim();
    return voivodeships.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.cities.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const isNextDisabled = !activeSelected;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <label htmlFor="location-search-input" className="sr-only">
          {isEn ? 'Search city or voivodeship' : 'Wyszukaj miasto lub województwo'}
        </label>
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          id="location-search-input"
          data-testid="location-search"
          value={searchQuery}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder={
            isEn
              ? 'Enter city, e.g. Warsaw, Krakow, Gdansk, Wroclaw...'
              : 'Wpisz miasto, np. Warszawa, Kraków, Gdańsk, Wrocław...'
          }
          className="w-full min-h-[44px] pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-xl border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 shadow-2xs"
        />
      </div>

      {/* Empty State when no results */}
      {filteredVoivodeships.length === 0 && (
        <div
          data-testid="location-empty-state"
          className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs sm:text-sm flex items-start gap-3 animate-fade-in"
        >
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">
              Nie znaleziono lokalizacji. Wybierz województwo ręcznie z listy.
            </p>
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 cursor-pointer"
            >
              Wyczyść wyszukiwanie i pokaż wszystkie województwa
            </button>
          </div>
        </div>
      )}

      {/* Voivodeships Grid List */}
      <div
        id="location-suggestions-list"
        data-testid="location-suggestions-list"
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto p-0.5"
      >
        {filteredVoivodeships.map((v) => {
          const isSelected = activeSelected === v.id;

          return (
            <button
              type="button"
              key={v.id}
              id={`region-${v.id}`}
              data-testid={`location-option-${v.id}`}
              data-region={v.id}
              aria-pressed={isSelected}
              onClick={() => handleSelect(v.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[48px] text-left text-xs sm:text-sm font-semibold active:scale-[0.98] ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-bold ring-2 ring-emerald-500/30 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 text-slate-800 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <MapPin
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isSelected ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{v.displayLabel}</span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isSelected ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                    <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                    <span>Wybrano</span>
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Navigation Footer with "Dalej >" Button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[48px] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer"
          >
            Wstecz
          </button>
        ) : (
          <div />
        )}

        {onNext && (
          <button
            type="button"
            id="onboarding-location-next-btn"
            data-testid="onboarding-next-btn"
            disabled={isNextDisabled}
            onClick={onNext}
            className={`min-h-[48px] px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              isNextDisabled
                ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500 border border-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-md cursor-pointer'
            }`}
          >
            <span>Dalej &gt;</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingLocationStep;
