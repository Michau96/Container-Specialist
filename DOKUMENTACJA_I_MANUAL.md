# Donicowy Specjalista – Kompletna Dokumentacja Systemu i Manual Użytkownika

> **Wersja:** 2.4 (Aktualizacja z modułem fenologicznym, procedurą ratunkową i odtwarzaczem Timelapse)  
> **Przeznaczenie:** Zaawansowana platforma wsparcia ogrodnictwa pojemnikowego (warzywa, owoce, zioła i rośliny ozdobne na balkonach i tarasach).

---

## Spis Treści

1. [Wprowadzenie i Filozofia Aplikacji](#1-wprowadzenie-i-filozofia-aplikacji)
2. [Architektura Techniczna Systemu](#2-architektura-techniczna-systemu)
3. [Szczegółowy Opis Modułów Aplikacji](#3-szczegółowy-opis-modułów-aplikacji)
   - [3.1. Profil Balkonu i Silnik Rekomendacji](#31-profil-balkonu-i-silnik-rekomendacji)
   - [3.2. Baza Roślin i Inteligentny Dobór Gatunków](#32-baza-roślin-i-inteligentny-dobór-gatunków)
   - [3.3. Centrum Dowodzenia: „Moje Uprawy”](#33-centrum-dowodzenia-moje-uprawy)
   - [3.4. Dziennik Wzrostu & Animacja Poklatkowa (Timelapse)](#34-dziennik-wzrostu--animacja-poklatkowa-timelapse)
   - [3.5. Procedura Ratunkowa (Rescue Flow)](#35-procedura-ratunkowa-rescue-flow)
   - [3.6. Kalkulator Donic, Podłoża i Obciążenia Balkonu](#36-kalkulator-donic-podłoża-i-obciążenia-balkonu)
   - [3.7. Kalendarz Prac Ogrodniczych](#37-kalendarz-prac-ogrodniczych)
   - [3.8. Moduł Szklarenki Balkonowej](#38-moduł-szklarenki-balkonowej)
   - [3.9. System Kont i Synchronizacja w Chmurze](#39-system-kont-i-synchronizacja-w-chmurze)
4. [Instrukcja Użytkownika (Manual Krok po Kroku)](#4-instrukcja-użytkownika-manual-krok-po-kroku)
   - [Krok 1: Kalibracja Twojego Balkonu](#krok-1-kalibracja-twojego-balkonu)
   - [Krok 2: Dobór roślin i weryfikacja kompatybilności](#krok-2-dobór-roślin-i-weryfikacja-kompatybilności)
   - [Krok 3: Dobór donicy, zakup ziemi i przygotowanie warstw](#krok-3-dobór-donicy-zakup-ziemi-i-przygotowanie-warstw)
   - [Krok 4: Prowadzenie uprawy i codzienna opieka](#krok-4-prowadzenie-uprawy-i-codzienna-opieka)
   - [Krok 5: Tworzenie pamiątkowego Timelapse ze wzrostu](#krok-5-tworzenie-pamiątkowego-timelapse-ze-wzrostu)
   - [Krok 6: Co zrobić, gdy roślina choruje?](#krok-6-co-zrobić-gdy-roślina-choruje)
5. [Eksperckie Zasady Uprawy Pojemnikowej](#5-eksperckie-zasady-uprawy-pojemnikowej)

---

## 1. Wprowadzenie i Filozofia Aplikacji

**Donicowy Specjalista** to specjalistyczna aplikacja stworzona w odpowiedzi na wyzwania ogrodnictwa miejskiego. Uprawa roślin w donicach na balkonie drastycznie różni się od tradycyjnej uprawy w gruncie:

* **Ograniczona objętość bryły korzeniowej:** Korzenie w donicy nie mają możliwości ucieczki w głąb gleby w poszukiwaniu wody czy składników odżywczych.
* **Ekstremalne wahania termiczne i hydrologiczne:** Ziemia w donicach nagrzewa się i przesycha wielokrotnie szybciej, a w chłodne noce korzenie są narażone na przemarzanie ze wszystkich stron.
* **Czynniki wysokościowe i wiatrowe:** Wyższe piętra bloków charakteryzują się silnymi prądami powietrznymi, które łamią pędy, wywracają lekkie donice i drastycznie zwiększają transpirację (wysychanie liści).
* **Ograniczenia nośności stropu balkonu:** Zbyt ciężkie, nasiąknięte wodą donice mogą przekroczyć bezpieczne obciążenie konstrukcyjne balkonu.

Aplikacja eliminuje zgadywanie i błędy początkujących ogrodników, dostarczając **matematycznie i biologicznie zweryfikowane wytyczne** dopasowane do konkretnego balkonu w Polsce.

---

## 2. Architektura Techniczna Systemu

Aplikacja została zbudowana w architekturze nowoczesnej aplikacji internetowej typu Full-Stack (SPA + API):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 18 + Vite)                      │
│  - Komponenty: MyCropsView, PotCalculator, TimelapseModal, RescueFlow  │
│  - Stylizacja: Tailwind CSS (wsparcie trybu jasnego i ciemnego)        │
│  - Ikony: Lucide React                                                 │
│  - Grafika: Dynamiczny renderer Canvas (przekrój gleby, kompresja foto)│
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       LOKALNY STAN & STORAGE         │  │     BACKEND SERWER & CLOUD   │
│  - LocalStorage (Offline-first)      │  │  - Express.js + Vite Server  │
│  - Bezpieczny fallback dla gości     │  │  - Firebase Auth & Firestore │
│  - Natychmiastowa responsywność      │  │  - REST API Pogody i Roślin  │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

### Kluczowe moduły w kodzie źródłowym:
* `src/types.ts`: Definicje struktur danych (parametry balkonu, profile roślin, fazy fenologiczne, wpisy zdjęciowe, diagnozy ratunkowe).
* `src/lib/cropGrowthPhases.ts`: Oś czasu rozwoju rośliny (obliczenia fenologiczne, etapy siewu, kwitnienia i zbioru).
* `src/lib/cropPhotos.ts`: Zarządzanie zdjęciami, rekomendowany rytm (cadence), kalkulacja dni i tygodni, klatki demonstracyjne.
* `src/lib/rescueData.ts`: Baza wiedzy procedury ratunkowej (diagnozy patogenów, szkodników, błędów fizjologicznych).
* `src/lib/potSupportEvaluations.ts`: Analiza stabilności pojemników i doboru podpór w relacji do piętra i wiatru.
* `src/lib/cropCostEstimates.ts`: Algorytm kalkulacji kosztów założenia i prowadzenia uprawy.
* `src/lib/dailyRecommendations.ts`: Generator spersonalizowanych zaleceń dziennych bazujący na pogodzie i fazie rośliny.

---

## 3. Szczegółowy Opis Modułów Aplikacji

### 3.1. Profil Balkonu i Silnik Rekomendacji

Sercem personalizacji jest **Kreator Profilu Balkonu** (`BalconySetupModal.tsx` oraz `BalconyDrawer.tsx`). Użytkownik określa w nim kluczowe parametry mikrośrodowiska:

1. **Wystawa słoneczna (Kierunek świata):**
   * *Południowa (S)* – Pełne słońce (>6–8 h), ekstremalne nagrzewanie; idealne dla pomidorów, papryk, bakłażanów, lawendy.
   * *Wschodnia (E)* – Łagodne słońce poranne (3–5 h); optymalne dla truskawek, sałat, ziół, szczypiorku.
   * *Zachodnia (W)* – Silne, upalne słońce popołudniowe; wymaga odporności na przesuszanie.
   * *Północna (N)* – Głęboki lub umiarkowany cień (<2 h słońca); dedykowana dla mięty, melisy, szpinaku, szczawiu, bluszczy.
2. **Kondygnacja (Piętro):**
   * *Parter / Niskie (1–2 p.)* – Osłonięte od wiatru, potencjalnie większa wilgotność, ryzyko zacienienia przez drzewa.
   * *Średnie (3–5 p.)* – Umiarkowany wiatr, stabilne doświetlenie.
   * *Wysokie (6+ p.)* – Silne porywy wiatru, szybka transpiracja, konieczność ciężkich donic i stabilnych podpór.
3. **Stopień osłonięcia konstrukcji:**
   * *Loggia / Wnęka* – Chroniona z 3 stron, zatrzymuje ciepło (efekt mikroszklarni).
   * *Balkon klasyczny wystający* – Otwarty z 3 stron, przewiewny.
   * *Taras dachowy* – Maksymalna ekspozycja na wiatr i słońce.
4. **Godziny bezpośredniego słońca:** Dokładny suwak pozwalający skalibrować algorytm do rzeczywistych warunków.
5. **Region Polski:** Kalibruje długość okresu wegetacyjnego oraz średnie daty ostatnich wiosennych przymrozków („Zimni Ogrodnicy” – 12–15 maja).

#### Algorytm punktacji (Balcony Match Score 0–100%)
Każda roślina w bazie posiada wektor tolerancji na słońce, wiatr i przestrzeń. System porównuje profil balkonu z wymogami rośliny i oblicza procent dopasowania, kategoryzując wynik:
* **90–100% (Świetne dopasowanie):** Roślina będzie rosła niemal bezobsługowo.
* **70–89% (Dobre warunki):** Udana uprawa przy standardowej pielęgnacji.
* **50–69% (Wymagająca):** Wymaga osłon przeciwwiatrowych lub częstszego nawadniania.
* **<50% (Niezalecana):** Ryzyko niepowodzenia z powodu zbyt małej ilości słońca lub zbyt silnego wiatru.

---

### 3.2. Baza Roślin i Inteligentny Dobór Gatunków

W zakładce **„Baza Roślin & Dobór”** użytkownik ma dostęp do katalogu roślin przetestowanych w warunkach doniczkowych:

* **Kategorie:** Warzywa, Owoce, Zioła, Rośliny ozdobne i miododajne.
* **Filtry terminowe:**
  * *Wysiej teraz:* Pokazuje wyłącznie gatunki, dla których bieżący miesiąc jest optymalnym oknem siewu (w domu lub wprost do donic).
  * *Sadź / Pikuj teraz:* Pokazuje rośliny gotowe do wysadzenia rozsad na zewnątrz.
  * *Zbiory teraz:* Wskazuje rośliny w fazie owocowania.
* **Karta Informacyjna Rośliny (`PlantDetailModal.tsx`):**
  * Wymiary donicy: minimalna i optymalna objętość (w litrach) oraz głębokość.
  * Zapotrzebowanie wodne i nawozowe.
  * Kalendarz zabiegów miesiąc po miesiącu.
  * **Alelopatia balkonowa:** Zestawienie dobrego sąsiedztwa (np. pomidor + bazylia) oraz złego sąsiedztwa (np. pomidor + koper lub ziemniak).
  * Polecane odmiany karłowe i kompaktowe (idealne do skrzynek balkonowych).

---

### 3.3. Centrum Dowodzenia: „Moje Uprawy”

Główny ekran codziennej pracy ogrodnika (`MyCropsView.tsx`). Agreguje wszystkie aktywne rośliny użytkownika.

#### Elementy kluczowe:
1. **Dynamiczne Rekomendacje Dnia („Hero Tasks”):**
   * Automatycznie generowane zadania na dany dzień, uwzględniające aktualną pogodę (np. *„Dziś upał 29°C: podlej pomidory wieczorem i uzupełnij ściółkę”* lub *„Ostrzeżenie o przymrozku: wnieś papryki do mieszkania”*).
2. **Karta Aktywnej Uprawy:**
   * **Przycisk szybkiego podlania („Podlej dzisiaj”):** Odnotowuje zabieg w historii i zeruje licznik dni od ostatniego nawodnienia.
   * **Przycisk „Coś jest nie tak”:** Natychmiast uruchamia Procedurę Ratunkową.
   * **Przycisk „Timelapse” z licznikiem kadrów:** Otwiera odtwarzacz wideo poklatkowego lub dodawanie nowego zdjęcia.
3. **Podzakładki wewnątrz uprawy:**
   * **Doniczka & Parametry podłoża:** Wskazuje wymaganą pojemność donicy, rodzaj materiału (terakota vs plastik vs tkanina), potrzebę drenażu oraz analizę konieczności podparcia przed wiatrem. Zawiera też kalkulator kosztów założenia uprawy (`CropCostEstimatorCard`) oraz poradnik zakupowy gleby (`SoilShoppingGuideCard`).
   * **Harmonogram i fazy rozwoju (`CropGrowthPhaseTimeline`):** Oś czasu fenologicznego z podziałem na etapy:
     1. *Siew i kiełkowanie*
     2. *Pojawienie się pierwszych liści właściwych (pikowanie)*
     3. *Intensywny wzrost wegetatywny*
     4. *Pąkowanie i kwitnienie*
     5. *Zawiązywanie owoców*
     6. *Dojrzewanie i zbiory*
     Każda faza zawiera dokładne zalecenia dotyczące podlewania, zraszania i nawożenia oraz miniatury zdjęć z tego okresu.
   * **Dziennik zdjęć & Timelapse:** Szczegółowa galeria wszystkich ujęć rośliny z analizą regularności fotografowania.
   * **Szklarenka balkonowa:** Wskazówki mikroklimatu w przypadku stosowania osłon.
   * **Notatki i historia:** Osobisty dziennik ogrodniczy z rejestrem nawadniania.

---

### 3.4. Dziennik Wzrostu & Animacja Poklatkowa (Timelapse)

Unikalny moduł (`TimelapseModal.tsx`, `AddCropPhotoModal.tsx`, `cropPhotos.ts`) pozwalający na rejestrowanie i ożywianie historii życia rośliny:

* **Zalecany rytm fotografowania (Cadence):** System rekomenduje wykonywanie **1 zdjęcia co 7–14 dni** (lub przy przejściu do kolejnej fazy fenologicznej).
* **Inteligentne dodawanie zdjęć (`AddCropPhotoModal`):**
  * Obsługa aparatu fotograficznego urządzenia lub wybór pliku z dysku/pamięci telefonu.
  * Automatyczna kompresja i skalowanie obrazu w przeglądarce przy użyciu elementu HTML5 Canvas (oszczędność pamięci i natychmiastowe ładowanie).
  * Automatyczne wyliczenie numeru dnia (np. *Dzień 28*) oraz tygodnia uprawy na podstawie daty siewu.
  * Przypisanie kadru do fazy fenologicznej oraz pole na notatkę z obserwacji.
* **Odtwarzacz Poklatkowy (`TimelapseModal`):**
  * Płynne odtwarzanie poklatkowe (Play / Pause).
  * Regulacja prędkości klatek: **0.5x, 1x, 2x, 3x**.
  * Tryb pętli (Loop) oraz nawigacja klatka po klatce.
  * Interaktywny pasek kadrów (Timeline Scrubber) z etykietami dni i faz.
  * Tryb kinowy / pełnoekranowy dla prezentacji metamorfozy rośliny.
  * **Zestaw demonstracyjny:** Użytkownik może jednym kliknięciem załadować 6 wzorcowych kadrów pomidora balkonowego, aby natychmiast przetestować działanie modułu.

---

### 3.5. Procedura Ratunkowa (Rescue Flow)

Gdy roślina wykazuje niepokojące objawy, moduł ratunkowy (`RescueFlowModal.tsx`) prowadzi użytkownika przez precyzyjną ścieżkę diagnostyczną:

1. **Wybór problemu z listy objawów:**
   * Przelanie (żółknące, oklapłe liście, mokre podłoże, gnicie korzeni).
   * Przesuszenie (zwiędnięte liście, ziemia odstająca od brzegów donicy).
   * Szkodniki: mszyce, przędziorki (pajęczynki), mączliki, wciornastki.
   * Choroby grzybowe: mączniak prawdziwy (biały nalot), szara pleśń, zaraza ziemniaczana.
   * Niedobory: chloroza żelazowa (żółknięcie między nerwami), brak azotu, niedobór wapnia (sucha zgnilizna wierzchołkowa pomidorów).
   * Uszkodzenia mechaniczne: poparzenie słoneczne, połamane pędy po wichurze.
2. **Plan działania krok po kroku:**
   * Działanie natychmiastowe (np. *„Wstrzymaj podlewanie na 4 dni i zrób nakłucia w ziemi, by doprowadzić tlen do korzeni”*).
   * Izolacja / kwarantanna rośliny (jeśli występuje ryzyko zarażenia innych upraw).
   * Receptury na ekologiczne opryski (wyciąg z czosnku, szare mydło potasowe, woda z sodą oczyszczoną lub mlekiem).
3. **Automatyczne zawieszenie podlewania:**
   * Jeśli diagnoza wskaże przelanie, aplikacja aktywuje status **„Zawieszenie podlewania na N dni”** z widocznym licznikiem na karcie uprawy, blokując przypadkowe ponowne nawodnienie.

---

### 3.6. Kalkulator Donic, Podłoża i Obciążenia Balkonu

Moduł inżynieryjny (`PotCalculator.tsx`, `SoilCrossSection.tsx`):

* **Obsługiwane kształty pojemników:**
  1. *Okrągła / Stożkowa:* Średnica górna, średnica dolna, wysokość.
  2. *Skrzynka balkonowa / Koryto prostokątne:* Długość, szerokość, wysokość.
  3. *Kwadratowa / Sześcienna:* Długość boku, wysokość.
  4. *Misa / Wisząca:* Promień i głębokość.
* **Prawidłowy przekrój warstwowy podłoża (Graficzny schemat Canvas):**
  * **Warstwa 1 (10–15% dna):** Drenaż z keramzytu lub żwiru płukanego (zapobiega zatykaniu otworów odpływowych).
  * **Warstwa 2:** Agrowłóknina filtracyjna (oddziela drenaż od ziemi, zapobiegając zamulaniu keramzytu).
  * **Warstwa 3 (75–80%):** Podłoże zasadnicze (ziemia uniwersalna/warzywna + kompost + 15–20% perlitu dla napowietrzenia).
  * **Warstwa 4 (wierzch 2–3 cm):** Mulcz / ściółka (drobna kora sosnowa, keramzyt lub słoma) – redukuje parowanie o nawet 60%.
* **Kalkulator Zakupowy:** Przelicza litry na standardowe worki sklepowe (np. worki ziemi 20L, worki keramzytu 5L, perlit 2L).
* **Bezpieczeństwo Konstrukcyjne Balkonu:** Oblicza szacunkowy **ciężar donicy po obfitym podlaniu** (woda + mokra ziemia + waga pojemnika), ostrzegając przed przeciążeniem balustrady lub płyty balkonu.

---

### 3.7. Kalendarz Prac Ogrodniczych

Moduł terminarza (`CalendarView.tsx`):

* **Widok dwufunkcyjny:**
  * *Harmonogram moich upraw:* Pokazuje nadchodzące zabiegi wyłącznie dla roślin znajdujących się na Twoim balkonie.
  * *Ogólny terminarz ogrodnika:* Przegląd prac dla wszystkich gatunków w danym miesiącu (styczeń – grudzień).
* **Kolorystyczne kody czynności:**
  * 🟡 Żółty: Siew w mieszkaniu na rozsadę (indoors).
  * 🟢 Zielony: Siew bezpośredni do donic na balkonie.
  * 🔵 Niebieski: Sadzenie / pikowanie / hartowanie rozsad.
  * 🟣 Fioletowy: Kwitnienie i intensywne nawożenie.
  * 🔴 Czerwony: Zbiory plonów.

---

### 3.8. Moduł Szklarenki Balkonowej

Dla użytkowników posiadających małe szklarenki regałowe lub minitunele foliowe (`greenhouse.ts`):
* Zasady wietrzenia w słoneczne dni (zapobieganie ugotowaniu rozsad – temperatura wewnątrz może przekroczyć 40°C już w kwietniu!).
* Kontrola wilgotności i zraszania.
* Zabezpieczenie przed skraplaniem wody na liściach (profilaktyka szarej pleśni).

---

### 3.9. System Kont i Synchronizacja w Chmurze

* **Model Offline-First:** Nowy użytkownik może natychmiast korzystać z aplikacji bez rejestracji – wszystkie dane są zapisywane w pamięci lokalnej (`LocalStorage`).
* **Synchronizacja Firebase:** Po zalogowaniu e-mailem (`AuthModal.tsx` + `firebase.ts`) dane balkonu i upraw są automatycznie synchronizowane z chmurą Google Firestore, umożliwiając dostęp z telefonu, tabletu i komputera.

---

## 4. Instrukcja Użytkownika (Manual Krok po Kroku)

### Krok 1: Kalibracja Twojego Balkonu
1. Po pierwszym uruchomieniu aplikacji kliknij **„Rozpocznij konfigurację”** (lub wejdź w zakładkę profilu balkonu w prawym górnym rogu).
2. Wybierz stronę świata, na którą wychodzi Twój balkon (użyj kompasu w smartfonie, jeśli nie masz pewności).
3. Podaj piętro budynku oraz określ stopień osłonięcia przed wiatrem.
4. Wybierz region Polski i zatwierdź.
5. *Efekt:* Baza roślin natychmiast przeliczy wskaźniki dopasowania dla wszystkich gatunków.

### Krok 2: Dobór roślin i weryfikacja kompatybilności
1. Przejdź do zakładki **„Baza Roślin & Dobór”**.
2. Włącz filtr **„Wysiej teraz”** lub **„Sadź teraz”**, aby zobaczyć rośliny aktualne dla obecnej pory roku.
3. Sprawdź wskaźnik zgodności (zielony pasek procentowy). Wybieraj rośliny z dopasowaniem powyżej 75%.
4. Kliknij na roślinę, by przeczytać jej wymagania, sprawdzić dobre sąsiedztwo i wybrać docelową odmianę (np. pomidor karłowy *Vilma* zamiast wysokiego pomidora gruntowego).
5. Kliknij **„+ Dodaj do Moich Upraw”**.

### Krok 3: Dobór donicy, zakup ziemi i przygotowanie warstw
1. Wejdź w zakładkę **„Kalkulator Donic & Podłoża”**.
2. Wybierz donicę, którą posiadasz lub planujesz kupić (wprowadź jej wymiary w centymetrach).
3. Sprawdź, czy jej litraż spełnia wymagania Twojej rośliny.
4. Zobacz wygenerowaną listę zakupową (ile litrów drenażu, ziemi i perlitu potrzebujesz).
5. Zaaranżuj donicę według schematu:
   * Na dno wsyp 3–5 cm keramzytu.
   * Ułóż krążek z agrowłókniny (opcjonalnie, ale bardzo zalecane).
   * Wsyp wymieszaną ziemię z perlitem.
   * Po posadzeniu rośliny posyp wierzch 2 cm kory lub keramzytu.

### Krok 4: Prowadzenie uprawy i codzienna opieka
1. Otwórz aplikację rano przy porannej kawie – sprawdź **„Zadania dnia”** na karcie **„Moje Uprawy”**.
2. Sprawdź alerty pogodowe:
   * W przypadku ulewy lub silnego wiatru – zabezpiecz pędy lub przestaw donice pod ścianę.
   * W przypadku upału – podlej rośliny wczesnym rankiem lub po zachodzie słońca.
3. Po podlaniu kliknij **„Podlej dzisiaj”** przy danej roślinie.

### Krok 5: Tworzenie pamiątkowego Timelapse ze wzrostu
1. Raz w tygodniu (np. w każdą niedzielę) podejdź do rośliny z telefonem.
2. Na karcie uprawy kliknij przycisk **„Timelapse”** (lub wejdź w zakładkę *Dziennik zdjęć & Timelapse*).
3. Kliknij **„+ Dodaj zdjęcie”** i zrób zdjęcie rośliny (staraj się trzymać aparat pod podobnym kątem i w podobnej odległości).
4. Wybierz aktualny etap (np. *Kwitnienie*) i wpisz krótką notatkę (np. *„Pojawiły się pierwsze 3 żółte kwiatki!”*).
5. Gdy zgromadzisz minimum 2–3 zdjęcia, kliknij **„Odtwórz timelapse”**. Obserwuj metamorfozę swojej rośliny, zmieniaj prędkości odtwarzania lub załaduj klatki demonstracyjne, by zobaczyć docelowy efekt!

### Krok 6: Co zrobić, gdy roślina choruje?
1. Jeśli zauważysz żółknące liście, plamy, szkodniki lub więdnięcie – nie podlewaj na oślep!
2. Otwórz kartę tej rośliny i kliknij czerwony przycisk **„Coś jest nie tak”**.
3. Zaznacz objawy, które obserwujesz.
4. Przeczytaj diagnozę:
   * Jeśli podłoże jest przelane – zaakceptuj wstrzymanie podlewania. Aplikacja włączy bezpieczne odliczanie dni do ponownego nawodnienia.
   * Przygotuj zalecany ekologiczny oprysk (np. roztwór szarego mydła na mszyce lub wywar ze skrzypu/czosnku na grzyby).

---

## 5. Eksperckie Zasady Uprawy Pojemnikowej

| Zagadnienie | Zasada Ekspercka | Najczęstszy Błąd |
| :--- | :--- | :--- |
| **Podlewanie** | Sprawdzaj wilgotność palcem na głębokości 3–4 cm. Podlewaj obficie, ale rzadziej, aż woda lekko wycieknie na podstawkę. Po 20 minutach wylej nadmiar wody z podstawki. | Codzienne, płytkie chlapanie małą ilością wody lub pozostawianie donicy stojącej stale w wodzie (gnicie korzeni). |
| **Drenaż** | Każda donica balkonowa **musi** mieć otwory odpływowe i minimum 3–5 cm warstwy keramzytu na dnie. | Sadzenie bezpośrednio do osłonek bez dziur na dnie. |
| **Dobór Ziemi** | Stosuj lekkie podłoże strukturalne z dodatkiem 15–20% perlitu i kompostu. Ziemia ogrodowa z worka często zbija się w twardą bryłę. | Używanie ciężkiej gliniastej ziemi wykopanej z ogródka lub najtańszego torfu, który po wyschnięciu nie chłonie wody. |
| **Wiatr na Piętrach** | Na 3. piętrze i wyżej stosuj ciężkie donice z terakoty lub betonu architektonicznego i mocuj pędy do drabinek bambusowych przywiązanych do balustrady. | Pozostawianie wysokich pomidorów w lekkich plastikowych doniczkach bez podparcia – wywrócenie przy pierwszym podmuchu. |
| **Nawożenie** | W donicach składniki pokarmowe wypłukują się z każdym podlaniem. Od fazy kwitnienia stosuj nawozy organiczne (biohumus, nawóz z alg, melasa potasowa) co 7–14 dni. | Przelanie nawozem mineralnym (zasolenie podłoża i poparzenie korzeni) lub brak nawożenia przez cały sezon. |

---

*Aplikacja „Donicowy Specjalista” – Twój balkonowy asystent ogrodniczy od nasionka po obfite zbiory.*
