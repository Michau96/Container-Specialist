import React, { useState } from 'react';
import { useScrollLock } from '../hooks/useScrollLock';
import { Plant, MyCropItem, CropPhotoEntry } from '../types';
import {
  calculateDayAndWeek,
  getPhaseForDay,
  compressImageFile,
} from '../lib/cropPhotos';
import { getCropTimelineInfo } from '../lib/cropGrowthPhases';
import { useLanguage } from '../lib/LanguageContext';
import { getPlantName } from '../lib/plantTranslations';
import {
  X,
  Upload,
  Camera,
  Calendar,
  Sparkles,
  Check,
  AlertCircle,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  crop: MyCropItem;
  plant: Plant;
  onSavePhoto: (newPhoto: CropPhotoEntry) => void;
  defaultPhaseId?: string;
}

export const AddCropPhotoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  crop,
  plant,
  onSavePhoto,
  defaultPhaseId,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [photoDate, setPhotoDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(defaultPhaseId || '');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const timelineInfo = getCropTimelineInfo(plant, crop);
  const { dayNumber, weekNumber } = calculateDayAndWeek(crop, photoDate);

  // Suggested phase for this day
  const suggested = getPhaseForDay(plant, crop, dayNumber);
  const currentPhaseId = selectedPhaseId || suggested.phaseId;
  const currentPhase = timelineInfo.phases.find((p) => p.id === currentPhaseId) || timelineInfo.currentPhase;

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 0.82);
      setImagePreview(compressedDataUrl);
    } catch (err) {
      console.error('Error compressing image:', err);
      setErrorMsg(isEn ? 'Failed to process image. Please choose another JPG or PNG file.' : 'Nie udało się przetworzyć zdjęcia. Wybierz inny plik JPG lub PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseDemoTomatoImage = () => {
    // Curated high quality tomato seedling/growth shot
    setImagePreview(
      'https://images.unsplash.com/photo-1592417817098-8f3d6ef2399b?auto=format&fit=crop&w=800&q=80'
    );
    if (!caption) {
      setCaption(isEn ? 'Growth progress photo – plant is thriving on balcony.' : 'Zdjęcie postępu – roślina zdrowo rośnie na balkonie.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setErrorMsg(isEn ? 'Please choose or take a photo before saving.' : 'Wybierz lub zrób zdjęcie przed zapisaniem klatki.');
      return;
    }

    const newPhoto: CropPhotoEntry = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: photoDate,
      imageUrl: imagePreview,
      caption: caption.trim() || undefined,
      phaseId: currentPhase.id,
      phaseName: currentPhase.name,
      dayNumber,
      weekNumber,
      createdAt: new Date().toISOString(),
    };

    onSavePhoto(newPhoto);
    onClose();
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
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                {isEn ? 'Add photo to timeline & timelapse' : 'Dodaj zdjęcie do osi czasu i Timelapse'}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {getPlantName(plant, language)} • {isEn ? 'Recommended: 1 photo every 1–2 weeks' : 'Rekomendacja: 1 zdjęcie na 1–2 tygodnie'}
              </p>
            </div>
          </div>

          <button
            id="close-add-photo-modal-btn"
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
            aria-label="Zamknij"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Upload / Capture Image Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
              {isEn ? '1. Plant photo (camera or file)' : '1. Zdjęcie rośliny (z aparatu lub pliku)'}
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 aspect-[4/3] bg-black flex items-center justify-center group">
                <img
                  src={imagePreview}
                  alt={isEn ? 'Photo preview' : 'Podgląd zdjęcia'}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-white text-stone-900 font-bold text-xs cursor-pointer shadow-md hover:bg-stone-100 transition">
                    {isEn ? 'Change photo' : 'Zmień zdjęcie'}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md hover:bg-rose-700 transition cursor-pointer"
                  >
                    {isEn ? 'Delete' : 'Usuń'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-2xl bg-stone-50 dark:bg-stone-800/50 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {isEn ? 'Take photo or drag & drop file' : 'Zrób zdjęcie aparatem lub przeciągnij plik'}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isEn ? 'JPG, PNG, WEBP formats (auto compressed)' : 'Formaty JPG, PNG, WEBP (automatyczna optymalizacja rozmiaru)'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
                  <label className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Camera className="w-4 h-4" />
                    <span>{isEn ? 'Select / Take photo' : 'Wybierz / Zrób zdjęcie'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleUseDemoTomatoImage}
                    className="px-3 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-300 transition cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isEn ? 'Use demo photo' : 'Użyj zdjęcia demo'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Data i faza wzrostu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isEn ? 'Photo capture date' : 'Data wykonania zdjęcia'}</span>
              </label>
              <input
                type="date"
                value={photoDate}
                onChange={(e) => setPhotoDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              />
              <span className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 block">
                {isEn ? 'Calculated:' : 'Obliczony czas:'} <strong>{isEn ? `Day ${dayNumber}` : `Dzień ${dayNumber}`}</strong> ({isEn ? `Week ${weekNumber}` : `Tydzień ${weekNumber}`})
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                {isEn ? 'Phenological growth phase' : 'Faza fenologiczna'}
              </label>
              <select
                value={currentPhase.id}
                onChange={(e) => setSelectedPhaseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs font-semibold text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 outline-hidden"
              >
                {timelineInfo.phases.map((phase) => (
                  <option key={phase.id} value={phase.id}>
                    {phase.icon} {phase.name} ({isEn ? `Days ${phase.dayStart}–${phase.dayEnd}` : `Dni ${phase.dayStart}–${phase.dayEnd}`})
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1 block">
                {isEn ? '✓ Linked to growth schedule' : '✓ Przypisana do harmonogramu wzrostu'}
              </span>
            </div>
          </div>

          {/* 3. Podpis / Notatka z tego tygodnia */}
          <div>
            <label className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
              {isEn ? 'Caption / Note for this week (optional)' : 'Podpis / spostrzeżenie z tego tygodnia (opcjonalnie)'}
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={isEn ? 'e.g. First flower buds! / Repotted into 15L container' : 'np. Pierwsze pąki kwiatowe! / Przesadzono do donicy 15L'}
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500 outline-hidden"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              {isEn ? 'Cancel' : 'Anuluj'}
            </button>
            <button
              type="submit"
              disabled={!imagePreview || isProcessing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                imagePreview && !isProcessing
                  ? 'bg-emerald-700 hover:bg-emerald-800 active:scale-95'
                  : 'bg-stone-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? (isEn ? 'Processing...' : 'Przetwarzanie...') : (isEn ? 'Save photo to timeline' : 'Zapisz kadr do osi czasu')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

