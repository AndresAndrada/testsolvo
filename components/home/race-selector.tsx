"use client";

import { useEffect, useState } from "react";
import useLanguageStore from "@/stores/languageStore";

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
  const { t } = useLanguageStore();

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/races");
        const json = await res.json();
        if (json.error) {
          setError(json.error.message || t('raceSelector.error'));
          return;
        }
        setRaces(json.data?.races || []);
      } catch (err) {
        setError(t('raceSelector.errorServer'));
      } finally {
        setLoading(false);
      }
    };
    fetchRaces();
  }, [t]);

  if (loading) {
    return <div className="text-sm text-zinc-400">{t('raceSelector.loading')}</div>;
  }

  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  const selectedRace = races.find((r) => r.id === selectedRaceId);

  return (
    <div className="space-y-2">
      <label htmlFor="race" className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {t('raceSelector.selectRace')}
      </label>
      <select
        id="race"
        value={selectedRaceId || ""}
        onChange={(e) => onSelectRace(e.target.value)}
        className="mt-1 w-full rounded-sm border border-white/10 bg-black/65 px-3 py-2 text-sm text-zinc-100 shadow-[0_20px_60px_-40px_rgba(239,68,68,0.8)] transition focus:border-red-500/60 focus:outline-none focus:ring-0"
      >
        <option value="">{t('raceSelector.selectGrandPrix')}</option>
        {races.map((race) => (
          <option key={race.id} value={race.id}>
            R{race.round} · {race.name}
          </option>
        ))}
      </select>
      {selectedRace && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-zinc-400">
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('raceSelector.laps')}</span>
            <div className="text-zinc-200">{selectedRace.laps}</div>
          </div>
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('raceSelector.temperature')}</span>
            <div className="text-zinc-200">{selectedRace.temperature}°C</div>
          </div>
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('raceSelector.rain')}</span>
            <div className="text-zinc-200">{(selectedRace.rainProbability * 100).toFixed(0)}%</div>
          </div>
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('raceSelector.circuit')}</span>
            <div className="truncate text-zinc-200">{selectedRace.circuit?.name || selectedRace.circuitId}</div>
          </div>
        </div>
      )}
    </div>
  );
}
