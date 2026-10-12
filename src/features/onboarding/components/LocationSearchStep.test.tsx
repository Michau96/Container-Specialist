import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LocationSearchStep } from './LocationSearchStep';
import { PolandRegionKey } from '../../../types';

describe('LocationSearchStep', () => {
  const dummyFilteredRegions: PolandRegionKey[] = ['mazowieckie', 'malopolskie'];

  it('preserves placeholder text verbatim', () => {
    render(
      <LocationSearchStep
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={dummyFilteredRegions}
        selectedRegion={null}
        handleSelectRegion={vi.fn()}
      />
    );

    const input = screen.getByTestId('location-search');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute(
      'placeholder',
      'Wpisz np. Warszawa, Kraków, Wrocław, Gdańsk, Poznań...'
    );
  });

  it('triggers handleSelectRegion on Enter when exactly 1 region matches', () => {
    const handleSelectRegion = vi.fn();
    const singleRegion: PolandRegionKey[] = ['mazowieckie'];

    render(
      <LocationSearchStep
        regionSearch="Warszawa"
        onRegionSearchChange={vi.fn()}
        filteredRegions={singleRegion}
        selectedRegion={null}
        handleSelectRegion={handleSelectRegion}
      />
    );

    const input = screen.getByTestId('location-search');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSelectRegion).toHaveBeenCalledTimes(1);
    expect(handleSelectRegion).toHaveBeenCalledWith('mazowieckie');
  });

  it('does NOT trigger handleSelectRegion on Enter when multiple regions match', () => {
    const handleSelectRegion = vi.fn();

    render(
      <LocationSearchStep
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={dummyFilteredRegions}
        selectedRegion={null}
        handleSelectRegion={handleSelectRegion}
      />
    );

    const input = screen.getByTestId('location-search');
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleSelectRegion).not.toHaveBeenCalled();
  });

  it('renders a subtle focus indicator on the card when filtered down to exactly 1 result', () => {
    const singleRegion: PolandRegionKey[] = ['pomorskie'];

    const { rerender } = render(
      <LocationSearchStep
        regionSearch=""
        onRegionSearchChange={vi.fn()}
        filteredRegions={['pomorskie', 'mazowieckie']}
        selectedRegion={null}
        handleSelectRegion={vi.fn()}
      />
    );

    let card = screen.getByTestId('location-option-pomorskie');
    expect(card.className).not.toContain('ring-emerald-500/50');

    rerender(
      <LocationSearchStep
        regionSearch="Gdańsk"
        onRegionSearchChange={vi.fn()}
        filteredRegions={singleRegion}
        selectedRegion={null}
        handleSelectRegion={vi.fn()}
      />
    );

    card = screen.getByTestId('location-option-pomorskie');
    expect(card.className).toContain('ring-emerald-500/50');
  });
});
