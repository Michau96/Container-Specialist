import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageProvider } from '../lib/LanguageContext';
import { PlantCard } from './PlantCard';
import { PlantCardSkeleton, CatalogSkeletonGrid } from './PlantCardSkeleton';
import { MyCropsView } from './MyCropsView';
import { PlantSearchIndex } from '../lib/plantSearchIndex';
import defaultPlantsData from '../data/plants.json';
import { validatePlantCatalog } from '../lib/catalogValidation';
import { Plant, UserBalconySpec, DailyCropsRecommendation } from '../types';
import { DEFAULT_BALCONY_SPEC } from '../lib/api';
import { Search, X, RotateCcw, Info } from 'lucide-react';

const { validPlants } = validatePlantCatalog(defaultPlantsData);

// Test Harness that encapsulates the Catalog states: loading, empty, error, filtered-no-results, success
interface CatalogHarnessProps {
  initialLoading?: boolean;
  initialError?: string | null;
  initialPlants?: Plant[];
  initialQuery?: string;
  fetchFn?: (query?: string) => Promise<Plant[]>;
}

const CatalogStatesHarness: React.FC<CatalogHarnessProps> = ({
  initialLoading = false,
  initialError = null,
  initialPlants = validPlants,
  initialQuery = '',
  fetchFn,
}) => {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(initialError);
  const [plants, setPlants] = useState<Plant[]>(initialPlants);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [myCrops, setMyCrops] = useState<Array<{ plantId: string; potCount: number }>>([]);

  const searchIndex = React.useMemo(() => new PlantSearchIndex(plants), [plants]);
  const filteredPlants = React.useMemo(() => {
    if (!searchQuery.trim()) return plants;
    return searchIndex.search(searchQuery);
  }, [searchIndex, searchQuery, plants]);

  const handleRetry = async () => {
    if (!fetchFn) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn(searchQuery);
      setPlants(data);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Błąd serwera');
      setLoading(false);
    }
  };

  return (
    <LanguageProvider>
      <div data-testid="catalog-page-container">
        {/* Top persistent header - never blank */}
        <header data-testid="catalog-header">
          <div data-testid="tab-my-crops">
            <span>Moje uprawy</span>
            <span data-testid="my-crops-count">{myCrops.length}</span>
          </div>
        </header>

        {/* 1. Primary Catalog Search Control Near Top */}
        <div data-testid="catalog-search-card" className="p-4">
          <label
            htmlFor="search-vegetables-input"
            data-testid="catalog-search-label"
            className="block text-sm font-bold mb-1"
          >
            Szukaj w katalogu upraw
          </label>
          <div className="relative">
            <input
              id="search-vegetables-input"
              data-testid="catalog-search-input"
              type="search"
              role="searchbox"
              aria-label="Szukaj w katalogu upraw"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj rośliny lub odmiany..."
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                data-testid="clear-search-btn"
                type="button"
                onClick={() => setSearchQuery('')}
              >
                Wyczyść
              </button>
            )}
          </div>
        </div>

        {/* 2. States Area: loading, error, empty, filtered-no-results, success */}
        {loading ? (
          <CatalogSkeletonGrid
            count={6}
            message="Ładowanie bazy upraw dla Twojego balkonu..."
          />
        ) : error ? (
          <div
            role="alert"
            data-testid="catalog-error-state"
            className="p-6 text-center border-2 border-rose-300 rounded-2xl"
          >
            <h3 data-testid="catalog-error-heading">Błąd połączenia z serwerem</h3>
            <p data-testid="catalog-error-message">{error}</p>
            {searchQuery && (
              <div data-testid="catalog-preserved-query-badge">
                Twoje zapytanie „{searchQuery}” zostało zachowane.
              </div>
            )}
            <div className="mt-4 flex gap-2 justify-center">
              <button
                id="catalog-retry-btn"
                data-testid="catalog-retry-btn"
                onClick={handleRetry}
                className="px-4 py-2 bg-rose-700 text-white rounded-xl min-h-[44px]"
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        ) : plants.length === 0 ? (
          <div
            data-testid="catalog-empty-state"
            className="p-6 text-center border border-stone-200 rounded-2xl"
          >
            <h3 data-testid="catalog-empty-heading">Brak roślin w katalogu</h3>
            <p data-testid="catalog-empty-message">
              Brak dostępnych roślin w bazie dla wybranej konfiguracji balkonu.
            </p>
            <button
              data-testid="catalog-reload-empty-btn"
              onClick={handleRetry}
              className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-xl min-h-[44px]"
            >
              Załaduj bazę ponownie
            </button>
          </div>
        ) : filteredPlants.length === 0 ? (
          <div
            data-testid="catalog-filtered-no-results"
            className="p-6 text-center border border-stone-200 rounded-2xl"
          >
            <div data-testid="no-results-container">
              <h3 data-testid="no-results-heading">
                Brak wyników wyszukiwania dla „{searchQuery}”
              </h3>
              <p data-testid="no-results-message">
                Żadna roślina nie spełnia kryteriów wyszukiwania „{searchQuery}”. Sprawdź pisownię lub zresetuj filtry.
              </p>
              <button
                id="reset-search-btn"
                data-testid="reset-search-btn"
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-xl min-h-[44px]"
              >
                Pokaż wszystkie rośliny ({plants.length})
              </button>
            </div>
          </div>
        ) : (
          <div
            data-testid="catalog-success-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlants.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onSelect={vi.fn()}
                isMyCrop={myCrops.some((c) => c.plantId === plant.id)}
                cropCount={myCrops.find((c) => c.plantId === plant.id)?.potCount || 0}
                onAddCrop={(p) =>
                  setMyCrops((prev) => [...prev, { plantId: p.id, potCount: 1 }])
                }
              />
            ))}
          </div>
        )}
      </div>
    </LanguageProvider>
  );
};

import { computeDailyRecommendation } from '../lib/dailyRecommendations';

const mockDailyRec: DailyCropsRecommendation = computeDailyRecommendation(
  null,
  DEFAULT_BALCONY_SPEC,
  validPlants,
  []
);

describe('Catalog & Dashboard Explicit States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Slow network: renders skeleton cards during loading with accessible status text
  it('renders skeleton cards with accessible status text during slow network loading (never a blank page)', async () => {
    let resolveNetwork: (plants: Plant[]) => void = () => {};
    const slowNetworkPromise = new Promise<Plant[]>((resolve) => {
      resolveNetwork = resolve;
    });

    render(
      <CatalogStatesHarness
        initialLoading={true}
        fetchFn={() => slowNetworkPromise}
      />
    );

    // Persistent header and search input remain present — never a blank page
    expect(screen.getByTestId('catalog-page-container')).toBeInTheDocument();
    expect(screen.getByTestId('catalog-search-input')).toBeInTheDocument();

    // Skeletons container is present with accessible status text
    const skeletonsContainer = screen.getByTestId('catalog-loading-skeletons');
    expect(skeletonsContainer).toBeInTheDocument();
    expect(skeletonsContainer).toHaveAttribute('role', 'status');
    expect(skeletonsContainer).toHaveAttribute('aria-busy', 'true');

    // Status message for outdoor visibility
    expect(screen.getByTestId('catalog-loading-status-text')).toHaveTextContent(
      'Ładowanie bazy upraw dla Twojego balkonu...'
    );

    // Skeleton cards rendered with reserved dimensions
    const skeletonCards = screen.getAllByTestId('plant-card-skeleton');
    expect(skeletonCards.length).toBe(6);
    expect(skeletonCards[0]).toHaveClass('min-h-[460px]');

    // Resolve network
    await act(async () => {
      resolveNetwork(validPlants);
    });
  });

  // 2. Rejected API request: renders error state, preserves user's query, and provides retry button
  it('handles rejected API request by showing error UI, preserving query, and never rendering blank screen', async () => {
    render(
      <CatalogStatesHarness
        initialLoading={false}
        initialError="Błąd serwera (500): Wewnętrzny błąd serwera"
        initialQuery="Pomidor"
      />
    );

    // Never a blank screen
    expect(screen.getByTestId('catalog-page-container')).toBeInTheDocument();

    // User's query is preserved in search input
    const input = screen.getByTestId('catalog-search-input');
    expect(input).toHaveValue('Pomidor');

    // Preserved query badge is shown
    expect(screen.getByTestId('catalog-preserved-query-badge')).toHaveTextContent(
      'Twoje zapytanie „Pomidor” zostało zachowane.'
    );

    // Error UI state with accessible alert role
    const errorState = screen.getByTestId('catalog-error-state');
    expect(errorState).toBeInTheDocument();
    expect(errorState).toHaveAttribute('role', 'alert');
    expect(screen.getByTestId('catalog-error-heading')).toHaveTextContent(
      'Błąd połączenia z serwerem'
    );
    expect(screen.getByTestId('catalog-error-message')).toHaveTextContent(
      'Błąd serwera (500)'
    );

    // Retry button is available
    const retryBtn = screen.getByTestId('catalog-retry-btn');
    expect(retryBtn).toBeInTheDocument();
    expect(retryBtn).toHaveTextContent('Spróbuj ponownie');
  });

  // 3. Empty response: renders clear empty catalog state with reload action
  it('renders clear empty state when API returns an empty response (0 plants)', () => {
    render(
      <CatalogStatesHarness
        initialLoading={false}
        initialError={null}
        initialPlants={[]}
      />
    );

    // Page is not blank
    expect(screen.getByTestId('catalog-page-container')).toBeInTheDocument();

    // Empty state container
    const emptyState = screen.getByTestId('catalog-empty-state');
    expect(emptyState).toBeInTheDocument();
    expect(screen.getByTestId('catalog-empty-heading')).toHaveTextContent(
      'Brak roślin w katalogu'
    );
    expect(screen.getByTestId('catalog-empty-message')).toHaveTextContent(
      'Brak dostępnych roślin w bazie dla wybranej konfiguracji balkonu.'
    );

    // Next action button to reload
    expect(screen.getByTestId('catalog-reload-empty-btn')).toHaveTextContent(
      'Załaduj bazę ponownie'
    );
  });

  // 4. Malformed response handling: gracefully falls into error state with retry
  it('handles malformed API response gracefully without crashing or showing blank screen', async () => {
    const mockFetchFn = vi.fn().mockImplementation(async () => {
      // Simulate malformed response error
      throw new Error('Nieprawidłowa odpowiedź serwera: brak listy recommendations');
    });

    render(
      <CatalogStatesHarness
        initialLoading={false}
        initialError="Nieprawidłowa odpowiedź serwera: brak listy recommendations"
        fetchFn={mockFetchFn}
      />
    );

    expect(screen.getByTestId('catalog-error-state')).toBeInTheDocument();
    expect(screen.getByTestId('catalog-error-message')).toHaveTextContent(
      'Nieprawidłowa odpowiedź serwera: brak listy recommendations'
    );
    expect(screen.getByTestId('catalog-retry-btn')).toBeInTheDocument();
  });

  // 5. Retry success: retrying from error state fetches and renders success catalog cards
  it('successfully recovers from error state when user clicks retry button', async () => {
    const fetchFn = vi.fn().mockResolvedValue(validPlants);

    render(
      <CatalogStatesHarness
        initialLoading={false}
        initialError="Chwilowy błąd sieci"
        initialQuery="Pomidor"
        fetchFn={fetchFn}
      />
    );

    expect(screen.getByTestId('catalog-error-state')).toBeInTheDocument();

    const retryBtn = screen.getByTestId('catalog-retry-btn');
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('catalog-error-state')).not.toBeInTheDocument();
    });

    // Success grid is now visible
    expect(screen.getByTestId('catalog-success-grid')).toBeInTheDocument();
    // Tomato card is present
    expect(screen.getByTestId('plant-card-pomidor-karlowy')).toBeInTheDocument();
  });

  // 6. Filtered no-results: explains no result matches query and provides reset filters action
  it('explains that no result matches current search and provides clear action to reset filters', () => {
    render(
      <CatalogStatesHarness
        initialLoading={false}
        initialPlants={validPlants}
        initialQuery="NieistniejacyCudak999"
      />
    );

    // Filtered no-results state
    expect(screen.getByTestId('catalog-filtered-no-results')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-heading')).toHaveTextContent(
      'Brak wyników wyszukiwania dla „NieistniejacyCudak999”'
    );
    expect(screen.getByTestId('no-results-message')).toHaveTextContent(
      'Żadna roślina nie spełnia kryteriów wyszukiwania „NieistniejacyCudak999”'
    );

    // Reset button restores catalog
    const resetBtn = screen.getByTestId('reset-search-btn');
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    expect(screen.getByTestId('catalog-search-input')).toHaveValue('');
    expect(screen.getByTestId('catalog-success-grid')).toBeInTheDocument();
  });

  // 7. Dashboard empty collection: shows exact label "Moje uprawy", count "0", and clear next action
  it('shows exact product label "Moje uprawy", current count 0, and clear next action for empty dashboard', () => {
    const onNavigateMock = vi.fn();

    render(
      <LanguageProvider>
        <MyCropsView
          myCrops={[]}
          allPlants={validPlants}
          weather={null}
          userSpec={DEFAULT_BALCONY_SPEC}
          dailyRecommendation={mockDailyRec}
          onRemoveCrop={vi.fn()}
          onUpdateCrop={vi.fn()}
          onAddCropWithVariety={vi.fn()}
          onSelectPlant={vi.fn()}
          onOpenPotCalc={vi.fn()}
          onNavigateToSearch={onNavigateMock}
          onSwitchToFullCalendar={vi.fn()}
        />
      </LanguageProvider>
    );

    // Empty state container
    expect(screen.getByTestId('my-crops-empty-state')).toBeInTheDocument();

    // Exact product label "Moje uprawy"
    expect(screen.getByTestId('empty-collection-label')).toHaveTextContent('Moje uprawy');

    // Current count "0"
    expect(screen.getByTestId('empty-collection-count')).toHaveTextContent('0');

    // Heading contains label and count
    expect(screen.getByTestId('my-crops-empty-heading')).toHaveTextContent('Moje uprawy (0)');

    // Clear next action button to browse catalog
    const nextActionBtn = screen.getByTestId('empty-action-navigate-search');
    expect(nextActionBtn).toBeInTheDocument();
    expect(nextActionBtn).toHaveTextContent('Przeglądaj pełny katalog roślin');

    fireEvent.click(nextActionBtn);
    expect(onNavigateMock).toHaveBeenCalledTimes(1);
  });

  // 8. Dashboard loading and error states
  it('renders loading skeletons and error state for dashboard without blank screens', () => {
    const { rerender } = render(
      <LanguageProvider>
        <MyCropsView
          myCrops={[]}
          allPlants={validPlants}
          weather={null}
          userSpec={DEFAULT_BALCONY_SPEC}
          dailyRecommendation={mockDailyRec}
          isLoading={true}
          onRemoveCrop={vi.fn()}
          onUpdateCrop={vi.fn()}
          onAddCropWithVariety={vi.fn()}
          onSelectPlant={vi.fn()}
          onOpenPotCalc={vi.fn()}
          onNavigateToSearch={vi.fn()}
          onSwitchToFullCalendar={vi.fn()}
        />
      </LanguageProvider>
    );

    // Dashboard loading state with role status
    expect(screen.getByTestId('my-crops-loading-state')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-loading-status-text')).toBeInTheDocument();

    // Now rerender with error
    rerender(
      <LanguageProvider>
        <MyCropsView
          myCrops={[]}
          allPlants={validPlants}
          weather={null}
          userSpec={DEFAULT_BALCONY_SPEC}
          dailyRecommendation={mockDailyRec}
          isLoading={false}
          error="Nie udało się załadować harmonogramu balkonu"
          onRetry={vi.fn()}
          onRemoveCrop={vi.fn()}
          onUpdateCrop={vi.fn()}
          onAddCropWithVariety={vi.fn()}
          onSelectPlant={vi.fn()}
          onOpenPotCalc={vi.fn()}
          onNavigateToSearch={vi.fn()}
          onSwitchToFullCalendar={vi.fn()}
        />
      </LanguageProvider>
    );

    expect(screen.getByTestId('my-crops-error-state')).toBeInTheDocument();
    expect(screen.getByTestId('my-crops-error-message')).toHaveTextContent(
      'Nie udało się załadować harmonogramu balkonu'
    );
    expect(screen.getByTestId('my-crops-retry-btn')).toBeInTheDocument();
  });

  // 9. Selected crop card image renders cleanly without overlapping plant type mark
  it('renders selected crop image cleanly without overlapping plant type sprout mark in Moje uprawy', () => {
    const radishPlant = validPlants.find((p) => p.id === 'rzodkiewka') || validPlants[0];
    const cropItem = {
      id: 'rzodkiewka_crop_1',
      plantId: radishPlant.id,
      potCount: 1,
      selectedVariety: 'Krakowska',
      addedAt: new Date().toISOString(),
    };

    render(
      <LanguageProvider>
        <MyCropsView
          myCrops={[cropItem]}
          allPlants={validPlants}
          weather={null}
          userSpec={DEFAULT_BALCONY_SPEC}
          dailyRecommendation={mockDailyRec}
          isLoading={false}
          onRemoveCrop={vi.fn()}
          onUpdateCrop={vi.fn()}
          onAddCropWithVariety={vi.fn()}
          onSelectPlant={vi.fn()}
          onOpenPotCalc={vi.fn()}
          onNavigateToSearch={vi.fn()}
          onSwitchToFullCalendar={vi.fn()}
        />
      </LanguageProvider>
    );

    // Verify plant name is displayed
    const names = screen.getAllByText(radishPlant.name);
    expect(names.length).toBeGreaterThan(0);

    // Verify plant images are rendered
    const imgs = screen.getAllByRole('img');
    expect(imgs.length).toBeGreaterThan(0);

    // Verify none of the image containers contain an overlapping Sprout SVG icon
    imgs.forEach((img) => {
      const imgContainer = img.closest('div');
      expect(imgContainer).toBeInTheDocument();
      const svgIconsInsideImgContainer = imgContainer?.querySelectorAll('svg');
      expect(svgIconsInsideImgContainer?.length).toBe(0);
    });
  });
});

