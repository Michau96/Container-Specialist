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

  // 6. Watermelon vs Sunflower & other crops check: watermelon photography must only belong to watermelon
  const isWatermelonVisual =
    url.includes('1587049352846-4a222e784d38') ||
    url.includes('1582281298055-e25b84a30b0b') ||
    alt.includes('arbuz') ||
    visual.emoji === '🍉';
  const isWatermelonPlant = plantId.includes('arbuz') || plantName.includes('arbuz');
  if (isWatermelonVisual && !isWatermelonPlant) {
    return {
      isConsistent: false,
      reason: `Watermelon image/alt text mismatched with non-watermelon plant "${plant.name}" (${plant.id})`,
    };
  }

  // 7. Sunflower microgreens check: must have sunflower microgreens imagery, never watermelon or unrelated photos
  const isSunflowerPlant = plantId.includes('slonecznik') || plantName.includes('słonecznik') || plantName.includes('slonecznik');
  if (isSunflowerPlant && isWatermelonVisual) {
    return {
      isConsistent: false,
      reason: `Sunflower seedlings "${plant.name}" (${plant.id}) cannot have watermelon image`,
    };
  }

  // 8. Radish sprouts check: cannot have pill or pharmaceutical image (1628771065518-0d82f1938462)
  const isPillsVisual =
    url.includes('1628771065518-0d82f1938462') ||
    alt.includes('tablet') ||
    alt.includes('kapsuł') ||
    alt.includes('piguł') ||
    alt.includes('lekarstw');
  if (isPillsVisual) {
    return {
      isConsistent: false,
      reason: `Plant "${plant.name}" (${plant.id}) has pharmaceutical/pills image instead of botanical photography`,
    };
  }

  // 9. Pieczarka check: cannot have generic dinner table spread (1504674900247-0877df9cc836)
  const isDinnerTableVisual = url.includes('1504674900247-0877df9cc836') || alt.includes('obiad') || alt.includes('danie');
  if (isDinnerTableVisual) {
    return {
      isConsistent: false,
      reason: `Plant "${plant.name}" (${plant.id}) has dinner meal image instead of fresh mushroom photography`,
    };
  }

  // 10. Specific botanical matching checks for common balcony crops
  if (plantId === 'boczniak-ostrygowaty') {
    const isPleurotus = url.includes('pleurotus') || alt.includes('boczniak');
    if (!isPleurotus) {
      return { isConsistent: false, reason: `Boczniak ostrygowaty must have verified Pleurotus image` };
    }
  }

  if (plantId === 'shiitake-twardnik') {
    const isShiitake = url.includes('shiitake') || url.includes('lentinula') || alt.includes('shiitake');
    if (!isShiitake) {
      return { isConsistent: false, reason: `Shiitake must have verified Shiitake image` };
    }
  }

  if (plantId === 'szczypiorek-ziola') {
    const isFlowerOnly = url.includes('allium_schoenoprasum_j1') || url.includes('j1.jpg');
    if (isFlowerOnly) {
      return { isConsistent: false, reason: `Szczypiorek cannot use flower-only image, must show green culinary chive leaves` };
    }
    const isChives = (url.includes('schoenoprasum') || url.includes('chives')) && (alt.includes('szczypiorek') || alt.includes('chive'));
    if (!isChives) {
      return { isConsistent: false, reason: `Szczypiorek must have verified chives image` };
    }
  }

  if (plantId === 'cukinia-balkonowa') {
    const isZucchini = url.includes('zucchini') || url.includes('courgette') || alt.includes('cukini');
    if (!isZucchini) {
      return { isConsistent: false, reason: `Cukinia must have verified zucchini image` };
    }
  }

  if (plantId === 'oregano-lebiodka') {
    const isOregano = url.includes('origanum') || url.includes('oregano') || alt.includes('oregano');
    if (!isOregano) {
      return { isConsistent: false, reason: `Oregano must have verified oregano image` };
    }
  }

  if (plantId === 'pietruszka-naciowa') {
    const isParsley = url.includes('petroselinum') || url.includes('parsley') || alt.includes('pietruszk');
    if (!isParsley) {
      return { isConsistent: false, reason: `Pietruszka naciowa must have verified parsley image` };
    }
  }

  if (plantId === 'lawenda-donica') {
    const isLavender = url.includes('lavandula') || url.includes('lavender') || alt.includes('lawend');
    if (!isLavender) {
      return { isConsistent: false, reason: `Lawenda must have verified lavender image` };
    }
  }

  if (plantId === 'mieta-donica') {
    const isMint = url.includes('mentha') || url.includes('pfefferminze') || url.includes('peppermint') || alt.includes('mięt') || alt.includes('miet');
    if (!isMint) {
      return { isConsistent: false, reason: `Mięta pieprzowa must have verified Mentha piperita image` };
    }
  }

  if (plantId === 'begonia-stale-kwitnaca') {
    const isBegonia = url.includes('begonia') || alt.includes('begoni');
    if (!isBegonia) {
      return { isConsistent: false, reason: `Begonia stale kwitnąca must have verified Begonia image` };
    }
  }

  if (plantId === 'pak-choi') {
    const isPakChoi = url.includes('pak_choi') || url.includes('bok_choy') || url.includes('pak-ch') || alt.includes('pak choi') || alt.includes('bok choy');
    if (!isPakChoi) {
      return { isConsistent: false, reason: `Pak Choi must have verified Pak Choi/Bok choy image` };
    }
  }

  if (plantId === 'trawa-cytrynowa') {
    const isGenericLawn = url.includes('Gardenology.org-IMG_2892_rbgs11jan.jpg') || alt.includes('zwykła trawa');
    if (isGenericLawn) {
      return { isConsistent: false, reason: `Trawa cytrynowa cannot have generic lawn grass image` };
    }
    const isLemongrass = url.includes('lemon_grass') || url.includes('lemongrass') || url.includes('cymbopogon') || url.includes('serai') || alt.includes('traw cytrynow') || alt.includes('trawy cytrynowej');
    if (!isLemongrass) {
      return { isConsistent: false, reason: `Trawa cytrynowa must have verified Lemongrass (Cymbopogon) image with distinct stalks` };
    }
  }

  if (plantId === 'groszek-cukrowy') {
    const isPea = url.includes('sugar_snap') || url.includes('snap_pea') || url.includes('pisum') || url.includes('snow_pea') || alt.includes('groszek') || alt.includes('pea');
    if (!isPea) {
      return { isConsistent: false, reason: `Groszek cukrowy must have verified sugar snap pea image` };
    }
  }

  if (plantId === 'kumkwat-cytrus') {
    const isKumquat = url.includes('fortunella') || url.includes('kumquat') || url.includes('citrus_japonica') || alt.includes('kumkwat');
    if (!isKumquat) {
      return { isConsistent: false, reason: `Kumkwat must have verified Kumquat (Fortunella/Citrus japonica) image` };
    }
  }

  if (plantId === 'figowiec') {
    const isOrnamentalFicus = url.includes('ficus_elastica') || url.includes('ficus_lyrata') || alt.includes('sprężysty') || alt.includes('dębolistny');
    if (isOrnamentalFicus) {
      return { isConsistent: false, reason: `Figowiec jadalny cannot use ornamental indoor ficus image` };
    }
    const isCommonFig = url.includes('ficus_carica') || url.includes('vijgenboom') || url.includes('feigen') || url.includes('fig') || alt.includes('fig');
    if (!isCommonFig) {
      return { isConsistent: false, reason: `Figowiec pospolity must have verified Ficus carica image` };
    }
  }

  if (plantId === 'bazylia-wlasciwa') {
    const isBasil = url.includes('ocimum') || url.includes('basilicum') || url.includes('basil') || alt.includes('bazyli');
    if (!isBasil) {
      return { isConsistent: false, reason: `Bazylia właściwa must have verified Ocimum basilicum image` };
    }
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
