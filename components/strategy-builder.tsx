"use client";

import { useEffect, useState } from "react";

export interface TyreCompound {
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  pace: number;
  degradation: number;
  wetPerformance: number;
  optimalRainIntensity: { min: number; max: number };
}

export interface Stint {
  compound: TyreCompound["compound"];
  fromLap: number;
  toLap: number;
}

interface StrategyBuilderProps {
  raceLaps: number;
  stints: Stint[];
  onChangeStints: (stints: Stint[]) => void;
}

const COMPOUND_LABELS: Record<TyreCompound["compound"], string> = {
  SOFT: "Blando (SOFT)",
  MEDIUM: "Medio (MEDIUM)",
  HARD: "Duro (HARD)",
  INTERMEDIATE: "Intermedio (INTERMEDIATE)",
  WET: "Lluvia (WET)",
};

export default function StrategyBuilder({ raceLaps, stints, onChangeStints }: StrategyBuilderProps) {
  const [tyres, setTyres] = useState<TyreCompound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTyres = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/tyres");
        const json = await res.json();
        if (json.error) {
          setError(json.error.message || "Error al cargar neumáticos");
          return;
        }
        setTyres(json.data?.tyres || []);
      } catch (err) {
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    fetchTyres();
  }, []);

  const addStint = () => {
    if (stints.length === 0) {
      onChangeStints([{ compound: "MEDIUM", fromLap: 1, toLap: Math.min(10, raceLaps) }]);
      return;
    }
    const lastStint = stints[stints.length - 1];
    const nextFrom = lastStint.toLap + 1;
    if (nextFrom > raceLaps) return;
    const nextTo = Math.min(nextFrom + 9, raceLaps);
    onChangeStints([...stints, { compound: "HARD", fromLap: nextFrom, toLap: nextTo }]);
  };

  const removeStint = (index: number) => {
    onChangeStints(stints.filter((_, i) => i !== index));
  };

  const updateStint = (index: number, field: keyof Stint, value: string | number) => {
    const updated = [...stints];
    updated[index] = { ...updated[index], [field]: value };
    onChangeStints(updated);
  };

  const autoFillStrategy = () => {
    if (raceLaps <= 0) return;
    // Estrategia simple: cubrir toda la carrera
    onChangeStints([{ compound: "MEDIUM", fromLap: 1, toLap: raceLaps }]);
  };

  if (loading) {
    return <div className="text-sm text-gray-600">Cargando neumáticos...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-900">Constructor de estrategia (Stints)</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={autoFillStrategy}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200"
          >
            Rellenar automático
          </button>
          <button
            type="button"
            onClick={addStint}
            disabled={raceLaps <= 0}
            className="rounded-md bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Añadir stint
          </button>
        </div>
      </div>

      {stints.length === 0 && (
        <div className="rounded-md bg-yellow-50 p-3 text-xs text-yellow-800">
          No hay stints definidos. Usa "Rellenar automático" o "Añadir stint" para crear tu estrategia.
        </div>
      )}

      <div className="space-y-2">
        {stints.map((stint, index) => (
          <div key={index} className="flex flex-wrap items-end gap-2 rounded-md border border-gray-200 p-3">
            <div className="flex-1 min-w-[120px]">
              <label className="block text-xs text-gray-700">Compuesto</label>
              <select
                value={stint.compound}
                onChange={(e) => updateStint(index, "compound", e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
              >
                {tyres.map((t) => (
                  <option key={t.compound} value={t.compound}>
                    {COMPOUND_LABELS[t.compound]}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs text-gray-700">Desde vuelta</label>
              <input
                type="number"
                min={1}
                max={raceLaps}
                value={stint.fromLap}
                onChange={(e) => updateStint(index, "fromLap", parseInt(e.target.value) || 1)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
              />
            </div>
            <div className="w-24">
              <label className="block text-xs text-gray-700">Hasta vuelta</label>
              <input
                type="number"
                min={stint.fromLap}
                max={raceLaps}
                value={stint.toLap}
                onChange={(e) => updateStint(index, "toLap", parseInt(e.target.value) || stint.fromLap)}
                className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => removeStint(index)}
              className="mb-0.5 rounded-md bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {stints.length > 0 && (
        <div className="text-xs text-gray-600">
          <span className="font-medium">Cobertura:</span> Vuelta {stints[0].fromLap} - {stints[stints.length - 1].toLap} de {raceLaps}
        </div>
      )}
    </div>
  );
}
