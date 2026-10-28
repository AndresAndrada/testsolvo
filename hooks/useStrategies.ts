import { useState, useCallback } from 'react';

export interface Strategy {
  id: number;
  name: string;
  raceId: number;
  driverId: number;
  stints: any[];
  totalTime: number;
  createdAt: string;
}

export interface Pagination {
  limit: number;
  offset: number;
  totalItems: number;
  hasMore: boolean;
  nextOffset: number;
}

interface FetchStrategiesParams {
  limit?: number;
  offset?: number;
  raceId?: number;
}

interface SaveStrategyParams {
  name: string;
  raceId: number;
  driverId: number;
  stints: any[];
  totalTime: number;
}

export const useStrategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = useCallback(async (params?: FetchStrategiesParams) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());
      if (params?.raceId) queryParams.append('raceId', params.raceId.toString());

      const url = `/api/strategies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error al cargar estrategias: ${response.statusText}`);
      }

      const data = await response.json();

      // Si offset > 0, agregar a las estrategias existentes
      if (params?.offset && params.offset > 0) {
        setStrategies((prev) => [...prev, ...(data.strategies || [])]);
      } else {
        setStrategies(data.strategies || []);
      }

      setPagination(data.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      if (!params?.offset || params.offset === 0) {
        setStrategies([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const saveStrategy = useCallback(async (params: SaveStrategyParams): Promise<Strategy> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error al guardar estrategia: ${response.statusText}`);
      }

      const newStrategy = await response.json();
      setStrategies((prev) => [newStrategy, ...prev]);
      
      return newStrategy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al guardar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteStrategy = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/strategies/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error al eliminar estrategia: ${response.statusText}`);
      }

      setStrategies((prev) => prev.filter((strategy) => strategy.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (pagination?.hasMore) {
      await fetchStrategies({ 
        limit: pagination.limit, 
        offset: pagination.nextOffset 
      });
    }
  }, [pagination, fetchStrategies]);

  return {
    strategies,
    pagination,
    loading,
    error,
    fetchStrategies,
    saveStrategy,
    deleteStrategy,
    loadMore
  };
};
