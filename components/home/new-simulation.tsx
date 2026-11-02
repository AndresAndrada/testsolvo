import DriverSelector from "./driver-selector";
import RaceSelector from "./race-selector";
import StrategyBuilder, { type Stint } from "@/components/home/strategy-builder";
import { type SimulationResult } from "@/components/home/results-view";

export default function NewSimulation(
    { t, onSimulate, handleSaveAndSimulate, selectedRaceId, onSelectRace, selectedDriverId, onSelectDriver, raceLaps, strategyName, setStrategyName, stints, setStints, loading, error, result }: { 
        t: (key: string) => string; 
        selectedRaceId: string | null;
        onSimulate: () => void;
        handleSaveAndSimulate: () => void;
         onSelectRace: (raceId: string | null) => void;
          selectedDriverId: string | null;
           onSelectDriver: (driverId: string | null) => void 
        strategyName: string | null;
        setStrategyName: (name: string | null) => void;
        raceLaps: number;
        setRaceLaps: (laps: number) => void;
        stints: Stint[] | null;
        setStints: (stints: Stint[] | null) => void;
        loading: boolean;
        error: string | null;
        result: SimulationResult | null;
        }) {
  return (
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
                       <RaceSelector selectedRaceId={selectedRaceId} onSelectRace={onSelectRace} />
                       <DriverSelector selectedDriverId={selectedDriverId} onSelectDriver={onSelectDriver} />
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
                       <StrategyBuilder raceLaps={raceLaps} stints={stints ?? []} onChangeStints={setStints} />
                     </div>
                     <div className="mt-4 space-y-2">
                       <label className="text-xs uppercase tracking-[0.25em] text-zinc-500">{t('page.strategyName')}</label>
                       <input
                         type="text"
                         value={strategyName ?? ''}
                         onChange={(e) => setStrategyName(e.target.value)}
                         className="w-full rounded-sm border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 focus:border-red-500/60 focus:outline-none"
                         placeholder={t('page.strategyNamePlaceholder')}
                       />
                     </div>
                     <div className="mt-4 flex flex-col gap-2">
                       <button
                         type="button"
                         onClick={handleSaveAndSimulate}
                         disabled={loading || !selectedRaceId || !selectedDriverId || (stints?.length || 0) === 0}
                         className="w-full rounded-sm bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 text-sm font-medium uppercase tracking-[0.25em] text-white shadow-[0_20px_60px_-30px_rgba(239,68,68,0.9)] transition hover:from-red-500 hover:to-red-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                       >
                         {loading ? t('page.savingAndSimulating') : t('page.saveAndSimulate')}
                       </button>
                       <button
                         type="button"
                         onClick={onSimulate}
                         disabled={loading || !selectedRaceId || !selectedDriverId || (stints?.length || 0) === 0}
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
                   </div>
                 </div>
               </section>
             </div>
  )
}