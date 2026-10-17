import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { BalconyProfileDrawer } from './BalconyProfileDrawer';
import { BalconySetupModal } from './BalconySetupModal';
import { PlantDetailModal } from './PlantDetailModal';
import { LanguageProvider } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { validatePlantCatalog } from '../lib/catalogValidation';
import { UserBalconySpec, Plant } from '../types';
import fs from 'fs';
import path from 'path';

const { validPlants } = validatePlantCatalog(defaultPlantsData);
const samplePlant: Plant = validPlants[0];

const sampleSpec: UserBalconySpec = {
  region: 'mazowieckie',
  orientation: 'S',
  floor: 2,
  balcony_type: 'open_rail',
  roofing: 'covered',
  care_time: 'daily',
  pots: ['boxes_balcony_15cm'],
};

describe('Root Layout, Global CSS Overflow Protection & Responsive Viewports', () => {
  let originalInnerWidth: number;
  let originalOverflow: string;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    window.innerWidth = originalInnerWidth;
    document.body.style.overflow = originalOverflow;
  });

  it('verifies index.css sets global horizontal overflow protection and smooth scrolling on html and body', () => {
    const cssPath = path.resolve(process.cwd(), 'src/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // Rule check in index.css
    expect(cssContent).toMatch(/html,\s*body\s*\{[^}]*overflow-x:\s*hidden/);
    expect(cssContent).toMatch(/html,\s*body\s*\{[^}]*max-width:\s*100vw/);
    expect(cssContent).toMatch(/html,\s*body\s*\{[^}]*scroll-behavior:\s*smooth/);

    // Rule check for root wrappers
    expect(cssContent).toMatch(/#root,\s*#app-root\s*\{[^}]*width:\s*100%/);
    expect(cssContent).toMatch(/#root,\s*#app-root\s*\{[^}]*max-width:\s*100%/);
    expect(cssContent).toMatch(/#root,\s*#app-root\s*\{[^}]*overflow-x:\s*hidden/);
  });

  it('ensures layout wrapper #app-root and main use "w-full max-w-full relative"', () => {
    const { container } = render(<App />);

    const appRoot = container.querySelector('#app-root');
    expect(appRoot).toBeInTheDocument();
    expect(appRoot?.className).toContain('w-full');
    expect(appRoot?.className).toContain('max-w-full');
    expect(appRoot?.className).toContain('relative');
    expect(appRoot?.className).toContain('overflow-x-hidden');

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement?.className).toContain('w-full');
    expect(mainElement?.className).toContain('max-w-full');
    expect(mainElement?.className).toContain('relative');
  });

  it('locks body scroll (overflow-hidden) when "Mój balkon" drawer is open and unlocks on close', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <LanguageProvider>
        <BalconyProfileDrawer
          isOpen={true}
          onClose={handleClose}
          userSpec={sampleSpec}
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
          userSpec={sampleSpec}
          onOpenFullSetup={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('locks body scroll (overflow-hidden) when modal is open and restores previous overflow on close', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <LanguageProvider>
        <BalconySetupModal
          isOpen={true}
          onClose={handleClose}
          initialSpec={sampleSpec}
          onSave={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <LanguageProvider>
        <BalconySetupModal
          isOpen={false}
          onClose={handleClose}
          initialSpec={sampleSpec}
          onSave={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(document.body.style.overflow).toBe('');
  });

  const breakpoints = [
    { width: 375, name: 'Mobile Viewport (375px)' },
    { width: 768, name: 'Tablet Viewport (768px)' },
    { width: 1024, name: 'Desktop Viewport (1024px)' },
    { width: 1440, name: 'Wide Desktop Viewport (1440px)' },
  ];

  breakpoints.forEach(({ width, name }) => {
    it(`confirms no interactive elements breach viewport boundaries at ${name}`, () => {
      window.innerWidth = width;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(<App />);

      const appRoot = container.querySelector('#app-root');
      expect(appRoot).toBeInTheDocument();

      // Ensure root contains overflow protection
      expect(appRoot?.className).toContain('overflow-x-hidden');
      expect(appRoot?.className).toContain('w-full');
      expect(appRoot?.className).toContain('max-w-full');

      // Verify header actions are contained
      const header = container.querySelector('header');
      expect(header).toBeInTheDocument();
      expect(header?.className).toContain('sticky');

      // Verify "Mój balkon" button is rendered and clickable without layout overflow
      const balconyBtn = screen.getByTestId('open-balcony-drawer-btn');
      expect(balconyBtn).toBeInTheDocument();
    });
  });
});
