import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocationAutocomplete } from './LocationAutocomplete';
import { PolandRegionKey } from '../../../types';

describe('LocationAutocomplete - Step 1 Suggestions', () => {
  const dummyFilteredRegions: PolandRegionKey[] = ['pomorskie', 'mazowieckie', 'malopolskie'];

  it('renders suggestion item with exact requested Tailwind classes', () => {
    render(
      <LocationAutocomplete
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={dummyFilteredRegions}
        selectedRegion={null}
        onSelectRegion={vi.fn()}
      />
    );

    const pomorskieItem = screen.getByTestId('location-option-pomorskie');
    expect(pomorskieItem).toBeInTheDocument();

    // Verify requested class tokens
    const requiredClasses = [
      'p-3',
      'rounded-xl',
      'border',
      'border-border',
      'bg-card',
      'hover:bg-emerald-50',
      'hover:border-emerald-400',
      'focus-visible:ring-2',
      'focus-visible:ring-emerald-500',
      'focus-visible:outline-none',
      'transition-colors',
      'cursor-pointer',
      'flex',
      'items-center',
      'justify-between',
      'group',
    ];

    for (const cls of requiredClasses) {
      expect(pomorskieItem.className).toContain(cls);
    }
  });

  it('keeps exact Polish text intact for Pomorskie', () => {
    render(
      <LocationAutocomplete
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={dummyFilteredRegions}
        selectedRegion={null}
        onSelectRegion={vi.fn()}
      />
    );

    const pomorskieItem = screen.getByTestId('location-option-pomorskie');
    expect(pomorskieItem).toHaveTextContent('Pomorskie (np. Gdańsk, Gdynia, Słupsk)');
  });

  it('navigates suggestions using ArrowDown, ArrowUp, and selects with Enter', () => {
    const handleSelect = vi.fn();
    render(
      <LocationAutocomplete
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={dummyFilteredRegions}
        selectedRegion={null}
        onSelectRegion={handleSelect}
      />
    );

    const input = screen.getByTestId('location-search');
    const pomorskieItem = screen.getByTestId('location-option-pomorskie');
    const mazowieckieItem = screen.getByTestId('location-option-mazowieckie');

    // Press ArrowDown from search input to focus first suggestion
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(pomorskieItem);

    // Press ArrowDown on first item to move to second suggestion
    fireEvent.keyDown(pomorskieItem, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(mazowieckieItem);

    // Press ArrowUp on second item to move back to first suggestion
    fireEvent.keyDown(mazowieckieItem, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(pomorskieItem);

    // Press Enter to select Pomorskie
    fireEvent.keyDown(pomorskieItem, { key: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('pomorskie');
  });

  it('selects single matched region when pressing Enter in search input', () => {
    const handleSelect = vi.fn();
    render(
      <LocationAutocomplete
        regionSearch="Gdańsk"
        onRegionSearchChange={vi.fn()}
        filteredRegions={['pomorskie']}
        selectedRegion={null}
        onSelectRegion={handleSelect}
      />
    );

    const input = screen.getByTestId('location-search');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSelect).toHaveBeenCalledWith('pomorskie');
  });

  it('selects region when clicking a suggestion item', () => {
    const handleSelect = vi.fn();
    render(
      <LocationAutocomplete
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={dummyFilteredRegions}
        selectedRegion={null}
        onSelectRegion={handleSelect}
      />
    );

    const pomorskieItem = screen.getByTestId('location-option-pomorskie');
    fireEvent.click(pomorskieItem);

    expect(handleSelect).toHaveBeenCalledWith('pomorskie');
  });
});
