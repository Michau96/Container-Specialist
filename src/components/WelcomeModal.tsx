import React, { useState } from 'react';
import {
  Sprout,
  Sun,
  Calendar,
  Layers,
  Sparkles,
  UserPlus,
  LogIn,
  Check,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  X,
  AlertCircle,
  CloudSun,
  HeartHandshake,
} from 'lucide-react';
import { UserAccount, UserBalconySpec, MyCropItem } from '../types';
import { registerAccount, loginAccount } from '../lib/auth';
import { signInWithGoogle } from '../lib/firebase';
import { PasswordStrengthIndicator, PasswordMatchIndicator, evaluatePasswordMatch } from './PasswordStrengthIndicator';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  balconySpec: UserBalconySpec;
  myCrops: MyCropItem[];
  onAuthSuccess: (user: UserAccount, message: string) => void;
  onContinueAsGuest: () => void;
}

export const WelcomeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  balconySpec,
  myCrops,
  onAuthSuccess,
  onContinueAsGuest,
}) => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const [viewMode, setViewMode] = useState<'overview' | 'register' | 'login'>('overview');

  // Auth form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setAuthError(null);
    setAuthSuccess(null);
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle(balconySpec, myCrops);
      setAuthSuccess(isEn ? `Great! Welcome ${res.user.username}.` : `Super! Witaj ${res.user.username}.`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 500);
    } catch (err: any) {
      setAuthError(err.message || (isEn ? 'Google authentication error.' : 'Wystąpił błąd podczas autoryzacji kontem Google.'));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      setAuthError(isEn ? 'Username must have at least 2 characters.' : 'Nick musi zawierać minimum 2 znaki.');
      return;
    }
    if (!password || password.length < 4) {
      setAuthError(isEn ? 'Password must have at least 4 characters.' : 'Hasło musi zawierać minimum 4 znaki.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError(isEn ? 'Passwords do not match.' : 'Wpisane hasła różnią się od siebie.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await registerAccount(trimmed, password, balconySpec, myCrops);
      setAuthSuccess(isEn ? `Great! Welcome ${res.user.username}.` : `Super! Witaj ${res.user.username}.`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 600);
    } catch (err: any) {
      setAuthError(err.message || (isEn ? 'Failed to create account. Try again.' : 'Nie udało się założyć konta. Spróbuj ponownie.'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const trimmed = username.trim();
    if (!trimmed) {
      setAuthError(isEn ? 'Please provide username.' : 'Podaj swój nick.');
      return;
    }
    if (!password) {
      setAuthError(isEn ? 'Please enter password.' : 'Wpisz hasło.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await loginAccount(trimmed, password);
      setAuthSuccess(isEn ? `Welcome back, ${res.user.username}!` : `Witaj z powrotem, ${res.user.username}!`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 600);
    } catch (err: any) {
      setAuthError(err.message || (isEn ? 'Invalid username or password.' : 'Nieprawidłowy nick lub hasło.'));
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div
      id="welcome-screen-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/65 dark:bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div
        id="welcome-screen-dialog"
        className="bg-[#FAF8F5] dark:bg-stone-900 text-stone-800 dark:text-stone-100 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden transition-all"
      >
        {/* Top Decorative Bar */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 px-6 py-5 sm:py-6 text-white relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-inner">
                <Sprout className="w-6 h-6 text-emerald-100" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-emerald-50 border border-white/20 mb-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>{isEn ? 'Your Urban Growing Assistant' : 'Twój Miejski Asystent Uprawy'}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {isEn ? 'Balcony Container Garden' : 'Ogródek Balkonowy'}
                </h1>
              </div>
            </div>

            <button
              type="button"
              id="skip-welcome-btn"
              onClick={onContinueAsGuest}
              className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer shrink-0 shadow-sm"
              title={isEn ? 'Go to app' : 'Przejdź do aplikacji'}
              aria-label={isEn ? 'Close and go to app' : 'Zamknij i przejdź do aplikacji'}
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* ================= VIEW 1: OVERVIEW & VALUE PROPOSITION ================= */}
          {viewMode === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* Friendly Intro Heading */}
              <div className="text-center sm:text-left space-y-1.5">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                  {isEn
                    ? 'Turn your balcony into a lush, bountiful urban oasis 🌿'
                    : 'Zamień swój balkon w zieloną, obfitą oazę 🌿'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {isEn
                    ? 'Even a small apartment balcony is enough to enjoy fragrant home-grown tomatoes, crisp salad greens, and fresh culinary herbs. The app guides you step-by-step from seed to harvest.'
                    : 'Nawet mała przestrzeń w bloku wystarczy, by cieszyć się własnymi, pachnącymi pomidorkami, chrupiącą sałatą i świeżymi ziołami. Aplikacja prowadzi Cię za rękę od nasionka po zbiory.'}
                </p>
              </div>

              {/* 4 Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Sunlight & Wind Matching' : 'Dopasowanie do słońca i wiatru'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {isEn
                      ? 'Evaluates orientation (East, South, West) and floor height. Recommends crops that genuinely thrive in your exact spot.'
                      : 'Sprawdza ekspozycję (wschód, zachód, południe) i piętro. Poleca tylko te rośliny, które naprawdę zaowocują.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Personal Sowing Schedule' : 'Osobisty kalendarz siewu'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {isEn
                      ? 'Know exactly when to start seeds indoors, when to harden off seedlings, and when to transplant outside after the last frost.'
                      : 'Wiesz dokładnie, kiedy siać na parapecie, kiedy hartować i kiedy wynosić na zewnątrz po „zimnej Zośce”.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Pot & Variety Calculator' : 'Kalkulator donic i odmian'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {isEn
                      ? 'Precise soil volume calculation and compact dwarf cultivars tailored to balcony planters and tight spaces.'
                      : 'Precyzyjny dobór litrażu ziemi i odmian karłowych dedykowanych do skrzynek i ciasnych donic.'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    {isEn ? 'Daily Tips & Weather' : 'Codzienne wskazówki i pogoda'}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    {isEn
                      ? 'Local frost and heat alerts along with actionable advice on watering schedules and pest prevention.'
                      : 'Lokalne ostrzeżenia przed przymrozkami lub suszą oraz proste porady dotyczące podlewania.'}
                  </p>
                </div>
              </div>

              {/* Call-to-action Section */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-stone-800 border border-emerald-200/80 dark:border-emerald-800/80 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                      {isEn ? 'Create a free account or sign in' : 'Załóż bezpłatne konto lub zaloguj się'}
                    </h3>
                    <p className="text-xs text-emerald-850 dark:text-emerald-200/90 leading-relaxed">
                      {isEn
                        ? 'Save your balcony specs, track your crops, and access your schedule across mobile and desktop devices.'
                        : 'Zapisz parametry swojego balkonu, prowadź listę swoich sadzonek i miej dostęp do kalendarza na telefonie oraz komputerze.'}
                    </p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="button"
                    id="welcome-google-auth-btn"
                    onClick={handleGoogleAuth}
                    disabled={googleLoading || authLoading}
                    className="w-full py-3 px-4 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm border border-stone-300 dark:border-stone-650 shadow-xs hover:shadow-sm transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
                  >
                    {googleLoading ? (
                      <div className="w-4 h-4 border-2 border-stone-400 border-t-emerald-600 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    )}
                    <span>{isEn ? 'Sign in or register with Google' : 'Zarejestruj lub zaloguj przez konto Google'}</span>
                  </button>

                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-emerald-200/60 dark:border-emerald-800/40 w-full" />
                    <span className="bg-[#FAF8F5] dark:bg-stone-900 px-2.5 text-[11px] text-stone-500 dark:text-stone-400 font-medium shrink-0">
                      {isEn ? 'or traditional account' : 'lub tradycyjne konto'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      id="welcome-register-btn"
                      onClick={() => {
                        setAuthError(null);
                        setViewMode('register');
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isEn ? 'Create free account' : 'Załóż darmowe konto'}</span>
                    </button>

                    <button
                      type="button"
                      id="welcome-login-btn"
                      onClick={() => {
                        setAuthError(null);
                        setViewMode('login');
                      }}
                      className="w-full py-2.5 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-600 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{isEn ? 'Already have an account (Sign in)' : 'Mam już konto (Zaloguj)'}</span>
                    </button>
                  </div>
                </div>

                {/* Guest option */}
                <div className="pt-2 text-center border-t border-emerald-200/60 dark:border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isEn ? 'Want to explore the app first?' : 'Chcesz najpierw rozejrzeć się po aplikacji?'}
                  </span>
                  <button
                    type="button"
                    id="welcome-continue-guest-btn"
                    onClick={onContinueAsGuest}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 underline decoration-emerald-400/50 hover:decoration-emerald-600 cursor-pointer py-1"
                  >
                    <span>{isEn ? 'Try as guest (no sign-in)' : 'Wypróbuj jako gość (bez logowania)'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 2: REJESTRACJA ================= */}
          {viewMode === 'register' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setViewMode('overview');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isEn ? 'Back to app overview' : 'Wróć do opisu aplikacji'}</span>
                </button>
                <span className="text-xs text-stone-400">{isEn ? 'Step 1 of 2' : 'Krok 1 z 2'}</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isEn ? 'Create Free Account' : 'Utwórz darmowe konto'}</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn
                    ? 'All you need is a unique username and password. No sensitive personal data required.'
                    : 'Wystarczy unikalny nick i hasło. Nie wymagamy podawania wrażliwych danych.'}
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                id="welcome-reg-google-btn"
                onClick={handleGoogleAuth}
                disabled={googleLoading || authLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm border border-stone-300 dark:border-stone-650 shadow-xs hover:shadow-sm transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-stone-400 border-t-emerald-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>{isEn ? 'Instant registration with Google' : 'Zarejestruj się błyskawicznie przez konto Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
                <span className="bg-[#FAF8F5] dark:bg-stone-900 px-3 text-[11px] text-stone-400 dark:text-stone-500 font-medium shrink-0">
                  {isEn ? 'or traditionally with username & password' : 'lub tradycyjnie przez nick i hasło'}
                </span>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    {isEn ? 'Your Username / Gardener Name' : 'Twój Nick / Imię ogrodnika'}
                  </label>
                  <input
                    type="text"
                    id="welcome-reg-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isEn ? 'e.g. UrbanGardener_Tom, GreenBalcony' : 'np. ZielonyBalkon_Tomek, Kasia_Ziolka'}
                    required
                    minLength={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    {isEn ? 'Password' : 'Hasło'}
                  </label>
                  <input
                    type="password"
                    id="welcome-reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEn ? 'Minimum 4 characters' : 'Minimum 4 znaki'}
                    required
                    minLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <PasswordStrengthIndicator password={password} idPrefix="welcome-reg-pwd" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    {isEn ? 'Confirm Password' : 'Powtórz hasło'}
                  </label>
                  <input
                    type="password"
                    id="welcome-reg-password-confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={isEn ? 'Enter password again' : 'Wpisz hasło ponownie'}
                    required
                    minLength={4}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 transition ${
                      confirmPassword
                        ? evaluatePasswordMatch(password, confirmPassword, 4).borderColorClass
                        : 'border-stone-200 dark:border-stone-700 focus:ring-emerald-500'
                    }`}
                  />
                  <PasswordMatchIndicator
                    password={password}
                    confirmPassword={confirmPassword}
                    idPrefix="welcome-reg-pwd-match"
                    minLength={4}
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError(null);
                      setViewMode('login');
                    }}
                    className="text-xs text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer order-2 sm:order-1"
                  >
                    {isEn ? 'Already have an account? Sign In' : 'Masz już konto? Zaloguj się'}
                  </button>

                  <button
                    type="submit"
                    id="submit-welcome-register-btn"
                    disabled={authLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 order-1 sm:order-2 group"
                  >
                    {authLoading ? (
                      <span>{isEn ? 'Creating account...' : 'Tworzenie konta...'}</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
                        <span>{isEn ? 'Register & Go to Balcony' : 'Zarejestruj i przejdź do balkonu'}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-200 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Offline-First / Continue as Guest Banner */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-100/90 dark:bg-stone-800/70 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-center sm:justify-start gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{isEn ? 'Offline-First Mode (No Registration)' : 'Tryb Offline-First (Bez rejestracji)'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                      {isEn
                        ? "Don't want to create an account? All data and crops will be saved locally in your browser."
                        : 'Nie chcesz zakładać konta? Wszystkie dane i uprawy zapiszą się lokalnie w przeglądarce.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    id="register-continue-as-guest-btn"
                    onClick={onContinueAsGuest}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-300 border border-stone-300 dark:border-stone-600 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>{isEn ? 'Continue as guest' : 'Kontynuuj jako gość'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 3: LOGOWANIE ================= */}
          {viewMode === 'login' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setViewMode('overview');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isEn ? 'Back to app overview' : 'Wróć do opisu aplikacji'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isEn ? 'Sign in to your balcony' : 'Zaloguj się do swojego balkonu'}</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {isEn
                    ? 'Enter your username and password to load your saved balcony conditions and tracked plants.'
                    : 'Podaj nick i hasło, aby wczytać zapisane warunki balkonu i swoje rośliny.'}
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                id="welcome-login-google-btn"
                onClick={handleGoogleAuth}
                disabled={googleLoading || authLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm border border-stone-300 dark:border-stone-650 shadow-xs hover:shadow-sm transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-stone-400 border-t-emerald-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                )}
                <span>{isEn ? 'Sign in with Google' : 'Zaloguj się przez konto Google'}</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
                <span className="bg-[#FAF8F5] dark:bg-stone-900 px-3 text-[11px] text-stone-400 dark:text-stone-500 font-medium shrink-0">
                  {isEn ? 'or traditionally with username & password' : 'lub tradycyjnie przez nick i hasło'}
                </span>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    {isEn ? 'Your Username' : 'Twój Nick'}
                  </label>
                  <input
                    type="text"
                    id="welcome-login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={isEn ? 'Enter username' : 'Wpisz nick'}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    {isEn ? 'Password' : 'Hasło'}
                  </label>
                  <input
                    type="password"
                    id="welcome-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isEn ? 'Enter password' : 'Wpisz hasło'}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError(null);
                      setViewMode('register');
                    }}
                    className="text-xs text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 underline cursor-pointer order-2 sm:order-1"
                  >
                    {isEn ? "Don't have an account yet? Register for free" : 'Nie masz jeszcze konta? Załóż bezpłatnie'}
                  </button>

                  <button
                    type="submit"
                    id="submit-welcome-login-btn"
                    disabled={authLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 order-1 sm:order-2"
                  >
                    {authLoading ? (
                      <span>{isEn ? 'Signing in...' : 'Logowanie...'}</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>{isEn ? 'Sign In' : 'Zaloguj się'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Offline-First / Continue as Guest Banner */}
              <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-100/90 dark:bg-stone-800/70 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
                  <div className="space-y-0.5 text-center sm:text-left">
                    <div className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center justify-center sm:justify-start gap-1.5">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{isEn ? 'Offline-First Mode' : 'Tryb Offline-First'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                      {isEn ? 'Proceed directly to the application without signing in.' : 'Przejdź do aplikacji bezpośrednio bez logowania.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    id="login-continue-as-guest-btn"
                    onClick={onContinueAsGuest}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 hover:text-emerald-700 dark:hover:text-emerald-300 border border-stone-300 dark:border-stone-600 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
                  >
                    <span>{isEn ? 'Continue as guest' : 'Kontynuuj jako gość'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
