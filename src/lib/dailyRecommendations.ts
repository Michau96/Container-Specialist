import {
  WeatherData,
  UserBalconySpec,
  Plant,
  MyCropItem,
  DailyCropsRecommendation,
  Language,
} from '../types';
import { getCropTimelineInfo } from './cropGrowthPhases';
import { isWateringSuspended } from './rescueData';
import { getPlantName } from './plantTranslations';

export function computeDailyRecommendation(
  weather: WeatherData | null,
  userSpec: UserBalconySpec,
  userPlants: Plant[],
  userCrops: MyCropItem[] = [],
  language: Language = 'pl'
): DailyCropsRecommendation {
  const isEn = language === 'en';
  const temp = weather?.temperature ?? 19;
  const precip = weather?.precipitation ?? 0;
  const wind = weather?.balcony_advice?.adjusted_wind_at_floor ?? (weather?.wind_speed ?? 12);
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
  let waterTitle = isEn
    ? 'Standard watering – check soil moisture'
    : 'Standardowe podlanie – sprawdź wilgotność ziemi';
  let waterAdvice = isEn
    ? 'Before watering, do the "finger test": insert your finger 2–3 cm into the soil. Water only if the substrate feels dry at this depth.'
    : 'Przed podlaniem zrób "test palca": wsuń palec na 2-3 cm w podłoże. Podlewaj tylko wtedy, gdy ziemia na tej głębokości jest sucha.';
  const waterSpecifics: string[] = [];

  if (precip > 1.5 && isUncovered) {
    waterIsGoodDay = false;
    waterStatus = 'wstrzymaj';
    waterTitle = isEn
      ? 'Hold off on watering (rain hydrated the planters)'
      : 'Wstrzymaj się z podlewaniem (deszcz nawodnił donice)';
    waterAdvice = isEn
      ? 'Rainfall delivered sufficient moisture to uncovered boxes. Remember to drain excess water from saucers to prevent root rot.'
      : 'Opad deszczu dostarczył wilgoci do otwartych skrzynek. Pamiętaj, aby wylać nadmiar wody z podstawek, by zapobiec uduszeniu korzeni.';
    waterSpecifics.push(
      isEn
        ? 'Check drainage saucers under planters and empty standing water.'
        : 'Sprawdź podstawki pod donicami i opróżnij stojącą wodę.'
    );
  } else if (temp >= 26 && isSunnyOrientation) {
    waterIsGoodDay = true;
    waterStatus = 'obfite';
    waterTitle = isEn
      ? 'High water demand (water thoroughly!)'
      : 'Wysokie zapotrzebowanie na wodę (podlej obficie!)';
    waterAdvice = isEn
      ? 'Intense sun and high temperature heat up balcony containers. Water plants generously in early morning (before 8:00 AM) or after sunset.'
      : 'Słońce i temperatura mocno nagrzewają pojemniki. Podlej rośliny obficie wczesnym rankiem (przed 8:00) lub wieczorem po zachodzie słońca.';
    waterSpecifics.push(
      isEn
        ? 'Direct the water flow straight to the root base – do NOT wet tomato and pepper foliage!'
        : 'Kieruj strumień wody prosto do ziemi – NIE mocz liści pomidorów i papryk!'
    );
    if (isHighFloor) {
      waterSpecifics.push(
        isEn
          ? `Wind on floor ${userSpec.floor} accelerates surface soil drying.`
          : `Wiatr na ${userSpec.floor}. piętrze przyspiesza wysychanie wierzchniej warstwy podłoża.`
      );
    }
  } else if (temp <= 11) {
    waterIsGoodDay = false;
    waterStatus = 'wstrzymaj';
    waterTitle = isEn
      ? 'Water very sparingly (cold day)'
      : 'Podlewaj bardzo oszczędnie (chłodny dzień)';
    waterAdvice = isEn
      ? 'Low temperatures slow plant transpiration. Cold, waterlogged soil encourages fungal diseases and root rot.'
      : 'Niska temperatura spowalnia transpirację roślin. Mokre, zimne podłoże sprzyja chorobom odglebowym i gniciu korzeni.';
    waterSpecifics.push(
      isEn
        ? 'Use room-temperature water (never freezing tap water) only if soil is completely dry.'
        : 'Podlewaj letnią wodą (nie z lodowatego kranu) tylko jeśli gleba jest zupełnie sucha.'
    );
  } else {
    waterIsGoodDay = true;
    waterStatus = 'umiarkowane';
    waterTitle = isEn
      ? 'Moderate watering after moisture inspection'
      : 'Umiarkowane podlanie po sprawdzeniu wilgotności';
    waterAdvice = isEn
      ? 'Mild weather fosters stable growth. Keep soil slightly moist, but never waterlogged.'
      : 'Umiarkowane warunki atmosferyczne sprzyjają stabilnemu wzrostowi. Utrzymuj podłoże lekko wilgotne, ale nie podmokłe.';
    if (isCovered && precip > 0) {
      waterSpecifics.push(
        isEn
          ? 'Your balcony is covered: rain does not reach planters, so manual watering is required!'
          : 'Twój balkon jest zadaszony: deszcz nie dociera do donic, więc konieczne jest podlanie ręczne!'
      );
    }
  }

  // Inject pot & sowing specific watering nuances
  const activeRescueCrops = userCrops.filter((c) => c.rescuePlan?.active);
  const suspendedCrops = activeRescueCrops.filter((c) => isWateringSuspended(c.rescuePlan));
  if (suspendedCrops.length > 0) {
    const names = suspendedCrops
      .map((c) => {
        const p = userPlants.find((pl) => pl.id === c.plantId);
        return p ? getPlantName(p, language) : (isEn ? 'plant' : 'roślina');
      })
      .slice(0, 3)
      .join(', ');
    waterSpecifics.unshift(
      isEn
        ? `🛟 Rescue mode active: ${names} ${suspendedCrops.length === 1 ? 'has' : 'have'} watering suspended. Review instructions on the crop card.`
        : `🛟 Tryb ratunkowy aktywny: ${names} ${suspendedCrops.length === 1 ? 'ma' : 'mają'} zawieszone podlewanie. Sprawdź zalecenia na karcie uprawy.`
    );
  }

  if (cropsWithoutDrainage.length > 0) {
    waterSpecifics.push(
      isEn
        ? '🚨 Warning: You have containers without drainage holes! Water with small portions to avoid pooling at the bottom.'
        : '🚨 Uwaga: Posiadasz donice bez odpływu wody! Podlewaj je minimalną porcją, by woda nie stała na dnie.'
    );
  }
  if (cropsInSmallPots.length > 0 && temp >= 20) {
    const names = cropsInSmallPots.map((p) => getPlantName(p, language)).join(', ');
    waterSpecifics.push(
      isEn
        ? `🪴 Undersized pots (${names}): Low substrate volume dries out twice as fast in the sun. Check moisture twice a day!`
        : `🪴 Zbyt małe donice (${names}): Mała objętość podłoża przesycha 2x szybciej w słońcu. Sprawdź wilgotność dwa razy dziennie!`
    );
  }
  if (cropsInTerracotta.length > 0 && temp >= 22) {
    waterSpecifics.push(
      isEn
        ? '🏺 Terracotta/ceramic pots evaporate water across the entire wall surface – water them slightly more generously than plastic containers.'
        : '🏺 Donice z terakoty/ceramiki parują całą powierzchnią ścianek – nawadniaj je nieco obficiej niż plastikowe.'
    );
  }
  if (cropsInGermination.length > 0) {
    const names = cropsInGermination.map((p) => getPlantName(p, language)).join(', ');
    waterSpecifics.push(
      isEn
        ? `🌱 Germination & sprouting (${names}): Water exclusively with a fine mist sprayer to prevent dislodging tiny seeds from the soil.`
        : `🌱 Wschody i kiełkowanie (${names}): Podlewaj wyłącznie drobną mgiełką ze zraszacza, by nie wypłukać nasion z podłoża.`
    );
  }

  // 2. Nawożenie (Fertilizing)
  let fertIsGoodDay = true;
  let fertStatus: 'zalecane' | 'odradzane' | 'umiarkowane' = 'zalecane';
  let fertTitle = isEn
    ? 'Great day to feed crops with biohumus or organic fertilizer'
    : 'Dobry dzień na zasilenie upraw biohumusem lub nawozem';
  let fertAdvice = isEn
    ? 'Optimal temperatures foster efficient macro- and micronutrient uptake by container root systems.'
    : 'Optymalne temperatury sprzyjają pobieraniu makro- i mikroelementów przez system korzeniowy w donicach.';
  let dosageTip = isEn
    ? 'Remember: Always apply fertilizer to pre-moistened soil (never on a bone-dry root ball!).'
    : 'Pamiętaj: Zawsze nanoś nawóz na lekko wilgotne podłoże (nigdy na suchą bryłę korzeniową!).';

  if (temp >= 28) {
    fertIsGoodDay = false;
    fertStatus = 'odradzane';
    fertTitle = isEn
      ? 'Postpone feeding today (heat risks scorching roots)'
      : 'Odradzane dzisiaj (upał grozi poparzeniem korzeni)';
    fertAdvice = isEn
      ? 'Above 28°C, fertilizer salt concentrations in container substrate spike, causing physiological drought and root tip burn.'
      : 'Przy temperaturze powyżej 28°C stężenie soli nawozowych w małej objętości donicy gwałtownie wzrasta, co prowadzi do tzw. suszy fizjologicznej i uszkodzenia włośników korzeniowych.';
    dosageTip = isEn
      ? 'Reschedule feeding for a cooler day or apply late in the evening after thorough watering.'
      : 'Przełóż nawożenie na chłodniejszy dzień lub wykonaj je późnym wieczorem po solidnym podlaniu.';
  } else if (temp < 12) {
    fertIsGoodDay = false;
    fertStatus = 'odradzane';
    fertTitle = isEn
      ? 'Skip feeding (slowed plant metabolism)'
      : 'Pomiń zasilanie (spowolniony metabolizm)';
    fertAdvice = isEn
      ? 'In low temperatures, roots cannot effectively absorb phosphorus and potassium.'
      : 'W niskich temperaturach korzenie nie pobierają efektywnie fosforu i potasu.';
    dosageTip = isEn
      ? 'Hold off until warmer conditions return.'
      : 'Wstrzymaj się do czasu ocieplenia.';
  } else {
    if (cropsInFlowering.length > 0 || cropsInFruiting.length > 0) {
      const activePlants = [...cropsInFlowering, ...cropsInFruiting];
      const names = Array.from(new Set(activePlants.map((p) => getPlantName(p, language)))).join(', ');
      fertTitle = isEn
        ? 'Time for potassium & calcium feeding (flowering & fruiting)'
        : 'Czas na nawóz z potasem i wapniem (kwitnienie i owoce)';
      fertAdvice = isEn
        ? `Your crops (${names}) entered flowering or fruiting. Boost potassium (K) and phosphorus (P), and limit nitrogen (N) so energy fuels fruit rather than foliage.`
        : `Twoje uprawy (${names}) weszły w fazę kwitnienia lub owocowania. Zwiększ dawkę potasu (K) i fosforu (P), a ogranicz azot (N), by roślina nie szła tylko w zielone liście.`;
      dosageTip = isEn
        ? 'Apply liquid tomato/potassium fertilizer every 7 days or comfrey extract.'
        : 'Stosuj płynny nawóz pomidorowo-potasowy co 7 dni lub gnojówkę ze skrzypu/żywokostu.';
    } else if (cropsInGermination.length > 0 && userPlants.length === cropsInGermination.length) {
      fertTitle = isEn
        ? 'Hold off on fertilizer (seedling germination stage)'
        : 'Wstrzymaj nawożenie (faza kiełkowania nasion)';
      fertAdvice = isEn
        ? 'Young seedlings draw nutrients from seed reserves. Mineral fertilizers now would burn delicate embryonic roots.'
        : 'Młode siewki czerpią pokarm z nasiona. Nawozy mineralne na tym etapie poparzyłyby delikatne korzonki zarodkowe.';
      dosageTip = isEn
        ? 'Begin gentle biohumus feeding only 10–14 days after pricking out.'
        : 'Zacznij delikatne zasilanie biohumusem dopiero 10–14 dni po pikowaniu.';
    } else {
      const hasHerbs = userPlants.some((p) => p.plant_group === 'ziola');
      if (hasHerbs) {
        fertTitle = isEn
          ? 'Gentle organic biohumus feeding (herbs)'
          : 'Delikatne zasilanie biohumusem (zioła)';
        fertAdvice = isEn
          ? 'Herbs thrive on mild organic nutrients. Excess nitrogen weakens the fragrance of essential oils in leaves.'
          : 'Zioła preferują lekkie nawożenie organiczne. Nadmiar azotu osłabia aromat olejków eterycznych w liściach.';
        dosageTip = isEn
          ? 'Feed herbs with diluted biohumus at 1/2 of standard manufacturer dosage.'
          : 'Podlej zioła rozcieńczonym biohumusem w dawce 1/2 zalecanej przez producenta.';
      }
    }
  }

  // 3. Przycinanie i pielęgnacja pędów (Pruning)
  const plantTasks: { plantName: string; task: string; icon: string }[] = [];

  userPlants.forEach((plant) => {
    const timeline = cropTimelineMap.get(plant.id);
    const phaseId = timeline?.currentPhase.id || '';
    const localizedPlantName = getPlantName(plant, language);

    if (plant.id === 'pomidor-karlowy' || plant.name.toLowerCase().includes('pomidor')) {
      if (phaseId === 'kielkowanie') {
        plantTasks.push({
          plantName: localizedPlantName,
          task: isEn
            ? 'Remove plastic humidity dome once seedlings emerge and rotate containers toward sunlight so shoots grow upright.'
            : 'Zdejmij osłonkę foliową gdy siewki wzejdą i obracaj doniczkę w stronę światła, by siewki nie wybiegały.',
          icon: '🌱',
        });
      } else if (phaseId.includes('liscie')) {
        plantTasks.push({
          plantName: localizedPlantName,
          task: isEn
            ? 'Prick out seedlings into individual cups burying them up to the seed leaves to stimulate extra adventitious roots.'
            : 'Przepikuj siewki do osobnych doniczek zagłębiając je po same liścienie – wypuszczą dodatkowe korzenie.',
          icon: '🌿',
        });
      } else {
        plantTasks.push({
          plantName: localizedPlantName,
          task: isEn
            ? 'Pinch suckers (side shoots in leaf axils) and prune lower leaves touching soil to boost aeration.'
            : 'Usuń "wilki" (pędy boczne w pachwinach liści) oraz dolne liście dotykające podłoża, by poprawić cyrkulację powietrza.',
          icon: '🍅',
        });
      }
    } else if (plant.id === 'bazylia-pospolita' || plant.name.toLowerCase().includes('bazylia')) {
      plantTasks.push({
        plantName: localizedPlantName,
        task: isEn
          ? 'Pinch shoot tips above the 2nd or 3rd leaf pair – stimulates bushy mounds and clip off flower buds!'
          : 'Uszczknij wierzchołki pędów nad drugą lub trzecią parą liści – pobudzi to krzewienie w gęstą kępę i wytnij pąki kwiatowe!',
        icon: '🌿',
      });
    } else if (plant.id === 'papryka-chili' || plant.name.toLowerCase().includes('papryka')) {
      plantTasks.push({
        plantName: localizedPlantName,
        task: isEn
          ? 'Check the first stem fork: pinch the "king blossom" so the plant produces a sturdier frame with abundant blooms.'
          : 'Skontroluj pierwsze rozwidlenie łodygi: uszczknij tzw. pąk królewski, by roślina zbudowała mocniejszy krzew z masą kwiatów.',
        icon: '🌶️',
      });
    } else if (
      plant.id === 'truskawka-zwisajaca' ||
      plant.name.toLowerCase().includes('truskawk') ||
      plant.name.toLowerCase().includes('poziomk')
    ) {
      plantTasks.push({
        plantName: localizedPlantName,
        task: isEn
          ? 'Clip emerging runners (stolons) with shears so energy stays concentrated on juicy berry production.'
          : 'Wytnij nożyczkami wyrastające rozłogi (wąsy), które niepotrzebnie odbierają roślinie energię do owocowania.',
        icon: '🍓',
      });
    } else if (plant.id === 'mieta-pieprzowa' || plant.name.toLowerCase().includes('mięt')) {
      plantTasks.push({
        plantName: localizedPlantName,
        task: isEn
          ? 'Trim the top 1/3 of stems regularly for refreshing teas – prevents lower stems from turning woody and bare.'
          : 'Ścinaj regularnie górną 1/3 pędów do naparów – zapobiegnie to ogałacaniu się pędów u dołu.',
        icon: '🍃',
      });
    }
  });

  if (plantTasks.length === 0) {
    plantTasks.push({
      plantName: isEn ? 'All your plants' : 'Wszystkie Twoje rośliny',
      task: isEn
        ? 'Inspect planters: prune dry, yellowing foliage and spent blossoms to remove hosts for botrytis gray mold.'
        : 'Przejrzyj donice: usuń zaschnięte, pożółkłe listki i przekwitłe kwiaty, by nie stanowiły pożywki dla szarej pleśni.',
      icon: '✂️',
    });
  }

  const pruningAdvice: import('../types').DailyPruningAdvice = {
    title: isEn
      ? 'Formative pruning & container hygiene'
      : 'Zabiegi formujące i higiena roślin w donicach',
    advice: isEn
      ? 'Regular pinching and clearing diseased or dry leaves preserves healthy air circulation on compact balcony spaces.'
      : 'Regularne uszczykiwanie i usuwanie chorych części to podstawa zdrowego mikroklimatu na małej przestrzeni balkonu.',
    plantTasks,
  };

  // 4. Opryski i ochrona biologiczna (Spraying)
  let sprayIsGoodDay = true;
  let sprayStatus: 'dobry_dzien' | 'zly_dzien' | 'wstrzymaj' = 'dobry_dzien';
  let sprayTitle = isEn
    ? 'Favorable conditions for preventive eco spraying'
    : 'Sprzyjające warunki do profilaktycznego oprysku eko';
  let sprayAdvice = isEn
    ? 'No rain and mild temperatures create an ideal evening window for organic foliar sprays to fortify leaves.'
    : 'Brak deszczu i umiarkowana temperatura to doskonały moment na wieczorny oprysk ekologiczny wzmacniający odporność liści.';
  let recommendedOrganicSolution: string | undefined = isEn
    ? 'Organic horsetail extract (silica reinforces leaf cuticles against powdery mildew & blight) or baking soda with potassium soap.'
    : 'Ekologiczny wyciąg ze skrzypu polnego (krzemionka wzmacnia skórkę liści przed mączniakiem i zarazą) lub roztwór sody z mydłem potasowym.';

  if (precip > 0.5) {
    sprayIsGoodDay = false;
    sprayStatus = 'zly_dzien';
    sprayTitle = isEn
      ? 'Unfavorable for spraying (rain will wash treatment away)'
      : 'Zły dzień na oprysk (opady zmyją preparat)';
    sprayAdvice = isEn
      ? 'Rainfall will wash active ingredients off leaf surfaces right away, making the application ineffective.'
      : 'Deszcz natychmiast zmyje substancję czynną z powierzchni liści, czyniąc zabieg nieskutecznym.';
    recommendedOrganicSolution = undefined;
  } else if (wind > 18) {
    sprayIsGoodDay = false;
    sprayStatus = 'wstrzymaj';
    sprayTitle = isEn
      ? `Wind too strong on floor ${userSpec.floor} (${Math.round(wind)} km/h)`
      : `Zbyt silny wiatr na ${userSpec.floor}. piętrze (${Math.round(wind)} km/h)`;
    sprayAdvice = isEn
      ? 'Strong gusts drift spray mist away from containers (risking stains on building walls or neighbor balconies). Wait for a calm evening.'
      : 'Silne podmuchy wiatru znoszą mgiełkę oprysku poza donice (ryzyko zabrudzenia elewacji lub balkonu sąsiada). Poczekaj na bezwietrzny wieczór.';
    recommendedOrganicSolution = undefined;
  } else if (temp >= 27) {
    sprayIsGoodDay = false;
    sprayStatus = 'wstrzymaj';
    sprayTitle = isEn
      ? 'Hold off during midday (leaf scorch hazard)'
      : 'Wstrzymaj się w ciągu dnia (ryzyko poparzenia liści)';
    sprayAdvice = isEn
      ? 'Spraying under bright sunshine acts like tiny lenses, scorching leaf tissue. Apply only after dusk (after 7:30 PM).'
      : 'Oprysk wykonany w pełnym słońcu działa jak soczewka i powoduje martwice tkanek liścia. Wykonaj zabieg wyłącznie po zachodzie słońca (po godz. 19:30).';
    recommendedOrganicSolution = isEn
      ? 'Dusk spray with potassium soft soap solution (10ml per 1L lukewarm water) against aphids and spider mites.'
      : 'Wieczorny oprysk roztworem szarego mydła potasowego (10ml/1L letniej wody) przeciw mszycom i przędziorkom.';
  }

  // 5. Specjalne alerty balkonowe
  const specialAlerts: string[] = [];

  if (wind >= 22) {
    specialAlerts.push(
      isEn
        ? `⚠️ Gusty winds (${Math.round(wind)} km/h): Push tall containers (staked tomatoes, peppers) against structural walls and check rail box fasteners!`
        : `⚠️ Porywisty wiatr (${Math.round(wind)} km/h): Dosuń wysokie donice (pomidory, papryki na palikach) do ściany nośnej budynku i sprawdź mocowanie skrzynek na barierce!`
    );
  }

  if (temp < 4) {
    specialAlerts.push(
      isEn
        ? '❄️ Ground frost hazard: Move warmth-loving seedlings (basil, tomato, pepper) indoors overnight or drape with white fleece.'
        : '❄️ Ryzyko przymrozku przy gruncie: Ciepłolubne sadzonki (bazylia, pomidor, papryka) przenieś na noc do mieszkania lub okryj białą agrowłókniną P-17.'
    );
  }

  if (temp >= 31) {
    specialAlerts.push(
      isEn
        ? '☀️ Extreme balcony heatwave: Dark plastic containers can exceed 45°C. Wrap planters in light burlap or cardboard to protect root systems.'
        : '☀️ Ekstremalny upał na balkonie: Ciemne plastikowe donice mogą nagrzać się do ponad 45°C. Owiń je jasną jutą lub osłoń tekturą, by nie ugotować korzeni.'
    );
  }

  // 6. Ostrzeżenia i mikroklimat szklarni balkonowej
  const cropsInGreenhouse = userCrops.filter((c) => c.inGreenhouse === true);
  if (cropsInGreenhouse.length > 0) {
    if (temp >= 19 && precip < 1) {
      specialAlerts.push(
        isEn
          ? `🏡 Balcony greenhouse ventilation: You have ${cropsInGreenhouse.length} ${
              cropsInGreenhouse.length === 1 ? 'crop' : 'crops'
            } in your greenhouse. In sunny ${Math.round(
              temp
            )}°C weather, unzip or vent the cover so temperatures inside stay below 32°C.`
          : `🏡 Wietrzenie szklarni balkonowej: Masz ${cropsInGreenhouse.length} ${
              cropsInGreenhouse.length === 1 ? 'uprawę' : 'uprawy'
            } w szklarni/folii. Przy temperaturze ${Math.round(
              temp
            )}°C i słońcu koniecznie rozsuń zamek lub uchyl klapę, aby wewnątrz nie przekroczyć 32°C.`
      );
    } else if (temp <= 6) {
      specialAlerts.push(
        isEn
          ? `🛡️ Greenhouse thermal buffer: Your sheltered crops (${cropsInGreenhouse.length}) gain a valuable +3°C to +5°C temperature cushion. Zip the foil shut before sunset.`
          : `🛡️ Ochrona w szklarni: Twoje uprawy w szklarni balkonowej (${cropsInGreenhouse.length}) zyskują cenne +3°C do +5°C buforu termicznego. Zasuń szczelnie folię przed zachodem słońca.`
      );
    } else if (precip > 1.5) {
      specialAlerts.push(
        isEn
          ? `🌧️ Greenhouse planters (${cropsInGreenhouse.length}): Despite rain outside, moisture doesn't penetrate greenhouse covers. Remember to manually water inside!`
          : `🌧️ Donice w szklarni (${cropsInGreenhouse.length}): Mimo opadów na zewnątrz deszcz nie dociera pod folię. Pamiętaj o manualnym podlaniu ziemi w szklarence.`
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
    lastUpdated: new Date().toLocaleTimeString(isEn ? 'en-US' : 'pl-PL', { hour: '2-digit', minute: '2-digit' }),
  };
}
