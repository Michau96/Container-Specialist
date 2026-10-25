import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantCard } from './PlantCard';
import { PlantSearchIndex } from '../lib/plantSearchIndex';
import defaultPlantsData from '../data/plants.json';
import { validatePlantCatalog } from '../lib/catalogValidation';
import { Plant } from '../types';
import { LanguageProvider } from '../lib/LanguageContext';
import { Search, X, ArrowRight } from 'lucide-react';

const { validPlants } = validatePlantCatalog(defaultPlantsData);

// Test component simulating the Catalog Search-To-Add flow exactly as wired in App.tsx
const CatalogSearchFlowHarness: React.FC<{
  initialQuery?: string;
  simulateErrorOnAdd?: boolean;
}> = ({ initialQuery = '', simulateErrorOnAdd = false }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [myCrops, setMyCrops] = useState<Array<{ plantId: string; potCount: number }>>([]);
  const [addingPlantId, setAddingPlantId] = useState<string | null>(null);
  const pendingPlantAddsRef = React.useRef<Set<string>>(new Set());
  const [simulateError, setSimulateError] = useState(simulateErrorOnAdd);
  const [addFeedback, setAddFeedback] = useState<{
    type: 'success' | 'duplicate' | 'error';
    message: string;
    plantName: string;
    plantId: string;
  } | null>(null);

  const searchIndex = React.useMemo(() => new PlantSearchIndex(validPlants), []);
  const filteredPlants = React.useMemo(() => {
    return searchIndex.search(searchQuery);
  }, [searchIndex, searchQuery]);

  const handleAddCrop = async (plant: Plant, forceError?: boolean) => {
    if (pendingPlantAddsRef.current.has(plant.id) || addingPlantId === plant.id) return; // Prevent multiple submissions while pending

    pendingPlantAddsRef.current.add(plant.id);
    setAddingPlantId(plant.id);
    try {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 50));

      const shouldFail = forceError !== undefined ? forceError : simulateError;
      if (shouldFail) {
        throw new Error('Simulated add failure');
      }

      const existingIndex = myCrops.findIndex((c) => c.plantId === plant.id);
      const isAlreadyInCrops = existingIndex >= 0;

      if (isAlreadyInCrops) {
        setMyCrops((prev) =>
          prev.map((c) => (c.plantId === plant.id ? { ...c, potCount: c.potCount + 1 } : c))
        );
      } else {
        setMyCrops((prev) => [...prev, { plantId: plant.id, potCount: 1 }]);
      }

      setAddFeedback({
        type: isAlreadyInCrops ? 'duplicate' : 'success',
        message: isAlreadyInCrops
          ? `Dodano kolejną doniczkę: ${plant.name}`
          : `Pomyślnie dodano: ${plant.name} do Moich upraw!`,
        plantName: plant.name,
        plantId: plant.id,
      });
    } catch (err) {
      setAddFeedback({
        type: 'error',
        message: `Nie udało się dodać ${plant.name}. Spróbuj ponownie.`,
        plantName: plant.name,
        plantId: plant.id,
      });
    } finally {
      pendingPlantAddsRef.current.delete(plant.id);
      setAddingPlantId(null);
    }
  };

  return (
    <LanguageProvider>
      <div>
        {/* Header simulation with counter */}
        <header>
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
            <Search data-testid="search-icon" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-vegetables-input"
              data-testid="catalog-search-input"
              type="search"
              role="searchbox"
              aria-label="Szukaj w katalogu upraw"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                }
              }}
              placeholder="Szukaj rośliny lub odmiany (np. pomidor, Vilma, rzodkiewka)..."
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

          {/* Result count and query context */}
          {searchQuery.trim() && (
            <div data-testid="search-results-context">
              <span>Wyniki dla zapytania „{searchQuery}”: </span>
              <span data-testid="search-results-count">{filteredPlants.length} roślin</span>
            </div>
          )}
        </div>

        {/* Feedback Banner */}
        {addFeedback && (
          <div data-testid="add-crop-feedback-banner" role="status">
            <p data-testid="add-crop-feedback-message">{addFeedback.message}</p>
            {addFeedback.type === 'error' ? (
              <button
                data-testid="add-crop-retry-btn"
                onClick={() => {
                  const p = validPlants.find((x) => x.id === addFeedback.plantId);
                  if (p) {
                    setSimulateError(false);
                    handleAddCrop(p, false);
                  }
                }}
              >
                Spróbuj ponownie
              </button>
            ) : (
              <button data-testid="go-to-my-crops-btn">
                Przejdź do Moich upraw ({myCrops.length})
              </button>
            )}
            <button data-testid="close-feedback-btn" onClick={() => setAddFeedback(null)}>
              Zamknij
            </button>
          </div>
        )}

        {/* Plant Cards Grid or Empty State */}
        {filteredPlants.length > 0 ? (
          <div data-testid="plants-grid">
            {filteredPlants.map((plant) => {
              const crop = myCrops.find((c) => c.plantId === plant.id);
              return (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onSelect={vi.fn()}
                  isMyCrop={Boolean(crop)}
                  cropCount={crop?.potCount || 0}
                  onAddCrop={handleAddCrop}
                  isAdding={addingPlantId === plant.id}
                />
              );
            })}
          </div>
        ) : (
          <div data-testid="no-results-container">
            <h3 data-testid="no-results-heading">
              Brak wyników wyszukiwania dla „{searchQuery}”
            </h3>
            <p data-testid="no-results-message">
              Żadna roślina nie odpowiada zapytaniu „{searchQuery}”.
            </p>
            <button data-testid="reset-search-btn" onClick={() => setSearchQuery('')}>
              Pokaż wszystkie rośliny
            </button>
          </div>
        )}
      </div>
    </LanguageProvider>
  );
};

describe('Catalog Search-to-Add User Flow (Complete State Coverage)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. Search control attributes & keyboard support
  it('renders primary search control near top with label, placeholder, icon, and clear button', () => {
    render(<CatalogSearchFlowHarness />);

    const label = screen.getByTestId('catalog-search-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Szukaj w katalogu upraw');

    const input = screen.getByTestId('catalog-search-input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('role', 'searchbox');
    expect(input).toHaveAttribute('placeholder', expect.stringContaining('Szukaj rośliny'));
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();

    // No clear button initially
    expect(screen.queryByTestId('clear-search-btn')).not.toBeInTheDocument();

    // Type query
    fireEvent.change(input, { target: { value: 'Pomidor' } });
    expect(screen.getByTestId('clear-search-btn')).toBeInTheDocument();

    // Test Escape keyboard support to clear
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(input).toHaveValue('');
    expect(screen.queryByTestId('clear-search-btn')).not.toBeInTheDocument();
  });

  // 2. Result count and query context after searching
  it('displays result count and query context after searching', () => {
    render(<CatalogSearchFlowHarness />);
    const input = screen.getByTestId('catalog-search-input');

    fireEvent.change(input, { target: { value: 'Pomidor' } });

    const contextEl = screen.getByTestId('search-results-context');
    expect(contextEl).toBeInTheDocument();
    expect(contextEl).toHaveTextContent('Wyniki dla zapytania „Pomidor”:');
    expect(screen.getByTestId('search-results-count')).toBeInTheDocument();
  });

  // 3. Empty state with helpful next action
  it('provides a clear empty state with a helpful next action when no plant matches', () => {
    render(<CatalogSearchFlowHarness />);
    const input = screen.getByTestId('catalog-search-input');

    fireEvent.change(input, { target: { value: 'NieistniejacaRoslina123' } });

    expect(screen.getByTestId('no-results-container')).toBeInTheDocument();
    expect(screen.getByTestId('no-results-heading')).toHaveTextContent('Brak wyników wyszukiwania');
    expect(screen.getByTestId('no-results-message')).toBeInTheDocument();

    // Helpful next action resets search
    const resetBtn = screen.getByTestId('reset-search-btn');
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    // Catalog is restored
    expect(input).toHaveValue('');
    expect(screen.getByTestId('plants-grid')).toBeInTheDocument();
  });

  // 4. Success state: adds plant and updates Moje uprawy count without full page reload
  it('adds plant, shows success confirmation, and updates Moje uprawy count', async () => {
    render(<CatalogSearchFlowHarness initialQuery="Pomidor" />);

    expect(screen.getByTestId('my-crops-count')).toHaveTextContent('0');

    const addBtn = screen.getByTestId('plant-add-btn-pomidor-karlowy');
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent('Dodaj do balkonu');

    await act(async () => {
      fireEvent.click(addBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-crop-feedback-banner')).toBeInTheDocument();
    });

    expect(screen.getByTestId('add-crop-feedback-message')).toHaveTextContent('Pomyślnie dodano: Pomidor karłowy koktajlowy do Moich upraw!');
    expect(screen.getByTestId('my-crops-count')).toHaveTextContent('1');

    // Button label updates to indicate it is now in crops
    expect(screen.getByTestId('plant-add-btn-pomidor-karlowy')).toHaveTextContent('W uprawach');
  });

  // 5. Loading / pending state: prevents multiple submissions while add request is pending
  it('prevents multiple submissions and shows pending state while add request is pending', async () => {
    render(<CatalogSearchFlowHarness initialQuery="Pomidor" />);

    const addBtn = screen.getByTestId('plant-add-btn-pomidor-karlowy');

    await act(async () => {
      fireEvent.click(addBtn);
      // Immediately try to click again while pending
      fireEvent.click(addBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-crop-feedback-banner')).toBeInTheDocument();
    });

    // Should only have been added once
    expect(screen.getByTestId('my-crops-count')).toHaveTextContent('1');
  });

  // 6. Duplicate-add state: shows duplicate feedback and updates count
  it('handles duplicate-add by updating count and showing clear feedback', async () => {
    render(<CatalogSearchFlowHarness initialQuery="Pomidor" />);

    const addBtn = screen.getByTestId('plant-add-btn-pomidor-karlowy');

    // First add
    await act(async () => {
      fireEvent.click(addBtn);
    });
    await waitFor(() => {
      expect(screen.getByTestId('my-crops-count')).toHaveTextContent('1');
    });

    // Second add (duplicate / add another pot)
    await act(async () => {
      fireEvent.click(addBtn);
    });
    await waitFor(() => {
      expect(screen.getByTestId('add-crop-feedback-message')).toHaveTextContent('Dodano kolejną doniczkę');
    });

    expect(screen.getByTestId('plant-add-btn-pomidor-karlowy')).toHaveTextContent('2x');
  });

  // 7. Error state & Retry state: shows error banner and allows retry
  it('handles error state and allows user to retry adding the crop', async () => {
    render(<CatalogSearchFlowHarness initialQuery="Pomidor" simulateErrorOnAdd={true} />);

    const addBtn = screen.getByTestId('plant-add-btn-pomidor-karlowy');

    await act(async () => {
      fireEvent.click(addBtn);
    });

    // Error banner is displayed
    await waitFor(() => {
      expect(screen.getByTestId('add-crop-feedback-banner')).toBeInTheDocument();
    });
    expect(screen.getByTestId('add-crop-feedback-message')).toHaveTextContent('Nie udało się dodać');
    expect(screen.getByTestId('my-crops-count')).toHaveTextContent('0');

    // Retry button is available
    const retryBtn = screen.getByTestId('add-crop-retry-btn');
    expect(retryBtn).toBeInTheDocument();

    // Click retry (harness retries with success)
    await act(async () => {
      fireEvent.click(retryBtn);
    });

    await waitFor(() => {
      expect(screen.getByTestId('add-crop-feedback-message')).toHaveTextContent('Pomyślnie dodano');
    });
    expect(screen.getByTestId('my-crops-count')).toHaveTextContent('1');
  });
});
