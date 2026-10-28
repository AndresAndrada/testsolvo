'use client';

import React from 'react';
import useLanguageStore from '@/stores/languageStore';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-3 px-4 py-2 dark:bg-gray-800/40 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Español Flag */}
      <span className={`text-2xl transition-opacity ${language === 'es' ? 'opacity-100' : 'opacity-40'}`}>
        🇪🇸
      </span>

      {/* Switch Toggle */}
      <button
        onClick={toggleLanguage}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
        style={{ backgroundColor: language === 'es' ? '#393e46' : '#a7bcb9' }}
        aria-label="Toggle language"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            language === 'en' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>

      {/* English Flag */}
      <span className={`text-2xl transition-opacity ${language === 'en' ? 'opacity-100' : 'opacity-40'}`}>
        🇬🇧
      </span>
    </div>
  );
}
