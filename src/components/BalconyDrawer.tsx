import React, { useEffect } from 'react';
import {
  X,
  Compass,
  Building,
  MapPin,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Wind,
  Shield,
  Clock,
  Settings,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Layers,
  Umbrella,
  ThermometerSnowflake,
  User,
} from 'lucide-react';
import {
  UserBalconySpec,
  UserAccount,
  getFloorCategoryLabel,
  BalconyType,
  RoofingType,
  CareTime,
} from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS } from '../lib/api';

interface BalconyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userSpec: UserBalconySpec;
  onOpenFullSetup: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

const BALCONY_TYPE_LABELS: Record<BalconyType, { label: string; desc: string }> = {
  open_rail: {
    label: 'Ażurowa barierka',
    desc: 'Wysoka przewiewność i dobre doświetlenie donic dolnych.',
  },
  solid_wall: {
    label: 'Murek betonowy',
    desc: 'Dobra ochrona przed porywistym wiatrem, cień w dolnej strefie.',
  },
  loggia: {
    label: 'Loggia wnękowa',
    desc: 'Najcieplejszy mikroklimat, ściany akumulują ciepło słoneczne.',
  },
  french: {
    label: 'Balkon francuski',
    desc: 'Kompaktowa przestrzeń na donice na balustradzie lub parapecie.',
  },
};

const ROOFING_LABELS: Record<RoofingType, { label: string; desc: string }> = {
  covered: {
    label: 'Zadaszony',
    desc: 'Chroni przed gwałtownym gradem i ulewami; wymaga regularnego podlewania.',
  },
  uncovered: {
    label: 'Odkryty',
    desc: 'Maksymalne doświetlenie zenitalne oraz naturalne nawadnianie opadami.',
  },
};

const CARE_TIME_LABELS: Record<CareTime, { label: string; tag: string }> = {
  daily: {
    label: 'Codziennie (10–15 min)',
    tag: 'Wymagające uprawy (pomidory, bakłażany)',
  },
  few_days: {
    label: 'Co 2–3 dni',
    tag: 'Zrównoważony ogród ziołowo-warzywny',
  },
  weekends: {
    label: 'Głównie w weekendy',
    tag: 'Uprawy samowystarczalne z rezerwuarami wody',
  },
};

export const BalconyDrawer: React.FC<BalconyDrawerProps> = ({
  isOpen,
  onClose,
  userSpec,
  onOpenFullSetup,
  currentUser,
  onOpenAuth,
}) => {
  // Close drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const regionInfo = POLAND_REGIONS[userSpec.region];
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === userSpec.orientation);
  const orientationDisplay = orientItem ? orientItem.label : userSpec.orientation;
  const floorCategory = getFloorCategoryLabel(userSpec.floor);

  // Microclimate sun icon based on orientation
  const getSunIcon = () => {
    const orient = userSpec.orientation.toUpperCase();
    if (orient.includes('E') && !orient.includes('W') && !orient.includes('S')) {
      return <Sunrise className="w-5 h-5 text-amber-500" />;
    }
    if (orient.includes('W') && !orient.includes('E')) {
      return <Sunset className="w-5 h-5 text-orange-500" />;
    }
    if (orient === 'N' || orient.includes('N')) {
      return <CloudSun className="w-5 h-5 text-sky-500" />;
    }
    return <Sun className="w-5 h-5 text-amber-500" />;
  };

  // Agronomic microclimate insight
  const getMicroclimateSummary = () => {
    const orient = userSpec.orientation.toUpperCase();
    const isHigh = userSpec.floor >= 4;
    const isSouth = orient.includes('S');
    const isNorth = orient === 'N' || orient === 'NE' || orient === 'NW';

    if (isSouth && isHigh) {
      return 'Dużo słońca i silniejsze porywy wiatru. Donice szybciej przesychają – warto wybierać cięższe pojemniki i ściółkować podłoże.';
    }
    if (isSouth) {
      return 'Idealna strefa ciepłolubna – wybitne warunki dla pomidorów, papryk, bakłażanów i aromatycznych ziół śródziemnomorskich.';
    }
    if (isNorth) {
      return 'Łagodny, chłodny mikroklimat bez ryzyka przypalenia liści. Doskonały na sałaty, rzodkiewki, miętę, szczypiorek i poziomki.';
    }
    return 'Zrównoważona ekspozycja – stabilne poranne lub popołudniowe słońce sprzyjające większości warzyw, ziół oraz truskawek.';
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        id="balcony-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/50 dark:bg-black/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        id="balcony-spec-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Parametry Twojego balkonu"
        className="relative w-full max-w-md bg-[#FAF8F5] dark:bg-stone-900 h-full shadow-2xl border-l border-stone-200/90 dark:border-stone-800 z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                <span>Mój balkon</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                  Parametry
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Mikroklimat i warunki uprawowe
              </p>
            </div>
          </div>

          <button
            id="close-balcony-drawer-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            title="Zamknij panel (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Account Sync Status Card */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-2xs">
            {currentUser ? (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>Konto: {currentUser.username}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      Ustawienia przypisane do Twojego profilu
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Tryb gościa (zapisane lokalnie)</span>
                </div>
                {onOpenAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                  >
                    Zapisz na koncie
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Microclimate Advice Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Analiza mikroklimatu Twojego balkonu</span>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {getMicroclimateSummary()}
            </p>
          </div>

          {/* Key Parameters Cards Grid */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
              Główne parametry uprawy
            </div>

            {/* 1. Wystawa słoneczna */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 shrink-0">
                {getSunIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  Wystawa słoneczna (Kierunek)
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>{orientationDisplay}</span>
                  {orientItem?.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                      {orientItem.badge}
                    </span>
                  )}
                </div>
                {orientItem?.desc && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {orientItem.desc}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Piętro i siła wiatru */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 shrink-0 text-sky-700 dark:text-sky-400">
                <Building className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  Kondygnacja i wiatr
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {userSpec.floor === 0 ? 'Parter' : `${userSpec.floor}. piętro`} — {floorCategory}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                  {userSpec.floor >= 7
                    ? 'Strefa silnego wiatru. Wskazane solidne mocowanie skrzynek i donice o szerokiej podstawie.'
                    : userSpec.floor >= 4
                    ? 'Umiarkowanie wysoka ekspozycja wiatrowa.'
                    : 'Spokojny mikroklimat przyziemny z osłoną sąsiednich zabudowań.'}
                </p>
              </div>
            </div>

            {/* 3. Województwo i strefa mrozowa */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0 text-emerald-700 dark:text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  Lokalizacja i strefa USDA
                </div>
                <div className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {regionInfo ? regionInfo.name.split('(')[0].trim() : 'Polska'}
                  {regionInfo?.zone && (
                    <span className="ml-2 text-xs font-normal text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Strefa {regionInfo.zone}
                    </span>
                  )}
                </div>
                {regionInfo?.climate_notes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    {regionInfo.climate_notes}
                  </p>
                )}
              </div>
            </div>

            {/* 4. Typ balkonu i Zadaszenie */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
                  <Shield className="w-3.5 h-3.5 text-stone-500" />
                  <span>Konstrukcja</span>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {BALCONY_TYPE_LABELS[userSpec.balcony_type]?.label || userSpec.balcony_type}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 dark:text-stone-400 mb-1">
                  <Umbrella className="w-3.5 h-3.5 text-stone-500" />
                  <span>Zadaszenie</span>
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {ROOFING_LABELS[userSpec.roofing]?.label || userSpec.roofing}
                </div>
              </div>
            </div>

            {/* 5. Czas na pielęgnację */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                  Dostępny czas na pielęgnację
                </div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  {CARE_TIME_LABELS[userSpec.care_time]?.label || userSpec.care_time}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with primary action */}
        <div className="p-5 sm:p-6 border-t border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md space-y-2.5">
          <button
            id="drawer-open-full-setup-btn"
            type="button"
            onClick={() => {
              onClose();
              onOpenFullSetup();
            }}
            className="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white rounded-2xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Settings className="w-4 h-4" />
            <span>Zmień parametry balkonu</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Zamknij panel
          </button>
        </div>
      </aside>
    </div>
  );
};
