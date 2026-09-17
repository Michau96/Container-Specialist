import { Plant, LegacyPotMaterial, PotMaterial, SupportType } from '../types';
import { getEffectivePlantRequirements } from './varietyData';

export type EvaluationRating = 'good' | 'warning' | 'bad';

export interface MaterialOption {
  key: LegacyPotMaterial;
  label: string;
  shortLabel: string;
}

export interface SupportOption {
  key: SupportType;
  label: string;
  shortLabel: string;
}

export const POT_MATERIAL_OPTIONS: MaterialOption[] = [
  { key: 'plastic', label: 'Plastik / Tworzywo sztuczne', shortLabel: 'Plastik' },
  { key: 'terracotta', label: 'Terakota / Ceramika nieszkliwiona', shortLabel: 'Terakota' },
  { key: 'wood', label: 'Drewno naturalne', shortLabel: 'Drewno' },
  { key: 'fabric', label: 'Geowłóknina / Smart Pot / Tkanina', shortLabel: 'Tkanina' },
  { key: 'ceramic', label: 'Ceramika szkliwiona', shortLabel: 'Ceramika' },
];

export const POT_SUPPORT_OPTIONS: SupportOption[] = [
  { key: 'none', label: 'Brak podpory', shortLabel: 'Brak' },
  { key: 'stake', label: 'Palik bambusowy', shortLabel: 'Palik bambusowy' },
  { key: 'trellis', label: 'Kratka balkonowa / Trejaż ścienny', shortLabel: 'Kratka / Trejaż' },
  { key: 'balcony_railing', label: 'Balustrada balkonowa', shortLabel: 'Balustrada' },
  { key: 'cage', label: 'Klatka / Spirala ogrodnicza', shortLabel: 'Klatka / Spirala' },
];

export interface MaterialEvaluation {
  rating: EvaluationRating;
  badgeText: 'Dobry wybór' | 'Średni / z zastrzeżeniami' | 'Zły wybór';
  title: string;
  description: string;
  waterImpact: string;
  thermalImpact: string;
}

export interface SupportEvaluation {
  isSupportNeeded: boolean;
  needBadgeText: 'TAK – Niezbędna do uprawy' | 'NIE – Roślina samonośna';
  needDescription: string;
  rating: EvaluationRating;
  badgeText: 'Dobry wybór' | 'Średni / z zastrzeżeniami' | 'Zły wybór';
  title: string;
  description: string;
  practicalTip: string;
}

/**
 * Ocena agronomiczna wybranego materiału donicy dla danej rośliny i odmiany.
 */
export function evaluatePotMaterial(
  material: LegacyPotMaterial | PotMaterial | string,
  plant: Plant,
  varietyName?: string
): MaterialEvaluation {
  const normMat =
    material === 'plastik' || material === 'plastic'
      ? 'plastic'
      : material === 'terracotta' || material === 'ceramika_terakota'
      ? 'terracotta'
      : material === 'drewno' || material === 'wood'
      ? 'wood'
      : material === 'tkanina' || material === 'fabric'
      ? 'fabric'
      : material === 'ceramic'
      ? 'ceramic'
      : 'plastic';

  const plantNameLower = plant.name.toLowerCase();
  const isHerb = plant.plant_group === 'ziola' || plantNameLower.includes('rozmaryn') || plantNameLower.includes('lawenda') || plantNameLower.includes('tymianek') || plantNameLower.includes('oregano') || plantNameLower.includes('szałwia');
  const isMushroom = plant.plant_group === 'grzyby' || plantNameLower.includes('pieczark') || plantNameLower.includes('boczniak');
  const isLeafyOrRoot = plantNameLower.includes('sałata') || plantNameLower.includes('rukola') || plantNameLower.includes('rzodkiew') || plantNameLower.includes('szpinak') || plantNameLower.includes('roszponka') || plantNameLower.includes('szczypiorek');
  const isHeavyFeederWaterLover = plantNameLower.includes('pomidor') || plantNameLower.includes('papryk') || plantNameLower.includes('ogórek') || plantNameLower.includes('cukinia') || plantNameLower.includes('bakłażan') || plantNameLower.includes('arbuz') || plantNameLower.includes('dynia') || plantNameLower.includes('truskawk');

  // 1. GRZYBY
  if (isMushroom) {
    if (normMat === 'plastic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Szczelne utrzymanie stałej wilgotności',
        description: 'Plastik nie pozwala podłożu z grzybnią wysychać przez ścianki, co jest kluczowe dla zawiązywania dorodnych owocników.',
        waterImpact: 'Minimalne straty wilgoci, wysoka stabilność mikroklimatu',
        thermalImpact: 'Neutralna izolacja, chronić przed bezpośrednim słońcem',
      };
    }
    if (normMat === 'terracotta') {
      return {
        rating: 'bad',
        badgeText: 'Zły wybór',
        title: 'Zbyt szybkie przesychanie podłoża',
        description: 'Porowata terakota wysusza grzybnię, co może uniemożliwić jej plonowanie. Grzyby wymagają stale wilgotnego mikroklimatu.',
        waterImpact: 'Wysokie straty wilgoci przez porowate ścianki',
        thermalImpact: 'Chłodzenie wyparne może wychłodzić grzybnię',
      };
    }
    return {
      rating: 'warning',
      badgeText: 'Średni / z zastrzeżeniami',
      title: 'Wymaga stałej kontroli wilgotności',
      description: 'Zapewnij częste zraszanie i osłoń pojemnik przed promieniami słońca.',
      waterImpact: 'Średnie zatrzymywanie wilgoci',
      thermalImpact: 'Utrzymuj w cieniu',
    };
  }

  // 2. ZIOŁA ŚRÓDZIEMNOMORSKIE (sucholubne, wrażliwe na przelanie)
  if (isHerb) {
    if (normMat === 'terracotta') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Wzorowy wybór dla ziół śródziemnomorskich',
        description: 'Porowata glina pozwala podłożu oddychać i naturalnie odprowadza nadmiar wody, chroniąc wrażliwe korzenie ziół przed zgnilizną.',
        waterImpact: 'Świetna regulacja wilgotności, brak ryzyka zastoju wody',
        thermalImpact: 'Naturalne chłodzenie bryły korzeniowej w upale',
      };
    }
    if (normMat === 'wood') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Naturalny mikroklimat i optymalna izolacja',
        description: 'Drewno stwarza bardzo dobre warunki dla ziół wieloletnich, chroniąc korzenie przed przegrzaniem latem i przemarzaniem zimą.',
        waterImpact: 'Umiarkowane parowanie, zdrowy rozwój korzeni',
        thermalImpact: 'Znakomita izolacja termiczna przez cały rok',
      };
    }
    if (normMat === 'fabric') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Maksymalne napowietrzenie korzeni',
        description: 'Tkanina zapobiega zalewaniu korzeni i zapewnia korzeniom stały dostęp do tlenu.',
        waterImpact: 'Szybki odpływ nadmiaru wody',
        thermalImpact: 'Brak przegrzewania bryły korzeniowej',
      };
    }
    if (normMat === 'plastic') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Uwaga na ryzyko przelania korzeni',
        description: 'Plastik bardzo długo zatrzymuje wodę. W przypadku ziół śródziemnomorskich koniecznie zastosuj 3–4 cm warstwę keramzytu na dnie i podlewaj oszczędnie.',
        waterImpact: 'Długie zatrzymywanie wilgoci, wymaga drenażu',
        thermalImpact: 'Szybko nagrzewa się w słońcu',
      };
    }
    if (normMat === 'ceramic') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Wymaga starannej kontroli odpływu',
        description: 'Szkliwiona ceramika nie oddycha ściankami. Pamiętaj o drożnych otworach odpływowych, by nie doprowadzić do zamierania ziół.',
        waterImpact: 'Zatrzymuje wilgoć wewnątrz',
        thermalImpact: 'Dobra stabilność termiczna',
      };
    }
  }

  // 3. WARZYWA LIŚCIOWE I KORZENIOWE (sałata, rzodkiewka, szpinak, szczypiorek)
  if (isLeafyOrRoot) {
    if (normMat === 'plastic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Optymalny do płytkich skrzynek balkonowych',
        description: 'Plastik utrzymuje równomierną wilgotność płytkiego podłoża, co zapobiega gorzknieniu liści sałaty i parceniu rzodkiewki pod wpływem suszy.',
        waterImpact: 'Równomierna wilgotność bez gwałtownego przesychania',
        thermalImpact: 'Szybkie budzenie nasion wczesną wiosną',
      };
    }
    if (normMat === 'wood') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Trwałe i stabilne środowisko wzrostu',
        description: 'Drewniane skrzynki doskonale nadają się do uprawy zieleniny, chroniąc podłoże przed wahaniami temperatur.',
        waterImpact: 'Stabilne warunki wodne',
        thermalImpact: 'Wysoka ochrona przed skokami temperatur',
      };
    }
    if (normMat === 'fabric') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Dobre warunki rozwoju bryły korzeniowej',
        description: 'Tkanina zapewnia świetne napowietrzenie młodych siewek, pilnuj jedynie regularnego zraszania.',
        waterImpact: 'Wymaga regularnego zraszania wierzchniej warstwy',
        thermalImpact: 'Równomierna temperatura podłoża',
      };
    }
    if (normMat === 'terracotta') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Ryzyko szybkiego przesychania płytkiego podłoża',
        description: 'Porowata glina szybko odciąga wodę z płytkich donic. W letnie słoneczne dni sałata może przedwcześnie wybić w pędy kwiatostanowe.',
        waterImpact: 'Szybka utrata wilgoci przez ścianki',
        thermalImpact: 'Chłodniejsze podłoże',
      };
    }
  }

  // 4. ROŚLINY ŻARŁOCZNE I DUŻO PIJĄCE (pomidory, papryki, ogórki, cukinie, truskawki)
  if (isHeavyFeederWaterLover) {
    if (normMat === 'plastic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Skuteczne magazynowanie wody dla rośliny',
        description: 'Plastik nie paruje ściankami, dzięki czemu cała podana woda trafia bezpośrednio do korzeni. Pomaga roślinie przetrwać upalne popołudnia bez więdnięcia.',
        waterImpact: 'Znakomite trzymanie wilgoci, wolniejsze przesychanie',
        thermalImpact: 'Wiosną przyspiesza wegetację, latem ciemne donice warto ocieniać',
      };
    }
    if (normMat === 'wood') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Najwyższa ochrona korzeni przed upałem',
        description: 'Grube drewno to najlepszy naturalny izolator termiczny. Korzenie nie ulegają przegrzaniu nawet na mocno nasłonecznionym balkonie.',
        waterImpact: 'Umiarkowane parowanie, wysoka stabilność podłoża',
        thermalImpact: 'Maksymalna ochrona przed ekstremalnym słońcem',
      };
    }
    if (normMat === 'ceramic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Stabilna, masywna i szczelna donica',
        description: 'Szkliwienie blokuje parowanie wody przez pory gliny, a duża waga donicy skutecznie zabezpiecza wysoki krzak przed przewróceniem przez podmuchy wiatru.',
        waterImpact: 'Trzyma wilgoć w podłożu jak plastik',
        thermalImpact: 'Wysoka bezwładność cieplna – powoli stygnie w nocy',
      };
    }
    if (normMat === 'fabric') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Znakomite korzenie, ale intensywne przesychanie',
        description: 'Tkanina daje fenomenalne napowietrzenie i rozrost korzeni (air-pruning), lecz woda paruje przez całą powierzchnię worka. W upalne dni wymaga podlewania nawet 2 razy dziennie.',
        waterImpact: 'Bardzo duże zapotrzebowanie na częste podlewanie w upały',
        thermalImpact: 'Świetne chłodzenie korzeni w upałach',
      };
    }
    if (normMat === 'terracotta') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Intensywna utrata wilgoci przez gliniane ścianki',
        description: 'Nieszkliwiona terakota mocno odciąga wodę z gleby i odparowuje ją na zewnątrz. Na gorącym balkonie wymaga bardzo obfitego i częstego nawadniania, by roślina nie zrzuciła zawiązków.',
        waterImpact: 'Duże straty wody przez porowate ścianki donicy',
        thermalImpact: 'Przyjemne chłodzenie bryły korzeniowej',
      };
    }
  }

  // DOMYŚLNA OCENA UNIWERSALNA
  if (normMat === 'plastic' || normMat === 'wood' || normMat === 'ceramic') {
    return {
      rating: 'good',
      badgeText: 'Dobry wybór',
      title: 'Sprawdzony i bezpieczny materiał donicowy',
      description: 'Zapewnia stabilne warunki wilgotnościowe i sprzyja prawidłowemu rozwojowi bryły korzeniowej.',
      waterImpact: 'Prawidłowe utrzymanie wilgotności',
      thermalImpact: 'Stabilna ochrona termiczna',
    };
  }

  return {
    rating: 'warning',
    badgeText: 'Średni / z zastrzeżeniami',
    title: 'Wymaga dostosowania rytmu nawadniania',
    description: 'Materiał porowaty – pilnuj regularnego podlewania w cieplejsze dni.',
    waterImpact: 'Zwiększone parowanie ściankami',
    thermalImpact: 'Dobre napowietrzenie podłoża',
  };
}

/**
 * Sprawdza, czy roślina lub odmiana bezwzględnie wymaga podpory (np. palika, kratki).
 */
export function isSupportNeededForPlant(plant: Plant, varietyName?: string): {
  isNeeded: boolean;
  needBadgeText: 'TAK – Niezbędna do uprawy' | 'NIE – Roślina samonośna';
  needDescription: string;
} {
  const reqs = getEffectivePlantRequirements(plant, varietyName);
  const plantNameLower = plant.name.toLowerCase();
  const varietyLower = (varietyName || '').toLowerCase();

  // Sprawdź czy to odmiana mikrokarłowa lub zwisająca (samonośna)
  const isCompactDwarf =
    varietyLower.includes('vilma') ||
    varietyLower.includes('tiny tim') ||
    varietyLower.includes('bajaja') ||
    varietyLower.includes('venus') ||
    varietyLower.includes('aztek') ||
    varietyLower.includes('balconi yellow');

  // Sprawdź wprost flagi w spacing_guide i reqs
  const directFlag =
    reqs.requiresSupport ||
    Boolean(plant.spacing_guide?.requires_bamboo_stake);

  // Pomidory
  if (plantNameLower.includes('pomidor')) {
    if (isCompactDwarf) {
      return {
        isNeeded: false,
        needBadgeText: 'NIE – Roślina samonośna',
        needDescription: `Odmiana '${varietyName || 'karłowa'}' charakteryzuje się sztywnymi, zwartymi pędami do 25–35 cm i nie wymaga palikowania.`,
      };
    }
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needDescription: 'Pomidor tworzy wiotkie, silnie rosnące pędy i ciężkie grona owoców, które bez podparcia wyłamią się pod własnym ciężarem lub na wietrze.',
    };
  }

  // Pnącza (fasola, groch, ogórek, arbuz mini, melon)
  if (
    plantNameLower.includes('fasol') ||
    plantNameLower.includes('groszek') ||
    plantNameLower.includes('ogórek') ||
    plantNameLower.includes('arbuz') ||
    plantNameLower.includes('melon')
  ) {
    if (varietyLower.includes('karłow') || varietyLower.includes('krzaczkow')) {
      return {
        isNeeded: false,
        needBadgeText: 'NIE – Roślina samonośna',
        needDescription: `Odmiana krzaczasta/karłowa nie wspina się wysoko i utrzymuje stabilny pokrój bez podpór.`,
      };
    }
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needDescription: 'Roślina wytwarza pędy pnące i wąsy czepne – wymaga pionowej konstrukcji (kratki, tyczki lub siatki) do prawidłowego owocowania.',
    };
  }

  // Papryka
  if (plantNameLower.includes('papryk')) {
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needDescription: 'Kruche pędy papryki łatwo wyłamują się pod ciężarem dorodnych owoców podczas silniejszych podmuchów wiatru na balkonie.',
    };
  }

  // Bakłażan
  if (plantNameLower.includes('bakłażan') || plantNameLower.includes('oberżyn')) {
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needDescription: 'Ciężkie owoce bakłażana wymagają stabilizacji pędu głównego palikiem bambusowym.',
    };
  }

  // Zielenina, zioła, rzodkiewka, grzyby, truskawki (samonośne)
  if (
    plantNameLower.includes('sałat') ||
    plantNameLower.includes('rukola') ||
    plantNameLower.includes('rzodkiew') ||
    plantNameLower.includes('szpinak') ||
    plantNameLower.includes('szczypiorek') ||
    plantNameLower.includes('bazyli') ||
    plantNameLower.includes('mięt') ||
    plantNameLower.includes('lawend') ||
    plantNameLower.includes('rozmaryn') ||
    plantNameLower.includes('tymian') ||
    plantNameLower.includes('oregano') ||
    plantNameLower.includes('pietruszk') ||
    plantNameLower.includes('koper') ||
    plantNameLower.includes('cukinia') ||
    plant.plant_group === 'ziola' ||
    plant.plant_group === 'grzyby' ||
    !directFlag
  ) {
    return {
      isNeeded: false,
      needBadgeText: 'NIE – Roślina samonośna',
      needDescription: 'Roślina charakteryzuje się niskim, zwartym lub kaskadowym pokrojem – nie wymaga żadnych rusztowań ani palików.',
    };
  }

  return {
    isNeeded: directFlag,
    needBadgeText: directFlag ? 'TAK – Niezbędna do uprawy' : 'NIE – Roślina samonośna',
    needDescription: directFlag
      ? 'Roślina wymaga stabilizacji pędów pod ciężarem plonów.'
      : 'Roślina nie wymaga podpory.',
  };
}

/**
 * Pełna ocena wybranej podpory:
 * 1. Czy podpora jest potrzebna
 * 2. Czy wybrana podpora to dobry, średni czy zły wybór
 */
export function evaluatePlantSupport(
  support: SupportType,
  plant: Plant,
  varietyName?: string
): SupportEvaluation {
  const needInfo = isSupportNeededForPlant(plant, varietyName);
  const plantNameLower = plant.name.toLowerCase();
  const isClimber =
    plantNameLower.includes('fasol') ||
    plantNameLower.includes('groszek') ||
    plantNameLower.includes('ogórek') ||
    plantNameLower.includes('arbuz') ||
    plantNameLower.includes('melon');
  const isTomatoOrPepper = plantNameLower.includes('pomidor') || plantNameLower.includes('papryk') || plantNameLower.includes('bakłażan');

  // PRZYPADEK A: Podpora NIE jest potrzebna roślinie
  if (!needInfo.isNeeded) {
    if (support === 'none') {
      return {
        isSupportNeeded: false,
        needBadgeText: needInfo.needBadgeText,
        needDescription: needInfo.needDescription,
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Brak podpory jest w 100% optymalny',
        description: 'Roślina ma zwarty, samonośny lub płożący pokrój – nie potrzebuje rusztowań ani palików.',
        practicalTip: 'Zaoszczędzona przestrzeń w donicy pozwala korzeniom na swobodny i równomierny rozrost.',
      };
    }

    return {
      isSupportNeeded: false,
      needBadgeText: needInfo.needBadgeText,
      needDescription: needInfo.needDescription,
      rating: 'warning',
      badgeText: 'Średni / z zastrzeżeniami',
      title: 'Podpora jest zbędna dla tej rośliny',
      description: 'Zainstalowanie podpory nie zaszkodzi roślinie, ale jest zbędne i może niepotrzebnie uszkodzić korzenie przy wbijaniu w ziemię.',
      practicalTip: 'Dla tej odmiany możesz śmiało zmienić wybór na „Brak podpory”.',
    };
  }

  // PRZYPADEK B: Podpora JEST potrzebna roślinie
  if (support === 'none') {
    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needDescription: needInfo.needDescription,
      rating: 'bad',
      badgeText: 'Zły wybór',
      title: 'Zły wybór: Roślina wymaga stabilizacji',
      description: 'Pozostawienie tej rośliny bez podpory grozi wyłamaniem pędów pod ciężarem owoców oraz połamaniem przez silniejsze podmuchy wiatru.',
      practicalTip: 'Wybierz palik bambusowy, kratkę ścienną lub klatkę ogrodniczą, aby zabezpieczyć plon.',
    };
  }

  if (support === 'stake') {
    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needDescription: needInfo.needDescription,
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Palik wystarczy tylko na początku',
        description: 'Pojedynczy palik utrzyma roślinę w fazie początkowej, ale silnie rosnące pnącze szybko go przerośnie. Lepszym wyborem będzie kratka lub siatka.',
        practicalTip: 'Jeśli używasz palika, regularnie owijaj pędy spiralnie ku górze.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needDescription: needInfo.needDescription,
      rating: 'good',
      badgeText: 'Dobry wybór',
      title: 'Bardzo dobry wybór: Solidna stabilizacja pędu',
      description: 'Palik bambusowy (60–80 cm) wbity do dna donicy doskonale stabilizuje pęd główny i chroni grona owocowe przed złamaniem.',
      practicalTip: 'Wbij palik już przy sadzeniu rozsady, by nie uszkodzić korzeni. Pędy podwiązuj elastycznym sznurkiem w ósemkę.',
    };
  }

  if (support === 'trellis') {
    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needDescription: needInfo.needDescription,
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Idealny wybór dla roślin pnących',
        description: 'Kratka pozwala wąsom czepnym i pędom równomiernie rozrosnąć się po całej płaszczyźnie, zapewniając liściom i owocom maksymalny dostęp do słońca.',
        practicalTip: 'Przymocuj kratkę do ściany lub stabilnie do tylnej krawędzi skrzynki balkonowej.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needDescription: needInfo.needDescription,
      rating: 'good',
      badgeText: 'Dobry wybór',
      title: 'Bardzo dobra stabilizacja i wentylacja pędów',
      description: 'Kratka umożliwia wygodne rozpinanie bocznych pędów i zapewnia świetną cyrkulację powietrza zapobiegającą chorobom grzybowym.',
      practicalTip: 'Podwiązuj pędy luźnymi klipsami ogrodniczymi.',
    };
  }

  if (support === 'balcony_railing') {
    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needDescription: needInfo.needDescription,
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Świetne wykorzystanie naturalnej konstrukcji balkonu',
        description: 'Prowadzenie pędów ku poręczy balkonu pozwala zaoszczędzić cenną przestrzeń na podłodze i równomiernie doświetlić owoce.',
        practicalTip: 'Rozepnij sznurki jutowe od podstawy donicy do szczebli balustrady.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needDescription: needInfo.needDescription,
      rating: 'warning',
      badgeText: 'Średni / z zastrzeżeniami',
      title: 'Wymaga starannego prowadzenia pędów',
      description: 'Balustrada może być zbyt oddalona od środka donicy. Uważaj, aby delikatne pędy nie ocierały się o nagrzany metal poręczy.',
      practicalTip: 'Użyj miękkiego sznurka jako łącznika i zabezpiecz łodygi przed wiatrem.',
    };
  }

  if (support === 'cage') {
    if (isTomatoOrPepper) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needDescription: needInfo.needDescription,
        rating: 'good',
        badgeText: 'Dobry wybór',
        title: 'Przestrzenna ochrona 360°',
        description: 'Trójwymiarowy pierścień klatki podtrzymuje wszystkie boczne gałązki z owocami bez konieczności ciągłego podwiązywania każdego pędu.',
        practicalTip: 'Załóż klatkę nad rośliną już na etapie sadzenia rozsady do donicy.',
      };
    }

    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needDescription: needInfo.needDescription,
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        title: 'Klatka może okazać się za niska',
        description: 'Dla silnie rosnących pnączy klatka może być za niska – pędy po dotarciu na szczyt zaczną opadać i plątać się.',
        practicalTip: 'Dla wysokich pnączy lepsza będzie wysoka kratka ścienna.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needDescription: needInfo.needDescription,
      rating: 'good',
      badgeText: 'Dobry wybór',
      title: 'Dobra ochrona przed wyłamywaniem pędów',
      description: 'Klatka ogrodnicza stanowi solidne oparcie w wietrzne dni.',
      practicalTip: 'Upewnij się, że nóżki klatki są stabilnie zagłębione w podłożu.',
    };
  }

  return {
    isSupportNeeded: true,
    needBadgeText: 'TAK – Niezbędna do uprawy',
    needDescription: 'Roślina wymaga stabilizacji.',
    rating: 'good',
    badgeText: 'Dobry wybór',
    title: 'Podpora spełnia swoją funkcję',
    description: 'Wybrana podpora zabezpiecza pędy rośliny.',
    practicalTip: 'Podwiązuj pędy w miarę wzrostu rośliny.',
  };
}
