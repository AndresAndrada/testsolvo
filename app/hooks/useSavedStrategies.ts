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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<StrategyPagination | null>(null);
  const loadingRef = useRef({ history: false, more: false });

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const fetchPage = useCallback(
    async (append: boolean) => {
      if (append) {
        if (loadingRef.current.more || loadingRef.current.history) return;
        if (!paginationRef.current?.hasMore) return;
        loadingRef.current.more = true;
        setLoadingMore(true);
        setError(null);
      } else {
        if (loadingRef.current.history || loadingRef.current.more) return;
        loadingRef.current.history = true;
        setLoadingHistory(true);
        setError(null);
        setStrategies([]);
        setPagination(null);
        paginationRef.current = null;
      }

      try {
        const currentOffset = append && paginationRef.current ? paginationRef.current.nextOffset : 0;
        const res = await fetch(`/api/strategies?limit=${limit}&offset=${currentOffset}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();

        const fetched = json.data?.strategies || json.strategies || [];
        const fetchedPagination = json.data?.pagination || json.pagination;

        if (append) {
          setStrategies((prev) => {
            const existingIds = new Set(prev.map((s) => s.id));
            const unique = fetched.filter((s: SavedStrategy) => !existingIds.has(s.id));
            return [...prev, ...unique];
          });
        } else {
          setStrategies(fetched);
        }

        if (fetchedPagination) {
          paginationRef.current = fetchedPagination;
          setPagination(fetchedPagination);
        } else {
          paginationRef.current = null;
          setPagination(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading saved strategies");
      } finally {
        loadingRef.current.history = false;
        loadingRef.current.more = false;
        setLoadingHistory(false);
        setLoadingMore(false);
      }
    },
    [limit]
  );

  const refresh = useCallback(() => {
    fetchPage(false);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    fetchPage(true);
  }, [fetchPage]);

  useEffect(() => {
    fetchPage(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (loadingRef.current.more || loadingRef.current.history) return;
        if (!paginationRef.current?.hasMore) return;
        fetchPage(true);
      },
      {
        root,
        rootMargin: "200px 0px 200px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
    };
  }, [fetchPage, strategies.length]);

  return {
    strategies,
    pagination,
    loadingHistory,
    loadingMore,
    error,
    scrollRef,
    sentinelRef,
    refresh,
    loadMore,
  };
}
