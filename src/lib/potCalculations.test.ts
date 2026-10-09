import { describe, it, expect } from 'vitest';
import {
  POT_CALCULATION_VERSION,
  normalizeToMillimeters,
  normalizePotDimensions,
  roundTo,
  calculateRectangularVolume,
  calculateRoundVolume,
  calculateSquareVolume,
  calculateConicalVolume,
  calculateBowlVolume,
  calculateVolumeByShape,
  calculateMaterialProfile,
  calculateSubstrateBreakdown,
  calculateBagRecommendation,
  calculateMassBreakdown,
  calculateBalconyLoadBreakdown,
  calculatePotFullSpecs,
  PotCalculationInput,
} from './potCalculations';

describe('Pot Calculations Module - Mathematical Modeling & Physics', () => {
  // ==========================================================================
  // REQUIREMENT 3: NORMALIZATION INTO CANONICAL MILLIMETERS
  // ==========================================================================
  describe('Unit Normalization into Canonical Millimeters', () => {
    it('normalizes centimeters into millimeters (1 cm = 10 mm)', () => {
      expect(normalizeToMillimeters(60, 'cm')).toBe(600);
      expect(normalizeToMillimeters(20.5, 'cm')).toBe(205);
    });

    it('normalizes meters into millimeters (1 m = 1000 mm)', () => {
      expect(normalizeToMillimeters(0.6, 'm')).toBe(600);
      expect(normalizeToMillimeters(1.2, 'm')).toBe(1200);
    });

    it('preserves native millimeters (1 mm = 1 mm)', () => {
      expect(normalizeToMillimeters(400, 'mm')).toBe(400);
    });

    it('strictly clamps negative dimensions and NaN/null to zero (Requirement 6)', () => {
      expect(normalizeToMillimeters(-25, 'cm')).toBe(0);
      expect(normalizeToMillimeters(-0.5, 'm')).toBe(0);
      expect(normalizeToMillimeters(NaN as any, 'cm')).toBe(0);
      expect(normalizeToMillimeters(null as any, 'cm')).toBe(0);
      expect(normalizeToMillimeters(undefined as any, 'cm')).toBe(0);
      expect(normalizeToMillimeters(Infinity as any, 'cm')).toBe(0);
    });

    it('normalizes all container inputs consistently via normalizePotDimensions', () => {
      const norm = normalizePotDimensions({
        shape: 'rectangular',
        length: 80,
        width: 25,
        height: 20,
        unit: 'cm',
      });
      expect(norm.lengthMm).toBe(800);
      expect(norm.widthMm).toBe(250);
      expect(norm.heightMm).toBe(200);
    });
  });

  // ==========================================================================
  // REQUIREMENT 5: REFERENCE FIXTURES & TOLERANCE-BASED ASSERTIONS
  // ==========================================================================
  describe('Reference Fixtures with Tolerance-Based Assertions', () => {
    it('1. Rectangular window box (60 cm × 20 cm × 20 cm) yields exactly 24.0 l', () => {
      // 0.6 m * 0.2 m * 0.2 m = 0.024 m^3 = 24.0 L
      const norm = { lengthMm: 600, widthMm: 200, heightMm: 200 };
      const vol = calculateRectangularVolume(norm, 0.05);

      expect(vol.grossVolumeL).toBeCloseTo(24.0, 1);
      // Net usable volume with 5% rim clearance: 24.0 * 0.95 = 22.8 L
      expect(vol.netUsableVolumeL).toBeCloseTo(22.8, 1);
      expect(vol.unit).toBe('l');
    });

    it('2. Cylindrical / round pot (⌀ 30 cm, height 25 cm) yields 17.7 l (tolerance ±0.05 L)', () => {
      // Radius = 15 cm = 1.5 dm, Height = 25 cm = 2.5 dm
      // V = π * 1.5^2 * 2.5 = π * 2.25 * 2.5 = 17.6714586... L
      const norm = { diameterMm: 300, heightMm: 250 };
      const vol = calculateRoundVolume(norm, 0.05);

      expect(vol.grossVolumeL).toBeCloseTo(17.7, 1);
      expect(Math.abs(vol.grossVolumeL - 17.67)).toBeLessThan(0.05);
      // Net usable volume with 5% rim clearance: ~16.8 L
      expect(vol.netUsableVolumeL).toBeCloseTo(16.8, 1);
      expect(vol.unit).toBe('l');
    });

    it('3. Square planter (40 cm × 40 cm, height 35 cm) yields exactly 56.0 l', () => {
      // 4 dm * 4 dm * 3.5 dm = 56.0 L
      const norm = { widthMm: 400, heightMm: 350 };
      const vol = calculateSquareVolume(norm, 0.05);

      expect(vol.grossVolumeL).toBeCloseTo(56.0, 1);
      expect(vol.netUsableVolumeL).toBeCloseTo(53.2, 1);
      expect(vol.unit).toBe('l');
    });

    it('4. Conical frustum pot (top ⌀ 30 cm, bottom ⌀ 20 cm, height 25 cm) yields 12.4 l', () => {
      // R1 = 15 cm = 1.5 dm, R2 = 10 cm = 1.0 dm, h = 25 cm = 2.5 dm
      // V = (π * 2.5 / 3) * (1.5^2 + 1.5*1.0 + 1.0^2) = (2.5π / 3) * (2.25 + 1.5 + 1.0) = (2.5π / 3) * 4.75 ≈ 12.435 L
      const norm = { topDiameterMm: 300, bottomDiameterMm: 200, heightMm: 250 };
      const vol = calculateConicalVolume(norm, 0.05);

      expect(vol.grossVolumeL).toBeCloseTo(12.4, 1);
      expect(vol.unit).toBe('l');
    });

    it('5. Spherical hemisphere bowl (⌀ 30 cm, depth 15 cm) yields 7.1 l', () => {
      // Hemisphere: (2/3) * π * r^3 = (2/3) * π * 1.5^3 = (2/3) * π * 3.375 = 2.25 * π ≈ 7.0685 L
      const norm = { diameterMm: 300, heightMm: 150 };
      const vol = calculateBowlVolume(norm, 0.05);

      expect(vol.grossVolumeL).toBeCloseTo(7.1, 1);
      expect(vol.unit).toBe('l');
    });
  });

  // ==========================================================================
  // REQUIREMENT 2: SEPARATE CALCULATION PATHS FOR SHAPES & MATERIALS
  // ==========================================================================
  describe('Separate Shape & Material Calculation Paths', () => {
    it('executes isolated calculation paths for all 5 shapes', () => {
      const rectInput: PotCalculationInput = { shape: 'rectangular', length: 50, width: 20, height: 20 };
      const roundInput: PotCalculationInput = { shape: 'round', diameter: 30, height: 25 };
      const squareInput: PotCalculationInput = { shape: 'square', width: 30, height: 30 };
      const conicalInput: PotCalculationInput = { shape: 'conical', topDiameter: 30, bottomDiameter: 20, height: 25 };
      const bowlInput: PotCalculationInput = { shape: 'bowl', diameter: 30, height: 15 };

      const resRect = calculatePotFullSpecs(rectInput);
      const resRound = calculatePotFullSpecs(roundInput);
      const resSquare = calculatePotFullSpecs(squareInput);
      const resConical = calculatePotFullSpecs(conicalInput);
      const resBowl = calculatePotFullSpecs(bowlInput);

      expect(resRect.shape).toBe('rectangular');
      expect(resRound.shape).toBe('round');
      expect(resSquare.shape).toBe('square');
      expect(resConical.shape).toBe('conical');
      expect(resBowl.shape).toBe('bowl');

      expect(resRect.volume.grossVolumeL).toBe(20.0);
      expect(resRound.volume.grossVolumeL).toBe(17.7);
      expect(resSquare.volume.grossVolumeL).toBe(27.0);
      expect(resConical.volume.grossVolumeL).toBe(12.4);
      expect(resBowl.volume.grossVolumeL).toBe(7.1);
    });

    it('executes isolated physical profiles for each container material', () => {
      const plastic = calculateMaterialProfile('plastic');
      const terracotta = calculateMaterialProfile('terracotta');
      const ceramic = calculateMaterialProfile('ceramic');
      const wood = calculateMaterialProfile('wood');
      const fabric = calculateMaterialProfile('fabric');

      // Plastic: lightweight, no moisture absorption into walls
      expect(plastic.tareWeightPerLiterKg).toBeLessThan(0.06);
      expect(plastic.wallWaterAbsorptionRatio).toBe(0.0);

      // Terracotta: heavy unglazed clay, absorbs ~12% moisture into porous walls
      expect(terracotta.tareWeightPerLiterKg).toBeGreaterThan(0.20);
      expect(terracotta.wallWaterAbsorptionRatio).toBe(0.12);

      // Ceramic: heaviest glazed stoneware
      expect(ceramic.tareWeightPerLiterKg).toBeGreaterThan(0.30);

      // Wood: natural timber, absorbs ~15% moisture
      expect(wood.wallWaterAbsorptionRatio).toBe(0.15);

      // Fabric: ultra-lightweight growbag
      expect(fabric.tareWeightPerLiterKg).toBeLessThan(0.02);
    });

    it('material affects total wet mass and balcony load for identical 24L containers', () => {
      const baseInput: PotCalculationInput = {
        shape: 'rectangular',
        length: 60,
        width: 20,
        height: 20,
      };

      const plasticRes = calculatePotFullSpecs({ ...baseInput, material: 'plastic' });
      const terracottaRes = calculatePotFullSpecs({ ...baseInput, material: 'terracotta' });
      const ceramicRes = calculatePotFullSpecs({ ...baseInput, material: 'ceramic' });
      const fabricRes = calculatePotFullSpecs({ ...baseInput, material: 'fabric' });

      // Fabric should be lightest
      expect(fabricRes.mass.wetTotalMassKg).toBeLessThan(plasticRes.mass.wetTotalMassKg);
      // Plastic should be lighter than terracotta
      expect(plasticRes.mass.wetTotalMassKg).toBeLessThan(terracottaRes.mass.wetTotalMassKg);
      // Ceramic should be heavier than terracotta
      expect(ceramicRes.mass.wetTotalMassKg).toBeGreaterThan(terracottaRes.mass.wetTotalMassKg);

      // Terracotta tare is substantially heavier than plastic tare
      expect(terracottaRes.mass.tarePotMassKg).toBeGreaterThan(plasticRes.mass.tarePotMassKg * 4);
    });
  });

  // ==========================================================================
  // REQUIREMENT 4: STRUCTURED RESULT CONTAINING ALL REQUIRED METRICS
  // ==========================================================================
  describe('Structured Result Breakdown', () => {
    it('returns volume, substrate amount, bag count, mass, and balcony load', () => {
      const res = calculatePotFullSpecs({
        shape: 'rectangular',
        material: 'plastic',
        length: 60,
        width: 20,
        height: 20,
        potCount: 2,
      });

      // 1. Volume
      expect(res.volume).toBeDefined();
      expect(res.volume.grossVolumeL).toBe(24.0);
      expect(res.volume.netUsableVolumeL).toBe(22.8);
      expect(res.volume.unit).toBe('l');

      // 2. Substrate
      expect(res.substrate).toBeDefined();
      expect(res.substrate.drainageVolumeL).toBe(3.4); // ~15% of 22.8L
      expect(res.substrate.soilVolumeL).toBe(19.4);    // ~85% of 22.8L
      expect(res.substrate.soilVolumeAllPotsL).toBe(38.8); // 2 pots
      expect(res.substrate.unit).toBe('l');

      // 3. Bag count
      expect(res.bags).toBeDefined();
      expect(res.bags.soilBags20L).toBe(2); // 38.8L / 20 = 1.94 -> ceil = 2 bags
      expect(res.bags.drainageBags5L).toBe(2); // 6.8L / 5 = 1.36 -> ceil = 2 bags
      expect(res.bags.unit).toBe('szt.');

      // 4. Mass
      expect(res.mass).toBeDefined();
      expect(res.mass.tarePotMassKg).toBeGreaterThan(0);
      expect(res.mass.dryTotalMassKg).toBeGreaterThan(10);
      expect(res.mass.wetTotalMassKg).toBeGreaterThan(res.mass.dryTotalMassKg);
      expect(res.mass.wetTotalAllPotsKg).toBeCloseTo(res.mass.wetTotalMassKg * 2, 1);
      expect(res.mass.unit).toBe('kg');

      // 5. Balcony load
      expect(res.balconyLoad).toBeDefined();
      expect(res.balconyLoad.footprintAreaM2).toBe(0.12); // 0.6m * 0.2m = 0.12 m^2
      expect(res.balconyLoad.distributedLoadKgM2).toBeGreaterThan(100);
      expect(res.balconyLoad.safetyRating).toBeDefined();
      expect(res.balconyLoad.unit).toBe('kg/m²');
    });
  });

  // ==========================================================================
  // REQUIREMENT 6: PREVENTION OF NEGATIVE OUTPUTS & ROUNDING RULES
  // ==========================================================================
  describe('Prevention of Negative Outputs and Strict Rounding', () => {
    it('returns zero for all metrics when given zero or negative dimensions', () => {
      const resNegative = calculatePotFullSpecs({
        shape: 'rectangular',
        length: -50,
        width: -20,
        height: -10,
        potCount: -2,
      });

      expect(resNegative.volume.grossVolumeL).toBe(0);
      expect(resNegative.volume.netUsableVolumeL).toBe(0);
      expect(resNegative.substrate.soilVolumeL).toBe(0);
      expect(resNegative.substrate.drainageVolumeL).toBe(0);
      expect(resNegative.bags.soilBags20L).toBe(0);
      expect(resNegative.bags.drainageBags5L).toBe(0);
      expect(resNegative.mass.wetTotalMassKg).toBe(0);
      expect(resNegative.balconyLoad.distributedLoadKgM2).toBe(0);
    });

    it('bag counts are rounded UP to whole bags (Math.ceil) - you cannot buy fractional bags', () => {
      // 21 L of soil requires 2x 20L bags (not 1.05)
      const bags21L = calculateBagRecommendation(21, 6);
      expect(bags21L.soilBags20L).toBe(2);
      expect(bags21L.drainageBags5L).toBe(2); // 6L / 5 = 1.2 -> 2 bags

      // 41 L of soil requires 3x 20L bags or 1x 50L bag
      const bags41L = calculateBagRecommendation(41, 4);
      expect(bags41L.soilBags20L).toBe(3);
      expect(bags41L.soilBags50L).toBe(1);
      expect(bags41L.drainageBags5L).toBe(1);
    });

    it('deterministic roundTo utility rounds cleanly without negative zero', () => {
      expect(roundTo(0)).toBe(0);
      expect(roundTo(-12.4)).toBe(0);
      expect(roundTo(14.24, 1)).toBe(14.2);
      expect(roundTo(14.26, 1)).toBe(14.3);
      expect(roundTo(14.25, 1)).toBe(14.3);
      expect(roundTo(14.2567, 2)).toBe(14.26);
    });
  });

  // ==========================================================================
  // REQUIREMENT 7: DISPLAY UNIT NEXT TO EVERY RESULT, NEVER UNLABELLED
  // ==========================================================================
  describe('Unit Display Enforcement on Formatted Results', () => {
    it('every formatted property explicitly includes its corresponding unit', () => {
      const res = calculatePotFullSpecs({
        shape: 'rectangular',
        length: 60,
        width: 20,
        height: 20,
      });

      // Volume must have "l"
      expect(res.formatted.volumeGrossText).toMatch(/^\d+(\.\d+)? l$/);
      expect(res.formatted.volumeNetText).toMatch(/^\d+(\.\d+)? l$/);

      // Substrates must have "l"
      expect(res.formatted.soilVolumeText).toMatch(/^\d+(\.\d+)? l$/);
      expect(res.formatted.drainageVolumeText).toMatch(/^\d+(\.\d+)? l$/);

      // Masses must have "kg"
      expect(res.formatted.tareMassText).toMatch(/^\d+(\.\d+)? kg$/);
      expect(res.formatted.dryMassText).toMatch(/^\d+(\.\d+)? kg$/);
      expect(res.formatted.wetMassText).toMatch(/^\d+(\.\d+)? kg$/);

      // Balcony load must have "kg/m²"
      expect(res.formatted.balconyLoadText).toMatch(/^\d+(\.\d+)? kg\/m²$/);

      // Footprint must have "m²"
      expect(res.formatted.footprintText).toMatch(/^\d+(\.\d+)? m²$/);

      // Bags must have descriptive text including bag size in "l"
      expect(res.formatted.bagCountTextPl).toMatch(/worek|worki|worków/);
      expect(res.formatted.bagCountTextPl).toContain('l');
    });
  });

  // ==========================================================================
  // REQUIREMENT 8: PROPERTY-BASED TESTS FOR MONOTONICITY
  // ==========================================================================
  describe('Property-Based Monotonicity: Increasing Valid Dimension Must Not Reduce Volume', () => {
    it('rectangular pot monotonicity: increasing length, width, or height never decreases volume', () => {
      const baseL = 40;
      const baseW = 20;
      const baseH = 20;

      const baseVol = calculatePotFullSpecs({
        shape: 'rectangular',
        length: baseL,
        width: baseW,
        height: baseH,
      }).volume.grossVolumeL;

      // Test increasing length from 40 to 100 cm in steps
      for (let deltaL = 5; deltaL <= 60; deltaL += 5) {
        const higherVol = calculatePotFullSpecs({
          shape: 'rectangular',
          length: baseL + deltaL,
          width: baseW,
          height: baseH,
        }).volume.grossVolumeL;
        expect(higherVol).toBeGreaterThanOrEqual(baseVol);
      }

      // Test increasing width from 20 to 50 cm
      for (let deltaW = 5; deltaW <= 30; deltaW += 5) {
        const higherVol = calculatePotFullSpecs({
          shape: 'rectangular',
          length: baseL,
          width: baseW + deltaW,
          height: baseH,
        }).volume.grossVolumeL;
        expect(higherVol).toBeGreaterThanOrEqual(baseVol);
      }

      // Test increasing height from 20 to 60 cm
      for (let deltaH = 5; deltaH <= 40; deltaH += 5) {
        const higherVol = calculatePotFullSpecs({
          shape: 'rectangular',
          length: baseL,
          width: baseW,
          height: baseH + deltaH,
        }).volume.grossVolumeL;
        expect(higherVol).toBeGreaterThanOrEqual(baseVol);
      }
    });

    it('round pot monotonicity: increasing diameter or height never decreases volume', () => {
      const baseD = 25;
      const baseH = 20;
      const baseVol = calculatePotFullSpecs({
        shape: 'round',
        diameter: baseD,
        height: baseH,
      }).volume.grossVolumeL;

      for (let deltaD = 2; deltaD <= 30; deltaD += 3) {
        const higherVol = calculatePotFullSpecs({
          shape: 'round',
          diameter: baseD + deltaD,
          height: baseH,
        }).volume.grossVolumeL;
        expect(higherVol).toBeGreaterThanOrEqual(baseVol);
      }

      for (let deltaH = 2; deltaH <= 30; deltaH += 3) {
        const higherVol = calculatePotFullSpecs({
          shape: 'round',
          diameter: baseD,
          height: baseH + deltaH,
        }).volume.grossVolumeL;
        expect(higherVol).toBeGreaterThanOrEqual(baseVol);
      }
    });

    it('conical pot monotonicity: increasing top diameter or height never decreases volume', () => {
      const baseD = 25;
      const baseBottom = 18;
      const baseH = 20;

      const baseVol = calculatePotFullSpecs({
        shape: 'conical',
        topDiameter: baseD,
        bottomDiameter: baseBottom,
        height: baseH,
      }).volume.grossVolumeL;

      for (let delta = 3; delta <= 25; delta += 3) {
        const higherTop = calculatePotFullSpecs({
          shape: 'conical',
          topDiameter: baseD + delta,
          bottomDiameter: baseBottom,
          height: baseH,
        }).volume.grossVolumeL;
        expect(higherTop).toBeGreaterThanOrEqual(baseVol);

        const higherHeight = calculatePotFullSpecs({
          shape: 'conical',
          topDiameter: baseD,
          bottomDiameter: baseBottom,
          height: baseH + delta,
        }).volume.grossVolumeL;
        expect(higherHeight).toBeGreaterThanOrEqual(baseVol);
      }
    });

    it('square pot monotonicity: increasing side or height never decreases volume', () => {
      const baseSide = 25;
      const baseH = 25;
      const baseVol = calculatePotFullSpecs({
        shape: 'square',
        width: baseSide,
        height: baseH,
      }).volume.grossVolumeL;

      for (let delta = 5; delta <= 30; delta += 5) {
        const higherSide = calculatePotFullSpecs({
          shape: 'square',
          width: baseSide + delta,
          height: baseH,
        }).volume.grossVolumeL;
        expect(higherSide).toBeGreaterThanOrEqual(baseVol);
      }
    });
  });

  // ==========================================================================
  // REQUIREMENT 9: CALCULATION VERSION TRACEABILITY
  // ==========================================================================
  describe('Calculation Version Traceability', () => {
    it('POT_CALCULATION_VERSION constant is defined and matches semantic versioning format', () => {
      expect(POT_CALCULATION_VERSION).toBeDefined();
      expect(POT_CALCULATION_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('every returned calculation result includes the calculation version', () => {
      const res = calculatePotFullSpecs({
        shape: 'round',
        diameter: 30,
        height: 25,
      });

      expect(res.version).toBe(POT_CALCULATION_VERSION);
    });
  });
});
