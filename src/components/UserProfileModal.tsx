import React from 'react';
import {
  User,
  LogOut,
  Settings,
  X,
  MapPin,
  Building,
  Compass,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  Clock,
} from 'lucide-react';
import { UserAccount, getFloorCategoryLabel } from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS } from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onLogout: () => void;
  onEditBalcony: () => void;
  myCropsCount: number;
}

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onEditBalcony,
  myCropsCount,
}) => {
  if (!isOpen) return null;

  const spec = user.balconySpec;
  const regionInfo = POLAND_REGIONS[spec.region];
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === spec.orientation);

  const containerLabels: Record<string, string> = {
    boxes_balcony_15cm: 'Skrzynki balkonowe (15-20 cm)',
    pots_medium_5_15: 'Donice średnie (5-15 L)',
    pots_large_15_30: 'Donice głębokie (15-30 L)',
    grow_bags: 'Worki uprawowe / growbag',
    hanging_baskets: 'Wiszące amplie',
  };

  const careLabels: Record<string, string> = {
    daily: 'Codziennie (pełna opieka)',
    few_days: 'Co 2-3 dni',
    weekends: 'Tylko weekendy (rzadka)',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-stone-100 dark:border-stone-800 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    {user.username}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Konto aktywne
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Ustawienia Twojego balkonu są przypisane do tego konta
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Synchronized Status Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-950 dark:text-emerald-200">
                Ustawienia balkonu zapisane na Twoim koncie
              </div>
              <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                Każda zmiana parametrów balkonu lub dodanie nowej rośliny jest natychmiast zapisywana w profilu{' '}
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{user.username}</span>.
              </p>
            </div>
          </div>

          {/* Saved Balcony Specs Breakdown */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>Przypisane parametry balkonu:</span>
              <button
                onClick={() => {
                  onClose();
                  onEditBalcony();
                }}
                className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Zmień parametry</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Region */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Lokalizacja i region</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {regionInfo ? regionInfo.name.split('(')[0].trim() : spec.region}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    Strefa {regionInfo?.zone || '6b'}
                  </div>
                </div>
              </div>

              {/* Floor */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-2.5">
                <Building className="w-4 h-4 text-sky-700 dark:text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Kondygnacja</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {spec.floor}. piętro ({getFloorCategoryLabel(spec.floor)})
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {spec.floor >= 6 ? 'Silniejszy wiatr' : 'Standardowa cyrkulacja'}
                  </div>
                </div>
              </div>

              {/* Orientation */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Wystawa słoneczna</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {orientItem ? orientItem.label : spec.orientation}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {orientItem?.sunHours || 'Nasłonecznienie dopasowane'}
                  </div>
                </div>
              </div>

              {/* Care & Crops */}
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-stone-400 font-medium">Tryb opieki & uprawy</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {careLabels[spec.care_time] || spec.care_time}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {myCropsCount} {myCropsCount === 1 ? 'zapisana uprawa' : 'zapisanych upraw'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditBalcony();
              }}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200/80 dark:border-stone-700 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Edytuj parametry balkonu</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="py-2.5 px-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Wyloguj</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
