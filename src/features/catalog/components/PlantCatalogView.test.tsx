import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantCatalogView, CropsSearch, CatalogPage } from './PlantCatalogView';
import defaultPlantsData from '../../../data/plants.json';
import { validatePlantCatalog } from '../../../lib/catalogValidation';
import { UserBalconySpec } from '../../../types';

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

  it('renders sticky header container with exact required Tailwind classes', () => {
    const { container } = render(
      <PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />
    );

    const stickyHeader = container.querySelector('.sticky');
    expect(stickyHeader).toBeInTheDocument();
    expect(stickyHeader?.className).toContain('sticky');
    expect(stickyHeader?.className).toContain('top-0');
    expect(stickyHeader?.className).toContain('z-30');
    expect(stickyHeader?.className).toContain('bg-white/90');
    expect(stickyHeader?.className).toContain('backdrop-blur-md');
    expect(stickyHeader?.className).toContain('border-b');
    expect(stickyHeader?.className).toContain('border-emerald-100');
    expect(stickyHeader?.className).toContain('py-3');
    expect(stickyHeader?.className).toContain('px-4');
    expect(stickyHeader?.className).toContain('shadow-sm');
    expect(stickyHeader?.className).toContain('transition-all');
    expect(stickyHeader?.className).toContain('duration-200');

    const innerWrapper = stickyHeader?.firstElementChild;
    expect(innerWrapper?.className).toContain('max-w-7xl');
    expect(innerWrapper?.className).toContain('mx-auto');
    expect(innerWrapper?.className).toContain('flex');
    expect(innerWrapper?.className).toContain('flex-col');
    expect(innerWrapper?.className).toContain('md:flex-row');
    expect(innerWrapper?.className).toContain('gap-3');
    expect(innerWrapper?.className).toContain('items-center');
    expect(innerWrapper?.className).toContain('justify-between');
  });

  it('renders search input with exact placeholder "Szukaj nowych upraw"', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const searchInput = screen.getByPlaceholderText('Szukaj nowych upraw');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('aria-label', 'Wyszukaj rośliny w katalogu');
    expect(searchInput.className).toContain('min-h-[44px]');
  });

  it('renders clear button with X icon when query.length > 0 and clears input upon click', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const searchInput = screen.getByPlaceholderText('Szukaj nowych upraw');
    expect(screen.queryByTestId('clear-search-button')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'Bazylia' } });

    const clearButton = screen.getByTestId('clear-search-button');
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveAttribute('aria-label', 'Wyczyść wyszukiwanie');
    expect(clearButton.className).toContain('min-w-[44px]');
    expect(clearButton.className).toContain('min-h-[44px]');

    // Icon check
    expect(clearButton.querySelector('svg')).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(searchInput).toHaveValue('');
    expect(screen.queryByTestId('clear-search-button')).not.toBeInTheDocument();
  });

  it('applies lightweight debounce (150ms) to filter results instantly without pressing Enter', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const searchInput = screen.getByPlaceholderText('Szukaj nowych upraw');

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

  it('renders and supports active filter pills ("100% dopasowania", "Termin aktywny") with >= 44x44px touch targets', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    const perfectMatchPill = screen.getByTestId('quick-filter-perfect_match');
    const activeTimingPill = screen.getByTestId('quick-filter-active_timing');

    expect(perfectMatchPill).toHaveTextContent('100% dopasowania');
    expect(activeTimingPill).toHaveTextContent('Termin aktywny');

    expect(perfectMatchPill.className).toContain('min-h-[44px]');
    expect(activeTimingPill.className).toContain('min-h-[44px]');

    // Click 100% dopasowania
    fireEvent.click(perfectMatchPill);
    expect(perfectMatchPill).toHaveAttribute('aria-pressed', 'true');

    // Click again to deactivate
    fireEvent.click(perfectMatchPill);
    expect(perfectMatchPill).toHaveAttribute('aria-pressed', 'false');

    // Click Termin aktywny
    fireEvent.click(activeTimingPill);
    expect(activeTimingPill).toHaveAttribute('aria-pressed', 'true');
  });

  it('ensures touch targets remain at least 44x44px on mobile viewports for all interactive controls', () => {
    render(<PlantCatalogView plants={validPlants} balconySpec={sampleBalconySpec} />);

    // Search input
    const searchInput = screen.getByPlaceholderText('Szukaj nowych upraw');
    expect(searchInput.className).toContain('min-h-[44px]');

    // Quick filters
    const quickFilters = screen.getAllByRole('button', { name: /(100% dopasowania|Termin aktywny|Wysiej teraz|Sadź teraz)/ });
    quickFilters.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });

    // Category pills
    const categoryPills = screen.getAllByTestId(/category-pill-/);
    categoryPills.forEach((pill) => {
      expect(pill.className).toContain('min-h-[44px]');
    });

    // Add buttons
    const addButtons = screen.getAllByRole('button', { name: /\+ Dodaj do balkonu/i });
    expect(addButtons.length).toBeGreaterThan(0);
    addButtons.forEach((btn) => {
      expect(btn.className).toContain('min-h-[44px]');
    });
  });

  it('works interchangeably with CropsSearch and CatalogPage aliases', () => {
    render(<CropsSearch plants={validPlants} balconySpec={sampleBalconySpec} />);
    expect(screen.getByPlaceholderText('Szukaj nowych upraw')).toBeInTheDocument();
    expect(screen.getByTestId('quick-filter-perfect_match')).toBeInTheDocument();

    render(<CatalogPage plants={validPlants} balconySpec={sampleBalconySpec} />);
    expect(screen.getAllByPlaceholderText('Szukaj nowych upraw').length).toBe(2);
  });
});
