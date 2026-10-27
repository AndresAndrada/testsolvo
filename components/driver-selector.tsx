"use client";

import { useEffect, useState } from "react";

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

interface DriverSelectorProps {
  selectedDriverId: string | null;
  onSelectDriver: (driverId: string) => void;
}

export default function DriverSelector({ selectedDriverId, onSelectDriver }: DriverSelectorProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [driversRes, teamsRes] = await Promise.all([
          fetch("/api/drivers"),
          fetch("/api/teams"),
        ]);
        const driversJson = await driversRes.json();
        const teamsJson = await teamsRes.json();

        if (driversJson.error) {
          setError(driversJson.error.message || "Error al cargar pilotos");
          return;
        }
        if (teamsJson.error) {
          setError(teamsJson.error.message || "Error al cargar equipos");
          return;
        }

        setDrivers(driversJson.data?.drivers || []);
        setTeams(teamsJson.data?.teams || []);
      } catch (err) {
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || teamId;
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Cargando pilotos...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-2">
      <label htmlFor="driver" className="block text-sm font-medium text-gray-900">
        Seleccionar piloto
      </label>
      <select
        id="driver"
        value={selectedDriverId || ""}
        onChange={(e) => onSelectDriver(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">-- Selecciona un piloto --</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            #{driver.number} {driver.name} - {getTeamName(driver.teamId)}
          </option>
        ))}
      </select>
      {selectedDriverId && (
        <div className="mt-2 rounded-md bg-gray-50 p-3 text-xs text-gray-700">
          {(() => {
            const driver = drivers.find((d) => d.id === selectedDriverId);
            if (!driver) return null;
            const team = teams.find((t) => t.id === driver.teamId);
            return (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Ritmo:</span> {(driver.pace * 100).toFixed(0)}%
                </div>
                <div>
                  <span className="font-medium">Consistencia:</span> {(driver.consistency * 100).toFixed(0)}%
                </div>
                {team && (
                  <div>
                    <span className="font-medium">Rendimiento del coche:</span> {(team.carPerformance * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
