import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SunExposureStep } from './SunExposureStep';

describe('SunExposureStep', () => {
  it('renders the world orientation selector cards with flexible responsive grid classes', () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <SunExposureStep
        selectedOrientation={null}
        onSelectOrientation={handleSelect}
        recommendedOrientation="S"
      />
    );

    // Locate the grid wrapper
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid?.className).toContain('grid-cols-2');
    expect(grid?.className).toContain('sm:grid-cols-4');
    expect(grid?.className).toContain('gap-3');
    expect(grid?.className).toContain('w-full');
  });

  it('renders card headers without fixed width constraints and with whitespace-normal break-words typography', () => {
    const handleSelect = vi.fn();
    render(
      <SunExposureStep
        selectedOrientation="S"
        onSelectOrientation={handleSelect}
        recommendedOrientation="S"
      />
    );

    // Verify main Polish orientation headers are present
    const southHeader = screen.getByText('Południe (S)');
    const eastHeader = screen.getByText('Wschód (E)');
    const westHeader = screen.getByText('Zachód (W)');
    const northHeader = screen.getByText('Północ (N)');

    expect(southHeader).toBeInTheDocument();
    expect(eastHeader).toBeInTheDocument();
    expect(westHeader).toBeInTheDocument();
    expect(northHeader).toBeInTheDocument();

    // Verify typography classes for wrapping without clipping
    [southHeader, eastHeader, westHeader, northHeader].forEach((header) => {
      expect(header.className).toContain('whitespace-normal');
      expect(header.className).toContain('break-words');
      expect(header.className).toContain('text-sm');
      expect(header.className).toContain('font-semibold');
      expect(header.className).toContain('leading-tight');

      // Verify no unwanted clipping or truncation constraints
      expect(header.className).not.toContain('truncate');
      expect(header.className).not.toContain('overflow-hidden');
      expect(header.className).not.toContain('w-12');
      expect(header.className).not.toContain('max-w-[60px]');
    });
  });

  it('renders badge text underneath the title with text-xs text-muted-foreground flex flex-col gap-1', () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <SunExposureStep
        selectedOrientation="S"
        onSelectOrientation={handleSelect}
        recommendedOrientation="S"
      />
    );

    // Recommended badge text
    const recBadge = screen.getByTestId('sunlight-recommended-badge');
    expect(recBadge).toBeInTheDocument();
    expect(recBadge.textContent).toContain('Rekomendowane ☀️');

    // Container underneath the title
    const badgeContainers = container.querySelectorAll('.text-muted-foreground');
    expect(badgeContainers.length).toBeGreaterThan(0);
    const firstContainer = badgeContainers[0];
    expect(firstContainer.className).toContain('text-xs');
    expect(firstContainer.className).toContain('text-muted-foreground');
    expect(firstContainer.className).toContain('flex');
    expect(firstContainer.className).toContain('flex-col');
    expect(firstContainer.className).toContain('gap-1');

    // Sun hours badge text like "6-8h słońca"
    expect(screen.getAllByText('6-8h słońca').length).toBeGreaterThan(0);
  });

  it('renders Wybrano ✓ for selected card and Wybierz for unselected cards without clipping', () => {
    const handleSelect = vi.fn();
    render(
      <SunExposureStep
        selectedOrientation="S"
        onSelectOrientation={handleSelect}
        recommendedOrientation="S"
      />
    );

    expect(screen.getByText('Wybrano ✓')).toBeInTheDocument();
    const selectPills = screen.getAllByText('Wybierz');
    expect(selectPills.length).toBeGreaterThan(0);
  });

  it('calls onSelectOrientation when clicking on an orientation card', () => {
    const handleSelect = vi.fn();
    render(
      <SunExposureStep
        selectedOrientation={null}
        onSelectOrientation={handleSelect}
        recommendedOrientation="S"
      />
    );

    const southOption = screen.getByTestId('sunlight-option-full-sun');
    fireEvent.click(southOption);
    expect(handleSelect).toHaveBeenCalledWith('S');
  });
});
