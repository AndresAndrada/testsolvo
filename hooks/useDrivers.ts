import { useState, useEffect, useCallback } from 'react';

export interface Driver {
  id: string;
  name: string;
  number: number;
  teamId: string;
  pace: number;
  consistency: number;
}

export interface Team {
  id: string;
  name: string;
  carPerformance: number;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both drivers and teams from separate endpoints
      const [driversResponse, teamsResponse] = await Promise.all([
        fetch('/api/drivers'),
        fetch('/api/teams')
      ]);
      
      if (!driversResponse.ok) {
        throw new Error(`Error al cargar pilotos: ${driversResponse.statusText}`);
      }
      
      if (!teamsResponse.ok) {
        throw new Error(`Error al cargar equipos: ${teamsResponse.statusText}`);
      }
      
      const driversJson = await driversResponse.json();
      const teamsJson = await teamsResponse.json();
      
      if (driversJson.error) {
        throw new Error(driversJson.error.message || 'Error al cargar pilotos');
      }
      
      if (teamsJson.error) {
        throw new Error(teamsJson.error.message || 'Error al cargar equipos');
      }
      
      setDrivers(driversJson.data?.drivers || []);
      setTeams(teamsJson.data?.teams || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setDrivers([]);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    teams,
    loading,
    error,
    refetch: fetchDrivers
  };
};
