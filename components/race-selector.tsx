"use client";

import { useEffect, useState } from "react";

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

interface RaceSelectorProps {
  selectedRaceId: string | null;
  onSelectRace: (raceId: string) => void;
}

export default function RaceSelector({ selectedRaceId, onSelectRace }: RaceSelectorProps) {
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/races");
        const json = await res.json();
        if (json.error) {
          setError(json.error.message || "Error al cargar carreras");
          return;
        }
        setRaces(json.data?.races || []);
      } catch (err) {
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-600">Cargando carreras...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-2">
      <label htmlFor="race" className="block text-sm font-medium text-gray-900">
        Seleccionar carrera
      </label>
      <select
        id="race"
        value={selectedRaceId || ""}
        onChange={(e) => onSelectRace(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">-- Selecciona una carrera --</option>
        {races.map((race) => (
          <option key={race.id} value={race.id}>
            Ronda {race.round}: {race.name} ({race.circuit?.name || race.circuitId})
          </option>
        ))}
      </select>
      {selectedRaceId && (
        <div className="mt-2 rounded-md bg-gray-50 p-3 text-xs text-gray-700">
          {(() => {
            const race = races.find((r) => r.id === selectedRaceId);
            if (!race) return null;
            return (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Vueltas:</span> {race.laps}
                </div>
                <div>
                  <span className="font-medium">Temperatura:</span> {race.temperature}°C
                </div>
                <div>
                  <span className="font-medium">Probabilidad de lluvia:</span>{" "}
                  {(race.rainProbability * 100).toFixed(0)}%
                </div>
                {race.circuit && (
                  <div>
                    <span className="font-medium">Circuito:</span> {race.circuit.name} ({race.circuit.country})
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
