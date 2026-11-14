'use client';

import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';
import { SupportedLocale } from '@/types';

type TranslationType = typeof translations.fr;

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'fr',
  setLocale: () => {},
  t: translations.fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('musika_locale') as SupportedLocale;
        if (saved && (saved === 'fr' || saved === 'en')) {
          return saved;
        }
      } catch {
        // Ignore if localStorage unavailable
      }
    }
    return 'fr';
  });

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('musika_locale', newLocale);
      } catch {
        // Ignore
      }
    }
  };

  const t = translations[locale] || translations.fr;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
