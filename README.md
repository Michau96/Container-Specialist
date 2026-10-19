# Container Gardening Specialist (Donicowy Specjalista)

> **An intelligent, microclimate-aware balcony and container gardening platform designed for urban gardeners.**  
> Tailored for vegetables, fruits, culinary herbs, and companion plants cultivated in pots, balcony boxes, planters, and vertical mini-greenhouses.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

---

## 🌿 Overview

Container gardening in an apartment setting is governed by physical constraints very different from in-ground farming:

* **Restricted Root Reservoir:** Roots cannot forage deep into the ground. Soil volume is confined, leading to rapid water evaporation and nutrient depletion.
* **Thermal & Hydrological Extremes:** Exposed pots heat up intensely on hot days and dry out fast. In early spring or late autumn, freezing night air surrounds the entire root ball.
* **Wind Turbulence at Altitude:** Higher floors experience strong wind shear that snaps branches, topples lightweight pots, and causes swift foliage dehydration.
* **Balcony Structural Load Capacities:** Containers soaked with water can weigh three times their dry weight, posing real structural considerations for apartment balconies.

**Container Gardening Specialist** eliminates guesswork with agrotechnical calculations tailored to your exact balcony orientation, floor level, wind exposure, container geometry, and regional Polish climate zone.

---

## ✨ Key Features

### 1. 🧭 Balcony Microclimate Calibration & Match Engine
* **Exposure & Orientation:** South (intense sun/heat), East (gentle morning sun), West (hot afternoon sun), North (cool shade).
* **Floor Height & Wind Dynamics:** Low (ground–2nd), mid (3rd–5th), high floors (6th+) with wind protection and railing type analysis.
* **Balcony Match Score (0–100%):** Compares every crop's biological tolerances against your balcony profile to predict growing success.
* **Regional Frost Alignment:** Calibrates indoor sowing, hardening off, and outdoor transplanting dates around spring frost dates ("Cold Saints" / *Zimni Ogrodnicy*).

### 2. 🔍 Plant Catalog with Sticky Filter Navigation
* **Curated Database:** Vegetables, fruits, culinary herbs, edible flowers, sprouts, and mushrooms tested for container success.
* **Sticky Search & Filter Header:** Keeps the search bar and filter pills accessible at the top during catalog scrolling.
* **Instant Debounced Search:** 150ms real-time search filtering with accessible clear button (`X`).
* **Active Filter Badges:** Quick-filter pills including `"100% dopasowania"` (Perfect Match), `"Termin aktywny"` (Active Timing), `"Wysiej teraz"` (Sow Now), and `"Sadź teraz"` (Plant Now).
* **Accessible Touch Targets:** Minimum 44x44px interactive targets across mobile and desktop viewports.
* **Detailed Care Sheets (`PlantDetailModal.tsx`):** Container volume, depth, companion planting matrix (beneficial and harmful neighbors), and dwarf/compact patio cultivar recommendations.

### 3. 🌱 "My Crops" Dashboard & Daily Care Engine
* **Weather-Adaptive Daily Tasks (*Hero Tasks*):** Real-time recommendations powered by local forecasts and plant life stages (e.g., heatwave watering warnings, storm protection notices).
* **One-Click Watering Tracker:** Log watering events instantly with a visual days-since-watered counter.
* **Phenological Growth Timeline (`CropGrowthPhaseTimeline.tsx`):** Tracks 6 developmental milestones from sowing to harvest with stage-specific advice on watering, pinching, and fertilizing.

### 4. 📸 Growth Photo Journal & Timelapse Video Player
* **Cadence Guidance:** Recommends photo checkpoints every 7–14 days.
* **Client-Side Image Compression:** HTML5 Canvas compression for instant loading and minimal storage overhead.
* **Interactive Multi-Speed Timelapse Player (`TimelapseModal.tsx`):**
  * Playback with **0.5x, 1x, 2x, and 3x** speed controls.
  * Interactive timeline scrubber with day and week badges.
  * Fullscreen theater mode and frame-by-frame stepping.
  * One-click 6-frame demo set (Balcony Tomato) for instant exploration.

### 5. 🚨 Rescue Flow (Emergency Plant Diagnostics)
* **Symptom-Driven Triage:** Diagnoses overwatering, underwatering, pests (aphids, spider mites, thrips, whiteflies), fungal pathogens (powdery mildew, botrytis, blight), and nutrient deficiencies (calcium blossom-end rot, iron chlorosis).
* **Automated Watering Suspension:** Imposes an automatic cooldown timer halting scheduled watering when root over-saturation is diagnosed.
* **Eco-Friendly Treatment Recipes:** Organic solutions (potassium horticultural soap, garlic extract, baking soda spray, diluted milk spray).

### 6. 🪴 Container & Soil Layer Calculator
* **Geometry Engine:** Precise liter calculations for cylindrical, rectangular, square, and hanging planter shapes.
* **Canvas Soil Cross-Section Diagram (`SoilCrossSection.tsx`):**
  * Layer 1 (10–15%): Expanded clay aggregate (LECA / *keramzyt*) drainage.
  * Layer 2: Permeable geotextile filter fabric.
  * Layer 3 (75–80%): Aerated potting mix with 15–20% perlite and compost.
  * Layer 4 (Top 2–3 cm): Organic mulch or LECA to reduce evaporation by up to 60%.
* **Shopping Bag Estimator:** Converts required liters into commercial retail bag counts.
* **Saturated Weight Estimator:** Computes total wet container weight to safeguard balcony structural limits.

### 7. 📅 Seasonal Gardening Calendar & Companion Planting
* **Dual-Mode Calendar:** Filter between tasks strictly for your active crops or browse the global monthly gardening almanac.
* **Balcony Allelopathy (Companion Matrix):** Clear indicators for beneficial pairings (e.g., tomatoes + basil) and harmful neighbors (e.g., tomatoes + fennel).

### 8. 🔒 Dialog Accessibility & Scroll Management
* **`useScrollLock` Hook:** Prevents background body scrolling during open modal or drawer dialogs while compensating for scrollbar width to eliminate layout shift.
* **Standardized Backdrop Styling:** `fixed inset-0 bg-black/50 backdrop-blur-sm z-50` with click-outside listener to dismiss, while preserving explicit close buttons labeled `"Zamknij"` and `"Zamknij i przejdź do aplikacji"`.
* **Floating `ScrollToTopButton`:** Smooth-scrolling button with scroll-depth detection (`window.scrollY > 400`).

### 9. ☁️ Offline-First & Firebase Cloud Sync
* Works completely offline with zero setup using browser `localStorage`.
* Optional Google sign-in or email authentication via Firebase Auth and Cloud Firestore for multi-device synchronization.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript 5.8, Tailwind CSS v4, Lucide React, Motion
* **Backend:** Express.js 4.21 (Node.js runtime), Vite SSR/Dev middleware, esbuild
* **Database & Auth:** Firebase Firestore, Firebase Authentication
* **Graphics & Processing:** HTML5 Canvas (2D soil stratification & client-side photo compression)
* **Testing:** Vitest 5.0, React Testing Library, jsdom, axe-core

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher recommended)
* npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/donicowy-specjalista.git
   cd donicowy-specjalista
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for Firebase / external services):
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000`.

---

## 🧪 Testing & Verification

Run the test suite with Vitest:

```bash
# Run all unit and integration tests
npm test

# Run tests in single-run mode
npx vitest run

# Run TypeScript typecheck / linter
npm run lint
```

---

## 📦 Production Build

```bash
# Compile client assets and backend bundle
npm run build

# Launch the production Express server
npm start
```

---

## 📂 Project Structure

```
├── USER_GUIDE.md                # Comprehensive English User Manual & Horticultural Guide
├── DOKUMENTACJA_I_MANUAL.md     # Full System Documentation & Step-by-Step Manual (English)
├── README.md                    # Project overview & technical guide
├── package.json                 # Scripts and dependencies
├── server.ts                    # Express API server & Vite production runner
├── src/
│   ├── App.tsx                  # Main application state & view router
│   ├── main.tsx                 # React DOM entry point
│   ├── types.ts                 # TypeScript domain types & interfaces
│   ├── index.css                # Tailwind CSS v4 entry point
│   ├── hooks/
│   │   ├── useScrollLock.ts     # Modal body scroll locking hook
│   │   └── useScrollLock.test.tsx
│   ├── features/
│   │   ├── catalog/             # Plant search, sticky sub-header & match badges
│   │   └── onboarding/          # Step-by-step balcony calibration wizard
│   ├── components/
│   │   ├── Header.tsx                   # Top navigation bar & language selector
│   │   ├── BalconySetupModal.tsx        # Balcony setup & calibration wizard
│   │   ├── BalconyProfileDrawer.tsx     # Slide-over "Mój balkon" profile drawer
│   │   ├── MyCropsView.tsx              # Active crops command center
│   │   ├── CropGrowthPhaseTimeline.tsx  # Phenological development timeline
│   │   ├── TimelapseModal.tsx           # Multi-speed timelapse player
│   │   ├── AddCropPhotoModal.tsx        # Photo capture & Canvas compression
│   │   ├── RescueFlowModal.tsx          # Plant diagnostics & rescue protocol
│   │   ├── PotCalculator.tsx            # Pot volume & soil requirements
│   │   ├── SoilCrossSection.tsx         # Canvas-rendered 4-layer soil diagram
│   │   ├── DailyHeroTasks.tsx           # Weather-driven daily task checklist
│   │   ├── PlantCard.tsx                # Plant catalog preview card
│   │   ├── PlantDetailModal.tsx         # Comprehensive plant care guide
│   │   ├── ScrollToTopButton.tsx        # Floating smooth scroll to top
│   │   └── CalendarView.tsx             # Seasonal gardening calendar
│   ├── lib/
│   │   ├── api.ts                       # Weather API & mock fallbacks
│   │   ├── cropGrowthPhases.ts          # Phenological stage calculations
│   │   ├── cropPhotos.ts                # Photo management & cadence logic
│   │   ├── rescueData.ts                # Diagnostic rules & remedy database
│   │   ├── potCalculations.ts           # Pot geometry & volume formulas
│   │   ├── potSupportEvaluations.ts     # Wind & structural support evaluation
│   │   ├── cropCostEstimates.ts         # Cost breakdown algorithms
│   │   └── firebase.ts                  # Firebase Firestore and Auth client
│   └── data/
│       └── plants.json                  # Curated container plant database
```

---

## 📖 Comprehensive Documentation & User Guide

For in-depth explanations of the horticultural algorithms, soil stratification formulas, and complete step-by-step user tutorials, refer to:
* [`USER_GUIDE.md`](./USER_GUIDE.md) — Complete English User Manual & System Guide
* [`DOKUMENTACJA_I_MANUAL.md`](./DOKUMENTACJA_I_MANUAL.md) — Complete System Documentation (English)

---

## 📄 License

This project is licensed under the MIT License.
