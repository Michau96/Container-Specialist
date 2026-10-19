import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { OnboardingStep3Modal } from './OnboardingStep3Modal';

describe('OnboardingStep3Modal Component', () => {
  let originalOverflow: string;

  beforeEach(() => {
    originalOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
  });

  it('renders exact requested container layout structure and classes', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();
    const handleNext = vi.fn();
    const handleGoToPlants = vi.fn();

    render(
      <OnboardingStep3Modal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        onNext={handleNext}
        onNavigateToPlants={handleGoToPlants}
      />
    );

    // Root wrapper
    const backdrop = screen.getByTestId('onboarding-step3-backdrop');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop.className).toContain('fixed');
    expect(backdrop.className).toContain('inset-0');
    expect(backdrop.className).toContain('z-50');
    expect(backdrop.className).toContain('flex');
    expect(backdrop.className).toContain('items-center');
    expect(backdrop.className).toContain('justify-center');
    expect(backdrop.className).toContain('p-4');

    // Dialog card
    const dialog = screen.getByTestId('onboarding-step3-dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog.className).toContain('bg-white');
    expect(dialog.className).toContain('rounded-2xl');
    expect(dialog.className).toContain('shadow-2xl');
    expect(dialog.className).toContain('w-full');
    expect(dialog.className).toContain('max-w-xl');
    expect(dialog.className).toContain('max-h-[90vh]');
    expect(dialog.className).toContain('flex');
    expect(dialog.className).toContain('flex-col');
    expect(dialog.className).toContain('overflow-hidden');
    expect(dialog.className).toContain('border');
    expect(dialog.className).toContain('border-slate-100');

    // Fixed Header
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('3. Donice i opieka');
    const header = heading.closest('.flex-shrink-0');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('p-5');
    expect(header?.className).toContain('border-b');
    expect(header?.className).toContain('border-slate-100');
    expect(header?.className).toContain('flex');
    expect(header?.className).toContain('items-center');
    expect(header?.className).toContain('justify-between');
    expect(header?.className).toContain('flex-shrink-0');

    // Close button
    const closeBtn = screen.getByRole('button', { name: 'Zamknij' });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveTextContent('✕');

    // Scrollable Body
    const body = dialog.querySelector('.overflow-y-auto');
    expect(body).toBeInTheDocument();
    expect(body?.className).toContain('p-6');
    expect(body?.className).toContain('overflow-y-auto');
    expect(body?.className).toContain('flex-1');
    expect(body?.className).toContain('space-y-6');

    // Parameters displayed
    expect(screen.getByText('Wymiary i liczba donic')).toBeInTheDocument();
    expect(screen.getByText('Typ balustrady (barierka)')).toBeInTheDocument();
    expect(screen.getByText('Czas na podlewanie (częstotliwość)')).toBeInTheDocument();

    // Sticky Action Footer
    const footer = screen.getByTestId('onboarding-step3-footer');
    expect(footer).toBeInTheDocument();
    expect(footer?.className).toContain('p-4');
    expect(footer?.className).toContain('bg-slate-50');
    expect(footer?.className).toContain('border-t');
    expect(footer?.className).toContain('border-slate-100');
    expect(footer?.className).toContain('flex');
    expect(footer?.className).toContain('flex-shrink-0');
  });

  it('maintains exact Polish CTA copy: "Przejdź do doboru roślin", "Zapisz i przejdź", "Dalej >" with min 48px height', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();
    const handleNext = vi.fn();
    const handleGoToPlants = vi.fn();

    render(
      <OnboardingStep3Modal
        isOpen={true}
        onClose={handleClose}
        onSave={handleSave}
        onNext={handleNext}
        onNavigateToPlants={handleGoToPlants}
      />
    );

    // 1. "Zapisz i przejdź"
    const saveBtn = screen.getByRole('button', { name: /Zapisz i przejdź/i });
    expect(saveBtn).toBeInTheDocument();
    expect(saveBtn.textContent).toContain('Zapisz i przejdź');
    expect(saveBtn.className).toContain('min-h-[48px]');
    expect(saveBtn.className).toContain('bg-emerald-600');
    expect(saveBtn.className).toContain('hover:bg-emerald-700');
    expect(saveBtn.className).toContain('active:scale-[0.98]');

    // 2. "Dalej >"
    const nextBtn = screen.getByRole('button', { name: /Dalej >/i });
    expect(nextBtn).toBeInTheDocument();
    expect(nextBtn.textContent).toContain('Dalej >');
    expect(nextBtn.className).toContain('min-h-[48px]');
    expect(nextBtn.className).toContain('active:scale-[0.98]');

    // 3. "Przejdź do doboru roślin"
    const plantsBtn = screen.getByRole('button', { name: /Przejdź do doboru roślin/i });
    expect(plantsBtn).toBeInTheDocument();
    expect(plantsBtn.textContent).toContain('Przejdź do doboru roślin');
    expect(plantsBtn.className).toContain('min-h-[48px]');
    expect(plantsBtn.className).toContain('bg-emerald-700');
    expect(plantsBtn.className).toContain('hover:bg-emerald-800');
    expect(plantsBtn.className).toContain('active:scale-[0.98]');

    // Trigger save
    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalledTimes(1);

    // Trigger next
    fireEvent.click(nextBtn);
    expect(handleNext).toHaveBeenCalledTimes(1);

    // Trigger go to plants
    fireEvent.click(plantsBtn);
    expect(handleGoToPlants).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when open and closes on backdrop click', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <OnboardingStep3Modal isOpen={true} onClose={handleClose} />
    );

    expect(document.body.style.overflow).toBe('hidden');

    const backdrop = screen.getByTestId('onboarding-step3-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);

    rerender(<OnboardingStep3Modal isOpen={false} onClose={handleClose} />);
    expect(document.body.style.overflow).toBe('');
  });
});
