#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Balkonowy Ogród Warzywny - Backend API
Serwer oparty o bibliotekę standardową Pythona (bez zewnętrznych bibliotek).
Udostępnia:
- Bazę wiedzy o warzywach w donicach (źródła: Działkowiec, PoradnikOgrodniczy.pl, Murator Ogród, Zielone Pogotowie)
- Silnik dopasowania balkonu (ekspozycja, piętro/wiatr, region Polski, wielkość donic, czas pielęgnacji)
- Inteligentny kalendarz upraw w 24 okresach 2-tygodniowych
- Integrację z darmowym API Open-Meteo z poradami nawadniania i ochrony donic
"""

import json
import math
import os
import sys
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime

PORT = int(os.environ.get("PYTHON_PORT", 5001))

REGIONS = {
    "dolnoslaskie": {
        "name": "Dolnośląskie (np. Wrocław, Legnica, Wałbrzych)",
        "zone": "7b / 7a",
        "climate_notes": "Najdłuższy okres wegetacyjny w Polsce (do 225 dni). Sezon zaczyna się 7-10 dni wcześniej niż w centrum.",
        "lat": 51.1079,
        "lon": 17.0385,
        "frost_shift_days": -7
    },
    "kujawsko_pomorskie": {
        "name": "Kujawsko-Pomorskie (np. Bydgoszcz, Toruń, Włocławek)",
        "zone": "6b / 7a",
        "climate_notes": "Ciepłe, stosunkowo suche lata. Dobra dostępność słońca na nizinnych balkonach.",
        "lat": 53.0138,
        "lon": 18.5984,
        "frost_shift_days": -2
    },
    "lubelskie": {
        "name": "Lubelskie (np. Lublin, Zamość, Chełm)",
        "zone": "6b",
        "climate_notes": "Duże nasłonecznienie w sezonie letnim, żyzne podłoża, ostre wschodnie wiatry zimą.",
        "lat": 51.2465,
        "lon": 22.5684,
        "frost_shift_days": 3
    },
    "lubuskie": {
        "name": "Lubuskie (np. Zielona Góra, Gorzów Wlkp.)",
        "zone": "7b / 7a",
        "climate_notes": "Ciepły region winiarski, wczesna wiosna i łagodne zimy. Znakomite warunki dla pomidorów i ziół.",
        "lat": 51.9356,
        "lon": 15.5062,
        "frost_shift_days": -6
    },
    "lodzkie": {
        "name": "Łódzkie (np. Łódź, Piotrków Tryb., Pabianice)",
        "zone": "6b",
        "climate_notes": "Serce Polski, stabilny klimat nizinny. Standardowy termin wysadzania po Zimnej Zośce (15 maja).",
        "lat": 51.7592,
        "lon": 19.4560,
        "frost_shift_days": 0
    },
    "malopolskie": {
        "name": "Małopolskie (np. Kraków, Tarnów, Nowy Sącz)",
        "zone": "6b / 6a",
        "climate_notes": "Ciepłe lata, wysoka wilgotność w dolinach rzek, ryzyko chorób grzybowych (mączniak, zaraza).",
        "lat": 50.0647,
        "lon": 19.9450,
        "frost_shift_days": 2
    },
    "mazowieckie": {
        "name": "Mazowieckie (np. Warszawa, Radom, Płock)",
        "zone": "6b",
        "climate_notes": "Umiarkowany okres wegetacyjny (~205-210 dni). Typowe wiosenne przymrozki majowe (12-15 maja).",
        "lat": 52.2297,
        "lon": 21.0122,
        "frost_shift_days": 0
    },
    "opolskie": {
        "name": "Opolskie (np. Opole, Kędzierzyn-Koźle, Nysa)",
        "zone": "7a / 7b",
        "climate_notes": "Bardzo ciepła Nizina Śląska, łagodne zimy i długi okres wegetacyjny sprzyjający ciepłolubnym warzywom.",
        "lat": 50.6751,
        "lon": 17.9213,
        "frost_shift_days": -5
    },
    "podkarpackie": {
        "name": "Podkarpackie (np. Rzeszów, Przemyśl, Krosno)",
        "zone": "6b / 6a",
        "climate_notes": "Słoneczne i gorące lata. W kotlinach podgórskich chłodniejsze noce w maju i wrześniu.",
        "lat": 50.0412,
        "lon": 21.9991,
        "frost_shift_days": 3
    },
    "podlaskie": {
        "name": "Podlaskie (np. Białystok, Suwałki, Łomża)",
        "zone": "6a / 5b (polski biegun zimna)",
        "climate_notes": "Krótszy okres wegetacyjny (~180-190 dni). Przymrozki możliwe jeszcze pod koniec maja! Wskazane odmiany wczesne.",
        "lat": 53.1325,
        "lon": 23.1688,
        "frost_shift_days": 10
    },
    "pomorskie": {
        "name": "Pomorskie (np. Gdańsk, Gdynia, Słupsk)",
        "zone": "7a (nadmorska)",
        "climate_notes": "Łagodne zimy, ale silne wiatry od morza i opóźniona wiosna. Rośliny wymagają osłony przed wiatrem.",
        "lat": 54.3520,
        "lon": 18.6466,
        "frost_shift_days": 5
    },
    "slaskie": {
        "name": "Śląskie (np. Katowice, Bielsko-Biała, Gliwice)",
        "zone": "6b",
        "climate_notes": "Ciepły miejski mikroklimat aglomeracji, wczesne nagrzewanie się balkonów i podłoży doniczkowych.",
        "lat": 50.2649,
        "lon": 19.0238,
        "frost_shift_days": -2
    },
    "swietokrzyskie": {
        "name": "Świętokrzyskie (np. Kielce, Ostrowiec Św., Sandomierz)",
        "zone": "6b / 6a",
        "climate_notes": "Wyżynny klimat, ciepłe stoki i doliny rzeczne (zagłębie sadownicze), dobre nasłonecznienie.",
        "lat": 50.8661,
        "lon": 20.6286,
        "frost_shift_days": 2
    },
    "warminsko_mazurskie": {
        "name": "Warmińsko-Mazurskie (np. Olsztyn, Elbląg, Ełk)",
        "zone": "6a",
        "climate_notes": "Klimat pojezierzy, wysoka wilgotność powietrza, chłodniejsze noce wiosną. Wskazane odmiany odporniejsze na chłód.",
        "lat": 53.7784,
        "lon": 20.4801,
        "frost_shift_days": 6
    },
    "wielkopolskie": {
        "name": "Wielkopolskie (np. Poznań, Kalisz, Konin)",
        "zone": "7a",
        "climate_notes": "Ciepły region, wczesna wiosna, lecz częste susze letnie – donice wymagają dobrej retencji wody.",
        "lat": 52.4064,
        "lon": 16.9252,
        "frost_shift_days": -4
    },
    "zachodniopomorskie": {
        "name": "Zachodniopomorskie (np. Szczecin, Koszalin, Świnoujście)",
        "zone": "7b / 7a",
        "climate_notes": "Silny wpływ oceaniczny, bardzo łagodne zimy, rzadkie przymrozki, silniejsze wiatry nadmorskie.",
        "lat": 53.4285,
        "lon": 14.5528,
        "frost_shift_days": -5
    },
    # Aliases
    "kujawsko-pomorskie": {
        "name": "Kujawsko-Pomorskie (np. Bydgoszcz, Toruń, Włocławek)",
        "zone": "6b / 7a",
        "climate_notes": "Ciepłe, stosunkowo suche lata. Dobra dostępność słońca na nizinnych balkonach.",
        "lat": 53.0138,
        "lon": 18.5984,
        "frost_shift_days": -2
    },
    "warminsko-mazurskie": {
        "name": "Warmińsko-Mazurskie (np. Olsztyn, Elbląg, Ełk)",
        "zone": "6a",
        "climate_notes": "Klimat pojezierzy, wysoka wilgotność powietrza, chłodniejsze noce wiosną. Wskazane odmiany odporniejsze na chłód.",
        "lat": 53.7784,
        "lon": 20.4801,
        "frost_shift_days": 6
    }
}

# 24 okresy w roku (2 na miesiąc)
CALENDAR_PERIODS = [
    {"id": "01_1", "month": 1, "half": 1, "name": "I połowa Stycznia", "short": "Sty I"},
    {"id": "01_2", "month": 1, "half": 2, "name": "II połowa Stycznia", "short": "Sty II"},
    {"id": "02_1", "month": 2, "half": 1, "name": "I połowa Lutego", "short": "Lut I"},
    {"id": "02_2", "month": 2, "half": 2, "name": "II połowa Lutego", "short": "Lut II"},
    {"id": "03_1", "month": 3, "half": 1, "name": "I połowa Marca", "short": "Mar I"},
    {"id": "03_2", "month": 3, "half": 2, "name": "II połowa Marca", "short": "Mar II"},
    {"id": "04_1", "month": 4, "half": 1, "name": "I połowa Kwietnia", "short": "Kwi I"},
    {"id": "04_2", "month": 4, "half": 2, "name": "II połowa Kwietnia", "short": "Kwi II"},
    {"id": "05_1", "month": 5, "half": 1, "name": "I połowa Maja (Przed Zimną Zośką)", "short": "Maj I"},
    {"id": "05_2", "month": 5, "half": 2, "name": "II połowa Maja (Po Zimnej Zośce)", "short": "Maj II"},
    {"id": "06_1", "month": 6, "half": 1, "name": "I połowa Czerwca", "short": "Cze I"},
    {"id": "06_2", "month": 6, "half": 2, "name": "II połowa Czerwca", "short": "Cze II"},
    {"id": "07_1", "month": 7, "half": 1, "name": "I połowa Lipca", "short": "Lip I"},
    {"id": "07_2", "month": 7, "half": 2, "name": "II połowa Lipca", "short": "Lip II"},
    {"id": "08_1", "month": 8, "half": 1, "name": "I połowa Sierpnia", "short": "Sie I"},
    {"id": "08_2", "month": 8, "half": 2, "name": "II połowa Sierpnia", "short": "Sie II"},
    {"id": "09_1", "month": 9, "half": 1, "name": "I połowa Września", "short": "Wrz I"},
    {"id": "09_2", "month": 9, "half": 2, "name": "II połowa Września", "short": "Wrz II"},
    {"id": "10_1", "month": 10, "half": 1, "name": "I połowa Października", "short": "Paź I"},
    {"id": "10_2", "month": 10, "half": 2, "name": "II połowa Października", "short": "Paź II"},
    {"id": "11_1", "month": 11, "half": 1, "name": "I połowa Listopada", "short": "Lis I"},
    {"id": "11_2", "month": 11, "half": 2, "name": "II połowa Listopada", "short": "Lis II"},
    {"id": "12_1", "month": 12, "half": 1, "name": "I połowa Grudnia", "short": "Gru I"},
    {"id": "12_2", "month": 12, "half": 2, "name": "II połowa Grudnia", "short": "Gru II"},
]

def get_current_period_id():
    now = datetime.now()
    month = now.month
    half = 1 if now.day <= 15 else 2
    return f"{month:02d}_{half}"

try:
    from plants_data import PLANTS_DATABASE
except ImportError:
    from backend.plants_data import PLANTS_DATABASE

def calculate_suitability(plant, user_spec):
    """
    Wylicza stopień dopasowania warzywa (0-100%) do warunków konkretnego balkonu użytkownika.
    Uwzględnia:
    - Orientację balkonu (S/E/W/N)
    - Piętro (wiatr, schnięcie ziemi, promieniowanie UV)
    - Region Polski (strefa mrozowa i długość wegetacji)
    - Typ barierki i zadaszenie
    - Posiadane pojemniki (czy donice nie są za małe!)
    - Czas na podlewanie
    """
    score = 100
    reasons = []
    warnings = []
    tips = []

    orientation = user_spec.get("orientation", "S").upper()
    floor = int(user_spec.get("floor", 2))
    region_key = str(user_spec.get("region", "mazowieckie")).replace("-", "_")
    pots = user_spec.get("pots", [])
    balcony_type = user_spec.get("balcony_type", "open_rail")
    care_time = user_spec.get("care_time", "daily")

    # Baza danych charakterystyk orientacji i składowych kardynalnych
    ORIENTATION_MAP = {
        "S": {"components": ["S"], "sun_level": "very_high", "hours": "6-8h", "is_north": False, "is_south": True, "label": "Południe"},
        "E": {"components": ["E"], "sun_level": "medium", "hours": "3-5h", "is_north": False, "is_south": False, "label": "Wschód"},
        "W": {"components": ["W"], "sun_level": "high", "hours": "4-6h", "is_north": False, "is_south": False, "label": "Zachód"},
        "N": {"components": ["N"], "sun_level": "low", "hours": "<3h", "is_north": True, "is_south": False, "label": "Północ"},
        "SE": {"components": ["SE", "S", "E"], "sun_level": "high", "hours": "5-7h", "is_north": False, "is_south": True, "label": "Południowy Wschód"},
        "SW": {"components": ["SW", "S", "W"], "sun_level": "very_high", "hours": "6-8h", "is_north": False, "is_south": True, "label": "Południowy Zachód"},
        "NE": {"components": ["NE", "N", "E"], "sun_level": "low_medium", "hours": "3-4h", "is_north": True, "is_south": False, "label": "Północny Wschód"},
        "NW": {"components": ["NW", "N", "W"], "sun_level": "medium", "hours": "3-5h", "is_north": False, "is_south": False, "label": "Północny Zachód"},
        # 16-punktowa róża wiatrów
        "SSE": {"components": ["SSE", "S", "SE"], "sun_level": "very_high", "hours": "6-7h", "is_north": False, "is_south": True, "label": "Płd-Płd-Wschód"},
        "SSW": {"components": ["SSW", "S", "SW"], "sun_level": "very_high", "hours": "6-8h", "is_north": False, "is_south": True, "label": "Płd-Płd-Zachód"},
        "ESE": {"components": ["ESE", "E", "SE"], "sun_level": "high", "hours": "5-6h", "is_north": False, "is_south": False, "label": "Wsch-Płd-Wschód"},
        "ENE": {"components": ["ENE", "E", "NE"], "sun_level": "medium", "hours": "3-4h", "is_north": False, "is_south": False, "label": "Wsch-Płn-Wschód"},
        "WSW": {"components": ["WSW", "W", "SW"], "sun_level": "very_high", "hours": "5-7h", "is_north": False, "is_south": True, "label": "Zach-Płd-Zachód"},
        "WNW": {"components": ["WNW", "W", "NW"], "sun_level": "medium", "hours": "3-5h", "is_north": False, "is_south": False, "label": "Zach-Płn-Zachód"},
        "NNW": {"components": ["NNW", "N", "NW"], "sun_level": "low", "hours": "2-3h", "is_north": True, "is_south": False, "label": "Płn-Płn-Zachód"},
        "NNE": {"components": ["NNE", "N", "NE"], "sun_level": "low", "hours": "2-3h", "is_north": True, "is_south": False, "label": "Płn-Płn-Wschód"},
        # Balkony narożne dwustronne i specjalne układy
        "S_W": {"components": ["S_W", "S", "SW", "W"], "sun_level": "maximum", "hours": "8-10h", "is_north": False, "is_south": True, "label": "Narożnik Południe + Zachód"},
        "S_E": {"components": ["S_E", "S", "SE", "E"], "sun_level": "maximum", "hours": "7-9h", "is_north": False, "is_south": True, "label": "Narożnik Południe + Wschód"},
        "N_W": {"components": ["N_W", "N", "NW", "W"], "sun_level": "medium", "hours": "4-6h", "is_north": False, "is_south": False, "label": "Narożnik Północ + Zachód"},
        "N_E": {"components": ["N_E", "N", "NE", "E"], "sun_level": "medium", "hours": "4-5h", "is_north": False, "is_south": False, "label": "Narożnik Północ + Wschód"},
        "E_W": {"components": ["E_W", "E", "W"], "sun_level": "high", "hours": "6-8h", "is_north": False, "is_south": False, "label": "Dwustronny Wschód + Zachód"},
        "PATIO": {"components": ["PATIO", "N", "E"], "sun_level": "diffused", "hours": "1-3h", "is_north": True, "is_south": False, "label": "Dziedziniec / Patio"},
        "DACH": {"components": ["DACH", "S", "SW", "SE", "W", "E"], "sun_level": "maximum_360", "hours": "10+h (360°)", "is_north": False, "is_south": True, "label": "Otwarty taras dachowy"},
    }

    orient_meta = ORIENTATION_MAP.get(orientation, {
        "components": [orientation], "sun_level": "medium", "hours": "3-5h", "is_north": "N" in orientation, "is_south": "S" in orientation, "label": orientation
    })
    plant_orientations = plant.get("orientations", [])

    # 1. Ekspozycja i słońce
    has_direct_match = orientation in plant_orientations
    has_component_match = any(c in plant_orientations for c in orient_meta["components"])

    if has_direct_match or has_component_match:
        score += 6
    elif orient_meta["is_north"] and plant["category"] in ["Psiankowate", "Dyniowate"]:
        score -= 45
        warnings.append(f"Wystawa {orient_meta['label']} ma za mało bezpośredniego słońca ({orient_meta['hours']}) – pomidory i papryki będą się wyciągać i słabo owocować.")
    elif orient_meta["is_south"] and plant["id"] in ["salata-listkowa", "szpinak-balkonowy", "roszponka"]:
        score -= 20
        warnings.append(f"Na silnym słońcu ({orient_meta['label']}) latem roślina szybko wybija w pędy kwiatowe. Wymaga cieniowania w godz. 11:00-15:00.")
        tips.append("Ustaw doniczkę w cieniu wyższych pomidorów lub pod osłoną balustrady.")
    elif orientation == "DACH":
        if plant.get("wind_tolerance") == "Niska":
            score -= 25
            warnings.append("Otwarty taras dachowy: bardzo silna ekspozycja na wiatr może łamać delikatne pędy.")
        else:
            score += 8
            reasons.append("Taras dachowy 360° zapewnia maksymalną dawkę promieniowania słonecznego przez cały dzień.")
    elif orientation == "PATIO":
        if plant["plant_group"] in ["ziola", "warzywa"] and plant["id"] in ["mieta-pieprzowa", "roszponka", "szczypiorek-ziola"]:
            score += 8
            reasons.append("Dziedziniec/patio zapewnia stabilny, wilgotny mikroklimat i doskonałą osłonę przed wiatrem.")
        else:
            score -= 15
            warnings.append("Światło rozproszone na patio opóźnia dojrzewanie owoców ciepłolubnych.")
    else:
        score -= 10
        reasons.append(f"Ekspozycja akceptowalna, choć roślina najlepiej czuje się na wystawach: {', '.join(plant_orientations)}.")

    # 2. Piętro i wiatr
    wind_tol = plant.get("wind_tolerance", "Średnia")
    if floor >= 7:
        if "Niska" in wind_tol:
            score -= 30
            warnings.append(f"Wysokie piętro ({floor}. p.) – silne porywy wiatru mogą łamać pędy i drzeć liście. Konieczne osłonięcie loggią lub matą.")
        elif "Wysoka" in wind_tol or "Bardzo wysoka" in wind_tol:
            score += 8
            reasons.append(f"Roślina jest wybitnie odporna na porywisty wiatr typowy dla {floor}. piętra.")
        else:
            score -= 10
            warnings.append(f"Na {floor}. piętrze ziemia w donicy wysycha dwukrotnie szybciej z powodu wiatru.")
    elif floor == 0:
        if plant["id"] in ["szpinak-balkonowy", "salata-listkowa", "roszponka"]:
            score += 5
            reasons.append("Chłodniejszy i wilgotniejszy mikroklimat parteru sprzyja soczystym warzywom liściastym.")

    # 3. Posiadane donice
    min_vol = plant["pot"]["min_volume_l"]
    has_suitable_pot = False
    if "pots_large_15_30" in pots and min_vol <= 30:
        has_suitable_pot = True
    elif "pots_medium_5_15" in pots and min_vol <= 10:
        has_suitable_pot = True
    elif "boxes_balcony_15cm" in pots and min_vol <= 5:
        has_suitable_pot = True
    elif not pots:
        has_suitable_pot = True

    if not has_suitable_pot and pots:
        score -= 35
        warnings.append(f"Ta roślina wymaga donicy minimum {min_vol}L. W mniejszych pojemnikach korzenie ulegną skarłowaceniu.")
        tips.append(f"Dokup pojemnik o pojemności co najmniej {min_vol} litrów i głębokości {plant['pot']['min_depth_cm']} cm.")
    else:
        reasons.append(f"Twoje donice spełniają wymóg minimalny ({min_vol}L).")

    # 4. Czas na pielęgnację
    if care_time == "weekends":
        if plant["difficulty"] >= 5:
            score -= 25
            warnings.append("Przy podlewaniu tylko w weekendy roślina uschnie w czasie letnich upałów bez automatycznego nawadniania.")
            tips.append("Zainstaluj kule nawadniające lub donicę z systemem samonawadniającym.")
        elif plant["id"] in ["ziola-srodziemnomorskie", "szczypiorek-ziola", "roszponka"]:
            score += 10
            reasons.append("Ta roślina doskonale znosi rzadsze podlewanie i wybacza weekendowy tryb opieki.")

    # 5. Region klimatyczny
    region_info = REGIONS.get(region_key, REGIONS["mazowieckie"])
    shift = region_info["frost_shift_days"]
    if shift > 5 and plant["category"] == "Psiankowate":
        warnings.append(f"Chłodniejszy region ({region_info['name']}): Wiosenne przymrozki ustępują późno. Sadź na zewnątrz 7 dni później.")
    elif shift < 0 and plant["category"] == "Psiankowate":
        reasons.append(f"Cieplejszy region ({region_info['name']}): Długi okres wegetacyjny sprzyja obfitym zbiorom.")

    score = max(10, min(99, score))

    return {
        "score": score,
        "suitability_level": "Doskonały wybór" if score >= 80 else ("Dobry wybór z uwagami" if score >= 60 else "Wymagający / Ryzykowny"),
        "reasons": reasons,
        "warnings": warnings,
        "tips": tips
    }

class BalconyApiHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        if path == "/api/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "ok",
                "backend": "python",
                "version": sys.version.split()[0],
                "plants_count": len(PLANTS_DATABASE),
                "timestamp": datetime.now().isoformat()
            }).encode("utf-8"))

        elif path == "/api/regions":
            self._set_headers(200)
            self.wfile.write(json.dumps(REGIONS).encode("utf-8"))

        elif path == "/api/plants":
            self._set_headers(200)
            self.wfile.write(json.dumps(PLANTS_DATABASE).encode("utf-8"))

        elif path == "/api/weather":
            lat = params.get("lat", ["52.2297"])[0]
            lon = params.get("lon", ["21.0122"])[0]
            region_key = params.get("region", ["mazowieckie"])[0]
            floor = int(params.get("floor", ["2"])[0])
            orientation = params.get("orientation", ["S"])[0]

            weather_data = self._fetch_open_meteo(lat, lon, region_key, floor, orientation)
            self._set_headers(200)
            self.wfile.write(json.dumps(weather_data).encode("utf-8"))

        elif path == "/api/calendar-overview":
            current_period = get_current_period_id()
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "current_period_id": current_period,
                "periods": CALENDAR_PERIODS
            }).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not Found"}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            body = json.loads(post_data)
        except Exception:
            body = {}

        if path == "/api/recommendations":
            user_spec = body.get("user_spec", {})
            results = []
            for plant in PLANTS_DATABASE:
                suit = calculate_suitability(plant, user_spec)
                item = dict(plant)
                item["suitability"] = suit
                results.append(item)

            # Sortuj po dopasowaniu malejąco
            results.sort(key=lambda x: x["suitability"]["score"], reverse=True)

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "user_spec": user_spec,
                "recommendations": results,
                "calculated_at": datetime.now().isoformat()
            }).encode("utf-8"))

        elif path == "/api/calendar":
            user_spec = body.get("user_spec", {})
            period_id = body.get("period_id") or get_current_period_id()

            calendar_res = self._build_calendar_response(user_spec, period_id)
            self._set_headers(200)
            self.wfile.write(json.dumps(calendar_res).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint Not Found"}).encode("utf-8"))

    def _fetch_open_meteo(self, lat, lon, region_key, floor, orientation):
        """Pobiera aktualną pogodę z darmowego API Open-Meteo bez żadnych kluczy."""
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,"
            f"apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&"
            f"daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto"
        )
        
        weather = None
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "BalkonowyOgrod/1.0"})
            with urllib.request.urlopen(req, timeout=4) as response:
                if response.status == 200:
                    raw = json.loads(response.read().decode("utf-8"))
                    weather = raw
        except Exception as e:
            # Fallback w przypadku braku łączności
            print(f"[OpenMeteo Error] {e}", file=sys.stderr)

        if not weather or "current" not in weather:
            # Dane domyślne sezonowe
            now = datetime.now()
            temp = 18.0 if 5 <= now.month <= 9 else 6.0
            return {
                "source": "fallback",
                "temperature": temp,
                "apparent_temperature": temp - 1.0,
                "wind_speed": 12.0,
                "humidity": 65,
                "precipitation": 0.0,
                "weather_code": 1,
                "weather_desc": "Umiarkowane zachmurzenie",
                "balcony_advice": self._generate_balcony_weather_advice(temp, 12.0, 0.0, floor, orientation)
            }

        curr = weather.get("current", {})
        temp = curr.get("temperature_2m", 15.0)
        apparent = curr.get("apparent_temperature", temp)
        wind = curr.get("wind_speed_10m", 10.0)
        precip = curr.get("precipitation", 0.0)
        humidity = curr.get("relative_humidity_2m", 60)
        code = curr.get("weather_code", 0)

        # Interpretacja WMO kodu
        wmo_codes = {
            0: "Bezchmurnie / Pełne słońce",
            1: "Głównie słonecznie",
            2: "Częściowe zachmurzenie",
            3: "Pochmurno",
            45: "Mgła",
            51: "Lekka mżawka",
            61: "Lekki deszcz",
            63: "Umiarkowany deszcz",
            65: "Ulewny deszcz",
            71: "Opady śniegu",
            80: "Przelotne opady deszczu",
            95: "Burza"
        }
        desc = wmo_codes.get(code, "Zmienna aura")

        advice = self._generate_balcony_weather_advice(temp, wind, precip, floor, orientation)

        return {
            "source": "open-meteo",
            "temperature": round(temp, 1),
            "apparent_temperature": round(apparent, 1),
            "wind_speed": round(wind, 1),
            "humidity": round(humidity, 1),
            "precipitation": round(precip, 1),
            "weather_code": code,
            "weather_desc": desc,
            "balcony_advice": advice
        }

    def _generate_balcony_weather_advice(self, temp, wind, precip, floor, orientation):
        """Generuje profesjonalną poradę ogrodniczą dla donic w oparciu o aktualne odczyty pogodowe."""
        watering = "Umiarkowane podlewanie raz dziennie (wczesnym rankiem)."
        frost_warning = False
        wind_warning = False

        # Wpływ piętra i typu orientacji na wiatr
        if orientation == "PATIO":
            adjusted_wind = max(0, wind * 0.4)  # patio osłania przed porywami
        elif orientation == "DACH":
            adjusted_wind = wind + (floor * 2.0) + 8.0  # otwarty taras dachowy
        else:
            adjusted_wind = wind + (floor * 1.5)

        is_high_sun_orient = orientation in ["S", "SW", "SSW", "WSW", "S_W", "S_E", "DACH"]

        if temp >= 25:
            if is_high_sun_orient:
                watering = "ALARM SUSZY: Donice na silnie nasłonecznionym balkonie podlewaj obficie 2 razy dziennie (o świcie i po zachodzie słońca). Ziemia w małych pojemnikach schnie błyskawicznie!"
            else:
                watering = "Wysoka temperatura: Sprawdź wilgotność palcem na głębokość 3 cm. Podlewaj obficie rano."
        elif temp <= 3:
            watering = "Chłód: Ogranicz podlewanie do minimum. Ziemia musi być ledwo wilgotna, by zapobiec gniciu korzeni."
            frost_warning = True
        elif precip > 2.0:
            watering = "Dziś pada: Jeśli Twój balkon nie jest zadaszony, odpuść podlewanie i sprawdź czy w podstawkach nie stoi woda."

        if adjusted_wind > 35 or (floor >= 6 and wind > 25) or (orientation == "DACH" and wind > 20):
            wind_warning = True

        return {
            "watering_status": watering,
            "frost_risk": frost_warning,
            "wind_risk": wind_warning,
            "adjusted_wind_at_floor": round(adjusted_wind, 1),
            "summary": (
                "Uwaga na wiatr na wyższych piętrach! Zabezpiecz wysokie rośliny."
                if wind_warning
                else ("Ryzyko nocnego przymrozku! Schowaj delikatne rozsady do mieszkania." if frost_warning else "Stabilne warunki do uprawy doniczkowej.")
            )
        }

    def _build_calendar_response(self, user_spec, period_id):
        current_p_id = get_current_period_id()
        is_current = (period_id == current_p_id)

        period_info = next((p for p in CALENDAR_PERIODS if p["id"] == period_id), CALENDAR_PERIODS[4])

        action_labels = {
            "rozsada_dom": "Wysiew w domu na rozsadę",
            "siew_donica": "Siew wprost do donicy na balkonie",
            "hartowanie": "Hartowanie rozsad (wietrzenie)",
            "sadzenie_balkon": "Sadzenie docelowe do donic na balkonie",
            "pielegnacja": "Intensywna pielęgnacja, zasilanie i nawadnianie",
            "zbior": "Zbiory świeżych warzyw, owoców i ziół",
            "koniec_sezonu": "Likwidacja uprawy i kompostowanie",
            "zimowanie_dom": "Przeniesienie donic do mieszkania na zimę",
            "zimowanie_balkon": "Zabezpieczenie mrozoodporne donic na balkonie"
        }

        # 4 kluczowe filary prac ogrodniczych na balkonie
        pillars = {
            "siew": [],         # Co siać (wprost lub na rozsadę)
            "sadzenie": [],     # Co przesadzać i sadzić docelowo
            "pielegnacja": [],  # Co pielęgnować (podlewać, nawozić, ciąć)
            "zbior": []         # Co zbierać
        }

        actions_by_type = {}

        for plant in PLANTS_DATABASE:
            sched = plant.get("schedule", {})
            action_code = sched.get(period_id)
            if not action_code:
                continue

            label = action_labels.get(action_code, action_code)
            if label not in actions_by_type:
                actions_by_type[label] = []

            suit = calculate_suitability(plant, user_spec)
            top_var = plant.get("top_varieties", [])
            var_names = plant.get("varieties", [])

            item_data = {
                "plant_id": plant["id"],
                "plant_name": plant["name"],
                "plant_group": plant.get("plant_group", "warzywa"),
                "action_code": action_code,
                "difficulty": plant["difficulty"],
                "suitability_score": suit["score"],
                "pot_vol": plant["pot"]["min_volume_l"],
                "tip": suit["tips"][0] if suit["tips"] else plant["summary"],
                "top_varieties": top_var,
                "recommended_variety": top_var[0]["name"] if top_var else (var_names[0] if var_names else ""),
                "variety_badge": top_var[0]["badge"] if top_var else "",
                "soil_fertilizer": plant["soil"]["fertilizer"],
                "nutrition": plant.get("nutrition", {}),
                "fertilizer_guide": plant.get("fertilizer_guide"),
                "spray_guide": plant.get("spray_guide"),
                "soil_layers": plant.get("soil_layers"),
                "spacing_guide": plant.get("spacing_guide")
            }

            actions_by_type[label].append(item_data)

            # Przyporządkowanie do filarów:
            if action_code in ["siew_donica", "rozsada_dom"]:
                siew_item = dict(item_data)
                siew_item["pillar"] = "siew"
                if action_code == "rozsada_dom":
                    siew_item["action_detail"] = "Wysiew w domu na słonecznym parapecie (20-24°C) do wielodoniczek"
                else:
                    siew_item["action_detail"] = "Siew bezpośrednio do docelowych skrzynek na balkonie"
                pillars["siew"].append(siew_item)

            elif action_code in ["sadzenie_balkon", "hartowanie"]:
                sadz_item = dict(item_data)
                sadz_item["pillar"] = "sadzenie"
                if action_code == "hartowanie":
                    sadz_item["action_detail"] = "Stopniowe hartowanie rozsad w ciepłe popołudnia przed przesadzeniem"
                else:
                    sadz_item["action_detail"] = f"Sadzenie docelowe do donicy min. {plant['pot']['min_volume_l']}L z drenażem"
                pillars["sadzenie"].append(sadz_item)

            elif action_code == "zbior":
                zbior_item = dict(item_data)
                zbior_item["pillar"] = "zbior"
                zbior_item["action_detail"] = "Bieżący zbiór świeżych plonów – pobudza roślinę do dalszego wzrostu"
                pillars["zbior"].append(zbior_item)

            # Każda roślina w fazie wegetacji lub owocowania na balkonie wymaga w danym okresie pielęgnacji!
            if action_code in ["pielegnacja", "zbior", "sadzenie_balkon"]:
                piel_item = dict(item_data)
                piel_item["pillar"] = "pielegnacja"
                piel_item["action_detail"] = f"Nawadnianie i zasilanie: {plant['soil']['fertilizer']}"
                pillars["pielegnacja"].append(piel_item)

        # Dodatkowe zalecenia sezonowe w zależności od miesiąca i specyfiki balkonu

        # Dodatkowe zalecenia sezonowe w zależności od miesiąca i specyfiki balkonu
        season_tips = []
        month = period_info["month"]
        half = period_info["half"]

        if month in [1, 2]:
            season_tips.append("Planowanie sezonu: skompletuj nasiona, keramzyt, perlit i sprawdź stan donic po zimie.")
            season_tips.append("W drugiej połowie lutego możesz zacząć wysiewać na ciepłym parapecie ostre papryczki chili.")
        elif month == 3:
            season_tips.append("Marzec to czas wysiewu pomidorów na rozsadę w domu. Nie spiesz się z wystawianiem ich na zewnątrz!")
            season_tips.append("W skrzynkach na balkonie można już siać wczesną rzodkiewkę i szpinak pod osłoną agrowłókniny.")
        elif month == 4:
            season_tips.append("Siej zioła odporne na chłód, marchew miniaturową 'Pariser Markt' i rukolę.")
            season_tips.append("Pod koniec kwietnia rozpocznij stopniowe hartowanie rozsad pomidorów w ciepłe popołudnia.")
        elif month == 5:
            if half == 1:
                season_tips.append("UWAGA na 'Zimnych Ogrodników' (12-14 maja) i 'Zimną Zośkę' (15 maja) – przymrozki mogą zniszczyć rozsady!")
            else:
                season_tips.append("WIELKI START: Od 16 maja możesz bezpiecznie wystawić na balkon pomidory, papryki, ogórki i bazylię!")
                season_tips.append("Pamiętaj o drenażu: każda donica musi mieć otwory odpływowe i warstwę keramzytu.")
        elif month in [6, 7]:
            season_tips.append("Zadbaj o nawadnianie: na balkonach południowych ziemia w skrzynkach potrafi przeschnąć w 4 godziny.")
            season_tips.append("Zasilaj rośliny biohumusem lub nawozem z potasem co 10-14 dni. Zbieraj sukcesywnie sałatę i rzodkiewkę.")
        elif month == 8:
            season_tips.append("Siewy poplonowe: zwolnione skrzynki po sałatach i rzodkiewce obsiej szpinakiem, roszponką i rzodkiewką na zbiór jesienny.")
        elif month == 9:
            season_tips.append("Ostatnie zbiory pomidorów i papryk. Zielone owoce zerwij przed przymrozkami i pozwól im dojrzeć na parapecie obok jabłek.")
        elif month in [10, 11, 12]:
            season_tips.append("Zabezpieczenie na zimę: zawiń donice z bylinami (szczypiorek, jarmuż) w jutę lub folię bąbelkową i postaw na styropianie.")
            season_tips.append("Zimowy jarmuż i roszponka są gotowe do chrupania prosto ze śniegu.")

        return {
            "period": period_info,
            "is_current_period": is_current,
            "current_period_id": current_p_id,
            "actions_by_type": actions_by_type,
            "pillars": pillars,
            "season_tips": season_tips
        }

def run_server():
    server_address = ("127.0.0.1", PORT)
    httpd = HTTPServer(server_address, BalconyApiHandler)
    print(f"[Python Backend] Balkonowy Ogród API listening on http://127.0.0.1:{PORT}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        print("[Python Backend] Stopped.", flush=True)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        PORT = int(sys.argv[1])
    run_server()
