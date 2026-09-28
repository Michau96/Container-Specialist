import { Plant } from '../types';
import { getPlantVisual, PlantVisualData } from './plantImages';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CatalogValidationReport {
  validCount: number;
  rejectedCount: number;
  validPlants: Plant[];
  rejectedRecords: Array<{ record: unknown; errors: string[] }>;
}

/**
 * Validates consistency between plant metadata and its associated visual assets.
 * Rejects records where photography or alt text contradicts the botanical identity.
 */
export function isImageMetadataConsistent(plant: Partial<Plant>, visual: PlantVisualData): { isConsistent: boolean; reason?: string } {
  if (!visual || !visual.imageUrl) {
    return { isConsistent: false, reason: 'Missing image URL' };
  }

  const plantId = (plant.id || '').toLowerCase();
  const plantName = (plant.name || '').toLowerCase();
  const plantCategory = (plant.category || '').toLowerCase();
  const plantGroup = (plant.plant_group || '').toLowerCase();
  const alt = (visual.alt || '').toLowerCase();
  const url = visual.imageUrl.toLowerCase();

  // 1. Tomato check: tomato photo must only be paired with tomato plant
  const isTomatoVisual =
    url.includes('1592841200221-a6898f307baa') ||
    alt.includes('pomidor') ||
    alt.includes('tomato');
  const isTomatoPlant =
    plantId.includes('pomidor') ||
    plantName.includes('pomidor') ||
    plantId.includes('tomato');

  if (isTomatoVisual && !isTomatoPlant) {
    return {
      isConsistent: false,
      reason: `Tomato image/alt text mismatched with non-tomato plant "${plant.name}" (${plant.id})`,
    };
  }
  if (!isTomatoVisual && isTomatoPlant) {
    return {
      isConsistent: false,
      reason: `Tomato plant "${plant.name}" (${plant.id}) is missing verified tomato photography`,
    };
  }

  // 2. Chili / Pepper check
  const isChiliVisual = url.includes('1588252303782-cb80119abd6d') || alt.includes('paprycz');
  const isChiliPlant = plantId.includes('papryk') || plantId.includes('chili') || plantName.includes('papryk') || plantName.includes('chili');
  if (isChiliVisual && !isChiliPlant) {
    return {
      isConsistent: false,
      reason: `Chili image mismatched with non-chili plant "${plant.name}" (${plant.id})`,
    };
  }

  // 3. Radish check
  const isRadishVisual = alt.includes('rzodkiew');
  const isRadishPlant = plantId.includes('rzodkiew') || plantName.includes('rzodkiew');
  if (isRadishVisual && !isRadishPlant) {
    return {
      isConsistent: false,
      reason: `Radish image mismatched with non-radish plant "${plant.name}" (${plant.id})`,
    };
  }

  // 4. Strawberry / Berry check
  const isStrawberryVisual = alt.includes('truskaw') || alt.includes('poziomk');
  const isStrawberryPlant = plantId.includes('truskaw') || plantId.includes('poziomk') || plantName.includes('truskaw') || plantName.includes('poziomk');
  if (isStrawberryVisual && !isStrawberryPlant) {
    return {
      isConsistent: false,
      reason: `Strawberry image mismatched with non-strawberry plant "${plant.name}" (${plant.id})`,
    };
  }

  // 5. Mushroom check
  const isMushroomVisual = alt.includes('grzyb') || alt.includes('boczniak') || alt.includes('pieczark') || visual.emoji === '🍄';
  const isMushroomPlant = plantGroup === 'grzyby' || plantCategory.includes('grzyb') || plantName.includes('boczniak') || plantName.includes('pieczark');
  if (isMushroomVisual && !isMushroomPlant) {
    return {
      isConsistent: false,
      reason: `Mushroom image mismatched with plant "${plant.name}" (${plant.id})`,
    };
  }

  return { isConsistent: true };
}

/**
 * Validates a single plant record from seed or API.
 * Enforces mandatory metadata and rejects records with mismatched image or metadata.
 */
export function validatePlantRecord(record: unknown): ValidationResult {
  const errors: string[] = [];

  if (!record || typeof record !== 'object') {
    return { isValid: false, errors: ['Plant record must be a valid non-null object'] };
  }

  const p = record as Partial<Plant>;

  // Mandatory metadata fields
  if (!p.id || typeof p.id !== 'string' || p.id.trim() === '') {
    errors.push('Missing or empty plant id');
  }

  if (!p.name || typeof p.name !== 'string' || p.name.trim() === '') {
    errors.push('Missing or empty plant name');
  }

  if (!p.category || typeof p.category !== 'string' || p.category.trim() === '') {
    errors.push('Missing or empty plant category');
  }

  if (!p.summary || typeof p.summary !== 'string' || p.summary.trim() === '') {
    errors.push('Missing or empty plant summary description');
  }

  const validGroups = ['warzywa', 'owoce', 'ziola', 'ozdobne', 'kielki', 'grzyby'];
  if (!p.plant_group || !validGroups.includes(p.plant_group)) {
    errors.push(`Invalid plant_group "${p.plant_group}". Allowed: ${validGroups.join(', ')}`);
  }

  if (p.pot && typeof p.pot === 'object') {
    if (typeof p.pot.min_volume_l !== 'number' || p.pot.min_volume_l <= 0) {
      errors.push('Plant pot requirements must have valid min_volume_l > 0');
    }
  }

  // Image and metadata consistency verification
  if (p.id && p.plant_group) {
    const visual = getPlantVisual(p.id, p.plant_group);
    const consistencyCheck = isImageMetadataConsistent(p, visual);
    if (!consistencyCheck.isConsistent) {
      errors.push(consistencyCheck.reason || 'Image and plant metadata mismatch');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an entire catalog array, filtering out any corrupt or mismatched records.
 */
export function validatePlantCatalog(rawPlants: unknown[]): CatalogValidationReport {
  const validPlants: Plant[] = [];
  const rejectedRecords: Array<{ record: unknown; errors: string[] }> = [];

  if (!Array.isArray(rawPlants)) {
    return {
      validCount: 0,
      rejectedCount: 1,
      validPlants: [],
      rejectedRecords: [{ record: rawPlants, errors: ['Catalog root must be an array'] }],
    };
  }

  for (const raw of rawPlants) {
    const res = validatePlantRecord(raw);
    if (res.isValid) {
      validPlants.push(raw as Plant);
    } else {
      rejectedRecords.push({ record: raw, errors: res.errors });
    }
  }

  return {
    validCount: validPlants.length,
    rejectedCount: rejectedRecords.length,
    validPlants,
    rejectedRecords,
  };
}

/**
 * Assertion helper: returns typed Plant or throws an Error.
 */
export function assertValidPlant(record: unknown): Plant {
  const res = validatePlantRecord(record);
  if (!res.isValid) {
    throw new Error(`Invalid plant record: ${res.errors.join('; ')}`);
  }
  return record as Plant;
}
