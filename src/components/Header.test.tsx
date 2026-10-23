import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';
import { Navbar } from './Navbar';
import { HeaderNavigation } from './HeaderNavigation';
import { LanguageProvider } from '../lib/LanguageContext';
import { UserBalconySpec } from '../types';

const configuredSpec: UserBalconySpec = {
  region: 'mazowieckie',
  orientation: 'S',
  floor: 2,
  balcony_type: 'open_rail',
  roofing: 'covered',
  care_time: 'daily',
  pots: ['boxes_balcony_15cm'],
};

const incompleteSpec: UserBalconySpec = {
  region: '' as any,
  orientation: '' as any,
  floor: null as any,
  balcony_type: 'open_rail',
  roofing: 'covered',
  care_time: 'daily',
  pots: [],
};

describe('Header / Navbar Navigation Component - Mój balkon Tooltip & Indicator', () => {
  it('renders "Mój balkon" navigation button with aria-label="Mój balkon - profil skonfigurowany" when configured', () => {
    render(
      <LanguageProvider>
        <Header
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={configuredSpec}
          isConfigured={true}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    const balconyBtn = screen.getByTestId('open-balcony-drawer-btn');
    expect(balconyBtn).toBeInTheDocument();
    expect(balconyBtn).toHaveAttribute('aria-label', 'Mój balkon - profil skonfigurowany');
  });

  it('renders indicator dot with explicit aria-hidden="true" and smooth transition classes "relative inline-flex h-2.5 w-2.5"', () => {
    render(
      <LanguageProvider>
        <Header
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={configuredSpec}
          isConfigured={true}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    const indicator = screen.getByTestId('balcony-status-indicator');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(indicator.className).toContain('relative');
    expect(indicator.className).toContain('inline-flex');
    expect(indicator.className).toContain('h-2.5');
    expect(indicator.className).toContain('w-2.5');
    expect(indicator.className).toContain('transition-all');
    expect(indicator.className).toContain('bg-emerald-500');
  });

  it('renders configured tooltip content "Profil balkonu: Południe (S), Piętro 1-3, Mazowieckie" with small green check icon', () => {
    render(
      <LanguageProvider>
        <Header
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={configuredSpec}
          isConfigured={true}
          tooltipOpen={true}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    const tooltipContent = screen.getByTestId('balcony-tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveTextContent('Profil balkonu: Południe (S), Piętro 1-3, Mazowieckie');

    // Check for green check icon
    const checkIcon = tooltipContent.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon?.getAttribute('aria-hidden')).toBe('true');
    expect(checkIcon?.getAttribute('class')).toMatch(/emerald|green/);
  });

  it('renders incomplete tooltip content "Uzupełnij parametry balkonu, aby zoptymalizować dobór roślin" when profile is incomplete', () => {
    render(
      <LanguageProvider>
        <Header
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={incompleteSpec}
          isConfigured={false}
          tooltipOpen={true}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    const tooltipContent = screen.getByTestId('balcony-tooltip-content');
    expect(tooltipContent).toBeInTheDocument();
    expect(tooltipContent).toHaveTextContent('Uzupełnij parametry balkonu, aby zoptymalizować dobór roślin');

    const balconyBtn = screen.getByTestId('open-balcony-drawer-btn');
    expect(balconyBtn.getAttribute('aria-label')).not.toBe('Mój balkon - profil skonfigurowany');

    const indicator = screen.getByTestId('balcony-status-indicator');
    expect(indicator).toHaveAttribute('title', 'Profil wymaga uzupełnienia');
    expect(indicator.className).toContain('relative');
    expect(indicator.className).toContain('flex');
    expect(indicator.className).toContain('h-2.5');
    expect(indicator.className).toContain('w-2.5');
    expect(indicator.querySelector('.animate-ping')).toBeInTheDocument();
    expect(screen.getByText('Profil balkonu wymaga dokończenia konfiguracji')).toBeInTheDocument();
  });

  it('works with Navbar and HeaderNavigation aliases', () => {
    render(
      <LanguageProvider>
        <Navbar
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={configuredSpec}
          isConfigured={true}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(screen.getByTestId('open-balcony-drawer-btn')).toHaveAttribute(
      'aria-label',
      'Mój balkon - profil skonfigurowany'
    );

    render(
      <LanguageProvider>
        <HeaderNavigation
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={configuredSpec}
          isConfigured={true}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(screen.getAllByTestId('open-balcony-drawer-btn').length).toBe(2);
  });

  it('renders indicator badge with animated ping, title tooltip and screen-reader announcement when profile is incomplete', () => {
    render(
      <LanguageProvider>
        <Header
          activeTab="my_crops"
          onTabChange={vi.fn()}
          userSpec={incompleteSpec}
          isConfigured={false}
          darkMode={false}
          onToggleDarkMode={vi.fn()}
        />
      </LanguageProvider>
    );

    const srAnnouncement = screen.getByText('Profil balkonu wymaga dokończenia konfiguracji');
    expect(srAnnouncement).toBeInTheDocument();
    expect(srAnnouncement).toHaveClass('sr-only');

    const indicator = screen.getByTestId('balcony-status-indicator');
    expect(indicator).toHaveAttribute('title', 'Profil wymaga uzupełnienia');
    expect(indicator.querySelector('.animate-ping')).toHaveClass('bg-amber-400');
    expect(indicator.querySelector('.bg-amber-500')).toBeInTheDocument();
  });
});
