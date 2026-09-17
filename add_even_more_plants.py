import json

new_plants = [
    {
        "category": "Kapustowate",
        "detailed_guide": "\n### 1. Kapusta Pekińska na balkonie\nPodobnie jak Pak Choi, kapusta pekińska preferuje krótki dzień. Oznacza to, że sadzona w środku lata od razu wybije w kwiatostany. Należy ją siać do wielodoniczek w lipcu i sierpniu, a sadzić do donic we wrześniu. Dojrzewa wspaniale na chłodne jesienne miesiące.\n\n### 2. Pielęgnacja\n- **Światło:** Nie potrzebuje ekstremalnych ilości słońca, więc świetnie sprawdzi się na balkonach zachodnich lub północno-zachodnich w jesieni.\n- **Szkodniki:** Uwielbiana przez pchełki ziemne i ślimaki, stąd uprawa na wyższych piętrach balkonu bywa znacznie łatwiejsza i czystsza niż w gruncie.\n- **Podlewanie:** Lubi umiarkowaną wilgotność.\n\n### 3. Złote zasady:\n• Jesienią nie grożą jej przymrozki, do -5°C na osłoniętym balkonie daje sobie świetnie radę.",
        "difficulty": 2,
        "difficulty_label": "Łatwy (uprawa tylko na zbiór jesienny)",
        "fertilizer_guide": {
            "frequency": "Co 2-3 tygodnie po posadzeniu",
            "npk_focus": "Wysoki azot i potas",
            "organic_options": ["Biohumus dżdżownicowy", "Wyciąg z alg"],
            "warnings": "Pod koniec uprawy, przed formowaniem głów, zmniejsz nawożenie by nie kumulowała azotanów.",
            "what": "Zbilansowany nawóz do warzyw."
        },
        "id": "kapusta-pekinska",
        "name": "Kapusta pekińska (na zbiór jesienny)",
        "nutrition": {
            "key_benefits": "Rewelacyjna do domowego, zdrowego kimchi, bogata we florę bakteryjną (po fermentacji).",
            "minerals": "Wapń, magnez, fosfor",
            "tags": ["Kimchi", "Witamina K", "Niskokaloryczne"],
            "vitamins": "Witamina K, A, C"
        },
        "orientations": ["W", "E", "NW", "NE", "N"],
        "plant_group": "warzywa",
        "pot": {
            "drainage": "Zwykły drenaż, odpływ nadmiaru wody",
            "material": "Plastikowa lub drewniana skrzynka",
            "min_depth_cm": 15,
            "min_volume_l": 5,
            "recommended_volume_l": 8
        },
        "schedule": {
            "07_2": "rozsada_dom",
            "08_1": "rozsada_dom",
            "08_2": "sadzenie",
            "09_1": "rosnie",
            "09_2": "rosnie",
            "10_1": "zbior",
            "10_2": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)", "Obojętna (6.5 - 7.0)"],
        "sowing_guide": {
            "container": "Płytka i długa skrzynka",
            "depth_cm": 1.0,
            "indoors_weeks_before_last_frost": 0,
            "soil_temp_c": 18,
            "spacing_cm": 25
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 1,
            "max_plants_per_standard_box_60cm": 2,
            "min_spacing_cm": 25,
            "root_depth_category": "plytki"
        },
        "varieties": [
            {"features": "Popularna odmiana tworząca zbite główki", "name": "Hilton"},
            {"features": "Czerwona/purpurowa odmiana, bardzo ozdobna", "name": "Scarlet"}
        ],
        "water_needs": "Wysokie",
        "water_needs_level": 4
    },
    {
        "category": "Wiechlinowate",
        "detailed_guide": "\n### 1. Egzotyka kuchenna\nTrawa cytrynowa, nieodłączny element kuchni tajskiej, jest zaskakująco łatwa w uprawie w polskim klimacie latem, byle z dala od mrozów.\n\n### 2. Rozmnażanie z bulwek\nNajprościej nie wysiewać z nasion, ale kupić świeże pędy trawy cytrynowej w supermarkecie spożywczym (muszą mieć resztki piętki na dole). Umieść je w słoiku z wodą na parapecie. Gdy wypuszczą gęste korzenie (po ok. 2-3 tygodniach), wsadź je do żyznej, przepuszczalnej ziemi.\n\n### 3. Pielęgnacja na balkonie\n- **Ogród w pojemniku:** Trawa cytrynowa silnie się rozrasta, tworząc piękne, wysokie, gęste, falujące na wietrze kępy o cytrynowym zapachu odganiającym owady (np. komary).\n- **Ciepło:** Potrzebuje gorącego balkonu (południe, zachód).\n- **Zimowanie:** Przed przymrozkami wykop bulwki i zużyj do gotowania, ewentualnie jedną najsilniejszą przynieś w doniczce do domu jako roślinkę pokojową na zimę.",
        "difficulty": 1,
        "difficulty_label": "Bardzo łatwy (rozmnażanie przez pędy sklepowe)",
        "fertilizer_guide": {
            "frequency": "Raz w miesiącu",
            "npk_focus": "Nawóz azotowy",
            "organic_options": ["Obornik granulowany", "Biohumus dżdżownicowy (często)"],
            "warnings": "Trawa cytrynowa jest rośliną żarłoczną na azot. Brak azotu = żółknące, suche pędy.",
            "what": "Nawóz uniwersalny lub azotowy."
        },
        "id": "trawa-cytrynowa",
        "name": "Trawa cytrynowa",
        "nutrition": {
            "key_benefits": "Posiada silne właściwości antyseptyczne i relaksujące (idealna na napar z miodem i imbirem przed snem).",
            "minerals": "Cynk, żelazo, mangan",
            "tags": ["Olejki eteryczne", "Anty-komarowe", "Trawienie", "Przyprawa"],
            "vitamins": "Witamina A, C"
        },
        "orientations": ["S", "SW", "W"],
        "plant_group": "ziola",
        "pot": {
            "drainage": "Umiarkowany",
            "material": "Obojętne",
            "min_depth_cm": 25,
            "min_volume_l": 10,
            "recommended_volume_l": 15
        },
        "schedule": {
            "04_1": "rozsada_dom",
            "04_2": "rozsada_dom",
            "05_2": "sadzenie",
            "06_1": "rosnie",
            "07_1": "zbior",
            "08_1": "zbior",
            "09_1": "zbior"
        },
        "soil_ph": ["Lekko kwaśna (6.0 - 6.5)", "Obojętna (6.5 - 7.0)"],
        "sowing_guide": {
            "container": "Pojedyncza doniczka średnia",
            "depth_cm": 3.0,
            "indoors_weeks_before_last_frost": 6,
            "soil_temp_c": 22,
            "spacing_cm": 25
        },
        "spacing_guide": {
            "max_plants_per_round_pot_30cm": 2,
            "max_plants_per_standard_box_60cm": 3,
            "min_spacing_cm": 15,
            "root_depth_category": "sredni"
        },
        "varieties": [
            {"features": "Pospolita odmiana sklepowa, najlepsza w smaku", "name": "Cymbopogon citratus"}
        ],
        "water_needs": "Średnie",
        "water_needs_level": 3
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
    print("Successfully appended even more plants!")

