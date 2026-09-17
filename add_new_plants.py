import json

new_plants = [
    {
        "category": "Bobowate",
        "detailed_guide": "\n### 1. Wysiew i produkcja (Kwiecień)\nGroszek cukrowy to warzywo chłodnego klimatu. Wysiewaj nasiona bezpośrednio do skrzynek balkonowych na przełomie marca i kwietnia. Przed siewem namocz nasiona w letniej wodzie przez 24 godziny, aby przyspieszyć kiełkowanie.\n\n### 2. Pielęgnacja na balkonie\n- **Podpory:** Wymaga kratek, tyczek bambusowych lub siatki, po której będzie się pął. Wersje karłowe potrzebują niższych podpór (ok. 60-80 cm).\n- **Podlewanie:** Ziemia musi być stale lekko wilgotna, zwłaszcza w czasie kwitnienia i wiązania strąków.\n\n### 3. Złote zasady:\n• Groszek nie znosi upałów – najlepiej rośnie wiosną, w lipcu zazwyczaj kończy wegetację.\n• Odmiany cukrowe można jeść w całości (razem ze strąkiem), są niezwykle słodkie prosto z krzaka.",
        "difficulty": 2,
        "difficulty_label": "Łatwy (idealny dla początkujących i dzieci)",
        "fertilizer_guide": {
            "frequency": "Rzadko, co 3-4 tygodnie",
            "npk_focus": "Niski azot (bobowate same wiążą azot z powietrza), fosfor i potas",
            "organic_options": ["Mączka bazaltowa (fosfor i potas)", "Kompost"],
            "warnings": "Nie stosuj nawozów azotowych! Zbyt dużo azotu to bujne liście kosztem kwiatów i strąków.",
            "what": "Nawóz organiczny ubogi w azot lub gnojówka z żywokostu."
        },
        "id": "groszek-cukrowy",
        "name": "Groszek cukrowy (pnący i karłowy)",
        "nutrition": {
            "key_benefits": "Świetna, zdrowa przekąska dla dzieci na surowo prosto z balkonu. Wspiera układ trawienny i krwionośny.",
            "minerals": "Żelazo, magnez, fosfor, cynk",
            "tags": ["Białko", "Błonnik", "Witamina C", "Dla dzieci"],
            "vitamins": "Witamina C, K, A, kwas foliowy"
        },
        "orientations": ["E", "W", "SE", "SW", "S"],
        "plant_group": "warzywa",
        "pot": {
            "drainage": "Otwory w dnie, warstwa keramzytu 3 cm",
            "material": "Dowolny (najlepiej długie skrzynki)",
            "min_depth_cm": 20,
            "min_volume_l": 10,
            "recommended_volume_l": 15
        },
        "schedule": {
            "03_2": "sadzenie",
            "04_1": "sadzenie",
            "04_2": "rosnie",
            "05_1": "rosnie",
            "05_2": "kwitnie",
            "06_1": "zbior",
            "06_2": "zbior",
            "07_1": "zbior",
            "07_2": "odpoczynek"
        },
        "soil_ph": ["Obojętna (6.5 - 7.0)", "Zasadowa (7.0 - 7.5)"],
        "sowing_guide": {
            "container": "Skrzynka balkonowa z kratką",
            "depth_cm": 3.0,
            "indoors_weeks_before_last_frost": 0,
            "soil_temp_c": 10,
            "spacing_cm": 5
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 6,
            "max_plants_per_standard_box_60cm": 15,
            "min_spacing_cm": 4,
            "root_depth_category": "plytki"
        },
        "varieties": [
            {"features": "Wczesna, słodka, niska", "name": "Bajka (karłowa)"},
            {"features": "Brak pergaminowej wyściółki, wysoki", "name": "Iłówiecki"}
        ],
        "water_needs": "Średnie",
        "water_needs_level": 3
    },
    {
        "category": "Kapustowate",
        "detailed_guide": "\n### 1. Wysiew i produkcja\nKapusta Pak Choi (bok choy) to orientalne warzywo chłodnego sezonu. W Polsce najlepiej rośnie uprawiana na zbiór wiosenny lub jesienny. Długi dzień i upały (w czerwcu i lipcu) powodują szybkie wybijanie w pędy kwiatowe.\n\n### 2. Pielęgnacja na balkonie\n- **Podlewanie:** Pak Choi ma płytki system korzeniowy i ogromne liście. Wymaga regularnego, umiarkowanego podlewania. Ziemia nie może przeschnąć, inaczej liście zwiędną i zgorzknieją.\n- **Zbiory:** Można zbierać całe rozety po ok. 40-50 dniach od siewu lub odrywać pojedyncze zewnętrzne liście na bieżąco.\n\n### 3. Złote zasady:\n• Wysiewaj w kwietniu na wiosenny zbiór lub w sierpniu na jesienny.\n• Użyj siatki o drobnych oczkach, aby uchronić kapustę przed pchełkami ziemnymi i bielinkiem.",
        "difficulty": 2,
        "difficulty_label": "Łatwy (wymaga chłodnej wiosny lub jesieni)",
        "fertilizer_guide": {
            "frequency": "Co 2 tygodnie",
            "npk_focus": "Więcej azotu dla rozwoju zielonej masy",
            "organic_options": ["Biohumus", "Gnojówka z pokrzywy (w rozcieńczeniu)"],
            "warnings": "Unikaj nawożenia mineralnego tuż przed zbiorem.",
            "what": "Nawóz naturalny do warzyw liściowych."
        },
        "id": "pak-choi",
        "name": "Kapusta Pak Choi",
        "nutrition": {
            "key_benefits": "Niskokaloryczne źródło antyoksydantów i glukozynolanów o działaniu przeciwnowotworowym.",
            "minerals": "Wapń (bardzo dobrze przyswajalny), żelazo, magnez",
            "tags": ["Wapń", "Antyoksydanty", "Witamina C", "Superfood"],
            "vitamins": "Witamina A, C, K, B6"
        },
        "orientations": ["E", "W", "NE", "NW"],
        "plant_group": "warzywa",
        "pot": {
            "drainage": "Otwory w dnie",
            "material": "Plastik lub donice kompozytowe (lepiej trzymają wilgoć)",
            "min_depth_cm": 15,
            "min_volume_l": 5,
            "recommended_volume_l": 10
        },
        "schedule": {
            "03_2": "sadzenie",
            "04_1": "sadzenie",
            "04_2": "rosnie",
            "05_1": "rosnie",
            "05_2": "zbior",
            "06_1": "zbior",
            "08_1": "sadzenie",
            "08_2": "rosnie",
            "09_1": "rosnie",
            "09_2": "zbior",
            "10_1": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)", "Obojętna (6.5 - 7.0)"],
        "sowing_guide": {
            "container": "Skrzynka lub płaska donica",
            "depth_cm": 1.0,
            "indoors_weeks_before_last_frost": 0,
            "soil_temp_c": 15,
            "spacing_cm": 15
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 3,
            "max_plants_per_standard_box_60cm": 4,
            "min_spacing_cm": 15,
            "root_depth_category": "plytki"
        },
        "varieties": [
            {"features": "Oryginalna, duże białe ogonki", "name": "Canton White"},
            {"features": "Mniejsza, bardziej chrupka, zielone ogonki", "name": "Bonsai"}
        ],
        "water_needs": "Wysokie",
        "water_needs_level": 4
    },
    {
        "category": "Rutowate",
        "detailed_guide": "\n### 1. Specyfika uprawy na balkonie\nKumkwat to jeden z najbardziej mrozoodpornych cytrusów i wspaniała ozdoba słonecznego balkonu w lecie. Jego wyjątkowość polega na tym, że owoce zjada się ze słodką skórką, podczas gdy miąższ jest kwaśny.\n\n### 2. Pielęgnacja na balkonie\n- **Zimowanie:** Kumkwat wytrzymuje krótkotrwałe spadki do -5°C, ale na zimę musi być przeniesiony do jasnego, chłodnego pomieszczenia (5-10°C). W cieplejszym mieszkaniu gubi liście.\n- **Stanowisko:** Uwielbia pełne słońce i miejsca osłonięte od wiatru.\n- **Podlewanie:** Ziemia w doniczce powinna być wilgotna, ale nie mokra. Należy podlewać miękką wodą (np. przegotowaną, odstaną lub deszczówką), aby nie zakwasić nadmiernie podłoża.\n\n### 3. Ciekawostki:\nKwitnie intensywnie pachnącymi, białymi kwiatami zazwyczaj w pełni lata. Zawiązane latem owoce dojrzewają aż do wiosny następnego roku.",
        "difficulty": 4,
        "difficulty_label": "Trudny (wymaga zimowania w domu w chłodzie)",
        "fertilizer_guide": {
            "frequency": "Co 1-2 tygodnie w sezonie letnim",
            "npk_focus": "Zrównoważony z dodatkiem mikroelementów (szczególnie żelaza)",
            "organic_options": ["Specjalistyczny nawóz bio do cytrusów"],
            "warnings": "Niedobór żelaza objawia się szybko w postaci żółknących liści z zielonymi nerwami (chloroza). Zimą zaprzestań nawożenia.",
            "what": "Nawóz płynny dedykowany do roślin cytrusowych."
        },
        "id": "kumkwat-cytrus",
        "name": "Kumkwat (drzewko cytrusowe)",
        "nutrition": {
            "key_benefits": "Jedzony ze skórką, dostarcza ogromnej ilości błonnika i olejków eterycznych o działaniu przeciwbakteryjnym.",
            "minerals": "Magnez, wapń, potas",
            "tags": ["Cytrus", "Olejki eteryczne", "Witamina C", "Błonnik"],
            "vitamins": "Witamina C (bardzo duże ilości), witamina A"
        },
        "orientations": ["S", "SW", "SE"],
        "plant_group": "owoce",
        "pot": {
            "drainage": "Bardzo gruby drenaż (5 cm), otwory w dnie",
            "material": "Ciężka terakota (zapobiega wywróceniu przez wiatr)",
            "min_depth_cm": 30,
            "min_volume_l": 15,
            "recommended_volume_l": 25
        },
        "schedule": {
            "04_1": "odpoczynek",
            "05_1": "sadzenie",
            "06_1": "rosnie",
            "07_1": "kwitnie",
            "08_1": "rosnie",
            "09_1": "rosnie",
            "10_1": "zimowanie",
            "11_1": "zimowanie"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)"],
        "sowing_guide": {
            "container": "Duża, głęboka donica",
            "depth_cm": 0,
            "indoors_weeks_before_last_frost": 0,
            "soil_temp_c": 20,
            "spacing_cm": 100
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 0,
            "min_spacing_cm": 40,
            "root_depth_category": "gleboki"
        },
        "varieties": [
            {"features": "Owalne owoce, zjadane ze skórką, najbardziej popularny", "name": "Margarita (Fortunella margarita)"},
            {"features": "Owoce okrągłe, słodsze", "name": "Japonica"}
        ],
        "water_needs": "Średnie",
        "water_needs_level": 3
    },
    {
        "category": "Morwowate",
        "detailed_guide": "\n### 1. Specyfika uprawy na balkonie\nFigowiec właściwy (Figa) świetnie radzi sobie w uprawie doniczkowej, ponieważ ograniczenie przestrzeni dla korzeni stymuluje roślinę do szybszego wejścia w owocowanie. Balkon południowy, gdzie ściany oddają ciepło, to idealne stanowisko.\n\n### 2. Pielęgnacja na balkonie\n- **Owoce:** Figa rodzi w Polsce owocostany dwa razy – pierwsze z pąków zawiązanych jesienią (dojrzewają w lipcu) i drugie latem (nie zawsze zdążą dojrzeć). Zawiązuje owoce partenokarpicznie (bez zapylania)!\n- **Zimowanie:** W uprawie doniczkowej trzeba chować figę na zimę (np. do nieogrzewanego garażu lub jasnej piwnicy) przy temperaturze 0-5°C. Figa gubi liście na zimę, więc światło w czasie spoczynku nie jest niezbędne.\n- **Podlewanie:** Bardzo obfite w letnie upały (ma wielkie liście z których szybko paruje woda).\n\n### 3. Cięcie:\nWiosną warto delikatnie przyciąć wierzchołki, by drzewko się zagęściło i pozostało kompaktowe.",
        "difficulty": 3,
        "difficulty_label": "Średni (potrzebuje zimowania, ale jest odporny)",
        "fertilizer_guide": {
            "frequency": "Co 2-3 tygodnie od maja do lipca",
            "npk_focus": "Przewaga potasu na rzecz owocowania",
            "organic_options": ["Nawóz z alg", "Mączka bazaltowa", "Obornik granulowany wkopany w ziemię"],
            "warnings": "Od sierpnia zaprzestań nawożenia, by drewno zdrewniało przed zimą.",
            "what": "Zbilansowany nawóz do owocowych krzewów w płynie."
        },
        "id": "figowiec",
        "name": "Figowiec pospolity (Figa jadalna)",
        "nutrition": {
            "key_benefits": "Świeże figi to rzadkość w polskich sklepach. Mają mnóstwo błonnika i prebiotyków wspierających mikrobiom.",
            "minerals": "Potas, wapń, żelazo",
            "tags": ["Błonnik", "Wapń", "Prebiotyki", "Egzotyk"],
            "vitamins": "Witamina B6, K, A"
        },
        "orientations": ["S", "SW"],
        "plant_group": "owoce",
        "pot": {
            "drainage": "Otwory w dnie, warstwa kruszywa na spodzie",
            "material": "Duża skrzynia drewniana lub wielka donica (min. 30 litrów)",
            "min_depth_cm": 35,
            "min_volume_l": 20,
            "recommended_volume_l": 30
        },
        "schedule": {
            "04_1": "odpoczynek",
            "05_1": "sadzenie",
            "06_1": "rosnie",
            "07_1": "zbior",
            "08_1": "rosnie",
            "09_1": "zbior",
            "10_1": "zimowanie",
            "11_1": "zimowanie"
        },
        "soil_ph": ["Obojętna (6.5 - 7.0)", "Zasadowa (7.0 - 7.5)"],
        "sowing_guide": {
            "container": "Wielka donica wolnostojąca",
            "depth_cm": 0,
            "indoors_weeks_before_last_frost": 0,
            "soil_temp_c": 15,
            "spacing_cm": 150
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 0,
            "min_spacing_cm": 50,
            "root_depth_category": "gleboki"
        },
        "varieties": [
            {"features": "Odmiana samopylna, fioletowe owoce, w miarę odporna na zimno", "name": "Brown Turkey"},
            {"features": "Szybko owocująca, mniejsze zielono-żółte owoce", "name": "Free-bise"}
        ],
        "water_needs": "Wysokie",
        "water_needs_level": 4
    },
    {
        "category": "Psiankowate",
        "detailed_guide": "\n### 1. Wysiew i stanowisko\nMiechunka peruwiańska (Inca Berry, Złota Jagoda) pochodzi z Ameryki Południowej i jest rośliną psiankowatą blisko spokrewnioną z pomidorem. Uprawia się ją z rozsady wysiewanej już w połowie marca (rośnie dość długo). Wymaga osłoniętego, ciepłego balkonu (np. południowo-zachodniego).\n\n### 2. Pielęgnacja na balkonie\n- **Rozmiar:** Uwaga! To duża roślina. W żyznej ziemi potrafi osiągnąć 1,5 metra wysokości i mocno się rozrastać na boki. Wymaga podwiązywania lub klatek.\n- **Wzrost:** Nie obrywa się jej pędów (wilków) tak rygorystycznie jak u pomidorów, pędy puszczone na boki owocują najobficiej.\n- **Zbiory:** Owoce kryją się w 'bibułkowych' lampionach. Są dojrzałe, gdy lampion całkowicie zasycha i przypomina pergamin, a jagoda w środku jest pomarańczowa.\n\n### 3. Złote zasady:\n• Owoce niedojrzałe mogą być lekko toksyczne (zawierają solaninę). Zbieraj tylko te, z pożółkłym i suchym kielichem. Z dojrzałych owoców można robić pyszne przetwory lub jeść świeże jako egzotyczny owoc o kwaśno-słodkim smaku (marakuja z ananasem).",
        "difficulty": 3,
        "difficulty_label": "Średni (rośnie silnie, wymaga sporej donicy i podwiązywania)",
        "fertilizer_guide": {
            "frequency": "Co 10 dni",
            "npk_focus": "Podobnie jak pomidory – więcej potasu na owocowanie",
            "organic_options": ["Biohumus", "Mączka bazaltowa", "Nawóz ze skórek banana"],
            "warnings": "Przy nadmiarze azotu roślina buduje wielkie krzaczyska kosztem lampionów owocowych.",
            "what": "Nawóz do pomidorów (wysoki potas)"
        },
        "id": "miechunka-peruwianska",
        "name": "Miechunka peruwiańska (Rodzynek brazylijski / Inca Berry)",
        "nutrition": {
            "key_benefits": "Owoce to bomba witaminy C. Zwiększają odporność i dodają pysznego, egzotycznego smaku do deserów.",
            "minerals": "Fosfor, żelazo, cynk",
            "tags": ["Witamina C", "Egzotyk", "Odporność", "Antyoksydanty"],
            "vitamins": "Witamina C (bardzo dużo), witamina A, B1, B2, B3"
        },
        "orientations": ["S", "SW"],
        "plant_group": "owoce",
        "pot": {
            "drainage": "Dobre dziury i duża warstwa keramzytu (dla stabilizacji bryły)",
            "material": "Ciężka donica gliniana/betonowa (z uwagi na wysokość krzaka łatwo o wywrócenie)",
            "min_depth_cm": 30,
            "min_volume_l": 15,
            "recommended_volume_l": 20
        },
        "schedule": {
            "03_2": "rozsada_dom",
            "04_1": "rozsada_dom",
            "04_2": "rozsada_dom",
            "05_1": "rozsada_dom",
            "05_2": "sadzenie",
            "06_1": "rosnie",
            "07_1": "kwitnie",
            "08_1": "zbior",
            "09_1": "zbior",
            "10_1": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)"],
        "sowing_guide": {
            "container": "Pojedyncza duża donica z podporą",
            "depth_cm": 0.5,
            "indoors_weeks_before_last_frost": 7,
            "soil_temp_c": 22,
            "spacing_cm": 50
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 1,
            "min_spacing_cm": 40,
            "root_depth_category": "sredni"
        },
        "varieties": [
            {"features": "Standardowa odmiana wysoka", "name": "Miechunka peruwiańska (Physalis peruviana)"},
            {"features": "Niższa, drobniejsze owoce, szybciej owocująca", "name": "Rodzynek brazylijski (Physalis edulis)"}
        ],
        "water_needs": "Średnie",
        "water_needs_level": 3
    },
    {
        "category": "Dyniowate",
        "detailed_guide": "\n### 1. Uprawa orientalna\nKiwano (ogórek rogaty / afrykański melon) to egzotyczne pnącze rodzące niesamowite, kolczaste pomarańczowe owoce o zielonym miąższu smakiem przypominającym kiwi z ogórkiem i bananem. Posiada bardzo wysokie wymagania cieplne.\n\n### 2. Pielęgnacja na balkonie\n- **Podpory:** Wymaga siatki balkonowej lub mocnych tyczek (do 2 m długości). Idealnie nadaje się do zazielenienia ściany bocznej mocno nasłonecznionego balkonu.\n- **Klimat:** Nie znosi wiatru i chłodów. Uprawa udaje się wyłącznie na balkonach południowych (w polskich warunkach – idealnie przy nagrzewającej się ścianie z cegły/betonu).\n- **Zapylanie:** Zależne od owadów (pszczoły). Na wyższych piętrach balkonów w mieście może zajść potrzeba zapylania ręcznego pędzelkiem.\n\n### 3. Złote zasady:\n• Nasiona wysiewaj w połowie kwietnia, sadź do dużych donic dopiero na przełomie maja/czerwca, gdy minie ryzyko załamań pogody.\n• Kiwano pije wodę równie łapczywie jak ogórek – podlewaj solidnie w dni upalne.",
        "difficulty": 4,
        "difficulty_label": "Trudny (ciepłolubny, wymaga ręcznego zapylania w mieście)",
        "fertilizer_guide": {
            "frequency": "Co 2 tygodnie w fazie wzrostu",
            "npk_focus": "Nawóz z przewagą potasu od momentu kwitnienia",
            "organic_options": ["Biohumus dżdżownicowy", "Kompost"],
            "warnings": "Uważaj na chłody – spadek temperatury poniżej 12°C hamuje wzrost.",
            "what": "Nawóz potasowy organiczny, np. biohumus uniwersalny."
        },
        "id": "kiwano-balkonowe",
        "name": "Kiwano (Ogórek rogaty)",
        "nutrition": {
            "key_benefits": "Orzeźwiający dodatek, idealny na upalne dni. Bogaty w przeciwutleniacze spowalniające starzenie.",
            "minerals": "Magnez (duża zawartość!), potas, cynk",
            "tags": ["Magnez", "Nawodnienie", "Egzotyk", "Antyoksydanty"],
            "vitamins": "Witamina C, witamina A"
        },
        "orientations": ["S", "SW"],
        "plant_group": "owoce",
        "pot": {
            "drainage": "Otwory na dole",
            "material": "Czarne plastikowe donice są tu wyjątkiem na plus (szybko się nagrzewają)",
            "min_depth_cm": 25,
            "min_volume_l": 15,
            "recommended_volume_l": 20
        },
        "schedule": {
            "04_2": "rozsada_dom",
            "05_1": "rozsada_dom",
            "05_2": "sadzenie",
            "06_1": "rosnie",
            "07_1": "kwitnie",
            "08_1": "zbior",
            "09_1": "zbior",
            "09_2": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)", "Obojętna (6.5 - 7.0)"],
        "sowing_guide": {
            "container": "Duża donica z mocną kratką",
            "depth_cm": 1.5,
            "indoors_weeks_before_last_frost": 4,
            "soil_temp_c": 24,
            "spacing_cm": 40
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 1,
            "min_spacing_cm": 30,
            "root_depth_category": "sredni"
        },
        "varieties": [
            {"features": "Egzotyczny smak, duża plonność pod osłonami", "name": "Kiwano"}
        ],
        "water_needs": "Wysokie",
        "water_needs_level": 5
    }
]

file_path = "backend/plants_data.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to insert our new plants into PLANTS_DATABASE.
# Since it's a huge python list of dictionaries, we can append new items dynamically and then overwrite the file using a clean format.

import ast

# Better approach: Just replace the last `]` with `, <our_json>]` using regex or string ops
# The file ends with:
#         }
#     }
# ]
# Let's find the last occurrence of `]` and insert our items.

if content.strip().endswith("]"):
    content = content.strip()[:-1]
    
    # Generate the string for the new plants
    # Let's format the new plants list to a string without the enclosing brackets
    new_plants_str = json.dumps(new_plants, ensure_ascii=False, indent=4)
    # Remove the first `[` and last `]` from new_plants_str
    new_plants_str = new_plants_str.strip()[1:-1]
    
    # If the original content has elements, we need a comma
    if not content.strip().endswith("[") and not content.strip().endswith(","):
        content += ",\n"
        
    content += new_plants_str + "\n]\n"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully appended new plants!")
else:
    print("Could not find the closing bracket of the list.")

