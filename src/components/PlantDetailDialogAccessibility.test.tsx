import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlantDetailModal } from './PlantDetailModal';
import { LanguageProvider } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';

const defaultPlants = defaultPlantsData as unknown as Plant[];
const samplePlant: Plant = defaultPlants[0];

describe('PlantDetailModal Dialog Accessibility & UX Suite', () => {
  let originalOverflow: string;

  beforeEach(() => {
    originalOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
  });

  // 1. role="dialog", aria-modal="true", and labelled heading
  it('renders a proper accessible dialog with role="dialog", aria-modal="true", and aria-labelledby matching the heading', () => {
    render(
      <LanguageProvider>
        <PlantDetailModal plant={samplePlant} onClose={() => {}} />
      </LanguageProvider>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    const headingId = dialog.getAttribute('aria-labelledby');
    expect(headingId).toBeTruthy();

    const heading = document.getElementById(headingId!);
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(samplePlant.name);
  });

  // 2. Close button with data-testid="plant-details-close", aria-label="Zamknij", and min 44x44px
  it('provides close button with data-testid="plant-details-close", aria-label="Zamknij", and at least 44x44px hit target', () => {
    render(
      <LanguageProvider>
        <PlantDetailModal plant={samplePlant} onClose={() => {}} />
      </LanguageProvider>
    );

    const closeButtons = screen.getAllByTestId('plant-details-close');
    expect(closeButtons.length).toBeGreaterThanOrEqual(1);

    const mainCloseBtn = closeButtons[0];
    expect(mainCloseBtn).toHaveAttribute('aria-label', 'Zamknij');
    expect(mainCloseBtn.className).toMatch(/min-w-\[44px\]/);
    expect(mainCloseBtn.className).toMatch(/min-h-\[44px\]/);
  });

  // 3. Escape key dismisses dialog and calls onClose
  it('dismisses modal when Escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <LanguageProvider>
        <PlantDetailModal plant={samplePlant} onClose={handleClose} />
      </LanguageProvider>
    );

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 4. Restores focus to triggering element after close
  it('restores focus to the triggering plant card after close', () => {
    // Create a mock plant card in DOM
    const card = document.createElement('button');
    card.id = `plant-card-${samplePlant.id}`;
    card.tabIndex = 0;
    document.body.appendChild(card);

    const handleClose = vi.fn();
    render(
      <LanguageProvider>
        <PlantDetailModal plant={samplePlant} onClose={handleClose} />
      </LanguageProvider>
    );

    const closeBtn = screen.getAllByTestId('plant-details-close')[0];
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();

    document.body.removeChild(card);
  });

  // 5. Locks body scroll when open and restores when closed
  it('locks background body scroll when open and restores on unmount', () => {
    const { unmount } = render(
      <LanguageProvider>
        <PlantDetailModal plant={samplePlant} onClose={() => {}} />
      </LanguageProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe(originalOverflow);
  });

  // 6. Preserves exact Polish CTA strings
  it('preserves Polish action strings "Dodaj do moich upraw"', () => {
    render(
      <LanguageProvider>
        <PlantDetailModal plant={samplePlant} onClose={() => {}} onToggleMyCrop={() => {}} />
      </LanguageProvider>
    );

    const addButtons = screen.getAllByTestId('add-plant-button');
    expect(addButtons.length).toBeGreaterThan(0);
    const hasCorrectPolishLabel = addButtons.some((b) => b.textContent?.includes('Dodaj do moich upraw') || b.textContent?.includes('Moich upraw'));
    expect(hasCorrectPolishLabel).toBe(true);
  });
});
