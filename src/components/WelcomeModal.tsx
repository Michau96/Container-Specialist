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
  HelpCircle,
  X,
  AlertCircle,
  CloudSun,
  HeartHandshake,
} from 'lucide-react';
import { UserAccount, UserBalconySpec, MyCropItem } from '../types';
import { registerAccount, loginAccount } from '../lib/auth';

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
  const [viewMode, setViewMode] = useState<'overview' | 'register' | 'login'>('overview');

  // Auth form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      setAuthError('Nick musi zawierać minimum 2 znaki.');
      return;
    }
    if (!password || password.length < 4) {
      setAuthError('Hasło musi zawierać minimum 4 znaki.');
      return;
    }
    if (password !== confirmPassword) {
      setAuthError('Wpisane hasła różnią się od siebie.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await registerAccount(trimmed, password, balconySpec, myCrops);
      setAuthSuccess(`Super! Witaj ${res.user.username}.`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 600);
    } catch (err: any) {
      setAuthError(err.message || 'Nie udało się założyć konta. Spróbuj ponownie.');
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
      setAuthError('Podaj swój nick.');
      return;
    }
    if (!password) {
      setAuthError('Wpisz hasło.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await loginAccount(trimmed, password);
      setAuthSuccess(`Witaj z powrotem, ${res.user.username}!`);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 600);
    } catch (err: any) {
      setAuthError(err.message || 'Nieprawidłowy nick lub hasło.');
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
                  <span>Twój Miejski Asystent Uprawy</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Ogródek Balkonowy
                </h1>
              </div>
            </div>

            <button
              type="button"
              id="skip-welcome-btn"
              onClick={onContinueAsGuest}
              className="text-emerald-100/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition cursor-pointer"
              title="Przejdź do aplikacji"
            >
              <X className="w-5 h-5" />
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
                  Zamień swój balkon w zieloną, obfitą oazę 🌿
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  Nawet mała przestrzeń w bloku wystarczy, by cieszyć się własnymi, pachnącymi pomidorkami, chrupiącą sałatą i świeżymi ziołami. Aplikacja prowadzi Cię za rękę od nasionka po zbiory.
                </p>
              </div>

              {/* 4 Feature Cards (Co robi aplikacja?) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                    <Sun className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    Dopasowanie do słońca i wiatru
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Sprawdza ekspozycję (wschód, zachód, południe) i piętro. Poleca tylko te rośliny, które naprawdę zaowocują.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    Osobisty kalendarz siewu
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Wiesz dokładnie, kiedy siać na parapecie, kiedy hartować i kiedy wynosić na zewnątrz po „zimnej Zośce”.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300 flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    Kalkulator donic i odmian
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Precyzyjny dobór litrażu ziemi i odmian karłowych dedykowanych do skrzynek i ciasnych donic.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                    <CloudSun className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                    Codzienne wskazówki i pogoda
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                    Lokalne ostrzeżenia przed przymrozkami lub suszą oraz proste porady dotyczące podlewania.
                  </p>
                </div>
              </div>

              {/* Call-to-action Section: Rejestracja / Logowanie */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-stone-800 border border-emerald-200/80 dark:border-emerald-800/80 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
                      Załóż bezpłatne konto lub zaloguj się
                    </h3>
                    <p className="text-xs text-emerald-850 dark:text-emerald-200/90 leading-relaxed">
                      Zapisz parametry swojego balkonu, prowadź listę swoich sadzonek i miej dostęp do kalendarza na telefonie oraz komputerze.
                    </p>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    id="welcome-register-btn"
                    onClick={() => {
                      setAuthError(null);
                      setViewMode('register');
                    }}
                    className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Załóż darmowe konto</span>
                  </button>

                  <button
                    type="button"
                    id="welcome-login-btn"
                    onClick={() => {
                      setAuthError(null);
                      setViewMode('login');
                    }}
                    className="w-full py-3 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-600 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Mam już konto (Zaloguj)</span>
                  </button>
                </div>

                {/* Guest option */}
                <div className="pt-2 text-center border-t border-emerald-200/60 dark:border-emerald-800/40 flex flex-col sm:flex-row items-center justify-between gap-2">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    Chcesz najpierw rozejrzeć się po aplikacji?
                  </span>
                  <button
                    type="button"
                    id="welcome-continue-guest-btn"
                    onClick={onContinueAsGuest}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 underline decoration-emerald-400/50 hover:decoration-emerald-600 cursor-pointer py-1"
                  >
                    <span>Wypróbuj jako gość (bez logowania)</span>
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
                  <span>Wróć do opisu aplikacji</span>
                </button>
                <span className="text-xs text-stone-400">Krok 1 z 2</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Utwórz darmowe konto</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Wystarczy unikalny nick i hasło. Nie wymagamy podawania wrażliwych danych.
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

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    Twój Nick / Imię ogrodnika
                  </label>
                  <input
                    type="text"
                    id="welcome-reg-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="np. ZielonyBalkon_Tomek, Kasia_Ziolka"
                    required
                    minLength={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    Hasło
                  </label>
                  <input
                    type="password"
                    id="welcome-reg-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 4 znaki"
                    required
                    minLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    Powtórz hasło
                  </label>
                  <input
                    type="password"
                    id="welcome-reg-password-confirm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Wpisz hasło ponownie"
                    required
                    minLength={4}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    Masz już konto? Zaloguj się
                  </button>

                  <button
                    type="submit"
                    id="submit-welcome-register-btn"
                    disabled={authLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 order-1 sm:order-2"
                  >
                    {authLoading ? (
                      <span>Tworzenie konta...</span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        <span>Zarejestruj i przejdź do balkonu</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
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
                  <span>Wróć do opisu aplikacji</span>
                </button>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <LogIn className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Zaloguj się do swojego balkonu</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Podaj nick i hasło, aby wczytać zapisane warunki balkonu i swoje rośliny.
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

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    Twój Nick
                  </label>
                  <input
                    type="text"
                    id="welcome-login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Wpisz nick"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                    Hasło
                  </label>
                  <input
                    type="password"
                    id="welcome-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Wpisz hasło"
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
                    Nie masz jeszcze konta? Załóż bezpłatnie
                  </button>

                  <button
                    type="submit"
                    id="submit-welcome-login-btn"
                    disabled={authLoading}
                    className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 order-1 sm:order-2"
                  >
                    {authLoading ? (
                      <span>Logowanie...</span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Zaloguj się</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
