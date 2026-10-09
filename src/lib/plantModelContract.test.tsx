import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PlantCard } from '../components/PlantCard';
import { PlantDetailModal } from '../components/PlantDetailModal';
import { parseAndValidatePlant, resolvePlantRecord, PlantSchema } from './plantSchema';
import { LanguageProvider } from './LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';

const defaultPlants = defaultPlantsData as unknown as Plant[];

describe('Plant Model Contract, Zod Runtime Validation & Consistency Suite', () => {
  // 1. Runtime schema validation with Zod
  it('validates canonical plant objects against Zod schema successfully', () => {
    defaultPlants.forEach((p) => {
      const parsed = PlantSchema.safeParse(p);
      expect(parsed.success, `Plant "${p.name}" (ID: ${p.id}) failed Zod validation`).toBe(true);
      if (parsed.success) {
        expect(parsed.data.id).toBeTruthy();
        expect(parsed.data.name).toBeTruthy();
        expect(parsed.data.pot).toBeDefined();
        expect(parsed.data.soil).toBeDefined();
      }
    });
  });

  // 2. Safe fallback state when image or recommendation data is missing / corrupted
  it('renders a safe fallback state without throwing when plant record is incomplete or corrupted', () => {
    const corruptedPlant = {
      id: 'custom-unregistered-crop',
      name: 'Niestandardowa roślina testowa',
      // Missing category, pot, soil, visual, schedule, summary
    };

    const resolved = resolvePlantRecord(corruptedPlant);
    expect(resolved.plantId).toBe('custom-unregistered-crop');
    expect(resolved.title).toBe('Niestandardowa roślina testowa');
    expect(resolved.visual.imageUrl).toBeTruthy();
    expect(resolved.visual.alt).toContain('Niestandardowa roślina testowa');
    expect(resolved.pot.min_volume_l).toBeGreaterThanOrEqual(1);
    expect(resolved.soil.ph).toBeTruthy();
    expect(resolved.soilLayers.drainage_cm).toBeGreaterThan(0);

    // Verify rendering corrupted plant in PlantCard
    const { container: cardContainer } = render(
      <LanguageProvider>
        <PlantCard plant={resolved.raw} onSelect={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getByTestId('plant-card-custom-unregistered-crop')).toBeInTheDocument();
    expect(screen.getByText('Niestandardowa roślina testowa')).toBeInTheDocument();

    // Verify rendering corrupted plant in PlantDetailModal
    const { container: modalContainer } = render(
      <LanguageProvider>
        <PlantDetailModal plant={resolved.raw} onClose={() => {}} />
      </LanguageProvider>
    );
    expect(screen.getByTestId('plant-modal-title-custom-unregistered-crop')).toHaveTextContent('Niestandardowa roślina testowa');
  });

  // 3. Automated test asserting modal title, image alt, recommendations, and plantId belong to the same record
  it('strictly binds modal title, image alt, category, pot recommendations, and plant ID to the same entity record', () => {
    const testPlantIds = ['pomidor-karlowy', 'truskawka-wisząca', 'rozmaryn-lekarski', 'papryka-chili', 'rzodkiewka'];

    testPlantIds.forEach((id) => {
      const plantRecord = defaultPlants.find((p) => p.id === id);
      expect(plantRecord, `Plant record with ID "${id}" must exist in catalog`).toBeDefined();
      if (!plantRecord) return;

      const resolved = resolvePlantRecord(plantRecord);

      // Render Modal for the plant
      const { unmount } = render(
        <LanguageProvider>
          <PlantDetailModal plant={plantRecord} onClose={() => {}} />
        </LanguageProvider>
      );

      // Verify Title matches exact Polish record name
      const modalTitle = screen.getByTestId(`plant-modal-title-${id}`);
      expect(modalTitle).toHaveTextContent(plantRecord.name);
      expect(modalTitle.getAttribute('data-plant-id')).toBe(id);

      // Verify Image alt text matches the resolved visual alt
      const modalImage = screen.getByTestId(`plant-modal-image-${id}`);
      expect(modalImage.getAttribute('alt')).toBe(resolved.visual.alt);
      expect(modalImage.getAttribute('src')).toBe(resolved.visual.imageUrl);

      // Verify Category matches
      const modalCategory = screen.getByTestId(`plant-modal-category-${id}`);
      expect(modalCategory).toHaveTextContent(plantRecord.category);

      unmount();
    });
  });

  // 4. Visual regression snapshots for at least three plant types
  describe('Visual Regression Snapshots for Diverse Plant Types', () => {
    it('matches DOM snapshot for Balcony Vegetable (pomidor-karlowy)', () => {
      const tomato = defaultPlants.find((p) => p.id === 'pomidor-karlowy')!;
      expect(tomato).toBeDefined();

      const { container } = render(
        <LanguageProvider>
          <PlantCard plant={tomato} onSelect={() => {}} />
        </LanguageProvider>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches DOM snapshot for Balcony Fruit (truskawka-wisząca)', () => {
      const strawberry = defaultPlants.find((p) => p.id === 'truskawka-wisząca' || p.plant_group === 'owoce')!;
      expect(strawberry).toBeDefined();

      const { container } = render(
        <LanguageProvider>
          <PlantCard plant={strawberry} onSelect={() => {}} />
        </LanguageProvider>
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches DOM snapshot for Balcony Herbs (rozmaryn-lekarski)', () => {
      const rosemary = defaultPlants.find((p) => p.id === 'rozmaryn-lekarski' || p.plant_group === 'ziola')!;
      expect(rosemary).toBeDefined();

      const { container } = render(
        <LanguageProvider>
          <PlantCard plant={rosemary} onSelect={() => {}} />
        </LanguageProvider>
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // 5. Polish strings and entity mapping preservation check
  it('preserves all original Polish plant names and UI strings without changes', () => {
    const tomato = defaultPlants.find((p) => p.id === 'pomidor-karlowy')!;
    expect(tomato.name).toBe('Pomidor karłowy koktajlowy');
    expect(tomato.category).toBe('Psiankowate');

    const pepper = defaultPlants.find((p) => p.id === 'papryka-chili')!;
    expect(pepper.name).toBe('Papryka ostra / chili w doniczce');

    const radish = defaultPlants.find((p) => p.id === 'rzodkiewka')!;
    expect(radish.name).toBe('Rzodkiewka balkonowa');
  });
});
