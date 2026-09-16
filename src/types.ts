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

export interface UserBalconySpec {
  region: PolandRegionKey;
  floor: number;
  orientation: Orientation;
  balcony_type: BalconyType;
  roofing: RoofingType;
  pots: ContainerType[];
  care_time: CareTime;
}

export type PlantGroup = 'wszystkie' | 'warzywa' | 'owoce' | 'ziola' | 'ozdobne';

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
  max_plants_per_standard_box_60cm: number;
  max_plants_per_round_pot_30cm: number;
}

export type PotShape = 'round' | 'rectangular';
export type PotMaterial = 'plastic' | 'terracotta' | 'wood' | 'fabric' | 'ceramic';
export type SupportType = 'none' | 'stake' | 'trellis' | 'balcony_railing' | 'cage';

export interface UserPotInput {
  shape: PotShape;
  diameter_cm: number;
  width_cm: number;
  length_cm: number;
  height_cm: number;
  material: PotMaterial;
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
}

export interface PlantNutrition {
  vitamins: string;
  minerals: string;
  key_benefits: string;
  tags: string[];
}

export interface Plant {
  id: string;
  name: string;
  plant_group: 'warzywa' | 'owoce' | 'ziola' | 'ozdobne';
  category: string;
  varieties: string[];
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
  sources: string[];
  suitability?: PlantSuitability;
  soil_layers?: SoilLayersInfo;
  fertilizer_guide?: FertilizerGuideInfo;
  spray_guide?: SprayGuideInfo;
  spacing_guide?: SpacingGuideInfo;
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
