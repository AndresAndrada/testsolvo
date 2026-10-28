﻿import { useState, useEffect, useCallback } from 'react';

export interface Race {
  id: string;
  name: string;
  round: number;
  date: string;
  circuitId: string;
  laps: number;
  temperature: number;
  rainProbability: number;
  circuit?: {
    name: string;
    country: string;
    lengthKm: number;
  };
}

export const useRaces = () => {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/races');
      
      if (!response.ok) {
        throw new Error(`Error al cargar carreras: ${response.statusText}`);
      }
      
      const json = await response.json();
      
      if (json.error) {
        throw new Error(json.error.message || 'Error al cargar carreras');
      }
      
      setRaces(json.data?.races || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setRaces([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRaces();
  }, [fetchRaces]);

  return {
    races,
    loading,
    error,
    refetch: fetchRaces
  };
};
