import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, Check, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
  password?: string;
  idPrefix?: string;
  lang?: 'pl' | 'en';
}

export interface PasswordMatchProps {
  password?: string;
  confirmPassword?: string;
  idPrefix?: string;
  minLength?: number;
  lang?: 'pl' | 'en';
}

export interface PasswordMatchResult {
  hasStarted: boolean;
  isValid: boolean;
  isMatch: boolean;
  isLengthValid: boolean;
  message: string;
  textColorClass: string;
  borderColorClass: string;
  status: 'empty' | 'too-short' | 'mismatch' | 'match';
}

export function evaluatePasswordMatch(
  password: string = '',
  confirmPassword: string = '',
  minLength: number = 4,
  lang: 'pl' | 'en' = 'pl'
): PasswordMatchResult {
  const isEn = lang === 'en';
  if (!confirmPassword) {
    return {
      hasStarted: false,
      isValid: false,
      isMatch: false,
      isLengthValid: password.length >= minLength,
      message: '',
      textColorClass: 'text-stone-400 dark:text-stone-500',
      borderColorClass: 'border-stone-200 dark:border-stone-700',
      status: 'empty',
    };
  }

  const isLengthValid = password.length >= minLength;
  const isMatch = password === confirmPassword;

  if (!isLengthValid) {
    return {
      hasStarted: true,
      isValid: false,
      isMatch,
      isLengthValid: false,
      message: isEn ? `Password must be at least ${minLength} characters` : `Hasło musi mieć co najmniej ${minLength} znaki`,
      textColorClass: 'text-amber-600 dark:text-amber-400',
      borderColorClass: 'border-amber-400 dark:border-amber-500 focus:ring-amber-500',
      status: 'too-short',
    };
  }

  if (!isMatch) {
    return {
      hasStarted: true,
      isValid: false,
      isMatch: false,
      isLengthValid: true,
      message: isEn ? 'Passwords do not match' : 'Hasła nie są identyczne',
      textColorClass: 'text-rose-600 dark:text-rose-400',
      borderColorClass: 'border-rose-400 dark:border-rose-500 focus:ring-rose-500',
      status: 'mismatch',
    };
  }

  return {
    hasStarted: true,
    isValid: true,
    isMatch: true,
    isLengthValid: true,
    message: isEn ? 'Passwords match' : 'Hasła są zgodne',
    textColorClass: 'text-emerald-600 dark:text-emerald-400 font-medium',
    borderColorClass: 'border-emerald-500 dark:border-emerald-500 focus:ring-emerald-500',
    status: 'match',
  };
}

export const PasswordMatchIndicator: React.FC<PasswordMatchProps> = ({
  password = '',
  confirmPassword = '',
  idPrefix = 'pwd-match',
  minLength = 4,
  lang,
}) => {
  const { language } = useLanguage();
  const effectiveLang = lang || language;
  const isEn = effectiveLang === 'en';

  if (!confirmPassword) {
    return null;
  }

  const result = evaluatePasswordMatch(password, confirmPassword, minLength, effectiveLang);

  return (
    <div
      id={`${idPrefix}-indicator`}
      className="mt-1.5 flex items-center justify-between text-[11px] leading-tight transition-all duration-200"
    >
      <div className="flex items-center gap-1.5">
        {result.status === 'match' && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        )}
        {result.status === 'mismatch' && (
          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
        )}
        {result.status === 'too-short' && (
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
        )}
        <span id={`${idPrefix}-message`} className={result.textColorClass}>
          {result.message}
        </span>
      </div>

      {result.status === 'match' && (
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80">
          {isEn ? 'Match' : 'Zgodne'}
        </span>
      )}
    </div>
  );
};

export interface PasswordStrengthResult {
  score: number; // 0 to 4
  label: string;
  sublabel: string;
  colorClass: string;
  barColorClass: string;
  textColorClass: string;
  suggestions: string[];
}

export function evaluatePasswordStrength(password: string = '', lang: 'pl' | 'en' = 'pl'): PasswordStrengthResult {
  const isEn = lang === 'en';
  if (!password || password.length === 0) {
    return {
      score: 0,
      label: isEn ? 'Enter password' : 'Wpisz hasło',
      sublabel: isEn ? 'Minimum 4 characters' : 'Minimum 4 znaki',
      colorClass: 'bg-stone-200 dark:bg-stone-700',
      barColorClass: 'bg-stone-200 dark:bg-stone-700',
      textColorClass: 'text-stone-400 dark:text-stone-500',
      suggestions: [isEn ? 'Use at least 4 characters' : 'Użyj co najmniej 4 znaków'],
    };
  }

  let score = 0;
  const suggestions: string[] = [];

  // Criteria 1: Length
  if (password.length >= 4) score += 1;
  if (password.length >= 8) score += 1;

  // Criteria 2: Character diversity
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const diversityCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (diversityCount >= 2 && password.length >= 6) score += 1;
  if (diversityCount >= 3 && password.length >= 8) score += 1;

  // Clamp score between 1 and 4 when password exists
  score = Math.min(4, Math.max(1, score));

  if (password.length < 6) {
    suggestions.push(isEn ? 'Extend password to at least 6–8 characters' : 'Wydłuż hasło do min. 6–8 znaków');
  }
  if (!hasNumber) {
    suggestions.push(isEn ? 'Add a digit (0-9)' : 'Dodaj cyfrę (0-9)');
  }
  if (!hasUpper || !hasLower) {
    suggestions.push(isEn ? 'Combine uppercase and lowercase letters' : 'Połącz małe i wielkie litery');
  }
  if (!hasSpecial) {
    suggestions.push(isEn ? 'Add a special character (e.g. !@#$)' : 'Dodaj znak specjalny (np. !@#$)');
  }

  switch (score) {
    case 1:
      return {
        score: 1,
        label: isEn ? 'Weak' : 'Słabe (Weak)',
        sublabel: isEn ? 'Password is too simple or too short' : 'Hasło jest zbyt proste lub za krótkie',
        colorClass: 'bg-rose-500',
        barColorClass: 'bg-rose-500',
        textColorClass: 'text-rose-600 dark:text-rose-400',
        suggestions: suggestions.slice(0, 2),
      };
    case 2:
      return {
        score: 2,
        label: isEn ? 'Medium' : 'Średnie (Medium)',
        sublabel: isEn ? 'Good, but consider adding digits or symbols' : 'Dobre, ale warto dodać cyfry lub symbole',
        colorClass: 'bg-amber-500',
        barColorClass: 'bg-amber-500',
        textColorClass: 'text-amber-600 dark:text-amber-400',
        suggestions: suggestions.slice(0, 1),
      };
    case 3:
      return {
        score: 3,
        label: isEn ? 'Strong' : 'Silne (Strong)',
        sublabel: isEn ? 'Secure password for your account' : 'Bezpieczne hasło dla Twojego konta',
        colorClass: 'bg-emerald-500',
        barColorClass: 'bg-emerald-500',
        textColorClass: 'text-emerald-600 dark:text-emerald-400',
        suggestions: suggestions.slice(0, 1),
      };
    case 4:
    default:
      return {
        score: 4,
        label: isEn ? 'Very Strong' : 'Bardzo silne (Very Strong)',
        sublabel: isEn ? 'Excellent, highly secure password' : 'Doskonałe, wysoce bezpieczne hasło',
        colorClass: 'bg-emerald-600 dark:bg-emerald-400',
        barColorClass: 'bg-emerald-600 dark:bg-emerald-400',
        textColorClass: 'text-emerald-700 dark:text-emerald-300 font-bold',
        suggestions: [],
      };
  }
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ password = '', idPrefix = 'pwd-strength', lang }) => {
  const { language } = useLanguage();
  const effectiveLang = lang || language;
  const isEn = effectiveLang === 'en';

  if (!password) {
    return null;
  }

  const result = evaluatePasswordStrength(password, effectiveLang);

  return (
    <div id={`${idPrefix}-container`} className="mt-2 space-y-1.5 transition-all duration-200">
      {/* 4-Segment Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[1, 2, 3, 4].map((step) => {
          const isActive = result.score >= step;
          return (
            <div
              key={step}
              id={`${idPrefix}-bar-step-${step}`}
              className={`h-full rounded-full transition-all duration-300 ${
                isActive ? result.barColorClass : 'bg-stone-200 dark:bg-stone-700/80'
              }`}
            />
          );
        })}
      </div>

      {/* Label and Hint */}
      <div className="flex items-center justify-between text-[11px] leading-tight">
        <div className="flex items-center gap-1.5">
          {result.score <= 1 && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
          {result.score === 2 && <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
          {result.score >= 3 && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
          <span className="text-stone-500 dark:text-stone-400">{isEn ? 'Password strength:' : 'Siła hasła:'}</span>
          <span id={`${idPrefix}-label`} className={`font-bold ${result.textColorClass}`}>
            {result.label}
          </span>
        </div>

        {result.score >= 3 && (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline flex items-center gap-0.5">
            <Check className="w-3 h-3 inline" /> {isEn ? 'Secure' : 'Bezpieczne'}
          </span>
        )}
      </div>

      {/* Real-time hint suggestion if weak */}
      {result.suggestions.length > 0 && result.score < 3 && (
        <div className="text-[10.5px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
          <span className="text-amber-500 font-bold">•</span>
          <span>{isEn ? 'Hint:' : 'Wskazówka:'} {result.suggestions.join(', ')}</span>
        </div>
      )}
    </div>
  );
};

