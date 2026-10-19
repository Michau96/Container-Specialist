import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnboardingLocationStep, voivodeships } from './OnboardingLocationStep';

describe('OnboardingLocationStep - Real-Time City Mapping, Empty State & Selection', () => {
  it('contains full list of Polish voivodeships with their major cities', () => {
    expect(voivodeships.length).toBe(16);

    const pomorskie = voivodeships.find((v) => v.id === 'pomorskie');
    expect(pomorskie).toBeDefined();
    expect(pomorskie?.cities).toEqual(
      expect.arrayContaining(['Gdańsk', 'Gdynia', 'Sopot', 'Słupsk'])
    );
    expect(pomorskie?.displayLabel).toBe('Pomorskie (np. Gdańsk, Gdynia, Słupsk)');

    const mazowieckie = voivodeships.find((v) => v.id === 'mazowieckie');
    expect(mazowieckie).toBeDefined();
    expect(mazowieckie?.cities).toEqual(
      expect.arrayContaining(['Warszawa', 'Radom', 'Płock', 'Siedlce'])
    );
  });

  it('filters voivodeships in real time by city name (e.g. "Gdańsk" -> Pomorskie, "Radom" -> Mazowieckie)', () => {
    const { rerender } = render(<OnboardingLocationStep />);

    const searchInput = screen.getByTestId('location-search');

    // Type "Gdańsk"
    fireEvent.change(searchInput, { target: { value: 'Gdańsk' } });

    expect(screen.getByTestId('location-option-pomorskie')).toBeInTheDocument();
    expect(screen.queryByTestId('location-option-mazowieckie')).not.toBeInTheDocument();
    expect(screen.queryByTestId('location-option-malopolskie')).not.toBeInTheDocument();

    // Type "Sopot"
    fireEvent.change(searchInput, { target: { value: 'Sopot' } });
    expect(screen.getByTestId('location-option-pomorskie')).toBeInTheDocument();

    // Type "Radom"
    fireEvent.change(searchInput, { target: { value: 'Radom' } });
    expect(screen.getByTestId('location-option-mazowieckie')).toBeInTheDocument();
    expect(screen.queryByTestId('location-option-pomorskie')).not.toBeInTheDocument();

    // Type "Kraków"
    fireEvent.change(searchInput, { target: { value: 'Kraków' } });
    expect(screen.getByTestId('location-option-malopolskie')).toBeInTheDocument();
  });

  it('displays empty state when no city or voivodeship matches: "Nie znaleziono lokalizacji. Wybierz województwo ręcznie z listy."', () => {
    render(<OnboardingLocationStep />);

    const searchInput = screen.getByTestId('location-search');
    fireEvent.change(searchInput, { target: { value: 'Nowy Jork 12345' } });

    const emptyState = screen.getByTestId('location-empty-state');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveTextContent(
      'Nie znaleziono lokalizacji. Wybierz województwo ręcznie z listy.'
    );
  });

  it('immediately sets selected state with green border, checkmark and unlocks "Dalej >" navigation button', () => {
    const handleNext = vi.fn();
    const handleSelect = vi.fn();

    render(
      <OnboardingLocationStep
        onNext={handleNext}
        onSelectVoivodeship={handleSelect}
      />
    );

    const nextBtn = screen.getByTestId('onboarding-next-btn');
    expect(nextBtn).toBeInTheDocument();
    expect(nextBtn).toHaveTextContent('Dalej >');
    // Initially disabled before selecting any tile
    expect(nextBtn).toBeDisabled();

    // Locate Pomorskie tile
    const pomorskieTile = screen.getByTestId('location-option-pomorskie');
    expect(pomorskieTile).toHaveTextContent('Pomorskie (np. Gdańsk, Gdynia, Słupsk)');

    // Select Pomorskie
    fireEvent.click(pomorskieTile);

    // Verified callback
    expect(handleSelect).toHaveBeenCalledWith('pomorskie');

    // Selected state classes
    expect(pomorskieTile.className).toContain('border-emerald-500');
    expect(pomorskieTile.className).toContain('bg-emerald-50/50');

    // Checkmark rendered
    expect(pomorskieTile).toHaveTextContent('Wybrano');

    // "Dalej >" button is now unlocked
    expect(nextBtn).not.toBeDisabled();

    // Clicking "Dalej >" triggers onNext
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);
  });
});
