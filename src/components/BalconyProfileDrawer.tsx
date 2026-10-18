import React, { useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useScrollLock } from '../hooks/useScrollLock';
import {
  X,
  Compass,
  Building,
  MapPin,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Shield,
  Clock,
  Settings,
  Sparkles,
  CheckCircle2,
  Umbrella,
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
import { useLanguage } from '../lib/LanguageContext';

export interface BalconyProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userSpec: UserBalconySpec;
  onOpenFullSetup: () => void;
  onSelectPlants?: () => void;
  onNavigateToPlants?: () => void;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

const BALCONY_TYPE_LABELS_PL: Record<BalconyType, { label: string; desc: string }> = {
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

const BALCONY_TYPE_LABELS_EN: Record<BalconyType, { label: string; desc: string }> = {
  open_rail: {
    label: 'Open Railing',
    desc: 'High airflow and excellent light reaching bottom pots.',
  },
  solid_wall: {
    label: 'Solid Concrete Wall',
    desc: 'Good wind protection, shaded lower zone.',
  },
  loggia: {
    label: 'Recessed Loggia',
    desc: 'Warmest microclimate, walls store and radiate solar warmth.',
  },
  french: {
    label: 'French Balcony',
    desc: 'Compact space for railing planters or windowsill boxes.',
  },
};

const ROOFING_LABELS_PL: Record<RoofingType, { label: string; desc: string }> = {
  covered: {
    label: 'Zadaszony',
    desc: 'Chroni przed gwałtownym gradem i ulewami; wymaga regularnego podlewania.',
  },
  uncovered: {
    label: 'Odkryty',
    desc: 'Maksymalne doświetlenie zenitalne oraz naturalne nawadnianie opadami.',
  },
};

const ROOFING_LABELS_EN: Record<RoofingType, { label: string; desc: string }> = {
  covered: {
    label: 'Covered / Overhang',
    desc: 'Protects from hail and downpours; requires intentional watering.',
  },
  uncovered: {
    label: 'Open / Uncovered',
    desc: 'Maximum overhead sunlight and natural rainwater hydration.',
  },
};

const CARE_TIME_LABELS_PL: Record<CareTime, { label: string; tag: string }> = {
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

const CARE_TIME_LABELS_EN: Record<CareTime, { label: string; tag: string }> = {
  daily: {
    label: 'Daily (10–15 min)',
    tag: 'Demanding crops (tomatoes, eggplants)',
  },
  few_days: {
    label: 'Every 2–3 days',
    tag: 'Balanced herb & vegetable garden',
  },
  weekends: {
    label: 'Mainly on weekends',
    tag: 'Self-sufficient crops with water reservoirs',
  },
};

export const BalconyProfileDrawer: React.FC<BalconyProfileDrawerProps> = ({
  isOpen,
  onClose,
  userSpec,
  onOpenFullSetup,
  onSelectPlants,
  onNavigateToPlants,
  currentUser,
  onOpenAuth,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const balconyTypeLabels = isEn ? BALCONY_TYPE_LABELS_EN : BALCONY_TYPE_LABELS_PL;
  const roofingLabels = isEn ? ROOFING_LABELS_EN : ROOFING_LABELS_PL;
  const careTimeLabels = isEn ? CARE_TIME_LABELS_EN : CARE_TIME_LABELS_PL;

  // Fallback close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when drawer is open
  useScrollLock(isOpen);

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

    if (isEn) {
      if (isSouth && isHigh) {
        return 'Abundant sunshine and strong wind gusts. Pots dry out quickly – choose heavier containers and mulch soil.';
      }
      if (isSouth) {
        return 'Ideal heat-loving zone – exceptional conditions for tomatoes, peppers, eggplants, and Mediterranean herbs.';
      }
      if (isNorth) {
        return 'Gentle, cool microclimate without sun scorch risk. Perfect for lettuces, radishes, mint, chives, and wild strawberries.';
      }
      return 'Balanced exposure – steady morning or afternoon sunlight supporting most vegetables, herbs, and strawberries.';
    }

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

  const handleSelectPlants = () => {
    onClose();
    if (onSelectPlants) {
      onSelectPlants();
    } else if (onNavigateToPlants) {
      onNavigateToPlants();
    }
  };

  const handleOpenFullSetup = () => {
    onClose();
    onOpenFullSetup();
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        {/* Overlay */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in"
          onClick={onClose}
          id="balcony-drawer-backdrop"
          data-testid="balcony-drawer-overlay"
        />

        {/* Drawer Container */}
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300 focus:outline-none"
          id="balcony-spec-drawer"
          data-testid="balcony-spec-drawer"
          aria-label={isEn ? 'Your Balcony Specifications' : 'Parametry Twojego balkonu'}
        >
          {/* Top Header */}
          <div className="p-5 sm:p-6 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <DialogPrimitive.Title asChild>
                  <h2 className="text-base font-bold text-foreground tracking-tight flex items-center gap-2">
                    <span>{isEn ? 'My Balcony' : 'Mój balkon'}</span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
                      {isEn ? 'Settings' : 'Parametry'}
                    </span>
                  </h2>
                </DialogPrimitive.Title>
                <DialogPrimitive.Description asChild>
                  <p className="text-xs text-muted-foreground">
                    {isEn ? 'Microclimate and growing conditions' : 'Mikroklimat i warunki uprawowe'}
                  </p>
                </DialogPrimitive.Description>
              </div>
            </div>

            <DialogPrimitive.Close asChild>
              <button
                id="close-balcony-drawer-btn"
                data-testid="close-balcony-drawer"
                type="button"
                className="hover:bg-accent rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title={isEn ? 'Close panel (Esc)' : 'Zamknij panel (Esc)'}
                aria-label={isEn ? 'Close panel' : 'Zamknij panel'}
              >
                <X className="w-5 h-5" />
              </button>
            </DialogPrimitive.Close>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {/* Account Sync Status Card */}
            <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs">
              {currentUser ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <span>{isEn ? 'Account:' : 'Konto:'} {currentUser.username}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {isEn ? 'Settings linked to your profile' : 'Ustawienia przypisane do Twojego profilu'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{isEn ? 'Guest mode (saved locally)' : 'Tryb gościa (zapisane lokalnie)'}</span>
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
                      {isEn ? 'Save to account' : 'Zapisz na koncie'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Quick Microclimate Advice Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300 mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isEn ? 'Balcony Microclimate Assessment' : 'Analiza mikroklimatu Twojego balkonu'}</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {getMicroclimateSummary()}
              </p>
            </div>

            {/* Key Parameters Cards Grid */}
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {isEn ? 'Primary growing parameters' : 'Główne parametry uprawy'}
              </div>

              {/* 1. Wystawa słoneczna */}
              <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800/60 shrink-0">
                  {getSunIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {isEn ? 'Solar Exposure (Direction)' : 'Wystawa słoneczna (Kierunek)'}
                  </div>
                  <div className="text-sm font-bold text-foreground flex items-center gap-2">
                    <span>{orientationDisplay}</span>
                    {orientItem?.badge && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
                        {orientItem.badge}
                      </span>
                    )}
                  </div>
                  {orientItem?.desc && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {orientItem.desc}
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Piętro i siła wiatru */}
              <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/60 shrink-0 text-sky-700 dark:text-sky-400">
                  <Building className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {isEn ? 'Floor & Wind Exposure' : 'Kondygnacja i wiatr'}
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {userSpec.floor === 0 ? (isEn ? 'Ground floor' : 'Parter') : (isEn ? `Floor ${userSpec.floor}` : `${userSpec.floor}. piętro`)} — {floorCategory}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isEn
                      ? userSpec.floor >= 7
                        ? 'High wind zone. Sturdy planter brackets and heavy base pots recommended.'
                        : userSpec.floor >= 4
                        ? 'Moderately high wind exposure.'
                        : 'Gentle ground microclimate sheltered by surrounding buildings.'
                      : userSpec.floor >= 7
                      ? 'Strefa silnego wiatru. Wskazane solidne mocowanie skrzynek i donice o szerokiej podstawie.'
                      : userSpec.floor >= 4
                      ? 'Umiarkowanie wysoka ekspozycja wiatrowa.'
                      : 'Spokojny mikroklimat przyziemny z osłoną sąsiednich zabudowań.'}
                  </p>
                </div>
              </div>

              {/* 3. Województwo i strefa mrozowa */}
              <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0 text-emerald-700 dark:text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {isEn ? 'Location & Hardiness Zone' : 'Lokalizacja i strefa USDA'}
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {regionInfo ? regionInfo.name.split('(')[0].trim() : (isEn ? 'Poland' : 'Polska')}
                    {regionInfo?.zone && (
                      <span className="ml-2 text-xs font-normal text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {isEn ? 'Zone ' : 'Strefa '}{regionInfo.zone}
                      </span>
                    )}
                  </div>
                  {regionInfo?.climate_notes && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {regionInfo.climate_notes}
                    </p>
                  )}
                </div>
              </div>

              {/* 4. Typ balkonu i Zadaszenie */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{isEn ? 'Structure' : 'Konstrukcja'}</span>
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    {balconyTypeLabels[userSpec.balcony_type]?.label || userSpec.balcony_type}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-card border border-border shadow-2xs">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1">
                    <Umbrella className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{isEn ? 'Roofing' : 'Zadaszenie'}</span>
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    {roofingLabels[userSpec.roofing]?.label || userSpec.roofing}
                  </div>
                </div>
              </div>

              {/* 5. Czas na pielęgnację */}
              <div className="p-3.5 rounded-2xl bg-card border border-border shadow-2xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-medium text-muted-foreground">
                    {isEn ? 'Available care time' : 'Dostępny czas na pielęgnację'}
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    {careTimeLabels[userSpec.care_time]?.label || userSpec.care_time}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Drawer Footer with restructured action buttons */}
          <div className="p-5 sm:p-6 border-t border-border bg-background/90 backdrop-blur-md space-y-2.5">
            <button
              id="drawer-select-plants-btn"
              data-testid="drawer-select-plants"
              type="button"
              onClick={handleSelectPlants}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl shadow-sm transition-all"
            >
              {isEn ? 'Go to plant selection' : 'Przejdź do doboru roślin'}
            </button>

            <button
              id="drawer-open-full-setup-btn"
              data-testid="drawer-open-full-setup"
              type="button"
              onClick={handleOpenFullSetup}
              className="w-full bg-transparent hover:bg-muted text-foreground py-2.5 rounded-xl border border-border text-sm font-medium transition-colors"
            >
              <span className="flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                <span>{isEn ? 'Edit Balcony Settings' : 'Zmień parametry balkonu'}</span>
              </span>
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default BalconyProfileDrawer;
