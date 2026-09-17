import {
  Plant,
  MyCropItem,
  PlantGrowthPhase,
  CropTimelineInfo,
  PotAssessment,
} from '../types';

/**
 * Botanical Growth Stage Templates for Balcony Plants
 * Detailed phenological data: days from sowing, what to expect, and care actions.
 */

// 1. Pomidory karłowe / koktajlowe (Cherry / Bush Tomatoes)
const TOMATO_PHASES: PlantGrowthPhase[] = [
  {
    id: 'kielkowanie',
    order: 1,
    name: 'Kiełkowanie i wschody',
    shortName: 'Kiełkowanie',
    icon: '🌱',
    dayStart: 0,
    dayEnd: 8,
    whatToExpect:
      'Z nasion wybijają pierwsze zielone liścienie (owalne, gładkie). Korzonek zarodkowy wrasta w głąb podłoża.',
    keyCareAction:
      'Utrzymuj wilgotność podłoża lekką mgiełką ze zraszacza. Zapewnij ciepło (22–25°C) i natychmiast maksymalne światło, by siewki nie wybiegały.',
    wateringTip: 'Zraszaj delikatnie 1–2x dziennie. Ziemia musi być wilgotna, ale nie błotnista.',
    fertilizingTip: 'Brak – siewka czerpie energię z bielma nasiona. Nawozy spaliłyby młode korzonki.',
    pruningOrSupportTip: 'Nie dotykaj łodyżek. Usuń foliową osłonkę, gdy 70% nasion wzejdzie.',
  },
  {
    id: 'liscie_wlasciwe',
    order: 2,
    name: 'Liście właściwe & pikowanie',
    shortName: 'Pierwsze liście',
    icon: '🌿',
    dayStart: 9,
    dayEnd: 25,
    whatToExpect:
      'Pojawiają się ząbkowane, charakterystycznie pachnące liście właściwe. Rozwija się system korzeniowy.',
    keyCareAction:
      'Gdy siewki mają 2 liście właściwe, przepikuj je do osobnych doniczek (0,5L), zagłębiając w ziemi aż po same liścienie – z łodygi wyrosną dodatkowe korzenie przybyszowe!',
    wateringTip: 'Podlewaj od dołu (na podstawkę) letnią wodą co 2–3 dni, gdy wierzch przeschnie.',
    fertilizingTip: 'Po 10 dniach od pikowania: delikatny biohumus w 1/4 dawki.',
    pruningOrSupportTip: 'Obracaj doniczki na parapecie co 2 dni, by rozsada rosła prosto w stronę słońca.',
  },
  {
    id: 'wzrost_krzewu',
    order: 3,
    name: 'Rozwój krzewu, podpory i hartowanie',
    shortName: 'Wzrost & Podpory',
    icon: '🪴',
    dayStart: 26,
    dayEnd: 55,
    whatToExpect:
      'Pęd główny grubieje, krzew buduje silną rozetę liściową i w pachwinach puszcza pędy boczne (wilki).',
    keyCareAction:
      'Przesadź do docelowej donicy balkonowej (min. 10–15L). Wbij palik bambusowy 100–120 cm zanim korzenie wypełnią donicę! Hartuj sadzonki na balkonie przez 7 dni przed zostawieniem na noc.',
    wateringTip: 'Podlewaj zawsze pod korzeń, unikając moczenia liści (ochrona przed zarazą ziemniaczaną).',
    fertilizingTip: 'Nawóz zrównoważony N-P-K (np. 5-5-5) co 10 dni – stymuluje rozbudowę łodygi.',
    pruningOrSupportTip: 'Usuwaj pędy boczne (wilki) w pachwinach liści, gdy osiągną 2–3 cm. Prowadź krzak na 1–2 pędy.',
  },
  {
    id: 'kwitnienie',
    order: 4,
    name: 'Kwitnienie & zapylanie gron',
    shortName: 'Kwitnienie',
    icon: '🌸',
    dayStart: 56,
    dayEnd: 75,
    whatToExpect:
      'Rozwijają się żółte gwiazdkowate kwiatki zebrane w grona. Płatki odchylają się do tyłu, odsłaniając pręciki.',
    keyCareAction:
      'Zmień nawóz na bogaty w potas i fosfor (stymuluje wiązanie owoców). W południe w słoneczny dzień lekko potrząsaj palikiem lub krzaczkiem, aby pyłek osypał się na słupek (pomidor jest samopylny!).',
    wateringTip: 'Bardzo regularne podlewanie! Wahania wilgotności w fazie kwitnienia powodują opadanie zawiązków.',
    fertilizingTip: 'Nawóz do pomidorów o wysokiej zawartości potasu (K) i wapnia (Ca) co 7 dni.',
    pruningOrSupportTip: 'Usuń najniższe liście dotykające podłoża – zapobiega to infekcjom grzybowym od ziemi.',
  },
  {
    id: 'dojrzewanie',
    order: 5,
    name: 'Wzrost i wybarwianie owoców',
    shortName: 'Dojrzewanie',
    icon: '🍅',
    dayStart: 76,
    dayEnd: 100,
    whatToExpect:
      'Zielone kuleczki szybko przyrastają na gronach. Następuje przełamanie barwy: od zielonej, przez pomarańczową, do intensywnej czerwieni.',
    keyCareAction:
      'Chroń owoce przed nagłym poparzeniem i pękaniem: podlewaj mniejszymi porcjami, ale częściej. Upewnij się, że ciężkie grona nie załamują pędów (zastosuj podwiązki).',
    wateringTip: 'Nigdy nie doprowadzaj do przesuszenia donicy, po którym następuje obfite zalanie – owoce natychmiast popękają!',
    fertilizingTip: 'Podawaj saletrę wapniową lub nawóz wapniowy – zapobiega suchej zgniliźnie wierzchołkowej.',
    pruningOrSupportTip: 'Pod koniec sierpnia uszczknij wierzchołek pędu głównego (ogłowienie), by roślina karmiła istniejące owoce.',
  },
  {
    id: 'zbior',
    order: 6,
    name: 'Zbiory i sukcesywny plon',
    shortName: 'Zbiory',
    icon: '🧺',
    dayStart: 101,
    dayEnd: 140,
    whatToExpect:
      'Owoce uzyskują pełny połysk, słodycz i aromat. Łatwo odrywają się od szypułki z charakterystycznym kolankiem.',
    keyCareAction:
      'Zbieraj pomidorki w słoneczne poranki. Zbieranie dojrzałych owoców pobudza roślinę do szybszego dojrzewania kolejnych pięter gron.',
    wateringTip: 'Umiarkowane – przed zbiorem lekko ogranicz wodę, dzięki czemu pomidorki będą miały bardziej skoncentrowany, słodki smak.',
    fertilizingTip: 'Utrzymuj lekkie nawożenie potasowe co 10–14 dni.',
    pruningOrSupportTip: 'Usuwaj żółknące liście pod zebranymi już gronami.',
  },
];

// 2. Papryka (Chili & Słodka doniczkowa)
const PEPPER_PHASES: PlantGrowthPhase[] = [
  {
    id: 'kielkowanie',
    order: 1,
    name: 'Długie kiełkowanie nasion',
    shortName: 'Kiełkowanie',
    icon: '🌱',
    dayStart: 0,
    dayEnd: 14,
    whatToExpect:
      'Papryka kiełkuje wolniej niż pomidor (10–14 dni). Wymaga stabilnej temperatury min. 24–26°C.',
    keyCareAction: 'Ustaw doniczkę w najcieplejszym miejscu (np. nad grzejnikiem). Przykryj przezroczystą folią ze szczeliną.',
    wateringTip: 'Zraszaj letnią wodą – podłoże nie może wyschnąć nawet na godzinę.',
    fertilizingTip: 'Brak.',
  },
  {
    id: 'liscie_i_rozeta',
    order: 2,
    name: 'Pierwsze liście i powolny wzrost',
    shortName: 'Liście & Rozeta',
    icon: '🌿',
    dayStart: 15,
    dayEnd: 35,
    whatToExpect: 'Rozwijają się błyszczące, lancetowate liście. Sadzonka rośnie powoli i zwarcie.',
    keyCareAction: 'Maksimum światła. Przepikuj do doniczek 0,7L, gdy wykształci 2–3 liście właściwe.',
    wateringTip: 'Umiarkowane – papryka nie znosi przelania korzeni.',
    fertilizingTip: 'Po 2 tygodniach od pikowania: biohumus.',
  },
  {
    id: 'krzewienie',
    order: 3,
    name: 'Rozkrzewianie & Pąk Królewski',
    shortName: 'Pąk Królewski',
    icon: '🪴',
    dayStart: 36,
    dayEnd: 65,
    whatToExpect: 'Pęd główny rozwidla się w kształt litery "Y". W samym środku rozwidlenia pojawia się pierwszy pąk kwiatowy.',
    keyCareAction:
      'KLUCZOWY ZABIEG: Usuń (uszczknij) ten pierwszy pąk ("pąk królewski")! Dzięki temu papryka nie zatrzyma wzrostu i wyda kilkukrotnie więcej owoców.',
    wateringTip: 'Głębokie podlewanie co 2–3 dni w donicy docelowej (min. 8–10L).',
    fertilizingTip: 'Nawóz wieloskładnikowy z mikroelementami.',
    pruningOrSupportTip: 'Zainstaluj niski palik bambusowy (60–80 cm).',
  },
  {
    id: 'kwitnienie',
    order: 4,
    name: 'Obfite kwitnienie i zapylanie',
    shortName: 'Kwitnienie',
    icon: '🌸',
    dayStart: 66,
    dayEnd: 90,
    whatToExpect: 'Masa białych kwiatków na rozgałęzionych pędach. Płatki opadają i odsłaniają małe zielone stożki strąków.',
    keyCareAction: 'Zapewnij ciepłe stanowisko osłonięte od wiatru (wiatr zrzuca kwiaty papryki). Zasilaj potasem.',
    wateringTip: 'Równomierna wilgotność. Przesuszenie = opadanie kwiatów.',
    fertilizingTip: 'Nawóz do papryk i pomidorów z potasem i magnezem co 7 dni.',
  },
  {
    id: 'dojrzewanie',
    order: 5,
    name: 'Wzrost strąków i zmiana barwy',
    shortName: 'Dojrzewanie',
    icon: '🌶️',
    dayStart: 91,
    dayEnd: 120,
    whatToExpect: 'Strąki osiągają docelową wielkość, a następnie zmieniają barwę z zielonej na czerwoną, żółtą lub czekoladową.',
    keyCareAction: 'Zapewnij maksimum bezpośredniego słońca – promienie słoneczne są niezbędne do wytworzenia kapsaicyny i cukrów.',
    wateringTip: 'W upały podlewaj codziennie wczesnym rankiem.',
    fertilizingTip: 'Utrzymuj zasilanie potasowe.',
  },
  {
    id: 'zbior',
    order: 6,
    name: 'Zbiory i zimowanie',
    shortName: 'Zbiory',
    icon: '🧺',
    dayStart: 121,
    dayEnd: 160,
    whatToExpect: 'W pełni wybarwione, chrupkie lub pikantne strąki.',
    keyCareAction: 'Odcinać nożyczkami z 1 cm ogonkiem (nie wyrywać ręką, by nie wyłamać gałązki). Przed przymrozkami przenieś do domu.',
    wateringTip: 'Oszczędniejsze podlewanie.',
    fertilizingTip: 'Zakończ nawożenie pod koniec września.',
  },
];

// 3. Zioła liściaste (Bazylia, Mięta, Pietruszka, Kolendra)
const HERB_PHASES: PlantGrowthPhase[] = [
  {
    id: 'kielkowanie',
    order: 1,
    name: 'Wschody i delikatne siewki',
    shortName: 'Kiełkowanie',
    icon: '🌱',
    dayStart: 0,
    dayEnd: 10,
    whatToExpect: 'Nasiona bazylii pokrywają się śluzem i wschodzą po 5–8 dniach w temperaturze pokojowej.',
    keyCareAction: 'Nasion bazylii NIE przysypuje się grubą ziemią (kiełkują na świetle). Dociskaj tylko do podłoża i zraszaj.',
    wateringTip: 'Codzienna lekka mgiełka.',
    fertilizingTip: 'Brak.',
  },
  {
    id: 'rozeta_lisci',
    order: 2,
    name: 'Rozwój liści właściwych',
    shortName: '2–3 pary liści',
    icon: '🌿',
    dayStart: 11,
    dayEnd: 25,
    whatToExpect: 'Wytworzenie 2–3 par charakterystycznych, aromatycznych liści właściwych.',
    keyCareAction: 'Przesadź kępkami (po 3–5 roślin) do skrzynki balkonowej lub donicy 3–5L.',
    wateringTip: 'Podlewaj od dołu lub wprost do ziemi – mokre liście bazylii czernieją na słońcu.',
    fertilizingTip: 'Brak lub 1/3 dawki biohumusu.',
  },
  {
    id: 'pierwsze_ciecie',
    order: 3,
    name: 'Pierwsze uszczykiwanie wierzchołka',
    shortName: 'Cięcie wierzchołka',
    icon: '✂️',
    dayStart: 26,
    dayEnd: 40,
    whatToExpect: 'Główny pęd wyciąga się w górę. W węzłach liści widać małe zaczątki pędów bocznych.',
    keyCareAction:
      'BARDZO WAŻNE: Odetnij wierzchołek pędu tuż nad drugą parą liści! Z każdego węzła wyrosną 2 nowe pędy, a krzaczek zgęstnieje w kulę.',
    wateringTip: 'Utrzymuj podłoże stale lekko wilgotne (jak wyciśnięta gąbka).',
    fertilizingTip: 'Biohumus co 14 dni.',
  },
  {
    id: 'ciagly_zbior',
    order: 4,
    name: 'Ciągły zbiór i usuwanie kwiatów',
    shortName: 'Ciągłe zbiory',
    icon: '🧺',
    dayStart: 41,
    dayEnd: 120,
    whatToExpect: 'Gęsty, bujny krzew dający świeże liście przez całe lato.',
    keyCareAction:
      'BEZWZGLĘDNIE wycinaj każdy pojawiający się pąk kwiatowy! Kwitnienie powoduje, że liście stają się twarde, gorzkie i tracą olejki eteryczne.',
    wateringTip: 'W słoneczne dni podlewaj rano. Donica nie może wyschnąć na wiór.',
    fertilizingTip: 'Lekki nawóz organiczny co 2 tygodnie.',
  },
];

// 4. Szybkie warzywa (Rzodkiewka, Rukola, Szpinak, Roszponka)
const FAST_VEGGIE_PHASES: PlantGrowthPhase[] = [
  {
    id: 'kielkowanie',
    order: 1,
    name: 'Błyskawiczne wschody',
    shortName: 'Kiełkowanie',
    icon: '🌱',
    dayStart: 0,
    dayEnd: 5,
    whatToExpect: 'Rzodkiewka i rukola kiełkują już po 3–4 dniach, nawet w temperaturze 10–14°C.',
    keyCareAction: 'Siej w rządkach co 3–4 cm. Utrzymuj stałą wilgoć, aby siewki nie uschły w skorupie gleby.',
    wateringTip: 'Codziennie rano delikatny zraszacz.',
    fertilizingTip: 'Brak nawozów chemicznych.',
  },
  {
    id: 'przerywka',
    order: 2,
    name: 'Liście właściwe i przerywka',
    shortName: 'Przerywka siewek',
    icon: '🌿',
    dayStart: 6,
    dayEnd: 14,
    whatToExpect: 'Siewki zagęszczają się. Wyrastają pierwsze szorstkie liście właściwe.',
    keyCareAction:
      'Zrób przerywkę: wyrwij najsłabsze siewki, zostawiając odstępy min. 4–5 cm. Zbyt gęsty siew da same liście bez korzenia!',
    wateringTip: 'Równomierne, umiarkowane podlewanie.',
    fertilizingTip: 'Brak – rzodkiewka nie znosi nawożenia azotowego (kumuluje azotany).',
  },
  {
    id: 'wzrost_plonu',
    order: 3,
    name: 'Formowanie zgrubienia / masy liściowej',
    shortName: 'Narastanie plonu',
    icon: '🪴',
    dayStart: 15,
    dayEnd: 28,
    whatToExpect: 'U nasady łodyżki wyłania się różowo-czerwona kulka rzodkiewki lub gęsta rozeta liści rukoli.',
    keyCareAction:
      'Utrzymuj absolutnie stałą wilgotność! Przesuszenie ziemi sprawia, że rzodkiewka staje się piekąca, łykowata lub pęka po podlaniu.',
    wateringTip: 'Codzienne podlewanie w umiarkowanej ilości.',
    fertilizingTip: 'Ewentualnie woda z dodatkiem biohumusu.',
  },
  {
    id: 'zbior',
    order: 4,
    name: 'Chrupiący zbiór',
    shortName: 'Zbiory',
    icon: '🧺',
    dayStart: 29,
    dayEnd: 42,
    whatToExpect: 'Zgrubienia osiągają 2,5–3,5 cm średnicy. Liście są chrupkie i soczyste.',
    keyCareAction:
      'Wyrywaj na bieżąco największe sztuki. Nie zwlekaj – przerośnięta rzodkiewka parcieje i puszcza pęd kwiatostanowy.',
    wateringTip: 'Podlej na 2 godziny przed zbiorem – korzenie będą łatwo wychodzić i zachowają maksymalną chrupkość.',
    fertilizingTip: 'Brak.',
  },
];

// 5. Truskawka / Poziomka doniczkowa
const BERRY_PHASES: PlantGrowthPhase[] = [
  {
    id: 'start_wiosenny',
    order: 1,
    name: 'Wiosenny start & rozbudowa korony',
    shortName: 'Rozwój liści',
    icon: '🌿',
    dayStart: 0,
    dayEnd: 20,
    whatToExpect: 'Z serduszka rośliny wybijają młode, trójlistkowe jasnozielone liście.',
    keyCareAction: 'Oczyść donicę z suchych, zeszłorocznych liści. Zadbaj o drenaż i żyzne, lekko kwaśne podłoże (pH 5.5–6.5).',
    wateringTip: 'Podlewaj umiarkowanie, pilnując by woda nie stała w podstawce.',
    fertilizingTip: 'Zasil nawozem do truskawek lub biohumusem.',
  },
  {
    id: 'kwitnienie',
    order: 2,
    name: 'Kwitnienie (kwiaty białe lub różowe)',
    shortName: 'Kwitnienie',
    icon: '🌸',
    dayStart: 21,
    dayEnd: 40,
    whatToExpect: 'Wyrastają pędy kwiatostanowe zakończone uroczymi kwiatami z żółtym środkiem.',
    keyCareAction:
      'Chroń donice przed porywistym wiatrem na wyższych piętrach. W południe wiatr i owady zapylają kwiaty.',
    wateringTip: 'Podlewaj pod korzeń, unikaj zraszania kwiatów (mokry pyłek nie zapyli zalążni).',
    fertilizingTip: 'Nawóz z wysoką zawartością potasu dla obfitego kwitnienia.',
    pruningOrSupportTip: 'Wytnij pojawiające się długie pędy rozłogowe (tzw. wąsy), aby roślina nie marnowała sił!',
  },
  {
    id: 'owocowanie',
    order: 3,
    name: 'Zielone jagody i narastanie',
    shortName: 'Zielone owoce',
    icon: '🍓',
    dayStart: 41,
    dayEnd: 60,
    whatToExpect: 'Płatki opadają, a dno kwiatowe pęcznieje w zielone owoce z drobnymi nasionkami (orzeszkami).',
    keyCareAction: 'Podłóż pod owoce odrobinę czystej słomy, wełny drzewnej lub keramzytu, by nie leżały na mokrej ziemi.',
    wateringTip: 'Zwiększone zapotrzebowanie na wodę – podłoże musi być stale wilgotne.',
    fertilizingTip: 'Nawóz potasowy co 7–10 dni.',
  },
  {
    id: 'czerwienienie_zbior',
    order: 4,
    name: 'Czerwienienie i powtarzające się zbiory',
    shortName: 'Zbiory truskawek',
    icon: '🧺',
    dayStart: 61,
    dayEnd: 150,
    whatToExpect: 'Jagody wybarwiają się na intensywny szkarłat i pachną poziomkowo w słońcu.',
    keyCareAction: 'Zbieraj co 2 dni. Odmiany powtarzające będą owocować falami aż do pierwszych przymrozków w październiku!',
    wateringTip: 'Regularne, rano lub wieczorem.',
    fertilizingTip: 'Lekkie nawożenie biohumusem po każdej fali owocowania.',
  },
];

// 6. Grzyby doniczkowe (Boczniak, Pieczarka, Soplówka, Shiitake)
const MUSHROOM_PHASES: PlantGrowthPhase[] = [
  {
    id: 'szok_indukcyjny',
    order: 1,
    name: 'Szok indukcyjny i start grzybni',
    shortName: 'Szok & Start',
    icon: '🍄',
    dayStart: 0,
    dayEnd: 4,
    whatToExpect: 'Grzybnia w podłożu trocinowym lub kompoście otrzymuje impuls do owocowania (chłód, namoczenie lub światło).',
    keyCareAction: 'Umieść kostkę/donicę w cieniu, z dala od bezpośredniego słońca i wiatru. Zapewnij 85–90% wilgotności powietrza.',
    wateringTip: 'Zraszaj mgiełką ścianki pojemnika 2–3x dziennie.',
    fertilizingTip: 'NIGDY nie nawozić! Grzyby pobierają pokarm wyłącznie z rozkładu podłoża.',
  },
  {
    id: 'pinheady',
    order: 2,
    name: 'Zawiązywanie owocników (pinheads)',
    shortName: 'Zawiązki (piny)',
    icon: '🌱',
    dayStart: 5,
    dayEnd: 10,
    whatToExpect: 'Na powierzchni podłoża pojawiają się dziesiątki małych, ciemnych główek (zawiązków kapeluszy lub sopelków).',
    keyCareAction: 'Utrzymuj wysoką wilgotność (np. pod kloszem lub w cieniu zraszanej juty). Nie dopuść do przesuszenia.',
    wateringTip: 'Bardzo drobna mgiełka wodna.',
    fertilizingTip: 'Brak.',
  },
  {
    id: 'wzrost_owocnikow',
    order: 3,
    name: 'Błyskawiczny wzrost kapeluszy / sopli',
    shortName: 'Rozrost grzybów',
    icon: '🪴',
    dayStart: 11,
    dayEnd: 18,
    whatToExpect: 'Grzyby rosną w oczach – kapelusze powiększają się o kilka centymetrów na dobę!',
    keyCareAction: 'Zapewnij delikatną wymianę świeżego powietrza (grzyby wydzielają CO2, potrzebują tlenu do prawidłowego kształtu).',
    wateringTip: 'Zraszanie otoczenia.',
    fertilizingTip: 'Brak.',
  },
  {
    id: 'zbior_rzutu',
    order: 4,
    name: 'Zbiór rzutu I & odpoczynek przed rzutem II',
    shortName: 'Zbiór i kolejny rzut',
    icon: '🧺',
    dayStart: 19,
    dayEnd: 45,
    whatToExpect: 'Osiągnięcie pełnej dojrzałości (brzegi kapeluszy lekko podwinięte).',
    keyCareAction:
      'Wykręć całe kępy z podłoża (nie ucinaj pniaków, by nie gniły). Po 10 dniach odpoczynku namocz kostkę w zimnej wodzie na 12h, a wyda kolejny rzut!',
    wateringTip: 'Po zbiorze ogranicz wilgoć na kilka dni odpoczynku.',
    fertilizingTip: 'Brak.',
  },
];

/**
 * Fallback generator for generic plants based on days to harvest
 */
function createGenericPhases(plant: Plant): PlantGrowthPhase[] {
  const harvestDays = plant.growing_period.days_to_harvest || 75;
  const p1End = Math.max(5, Math.round(harvestDays * 0.12));
  const p2End = Math.max(p1End + 8, Math.round(harvestDays * 0.32));
  const p3End = Math.max(p2End + 12, Math.round(harvestDays * 0.65));
  const p4End = Math.max(p3End + 10, Math.round(harvestDays * 0.88));
  const p5End = harvestDays + 20;

  return [
    {
      id: 'kielkowanie',
      order: 1,
      name: 'Kiełkowanie i wschody',
      shortName: 'Kiełkowanie',
      icon: '🌱',
      dayStart: 0,
      dayEnd: p1End,
      whatToExpect: `Wschody nasion w podłożu. Pojawienie się pierwszych liścieni (${p1End} dni od siewu).`,
      keyCareAction: 'Utrzymuj wilgotność podłoża zraszaczem i zapewnij ciepło oraz światło.',
      wateringTip: 'Zraszaj delikatnie 1x dziennie.',
      fertilizingTip: 'Brak nawozów w fazie kiełkowania.',
    },
    {
      id: 'liscie_wlasciwe',
      order: 2,
      name: 'Pierwsze liście właściwe i pikowanie',
      shortName: 'Młoda roślina',
      icon: '🌿',
      dayStart: p1End + 1,
      dayEnd: p2End,
      whatToExpect: 'Wykształcenie pierwszych liści właściwych i dynamiczny rozrost systemu korzeniowego.',
      keyCareAction: 'Przepikuj do większego pojemnika lub przerwij zbyt gęste wschody.',
      wateringTip: 'Podlewaj umiarkowanie, unikaj zastoisk wody w podstawce.',
      fertilizingTip: 'Delikatny nawóz organiczny po 14 dniach.',
    },
    {
      id: 'wzrost_glowny',
      order: 3,
      name: 'Główny wzrost wegetatywny i podpory',
      shortName: 'Główny wzrost',
      icon: '🪴',
      dayStart: p2End + 1,
      dayEnd: p3End,
      whatToExpect: 'Intensywna budowa pędów i liści. Roślina wymaga docelowej przestrzeni w donicy.',
      keyCareAction: 'Zapewnij odpowiednią donicę (min. ' + plant.pot.min_volume_l + 'L) oraz podpory jeśli roślina pnąca.',
      wateringTip: 'Głębsze podlewanie wprost pod korzeń.',
      fertilizingTip: 'Zasilanie nawozem zbilansowanym co 10–14 dni.',
    },
    {
      id: 'kwitnienie_zawiazki',
      order: 4,
      name: 'Kwitnienie lub formowanie plonu',
      shortName: 'Kwitnienie / Plon',
      icon: '🌸',
      dayStart: p3End + 1,
      dayEnd: p4End,
      whatToExpect: 'Formowanie kwiatów, pąków lub zgrubień korzeniowych/liściowych.',
      keyCareAction: 'Zwiększone zapotrzebowanie na potas i fosfor. Chroń przed przesuszeniem.',
      wateringTip: 'Regularne nawadnianie rano lub wieczorem.',
      fertilizingTip: 'Nawóz o wyższej zawartości potasu.',
    },
    {
      id: 'dojrzewanie_zbior',
      order: 5,
      name: 'Dojrzewanie i zbiory',
      shortName: 'Zbiory plonów',
      icon: '🧺',
      dayStart: p4End + 1,
      dayEnd: p5End,
      whatToExpect: 'Plony osiągają pełną dojrzałość konsumpcyjną.',
      keyCareAction: 'Zbieraj sukcesywnie w miarę dojrzewania, by pobudzać roślinę do dalszej produkcji.',
      wateringTip: 'Umiarkowane podlewanie.',
      fertilizingTip: 'Ogranicz nawożenie przed finiszem zbiorów.',
    },
  ];
}

/**
 * Returns the growth phase schema for a given plant
 */
export function getPlantGrowthPhases(plant: Plant): PlantGrowthPhase[] {
  const pId = plant.id.toLowerCase();
  const group = plant.plant_group;

  if (pId.includes('pomidor') || plant.name.toLowerCase().includes('pomidor')) {
    return TOMATO_PHASES;
  }
  if (pId.includes('papryk') || plant.name.toLowerCase().includes('papryk') || pId.includes('chili')) {
    return PEPPER_PHASES;
  }
  if (
    pId.includes('truskawk') ||
    pId.includes('poziomk') ||
    plant.name.toLowerCase().includes('truskawk') ||
    plant.name.toLowerCase().includes('poziomk')
  ) {
    return BERRY_PHASES;
  }
  if (
    pId.includes('pieczark') ||
    pId.includes('soplowk') ||
    pId.includes('shiitake') ||
    pId.includes('boczniak') ||
    group === 'grzyby'
  ) {
    return MUSHROOM_PHASES;
  }
  if (
    pId.includes('rzodkiewk') ||
    pId.includes('rukol') ||
    pId.includes('szpinak') ||
    pId.includes('roszponk') ||
    pId.includes('salat')
  ) {
    return FAST_VEGGIE_PHASES;
  }
  if (
    group === 'ziola' ||
    pId.includes('bazyli') ||
    pId.includes('miet') ||
    pId.includes('pietruszk') ||
    pId.includes('kolendr') ||
    pId.includes('rozmaryn') ||
    pId.includes('tymian') ||
    pId.includes('oregano')
  ) {
    return HERB_PHASES;
  }

  return createGenericPhases(plant);
}

/**
 * Calculates days since sowing/planting
 */
export function calculateDaysSinceSowing(crop: MyCropItem, phases: PlantGrowthPhase[]): number {
  if (crop.sowing?.date) {
    try {
      const sowingDate = new Date(crop.sowing.date);
      const now = new Date();
      // Difference in full days
      const diffMs = now.getTime() - sowingDate.getTime();
      let diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

      // If planted as a store-bought seedling, offset by ~25-30 days of growth
      if (crop.sowing.method === 'sadzonka') {
        diffDays += 28;
      }
      return diffDays;
    } catch {
      // fallback
    }
  }

  // Fallback: estimate from user-selected growth stage
  const stage = crop.stage || 'rosnie';
  const totalDays = phases[phases.length - 1]?.dayEnd || 90;

  switch (stage) {
    case 'planowanie':
      return 0;
    case 'siew':
      return Math.round(phases[0]?.dayEnd ? phases[0].dayEnd / 2 : 4);
    case 'rozsada':
      return Math.round(phases[1]?.dayStart || 15);
    case 'rosnie':
      return Math.round(phases[2]?.dayStart || 35);
    case 'kwitnie': {
      const flowerPhase = phases.find((p) => p.name.toLowerCase().includes('kwitn')) || phases[Math.min(3, phases.length - 1)];
      return Math.round((flowerPhase.dayStart + flowerPhase.dayEnd) / 2);
    }
    case 'owocuje': {
      const fruitPhase = phases.find((p) => p.name.toLowerCase().includes('owoc') || p.name.toLowerCase().includes('dojrzew'));
      return fruitPhase ? Math.round((fruitPhase.dayStart + fruitPhase.dayEnd) / 2) : Math.round(totalDays * 0.75);
    }
    case 'zbior':
      return phases[phases.length - 1]?.dayStart || totalDays;
    default:
      return 30;
  }
}

/**
 * Evaluates the user's pot configuration against the plant's biological needs
 */
export function assessPotSuitability(plant: Plant, crop: MyCropItem): PotAssessment {
  const pot = crop.pot;
  const minVol = plant.pot.min_volume_l;

  if (!pot || !pot.volumeL) {
    return {
      status: 'idealna',
      badge: 'Brak konfiguracji',
      message: `Wymóg rośliny: min. ${minVol}L ziemi (głębokość ${plant.pot.min_depth_cm}cm). Skonfiguruj donicę, aby otrzymać precyzyjne zalecenia.`,
      wateringImpact: 'Brak danych o donicy – podlewaj według standardowego testu wilgotności.',
      fertilizingImpact: 'Stosuj dawki nawozowe podane na opakowaniu preparatu.',
    };
  }

  // 1. Check drainage first
  if (pot.hasDrainage === false) {
    return {
      status: 'brak_drenazu',
      badge: '🚨 Brak odpływu wody!',
      message:
        'Donica nie posiada otworów drenażowych! Każdy obfity deszcz lub przelanie stworzy beztlenowe bagno na dnie, co w 7–10 dni udusi korzenie.',
      wateringImpact: 'KRYTYCZNE: Podlewaj z aptekarską precyzją, tylko małą ilością wody lub natychmiast nawierć 3–4 otwory w dnie!',
      fertilizingImpact: 'Ogranicz stężenie nawozów – brak przepłukiwania grozi zasoleniem bryły korzeniowej.',
    };
  }

  // 2. Check volume
  if (pot.volumeL < minVol * 0.8) {
    return {
      status: 'za_mala',
      badge: `⚠️ Zbyt mała donica (${pot.volumeL}L < ${minVol}L)`,
      message: `Ta roślina wymaga min. ${minVol}L pojemności, a Twoja ma tylko ${pot.volumeL}L. Ograniczy to plon, a ziemia będzie wysychać w kilka godzin.`,
      wateringImpact:
        'W upalne i słoneczne dni donica wymaga podlewania 2x dziennie (rano przed 8:00 i wieczorem po zachodzie słońca).',
      fertilizingImpact:
        'Składniki odżywcze wypłukują się znacznie szybciej. Nawoź częściej (co 5–7 dni), ale dawką zredukowaną o 30%, by nie poparzyć korzeni.',
    };
  }

  // 3. Check material specifics
  if (pot.material === 'ceramika_terakota') {
    return {
      status: 'uwaga_material',
      badge: '🏺 Donica terakotowa (porowata)',
      message:
        'Wypalana glina/terakota jest materiałem naturalnym i oddychającym, ale woda paruje również przez ścianki donicy!',
      wateringImpact: 'Ziemia przesycha o ok. 25–30% szybciej niż w plastiku – sprawdzaj wilgotność częściej.',
      fertilizingImpact: 'Doskonałe napowietrzenie korzeni sprzyja zdrowemu pobieraniu fosforu i wapnia.',
    };
  }

  if (pot.material === 'tkanina') {
    return {
      status: 'idealna',
      badge: '🌱 Worek uprawowy (Growbag)',
      message:
        'Tkanina zapewnia tzw. air-pruning (przycinanie korzeni powietrzem) – korzenie nie skręcają się w koło, lecz tworzą gęstą szczotkę włośników.',
      wateringImpact: 'Woda może szybko spływać bokami worka – podlewaj powoli, etapami, aby podłoże zdążyło nasiąknąć.',
      fertilizingImpact: 'Świetne napowietrzenie podłoża, optymalne wchłanianie biohumusu.',
    };
  }

  if (pot.potType === 'samonawadniajaca') {
    return {
      status: 'idealna',
      badge: '💧 Donica samonawadniająca',
      message:
        'Podwójne dno z rezerwuarem wody pozwala roślinie pić podsiąkowo – liście i łodygi pozostają suche i bezpieczne przed patogenami.',
      wateringImpact: 'Dolewaj wody przez wlew kominowy do poziomu wskaźnika. Nie podlewaj z góry po liściach.',
      fertilizingImpact: 'Płynny nawóz wlewaj bezpośrednio do rezerwuaru wodnego w dawce 1/2 stężenia.',
    };
  }

  return {
    status: 'idealna',
    badge: `✅ Optymalna donica (${pot.volumeL}L)`,
    message: `Pojemność ${pot.volumeL}L zapewnia korzeniom odpowiedni bufor wilgoci i składników pokarmowych dla ${plant.name}.`,
    wateringImpact: 'Standardowy rytm podlewania: wsuń palec na 2–3 cm, podlewaj gdy ziemia jest sucha.',
    fertilizingImpact: 'Stosuj regularne zasilanie według aktualnej fazy wzrostu rośliny.',
  };
}

/**
 * Builds the complete growth timeline, current phase, and contextual action plan
 */
export function getCropTimelineInfo(plant: Plant, crop: MyCropItem): CropTimelineInfo {
  const phases = getPlantGrowthPhases(plant);
  const totalDaysToHarvest = phases[phases.length - 1]?.dayEnd || 90;
  const daysSinceSowing = calculateDaysSinceSowing(crop, phases);

  // Determine current phase
  let currentPhaseIndex = phases.findIndex(
    (p) => daysSinceSowing >= p.dayStart && daysSinceSowing <= p.dayEnd
  );

  if (currentPhaseIndex === -1) {
    if (daysSinceSowing < phases[0].dayStart) {
      currentPhaseIndex = 0;
    } else {
      currentPhaseIndex = phases.length - 1;
    }
  }

  const currentPhase = phases[currentPhaseIndex];
  const nextPhase = phases[currentPhaseIndex + 1] || null;
  const daysUntilNextPhase = nextPhase ? Math.max(1, nextPhase.dayStart - daysSinceSowing) : null;

  // Progress percentage
  const progressPercent = Math.min(100, Math.round((daysSinceSowing / totalDaysToHarvest) * 100));
  const isReadyForHarvest = currentPhaseIndex === phases.length - 1 || daysSinceSowing >= totalDaysToHarvest;

  // Pot evaluation
  const potAssessment = assessPotSuitability(plant, crop);

  // Recommendations for "co wtedy"
  let dangerToAvoid = 'Unikaj przelania korzeni i nagłych wahań wilgotności podłoża.';
  if (currentPhase.id === 'kielkowanie') {
    dangerToAvoid = 'Nigdy nie dopuść do przesuszenia wierzchniej warstwy gleby – kiełek uschnie w kilka godzin.';
  } else if (currentPhase.id === 'kwitnienie') {
    dangerToAvoid = 'Nie stosuj nawozów o wysokiej zawartości azotu – roślina pójdzie w liście i zrzuci kwiaty!';
  } else if (currentPhase.id === 'dojrzewanie') {
    dangerToAvoid = 'Unikaj nagłego zalania donicy po przesuszeniu, gdyż owoce momentalnie popękają.';
  }

  const currentPhaseRecommendation = {
    title: `${currentPhase.shortName} – dzień ${daysSinceSowing} uprawy`,
    action: currentPhase.keyCareAction,
    dangerToAvoid,
  };

  return {
    phases,
    totalDaysToHarvest,
    currentPhaseIndex,
    currentPhase,
    daysSinceSowing,
    daysUntilNextPhase,
    progressPercent,
    isReadyForHarvest,
    potAssessment,
    currentPhaseRecommendation,
  };
}
