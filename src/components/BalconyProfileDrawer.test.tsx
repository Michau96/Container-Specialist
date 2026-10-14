import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BalconyProfileDrawer } from './BalconyProfileDrawer';
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

describe('BalconyProfileDrawer component', () => {
  it('renders DialogPrimitive overlay with required styling classes', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
      />
    );

    const overlay = screen.getByTestId('balcony-drawer-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay.className).toContain('fixed');
    expect(overlay.className).toContain('inset-0');
    expect(overlay.className).toContain('z-40');
    expect(overlay.className).toContain('bg-black/40');
    expect(overlay.className).toContain('backdrop-blur-sm');
    expect(overlay.className).toContain('transition-opacity');
    expect(overlay.className).toContain('animate-in');
    expect(overlay.className).toContain('fade-in');
  });

  it('renders drawer container with required responsive and slide-over styling classes', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
      />
    );

    const drawer = screen.getByTestId('balcony-spec-drawer');
    expect(drawer).toBeInTheDocument();
    expect(drawer.className).toContain('fixed');
    expect(drawer.className).toContain('inset-y-0');
    expect(drawer.className).toContain('right-0');
    expect(drawer.className).toContain('z-50');
    expect(drawer.className).toContain('w-full');
    expect(drawer.className).toContain('max-w-md');
    expect(drawer.className).toContain('bg-background');
    expect(drawer.className).toContain('shadow-2xl');
    expect(drawer.className).toContain('flex');
    expect(drawer.className).toContain('flex-col');
    expect(drawer.className).toContain('border-l');
    expect(drawer.className).toContain('border-border');
    expect(drawer.className).toContain('animate-in');
    expect(drawer.className).toContain('slide-in-from-right');
    expect(drawer.className).toContain('duration-300');
  });

  it('renders close button in header with hover:bg-accent rounded-full p-2', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
      />
    );

    const closeBtn = screen.getByTestId('close-balcony-drawer');
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn.className).toContain('hover:bg-accent');
    expect(closeBtn.className).toContain('rounded-full');
    expect(closeBtn.className).toContain('p-2');

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('supports closing on overlay click and on Escape key', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
      />
    );

    const overlay = screen.getByTestId('balcony-drawer-overlay');
    fireEvent.click(overlay);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('renders primary button "Przejdź do doboru roślin" with required styling', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();
    const handleSelectPlants = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
        onSelectPlants={handleSelectPlants}
      />
    );

    const primaryBtn = screen.getByRole('button', { name: /Przejdź do doboru roślin/i });
    expect(primaryBtn).toBeInTheDocument();
    expect(primaryBtn.className).toContain('w-full');
    expect(primaryBtn.className).toContain('bg-emerald-600');
    expect(primaryBtn.className).toContain('hover:bg-emerald-700');
    expect(primaryBtn.className).toContain('text-white');
    expect(primaryBtn.className).toContain('font-medium');
    expect(primaryBtn.className).toContain('py-3');
    expect(primaryBtn.className).toContain('rounded-xl');
    expect(primaryBtn.className).toContain('shadow-sm');
    expect(primaryBtn.className).toContain('transition-all');

    fireEvent.click(primaryBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleSelectPlants).toHaveBeenCalledTimes(1);
  });

  it('renders secondary button "Zmień parametry balkonu" with required styling', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
      />
    );

    const secondaryBtn = screen.getByRole('button', { name: /Zmień parametry balkonu/i });
    expect(secondaryBtn).toBeInTheDocument();
    expect(secondaryBtn.className).toContain('w-full');
    expect(secondaryBtn.className).toContain('bg-transparent');
    expect(secondaryBtn.className).toContain('hover:bg-muted');
    expect(secondaryBtn.className).toContain('text-foreground');
    expect(secondaryBtn.className).toContain('py-2.5');
    expect(secondaryBtn.className).toContain('rounded-xl');
    expect(secondaryBtn.className).toContain('border');
    expect(secondaryBtn.className).toContain('border-border');
    expect(secondaryBtn.className).toContain('text-sm');
    expect(secondaryBtn.className).toContain('font-medium');
    expect(secondaryBtn.className).toContain('transition-colors');

    fireEvent.click(secondaryBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleOpenFullSetup).toHaveBeenCalledTimes(1);
  });

  it('does NOT render the redundant bottom button "Zamknij panel"', () => {
    const handleClose = vi.fn();
    const handleOpenFullSetup = vi.fn();

    render(
      <BalconyProfileDrawer
        isOpen={true}
        onClose={handleClose}
        userSpec={mockSpec}
        onOpenFullSetup={handleOpenFullSetup}
      />
    );

    const closeBottomBtn = screen.queryByRole('button', { name: 'Zamknij panel' });
    // Header button aria-label might be Zamknij panel, but check footer does not have a button with exact text
    expect(screen.queryByText('Zamknij panel')).toBeNull();
  });
});
