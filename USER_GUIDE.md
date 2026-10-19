# Container Gardening Specialist – System Documentation & Complete User Manual

> **Version:** 2.5 (Updated with Phenological Engine, Rescue Diagnostics, Timelapse Video Player & Sticky Filter Navigation)  
> **Target Audience:** Urban container gardeners cultivating vegetables, fruits, culinary herbs, and companion plants on balconies, loggias, and rooftop terraces.

---

## Table of Contents

1. [Introduction & Philosophy](#1-introduction--philosophy)
2. [Technical Architecture](#2-technical-architecture)
3. [Core Feature Breakdown](#3-core-feature-breakdown)
   - [3.1. Balcony Microclimate Profile & Matching Engine](#31-balcony-microclimate-profile--matching-engine)
   - [3.2. Plant Database & Variety Selector](#32-plant-database--variety-selector)
   - [3.3. Command Center: "My Crops"](#33-command-center-my-crops)
   - [3.4. Growth Photo Journal & Timelapse Video Player](#34-growth-photo-journal--timelapse-video-player)
   - [3.5. Rescue Flow (Emergency Plant Diagnostics)](#35-rescue-flow-emergency-plant-diagnostics)
   - [3.6. Container, Soil & Balcony Load Calculator](#36-container-soil--balcony-load-calculator)
   - [3.7. Seasonal Gardening Calendar & Companion Planting](#37-seasonal-gardening-calendar--companion-planting)
   - [3.8. Mini-Greenhouse & Cold Frame Management](#38-mini-greenhouse--cold-frame-management)
   - [3.9. Offline-First Storage & Firebase Cloud Sync](#39-offline-first-storage--firebase-cloud-sync)
4. [Step-by-Step User Instructions](#4-step-by-step-user-instructions)
   - [Step 1: Calibrate Your Balcony Profile](#step-1-calibrate-your-balcony-profile)
   - [Step 2: Select Suitable Crops & Verify Compatibility](#step-2-select-suitable-crops--verify-compatibility)
   - [Step 3: Size Containers & Prepare Stratified Soil](#step-3-size-containers--prepare-stratified-soil)
   - [Step 4: Routine Care, Watering Logs & Daily Hero Tasks](#step-4-routine-care-watering-logs--daily-hero-tasks)
   - [Step 5: Photograph Growth & Play Back Timelapse Videos](#step-5-photograph-growth--play-back-timelapse-videos)
   - [Step 6: Diagnose Sick Plants & Apply Rescue Protocols](#step-6-diagnose-sick-plants--apply-rescue-protocols)
5. [Expert Container Cultivation Rules & Common Mistakes](#5-expert-container-cultivation-rules--common-mistakes)

---

## 1. Introduction & Philosophy

**Container Gardening Specialist** (*Donicowy Specjalista*) was created specifically to solve the physical, thermal, and biological challenges of urban container gardening. Growing crops in pots on an apartment balcony is fundamentally different from traditional open-field or garden-plot agriculture:

* **Restricted Root Volume:** In a container, roots cannot forage deeper into the ground for water or minerals. Substrate reserves are limited, meaning nutrients deplete quickly and root systems require precise watering schedules.
* **Severe Thermal & Hydrological Swings:** Pot soil heats up and dries out exponentially faster than in-ground garden soil. In cold spells or early spring nights, root balls are exposed to freezing air on all sides.
* **Wind Turbulence & Altitude Dynamics:** Upper floors experience high wind velocities that snap stems, topple lightweight containers, and drastically spike transpiration rates (drying leaves within hours).
* **Structural Balcony Load Capacities:** Water-saturated containers weigh substantially more than dry soil. Without proper calculation, heavy wet soil can stress balcony load ratings.

The application eliminates guesswork by providing **scientifically validated agrotechnical calculations** tailored to your specific balcony orientation, floor level, microclimate, and regional climate conditions.

---

## 2. Technical Architecture

The application is structured as a modern Full-Stack Single-Page Application (SPA) with a lightweight Express backend proxy and optional Firebase persistence:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite)                      │
│  - Core Views: MyCropsView, PotCalculator, PlantCatalogView, Calendar   │
│  - Modals: RescueFlowModal, TimelapseModal, BalconySetupModal, Auth    │
│  - UI: Tailwind CSS v4, Lucide Icons, Accessible Modals & useScrollLock│
│  - Canvas Engine: 2D Soil Cross-Section Renderer, Client Compression   │
└───────────────────▲────────────────────────────────▲───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       CLIENT STATE & OFFLINE CACHE   │  │     BACKEND SERVICES & CLOUD │
│  - LocalStorage (Instant startup)    │  │  - Express.js API proxy      │
│  - Complete guest mode availability  │  │  - Open-Meteo Weather API    │
│  - Zero network lag for interactions │  │  - Firebase Auth & Firestore │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

### Key Source Code Architecture:
* `src/types.ts`: TypeScript contracts for balcony specifications, plant profiles, phenological stages, photo entries, and diagnostic trees.
* `src/hooks/useScrollLock.ts`: Reusable hook preventing background page scrolling during open dialogs while compensating for scrollbar width.
* `src/features/catalog/components/PlantCatalogView.tsx`: Catalog browser with sticky search header, quick-filter pills, and debounced indexing.
* `src/components/ScrollToTopButton.tsx`: Floating smooth-scroll button with scroll-depth detection (`window.scrollY > 400`).
* `src/lib/cropGrowthPhases.ts`: Phenological timeline logic calculating development milestones from sowing to harvest.
* `src/lib/cropPhotos.ts`: Photo cadence monitoring, day/week calculations, and client-side canvas compression.
* `src/lib/rescueData.ts`: Diagnostic knowledge base mapping visual symptoms to plant pathogens, pests, and physiological disorders.
* `src/lib/potCalculations.ts` & `src/lib/potSupportEvaluations.ts`: Geometry volume algorithms and wind-support stability checks.
* `src/lib/dailyRecommendations.ts`: Generator converting real-time weather forecasts and plant stages into daily actionable advice.

---

## 3. Core Feature Breakdown

### 3.1. Balcony Microclimate Profile & Matching Engine

Every recommendation starts with your **Balcony Profile** (`BalconySetupModal.tsx` and `BalconyDrawer.tsx`). You can calibrate:

1. **Sun Exposure (Compass Orientation):**
   * **South (S):** Maximum intense sunlight (>6–8 hours/day), extreme heat accumulation. Ideal for tomatoes, peppers, eggplants, and Mediterranean herbs.
   * **East (E):** Gentle morning sun (3–5 hours/day) with cool afternoons. Perfect for strawberries, lettuces, radishes, and leafy greens.
   * **West (W):** Hot afternoon sun with intense drying potential. Requires heat-tolerant crops with adequate mulch.
   * **North (N):** Shaded or cool indirect light (<2 hours direct sun). Best suited for mint, lemon balm, spinach, chives, and sorrel.
2. **Floor Level & Wind Turbulence:**
   * **Ground / Low (Floors 0–2):** Sheltered from high winds, higher humidity, potential shading from trees or adjacent buildings.
   * **Mid (Floors 3–5):** Moderate wind currents, reliable direct light.
   * **High (Floor 6+):** Strong wind gusts, rapid soil transpiration; requires sturdy containers, trellises secured to railings, and heavy pots.
3. **Balcony Enclosure Type:**
   * **Open Railing (*Ażurowa barierka*):** High airflow, excellent light reaching lower pots, higher wind exposure.
   * **Solid Concrete Wall (*Murek betonowy*):** High wind protection, but shades the bottom 80–100 cm.
   * **Recessed Loggia (*Loggia wnękowa*):** Sheltered on three sides, retaining thermal heat and creating a warm microclimate.
   * **French Balcony (*Balkon francuski*):** Narrow railing space suitable for railing boxes or compact pots.
4. **Direct Sunlight Hours:** Fine-tuning slider calibrating daily solar radiation.
5. **Geographical Region & Hardiness:** Aligns sowing and transplanting dates with local spring frost patterns (*Cold Saints* / *Zimni Ogrodnicy*, May 12–15).

#### Balcony Match Score Algorithm (0–100%)
The system matches plant requirements against your balcony's light, wind, and volume tolerances:
* **90–100% (Perfect Match):** Crops that flourish with minimal intervention.
* **70–89% (Good Match):** High success rate under standard care.
* **50–69% (Demanding):** Requires windbreaks, extra watering, or shade protection.
* **<50% (Not Recommended):** Unlikely to thrive due to insufficient sun or excessive wind.

---

### 3.2. Plant Database & Variety Selector

The **Plant Database & Search** tab (`PlantCatalogView.tsx`) features plants verified for pot cultivation:

* **Categorized Groups:** Vegetables, Fruits, Herbs, Edible Flowers, Sprouts, and Fungi.
* **Active Filter Navigation:**
  * **"100% dopasowania" (Perfect Match):** Filters exclusively for plants ideally suited to your balcony profile.
  * **"Termin aktywny" (Active Timing):** Shows crops with active sowing, planting, or harvesting windows.
  * **"Wysiej teraz" (Sow Now):** Filters for species whose indoor or outdoor sowing window is open right now.
  * **"Sadź teraz" (Plant Now):** Highlights seedlings ready for outdoor hardening and transplanting.
* **Sticky Search Sub-Header:** Features a search input (`"Szukaj nowych upraw"`) with instant 150ms debouncing and a one-click clear button (`X`).
* **Plant Detail Guide (`PlantDetailModal.tsx`):**
  * Recommended container volume (minimum and optimal liters) and depth.
  * Water and fertilizer intensity schedules.
  * Month-by-month agrotechnical calendar.
  * **Companion Planting Matrix (Allelopathy):** Highlights beneficial neighbors (e.g., tomatoes + basil) and harmful neighbors (e.g., tomatoes + fennel).
  * Recommended compact and dwarf varieties tailored for balcony boxes.

---

### 3.3. Command Center: "My Crops"

The **"My Crops"** view (`MyCropsView.tsx`) is your daily urban farming dashboard:

1. **Weather-Adaptive Daily Tasks (*Hero Tasks*):**
   * Real-time checklist dynamically generated from local forecasts (e.g., *"Heat wave alert (30°C): water tomatoes thoroughly in the evening and replenish top mulch"* or *"Heavy rainfall incoming: empty saucer water to protect roots"*).
2. **Interactive Crop Card:**
   * **Quick Water Button ("Podlej dzisiaj"):** Records watering events and resets the days-since-watered counter.
   * **Emergency Button ("Coś jest nie tak"):** Instantly launches the diagnostic Rescue Flow.
   * **Timelapse Button:** Displays current photo count and opens the frame animation viewer.
3. **In-Depth Crop Detail Tabs:**
   * **Container & Substrate:** Displays required container volume, material selection, drainage needs, and wind support recommendations.
   * **Phenological Timeline (`CropGrowthPhaseTimeline`):** Tracks progress across 6 development milestones:
     1. Sowing & Germination
     2. Seedling & First True Leaves (Pricking out)
     3. Active Vegetative Growth
     4. Budding & Flowering
     5. Fruit Setting
     6. Ripening & Harvest
   * **Photo Journal & Timelapse:** Timeline of all photos recorded for the plant with cadence regularity indicators.
   * **Balcony Greenhouse Tips:** Microclimate guidelines for enclosed structures.
   * **Notes & Irrigation History:** Timestamped care logbook.

---

### 3.4. Growth Photo Journal & Timelapse Video Player

The **Timelapse & Photo Journal** module (`TimelapseModal.tsx`, `AddCropPhotoModal.tsx`, `cropPhotos.ts`) transforms your growing journey into an animated record:

* **Cadence Guidance:** Recommends capturing **1 photo every 7–14 days** (or at major phase transitions).
* **Smart Photo Capture (`AddCropPhotoModal`):**
  * Supports direct camera capture or local file upload.
  * Automatic in-browser compression via HTML5 Canvas (high resolution with minimal byte size for instant loading).
  * Automatically calculates day numbers (e.g., *Day 28*) and weeks elapsed since sowing.
  * Associates the photo with its active phenological phase and optional notes.
* **Interactive Timelapse Player (`TimelapseModal`):**
  * Smooth frame-by-frame animation with Play / Pause controls.
  * Playback speed toggle: **0.5x, 1x, 2x, and 3x**.
  * Continuous loop toggle and manual step navigation.
  * Interactive timeline scrubber with day and phase badges.
  * Fullscreen theater mode.
  * **Instant Demo Set:** One-click loader adds 6 benchmark photos of a Balcony Tomato for immediate testing.

---

### 3.5. Rescue Flow (Emergency Plant Diagnostics)

When a plant shows signs of distress, the **Rescue Flow** (`RescueFlowModal.tsx`) provides structured diagnostic triage:

1. **Symptom Identification:**
   * *Overwatering:* Yellowing lower leaves, drooping foliage, wet substrate, root rot smell.
   * *Underwatering:* Crisp dry leaves, soil pulling away from pot edges.
   * *Pests:* Aphids, spider mites (fine webs), whiteflies, fungus gnats, thrips.
   * *Fungal Infections:* Powdery mildew (white powder coating), gray mold (botrytis), tomato early/late blight.
   * *Nutrient Deficiencies:* Iron chlorosis (yellow leaves with green veins), nitrogen deficiency (overall pale greening), calcium deficiency (blossom-end rot on tomatoes).
   * *Physical/Weather Damage:* Sunburn patches, wind-snapped branches.
2. **Actionable Emergency Plan:**
   * Immediate rescue steps (e.g., *"Halt watering for 4 days, aerate substrate with wooden skewers to deliver oxygen to roots"*).
   * Plant quarantine recommendations if contagious pests or pathogens are detected.
   * Organic treatment recipes (potassium horticultural soap, garlic extract, baking soda spray, diluted milk spray).
3. **Automated Watering Suspension:**
   * When diagnosing root over-saturation, the system automatically activates a **"Watering Suspended for N Days"** cooldown timer on the crop card, preventing premature re-watering.

---

### 3.6. Container, Soil & Balcony Load Calculator

The engineering calculator (`PotCalculator.tsx`, `SoilCrossSection.tsx`) ensures safety and proper root development:

* **Supported Container Shapes:**
  * Cylindrical / Conical (Top diameter, bottom diameter, height)
  * Rectangular Box / Trough (Length, width, height)
  * Square / Cube (Side length, height)
  * Round Bowl / Hanging Basket (Radius, depth)
* **Ideal 4-Layer Substrate Profile (Interactive Canvas Diagram):**
  * **Layer 1 (10–15% bottom depth):** Expanded clay aggregate (LECA / *keramzyt*) drainage layer preventing blocked drain holes.
  * **Layer 2:** Permeable geotextile filter fleece separating drainage from potting mix.
  * **Layer 3 (75–80% middle depth):** Aerated potting mix enriched with 15–20% horticultural perlite and worm castings/compost.
  * **Layer 4 (Top 2–3 cm):** Organic pine bark mulch, coconut coir, or LECA mulch reducing surface evaporation by up to 60%.
* **Shopping Bag Estimator:** Converts calculated liters into standard retail bag sizes (e.g., 20L soil bags, 5L LECA bags, 2L perlite bags).
* **Structural Balcony Safety:** Computes **total saturated wet weight** (wet soil + water reserve + container tare) to prevent exceeding structural load allowances.

---

### 3.7. Seasonal Gardening Calendar & Companion Planting

The **Calendar View** (`CalendarView.tsx`) provides seasonal planning:

* **Dual-Mode Filtering:**
  * *My Crops Schedule:* Shows upcoming tasks strictly for plants currently on your balcony.
  * *Global Monthly Almanac:* Comprehensive monthly task overview for all temperate crops (January to December).
* **Color-Coded Action Badges:**
  * 🟡 Yellow: Indoor sowing for seedling starts.
  * 🟢 Green: Direct outdoor sowing in balcony containers.
  * 🔵 Blue: Transplanting, hardening off, and potting outdoors.
  * 🟣 Purple: Peak flowering and nutrient feeding.
  * 🔴 Red: Harvesting fruits, leaves, and roots.

---

### 3.8. Mini-Greenhouse & Cold Frame Management

For gardeners using vertical tiered mini-greenhouses with plastic covers (`greenhouse.ts`):
* **Thermal Management:** Morning ventilation guidelines to prevent scorching (interior greenhouse temperatures can exceed 40°C on sunny spring days).
* **Condensation Control:** Air circulation routines to prevent fungal disease development on tender seedlings.

---

### 3.9. Offline-First Storage & Firebase Cloud Sync

* **Zero-Setup Offline Mode:** Starts instantly without registration. All settings, crops, logs, and photos are saved securely in browser `localStorage`.
* **Cloud Sync with Firebase:** Sign in with Google or email (`AuthModal.tsx` + `firebase.ts`) to synchronize your balcony and crop data across phones, tablets, and desktop computers.

---

## 4. Step-by-Step User Instructions

### Step 1: Calibrate Your Balcony Profile
1. On first launch, click **"Rozpocznij konfigurację"** (*Start Setup*) or open the Balcony Profile icon in the top header.
2. Select your balcony's compass orientation (use your smartphone compass app if unsure).
3. Specify your floor level, enclosure type (open railing, solid wall, or loggia), and average daily sun hours.
4. Select your geographic region in Poland (e.g., *mazowieckie*, *małopolskie*).
5. Click **"Zapisz profil balkonu"** (*Save Balcony Profile*). The entire plant catalog will immediately recompute match ratings.

### Step 2: Select Suitable Crops & Verify Compatibility
1. Navigate to the **"Baza Roślin & Dobór"** (*Plant Catalog & Selection*) tab.
2. Use the sticky header search bar to find species or click quick-filter pills like **"100% dopasowania"** or **"Wysiej teraz"**.
3. Target plants with a suitability score above 75%.
4. Click any plant card to inspect its care sheet, container size needs, and companion planting compatibility.
5. Choose your target cultivar (e.g., dwarf patio tomato *Vilma* instead of an indeterminate field tomato).
6. Click **"+ Dodaj do balkonu"** (*Add to My Balcony*).

### Step 3: Size Containers & Prepare Stratified Soil
1. Open the **"Kalkulator Donic & Podłoża"** (*Pot & Soil Calculator*) tab.
2. Enter the dimensions (in centimeters) of your planters.
3. Verify that the calculated volume meets the plant's recommended liter capacity.
4. Check the shopping list to purchase the right number of soil, LECA, and perlite bags.
5. Layer your container:
   * Pour 3–5 cm of LECA drainage at the bottom.
   * Place a circle of geotextile filter fabric.
   * Fill with pre-mixed potting soil and perlite.
   * Plant your seedling and top with 2 cm of mulch.

### Step 4: Routine Care, Watering Logs & Daily Hero Tasks
1. Check your morning **Hero Tasks** in the **"Moje Uprawy"** (*My Crops*) tab for weather-driven advice.
2. Review local weather alerts:
   * Strong wind / rainstorm: Move pots closer to the building wall.
   * Heatwave: Water thoroughly early in the morning or after sunset.
3. After watering, click **"Podlej dzisiaj"** (*Water Today*) on the crop card to log the action.

### Step 5: Photograph Growth & Play Back Timelapse Videos
1. Once every 7–14 days, photograph your plant from the same angle and distance.
2. Click **"Timelapse"** on the crop card, then select **"+ Dodaj zdjęcie"** (*Add Photo*).
3. Confirm the automatically detected phenological phase and add a short note (e.g., *"First flower blossoms opened!"*).
4. Once you have multiple photos, click **"Odtwórz timelapse"** (*Play Timelapse*). Adjust the playback speed between 0.5x and 3x, or toggle fullscreen mode.

### Step 6: Diagnose Sick Plants & Apply Rescue Protocols
1. If you spot wilting, pest webbing, or leaf spots, click **"Coś jest nie tak"** (*Something is Wrong*).
2. Select your observed symptoms from the interactive checklist.
3. Follow the diagnostic recommendations:
   * If overwatered: Accept the automatic watering suspension cooldown.
   * Prepare the recommended organic remedy spray (e.g., potassium soap for aphids or baking soda solution for mildew).

---

## 5. Expert Container Cultivation Rules & Common Mistakes

| Horticultural Topic | Recommended Expert Practice | Common Beginner Mistake |
| :--- | :--- | :--- |
| **Watering** | Check soil moisture with a finger 3–4 cm deep. Water deeply until a few drops drain into the saucer. Empty excess saucer water after 20 minutes. | Daily shallow sprinkling that wets only the top centimeter, or leaving pots sitting permanently in stagnant saucer water. |
| **Drainage** | Every container **must** have drainage holes and a 3–5 cm bottom layer of expanded clay aggregate (LECA). | Planting in decorative outer cachepots without bottom drainage holes, leading to inevitable root rot. |
| **Soil Selection** | Use loose potting soil blended with 15–20% horticultural perlite and compost. | Using dense garden dirt dug from outdoor soil, which compacts into an airless, water-repellent block in pots. |
| **Wind Protection** | On floors 3 and higher, use heavy terracotta or concrete pots and stake tall plants to railings with flexible ties. | Leaving tall tomatoes or peppers in lightweight plastic containers, which blow over in the first wind gust. |
| **Fertilization** | Nutrients leach out of container substrate with every watering. Apply balanced organic fertilizer (biohumus, seaweed extract) every 7–14 days during active growth. | Overdosing with synthetic chemical fertilizer granules (burning roots) or failing to fertilize at all throughout the season. |

---

*Container Gardening Specialist (Donicowy Specjalista) – Your intelligent urban companion from seed to harvest.*
