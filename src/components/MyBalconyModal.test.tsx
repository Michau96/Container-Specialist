import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MyBalconyModal } from './MyBalconyModal';
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

describe('MyBalconyModal Component', () => {
  let originalOverflow: string;

  beforeEach(() => {
    originalOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalOverflow;
  });

  it('renders exact requested container layout structure and classes', () => {
    const handleClose = vi.fn();
    const handleGoToPlants = vi.fn();

    render(
      <MyBalconyModal
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onNavigateToPlants={handleGoToPlants}
      />
    );

    // Root wrapper
    const backdrop = screen.getByTestId('my-balcony-modal-backdrop');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop.className).toContain('fixed');
    expect(backdrop.className).toContain('inset-0');
    expect(backdrop.className).toContain('z-50');
    expect(backdrop.className).toContain('flex');
    expect(backdrop.className).toContain('items-center');
    expect(backdrop.className).toContain('justify-center');
    expect(backdrop.className).toContain('p-4');

    // Dialog card
    const dialog = screen.getByTestId('my-balcony-modal-dialog');
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
    expect(heading).toHaveTextContent('Mój balkon');
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
    expect(screen.getByText(/Wystawa S/i)).toBeInTheDocument();
    expect(screen.getByText(/Piętro 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Mazowieckie/i)).toBeInTheDocument();

    // Sticky Action Footer
    const ctaBtn = screen.getByRole('button', { name: /Przejdź do doboru roślin/i });
    expect(ctaBtn).toBeInTheDocument();
    const footer = ctaBtn.closest('.bg-slate-50');
    expect(footer).toBeInTheDocument();
    expect(footer?.className).toContain('p-4');
    expect(footer?.className).toContain('bg-slate-50');
    expect(footer?.className).toContain('border-t');
    expect(footer?.className).toContain('border-slate-100');
    expect(footer?.className).toContain('flex');
    expect(footer?.className).toContain('items-center');
    expect(footer?.className).toContain('justify-end');
    expect(footer?.className).toContain('gap-3');
    expect(footer?.className).toContain('flex-shrink-0');
  });

  it('ensures primary CTA button has minimum 48px height, exact Polish copy and clear active/hover styles', () => {
    const handleClose = vi.fn();
    const handleGoToPlants = vi.fn();

    render(
      <MyBalconyModal
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onNavigateToPlants={handleGoToPlants}
      />
    );

    const ctaBtn = screen.getByRole('button', { name: /Przejdź do doboru roślin/i });
    expect(ctaBtn).toHaveTextContent('Przejdź do doboru roślin');
    expect(ctaBtn.className).toContain('min-h-[48px]');
    expect(ctaBtn.className).toContain('bg-emerald-600');
    expect(ctaBtn.className).toContain('hover:bg-emerald-700');
    expect(ctaBtn.className).toContain('active:scale-[0.98]');
    expect(ctaBtn.className).toContain('transition-all');
    expect(ctaBtn.className).toContain('rounded-xl');
    expect(ctaBtn.className).toContain('shadow-md');

    fireEvent.click(ctaBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleGoToPlants).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll when open and closes on backdrop click', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <MyBalconyModal isOpen={true} onClose={handleClose} userSpec={mockSpec} />
    );

    expect(document.body.style.overflow).toBe('hidden');

    const backdrop = screen.getByTestId('my-balcony-modal-backdrop');
    fireEvent.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);

    rerender(<MyBalconyModal isOpen={false} onClose={handleClose} userSpec={mockSpec} />);
    expect(document.body.style.overflow).toBe('');
  });
});
