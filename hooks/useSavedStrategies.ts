"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface SavedStrategy {
  id: number;
  name: string;
  raceId: string;
  driverId: string;
  stints: any[];
  simulationResult: any;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyPagination {
  limit: number;
  offset: number;
  totalItems: number;
  hasMore: boolean;
  nextOffset: number;
}

export function useSavedStrategies(limit = 10) {
  const [strategies, setStrategies] = useState<SavedStrategy[]>([]);
  const [pagination, setPagination] = useState<StrategyPagination | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingMoreStrategies, setLoadingMoreStrategies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strategyObserverRef = useRef<HTMLTableRowElement | null>(null);
  const strategyScrollRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<StrategyPagination | null>(null);
  const loadingMoreRef = useRef(false);
  const loadingInitialRef = useRef(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  useEffect(() => {
    loadingMoreRef.current = loadingMoreStrategies;
  }, [loadingMoreStrategies]);

  const fetchStrategies = useCallback(
    async (append = false) => {
      if (inFlightRef.current) return;

      if (!append) {
        if (loadingInitialRef.current) return;
        loadingInitialRef.current = true;
        inFlightRef.current = true;
        setLoadingHistory(true);
        setStrategies([]);
        setPagination(null);
        paginationRef.current = null;
        setError(null);
      } else {
        if (loadingMoreRef.current) return;
        const currentPagination = paginationRef.current;
        if (!currentPagination?.hasMore) return;
        loadingMoreRef.current = true;
        inFlightRef.current = true;
        setLoadingMoreStrategies(true);
        setError(null);
      }

      try {
        const currentPagination = paginationRef.current;
        const currentOffset = append && currentPagination ? currentPagination.nextOffset : 0;
        const res = await fetch(`/api/strategies?limit=${limit}&offset=${currentOffset}`);
        if (!res.ok) {
          throw new Error(`Error ${res.status}`);
        }
        const json = await res.json();

        const fetched = json.data?.strategies || json.strategies || [];
        const fetchedPagination = json.data?.pagination || json.pagination;

        if (append) {
          setStrategies((prev) => [...prev, ...fetched]);
        } else {
          setStrategies(fetched);
        }

        if (fetchedPagination) {
          setPagination(fetchedPagination);
          paginationRef.current = fetchedPagination;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar estrategias guardadas");
      } finally {
        if (!append) {
          loadingInitialRef.current = false;
        }
        loadingMoreRef.current = false;
        inFlightRef.current = false;
        setLoadingHistory(false);
        setLoadingMoreStrategies(false);
      }
    },
    [limit]
  );

  const refresh = useCallback(() => {
    loadingInitialRef.current = false;
    fetchStrategies(false);
  }, [fetchStrategies]);

  const fetchMore = useCallback(() => {
    fetchStrategies(true);
  }, [fetchStrategies]);

  const retry = useCallback(() => {
    if (strategies.length === 0) {
      loadingInitialRef.current = false;
      fetchStrategies(false);
    } else {
      fetchStrategies(true);
    }
  }, [fetchStrategies, strategies.length]);

  useEffect(() => {
    fetchStrategies(false);
  }, [fetchStrategies]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry?.isIntersecting) return;
      const currentPagination = paginationRef.current;
      if (!currentPagination?.hasMore) return;
      if (loadingMoreRef.current || inFlightRef.current || loadingInitialRef.current) return;
      fetchStrategies(true);
    },
    [fetchStrategies]
  );

  useEffect(() => {
    const root = strategyScrollRef.current;
    const target = strategyObserverRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(handleObserver, {
      root,
      rootMargin: "200px",
      threshold: 0.1,
    });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [handleObserver, strategies.length, pagination?.hasMore]);

  return {
    strategies,
    pagination,
    loadingHistory,
    loadingMoreStrategies,
    error,
    strategyObserverRef,
    strategyScrollRef,
    refresh,
    fetchMore,
    retry,
  };
}
