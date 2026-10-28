import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import esTranslations from '@/locales/es.json';
import enTranslations from '@/locales/en.json';

export type Language = 'es' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, any> = {
  es: esTranslations,
  en: enTranslations,
};

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'es',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const currentLanguage = get().language;
        const keys = key.split('.');
        let result: any = translations[currentLanguage];

        for (const k of keys) {
          if (result && typeof result === 'object' && k in result) {
            result = result[k];
          } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
          }
        }

        return typeof result === 'string' ? result : key;
      },
    }),
    {
      name: 'f1-strategist-language',
      partialize: (state) => ({ language: state.language }),
    }
  )
);

export default useLanguageStore;
