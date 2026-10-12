import {
  PolandRegionKey,
  Orientation,
  BalconyType,
  RoofingType,
  ContainerType,
  CareTime,
  PotShape,
  UserBalconySpec,
} from '../types';

/**
 * 1. TYPED DOMAIN MODEL DEFINITIONS
 */

// 1.1 Region Domain Model
export const POLAND_REGIONS_LIST: readonly PolandRegionKey[] = [
  'dolnoslaskie',
  'kujawsko_pomorskie',
  'lubelskie',
  'lubuskie',
  'lodzkie',
  'malopolskie',
  'mazowieckie',
  'opolskie',
  'podkarpackie',
  'podlaskie',
  'pomorskie',
  'slaskie',
  'swietokrzyskie',
  'warminsko_mazurskie',
  'wielkopolskie',
  'zachodniopomorskie',
] as const;

export interface BalconyRegionDomain {
  key: PolandRegionKey;
  displayNamePl: string;
  frostShiftDays: number;
}

// 1.2 Floor Domain Model
export const MIN_FLOOR = 0;
export const MAX_FLOOR = 30;

export interface BalconyFloorDomain {
  floor: number;
  category: 'parter' | 'niskie' | 'srednie' | 'wysokie';
  isGround: boolean;
  isHighFloor: boolean;
}

// 1.3 Exposure / Orientation Domain Model
export const VALID_ORIENTATIONS: readonly string[] = [
  'S', 'E', 'W', 'N', 'SE', 'SW', 'NE', 'NW',
  'SSE', 'SSW', 'ESE', 'ENE', 'WSW', 'WNW', 'NNE', 'NNW',
  'S_W', 'S_E', 'N_W', 'N_E', 'E_W', 'PATIO', 'DACH',
] as const;

export interface BalconyExposureDomain {
  orientation: Orientation;
  isDeepShade: boolean;
  isHighSun: boolean;
}

// 1.4 Balcony Conditions Domain Model
export interface BalconyConditionsDomain {
  balconyType: BalconyType;
  roofing: RoofingType;
  hasFloorSlab: boolean; // false for French balcony
  isRecessed: boolean;   // true for loggia
  hasOpenRailing: boolean; // true for open_rail
}

// 1.5 Pot Count and Dimensions Domain Model
export interface PotDimensionsDomain {
  shape: PotShape;
  length_cm?: number;
  width_cm?: number;
  diameter_cm?: number;
  height_cm: number;
  volume_liters?: number;
  unit?: 'cm' | 'm' | 'mm';
}

export interface PotConfigDomain {
  count: number;
  dimensions: PotDimensionsDomain;
  calculatedVolumeLiters: number;
}

// Unified Onboarding Domain Profile
export interface OnboardingProfileDomain {
  region: PolandRegionKey;
  floor: number;
  orientation: Orientation;
  balcony_type: BalconyType;
  roofing: RoofingType;
  pots: ContainerType[];
  care_time: CareTime;
  pot_count?: number;
  pot_dimensions?: PotDimensionsDomain;
}

/**
 * 2. VALIDATION INTERFACES & RESULT TYPES
 */

export interface ValidationErrorItem {
  field: string;
  code: string;
  message: string;
  messageEn?: string;
  isCrossField?: boolean;
}

export interface DomainValidationResult {
  isValid: boolean;
  errors: ValidationErrorItem[];
  fieldErrors: Record<string, string>;
  crossFieldErrors: string[];
  summaryMessage: string;
}

/**
 * 3. THEORETICAL VOLUME AND CAPACITY UTILITIES
 */

export { calculatePotVolume } from '../features/onboarding/utils/calculatePotVolume';

/**
 * Calculates theoretical container volume in liters from dimensions (all in cm)
 */
export function calculatePotVolumeLiters(dimensions: PotDimensionsDomain): number {
  const { shape, length_cm, width_cm, diameter_cm, height_cm } = dimensions;
  if (!height_cm || height_cm <= 0) return 0;

  if (shape === 'round') {
    const d = diameter_cm || 0;
    if (d <= 0) return 0;
    const radius = d / 2;
    // Volume in cm3 = PI * r^2 * h; Liters = cm3 / 1000
    const cm3 = Math.PI * Math.pow(radius, 2) * height_cm;
    return Number(((cm3 / 1000)).toFixed(1));
  } else {
    const l = length_cm || 0;
    const w = width_cm || 0;
    if (l <= 0 || w <= 0) return 0;
    // Volume in cm3 = l * w * h; Liters = cm3 / 1000
    const volumeLiters = (l * w * height_cm) / 1000;
    return Number(volumeLiters.toFixed(1));
  }
}

/**
 * 4. INDIVIDUAL FIELD VALIDATION FUNCTIONS
 */

export function validateRegion(
  region: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem | null {
  const isEn = language === 'en';
  if (!region || typeof region !== 'string' || region.trim() === '') {
    return {
      field: 'region',
      code: 'REQUIRED_LOCATION',
      message: isEn
        ? 'Please select your balcony location (province/city) to proceed.'
        : 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.',
    };
  }

  if (!POLAND_REGIONS_LIST.includes(region as PolandRegionKey)) {
    return {
      field: 'region',
      code: 'INVALID_LOCATION',
      message: isEn
        ? `Unknown region "${region}". Please choose a valid Polish voivodeship.`
        : `Nieznany region "${region}". Wybierz prawidłowe polskie województwo z listy.`,
    };
  }

  return null;
}

export function validateFloor(
  floor: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem | null {
  const isEn = language === 'en';
  if (floor === null || floor === undefined || floor === '') {
    return {
      field: 'floor',
      code: 'REQUIRED_FLOOR',
      message: isEn
        ? 'Please select the floor of your balcony to proceed.'
        : 'Wybierz piętro, na którym znajduje się Twój balkon, aby przejść dalej.',
    };
  }

  const num = typeof floor === 'number' ? floor : Number(floor);
  if (isNaN(num)) {
    return {
      field: 'floor',
      code: 'INVALID_FLOOR_TYPE',
      message: isEn
        ? 'Floor must be a valid number.'
        : 'Numer piętra musi być prawidłową liczbą.',
    };
  }

  if (!Number.isInteger(num)) {
    return {
      field: 'floor',
      code: 'FLOOR_NOT_INTEGER',
      message: isEn
        ? 'Floor must be an integer (e.g. 0 for ground floor, 1, 2).'
        : 'Numer piętra musi być liczbą całkowitą (np. 0 dla parteru, 1, 2).',
    };
  }

  if (num < MIN_FLOOR) {
    return {
      field: 'floor',
      code: 'NEGATIVE_FLOOR',
      message: isEn
        ? `Floor cannot be negative (minimum is ground floor: ${MIN_FLOOR}).`
        : `Numer piętra nie może być ujemny (minimum to parter: ${MIN_FLOOR}).`,
    };
  }

  if (num > MAX_FLOOR) {
    return {
      field: 'floor',
      code: 'EXCEEDED_MAX_FLOOR',
      message: isEn
        ? `Maximum supported floor in residential buildings is ${MAX_FLOOR}.`
        : `Maksymalne dopuszczalne piętro w budynku mieszkalnym to ${MAX_FLOOR}.`,
    };
  }

  return null;
}

export function validateExposure(
  orientation: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem | null {
  const isEn = language === 'en';
  if (!orientation || typeof orientation !== 'string' || orientation.trim() === '') {
    return {
      field: 'orientation',
      code: 'REQUIRED_EXPOSURE',
      message: isEn
        ? 'Please select the sun exposure / orientation of your balcony to proceed.'
        : 'Wybierz kierunek świata (ekspozycję) swojego balkonu, aby przejść dalej.',
    };
  }

  if (!VALID_ORIENTATIONS.includes(orientation)) {
    return {
      field: 'orientation',
      code: 'INVALID_EXPOSURE',
      message: isEn
        ? `Invalid orientation "${orientation}".`
        : `Nieprawidłowy kierunek świata "${orientation}".`,
    };
  }

  return null;
}

export function validateBalconyConditions(
  balconyType: unknown,
  roofing: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem[] {
  const isEn = language === 'en';
  const errors: ValidationErrorItem[] = [];
  const validBalconyTypes: BalconyType[] = ['open_rail', 'solid_wall', 'loggia', 'french'];
  const validRoofingTypes: RoofingType[] = ['covered', 'uncovered'];

  if (!balconyType || typeof balconyType !== 'string' || !validBalconyTypes.includes(balconyType as BalconyType)) {
    errors.push({
      field: 'balcony_type',
      code: 'INVALID_BALCONY_TYPE',
      message: isEn
        ? 'Please select a valid railing/balcony type.'
        : 'Wybierz prawidłowy typ balustrady balkonu.',
    });
  }

  if (!roofing || typeof roofing !== 'string' || !validRoofingTypes.includes(roofing as RoofingType)) {
    errors.push({
      field: 'roofing',
      code: 'INVALID_ROOFING_TYPE',
      message: isEn
        ? 'Please select whether your balcony is covered or uncovered.'
        : 'Wybierz zadaszenie balkonu (zadaszony lub niezadaszony).',
    });
  }

  return errors;
}

export function validateContainers(
  pots: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem | null {
  const isEn = language === 'en';
  if (!Array.isArray(pots) || pots.length === 0) {
    return {
      field: 'pots',
      code: 'REQUIRED_CONTAINERS',
      message: isEn
        ? 'Please select at least one container type to proceed.'
        : 'Wybierz co najmniej jeden rodzaj donicy, aby zapisać konfigurację.',
    };
  }

  const validPotTypes: ContainerType[] = [
    'boxes_balcony_15cm',
    'pots_medium_5_15',
    'pots_large_15_30',
    'grow_bags',
    'hanging_baskets',
  ];

  for (const p of pots) {
    if (typeof p !== 'string' || !validPotTypes.includes(p as ContainerType)) {
      return {
        field: 'pots',
        code: 'INVALID_CONTAINER_TYPE',
        message: isEn
          ? `Unknown container type "${p}".`
          : `Nieznany rodzaj pojemnika "${p}".`,
      };
    }
  }

  return null;
}

export function validateCareTime(
  careTime: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem | null {
  const isEn = language === 'en';
  const validCare: CareTime[] = ['daily', 'few_days', 'weekends'];
  if (!careTime || typeof careTime !== 'string' || !validCare.includes(careTime as CareTime)) {
    return {
      field: 'care_time',
      code: 'REQUIRED_CARE_TIME',
      message: isEn
        ? 'Please select how often you can water plants.'
        : 'Wybierz częstotliwość podlewania, aby zapisać konfigurację.',
    };
  }

  return null;
}

export function validatePotQuantity(
  potCount: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem | null {
  const isEn = language === 'en';
  if (potCount === undefined || potCount === null || potCount === '') {
    return null; // Optional if only using container types, but when provided must be valid
  }

  const num = typeof potCount === 'number' ? potCount : Number(potCount);
  if (isNaN(num)) {
    return {
      field: 'pot_count',
      code: 'INVALID_POT_COUNT',
      message: isEn ? 'Pot quantity must be a valid number.' : 'Liczba donic musi być prawidłową liczbą.',
    };
  }

  if (!Number.isInteger(num)) {
    return {
      field: 'pot_count',
      code: 'POT_COUNT_NOT_INTEGER',
      message: isEn ? 'Pot quantity must be an integer.' : 'Liczba donic musi być liczbą całkowitą.',
    };
  }

  if (num <= 0) {
    return {
      field: 'pot_count',
      code: 'NON_POSITIVE_POT_COUNT',
      message: isEn
        ? 'Pot quantity must be greater than zero (minimum 1 pot).'
        : 'Liczba donic musi być większa od zera (minimum 1 donica).',
    };
  }

  if (num > 150) {
    return {
      field: 'pot_count',
      code: 'EXCESSIVE_POT_COUNT',
      message: isEn
        ? 'Pot quantity exceeds reasonable residential balcony capacity (maximum 150).'
        : 'Liczba donic przekracza typową ładowność balkonu mieszkalnego (maksymalnie 150 donic).',
    };
  }

  return null;
}

export function validatePotDimensions(
  dimensions: unknown,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem[] {
  const isEn = language === 'en';
  if (!dimensions || typeof dimensions !== 'object') return [];

  const errors: ValidationErrorItem[] = [];
  const dims = dimensions as PotDimensionsDomain;

  // Depth / height validation
  if (dims.height_cm !== undefined && dims.height_cm !== null) {
    const h = Number(dims.height_cm);
    if (isNaN(h) || h <= 0) {
      errors.push({
        field: 'pot_dimensions.height_cm',
        code: 'NON_POSITIVE_HEIGHT',
        message: isEn
          ? 'Pot depth / height must be greater than zero.'
          : 'Głębokość donicy musi być dodatnia (większa od zera).',
      });
    } else if (h < 4) {
      errors.push({
        field: 'pot_dimensions.height_cm',
        code: 'TOO_SHALLOW_POT',
        message: isEn
          ? 'Pot depth is too shallow for viable cultivation (minimum 4 cm).'
          : 'Głębokość donicy jest zbyt mała na uprawę roślin (minimum 4 cm).',
      });
    } else if (h > 150) {
      errors.push({
        field: 'pot_dimensions.height_cm',
        code: 'EXCESSIVE_HEIGHT',
        message: isEn
          ? 'Pot depth exceeds balcony safety limits (maximum 150 cm).'
          : 'Głębokość donicy przekracza bezpieczną wysokość balkonu (maks. 150 cm).',
      });
    }
  }

  // Rectangular shape dimensions
  if (dims.shape === 'rectangular') {
    if (dims.length_cm !== undefined && dims.length_cm !== null) {
      const l = Number(dims.length_cm);
      if (isNaN(l) || l <= 0) {
        errors.push({
          field: 'pot_dimensions.length_cm',
          code: 'NON_POSITIVE_LENGTH',
          message: isEn
            ? 'Planter length must be greater than zero.'
            : 'Długość skrzynki musi być dodatnia (większa od zera).',
        });
      } else if (l > 350) {
        errors.push({
          field: 'pot_dimensions.length_cm',
          code: 'EXCESSIVE_LENGTH',
          message: isEn
            ? 'Planter length exceeds standard balcony railings (maximum 350 cm).'
            : 'Długość skrzynki przekracza typowy wymiar barierki balkonowej (maks. 350 cm).',
        });
      }
    }

    if (dims.width_cm !== undefined && dims.width_cm !== null) {
      const w = Number(dims.width_cm);
      if (isNaN(w) || w <= 0) {
        errors.push({
          field: 'pot_dimensions.width_cm',
          code: 'NON_POSITIVE_WIDTH',
          message: isEn
            ? 'Planter width must be greater than zero.'
            : 'Szerokość skrzynki musi być dodatnia (większa od zera).',
        });
      } else if (w > 200) {
        errors.push({
          field: 'pot_dimensions.width_cm',
          code: 'EXCESSIVE_WIDTH',
          message: isEn
            ? 'Planter width exceeds balcony floor depth (maximum 200 cm).'
            : 'Szerokość donicy przekracza szerokość posadzki balkonu (maks. 200 cm).',
        });
      }
    }
  }

  // Round shape diameter
  if (dims.shape === 'round') {
    if (dims.diameter_cm !== undefined && dims.diameter_cm !== null) {
      const d = Number(dims.diameter_cm);
      if (isNaN(d) || d <= 0) {
        errors.push({
          field: 'pot_dimensions.diameter_cm',
          code: 'NON_POSITIVE_DIAMETER',
          message: isEn
            ? 'Pot diameter must be greater than zero.'
            : 'Średnica donicy musi być dodatnia (większa od zera).',
        });
      } else if (d > 200) {
        errors.push({
          field: 'pot_dimensions.diameter_cm',
          code: 'EXCESSIVE_DIAMETER',
          message: isEn
            ? 'Pot diameter exceeds safe balcony dimensions (maximum 200 cm).'
            : 'Średnica donicy przekracza bezpieczny wymiar balkonu (maks. 200 cm).',
        });
      }
    }
  }

  // Capacity / Volume verification against physical dimensions
  if (dims.volume_liters !== undefined && dims.volume_liters !== null && !isNaN(Number(dims.volume_liters))) {
    const vol = Number(dims.volume_liters);
    if (isNaN(vol) || vol <= 0) {
      errors.push({
        field: 'pot_dimensions.volume_liters',
        code: 'NON_POSITIVE_VOLUME',
        message: isEn
          ? 'Pot volume must be greater than zero liters.'
          : 'Pojemność donicy musi być większa od zera litrów.',
      });
    } else {
      const calculatedVol = calculatePotVolumeLiters(dims);
      if (calculatedVol > 0) {
        // Tolerates reasonable variation (pot taper, soil line margin) up to factor of 2.5x,
        // but catches unit errors (e.g. entering mm^3 or ml as liters, or dimensions in meters entered as cm).
        const ratio = vol / calculatedVol;
        if (ratio < 0.25 || ratio > 3.0) {
          errors.push({
            field: 'pot_dimensions.volume_liters',
            code: 'CAPACITY_DIMENSIONS_MISMATCH',
            message: isEn
              ? `Specified volume (${vol} L) deviates significantly from geometric capacity (${calculatedVol} L). Please verify units (cm and liters).`
              : `Podana pojemność (${vol} l) znacząco odbiega od pojemności geometrycznej (${calculatedVol} l). Sprawdź jednostki wymiarów (cm) i objętości (litry).`,
          });
        }
      }
    }
  }

  return errors;
}

/**
 * 5. CROSS-FIELD COMBINATION VALIDATION
 */

export function validateCrossFieldCombinations(
  spec: Partial<UserBalconySpec> | null | undefined,
  language: 'pl' | 'en' = 'pl'
): ValidationErrorItem[] {
  const isEn = language === 'en';
  const errors: ValidationErrorItem[] = [];
  if (!spec) return errors;

  const { balcony_type, pots, floor, orientation, roofing, care_time } = spec;

  // RULE 1: French Balcony without floor slab cannot accommodate heavy standing floor containers
  if (balcony_type === 'french' && Array.isArray(pots)) {
    const floorOnlyPots: ContainerType[] = ['pots_large_15_30', 'grow_bags', 'pots_medium_5_15'];
    const invalidSelected = pots.filter((p) => floorOnlyPots.includes(p));

    if (invalidSelected.includes('pots_large_15_30')) {
      errors.push({
        field: 'pots',
        code: 'INCOMPATIBLE_FRENCH_LARGE_POTS',
        isCrossField: true,
        message: isEn
          ? 'A French balcony has no floor slab — large floor containers / buckets (15-30L) cannot be placed on it.'
          : 'Balkon francuski nie posiada płyty posadzkowej — wyklucza to duże donice stojące na podłodze (15–30L).',
      });
    }

    if (invalidSelected.includes('grow_bags')) {
      errors.push({
        field: 'pots',
        code: 'INCOMPATIBLE_FRENCH_GROW_BAGS',
        isCrossField: true,
        message: isEn
          ? 'Fabric grow bags require a solid balcony floor and cannot be safely used on a French balcony.'
          : 'Worki z tkaniny uprawowej wymagają podłogi balkonowej i nie mogą być stabilnie umieszczone na balkonie francuskim.',
      });
    }
  }

  // RULE 2: French Balcony with covered roofing
  if (balcony_type === 'french' && roofing === 'covered') {
    errors.push({
      field: 'roofing',
      code: 'INCOMPATIBLE_FRENCH_COVERED_ROOF',
      isCrossField: true,
      message: isEn
        ? 'A French balcony is an exterior window barrier without a separate balcony ceiling slab. Please select "Uncovered (Open Sky)".'
        : 'Balkon francuski (portfenetr) to barierka w otworze ściennym bez stropu balkonowego — wybierz "Balkon niezadaszony (Otwarte niebo)".',
    });
  }

  // RULE 3: Extreme high floor wind + open railing + uncovered + weekend-only watering
  if (
    typeof floor === 'number' &&
    floor >= 7 &&
    balcony_type === 'open_rail' &&
    roofing === 'uncovered' &&
    care_time === 'weekends'
  ) {
    errors.push({
      field: 'care_time',
      code: 'INCOMPATIBLE_HIGH_FLOOR_DROUGHT_RISK',
      isCrossField: true,
      message: isEn
        ? 'On high floors (7+) with an open railing and no roof covering, intense wind rapidly dries substrate. Watering only on weekends will lead to severe crop drought.'
        : 'Na wysokim piętrze (7+) z ażurową barierką i brakiem zadaszenia silny wiatr wysusza ziemię w kilka godzin. Podlewanie wyłącznie w weekendy doprowadzi do uschnięcia upraw.',
    });
  }

  return errors;
}

/**
 * 6. EXPLANATION HELPER FOR DISABLED OPTIONS (REQUIREMENTS 4 & 5)
 * Returns the exact Polish explanation why a specific option is disabled,
 * or null if the option is active and valid.
 */
export function getDisabledOptionReason(
  optionType: 'pot' | 'roofing' | 'care',
  optionKey: string,
  currentSpec: Partial<UserBalconySpec>,
  language: 'pl' | 'en' = 'pl'
): string | null {
  const isEn = language === 'en';

  if (optionType === 'pot') {
    if (currentSpec.balcony_type === 'french') {
      if (optionKey === 'pots_large_15_30') {
        return isEn
          ? 'Disabled for French balcony: No floor slab exists to support large floor containers.'
          : 'Opcja niedostępna dla balkonu francuskiego: brak płyty posadzkowej wyklucza duże donice stojące.';
      }
      if (optionKey === 'grow_bags') {
        return isEn
          ? 'Disabled for French balcony: Grow bags require a stable floor plate.'
          : 'Opcja niedostępna dla balkonu francuskiego: worki uprawowe wymagają stabilnej posadzki balkonowej.';
      }
      if (optionKey === 'pots_medium_5_15') {
        return isEn
          ? 'Disabled for French balcony: Free-standing pots require floor space. Use railing planters instead.'
          : 'Opcja niedostępna dla balkonu francuskiego: donice stojące wymagają posadzki. Użyj skrzynek na barierkę.';
      }
    }
  }

  if (optionType === 'roofing') {
    if (currentSpec.balcony_type === 'french' && optionKey === 'covered') {
      return isEn
        ? 'Disabled: French balconies consist of a window barrier and do not have an overhanging balcony slab.'
        : 'Niedostępne dla portfenetru: balkon francuski to okno z poręczą bez wysuniętego stropu balkonowego.';
    }
  }

  if (optionType === 'care') {
    if (
      typeof currentSpec.floor === 'number' &&
      currentSpec.floor >= 7 &&
      currentSpec.balcony_type === 'open_rail' &&
      currentSpec.roofing === 'uncovered' &&
      optionKey === 'weekends'
    ) {
      return isEn
        ? 'Disabled: Severe winds on high floors dry soil rapidly. Watering only on weekends will dry out plants.'
        : 'Niedostępne: porywisty wiatr na wysokim piętrze (7+) i brak osłony wymagają częstszego podlewania.';
    }
  }

  return null;
}

/**
 * 7. COMPLETE PROFILE DOMAIN VALIDATION (BEFORE PERSISTENCE)
 */
export function validateOnboardingProfile(
  spec: unknown,
  language: 'pl' | 'en' = 'pl'
): DomainValidationResult {
  const errors: ValidationErrorItem[] = [];
  const fieldErrors: Record<string, string> = {};

  if (!spec || typeof spec !== 'object') {
    const err: ValidationErrorItem = {
      field: 'root',
      code: 'EMPTY_SPEC',
      message: language === 'en'
        ? 'Balcony profile configuration is missing or empty.'
        : 'Brak konfiguracji profilu balkonu.',
    };
    return {
      isValid: false,
      errors: [err],
      fieldErrors: { root: err.message },
      crossFieldErrors: [],
      summaryMessage: err.message,
    };
  }

  const s = spec as Partial<UserBalconySpec>;

  // Individual field validations
  const regErr = validateRegion(s.region, language);
  if (regErr) errors.push(regErr);

  const floorErr = validateFloor(s.floor, language);
  if (floorErr) errors.push(floorErr);

  const expErr = validateExposure(s.orientation, language);
  if (expErr) errors.push(expErr);

  const condErrors = validateBalconyConditions(s.balcony_type, s.roofing, language);
  errors.push(...condErrors);

  const potErr = validateContainers(s.pots, language);
  if (potErr) errors.push(potErr);

  const careErr = validateCareTime(s.care_time, language);
  if (careErr) errors.push(careErr);

  const countErr = validatePotQuantity(s.pot_count, language);
  if (countErr) errors.push(countErr);

  const dimErrors = validatePotDimensions(s.pot_dimensions, language);
  errors.push(...dimErrors);

  // Cross-field validations
  const crossErrors = validateCrossFieldCombinations(s, language);
  errors.push(...crossErrors);

  const crossFieldMessages: string[] = [];
  for (const err of errors) {
    if (!fieldErrors[err.field]) {
      fieldErrors[err.field] = err.message;
    }
    if (err.isCrossField) {
      crossFieldMessages.push(err.message);
    }
  }

  const summaryMessage = errors.length > 0 ? errors[0].message : '';

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors,
    crossFieldErrors: crossFieldMessages,
    summaryMessage,
  };
}
