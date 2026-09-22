import React, { useState } from 'react';
import {
  User,
  Lock,
  UserPlus,
  LogIn,
  X,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Sprout,
} from 'lucide-react';
import { UserAccount, UserBalconySpec, MyCropItem, getFloorCategoryLabel } from '../types';
import { POLAND_REGIONS, ORIENTATION_OPTIONS } from '../lib/api';
import {
  loginAccount,
  registerAccount,
  getKnownLocalAccounts,
  removeKnownLocalAccount,
} from '../lib/auth';
import { signInWithGoogle } from '../lib/firebase';
import { PasswordStrengthIndicator, PasswordMatchIndicator, evaluatePasswordMatch } from './PasswordStrengthIndicator';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentBalconySpec: UserBalconySpec;
  currentMyCrops: MyCropItem[];
  onAuthSuccess: (user: UserAccount, message: string) => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentBalconySpec,
  currentMyCrops,
  onAuthSuccess,
  initialTab = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialTab);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [attachCurrentSpec, setAttachCurrentSpec] = useState(true);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const regionInfo = POLAND_REGIONS[currentBalconySpec.region];
  const orientItem = ORIENTATION_OPTIONS.find((o) => o.key === currentBalconySpec.orientation);
  const [knownAccounts, setKnownAccounts] = useState(() => getKnownLocalAccounts());

  const handleRemoveKnownAccount = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeKnownLocalAccount(id);
    setKnownAccounts(getKnownLocalAccounts());
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccessMessage(null);
    setGoogleLoading(true);
    try {
      const cropsToAttach = (mode === 'register' && !attachCurrentSpec) ? [] : currentMyCrops;
      const res = await signInWithGoogle(currentBalconySpec, cropsToAttach);
      setSuccessMessage(res.message);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas logowania przez Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!username.trim()) {
      setError('Podaj nick.');
      return;
    }
    if (!password) {
      setError('Podaj hasło.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAccount(username, password);
      setSuccessMessage(res.message);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas logowania.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmed = username.trim();
    if (!trimmed || trimmed.length < 2) {
      setError('Nick musi mieć co najmniej 2 znaki.');
      return;
    }
    if (trimmed.length > 30) {
      setError('Nick może mieć maksymalnie 30 znaków.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Hasło musi mieć co najmniej 4 znaki.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Wpisane hasła nie są identyczne.');
      return;
    }

    setLoading(true);
    try {
      const cropsToAttach = attachCurrentSpec ? currentMyCrops : [];
      const res = await registerAccount(
        trimmed,
        password,
        currentBalconySpec,
        cropsToAttach
      );
      setSuccessMessage(res.message);
      setTimeout(() => {
        onAuthSuccess(res.user, res.message);
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Błąd podczas tworzenia konta.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillAccount = (nick: string) => {
    setUsername(nick);
    setMode('login');
    setError(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200/90 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative p-5 pb-4 border-b border-stone-100 dark:border-stone-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                {mode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  {mode === 'login' ? 'Zaloguj się do konta' : 'Utwórz nowe konto'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {mode === 'login'
                    ? 'Wczytaj swoje zapisane parametry balkonu i uprawy'
                    : 'Zapisz parametry swojego balkonu pod nickiem i hasłem'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
              title="Zamknij okno"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-stone-100 dark:bg-stone-800/80 p-1 mt-4">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Logowanie</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'register'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Utwórz konto</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign-in / Registration Button */}
          <div className="space-y-3">
            <button
              type="button"
              id="google-auth-btn"
              onClick={handleGoogleAuth}
              disabled={googleLoading || loading}
              className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 active:bg-stone-100 dark:active:bg-stone-700 text-stone-800 dark:text-stone-100 font-bold text-xs sm:text-sm border border-stone-300/80 dark:border-stone-700 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 group"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-stone-400 border-t-emerald-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>
                {mode === 'register' ? 'Zarejestruj się przez konto Google' : 'Zaloguj się przez konto Google'}
              </span>
            </button>

            <div className="relative flex items-center justify-center py-1">
              <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
              <span className="bg-white dark:bg-stone-900 px-3 text-[11px] text-stone-400 dark:text-stone-500 font-medium shrink-0">
                lub tradycyjnie przez nick i hasło
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-3.5">
            {/* Nick / Username Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Nick użytkownika
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="np. zielony_balkon, tomek_ogrodnik"
                  maxLength={30}
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                Hasło
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Wpisz hasło (min. 4 znaki)"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 dark:focus:ring-emerald-500 transition"
                />
              </div>
              {mode === 'register' && (
                <PasswordStrengthIndicator password={password} idPrefix="auth-reg-pwd" />
              )}
            </div>

            {/* Confirm Password (only on register) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Powtórz hasło
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Powtórz hasło"
                    className={`w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800 border rounded-2xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition ${
                      confirmPassword
                        ? evaluatePasswordMatch(password, confirmPassword, 4).borderColorClass
                        : 'border-stone-200 dark:border-stone-700 focus:ring-emerald-600 dark:focus:ring-emerald-500'
                    }`}
                  />
                </div>
                <PasswordMatchIndicator
                  password={password}
                  confirmPassword={confirmPassword}
                  idPrefix="auth-reg-pwd-match"
                  minLength={4}
                />
              </div>
            )}

            {/* Balcony Spec Preview on Register */}
            {mode === 'register' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Ustawienia balkonu do zapisania:</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {currentMyCrops.length} {currentMyCrops.length === 1 ? 'uprawa' : 'upraw'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px] text-stone-700 dark:text-stone-300 pt-1">
                  <div className="bg-white/80 dark:bg-stone-800/80 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <div className="text-[10px] text-stone-400">Województwo</div>
                    <div className="font-bold truncate">{regionInfo?.name.split('(')[0].trim() || 'Polska'}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-stone-800/80 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <div className="text-[10px] text-stone-400">Piętro</div>
                    <div className="font-bold">{getFloorCategoryLabel(currentBalconySpec.floor)}</div>
                  </div>
                  <div className="bg-white/80 dark:bg-stone-800/80 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                    <div className="text-[10px] text-stone-400">Wystawa</div>
                    <div className="font-bold truncate">{orientItem?.label.split('(')[0].trim() || currentBalconySpec.orientation}</div>
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={attachCurrentSpec}
                    onChange={(e) => setAttachCurrentSpec(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-stone-600 dark:text-stone-300">
                    Powiąż obecne ustawienia balkonu i rośliny z nowym kontem
                  </span>
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Zaloguj się</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Utwórz konto i zapisz balkon</span>
                </>
              )}
            </button>

            {/* Offline-First / Continue as Guest option */}
            <div className="pt-1">
              <button
                type="button"
                id="auth-modal-continue-guest-btn"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold text-xs transition flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 cursor-pointer"
              >
                <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Kontynuuj jako gość (bez logowania)</span>
              </button>
            </div>
          </form>

          {/* Quick account switch if local accounts exist */}
          {knownAccounts.length > 0 && mode === 'login' && (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 mb-2">
                Zapisane konta na tym urządzeniu:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {knownAccounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-300 hover:text-emerald-700 border border-stone-200/80 dark:border-stone-700 transition"
                  >
                    <button
                      type="button"
                      onClick={() => handleQuickFillAccount(acc.username)}
                      className="cursor-pointer flex items-center gap-1 font-medium"
                    >
                      <User className="w-3 h-3" />
                      <span>{acc.username}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveKnownAccount(e, acc.id)}
                      title="Usuń z listy urządzeń"
                      className="text-stone-400 hover:text-red-500 p-0.5 rounded-full cursor-pointer ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Konto pozwala zachować profil balkonu i wracać do niego w dowolnej chwili.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
