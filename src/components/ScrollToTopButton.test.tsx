import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ScrollToTopButton } from './ScrollToTopButton';

describe('ScrollToTopButton Component', () => {
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
    render(<ScrollToTopButton />);

    expect(screen.queryByTestId('scroll-to-top-btn')).not.toBeInTheDocument();
  });

  it('becomes visible when window.scrollY > 400', () => {
    const { rerender } = render(<ScrollToTopButton />);
    expect(screen.queryByTestId('scroll-to-top-btn')).not.toBeInTheDocument();

    // Scroll past threshold of 400px
    window.scrollY = 450;
    fireEvent.scroll(window);

    const btn = screen.getByTestId('scroll-to-top-btn');
    expect(btn).toBeInTheDocument();
  });

  it('hides again when scrolling back up (scrollY <= 400)', () => {
    window.scrollY = 500;
    render(<ScrollToTopButton />);

    expect(screen.getByTestId('scroll-to-top-btn')).toBeInTheDocument();

    window.scrollY = 350;
    fireEvent.scroll(window);

    expect(screen.queryByTestId('scroll-to-top-btn')).not.toBeInTheDocument();
  });

  it('renders exact requested styling classes and upward arrow icon', () => {
    render(<ScrollToTopButton forceVisible />);

    const btn = screen.getByTestId('scroll-to-top-btn');
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('fixed');
    expect(btn.className).toContain('bottom-6');
    expect(btn.className).toContain('right-6');
    expect(btn.className).toContain('z-40');
    expect(btn.className).toContain('p-3');
    expect(btn.className).toContain('bg-emerald-600');
    expect(btn.className).toContain('hover:bg-emerald-700');
    expect(btn.className).toContain('text-white');
    expect(btn.className).toContain('rounded-full');
    expect(btn.className).toContain('shadow-lg');
    expect(btn.className).toContain('transition-all');
    expect(btn.className).toContain('duration-300');

    // Upward arrow icon
    const icon = btn.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('maintains touch target >= 44x44px for accessibility', () => {
    render(<ScrollToTopButton forceVisible />);

    const btn = screen.getByTestId('scroll-to-top-btn');
    expect(btn.className).toContain('min-w-[44px]');
    expect(btn.className).toContain('min-h-[44px]');
  });

  it('triggers smooth scrolling to top ({ top: 0, behavior: "smooth" }) on click', () => {
    render(<ScrollToTopButton forceVisible />);

    const btn = screen.getByTestId('scroll-to-top-btn');
    fireEvent.click(btn);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
