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
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
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
  titleEn: string;
  sub: string;
  subEn: string;
  icon: React.ReactNode;
  accentColor: string;
}

const EXPOSURE_VISUALS: Record<string, ExposureVisual> = {
  E: {
    title: 'Wschód',
    titleEn: 'East (E)',
    sub: 'Łagodne słońce o poranku',
    subEn: 'Gentle morning sun',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  S: {
    title: 'Południe',
    titleEn: 'South (S)',
    sub: 'Pełne słońce przez cały dzień',
    subEn: 'Full sun all day',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-500 dark:hover:border-amber-400',
  },
  W: {
    title: 'Zachód',
    titleEn: 'West (W)',
    sub: 'Ciepłe popołudnie i wieczór',
    subEn: 'Warm afternoon and evening',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
  N: {
    title: 'Północ',
    titleEn: 'North (N)',
    sub: 'Kojący cień i chłód',
    subEn: 'Soothing shade and coolness',
    icon: <CloudSun className="w-5 h-5 text-sky-500" />,
    accentColor: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  SE: {
    title: 'Południowy Wschód',
    titleEn: 'South-East (SE)',
    sub: 'Poranek i południe bez upału',
    subEn: 'Morning & midday without scorching heat',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  SW: {
    title: 'Południowy Zachód',
    titleEn: 'South-West (SW)',
    sub: 'Najcieplejsza, długa wystawa',
    subEn: 'Warmest, long afternoon exposure',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
  NE: {
    title: 'Północny Wschód',
    titleEn: 'North-East (NE)',
    sub: 'Poranny blask, potem cień',
    subEn: 'Morning glow, afternoon shade',
    icon: <Sunrise className="w-5 h-5 text-sky-500" />,
    accentColor: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  NW: {
    title: 'Północny Zachód',
    titleEn: 'North-West (NW)',
    sub: 'Cień w dzień, słońce pod wieczór',
    subEn: 'Daytime shade, late afternoon sun',
    icon: <Sunset className="w-5 h-5 text-orange-400" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
};

export interface CharacteristicTrait {
  icon: React.ReactNode;
  label: string;
  labelEn: string;
}

export interface BalconyTypeOption {
  key: BalconyType;
  title: string;
  titleEn: string;
  badge: string;
  badgeEn: string;
  badgeColor: string;
  sub: string;
  subEn: string;
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
    titleEn: 'Open Railing (bars / metal mesh)',
    badge: 'Szczeble • Przewiew',
    badgeEn: 'Open Bars • Airy',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    sub: 'Przepuszcza mnóstwo światła na podłogę i zapewnia intensywną cyrkulację powietrza.',
    subEn: 'Allows maximum light onto the floor and provides strong air circulation.',
    icon: <Fence className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    cornerIcon: <Wind className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/70',
    iconBorder: 'border-emerald-200 dark:border-emerald-800/80',
    traits: [
      { icon: <Sun className="w-3 h-3 text-amber-500" />, label: 'Światło na całej podłodze', labelEn: 'Full floor lighting' },
      { icon: <Wind className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />, label: 'Swobodny przewiew', labelEn: 'Breezy airflow' },
    ],
  },
  {
    key: 'solid_wall',
    title: 'Pełny mur / beton',
    titleEn: 'Solid Wall / Concrete / Glass',
    badge: 'Masywna ściana • Osłona',
    badgeEn: 'Solid Wall • Shielded',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    sub: 'Skuteczna bariera przeciwwiatrowa. Przy posadzce tworzy zaciszny, chłodniejszy mikroklimat.',
    subEn: 'Effective wind barrier. Creates a sheltered microclimate near the floor.',
    icon: <BrickWall className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    cornerIcon: <Shield className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />,
    iconBg: 'bg-indigo-50 dark:bg-indigo-950/70',
    iconBorder: 'border-indigo-200 dark:border-indigo-800/80',
    traits: [
      { icon: <Shield className="w-3 h-3 text-indigo-500" />, label: 'Osłona przed wiatrem', labelEn: 'Wind protection' },
      { icon: <CloudSun className="w-3 h-3 text-stone-500" />, label: 'Cień przy posadzce', labelEn: 'Floor-level shade' },
    ],
  },
  {
    key: 'loggia',
    title: 'Loggia (zabudowane boki)',
    titleEn: 'Loggia (recessed balcony with 3 walls)',
    badge: 'Wnęka • 3 ściany',
    badgeEn: 'Recessed • 3 Walls',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    sub: 'Zabudowane ściany boczne akumulują ciepło i chronią rośliny przed zacinającym deszczem.',
    subEn: 'Side walls store heat and protect crops against diagonal driving rain.',
    icon: <Building className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    cornerIcon: <PanelTop className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />,
    iconBg: 'bg-amber-50 dark:bg-amber-950/70',
    iconBorder: 'border-amber-200 dark:border-amber-800/80',
    traits: [
      { icon: <Building className="w-3 h-3 text-amber-600 dark:text-amber-400" />, label: 'Boczne ściany chronią', labelEn: 'Side walls shelter' },
      { icon: <Sparkles className="w-3 h-3 text-amber-500" />, label: 'Zaciszny mikroklimat', labelEn: 'Warm microclimate' },
    ],
  },
  {
    key: 'french',
    title: 'Balkon francuski',
    titleEn: 'French Balcony (railing without floor slab)',
    badge: 'Portfenetr • Tylko poręcz',
    badgeEn: 'Juliette • Railing Only',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    sub: 'Okno balkonowe z barierką bez podłogi — przeznaczony pod wiszące skrzynki montowane na poręczy.',
    subEn: 'Door window with railing and no floor plate — ideal for hanging boxes mounted on rail.',
    icon: <DoorOpen className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
    cornerIcon: <Maximize2 className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" />,
    iconBg: 'bg-sky-50 dark:bg-sky-950/70',
    iconBorder: 'border-sky-200 dark:border-sky-800/80',
    traits: [
      { icon: <DoorOpen className="w-3 h-3 text-sky-500" />, label: 'Brak płyty posadzki', labelEn: 'No floor slab' },
      { icon: <Fence className="w-3 h-3 text-sky-500" />, label: 'Skrzynki wiszące', labelEn: 'Hanging railing boxes' },
    ],
  },
];

export interface RoofingOption {
  key: RoofingType;
  title: string;
  titleEn: string;
  badge: string;
  badgeEn: string;
  badgeColor: string;
  sub: string;
  subEn: string;
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
    titleEn: 'Covered Balcony (overhanging slab/roof)',
    badge: 'Płyta / Dach',
    badgeEn: 'Overhang / Roof',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    sub: 'Płyta balkonu wyżej lub stałe zadaszenie osłania przed ulewą i gradem.',
    subEn: 'Overhanging upper balcony slab shields crops from torrential downpours and hail.',
    icon: <Umbrella className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    cornerIcon: <PanelTop className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />,
    iconBg: 'bg-blue-50 dark:bg-blue-950/70',
    iconBorder: 'border-blue-200 dark:border-blue-800/80',
    traits: [
      { icon: <ShieldCheck className="w-3 h-3 text-blue-500" />, label: 'Ochrona przed ulewą i gradem', labelEn: 'Downpour & hail shield' },
      { icon: <Umbrella className="w-3 h-3 text-blue-500" />, label: 'Wymaga ręcznego podlewania', labelEn: 'Requires manual watering' },
    ],
  },
  {
    key: 'uncovered',
    title: 'Balkon niezadaszony',
    titleEn: 'Uncovered Balcony (open sky)',
    badge: 'Otwarte niebo',
    badgeEn: 'Open Sky',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    sub: 'Brak osłony od góry — swobodny dostęp deszczu oraz maksymalne słońce w zenicie.',
    subEn: 'No roof barrier — unobstructed natural rain hydration and zenith sunlight.',
    icon: <SunMedium className="w-5 h-5 text-amber-500" />,
    cornerIcon: <CloudRain className="w-2.5 h-2.5 text-teal-500" />,
    iconBg: 'bg-amber-50/80 dark:bg-amber-950/60',
    iconBorder: 'border-amber-200 dark:border-amber-800/80',
    traits: [
      { icon: <CloudRain className="w-3 h-3 text-teal-500" />, label: 'Swobodne opady deszczu', labelEn: 'Direct rainfall hydration' },
      { icon: <Sun className="w-3 h-3 text-amber-500" />, label: 'Maksimum światła z zenitu', labelEn: 'Maximum overhead sunlight' },
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
  const { language, t } = useLanguage();
  const isEn = language === 'en';
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
  const [selectedOrientation, setSelectedOrientation] = useState<Orientation | null>(
    isFirstTime ? null : initialSpec?.orientation || null
  );

  useEffect(() => {
    if (isOpen) {
      setSpec(initialSpec);
      setStep(1);
      setActiveTooltip(null);
      setSelectedRegion(isFirstTime ? null : (initialSpec?.region || null));
      setSelectedFloor(isFirstTime ? null : (typeof initialSpec?.floor === 'number' ? initialSpec.floor : null));
      setSelectedOrientation(isFirstTime ? null : (initialSpec?.orientation || null));
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

  const handleSelectOrientation = (orientKey: Orientation) => {
    setSelectedOrientation(orientKey);
    setSpec((prev) => ({ ...prev, orientation: orientKey }));
  };

  const isStep1Valid = selectedRegion !== null && selectedFloor !== null;
  const isStep2Valid = selectedOrientation !== null;
  const isStep1Complete = isStep1Valid;
  const isStep2Complete = isStep1Complete && isStep2Valid;
  const isStep3Complete = isStep1Complete && isStep2Complete && spec.pots.length > 0 && Boolean(spec.care_time);

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
      return isEn
        ? 'Please select both province/city and floor to proceed.'
        : 'Wybierz województwo oraz piętro swojego balkonu, aby przejść dalej.';
    }
    if (selectedRegion === null) {
      return isEn
        ? 'Please select your balcony location (province/city) to proceed.'
        : 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.';
    }
    if (selectedFloor === null) {
      return isEn
        ? 'Please select the floor of your balcony to proceed.'
        : 'Wybierz piętro, na którym znajduje się Twój balkon, aby przejść dalej.';
    }
    return '';
  };

  const getStep2InactivityReason = (): string => {
    if (selectedOrientation === null) {
      return isEn
        ? 'Please select the sun exposure / orientation of your balcony to proceed.'
        : 'Wybierz kierunek świata (ekspozycję) swojego balkonu, aby przejść dalej.';
    }
    return '';
  };

  const isNextDisabled =
    (step === 1 && !isStep1Valid) ||
    (step === 2 && !isStep2Valid);

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
                <span>{isEn ? 'Balcony Setup Wizard' : 'Kreator Twojego Balkonu'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {step === 1 && (isEn ? 'Where is your balcony garden?' : 'Gdzie rośnie Twój ogród?')}
                {step === 2 && (isEn ? 'Which direction does the sun face?' : 'W którą stronę pada słońce?')}
                {step === 3 && (isEn ? 'Containers & care time' : 'Twoja przestrzeń i donice')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {step === 1 && (isEn ? 'We tailor plants to your local microclimate and building height.' : 'Dopasujemy rośliny do klimatu w Twojej okolicy i wysokości budynku.')}
                {step === 2 && (isEn ? 'Sunlight is key — indicate orientation to get crops that thrive in this light.' : 'Słońce to klucz do sukcesu – wskaż kierunek, a dobierzemy gatunki, które pokochają to światło.')}
                {step === 3 && (isEn ? 'Specify container types and how often you can water your balcony pots.' : 'Określ rodzaj donic i czas, jaki chcesz poświęcić na podlewanie.')}
              </p>
            </div>

            {onClose && !isFirstTime && (
              <button
                id="close-balcony-modal-btn"
                type="button"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
                aria-label={isEn ? 'Close' : 'Zamknij'}
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Stepper Progress Bar & Info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-300">
                <span>{isEn ? 'Progress:' : 'Postęp:'}</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  {isEn ? `${completedStepsCount} of 3 steps completed` : `${completedStepsCount} z 3 kroków ukończone`}
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
          <div className="mt-3.5 grid grid-cols-3 gap-2" role="tablist" aria-label={isEn ? 'Balcony setup steps' : 'Kroki konfiguracji balkonu'}>
            {[
              {
                num: 1 as const,
                label: isEn ? 'Location' : 'Lokalizacja',
                icon: <MapPin className="w-3.5 h-3.5" />,
              },
              {
                num: 2 as const,
                label: isEn ? 'Exposure' : 'Ekspozycja',
                icon: <Sun className="w-3.5 h-3.5" />,
              },
              {
                num: 3 as const,
                label: isEn ? 'Pots & care' : 'Donice i opieka',
                icon: <Maximize2 className="w-3.5 h-3.5" />,
              },
            ].map((s) => {
              const isActive = step === s.num;
              const isCompleted = isStepComplete(s.num);
              const isDisabledTab =
                (s.num === 2 && !isStep1Valid) ||
                (s.num === 3 && (!isStep1Valid || !isStep2Valid));

              return (
                <button
                  key={s.num}
                  type="button"
                  id={`wizard-step-tab-${s.num}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    if (isDisabledTab) return;
                    setStep(s.num);
                  }}
                  title={
                    isDisabledTab
                      ? (s.num === 2 ? getStep1InactivityReason() : (!isStep1Valid ? getStep1InactivityReason() : getStep2InactivityReason()))
                      : isCompleted
                      ? (isEn ? `Step ${s.num}: ${s.label} — Completed` : `Krok ${s.num}: ${s.label} — Ukończono`)
                      : (isEn ? `Step ${s.num}: ${s.label}` : `Krok ${s.num}: ${s.label}`)
                  }
                  className={`flex items-center justify-between gap-1.5 py-2.5 px-2.5 sm:px-3 rounded-2xl text-xs font-semibold transition-all border cursor-pointer ${
                    isCompleted && isActive
                      ? 'bg-emerald-700 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/40'
                      : isCompleted && !isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700/80 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 shadow-xs'
                      : isActive && !isCompleted
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-800 dark:border-white shadow-sm ring-2 ring-emerald-500/30'
                      : isDisabledTab
                      ? 'bg-stone-100 dark:bg-stone-800/40 text-stone-400 dark:text-stone-600 border-stone-200/40 dark:border-stone-800/40 cursor-not-allowed opacity-60'
                      : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 border-stone-200/70 dark:border-stone-750 hover:bg-stone-200/70 dark:hover:bg-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-transform ${
                        isCompleted
                          ? isActive
                            ? 'bg-white text-emerald-700 shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : isActive
                          ? 'bg-emerald-500 text-white'
                          : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                    </span>

                    <span className="truncate text-xs font-bold leading-tight">
                      {s.label}
                    </span>
                  </div>

                  {isCompleted ? (
                    <span
                      id={`step-${s.num}-check-indicator`}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-emerald-800/90 text-emerald-100 border border-emerald-600 shadow-2xs'
                          : 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs'
                      }`}
                      title={isEn ? 'Step completed' : 'Krok ukończony'}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400 stroke-[2.5]" />
                      <span className="text-[9.5px]">
                        {isEn ? 'Done' : 'Gotowe'}
                      </span>
                    </span>
                  ) : isActive ? (
                    <span className="hidden sm:inline-block text-[10px] font-semibold text-stone-400 dark:text-stone-500 shrink-0">
                      {isEn ? 'Active' : 'W trakcie'}
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
                    <span>{isEn ? 'Select your province or nearest city' : 'Wybierz swoje województwo lub najbliższe miasto'}</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    {isEn ? 'Selected: ' : 'Wybrano: '}
                    <strong className={currentRegion ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500 font-normal'}>
                      {currentRegion ? currentRegion.name.split('(')[0].trim() : (isEn ? 'None' : 'Nie wybrano')}
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
                    placeholder={isEn ? 'Search city or region, e.g. Warsaw, Krakow, Wroclaw, Gdansk...' : 'Wpisz np. Warszawa, Kraków, Wrocław, Gdańsk, Poznań...'}
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
                        className={`group p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 font-bold shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="truncate pr-2">{reg.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-300 font-bold bg-blue-100/90 dark:bg-blue-900/70 px-2 py-0.5 rounded-md">
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[3]" />
                              <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </span>
                          ) : (
                            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
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
                  <span>{isEn ? 'Which floor is your balcony located on?' : 'Na którym piętrze znajduje się balkon?'}</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { floor: 0, label: isEn ? 'Ground floor' : 'Parter', hint: isEn ? 'Sheltered, higher humidity' : 'Osłonięty, wilgotniej' },
                    { floor: 2, label: isEn ? 'Floor 1 – 3' : 'Piętro 1 – 3', hint: isEn ? 'Balanced conditions' : 'Zrównoważone warunki' },
                    { floor: 5, label: isEn ? 'Floor 4 – 6' : 'Piętro 4 – 6', hint: isEn ? 'Breezier microclimate' : 'Przewiewniej' },
                    { floor: 8, label: isEn ? 'Floor 7+' : 'Piętro 7+', hint: isEn ? 'Strong wind gusts' : 'Mocniejsze powiewy' },
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
                        className={`group p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 shadow-xs font-bold'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold">{item.label}</span>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 self-start text-left">{item.hint}</span>
                        <div className="w-full pt-1 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[10px]">
                          <span className={isSelected ? 'text-blue-700 dark:text-blue-300 font-semibold' : 'text-stone-400 group-hover:text-blue-800'}>
                            {isSelected ? (isEn ? 'Selected floor' : 'Wybrane piętro') : (isEn ? 'Select' : 'Wybierz')}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform'}`} />
                        </div>
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
                    <div className="font-semibold text-amber-950 dark:text-amber-100">
                      {isEn ? 'Location and floor selection required' : 'Wymagany wybór miejsca'}
                    </div>
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
                  <span>{isEn ? 'Compass orientation' : 'Kierunek świata'}</span>
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
                    {isEn ? 'Main (8)' : 'Główne (8)'}
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
                    {isEn ? 'All (23)' : 'Wszystkie (23)'}
                  </button>
                </div>
              </div>

              {/* Visual Grid of Exposure Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {visibleOrientations.map((item) => {
                  const isSelected = selectedOrientation === item.key;
                  const visual = EXPOSURE_VISUALS[item.key] || {
                    title: item.label.split('(')[0].trim(),
                    titleEn: item.label.split('(')[0].trim(),
                    sub: item.badge,
                    subEn: item.badge,
                    icon: <Sun className="w-5 h-5 text-amber-500" />,
                    accentColor: 'hover:border-amber-400',
                  };
                  const isTooltipOpen = activeTooltip === item.key;

                  return (
                    <div
                      key={item.key}
                      data-tooltip-container
                      id={`orient-card-${item.key}`}
                      onClick={() => handleSelectOrientation(item.key)}
                      className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 shadow-md ring-2 ring-blue-400/20'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-800 dark:text-stone-200 shadow-2xs'
                      }`}
                    >
                      {/* Card Top: Icon & Tooltip Trigger [i] & Visual Indicator */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700/60 flex items-center justify-center shrink-0">
                          {visual.icon}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            id={`tooltip-trigger-${item.key}`}
                            title={isEn ? 'Show detailed sunlight description' : 'Pokaż szczegółowy opis nasłonecznienia'}
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

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10.5px] font-bold shadow-xs">
                              <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700/80 text-stone-500 dark:text-stone-400 group-hover:bg-blue-100 group-hover:text-blue-800 text-[10.5px] font-semibold transition-all">
                              <span>{isEn ? 'Select' : 'Wybierz'}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Title & Clean Badge */}
                      <div className="mt-3">
                        <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                          {isEn ? visual.titleEn : visual.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                            ☀️ {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                          {isEn ? visual.subEn : visual.sub}
                        </p>
                      </div>

                      {/* Visual Indicator footer bar */}
                      <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between text-[11px]">
                        <span className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-300 font-bold' : 'text-stone-500 dark:text-stone-400 group-hover:text-blue-900 dark:group-hover:text-blue-200'}`}>
                          ☀️ {item.badge}
                        </span>
                        <div className="flex items-center gap-1 font-semibold text-[10.5px]">
                          <span className={isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-stone-400 dark:text-stone-400 group-hover:text-blue-800 dark:group-hover:text-blue-200'}>
                            {isSelected ? (isEn ? 'Active' : 'Aktywna') : (isEn ? 'Set orientation' : 'Wskaż kierunek')}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform'}`} />
                        </div>
                      </div>

                      {/* Floating Tooltip for Descriptions */}
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

              {/* Guidance Banner if orientation is not selected */}
              {!isStep2Valid && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/80 flex items-center gap-3 text-amber-900 dark:text-amber-200 text-xs shadow-2xs animate-fade-in">
                  <div className="w-7 h-7 rounded-xl bg-amber-200/60 dark:bg-amber-900/60 flex items-center justify-center shrink-0 font-bold text-amber-800 dark:text-amber-300">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-semibold text-amber-950 dark:text-amber-100">
                      {isEn ? 'Select balcony orientation to unlock "Next"' : 'Wybierz kierunek balkonu, aby odblokować przycisk "Dalej"'}
                    </div>
                    <div className="text-[11px] text-amber-800 dark:text-amber-300/90">
                      {getStep2InactivityReason()}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected exposure info bar */}
              {selectedOrientation && currentExposure && (
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      {isEn ? 'Selected orientation: ' : 'Wybrana ekspozycja: '}
                      <strong className="font-bold text-stone-900 dark:text-stone-100">{currentExposure.label}</strong>
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
                    <span>{isEn ? 'Balcony railing type' : 'Typ balustrady (barierka)'}</span>
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
                      <span>{isEn ? 'Dropdown' : 'Lista rozwijana'}</span>
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
                      <span>{isEn ? 'Cards' : 'Karty'}</span>
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
                              {isEn ? selectedBarierkaOption.titleEn : selectedBarierkaOption.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${selectedBarierkaOption.badgeColor}`}>
                              {isEn ? selectedBarierkaOption.badgeEn : selectedBarierkaOption.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                            {isEn ? selectedBarierkaOption.subEn : selectedBarierkaOption.sub}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedBarierkaOption.traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/60 dark:border-stone-700/60 font-medium"
                              >
                                {trait.icon}
                                <span>{isEn ? trait.labelEn : trait.label}</span>
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
                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                            {isEn ? 'Select railing type' : 'Wybierz typ balustrady'}
                          </span>
                          <button
                            type="button"
                            id="barierka-dropdown-close-btn"
                            onClick={() => setIsBarierkaDropdownOpen(false)}
                            className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
                            title={isEn ? 'Close dropdown' : 'Zamknij listę'}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

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
                                className={`group w-full p-3 rounded-xl text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 font-semibold shadow-2xs'
                                    : 'border border-stone-200/40 dark:border-stone-800/40 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-800 dark:text-stone-200'
                                }`}
                              >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                  <div className="relative shrink-0 select-none mt-0.5">
                                    <div
                                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${opt.iconBg} ${opt.iconBorder} ${
                                        isSelected ? 'ring-2 ring-blue-500/50 scale-[1.03]' : ''
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
                                        {isEn ? opt.titleEn : opt.title}
                                      </span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                                        {isEn ? opt.badgeEn : opt.badge}
                                      </span>
                                    </div>
                                    <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-normal mt-1 leading-snug break-words">
                                      {isEn ? opt.subEn : opt.sub}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {opt.traits.map((trait, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/70 dark:border-stone-700/70 font-medium"
                                        >
                                          {trait.icon}
                                          <span>{isEn ? trait.labelEn : trait.label}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="shrink-0 mt-1 flex items-center gap-1.5">
                                  {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-3.5 py-2.5 bg-stone-50/60 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                            {isEn ? 'Clicking an option selects it automatically' : 'Kliknięcie opcji automatycznie zatwierdza wybór'}
                          </span>
                          <button
                            type="button"
                            id="barierka-dropdown-done-btn"
                            onClick={() => setIsBarierkaDropdownOpen(false)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>{isEn ? 'Done' : 'Gotowe'}</span>
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
                          className={`group p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 shadow-xs font-semibold'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300'
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
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug break-words">{isEn ? opt.titleEn : opt.title}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>{isEn ? opt.badgeEn : opt.badge}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {isSelected ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-300 font-bold bg-blue-100/90 dark:bg-blue-900/70 px-2 py-0.5 rounded-md">
                                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[3]" />
                                    <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  </span>
                                ) : (
                                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug break-words">{isEn ? opt.subEn : opt.sub}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opt.traits.map((trait, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 text-[10px]"
                                >
                                  {trait.icon}
                                  <span>{isEn ? trait.labelEn : trait.label}</span>
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
                    <span>{isEn ? 'Balcony roof covering' : 'Zadaszenie balkonu'}</span>
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
                      <span>{isEn ? 'Dropdown' : 'Lista rozwijana'}</span>
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
                      <span>{isEn ? 'Cards' : 'Karty'}</span>
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
                              {isEn ? selectedRoofingOption.titleEn : selectedRoofingOption.title}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${selectedRoofingOption.badgeColor}`}>
                              {isEn ? selectedRoofingOption.badgeEn : selectedRoofingOption.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                            {isEn ? selectedRoofingOption.subEn : selectedRoofingOption.sub}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedRoofingOption.traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/60 dark:border-stone-700/60 font-medium"
                              >
                                {trait.icon}
                                <span>{isEn ? trait.labelEn : trait.label}</span>
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
                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                            {isEn ? 'Select roof covering' : 'Wybierz zadaszenie'}
                          </span>
                          <button
                            type="button"
                            id="roofing-dropdown-close-btn"
                            onClick={() => setIsRoofingDropdownOpen(false)}
                            className="p-1 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition cursor-pointer"
                            title={isEn ? 'Close list' : 'Zamknij listę'}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

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
                                className={`group w-full p-3 rounded-xl text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                                  isSelected
                                    ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/70 text-blue-950 dark:text-blue-100 font-semibold shadow-2xs'
                                    : 'border border-stone-200/40 dark:border-stone-800/40 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-800 dark:text-stone-200'
                                }`}
                              >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                  <div className="relative shrink-0 select-none mt-0.5">
                                    <div
                                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${opt.iconBg} ${opt.iconBorder} ${
                                        isSelected ? 'ring-2 ring-blue-500/50 scale-[1.03]' : ''
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
                                        {isEn ? opt.titleEn : opt.title}
                                      </span>
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                                        {isEn ? opt.badgeEn : opt.badge}
                                      </span>
                                    </div>
                                    <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-normal mt-1 leading-snug break-words">
                                      {isEn ? opt.subEn : opt.sub}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {opt.traits.map((trait, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10.5px] border border-stone-200/70 dark:border-stone-700/70 font-medium"
                                        >
                                          {trait.icon}
                                          <span>{isEn ? trait.labelEn : trait.label}</span>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="shrink-0 mt-1 flex items-center gap-1.5">
                                  {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xs">
                                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    </div>
                                  ) : (
                                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-3.5 py-2.5 bg-stone-50/60 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                            {isEn ? 'Clicking an option selects it automatically' : 'Kliknięcie opcji automatycznie zatwierdza wybór'}
                          </span>
                          <button
                            type="button"
                            id="roofing-dropdown-done-btn"
                            onClick={() => setIsRoofingDropdownOpen(false)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <span>{isEn ? 'Done' : 'Gotowe'}</span>
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
                          className={`group p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 shadow-xs font-semibold'
                              : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300'
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
                                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 leading-snug break-words">{isEn ? opt.titleEn : opt.title}</span>
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>{isEn ? opt.badgeEn : opt.badge}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {isSelected ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 dark:text-blue-300 font-bold bg-blue-100/90 dark:bg-blue-900/70 px-2 py-0.5 rounded-md">
                                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[3]" />
                                    <ArrowRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                  </span>
                                ) : (
                                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug break-words">{isEn ? opt.subEn : opt.sub}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opt.traits.map((trait, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 text-[10px]"
                                >
                                  {trait.icon}
                                  <span>{isEn ? trait.labelEn : trait.label}</span>
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
                    <span>{isEn ? 'Which container types do you have or plan to use?' : 'Jakie donice masz lub planujesz?'}</span>
                  </label>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                    {isEn ? 'Multiple choice' : 'Wybór wielokrotny'}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  {isEn ? (
                    <>Check <span className="font-semibold text-stone-700 dark:text-stone-300">all container types</span> that you have or plan to use (you can select multiple):</>
                  ) : (
                    <>Zaznacz <span className="font-semibold text-stone-700 dark:text-stone-300">wszystkie rodzaje pojemników</span>, którymi dysponujesz lub które planujesz użyć (możesz wybrać kilka opcji):</>
                  )}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    {
                      id: 'boxes_balcony_15cm',
                      label: isEn ? 'Balcony rail planters (depth ~15 cm)' : 'Skrzynki balkonowe (głęb. 15 cm)',
                      sub: isEn ? 'Lettuces, radishes, herbs, chives' : 'Sałaty, rzodkiewki, zioła, szczypiorek',
                    },
                    {
                      id: 'pots_medium_5_15',
                      label: isEn ? 'Medium pots (5 – 12 liters)' : 'Średnie donice (5 – 12 litrów)',
                      sub: isEn ? 'Chili peppers, strawberries, Swiss chard' : 'Papryczki chili, truskawki, burak liściowy',
                    },
                    {
                      id: 'pots_large_15_30',
                      label: isEn ? 'Large containers / buckets (15 – 30L)' : 'Duże donice / wiadra (15 – 30L)',
                      sub: isEn ? 'Cherry tomatoes, bush cucumbers' : 'Pomidory koktajlowe, ogórki krzaczaste',
                    },
                    {
                      id: 'grow_bags',
                      label: isEn ? 'Fabric grow bags (smart pots)' : 'Worki z tkaniny uprawowej',
                      sub: isEn ? 'Superior root aeration and drainage' : 'Idealne napowietrzanie korzeni',
                    },
                  ].map((item) => {
                    const isSelected = spec.pots.includes(item.id as ContainerType);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`pot-type-${item.id}`}
                        onClick={() => togglePot(item.id as ContainerType)}
                        className={`group p-3.5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer active:scale-[0.98] ${
                          isSelected
                            ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20 shadow-xs font-semibold'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center shrink-0 transition-all duration-150 ${
                            isSelected
                              ? 'bg-blue-600 border border-blue-600 text-white shadow-2xs'
                              : 'border-2 border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800 group-hover:border-blue-400'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-blue-950 dark:text-blue-100' : 'text-stone-900 dark:text-stone-100 group-hover:text-blue-950 dark:group-hover:text-blue-100'}`}>
                              {item.label}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-900/70 px-2 py-0.5 rounded-md">
                                  <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-400 dark:text-stone-400 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">
                                  <span>{isEn ? 'Select' : 'Wybierz'}</span>
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                              )}
                            </div>
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
                  <span>{isEn ? 'How much time do you have for watering?' : 'Ile masz czasu na podlewanie?'}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: isEn ? 'Daily' : 'Codziennie', sub: isEn ? 'Morning and evening' : 'Mogę rano i wieczorem' },
                    { id: 'few_days', label: isEn ? 'Every 2–3 days' : 'Co 2–3 dni', sub: isEn ? 'Balanced routine' : 'Zrównoważona opieka' },
                    { id: 'weekends', label: isEn ? 'Mainly weekends' : 'Głównie weekendy', sub: isEn ? 'Drought-tolerant plants' : 'Rośliny odporne na suszę' },
                  ].map((item) => {
                    const isSelected = spec.care_time === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`care-time-${item.id}`}
                        onClick={() => setSpec({ ...spec, care_time: item.id as CareTime })}
                        className={`group p-3 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 font-bold shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-blue-950 dark:group-hover:text-blue-100">{item.label}</span>
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 stroke-[3]" />
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">{item.sub}</div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between text-[10px]">
                          <span className={isSelected ? 'text-blue-700 dark:text-blue-300 font-semibold' : 'text-stone-400 group-hover:text-blue-800'}>
                            {isSelected ? (isEn ? 'Active' : 'Wybrano') : (isEn ? 'Choose' : 'Wybierz')}
                          </span>
                          <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-blue-600' : 'text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform'}`} />
                        </div>
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
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isEn ? 'Back' : 'Wstecz'}</span>
              </button>
            ) : onClose && !isFirstTime ? (
              <button
                type="button"
                id="cancel-setup-btn"
                onClick={onClose}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                {isEn ? 'Cancel' : 'Anuluj'}
              </button>
            ) : null}

            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium">
              <span>{isEn ? `Step ${step} of 3` : `Krok ${step} z 3`}</span>
              {completedStepsCount > 0 && (
                <>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isEn ? `Completed ${completedStepsCount}/3` : `Ukończono ${completedStepsCount}/3`}</span>
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
                  if (isNextDisabled) {
                    setActiveTooltip(activeTooltip === 'next-btn' ? null : 'next-btn');
                  }
                }}
              >
                <button
                  type="button"
                  id="wizard-next-step-btn"
                  disabled={isNextDisabled}
                  aria-disabled={isNextDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isNextDisabled) {
                      setActiveTooltip(activeTooltip === 'next-btn' ? null : 'next-btn');
                      return;
                    }
                    setStep((s) => (s + 1) as 1 | 2 | 3);
                  }}
                  className={`w-full sm:w-auto px-7 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                    isNextDisabled
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 border border-stone-200 dark:border-stone-700 cursor-not-allowed opacity-60'
                      : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white shadow-md hover:shadow-lg ring-1 ring-emerald-600 cursor-pointer'
                  }`}
                >
                  <span>{isEn ? 'Next' : 'Dalej'}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {isNextDisabled && (
                  <div
                    className={`absolute bottom-full mb-2 right-0 w-64 p-2.5 bg-stone-900 dark:bg-stone-800 text-white text-xs rounded-xl shadow-xl pointer-events-none transition-opacity duration-200 z-50 text-center font-medium border border-stone-700 ${
                      activeTooltip === 'next-btn' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 justify-center">
                      <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{step === 1 ? getStep1InactivityReason() : getStep2InactivityReason()}</span>
                    </div>
                    <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-800" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center sm:items-end w-full sm:w-auto gap-2">
                <div
                  className="relative group w-full sm:w-auto"
                  data-tooltip-container="save-btn"
                >
                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      type="button"
                      id="save-balcony-spec-btn"
                      onClick={() => handleSave()}
                      className="w-full sm:w-auto px-7 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ring-1 ring-emerald-600"
                      aria-describedby="save-balcony-benefit-text"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{isEn ? 'Save & Calculate' : 'Zapisz i przelicz'}</span>
                    </button>

                    <button
                      type="button"
                      id="save-balcony-info-btn"
                      onClick={() => setActiveTooltip(activeTooltip === 'save-btn' ? null : 'save-btn')}
                      className="p-3 text-stone-500 hover:text-emerald-700 dark:text-stone-400 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition cursor-pointer border border-stone-200 dark:border-stone-700 shrink-0"
                      aria-label={isEn ? 'Why save and calculate?' : 'Dlaczego warto zapisać i przeliczyć?'}
                      title={isEn ? 'Why save and calculate?' : 'Dlaczego warto zapisać i przeliczyć?'}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div
                    role="tooltip"
                    id="save-balcony-tooltip"
                    className={`absolute bottom-full mb-2.5 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 w-72 sm:w-80 p-3.5 bg-stone-900 dark:bg-stone-850 text-white text-xs rounded-xl shadow-2xl transition-all duration-200 z-50 text-left border border-stone-700 ${
                      activeTooltip === 'save-btn'
                        ? 'opacity-100 visible'
                        : 'opacity-0 group-hover:opacity-100 invisible group-hover:visible'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs mb-1">
                          {isEn ? 'What you gain by clicking:' : 'Co zyskasz po zapisaniu?'}
                        </div>
                        <div className="text-stone-300 text-[11px] leading-relaxed">
                          {isEn
                            ? 'Save your configuration and see personalized plant recommendations, tailored soil mixes, and exact pot volume calculations suited for your balcony.'
                            : 'Otrzymasz spersonalizowany dobór roślin dopasowanych do Twojej wystawy i piętra, precyzyjne receptury podłoży oraz kalkulator pojemności donic.'}
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-full right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-8 -mt-1 border-4 border-transparent border-t-stone-900 dark:border-t-stone-850" />
                  </div>
                </div>

                <p
                  id="save-balcony-benefit-text"
                  className="text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 flex items-center gap-1.5 text-center sm:text-right font-medium max-w-xs sm:max-w-sm leading-snug bg-emerald-50/70 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 inline" />
                  <span>
                    {isEn
                      ? 'Save your configuration and see personalized plant recommendations'
                      : 'Zapisz konfigurację i zobacz spersonalizowane rekomendacje roślin'}
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
