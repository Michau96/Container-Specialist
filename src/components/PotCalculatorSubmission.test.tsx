import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PotCalculator } from './PotCalculator';
import { LanguageProvider } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { Plant } from '../types';
import { POT_CALCULATION_VERSION } from '../lib/potCalculations';
import { PotCalculationSubmitPayload } from '../types/potCalculationContract';

const defaultPlants = defaultPlantsData as unknown as Plant[];

describe('PotCalculator - Submit Contract, Idempotency, Errors, Timeout & Navigation', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
    global.fetch = originalFetch;
  });

  const renderCalculator = (props: Partial<React.ComponentProps<typeof PotCalculator>> = {}) => {
    return render(
      <LanguageProvider>
        <PotCalculator
          plants={defaultPlants}
          initialPlant={defaultPlants[0]}
          {...props}
        />
      </LanguageProvider>
    );
  };

  // 1. DISABLED STATE
  it('disables the CTA when calculation result is invalid (e.g., zero or non-positive dimensions)', () => {
    renderCalculator();

    // Navigate to dimensions step
    fireEvent.click(screen.getByText('Dalej: Wymiary'));

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    // Initially valid (60x20x20 = 24L)
    expect(submitBtn).not.toBeDisabled();

    // Set slider to 0 (invalid)
    const lengthSlider = screen.getByTestId('pot-slider-length');
    fireEvent.change(lengthSlider, { target: { value: '0' } });

    // Button should now be disabled
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveAttribute('aria-disabled', 'true');
    expect(submitBtn.className).toContain('disabled:opacity-50');

    // Restore valid dimension
    fireEvent.change(lengthSlider, { target: { value: '50' } });
    expect(submitBtn).not.toBeDisabled();
  });

  // 2. EXPLICIT SUBMIT CONTRACT & PERSISTENCE OF COMPLETE PAYLOAD
  it('submits explicit payload with dimensions, shape, material, formula version, result values, timestamp, and idempotency key', async () => {
    let capturedBody: PotCalculationSubmitPayload | null = null;

    global.fetch = vi.fn().mockImplementation((url, init) => {
      if (url === '/api/pot-calculations') {
        capturedBody = JSON.parse(init.body as string);
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            idempotencyKey: capturedBody?.idempotencyKey,
            savedAt: new Date().toISOString(),
            calculation: capturedBody,
          }),
        });
      }
      return Promise.reject(new Error('Unknown url'));
    });

    renderCalculator();

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    expect(submitBtn).toHaveTextContent('Oblicz');

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    });

    expect(capturedBody).not.toBeNull();
    // Verify explicit contract fields
    expect(capturedBody!.idempotencyKey).toMatch(/^pot_calc_v/);
    expect(capturedBody!.plantId).toBe('pomidor-karlowy');
    expect(capturedBody!.shape).toBe('rectangular');
    expect(capturedBody!.material).toBe('plastic');
    expect(capturedBody!.formulaVersion).toBe(POT_CALCULATION_VERSION);
    expect(capturedBody!.dimensions).toEqual({
      lengthCm: 60,
      widthCm: 20,
      heightCm: 20,
      diameterCm: undefined,
      unit: 'cm',
    });
    expect(capturedBody!.resultValues).toBeDefined();
    expect(capturedBody!.resultValues.grossVolumeL).toBe(24);
    expect(capturedBody!.resultValues.calculationVersion).toBe(POT_CALCULATION_VERSION);
    expect(capturedBody!.timestamp).toBeDefined();

    // Verify localStorage has persisted payload
    const stored = JSON.parse(localStorage.getItem('doniczkowy_calculator_state')!);
    expect(stored.savedPayload).toBeDefined();
    expect(stored.savedPayload.idempotencyKey).toBe(capturedBody!.idempotencyKey);
    expect(stored.isSuccess).toBe(true);
  });

  // 3. IDEMPOTENCY KEY PREVENTS DUPLICATE SUBMISSIONS ON REPEATED CLICKS & RETRIES
  it('uses an idempotency key to prevent duplicate records on repeated clicks or network retries', async () => {
    const fetchMock = vi.fn().mockImplementation((url, init) => {
      const body = JSON.parse(init.body as string);
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          idempotencyKey: body.idempotencyKey,
          savedAt: new Date().toISOString(),
          deduplicated: false,
          calculation: body,
        }),
      });
    });
    global.fetch = fetchMock;

    renderCalculator();

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    // First click
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const firstCallBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    const key1 = firstCallBody.idempotencyKey;
    expect(key1).toBeTruthy();

    // Re-click: button uses same configuration, key remains consistent
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
    const secondCallBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(secondCallBody.idempotencyKey).toBe(key1);
  });

  // 4. TIMEOUT HANDLING
  it('handles request timeout gracefully, preserving entered values and offering retry', async () => {
    global.fetch = vi.fn().mockImplementation((_url, init) => {
      return new Promise((_resolve, reject) => {
        // When signal is aborted, reject with AbortError
        if (init?.signal) {
          init.signal.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        }
      });
    });

    // Pass small requestTimeoutMs (50ms) to trigger timeout in test
    renderCalculator({ requestTimeoutMs: 50 });

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent(/timeout/i);
    });

    // Success banner must not be shown
    expect(screen.queryByTestId('pot-calculator-success')).not.toBeInTheDocument();

    // Values are preserved and retry button is available
    expect(screen.getByText('Ponów próbę')).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  // 5. HTTP 4xx ERROR HANDLING
  it('handles HTTP 4xx error (e.g. 400/422), preserving entered values with retry button', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ error: 'Niepoprawne dane wejściowe kalkulacji (422).' }),
    });

    renderCalculator();

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
      expect(errorAlert).toHaveTextContent('Niepoprawne dane wejściowe kalkulacji (422).');
    });

    // Form inputs and retry are preserved
    expect(screen.getByText('Ponów próbę')).toBeInTheDocument();
    expect(screen.queryByTestId('pot-calculator-success')).not.toBeInTheDocument();
  });

  // 6. HTTP 5xx ERROR HANDLING AND RETRY SUCCESS
  it('handles HTTP 5xx error, preserves inputs, and successfully resolves upon retry', async () => {
    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: async () => ({ error: 'Wewnętrzny błąd serwera (500).' }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          idempotencyKey: 'test_key',
          savedAt: new Date().toISOString(),
        }),
      });
    });

    renderCalculator();

    const submitBtn = screen.getByTestId('pot-calculator-submit');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Wewnętrzny błąd serwera (500).');
    });
    expect(screen.getByText('Ponów próbę')).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByText('Ponów próbę'));

    await waitFor(() => {
      expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    });
    expect(screen.queryByText('Wewnętrzny błąd serwera (500).')).not.toBeInTheDocument();
  });

  // 7. REFRESH AFTER SAVE (LOAD FROM PERSISTED STORAGE)
  it('restores complete saved result, confirmation banner, and summary after refresh/remount', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    // First session: calculate and save
    const { unmount } = renderCalculator();
    fireEvent.click(screen.getByTestId('pot-calculator-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    });

    // Unmount to simulate page refresh / close
    unmount();

    // Re-mount (page refresh)
    renderCalculator();

    // Results and confirmation are restored immediately from storage
    expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    expect(screen.getByText('Obliczenia wykonane pomyślnie! Parametry zostały zachowane.')).toBeInTheDocument();
    expect(screen.getByText('Objętość donicy')).toBeInTheDocument();
    expect(screen.getAllByText('24 l').length).toBeGreaterThanOrEqual(1);
  });

  // 8. BROWSER BACK NAVIGATION
  it('handles browser back navigation via popstate event without resetting data', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    renderCalculator();

    // Submit to step 4
    fireEvent.click(screen.getByTestId('pot-calculator-submit'));
    await waitFor(() => {
      expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    });

    // Trigger browser back popstate event
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    // State remains preserved and intact
    expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    expect(screen.getByText('Krok 4: Wynik, makieta i weryfikacja wymogów')).toBeInTheDocument();
  });

  // 9. RE-ENTERING CALCULATOR & EXPLICIT RESET
  it('loads saved results consistently upon re-entry, and resets only on explicit reset', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const { unmount } = renderCalculator();

    // Go to dimensions step and configure custom dimensions 70x25x22
    fireEvent.click(screen.getByText('Dalej: Wymiary'));
    fireEvent.change(screen.getByTestId('pot-slider-length'), { target: { value: '70' } });
    fireEvent.change(screen.getByTestId('pot-slider-width'), { target: { value: '25' } });

    fireEvent.click(screen.getByTestId('pot-calculator-submit'));

    await waitFor(() => {
      expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();
    });

    // Re-enter calculator
    unmount();
    renderCalculator();

    // Saved state is consistently loaded
    expect(screen.getByTestId('pot-calculator-success')).toBeInTheDocument();

    // Verify 70 cm length is maintained
    fireEvent.click(screen.getByText('Krok 2: Wymiary'));
    expect(screen.getByTestId('pot-slider-length')).toHaveValue('70');
    expect(screen.getByTestId('pot-slider-width')).toHaveValue('25');

    // Explicit reset clears saved state and returns to step 1
    const resetBtn = screen.getByTestId('pot-calculator-reset');
    fireEvent.click(resetBtn);

    expect(screen.queryByTestId('pot-calculator-success')).not.toBeInTheDocument();
    expect(screen.getByText('Krok 1: Konfiguracja donicy i rośliny')).toBeInTheDocument();
    const resetStored = JSON.parse(localStorage.getItem('doniczkowy_calculator_state')!);
    expect(resetStored.isSuccess).toBe(false);
    expect(resetStored.step).toBe(1);
    expect(resetStored.lengthCm).toBe(60);
  });
});
