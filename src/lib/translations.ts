import { Language } from '../types';

export interface Translations {
  // Brand & Header
  appTitle: string;
  appTagline: string;
  appSubtitle: string;
  myBalcony: string;
  aboutApp: string;
  account: string;
  signedInAs: string;
  themeLight: string;
  themeDark: string;
  themeTitle: string;
  preferencesTitle: string;
  language: string;
  polish: string;
  english: string;
  switchLanguage: string;

  // Navigation tabs
  tabMyCrops: string;
  tabDiscover: string;
  tabCalendar: string;
  tabCalculator: string;

  // Auth & Registration
  loginTitle: string;
  registerTitle: string;
  loginSubtitle: string;
  registerSubtitle: string;
  googleLogin: string;
  googleRegister: string;
  orTraditional: string;
  username: string;
  usernamePlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  selectLanguageRequired: string;
  selectLanguageHint: string;
  langPlLabel: string;
  langPlDesc: string;
  langEnLabel: string;
  langEnDesc: string;
  languageSelectionError: string;
  balconySettingsToSave: string;
  attachBalconyNotice: string;
  submitRegister: string;
  submitLogin: string;
  haveAccount: string;
  noAccount: string;
  passwordMismatch: string;
  minLengthError: string;
  minNickError: string;
  regionLabel: string;
  floorLabel: string;
  exposureLabel: string;
  cropCountLabel: string;

  // User Profile
  profileTitle: string;
  activeAccount: string;
  googleAccount: string;
  syncStatusTitle: string;
  syncStatusDesc: string;
  languageSettingTitle: string;
  languageSettingDesc: string;
  languagePreference: string;
  languagePreferenceHint: string;
  balconyParamsTitle: string;
  editParamsBtn: string;
  locationRegion: string;
  careModeLabel: string;
  logoutBtn: string;
  logout: string;
  closeBtn: string;

  // Balcony parameters
  balconyDrawerTitle: string;
  balconyDrawerSubtitle: string;
  saveAndRecalculate: string;
  saveTooltip: string;
  groundFloor: string;
  lowFloor: string;
  midFloor: string;
  highFloor: string;
  careDaily: string;
  careFewDays: string;
  careWeekends: string;

  // Search & Filters
  searchPlaceholder: string;
  groupAll: string;
  groupVegetables: string;
  groupFruits: string;
  groupHerbs: string;
  groupOrnamentals: string;
  groupSprouts: string;
  groupMushrooms: string;
  sortBy: string;
  sortTiming: string;
  sortDifficulty: string;
  sortName: string;
  timingAll: string;
  timingGoodNow: string;
  timingSowNow: string;
  timingPlantNow: string;

  // My Crops & Daily tasks
  myCropsTitle: string;
  myCropsSubtitle: string;
  addFirstCrop: string;
  noCropsYet: string;
  wateringToday: string;
  fertilizingToday: string;
  sprayingToday: string;
  pruningToday: string;
  goodDay: string;
  holdOff: string;
  checkMoisture: string;
  rescueMode: string;
  timelapse: string;
  addPhoto: string;
  markWatered: string;

  // Pot Calculator & Calendar
  potCalcTitle: string;
  potCalcSubtitle: string;
  calendarTitle: string;
  modeAllPlants: string;
  modeMyCrops: string;

  // Additional View & Component Keys
  sortScore: string;
  viewModeCompact: string;
  viewModeDetailed: string;
  resetFilters: string;
  noResultsFound: string;
  twojaStrefa: string;
  mojeUprawy: string;
  mojeUprawyDesc: string;
  plantSingle: string;
  plantFew: string;
  plantMany: string;
  subtabPlants: string;
  subtabDaily: string;
  subtabCalendar: string;
  addPlantBtn: string;
  emptyGardenTitle: string;
  emptyGardenDesc: string;
  popularStarters: string;
  exploreAllPlantsBtn: string;
  stagePlanning: string;
  stageSown: string;
  stageSeedling: string;
  stageGrowing: string;
  stageBlooming: string;
  stageFruiting: string;
  stageHarvest: string;
  tabPot: string;
  tabTimeline: string;
  tabPhotos: string;
  tabGreenhouse: string;
  tabNotes: string;
  actionPotConfig: string;
  actionWatered: string;
  actionDelete: string;
  saveChanges: string;
  cancel: string;
  edit: string;
  delete: string;
  weatherTitle: string;
  refreshWeather: string;
  tempFeelsLike: string;
  humidity: string;
  wind: string;
  calendarHeader: string;
  calendarSubtitle: string;
  potCalcHeader: string;
  potCalcSub: string;
  plantDetailGuide: string;
  plantDetailVarieties: string;
  plantDetailSoil: string;
  plantDetailNutrition: string;
  plantDetailCost: string;
  addToBalcony: string;
  inYourCrops: string;
  openPotCalc: string;
  close: string;
}

export const translations: Record<Language, Translations> = {
  pl: {
    // Brand & Header
    appTitle: 'Donicowy specjalista',
    appTagline: 'Ogród w pojemnikach',
    appSubtitle: 'Ekspercki poradnik uprawy warzyw, owoców, ziół i kwiatów w donicach',
    myBalcony: 'Mój balkon',
    aboutApp: 'O aplikacji',
    account: 'Konto / Zaloguj',
    signedInAs: 'Zalogowano jako',
    themeLight: 'Jasny',
    themeDark: 'Ciemny',
    themeTitle: 'Motyw interfejsu',
    preferencesTitle: 'Wygląd i język',
    language: 'Język',
    polish: 'Polski',
    english: 'English',
    switchLanguage: 'Zmień język',

    // Navigation tabs
    tabMyCrops: 'Moje uprawy',
    tabDiscover: 'Szukaj nowych upraw',
    tabCalendar: 'Kalendarz',
    tabCalculator: 'Kalkulator donic i rozstawy',

    // Auth & Registration
    loginTitle: 'Zaloguj się do konta',
    registerTitle: 'Utwórz nowe konto',
    loginSubtitle: 'Wczytaj swoje zapisane parametry balkonu i uprawy',
    registerSubtitle: 'Zapisz parametry swojego balkonu i prowadź uprawy na dowolnym urządzeniu',
    googleLogin: 'Zaloguj się przez konto Google',
    googleRegister: 'Zarejestruj się przez konto Google',
    orTraditional: 'lub tradycyjnie przez nick i hasło',
    username: 'Nick użytkownika',
    usernamePlaceholder: 'np. zielony_balkon, tomek_ogrodnik',
    password: 'Hasło',
    passwordPlaceholder: 'Wpisz hasło (min. 4 znaki)',
    confirmPassword: 'Powtórz hasło',
    confirmPasswordPlaceholder: 'Powtórz hasło',
    selectLanguageRequired: 'Wybierz język aplikacji (wymagane)',
    selectLanguageHint: 'Wybierz język, w którym aplikacja ma wyświetlać porady i interfejs.',
    langPlLabel: 'Polski (PL)',
    langPlDesc: 'Pełny polski interfejs i wskazówki agrotechniczne',
    langEnLabel: 'English (EN)',
    langEnDesc: 'English interface and gardening advice',
    languageSelectionError: 'Wybierz preferowany język przed utworzeniem konta.',
    balconySettingsToSave: 'Ustawienia balkonu do zapisania:',
    attachBalconyNotice: 'Powiąż obecne ustawienia balkonu i rośliny z nowym kontem',
    submitRegister: 'Utwórz konto',
    submitLogin: 'Zaloguj się',
    haveAccount: 'Masz już konto? Zaloguj się',
    noAccount: 'Nie masz jeszcze konta? Załóż bezpłatnie',
    passwordMismatch: 'Wpisane hasła nie są identyczne.',
    minLengthError: 'Hasło musi mieć co najmniej 4 znaki.',
    minNickError: 'Nick musi mieć co najmniej 2 znaki.',
    regionLabel: 'Województwo',
    floorLabel: 'Piętro',
    exposureLabel: 'Wystawa',
    cropCountLabel: 'uprawa',

    // User Profile
    profileTitle: 'Profil ogrodnika',
    activeAccount: 'Konto aktywne',
    googleAccount: 'Konto Google',
    syncStatusTitle: 'Ustawienia balkonu zapisane na Twoim koncie',
    syncStatusDesc: 'Każda zmiana parametrów balkonu lub dodanie nowej rośliny jest natychmiast zapisywana w Twoim profilu.',
    languageSettingTitle: 'Preferowany język aplikacji',
    languageSettingDesc: 'Możesz w każdej chwili przełączyć język interfejsu oraz porad uprawowych.',
    languagePreference: 'Preferowany język interfejsu',
    languagePreferenceHint: 'Wybierz język, w jakim chcesz korzystać z aplikacji i porad ogrodniczych.',
    balconyParamsTitle: 'Przypisane parametry balkonu:',
    editParamsBtn: 'Zmień parametry',
    locationRegion: 'Lokalizacja i region',
    careModeLabel: 'Tryb opieki & uprawy',
    logoutBtn: 'Wyloguj',
    logout: 'Wyloguj',
    closeBtn: 'Zamknij',

    // Balcony parameters
    balconyDrawerTitle: 'Mój balkon',
    balconyDrawerSubtitle: 'Dopasuj parametry, aby otrzymać precyzyjne rekomendacje',
    saveAndRecalculate: 'Zapisz i przelicz',
    saveTooltip: 'Zapisz parametry balkonu i zaktualizuj dopasowanie roślin oraz terminy',
    groundFloor: 'Parter',
    lowFloor: 'Niskie piętro (1-3)',
    midFloor: 'Średnie piętro (4-6)',
    highFloor: 'Wysokie piętro (7+)',
    careDaily: 'Codziennie (pełna opieka)',
    careFewDays: 'Co 2-3 dni',
    careWeekends: 'Tylko weekendy (rzadka)',

    // Search & Filters
    searchPlaceholder: 'Szukaj rośliny (np. pomidor, bazylia, truskawka)...',
    groupAll: 'Wszystkie',
    groupVegetables: 'Warzywa',
    groupFruits: 'Owoce',
    groupHerbs: 'Zioła',
    groupOrnamentals: 'Ozdobne',
    groupSprouts: 'Kiełki',
    groupMushrooms: 'Grzyby',
    sortBy: 'Sortuj według',
    sortTiming: 'Termin uprawy',
    sortDifficulty: 'Poziom trudności',
    sortName: 'Nazwa alfabetycznie',
    timingAll: 'Wszystkie terminy',
    timingGoodNow: 'Dobre na teraz',
    timingSowNow: 'Siej teraz',
    timingPlantNow: 'Sadź teraz',

    // My Crops & Daily tasks
    myCropsTitle: 'Moje uprawy balkonowe',
    myCropsSubtitle: 'Zarządzaj swoimi donicami, podlewaniem i etapami wzrostu',
    addFirstCrop: 'Dodaj pierwszą roślinę',
    noCropsYet: 'Nie masz jeszcze żadnych roślin na balkonie',
    wateringToday: 'Podlewanie na dziś',
    fertilizingToday: 'Nawożenie',
    sprayingToday: 'Opryski i ochrona',
    pruningToday: 'Cięcie i pielęgnacja',
    goodDay: 'Dobry dzień',
    holdOff: 'Wstrzymaj',
    checkMoisture: 'Sprawdź wilgotność',
    rescueMode: 'Tryb ratunkowy',
    timelapse: 'Poklatkowy wzrost',
    addPhoto: 'Dodaj zdjęcie',
    markWatered: 'Oznacz jako podlane',

    // Pot Calculator & Calendar
    potCalcTitle: 'Kalkulator pojemności donic i podłoża',
    potCalcSubtitle: 'Oblicz litraż ziemi, warstwę drenażu i optymalną obsadę',
    calendarTitle: 'Kalendarz prac balkonowych',
    modeAllPlants: 'Wszystkie rośliny',
    modeMyCrops: 'Tylko moje uprawy',

    // Additional View & Component Keys
    sortScore: 'Dopasowanie %',
    viewModeCompact: 'Widok kompaktowy',
    viewModeDetailed: 'Widok szczegółowy',
    resetFilters: 'Zresetuj filtry',
    noResultsFound: 'Nie znaleziono roślin spełniających kryteria',
    twojaStrefa: 'Twoja strefa balkonowa',
    mojeUprawy: 'Moje uprawy',
    mojeUprawyDesc: 'Śledź stan swoich donic, fazy rozwoju i zaplanowane prace w jednym przejrzystym miejscu.',
    plantSingle: 'roślina',
    plantFew: 'rośliny',
    plantMany: 'roślin',
    subtabPlants: 'Rośliny',
    subtabDaily: 'Zalecenia dnia',
    subtabCalendar: 'Harmonogram',
    addPlantBtn: 'Dodaj roślinę',
    emptyGardenTitle: 'Twój balkon czeka na pierwszą roślinę!',
    emptyGardenDesc: 'Wybierz rośliny dopasowane do Twojego nasłonecznienia i dodaj je do balkonu jednym kliknięciem.',
    popularStarters: 'Popularne rośliny startowe na ten sezon:',
    exploreAllPlantsBtn: 'Przeglądaj wszystkie rośliny',
    stagePlanning: 'Planowanie',
    stageSown: 'Wysiane',
    stageSeedling: 'Rozsada',
    stageGrowing: 'Rośnie w donicy',
    stageBlooming: 'Kwitnie',
    stageFruiting: 'Zawiązuje owoce',
    stageHarvest: 'Czas zbiorów',
    tabPot: 'Doniczka & Podłoże',
    tabTimeline: 'Fazy wzrostu',
    tabPhotos: 'Zdjęcia & Timelapse',
    tabGreenhouse: 'Szklarenka',
    tabNotes: 'Notatki & Odmiana',
    actionPotConfig: 'Konfiguruj donicę i siew',
    actionWatered: 'Podlane dzisiaj',
    actionDelete: 'Usuń roślinę',
    saveChanges: 'Zapisz zmiany',
    cancel: 'Anuluj',
    edit: 'Edytuj',
    delete: 'Usuń',
    weatherTitle: 'Warunki na Twoim balkonie',
    refreshWeather: 'Odśwież pogodę',
    tempFeelsLike: 'Odczuwalna',
    humidity: 'Wilgotność',
    wind: 'Wiatr',
    calendarHeader: 'Kalendarz prac balkonowych',
    calendarSubtitle: 'Zgodny ze strefami klimatycznymi i warunkami w donicach',
    potCalcHeader: 'Kalkulator donic i rozstawy',
    potCalcSub: 'Oblicz litraż ziemi, warstwę drenażu i obsadę dla swoich pojemników',
    plantDetailGuide: 'Poradnik uprawy',
    plantDetailVarieties: 'Polecane odmiany',
    plantDetailSoil: 'Podłoże i drenaż',
    plantDetailNutrition: 'Wartości odżywcze',
    plantDetailCost: 'Kalkulator kosztów',
    addToBalcony: 'Dodaj do Moich upraw',
    inYourCrops: 'W Twoich uprawach',
    openPotCalc: 'Kalkulator donicy',
    close: 'Zamknij',
  },

  en: {
    // Brand & Header
    appTitle: 'Container Specialist',
    appTagline: 'Container Garden',
    appSubtitle: 'Expert guide to growing vegetables, fruits, herbs and flowers in containers',
    myBalcony: 'My Balcony',
    aboutApp: 'About App',
    account: 'Account / Sign In',
    signedInAs: 'Signed in as',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeTitle: 'Theme',
    preferencesTitle: 'Preferences & Language',
    language: 'Language',
    polish: 'Polski',
    english: 'English',
    switchLanguage: 'Change language',

    // Navigation tabs
    tabMyCrops: 'My Crops',
    tabDiscover: 'Discover Crops',
    tabCalendar: 'Calendar',
    tabCalculator: 'Pot & Spacing Calculator',

    // Auth & Registration
    loginTitle: 'Sign In to Account',
    registerTitle: 'Create New Account',
    loginSubtitle: 'Load your saved balcony configuration and tracked crops',
    registerSubtitle: 'Save your balcony specs and manage your crops across devices',
    googleLogin: 'Sign in with Google Account',
    googleRegister: 'Sign up with Google Account',
    orTraditional: 'or traditionally with username and password',
    username: 'Username',
    usernamePlaceholder: 'e.g. green_balcony, urban_gardener',
    password: 'Password',
    passwordPlaceholder: 'Enter password (min. 4 characters)',
    confirmPassword: 'Confirm password',
    confirmPasswordPlaceholder: 'Confirm password',
    selectLanguageRequired: 'Choose application language (required)',
    selectLanguageHint: 'Choose the language for application guidance, calendar, and interface.',
    langPlLabel: 'Polski (PL)',
    langPlDesc: 'Full Polish interface and gardening guidance',
    langEnLabel: 'English (EN)',
    langEnDesc: 'English interface and gardening advice',
    languageSelectionError: 'Please select your preferred language before creating your account.',
    balconySettingsToSave: 'Balcony settings to save:',
    attachBalconyNotice: 'Link current balcony settings and crops to the new account',
    submitRegister: 'Create Account',
    submitLogin: 'Sign In',
    haveAccount: 'Already have an account? Sign In',
    noAccount: "Don't have an account yet? Register for free",
    passwordMismatch: 'Entered passwords do not match.',
    minLengthError: 'Password must be at least 4 characters.',
    minNickError: 'Username must be at least 2 characters.',
    regionLabel: 'Region',
    floorLabel: 'Floor',
    exposureLabel: 'Exposure',
    cropCountLabel: 'crops',

    // User Profile
    profileTitle: 'Gardener Profile',
    activeAccount: 'Active account',
    googleAccount: 'Google Account',
    syncStatusTitle: 'Balcony settings saved to your account',
    syncStatusDesc: 'Every change to balcony parameters or newly added crops is immediately saved to your profile.',
    languageSettingTitle: 'Preferred application language',
    languageSettingDesc: 'You can change the interface and gardening tips language at any time.',
    languagePreference: 'Preferred interface language',
    languagePreferenceHint: 'Choose the language you want to use for the app interface and gardening tips.',
    balconyParamsTitle: 'Assigned balcony parameters:',
    editParamsBtn: 'Edit parameters',
    locationRegion: 'Location & Region',
    careModeLabel: 'Care Mode & Crops',
    logoutBtn: 'Sign Out',
    logout: 'Sign Out',
    closeBtn: 'Close',

    // Balcony parameters
    balconyDrawerTitle: 'My Balcony',
    balconyDrawerSubtitle: 'Adjust parameters to receive customized container crop recommendations',
    saveAndRecalculate: 'Save and Recalculate',
    saveTooltip: 'Save balcony specs and update tailored plant recommendations and timeline',
    groundFloor: 'Ground floor',
    lowFloor: 'Low floor (1-3)',
    midFloor: 'Mid floor (4-6)',
    highFloor: 'High floor (7+)',
    careDaily: 'Daily (full care)',
    careFewDays: 'Every 2-3 days',
    careWeekends: 'Weekends only (light care)',

    // Search & Filters
    searchPlaceholder: 'Search plant (e.g. tomato, basil, strawberry)...',
    groupAll: 'All',
    groupVegetables: 'Vegetables',
    groupFruits: 'Fruits',
    groupHerbs: 'Herbs',
    groupOrnamentals: 'Flowers & Ornamentals',
    groupSprouts: 'Sprouts',
    groupMushrooms: 'Mushrooms',
    sortBy: 'Sort by',
    sortTiming: 'Growing timing',
    sortDifficulty: 'Difficulty level',
    sortName: 'Alphabetical name',
    timingAll: 'All timing',
    timingGoodNow: 'Favorable now',
    timingSowNow: 'Sow now',
    timingPlantNow: 'Plant now',

    // My Crops & Daily tasks
    myCropsTitle: 'My Balcony Crops',
    myCropsSubtitle: 'Manage your pots, daily watering schedule, and growth stages',
    addFirstCrop: 'Add your first plant',
    noCropsYet: 'You do not have any crops on your balcony yet',
    wateringToday: 'Watering for Today',
    fertilizingToday: 'Fertilization',
    sprayingToday: 'Sprays & Protection',
    pruningToday: 'Pruning & Care',
    goodDay: 'Favorable Day',
    holdOff: 'Hold off',
    checkMoisture: 'Check soil moisture',
    rescueMode: 'Rescue Mode',
    timelapse: 'Timelapse growth',
    addPhoto: 'Add photo',
    markWatered: 'Mark as watered',

    // Pot Calculator & Calendar
    potCalcTitle: 'Pot Volume & Soil Calculator',
    potCalcSubtitle: 'Calculate soil liters, drainage layer, and optimal planting spacing',
    calendarTitle: 'Balcony Gardening Calendar',
    modeAllPlants: 'All Plants',
    modeMyCrops: 'My Crops Only',

    // Additional View & Component Keys
    sortScore: 'Balcony match %',
    viewModeCompact: 'Compact view',
    viewModeDetailed: 'Detailed view',
    resetFilters: 'Reset filters',
    noResultsFound: 'No crops found matching criteria',
    twojaStrefa: 'Your Balcony Zone',
    mojeUprawy: 'My Crops',
    mojeUprawyDesc: 'Track your pots, growth stages, and scheduled care in one place.',
    plantSingle: 'plant',
    plantFew: 'plants',
    plantMany: 'plants',
    subtabPlants: 'Plants',
    subtabDaily: 'Daily Tips',
    subtabCalendar: 'Schedule',
    addPlantBtn: 'Add plant',
    emptyGardenTitle: 'Your balcony is waiting for its first crop!',
    emptyGardenDesc: 'Select plants tailored to your sun exposure and add them with one click.',
    popularStarters: 'Popular starter plants for this season:',
    exploreAllPlantsBtn: 'Explore all plants',
    stagePlanning: 'Planning',
    stageSown: 'Sown',
    stageSeedling: 'Seedling',
    stageGrowing: 'Growing in pot',
    stageBlooming: 'Blooming',
    stageFruiting: 'Fruiting',
    stageHarvest: 'Harvest time',
    tabPot: 'Pot & Soil',
    tabTimeline: 'Growth Phases',
    tabPhotos: 'Photos & Timelapse',
    tabGreenhouse: 'Greenhouse',
    tabNotes: 'Notes & Variety',
    actionPotConfig: 'Configure pot & sowing',
    actionWatered: 'Watered today',
    actionDelete: 'Remove plant',
    saveChanges: 'Save changes',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    weatherTitle: 'Current Balcony Weather',
    refreshWeather: 'Refresh weather',
    tempFeelsLike: 'Feels like',
    humidity: 'Humidity',
    wind: 'Wind',
    calendarHeader: 'Balcony Gardening Calendar',
    calendarSubtitle: 'Aligned with climate zones and container conditions',
    potCalcHeader: 'Pot & Spacing Calculator',
    potCalcSub: 'Calculate soil volume, drainage layer, and planting count for your containers',
    plantDetailGuide: 'Growing Guide',
    plantDetailVarieties: 'Recommended Varieties',
    plantDetailSoil: 'Soil & Drainage',
    plantDetailNutrition: 'Nutrition & Benefits',
    plantDetailCost: 'Cost Estimator',
    addToBalcony: 'Add to My Crops',
    inYourCrops: 'In your crops',
    openPotCalc: 'Pot calculator',
    close: 'Close',
  },
};

export function getTranslation(lang: Language): Translations {
  return translations[lang] || translations.pl;
}
