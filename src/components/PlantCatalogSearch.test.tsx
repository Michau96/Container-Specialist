import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantCard } from './PlantCard';
import { PlantSearchIndex } from '../lib/plantSearchIndex';
import defaultPlantsData from '../data/plants.json';
import { validatePlantCatalog } from '../lib/catalogValidation';
import { Plant } from '../types';
import { LanguageProvider } from '../lib/LanguageContext';

const { validPlants } = validatePlantCatalog(defaultPlantsData);
const searchIndex = new PlantSearchIndex(validPlants);

describe('Catalog Data Consistency and Tomato Search Scenario', () => {
  // 1. Search index contains exact record matching query "Pomidor"
  it('verifies that the search index contains a plant record matching the exact query "Pomidor"', () => {
    expect(searchIndex.hasExactMatch('Pomidor')).toBe(true);
    const exactRecord = searchIndex.getExactMatch('Pomidor');
    expect(exactRecord).toBeDefined();
    expect(exactRecord?.id).toBe('pomidor-karlowy');
    expect(exactRecord?.name).toContain('Pomidor');
  });

  // 2. Searching "Pomidor" returns the tomato plant card as top result
  it('searches "Pomidor" and returns tomato plant matching entity', () => {
    const results = searchIndex.search('Pomidor');
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.id).toBe('pomidor-karlowy');
    expect(topResult.name).toContain('Pomidor');
    expect(topResult.category).toBe('Psiankowate');
  });

  // 3. Case-insensitive search returns tomato plant
  it('performs case-insensitive search ("pomidor", "POMIDOR", "Pomidor", "PoMiDoR")', () => {
    const queries = ['pomidor', 'POMIDOR', 'Pomidor', 'PoMiDoR'];
    for (const q of queries) {
      const results = searchIndex.search(q);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('pomidor-karlowy');
      expect(results[0].name).toContain('Pomidor');
    }
  });

  // 4. Partial query search
  it('supports partial query search ("pomi", "pomido", "karłow")', () => {
    const partial1 = searchIndex.search('pomi');
    expect(partial1.some((p) => p.id === 'pomidor-karlowy')).toBe(true);

    const partial2 = searchIndex.search('pomido');
    expect(partial2.some((p) => p.id === 'pomidor-karlowy')).toBe(true);

    const partial3 = searchIndex.search('karłow');
    expect(partial3.some((p) => p.id === 'pomidor-karlowy')).toBe(true);
  });

  // 5. No-result state returns empty list and never injects unrelated fallbacks
  it('returns an empty list for unmatched query and does not show unrelated fallback cards', () => {
    const results = searchIndex.search('NieistniejacaRoslina12345XYZ');
    expect(results).toEqual([]);
    expect(results.length).toBe(0);
  });

  // 6. Each card maps the same entity to title, description, category, image, and add action
  it('ensures plant card maps the same entity to title, description, category, image, and stable identifiers', () => {
    const tomatoPlant = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    expect(tomatoPlant).toBeDefined();

    const onSelectMock = vi.fn();
    const onRequestAddMock = vi.fn();

    render(
      <LanguageProvider>
        <PlantCard
          plant={tomatoPlant}
          onSelect={onSelectMock}
          onRequestAddVariety={onRequestAddMock}
        />
      </LanguageProvider>
    );

    // Stable plant identifiers
    const card = screen.getByTestId(`plant-card-${tomatoPlant.id}`);
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-plant-id', tomatoPlant.id);

    // Title mapping (preserves Polish string "Pomidor")
    const titleEl = screen.getByTestId(`plant-title-${tomatoPlant.id}`);
    expect(titleEl).toHaveTextContent('Pomidor');
    expect(titleEl).toHaveTextContent(tomatoPlant.name);

    // Category mapping
    const categoryEl = screen.getByTestId(`plant-category-${tomatoPlant.id}`);
    expect(categoryEl).toHaveTextContent(tomatoPlant.category);

    // Description mapping
    const descEl = screen.getByTestId(`plant-description-${tomatoPlant.id}`);
    expect(descEl).toHaveTextContent(tomatoPlant.summary);

    // Image mapping
    const imgEl = screen.getByTestId(`plant-image-${tomatoPlant.id}`);
    expect(imgEl).toHaveAttribute('src', expect.stringContaining('1592841200221-a6898f307baa'));
    expect(imgEl).toHaveAttribute('alt', expect.stringContaining('pomidorki'));

    // Add action button mapping
    const addBtn = screen.getByTestId(`plant-add-btn-${tomatoPlant.id}`);
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveAttribute('data-plant-id', tomatoPlant.id);
  });

  // 7. Adding the correct plant rather than the visually adjacent card
  it('adds the correct plant rather than the visually adjacent card in a multi-card grid', () => {
    const tomatoPlant = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    const chiliPlant = validPlants.find((p) => p.id === 'papryka-chili')!;
    expect(tomatoPlant).toBeDefined();
    expect(chiliPlant).toBeDefined();

    const onSelectMock = vi.fn();
    const onAddMock = vi.fn();

    render(
      <LanguageProvider>
        <div data-testid="test-grid">
          <PlantCard
            plant={tomatoPlant}
            onSelect={onSelectMock}
            onRequestAddVariety={onAddMock}
          />
          <PlantCard
            plant={chiliPlant}
            onSelect={onSelectMock}
            onRequestAddVariety={onAddMock}
          />
        </div>
      </LanguageProvider>
    );

    // Two cards exist side by side
    const tomatoCard = screen.getByTestId('plant-card-pomidor-karlowy');
    const chiliCard = screen.getByTestId('plant-card-papryka-chili');
    expect(tomatoCard).toBeInTheDocument();
    expect(chiliCard).toBeInTheDocument();

    // Click Add specifically on the tomato card
    const tomatoAddBtn = screen.getByTestId('plant-add-btn-pomidor-karlowy');
    fireEvent.click(tomatoAddBtn);

    // Assert that onAdd was invoked specifically with tomatoPlant, not chiliPlant
    expect(onAddMock).toHaveBeenCalledTimes(1);
    expect(onAddMock).toHaveBeenCalledWith(tomatoPlant);
    expect(onAddMock).not.toHaveBeenCalledWith(chiliPlant);
  });

  // 8. Correct image and title pairing check across multiple plants
  it('pairs distinct images and titles correctly without cross-plant contamination', () => {
    const tomato = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    const radish = validPlants.find((p) => p.id === 'rzodkiewka')!;
    const chili = validPlants.find((p) => p.id === 'papryka-chili')!;

    const { unmount } = render(
      <LanguageProvider>
        <PlantCard plant={radish} onSelect={vi.fn()} onToggleMyCrop={vi.fn()} />
      </LanguageProvider>
    );

    // Radish image must not be tomato image
    const radishImg = screen.getByTestId(`plant-image-${radish.id}`);
    expect(radishImg.getAttribute('src')).not.toContain('1592841200221-a6898f307baa');
    expect(screen.getByTestId(`plant-title-${radish.id}`)).toHaveTextContent('Rzodkiewka');
    unmount();

    render(
      <LanguageProvider>
        <PlantCard plant={chili} onSelect={vi.fn()} onToggleMyCrop={vi.fn()} />
      </LanguageProvider>
    );

    const chiliImg = screen.getByTestId(`plant-image-${chili.id}`);
    expect(chiliImg.getAttribute('src')).toContain('1588252303782-cb80119abd6d');
    expect(screen.getByTestId(`plant-title-${chili.id}`)).toHaveTextContent('Papryka');
  });

  // 9. Polish string "Pomidor" is kept exactly as written and not translated away
  it('preserves the Polish string "Pomidor" exactly as written', () => {
    const tomato = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    expect(tomato.name).toContain('Pomidor');
    expect(tomato.common_name).toBe('Pomidor');

    render(
      <LanguageProvider>
        <PlantCard plant={tomato} onSelect={vi.fn()} onToggleMyCrop={vi.fn()} />
      </LanguageProvider>
    );

    const titleEl = screen.getByTestId('plant-title-pomidor-karlowy');
    expect(titleEl.textContent).toContain('Pomidor');
  });
});
