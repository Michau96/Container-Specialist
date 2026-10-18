import React, { useState, useEffect, useRef } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import {
  Plant,
  MyCropItem,
  CropPhotoEntry,
} from '../types';
import { SAMPLE_TOMATO_TIMELAPSE, getPhotoCadenceInfo } from '../lib/cropPhotos';
import { useLanguage } from '../lib/LanguageContext';
import { getPlantName } from '../lib/plantTranslations';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Camera,
  Calendar,
  Sparkles,
  Layers,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  crop: MyCropItem;
  plant: Plant;
  onUpdateCrop: (updatedCrop: MyCropItem) => void;
  onOpenAddPhoto: () => void;
  initialFrameIndex?: number;
}

export const TimelapseModal: React.FC<Props> = ({
  isOpen,
  onClose,
  crop,
  plant,
  onUpdateCrop,
  onOpenAddPhoto,
  initialFrameIndex = 0,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const photos = [...(crop.photos || [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const [currentIndex, setCurrentIndex] = useState<number>(
    Math.min(initialFrameIndex, Math.max(0, photos.length - 1))
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(1000); // 1000ms na kadr
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Sync index if photos change
  useEffect(() => {
    if (currentIndex >= photos.length && photos.length > 0) {
      setCurrentIndex(photos.length - 1);
    }
  }, [photos.length]);

  // Autoplay loop effect
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isPlaying && photos.length > 1) {
      timerRef.current = window.setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= photos.length - 1) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return prev;
            }
          }
          return prev + 1;
        });
      }, speedMs);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, photos.length, speedMs, isLooping]);

  if (!isOpen) return null;

  const currentPhoto: CropPhotoEntry | undefined = photos[currentIndex];
  const firstPhoto: CropPhotoEntry | undefined = photos[0];
  const cadence = getPhotoCadenceInfo(crop, plant);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (isLooping) {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (isLooping) {
      setCurrentIndex(photos.length - 1);
    }
  };

  const handleLoadDemoTimelapse = () => {
    const updated: MyCropItem = {
      ...crop,
      photos: SAMPLE_TOMATO_TIMELAPSE,
    };
    onUpdateCrop(updated);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const handleDeleteCurrentPhoto = () => {
    if (!currentPhoto) return;
    if (!window.confirm(isEn ? 'Are you sure you want to delete this photo from the timeline?' : 'Czy na pewno chcesz usunąć to zdjęcie z osi czasu?')) return;
    const remaining = photos.filter((p) => p.id !== currentPhoto.id);
    const updated: MyCropItem = {
      ...crop,
      photos: remaining,
    };
    onUpdateCrop(updated);
    if (currentIndex >= remaining.length && remaining.length > 0) {
      setCurrentIndex(remaining.length - 1);
    }
  };

  useScrollLock(true);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-stone-100 transition-all ${
          isFullscreen ? 'max-w-6xl h-[94vh]' : 'max-w-4xl max-h-[92vh]'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0 bg-stone-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-inner">
              🎞️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                  {isEn ? 'Frame Animation (Timelapse)' : 'Animacja poklatkowa (Timelapse)'}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                  {getPlantName(plant, language)}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {isEn ? 'Growth timeline • Cadence: 1 photo every 1–2 weeks' : 'Oś czasu rozwoju • Rytm: 1 zdjęcie na 1–2 tygodnie'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition cursor-pointer"
              title={isFullscreen ? (isEn ? 'Minimize window' : 'Zmniejsz okno') : (isEn ? 'Maximize window' : 'Powiększ okno')}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              id="close-timelapse-modal-btn"
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
              title={isEn ? 'Close' : 'Zamknij'}
              aria-label={isEn ? 'Close' : 'Zamknij'}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {photos.length === 0 ? (
          /* Empty state: No photos yet */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 my-auto">
            <div className="w-20 h-20 rounded-3xl bg-stone-800 border-2 border-dashed border-stone-700 flex items-center justify-center text-3xl">
              📸
            </div>
            <div className="max-w-md space-y-1.5">
              <h4 className="text-lg font-bold text-white">
                {isEn ? 'No photos in this crop log yet' : 'Brak zdjęć w dzienniku tej uprawy'}
              </h4>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                {isEn
                  ? 'Take 1 photo every 1–2 weeks. The app creates a smooth growth timelapse showing the journey from seed to harvest!'
                  : 'Rób 1 zdjęcie co 1–2 tygodnie. Aplikacja ułoży je w płynną animację wzrostu, ukazując przemianę z nasionka w kwitnący krzak!'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onOpenAddPhoto}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-lg shadow-emerald-950/50"
              >
                <Camera className="w-4 h-4" />
                <span>{isEn ? 'Add first photo' : 'Dodaj pierwsze zdjęcie'}</span>
              </button>

              <button
                type="button"
                onClick={handleLoadDemoTimelapse}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isEn ? 'Load demo: Tomato (8 weeks growth)' : 'Załaduj demo: Pomidor (8 tyg. wzrostu)'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Timelapse Screen */
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* View Mode Switcher (Pojedynczy kadr vs Przed i Po) */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400">{isEn ? 'View:' : 'Widok:'}</span>
                <button
                  type="button"
                  onClick={() => setIsCompareMode(false)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    !isCompareMode
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  {isEn ? 'Timelapse Player' : 'Odtwarzacz timelapse'}
                </button>
                {photos.length >= 2 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsCompareMode(true);
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      isCompareMode
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Compare: Start vs Now' : 'Porównaj: Start vs Teraz'}</span>
                  </button>
                )}
              </div>

              {/* Status rytmu fotografowania */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 hidden sm:inline">
                  {cadence.cadenceMessage}
                </span>
                <button
                  type="button"
                  onClick={onOpenAddPhoto}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isEn ? '+ New frame' : '+ Nowy kadr'}</span>
                </button>
              </div>
            </div>

            {/* Display Area */}
            {!isCompareMode ? (
              /* Single frame player with smooth frame presentation */
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[55vh] bg-black rounded-3xl overflow-hidden border border-stone-800 flex items-center justify-center shadow-inner select-none group">
                {currentPhoto && (
                  <img
                    key={currentPhoto.id}
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.caption || (isEn ? `Frame ${currentIndex + 1}` : `Kadr ${currentIndex + 1}`)}
                    className="w-full h-full object-contain transition-opacity duration-300 animate-fade-in"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Floating Navigation Arrows on Hover */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition cursor-pointer opacity-80 hover:opacity-100"
                  title={isEn ? 'Previous frame' : 'Poprzedni kadr'}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition cursor-pointer opacity-80 hover:opacity-100"
                  title={isEn ? 'Next frame' : 'Następny kadr'}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Top Badge: Frame number & Phase */}
                {currentPhoto && (
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-extrabold text-white">
                        {isEn ? `Frame ${currentIndex + 1} of ${photos.length}` : `Kadr ${currentIndex + 1} z ${photos.length}`}
                      </span>
                      {currentPhoto.phaseName && (
                        <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-xs font-bold text-emerald-300">
                          {currentPhoto.phaseName}
                        </span>
                      )}
                    </div>

                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-medium text-stone-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{currentPhoto.date}</span>
                      <span className="text-emerald-400 font-bold">
                        ({isEn ? `Day ${currentPhoto.dayNumber} • Wk ${currentPhoto.weekNumber}` : `Dzień ${currentPhoto.dayNumber} • Tydz. ${currentPhoto.weekNumber}`})
                      </span>
                    </span>
                  </div>
                )}

                {/* Bottom Caption Overlay */}
                {currentPhoto?.caption && (
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-stone-200 pointer-events-none">
                    <p className="leading-snug">📝 &ldquo;{currentPhoto.caption}&rdquo;</p>
                  </div>
                )}
              </div>
            ) : (
              /* Side-by-side comparison (Start vs Teraz) */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Photo */}
                <div className="bg-black rounded-2xl overflow-hidden border border-stone-800 flex flex-col">
                  <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      {isEn ? '🌱 Crop Start (Initial)' : '🌱 Początek uprawy (Start)'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {firstPhoto?.date} • {isEn ? `Day ${firstPhoto?.dayNumber}` : `Dzień ${firstPhoto?.dayNumber}`}
                    </span>
                  </div>
                  <div className="aspect-[4/3] w-full bg-black flex items-center justify-center">
                    {firstPhoto && (
                      <img
                        src={firstPhoto.imageUrl}
                        alt={isEn ? 'Crop start' : 'Początek uprawy'}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="p-2.5 text-xs text-stone-400 bg-stone-900/60">
                    {firstPhoto?.caption || firstPhoto?.phaseName || (isEn ? 'First recorded frame' : 'Pierwszy zarejestrowany kadr')}
                  </div>
                </div>

                {/* Current / Latest Photo */}
                <div className="bg-black rounded-2xl overflow-hidden border border-stone-800 flex flex-col">
                  <div className="p-3 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      {isEn ? '🌿 Selected Frame (Current)' : '🌿 Wybrany kadr (Obecny stan)'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {currentPhoto?.date} • {isEn ? `Day ${currentPhoto?.dayNumber}` : `Dzień ${currentPhoto?.dayNumber}`}
                    </span>
                  </div>
                  <div className="aspect-[4/3] w-full bg-black flex items-center justify-center">
                    {currentPhoto && (
                      <img
                        src={currentPhoto.imageUrl}
                        alt={isEn ? 'Current crop state' : 'Obecny stan uprawy'}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="p-2.5 text-xs text-stone-400 bg-stone-900/60">
                    {currentPhoto?.caption || currentPhoto?.phaseName || (isEn ? 'Current growth frame' : 'Bieżący kadr wzrostu')}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Timeline Scrubber Slider */}
            <div className="space-y-2 pt-1 bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
              <div className="flex items-center justify-between text-xs text-stone-400 font-medium">
                <span>Start: {firstPhoto?.date}</span>
                <span className="text-emerald-400 font-bold">
                  {isEn
                    ? `Scrub Timeline: Frame ${currentIndex + 1} of ${photos.length} (Day ${currentPhoto?.dayNumber || 1})`
                    : `Przewiń czas: Kadr ${currentIndex + 1} z ${photos.length} (Dzień ${currentPhoto?.dayNumber || 1})`}
                </span>
                <span>{isEn ? 'Latest:' : 'Ostatni:'} {photos[photos.length - 1]?.date}</span>
              </div>

              <input
                type="range"
                min="0"
                max={Math.max(0, photos.length - 1)}
                value={currentIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentIndex(parseInt(e.target.value, 10));
                }}
                className="w-full accent-emerald-500 h-2 bg-stone-800 rounded-lg cursor-pointer transition-all"
              />

              {/* Thumbnails Filmstrip */}
              <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
                {photos.map((photo, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentIndex(idx);
                      }}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40 scale-105 shadow-md'
                          : 'border-stone-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={photo.imageUrl}
                        alt=""
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-bold text-center text-white py-0.5">
                        {isEn ? `Wk ${photo.weekNumber}` : `Tydz. ${photo.weekNumber}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playback Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
              {/* Left: Playback controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 transition cursor-pointer"
                  title={isEn ? 'Previous frame' : 'Poprzednia klatka'}
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-sm flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-950/60"
                  title={isPlaying ? (isEn ? 'Pause animation' : 'Wstrzymaj animację') : (isEn ? 'Play animation' : 'Odtwórz animację')}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 fill-current" />
                      <span>{isEn ? 'Pause' : 'Pauza'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      <span>{isEn ? 'Play timelapse' : 'Odtwórz timelapse'}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 transition cursor-pointer"
                  title={isEn ? 'Next frame' : 'Następna klatka'}
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isLooping
                      ? 'bg-emerald-950/60 border-emerald-600 text-emerald-400'
                      : 'bg-stone-700 border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                  title={isLooping ? (isEn ? 'Loop enabled' : 'Pętla włączona (kliknij, by wyłączyć)') : (isEn ? 'Loop disabled' : 'Pętla wyłączona')}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Middle: Speed Selector */}
              <div className="flex items-center gap-1.5 bg-stone-900 px-2 py-1 rounded-xl border border-stone-700">
                <span className="text-[11px] font-bold text-stone-400 px-1">{isEn ? 'Speed:' : 'Prędkość:'}</span>
                {[
                  { label: '0.5s', ms: 500 },
                  { label: '1.0s', ms: 1000 },
                  { label: '2.0s', ms: 2000 },
                ].map((speed) => (
                  <button
                    key={speed.ms}
                    type="button"
                    onClick={() => setSpeedMs(speed.ms)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      speedMs === speed.ms
                        ? 'bg-emerald-600 text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {speed.label}
                  </button>
                ))}
              </div>

              {/* Right: Management actions */}
              <div className="flex items-center gap-2">
                {currentPhoto && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrentPhoto}
                    className="p-2.5 rounded-xl text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition cursor-pointer"
                    title={isEn ? 'Delete photo from timeline' : 'Usuń to zdjęcie z osi czasu'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onOpenAddPhoto}
                  className="px-4 py-2.5 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>{isEn ? 'Add photo' : 'Dodaj zdjęcie'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

