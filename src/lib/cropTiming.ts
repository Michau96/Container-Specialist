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

const MONTH_NAMES_PL = [
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

const MONTH_NAMES_GENITIVE_PL = [
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

const MONTH_NAMES_EN = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
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
 * Converts a period ID (e.g. '09_2') into a human-readable label
 */
export function getPeriodHumanLabel(periodId: string, isEn: boolean = false): string {
  if (!periodId) return '';
  const [mStr, hStr] = periodId.split('_');
  const month = parseInt(mStr, 10);
  const half = parseInt(hStr, 10);

  if (isEn) {
    const mName = MONTH_NAMES_EN[month] || '';
    return half === 1 ? `1st half of ${mName}` : `2nd half of ${mName}`;
  }

  const mName = MONTH_NAMES_GENITIVE_PL[month] || MONTH_NAMES_PL[month] || '';
  return half === 1 ? `I połowa ${mName}` : `II połowa ${mName}`;
}

/**
 * Normalizes a period label in Polish so that month names and genitive forms
 * are consistently lowercase according to Polish orthography.
 */
export function formatPeriodNamePl(name: string): string {
  if (!name) return '';
  const monthMap: Record<string, string> = {
    stycznia: 'stycznia',
    lutego: 'lutego',
    marca: 'marca',
    kwietnia: 'kwietnia',
    maja: 'maja',
    czerwca: 'czerwca',
    lipca: 'lipca',
    sierpnia: 'sierpnia',
    września: 'września',
    października: 'października',
    listopada: 'listopada',
    grudnia: 'grudnia',
  };

  return name
    .replace(
      /(stycznia|lutego|marca|kwietnia|maja|czerwca|lipca|sierpnia|września|października|listopada|grudnia)/gi,
      (m) => monthMap[m.toLowerCase()] || m
    )
    .replace(/\(Przed Zimną Zośką\)/gi, '(przed Zimną Zośką)')
    .replace(/\(Po Zimnej Zośce\)/gi, '(po Zimnej Zośce)');
}

/**
 * Helper to turn a sorted list of period IDs into human-friendly ranges
 */
export function formatPeriodsToRanges(periodIds: string[], isEn: boolean = false): string {
  if (!periodIds || periodIds.length === 0) return '';

  // Sort periods chronologically
  const sorted = [...new Set(periodIds)].sort();

  // Group continuous months
  const months = [...new Set(sorted.map((p) => parseInt(p.split('_')[0], 10)))].sort((a, b) => a - b);

  if (months.length === 0) return '';
  if (months.length === 12) return isEn ? 'All year round' : 'Cały rok';

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
      const monthNum = chunk[0];
      const matchingPeriods = sorted.filter((p) => parseInt(p.split('_')[0], 10) === monthNum);
      if (matchingPeriods.length === 1) {
        if (isEn) {
          return matchingPeriods[0].endsWith('_1')
            ? `Early ${MONTH_NAMES_EN[monthNum]}`
            : `Late ${MONTH_NAMES_EN[monthNum]}`;
        }
        return matchingPeriods[0].endsWith('_1')
          ? `Początek ${MONTH_NAMES_GENITIVE_PL[monthNum]}`
          : `Koniec ${MONTH_NAMES_GENITIVE_PL[monthNum]}`;
      }
      return isEn ? MONTH_NAMES_EN[monthNum] : MONTH_NAMES_PL[monthNum];
    }
    const first = chunk[0];
    const last = chunk[chunk.length - 1];

    if (isEn) {
      if (first === 5 && last === 5 && sorted.includes('05_2')) {
        return '2nd half of May (after May 15th)';
      }
      return `${MONTH_NAMES_EN[first]} – ${MONTH_NAMES_EN[last]}`;
    }

    if (first === 5 && last === 5 && sorted.includes('05_2')) {
      return 'Druga połowa maja (po 15 maja)';
    }

    return `${MONTH_NAMES_PL[first]} – ${MONTH_NAMES_PL[last]}`;
  });

  return chunkLabels.join(isEn ? ' and ' : ' oraz ');
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
  currentDate: Date = new Date(),
  isEn: boolean = false
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
    bestSowingLabel = isEn
      ? 'All year round (continuous indoor trays)'
      : 'Cały rok (uprawa ciągła w pojemnikach)';
    sowingMethodLabel = isEn
      ? 'Sow on trays / sprouter (harvest in 5-10 days)'
      : 'Siew na tacki / do kiełkownicy (zbór w 5-10 dni)';
  } else if (indoorSowPeriods.length > 0 && outdoorSowPeriods.length > 0) {
    bestSowingLabel = isEn
      ? `${formatPeriodsToRanges(indoorSowPeriods, true)} (seedlings) / ${formatPeriodsToRanges(outdoorSowPeriods, true)} (direct to pots)`
      : `${formatPeriodsToRanges(indoorSowPeriods, false)} (rozsada) / ${formatPeriodsToRanges(outdoorSowPeriods, false)} (wprost do donic)`;
    sowingMethodLabel = isEn
      ? 'Sow indoors for seedlings or later sow directly into pots'
      : 'Wysiew w domu na rozsadę lub późniejszy siew do donicy';
  } else if (indoorSowPeriods.length > 0) {
    bestSowingLabel = isEn
      ? `${formatPeriodsToRanges(indoorSowPeriods, true)} (indoor seedlings)`
      : `${formatPeriodsToRanges(indoorSowPeriods, false)} (rozsada domowa)`;
    sowingMethodLabel = isEn
      ? 'Sow indoors on windowsill into plug trays'
      : 'Wysiew w domu na parapecie do wielodoniczek';
  } else if (outdoorSowPeriods.length > 0) {
    bestSowingLabel = isEn
      ? `${formatPeriodsToRanges(outdoorSowPeriods, true)} (direct to pots)`
      : `${formatPeriodsToRanges(outdoorSowPeriods, false)} (wprost do donic)`;
    sowingMethodLabel = isEn
      ? 'Sow directly into final balcony containers'
      : 'Siew bezpośrednio do docelowej donicy na balkonie';
  } else if (isGrzyby) {
    bestSowingLabel = isEn
      ? 'Spring (March – May) and Autumn (September – October)'
      : 'Wiosna (Marzec – Maj) oraz Jesień (Wrzesień – Październik)';
    sowingMethodLabel = isEn
      ? 'Inoculate prepared substrate block with mycelium'
      : 'Zaszczepienie gotowego podłoża grzybnią';
  } else {
    bestSowingLabel = isEn
      ? 'Spring (April – May) or nursery seedlings'
      : 'Wiosna (Kwiecień – Maj) lub gotowe sadzonki';
    sowingMethodLabel = isEn
      ? 'Recommended purchase of potted nursery seedlings'
      : 'Zalecany zakup gotowej sadzonki ze szkółki';
  }

  // Calculate Transplanting Labels
  let bestTransplantingLabel = '';
  let transplantingNote = '';

  if (isKielki) {
    bestTransplantingLabel = isEn
      ? 'Not applicable (direct tray growth without transplanting)'
      : 'Nie dotyczy (uprawa bezpośrednia bez pikowania)';
    transplantingNote = isEn
      ? 'Microgreens are harvested straight from tray without repotting.'
      : 'Mikrolistki ścina się prosto z tacki bez przesadzania.';
  } else if (transplantPeriods.length > 0) {
    const formatted = formatPeriodsToRanges(transplantPeriods, isEn);
    if (transplantPeriods.includes('05_2') && transplantPeriods.length === 1) {
      bestTransplantingLabel = isEn
        ? 'After May 15th (post-frost)'
        : 'Po 15 maja (po "Zimnej Zośce")';
    } else {
      bestTransplantingLabel = formatted;
    }

    if (indoorSowPeriods.length > 0) {
      transplantingNote = isEn
        ? 'Harden off seedlings for 5–7 days before placing permanently outdoors on the balcony.'
        : 'Hartuj rozsadę przez 5-7 dni przed wystawieniem na stałe na balkon.';
    } else {
      transplantingNote = isEn
        ? 'Plant into target containers with proper drainage.'
        : 'Sadź do docelowego pojemnika z odpowiednim drenażem.';
    }
  } else if (outdoorSowPeriods.length > 0) {
    bestTransplantingLabel = isEn
      ? 'No transplanting needed (direct sow)'
      : 'Nie wymaga przesadzania (siew wprost)';
    transplantingNote = isEn
      ? 'Sow directly into final container, thinning out excess seedlings.'
      : 'Wysiewaj bezpośrednio do docelowej donicy, przerywając siewki w rozstawie.';
  } else if (isGrzyby) {
    bestTransplantingLabel = isEn
      ? 'Spring or Autumn (12–20°C in the shade)'
      : 'Wiosna lub Jesień (temperatura 12-20°C w cieniu)';
    transplantingNote = isEn
      ? 'Place moist mycelium block in a sheltered, shady balcony spot.'
      : 'Wystawić wilgotną kostkę z grzybnią w zacienione miejsce.';
  } else {
    bestTransplantingLabel = isEn
      ? 'April – May and September (potted transplants)'
      : 'Kwiecień – Maj oraz Wrzesień (sadzonki doniczkowane)';
    transplantingNote = isEn
      ? 'Potted perennial plants can be planted throughout the growing season.'
      : 'Rośliny wieloletnie w donicach można sadzić przez cały sezon wegetacyjny.';
  }

  // 3. Determine status based on current date
  let status: PlantTimingInfo['status'] = 'growing_season';
  let badgeLabel = isEn ? '🌿 Growing season' : '🌿 Sezon wegetacyjny';
  let badgeTone: PlantTimingInfo['badgeTone'] = 'stone';
  let badgeIcon = 'Calendar';
  let isGoodTimeToPlantNow = false;
  let dateExplanation = '';

  const activePeriodHuman = getPeriodHumanLabel(currentPeriodId, isEn);
  const formattedToday = isEn
    ? `${MONTH_NAMES_EN[currentMonth]} ${currentDay}`
    : `${currentDay} ${MONTH_NAMES_GENITIVE_PL[currentMonth]}`;

  if (isKielki) {
    status = 'year_round';
    badgeLabel = isEn ? '✨ Year-round growing (sow now)' : '✨ Uprawa całoroczna (siej teraz)';
    badgeTone = 'emerald';
    badgeIcon = 'Sparkles';
    isGoodTimeToPlantNow = true;
    dateExplanation = isEn
      ? `Today is ${formattedToday}. Microgreens and sprouts can be started any day of the year – first harvest in 7–10 days!`
      : `Dziś jest ${formattedToday}. Mikrolistki i kiełki można wysiewać w dowolnym dniu roku – pierwsze zbiory już za 7-10 dni!`;
  } else if (currentAction === 'siew_donica' || currentAction === 'rozsada_dom') {
    status = 'sow_now';
    badgeLabel = isEn
      ? currentAction === 'siew_donica'
        ? '🌱 Perfect time for direct sowing'
        : '🌱 Perfect time for seedling sowing'
      : currentAction === 'siew_donica'
      ? '🌱 Idealny termin na siew wprost'
      : '🌱 Idealny termin na wysiew rozsady';
    badgeTone = 'emerald';
    badgeIcon = 'Sprout';
    isGoodTimeToPlantNow = true;
    dateExplanation = isEn
      ? `Today is ${formattedToday} (${activePeriodHuman}). Optimal calendar window for sowing (${
          currentAction === 'siew_donica' ? 'directly into pots' : 'indoors for seedlings'
        })!`
      : `Dziś jest ${formattedToday} (${activePeriodHuman}). To optymalny kalendarzowy moment na wysiew (${
          currentAction === 'siew_donica' ? 'wprost do donicy' : 'w domu na rozsadę'
        })!`;
  } else if (currentAction === 'sadzenie_balkon' || currentAction === 'sadzenie') {
    status = 'transplant_now';
    badgeLabel = isEn ? '🪴 Great time for planting on balcony' : '🪴 Świetny termin na sadzenie na balkon';
    badgeTone = 'emerald';
    badgeIcon = 'Sun';
    isGoodTimeToPlantNow = true;
    dateExplanation = isEn
      ? `Today is ${formattedToday} (${activePeriodHuman}). Active window for potting and transplanting seedlings to final balcony containers.`
      : `Dziś jest ${formattedToday} (${activePeriodHuman}). Trwa optymalne okno na przesadzanie i wysadzanie sadzonek do docelowych donic balkonowych.`;
  } else if (isGrzyby && (currentMonth === 9 || currentMonth === 10 || currentMonth === 4 || currentMonth === 5)) {
    status = 'sow_now';
    badgeLabel = isEn ? '🍄 Great window for mushroom cultivation' : '🍄 Świetny termin na uprawę grzybów';
    badgeTone = 'emerald';
    badgeIcon = 'Sprout';
    isGoodTimeToPlantNow = true;
    dateExplanation = isEn
      ? `Today is ${formattedToday}. Moderate temperatures and high humidity foster bountiful oyster and button mushroom flushes.`
      : `Dziś jest ${formattedToday}. Umiarkowane temperatury i wysoka wilgotność sprzyjają doskonałemu owocowaniu boczniaków i pieczarek na balkonie.`;
  } else {
    // Check if the current action is harvest / maintenance or off-season
    if (currentAction === 'zbior') {
      if (allSowPeriods.length > 0) {
        const lastSowPeriod = allSowPeriods[allSowPeriods.length - 1];
        const [lastM] = lastSowPeriod.split('_').map((n) => parseInt(n, 10));

        if (currentMonth > lastM + 1) {
          status = 'too_late';
          badgeLabel = isEn ? '❄️ Too late for seeds this year' : '❄️ Za późno na siew nasion w tym roku';
          badgeTone = 'rose';
          badgeIcon = 'Clock';
          isGoodTimeToPlantNow = false;
          dateExplanation = isEn
            ? `Today is ${formattedToday}. Sowing window has passed (sowing: ${bestSowingLabel}). Seeds won't mature before frosts. Plan for next spring!`
            : `Dziś jest ${formattedToday}. Okres wegetacji nasion minął (siew: ${bestSowingLabel}). Nasiona nie zdążą wydać plonu przed przymrozkami. Zaplanuj wysiew na wiosnę!`;
        } else if (currentMonth === lastM || (currentMonth === lastM + 1 && currentDay <= 20)) {
          status = 'last_call';
          badgeLabel = isEn ? '🍂 Last call for sowing' : '🍂 Ostatni dzwonek na siew';
          badgeTone = 'amber';
          badgeIcon = 'AlertTriangle';
          isGoodTimeToPlantNow = true;
          dateExplanation = isEn
            ? `Today is ${formattedToday}. This is the final window for late autumn sowing (under fleece or for early spring harvest).`
            : `Dziś jest ${formattedToday}. To ostatni dzwonek na późny wysiew jesienny (np. pod agrowłókniną lub na zbiór wczesnowiosenny).`;
        } else {
          status = 'growing_season';
          badgeLabel = isEn ? '🧺 Harvest in progress • Buy nursery plant' : '🧺 Trwają zbiory • Kup gotową sadzonkę';
          badgeTone = 'sky';
          badgeIcon = 'CheckCircle2';
          isGoodTimeToPlantNow = false;
          dateExplanation = isEn
            ? `Today is ${formattedToday}. Plants are in full harvest. Too late for seeds, but you can still buy an established potted plant.`
            : `Dziś jest ${formattedToday}. Rośliny w pełni owocują. Z nasion jest za późno, ale możesz jeszcze kupić owocującą lub uformowaną roślinę w doniczce.`;
        }
      } else {
        status = 'growing_season';
        badgeLabel = isEn ? '🧺 Harvest and fruiting season' : '🧺 Sezon zbiorów i owocowania';
        badgeTone = 'sky';
        badgeIcon = 'CheckCircle2';
        isGoodTimeToPlantNow = false;
        dateExplanation = isEn
          ? `Today is ${formattedToday}. Plants are actively fruiting in balcony containers.`
          : `Dziś jest ${formattedToday}. Rośliny owocują w donicach na balkonie.`;
      }
    } else if (currentAction === 'pielegnacja' || currentAction === 'rosnie' || currentAction === 'kwitnie') {
      status = 'growing_season';
      badgeLabel = isEn ? '🌿 Active growing season' : '🌿 Sezon uprawy w toku';
      badgeTone = 'sky';
      badgeIcon = 'Calendar';
      isGoodTimeToPlantNow = false;
      dateExplanation = isEn
        ? `Today is ${formattedToday}. Active period of vegetative growth. Too late for seeds, but well-rooted starter plants can be potted.`
        : `Dziś jest ${formattedToday}. Trwa okres intensywnego wzrostu. Na siew z nasion jest za późno, ale możesz posadzić dobrze ukorzenioną gotową sadzonkę.`;
    } else if (
      currentAction === 'koniec_sezonu' ||
      currentAction === 'zimowanie' ||
      currentAction === 'zimowanie_balkon' ||
      currentAction === 'zimowanie_dom' ||
      currentAction === 'odpoczynek'
    ) {
      status = 'dormancy';
      badgeLabel = isEn ? '❄️ Winter dormancy (season end)' : '❄️ Spoczynek zimowy (koniec sezonu)';
      badgeTone = 'stone';
      badgeIcon = 'Clock';
      isGoodTimeToPlantNow = false;
      dateExplanation = isEn
        ? `Today is ${formattedToday}. Plants are completing their cycle or entering winter dormancy. Plan sowing for upcoming spring (${bestSowingLabel}).`
        : `Dziś jest ${formattedToday}. Roślina kończy wegetację lub wchodzi w stan spoczynku zimowego. Zaplanuj siew na nadchodzącą wiosnę (${bestSowingLabel}).`;
    } else {
      if (allSowPeriods.length > 0) {
        const firstSow = allSowPeriods[0];
        const [firstM] = firstSow.split('_').map((n) => parseInt(n, 10));

        if (currentMonth < firstM) {
          status = 'too_early';
          badgeLabel = isEn
            ? `⏳ Too early • Wait until ${MONTH_NAMES_EN[firstM]}`
            : `⏳ Za wcześnie • Poczekaj do ${MONTH_NAMES_GENITIVE_PL[firstM]}`;
          badgeTone = 'stone';
          badgeIcon = 'Clock';
          isGoodTimeToPlantNow = false;
          dateExplanation = isEn
            ? `Today is ${formattedToday}. Still too cold / early for sowing. Next sowing window: ${bestSowingLabel}.`
            : `Dziś jest ${formattedToday}. Jest jeszcze za chłodno / za wcześnie na siew. Najbliższy termin wysiewu to ${bestSowingLabel}.`;
        } else {
          status = 'too_late';
          badgeLabel = isEn ? '❄️ Too late for seeds this year' : '❄️ Za późno na siew nasion w tym roku';
          badgeTone = 'rose';
          badgeIcon = 'Clock';
          isGoodTimeToPlantNow = false;
          dateExplanation = isEn
            ? `Today is ${formattedToday}. Sowing window has passed for this season. Plan for next year (${bestSowingLabel}).`
            : `Dziś jest ${formattedToday}. W tym roku termin wysiewu nasion już minął. Zaplanuj uprawę na kolejny sezon (${bestSowingLabel}).`;
        }
      } else {
        status = 'growing_season';
        badgeLabel = isEn ? '🪴 Nursery potted plants' : '🪴 Gotowe sadzonki ze szkółki';
        badgeTone = 'stone';
        badgeIcon = 'Calendar';
        isGoodTimeToPlantNow = false;
        dateExplanation = isEn
          ? `Today is ${formattedToday}. Best planted from developed potted nursery stock.`
          : `Dziś jest ${formattedToday}. Najlepiej sadzić wyhodowane sadzonki ze szkółki ogrodniczej.`;
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
