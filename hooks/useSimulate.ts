import { useState, useCallback } from 'react';

export interface Stint {
  fromLap: number;
  toLap: number;
  tyreId: number;
}

export interface Lap {
  lap: number;
  tyre: string;
  lapTime: number;
  totalTime: number;
}

export interface SimulationResult {
  totalTime: number;
  laps: Lap[];
  stints: Stint[];
}

export interface Pagination {
  limit: number;
  offset: number;
  totalItems: number;
  hasMore: boolean;
  nextOffset: number;
}

interface SimulateParams {
  raceId: number;
  driverId: number;
  stints: Stint[];
  limit?: number;
  offset?: number;
}

export const useSimulate = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(async (params: SimulateParams): Promise<{ simulation: SimulationResult; pagination: Pagination }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raceId: params.raceId,
          driverId: params.driverId,
          stints: params.stints,
          limit: params.limit,
          offset: params.offset
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || `Error en la simulación: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en la simulación';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    simulate,
    loading,
    error
  };
};
