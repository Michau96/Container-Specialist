import { CropPhotoEntry, MyCropItem, Plant } from '../types';
import { getCropTimelineInfo } from './cropGrowthPhases';

/**
 * Zestaw demonstracyjnych zdjęć etapów wzrostu pomidora koktajlowego (6 klatek w odstępach 1-2 tygodni).
 * Pozwala użytkownikowi od razu przetestować animację poklatkową (timelapse).
 */
export const SAMPLE_TOMATO_TIMELAPSE: CropPhotoEntry[] = [
  {
    id: 'sample-photo-1',
    date: '2026-03-20',
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    caption: 'Kiełkowanie! Pierwsze małe siewki wybiły się z ziemi w doniczce.',
    phaseId: 'germination',
    phaseName: 'Kiełkowanie',
    dayNumber: 7,
    weekNumber: 1,
    createdAt: '2026-03-20T10:00:00.000Z',
  },
  {
    id: 'sample-photo-2',
    date: '2026-03-31',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    caption: 'Wykształciły się liście właściwe. Roślinka nabiera wigoru po przepikowaniu.',
    phaseId: 'seedling',
    phaseName: 'Siewka i pikowanie',
    dayNumber: 18,
    weekNumber: 3,
    createdAt: '2026-03-31T11:30:00.000Z',
  },
  {
    id: 'sample-photo-3',
    date: '2026-04-14',
    imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
    caption: 'Bujny wzrost wegetatywny na balkonie. Gruba łodyga i intensywnie zielone liście.',
    phaseId: 'vegetative',
    phaseName: 'Wzrost wegetatywny',
    dayNumber: 32,
    weekNumber: 5,
    createdAt: '2026-04-14T14:15:00.000Z',
  },
  {
    id: 'sample-photo-4',
    date: '2026-04-28',
    imageUrl: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=800&q=80',
    caption: 'Pojawiły się pierwsze żółte pąki i kwiaty! Pora na delikatne potrząsanie dla zapylenia.',
    phaseId: 'flowering',
    phaseName: 'Pąki i kwitnienie',
    dayNumber: 46,
    weekNumber: 7,
    createdAt: '2026-04-28T09:40:00.000Z',
  },
  {
    id: 'sample-photo-5',
    date: '2026-05-12',
    imageUrl: 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=800&q=80',
    caption: 'Kwiaty opadły, widać całe grona zielonych, powiększających się pomidorków!',
    phaseId: 'fruiting',
    phaseName: 'Zawiązywanie owoców',
    dayNumber: 60,
    weekNumber: 9,
    createdAt: '2026-05-12T16:00:00.000Z',
  },
  {
    id: 'sample-photo-6',
    date: '2026-05-27',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    caption: 'Pełna dojrzałość! Soczyście czerwone, słodkie pomidorki koktajlowe gotowe do zbioru.',
    phaseId: 'ripening',
    phaseName: 'Dojrzewanie i zbiory',
    dayNumber: 75,
    weekNumber: 11,
    createdAt: '2026-05-27T12:20:00.000Z',
  },
];

/**
 * Oblicza status rytmu fotografowania (rekomendacja: 1 zdjęcie na 1–2 tygodnie)
 */
export interface PhotoCadenceInfo {
  totalPhotos: number;
  lastPhoto: CropPhotoEntry | null;
  daysSinceLastPhoto: number | null;
  isDueForPhoto: boolean; // czy minęło >= 7 dni lub brak zdjęć
  isOverdue: boolean; // czy minęło >= 14 dni
  cadenceMessage: string;
  badgeLabel: string;
  canPlayTimelapse: boolean;
}

export function getPhotoCadenceInfo(crop: MyCropItem, _plant?: Plant): PhotoCadenceInfo {
  const photos = crop.photos || [];
  const sorted = [...photos].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const lastPhoto = sorted.length > 0 ? sorted[sorted.length - 1] : null;

  if (!lastPhoto) {
    return {
      totalPhotos: 0,
      lastPhoto: null,
      daysSinceLastPhoto: null,
      isDueForPhoto: true,
      isOverdue: false,
      cadenceMessage: 'Zrób pierwsze zdjęcie, by rozpocząć tworzenie animacji poklatkowej (timelapse)!',
      badgeLabel: 'Zrób 1. zdjęcie',
      canPlayTimelapse: false,
    };
  }

  const today = new Date();
  const lastDate = new Date(lastPhoto.date);
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const isDueForPhoto = diffDays >= 7;
  const isOverdue = diffDays >= 14;

  let cadenceMessage = '';
  let badgeLabel = '';

  if (diffDays === 0) {
    cadenceMessage = 'Zdjęcie zrobione dzisiaj! Kolejny kadr zrób za 7–14 dni, by uchwycić skok wzrostu.';
    badgeLabel = 'Zdjęcie dodane dziś ✓';
  } else if (diffDays < 7) {
    const daysLeft = 7 - diffDays;
    cadenceMessage = `Ostatnie zdjęcie dodano ${diffDays} dni temu. Następny kadr zalecany za ${daysLeft} ${daysLeft === 1 ? 'dzień' : 'dni'}.`;
    badgeLabel = `${diffDays} dni temu`;
  } else if (diffDays < 14) {
    cadenceMessage = `Minęło ${diffDays} dni od ostatniego kadru – idealny moment na uwiecznienie postępu tego tygodnia!`;
    badgeLabel = 'Czas na kadr tygodnia';
  } else {
    cadenceMessage = `Minęło już ${diffDays} dni od ostatniego zdjęcia. Roślina na pewno mocno podrosła – dodaj nowy kadr!`;
    badgeLabel = 'Zaległe zdjęcie';
  }

  return {
    totalPhotos: photos.length,
    lastPhoto,
    daysSinceLastPhoto: diffDays,
    isDueForPhoto,
    isOverdue,
    cadenceMessage,
    badgeLabel,
    canPlayTimelapse: photos.length >= 2,
  };
}

/**
 * Oblicza numer dnia i tygodnia od daty rozpoczęcia uprawy
 */
export function calculateDayAndWeek(crop: MyCropItem, targetDate: string): { dayNumber: number; weekNumber: number } {
  const startDateStr = crop.sowing?.date || crop.addedAt || new Date().toISOString().split('T')[0];
  const start = new Date(startDateStr);
  const target = new Date(targetDate);
  const diffMs = target.getTime() - start.getTime();
  const dayNumber = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
  const weekNumber = Math.max(1, Math.ceil(dayNumber / 7));
  return { dayNumber, weekNumber };
}

/**
 * Dobiera automatycznie sugerowaną fazę fenologiczną dla danego dnia
 */
export function getPhaseForDay(plant: Plant, crop: MyCropItem, dayNumber: number): { phaseId: string; phaseName: string } {
  const timelineInfo = getCropTimelineInfo(plant, crop);
  const matching = timelineInfo.phases.find((p) => dayNumber >= p.dayStart && dayNumber <= p.dayEnd);
  if (matching) {
    return { phaseId: matching.id, phaseName: matching.name };
  }
  // Jeśli po terminie lub przed
  if (dayNumber < 1) {
    return { phaseId: timelineInfo.phases[0]?.id || 'germination', phaseName: timelineInfo.phases[0]?.name || 'Siew' };
  }
  const lastPhase = timelineInfo.phases[timelineInfo.phases.length - 1];
  return { phaseId: lastPhase?.id || 'harvest', phaseName: lastPhase?.name || 'Zbiory' };
}

/**
 * Kompresuje plik graficzny za pomocą elementu Canvas, by zmieścić go bezpiecznie w localStorage
 */
export async function compressImageFile(file: File, maxDimension = 1000, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Konwertuj do formatu JPEG lub WEBP o umiarkowanym rozmiarze
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch {
          resolve(reader.result as string);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
