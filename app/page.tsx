"use client";

import { useState } from "react";
import RaceSelector from "@/components/home/race-selector";
import DriverSelector from "@/components/home/driver-selector";
import StrategyBuilder, { type Stint } from "@/components/home/strategy-builder";
import ResultsView, { type SimulationResult } from "@/components/home/results-view";
import NavigationTabs from "@/components/ui/navigation-tabs";
import Navbar from "@/components/navBar/navbar";
import SavedStrategiesView from "@/components/home/saved-strategies-view";
import useLanguageStore from "@/stores/languageStore";

export default function Home() {
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [raceLaps, setRaceLaps] = useState<number>(0);
  const [stints, setStints] = useState<Stint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [strategyName, setStrategyName] = useState("");
  const [activeTab, setActiveTab] = useState("nueva");
  const { t } = useLanguageStore();

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
        setError(json.error.message || t('page.errorLoadingRace'));
        return;
      }
      const race = json.data?.race || json.data;
      setRaceLaps(race?.laps || 0);
    } catch (err) {
      setError(t('page.errorLoadingRace'));
    }
  };



  const handleSaveAndSimulate = async () => {
    if (!selectedRaceId || !selectedDriverId || stints.length === 0) {
      setError(t('page.selectRaceDriverStints'));
      return;
    }
    if (!strategyName.trim()) {
      setError(t('page.enterStrategyName'));
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
        setError(createJson.error.message || t('page.errorSavingStrategy'));
        setLoading(false);
        return;
      }
      const strategy = createJson.data?.strategy || createJson.strategy;
      const strategyId = strategy?.id;
      if (!strategyId) {
        setError(t('page.errorGettingStrategyId'));
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
        setError(simJson.error.message || t('page.errorSimulation'));
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
    } catch {
      setError(t('page.errorConnectingServer'));
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (!selectedRaceId || !selectedDriverId || stints.length === 0) {
      setError(t('page.selectRaceDriverStints'));
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
        setError(json.error.message || t('page.errorSimulation'));
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
      setError(t('page.errorConnectingServer'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100">
      <Navbar />

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
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('page.configuration')}</p>
                      <h2 className="mt-1 text-lg font-medium">{t('page.grandPrix')}</h2>
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
                      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('page.strategy')}</p>
                      <h2 className="mt-1 text-lg font-medium">{t('page.stintPlan')}</h2>
                    </div>
                    <div className="h-px w-16 bg-gradient-to-r from-red-500 to-transparent" />
                  </div>
                  <div className="mt-4">
                    <StrategyBuilder raceLaps={raceLaps} stints={stints} onChangeStints={setStints} />
                  </div>
                  <div className="mt-4 space-y-2">
                    <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('page.strategyName')}</label>
                    <input
                      type="text"
                      value={strategyName}
                      onChange={(e) => setStrategyName(e.target.value)}
                      className="w-full rounded-sm border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 focus:border-red-500/60 focus:outline-none"
                      placeholder={t('page.strategyNamePlaceholder')}
                    />
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleSaveAndSimulate}
                      disabled={loading || !selectedRaceId || !selectedDriverId || stints.length === 0}
                      className="w-full rounded-sm bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] text-white shadow-[0_20px_60px_-30px_rgba(239,68,68,0.9)] transition hover:from-red-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                      {loading ? t('page.savingAndSimulating') : t('page.saveAndSimulate')}
                    </button>
                    <button
                      type="button"
                      onClick={handleSimulate}
                      disabled={loading || !selectedRaceId || !selectedDriverId || stints.length === 0}
                      className="w-full rounded-sm border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-zinc-300 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                    >
                      {t('page.simulateWithoutSaving')}
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
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">{t('page.telemetry')}</p>
                    <h2 className="mt-1 text-lg font-medium">{t('page.raceBreakdown')}</h2>
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
                      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-500">{t('page.waiting')}</p>
                      <p className="mt-2 max-w-sm text-sm text-zinc-400">
                        {t('page.waitingDescription')}
                      </p>
                    </div>
                  )}
                  {loading && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="h-1 w-10 animate-pulse bg-red-500" />
                      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-500">{t('page.processing')}</p>
                      <p className="mt-2 text-sm text-zinc-400">{t('page.processingDescription')}</p>
                    </div>
                  )}
                  {result && <ResultsView result={result} />}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "guardadas" && <SavedStrategiesView />}
      </main>
    </div>
  );
}
