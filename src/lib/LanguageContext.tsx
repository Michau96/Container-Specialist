import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, Translations, getTranslation } from './translations';
import { getStoredUser, updateUserLanguage } from './auth';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  dict: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'balkonowy_app_language';

export function getInitialLanguage(): Language {
  try {
    const user = getStoredUser();
    if (user && (user.language === 'pl' || user.language === 'en')) {
      return user.language;
    }
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'pl' || saved === 'en') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'pl';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => getInitialLanguage());

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      // If user is logged in, also update user account language
      updateUserLanguage(newLang);
    } catch (err) {
      console.warn('Failed to persist language choice:', err);
    }
  };

  const dict = getTranslation(language);

  const t = (key: keyof Translations): string => {
    return dict[key] || translations.pl[key] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dict }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return fallback if used outside provider
    const fallbackDict = getTranslation('pl');
    return {
      language: 'pl',
      setLanguage: () => {},
      t: (key: keyof Translations) => fallbackDict[key] || (key as string),
      dict: fallbackDict,
    };
  }
  return context;
}
