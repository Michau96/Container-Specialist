import React from 'react';
import {
  Layers,
  Droplets,
  Maximize2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Thermometer,
  Wind,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export const ContainerKnowledgeGuide: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  return (
    <div id="container-knowledge-guide" className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>{isEn ? 'Gardening Knowledge Compendium' : 'Kompendium wiedzy ogrodniczej'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
          {isEn ? 'Golden Rules of Balcony Container Gardening' : 'Złote Zasady Uprawy Warzyw w Donicach na Balkonie'}
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-3xl leading-relaxed">
          {isEn
            ? 'Container gardening is fundamentally different from in-ground cultivation. A pot is a miniature, closed ecosystem: soil heats up 3 times faster, nutrients leach out with each watering, and roots rely exclusively on your watering routine.'
            : 'Uprawa w pojemnikach diametralnie różni się od uprawy w gruncie. Donica to miniaturowy, zamknięty ekosystem: ziemia nagrzewa się 3 razy szybciej, składniki odżywcze ulegają wypłukiwaniu z podlewaniem, a korzenie nie mają skąd pobrać wilgoci poza Twoją konewką.'}
        </p>
      </div>

      {/* Grid of Knowledge Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Drenaż i Otwory */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                {isEn ? '1. Drainage & Holes – A Matter of Survival' : '1. Drenaż i odpływ – sprawa życia i śmierci'}
              </h3>
              <span className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold">
                {isEn ? 'No drainage = root rot' : 'Brak odpływu = gnicie korzeni'}
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {isEn
              ? 'The most common beginner mistake is planting in decorative pots without drainage holes. Water from irrigation or rain gathers at the bottom, cutting oxygen from roots. Within 48 hours, suffocation and root rot occur.'
              : 'Najczęstszy błąd początkujących to sadzenie warzyw w osłonkach bez dziur w dnie. Woda z podlewania lub ulewy gromadzi się na dnie, odcinając tlen od korzeni. W ciągu 48 godzin dochodzi do uduszenia i gnicia.'}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 text-xs space-y-1.5 text-stone-700 dark:text-stone-300">
            <div className="font-semibold text-stone-900 dark:text-stone-100">
              {isEn ? 'Drainage layer instructions:' : 'Instrukcja warstwy drenażowej:'}
            </div>
            <div>
              {isEn
                ? '• Drill at least 3-4 holes in the base of each pot (8-10 mm diameter).'
                : '• Wywierć min. 3-4 otwory w dnie każdej donicy (średnica 8-10 mm).'}
            </div>
            <div>
              {isEn
                ? '• Pour 3-5 cm of expanded clay pebbles (keramzyt) or broken terracotta pot shards onto the bottom.'
                : '• Wsyp 3-5 cm keramzytu ogrodniczego lub potłuczonych glinianych doniczek na dno.'}
            </div>
            <div>
              {isEn
                ? '• Place a piece of landscape fleece or mesh over the pebbles so soil doesn\'t clog drainage.'
                : '• Na keramzyt połóż kawałek agrowłókniny, by ziemia nie zamulała drenażu.'}
            </div>
          </div>
        </div>

        {/* Pillar 2: Materiał Donicy a Temperatura */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                {isEn ? '2. Pot Material: Plastic, Terracotta or Fabric?' : '2. Materiał donicy: Tworzywo, Terakota czy Geowłóknina?'}
              </h3>
              <span className="text-xs text-amber-800 dark:text-amber-400 font-semibold">
                {isEn ? 'Root temperature matters' : 'Temperatura korzeni ma znaczenie'}
              </span>
            </div>
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-300 space-y-2 leading-relaxed">
            <div>
              <strong className="text-stone-900 dark:text-stone-100">{isEn ? 'Plastic / Synthetic pots:' : 'Donice plastikowe/tworzywo:'}</strong>{' '}
              {isEn
                ? 'Retain moisture well, but black pots in southern sun heat up to 50°C and cook roots. Always pick light colors (white, sand, grey) or wrap dark pots with reed/wicker mats.'
                : 'Dobrze trzymają wilgoć, ale czarne donice na południowym słońcu nagrzewają się do 50°C i gotują korzenie. Zawsze wybieraj jasne (białe, szare, piaskowe) lub owiń ciemne matą wiklinową.'}
            </div>
            <div>
              <strong className="text-stone-900 dark:text-stone-100">{isEn ? 'Terracotta (unglazed clay):' : 'Terakota (gliniane nieszkliwione):'}</strong>{' '}
              {isEn
                ? 'Porous walls breathe and cool root balls via micro-evaporation. Downside: soil dries faster and needs more frequent watering.'
                : 'Ścianki oddychają i chłodzą bryłę korzeniową przez mikroodparowywanie. Minus: ziemia schnie szybciej, wymaga częstszego podlewania.'}
            </div>
            <div>
              <strong className="text-stone-900 dark:text-stone-100">{isEn ? 'Fabric Grow Bags (Smart Pots):' : 'Worki uprawowe (Smart Pots):'}</strong>{' '}
              {isEn
                ? 'Great option made of geotextile fabric. Provides natural air-pruning (roots don\'t circle the pot edges, but branch outward throughout the medium).'
                : 'Hitem są worki z grubej geowłókniny. Zapewniają tzw. \'air-pruning\' (korzenie nie krążą wokół ścianek, lecz rozkrzewiają się w głąb).'}
            </div>
          </div>
        </div>

        {/* Pillar 3: Ziemia i Podłoże */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950/60 flex items-center justify-center text-sky-800 dark:text-sky-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                {isEn ? '3. Substrate: Why NEVER Garden Topsoil?' : '3. Podłoże: Dlaczego NIE brać ziemi z ogródka?'}
              </h3>
              <span className="text-xs text-sky-800 dark:text-sky-400 font-semibold">
                {isEn ? 'Structure, perlite & water retention' : 'Struktura, perlit i retencja'}
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {isEn
              ? 'Soil dug up from gardens or plots compacts into an impermeable hard brick inside a pot after frequent watering, suffocating roots and carrying pathogens or nematodes.'
              : 'Ziemia wykopana z ogrodu lub działki w donicy pod wpływem częstego podlewania zbija się w nieprzepuszczalną \'skałę\' i cementuje korzenie, a do tego przenosi nicienie i patogeny grzybowe.'}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 text-xs space-y-1 text-stone-700 dark:text-stone-300">
            <div className="font-semibold text-stone-900 dark:text-stone-100">
              {isEn ? 'Recipe for ideal container potting mix:' : 'Przepis na idealną mieszankę do donic:'}
            </div>
            <div>
              {isEn
                ? '• 70% quality vegetable soil (de-acidified peat and humus based).'
                : '• 70% dobrej jakości ziemi do warzyw (na bazie torfu odkwaszonego i próchnicy).'}
            </div>
            <div>
              {isEn
                ? '• 20% perlite or vermiculite (light white granules that aerate and hold moisture).'
                : '• 20% perlitu lub wermikulitu (białe lekkie granulki spulchniające i magazynujące wodę).'}
            </div>
            <div>
              {isEn
                ? '• 10% well-aged compost or a handful of pelleted manure (slow-release food base).'
                : '• 10% dojrzałego kompostu lub garść obornika granulowanego (baza pokarmowa).'}
            </div>
            <div>
              {isEn
                ? '• For hot south-facing balconies: add 1 tsp of hydrogel per 10L pot.'
                : '• Na południowych balkonach: dodaj 1 łyżeczkę hydrożelu na donicę 10L.'}
            </div>
          </div>
        </div>

        {/* Pillar 4: Nawożenie i Pielęgnacja */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-800 dark:text-rose-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                {isEn ? '4. Fertilizing in Containers: Small Regular Doses' : '4. Nawożenie w pojemnikach: Zasada małych dawek'}
              </h3>
              <span className="text-xs text-rose-800 dark:text-rose-400 font-semibold">
                {isEn ? 'Nutrients wash out in 4-6 weeks' : 'Składniki wypłukują się po 4 tygodniach'}
              </span>
            </div>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            {isEn
              ? 'Even high-end potting soil with starter fertilizer becomes depleted after 4-6 weeks of frequent watering. From June onwards, fruiting vegetables (tomatoes, peppers, cucumbers) need regular nourishment.'
              : 'Nawet najdroższa ziemia \'z nawozem startowym\' po 4-6 tygodniach intensywnego podlewania zostaje wyjałowiona. Od czerwca rośliny owocujące (pomidory, papryki, ogórki) muszą być regularnie zasilane.'}
          </p>
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200/80 dark:border-stone-700/80 text-xs space-y-1 text-stone-700 dark:text-stone-300">
            <div className="font-semibold text-stone-900 dark:text-stone-100">
              {isEn ? 'What to feed balcony vegetables?' : 'Czym zasilać warzywa balkonowe?'}
            </div>
            <div>
              {isEn
                ? '• Liquid Biohumus (worm castings extract): 100% safe, organic, impossible to over-fertilize.'
                : '• Płynny biohumus: Całkowicie bezpieczny, naturalny wyciąg dżdżownic kalifornijskich, nie da się nim przenawozić.'}
            </div>
            <div>
              {isEn
                ? '• Nettle or horsetail fermented tea: Brilliant homemade nitrogen-silica booster (apply until end of June).'
                : '• Gnojówka z pokrzywy lub skrzypu: Genialny domowy nawóz azotowo-krzemowy (stosuj do końca czerwca).'}
            </div>
            <div>
              {isEn
                ? '• Potassium and phosphorus in July/August: Ensures sweet fruit flavor and protects against blossom end rot.'
                : '• Potas i fosfor w lipcu/sierpniu: Zapewnia słodki smak owoców i chroni przed suchą zgnilizną wierzchołkową.'}
            </div>
          </div>
        </div>
      </div>

      {/* Ekologiczna ochrona balkonu */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 text-lg mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
          <span>{isEn ? 'Organic Balcony SOS: Aphids, Spider Mites & Mildew' : 'Ekologiczne SOS na balkonie: Mszyce, Przędziorki i Mączniak'}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700 dark:text-stone-300">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
            <strong className="text-stone-900 dark:text-stone-100 block text-sm">
              {isEn ? 'Spider Mites (dry air)' : 'Przędziorki (suche powietrze)'}
            </strong>
            <p>
              {isEn
                ? 'Love hot, dry south balconies. Symptoms: fine webbing under leaves and yellow stippling. Solution: mist under leaves in the evening with lukewarm water; spray with garlic extract or neem/potassium soap.'
                : 'Uwielbiają gorące, suche balkony południowe. Objaw: drobna pajęczynka pod liśćmi i żółte kropki. Rozwiązanie: zraszaj liście od spodu wieczorem letnią wodą; zastosuj oprysk z oleju rycynowego lub wyciągu z czosnku.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
            <strong className="text-stone-900 dark:text-stone-100 block text-sm">
              {isEn ? 'Aphids on tender shoots' : 'Mszyce na młodych pędach'}
            </strong>
            <p>
              {isEn
                ? 'Black or green colonies sucking sap from growth tips. Solution: potassium soap spray (15g per 1L lukewarm water) with a few drops of canola oil.'
                : 'Czarne lub zielone kolonie wysysające soki ze stożków wzrostu. Rozwiązanie: roztwór szarego mydła potasowego (15g na 1L letniej wody) z dodatkiem kilku kropel oleju rzepakowego.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 space-y-1">
            <strong className="text-stone-900 dark:text-stone-100 block text-sm">
              {isEn ? 'Blight and Powdery Mildew' : 'Zaraza i mączniak (choroby grzybowe)'}
            </strong>
            <p>
              {isEn
                ? 'White powder coating or brown water-soaked spots. Golden rule of prevention: NEVER spray or water tomato/cucumber leaves. Watering solely at soil level reduces fungal risk by 90%.'
                : 'Biały nalot lub brązowe plamy. Złota zasada profilaktyki: NIGDY nie podlewaj liści pomidorów i ogórków. Lanie wody prosto w glebę redukuje ryzyko chorób grzybowych o 90%.'}
            </p>
          </div>
        </div>
      </div>

      {/* Źródła bibliograficzne */}
      <div className="bg-[#FAF8F5] dark:bg-stone-900/90 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
        <h4 className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
          {isEn ? 'Verified gardening sources integrated in this advisory engine:' : 'Zweryfikowane źródła ogrodnicze włączone do algorytmu poradnika:'}
        </h4>
        <p className="leading-relaxed text-stone-500 dark:text-stone-400">
          {isEn
            ? 'Knowledge base formulated based on multi-year horticultural guidelines and research from gardening literature: "Działkowiec" magazine (Container Garden & Balcony sections), PoradnikOgrodniczy.pl, Murator Dom & Ogród, and Polish agricultural advisory publications.'
            : 'Baza wiedzy powstała na podstawie wieloletnich zaleceń i badań publikowanych w polskich periodykach oraz portalach ogrodniczych: Miesięcznik Działkowiec (działy: \'Ogród w pojemnikach\', \'Balkon i taras\'), PoradnikOgrodniczy.pl, wydawnictwa Murator Dom & Ogród oraz materiały instruktażowe Zielonego Pogotowia.'}
        </p>
      </div>
    </div>
  );
};
