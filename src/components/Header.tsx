import React from 'react';
import {
  Sprout,
  Calendar,
  Settings,
  Ruler,
  Sun,
  Moon,
  Search,
  User,
  HelpCircle,
} from 'lucide-react';
import { UserBalconySpec, UserAccount } from '../types';

export type ActiveNavTab = 'my_crops' | 'search_crops' | 'calendar' | 'calculator';

interface Props {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  userSpec: UserBalconySpec;
  onOpenSetup?: () => void;
  onOpenBalconyDrawer?: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  myCropsCount?: number;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onOpenWelcome?: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onTabChange,
  userSpec,
  onOpenSetup,
  onOpenBalconyDrawer,
  darkMode,
  onToggleDarkMode,
  myCropsCount = 0,
  currentUser = null,
  onOpenAuth,
  onOpenProfile,
  onOpenWelcome,
}) => {
  const handleOpenDrawer = onOpenBalconyDrawer || onOpenSetup || (() => {});

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          {/* Logo & Subtitle */}
          <div
            className={`flex items-center gap-3 ${onOpenWelcome ? 'cursor-pointer group' : ''}`}
            onClick={onOpenWelcome}
            title={onOpenWelcome ? 'Kliknij, aby otworzyć przewodnik startowy o aplikacji' : undefined}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-700 dark:to-teal-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
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

          {/* Actions: Subtle "Mój balkon" Drawer trigger + Account + Theme */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="open-balcony-drawer-btn"
              type="button"
              onClick={handleOpenDrawer}
              className="px-3.5 py-1.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-2xs group"
              title="Parametry Twojego balkonu (wystawa, piętro, region) — otwórz boczny panel"
            >
              <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>Mój balkon</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            {onOpenWelcome && (
              <button
                id="open-welcome-guide-btn"
                type="button"
                onClick={onOpenWelcome}
                className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title="O aplikacji i przewodnik startowy"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">O aplikacji</span>
              </button>
            )}

            {/* User Account Button */}
            {currentUser ? (
              <button
                id="user-profile-header-btn"
                onClick={onOpenProfile}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/80 rounded-[1rem] text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-2xs"
                title={`Zalogowano jako ${currentUser.username}. Kliknij, aby zobaczyć profil lub wylogować.`}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.username}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[110px] truncate">{currentUser.username}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Ustawienia balkonu zapisane na koncie" />
              </button>
            ) : (
              <button
                id="login-register-header-btn"
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Zaloguj się lub załóż konto z nickiem i hasłem, aby zapisać ustawienia balkonu"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Konto / Zaloguj</span>
              </button>
            )}

            {/* Dark Mode Switch */}
            <button
              id="dark-mode-toggle-btn"
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-stone-700 dark:text-amber-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
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
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
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
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
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
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
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
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
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
