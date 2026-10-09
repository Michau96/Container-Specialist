import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BalconySetupModal } from './BalconySetupModal';
import { PlantCard } from './PlantCard';
import { PlantDetailModal } from './PlantDetailModal';
import { PotConfigStep } from './PotConfigStep';
import { LanguageProvider } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';

const defaultPlants = defaultPlantsData as unknown as Plant[];
const samplePlant: Plant = defaultPlants[0];

describe('CI Stable Selectors Suite: Primary CTA & Form Control Contracts', () => {
  // 1. Onboarding Next Button Stable Selector
  it('verifies onboarding primary CTA has stable selector data-testid="onboarding-next-button"', () => {
    render(
      <LanguageProvider>
        <BalconySetupModal
          isOpen={true}
          onClose={() => {}}
          onSave={() => {}}
          initialSpec={{
            region: 'mazowieckie',
            floor: 1,
            orientation: 'S',
            balcony_type: 'open_rail',
            roofing: 'uncovered',
            pots: ['boxes_balcony_15cm'],
            care_time: 'daily',
          }}
        />
      </LanguageProvider>
    );

    const nextButton = screen.getByTestId('onboarding-next-button');
    expect(nextButton).toBeInTheDocument();
    expect(nextButton.tagName.toLowerCase()).toBe('button');
    expect(nextButton.getAttribute('type')).toBe('button');
  });

  // 2. Plant Card has domain plantId (not array index)
  it('verifies PlantCard container has stable domain selector data-testid="plant-card-${plantId}"', () => {
    render(
      <LanguageProvider>
        <PlantCard plant={samplePlant} onSelect={() => {}} />
      </LanguageProvider>
    );

    const card = screen.getByTestId(`plant-card-${samplePlant.id}`);
    expect(card).toBeInTheDocument();
    expect(card.getAttribute('data-plant-id')).toBe(samplePlant.id);
    // Must not use numeric index
    expect(samplePlant.id).not.toMatch(/^\d+$/);
  });

  // 3. Plant Detail Modal Close & Add Plant CTA
  it('verifies PlantDetailModal has stable data-testid="plant-details-close" and data-testid="add-plant-button"', () => {
    render(
      <LanguageProvider>
        <PlantDetailModal
          plant={samplePlant}
          onClose={() => {}}
          isMyCrop={false}
          onToggleMyCrop={() => {}}
        />
      </LanguageProvider>
    );

    const closeButtons = screen.getAllByTestId('plant-details-close');
    expect(closeButtons.length).toBeGreaterThan(0);
    closeButtons.forEach((btn) => {
      expect(btn).toBeInTheDocument();
    });

    const addButtons = screen.getAllByTestId('add-plant-button');
    expect(addButtons.length).toBeGreaterThan(0);
    addButtons.forEach((btn) => {
      expect(btn).toBeInTheDocument();
    });
  });

  // 4. Pot Calculator Submit CTA
  it('verifies PotConfigStep has stable primary CTA data-testid="pot-calculator-submit"', () => {
    render(
      <LanguageProvider>
        <PotConfigStep
          availablePlants={defaultPlants}
          selectedPlantId={samplePlant.id}
          onSelectPlantId={() => {}}
          currentPlant={samplePlant}
          shape="rectangular"
          setShape={() => {}}
          lengthCm={60}
          setLengthCm={() => {}}
          widthCm={20}
          setWidthCm={() => {}}
          rectHeightCm={20}
          setRectHeightCm={() => {}}
          diameterCm={30}
          setDiameterCm={() => {}}
          roundHeightCm={25}
          setRoundHeightCm={() => {}}
          volumeLiters={24}
          minPlantVol={5}
          recPlantVol={10}
          minDepth={18}
          material="plastic"
          setMaterial={() => {}}
          materialEvaluation={{ suitable: true, comment: 'Ok' }}
          supports="stake"
          setSupports={() => {}}
          supportEvaluation={{ required: false, comment: 'Ok' }}
          potCount={1}
          setPotCount={() => {}}
          sowingMethod="nasiona"
          setSowingMethod={() => {}}
          onApplyPreset={() => {}}
          onCalculate={() => {}}
        />
      </LanguageProvider>
    );

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn.tagName.toLowerCase()).toBe('button');
  });

  // 5. Form controls have valid id and label htmlFor pairs
  it('verifies all inputs and selects in PotConfigStep have corresponding id and label htmlFor pairs', () => {
    const { container } = render(
      <LanguageProvider>
        <PotConfigStep
          availablePlants={defaultPlants}
          selectedPlantId={samplePlant.id}
          onSelectPlantId={() => {}}
          currentPlant={samplePlant}
          shape="rectangular"
          setShape={() => {}}
          lengthCm={60}
          setLengthCm={() => {}}
          widthCm={20}
          setWidthCm={() => {}}
          rectHeightCm={20}
          setRectHeightCm={() => {}}
          diameterCm={30}
          setDiameterCm={() => {}}
          roundHeightCm={25}
          setRoundHeightCm={() => {}}
          volumeLiters={24}
          minPlantVol={5}
          recPlantVol={10}
          minDepth={18}
          material="plastic"
          setMaterial={() => {}}
          materialEvaluation={{ suitable: true, comment: 'Ok' }}
          supports="stake"
          setSupports={() => {}}
          supportEvaluation={{ required: false, comment: 'Ok' }}
          potCount={1}
          setPotCount={() => {}}
          sowingMethod="nasiona"
          setSowingMethod={() => {}}
          onApplyPreset={() => {}}
          onCalculate={() => {}}
        />
      </LanguageProvider>
    );

    const inputs = container.querySelectorAll('input, select');
    expect(inputs.length).toBeGreaterThan(0);

    inputs.forEach((input) => {
      const id = input.getAttribute('id');
      const name = input.getAttribute('name');
      expect(id, 'Every form control must have an ID').toBeTruthy();
      expect(name, 'Every form control must have a name attribute').toBeTruthy();

      const associatedLabel = container.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');

      const isAccessible = associatedLabel || ariaLabel || ariaLabelledBy;
      expect(
        isAccessible,
        `Form control with id="${id}" must have an associated label (for="${id}") or aria-label/aria-labelledby`
      ).toBeTruthy();
    });
  });

  // 6. CI Assertion Rule: fails when a primary CTA lacks a stable selector or uses array index
  it('fails validation if a primary CTA lacks data-testid or uses unstable index format', () => {
    function validatePrimaryCTA(element: HTMLElement): { isValid: boolean; reason?: string } {
      const testId = element.getAttribute('data-testid');
      if (!testId || testId.trim() === '') {
        return { isValid: false, reason: 'Missing data-testid attribute' };
      }

      // Check if testId uses array index pattern like "-0", "-1", "card-2"
      if (/-(?:[0-9]+)$/.test(testId)) {
        return { isValid: false, reason: 'Uses unstable numeric array index instead of domain identifier' };
      }

      return { isValid: true };
    }

    // A valid CTA element passes
    const validElement = document.createElement('button');
    validElement.setAttribute('data-testid', 'onboarding-next-button');
    expect(validatePrimaryCTA(validElement).isValid).toBe(true);

    // An invalid CTA element (missing testid) fails
    const invalidElementNoTestId = document.createElement('button');
    const noTestIdResult = validatePrimaryCTA(invalidElementNoTestId);
    expect(noTestIdResult.isValid).toBe(false);
    expect(noTestIdResult.reason).toBe('Missing data-testid attribute');

    // An invalid CTA element (using array index) fails
    const invalidElementIndex = document.createElement('button');
    invalidElementIndex.setAttribute('data-testid', 'plant-card-0');
    const indexResult = validatePrimaryCTA(invalidElementIndex);
    expect(indexResult.isValid).toBe(false);
    expect(indexResult.reason).toContain('unstable numeric array index');
  });
});
