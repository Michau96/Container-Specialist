// Curated, beautiful high-resolution photography and visuals for balcony plants
// Optimized for emotional conversion, vibrant colors, and instant desire to plant.

export interface PlantVisualData {
  imageUrl: string;
  alt: string;
  placeholderBg: string;
  emoji: string;
}

export const PLANT_IMAGE_MAP: Record<string, PlantVisualData> = {
  'pomidor-karlowy': {
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    alt: 'Dojrzałe soczyste pomidorki koktajlowe w donicy na balkonie',
    placeholderBg: 'from-red-900/40 via-amber-900/30 to-stone-900',
    emoji: '🍅',
  },
  'papryka-chili': {
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80',
    alt: 'Papryczki chili w doniczce w słońcu',
    placeholderBg: 'from-orange-950/50 via-red-950/40 to-stone-900',
    emoji: '🌶️',
  },
  'rzodkiewka': {
    imageUrl: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeża, chrupiąca rzodkiewka z zielonymi liśćmi',
    placeholderBg: 'from-pink-950/50 via-emerald-950/40 to-stone-900',
    emoji: '🌱',
  },
  'salata-listkowa': {
    imageUrl: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=800&q=80',
    alt: 'Chrupiąca zielona sałata liściowa w skrzynce balkonowej',
    placeholderBg: 'from-emerald-950/50 via-teal-950/40 to-stone-900',
    emoji: '🥬',
  },
  'szpinak-balkonowy': {
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeże liście młodego szpinaku balkonowego',
    placeholderBg: 'from-emerald-950/60 via-green-950/40 to-stone-900',
    emoji: '🍃',
  },
  'fasola-karlowa': {
    imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80',
    alt: 'Młoda zielona fasolka szparagowa na krzaczku',
    placeholderBg: 'from-emerald-950/50 via-teal-950/30 to-stone-900',
    emoji: '🫘',
  },
  'ogorek-krzaczasty': {
    imageUrl: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80',
    alt: 'Chrupiące ogórki rosnące w pojemniku na balkonowej kratce',
    placeholderBg: 'from-emerald-950/50 via-green-950/40 to-stone-900',
    emoji: '🥒',
  },
  'szczypiorek-ziola': {
    imageUrl: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?auto=format&fit=crop&w=800&q=80',
    alt: 'Gęsty soczyście zielony szczypiorek w ceramicznej donicy',
    placeholderBg: 'from-teal-950/50 via-emerald-950/40 to-stone-900',
    emoji: '🧅',
  },
  'marchew-mini': {
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80',
    alt: 'Słodkie małe marchewki z donicy balkonowej',
    placeholderBg: 'from-orange-950/50 via-amber-950/40 to-stone-900',
    emoji: '🥕',
  },
  'jarmuz-karlowy': {
    imageUrl: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=800&q=80',
    alt: 'Gęsty kędzierzawy jarmuż o ciemnozielonych liściach',
    placeholderBg: 'from-emerald-950/60 via-slate-950/40 to-stone-900',
    emoji: '🥬',
  },
  'rukola-balkonowa': {
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80',
    alt: 'Aromatyczna świeża rukola na balkonie',
    placeholderBg: 'from-emerald-950/50 via-teal-950/30 to-stone-900',
    emoji: '🥗',
  },
  'roszponka': {
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    alt: 'Delikatne rozetki roszponki gotowe do sałatki',
    placeholderBg: 'from-teal-950/50 via-emerald-950/40 to-stone-900',
    emoji: '🥗',
  },
  'cukinia-balkonowa': {
    imageUrl: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&w=800&q=80',
    alt: 'Kompaktowa cukinia balkonowa ze złocistym kwiatem',
    placeholderBg: 'from-emerald-950/50 via-amber-950/30 to-stone-900',
    emoji: '🥒',
  },
  'rozmaryn-lekarski': {
    imageUrl: 'https://images.unsplash.com/photo-1515586000433-a5ac7488aa16?auto=format&fit=crop&w=800&q=80',
    alt: 'Aromatyczny rozmaryn w doniczce terakotowej',
    placeholderBg: 'from-teal-950/50 via-slate-950/40 to-stone-900',
    emoji: '🌿',
  },
  'tymianek-wlasciwy': {
    imageUrl: 'https://images.unsplash.com/photo-1589135233689-d56d8d6411be?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeży tymianek o intensywnym zapachu',
    placeholderBg: 'from-emerald-950/50 via-teal-950/30 to-stone-900',
    emoji: '🌿',
  },
  'oregano-lebiodka': {
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=800&q=80',
    alt: 'Śródziemnomorskie oregano w glinianej donicy',
    placeholderBg: 'from-teal-950/50 via-green-950/40 to-stone-900',
    emoji: '🌿',
  },
  'szalwia-lekarska': {
    imageUrl: 'https://images.unsplash.com/photo-1608797178974-15b35a61dd7c?auto=format&fit=crop&w=800&q=80',
    alt: 'Aksamitne liście szałwii lekarskiej',
    placeholderBg: 'from-slate-950/50 via-teal-950/40 to-stone-900',
    emoji: '🌿',
  },
  'burak-lisciowy': {
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
    alt: 'Tęczowa boćwina o rubinowych łodygach',
    placeholderBg: 'from-rose-950/50 via-emerald-950/40 to-stone-900',
    emoji: '🥬',
  },
  'truskawka-wisząca': {
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    alt: 'Wisząca truskawka pełna słodkich czerwonych owoców',
    placeholderBg: 'from-rose-950/50 via-red-950/40 to-stone-900',
    emoji: '🍓',
  },
  'poziomka-caloroczna': {
    imageUrl: 'https://images.unsplash.com/photo-1543528176-61b239494933?auto=format&fit=crop&w=800&q=80',
    alt: 'Pachnące leśne poziomki w donicy',
    placeholderBg: 'from-red-950/50 via-pink-950/40 to-stone-900',
    emoji: '🍓',
  },
  'borowka-patio': {
    imageUrl: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80',
    alt: 'Dojrzewające borówki amerykańskie na krzaku',
    placeholderBg: 'from-indigo-950/60 via-purple-950/40 to-stone-900',
    emoji: '🫐',
  },
  'malina-karlowa': {
    imageUrl: 'https://images.unsplash.com/photo-1577069808021-76a01fb9be59?auto=format&fit=crop&w=800&q=80',
    alt: 'Soczyste maliny prosto z domowego krzaczka',
    placeholderBg: 'from-rose-950/60 via-red-950/40 to-stone-900',
    emoji: '🫐',
  },
  'arbuz-mini': {
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    alt: 'Mini arbuz balkonowy',
    placeholderBg: 'from-emerald-950/50 via-red-950/30 to-stone-900',
    emoji: '🍉',
  },
  'bazylia-wlasciwa': {
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Gęsta, aromatyczna bazylia Genovese w słońcu',
    placeholderBg: 'from-emerald-950/60 via-teal-950/40 to-stone-900',
    emoji: '🌿',
  },
  'mieta-donica': {
    imageUrl: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=800&q=80',
    alt: 'Orzeźwiająca mięta w donicy z kroplami rosy',
    placeholderBg: 'from-teal-950/60 via-emerald-950/40 to-stone-900',
    emoji: '🍃',
  },
  'pietruszka-naciowa': {
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    alt: 'Bujna pietruszka naciowa pełna witaminy C',
    placeholderBg: 'from-emerald-950/50 via-green-950/40 to-stone-900',
    emoji: '🌿',
  },
  'pelargonia-balkonowa': {
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    alt: 'Czerwone pelargonie w pełnym słońcu na balkonie',
    placeholderBg: 'from-red-950/60 via-rose-950/40 to-stone-900',
    emoji: '🌺',
  },
  'surfinia-kaskadowa': {
    imageUrl: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80',
    alt: 'Kaskada fioletowych i różowych surfinii na balustradzie',
    placeholderBg: 'from-purple-950/60 via-fuchsia-950/40 to-stone-900',
    emoji: '🌸',
  },
  'lawenda-donica': {
    imageUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80',
    alt: 'Kwitnąca lawenda wąskolistna w ciepłym świetle',
    placeholderBg: 'from-violet-950/60 via-purple-950/40 to-stone-900',
    emoji: '💜',
  },
  'aksamitka-niska': {
    imageUrl: 'https://images.unsplash.com/photo-1599818928045-8c01d4a04e57?auto=format&fit=crop&w=800&q=80',
    alt: 'Złocisto-pomarańczowe aksamitki w skrzynce balkonowej',
    placeholderBg: 'from-amber-950/60 via-orange-950/40 to-stone-900',
    emoji: '🌼',
  },
  'begonia-stale-kwitnaca': {
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    alt: 'Różowa begonia stale kwitnąca w doniczce',
    placeholderBg: 'from-pink-950/50 via-rose-950/40 to-stone-900',
    emoji: '🌸',
  },
  'fuksja-zwisajaca': {
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
    alt: 'Egzotyczne dzwonkowate kwiaty fuksji',
    placeholderBg: 'from-fuchsia-950/60 via-purple-950/40 to-stone-900',
    emoji: '🌺',
  },
  'rzezucha-siewna': {
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeża rzeżucha gotowa do zbioru w kilka dni',
    placeholderBg: 'from-emerald-950/50 via-teal-950/40 to-stone-900',
    emoji: '🌱',
  },
  'slonecznik-mikrolistki': {
    imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=800&q=80',
    alt: 'Młode, chrupiące mikrolistki słonecznika',
    placeholderBg: 'from-emerald-950/50 via-amber-950/30 to-stone-900',
    emoji: '🌻',
  },
  'rzodkiewka-kielki': {
    imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80',
    alt: 'Rubinowe pikantne kiełki rzodkiewki',
    placeholderBg: 'from-pink-950/60 via-purple-950/40 to-stone-900',
    emoji: '🌱',
  },
  'gorczyca-kielki': {
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    alt: 'Wyraziste młode siewki gorczycy',
    placeholderBg: 'from-emerald-950/50 via-lime-950/30 to-stone-900',
    emoji: '🌱',
  },
  'pszenica-trawa': {
    imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=800&q=80',
    alt: 'Soczyście zielona trawa pszeniczna do soków',
    placeholderBg: 'from-emerald-950/60 via-green-950/40 to-stone-900',
    emoji: '🌾',
  },
  'boczniak-ostrygowaty': {
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeża kępa boczniaków ostrygowatych',
    placeholderBg: 'from-stone-950/70 via-amber-950/30 to-stone-900',
    emoji: '🍄',
  },
  'pieczarka-dwuzarodnikowa': {
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeże białe pieczarki z domowej uprawy',
    placeholderBg: 'from-stone-900/60 via-stone-800/40 to-stone-900',
    emoji: '🍄',
  },
  'soplowka-jezowata': {
    imageUrl: 'https://images.unsplash.com/photo-1617182635496-c5c474367085?auto=format&fit=crop&w=800&q=80',
    alt: 'Soplówka jeżowata o puszystych białych igiełkach',
    placeholderBg: 'from-slate-900/60 via-stone-900/40 to-stone-900',
    emoji: '🍄',
  },
  'shiitake-twardnik': {
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
    alt: 'Aromatyczne grzyby Shiitake',
    placeholderBg: 'from-amber-950/60 via-stone-950/40 to-stone-900',
    emoji: '🍄',
  },
  'groszek-cukrowy': {
    imageUrl: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80',
    alt: 'Słodki zielony groszek w strąkach',
    placeholderBg: 'from-emerald-950/50 via-teal-950/40 to-stone-900',
    emoji: '🫛',
  },
  'pak-choi': {
    imageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
    alt: 'Chrupiąca kapustka Pak Choi',
    placeholderBg: 'from-emerald-950/50 via-lime-950/30 to-stone-900',
    emoji: '🥬',
  },
  'kumkwat-cytrus': {
    imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
    alt: 'Drzewko kumkwatu z pomarańczowymi owocami',
    placeholderBg: 'from-orange-950/60 via-amber-950/40 to-stone-900',
    emoji: '🍊',
  },
  'figowiec': {
    imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
    alt: 'Figowiec w donicy o pięknych liściach i słodkich owocach',
    placeholderBg: 'from-emerald-950/50 via-purple-950/40 to-stone-900',
    emoji: '🪴',
  },
  'miechunka-peruwianska': {
    imageUrl: 'https://images.unsplash.com/photo-1597714026732-39c049d56434?auto=format&fit=crop&w=800&q=80',
    alt: 'Złociste owoce miechunki w delikatnych lampionach',
    placeholderBg: 'from-amber-950/60 via-orange-950/40 to-stone-900',
    emoji: '🏮',
  },
  'trawa-cytrynowa': {
    imageUrl: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeża aromatyczna trawa cytrynowa',
    placeholderBg: 'from-lime-950/50 via-teal-950/40 to-stone-900',
    emoji: '🌾',
  },
};

// Fallbacks by plant group
export const GROUP_FALLBACK_IMAGES: Record<string, PlantVisualData> = {
  warzywa: {
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    alt: 'Świeże warzywa z uprawy balkonowej',
    placeholderBg: 'from-emerald-950/60 via-amber-950/30 to-stone-900',
    emoji: '🥕',
  },
  owoce: {
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    alt: 'Słodkie owoce balkonowe',
    placeholderBg: 'from-rose-950/60 via-pink-950/40 to-stone-900',
    emoji: '🍓',
  },
  ziola: {
    imageUrl: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Aromatyczne zioła w doniczkach',
    placeholderBg: 'from-teal-950/60 via-emerald-950/40 to-stone-900',
    emoji: '🌿',
  },
  ozdobne: {
    imageUrl: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80',
    alt: 'Kwitnące rośliny ozdobne na balkonie',
    placeholderBg: 'from-purple-950/60 via-fuchsia-950/40 to-stone-900',
    emoji: '🌸',
  },
  kielki: {
    imageUrl: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=800&q=80',
    alt: 'Młode kiełki i mikrolistki pełne energii',
    placeholderBg: 'from-emerald-950/60 via-teal-950/30 to-stone-900',
    emoji: '🌱',
  },
  grzyby: {
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80',
    alt: 'Domowa uprawa grzybów',
    placeholderBg: 'from-stone-950/70 via-stone-900/50 to-stone-900',
    emoji: '🍄',
  },
};

export function getPlantVisual(plantId: string, plantGroup: string): PlantVisualData {
  if (PLANT_IMAGE_MAP[plantId]) {
    return PLANT_IMAGE_MAP[plantId];
  }
  if (GROUP_FALLBACK_IMAGES[plantGroup]) {
    return GROUP_FALLBACK_IMAGES[plantGroup];
  }
  return GROUP_FALLBACK_IMAGES.warzywa;
}
