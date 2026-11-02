"use client";

import { useSavedStrategies } from "@/hooks/useSavedStrategies";
import useLanguageStore from "@/stores/languageStore";

export default function SavedStrategiesView() {
  const { t } = useLanguageStore();
  const {
    strategies,
    pagination,
    loadingHistory,
    loadingMoreStrategies,
    error,
    strategyObserverRef,
    strategyScrollRef,
    refresh,
    retry,
  } = useSavedStrategies(10);

  return (
    <section className="relative overflow-hidden rounded-sm border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
      <div className="relative p-5 sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t("page.history")}</p>
            <h2 className="mt-1 text-lg font-medium">{t("page.savedSimulations")}</h2>
          </div>
          <button
            type="button"
            onClick={refresh}
            className="text-xs uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-300 border border-white/10 hover:border-white/30 p-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
            disabled={loadingHistory || loadingMoreStrategies}
            aria-label={t("page.refresh")}
          >
            {t("page.refresh")}
          </button>
        </div>

        <div className="mt-6">
          {loadingHistory && (
            <div className="space-y-2">
              <div className="h-8 animate-pulse rounded-sm bg-white/5" />
              <div className="h-8 animate-pulse rounded-sm bg-white/5" />
              <div className="h-8 animate-pulse rounded-sm bg-white/5" />
              <p className="text-sm text-zinc-500">{t("page.loadingHistory")}</p>
            </div>
          )}

          {error && !loadingHistory && (
            <div className="mb-6 rounded-sm border border-red-500/40 bg-red-500/10 p-4">
              <p className="text-sm text-red-200">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 text-xs uppercase tracking-[0.25em] text-red-200 hover:text-red-100 border border-red-500/40 hover:border-red-400/60 px-3 py-1 transition-colors cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {!loadingHistory && strategies.length === 0 && !error && (
            <p className="text-sm text-zinc-500">{t("page.noSavedStrategies")}</p>
          )}

          {strategies.length > 0 && (
            <div
              ref={strategyScrollRef}
              className="max-h-[520px] overflow-x-auto overflow-y-auto rounded-sm border border-white/5"
              role="region"
              aria-label="Saved strategies list"
            >
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-[#050505] z-10">
                  <tr className="border-b border-white/5 text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">{t("page.name")}</th>
                    <th className="px-3 py-2">{t("page.race")}</th>
                    <th className="px-3 py-2">{t("page.driver")}</th>
                    <th className="px-3 py-2">{t("page.stints")}</th>
                    <th className="px-3 py-2">{t("page.simulated")}</th>
                    <th className="px-3 py-2">{t("page.created")}</th>
                  </tr>
                </thead>
                <tbody>
                  {strategies.map((s, index) => {
                    const isLast = index === strategies.length - 1;
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                        ref={isLast && pagination?.hasMore ? strategyObserverRef : null}
                      >
                        <td className="px-3 py-2 text-zinc-500">{s.id}</td>
                        <td className="px-3 py-2 text-zinc-200">{s.name}</td>
                        <td className="px-3 py-2 text-zinc-400">{s.raceId}</td>
                        <td className="px-3 py-2 text-zinc-400">{s.driverId}</td>
                        <td className="px-3 py-2 text-zinc-400">{Array.isArray(s.stints) ? s.stints.length : 0}</td>
                        <td className="px-3 py-2 text-zinc-400">{s.simulationResult ? t("page.yes") : t("page.no")}</td>
                        <td className="px-3 py-2 text-zinc-500">{new Date(s.createdAt).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {pagination?.hasMore && (
                    <tr aria-live="polite">
                      <td colSpan={7} className="px-3 py-4 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-1 w-12 animate-pulse bg-red-500/40" />
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                            {loadingMoreStrategies ? t("page.loadingMore") : t("page.scrollMore")}
                          </p>
                          {!loadingMoreStrategies && (
                            <button
                              type="button"
                              onClick={retry}
                              className="mt-1 text-xs uppercase tracking-[0.25em] text-zinc-400 hover:text-zinc-200 border border-white/10 hover:border-white/30 px-2 py-1 transition-colors cursor-pointer"
                            >
                              Load more
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {pagination && strategies.length > 0 && (
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-600">
              <span>
                {t("page.showing")} {strategies.length} {t("page.of")} {pagination.totalItems}
              </span>
              {pagination.hasMore && !loadingMoreStrategies && (
                <button
                  type="button"
                  onClick={retry}
                  className="uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Load more
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
