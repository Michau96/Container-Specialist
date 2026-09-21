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
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover shadow-md border-2 border-emerald-500/40"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md font-bold text-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    {user.username}
                  </h3>
                  {user.authProvider === 'google' ? (
                    <span className="text-[10px] font-bold text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Konto Google</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Konto aktywne
                    </span>
                  )}
                </div>
                {user.email ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400 truncate max-w-xs">
                    {user.email}
                  </p>
                ) : (
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Ustawienia Twojego balkonu są przypisane do tego konta
                  </p>
                )}
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
