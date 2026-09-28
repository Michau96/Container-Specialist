import { describe, it, expect } from 'vitest';
import {
  validatePlantRecord,
  validatePlantCatalog,
  isImageMetadataConsistent,
} from './catalogValidation';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';

describe('Catalog Data Validation Layer', () => {
  it('validates entire seed catalog without errors for genuine records', () => {
    const report = validatePlantCatalog(defaultPlantsData);
    expect(report.rejectedCount).toBe(0);
    expect(report.validCount).toBeGreaterThanOrEqual(50);
  });

  it('rejects records with missing required fields (id, name, category, summary)', () => {
    const invalidPlant1 = {
      id: '',
      name: 'Testowa roślina',
      category: 'Zioła',
      summary: 'Opis',
      plant_group: 'ziola',
    };
    const res1 = validatePlantRecord(invalidPlant1);
    expect(res1.isValid).toBe(false);
    expect(res1.errors).toContain('Missing or empty plant id');

    const invalidPlant2 = {
      id: 'test-plant',
      name: 'Test',
      category: '',
      summary: 'Opis',
      plant_group: 'ziola',
    };
    const res2 = validatePlantRecord(invalidPlant2);
    expect(res2.isValid).toBe(false);
    expect(res2.errors).toContain('Missing or empty plant category');
  });

  it('rejects records with mismatched image and plant metadata (e.g. tomato photo assigned to non-tomato plant)', () => {
    // A non-tomato plant using tomato photo URL
    const mismatchedPlant: Partial<Plant> = {
      id: 'ogorek-balkonowy-falszywy',
      name: 'Ogórek balkonowy sałatkowy',
      category: 'Dyniowate',
      plant_group: 'warzywa',
      summary: 'Soczysty ogórek na balkon.',
    };

    const tomatoVisual = {
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
      alt: 'Dojrzałe soczyste pomidorki koktajlowe',
      placeholderBg: 'from-red-900',
      emoji: '🍅',
    };

    const consistency = isImageMetadataConsistent(mismatchedPlant, tomatoVisual);
    expect(consistency.isConsistent).toBe(false);
    expect(consistency.reason).toContain('Tomato image/alt text mismatched with non-tomato plant');
  });

  it('accepts records where image and plant metadata are correctly paired', () => {
    const tomatoPlant: Partial<Plant> = {
      id: 'pomidor-karlowy',
      name: 'Pomidor karłowy koktajlowy',
      category: 'Psiankowate',
      plant_group: 'warzywa',
      summary: 'Niekwestionowany król balkonu.',
    };

    const tomatoVisual = {
      imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
      alt: 'Dojrzałe soczyste pomidorki koktajlowe w donicy na balkonie',
      placeholderBg: 'from-red-900',
      emoji: '🍅',
    };

    const consistency = isImageMetadataConsistent(tomatoPlant, tomatoVisual);
    expect(consistency.isConsistent).toBe(true);
  });
});
