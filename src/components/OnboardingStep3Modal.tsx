import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { UserBalconySpec, CareTime, BalconyType } from '../types';
import { calculatePotVolume } from '../features/onboarding/utils/calculatePotVolume';
import { useScrollLock } from '../hooks/useScrollLock';

export interface OnboardingStep3ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (spec: Partial<UserBalconySpec>) => void;
  initialSpec?: Partial<UserBalconySpec>;
  title?: string;
  onBack?: () => void;
  onNext?: () => void;
  onNavigateToPlants?: () => void;
}

export const OnboardingStep3Modal: React.FC<OnboardingStep3ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSpec,
  title = '3. Donice i opieka',
  onBack,
  onNext,
  onNavigateToPlants,
}) => {
  // Pot dimensions state
  const [potShape, setPotShape] = useState<'rectangular' | 'round'>('rectangular');
  const [potLength, setPotLength] = useState<number>(initialSpec?.pot_dimensions?.length_cm ?? 60);
  const [potWidth, setPotWidth] = useState<number>(initialSpec?.pot_dimensions?.width_cm ?? 20);
  const [potDiameter, setPotDiameter] = useState<number>(initialSpec?.pot_dimensions?.diameter_cm ?? 30);
  const [potHeight, setPotHeight] = useState<number>(initialSpec?.pot_dimensions?.height_cm ?? 18);
  const [potCount, setPotCount] = useState<number>(initialSpec?.pot_count ?? 2);

  // Railing & care time state
  const [balconyType, setBalconyType] = useState<BalconyType>(initialSpec?.balcony_type ?? 'open_rail');
  const [careTime, setCareTime] = useState<CareTime>(initialSpec?.care_time ?? 'daily');

  useScrollLock(isOpen);

  if (!isOpen) return null;

  const currentVolume =
    potShape === 'rectangular'
      ? calculatePotVolume(potLength, potWidth, potHeight)
      : calculatePotVolume(potDiameter, potDiameter, potHeight);

  const getUpdatedSpec = (): Partial<UserBalconySpec> => ({
    ...initialSpec,
    balcony_type: balconyType,
    care_time: careTime,
    pot_count: potCount,
    pot_dimensions: {
      shape: potShape,
      length_cm: potShape === 'rectangular' ? potLength : undefined,
      width_cm: potShape === 'rectangular' ? potWidth : undefined,
      diameter_cm: potShape === 'round' ? potDiameter : undefined,
      height_cm: potHeight,
      volume_liters: currentVolume,
    },
  });

  const handleSaveAndContinue = () => {
    if (onSave) {
      onSave(getUpdatedSpec());
    }
  };

  const handleNextStep = () => {
    handleSaveAndContinue();
    if (onNext) {
      onNext();
    }
  };

  const handleGoToPlants = () => {
    handleSaveAndContinue();
    if (onNavigateToPlants) {
      onNavigateToPlants();
    }
  };

  return (
    <div
      id="onboarding-step3-backdrop"
      data-testid="onboarding-step3-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="onboarding-step3-dialog"
        data-testid="onboarding-step3-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-step3-title"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 transition-all my-auto"
      >
        {/* Fixed Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Krok 3 z 3
              </span>
            </div>
            <h2 id="onboarding-step3-title" className="text-xl font-bold text-slate-800">
              {title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Określ rodzaj donic, typ balustrady i czas, jaki chcesz poświęcić na podlewanie.
            </p>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Zamknij"
              className="min-w-11 min-h-11 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 hover:text-slate-900 border border-slate-200 transition-all cursor-pointer font-bold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Sekcja: Wymiary i liczba donic */}
          <div data-testid="pot-dimensions-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Wymiary i liczba donic</span>
              </label>

              {/* Kształt donicy */}
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPotShape('rectangular')}
                  className={`min-h-[44px] px-3 rounded-md transition cursor-pointer ${
                    potShape === 'rectangular'
                      ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Prostokątna
                </button>
                <button
                  type="button"
                  onClick={() => setPotShape('round')}
                  className={`min-h-[44px] px-3 rounded-md transition cursor-pointer ${
                    potShape === 'round'
                      ? 'bg-white text-emerald-950 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Okrągła
                </button>
              </div>
            </div>

            {/* Suwaki wymiarów */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {potShape === 'rectangular' ? (
                <>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                      <span>Długość:</span>
                      <span className="font-bold text-emerald-700">{potLength} cm</span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={120}
                      step={5}
                      value={potLength}
                      onChange={(e) => setPotLength(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                      <span>Szerokość:</span>
                      <span className="font-bold text-emerald-700">{potWidth} cm</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={2}
                      value={potWidth}
                      onChange={(e) => setPotWidth(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                    <span>Średnica:</span>
                    <span className="font-bold text-emerald-700">{potDiameter} cm</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={60}
                    step={5}
                    value={potDiameter}
                    onChange={(e) => setPotDiameter(Number(e.target.value))}
                    className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                  <span>Wysokość:</span>
                  <span className="font-bold text-emerald-700">{potHeight} cm</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={2}
                  value={potHeight}
                  onChange={(e) => setPotHeight(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-semibold text-slate-700">
                  <span>Liczba jednakowych donic:</span>
                  <span className="font-bold text-emerald-700">{potCount} szt.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPotCount((c) => Math.max(1, c - 1))}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-slate-800 text-sm">
                    {potCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPotCount((c) => Math.min(20, c + 1))}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Obliczona pojemność */}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium">Objętość 1 donicy:</span>
              <span className="font-bold text-emerald-800 text-sm">{currentVolume} litrów</span>
            </div>
          </div>

          {/* Sekcja: Typ balustrady */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Typ balustrady (barierka)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { key: 'open_rail' as BalconyType, label: 'Ażurowa barierka', desc: 'Dużo światła na dole' },
                { key: 'solid_wall' as BalconyType, label: 'Murek betonowy', desc: 'Ochrona przed wiatrem' },
                { key: 'loggia' as BalconyType, label: 'Loggia wnękowa', desc: 'Ciepły mikroklimat' },
                { key: 'french' as BalconyType, label: 'Balkon francuski', desc: 'Kompaktowe skrzynki' },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setBalconyType(r.key)}
                  className={`min-h-[48px] p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                    balconyType === r.key
                      ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>{r.label}</span>
                    {balconyType === r.key && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sekcja: Czas na podlewanie */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Czas na podlewanie (częstotliwość)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { key: 'daily' as CareTime, label: 'Codziennie', desc: 'Rano i wieczorem' },
                { key: 'few_days' as CareTime, label: 'Co 2–3 dni', desc: 'Zrównoważona opieka' },
                { key: 'weekends' as CareTime, label: 'Głównie weekendy', desc: 'Gatunki odporne na suszę' },
              ].map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setCareTime(c.key)}
                  className={`min-h-[48px] p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                    careTime === c.key
                      ? 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>{c.label}</span>
                    {careTime === c.key && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div
          data-testid="onboarding-step3-footer"
          className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 flex-shrink-0"
        >
          <div className="flex items-center gap-2">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="min-h-[48px] px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 rounded-xl hover:bg-slate-200 border border-slate-200 bg-white transition flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Wstecz</span>
              </button>
            ) : onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 rounded-xl hover:bg-slate-200 border border-slate-200 bg-white transition flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Wstecz</span>
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onNext && (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto min-h-[48px] px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Dalej &gt;</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveAndContinue}
              className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Zapisz i przejdź</span>
            </button>

            {onNavigateToPlants && (
              <button
                type="button"
                onClick={handleGoToPlants}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Przejdź do doboru roślin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStep3Modal;
