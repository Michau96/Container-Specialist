import { CropRescuePlan } from '../types';

export interface RescueIssueDefinition {
  id: string;
  title: string;
  title_en: string;
  symptomBadge: string;
  symptomBadge_en: string;
  icon: string;
  imageUrl: string;
  imageAlt: string;
  imageAlt_en: string;
  category: 'water' | 'disease' | 'pest' | 'sun' | 'soil';
  categoryLabel: string;
  categoryLabel_en: string;
  shortSymptom: string;
  shortSymptom_en: string;
  visualCue: string;
  visualCue_en: string;
  diagnosis: string;
  diagnosis_en: string;
  cause: string;
  cause_en: string;
  suspendedWateringDays: number;
  immediateAction: string;
  immediateAction_en: string;
  steps: string[];
  steps_en: string[];
  whatToAvoid: string;
  whatToAvoid_en: string;
  recoveryTimeline: string;
  recoveryTimeline_en: string;
}

export const RESCUE_ISSUES: RescueIssueDefinition[] = [
  {
    id: 'yellow_leaves',
    title: 'Żółte liście',
    title_en: 'Yellow Leaves (Overwatering)',
    symptomBadge: 'Przelanie / Korzenie',
    symptomBadge_en: 'Overwatering / Roots',
    icon: '🍂',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Żółknące dolne liście rośliny z powodu nadmiaru wody i braku tlenu',
    imageAlt_en: 'Yellowing lower leaves of container plant due to waterlogging and lack of oxygen',
    category: 'water',
    categoryLabel: 'Nawadnianie i podłoże',
    categoryLabel_en: 'Watering & Substrate',
    shortSymptom: 'Liście żółkną od dołu, tracą sprężystość, a ziemia w donicy jest stale mokra lub ciężka.',
    shortSymptom_en: 'Leaves yellowing from the bottom up, losing firmness, container soil constantly soggy or heavy.',
    visualCue: 'Dolne liście blakną, stają się miękkie i opadają, ziemia pachnie stęchłym mułem.',
    visualCue_en: 'Lower leaves turning pale yellow, becoming soft and dropping, soil smelling musty and stagnant.',
    diagnosis: 'Zastój wody i niedotlenienie korzeni (przelanie rośliny)',
    diagnosis_en: 'Water stagnation and root oxygen starvation (overwatering)',
    cause: 'Zbyt częste podlewanie donicy bez przeschnięcia wierzchniej warstwy lub brak odpływu w dnie pojemnika. Na balkonie woda z głębi donicy paruje wolniej niż w gruncie.',
    cause_en: 'Watering too frequently without letting the top layer dry out, or clogged drainage holes. In balcony pots, moisture evaporates much slower from deep soil than in open ground.',
    suspendedWateringDays: 4,
    immediateAction: 'Natychmiast wstrzymaj jakiekolwiek podlewanie na min. 4 dni i opróżnij podstawkę.',
    immediateAction_en: 'Immediately halt all watering for at least 4 days and empty the drainage saucer.',
    steps: [
      'Wylej natychmiast całą stojącą wodę z podstawki lub osłonki donicy.',
      'Wstrzymaj podlewanie na 4 dni. Podłoże w strefie korzeniowej musi odzyskać dostęp do tlenu.',
      'Delikatnie wzrusz wierzchnią warstwę ziemi (patyczkiem lub widelcem na głębokość 2-3 cm), aby ułatwić odparowanie wilgoci.',
      'Upewnij się, że otwory drenażowe w dnie donicy nie są zatkane zbitym podłożem.',
      'Jeśli donica stoi w głębokim cieniu i chłodzie, przesuń ją w ciepłe, przewiewne miejsce osłonięte przed deszczem.',
    ],
    steps_en: [
      'Immediately empty all standing water from the saucer or cachepot.',
      'Suspend watering for 4 days. The substrate in the root zone must regain access to oxygen.',
      'Gently aerate the top layer of soil (using a stick or fork to a depth of 2-3 cm) to facilitate moisture evaporation.',
      'Ensure drainage holes at the bottom of the pot are not blocked by compacted soil.',
      'If the pot is sitting in deep shade and cold wind, move it to a warm, airy spot sheltered from rain.',
    ],
    whatToAvoid: 'Pod żadnym pozorem nie podlewaj "z przyzwyczajenia" ani nie podawaj żadnych nawozów mineralnych, dopóki bryła nie przeschnie.',
    whatToAvoid_en: 'Under no circumstances water out of habit or apply any mineral fertilizers until the root ball dries out.',
    recoveryTimeline: 'Zatrzymanie żółknięcia w ciągu 3-5 dni. Zżółknięte liście nie zzielenią się ponownie – oberwij je po 2 dniach.',
    recoveryTimeline_en: 'Yellowing halts within 3-5 days. Leaves that have already yellowed will not turn green again – trim them after 2 days.',
  },
  {
    id: 'white_mildew',
    title: 'Biały nalot (Mączniak)',
    title_en: 'White Coating (Powdery Mildew)',
    symptomBadge: 'Infekcja grzybowa',
    symptomBadge_en: 'Fungal Infection',
    icon: '⚪',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Biały nalot mączystego grzyba na liściach rośliny',
    imageAlt_en: 'White powdery fungal coating on plant leaves',
    category: 'disease',
    categoryLabel: 'Choroby grzybowe',
    categoryLabel_en: 'Fungal Diseases',
    shortSymptom: 'Biały, mączysty nalot na wierzchniej stronie liści przypominający rozsypaną mąkę.',
    shortSymptom_en: 'White, powdery coating on the upper surface of leaves resembling spilled flour.',
    visualCue: 'Puder na liściach, z czasem liście brązowieją, marszczą się i usychają.',
    visualCue_en: 'Powdery dust on leaves; over time leaves brown, curl, and wither.',
    diagnosis: 'Mączniak prawdziwy (infekcja zarodnikowa grzyba)',
    diagnosis_en: 'Powdery mildew (fungal spore infection)',
    cause: 'Częsty problem na balkonach przy dużej różnicy temperatur dzień/noc, podlewaniu po liściach i słabym przewiewie między donicami.',
    cause_en: 'Common issue on balconies caused by wide day/night temperature swings, wetting foliage during watering, and poor airflow between crowded pots.',
    suspendedWateringDays: 2,
    immediateAction: 'Wytnij najbardziej porażone liście i wykonaj ekologiczny oprysk z sody lub mleka.',
    immediateAction_en: 'Prune heavily infected leaves and apply an organic baking soda or milk spray.',
    steps: [
      'Odetnij nożyczkami najbardziej pokryte białym nalotem liście i wyrzuć do śmietnika (nie na kompost!).',
      'Wstrzymaj podlewanie z góry i nie zraszaj liści wodą przez 2 dni.',
      'Przygotuj domowy oprysk przeciwgrzybiczy: 1 łyżeczka sody oczyszczonej + 3 krople szarego mydła w płynie na 1 litr letniej wody (lub woda z mlekiem 4:1).',
      'Opryskaj dokładnie obie strony pozostałych liści i łodygi wieczorem, po zachodzie słońca.',
      'Odsuń donicę od ściany balkonu i sąsiednich roślin, by zapewnić stałą cyrkulację powietrza.',
    ],
    steps_en: [
      'Cut off the leaves most heavily coated with white powder and discard in the trash (do not compost!).',
      'Stop overhead watering and do not mist leaves with water for 2 days.',
      'Prepare a home antifungal spray: 1 teaspoon of baking soda + 3 drops of liquid castile/potassium soap per 1 liter of lukewarm water (or water with milk in a 4:1 ratio).',
      'Thoroughly spray both sides of the remaining leaves and stems in the evening, after sunset.',
      'Move the container away from balcony walls and neighboring plants to ensure constant air circulation.',
    ],
    whatToAvoid: 'Nigdy nie zraszaj liści mgiełką wodną ani nie podlewaj od góry konewką z sitkiem.',
    whatToAvoid_en: 'Never mist leaves with water or water overhead with a sprinkler watering can.',
    recoveryTimeline: 'Zahamowanie rozwoju grzyba w ciągu 24-48 godzin. W razie potrzeby powtórz oprysk sodą po 5 dniach.',
    recoveryTimeline_en: 'Inhibition of fungal growth within 24-48 hours. Repeat baking soda spray after 5 days if needed.',
  },
  {
    id: 'wilted_drooping',
    title: 'Zwiędnięta i oklapnięta',
    title_en: 'Wilted & Drooping Foliage',
    symptomBadge: 'Przesuszenie / Szok termiczny',
    symptomBadge_en: 'Dehydration / Heat Shock',
    icon: '🥀',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Oklapnięte i zwiędnięte pędy rośliny w rozgrzanym słońcem pojemniku',
    imageAlt_en: 'Drooping and wilted plant shoots in a sun-baked container',
    category: 'sun',
    categoryLabel: 'Upał i nasłonecznienie',
    categoryLabel_en: 'Heat & Sun Exposure',
    shortSymptom: 'Wiotkie pędy, liście wiszą bez życia ku dołowi, a ziemia odstaje od ścianek donicy.',
    shortSymptom_en: 'Limp shoots, leaves hanging lifelessly downward, soil pulling away from the container edges.',
    visualCue: 'Roślina całkowicie oklapła w upalny dzień, donica jest niezwykle lekka przy podniesieniu.',
    visualCue_en: 'Plant completely collapsed on a hot day, pot feels unusually light when lifted.',
    diagnosis: 'Ostry deficyt wody w korzeniach i przegrzanie pojemnika',
    diagnosis_en: 'Acute water deficit in root ball and container overheating',
    cause: 'Nagrzanie ciemnych ścianek donicy przez słońce oraz silny, suchy wiatr balkonowy, który gwałtownie wysuszył bryłę korzeniową.',
    cause_en: 'Overheating of dark pot walls by intense sun combined with strong, dry balcony wind that rapidly desiccated the root zone.',
    suspendedWateringDays: 0,
    immediateAction: 'Natychmiast przestaw w głęboki cień i nawodnij bryłę korzeniową powolną metodą podsiąkową.',
    immediateAction_en: 'Immediately move to deep shade and rehydrate the root ball using slow bottom sub-irrigation.',
    steps: [
      'Natychmiast zdejmij donicę z bezpośredniego słońca i postaw w cieniu balkonu lub w chłodnym pomieszczeniu.',
      'Nie wlewaj lodowatej wody na suchą ziemię z góry – spłynie szczelinami przy brzegu donicy bez nawodnienia środka.',
      'Wstaw donicę do miski lub głębokiej podstawki z letnią, odstaną wodą na 20-30 minut, aby ziemia napiła się od dołu.',
      'Gdy wierzchnia warstwa ziemi stanie się wilgotna, wyjmij donicę i pozwól nadmiarowi wody swobodnie odcieknąć.',
      'Pozostaw roślinę w cieniu przez 24 godziny, aż odzyska turgor w łodygach.',
    ],
    steps_en: [
      'Immediately take the pot out of direct sunlight and place it in the shade or in a cool room.',
      'Do not pour ice-cold water onto bone-dry soil from above – it will run down edge gaps without penetrating the center.',
      'Place the pot in a basin or deep tray filled with lukewarm, settled water for 20-30 minutes so the soil absorbs water from below.',
      'Once the top layer of soil becomes moist, remove the pot and let excess water drain freely.',
      'Keep the plant in the shade for 24 hours until full turgor returns to the stems.',
    ],
    whatToAvoid: 'Nie wystawiaj oklapniętej rośliny na słońce tuż po podlaniu – wilgotne korzenie w rozgrzanej ziemi ulegną ugotowaniu.',
    whatToAvoid_en: 'Do not expose the wilted plant back to direct sun immediately after watering – moist roots in overheated soil will cook.',
    recoveryTimeline: 'Powrót sprężystości łodyg i uniesienie liści następuje zwykle po 3-8 godzinach w chłodzie.',
    recoveryTimeline_en: 'Restoration of stem elasticity and leaf lift usually occurs within 3-8 hours in cool shade.',
  },
  {
    id: 'spider_mites',
    title: 'Pajęczynki i plamki (Przędziorki)',
    title_en: 'Webbing & Stippling (Spider Mites)',
    symptomBadge: 'Szkodniki balkonowe',
    symptomBadge_en: 'Balcony Pests',
    icon: '🕸️',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Delikatne pajęczynki i plamkowate przebarwienia na spodzie liści',
    imageAlt_en: 'Fine webbing and speckled discoloration on the underside of leaves',
    category: 'pest',
    categoryLabel: 'Szkodniki i owady',
    categoryLabel_en: 'Pests & Insects',
    shortSymptom: 'Mikroskopijne pajęczynki pod spodem liści i drobne, mozaikowe żółte nakłucia na blaszce.',
    shortSymptom_en: 'Fine microscopic webbing on leaf undersides and tiny, mosaic yellow puncture marks on foliage.',
    visualCue: 'Cieniutka pajęczynka w kątach liści, żółknące kropkowane liście, pylisty spód liścia.',
    visualCue_en: 'Wispy cobwebs in leaf axils, yellowing stippled leaves, dusty underside of leaves.',
    diagnosis: 'Inwazja przędziorków chmielowców lub szklarniowych',
    diagnosis_en: 'Spider mite infestation (two-spotted or greenhouse spider mites)',
    cause: 'Gorące, suche i stojące powietrze na balkonie (zwłaszcza od strony południowej i zachodniej). Przędziorki błyskawicznie kolonizują osłabione rośliny.',
    cause_en: 'Hot, dry, and stagnant air on the balcony (especially on south and west exposures). Spider mites multiply rapidly on stressed plants.',
    suspendedWateringDays: 1,
    immediateAction: 'Odizoluj donicę, zrób prysznic od spodu liści i zastosuj oprysk z oleju lub szarego mydła.',
    immediateAction_en: 'Isolate the pot, rinse leaf undersides with a shower stream, and apply an organic oil or soap spray.',
    steps: [
      'Odsuń zaatakowaną donicę od innych upraw, by szkodnik nie przeskoczył na sąsiednie rośliny.',
      'Zabezpiecz donicę folią i zmyj spód liści silnym, letnim strumieniem prysznica (przędziorki giną w wilgoci).',
      'Przygotuj oprysk olejowy: 1 łyżka oleju rzepakowego/lnianego + pół łyżeczki szarego mydła w płynie na 1L ciepłej wody.',
      'Dokładnie spryskaj spód wszystkich liści i kąty pędów – emulsja olejowa odcina roztoczom dostęp tlenu.',
      'Zwiększ wilgotność wokół donicy, ustawiając w pobliżu płaski pojemnik z wodą.',
    ],
    steps_en: [
      'Move the affected pot away from other crops so pests do not spread to neighboring plants.',
      'Cover the soil with plastic foil and rinse leaf undersides with a firm stream of lukewarm water (spider mites perish in high humidity).',
      'Prepare an oil spray: 1 tablespoon of vegetable/canola oil + half a teaspoon of liquid potassium soap per 1 liter of warm water.',
      'Thoroughly spray the underside of all leaves and shoot junctions – the oil emulsion cuts off oxygen to the mites.',
      'Increase humidity around the pot by placing a flat container of water nearby.',
    ],
    whatToAvoid: 'Nie wykonuj oprysków olejowych w pełnym słońcu, aby nie poparzyć delikatnej tkanki liścia.',
    whatToAvoid_en: 'Do not apply oil sprays in direct sunlight to avoid burning delicate leaf tissue.',
    recoveryTimeline: 'Zniszczenie dorosłych osobników w ciągu 2 dni. Za 4-5 dni powtórz zabieg, by zlikwidować wyklute larwy.',
    recoveryTimeline_en: 'Elimination of adult mites within 2 days. Repeat the treatment in 4-5 days to eradicate newly hatched larvae.',
  },
  {
    id: 'aphids',
    title: 'Mszyce i lepka rosa',
    title_en: 'Aphids & Sticky Honeydew',
    symptomBadge: 'Szkodniki na pędach',
    symptomBadge_en: 'Shoot Pests',
    icon: '🐛',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Zielone i czarne mszyce oblepiające młode pędy rośliny',
    imageAlt_en: 'Green and black aphids clustering on tender young plant shoots',
    category: 'pest',
    categoryLabel: 'Szkodniki i owady',
    categoryLabel_en: 'Pests & Insects',
    shortSymptom: 'Kolonie małych zielonych, czarnych lub szarych robaczków na młodych pędach i pąkach.',
    shortSymptom_en: 'Clusters of small green, black, or gray insects on tender young shoots and buds.',
    visualCue: 'Lepkie liście ("spadź"), zdeformowane wierzchołki wzrostu, skupiska owadów.',
    visualCue_en: 'Sticky leaves ("honeydew"), curled growth tips, clusters of small sap-sucking insects.',
    diagnosis: 'Żerowanie kolonii mszyc wysysających soki roślinne',
    diagnosis_en: 'Feeding colonies of aphids extracting plant sap',
    cause: 'Mszyce przylatują na balkon z wiatrem lub z pobliskich drzew miejskich i natychmiast oblepiają młode, soczyste przyrosty.',
    cause_en: 'Aphids are carried to balconies by wind currents or from nearby urban trees and quickly colonize tender, succulent growth.',
    suspendedWateringDays: 1,
    immediateAction: 'Mechanicznie zmyj kolonie mszyc i zastosuj wywar z czosnku lub roztwór mydła potasowego.',
    immediateAction_en: 'Mechanically wash off aphid clusters and apply a garlic infusion or potassium soap solution.',
    steps: [
      'Wilgotnym wacikiem lub ręcznikiem papierowym zgnieć i usuń największe widoczne skupiska mszyc.',
      'Spłucz wierzchołki pędów mocnym strumieniem letniej wody.',
      'Zrób naturalny oprysk czosnkowy: rozgnieć 3 ząbki czosnku w 1 litrze wody, odstaw na 3 godziny, przecedź przez sitko.',
      'Opryskaj obficie pąki, wierzchołki łodyg oraz spody liści.',
      'W razie potrzeby posadź obok aksamitkę lub lawendę, których zapach działa odstraszająco.',
    ],
    steps_en: [
      'Using a damp cotton pad or paper towel, gently crush and remove the largest visible clusters of aphids.',
      'Rinse shoot tips with a gentle jet of lukewarm water.',
      'Make a natural garlic spray: crush 3 garlic cloves in 1 liter of water, let sit for 3 hours, then strain through a sieve.',
      'Generously spray flower buds, stem tips, and the undersides of leaves.',
      'If helpful, plant marigolds or lavender nearby, as their scent acts as a natural deterrent.',
    ],
    whatToAvoid: 'Unikaj chemicznych insektycydów o długim okresie karencji, jeśli to roślina jadalna (zioła, truskawki, pomidory).',
    whatToAvoid_en: 'Avoid synthetic chemical insecticides with long withholding periods on edible crops (herbs, strawberries, tomatoes).',
    recoveryTimeline: 'Zabieg mechaniczny i czosnek dają natychmiastowy spadek populacji. Kontrola za 3 dni.',
    recoveryTimeline_en: 'Mechanical wiping and garlic spray cause an immediate population drop. Re-inspect in 3 days.',
  },
  {
    id: 'sunburn_scorched',
    title: 'Poparzenia i spalone brzegi',
    title_en: 'Sunburn & Scorched Leaf Edges',
    symptomBadge: 'Poparzenie słoneczne',
    symptomBadge_en: 'Sun Scorch',
    icon: '☀️',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Wypalone plamy i suche brzegi liści wystawionych na silne nasłonecznienie',
    imageAlt_en: 'Bleached patches and dry crispy edges on sun-exposed leaves',
    category: 'sun',
    categoryLabel: 'Upał i nasłonecznienie',
    categoryLabel_en: 'Heat & Sun Exposure',
    shortSymptom: 'Brązowe, suche, pergaminowe plamy na liściach lub podwinięte, chrupiące krawędzie.',
    shortSymptom_en: 'Brown, dry, paper-like patches on leaves or curled, crispy leaf margins.',
    visualCue: 'Jasnobrązowe plamy na najwyższych liściach wystawionych na południe, liście wyglądają na "usmażone".',
    visualCue_en: 'Light brown bleached patches on top leaves facing south, foliage looks "fried".',
    diagnosis: 'Poparzenie słoneczne tkanki liściowej lub nagrzanie bryły korzeniowej',
    diagnosis_en: 'Sunburn of leaf tissue or container root zone overheating',
    cause: 'Krople wody działające jak soczewki w południowym słońcu, nagłe wystawienie rozsady bez hartowania lub temperatura donicy przekraczająca 38°C.',
    cause_en: 'Water droplets acting as lenses in harsh midday sun, sudden unhardened exposure to intense rays, or pot temperature exceeding 38°C.',
    suspendedWateringDays: 2,
    immediateAction: 'Zapewnij natychmiastowe cieniowanie i podlewaj wyłącznie wczesnym rankiem lub po zmroku.',
    immediateAction_en: 'Provide immediate shade and water strictly in the early morning or after dusk.',
    steps: [
      'Zapewnij natychmiastowe rozproszenie światła: załóż jasną agrowłókninę cieniującą lub przesuń donicę za barierkę balkonu w godzinach 11:00-15:30.',
      'Zabezpiecz donicę: owiń ciemny plastik jasną szmatką lub tekturą, by odizolować korzenie od nagrzewania.',
      'Nie obrywaj od razu wszystkich poparzonych liści – zielone części nadal produkują cukry dla rośliny. Usuń tylko całkowicie spalone.',
      'Zawieś nawożenie mineralne na 10 dni – roślina w stresie termicznym nie przyswaja soli nawozowych.',
      'Podlewaj wyłącznie do ziemi, bardzo wczesnym rankiem lub po zmroku.',
    ],
    steps_en: [
      'Provide immediate light diffusion: place lightweight shading fabric or slide the pot behind the balcony railing between 11:00 and 15:30.',
      'Insulate the container: wrap dark plastic pots in light burlap or cardboard to protect roots from overheating.',
      'Do not tear off all scorched leaves at once – green sections continue producing energy for the plant. Only remove fully dead leaves.',
      'Suspend mineral fertilizer for 10 days – heat-stressed roots cannot absorb chemical salts.',
      'Water strictly into the soil, either very early in the morning or well after sunset.',
    ],
    whatToAvoid: 'Nigdy nie podlewaj liści ani nie zraszaj rośliny, gdy świeci na nią ostre słońce.',
    whatToAvoid_en: 'Never spray or mist foliage while harsh direct sun is shining on the plant.',
    recoveryTimeline: 'Wypuszczenie nowych, zahartowanych liści w ciągu 7-10 dni.',
    recoveryTimeline_en: 'Emergence of new, sun-hardened leaves within 7-10 days.',
  },
  {
    id: 'fungal_gnats',
    title: 'Pleśń na ziemi lub muszki',
    title_en: 'Soil Mold or Fungus Gnats',
    symptomBadge: 'Choroba podłoża',
    symptomBadge_en: 'Substrate Problem',
    icon: '🪰',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80',
    imageAlt: 'Wilgotna ziemia z białym osadem grzybni i ziemiórkami',
    imageAlt_en: 'Moist soil with white fungal coating and small fungus gnats',
    category: 'soil',
    categoryLabel: 'Podłoże i korzenie',
    categoryLabel_en: 'Soil & Root Zone',
    shortSymptom: 'Biały kożuch pleśni na wierzchu ziemi lub małe czarne muszki wylatujące po dotknięciu donicy.',
    shortSymptom_en: 'White fuzzy mold coating on top of soil or tiny black gnats flying up when touching the pot.',
    visualCue: 'Biały nalot na podłożu, mikroskopijne czarne muszki (ziemiórki) biegające po wilgotnej ziemi.',
    visualCue_en: 'White film on substrate surface, tiny black gnats scurrying across moist soil.',
    diagnosis: 'Ziemiórki lub pleśń podłoża z powodu braku przewiewu i ciągłej wilgoci',
    diagnosis_en: 'Fungus gnats or soil mold caused by stagnant airflow and continuous dampness',
    cause: 'Ziemia o słabym drenażu, zbyt częste powierzchniowe podlewanie i chłodne noce sprzyjające rozwojowi grzybni saprotroficznej.',
    cause_en: 'Poorly draining soil, frequent shallow surface watering, and chilly damp nights promoting saprophytic fungal growth.',
    suspendedWateringDays: 5,
    immediateAction: 'Zdejmij wierzchnią warstwę pleśni, posyp ziemię cynamonem i przesusz podłoże na 5 dni.',
    immediateAction_en: 'Scrape off surface mold, dust soil with ground cinnamon, and dry out substrate for 5 days.',
    steps: [
      'Zdejmij łyżką wierzchnią warstwę ziemi z nalotem (ok. 1-2 cm) i wyrzuć.',
      'Wstrzymaj podlewanie na 5 dni – wierzchnia warstwa gleby MUSI przeschnąć na głębokość 3-4 cm (to zabija larwy i jaja ziemiórek).',
      'Posyp powierzchnię podłoża mielonym cynamonem – to naturalny, silny fungicyd bezpieczny dla roślin jadalnych.',
      'Wbij w donicę żółty lep na owady (dostępny w marketach ogrodniczych), aby wyłapać latające muszki.',
      'W przyszłości podlewaj roślinę rzadziej, a obficiej, pozwalając wierzchniej warstwie dobrze przeschnąć.',
    ],
    steps_en: [
      'Use a spoon to scrape away the top layer of moldy soil (about 1-2 cm) and discard.',
      'Halt watering for 5 days – the top 3-4 cm of soil MUST dry out (this kills gnat eggs and larvae).',
      'Dust the surface with ground cinnamon – a potent natural fungicide safe for edible crops.',
      'Insert a yellow sticky trap into the pot to catch flying adult gnats.',
      'In the future, water less frequently but more deeply, letting the topsoil dry out between waterings.',
    ],
    whatToAvoid: 'Nie podlewaj "po kropelce" codziennie – to idealne środowisko lęgowe dla larw ziemiórek.',
    whatToAvoid_en: 'Do not trickle small amounts of water daily – it creates the perfect breeding nursery for gnat larvae.',
    recoveryTimeline: 'Zniknięcie pleśni w ciągu 48h dzięki cynamonowi. Wymarcie pokolenia ziemiórek: 5-7 dni.',
    recoveryTimeline_en: 'Surface mold vanishes within 48h from cinnamon. Gnat generation die-off within 5-7 days.',
  },
];

/**
 * Returns a localized issue definition based on active language ('pl' or 'en')
 */
export function getLocalizedRescueIssue(
  issue: RescueIssueDefinition,
  language: 'pl' | 'en' = 'pl'
): RescueIssueDefinition {
  if (language === 'en') {
    return {
      ...issue,
      title: issue.title_en || issue.title,
      symptomBadge: issue.symptomBadge_en || issue.symptomBadge,
      imageAlt: issue.imageAlt_en || issue.imageAlt,
      categoryLabel: issue.categoryLabel_en || issue.categoryLabel,
      shortSymptom: issue.shortSymptom_en || issue.shortSymptom,
      visualCue: issue.visualCue_en || issue.visualCue,
      diagnosis: issue.diagnosis_en || issue.diagnosis,
      cause: issue.cause_en || issue.cause,
      immediateAction: issue.immediateAction_en || issue.immediateAction,
      steps: issue.steps_en || issue.steps,
      whatToAvoid: issue.whatToAvoid_en || issue.whatToAvoid,
      recoveryTimeline: issue.recoveryTimeline_en || issue.recoveryTimeline,
    };
  }
  return issue;
}

/**
 * Returns a localized active CropRescuePlan so that whether created in Polish or English,
 * it always renders in the user's currently selected language!
 */
export function getLocalizedRescuePlan(
  plan?: CropRescuePlan,
  language: 'pl' | 'en' = 'pl'
): CropRescuePlan | undefined {
  if (!plan) return undefined;
  const issue = RESCUE_ISSUES.find(
    (i) =>
      (plan.issueId && i.id === plan.issueId) ||
      i.title === plan.issueTitle ||
      i.title_en === plan.issueTitle ||
      (plan.issueIcon && i.icon === plan.issueIcon)
  );
  if (!issue) return plan;

  const loc = getLocalizedRescueIssue(issue, language);
  return {
    ...plan,
    issueId: loc.id,
    issueTitle: loc.title,
    symptomBadge: loc.symptomBadge,
    diagnosis: loc.diagnosis,
    cause: loc.cause,
    immediateAction: loc.immediateAction,
    steps: loc.steps,
    whatToAvoid: loc.whatToAvoid,
    recoveryTimeline: loc.recoveryTimeline,
  };
}

/**
 * Generates an active CropRescuePlan for a given issue
 */
export function createRescuePlan(
  issueId: string,
  customPlantName?: string,
  language: 'pl' | 'en' = 'pl'
): CropRescuePlan | null {
  const issue = RESCUE_ISSUES.find((i) => i.id === issueId);
  if (!issue) return null;

  const localized = getLocalizedRescueIssue(issue, language);
  const today = new Date();
  const activatedAt = today.toISOString();

  let suspendedWateringUntil: string | undefined = undefined;
  if (localized.suspendedWateringDays > 0) {
    const resumeDate = new Date(today);
    resumeDate.setDate(resumeDate.getDate() + localized.suspendedWateringDays);
    suspendedWateringUntil = resumeDate.toISOString().split('T')[0];
  }

  const initialCompletedSteps: Record<number, boolean> = {};

  return {
    active: true,
    issueId: localized.id,
    issueTitle: localized.title,
    issueIcon: localized.icon,
    imageUrl: localized.imageUrl,
    symptomBadge: localized.symptomBadge,
    category: localized.category,
    activatedAt,
    suspendedWateringUntil,
    suspendedWateringDays: localized.suspendedWateringDays,
    diagnosis: localized.diagnosis,
    cause: localized.cause,
    immediateAction: localized.immediateAction,
    steps: localized.steps,
    whatToAvoid: localized.whatToAvoid,
    recoveryTimeline: localized.recoveryTimeline,
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
