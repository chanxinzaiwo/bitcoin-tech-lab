/**
 * Internationalization (i18n) Configuration
 *
 * This module sets up i18next for multi-language support.
 * Supported languages: English (en), Chinese (zh)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import locale files
import en from './locales/en.json';
import zh from './locales/zh.json';

// Language resources
const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

// Supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
] as const;

export type LanguageCode = (typeof supportedLanguages)[number]['code'];

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: supportedLanguages.map((l) => l.code),

    // Detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'btclab-language',
      caches: ['localStorage'],
    },

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React options
    react: {
      useSuspense: false, // Set to true if using Suspense
    },

    // Debug mode in development
    debug: import.meta.env.DEV,
  });

/**
 * Get the current language code
 */
export function getCurrentLanguage(): LanguageCode {
  return (i18n.language?.substring(0, 2) as LanguageCode) || 'en';
}

/**
 * Change the current language
 */
export function changeLanguage(lang: LanguageCode): Promise<void> {
  return i18n.changeLanguage(lang).then(() => {
    // Update document language attribute
    document.documentElement.lang = lang;
  });
}

/**
 * Get the display name for a language code
 */
export function getLanguageName(code: LanguageCode, native = false): string {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? (native ? lang.nativeName : lang.name) : code;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(code: string): code is LanguageCode {
  return supportedLanguages.some((l) => l.code === code);
}

export default i18n;
