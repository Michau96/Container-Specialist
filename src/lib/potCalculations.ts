import { PotShape, LegacyPotMaterial, PotMaterial } from '../types';

/**
 * Calculation version constant for traceability of formulas across migrations.
 * Increment this whenever mathematical modeling, substrate density, or safety rules change.
 */
export const POT_CALCULATION_VERSION = '2.1.0';

export type DimensionUnit = 'cm' | 'mm' | 'm';

export type SupportedPotShape = 'rectangular' | 'round' | 'square' | 'conical' | 'bowl';

export type SupportedPotMaterial = LegacyPotMaterial | PotMaterial | string;

export interface NormalizedDimensions {
  lengthMm?: number;
  widthMm?: number;
  heightMm: number;
  diameterMm?: number;
  topDiameterMm?: number;
  bottomDiameterMm?: number;
}

export interface PotCalculationInput {
  shape: PotShape | SupportedPotShape;
  material?: SupportedPotMaterial;
  length?: number;
  width?: number;
  height: number;
  diameter?: number;
  topDiameter?: number;
  bottomDiameter?: number;
  unit?: DimensionUnit; // default: 'cm'
  potCount?: number;    // default: 1
  drainageRatio?: number; // default: 0.15 (15% volume)
  safetyRimRatio?: number; // default: 0.05 (5% margin at the top)
}

export interface VolumeBreakdown {
  grossVolumeL: number;
  netUsableVolumeL: number;
  unit: 'l';
}

export interface MaterialPhysicalProfile {
  materialKey: LegacyPotMaterial;
  namePl: string;
  nameEn: string;
  tareWeightPerLiterKg: number;
  wallWaterAbsorptionRatio: number;
  wetSoilDensityKgPerL: number;
  drySoilDensityKgPerL: number;
  drainageKeramziteDensityKgPerL: number;
  notesPl: string;
  notesEn: string;
}

export interface SubstrateBreakdown {
  soilVolumeL: number;
  drainageVolumeL: number;
  totalSubstrateVolumeL: number;
  soilVolumeAllPotsL: number;
  drainageVolumeAllPotsL: number;
  unit: 'l';
}

export interface BagRecommendation {
  soilBags20L: number;
  soilBags50L: number;
  drainageBags5L: number;
  recommendedSoilBags: {
    bagSizeL: 20 | 50;
    count: number;
    descriptionPl: string;
    descriptionEn: string;
  };
  unit: 'szt.';
}

export interface MassBreakdown {
  tarePotMassKg: number;
  drySubstrateMassKg: number;
  wetSubstrateMassKg: number;
  dryTotalMassKg: number;
  wetTotalMassKg: number;
  wetTotalAllPotsKg: number;
  unit: 'kg';
}

export interface BalconyLoadBreakdown {
  footprintAreaM2: number;
  pointLoadKg: number;
  distributedLoadKgM2: number;
  safetyRating: 'safe' | 'caution' | 'warning';
  safetyMessagePl: string;
  safetyMessageEn: string;
  unit: 'kg/m²';
}

export interface FormattedUnitsResult {
  volumeGrossText: string;
  volumeNetText: string;
  soilVolumeText: string;
  drainageVolumeText: string;
  bagCountTextPl: string;
  bagCountTextEn: string;
  tareMassText: string;
  dryMassText: string;
  wetMassText: string;
  totalMassAllPotsText: string;
  balconyLoadText: string;
  footprintText: string;
}

export interface PotCalculationResult {
  version: string;
  shape: SupportedPotShape;
  material: LegacyPotMaterial;
  potCount: number;
  normalizedDimensions: NormalizedDimensions;
  volume: VolumeBreakdown;
  substrate: SubstrateBreakdown;
  bags: BagRecommendation;
  mass: MassBreakdown;
  balconyLoad: BalconyLoadBreakdown;
  formatted: FormattedUnitsResult;
}

// ============================================================================
// 1. PURE NORMALIZATION FUNCTIONS (INTERNAL UNIT: MILLIMETERS)
// ============================================================================

/**
 * Normalizes any dimension value into the single canonical internal unit: millimeters (mm).
 * Strictly guarantees non-negative output (clamps <= 0 to 0) and handles non-finite inputs safely.
 */
export function normalizeToMillimeters(
  value: number | undefined | null,
  unit: DimensionUnit = 'cm'
): number {
  if (value === undefined || value === null || !Number.isFinite(value) || isNaN(value)) {
    return 0;
  }
  const positive = Math.max(0, value);
  switch (unit) {
    case 'm':
      return positive * 1000;
    case 'mm':
      return positive;
    case 'cm':
    default:
      return positive * 10;
  }
}

/**
 * Normalizes all dimensions of an input container into millimeters.
 */
export function normalizePotDimensions(input: PotCalculationInput): NormalizedDimensions {
  const unit = input.unit || 'cm';
  const heightMm = normalizeToMillimeters(input.height, unit);

  const normalized: NormalizedDimensions = {
    heightMm,
  };

  if (input.length !== undefined) {
    normalized.lengthMm = normalizeToMillimeters(input.length, unit);
  }
  if (input.width !== undefined) {
    normalized.widthMm = normalizeToMillimeters(input.width, unit);
  }
  if (input.diameter !== undefined) {
    normalized.diameterMm = normalizeToMillimeters(input.diameter, unit);
  }
  if (input.topDiameter !== undefined) {
    normalized.topDiameterMm = normalizeToMillimeters(input.topDiameter, unit);
  } else if (input.diameter !== undefined) {
    normalized.topDiameterMm = normalized.diameterMm;
  }
  if (input.bottomDiameter !== undefined) {
    normalized.bottomDiameterMm = normalizeToMillimeters(input.bottomDiameter, unit);
  }

  return normalized;
}

/**
 * Deterministic rounding function with explicit decimal places.
 * Guarantees zero negative zero (-0) or negative outputs.
 */
export function roundTo(val: number, decimals: number = 1): number {
  if (!Number.isFinite(val) || isNaN(val) || val <= 0) return 0;
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(val * factor) / factor;
  return rounded < 0 ? 0 : rounded;
}

// ============================================================================
// 2. SEPARATE SHAPE CALCULATION PATHS
// ============================================================================

/**
 * Rectangular container calculation path (box, trough, planter)
 * Formula: V = (L_mm * W_mm * H_mm) / 1,000,000 liters
 */
export function calculateRectangularVolume(
  norm: NormalizedDimensions,
  safetyRimRatio: number = 0.05
): VolumeBreakdown {
  const lengthMm = norm.lengthMm || 0;
  const widthMm = norm.widthMm || 0;
  const heightMm = norm.heightMm || 0;

  if (lengthMm <= 0 || widthMm <= 0 || heightMm <= 0) {
    return { grossVolumeL: 0, netUsableVolumeL: 0, unit: 'l' };
  }

  // 1 L = 1,000,000 mm^3
  const grossMm3 = lengthMm * widthMm * heightMm;
  const grossL = grossMm3 / 1_000_000;
  const netL = grossL * (1 - Math.min(0.2, Math.max(0, safetyRimRatio)));

  return {
    grossVolumeL: roundTo(grossL, 1),
    netUsableVolumeL: roundTo(netL, 1),
    unit: 'l',
  };
}

/**
 * Cylindrical / round container calculation path
 * Formula: V = (π * (D_mm / 2)^2 * H_mm) / 1,000,000 liters
 */
export function calculateRoundVolume(
  norm: NormalizedDimensions,
  safetyRimRatio: number = 0.05
): VolumeBreakdown {
  const diameterMm = norm.diameterMm || norm.topDiameterMm || 0;
  const heightMm = norm.heightMm || 0;

  if (diameterMm <= 0 || heightMm <= 0) {
    return { grossVolumeL: 0, netUsableVolumeL: 0, unit: 'l' };
  }

  const radiusMm = diameterMm / 2;
  const grossMm3 = Math.PI * radiusMm * radiusMm * heightMm;
  const grossL = grossMm3 / 1_000_000;
  const netL = grossL * (1 - Math.min(0.2, Math.max(0, safetyRimRatio)));

  return {
    grossVolumeL: roundTo(grossL, 1),
    netUsableVolumeL: roundTo(netL, 1),
    unit: 'l',
  };
}

/**
 * Square container calculation path
 * Formula: V = (W_mm^2 * H_mm) / 1,000,000 liters
 */
export function calculateSquareVolume(
  norm: NormalizedDimensions,
  safetyRimRatio: number = 0.05
): VolumeBreakdown {
  const widthMm = norm.widthMm || norm.lengthMm || norm.diameterMm || 0;
  const heightMm = norm.heightMm || 0;

  if (widthMm <= 0 || heightMm <= 0) {
    return { grossVolumeL: 0, netUsableVolumeL: 0, unit: 'l' };
  }

  const grossMm3 = widthMm * widthMm * heightMm;
  const grossL = grossMm3 / 1_000_000;
  const netL = grossL * (1 - Math.min(0.2, Math.max(0, safetyRimRatio)));

  return {
    grossVolumeL: roundTo(grossL, 1),
    netUsableVolumeL: roundTo(netL, 1),
    unit: 'l',
  };
}

/**
 * Conical / tapered container calculation path (conical frustum)
 * Formula: V = (π * H_mm / 3) * (R1^2 + R1*R2 + R2^2) / 1,000,000 liters
 */
export function calculateConicalVolume(
  norm: NormalizedDimensions,
  safetyRimRatio: number = 0.05
): VolumeBreakdown {
  const topDiameterMm = norm.topDiameterMm || norm.diameterMm || 0;
  const heightMm = norm.heightMm || 0;

  if (topDiameterMm <= 0 || heightMm <= 0) {
    return { grossVolumeL: 0, netUsableVolumeL: 0, unit: 'l' };
  }

  // If bottom diameter is not explicitly provided, standard horticulture pot taper is ~72% of top diameter
  const bottomDiameterMm = norm.bottomDiameterMm !== undefined && norm.bottomDiameterMm > 0
    ? norm.bottomDiameterMm
    : topDiameterMm * 0.72;

  const r1 = topDiameterMm / 2;
  const r2 = bottomDiameterMm / 2;

  const grossMm3 = (Math.PI * heightMm / 3) * (r1 * r1 + r1 * r2 + r2 * r2);
  const grossL = grossMm3 / 1_000_000;
  const netL = grossL * (1 - Math.min(0.2, Math.max(0, safetyRimRatio)));

  return {
    grossVolumeL: roundTo(grossL, 1),
    netUsableVolumeL: roundTo(netL, 1),
    unit: 'l',
  };
}

/**
 * Bowl / spherical cap calculation path (hanging bowl, shallow bowl)
 * Formula for spherical cap: V = (π * H_mm / 6) * (3 * R_mm^2 + H_mm^2) / 1,000,000 liters
 */
export function calculateBowlVolume(
  norm: NormalizedDimensions,
  safetyRimRatio: number = 0.05
): VolumeBreakdown {
  const diameterMm = norm.diameterMm || norm.topDiameterMm || 0;
  const heightMm = norm.heightMm || 0;

  if (diameterMm <= 0 || heightMm <= 0) {
    return { grossVolumeL: 0, netUsableVolumeL: 0, unit: 'l' };
  }

  const radiusMm = diameterMm / 2;
  // Depth cannot exceed radius for a standard hemisphere bowl
  const effectiveHeightMm = Math.min(heightMm, radiusMm);

  const grossMm3 = (Math.PI * effectiveHeightMm / 6) * (3 * radiusMm * radiusMm + effectiveHeightMm * effectiveHeightMm);
  const grossL = grossMm3 / 1_000_000;
  const netL = grossL * (1 - Math.min(0.2, Math.max(0, safetyRimRatio)));

  return {
    grossVolumeL: roundTo(grossL, 1),
    netUsableVolumeL: roundTo(netL, 1),
    unit: 'l',
  };
}

/**
 * Main shape router: executes the isolated path corresponding to the container shape.
 */
export function calculateVolumeByShape(
  shape: PotShape | SupportedPotShape,
  norm: NormalizedDimensions,
  safetyRimRatio: number = 0.05
): VolumeBreakdown {
  switch (shape) {
    case 'rectangular':
      return calculateRectangularVolume(norm, safetyRimRatio);
    case 'round':
      return calculateRoundVolume(norm, safetyRimRatio);
    case 'square':
      return calculateSquareVolume(norm, safetyRimRatio);
    case 'conical':
      return calculateConicalVolume(norm, safetyRimRatio);
    case 'bowl':
      return calculateBowlVolume(norm, safetyRimRatio);
    default:
      return calculateRoundVolume(norm, safetyRimRatio);
  }
}

// ============================================================================
// 3. SEPARATE MATERIAL CALCULATION PATHS (TARE WEIGHT, DENSITY, MOISTURE)
// ============================================================================

export function normalizeMaterialKey(material?: SupportedPotMaterial): LegacyPotMaterial {
  if (!material) return 'plastic';
  const str = String(material).toLowerCase();
  if (str.includes('terra') || str.includes('glin') || str.includes('nieszkliw')) return 'terracotta';
  if (str.includes('ceram') || str.includes('szkliw')) return 'ceramic';
  if (str.includes('drew') || str.includes('wood')) return 'wood';
  if (str.includes('tkan') || str.includes('fabric') || str.includes('smart') || str.includes('growbag')) return 'fabric';
  return 'plastic';
}

/**
 * Plastic container material path:
 * Light tare, impervious, no water wall absorption.
 */
export function calculatePlasticMaterialProfile(): MaterialPhysicalProfile {
  return {
    materialKey: 'plastic',
    namePl: 'Plastik / Tworzywo sztuczne',
    nameEn: 'Plastic / Polymer',
    tareWeightPerLiterKg: 0.045, // ~0.9 kg for 20L pot
    wallWaterAbsorptionRatio: 0.0,
    wetSoilDensityKgPerL: 1.25,
    drySoilDensityKgPerL: 0.55,
    drainageKeramziteDensityKgPerL: 0.65,
    notesPl: 'Lekki pojemnik, nie wchłania wody, szczelny termicznie.',
    notesEn: 'Lightweight, zero water absorption, completely watertight walls.',
  };
}

/**
 * Terracotta container material path:
 * Heavy porous clay, absorbs water into walls, transpires moisture.
 */
export function calculateTerracottaMaterialProfile(): MaterialPhysicalProfile {
  return {
    materialKey: 'terracotta',
    namePl: 'Terakota / Ceramika nieszkliwiona',
    nameEn: 'Terracotta / Unglazed clay',
    tareWeightPerLiterKg: 0.28, // ~5.6 kg for 20L pot
    wallWaterAbsorptionRatio: 0.12, // Absorbs 12% moisture into clay walls
    wetSoilDensityKgPerL: 1.20,
    drySoilDensityKgPerL: 0.55,
    drainageKeramziteDensityKgPerL: 0.65,
    notesPl: 'Ciężka naturalna glina, porowata, absorbuje wodę i chłodzi korzenie.',
    notesEn: 'Heavy porous clay, absorbs moisture into walls and cools roots via evaporation.',
  };
}

/**
 * Glazed ceramic container material path:
 * Very heavy dense stoneware, glazed impervious finish.
 */
export function calculateCeramicMaterialProfile(): MaterialPhysicalProfile {
  return {
    materialKey: 'ceramic',
    namePl: 'Ceramika szkliwiona',
    nameEn: 'Glazed ceramic',
    tareWeightPerLiterKg: 0.32, // ~6.4 kg for 20L pot
    wallWaterAbsorptionRatio: 0.02,
    wetSoilDensityKgPerL: 1.25,
    drySoilDensityKgPerL: 0.55,
    drainageKeramziteDensityKgPerL: 0.65,
    notesPl: 'Masywny pojemnik o wysokim ciężarze własnym, odporny na podmuchy wiatru.',
    notesEn: 'Heavyweight glazed stoneware, stable in high balcony winds.',
  };
}

/**
 * Natural wood planter material path:
 * Sturdy wooden planks, breathable, moderate water absorption into wood fiber.
 */
export function calculateWoodMaterialProfile(): MaterialPhysicalProfile {
  return {
    materialKey: 'wood',
    namePl: 'Drewno naturalne',
    nameEn: 'Natural wood',
    tareWeightPerLiterKg: 0.19, // ~3.8 kg for 20L pot
    wallWaterAbsorptionRatio: 0.15,
    wetSoilDensityKgPerL: 1.20,
    drySoilDensityKgPerL: 0.55,
    drainageKeramziteDensityKgPerL: 0.65,
    notesPl: 'Naturalna izolacja termiczna korzeni, wchłania część wilgoci w deszczu.',
    notesEn: 'Natural thermal insulation, absorbs moderate moisture from rain.',
  };
}

/**
 * Geotextile / Fabric container material path:
 * Ultra-light fabric pot (Smart Pot / Growbag), maximum aeration and free drainage.
 */
export function calculateFabricMaterialProfile(): MaterialPhysicalProfile {
  return {
    materialKey: 'fabric',
    namePl: 'Geowłóknina / Tkanina / Smart Pot',
    nameEn: 'Fabric pot / Grow bag',
    tareWeightPerLiterKg: 0.012, // ~0.24 kg for 20L pot
    wallWaterAbsorptionRatio: 0.04,
    wetSoilDensityKgPerL: 1.15, // Free drainage prevents over-saturation
    drySoilDensityKgPerL: 0.55,
    drainageKeramziteDensityKgPerL: 0.65,
    notesPl: 'Ekstremalnie lekki, napowietrza korzenie, eliminuje zastoje wodne.',
    notesEn: 'Ultra-lightweight, air-prunes root system, prevents waterlogging.',
  };
}

/**
 * Material router: invokes the dedicated physical profile calculation for the given material.
 */
export function calculateMaterialProfile(material?: SupportedPotMaterial): MaterialPhysicalProfile {
  const normKey = normalizeMaterialKey(material);
  switch (normKey) {
    case 'terracotta':
      return calculateTerracottaMaterialProfile();
    case 'ceramic':
      return calculateCeramicMaterialProfile();
    case 'wood':
      return calculateWoodMaterialProfile();
    case 'fabric':
      return calculateFabricMaterialProfile();
    case 'plastic':
    default:
      return calculatePlasticMaterialProfile();
  }
}

// ============================================================================
// 4. SUBSTRATE, BAGS, MASS, AND BALCONY LOAD CALCULATIONS
// ============================================================================

export function calculateSubstrateBreakdown(
  usableVolumeL: number,
  potCount: number = 1,
  drainageRatio: number = 0.15
): SubstrateBreakdown {
  const count = Math.max(1, potCount);
  const ratio = Math.min(0.3, Math.max(0.05, drainageRatio));

  if (usableVolumeL <= 0) {
    return {
      soilVolumeL: 0,
      drainageVolumeL: 0,
      totalSubstrateVolumeL: 0,
      soilVolumeAllPotsL: 0,
      drainageVolumeAllPotsL: 0,
      unit: 'l',
    };
  }

  const drainageVolumeL = roundTo(usableVolumeL * ratio, 1);
  const soilVolumeL = roundTo(usableVolumeL * (1 - ratio), 1);
  const totalSubstrateVolumeL = roundTo(drainageVolumeL + soilVolumeL, 1);

  return {
    soilVolumeL,
    drainageVolumeL,
    totalSubstrateVolumeL,
    soilVolumeAllPotsL: roundTo(soilVolumeL * count, 1),
    drainageVolumeAllPotsL: roundTo(drainageVolumeL * count, 1),
    unit: 'l',
  };
}

export function calculateBagRecommendation(
  totalSoilL: number,
  totalDrainageL: number
): BagRecommendation {
  if (totalSoilL <= 0) {
    return {
      soilBags20L: 0,
      soilBags50L: 0,
      drainageBags5L: 0,
      recommendedSoilBags: {
        bagSizeL: 20,
        count: 0,
        descriptionPl: '0 worków',
        descriptionEn: '0 bags',
      },
      unit: 'szt.',
    };
  }

  // Bag counts must strictly round UP via Math.ceil (you cannot buy 0.4 of a bag)
  const soilBags20L = Math.max(1, Math.ceil(totalSoilL / 20));
  const soilBags50L = Math.max(1, Math.ceil(totalSoilL / 50));
  const drainageBags5L = totalDrainageL > 0 ? Math.max(1, Math.ceil(totalDrainageL / 5)) : 0;

  // Decide best single-size bag recommendation
  let bestSize: 20 | 50 = 20;
  let bestCount = soilBags20L;
  if (totalSoilL > 35) {
    bestSize = 50;
    bestCount = soilBags50L;
  }

  const pluralPl = bestCount === 1 ? 'worek' : bestCount < 5 ? 'worki' : 'worków';
  const pluralEn = bestCount === 1 ? 'bag' : 'bags';

  return {
    soilBags20L,
    soilBags50L,
    drainageBags5L,
    recommendedSoilBags: {
      bagSizeL: bestSize,
      count: bestCount,
      descriptionPl: `${bestCount} ${pluralPl} (po ${bestSize} l)`,
      descriptionEn: `${bestCount} ${pluralEn} (${bestSize} l each)`,
    },
    unit: 'szt.',
  };
}

export function calculateMassBreakdown(
  grossVolumeL: number,
  substrate: SubstrateBreakdown,
  materialProfile: MaterialPhysicalProfile,
  potCount: number = 1
): MassBreakdown {
  const count = Math.max(1, potCount);

  if (grossVolumeL <= 0) {
    return {
      tarePotMassKg: 0,
      drySubstrateMassKg: 0,
      wetSubstrateMassKg: 0,
      dryTotalMassKg: 0,
      wetTotalMassKg: 0,
      wetTotalAllPotsKg: 0,
      unit: 'kg',
    };
  }

  // Dry empty container mass (tare)
  const dryTareKg = grossVolumeL * materialProfile.tareWeightPerLiterKg;
  // Wet container mass (tare with wall water absorption after soaking)
  const wetTareKg = dryTareKg * (1 + materialProfile.wallWaterAbsorptionRatio);

  // Dry substrate mass
  const drySoilKg = substrate.soilVolumeL * materialProfile.drySoilDensityKgPerL;
  const dryDrainageKg = substrate.drainageVolumeL * 0.45; // dry keramzite ~0.45 kg/l
  const drySubstrateMassKg = drySoilKg + dryDrainageKg;

  // Wet substrate mass (at field capacity after soaking/watering)
  const wetSoilKg = substrate.soilVolumeL * materialProfile.wetSoilDensityKgPerL;
  const wetDrainageKg = substrate.drainageVolumeL * materialProfile.drainageKeramziteDensityKgPerL;
  const wetSubstrateMassKg = wetSoilKg + wetDrainageKg;

  const roundedDryTareKg = roundTo(dryTareKg, 1);
  const roundedDrySubstrateKg = roundTo(drySubstrateMassKg, 1);
  const dryTotalMassKg = roundTo(roundedDryTareKg + roundedDrySubstrateKg, 1);

  const roundedWetTareKg = roundTo(wetTareKg, 1);
  const roundedWetSubstrateKg = roundTo(wetSubstrateMassKg, 1);
  const wetTotalMassKg = roundTo(roundedWetTareKg + roundedWetSubstrateKg, 1);
  const wetTotalAllPotsKg = roundTo(wetTotalMassKg * count, 1);

  return {
    tarePotMassKg: roundedDryTareKg,
    drySubstrateMassKg: roundedDrySubstrateKg,
    wetSubstrateMassKg: roundedWetSubstrateKg,
    dryTotalMassKg,
    wetTotalMassKg,
    wetTotalAllPotsKg,
    unit: 'kg',
  };
}

export function calculateBalconyLoadBreakdown(
  shape: SupportedPotShape,
  norm: NormalizedDimensions,
  wetTotalMassKg: number
): BalconyLoadBreakdown {
  if (wetTotalMassKg <= 0) {
    return {
      footprintAreaM2: 0,
      pointLoadKg: 0,
      distributedLoadKgM2: 0,
      safetyRating: 'safe',
      safetyMessagePl: 'Brak obciążenia (donica pusta lub o zerowych wymiarach).',
      safetyMessageEn: 'No load (empty container or zero dimensions).',
      unit: 'kg/m²',
    };
  }

  // Compute footprint area in square meters (m^2)
  let areaM2 = 0;
  const lengthM = (norm.lengthMm || 0) / 1000;
  const widthM = (norm.widthMm || 0) / 1000;
  const diameterM = (norm.diameterMm || norm.topDiameterMm || 0) / 1000;

  if (shape === 'rectangular') {
    areaM2 = lengthM * widthM;
  } else if (shape === 'square') {
    const sideM = widthM || lengthM || diameterM;
    areaM2 = sideM * sideM;
  } else {
    // Round, conical, bowl footprint on floor: π * r^2
    const radiusM = diameterM / 2;
    areaM2 = Math.PI * radiusM * radiusM;
  }

  // Prevent divide by zero: minimum footprint floor clamp
  const safeAreaM2 = Math.max(0.01, areaM2);
  const distributedLoadKgM2 = roundTo(wetTotalMassKg / safeAreaM2, 1);
  const pointLoadKg = roundTo(wetTotalMassKg, 1);

  // Balcony building standards in Poland & Eurocode PN-EN 1991-1-1:
  // Standard residential balcony design load capacity is 250 kg/m² (~2.5 kN/m²).
  let safetyRating: 'safe' | 'caution' | 'warning' = 'safe';
  let safetyMessagePl = 'Bezpieczne obciążenie balkonu (poniżej normy 150 kg/m²).';
  let safetyMessageEn = 'Safe balcony load (well under 150 kg/m² threshold).';

  if (distributedLoadKgM2 > 250 || pointLoadKg > 75) {
    safetyRating = 'warning';
    safetyMessagePl = 'Uwaga: wysokie obciążenie (powyżej 250 kg/m² lub > 75 kg na punkt). Umieść donicę przy ścianie nośnej budynku!';
    safetyMessageEn = 'Warning: high load (> 250 kg/m² or > 75 kg point load). Place container directly against structural building wall!';
  } else if (distributedLoadKgM2 > 160 || pointLoadKg > 45) {
    safetyRating = 'caution';
    safetyMessagePl = 'Umiarkowane obciążenie (160–250 kg/m²). Zalecane ustawienie wzdłuż ściany lub płyty nośnej.';
    safetyMessageEn = 'Moderate load (160–250 kg/m²). Position along structural wall or balcony slab.';
  }

  return {
    footprintAreaM2: roundTo(areaM2, 3),
    pointLoadKg,
    distributedLoadKgM2,
    safetyRating,
    safetyMessagePl,
    safetyMessageEn,
    unit: 'kg/m²',
  };
}

// ============================================================================
// 5. MASTER ORCHESTRATOR FUNCTION
// ============================================================================

/**
 * Calculates complete container specifications in pure, typed, deterministic fashion.
 * Extracts all math out of React components.
 * Guarantees zero negative outputs, strict unit labelling, and formula traceability.
 */
export function calculatePotFullSpecs(input: PotCalculationInput): PotCalculationResult {
  const norm = normalizePotDimensions(input);
  const potCount = Math.max(1, input.potCount || 1);
  const shape = (input.shape as SupportedPotShape) || 'rectangular';
  const materialProfile = calculateMaterialProfile(input.material);

  // 1. Volume via isolated shape path
  const volume = calculateVolumeByShape(shape, norm, input.safetyRimRatio);

  // 2. Substrate breakdown (drainage & soil)
  const substrate = calculateSubstrateBreakdown(
    volume.netUsableVolumeL,
    potCount,
    input.drainageRatio
  );

  // 3. Bag recommendation
  const bags = calculateBagRecommendation(
    substrate.soilVolumeAllPotsL,
    substrate.drainageVolumeAllPotsL
  );

  // 4. Mass breakdown via isolated material physical profile
  const mass = calculateMassBreakdown(
    volume.grossVolumeL,
    substrate,
    materialProfile,
    potCount
  );

  // 5. Balcony load & structural safety
  const balconyLoad = calculateBalconyLoadBreakdown(
    shape,
    norm,
    mass.wetTotalMassKg
  );

  // 6. Explicitly labelled formatted units (never mix numbers without labels)
  const formatted: FormattedUnitsResult = {
    volumeGrossText: `${volume.grossVolumeL} l`,
    volumeNetText: `${volume.netUsableVolumeL} l`,
    soilVolumeText: `${substrate.soilVolumeAllPotsL} l`,
    drainageVolumeText: `${substrate.drainageVolumeAllPotsL} l`,
    bagCountTextPl: bags.recommendedSoilBags.descriptionPl,
    bagCountTextEn: bags.recommendedSoilBags.descriptionEn,
    tareMassText: `${mass.tarePotMassKg} kg`,
    dryMassText: `${mass.dryTotalMassKg} kg`,
    wetMassText: `${mass.wetTotalMassKg} kg`,
    totalMassAllPotsText: `${mass.wetTotalAllPotsKg} kg`,
    balconyLoadText: `${balconyLoad.distributedLoadKgM2} kg/m²`,
    footprintText: `${balconyLoad.footprintAreaM2} m²`,
  };

  return {
    version: POT_CALCULATION_VERSION,
    shape,
    material: materialProfile.materialKey,
    potCount,
    normalizedDimensions: norm,
    volume,
    substrate,
    bags,
    mass,
    balconyLoad,
    formatted,
  };
}
