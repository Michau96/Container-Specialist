import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useScrollLock } from './useScrollLock';
import { OnboardingModal } from '../features/onboarding/components/OnboardingModal';
import { WelcomeModal } from '../components/WelcomeModal';
import { BalconyProfileDrawer } from '../components/BalconyProfileDrawer';
import { LanguageProvider } from '../lib/LanguageContext';
import { UserBalconySpec } from '../types';

const mockSpec: UserBalconySpec = {
  region: 'mazowieckie',
  orientation: 'S',
  floor: 2,
  balcony_type: 'open_rail',
  roofing: 'covered',
  care_time: 'daily',
  pots: ['boxes_balcony_15cm'],
};

describe('useScrollLock Hook', () => {
  let originalOverflow: string;
  let originalPaddingRight: string;

  beforeEach(() => {
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  });

  it('does not mutate body overflow or paddingRight when isLocked is false', () => {
    renderHook(() => useScrollLock(false));

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('locks body scroll (overflow: hidden) and sets paddingRight when isLocked is true', () => {
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe('hidden');
    // In JSDOM, window.innerWidth - document.documentElement.clientWidth is typically 0
    expect(document.body.style.paddingRight).toMatch(/\d+px/);

    unmount();
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });

  it('restores previous overflow style and clears paddingRight on unmount', () => {
    document.body.style.overflow = '';
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: true },
    });

    expect(document.body.style.overflow).toBe('hidden');

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.paddingRight).toBe('');
  });
});

describe('Modal & Drawer Scroll Lock & Backdrop Integration', () => {
  it('integrates useScrollLock into OnboardingModal, uses backdrop bg-black/50 backdrop-blur-sm z-50 with click-outside dismiss, and preserves "Zamknij" button', () => {
    const handleClose = vi.fn();
    const { rerender } = render(<OnboardingModal isOpen={true} onClose={handleClose} />);

    // Scroll lock active
    expect(document.body.style.overflow).toBe('hidden');

    // Backdrop check
    const backdrop = screen.getByTestId('onboarding-modal-backdrop');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop.className).toContain('fixed');
    expect(backdrop.className).toContain('inset-0');
    expect(backdrop.className).toContain('bg-black/50');
    expect(backdrop.className).toContain('backdrop-blur-sm');
    expect(backdrop.className).toContain('z-50');

    // Preserved close button labeled "Zamknij"
    const closeBtn = screen.getByRole('button', { name: 'Zamknij' });
    expect(closeBtn).toBeInTheDocument();

    // Click outside backdrop triggers dismiss
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Unmount / close unlocks scroll
    rerender(<OnboardingModal isOpen={false} onClose={handleClose} />);
    expect(document.body.style.overflow).toBe('');
  });

  it('integrates useScrollLock into WelcomeModal, uses backdrop bg-black/50 backdrop-blur-sm z-50 with click-outside dismiss, and preserves "Zamknij i przejdź do aplikacji" button', () => {
    const handleClose = vi.fn();
    const handleGuest = vi.fn();
    const { rerender } = render(
      <LanguageProvider>
        <WelcomeModal
          isOpen={true}
          onClose={handleClose}
          balconySpec={mockSpec}
          myCrops={[]}
          onAuthSuccess={vi.fn()}
          onContinueAsGuest={handleGuest}
        />
      </LanguageProvider>
    );

    // Scroll lock active
    expect(document.body.style.overflow).toBe('hidden');

    // Backdrop check
    const backdrop = document.getElementById('welcome-screen-backdrop');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop?.className).toContain('fixed');
    expect(backdrop?.className).toContain('inset-0');
    expect(backdrop?.className).toContain('bg-black/50');
    expect(backdrop?.className).toContain('backdrop-blur-sm');
    expect(backdrop?.className).toContain('z-50');

    // Close button labeled "Zamknij i przejdź do aplikacji"
    const closeBtn = screen.getByLabelText(/Zamknij i przejdź do aplikacji/i);
    expect(closeBtn).toBeInTheDocument();

    // Click outside backdrop triggers dismiss
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(handleGuest).toHaveBeenCalledTimes(1);
    }

    // Close unlocks scroll
    rerender(
      <LanguageProvider>
        <WelcomeModal
          isOpen={false}
          onClose={handleClose}
          balconySpec={mockSpec}
          myCrops={[]}
          onAuthSuccess={vi.fn()}
          onContinueAsGuest={handleGuest}
        />
      </LanguageProvider>
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('integrates useScrollLock into "Mój balkon" drawer (BalconyProfileDrawer)', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <LanguageProvider>
        <BalconyProfileDrawer
          isOpen={true}
          onClose={handleClose}
          userSpec={mockSpec}
          onOpenFullSetup={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <LanguageProvider>
        <BalconyProfileDrawer
          isOpen={false}
          onClose={handleClose}
          userSpec={mockSpec}
          onOpenFullSetup={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(document.body.style.overflow).toBe('');
  });
});
