import React, { useState, useMemo } from 'react';
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

  if (!isOpen) return null;

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

  return (
    <div
      id="balcony-setup-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div
        id="balcony-setup-dialog"
        className="bg-[#FAF8F5] text-slate-800 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-emerald-900 text-stone-100 p-5 sm:p-6 flex items-start justify-between border-b border-emerald-950">
          <div>
            <div className="flex items-center gap-2 mb-1 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>{isFirstTime ? 'Krok 1 z 1: Twój balkon' : 'Konfiguracja stanowiska'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isFirstTime ? 'Witaj w Balkonowym Ogrodzie!' : 'Edycja parametrów Twojego balkonu'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
              Wybierz swoje województwo i dokładną wystawę balkonu. Dostosujemy kalendarz prac, odporność na wiatr i zapotrzebowanie na wodę.
            </p>
          </div>
          {onClose && !isFirstTime && (
            <button
              id="close-balcony-modal-btn"
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800 transition"
              aria-label="Zamknij"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-7">
          {/* 1. Region w Polsce / Województwo */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>1. W której części Polski / Województwo</span>
              </label>
              <span className="text-[11px] text-stone-500">
                Wpływa na daty przymrozków i długość sezonu
              </span>
            </div>

            {/* Szukajka i filtry makroregionów */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={regionSearch}
                  onChange={(e) => setRegionSearch(e.target.value)}
                  placeholder="Wpisz województwo lub miasto (np. Wrocław, Gdańsk, Kraków)..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-1.5 focus:ring-emerald-600"
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {(
                  [
                    { id: 'all', label: 'Wszystkie (16)' },
                    { id: 'Centrum', label: 'Centrum' },
                    { id: 'Południe', label: 'Południe' },
                    { id: 'Północ', label: 'Północ' },
                    { id: 'Zachód', label: 'Zachód' },
                    { id: 'Wschód', label: 'Wschód' },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMacroregion(m.id)}
                    className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition shrink-0 ${
                      selectedMacroregion === m.id
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Siatka 16 województw */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-0.5">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((regKey) => {
                  const reg = POLAND_REGIONS[regKey];
                  const isSelected = spec.region === regKey;
                  return (
                    <button
                      type="button"
                      key={regKey}
                      id={`region-${regKey}`}
                      onClick={() => setSpec({ ...spec, region: regKey })}
                      className={`text-left p-2.5 rounded-xl border text-xs transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50/90 text-emerald-950 font-semibold ring-1 ring-emerald-600/40 shadow-xs'
                          : 'border-stone-200 bg-stone-50/40 hover:bg-stone-100/70 text-stone-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold leading-tight text-xs text-stone-900">{reg.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mt-1">
                        <span>{reg.macroregion || 'Polska'}</span>
                        <span className="font-medium text-emerald-800">Strefa {reg.zone}</span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-4 text-center text-xs text-stone-500">
                  Brak województw pasujących do frazy &quot;{regionSearch}&quot;.
                </div>
              )}
            </div>

            {/* Szczegóły wybranego województwa */}
            {selectedRegionInfo && (
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Wybrane województwo: {selectedRegionInfo.name}</span>
                  </div>
                  <span className="text-[11px] font-medium bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-md">
                    {selectedRegionInfo.frost_shift_days === 0
                      ? 'Terminy bazowe (Centrum)'
                      : selectedRegionInfo.frost_shift_days < 0
                      ? `Sezon o ${Math.abs(selectedRegionInfo.frost_shift_days)} dni wcześniejszy`
                      : `Sezon o ${selectedRegionInfo.frost_shift_days} dni późniejszy`}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  {selectedRegionInfo.climate_notes}
                </p>
              </div>
            )}
          </div>

          {/* 2. Na którą stronę wychodzi balkon (Wszystkie opcje) */}
          <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <Compass className="w-4 h-4 text-amber-600" />
                <span>2. Na którą stronę wychodzi balkon? (Wszystkie opcje)</span>
              </label>
              <span className="text-[11px] text-stone-500">
                Kardynalne, narożne dwustronne i specjalne
              </span>
            </div>

            {/* Zakładki kategorii stron świata */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {(
                [
                  { id: 'all', label: 'Wszystkie (23 opcje)' },
                  { id: 'glowne', label: 'Główne (4)' },
                  { id: 'posrednie', label: 'Pośrednie (4)' },
                  { id: 'narozne_specjalne', label: 'Narożne & Specjalne (7)' },
                  { id: 'precyzyjne', label: 'Róża wiatrów (8)' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setOrientFilter(cat.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition shrink-0 ${
                    orientFilter === cat.id
                      ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
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
                    className={`p-2.5 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold ring-1.5 ring-amber-500/60 shadow-xs'
                        : 'border-stone-200 bg-stone-50/40 hover:bg-stone-100/70 text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-xs text-stone-900">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />}
                      </div>
                      <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-900 text-[10px] font-semibold mt-1">
                        <Sun className="w-3 h-3 text-amber-700" />
                        <span>{item.badge}</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1 leading-snug font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Szczegóły wybranej orientacji */}
            {selectedOrientInfo && (
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <ThermometerSun className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Wybrana wystawa: {selectedOrientInfo.label}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded">
                    {selectedOrientInfo.sunHours}
                  </span>
                </div>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  <strong className="font-semibold">Charakterystyka mikroklimatu:</strong> {selectedOrientInfo.thermal}.
                </p>
              </div>
            )}
          </div>

          {/* 3. Piętro i Wiatr */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <Building className="w-4 h-4 text-sky-700" />
              <span>3. Które to piętro? (Wpływ na siłę wiatru i wysychanie donic)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { floor: 0, label: 'Parter', desc: 'Wilgotniej, minimalny wiatr' },
                { floor: 2, label: '1 - 3 piętro', desc: 'Optymalne warunki balkonowe' },
                { floor: 5, label: '4 - 7 piętro', desc: 'Wyraźny wiatr, szybsze schnięcie' },
                { floor: 10, label: '8+ piętro', desc: 'Silne porywy, zalecane niskie odmiany' },
              ].map((item) => {
                const isSelected =
                  (item.floor === 0 && spec.floor === 0) ||
                  (item.floor === 2 && spec.floor >= 1 && spec.floor <= 3) ||
                  (item.floor === 5 && spec.floor >= 4 && spec.floor <= 7) ||
                  (item.floor === 10 && spec.floor >= 8);
                return (
                  <button
                    type="button"
                    key={item.floor}
                    id={`floor-btn-${item.floor}`}
                    onClick={() => setSpec({ ...spec, floor: item.floor })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      isSelected
                        ? 'border-sky-700 bg-sky-50 text-sky-950 font-semibold ring-1 ring-sky-500/40'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5 leading-tight">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Typ barierki & Zadaszenie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <Shield className="w-3.5 h-3.5 text-stone-600" />
                <span>Typ balustrady</span>
              </label>
              <select
                id="balcony-type-select"
                value={spec.balcony_type}
                onChange={(e) => setSpec({ ...spec, balcony_type: e.target.value as BalconyType })}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="open_rail">Ażurowa barierka metalowa (dużo światła u dołu)</option>
                <option value="solid_wall">Pełny mur / beton (cień przy podłodze, osłona od wiatru)</option>
                <option value="loggia">Loggia (boki zabudowane, ciepły mikroklimat)</option>
                <option value="french">Balkon francuski (tylko skrzynki zawieszane)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <Shield className="w-3.5 h-3.5 text-stone-600" />
                <span>Zadaszenie</span>
              </label>
              <select
                id="balcony-roofing-select"
                value={spec.roofing}
                onChange={(e) => setSpec({ ...spec, roofing: e.target.value as RoofingType })}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="uncovered">Niezadaszony (łapie deszcz, ryzyko ulew)</option>
                <option value="covered">Zadaszony (balkon powyżej / dach – 100% zależy od podlewania)</option>
              </select>
            </div>
          </div>

          {/* 5. Dostępne donice */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <Maximize2 className="w-4 h-4 text-emerald-800" />
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
                    className={`p-3 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50/70 text-emerald-950 font-medium'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-emerald-800 border-emerald-800 text-white' : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-stone-900">{item.label}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Czas na pielęgnację */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-900">
              <Clock className="w-4 h-4 text-stone-600" />
              <span>5. Ile masz czasu na doglądanie i podlewanie?</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
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
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5 leading-tight">{item.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3 sticky bottom-0 bg-[#FAF8F5]/95 backdrop-blur-xs py-2">
            {onClose && !isFirstTime && (
              <button
                type="button"
                id="cancel-setup-btn"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition"
              >
                Anuluj
              </button>
            )}
            <button
              type="submit"
              id="save-balcony-spec-btn"
              className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition flex items-center gap-2"
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

