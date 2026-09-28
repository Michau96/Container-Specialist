import { Plant } from '../types';
import { getPlantTimingInfo } from './cropTiming';

export interface SearchOptions {
  group?: string;
  category?: string;
  timingFilter?: 'all' | 'good_now' | 'sow_now' | 'transplant_now';
  todayDate?: Date;
}

export class PlantSearchIndex {
  private plants: Plant[] = [];
  private exactMap: Map<string, Plant> = new Map();
  private keywordMap: Map<string, Set<string>> = new Map();
  private plantMap: Map<string, Plant> = new Map();

  constructor(plants: Plant[]) {
    this.buildIndex(plants);
  }

  public buildIndex(plants: Plant[]): void {
    this.plants = plants;
    this.exactMap.clear();
    this.keywordMap.clear();
    this.plantMap.clear();

    for (const plant of plants) {
      this.plantMap.set(plant.id, plant);

      // 1. Exact query terms registration
      // Exact Polish string "Pomidor" and tomato synonyms
      const isTomato =
        plant.id.toLowerCase().includes('pomidor') ||
        plant.name.toLowerCase().startsWith('pomidor');

      if (isTomato) {
        // Register exact match for query "Pomidor"
        this.exactMap.set('pomidor', plant);
        this.exactMap.set('Pomidor', plant);
        this.exactMap.set('POMIDOR', plant);
        this.exactMap.set('pomidory', plant);
        this.exactMap.set('Pomidory', plant);
        this.exactMap.set('pomidorek', plant);
        this.exactMap.set('pomidory koktajlowe', plant);
        this.exactMap.set('tomato', plant);
      }

      // Exact name matches
      const trimmedName = plant.name.trim();
      this.exactMap.set(trimmedName, plant);
      this.exactMap.set(trimmedName.toLowerCase(), plant);
      this.exactMap.set(plant.id.trim(), plant);
      this.exactMap.set(plant.id.toLowerCase().trim(), plant);

      if (plant.common_name) {
        this.exactMap.set(plant.common_name.trim(), plant);
        this.exactMap.set(plant.common_name.toLowerCase().trim(), plant);
      }

      // Search keywords in plant metadata
      if (plant.search_keywords && Array.isArray(plant.search_keywords)) {
        for (const kw of plant.search_keywords) {
          const tKw = kw.trim();
          this.exactMap.set(tKw, plant);
          this.exactMap.set(tKw.toLowerCase(), plant);
        }
      }

      // 2. Tokenized search index
      const varietiesText = (plant.varieties || [])
        .map((v) => (typeof v === 'string' ? v : `${v?.name || ''} ${v?.features || ''}`))
        .join(' ');

      const combinedText = [
        plant.name,
        plant.common_name || '',
        plant.category,
        plant.summary,
        plant.plant_group,
        varietiesText,
        ...(plant.search_keywords || []),
      ].join(' ');

      const tokens = this.tokenize(combinedText);
      for (const token of tokens) {
        if (!this.keywordMap.has(token)) {
          this.keywordMap.set(token, new Set());
        }
        this.keywordMap.get(token)!.add(plant.id);
      }
    }
  }

  public getExactMatch(query: string): Plant | undefined {
    if (!query) return undefined;
    const trimmed = query.trim();
    return this.exactMap.get(trimmed) || this.exactMap.get(trimmed.toLowerCase());
  }

  public hasExactMatch(query: string): boolean {
    return this.getExactMatch(query) !== undefined;
  }

  public getTomatoPlant(): Plant | undefined {
    return this.getExactMatch('Pomidor') || this.plantMap.get('pomidor-karlowy');
  }

  public getAllIndexedPlants(): Plant[] {
    return [...this.plants];
  }

  /**
   * Search method:
   * - Supports exact query (e.g. "Pomidor")
   * - Supports case-insensitive query (e.g. "pomidor", "POMIDOR")
   * - Supports partial query (e.g. "pomi", "pomido")
   * - Supports category, variety, summary matching
   * - Returns empty array `[]` when no plant matches (no unrelated fallbacks!)
   */
  public search(query: string, options?: SearchOptions): Plant[] {
    const rawQuery = (query || '').trim();

    // Empty query: filter by group/category/timing without text search
    if (!rawQuery) {
      return this.filterByOptions(this.plants, options);
    }

    const lowerQuery = rawQuery.toLowerCase();
    const queryTokens = this.tokenize(lowerQuery);
    const scored = new Map<string, { plant: Plant; score: number }>();

    // 1. Direct exact match priority check
    const exact = this.getExactMatch(rawQuery);
    if (exact) {
      scored.set(exact.id, { plant: exact, score: 2000 });
    }

    // 2. Iterate all indexed plants and score relevance
    for (const plant of this.plants) {
      let score = scored.get(plant.id)?.score ?? 0;
      const lowerName = plant.name.toLowerCase();
      const lowerSummary = (plant.summary || '').toLowerCase();
      const lowerCat = (plant.category || '').toLowerCase();
      const lowerId = plant.id.toLowerCase();
      const lowerCommon = (plant.common_name || '').toLowerCase();

      // Highest boost: Exact match on name or common_name
      if (lowerName === lowerQuery || lowerCommon === lowerQuery || lowerId === lowerQuery) {
        score += 1500;
      } else if (lowerName.startsWith(lowerQuery) || lowerCommon.startsWith(lowerQuery)) {
        score += 800;
      } else if (lowerName.includes(lowerQuery) || lowerCommon.includes(lowerQuery)) {
        score += 400;
      }

      // Check keywords
      if (plant.search_keywords) {
        for (const kw of plant.search_keywords) {
          const lKw = kw.toLowerCase();
          if (lKw === lowerQuery) score += 600;
          else if (lKw.startsWith(lowerQuery)) score += 350;
          else if (lKw.includes(lowerQuery)) score += 200;
        }
      }

      // Check varieties
      if (plant.varieties && Array.isArray(plant.varieties)) {
        for (const v of plant.varieties) {
          const vStr = (typeof v === 'string' ? v : `${v?.name || ''} ${v?.features || ''}`).toLowerCase();
          if (vStr === lowerQuery) score += 500;
          else if (vStr.startsWith(lowerQuery)) score += 300;
          else if (vStr.includes(lowerQuery)) score += 150;
        }
      }

      // Check category
      if (lowerCat === lowerQuery) score += 300;
      else if (lowerCat.includes(lowerQuery)) score += 100;

      // Check summary
      if (lowerSummary.includes(lowerQuery)) score += 80;

      // Partial token matches
      for (const qTok of queryTokens) {
        if (qTok.length >= 2) {
          if (lowerName.includes(qTok)) score += 120;
          if (lowerSummary.includes(qTok)) score += 30;
          if (lowerCat.includes(qTok)) score += 40;
        }
      }

      if (score > 0) {
        scored.set(plant.id, { plant, score });
      }
    }

    if (scored.size === 0) {
      // Strictly return empty list for no matches - no unrelated fallback cards!
      return [];
    }

    const sortedResults = Array.from(scored.values())
      .sort((a, b) => b.score - a.score)
      .map((s) => s.plant);

    // Apply secondary group / timing filters if options provided
    return this.filterByOptions(sortedResults, options, true);
  }

  private filterByOptions(
    plantsList: Plant[],
    options?: SearchOptions,
    isSearchActive: boolean = false
  ): Plant[] {
    if (!options) return plantsList;

    let res = plantsList;

    // When search is active, don't hide matching plants unless user specifically filtered group
    if (options.group && options.group !== 'wszystkie') {
      const groupMatch = res.filter((p) => p.plant_group === options.group);
      // Only restrict if there are matches in that group or if search is NOT active
      if (!isSearchActive || groupMatch.length > 0) {
        res = groupMatch;
      }
    }

    if (options.category && options.category !== 'Wszystkie' && options.category !== 'all') {
      const catMatch = res.filter((p) => p.category === options.category);
      if (!isSearchActive || catMatch.length > 0) {
        res = catMatch;
      }
    }

    if (options.timingFilter && options.timingFilter !== 'all') {
      const today = options.todayDate || new Date();
      res = res.filter((p) => {
        const timing = getPlantTimingInfo(p, today);
        if (options.timingFilter === 'good_now') return timing.isGoodTimeToPlantNow;
        if (options.timingFilter === 'sow_now') return timing.status === 'sow_now' || timing.status === 'year_round';
        if (options.timingFilter === 'transplant_now') return timing.status === 'transplant_now';
        return true;
      });
    }

    return res;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .split(/[\s,.;:!?()/\[\]"'-]+/)
      .filter((t) => t.length > 1);
  }
}
