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

export const ContainerKnowledgeGuide: React.FC = () => {
  return (
    <div id="container-knowledge-guide" className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Kompendium wiedzy ogrodniczej</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
          Złote Zasady Uprawy Warzyw w Donicach na Balkonie
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Uprawa w pojemnikach diametralnie różni się od uprawy w gruncie. Donica to miniaturowy, zamknięty ekosystem: ziemia nagrzewa się 3 razy szybciej, składniki odżywcze ulegają wypłukiwaniu z podlewaniem, a korzenie nie mają skąd pobrać wilgoci poza Twoją konewką.
        </p>
      </div>

      {/* Grid of Knowledge Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Drenaż i Otwory */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                1. Drenaż i odpływ – sprawa życia i śmierci
              </h3>
              <span className="text-xs text-emerald-800 font-semibold">Brak odpływu = gnicie korzeni</span>
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Najczęstszy błąd początkujących to sadzenie warzyw w osłonkach bez dziur w dnie. Woda z podlewania lub ulewy gromadzi się na dnie, odcinając tlen od korzeni. W ciągu 48 godzin dochodzi do uduszenia i gnicia.
          </p>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1.5 text-stone-700">
            <div className="font-semibold text-stone-900">Instrukcja warstwy drenażowej:</div>
            <div>• Wywierć min. 3-4 otwory w dnie każdej donicy (średnica 8-10 mm).</div>
            <div>• Wsyp 3-5 cm <strong>keramzytu ogrodniczego</strong> lub potłuczonych glinianych doniczek na dno.</div>
            <div>• Na keramzyt połóż kawałek agrowłókniny, by ziemia nie zamulała drenażu.</div>
          </div>
        </div>

        {/* Pillar 2: Materiał Donicy a Temperatura */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                2. Materiał donicy: Tworzywo, Terakota czy Geowłóknina?
              </h3>
              <span className="text-xs text-amber-800 font-semibold">Temperatura korzeni ma znaczenie</span>
            </div>
          </div>
          <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
            <div>
              <strong>Donice plastikowe/tworzywo:</strong> Dobrze trzymają wilgoć, ale <em>czarne donice na południowym słońcu nagrzewają się do 50°C</em> i gotują korzenie. Zawsze wybieraj jasne (białe, szare, piaskowe) lub owiń ciemne matą wiklinową.
            </div>
            <div>
              <strong>Terakota (gliniane nieszkliwione):</strong> Ścianki oddychają i chłodzą bryłę korzeniową przez mikroodparowywanie. Minus: ziemia schnie szybciej, wymaga częstszego podlewania.
            </div>
            <div>
              <strong>Worki uprawowe (Smart Pots):</strong> Hitem są worki z grubej geowłókniny. Zapewniają tzw. 'air-pruning' (korzenie nie krążą wokół ścianek, lecz rozkrzewiają się w głąb).
            </div>
          </div>
        </div>

        {/* Pillar 3: Ziemia i Podłoże */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                3. Podłoże: Dlaczego NIE brać ziemi z ogródka?
              </h3>
              <span className="text-xs text-sky-800 font-semibold">Struktura, perlit i retencja</span>
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Ziemia wykopana z ogrodu lub działki w donicy pod wpływem częstego podlewania zbija się w nieprzepuszczalną 'skałę' i cementuje korzenie, a do tego przenosi nicienie i patogeny grzybowe.
          </p>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1 text-stone-700">
            <div className="font-semibold text-stone-900">Przepis na idealną mieszankę do donic:</div>
            <div>• <strong>70%</strong> dobrej jakości ziemi do warzyw (na bazie torfu odkwaszonego i próchnicy).</div>
            <div>• <strong>20% perlitu lub wermikulitu</strong> (białe lekkie granulki spulchniające i magazynujące wodę).</div>
            <div>• <strong>10%</strong> dojrzałego kompostu lub garść obornika granulowanego (baza pokarmowa).</div>
            <div>• Na południowych balkonach: dodaj 1 łyżeczkę <em>hydrożelu</em> na donicę 10L.</div>
          </div>
        </div>

        {/* Pillar 4: Nawożenie i Pielęgnacja */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                4. Nawożenie w pojemnikach: Zasada małych dawek
              </h3>
              <span className="text-xs text-rose-800 font-semibold">Składniki wypłukują się po 4 tygodniach</span>
            </div>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Nawet najdroższa ziemia 'z nawozem startowym' po 4-6 tygodniach intensywnego podlewania zostaje wyjałowiona. Od czerwca rośliny owocujące (pomidory, papryki, ogórki) muszą być regularnie zasilane.
          </p>
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs space-y-1 text-stone-700">
            <div className="font-semibold text-stone-900">Czym zasilać warzywa balkonowe?</div>
            <div>• <strong>Płynny biohumus:</strong> Całkowicie bezpieczny, naturalny wyciąg dżdżownic kalifornijskich, nie da się nim przenawozić.</div>
            <div>• <strong>Gnojówka z pokrzywy lub skrzypu:</strong> Genialny domowy nawóz azotowo-krzemowy (stosuj do końca czerwca).</div>
            <div>• <strong>Potas i fosfor w lipcu/sierpniu:</strong> Zapewnia słodki smak owoców i chroni przed suchą zgnilizną wierzchołkową.</div>
          </div>
        </div>
      </div>

      {/* Ekologiczna ochrona balkonu */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
        <h3 className="font-bold text-stone-900 text-lg mb-3 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-800" />
          <span>Ekologiczne SOS na balkonie: Mszyce, Przędziorki i Mączniak</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-700">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <strong className="text-stone-900 block text-sm">Przędziorki (suche powietrze)</strong>
            <p>
              Uwielbiają gorące, suche balkony południowe. Objaw: drobna pajęczynka pod liśćmi i żółte kropki. <strong>Rozwiązanie:</strong> zraszaj liście od spodu wieczorem letnią wodą; zastosuj oprysk z oleju rycynowego lub wyciągu z czosnku.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <strong className="text-stone-900 block text-sm">Mszyce na młodych pędach</strong>
            <p>
              Czarne lub zielone kolonie wysysające soki ze stożków wzrostu. <strong>Rozwiązanie:</strong> roztwór szarego mydła potasowego (15g na 1L letniej wody) z dodatkiem kilku kropel oleju rzepakowego.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
            <strong className="text-stone-900 block text-sm">Zaraza i mączniak (choroby grzybowe)</strong>
            <p>
              Biały nalot lub brązowe plamy. <strong>Złota zasada profilaktyki:</strong> NIGDY nie podlewaj liści pomidorów i ogórków. Lanie wody prosto w glebę redukuje ryzyko chorób grzybowych o 90%.
            </p>
          </div>
        </div>
      </div>

      {/* Źródła bibliograficzne */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-stone-200 text-xs text-stone-600">
        <h4 className="font-semibold text-stone-900 mb-1">
          Zweryfikowane źródła ogrodnicze włączone do algorytmu poradnika:
        </h4>
        <p className="leading-relaxed text-stone-500">
          Baza wiedzy powstała na podstawie wieloletnich zaleceń i badań publikowanych w polskich periodykach oraz portalach ogrodniczych: Miesięcznik <em>Działkowiec</em> (działy: 'Ogród w pojemnikach', 'Balkon i taras'), <em>PoradnikOgrodniczy.pl</em>, wydawnictwa <em>Murator Dom & Ogród</em> oraz materiały instruktażowe <em>Zielonego Pogotowia</em>.
        </p>
      </div>
    </div>
  );
};
