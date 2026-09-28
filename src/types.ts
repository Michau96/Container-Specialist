export type PolandRegionKey =
  | 'dolnoslaskie'
  | 'kujawsko_pomorskie'
  | 'lubelskie'
  | 'lubuskie'
  | 'lodzkie'
  | 'malopolskie'
  | 'mazowieckie'
  | 'opolskie'
  | 'podkarpackie'
  | 'podlaskie'
  | 'pomorskie'
  | 'slaskie'
  | 'swietokrzyskie'
  | 'warminsko_mazurskie'
  | 'wielkopolskie'
  | 'zachodniopomorskie';

export type Orientation =
  // 8 podstawowych
  | 'S'
  | 'E'
  | 'W'
  | 'N'
  | 'SE'
  | 'SW'
  | 'NE'
  | 'NW'
  // 8 precyzyjnych (16-punktowa róża wiatrów)
  | 'SSE'
  | 'SSW'
  | 'ESE'
  | 'ENE'
  | 'WSW'
  | 'WNW'
  | 'NNW'
  | 'NNE'
  // Narożne i układy specjalne
  | 'S_W'
  | 'S_E'
  | 'N_W'
  | 'N_E'
  | 'E_W'
  | 'PATIO'
  | 'DACH';

export type BalconyType = 'open_rail' | 'solid_wall' | 'loggia' | 'french';

export type RoofingType = 'covered' | 'uncovered';

export type ContainerType =
  | 'boxes_balcony_15cm'
  | 'pots_medium_5_15'
  | 'pots_large_15_30'
  | 'grow_bags'
  | 'hanging_baskets';

export type CareTime = 'daily' | 'few_days' | 'weekends';

export type FloorCategory = 'parter' | 'niskie piętro (1-3)' | 'średnie piętro (4-6)' | 'wysokie (7+)';

export function getFloorCategory(floor: number): FloorCategory {
  if (floor === 0) return 'parter';
  if (floor <= 3) return 'niskie piętro (1-3)';
  if (floor <= 6) return 'średnie piętro (4-6)';
  return 'wysokie (7+)';
}

export function getFloorCategoryLabel(floor: number): string {
  if (floor === 0) return 'Parter';
  if (floor <= 3) return 'Niskie piętro (1-3)';
  if (floor <= 6) return 'Średnie piętro (4-6)';
  return 'Wysokie piętro (7+)';
}

export interface UserBalconySpec {
  region: PolandRegionKey;
  floor: number;
  orientation: Orientation;
  balcony_type: BalconyType;
  roofing: RoofingType;
  pots: ContainerType[];
  care_time: CareTime;
}

export type PlantGroup = 'wszystkie' | 'warzywa' | 'owoce' | 'ziola' | 'ozdobne' | 'kielki' | 'grzyby';

export type SowingType = 'gniazdowo' | 'pojedynczo' | 'rzutowo' | 'sadzonka' | 'grzybnia';

export interface PlantSource {
  title: string;
  url?: string;
  institution?: string;
  country?: string;
  notes?: string;
}

export interface SoilLayersInfo {
  drainage_cm: number;
  drainage_material: string;
  separator_recommended: boolean;
  substrate_mix: string;
  ph_range: string;
  top_margin_cm: number;
  mulch_layer?: string;
}

export interface FertilizerGuideInfo {
  what: string;
  frequency: string;
  npk_focus: string;
  organic_options: string[];
  warnings: string;
}

export interface SprayGuideInfo {
  apply_sprays: 'tak_profilaktyka' | 'w_razie_potrzeby' | 'zbedne';
  apply_label: string;
  preventive: string[];
  intervention: string[];
  safety_note: string;
}

export interface SpacingGuideInfo {
  spacing_cm: number;
  planting_depth_cm: number;
  planting_method: string;
  supports_needed: string;
  requires_bamboo_stake?: boolean;
  bamboo_stake_desc?: string;
  sowing_type?: SowingType;
  sowing_type_details?: string;
  max_plants_per_standard_box_60cm: number;
  max_plants_per_round_pot_30cm: number;
}

export type PotShape = 'round' | 'rectangular';
export type LegacyPotMaterial = 'plastic' | 'terracotta' | 'wood' | 'fabric' | 'ceramic';
export type PotMaterial = 'plastik' | 'ceramika_terakota' | 'tkanina' | 'drewno';
export type SupportType = 'none' | 'stake' | 'trellis' | 'balcony_railing' | 'cage';

export interface UserPotInput {
  shape: PotShape;
  diameter_cm: number;
  width_cm: number;
  length_cm: number;
  height_cm: number;
  material: LegacyPotMaterial;
  supports: SupportType;
}

export interface PlantPotRequirements {
  min_volume_l: number;
  recommended_volume_l: number;
  min_depth_cm: number;
  drainage: string;
  material: string;
}

export interface PlantSoilRequirements {
  type: string;
  ph: string;
  structure: string;
  fertilizer: string;
}

export interface PlantSuitability {
  score: number;
  suitability_level: string;
  reasons: string[];
  warnings: string[];
  tips: string[];
}

export interface PlantVariety {
  name: string;
  badge: string;
  reason: string;
  habit?: string; // np. 'Super karłowy zwarty (do 30 cm)', 'Kaskadowy zwisający', 'Krzaczasty'
  min_pot_vol_l?: number;
  recommended_spacing_cm?: number;
  requires_support?: boolean;
  watering_profile?: string;
  soil_ph?: string;
  soil_notes?: string;
  sowing_notes?: string;
}

export interface PlantNutrition {
  vitamins: string;
  minerals: string;
  key_benefits: string;
  antioxidants?: string;
  tags: string[];
}

export type PlantVarietyRaw = string | { name: string; features?: string };

export interface Plant {
  id: string;
  name: string;
  common_name?: string;
  search_keywords?: string[];
  plant_group: 'warzywa' | 'owoce' | 'ziola' | 'ozdobne' | 'kielki' | 'grzyby';
  category: string;
  varieties: PlantVarietyRaw[];
  top_varieties?: PlantVariety[];
  nutrition?: PlantNutrition;
  difficulty: number; // 1-10
  difficulty_label: string;
  sun_preference: string;
  orientations: string[];
  wind_tolerance: string;
  pot: PlantPotRequirements;
  soil: PlantSoilRequirements;
  summary: string;
  detailed_guide: string;
  schedule: Record<string, string>;
  sources: Array<string | PlantSource>;
  suitability?: PlantSuitability;
  soil_layers?: SoilLayersInfo;
  fertilizer_guide?: FertilizerGuideInfo;
  spray_guide?: SprayGuideInfo;
  spacing_guide?: SpacingGuideInfo;
  greenhouse_recommendation?: GreenhouseSuitability;
}

export type GreenhouseSuitability = 'recommended' | 'optional' | 'not_recommended';

export interface GreenhouseRecommendation {
  suitability: GreenhouseSuitability;
  label: string;
  badgeLabel: string;
  badgeTone: 'emerald' | 'amber' | 'stone' | 'rose';
  icon: string;
  temperatureGain: string;
  reason: string;
  risksAndVentilation: string;
  practicalTip: string;
}

export interface CalendarPeriod {
  id: string;
  month: number;
  half: number;
  name: string;
  short: string;
}

export interface CalendarActionItem {
  plant_id: string;
  plant_name: string;
  plant_group?: 'warzywa' | 'owoce' | 'ziola' | 'ozdobne';
  action_code: string;
  difficulty: number;
  suitability_score: number;
  pot_vol: number;
  tip: string;
  top_varieties?: PlantVariety[];
  recommended_variety?: string;
  variety_badge?: string;
  soil_fertilizer?: string;
  nutrition?: PlantNutrition;
  pillar?: 'siew' | 'sadzenie' | 'pielegnacja' | 'zbior';
  action_detail?: string;
  fertilizer_guide?: FertilizerGuideInfo;
  spray_guide?: SprayGuideInfo;
  soil_layers?: SoilLayersInfo;
  spacing_guide?: SpacingGuideInfo;
}

export interface CalendarResponse {
  period: CalendarPeriod;
  is_current_period: boolean;
  current_period_id: string;
  actions_by_type: Record<string, CalendarActionItem[]>;
  pillars?: {
    siew: CalendarActionItem[];
    sadzenie: CalendarActionItem[];
    pielegnacja: CalendarActionItem[];
    zbior: CalendarActionItem[];
  };
  season_tips: string[];
}

export interface BalconyWeatherAdvice {
  watering_status: string;
  frost_risk: boolean;
  wind_risk: boolean;
  adjusted_wind_at_floor: number;
  summary: string;
}

export interface WeatherData {
  source: string;
  temperature: number;
  apparent_temperature: number;
  wind_speed: number;
  humidity: number;
  precipitation: number;
  weather_code: number;
  weather_desc: string;
  balcony_advice: BalconyWeatherAdvice;
}

export interface RegionInfo {
  name: string;
  zone: string;
  macroregion?: string;
  climate_notes: string;
  lat: number;
  lon: number;
  frost_shift_days: number;
}

export type CropGrowthStage = 'planowanie' | 'siew' | 'rozsada' | 'rosnie' | 'kwitnie' | 'owocuje' | 'zbior';

export type PotType =
  | 'okragla'
  | 'skrzynka'
  | 'kwadratowa'
  | 'worek_growbag'
  | 'samonawadniajaca'
  | 'wiszaca';

export type SowingMethod = 'nasiona' | 'sadzonka';

export interface PotConfig {
  potType?: PotType;
  volumeL?: number;
  diameterOrWidthCm?: number;
  depthCm?: number;
  lengthCm?: number;
  material?: PotMaterial;
  hasDrainage?: boolean;
  locationNote?: string;
  quantity?: number; // Ilość identycznych donic (np. 2x 30cm)
}

export interface SowingConfig {
  method: SowingMethod;
  date?: string; // 'YYYY-MM-DD'
  periodId?: string; // e.g. '04_2'
  sowingLocation?: 'parapet_wewnetrzny' | 'balkon_bezposrednio' | 'szklarenka';
}

export interface PlantGrowthPhase {
  id: string;
  order: number;
  name: string;
  shortName: string;
  icon: string;
  dayStart: number;
  dayEnd: number;
  whatToExpect: string;
  keyCareAction: string;
  wateringTip: string;
  fertilizingTip: string;
  pruningOrSupportTip?: string;
}

export interface PotAssessment {
  status: 'idealna' | 'za_mala' | 'brak_drenazu' | 'uwaga_material';
  badge: string;
  message: string;
  wateringImpact: string;
  fertilizingImpact: string;
}

export interface CropTimelineInfo {
  phases: PlantGrowthPhase[];
  totalDaysToHarvest: number;
  currentPhaseIndex: number;
  currentPhase: PlantGrowthPhase;
  daysSinceSowing: number;
  daysUntilNextPhase: number | null;
  progressPercent: number;
  isReadyForHarvest: boolean;
  potAssessment: PotAssessment;
  currentPhaseRecommendation: {
    title: string;
    action: string;
    dangerToAvoid: string;
  };
}

export interface CropRescuePlan {
  active: boolean;
  issueId: string;
  issueTitle: string;
  issueIcon: string;
  imageUrl?: string;
  symptomBadge: string;
  category: string;
  activatedAt: string; // Data uruchomienia w ISO
  suspendedWateringUntil?: string; // YYYY-MM-DD
  suspendedWateringDays: number;
  diagnosis: string;
  cause: string;
  immediateAction: string;
  steps: string[];
  whatToAvoid: string;
  recoveryTimeline: string;
  completedSteps?: Record<number, boolean>;
}

export interface CropPhotoEntry {
  id: string;
  date: string; // Data w formacie YYYY-MM-DD
  imageUrl: string; // Base64 data URL lub zdalny adres URL
  caption?: string; // Opcjonalny opis/notatka z danego tygodnia
  phaseId?: string; // ID fazy rozwoju (np. germination, vegetative, flowering, etc.)
  phaseName?: string; // Nazwa fazy po polsku
  dayNumber: number; // Dzień od wysiewu/posadzenia
  weekNumber: number; // Tydzień od wysiewu/posadzenia (np. 1, 2, 3...)
  createdAt?: string; // ISO timestamp
}

export interface MyCropItem {
  id?: string; // Unikalne ID wpisu uprawy
  plantId: string;
  addedAt: string;
  stage?: CropGrowthStage;
  customPotName?: string;
  notes?: string;
  selectedVariety?: string; // Wymuszony wybór odmiany/gatunku
  varietyBadge?: string;
  potCount?: number; // Ilość takich samych donic (np. 2x 30cm, domyślnie 1)
  completedTasks?: Record<string, boolean>; // e.g. "03_2_siew": true
  pot?: PotConfig;
  sowing?: SowingConfig;
  inGreenhouse?: boolean; // Czy uprawa znajduje się w balkonowej mini-szklarni / folii
  lastWateredDate?: string; // Data ostatniego podlania w formacie YYYY-MM-DD
  rescuePlan?: CropRescuePlan; // Aktywny lub archiwalny tryb ratunkowy
  photos?: CropPhotoEntry[]; // Dziennik zdjęć postępu i klatek do animacji poklatkowej (timelapse)
}

export interface DailyWateringAdvice {
  isGoodDay: boolean;
  status: 'obfite' | 'umiarkowane' | 'wstrzymaj' | 'sprawdz';
  title: string;
  advice: string;
  specifics: string[];
}

export interface DailyFertilizingAdvice {
  isGoodDay: boolean;
  status: 'zalecane' | 'odradzane' | 'umiarkowane';
  title: string;
  advice: string;
  dosageTip: string;
}

export interface DailyPruningAdvice {
  title: string;
  advice: string;
  plantTasks: { plantName: string; task: string; icon: string }[];
}

export interface DailySprayingAdvice {
  isGoodDay: boolean;
  status: 'dobry_dzien' | 'zly_dzien' | 'wstrzymaj';
  title: string;
  advice: string;
  recommendedOrganicSolution?: string;
}

export interface DailyCropsRecommendation {
  watering: DailyWateringAdvice;
  fertilizing: DailyFertilizingAdvice;
  pruning: DailyPruningAdvice;
  spraying: DailySprayingAdvice;
  specialAlerts: string[];
  lastUpdated: string;
}

export type Language = 'pl' | 'en';

export interface UserAccount {
  id: string;
  username: string; // Nick lub nazwa użytkownika
  email?: string;
  displayName?: string;
  photoURL?: string;
  authProvider?: 'google' | 'password';
  createdAt: string;
  balconySpec: UserBalconySpec;
  myCrops?: MyCropItem[];
  lastLoginAt?: string;
  language?: Language;
}

export interface AuthState {
  user: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
}
