import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PotConfigurationStep } from './PotConfigurationStep';

describe('PotConfigurationStep Component', () => {
  it('renders input fields with exact labels and required numerical attributes (min=5, max=300, step=1, type=number)', () => {
    render(<PotConfigurationStep initialLength="60" initialWidth="20" initialDepth="18" />);

    // Labels check
    expect(screen.getByLabelText('Długość (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Szerokość (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Głębokość (cm)')).toBeInTheDocument();

    const lengthInput = screen.getByTestId('pot-length-input');
    const widthInput = screen.getByTestId('pot-width-input');
    const depthInput = screen.getByTestId('pot-depth-input');

    // Attribute validation
    [lengthInput, widthInput, depthInput].forEach((input) => {
      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('min', '5');
      expect(input).toHaveAttribute('max', '300');
      expect(input).toHaveAttribute('step', '1');
    });

    expect(lengthInput).toHaveValue(60);
    expect(widthInput).toHaveValue(20);
    expect(depthInput).toHaveValue(18);
  });

  it('calculates volume strictly using Math.round((l * w * d) / 1000) and renders live calculation badge', () => {
    render(<PotConfigurationStep initialLength="60" initialWidth="20" initialDepth="18" />);

    // (60 * 20 * 18) / 1000 = 21.6 -> Math.round -> 22 L
    const badge = screen.getByTestId('pot-volume-live-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('🪴 Szacowana objętość: 22 L podłoża');
    expect(badge.className).toContain('mt-2');
    expect(badge.className).toContain('inline-flex');
    expect(badge.className).toContain('items-center');
    expect(badge.className).toContain('bg-emerald-50');
    expect(badge.className).toContain('text-emerald-800');
    expect(badge.className).toContain('border-emerald-200');
  });

  it('updates live calculation badge dynamically as inputs change', () => {
    render(<PotConfigurationStep initialLength="60" initialWidth="20" initialDepth="18" />);

    const lengthInput = screen.getByTestId('pot-length-input');
    const widthInput = screen.getByTestId('pot-width-input');
    const depthInput = screen.getByTestId('pot-depth-input');

    // Change to 100 x 30 x 25 = 75,000 / 1000 = 75 L
    fireEvent.change(lengthInput, { target: { value: '100' } });
    fireEvent.change(widthInput, { target: { value: '30' } });
    fireEvent.change(depthInput, { target: { value: '25' } });

    const badge = screen.getByTestId('pot-volume-live-badge');
    expect(badge).toHaveTextContent('🪴 Szacowana objętość: 75 L podłoża');
  });

  it('hides live badge when any dimension is <= 0 or invalid', () => {
    render(<PotConfigurationStep initialLength="60" initialWidth="20" initialDepth="18" />);

    const lengthInput = screen.getByTestId('pot-length-input');

    // Set length to 0
    fireEvent.change(lengthInput, { target: { value: '0' } });
    expect(screen.queryByTestId('pot-volume-live-badge')).not.toBeInTheDocument();

    // Set length to negative
    fireEvent.change(lengthInput, { target: { value: '-10' } });
    expect(screen.queryByTestId('pot-volume-live-badge')).not.toBeInTheDocument();

    // Set length to empty string
    fireEvent.change(lengthInput, { target: { value: '' } });
    expect(screen.queryByTestId('pot-volume-live-badge')).not.toBeInTheDocument();
  });

  it('invokes onDimensionsChange callback with strictly validated values', () => {
    const handleDimensionsChange = vi.fn();

    render(
      <PotConfigurationStep
        initialLength="80"
        initialWidth="25"
        initialDepth="20"
        onDimensionsChange={handleDimensionsChange}
      />
    );

    // Initial render callback: (80 * 25 * 20) / 1000 = 40 L
    expect(handleDimensionsChange).toHaveBeenCalledWith({
      length: 80,
      width: 25,
      depth: 20,
      volumeInLiters: 40,
    });
  });
});
