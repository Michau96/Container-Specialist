import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingModal } from './OnboardingModal';

describe('OnboardingModal - Layout Container & Step 3', () => {
  it('structures the dialog wrapper with exact layout container classes', () => {
    render(<OnboardingModal isOpen={true} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Dialog wrapper classes: flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden rounded-2xl bg-background
    expect(dialog.className).toContain('flex');
    expect(dialog.className).toContain('flex-col');
    expect(dialog.className).toContain('max-h-[90vh]');
    expect(dialog.className).toContain('md:max-h-[85vh]');
    expect(dialog.className).toContain('overflow-hidden');
    expect(dialog.className).toContain('rounded-2xl');
    expect(dialog.className).toContain('bg-background');
  });

  it('places header ("3. Donice i opieka") inside a fixed top bar', () => {
    render(<OnboardingModal isOpen={true} />);

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('3. Donice i opieka');

    const topBar = heading.closest('.flex-shrink-0');
    expect(topBar).toBeInTheDocument();
    expect(topBar?.className).toContain('flex-shrink-0');
    expect(topBar?.className).toContain('p-6');
    expect(topBar?.className).toContain('border-b');
    expect(topBar?.className).toContain('border-border/40');
  });

  it('wraps main form content (pot dimensions, railing, watering frequency) in scrollable container', () => {
    render(<OnboardingModal isOpen={true} />);

    // Main form content container
    const potSection = screen.getByTestId('pot-dimensions-section');
    const formContainer = potSection.parentElement;

    expect(formContainer).toBeInTheDocument();
    expect(formContainer?.className).toContain('flex-1');
    expect(formContainer?.className).toContain('overflow-y-auto');
    expect(formContainer?.className).toContain('p-6');
    expect(formContainer?.className).toContain('space-y-6');
    expect(formContainer?.className).toContain('overscroll-contain');

    // Contains pot dimensions, railing, and watering frequency
    expect(screen.getByText('Wymiary i liczba donic')).toBeInTheDocument();
    expect(screen.getByText('Typ balustrady (barierka)')).toBeInTheDocument();
    expect(screen.getByText('Czas na podlewanie (częstotliwość)')).toBeInTheDocument();
  });

  it('places CTA action bar in sticky bottom container with visible "Zapisz i przejdź" button', () => {
    const handleSave = vi.fn();
    render(<OnboardingModal isOpen={true} onSave={handleSave} />);

    const ctaBtn = screen.getByRole('button', { name: /Zapisz i przejdź/i });
    expect(ctaBtn).toBeInTheDocument();

    // CTA button classes: min-h-[48px] px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md transition-all active:scale-[0.98]
    expect(ctaBtn.className).toContain('min-h-[48px]');
    expect(ctaBtn.className).toContain('px-6');
    expect(ctaBtn.className).toContain('rounded-xl');
    expect(ctaBtn.className).toContain('bg-emerald-600');
    expect(ctaBtn.className).toContain('hover:bg-emerald-700');
    expect(ctaBtn.className).toContain('text-white');
    expect(ctaBtn.className).toContain('font-medium');
    expect(ctaBtn.className).toContain('shadow-md');
    expect(ctaBtn.className).toContain('transition-all');
    expect(ctaBtn.className).toContain('active:scale-[0.98]');

    // Bottom container: flex-shrink-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border flex items-center justify-between sticky bottom-0 z-10
    const bottomContainer = ctaBtn.closest('.sticky');
    expect(bottomContainer).toBeInTheDocument();
    expect(bottomContainer?.className).toContain('flex-shrink-0');
    expect(bottomContainer?.className).toContain('p-4');
    expect(bottomContainer?.className).toContain('bg-background/95');
    expect(bottomContainer?.className).toContain('backdrop-blur-sm');
    expect(bottomContainer?.className).toContain('border-t');
    expect(bottomContainer?.className).toContain('border-border');
    expect(bottomContainer?.className).toContain('flex');
    expect(bottomContainer?.className).toContain('items-center');
    expect(bottomContainer?.className).toContain('justify-between');
    expect(bottomContainer?.className).toContain('sticky');
    expect(bottomContainer?.className).toContain('bottom-0');
    expect(bottomContainer?.className).toContain('z-10');

    // Click CTA
    fireEvent.click(ctaBtn);
    expect(handleSave).toHaveBeenCalledTimes(1);
  });
});
