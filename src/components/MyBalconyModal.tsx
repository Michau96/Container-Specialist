import React from 'react';
import {
  Compass,
  Building,
  MapPin,
  Sun,
  Shield,
  Clock,
  ArrowRight,
  Settings,
  Sparkles,
} from 'lucide-react';
import { UserBalconySpec, getFloorCategoryLabel } from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS } from '../lib/api';
import { useScrollLock } from '../hooks/useScrollLock';

export interface MyBalconyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userSpec: UserBalconySpec;
  onNavigateToPlants?: () => void;
  onOpenFullSetup?: () => void;
  onSave?: (spec: Partial<UserBalconySpec>) => void;
}

export const MyBalconyModal: React.FC<MyBalconyModalProps> = ({
  isOpen,
  onClose,
  userSpec,
  onNavigateToPlants,
  onOpenFullSetup,
}) => {
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const regionInfo = POLAND_REGIONS[userSpec.region];
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === userSpec.orientation);
  const orientationDisplay = orientItem ? orientItem.label : `Wystawa ${userSpec.orientation}`;
  const floorCategory = getFloorCategoryLabel(userSpec.floor);

  const handleGoToPlants = () => {
    onClose();
    if (onNavigateToPlants) {
      onNavigateToPlants();
    }
  };

  const handleEditConfig = () => {
    onClose();
    if (onOpenFullSetup) {
      onOpenFullSetup();
    }
  };

  return (
    <div
      id="my-balcony-modal-backdrop"
      data-testid="my-balcony-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="my-balcony-modal-dialog"
        data-testid="my-balcony-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-balcony-modal-heading"
        className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 dark:border-stone-800 transition-all my-auto"
      >
        {/* Fixed Header */}
        <div className="p-5 border-b border-slate-100 dark:border-stone-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 id="my-balcony-modal-heading" className="text-xl font-bold text-slate-800 dark:text-stone-100">
                Mój balkon
              </h2>
              <span className="text-xs text-slate-500 dark:text-stone-400 font-medium">
                Aktualne parametry mikroklimatu i ekspozycji
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="min-w-11 min-h-11 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 dark:hover:bg-stone-700 active:scale-[0.98] text-slate-700 dark:text-stone-200 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-stone-700 transition-all cursor-pointer font-bold text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Key Parameters Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Wystawa S */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-750 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400">
                  Wystawa
                </span>
                <p className="font-bold text-slate-800 dark:text-stone-100 text-sm mt-0.5">
                  Wystawa {userSpec.orientation} ({orientationDisplay})
                </p>
                <p className="text-xs text-slate-500 dark:text-stone-300 mt-0.5">
                  Średnio {userSpec.orientation.includes('S') ? '6–8 h' : userSpec.orientation.includes('E') ? '4–5 h' : '3–4 h'} bezpośredniego słońca
                </p>
              </div>
            </div>

            {/* Piętro 1-3 */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-750 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400">
                  Kondygnacja
                </span>
                <p className="font-bold text-slate-800 dark:text-stone-100 text-sm mt-0.5">
                  Piętro {userSpec.floor} ({floorCategory})
                </p>
                <p className="text-xs text-slate-500 dark:text-stone-300 mt-0.5">
                  {userSpec.floor >= 4 ? 'Silniejsze porywy wiatru' : 'Umiarkowane podmuchy'}
                </p>
              </div>
            </div>

            {/* Region Mazowieckie */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-750 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400">
                  Region
                </span>
                <p className="font-bold text-slate-800 dark:text-stone-100 text-sm mt-0.5">
                  {regionInfo ? regionInfo.name : 'Mazowieckie'}
                </p>
                <p className="text-xs text-slate-500 dark:text-stone-300 mt-0.5">
                  Przymrozki do 15 maja (Zimni Ogrodnicy)
                </p>
              </div>
            </div>

            {/* Typ balustrady */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-750 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400">
                  Typ balustrady
                </span>
                <p className="font-bold text-slate-800 dark:text-stone-100 text-sm mt-0.5">
                  {userSpec.balcony_type === 'open_rail'
                    ? 'Ażurowa barierka'
                    : userSpec.balcony_type === 'solid_wall'
                    ? 'Murek betonowy'
                    : userSpec.balcony_type === 'loggia'
                    ? 'Loggia wnękowa'
                    : 'Balkon francuski'}
                </p>
                <p className="text-xs text-slate-500 dark:text-stone-300 mt-0.5">
                  {userSpec.roofing === 'covered' ? 'Zadaszony od góry' : 'Brak zadaszenia'}
                </p>
              </div>
            </div>
          </div>

          {/* Czas na opiekę */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-stone-800/60 border border-slate-100 dark:border-stone-750 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-stone-400">
                  Czas na podlewanie
                </span>
                <p className="font-bold text-slate-800 dark:text-stone-100 text-sm">
                  {userSpec.care_time === 'daily'
                    ? 'Codziennie (10–15 min)'
                    : userSpec.care_time === 'few_days'
                    ? 'Co 2–3 dni'
                    : 'Głównie w weekendy'}
                </p>
              </div>
            </div>
            {onOpenFullSetup && (
              <button
                type="button"
                onClick={handleEditConfig}
                className="min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 text-slate-700 dark:text-stone-200 border border-slate-200 dark:border-stone-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-stone-400" />
                <span>Edytuj</span>
              </button>
            )}
          </div>

          {/* Podsumowanie mikroklimatu */}
          <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 text-xs sm:text-sm leading-relaxed space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Wskazówka agrotechniczna dla Twojego balkonu</span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-300/90">
              Dla wystawy {userSpec.orientation} i piętra {userSpec.floor} baza rekomenduje rośliny ciepłolubne lub stabilne zioła śródziemnomorskie. Dobieraj donice o pojemności min. 10–15L, aby podłoże nie przesychało zbyt gwałtownie.
            </p>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-stone-900 border-t border-slate-100 dark:border-stone-800 flex items-center justify-end gap-3 flex-shrink-0">
          {onOpenFullSetup && (
            <button
              type="button"
              onClick={handleEditConfig}
              className="w-full sm:w-auto min-h-[48px] px-5 py-3 border border-slate-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-slate-100 dark:hover:bg-stone-700 active:scale-[0.98] text-slate-700 dark:text-stone-200 font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Zapisz i przejdź</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleGoToPlants}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Przejdź do doboru roślin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBalconyModal;
