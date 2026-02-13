/**
 * Language Hook
 *
 * Custom hook for managing language in the application.
 * Provides language switching and translation utilities.
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  supportedLanguages,
  changeLanguage,
  getCurrentLanguage,
  getLanguageName,
  type LanguageCode,
} from '../i18n';

export interface UseLanguageReturn {
  /** Current language code */
  language: LanguageCode;
  /** Translation function */
  t: (key: string, options?: Record<string, unknown>) => string;
  /** Change to a different language */
  setLanguage: (lang: LanguageCode) => Promise<void>;
  /** Toggle between languages (for two-language setup) */
  toggleLanguage: () => Promise<void>;
  /** List of supported languages */
  languages: typeof supportedLanguages;
  /** Get display name for a language */
  getLanguageName: (code: LanguageCode, native?: boolean) => string;
  /** Check if current language is RTL */
  isRTL: boolean;
}

/**
 * Hook for managing language and translations
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { t, language, setLanguage, toggleLanguage } = useLanguage();
 *
 *   return (
 *     <div>
 *       <h1>{t('common.welcome')}</h1>
 *       <p>Current: {language}</p>
 *       <button onClick={toggleLanguage}>Toggle Language</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useLanguage(): UseLanguageReturn {
  const { t, i18n } = useTranslation();

  const language = getCurrentLanguage();

  const setLanguage = useCallback(
    async (lang: LanguageCode) => {
      await changeLanguage(lang);
    },
    []
  );

  const toggleLanguage = useCallback(async () => {
    const currentIndex = supportedLanguages.findIndex((l) => l.code === language);
    const nextIndex = (currentIndex + 1) % supportedLanguages.length;
    const nextLang = supportedLanguages[nextIndex].code;
    await changeLanguage(nextLang);
  }, [language]);

  // RTL languages (Arabic, Hebrew, etc.)
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  const isRTL = rtlLanguages.includes(language);

  return {
    language,
    t: t as (key: string, options?: Record<string, unknown>) => string,
    setLanguage,
    toggleLanguage,
    languages: supportedLanguages,
    getLanguageName,
    isRTL,
  };
}

export default useLanguage;
