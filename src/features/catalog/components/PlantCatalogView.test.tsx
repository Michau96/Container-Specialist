import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantCatalogView, CropsSearch } from './PlantCatalogView';
import defaultPlantsData from '../../../data/plants.json';
import { validatePlantCatalog } from '../../../lib/catalogValidation';
import { Plant, UserBalconySpec } from '../../../types';

const { validPlants } = validatePlantCatalog(defaultPlantsData);

const sampleBalconySpec: Partial<UserBalconySpec> = {
  orientation: 'S',
  floor: 2,
  region: 'mazowieckie',
  balcony_type: 'open_rail',
  roofing: 'uncovered',
  care_time: 'daily',
  pots: ['boxes_balcony_15cm'],
};

describe('PlantCatalogView & CropsSearch component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders sticky sub-header container with exact required Tailwind classes', () => {
    const { container } = render(
      <PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />
    );

    const stickyHeader = container.querySelector('.sticky');
    expect(stickyHeader).toBeInTheDocument();
    expect(stickyHeader?.className).toContain('sticky');
    expect(stickyHeader?.className).toContain('top-[64px]');
    expect(stickyHeader?.className).toContain('z-30');
    expect(stickyHeader?.className).toContain('w-full');
    expect(stickyHeader?.className).toContain('bg-background/90');
    expect(stickyHeader?.className).toContain('backdrop-blur-md');
    expect(stickyHeader?.className).toContain('border-b');
    expect(stickyHeader?.className).toContain('border-border/60');
    expect(stickyHeader?.className).toContain('py-3');
    expect(stickyHeader?.className).toContain('px-4');
    expect(stickyHeader?.className).toContain('transition-all');
    expect(stickyHeader?.className).toContain('shadow-xs');

    const innerWrapper = stickyHeader?.firstElementChild;
    expect(innerWrapper?.className).toContain('max-w-7xl');
    expect(innerWrapper?.className).toContain('mx-auto');
    expect(innerWrapper?.className).toContain('flex');
    expect(innerWrapper?.className).toContain('flex-col');
    expect(innerWrapper?.className).toContain('sm:flex-row');
    expect(innerWrapper?.className).toContain('items-center');
    expect(innerWrapper?.className).toContain('gap-3');
  });

  it('renders search input with exact placeholder "Szukaj roślin (np. Pomidor, Bazylia, Rzodkiewka)..."', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const searchInput = screen.getByPlaceholderText(
      'Szukaj roślin (np. Pomidor, Bazylia, Rzodkiewka)...'
    );
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('aria-label', 'Wyszukaj rośliny w katalogu');
  });

  it('renders clear button with X icon when query.length > 0 and clears input upon click', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const searchInput = screen.getByPlaceholderText(
      'Szukaj roślin (np. Pomidor, Bazylia, Rzodkiewka)...'
    );
    expect(screen.queryByTestId('clear-search-button')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Bazylia' } });

    const clearButton = screen.getByTestId('clear-search-button');
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute('aria-label', 'Wyczyść wyszukiwanie');

    // Icon check
    expect(clearButton.querySelector('svg')).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(searchInput).toHaveValue('');
    expect(screen.queryByTestId('clear-search-button')).not.toBeInTheDocument();
  });

  it('applies lightweight debounce (150ms) to filter results instantly without pressing Enter', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const searchInput = screen.getByPlaceholderText(
      'Szukaj roślin (np. Pomidor, Bazylia, Rzodkiewka)...'
    );

    // Initial count with all plants
    const initialCards = screen.getAllByTestId(/catalog-plant-/);
    expect(initialCards.length).toBeGreaterThan(1);

    // Type "Pomidor"
    fireEvent.change(searchInput, { target: { value: 'Pomidor' } });

    // Before debounce timer expires, previous items still visible
    expect(screen.getAllByTestId(/catalog-plant-/).length).toBe(initialCards.length);

    // Fast-forward debounce (150ms)
    act(() => {
      vi.advanceTimersByTime(150);
    });

    const tomatoCards = screen.getAllByTestId(/catalog-plant-/);
    expect(tomatoCards.length).toBeGreaterThan(0);
    expect(tomatoCards.some((card) => card.textContent?.includes('Pomidor'))).toBe(true);
  });

  it('renders and supports quick-filter pills ("Wysiej teraz", "Sadź teraz", "100% dopasowania")', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const sowPill = screen.getByTestId('quick-filter-sow_now');
    const transplantPill = screen.getByTestId('quick-filter-transplant_now');
    const perfectMatchPill = screen.getByTestId('quick-filter-perfect_match');

    expect(sowPill).toHaveTextContent('Wysiej teraz');
    expect(transplantPill).toHaveTextContent('Sadź teraz');
    expect(perfectMatchPill).toHaveTextContent('100% dopasowania');

    // Click 100% dopasowania
    fireEvent.click(perfectMatchPill);
    expect(perfectMatchPill).toHaveAttribute('aria-pressed', 'true');

    // Click again to deactivate
    fireEvent.click(perfectMatchPill);
    expect(perfectMatchPill).toHaveAttribute('aria-pressed', 'false');
  });

  it('works interchangeably with CropsSearch alias', () => {
    render(<CropsSearch plants={validPlants} balconySpec={sampleBalconySpec} />);

    expect(
      screen.getByPlaceholderText('Szukaj roślin (np. Pomidor, Bazylia, Rzodkiewka)...')
    ).toBeInTheDocument();
    expect(screen.getByTestId('quick-filter-sow_now')).toBeInTheDocument();
  });
});
