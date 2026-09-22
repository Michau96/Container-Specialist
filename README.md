# Donicowy Specjalista (Container Gardening Specialist)

> **An intelligent, microclimate-aware balcony and container gardening platform designed for urban gardeners.**  
> Tailored for vegetables, fruits, herbs, and companion plants grown in pots, containers, and balcony boxes.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 🌿 Overview

Balcony gardening is fundamentally different from in-ground gardening:
- **Restricted root volume:** Soil in pots dries out and heats up much faster.
- **Microclimate extremes:** High floors face fierce winds, increased transpiration, and risk of toppling.
- **Hydrological risks:** Improper drainage or overwatering leads to root rot within days.
- **Structural safety:** Saturated pots can exceed balcony floor load limits.

**Donicowy Specjalista** eliminates guesswork with mathematically calibrated recommendations tailored to your exact balcony exposure, floor level, wind conditions, and regional climate.

---

## ✨ Key Features

### 1. 🧭 Balcony Microclimate Calibration & Match Engine
- **Exposure:** South (full sun/heat), East (gentle morning sun), West (hot afternoon sun), North (partial/full shade).
- **Floor Height & Wind Dynamics:** Low (ground-2nd), mid (3rd-5th), high floors (6th+) with windbreak detection.
- **Balcony Match Score (0–100%):** Evaluates every plant against your specific sun hours and exposure.
- **Regional Frost & Season Alignment:** Adjusts sowing and transplanting dates to local spring frost patterns ("Cold Saints" / *Zimni Ogrodnicy*).

### 2. 🌱 "My Crops" Dashboard & Daily Care Engine
- **Weather-Adaptive Daily Tasks (*Hero Tasks*):** Real-time daily recommendations based on local temperature, precipitation, and active crop stages.
- **Quick-Action Water Tracker:** One-click watering log with days-since-watered counter.
- **Phenological Timeline:** Dynamic growth-stage progression (sowing → germination → true leaves/pricking out → vegetative growth → flowering → fruiting → harvest) with custom care tips for each phase.

### 3. 📸 Growth Photo Journal & Timelapse Player
- **Regular Cadence Guidance:** Recommends photo checkpoints every 7–14 days.
- **Client-Side Image Optimization:** Camera capture and drag-and-drop file uploads compressed via HTML5 Canvas for instant loading and minimal storage footprint.
- **Interactive Multi-Speed Timelapse Player:**
  - Playback with 0.5x, 1x, 2x, and 3x speed controls.
  - Interactive timeline scrubber with day and week badges.
  - Fullscreen / theater mode.
  - One-click 6-frame demo set (Balcony Tomato) for instant testing.

### 4. 🚨 Rescue Flow (Emergency Plant Diagnostics)
- **Symptom-Driven Diagnostics:** Overwatering, underwatering, fungal diseases (powdery mildew, botrytis, blight), common balcony pests (aphids, spider mites, whiteflies), and nutrient deficiencies (calcium, iron, nitrogen).
- **Automated Watering Suspension:** Automatically halts scheduled watering for a set number of days upon diagnosing root over-saturation.
- **Eco-Friendly Treatment Recipes:** Organic solutions (garlic extract, potassium soap spray, baking soda, milk-water ratios).

### 5. 🪴 Container & Soil Layer Calculator
- **Geometry Volume Engine:** Precise liter calculations for cylindrical, rectangular, square, and hanging planter shapes.
- **Visual Soil Cross-Section (Canvas Renderer):**
  - Layer 1 (10–15%): Expanded clay aggregate (LECA / *keramzyt*) drainage.
  - Layer 2: Permeable geotextile filter fabric.
  - Layer 3 (75–80%): Aerated potting mix with 15–20% perlite and compost.
  - Layer 4 (Top 2–3 cm): Organic mulch or LECA to reduce evaporation by up to 60%.
- **Shopping Bag Converter:** Converts required liters into standard commercial bag sizes.
- **Saturated Weight Estimator:** Calculates total wet weight to prevent balcony overloading.

### 6. 📅 Gardening Calendar & Companion Planting
- **Dual-Mode Calendar:** Filter between tasks for your active crops or browse the global monthly gardening guide.
- **Balcony Allelopathy (Companion Matrix):** Clear indicators for beneficial pairings (e.g., tomatoes + basil) and harmful neighbors (e.g., tomatoes + fennel).
- **Compact & Dwarf Cultivar Recommendations:** Pre-selected varieties bred specifically for pots and compact containers.

### 7. ☁️ Offline-First & Firebase Cloud Sync
- Works fully offline out of the box using `localStorage`.
- Optional Firebase Authentication & Cloud Firestore synchronization for multi-device access across desktop and mobile.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend:** Express.js (Node.js runtime), Vite SSR/Dev middleware, esbuild
- **Database & Auth:** Firebase Firestore, Firebase Authentication
- **Graphics & Utilities:** HTML5 Canvas (Soil layering & photo processing), React Markdown

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn / pnpm

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

3. Configure environment variables (optional for cloud sync / AI features):
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

---

## 📦 Production Build

To build and run the optimized production bundle:

```bash
# Build the client and compile server with esbuild
npm run build

# Start the production server
npm start
```

---

## 📂 Project Structure

```
├── DOKUMENTACJA_I_MANUAL.md     # Detailed Polish documentation & user manual
├── README.md                    # English project overview & guide
├── package.json                 # Scripts and dependencies
├── server.ts                    # Express API & Vite dev/prod server
├── src/
│   ├── App.tsx                  # Main application container & router
│   ├── main.tsx                 # React entry point
│   ├── types.ts                 # TypeScript data contracts & interfaces
│   ├── index.css                # Tailwind CSS entry point
│   ├── components/
│   │   ├── Header.tsx                   # Top navigation & user profile
│   │   ├── BalconySetupModal.tsx        # Balcony calibration wizard
│   │   ├── BalconyDrawer.tsx            # Slide-over balcony settings
│   │   ├── MyCropsView.tsx              # Active crops command center
│   │   ├── CropGrowthPhaseTimeline.tsx  # Phenological growth timeline
│   │   ├── TimelapseModal.tsx           # Timelapse video playback player
│   │   ├── AddCropPhotoModal.tsx        # Photo capture & compression
│   │   ├── RescueFlowModal.tsx          # Plant diagnostics & emergency flow
│   │   ├── PotCalculator.tsx            # Pot volume & soil requirements
│   │   ├── SoilCrossSection.tsx         # Canvas-rendered soil layer graphic
│   │   ├── DailyHeroTasks.tsx           # Weather-driven daily checklist
│   │   ├── PlantCard.tsx                # Plant catalog preview card
│   │   ├── PlantDetailModal.tsx         # Comprehensive plant care guide
│   │   └── CalendarView.tsx             # Seasonal gardening calendar
│   ├── lib/
│   │   ├── cropGrowthPhases.ts          # Phenological stage calculation
│   │   ├── cropPhotos.ts                # Photo management & cadence logic
│   │   ├── rescueData.ts                # Diagnostic rules & remedy database
│   │   ├── potSupportEvaluations.ts     # Wind & structural support evaluation
│   │   ├── cropCostEstimates.ts         # Cost breakdown algorithms
│   │   └── firebase.ts                  # Firestore and Auth connectors
│   └── data/
│       └── plants.json                  # Curated container plant database
```

---

## 📖 Additional Documentation

For in-depth explanations of the horticultural algorithms, soil stratification formulas, and complete user tutorials in Polish, refer to:
- [`DOKUMENTACJA_I_MANUAL.md`](./DOKUMENTACJA_I_MANUAL.md)

---

## 📄 License

This project is licensed under the MIT License.
