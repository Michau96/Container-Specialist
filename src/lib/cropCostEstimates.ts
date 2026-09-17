import { Plant, LegacyPotMaterial, PotMaterial, PotType, SupportType } from '../types';

export interface CostItem {
  id: string;
  name: string;
  category: 'seed' | 'pot' | 'soil' | 'drainage' | 'support' | 'fertilizer';
  icon: string;
  unitPriceRange: { min: number; max: number };
  quantityText: string;
  totalRange: { min: number; max: number };
  note: string;
  optional?: boolean;
}

export interface CropCostSummary {
  items: CostItem[];
  totalMin: number;
  totalMax: number;
  totalAverage: number;
  starterOnlyMin: number; // Koszt samego startu gdy masz już donicę (nasiona + ziemia + drenaż + nawóz)
  starterOnlyMax: number;
  seedsOnlyMin: number;   // Koszt samych nasion/sadzonki (gdy masz ziemię i donicę)
  seedsOnlyMax: number;
  potCostMin: number;
  potCostMax: number;
  disclaimer: string;
  savingTips: string[];
}

export interface CostCalculationParams {
  plant?: Plant | null;
  plantName?: string;
  plantGroup?: string;
  varietyName?: string;
  sowingMethod?: 'nasiona' | 'sadzonka' | 'grzybnia';
  potVolumeLiters?: number;
  potMaterial?: LegacyPotMaterial | PotMaterial;
  potType?: PotType;
  potCount?: number;
  supportType?: SupportType;
  includeFertilizerStarter?: boolean;
}

/**
 * Szacowanie kosztów założenia uprawy balkonowej
 */
export function calculateCropCostEstimates(params: CostCalculationParams): CropCostSummary {
  const {
    plant,
    plantName = plant?.name || 'Roślina',
    plantGroup = plant?.plant_group || 'warzywa',
    sowingMethod = (plant?.plant_group === 'grzyby' ? 'grzybnia' : 'nasiona'),
    potVolumeLiters = 15,
    potMaterial = 'plastic',
    potType = 'okragla',
    potCount = 1,
    supportType = 'none',
    includeFertilizerStarter = true,
  } = params;

  const count = Math.max(1, potCount);
  const items: CostItem[] = [];

  // 1. Nasiona / Sadzonka / Grzybnia
  if (sowingMethod === 'grzybnia' || plantGroup === 'grzyby') {
    items.push({
      id: 'seed-crop',
      name: 'Grzybnia / kołki do zaszczepienia',
      category: 'seed',
      icon: '🍄',
      unitPriceRange: { min: 18, max: 32 },
      quantityText: `${count} opakowanie / porcja`,
      totalRange: { min: 18 * count, max: 32 * count },
      note: 'Kołki z grzybnią boczniaka/pieczarki lub gotowy substrat do przerostu.',
    });
  } else if (sowingMethod === 'sadzonka') {
    // Sadzonka gotowa (zazwyczaj 1-2 szt. na donicę)
    const seedlingsPerPot = potVolumeLiters > 30 ? 2 : 1;
    const totalSeedlings = count * seedlingsPerPot;
    const pricePerSeedlingMin = 5;
    const pricePerSeedlingMax = 9;
    items.push({
      id: 'seed-crop',
      name: `Gotowa rozsadka / sadzonka (${plantName})`,
      category: 'seed',
      icon: '🌿',
      unitPriceRange: { min: pricePerSeedlingMin, max: pricePerSeedlingMax },
      quantityText: `${totalSeedlings} szt. (${seedlingsPerPot} szt./donicę)`,
      totalRange: {
        min: totalSeedlings * pricePerSeedlingMin,
        max: totalSeedlings * pricePerSeedlingMax,
      },
      note: 'Sadzonka hartowana z targu lub centrum ogrodniczego, gotowa do wsadzenia.',
    });
  } else {
    // Nasiona z torebki
    const isMicrogreens = plantGroup === 'kielki';
    const minSeed = isMicrogreens ? 4 : 4.5;
    const maxSeed = isMicrogreens ? 8 : 8.5;
    items.push({
      id: 'seed-crop',
      name: `Paczka nasion (${plantName})`,
      category: 'seed',
      icon: '🌱',
      unitPriceRange: { min: minSeed, max: maxSeed },
      quantityText: `1 torebka (wystarczy na ${count > 1 ? `${count} donice` : 'kilka sezonów'})`,
      totalRange: { min: minSeed, max: maxSeed },
      note: 'Jedna torebka nasion zawiera od 20 do 200+ nasion – posłuży na 2–3 sezony.',
    });
  }

  // 2. Donica / Skrzynka
  const normMat = String(potMaterial).toLowerCase();
  let potMin = 12;
  let potMax = 25;
  let potDesc = 'Standardowa donica plastikowa z podstawkiem';

  if (normMat.includes('terracotta') || normMat.includes('ceramika_terakota') || normMat.includes('terakota')) {
    if (potVolumeLiters <= 10) {
      potMin = 20;
      potMax = 38;
    } else if (potVolumeLiters <= 25) {
      potMin = 32;
      potMax = 58;
    } else {
      potMin = 50;
      potMax = 95;
    }
    potDesc = 'Doniczka z terakoty nieszkliwionej (oddychająca glina + podstawek)';
  } else if (normMat.includes('ceramic') || normMat.includes('szkliwion')) {
    if (potVolumeLiters <= 10) {
      potMin = 22;
      potMax = 42;
    } else if (potVolumeLiters <= 25) {
      potMin = 38;
      potMax = 68;
    } else {
      potMin = 60;
      potMax = 110;
    }
    potDesc = 'Doniczka ceramiczna szkliwiona z otworem odpływowym';
  } else if (normMat.includes('wood') || normMat.includes('drewno')) {
    potMin = 35;
    potMax = 75;
    potDesc = 'Drewniana skrzynka balkonowa + wkład z agrowłókniny/folii';
  } else if (normMat.includes('fabric') || normMat.includes('tkanina') || potType === 'worek_growbag') {
    if (potVolumeLiters <= 15) {
      potMin = 10;
      potMax = 18;
    } else if (potVolumeLiters <= 35) {
      potMin = 14;
      potMax = 24;
    } else {
      potMin = 18;
      potMax = 32;
    }
    potDesc = 'Torba materiałowa typu Smart Pot / Growbag z uchwytami';
  } else if (potType === 'samonawadniajaca') {
    potMin = 28;
    potMax = 62;
    potDesc = 'Skrzynka samonawadniająca z podwójnym dnem i wskaźnikiem poziomu wody';
  } else if (potType === 'skrzynka') {
    if (potVolumeLiters <= 15) {
      potMin = 14;
      potMax = 26;
    } else {
      potMin = 20;
      potMax = 38;
    }
    potDesc = 'Skrzynka balkonowa podłużna (40–80 cm) + uchwyty na barierkę';
  } else if (potType === 'wiszaca') {
    potMin = 15;
    potMax = 30;
    potDesc = 'Kosz wiszący / amplia z wkładem i łańcuszkiem';
  } else {
    // Standardowy plastik
    if (potVolumeLiters <= 8) {
      potMin = 8;
      potMax = 16;
    } else if (potVolumeLiters <= 20) {
      potMin = 14;
      potMax = 26;
    } else if (potVolumeLiters <= 40) {
      potMin = 22;
      potMax = 44;
    } else {
      potMin = 38;
      potMax = 70;
    }
    potDesc = `Pojemnik uprawny ${potVolumeLiters}L z tworzywa sztucznego`;
  }

  items.push({
    id: 'pot-container',
    name: `Donica / Skrzynka (${count > 1 ? `${count}x ` : ''}${potVolumeLiters}L)`,
    category: 'pot',
    icon: '🪴',
    unitPriceRange: { min: potMin, max: potMax },
    quantityText: `${count} szt. (~${potVolumeLiters}L)`,
    totalRange: { min: potMin * count, max: potMax * count },
    note: potDesc,
  });

  // 3. Podłoże / Ziemia (ok. 80-85% objętości pojemnika)
  const totalSubstrateLiters = Math.round(potVolumeLiters * 0.85 * count);
  // Średni koszt ziemi: 0.70 - 0.95 zł za litr
  const soilCostMin = Math.max(5, Math.round(totalSubstrateLiters * 0.70));
  const soilCostMax = Math.max(9, Math.round(totalSubstrateLiters * 0.95));

  items.push({
    id: 'soil-substrate',
    name: 'Ziemia ogrodnicza / podłoże warzywne',
    category: 'soil',
    icon: '🟫',
    unitPriceRange: { min: 0.7, max: 0.95 },
    quantityText: `~${totalSubstrateLiters} L podłoża (dla ${count} ${count === 1 ? 'donicy' : 'donic'})`,
    totalRange: { min: soilCostMin, max: soilCostMax },
    note: `Żyzna ziemia do warzyw z biohumusem/kompostem (np. worek ${totalSubstrateLiters <= 20 ? '20L' : '50L'}).`,
  });

  // 4. Keramzyt drenażowy (warstwa 2-4 cm, ok. 10-15% objętości)
  const totalDrainageLiters = Math.max(1, Math.round(potVolumeLiters * 0.15 * count));
  const drainageCostMin = Math.max(3, Math.round(totalDrainageLiters * 1.30));
  const drainageCostMax = Math.max(5, Math.round(totalDrainageLiters * 1.75));

  items.push({
    id: 'drainage-keramzite',
    name: 'Keramzyt drenażowy (warstwa na dnie)',
    category: 'drainage',
    icon: '⚪',
    unitPriceRange: { min: 1.3, max: 1.75 },
    quantityText: `~${totalDrainageLiters} L (warstwa 3 cm)`,
    totalRange: { min: drainageCostMin, max: drainageCostMax },
    note: 'Kluczowy do ochrony korzeni przed gniciem przy obfitym podlewaniu i deszczu.',
  });

  // 5. Podpora (jeśli wybrana)
  if (supportType === 'stake') {
    const stakeCost = 4 * count;
    items.push({
      id: 'support-stake',
      name: 'Palik bambusowy + klipsy/sznurek',
      category: 'support',
      icon: '🎋',
      unitPriceRange: { min: 3, max: 6 },
      quantityText: `${count} szt. (60–120 cm)`,
      totalRange: { min: 3 * count, max: 6 * count },
      note: 'Solidny tyczka bambusowa stabilizująca pęd główny przed wiatrem.',
    });
  } else if (supportType === 'trellis') {
    items.push({
      id: 'support-trellis',
      name: 'Kratka balkonowa / trejaż',
      category: 'support',
      icon: '🪜',
      unitPriceRange: { min: 18, max: 35 },
      quantityText: `${count} szt.`,
      totalRange: { min: 18 * count, max: 35 * count },
      note: 'Kratka mocowana do ściany lub donicy dla pnączy i pędów bocznych.',
    });
  } else if (supportType === 'cage') {
    items.push({
      id: 'support-cage',
      name: 'Klatka / spirala pomidorowa',
      category: 'support',
      icon: '📐',
      unitPriceRange: { min: 12, max: 22 },
      quantityText: `${count} szt.`,
      totalRange: { min: 12 * count, max: 22 * count },
      note: 'Trójwymiarowa spirala zapobiegająca wyłamywaniu pędów.',
    });
  } else if (supportType === 'balcony_railing') {
    items.push({
      id: 'support-railing',
      name: 'Mocowanie do balustrady (sznurek / opaski)',
      category: 'support',
      icon: '🧵',
      unitPriceRange: { min: 2, max: 5 },
      quantityText: '1 kłębek',
      totalRange: { min: 2, max: 5 },
      note: 'Naturalny sznurek jutowy lub elastyczne opaski ogrodnicze.',
    });
  }

  // 6. Nawóz startowy / Perlit (opcjonalny pakiet wzbogacający)
  if (includeFertilizerStarter) {
    items.push({
      id: 'fertilizer-starter',
      name: 'Nawóz startowy bio / Perlit do spulchnienia',
      category: 'fertilizer',
      icon: '🧪',
      unitPriceRange: { min: 4, max: 8 },
      quantityText: '1 opakowanie startowe',
      totalRange: { min: 4, max: 8 },
      note: 'Organiczny biohumus w płynie lub granulki z algami + perlit rozluźniający ziemię.',
      optional: true,
    });
  }

  // Obliczenia sumaryczne
  const totalMin = items.reduce((sum, item) => sum + item.totalRange.min, 0);
  const totalMax = items.reduce((sum, item) => sum + item.totalRange.max, 0);
  const totalAverage = Math.round((totalMin + totalMax) / 2);

  // Koszty gdy masz już donicę z poprzedniego roku
  const nonPotItems = items.filter((it) => it.category !== 'pot');
  const starterOnlyMin = nonPotItems.reduce((sum, item) => sum + item.totalRange.min, 0);
  const starterOnlyMax = nonPotItems.reduce((sum, item) => sum + item.totalRange.max, 0);

  // Koszt samych nasion
  const seedItem = items.find((it) => it.category === 'seed');
  const seedsOnlyMin = seedItem ? seedItem.totalRange.min : 4;
  const seedsOnlyMax = seedItem ? seedItem.totalRange.max : 8;

  const potItem = items.find((it) => it.category === 'pot');
  const potCostMin = potItem ? potItem.totalRange.min : potMin * count;
  const potCostMax = potItem ? potItem.totalRange.max : potMax * count;

  return {
    items,
    totalMin,
    totalMax,
    totalAverage,
    starterOnlyMin,
    starterOnlyMax,
    seedsOnlyMin,
    seedsOnlyMax,
    potCostMin,
    potCostMax,
    disclaimer:
      'Podane kwoty to orientacyjne szacunki rynkowe (średnie ceny w polskich sklepach ogrodniczych, marketach budowlanych i szkółkach). Rzeczywiste koszty mogą się różnić w zależności od marki, pojemności opakowań zbiorczych, promocji oraz materiałów posiadanych już w domu z poprzednich sezonów.',
    savingTips: [
      'Jedna torebka nasion (4–8 zł) zawiera zapas na 2–3 sezony lub do podziału ze znajomymi.',
      'Doniczka to zakup jednorazowy – posłuży przez wiele lat na balkonie.',
      'Kupując większy worek ziemi (np. 50L zamiast 10L) koszt za 1 litr spada nawet o 40%.',
      'Jeśli masz już donicę i zeszłoroczną ziemię, wystarczy ją odświeżyć 20% świeżego kompostu i zaoszczędzić większość budżetu.',
    ],
  };
}
