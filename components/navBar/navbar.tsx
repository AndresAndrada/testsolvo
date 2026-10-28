"use client";

import useLanguageStore from "@/stores/languageStore";
import { LanguageToggle } from "@/components/ui/language-toggle";

export default function Navbar() {
  const { t } = useLanguageStore();

  return (
    <>
      <LanguageToggle />
      <header className="relative border-b border-red-600/40 bg-gradient-to-r from-black via-[#0a0a0a] to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 bg-red-600" />
                <p className="text-xs uppercase tracking-[0.4em] text-red-500">Formula 1</p>
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('page.title')}</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {t('page.subtitle')}
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-600">{t('page.pitWallControl')}</div>
          </div>
        </div>
      </header>
    </>
  );
}
