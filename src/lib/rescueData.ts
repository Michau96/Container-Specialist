import { CropRescuePlan } from '../types';

export interface RescueIssueDefinition {
  id: string;
  title: string;
  symptomBadge: string;
  icon: string;
  imageUrl: string;
  imageAlt: string;
  category: 'water' | 'disease' | 'pest' | 'sun' | 'soil';
  categoryLabel: string;
  shortSymptom: string;
  visualCue: string;
  diagnosis: string;
  cause: string;
  suspendedWateringDays: number;
  immediateAction: string;
  steps: string[];
  whatToAvoid: string;
  recoveryTimeline: string;
}

export const RESCUE_ISSUES: RescueIssueDefinition[] = [
  {
    id: 'yellow_leaves',
    title: 'Żółte liście',
    symptomBadge: 'Przelanie / Korzenie',
    icon: '🍂',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Żółknące dolne liście rośliny z powodu nadmiaru wody i braku tlenu',
    category: 'water',
    categoryLabel: 'Nawadnianie i podłoże',
    shortSymptom: 'Liście żółkną od dołu, tracą sprężystość, a ziemia w donicy jest stale mokra lub ciężka.',
    visualCue: 'Dolne liście blakną, stają się miękkie i opadają, ziemia pachnie stęchłym mułem.',
    diagnosis: 'Zastój wody i niedotlenienie korzeni (przelanie rośliny)',
    cause: 'Zbyt częste podlewanie donicy bez przeschnięcia wierzchniej warstwy lub brak odpływu w dnie pojemnika. Na balkonie woda z głębi donicy paruje wolniej niż w gruncie.',
    suspendedWateringDays: 4,
    immediateAction: 'Natychmiast wstrzymaj jakiekolwiek podlewanie na min. 4 dni i opróżnij podstawkę.',
    steps: [
      'Wylej natychmiast całą stojącą wodę z podstawki lub osłonki donicy.',
      'Wstrzymaj podlewanie na 4 dni. Podłoże w strefie korzeniowej musi odzyskać dostęp do tlenu.',
      'Delikatnie wzrusz wierzchnią warstwę ziemi (patyczkiem lub widelcem na głębokość 2-3 cm), aby ułatwić odparowanie wilgoci.',
      'Upewnij się, że otwory drenażowe w dnie donicy nie są zatkane zbitym podłożem.',
      'Jeśli donica stoi w głębokim cieniu i chłodzie, przesuń ją w ciepłe, przewiewne miejsce osłonięte przed deszczem.',
    ],
    whatToAvoid: 'Pod żadnym pozorem nie podlewaj "z przyzwyczajenia" ani nie podawaj żadnych nawozów mineralnych, dopóki bryła nie przeschnie.',
    recoveryTimeline: 'Zatrzymanie żółknięcia w ciągu 3-5 dni. Zżółknięte liście nie zzielenią się ponownie – oberwij je po 2 dniach.',
  },
  {
    id: 'white_mildew',
    title: 'Biały nalot (Mączniak)',
    symptomBadge: 'Infekcja grzybowa',
    icon: '⚪',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Biały nalot mączystego grzyba na liściach rośliny',
    category: 'disease',
    categoryLabel: 'Choroby grzybowe',
    shortSymptom: 'Biały, mączysty nalot na wierzchniej stronie liści przypominający rozsypaną mąkę.',
    visualCue: 'Puder na liściach, z czasem liście brązowieją, marszczą się i usychają.',
    diagnosis: 'Mączniak prawdziwy (infekcja zarodnikowa grzyba)',
    cause: 'Częsty problem na balkonach przy dużej różnicy temperatur dzień/noc, podlewaniu po liściach i słabym przewiewie między donicami.',
    suspendedWateringDays: 2,
    immediateAction: 'Wytnij najbardziej porażone liście i wykonaj ekologiczny oprysk z sody lub mleka.',
    steps: [
      'Odetnij nożyczkami najbardziej pokryte białym nalotem liście i wyrzuć do śmietnika (nie na kompost!).',
      'Wstrzymaj podlewanie z góry i nie zraszaj liści wodą przez 2 dni.',
      'Przygotuj domowy oprysk przeciwgrzybiczy: 1 łyżeczka sody oczyszczonej + 3 krople szarego mydła w płynie na 1 litr letniej wody (lub woda z mlekiem 4:1).',
      'Opryskaj dokładnie obie strony pozostałych liści i łodygi wieczorem, po zachodzie słońca.',
      'Odsuń donicę od ściany balkonu i sąsiednich roślin, by zapewnić stałą cyrkulację powietrza.',
    ],
    whatToAvoid: 'Nigdy nie zraszaj liści mgiełką wodną ani nie podlewaj od góry konewką z sitkiem.',
    recoveryTimeline: 'Zahamowanie rozwoju grzyba w ciągu 24-48 godzin. W razie potrzeby powtórz oprysk sodą po 5 dniach.',
  },
  {
    id: 'wilted_drooping',
    title: 'Zwiędnięta i oklapnięta',
    symptomBadge: 'Przesuszenie / Szok termiczny',
    icon: '🥀',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Oklapnięte i zwiędnięte pędy rośliny w rozgrzanym słońcem pojemniku',
    category: 'sun',
    categoryLabel: 'Upał i nasłonecznienie',
    shortSymptom: 'Wiotkie pędy, liście wiszą bez życia ku dołowi, a ziemia odstaje od ścianek donicy.',
    visualCue: 'Roślina całkowicie oklapła w upalny dzień, donica jest niezwykle lekka przy podniesieniu.',
    diagnosis: 'Ostry deficyt wody w korzeniach i przegrzanie pojemnika',
    cause: 'Nagrzanie ciemnych ścianek donicy przez słońce oraz silny, suchy wiatr balkonowy, który gwałtownie wysuszył bryłę korzeniową.',
    suspendedWateringDays: 0,
    immediateAction: 'Natychmiast przestaw w głęboki cień i nawodnij bryłę korzeniową powolną metodą podsiąkową.',
    steps: [
      'Natychmiast zdejmij donicę z bezpośredniego słońca i postaw w cieniu balkonu lub w chłodnym pomieszczeniu.',
      'Nie wlewaj lodowatej wody na suchą ziemię z góry – spłynie szczelinami przy brzegu donicy bez nawodnienia środka.',
      'Wstaw donicę do miski lub głębokiej podstawki z letnią, odstaną wodą na 20-30 minut, aby ziemia napiła się od dołu.',
      'Gdy wierzchnia warstwa ziemi stanie się wilgotna, wyjmij donicę i pozwól nadmiarowi wody swobodnie odcieknąć.',
      'Pozostaw roślinę w cieniu przez 24 godziny, aż odzyska turgor w łodygach.',
    ],
    whatToAvoid: 'Nie wystawiaj oklapniętej rośliny na słońce tuż po podlaniu – wilgotne korzenie w rozgrzanej ziemi ulegną ugotowaniu.',
    recoveryTimeline: 'Powrót sprężystości łodyg i uniesienie liści następuje zwykle po 3-8 godzinach w chłodzie.',
  },
  {
    id: 'spider_mites',
    title: 'Pajęczynki i plamki (Przędziorki)',
    symptomBadge: 'Szkodniki balkonowe',
    icon: '🕸️',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Delikatne pajęczynki i plamkowate przebarwienia na spodzie liści',
    category: 'pest',
    categoryLabel: 'Szkodniki i owady',
    shortSymptom: 'Mikroskopijne pajęczynki pod spodem liści i drobne, mozaikowe żółte nakłucia na blaszce.',
    visualCue: 'Cieniutka pajęczynka w kątach liści, żółknące kropkowane liście, pylisty spód liścia.',
    diagnosis: 'Inwazja przędziorków chmielowców lub szklarniowych',
    cause: 'Gorące, suche i stojące powietrze na balkonie (zwłaszcza od strony południowej i zachodniej). Przędziorki błyskawicznie kolonizują osłabione rośliny.',
    suspendedWateringDays: 1,
    immediateAction: 'Odizoluj donicę, zrób prysznic od spodu liści i zastosuj oprysk z oleju lub szarego mydła.',
    steps: [
      'Odsuń zaatakowaną donicę od innych upraw, by szkodnik nie przeskoczył na sąsiednie rośliny.',
      'Zabezpiecz donicę folią i zmyj spód liści silnym, letnim strumieniem prysznica (przędziorki giną w wilgoci).',
      'Przygotuj oprysk olejowy: 1 łyżka oleju rzepakowego/lnianego + pół łyżeczki szarego mydła w płynie na 1L ciepłej wody.',
      'Dokładnie spryskaj spód wszystkich liści i kąty pędów – emulsja olejowa odcina roztoczom dostęp tlenu.',
      'Zwiększ wilgotność wokół donicy, ustawiając w pobliżu płaski pojemnik z wodą.',
    ],
    whatToAvoid: 'Nie wykonuj oprysków olejowych w pełnym słońcu, aby nie poparzyć delikatnej tkanki liścia.',
    recoveryTimeline: 'Zniszczenie dorosłych osobników w ciągu 2 dni. Za 4-5 dni powtórz zabieg, by zlikwidować wyklute larwy.',
  },
  {
    id: 'aphids',
    title: 'Mszyce i lepka rosa',
    symptomBadge: 'Szkodniki na pędach',
    icon: '🐛',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Zielone i czarne mszyce oblepiające młode pędy rośliny',
    category: 'pest',
    categoryLabel: 'Szkodniki i owady',
    shortSymptom: 'Kolonie małych zielonych, czarnych lub szarych robaczków na młodych pędach i pąkach.',
    visualCue: 'Lepkie liście ("spadź"), zdeformowane wierzchołki wzrostu, skupiska owadów.',
    diagnosis: 'Żerowanie kolonii mszyc wysysających soki roślinne',
    cause: 'Mszyce przylatują na balkon z wiatrem lub z pobliskich drzew miejskich i natychmiast oblepiają młode, soczyste przyrosty.',
    suspendedWateringDays: 1,
    immediateAction: 'Mechanicznie zmyj kolonie mszyc i zastosuj wywar z czosnku lub roztwór mydła potasowego.',
    steps: [
      'Wilgotnym wacikiem lub ręcznikiem papierowym zgnieć i usuń największe widoczne skupiska mszyc.',
      'Spłucz wierzchołki pędów mocnym strumieniem letniej wody.',
      'Zrób naturalny oprysk czosnkowy: rozgnieć 3 ząbki czosnku w 1 litrze wody, odstaw na 3 godziny, przecedź przez sitko.',
      'Opryskaj obficie pąki, wierzchołki łodyg oraz spody liści.',
      'W razie potrzeby posadź obok aksamitkę lub lawendę, których zapach działa odstraszająco.',
    ],
    whatToAvoid: 'Unikaj chemicznych insektycydów o długim okresie karencji, jeśli to roślina jadalna (zioła, truskawki, pomidory).',
    recoveryTimeline: 'Zabieg mechaniczny i czosnek dają natychmiastowy spadek populacji. Kontrola za 3 dni.',
  },
  {
    id: 'sunburn_scorched',
    title: 'Poparzenia i spalone brzegi',
    symptomBadge: 'Poparzenie słoneczne',
    icon: '☀️',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Wypalone plamy i suche brzegi liści wystawionych na silne nasłonecznienie',
    category: 'sun',
    categoryLabel: 'Upał i nasłonecznienie',
    shortSymptom: 'Brązowe, suche, pergaminowe plamy na liściach lub podwinięte, chrupiące krawędzie.',
    visualCue: 'Jasnobrązowe plamy na najwyższych liściach wystawionych na południe, liście wyglądają na "usmażone".',
    diagnosis: 'Poparzenie słoneczne tkanki liściowej lub nagrzanie bryły korzeniowej',
    cause: 'Krople wody działające jak soczewki w południowym słońcu, nagłe wystawienie rozsady bez hartowania lub temperatura donicy przekraczająca 38°C.',
    suspendedWateringDays: 2,
    immediateAction: 'Zapewnij natychmiastowe cieniowanie i podlewaj wyłącznie wczesnym rankiem lub po zmroku.',
    steps: [
      'Zapewnij natychmiastowe rozproszenie światła: załóż jasną agrowłókninę cieniującą lub przesuń donicę za barierkę balkonu w godzinach 11:00-15:30.',
      'Zabezpiecz donicę: owiń ciemny plastik jasną szmatką lub tekturą, by odizolować korzenie od nagrzewania.',
      'Nie obrywaj od razu wszystkich poparzonych liści – zielone części nadal produkują cukry dla rośliny. Usuń tylko całkowicie spalone.',
      'Zawieś nawożenie mineralne na 10 dni – roślina w stresie termicznym nie przyswaja soli nawozowych.',
      'Podlewaj wyłącznie do ziemi, bardzo wczesnym rankiem lub po zmroku.',
    ],
    whatToAvoid: 'Nigdy nie podlewaj liści ani nie zraszaj rośliny, gdy świeci na nią ostre słońce.',
    recoveryTimeline: 'Wypuszczenie nowych, zahartowanych liści w ciągu 7-10 dni.',
  },
  {
    id: 'fungal_gnats',
    title: 'Pleśń na ziemi lub muszki',
    symptomBadge: 'Choroba podłoża',
    icon: '🪰',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Wilgotna ziemia z białym osadem grzybni i ziemiórkami',
    category: 'soil',
    categoryLabel: 'Podłoże i korzenie',
    shortSymptom: 'Biały kożuch pleśni na wierzchu ziemi lub małe czarne muszki wylatujące po dotknięciu donicy.',
    visualCue: 'Biały nalot na podłożu, mikroskopijne czarne muszki (ziemiórki) biegające po wilgotnej ziemi.',
    diagnosis: 'Ziemiórki lub pleśń podłoża z powodu braku przewiewu i ciągłej wilgoci',
    cause: 'Ziemia o słabym drenażu, zbyt częste powierzchniowe podlewanie i chłodne noce sprzyjające rozwojowi grzybni saprotroficznej.',
    suspendedWateringDays: 5,
    immediateAction: 'Zdejmij wierzchnią warstwę pleśni, posyp ziemię cynamonem i przesusz podłoże na 5 dni.',
    steps: [
      'Zdejmij łyżką wierzchnią warstwę ziemi z nalotem (ok. 1-2 cm) i wyrzuć.',
      'Wstrzymaj podlewanie na 5 dni – wierzchnia warstwa gleby MUSI przeschnąć na głębokość 3-4 cm (to zabija larwy i jaja ziemiórek).',
      'Posyp powierzchnię podłoża mielonym cynamonem – to naturalny, silny fungicyd bezpieczny dla roślin jadalnych.',
      'Wbij w donicę żółty lep na owady (dostępny w marketach ogrodniczych), aby wyłapać latające muszki.',
      'W przyszłości podlewaj roślinę rzadziej, a obficiej, pozwalając wierzchniej warstwie dobrze przeschnąć.',
    ],
    whatToAvoid: 'Nie podlewaj "po kropelce" codziennie – to idealne środowisko lęgowe dla larw ziemiórek.',
    recoveryTimeline: 'Zniknięcie pleśni w ciągu 48h dzięki cynamonowi. Wymarcie pokolenia ziemiórek: 5-7 dni.',
  },
];

/**
 * Generates an active CropRescuePlan for a given issue
 */
export function createRescuePlan(issueId: string, customPlantName?: string): CropRescuePlan | null {
  const issue = RESCUE_ISSUES.find((i) => i.id === issueId);
  if (!issue) return null;

  const today = new Date();
  const activatedAt = today.toISOString();

  let suspendedWateringUntil: string | undefined = undefined;
  if (issue.suspendedWateringDays > 0) {
    const resumeDate = new Date(today);
    resumeDate.setDate(resumeDate.getDate() + issue.suspendedWateringDays);
    suspendedWateringUntil = resumeDate.toISOString().split('T')[0];
  }

  const initialCompletedSteps: Record<number, boolean> = {};

  return {
    active: true,
    issueId: issue.id,
    issueTitle: issue.title,
    issueIcon: issue.icon,
    imageUrl: issue.imageUrl,
    symptomBadge: issue.symptomBadge,
    category: issue.category,
    activatedAt,
    suspendedWateringUntil,
    suspendedWateringDays: issue.suspendedWateringDays,
    diagnosis: issue.diagnosis,
    cause: issue.cause,
    immediateAction: issue.immediateAction,
    steps: issue.steps,
    whatToAvoid: issue.whatToAvoid,
    recoveryTimeline: issue.recoveryTimeline,
    completedSteps: initialCompletedSteps,
  };
}

/**
 * Checks whether watering is currently suspended under the active rescue plan
 */
export function isWateringSuspended(plan?: CropRescuePlan): boolean {
  if (!plan || !plan.active) return false;
  if (!plan.suspendedWateringUntil) {
    // If suspendedWateringDays > 0 but no until date, assume active
    return plan.suspendedWateringDays > 0;
  }
  const todayStr = new Date().toISOString().split('T')[0];
  return todayStr <= plan.suspendedWateringUntil;
}

/**
 * Computes how many days remain in the watering suspension
 */
export function getDaysRemainingInSuspension(plan?: CropRescuePlan): number {
  if (!plan || !plan.active || !plan.suspendedWateringUntil) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(plan.suspendedWateringUntil);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
