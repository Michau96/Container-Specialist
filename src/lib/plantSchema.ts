import { z } from 'zod';
import { Plant, PlantPotRequirements, PlantSoilRequirements, SoilLayersInfo, FertilizerGuideInfo, SprayGuideInfo, SpacingGuideInfo } from '../types';
import { getPlantVisual, GROUP_FALLBACK_IMAGES, PLANT_IMAGE_MAP, PlantVisualData } from './plantImages';

// Zod schema for Pot Requirements
export const PlantPotSchema = z.object({
  min_volume_l: z.number().nonnegative().default(5),
  recommended_volume_l: z.number().nonnegative().default(10),
  min_depth_cm: z.number().nonnegative().default(15),
  drainage: z.string().default('Wymagany drenaż z keramzytu (3-5 cm) na dnie donicy'),
  material: z.string().default('Donica z otworami odpływowymi'),
}).catch({
  min_volume_l: 5,
  recommended_volume_l: 10,
  min_depth_cm: 15,
  drainage: 'Wymagany drenaż z keramzytu (3-5 cm) na dnie donicy',
  material: 'Donica z otworami odpływowymi',
});

// Zod schema for Soil Requirements
export const PlantSoilSchema = z.object({
  type: z.string().default('Uniwersalne podłoże warzywne z perlitem'),
  ph: z.string().default('6.0 - 6.8'),
  structure: z.string().default('Przepuszczalna, bogata w próchnicę'),
  fertilizer: z.string().default('Nawóz organiczny biohumus lub dedykowany nawóz do warzyw'),
}).catch({
  type: 'Uniwersalne podłoże warzywne z perlitem',
  ph: '6.0 - 6.8',
  structure: 'Przepuszczalna, bogata w próchnicę',
  fertilizer: 'Nawóz organiczny biohumus lub dedykowany nawóz do warzyw',
});

// Zod schema for Variety Item
export const PlantVarietySchema = z.union([
  z.string(),
  z.object({
    name: z.string(),
    features: z.string().optional(),
    badge: z.string().optional(),
    reason: z.string().optional(),
    habit: z.string().optional(),
    min_pot_vol_l: z.number().optional(),
    recommended_spacing_cm: z.number().optional(),
    requires_support: z.boolean().optional(),
    watering_profile: z.string().optional(),
    soil_ph: z.string().optional(),
    soil_notes: z.string().optional(),
    sowing_notes: z.string().optional(),
  }),
]);

// Zod schema for Plant Group
export const PlantGroupSchema = z.enum(['warzywa', 'owoce', 'ziola', 'ozdobne', 'kielki', 'grzyby']).catch('warzywa');

// Canonical Plant Schema
export const PlantSchema = z.object({
  id: z.string().min(1, 'Plant canonical ID must be a non-empty string'),
  name: z.string().min(1, 'Plant name must be a non-empty string'),
  common_name: z.string().optional(),
  botanical_name: z.string().optional(),
  search_keywords: z.array(z.string()).default([]),
  plant_group: PlantGroupSchema,
  category: z.string().default('Inne'),
  varieties: z.array(PlantVarietySchema).default([]),
  top_varieties: z.array(z.any()).optional(),
  nutrition: z.object({
    vitamins: z.string().default(''),
    minerals: z.string().default(''),
    key_benefits: z.string().default(''),
    antioxidants: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }).optional(),
  difficulty: z.union([z.number(), z.string()]).transform((val) => {
    if (typeof val === 'number') return Math.max(1, Math.min(10, val));
    const parsed = Number(val);
    return isNaN(parsed) ? 3 : Math.max(1, Math.min(10, parsed));
  }).default(3),
  difficulty_label: z.string().default('Średnia'),
  sun_preference: z.string().default('Pełne słońce / lekki półcień'),
  orientations: z.array(z.string()).default(['S', 'SE', 'SW', 'E', 'W']),
  wind_tolerance: z.string().default('Średnia'),
  pot: PlantPotSchema,
  soil: PlantSoilSchema,
  summary: z.string().default(''),
  detailed_guide: z.string().default(''),
  schedule: z.record(z.string(), z.string()).default({}),
  sources: z.array(z.union([z.string(), z.any()])).default([]),
  suitability: z.object({
    score: z.number().default(85),
    suitability_level: z.string().default('Rekomendowane'),
    reasons: z.array(z.string()).default([]),
    warnings: z.array(z.string()).default([]),
    tips: z.array(z.string()).default([]),
  }).optional(),
  soil_layers: z.any().optional(),
  fertilizer_guide: z.any().optional(),
  spray_guide: z.any().optional(),
  spacing_guide: z.any().optional(),
  greenhouse_recommendation: z.any().optional(),
});

export type ValidatedPlant = z.infer<typeof PlantSchema>;

// Fully Resolved Plant Record to guarantee complete consistency and zero field drift across components
export interface ResolvedPlantRecord {
  plantId: string;
  title: string;
  botanicalName: string;
  category: string;
  plantGroup: 'warzywa' | 'owoce' | 'ziola' | 'ozdobne' | 'kielki' | 'grzyby';
  description: string;
  detailedGuide: string;
  visual: PlantVisualData;
  pot: PlantPotRequirements;
  soil: PlantSoilRequirements;
  difficulty: number;
  difficultyLabel: string;
  sunPreference: string;
  orientations: string[];
  windTolerance: string;
  schedule: Record<string, string>;
  suitabilityScore: number;
  varietiesList: string[];
  soilLayers: SoilLayersInfo;
  fertilizerGuide: FertilizerGuideInfo;
  sprayGuide: SprayGuideInfo;
  spacingGuide: SpacingGuideInfo;
  isFallback: boolean;
  raw: Plant;
}

/**
 * Validates raw plant input against Zod schema with safe fallback handling.
 */
export function parseAndValidatePlant(rawInput: unknown): Plant {
  const result = PlantSchema.safeParse(rawInput);
  if (result.success) {
    return result.data as unknown as Plant;
  }

  // Graceful fallback for malformed input: preserve id and name if available
  const inputObj = typeof rawInput === 'object' && rawInput !== null ? (rawInput as Record<string, any>) : {};
  const fallbackId = typeof inputObj.id === 'string' && inputObj.id.trim() !== '' ? inputObj.id.trim() : 'nieznana-roslina';
  const fallbackName = typeof inputObj.name === 'string' && inputObj.name.trim() !== '' ? inputObj.name.trim() : 'Roślina balkonowa';

  return {
    id: fallbackId,
    name: fallbackName,
    plant_group: 'warzywa',
    category: typeof inputObj.category === 'string' ? inputObj.category : 'Warzywa',
    varieties: [],
    difficulty: 3,
    difficulty_label: 'Łatwa',
    sun_preference: 'Słońce / półcień',
    orientations: ['S', 'SE', 'SW', 'E', 'W'],
    wind_tolerance: 'Średnia',
    pot: {
      min_volume_l: 5,
      recommended_volume_l: 10,
      min_depth_cm: 15,
      drainage: 'Drenaż 3-5 cm keramzytu',
      material: 'Donica z odpływem',
    },
    soil: {
      type: 'Podłoże uniwersalne warzywne',
      ph: '6.0 - 6.8',
      structure: 'Przepuszczalna',
      fertilizer: 'Biohumus lub nawóz organiczny',
    },
    summary: typeof inputObj.summary === 'string' ? inputObj.summary : 'Wymaga regularnego podlewania i słonecznego stanowiska.',
    detailed_guide: typeof inputObj.detailed_guide === 'string' ? inputObj.detailed_guide : '',
    schedule: {},
    sources: [],
  };
}

/**
 * Resolves a plant record into a unified, canonical entity where title, image, alt,
 * description, recommendations, and plantId strictly originate from the same record.
 */
export function resolvePlantRecord(plantInput: unknown): ResolvedPlantRecord {
  const plant = parseAndValidatePlant(plantInput);
  const visual = getPlantVisual(plant.id, plant.plant_group);

  // Safe fallback layers info if missing
  const defaultSoilLayers: SoilLayersInfo = {
    drainage_cm: 3,
    drainage_material: 'Keramzyt ogrodniczy',
    separator_recommended: true,
    substrate_mix: plant.soil?.type || 'Ziemia warzywna z perlitem',
    ph_range: plant.soil?.ph || '6.0 - 6.8',
    top_margin_cm: 2,
    mulch_layer: 'Opcjonalna kora drobna lub perlit',
  };

  const defaultFertilizerGuide: FertilizerGuideInfo = {
    what: plant.soil?.fertilizer || 'Nawóz organiczny do warzyw doniczkowych',
    frequency: 'Co 10-14 dni w okresie wegetacji',
    npk_focus: 'Zbalansowany NPK z mikroelementami',
    organic_options: ['Biohumus', 'Gnojówka z pokrzywy', 'Granulowany obornik'],
    warnings: 'Unikać przenawożenia azotem w donicach',
  };

  const defaultSprayGuide: SprayGuideInfo = {
    apply_sprays: 'w_razie_potrzeby',
    apply_label: 'W razie potrzeby (profilaktyka biologiczna)',
    preventive: ['Wyciąg ze skrzypu', 'Wyciąg z czosnku'],
    intervention: ['Mydło potasowe', 'Preparaty olejowe na mszyce'],
    safety_note: 'Stosować wcześnie rano lub po zachodzie słońca',
  };

  const defaultSpacingGuide: SpacingGuideInfo = {
    spacing_cm: 20,
    planting_depth_cm: 2,
    planting_method: 'Sadzenie do wilgotnego podłoża',
    supports_needed: 'W zależności od pokroju',
    max_plants_per_standard_box_60cm: 3,
    max_plants_per_round_pot_30cm: 1,
  };

  const varietiesList = plant.varieties
    ? plant.varieties
        .map((v) => (typeof v === 'string' ? v : v?.name || ''))
        .filter(Boolean)
    : [];

  const isCustomOrUnknown = !PLANT_IMAGE_MAP[plant.id];
  const visualAlt = isCustomOrUnknown
    ? `${plant.name} w uprawie balkonowej`
    : (visual.alt || `${plant.name} w donicy na balkonie`);

  return {
    plantId: plant.id,
    title: plant.name,
    botanicalName: (plant as any).botanical_name || '',
    category: plant.category,
    plantGroup: plant.plant_group,
    description: plant.summary || (plant as any).description || 'Brak opisu dla tej rośliny.',
    detailedGuide: plant.detailed_guide || plant.summary || '',
    visual: {
      imageUrl: visual.imageUrl || GROUP_FALLBACK_IMAGES[plant.plant_group]?.imageUrl || GROUP_FALLBACK_IMAGES.warzywa.imageUrl,
      alt: visualAlt,
      placeholderBg: visual.placeholderBg || 'from-stone-900 to-stone-800',
      emoji: visual.emoji || '🌱',
    },
    pot: plant.pot || {
      min_volume_l: 5,
      recommended_volume_l: 10,
      min_depth_cm: 15,
      drainage: 'Drenaż 3-5 cm keramzytu',
      material: 'Donica z odpływem',
    },
    soil: plant.soil || {
      type: 'Podłoże uniwersalne warzywne',
      ph: '6.0 - 6.8',
      structure: 'Przepuszczalna',
      fertilizer: 'Biohumus',
    },
    difficulty: typeof plant.difficulty === 'number' ? plant.difficulty : 3,
    difficultyLabel: plant.difficulty_label || 'Średnia',
    sunPreference: plant.sun_preference || 'Słońce / lekki półcień',
    orientations: plant.orientations || ['S', 'SE', 'SW', 'E', 'W'],
    windTolerance: plant.wind_tolerance || 'Średnia',
    schedule: plant.schedule || {},
    suitabilityScore: plant.suitability?.score ?? 88,
    varietiesList,
    soilLayers: plant.soil_layers || defaultSoilLayers,
    fertilizerGuide: plant.fertilizer_guide || defaultFertilizerGuide,
    sprayGuide: plant.spray_guide || defaultSprayGuide,
    spacingGuide: plant.spacing_guide || defaultSpacingGuide,
    isFallback: !plant.summary || !visual.imageUrl,
    raw: plant,
  };
}
