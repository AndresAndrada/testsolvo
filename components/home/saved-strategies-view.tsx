"use client";

import { useSavedStrategies } from "@/app/hooks/useSavedStrategies";
import useLanguageStore from "@/stores/languageStore";

export default function SavedStrategiesView() {
  const { t } = useLanguageStore();
  const {
    strategies,
    pagination,
    loadingHistory,
    loadingMore,
    error,
    scrollRef,
    sentinelRef,
    refresh,
    loadMore,
  } = useSavedStrategies(10);

  const hasData = strategies.length > 0;
  const showEmpty = !loadingHistory && !hasData && !error;

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
            disabled={loadingHistory || loadingMore}
            aria-label={t("page.refresh")}
          >
            {t("page.refresh")}
          </button>
        </div>

        <div className="mt-6">
          {error && (
            <div className="mb-6 rounded-sm border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>{error}</p>
                <button
                  type="button"
                  onClick={refresh}
                  className="self-start rounded-sm border border-red-400/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-red-100 transition hover:border-red-300/80 hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  disabled={loadingHistory || loadingMore}
                >
                  {t("page.refresh")}
                </button>
              </div>
            </div>
          )}

          {loadingHistory && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="h-1 w-10 animate-pulse bg-red-500" />
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-zinc-500">{t("page.loadingHistory")}</p>
            </div>
          )}

          {showEmpty && <p className="text-sm text-zinc-500">{t("page.noSavedStrategies")}</p>}

          {hasData && (
            <div
              ref={scrollRef}
              className="max-h-[520px] overflow-x-auto overflow-y-auto rounded-sm border border-white/5"
            >
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-[#050505]">
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
                  {strategies.map((s) => (
                    <tr key={s.id} className="border-b border-white/5">
                      <td className="px-3 py-2 text-zinc-500">{s.id}</td>
                      <td className="px-3 py-2 text-zinc-200">{s.name}</td>
                      <td className="px-3 py-2 text-zinc-400">{s.raceId}</td>
                      <td className="px-3 py-2 text-zinc-400">{s.driverId}</td>
                      <td className="px-3 py-2 text-zinc-400">{Array.isArray(s.stints) ? s.stints.length : 0}</td>
                      <td className="px-3 py-2 text-zinc-400">{s.simulationResult ? t("page.yes") : t("page.no")}</td>
                      <td className="px-3 py-2 text-zinc-500">{new Date(s.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                  {pagination?.hasMore && (
                    <tr>
                      <td colSpan={7} className="px-0 py-0">
                        <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
                      </td>
                    </tr>
                  )}
                  {loadingMore && (
                    <tr>
                      <td colSpan={7} className="px-3 py-3 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="h-1 w-12 animate-pulse bg-red-500/40" />
                          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">{t("page.loadingMore")}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {hasData && pagination && (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-600">
                {t("page.showing")} {strategies.length} {t("page.of")} {pagination.totalItems}
              </p>
              {pagination.hasMore && !loadingMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  className="self-start rounded-sm border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400 transition hover:border-white/30 hover:text-zinc-200 cursor-pointer"
                >
                  {t("page.loadMore") || "Cargar más"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
