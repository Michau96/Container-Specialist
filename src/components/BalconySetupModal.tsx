import React, { useState, useMemo, useEffect } from 'react';
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
  Sun,
  Search,
  ThermometerSun,
} from 'lucide-react';
import { UserBalconySpec, PolandRegionKey, Orientation, BalconyType, RoofingType, ContainerType, CareTime } from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS, OrientationOption } from '../lib/api';

interface Props {
  isOpen: boolean;
  initialSpec: UserBalconySpec;
  onSave: (spec: UserBalconySpec) => void;
  onClose?: () => void;
  isFirstTime?: boolean;
}

type MacroregionFilter = 'all' | 'Centrum' | 'Południe' | 'Północ' | 'Zachód' | 'Wschód';
type OrientFilter = 'all' | 'glowne' | 'posrednie' | 'precyzyjne' | 'narozne_specjalne';

export const BalconySetupModal: React.FC<Props> = ({
  isOpen,
  initialSpec,
  onSave,
  onClose,
  isFirstTime = false,
}) => {
  const [spec, setSpec] = useState<UserBalconySpec>(initialSpec);
  const [regionSearch, setRegionSearch] = useState('');
  const [selectedMacroregion, setSelectedMacroregion] = useState<MacroregionFilter>('all');
  const [orientFilter, setOrientFilter] = useState<OrientFilter>('all');

  // Synchronizacja parametrów po ponownym otwarciu modala
  useEffect(() => {
    if (isOpen) {
      setSpec(initialSpec);
    }
  }, [isOpen, initialSpec]);

  // Filtrowanie województw
  const filteredRegions = useMemo(() => {
    const allKeys = Object.keys(POLAND_REGIONS) as PolandRegionKey[];
    return allKeys.filter((regKey) => {
      const reg = POLAND_REGIONS[regKey];
      const matchesSearch =
        reg.name.toLowerCase().includes(regionSearch.toLowerCase()) ||
        regKey.toLowerCase().includes(regionSearch.toLowerCase()) ||
        reg.climate_notes.toLowerCase().includes(regionSearch.toLowerCase());

      const matchesMacro =
        selectedMacroregion === 'all' ||
        (reg.macroregion && reg.macroregion.toLowerCase().includes(selectedMacroregion.toLowerCase()));

      return matchesSearch && matchesMacro;
    });
  }, [regionSearch, selectedMacroregion]);

  // Filtrowanie orientacji
  const filteredOrientations = useMemo(() => {
    if (orientFilter === 'all') return ORIENTATION_OPTIONS;
    return ORIENTATION_OPTIONS.filter((o) => o.group === orientFilter);
  }, [orientFilter]);

  const togglePot = (pot: ContainerType) => {
    setSpec((prev) => {
      const exists = prev.pots.includes(pot);
      const nextPots = exists ? prev.pots.filter((p) => p !== pot) : [...prev.pots, pot];
      return { ...prev, pots: nextPots };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(spec);
  };

  const selectedRegionInfo = POLAND_REGIONS[spec.region];
  const selectedOrientInfo = ORIENTATION_OPTIONS.find((o) => o.key === spec.orientation);

  // Hook rules: call all hooks unconditionally, only then check isOpen
  if (!isOpen) return null;

  return (
    <div
      id="balcony-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 dark:bg-black/70 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="balcony-setup-dialog"
        className="bg-[#FAF8F5] dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="bg-stone-900 dark:bg-stone-950 text-stone-100 p-5 sm:p-6 flex items-start justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 mb-1 text-stone-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isFirstTime ? 'Krok 1 z 1: Twój balkon' : 'Konfiguracja stanowiska'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isFirstTime ? 'Witaj w donicowym ogrodzie!' : 'Edycja parametrów Twojego balkonu'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
              Wybierz swoje województwo i dokładną wystawę balkonu. Dostosujemy kalendarz prac, odporność na wiatr i zapotrzebowanie na wodę.
            </p>
          </div>
          {onClose && !isFirstTime && (
            <button
              id="close-balcony-modal-btn"
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition cursor-pointer"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7">
          {/* 1. Region w Polsce / Województwo */}
          <div className="space-y-3 bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <MapPin className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                <span>1. W której części Polski / województwo</span>
              </label>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Wpływa na daty przymrozków i długość sezonu
              </span>
            </div>

            {/* Szukajka i filtry makroregionów */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="region-search-input"
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  placeholder="Filtruj np. Mazowieckie, Kraków, Wrocław, wybrzeże..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'Centrum', 'Południe', 'Północ', 'Zachód', 'Wschód'] as const).map((macro) => (
                  <button
                    key={macro}
                    type="button"
                    onClick={() => setSelectedMacroregion(macro)}
                    className={`px-2 py-1 text-[11px] rounded-lg font-medium transition whitespace-nowrap cursor-pointer ${
                      selectedMacroregion === macro
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-transparent dark:border-stone-700'
                    }`}
                  >
                    {macro === 'all' ? 'Wszystkie' : macro}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista kafelków województw */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-0.5">
              {filteredRegions.map((regKey) => {
                const reg = POLAND_REGIONS[regKey];
                const isSelected = spec.region === regKey;
                return (
                  <button
                    type="button"
                    key={regKey}
                    id={`region-${regKey}`}
                    onClick={() => setSpec({ ...spec, region: regKey })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-semibold ring-1.5 ring-stone-500/40 dark:ring-stone-400 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/80 hover:bg-stone-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{reg.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-stone-900 dark:text-stone-900 shrink-0 mt-0.5" />}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 flex items-center justify-between">
                      <span>Strefa {reg.zone}</span>
                      <span>{reg.macroregion}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Podsumowanie wybranego regionu */}
            {selectedRegionInfo && (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-stone-900 dark:text-stone-100">
                  <span>Wybrany region: {selectedRegionInfo.name}</span>
                  <span className="text-[11px] font-normal text-stone-600 dark:text-stone-300">
                    Strefa USDA: <strong>{selectedRegionInfo.zone}</strong> (korekta terminu: {selectedRegionInfo.frost_shift_days > 0 ? `+${selectedRegionInfo.frost_shift_days}` : selectedRegionInfo.frost_shift_days} dni)
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  {selectedRegionInfo.climate_notes}
                </p>
              </div>
            )}
          </div>

          {/* 2. Dokładna Orientacja / Wystawa */}
          <div className="space-y-3 bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Compass className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                <span>2. Ekspozycja i wystawa balkonu (dokładny kierunek świata)</span>
              </label>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Determinuje słońce i nagrzewanie
              </span>
            </div>

            {/* Filtr grup orientacji */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(
                [
                  { id: 'all', label: 'Wszystkie (23 układy)' },
                  { id: 'glowne', label: 'Główne (4)' },
                  { id: 'posrednie', label: 'Pośrednie (4)' },
                  { id: 'narozne_specjalne', label: 'Narożne i specjalne (7)' },
                  { id: 'precyzyjne', label: 'Róża wiatrów (8)' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setOrientFilter(cat.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition shrink-0 cursor-pointer ${
                    orientFilter === cat.id
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-2xs font-semibold'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-transparent dark:border-stone-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Siatka opcji orientacji */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto p-0.5">
              {filteredOrientations.map((item: OrientationOption) => {
                const isSelected = spec.orientation === item.key;
                return (
                  <button
                    type="button"
                    key={item.key}
                    id={`orient-${item.key}`}
                    onClick={() => setSpec({ ...spec, orientation: item.key })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-semibold ring-1.5 ring-stone-500/40 dark:ring-stone-400 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/40 dark:bg-stone-800/80 hover:bg-stone-100/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-stone-900 dark:text-stone-900 shrink-0 mt-0.5" />}
                      </div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-200/70 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-[10px] font-semibold mt-1">
                        <Sun className="w-3 h-3 text-amber-500" />
                        <span>{item.badge}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-1 leading-snug font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Szczegóły wybranej orientacji */}
            {selectedOrientInfo && (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                    <ThermometerSun className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Wybrana wystawa: {selectedOrientInfo.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 bg-stone-200/80 dark:bg-stone-700 px-2 py-0.5 rounded">
                    {selectedOrientInfo.sunHours}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                  <strong className="font-semibold">Charakterystyka mikroklimatu:</strong> {selectedOrientInfo.thermal}.
                </p>
              </div>
            )}
          </div>

          {/* 3. Piętro i wiatr */}
          <div className="space-y-2.5 bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
                <Building className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                <span>3. Które to piętro? (wpływ na siłę wiatru i wysychanie donic)</span>
              </label>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Ekspozycja wiatrowa
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                {
                  floor: 0,
                  label: 'Parter',
                  desc: 'Wilgotniej, minimalny wiatr',
                },
                {
                  floor: 2,
                  label: 'Niskie piętro (1-3)',
                  desc: 'Optymalne warunki balkonowe',
                },
                {
                  floor: 5,
                  label: 'Średnie piętro (4-6)',
                  desc: 'Wyraźny wiatr, szybsze schnięcie',
                },
                {
                  floor: 8,
                  label: 'Wysokie piętro (7+)',
                  desc: 'Silne porywy, zalecane niskie odmiany',
                },
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
                    className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-semibold ring-1.5 ring-stone-500/40 dark:ring-stone-400 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-stone-100/70 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-stone-900 dark:text-stone-100">
                        {item.label}
                      </div>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Typ barierki i zadaszenie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Typ balustrady</span>
              </label>
              <select
                id="balcony-type-select"
                value={spec.balcony_type}
                onChange={(e) => setSpec({ ...spec, balcony_type: e.target.value as BalconyType })}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="open_rail">Ażurowa barierka metalowa (dużo światła u dołu)</option>
                <option value="solid_wall">Pełny mur / beton (cień przy podłodze, osłona od wiatru)</option>
                <option value="loggia">Loggia (boki zabudowane, ciepły mikroklimat)</option>
                <option value="french">Balkon francuski (tylko skrzynki zawieszane)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
                <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Zadaszenie</span>
              </label>
              <select
                id="balcony-roofing-select"
                value={spec.roofing}
                onChange={(e) => setSpec({ ...spec, roofing: e.target.value as RoofingType })}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-500"
              >
                <option value="uncovered">Niezadaszony (łapie deszcz, ryzyko ulew)</option>
                <option value="covered">Zadaszony (balkon powyżej / dach – 100% zależy od podlewania)</option>
              </select>
            </div>
          </div>

          {/* 5. Dostępne donice */}
          <div className="space-y-2 bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
              <Maximize2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
              <span>4. Jakie donice i pojemniki posiadasz lub planujesz kupić?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  id: 'boxes_balcony_15cm',
                  label: 'Korytka / skrzynki balkonowe (głęb. 15 cm)',
                  desc: 'Idealne pod rzodkiewkę, sałaty, rukolę, szpinak i szczypiorek',
                },
                {
                  id: 'pots_medium_5_15',
                  label: 'Średnie donice (5 - 12 litrów)',
                  desc: 'Papryczki chili, zioła, truskawki, burak liściowy, miniaturowa marchew',
                },
                {
                  id: 'pots_large_15_30',
                  label: 'Duże donice / wiadra (15 - 30+ litrów)',
                  desc: 'Niezbędne pod pomidory koktajlowe, ogórki krzaczaste i cukinię',
                },
                {
                  id: 'grow_bags',
                  label: 'Worki uprawowe z geowłókniny',
                  desc: 'Świetne napowietrzanie korzeni i ochrona przed przegrzaniem na południu',
                },
              ].map((item) => {
                const isSelected = spec.pots.includes(item.id as ContainerType);
                return (
                  <button
                    type="button"
                    key={item.id}
                    id={`pot-type-${item.id}`}
                    onClick={() => togglePot(item.id as ContainerType)}
                    className={`p-3 rounded-xl border text-left text-xs transition flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-medium'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-stone-900 dark:bg-stone-300 border-stone-900 dark:border-stone-300 text-white dark:text-stone-900' : 'border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-stone-900 dark:text-stone-100">{item.label}</div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Czas na pielęgnację */}
          <div className="space-y-2 bg-white dark:bg-stone-900/50 p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-2xs">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-stone-100">
              <Clock className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              <span>5. Ile masz czasu na doglądanie i podlewanie?</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'daily', label: 'Codziennie', sub: 'Mogę podlewać rano i wieczorem' },
                { id: 'few_days', label: 'Co 2-3 dni', sub: 'Standardowa opieka w tygodniu' },
                { id: 'weekends', label: 'Głównie weekendy', sub: 'Potrzebuję roślin odpornych na suszę' },
              ].map((item) => {
                const isSelected = spec.care_time === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    id={`care-time-${item.id}`}
                    onClick={() => setSpec({ ...spec, care_time: item.id as CareTime })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? 'border-stone-900 dark:border-stone-300 bg-stone-100 dark:bg-stone-200 text-stone-900 dark:text-stone-900 font-semibold'
                        : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-tight">{item.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3 sticky bottom-0 bg-[#FAF8F5]/95 dark:bg-stone-900/95 backdrop-blur-xs py-2">
            {onClose && !isFirstTime && (
              <button
                type="button"
                id="cancel-setup-btn"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              >
                Anuluj
              </button>
            )}
            <button
              type="submit"
              id="save-balcony-spec-btn"
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs sm:text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isFirstTime ? 'Rozpocznij uprawę w donicach' : 'Zastosuj i przelicz rekomendacje'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
