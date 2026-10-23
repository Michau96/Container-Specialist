import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BackToTopButton, BackToTop } from './BackToTop';

describe('BackToTop and BackToTopButton Component', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    window.scrollTo = vi.fn();
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
    vi.restoreAllMocks();
  });

  it('is initially hidden when scrollY <= 400', () => {
    window.scrollY = 0;
    render(<BackToTopButton />);

    expect(screen.queryByLabelText('Wróć do góry')).not.toBeInTheDocument();
  });

  it('becomes visible when window.scrollY > 400', () => {
    render(<BackToTopButton />);
    expect(screen.queryByLabelText('Wróć do góry')).not.toBeInTheDocument();

    window.scrollY = 450;
    fireEvent.scroll(window);

    const btn = screen.getByLabelText('Wróć do góry');
    expect(btn).toBeInTheDocument();
  });

  it('hides again when scrolling back up (scrollY <= 400)', () => {
    window.scrollY = 500;
    render(<BackToTopButton />);

    expect(screen.getByLabelText('Wróć do góry')).toBeInTheDocument();

    window.scrollY = 350;
    fireEvent.scroll(window);

    expect(screen.queryByLabelText('Wróć do góry')).not.toBeInTheDocument();
  });

  it('renders exact requested Tailwind styling classes and ChevronUp icon', () => {
    render(<BackToTopButton forceVisible />);

    const btn = screen.getByLabelText('Wróć do góry');
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('fixed');
    expect(btn.className).toContain('bottom-6');
    expect(btn.className).toContain('right-6');
    expect(btn.className).toContain('z-40');
    expect(btn.className).toContain('p-3');
    expect(btn.className).toContain('bg-zinc-900');
    expect(btn.className).toContain('text-white');
    expect(btn.className).toContain('rounded-full');
    expect(btn.className).toContain('shadow-lg');
    expect(btn.className).toContain('hover:bg-zinc-800');
    expect(btn.className).toContain('transition-all');
    expect(btn.className).toContain('hover:scale-105');
    expect(btn.className).toContain('active:scale-95');
    expect(btn.className).toContain('focus:ring-2');
    expect(btn.className).toContain('focus:ring-emerald-500');

    // ChevronUp icon
    const icon = btn.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('w-5');
    expect(icon).toHaveClass('h-5');
  });

  it('triggers smooth scroll behavior window.scrollTo({ top: 0, behavior: "smooth" }) on click', () => {
    render(<BackToTop forceVisible />);

    const btn = screen.getByLabelText('Wróć do góry');
    fireEvent.click(btn);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('satisfies accessible touch target >= 44x44px', () => {
    render(<BackToTopButton forceVisible />);

    const btn = screen.getByLabelText('Wróć do góry');
    expect(btn.className).toContain('min-w-[44px]');
    expect(btn.className).toContain('min-h-[44px]');
  });
});
