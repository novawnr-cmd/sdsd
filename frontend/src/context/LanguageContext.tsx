'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import ar from '@/locales/ar';
import en from '@/locales/en';

type Lang = 'ar' | 'en';
type Translations = typeof ar;

interface LanguageContextType {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  t: (key: string, params?: Record<string, string | number>) => string;
  toggleLanguage: () => void;
  setLanguage: (lang: Lang) => void;
}

const translations: Record<Lang, Translations> = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let result: unknown = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  return typeof result === 'string' ? result : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ar');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && (saved === 'ar' || saved === 'en')) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[lang] as Record<string, unknown>, key);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return value;
    },
    [lang]
  );

  const toggleLanguage = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const setLanguage = useCallback((newLang: Lang) => {
    setLangState(newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, dir, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
