import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Sparkles,
  Search,
  Info,
  Sprout,
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  SlidersHorizontal,
  X,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { UserBalconySpec, Plant, WeatherData, PlantGroup, MyCropItem, UserAccount, getFloorCategoryLabel } from './types';
import {
  loadSavedSpec,
  saveUserSpec,
  hasUserOnboarded,
  hasUserSeenWelcome,
  setWelcomeSeen,
  fetchRecommendations,
  fetchWeather,
  loadSavedMyCrops,
  saveMyCrops,
  POLAND_REGIONS,
  DEFAULT_BALCONY_SPEC,
} from './lib/api';
import {
  getStoredUser,
  fetchCurrentUser,
  saveBalconyToAccount,
  logoutAccount,
} from './lib/auth';
import { Header, ActiveNavTab } from './components/Header';
import { WeatherWidget } from './components/WeatherWidget';
import { PlantCard } from './components/PlantCard';
import { PlantDetailModal } from './components/PlantDetailModal';
import { CalendarView } from './components/CalendarView';
import defaultPlantsData from './data/plants.json';
import { validatePlantCatalog } from './lib/catalogValidation';
import { PlantSearchIndex } from './lib/plantSearchIndex';

const defaultCatalogReport = validatePlantCatalog(defaultPlantsData);
const defaultPlants = defaultCatalogReport.validPlants;
import { BalconySetupModal } from './components/BalconySetupModal';
import { BalconyDrawer } from './components/BalconyDrawer';
import { WelcomeModal } from './components/WelcomeModal';
import { PotCalculator } from './components/PotCalculator';
import { MyCropsView } from './components/MyCropsView';
import { CatalogSkeletonGrid } from './components/PlantCardSkeleton';
import { SelectVarietyModal } from './components/SelectVarietyModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { computeDailyRecommendation } from './lib/dailyRecommendations';
import { getEffectivePlantRequirements } from './lib/varietyData';
import { POT_CALCULATION_VERSION } from './lib/potCalculations';
import { getPlantTimingInfo, getCalendarPeriodId, getPeriodHumanLabel } from './lib/cropTiming';
import { getPlantLifestylePills } from './lib/plantLifestyle';
import { useLanguage } from './lib/LanguageContext';
import { getTranslatedPlant, getPlantGroupLabel } from './lib/plantTranslations';

export default function App() {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [userSpec, setUserSpec] = useState<UserBalconySpec>(() => {
    const user = getStoredUser();
    return loadSavedSpec(user?.id);
  });
  
  // Welcome & onboarding splash screen state for first-time visitors
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState<boolean>(() => {
    return !hasUserSeenWelcome() && !getStoredUser();
  });

  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(() => {
    // If first-time user hasn't seen welcome yet, wait until they interact with welcome screen
    const user = getStoredUser();
    if (!hasUserSeenWelcome() && !user) {
      return false;
    }
    return !hasUserOnboarded(user?.id);
  });
  const [isBalconyDrawerOpen, setIsBalconyDrawerOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('my_crops');

  // User account state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [accountToast, setAccountToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // My Crops persistent state - isolated per user or empty for new users
  const [myCrops, setMyCrops] = useState<MyCropItem[]>(() => {
    const user = getStoredUser();
    return loadSavedMyCrops(user?.id);
  });

  // Variety selection modal state
  const [varietyPickerPlant, setVarietyPickerPlant] = useState<{
    plant: Plant;
    initialVariety?: string;
  } | null>(null);

  // Adding plant pending state & feedback banner
  const [addingPlantId, setAddingPlantId] = useState<string | null>(null);
  const pendingPlantAddsRef = useRef<Set<string>>(new Set());
  const [addFeedback, setAddFeedback] = useState<{
    type: 'success' | 'duplicate' | 'error';
    message: string;
    plantName: string;
    plantId: string;
  } | null>(null);

  useEffect(() => {
    if (addFeedback && addFeedback.type !== 'error') {
      const timer = setTimeout(() => {
        setAddFeedback(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [addFeedback]);

  // Dark mode state - default to light mode by default, enable dark mode only if explicitly selected by user
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const [plants, setPlants] = useState<Plant[]>(defaultPlants);
  const [loadingPlants, setLoadingPlants] = useState<boolean>(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  const loadPlantsCatalog = useCallback((spec: UserBalconySpec = userSpec) => {
    setLoadingPlants(true);
    setCatalogError(null);

    return fetchRecommendations(spec)
      .then((data) => {
        setPlants(data);
        setLoadingPlants(false);
      })
      .catch((err: any) => {
        console.error('Failed to fetch recommendations:', err);
        setCatalogError(err.message || 'Wystąpił problem z połączeniem z serwerem bazy upraw.');
        setLoadingPlants(false);
      });
  }, [userSpec]);

  const validatedPlants = useMemo(() => {
    return validatePlantCatalog(plants).validPlants;
  }, [plants]);

  const translatedPlants = useMemo(() => {
    return validatedPlants.map((p) => getTranslatedPlant(p, language));
  }, [validatedPlants, language]);

  const plantSearchIndex = useMemo(() => {
    return new PlantSearchIndex(translatedPlants);
  }, [translatedPlants]);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);

  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const activeSelectedPlant = useMemo(() => {
    return selectedPlant ? getTranslatedPlant(selectedPlant, language) : null;
  }, [selectedPlant, language]);
  const [selectedPotPlant, setSelectedPotPlant] = useState<Plant | null>(null);

  // Filters for recommendations
  const [selectedGroup, setSelectedGroup] = useState<PlantGroup>('wszystkie');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [sortOrder, setSortOrder] = useState<'timing_first' | 'score' | 'difficulty' | 'name'>('timing_first');
  const [timingFilter, setTimingFilter] = useState<'all' | 'good_now' | 'sow_now' | 'transplant_now'>('all');

  // UX & Information Density Controls: Collapsible panels and card detail modes
  const [cardViewMode, setCardViewMode] = useState<'compact' | 'detailed'>('compact');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(true);
  const [showSeasonalityBanner, setShowSeasonalityBanner] = useState<boolean>(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const activeAdvancedFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedGroup !== 'wszystkie') count++;
    if (selectedCategory !== 'Wszystkie') count++;
    if (timingFilter !== 'all') count++;
    if (sortOrder !== 'timing_first') count++;
    return count;
  }, [selectedGroup, selectedCategory, timingFilter, sortOrder]);

  // Load recommendations & weather when userSpec changes
  useEffect(() => {
    let isMounted = true;
    setLoadingPlants(true);
    setCatalogError(null);

    fetchRecommendations(userSpec)
      .then((data) => {
        if (isMounted) {
          setPlants(data);
          setLoadingPlants(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch recommendations:', err);
        if (isMounted) {
          setCatalogError(err.message || 'Nie udało się połączyć z serwerem bazy upraw.');
          setLoadingPlants(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [userSpec]);

  // Load weather
  const loadWeather = () => {
    setWeatherLoading(true);
    fetchWeather(userSpec)
      .then((w) => {
        setWeather(w);
        setWeatherLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch weather:', err);
        setWeatherLoading(false);
      });
  };

  // Check active session & synchronize saved balcony settings on mount
  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (user) {
        setCurrentUser(user);
        if (user.balconySpec) {
          setUserSpec(user.balconySpec);
          saveUserSpec(user.balconySpec, user.id);
        }
        const userCrops = Array.isArray(user.myCrops) ? user.myCrops : [];
        setMyCrops(userCrops);
        saveMyCrops(userCrops, user.id);
      } else {
        // Unauthenticated visitor / guest mode
        setCurrentUser(null);
        const guestSpec = loadSavedSpec();
        setUserSpec(guestSpec);
        const guestCrops = loadSavedMyCrops();
        setMyCrops(guestCrops);
      }
    });
  }, []);

  // Dismiss account notification toast
  useEffect(() => {
    if (accountToast) {
      const timer = setTimeout(() => setAccountToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [accountToast]);

  useEffect(() => {
    loadWeather();
  }, [userSpec.region, userSpec.floor, userSpec.orientation]);

  // Handle saving new balcony spec
  const handleSaveSpec = (newSpec: UserBalconySpec) => {
    setUserSpec(newSpec);
    saveUserSpec(newSpec, currentUser?.id);
    setIsSetupModalOpen(false);

    if (currentUser) {
      saveBalconyToAccount(newSpec, myCrops).then((res) => {
        if (res.user) {
          setCurrentUser(res.user);
        }
        setAccountToast({
          message: isEn
            ? `Balcony settings assigned to your account (${currentUser.username})!`
            : `Ustawienia balkonu zostały przypisane do Twojego konta (${currentUser.username})!`,
          type: 'success',
        });
      });
    } else {
      setAccountToast({
        message: isEn
          ? 'Balcony parameters saved in guest mode. Register an account to persist them.'
          : 'Parametry balkonu zapisane w trybie gościa. Zarejestruj konto, aby zapisać je na stałe.',
        type: 'info',
      });
    }
  };

  const handleAuthSuccess = (user: UserAccount, message: string) => {
    setCurrentUser(user);
    const spec = user.balconySpec || DEFAULT_BALCONY_SPEC;
    setUserSpec(spec);
    saveUserSpec(spec, user.id);

    const crops = Array.isArray(user.myCrops) ? user.myCrops : [];
    setMyCrops(crops);
    saveMyCrops(crops, user.id);

    setAccountToast({
      message:
        message ||
        (isEn
          ? `Welcome, ${user.username}! Your crops and balcony specs have been loaded.`
          : `Witaj, ${user.username}! Twoje uprawy i specyfikacja balkonu zostały wczytane.`),
      type: 'success',
    });
  };

  const handleWelcomeContinueAsGuest = () => {
    setWelcomeSeen();
    setIsWelcomeModalOpen(false);
    if (!hasUserOnboarded()) {
      setIsSetupModalOpen(true);
    }
  };

  const handleWelcomeAuthSuccess = (user: UserAccount, message: string) => {
    setWelcomeSeen();
    setIsWelcomeModalOpen(false);
    handleAuthSuccess(user, message);
    if (!hasUserOnboarded(user.id)) {
      setIsSetupModalOpen(true);
    }
  };

  const handleLogout = async () => {
    const formerName = currentUser?.username;
    await logoutAccount();
    setCurrentUser(null);

    // Reset view to clean guest state
    const cleanGuestSpec = DEFAULT_BALCONY_SPEC;
    setUserSpec(cleanGuestSpec);
    saveUserSpec(cleanGuestSpec, undefined);

    const cleanGuestCrops: MyCropItem[] = [];
    setMyCrops(cleanGuestCrops);
    saveMyCrops(cleanGuestCrops, undefined);

    setAccountToast({
      message: isEn
        ? `Logged out of account ${formerName ? `"${formerName}"` : ''}. You are now in guest mode.`
        : `Wylogowano z konta ${formerName ? `"${formerName}"` : ''}. Jesteś teraz w trybie gościa.`,
      type: 'info',
    });
  };

  // Find plant by id (used by calendar view to open modal)
  const handleSelectPlantById = (plantId: string) => {
    const found = plants.find((p) => p.id === plantId);
    if (found) {
      setSelectedPlant(found);
    }
  };

  // Open pot calculator with specific plant
  const handleOpenPotCalcForPlant = (plant: Plant) => {
    setSelectedPotPlant(plant);
    setActiveTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // My Crops operations
  const handleAddCropWithVariety = (
    plantId: string,
    varietyName: string,
    varietyBadge: string,
    potCount: number = 1,
    openConfigurator: boolean = false,
    inGreenhouse?: boolean
  ) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    const reqs = targetPlant ? getEffectivePlantRequirements(targetPlant, varietyName) : null;
    const initialVolume = reqs?.minVolumeL || targetPlant?.pot.min_volume_l || 10;

    const newCropItem: MyCropItem = {
      id: `${plantId}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      plantId,
      selectedVariety: varietyName,
      varietyBadge: varietyBadge || 'Odmiana donicowa',
      potCount: Math.max(1, potCount),
      inGreenhouse: inGreenhouse ?? false,
      addedAt: new Date().toISOString(),
      stage: 'rosnie' as const,
      pot: {
        potType: 'okragla',
        diameterOrWidthCm: reqs?.spacingCm || targetPlant?.pot.min_depth_cm || 30,
        depthCm: 25,
        volumeL: initialVolume,
        hasDrainage: true,
        material: 'plastik',
        quantity: Math.max(1, potCount),
        calculationVersion: POT_CALCULATION_VERSION,
      },
      sowing: {
        method: 'nasiona',
        date: new Date().toISOString().split('T')[0],
        sowingLocation: 'balkon_bezposrednio',
      },
    };

    setMyCrops((prev) => {
      const next = [...prev, newCropItem];
      saveMyCrops(next, currentUser?.id);
      if (currentUser) {
        saveBalconyToAccount(userSpec, next);
      }
      return next;
    });

    if (openConfigurator) {
      setActiveTab('my_crops');
    }
  };

  const handleAddCropToBalcony = async (plant: Plant, forceError: boolean = false) => {
    if (pendingPlantAddsRef.current.has(plant.id) || addingPlantId === plant.id) return; // Prevent multiple submissions while pending

    pendingPlantAddsRef.current.add(plant.id);
    setAddingPlantId(plant.id);
    try {
      if (forceError) {
        throw new Error('Simulation of add crop failure');
      }

      await new Promise((resolve) => setTimeout(resolve, 80));

      const isAlreadyInCrops = myCrops.some((c) => c.plantId === plant.id);

      const variety =
        plant.top_varieties?.[0]?.name ||
        (typeof plant.varieties?.[0] === 'string'
          ? plant.varieties[0]
          : plant.varieties?.[0]?.name) ||
        plant.name;
      const varietyBadge = plant.top_varieties?.[0]?.badge || 'Zalecana do donic';

      handleAddCropWithVariety(plant.id, variety, varietyBadge, 1, false);

      setAddFeedback({
        type: isAlreadyInCrops ? 'duplicate' : 'success',
        message: isAlreadyInCrops
          ? `Dodano kolejną doniczkę: ${plant.name}`
          : `Pomyślnie dodano: ${plant.name} do Moich upraw!`,
        plantName: plant.name,
        plantId: plant.id,
      });
    } catch (err) {
      console.error('Error adding crop:', err);
      setAddFeedback({
        type: 'error',
        message: `Nie udało się dodać ${plant.name}. Spróbuj ponownie.`,
        plantName: plant.name,
        plantId: plant.id,
      });
    } finally {
      pendingPlantAddsRef.current.delete(plant.id);
      setAddingPlantId(null);
    }
  };

  const handleToggleMyCrop = (plantId: string) => {
    const targetPlant = plants.find((p) => p.id === plantId);
    if (!targetPlant) return;

    const exists = myCrops.some((c) => c.plantId === plantId);
    if (exists) {
      // Remove all entries of this plant
      handleRemoveCrop(plantId);
    } else {
      // Prompt variety selection
      setVarietyPickerPlant({ plant: targetPlant });
    }
  };

  const handleRemoveCrop = (cropIdOrPlantId: string) => {
    setMyCrops((prev) => {
      const next = prev.filter((c) => c.id !== cropIdOrPlantId && c.plantId !== cropIdOrPlantId);
      saveMyCrops(next, currentUser?.id);
      if (currentUser) {
        saveBalconyToAccount(userSpec, next);
      }
      return next;
    });
  };

  const handleUpdateCrop = (updated: MyCropItem) => {
    setMyCrops((prev) => {
      const next = prev.map((c) => {
        if (c.id && updated.id) {
          return c.id === updated.id ? updated : c;
        }
        return c.plantId === updated.plantId ? updated : c;
      });
      saveMyCrops(next, currentUser?.id);
      if (currentUser) {
        saveBalconyToAccount(userSpec, next);
      }
      return next;
    });
  };

  const myCropIds = useMemo(() => myCrops.map((c) => c.plantId), [myCrops]);

  const myPlants = useMemo(() => {
    return plants.filter((p) => myCropIds.includes(p.id));
  }, [plants, myCropIds]);

  const dailyRecommendation = useMemo(() => {
    return computeDailyRecommendation(weather, userSpec, myPlants, myCrops);
  }, [weather, userSpec, myPlants, myCrops]);

  // Switch plant group (Wszystkie / Warzywa / Owoce / Zioła / Ozdobne)
  const handleGroupChange = (group: PlantGroup) => {
    setSelectedGroup(group);
    setSelectedCategory('Wszystkie');
  };

  // Group-filtered plants
  const groupFilteredPlants = useMemo(() => {
    if (selectedGroup === 'wszystkie') return translatedPlants;
    return translatedPlants.filter((p) => p.plant_group === selectedGroup);
  }, [translatedPlants, selectedGroup]);

  // Counts for each group
  const groupCounts = useMemo(() => {
    return {
      wszystkie: translatedPlants.length,
      warzywa: translatedPlants.filter((p) => p.plant_group === 'warzywa').length,
      owoce: translatedPlants.filter((p) => p.plant_group === 'owoce').length,
      ziola: translatedPlants.filter((p) => p.plant_group === 'ziola').length,
      ozdobne: translatedPlants.filter((p) => p.plant_group === 'ozdobne').length,
      kielki: translatedPlants.filter((p) => p.plant_group === 'kielki').length,
      grzyby: translatedPlants.filter((p) => p.plant_group === 'grzyby').length,
    };
  }, [translatedPlants]);

  // Current real date and calendar period
  const todayDate = useMemo(() => new Date(), []);
  const currentPeriodId = useMemo(() => getCalendarPeriodId(todayDate), [todayDate]);
  const currentPeriodName = useMemo(
    () => getPeriodHumanLabel(currentPeriodId, language === 'en'),
    [currentPeriodId, language]
  );
  const formattedToday = useMemo(() => {
    const day = todayDate.getDate();
    if (language === 'en') {
      const enMonths = [
        '',
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      return `${enMonths[todayDate.getMonth() + 1]} ${day}`;
    }
    const months = [
      '',
      'stycznia',
      'lutego',
      'marca',
      'kwietnia',
      'maja',
      'czerwca',
      'lipca',
      'sierpnia',
      'września',
      'października',
      'listopada',
      'grudnia',
    ];
    return `${day} ${months[todayDate.getMonth() + 1]}`;
  }, [todayDate, language]);

  // Timing statistics for current group
  const timingCounts = useMemo(() => {
    let goodNow = 0;
    let sowNow = 0;
    let transplantNow = 0;
    groupFilteredPlants.forEach((p) => {
      const t = getPlantTimingInfo(p, todayDate);
      if (t.isGoodTimeToPlantNow) goodNow++;
      if (t.status === 'sow_now' || t.status === 'year_round') sowNow++;
      if (t.status === 'transplant_now') transplantNow++;
    });
    return { goodNow, sowNow, transplantNow };
  }, [groupFilteredPlants, todayDate]);

  // User-friendly lifestyle categories list (e.g. "Do sałatki", "Szybko rosnące", "Zero wysiłku")
  const lifestyleFilters = useMemo(() => {
    if (language === 'en') {
      return [
        { id: 'all', label: 'All', icon: '' },
        { id: 'do_salatki', label: 'For salads', icon: '🥗' },
        { id: 'szybko_rosnace', label: 'Fast growing', icon: '⚡' },
        { id: 'zero_wysilku', label: 'Zero effort', icon: '✨' },
        { id: 'slodkie_zbiory', label: 'Sweet harvest', icon: '🍓' },
        { id: 'aromatyczne', label: 'Aromatic herbs', icon: '🌿' },
        { id: 'kompaktowa', label: 'Compact pots', icon: '🪴' },
        { id: 'superfood', label: 'Superfood', icon: '💪' },
        { id: 'piekne_kwiaty', label: 'Beautiful flowers', icon: '🌸' },
        { id: 'dla_poczatkujacych', label: 'Beginner friendly', icon: '🌱' },
      ];
    }
    return [
      { id: 'all', label: 'Wszystkie', icon: '' },
      { id: 'do_salatki', label: 'Do sałatki', icon: '🥗' },
      { id: 'szybko_rosnace', label: 'Szybko rosnące', icon: '⚡' },
      { id: 'zero_wysilku', label: 'Zero wysiłku', icon: '✨' },
      { id: 'slodkie_zbiory', label: 'Słodkie zbiory', icon: '🍓' },
      { id: 'aromatyczne', label: 'Aromatyczne zioła', icon: '🌿' },
      { id: 'kompaktowa', label: 'Kompaktowe donice', icon: '🪴' },
      { id: 'superfood', label: 'Superfood', icon: '💪' },
      { id: 'piekne_kwiaty', label: 'Piękne kwiaty', icon: '🌸' },
      { id: 'dla_poczatkujacych', label: 'Dla początkujących', icon: '🌱' },
    ];
  }, [language]);

  // Filtered & Sorted recommendations
  const filteredPlants = useMemo(() => {
    const isSearchActive = searchQuery.trim().length > 0;

    if (isSearchActive) {
      // Use PlantSearchIndex which guarantees exact query matching,
      // case-insensitive and partial search, and strictly returns [] when no results
      // (preventing unrelated fallback cards from displaying).
      return plantSearchIndex.search(searchQuery, {
        group: selectedGroup,
        category: selectedCategory,
        timingFilter,
        todayDate,
      });
    }

    return groupFilteredPlants
      .filter((p) => {
        const plantPills = getPlantLifestylePills(p, language);
        const matchesCategory =
          selectedCategory === 'Wszystkie' ||
          selectedCategory === 'all' ||
          p.category === selectedCategory ||
          plantPills.some(
            (pill) => pill.id === selectedCategory || pill.label === selectedCategory
          );

        if (!matchesCategory) return false;

        const timing = getPlantTimingInfo(p, todayDate);

        if (timingFilter === 'good_now') {
          return timing.isGoodTimeToPlantNow;
        }
        if (timingFilter === 'sow_now') {
          return timing.status === 'sow_now' || timing.status === 'year_round';
        }
        if (timingFilter === 'transplant_now') {
          return timing.status === 'transplant_now';
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'timing_first') {
          const timingA = getPlantTimingInfo(a, todayDate);
          const timingB = getPlantTimingInfo(b, todayDate);
          if (timingA.isGoodTimeToPlantNow && !timingB.isGoodTimeToPlantNow) return -1;
          if (!timingA.isGoodTimeToPlantNow && timingB.isGoodTimeToPlantNow) return 1;
          return (b.suitability?.score ?? 0) - (a.suitability?.score ?? 0);
        }
        if (sortOrder === 'score') {
          return (b.suitability?.score ?? 0) - (a.suitability?.score ?? 0);
        }
        if (sortOrder === 'difficulty') {
          return a.difficulty - b.difficulty;
        }
        const nameA = getTranslatedPlant(a, language).name;
        const nameB = getTranslatedPlant(b, language).name;
        return nameA.localeCompare(nameB);
      });
  }, [plantSearchIndex, groupFilteredPlants, searchQuery, selectedCategory, selectedGroup, timingFilter, sortOrder, todayDate, language]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 to-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors relative overflow-x-hidden"><div className="absolute top-0 right-0 -mr-32 -mt-32 w-[32rem] h-[32rem] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl opacity-60 pointer-events-none" /><div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-[40rem] h-[40rem] bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userSpec={userSpec}
        onOpenSetup={() => setIsSetupModalOpen(true)}
        onOpenBalconyDrawer={() => setIsBalconyDrawerOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        myCropsCount={myCrops.length}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthModalTab('login');
          setIsAuthModalOpen(true);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenWelcome={() => setIsWelcomeModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Weather & Soil Watering Status Bar */}
        <WeatherWidget
          weather={weather}
          loading={weatherLoading}
          userSpec={userSpec}
          onRefresh={loadWeather}
        />

        {/* Tab 1: Moje uprawy & Indywidualny kalendarz & Dzienna rekomendacja */}
        {activeTab === 'my_crops' && (
          <MyCropsView
            myCrops={myCrops}
            allPlants={translatedPlants}
            weather={weather}
            userSpec={userSpec}
            dailyRecommendation={dailyRecommendation}
            currentUser={currentUser}
            isLoading={loadingPlants && plants.length === 0}
            error={catalogError && plants.length === 0 ? catalogError : null}
            onRetry={() => loadPlantsCatalog(userSpec)}
            onRemoveCrop={handleRemoveCrop}
            onUpdateCrop={handleUpdateCrop}
            onAddCropWithVariety={handleAddCropWithVariety}
            onSelectPlant={setSelectedPlant}
            onOpenPotCalc={handleOpenPotCalcForPlant}
            onNavigateToSearch={() => setActiveTab('search_crops')}
            onSwitchToFullCalendar={() => setActiveTab('calendar')}
          />
        )}

        {/* Tab 2: Szukaj nowych upraw (pełna baza wiedzy) */}
        {activeTab === 'search_crops' && (
          <div className="space-y-6">
            {/* 1. Primary Catalog Search Control (Prominent at top of catalog, uncluttered) */}
            <div
              data-testid="catalog-search-card"
              className="bg-white dark:bg-stone-900 rounded-[2rem] p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label
                  htmlFor="search-vegetables-input"
                  data-testid="catalog-search-label"
                  className="block text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100"
                >
                  {isEn ? 'Search Container Crop Catalog' : 'Szukaj w katalogu upraw'}
                </label>

                {/* Clearly labeled control to reveal/hide advanced filters (Req 6) */}
                <button
                  id="toggle-advanced-filters-btn"
                  data-testid="toggle-advanced-filters-btn"
                  type="button"
                  aria-expanded={showAdvancedFilters}
                  aria-controls="advanced-filters-panel"
                  onClick={() => setShowAdvancedFilters((prev) => !prev)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between sm:justify-start gap-2 cursor-pointer border focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
                    showAdvancedFilters || activeAdvancedFiltersCount > 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                      : 'bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-750'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>
                      {showAdvancedFilters
                        ? isEn
                          ? 'Hide advanced filters'
                          : 'Ukryj filtry zaawansowane'
                        : isEn
                        ? 'Advanced filters'
                        : 'Filtry zaawansowane'}
                    </span>
                  </div>
                  {activeAdvancedFiltersCount > 0 && (
                    <span
                      data-testid="active-filters-count-badge"
                      className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-700 text-white"
                    >
                      {activeAdvancedFiltersCount}
                    </span>
                  )}
                  {showAdvancedFilters ? (
                    <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>
              </div>

              <div className="relative">
                <label
                  htmlFor="search-vegetables-input"
                  id="plant-search-label"
                  className="sr-only"
                >
                  {isEn ? 'Search plant or variety' : 'Szukaj rośliny lub odmiany'}
                </label>
                <Search className="w-5 h-5 text-stone-500 dark:text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="search-vegetables-input"
                  name="plant-search"
                  data-testid="plant-search-input"
                  data-alias-testid="catalog-search-input"
                  type="search"
                  role="searchbox"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                    }
                  }}
                  placeholder={
                    isEn
                      ? 'Search plant or variety (e.g. tomato, Vilma, radish, basil)...'
                      : 'Szukaj rośliny lub odmiany (np. pomidor, Vilma, rzodkiewka, bazylia)...'
                  }
                  className="w-full pl-11 pr-28 py-3 sm:py-3.5 text-sm sm:text-base rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 placeholder-stone-500 dark:placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-400 transition shadow-inner"
                />

                {searchQuery && (
                  <button
                    id="clear-search-btn"
                    data-testid="clear-search-btn"
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      document.getElementById('search-vegetables-input')?.focus();
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] px-3 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white bg-stone-200/90 dark:bg-stone-700/90 hover:bg-stone-300 dark:hover:bg-stone-600 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400"
                    aria-label={isEn ? 'Clear search' : 'Wyczyść wyszukiwanie'}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isEn ? 'Clear' : 'Wyczyść'}</span>
                  </button>
                )}
              </div>

              {/* Result count and query context after searching */}
              {searchQuery.trim() && (
                <div
                  data-testid="search-results-context"
                  className="flex items-center justify-between text-xs sm:text-sm text-stone-700 dark:text-stone-300 bg-emerald-50/80 dark:bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                      {isEn ? `Results for query "${searchQuery}":` : `Wyniki dla zapytania „${searchQuery}”:`}
                    </span>
                    <span data-testid="search-results-count" className="font-bold text-stone-900 dark:text-stone-100">
                      {filteredPlants.length}{' '}
                      {isEn
                        ? filteredPlants.length === 1 ? 'plant' : 'plants'
                        : filteredPlants.length === 1
                        ? 'roślina'
                        : filteredPlants.length % 10 >= 2 &&
                          filteredPlants.length % 10 <= 4 &&
                          (filteredPlants.length < 10 || filteredPlants.length > 20)
                        ? 'rośliny'
                        : 'roślin'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-200 font-semibold text-xs cursor-pointer hover:underline"
                  >
                    {isEn ? 'Show all plants' : 'Pokaż wszystkie rośliny'}
                  </button>
                </div>
              )}

              {/* Active Filters Summary (Visible when advanced filters are collapsed) */}
              {!showAdvancedFilters && activeAdvancedFiltersCount > 0 && (
                <div
                  data-testid="active-filters-summary"
                  className="flex items-center gap-2 flex-wrap pt-1 text-xs"
                >
                  <span className="font-semibold text-stone-500 dark:text-stone-400 text-[11px] uppercase tracking-wider">
                    {isEn ? 'Active filters:' : 'Aktywne filtry:'}
                  </span>
                  {selectedGroup !== 'wszystkie' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-medium">
                      <span>{isEn ? 'Group: ' : 'Grupa: '}{selectedGroup}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedGroup('wszystkie')}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                        title={isEn ? 'Remove filter' : 'Usuń filtr'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {timingFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-medium">
                      <span>{isEn ? 'Timing: ' : 'Termin: '}{timingFilter === 'good_now' ? (isEn ? 'Good now' : 'Teraz') : timingFilter}</span>
                      <button
                        type="button"
                        onClick={() => setTimingFilter('all')}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                        title={isEn ? 'Remove filter' : 'Usuń filtr'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'Wszystkie' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-medium">
                      <span>{isEn ? 'Category: ' : 'Kategoria: '}{selectedCategory}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('Wszystkie')}
                        className="hover:text-rose-600 cursor-pointer ml-0.5"
                        title={isEn ? 'Remove filter' : 'Usuń filtr'}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    type="button"
                    data-testid="quick-reset-filters-btn"
                    onClick={() => {
                      setSelectedGroup('wszystkie');
                      setTimingFilter('all');
                      setSelectedCategory('Wszystkie');
                      setSortOrder('timing_first');
                    }}
                    className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer text-xs ml-1"
                  >
                    {isEn ? 'Reset all' : 'Resetuj wszystkie'}
                  </button>
                </div>
              )}
            </div>

            {/* Feedback / Toast Confirmation Banner for Add Crop */}
            {addFeedback && (
              <div
                role="status"
                aria-live="polite"
                data-testid="add-crop-feedback-banner"
                className={`p-4 rounded-2xl flex items-center justify-between gap-3 shadow-md transition-all ${
                  addFeedback.type === 'error'
                    ? 'bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                    : addFeedback.type === 'duplicate'
                    ? 'bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                    : 'bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {addFeedback.type === 'error' ? '⚠️' : '✓'}
                  </span>
                  <div>
                    <p className="text-sm font-bold" data-testid="add-crop-feedback-message">
                      {addFeedback.message}
                    </p>
                    <p className="text-xs opacity-80">
                      {isEn
                        ? 'Updated in "My Crops" tab without page reload.'
                        : 'Zaktualizowano w zakładce „Moje uprawy” bez przeładowywania strony.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {addFeedback.type === 'error' ? (
                    <button
                      data-testid="add-crop-retry-btn"
                      onClick={() => {
                        const p = plants.find((x) => x.id === addFeedback.plantId);
                        if (p) handleAddCropToBalcony(p);
                      }}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
                    >
                      {isEn ? 'Retry' : 'Spróbuj ponownie'}
                    </button>
                  ) : (
                    <button
                      data-testid="go-to-my-crops-btn"
                      onClick={() => setActiveTab('my_crops')}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{isEn ? `My Crops (${myCrops.length})` : `Moje uprawy (${myCrops.length})`}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    data-testid="close-feedback-btn"
                    onClick={() => setAddFeedback(null)}
                    className="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                    aria-label={isEn ? 'Close message' : 'Zamknij komunikat'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Quick Bar */}
            <div className="bg-white dark:bg-stone-900 rounded-[2rem] p-4 sm:p-5 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Catalog: Discover New Container Crops' : 'Katalog: Szukaj nowych upraw do donic'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {isEn
                      ? 'Click "+ Add to My Crops" next to any plant to transfer it to your personal schedule.'
                      : 'Kliknij przycisk „+ Dodaj do Moich upraw” przy dowolnej roślinie, aby przenieść ją do osobistego terminarza.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('my_crops')}
                  className="flex-1 sm:flex-none px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sprout className="w-4 h-4" />
                  <span>{isEn ? `Go to My Crops (${myCrops.length})` : `Przejdź do Moich upraw (${myCrops.length})`}</span>
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isEn ? 'Full calendar' : 'Pełny kalendarz'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                </button>
              </div>
            </div>

            {/* Banner & Filter Bar - Hidden behind labeled control (Req 6) */}
            {showAdvancedFilters && (
              <div
                id="advanced-filters-panel"
                data-testid="advanced-filters-panel"
                className="bg-white dark:bg-stone-900 rounded-[2rem] p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? 'Tailored to your balcony' : 'Dopasowane do Twojego balkonu'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
                    {selectedGroup === 'wszystkie' && (isEn ? 'All container crop recommendations' : 'Wszystkie rekomendacje do uprawy w donicach')}
                    {selectedGroup === 'warzywa' && (isEn ? 'Vegetables in balcony pots' : 'Warzywa w donicach na balkonie')}
                    {selectedGroup === 'owoce' && (isEn ? 'Fruits in balcony pots' : 'Owoce w donicach na balkonie')}
                    {selectedGroup === 'ziola' && (isEn ? 'Fresh herbs in balcony pots' : 'Świeże zioła w donicach na balkonie')}
                    {selectedGroup === 'ozdobne' && (isEn ? 'Flowers and ornamentals in balcony pots' : 'Rośliny ozdobne i kwiaty w donicach na balkonie')}
                    {selectedGroup === 'kielki' && (isEn ? 'Microgreens and sprouts in containers' : 'Mikrolistki i kiełki w pojemnikach')}
                    {selectedGroup === 'grzyby' && (isEn ? 'Cultivated mushrooms in containers' : 'Grzyby uprawne w pojemnikach')}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
                    {isEn ? (
                      <>
                        Every crop has been tailored to your exposure (
                        <strong className="text-stone-800 dark:text-stone-200">{userSpec.orientation}</strong>), floor (
                        <strong className="text-stone-800 dark:text-stone-200">{getFloorCategoryLabel(userSpec.floor)}</strong>),
                        pot sizes, and hardiness zone of region{' '}
                        <strong className="text-stone-800 dark:text-stone-200">
                          {POLAND_REGIONS[userSpec.region]?.name.split('(')[0]}
                        </strong>.
                      </>
                    ) : (
                      <>
                        Każda uprawa została przeliczona pod kątem Twojej ekspozycji (
                        <strong className="text-stone-800 dark:text-stone-200">{userSpec.orientation}</strong>), piętra (
                        <strong className="text-stone-800 dark:text-stone-200">{getFloorCategoryLabel(userSpec.floor)}</strong>),
                        wielkości donic oraz strefy mrozowej regionu{' '}
                        <strong className="text-stone-800 dark:text-stone-200">
                          {POLAND_REGIONS[userSpec.region]?.name.split('(')[0]}
                        </strong>.
                      </>
                    )}
                  </p>
                </div>

                {/* Quick stats & Collapse Filter Button */}
                <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                  <div className="flex items-center gap-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 p-2.5 sm:p-3 rounded-2xl">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                      {groupFilteredPlants.filter((p) => (p.suitability?.score ?? 0) >= 80).length}
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-emerald-950 dark:text-emerald-200">
                        {isEn ? 'Confirmed as optimal' : 'Potwierdzone jako optymalne'}
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 text-[11px]">
                        {isEn ? '>80% container match' : '>80% dopasowania do donic'}
                      </div>
                    </div>
                  </div>

                  <button
                    id="toggle-filters-expansion-btn"
                    type="button"
                    onClick={() => setIsFiltersExpanded((prev) => !prev)}
                    className="p-2 sm:px-3 sm:py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title={isFiltersExpanded ? (isEn ? 'Collapse plant group panels' : 'Zwiń panele grup roślin') : (isEn ? 'Show full plant group panels' : 'Pokaż pełne panele grup roślin')}
                  >
                    <span className="hidden sm:inline">{isFiltersExpanded ? (isEn ? 'Collapse groups' : 'Zwiń grupy') : (isEn ? 'Expand groups' : 'Rozwiń grupy')}</span>
                    {isFiltersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Compact Group Pills when filter panel is collapsed */}
              {!isFiltersExpanded && (
                <div className="mt-4 pt-3 border-t border-stone-150 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                    {isEn ? 'Group:' : 'Grupa:'}
                  </span>
                  {[
                    { id: 'wszystkie', label: isEn ? 'All' : 'Wszystkie', icon: '🪴', count: groupCounts.wszystkie },
                    { id: 'warzywa', label: isEn ? 'Vegetables' : 'Warzywa', icon: '🥕', count: groupCounts.warzywa },
                    { id: 'owoce', label: isEn ? 'Fruits' : 'Owoce', icon: '🍓', count: groupCounts.owoce },
                    { id: 'ziola', label: isEn ? 'Herbs' : 'Zioła', icon: '🌿', count: groupCounts.ziola },
                    { id: 'ozdobne', label: isEn ? 'Flowers' : 'Ozdobne', icon: '🌸', count: groupCounts.ozdobne },
                    { id: 'kielki', label: isEn ? 'Sprouts' : 'Kiełki', icon: '🌱', count: groupCounts.kielki },
                    { id: 'grzyby', label: isEn ? 'Mushrooms' : 'Grzyby', icon: '🍄', count: groupCounts.grzyby },
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleGroupChange(g.id as PlantGroup)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition text-xs cursor-pointer flex items-center gap-1.5 ${
                        selectedGroup === g.id
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      <span>{g.icon}</span>
                      <span>{g.label}</span>
                      <span className="text-[10px] opacity-75 font-normal">({g.count})</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Jasny podział na grupy roślin (Full expanded view) */}
              {isFiltersExpanded && (
                <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2.5">
                    {isEn ? 'Select plant group:' : 'Wybierz grupę roślin:'}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
                    {/* Wszystkie */}
                    <button
                      id="group-filter-wszystkie"
                      onClick={() => handleGroupChange('wszystkie')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'wszystkie'
                          ? 'bg-stone-900 text-white border-stone-900 dark:bg-stone-100 dark:text-stone-900 dark:border-stone-100 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🪴</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'wszystkie'
                              ? 'bg-stone-800 dark:bg-stone-200 text-stone-200 dark:text-stone-800'
                              : 'bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-600'
                          }`}
                        >
                          {groupCounts.wszystkie}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'All' : 'Wszystkie'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'wszystkie'
                              ? 'text-stone-300 dark:text-stone-600'
                              : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Full container database' : 'Pełna baza donicowa'}
                        </div>
                      </div>
                    </button>

                    {/* Warzywa - Indigo theme */}
                    <button
                      id="group-filter-warzywa"
                      onClick={() => handleGroupChange('warzywa')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'warzywa'
                          ? 'bg-indigo-900 text-white border-indigo-900 shadow-sm ring-2 ring-indigo-500/30'
                          : 'bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-950 dark:text-indigo-200 border-indigo-200/80 dark:border-indigo-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🥕</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'warzywa'
                              ? 'bg-indigo-950 text-indigo-100'
                              : 'bg-white dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700'
                          }`}
                        >
                          {groupCounts.warzywa}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'Vegetables' : 'Warzywa'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'warzywa' ? 'text-indigo-200' : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Tomatoes, peppers, lettuces...' : 'Pomidory, papryki, sałaty...'}
                        </div>
                      </div>
                    </button>

                    {/* Owoce - Fuchsia theme */}
                    <button
                      id="group-filter-owoce"
                      onClick={() => handleGroupChange('owoce')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'owoce'
                          ? 'bg-fuchsia-900 text-white border-fuchsia-900 shadow-sm ring-2 ring-fuchsia-500/30'
                          : 'bg-fuchsia-50/50 dark:bg-fuchsia-950/30 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-950/50 text-fuchsia-950 dark:text-fuchsia-200 border-fuchsia-200/80 dark:border-fuchsia-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🍓</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'owoce'
                              ? 'bg-fuchsia-950 text-fuchsia-100'
                              : 'bg-white dark:bg-fuchsia-900/60 text-fuchsia-900 dark:text-fuchsia-200 border border-fuchsia-200 dark:border-fuchsia-700'
                          }`}
                        >
                          {groupCounts.owoce}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'Fruits' : 'Owoce'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'owoce' ? 'text-fuchsia-200' : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Strawberries, berries, raspberries...' : 'Truskawki, borówki, maliny...'}
                        </div>
                      </div>
                    </button>

                    {/* Zioła - Teal theme */}
                    <button
                      id="group-filter-ziola"
                      onClick={() => handleGroupChange('ziola')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'ziola'
                          ? 'bg-teal-900 text-white border-teal-900 shadow-sm ring-2 ring-teal-500/30'
                          : 'bg-teal-50/50 dark:bg-teal-950/30 hover:bg-teal-50 dark:hover:bg-teal-950/50 text-teal-950 dark:text-teal-200 border-teal-200/80 dark:border-teal-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🌿</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'ziola'
                              ? 'bg-teal-950 text-teal-100'
                              : 'bg-white dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 border border-teal-200 dark:border-teal-700'
                          }`}
                        >
                          {groupCounts.ziola}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'Herbs' : 'Zioła'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'ziola' ? 'text-teal-200' : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Basil, mint, thyme...' : 'Bazylia, mięta, tymianek...'}
                        </div>
                      </div>
                    </button>

                    {/* Ozdobne - Violet theme */}
                    <button
                      id="group-filter-ozdobne"
                      onClick={() => handleGroupChange('ozdobne')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'ozdobne'
                          ? 'bg-violet-900 text-white border-violet-900 shadow-sm ring-2 ring-violet-500/30'
                          : 'bg-violet-50/50 dark:bg-violet-950/30 hover:bg-violet-50 dark:hover:bg-violet-950/50 text-violet-950 dark:text-violet-200 border-violet-200/80 dark:border-violet-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🌸</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'ozdobne'
                              ? 'bg-violet-950 text-violet-100'
                              : 'bg-white dark:bg-violet-900/60 text-violet-900 dark:text-violet-200 border border-violet-200 dark:border-violet-700'
                          }`}
                        >
                          {groupCounts.ozdobne}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'Flowers' : 'Ozdobne'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'ozdobne' ? 'text-violet-200' : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Geraniums, lavender, pansies...' : 'Pelargonie, lawenda, bratki...'}
                        </div>
                      </div>
                    </button>

                    {/* Kiełki - Sky theme */}
                    <button
                      id="group-filter-kielki"
                      onClick={() => handleGroupChange('kielki')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'kielki'
                          ? 'bg-sky-900 text-white border-sky-900 shadow-sm ring-2 ring-sky-500/30'
                          : 'bg-sky-50/50 dark:bg-sky-950/30 hover:bg-sky-50 dark:hover:bg-sky-950/50 text-sky-950 dark:text-sky-200 border-sky-200/80 dark:border-sky-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🌱</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'kielki'
                              ? 'bg-sky-950 text-sky-100'
                              : 'bg-white dark:bg-sky-900/60 text-sky-900 dark:text-sky-200 border border-sky-200 dark:border-sky-700'
                          }`}
                        >
                          {groupCounts.kielki}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'Microgreens & Sprouts' : 'Mikrolistki i kiełki'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'kielki' ? 'text-sky-200' : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Cress, radish, sunflower...' : 'Rzeżucha, rzodkiewka, słonecznik...'}
                        </div>
                      </div>
                    </button>

                    {/* Grzyby - Stone/Amber theme */}
                    <button
                      id="group-filter-grzyby"
                      onClick={() => handleGroupChange('grzyby')}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selectedGroup === 'grzyby'
                          ? 'bg-stone-800 text-white border-stone-800 dark:bg-stone-200 dark:text-stone-900 dark:border-stone-200 shadow-sm'
                          : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">🍄</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            selectedGroup === 'grzyby'
                              ? 'bg-stone-900 dark:bg-stone-300 text-stone-100 dark:text-stone-900'
                              : 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-600'
                          }`}
                        >
                          {groupCounts.grzyby}
                        </span>
                      </div>
                      <div className="mt-2.5">
                        <div className="font-bold text-sm">{isEn ? 'Mushrooms' : 'Grzyby uprawne'}</div>
                        <div
                          className={`text-[11px] ${
                            selectedGroup === 'grzyby'
                              ? 'text-stone-300 dark:text-stone-600'
                              : 'text-stone-500 dark:text-stone-400'
                          }`}
                        >
                          {isEn ? 'Oyster, button, lion\'s mane...' : 'Boczniaki, pieczarki, soplówka...'}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Seasonality Advice Banner for Current Date */}
              {showSeasonalityBanner && (
                <div className="mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-900/90 via-emerald-950 to-stone-900 text-white border border-emerald-800/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-800/80 text-emerald-100 flex items-center justify-center shrink-0 border border-emerald-700/60 text-lg">
                      📅
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-emerald-100">
                          {isEn ? `Current timing: ${formattedToday}` : `Bieżący termin: ${formattedToday}`}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-200 border border-emerald-700">
                          {currentPeriodName}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-200/80 mt-0.5 truncate">
                        {isEn ? (
                          <>For <strong>{timingCounts.goodNow}</strong> {timingCounts.goodNow === 1 ? 'crop' : 'crops'} in this category now is the ideal time!</>
                        ) : (
                          <>Dla <strong>{timingCounts.goodNow}</strong> {timingCounts.goodNow === 1 ? 'uprawy' : 'upraw'} w tej kategorii przypada teraz idealny termin!</>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {timingFilter !== 'good_now' ? (
                      <button
                        id="filter-good-timing-btn"
                        onClick={() => setTimingFilter('good_now')}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs rounded-xl transition shadow-2xs cursor-pointer flex items-center gap-1.5"
                      >
                        <Sprout className="w-3.5 h-3.5" />
                        <span>{isEn ? `Filter favorable now (${timingCounts.goodNow})` : `Filtruj termin teraz (${timingCounts.goodNow})`}</span>
                      </button>
                    ) : (
                      <button
                        id="reset-timing-filter-btn"
                        onClick={() => setTimingFilter('all')}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-xl transition cursor-pointer"
                      >
                        {isEn ? 'Show all' : 'Pokaż wszystkie'}
                      </button>
                    )}

                    <button
                      onClick={() => setShowSeasonalityBanner(false)}
                      title={isEn ? 'Hide this banner' : 'Ukryj ten baner'}
                      className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/50 transition cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Sort and Card View Mode Controls */}
              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  {isEn ? (
                    <>Displaying <strong>{filteredPlants.length}</strong> available crops</>
                  ) : (
                    <>Wyświetlanie <strong>{filteredPlants.length}</strong> upraw w katalogu</>
                  )}
                </div>

                {/* Right controls: View mode selector & Sort dropdown */}
                <div className="flex items-center gap-2.5 flex-wrap self-end sm:self-auto">
                  {/* View Mode Toggle: Compact vs Detailed */}
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700">
                    <button
                      id="view-mode-compact-btn"
                      type="button"
                      onClick={() => setCardViewMode('compact')}
                      className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                        cardViewMode === 'compact'
                          ? 'bg-white dark:bg-stone-700 text-emerald-950 dark:text-emerald-100 shadow-2xs font-bold border border-emerald-400/50'
                          : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                      }`}
                      title={isEn ? 'Concise card view with expandable sections' : 'Przyjazny zwięzły widok kafelków z możliwością rozwijania każdego z osobna'}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>{isEn ? '🌿 Compact' : '🌿 Zwięzły'}</span>
                    </button>
                    <button
                      id="view-mode-detailed-btn"
                      type="button"
                      onClick={() => setCardViewMode('detailed')}
                      className={`min-h-[44px] px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                        cardViewMode === 'detailed'
                          ? 'bg-white dark:bg-stone-700 text-emerald-950 dark:text-emerald-100 shadow-2xs font-bold border border-emerald-400/50'
                          : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                      }`}
                      title={isEn ? 'Detailed analytical view with all parameters visible' : 'Szczegółowy widok analityczny ze wszystkimi tabelami i wytycznymi na wierzchu'}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>{isEn ? '📋 Detailed' : '📋 Szczegółowy'}</span>
                    </button>
                  </div>

                  {/* Sort selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <label htmlFor="sort-plants-select" className="text-stone-700 dark:text-stone-300 font-bold hidden sm:inline">
                      {isEn ? 'Sort:' : 'Sortuj:'}
                    </label>
                    <select
                      id="sort-plants-select"
                      aria-label={isEn ? 'Sort crops' : 'Sortuj uprawy'}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="min-h-[44px] text-xs p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700 dark:focus:ring-emerald-400"
                    >
                      <option value="timing_first">{isEn ? '🌱 Best timing now' : '🌱 Najlepszy termin teraz'}</option>
                      <option value="score">{isEn ? 'Balcony match (%)' : 'Dopasowanie (%)'}</option>
                      <option value="difficulty">{isEn ? 'Container difficulty' : 'Trudność w donicy'}</option>
                      <option value="name">{isEn ? 'Alphabetical (A-Z)' : 'Alfabetycznie (A-Z)'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seasonality Quick Filters */}
              <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 text-xs">
                <span className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Timing (today):' : 'Termin (dziś):'}</span>
                </span>

                <button
                  id="timing-filter-all"
                  onClick={() => setTimingFilter('all')}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition text-xs cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                    timingFilter === 'all'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {isEn ? 'All timing' : 'Wszystkie terminy'}
                </button>

                <button
                  id="timing-filter-good_now"
                  onClick={() => setTimingFilter('good_now')}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition text-xs cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                    timingFilter === 'good_now'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs ring-1 ring-emerald-600'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-100'
                  }`}
                >
                  <span>🌱</span>
                  <span>{isEn ? `Good timing now (${timingCounts.goodNow})` : `Dobry termin teraz (${timingCounts.goodNow})`}</span>
                </button>

                <button
                  id="timing-filter-sow_now"
                  onClick={() => setTimingFilter('sow_now')}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition text-xs cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                    timingFilter === 'sow_now'
                      ? 'bg-emerald-700 text-white font-bold shadow-xs ring-1 ring-emerald-600'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  <span>🌾</span>
                  <span>{isEn ? `Sow now / Year-round (${timingCounts.sowNow})` : `Siew teraz / całoroczne (${timingCounts.sowNow})`}</span>
                </button>

                {timingCounts.transplantNow > 0 && (
                  <button
                    id="timing-filter-transplant_now"
                    onClick={() => setTimingFilter('transplant_now')}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition text-xs cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 dark:focus-visible:ring-emerald-400 ${
                      timingFilter === 'transplant_now'
                        ? 'bg-amber-700 text-white font-bold shadow-xs'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                    }`}
                  >
                    <span>🪴</span>
                    <span>{isEn ? `Plant to balcony (${timingCounts.transplantNow})` : `Sadzenie na balkon (${timingCounts.transplantNow})`}</span>
                  </button>
                )}
              </div>

              {/* Friendly Lifestyle Needs Pills (Replaces dry botanical families) */}
              <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-xs border-t border-stone-150 dark:border-stone-800/70 pt-2.5 scrollbar-none">
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 mr-1">
                  {isEn ? 'Lifestyle:' : 'Potrzeba:'}
                </span>
                {lifestyleFilters.map((cat) => {
                  const isActive =
                    selectedCategory === cat.id ||
                    (selectedCategory === 'Wszystkie' && cat.id === 'all') ||
                    selectedCategory === cat.label;
                  return (
                    <button
                      key={cat.id}
                      id={`category-filter-${cat.id}`}
                      onClick={() => setSelectedCategory(cat.id === 'all' ? 'Wszystkie' : cat.id)}
                      className={`px-3 py-1 rounded-full whitespace-nowrap transition text-xs cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-700 text-white font-semibold shadow-xs ring-1 ring-emerald-600'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {cat.icon && <span className="text-xs">{cat.icon}</span>}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            {/* Plants Grid & Separate UI States: loading, error, empty, filtered-no-results, success */}
            {loadingPlants ? (
              <CatalogSkeletonGrid
                count={6}
                message={
                  isEn
                    ? 'Recalculating container knowledge base for your balcony...'
                    : 'Przeliczanie bazy wiedzy o donicach dla Twojego balkonu...'
                }
              />
            ) : catalogError ? (
              <div
                role="alert"
                data-testid="catalog-error-state"
                className="bg-white dark:bg-stone-900 rounded-[2rem] border-2 border-rose-300 dark:border-rose-900/80 p-6 sm:p-8 text-center space-y-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                  ⚠️
                </div>
                <div className="space-y-1">
                  <h3
                    data-testid="catalog-error-heading"
                    className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100"
                  >
                    {isEn ? 'Server connection error' : 'Błąd połączenia z serwerem'}
                  </h3>
                  <p
                    data-testid="catalog-error-message"
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed"
                  >
                    {catalogError}
                  </p>
                </div>

                {searchQuery && (
                  <div
                    data-testid="catalog-preserved-query-badge"
                    className="text-xs text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 px-3.5 py-1.5 rounded-xl inline-block border border-stone-200 dark:border-stone-700 font-medium"
                  >
                    {isEn ? `Your search query "${searchQuery}" is preserved.` : `Twoje zapytanie „${searchQuery}” zostało zachowane.`}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                  <button
                    id="catalog-retry-btn"
                    data-testid="catalog-retry-btn"
                    onClick={() => loadPlantsCatalog(userSpec)}
                    className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2 min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? 'Retry' : 'Spróbuj ponownie'}</span>
                  </button>
                  <button
                    data-testid="catalog-use-fallback-btn"
                    onClick={() => {
                      setPlants(defaultPlants);
                      setCatalogError(null);
                    }}
                    className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer min-h-[44px]"
                  >
                    {isEn ? 'Load offline catalog' : 'Wczytaj bazę lokalną'}
                  </button>
                </div>
              </div>
            ) : plants.length === 0 ? (
              <div
                data-testid="catalog-empty-state"
                className="bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 p-8 text-center space-y-4 shadow-sm"
              >
                <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                  🪴
                </div>
                <div className="space-y-1">
                  <h3
                    data-testid="catalog-empty-heading"
                    className="text-lg font-bold text-stone-900 dark:text-stone-100"
                  >
                    {isEn ? 'Plant catalog is empty' : 'Brak roślin w katalogu'}
                  </h3>
                  <p
                    data-testid="catalog-empty-message"
                    className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto"
                  >
                    {isEn
                      ? 'No container plant records are currently available for this balcony.'
                      : 'Brak dostępnych roślin w bazie dla wybranej konfiguracji balkonu.'}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    data-testid="catalog-reload-empty-btn"
                    onClick={() => loadPlantsCatalog(userSpec)}
                    className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer min-h-[44px]"
                  >
                    {isEn ? 'Reload plant database' : 'Załaduj bazę ponownie'}
                  </button>
                </div>
              </div>
            ) : filteredPlants.length === 0 ? (
              <div
                data-testid="catalog-filtered-no-results"
                className="text-center py-16 bg-white dark:bg-stone-900 rounded-[2rem] border border-stone-200 dark:border-stone-800 p-6 space-y-3 shadow-xs"
              >
                <div data-testid="no-results-container">
                  <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <h3
                    data-testid="no-results-heading"
                    className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100"
                  >
                    {searchQuery
                      ? (isEn ? `No search results for "${searchQuery}"` : `Brak wyników wyszukiwania dla „${searchQuery}”`)
                      : (isEn ? 'No items in this category' : 'Brak pozycji w tej kategorii')}
                  </h3>
                  <p
                    data-testid="no-results-message"
                    className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-md mx-auto leading-relaxed"
                  >
                    {searchQuery
                      ? (isEn
                          ? `No plant matches search "${searchQuery}". Check the spelling or reset active filters.`
                          : `Żadna roślina nie spełnia kryteriów wyszukiwania "${searchQuery}". Spróbuj zresetować filtry lub sprawdź pisownię.`)
                      : (isEn
                          ? 'No plants found in selected subcategory. Adjust filters or choose another group.'
                          : 'Brak roślin w wybranej podkategorii. Zmień filtry lub wybierz inną grupę.')}
                  </p>
                  <button
                    id="reset-search-btn"
                    data-testid="reset-search-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Wszystkie');
                      setSelectedGroup('wszystkie');
                      setTimingFilter('all');
                    }}
                    className="mt-4 px-5 py-2.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl text-xs sm:text-sm font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition cursor-pointer min-h-[44px]"
                  >
                    {isEn ? `Show all plants (${plants.length})` : `Pokaż wszystkie rośliny (${plants.length})`}
                  </button>
                </div>
              </div>
            ) : (
              <div
                data-testid="catalog-success-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPlants.map((plant) => {
                  const matchingCrops = myCrops.filter((c) => c.plantId === plant.id);
                  const cropCount = matchingCrops.reduce((acc, c) => acc + (c.potCount || 1), 0);
                  return (
                    <PlantCard
                      key={plant.id}
                      plant={plant}
                      onSelect={setSelectedPlant}
                      onOpenPotCalc={handleOpenPotCalcForPlant}
                      isMyCrop={matchingCrops.length > 0}
                      cropCount={cropCount}
                      onAddCrop={handleAddCropToBalcony}
                      isAdding={addingPlantId === plant.id}
                      onRequestAddVariety={(p) => setVarietyPickerPlant({ plant: p })}
                      onToggleMyCrop={handleToggleMyCrop}
                      forceDetailed={cardViewMode === 'detailed'}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Kalkulator wymiarów donic i szkicownik rozstawy */}
        {activeTab === 'calculator' && (
          <PotCalculator
            plants={translatedPlants}
            initialPlant={selectedPotPlant ? getTranslatedPlant(selectedPotPlant, language) : translatedPlants[0]}
            onSelectPlant={(plant) => setSelectedPlant(plant)}
          />
        )}

        {/* Tab 4: Kalendarz siewu, rozsady i zbiorów */}
        {activeTab === 'calendar' && (
          <CalendarView
            userSpec={userSpec}
            onSelectPlantById={handleSelectPlantById}
            initialMode={myCrops.length > 0 ? 'my_crops' : 'all'}
            myCropIds={myCropIds}
            onNavigateToSearch={() => setActiveTab('search_crops')}
          />
        )}
      </main>

      {/* Detail Modal for Selected Plant */}
      {activeSelectedPlant && (
        <PlantDetailModal
          plant={activeSelectedPlant}
          onClose={() => setSelectedPlant(null)}
          onOpenPotCalc={handleOpenPotCalcForPlant}
          isMyCrop={myCropIds.includes(activeSelectedPlant.id)}
          cropCount={
            myCrops.filter((c) => c.plantId === activeSelectedPlant.id).reduce((acc, c) => acc + (c.potCount || 1), 0)
          }
          onRequestAddVariety={(p, varName, _varBadge) => {
            setVarietyPickerPlant({ plant: p, initialVariety: varName });
          }}
          onToggleMyCrop={handleToggleMyCrop}
        />
      )}

      {/* Forced Variety & Multiple Pot Selection Modal */}
      {varietyPickerPlant && (
        <SelectVarietyModal
          plant={getTranslatedPlant(varietyPickerPlant.plant, language)}
          isOpen={true}
          initialVarietyName={varietyPickerPlant.initialVariety}
          onClose={() => setVarietyPickerPlant(null)}
          onConfirmAdd={(pId, vName, vBadge, pCount, openConfig) => {
            handleAddCropWithVariety(pId, vName, vBadge, pCount, openConfig);
            setVarietyPickerPlant(null);
          }}
          existingCropCountForPlant={
            myCrops
              .filter((c) => c.plantId === varietyPickerPlant.plant.id)
              .reduce((acc, c) => acc + (c.potCount || 1), 0)
          }
        />
      )}

      {/* Welcome Screen & Onboarding for First-time Users */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => {
          setWelcomeSeen();
          setIsWelcomeModalOpen(false);
          if (!hasUserOnboarded()) {
            setIsSetupModalOpen(true);
          }
        }}
        balconySpec={userSpec}
        myCrops={myCrops}
        onAuthSuccess={handleWelcomeAuthSuccess}
        onContinueAsGuest={handleWelcomeContinueAsGuest}
      />

      {/* Balcony Setup & Onboarding Modal */}
      <BalconySetupModal
        isOpen={isSetupModalOpen}
        initialSpec={userSpec}
        onSave={handleSaveSpec}
        onClose={() => setIsSetupModalOpen(false)}
        isFirstTime={!hasUserOnboarded()}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsSetupModalOpen(false);
          setAuthModalTab('register');
          setIsAuthModalOpen(true);
        }}
      />

      {/* Quick Balcony Spec Side Drawer */}
      <BalconyDrawer
        isOpen={isBalconyDrawerOpen}
        onClose={() => setIsBalconyDrawerOpen(false)}
        userSpec={userSpec}
        onSelectPlants={() => {
          setIsBalconyDrawerOpen(false);
          setActiveTab('search_crops');
        }}
        onOpenFullSetup={() => {
          setIsBalconyDrawerOpen(false);
          setIsSetupModalOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsBalconyDrawerOpen(false);
          setAuthModalTab('login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* User Login / Registration Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentBalconySpec={userSpec}
        currentMyCrops={myCrops}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authModalTab}
      />

      {/* User Profile & Saved Balcony Summary Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
          onEditBalcony={() => setIsSetupModalOpen(true)}
          myCropsCount={myCrops.length}
        />
      )}

      {/* Floating Notification Toast */}
      {accountToast && (
        <div
          id="account-status-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-900/95 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold shadow-2xl border border-stone-700/80 dark:border-stone-300 animate-in slide-in-from-bottom-5 fade-in duration-300 backdrop-blur-md"
        >
          {accountToast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-sky-400 dark:text-sky-600 shrink-0" />
          )}
          <span>{accountToast.message}</span>
          <button
            onClick={() => setAccountToast(null)}
            className="ml-2 text-stone-400 hover:text-white dark:hover:text-stone-900 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Minimal Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-6 mt-12 text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <div className="font-semibold text-stone-700 dark:text-stone-300">
              <strong>{isEn ? 'Container Specialist' : 'Donicowy Specjalista'}</strong> •{' '}
              {isEn
                ? 'Guide to growing vegetables, fruits, herbs and flowers in containers'
                : 'Poradnik uprawy warzyw, owoców, ziół i roślin ozdobnych w donicach'}
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 max-w-2xl leading-relaxed">
              {isEn
                ? 'The application gathers knowledge from verified agrotechnical and horticultural sources. Due to diverse balcony microclimates, double-checking local conditions is recommended.'
                : 'Aplikacja czerpie wiedzę ze zweryfikowanych źródeł agrotechnicznych i ogrodniczych. Ze względu na zróżnicowane mikroklimaty balkonów dane mogą zawierać nieścisłości — zalecana jest podwójna weryfikacja.'}
            </p>
          </div>
          <div className="text-[11px] text-stone-400 dark:text-stone-500 text-center sm:text-right shrink-0">
            <div>{isEn ? 'Weather data: Open-Meteo API' : 'Dane pogodowe: Open-Meteo API'}</div>
            <div>{isEn ? 'Climate zones: IMGW / Horticultural standards' : 'Strefy klimatyczne: IMGW / Działkowiec'}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
