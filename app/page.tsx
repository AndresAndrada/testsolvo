"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import RaceSelector from "@/components/home/race-selector";
import DriverSelector from "@/components/home/driver-selector";
import StrategyBuilder, { type Stint } from "@/components/home/strategy-builder";
import ResultsView, { type SimulationResult } from "@/components/home/results-view";
import NavigationTabs from "@/components/ui/navigation-tabs";

interface SavedStrategy {
  id: number;
  name: string;
  raceId: string;
  driverId: string;
  stints: Stint[];
  simulationResult: any;
  createdAt: string;
  updatedAt: string;
}

interface StrategyPagination {
  limit: number;
  offset: number;
  totalItems: number;
  hasMore: boolean;
  nextOffset: number;
}

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [raceLaps, setRaceLaps] = useState<number>(0);
  const [stints, setStints] = useState<Stint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [strategyName, setStrategyName] = useState("Estrategia Principal");
  const [savedStrategies, setSavedStrategies] = useState<SavedStrategy[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState("nueva");
  const [strategyPagination, setStrategyPagination] = useState<StrategyPagination | null>(null);
  const [loadingMoreStrategies, setLoadingMoreStrategies] = useState(false);
  const strategyObserverRef = useRef<HTMLTableRowElement | null>(null);
  const strategyScrollRef = useRef<HTMLDivElement | null>(null);

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

  const fetchSavedStrategies = async (append = false) => {
    if (!append) {
      setLoadingHistory(true);
      setSavedStrategies([]);
      setStrategyPagination(null);
    } else {
      setLoadingMoreStrategies(true);
    }
    
    try {
      const offset = append && strategyPagination ? strategyPagination.nextOffset : 0;
      const res = await fetch(`/api/strategies?limit=10&offset=${offset}`);
      const json = await res.json();
      
      const strategies = json.data?.strategies || json.strategies || [];
      const pagination = json.data?.pagination || json.pagination;
      
      if (append) {
        setSavedStrategies((prev) => [...prev, ...strategies]);
      } else {
        setSavedStrategies(strategies);
      }
      
      if (pagination) {
        setStrategyPagination(pagination);
      }
    } catch {
      // silencioso
    } finally {
      setLoadingHistory(false);
      setLoadingMoreStrategies(false);
    }
  };

  useEffect(() => {
    fetchSavedStrategies(false);
  }, []);

  const handleStrategyObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && strategyPagination?.hasMore && !loadingMoreStrategies) {
        fetchSavedStrategies(true);
      }
    },
    [strategyPagination?.hasMore, loadingMoreStrategies]
  );

  useEffect(() => {
    const option = {
      root: strategyScrollRef.current,
      rootMargin: "100px",
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleStrategyObserver, option);

    if (strategyObserverRef.current) {
      observer.observe(strategyObserverRef.current);
    }

    return () => {
      if (strategyObserverRef.current) {
        observer.unobserve(strategyObserverRef.current);
      }
    };
  }, [handleStrategyObserver]);

  const handleSaveAndSimulate = async () => {
    if (!selectedRaceId || !selectedDriverId || stints.length === 0) {
      setError("Selecciona carrera, piloto y define al menos un stint");
      return;
    }
    if (!strategyName.trim()) {
      setError("Introduce un nombre para la estrategia");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const createRes = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: strategyName.trim(),
          raceId: selectedRaceId,
          driverId: selectedDriverId,
          stints,
        }),
      });
      const createJson = await createRes.json();
      if (createJson.error) {
        setError(createJson.error.message || "Error al guardar la estrategia");
        setLoading(false);
        return;
      }
      const strategy = createJson.data?.strategy || createJson.strategy;
      const strategyId = strategy?.id;
      if (!strategyId) {
        setError("No se pudo obtener el ID de la estrategia");
        setLoading(false);
        return;
      }

      const simRes = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          strategyId,
          limit: 20,
          offset: 0,
        }),
      });
      const simJson = await simRes.json();
      if (simJson.error) {
        setError(simJson.error.message || "Error en la simulación");
        fetchSavedStrategies(false);
        setLoading(false);
        return;
      }
      const simulationData = simJson.data?.simulation || simJson.simulation;
      const pagination = simJson.data?.pagination || simJson.pagination;
      if (simulationData && pagination) {
        (simulationData as any).__pagination = pagination;
      }
      // Guardar los stints originales para paginación
      if (simulationData) {
        (simulationData as any).__originalStints = stints;
      }
      setResult(simulationData);
      fetchSavedStrategies(false);
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
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
          limit: 20,
          offset: 0,
        }),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error.message || "Error en la simulación");
        return;
      }
      const simulationData = json.data?.simulation || json.data?.data?.simulation || json.data;
      const pagination = json.data?.pagination || json.data?.data?.pagination;
      if (simulationData && pagination) {
        (simulationData as any).__pagination = pagination;
      }
      // Guardar los stints originales para paginación
      if (simulationData) {
        (simulationData as any).__originalStints = stints;
      }
      setResult(simulationData);
    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <header className="relative border-b border-red-600/40 bg-gradient-to-r from-black via-[#0a0a0a] to-black">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 bg-red-600" />
                <p className="text-xs uppercase tracking-[0.4em] text-red-500">Formula 1</p>
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Race Strategist</h1>
              <p className="mt-2 text-sm text-zinc-400">
                Simulador de estrategia con desgaste de neumáticos, paradas y clima
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-600">Pit Wall Control</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "nueva" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_1fr]">
            <div className="space-y-6">
              <section className="relative overflow-hidden rounded-sm border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-[0_40px_80px_-60px_rgba(239,68,68,0.6)]">
                <div className="absolute -top-24 right-0 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />
                <div className="relative p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Configuración</p>
                      <h2 className="mt-1 text-lg font-medium">Gran Premio</h2>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-red-500 to-transparent" />
                  </div>
                  <div className="mt-4 space-y-4">
                    <RaceSelector selectedRaceId={selectedRaceId} onSelectRace={handleRaceSelect} />
                    <DriverSelector selectedDriverId={selectedDriverId} onSelectDriver={setSelectedDriverId} />
                  </div>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-sm border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
                <div className="absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />
                <div className="relative p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Estrategia</p>
                      <h2 className="mt-1 text-lg font-medium">Plan de stints</h2>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-red-500 to-transparent" />
                  </div>
                  <div className="mt-4">
                    <StrategyBuilder raceLaps={raceLaps} stints={stints} onChangeStints={setStints} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">Nombre de la estrategia</label>
                    <input
                      type="text"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      className="w-full rounded-sm border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 focus:border-red-500/60 focus:outline-none"
                      placeholder="Estrategia Principal"
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAndSimulate}
                      disabled={loading || !selectedRaceId || !selectedDriverId || stints.length === 0}
                      className="w-full rounded-sm bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] text-white shadow-[0_20px_60px_-30px_rgba(239,68,68,0.9)] transition hover:from-red-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {loading ? "Guardando y simulando..." : "Guardar y Simular"}
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulate}
                      disabled={loading || !selectedRaceId || !selectedDriverId || stints.length === 0}
                      className="w-full rounded-sm border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-zinc-300 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Simular sin guardar
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <section className="relative overflow-hidden rounded-sm border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-600/8 blur-3xl" />
              <div className="relative p-5 sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Telemetría</p>
                    <h2 className="mt-1 text-lg font-medium">Desglose de carrera</h2>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-red-500/60 to-transparent sm:mx-6" />
                </div>
                <div className="mt-6">
                  {error && (
                    <div className="mb-6 rounded-sm border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
                      {error}
                    </div>
                  )}
                  {!result && !error && !loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-1 w-10 bg-red-600" />
                      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-500">En espera</p>
                      <p className="mt-2 max-w-sm text-sm text-zinc-400">
                        Configura carrera, piloto y estrategia para obtener el desglose lap by lap
                      </p>
                    </div>
                  )}
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-1 w-10 animate-pulse bg-red-500" />
                      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-500">Procesando</p>
                      <p className="mt-2 text-sm text-zinc-400">Guardando y calculando estrategia...</p>
                    </div>
                  )}
                  {result && <ResultsView result={result} />}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "guardadas" && (
          <section className="relative overflow-hidden rounded-sm border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="relative p-5 sm:p-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">Historial</p>
                  <h2 className="mt-1 text-lg font-medium">Simulaciones Guardadas</h2>
                </div>
                <button
                  type="button"
                  onClick={() => fetchSavedStrategies()}
                  className="text-xs uppercase tracking-[0.25em] text-zinc-500 hover:text-zinc-300 border border-white/10 hover:border-white/30 p-2"
                >
                  Actualizar
                </button>
              </div>
              <div className="mt-6">
                {loadingHistory && <p className="text-sm text-zinc-500">Cargando historial...</p>}
                {!loadingHistory && savedStrategies.length === 0 && (
                  <p className="text-sm text-zinc-500">No hay estrategias guardadas aún.</p>
                )}
                {savedStrategies.length > 0 && (
                  <div
                    ref={strategyScrollRef}
                    className="max-h-[520px] overflow-x-auto overflow-y-auto rounded-sm border border-white/5"
                  >
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-[#050505]">
                        <tr className="border-b border-white/5 text-left text-xs uppercase tracking-[0.2em] text-zinc-500">
                          <th className="px-3 py-2">ID</th>
                          <th className="px-3 py-2">Nombre</th>
                          <th className="px-3 py-2">Carrera</th>
                          <th className="px-3 py-2">Piloto</th>
                          <th className="px-3 py-2">Stints</th>
                          <th className="px-3 py-2">Simulado</th>
                          <th className="px-3 py-2">Creado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {savedStrategies.map((s, index) => (
                          <tr
                            key={s.id}
                            className="border-b border-white/5"
                            ref={index === savedStrategies.length - 1 && strategyPagination?.hasMore ? strategyObserverRef : null}
                          >
                            <td className="px-3 py-2 text-zinc-500">{s.id}</td>
                            <td className="px-3 py-2 text-zinc-200">{s.name}</td>
                            <td className="px-3 py-2 text-zinc-400">{s.raceId}</td>
                            <td className="px-3 py-2 text-zinc-400">{s.driverId}</td>
                            <td className="px-3 py-2 text-zinc-400">{Array.isArray(s.stints) ? s.stints.length : 0}</td>
                            <td className="px-3 py-2 text-zinc-400">{s.simulationResult ? "Sí" : "No"}</td>
                            <td className="px-3 py-2 text-zinc-500">{new Date(s.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                        {strategyPagination?.hasMore && (
                          <tr>
                            <td colSpan={7} className="px-3 py-3 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="h-1 w-12 animate-pulse bg-red-500/40" />
                                <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
                                  {loadingMoreStrategies ? "Cargando más..." : "Desplaza para cargar más"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {strategyPagination && (
                  <div className="mt-2 text-xs text-zinc-600">
                    Mostrando {savedStrategies.length} de {strategyPagination.totalItems}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
