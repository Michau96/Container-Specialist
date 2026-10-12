import { useMemo } from 'react';
import { Plant, UserBalconySpec } from '../../../types';

export interface BalconyConditions {
  orientation?: string;
  containerVolumeLiters?: number;
  floor?: number;
}

export interface PlantMatchScoreResult {
  matchPercentage: number;
  exposureMatch: number; // 0 - 100
  containerVolumeMatch: number; // 0 - 100
  windToleranceMatch: number; // 0 - 100
  isAttentionRequired: boolean; // true when matchPercentage < 70
  badgeVariant: 'emerald' | 'amber';
  badgeLabel: string;
}

export interface PlantWithRecommendation extends Plant {
  recommendation: PlantMatchScoreResult;
  matchPercentage: number;
}

const ADJACENT_ORIENTATIONS: Record<string, string[]> = {
  S: ['SW', 'SE', 'SSW', 'SSE', 'S_W', 'S_E'],
  SW: ['S', 'W', 'WSW', 'SSW', 'S_W'],
  W: ['SW', 'NW', 'WSW', 'WNW'],
  NW: ['W', 'N', 'WNW', 'NNW', 'N_W'],
  N: ['NW', 'NE', 'NNW', 'NNE', 'N_W', 'N_E'],
  NE: ['N', 'E', 'NNE', 'ENE', 'N_E'],
  E: ['NE', 'SE', 'ENE', 'ESE', 'S_E', 'N_E'],
  SE: ['E', 'S', 'ESE', 'SSE', 'S_E'],
  DACH: ['S', 'SW', 'SE', 'W', 'E', 'N'],
  PATIO: ['N', 'E', 'NE', 'NW'],
};

/**
 * 1. Balcony orientation match with plant light requirements (weight 50%).
 */
export function calculateExposureMatch(
  plant: Partial<Plant> & { orientations?: string[]; sun_preference?: string },
  balconyOrientation?: string
): number {
  if (!balconyOrientation) return 100;

  const normalizedBalcony = balconyOrientation.toUpperCase().trim();
  const plantOrientations = (plant.orientations || []).map((o) => o.toUpperCase().trim());

  // Sprouts / microgreens or plants with empty orientations adapt anywhere
  if (plantOrientations.length === 0 || plant.plant_group === 'kielki') {
    return 100;
  }

  // Exact match
  if (plantOrientations.includes(normalizedBalcony)) {
    return 100;
  }

  // Check adjacent or component matches
  const adjacents = ADJACENT_ORIENTATIONS[normalizedBalcony] || [];
  const hasAdjacent = adjacents.some((adj) => plantOrientations.includes(adj));
  if (hasAdjacent) {
    return 75;
  }

  // Check if opposite exposure
  const isBalconyNorth = normalizedBalcony.includes('N') || normalizedBalcony === 'PATIO';
  const isPlantNorthFriendly =
    plantOrientations.some((o) => o.includes('N')) ||
    (plant.sun_preference && /cień|półcień|diffused/i.test(plant.sun_preference));

  if (isBalconyNorth) {
    return isPlantNorthFriendly ? 80 : 30;
  }

  const isBalconySouth = normalizedBalcony.includes('S') || normalizedBalcony === 'DACH';
  if (isBalconySouth) {
    if (plant.sun_preference && /cień|zacien/i.test(plant.sun_preference)) {
      return 40;
    }
    return 60;
  }

  return 50;
}

/**
 * 2. Current pot volume vs. minPotVolumeLiters (weight 30%).
 */
export function calculateContainerVolumeMatch(
  plant: Partial<Plant> & { pot?: { min_volume_l?: number }; minPotVolumeLiters?: number },
  currentPotVolumeLiters?: number
): number {
  const minRequired =
    plant.pot?.min_volume_l ??
    plant.minPotVolumeLiters ??
    (plant as any)?.min_volume_l ??
    5;

  if (currentPotVolumeLiters === undefined || currentPotVolumeLiters === null) {
    return 100;
  }

  if (currentPotVolumeLiters <= 0) {
    return 0;
  }

  if (currentPotVolumeLiters >= minRequired) {
    return 100;
  }

  const ratio = (currentPotVolumeLiters / minRequired) * 100;
  return Math.max(0, Math.min(100, Math.round(ratio)));
}

/**
 * 3. Floor level vs. plant wind tolerance (weight 20%).
 */
export function calculateWindToleranceMatch(
  plant: Partial<Plant> & { wind_tolerance?: string },
  floor?: number
): number {
  if (floor === undefined || floor === null) {
    return 100;
  }

  const windTolRaw = (plant.wind_tolerance || 'Średnia').toLowerCase();
  const isHigh = windTolRaw.includes('wysoka') || windTolRaw.includes('high');
  const isLow = windTolRaw.includes('niska') || windTolRaw.includes('low');
  const isMedium = !isHigh && !isLow;

  if (floor <= 3) {
    if (isLow) return 95;
    return 100;
  }

  if (floor <= 6) {
    if (isHigh) return 100;
    if (isMedium) return 90;
    return 60;
  }

  // High floor: 7+
  if (isHigh) return 100;
  if (isMedium) return 70;
  return 30;
}

/**
 * Algorithmic scoring function considering:
 * - exposureMatch (50%)
 * - containerVolumeMatch (30%)
 * - windToleranceMatch (20%)
 */
export function calculatePlantMatchScore(
  plant: Partial<Plant> & {
    orientations?: string[];
    sun_preference?: string;
    pot?: { min_volume_l?: number };
    minPotVolumeLiters?: number;
    wind_tolerance?: string;
  },
  conditions: BalconyConditions
): PlantMatchScoreResult {
  const exposureMatch = calculateExposureMatch(plant, conditions.orientation);
  const containerVolumeMatch = calculateContainerVolumeMatch(plant, conditions.containerVolumeLiters);
  const windToleranceMatch = calculateWindToleranceMatch(plant, conditions.floor);

  const weightedTotal =
    exposureMatch * 0.5 + containerVolumeMatch * 0.3 + windToleranceMatch * 0.2;

  const matchPercentage = Math.round(Math.max(0, Math.min(100, weightedTotal)));
  const isAttentionRequired = matchPercentage < 70;

  return {
    matchPercentage,
    exposureMatch,
    containerVolumeMatch,
    windToleranceMatch,
    isAttentionRequired,
    badgeVariant: isAttentionRequired ? 'amber' : 'emerald',
    badgeLabel: isAttentionRequired ? 'Wymaga uwagi' : `${matchPercentage}% dopasowania`,
  };
}

/**
 * Helper to extract BalconyConditions from UserBalconySpec.
 */
export function extractBalconyConditions(spec?: Partial<UserBalconySpec> | null): BalconyConditions {
  if (!spec) return {};

  let volume = spec.pot_dimensions?.volume_liters;
  if (!volume && spec.pots && spec.pots.length > 0) {
    if (spec.pots.includes('pots_large_15_30')) volume = 20;
    else if (spec.pots.includes('pots_medium_5_15')) volume = 10;
    else if (spec.pots.includes('boxes_balcony_15cm')) volume = 5;
    else if (spec.pots.includes('grow_bags')) volume = 15;
    else if (spec.pots.includes('hanging_baskets')) volume = 4;
  }

  return {
    orientation: spec.orientation,
    containerVolumeLiters: volume,
    floor: spec.floor,
  };
}

/**
 * Hook to compute dynamic plant recommendations & algorithmic scoring.
 */
export function usePlantRecommendations(
  plants: Plant[] = [],
  balconySpec?: Partial<UserBalconySpec> | null,
  overrideConditions?: BalconyConditions
) {
  const conditions = useMemo(() => {
    return {
      ...extractBalconyConditions(balconySpec),
      ...overrideConditions,
    };
  }, [balconySpec, overrideConditions]);

  const plantsWithScores = useMemo(() => {
    return plants.map((plant): PlantWithRecommendation => {
      const recommendation = calculatePlantMatchScore(plant, conditions);
      return {
        ...plant,
        recommendation,
        matchPercentage: recommendation.matchPercentage,
      };
    });
  }, [plants, conditions]);

  const sortedByMatch = useMemo(() => {
    return [...plantsWithScores].sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );
  }, [plantsWithScores]);

  return {
    conditions,
    plants: plantsWithScores,
    sortedByMatch,
    calculateScore: (plant: Plant) => calculatePlantMatchScore(plant, conditions),
  };
}
