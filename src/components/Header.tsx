import React, { useState, useRef, useEffect } from 'react';
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
  Globe,
  Check,
  ChevronDown,
} from 'lucide-react';
import { UserBalconySpec, UserAccount } from '../types';
import { useLanguage } from '../lib/LanguageContext';
import { ORIENTATION_OPTIONS, POLAND_REGIONS } from '../lib/api';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from './ui/tooltip';

export type ActiveNavTab = 'my_crops' | 'search_crops' | 'calendar' | 'calculator';

export interface Props {
  activeTab: ActiveNavTab;
  onTabChange: (tab: ActiveNavTab) => void;
  userSpec: UserBalconySpec;
  isConfigured?: boolean;
  tooltipOpen?: boolean;
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
  isConfigured: isConfiguredProp,
  tooltipOpen,
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
  const { language, setLanguage, t } = useLanguage();
  const handleOpenDrawer = onOpenBalconyDrawer || onOpenSetup || (() => {});

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const preferencesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (preferencesRef.current && !preferencesRef.current.contains(event.target as Node)) {
        setIsPreferencesOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreferencesOpen(false);
      }
    };

    if (isPreferencesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreferencesOpen]);

  // Determine whether the balcony profile is configured
  const isSpecComplete = Boolean(
    userSpec &&
      userSpec.region &&
      userSpec.orientation &&
      typeof userSpec.floor === 'number' &&
      !isNaN(userSpec.floor)
  );
  const isConfigured = typeof isConfiguredProp === 'boolean' ? isConfiguredProp : isSpecComplete;
  const isProfileIncomplete = !isConfigured;

  // Formatting for configured tooltip content
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === userSpec?.orientation);
  const orientationLabel = orientItem
    ? orientItem.label
    : userSpec?.orientation
    ? `Kierunek ${userSpec.orientation}`
    : 'Południe (S)';

  const getFloorText = (floor: number | undefined | null) => {
    if (floor === 0) return 'Parter';
    if (typeof floor === 'number' && !isNaN(floor)) {
      if (floor <= 3) return 'Piętro 1-3';
      if (floor <= 6) return 'Piętro 4-6';
      return 'Piętro 7+';
    }
    return 'Piętro 1-3';
  };
  const floorText = getFloorText(userSpec?.floor);

  const regionItem = userSpec?.region ? POLAND_REGIONS[userSpec.region] : undefined;
  const regionName = regionItem
    ? regionItem.name.split('(')[0].trim()
    : userSpec?.region
    ? userSpec.region.charAt(0).toUpperCase() + userSpec.region.slice(1)
    : 'Mazowieckie';

  const configuredTooltipText = `Profil balkonu: ${orientationLabel}, ${floorText}, ${regionName}`;
  const incompleteTooltipText = 'Uzupełnij parametry balkonu, aby zoptymalizować dobór roślin';

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          {/* Logo & Subtitle */}
          <div
            className={`flex items-center gap-3 ${onOpenWelcome ? 'cursor-pointer group' : ''}`}
            onClick={onOpenWelcome}
            title={onOpenWelcome ? (language === 'pl' ? 'Kliknij, aby otworzyć przewodnik startowy o aplikacji' : 'Click to open the welcome guide') : undefined}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 dark:from-emerald-700 dark:to-teal-900 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {t('appTitle')}
                </h1>
                <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800">
                  {t('appTagline')}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Actions: "Mój balkon" Drawer trigger + Account + Help + Preferences Dropdown */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* "Mój balkon" Button with Radix Tooltip */}
            <TooltipProvider delayDuration={150}>
              <Tooltip open={tooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    id="open-balcony-drawer-btn"
                    data-testid="open-balcony-drawer-btn"
                    type="button"
                    onClick={handleOpenDrawer}
                    aria-label={
                      isConfigured
                        ? 'Mój balkon - profil skonfigurowany'
                        : 'Mój balkon - profil nieskonfigurowany'
                    }
                    className="relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] transition cursor-pointer shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    title={isConfigured ? configuredTooltipText : incompleteTooltipText}
                  >
                    <Settings className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
                    <span>{t('myBalcony')}</span>
                    {isProfileIncomplete ? (
                      <span
                        className="relative flex h-2.5 w-2.5"
                        title="Profil wymaga uzupełnienia"
                        data-testid="balcony-status-indicator"
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                        <span className="sr-only">Profil balkonu wymaga dokończenia konfiguracji</span>
                      </span>
                    ) : (
                      <span
                        className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 transition-all duration-300"
                        aria-hidden="true"
                        data-testid="balcony-status-indicator"
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  id="balcony-tooltip-content"
                  data-testid="balcony-tooltip-content"
                  side="bottom"
                  align="center"
                  className="max-w-xs text-center sm:text-left font-sans"
                >
                  {isConfigured ? (
                    <div className="flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-100">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
                      <span>{configuredTooltipText}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
                      <span>{incompleteTooltipText}</span>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {onOpenWelcome && (
              <button
                id="open-welcome-guide-btn"
                type="button"
                onClick={onOpenWelcome}
                className="p-2 bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-200 hover:text-emerald-900 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                title={t('aboutApp')}
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden md:inline">{t('aboutApp')}</span>
              </button>
            )}

            {/* User Account Button */}
            {currentUser ? (
              <button
                id="user-profile-header-btn"
                onClick={onOpenProfile}
                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/80 rounded-[1rem] text-xs font-semibold transition flex items-center gap-2 cursor-pointer shadow-2xs"
                title={`${t('signedInAs')} ${currentUser.username}.`}
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
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            ) : (
              <button
                id="login-register-header-btn"
                onClick={onOpenAuth}
                className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title={t('account')}
              >
                <User className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t('account')}</span>
              </button>
            )}

            {/* Preferences Dropdown (Market-standard hidden menu for Theme & Language) */}
            <div className="relative" ref={preferencesRef}>
              <button
                id="header-preferences-trigger"
                data-testid="header-preferences-trigger"
                type="button"
                onClick={() => setIsPreferencesOpen((prev) => !prev)}
                className={`min-h-[40px] px-2.5 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-[1rem] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  isPreferencesOpen ? 'ring-2 ring-emerald-500 bg-stone-200 dark:bg-stone-700' : ''
                }`}
                aria-label={t('preferencesTitle')}
                aria-expanded={isPreferencesOpen}
                aria-haspopup="true"
                title={`${t('preferencesTitle')}: ${language.toUpperCase()} • ${darkMode ? t('themeDark') : t('themeLight')}`}
              >
                {darkMode ? (
                  <Moon className="w-4 h-4 text-sky-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-[11px] font-bold uppercase tracking-wider">{language}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isPreferencesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPreferencesOpen && (
                <div
                  id="header-preferences-dropdown"
                  data-testid="header-preferences-dropdown"
                  role="menu"
                  aria-label={t('preferencesTitle')}
                  className="absolute right-0 top-full mt-2 z-50 w-64 p-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl space-y-3.5 animate-in fade-in-0 zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                      {t('preferencesTitle')}
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {language.toUpperCase()} • {darkMode ? t('themeDark') : t('themeLight')}
                    </span>
                  </div>

                  {/* Section 1: Motyw (Theme) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                      <span className="flex items-center gap-1.5">
                        {darkMode ? <Moon className="w-3.5 h-3.5 text-sky-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{t('themeTitle')}</span>
                      </span>
                      <span className="text-[11px] font-normal text-stone-400">
                        {darkMode ? t('themeDark') : t('themeLight')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200/80 dark:border-stone-700/80">
                      <button
                        type="button"
                        id="theme-light-btn"
                        onClick={() => {
                          if (darkMode) onToggleDarkMode();
                        }}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          !darkMode
                            ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                        }`}
                        aria-pressed={!darkMode}
                      >
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>{t('themeLight')}</span>
                      </button>

                      <button
                        type="button"
                        id="dark-mode-toggle-btn"
                        data-testid="dark-mode-toggle-btn"
                        onClick={() => {
                          if (!darkMode) onToggleDarkMode();
                        }}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          darkMode
                            ? 'bg-stone-900 text-white dark:bg-stone-700 dark:text-stone-100 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                        }`}
                        aria-pressed={darkMode}
                        aria-label={darkMode ? t('themeLight') : t('themeDark')}
                      >
                        <Moon className="w-3.5 h-3.5 text-sky-400" />
                        <span>{t('themeDark')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Język (Language) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{t('language')}</span>
                      </span>
                      <span className="text-[11px] font-normal text-stone-400">
                        {language === 'pl' ? 'Polski' : 'English'}
                      </span>
                    </div>
                    <div
                      id="header-language-switcher"
                      role="group"
                      aria-label={t('switchLanguage')}
                      className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200/80 dark:border-stone-700/80"
                    >
                      <button
                        id="header-lang-pl-btn"
                        type="button"
                        onClick={() => setLanguage('pl')}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          language === 'pl'
                            ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                        }`}
                        aria-pressed={language === 'pl'}
                        title="Wersja polska (PL)"
                      >
                        <span>🇵🇱</span>
                        <span>PL</span>
                      </button>

                      <button
                        id="header-lang-en-btn"
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                          language === 'en'
                            ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
                        }`}
                        aria-pressed={language === 'en'}
                        title="English version (EN)"
                      >
                        <span>🇬🇧</span>
                        <span>EN</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-stone-200/60 dark:border-stone-800 pt-2 pb-2 overflow-x-auto">
          <button
            id="tab-my-crops"
            onClick={() => onTabChange('my_crops')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              activeTab === 'my_crops'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Sprout className="w-4 h-4" />
            <span>{t('tabMyCrops')}</span>
            <span
              data-testid="my-crops-count"
              className={`text-xs px-2 py-0.2 rounded-full font-bold ${
                activeTab === 'my_crops'
                  ? 'bg-emerald-950 text-emerald-200'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
              }`}
            >
              {myCropsCount}
            </span>
          </button>

          <button
            id="tab-search-crops"
            onClick={() => onTabChange('search_crops')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              activeTab === 'search_crops'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>{t('tabDiscover')}</span>
          </button>

          <button
            id="tab-calendar"
            onClick={() => onTabChange('calendar')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              activeTab === 'calendar'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('tabCalendar')}</span>
          </button>

          <button
            id="tab-calculator"
            onClick={() => onTabChange('calculator')}
            className={`min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              activeTab === 'calculator'
                ? 'bg-emerald-800 text-white shadow-xs dark:bg-emerald-700'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>{t('tabCalculator')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const Navbar = Header;
export const HeaderNavigation = Header;
export default Header;
