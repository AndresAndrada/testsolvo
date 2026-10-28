"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import useLanguageStore from "@/stores/languageStore";

export interface LapDetail {
  lap: number;
  stintIndex: number;
  compound: string;
  lapTimeSeconds: number;
  baseTimeSeconds: number;
  driverPenaltySeconds: number;
  teamPenaltySeconds: number;
  tyrePaceSeconds: number;
  wearPenaltySeconds: number;
  rainPenaltySeconds: number;
}

export interface StintSummary {
  compound: string;
  fromLap: number;
  toLap: number;
  laps: number;
  stintTimeSeconds: number;
  avgLapTimeSeconds: number;
  pitStopLossAfterSeconds: number;
}

export interface SimulationPagination {
  limit: number;
  offset: number;
  totalItems: number;
  hasMore: boolean;
  nextOffset: number;
}

export interface SimulationResult {
  race: { id: string; name: string; laps: number; circuitName?: string };
  driver: { id: string; name: string };
  team: { id: string; name: string };
  stints: StintSummary[];
  laps: LapDetail[];
  totals: {
    lapTimeSeconds: number;
    pitLossSeconds: number;
    raceTimeSeconds: number;
    raceTimeFormatted: string;
  };
  __pagination?: SimulationPagination;
  __originalStints?: Array<{ compound: string; fromLap: number; toLap: number }>;
}

interface ResultsViewProps {
  result: SimulationResult;
}

function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(3)}s`;
}

const LAPS_PER_PAGE = 20;

export default function ResultsView({ result }: ResultsViewProps) {
  const { t } = useLanguageStore();
  const [laps, setLaps] = useState<LapDetail[]>([]);
  const [pagination, setPagination] = useState<SimulationPagination | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<HTMLTableRowElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLaps(Array.isArray(result.laps) ? result.laps : []);
    setPagination((result as any).__pagination || null);
  }, [result]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !pagination || !pagination.hasMore) return;
    const raceId = result.race?.id;
    const driverId = result.driver?.id;
    const originalStints = (result as any).__originalStints;
    
    if (!raceId || !driverId || !originalStints) {
      return;
    }

    setLoadingMore(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raceId,
          driverId,
          stints: originalStints,
          limit: pagination.limit || LAPS_PER_PAGE,
          offset: pagination.nextOffset,
        }),
      });
      const json = await res.json();
      
      if (json.error) {
        return;
      }
      
      const simulationData = json.data?.simulation || json.data?.data?.simulation || json.data;
      const nextPagination = json.data?.pagination || json.data?.data?.pagination;
      
      if (simulationData?.laps && Array.isArray(simulationData.laps)) {
        setLaps((prev) => [...prev, ...simulationData.laps]);
      }
      if (nextPagination) {
        setPagination(nextPagination);
      }
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pagination, result]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && pagination?.hasMore && !loadingMore) {
        loadMore();
      }
    },
    [pagination?.hasMore, loadingMore, loadMore]
  );

  useEffect(() => {
    const option = {
      root: scrollContainerRef.current,
      rootMargin: "120px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

  const displayedLaps = laps;
  const hasMoreLaps = pagination?.hasMore || false;
  const totalItems = pagination?.totalItems ?? result.laps.length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('resultsView.result')}</p>
        <h2 className="mt-1 text-xl font-medium">{result.race.name}</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {result?.race?.circuitName ? result.race.circuitName : t('resultsView.circuit')} · {result.driver.name} · {result.team.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="relative overflow-hidden rounded-sm border border-red-500/40 bg-gradient-to-br from-red-500/10 to-transparent p-4">
          <div className="absolute right-0 top-0 h-px w-16 bg-red-500" />
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('resultsView.totalTime')}</p>
          <p className="mt-2 text-2xl font-medium">{result.totals.raceTimeFormatted}</p>
        </div>
        <div className="rounded-sm border border-white/5 bg-white/[0.01] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('resultsView.laps')}</p>
          <p className="mt-2 text-lg text-zinc-200">{formatSeconds(result.totals.lapTimeSeconds)}</p>
        </div>
        <div className="rounded-sm border border-white/5 bg-white/[0.01] p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('resultsView.pitStops')}</p>
          <p className="mt-2 text-lg text-zinc-200">{formatSeconds(result.totals.pitLossSeconds)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('resultsView.stints')}</p>
          <div className="h-px w-24 bg-gradient-to-r from-red-500/60 to-transparent" />
        </div>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">{t('resultsView.compound')}</th>
                <th className="px-3 py-2">{t('resultsView.laps')}</th>
                <th className="px-3 py-2">{t('resultsView.time')}</th>
                <th className="px-3 py-2">{t('resultsView.average')}</th>
                <th className="px-3 py-2">{t('resultsView.loss')}</th>
              </tr>
            </thead>
            <tbody>
              {result.stints.map((stint, idx) => (
                <tr key={idx} className="border-b border-white/5">
                  <td className="px-3 py-2 text-zinc-500">{idx + 1}</td>
                  <td className="px-3 py-2 text-zinc-200">{stint.compound}</td>
                  <td className="px-3 py-2 text-zinc-400">
                    {t('resultsView.lapShort')}{stint.fromLap}–{t('resultsView.lapShort')}{stint.toLap} · {stint.laps}
                  </td>
                  <td className="px-3 py-2 text-zinc-200">{formatSeconds(stint.stintTimeSeconds)}</td>
                  <td className="px-3 py-2 text-zinc-400">{formatSeconds(stint.avgLapTimeSeconds)}</td>
                  <td className="px-3 py-2 text-zinc-400">
                    {stint.pitStopLossAfterSeconds > 0 ? formatSeconds(stint.pitStopLossAfterSeconds) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('resultsView.lapByLap')}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-600">
              {t('resultsView.showing')} {displayedLaps.length} {t('resultsView.of')} {totalItems}
            </span>
            <div className="h-px w-24 bg-gradient-to-r from-red-500/60 to-transparent" />
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className="mt-3 max-h-[520px] overflow-x-auto overflow-y-auto rounded-sm border border-white/5"
        >
          <table className="min-w-full text-xs">
            <thead className="sticky top-0 bg-[#050505]">
              <tr className="border-b border-white/5 text-left uppercase tracking-[0.2em] text-zinc-500">
                <th className="px-3 py-2">{t('resultsView.lapShort')}</th>
                <th className="px-3 py-2">{t('resultsView.stint')}</th>
                <th className="px-3 py-2">{t('resultsView.comp')}</th>
                <th className="px-3 py-2">{t('resultsView.lap')}</th>
                <th className="px-3 py-2">{t('resultsView.base')}</th>
                <th className="px-3 py-2">{t('resultsView.driver')}</th>
                <th className="px-3 py-2">{t('resultsView.team')}</th>
                <th className="px-3 py-2">{t('resultsView.tyre')}</th>
                <th className="px-3 py-2">{t('resultsView.wear')}</th>
                <th className="px-3 py-2">{t('resultsView.rain')}</th>
              </tr>
            </thead>
            <tbody>
              {displayedLaps.map((lap, index) => (
                <tr
                  key={`${lap.lap}-${index}`}
                  className="border-b border-white/5 hover:bg-white/[0.01]"
                  ref={index === displayedLaps.length - 1 && hasMoreLaps ? observerRef : null}
                >
                  <td className="px-3 py-1.5 text-zinc-500">{lap.lap}</td>
                  <td className="px-3 py-1.5 text-zinc-400">{lap.stintIndex + 1}</td>
                  <td className="px-3 py-1.5 text-zinc-200">{lap.compound}</td>
                  <td className="px-3 py-1.5 text-zinc-100">{formatSeconds(lap.lapTimeSeconds)}</td>
                  <td className="px-3 py-1.5 text-zinc-500">{formatSeconds(lap.baseTimeSeconds)}</td>
                  <td className="px-3 py-1.5 text-zinc-500">{formatSeconds(lap.driverPenaltySeconds)}</td>
                  <td className="px-3 py-1.5 text-zinc-500">{formatSeconds(lap.teamPenaltySeconds)}</td>
                  <td className="px-3 py-1.5 text-zinc-500">{formatSeconds(lap.tyrePaceSeconds)}</td>
                  <td className="px-3 py-1.5 text-zinc-500">{formatSeconds(lap.wearPenaltySeconds)}</td>
                  <td className="px-3 py-1.5 text-zinc-500">{formatSeconds(lap.rainPenaltySeconds)}</td>
                </tr>
              ))}
              {hasMoreLaps && (
                <tr>
                  <td colSpan={10} className="px-3 py-4 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-1 w-12 animate-pulse bg-red-500/40" />
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                        {loadingMore ? t('resultsView.loadingMore') : t('resultsView.scrollMore')}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
