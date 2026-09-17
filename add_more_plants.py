import json

new_plants = [
    {
        "category": "Ślazowate",
        "detailed_guide": "\n### 1. Egzotyka w donicy\nOkra (piżmian jadalny) to niesamowicie ozdobna roślina o pięknych, wielkich, żółtych kwiatach przypominających hibiskusa. Oprócz wartości estetycznych rodzi jadalne, podłużne torebki (palce), z których robi się gulasze i zagęszcza zupy.\n\n### 2. Pielęgnacja na balkonie\n- **Ciepło:** Uwielbia słońce i upały! Najlepiej rośnie w polskie letnie dni, im goręcej tym lepiej. Na balkonie ustaw na ścianie południowej lub zachodniej.\n- **Wzrost:** Rośnie wysoko (często powyżej 1 m), więc potrzebuje ciężkiej, stabilnej donicy.\n- **Zbiór:** Zbieraj owoce niedojrzałe, gdy mają około 5-8 cm długości. Starsze owoce szybko twardnieją i drewnieją.\n\n### 3. Złote zasady:\n• Nasiona przed siewem (kwiecień) namocz przez noc w ciepłej wodzie.\n• Z uwagi na palowy system korzeniowy, ostrożnie pikuj rozsady (nie lubi przesadzania) – najlepiej wysiewać do wytłoczek torfowych.",
        "difficulty": 3,
        "difficulty_label": "Średni (ciepłolubny, lubi polskie upały)",
        "fertilizer_guide": {
            "frequency": "Co 2 tygodnie",
            "npk_focus": "Zrównoważony",
            "organic_options": ["Mączka z alg morskich", "Kompost"],
            "warnings": "Nie nadużywaj nawozów sztucznych, rośnie dobrze w zbilansowanym, umiarkowanie żyznym podłożu.",
            "what": "Płynny nawóz organiczny do warzyw ciepłolubnych."
        },
        "id": "okra-balkonowa",
        "name": "Okra (Piżmian jadalny)",
        "nutrition": {
            "key_benefits": "Błonnik z okry wspaniale wpływa na stabilizację poziomu cukru we krwi i wspiera trawienie. Młode strąki są niskokaloryczne.",
            "minerals": "Wapń, magnez, mangan",
            "tags": ["Błonnik", "Niski IG", "Trawienie", "Egzotyk"],
            "vitamins": "Witamina C, K, kwas foliowy"
        },
        "orientations": ["S", "SW"],
        "plant_group": "warzywa",
        "pot": {
            "drainage": "Otwory w dnie, warstwa kruszywa",
            "material": "Ciężka donica z terakoty (minimalizuje ryzyko przewrócenia)",
            "min_depth_cm": 30,
            "min_volume_l": 15,
            "recommended_volume_l": 20
        },
        "schedule": {
            "04_1": "rozsada_dom",
            "04_2": "rozsada_dom",
            "05_2": "sadzenie",
            "06_1": "rosnie",
            "07_1": "kwitnie",
            "08_1": "zbior",
            "09_1": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)", "Obojętna (6.5 - 7.0)"],
        "sowing_guide": {
            "container": "Wysoka donica wolnostojąca",
            "depth_cm": 2.0,
            "indoors_weeks_before_last_frost": 5,
            "soil_temp_c": 22,
            "spacing_cm": 30
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 1,
            "min_spacing_cm": 25,
            "root_depth_category": "gleboki"
        },
        "varieties": [
            {"features": "Odmiana o czerwonych pędach i owocach, niezwykle ozdobna", "name": "Red Burgundy"},
            {"features": "Klasyczna odmiana, zielone strąki, rodzi dużo owoców", "name": "Clemson Spineless"}
        ],
        "water_needs": "Średnie",
        "water_needs_level": 3
    },
    {
        "category": "Powojowate",
        "detailed_guide": "\n### 1. Zaskakująca uprawa balkonowa\nBatat (wilec ziemniaczany) jest częściej kojarzony z uprawami gruntowymi, ale na dużych balkonach to wspaniała ozdoba (piękne, zwisające kaskadami liście, u wielu odmian purpurowe lub limonkowe) oraz pyszne bulwy jesienią!\n\n### 2. Rozmnażanie z sadzonek pędowych (tzw. slips)\nWczesną wiosną (marzec) połówkę ekologicznego batata wstawiasz pionowo do słoika z wodą (podobnie jak pestkę awokado). Po kilku tygodniach wypuści pędy (slips). Odrywasz je, ukorzeniasz i na przełomie maja/czerwca wsadzasz głęboko do dużej donicy (np. materiałowego worka, który pozwala oddychać).\n\n### 3. Złote zasady:\n• Batat uwielbia słońce, wysoką temperaturę i długi czas wegetacji (ok 120 dni). Donica musi być luźna, lekka (ziemia wymieszana z perlitem i włóknem kokosowym), by bulwy mogły się rozrastać.\n• Podlewanie – dużo, bo masa liściowa silnie paruje.\n• Jesienią (październik) tuż przed pierwszymi przymrozkami wywracasz donicę – niespodzianka! W środku kryją się słodkie ziemniaki.",
        "difficulty": 2,
        "difficulty_label": "Łatwy (zabawny projekt domowy)",
        "fertilizer_guide": {
            "frequency": "Co 3-4 tygodnie",
            "npk_focus": "Potas na rozwój podziemnych bulw (zbyt dużo azotu to same liście, zero bulw!)",
            "organic_options": ["Obornik koński przekopany przed sadzeniem", "Nawóz z popiołu drzewnego (potas)"],
            "warnings": "Nie używaj mocnych nawozów azotowych (np. saletry).",
            "what": "Bogaty w potas i fosfor nawóz dla okopowych lub pomidorów."
        },
        "id": "batat-jadalny",
        "name": "Batat jadalny i ozdobny (Wilec)",
        "nutrition": {
            "key_benefits": "Jedno z najzdrowszych warzyw węglowodanowych. Niewiarygodnie gęsty odżywczo, niski indeks glikemiczny.",
            "minerals": "Mangan, potas, miedź",
            "tags": ["Beta-karoten", "Węglowodany złożone", "Niski IG"],
            "vitamins": "Witamina A (ogromne ilości beta-karotenu w odmianach pomarańczowych), Witamina B5"
        },
        "orientations": ["S", "SW", "SE"],
        "plant_group": "warzywa",
        "pot": {
            "drainage": "Luźne podłoże (50% ziemia, 50% perlit/kokos), super przepuszczalne",
            "material": "Głębokie donice materiałowe (Smart Pot), wielkie pojemniki np. 40-50L",
            "min_depth_cm": 40,
            "min_volume_l": 25,
            "recommended_volume_l": 40
        },
        "schedule": {
            "03_1": "rozsada_dom",
            "04_1": "rozsada_dom",
            "05_2": "sadzenie",
            "06_1": "rosnie",
            "07_1": "rosnie",
            "08_1": "rosnie",
            "09_1": "rosnie",
            "10_1": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (5.5 - 6.5)"],
        "sowing_guide": {
            "container": "Worki materiałowe na balkonie",
            "depth_cm": 15,
            "indoors_weeks_before_last_frost": 8,
            "soil_temp_c": 20,
            "spacing_cm": 35
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 1,
            "min_spacing_cm": 30,
            "root_depth_category": "gleboki"
        },
        "varieties": [
            {"features": "Ozdobne limonkowe liście, tworzy mniejsze jasne bulwy", "name": "Margarita"},
            {"features": "Zwykły sklepowy batat z pomarańczowym miąższem", "name": "Beauregard"}
        ],
        "water_needs": "Wysokie",
        "water_needs_level": 4
    }
]

file_path = "backend/plants_data.py"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

if content.strip().endswith("]"):
    content = content.strip()[:-1]
    
    new_plants_str = json.dumps(new_plants, ensure_ascii=False, indent=4)
    new_plants_str = new_plants_str.strip()[1:-1]
    
    if not content.strip().endswith("[") and not content.strip().endswith(","):
        content += ",\n"
        
    content += new_plants_str + "\n]\n"
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully appended more plants!")

