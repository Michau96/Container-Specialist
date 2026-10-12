import { describe, it, expect } from 'vitest';
import {
  validatePlantRecord,
  validatePlantCatalog,
  isImageMetadataConsistent,
} from './catalogValidation';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';
import { getPeriodHumanLabel, formatPeriodNamePl } from './cropTiming';

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

  it('rejects sunflower microgreens paired with watermelon image', () => {
    const sunflowerPlant: Partial<Plant> = {
      id: 'slonecznik-mikrolistki',
      name: 'Młode siewki słonecznika',
      category: 'Kiełki i mikroliście',
      plant_group: 'kielki',
      summary: 'Chrupiące siewki.',
    };

    const watermelonVisual = {
      imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=800&q=80',
      alt: 'Arbuz o soczystym miąższu',
      placeholderBg: 'from-emerald-950',
      emoji: '🍉',
    };

    const check = isImageMetadataConsistent(sunflowerPlant, watermelonVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason?.toLowerCase()).toContain('watermelon');
  });

  it('rejects radish sprouts paired with pills/pharmaceutical imagery', () => {
    const radishSprouts: Partial<Plant> = {
      id: 'rzodkiewka-kielki',
      name: 'Kiełki i siewki rzodkiewki',
      category: 'Kiełki i mikroliście',
      plant_group: 'kielki',
      summary: 'Pikantne kiełki.',
    };

    const pillsVisual = {
      imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
      alt: 'Tabletki i kapsułki',
      placeholderBg: 'from-pink-950',
      emoji: '🌱',
    };

    const check = isImageMetadataConsistent(radishSprouts, pillsVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason).toContain('pharmaceutical/pills image');
  });

  it('rejects pieczarka paired with a dinner meal table image', () => {
    const champignonPlant: Partial<Plant> = {
      id: 'pieczarka-dwuzarodnikowa',
      name: 'Pieczarka dwuzarodnikowa',
      category: 'Grzyby uprawne',
      plant_group: 'grzyby',
      summary: 'Domowa uprawa pieczarek.',
    };

    const dinnerVisual = {
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
      alt: 'Obiad i dania na stole',
      placeholderBg: 'from-stone-900',
      emoji: '🍄',
    };

    const check = isImageMetadataConsistent(champignonPlant, dinnerVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason).toContain('dinner meal image');
  });

  it('confirms genuine visual records for sunflower, radish sprouts, and pieczarka are botanical and valid', () => {
    const report = validatePlantCatalog(defaultPlantsData);
    expect(report.rejectedCount).toBe(0);

    const sunflower = defaultPlantsData.find((p) => p.id === 'slonecznik-mikrolistki');
    expect(sunflower).toBeDefined();

    const radishSprouts = defaultPlantsData.find((p) => p.id === 'rzodkiewka-kielki');
    expect(radishSprouts).toBeDefined();

    const pieczarka = defaultPlantsData.find((p) => p.id === 'pieczarka-dwuzarodnikowa');
    expect(pieczarka).toBeDefined();
  });

  it('verifies boczniak, shiitake, szczypiorek, cukinia, oregano, pietruszka, lawenda, mieta, begonia, pak choi, trawa cytrynowa, groszek, kumkwat, figowiec, and bazylia have accurately matched botanical images', () => {
    const checkedIds = [
      'boczniak-ostrygowaty',
      'shiitake-twardnik',
      'szczypiorek-ziola',
      'cukinia-balkonowa',
      'oregano-lebiodka',
      'pietruszka-naciowa',
      'lawenda-donica',
      'mieta-donica',
      'begonia-stale-kwitnaca',
      'pak-choi',
      'trawa-cytrynowa',
      'groszek-cukrowy',
      'kumkwat-cytrus',
      'figowiec',
      'bazylia-wlasciwa',
      'fuksja-zwisajaca',
    ];

    checkedIds.forEach((id) => {
      const plant = defaultPlantsData.find((p) => p.id === id);
      expect(plant, `Plant ${id} must exist in catalog`).toBeDefined();
      if (!plant) return;

      const report = validatePlantRecord(plant);
      expect(report.isValid, `Plant ${id} validation failed: ${report.errors.join(', ')}`).toBe(true);
    });
  });

  it('rejects szczypiorek when assigned flower-only specimen image without green culinary leaves', () => {
    const chivesPlant: Partial<Plant> = {
      id: 'szczypiorek-ziola',
      name: 'Szczypiorek ogrodowy',
      category: 'Czosnkowate',
      plant_group: 'ziola',
      summary: 'Szczypiorek do kanapek.',
    };

    const flowerOnlyVisual = {
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Allium_schoenoprasum_J1.JPG?width=800',
      alt: 'Szczypiorek ogrodowy',
      placeholderBg: 'from-teal-950',
      emoji: '🧅',
    };

    const check = isImageMetadataConsistent(chivesPlant, flowerOnlyVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason).toContain('flower-only image');
  });

  it('rejects figowiec when assigned ornamental indoor ficus', () => {
    const figPlant: Partial<Plant> = {
      id: 'figowiec',
      name: 'Figowiec pospolity',
      category: 'Morwowate',
      plant_group: 'owoce',
      summary: 'Figa jadalna.',
    };

    const indoorFicusVisual = {
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/ficus_elastica_variegata.jpg?width=800',
      alt: 'Figowiec sprężysty w salonie',
      placeholderBg: 'from-emerald-950',
      emoji: '🪴',
    };

    const check = isImageMetadataConsistent(figPlant, indoorFicusVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason).toContain('ornamental indoor ficus');
  });

  it('rejects trawa cytrynowa when assigned generic lawn grass imagery', () => {
    const lemongrassPlant: Partial<Plant> = {
      id: 'trawa-cytrynowa',
      name: 'Trawa cytrynowa',
      category: 'Zioła i przyprawy',
      plant_group: 'ziola',
      summary: 'Aromatyczna trawa.',
    };

    const genericLawnVisual = {
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gardenology.org-IMG_2892_rbgs11jan.jpg?width=800',
      alt: 'Zwykła trawa polna',
      placeholderBg: 'from-lime-950',
      emoji: '🌾',
    };

    const check = isImageMetadataConsistent(lemongrassPlant, genericLawnVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason).toContain('generic lawn grass image');
  });

  it('rejects fuksja ułanka when assigned generic unverified stock image', () => {
    const fuchsiaPlant: Partial<Plant> = {
      id: 'fuksja-zwisajaca',
      name: 'Fuksja ułanka zwisająca',
      category: 'Wiesiołkowate',
      plant_group: 'ozdobne',
      summary: 'Wisząca baletnica cienia.',
    };

    const genericVisual = {
      imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
      alt: 'Egzotyczne dzwonkowate kwiaty fuksji',
      placeholderBg: 'from-fuchsia-950',
      emoji: '🌺',
    };

    const check = isImageMetadataConsistent(fuchsiaPlant, genericVisual);
    expect(check.isConsistent).toBe(false);
    expect(check.reason).toContain('generic unverified stock');

    const verifiedVisual = {
      imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Fuksja%2C_u%C5%82anka_06.jpg?width=800',
      alt: 'Kwitnąca fuksja ułanka zwisająca (Fuchsia) w wiszącej donicy',
      placeholderBg: 'from-fuchsia-950',
      emoji: '🌺',
    };
    const validCheck = isImageMetadataConsistent(fuchsiaPlant, verifiedVisual);
    expect(validCheck.isConsistent).toBe(true);
  });

  it('formats calendar period month names in lowercase in Polish according to orthography', () => {
    expect(getPeriodHumanLabel('09_2', false)).toBe('II połowa września');
    expect(getPeriodHumanLabel('09_1', false)).toBe('I połowa września');
    expect(formatPeriodNamePl('II połowa Września')).toBe('II połowa września');
    expect(formatPeriodNamePl('I połowa Maja (Przed Zimną Zośką)')).toBe('I połowa maja (przed Zimną Zośką)');
    expect(formatPeriodNamePl('II połowa Maja (Po Zimnej Zośce)')).toBe('II połowa maja (po Zimnej Zośce)');
  });
});
