import { Plant, PlantVariety } from '../types';

export const VARIETY_CATALOG: Record<string, PlantVariety[]> = {
  'pomidor-karlowy': [
    {
      name: 'Vilma',
      badge: 'Super karłowa (do 30 cm)',
      reason: 'Sztywnołodygowa roślina nie wymaga podpór ani ogławiania; idealna do małych donic 5–7L.',
      habit: 'Karłowy sztywnołodygowy (wys. 25–30 cm), bez konieczności palikowania',
      min_pot_vol_l: 6,
      recommended_spacing_cm: 20,
      requires_support: false,
      watering_profile: 'Umiarkowane – mała masa liściowa wolniej transpiruje wodę, unikaj zalewania korzeni.',
      soil_ph: '6.0 – 6.8',
      soil_notes: 'Podłoże uniwersalne do warzyw + 20% perlitu dla napowietrzenia; na dno 3 cm keramzytu.',
      sowing_notes: 'Wysiew w marcu na parapecie (22°C), sadzenie na balkon po 15 maja.',
    },
    {
      name: 'Maskotka',
      badge: 'Bardzo wczesna i plenna',
      reason: 'Lekko przewieszający się pokrój, słodkie i soczyste owoce o cienkiej skórce, owocuje do przymrozków.',
      habit: 'Wiotkołodygowy, lekko płożący/krzaczasty (wys. 40–50 cm), wskazany lekki palik bambusowy',
      min_pot_vol_l: 10,
      recommended_spacing_cm: 30,
      requires_support: true,
      watering_profile: 'Regularne i obfite – w fazie dojrzewania gron podlewaj codziennie rano lub wieczorem.',
      soil_ph: '6.0 – 6.8',
      soil_notes: 'Bogata w próchnicę ziemia z biohumusem; zwiększone zapotrzebowanie na potas i wapń.',
      sowing_notes: 'Wysiew połowa marca, pikowanie przy 2 liściach właściwych głęboko aż po liścienie.',
    },
    {
      name: 'Bajaja',
      badge: 'Do 700 owoców z krzaka',
      reason: 'Ekstremalnie plenna odmiana o kaskadowych kiściach drobnych, cukierkowych pomidorków.',
      habit: 'Kompaktowy, silnie krzewiący się (wys. 35–45 cm) z dziesiątkami owoconośnych pędów',
      min_pot_vol_l: 10,
      recommended_spacing_cm: 25,
      requires_support: true,
      watering_profile: 'Bardzo wysokie w upale – setki zawiązanych pomidorków wymagają stałego dostępu wilgoci.',
      soil_ph: '6.2 – 6.8',
      soil_notes: 'Mieszanka kompostowa z mączką bazaltową i nawozem potasowym o przedłużonym działaniu.',
      sowing_notes: 'Wysiew w marcu, regularne nawożenie biohumusem po zawiązaniu pierwszych owoców.',
    },
    {
      name: 'Tumbling Tom Red',
      badge: 'Kaskadowa do koszy i amplii',
      reason: 'Stworzona specjalnie do wiszących donic i skrzynek; pędy malowniczo przewieszają się w dół.',
      habit: 'Zwisający / kaskadowy (pędy opadają 40–60 cm w dół), nie wymaga palika',
      min_pot_vol_l: 8,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Częste, wiszące donice silniej nagrzewają się od wiatru – sprawdzaj wilgotność 2x dziennie.',
      soil_ph: '6.0 – 6.8',
      soil_notes: 'Lekkie podłoże z hydrożelem lub perlitem (25%), aby ziemia w wiszącym koszu nie wysychała błyskawicznie.',
      sowing_notes: 'Wysadzenie do wiszącej donicy po 15 maja, sadź pojedynczo lub 2 sztuki w donicy 12L.',
    },
    {
      name: 'Koralik',
      badge: 'Odporna na chłód i zarazę',
      reason: 'Tradycyjna, niezniszczalna polska odmiana o wysokiej tolerancji na błędy uprawowe i chłodne noce.',
      habit: 'Silnie rosnący krzew (wys. 60–80 cm), wymaga solidnego palika bambusowego',
      min_pot_vol_l: 15,
      recommended_spacing_cm: 35,
      requires_support: true,
      watering_profile: 'Umiarkowane do obfitego – odporna na chwilowe przesuszenie, nie polewaj liści.',
      soil_ph: '6.0 – 7.0',
      soil_notes: 'Standardowa ziemia ogrodowa z drenażem keramzytowym 4 cm.',
      sowing_notes: 'Szybki wigor wzrostu – nasiona kiełkują po 5–7 dniach.',
    },
  ],

  'papryka-chili': [
    {
      name: 'Cayenne (Chili Cayen)',
      badge: 'Klasyczna ostra (30k-50k SHU)',
      reason: 'Długie, czerwone strąki, zwarty pokrój, roślina łatwa w przezimowaniu na parapecie domowym.',
      habit: 'Wzniesiony, zwarty krzaczek (wys. 40–50 cm)',
      min_pot_vol_l: 5,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Umiarkowane – papryka woli lekkie przesuszenie niż zalanie korzeni.',
      soil_ph: '6.0 – 6.8',
      soil_notes: 'Ciepłe, przepuszczalne podłoże próchnicze, 20% perlitu, bez nadmiaru azotu.',
      sowing_notes: 'Wczesny wysiew (luty–marzec) w cieple 24–26°C. Uszczknij pąk królewski na rozwidleniu.',
    },
    {
      name: 'Jalapeño',
      badge: 'Grube, soczyste strąki (5k-10k SHU)',
      reason: 'Grubościenne owoce idealne do faszerowania, marynowania i świeżej salsy.',
      habit: 'Krzaczasty, mocno ulistniony (wys. 50–60 cm)',
      min_pot_vol_l: 7,
      recommended_spacing_cm: 30,
      requires_support: true,
      watering_profile: 'Równomierne – wahania wilgotności powodują mikro-pękanie skórki (korkowacenie).',
      soil_ph: '6.2 – 6.8',
      soil_notes: 'Ziemia bogata w biohumus i potas dla budowy grubych ścianek owoców.',
      sowing_notes: 'Kiełkowanie po 10–14 dniach, do donicy po przymrozkach.',
    },
    {
      name: 'Habanero Red / Orange',
      badge: 'Ekstremalna ostrość (200k-350k SHU)',
      reason: 'Tropikalny owocowy aromat i potężna moc kapsaicyny w małej ozdobnej donicy.',
      habit: 'Kompaktowy krzew o parasolowatej koronie (wys. 40 cm)',
      min_pot_vol_l: 5,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Oszczędne – lekkie ograniczenie wody w fazie dojrzewania zwiększa pikantność!',
      soil_ph: '6.0 – 6.5',
      soil_notes: 'Bardzo ciepłe stanowisko, drenaż keramzytowy 3 cm, nie znosi chłodu.',
      sowing_notes: 'Bardzo długi okres wegetacji – wysiewaj koniecznie już w lutym.',
    },
    {
      name: 'Mini Bell (Słodka karłowa)',
      badge: 'Słodka bez pikantności',
      reason: 'Miniaturowe słodkie papryczki w kolorze żółtym, czerwonym i pomarańczowym uwielbiane przez dzieci.',
      habit: 'Karłowy, gęsty krzaczek (wys. 30–35 cm)',
      min_pot_vol_l: 5,
      recommended_spacing_cm: 20,
      requires_support: false,
      watering_profile: 'Umiarkowane, stała lekka wilgotność podłoża.',
      soil_ph: '6.2 – 6.8',
      soil_notes: 'Ziemia warzywna z domieszką kompostu i perlitu.',
      sowing_notes: 'Wysiew marzec, idealna do skrzynek balkonowych obok bazylii.',
    },
  ],

  'truskawka-zwisajaca': [
    {
      name: 'Toscana',
      badge: 'Różowe kwiaty + owoce',
      reason: 'Zdobywca nagród: zachwyca ciemnoróżowymi kwiatami i słodkimi owocami przez 5 miesięcy z rzędu.',
      habit: 'Kaskadowy, wytwarza długie zwisające rozłogi z kwiatami i owocami',
      min_pot_vol_l: 4,
      recommended_spacing_cm: 20,
      requires_support: false,
      watering_profile: 'Regularne, płytki system korzeniowy źle znosi przesuszenie wierzchniej warstwy.',
      soil_ph: '5.5 – 6.5 (lekko kwaśne)',
      soil_notes: 'Ziemia do truskawek z dodatkiem torfu kwaśnego i perlitu, warstwa keramzytu na dnie.',
      sowing_notes: 'Sadzonki frigo lub w doniczkach sadź w kwietniu/maju. Usuwaj stare zeschnięte liście.',
    },
    {
      name: 'Temptation',
      badge: 'Powtarzająca z nasion',
      reason: 'Odmiana bezrozłogowa lub o krótkich pędach, owocuje nieprzerwanie od czerwca do października.',
      habit: 'Zwarty krzaczek o zwartych gronach owocowych (wys. 25 cm)',
      min_pot_vol_l: 3.5,
      recommended_spacing_cm: 18,
      requires_support: false,
      watering_profile: 'Umiarkowane – unikaj zalewania stożka wzrostu ("serduszka" rośliny).',
      soil_ph: '5.8 – 6.5',
      soil_notes: 'Przepuszczalne podłoże próchniczne, ściółkowanie słomką lub korą.',
      sowing_notes: 'Możliwy wysiew z nasion w lutym/marcu lub sadzenie gotowych rozsad w maju.',
    },
    {
      name: 'Albion',
      badge: 'Duże deserowe owoce',
      reason: 'Jedna z najsmaczniejszych odmian powtarzających, owoce twarde, błyszczące i bardzo słodkie.',
      habit: 'Wzniesiony, silny krzaczek (wys. 30 cm)',
      min_pot_vol_l: 5,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Stała wilgotność, podlewaj pod krzaczek, by owoce nie pleśniały od wilgoci.',
      soil_ph: '5.5 – 6.2',
      soil_notes: 'Ziemia wzbogacona nawozem organicznym z potasem i żelazem.',
      sowing_notes: 'Sadzenie sadzonek w kwietniu/maju, zbiór aż do pierwszych przymrozków jesiennych.',
    },
  ],

  'bazylia-pospolita': [
    {
      name: 'Genovese',
      badge: 'Klasyczna włoska do pesto',
      reason: 'Duże, mięsiste, łyżeczkowate liście o głębokim korzennym zapachu; idealna do sosów i caprese.',
      habit: 'Szybkorosnąca rozeta (wys. 40–50 cm), wymaga regularnego uszczykiwania wierzchołków',
      min_pot_vol_l: 3,
      recommended_spacing_cm: 15,
      requires_support: false,
      watering_profile: 'Częste – nie znosi przesuszenia, podlewaj zawsze od dołu lub na podstawkę.',
      soil_ph: '6.0 – 7.0',
      soil_notes: 'Lekkie, żyzne podłoże ziołowe z domieszką kompostu i perlitu.',
      sowing_notes: 'Wysiew nasion powierzchniowy (nasiona potrzebują światła do kiełkowania).',
    },
    {
      name: 'Grecka karłowa (Piccolino)',
      badge: 'Kula drobnych listków',
      reason: 'Tworzy zwartą, gęstą kulę miniaturowych listków o intensywnym aromacie; odporniejsza na chłody.',
      habit: 'Karłowa, kulista, gęsta kopuła (wys. 20–25 cm), bardzo ozdobna',
      min_pot_vol_l: 2,
      recommended_spacing_cm: 10,
      requires_support: false,
      watering_profile: 'Umiarkowane – zwarty pokrój dłużej utrzymuje wilgoć wewnątrz bryły.',
      soil_ph: '6.2 – 7.0',
      soil_notes: 'Standardowa ziemia ziołowa z drenażem keramzytowym.',
      sowing_notes: 'Świetna do małych doniczek na balustradzie i skrzynek wieloodmianowych.',
    },
    {
      name: 'Cynamonowa / Cytrynowa',
      badge: 'Unikalny cytrusowo-korzenny aromat',
      reason: 'Niezastąpiona do herbat, lemoniad i deserów owocowych; piękne fioletowe pąki kwiatowe.',
      habit: 'Smukła, wzniesiona (wys. 35 cm)',
      min_pot_vol_l: 2.5,
      recommended_spacing_cm: 15,
      requires_support: false,
      watering_profile: 'Umiarkowane, lubi ciepło i osłonięte, słoneczne stanowisko.',
      soil_ph: '6.5 – 7.0',
      soil_notes: 'Lekka, przepuszczalna ziemia z dodatkiem piasku płukanego.',
      sowing_notes: 'Wysiew w kwietniu/maju na słonecznym parapecie.',
    },
    {
      name: 'Purpurowa (Dark Opal)',
      badge: 'Głęboki fioletowy kolor',
      reason: 'Niezwykle dekoracyjne ciemnofioletowe liście, piękny kontrast w sałatkach i donicach kompozycyjnych.',
      habit: 'Wzniesiony, zwarty (wys. 35–45 cm)',
      min_pot_vol_l: 3,
      recommended_spacing_cm: 15,
      requires_support: false,
      watering_profile: 'Umiarkowane – wymaga pełnego słońca dla intensywnego wybarwienia fioletu.',
      soil_ph: '6.0 – 6.8',
      soil_notes: 'Żyzna ziemia ogrodnicza z mikroelementami.',
      sowing_notes: 'Siać powierzchniowo, nie przykrywać ziemią.',
    },
  ],

  'ogorek-konserwowy': [
    {
      name: 'Dar (Karłowy krzaczasty)',
      badge: 'Genetycznie karłowy do donic',
      reason: 'Nie tworzy długich pędów, rośnie w formie zwartego krzaczka i obficie owocuje w pojemnikach 10L.',
      habit: 'Krzaczasty, krótkopędowy (pędy do 50 cm), nie wymaga wysokich podpór',
      min_pot_vol_l: 10,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Bardzo wysokie – ogórek składa się w 96% z wody, podlewaj codziennie letnią wodą!',
      soil_ph: '6.5 – 7.0 (obojętne)',
      soil_notes: 'Ciepłe, bardzo żyzne podłoże kompostowe z biohumusem i perlitem.',
      sowing_notes: 'Siew do doniczek w kwietniu, sadzenie na balkon po 15 maja.',
    },
    {
      name: 'Spacemaster',
      badge: 'Kompaktowy pnący do kratki',
      reason: 'Krótkie międzywęźla, doskonały do prowadzenia po siatce lub balustradzie balkonu.',
      habit: 'Pnący zwarty (pędy 80–100 cm), wymaga kratki lub sznurków',
      min_pot_vol_l: 12,
      recommended_spacing_cm: 30,
      requires_support: true,
      watering_profile: 'Obfite, nigdy nie podlewaj zimną wodą prosto z kranu (grozi szokiem termicznym).',
      soil_ph: '6.5 – 7.2',
      soil_notes: 'Żyzna ziemia warzywna z drenażem 4 cm keramzytu.',
      sowing_notes: 'Prowadź pionowo po szczebelkach barierki, oszczędzając miejsce na podłodze.',
    },
  ],

  'cukinia-patio': [
    {
      name: 'Atena Polka / Black Beauty',
      badge: 'Krzaczasta złota / zielona',
      reason: 'Krzaczasty pokrój bez rozłogów, plonuje obficie całymi tygodniami, jadalne również kwiaty.',
      habit: 'Krzaczasty zwarty, duże parasolowate liście (szer. 60 cm)',
      min_pot_vol_l: 15,
      recommended_spacing_cm: 40,
      requires_support: false,
      watering_profile: 'Bardzo obfite – potężne liście odparowują dużo wody w upalne dni.',
      soil_ph: '6.2 – 7.0',
      soil_notes: 'Bardzo żarłoczna roślina: 50% kompost, 30% ziemia uniwersalna, 20% obornik granulowany/biohumus.',
      sowing_notes: 'Siew nasion po 1 sztuce w kwietniu na rozsadę lub wprost do donicy w maju.',
    },
  ],

  'mieta-pieprzowa': [
    {
      name: 'Pieprzowa (Mitcham)',
      badge: 'Mocny mentolowy aromat',
      reason: 'Tradycyjna, orzeźwiająca mięta o wysokiej zawartości olejków eterycznych do naparów i chłodników.',
      habit: 'Płożąca / ekspansywna rozłogowa – uprawa w donicy chroni inne rośliny przed zarośnięciem',
      min_pot_vol_l: 4,
      recommended_spacing_cm: 20,
      requires_support: false,
      watering_profile: 'Częste – uwielbia wilgotne podłoże i stanowiska półcieniste.',
      soil_ph: '6.5 – 7.5',
      soil_notes: 'Wilgotna, próchniczna ziemia, lekko zasadowa.',
      sowing_notes: 'Sadzonki rozłogowe ukorzeniają się błyskawicznie w wodzie.',
    },
    {
      name: 'Marokańska (Nana)',
      badge: 'Do herbaty i drinków Mojito',
      reason: 'Słodszy aromat bez goryczki, pomarszczone liście, idealna do letnich napojów.',
      habit: 'Zwarty krzaczek (wys. 35 cm)',
      min_pot_vol_l: 3,
      recommended_spacing_cm: 18,
      requires_support: false,
      watering_profile: 'Regularne, umiarkowane do wilgotnego.',
      soil_ph: '6.5 – 7.2',
      soil_notes: 'Uniwersalna ziemia ogrodowa z drenażem.',
      sowing_notes: 'Znakomicie zimuje w donicy zabezpieczonej styropianem.',
    },
    {
      name: 'Czekoladowa',
      badge: 'Nutka kakao i mięty',
      reason: 'Ciemniejsze fioletowo-brązowe łodygi i unikalny aromat miętowo-czekoladowy do deserów.',
      habit: 'Wzniesiony, płożący (wys. 30 cm)',
      min_pot_vol_l: 3,
      recommended_spacing_cm: 18,
      requires_support: false,
      watering_profile: 'Umiarkowane, toleruje słońce i lekki półcień.',
      soil_ph: '6.5 – 7.0',
      soil_notes: 'Przepuszczalne podłoże próchniczne.',
      sowing_notes: 'Idealna do osobnej donicy kompozycyjnej.',
    },
  ],

  'rozmaryn-lekarski': [
    {
      name: 'Prostratus (Płożący)',
      badge: 'Kaskadowy na krawędź donicy',
      reason: 'Malowniczo przewiesza pędy przez brzeg donicy lub barierki balkonowej; piękny i aromatyczny.',
      habit: 'Płożący / zwisający (pędy opadają 30–50 cm)',
      min_pot_vol_l: 4,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Bardzo oszczędne – roślina śródziemnomorska, sucholubna, nie znosi zastoju wody.',
      soil_ph: '6.8 – 7.8 (wapienne)',
      soil_notes: 'Ubogie, piaszczyste podłoże z 30% piasku/żwiru i drenażem keramzytowym min. 4 cm.',
      sowing_notes: 'Sadzonki pędowe w maju, zimowanie w chłodnym jasnym pomieszczeniu (5–10°C).',
    },
    {
      name: 'Tuscan Blue (Wzniesiony)',
      badge: 'Krzaczasty, ciemnoniebieskie kwiaty',
      reason: 'Mocny, drzewkowaty krzew o igiełkowatych liściach bogatych w olejki żywiczne do pieczeni i dań z grilla.',
      habit: 'Wzniesiony krzew (wys. 50–70 cm)',
      min_pot_vol_l: 5,
      recommended_spacing_cm: 30,
      requires_support: false,
      watering_profile: 'Oszczędne – podlewaj dopiero gdy podłoże przeschnie na głębokość 4 cm.',
      soil_ph: '7.0 – 7.8',
      soil_notes: 'Ziemia do ziół śródziemnomorskich lub ziemia uniwersalna wymieszana z dolomitem i piaskiem.',
      sowing_notes: 'Najlepiej z sadzonek, przycinaj pędy po kwitnieniu.',
    },
  ],

  'rzodkiewka': [
    {
      name: 'Carmen',
      badge: 'Okrągła, nieparciejąca',
      reason: 'Szybki zbiór po 25–28 dniach; miąższ soczysty, nie tworzy pustych przestrzeni w donicach.',
      habit: 'Niska rozeta liściowa (wys. 12 cm), zgrubienie kuliste pod ziemią',
      min_pot_vol_l: 2,
      recommended_spacing_cm: 4,
      requires_support: false,
      watering_profile: 'Częste i równomierne – wahania wilgoci powodują pieczenie w smaku i pękanie zgrubień.',
      soil_ph: '6.0 – 7.0',
      soil_notes: 'Lekka, spulchniona ziemia bez grudek; drenaż 2 cm.',
      sowing_notes: 'Siew rzędowy co 3–5 cm na głębokość 1 cm od marca do maja oraz we wrześniu.',
    },
    {
      name: 'Jutrzenka',
      badge: 'Podłużna różowa z białym końcem',
      reason: 'Łagodna w smaku, chrupiąca, doskonała do płytkich skrzynek balkonowych o głębokości 12–15 cm.',
      habit: 'Niewielka rozeta, zgrubienie walcowate',
      min_pot_vol_l: 2,
      recommended_spacing_cm: 5,
      requires_support: false,
      watering_profile: 'Stała umiarkowana wilgotność.',
      soil_ph: '6.2 – 6.8',
      soil_notes: 'Ziemia uniwersalna z perlitem.',
      sowing_notes: 'Wysiew wczesną wiosną, nie znosi upałów powyżej 24°C (wybija w kwiat).',
    },
  ],

  'szpinak-balkonowy': [
    {
      name: 'Matador',
      badge: 'Grube, ciemnozielone liście',
      reason: 'Odporny na chłód i przymrozki, doskonały na zbiór wczesnowiosenny oraz jesienny.',
      habit: 'Rozłożysta rozeta (wys. 15–20 cm)',
      min_pot_vol_l: 2.5,
      recommended_spacing_cm: 8,
      requires_support: false,
      watering_profile: 'Umiarkowane do wilgotnego – susza przyspiesza wybijanie w pędy kwiatostanowe.',
      soil_ph: '6.5 – 7.0',
      soil_notes: 'Żyzna, próchniczna ziemia trzymająca wilgoć.',
      sowing_notes: 'Siew marzec–kwiecień oraz sierpień–wrzesień na zbiór jesienny.',
    },
  ],

  'lawenda-waskolistna': [
    {
      name: 'Hidcote Blue',
      badge: 'Ciemnofioletowa karłowa',
      reason: 'Kompaktowy, zwarty krzaczek (do 35 cm) o najbardziej intensywnym fioletowym kolorze kwiatów i silnym zapachu.',
      habit: 'Zwarta półkula (wys. 30–35 cm)',
      min_pot_vol_l: 4,
      recommended_spacing_cm: 25,
      requires_support: false,
      watering_profile: 'Bardzo oszczędne – roślina sucholubna, nadmiar wody powoduje gnicie korzeni.',
      soil_ph: '7.0 – 8.0 (zasadowe)',
      soil_notes: 'Piaszczyste, wapienne podłoże z dolomitem i drenażem min. 4 cm keramzytu.',
      sowing_notes: 'Wymaga pełnego słońca (min. 6h). Wiosną przycinaj przekwitłe pędy w kulę.',
    },
    {
      name: 'Munstead',
      badge: 'Wczesna jasnofioletowa',
      reason: 'Zakwita najwcześniej ze wszystkich odmian, bardzo odporna na mróz i silny wiatr.',
      habit: 'Gęsty krzew (wys. 40 cm)',
      min_pot_vol_l: 5,
      recommended_spacing_cm: 30,
      requires_support: false,
      watering_profile: 'Oszczędne, podlewaj tylko gdy wierzchnie 3 cm podłoża jest suche.',
      soil_ph: '7.0 – 7.8',
      soil_notes: 'Ziemia do lawendy / ziół z dodatkiem żwirku i perlitu.',
      sowing_notes: 'Świetna do donic terakotowych na południowe balkony.',
    },
  ],
};

/**
 * Safely extracts variety string name whether raw entry is a string or an object { name, features }.
 */
export function getRawVarietyName(raw: unknown): string {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object' && 'name' in raw && typeof (raw as any).name === 'string') {
    return (raw as any).name;
  }
  return 'Odmiana standardowa';
}

/**
 * Returns all available varieties for a given plant, enriched with botanical traits.
 */
export function getPlantVarieties(plant: Plant): PlantVariety[] {
  const catalogList = VARIETY_CATALOG[plant.id];
  if (catalogList && catalogList.length > 0) {
    return catalogList;
  }

  // Fallback to plant.top_varieties or plant.varieties
  if (plant.top_varieties && plant.top_varieties.length > 0) {
    return plant.top_varieties.map((v) => ({
      ...v,
      name: getRawVarietyName(v.name),
      habit: v.habit || 'Zwarty pokrój pojemnikowy',
      min_pot_vol_l: v.min_pot_vol_l || plant.pot.min_volume_l,
      recommended_spacing_cm: v.recommended_spacing_cm || plant.spacing_guide?.spacing_cm || 20,
      requires_support: v.requires_support ?? (plant.spacing_guide?.requires_bamboo_stake || false),
      watering_profile: v.watering_profile || 'Standardowe umiarkowane podlewanie po sprawdzeniu wilgotności podłoża.',
      soil_ph: v.soil_ph || plant.soil.ph,
      soil_notes: v.soil_notes || plant.soil.type,
      sowing_notes: v.sowing_notes || plant.spacing_guide?.sowing_type_details || '',
    }));
  }

  if (plant.varieties && plant.varieties.length > 0) {
    return plant.varieties.map((item) => {
      const name = getRawVarietyName(item);
      const featureDesc =
        typeof item === 'object' && item !== null && 'features' in item && typeof (item as any).features === 'string'
          ? (item as any).features
          : 'Polecana do uprawy w pojemnikach i skrzynkach balkonowych.';

      return {
        name,
        badge: 'Odmiana donicowa',
        reason: featureDesc,
        habit: 'Zwarty pokrój',
        min_pot_vol_l: plant.pot.min_volume_l,
        recommended_spacing_cm: plant.spacing_guide?.spacing_cm || 20,
        requires_support: plant.spacing_guide?.requires_bamboo_stake || false,
        watering_profile: 'Umiarkowane podlewanie pod korzeń.',
        soil_ph: plant.soil.ph,
        soil_notes: plant.soil.type,
        sowing_notes: '',
      };
    });
  }

  return [
    {
      name: 'Odmiana standardowa',
      badge: 'Uniwersalna',
      reason: 'Dostosowana do pojemników balkonowych.',
      habit: 'Kompaktowy',
      min_pot_vol_l: plant.pot.min_volume_l,
      recommended_spacing_cm: plant.spacing_guide?.spacing_cm || 20,
      requires_support: false,
      watering_profile: 'Umiarkowane podlewanie.',
      soil_ph: plant.soil.ph,
      soil_notes: plant.soil.type,
      sowing_notes: '',
    },
  ];
}

/**
 * Calculates effective pot, spacing, soil, and watering requirements taking the specific variety into account.
 */
export function getEffectivePlantRequirements(plant: Plant, varietyName?: string) {
  const varieties = getPlantVarieties(plant);
  const matchedVariety = varietyName
    ? varieties.find((v) => v.name.toLowerCase() === varietyName.toLowerCase()) || varieties[0]
    : varieties[0];

  const minVolumeL = matchedVariety?.min_pot_vol_l ?? plant.pot.min_volume_l;
  const recommendedVolumeL = Math.max(minVolumeL + 3, plant.pot.recommended_volume_l);
  const spacingCm = matchedVariety?.recommended_spacing_cm ?? plant.spacing_guide?.spacing_cm ?? 20;
  const requiresSupport = matchedVariety?.requires_support ?? (plant.spacing_guide?.requires_bamboo_stake || false);
  const habit = matchedVariety?.habit || 'Kompaktowy pokrój pojemnikowy';
  const wateringProfile = matchedVariety?.watering_profile || 'Umiarkowane – sprawdzaj wilgotność podłoża palcem na 2–3 cm.';
  const soilPh = matchedVariety?.soil_ph || plant.soil.ph;
  const soilNotes = matchedVariety?.soil_notes || plant.soil.type;
  const sowingNotes = matchedVariety?.sowing_notes || plant.spacing_guide?.sowing_type_details || '';

  return {
    variety: matchedVariety,
    minVolumeL,
    recommendedVolumeL,
    spacingCm,
    requiresSupport,
    habit,
    wateringProfile,
    soilPh,
    soilNotes,
    sowingNotes,
  };
}
