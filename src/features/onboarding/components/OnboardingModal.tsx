import React, { useState } from 'react';
import { Sparkles, Check, ChevronLeft, X, Layers, Clock, Shield } from 'lucide-react';
import { UserBalconySpec, CareTime, BalconyType } from '../../../types';
import { calculatePotVolume } from '../utils/calculatePotVolume';
import { useScrollLock } from '../../../hooks/useScrollLock';

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (spec: Partial<UserBalconySpec>) => void;
  initialSpec?: Partial<UserBalconySpec>;
  title?: string;
  children?: React.ReactNode;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSpec,
  title = '3. Donice i opieka',
  children,
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

  const handleSave = () => {
    if (onSave) {
      onSave({
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
    }
  };

  return (
    <div
      id="onboarding-modal-backdrop"
      data-testid="onboarding-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden animate-fade-in"
    >
      {/* Dialog Wrapper */}
      <div
        id="onboarding-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
        className="flex flex-col max-h-[90vh] md:max-h-[85vh] max-h-[90dvh] overflow-hidden rounded-2xl bg-background bg-white dark:bg-stone-900 max-w-[560px] w-full text-stone-900 dark:text-stone-100 shadow-2xl border border-border border-zinc-100 dark:border-stone-800 transition-all my-auto"
      >
        {/* Fixed Top Bar */}
        <div className="shrink-0 flex-shrink-0 p-6 border-b border-border/40 border-zinc-100 dark:border-stone-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Krok 3 z 3
                </span>
              </div>
              <h2
                id="onboarding-modal-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 leading-tight"
              >
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                Określ rodzaj donic, typ balustrady i czas, jaki chcesz poświęcić na podlewanie.
              </p>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Zamknij"
                className="min-w-11 min-h-11 w-11 h-11 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 border border-border shadow-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <X className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 overscroll-contain">
          {children || (
            <>
              {/* Sekcja: Wymiary donic (pot dimensions) */}
              <div className="space-y-4" data-testid="pot-dimensions-section">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Wymiary i liczba donic</span>
                  </label>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {currentVolume} l / szt.
                  </span>
                </div>

                {/* Kształt donicy */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPotShape('rectangular')}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                      potShape === 'rectangular'
                        ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 shadow-xs'
                        : 'border-border bg-background text-stone-700 dark:text-stone-300 hover:border-emerald-600'
                    }`}
                  >
                    {potShape === 'rectangular' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    <span>Skrzynka prostokątna</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPotShape('round')}
                    className={`min-h-[44px] px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 ${
                      potShape === 'round'
                        ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100 shadow-xs'
                        : 'border-border bg-background text-stone-700 dark:text-stone-300 hover:border-emerald-600'
                    }`}
                  >
                    {potShape === 'round' && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                    <span>Donica okrągła</span>
                  </button>
                </div>

                {/* Pola numeryczne */}
                <div className="bg-stone-50 dark:bg-stone-900/60 p-4 rounded-xl border border-border space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {potShape === 'rectangular' ? (
                      <>
                        <div>
                          <label htmlFor="modal-pot-length" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Długość (cm)
                          </label>
                          <input
                            id="modal-pot-length"
                            type="number"
                            value={potLength}
                            onChange={(e) => setPotLength(parseFloat(e.target.value) || 0)}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label htmlFor="modal-pot-width" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                            Szerokość (cm)
                          </label>
                          <input
                            id="modal-pot-width"
                            type="number"
                            value={potWidth}
                            onChange={(e) => setPotWidth(parseFloat(e.target.value) || 0)}
                            className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-bold"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label htmlFor="modal-pot-diameter" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                          Średnica (cm)
                        </label>
                        <input
                          id="modal-pot-diameter"
                          type="number"
                          value={potDiameter}
                          onChange={(e) => setPotDiameter(parseFloat(e.target.value) || 0)}
                          className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-bold"
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="modal-pot-height" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Głębokość (cm)
                      </label>
                      <input
                        id="modal-pot-height"
                        type="number"
                        value={potHeight}
                        onChange={(e) => setPotHeight(parseFloat(e.target.value) || 0)}
                        className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <label htmlFor="modal-pot-count" className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Liczba donic:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="modal-pot-count"
                        type="number"
                        min="1"
                        max="100"
                        value={potCount}
                        onChange={(e) => setPotCount(parseInt(e.target.value, 10) || 1)}
                        className="w-20 min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-bold text-center"
                      />
                      <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">szt.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sekcja: Typ balustrady (railing) */}
              <div className="space-y-3 pt-4 border-t border-border/80">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Typ balustrady (barierka)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'open_rail' as BalconyType, label: 'Ażurkowa / szczebelki', desc: 'Maksymalny przewiew i nasłonecznienie' },
                    { key: 'solid_wall' as BalconyType, label: 'Pełna / murowana', desc: 'Osłona przed wiatrem, cień przy podłodze' },
                    { key: 'glass' as BalconyType, label: 'Szklana', desc: 'Pełne światło, ochrona przed wiatrem' },
                    { key: 'french' as BalconyType, label: 'Balkon francuski', desc: 'Tylko skrzynki montowane na barierce' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setBalconyType(r.key)}
                      className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        balconyType === r.key
                          ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : 'border-border bg-background text-stone-800 dark:text-stone-200 hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-sm">
                        <span>{r.label}</span>
                        {balconyType === r.key && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 mt-1">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sekcja: Czas na podlewanie (watering frequency) */}
              <div className="space-y-3 pt-4 border-t border-border/80">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
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
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        careTime === c.key
                          ? 'border-2 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 shadow-xs'
                          : 'border-border bg-background text-stone-800 dark:text-stone-200 hover:border-emerald-600'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-sm">
                        <span>{c.label}</span>
                        {careTime === c.key && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                      </div>
                      <span className="text-xs text-stone-500 dark:text-stone-400 mt-1">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Action Footer */}
        <footer className="sticky bottom-0 shrink-0 flex-shrink-0 bg-white/90 bg-white/95 bg-background/95 dark:bg-stone-900/95 backdrop-blur-md backdrop-blur-sm p-4 border-t border-zinc-200 border-zinc-100 border-border flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 min-h-[44px] px-4 py-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 border border-border border-zinc-200 dark:border-stone-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Wstecz</span>
              </button>
            ) : (
              <button
                type="button"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 min-h-[44px] px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Wstecz</span>
              </button>
            )}
            <span className="text-xs text-stone-500 font-medium hidden sm:inline">
              Zapisz parametry balkonu
            </span>
          </div>

          {/* CTA Button permanently visible in footer */}
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 min-h-[48px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-sm shadow-md transition-all active:scale-[0.98] focus:ring-2 focus:ring-emerald-500 focus:outline-none flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>Zapisz i przejdź</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
export default OnboardingModal;
