"use client";

import { useState } from "react";
import RaceSelector from "@/components/race-selector";
import DriverSelector from "@/components/driver-selector";
import StrategyBuilder, { type Stint } from "@/components/strategy-builder";
import ResultsView, { type SimulationResult } from "@/components/results-view";

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [raceLaps, setRaceLaps] = useState<number>(0);
  const [stints, setStints] = useState<Stint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const handleRaceSelect = async (raceId: string) => {
    setSelectedRaceId(raceId);
    setResult(null);
    setStints([]);
    setError(null);
    if (!raceId) {
      setRaceLaps(0);
      return;
    }
    try {
      const res = await fetch(`/api/races/${raceId}`);
      const json = await res.json();
      if (json.error) {
        setError(json.error.message || "Error al cargar datos de la carrera");
        return;
      }
      const race = json.data?.race || json.data;
      setRaceLaps(race?.laps || 0);
    } catch (err) {
      setError("Error al cargar datos de la carrera");
    }
  };

  const handleSimulate = async () => {
    if (!selectedRaceId || !selectedDriverId || stints.length === 0) {
      setError("Selecciona carrera, piloto y define al menos un stint");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raceId: selectedRaceId,
          driverId: selectedDriverId,
          stints,
        }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error.message || "Error en la simulación");
        return;
      }
      setResult(json.data?.simulation || json.data);
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">F1 Race Strategist</h1>
          <p className="mt-1 text-sm text-gray-600">
            Simulador de estrategias de carrera con desglose lap by lap
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Panel de configuración */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-base font-medium text-gray-900">Configuración</h2>
              <div className="space-y-4">
                <RaceSelector selectedRaceId={selectedRaceId} onSelectRace={handleRaceSelect} />
                <DriverSelector selectedDriverId={selectedDriverId} onSelectDriver={setSelectedDriverId} />
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <StrategyBuilder raceLaps={raceLaps} stints={stints} onChangeStints={setStints} />
              <button
                type="button"
                onClick={handleSimulate}
                disabled={loading || !selectedRaceId || !selectedDriverId || stints.length === 0}
                className="mt-4 w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Simulando..." : "Simular estrategia"}
              </button>
            </div>
          </div>

          {/* Panel de resultados */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
              )}
              {!result && !error && !loading && (
                <div className="py-12 text-center text-sm text-gray-500">
                  Configura una carrera, piloto y estrategia para simular
                </div>
              )}
              {loading && (
                <div className="py-12 text-center text-sm text-gray-500">Simulando carrera...</div>
              )}
              {result && <ResultsView result={result} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
