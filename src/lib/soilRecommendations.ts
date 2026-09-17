import { Plant } from '../types';

export interface SoilProducer {
  name: string;
  badge: string;
  recommendedProducts: string[];
  rating: string;
  whyGood: string;
  priceLevel: 'Niska' | 'Średnia' | 'Średnia / Wyższa' | 'Premium';
}

export interface SoilShoppingAdvice {
  searchKeywords: string[];
  primarySearchTerm: string;
  recommendedProducers: SoilProducer[];
  compositionTips: string[];
  whatToAvoid: string[];
  idealPh: string;
  substrateTypeDescription: string;
}

export const TOP_SOIL_PRODUCERS: SoilProducer[] = [
  {
    name: 'Compo Sana',
    badge: 'Klasa Premium ⭐⭐⭐⭐⭐',
    recommendedProducts: [
      'Compo Sana Ziemia do Pomidorów i Warzyw',
      'Compo BIO Podłoże do Ziół i Warzyw',
      'Compo Sana Podłoże z perlitem i hydrożelem',
    ],
    rating: '4.9 / 5.0 (Bardzo wysokie oceny)',
    whyGood:
      'Zawiera fabryczny perlit i naturalne guano. Struktura jest pulchna, nie zbija się w twardą skorupę, trzyma optymalną wilgoć.',
    priceLevel: 'Średnia / Wyższa',
  },
  {
    name: 'Kronen',
    badge: 'Wybór Ogrodników ⭐⭐⭐⭐⭐',
    recommendedProducts: [
      'Kronen Ziemia do Warzyw i Pomidorów (z glinką)',
      'Kronen BIO Podłoże Ekologiczne',
      'Kronen Ziemia do Ziół i Rozsad',
    ],
    rating: '4.8 / 5.0 (Sprawdzona jakość)',
    whyGood:
      'Dodatek glinki wulkanicznej i nawilżacza ecofibrex genialnie zabezpiecza donice balkonowe przed błyskawicznym wysychaniem w upały.',
    priceLevel: 'Średnia',
  },
  {
    name: 'Biovita / Target',
    badge: 'Świetny stosunek jakości do ceny ⭐⭐⭐⭐',
    recommendedProducts: [
      'Biovita Ziemia do Warzyw EKO z Biohumusem',
      'Target Podłoże do Pomidorów, Papryki i Ogórków',
      'Biovita Ziemia Uniwersalna Torfowa',
    ],
    rating: '4.7 / 5.0 (Ekonomiczny lider)',
    whyGood:
      'Polskie podłoża wzbogacone naturalnym biohumusem (wermikompostem). Dobra baza, którą warto uzupełnić garścią perlitu.',
    priceLevel: 'Niska',
  },
  {
    name: 'Substral Naturen',
    badge: 'Bio Ekologia ⭐⭐⭐⭐',
    recommendedProducts: [
      'Substral Naturen BIO Ziemia do Warzyw i Ziół',
      'Substral Podłoże Humusowe do Donic',
    ],
    rating: '4.7 / 5.0 (Organiczny)',
    whyGood:
      'Certyfikowane podłoże ekologiczne bez sztucznych dodatków chemicznych, z naturalnym kompostem i dawką startową mikroorganizmów.',
    priceLevel: 'Średnia',
  },
  {
    name: 'Westland / BioBizz',
    badge: 'Specjalistyczne Pojemnikowe ⭐⭐⭐⭐⭐',
    recommendedProducts: [
      'Westland Big Tom Podłoże do Uprawy Pomidorów w Pojemnikach',
      'BioBizz All-Mix / Light-Mix Organiczne',
      'Westland Podłoże z granulatem Seramis',
    ],
    rating: '4.9 / 5.0 (Dla wymagających)',
    whyGood:
      'Granulaty mineralne (np. Seramis) magazynują wodę wewnątrz porowatej struktury i oddają ją korzeniom w rytmie transpiracji.',
    priceLevel: 'Premium',
  },
];

/**
 * Zwraca precyzyjne rekomendacje fraz wyszukiwania ziemi oraz wskazówki producentów
 */
export function getSoilShoppingAdvice(plant?: Plant | null): SoilShoppingAdvice {
  const plantNameLower = (plant?.name || '').toLowerCase();
  const plantGroup = plant?.plant_group || 'warzywa';
  const phRange = plant?.soil_layers?.ph_range || '6.0 - 6.8';

  // 1. Pomidory, Papryki, Bakłażany (psiankowate żarłoczne)
  if (
    plantNameLower.includes('pomidor') ||
    plantNameLower.includes('papryk') ||
    plantNameLower.includes('bakłażan') ||
    plantNameLower.includes('oberżyn')
  ) {
    return {
      primarySearchTerm: 'Ziemia do pomidorów i warzyw',
      searchKeywords: [
        'Ziemia do pomidorów i papryki',
        'Podłoże do warzyw BIO z biohumusem',
        'Ziemia warzywna z perlitem do pojemników',
        'Ziemia ogrodnicza uniwersalna BIO 50L',
      ],
      recommendedProducers: TOP_SOIL_PRODUCERS,
      compositionTips: [
        'Wybieraj ziemię o strukturze pulchnej z dodatkiem biohumusu lub kompostu.',
        'Koniecznie dodaj 10–20% perlitu lub wermikulitu, aby ziemia w donicy nie zbijała się po podlewaniu.',
        'W donicach na południowym balkonie sprawdza się podłoże z dodatkiem glinki (np. Kronen) lub hydrożelu/seramisu.',
      ],
      whatToAvoid: [
        'Unikaj najtańszej ziemi uniwersalnej "z marketu za 3 zł" (często jest to surowy, kwaśny torf mielony, który szybko pleśnieje lub zbija się w beton).',
        'Unikaj ziemi do kwiatów ozdobnych z mocną dawką chemicznego nawozu długodziałającego (może kumulować się w owocach).',
      ],
      idealPh: phRange,
      substrateTypeDescription:
        'Podłoże żyzne, próchniczne, przepuszczalne, bogate w materię organiczną (pH 6.0–6.8).',
    };
  }

  // 2. Truskawki, Poziomki, Jagodowe
  if (
    plantNameLower.includes('truskawk') ||
    plantNameLower.includes('poziomk') ||
    plantNameLower.includes('jagod') ||
    plantNameLower.includes('malin')
  ) {
    return {
      primarySearchTerm: 'Ziemia do truskawek i owoców jagodowych',
      searchKeywords: [
        'Ziemia do truskawek i poziomek',
        'Podłoże do krzewów jagodowych lekko kwaśne',
        'Ziemia warzywna lekko kwaśna pH 5.5-6.5',
        'Podłoże z włóknem kokosowym do wiszących donic',
      ],
      recommendedProducers: TOP_SOIL_PRODUCERS.filter((p) => p.name !== 'Westland / BioBizz').concat(
        TOP_SOIL_PRODUCERS.slice(4)
      ),
      compositionTips: [
        'Truskawki lubią lekką kwasowość (pH 5.5–6.5) i dużą przepuszczalność.',
        'W wiszących amplach i doniczkach dodaj włókno kokosowe, które zapobiega wysychaniu brzegów bryły.',
      ],
      whatToAvoid: [
        'Unikaj gleb wapnowanych o wysokim pH > 7.0 (truskawki reagują chlorozą liści).',
        'Ziem ciężkich gliniastych bez drenażu.',
      ],
      idealPh: phRange,
      substrateTypeDescription:
        'Żyzne, lekko kwaśne podłoże próchniczne z dodatkiem torfu wysokiego i włókien kokosowych (pH 5.5–6.5).',
    };
  }

  // 3. Borówka amerykańska (silnie kwasolubna)
  if (plantNameLower.includes('borówk') || plantNameLower.includes('żurawin')) {
    return {
      primarySearchTerm: 'Ziemia do borówek / roślin kwasolubnych',
      searchKeywords: [
        'Ziemia do borówki amerykańskiej',
        'Torf kwaśny nieodkwaszony pH 3.5-4.5',
        'Podłoże do rododendronów i borówek',
        'Kora sosnowa drobna do ściółkowania',
      ],
      recommendedProducers: [
        TOP_SOIL_PRODUCERS[0], // Compo
        TOP_SOIL_PRODUCERS[1], // Kronen
        TOP_SOIL_PRODUCERS[2], // Biovita
      ],
      compositionTips: [
        'Borówka wymaga skrajnie kwaśnego podłoża (pH 3.5–4.5) – zwykła ziemia uniwersalna doprowadzi do jej obumarcia!',
        'Wymieszaj kwaśny torf (50%) z przekompostowaną korą sosnową (30%) i piaskiem/perlitem (20%).',
      ],
      whatToAvoid: [
        'BEZWZGLĘDNIE UNIKAJ ziemi uniwersalnej, kompostu ogrodowego i ziemi z wapnem.',
      ],
      idealPh: '3.5 - 4.5 (silnie kwaśna)',
      substrateTypeDescription:
        'Specjalistyczne podłoże kwaśne: torf wysoki nieodkwaszony + kora iglasta (pH 3.5–4.5).',
    };
  }

  // 4. Zioła śródziemnomorskie (Rozmaryn, Tymianek, Lawenda, Szałwia, Oregano)
  if (
    plantNameLower.includes('rozmaryn') ||
    plantNameLower.includes('lawend') ||
    plantNameLower.includes('tymianek') ||
    plantNameLower.includes('oregano') ||
    plantNameLower.includes('cząber') ||
    plantNameLower.includes('szałwi')
  ) {
    return {
      primarySearchTerm: 'Ziemia do ziół i lawendy',
      searchKeywords: [
        'Ziemia do ziół i warzyw BIO',
        'Podłoże do lawendy i roślin śródziemnomorskich',
        'Ziemia piaszczysto-żwirowa do ziół',
        'Podłoże odkwaszone z piaskiem i perlitem',
      ],
      recommendedProducers: [
        TOP_SOIL_PRODUCERS[0], // Compo
        TOP_SOIL_PRODUCERS[1], // Kronen
        TOP_SOIL_PRODUCERS[3], // Substral Naturen
      ],
      compositionTips: [
        'Zioła śródziemnomorskie nie znoszą tłustej, mokrej ziemi. Zmieszaj ziemię do ziół z piaskiem płukanym lub perlitem w proporcji 3:1.',
        'Wymagają doskonałego odpływu wody i obojętnego/lekko zasadowego odczynu (pH 6.5–7.5).',
      ],
      whatToAvoid: [
        'Unikaj ziemi torfowej trzymającej długo wilgoć oraz nawozów z wysokim azotem (zioła stracą aromat i zapach).',
      ],
      idealPh: phRange || '6.5 - 7.5',
      substrateTypeDescription:
        'Lekkie, piaszczysto-żwirowe, przepuszczalne podłoże o niskiej zawartości azotu (pH 6.5–7.5).',
    };
  }

  // 5. Zioła wilgociolubne (Bazylia, Mięta, Kolendra, Pietruszka naciowa)
  if (
    plantNameLower.includes('bazyli') ||
    plantNameLower.includes('mięt') ||
    plantNameLower.includes('kolendr') ||
    plantNameLower.includes('pietruszk') ||
    plantNameLower.includes('szczypior')
  ) {
    return {
      primarySearchTerm: 'Ziemia do ziół BIO z perlitem',
      searchKeywords: [
        'Ziemia do ziół i rozsad BIO',
        'Podłoże uniwersalne ekologiczne z biohumusem',
        'Ziemia warzywna lekka z perlitem',
      ],
      recommendedProducers: TOP_SOIL_PRODUCERS,
      compositionTips: [
        'Pulchna ziemia z dodatkiem kompostu, która trzyma równomierną wilgoć bez zastoisk wodnych.',
      ],
      whatToAvoid: [
        'Ziemia ciężka, zbita, gliniasta oraz przesuszone bryły torfu.',
      ],
      idealPh: phRange || '6.0 - 7.0',
      substrateTypeDescription:
        'Lekkie, próchniczne, równomiernie wilgotne podłoże bogate w organiczne składniki (pH 6.0–7.0).',
    };
  }

  // 6. Warzywa korzeniowe (Marchew, Rzodkiewka, Burak, Pietruszka)
  if (
    plantNameLower.includes('marchew') ||
    plantNameLower.includes('rzodkiew') ||
    plantNameLower.includes('burak')
  ) {
    return {
      primarySearchTerm: 'Lekka ziemia do warzyw korzeniowych',
      searchKeywords: [
        'Ziemia do wysiewu i warzyw BIO',
        'Podłoże uniwersalne warzywne rozluźnione piaskiem',
        'Ziemia kompostowa z perlitem',
      ],
      recommendedProducers: TOP_SOIL_PRODUCERS,
      compositionTips: [
        'Gleba musi być wyjątkowo sypka i pozbawiona grud/kamieni do głębokości 20–30 cm, aby korzenie nie rozwidlały się i rosły prosto.',
        'Warto dodać 20% drobnego piasku i perlitu.',
      ],
      whatToAvoid: [
        'Świeży obornik (powoduje widłowanie korzeni i pękanie) oraz kamieniste, zbite podłoża.',
      ],
      idealPh: phRange,
      substrateTypeDescription:
        'Bardzo lekka, głęboko spulchniona, piaszczysto-próchniczna gleba bez grudek (pH 6.0–6.8).',
    };
  }

  // 7. Grzyby
  if (plantGroup === 'grzyby' || plantNameLower.includes('boczniak') || plantNameLower.includes('pieczark')) {
    return {
      primarySearchTerm: 'Substrat do uprawy grzybów / trociny liściaste',
      searchKeywords: [
        'Gotowy substrat zaszczepiony grzybnią boczniaka',
        'Trociny z drzew liściastych zbuforowane',
        'Podłoże pieczarkowe z okrywą torfową',
      ],
      recommendedProducers: [
        {
          name: 'Polskie Grzyby / Mycelium Lab',
          badge: 'Specjalista Mykologiczny ⭐⭐⭐⭐⭐',
          recommendedProducts: [
            'Kostka ze słomy zaszczepiona grzybnią Boczniaka',
            'Gotowy zestaw do uprawy Pieczarki z okrywą',
          ],
          rating: '4.8 / 5.0',
          whyGood: 'Przebadana mikrobiologicznie grzybnia z gwarancją owocnikowania.',
          priceLevel: 'Średnia',
        },
      ],
      compositionTips: [
        'Do grzybów nie używa się zwykłej ziemi – stosuje się sprasowaną słomę, trociny drzew liściastych lub zaszczepiony substrat.',
      ],
      whatToAvoid: ['Zwykła ziemia ogrodnicza z nawozem mineralnym.'],
      idealPh: '6.0 - 7.5',
      substrateTypeDescription:
        'Pasteryzowany substrat słomiany lub trocinowy z okrywą torfową zaszczepiony grzybnią.',
    };
  }

  // 8. Domyślne / Uniwersalne warzywa liściowe i inne
  return {
    primarySearchTerm: 'Ziemia do warzyw i ziół BIO',
    searchKeywords: [
      'Ziemia do warzyw i ziół BIO',
      'Podłoże uniwersalne ogrodnicze z perlitem',
      'Ziemia warzywna z kompostem i biohumusem',
      'Ekologiczne podłoże do upraw doniczkowych',
    ],
    recommendedProducers: TOP_SOIL_PRODUCERS,
    compositionTips: [
      'Wybieraj ziemię oznaczoną jako BIO / Warzywa / Zioła – ma optymalną strukturę frakcyjną i bezpieczną dawkę nawozów organicznych.',
      'Zawsze warto domieszać 15–20% perlitu lub wermikulitu, co poprawia napowietrzenie bryły korzeniowej w pojemnikach.',
    ],
    whatToAvoid: [
      'Najtańsze podłoża torfowe bez domieszek rozluźniających, które po wyschnięciu kurczą się i odklejają od ścianek donicy.',
    ],
    idealPh: phRange,
    substrateTypeDescription:
      'Uniwersalne, żyzne i próchniczne podłoże ogrodnicze wzbogacone perlitem i biohumusem (pH 6.0–6.8).',
  };
}
