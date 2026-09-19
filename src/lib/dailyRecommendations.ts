import {
  WeatherData,
  UserBalconySpec,
  Plant,
  MyCropItem,
  DailyCropsRecommendation,
} from '../types';
import { getCropTimelineInfo } from './cropGrowthPhases';

export function computeDailyRecommendation(
  weather: WeatherData | null,
  userSpec: UserBalconySpec,
  userPlants: Plant[],
  userCrops: MyCropItem[] = []
): DailyCropsRecommendation {
  const temp = weather?.temperature ?? 19;
  const precip = weather?.precipitation ?? 0;
  const wind = weather?.balcony_advice?.adjusted_wind_at_floor ?? (weather?.wind_speed ?? 12);
  const humidity = weather?.humidity ?? 60;
  const isUncovered = userSpec.roofing === 'uncovered';
  const isCovered = userSpec.roofing === 'covered';
  const isHighFloor = userSpec.floor >= 4;
  const isSunnyOrientation = ['S', 'SW', 'SE', 'W', 'S_W', 'S_E', 'DACH'].includes(userSpec.orientation);

  // Compute timeline data for user's crops
  const cropTimelineMap = new Map<string, ReturnType<typeof getCropTimelineInfo>>();
  userPlants.forEach((p) => {
    const crop = userCrops.find((c) => c.plantId === p.id);
    if (crop) {
      cropTimelineMap.set(p.id, getCropTimelineInfo(p, crop));
    }
  });

  // Check pot traits
  const cropsWithoutDrainage = userCrops.filter((c) => c.pot && c.pot.hasDrainage === false);
  const cropsInSmallPots = userPlants.filter((p) => {
    const crop = userCrops.find((c) => c.plantId === p.id);
    return crop?.pot?.volumeL && crop.pot.volumeL < p.pot.min_volume_l * 0.8;
  });
  const cropsInTerracotta = userCrops.filter((c) => c.pot?.material === 'ceramika_terakota');

  // Check growth phases
  const cropsInGermination = userPlants.filter((p) => {
    const info = cropTimelineMap.get(p.id);
    return info?.currentPhase.id === 'kielkowanie' || info?.currentPhase.id === 'szok_indukcyjny';
  });
  const cropsInFlowering = userPlants.filter((p) => {
    const info = cropTimelineMap.get(p.id);
    return info?.currentPhase.name.toLowerCase().includes('kwitn');
  });
  const cropsInFruiting = userPlants.filter((p) => {
    const info = cropTimelineMap.get(p.id);
    return (
      info?.currentPhase.name.toLowerCase().includes('owoc') ||
      info?.currentPhase.name.toLowerCase().includes('dojrzew')
    );
  });

  // 1. Podlewanie (Watering)
  let waterIsGoodDay = true;
  let waterStatus: 'obfite' | 'umiarkowane' | 'wstrzymaj' | 'sprawdz' = 'umiarkowane';
  let waterTitle = 'Standardowe podlanie – sprawdź wilgotność ziemi';
  let waterAdvice =
    'Przed podlaniem zrób "test palca": wsuń palec na 2-3 cm w podłoże. Podlewaj tylko wtedy, gdy ziemia na tej głębokości jest sucha.';
  const waterSpecifics: string[] = [];

  if (precip > 1.5 && isUncovered) {
    waterIsGoodDay = false;
    waterStatus = 'wstrzymaj';
    waterTitle = 'Wstrzymaj się z podlewaniem (deszcz nawodnił donice)';
    waterAdvice =
      'Opad deszczu dostarczył wilgoci do otwartych skrzynek. Pamiętaj, aby wylać nadmiar wody z podstawek, by zapobiec uduszeniu korzeni.';
    waterSpecifics.push('Sprawdź podstawki pod donicami i opróżnij stojącą wodę.');
  } else if (temp >= 26 && isSunnyOrientation) {
    waterIsGoodDay = true;
    waterStatus = 'obfite';
    waterTitle = 'Wysokie zapotrzebowanie na wodę (podlej obficie!)';
    waterAdvice =
      'Słońce i temperatura mocno nagrzewają pojemniki. Podlej rośliny obficie wczesnym rankiem (przed 8:00) lub wieczorem po zachodzie słońca.';
    waterSpecifics.push('Kieruj strumień wody prosto do ziemi – NIE mocz liści pomidorów i papryk!');
    if (isHighFloor) {
      waterSpecifics.push(`Wiatr na ${userSpec.floor}. piętrze przyspiesza wysychanie wierzchniej warstwy podłoża.`);
    }
  } else if (temp <= 11) {
    waterIsGoodDay = false;
    waterStatus = 'wstrzymaj';
    waterTitle = 'Podlewaj bardzo oszczędnie (chłodny dzień)';
    waterAdvice =
      'Niska temperatura spowalnia transpirację roślin. Mokre, zimne podłoże sprzyja chorobom odglebowym i gniciu korzeni.';
    waterSpecifics.push('Podlewaj letnią wodą (nie z lodowatego kranu) tylko jeśli gleba jest zupełnie sucha.');
  } else {
    waterIsGoodDay = true;
    waterStatus = 'umiarkowane';
    waterTitle = 'Umiarkowane podlanie po sprawdzeniu wilgotności';
    waterAdvice =
      'Umiarkowane warunki atmosferyczne sprzyjają stabilnemu wzrostowi. Utrzymuj podłoże lekko wilgotne, ale nie podmokłe.';
    if (isCovered && precip > 0) {
      waterSpecifics.push('Twój balkon jest zadaszony: deszcz nie dociera do donic, więc konieczne jest podlanie ręczne!');
    }
  }

  // Inject pot & sowing specific watering nuances
  if (cropsWithoutDrainage.length > 0) {
    waterSpecifics.push(
      `🚨 Uwaga: Posiadasz donice bez odpływu wody! Podlewaj je minimalną porcją, by woda nie stała na dnie.`
    );
  }
  if (cropsInSmallPots.length > 0 && temp >= 20) {
    const names = cropsInSmallPots.map((p) => p.name).join(', ');
    waterSpecifics.push(
      `🪴 Zbyt małe donice (${names}): Mała objętość podłoża przesycha 2x szybciej w słońcu. Sprawdź wilgotność dwa razy dziennie!`
    );
  }
  if (cropsInTerracotta.length > 0 && temp >= 22) {
    waterSpecifics.push(
      `🏺 Donice z terakoty/ceramiki parują całą powierzchnią ścianek – nawadniaj je nieco obficiej niż plastikowe.`
    );
  }
  if (cropsInGermination.length > 0) {
    const names = cropsInGermination.map((p) => p.name).join(', ');
    waterSpecifics.push(
      `🌱 Wschody i kiełkowanie (${names}): Podlewaj wyłącznie drobną mgiełką ze zraszacza, by nie wypłukać nasion z podłoża.`
    );
  }

  // 2. Nawożenie (Fertilizing)
  let fertIsGoodDay = true;
  let fertStatus: 'zalecane' | 'odradzane' | 'umiarkowane' = 'zalecane';
  let fertTitle = 'Dobry dzień na zasilenie upraw biohumusem lub nawozem';
  let fertAdvice =
    'Optymalne temperatury sprzyjają pobieraniu makro- i mikroelementów przez system korzeniowy w donicach.';
  let dosageTip = 'Pamiętaj: Zawsze nanoś nawóz na lekko wilgotne podłoże (nigdy na suchą bryłę korzeniową!).';

  if (temp >= 28) {
    fertIsGoodDay = false;
    fertStatus = 'odradzane';
    fertTitle = 'Odradzane dzisiaj (upał grozi poparzeniem korzeni)';
    fertAdvice =
      'Przy temperaturze powyżej 28°C stężenie soli nawozowych w małej objętości donicy gwałtownie wzrasta, co prowadzi do tzw. suszy fizjologicznej i uszkodzenia włośników korzeniowych.';
    dosageTip = 'Przełóż nawożenie na chłodniejszy dzień lub wykonaj je późnym wieczorem po solidnym podlaniu.';
  } else if (temp < 12) {
    fertIsGoodDay = false;
    fertStatus = 'odradzane';
    fertTitle = 'Pomiń zasilanie (spowolniony metabolizm)';
    fertAdvice = 'W niskich temperaturach korzenie nie pobierają efektywnie fosforu i potasu.';
    dosageTip = 'Wstrzymaj się do czasu ocieplenia.';
  } else {
    if (cropsInFlowering.length > 0 || cropsInFruiting.length > 0) {
      const activePlants = [...cropsInFlowering, ...cropsInFruiting];
      const names = Array.from(new Set(activePlants.map((p) => p.name))).join(', ');
      fertTitle = 'Czas na nawóz z potasem i wapniem (kwitnienie i owoce)';
      fertAdvice = `Twoje uprawy (${names}) weszły w fazę kwitnienia lub owocowania. Zwiększ dawkę potasu (K) i fosforu (P), a ogranicz azot (N), by roślina nie szła tylko w zielone liście.`;
      dosageTip = 'Stosuj płynny nawóz pomidorowo-potasowy co 7 dni lub gnojówkę ze skrzypu/żywokostu.';
    } else if (cropsInGermination.length > 0 && userPlants.length === cropsInGermination.length) {
      fertTitle = 'Wstrzymaj nawożenie (faza kiełkowania nasion)';
      fertAdvice =
        'Młode siewki czerpią pokarm z nasiona. Nawozy mineralne na tym etapie poparzyłyby delikatne korzonki zarodkowe.';
      dosageTip = 'Zacznij delikatne zasilanie biohumusem dopiero 10–14 dni po pikowaniu.';
    } else {
      const hasHerbs = userPlants.some((p) => p.plant_group === 'ziola');
      if (hasHerbs) {
        fertTitle = 'Delikatne zasilanie biohumusem (zioła)';
        fertAdvice =
          'Zioła preferują lekkie nawożenie organiczne. Nadmiar azotu osłabia aromat olejków eterycznych w liściach.';
        dosageTip = 'Podlej zioła rozcieńczonym biohumusem w dawce 1/2 zalecanej przez producenta.';
      }
    }
  }

  // 3. Przycinanie i pielęgnacja pędów (Pruning)
  const plantTasks: { plantName: string; task: string; icon: string }[] = [];

  userPlants.forEach((plant) => {
    const timeline = cropTimelineMap.get(plant.id);
    const phaseId = timeline?.currentPhase.id || '';

    if (plant.id === 'pomidor-karlowy' || plant.name.toLowerCase().includes('pomidor')) {
      if (phaseId === 'kielkowanie') {
        plantTasks.push({
          plantName: plant.name,
          task: 'Zdejmij osłonkę foliową gdy siewki wzejdą i obracaj doniczkę w stronę światła, by siewki nie wybiegały.',
          icon: '🌱',
        });
      } else if (phaseId.includes('liscie')) {
        plantTasks.push({
          plantName: plant.name,
          task: 'Przepikuj siewki do osobnych doniczek zagłębiając je po same liścienie – wypuszczą dodatkowe korzenie.',
          icon: '🌿',
        });
      } else {
        plantTasks.push({
          plantName: plant.name,
          task: 'Usuń "wilki" (pędy boczne w pachwinach liści) oraz dolne liście dotykające podłoża, by poprawić cyrkulację powietrza.',
          icon: '🍅',
        });
      }
    } else if (plant.id === 'bazylia-pospolita' || plant.name.toLowerCase().includes('bazylia')) {
      plantTasks.push({
        plantName: plant.name,
        task: 'Uszczknij wierzchołki pędów nad drugą lub trzecią parą liści – pobudzi to krzewienie w gęstą kępę i wytnij pąki kwiatowe!',
        icon: '🌿',
      });
    } else if (plant.id === 'papryka-chili' || plant.name.toLowerCase().includes('papryka')) {
      plantTasks.push({
        plantName: plant.name,
        task: 'Skontroluj pierwsze rozwidlenie łodygi: uszczknij tzw. pąk królewski, by roślina zbudowała mocniejszy krzew z masą kwiatów.',
        icon: '🌶️',
      });
    } else if (
      plant.id === 'truskawka-zwisajaca' ||
      plant.name.toLowerCase().includes('truskawk') ||
      plant.name.toLowerCase().includes('poziomk')
    ) {
      plantTasks.push({
        plantName: plant.name,
        task: 'Wytnij nożyczkami wyrastające rozłogi (wąsy), które niepotrzebnie odbierają roślinie energię do owocowania.',
        icon: '🍓',
      });
    } else if (plant.id === 'mieta-pieprzowa' || plant.name.toLowerCase().includes('mięt')) {
      plantTasks.push({
        plantName: plant.name,
        task: 'Ścinaj regularnie górną 1/3 pędów do naparów – zapobiegnie to ogałacaniu się pędów u dołu.',
        icon: '🍃',
      });
    }
  });

  if (plantTasks.length === 0) {
    plantTasks.push({
      plantName: 'Wszystkie Twoje rośliny',
      task: 'Przejrzyj donice: usuń zaschnięte, pożółkłe listki i przekwitłe kwiaty, by nie stanowiły pożywki dla szarej pleśni.',
      icon: '✂️',
    });
  }

  const pruningAdvice: import('../types').DailyPruningAdvice = {
    title: 'Zabiegi formujące i higiena roślin w donicach',
    advice:
      'Regularne uszczykiwanie i usuwanie chorych części to podstawa zdrowego mikroklimatu na małej przestrzeni balkonu.',
    plantTasks,
  };

  // 4. Opryski i ochrona biologiczna (Spraying)
  let sprayIsGoodDay = true;
  let sprayStatus: 'dobry_dzien' | 'zly_dzien' | 'wstrzymaj' = 'dobry_dzien';
  let sprayTitle = 'Sprzyjające warunki do profilaktycznego oprysku eko';
  let sprayAdvice =
    'Brak deszczu i umiarkowana temperatura to doskonały moment na wieczorny oprysk ekologiczny wzmacniający odporność liści.';
  let recommendedOrganicSolution =
    'Ekologiczny wyciąg ze skrzypu polnego (krzemionka wzmacnia skórkę liści przed mączniakiem i zarazą) lub roztwór sody z mydłem potasowym.';

  if (precip > 0.5) {
    sprayIsGoodDay = false;
    sprayStatus = 'zly_dzien';
    sprayTitle = 'Zły dzień na oprysk (opady zmyją preparat)';
    sprayAdvice =
      'Deszcz natychmiast zmyje substancję czynną z powierzchni liści, czyniąc zabieg nieskutecznym.';
    recommendedOrganicSolution = undefined;
  } else if (wind > 18) {
    sprayIsGoodDay = false;
    sprayStatus = 'wstrzymaj';
    sprayTitle = `Zbyt silny wiatr na ${userSpec.floor}. piętrze (${Math.round(wind)} km/h)`;
    sprayAdvice =
      'Silne podmuchy wiatru znoszą mgiełkę oprysku poza donice (ryzyko zabrudzenia elewacji lub balkonu sąsiada). Poczekaj na bezwietrzny wieczór.';
    recommendedOrganicSolution = undefined;
  } else if (temp >= 27) {
    sprayIsGoodDay = false;
    sprayStatus = 'wstrzymaj';
    sprayTitle = 'Wstrzymaj się w ciągu dnia (ryzyko poparzenia liści)';
    sprayAdvice =
      'Oprysk wykonany w pełnym słońcu działa jak soczewka i powoduje martwice tkanek liścia. Wykonaj zabieg wyłącznie po zachodzie słońca (po godz. 19:30).';
    recommendedOrganicSolution =
      'Wieczorny oprysk roztworem szarego mydła potasowego (10ml/1L letniej wody) przeciw mszycom i przędziorkom.';
  }

  // 5. Specjalne alerty balkonowe
  const specialAlerts: string[] = [];

  if (wind >= 22) {
    specialAlerts.push(
      `⚠️ Porywisty wiatr (${Math.round(wind)} km/h): Dosuń wysokie donice (pomidory, papryki na palikach) do ściany nośnej budynku i sprawdź mocowanie skrzynek na barierce!`
    );
  }

  if (temp < 4) {
    specialAlerts.push(
      '❄️ Ryzyko przymrozku przy gruncie: Ciepłolubne sadzonki (bazylia, pomidor, papryka) przenieś na noc do mieszkania lub okryj białą agrowłókniną P-17.'
    );
  }

  if (temp >= 31) {
    specialAlerts.push(
      '☀️ Ekstremalny upał na balkonie: Ciemne plastikowe donice mogą nagrzać się do ponad 45°C. Owiń je jasną jutą lub osłoń tekturą, by nie ugotować korzeni.'
    );
  }

  // 5. Ostrzeżenia i mikroklimat szklarni balkonowej
  const cropsInGreenhouse = userCrops.filter((c) => c.inGreenhouse === true);
  if (cropsInGreenhouse.length > 0) {
    if (temp >= 19 && precip < 1) {
      specialAlerts.push(
        `🏡 Wietrzenie szklarni balkonowej: Masz ${cropsInGreenhouse.length} ${
          cropsInGreenhouse.length === 1 ? 'uprawę' : 'uprawy'
        } w szklarni/folii. Przy temperaturze ${Math.round(
          temp
        )}°C i słońcu koniecznie rozsuń zamek lub uchyl klapę, aby wewnątrz nie przekroczyć 32°C.`
      );
    } else if (temp <= 6) {
      specialAlerts.push(
        `🛡️ Ochrona w szklarni: Twoje uprawy w szklarni balkonowej (${cropsInGreenhouse.length}) zyskują cenne +3°C do +5°C buforu termicznego. Zasuń szczelnie folię przed zachodem słońca.`
      );
    } else if (precip > 1.5) {
      specialAlerts.push(
        `🌧️ Donice w szklarni (${cropsInGreenhouse.length}): Mimo opadów na zewnątrz deszcz nie dociera pod folię. Pamiętaj o manualnym podlaniu ziemi w szklarence.`
      );
    }
  }

  return {
    watering: {
      isGoodDay: waterIsGoodDay,
      status: waterStatus,
      title: waterTitle,
      advice: waterAdvice,
      specifics: waterSpecifics,
    },
    fertilizing: {
      isGoodDay: fertIsGoodDay,
      status: fertStatus,
      title: fertTitle,
      advice: fertAdvice,
      dosageTip,
    },
    pruning: pruningAdvice,
    spraying: {
      isGoodDay: sprayIsGoodDay,
      status: sprayStatus,
      title: sprayTitle,
      advice: sprayAdvice,
      recommendedOrganicSolution,
    },
    specialAlerts,
    lastUpdated: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
  };
}
