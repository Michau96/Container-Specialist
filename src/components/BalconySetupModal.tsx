import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Compass,
  Building,
  MapPin,
  Maximize2,
  Shield,
  Clock,
  Check,
  X,
  Sparkles,
  Info,
  HelpCircle,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Search,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Umbrella,
  Wind,
  ChevronDown,
  ChevronUp,
  Fence,
  LayoutGrid,
  List,
  BrickWall,
  DoorOpen,
  CloudRain,
  SunMedium,
  PanelTop,
} from 'lucide-react';
import {
  UserBalconySpec,
  UserAccount,
  PolandRegionKey,
  Orientation,
  BalconyType,
  RoofingType,
  ContainerType,
  CareTime,
} from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS, OrientationOption } from '../lib/api';

interface Props {
  isOpen: boolean;
  initialSpec: UserBalconySpec;
  onSave: (spec: UserBalconySpec) => void;
  onClose?: () => void;
  isFirstTime?: boolean;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

// Visual direction config with clear icons and titles
interface ExposureVisual {
  title: string;
  sub: string;
  icon: React.ReactNode;
  accentColor: string;
}

const EXPOSURE_VISUALS: Record<string, ExposureVisual> = {
  E: {
    title: 'Wschód',
    sub: 'Łagodne słońce o poranku',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  S: {
    title: 'Południe',
    sub: 'Pełne słońce przez cały dzień',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-500 dark:hover:border-amber-400',
  },
  W: {
    title: 'Zachód',
    sub: 'Ciepłe popołudnie i wieczór',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
  N: {
    title: 'Północ',
    sub: 'Kojący cień i chłód',
    icon: <CloudSun className="w-5 h-5 text-sky-500" />,
    accentColor: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  SE: {
    title: 'Południowy Wschód',
    sub: 'Poranek i południe bez upału',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  SW: {
    title: 'Południowy Zachód',
    sub: 'Najcieplejsza, długa wystawa',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
  NE: {
    title: 'Północny Wschód',
    sub: 'Poranny blask, potem cień',
    icon: <Sunrise className="w-5 h-5 text-sky-500" />,
    accentColor: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  NW: {
    title: 'Północny Zachód',
    sub: 'Cień w dzień, słońce pod wieczór',
    icon: <Sunset className="w-5 h-5 text-orange-400" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
};

export interface CharacteristicTrait {
  icon: React.ReactNode;
  label: string;
}

export interface BalconyTypeOption {
  key: BalconyType;
  title: string;
  badge: string;
  badgeColor: string;
  sub: string;
  icon: React.ReactNode;
  cornerIcon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  traits: CharacteristicTrait[];
}

export const BALCONY_TYPE_OPTIONS: BalconyTypeOption[] = [
  {
    key: 'open_rail',
    title: 'Ażurowa barierka (szczeble / metal)',
    badge: 'Szczeble • Przewiew',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    sub: 'Przepuszcza mnóstwo światła na podłogę i zapewnia intensywną cyrkulację powietrza.',
    icon: <Fence className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    cornerIcon: <Wind className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    iconBorder: 'border-emerald-200 dark:border-emerald-800/80',
    traits: [
      { icon: <Sun className="w-3 h-3 text-amber-500" />, label: 'Światło na całej podłodze' },
      { icon: <Wind className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />, label: 'Swobodny przewiew' },
    ],
  },
  {
    key: 'solid_wall',
    title: 'Pełny mur / beton',
    badge: 'Masywna ściana • Osłona',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    sub: 'Skuteczna bariera przeciwwiatrowa. Przy posadzce tworzy zaciszny, chłodniejszy mikroklimat.',
    icon: <BrickWall className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    cornerIcon: <Shield className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/70',
    iconBorder: 'border-indigo-200 dark:border-indigo-800/80',
    traits: [
      { icon: <Shield className="w-3 h-3 text-indigo-500" />, label: 'Osłona przed wiatrem' },
      { icon: <CloudSun className="w-3 h-3 text-stone-500" />, label: 'Cień przy posadzce' },
    ],
  },
  {
    key: 'loggia',
    title: 'Loggia (zabudowane boki)',
    badge: 'Wnęka • 3 ściany',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    sub: 'Zabudowane ściany boczne akumulują ciepło i chronią rośliny przed zacinającym deszczem.',
    icon: <Building className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    cornerIcon: <PanelTop className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />,
    iconBg: 'bg-amber-50 dark:bg-amber-950/70',
    iconBorder: 'border-amber-200 dark:border-amber-800/80',
    traits: [
      { icon: <Building className="w-3 h-3 text-amber-600 dark:text-amber-400" />, label: 'Boczne ściany chronią' },
      { icon: <Sparkles className="w-3 h-3 text-amber-500" />, label: 'Zaciszny mikroklimat' },
    ],
  },
  {
    key: 'french',
    title: 'Balkon francuski',
    badge: 'Portfenetr • Tylko poręcz',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    sub: 'Okno balkonowe z barierką bez podłogi — przeznaczony pod wiszące skrzynki montowane na poręczy.',
    icon: <DoorOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    cornerIcon: <Maximize2 className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" />,
    iconBg: 'bg-sky-50 dark:bg-sky-950/70',
    iconBorder: 'border-sky-200 dark:border-sky-800/80',
    traits: [
      { icon: <DoorOpen className="w-3 h-3 text-sky-500" />, label: 'Brak płyty posadzki' },
      { icon: <Fence className="w-3 h-3 text-sky-500" />, label: 'Skrzynki wiszące' },
    ],
  },
];

export interface RoofingOption {
  key: RoofingType;
  title: string;
  badge: string;
  badgeColor: string;
  sub: string;
  icon: React.ReactNode;
  cornerIcon: React.ReactNode;
  iconBg: string;
  iconBorder: string;
  traits: CharacteristicTrait[];
}

export const ROOFING_OPTIONS: RoofingOption[] = [
  {
    key: 'covered',
    title: 'Balkon zadaszony',
    badge: 'Płyta / Dach',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    sub: 'Płyta balkonu wyżej lub stałe zadaszenie osłania przed ulewą i gradem.',
    icon: <Umbrella className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    cornerIcon: <PanelTop className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />,
    iconBg: 'bg-blue-50 dark:bg-blue-950/70',
    iconBorder: 'border-blue-200 dark:border-blue-800/80',
    traits: [
      { icon: <ShieldCheck className="w-3 h-3 text-blue-500" />, label: 'Ochrona przed ulewą i gradem' },
      { icon: <Umbrella className="w-3 h-3 text-blue-500" />, label: 'Wymaga ręcznego podlewania' },
    ],
  },
  {
    key: 'uncovered',
    title: 'Balkon niezadaszony',
    badge: 'Otwarte niebo',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    sub: 'Brak osłony od góry — swobodny dostęp deszczu oraz maksymalne słońce w zenicie.',
    icon: <SunMedium className="w-5 h-5 text-amber-500" />,
    cornerIcon: <CloudRain className="w-2.5 h-2.5 text-teal-500" />,
    iconBg: 'bg-amber-50/80 dark:bg-amber-950/60',
    iconBorder: 'border-amber-200 dark:border-amber-800/80',
    traits: [
      { icon: <CloudRain className="w-3 h-3 text-teal-500" />, label: 'Swobodne opady deszczu' },
      { icon: <Sun className="w-3 h-3 text-amber-500" />, label: 'Maksimum światła z zenitu' },
    ],
  },
];

export const BalconySetupModal: React.FC<Props> = ({
  isOpen,
  initialSpec,
  onSave,
  onClose,
  isFirstTime = false,
  currentUser = null,
  onOpenAuth,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [spec, setSpec] = useState<UserBalconySpec>(initialSpec);
  const [regionSearch, setRegionSearch] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [exposureFilter, setExposureFilter] = useState<'main' | 'all'>('main');
  const floorSectionRef = useRef<HTMLDivElement>(null);

  const [isBarierkaDropdownOpen, setIsBarierkaDropdownOpen] = useState(false);
  const [isRoofingDropdownOpen, setIsRoofingDropdownOpen] = useState(false);
  const [barierkaViewMode, setBarierkaViewMode] = useState<'dropdown' | 'cards'>('dropdown');
  const [roofingViewMode, setRoofingViewMode] = useState<'dropdown' | 'cards'>('dropdown');

  // Close dropdowns when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown-container="barierka"]')) {
        setIsBarierkaDropdownOpen(false);
      }
      if (!target.closest('[data-dropdown-container="roofing"]')) {
        setIsRoofingDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBarierkaDropdownOpen(false);
        setIsRoofingDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedBarierkaOption =
    BALCONY_TYPE_OPTIONS.find((o) => o.key === spec.balcony_type) || BALCONY_TYPE_OPTIONS[0];
  const selectedRoofingOption =
    ROOFING_OPTIONS.find((o) => o.key === spec.roofing) || ROOFING_OPTIONS[0];

  const [selectedRegion, setSelectedRegion] = useState<PolandRegionKey | null>(
    isFirstTime ? null : initialSpec?.region || null
  );
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
    isFirstTime ? null : (typeof initialSpec?.floor === 'number' ? initialSpec.floor : null)
  );

  useEffect(() => {
    if (isOpen) {
      setSpec(initialSpec);
      setStep(1);
      setActiveTooltip(null);
      setSelectedRegion(isFirstTime ? null : (initialSpec?.region || null));
      setSelectedFloor(isFirstTime ? null : (typeof initialSpec?.floor === 'number' ? initialSpec.floor : null));
    }
  }, [isOpen, initialSpec, isFirstTime]);

  const handleSelectRegion = (regKey: PolandRegionKey) => {
    setSelectedRegion(regKey);
    setSpec((prev) => ({ ...prev, region: regKey }));
    // Smooth scroll to floor section immediately after selecting province
    setTimeout(() => {
      if (floorSectionRef.current) {
        floorSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleSelectFloor = (floorNum: number) => {
    setSelectedFloor(floorNum);
    setSpec((prev) => ({ ...prev, floor: floorNum }));
  };

  const isStep1Valid = selectedRegion !== null && selectedFloor !== null;
  const isStep1Complete = isStep1Valid;
  const isStep2Complete = isStep1Complete && (step >= 2 || !isFirstTime) && Boolean(spec.orientation);
  const isStep3Complete = isStep1Complete && isStep2Complete && spec.pots.length > 0 && Boolean(spec.care_time) && (step === 3 || !isFirstTime);

  const isStepComplete = (stepNum: 1 | 2 | 3): boolean => {
    if (stepNum === 1) return isStep1Complete;
    if (stepNum === 2) return isStep2Complete;
    if (stepNum === 3) return isStep3Complete;
    return false;
  };

  const completedStepsCount = (isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0) + (isStep3Complete ? 1 : 0);
  const progressPercent = Math.round((completedStepsCount / 3) * 100);

  const getStep1InactivityReason = (): string => {
    if (selectedRegion === null && selectedFloor === null) {
      return 'Wybierz województwo oraz piętro swojego balkonu, aby przejść dalej.';
    }
    if (selectedRegion === null) {
      return 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.';
    }
    if (selectedFloor === null) {
      return 'Wybierz piętro, na którym znajduje się Twój balkon, aby przejść dalej.';
    }
    return '';
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-tooltip-container]')) {
        setActiveTooltip(null);
      }
    };
    if (activeTooltip) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeTooltip]);

  const filteredRegions = useMemo(() => {
    const allKeys = Object.keys(POLAND_REGIONS) as PolandRegionKey[];
    return allKeys.filter((regKey) => {
      const reg = POLAND_REGIONS[regKey];
      return (
        reg.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        regKey.toLowerCase().includes(regionSearch.toLowerCase())
      );
    });
  }, [regionSearch]);

  const visibleOrientations = useMemo(() => {
    if (exposureFilter === 'main') {
      return ORIENTATION_OPTIONS.filter((o) => o.group === 'glowne' || o.group === 'posrednie');
    }
    return ORIENTATION_OPTIONS;
  }, [exposureFilter]);

  const togglePot = (pot: ContainerType) => {
    setSpec((prev) => {
      const exists = prev.pots.includes(pot);
      const nextPots = exists ? prev.pots.filter((p) => p !== pot) : [...prev.pots, pot];
      return { ...prev, pots: nextPots };
    });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(spec);
  };

  if (!isOpen) return null;

  const currentRegion = selectedRegion ? POLAND_REGIONS[selectedRegion] : null;
  const currentExposure = ORIENTATION_OPTIONS.find((o) => o.key === spec.orientation);

  return (
    <div
      id="balcony-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="balcony-setup-dialog"
        className="bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden transition-all"
      >
        {/* Top Header & Wizard Stepper */}
        <div className="bg-white dark:bg-stone-950 p-5 sm:p-6 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Kreator Twojego Balkonu</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {step === 1 && 'Gdzie rośnie Twój ogród?'}
                {step === 2 && 'W którą stronę pada słońce?'}
                {step === 3 && 'Twoja przestrzeń i donice'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {step === 1 && 'Dopasujemy rośliny do klimatu w Twojej okolicy i wysokości budynku.'}
                {step === 2 && 'Słońce to klucz do sukcesu – wskaż kierunek, a dobierzemy gatunki, które pokochają to światło.'}
                {step === 3 && 'Określ rodzaj donic i czas, jaki chcesz poświęcić na podlewanie.'}
              </p>
            </div>

            {onClose && !isFirstTime && (
              <button
                id="close-balcony-modal-btn"
                type="button"
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer shrink-0"
                aria-label="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Progress Bar & Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-300">
                <span>Postęp:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {completedStepsCount} z 3 kroków ukończone
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                {progressPercent}%
              </span>
            </div>

            {/* Visual Progress Bar Track */}
            <div className="w-full bg-stone-100 dark:bg-stone-850 h-2 rounded-full overflow-hidden p-0.5 border border-stone-200/70 dark:border-stone-800">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out shadow-xs"
                style={{ width: `${Math.max(10, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="mt-3.5 grid grid-cols-3 gap-2">
            {[
              { num: 1 as const, label: 'Lokalizacja', icon: <MapPin className="w-3.5 h-3.5" /> },
              { num: 2 as const, label: 'Ekspozycja', icon: <Sun className="w-3.5 h-3.5" /> },
              { num: 3 as const, label: 'Donice i opieka', icon: <Maximize2 className="w-3.5 h-3.5" /> },
            ].map((s) => {
              const isActive = step === s.num;
              const isCompleted = isStepComplete(s.num);
              const isDisabledTab = s.num > 1 && step === 1 && !isStep1Valid;

              return (
                <button
                  key={s.num}
                  type="button"
                  id={`wizard-step-tab-${s.num}`}
                  onClick={() => {
                    if (isDisabledTab) return;
                    setStep(s.num);
                  }}
                  title={
                    isDisabledTab
                      ? getStep1InactivityReason()
                      : isCompleted
                      ? `Krok ${s.num}: ${s.label} — Ukończono`
                      : `Krok ${s.num}: ${s.label}`
                  }
                  className={`flex items-center justify-between gap-1.5 py-2 px-2.5 sm:px-3 rounded-2xl text-xs font-semibold transition-all border cursor-pointer ${
                    isActive && isCompleted
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/30'
                      : isActive && !isCompleted
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-800 dark:border-white shadow-sm ring-2 ring-emerald-500/30'
                      : isCompleted
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 shadow-2xs'
                      : isDisabledTab
                      ? 'bg-stone-100 dark:bg-stone-800/40 text-stone-400 dark:text-stone-600 border-stone-200/40 dark:border-stone-800/40 cursor-not-allowed opacity-60'
                      : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-stone-200/70 dark:border-stone-700/60 hover:bg-stone-200/70 dark:hover:bg-stone-750'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    {/* Circle badge with checkmark or number */}
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-transform ${
                        isCompleted
                          ? isActive
                            ? 'bg-white text-emerald-700 shadow-2xs'
                            : 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-2xs'
                          : isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </span>

                    {/* Step Name */}
                    <span className="truncate text-xs font-bold leading-tight">
                      {s.label}
                    </span>
                  </div>

                  {/* Completion indicator checkmark icon next to step name */}
                  {isCompleted ? (
                    <span
                      id={`step-${s.num}-check-indicator`}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-emerald-800/90 text-emerald-100 border border-emerald-600'
                          : 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      }`}
                      title="Krok ukończony"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span className="hidden lg:inline text-[9.5px]">OK</span>
                    </span>
                  ) : isActive ? (
                    <span className="hidden sm:inline-block text-[10px] font-semibold text-stone-300 dark:text-stone-600 shrink-0">
                      W toku
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ================= STEP 1: LOKALIZACJA I PIĘTRO ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Region selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Wybierz swoje województwo lub najbliższe miasto</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Wybrano:{' '}
                    <strong className={currentRegion ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500 font-normal'}>
                      {currentRegion ? currentRegion.name.split('(')[0].trim() : 'Nie wybrano'}
                    </strong>
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="region-search-input"
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    placeholder="Wpisz np. Warszawa, Kraków, Wrocław, Gdańsk, Poznań..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-0.5 scrollbar-none">
                  {filteredRegions.map((regKey) => {
                    const reg = POLAND_REGIONS[regKey];
                    const isSelected = selectedRegion === regKey;
                    return (
                      <button
                        type="button"
                        key={regKey}
                        id={`region-${regKey}`}
                        onClick={() => handleSelectRegion(regKey)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold ring-1.5 ring-emerald-500 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="truncate pr-2">{reg.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Piętro i siła wiatru */}
              <div
                ref={floorSectionRef}
                id="balcony-floor-section"
                className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800 scroll-mt-2"
              >
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Na którym piętrze znajduje się balkon?</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { floor: 0, label: 'Parter', hint: 'Osłonięty, wilgotniej' },
                    { floor: 2, label: 'Piętro 1 – 3', hint: 'Zrównoważone warunki' },
                    { floor: 5, label: 'Piętro 4 – 6', hint: 'Przewiewniej' },
                    { floor: 8, label: 'Piętro 7+', hint: 'Mocniejsze powiewy' },
                  ].map((item) => {
                    const isSelected =
                      selectedFloor !== null &&
                      ((item.floor === 0 && selectedFloor === 0) ||
                        (item.floor === 2 && selectedFloor >= 1 && selectedFloor <= 3) ||
                        (item.floor === 5 && selectedFloor >= 4 && selectedFloor <= 6) ||
                        (item.floor === 8 && selectedFloor >= 7));
                    return (
                      <button
                        type="button"
                        key={item.floor}
                        id={`floor-btn-${item.floor}`}
                        onClick={() => handleSelectFloor(item.floor)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1.5 ring-emerald-500 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="text-sm font-bold">{item.label}</span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400">{item.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status / Requirement Warning Banner */}
              {!isStep1Valid && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/80 flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs shadow-2xs animate-fade-in">
                  <div className="w-7 h-7 rounded-xl bg-amber-200/60 dark:bg-amber-900/60 flex items-center justify-center shrink-0 font-bold text-amber-800 dark:text-amber-300">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-amber-950 dark:text-amber-100">Wymagany wybór miejsca</div>
                    <div className="text-[11px] text-amber-800 dark:text-amber-300/90">{getStep1InactivityReason()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: EKSPOZYCJA (WIZUALNA SIATKA + TOOLTIPY) ================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              {/* Category Filter for Orientation */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kierunek świata</span>
                </span>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setExposureFilter('main')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      exposureFilter === 'main'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Główne (8)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExposureFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      exposureFilter === 'all'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Wszystkie (23)
                  </button>
                </div>
              </div>

              {/* Visual Grid of Exposure Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {visibleOrientations.map((item) => {
                  const isSelected = spec.orientation === item.key;
                  const visual = EXPOSURE_VISUALS[item.key] || {
                    title: item.label.split('(')[0].trim(),
                    sub: item.badge,
                    icon: <Sun className="w-5 h-5 text-amber-500" />,
                    accentColor: 'hover:border-amber-400',
                  };
                  const isTooltipOpen = activeTooltip === item.key;

                  return (
                    <div
                      key={item.key}
                      data-tooltip-container
                      id={`orient-card-${item.key}`}
                      onClick={() => setSpec({ ...spec, orientation: item.key })}
                      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500 shadow-sm'
                          : `border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 ${visual.accentColor} text-stone-800 dark:text-stone-200 shadow-2xs`
                      }`}
                    >
                      {/* Card Top: Icon & Tooltip Trigger [i] */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700/60 flex items-center justify-center shrink-0">
                          {visual.icon}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Tooltip trigger [?] button */}
                          <button
                            type="button"
                            id={`tooltip-trigger-${item.key}`}
                            title="Pokaż szczegółowy opis nasłonecznienia"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(isTooltipOpen ? null : item.key);
                            }}
                            className={`p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/80 transition cursor-pointer ${
                              isTooltipOpen ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/50' : ''
                            }`}
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Title & Clean Badge (Zero wall of text!) */}
                      <div className="mt-3">
                        <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                          {visual.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                            ☀️ {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                          {visual.sub}
                        </p>
                      </div>

                      {/* Floating Sleek Tooltip for Deep Descriptions */}
                      {isTooltipOpen && (
                        <div
                          className="absolute z-30 left-2 right-2 bottom-full mb-2 p-3.5 rounded-xl bg-stone-900 text-white dark:bg-stone-950 dark:border dark:border-stone-700 text-xs shadow-xl animate-fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <strong className="font-bold text-emerald-300">{item.label}</strong>
                            <button
                              type="button"
                              onClick={() => setActiveTooltip(null)}
                              className="text-stone-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-stone-300 text-[11px] leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="mt-2 pt-1.5 border-t border-stone-800 text-[10px] text-stone-400">
                            🌡️ {item.thermal}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected exposure info bar */}
              {currentExposure && (
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Wybrana ekspozycja: <strong className="font-bold text-stone-900 dark:text-stone-100">{currentExposure.label}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                    {currentExposure.sunHours}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: DONICE I OPIEKA ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Barierka (Balustrada) Selection Component */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Typ balustrady (barierka)</span>
                  </label>

                  <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      id="barierka-view-dropdown-btn"
                      onClick={() => setBarierkaViewMode('dropdown')}
                      className={`px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                        barierkaViewMode === 'dropdown'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      <List className="w-3 h-3" />
                      <span>Lista rozwijana</span>
                    </button>
                    <button
                      type="button"
                      id="barierka-view-cards-btn"
                      onClick={() => setBarierkaViewMode('cards')}
                      className={`px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                        barierkaViewMode === 'cards'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      <LayoutGrid className="w-3 h-3" />
                      <span>Karty</span>
                    </button>
                  </div>
                </div>

                {barierkaViewMode === 'dropdown' ? (
                  <div className="relative" data-dropdown-container="barierka">
                    <button
                      type="button"
                      id="balcony-type-select"
                      onClick={() => setIsBarierkaDropdownOpen(!isBarierkaDropdownOpen)}
                      className={`w-full p-3 rounded-2xl border text-left bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                        isBarierkaDropdownOpen
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 pr-2 min-w-0 flex-1">
                        {/* Visual Illustration Badge */}
                        <div className="relative shrink-0 select-none mt-0.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs transition-transform ${selectedBarierkaOption.iconBg} ${selectedBarierkaOption.iconBorder}`}>
                            {selectedBarierkaOption.icon}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                            {selectedBarierkaOption.cornerIcon}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                              {selectedBarierkaOption.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${selectedBarierkaOption.badgeColor}`}>
                              {selectedBarierkaOption.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                            {selectedBarierkaOption.sub}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedBarierkaOption.traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/60 dark:border-stone-700/60 font-medium"
                              >
                                {trait.icon}
                                <span>{trait.label}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700/80 flex items-center justify-center text-stone-600 dark:text-stone-300 shrink-0 ml-2">
                        {isBarierkaDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isBarierkaDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden animate-fade-in divide-y divide-stone-100 dark:divide-stone-800">
                        {/* Dropdown Header */}
                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                            Wybierz typ balustrady
                          </span>
                          <button
                            type="button"
                            id="barierka-dropdown-close-btn"
                            onClick={() => setIsBarierkaDropdownOpen(false)}
                            className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
                            title="Zamknij listę"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Dropdown Options */}
                        <div className="p-2 space-y-2 overflow-y-auto max-h-[28rem]">
                          {BALCONY_TYPE_OPTIONS.map((opt) => {
                            const isSelected = spec.balcony_type === opt.key;
                            return (
                              <button
                                type="button"
                                key={opt.key}
                                id={`barierka-opt-${opt.key}`}
                                onClick={() => {
                                  setSpec({ ...spec, balcony_type: opt.key });
                                  setIsBarierkaDropdownOpen(false);
                                }}
                                className={`w-full p-3 rounded-xl text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-semibold border border-emerald-300 dark:border-emerald-700 shadow-2xs'
                                    : 'hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-800 dark:text-stone-200 border border-stone-200/40 dark:border-stone-800/40'
                                }`}
                              >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                  {/* Visual Illustration Badge */}
                                  <div className="relative shrink-0 select-none mt-0.5">
                                    <div
                                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${opt.iconBg} ${opt.iconBorder} ${
                                        isSelected ? 'ring-2 ring-emerald-500/50 scale-[1.03]' : ''
                                      }`}
                                    >
                                      {opt.icon}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                                      {opt.cornerIcon}
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                                        {opt.title}
                                      </span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                                        {opt.badge}
                                      </span>
                                    </div>
                                    <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-normal mt-1 leading-snug break-words">
                                      {opt.sub}
                                    </div>
                                    {/* Visual Characteristic Mini-Pills */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {opt.traits.map((trait, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/70 dark:border-stone-700/70 font-medium"
                                        >
                                          {trait.icon}
                                          <span>{trait.label}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="shrink-0 mt-1">
                                  {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-600" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Dropdown Footer */}
                        <div className="px-3.5 py-2.5 bg-stone-50/60 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                            Kliknięcie opcji automatycznie zatwierdza wybór
                          </span>
                          <button
                            type="button"
                            id="barierka-dropdown-done-btn"
                            onClick={() => setIsBarierkaDropdownOpen(false)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>Gotowe</span>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {BALCONY_TYPE_OPTIONS.map((opt) => {
                      const isSelected = spec.balcony_type === opt.key;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          id={`barierka-card-${opt.key}`}
                          onClick={() => setSpec({ ...spec, balcony_type: opt.key })}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1.5 ring-emerald-500 shadow-xs font-semibold'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <div className="relative shrink-0 select-none mt-0.5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs ${opt.iconBg} ${opt.iconBorder}`}>
                              {opt.icon}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                              {opt.cornerIcon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug break-words">{opt.title}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>{opt.badge}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug break-words">{opt.sub}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opt.traits.map((trait, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 text-[10px]"
                                >
                                  {trait.icon}
                                  <span>{trait.label}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Zadaszenie Selection Component */}
              <div className="space-y-3 pt-3 border-t border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <Umbrella className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Zadaszenie balkonu</span>
                  </label>

                  <div className="flex items-center gap-1 bg-stone-200/60 dark:bg-stone-800 p-0.5 rounded-lg text-[11px]">
                    <button
                      type="button"
                      id="roofing-view-dropdown-btn"
                      onClick={() => setRoofingViewMode('dropdown')}
                      className={`px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                        roofingViewMode === 'dropdown'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      <List className="w-3 h-3" />
                      <span>Lista rozwijana</span>
                    </button>
                    <button
                      type="button"
                      id="roofing-view-cards-btn"
                      onClick={() => setRoofingViewMode('cards')}
                      className={`px-2 py-0.5 rounded-md font-medium transition flex items-center gap-1 cursor-pointer ${
                        roofingViewMode === 'cards'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-semibold'
                          : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
                      }`}
                    >
                      <LayoutGrid className="w-3 h-3" />
                      <span>Karty</span>
                    </button>
                  </div>
                </div>

                {roofingViewMode === 'dropdown' ? (
                  <div className="relative" data-dropdown-container="roofing">
                    <button
                      type="button"
                      id="balcony-roofing-select"
                      onClick={() => setIsRoofingDropdownOpen(!isRoofingDropdownOpen)}
                      className={`w-full p-3 rounded-2xl border text-left bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                        isRoofingDropdownOpen
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 pr-2 min-w-0 flex-1">
                        {/* Visual Illustration Badge */}
                        <div className="relative shrink-0 select-none mt-0.5">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs transition-transform ${selectedRoofingOption.iconBg} ${selectedRoofingOption.iconBorder}`}>
                            {selectedRoofingOption.icon}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                            {selectedRoofingOption.cornerIcon}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                              {selectedRoofingOption.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${selectedRoofingOption.badgeColor}`}>
                              {selectedRoofingOption.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                            {selectedRoofingOption.sub}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedRoofingOption.traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/60 dark:border-stone-700/60 font-medium"
                              >
                                {trait.icon}
                                <span>{trait.label}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700/80 flex items-center justify-center text-stone-600 dark:text-stone-300 shrink-0 ml-2">
                        {isRoofingDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isRoofingDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xl overflow-hidden animate-fade-in divide-y divide-stone-100 dark:divide-stone-800">
                        {/* Dropdown Header */}
                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                            Wybierz zadaszenie
                          </span>
                          <button
                            type="button"
                            id="roofing-dropdown-close-btn"
                            onClick={() => setIsRoofingDropdownOpen(false)}
                            className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
                            title="Zamknij listę"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Dropdown Options */}
                        <div className="p-2 space-y-2 overflow-y-auto max-h-[28rem]">
                          {ROOFING_OPTIONS.map((opt) => {
                            const isSelected = spec.roofing === opt.key;
                            return (
                              <button
                                type="button"
                                key={opt.key}
                                id={`roofing-opt-${opt.key}`}
                                onClick={() => {
                                  setSpec({ ...spec, roofing: opt.key });
                                  setIsRoofingDropdownOpen(false);
                                }}
                                className={`w-full p-3 rounded-xl text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'bg-emerald-50/90 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-semibold border border-emerald-300 dark:border-emerald-700 shadow-2xs'
                                    : 'hover:bg-stone-100 dark:hover:bg-stone-800/80 text-stone-800 dark:text-stone-200 border border-stone-200/40 dark:border-stone-800/40'
                                }`}
                              >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                  {/* Visual Illustration Badge */}
                                  <div className="relative shrink-0 select-none mt-0.5">
                                    <div
                                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${opt.iconBg} ${opt.iconBorder} ${
                                        isSelected ? 'ring-2 ring-emerald-500/50 scale-[1.03]' : ''
                                      }`}
                                    >
                                      {opt.icon}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                                      {opt.cornerIcon}
                                    </div>
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                                        {opt.title}
                                      </span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                                        {opt.badge}
                                      </span>
                                    </div>
                                    <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-normal mt-1 leading-snug break-words">
                                      {opt.sub}
                                    </div>
                                    {/* Visual Characteristic Mini-Pills */}
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {opt.traits.map((trait, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/70 dark:border-stone-700/70 font-medium"
                                        >
                                          {trait.icon}
                                          <span>{trait.label}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="shrink-0 mt-1">
                                  {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border border-stone-300 dark:border-stone-600" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Dropdown Footer */}
                        <div className="px-3.5 py-2.5 bg-stone-50/60 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                            Kliknięcie opcji automatycznie zatwierdza wybór
                          </span>
                          <button
                            type="button"
                            id="roofing-dropdown-done-btn"
                            onClick={() => setIsRoofingDropdownOpen(false)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>Gotowe</span>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROOFING_OPTIONS.map((opt) => {
                      const isSelected = spec.roofing === opt.key;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          id={`roofing-card-${opt.key}`}
                          onClick={() => setSpec({ ...spec, roofing: opt.key })}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1.5 ring-emerald-500 shadow-xs font-semibold'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          <div className="relative shrink-0 select-none mt-0.5">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-2xs ${opt.iconBg} ${opt.iconBorder}`}>
                              {opt.icon}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs">
                              {opt.cornerIcon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug break-words">{opt.title}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>{opt.badge}</span>
                              </div>
                              {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug break-words">{opt.sub}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opt.traits.map((trait, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 text-[10px]"
                                >
                                  {trait.icon}
                                  <span>{trait.label}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dostępne donice */}
              <div className="space-y-3 pt-3 border-t border-stone-200/80 dark:border-stone-800">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Jakie donice masz lub planujesz?</span>
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                    Wybór wielokrotny
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  Zaznacz <span className="font-semibold text-stone-700 dark:text-stone-300">wszystkie rodzaje pojemników</span>, którymi dysponujesz lub które planujesz użyć (możesz wybrać kilka opcji):
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'boxes_balcony_15cm',
                      label: 'Skrzynki balkonowe (głęb. 15 cm)',
                      sub: 'Sałaty, rzodkiewki, zioła, szczypiorek',
                    },
                    {
                      id: 'pots_medium_5_15',
                      label: 'Średnie donice (5 – 12 litrów)',
                      sub: 'Papryczki chili, truskawki, burak liściowy',
                    },
                    {
                      id: 'pots_large_15_30',
                      label: 'Duże donice / wiadra (15 – 30L)',
                      sub: 'Pomidory koktajlowe, ogórki krzaczaste',
                    },
                    {
                      id: 'grow_bags',
                      label: 'Worki z tkaniny uprawowej',
                      sub: 'Idealne napowietrzanie korzeni',
                    },
                  ].map((item) => {
                    const isSelected = spec.pots.includes(item.id as ContainerType);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`pot-type-${item.id}`}
                        onClick={() => togglePot(item.id as ContainerType)}
                        className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer active:scale-[0.98] ${
                          isSelected
                            ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20 shadow-xs font-semibold'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:bg-stone-50/80 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center shrink-0 transition-all duration-150 ${
                            isSelected
                              ? 'bg-emerald-600 dark:bg-emerald-500 border border-emerald-600 text-white shadow-2xs'
                              : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-emerald-950 dark:text-emerald-100' : 'text-stone-900 dark:text-stone-100'}`}>
                              {item.label}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0 bg-emerald-100/80 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded-md">
                                Wybrano
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug font-normal">
                            {item.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Czas na podlewanie */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ile masz czasu na podlewanie?</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Codziennie', sub: 'Mogę rano i wieczorem' },
                    { id: 'few_days', label: 'Co 2–3 dni', sub: 'Zrównoważona opieka' },
                    { id: 'weekends', label: 'Głównie weekendy', sub: 'Rośliny odporne na suszę' },
                  ].map((item) => {
                    const isSelected = spec.care_time === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`care-time-${item.id}`}
                        onClick={() => setSpec({ ...spec, care_time: item.id as CareTime })}
                        className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold ring-1.5 ring-emerald-500 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= BOTTOM BAR WITH "DALEJ" / "ZAPISZ I PRZELICZ" ================= */}
        <div className="p-4 sm:p-5 bg-white dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
            {step > 1 ? (
              <button
                type="button"
                id="wizard-prev-step-btn"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Wstecz</span>
              </button>
            ) : onClose && !isFirstTime ? (
              <button
                type="button"
                id="cancel-setup-btn"
                onClick={onClose}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Anuluj
              </button>
            ) : null}

            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span>Krok {step} z 3</span>
              {completedStepsCount > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Ukończono {completedStepsCount}/3</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            {step < 3 ? (
              <div
                className="relative group w-full sm:w-auto"
                onClick={() => {
                  if (step === 1 && !isStep1Valid) {
                    setActiveTooltip(activeTooltip === 'next-btn' ? null : 'next-btn');
                  }
                }}
              >
                <button
                  type="button"
                  id="wizard-next-step-btn"
                  aria-disabled={step === 1 && !isStep1Valid}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (step === 1 && !isStep1Valid) {
                      setActiveTooltip(activeTooltip === 'next-btn' ? null : 'next-btn');
                      return;
                    }
                    setStep((s) => (s + 1) as 1 | 2 | 3);
                  }}
                  className={`w-full sm:w-auto px-7 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    step === 1 && !isStep1Valid
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700 cursor-not-allowed opacity-70'
                      : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white shadow-md hover:shadow-lg ring-1 ring-emerald-600'
                  }`}
                >
                  <span>Dalej</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {step === 1 && !isStep1Valid && (
                  <div
                    className={`absolute bottom-full mb-2 right-0 w-64 p-2.5 bg-stone-900 dark:bg-stone-800 text-white text-xs rounded-xl shadow-xl pointer-events-none transition-opacity duration-200 z-50 text-center font-medium border border-stone-700 ${
                      activeTooltip === 'next-btn' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 justify-center">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{getStep1InactivityReason()}</span>
                    </div>
                    <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-800" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto gap-1.5">
                <div
                  className="relative group w-full sm:w-auto"
                  data-tooltip-container="save-btn"
                >
                  <button
                    type="button"
                    id="save-balcony-spec-btn"
                    onClick={() => handleSave()}
                    className="w-full sm:w-auto px-7 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ring-1 ring-emerald-600"
                    aria-describedby="save-balcony-benefit-text"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-200" />
                    <span>Zapisz i przelicz</span>
                  </button>

                  {/* Tooltip on hover/focus */}
                  <div
                    role="tooltip"
                    id="save-balcony-tooltip"
                    className="absolute bottom-full mb-2.5 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 w-72 sm:w-80 p-3 bg-stone-900 dark:bg-stone-850 text-white text-xs rounded-xl shadow-xl pointer-events-none transition-all duration-200 z-50 text-left border border-stone-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs mb-1">
                          Co zyskasz po zapisaniu?
                        </div>
                        <div className="text-stone-300 text-[11px] leading-relaxed">
                          Otrzymasz spersonalizowany dobór roślin dopasowanych do Twojej wystawy i piętra, precyzyjne receptury podłoży oraz kalkulator pojemności donic.
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-full right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-8 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-850" />
                  </div>
                </div>

                {/* Short descriptive benefit text below the button */}
                <p
                  id="save-balcony-benefit-text"
                  className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5 text-center sm:text-right font-medium max-w-xs sm:max-w-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 inline" />
                  <span>
                    Zapisz konfigurację i zobacz spersonalizowane rekomendacje roślin
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
