import React from 'react';
import {
  Sprout,
  Calendar,
  Settings,
  BookOpen,
  Compass,
  Building,
  MapPin,
  Sparkles,
  Ruler,
} from 'lucide-react';
import { UserBalconySpec } from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS } from '../lib/api';

interface Props {
  activeTab: 'recommendations' | 'calculator' | 'calendar' | 'knowledge';
  onTabChange: (tab: 'recommendations' | 'calculator' | 'calendar' | 'knowledge') => void;
  userSpec: UserBalconySpec;
  onOpenSetup: () => void;
}

export const Header: React.FC<Props> = ({ activeTab, onTabChange, userSpec, onOpenSetup }) => {
  const regionInfo = POLAND_REGIONS[userSpec.region];
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === userSpec.orientation);
  const orientationDisplay = orientItem ? orientItem.label : userSpec.orientation;

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                  Donicowy Specjalista
                </h1>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Ogród w pojemnikach
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Ekspercki poradnik uprawy warzyw, owoców, ziół i kwiatów w donicach
              </p>
            </div>
          </div>

          {/* Current Balcony Specs Summary Badge & Edit Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <div
              id="balcony-summary-badge"
              onClick={onOpenSetup}
              title="Kliknij, aby zmienić specyfikację Twojego balkonu"
              className="flex items-center gap-2.5 px-3 py-1.5 bg-white rounded-xl border border-stone-200 shadow-2xs hover:border-emerald-700 hover:bg-stone-50/80 transition cursor-pointer text-xs text-stone-700"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold text-stone-900">
                  {regionInfo ? regionInfo.name.split('(')[0].trim() : 'Polska'}
                </span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-700" />
                <span>{userSpec.floor === 0 ? 'Parter' : `${userSpec.floor}. piętro`}</span>
              </div>
              <span className="text-stone-300">•</span>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>{orientationDisplay}</span>
              </div>
            </div>

            <button
              id="edit-balcony-settings-btn"
              onClick={onOpenSetup}
              className="p-2 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
              title="Zmień parametry balkonu"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Dostosuj balkon</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-stone-200/60 pt-2 pb-2 overflow-x-auto">
          <button
            id="tab-recommendations"
            onClick={() => onTabChange('recommendations')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'recommendations'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Rekomendacje (Co uprawiać)</span>
          </button>

          <button
            id="tab-calculator"
            onClick={() => onTabChange('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Ruler className="w-4 h-4" />
            <span>Kalkulator Donic & Szkic Rozstawy</span>
          </button>

          <button
            id="tab-calendar"
            onClick={() => onTabChange('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Interaktywny Kalendarz (24 okresy)</span>
          </button>

          <button
            id="tab-knowledge"
            onClick={() => onTabChange('knowledge')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'knowledge'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>ABC Uprawy w Donicach</span>
          </button>
        </div>
      </div>
    </header>
  );
};
