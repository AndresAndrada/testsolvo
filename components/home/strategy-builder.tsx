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
  SOFT: "SOFT",
  MEDIUM: "MEDIUM",
  HARD: "HARD",
  INTERMEDIATE: "INTER",
  WET: "WET",
};

const COMPOUND_COLORS: Record<TyreCompound["compound"], string> = {
  SOFT: "bg-red-500",
  MEDIUM: "bg-yellow-400",
  HARD: "bg-zinc-200",
  INTERMEDIATE: "bg-emerald-400",
  WET: "bg-sky-400",
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
      onChangeStints([{ compound: "MEDIUM", fromLap: 1, toLap: Math.min(15, raceLaps || 1) }]);
      return;
    }
    const lastStint = stints[stints.length - 1];
    const nextFrom = lastStint.toLap + 1;
    if (nextFrom > raceLaps) return;
    const nextTo = Math.min(nextFrom + 14, raceLaps);
    onChangeStints([...stints, { compound: "HARD", fromLap: nextFrom, toLap: nextTo }]);
  };

  const removeStint = (index: number) => {
    onChangeStints(stints.filter((_, i) => i !== index));
  };

  const updateStint = (index: number, field: keyof Stint, value: string | number) => {
    const updated = [...stints];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-ajustar stints subsecuentes para evitar gaps
    if (field === "toLap" && typeof value === "number") {
      for (let i = index + 1; i < updated.length; i++) {
        const prevStint = updated[i - 1];
        updated[i].fromLap = prevStint.toLap + 1;
        // Mantener la longitud del stint si es posible
        const stintLength = updated[i].toLap - updated[i].fromLap + 1;
        updated[i].toLap = Math.min(updated[i].fromLap + stintLength - 1, raceLaps);
      }
    }
    
    onChangeStints(updated);
  };

  const autoFillStrategy = () => {
    if (raceLaps <= 0) return;
    onChangeStints([{ compound: "MEDIUM", fromLap: 1, toLap: raceLaps }]);
  };

  const autoFixStrategy = () => {
    if (stints.length === 0 || raceLaps <= 0) return;
    
    const fixed = [...stints];
    
    // Asegurar que empiece en 1
    fixed[0].fromLap = 1;
    
    // Ajustar gaps
    for (let i = 1; i < fixed.length; i++) {
      fixed[i].fromLap = fixed[i - 1].toLap + 1;
    }
    
    // Asegurar que el último termine en raceLaps
    fixed[fixed.length - 1].toLap = raceLaps;
    
    onChangeStints(fixed);
  };

  // Validar si la estrategia es válida
  const validateStrategy = () => {
    if (stints.length === 0) return { valid: false, errors: ["Sin stints definidos"] };
    
    const errors: string[] = [];
    
    // Validar que empiece en vuelta 1
    if (stints[0].fromLap !== 1) {
      errors.push(`Debe empezar en V1 (actual: V${stints[0].fromLap})`);
    }
    
    // Validar que termine en la última vuelta
    const lastStint = stints[stints.length - 1];
    if (lastStint.toLap !== raceLaps) {
      errors.push(`Debe terminar en V${raceLaps} (actual: V${lastStint.toLap})`);
    }
    
    // Validar gaps entre stints
    for (let i = 1; i < stints.length; i++) {
      const expectedFrom = stints[i - 1].toLap + 1;
      if (stints[i].fromLap !== expectedFrom) {
        errors.push(`Gap detectado: Stint ${i + 1} debe empezar en V${expectedFrom}`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  };

  const validation = validateStrategy();

  if (loading) {
    return <div className="text-sm text-zinc-400">Cargando compuestos...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-blue-500/20 bg-blue-500/5 p-2.5">
        <p className="text-xs text-blue-300/90">
          <span className="font-medium">ℹ Reglas:</span> La estrategia debe empezar en V1, terminar en V{raceLaps || "?"}, y no tener gaps entre stints.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Stints</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={autoFillStrategy}
            disabled={raceLaps <= 0}
            className="rounded-sm border border-white/10 px-2 py-1 text-xs text-zinc-300 transition hover:border-white/30 disabled:opacity-40"
          >
            Cubrir carrera
          </button>
          <button
            type="button"
            onClick={addStint}
            disabled={raceLaps <= 0}
            className="rounded-sm border border-red-500/60 px-2 py-1 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-40"
          >
            Añadir
          </button>
        </div>
      </div>

      {stints.length === 0 && (
        <div className="rounded-sm border border-white/5 bg-white/[0.01] p-3 text-xs text-zinc-500">
          Sin stints. Añade uno o cubre toda la carrera.
        </div>
      )}

      <div className="space-y-2">
        {stints.map((stint, index) => (
          <div key={index} className="relative overflow-hidden rounded-sm border border-white/5 bg-black/30">
            <div className={`absolute left-0 top-0 h-full w-1 ${COMPOUND_COLORS[stint.compound]}`} />
            <div className="flex flex-wrap items-end gap-2 p-3 pl-4">
              <div className="flex-1 min-w-[110px]">
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Compuesto</p>
                <select
                  value={stint.compound}
                  onChange={(e) => updateStint(index, "compound", e.target.value)}
                  className="mt-1 w-full rounded-sm border border-white/10 bg-black/65 px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none"
                >
                  {tyres.map((t) => (
                    <option key={t.compound} value={t.compound}>
                      {COMPOUND_LABELS[t.compound]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Desde</p>
                <input
                  type="number"
                  min={index === 0 ? 1 : stints[index - 1].toLap + 1}
                  max={stint.toLap}
                  value={stint.fromLap}
                  onChange={(e) => updateStint(index, "fromLap", parseInt(e.target.value) || 1)}
                  disabled={index > 0}
                  className="mt-1 w-full rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  title={index > 0 ? "El inicio se ajusta automáticamente" : ""}
                />
              </div>
              <div className="w-20">
                <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">Hasta</p>
                <input
                  type="number"
                  min={stint.fromLap}
                  max={index === stints.length - 1 ? raceLaps : raceLaps}
                  value={stint.toLap}
                  onChange={(e) => updateStint(index, "toLap", parseInt(e.target.value) || stint.fromLap)}
                  className="mt-1 w-full rounded-sm border border-white/10 bg-transparent px-2 py-1 text-xs text-zinc-100 focus:border-red-500/60 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStint(index)}
                className="mb-0.5 rounded-sm px-2 py-1 text-xs text-zinc-500 transition hover:text-red-400"
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </div>

      {stints.length > 0 && raceLaps > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-zinc-500">
            Cobertura: V{stints[0].fromLap} – V{stints[stints.length - 1].toLap} / {raceLaps}
          </div>
          {!validation.valid && (
             <div className="rounded-sm border border-yellow-500/40 bg-yellow-500/10 p-3 space-y-2">
               <p className="text-xs font-medium text-yellow-400">⚠ Errores de validación:</p>
               {validation.errors.map((error, idx) => (
                 <p key={idx} className="text-xs text-yellow-300/80">• {error}</p>
               ))}
               <button
                 type="button"
                 onClick={autoFixStrategy}
                 className="mt-2 w-full rounded-sm border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5 text-xs font-medium text-yellow-300 transition hover:bg-yellow-400/20"
               >
                 ✓ Corregir automáticamente
               </button>
             </div>
           )}
          {validation.valid && (
            <div className="rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-2">
              <p className="text-xs text-emerald-400">✓ Estrategia válida</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
