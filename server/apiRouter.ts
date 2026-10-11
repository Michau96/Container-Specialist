import { Router } from 'express';
import plantsData from './plants.json';

export interface UserBalconySpec {
  region?: string;
  floor?: number;
  orientation?: string;
  balcony_type?: string;
  roofing?: string;
  pots?: string[];
  care_time?: string;
}

export const POLAND_REGIONS: Record<string, any> = {
  dolnoslaskie: {
    name: 'Dolnośląskie (np. Wrocław, Legnica, Wałbrzych)',
    zone: '7b / 7a',
    climate_notes: 'Najdłuższy okres wegetacyjny w Polsce (do 225 dni). Sezon zaczyna się 7-10 dni wcześniej niż w centrum.',
    lat: 51.1079,
    lon: 17.0385,
    frost_shift_days: -7,
  },
  kujawsko_pomorskie: {
    name: 'Kujawsko-Pomorskie (np. Bydgoszcz, Toruń, Włocławek)',
    zone: '6b / 7a',
    climate_notes: 'Ciepłe, stosunkowo suche lata. Dobra dostępność słońca na nizinnych balkonach.',
    lat: 53.0138,
    lon: 18.5984,
    frost_shift_days: -2,
  },
  lubelskie: {
    name: 'Lubelskie (np. Lublin, Zamość, Chełm)',
    zone: '6b',
    climate_notes: 'Duże nasłonecznienie w sezonie letnim, żyzne podłoża, ostre wschodnie wiatry zimą.',
    lat: 51.2465,
    lon: 22.5684,
    frost_shift_days: 3,
  },
  lubuskie: {
    name: 'Lubuskie (np. Zielona Góra, Gorzów Wlkp.)',
    zone: '7b / 7a',
    climate_notes: 'Ciepły region winiarski, wczesna wiosna i łagodne zimy. Znakomite warunki dla pomidorów i ziół.',
    lat: 51.9356,
    lon: 15.5062,
    frost_shift_days: -6,
  },
  lodzkie: {
    name: 'Łódzkie (np. Łódź, Piotrków Tryb., Pabianice)',
    zone: '6b',
    climate_notes: 'Serce Polski, stabilny klimat nizinny. Standardowy termin wysadzania po Zimnej Zośce (15 maja).',
    lat: 51.7592,
    lon: 19.4560,
    frost_shift_days: 0,
  },
  malopolskie: {
    name: 'Małopolskie (np. Kraków, Tarnów, Nowy Sącz)',
    zone: '6b / 6a',
    climate_notes: 'Ciepłe lata, wysoka wilgotność w dolinach rzek, ryzyko chorób grzybowych (mączniak, zaraza).',
    lat: 50.0647,
    lon: 19.9450,
    frost_shift_days: 2,
  },
  mazowieckie: {
    name: 'Mazowieckie (np. Warszawa, Radom, Płock)',
    zone: '6b',
    climate_notes: 'Umiarkowany okres wegetacyjny (~205-210 dni). Typowe wiosenne przymrozki majowe (12-15 maja).',
    lat: 52.2297,
    lon: 21.0122,
    frost_shift_days: 0,
  },
  opolskie: {
    name: 'Opolskie (np. Opole, Kędzierzyn-Koźle, Nysa)',
    zone: '7a / 7b',
    climate_notes: 'Bardzo ciepła Nizina Śląska, łagodne zimy i długi okres wegetacyjny sprzyjający ciepłolubnym warzywom.',
    lat: 50.6751,
    lon: 17.9213,
    frost_shift_days: -5,
  },
  podkarpackie: {
    name: 'Podkarpackie (np. Rzeszów, Przemyśl, Krosno)',
    zone: '6b / 6a',
    climate_notes: 'Słoneczne i gorące lata. W kotlinach podgórskich chłodniejsze noce w maju i wrześniu.',
    lat: 50.0412,
    lon: 21.9991,
    frost_shift_days: 3,
  },
  podlaskie: {
    name: 'Podlaskie (np. Białystok, Suwałki, Łomża)',
    zone: '6a / 5b (polski biegun zimna)',
    climate_notes: 'Krótszy okres wegetacyjny (~180-190 dni). Przymrozki możliwe jeszcze pod koniec maja! Wskazane odmiany wczesne.',
    lat: 53.1325,
    lon: 23.1688,
    frost_shift_days: 10,
  },
  pomorskie: {
    name: 'Pomorskie (np. Gdańsk, Gdynia, Słupsk)',
    zone: '7a (nadmorska)',
    climate_notes: 'Łagodne zimy, ale silne wiatry od morza i opóźniona wiosna. Rośliny wymagają osłony przed wiatrem.',
    lat: 54.3520,
    lon: 18.6466,
    frost_shift_days: 5,
  },
  slaskie: {
    name: 'Śląskie (np. Katowice, Bielsko-Biała, Gliwice)',
    zone: '6b',
    climate_notes: 'Ciepły miejski mikroklimat aglomeracji, wczesne nagrzewanie się balkonów i podłoży doniczkowych.',
    lat: 50.2649,
    lon: 19.0238,
    frost_shift_days: -2,
  },
  swietokrzyskie: {
    name: 'Świętokrzyskie (np. Kielce, Ostrowiec Św., Sandomierz)',
    zone: '6b / 6a',
    climate_notes: 'Wyżynny klimat, ciepłe stoki i doliny rzeczne (zagłębie sadownicze), dobre nasłonecznienie.',
    lat: 50.8661,
    lon: 20.6286,
    frost_shift_days: 2,
  },
  warminsko_mazurskie: {
    name: 'Warmińsko-Mazurskie (np. Olsztyn, Elbląg, Ełk)',
    zone: '6a',
    climate_notes: 'Klimat pojezierzy, wysoka wilgotność powietrza, chłodniejsze noce wiosną. Wskazane odmiany odporniejsze na chłód.',
    lat: 53.7784,
    lon: 20.4801,
    frost_shift_days: 6,
  },
  wielkopolskie: {
    name: 'Wielkopolskie (np. Poznań, Kalisz, Konin)',
    zone: '7a',
    climate_notes: 'Ciepły region, wczesna wiosna, lecz częste susze letnie – donice wymagają dobrej retencji wody.',
    lat: 52.4064,
    lon: 16.9252,
    frost_shift_days: -4,
  },
  zachodniopomorskie: {
    name: 'Zachodniopomorskie (np. Szczecin, Koszalin, Świnoujście)',
    zone: '7b / 7a',
    climate_notes: 'Silny wpływ oceaniczny, bardzo łagodne zimy, rzadkie przymrozki, silniejsze wiatry nadmorskie.',
    lat: 53.4285,
    lon: 14.5528,
    frost_shift_days: -5,
  },
};

// Aliases
POLAND_REGIONS['kujawsko-pomorskie'] = POLAND_REGIONS['kujawsko_pomorskie'];
POLAND_REGIONS['warminsko-mazurskie'] = POLAND_REGIONS['warminsko_mazurskie'];

export const CALENDAR_PERIODS = [
  { id: '01_1', month: 1, half: 1, name: 'I połowa stycznia', short: 'Sty I' },
  { id: '01_2', month: 1, half: 2, name: 'II połowa stycznia', short: 'Sty II' },
  { id: '02_1', month: 2, half: 1, name: 'I połowa lutego', short: 'Lut I' },
  { id: '02_2', month: 2, half: 2, name: 'II połowa lutego', short: 'Lut II' },
  { id: '03_1', month: 3, half: 1, name: 'I połowa marca', short: 'Mar I' },
  { id: '03_2', month: 3, half: 2, name: 'II połowa marca', short: 'Mar II' },
  { id: '04_1', month: 4, half: 1, name: 'I połowa kwietnia', short: 'Kwi I' },
  { id: '04_2', month: 4, half: 2, name: 'II połowa kwietnia', short: 'Kwi II' },
  { id: '05_1', month: 5, half: 1, name: 'I połowa maja (przed Zimną Zośką)', short: 'Maj I' },
  { id: '05_2', month: 5, half: 2, name: 'II połowa maja (po Zimnej Zośce)', short: 'Maj II' },
  { id: '06_1', month: 6, half: 1, name: 'I połowa czerwca', short: 'Cze I' },
  { id: '06_2', month: 6, half: 2, name: 'II połowa czerwca', short: 'Cze II' },
  { id: '07_1', month: 7, half: 1, name: 'I połowa lipca', short: 'Lip I' },
  { id: '07_2', month: 7, half: 2, name: 'II połowa lipca', short: 'Lip II' },
  { id: '08_1', month: 8, half: 1, name: 'I połowa sierpnia', short: 'Sie I' },
  { id: '08_2', month: 8, half: 2, name: 'II połowa sierpnia', short: 'Sie II' },
  { id: '09_1', month: 9, half: 1, name: 'I połowa września', short: 'Wrz I' },
  { id: '09_2', month: 9, half: 2, name: 'II połowa września', short: 'Wrz II' },
  { id: '10_1', month: 10, half: 1, name: 'I połowa października', short: 'Paź I' },
  { id: '10_2', month: 10, half: 2, name: 'II połowa października', short: 'Paź II' },
  { id: '11_1', month: 11, half: 1, name: 'I połowa listopada', short: 'Lis I' },
  { id: '11_2', month: 11, half: 2, name: 'II połowa listopada', short: 'Lis II' },
  { id: '12_1', month: 12, half: 1, name: 'I połowa grudnia', short: 'Gru I' },
  { id: '12_2', month: 12, half: 2, name: 'II połowa grudnia', short: 'Gru II' },
];

export function getCurrentPeriodId(): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const half = now.getDate() <= 15 ? 1 : 2;
  return `${String(month).padStart(2, '0')}_${half}`;
}

const ORIENTATION_MAP: Record<string, any> = {
  S: { components: ['S'], sun_level: 'very_high', hours: '6-8h', is_north: false, is_south: true, label: 'Południe' },
  E: { components: ['E'], sun_level: 'medium', hours: '3-5h', is_north: false, is_south: false, label: 'Wschód' },
  W: { components: ['W'], sun_level: 'high', hours: '4-6h', is_north: false, is_south: false, label: 'Zachód' },
  N: { components: ['N'], sun_level: 'low', hours: '<3h', is_north: true, is_south: false, label: 'Północ' },
  SE: { components: ['SE', 'S', 'E'], sun_level: 'high', hours: '5-7h', is_north: false, is_south: true, label: 'Południowy Wschód' },
  SW: { components: ['SW', 'S', 'W'], sun_level: 'very_high', hours: '6-8h', is_north: false, is_south: true, label: 'Południowy Zachód' },
  NE: { components: ['NE', 'N', 'E'], sun_level: 'low_medium', hours: '3-4h', is_north: true, is_south: false, label: 'Północny Wschód' },
  NW: { components: ['NW', 'N', 'W'], sun_level: 'medium', hours: '3-5h', is_north: false, is_south: false, label: 'Północny Zachód' },
  SSE: { components: ['SSE', 'S', 'SE'], sun_level: 'very_high', hours: '6-7h', is_north: false, is_south: true, label: 'Płd-Płd-Wschód' },
  SSW: { components: ['SSW', 'S', 'SW'], sun_level: 'very_high', hours: '6-8h', is_north: false, is_south: true, label: 'Płd-Płd-Zachód' },
  ESE: { components: ['ESE', 'E', 'SE'], sun_level: 'high', hours: '5-6h', is_north: false, is_south: false, label: 'Wsch-Płd-Wschód' },
  ENE: { components: ['ENE', 'E', 'NE'], sun_level: 'medium', hours: '3-4h', is_north: false, is_south: false, label: 'Wsch-Płn-Wschód' },
  WSW: { components: ['WSW', 'W', 'SW'], sun_level: 'very_high', hours: '5-7h', is_north: false, is_south: true, label: 'Zach-Płd-Zachód' },
  WNW: { components: ['WNW', 'W', 'NW'], sun_level: 'medium', hours: '3-5h', is_north: false, is_south: false, label: 'Zach-Płn-Zachód' },
  NNW: { components: ['NNW', 'N', 'NW'], sun_level: 'low', hours: '2-3h', is_north: true, is_south: false, label: 'Płn-Płn-Zachód' },
  NNE: { components: ['NNE', 'N', 'NE'], sun_level: 'low', hours: '2-3h', is_north: true, is_south: false, label: 'Płn-Płn-Wschód' },
  S_W: { components: ['S_W', 'S', 'SW', 'W'], sun_level: 'maximum', hours: '8-10h', is_north: false, is_south: true, label: 'Narożnik Południe + Zachód' },
  S_E: { components: ['S_E', 'S', 'SE', 'E'], sun_level: 'maximum', hours: '7-9h', is_north: false, is_south: true, label: 'Narożnik Południe + Wschód' },
  N_W: { components: ['N_W', 'N', 'NW', 'W'], sun_level: 'medium', hours: '4-6h', is_north: false, is_south: false, label: 'Narożnik Północ + Zachód' },
  N_E: { components: ['N_E', 'N', 'NE', 'E'], sun_level: 'medium', hours: '4-5h', is_north: false, is_south: false, label: 'Narożnik Północ + Wschód' },
  E_W: { components: ['E_W', 'E', 'W'], sun_level: 'high', hours: '6-8h', is_north: false, is_south: false, label: 'Dwustronny Wschód + Zachód' },
  PATIO: { components: ['PATIO', 'N', 'E'], sun_level: 'diffused', hours: '1-3h', is_north: true, is_south: false, label: 'Dziedziniec / Patio' },
  DACH: { components: ['DACH', 'S', 'SW', 'SE', 'W', 'E'], sun_level: 'maximum_360', hours: '10+h (360°)', is_north: false, is_south: true, label: 'Otwarty taras dachowy' },
};

export function calculateSuitability(plant: any, userSpec: UserBalconySpec = {}) {
  let score = 100;
  const reasons: string[] = [];
  const warnings: string[] = [];
  const tips: string[] = [];

  const orientation = (userSpec.orientation || 'S').toUpperCase();
  const floor = Number(userSpec.floor ?? 2);
  const regionKey = String(userSpec.region || 'mazowieckie').replace(/-/g, '_');
  const pots = userSpec.pots || [];
  const careTime = userSpec.care_time || 'daily';

  const orientMeta = ORIENTATION_MAP[orientation] || {
    components: [orientation],
    sun_level: 'medium',
    hours: '3-5h',
    is_north: orientation.includes('N'),
    is_south: orientation.includes('S'),
    label: orientation,
  };
  const plantOrientations: string[] = plant.orientations || [];

  // 1. Ekspozycja i słońce
  const hasDirectMatch = plantOrientations.includes(orientation);
  const hasComponentMatch = orientMeta.components.some((c: string) => plantOrientations.includes(c));

  if (plant.plant_group === 'kielki') {
    score += 8;
    reasons.push('Mikrolistki i kiełki udają się znakomicie w każdych warunkach – potrzebują jedynie płaskiej tacki i światła dziennego.');
  } else if (plant.plant_group === 'grzyby') {
    if (orientMeta.is_north || ['E', 'NE', 'NW', 'PATIO'].includes(orientation)) {
      score += 12;
      reasons.push('Zacieniony i wilgotny mikroklimat Twojego balkonu to wymarzone warunki do owocowania grzybów!');
    } else if (orientMeta.is_south) {
      score -= 15;
      warnings.push('Grzyby nie znoszą bezpośredniego słońca. Ustaw pojemnik w zacienionym kącie (pod stolikiem, szafką lub osłoną).');
      tips.push('Zapewnij wysoką wilgotność powietrza (80-90%) przez częste zraszanie.');
    }
  } else if (hasDirectMatch || hasComponentMatch) {
    score += 6;
  } else if (orientMeta.is_north && ['Psiankowate', 'Dyniowate'].includes(plant.category)) {
    score -= 45;
    warnings.push(`Wystawa ${orientMeta.label} ma za mało bezpośredniego słońca (${orientMeta.hours}) – pomidory i papryki będą się wyciągać i słabo owocować.`);
  } else if (orientMeta.is_south && ['salata-listkowa', 'szpinak-balkonowy', 'roszponka'].includes(plant.id)) {
    score -= 20;
    warnings.push(`Na silnym słońcu (${orientMeta.label}) latem roślina szybko wybija w pędy kwiatowe. Wymaga cieniowania w godz. 11:00-15:00.`);
    tips.push('Ustaw doniczkę w cieniu wyższych pomidorów lub pod osłoną balustrady.');
  } else if (orientation === 'DACH') {
    if (plant.wind_tolerance === 'Niska') {
      score -= 25;
      warnings.push('Otwarty taras dachowy: bardzo silna ekspozycja na wiatr może łamać delikatne pędy.');
    } else {
      score += 8;
      reasons.push('Taras dachowy 360° zapewnia maksymalną dawkę promieniowania słonecznego przez cały dzień.');
    }
  } else if (orientation === 'PATIO') {
    if (['ziola', 'warzywa'].includes(plant.plant_group) && ['mieta-pieprzowa', 'roszponka', 'szczypiorek-ziola'].includes(plant.id)) {
      score += 8;
      reasons.push('Dziedziniec/patio zapewnia stabilny, wilgotny mikroklimat i doskonałą osłonę przed wiatrem.');
    } else {
      score -= 15;
      warnings.push('Światło rozproszone na patio opóźnia dojrzewanie owoców ciepłolubnych.');
    }
  } else {
    score -= 10;
    reasons.push(`Ekspozycja akceptowalna, choć roślina najlepiej czuje się na wystawach: ${plantOrientations.join(', ')}.`);
  }

  // 2. Piętro i wiatr
  const windTol = plant.wind_tolerance || 'Średnia';
  if (floor >= 7) {
    if (windTol.includes('Niska')) {
      score -= 30;
      warnings.push(`Wysokie piętro (${floor}. p.) – silne porywy wiatru mogą łamać pędy i drzeć liście. Konieczne osłonięcie loggią lub matą.`);
    } else if (windTol.includes('Wysoka') || windTol.includes('Bardzo wysoka')) {
      score += 8;
      reasons.push(`Roślina jest wybitnie odporna na porywisty wiatr typowy dla ${floor}. piętra.`);
    } else {
      score -= 10;
      warnings.push(`Na ${floor}. piętrze ziemia w donicy wysycha dwukrotnie szybciej z powodu wiatru.`);
    }
  } else if (floor === 0) {
    if (['szpinak-balkonowy', 'salata-listkowa', 'roszponka'].includes(plant.id)) {
      score += 5;
      reasons.push('Chłodniejszy i wilgotniejszy mikroklimat parteru sprzyja soczystym warzywom liściastym.');
    }
  }

  // 3. Posiadane donice
  const minVol = plant.pot?.min_volume_l ?? 5;
  let hasSuitablePot = false;
  if (pots.includes('pots_large_15_30') && minVol <= 30) {
    hasSuitablePot = true;
  } else if (pots.includes('pots_medium_5_15') && minVol <= 10) {
    hasSuitablePot = true;
  } else if (pots.includes('boxes_balcony_15cm') && minVol <= 5) {
    hasSuitablePot = true;
  } else if (pots.length === 0) {
    hasSuitablePot = true;
  }

  if (!hasSuitablePot && pots.length > 0) {
    score -= 35;
    warnings.push(`Ta roślina wymaga donicy minimum ${minVol}L. W mniejszych pojemnikach korzenie ulegną skarłowaceniu.`);
    tips.push(`Dokup pojemnik o pojemności co najmniej ${minVol} litrów i głębokości ${plant.pot?.min_depth_cm ?? 20} cm.`);
  } else {
    reasons.push(`Twoje donice spełniają wymóg minimalny (${minVol}L).`);
  }

  // 4. Czas na pielęgnację
  if (careTime === 'weekends') {
    if ((plant.difficulty ?? 3) >= 5) {
      score -= 25;
      warnings.push('Przy podlewaniu tylko w weekendy roślina uschnie w czasie letnich upałów bez automatycznego nawadniania.');
      tips.push('Zainstaluj kule nawadniające lub donicę z systemem samonawadniającym.');
    } else if (['ziola-srodziemnomorskie', 'szczypiorek-ziola', 'roszponka'].includes(plant.id)) {
      score += 10;
      reasons.push('Ta roślina doskonale znosi rzadsze podlewanie i wybacza weekendowy tryb opieki.');
    }
  }

  // 5. Region klimatyczny
  const regionInfo = POLAND_REGIONS[regionKey] || POLAND_REGIONS.mazowieckie;
  const shift = regionInfo?.frost_shift_days ?? 0;
  if (shift > 5 && plant.category === 'Psiankowate') {
    warnings.push(`Chłodniejszy region (${regionInfo.name}): Wiosenne przymrozki ustępują późno. Sadź na zewnątrz 7 dni później.`);
  } else if (shift < 0 && plant.category === 'Psiankowate') {
    reasons.push(`Cieplejszy region (${regionInfo.name}): Długi okres wegetacyjny sprzyja obfitym zbiorom.`);
  }

  score = Math.max(10, Math.min(99, score));

  return {
    score,
    suitability_level: score >= 80 ? 'Doskonały wybór' : score >= 60 ? 'Dobry wybór z uwagami' : 'Wymagający / Ryzykowny',
    reasons,
    warnings,
    tips,
  };
}

function buildCalendarResponse(userSpec: UserBalconySpec, periodId: string, plantIds?: string[] | null) {
  const currentPId = getCurrentPeriodId();
  const isCurrent = periodId === currentPId;
  const periodInfo = CALENDAR_PERIODS.find((p) => p.id === periodId) || CALENDAR_PERIODS[4];

  const actionLabels: Record<string, string> = {
    rozsada_dom: 'Wysiew w domu na rozsadę',
    siew_donica: 'Siew wprost do donicy na balkonie',
    hartowanie: 'Hartowanie rozsad (wietrzenie)',
    sadzenie_balkon: 'Sadzenie docelowe do donic na balkonie',
    pielegnacja: 'Intensywna pielęgnacja, zasilanie i nawadnianie',
    zbior: 'Zbiory świeżych warzyw, owoców i ziół',
    koniec_sezonu: 'Likwidacja uprawy i kompostowanie',
    zimowanie_dom: 'Przeniesienie donic do mieszkania na zimę',
    zimowanie_balkon: 'Zabezpieczenie mrozoodporne donic na balkonie',
  };

  const pillars: Record<string, any[]> = {
    siew: [],
    sadzenie: [],
    pielegnacja: [],
    zbior: [],
  };

  const actionsByType: Record<string, any[]> = {};

  const plantsList = plantsData as any[];

  for (const plant of plantsList) {
    if (plantIds && !plantIds.includes(plant.id)) continue;

    const sched = plant.schedule || {};
    const actionCode = sched[periodId];
    if (!actionCode) continue;

    const label = actionLabels[actionCode] || actionCode;
    if (!actionsByType[label]) actionsByType[label] = [];

    const suit = calculateSuitability(plant, userSpec);
    const topVar = plant.top_varieties || [];
    const varNames = plant.varieties || [];

    const rawVariety0 = varNames[0];
    const fallbackVarietyName =
      typeof rawVariety0 === 'string'
        ? rawVariety0
        : (rawVariety0 && typeof rawVariety0 === 'object' ? rawVariety0.name : '') || '';

    const itemData = {
      plant_id: plant.id,
      plant_name: plant.name,
      plant_group: plant.plant_group || 'warzywa',
      action_code: actionCode,
      difficulty: plant.difficulty,
      suitability_score: suit.score,
      pot_vol: plant.pot?.min_volume_l ?? 5,
      tip: suit.tips[0] || plant.summary,
      top_varieties: topVar,
      recommended_variety: (typeof topVar[0]?.name === 'string' ? topVar[0].name : '') || fallbackVarietyName,
      variety_badge: (typeof topVar[0]?.badge === 'string' ? topVar[0].badge : '') || '',
      soil_fertilizer: plant.soil?.fertilizer || 'Biohumus',
      nutrition: plant.nutrition || {},
      fertilizer_guide: plant.fertilizer_guide,
      spray_guide: plant.spray_guide,
      soil_layers: plant.soil_layers,
      spacing_guide: plant.spacing_guide,
    };

    actionsByType[label].push(itemData);

    if (['siew_donica', 'rozsada_dom'].includes(actionCode)) {
      const siewItem = {
        ...itemData,
        pillar: 'siew',
        action_detail: actionCode === 'rozsada_dom'
          ? 'Wysiew w domu na słonecznym parapecie (20-24°C) do wielodoniczek'
          : 'Siew bezpośrednio do docelowych skrzynek na balkonie',
      };
      pillars.siew.push(siewItem);
    } else if (['sadzenie_balkon', 'hartowanie'].includes(actionCode)) {
      const sadzItem = {
        ...itemData,
        pillar: 'sadzenie',
        action_detail: actionCode === 'hartowanie'
          ? 'Stopniowe hartowanie rozsad w ciepłe popołudnia przed przesadzeniem'
          : `Sadzenie docelowe do donicy min. ${plant.pot?.min_volume_l ?? 5}L z drenażem`,
      };
      pillars.sadzenie.push(sadzItem);
    } else if (actionCode === 'zbior') {
      const zbiorItem = {
        ...itemData,
        pillar: 'zbior',
        action_detail: 'Bieżący zbiór świeżych plonów – pobudza roślinę do dalszego wzrostu',
      };
      pillars.zbior.push(zbiorItem);
    }

    if (['pielegnacja', 'zbior', 'sadzenie_balkon'].includes(actionCode)) {
      const pielItem = {
        ...itemData,
        pillar: 'pielegnacja',
        action_detail: `Nawadnianie i zasilanie: ${plant.soil?.fertilizer || 'Biohumus'}`,
      };
      pillars.pielegnacja.push(pielItem);
    }
  }

  const seasonTips: string[] = [];
  const month = periodInfo.month;
  const half = periodInfo.half;

  if (month === 1 || month === 2) {
    seasonTips.push('Planowanie sezonu: skompletuj nasiona, keramzyt, perlit i sprawdź stan donic po zimie.');
    seasonTips.push('W drugiej połowie lutego możesz zacząć wysiewać na ciepłym parapecie ostre papryczki chili.');
  } else if (month === 3) {
    seasonTips.push('Marzec to czas wysiewu pomidorów na rozsadę w domu. Nie spiesz się z wystawianiem ich na zewnątrz!');
    seasonTips.push('W skrzynkach na balkonie można już siać wczesną rzodkiewkę i szpinak pod osłoną agrowłókniny.');
  } else if (month === 4) {
    seasonTips.push("Siej zioła odporne na chłód, marchew miniaturową 'Pariser Markt' i rukolę.");
    seasonTips.push('Pod koniec kwietnia rozpocznij stopniowe hartowanie rozsad pomidorów w ciepłe popołudnia.');
  } else if (month === 5) {
    if (half === 1) {
      seasonTips.push("UWAGA na 'Zimnych Ogrodników' (12-14 maja) i 'Zimną Zośkę' (15 maja) – przymrozki mogą zniszczyć rozsady!");
    } else {
      seasonTips.push('WIELKI START: Od 16 maja możesz bezpiecznie wystawić na balkon pomidory, papryki, ogórki i bazylię!');
      seasonTips.push('Pamiętaj o drenażu: każda donica musi mieć otwory odpływowe i warstwę keramzytu.');
    }
  } else if (month === 6 || month === 7) {
    seasonTips.push('Zadbaj o nawadnianie: na balkonach południowych ziemia w skrzynkach potrafi przeschnąć w 4 godziny.');
    seasonTips.push('Zasilaj rośliny biohumusem lub nawozem z potasem co 10-14 dni. Zbieraj sukcesywnie sałatę i rzodkiewkę.');
  } else if (month === 8) {
    seasonTips.push('Siewy poplonowe: zwolnione skrzynki po sałatach i rzodkiewce obsiej szpinakiem, roszponką i rzodkiewką na zbiór jesienny.');
  } else if (month === 9) {
    seasonTips.push('Ostatnie zbiory pomidorów i papryk. Zielone owoce zerwij przed przymrozkami i pozwól im dojrzeć na parapecie obok jabłek.');
  } else if (month >= 10) {
    seasonTips.push('Zabezpieczenie na zimę: zawiń donice z bylinami (szczypiorek, jarmuż) w jutę lub folię bąbelkową i postaw na styropianie.');
    seasonTips.push('Zimowy jarmuż i roszponka są gotowe do chrupania prosto ze śniegu.');
  }

  return {
    period: periodInfo,
    is_current_period: isCurrent,
    current_period_id: currentPId,
    actions_by_type: actionsByType,
    pillars,
    season_tips: seasonTips,
  };
}

function generateBalconyWeatherAdvice(temp: number, wind: number, precip: number, floor: number, orientation: string) {
  let watering = 'Umiarkowane podlewanie raz dziennie (wczesnym rankiem).';
  let frostWarning = false;
  let windWarning = false;

  let adjustedWind: number;
  if (orientation === 'PATIO') {
    adjustedWind = Math.max(0, wind * 0.4);
  } else if (orientation === 'DACH') {
    adjustedWind = wind + (floor * 2.0) + 8.0;
  } else {
    adjustedWind = wind + (floor * 1.5);
  }

  const isHighSunOrient = ['S', 'SW', 'SSW', 'WSW', 'S_W', 'S_E', 'DACH'].includes(orientation);

  if (temp >= 25) {
    if (isHighSunOrient) {
      watering = 'ALARM SUSZY: Donice na silnie nasłonecznionym balkonie podlewaj obficie 2 razy dziennie (o świcie i po zachodzie słońca). Ziemia w małych pojemnikach schnie błyskawicznie!';
    } else {
      watering = 'Wysoka temperatura: Sprawdź wilgotność palcem na głębokość 3 cm. Podlewaj obficie rano.';
    }
  } else if (temp <= 3) {
    watering = 'Chłód: Ogranicz podlewanie do minimum. Ziemia musi być ledwo wilgotna, by zapobiec gniciu korzeni.';
    frostWarning = true;
  } else if (precip > 2.0) {
    watering = 'Dziś pada: Jeśli Twój balkon nie jest zadaszony, odpuść podlewanie i sprawdź czy w podstawkach nie stoi woda.';
  }

  if (adjustedWind > 35 || (floor >= 6 && wind > 25) || (orientation === 'DACH' && wind > 20)) {
    windWarning = true;
  }

  return {
    watering_status: watering,
    frost_risk: frostWarning,
    wind_risk: windWarning,
    adjusted_wind_at_floor: Number(adjustedWind.toFixed(1)),
    summary: windWarning
      ? 'Uwaga na wiatr na wyższych piętrach! Zabezpiecz wysokie rośliny.'
      : frostWarning
      ? 'Ryzyko nocnego przymrozku! Schowaj delikatne rozsady do mieszkania.'
      : 'Stabilne warunki do uprawy doniczkowej.',
  };
}

async function fetchOpenMeteo(lat: number, lon: number, regionKey: string, floor: number, orientation: string) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

  let weather: any = null;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'BalkonowyOgrod/1.0' } });
    if (res.ok) {
      weather = await res.json();
    }
  } catch (e) {
    // fallback
  }

  if (!weather || !weather.current) {
    const now = new Date();
    const temp = now.getMonth() >= 4 && now.getMonth() <= 8 ? 18.0 : 8.0;
    return {
      source: 'fallback',
      temperature: temp,
      apparent_temperature: temp - 1.0,
      wind_speed: 12.0,
      humidity: 65,
      precipitation: 0.0,
      weather_code: 1,
      weather_desc: 'Umiarkowane zachmurzenie',
      balcony_advice: generateBalconyWeatherAdvice(temp, 12.0, 0.0, floor, orientation),
    };
  }

  const curr = weather.current;
  const temp = curr.temperature_2m ?? 15.0;
  const apparent = curr.apparent_temperature ?? temp;
  const wind = curr.wind_speed_10m ?? 10.0;
  const precip = curr.precipitation ?? 0.0;
  const humidity = curr.relative_humidity_2m ?? 60;
  const code = curr.weather_code ?? 0;

  const wmoCodes: Record<number, string> = {
    0: 'Bezchmurnie / Pełne słońce',
    1: 'Głównie słonecznie',
    2: 'Częściowe zachmurzenie',
    3: 'Pochmurno',
    45: 'Mgła',
    51: 'Lekka mżawka',
    61: 'Lekki deszcz',
    63: 'Umiarkowany deszcz',
    65: 'Ulewny deszcz',
    71: 'Opady śniegu',
    80: 'Przelotne opady deszczu',
    95: 'Burza',
  };

  const desc = wmoCodes[code] || 'Zmienna aura';
  const advice = generateBalconyWeatherAdvice(temp, wind, precip, floor, orientation);

  return {
    source: 'open-meteo',
    temperature: Number(temp.toFixed(1)),
    apparent_temperature: Number(apparent.toFixed(1)),
    wind_speed: Number(wind.toFixed(1)),
    humidity: Number(humidity.toFixed(1)),
    precipitation: Number(precip.toFixed(1)),
    weather_code: code,
    weather_desc: desc,
    balcony_advice: advice,
  };
}

export function createApiRouter(): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      backend: 'node-native',
      plants_count: (plantsData as any[]).length,
      timestamp: new Date().toISOString(),
    });
  });

  router.get('/regions', (_req, res) => {
    res.json(POLAND_REGIONS);
  });

  router.get('/plants', (_req, res) => {
    res.json(plantsData);
  });

  router.post('/recommendations', (req, res) => {
    const userSpec = req.body?.user_spec || {};
    const plantsList = plantsData as any[];

    const results = plantsList.map((plant) => {
      const suit = calculateSuitability(plant, userSpec);
      return {
        ...plant,
        suitability: suit,
      };
    });

    results.sort((a, b) => (b.suitability?.score ?? 0) - (a.suitability?.score ?? 0));

    res.json({
      user_spec: userSpec,
      recommendations: results,
      calculated_at: new Date().toISOString(),
    });
  });

  router.get('/weather', async (req, res) => {
    const lat = parseFloat(req.query.lat as string) || 52.2297;
    const lon = parseFloat(req.query.lon as string) || 21.0122;
    const regionKey = (req.query.region as string) || 'mazowieckie';
    const floor = parseInt(req.query.floor as string, 10) || 2;
    const orientation = (req.query.orientation as string) || 'S';

    try {
      const weatherData = await fetchOpenMeteo(lat, lon, regionKey, floor, orientation);
      res.json(weatherData);
    } catch (e) {
      res.status(500).json({ error: 'Failed to fetch weather' });
    }
  });

  router.get('/calendar-overview', (_req, res) => {
    res.json({
      current_period_id: getCurrentPeriodId(),
      periods: CALENDAR_PERIODS,
    });
  });

  router.get('/calendar', (req, res) => {
    const periodId = (req.query.period as string) || getCurrentPeriodId();
    const plantIdsRaw = req.query.plant_ids as string;
    const plantIds = plantIdsRaw ? plantIdsRaw.split(',').map((p) => p.trim()).filter(Boolean) : null;
    const userSpec: UserBalconySpec = {
      region: (req.query.region as string) || 'mazowieckie',
      floor: parseInt(req.query.floor as string, 10) || 2,
      orientation: (req.query.orientation as string) || 'S',
    };

    const calendarRes = buildCalendarResponse(userSpec, periodId, plantIds);
    res.json(calendarRes);
  });

  router.post('/calendar', (req, res) => {
    const body = req.body || {};
    const userSpec = body.user_spec || {};
    const periodId = body.period_id || getCurrentPeriodId();
    const plantIds = body.plant_ids || body.crop_ids || null;

    const calendarRes = buildCalendarResponse(userSpec, periodId, plantIds);
    res.json(calendarRes);
  });

  // Server-side Crop Uniqueness & Idempotent Addition Store
  const serverCropsStore = new Map<string, any[]>();

  // POST /api/crops/add - Server-side uniqueness validation & idempotent addition
  router.post('/crops/add', (req, res) => {
    const body = req.body || {};
    const plantId = (body.plantId || body.plant_id || '').trim();
    if (!plantId) {
      return res.status(400).json({ success: false, error: 'Brak identyfikatora rośliny (plantId).' });
    }

    const userId = (body.userId || body.user_id || 'guest').trim();
    const containerId = (body.containerId || body.container_id || 'default').trim();
    const uniquenessKey = `${userId}::${plantId.toLowerCase()}::${containerId.toLowerCase()}`;

    const userCrops = serverCropsStore.get(userId) || [];

    // Check for duplicate crop on server
    const existing = userCrops.find((c) => {
      if (c.uniquenessKey === uniquenessKey) return true;
      const cCont = c.containerId || 'default';
      return c.plantId === plantId && cCont === containerId;
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        created: false,
        duplicate: true,
        uniquenessKey,
        message: 'Ta roślina znajduje się już w Twoich uprawach w tym pojemniku / lokalizacji.',
        crop: existing,
        recoveryAction: {
          label: 'Przejdź do Moich upraw',
          target: 'my_crops',
        },
      });
    }

    const plant = (plantsData as any[]).find((p) => p.id === plantId);
    const plantName = plant ? plant.name : plantId;

    const newCrop = {
      id: `${plantId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      uniquenessKey,
      plantId,
      containerId,
      selectedVariety: body.varietyName || body.selectedVariety || (plant?.top_varieties?.[0]?.name || plantName),
      varietyBadge: body.varietyBadge || 'Odmiana donicowa',
      potCount: Math.max(1, body.potCount || 1),
      addedAt: new Date().toISOString(),
      stage: 'rosnie',
      pot: {
        potType: body.potType || 'okragla',
        volumeL: body.potVolumeLiters || 15,
        calculationVersion: '2.1.0',
      },
    };

    userCrops.push(newCrop);
    serverCropsStore.set(userId, userCrops);

    return res.status(201).json({
      success: true,
      created: true,
      duplicate: false,
      uniquenessKey,
      message: `Pomyślnie dodano: ${plantName} do Moich upraw!`,
      crop: newCrop,
      recoveryAction: {
        label: 'Przejdź do Moich upraw',
        target: 'my_crops',
      },
    });
  });

  // GET /api/crops/check - Query server for crop existence
  router.get('/crops/check', (req, res) => {
    const userId = ((req.query.userId as string) || (req.query.user_id as string) || 'guest').trim();
    const plantId = ((req.query.plantId as string) || (req.query.plant_id as string) || '').trim();
    const containerId = ((req.query.containerId as string) || (req.query.container_id as string) || 'default').trim();

    if (!plantId) {
      return res.status(400).json({ error: 'Brak plantId' });
    }

    const uniquenessKey = `${userId}::${plantId.toLowerCase()}::${containerId.toLowerCase()}`;
    const userCrops = serverCropsStore.get(userId) || [];
    const found = userCrops.find((c) => c.uniquenessKey === uniquenessKey || (c.plantId === plantId && (c.containerId || 'default') === containerId));

    res.json({
      exists: Boolean(found),
      uniquenessKey,
      crop: found || null,
    });
  });

  // In-memory store for idempotency of pot calculations
  const serverPotCalculationsStore = new Map<string, any>();

  // POST /api/pot-calculations - Persist calculation result on server with idempotency & contract validation
  router.post('/pot-calculations', (req, res) => {
    const body = req.body || {};

    // Simulation triggers for testing error scenarios (HTTP 4xx, 5xx, timeout)
    if (body.simulate500 || body.simulateError) {
      return res.status(500).json({ success: false, error: 'Wewnętrzny błąd serwera (500).' });
    }
    if (body.simulate400) {
      return res.status(400).json({ success: false, error: 'Nieprawidłowe żądanie kalkulacji (400).' });
    }
    if (body.simulate422) {
      return res.status(422).json({ success: false, error: 'Niepoprawne dane wejściowe kalkulacji (422).' });
    }
    if (body.simulateTimeout) {
      // Intentionally delay or abort for timeout testing if requested
      return setTimeout(() => {
        if (!res.headersSent) {
          res.status(504).json({ success: false, error: 'Przekroczono limit czasu żądania (504).' });
        }
      }, 5000);
    }

    const {
      idempotencyKey,
      plantId,
      shape,
      material,
      dimensions,
      formulaVersion,
      resultValues,
      timestamp,
    } = body;

    // Strict validation of the calculation submit contract
    if (!idempotencyKey || typeof idempotencyKey !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Brak wymaganego klucza idempotencji (idempotencyKey).',
      });
    }

    if (!plantId || !shape || !material || !formulaVersion || !dimensions || !resultValues) {
      return res.status(400).json({
        success: false,
        error: 'Niekompletny kontrakt kalkulacji. Wymagane pola: plantId, shape, material, dimensions, formulaVersion, resultValues.',
      });
    }

    if (typeof dimensions.heightCm !== 'number' || dimensions.heightCm <= 0) {
      return res.status(422).json({
        success: false,
        error: 'Nieprawidłowa wysokość donicy w centymetrach.',
      });
    }

    // Idempotency check: if already processed, return existing record without creating duplicates
    if (serverPotCalculationsStore.has(idempotencyKey)) {
      const existing = serverPotCalculationsStore.get(idempotencyKey);
      return res.status(200).json({
        success: true,
        idempotencyKey,
        savedAt: existing.timestamp || existing.savedAt,
        deduplicated: true,
        calculation: existing,
      });
    }

    const recordToSave = {
      idempotencyKey,
      plantId,
      plantName: body.plantName || plantId,
      shape,
      material,
      dimensions,
      potCount: body.potCount ?? 1,
      sowingMethod: body.sowingMethod ?? 'nasiona',
      formulaVersion,
      resultValues,
      fullResult: body.fullResult || body.result,
      timestamp: timestamp || new Date().toISOString(),
      savedAt: new Date().toISOString(),
    };

    serverPotCalculationsStore.set(idempotencyKey, recordToSave);

    return res.status(200).json({
      success: true,
      idempotencyKey,
      savedAt: recordToSave.savedAt,
      deduplicated: false,
      calculation: recordToSave,
    });
  });

  // GET /api/pot-calculations/:idempotencyKey - Retrieve calculation by idempotency key
  router.get('/pot-calculations/:idempotencyKey', (req, res) => {
    const key = req.params.idempotencyKey;
    const found = serverPotCalculationsStore.get(key);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Nie znaleziono kalkulacji o podanym kluczu.' });
    }
    return res.json({ success: true, calculation: found });
  });

  return router;
}
