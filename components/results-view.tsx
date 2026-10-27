"use client";

export interface LapDetail {
  lap: number;
  stintIndex: number;
  compound: string;
  lapTimeSeconds: number;
  baseTimeSeconds: number;
  driverPenaltySeconds: number;
  teamPenaltySeconds: number;
  tyrePaceSeconds: number;
  wearPenaltySeconds: number;
  rainPenaltySeconds: number;
}

export interface StintSummary {
  compound: string;
  fromLap: number;
  toLap: number;
  laps: number;
  stintTimeSeconds: number;
  avgLapTimeSeconds: number;
  pitStopLossAfterSeconds: number;
}

export interface SimulationResult {
  race: { id: string; name: string; laps: number; circuitName: string };
  driver: { id: string; name: string };
  team: { id: string; name: string };
  stints: StintSummary[];
  laps: LapDetail[];
  totals: {
    lapTimeSeconds: number;
    pitLossSeconds: number;
    raceTimeSeconds: number;
    raceTimeFormatted: string;
  };
}

interface ResultsViewProps {
  result: SimulationResult;
}

function formatSeconds(seconds: number): string {
  return `${seconds.toFixed(3)}s`;
}

export default function ResultsView({ result }: ResultsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Resultado de la simulación</h2>
        <p className="mt-1 text-sm text-gray-600">
          {result.race.name} - {result.circuitName} | {result.driver.name} ({result.team.name})
        </p>
      </div>

      {/* Totales */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Tiempo total de carrera</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{result.totals.raceTimeFormatted}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Tiempo en vueltas</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{formatSeconds(result.totals.lapTimeSeconds)}</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-xs text-gray-500">Pérdida por paradas</div>
          <div className="mt-1 text-lg font-medium text-gray-900">{formatSeconds(result.totals.pitLossSeconds)}</div>
        </div>
      </div>

      {/* Desglose por stint */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-900">Desglose por stint</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Stint
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Compuesto
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Vueltas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tiempo stint
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Media por vuelta
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pérdida tras parada
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {result.stints.map((stint, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 text-gray-900">{idx + 1}</td>
                  <td className="px-4 py-2 text-gray-900">{stint.compound}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {stint.fromLap} - {stint.toLap} ({stint.laps})
                  </td>
                  <td className="px-4 py-2 text-gray-700">{formatSeconds(stint.stintTimeSeconds)}</td>
                  <td className="px-4 py-2 text-gray-700">{formatSeconds(stint.avgLapTimeSeconds)}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {stint.pitStopLossAfterSeconds > 0 ? formatSeconds(stint.pitStopLossAfterSeconds) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Desglose vuelta a vuelta */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-900">Desglose vuelta a vuelta</h3>
        <div className="max-h-96 overflow-x-auto overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Vuelta</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Stint</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Compuesto</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Tiempo vuelta</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Base</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Piloto</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Coche</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Neumático</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Desgaste</th>
                <th className="px-3 py-2 text-left font-medium uppercase tracking-wider text-gray-500">Lluvia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {result.laps.map((lap) => (
                <tr key={lap.lap} className="hover:bg-gray-50">
                  <td className="px-3 py-1.5 text-gray-900">{lap.lap}</td>
                  <td className="px-3 py-1.5 text-gray-700">{lap.stintIndex + 1}</td>
                  <td className="px-3 py-1.5 text-gray-700">{lap.compound}</td>
                  <td className="px-3 py-1.5 font-medium text-gray-900">{formatSeconds(lap.lapTimeSeconds)}</td>
                  <td className="px-3 py-1.5 text-gray-600">{formatSeconds(lap.baseTimeSeconds)}</td>
                  <td className="px-3 py-1.5 text-gray-600">{formatSeconds(lap.driverPenaltySeconds)}</td>
                  <td className="px-3 py-1.5 text-gray-600">{formatSeconds(lap.teamPenaltySeconds)}</td>
                  <td className="px-3 py-1.5 text-gray-600">{formatSeconds(lap.tyrePaceSeconds)}</td>
                  <td className="px-3 py-1.5 text-gray-600">{formatSeconds(lap.wearPenaltySeconds)}</td>
                  <td className="px-3 py-1.5 text-gray-600">{formatSeconds(lap.rainPenaltySeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
