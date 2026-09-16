# -*- coding: utf-8 -*-
"""
Baza wiedzy "Donicowy Specjalista" – uprawa warzyw, owoców, ziół i roślin ozdobnych w donicach na balkonie.
Zawiera schematy warstw podłoża, precyzyjne nawożenie, wytyczne oprysków oraz rozstawy do kalkulatora donic.
"""

PLANTS_DATABASE = [   {   'category': 'Psiankowate',
        'detailed_guide': '\n'
                          '### 1. Wysiew i produkcja rozsady (Marzec)\n'
                          'Wysiewaj nasiona w połowie marca do małych wielodoniczek na słonecznym parapecie domowym w '
                          'temperaturze 20-24°C. Po pojawieniu się 2-3 liści właściwych przepikuj do pojedynczych '
                          'doniczek (0,5L).\n'
                          '\n'
                          '### 2. Hartowanie i sadzenie do donic (Maj)\n'
                          'Od początku maja hartuj rozsadę wystawiając ją na balkon na kilka godzin w ciepłe dni. Na '
                          'stałe do docelowej donicy (min. 10 litrów na jedną roślinę) sadź dopiero po 15 maja (po '
                          "'Zimnej Zośce'). Roślinę posadź głębiej niż rosła w kubku – wypuści dodatkowe korzenie "
                          'przybyszowe.\n'
                          '\n'
                          '### 3. Pielęgnacja na balkonie\n'
                          '- **Podlewanie:** W lipcu i sierpniu podlewaj codziennie wczesnym rankiem lub po zachodzie '
                          'słońca. Nigdy nie polewaj liści (ryzyko zarazy ziemniaczanej!).\n'
                          '- **Podpory:** Choć odmiany są karłowe, pod ciężarem owoców gałązki mogą się uginać – wbij '
                          'bambusowy palik.\n'
                          '- **Usuwanie pędów:** U odmian koktajlowych karłowych (np. Vilma) nie usuwa się wilków, ale '
                          'warto oberwać najniższe żółknące liście stykające się z ziemią.\n'
                          '        ',
        'difficulty': 4,
        'difficulty_label': 'Średnio łatwy (wymaga regularnego podlewania i nawożenia)',
        'fertilizer_guide': {   'frequency': 'Co 7-10 dni od momentu kwitnienia do końca owocowania',
                                'npk_focus': 'Niski azot (N), wysoki potas (K) i fosfor (P) z wapniem (Ca)',
                                'organic_options': [   'Płynny biohumus dżdżownicowy (co 5 dni)',
                                                       'Wyciąg ze skórek bananów (bogaty w potas)',
                                                       'Mączka bazaltowa (bogata w krzemionkę)',
                                                       'Gnojówka z żywokostu'],
                                'warnings': 'Nigdy nie przesadzaj z azotem (np. gnojówka z pokrzywy po zawiązaniu '
                                            'owoców) – spowoduje gigantyczne liście i brak owoców!',
                                'what': 'Nawóz płynny do pomidorów z wysoką zawartością potasu i fosforu oraz '
                                        'mikroskładnikami (magnez, wapń zapobiegający suchej zgniliźnie)'},
        'id': 'pomidor-karlowy',
        'name': 'Pomidor karłowy koktajlowy',
        'nutrition': {   'key_benefits': 'Bogate źródło likopenu – silnego antyoksydantu chroniącego układ krążenia, '
                                         'serce oraz komórki przed starzeniem.',
                         'minerals': 'Potas, magnez, fosfor, mangan',
                         'tags': ['Likopen', 'Witamina C', 'Potas', 'Zdrowe serce'],
                         'vitamins': 'Witamina C, A, K, B6, kwas foliowy'},
        'orientations': ['S', 'SW', 'SE', 'W'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Otwory w dnie + 3-4 cm keramzytu lub potłuczonej ceramiki',
                   'material': 'Jasne donice z tworzywa lub gliniane (ciemne donice na południu parzą korzenie!)',
                   'min_depth_cm': 25,
                   'min_volume_l': 10,
                   'recommended_volume_l': 15},
        'schedule': {   '03_1': 'rozsada_dom',
                        '03_2': 'rozsada_dom',
                        '04_1': 'rozsada_dom',
                        '04_2': 'hartowanie',
                        '05_1': 'hartowanie',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'pielegnacja',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'koniec_sezonu'},
        'soil': {   'fertilizer': 'Płynny biohumus lub nawóz do pomidorów z wysoką zawartością potasu i fosforu (np. '
                                  'co 10 dni)',
                    'ph': '6.0 - 6.8 (lekko kwaśne do obojętnego)',
                    'structure': 'Przepuszczalna, z dodatkiem 20% perlitu dla retencji wilgoci',
                    'type': 'Podłoże do warzyw o wysokiej zawartości próchnicy lub ziemia kompostowa'},
        'soil_layers': {   'drainage_cm': 4,
                           'drainage_material': 'Keramzyt ogrodniczy (frakcja 10-16 mm) lub potłuczona ceramika',
                           'mulch_layer': '2 cm drobnej kory przekompostowanej lub słomki (chroni przed parowaniem '
                                          'wody)',
                           'ph_range': '6.0 - 6.8 (lekko kwaśne do obojętnego)',
                           'separator_recommended': True,
                           'substrate_mix': '60% żyzna ziemia warzywna/kompostowa, 25% perlit (napowietrzenie), 15% '
                                            'dojrzały biohumus dżdżownicowy',
                           'top_margin_cm': 3},
        'sources': [   'Działkowiec: Uprawa pomidorów w pojemnikach',
                       'PoradnikOgrodniczy.pl: Pomidory na balkonie odmiany i uprawa'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 5,
                             'planting_method': 'Sadź sadzonkę głęboko – aż po pierwsze liście właściwe; łodyga '
                                                'wypuści mocne korzenie przybyszowe.',
                             'spacing_cm': 30,
                             'supports_needed': 'Palik bambusowy 60-80 cm lub podwiązanie sznurkiem do '
                                                'sufitu/balustrady'},
        'spray_guide': {   'apply_label': 'Zalecana profilaktyka ekologiczna (drożdże / skrzyp)',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': [   'Roztwór mydła potasowego z czosnkiem (20g/L) – natychmiast po '
                                               'zauważeniu pierwszych mszyc na młodych pędach.',
                                               'W razie zaawansowanej zarazy ziemniaczanej: preparat miedziowy (np. '
                                               'Miedzian 50 WP) z zachowaniem 7-dniowej karencji.'],
                           'preventive': [   'Oprysk z drożdży piekarskich: 100g świeżych drożdży na 0.5L mleka i 10L '
                                             'letniej wody – pryskaj całe krzaczki co 7-10 dni przeciw zarazie '
                                             'ziemniaczanej i szarej pleśni.',
                                             'Wyciąg ze skrzypu polnego: krzemionka naturalnie wzmacnia naskórek liści '
                                             'przed wnikaniem zarodników grzybów.'],
                           'safety_note': 'Pryskaj wyłącznie po zachodzie słońca lub w pochmurny dzień. Nigdy nie '
                                          'polewaj liści w południe – krople działają jak soczewki!'},
        'summary': 'Niekwestionowany król balkonu. Odmiany samokończące (karłowe) nie wymagają ogławiania ani '
                   'skomplikowanego cięcia, a owocują obficie aż do jesieni.',
        'sun_preference': 'Słońce (min. 6-8 godzin dziennie)',
        'top_varieties': [   {   'badge': 'Super karłowa (do 30 cm)',
                                 'name': 'Vilma',
                                 'reason': 'Sztywnołodygowa roślina nie wymaga podpór ani ogławiania; idealna do '
                                           'małych donic 5-7L.'},
                             {   'badge': 'Bardzo wczesna i plenna',
                                 'name': 'Maskotka',
                                 'reason': 'Lekko przewieszający się pokrój, słodkie, soczyste owoce o cienkiej '
                                           'skórce, owocuje do przymrozków.'},
                             {   'badge': 'Do 700 owoców z krzaka',
                                 'name': 'Bajaja',
                                 'reason': 'Ekstremalnie plenna odmiana czeska o kaskadowych kiściach drobnych, '
                                           'cukierkowych pomidorków.'},
                             {   'badge': 'Zwisająca do koszy',
                                 'name': 'Tumbling Tom Red',
                                 'reason': 'Stworzona do wiszących amplii i skrzynek na balustradzie; pędy kaskadowo '
                                           'opadają w dół.'},
                             {   'badge': 'Odporna na zarazę',
                                 'name': 'Koralik',
                                 'reason': 'Polska sprawdzona odmiana o wysokiej tolerancji na chłody i zarazę '
                                           'ziemniaczaną.'}],
        'varieties': ['Vilma', 'Maskotka', 'Bajaja', 'Tumbling Tom Red', 'Koralik'],
        'wind_tolerance': 'Średnia (krzaczasty pokrój jest odporniejszy niż wysokie odmiany)'},
    {   'category': 'Psiankowate',
        'detailed_guide': '\n'
                          '### 1. Wczesny wysiew (Luty - Marzec)\n'
                          'Papryka ma długi okres wegetacji. Nasiona wysiewaj już w lutym lub na początku marca. Do '
                          'kiełkowania potrzebuje wysokiej temperatury (22-26°C).\n'
                          '\n'
                          '### 2. Uprawa w donicy\n'
                          'Zadowala się stosunkowo niewielką donicą (5-7 litrów). Gdy roślina osiągnie 15-20 cm '
                          'wysokości, warto uszczknąć pierwszy pąk kwiatowy na rozwidleniu pędu (tzw. kwiat królewski) '
                          '– dzięki temu krzaczek silnie się rozkrzewi i wyda kilkadziesiąt owoców zamiast kilku.\n'
                          '\n'
                          '### 3. Zimowanie\n'
                          'Papryki chili są bylinami! Jesienią możesz przenieść doniczkę na parapet w mieszkaniu, '
                          'przyciąć pędy i przezimować roślinę na kolejny rok.\n'
                          '        ',
        'difficulty': 3,
        'difficulty_label': 'Łatwa (wyjątkowo dobrze radzi sobie w donicach)',
        'fertilizer_guide': {   'frequency': 'Co 10-14 dni od momentu pojawienia się pąków kwiatowych',
                                'npk_focus': 'Zrównoważone NPK na początku, w fazie owocowania dominacja potasu (K)',
                                'organic_options': [   'Biohumus',
                                                       'Mączka rogowa lub bazaltowa',
                                                       'Nawóz ze skórek bananowych',
                                                       'Herbatka kompostowa'],
                                'warnings': 'Zbyt obfite podlewanie nawozem azotowym powoduje zrzucanie kwiatów.',
                                'what': 'Nawóz do papryk i pomidorów z mikroelementami oraz potasem wpływającym na '
                                        'wybarwianie i ostrość owoców'},
        'id': 'papryka-chili',
        'name': 'Papryka ostra / Chili w doniczce',
        'nutrition': {   'key_benefits': 'Kapsaicyna pobudza metabolizm i termogenezę, a potężna dawka witaminy C '
                                         'radykalnie podnosi odporność.',
                         'minerals': 'Kapsaicyna, potas, żelazo, miedź',
                         'tags': ['Kapsaicyna', 'Mega Wit. C', 'Metabolizm', 'Odporność'],
                         'vitamins': 'Witamina C (rekordowa dawka!), A, B6, E'},
        'orientations': ['S', 'SW'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': "Bardzo istotny – chili nie toleruje 'mokrych stóp'. Keramzyt 3 cm.",
                   'material': 'Donice ceramiczne lub terakota – doskonale akumulują ciepło słoneczne',
                   'min_depth_cm': 20,
                   'min_volume_l': 5,
                   'recommended_volume_l': 7},
        'schedule': {   '02_1': 'rozsada_dom',
                        '02_2': 'rozsada_dom',
                        '03_1': 'rozsada_dom',
                        '03_2': 'rozsada_dom',
                        '04_1': 'rozsada_dom',
                        '04_2': 'hartowanie',
                        '05_1': 'hartowanie',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'pielegnacja',
                        '07_1': 'pielegnacja',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'zimowanie_dom'},
        'soil': {   'fertilizer': 'Nawóz organiczny do papryk i pomidorów co 14 dni',
                    'ph': '6.0 - 6.5',
                    'structure': 'Bardzo lekka, przewiewna (dodatek perlitu lub piasku)',
                    'type': 'Żyzne podłoże warzywne z dodatkiem kompostu'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Gruby keramzyt lub żwir płukany (papryka nie znosi zalewania)',
                           'mulch_layer': 'Keramzyt drobny lub jasny żwirek na wierzchu (odbija słońce i trzyma '
                                          'ciepło)',
                           'ph_range': '6.0 - 6.5',
                           'separator_recommended': True,
                           'substrate_mix': '65% ziemia warzywna z kompostem, 25% perlit lub drobny wermikulit, 10% '
                                            'biohumus',
                           'top_margin_cm': 2.5},
        'sources': ['Murator Ogród: Papryka chili na balkonie', 'Zielone Pogotowie: Jak uprawiać ostre papryczki'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 3,
                             'planting_method': 'Sadź na tej samej głębokości co w doniczce rozsadowej.',
                             'spacing_cm': 25,
                             'supports_needed': 'Cienki palik bambusowy 40-50 cm dla odmian obciążonych owocami'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie mszyc lub przędziorków',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': [   'Emulsja z oleju rzepakowego/neem i mydła szarego (1 łyżka oleju + 1 '
                                               'łyżeczka mydła na 1L wody) – skutecznie dusi mszyce i przędziorki bez '
                                               'chemii.',
                                               'Preparat Emulpar 940 EC (naturalny olej rydzowy).'],
                           'preventive': [   'Regularne wietrzenie i nieprzegęszczanie roślin.',
                                             'Profilaktyczny oprysk wywarem z łusek cebuli lub czosnku (działa '
                                             'bakteriobójczo i grzybobójczo).'],
                           'safety_note': 'Papryka chili rzadko choruje na choroby grzybowe, głównym wrogiem w upałach '
                                          'są przędziorki.'},
        'summary': 'Idealna roślina na gorący, południowy balkon. Kocha skwar, ma zwarte krzaczki i wspaniały '
                   'dekoracyjny wygląd owoców przebarwiających się z zieleni na czerwień.',
        'sun_preference': 'Pełne, gorące słońce (>7h dziennie)',
        'top_varieties': [   {   'badge': 'Średnio ostra i mięsista',
                                 'name': 'Jalapeño',
                                 'reason': 'Grube, chrupiące ścianki, doskonała do marynowania i faszerowania serkiem '
                                           'na ciepłym balkonie.'},
                             {   'badge': 'Klasyczna ostra',
                                 'name': 'Cayenne',
                                 'reason': 'Długie, czerwone strąki, wyjątkowo obfite owocowanie w małych pojemnikach '
                                           '5-7L.'},
                             {   'badge': 'Ekstremalna ostrość',
                                 'name': 'Habanero Orange',
                                 'reason': 'Egzotyczny owocowy aromat i potężna ostrość; uwielbia nagrzane południowe '
                                           'ściany.'},
                             {   'badge': 'Wysoce dekoracyjna',
                                 'name': 'Piri Piri',
                                 'reason': 'Kompaktowy krzaczek ze sterczącymi do góry, jaskrawymi owocami; idealna na '
                                           'parapet zewnętrzny.'},
                             {   'badge': 'Hiszpańska papryka tapas',
                                 'name': 'Padron',
                                 'reason': 'Łagodna przy zbiorze na zielono, tradycyjnie smażona na oliwie z solą '
                                           'morską.'}],
        'varieties': ['Jalapeño', 'Cayenne', 'Habanero Orange', 'Piri Piri', 'Padron'],
        'wind_tolerance': 'Wysoka (sztywne, zdrewniałe pędy)'},
    {   'category': 'Kapustowate',
        'detailed_guide': '\n'
                          '### 1. Terminy siewu – zasada chłodu\n'
                          'Rzodkiewka to roślina krótkiego dnia i chłodnej aury. Wysiewaj ją:\n'
                          '- **Wiosna:** od połowy marca (znosi przymrozki do -3°C) do końca kwietnia.\n'
                          '- **Jesień:** od połowy sierpnia do końca września.\n'
                          '*W czerwcu i lipcu nie siej rzodkiewki* – pod wpływem długiego dnia i upałów od razu '
                          'zakwitnie i zdrewnieje.\n'
                          '\n'
                          '### 2. Siew w skrzynce\n'
                          'Rób rowki głębokości ok. 1-1.5 cm w odstępach co 8-10 cm. Nasiona wysiewaj co 3-4 cm. Jeśli '
                          'wzejdą zbyt gęsto, bezzwłocznie wykonaj przerywkę, inaczej rzodkiewki nie wykształcą '
                          'okrągłych zgrubień.\n'
                          '\n'
                          '### 3. Wilgotność podłoża\n'
                          'Gleba w skrzynce musi być stale umiarkowanie wilgotna. Przesuszenie powoduje, że rzodkiewka '
                          'staje się piekąca i parcieje, a nagłe zalanie po suszy powoduje pękanie korzeni.\n'
                          '        ',
        'difficulty': 1,
        'difficulty_label': 'Bardzo łatwa (rekordowo szybki zbiór już po 25-30 dniach)',
        'fertilizer_guide': {   'frequency': 'Brak nawożenia – ewentualnie symboliczny biohumus raz w 3. tygodniu',
                                'npk_focus': 'Zakaz nawozów azotowych (powodują parcenia, kumulację azotanów i same '
                                             'liście)',
                                'organic_options': [   'Wyłącznie naturalna żyzność podłoża startowego lub dojrzały '
                                                       'kompost'],
                                'warnings': 'Nawiezienie nawozem sztucznym zniszczy smak rzodkiewki i zniekształci '
                                            'korzonki!',
                                'what': 'Ziemia świeża NIE WYMAGA żadnego nawożenia! Rzodkiewka rośnie zaledwie 25-30 '
                                        'dni.'},
        'id': 'rzodkiewka',
        'name': 'Rzodkiewka balkonowa',
        'nutrition': {   'key_benefits': 'Naturalne związki siarki wzmacniają włosy, skórę i paznokcie, wspomagają '
                                         'trawienie i pracę wątroby.',
                         'minerals': 'Związki siarki, potas, wapń, magnez, glukozynolany',
                         'tags': ['Siarka organiczna', 'Włosy i paznokcie', 'Witamina C', 'Trawienie'],
                         'vitamins': 'Witamina C, witaminy z grupy B, kwas foliowy'},
        'orientations': ['E', 'SE', 'W', 'S'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Wystarczą standardowe skrzynki balkonowe z otworami odpływowymi',
                   'material': 'Klasyczne podłużne skrzynki balkonowe 40-60 cm',
                   'min_depth_cm': 15,
                   'min_volume_l': 3,
                   'recommended_volume_l': 5},
        'schedule': {   '03_1': 'siew_donica',
                        '03_2': 'siew_donica',
                        '04_1': 'zbior',
                        '04_2': 'zbior',
                        '05_1': 'zbior',
                        '08_2': 'siew_donica',
                        '09_1': 'siew_donica',
                        '09_2': 'zbior',
                        '10_1': 'zbior'},
        'soil': {   'fertilizer': 'Nie wymaga silnego nawożenia! Nadmiar azotu prowadzi do bujnych liści i sparciałych '
                                  'zgrubień',
                    'ph': '6.5 - 7.0',
                    'structure': 'Piaszczysto-próchniczna, wolna od kamyków i grudek',
                    'type': 'Uniwersalna ziemia ogrodnicza do warzyw'},
        'soil_layers': {   'drainage_cm': 2,
                           'drainage_material': 'Warstwa keramzytu 2 cm na dnie skrzynki',
                           'mulch_layer': 'Brak ściółki – siewki potrzebują swobodnego dostępu światła',
                           'ph_range': '6.5 - 7.0',
                           'separator_recommended': False,
                           'substrate_mix': '75% uniwersalna ziemia ogrodnicza, 15% piasek rzeczny, 10% perlit (lekka '
                                            'i pulchna)',
                           'top_margin_cm': 2},
        'sources': [   'PoradnikOgrodniczy.pl: Uprawa rzodkiewki w skrzynkach',
                       'Działkowiec: Warzywa wczesnowiosenne w donicach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 12,
                             'max_plants_per_standard_box_60cm': 15,
                             'planting_depth_cm': 1,
                             'planting_method': 'Rowki co 8-10 cm, nasiona co 3-4 cm; konieczna przerywka po wzejściu.',
                             'spacing_cm': 4,
                             'supports_needed': 'Brak – niska roślina rozetkowa'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (błyskawiczny 25-dniowy cykl)',
                           'apply_sprays': 'zbedne',
                           'intervention': [   'W razie pchełek dziurawiących liście: oprószenie liści popiołem '
                                               'drzewnym lub mączką bazaltową.',
                                               'Nakrycie skrzynki białą agrowłókniną wiosenną.'],
                           'preventive': [   'Wczesny siew w marcu i kwietniu – pchełki ziemne jeszcze wtedy nie '
                                             'żerują.',
                                             'Utrzymywanie stałej wilgoci podłoża (sucha ziemia przyciąga pchełki).'],
                           'safety_note': 'Nigdy nie stosuj oprysków chemicznych na warzywa o tak krótkim okresie '
                                          'wegetacji!'},
        'summary': 'Najlepsze warzywo na start i przedplon/poplon. Sieje się ją od marca do maja, a potem od połowy '
                   'sierpnia do września. W środku lata wybija w pędy kwiatowe przez upały.',
        'sun_preference': 'Słońce łagodne lub półcień (4-6 godzin)',
        'top_varieties': [   {   'badge': 'Błyskawiczny zbiór (25 dni)',
                                 'name': 'Carmen',
                                 'reason': 'Kuliste, karminowe zgrubienia, nie wykazuje skłonności do parcenia przy '
                                           'regularnym podlewaniu.'},
                             {   'badge': 'Biało-czerwona',
                                 'name': 'Krakowianka',
                                 'reason': 'Piękna dwubarwna skórka, soczysty i łagodny miąższ, krótka nać '
                                           'nieprzesłaniająca skrzynki.'},
                             {   'badge': 'Niezawodny klasyk',
                                 'name': 'Saxa 2',
                                 'reason': 'Znakomita do płytkich korytek (12-15 cm), idealna na pierwszy '
                                           'wczesnowiosenny siew w marcu.'},
                             {   'badge': 'Podłużna paluszkowa',
                                 'name': 'Opolanka',
                                 'reason': 'Bardzo delikatny, orzeźwiający smak bez ostrej goryczki, doskonała dla '
                                           'dzieci.'},
                             {   'badge': 'Żółta czeska odmiana',
                                 'name': 'Zlata',
                                 'reason': 'Nietypowy złocisto-żółty kolor, wyjątkowa odporność na wybijanie w pędy '
                                           'kwiatowe.'}],
        'varieties': ['Carmen', 'Krakowianka', 'Saxa 2', 'Opolanka', 'Zlata (żółta)'],
        'wind_tolerance': 'Bardzo wysoka (niska roślina)'},
    {   'category': 'Astrowate',
        'detailed_guide': '\n'
                          "### 1. Zbiór sukcesywny ('Cut and come again')\n"
                          'Nie wyrywaj całej rośliny z korzeniem! Zrywaj 3-4 największe liście zewnętrzne, a środek '
                          '(serduszko) zostaw nienaruszone – roślina będzie produkować nowe liście niemal codziennie.\n'
                          '\n'
                          '### 2. Ekspozycja – unikaj skwaru\n'
                          'Na balkonach południowych w pełnym słońcu liście sałaty natychmiast stają się gorzkie, '
                          'więdną, a roślina wystrzela w pęd kwiatostanowy. Dlatego wschodni lub północno-wschodni '
                          'balkon to dla niej raj.\n'
                          '\n'
                          '### 3. Podlewanie\n'
                          'Podlewaj delikatnie dookoła rośliny, unikając lania wody w sam środek rozety, co mogłoby '
                          'wywołać szarą pleśń.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (zbiór liść po liściu przez cały sezon)',
        'fertilizer_guide': {   'frequency': 'Raz na 2 tygodnie małą dawką',
                                'npk_focus': 'Umiarkowany azot organiczny, unikać nawozów mineralnych',
                                'organic_options': [   'Płynny biohumus (1 nakrętka na litr)',
                                                       'Rozcieńczona herbatka kompostowa'],
                                'warnings': 'Sałata gwałtownie kumuluje azotany z nawozów sztucznych – na balkonie '
                                            'stosuj wyłącznie biohumus!',
                                'what': 'Bardzo delikatne nawożenie organiczne – wyłącznie biohumus lub nawóz z alg '
                                        'morskich'},
        'id': 'salata-listkowa',
        'name': 'Sałata liściowa i rzymska mini',
        'nutrition': {   'key_benefits': 'Wysoka zawartość luteiny i zeaksantyny chroni siatkówkę oka przed zmęczeniem '
                                         'ekranowym, a witamina K wspiera kości.',
                         'minerals': 'Luteina, zeaksantyna, żelazo, potas',
                         'tags': ['Luteina (wzrok)', 'Witamina K', 'Kwas foliowy', 'Niskokaloryczna'],
                         'vitamins': 'Witamina A (beta-karoten), K, C, kwas foliowy'},
        'orientations': ['E', 'NE', 'NW', 'W'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Drenaż z keramzytu 2-3 cm, otwory w skrzynce',
                   'material': 'Zwykłe korytka balkonowe lub misy',
                   'min_depth_cm': 15,
                   'min_volume_l': 3,
                   'recommended_volume_l': 6},
        'schedule': {   '03_2': 'rozsada_dom',
                        '04_1': 'siew_donica',
                        '04_2': 'siew_donica',
                        '05_1': 'zbior',
                        '05_2': 'zbior',
                        '06_1': 'zbior',
                        '08_2': 'siew_donica',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'zbior'},
        'soil': {   'fertilizer': 'Umiarkowane nawożenie biohumusem. Unikać nawozów mineralnych z azotem (odkładanie '
                                  'azotanów w liściach).',
                    'ph': '6.2 - 6.8',
                    'structure': 'Utrzymująca wilgoć, pulchna',
                    'type': 'Lekka ziemia do ziół i warzyw'},
        'soil_layers': {   'drainage_cm': 2.5,
                           'drainage_material': 'Keramzyt ogrodniczy 2-3 cm',
                           'mulch_layer': 'Cienka warstwa perlitu (zapobiega brudzeniu liści błotem przy podlewaniu)',
                           'ph_range': '6.2 - 6.8',
                           'separator_recommended': False,
                           'substrate_mix': '70% lekka ziemia ogrodnicza, 20% perlit, 10% kompost',
                           'top_margin_cm': 2},
        'sources': ['Murator Ogród: Sałata z balkonu przez cały sezon', 'Twojogrodnik.pl: Uprawa sałat w pojemnikach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 3,
                             'max_plants_per_standard_box_60cm': 4,
                             'planting_depth_cm': 0.5,
                             'planting_method': 'Płytki siew nasion; nie przysypywać grubą ziemią, nasiona sałaty '
                                                'potrzebują światła do kiełkowania.',
                             'spacing_cm': 15,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (zbiór liści na bieżąco do kanapek)',
                           'apply_sprays': 'zbedne',
                           'intervention': [   'Przy ataku mszyc: zmycie silnym strumieniem wody lub oprysk mydłem '
                                               'szarym (10g/L), liście dokładnie myć przed spożyciem.'],
                           'preventive': [   'Podlewanie bezpośrednio do ziemi, nie mocząc rozety (zapobiega szarej '
                                             'pleśni).',
                                             'Zachowanie odstępów dla cyrkulacji powietrza.'],
                           'safety_note': 'Ze względu na bezpośrednie spożywanie liści na surowo, jakiekolwiek opryski '
                                          'chemiczne są wykluczone.'},
        'summary': 'Niezastąpiona na balkonach wschodnich i północnych! Odmiany liściowe (cięte) nie tworzą twardych '
                   'główek, dzięki czemu obrywasz zewnętrzne świeże liście na kanapki przez wiele tygodni.',
        'sun_preference': 'Półcień lub łagodne słońce (3-5 godzin)',
        'top_varieties': [   {   'badge': 'Cięta liść po liściu',
                                 'name': 'Lollo Bionda',
                                 'reason': 'Mocno fryzowana jasnozielona sałata; odrywasz zewnętrzne liście na kanapki '
                                           'przez 2 miesiące.'},
                             {   'badge': 'Antocyjanowa bordowa',
                                 'name': 'Lollo Rossa',
                                 'reason': 'Ciemnorubinowe karbowane brzegi, wysoka zawartość przeciwutleniaczy, '
                                           'piękny kontrast w skrzynce.'},
                             {   'badge': 'Odporna na upały',
                                 'name': 'Salad Bowl',
                                 'reason': 'Dębolistna struktura, najpóźniej ze wszystkich odmian wybija w pędy '
                                           'kwiatowe w ciepłe dni.'},
                             {   'badge': 'Miniatura rzymska',
                                 'name': 'Little Gem',
                                 'reason': 'Tworzy zwarte, chrupiące główki wielkości dłoni o słodkawym smaku, zajmuje '
                                           'minimalną przestrzeń.'},
                             {   'badge': 'Wczesna masłowa',
                                 'name': 'Królowa Majowych',
                                 'reason': 'Bardzo maślana konsystencja, świetna do wczesnowiosennej uprawy w kwietniu '
                                           'i maju.'}],
        'varieties': [   'Lollo Bionda',
                         'Lollo Rossa',
                         'Salad Bowl (Dębolistna)',
                         'Little Gem (mini rzymska)',
                         'Królowa Majowych'],
        'wind_tolerance': 'Średnia (dobrze radzi sobie w skrzynkach zawieszonych od wewnątrz)'},
    {   'category': 'Szarłatowate',
        'detailed_guide': '\n'
                          '### 1. Wczesna i późna uprawa\n'
                          'Szpinak to roślina krótkiego dnia. W długie letnie dni kwitnie, dlatego siejemy go w dwóch '
                          'rzutach:\n'
                          '- **Wiosenny:** od marca do połowy kwietnia.\n'
                          "- **Jesienno-zimowy:** od połowy sierpnia do końca września. Odmiana 'Olbrzym Zimowy' "
                          'przetrwa na balkonie pod lekkim przykryciem agrowłókniną nawet mroźną zimę!\n'
                          '\n'
                          '### 2. Pielęgnacja\n'
                          'Głębokość siewu 2 cm, odstępy 5-7 cm. Wymaga stałej wilgoci, sucha ziemia natychmiast '
                          'przyspiesza kwitnienie. Zbieraj młode listki (baby spinach) już po 4-5 tygodniach.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (wytrzymuje przymrozki do -6°C)',
        'fertilizer_guide': {   'frequency': 'Jednorazowo biohumus w fazie 4 liści',
                                'npk_focus': 'Organiczny kompost, zero chemicznego azotu',
                                'organic_options': ['Dojrzały kompost', 'Biohumus'],
                                'warnings': 'Nadmiar azotu prowadzi do odkładania szczawianów i azotanów w blaszkach '
                                            'liściowych.',
                                'what': 'Ziemia przed siewem powinna być zasobna w kompost. W trakcie uprawy zbędne '
                                        'dodatkowe nawożenie.'},
        'id': 'szpinak-balkonowy',
        'name': 'Szpinak zwyczajny i zimowy',
        'nutrition': {   'key_benefits': 'Królewskie źródło żelaza i kwasu foliowego – zapobiega anemii, regeneruje '
                                         'układ krwionośny i dodaje sił witalnych.',
                         'minerals': 'Żelazo, magnez, wapń, potas',
                         'tags': ['Żelazo', 'Kwas foliowy', 'Witamina K', 'Magnez'],
                         'vitamins': 'Witamina K, A (karoteny), C, kwas foliowy'},
        'orientations': ['E', 'N', 'NW', 'NE'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Drenaż z keramzytu lub perlitu na dnie',
                   'material': 'Skrzynki balkonowe lub płaskie misy uprawowe',
                   'min_depth_cm': 15,
                   'min_volume_l': 4,
                   'recommended_volume_l': 8},
        'schedule': {   '03_1': 'siew_donica',
                        '03_2': 'siew_donica',
                        '04_1': 'zbior',
                        '04_2': 'zbior',
                        '05_1': 'zbior',
                        '08_2': 'siew_donica',
                        '09_1': 'siew_donica',
                        '09_2': 'zbior',
                        '10_1': 'zbior',
                        '10_2': 'zbior',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Kompost organiczny przed siewem',
                    'ph': '6.5 - 7.0 (szpinak nie lubi gleb kwaśnych!)',
                    'structure': 'Zwięzła, ale przepuszczalna',
                    'type': 'Żyzna, próchnicza ziemia ogrodowa'},
        'soil_layers': {   'drainage_cm': 2,
                           'drainage_material': 'Drobny keramzyt lub perlit gruby',
                           'mulch_layer': 'Brak lub cienki perlit',
                           'ph_range': '6.5 - 7.0 (szpinak nie znosi gleb kwaśnych!)',
                           'separator_recommended': False,
                           'substrate_mix': '75% żyzne podłoże próchnicze, 15% perlit, 10% kompost dojrzały',
                           'top_margin_cm': 2},
        'sources': [   'Działkowiec: Szpinak w doniczkach na balkonie',
                       'PoradnikOgrodniczy.pl: Uprawa szpinaku w skrzynkach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 6,
                             'max_plants_per_standard_box_60cm': 8,
                             'planting_depth_cm': 1.5,
                             'planting_method': 'Rowki co 12 cm, nasiona co 6-8 cm.',
                             'spacing_cm': 8,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (rośnie w chłodnych porach roku)',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Usuwanie ewentualnych pożółkłych dolnych liści.'],
                           'preventive': [   'Uprawa w terminie marzec-kwiecień lub sierpień-październik eliminuje '
                                             'większość chorób i szkodników.'],
                           'safety_note': 'Brak potrzeby stosowania oprysków.'},
        'summary': 'Doskonały wybór na chłodniejsze miesiące oraz na mniej nasłonecznione balkony. Nadaje się do siewu '
                   'wczesną wiosną (marzec) oraz późnym latem (sierpień/wrzesień) na zbiór jesienny i zimowy.',
        'sun_preference': 'Półcień, toleruje zacienienie (3-4h słońca)',
        'top_varieties': [   {   'badge': 'Niezawodny klasyk',
                                 'name': 'Matador',
                                 'reason': 'Ciemnozielone, grube liście o wysokiej zawartości żelaza; wyśmienity do '
                                           'siewu wiosennego i jesiennego.'},
                             {   'badge': 'Tolerancja na mączniaka',
                                 'name': 'Asta F1',
                                 'reason': 'Hybryda o gładkich liściach i podwyższonej odporności na choroby grzybowe '
                                           'w gęstych skrzynkach.'},
                             {   'badge': 'Pełna mrozoodporność',
                                 'name': 'Olbrzym Zimowy',
                                 'reason': 'Siany we wrześniu zimuje w donicy na balkonie i daje pierwszy zielony '
                                           'zbiór w marcu.'},
                             {   'badge': 'Młode listki (baby spinach)',
                                 'name': 'Butterfly',
                                 'reason': 'Wyjątkowo kruchy i maślany, zbierany po 3 tygodniach prosto do sałatek.'},
                             {   'badge': 'Szybkorosnący',
                                 'name': 'Kite F1',
                                 'reason': 'Równomierny wzrost i wzniesiony pokrój zapobiegający zabrudzeniu liści '
                                           'ziemią podczas podlewania.'}],
        'varieties': ['Matador', 'Asta F1', 'Olbrzym Zimowy', 'Butterfly', 'Kite F1'],
        'wind_tolerance': 'Wysoka'},
    {   'category': 'Bobowate',
        'detailed_guide': '\n'
                          '### 1. Termin siewu – czekaj na ciepło (po 15 maja)\n'
                          'Fasola jest bardzo wrażliwa na chłód. Nasiona wsiane do zimnej ziemi (<12°C) po prostu '
                          'zgniją. Wysiewaj wprost do donicy po 15 maja, umieszczając nasiona gniazdowo (po 2-3 '
                          'sztuki) na głębokości 3 cm.\n'
                          '\n'
                          '### 2. Podlewanie w fazie kwitnienia\n'
                          'Najważniejszy moment to kwitnienie i zawiązywanie strąków (lipiec). Wtedy roślina nie może '
                          'mieć ani chwili suszy, w przeciwnym razie zrzuci kwiaty.\n'
                          '\n'
                          '### 3. Zbiór\n'
                          'Zrywaj strąki regularnie co 2-3 dni, zanim nasiona wewnątrz wyraźnie napęcznieją. Regularny '
                          'zbiór pobudza roślinę do wytwarzania kolejnych partii kwiatów i strąków.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (wzbogaca ziemię w azot, nie wymaga podpór)',
        'fertilizer_guide': {   'frequency': 'Raz na 2 tygodnie w okresie kwitnienia i wiązania strąków',
                                'npk_focus': 'Wysoki fosfor (P) i potas (K), ZAKAZ azotu (N)',
                                'organic_options': [   'Mączka bazaltowa',
                                                       'Nawóz ze skórek bananów',
                                                       'Popiół drzewny (szczypta)'],
                                'warnings': 'Zasilenie fasoli azotem sprawi, że nie wykształci brodawek korzeniowych i '
                                            'zrzuci kwiaty!',
                                'what': 'Nawóz fosforowo-potasowy bez azotu (bakterie brodawkowe na korzeniach wiążą '
                                        'azot z powietrza)'},
        'id': 'fasola-karlowa',
        'name': 'Fasola szparagowa karłowa',
        'nutrition': {   'key_benefits': 'Wspaniałe źródło błonnika stabilizującego poziom glukozy oraz krzemu '
                                         'wspierającego elastyczność stawów i ścięgien.',
                         'minerals': 'Białko roślinne, błonnik, krzem, potas',
                         'tags': ['Białko roślinne', 'Błonnik', 'Krzem (stawy)', 'Niski indeks IG'],
                         'vitamins': 'Witamina C, K, B1 (tiamina), kwas foliowy'},
        'orientations': ['S', 'SW', 'W', 'SE'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Warstwa drenażowa 3 cm',
                   'material': 'Głębokie donice okrągłe lub szerokie skrzynki',
                   'min_depth_cm': 20,
                   'min_volume_l': 7,
                   'recommended_volume_l': 10},
        'schedule': {   '05_2': 'siew_donica',
                        '06_1': 'siew_donica',
                        '06_2': 'pielegnacja',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior'},
        'soil': {   'fertilizer': 'Fasola wiąże azot z powietrza za pomocą bakterii brodawkowych – nie wymaga '
                                  'nawożenia azotowego!',
                    'ph': '6.5 - 7.0',
                    'structure': 'Średnio zwięzła, dobrze napowietrzona',
                    'type': 'Ciepła, próchniczna ziemia ogrodnicza'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt 3 cm na dnie donicy',
                           'mulch_layer': 'Drobna kora lub słomka zapobiegająca parowaniu',
                           'ph_range': '6.5 - 7.0',
                           'separator_recommended': True,
                           'substrate_mix': '70% ciepła ziemia ogrodnicza, 20% perlit, 10% piasek rzeczny',
                           'top_margin_cm': 3},
        'sources': [   'Działkowiec: Fasola karłowa w uprawie doniczkowej',
                       'Zielone Pogotowie: Warzywa strączkowe na balkonie'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 3,
                             'max_plants_per_standard_box_60cm': 4,
                             'planting_depth_cm': 3,
                             'planting_method': 'Siew gniazdowy po 2-3 nasiona do dołka co 15 cm po 15 maja.',
                             'spacing_cm': 15,
                             'supports_needed': 'Brak (odmiany karłowe mają sztywne pędy 35 cm)'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie mszycy burakowej',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': [   'Oprysk mydłem potasowym z wyciągiem z czosnku w przypadku pojawienia '
                                               'się czarnych mszyc na wierzchołkach.'],
                           'preventive': ['Oprysk wyciągiem ze skrzypu wzmacniający tkanki przed antraknozą fasoli.'],
                           'safety_note': 'Pryskaj wczesnym rankiem lub wieczorem.'},
        'summary': 'Świetne warzywo dla niecierpliwych ogrodników. Odmiany karłowe dorastają do 35-40 cm i nie '
                   'potrzebują kłopotliwych wysokich tyczek. Kwitnie ślicznymi kwiatami i rodzi chrupiące strąki.',
        'sun_preference': 'Ciepłe słońce (min. 5-6 godzin)',
        'top_varieties': [   {   'badge': 'Bezwłóknista żółta',
                                 'name': 'Złota Saxa',
                                 'reason': 'Klasyczna polska karłowa szparagówka (35 cm); rodzi obficie bez żadnych '
                                           'podpór.'},
                             {   'badge': 'Cieniutka zielona (filet)',
                                 'name': 'Ferrari',
                                 'reason': 'Francuski typ delikatesowy, długie, chrupiące strąki o maślanym smaku.'},
                             {   'badge': 'Purpurowa ozdobna',
                                 'name': 'Purple Teepee',
                                 'reason': 'Strąki rosną ponad liśćmi (nie chowią się w krzaku); podczas gotowania '
                                           'zmieniają kolor na szmaragdowy.'},
                             {   'badge': 'Wczesna i soczysta',
                                 'name': 'Dior',
                                 'reason': 'Krótki okres wegetacji (ok. 55 dni), odporna na antraknozę i bakteriozę.'},
                             {   'badge': 'Stworzona do donic',
                                 'name': 'Mascotte',
                                 'reason': 'Specjalna odmiana pojemnikowa o zwartym pokroju, nagrodzona złotym medalem '
                                           'Fleuroselect.'}],
        'varieties': ['Złota Saxa', 'Ferrari', 'Purple Teepee', 'Dior', 'Mascotte'],
        'wind_tolerance': 'Dobra (odmiany karłowe mają krępe, niskie pędy do 35-40 cm)'},
    {   'category': 'Dyniowate',
        'detailed_guide': '\n'
                          '### 1. Prowadzenie w pionie (trejaż / kratka)\n'
                          'Aby zaoszczędzić miejsce na balkonie, poprowadź pędy ogórka w pionie po kratce, sznurkach '
                          'przywiązanych do sufitu loggii lub barierce. Pędy wspinające się mają lepszy dostęp do '
                          'światła, a owoce nie dotykają mokrej ziemi, co zapobiega gniciu.\n'
                          '\n'
                          '### 2. Złota zasada podlewania: letnia woda\n'
                          'Ogórki mają płytki system korzeniowy i nienawidzą zimnej wody prosto z kranu – może to '
                          'wywołać szok termiczny, opadanie zawiązków oraz gorzknienie owoców. Zawsze używaj odstanej, '
                          'letniej wody.\n'
                          '\n'
                          '### 3. Ochrona przed wiatrem\n'
                          'Na piętrach 4+ ogórki należy sadzić w narożnikach loggii lub za osłoną balustrady. Silny '
                          'wiatr łamie wiotkie pędy i wysusza wielkie liście.\n'
                          '        ',
        'difficulty': 6,
        'difficulty_label': 'Średnia do wymagającej (potrzebuje dużej donicy i ogromnej ilości wody)',
        'fertilizer_guide': {   'frequency': 'Co 7 dni przez cały okres owocowania',
                                'npk_focus': 'Wysoki potas (K) dla słodkiego smaku i jędrności, umiarkowany azot',
                                'organic_options': [   'Gnojówka z pokrzywy (do momentu kwitnienia)',
                                                       'Biohumus w podwójnej dawce',
                                                       'Wywar ze skórek bananów',
                                                       'Mączka bazaltowa'],
                                'warnings': 'Podlewaj zawsze letnią wodą – zimna woda z kranu powoduje gorzknienie '
                                            'ogórków i opadanie zawiązków!',
                                'what': 'Intensywne zasilanie nawozem potasowym z mikroskładnikami (ogórek to roślina '
                                        'żarłoczna)'},
        'id': 'ogorek-krzaczasty',
        'name': 'Ogórek krzaczasty / pnący na kratce',
        'nutrition': {   'key_benefits': 'Doskonałe nawodnienie na poziomie komórkowym, odkwaszanie organizmu oraz '
                                         'krzemionka poprawiająca sprężystość cery.',
                         'minerals': 'Krzemionka, potas, kukurbitacyny, woda komórkowa (96%)',
                         'tags': ['Nawodnienie 96%', 'Krzemionka', 'Potas', 'Detoksykacja'],
                         'vitamins': 'Witamina K, C, witaminy z grupy B'},
        'orientations': ['S', 'SW', 'SE'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Duże otwory odpływowe + solidny drenaż 4-5 cm keramzytu',
                   'material': 'Duże donice z grubymi ściankami lub drewniane skrzynie z folią z otworami',
                   'min_depth_cm': 30,
                   'min_volume_l': 15,
                   'recommended_volume_l': 20},
        'schedule': {   '04_2': 'rozsada_dom',
                        '05_1': 'rozsada_dom',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'pielegnacja',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'koniec_sezonu'},
        'soil': {   'fertilizer': 'Systematyczne zasilanie co tydzień nawozem organicznym (biohumus lub nawóz '
                                  'potasowy)',
                    'ph': '6.5 - 7.0',
                    'structure': 'Ciepła, szybko nagrzewająca się, bogata w materię organiczną',
                    'type': 'Bardzo żyzna ziemia z dużą zawartością próchnicy i dojrzałego kompostu'},
        'soil_layers': {   'drainage_cm': 5,
                           'drainage_material': 'Gruby keramzyt 5 cm (ogórek potrzebuje ogromnych ilości wody, ale '
                                                'nienawidzi zastoju w korzeniach)',
                           'mulch_layer': 'Ściółka ze słomy lub przekompostowanej kory (zapobiega gniciu owoców '
                                          'stykających się z ziemią)',
                           'ph_range': '6.5 - 7.0',
                           'separator_recommended': True,
                           'substrate_mix': '60% żyzna gleba kompostowa, 20% obornik granulowany/biohumus, 20% perlit '
                                            'ogrodniczy',
                           'top_margin_cm': 4},
        'sources': [   'PoradnikOgrodniczy.pl: Uprawa ogórków w donicach na balkonie',
                       'Murator Ogród: Pnące warzywa balkonowe'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 1,
                             'planting_depth_cm': 2,
                             'planting_method': 'Sadź po 15 maja do dużej donicy min. 15-20L.',
                             'spacing_cm': 30,
                             'supports_needed': 'Kratka balkonowa, sznurki do sufitu lub oparcie o balustradę'},
        'spray_guide': {   'apply_label': 'Zalecana profilaktyka przeciw mączniakowi',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': [   'Preparat na bazie lecytyny (np. Lecitec) lub olejek pomarańczowy w '
                                               'razie pierwszych plam mączniaka.'],
                           'preventive': [   'Oprysk roztworem sody oczyszczonej (1 płaska łyżeczka sody + 1L wody + '
                                             'kilka kropel oleju) co 10 dni – zmienia pH na liściach i niszczy '
                                             'zarodniki mączniaka prawdziwego.',
                                             'Oprysk mlekiem z wodą (proporcja 1:5) – kazeina hamuje rozwój grzybów.'],
                           'safety_note': 'Nigdy nie mocz liści podczas podlewania.'},
        'summary': 'Świeży, chrupiący ogórek prosto z balkonu to luksus. Wymaga jednak dużej donicy (min. 15-20L), '
                   'osłonięcia przed porywistym wiatrem oraz regularnego nawadniania letnią wodą.',
        'sun_preference': 'Ciepłe, jasne stanowisko osłonięte od wiatru (min. 6h słońca)',
        'top_varieties': [   {   'badge': 'Samokończący krzaczasty',
                                 'name': 'Dar',
                                 'reason': 'Pędy do 50 cm, nie wymaga podpór ani kratki; rodzi zgrabne ogórki '
                                           'korniszonowe.'},
                             {   'badge': 'Zwarty sałatkowy',
                                 'name': 'Spacemaster 80',
                                 'reason': 'Wyhodowany specjalnie do małych ogrodów i tarasów; bardzo krótkie '
                                           'międzywęźla.'},
                             {   'badge': 'Odporny na mączniaka',
                                 'name': 'Izyd F1',
                                 'reason': 'Wysoka tolerancja na choroby grzybowe, bezpieczny plon nawet podczas '
                                           'deszczowego lata.'},
                             {   'badge': 'Mini ogórek meksykański',
                                 'name': 'Cucamelon',
                                 'reason': 'Owoce jak miniaturowe arbuzy o chrupkim, cytrynowo-ogórkowym smaku; pnącze '
                                           'wspina się po balustradzie.'},
                             {   'badge': 'Balkonowy wspinacz',
                                 'name': 'Patio Snacker F1',
                                 'reason': 'Cienkoskórkowe słodkie ogórki idealne do prowadzenia w pionie po sznurkach '
                                           'loggii.'}],
        'varieties': ['Dar', 'Spacemaster 80', 'Izyd F1', 'Cucamelon', 'Patio Snacker F1'],
        'wind_tolerance': 'Niska (duże, delikatne liście łatwo ulegają poszarpaniu przez silny wiatr na wyższych '
                          'piętrach)'},
    {   'category': 'Czosnkowate',
        'detailed_guide': '\n'
                          '### 1. Całoroczny zbiór\n'
                          'Szczypiorek ścinaj ostrymi nożyczkami na wysokości ok. 2-3 cm nad podłożem. Roślina '
                          'błyskawicznie odrasta.\n'
                          '\n'
                          '### 2. Kwitnienie\n'
                          'Późną wiosną szczypiorek wypuszcza kuliste, fioletowe kwiatostany. Są one w 100% jadalne, '
                          'mają delikatnie czosnkowy posmak i stanowią piękną ozdobę sałatek oraz przyciągają '
                          'pożyteczne owady zapylające.\n'
                          '\n'
                          '### 3. Zimowanie\n'
                          'Doniczka może stać na balkonie przez całą zimę bez żadnego zabezpieczenia (chyba że donica '
                          'jest z kruchej nieszkliwionej ceramiki, która mogłaby pęknąć od zamarzającej wilgoci).\n'
                          '        ',
        'difficulty': 1,
        'difficulty_label': 'Ekstremalnie łatwa (wieloletnia, w pełni mrozoodporna roślina)',
        'fertilizer_guide': {   'frequency': 'Raz na 3-4 tygodnie od kwietnia do sierpnia',
                                'npk_focus': 'Łagodny nawóz organiczny',
                                'organic_options': [   'Biohumus dżdżownicowy',
                                                       'Kompost dosypany na wierzch donicy na wiosnę'],
                                'warnings': 'Nie wymaga intensywnego zasilania.',
                                'what': 'Płynny biohumus raz w miesiącu po mocnym ścięciu'},
        'id': 'szczypiorek-ziola',
        'name': 'Szczypiorek i cebula siedmiolatka',
        'nutrition': {   'key_benefits': 'Naturalny antybiotyk balkonowy – fitoncydy zwalczają bakterie i wirusy, '
                                         'obniżają ciśnienie krwi i poprawiają trawienie.',
                         'minerals': 'Allicyna (fitoncydy), siarka organiczna, żelazo, wapń',
                         'tags': ['Allicyna', 'Naturalny antybiotyk', 'Witamina C', 'Odporność'],
                         'vitamins': 'Witamina C, A, K, kwas foliowy'},
        'orientations': ['S', 'E', 'W', 'N'],
        'plant_group': 'ziola',
        'pot': {   'drainage': 'Drenaż z keramzytu 2 cm',
                   'material': 'Dowolne doniczki ceramiczne, skrzynki lub misy',
                   'min_depth_cm': 15,
                   'min_volume_l': 2,
                   'recommended_volume_l': 4},
        'schedule': {   '03_1': 'zbior',
                        '03_2': 'siew_donica',
                        '04_1': 'zbior',
                        '04_2': 'zbior',
                        '05_1': 'zbior',
                        '06_1': 'zbior',
                        '07_1': 'zbior',
                        '08_1': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Wystarczy jednorazowe zasilenie kompostem lub biohumusem na wiosnę',
                    'ph': '6.0 - 7.0',
                    'structure': 'Umiarkowanie przepuszczalna',
                    'type': 'Standardowa ziemia ogrodowa'},
        'soil_layers': {   'drainage_cm': 2,
                           'drainage_material': 'Keramzyt lub potłuczone gliniane doniczki 2 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 7.0',
                           'separator_recommended': False,
                           'substrate_mix': '80% uniwersalna ziemia ogrodnicza, 20% piasek lub perlit',
                           'top_margin_cm': 2},
        'sources': [   'Działkowiec: Szczypiorek i cebule wieloletnie w donicach',
                       'Zielone Pogotowie: Zioła i zielenina na balkonie'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 4,
                             'max_plants_per_standard_box_60cm': 6,
                             'planting_depth_cm': 1,
                             'planting_method': 'Wysiew kępkowy lub sadzenie kępek cebulek.',
                             'spacing_cm': 10,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (roślina pancerna i fitoncydowa)',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Brak konieczności – roślina wyjątkowo odporna.'],
                           'preventive': ['Naturalne fitoncydy allicynowe same odstraszają większość szkodników.'],
                           'safety_note': 'Ścinaj regularnie, by pobudzać wyrastanie soczystych pędów.'},
        'summary': 'Pancerna roślina balkonowa. Szczypiorek może rosnąć na balkonie w tej samej donicy przez wiele '
                   'lat. Nie marznie zimą, a wczesną wiosną (już w marcu) jako pierwszy wypuszcza soczyście zielone '
                   'rurki.',
        'sun_preference': 'Słońce lub półcień (3-6h)',
        'top_varieties': [   {   'badge': 'Gruby i soczysty',
                                 'name': 'Bohemia',
                                 'reason': 'Szybko rosnąca odmiana o mięsistym szczypiorze, nie drewnieje i zachowuje '
                                           'świeżość.'},
                             {   'badge': 'Błyskawiczny odrost',
                                 'name': 'Wulkan',
                                 'reason': 'Ciemnozielony szczypiorek o silnym wigorze; po ścięciu odrasta w zaledwie '
                                           'kilkanaście dni.'},
                             {   'badge': 'Całoroczna wieloletnia',
                                 'name': 'Siedmiolatka Bajkał',
                                 'reason': 'Nie tworzy główki, lecz pęki grubego szczypioru o delikatnym posmaku '
                                           'cebuli; zimuje w gruncie.'},
                             {   'badge': 'Sztywne grube rurki',
                                 'name': 'Staro',
                                 'reason': 'Szczypior nie łamie się na wietrze na wyższych piętrach balkonu, idealny '
                                           'do mrożenia.'},
                             {   'badge': 'Jadalne fioletowe kwiaty',
                                 'name': 'Forescate',
                                 'reason': 'Wspaniała ozdoba balkonu; kuliste fioletowe kwiaty mają czosnkowy aromat i '
                                           'pasują do sałatek.'}],
        'varieties': ['Bohemia', 'Wulkan', 'Siedmiolatka Bajkał', 'Staro', 'Forescate'],
        'wind_tolerance': 'Bardzo wysoka (doskonale znosi nawet 10. piętro)'},
    {   'category': 'Selerowate',
        'detailed_guide': '\n'
                          '### 1. Siew wprost do pojemnika (brak możliwości pikowania!)\n'
                          'Marchew wytwarza korzeń palowy i nie znosi przesadzania. Nasiona wysiewaj bezpośrednio do '
                          'donicy od końca marca do maja na głębokość 1 cm.\n'
                          '\n'
                          '### 2. Konieczna przerywka\n'
                          'Nasiona marchwi są drobne. Po wykiełkowaniu siewki należy przerwać, pozostawiając odstęp '
                          '4-5 cm między roślinami. Zbyt gęsty siew uniemożliwi wykształcenie kształtnych kuleczek.\n'
                          '\n'
                          '### 3. Zbiór\n'
                          'Okrągłe marchewki są gotowe do chrupania po około 65-75 dniach od siewu. Są niezwykle '
                          'kruche, słodkie i uwielbiane przez dzieci.\n'
                          '        ',
        'difficulty': 3,
        'difficulty_label': 'Łatwa pod warunkiem odpowiedniego podłoża',
        'fertilizer_guide': {   'frequency': 'Co 3 tygodnie małą dawką',
                                'npk_focus': 'Niski azot, wysoki potas (K) i fosfor (P)',
                                'organic_options': [   'Mączka bazaltowa',
                                                       'Biohumus rozcieńczony 1:10',
                                                       'Popiół drzewny w minimalnej dawce'],
                                'warnings': 'Świeży obornik i nadmiar azotu powodują rozwidlanie korzeni (tzw. '
                                            'marchewki wielonogie) i pękanie!',
                                'what': 'Nawóz ze znikomym azotem, bogaty w fosfor i potas (dla prawidłowego rozwoju '
                                        'korzenia)'},
        'id': 'marchew-mini',
        'name': 'Marchew miniaturowa okrągła',
        'nutrition': {   'key_benefits': 'Maksymalna dawka beta-karotenu dba o ostry wzrok po zmroku, regeneruje '
                                         'nabłonki i nadaje skórze zdrowy, złocisty koloryt.',
                         'minerals': 'Biotyna, potas, błonnik rozpuszczalny (pektyny)',
                         'tags': ['Beta-karoten', 'Zdrowy wzrok', 'Witamina A', 'Piękna cera'],
                         'vitamins': 'Beta-karoten (prowitamina A), witamina B6, C, K'},
        'orientations': ['S', 'SW', 'SE', 'E'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Solidny drenaż 3-4 cm keramzytu',
                   'material': 'Głębokie skrzynki balkonowe lub donice wiaderkowe',
                   'min_depth_cm': 20,
                   'min_volume_l': 6,
                   'recommended_volume_l': 10},
        'schedule': {   '03_2': 'siew_donica',
                        '04_1': 'siew_donica',
                        '04_2': 'pielegnacja',
                        '05_1': 'pielegnacja',
                        '06_1': 'zbior',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior'},
        'soil': {   'fertilizer': 'Nawóz ze znikomą ilością azotu, a większą zawartością fosforu i potasu',
                    'ph': '6.0 - 6.8',
                    'structure': 'Pulchna, bez kamieni, grud i świeżego obornika (powodują rozwidlanie korzeni!)',
                    'type': 'Bardzo lekka, piaszczysta ziemia ogrodnicza z domieszką piasku rzecznego (30%)'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt lub żwir płukany 3 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 6.8',
                           'separator_recommended': True,
                           'substrate_mix': '60% lekka ziemia ogrodnicza, 30% przesiany piasek rzeczny, 10% perlit '
                                            '(ziemia musi być całkowicie wolna od kamyków i grudek!)',
                           'top_margin_cm': 2},
        'sources': ['Działkowiec: Nietypowe warzywa korzeniowe na balkonie', 'PoradnikOgrodniczy.pl: Marchew z donicy'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 10,
                             'max_plants_per_standard_box_60cm': 12,
                             'planting_depth_cm': 1,
                             'planting_method': 'Siew wprost do donicy (brak pikowania!), po wschodach przerwij do '
                                                'odstępu 4-5 cm.',
                             'spacing_cm': 5,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne na balkonie',
                           'apply_sprays': 'zbedne',
                           'intervention': ['W razie mszycy na naci: oprysk wyciągiem z czosnku.'],
                           'preventive': [   'Połyśnica marchwianka lata nisko przy ziemi – na balkonach powyżej 1. '
                                             'piętra praktycznie nie występuje.'],
                           'safety_note': 'Płytki siew i konieczna przerywka to klucz do sukcesu.'},
        'summary': "Koniec z mitem, że marchew nie nadaje się na balkon! Odmiana 'Pariser Markt' wytwarza kuliste, "
                   'słodkie marchewki wielkości piłeczki golfowej, które nie potrzebują głębokiej grządki.',
        'sun_preference': 'Słoneczne do lekko półcienistego (min. 5h)',
        'top_varieties': [   {   'badge': 'Okrągła jak piłeczka',
                                 'name': 'Pariser Markt 4',
                                 'reason': 'Historyczna francuska odmiana; korzenie kuliste (3-4 cm) rosną w zaledwie '
                                           '12-15 cm ziemi.'},
                             {   'badge': 'Wczesna i słodka',
                                 'name': 'Rondo',
                                 'reason': 'Szybki zbiór po 65 dniach, chrupiący rdzeń bez goryczki, uwielbiana przez '
                                           'dzieci.'},
                             {   'badge': 'Krótka stożkowa',
                                 'name': 'Caracas F1',
                                 'reason': 'Długość do 10 cm, intensywnie pomarańczowa z wysokim poziomem cukrów i '
                                           'beta-karotenu.'},
                             {   'badge': 'Paluszkowa delikatesowa',
                                 'name': 'Little Finger',
                                 'reason': 'Gładka, drobna marchewka o cieniutkiej skórce bez konieczności skrobania.'},
                             {   'badge': 'Typ baby carrot',
                                 'name': 'Adelaide',
                                 'reason': 'Równomierny wzrost w skrzynkach balkonowych, nie deformuje się w '
                                           'pojemnikach.'}],
        'varieties': ['Pariser Markt 4', 'Rondo', 'Caracas F1', 'Little Finger', 'Adelaide'],
        'wind_tolerance': 'Wysoka (pióropusz liści nie stawia dużego oporu)'},
    {   'category': 'Kapustowate',
        'detailed_guide': '\n'
                          '### 1. Terminy uprawy\n'
                          'Jarmuż można siać w maju/czerwcu, by wysadzić go do donicy w lipcu po wczesnych warzywach '
                          '(np. po rzodkiewkach lub wczesnych sałatach).\n'
                          '\n'
                          '### 2. Zbiór od jesieni do wiosny\n'
                          'Liście obrywaj od dołu łodygi w miarę potrzeb kuchennych przez cały październik, listopad, '
                          'grudzień, a nawet w śnieżny styczeń. Roślina przypomina małą palmę i wygląda spektakularnie '
                          'ośnieżona na balkonie.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (niezwykle mrozoodporny, rośnie zimą)',
        'fertilizer_guide': {   'frequency': 'Co 14 dni w okresie letnim',
                                'npk_focus': 'Zrównoważone NPK z mikroelementami',
                                'organic_options': ['Biohumus', 'Kompost', 'Gnojówka z pokrzywy w fazie wzrostu'],
                                'warnings': 'Od września zaprzestań nawożenia azotem, by roślina przygotowała się do '
                                            'mrozów.',
                                'what': 'Nawóz organiczny wieloskładnikowy z dodatkiem wapnia'},
        'id': 'jarmuz-karlowy',
        'name': 'Jarmuż karłowy kędzierzawy',
        'nutrition': {   'key_benefits': 'Niekwestionowany superfood: sulforafan wykazuje potężne działanie '
                                         'antykancerogenne, a wapń wzmacnia zęby i kości.',
                         'minerals': 'Sulforafan, wapń organiczny, luteina, żelazo',
                         'tags': ['Sulforafan', 'Witamina K & C', 'Roślinny wapń', 'Mega antyoksydant'],
                         'vitamins': 'Witamina K (rekordowe stężenie!), C (więcej niż pomarańcza), A'},
        'orientations': ['E', 'W', 'S', 'SE'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Drenaż keramzytowy 3-4 cm',
                   'material': 'Stabilna, ciężka donica ceramiczna odporna na wiatr',
                   'min_depth_cm': 25,
                   'min_volume_l': 10,
                   'recommended_volume_l': 15},
        'schedule': {   '05_2': 'rozsada_dom',
                        '06_2': 'sadzenie_balkon',
                        '07_1': 'pielegnacja',
                        '08_1': 'pielegnacja',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'zbior',
                        '10_2': 'zbior',
                        '11_1': 'zbior',
                        '11_2': 'zbior',
                        '12_1': 'zbior'},
        'soil': {   'fertilizer': 'Kompost lub nawóz organiczny bogaty w potas',
                    'ph': '6.5 - 7.5 (lubi wyższe pH)',
                    'structure': 'Wilgotna, zwięzła',
                    'type': 'Ciężka, żyzna ziemia bogata w próchnicę'},
        'soil_layers': {   'drainage_cm': 4,
                           'drainage_material': 'Keramzyt 3-4 cm',
                           'mulch_layer': 'Kora sosnowa na zimę',
                           'ph_range': '6.5 - 7.5',
                           'separator_recommended': True,
                           'substrate_mix': '70% żyzna, zwięzła ziemia ogrodowa, 20% kompost, 10% perlit',
                           'top_margin_cm': 3},
        'sources': ['Działkowiec: Jarmuż na balkonie zimą', 'Zielone Pogotowie: Mrozoodporne warzywa doniczkowe'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 3,
                             'planting_method': 'Sadzenie rozsady w czerwcu/lipcu do głębokich donic.',
                             'spacing_cm': 30,
                             'supports_needed': 'Palik stabilizujący przed zimowym wiatrem'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie bielinka lub mączlika',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': [   'Ręczne zbieranie gąsienic lub biologiczny oprysk preparatem z Bacillus '
                                               'thuringiensis (np. Lepinox Plus).'],
                           'preventive': [   'Przykrycie siatką o drobnych oczkach w czerwcu chroni przed bielinkiem '
                                             'kapustnikiem.'],
                           'safety_note': 'Jesienią i zimą roślina jest całkowicie wolna od szkodników.'},
        'summary': 'Zimowy król balkonu. Wytrzymuje mrozy do -15°C! Co ciekawe, po pierwszych przymrozkach zawarta w '
                   'liściach skrobia zamienia się w cukry, dzięki czemu jarmuż staje się wyraźnie słodszy i traci '
                   'goryczkę.',
        'sun_preference': 'Słońce lub półcień (4-6h)',
        'top_varieties': [   {   'badge': 'Super karłowy (40 cm)',
                                 'name': 'Dwarf Green Curled',
                                 'reason': 'Mocno fryzowane, gęste liście o zwartej sylwetce odpornej na porywy '
                                           'wiatru.'},
                             {   'badge': 'Jarmuż palmowy toskański',
                                 'name': 'Nero di Toscana',
                                 'reason': 'Wzniesione, pęcherzykowate, ciemnogranatowe liście; wygląda jak egzotyczna '
                                           'minipalma.'},
                             {   'badge': 'Purpurowy mrozoodporny',
                                 'name': 'Redbor F1',
                                 'reason': 'Głęboki fiolet, który po pierwszych przymrozkach zyskuje wyjątkowo słodki '
                                           'smak.'},
                             {   'badge': 'Kompaktowy plon',
                                 'name': 'Half Tall',
                                 'reason': 'Odporny na śnieg i lód, nie pokłada się pod ciężarem zimowej pokrywy.'},
                             {   'badge': 'Ciemnobordowa ozdoba',
                                 'name': 'Scarlet',
                                 'reason': 'Połączenie wybitnego superfood i spektakularnej ozdoby jesienno-zimowego '
                                           'balkonu.'}],
        'varieties': ['Dwarf Green Curled', 'Nero di Toscana', 'Redbor F1', 'Half Tall', 'Scarlet'],
        'wind_tolerance': 'Bardzo wysoka (grube, mięsiste łodygi)'},
    {   'category': 'Kapustowate',
        'detailed_guide': '\n'
                          '### 1. Siew rzutowy\n'
                          'Siej nasiona płytko (0,5 cm) co 2-3 tygodnie przez cały sezon od kwietnia do września, aby '
                          'mieć nieprzerwany dopływ świeżych liści.\n'
                          '\n'
                          '### 2. Półcień łagodzi smak\n'
                          'Rukola uprawiana w pełnym, piekącym słońcu nabiera bardzo ostrego, niemal pieprzonego '
                          'smaku. Jeśli wolisz łagodniejszy, maślano-orzechowy aromat, postaw skrzynkę w miejscu z '
                          'porannym słońcem (wschód) lub lekkim półcieniem.\n'
                          '        ',
        'difficulty': 1,
        'difficulty_label': 'Banalnie prosta (rośnie jak chwast w niemal każdych warunkach)',
        'fertilizer_guide': {   'frequency': 'Brak nawożenia',
                                'npk_focus': 'Brak',
                                'organic_options': ['Wystarczy żyzność podłoża'],
                                'warnings': 'Nie nawozić nawozami sztucznymi!',
                                'what': 'Świeża ziemia wystarcza na cały krótki cykl wzrostu (20 dni).'},
        'id': 'rukola-balkonowa',
        'name': 'Rukola (rokietta siewna)',
        'nutrition': {   'key_benefits': 'Pikantne glukozynolany stymulują enzymy oczyszczające wątrobę i chronią '
                                         'komórki przed mutacjami nowotworowymi.',
                         'minerals': 'Glukozynolany, izotiocyjaniany, wapń, potas',
                         'tags': ['Glukozynolany', 'Detoks wątroby', 'Witamina K', 'Wapń'],
                         'vitamins': 'Witamina K, A, C, kwas foliowy'},
        'orientations': ['E', 'SE', 'W', 'N'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Wystarczą otwory w dnie skrzynki',
                   'material': 'Standardowe skrzynki balkonowe lub płytkie misy',
                   'min_depth_cm': 12,
                   'min_volume_l': 3,
                   'recommended_volume_l': 5},
        'schedule': {   '04_1': 'siew_donica',
                        '04_2': 'zbior',
                        '05_1': 'zbior',
                        '05_2': 'siew_donica',
                        '06_1': 'zbior',
                        '07_1': 'zbior',
                        '08_1': 'siew_donica',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior'},
        'soil': {   'fertilizer': 'Brak konieczności nawożenia przy świeżej ziemi',
                    'ph': '6.0 - 7.0',
                    'structure': 'Lekka, przepuszczalna',
                    'type': 'Uniwersalna ziemia ogrodnicza z perlitem'},
        'soil_layers': {   'drainage_cm': 2,
                           'drainage_material': 'Keramzyt 2 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 7.0',
                           'separator_recommended': False,
                           'substrate_mix': '80% uniwersalna ziemia ogrodnicza, 20% perlit',
                           'top_margin_cm': 2},
        'sources': ['PoradnikOgrodniczy.pl: Uprawa rukoli w doniczce', 'Murator Ogród: Zielnik balkonowy'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 12,
                             'max_plants_per_standard_box_60cm': 15,
                             'planting_depth_cm': 0.5,
                             'planting_method': 'Płytki siew rzutowy lub rzędowy.',
                             'spacing_cm': 5,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Oprószenie mączką bazaltową w razie dziurkowania liści.'],
                           'preventive': ['Utrzymywanie wilgoci w podłożu odstrasza pchełki.'],
                           'safety_note': 'Zbiór po 20 dniach – zero chemii.'},
        'summary': 'Pikantne, orzechowe liście gotowe do zbioru już po 20 dniach od wysiewu. Odmiana dzika '
                   '(wieloletnia) odrasta w donicy każdego roku!',
        'sun_preference': 'Słońce lub półcień (3-6h)',
        'top_varieties': [   {   'badge': 'Orzechowy aromat',
                                 'name': 'Coltivata',
                                 'reason': 'Szerokie liście o klasycznym, delikatnie pikantnym orzechowym smaku; '
                                           'szybki zbiór.'},
                             {   'badge': 'Głęboko ząbkowana',
                                 'name': 'Grazia',
                                 'reason': 'Późno wybija w pędy kwiatowe, trzyma doskonałą jakość liści nawet podczas '
                                           'cieplejszych dni.'},
                             {   'badge': 'Odrasta co roku',
                                 'name': 'Dzika wieloletnia',
                                 'reason': 'Wieloletnia rokietta (Diplotaxis tenuifolia); zimuje w donicy i odrasta '
                                           'wczesną wiosną.'},
                             {   'badge': 'Super szybki plon (18 dni)',
                                 'name': 'Pronto',
                                 'reason': 'Rekordowo szybkie wschody i zbiór pierwszych listków z parapetu lub '
                                           'balustrady.'},
                             {   'badge': 'Pikantny chrzanowy posmak',
                                 'name': 'Wasabi',
                                 'reason': 'Ostra odmiana o wyrazistym aromacie japońskiego wasabi; genialny dodatek '
                                           'do mięs i serów.'}],
        'varieties': ['Coltivata', 'Grazia', 'Dzika wieloletnia (Diplotaxis)', 'Pronto', 'Wasabi'],
        'wind_tolerance': 'Wysoka'},
    {   'category': 'Kozłkowate',
        'detailed_guide': '\n'
                          '### 1. Zbiór zimowy na balkonie\n'
                          'Roszponka nie boi się śniegu ani mrozów dochodzących do -15°C. W czasie odwilży zimowej po '
                          'prostu wychodzisz na balkon ze scyzorykiem i ścinasz świeże rozetki do sałatki.\n'
                          '\n'
                          '### 2. Wysiew\n'
                          'Siej rzędowo co 10-15 cm na głębokość 1 cm. Dbaj o wilgotność podłoża podczas wschodów w '
                          'ciepłym sierpniu/wrześniu.\n'
                          '        ',
        'difficulty': 1,
        'difficulty_label': 'Bardzo łatwa (genialna roślina późnojesienna i zimowa)',
        'fertilizer_guide': {   'frequency': 'Brak',
                                'npk_focus': 'Brak',
                                'organic_options': ['Kompost przed siewem w sierpniu'],
                                'warnings': 'Nie stosować nawozów azotowych przed zimą.',
                                'what': 'Brak nawożenia – rośnie jesienią i zimą na resztkach składników z lata.'},
        'id': 'roszponka',
        'name': 'Roszponka warzywna',
        'nutrition': {   'key_benefits': 'Zimowe wsparcie odporności i układu nerwowego – wysoki poziom magnezu i '
                                         'witaminy B6 łagodzi stres i zmęczenie.',
                         'minerals': 'Żelazo, magnez, fosfor, cynk',
                         'tags': ['3x więcej Wit. C', 'Żelazo', 'Magnez (stres)', 'Odporność'],
                         'vitamins': 'Witamina C (3-krotnie więcej niż w sałacie), prowitamina A, B6'},
        'orientations': ['N', 'E', 'W', 'NE'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Podstawowy drenaż',
                   'material': 'Płaskie pojemniki, korytka balkonowe',
                   'min_depth_cm': 12,
                   'min_volume_l': 2,
                   'recommended_volume_l': 4},
        'schedule': {   '08_1': 'siew_donica',
                        '08_2': 'siew_donica',
                        '09_1': 'siew_donica',
                        '09_2': 'zbior',
                        '10_1': 'zbior',
                        '10_2': 'zbior',
                        '11_1': 'zbior',
                        '11_2': 'zbior',
                        '12_1': 'zbior'},
        'soil': {   'fertilizer': 'Nie wymaga dodatkowego nawożenia',
                    'ph': '6.0 - 7.2',
                    'structure': 'Umiarkowanie wilgotna, lekka',
                    'type': 'Uniwersalna ziemia ogrodnicza'},
        'soil_layers': {   'drainage_cm': 2,
                           'drainage_material': 'Keramzyt drobny 2 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 7.2',
                           'separator_recommended': False,
                           'substrate_mix': '80% ziemia ogrodnicza, 20% perlit',
                           'top_margin_cm': 2},
        'sources': ['Działkowiec: Zimowe zbiory z balkonu', 'Twojogrodnik.pl: Uprawa roszponki w pojemnikach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 8,
                             'max_plants_per_standard_box_60cm': 10,
                             'planting_depth_cm': 1,
                             'planting_method': 'Rowki co 10 cm, siew w sierpniu/wrześniu.',
                             'spacing_cm': 6,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Brak.'],
                           'preventive': ['Niskie temperatury jesienią naturalnie blokują patogeny.'],
                           'safety_note': 'Zbiór prosto do sałatki, nawet spod śniegu.'},
        'summary': 'Kiedy inne rośliny kończą wegetację, roszponka dopiero zaczyna królować. Wysiewa się ją od '
                   'sierpnia do października, a zielone, soczyste listki zbiera nawet spod śniegu.',
        'sun_preference': 'Półcień lub rozproszone światło (2-5h)',
        'top_varieties': [   {   'badge': 'Ciemnozielona drobna',
                                 'name': 'Verte de Cambrai',
                                 'reason': 'Tradycyjna francuska odmiana o zwartych rozetkach i orzechowym smaku.'},
                             {   'badge': 'Szerokolistna',
                                 'name': 'Holenderska',
                                 'reason': 'Większe liście, wysoka odporność na chłody i zalegający śnieg.'},
                             {   'badge': 'Odporna na pleśń',
                                 'name': 'Favor',
                                 'reason': 'Mocna struktura liści, dobrze znosi jesienne mgły i wahania temperatur.'},
                             {   'badge': 'Błyszczące liście',
                                 'name': 'Gala',
                                 'reason': 'Atrakcyjny wygląd i chrupkość, idealna do wysiewu w sierpniu i wrześniu.'},
                             {   'badge': 'Zimowy zbiór',
                                 'name': 'Vit',
                                 'reason': 'Specjalna selekcja do zbioru pod śniegiem od listopada do lutego.'}],
        'varieties': ['Verte de Cambrai', 'Holenderska', 'Favor', 'Gala', 'Vit'],
        'wind_tolerance': 'Bardzo wysoka (tworzy niziutkie, zwarte rozetki)'},
    {   'category': 'Dyniowate',
        'detailed_guide': '\n'
                          '### 1. Odmiany dedykowane do donic\n'
                          'Tradycyjna cukinia polowa zajmuje 2 metry kwadratowe. Na balkon wybieraj wyłącznie odmiany '
                          "karłowe o zwartym krzaczastym pokroju, np. 'Patio Star F1'.\n"
                          '\n'
                          '### 2. Zapylanie kwiatów na wysokich piętrach\n'
                          'Na 5. piętrze lub wyżej może brakować pszczół i trzmieli. Cukinia tworzy oddzielne kwiaty '
                          'męskie (na cienkich łodyżkach) i żeńskie (z miniaturową cukiereczką u nasady). Gdy kwiaty '
                          'się otworzą, zerwij kwiat męski, usuń płatki i dotknij pręcikiem znamienia kwiatu żeńskiego '
                          '(zapylenie pędzelkiem).\n'
                          '\n'
                          '### 3. Zbiór małych owoców\n'
                          'Zrywaj owoce, gdy mają długość 15-20 cm. Są wtedy najdelikatniejsze, a roślina natychmiast '
                          'zawiązuje kolejne. Jadalne są również wielkie męskie kwiaty (np. smażone w cieście '
                          'naleśnikowym).\n'
                          '        ',
        'difficulty': 5,
        'difficulty_label': 'Umiarkowanie trudna (potrzebuje olbrzymiej donicy min. 25-30L i nawożenia)',
        'fertilizer_guide': {   'frequency': 'Co 7 dni od czerwca do września',
                                'npk_focus': 'Wysoki potas (K) i fosfor (P), wapń przeciw gniciu końcówek',
                                'organic_options': [   'Gnojówka ze skrzypu/pokrzywy',
                                                       'Biohumus w stężeniu podwójnym',
                                                       'Mączka bazaltowa'],
                                'warnings': 'Przesuszenie donicy w czasie zawiązywania owoców powoduje ich żółknięcie '
                                            'i opadanie.',
                                'what': 'Cukinia to żarłok pokarmowy – nawóz płynny potasowy z mikroskładnikami co 7 '
                                        'dni'},
        'id': 'cukinia-balkonowa',
        'name': 'Cukinia miniaturowa / patison',
        'nutrition': {   'key_benefits': 'Wybitnie lekkostrawna, nie kumuluje metali ciężkich, doskonale odkwasza '
                                         'organizm i wspiera prawidłową pracę nerek.',
                         'minerals': 'Potas, magnez, fosfor, błonnik',
                         'tags': ['Lekkostrawna', 'Alkalizująca', 'Potas', 'Niski indeks IG'],
                         'vitamins': 'Witamina C, B1, B2, B6, kwas foliowy'},
        'orientations': ['S', 'SW', 'SE'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Koniecznie 5 cm keramzytu i duże otwory!',
                   'material': 'Ciężka donica lub worek uprawowy z geowłókniny (30 litrów)',
                   'min_depth_cm': 35,
                   'min_volume_l': 25,
                   'recommended_volume_l': 35},
        'schedule': {   '04_2': 'rozsada_dom',
                        '05_1': 'rozsada_dom',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'koniec_sezonu'},
        'soil': {   'fertilizer': "Intensywny 'żarłok' pokarmowy – zasilaj co 7 dni gnojówką roślinną lub nawozem "
                                  'organicznym',
                    'ph': '6.5 - 7.0',
                    'structure': 'Bardzo zasobna, chłonna',
                    'type': 'Maksymalnie żyzna gleba kompostowa z obornikiem granulowanym'},
        'soil_layers': {   'drainage_cm': 5,
                           'drainage_material': 'Solidny keramzyt 5 cm i duże otwory odpływowe w dnie',
                           'mulch_layer': '3 cm słomy lub ściółki z kory przekompostowanej',
                           'ph_range': '6.5 - 7.0',
                           'separator_recommended': True,
                           'substrate_mix': '50% kompost dojrzały, 30% ziemia warzywna, 15% perlit, 5% obornik '
                                            'granulowany na dnie',
                           'top_margin_cm': 4},
        'sources': [   'PoradnikOgrodniczy.pl: Cukinia w donicy na balkonie',
                       'Działkowiec: Warzywa dyniowate w pojemnikach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 1,
                             'planting_depth_cm': 3,
                             'planting_method': 'Jedna roślina na jedną donicę min. 25-30L!',
                             'spacing_cm': 50,
                             'supports_needed': 'Brak (odmiany karłowe krzaczaste) lub delikatny kołek stabilizujący '
                                                'pień'},
        'spray_guide': {   'apply_label': 'Zalecana profilaktyka przeciw mączniakowi',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': [   'Preparaty miedziowe lub roztwór sody oczyszczonej przy pierwszych '
                                               'białych plamach mączniaka.'],
                           'preventive': [   'Oprysk mlekiem z wodą (1:5) lub roztworem drożdży (100g/10L wody) co 10 '
                                             'dni.',
                                             'Podlewanie pod korzeń bez zwilżania liści.'],
                           'safety_note': 'Pryskaj wyłącznie wieczorem.'},
        'summary': 'Spektakularna roślina o wielkich żółtych kwiatach i pysznym plonie. Kluczem do sukcesu jest '
                   'ogromna donica (minimum 25-30 litrów) oraz podlewanie wiadrem wody w gorące dni.',
        'sun_preference': 'Mocne słońce (min. 6h dziennie)',
        'top_varieties': [   {   'badge': 'Stworzona do donic',
                                 'name': 'Patio Star F1',
                                 'reason': 'Zwarty krzaczasty pokrój (nie płoży się), rodzi obficie małe, '
                                           'ciemnozielone cukinie.'},
                             {   'badge': 'Bardzo plenna',
                                 'name': 'Black Beauty',
                                 'reason': 'Przy regularnym zbieraniu młodych owoców (15 cm) wytwarza plon przez całe '
                                           'lato.'},
                             {   'badge': 'Złocistożółta polska',
                                 'name': 'Atena Polka F1',
                                 'reason': 'Cieniusieńka skórka, maślany miąższ i spektakularny żółty kolor w donicy.'},
                             {   'badge': 'Okrągła pasiasta',
                                 'name': 'Piccolo F1',
                                 'reason': 'Owoce w kształcie małych pasiastych piłek, doskonałe do faszerowania i '
                                           'zapiekania.'},
                             {   'badge': 'Bez kłujących włosków',
                                 'name': 'Easy Pick Gold F1',
                                 'reason': 'Gładkie ogonki liściowe, bezpieczna w pielęgnacji na wąskim balkonie.'}],
        'varieties': ['Patio Star F1', 'Black Beauty', 'Atena Polka F1', 'Piccolo F1', 'Easy Pick Gold F1'],
        'wind_tolerance': 'Niska do średniej (duże parasolowate liście)'},
    {   'category': 'Jasnotowate',
        'detailed_guide': '\n'
                          '### 1. Złota zasada: nie przelewaj!\n'
                          'Zioła śródziemnomorskie giną prawie wyłącznie z powodu stojącej wody w podstawku i gnicia '
                          'korzeni. Podlewaj dopiero wtedy, gdy wierzchnia warstwa ziemi (3 cm) jest całkowicie sucha '
                          'w dotyku.\n'
                          '\n'
                          '### 2. Przycinanie\n'
                          'Przycinaj wierzchołki pędów regularnie do kuchni. Im częściej przycinasz, tym bardziej '
                          'krzewią się rośliny i zachowują gęsty, zwarty pokrój.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (odporne na suszę i silne wiatry)',
        'fertilizer_guide': {   'frequency': 'Maksymalnie raz w miesiącu od maja do lipca',
                                'npk_focus': 'Niskie stężenie, mikroskładniki, biohumus',
                                'organic_options': [   'Rozcieńczony biohumus (1 nakrętka na 2L wody)',
                                                       'Szczypta popiołu drzewnego (wapń i potas)'],
                                'warnings': 'Zakaz stosowania nawozów szybko działających z azotem!',
                                'what': 'Bardzo oszczędne nawożenie! Przenawożone zioła śródziemnomorskie tracą aromat '
                                        'i stężenie olejków eterycznych.'},
        'id': 'ziola-srodziemnomorskie',
        'name': 'Zioła śródziemnomorskie (Rozmaryn, Tymianek, Oregano, Szałwia)',
        'nutrition': {   'key_benefits': 'Skarbnica olejków eterycznych o silnym działaniu antyseptycznym, '
                                         'ułatwiających trawienie tłuszczów i stymulujących pamięć.',
                         'minerals': 'Tymol, karwakrol, eugenol, żelazo, magnez',
                         'tags': ['Kwas rozmarynowy', 'Tymol', 'Pamięć & skupienie', 'Przeciwzapalne'],
                         'vitamins': 'Kwas rozmarynowy, witamina A, C, B6'},
        'orientations': ['S', 'SW', 'W'],
        'plant_group': 'ziola',
        'pot': {   'drainage': 'Obowiązkowy gruby drenaż (keramzyt/żwir)',
                   'material': 'Donice z terakoty (gliniane nieszkliwione) – korzenie oddychają',
                   'min_depth_cm': 18,
                   'min_volume_l': 3,
                   'recommended_volume_l': 5},
        'schedule': {   '04_1': 'sadzenie_balkon',
                        '04_2': 'zbior',
                        '05_1': 'zbior',
                        '06_1': 'zbior',
                        '07_1': 'zbior',
                        '08_1': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zimowanie_dom'},
        'soil': {   'fertilizer': 'Bardzo oszczędne – przenawożone zioła tracą stężenie olejków eterycznych i aromat!',
                    'ph': '6.5 - 7.5 (obojętne do zasadowego)',
                    'structure': 'Uboga w azot, z dodatkiem piasku lub drobnego grysu',
                    'type': 'Podłoże piaszczysto-żwirowe, przepuszczalne'},
        'soil_layers': {   'drainage_cm': 4,
                           'drainage_material': 'Żwir płukany lub potłuczona ceramika 4 cm (bardzo ważny odpływ wody!)',
                           'mulch_layer': 'Drobny jasny żwirek na wierzchu (odbija słońce i zapobiega gniciu dolnych '
                                          'gałązek)',
                           'ph_range': '6.5 - 7.5 (obojętne do lekko zasadowego)',
                           'separator_recommended': True,
                           'substrate_mix': '50% ziemia uniwersalna, 30% drobny żwirek/perlit, 20% piasek gruby '
                                            '(podłoże ubogie i bardzo przepuszczalne)',
                           'top_margin_cm': 2.5},
        'sources': [   'Murator Ogród: Zioła śródziemnomorskie na balkonie',
                       'Zielone Pogotowie: Jak pielęgnować zioła wieloletnie'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 2,
                             'max_plants_per_standard_box_60cm': 3,
                             'planting_depth_cm': 3,
                             'planting_method': 'Sadzenie sadzonek wiosną, donice terakotowe z otworem.',
                             'spacing_cm': 20,
                             'supports_needed': 'Brak – łodyżki drewnieją z wiekiem'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (olejki eteryczne same odstraszają szkodniki)',
                           'apply_sprays': 'zbedne',
                           'intervention': [   'W razie przędziorków przy skrajnej suszy: oprysk wodą z mydłem '
                                               'potasowym.'],
                           'preventive': [   'Zapewnienie pełnego słońca i unikanie przelewania to 100% gwarancji '
                                             'zdrowia.'],
                           'safety_note': 'Zioła śródziemnomorskie rzadko chorują.'},
        'summary': 'Najwygodniejsi mieszkańcy południowego balkonu. Lepiej znoszą trzydniowe przesuszenie niż '
                   'jednorazowe zalanie korzeni. Ich zapach odstrasza komary i mszyce.',
        'sun_preference': 'Pełne, ostre słońce (>6h)',
        'top_varieties': [   {   'badge': 'Mrozoodporniejszy',
                                 'name': 'Rozmaryn Blue Winter',
                                 'reason': 'Wytrzymalszy na spadki temperatur, igiełkowate aromatyczne liście.'},
                             {   'badge': 'Zwarty kulisty',
                                 'name': 'Tymianek Faustino',
                                 'reason': 'Tworzy gęstą poduszeczkę, nie łysieje od dołu, silny aromat tymolu.'},
                             {   'badge': 'Olejki eteryczne',
                                 'name': 'Oregano Kaliteri',
                                 'reason': 'Prawdziwe oregano z greckich wysp o pieprznym, intensywnym aromacie do '
                                           'pizzy.'},
                             {   'badge': 'Szerokie aksamitne liście',
                                 'name': 'Szałwia Berggarten',
                                 'reason': 'Rzadziej zakwita, zachowując soczystość i masę liściową przez cały sezon.'},
                             {   'badge': 'Pikantny wieloletni',
                                 'name': 'Cząber górski',
                                 'reason': 'Zimozielony krzaczek, niezastąpiony do dań z fasoli i zup strączkowych.'}],
        'varieties': [   'Rozmaryn lekarski Blue Winter',
                         'Tymianek Faustino',
                         'Oregano greckie Kaliteri',
                         'Szałwia Berggarten',
                         'Cząber górski'],
        'wind_tolerance': 'Bardzo wysoka (drobne liście, zdrewniałe łodygi)'},
    {   'category': 'Szarłatowate',
        'detailed_guide': '\n'
                          '### 1. Zastosowanie kulinarne\n'
                          'Ogonki liściowe przyrządza się jak szparagi (gotowane na parze z masełkiem), a soczyste '
                          'blaszki liściowe jak szpinak.\n'
                          '\n'
                          '### 2. Zbiór\n'
                          'Odrywaj pojedyncze zewnętrzne liście tuż przy podstawie rośliny. Środek stale wypuszcza '
                          'nowe, bajecznie kolorowe pędy aż do późnego listopada.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (niezwykle dekoracyjny, odporny na błędy)',
        'fertilizer_guide': {   'frequency': 'Co 2 tygodnie przez cały sezon',
                                'npk_focus': 'Zrównoważone nawożenie organiczne',
                                'organic_options': ['Biohumus', 'Gnojówka z pokrzywy w czerwcu', 'Kompost'],
                                'warnings': 'Unikaj nawozów chemicznych azotanowych.',
                                'what': 'Płynny biohumus dżdżownicowy co 14 dni'},
        'id': 'burak-lisciowy',
        'name': 'Burak liściowy / Boćwina ozdobna',
        'nutrition': {   'key_benefits': 'Barwne antocyjany i betalainy wspierają produkcję czerwonych krwinek, '
                                         'dotleniają mózg i obniżają ciśnienie tętnicze.',
                         'minerals': 'Betalainy, żelazo, magnez, kwas foliowy',
                         'tags': ['Betalainy', 'Dotlenienie krwi', 'Witamina K', 'Magnez'],
                         'vitamins': 'Witamina K, A, C, witaminy z grupy B'},
        'orientations': ['S', 'SE', 'E', 'W'],
        'plant_group': 'warzywa',
        'pot': {   'drainage': 'Drenaż keramzytowy 3 cm',
                   'material': 'Głębokie donice wyeksponowane na podłodze balkonu',
                   'min_depth_cm': 20,
                   'min_volume_l': 5,
                   'recommended_volume_l': 8},
        'schedule': {   '04_1': 'siew_donica',
                        '04_2': 'siew_donica',
                        '05_1': 'pielegnacja',
                        '06_1': 'zbior',
                        '07_1': 'zbior',
                        '08_1': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zbior'},
        'soil': {   'fertilizer': 'Nawóz organiczny lub biohumus co 2 tygodnie',
                    'ph': '6.0 - 7.0',
                    'structure': 'Zatrzymująca wilgoć, bogata',
                    'type': 'Żyzna, próchnicza ziemia ogrodowa'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt 3 cm',
                           'mulch_layer': 'Perlit lub kora',
                           'ph_range': '6.0 - 7.0',
                           'separator_recommended': True,
                           'substrate_mix': '70% żyzna gleba ogrodowa, 20% perlit, 10% biohumus',
                           'top_margin_cm': 2.5},
        'sources': ['Działkowiec: Boćwina ozdobna w pojemnikach', 'PoradnikOgrodniczy.pl: Uprawa buraka liściowego'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 2,
                             'max_plants_per_standard_box_60cm': 3,
                             'planting_depth_cm': 2,
                             'planting_method': 'Siew gniazdowy po 2 nasionka co 20 cm od kwietnia.',
                             'spacing_cm': 20,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie mszycy burakowej',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': ['Mydło potasowe z czosnkiem w razie kolonii mszyc na spodzie liści.'],
                           'preventive': ['Oprysk wyciągiem z czosnku wczesnym latem.'],
                           'safety_note': 'Bezpieczne preparaty ekologiczne.'},
        'summary': 'Połączenie wykwintnego warzywa i rośliny czysto ozdobnej. Grubymi, wielobarwnymi ogonkami '
                   'liściowymi (czerwonymi, żółtymi, fioletowymi) zachwyci każdego gościa na balkonie.',
        'sun_preference': 'Słońce lub lekki półcień (4-6h)',
        'top_varieties': [   {   'badge': 'Krwistoczerwone ogonki',
                                 'name': 'Rhubarb Chard',
                                 'reason': 'Głęboka rubinowa czerwień łodyg, przepiękny kontrast z zielenią innych '
                                           'warzyw.'},
                             {   'badge': 'Tęcza barw',
                                 'name': 'Bright Lights',
                                 'reason': 'Rośliny w jednej donicy tworzą feerię barw: żółte, pomarańczowe, '
                                           'amarantowe i białe.'},
                             {   'badge': 'Biało-złoty maślany',
                                 'name': 'Lucullus',
                                 'reason': 'Szerokie, chrupiące żebra liściowe przyrządzane jak szparagi z masełkiem.'},
                             {   'badge': 'Wielkie liście',
                                 'name': 'Fordhook Giant',
                                 'reason': 'Ciemnozielone pofalowane liście zastępujące szpinak w środku gorącego '
                                           'lata.'},
                             {   'badge': 'Neonowy róż',
                                 'name': 'Magenta Sunset',
                                 'reason': 'Jaskraworóżowe ogonki liściowe, wspaniały element ozdobny w skrzynkach.'}],
        'varieties': ['Rhubarb Chard', 'Bright Lights', 'Lucullus', 'Fordhook Giant', 'Magenta Sunset'],
        'wind_tolerance': 'Średnia do wysokiej'},
    {   'category': 'Owoce jagodowe',
        'detailed_guide': '\n'
                          '### 1. Dlaczego odmiany powtarzające owocowanie?\n'
                          'Tradycyjna truskawka owocuje tylko przez 3 tygodnie w czerwcu. Na balkon wybieraj wyłącznie '
                          "odmiany **powtarzające owocowanie** (tzw. truskawki pnące lub zwisające, np. 'Toscana' o "
                          "pięknych rubinowych kwiatach czy 'Elan F1'). Wytwarzają długie pędy obsypane owocami aż do "
                          'października.\n'
                          '\n'
                          '### 2. Sadzenie i podlewanie\n'
                          '- Sadź wczesną wiosną (kwiecień) lub kup gotowe sadzonki frigo.\n'
                          '- W wiszących donicach ziemia przesycha najszybciej pod wpływem wiatru i słońca – w upalne '
                          'dni podlewaj codziennie rano letnią wodą.\n'
                          '- Ściółkuj wierzch donicy słomą lub włóknem kokosowym, by owoce nie leżały na mokrej '
                          'ziemi.\n'
                          '\n'
                          '### 3. Zimowanie na balkonie\n'
                          'Donice wiszące zdejmij na zimę i postaw na podłodze balkonu na płycie styropianowej, a same '
                          'pojemniki owiń jutą lub agrowłókniną.\n'
                          '        ',
        'difficulty': 3,
        'difficulty_label': 'Łatwa do średniej (wymaga częstego podlewania w wiszących donicach)',
        'fertilizer_guide': {   'frequency': 'Co 10 dni od maja do września (odmiany powtarzające owocują aż do '
                                             'października)',
                                'npk_focus': 'Dużo potasu (K) dla słodyczy i jędrności owoców, fosfor na korzenie',
                                'organic_options': [   'Biohumus',
                                                       'Gnojówka ze skrzypu',
                                                       'Mączka bazaltowa',
                                                       'Nawóz ze skórek bananów'],
                                'warnings': 'Niedobór potasu powoduje blade, wodniste owoce bez aromatu.',
                                'what': 'Specjalistyczny nawóz do truskawek i borówek lub biohumus ze zwiększoną dawką '
                                        'potasu'},
        'id': 'truskawka-wisząca',
        'name': 'Truskawka wisząca powtarzająca owocowanie',
        'nutrition': {   'key_benefits': 'Kwas elagowy to silny inhibitor procesów nowotworowych. Antocyjany chronią '
                                         'naczynia krwionośne i redukują stany zapalne.',
                         'minerals': 'Kwas elagowy, antocyjany, potas, mangan',
                         'tags': ['Kwas elagowy', 'Witamina C', 'Antocyjany', 'Młodość komórek'],
                         'vitamins': 'Witamina C (ponad 60mg/100g), witaminy z grupy B'},
        'orientations': ['S', 'SW', 'SE', 'W'],
        'plant_group': 'owoce',
        'pot': {   'drainage': 'Obowiązkowy drenaż keramzytowy 3 cm + otwory odpływowe',
                   'material': 'Wiszące amplie, skrzynki na balustradę lub kaskadowe wieże doniczkowe',
                   'min_depth_cm': 18,
                   'min_volume_l': 4,
                   'recommended_volume_l': 7},
        'schedule': {   '04_1': 'sadzenie_balkon',
                        '04_2': 'sadzenie_balkon',
                        '05_1': 'pielegnacja',
                        '05_2': 'pielegnacja',
                        '06_1': 'zbior',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Nawóz organiczny do truskawek ze zwiększonym potasem co 10-14 dni od maja',
                    'ph': '5.5 - 6.5 (lekko kwaśne)',
                    'structure': 'Przepuszczalna, z dodatkiem perlitu i biohumusu',
                    'type': 'Żyzne podłoże próchnicze do truskawek lub warzyw'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt 3 cm na dnie donicy lub wiszącej amplii',
                           'mulch_layer': 'Ściółka ze słomy lub wełny drzewnej (zapobiega brudzeniu i gniciu wiszących '
                                          'owoców)',
                           'ph_range': '5.5 - 6.5 (lekko kwaśna)',
                           'separator_recommended': True,
                           'substrate_mix': '65% ziemia do truskawek/warzyw, 20% perlit, 15% próchnica/kompost',
                           'top_margin_cm': 2.5},
        'sources': [   'Działkowiec: Truskawki w wiszących pojemnikach',
                       'PoradnikOgrodniczy.pl: Uprawa truskawek na balkonie'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 2,
                             'max_plants_per_standard_box_60cm': 3,
                             'planting_depth_cm': 3,
                             'planting_method': 'Uważaj, by nie zasypać ziemią serduszka rośliny (stożka wzrostu)!',
                             'spacing_cm': 20,
                             'supports_needed': 'Wiszący kosz (amplia), skrzynka balustradowa lub kolumna truskawkowa'},
        'spray_guide': {   'apply_label': 'Zalecana profilaktyka przeciw szarej pleśni',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': [   'Preparat biologiczny Polyversum WP (bezpieczny grzyb pasożytujący na '
                                               'patogenach, bez karencji).'],
                           'preventive': [   'Ściółkowanie słomą pod owocami, by nie leżały na mokrej ziemi.',
                                             'Oprysk wyciągiem ze skrzypu polnego wzmacniający skórkę owoców przed '
                                             'szarą pleśnią (Botrytis cinerea).'],
                           'safety_note': 'Polyversum jest w 100% naturalny i bezpieczny dla dzieci i zwierząt.'},
        'summary': 'Absolutny faworyt balkonowy! Odmiany powtarzające kwitną i owocują nieprzerwanie od czerwca aż do '
                   'pierwszych przymrozków w październiku. Wspaniale prezentują się w wiszących donicach i skrzynkach.',
        'sun_preference': 'Pełne słońce lub lekki półcień (min. 5-6h)',
        'top_varieties': [   {   'badge': 'Różowe kwiaty',
                                 'name': 'Toscana',
                                 'reason': 'Zdobywczyni prestiżowej nagrody Fleuroselect; zjawiskowe ciemnoróżowe '
                                           'kwiaty i słodkie owoce do mrozów.'},
                             {   'badge': 'Wysoka witamina C',
                                 'name': 'Elan F1',
                                 'reason': 'Silnie zwisające pędy, duże owoce o wybitnie deserowym smaku i wysokiej '
                                           'zawartości cukrów.'},
                             {   'badge': 'Kompaktowa do amplii',
                                 'name': 'Temptation',
                                 'reason': 'Praktycznie bezrozłogowa odmiana tworząca kaskadę owoców prosto z karpy '
                                           'liściowej.'},
                             {   'badge': 'Jędrna i trwała',
                                 'name': 'Albion',
                                 'reason': 'Kalifornijska odmiana powtarzająca o dużych, stożkowatych, '
                                           'ciemnoczerwonych truskawkach.'},
                             {   'badge': 'Aromat leśnych poziomek',
                                 'name': 'Mara des Bois',
                                 'reason': 'Francuski rarytas łączący wielkość truskawki z niepowtarzalnym leśnym '
                                           'aromatem.'}],
        'varieties': ['Toscana', 'Elan F1', 'Temptation', 'Albion', 'Mara des Bois'],
        'wind_tolerance': 'Wysoka (wiszące pojemniki na balustradzie lub pod sufitem)'},
    {   'category': 'Owoce jagodowe',
        'detailed_guide': '\n'
                          '### 1. Zaleta odmian bezrozłogowych\n'
                          "Odmiany 'Rugia' i 'Baron von Solemacher' nie wytwarzają wąsów rozłogowych. Cała energia "
                          'rośliny idzie w nieustanne kwitnienie i zawiązywanie intensywnie pachnących, leśnych '
                          'owoców.\n'
                          '\n'
                          '### 2. Doskonała na balkon północny i wschodni\n'
                          'Jako roślina runa leśnego, poziomka świetnie czuje się w lekkim półcieniu, gdzie ostre '
                          'południowe słońce nie przypala jej liści.\n'
                          '\n'
                          '### 3. Całkowita mrozoodporność\n'
                          'Jest to roślina wieloletnia. Bez problemu zimuje w skrzynkach balkonowych w polskich '
                          'warunkach, a wczesną wiosną (kwiecień) budzi się jako jedna z pierwszych roślin.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Bardzo łatwa (odporna na mróz i choroby)',
        'fertilizer_guide': {   'frequency': 'Co 14 dni od maja do września',
                                'npk_focus': 'Potas i fosfor',
                                'organic_options': ['Biohumus', 'Wyciąg ze skórek bananów'],
                                'warnings': 'Nie przesuszać podłoża.',
                                'what': 'Nawóz do truskawek i owoców jagodowych lub biohumus'},
        'id': 'poziomka-caloroczna',
        'name': 'Poziomka bezrozłogowa całoroczna',
        'nutrition': {   'key_benefits': 'Flawonoidy i rutyna uszczelniają naczynia włosowate, wspierają układ moczowy '
                                         'i oczyszczają organizm z toksyn.',
                         'minerals': 'Flawonoidy, garbniki, żelazo, fosfor, wapń',
                         'tags': ['Rutyna & flawonoidy', 'Szczelne naczynia', 'Witamina C', 'Witalność'],
                         'vitamins': 'Witamina C, E, P (rutyna), karotenoidy'},
        'orientations': ['E', 'SE', 'W', 'S', 'N'],
        'plant_group': 'owoce',
        'pot': {   'drainage': 'Otwory w dnie i 2 cm keramzytu',
                   'material': 'Tradycyjne skrzynki balkonowe, doniczki gliniane lub wiszące',
                   'min_depth_cm': 15,
                   'min_volume_l': 2.5,
                   'recommended_volume_l': 5},
        'schedule': {   '03_1': 'rozsada_dom',
                        '04_2': 'sadzenie_balkon',
                        '05_1': 'pielegnacja',
                        '05_2': 'zbior',
                        '06_1': 'zbior',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Podlewanie biohumusem raz na 2 tygodnie',
                    'ph': '5.5 - 6.5',
                    'structure': 'Umiarkowanie wilgotna, nieprzesychająca',
                    'type': 'Lekka, próchnicza ziemia z dodatkiem torfu i kompostu'},
        'soil_layers': {   'drainage_cm': 2.5,
                           'drainage_material': 'Keramzyt 2-3 cm',
                           'mulch_layer': 'Ściółka ze słomy lub drobnej kory sosnowej',
                           'ph_range': '5.5 - 6.5',
                           'separator_recommended': True,
                           'substrate_mix': '70% żyzna ziemia leśno-ogrodowa, 20% perlit, 10% kompost',
                           'top_margin_cm': 2},
        'sources': ['Murator Ogród: Poziomki na balkonie i tarasie', 'Zielone Pogotowie: Owoce jagodowe w skrzynkach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 3,
                             'max_plants_per_standard_box_60cm': 4,
                             'planting_depth_cm': 2.5,
                             'planting_method': 'Sadzenie sadzonek wiosną, nie zasypywać serduszka.',
                             'spacing_cm': 15,
                             'supports_needed': 'Brak – kępiasty pokrój'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (poziomka bezrozłogowa jest bardzo odporna)',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Usuwanie starych suchych liści wczesną wiosną.'],
                           'preventive': ['Podlewanie pod kępę, ściółkowanie.'],
                           'safety_note': 'Czyste, pachnące owoce prosto z krzaczka.'},
        'summary': 'Nie tworzy uciążliwych pędów rozłogowych (wąsów), dzięki czemu nie zarasta balkonu. Owocuje '
                   'nieprzerwanie garściami słodkich owoców od maja do listopada. W pełni mrozoodporna.',
        'sun_preference': 'Półcień lub umiarkowane słońce (3-6h)',
        'top_varieties': [   {   'badge': 'Aromatyczna bezrozłogowa',
                                 'name': 'Rugia',
                                 'reason': 'Wzniesione kępki bez uciążliwych wąsów, intensywnie pachnące owoce od maja '
                                           'do listopada.'},
                             {   'badge': 'Duże owoce',
                                 'name': 'Baron von Solemacher',
                                 'reason': 'Jedna z najstarszych i najsmaczniejszych odmian; rodzi stożkowate, '
                                           'soczyste poziomki.'},
                             {   'badge': 'Kremowo-żółta',
                                 'name': 'Yellow Wonder',
                                 'reason': 'Wyjątkowo słodka, o miodowym aromacie; ptaki jej nie zjadają, bo nie widzą '
                                           'czerwieni!'},
                             {   'badge': 'Owoce 2x większe',
                                 'name': 'Regina',
                                 'reason': 'Większe poziomki niż u formy dzikiej, wysoka odporność na mróz i '
                                           'przesuszenie.'},
                             {   'badge': 'Przewieszająca się',
                                 'name': 'Attila',
                                 'reason': 'Wytwarza pędy owocujące zwisające z donicy, idealna do wiszących '
                                           'skrzynek.'}],
        'varieties': ['Rugia', 'Baron von Solemacher', 'Yellow Wonder', 'Regina', 'Attila'],
        'wind_tolerance': 'Bardzo wysoka (niski, zwarty pokrój 15-20 cm)'},
    {   'category': 'Owoce krzewiaste',
        'detailed_guide': '\n'
                          '### 1. Żelazna zasada: Kwaśne podłoże (pH 3.8-4.5)\n'
                          'Zwykła ziemia uniwersalna z marketu zabije borówkę w ciągu 2 miesięcy. W donicy musisz '
                          'zastosować specjalne podłoże do roślin kwasolubnych (torf kwaśny wysoki + przekompostowana '
                          'kora sosnowa + perlit).\n'
                          '\n'
                          '### 2. Podlewanie odstaną lub deszczową wodą\n'
                          'Twarda woda z kranu zawiera wapń, który odkwasza glebę. Do podlewania używaj wody '
                          'deszczowej lub odstanej przegotowanej z kilkoma kroplami soku z cytryny raz w miesiącu.\n'
                          '\n'
                          '### 3. Zjawiskowy wygląd jesienią\n'
                          "Krzewy borówki karłowej 'Top Hat' latem dają do 1,5 kg owoców, a jesienią ich liście "
                          'przebarwiają się na zjawiskowy, jaskrawoczerwony kolor, będąc ozdobą balkonu do zimy.\n'
                          '        ',
        'difficulty': 4,
        'difficulty_label': 'Średnia (kluczem jest kwaśne podłoże pH 3.8-4.5)',
        'fertilizer_guide': {   'frequency': '3 razy w sezonie: kwiecień, maj i czerwiec. Od lipca ZAKAZ azotu.',
                                'npk_focus': 'Nawóz fizjologicznie kwaśny z siarką',
                                'organic_options': [   'Fusy z kawy (zakwaszają podłoże)',
                                                       'Ściółka z igliwia sosnowego',
                                                       'Siarczan potasu'],
                                'warnings': 'Zwykła woda z kranu ma wysokie pH i odkwasi podłoże w 2 miesiące! '
                                            'Podlewaj deszczówką lub wodą z kwaskiem cytrynowym (1 łyżeczka na 10L).',
                                'what': 'Wyłącznie specjalistyczny nawóz do borówek zakwaszający podłoże (siarczan '
                                        'amonu, siarczan potasu)'},
        'id': 'borowka-patio',
        'name': 'Borówka amerykańska karłowa (Patio / Doniczkowa)',
        'nutrition': {   'key_benefits': 'Paliwo dla mózgu i wzroku. Antocyjanozydy regenerują rodopsynę w siatkówce '
                                         'oka i poprawiają plastyczność synaptyczną mózgu.',
                         'minerals': 'Antocyjanozydy (najwyższe stężenie), resweratrol, cynk, selen',
                         'tags': ['Mózg i pamięć', 'Wzrok (mikrokrążenie)', 'Resweratrol', 'Antyoksydanty'],
                         'vitamins': 'Witamina C, K, E, witaminy z grupy B'},
        'orientations': ['S', 'SW', 'SE'],
        'plant_group': 'owoce',
        'pot': {   'drainage': 'Drenaż z grubej kory sosnowej (nie wapienny żwir!)',
                   'material': 'Duże donice ceramiczne lub pojemniki z tworzywa',
                   'min_depth_cm': 30,
                   'min_volume_l': 15,
                   'recommended_volume_l': 25},
        'schedule': {   '04_1': 'sadzenie_balkon',
                        '05_1': 'pielegnacja',
                        '06_1': 'pielegnacja',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'pielegnacja',
                        '10_2': 'zimowanie_balkon',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Nawóz zakwaszający do borówek (siarczan amonu/potasu) od kwietnia do lipca',
                    'ph': '3.8 - 4.5 (bezwzględnie kwaśne!)',
                    'structure': 'Bardzo lekka, próchnicza, kwaśna',
                    'type': 'Czysty torf kwaśny zmieszany z przekompostowaną korą sosnową'},
        'soil_layers': {   'drainage_cm': 5,
                           'drainage_material': 'Keramzyt lub gruba kora sosnowa 5 cm (wymaga doskonałego drenażu)',
                           'mulch_layer': '4 cm grubej kory sosnowej na wierzchu (zakwasza i trzyma wilgoć)',
                           'ph_range': '3.8 - 4.8 (silnie kwaśne – w zwykłej ziemi zginie!)',
                           'separator_recommended': True,
                           'substrate_mix': '70% kwaśny torf wysoki (pH 3.5-4.5), 20% przekompostowana kora sosnowa, '
                                            '10% perlit (BEZWZGLĘDNIE KWAŚNE PODŁOŻE!)',
                           'top_margin_cm': 4},
        'sources': [   'Działkowiec: Borówki w donicach – jak utrzymać kwaśne pH',
                       'PoradnikOgrodniczy.pl: Borówka karłowa na taras'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 1,
                             'planting_depth_cm': 5,
                             'planting_method': 'Donica min. 25-30 litrów na jeden krzew.',
                             'spacing_cm': 50,
                             'supports_needed': 'Brak – sztywne krzewiaste pędy'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (odporna na patogeny przy właściwym pH)',
                           'apply_sprays': 'zbedne',
                           'intervention': [   'W razie pożółknięcia liści (chloroza żelazowa): schelatowane żelazo '
                                               'dolistnie i zakwaszenie podłoża.'],
                           'preventive': [   'Utrzymanie niskiego pH (3.8-4.5) to najlepsza ochrona przed chlorozą i '
                                             'chorobami.'],
                           'safety_note': 'Kluczem jest kwasowość gleby i woda bez chloru/wapnia.'},
        'summary': 'Karłowe krzewy dorastające do 40-60 cm, obsypane słodkimi jagodami. Klucz do sukcesu: podłoże musi '
                   'być KWAŚNE (torf kwaśny pH 3.8-4.5) oraz podlewanie miękką wodą.',
        'sun_preference': 'Pełne słońce (min. 6h)',
        'top_varieties': [   {   'badge': 'Super karłowa (40-50 cm)',
                                 'name': 'Top Hat',
                                 'reason': 'Naturalna krzyżówka borówki wysokiej i niskiej; tworzy zwartą kulę rodzącą '
                                           'do 1,5 kg jagód.'},
                             {   'badge': 'Odporna do -35°C',
                                 'name': 'Northsky',
                                 'reason': 'Mrozoodporna krzewinka dająca drobne, ale niewiarygodnie słodkie owoce o '
                                           'leśnym smaku.'},
                             {   'badge': 'Jak zielony bukszpan',
                                 'name': 'BerryBux',
                                 'reason': 'Gęsty krzew o drobnych listkach przypominający bukszpan, obsypany setkami '
                                           'borówek.'},
                             {   'badge': 'Różowe borówki',
                                 'name': 'Pink Lemonade',
                                 'reason': 'Niezwykłe różowe owoce o słodko-kwaskowatym, cytrusowym posmaku; wielka '
                                           'atrakcja.'},
                             {   'badge': 'Duże owoce',
                                 'name': 'Bluecrop Patio',
                                 'reason': 'Wybór doniczkowy o dużych, jędrnych jagodach z mocnym sinoniebieskim '
                                           'nalotem.'}],
        'varieties': ['Top Hat', 'Northsky', 'BerryBux', 'Pink Lemonade', 'Bluecrop Patio'],
        'wind_tolerance': 'Średnia do wysokiej'},
    {   'category': 'Owoce krzewiaste',
        'detailed_guide': '\n'
                          '### 1. Odmiany genetycznie karłowe\n'
                          "Tradycyjne maliny rosną na 2 metry i mają ostre kolce. Odmiana 'Ruby Beauty' jest "
                          'całkowicie gładka (bezpieczna dla dzieci i zwierząt), osiąga zaledwie 60-80 cm i ma '
                          'naturalnie zaokrąglony pokrój.\n'
                          '\n'
                          '### 2. Zbiory i przycinanie\n'
                          'Owoce dojrzewają na pędach dwuletnich w lipcu. Po owocowaniu wytnij pędy, które owocowały, '
                          'a młode zostaw na kolejny rok.\n'
                          '\n'
                          '### 3. Zimowanie\n'
                          'Zimuje na balkonie – donicę owiń matą słomianą lub folią bąbelkową i odizoluj od zimnej '
                          'posadzki podkładając kawałek drewna lub styropianu.\n'
                          '        ',
        'difficulty': 3,
        'difficulty_label': 'Łatwa do średniej (bez kolców, nie wymaga podpór)',
        'fertilizer_guide': {   'frequency': 'Co 14 dni od maja do sierpnia',
                                'npk_focus': 'Potas i fosfor, mikroelementy',
                                'organic_options': ['Biohumus', 'Mączka bazaltowa', 'Nawóz ze skórek bananów'],
                                'warnings': 'Nie dopuszczać do całkowitego wyschnięcia bryły korzeniowej w czasie '
                                            'upałów.',
                                'what': 'Nawóz organiczny do krzewów owocowych lub nawóz do malin i truskawek'},
        'id': 'malina-karlowa',
        'name': 'Malina karłowa doniczkowa (bezkolcowa)',
        'nutrition': {   'key_benefits': 'Naturalna aspiryna ogrodowa – kwas salicylowy działa napotnie i '
                                         'przeciwgorączkowo, a ketony wspomagają spalanie tłuszczu.',
                         'minerals': 'Kwas salicylowy, ketony malinowe, potas, magnez',
                         'tags': ['Kwas salicylowy', 'Odporność', 'Ketony malinowe', 'Witamina C'],
                         'vitamins': 'Witamina C, E, kwas foliowy, biotyna'},
        'orientations': ['S', 'SW', 'SE', 'W'],
        'plant_group': 'owoce',
        'pot': {   'drainage': 'Warstwa keramzytu 4 cm i otwory',
                   'material': 'Ciężka donica stabilna na wietrze lub worek z geowłókniny 20L',
                   'min_depth_cm': 25,
                   'min_volume_l': 12,
                   'recommended_volume_l': 20},
        'schedule': {   '04_1': 'sadzenie_balkon',
                        '05_1': 'pielegnacja',
                        '06_1': 'pielegnacja',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '09_1': 'pielegnacja',
                        '10_2': 'zimowanie_balkon',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Nawóz organiczny do krzewów owocowych raz na 3 tygodnie',
                    'ph': '6.0 - 6.8',
                    'structure': 'Przepuszczalna, bogata w próchnicę',
                    'type': 'Żyzna ziemia ogrodowa z kompostem i perlitem'},
        'soil_layers': {   'drainage_cm': 4,
                           'drainage_material': 'Keramzyt 4 cm',
                           'mulch_layer': '3 cm ściółki z kory przekompostowanej',
                           'ph_range': '6.0 - 6.5',
                           'separator_recommended': True,
                           'substrate_mix': '65% żyzna ziemia ogrodnicza, 20% perlit, 15% dojrzały kompost',
                           'top_margin_cm': 3.5},
        'sources': ['Działkowiec: Karłowe krzewy owocowe w doniczkach', 'Twojogrodnik.pl: Maliny patio na balkon'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 1,
                             'planting_depth_cm': 5,
                             'planting_method': 'Pojedynczy krzew do donicy min. 15-20L.',
                             'spacing_cm': 40,
                             'supports_needed': 'Krótki palik bambusowy pod ciężarem owoców'},
        'spray_guide': {   'apply_label': 'Profilaktyka przeciw szarej pleśni i przędziorkom',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': ['Oprysk mydłem potasowym przy przędziorkach na suchym balkonie.'],
                           'preventive': ['Oprysk wyciągiem ze skrzypu polnego na pąki i liście w maju.'],
                           'safety_note': 'Odmiany karłowe balkonowe (np. Ruby Beauty) owocują na pędach jednorocznych '
                                          'lub dwuletnich bez kolców!'},
        'summary': 'Rewolucja w uprawie malin na balkonie. Kompaktowy krzaczek (60-80 cm), całkowicie pozbawiony '
                   'kolców. Nie wymaga wielkich podpór i obficie owocuje w lipcu i sierpniu.',
        'sun_preference': 'Słońce lub lekki półcień',
        'top_varieties': [   {   'badge': '100% bez kolców (60-80 cm)',
                                 'name': 'Ruby Beauty',
                                 'reason': 'Prawdziwy przełom: zwarty, gładki krzaczek dający do 1,5 kg pysznych '
                                           'malin.'},
                             {   'badge': 'Karłowa wczesna',
                                 'name': 'BonBonBerry Yummy',
                                 'reason': 'Owocuje obficie już od początku lipca na pędach jednorocznych i '
                                           'dwuletnich.'},
                             {   'badge': 'Złocistożółte liście',
                                 'name': 'Groovy',
                                 'reason': 'Cudowna gra kolorów: jasnozłote ulistnienie i rubinowoczerwone owoce.'},
                             {   'badge': 'Najniższa selekcja (50 cm)',
                                 'name': 'Baby Dwarf',
                                 'reason': 'Mieści się w standardowej donicy 15L na niewielkim balkonie miejskim.'},
                             {   'badge': 'Powtarzająca owocowanie',
                                 'name': 'Little Sweet Sister',
                                 'reason': 'Daje pierwszy zbiór w lipcu, a kolejny jesienią aż do pierwszych '
                                           'przymrozków.'}],
        'varieties': ['Ruby Beauty', 'BonBonBerry Yummy', 'Groovy', 'Baby Dwarf', 'Little Sweet Sister'],
        'wind_tolerance': 'Wysoka (sztywne, gęste pędy)'},
    {   'category': 'Dyniowate / Owoce',
        'detailed_guide': '\n'
                          '### 1. Prowadzenie pionowe na kratce\n'
                          'Na balkonie nie ma miejsca na płożące się pędy arbuza. Prowadź główny pęd pionowo w górę po '
                          'kratce balkonowej lub sznurkach.\n'
                          '\n'
                          '### 2. Podwieszanie owoców w siatkach!\n'
                          'Gdy zawiążą się owoce i osiągną wielkość jabłka, koniecznie umieść je w siatce (np. po '
                          'owocach lub rajstopie) i przywiąż do kratki, aby ich ciężar (1-2 kg) nie urwał pędu.\n'
                          '\n'
                          '### 3. Zapylanie i zbiory\n'
                          'Na wyższych piętrach zapylaj kwiaty ręcznie pędzelkiem. Zbiór następuje w sierpniu/wrześniu '
                          '– dojrzały arbuz wydaje głuchy odgłos przy pukaniu, a ogonek owocu zaczyna lekko zasychać.\n'
                          '        ',
        'difficulty': 6,
        'difficulty_label': 'Wymagający (potrzebuje dużo słońca, dużej donicy 20L i siatki na owoce)',
        'fertilizer_guide': {   'frequency': 'Co 7 dni w fazie wzrostu i dojrzewania owoców',
                                'npk_focus': 'Potas (K) i bor na zawiązywanie cukrów w owocach',
                                'organic_options': [   'Biohumus',
                                                       'Gnojówka z pokrzywy (tylko na początku)',
                                                       'Mączka bazaltowa'],
                                'warnings': 'Wymaga pełnego południowego słońca i ciepła.',
                                'what': 'Nawóz płynny potasowy z mikroelementami dla roślin dyniowatych'},
        'id': 'arbuz-mini',
        'name': 'Arbuz miniaturowy balkonowy',
        'nutrition': {   'key_benefits': 'L-cytrulina zmniejsza powysiłkową bolesność mięśni (zakwasy), a wysoka '
                                         'zawartość likopenu wspiera układ sercowo-naczyniowy.',
                         'minerals': 'L-cytrulina, likopen, potas, magnez',
                         'tags': ['L-cytrulina', 'Likopen', 'Nawodnienie', 'Regeneracja mięśni'],
                         'vitamins': 'Witamina C, A, B6'},
        'orientations': ['S', 'SW'],
        'plant_group': 'owoce',
        'pot': {   'drainage': '5 cm keramzytu na dnie',
                   'material': 'Ciężka donica lub worek uprawowy 30L',
                   'min_depth_cm': 35,
                   'min_volume_l': 20,
                   'recommended_volume_l': 30},
        'schedule': {   '04_1': 'rozsada_dom',
                        '04_2': 'rozsada_dom',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '07_1': 'pielegnacja',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'koniec_sezonu'},
        'soil': {   'fertilizer': 'Zasilanie co 7 dni nawozem ze zrównoważonym NPK i mikroelementami',
                    'ph': '6.0 - 7.0',
                    'structure': 'Puchata, chłonna, żyzna',
                    'type': 'Bardzo żyzna ziemia warzywna z dużą zawartością kompostu i obornika'},
        'soil_layers': {   'drainage_cm': 5,
                           'drainage_material': 'Keramzyt gruby 5 cm i duże otwory odpływowe',
                           'mulch_layer': 'Ściółka ze słomy lub czarna agrowłóknina nagrzewająca podłoże',
                           'ph_range': '6.0 - 6.8',
                           'separator_recommended': True,
                           'substrate_mix': '50% ziemia kompostowa, 25% obornik granulowany/biohumus, 25% perlit i '
                                            'piasek',
                           'top_margin_cm': 4},
        'sources': [   'PoradnikOgrodniczy.pl: Arbuz w donicy na słonecznym balkonie',
                       'Działkowiec: Egzotyczne owoce w pojemnikach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 1,
                             'planting_depth_cm': 3,
                             'planting_method': 'Jedna roślina na donicę min. 20-25L po 20 maja.',
                             'spacing_cm': 60,
                             'supports_needed': 'Siatka / hamak podtrzymujący rosnący owoc na balustradzie'},
        'spray_guide': {   'apply_label': 'Profilaktyka przeciw mączniakowi',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': ['Preparaty lecytynowe przeciw chorobom grzybowym.'],
                           'preventive': ['Oprysk roztworem sody oczyszczonej lub drożdży.'],
                           'safety_note': 'Podlewaj letnią wodą bez moczenia liści.'},
        'summary': 'Egzotyczny hit na ciepły balkon południowy! Miniaturowy arbuz rodzi owoce wielkości 1-2 kg na '
                   'pędach prowadzonych pionowo po kratce balkonowej w donicy 20L.',
        'sun_preference': 'Pełne, gorące słońce (>7h dziennie)',
        'top_varieties': [   {   'badge': 'Owoce 1-2 kg',
                                 'name': 'Sugar Baby',
                                 'reason': 'Ciemnozielona skórka, bardzo słodki i chrupiący miąższ; idealny rozmiar do '
                                           'lodówki.'},
                             {   'badge': 'Cieniusieńka skórka',
                                 'name': 'Mini Love F1',
                                 'reason': 'Bardzo mało pestek, wspaniały plon przy prowadzeniu pnącym po kratce w '
                                           'donicy 20L.'},
                             {   'badge': 'Polska żółtoskóra',
                                 'name': 'Złoto Wolicy',
                                 'reason': 'Wczesna polska odmiana o pięknej złocistej skórce i soczystym czerwonym '
                                           'wnętrzu.'},
                             {   'badge': 'Żółty miąższ',
                                 'name': 'Janosik',
                                 'reason': 'Oryginalny melonowo-arbuzowy żółty miąższ o niezwykle orzeźwiającym '
                                           'smaku.'},
                             {   'badge': 'Pasiasty klasyk',
                                 'name': 'Crimson Sweet Mini',
                                 'reason': 'Tradycyjny pasiasty wzór w miniaturowym wydaniu odpowiednim do '
                                           'pojemników.'}],
        'varieties': ['Sugar Baby', 'Mini Love F1', 'Złoto Wolicy', 'Janosik', 'Crimson Sweet Mini'],
        'wind_tolerance': 'Niska do średniej (wymaga osłoniętego kąta)'},
    {   'category': 'Zioła jednoroczne',
        'detailed_guide': '\n'
                          '### 1. Złota zasada uszczykiwania\n'
                          'Nigdy nie obrywaj pojedynczych liści od dołu! Uszczykuj (obcinaj) całe wierzchołki pędów '
                          'tuż nad parą liści. Roślina w tym miejscu natychmiast wypuści dwa nowe rozgałęzienia, '
                          'tworząc gęsty krzaczek.\n'
                          '\n'
                          '### 2. Wróg numer jeden: chłód\n'
                          'Bazylia to roślina tropikalna. Spadek temperatury poniżej 10-12°C powoduje czernienie liści '
                          'i zamieranie. Na balkon wystawiaj ją dopiero po 20 maja.\n'
                          '\n'
                          '### 3. Towarzystwo pomidorów\n'
                          'Posadzona w jednej dużej donicy z pomidorem koktajlowym poprawia jego smak i odstrasza '
                          'mszyce olejkami eterycznymi.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (byle nie zmarzła poniżej 12°C)',
        'fertilizer_guide': {   'frequency': 'Co 14 dni',
                                'npk_focus': 'Łagodny nawóz organiczny',
                                'organic_options': ['Biohumus dżdżownicowy', 'Herbatka kompostowa'],
                                'warnings': 'Bazylia nienawidzi zimna (<12°C) i zimnej wody – podlewaj letnią wodą '
                                            'rano.',
                                'what': 'Płynny biohumus do ziół'},
        'id': 'bazylia-wlasciwa',
        'name': 'Bazylia właściwa i cytrynowa',
        'nutrition': {   'key_benefits': 'Eugenol działa przeciwzapalnie i rozkurczowo, koi układ nerwowy, ułatwia '
                                         'trawienie i redukuje wzdęcia.',
                         'minerals': 'Eugenol, linalol, magnez, wapń, żelazo',
                         'tags': ['Eugenol', 'Działanie rozkurczowe', 'Trawienie', 'Witamina K'],
                         'vitamins': 'Witamina K, A, C'},
        'orientations': ['S', 'SE', 'SW', 'W'],
        'plant_group': 'ziola',
        'pot': {   'drainage': 'Standardowe otwory i 2 cm drenażu',
                   'material': 'Doniczki z tworzywa lub gliniane',
                   'min_depth_cm': 15,
                   'min_volume_l': 2.5,
                   'recommended_volume_l': 5},
        'schedule': {   '03_2': 'rozsada_dom',
                        '04_1': 'rozsada_dom',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'zbior',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'koniec_sezonu'},
        'soil': {   'fertilizer': 'Podlewanie rozcieńczonym biohumusem raz na 2 tygodnie',
                    'ph': '6.2 - 7.0',
                    'structure': 'Umiarkowanie wilgotna, przepuszczalna',
                    'type': 'Żyzna, lekka ziemia do ziół z perlitem'},
        'soil_layers': {   'drainage_cm': 2.5,
                           'drainage_material': 'Keramzyt 2.5 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 7.0',
                           'separator_recommended': False,
                           'substrate_mix': '70% ziemia do ziół i warzyw, 20% perlit, 10% biohumus',
                           'top_margin_cm': 2},
        'sources': ['Murator Ogród: Pielęgnacja bazylii na balkonie', 'Zielone Pogotowie: Jak prawidłowo ciąć zioła'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 3,
                             'max_plants_per_standard_box_60cm': 4,
                             'planting_depth_cm': 0.5,
                             'planting_method': 'Płytki siew lub sadzenie kępek rozsady po 15 maja.',
                             'spacing_cm': 15,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (zbiór liści na surowo do potraw)',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Usuwanie ewentualnych uszkodzonych pędów.'],
                           'preventive': ['Wietrzenie i niepolewanie liści chroni przed fuzariozą i szarą pleśnią.'],
                           'safety_note': 'Zrywaj wierzchołki pędów – pobudza to intensywne rozkrzewianie.'},
        'summary': 'Nieodzowny kompan pomidorów. Uwielbia ciepło, osłonę od wiatru i regularne uszczykiwanie '
                   'wierzchołków pędów, co zapobiega kwitnieniu i potraja masę aromatycznych liści.',
        'sun_preference': 'Ciepłe słońce (min. 5h), osłonięte od wiatru',
        'top_varieties': [   {   'badge': 'Klasyczna do pesto',
                                 'name': 'Genovese',
                                 'reason': 'Wielkie, błyszczące liście o mocnym aromacie; absolutna podstawa kuchni '
                                           'włoskiej.'},
                             {   'badge': 'Kulista drobnolistna',
                                 'name': 'Piccolino',
                                 'reason': 'Rośnie w kształcie zwartej zielonej kuli, nie wymaga częstego przycinania, '
                                           'idealna na stolik.'},
                             {   'badge': 'Cytrusowy aromat',
                                 'name': 'Cytrynowa',
                                 'reason': 'Wyraźna nuta świeżej cytryny; genialna do ryb, sałatek owocowych i letniej '
                                           'herbaty.'},
                             {   'badge': 'Purpurowa ozdobna',
                                 'name': 'Dark Opal',
                                 'reason': 'Ciemnofioletowe liście i różowe kwiaty, wspaniały akcent barwny obok '
                                           'zielonych ziół.'},
                             {   'badge': 'Korzenny posmak',
                                 'name': 'Cynamonowa',
                                 'reason': 'Ciekawe nuty cynamonowo-goździkowe, doskonała do deserów i kuchni '
                                           'azjatyckiej.'}],
        'varieties': ['Genovese', 'Piccolino', 'Cytrynowa (Lemon)', 'Dark Opal', 'Cynamonowa'],
        'wind_tolerance': 'Niska (delikatne liście łamią się w silnych porywach)'},
    {   'category': 'Zioła wieloletnie',
        'detailed_guide': '\n'
                          '### 1. Zawsze w oddzielnej donicy!\n'
                          'Kłącza mięty rozrastają się błyskawicznie pod ziemią. Jeśli posadzisz ją z innymi ziołami '
                          'lub warzywami, w 2 miesiące udusi korzenie sąsiadów. W osobnej donicy jest za to całkowicie '
                          'bezproblemowa.\n'
                          '\n'
                          '### 2. Balkon od północy to dla niej raj\n'
                          'Większość warzyw potrzebuje mocnego słońca, ale mięta kocha chłodniejszy półcień i wilgoć. '
                          'Na balkonie północnym rośnie bujnie i soczyście.\n'
                          '\n'
                          '### 3. Zimowanie\n'
                          'Jest całkowicie odporna na mróz. Donica może stać na balkonie przez całą zimę bez żadnego '
                          'okrycia. W marcu wystarczy ściąć stare suche pędy, a w kwietniu wyrosną nowe, aromatyczne '
                          'liście.\n'
                          '        ',
        'difficulty': 1,
        'difficulty_label': 'Banalnie prosta (roślina nie do zdarcia, wieloletnia)',
        'fertilizer_guide': {   'frequency': 'Raz w miesiącu',
                                'npk_focus': 'Organiczny',
                                'organic_options': ['Biohumus', 'Kompost dosypany na wiosnę'],
                                'warnings': 'Zawsze uprawiaj miętę w ODDZIELNEJ donicy – jej podziemne rozłogi '
                                            'zagłuszą każde inne warzywo!',
                                'what': 'Nawóz organiczny biohumus'},
        'id': 'mieta-donica',
        'name': 'Mięta pieprzowa i marokańska w donicy',
        'nutrition': {   'key_benefits': 'Mentol łagodzi napięciowe bóle głowy, pobudza wydzielanie soków trawiennych, '
                                         'działa antyseptycznie i chłodząco.',
                         'minerals': 'Mentol, kwas rozmarynowy, garbniki, potas',
                         'tags': ['Mentol', 'Ukojenie żołądka', 'Inhalacja', 'Przeciwskurczowe'],
                         'vitamins': 'Witamina A, C, flawonoidy'},
        'orientations': ['N', 'E', 'W', 'SE', 'NE'],
        'plant_group': 'ziola',
        'pot': {   'drainage': 'Standardowy drenaż',
                   'material': 'UWAGA: Bezwzględnie w OSOBNEJ donicy (ekspansywne rozłogi!)',
                   'min_depth_cm': 20,
                   'min_volume_l': 4,
                   'recommended_volume_l': 8},
        'schedule': {   '04_1': 'sadzenie_balkon',
                        '04_2': 'zbior',
                        '05_1': 'zbior',
                        '06_1': 'zbior',
                        '07_1': 'zbior',
                        '08_1': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Niewielkie dawki kompostu wiosną',
                    'ph': '6.0 - 7.5',
                    'structure': 'Stale lekko wilgotna',
                    'type': 'Uniwersalna ziemia ogrodnicza'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt 3 cm',
                           'mulch_layer': 'Kora przekompostowana lub perlit (ogranicza wysychanie)',
                           'ph_range': '6.0 - 7.0',
                           'separator_recommended': True,
                           'substrate_mix': '75% ziemia uniwersalna, 15% perlit, 10% kompost (stale umiarkowanie '
                                            'wilgotna)',
                           'top_margin_cm': 2.5},
        'sources': ['Działkowiec: Mięty gatunkowe w doniczkach', 'PoradnikOgrodniczy.pl: Uprawa mięty na balkonie'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 2,
                             'planting_method': 'Sadzonki w oddzielnej donicy o średnicy min. 20 cm.',
                             'spacing_cm': 20,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne',
                           'apply_sprays': 'zbedne',
                           'intervention': [   'W razie rdzy mięty (pomarańczowe kropki): ściąć całą roślinę do zera – '
                                               'odrośnie zdrowa w 2 tygodnie.'],
                           'preventive': ['Ścinaj pędy przed kwitnieniem, by zachować świeżość mentolu.'],
                           'safety_note': 'Mięta jest niezniszczalna i doskonale zimuje w donicy.'},
        'summary': 'Roślina nie do zdarcia. Rośnie w słońcu i w głębokim cieniu (idealna na balkon północny). Złota '
                   'zasada: sadź ją w osobnej donicy, bo jej podziemne rozłogi zdominują każdą inną roślinę!',
        'sun_preference': 'Półcień lub słońce (doskonała na balkon północny i wschodni)',
        'top_varieties': [   {   'badge': 'Najlepsza do naparów',
                                 'name': 'Maroccan',
                                 'reason': 'Pofałdowane, soczyste liście o słodkawym aromacie mięty ogrodowej; idealna '
                                           'do herbaty i lemoniad.'},
                             {   'badge': 'Orzeźwienie z limonką',
                                 'name': 'Hugo Cocktail',
                                 'reason': 'Stworzona do letnich koktajli i drinków, łagodny mentol połączony z nutami '
                                           'cytrusowymi.'},
                             {   'badge': 'Aromat After Eight',
                                 'name': 'Czekoladowa',
                                 'reason': 'Ciemnobrązowe łodygi i niepowtarzalny aromat czekoladek miętowych.'},
                             {   'badge': 'Maksymalny mentol',
                                 'name': 'Pieprzowa Mitcham',
                                 'reason': 'Odmiana o najwyższej zawartości mentolu, doskonała do inhalacji i '
                                           'leczniczych naparów.'},
                             {   'badge': 'Pstre ozdobne liście',
                                 'name': 'Imbirowa / Pstra',
                                 'reason': 'Złoto-zielone liście i ciepły korzenny posmak imbiru; wspaniała ozdoba '
                                           'donicy.'}],
        'varieties': ['Maroccan', 'Hugo Cocktail', 'Czekoladowa', 'Pieprzowa Mitcham', 'Imbirowa / Pstra'],
        'wind_tolerance': 'Bardzo wysoka'},
    {   'category': 'Zioła dwuletnie',
        'detailed_guide': '\n'
                          '### 1. Głębokość pojemnika\n'
                          'Nawet pietruszka naciowa wytwarza palowy korzeń. Donica musi mieć minimum 20 cm głębokości, '
                          'aby roślina nie karłowaciała.\n'
                          '\n'
                          '### 2. Prawidłowy zbiór naci\n'
                          'Ścinaj zewnętrzne liście na wysokości 2 cm nad ziemią. Nigdy nie wycinaj środka '
                          "('serduszka'), z którego stale wyrastają nowe pędy.\n"
                          '\n'
                          '### 3. Zbiór zimowy\n'
                          'Pietruszka jest rośliną dwuletnią i wytrzymuje przymrozki do -8°C. Świeżą, zieloną nać '
                          'możesz zbierać na balkonie jeszcze w listopadzie i grudniu.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (wymaga jedynie głębszej doniczki min. 20 cm na korzeń)',
        'fertilizer_guide': {   'frequency': 'Co 3 tygodnie',
                                'npk_focus': 'Zrównoważony organiczny',
                                'organic_options': ['Biohumus dżdżownicowy'],
                                'warnings': 'Nasiona kiełkują powoli (do 3 tygodni) – podłoże musi być stale wilgotne.',
                                'what': 'Płynny biohumus do warzyw liściowych'},
        'id': 'pietruszka-naciowa',
        'name': 'Pietruszka naciowa kędzierzawa i gładka',
        'nutrition': {   'key_benefits': 'Najbogatsze źródło witaminy C i żelaza na balkonie. Oczyszcza nerki, '
                                         'eliminuje nieprzyjemny zapach z ust i wzmacnia krew.',
                         'minerals': 'Żelazo, kwas foliowy, apiol, mirystycyna',
                         'tags': ['Żelazo (na anemię)', '160mg Wit. C!', 'Świeży oddech', 'Mocne nerki'],
                         'vitamins': 'Witamina C (aż 160mg/100g – 3x więcej niż cytryna!), K, A'},
        'orientations': ['E', 'SE', 'W', 'S', 'N'],
        'plant_group': 'ziola',
        'pot': {   'drainage': 'Warstwa keramzytu 3 cm',
                   'material': 'Głębokie doniczki lub skrzynki balkonowe',
                   'min_depth_cm': 22,
                   'min_volume_l': 3.5,
                   'recommended_volume_l': 6},
        'schedule': {   '03_2': 'siew_donica',
                        '04_1': 'siew_donica',
                        '05_1': 'zbior',
                        '06_1': 'zbior',
                        '07_1': 'zbior',
                        '08_1': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior',
                        '11_1': 'zbior',
                        '12_1': 'zbior'},
        'soil': {   'fertilizer': 'Biohumus raz na 2-3 tygodnie',
                    'ph': '6.5 - 7.5',
                    'structure': 'Przepuszczalna, trzymająca wilgoć',
                    'type': 'Żyzna, próchnicza ziemia ogrodowa'},
        'soil_layers': {   'drainage_cm': 2.5,
                           'drainage_material': 'Keramzyt 2.5 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.2 - 7.0',
                           'separator_recommended': False,
                           'substrate_mix': '70% żyzna ziemia ogrodnicza, 20% perlit, 10% biohumus',
                           'top_margin_cm': 2},
        'sources': [   'Działkowiec: Witaminy z balkonu – natka pietruszki',
                       'PoradnikOgrodniczy.pl: Uprawa pietruszki naciowej'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 4,
                             'max_plants_per_standard_box_60cm': 6,
                             'planting_depth_cm': 1,
                             'planting_method': 'Rowki co 12 cm, siew w marcu/kwietniu.',
                             'spacing_cm': 10,
                             'supports_needed': 'Brak'},
        'spray_guide': {   'apply_label': 'Opryski zbędne',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Usuwanie pożółkłych liści.'],
                           'preventive': ['Zachowanie odstępów i podlewanie do podłoża.'],
                           'safety_note': 'Ścinaj zewnętrzne gałązki, serduszko stale wypuszcza nową nać.'},
        'summary': 'Bomba witaminy C na Twoim balkonie. Głęboka doniczka (min. 20 cm) i umiarkowana wilgotność '
                   'pozwalają ścinać aromatyczną nać od maja aż do grudniowych mrozów.',
        'sun_preference': 'Słońce lub półcień (3-6h)',
        'top_varieties': [   {   'badge': 'Gładka aromatyczna',
                                 'name': 'Festival 68',
                                 'reason': 'Intensywny aromat, wysokie stężenie witaminy C, doskonała do zup i '
                                           'mrożenia.'},
                             {   'badge': 'Mocno kędzierzawa',
                                 'name': 'Moss Curled 2',
                                 'reason': 'Wygląda jak szmaragdowy mech; bardzo dekoracyjna w skrzynkach i do '
                                           'dekoracji dań.'},
                             {   'badge': 'Włoska gigant',
                                 'name': "Gigante d'Italia",
                                 'reason': 'Wielkie liście, potężny wigor wzrostu i szybki odrost po mocnym ścięciu.'},
                             {   'badge': 'Odporna na żółknięcie',
                                 'name': 'Karnaval',
                                 'reason': 'Liście nie żółkną nawet podczas letnich upałów i suszy powietrza na '
                                           'balkonie.'},
                             {   'badge': 'Tradycyjna wczesna',
                                 'name': 'Comun 3',
                                 'reason': 'Doskonale znosi chłody wiosenne i jesienne, plonuje do późnego grudnia.'}],
        'varieties': ['Festival 68', 'Moss Curled 2', "Gigante d'Italia", 'Karnaval', 'Comun 3'],
        'wind_tolerance': 'Wysoka'},
    {   'category': 'Bodziszkowate',
        'detailed_guide': '\n'
                          '### 1. Sadzenie do skrzynek i donic (Maj)\n'
                          'Sadź rozsadę po 15 maja do skrzynek balkonowych w rozstawie co 20-25 cm. Na dno obowiązkowo '
                          'wsyp 3 cm keramzytu. Użyj żyznej ziemi z domieszką glinki lub hydrożelu, który magazynuje '
                          'wilgoć w upalne dni.\n'
                          '\n'
                          '### 2. Pielęgnacja i pobudzanie kwitnienia\n'
                          '- **Oczyszczanie:** Regularnie wyłamuj przekwitłe kwiatostany wraz z szypułką (nie ucinaj, '
                          'lecz wyłamuj delikatnie w bok). Zapobiega to rozwojowi szarej pleśni i pobudza roślinę do '
                          'natychmiastowego tworzenia dziesiątek nowych pąków.\n'
                          '- **Podlewanie:** Pelargonia woli lekkie przesuszenie niż zalanie korzeni. W lipcu i '
                          'sierpniu podlewaj codziennie rano lub wieczorem.\n'
                          '\n'
                          '### 3. Zimowanie\n'
                          'Pelargonie to byliny! Przed pierwszymi przymrozkami w październiku przytnij pędy na '
                          'wysokość 15 cm i przenieś skrzynkę do jasnego, chłodnego pomieszczenia (8-12°C). Podlewaj '
                          'oszczędnie raz w miesiącu. W marcu zacznij obfite podlewanie – roślina obudzi się do nowego '
                          'sezonu.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (niezawodna ikona polskich balkonów)',
        'fertilizer_guide': {   'frequency': 'Co 7 dni podczas każdego drugiego podlewania od czerwca do września',
                                'npk_focus': 'Niski azot (N), bardzo wysoki potas (K) dla eksplozji pąków i jędrności '
                                             'kwiatostanów',
                                'organic_options': [   'Płynny biohumus do roślin kwitnących',
                                                       'Wyciąg ze skórek bananów (potas)',
                                                       'Mączka bazaltowa'],
                                'warnings': 'Nadmiar azotu prowadzi do gigantycznych liści i zaniku pąków kwiatowych!',
                                'what': 'Nawóz specjalistyczny do pelargonii bogaty w potas i fosfor oraz żelazo '
                                        'schelatowane'},
        'id': 'pelargonia-balkonowa',
        'name': 'Pelargonia bluszczolistna i rabatowa',
        'nutrition': {   'key_benefits': 'Wydziela naturalne fitoncydy oczyszczające powietrze na balkonie; zapach '
                                         'liści skutecznie odstrasza komary, meszki i osy.',
                         'minerals': 'Olejki geraniolowe, cytronelol',
                         'tags': ['Odstrasza komary', 'Fitoncydy', 'Jonizacja powietrza', 'Aromaterapia'],
                         'vitamins': 'Fitoncydy lotne, garbniki, flawonoidy'},
        'orientations': ['S', 'SW', 'SE', 'W', 'SSE', 'SSW', 'S_W', 'S_E', 'DACH'],
        'plant_group': 'ozdobne',
        'pot': {   'drainage': '3 cm keramzytu na dnie i sprawne otwory odpływowe (nie znosi stojącej wody)',
                   'material': 'Klasyczne skrzynki balkonowe z tworzywa, terakota lub wiszące amplie',
                   'min_depth_cm': 18,
                   'min_volume_l': 4,
                   'recommended_volume_l': 7},
        'schedule': {   '04_2': 'hartowanie',
                        '05_1': 'hartowanie',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'pielegnacja',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'zbior',
                        '10_2': 'zimowanie_dom'},
        'soil': {   'fertilizer': 'Nawóz do pelargonii z podwyższoną dawką potasu co 7-10 dni od maja do października',
                    'ph': '6.2 - 7.0',
                    'structure': 'Przepuszczalna, żyzna z dodatkiem perlitu i minerałów ilastych',
                    'type': 'Dedykowane podłoże do pelargonii lub ziemia z glinką zatrzymującą składniki'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt ogrodniczy frakcja 8-16 mm (3 cm)',
                           'mulch_layer': 'Keramzyt drobny lub perlit (ogranicza nagrzewanie ziemi w słońcu)',
                           'ph_range': '6.2 - 7.0',
                           'separator_recommended': True,
                           'substrate_mix': '65% żyzna ziemia próchnicza z glinką, 20% perlit, 15% dojrzały kompost '
                                            'lub obornik granulowany',
                           'top_margin_cm': 2.5},
        'sources': [   'Działkowiec: Pelargonie na balkonach i tarasach',
                       'PoradnikOgrodniczy.pl: Pielęgnacja pelargonii w skrzynkach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 2,
                             'max_plants_per_standard_box_60cm': 3,
                             'planting_depth_cm': 3,
                             'planting_method': 'Sadź na równej głębokości co w doniczce produkcyjnej, lekko '
                                                'ugniatając ziemię wokół bryły.',
                             'spacing_cm': 20,
                             'supports_needed': 'Brak dla odmian rabatowych; dla zwisających – swobodny zwis poza '
                                                'krawędź skrzynki'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie deszczowego lata (szara pleśń)',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': [   'Oprysk biologicznym preparatem Polyversum WP lub Fungilitis w razie '
                                               'pojawienia się szarego nalotu pleśni.',
                                               'W razie mszyc: mydło potasowe z wyciągiem z czosnku (20g/L wody).'],
                           'preventive': [   'Wyłamywanie przekwitłych kwiatostanów po każdym deszczu.',
                                             'Profilaktyczny oprysk wyciągiem ze skrzypu polnego wzmacniający tkanki '
                                             'kwiatostanów.'],
                           'safety_note': 'Pelargonia jest jedną z najbardziej odpornych roślin balkonowych – rzadko '
                                          'wymaga jakiejkolwiek chemii.'},
        'summary': 'Niekwestionowana królowa polskich balkonów. Wytrzymuje palące słońce, porywiste wiatry i '
                   'kilkudniowe przesuszenie. Kwitnie spektakularnie od maja do pierwszych przymrozków.',
        'sun_preference': 'Pełne słońce lub lekki półcień (min. 5-7h)',
        'top_varieties': [   {   'badge': 'Królowa trwałości',
                                 'name': 'Calliope Dark Red',
                                 'reason': 'Hybryda międzygatunkowa; aksamitne, głęboko bordowe kwiaty, nieprzerwane '
                                           'kwitnienie do listopada i potężna odporność na skwar.'},
                             {   'badge': 'Legendarna zwisająca',
                                 'name': 'Ville de Paris',
                                 'reason': 'Klasyczna tyrolska kaskada dorastająca do 80-100 cm długości; obficie '
                                           'obsypana drobnymi, uroczymi kwiatami.'},
                             {   'badge': 'Dwubarwna malownicza',
                                 'name': 'Mexica Nealit',
                                 'reason': 'Biało-rubinowe płatki o unikatowym wzorze, zwarty pokrój odporny na '
                                           'łamanie przez wiatr na wyższych piętrach.'},
                             {   'badge': 'Wzniesiona rabatowa',
                                 'name': 'Toscana',
                                 'reason': 'Sztywne, grube łodygi, wielkie kuliste baldachy kwiatostanów, wspaniała do '
                                           'stojących donic podłogowych.'},
                             {   'badge': 'Zimozielone liście',
                                 'name': 'Decora Pink',
                                 'reason': 'Błyszczące, skórzaste liście bluszczolistne o podwyższonej odporności na '
                                           'suszę miejską.'}],
        'varieties': ['Calliope Dark Red', 'Ville de Paris', 'Mexica Nealit', 'Toscana', 'Decora Pink'],
        'wind_tolerance': 'Bardzo wysoka (zwłaszcza odmiany o sztywnych lub elastycznych pędach)'},
    {   'category': 'Psiankowate',
        'detailed_guide': '\n'
                          '### 1. Wymagania glebowe – klucz do żelaza\n'
                          'Surfinia nienawidzi zasadowego podłoża! Przy pH powyżej 6.5 nie potrafi pobierać żelaza, co '
                          'objawia się tzw. chlorozą (liście stają się bladożółte z zielonymi nerwami). Zawsze kupuj '
                          'dedykowane podłoże do surfinii o pH 5.5-6.0.\n'
                          '\n'
                          '### 2. Nawadnianie i zasilanie w upalne dni\n'
                          'W lipcu i sierpniu surfinia potrafi wypić 2-3 litry wody dziennie. Podlewaj rano i '
                          'wieczorem. Do każdego podlewania dodawaj 1/3 zalecanej dawki nawozu ze schelatowanym '
                          'żelazem.\n'
                          '\n'
                          '### 3. Ochrona przed ulewnym deszczem\n'
                          'Podczas gwałtownych burz warto zdjąć wiszące amplie lub zabezpieczyć skrzynki – silny ulew '
                          'może poszarpać delikatne płatki (choć po 2-3 dniach roślina wypuści nową falę pąków).\n'
                          '        ',
        'difficulty': 4,
        'difficulty_label': 'Średnia (potrzebuje dużej ilości wody i regularnego żelaza)',
        'fertilizer_guide': {   'frequency': 'Co 3-5 dni (lub mikrodawka przy każdym podlewaniu w lipcu i sierpniu)',
                                'npk_focus': 'Niski azot, bardzo wysoki potas (K) + schelatowane żelazo zapobiegające '
                                             'chlorozie',
                                'organic_options': [   'Płynny biohumus wzbogacony żelazem',
                                                       'Wyciąg ze skrzypu polnego',
                                                       'Nawóz ze skórek bananowych'],
                                'warnings': 'Niedobór żelaza natychmiast objawia się żółknięciem liści – w takim '
                                            'wypadku zastosuj nawóz dolistnie!',
                                'what': 'Nawóz mineralny lub organiczny do surfinii z kompleksem żelaza '
                                        '(Fe-EDTA/EDDHA) i wysokim potasem'},
        'id': 'surfinia-kaskadowa',
        'name': 'Surfinia / Petunia kaskadowa',
        'nutrition': {   'key_benefits': 'Wieczorny, słodki aromat surfinii działa relaksująco na układ nerwowy, '
                                         'obniża poziom kortyzolu po ciężkim dniu pracy w mieście.',
                         'minerals': 'Antocyjany kwiatowe, flawonoidy',
                         'tags': ['Kojący aromat', 'Antystres', 'Estetyka biofilna', 'Wabi motyle'],
                         'vitamins': 'Olejki eteryczne o nucie waniliowo-goździkowej'},
        'orientations': ['S', 'SW', 'SE', 'W', 'SSE', 'SSW', 'S_W', 'S_E'],
        'plant_group': 'ozdobne',
        'pot': {   'drainage': 'Solidny 4 cm drenaż keramzytowy (nie toleruje zastoisk wody w korzeniach)',
                   'material': 'Wiszące amplie z podstawkiem, głębokie skrzynki balustradowe',
                   'min_depth_cm': 20,
                   'min_volume_l': 6,
                   'recommended_volume_l': 10},
        'schedule': {   '05_1': 'hartowanie',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '09_2': 'zbior',
                        '10_1': 'koniec_sezonu'},
        'soil': {   'fertilizer': 'Nawóz do surfinii ze zwiększoną dawką żelaza (Fe) i potasu przy każdym podlewaniu',
                    'ph': '5.5 - 6.2 (lekko kwaśne – zapobiega żółknięciu liści)',
                    'structure': 'Bardzo przepuszczalna, z domieszką perlitu i kory drobnej',
                    'type': 'Specjalistyczna ziemia do surfinii i petunii z chelatem żelaza'},
        'soil_layers': {   'drainage_cm': 4,
                           'drainage_material': 'Keramzyt ogrodniczy 4 cm i drożne otwory odpływowe',
                           'mulch_layer': 'Brak lub 1 cm perlitu',
                           'ph_range': '5.5 - 6.2 (lekko kwaśna)',
                           'separator_recommended': True,
                           'substrate_mix': '60% ziemia do surfinii (lekko kwaśna), 25% perlit, 15% kompost z '
                                            'dodatkiem żelaza schelatowanego',
                           'top_margin_cm': 3},
        'sources': [   'PoradnikOgrodniczy.pl: Surfinia na balkonie uprawa i nawożenie',
                       'Murator Ogród: Najlepsze odmiany surfinii kaskadowych'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 3,
                             'planting_method': 'Sadź do skrzynek z lekkim pochyleniem w stronę balustrady, by ułatwić '
                                                'pędom przewieszanie.',
                             'spacing_cm': 25,
                             'supports_needed': 'Wiszący kosz (amplia), skrzynka na balustradzie – pędy kaskadowo '
                                                'opadają w dół'},
        'spray_guide': {   'apply_label': 'Zalecana profilaktyka przeciw mączniakowi prawdziwemu',
                           'apply_sprays': 'tak_profilaktyka',
                           'intervention': [   'Oprysk biologicznym preparatem Limocide (olejek pomarańczowy) lub '
                                               'Lecitec w razie mączniaka.',
                                               'W razie mszyc: mydło potasowe z czosnkiem.'],
                           'preventive': [   'Oprysk profilaktyczny wyciągiem ze skrzypu lub roztworem drożdży '
                                             '(100g/10L) raz na 14 dni.',
                                             'Usuwanie sklejonych, przekwitłych płatków po deszczu.'],
                           'safety_note': 'Nigdy nie opryskuj kwiatów w pełnym słońcu – pryskaj o zmierzchu.'},
        'summary': 'Najbardziej spektakularna kaskada kwiatowa na słoneczny balkon. Tworzy pędy o długości nawet 1 '
                   'metra obsypane setkami trąbkowatych, pachnących kwiatów. Kocha słońce i obfite podlewanie.',
        'sun_preference': 'Mocne, bezpośrednie słońce (min. 6-8h dziennie)',
        'top_varieties': [   {   'badge': 'Potężna kaskada (do 120 cm)',
                                 'name': 'Purple Giant',
                                 'reason': 'Legendarna purpurowa odmiana o gigantycznym wigorze, setkach trąbkowatych '
                                           'kwiatów i zapachu wyczuwalnym wieczorem.'},
                             {   'badge': 'Zjawiskowy wzór galaktyki',
                                 'name': 'Night Sky',
                                 'reason': 'Ciemnofioletowe płatki usiane białymi plamkami niczym rozgwieżdżone nocne '
                                           'niebo; hit nowoczesnych aranżacji.'},
                             {   'badge': 'Neonowy róż',
                                 'name': 'Hot Pink',
                                 'reason': 'Jaskrawa, rzucająca się w oczy barwa z ciemniejszym żyłkowaniem; wybitnie '
                                           'odporna na upały.'},
                             {   'badge': 'Kompaktowa i zwarta',
                                 'name': 'Table White',
                                 'reason': 'Śnieżnobiałe, lekko pachnące kwiaty, gęsty pokrój mniej podatny na łamanie '
                                           'przez deszcze.'},
                             {   'badge': 'Trójbarwne pastele',
                                 'name': 'Sweetunia',
                                 'reason': 'Unikatowe odcienie koralowe i morelowe; samoczyszcząca się – przekwitłe '
                                           'kwiaty same zasychają i opadają.'}],
        'varieties': ['Purple Giant', 'Hot Pink', 'Table White', 'Night Sky (gwiaździsta)', 'Sweetunia'],
        'wind_tolerance': 'Średnia (długie pędy najlepiej chronić przed porywami powyżej 5. piętra)'},
    {   'category': 'Jasnotowate',
        'detailed_guide': '\n'
                          '### 1. Złota zasada podłoża: drenaż i wapno\n'
                          'Lawenda pochodzi z suchych, skalistych wzgórz Morza Śródziemnego. Nienawidzi żyznej, mokrej '
                          'ziemi. Zmieszaj uniwersalną ziemię pół na pół z piaskiem i drobnym żwirkiem. Dodaj garść '
                          'kredy malarskiej lub mączki wapiennej, by podnieść pH powyżej 7.0.\n'
                          '\n'
                          '### 2. Przycinanie – tajemnica gęstej kuli\n'
                          '- **Po kwitnieniu (sierpień):** Śetnij przekwitłe kłosy z kawałkiem zielonego pędu (zbierz '
                          'je do woreczków zapachowych do szafy!).\n'
                          '- **Wiosna (marzec/kwiecień):** Przytnij krzaczek o 1/3 długości, formując regularną '
                          'półkulę. *Uwaga:* Nigdy nie tnij do starego, bezlistnego drewna, bo roślina może nie '
                          'odbić.\n'
                          '\n'
                          '### 3. Zimowanie na balkonie\n'
                          'Lawenda wąskolistna jest w pełni mrozoodporna, ale w donicy ziemia może przemarznąć na '
                          'wskroś. Jesienią owiń doniczkę jutą lub folią bąbelkową i postaw na kawałku styropianu przy '
                          'ścianie budynku. W czasie zimowej odwilży podlej niewielką ilością wody (zimozielone liście '
                          'powoli transpirują wilgoć).\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (kocha słońce i suszę, nienawidzi przelewania)',
        'fertilizer_guide': {   'frequency': 'Maksymalnie 2 razy w sezonie: w maju i po przycięciu w lipcu',
                                'npk_focus': 'Wapń (Ca), potas (K), zero obfitego azotu',
                                'organic_options': [   'Szczypta mączki bazaltowej',
                                                       'Woda po gotowaniu jajek (bogata w wapń)',
                                                       'Popiół drzewny'],
                                'warnings': 'Przenawożona lawenda gubi zwarty pokrój, wylega i traci intensywny '
                                            'zapach!',
                                'what': 'Bardzo oszczędny nawóz wapniowo-potasowy lub odrobina popiołu drzewnego'},
        'id': 'lawenda-donica',
        'name': 'Lawenda wąskolistna w donicy',
        'nutrition': {   'key_benefits': 'Inhalacja aromatu lawendy stymuluje fale alfa w mózgu, redukuje bezsenność, '
                                         'lęki i migreny; kwiaty są jadalne i świetnie pasują do domowych lemoniad i '
                                         'ciasteczek.',
                         'minerals': 'Wapń, magnez, fitoncydy',
                         'tags': ['Głęboki sen', 'Aromaterapia', 'Odstrasza komary', 'Jadalne kwiaty'],
                         'vitamins': 'Linalol, octan linalilu, garbniki, kumaryny'},
        'orientations': ['S', 'SW', 'SE', 'W', 'SSE', 'SSW', 'S_W', 'S_E', 'DACH'],
        'plant_group': 'ozdobne',
        'pot': {   'drainage': 'Bardzo gruby drenaż 4-5 cm (żwir lub keramzyt) – stojąca woda to wyrok śmierci dla '
                               'lawendy',
                   'material': 'Donice z terakoty (gliniane nieszkliwione) – porowate ścianki odparowują wilgoć',
                   'min_depth_cm': 22,
                   'min_volume_l': 5,
                   'recommended_volume_l': 8},
        'schedule': {   '03_2': 'pielegnacja',
                        '04_1': 'sadzenie_balkon',
                        '05_1': 'pielegnacja',
                        '06_1': 'zbior',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'pielegnacja',
                        '09_1': 'pielegnacja',
                        '10_2': 'zimowanie_balkon',
                        '11_1': 'zimowanie_balkon'},
        'soil': {   'fertilizer': 'Bardzo skąpe zasilanie nawozem z wapniem i potasem (raz na 4-5 tygodni)',
                    'ph': '6.8 - 7.8 (zasadowe do obojętnego – nie toleruje gleb kwaśnych!)',
                    'structure': 'Bardzo przepuszczalna z domieszką piasku i drobnego grysu wapiennego',
                    'type': 'Lekkie, piaszczysto-żwirowe podłoże z dodatkiem wapna'},
        'soil_layers': {   'drainage_cm': 5,
                           'drainage_material': 'Żwir płukany lub keramzyt gruby 5 cm (maksymalny drenaż)',
                           'mulch_layer': 'Jasny żwirek marmurowy lub wapienny (odbija słońce i doświetla krzaczek od '
                                          'dołu)',
                           'ph_range': '7.0 - 7.8 (zasadowa – lubi wapń!)',
                           'separator_recommended': True,
                           'substrate_mix': '40% ziemia ogrodnicza, 30% piasek gruby rzeczny, 20% żwirek wapienny, 10% '
                                            'perlit + szczypta wapna ogrodniczego',
                           'top_margin_cm': 3},
        'sources': ['Działkowiec: Uprawa lawendy w pojemnikach', 'Zielone Pogotowie: Cięcie i pielęgnacja lawendy'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 4,
                             'planting_method': 'Sadź do terakotowej donicy o średnicy min. 22-25 cm.',
                             'spacing_cm': 30,
                             'supports_needed': 'Brak – sztywny, drewniejący półkrzew'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (naturalny repelent i roślina bezproblemowa)',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Brak – szkodniki omijają lawendę ze względu na stężenie linalolu.'],
                           'preventive': [   'Utrzymywanie suchej ziemi i brak stojącej wody to 100% ochrony przed '
                                             'zgnilizną korzeni.'],
                           'safety_note': 'Kwiaty zbieraj w suchy, słoneczny poranek, gdy połowa pąków w kłosie jest '
                                          'otwarta.'},
        'summary': 'Kawałek Prowansji na Twoim balkonie. Srebrzyste liście, szafirowo-fioletowe kłosy i zniewalający '
                   'zapach, który uspokaja zmysły, wabi pożyteczne trzmiele, a skutecznie odstrasza komary i mszyce.',
        'sun_preference': 'Maksymalne słońce (>6-8h)',
        'top_varieties': [   {   'badge': 'Głęboki fiolet i zwartość',
                                 'name': 'Hidcote Blue',
                                 'reason': 'Najpopularniejsza odmiana do pojemników; intensywnie szafirowo-fioletowe '
                                           'kłosy, zwarty krzaczek do 40 cm.'},
                             {   'badge': 'Wczesna i mrozoodporna',
                                 'name': 'Munstead',
                                 'reason': 'Kwitnie już od czerwca, jaśniejszy lawendowy błękit, wyjątkowo odporna na '
                                           'mroźne zimy na balkonie.'},
                             {   'badge': 'Pstre biało-zielone liście',
                                 'name': 'Platinum Blonde',
                                 'reason': 'Spektakularna dekoracja nawet poza okresem kwitnienia dzięki kremowo '
                                           'obrzeżonym igiełkowatym liściom.'},
                             {   'badge': 'Super karłowa (25 cm)',
                                 'name': 'Dwarf Blue',
                                 'reason': 'Stworzona do małych mis i doniczek parapetowych; nie ogałaca się od dołu.'},
                             {   'badge': 'Pastelowy pudrowy róż',
                                 'name': 'Rosea',
                                 'reason': 'Nietypowa różowa barwa kwiatów o bardzo słodkim, miodowym aromacie '
                                           'przyciągającym pszczoły murarki.'}],
        'varieties': ['Hidcote Blue', 'Munstead', 'Platinum Blonde', 'Dwarf Blue', 'Rosea (różowa)'],
        'wind_tolerance': 'Bardzo wysoka (wąskie, srebrzyste liście doskonale znoszą wiatry)'},
    {   'category': 'Astrowate',
        'detailed_guide': '\n'
                          '### 1. Znakomite sąsiedztwo dla warzyw\n'
                          'Aksamitka to najlepszy bio-ochroniarz warzyw na balkonie! Posadź ją w tej samej skrzynce co '
                          'pomidory, paprykę lub fasolę. Jej specyficzny zapach dezorientuje szkodniki, a substancje '
                          'korzeniowe oczyszczają ziemię z patogenów glebowych.\n'
                          '\n'
                          '### 2. Siew i sadzenie\n'
                          'Możesz wysiać ją wprost do skrzynki w kwietniu/maju lub kupić gotową, kwitnącą rozsadę. '
                          'Przyjmuje się błyskawicznie w każdym podłożu.\n'
                          '\n'
                          '### 3. Jadalne płatki\n'
                          "Płatki aksamitki są w 100% jadalne i stanowią tzw. 'szafran dla ubogich'. Zawierają ogromne "
                          'ilości luteiny, barwią potrawy na złocisty kolor i świetnie smakują w sałatkach oraz '
                          'zupach.\n'
                          '        ',
        'difficulty': 1,
        'difficulty_label': 'Bardzo łatwa (pancerna roślina sanitarna)',
        'fertilizer_guide': {   'frequency': 'Co 2-3 tygodnie',
                                'npk_focus': 'Umiarkowany potas i fosfor',
                                'organic_options': ['Biohumus', 'Herbatka kompostowa'],
                                'warnings': 'Unikaj nadmiaru azotu, który prowadzi do bujnych liści kosztem kwiatów.',
                                'what': 'Nawóz uniwersalny do roślin kwitnących lub biohumus'},
        'id': 'aksamitka-niska',
        'name': 'Aksamitka niska / Tagetes',
        'nutrition': {   'key_benefits': 'Wybitna dawka luteiny z jadalnych płatków regeneruje plamkę żółtą oka i '
                                         'chroni wzrok przed niebieskim światłem monitorów i smartfonów.',
                         'minerals': 'Tiofen (substancja fitosanitarna), flawonoidy, karotenoidy',
                         'tags': ['Luteina na wzrok', 'Fitoremediacja', 'Bio-ochrona warzyw', 'Jadalne płatki'],
                         'vitamins': 'Luteina (rekordowe stężenie!), zeaksantyna, witamina C'},
        'orientations': ['S', 'SW', 'SE', 'E', 'W', 'SSE', 'SSW'],
        'plant_group': 'ozdobne',
        'pot': {   'drainage': '2-3 cm keramzytu',
                   'material': 'Dowolne skrzynki balkonowe, doniczki lub misy',
                   'min_depth_cm': 15,
                   'min_volume_l': 2,
                   'recommended_volume_l': 4},
        'schedule': {   '04_1': 'siew_donica',
                        '04_2': 'siew_donica',
                        '05_1': 'sadzenie_balkon',
                        '06_1': 'zbior',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zbior',
                        '10_2': 'koniec_sezonu'},
        'soil': {   'fertilizer': 'Wystarczy raz na 3 tygodnie nawóz do roślin kwitnących',
                    'ph': '6.0 - 7.2',
                    'structure': 'Średnio zwięzła, przepuszczalna',
                    'type': 'Uniwersalna ziemia ogrodnicza'},
        'soil_layers': {   'drainage_cm': 2,
                           'drainage_material': 'Keramzyt ogrodniczy 2 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 7.2',
                           'separator_recommended': False,
                           'substrate_mix': '75% uniwersalna ziemia ogrodnicza, 15% perlit, 10% kompost',
                           'top_margin_cm': 2},
        'sources': [   'Działkowiec: Aksamitka roślina sanitarna i ozdobna',
                       'PoradnikOgrodniczy.pl: Aksamitki w skrzynkach balkonowych'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 3,
                             'max_plants_per_standard_box_60cm': 4,
                             'planting_depth_cm': 1,
                             'planting_method': 'Sadzenie co 15 cm lub wysiew nasion na głębokość 0.5-1 cm.',
                             'spacing_cm': 15,
                             'supports_needed': 'Brak – krępe, mocne łodyżki'},
        'spray_guide': {   'apply_label': 'Opryski zbędne (roślina fitosanitarna sama odstrasza szkodniki)',
                           'apply_sprays': 'zbedne',
                           'intervention': ['Usuwanie przekwitłych kwiatostanów dla stymulacji nowego kwitnienia.'],
                           'preventive': [   'Aksamitka sama chroni inne rośliny na balkonie przed mszycami i '
                                             'nicieniami.'],
                           'safety_note': 'Zero konieczności stosowania chemii.'},
        'summary': 'Pancerna sanitariuszka balkonu. Kwitnie niezmordowanie od maja aż do mrozów. Jej korzenie '
                   'wydzielają naturalny tiofen, który niszczy szkodliwe nicienie w glebie, a zapach ziela odstrasza '
                   'mszyce i mączliki od sąsiadujących pomidorów.',
        'sun_preference': 'Słońce lub półcień (3-6h)',
        'top_varieties': [   {   'badge': 'Polska niezawodna',
                                 'name': 'Carmen',
                                 'reason': 'Mahoniowo-czerwone płatki z żółtą falbanką; kwitnie niezmordowanie od maja '
                                           'do listopada.'},
                             {   'badge': 'Soczysty pomarańcz',
                                 'name': 'Orange Boy',
                                 'reason': 'Wielkie, pełne koszyczki kwiatowe wyglądające jak małe pompony, dorasta do '
                                           '20-25 cm.'},
                             {   'badge': 'Super niska miniatura',
                                 'name': 'Petit Bonita',
                                 'reason': 'Tworzy zwartą, ukwieconą poduszeczkę idealną do obwódek skrzynek z '
                                           'pomidorami i papryką.'},
                             {   'badge': 'Cytrynowo-żółta',
                                 'name': 'Cupido',
                                 'reason': 'Jasnożółte, słoneczne kwiaty, doskonała do rozjaśniania balkonów '
                                           'wschodnich i zachodnich.'},
                             {   'badge': 'Aksamitka wąskolistna cytrynowa',
                                 'name': 'Lulu',
                                 'reason': 'Drobniutkie, pierzaste listki o intensywnym zapachu skórki cytrynowej i '
                                           'setki miniaturowych kwiatuszków.'}],
        'varieties': ['Carmen', 'Petit Bonita', 'Orange Boy', 'Cupido', 'Lulu (wąskolistna)'],
        'wind_tolerance': 'Bardzo wysoka (niska, krępa budowa)'},
    {   'category': 'Begoniowate',
        'detailed_guide': '\n'
                          '### 1. Stanowisko – raj w półcieniu\n'
                          'Begonia nienawidzi palącego, południowego słońca, które natychmiast parzy jej grube, '
                          'soczyste liście. Najlepiej czuje się na balkonach z porannym słońcem (wschód) lub ze '
                          'światłem rozproszonym (północ, loggia).\n'
                          '\n'
                          '### 2. Podlewanie od dołu\n'
                          'Podlewaj delikatnie do podstawka lub bezpośrednio na ziemię pod liśćmi. Nigdy nie polewaj '
                          'wody na kwiaty ani do środka rozety, co mogłoby wywołać szarą pleśń.\n'
                          '\n'
                          '### 3. Zimowanie bulw\n'
                          'Begonie bulwiaste można bez trudu przezimować! W październiku przed przymrozkami wykop '
                          'bulwy, oczyść z liści, przesusz i przechowaj w suchym torfie w piwnicy (5-10°C). W marcu '
                          'posadź do nowej doniczki na parapecie.\n'
                          '        ',
        'difficulty': 2,
        'difficulty_label': 'Łatwa (zbawienie dla cienistych balkonów)',
        'fertilizer_guide': {   'frequency': 'Co 10-14 dni od końca maja do września',
                                'npk_focus': 'Umiarkowany azot, wysoki potas (K) i fosfor (P)',
                                'organic_options': ['Płynny biohumus dżdżownicowy', 'Wyciąg ze skórek bananów'],
                                'warnings': 'Nigdy nie nawoź przesuszonej bryły korzeniowej – najpierw podlej czystą '
                                            'wodą!',
                                'what': 'Nawóz płynny do begonii i roślin kwitnących o podwyższonej zawartości potasu'},
        'id': 'begonia-stale-kwitnaca',
        'name': 'Begonia bulwiasta i stale kwitnąca',
        'nutrition': {   'key_benefits': 'Płatki niektórych begonii bulwiastych są chrupiące i lekko kwaskowate (jak '
                                         'szczaw); roślina filtruje miejski pył zawieszony PM10 na powierzchni '
                                         'mięsistych liści.',
                         'minerals': 'Antocyjany, śluzy roślinne',
                         'tags': ['Oczyszcza z pyłów', 'Królowa cienia', 'Soczyste liście', 'Długowieczna'],
                         'vitamins': 'Kwas szczawiowy, witamina C (w płatkach)'},
        'orientations': ['N', 'E', 'NE', 'NW', 'PATIO'],
        'plant_group': 'ozdobne',
        'pot': {   'drainage': '3 cm keramzytu (korzenie begonii łatwo gniją przy stojącej wodzie)',
                   'material': 'Misy, podłużne korytka balkonowe, donice wiszące',
                   'min_depth_cm': 16,
                   'min_volume_l': 3,
                   'recommended_volume_l': 6},
        'schedule': {   '03_1': 'rozsada_dom',
                        '04_2': 'hartowanie',
                        '05_1': 'hartowanie',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zimowanie_dom'},
        'soil': {   'fertilizer': 'Płynny nawóz do begonii lub roślin kwitnących co 10-14 dni',
                    'ph': '5.5 - 6.5',
                    'structure': 'Pulchna, chłonna, bogata w materię organiczną z dodatkiem perlitu',
                    'type': 'Żyzna, lekka ziemia próchnicza o lekko kwaśnym odczynie'},
        'soil_layers': {   'drainage_cm': 3,
                           'drainage_material': 'Keramzyt 3 cm i drożne otwory w dnie korytka',
                           'mulch_layer': 'Brak',
                           'ph_range': '5.5 - 6.5 (lekko kwaśna)',
                           'separator_recommended': True,
                           'substrate_mix': '65% lekka ziemia próchnicza/torfowa, 25% perlit (napowietrzenie korzeni), '
                                            '10% biohumus',
                           'top_margin_cm': 2.5},
        'sources': [   'Murator Ogród: Rośliny do cienia na balkon',
                       'Działkowiec: Uprawa begonii bulwiastej w pojemnikach'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 2,
                             'max_plants_per_standard_box_60cm': 3,
                             'planting_depth_cm': 3,
                             'planting_method': 'Bulwy sadź wgłębieniem (oczkiem) ku górze, przykrywając zaledwie 2 cm '
                                                'ziemi.',
                             'spacing_cm': 20,
                             'supports_needed': 'Brak (lub krótki bambusik podtrzymujący wielkie kwiatostany odmian '
                                                'pełnych)'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie deszczu przeciw szarej pleśni',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': [   'Oprysk biologicznym preparatem Polyversum WP lub Fungilitis w razie '
                                               'pleśni.'],
                           'preventive': [   'Podlewanie wyłącznie pod korzeń, zero zwilżania liści i pąków.',
                                             'Usuwanie przekwitłych kwiatostanów, by nie zagniwały na wilgotnych '
                                             'liściach.'],
                           'safety_note': 'Kruche pędy begonii wymagają ostrożności podczas prac pielęgnacyjnych.'},
        'summary': 'Uratuje każdy cienisty, północny lub wschodni balkon. Tam, gdzie pelargonie i surfinie wyciągają '
                   'się i marnieją z braku słońca, begonia kwitnie jak z bajki, czarując mięsistymi liśćmi i barwnymi '
                   'kwiatami.',
        'sun_preference': 'Półcień lub cień (2-4h rozproszonego światła)',
        'top_varieties': [   {   'badge': 'Olbrzymie pełne kwiaty',
                                 'name': 'Nonstop Joy Yellow',
                                 'reason': 'Królowa półcienia; ogromne, żółte kwiaty przypominające miniaturowe róże '
                                           'kwitnące bez przerwy.'},
                             {   'badge': 'Skrzydła smoka (do 50 cm)',
                                 'name': 'Dragon Wing Red',
                                 'reason': 'Mocarz o błyszczących liściach w kształcie skrzydeł smoka i szkarłatnych '
                                           'gronach kwiatów.'},
                             {   'badge': 'Zwisająca kaskada do cienia',
                                 'name': 'Illumination Apricot',
                                 'reason': 'Morelowo-łososiowe pędy przewieszające się ze skrzynek na balkonach '
                                           'północnych i wschodnich.'},
                             {   'badge': 'Niska stale kwitnąca',
                                 'name': 'Super Olympia',
                                 'reason': 'Klasyczna, drobna begonia o mięsistych zielonych listkach i pastelowych '
                                           'kwiatkach.'},
                             {   'badge': 'Czekoladowe liście',
                                 'name': 'Bada Boom',
                                 'reason': 'Ciemnobrązowe, antocyjanowe liście tworzące niesamowity kontrast z '
                                           'jaskrawobiałymi i różowymi kwiatami.'}],
        'varieties': ['Nonstop Joy Yellow', 'Dragon Wing Red', 'Illumination Apricot', 'Super Olympia', 'Bada Boom'],
        'wind_tolerance': 'Średnia (mięsiste, kruche pędy nie lubią silnych wichur)'},
    {   'category': 'Wiesiołkowate',
        'detailed_guide': '\n'
                          '### 1. Warunki idealne – unikaj południowego skwaru!\n'
                          'W temperaturach powyżej 28°C i w pełnym słońcu fuksja cierpi na szok termiczny: zrzuca pąki '
                          'i więdnie, nawet gdy ziemia jest mokra. Postaw ją lub zawieś na balkonie północnym, '
                          'wschodnim lub głęboko w cieniu zadaszonej loggii.\n'
                          '\n'
                          '### 2. Podlewanie i zraszanie\n'
                          'Ziemia musi być stale umiarkowanie wilgotna (jak wyciśnięta gąbka). W upalne wieczory '
                          'fuksja uwielbia delikatne zraszanie mgiełką wodną dookoła rośliny (ale nie po samych '
                          'kwiatach).\n'
                          '\n'
                          '### 3. Zimowanie\n'
                          'Fuksje można z powodzeniem zimować przez wiele lat! Przed pierwszymi mrozami przytnij pędy '
                          'o połowę, oberwij pozostałe liście i przenieś roślinę do chłodnej piwnicy lub garażu '
                          '(5-8°C). Może stać nawet w całkowitym mroku. Podlewaj raz w miesiącu, by korzenie nie '
                          'wyschły na pył. W marcu przenieś na jasny parapet – roślina wypuści setki nowych pąków.\n'
                          '        ',
        'difficulty': 3,
        'difficulty_label': 'Średnia (baletnica cienia, nienawidzi upałów i przesuszenia)',
        'fertilizer_guide': {   'frequency': 'Co 7-10 dni od maja do końca sierpnia',
                                'npk_focus': 'Wysoki potas (K) i fosfor (P), umiarkowany azot',
                                'organic_options': [   'Płynny biohumus',
                                                       'Wyciąg ze skórek bananów',
                                                       'Nawóz ze skrzypu polnego'],
                                'warnings': 'Od września zaprzestań zasilania, aby pędy zdążyły zdrewnieć przed '
                                            'zimowaniem.',
                                'what': 'Nawóz płynny z przewagą potasu i fosforu oraz mikroskładnikami (żelazo, '
                                        'mangan)'},
        'id': 'fuksja-zwisajaca',
        'name': 'Fuksja ułanka zwisająca',
        'nutrition': {   'key_benefits': 'Kontakt z wiszącymi kwiatami fuksji obniża tętno i relaksuje wzrok; owoce '
                                         '(jagody) fuksji po przekwitnięciu są słodkie i jadalne (stosowane w dżemach '
                                         'w Nowej Zelandii).',
                         'minerals': 'Antocyjany, flawonoidy',
                         'tags': ['Jadalne jagody', 'Relaks biofilny', 'Baletnica cienia', 'Długowieczna bylina'],
                         'vitamins': 'Witamina C, przeciwutleniacze w jadalnych jagodach'},
        'orientations': ['N', 'E', 'NE', 'NW', 'PATIO'],
        'plant_group': 'ozdobne',
        'pot': {   'drainage': 'Gruby drenaż 3-4 cm keramzytu (stojąca woda zabija korzenie)',
                   'material': 'Wiszące donice (amplie), ścienne kieszenie uprawowe, skrzynki w loggiach',
                   'min_depth_cm': 18,
                   'min_volume_l': 4,
                   'recommended_volume_l': 7},
        'schedule': {   '04_2': 'hartowanie',
                        '05_1': 'hartowanie',
                        '05_2': 'sadzenie_balkon',
                        '06_1': 'pielegnacja',
                        '06_2': 'zbior',
                        '07_1': 'zbior',
                        '07_2': 'zbior',
                        '08_1': 'zbior',
                        '08_2': 'zbior',
                        '09_1': 'zbior',
                        '10_1': 'zimowanie_dom'},
        'soil': {   'fertilizer': 'Nawóz do fuksji lub roślin kwitnących z mikroelementami co 7 dni od maja do '
                                  'sierpnia',
                    'ph': '6.0 - 6.5',
                    'structure': 'Lekka, stale umiarkowanie wilgotna, dobrze napowietrzona',
                    'type': 'Żyzna, próchnicza ziemia z dodatkiem torfu odkwaszonego i perlitu'},
        'soil_layers': {   'drainage_cm': 3.5,
                           'drainage_material': 'Keramzyt ogrodniczy 3.5 cm',
                           'mulch_layer': 'Brak',
                           'ph_range': '6.0 - 6.5',
                           'separator_recommended': True,
                           'substrate_mix': '65% ziemia próchnicza bogata w kompost, 25% perlit dla dotlenienia '
                                            'korzeni, 10% biohumus',
                           'top_margin_cm': 2.5},
        'sources': [   'PoradnikOgrodniczy.pl: Fuksja na balkonie uprawa i zimowanie',
                       'Działkowiec: Zwisające kwiaty do cienia'],
        'spacing_guide': {   'max_plants_per_round_pot_30cm': 1,
                             'max_plants_per_standard_box_60cm': 2,
                             'planting_depth_cm': 3,
                             'planting_method': 'Sadź do wiszącego kosza (amplia) lub skrzynki pod osłoną ściany.',
                             'spacing_cm': 25,
                             'supports_needed': 'Wisząca donica z łańcuszkiem lub haczykiem; pędy malowniczo opadają'},
        'spray_guide': {   'apply_label': 'Interwencyjnie w razie mączlika szklarniowego lub przędziorków',
                           'apply_sprays': 'w_razie_potrzeby',
                           'intervention': [   'Żółte tablice lepowe zawieszone w pobliżu donicy wyłapujące dorosłe '
                                               'mączliki.',
                                               'Oprysk olejem neem (0.5%) lub mydłem potasowym (15g/L wody).'],
                           'preventive': [   'Utrzymywanie wilgotnego mikroklimatu (mączliki i przędziorki atakują w '
                                             'suchym powietrzu).',
                                             'Zraszanie otoczenia donicy wieczorem.'],
                           'safety_note': 'Pryskaj wyłącznie wieczorem od spodu liści, gdzie żerują szkodniki.'},
        'summary': 'Prawdziwa baletnica cienistego balkonu. Jej niezwykłe, dwubarwne dzwonkowate kwiaty z długimi '
                   'pręcikami przypominają tańczące w powietrzu wróżki. Nie znosi żaru południa, za to uwielbia chłód '
                   'i wilgotne powietrze wschodnich loggii.',
        'sun_preference': 'Półcień, cień, światło przefiltrowane (2-4h rano lub późnym popołudniem)',
        'top_varieties': [   {   'badge': 'Klasyczna baletnica',
                                 'name': 'Swingtime',
                                 'reason': 'Czerwone działki kielicha i śnieżnobiała, pełna spódniczka; wybitna '
                                           'odporność i gigantyczna masa kwiatów.'},
                             {   'badge': 'Rekordowo wielkie kwiaty',
                                 'name': 'Bella Rosella',
                                 'reason': 'Kwiaty wielkości małego jabłka w odcieniach purpury i fuksjowego różu; '
                                           'zapiera dech w piersiach.'},
                             {   'badge': 'Ciemny fiolet i biel',
                                 'name': 'Deep Purple',
                                 'reason': 'Niezwykle elegancka odmiana kaskadowa o gęstych pędach przewieszających '
                                           'się z kosza.'},
                             {   'badge': 'Czysta perłowa biel',
                                 'name': 'Annabel',
                                 'reason': 'Delikatne, pastelowe kwiaty rozjaśniające najciemniejsze zakątki balkonów '
                                           'północnych.'},
                             {   'badge': 'Kompaktowa krzaczasta',
                                 'name': 'Tom Thumb',
                                 'reason': 'Wzniesiona miniatura o drobnych, dwubarwnych dzwoneczkach; wyższa '
                                           'tolerancja na chłód.'}],
        'varieties': ['Swingtime', 'Bella Rosella', 'Deep Purple', 'Annabel', 'Tom Thumb'],
        'wind_tolerance': 'Niska do średniej (wiszące dzwonki mogą obrywać się przy porywistym wietrze)'}]
