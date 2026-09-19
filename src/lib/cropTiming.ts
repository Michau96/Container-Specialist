export interface PlantTimingInfo {
  status:
    | 'sow_now'
    | 'transplant_now'
    | 'year_round'
    | 'growing_season'
    | 'last_call'
    | 'too_late'
    | 'too_early'
    | 'dormancy';
  badgeLabel: string;
  badgeTone: 'emerald' | 'amber' | 'stone' | 'rose' | 'sky' | 'teal';
  badgeIcon: string;
  isGoodTimeToPlantNow: boolean;
  dateExplanation: string;
  bestSowingLabel: string;
  sowingMethodLabel: string;
  bestTransplantingLabel: string;
  transplantingNote: string;
  activePeriodLabel: string;
  nextWindowLabel?: string;
}

const MONTH_NAMES = [
  '',
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const MONTH_NAMES_GENITIVE = [
  '',
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
];

/**
 * Returns the current calendar period ID (e.g. '09_2' for mid-September)
 */
export function getCalendarPeriodId(date: Date = new Date()): string {
  const month = date.getMonth() + 1;
  const half = date.getDate() <= 15 ? 1 : 2;
  return `${String(month).padStart(2, '0')}_${half}`;
}

/**
 * Converts a period ID (e.g. '09_2') into a human-readable Polish label
 */
export function getPeriodHumanLabel(periodId: string): string {
  const [mStr, hStr] = periodId.split('_');
  const month = parseInt(mStr, 10);
  const half = parseInt(hStr, 10);
  const mName = MONTH_NAMES[month] || '';
  return half === 1 ? `I połowa ${mName}` : `II połowa ${mName}`;
}

/**
 * Helper to turn a sorted list of period IDs into human-friendly ranges
 */
function formatPeriodsToRanges(periodIds: string[]): string {
  if (!periodIds || periodIds.length === 0) return '';

  // Sort periods chronologically
  const sorted = [...new Set(periodIds)].sort();

  // Group continuous months
  const months = [...new Set(sorted.map((p) => parseInt(p.split('_')[0], 10)))].sort((a, b) => a - b);

  if (months.length === 0) return '';
  if (months.length === 12) return 'Cały rok';

  // Check if we have split windows (e.g. spring [3, 4] and autumn [8, 9])
  const chunks: number[][] = [];
  let currentChunk: number[] = [months[0]];

  for (let i = 1; i < months.length; i++) {
    if (months[i] === months[i - 1] + 1) {
      currentChunk.push(months[i]);
    } else {
      chunks.push(currentChunk);
      currentChunk = [months[i]];
    }
  }
  chunks.push(currentChunk);

  const chunkLabels = chunks.map((chunk) => {
    if (chunk.length === 1) {
      // Check if only first or second half
      const monthNum = chunk[0];
      const matchingPeriods = sorted.filter((p) => parseInt(p.split('_')[0], 10) === monthNum);
      if (matchingPeriods.length === 1) {
        return matchingPeriods[0].endsWith('_1')
          ? `Początek ${MONTH_NAMES_GENITIVE[monthNum]}`
          : `Koniec ${MONTH_NAMES_GENITIVE[monthNum]}`;
      }
      return MONTH_NAMES[monthNum];
    }
    const first = chunk[0];
    const last = chunk[chunk.length - 1];

    // Check special Polish gardening milestone: May 15th (Zimna Zośka)
    if (first === 5 && last === 5 && sorted.includes('05_2')) {
      return 'Druga połowa Maja (po 15 maja)';
    }

    return `${MONTH_NAMES[first]} – ${MONTH_NAMES[last]}`;
  });

  return chunkLabels.join(' oraz ');
}

/**
 * Computes full seasonality, current-date suitability, and optimal sowing/transplanting windows
 */
export function getPlantTimingInfo(
  plant: {
    id: string;
    name: string;
    plant_group: string;
    schedule?: Record<string, string>;
    detailed_guide?: string;
    spacing_guide?: { sowing_type?: string };
  },
  currentDate: Date = new Date()
): PlantTimingInfo {
  const currentPeriodId = getCalendarPeriodId(currentDate);
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
  const schedule = plant.schedule || {};

  const currentAction = schedule[currentPeriodId];
  const isKielki = plant.plant_group === 'kielki';
  const isGrzyby = plant.plant_group === 'grzyby';

  // 1. Sowing periods
  const indoorSowPeriods: string[] = [];
  const outdoorSowPeriods: string[] = [];

  Object.entries(schedule).forEach(([pId, act]) => {
    if (act === 'rozsada_dom') indoorSowPeriods.push(pId);
    if (act === 'siew_donica') outdoorSowPeriods.push(pId);
  });

  const allSowPeriods = [...indoorSowPeriods, ...outdoorSowPeriods];

  // 2. Transplanting periods (sadzenie docelowe do donic / na balkon)
  const transplantPeriods: string[] = [];
  Object.entries(schedule).forEach(([pId, act]) => {
    if (act === 'sadzenie_balkon' || act === 'sadzenie') {
      transplantPeriods.push(pId);
    }
  });

  // Calculate Sowing Labels
  let bestSowingLabel = '';
  let sowingMethodLabel = '';

  if (isKielki) {
    bestSowingLabel = 'Cały rok (uprawa ciągła w pojemnikach)';
    sowingMethodLabel = 'Siew na tacki / do kiełkownicy (zbór w 5-10 dni)';
  } else if (indoorSowPeriods.length > 0 && outdoorSowPeriods.length > 0) {
    bestSowingLabel = `${formatPeriodsToRanges(indoorSowPeriods)} (rozsada) / ${formatPeriodsToRanges(outdoorSowPeriods)} (wprost do donic)`;
    sowingMethodLabel = 'Wysiew w domu na rozsadę lub późniejszy siew do donicy';
  } else if (indoorSowPeriods.length > 0) {
    bestSowingLabel = `${formatPeriodsToRanges(indoorSowPeriods)} (rozsada domowa)`;
    sowingMethodLabel = 'Wysiew w domu na parapecie do wielodoniczek';
  } else if (outdoorSowPeriods.length > 0) {
    bestSowingLabel = `${formatPeriodsToRanges(outdoorSowPeriods)} (wprost do donic)`;
    sowingMethodLabel = 'Siew bezpośrednio do docelowej donicy na balkonie';
  } else if (isGrzyby) {
    bestSowingLabel = 'Wiosna (Marzec – Maj) oraz Jesień (Wrzesień – Październik)';
    sowingMethodLabel = 'Zaszczepienie gotowego podłoża grzybnią';
  } else {
    // For woody perennials or crops grown exclusively from cuttings/nursery pots
    bestSowingLabel = 'Wiosna (Kwiecień – Maj) lub gotowe sadzonki';
    sowingMethodLabel = 'Zalecany zakup gotowej sadzonki ze szkółki';
  }

  // Calculate Transplanting Labels
  let bestTransplantingLabel = '';
  let transplantingNote = '';

  if (isKielki) {
    bestTransplantingLabel = 'Nie dotyczy (uprawa bezpośrednia bez pikowania)';
    transplantingNote = 'Mikrolistki ścina się prosto z tacki bez przesadzania.';
  } else if (transplantPeriods.length > 0) {
    const formatted = formatPeriodsToRanges(transplantPeriods);
    if (transplantPeriods.includes('05_2') && transplantPeriods.length === 1) {
      bestTransplantingLabel = 'Po 15 maja (po "Zimnej Zośce")';
    } else {
      bestTransplantingLabel = formatted;
    }

    if (indoorSowPeriods.length > 0) {
      transplantingNote = 'Hartuj rozsadę przez 5-7 dni przed wystawieniem na stałe na balkon.';
    } else {
      transplantingNote = 'Sadź do docelowego pojemnika z odpowiednim drenażem.';
    }
  } else if (outdoorSowPeriods.length > 0) {
    bestTransplantingLabel = 'Nie wymaga przesadzania (siew wprost)';
    transplantingNote = 'Wysiewaj bezpośrednio do docelowej donicy, przerywając siewki w rozstawie.';
  } else if (isGrzyby) {
    bestTransplantingLabel = 'Wiosna lub Jesień (temperatura 12-20°C w cieniu)';
    transplantingNote = 'Wystawić wilgotną kostkę z grzybnią w zacienione miejsce.';
  } else {
    bestTransplantingLabel = 'Kwiecień – Maj oraz Wrzesień (sadzonki doniczkowane)';
    transplantingNote = 'Rośliny wieloletnie w donicach można sadzić przez cały sezon wegetacyjny.';
  }

  // 3. Determine status based on current date
  let status: PlantTimingInfo['status'] = 'growing_season';
  let badgeLabel = '🌿 Sezon wegetacyjny';
  let badgeTone: PlantTimingInfo['badgeTone'] = 'stone';
  let badgeIcon = 'Calendar';
  let isGoodTimeToPlantNow = false;
  let dateExplanation = '';

  const activePeriodHuman = getPeriodHumanLabel(currentPeriodId);
  const formattedToday = `${currentDay} ${MONTH_NAMES_GENITIVE[currentMonth]}`;

  if (isKielki) {
    status = 'year_round';
    badgeLabel = '✨ Uprawa całoroczna (siej teraz)';
    badgeTone = 'emerald';
    badgeIcon = 'Sparkles';
    isGoodTimeToPlantNow = true;
    dateExplanation = `Dziś jest ${formattedToday}. Mikrolistki i kiełki można wysiewać w dowolnym dniu roku – pierwsze zbiory już za 7-10 dni!`;
  } else if (currentAction === 'siew_donica' || currentAction === 'rozsada_dom') {
    status = 'sow_now';
    badgeLabel = currentAction === 'siew_donica' ? '🌱 Idealny termin na siew wprost' : '🌱 Idealny termin na wysiew rozsady';
    badgeTone = 'emerald';
    badgeIcon = 'Sprout';
    isGoodTimeToPlantNow = true;
    dateExplanation = `Dziś jest ${formattedToday} (${activePeriodHuman}). To optymalny kalendarzowy moment na wysiew (${
      currentAction === 'siew_donica' ? 'wprost do donicy' : 'w domu na rozsadę'
    })!`;
  } else if (currentAction === 'sadzenie_balkon' || currentAction === 'sadzenie') {
    status = 'transplant_now';
    badgeLabel = '🪴 Świetny termin na sadzenie na balkon';
    badgeTone = 'emerald';
    badgeIcon = 'Sun';
    isGoodTimeToPlantNow = true;
    dateExplanation = `Dziś jest ${formattedToday} (${activePeriodHuman}). Trwa optymalne okno na przesadzanie i wysadzanie sadzonek do docelowych donic balkonowych.`;
  } else if (isGrzyby && (currentMonth === 9 || currentMonth === 10 || currentMonth === 4 || currentMonth === 5)) {
    status = 'sow_now';
    badgeLabel = '🍄 Świetny termin na uprawę grzybów';
    badgeTone = 'emerald';
    badgeIcon = 'Sprout';
    isGoodTimeToPlantNow = true;
    dateExplanation = `Dziś jest ${formattedToday}. Umiarkowane temperatury i wysoka wilgotność sprzyjają doskonałemu owocowaniu boczniaków i pieczarek na balkonie.`;
  } else {
    // Check if the current action is harvest / maintenance or off-season
    if (currentAction === 'zbior') {
      // In September/October, check if it's late for seeds
      if (allSowPeriods.length > 0) {
        const lastSowPeriod = allSowPeriods[allSowPeriods.length - 1];
        const [lastM] = lastSowPeriod.split('_').map((n) => parseInt(n, 10));

        if (currentMonth > lastM + 1) {
          status = 'too_late';
          badgeLabel = '❄️ Za późno na siew nasion w tym roku';
          badgeTone = 'rose';
          badgeIcon = 'Clock';
          isGoodTimeToPlantNow = false;
          dateExplanation = `Dziś jest ${formattedToday}. Okres wegetacji nasion minął (siew: ${bestSowingLabel}). Nasiona nie zdążą wydać plonu przed przymrozkami. Zaplanuj wysiew na wiosnę!`;
        } else if (currentMonth === lastM || (currentMonth === lastM + 1 && currentDay <= 20)) {
          status = 'last_call';
          badgeLabel = '🍂 Ostatni dzwonek na siew';
          badgeTone = 'amber';
          badgeIcon = 'AlertTriangle';
          isGoodTimeToPlantNow = true;
          dateExplanation = `Dziś jest ${formattedToday}. To ostatni dzwonek na późny wysiew jesienny (np. pod agrowłókniną lub na zbiór wczesnowiosenny).`;
        } else {
          status = 'growing_season';
          badgeLabel = '🧺 Trwają zbiory • Kup gotową sadzonkę';
          badgeTone = 'sky';
          badgeIcon = 'CheckCircle2';
          isGoodTimeToPlantNow = false;
          dateExplanation = `Dziś jest ${formattedToday}. Rośliny w pełni owocują. Z nasion jest za późno, ale możesz jeszcze kupić owocującą lub uformowaną roślinę w doniczce.`;
        }
      } else {
        status = 'growing_season';
        badgeLabel = '🧺 Sezon zbiorów i owocowania';
        badgeTone = 'sky';
        badgeIcon = 'CheckCircle2';
        isGoodTimeToPlantNow = false;
        dateExplanation = `Dziś jest ${formattedToday}. Rośliny owocują w donicach na balkonie.`;
      }
    } else if (currentAction === 'pielegnacja' || currentAction === 'rosnie' || currentAction === 'kwitnie') {
      status = 'growing_season';
      badgeLabel = '🌿 Sezon uprawy w toku';
      badgeTone = 'sky';
      badgeIcon = 'Calendar';
      isGoodTimeToPlantNow = false;
      dateExplanation = `Dziś jest ${formattedToday}. Trwa okres intensywnego wzrostu. Na siew z nasion jest za późno, ale możesz posadzić dobrze ukorzenioną gotową sadzonkę.`;
    } else if (
      currentAction === 'koniec_sezonu' ||
      currentAction === 'zimowanie' ||
      currentAction === 'zimowanie_balkon' ||
      currentAction === 'zimowanie_dom' ||
      currentAction === 'odpoczynek'
    ) {
      status = 'dormancy';
      badgeLabel = '❄️ Spoczynek zimowy (koniec sezonu)';
      badgeTone = 'stone';
      badgeIcon = 'Clock';
      isGoodTimeToPlantNow = false;
      dateExplanation = `Dziś jest ${formattedToday}. Roślina kończy wegetację lub wchodzi w stan spoczynku zimowego. Zaplanuj siew na nadchodzącą wiosnę (${bestSowingLabel}).`;
    } else {
      // If action is undefined for current period
      if (allSowPeriods.length > 0) {
        const firstSow = allSowPeriods[0];
        const [firstM] = firstSow.split('_').map((n) => parseInt(n, 10));

        if (currentMonth < firstM) {
          status = 'too_early';
          badgeLabel = `⏳ Za wcześnie • Poczekaj do ${MONTH_NAMES_GENITIVE[firstM]}`;
          badgeTone = 'stone';
          badgeIcon = 'Clock';
          isGoodTimeToPlantNow = false;
          dateExplanation = `Dziś jest ${formattedToday}. Jest jeszcze za chłodno / za wcześnie na siew. Najbliższy termin wysiewu to ${bestSowingLabel}.`;
        } else {
          status = 'too_late';
          badgeLabel = '❄️ Za późno na siew nasion w tym roku';
          badgeTone = 'rose';
          badgeIcon = 'Clock';
          isGoodTimeToPlantNow = false;
          dateExplanation = `Dziś jest ${formattedToday}. W tym roku termin wysiewu nasion już minął. Zaplanuj uprawę na kolejny sezon (${bestSowingLabel}).`;
        }
      } else {
        status = 'growing_season';
        badgeLabel = '🪴 Gotowe sadzonki ze szkółki';
        badgeTone = 'stone';
        badgeIcon = 'Calendar';
        isGoodTimeToPlantNow = false;
        dateExplanation = `Dziś jest ${formattedToday}. Najlepiej sadzić wyhodowane sadzonki ze szkółki ogrodniczej.`;
      }
    }
  }

  return {
    status,
    badgeLabel,
    badgeTone,
    badgeIcon,
    isGoodTimeToPlantNow,
    dateExplanation,
    bestSowingLabel,
    sowingMethodLabel,
    bestTransplantingLabel,
    transplantingNote,
    activePeriodLabel: activePeriodHuman,
  };
}
