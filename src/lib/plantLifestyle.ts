import { Plant } from '../types';

export interface LifestylePill {
  id: string;
  label: string;
  icon: string;
  className: string;
  description?: string;
}

interface LifestyleDefinition {
  label: string;
  labelEn: string;
  icon: string;
  className: string;
  description: string;
  descriptionEn: string;
}

// Predefined pill styles following shadcn/ui minimal clean design
export const LIFESTYLE_DEFINITIONS: Record<string, LifestyleDefinition> = {
  do_salatki: {
    label: 'Do sałatki',
    labelEn: 'Salad staple',
    icon: '🥗',
    className:
      'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    description: 'Chrupiący dodatek do codziennych świeżych misek i sałatek.',
    descriptionEn: 'Crispy addition for daily fresh salad bowls.',
  },
  szybko_rosnace: {
    label: 'Szybko rosnące',
    labelEn: 'Fast growing',
    icon: '⚡',
    className:
      'bg-amber-50/90 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    description: 'Pierwsze zbiory już po kilkunastu lub 25-30 dniach od wysiewu.',
    descriptionEn: 'First harvest in just 20–30 days from sowing.',
  },
  zero_wysilku: {
    label: 'Zero wysiłku',
    labelEn: 'Zero hassle',
    icon: '✨',
    className:
      'bg-sky-50/90 text-sky-800 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
    description: 'Wybacza drobne błędy, nie wymaga skomplikowanych zabiegów.',
    descriptionEn: 'Forgiving for beginners, requires minimal maintenance.',
  },
  slodkie_zbiory: {
    label: 'Słodkie zbiory',
    labelEn: 'Sweet harvest',
    icon: '🍓',
    className:
      'bg-rose-50/90 text-rose-800 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
    description: 'Pyszne, słodkie owoce prosto do deseru, owsianki lub z krzaczka.',
    descriptionEn: 'Delicious sweet fruit straight from the pot for desserts & oatmeal.',
  },
  aromatyczne: {
    label: 'Aromatyczne zioła',
    labelEn: 'Aromatic herbs',
    icon: '🌿',
    className:
      'bg-teal-50/90 text-teal-800 border-teal-200/80 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60',
    description: 'Cudowny zapach na balkonie i niezrównany smak w domowej kuchni.',
    descriptionEn: 'Wonderful fragrance on the balcony and fresh culinary flavor.',
  },
  do_napojow: {
    label: 'Do lemoniady & herbaty',
    labelEn: 'Lemonade & tea',
    icon: '🍋',
    className:
      'bg-lime-50/90 text-lime-800 border-lime-200/80 dark:bg-lime-950/40 dark:text-lime-300 dark:border-lime-800/60',
    description: 'Świeże orzeźwienie w letnie dni i rozgrzewające napary jesienią.',
    descriptionEn: 'Fresh summer refreshment and warming herbal teas.',
  },
  kompaktowa: {
    label: 'Kompaktowa roślina',
    labelEn: 'Compact size',
    icon: '🪴',
    className:
      'bg-stone-100/90 text-stone-800 border-stone-200 dark:bg-stone-800/60 dark:text-stone-300 dark:border-stone-700',
    description: 'Idealna do małych doniczek i skrzynek na balustradzie.',
    descriptionEn: 'Perfect for small containers and rail planters.',
  },
  piekne_kwiaty: {
    label: 'Pięknie kwitnie',
    labelEn: 'Vibrant blooms',
    icon: '🌸',
    className:
      'bg-violet-50/90 text-violet-800 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60',
    description: 'Balkon tonący w kolorach przez cały sezon.',
    descriptionEn: 'Lush colors and blossoms throughout the entire balcony season.',
  },
  superfood: {
    label: 'Superfood & witaminy',
    labelEn: 'Superfood & vitamins',
    icon: '💪',
    className:
      'bg-indigo-50/90 text-indigo-800 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60',
    description: 'Skoncentrowana bomba witamin, minerałów i antyoksydantów.',
    descriptionEn: 'Nutrient-dense burst of vitamins, minerals & antioxidants.',
  },
  pikantne: {
    label: 'Pikantne smaki',
    labelEn: 'Spicy kick',
    icon: '🔥',
    className:
      'bg-orange-50/90 text-orange-800 border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800/60',
    description: 'Wyrazisty ogień dla miłośników pikantnej kuchni.',
    descriptionEn: 'Bold fiery taste for spicy food lovers.',
  },
  odporna_wiatr: {
    label: 'Odporna na wiatr',
    labelEn: 'Wind resistant',
    icon: '💨',
    className:
      'bg-cyan-50/90 text-cyan-800 border-cyan-200/80 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800/60',
    description: 'Świetnie radzi sobie na wyższych piętrach i otwartych balkonach.',
    descriptionEn: 'Thrives on upper floors and exposed breezy balconies.',
  },
  dla_poczatkujacych: {
    label: 'Dla początkujących',
    labelEn: 'Beginner friendly',
    icon: '🌱',
    className:
      'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
    description: 'Gwarantowany sukces na start balkonowej przygody.',
    descriptionEn: 'Guaranteed success for your first balcony planting adventure.',
  },
  chrupiace_przekaski: {
    label: 'Chrupiące zbiory',
    labelEn: 'Crispy snacks',
    icon: '🥕',
    className:
      'bg-amber-50/90 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
    description: 'Soczyste i chrupiące warzywa do podjadania prosto z donicy.',
    descriptionEn: 'Juicy and crunchy vegetables for snacking directly from pots.',
  },
};

// Handcrafted primary matching per plant ID for the best emotional relevance
const PLANT_CUSTOM_PILLS: Record<string, string[]> = {
  'pomidor-karlowy': ['do_salatki', 'kompaktowa', 'zero_wysilku'],
  'papryka-chili': ['pikantne', 'kompaktowa', 'zero_wysilku'],
  'rzodkiewka': ['szybko_rosnace', 'zero_wysilku', 'do_salatki'],
  'salata-listkowa': ['do_salatki', 'szybko_rosnace', 'dla_poczatkujacych'],
  'szpinak-balkonowy': ['superfood', 'szybko_rosnace', 'do_salatki'],
  'fasola-karlowa': ['dla_poczatkujacych', 'kompaktowa', 'chrupiace_przekaski'],
  'ogorek-krzaczasty': ['do_salatki', 'chrupiace_przekaski', 'dla_poczatkujacych'],
  'szczypiorek-ziola': ['zero_wysilku', 'do_salatki', 'odporna_wiatr'],
  'marchew-mini': ['chrupiace_przekaski', 'kompaktowa', 'dla_poczatkujacych'],
  'jarmuz-karlowy': ['superfood', 'odporna_wiatr', 'zero_wysilku'],
  'rukola-balkonowa': ['do_salatki', 'szybko_rosnace', 'zero_wysilku'],
  'roszponka': ['do_salatki', 'szybko_rosnace', 'zero_wysilku'],
  'cukinia-balkonowa': ['chrupiace_przekaski', 'dla_poczatkujacych', 'kompaktowa'],
  'rozmaryn-lekarski': ['aromatyczne', 'zero_wysilku', 'odporna_wiatr'],
  'tymianek-wlasciwy': ['aromatyczne', 'zero_wysilku', 'odporna_wiatr'],
  'oregano-lebiodka': ['aromatyczne', 'zero_wysilku', 'dla_poczatkujacych'],
  'szalwia-lekarska': ['aromatyczne', 'do_napojow', 'zero_wysilku'],
  'burak-lisciowy': ['do_salatki', 'superfood', 'piekne_kwiaty'],
  'truskawka-wisząca': ['slodkie_zbiory', 'kompaktowa', 'dla_poczatkujacych'],
  'poziomka-caloroczna': ['slodkie_zbiory', 'zero_wysilku', 'kompaktowa'],
  'borowka-patio': ['slodkie_zbiory', 'superfood', 'kompaktowa'],
  'malina-karlowa': ['slodkie_zbiory', 'kompaktowa', 'dla_poczatkujacych'],
  'arbuz-mini': ['slodkie_zbiory', 'kompaktowa'],
  'bazylia-wlasciwa': ['do_salatki', 'aromatyczne', 'kompaktowa'],
  'mieta-donica': ['zero_wysilku', 'do_napojow', 'szybko_rosnace'],
  'pietruszka-naciowa': ['do_salatki', 'superfood', 'zero_wysilku'],
  'pelargonia-balkonowa': ['piekne_kwiaty', 'zero_wysilku', 'odporna_wiatr'],
  'surfinia-kaskadowa': ['piekne_kwiaty', 'dla_poczatkujacych'],
  'lawenda-donica': ['aromatyczne', 'zero_wysilku', 'odporna_wiatr'],
  'aksamitka-niska': ['zero_wysilku', 'piekne_kwiaty', 'kompaktowa'],
  'begonia-stale-kwitnaca': ['piekne_kwiaty', 'zero_wysilku'],
  'fuksja-zwisajaca': ['piekne_kwiaty', 'kompaktowa'],
  'rzezucha-siewna': ['szybko_rosnace', 'zero_wysilku', 'superfood'],
  'slonecznik-mikrolistki': ['szybko_rosnace', 'superfood', 'do_salatki'],
  'rzodkiewka-kielki': ['szybko_rosnace', 'superfood', 'pikantne'],
  'gorczyca-kielki': ['szybko_rosnace', 'pikantne', 'superfood'],
  'pszenica-trawa': ['superfood', 'do_napojow', 'szybko_rosnace'],
  'boczniak-ostrygowaty': ['zero_wysilku', 'dla_poczatkujacych'],
  'pieczarka-dwuzarodnikowa': ['zero_wysilku', 'dla_poczatkujacych'],
  'soplowka-jezowata': ['superfood', 'kompaktowa'],
  'shiitake-twardnik': ['superfood', 'aromatyczne'],
  'groszek-cukrowy': ['slodkie_zbiory', 'szybko_rosnace', 'dla_poczatkujacych'],
  'pak-choi': ['szybko_rosnace', 'do_salatki', 'chrupiace_przekaski'],
  'kumkwat-cytrus': ['slodkie_zbiory', 'piekne_kwiaty', 'kompaktowa'],
  'figowiec': ['slodkie_zbiory', 'piekne_kwiaty'],
  'miechunka-peruwianska': ['slodkie_zbiory', 'superfood'],
  'kiwano-balkonowe': ['chrupiace_przekaski', 'kompaktowa'],
  'okra-balkonowa': ['chrupiace_przekaski', 'dla_poczatkujacych'],
  'batat-jadalny': ['piekne_kwiaty', 'kompaktowa'],
  'kapusta-pekinska': ['szybko_rosnace', 'do_salatki'],
  'trawa-cytrynowa': ['do_napojow', 'aromatyczne', 'zero_wysilku'],
};

/**
 * Returns 2-3 friendly, conversion-optimized Pills/Chips for the plant.
 */
export function getPlantLifestylePills(plant: Plant, lang?: string): LifestylePill[] {
  const isEn = lang === 'en';
  const customIds = PLANT_CUSTOM_PILLS[plant.id];
  let chosenIds: string[] = [];

  if (customIds && customIds.length > 0) {
    chosenIds = customIds.slice(0, 3);
  } else {
    // Dynamic heuristic fallback
    const ids: string[] = [];

    if (plant.plant_group === 'owoce') {
      ids.push('slodkie_zbiory');
    } else if (plant.plant_group === 'ziola') {
      ids.push('aromatyczne');
      if (plant.name.toLowerCase().includes('mięt') || plant.name.toLowerCase().includes('melis') || plant.name.toLowerCase().includes('mint')) {
        ids.push('do_napojow');
      }
    } else if (plant.plant_group === 'ozdobne') {
      ids.push('piekne_kwiaty');
    } else if (plant.plant_group === 'kielki') {
      ids.push('szybko_rosnace', 'superfood');
    } else if (plant.plant_group === 'grzyby') {
      ids.push('zero_wysilku');
    }

    if (plant.difficulty <= 3) {
      ids.push('zero_wysilku');
    }

    const nameLower = plant.name.toLowerCase();
    if (
      nameLower.includes('sałat') ||
      nameLower.includes('lettuce') ||
      nameLower.includes('pomidor') ||
      nameLower.includes('tomato') ||
      nameLower.includes('ogórek') ||
      nameLower.includes('cucumber') ||
      nameLower.includes('rukol') ||
      nameLower.includes('arugula') ||
      nameLower.includes('roszponk') ||
      nameLower.includes('szpinak') ||
      nameLower.includes('spinach') ||
      nameLower.includes('rzodkiew') ||
      nameLower.includes('radish')
    ) {
      ids.push('do_salatki');
    }

    if (nameLower.includes('karł') || nameLower.includes('dwarf') || nameLower.includes('mini') || (plant.pot && plant.pot.min_volume_l <= 5)) {
      ids.push('kompaktowa');
    }

    if (ids.length === 0) {
      ids.push('dla_poczatkujacych', 'zero_wysilku');
    }

    // Deduplicate and keep at most 3
    chosenIds = Array.from(new Set(ids)).slice(0, 3);
  }

  return chosenIds
    .map((id) => {
      const def = LIFESTYLE_DEFINITIONS[id];
      if (!def) return null;
      const pill: LifestylePill = {
        id,
        label: isEn ? def.labelEn : def.label,
        icon: def.icon,
        className: def.className,
        description: isEn ? def.descriptionEn : def.description,
      };
      return pill;
    })
    .filter((p): p is LifestylePill => p !== null);
}
