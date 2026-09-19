import { Plant, GreenhouseSuitability, GreenhouseRecommendation, WeatherData } from '../types';

/**
 * Baza wiedzy o uprawie w balkonowych mini-szklarniach, regałach z folią i inspektach balkonowych.
 */

// Słowa kluczowe roślin, dla których mini-szklarnia jest wysoce zalecana
const RECOMMENDED_PLANT_KEYWORDS = [
  'pomidor',
  'papryk',
  'chili',
  'jalapeno',
  'habanero',
  'bakłażan',
  'oberżyn',
  'ogórek',
  'ogorek',
  'cukini',
  'dyni',
  'melon',
  'arbuz',
  'bazyli',
  'miechunk',
  'batat',
];

// Słowa kluczowe roślin, dla których mini-szklarnia jest niezalecana (ryzyko chorób, stojącego powietrza lub przegrzania)
const NOT_RECOMMENDED_PLANT_KEYWORDS = [
  'lawend',
  'rozmaryn',
  'tymianek',
  'oregano',
  'szałwi',
  'szalwi',
  'cząber',
  'czaber',
  'jarmuż',
  'jarmuz',
  'grzyb',
  'boczniak',
  'pieczark',
  'kiełk',
  'kielk',
];

/**
 * Zwraca ekspercką ocenę przydatności balkonowej szklarni dla danej rośliny.
 */
export function getPlantGreenhouseInfo(
  plant: {
    id?: string;
    name?: string;
    plant_group?: string;
    greenhouse_recommendation?: GreenhouseSuitability;
  }
): GreenhouseRecommendation {
  const nameLower = (plant.name || '').toLowerCase();
  const idLower = (plant.id || '').toLowerCase();
  const group = plant.plant_group || '';

  // 1. Sprawdź jawny atrybut w roślinie
  if (plant.greenhouse_recommendation === 'recommended') {
    return createRecommendedInfo(plant.name || 'Roślina ciepłolubna');
  }
  if (plant.greenhouse_recommendation === 'not_recommended') {
    return createNotRecommendedInfo(plant.name || 'Roślina');
  }
  if (plant.greenhouse_recommendation === 'optional') {
    return createOptionalInfo(plant.name || 'Roślina');
  }

  // 2. Grzyby i kiełki - nie do szklarni balkonowej
  if (group === 'grzyby' || group === 'kielki') {
    return {
      suitability: 'not_recommended',
      label: 'Niezalecana (wymaga innych warunków)',
      badgeLabel: 'Otwarty balkon / Dom',
      badgeTone: 'stone',
      icon: '🏠',
      temperatureGain: 'Brak zysku – ryzyko zaparzenia',
      reason:
        group === 'grzyby'
          ? 'Grzyby wymagają chłodu, wysokiej wilgotności bez bezpośredniego słońca i zacienienia. W szklarni ulegną ugotowaniu.'
          : 'Kiełki uprawia się w zacienionej kuchni na kiełkownicy, szklarnia balkonowa jest zbyt nasłoneczniona.',
      risksAndVentilation: 'Zapewnij chłodne, przewiewne stanowisko z dala od nagrzewających się osłon.',
      practicalTip: 'Prowadź uprawę na domowym parapecie lub w ocienionym zakątku balkonu.',
    };
  }

  // 3. Sprawdź listę niezalecanych (zioła śródziemnomorskie itp.)
  const isNotRecommended = NOT_RECOMMENDED_PLANT_KEYWORDS.some(
    (kw) => nameLower.includes(kw) || idLower.includes(kw)
  );
  if (isNotRecommended) {
    return createNotRecommendedInfo(plant.name || 'Roślina');
  }

  // 4. Sprawdź listę wybitnie zalecanych (pomidory, papryki, ogórki, bazylia)
  const isRecommended = RECOMMENDED_PLANT_KEYWORDS.some(
    (kw) => nameLower.includes(kw) || idLower.includes(kw)
  );
  if (isRecommended) {
    return createRecommendedInfo(plant.name || 'Roślina ciepłolubna');
  }

  // 5. Domyślnie dla pozostałych warzyw, owoców, ziół (truskawki, sałaty, rzodkiewki, kwiaty)
  return createOptionalInfo(plant.name || 'Roślina');
}

function createRecommendedInfo(plantName: string): GreenhouseRecommendation {
  return {
    suitability: 'recommended',
    label: 'Wysoce zalecana mini-szklarnia',
    badgeLabel: 'Zalecana mini-szklarnia',
    badgeTone: 'emerald',
    icon: '🏡',
    temperatureGain: '+4°C do +8°C w słońcu • ochrona przed wiatrem',
    reason: `${plantName} to gatunek ciepłolubny o długim okresie wegetacji. Mini-szklarnia lub regał z folią chroni sadzonki przed wiosennymi chłodami, przyspiesza wzrost o 2–3 tygodnie i drastycznie zwiększa plon na balkonie.`,
    risksAndVentilation:
      'W słoneczne dni powyżej 18°C na zewnątrz koniecznie rozepnij zamek szklarni. Temperatura w zamknięciu może przekroczyć 35°C i poparzyć kwiaty.',
    practicalTip:
      'W zamkniętej szklarni brak wiatru i owadów. Delikatnie potrząsaj kwitnącymi krzaczkami w południe, by wspomóc samozapylenie.',
  };
}

function createOptionalInfo(plantName: string): GreenhouseRecommendation {
  return {
    suitability: 'optional',
    label: 'Opcjonalna (idealna wczesną wiosną)',
    badgeLabel: 'Szklarnia opcjonalna',
    badgeTone: 'amber',
    icon: '🌤️',
    temperatureGain: '+3°C do +5°C wczesną wiosną',
    reason: `${plantName} zyskuje na szklarni wczesną wiosną (luty–kwiecień) przy kiełkowaniu i rozsadzie. W upalne letnie miesiące roślina preferuje jednak swobodny przewiew na otwartym balkonie.`,
    risksAndVentilation:
      'Uwaga latem: wysokie temperatury w szklarni mogą wywołać przedwczesne wybicie w pędy kwiatowe (np. u sałat i rzodkiewek) lub ograniczyć zapylanie przez pszczoły.',
    practicalTip:
      'Używaj szklarni jako startera wiosennego. Gdy miną majowe przymrozki i ustabilizuje się pogoda, przenieś donicę na otwarty balkon.',
  };
}

function createNotRecommendedInfo(plantName: string): GreenhouseRecommendation {
  return {
    suitability: 'not_recommended',
    label: 'Niezalecana (otwarty balkon)',
    badgeLabel: 'Otwarty balkon (nie szklarnia)',
    badgeTone: 'rose',
    icon: '🌿',
    temperatureGain: 'Zbędna – ryzyko chorób grzybowych',
    reason: `${plantName} kocha suchy, swobodny przepływ powietrza i bezpośrednie słońce. W zamkniętej szklarni balkonowej zbiera się para wodna, co sprzyja mączniakowi, szarej pleśni i gniciu korzeni.`,
    risksAndVentilation:
      'W stojącym, wilgotnym mikroklimacie roślina traci aromat, staje się wiotka i jest podatna na przędziorki oraz choroby grzybowe.',
    practicalTip:
      'Zapewnij donicy przewiewne, jasne miejsce bezpośrednio na balkonie z odpływem nadmiaru wody.',
  };
}

/**
 * Generuje kontekstową poradę pielęgnacyjną na dziś w oparciu o stan uprawy w szklarni i pogodę.
 */
export function getGreenhouseDailyCareTip(
  plant: Plant,
  inGreenhouse: boolean,
  weather: WeatherData | null
): {
  headline: string;
  detail: string;
  actionRequired: boolean;
  alertTone: 'amber' | 'emerald' | 'sky';
} {
  const temp = weather?.temperature ?? 15;
  const isSunny = (weather?.weather_code ?? 0) <= 2;
  const isRaining = (weather?.precipitation ?? 0) > 0.5 || (weather?.weather_code ?? 0) >= 51;
  const greenhouseInfo = getPlantGreenhouseInfo(plant);

  if (inGreenhouse) {
    if (temp >= 19 && isSunny) {
      return {
        headline: 'Wietrzenie szklarni konieczne!',
        detail: `Dziś jest ciepło (${Math.round(temp)}°C) i słonecznie. W małej szklarni temperatura przekroczy 32°C. Otwórz klapę lub rozsuń zamek, aby zapobiec ugotowaniu ${plant.name}.`,
        actionRequired: true,
        alertTone: 'amber',
      };
    }
    if (temp <= 6) {
      return {
        headline: 'Szklarnia chroni przed chłodem',
        detail: `Niska temperatura na zewnątrz (${Math.round(temp)}°C). Osłona szklarni daje cenne +3°C do +5°C buforu. Zasuń szczelnie zamki na noc.`,
        actionRequired: false,
        alertTone: 'emerald',
      };
    }
    if (isRaining) {
      return {
        headline: 'Roślina osłonięta przed ulewą',
        detail: `Pod osłoną szklarni podłoże nie wypłukuje się podczas deszczu. Pamiętaj jednak o manualnym podlaniu bryły korzeniowej, gdyż deszcz do niej nie dociera!`,
        actionRequired: true,
        alertTone: 'sky',
      };
    }
    return {
      headline: 'Mikroklimat szklarniowy aktywny',
      detail: `Podwyższona wilgotność i stała temperatura sprzyjają wegetacji. Pamiętaj o lekkim przewietrzeniu w godzinach południowych.`,
      actionRequired: false,
      alertTone: 'emerald',
    };
  }

  // Roślina na otwartym balkonie
  if (greenhouseInfo.suitability === 'recommended' && temp < 14) {
    return {
      headline: 'Szklarnia dałaby dużą przewagę',
      detail: `${plant.name} rośnie znacznie bujniej w cieple. Gdy temperatura spada poniżej 14°C, rozważ osłonięcie donicy mini-szklarnią lub kapturem z agrowłókniny.`,
      actionRequired: false,
      alertTone: 'amber',
    };
  }

  return {
    headline: 'Uprawa na otwartym balkonie',
    detail: `Naturalna cyrkulacja powietrza wzmacnia pędy i ogranicza choroby grzybowe.`,
    actionRequired: false,
    alertTone: 'sky',
  };
}
