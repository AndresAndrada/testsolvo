import { useState, useEffect, useCallback } from 'react';

export interface Tyre {
  id: number;
  compound: string;
  degradation: number;
  grip: number;
}

export const useTyres = () => {
  const [tyres, setTyres] = useState<Tyre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTyres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/tyres');
      
      if (!response.ok) {
        throw new Error(`Error al cargar neumáticos: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTyres(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setTyres([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTyres();
  }, [fetchTyres]);

  return {
    tyres,
    loading,
    error,
    refetch: fetchTyres
  };
};
