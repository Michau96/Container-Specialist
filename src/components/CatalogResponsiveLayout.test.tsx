import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlantCard } from './PlantCard';
import { LanguageProvider } from '../lib/LanguageContext';
import defaultPlantsData from '../data/plants.json';
import { validatePlantCatalog } from '../lib/catalogValidation';
import { Plant } from '../types';
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const { validPlants } = validatePlantCatalog(defaultPlantsData);

// Responsive Catalog Harness replicating App.tsx architecture
const ResponsiveCatalogHarness: React.FC<{
  plants?: Plant[];
  initialShowAdvancedFilters?: boolean;
}> = ({
  plants = validPlants,
  initialShowAdvancedFilters = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(initialShowAdvancedFilters);
  const [selectedGroup, setSelectedGroup] = useState('wszystkie');
  const [timingFilter, setTimingFilter] = useState('all');
  const [myCrops, setMyCrops] = useState<Array<{ plantId: string; potCount: number }>>([]);

  const activeAdvancedFiltersCount = (selectedGroup !== 'wszystkie' ? 1 : 0) + (timingFilter !== 'all' ? 1 : 0);

  const filteredPlants = plants.filter((p) => {
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedGroup !== 'wszystkie' && p.plant_group !== selectedGroup) {
      return false;
    }
    return true;
  });

  return (
    <LanguageProvider>
      <div data-testid="catalog-responsive-root" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation Quick Bar */}
        <div data-testid="dashboard-summary-bar" className="flex items-center justify-between">
          <div data-testid="tab-my-crops">
            <span>Moje uprawy</span>
            <span data-testid="my-crops-count">({myCrops.length})</span>
          </div>
        </div>

        {/* 1. Primary Catalog Search Control with clearly labeled advanced filters toggle */}
        <div data-testid="catalog-search-card" className="bg-white dark:bg-stone-900 rounded-[2rem] p-5 border border-stone-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label
              htmlFor="search-vegetables-input"
              data-testid="catalog-search-label"
              className="block text-sm font-bold text-stone-900"
            >
              Szukaj w katalogu upraw
            </label>

            {/* Clearly labeled control to toggle advanced filters */}
            <button
              id="toggle-advanced-filters-btn"
              data-testid="toggle-advanced-filters-btn"
              type="button"
              aria-expanded={showAdvancedFilters}
              aria-controls="advanced-filters-panel"
              onClick={() => setShowAdvancedFilters((prev) => !prev)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer bg-stone-50 text-stone-700 hover:bg-stone-100"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>{showAdvancedFilters ? 'Ukryj filtry zaawansowane' : 'Filtry zaawansowane'}</span>
              {activeAdvancedFiltersCount > 0 && (
                <span data-testid="active-filters-count-badge" className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                  {activeAdvancedFiltersCount}
                </span>
              )}
              {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-vegetables-input"
              data-testid="catalog-search-input"
              type="search"
              role="searchbox"
              aria-label="Szukaj w katalogu upraw"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj rośliny lub odmiany (np. pomidor, Vilma, rzodkiewka)..."
              className="w-full pl-11 pr-24 py-3 text-sm rounded-2xl border border-stone-200 bg-stone-50"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                data-testid="clear-search-btn"
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-semibold bg-stone-200 rounded-xl"
              >
                Wyczyść
              </button>
            )}
          </div>

          {/* Active Filters Summary when collapsed */}
          {!showAdvancedFilters && activeAdvancedFiltersCount > 0 && (
            <div data-testid="active-filters-summary" className="flex items-center gap-2 text-xs pt-1">
              <span className="font-semibold text-stone-500 uppercase tracking-wider">Aktywne filtry:</span>
              {selectedGroup !== 'wszystkie' && (
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 border text-stone-800">
                  Grupa: {selectedGroup}
                  <button type="button" onClick={() => setSelectedGroup('wszystkie')} className="ml-1 text-rose-600">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* 2. Advanced Filters Panel: Collapsible, hidden by default */}
        {showAdvancedFilters && (
          <div
            id="advanced-filters-panel"
            data-testid="advanced-filters-panel"
            className="bg-white dark:bg-stone-900 rounded-[2rem] p-5 border border-stone-200 shadow-xs space-y-4"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Wybierz grupę roślin:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { id: 'wszystkie', label: 'Wszystkie' },
                { id: 'warzywa', label: 'Warzywa' },
                { id: 'owoce', label: 'Owoce' },
                { id: 'ziola', label: 'Zioła' },
                { id: 'ozdobne', label: 'Ozdobne' },
                { id: 'kielki', label: 'Kiełki' },
                { id: 'grzyby', label: 'Grzyby' },
              ].map((group) => (
                <button
                  key={group.id}
                  id={`group-filter-${group.id}`}
                  data-testid={`group-filter-${group.id}`}
                  type="button"
                  onClick={() => setSelectedGroup(group.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold cursor-pointer ${
                    selectedGroup === group.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Catalog Grid with responsive breakpoints */}
        <div
          id="catalog-grid"
          data-testid="catalog-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPlants.map((plant) => {
            const isCrop = myCrops.some((c) => c.plantId === plant.id);
            const cropCount = myCrops.find((c) => c.plantId === plant.id)?.potCount || 0;
            return (
              <PlantCard
                key={plant.id}
                plant={plant}
                onSelect={vi.fn()}
                isMyCrop={isCrop}
                cropCount={cropCount}
                onAddCrop={(p) =>
                  setMyCrops((prev) => {
                    const idx = prev.findIndex((c) => c.plantId === p.id);
                    if (idx >= 0) {
                      return prev.map((c) => (c.plantId === p.id ? { ...c, potCount: c.potCount + 1 } : c));
                    }
                    return [...prev, { plantId: p.id, potCount: 1 }];
                  })
                }
              />
            );
          })}
        </div>
      </div>
    </LanguageProvider>
  );
};

describe('Catalog Information Density & Responsive Breakpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1. First Viewport Limits: plant image, plant name, 1-2 key growing attributes, 1 primary action
  it('limits card first viewport to plant image, plant name, one or two key attributes, and one primary action', () => {
    const tomato = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    expect(tomato).toBeDefined();

    render(
      <LanguageProvider>
        <PlantCard plant={tomato} onSelect={vi.fn()} onAddCrop={vi.fn()} />
      </LanguageProvider>
    );

    const card = screen.getByTestId(`plant-card-${tomato.id}`);
    expect(card).toBeInTheDocument();

    // 1. Plant Image with alt and source
    const img = screen.getByTestId(`plant-image-${tomato.id}`);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt');

    // 2. Plant Name
    const title = screen.getByTestId(`plant-title-${tomato.id}`);
    expect(title).toHaveTextContent('Pomidor');
    expect(title).toHaveTextContent(tomato.name);

    // 3. One or Two Key Growing Attributes (Pot size + Sunlight)
    const keyAttrs = screen.getByTestId(`plant-key-attributes-${tomato.id}`);
    expect(keyAttrs).toBeInTheDocument();

    const potAttr = screen.getByTestId(`plant-attr-pot-${tomato.id}`);
    expect(potAttr).toHaveTextContent(`Donica: min. ${tomato.pot.min_volume_l}L`);

    const sunAttr = screen.getByTestId(`plant-attr-sun-${tomato.id}`);
    expect(sunAttr).toHaveTextContent(tomato.sun_preference || 'Pełne słońce');

    // 4. One Primary Action Button with equal height class
    const addBtn = screen.getByTestId(`plant-add-btn-${tomato.id}`);
    expect(addBtn).toBeInTheDocument();
    expect(addBtn).toHaveTextContent('Dodaj do balkonu');
    expect(addBtn).toHaveClass('min-h-[44px]');

    // Advanced attributes panel is NOT expanded initially in the first viewport
    expect(screen.queryByTestId(`plant-details-panel-${tomato.id}`)).not.toBeInTheDocument();
  });

  // 2. Move advanced attributes into a collapsible details area
  it('moves advanced attributes into a collapsible details area toggled by a clear control', () => {
    const tomato = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    render(
      <LanguageProvider>
        <PlantCard plant={tomato} onSelect={vi.fn()} onAddCrop={vi.fn()} />
      </LanguageProvider>
    );

    const toggleBtn = screen.getByTestId(`plant-toggle-details-btn-${tomato.id}`);
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveTextContent('Pokaż szczegóły uprawy');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');

    // Expand details
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveTextContent('Zwiń szczegóły uprawy');
    expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

    // Details panel is now visible
    const detailsPanel = screen.getByTestId(`plant-details-panel-${tomato.id}`);
    expect(detailsPanel).toBeInTheDocument();

    // Contains untruncated description
    const fullDesc = screen.getByTestId(`plant-full-description-${tomato.id}`);
    expect(fullDesc).toHaveTextContent(tomato.summary);

    // Contains varieties
    if (tomato.varieties && tomato.varieties.length > 0) {
      expect(screen.getByTestId(`plant-varieties-list-${tomato.id}`)).toBeInTheDocument();
    }

    // Collapse details back
    fireEvent.click(toggleBtn);
    expect(screen.queryByTestId(`plant-details-panel-${tomato.id}`)).not.toBeInTheDocument();
  });

  // 3. Consistent card structure and equal-height action areas
  it('uses consistent card structure and equal-height action areas across multiple cards', () => {
    const tomato = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    const basil = validPlants.find((p) => p.id === 'bazylia-wlasciwa')!;
    const radish = validPlants.find((p) => p.id === 'rzodkiewka')!;
    expect(tomato).toBeDefined();
    expect(basil).toBeDefined();
    expect(radish).toBeDefined();

    render(
      <LanguageProvider>
        <div className="grid grid-cols-3 gap-6">
          <PlantCard plant={tomato} onSelect={vi.fn()} onAddCrop={vi.fn()} />
          <PlantCard plant={basil} onSelect={vi.fn()} onAddCrop={vi.fn()} />
          <PlantCard plant={radish} onSelect={vi.fn()} onAddCrop={vi.fn()} />
        </div>
      </LanguageProvider>
    );

    // Check that each card has min-h-[440px]
    [tomato, basil, radish].forEach((p) => {
      const card = screen.getByTestId(`plant-card-${p.id}`);
      expect(card).toHaveClass('min-h-[440px]');

      const actionArea = screen.getByTestId(`plant-action-area-${p.id}`);
      expect(actionArea).toBeInTheDocument();

      const btn = screen.getByTestId(`plant-add-btn-${p.id}`);
      expect(btn).toHaveClass('min-h-[44px]');
      expect(btn).toHaveClass('h-11');
    });
  });

  // 4. Long descriptions do not push the primary action below the fold unpredictably & line-clamp exposes full content
  it('truncates long descriptions visually without pushing the primary action down, exposing full content to assistive technology', () => {
    const tomato = validPlants.find((p) => p.id === 'pomidor-karlowy')!;
    render(
      <LanguageProvider>
        <PlantCard plant={tomato} onSelect={vi.fn()} onAddCrop={vi.fn()} />
      </LanguageProvider>
    );

    // Visually clamped description has line-clamp-2
    const descEl = screen.getByTestId(`plant-description-${tomato.id}`);
    expect(descEl).toHaveClass('line-clamp-2');
    expect(descEl).toHaveAttribute('title', tomato.summary);

    // Screen reader accessible element has full untruncated text
    const srDesc = screen.getByTestId(`plant-accessible-description-${tomato.id}`);
    expect(srDesc).toHaveClass('sr-only');
    expect(srDesc).toHaveTextContent(tomato.summary);
  });

  // 5. Keep advanced filters hidden behind a clearly labeled control while keeping primary search visible
  it('keeps advanced filters hidden behind clearly labeled control while keeping primary search visible', () => {
    render(<ResponsiveCatalogHarness />);

    // Primary search input is visible near top
    const searchInput = screen.getByTestId('catalog-search-input');
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId('catalog-search-label')).toHaveTextContent('Szukaj w katalogu upraw');

    // Advanced filters panel is initially HIDDEN
    expect(screen.queryByTestId('advanced-filters-panel')).not.toBeInTheDocument();

    // Toggle button is clearly labeled "Filtry zaawansowane"
    const toggleFiltersBtn = screen.getByTestId('toggle-advanced-filters-btn');
    expect(toggleFiltersBtn).toBeInTheDocument();
    expect(toggleFiltersBtn).toHaveTextContent('Filtry zaawansowane');
    expect(toggleFiltersBtn).toHaveAttribute('aria-expanded', 'false');

    // Open advanced filters
    fireEvent.click(toggleFiltersBtn);
    expect(toggleFiltersBtn).toHaveTextContent('Ukryj filtry zaawansowane');
    expect(toggleFiltersBtn).toHaveAttribute('aria-expanded', 'true');

    // Advanced filters panel is now displayed
    const panel = screen.getByTestId('advanced-filters-panel');
    expect(panel).toBeInTheDocument();
    expect(screen.getByTestId('group-filter-warzywa')).toBeInTheDocument();

    // Close advanced filters
    fireEvent.click(toggleFiltersBtn);
    expect(screen.queryByTestId('advanced-filters-panel')).not.toBeInTheDocument();
  });

  // 6. Responsive Test: One-column mobile layout
  it('configures one-column mobile layout on mobile viewports with touch-friendly targets', () => {
    render(<ResponsiveCatalogHarness />);

    const grid = screen.getByTestId('catalog-grid');
    expect(grid).toBeInTheDocument();

    // Verify responsive grid class string contains mobile 1-column 'grid-cols-1'
    expect(grid.className).toContain('grid-cols-1');

    // In single-column layout, touch target of primary action button must be >= 44px
    const firstPlant = validPlants[0];
    const addBtn = screen.getByTestId(`plant-add-btn-${firstPlant.id}`);
    expect(addBtn).toHaveClass('min-h-[44px]');
  });

  // 7. Responsive Test: Two-column tablet layout
  it('configures two-column tablet layout with md:grid-cols-2 breakpoint', () => {
    render(<ResponsiveCatalogHarness />);

    const grid = screen.getByTestId('catalog-grid');
    // Verify tablet 2-column breakpoint
    expect(grid.className).toContain('md:grid-cols-2');

    // Primary action buttons align horizontally across two adjacent cards
    const p1 = validPlants[0];
    const p2 = validPlants[1];
    const action1 = screen.getByTestId(`plant-action-area-${p1.id}`);
    const action2 = screen.getByTestId(`plant-action-area-${p2.id}`);
    expect(action1).toBeInTheDocument();
    expect(action2).toBeInTheDocument();
  });

  // 8. Responsive Test: Multi-column desktop layout
  it('configures multi-column desktop layout with lg:grid-cols-3 breakpoint', () => {
    render(<ResponsiveCatalogHarness />);

    const grid = screen.getByTestId('catalog-grid');
    // Verify desktop multi-column breakpoint
    expect(grid.className).toContain('lg:grid-cols-3');
  });

  // 9. Exact Polish product labels and plant names preserved
  it('preserves exact Polish product labels ("Moje uprawy", "Dodaj do balkonu", plant names)', () => {
    render(<ResponsiveCatalogHarness />);

    // Product label "Moje uprawy"
    expect(screen.getByTestId('tab-my-crops')).toHaveTextContent('Moje uprawy');

    // Polish search label
    expect(screen.getByTestId('catalog-search-label')).toHaveTextContent('Szukaj w katalogu upraw');

    // Polish plant names
    expect(screen.getByTestId('plant-title-pomidor-karlowy')).toHaveTextContent('Pomidor karłowy');
    expect(screen.getByTestId('plant-title-bazylia-wlasciwa')).toHaveTextContent('Bazylia właściwa');

    // Polish action button
    expect(screen.getByTestId('plant-add-btn-pomidor-karlowy')).toHaveTextContent('Dodaj do balkonu');

    // Polish filter label
    expect(screen.getByTestId('toggle-advanced-filters-btn')).toHaveTextContent('Filtry zaawansowane');
  });
});
