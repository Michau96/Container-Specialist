import { UserBalconySpec, Plant, CalendarResponse, WeatherData, RegionInfo, PolandRegionKey, Orientation } from '../types';

export const DEFAULT_BALCONY_SPEC: UserBalconySpec = {
  region: 'mazowieckie',
  floor: 3,
  orientation: 'S',
  balcony_type: 'open_rail',
  roofing: 'uncovered',
  pots: ['boxes_balcony_15cm', 'pots_medium_5_15', 'pots_large_15_30'],
  care_time: 'daily',
};

export const POLAND_REGIONS: Record<PolandRegionKey, RegionInfo> = {
  dolnoslaskie: {
    name: 'Dolnośląskie (np. Wrocław, Legnica, Wałbrzych)',
    zone: '7b / 7a',
    macroregion: 'Południowy Zachód',
    climate_notes: 'Najdłuższy okres wegetacyjny w Polsce (do 225 dni). Sezon zaczyna się 7-10 dni wcześniej niż w centrum.',
    lat: 51.1079,
    lon: 17.0385,
    frost_shift_days: -7,
  },
  kujawsko_pomorskie: {
    name: 'Kujawsko-Pomorskie (np. Bydgoszcz, Toruń, Włocławek)',
    zone: '6b / 7a',
    macroregion: 'Północ / Centrum',
    climate_notes: 'Ciepłe, stosunkowo suche lata. Dobra dostępność słońca na nizinnych balkonach.',
    lat: 53.0138,
    lon: 18.5984,
    frost_shift_days: -2,
  },
  lubelskie: {
    name: 'Lubelskie (np. Lublin, Zamość, Chełm)',
    zone: '6b',
    macroregion: 'Wschód',
    climate_notes: 'Duże nasłonecznienie w sezonie letnim, żyzne podłoża, ostre wschodnie wiatry zimą.',
    lat: 51.2465,
    lon: 22.5684,
    frost_shift_days: 3,
  },
  lubuskie: {
    name: 'Lubuskie (np. Zielona Góra, Gorzów Wlkp.)',
    zone: '7b / 7a',
    macroregion: 'Zachód',
    climate_notes: 'Ciepły region winiarski, wczesna wiosna i łagodne zimy. Znakomite warunki dla pomidorów i ziół.',
    lat: 51.9356,
    lon: 15.5062,
    frost_shift_days: -6,
  },
  lodzkie: {
    name: 'Łódzkie (np. Łódź, Piotrków Tryb., Pabianice)',
    zone: '6b',
    macroregion: 'Centrum',
    climate_notes: 'Serce Polski, stabilny klimat nizinny. Standardowy termin wysadzania po Zimnej Zośce (15 maja).',
    lat: 51.7592,
    lon: 19.4560,
    frost_shift_days: 0,
  },
  malopolskie: {
    name: 'Małopolskie (np. Kraków, Tarnów, Nowy Sącz)',
    zone: '6b / 6a',
    macroregion: 'Południe',
    climate_notes: 'Ciepłe lata, wysoka wilgotność w dolinach rzek, ryzyko chorób grzybowych (mączniak, zaraza).',
    lat: 50.0647,
    lon: 19.9450,
    frost_shift_days: 2,
  },
  mazowieckie: {
    name: 'Mazowieckie (np. Warszawa, Radom, Płock)',
    zone: '6b',
    macroregion: 'Centrum',
    climate_notes: 'Umiarkowany okres wegetacyjny (~205-210 dni). Typowe wiosenne przymrozki majowe (12-15 maja).',
    lat: 52.2297,
    lon: 21.0122,
    frost_shift_days: 0,
  },
  opolskie: {
    name: 'Opolskie (np. Opole, Kędzierzyn-Koźle, Nysa)',
    zone: '7a / 7b',
    macroregion: 'Południowy Zachód',
    climate_notes: 'Bardzo ciepła Nizina Śląska, łagodne zimy i długi okres wegetacyjny sprzyjający ciepłolubnym warzywom.',
    lat: 50.6751,
    lon: 17.9213,
    frost_shift_days: -5,
  },
  podkarpackie: {
    name: 'Podkarpackie (np. Rzeszów, Przemyśl, Krosno)',
    zone: '6b / 6a',
    macroregion: 'Południowy Wschód',
    climate_notes: 'Słoneczne i gorące lata. W kotlinach podgórskich chłodniejsze noce w maju i wrześniu.',
    lat: 50.0412,
    lon: 21.9991,
    frost_shift_days: 3,
  },
  podlaskie: {
    name: 'Podlaskie (np. Białystok, Suwałki, Łomża)',
    zone: '6a / 5b (polski biegun zimna)',
    macroregion: 'Północny Wschód',
    climate_notes: 'Krótszy okres wegetacyjny (~180-190 dni). Przymrozki możliwe jeszcze pod koniec maja! Wskazane odmiany wczesne.',
    lat: 53.1325,
    lon: 23.1688,
    frost_shift_days: 10,
  },
  pomorskie: {
    name: 'Pomorskie (np. Gdańsk, Gdynia, Słupsk)',
    zone: '7a (nadmorska)',
    macroregion: 'Północ',
    climate_notes: 'Łagodne zimy, ale silne wiatry od morza i opóźniona wiosna. Rośliny wymagają osłony przed wiatrem.',
    lat: 54.3520,
    lon: 18.6466,
    frost_shift_days: 5,
  },
  slaskie: {
    name: 'Śląskie (np. Katowice, Bielsko-Biała, Gliwice)',
    zone: '6b',
    macroregion: 'Południe',
    climate_notes: 'Ciepły miejski mikroklimat aglomeracji, wczesne nagrzewanie się balkonów i podłoży doniczkowych.',
    lat: 50.2649,
    lon: 19.0238,
    frost_shift_days: -2,
  },
  swietokrzyskie: {
    name: 'Świętokrzyskie (np. Kielce, Ostrowiec Św., Sandomierz)',
    zone: '6b / 6a',
    macroregion: 'Centrum / Południe',
    climate_notes: 'Wyżynny klimat, ciepłe stoki i doliny rzeczne (zagłębie sadownicze), dobre nasłonecznienie.',
    lat: 50.8661,
    lon: 20.6286,
    frost_shift_days: 2,
  },
  warminsko_mazurskie: {
    name: 'Warmińsko-Mazurskie (np. Olsztyn, Elbląg, Ełk)',
    zone: '6a',
    macroregion: 'Północ',
    climate_notes: 'Klimat pojezierzy, wysoka wilgotność powietrza, chłodniejsze noce wiosną. Wskazane odmiany odporniejsze na chłód.',
    lat: 53.7784,
    lon: 20.4801,
    frost_shift_days: 6,
  },
  wielkopolskie: {
    name: 'Wielkopolskie (np. Poznań, Kalisz, Konin)',
    zone: '7a',
    macroregion: 'Zachód',
    climate_notes: 'Ciepły region, wczesna wiosna, lecz częste susze letnie – donice wymagają dobrej retencji wody.',
    lat: 52.4064,
    lon: 16.9252,
    frost_shift_days: -4,
  },
  zachodniopomorskie: {
    name: 'Zachodniopomorskie (np. Szczecin, Koszalin, Świnoujście)',
    zone: '7b / 7a',
    macroregion: 'Północny Zachód',
    climate_notes: 'Silny wpływ oceaniczny, bardzo łagodne zimy, rzadkie przymrozki, silniejsze wiatry nadmorskie.',
    lat: 53.4285,
    lon: 14.5528,
    frost_shift_days: -5,
  },
};

export interface OrientationOption {
  key: Orientation;
  label: string;
  badge: string;
  group: 'glowne' | 'posrednie' | 'precyzyjne' | 'narozne_specjalne';
  sunHours: string;
  desc: string;
  thermal: string;
}

export const ORIENTATION_OPTIONS: OrientationOption[] = [
  // 1. Główne strony świata
  {
    key: 'S',
    label: 'Południe (S)',
    badge: '6-8h słońca',
    group: 'glowne',
    sunHours: '6-8+ godzin',
    desc: 'Pełne, intensywne słońce przez większość dnia. Raj dla pomidorów, papryk, melonów i bazylii.',
    thermal: 'Gorący mikroklimat, szybkie przesychanie podłoża',
  },
  {
    key: 'E',
    label: 'Wschód (E)',
    badge: '3-5h słońca',
    group: 'glowne',
    sunHours: '3-5 godzin',
    desc: 'Łagodne słońce o poranku, brak popołudniowego skwaru. Ziemia nie przegrzewa się, idealne dla truskawek, sałat i ziół.',
    thermal: 'Umiarkowany, poranny rozruch bez przegrzewania',
  },
  {
    key: 'W',
    label: 'Zachód (W)',
    badge: '4-6h słońca',
    group: 'glowne',
    sunHours: '4-6 godzin',
    desc: 'Mocne, nagrzewające słońce od 13:00 aż do zmierzchu. Rozgrzane mury oddają ciepło jeszcze w nocy.',
    thermal: 'Ciepły, wieczorny żar i wiatry zachodnie',
  },
  {
    key: 'N',
    label: 'Północ (N)',
    badge: '<3h słońca',
    group: 'glowne',
    sunHours: '< 3 godzin',
    desc: 'Cień i kojący chłód. Brak palącego słońca, wysoka wilgotność. Świetne dla mięty, szczypiorku, sałat i jarmużu.',
    thermal: 'Chłodny mikroklimat, podłoże długo trzyma wilgoć',
  },

  // 2. Pośrednie strony świata
  {
    key: 'SE',
    label: 'Południowy Wschód (SE)',
    badge: '5-7h słońca',
    group: 'posrednie',
    sunHours: '5-7 godzin',
    desc: 'Harmonijne słońce od rana do wczesnego popołudnia bez męczącego popołudniowego upału.',
    thermal: 'Bardzo korzystny, optymalny bilans termiczny',
  },
  {
    key: 'SW',
    label: 'Południowy Zachód (SW)',
    badge: '6-8h słońca',
    group: 'posrednie',
    sunHours: '6-8 godzin',
    desc: 'Najgorętsza i najdłużej doświetlona wystawa. Rewelacyjna dla arbuza, papryki chili i pomidorów.',
    thermal: 'Bardzo gorący, wymaga regularnego podlewania',
  },
  {
    key: 'NE',
    label: 'Północny Wschód (NE)',
    badge: '3-4h słońca',
    group: 'posrednie',
    sunHours: '3-4 godziny',
    desc: 'Światło wczesnym rankiem, chłód i cień przez pozostałą część dnia. Chroni liście przed przypaleniem.',
    thermal: 'Umiarkowanie chłodny, raj dla poziomek i ziół',
  },
  {
    key: 'NW',
    label: 'Północny Zachód (NW)',
    badge: '3-5h słońca',
    group: 'posrednie',
    sunHours: '3-5 godzin',
    desc: 'Cień przez pierwszą połowę dnia, po czym ciepłe słońce od późnego popołudnia aż do zmierzchu.',
    thermal: 'Chłodny poranek, ciepły wieczór',
  },

  // 3. Precyzyjna róża wiatrów (16-kierunkowa)
  {
    key: 'SSE',
    label: 'Płd-Płd-Wschód (SSE)',
    badge: '6-7h słońca',
    group: 'precyzyjne',
    sunHours: '6-7 godzin',
    desc: 'Dominujące słońce południowe z wczesnym porannym doświetleniem. Bardzo wysoka plenność.',
    thermal: 'Ciepły i stabilny termicznie',
  },
  {
    key: 'SSW',
    label: 'Płd-Płd-Zachód (SSW)',
    badge: '6-8h słońca',
    group: 'precyzyjne',
    sunHours: '6-8 godzin',
    desc: 'Ekspozycja południowa z silnym nagrzewaniem popołudniowym. Świetna dla ciepłolubnych warzyw.',
    thermal: 'Gorący, wymaga głębszych donic',
  },
  {
    key: 'ESE',
    label: 'Wsch-Płd-Wschód (ESE)',
    badge: '5-6h słońca',
    group: 'precyzyjne',
    sunHours: '5-6 godzin',
    desc: 'Wyraźne słońce od świtu do około 13:30. Bardzo korzystna równowaga świetlna.',
    thermal: 'Umiarkowanie ciepły bez przegrzewania',
  },
  {
    key: 'ENE',
    label: 'Wsch-Płn-Wschód (ENE)',
    badge: '3-4h słońca',
    group: 'precyzyjne',
    sunHours: '3-4 godziny',
    desc: 'Słońce o świcie, w ciągu dnia przyjemny cień. Ziemia w donicach nie wysycha gwałtownie.',
    thermal: 'Łagodny, wysoka wilgotność',
  },
  {
    key: 'WSW',
    label: 'Zach-Płd-Zachód (WSW)',
    badge: '5-7h słońca',
    group: 'precyzyjne',
    sunHours: '5-7 godzin',
    desc: 'Duża dawka mocnego słońca od godzin południowych aż po zachód.',
    thermal: 'Mocno nagrzewające się ściany',
  },
  {
    key: 'WNW',
    label: 'Zach-Płn-Zachód (WNW)',
    badge: '3-5h słońca',
    group: 'precyzyjne',
    sunHours: '3-5 godzin',
    desc: 'Słońce dociera po godzinie 14:00-15:00. Dobre warunki dla roślin średnio-wymagających.',
    thermal: 'Umiarkowany ze słonecznym wieczorem',
  },
  {
    key: 'NNW',
    label: 'Płn-Płn-Zachód (NNW)',
    badge: '2-3h słońca',
    group: 'precyzyjne',
    sunHours: '2-3 godziny',
    desc: 'Stanowisko o przewadze cienia z promieniami zachodzącego słońca.',
    thermal: 'Chłodniejszy mikroklimat',
  },
  {
    key: 'NNE',
    label: 'Płn-Płn-Wschód (NNE)',
    badge: '2-3h słońca',
    group: 'precyzyjne',
    sunHours: '2-3 godziny',
    desc: 'Stanowisko cieniste z promieniami wczesnoporannymi.',
    thermal: 'Chłodniejszy mikroklimat',
  },

  // 4. Balkony narożne dwustronne i specjalne układy
  {
    key: 'S_W',
    label: 'Narożny: Południe + Zachód (S+W)',
    badge: '8-10h słońca (Dwie ściany)',
    group: 'narozne_specjalne',
    sunHours: '8-10 godzin',
    desc: 'Dwie otwarte strony świata! Maksymalna dawka słońca od południa aż do zmierzchu. Spektakularne plony.',
    thermal: 'Ekstremalnie ciepły mikroklimat, nawadnianie priorytetem',
  },
  {
    key: 'S_E',
    label: 'Narożny: Południe + Wschód (S+E)',
    badge: '7-9h słońca (Dwie ściany)',
    group: 'narozne_specjalne',
    sunHours: '7-9 godzin',
    desc: 'Dwie otwarte strony świata! Pełne światło od świtu do popołudnia. Uznawany za najlepszy układ balkonowy.',
    thermal: 'Bardzo ciepły i harmonijny',
  },
  {
    key: 'N_W',
    label: 'Narożny: Północ + Zachód (N+W)',
    badge: '4-6h słońca (Dwie ściany)',
    group: 'narozne_specjalne',
    sunHours: '4-6 godzin',
    desc: 'Cień rano na ścianie północnej oraz intensywne słońce od popołudnia na ścianie zachodniej.',
    thermal: 'Zróżnicowane mikrostrefy na jednym balkonie',
  },
  {
    key: 'N_E',
    label: 'Narożny: Północ + Wschód (N+E)',
    badge: '4-5h słońca (Dwie ściany)',
    group: 'narozne_specjalne',
    sunHours: '4-5 godzin',
    desc: 'Poranne słońce od wschodu, a reszta dnia w chłodnym, osłoniętym cieniu.',
    thermal: 'Umiarkowany chłód, świetny na zioła i owoce leśne',
  },
  {
    key: 'E_W',
    label: 'Przelotowy / Dwustronny (E+W)',
    badge: 'Słońce rano i popołudniu',
    group: 'narozne_specjalne',
    sunHours: '6-8 godzin łącznie',
    desc: 'Mieszkanie na wskroś lub dwa balkony – poranne słońce na wschodzie i zachodzące na zachodzie.',
    thermal: 'Możliwość rotacji roślin między stanowiskami',
  },
  {
    key: 'PATIO',
    label: 'Dziedziniec / Studnia kamienicy',
    badge: 'Światło rozproszone',
    group: 'narozne_specjalne',
    sunHours: '1-3 godziny bezpośrednie',
    desc: 'Zabudowany dziedziniec lub studnia miejska. Światło odbite i rozproszone, absolutny brak porywistego wiatru.',
    thermal: 'Wyższa wilgotność, stabilne warunki bez wysuszających podmuchów',
  },
  {
    key: 'DACH',
    label: 'Otwarty taras dachowy (360°)',
    badge: 'Całodzienne słońce 360°',
    group: 'narozne_specjalne',
    sunHours: '10+ godzin',
    desc: 'Brak jakichkolwiek barier i zacienienia. Maksymalne słońce przez cały dzień, lecz silniejsze podmuchy wiatru.',
    thermal: 'Intensywne promieniowanie, zalecane ciężkie donice z drenażem',
  },
];

const STORAGE_KEY = 'balkonowy_ogrod_user_spec';
const ONBOARDING_KEY = 'balkonowy_ogrod_has_onboarded';

export function loadSavedSpec(): UserBalconySpec {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to read saved balcony spec:', e);
  }
  return DEFAULT_BALCONY_SPEC;
}

export function saveUserSpec(spec: UserBalconySpec): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(spec));
    localStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (e) {
    console.warn('Failed to save balcony spec:', e);
  }
}

export function hasUserOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function fetchRecommendations(userSpec: UserBalconySpec): Promise<Plant[]> {
  const res = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_spec: userSpec }),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch recommendations: ${res.statusText}`);
  }
  const data = await res.json();
  return data.recommendations;
}

export async function fetchCalendar(userSpec: UserBalconySpec, periodId?: string): Promise<CalendarResponse> {
  const res = await fetch('/api/calendar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_spec: userSpec, period_id: periodId }),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch calendar: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchWeather(userSpec: UserBalconySpec): Promise<WeatherData> {
  const region = POLAND_REGIONS[userSpec.region] || POLAND_REGIONS.mazowieckie;
  const url = `/api/weather?lat=${region.lat}&lon=${region.lon}&region=${userSpec.region}&floor=${userSpec.floor}&orientation=${userSpec.orientation}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch weather: ${res.statusText}`);
  }
  return res.json();
}

export function getCurrentPeriodId(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const half = now.getDate() <= 15 ? 1 : 2;
  return `${String(month).padStart(2, '0')}_${half}`;
}
