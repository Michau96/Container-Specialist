import React, { useState, useMemo, useEffect } from 'react';
import { Ruler, Sparkles, AlertCircle } from 'lucide-react';

export interface PotConfigurationStepProps {
  initialLength?: string | number;
  initialWidth?: string | number;
  initialDepth?: string | number;
  onDimensionsChange?: (dimensions: {
    length: number;
    width: number;
    depth: number;
    volumeInLiters: number | null;
  }) => void;
  onNext?: () => void;
  onBack?: () => void;
  title?: string;
  isEn?: boolean;
  minDepth?: number;
  plantName?: string;
}

export const PotConfigurationStep: React.FC<PotConfigurationStepProps> = ({
  initialLength = '60',
  initialWidth = '20',
  initialDepth = '18',
  onDimensionsChange,
  onNext,
  onBack,
  title = 'Wymiary donicy',
  isEn = false,
  minDepth,
  plantName,
}) => {
  const [length, setLength] = useState<string>(String(initialLength));
  const [width, setWidth] = useState<string>(String(initialWidth));
  const [depth, setDepth] = useState<string>(String(initialDepth));

  // Strict numerical validation for pot volume calculation in liters
  const volumeInLiters = useMemo(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const d = parseFloat(depth) || 0;
    if (l <= 0 || w <= 0 || d <= 0) return null;
    return Math.round((l * w * d) / 1000);
  }, [length, width, depth]);

  useEffect(() => {
    if (onDimensionsChange) {
      const l = parseFloat(length) || 0;
      const w = parseFloat(width) || 0;
      const d = parseFloat(depth) || 0;
      onDimensionsChange({
        length: l,
        width: w,
        depth: d,
        volumeInLiters,
      });
    }
  }, [length, width, depth, volumeInLiters, onDimensionsChange]);

  const hasInvalidInput =
    (length && (parseFloat(length) < 5 || parseFloat(length) > 300)) ||
    (width && (parseFloat(width) < 5 || parseFloat(width) > 300)) ||
    (depth && (parseFloat(depth) < 5 || parseFloat(depth) > 300));

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-slate-200 dark:border-stone-800 shadow-xs space-y-4">
      <div className="flex items-center gap-2 text-slate-800 dark:text-stone-100 font-bold text-base sm:text-lg">
        <Ruler className="w-5 h-5 text-emerald-600" />
        <h3>{title}</h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-400">
        {isEn
          ? 'Enter the inner dimensions of your container to calculate substrate volume requirements.'
          : 'Podaj wewnętrzne wymiary donicy lub skrzynki balkonowej, aby obliczyć potrzebną objętość podłoża.'}
      </p>

      {/* Dimension Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Długość (cm) */}
        <div>
          <label
            htmlFor="pot-length-input"
            className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-stone-300 mb-1"
          >
            Długość (cm)
          </label>
          <input
            id="pot-length-input"
            name="length"
            data-testid="pot-length-input"
            type="number"
            min="5"
            max="300"
            step="1"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full min-h-[44px] py-1.5 px-3 rounded-lg text-sm font-semibold border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 shadow-2xs"
            placeholder="np. 60"
          />
        </div>

        {/* Szerokość (cm) */}
        <div>
          <label
            htmlFor="pot-width-input"
            className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-stone-300 mb-1"
          >
            Szerokość (cm)
          </label>
          <input
            id="pot-width-input"
            name="width"
            data-testid="pot-width-input"
            type="number"
            min="5"
            max="300"
            step="1"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full min-h-[44px] py-1.5 px-3 rounded-lg text-sm font-semibold border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 shadow-2xs"
            placeholder="np. 20"
          />
        </div>

        {/* Głębokość (cm) */}
        <div>
          <label
            htmlFor="pot-depth-input"
            className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-stone-300 mb-1"
          >
            Głębokość (cm)
          </label>
          <input
            id="pot-depth-input"
            name="depth"
            data-testid="pot-depth-input"
            type="number"
            min="5"
            max="300"
            step="1"
            value={depth}
            onChange={(e) => setDepth(e.target.value)}
            className="w-full min-h-[44px] py-1.5 px-3 rounded-lg text-sm font-semibold border border-slate-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-slate-900 dark:text-stone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 shadow-2xs"
            placeholder="np. 18"
          />
        </div>
      </div>

      {/* Validation warning if out of bounds */}
      {hasInvalidInput && (
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Wymiary powinny mieścić się w przedziale od 5 do 300 cm.</span>
        </div>
      )}

      {/* Agrotechnical depth warning if depth is below recommended minimum */}
      {depth && parseFloat(depth) > 0 && parseFloat(depth) < (minDepth || 18) && (
        <div
          data-testid="pot-config-depth-warning"
          className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 font-semibold"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            {isEn
              ? `Agrotechnical depth warning: Depth (${depth} cm) is below minimum recommendation (${minDepth || 18} cm)${plantName ? ` for ${plantName}` : ''}.`
              : `Ostrzeżenie agrotechniczne: Głębokość donicy (${depth} cm) jest poniżej zalecanego minimum (${minDepth || 18} cm)${plantName ? ` dla ${plantName}` : ''}.`}
          </span>
        </div>
      )}

      {/* Live calculation badge rendered right below dimension inputs */}
      {volumeInLiters && (
        <div
          data-testid="pot-volume-live-badge"
          className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-medium border border-emerald-200"
        >
          <span>
            🪴 Szacowana objętość: <strong>{volumeInLiters} L</strong> podłoża
          </span>
        </div>
      )}

      {/* Optional Step Navigation Footer */}
      {(onNext || onBack) && (
        <div className="pt-3 border-t border-slate-100 dark:border-stone-800 flex items-center justify-between gap-3">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[48px] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-stone-300 hover:bg-slate-100 dark:hover:bg-stone-800 border border-slate-200 dark:border-stone-700 rounded-xl transition cursor-pointer"
            >
              Wstecz
            </button>
          ) : (
            <div />
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={!volumeInLiters}
              className={`min-h-[48px] px-6 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                !volumeInLiters
                  ? 'opacity-50 cursor-not-allowed bg-slate-200 text-slate-500'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white shadow-md cursor-pointer'
              }`}
            >
              <span>Dalej &gt;</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PotConfigurationStep;
