import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  POLAND_REGIONS_LIST,
  MIN_FLOOR,
  MAX_FLOOR,
  calculatePotVolumeLiters,
  validateRegion,
  validateFloor,
  validateExposure,
  validateBalconyConditions,
  validateContainers,
  validateCareTime,
  validatePotQuantity,
  validatePotDimensions,
  validateCrossFieldCombinations,
  getDisabledOptionReason,
  validateOnboardingProfile,
} from './onboardingDomain';
import { UserBalconySpec, PolandRegionKey, ContainerType, PotDimensionsSpec } from '../types';

describe('Onboarding Domain Model & Validation', () => {
  describe('Unit Tests: Individual Fields', () => {
    describe('validateRegion', () => {
      it('accepts all valid Polish regions in the domain list', () => {
        for (const reg of POLAND_REGIONS_LIST) {
          expect(validateRegion(reg)).toBeNull();
        }
      });

      it('rejects missing or empty region values', () => {
        expect(validateRegion(null)).toEqual({
          field: 'region',
          code: 'REQUIRED_LOCATION',
          message: 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.',
        });
        expect(validateRegion(undefined)).toEqual({
          field: 'region',
          code: 'REQUIRED_LOCATION',
          message: 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.',
        });
        expect(validateRegion('')).toEqual({
          field: 'region',
          code: 'REQUIRED_LOCATION',
          message: 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.',
        });
        expect(validateRegion('   ')).toEqual({
          field: 'region',
          code: 'REQUIRED_LOCATION',
          message: 'Wybierz województwo (lokalizację) swojego balkonu, aby przejść dalej.',
        });
      });

      it('rejects unknown region keys with descriptive Polish copy', () => {
        const res = validateRegion('berlin');
        expect(res).not.toBeNull();
        expect(res?.code).toBe('INVALID_LOCATION');
        expect(res?.message).toContain('Nieznany region "berlin"');
      });
    });

    describe('validateFloor', () => {
      it('accepts boundary values: ground floor (0) and max residential floor (30)', () => {
        expect(validateFloor(0)).toBeNull();
        expect(validateFloor(MIN_FLOOR)).toBeNull();
        expect(validateFloor(MAX_FLOOR)).toBeNull();
        expect(validateFloor(5)).toBeNull();
      });

      it('rejects negative floor values below MIN_FLOOR boundary', () => {
        const res = validateFloor(-1);
        expect(res?.code).toBe('NEGATIVE_FLOOR');
        expect(res?.message).toContain('Numer piętra nie może być ujemny');
      });

      it('rejects floor values above MAX_FLOOR boundary (31+)', () => {
        const res = validateFloor(31);
        expect(res?.code).toBe('EXCEEDED_MAX_FLOOR');
        expect(res?.message).toContain('Maksymalne dopuszczalne piętro');
      });

      it('rejects non-integer and missing floor values', () => {
        expect(validateFloor(null)?.code).toBe('REQUIRED_FLOOR');
        expect(validateFloor(undefined)?.code).toBe('REQUIRED_FLOOR');
        expect(validateFloor(2.5)?.code).toBe('FLOOR_NOT_INTEGER');
        expect(validateFloor('piętro')?.code).toBe('INVALID_FLOOR_TYPE');
      });
    });

    describe('validateExposure', () => {
      it('accepts cardinal directions and valid Polish composite exposures', () => {
        expect(validateExposure('S')).toBeNull();
        expect(validateExposure('SE')).toBeNull();
        expect(validateExposure('SW')).toBeNull();
        expect(validateExposure('N')).toBeNull();
        expect(validateExposure('PATIO')).toBeNull();
      });

      it('rejects missing or empty exposure', () => {
        expect(validateExposure('')?.code).toBe('REQUIRED_EXPOSURE');
        expect(validateExposure(null)?.code).toBe('REQUIRED_EXPOSURE');
      });

      it('rejects invalid orientation codes', () => {
        expect(validateExposure('DOWN')?.code).toBe('INVALID_EXPOSURE');
      });
    });

    describe('validateContainers', () => {
      it('accepts valid container selections', () => {
        expect(validateContainers(['boxes_balcony_15cm', 'pots_large_15_30'])).toBeNull();
      });

      it('rejects empty or missing container selections', () => {
        expect(validateContainers([])?.code).toBe('REQUIRED_CONTAINERS');
        expect(validateContainers(null)?.code).toBe('REQUIRED_CONTAINERS');
      });

      it('rejects unknown container types', () => {
        expect(validateContainers(['unknown_box'] as any)?.code).toBe('INVALID_CONTAINER_TYPE');
      });
    });

    describe('validateCareTime', () => {
      it('accepts valid care schedule options', () => {
        expect(validateCareTime('daily')).toBeNull();
        expect(validateCareTime('few_days')).toBeNull();
        expect(validateCareTime('weekends')).toBeNull();
      });

      it('rejects missing or invalid care options', () => {
        expect(validateCareTime(null)?.code).toBe('REQUIRED_CARE_TIME');
        expect(validateCareTime('once_a_month')?.code).toBe('REQUIRED_CARE_TIME');
      });
    });

    describe('validatePotQuantity', () => {
      it('accepts valid pot counts within boundary (1 to 150)', () => {
        expect(validatePotQuantity(1)).toBeNull();
        expect(validatePotQuantity(5)).toBeNull();
        expect(validatePotQuantity(150)).toBeNull();
        expect(validatePotQuantity(undefined)).toBeNull(); // Optional when unspecified
      });

      it('rejects zero pot quantity', () => {
        const res = validatePotQuantity(0);
        expect(res?.code).toBe('NON_POSITIVE_POT_COUNT');
        expect(res?.message).toContain('Liczba donic musi być większa od zera');
      });

      it('rejects negative pot quantity', () => {
        const res = validatePotQuantity(-3);
        expect(res?.code).toBe('NON_POSITIVE_POT_COUNT');
      });

      it('rejects non-integer pot quantity', () => {
        const res = validatePotQuantity(3.5);
        expect(res?.code).toBe('POT_COUNT_NOT_INTEGER');
      });

      it('rejects excessive pot quantity beyond residential capacity (151+)', () => {
        const res = validatePotQuantity(151);
        expect(res?.code).toBe('EXCESSIVE_POT_COUNT');
        expect(res?.message).toContain('przekracza typową ładowność');
      });
    });

    describe('validatePotDimensions & calculatePotVolumeLiters', () => {
      it('calculates rectangular volume accurately in liters', () => {
        // 60 cm * 20 cm * 18 cm = 21,600 cm3 = 21.6 L
        const vol = calculatePotVolumeLiters({
          shape: 'rectangular',
          length_cm: 60,
          width_cm: 20,
          height_cm: 18,
        });
        expect(vol).toBe(21.6);
      });

      it('calculates round volume accurately in liters', () => {
        // d = 30 cm -> r = 15 cm. Area = pi * 225 = 706.858 cm2. Height = 25 cm -> 17,671 cm3 = 17.7 L
        const vol = calculatePotVolumeLiters({
          shape: 'round',
          diameter_cm: 30,
          height_cm: 25,
        });
        expect(vol).toBeCloseTo(17.7, 1);
      });

      it('rejects negative or zero dimensions', () => {
        const resZeroHeight = validatePotDimensions({
          shape: 'rectangular',
          length_cm: 60,
          width_cm: 20,
          height_cm: 0,
        });
        expect(resZeroHeight.some((e) => e.code === 'NON_POSITIVE_HEIGHT')).toBe(true);

        const resNegativeLength = validatePotDimensions({
          shape: 'rectangular',
          length_cm: -10,
          width_cm: 20,
          height_cm: 18,
        });
        expect(resNegativeLength.some((e) => e.code === 'NON_POSITIVE_LENGTH')).toBe(true);

        const resNegativeDiameter = validatePotDimensions({
          shape: 'round',
          diameter_cm: -5,
          height_cm: 20,
        });
        expect(resNegativeDiameter.some((e) => e.code === 'NON_POSITIVE_DIAMETER')).toBe(true);
      });

      it('rejects shallow pots below viable root depth (< 4 cm)', () => {
        const res = validatePotDimensions({
          shape: 'rectangular',
          length_cm: 40,
          width_cm: 20,
          height_cm: 2,
        });
        expect(res.some((e) => e.code === 'TOO_SHALLOW_POT')).toBe(true);
      });

      it('rejects excessive dimensions exceeding balcony limits', () => {
        const res = validatePotDimensions({
          shape: 'rectangular',
          length_cm: 400, // > 350 max
          width_cm: 250,  // > 200 max
          height_cm: 180, // > 150 max
        });
        expect(res.some((e) => e.code === 'EXCESSIVE_LENGTH')).toBe(true);
        expect(res.some((e) => e.code === 'EXCESSIVE_WIDTH')).toBe(true);
        expect(res.some((e) => e.code === 'EXCESSIVE_HEIGHT')).toBe(true);
      });

      it('detects capacity/volume mismatch with geometric dimensions (unit confusion)', () => {
        // 60x20x18 cm is ~21.6 L. If user enters 500 liters (or mm^3 converted wrong)
        const res = validatePotDimensions({
          shape: 'rectangular',
          length_cm: 60,
          width_cm: 20,
          height_cm: 18,
          volume_liters: 500,
        });
        expect(res.some((e) => e.code === 'CAPACITY_DIMENSIONS_MISMATCH')).toBe(true);
      });
    });
  });

  describe('Unit Tests: Cross-Field Incompatibilities', () => {
    it('rejects French balcony with large floor containers (15-30L)', () => {
      const errors = validateCrossFieldCombinations({
        balcony_type: 'french',
        pots: ['pots_large_15_30'],
        roofing: 'uncovered',
        floor: 1,
      });
      expect(errors.some((e) => e.code === 'INCOMPATIBLE_FRENCH_LARGE_POTS')).toBe(true);
      expect(errors[0].message).toContain('Balkon francuski nie posiada płyty posadzkowej');
    });

    it('rejects French balcony with fabric grow bags', () => {
      const errors = validateCrossFieldCombinations({
        balcony_type: 'french',
        pots: ['grow_bags'],
        roofing: 'uncovered',
        floor: 1,
      });
      expect(errors.some((e) => e.code === 'INCOMPATIBLE_FRENCH_GROW_BAGS')).toBe(true);
    });

    it('rejects French balcony with covered roof', () => {
      const errors = validateCrossFieldCombinations({
        balcony_type: 'french',
        pots: ['boxes_balcony_15cm'],
        roofing: 'covered',
        floor: 1,
      });
      expect(errors.some((e) => e.code === 'INCOMPATIBLE_FRENCH_COVERED_ROOF')).toBe(true);
    });

    it('rejects high floor (7+) with open rail, uncovered roof, and weekend-only watering', () => {
      const errors = validateCrossFieldCombinations({
        balcony_type: 'open_rail',
        roofing: 'uncovered',
        floor: 8,
        care_time: 'weekends',
      });
      expect(errors.some((e) => e.code === 'INCOMPATIBLE_HIGH_FLOOR_DROUGHT_RISK')).toBe(true);
      expect(errors[0].message).toContain('Na wysokim piętrze (7+) z ażurową barierką');
    });
  });

  describe('Unit Tests: Disabled Options Explanations (Requirements 4 & 5)', () => {
    it('explains why large pots are disabled for French balcony in Polish', () => {
      const reason = getDisabledOptionReason('pot', 'pots_large_15_30', {
        balcony_type: 'french',
      });
      expect(reason).toBe('Opcja niedostępna dla balkonu francuskiego: brak płyty posadzkowej wyklucza duże donice stojące.');
    });

    it('explains why grow bags are disabled for French balcony in Polish', () => {
      const reason = getDisabledOptionReason('pot', 'grow_bags', {
        balcony_type: 'french',
      });
      expect(reason).toContain('worki uprawowe wymagają stabilnej posadzki');
    });

    it('explains why covered roof is disabled for French balcony in Polish', () => {
      const reason = getDisabledOptionReason('roofing', 'covered', {
        balcony_type: 'french',
      });
      expect(reason).toContain('Niedostępne dla portfenetru');
    });

    it('explains why weekend-only watering is disabled on windy 8th floor open balcony', () => {
      const reason = getDisabledOptionReason('care', 'weekends', {
        floor: 8,
        balcony_type: 'open_rail',
        roofing: 'uncovered',
      });
      expect(reason).toContain('porywisty wiatr na wysokim piętrze (7+)');
    });

    it('returns null when option is completely valid', () => {
      const reason = getDisabledOptionReason('pot', 'boxes_balcony_15cm', {
        balcony_type: 'french',
      });
      expect(reason).toBeNull();
    });
  });

  describe('Unit Tests: validateOnboardingProfile Pre-Persistence Validation', () => {
    it('validates a complete valid profile successfully', () => {
      const validSpec: UserBalconySpec = {
        region: 'pomorskie',
        floor: 0,
        orientation: 'S',
        balcony_type: 'open_rail',
        roofing: 'uncovered',
        pots: ['boxes_balcony_15cm'],
        care_time: 'daily',
        pot_count: 4,
        pot_dimensions: {
          shape: 'rectangular',
          length_cm: 60,
          width_cm: 20,
          height_cm: 18,
          volume_liters: 21.6,
        },
      };

      const result = validateOnboardingProfile(validSpec);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.summaryMessage).toBe('');
    });

    it('rejects empty or null spec with descriptive error', () => {
      const result = validateOnboardingProfile(null);
      expect(result.isValid).toBe(false);
      expect(result.fieldErrors.root).toContain('Brak konfiguracji profilu balkonu');
    });

    it('aggregates multiple field errors cleanly', () => {
      const invalidSpec = {
        region: '',
        floor: -2,
        orientation: '',
        balcony_type: 'open_rail',
        roofing: 'uncovered',
        pots: [],
        care_time: '',
        pot_count: 0,
      };

      const result = validateOnboardingProfile(invalidSpec);
      expect(result.isValid).toBe(false);
      expect(result.fieldErrors.region).toBeDefined();
      expect(result.fieldErrors.floor).toBeDefined();
      expect(result.fieldErrors.orientation).toBeDefined();
      expect(result.fieldErrors.pots).toBeDefined();
      expect(result.fieldErrors.care_time).toBeDefined();
      expect(result.fieldErrors.pot_count).toBeDefined();
    });
  });

  describe('Property-Based Tests (fast-check)', () => {
    it('PBT: non-positive pot counts are ALWAYS rejected', () => {
      fc.assert(
        fc.property(fc.integer({ max: 0 }), (nonPositiveCount) => {
          const res = validatePotQuantity(nonPositiveCount);
          return res !== null && res.code === 'NON_POSITIVE_POT_COUNT';
        })
      );
    });

    it('PBT: valid integer pot counts in [1, 150] are ALWAYS accepted', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 150 }), (validCount) => {
          const res = validatePotQuantity(validCount);
          return res === null;
        })
      );
    });

    it('PBT: negative heights are ALWAYS rejected', () => {
      fc.assert(
        fc.property(
          fc.double({ max: -0.01, noNaN: true }),
          fc.double({ min: 10, max: 100, noNaN: true }),
          fc.double({ min: 10, max: 50, noNaN: true }),
          (negH, l, w) => {
            const res = validatePotDimensions({
              shape: 'rectangular',
              height_cm: negH,
              length_cm: l,
              width_cm: w,
            });
            return res.some((e) => e.code === 'NON_POSITIVE_HEIGHT');
          }
        )
      );
    });

    it('PBT: floors outside [0, 30] are ALWAYS rejected', () => {
      fc.assert(
        fc.property(
          fc.oneof(fc.integer({ max: -1 }), fc.integer({ min: 31, max: 1000 })),
          (invalidFloor) => {
            const res = validateFloor(invalidFloor);
            return res !== null && (res.code === 'NEGATIVE_FLOOR' || res.code === 'EXCEEDED_MAX_FLOOR');
          }
        )
      );
    });

    it('PBT: valid floors in [0, 30] are ALWAYS accepted', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 30 }), (validFloor) => {
          return validateFloor(validFloor) === null;
        })
      );
    });

    it('PBT: geometric pot volume calculation is strictly positive and monotonic with height', () => {
      fc.assert(
        fc.property(
          fc.double({ min: 10, max: 100, noNaN: true }),
          fc.double({ min: 10, max: 50, noNaN: true }),
          fc.double({ min: 5, max: 50, noNaN: true }),
          fc.double({ min: 51, max: 100, noNaN: true }),
          (l, w, hLow, hHigh) => {
            const vLow = calculatePotVolumeLiters({ shape: 'rectangular', length_cm: l, width_cm: w, height_cm: hLow });
            const vHigh = calculatePotVolumeLiters({ shape: 'rectangular', length_cm: l, width_cm: w, height_cm: hHigh });
            return vLow > 0 && vHigh > vLow;
          }
        )
      );
    });

    it('PBT: French balcony with large pots or grow bags ALWAYS raises cross-field error', () => {
      const frenchIncompatibleContainers: ContainerType[] = ['pots_large_15_30', 'grow_bags'];
      fc.assert(
        fc.property(
          fc.constantFrom(...frenchIncompatibleContainers),
          fc.integer({ min: 0, max: 10 }),
          (incompatibleContainer, floor) => {
            const errors = validateCrossFieldCombinations({
              balcony_type: 'french',
              pots: [incompatibleContainer],
              roofing: 'uncovered',
              floor,
            });
            return errors.length > 0 && errors[0].isCrossField === true;
          }
        )
      );
    });
  });
});
