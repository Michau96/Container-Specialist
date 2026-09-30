import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  AlertCircle,
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
  PotShape,
  PotDimensionsSpec,
} from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS, OrientationOption } from '../lib/api';
import {
  validateRegion,
  validateFloor,
  validateExposure,
  validateContainers,
  validateCareTime,
  validatePotQuantity,
  validatePotDimensions,
  validateCrossFieldCombinations,
  getDisabledOptionReason,
  validateOnboardingProfile,
  calculatePotVolumeLiters,
  PotDimensionsDomain,
} from '../lib/onboardingDomain';

export const getFloorSemanticKey = (floor: number): string => {
  switch (floor) {
    case 0:
      return 'ground';
    case 2:
      return 'floor-1-3';
    case 5:
      return 'floor-4-6';
    case 8:
      return 'floor-7-plus';
    default:
      return `floor-${floor}`;
  }
};

export const getSunlightSemanticKey = (key: string): string => {
  switch (key) {
    case 'S':
      return 'full-sun';
    case 'E':
      return 'morning-sun';
    case 'W':
      return 'afternoon-sun';
    case 'N':
      return 'shade';
    case 'SE':
      return 'south-east';
    case 'SW':
      return 'south-west';
    case 'NE':
      return 'north-east';
    case 'NW':
      return 'north-west';
    default:
      return key.toLowerCase().replace(/_/g, '-');
  }
};

export const getRecommendedOrientation = (
  region: PolandRegionKey | null,
  floor: number | null
): Orientation | null => {
  if (!region && floor === null) return null;
  // High floor (>= 4 floors) receives optimal light from south without tree/roof obstructions
  if (floor !== null && floor >= 4) {
    return 'S';
  }
  // Ground floor benefits from warm South sun
  if (floor === 0) {
    return 'S';
  }
  // Warm southwestern regions (dolnośląskie, opolskie)
  if (region === 'dolnoslaskie' || region === 'opolskie') {
    return 'SE';
  }
  // Cooler northeastern / mountain regions (podlaskie, warmińsko-mazurskie)
  if (region === 'podlaskie' || region === 'warminsko_mazurskie') {
    return 'S';
  }
  return 'S';
};

export interface StepValidationResult {
  isValid: boolean;
  missingFields: string[];
  validationMessage: string;
}

export interface FullProfileValidationResult {
  isValid: boolean;
  step1: StepValidationResult;
  step2: StepValidationResult;
  step3: StepValidationResult;
  firstInvalidStep: 1 | 2 | 3 | null;
  firstInvalidField: string | null;
  validationMessage: string;
}

export const validateStep1 = (
  region: PolandRegionKey | string | null | undefined,
  floor: number | null | undefined,
  language: 'pl' | 'en' = 'pl'
): StepValidationResult => {
  const isEn = language === 'en';
  const missingFields: string[] = [];

  const validRegions = Object.keys(POLAND_REGIONS);
  const isValidRegion =
    Boolean(region && typeof region === 'string' && region.trim().length > 0 && validRegions.includes(region));

  if (!isValidRegion) {
    missingFields.push('region');
  }

  const isValidFloor =
    floor !== null &&
    floor !== undefined &&
    typeof floor === 'number' &&
    !isNaN(floor) &&
    floor >= 0 &&
    floor <= 30;

  if (!isValidFloor) {
    missingFields.push('floor');
  }

  if (missingFields.length === 2) {
    return {
      isValid: false,
      missingFields,
      validationMessage: isEn
        ? 'Please select both province/city and floor to proceed.'
        : 'Wybierz województwo oraz piętro swojego balkonu, aby przejść dalej.',
    };
  }

  if (!isValidRegion) {
    return {
      isValid: false,
      missingFields,
      validationMessage: isEn
        ? 'Please select your balcony location (province/city) to proceed.'
        : 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.',
    };
  }

  if (!isValidFloor) {
    const isInvalidNumber =
      floor !== null && floor !== undefined && (floor < 0 || floor > 30 || isNaN(floor));
    return {
      isValid: false,
      missingFields,
      validationMessage: isInvalidNumber
        ? (isEn ? 'Please specify a valid floor number (0-30).' : 'Podaj prawidłowy numer piętra (0-30).')
        : (isEn ? 'Please select the floor of your balcony to proceed.' : 'Wybierz piętro, na którym znajduje się Twój balkon, aby przejść dalej.'),
    };
  }

  return {
    isValid: true,
    missingFields: [],
    validationMessage: '',
  };
};

export const validateStep2 = (
  orientation: Orientation | string | null | undefined,
  language: 'pl' | 'en' = 'pl'
): StepValidationResult => {
  const isEn = language === 'en';
  const missingFields: string[] = [];

  const validOrientations: string[] = [
    'S', 'E', 'W', 'N', 'SE', 'SW', 'NE', 'NW',
    'SSE', 'SSW', 'ESE', 'ENE', 'WSW', 'WNW', 'NNE', 'NNW',
    'S_SE', 'S_SW', 'W_SW', 'W_NW', 'E_SE', 'E_NE', 'N_NW', 'N_NE',
  ];

  const isValid = Boolean(orientation && validOrientations.includes(orientation));
  if (!isValid) {
    missingFields.push('orientation');
    return {
      isValid: false,
      missingFields,
      validationMessage: isEn
        ? 'Please select the sun exposure / orientation of your balcony to proceed.'
        : 'Wybierz kierunek świata (ekspozycję) swojego balkonu, aby przejść dalej.',
    };
  }

  return {
    isValid: true,
    missingFields: [],
    validationMessage: '',
  };
};

export const validateStep3 = (
  pots: ContainerType[] | string[] | null | undefined,
  careTime: CareTime | string | null | undefined,
  language: 'pl' | 'en' = 'pl',
  extra?: {
    balconyType?: BalconyType;
    roofing?: RoofingType;
    floor?: number;
    orientation?: Orientation;
    potCount?: number;
    potDimensions?: PotDimensionsDomain;
  }
): StepValidationResult => {
  const isEn = language === 'en';
  const missingFields: string[] = [];

  const isValidPots = Array.isArray(pots) && pots.length > 0;
  if (!isValidPots) {
    missingFields.push('pots');
  }

  const isValidCareTime = Boolean(
    careTime && typeof careTime === 'string' && careTime.trim().length > 0
  );
  if (!isValidCareTime) {
    missingFields.push('care_time');
  }

  if (missingFields.length === 2) {
    return {
      isValid: false,
      missingFields,
      validationMessage: isEn
        ? 'Please select your containers and watering frequency.'
        : 'Wybierz co najmniej jeden rodzaj donicy oraz częstotliwość podlewania.',
    };
  }

  if (!isValidPots) {
    return {
      isValid: false,
      missingFields,
      validationMessage: isEn
        ? 'Please select at least one container type to proceed.'
        : 'Wybierz co najmniej jeden rodzaj donicy, aby zapisać konfigurację.',
    };
  }

  if (!isValidCareTime) {
    return {
      isValid: false,
      missingFields,
      validationMessage: isEn
        ? 'Please select how often you can water plants.'
        : 'Wybierz częstotliwość podlewania, aby zapisać konfigurację.',
    };
  }

  // Pot count domain validation
  if (extra?.potCount !== undefined && extra.potCount !== null) {
    const countErr = validatePotQuantity(extra.potCount, language);
    if (countErr) {
      return {
        isValid: false,
        missingFields: ['pot_count'],
        validationMessage: countErr.message,
      };
    }
  }

  // Pot dimensions domain validation
  if (extra?.potDimensions) {
    const dimErrors = validatePotDimensions(extra.potDimensions, language);
    if (dimErrors.length > 0) {
      return {
        isValid: false,
        missingFields: [dimErrors[0].field],
        validationMessage: dimErrors[0].message,
      };
    }
  }

  // Cross-field combination validation
  const crossErrors = validateCrossFieldCombinations(
    {
      balcony_type: extra?.balconyType,
      roofing: extra?.roofing,
      floor: extra?.floor,
      orientation: extra?.orientation,
      pots: (pots as ContainerType[]) || [],
      care_time: (careTime as CareTime) || undefined,
      pot_count: extra?.potCount,
      pot_dimensions: extra?.potDimensions,
    },
    language
  );

  if (crossErrors.length > 0) {
    return {
      isValid: false,
      missingFields: [crossErrors[0].field],
      validationMessage: crossErrors[0].message,
    };
  }

  return {
    isValid: true,
    missingFields: [],
    validationMessage: '',
  };
};

export const validateFullProfile = (
  spec: Partial<UserBalconySpec> | null | undefined,
  language: 'pl' | 'en' = 'pl'
): FullProfileValidationResult => {
  const safeSpec = spec || {};
  const step1 = validateStep1(
    safeSpec.region || null,
    typeof safeSpec.floor === 'number' ? safeSpec.floor : null,
    language
  );
  const step2 = validateStep2(safeSpec.orientation || null, language);
  const step3 = validateStep3(safeSpec.pots || [], safeSpec.care_time || null, language, {
    balconyType: safeSpec.balcony_type,
    roofing: safeSpec.roofing,
    floor: safeSpec.floor,
    orientation: safeSpec.orientation,
    potCount: safeSpec.pot_count,
    potDimensions: safeSpec.pot_dimensions,
  });

  let firstInvalidStep: 1 | 2 | 3 | null = null;
  let firstInvalidField: string | null = null;
  let validationMessage = '';

  if (!step1.isValid) {
    firstInvalidStep = 1;
    firstInvalidField = step1.missingFields[0] || null;
    validationMessage = step1.validationMessage;
  } else if (!step2.isValid) {
    firstInvalidStep = 2;
    firstInvalidField = step2.missingFields[0] || null;
    validationMessage = step2.validationMessage;
  } else if (!step3.isValid) {
    firstInvalidStep = 3;
    firstInvalidField = step3.missingFields[0] || null;
    validationMessage = step3.validationMessage;
  }

  return {
    isValid: step1.isValid && step2.isValid && step3.isValid,
    step1,
    step2,
    step3,
    firstInvalidStep,
    firstInvalidField,
    validationMessage,
  };
};

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
  const [isCloseTooltipVisible, setIsCloseTooltipVisible] = useState(false);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Capture currently active element when modal opens to restore focus on dismissal
  useEffect(() => {
    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  const handleDismiss = useCallback(() => {
    if (onClose) {
      onClose();
      // Restore focus to the element that opened the modal after dismissal
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        const el = triggerElementRef.current;
        setTimeout(() => {
          el.focus();
        }, 0);
      }
    }
  }, [onClose]);

  // Mark the application background as inert and aria-hidden while the modal is open
  useEffect(() => {
    if (!isOpen) return;

    const rootEl = document.getElementById('root');
    const modalRoot = document.getElementById('modal-root');
    const nodesToInert: HTMLElement[] = [];

    if (rootEl) {
      nodesToInert.push(rootEl);
    } else {
      document.body.childNodes.forEach((node) => {
        if (
          node instanceof HTMLElement &&
          node !== modalRoot &&
          (!dialogRef.current || !node.contains(dialogRef.current))
        ) {
          nodesToInert.push(node);
        }
      });
    }

    nodesToInert.forEach((node) => {
      node.setAttribute('inert', '');
      (node as any).inert = true;
      node.setAttribute('aria-hidden', 'true');
    });

    return () => {
      nodesToInert.forEach((node) => {
        node.removeAttribute('inert');
        (node as any).inert = false;
        node.removeAttribute('aria-hidden');
      });
    };
  }, [isOpen]);

  // Initial focus management: move focus to heading when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const id = requestAnimationFrame(() => {
      if (headingRef.current) {
        headingRef.current.focus();
      } else if (dialogRef.current) {
        const firstFocusable = dialogRef.current.querySelector<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    });

    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  // Robust focus trap on keydown (Tab & Shift+Tab) and focus containment
  useEffect(() => {
    if (!isOpen) return;

    const FOCUSABLE_SELECTOR = [
      'a[href]',
      'button:not([disabled]):not([aria-hidden="true"])',
      'input:not([disabled]):not([aria-hidden="true"])',
      'select:not([disabled]):not([aria-hidden="true"])',
      'textarea:not([disabled]):not([aria-hidden="true"])',
      '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
    ].join(', ');

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isBarierkaDropdownOpen || isRoofingDropdownOpen) {
          setIsBarierkaDropdownOpen(false);
          setIsRoofingDropdownOpen(false);
          return;
        }
        if (isOpen && onClose) {
          e.preventDefault();
          e.stopPropagation();
          handleDismiss();
          return;
        }
      }

      if (e.key === 'Tab') {
        if (!dialogRef.current) return;

        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter((el) => {
          return (
            el.offsetParent !== null &&
            !el.hasAttribute('disabled') &&
            el.getAttribute('aria-hidden') !== 'true'
          );
        });

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const currentActive = document.activeElement;

        if (e.shiftKey) {
          // Shift + Tab: wrap to last element if on first element or on heading/outside
          if (
            currentActive === firstElement ||
            currentActive === headingRef.current ||
            !dialogRef.current.contains(currentActive)
          ) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: wrap to first element if on last element or outside
          if (
            currentActive === lastElement ||
            currentActive === headingRef.current ||
            !dialogRef.current.contains(currentActive)
          ) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      if (!dialogRef.current) return;
      if (!dialogRef.current.contains(e.target as Node)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else if (headingRef.current) {
          headingRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [isOpen, onClose, handleDismiss, isBarierkaDropdownOpen, isRoofingDropdownOpen]);

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

  // Pot count and dimensions state
  const [potCount, setPotCount] = useState<number>(initialSpec?.pot_count ?? 1);
  const [potShape, setPotShape] = useState<PotShape>(initialSpec?.pot_dimensions?.shape ?? 'rectangular');
  const [potLength, setPotLength] = useState<number>(initialSpec?.pot_dimensions?.length_cm ?? 60);
  const [potWidth, setPotWidth] = useState<number>(initialSpec?.pot_dimensions?.width_cm ?? 20);
  const [potDiameter, setPotDiameter] = useState<number>(initialSpec?.pot_dimensions?.diameter_cm ?? 30);
  const [potHeight, setPotHeight] = useState<number>(initialSpec?.pot_dimensions?.height_cm ?? 18);
  const [potVolume, setPotVolume] = useState<number | undefined>(initialSpec?.pot_dimensions?.volume_liters);
  const [frenchBalconyNotice, setFrenchBalconyNotice] = useState<string | null>(null);

  const currentPotDimensions = useMemo<PotDimensionsDomain>(() => ({
    shape: potShape,
    length_cm: potShape === 'rectangular' ? potLength : undefined,
    width_cm: potShape === 'rectangular' ? potWidth : undefined,
    diameter_cm: potShape === 'round' ? potDiameter : undefined,
    height_cm: potHeight,
    volume_liters: potVolume,
  }), [potShape, potLength, potWidth, potDiameter, potHeight, potVolume]);

  const calculatedPotVolume = useMemo(() => calculatePotVolumeLiters(currentPotDimensions), [currentPotDimensions]);

  const potDimensionsErrors = useMemo(
    () => validatePotDimensions(currentPotDimensions, language),
    [currentPotDimensions, language]
  );

  const [isModalReady, setIsModalReady] = useState(false);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);

  useEffect(() => {
    setIsGuidanceOpen(false);
  }, [step]);

  useEffect(() => {
    if (isOpen) {
      setIsModalReady(false);
      const rafId = requestAnimationFrame(() => {
        setIsModalReady(true);
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      setIsModalReady(false);
    }
  }, [isOpen, step]);

  useEffect(() => {
    if (isOpen) {
      setSpec(initialSpec);
      setStep(1);
      setActiveTooltip(null);
      setSelectedRegion(isFirstTime ? null : (initialSpec?.region || null));
      setSelectedFloor(isFirstTime ? null : (typeof initialSpec?.floor === 'number' ? initialSpec.floor : null));
      setSelectedOrientation(isFirstTime ? null : (initialSpec?.orientation || null));
      setPotCount(initialSpec?.pot_count ?? 1);
      setPotShape(initialSpec?.pot_dimensions?.shape ?? 'rectangular');
      setPotLength(initialSpec?.pot_dimensions?.length_cm ?? 60);
      setPotWidth(initialSpec?.pot_dimensions?.width_cm ?? 20);
      setPotDiameter(initialSpec?.pot_dimensions?.diameter_cm ?? 30);
      setPotHeight(initialSpec?.pot_dimensions?.height_cm ?? 18);
      setPotVolume(initialSpec?.pot_dimensions?.volume_liters);
      setFrenchBalconyNotice(null);
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

  const handleSelectBalconyType = (type: BalconyType) => {
    if (type === 'french') {
      const hadIncompatible = spec.pots.some(
        (p) => p === 'pots_large_15_30' || p === 'grow_bags' || p === 'pots_medium_5_15'
      );
      const filteredPots = spec.pots.filter(
        (p) => p !== 'pots_large_15_30' && p !== 'grow_bags' && p !== 'pots_medium_5_15'
      );
      const nextPots: ContainerType[] = filteredPots.length > 0 ? filteredPots : ['boxes_balcony_15cm'];
      setSpec((prev) => ({
        ...prev,
        balcony_type: type,
        pots: nextPots,
        roofing: prev.roofing === 'covered' ? 'uncovered' : prev.roofing,
      }));
      if (hadIncompatible) {
        setFrenchBalconyNotice(
          isEn
            ? 'Adjusted containers: Standing floor containers were deselected as French balconies have no floor slab.'
            : 'Dostosowano pojemniki: wyłączono donice stojące na posadzce ze względu na brak płyty balkonowej.'
        );
      }
    } else {
      setFrenchBalconyNotice(null);
      setSpec((prev) => ({ ...prev, balcony_type: type }));
    }
  };

  const [stepError, setStepError] = useState<string | null>(null);

  const step1Validation = useMemo(
    () => validateStep1(selectedRegion, selectedFloor, language),
    [selectedRegion, selectedFloor, language]
  );

  const step2Validation = useMemo(
    () => validateStep2(selectedOrientation, language),
    [selectedOrientation, language]
  );

  const step3Validation = useMemo(
    () =>
      validateStep3(spec.pots, spec.care_time, language, {
        balconyType: spec.balcony_type,
        roofing: spec.roofing,
        floor: selectedFloor ?? spec.floor,
        orientation: selectedOrientation ?? spec.orientation,
        potCount,
        potDimensions: currentPotDimensions,
      }),
    [spec.pots, spec.care_time, spec.balcony_type, spec.roofing, selectedFloor, spec.floor, selectedOrientation, spec.orientation, potCount, currentPotDimensions, language]
  );

  const currentStepValidation = useMemo<StepValidationResult>(() => {
    if (step === 1) return step1Validation;
    if (step === 2) return step2Validation;
    return step3Validation;
  }, [step, step1Validation, step2Validation, step3Validation]);

  const fullProfileValidation = useMemo(
    () =>
      validateFullProfile(
        {
          ...spec,
          region: selectedRegion || undefined,
          floor: selectedFloor ?? undefined,
          orientation: selectedOrientation || undefined,
          pot_count: potCount,
          pot_dimensions: currentPotDimensions,
        },
        language
      ),
    [spec, selectedRegion, selectedFloor, selectedOrientation, potCount, currentPotDimensions, language]
  );

  const isStep1Valid = step1Validation.isValid;
  const isStep2Valid = step2Validation.isValid;
  const isStep3Valid = step3Validation.isValid;
  const isStep1Complete = isStep1Valid;
  const isStep2Complete = isStep1Complete && isStep2Valid;
  const isStep3Complete = isStep1Complete && isStep2Complete && isStep3Valid;

  const isStepComplete = (stepNum: 1 | 2 | 3): boolean => {
    if (stepNum === 1) return isStep1Complete;
    if (stepNum === 2) return isStep2Complete;
    if (stepNum === 3) return isStep3Complete;
    return false;
  };

  const completedStepsCount = (isStep1Complete ? 1 : 0) + (isStep2Complete ? 1 : 0) + (isStep3Complete ? 1 : 0);
  const progressPercent = Math.round((completedStepsCount / 3) * 100);

  const isNextDisabled = !currentStepValidation.isValid;
  const isSaveDisabled = !fullProfileValidation.isValid;

  const getStep1InactivityReason = (): string => step1Validation.validationMessage;
  const getStep2InactivityReason = (): string => step2Validation.validationMessage;
  const getStep3InactivityReason = (): string => step3Validation.validationMessage;

  useEffect(() => {
    setStepError(null);
  }, [step, selectedRegion, selectedFloor, selectedOrientation, spec.pots, spec.care_time]);

  const focusFirstInvalidElement = useCallback((field: string | null) => {
    setTimeout(() => {
      if (!field) return;
      if (field === 'region') {
        const searchInput = document.getElementById('balcony-region-search');
        if (searchInput) {
          searchInput.focus();
          return;
        }
        const firstOption = document.querySelector<HTMLElement>('[data-testid^="location-option-"]');
        if (firstOption) firstOption.focus();
      } else if (field === 'floor') {
        const floorBtn =
          document.getElementById('floor-option-ground') ||
          document.querySelector<HTMLElement>('[data-testid^="floor-option-"]');
        if (floorBtn) floorBtn.focus();
      } else if (field === 'orientation') {
        const orientCard =
          document.getElementById('orient-card-S') ||
          document.querySelector<HTMLElement>('[data-testid^="sunlight-option-"]');
        if (orientCard) orientCard.focus();
      } else if (field === 'pots') {
        const firstPot = document.querySelector<HTMLElement>('[data-testid^="pot-option-"]');
        if (firstPot) firstPot.focus();
      } else if (field === 'care_time') {
        const firstCare = document.querySelector<HTMLElement>('[data-testid^="care-option-"]');
        if (firstCare) firstCare.focus();
      }
    }, 50);
  }, []);

  const handleNextStep = useCallback(() => {
    if (step === 1) {
      if (!step1Validation.isValid) {
        setStepError(step1Validation.validationMessage);
        focusFirstInvalidElement(step1Validation.missingFields[0] || 'region');
        return;
      }
      setStepError(null);
      setStep(2);
    } else if (step === 2) {
      if (!step2Validation.isValid) {
        setStepError(step2Validation.validationMessage);
        focusFirstInvalidElement(step2Validation.missingFields[0] || 'orientation');
        return;
      }
      setStepError(null);
      setStep(3);
    }
  }, [step, step1Validation, step2Validation, focusFirstInvalidElement]);

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

  const recommendedOrientation = useMemo(() => {
    return getRecommendedOrientation(selectedRegion, selectedFloor);
  }, [selectedRegion, selectedFloor]);

  const togglePot = (pot: ContainerType) => {
    setSpec((prev) => {
      const exists = prev.pots.includes(pot);
      const nextPots = exists ? prev.pots.filter((p) => p !== pot) : [...prev.pots, pot];
      return { ...prev, pots: nextPots };
    });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullValidation = validateFullProfile(
      {
        ...spec,
        region: selectedRegion || undefined,
        floor: selectedFloor ?? undefined,
        orientation: selectedOrientation || undefined,
        pot_count: potCount,
        pot_dimensions: currentPotDimensions,
      },
      language
    );

    if (!fullValidation.isValid) {
      setStepError(fullValidation.validationMessage);
      if (fullValidation.firstInvalidStep && fullValidation.firstInvalidStep !== step) {
        setStep(fullValidation.firstInvalidStep);
      }
      focusFirstInvalidElement(fullValidation.firstInvalidField);
      return;
    }

    setStepError(null);
    onSave({
      ...spec,
      region: selectedRegion!,
      floor: selectedFloor!,
      orientation: selectedOrientation!,
      pot_count: potCount,
      pot_dimensions: currentPotDimensions,
    });
  };

  if (!isOpen) return null;

  const modalTarget =
    typeof document !== 'undefined'
      ? document.getElementById('modal-root') || document.body
      : null;

  if (!modalTarget) return null;

  const currentRegion = selectedRegion ? POLAND_REGIONS[selectedRegion] : null;
  const currentExposure = ORIENTATION_OPTIONS.find((o) => o.key === spec.orientation);

  return createPortal(
    <div
      id="balcony-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm overflow-hidden animate-fade-in"
    >
      <div
        ref={dialogRef}
        id="balcony-setup-dialog"
        data-testid="onboarding-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-heading"
        data-modal-ready={isModalReady ? 'true' : 'false'}
        className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 rounded-2xl max-w-[560px] w-full max-h-[90dvh] flex flex-col shadow-2xl border border-stone-300 dark:border-stone-800 overflow-hidden transition-all my-auto"
      >
        {/* Top Header focused on: one concise heading, one short benefit statement, one secondary dismiss action */}
        <div className="shrink-0 bg-white dark:bg-stone-950 p-4 sm:p-7 pb-3 sm:pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between gap-3 mb-3 text-xs font-semibold text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap" role="tablist" aria-label={isEn ? 'Balcony setup steps' : 'Kroki konfiguracji balkonu'}>
              {[
                { num: 1 as const, label: isEn ? 'Location' : 'Lokalizacja' },
                { num: 2 as const, label: isEn ? 'Exposure' : 'Ekspozycja' },
                { num: 3 as const, label: isEn ? 'Pots & care' : 'Donice i opieka' },
              ].map((s, idx) => {
                const isActive = step === s.num;
                const isCompleted = isStepComplete(s.num);
                const isDisabledTab =
                  (s.num === 2 && !isStep1Valid) ||
                  (s.num === 3 && (!isStep1Valid || !isStep2Valid));
                return (
                  <React.Fragment key={s.num}>
                    {idx > 0 && <span className="text-stone-400 dark:text-stone-600 select-none">/</span>}
                    <button
                      type="button"
                      id={`wizard-step-tab-${s.num}`}
                      data-testid={`onboarding-step-${s.num}-tab`}
                      role="tab"
                      aria-selected={isActive}
                      disabled={isDisabledTab}
                      onClick={() => {
                        if (isDisabledTab) return;
                        setStep(s.num);
                      }}
                      className={`min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                        isActive
                          ? 'text-emerald-950 dark:text-emerald-100 font-bold bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-700 dark:border-emerald-400 shadow-2xs'
                          : isCompleted
                          ? 'text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300'
                          : isDisabledTab
                          ? 'text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-60'
                          : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <span className="font-bold">{s.num}.</span>
                      <span>{s.label}</span>
                      {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 stroke-[3]" />}
                      {isActive && <span className="sr-only"> ({isEn ? 'Current step' : 'Aktualny krok'})</span>}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>

            {onClose && (
              <div className="relative inline-flex items-center">
                <button
                  id="close-balcony-modal-btn"
                  data-testid="onboarding-close"
                  type="button"
                  onClick={handleDismiss}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDismiss();
                    }
                  }}
                  onMouseEnter={() => setIsCloseTooltipVisible(true)}
                  onMouseLeave={() => setIsCloseTooltipVisible(false)}
                  onFocus={() => setIsCloseTooltipVisible(true)}
                  onBlur={() => setIsCloseTooltipVisible(false)}
                  className="min-w-11 min-h-11 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 hover:text-stone-950 dark:text-stone-100 dark:hover:text-white border border-stone-300 dark:border-stone-700 shadow-xs focus-visible:outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-stone-900 transition-all cursor-pointer"
                  aria-label="Zamknij"
                  aria-describedby="close-modal-tooltip"
                  title="Zamknij"
                >
                  <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
                </button>
                <span
                  id="close-modal-tooltip"
                  role="tooltip"
                  className={`absolute top-full mt-1.5 right-0 px-2.5 py-1 bg-stone-900 dark:bg-stone-800 text-white text-xs font-semibold rounded-md shadow-lg pointer-events-none transition-all duration-150 z-50 whitespace-nowrap border border-stone-700 ${
                    isCloseTooltipVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
                  }`}
                >
                  Zamknij
                </span>
              </div>
            )}
          </div>

          <h2
            ref={headingRef}
            id="onboarding-modal-heading"
            tabIndex={-1}
            className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight focus:outline-none"
          >
            {step === 1 && (isEn ? 'Where is your balcony garden?' : 'Gdzie rośnie Twój ogród?')}
            {step === 2 && (isEn ? 'Which direction does the sun face?' : 'W którą stronę pada słońce?')}
            {step === 3 && (isEn ? 'Containers & care time' : 'Twoja przestrzeń i donice')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed font-medium">
            {step === 1 && (isEn ? 'We tailor plants to your local microclimate and building height.' : 'Dopasujemy rośliny do klimatu w Twojej okolicy i wysokości budynku.')}
            {step === 2 && (isEn ? 'Sunlight is key — indicate orientation to get crops that thrive in this light.' : 'Słońce to klucz do sukcesu – wskaż kierunek, a dobierzemy gatunki, które pokochają to światło.')}
            {step === 3 && (isEn ? 'Specify container types and how often you can water your balcony pots.' : 'Określ rodzaj donic i czas, jaki chcesz poświęcić na podlewanie.')}
          </p>
        </div>

        {/* Step Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-8 py-4 sm:py-5 pb-12 space-y-5 overscroll-contain">
          {/* ================= STEP 1: LOKALIZACJA I PIĘTRO ================= */}
          {step === 1 && (
            <div data-testid="onboarding-step-1" className="space-y-6 animate-fade-in">
              {/* Region selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>{isEn ? 'Select your province or nearest city' : 'Wybierz swoje województwo lub najbliższe miasto'}</span>
                  </label>
                  <span className="text-xs text-stone-700 dark:text-stone-300">
                    {isEn ? 'Selected: ' : 'Wybrano: '}
                    <strong className={currentRegion ? 'text-emerald-900 dark:text-emerald-200 font-bold' : 'text-stone-800 dark:text-stone-200 font-semibold'}>
                      {currentRegion ? currentRegion.name.split('(')[0].trim() : (isEn ? 'None' : 'Nie wybrano')}
                    </strong>
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    id="region-search-input"
                    data-testid="location-search"
                    aria-label={isEn ? 'Search city or region' : 'Wyszukaj miasto lub województwo'}
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
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
                        className={`group min-h-[44px] p-3 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                          isSelected
                            ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 font-bold shadow-xs'
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

              {/* Piętro i siła wiatru */}
              <div
                ref={floorSectionRef}
                id="balcony-floor-section"
                className="space-y-2.5 pt-2 border-t border-stone-200 dark:border-stone-800 scroll-mt-2"
              >
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>{isEn ? 'Which floor is your balcony located on?' : 'Na którym piętrze znajduje się balkon?'}</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { floor: 0, semanticKey: 'ground', label: isEn ? 'Ground floor' : 'Parter', hint: isEn ? 'Sheltered, higher humidity' : 'Osłonięty, wilgotniej' },
                    { floor: 2, semanticKey: 'floor-1-3', label: isEn ? 'Floor 1 – 3' : 'Piętro 1-3', hint: isEn ? 'Balanced conditions' : 'Zrównoważone warunki' },
                    { floor: 5, semanticKey: 'floor-4-6', label: isEn ? 'Floor 4 – 6' : 'Piętro 4-6', hint: isEn ? 'Breezier microclimate' : 'Przewiewniej' },
                    { floor: 8, semanticKey: 'floor-7-plus', label: isEn ? 'Floor 7+' : 'Piętro 7+', hint: isEn ? 'Strong wind gusts' : 'Mocniejsze powiewy' },
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
                        data-testid={`floor-option-${item.semanticKey}`}
                        data-floor={item.floor}
                        aria-pressed={isSelected}
                        onClick={() => handleSelectFloor(item.floor)}
                        className={`group min-h-[56px] p-3 sm:p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                          isSelected
                            ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 shadow-xs font-bold'
                            : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-800 hover:border-emerald-600 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-stone-750 text-stone-900 dark:text-stone-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold leading-tight">{item.label}</span>
                          {isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                          )}
                        </div>
                        <span className="text-xs text-stone-700 dark:text-stone-300 self-start text-left font-medium leading-tight">{item.hint}</span>
                        <div className="w-full pt-1 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs font-semibold">
                          <span className={isSelected ? 'text-emerald-900 dark:text-emerald-200 font-bold' : 'text-stone-700 dark:text-stone-300 group-hover:text-emerald-700'}>
                            {isSelected ? (isEn ? 'Selected floor' : 'Wybrane piętro') : (isEn ? 'Select' : 'Wybierz')}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-transform'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status / Requirement Warning Banner */}
              {!isStep1Valid && (
                <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-xs shadow-2xs animate-fade-in">
                  <div className="w-7 h-7 rounded-xl bg-amber-200 dark:bg-amber-900/80 flex items-center justify-center shrink-0 font-bold text-amber-900 dark:text-amber-200">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-950 dark:text-amber-100 text-xs">
                      {isEn ? 'Location and floor selection required' : 'Wymagany wybór miejsca'}
                    </div>
                    <div className="text-xs text-amber-900 dark:text-amber-200 font-medium">{getStep1InactivityReason()}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 2: EKSPOZYCJA (WIZUALNA SIATKA + TOOLTIPY) ================= */}
          {step === 2 && (
            <div data-testid="onboarding-step-2" className="space-y-4 animate-fade-in">
              {/* Category Filter for Orientation */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{isEn ? 'Compass orientation' : 'Kierunek świata'}</span>
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    id="sunlight-filter-main-btn"
                    data-testid="sunlight-filter-main"
                    onClick={() => setExposureFilter('main')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                      exposureFilter === 'main'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800'
                    }`}
                  >
                    {isEn ? 'Main (8)' : 'Główne (8)'}
                  </button>
                  <button
                    type="button"
                    id="sunlight-filter-all-btn"
                    data-testid="sunlight-filter-all"
                    onClick={() => setExposureFilter('all')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl font-bold transition cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                      exposureFilter === 'all'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold shadow-xs'
                        : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800'
                    }`}
                  >
                    {isEn ? 'All (23)' : 'Wszystkie (23)'}
                  </button>
                </div>
              </div>

              {/* Non-blocking Recommendation Banner */}
              {recommendedOrientation && (
                <div
                  data-testid="sunlight-recommendation-banner"
                  className="p-3.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 flex items-center justify-between text-xs text-amber-950 dark:text-amber-100 shadow-2xs animate-fade-in"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-200 dark:bg-amber-900/80 flex items-center justify-center shrink-0 text-amber-900 dark:text-amber-200">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold">
                        {isEn ? 'Balcony recommendation: ' : 'Wskazówka dla Twojego balkonu: '}
                      </span>
                      <span className="text-amber-900 dark:text-amber-200 font-medium">
                        {isEn
                          ? `Based on your floor and location, South (${recommendedOrientation}) is typically optimal.`
                          : `Na podstawie wybranego piętra i regionu sugerujemy wystawę południową (${recommendedOrientation}).`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Responsive Compact Grid of Exposure Cards (1 col on mobile, 2 cols on md) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {visibleOrientations.map((item) => {
                  const isSelected = selectedOrientation === item.key;
                  const isRecommended = item.key === recommendedOrientation;
                  const visual = EXPOSURE_VISUALS[item.key] || {
                    title: item.label.split('(')[0].trim(),
                    titleEn: item.label.split('(')[0].trim(),
                    sub: item.badge,
                    subEn: item.badge,
                    icon: <Sun className="w-5 h-5 text-amber-500" />,
                    accentColor: 'hover:border-amber-400',
                  };
                  const isTooltipOpen = activeTooltip === item.key;
                  const sunlightSemanticKey = getSunlightSemanticKey(item.key);

                  return (
                    <div
                      key={item.key}
                      role="button"
                      tabIndex={0}
                      aria-label={isEn ? visual.titleEn : visual.title}
                      aria-pressed={isSelected}
                      data-tooltip-container
                      id={`orient-card-${item.key}`}
                      data-testid={`sunlight-option-${sunlightSemanticKey}`}
                      data-orientation={item.key}
                      data-selected={isSelected ? 'true' : 'false'}
                      onClick={() => handleSelectOrientation(item.key)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectOrientation(item.key);
                        }
                      }}
                      className={`group relative p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer min-h-[56px] flex flex-col justify-between select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                        isSelected
                          ? 'border-2 border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-emerald-500 dark:hover:border-emerald-600 hover:bg-emerald-50/40 dark:hover:bg-stone-850 text-stone-900 dark:text-stone-100 shadow-2xs'
                      }`}
                    >
                      {/* Card Top: Icon + Title + Badges + Help trigger + Select pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              isSelected
                                ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            {visual.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                                {isEn ? visual.titleEn : item.label}
                              </h4>
                              {isRecommended && (
                                <span
                                  data-testid="sunlight-recommended-badge"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100 border border-amber-300 dark:border-amber-700"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-300" />
                                  <span>{isEn ? 'Recommended' : 'Rekomendowane'}</span>
                                </span>
                              )}
                            </div>
                            <span className="inline-block text-xs font-semibold text-stone-700 dark:text-stone-300 mt-0.5">
                              ☀️ {item.badge}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            id={`tooltip-trigger-${item.key}`}
                            data-testid={`sunlight-info-${sunlightSemanticKey}`}
                            aria-label={isEn ? `Show detailed sunlight description for ${visual.titleEn}` : `Pokaż szczegóły dla ${item.label}`}
                            aria-expanded={isTooltipOpen}
                            title={isEn ? 'Show details' : 'Pokaż szczegóły'}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(isTooltipOpen ? null : item.key);
                            }}
                            className={`min-w-11 min-h-11 w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                              isTooltipOpen ? 'text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/70 border-emerald-400' : ''
                            }`}
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold shadow-xs">
                              <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 group-hover:bg-emerald-100 group-hover:text-emerald-900 text-xs font-semibold transition-all">
                              <span>{isEn ? 'Select' : 'Wybierz'}</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Short user-facing description - no long technical explanations inside card */}
                      <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 mt-2 font-medium leading-relaxed">
                        {isEn ? visual.subEn : visual.sub}
                      </p>

                      {/* Progressive disclosure: Expandable detailed description section triggered by visible help control */}
                      {isTooltipOpen && (
                        <div
                          data-testid={`sunlight-details-${sunlightSemanticKey}`}
                          className="mt-3 p-3.5 rounded-xl bg-stone-900 text-white dark:bg-stone-950 dark:border dark:border-stone-700 text-xs shadow-xl animate-fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <strong className="font-bold text-emerald-300 text-sm">{item.label}</strong>
                            <button
                              type="button"
                              onClick={() => setActiveTooltip(null)}
                              className="min-w-11 min-h-11 w-11 h-11 flex items-center justify-center text-stone-300 hover:text-white rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
                              aria-label={isEn ? 'Close details' : 'Zamknij szczegóły'}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-stone-200 text-xs leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="mt-2 pt-2 border-t border-stone-800 text-xs font-medium text-stone-300">
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
                <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 flex items-center gap-3 text-amber-950 dark:text-amber-100 text-xs shadow-2xs animate-fade-in">
                  <div className="w-7 h-7 rounded-xl bg-amber-200 dark:bg-amber-900/80 flex items-center justify-center shrink-0 font-bold text-amber-900 dark:text-amber-200">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-950 dark:text-amber-100">
                      {isEn ? 'Select balcony orientation to unlock "Next"' : 'Wybierz kierunek balkonu, aby odblokować przycisk "Dalej"'}
                    </div>
                    <div className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                      {getStep2InactivityReason()}
                    </div>
                  </div>
                </div>
              )}

              {/* Selected exposure info bar */}
              {selectedOrientation && currentExposure && (
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-300 dark:border-stone-700 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      {isEn ? 'Selected orientation: ' : 'Wybrana ekspozycja: '}
                      <strong className="font-bold text-stone-900 dark:text-stone-100">{currentExposure.label}</strong>
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                    {currentExposure.sunHours}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: DONICE I OPIEKA ================= */}
          {step === 3 && (
            <div data-testid="onboarding-step-3" className="space-y-6 animate-fade-in">
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
                      data-testid="railing-view-dropdown"
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
                      data-testid="railing-view-cards"
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
                      data-testid="railing-select"
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
                            data-testid="railing-dropdown-close"
                            onClick={() => setIsBarierkaDropdownOpen(false)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 hover:text-stone-950 dark:text-stone-200 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
                            aria-label={isEn ? 'Close dropdown' : 'Zamknij listę'}
                            title={isEn ? 'Close dropdown' : 'Zamknij listę'}
                          >
                            <X className="w-5 h-5 stroke-[2.5]" />
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
                                data-testid={`railing-option-${opt.key}`}
                                data-railing={opt.key}
                                onClick={() => {
                                  handleSelectBalconyType(opt.key);
                                  setIsBarierkaDropdownOpen(false);
                                }}
                                className={`group w-full min-h-[48px] p-3 rounded-xl text-left transition-all flex items-start justify-between gap-3 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                                  isSelected
                                    ? 'border-2 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 font-bold shadow-2xs'
                                    : 'border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-stone-900 dark:text-stone-100'
                                }`}
                              >
                                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                  <div className="relative shrink-0 select-none mt-0.5">
                                    <div
                                      className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${opt.iconBg} ${opt.iconBorder} ${
                                        isSelected ? 'ring-2 ring-blue-600/50 scale-[1.03]' : ''
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
                                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                                        {isEn ? opt.badgeEn : opt.badge}
                                      </span>
                                    </div>
                                    <div className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1 leading-snug break-words">
                                      {isEn ? opt.subEn : opt.sub}
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {opt.traits.map((trait, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs border border-stone-300 dark:border-stone-700 font-semibold"
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
                                    <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-2xs">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                  ) : (
                                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs text-stone-700 dark:text-stone-300 font-semibold">
                            {isEn ? 'Clicking an option selects it automatically' : 'Kliknięcie opcji automatycznie zatwierdza wybór'}
                          </span>
                          <button
                            type="button"
                            id="barierka-dropdown-done-btn"
                            data-testid="railing-dropdown-done"
                            onClick={() => setIsBarierkaDropdownOpen(false)}
                            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                          >
                            <span>{isEn ? 'Done' : 'Gotowe'}</span>
                            <Check className="w-4 h-4" />
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
                          data-testid={`railing-card-${opt.key}`}
                          data-railing={opt.key}
                          onClick={() => handleSelectBalconyType(opt.key)}
                          className={`group min-h-[56px] p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                            isSelected
                              ? 'border-2 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 shadow-xs font-bold'
                              : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-stone-900 dark:text-stone-100'
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
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${opt.badgeColor}`}>{isEn ? opt.badgeEn : opt.badge}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                {isSelected ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-blue-800 dark:text-blue-200 font-bold bg-blue-100 dark:bg-blue-900/80 px-2 py-0.5 rounded-md">
                                    <Check className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 stroke-[3]" />
                                    <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                                  </span>
                                ) : (
                                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-snug break-words font-medium">{isEn ? opt.subEn : opt.sub}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {opt.traits.map((trait, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/80 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700"
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
              <div className="space-y-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <Umbrella className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>{isEn ? 'Balcony roof covering' : 'Zadaszenie balkonu'}</span>
                  </label>

                  <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-stone-800 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      id="roofing-view-dropdown-btn"
                      data-testid="roofing-view-dropdown"
                      onClick={() => setRoofingViewMode('dropdown')}
                      className={`min-h-[44px] px-3 py-2 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                        roofingViewMode === 'dropdown'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                          : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Dropdown' : 'Lista rozwijana'}</span>
                    </button>
                    <button
                      type="button"
                      id="roofing-view-cards-btn"
                      data-testid="roofing-view-cards"
                      onClick={() => setRoofingViewMode('cards')}
                      className={`min-h-[44px] px-3 py-2 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                        roofingViewMode === 'cards'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs font-bold'
                          : 'text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Cards' : 'Karty'}</span>
                    </button>
                  </div>
                </div>

                {roofingViewMode === 'dropdown' ? (
                  <div className="relative" data-dropdown-container="roofing">
                    <button
                      type="button"
                      id="balcony-roofing-select"
                      data-testid="roofing-select"
                      onClick={() => setIsRoofingDropdownOpen(!isRoofingDropdownOpen)}
                      className={`w-full min-h-[48px] p-3 rounded-2xl border text-left bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 flex items-center justify-between transition-all cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                        isRoofingDropdownOpen
                          ? 'border-2 border-emerald-700 ring-2 ring-emerald-500/20'
                          : 'border-stone-300 dark:border-stone-700 hover:border-emerald-600'
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
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${selectedRoofingOption.badgeColor}`}>
                              {isEn ? selectedRoofingOption.badgeEn : selectedRoofingOption.badge}
                            </span>
                          </div>
                          <div className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1 leading-snug">
                            {isEn ? selectedRoofingOption.subEn : selectedRoofingOption.sub}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedRoofingOption.traits.map((trait, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-700/60 text-stone-800 dark:text-stone-200 text-xs border border-stone-300 dark:border-stone-700 font-semibold"
                              >
                                {trait.icon}
                                <span>{isEn ? trait.labelEn : trait.label}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-stone-100 dark:bg-stone-700/80 flex items-center justify-center text-stone-700 dark:text-stone-200 shrink-0 ml-2">
                        {isRoofingDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isRoofingDropdownOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white dark:bg-stone-900 rounded-2xl border border-stone-300 dark:border-stone-700 shadow-2xl overflow-hidden animate-fade-in divide-y divide-stone-100 dark:divide-stone-800">
                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
                            {isEn ? 'Select roof covering' : 'Wybierz zadaszenie'}
                          </span>
                          <button
                            type="button"
                            id="roofing-dropdown-close-btn"
                            data-testid="roofing-dropdown-close"
                            onClick={() => setIsRoofingDropdownOpen(false)}
                            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 hover:text-stone-950 dark:text-stone-200 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
                            aria-label={isEn ? 'Close list' : 'Zamknij listę'}
                            title={isEn ? 'Close list' : 'Zamknij listę'}
                          >
                            <X className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </div>

                        <div className="p-2 space-y-2 overflow-y-auto max-h-[28rem]">
                          {ROOFING_OPTIONS.map((opt) => {
                            const isSelected = spec.roofing === opt.key;
                            const roofingDisabledReason = getDisabledOptionReason('roofing', opt.key, spec, language);
                            const isRoofingDisabled = roofingDisabledReason !== null;
                            return (
                              <button
                                type="button"
                                key={opt.key}
                                id={`roofing-opt-${opt.key}`}
                                data-testid={`roofing-option-${opt.key}`}
                                data-roofing={opt.key}
                                disabled={isRoofingDisabled}
                                aria-disabled={isRoofingDisabled ? 'true' : 'false'}
                                onClick={() => {
                                  if (!isRoofingDisabled) {
                                    setSpec({ ...spec, roofing: opt.key });
                                    setIsRoofingDropdownOpen(false);
                                  }
                                }}
                                className={`group w-full min-h-[48px] p-3 rounded-xl text-left transition-all flex flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                                  isRoofingDisabled
                                    ? 'opacity-60 cursor-not-allowed bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-400 dark:border-stone-700'
                                    : isSelected
                                    ? 'border-2 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 font-bold shadow-2xs cursor-pointer'
                                    : 'border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-stone-900 dark:text-stone-100 cursor-pointer'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3 w-full">
                                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                    <div className="relative shrink-0 select-none mt-0.5">
                                      <div
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all shadow-2xs ${opt.iconBg} ${opt.iconBorder} ${
                                          isSelected ? 'ring-2 ring-blue-600/50 scale-[1.03]' : ''
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
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${opt.badgeColor}`}>
                                          {isEn ? opt.badgeEn : opt.badge}
                                        </span>
                                      </div>
                                      <div className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1 leading-snug break-words">
                                        {isEn ? opt.subEn : opt.sub}
                                      </div>
                                      <div className="flex flex-wrap gap-1.5 mt-2">
                                        {opt.traits.map((trait, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs border border-stone-300 dark:border-stone-700 font-semibold"
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
                                      <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-2xs">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                      </div>
                                    ) : (
                                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                    )}
                                  </div>
                                </div>

                                {roofingDisabledReason && (
                                  <div
                                    data-testid={`disabled-reason-roofing-${opt.key}`}
                                    role="tooltip"
                                    className="w-full mt-1 p-2 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-1.5 font-semibold"
                                  >
                                    <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                                    <span>{roofingDisabledReason}</span>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-3.5 py-2.5 bg-stone-50/80 dark:bg-stone-850 flex items-center justify-between">
                          <span className="text-xs text-stone-700 dark:text-stone-300 font-semibold">
                            {isEn ? 'Clicking an option selects it automatically' : 'Kliknięcie opcji automatycznie zatwierdza wybór'}
                          </span>
                          <button
                            type="button"
                            id="roofing-dropdown-done-btn"
                            data-testid="roofing-dropdown-done"
                            onClick={() => setIsRoofingDropdownOpen(false)}
                            className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                          >
                            <span>{isEn ? 'Done' : 'Gotowe'}</span>
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ROOFING_OPTIONS.map((opt) => {
                      const isSelected = spec.roofing === opt.key;
                      const roofingDisabledReason = getDisabledOptionReason('roofing', opt.key, spec, language);
                      const isRoofingDisabled = roofingDisabledReason !== null;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          id={`roofing-card-${opt.key}`}
                          data-testid={`roofing-card-${opt.key}`}
                          data-roofing={opt.key}
                          disabled={isRoofingDisabled}
                          aria-disabled={isRoofingDisabled ? 'true' : 'false'}
                          onClick={() => {
                            if (!isRoofingDisabled) setSpec({ ...spec, roofing: opt.key });
                          }}
                          className={`group min-h-[56px] p-3.5 rounded-2xl border text-left transition-all flex flex-col gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                            isRoofingDisabled
                              ? 'opacity-60 cursor-not-allowed bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-400 dark:border-stone-700'
                              : isSelected
                              ? 'border-2 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 shadow-xs font-bold cursor-pointer'
                              : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-stone-900 dark:text-stone-100 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start gap-3.5 w-full">
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
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${opt.badgeColor}`}>{isEn ? opt.badgeEn : opt.badge}</span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {isSelected ? (
                                    <span className="inline-flex items-center gap-1 text-xs text-blue-800 dark:text-blue-200 font-bold bg-blue-100 dark:bg-blue-900/80 px-2 py-0.5 rounded-md">
                                      <Check className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400 stroke-[3]" />
                                      <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                                    </span>
                                  ) : (
                                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </div>
                              </div>
                              <p className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-snug break-words font-medium">{isEn ? opt.subEn : opt.sub}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {opt.traits.map((trait, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700/80 text-stone-800 dark:text-stone-200 text-xs font-semibold border border-stone-200 dark:border-stone-700"
                                  >
                                    {trait.icon}
                                    <span>{isEn ? trait.labelEn : trait.label}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {roofingDisabledReason && (
                            <div
                              data-testid={`disabled-reason-roofing-${opt.key}`}
                              role="tooltip"
                              className="w-full mt-1 p-2 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-1.5 font-semibold"
                            >
                              <AlertCircle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                              <span>{roofingDisabledReason}</span>
                            </div>
                          )}
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

                {frenchBalconyNotice && (
                  <div
                    data-testid="french-balcony-adjusted-notice"
                    className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 flex items-start gap-2"
                  >
                    <Info className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>{frenchBalconyNotice}</span>
                  </div>
                )}

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
                    const disabledReason = getDisabledOptionReason('pot', item.id, spec, language);
                    const isPotDisabled = disabledReason !== null;
                    const isSelected = spec.pots.includes(item.id as ContainerType);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`pot-type-${item.id}`}
                        data-testid={`pot-option-${item.id}`}
                        data-pot={item.id}
                        aria-label={item.label}
                        disabled={isPotDisabled}
                        aria-disabled={isPotDisabled ? 'true' : 'false'}
                        onClick={() => {
                          if (!isPotDisabled) togglePot(item.id as ContainerType);
                        }}
                        className={`group p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-2 ${
                          isPotDisabled
                            ? 'opacity-60 cursor-not-allowed bg-stone-100 dark:bg-stone-900 border-dashed border-stone-300 dark:border-stone-700'
                            : isSelected
                            ? 'border-2 border-blue-500 bg-blue-50/90 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/20 shadow-xs font-semibold cursor-pointer active:scale-[0.98]'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-stone-700 dark:text-stone-300 cursor-pointer active:scale-[0.98]'
                        }`}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div
                            className={`w-5 h-5 rounded-lg mt-0.5 flex items-center justify-center shrink-0 transition-all duration-150 ${
                              isPotDisabled
                                ? 'border border-stone-300 dark:border-stone-700 bg-stone-200 dark:bg-stone-800 text-stone-400'
                                : isSelected
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
                                {isPotDisabled ? (
                                  <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 px-1.5 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800">
                                    {isEn ? 'Unavailable' : 'Niedostępne'}
                                  </span>
                                ) : isSelected ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100/90 dark:bg-blue-900/70 px-2 py-0.5 rounded-md">
                                    <span>{isEn ? 'Selected' : 'Wybrano'}</span>
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-stone-600 dark:text-stone-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">
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
                        </div>

                        {disabledReason && (
                          <div
                            id={`pot-disabled-reason-${item.id}`}
                            data-testid={`disabled-reason-${item.id}`}
                            role="tooltip"
                            className="w-full mt-1 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-[10.5px] text-amber-800 dark:text-amber-200 flex items-start gap-1.5"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <span>{disabledReason}</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ================= SEKCJA: LICZBA I WYMIARY DONIC ================= */}
              <div className="space-y-3 pt-3 border-t border-stone-200/80 dark:border-stone-800" data-testid="pot-dimensions-section">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{isEn ? 'Pot quantity & dimensions' : 'Liczba i wymiary donic'}</span>
                  </label>
                  <span className="text-[10.5px] text-stone-500 dark:text-stone-400 font-medium">
                    {isEn ? 'Physical constraints' : 'Ograniczenia fizyczne'}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug">
                  {isEn
                    ? 'Define the quantity and exact dimensions of your primary pots for realistic capacity calculations.'
                    : 'Podaj liczbę oraz wymiary donic, aby zweryfikować pojemność podłoża i dopasowanie do roślin.'}
                </p>

                {/* Liczba donic (pot quantity) */}
                <div className="bg-stone-50/80 dark:bg-stone-850 p-3 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="balcony-pot-count-input" className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {isEn ? 'Number of pots (pcs):' : 'Liczba donic (sztuk):'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="balcony-pot-count-input"
                        data-testid="pot-count-input"
                        type="number"
                        min="1"
                        max="150"
                        step="1"
                        value={potCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setPotCount(isNaN(val) ? 0 : val);
                        }}
                        className={`w-24 min-h-[44px] px-3 py-2 rounded-xl border text-sm text-center font-bold transition focus:outline-none focus-visible:ring-2 ${
                          potCount <= 0 || isNaN(potCount)
                            ? 'border-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 focus-visible:ring-red-600'
                            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400'
                        }`}
                        aria-label={isEn ? 'Pot quantity' : 'Liczba donic'}
                      />
                      <span className="text-xs text-stone-700 dark:text-stone-300 font-semibold">szt.</span>
                    </div>
                  </div>

                  {(potCount <= 0 || isNaN(potCount)) && (
                    <div data-testid="pot-count-error" role="alert" className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{isEn ? 'Pot quantity must be at least 1.' : 'Liczba donic musi być większa od zera (minimum 1 donica).'}</span>
                    </div>
                  )}
                </div>

                {/* Kształt donicy (Shape selection) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {isEn ? 'Container shape:' : 'Kształt donicy:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      data-testid="pot-shape-rectangular"
                      onClick={() => setPotShape('rectangular')}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                        potShape === 'rectangular'
                          ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-600'
                      }`}
                    >
                      {potShape === 'rectangular' && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[3]" />}
                      <span>{isEn ? 'Rectangular box' : 'Skrzynka / prostokątna'}</span>
                    </button>
                    <button
                      type="button"
                      data-testid="pot-shape-round"
                      onClick={() => setPotShape('round')}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                        potShape === 'round'
                          ? 'border-2 border-emerald-700 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-emerald-600'
                      }`}
                    >
                      {potShape === 'round' && <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 stroke-[3]" />}
                      <span>{isEn ? 'Round pot / bucket' : 'Okrągła / wiadro'}</span>
                    </button>
                  </div>
                </div>

                {/* Wymiary geometryczne (Dimensions inputs) */}
                <div className="bg-stone-50/80 dark:bg-stone-850 p-3 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {potShape === 'rectangular' ? (
                      <>
                        <div>
                          <label htmlFor="pot-length-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            {isEn ? 'Length (cm)' : 'Długość (cm)'}
                          </label>
                          <input
                            id="pot-length-input"
                            data-testid="pot-length-input"
                            type="number"
                            value={potLength}
                            onChange={(e) => setPotLength(parseFloat(e.target.value) || 0)}
                            className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus-visible:ring-2 ${
                              potLength <= 0
                                ? 'border-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 focus-visible:ring-red-600'
                                : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400'
                            }`}
                          />
                        </div>
                        <div>
                          <label htmlFor="pot-width-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            {isEn ? 'Width (cm)' : 'Szerokość (cm)'}
                          </label>
                          <input
                            id="pot-width-input"
                            data-testid="pot-width-input"
                            type="number"
                            value={potWidth}
                            onChange={(e) => setPotWidth(parseFloat(e.target.value) || 0)}
                            className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus-visible:ring-2 ${
                              potWidth <= 0
                                ? 'border-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 focus-visible:ring-red-600'
                                : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400'
                            }`}
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label htmlFor="pot-diameter-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          {isEn ? 'Diameter (cm)' : 'Średnica (cm)'}
                        </label>
                        <input
                          id="pot-diameter-input"
                          data-testid="pot-diameter-input"
                          type="number"
                          value={potDiameter}
                          onChange={(e) => setPotDiameter(parseFloat(e.target.value) || 0)}
                          className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus-visible:ring-2 ${
                            potDiameter <= 0
                              ? 'border-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 focus-visible:ring-red-600'
                              : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400'
                          }`}
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="pot-height-input" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {isEn ? 'Depth / Height (cm)' : 'Głębokość (cm)'}
                      </label>
                      <input
                        id="pot-height-input"
                        data-testid="pot-height-input"
                        type="number"
                        value={potHeight}
                        onChange={(e) => setPotHeight(parseFloat(e.target.value) || 0)}
                        className={`w-full min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus-visible:ring-2 ${
                          potHeight <= 0
                            ? 'border-2 border-red-600 dark:border-red-400 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-100 focus-visible:ring-red-600'
                            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Negative or invalid dimensions error display */}
                  {potDimensionsErrors.length > 0 && (
                    <div data-testid="pot-dimensions-error" role="alert" className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                      <span>{potDimensionsErrors[0].message}</span>
                    </div>
                  )}

                  {/* Volume calculation and capacity verification */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div data-testid="calculated-pot-volume" className="text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isEn ? `Calculated volume: ~${calculatedPotVolume} L` : `Obliczona pojemność: ~${calculatedPotVolume} l`}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <label htmlFor="pot-volume-input" className="text-xs text-stone-700 dark:text-stone-300 font-semibold">
                        {isEn ? 'Declared (opt.):' : 'Deklarowana (opcjonalnie):'}
                      </label>
                      <input
                        id="pot-volume-input"
                        data-testid="pot-volume-input"
                        type="number"
                        placeholder={`${calculatedPotVolume}`}
                        value={potVolume ?? ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setPotVolume(isNaN(val) ? undefined : val);
                        }}
                        className="w-20 min-h-[44px] px-2.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-bold text-center text-stone-900 dark:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
                      />
                      <span className="text-xs font-bold text-stone-600 dark:text-stone-400">l</span>
                    </div>
                  </div>

                  {/* Presets */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-700 dark:text-stone-300 font-bold mr-1">{isEn ? 'Presets:' : 'Wzorce:'}</span>
                    <button
                      type="button"
                      data-testid="preset-box60"
                      onClick={() => {
                        setPotShape('rectangular');
                        setPotLength(60);
                        setPotWidth(20);
                        setPotHeight(18);
                        setPotVolume(21);
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/50 text-stone-900 dark:text-stone-100 font-bold border border-stone-300 dark:border-stone-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 flex items-center justify-center"
                    >
                      Skrzynka 60 cm
                    </button>
                    <button
                      type="button"
                      data-testid="preset-pot30"
                      onClick={() => {
                        setPotShape('round');
                        setPotDiameter(30);
                        setPotHeight(25);
                        setPotVolume(17);
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/50 text-stone-900 dark:text-stone-100 font-bold border border-stone-300 dark:border-stone-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 flex items-center justify-center"
                    >
                      Donica Ø30 cm
                    </button>
                    <button
                      type="button"
                      data-testid="preset-large40"
                      onClick={() => {
                        setPotShape('rectangular');
                        setPotLength(40);
                        setPotWidth(40);
                        setPotHeight(35);
                        setPotVolume(56);
                      }}
                      className="min-h-[44px] px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-emerald-50 dark:bg-stone-800 dark:hover:bg-emerald-950/50 text-stone-900 dark:text-stone-100 font-bold border border-stone-300 dark:border-stone-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 flex items-center justify-center"
                    >
                      Duża 40×40 cm
                    </button>
                  </div>
                </div>
              </div>

              {/* Czas na podlewanie */}
              <div className="space-y-2.5 pt-3 border-t border-stone-200 dark:border-stone-800">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                  <span>{isEn ? 'How much time do you have for watering?' : 'Ile masz czasu na podlewanie?'}</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'daily', label: isEn ? 'Daily' : 'Codziennie', sub: isEn ? 'Morning and evening' : 'Mogę rano i wieczorem' },
                    { id: 'few_days', label: isEn ? 'Every 2–3 days' : 'Co 2–3 dni', sub: isEn ? 'Balanced routine' : 'Zrównoważona opieka' },
                    { id: 'weekends', label: isEn ? 'Mainly weekends' : 'Głównie weekendy', sub: isEn ? 'Drought-tolerant plants' : 'Rośliny odporne na suszę' },
                  ].map((item) => {
                    const careDisabledReason = getDisabledOptionReason('care', item.id, {
                      ...spec,
                      floor: selectedFloor ?? spec.floor,
                    }, language);
                    const isCareDisabled = careDisabledReason !== null;
                    const isSelected = spec.care_time === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`care-time-${item.id}`}
                        data-testid={`care-option-${item.id}`}
                        data-care={item.id}
                        aria-label={item.label}
                        disabled={isCareDisabled}
                        aria-disabled={isCareDisabled ? 'true' : 'false'}
                        onClick={() => {
                          if (!isCareDisabled) setSpec({ ...spec, care_time: item.id as CareTime });
                        }}
                        className={`group min-h-[56px] p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                          isCareDisabled
                            ? 'opacity-60 cursor-not-allowed bg-stone-100 dark:bg-stone-900 border-2 border-dashed border-stone-400 dark:border-stone-700'
                            : isSelected
                            ? 'border-2 border-blue-700 dark:border-blue-400 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-100 font-bold shadow-xs cursor-pointer'
                            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-stone-900 dark:text-stone-100 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm text-stone-900 dark:text-stone-100">{item.label}</span>
                            {isSelected ? (
                              <Check className="w-4 h-4 text-blue-700 dark:text-blue-400 stroke-[3]" />
                            ) : (
                              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform" />
                            )}
                          </div>
                          <div className="text-xs text-stone-700 dark:text-stone-300 mt-1 leading-snug font-medium">{item.sub}</div>
                        </div>

                        {careDisabledReason && (
                          <div
                            id={`care-disabled-reason-${item.id}`}
                            data-testid={`disabled-reason-care-${item.id}`}
                            role="tooltip"
                            className="mt-2 p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs text-amber-950 dark:text-amber-100 flex items-start gap-1 font-semibold"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
                            <span>{careDisabledReason}</span>
                          </div>
                        )}

                        <div className="mt-2 pt-1.5 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs">
                          <span className={isSelected ? 'text-blue-800 dark:text-blue-300 font-bold' : 'text-stone-700 dark:text-stone-300 group-hover:text-blue-800'}>
                            {isCareDisabled ? (isEn ? 'Unavailable' : 'Niedostępne') : isSelected ? (isEn ? 'Active' : 'Wybrano') : (isEn ? 'Choose' : 'Wybierz')}
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-transform'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= STICKY ACTION FOOTER WITH "DALEJ" / "ZAPISZ I PRZEJDŹ" ================= */}
        <div
          data-testid="onboarding-footer"
          className="sticky bottom-0 z-20 shrink-0 border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur p-3.5 sm:p-5 shadow-xl flex flex-col gap-2.5"
        >
          {/* Visible helper message when CTA is disabled */}
          {((step < 3 && isNextDisabled) || (step === 3 && isSaveDisabled)) && (
            <div
              data-testid="onboarding-cta-helper"
              role="status"
              className="text-xs text-amber-950 dark:text-amber-100 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-3.5 py-2 rounded-xl flex items-center gap-2 animate-fade-in font-semibold"
            >
              <Info className="w-4 h-4 shrink-0 text-amber-700 dark:text-amber-400" />
              <span>
                {step === 1
                  ? getStep1InactivityReason()
                  : step === 2
                  ? getStep2InactivityReason()
                  : getStep3InactivityReason()}
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
              {step > 1 ? (
                <button
                  type="button"
                  id="wizard-prev-step-btn"
                  data-testid="onboarding-prev"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="min-h-[44px] min-w-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isEn ? 'Back' : 'Wstecz'}</span>
                </button>
              ) : onClose && !isFirstTime ? (
                <button
                  type="button"
                  id="cancel-setup-btn"
                  data-testid="onboarding-cancel"
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] px-4 py-2.5 text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-300 dark:border-stone-700 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                >
                  {isEn ? 'Cancel' : 'Anuluj'}
                </button>
              ) : null}

              <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 font-bold">
                <span>{isEn ? `Step ${step} of 3` : `Krok ${step} z 3`}</span>
                {completedStepsCount > 0 && (
                  <>
                    <span className="text-stone-400 dark:text-stone-600">•</span>
                    <span className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-bold">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{isEn ? `Completed ${completedStepsCount}/3` : `Ukończono ${completedStepsCount}/3`}</span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              {step < 3 ? (
                <button
                  type="button"
                  id="wizard-next-step-btn"
                  data-testid="onboarding-next"
                  disabled={isNextDisabled}
                  aria-disabled={isNextDisabled}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isNextDisabled) return;
                    setStep((s) => (s + 1) as 1 | 2 | 3);
                  }}
                  className={`w-full sm:w-auto min-h-[44px] min-w-[44px] px-7 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                    isNextDisabled
                      ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700 cursor-not-allowed opacity-75'
                      : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white shadow-md hover:shadow-lg ring-1 ring-emerald-600 cursor-pointer'
                  }`}
                >
                  <span>{isEn ? 'Next' : 'Dalej'}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              ) : (
                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto gap-2">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      id="save-balcony-spec-btn"
                      data-testid="onboarding-save-and-continue"
                      disabled={isSaveDisabled}
                      aria-disabled={isSaveDisabled}
                      onClick={() => handleSave()}
                      className={`w-full sm:w-auto min-h-[44px] min-w-[44px] px-7 py-3 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                        isSaveDisabled
                          ? 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-300 dark:border-stone-700 cursor-not-allowed opacity-75'
                          : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white shadow-md hover:shadow-lg ring-1 ring-emerald-600 cursor-pointer'
                      }`}
                      aria-describedby="save-balcony-benefit-text"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-200" />
                      <span>{isEn ? 'Save & Continue' : 'Zapisz i przejdź'}</span>
                    </button>

                    <button
                      type="button"
                      id="save-balcony-info-btn"
                      data-testid="onboarding-save-info"
                      onClick={() => setActiveTooltip(activeTooltip === 'save-btn' ? null : 'save-btn')}
                      className="min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center p-3 text-stone-700 hover:text-emerald-800 dark:text-stone-300 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition cursor-pointer border border-stone-300 dark:border-stone-700 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
                      aria-label={isEn ? 'Why save and continue?' : 'Dlaczego warto zapisać i przejść?'}
                      title={isEn ? 'Why save and continue?' : 'Dlaczego warto zapisać i przejść?'}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    modalTarget
  );
};
