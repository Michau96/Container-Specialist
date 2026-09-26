import { Plant, LegacyPotMaterial, PotMaterial, SupportType } from '../types';
import { getEffectivePlantRequirements } from './varietyData';

export type EvaluationRating = 'good' | 'warning' | 'bad';

export interface MaterialOption {
  key: LegacyPotMaterial;
  label: string;
  labelEn: string;
  shortLabel: string;
  shortLabelEn: string;
}

export interface SupportOption {
  key: SupportType;
  label: string;
  labelEn: string;
  shortLabel: string;
  shortLabelEn: string;
}

export const POT_MATERIAL_OPTIONS: MaterialOption[] = [
  { key: 'plastic', label: 'Plastik / Tworzywo sztuczne', labelEn: 'Plastic / Polymer', shortLabel: 'Plastik', shortLabelEn: 'Plastic' },
  { key: 'terracotta', label: 'Terakota / Ceramika nieszkliwiona', labelEn: 'Terracotta / Unglazed clay', shortLabel: 'Terakota', shortLabelEn: 'Terracotta' },
  { key: 'wood', label: 'Drewno naturalne', labelEn: 'Natural wood / Planter box', shortLabel: 'Drewno', shortLabelEn: 'Wood' },
  { key: 'fabric', label: 'Geowłóknina / Smart Pot / Tkanina', labelEn: 'Fabric pot / Grow bag', shortLabel: 'Tkanina', shortLabelEn: 'Fabric' },
  { key: 'ceramic', label: 'Ceramika szkliwiona', labelEn: 'Glazed ceramic', shortLabel: 'Ceramika', shortLabelEn: 'Ceramic' },
];

export const POT_SUPPORT_OPTIONS: SupportOption[] = [
  { key: 'none', label: 'Brak podpory', labelEn: 'No support needed', shortLabel: 'Brak', shortLabelEn: 'None' },
  { key: 'stake', label: 'Palik bambusowy', labelEn: 'Bamboo stake', shortLabel: 'Palik bambusowy', shortLabelEn: 'Bamboo stake' },
  { key: 'trellis', label: 'Kratka balkonowa / Trejaż ścienny', labelEn: 'Balcony trellis / Wall grid', shortLabel: 'Kratka / Trejaż', shortLabelEn: 'Trellis' },
  { key: 'balcony_railing', label: 'Balustrada balkonowa', labelEn: 'Balcony railing', shortLabel: 'Balustrada', shortLabelEn: 'Railing' },
  { key: 'cage', label: 'Klatka / Spirala ogrodnicza', labelEn: 'Plant cage / Spiral support', shortLabel: 'Klatka / Spirala', shortLabelEn: 'Plant cage' },
];

export interface MaterialEvaluation {
  rating: EvaluationRating;
  badgeText: 'Dobry wybór' | 'Średni / z zastrzeżeniami' | 'Zły wybór';
  badgeTextEn: 'Good choice' | 'Average / with cautions' | 'Poor choice';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  waterImpact: string;
  waterImpactEn: string;
  thermalImpact: string;
  thermalImpactEn: string;
}

export interface SupportEvaluation {
  isSupportNeeded: boolean;
  needBadgeText: 'TAK – Niezbędna do uprawy' | 'NIE – Roślina samonośna';
  needBadgeTextEn: 'YES – Essential for cultivation' | 'NO – Self-supporting plant';
  needDescription: string;
  needDescriptionEn: string;
  rating: EvaluationRating;
  badgeText: 'Dobry wybór' | 'Średni / z zastrzeżeniami' | 'Zły wybór';
  badgeTextEn: 'Good choice' | 'Average / with cautions' | 'Poor choice';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  practicalTip: string;
  practicalTipEn: string;
}

/**
 * Ocena agronomiczna wybranego materiału donicy dla danej rośliny i odmiany.
 */
export function evaluatePotMaterial(
  material: LegacyPotMaterial | PotMaterial | string,
  plant?: Plant | null,
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

  if (!plant || !plant.name) {
    return {
      rating: 'good',
      badgeText: 'Dobry wybór',
      badgeTextEn: 'Good choice',
      title: 'Uniwersalny materiał donicy',
      titleEn: 'Universal container material',
      description: 'Materiał zapewnia odpowiednie warunki dla większości upraw balkonowych.',
      descriptionEn: 'This material provides suitable growing conditions for most balcony crops.',
      waterImpact: 'Standardowa retencja wody',
      waterImpactEn: 'Standard moisture retention',
      thermalImpact: 'Optymalna temperatura podłoża',
      thermalImpactEn: 'Optimal substrate temperature',
    };
  }

  const plantNameLower = plant.name.toLowerCase();
  const isHerb =
    plant.plant_group === 'ziola' ||
    plantNameLower.includes('rozmaryn') ||
    plantNameLower.includes('lawenda') ||
    plantNameLower.includes('tymianek') ||
    plantNameLower.includes('oregano') ||
    plantNameLower.includes('szałwia');
  const isMushroom =
    plant.plant_group === 'grzyby' ||
    plantNameLower.includes('pieczark') ||
    plantNameLower.includes('boczniak');
  const isLeafyOrRoot =
    plantNameLower.includes('sałata') ||
    plantNameLower.includes('rukola') ||
    plantNameLower.includes('rzodkiew') ||
    plantNameLower.includes('szpinak') ||
    plantNameLower.includes('roszponka') ||
    plantNameLower.includes('szczypiorek');
  const isHeavyFeederWaterLover =
    plantNameLower.includes('pomidor') ||
    plantNameLower.includes('papryk') ||
    plantNameLower.includes('ogórek') ||
    plantNameLower.includes('cukinia') ||
    plantNameLower.includes('bakłażan') ||
    plantNameLower.includes('arbuz') ||
    plantNameLower.includes('dynia') ||
    plantNameLower.includes('truskawk');

  // 1. GRZYBY
  if (isMushroom) {
    if (normMat === 'plastic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Szczelne utrzymanie stałej wilgotności',
        titleEn: 'Effective moisture retention for mycelium',
        description: 'Plastik nie pozwala podłożu z grzybnią wysychać przez ścianki, co jest kluczowe dla zawiązywania dorodnych owocników.',
        descriptionEn: 'Plastic prevents the substrate from drying out through container walls, essential for robust fruiting bodies.',
        waterImpact: 'Minimalne straty wilgoci, wysoka stabilność mikroklimatu',
        waterImpactEn: 'Minimal moisture loss, high microclimate stability',
        thermalImpact: 'Neutralna izolacja, chronić przed bezpośrednim słońcem',
        thermalImpactEn: 'Neutral thermal insulation; protect from direct sun',
      };
    }
    if (normMat === 'terracotta') {
      return {
        rating: 'bad',
        badgeText: 'Zły wybór',
        badgeTextEn: 'Poor choice',
        title: 'Zbyt szybkie przesychanie podłoża',
        titleEn: 'Substrate dries out too quickly',
        description: 'Porowata terakota wysusza grzybnię, co może uniemożliwić jej plonowanie. Grzyby wymagają stale wilgotnego mikroklimatu.',
        descriptionEn: 'Porous terracotta wicks moisture away from mycelium, hindering fruiting. Mushrooms require consistently humid conditions.',
        waterImpact: 'Wysokie straty wilgoci przez porowate ścianki',
        waterImpactEn: 'High moisture loss through porous pot walls',
        thermalImpact: 'Chłodzenie wyparne może wychłodzić grzybnię',
        thermalImpactEn: 'Evaporative cooling may overchill the mycelium block',
      };
    }
    return {
      rating: 'warning',
      badgeText: 'Średni / z zastrzeżeniami',
      badgeTextEn: 'Average / with cautions',
      title: 'Wymaga stałej kontroli wilgotności',
      titleEn: 'Requires constant moisture monitoring',
      description: 'Zapewnij częste zraszanie i osłoń pojemnik przed promieniami słońca.',
      descriptionEn: 'Mist frequently and keep the container shaded from direct sun rays.',
      waterImpact: 'Średnie zatrzymywanie wilgoci',
      waterImpactEn: 'Moderate moisture retention',
      thermalImpact: 'Utrzymuj w cieniu',
      thermalImpactEn: 'Keep in shade',
    };
  }

  // 2. ZIOŁA ŚRÓDZIEMNOMORSKIE (sucholubne, wrażliwe na przelanie)
  if (isHerb) {
    if (normMat === 'terracotta') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Wzorowy wybór dla ziół śródziemnomorskich',
        titleEn: 'Exemplary choice for Mediterranean herbs',
        description: 'Porowata glina pozwala podłożu oddychać i naturalnie odprowadza nadmiar wody, chroniąc wrażliwe korzenie ziół przed zgnilizną.',
        descriptionEn: 'Porous clay lets the root zone breathe and wicks away excess moisture, shielding delicate herb roots from rot.',
        waterImpact: 'Świetna regulacja wilgotności, brak ryzyka zastoju wody',
        waterImpactEn: 'Excellent moisture regulation, eliminates waterlogging risk',
        thermalImpact: 'Naturalne chłodzenie bryły korzeniowej w upale',
        thermalImpactEn: 'Natural root ball cooling during hot summer days',
      };
    }
    if (normMat === 'wood') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Naturalny mikroklimat i optymalna izolacja',
        titleEn: 'Natural microclimate and optimal thermal insulation',
        description: 'Drewno stwarza bardzo dobre warunki dla ziół wieloletnich, chroniąc korzenie przed przegrzaniem latem i przemarzaniem zimą.',
        descriptionEn: 'Wood creates an ideal environment for perennial herbs, protecting roots from summer heatwaves and winter frost.',
        waterImpact: 'Umiarkowane parowanie, zdrowy rozwój korzeni',
        waterImpactEn: 'Moderate evaporation, healthy root aeration',
        thermalImpact: 'Znakomita izolacja termiczna przez cały rok',
        thermalImpactEn: 'Superb thermal insulation all year round',
      };
    }
    if (normMat === 'fabric') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Maksymalne napowietrzenie korzeni',
        titleEn: 'Maximum root aeration and air-pruning',
        description: 'Tkanina zapobiega zalewaniu korzeni i zapewnia korzeniom stały dostęp do tlenu.',
        descriptionEn: 'Fabric prevents waterlogging and guarantees constant oxygen supply to the roots.',
        waterImpact: 'Szybki odpływ nadmiaru wody',
        waterImpactEn: 'Rapid drainage of excess water',
        thermalImpact: 'Brak przegrzewania bryły korzeniowej',
        thermalImpactEn: 'Prevents root ball overheating',
      };
    }
    if (normMat === 'plastic') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Uwaga na ryzyko przelania korzeni',
        titleEn: 'Caution: risk of root overwatering',
        description: 'Plastik bardzo długo zatrzymuje wodę. W przypadku ziół śródziemnomorskich koniecznie zastosuj 3–4 cm warstwę keramzytu na dnie i podlewaj oszczędnie.',
        descriptionEn: 'Plastic retains water for a long time. For Mediterranean herbs, add a 3–4 cm layer of leca clay at the bottom and water sparingly.',
        waterImpact: 'Długie zatrzymywanie wilgoci, wymaga drenażu',
        waterImpactEn: 'Long water retention, drainage layer mandatory',
        thermalImpact: 'Szybko nagrzewa się w słońcu',
        thermalImpactEn: 'Heats up quickly under direct sunlight',
      };
    }
    if (normMat === 'ceramic') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Wymaga starannej kontroli odpływu',
        titleEn: 'Requires careful drainage management',
        description: 'Szkliwiona ceramika nie oddycha ściankami. Pamiętaj o drożnych otworach odpływowych, by nie doprowadzić do zamierania ziół.',
        descriptionEn: 'Glazed ceramic does not breathe through walls. Ensure unobstructed drainage holes to prevent root decline.',
        waterImpact: 'Zatrzymuje wilgoć wewnątrz',
        waterImpactEn: 'Traps moisture inside',
        thermalImpact: 'Dobra stabilność termiczna',
        thermalImpactEn: 'Good thermal stability',
      };
    }
  }

  // 3. WARZYWA LIŚCIOWE I KORZENIOWE (sałata, rzodkiewka, szpinak, szczypiorek)
  if (isLeafyOrRoot) {
    if (normMat === 'plastic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Optymalny do płytkich skrzynek balkonowych',
        titleEn: 'Optimal for shallow balcony planter boxes',
        description: 'Plastik utrzymuje równomierną wilgotność płytkiego podłoża, co zapobiega gorzknieniu liści sałaty i parceniu rzodkiewki pod wpływem suszy.',
        descriptionEn: 'Plastic maintains even moisture in shallow soil, preventing lettuce leaves from turning bitter and radishes from going woody.',
        waterImpact: 'Równomierna wilgotność bez gwałtownego przesychania',
        waterImpactEn: 'Even moisture without sudden rapid drying',
        thermalImpact: 'Szybkie budzenie nasion wczesną wiosną',
        thermalImpactEn: 'Quick substrate warming for early spring germination',
      };
    }
    if (normMat === 'wood') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Trwałe i stabilne środowisko wzrostu',
        titleEn: 'Durable and stable growing environment',
        description: 'Drewniane skrzynki doskonale nadają się do uprawy zieleniny, chroniąc podłoże przed wahaniami temperatur.',
        descriptionEn: 'Wooden planters are great for leafy greens, protecting the root zone against temperature swings.',
        waterImpact: 'Stabilne warunki wodne',
        waterImpactEn: 'Stable moisture balance',
        thermalImpact: 'Wysoka ochrona przed skokami temperatur',
        thermalImpactEn: 'High thermal buffer against temperature spikes',
      };
    }
    if (normMat === 'fabric') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Dobre warunki rozwoju bryły korzeniowej',
        titleEn: 'Healthy root system development',
        description: 'Tkanina zapewnia świetne napowietrzenie młodych siewek, pilnuj jedynie regularnego zraszania.',
        descriptionEn: 'Fabric ensures excellent aeration for young seedlings; maintain regular top-surface watering.',
        waterImpact: 'Wymaga regularnego zraszania wierzchniej warstwy',
        waterImpactEn: 'Requires frequent surface misting/watering',
        thermalImpact: 'Równomierna temperatura podłoża',
        thermalImpactEn: 'Uniform soil temperature',
      };
    }
    if (normMat === 'terracotta') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Ryzyko szybkiego przesychania płytkiego podłoża',
        titleEn: 'Risk of rapid soil drying in shallow containers',
        description: 'Porowata glina szybko odciąga wodę z płytkich donic. W letnie słoneczne dni sałata może przedwcześnie wybić w pędy kwiatostanowe.',
        descriptionEn: 'Porous clay quickly draws water out of shallow soil. On hot sunny days, lettuce may bolt prematurely.',
        waterImpact: 'Szybka utrata wilgoci przez ścianki',
        waterImpactEn: 'Fast water loss through container walls',
        thermalImpact: 'Chłodniejsze podłoże',
        thermalImpactEn: 'Cooler root environment',
      };
    }
  }

  // 4. ROŚLINY ŻARŁOCZNE I DUŻO PIJĄCE (pomidory, papryki, ogórki, cukinie, truskawki)
  if (isHeavyFeederWaterLover) {
    if (normMat === 'plastic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Skuteczne magazynowanie wody dla rośliny',
        titleEn: 'Effective water retention for thirsty plants',
        description: 'Plastik nie paruje ściankami, dzięki czemu cała podana woda trafia bezpośrednio do korzeni. Pomaga roślinie przetrwać upalne popołudnia bez więdnięcia.',
        descriptionEn: 'Plastic prevents evaporation through walls, delivering all moisture directly to the root zone and avoiding afternoon wilting.',
        waterImpact: 'Znakomite trzymanie wilgoci, wolniejsze przesychanie',
        waterImpactEn: 'Superb moisture retention, slower soil dry-out',
        thermalImpact: 'Wiosną przyspiesza wegetację, latem ciemne donice warto ocieniać',
        thermalImpactEn: 'Accelerates spring growth; shade dark pots during peak summer',
      };
    }
    if (normMat === 'wood') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Najwyższa ochrona korzeni przed upałem',
        titleEn: 'Superior root protection against summer heat',
        description: 'Grube drewno to najlepszy naturalny izolator termiczny. Korzenie nie ulegają przegrzaniu nawet na mocno nasłonecznionym balkonie.',
        descriptionEn: 'Thick timber is the finest natural thermal insulator, keeping roots comfortably cool even on sun-baked balconies.',
        waterImpact: 'Umiarkowane parowanie, wysoka stabilność podłoża',
        waterImpactEn: 'Moderate evaporation, high substrate stability',
        thermalImpact: 'Maksymalna ochrona przed ekstremalnym słońcem',
        thermalImpactEn: 'Maximum defense against intense scorching sunlight',
      };
    }
    if (normMat === 'ceramic') {
      return {
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Stabilna, masywna i szczelna donica',
        titleEn: 'Stable, hefty, and non-porous container',
        description: 'Szkliwienie blokuje parowanie wody przez pory gliny, a duża waga donicy skutecznie zabezpiecza wysoki krzak przed przewróceniem przez podmuchy wiatru.',
        descriptionEn: 'Glaze blocks wall evaporation while the pot weight reliably anchors tall fruiting plants against sudden balcony wind gusts.',
        waterImpact: 'Trzyma wilgoć w podłożu jak plastik',
        waterImpactEn: 'Holds substrate moisture just like plastic',
        thermalImpact: 'Wysoka bezwładność cieplna – powoli stygnie w nocy',
        thermalImpactEn: 'High thermal mass – cools down gently overnight',
      };
    }
    if (normMat === 'fabric') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Znakomite korzenie, ale intensywne przesychanie',
        titleEn: 'Superb root structure but rapid evaporation',
        description: 'Tkanina daje fenomenalne napowietrzenie i rozrost korzeni (air-pruning), lecz woda paruje przez całą powierzchnię worka. W upalne dni wymaga podlewania nawet 2 razy dziennie.',
        descriptionEn: 'Fabric bags provide amazing air-pruning and aeration, but evaporate moisture over their entire surface. On hot days, water up to twice daily.',
        waterImpact: 'Bardzo duże zapotrzebowanie na częste podlewanie w upały',
        waterImpactEn: 'Very high watering frequency required during hot spells',
        thermalImpact: 'Świetne chłodzenie korzeni w upałach',
        thermalImpactEn: 'Excellent root cooling during intense heat',
      };
    }
    if (normMat === 'terracotta') {
      return {
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Intensywna utrata wilgoci przez gliniane ścianki',
        titleEn: 'Intense moisture loss through porous clay walls',
        description: 'Nieszkliwiona terakota mocno odciąga wodę z gleby i odparowuje ją na zewnątrz. Na gorącym balkonie wymaga bardzo obfitego i częstego nawadniania, by roślina nie zrzuciła zawiązków.',
        descriptionEn: 'Unglazed clay pulls water from soil and evaporates it outwards. On a hot balcony, water generously and often so blossoms do not drop.',
        waterImpact: 'Duże straty wody przez porowate ścianki donicy',
        waterImpactEn: 'Significant water loss through porous planter walls',
        thermalImpact: 'Przyjemne chłodzenie bryły korzeniowej',
        thermalImpactEn: 'Pleasant evaporative cooling for the root zone',
      };
    }
  }

  // DOMYŚLNA OCENA UNIWERSALNA
  if (normMat === 'plastic' || normMat === 'wood' || normMat === 'ceramic') {
    return {
      rating: 'good',
      badgeText: 'Dobry wybór',
      badgeTextEn: 'Good choice',
      title: 'Sprawdzony i bezpieczny materiał donicowy',
      titleEn: 'Proven and safe container material',
      description: 'Zapewnia stabilne warunki wilgotnościowe i sprzyja prawidłowemu rozwojowi bryły korzeniowej.',
      descriptionEn: 'Maintains steady moisture levels and promotes healthy root ball development.',
      waterImpact: 'Prawidłowe utrzymanie wilgotności',
      waterImpactEn: 'Reliable moisture retention',
      thermalImpact: 'Stabilna ochrona termiczna',
      thermalImpactEn: 'Stable thermal buffer',
    };
  }

  return {
    rating: 'warning',
    badgeText: 'Średni / z zastrzeżeniami',
    badgeTextEn: 'Average / with cautions',
    title: 'Wymaga dostosowania rytmu nawadniania',
    titleEn: 'Requires adjusted watering schedule',
    description: 'Materiał porowaty – pilnuj regularnego podlewania w cieplejsze dni.',
    descriptionEn: 'Porous material – monitor soil moisture and water regularly on warm days.',
    waterImpact: 'Zwiększone parowanie ściankami',
    waterImpactEn: 'Increased evaporation through container walls',
    thermalImpact: 'Dobre napowietrzenie podłoża',
    thermalImpactEn: 'Good substrate aeration',
  };
}

/**
 * Sprawdza, czy roślina lub odmiana bezwzględnie wymaga podpory (np. palika, kratki).
 */
export function isSupportNeededForPlant(plant?: Plant | null, varietyName?: string): {
  isNeeded: boolean;
  needBadgeText: 'TAK – Niezbędna do uprawy' | 'NIE – Roślina samonośna';
  needBadgeTextEn: 'YES – Essential for cultivation' | 'NO – Self-supporting plant';
  needDescription: string;
  needDescriptionEn: string;
} {
  if (!plant || !plant.name) {
    return {
      isNeeded: false,
      needBadgeText: 'NIE – Roślina samonośna',
      needBadgeTextEn: 'NO – Self-supporting plant',
      needDescription: 'Standardowa roślina kompaktowa nie wymaga podpory.',
      needDescriptionEn: 'A standard compact plant does not require structural support.',
    };
  }
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
        needBadgeTextEn: 'NO – Self-supporting plant',
        needDescription: `Odmiana '${varietyName || 'karłowa'}' charakteryzuje się sztywnymi, zwartymi pędami do 25–35 cm i nie wymaga palikowania.`,
        needDescriptionEn: `The '${varietyName || 'dwarf'}' variety features stiff, compact stems reaching 25–35 cm and does not require staking.`,
      };
    }
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needBadgeTextEn: 'YES – Essential for cultivation',
      needDescription: 'Pomidor tworzy wiotkie, silnie rosnące pędy i ciężkie grona owoców, które bez podparcia wyłamią się pod własnym ciężarem lub na wietrze.',
      needDescriptionEn: 'Tomatoes produce flexible, vigorously growing vines and heavy fruit clusters that will snap without sturdy support under crop weight or wind gusts.',
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
        needBadgeTextEn: 'NO – Self-supporting plant',
        needDescription: 'Odmiana krzaczasta/karłowa nie wspina się wysoko i utrzymuje stabilny pokrój bez podpór.',
        needDescriptionEn: 'Bush/dwarf variety remains low and self-supporting without requiring climbing structures.',
      };
    }
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needBadgeTextEn: 'YES – Essential for cultivation',
      needDescription: 'Roślina wytwarza pędy pnące i wąsy czepne – wymaga pionowej konstrukcji (kratki, tyczki lub siatki) do prawidłowego owocowania.',
      needDescriptionEn: 'Plant develops climbing tendrils and rambling vines — vertical support (trellis, pole, or netting) is essential for proper fruiting.',
    };
  }

  // Papryka
  if (plantNameLower.includes('papryk')) {
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needBadgeTextEn: 'YES – Essential for cultivation',
      needDescription: 'Kruche pędy papryki łatwo wyłamują się pod ciężarem dorodnych owoców podczas silniejszych podmuchów wiatru na balkonie.',
      needDescriptionEn: 'Brittle pepper stems snap easily under heavy fruit loads during strong balcony wind gusts.',
    };
  }

  // Bakłażan
  if (plantNameLower.includes('bakłażan') || plantNameLower.includes('oberżyn')) {
    return {
      isNeeded: true,
      needBadgeText: 'TAK – Niezbędna do uprawy',
      needBadgeTextEn: 'YES – Essential for cultivation',
      needDescription: 'Ciężkie owoce bakłażana wymagają stabilizacji pędu głównego palikiem bambusowym.',
      needDescriptionEn: 'Heavy eggplant fruits require central stem stabilization with a sturdy bamboo stake.',
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
      needBadgeTextEn: 'NO – Self-supporting plant',
      needDescription: 'Roślina charakteryzuje się niskim, zwartym lub kaskadowym pokrojem – nie wymaga żadnych rusztowań ani palików.',
      needDescriptionEn: 'This plant has a low, compact, or cascading habit and requires no stakes or scaffolding.',
    };
  }

  return {
    isNeeded: directFlag,
    needBadgeText: directFlag ? 'TAK – Niezbędna do uprawy' : 'NIE – Roślina samonośna',
    needBadgeTextEn: directFlag ? 'YES – Essential for cultivation' : 'NO – Self-supporting plant',
    needDescription: directFlag
      ? 'Roślina wymaga stabilizacji pędów pod ciężarem plonów.'
      : 'Roślina nie wymaga podpory.',
    needDescriptionEn: directFlag
      ? 'The plant requires stem stabilization under the weight of its harvest.'
      : 'The plant does not require structural support.',
  };
}

/**
 * Pełna ocena wybranej podpory:
 * 1. Czy podpora jest potrzebna
 * 2. Czy wybrana podpora to dobry, średni czy zły wybór
 */
export function evaluatePlantSupport(
  support: SupportType,
  plant?: Plant | null,
  varietyName?: string
): SupportEvaluation {
  if (!plant || !plant.name) {
    return {
      isSupportNeeded: false,
      needBadgeText: 'NIE – Roślina samonośna',
      needBadgeTextEn: 'NO – Self-supporting plant',
      needDescription: 'Roślina nie wymaga podpory.',
      needDescriptionEn: 'This plant does not require structural support.',
      rating: 'good',
      badgeText: 'Dobry wybór',
      badgeTextEn: 'Good choice',
      title: 'Podpora opcjonalna',
      titleEn: 'Support is optional',
      description: 'Dla tej uprawy podpora nie jest wymagana.',
      descriptionEn: 'No support is strictly required for this crop.',
      practicalTip: 'Dopasuj wysokość pojemnika do siły wzrostu rośliny.',
      practicalTipEn: 'Match container depth to plant growth vigor.',
    };
  }
  const needInfo = isSupportNeededForPlant(plant, varietyName);
  const plantNameLower = plant.name.toLowerCase();
  const isClimber =
    plantNameLower.includes('fasol') ||
    plantNameLower.includes('groszek') ||
    plantNameLower.includes('ogórek') ||
    plantNameLower.includes('arbuz') ||
    plantNameLower.includes('melon');
  const isTomatoOrPepper =
    plantNameLower.includes('pomidor') ||
    plantNameLower.includes('papryk') ||
    plantNameLower.includes('bakłażan');

  // PRZYPADEK A: Podpora NIE jest potrzebna roślinie
  if (!needInfo.isNeeded) {
    if (support === 'none') {
      return {
        isSupportNeeded: false,
        needBadgeText: needInfo.needBadgeText,
        needBadgeTextEn: needInfo.needBadgeTextEn,
        needDescription: needInfo.needDescription,
        needDescriptionEn: needInfo.needDescriptionEn,
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Brak podpory jest w 100% optymalny',
        titleEn: 'No support is 100% optimal',
        description: 'Roślina ma zwarty, samonośny lub płożący pokrój – nie potrzebuje rusztowań ani palików.',
        descriptionEn: 'The plant grows in a compact, self-supporting, or trailing habit — no poles or cages are needed.',
        practicalTip: 'Zaoszczędzona przestrzeń w donicy pozwala korzeniom na swobodny i równomierny rozrost.',
        practicalTipEn: 'Saved container volume gives roots plenty of room to spread freely and evenly.',
      };
    }

    return {
      isSupportNeeded: false,
      needBadgeText: needInfo.needBadgeText,
      needBadgeTextEn: needInfo.needBadgeTextEn,
      needDescription: needInfo.needDescription,
      needDescriptionEn: needInfo.needDescriptionEn,
      rating: 'warning',
      badgeText: 'Średni / z zastrzeżeniami',
      badgeTextEn: 'Average / with cautions',
      title: 'Podpora jest zbędna dla tej rośliny',
      titleEn: 'Support is unnecessary for this plant',
      description: 'Zainstalowanie podpory nie zaszkodzi roślinie, ale jest zbędne i może niepotrzebnie uszkodzić korzenie przy wbijaniu w ziemię.',
      descriptionEn: 'Adding a support won’t harm the plant, but it is unnecessary and driving stakes into soil may pierce roots.',
      practicalTip: 'Dla tej odmiany możesz śmiało zmienić wybór na „Brak podpory”.',
      practicalTipEn: 'For this variety you can safely select "No support needed".',
    };
  }

  // PRZYPADEK B: Podpora JEST potrzebna roślinie
  if (support === 'none') {
    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needBadgeTextEn: needInfo.needBadgeTextEn,
      needDescription: needInfo.needDescription,
      needDescriptionEn: needInfo.needDescriptionEn,
      rating: 'bad',
      badgeText: 'Zły wybór',
      badgeTextEn: 'Poor choice',
      title: 'Zły wybór: Roślina wymaga stabilizacji',
      titleEn: 'Poor choice: Plant requires structural support',
      description: 'Pozostawienie tej rośliny bez podpory grozi wyłamaniem pędów pod ciężarem owoców oraz połamaniem przez silniejsze podmuchy wiatru.',
      descriptionEn: 'Leaving this plant without support will likely cause stems to snap under heavy fruit weight or strong balcony wind gusts.',
      practicalTip: 'Wybierz palik bambusowy, kratkę ścienną lub klatkę ogrodniczą, aby zabezpieczyć plon.',
      practicalTipEn: 'Choose a bamboo stake, wall trellis, or plant cage to protect your crop.',
    };
  }

  if (support === 'stake') {
    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needBadgeTextEn: needInfo.needBadgeTextEn,
        needDescription: needInfo.needDescription,
        needDescriptionEn: needInfo.needDescriptionEn,
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Palik wystarczy tylko na początku',
        titleEn: 'Stake will only suffice in early stage',
        description: 'Pojedynczy palik utrzyma roślinę w fazie początkowej, ale silnie rosnące pnącze szybko go przerośnie. Lepszym wyborem będzie kratka lub siatka.',
        descriptionEn: 'A single stake supports early growth, but vigorous climbers will quickly outgrow it. A trellis or mesh is recommended.',
        practicalTip: 'Jeśli używasz palika, regularnie owijaj pędy spiralnie ku górze.',
        practicalTipEn: 'If using a stake, guide and wind shoots spiraling upwards regularly.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needBadgeTextEn: needInfo.needBadgeTextEn,
      needDescription: needInfo.needDescription,
      needDescriptionEn: needInfo.needDescriptionEn,
      rating: 'good',
      badgeText: 'Dobry wybór',
      badgeTextEn: 'Good choice',
      title: 'Bardzo dobry wybór: Solidna stabilizacja pędu',
      titleEn: 'Very good choice: Solid stem stabilization',
      description: 'Palik bambusowy (60–80 cm) wbity do dna donicy doskonale stabilizuje pęd główny i chroni grona owocowe przed złamaniem.',
      descriptionEn: 'A 60–80 cm bamboo stake inserted to the bottom of the pot firmly secures the central stem and prevents fruit clusters from snapping.',
      practicalTip: 'Wbij palik już przy sadzeniu rozsady, by nie uszkodzić korzeni. Pędy podwiązuj elastycznym sznurkiem w ósemkę.',
      practicalTipEn: 'Insert the stake at transplanting time to protect roots. Tie stems loosely with garden twine in a figure-eight.',
    };
  }

  if (support === 'trellis') {
    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needBadgeTextEn: needInfo.needBadgeTextEn,
        needDescription: needInfo.needDescription,
        needDescriptionEn: needInfo.needDescriptionEn,
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Idealny wybór dla roślin pnących',
        titleEn: 'Ideal choice for climbing plants',
        description: 'Kratka pozwala wąsom czepnym i pędom równomiernie rozrosnąć się po całej płaszczyźnie, zapewniając liściom i owocom maksymalny dostęp do słońca.',
        descriptionEn: 'A trellis allows climbing tendrils and vines to spread evenly across the plane, maximizing sun exposure for foliage and fruit.',
        practicalTip: 'Przymocuj kratkę do ściany lub stabilnie do tylnej krawędzi skrzynki balkonowej.',
        practicalTipEn: 'Anchor the trellis securely to the balcony wall or back rim of your planter box.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needBadgeTextEn: needInfo.needBadgeTextEn,
      needDescription: needInfo.needDescription,
      needDescriptionEn: needInfo.needDescriptionEn,
      rating: 'good',
      badgeText: 'Dobry wybór',
      badgeTextEn: 'Good choice',
      title: 'Bardzo dobra stabilizacja i wentylacja pędów',
      titleEn: 'Very good stem stabilization and air circulation',
      description: 'Kratka umożliwia wygodne rozpinanie bocznych pędów i zapewnia świetną cyrkulację powietrza zapobiegającą chorobom grzybowym.',
      descriptionEn: 'A trellis allows easy fan-training of side branches and provides superior air circulation to deter fungal diseases.',
      practicalTip: 'Podwiązuj pędy luźnymi klipsami ogrodniczymi.',
      practicalTipEn: 'Fasten shoots using loose plant clips or soft ties.',
    };
  }

  if (support === 'balcony_railing') {
    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needBadgeTextEn: needInfo.needBadgeTextEn,
        needDescription: needInfo.needDescription,
        needDescriptionEn: needInfo.needDescriptionEn,
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Świetne wykorzystanie naturalnej konstrukcji balkonu',
        titleEn: 'Smart use of existing balcony railing',
        description: 'Prowadzenie pędów ku poręczy balkonu pozwala zaoszczędzić cenną przestrzeń na podłodze i równomiernie doświetlić owoce.',
        descriptionEn: 'Guiding vines toward the balcony railing saves precious floor space and bathes the crop in full sunlight.',
        practicalTip: 'Rozepnij sznurki jutowe od podstawy donicy do szczebli balustrady.',
        practicalTipEn: 'Run jute twine cords from the pot rim to railing balusters.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needBadgeTextEn: needInfo.needBadgeTextEn,
      needDescription: needInfo.needDescription,
      needDescriptionEn: needInfo.needDescriptionEn,
      rating: 'warning',
      badgeText: 'Średni / z zastrzeżeniami',
      badgeTextEn: 'Average / with cautions',
      title: 'Wymaga starannego prowadzenia pędów',
      titleEn: 'Requires careful shoot training',
      description: 'Balustrada może być zbyt oddalona od środka donicy. Uważaj, aby delikatne pędy nie ocierały się o nagrzany metal poręczy.',
      descriptionEn: 'The railing may sit too far from the center of the pot. Ensure tender shoots do not rub against hot metal railing bars.',
      practicalTip: 'Użyj miękkiego sznurka jako łącznika i zabezpiecz łodygi przed wiatrem.',
      practicalTipEn: 'Use soft twine as bridge connectors and secure stems against strong wind friction.',
    };
  }

  if (support === 'cage') {
    if (isTomatoOrPepper) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needBadgeTextEn: needInfo.needBadgeTextEn,
        needDescription: needInfo.needDescription,
        needDescriptionEn: needInfo.needDescriptionEn,
        rating: 'good',
        badgeText: 'Dobry wybór',
        badgeTextEn: 'Good choice',
        title: 'Przestrzenna ochrona 360°',
        titleEn: '360° all-around branch support',
        description: 'Trójwymiarowy pierścień klatki podtrzymuje wszystkie boczne gałązki z owocami bez konieczności ciągłego podwiązywania każdego pędu.',
        descriptionEn: 'The 3D cage rings support all fruiting lateral branches without having to individually tie each stem.',
        practicalTip: 'Załóż klatkę nad rośliną już na etapie sadzenia rozsady do donicy.',
        practicalTipEn: 'Fit the plant cage over the seedling right at transplanting time.',
      };
    }

    if (isClimber) {
      return {
        isSupportNeeded: true,
        needBadgeText: needInfo.needBadgeText,
        needBadgeTextEn: needInfo.needBadgeTextEn,
        needDescription: needInfo.needDescription,
        needDescriptionEn: needInfo.needDescriptionEn,
        rating: 'warning',
        badgeText: 'Średni / z zastrzeżeniami',
        badgeTextEn: 'Average / with cautions',
        title: 'Klatka może okazać się za niska',
        titleEn: 'Cage might be too short for tall vines',
        description: 'Dla silnie rosnących pnączy klatka może być za niska – pędy po dotarciu na szczyt zaczną opadać i plątać się.',
        descriptionEn: 'For vigorous climbing vines, a standard cage can be too low — shoots reaching the top will flop over and tangle.',
        practicalTip: 'Dla wysokich pnączy lepsza będzie wysoka kratka ścienna.',
        practicalTipEn: 'For tall climbers, a high wall trellis or vertical netting is preferable.',
      };
    }

    return {
      isSupportNeeded: true,
      needBadgeText: needInfo.needBadgeText,
      needBadgeTextEn: needInfo.needBadgeTextEn,
      needDescription: needInfo.needDescription,
      needDescriptionEn: needInfo.needDescriptionEn,
      rating: 'good',
      badgeText: 'Dobry wybór',
      badgeTextEn: 'Good choice',
      title: 'Dobra ochrona przed wyłamywaniem pędów',
      titleEn: 'Good defense against stem breakage',
      description: 'Klatka ogrodnicza stanowi solidne oparcie w wietrzne dni.',
      descriptionEn: 'A garden cage provides solid structural reinforcement on gusty days.',
      practicalTip: 'Upewnij się, że nóżki klatki są stabilnie zagłębione w podłożu.',
      practicalTipEn: 'Ensure cage legs are firmly pushed down to the bottom of the container.',
    };
  }

  return {
    isSupportNeeded: true,
    needBadgeText: 'TAK – Niezbędna do uprawy',
    needBadgeTextEn: 'YES – Essential for cultivation',
    needDescription: 'Roślina wymaga stabilizacji.',
    needDescriptionEn: 'The plant requires structural stabilization.',
    rating: 'good',
    badgeText: 'Dobry wybór',
    badgeTextEn: 'Good choice',
    title: 'Podpora spełnia swoją funkcję',
    titleEn: 'Support serves its purpose well',
    description: 'Wybrana podpora zabezpiecza pędy rośliny.',
    descriptionEn: 'The selected support reliably protects plant shoots.',
    practicalTip: 'Podwiązuj pędy w miarę wzrostu rośliny.',
    practicalTipEn: 'Tie shoots progressively as the plant grows.',
  };
}
