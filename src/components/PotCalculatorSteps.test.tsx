import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PotCalculator } from './PotCalculator';
import { LanguageProvider } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';

const defaultPlants = defaultPlantsData as unknown as Plant[];

describe('PotCalculator - 4 Clear Steps, Accessible Accordions & Sticky Footer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderCalculator = (customPlant?: Plant, onSave = vi.fn().mockResolvedValue(undefined)) => {
    return render(
      <LanguageProvider>
        <PotCalculator
          plants={defaultPlants}
          initialPlant={customPlant || defaultPlants[0]}
          onSaveCalculation={onSave}
        />
      </LanguageProvider>
    );
  };

  // 1. Split calculator into clear steps: configuration, dimensions, material, summary
  it('splits the calculator into 4 distinct steps: configuration, dimensions, material, summary', () => {
    renderCalculator();

    // Stepper has 4 steps with Polish headings
    expect(screen.getByText('Krok 1: Konfiguracja')).toBeInTheDocument();
    expect(screen.getByText('Krok 2: Wymiary')).toBeInTheDocument();
    expect(screen.getByText('Krok 3: Materiał')).toBeInTheDocument();
    expect(screen.getByText('Krok 4: Podsumowanie')).toBeInTheDocument();
  });

  // 2. Show only controls required for the current step
  it('shows only controls required for step 1 (configuration), hiding dimensions and material', () => {
    renderCalculator();

    // Step 1 controls visible:
    expect(screen.getByTestId('pot-calc-plant-select')).toBeInTheDocument();
    expect(screen.getByTestId('pot-calc-support-select')).toBeInTheDocument();
    expect(screen.getByText('Z nasion')).toBeInTheDocument();
    expect(screen.getByText('Rozsada')).toBeInTheDocument();

    // Step 2 and 3 controls MUST NOT be present in Step 1:
    expect(screen.queryByTestId('pot-slider-length')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pot-slider-width')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pot-slider-rect-height')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pot-calc-material-select')).not.toBeInTheDocument();
  });

  it('shows only dimensions controls on step 2, hiding plant selection and material selection', () => {
    renderCalculator();

    // Navigate to Step 2 using next button in sticky footer
    const nextBtn = screen.getByText('Dalej: Wymiary');
    fireEvent.click(nextBtn);

    // Header updates to Step 2
    expect(screen.getByText('Krok 2: Kształt i wymiary donicy')).toBeInTheDocument();

    // Step 2 controls visible:
    expect(screen.getByTestId('pot-slider-length')).toBeInTheDocument();
    expect(screen.getByTestId('pot-slider-width')).toBeInTheDocument();
    expect(screen.getByTestId('pot-slider-rect-height')).toBeInTheDocument();
    expect(screen.getByText('Szybkie typowe wymiary donic:')).toBeInTheDocument();

    // Plant select and material select MUST NOT be present in Step 2:
    expect(screen.queryByTestId('pot-calc-plant-select')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pot-calc-material-select')).not.toBeInTheDocument();
  });

  it('shows only material controls on step 3, hiding dimension sliders and plant selection', () => {
    renderCalculator();

    // Navigate to Step 3 directly via step indicator
    const step3Btn = screen.getByText('Krok 3: Materiał');
    fireEvent.click(step3Btn);

    // Header updates to Step 3
    expect(screen.getByText('Krok 3: Materiał donicy i ocena agronomiczna')).toBeInTheDocument();

    // Step 3 controls visible:
    expect(screen.getByTestId('pot-calc-material-select')).toBeInTheDocument();
    expect(screen.getByText('Ocena materiału:')).toBeInTheDocument();

    // Dimension sliders and plant select MUST NOT be present in Step 3:
    expect(screen.queryByTestId('pot-slider-length')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pot-calc-plant-select')).not.toBeInTheDocument();
  });

  // 3. Accessible accordion for secondary sections (detailed layers, cost breakdown, technical notes)
  it('provides accessible accordions for soil layers, cost breakdown, and technical notes in step 4', () => {
    renderCalculator();

    // Go to step 4
    const step4Btn = screen.getByText('Krok 4: Podsumowanie');
    fireEvent.click(step4Btn);

    // Check accordion triggers exist with accessible ARIA attributes
    const layersTrigger = screen.getByRole('button', { name: /Przekrój podłoża/i });
    expect(layersTrigger).toHaveAttribute('aria-expanded', 'false');
    const layersControlsId = layersTrigger.getAttribute('aria-controls');
    expect(layersControlsId).toBeTruthy();

    const layersPanel = document.getElementById(layersControlsId!);
    expect(layersPanel).toBeInTheDocument();
    expect(layersPanel).toHaveAttribute('role', 'region');
    expect(layersPanel).toHaveAttribute('aria-labelledby', layersTrigger.id);
    expect(layersPanel?.className).toContain('hidden');

    // Click to open layers accordion
    fireEvent.click(layersTrigger);
    expect(layersTrigger).toHaveAttribute('aria-expanded', 'true');
    expect(layersPanel?.className).toContain('block');

    // Check Costs accordion
    const costsTrigger = screen.getByRole('button', { name: /Szacunek kosztów/i });
    expect(costsTrigger).toHaveAttribute('aria-expanded', 'false');
    const costsControlsId = costsTrigger.getAttribute('aria-controls');
    const costsPanel = document.getElementById(costsControlsId!);
    expect(costsPanel).toHaveAttribute('role', 'region');

    fireEvent.click(costsTrigger);
    expect(costsTrigger).toHaveAttribute('aria-expanded', 'true');

    // Check Technical Notes accordion
    const techTrigger = screen.getByRole('button', { name: /Inżynieryjna specyfikacja obciążenia/i });
    expect(techTrigger).toHaveAttribute('aria-expanded', 'false');
    const techControlsId = techTrigger.getAttribute('aria-controls');
    const techPanel = document.getElementById(techControlsId!);
    expect(techPanel).toHaveAttribute('role', 'region');

    fireEvent.click(techTrigger);
    expect(techTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  // 4. Primary result visible in prominent summary card with rounded-2xl, border, and shadow-sm
  it('renders primary results in a prominent summary card with rounded-2xl, border, and shadow-sm', () => {
    renderCalculator();

    // Navigate to step 4
    fireEvent.click(screen.getByText('Krok 4: Podsumowanie'));

    // Find summary card
    const summaryCardHeading = screen.getByText(/Parametry techniczne i obciążenie balkonu/i);
    const summaryCard = summaryCardHeading.closest('.rounded-2xl');
    expect(summaryCard).toBeInTheDocument();
    expect(summaryCard?.className).toContain('rounded-2xl');
    expect(summaryCard?.className).toContain('border');
    expect(summaryCard?.className).toContain('shadow-sm');

    // Check primary results are inside the summary card
    expect(screen.getByText('Objętość donicy')).toBeInTheDocument();
    expect(screen.getByText('Ilość podłoża')).toBeInTheDocument();
    expect(screen.getByText('Zakup worków')).toBeInTheDocument();
    expect(screen.getByText('Waga po podlaniu')).toBeInTheDocument();
    expect(screen.getByText('Obciążenie balkonu')).toBeInTheDocument();
  });

  // 5. Step indicator with accessible current-step announcement
  it('provides an accessible step indicator with aria-current="step" and live region announcement', () => {
    renderCalculator();

    // Nav element exists
    const nav = screen.getByRole('navigation', { name: 'Kroki kalkulatora donic' });
    expect(nav).toBeInTheDocument();

    // Live announcement for Step 1
    const liveRegion = nav.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion?.textContent).toContain('Krok 1 z 4: Krok 1: Konfiguracja');

    // Button 1 has aria-current="step"
    const step1Btn = screen.getByRole('button', { name: /Krok 1: Konfiguracja/i });
    expect(step1Btn).toHaveAttribute('aria-current', 'step');

    const step2Btn = screen.getByRole('button', { name: /Krok 2: Wymiary/i });
    expect(step2Btn).not.toHaveAttribute('aria-current');

    // Navigate to Step 2
    fireEvent.click(step2Btn);
    expect(step2Btn).toHaveAttribute('aria-current', 'step');
    expect(step1Btn).not.toHaveAttribute('aria-current');
    expect(liveRegion?.textContent).toContain('Krok 2 z 4: Krok 2: Wymiary');
  });

  // 6. Preserve exact Polish labels and headings
  it('preserves exact Polish labels and headings across all steps', () => {
    renderCalculator();

    // Step 1
    expect(screen.getByText('1. Wybierz uprawianą roślinę:')).toBeInTheDocument();
    expect(screen.getByText('Podpora w donicy:')).toBeInTheDocument();
    expect(screen.getByText('Liczba donic (szt.):')).toBeInTheDocument();
    expect(screen.getByText('Sposób startu:')).toBeInTheDocument();

    // Step 2
    fireEvent.click(screen.getByText('Krok 2: Wymiary'));
    expect(screen.getByText('2. Kształt Twojej donicy:')).toBeInTheDocument();
    expect(screen.getByText('3. Wymiary donicy (w cm):')).toBeInTheDocument();
    expect(screen.getByText('Długość skrzynki (L):')).toBeInTheDocument();
    expect(screen.getByText('Szerokość / głębokość (W):')).toBeInTheDocument();
    expect(screen.getByText('Wysokość donicy (H):')).toBeInTheDocument();

    // Step 3
    fireEvent.click(screen.getByText('Krok 3: Materiał'));
    expect(screen.getByText('4. Materiał donicy:')).toBeInTheDocument();
    expect(screen.getByText('Ocena materiału:')).toBeInTheDocument();

    // Step 4
    fireEvent.click(screen.getByText('Krok 4: Podsumowanie'));
    expect(screen.getByText(/POTWIERDZONE: DONICA SPEŁNIA WYMAGANIA|DONICA NIE SPEŁNIA WYMAGAŃ/i)).toBeInTheDocument();
  });

  // 7. Do not hide validation errors inside collapsed sections
  it('does not hide validation errors inside collapsed sections when container is too small', () => {
    renderCalculator();

    // Go to step 2 and shrink pot below minimums
    fireEvent.click(screen.getByText('Krok 2: Wymiary'));

    const lengthSlider = screen.getByTestId('pot-slider-length');
    const widthSlider = screen.getByTestId('pot-slider-width');
    const heightSlider = screen.getByTestId('pot-slider-rect-height');

    // Set to smallest dimensions (20 x 12 x 12 cm = 2.88 L)
    fireEvent.change(lengthSlider, { target: { value: '20' } });
    fireEvent.change(widthSlider, { target: { value: '12' } });
    fireEvent.change(heightSlider, { target: { value: '12' } });

    // Warning alert is immediately visible in Step 2, NOT hidden in any collapsed accordion
    const step2Alert = screen.getByRole('alert');
    expect(step2Alert).toBeInTheDocument();
    expect(step2Alert.textContent).toContain('Uwaga: Wymiary poniżej minimalnych wymagań rośliny');

    // Go to Step 4 (Summary)
    fireEvent.click(screen.getByText('Krok 4: Podsumowanie'));

    // Validation banner is visible right at the top of step 4, outside any collapsed accordion
    const step4Alert = screen.getByRole('alert');
    expect(step4Alert).toBeInTheDocument();
    expect(step4Alert.textContent).toContain('DONICA NIE SPEŁNIA WYMAGAŃ (ZA MAŁA)');
    expect(step4Alert.textContent).toContain('Wymaga korekty');
  });

  // 8. Sticky footer on mobile and desktop
  it('keeps the primary CTA in a sticky footer on mobile and desktop across all steps', async () => {
    renderCalculator();

    // Find sticky footer container
    const stickyFooter = document.querySelector('.sticky.bottom-0');
    expect(stickyFooter).toBeInTheDocument();

    // In step 1, CTA is "Dalej: Wymiary"
    expect(screen.getByText('Dalej: Wymiary')).toBeInTheDocument();

    // Go to step 2
    fireEvent.click(screen.getByText('Dalej: Wymiary'));
    expect(screen.getByText('Dalej: Materiał')).toBeInTheDocument();
    expect(screen.getByText('Wstecz')).toBeInTheDocument();

    // Go to step 3
    fireEvent.click(screen.getByText('Dalej: Materiał'));
    const submitBtn = screen.getByTestId('pot-calculator-submit');
    expect(submitBtn).toBeInTheDocument();
    expect(screen.getByText('Oblicz')).toBeInTheDocument();

    // Submit to step 4
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText('Krok 4: Wynik, makieta i weryfikacja wymogów')).toBeInTheDocument();
    });
  });
});
