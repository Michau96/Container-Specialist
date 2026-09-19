import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Compass,
  Building,
  MapPin,
  Maximize2,
  Shield,
  Clock,
  Check,
  X,
  Sparkles,
  Info,
  HelpCircle,
  Sun,
  Sunrise,
  Sunset,
  CloudSun,
  Search,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Umbrella,
  Wind,
} from 'lucide-react';
import {
  UserBalconySpec,
  UserAccount,
  PolandRegionKey,
  Orientation,
  BalconyType,
  RoofingType,
  ContainerType,
  CareTime,
} from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS, OrientationOption } from '../lib/api';

interface Props {
  isOpen: boolean;
  initialSpec: UserBalconySpec;
  onSave: (spec: UserBalconySpec) => void;
  onClose?: () => void;
  isFirstTime?: boolean;
  currentUser?: UserAccount | null;
  onOpenAuth?: () => void;
}

// Visual direction config with clear icons and titles
interface ExposureVisual {
  title: string;
  sub: string;
  icon: React.ReactNode;
  accentColor: string;
}

const EXPOSURE_VISUALS: Record<string, ExposureVisual> = {
  E: {
    title: 'Wschód',
    sub: 'Łagodne słońce o poranku',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  S: {
    title: 'Południe',
    sub: 'Pełne słońce przez cały dzień',
    icon: <Sun className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-500 dark:hover:border-amber-400',
  },
  W: {
    title: 'Zachód',
    sub: 'Ciepłe popołudnie i wieczór',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
  N: {
    title: 'Północ',
    sub: 'Kojący cień i chłód',
    icon: <CloudSun className="w-5 h-5 text-sky-500" />,
    accentColor: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  SE: {
    title: 'Południowy Wschód',
    sub: 'Poranek i południe bez upału',
    icon: <Sunrise className="w-5 h-5 text-amber-500" />,
    accentColor: 'hover:border-amber-400 dark:hover:border-amber-500',
  },
  SW: {
    title: 'Południowy Zachód',
    sub: 'Najcieplejsza, długa wystawa',
    icon: <Sunset className="w-5 h-5 text-orange-500" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
  NE: {
    title: 'Północny Wschód',
    sub: 'Poranny blask, potem cień',
    icon: <Sunrise className="w-5 h-5 text-sky-500" />,
    accentColor: 'hover:border-sky-400 dark:hover:border-sky-500',
  },
  NW: {
    title: 'Północny Zachód',
    sub: 'Cień w dzień, słońce pod wieczór',
    icon: <Sunset className="w-5 h-5 text-orange-400" />,
    accentColor: 'hover:border-orange-400 dark:hover:border-orange-500',
  },
};

export const BalconySetupModal: React.FC<Props> = ({
  isOpen,
  initialSpec,
  onSave,
  onClose,
  isFirstTime = false,
  currentUser = null,
  onOpenAuth,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [spec, setSpec] = useState<UserBalconySpec>(initialSpec);
  const [regionSearch, setRegionSearch] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [exposureFilter, setExposureFilter] = useState<'main' | 'all'>('main');

  useEffect(() => {
    if (isOpen) {
      setSpec(initialSpec);
      setStep(1);
      setActiveTooltip(null);
    }
  }, [isOpen, initialSpec]);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-tooltip-container]')) {
        setActiveTooltip(null);
      }
    };
    if (activeTooltip) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeTooltip]);

  const filteredRegions = useMemo(() => {
    const allKeys = Object.keys(POLAND_REGIONS) as PolandRegionKey[];
    return allKeys.filter((regKey) => {
      const reg = POLAND_REGIONS[regKey];
      return (
        reg.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        regKey.toLowerCase().includes(regionSearch.toLowerCase())
      );
    });
  }, [regionSearch]);

  const visibleOrientations = useMemo(() => {
    if (exposureFilter === 'main') {
      return ORIENTATION_OPTIONS.filter((o) => o.group === 'glowne' || o.group === 'posrednie');
    }
    return ORIENTATION_OPTIONS;
  }, [exposureFilter]);

  const togglePot = (pot: ContainerType) => {
    setSpec((prev) => {
      const exists = prev.pots.includes(pot);
      const nextPots = exists ? prev.pots.filter((p) => p !== pot) : [...prev.pots, pot];
      return { ...prev, pots: nextPots };
    });
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSave(spec);
  };

  if (!isOpen) return null;

  const currentRegion = POLAND_REGIONS[spec.region];
  const currentExposure = ORIENTATION_OPTIONS.find((o) => o.key === spec.orientation);

  return (
    <div
      id="balcony-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="balcony-setup-dialog"
        className="bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden transition-all"
      >
        {/* Top Header & Wizard Stepper */}
        <div className="bg-white dark:bg-stone-950 p-5 sm:p-6 border-b border-stone-200/80 dark:border-stone-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Kreator Twojego Balkonu</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                {step === 1 && 'Gdzie rośnie Twój ogród?'}
                {step === 2 && 'W którą stronę pada słońce?'}
                {step === 3 && 'Twoja przestrzeń i donice'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                {step === 1 && 'Dopasujemy rośliny do klimatu w Twojej okolicy i wysokości budynku.'}
                {step === 2 && 'Słońce to klucz do sukcesu – wskaż kierunek, a dobierzemy gatunki, które pokochają to światło.'}
                {step === 3 && 'Określ rodzaj donic i czas, jaki chcesz poświęcić na podlewanie.'}
              </p>
            </div>

            {onClose && !isFirstTime && (
              <button
                id="close-balcony-modal-btn"
                type="button"
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer shrink-0"
                aria-label="Zamknij"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Stepper Tabs */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { num: 1, label: 'Lokalizacja', icon: <MapPin className="w-3.5 h-3.5" /> },
              { num: 2, label: 'Ekspozycja', icon: <Sun className="w-3.5 h-3.5" /> },
              { num: 3, label: 'Donice i opieka', icon: <Maximize2 className="w-3.5 h-3.5" /> },
            ].map((s) => {
              const isActive = step === s.num;
              const isPast = step > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  id={`wizard-step-tab-${s.num}`}
                  onClick={() => setStep(s.num as 1 | 2 | 3)}
                  className={`flex items-center justify-center sm:justify-start gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                      : isPast
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-stone-100 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border-transparent hover:bg-stone-200/70 dark:hover:bg-stone-800'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive
                        ? 'bg-white text-emerald-800'
                        : isPast
                        ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100'
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3 stroke-[3]" /> : s.num}
                  </span>
                  <span className="hidden sm:inline truncate">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ================= STEP 1: LOKALIZACJA I PIĘTRO ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              {/* Region selection */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Wybierz swoje województwo lub najbliższe miasto</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Wybrano: <strong className="text-emerald-700 dark:text-emerald-400">{currentRegion?.name.split('(')[0].trim()}</strong>
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    id="region-search-input"
                    value={regionSearch}
                    onChange={(e) => setRegionSearch(e.target.value)}
                    placeholder="Wpisz np. Warszawa, Kraków, Wrocław, Gdańsk, Poznań..."
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-0.5 scrollbar-none">
                  {filteredRegions.map((regKey) => {
                    const reg = POLAND_REGIONS[regKey];
                    const isSelected = spec.region === regKey;
                    return (
                      <button
                        type="button"
                        key={regKey}
                        id={`region-${regKey}`}
                        onClick={() => setSpec({ ...spec, region: regKey })}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold ring-1.5 ring-emerald-500 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="truncate pr-2">{reg.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Piętro i siła wiatru */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Na którym piętrze znajduje się balkon?</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { floor: 0, label: 'Parter', hint: 'Osłonięty, wilgotniej' },
                    { floor: 2, label: 'Piętro 1 – 3', hint: 'Zrównoważone warunki' },
                    { floor: 5, label: 'Piętro 4 – 6', hint: 'Przewiewniej' },
                    { floor: 8, label: 'Piętro 7+', hint: 'Mocniejsze powiewy' },
                  ].map((item) => {
                    const isSelected =
                      (item.floor === 0 && spec.floor === 0) ||
                      (item.floor === 2 && spec.floor >= 1 && spec.floor <= 3) ||
                      (item.floor === 5 && spec.floor >= 4 && spec.floor <= 6) ||
                      (item.floor === 8 && spec.floor >= 7);
                    return (
                      <button
                        type="button"
                        key={item.floor}
                        id={`floor-btn-${item.floor}`}
                        onClick={() => setSpec({ ...spec, floor: item.floor })}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-1.5 ring-emerald-500 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="text-sm font-bold">{item.label}</span>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400">{item.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: EKSPOZYCJA (WIZUALNA SIATKA + TOOLTIPY) ================= */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              {/* Category Filter for Orientation */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kierunek świata</span>
                </span>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setExposureFilter('main')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      exposureFilter === 'main'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Główne (8)
                  </button>
                  <button
                    type="button"
                    onClick={() => setExposureFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      exposureFilter === 'all'
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    Wszystkie (23)
                  </button>
                </div>
              </div>

              {/* Visual Grid of Exposure Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                {visibleOrientations.map((item) => {
                  const isSelected = spec.orientation === item.key;
                  const visual = EXPOSURE_VISUALS[item.key] || {
                    title: item.label.split('(')[0].trim(),
                    sub: item.badge,
                    icon: <Sun className="w-5 h-5 text-amber-500" />,
                    accentColor: 'hover:border-amber-400',
                  };
                  const isTooltipOpen = activeTooltip === item.key;

                  return (
                    <div
                      key={item.key}
                      data-tooltip-container
                      id={`orient-card-${item.key}`}
                      onClick={() => setSpec({ ...spec, orientation: item.key })}
                      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500 shadow-sm'
                          : `border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800/80 ${visual.accentColor} text-stone-800 dark:text-stone-200 shadow-2xs`
                      }`}
                    >
                      {/* Card Top: Icon & Tooltip Trigger [i] */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-700/60 flex items-center justify-center shrink-0">
                          {visual.icon}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Tooltip trigger [?] button */}
                          <button
                            type="button"
                            id={`tooltip-trigger-${item.key}`}
                            title="Pokaż szczegółowy opis nasłonecznienia"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveTooltip(isTooltipOpen ? null : item.key);
                            }}
                            className={`p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/80 transition cursor-pointer ${
                              isTooltipOpen ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/50' : ''
                            }`}
                          >
                            <Info className="w-4 h-4" />
                          </button>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Title & Clean Badge (Zero wall of text!) */}
                      <div className="mt-3">
                        <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 leading-tight">
                          {visual.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 dark:text-stone-300">
                            ☀️ {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                          {visual.sub}
                        </p>
                      </div>

                      {/* Floating Sleek Tooltip for Deep Descriptions */}
                      {isTooltipOpen && (
                        <div
                          className="absolute z-30 left-2 right-2 bottom-full mb-2 p-3.5 rounded-xl bg-stone-900 text-white dark:bg-stone-950 dark:border dark:border-stone-700 text-xs shadow-xl animate-fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <strong className="font-bold text-emerald-300">{item.label}</strong>
                            <button
                              type="button"
                              onClick={() => setActiveTooltip(null)}
                              className="text-stone-400 hover:text-white"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-stone-300 text-[11px] leading-relaxed">
                            {item.desc}
                          </p>
                          <div className="mt-2 pt-1.5 border-t border-stone-800 text-[10px] text-stone-400">
                            🌡️ {item.thermal}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Selected exposure info bar */}
              {currentExposure && (
                <div className="p-3 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Wybrana ekspozycja: <strong className="font-bold text-stone-900 dark:text-stone-100">{currentExposure.label}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/60">
                    {currentExposure.sunHours}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3: DONICE I OPIEKA ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              {/* Balustrada i zadaszenie */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Typ balustrady i zadaszenie</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <span className="text-[11px] text-stone-500 font-medium">Barierka:</span>
                    <select
                      id="balcony-type-select"
                      value={spec.balcony_type}
                      onChange={(e) => setSpec({ ...spec, balcony_type: e.target.value as BalconyType })}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="open_rail">Ażurowa barierka (dużo światła na podłodze)</option>
                      <option value="solid_wall">Pełny mur / beton (ochrona od wiatru)</option>
                      <option value="loggia">Loggia (zabudowane boki, ciepły mikroklimat)</option>
                      <option value="french">Balkon francuski (tylko skrzynki wiszące)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-stone-500 font-medium">Zadaszenie:</span>
                    <select
                      id="balcony-roofing-select"
                      value={spec.roofing}
                      onChange={(e) => setSpec({ ...spec, roofing: e.target.value as RoofingType })}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="covered">Zadaszony (wymaga regularnego podlewania)</option>
                      <option value="uncovered">Niezadaszony (korzysta z naturalnego deszczu)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dostępne donice */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Jakie donice masz lub planujesz?</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      id: 'boxes_balcony_15cm',
                      label: 'Skrzynki balkonowe (głęb. 15 cm)',
                      sub: 'Sałaty, rzodkiewki, zioła, szczypiorek',
                    },
                    {
                      id: 'pots_medium_5_15',
                      label: 'Średnie donice (5 – 12 litrów)',
                      sub: 'Papryczki chili, truskawki, burak liściowy',
                    },
                    {
                      id: 'pots_large_15_30',
                      label: 'Duże donice / wiadra (15 – 30L)',
                      sub: 'Pomidory koktajlowe, ogórki krzaczaste',
                    },
                    {
                      id: 'grow_bags',
                      label: 'Worki z tkaniny uprawowej',
                      sub: 'Idealne napowietrzanie korzeni',
                    },
                  ].map((item) => {
                    const isSelected = spec.pots.includes(item.id as ContainerType);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`pot-type-${item.id}`}
                        onClick={() => togglePot(item.id as ContainerType)}
                        className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-medium'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-800'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-stone-900 dark:text-stone-100">{item.label}</div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Czas na podlewanie */}
              <div className="space-y-2.5 pt-2 border-t border-stone-200/80 dark:border-stone-800">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Ile masz czasu na podlewanie?</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Codziennie', sub: 'Mogę rano i wieczorem' },
                    { id: 'few_days', label: 'Co 2–3 dni', sub: 'Zrównoważona opieka' },
                    { id: 'weekends', label: 'Głównie weekendy', sub: 'Rośliny odporne na suszę' },
                  ].map((item) => {
                    const isSelected = spec.care_time === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        id={`care-time-${item.id}`}
                        onClick={() => setSpec({ ...spec, care_time: item.id as CareTime })}
                        className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-bold ring-1.5 ring-emerald-500 shadow-xs'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="font-bold">{item.label}</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= BOTTOM BAR WITH "ZAPISZ I PRZELICZ" ================= */}
        <div className="p-4 sm:p-5 bg-white dark:bg-stone-950 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {step > 1 ? (
              <button
                type="button"
                id="wizard-prev-step-btn"
                onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Wstecz</span>
              </button>
            ) : onClose && !isFirstTime ? (
              <button
                type="button"
                id="cancel-setup-btn"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Anuluj
              </button>
            ) : (
              <div className="text-xs text-stone-400 hidden sm:block">Krok {step} z 3</div>
            )}

            {step < 3 && (
              <button
                type="button"
                id="wizard-next-step-btn"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl border border-emerald-200 dark:border-emerald-800/80 transition flex items-center gap-1 cursor-pointer sm:hidden"
              >
                <span>Dalej</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {step < 3 && (
              <button
                type="button"
                id="wizard-next-step-desktop-btn"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="hidden sm:inline-flex px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl border border-emerald-200 dark:border-emerald-800/80 transition items-center gap-1.5 cursor-pointer"
              >
                <span>Dalej</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* The One Big, Clear "Zapisz i przelicz" Button */}
            <button
              type="button"
              id="save-balcony-spec-btn"
              onClick={() => handleSave()}
              className="flex-1 sm:flex-none px-7 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ring-1 ring-emerald-600"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Zapisz i przelicz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
