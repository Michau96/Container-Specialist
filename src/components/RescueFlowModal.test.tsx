import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { RescueFlowModal } from './RescueFlowModal';
import { Plant, MyCropItem } from '../types';
import { LanguageProvider } from '../lib/LanguageContext';

const mockPlant: Plant = {
  id: 'pomidor-karlowy',
  name: 'Pomidor karłowy koktajlowy',
  plant_group: 'warzywa',
  category: 'Warzywa psiankowate',
  sun_preference: 'Pełne słońce',
  summary: 'Karłowy pomidor koktajlowy idealny do donic balkonowych.',
  pot: {
    min_volume_l: 10,
    recommended_volume_l: 15,
    min_depth_cm: 25,
    drainage: 'wymagany drenaż z keramzytu 3 cm',
    material: 'ceramika lub plastik',
  },
  soil: {
    type: 'żyzna, przepuszczalna',
    ph: '6.0 - 6.8',
    structure: 'lekka',
    fertilizer: 'organiczny do pomidorów',
  },
  difficulty: 3,
  difficulty_label: 'Łatwa',
  orientations: ['S', 'W', 'E'],
  wind_tolerance: 'średnia',
  detailed_guide: 'Przewodnik uprawy',
  schedule: {},
  sources: [],
  varieties: [],
};

const mockCrop: MyCropItem = {
  id: 'crop-1',
  plantId: 'pomidor-karlowy',
  addedAt: new Date().toISOString(),
  potCount: 1,
  notes: '',
};

describe('RescueFlowModal Component Architecture & Sticky Footer', () => {
  it('renders modal container with exact flexbox and max-height layout architecture', () => {
    const { container } = render(
      <LanguageProvider>
        <RescueFlowModal
          isOpen={true}
          crop={mockCrop}
          plant={mockPlant}
          onClose={vi.fn()}
          onActivatePlan={vi.fn()}
          onDismissPlan={vi.fn()}
          onUpdateCrop={vi.fn()}
        />
      </LanguageProvider>
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    expect(dialog?.className).toContain('flex');
    expect(dialog?.className).toContain('flex-col');
    expect(dialog?.className).toContain('max-h-[85vh]');
    expect(dialog?.className).toContain('md:max-h-[750px]');
    expect(dialog?.className).toContain('w-full');
    expect(dialog?.className).toContain('max-w-2xl');
    expect(dialog?.className).toContain('bg-white');
    expect(dialog?.className).toContain('dark:bg-neutral-900');
    expect(dialog?.className).toContain('rounded-2xl');
    expect(dialog?.className).toContain('shadow-2xl');
    expect(dialog?.className).toContain('overflow-hidden');
  });

  it('renders header with shrink-0 and border styling', () => {
    const { container } = render(
      <LanguageProvider>
        <RescueFlowModal
          isOpen={true}
          crop={mockCrop}
          plant={mockPlant}
          onClose={vi.fn()}
          onActivatePlan={vi.fn()}
          onDismissPlan={vi.fn()}
          onUpdateCrop={vi.fn()}
        />
      </LanguageProvider>
    );

    const dialog = container.querySelector('[role="dialog"]');
    const header = dialog?.firstElementChild;
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('shrink-0');
    expect(header?.className).toContain('p-4');
    expect(header?.className).toContain('border-b');
    expect(header?.className).toContain('border-neutral-200');
    expect(header?.className).toContain('dark:border-neutral-800');
  });

  it('wraps the symptom selection list (e.g. 🍂 PRZELANIE / KORZENIE) in independently scrollable body area', () => {
    const { container } = render(
      <LanguageProvider>
        <RescueFlowModal
          isOpen={true}
          crop={mockCrop}
          plant={mockPlant}
          onClose={vi.fn()}
          onActivatePlan={vi.fn()}
          onDismissPlan={vi.fn()}
          onUpdateCrop={vi.fn()}
        />
      </LanguageProvider>
    );

    const dialog = container.querySelector('[role="dialog"]');
    const body = dialog?.children[1];
    expect(body).toBeInTheDocument();
    expect(body?.className).toContain('flex-1');
    expect(body?.className).toContain('overflow-y-auto');
    expect(body?.className).toContain('p-4');
    expect(body?.className).toContain('md:p-6');
    expect(body?.className).toContain('space-y-3');

    // Confirms presence of symptom list with badge text containing 🍂 PRZELANIE / KORZENIE
    expect(screen.getByText(/PRZELANIE \/ KORZENIE/i)).toBeInTheDocument();
    expect(screen.getAllByText('🍂').length).toBeGreaterThan(0);
  });

  it('implements sticky footer at the base with exact Tailwind styling and emergency CTA button', () => {
    const handleActivatePlan = vi.fn();

    const { container } = render(
      <LanguageProvider>
        <RescueFlowModal
          isOpen={true}
          crop={mockCrop}
          plant={mockPlant}
          onClose={vi.fn()}
          onActivatePlan={handleActivatePlan}
          onDismissPlan={vi.fn()}
          onUpdateCrop={vi.fn()}
        />
      </LanguageProvider>
    );

    const dialog = container.querySelector('[role="dialog"]');
    const footer = dialog?.children[2];
    expect(footer).toBeInTheDocument();

    // Verify footer classes
    expect(footer?.className).toContain('shrink-0');
    expect(footer?.className).toContain('sticky');
    expect(footer?.className).toContain('bottom-0');
    expect(footer?.className).toContain('bg-white/95');
    expect(footer?.className).toContain('dark:bg-neutral-900/95');
    expect(footer?.className).toContain('backdrop-blur-sm');
    expect(footer?.className).toContain('border-t');
    expect(footer?.className).toContain('border-neutral-200');
    expect(footer?.className).toContain('dark:border-neutral-800');
    expect(footer?.className).toContain('p-4');
    expect(footer?.className).toContain('flex');
    expect(footer?.className).toContain('flex-col');
    expect(footer?.className).toContain('sm:flex-row');
    expect(footer?.className).toContain('items-center');
    expect(footer?.className).toContain('justify-between');
    expect(footer?.className).toContain('gap-3');
    expect(footer?.className).toContain('z-10');

    // Verify main CTA button with exact text and styling
    const ctaBtn = screen.getByRole('button', {
      name: /Aktywuj tryb ratunkowy i zawieś podlewanie/i,
    });
    expect(ctaBtn).toBeInTheDocument();
    expect(ctaBtn).toHaveTextContent('Aktywuj tryb ratunkowy i zawieś podlewanie');
    expect(ctaBtn.className).toContain('bg-amber-600');
    expect(ctaBtn.className).toContain('hover:bg-amber-700');
    expect(ctaBtn.className).toContain('text-white');
    expect(ctaBtn.className).toContain('font-semibold');
    expect(ctaBtn.className).toContain('rounded-xl');
    expect(ctaBtn.className).toContain('px-5');
    expect(ctaBtn.className).toContain('py-3');
    expect(ctaBtn.className).toContain('w-full');
    expect(ctaBtn.className).toContain('sm:w-auto');
    expect(ctaBtn.className).toContain('shadow-md');
    expect(ctaBtn.className).toContain('transition-all');

    // Behavioral trigger: Clicking triggers onActivatePlan with a configured plan
    fireEvent.click(ctaBtn);
    expect(handleActivatePlan).toHaveBeenCalledTimes(1);
    const planArg = handleActivatePlan.mock.calls[0][0];
    expect(planArg).toBeDefined();
    expect(planArg.active).toBe(true);
    expect(planArg.issueId).toBe('yellow_leaves');
    expect(planArg.suspendedWateringUntil).toBeDefined();
  });
});
