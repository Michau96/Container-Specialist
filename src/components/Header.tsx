import React from 'react';
import {
  Sprout,
  Calendar,
  Settings,
  Compass,
  Building,
  MapPin,
  Sparkles,
  Ruler,
  Sun,
  Moon,
  Search,
} from 'lucide-react';
import { UserBalconySpec, getFloorCategory } from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS } from '../lib/api';

export type ActiveNavTab = 'my_crops' | 'search_crops' | 'calendar' | 'calculator';

interface Props {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  userSpec: UserBalconySpec;
  onOpenSetup: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  myCropsCount?: number;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onTabChange,
  userSpec,
  onOpenSetup,
  darkMode,
  onToggleDarkMode,
  myCropsCount = 0,
}) => {
  const regionInfo = POLAND_REGIONS[userSpec.region];
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === userSpec.orientation);
  const orientationDisplay = orientItem ? orientItem.label : userSpec.orientation;
  const floorClass = getFloorCategory(userSpec.floor);

  const floorDisplay =
    userSpec.floor === 0
      ? 'Parter (klasa: parter)'
      : `${userSpec.floor}. piętro (klasa: ${floorClass})`;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 dark:bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                  Donicowy specjalista
                </h1>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800">
                  Ogród w pojemnikach
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ekspercki poradnik uprawy warzyw, owoców, ziół i kwiatów w donicach
              </p>
            </div>
          </div>

          {/* Current Balcony Specs Summary Badge & Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <div
              id="balcony-summary-badge"
              onClick={onOpenSetup}
              title="Kliknij, aby zmienić specyfikację Twojego balkonu"
              className="flex items-center gap-2.5 px-3 py-1.5 bg-white dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-700 shadow-2xs hover:border-emerald-700 dark:hover:border-emerald-500 hover:bg-stone-50/80 dark:hover:bg-stone-800 transition cursor-pointer text-xs text-stone-700 dark:text-stone-300"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {regionInfo ? regionInfo.name.split('(')[0].trim() : 'Polska'}
                </span>
              </div>
              <span className="text-stone-300 dark:text-stone-600">•</span>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />
                <span className="font-medium">{floorDisplay}</span>
              </div>
              <span className="text-stone-300 dark:text-stone-600">•</span>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>{orientationDisplay}</span>
              </div>
            </div>

            <button
              id="edit-balcony-settings-btn"
              onClick={onOpenSetup}
              className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              title="Zmień parametry balkonu"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Dostosuj balkon</span>
            </button>

            {/* Dark Mode Switch */}
            <button
              id="dark-mode-toggle-btn"
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-amber-300 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              aria-label={darkMode ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
              title={darkMode ? 'Przełącz na tryb jasny' : 'Przełącz na tryb ciemny'}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden lg:inline text-stone-200">Jasny</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-stone-600" />
                  <span className="hidden lg:inline text-stone-700">Ciemny</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Moje uprawy vs Szukaj nowych upraw vs Kalendarz vs Kalkulator */}
        <div className="flex items-center gap-2 border-t border-stone-200/60 dark:border-stone-800 pt-2 pb-2 overflow-x-auto">
          <button
            id="tab-my-crops"
            onClick={() => onTabChange('my_crops')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'my_crops'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>Moje uprawy</span>
            <span
              className={`text-xs px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'my_crops'
                  ? 'bg-emerald-950 text-emerald-200'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              {myCropsCount}
            </span>
          </button>

          <button
            id="tab-search-crops"
            onClick={() => onTabChange('search_crops')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'search_crops'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Szukaj nowych upraw</span>
          </button>

          <button
            id="tab-calendar"
            onClick={() => onTabChange('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Kalendarz (2 tryby)</span>
          </button>

          <button
            id="tab-calculator"
            onClick={() => onTabChange('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Kalkulator donic i rozstawy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
