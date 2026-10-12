import { describe, it, expect } from 'vitest';
import {
  calculateExposureMatch,
  calculateContainerVolumeMatch,
  calculateWindToleranceMatch,
  calculatePlantMatchScore,
  extractBalconyConditions,
} from './usePlantRecommendations';
import { Plant, UserBalconySpec } from '../../../types';

describe('usePlantRecommendations - Algorithmic Scoring & Dynamic Match Badge', () => {
  const sampleTomato: Partial<Plant> = {
    id: 'pomidor-karlowy',
    name: 'Pomidor karłowy',
    orientations: ['S', 'SW', 'SE'],
    sun_preference: 'Pełne słońce',
    pot: {
      min_volume_l: 10,
      recommended_volume_l: 15,
      min_depth_cm: 20,
      drainage: '3 cm',
      material: 'Donica',
    },
    wind_tolerance: 'Średnia',
  };

  const sampleMint: Partial<Plant> = {
    id: 'mieta-pieprzowa',
    name: 'Mięta pieprzowa',
    orientations: ['E', 'W', 'N', 'NE', 'NW'],
    sun_preference: 'Półcień / cień',
    pot: {
      min_volume_l: 5,
      recommended_volume_l: 8,
      min_depth_cm: 15,
      drainage: '2 cm',
      material: 'Donica',
    },
    wind_tolerance: 'Wysoka',
  };

  describe('1. exposureMatch (Balcony orientation match with plant light requirements - 50%)', () => {
    it('awards 100% when balcony orientation directly matches plant orientation preference', () => {
      const match = calculateExposureMatch(sampleTomato, 'S');
      expect(match).toBe(100);
    });

    it('awards partial 75% for adjacent orientation', () => {
      // W is adjacent to SW
      const match = calculateExposureMatch(sampleTomato, 'W');
      expect(match).toBe(75);
    });

    it('awards low score for opposing orientation (e.g. North balcony for sun-demanding tomato)', () => {
      const match = calculateExposureMatch(sampleTomato, 'N');
      expect(match).toBeLessThan(50);
    });

    it('gives shade-loving plants higher score on North balcony', () => {
      const tomatoOnNorth = calculateExposureMatch(sampleTomato, 'N');
      const mintOnNorth = calculateExposureMatch(sampleMint, 'N');
      expect(mintOnNorth).toBeGreaterThan(tomatoOnNorth);
    });
  });

  describe('2. containerVolumeMatch (Current pot volume vs. minPotVolumeLiters - 30%)', () => {
    it('awards 100% when pot volume meets or exceeds minimum volume', () => {
      const match = calculateContainerVolumeMatch(sampleTomato, 10);
      expect(match).toBe(100);

      const excessMatch = calculateContainerVolumeMatch(sampleTomato, 20);
      expect(excessMatch).toBe(100);
    });

    it('scales proportionally when pot volume is below minimum', () => {
      // 5L for 10L min requirement = 50%
      const match = calculateContainerVolumeMatch(sampleTomato, 5);
      expect(match).toBe(50);

      // 3L for 10L min requirement = 30%
      const match3L = calculateContainerVolumeMatch(sampleTomato, 3);
      expect(match3L).toBe(30);
    });

    it('returns 0 when volume is 0 or negative', () => {
      expect(calculateContainerVolumeMatch(sampleTomato, 0)).toBe(0);
      expect(calculateContainerVolumeMatch(sampleTomato, -5)).toBe(0);
    });
  });

  describe('3. windToleranceMatch (Floor level vs. plant wind tolerance - 20%)', () => {
    it('awards high score on low floors (0-3) regardless of plant wind tolerance', () => {
      const lowFloorMatch = calculateWindToleranceMatch(sampleTomato, 2);
      expect(lowFloorMatch).toBe(100);
    });

    it('evaluates wind tolerance on high floors (7+)', () => {
      const tomatoHighFloor = calculateWindToleranceMatch(sampleTomato, 8); // Średnia
      const mintHighFloor = calculateWindToleranceMatch(sampleMint, 8); // Wysoka

      expect(mintHighFloor).toBe(100);
      expect(tomatoHighFloor).toBe(70);

      const sensitivePlant = { wind_tolerance: 'Niska' };
      const sensitiveHighFloor = calculateWindToleranceMatch(sensitivePlant, 8);
      expect(sensitiveHighFloor).toBe(30);
    });
  });

  describe('Weighted scoring formula & badge output', () => {
    it('calculates weighted score: 50% exposure + 30% container + 20% wind', () => {
      // Optimal conditions: S (100%), 12L (100%), 2nd floor (100%)
      // 100 * 0.5 + 100 * 0.3 + 100 * 0.2 = 100%
      const result = calculatePlantMatchScore(sampleTomato, {
        orientation: 'S',
        containerVolumeLiters: 12,
        floor: 2,
      });

      expect(result.exposureMatch).toBe(100);
      expect(result.containerVolumeMatch).toBe(100);
      expect(result.windToleranceMatch).toBe(100);
      expect(result.matchPercentage).toBe(100);
      expect(result.isAttentionRequired).toBe(false);
      expect(result.badgeLabel).toBe('100% dopasowania');
      expect(result.badgeVariant).toBe('emerald');
    });

    it('renders dynamic match percentage (e.g. 93% or 85%) instead of hardcoded 99%', () => {
      // S (100%), 5L pot for 10L min (50%), 2nd floor (100%)
      // 100 * 0.5 + 50 * 0.3 + 100 * 0.2 = 50 + 15 + 20 = 85%
      const result = calculatePlantMatchScore(sampleTomato, {
        orientation: 'S',
        containerVolumeLiters: 5,
        floor: 2,
      });

      expect(result.matchPercentage).toBe(85);
      expect(result.badgeLabel).toBe('85% dopasowania');
      expect(result.badgeVariant).toBe('emerald');
      expect(result.isAttentionRequired).toBe(false);
    });

    it('displays "Wymaga uwagi" amber badge when match is < 70%', () => {
      // N exposure for sun tomato (30%), 3L pot for 10L min (30%), 9th floor (70%)
      // 30 * 0.5 + 30 * 0.3 + 70 * 0.2 = 15 + 9 + 14 = 38%
      const result = calculatePlantMatchScore(sampleTomato, {
        orientation: 'N',
        containerVolumeLiters: 3,
        floor: 9,
      });

      expect(result.matchPercentage).toBe(38);
      expect(result.matchPercentage).toBeLessThan(70);
      expect(result.isAttentionRequired).toBe(true);
      expect(result.badgeLabel).toBe('Wymaga uwagi');
      expect(result.badgeVariant).toBe('amber');
    });

    it('correctly extracts balcony conditions from UserBalconySpec', () => {
      const spec: Partial<UserBalconySpec> = {
        orientation: 'SW',
        floor: 4,
        pot_dimensions: {
          shape: 'rectangular',
          height_cm: 20,
          volume_liters: 18.5,
        },
      };

      const extracted = extractBalconyConditions(spec);
      expect(extracted.orientation).toBe('SW');
      expect(extracted.floor).toBe(4);
      expect(extracted.containerVolumeLiters).toBe(18.5);
    });
  });
});
