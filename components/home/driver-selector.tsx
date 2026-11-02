"use client";

import { useEffect, useState } from "react";
import useLanguageStore from "@/stores/languageStore";
import { Select } from "@/components/ui";

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
  const { t } = useLanguageStore();

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
          setError(driversJson.error.message || t('driverSelector.errorDrivers'));
          return;
        }
        if (teamsJson.error) {
          setError(teamsJson.error.message || t('driverSelector.errorTeams'));
          return;
        }

        setDrivers(driversJson.data?.drivers || []);
        setTeams(teamsJson.data?.teams || []);
      } catch (err) {
        setError(t('driverSelector.errorServer'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || teamId;
  };

  if (loading) {
    return <div className="text-sm text-zinc-400">{t('driverSelector.loading')}</div>;
  }

  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId);
  const selectedTeam = selectedDriver ? teams.find((t) => t.id === selectedDriver.teamId) : null;

  return (
    <div className="space-y-2">
      <label htmlFor="driver" className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {t('driverSelector.selectDriver')}
      </label>
      <Select
        id="driver"
        value={selectedDriverId || ""}
        onChange={(e) => onSelectDriver(e.target.value)}
      >
        <option value="">{t('driverSelector.selectDriverPlaceholder')}</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            #{driver.number} · {driver.name} · {getTeamName(driver.teamId)}
          </option>
        ))}
      </Select>
      {selectedDriver && (
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-400">
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('driverSelector.pace')}</span>
            <div className="text-zinc-200">{(selectedDriver.pace * 100).toFixed(0)}%</div>
          </div>
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('driverSelector.consistency')}</span>
            <div className="text-zinc-200">{(selectedDriver.consistency * 100).toFixed(0)}%</div>
          </div>
          <div className="rounded-sm border border-white/5 px-2 py-1">
            <span className="text-zinc-500">{t('driverSelector.car')}</span>
            <div className="text-zinc-200">{selectedTeam ? `${(selectedTeam.carPerformance * 100).toFixed(0)}%` : "-"}</div>
          </div>
        </div>
      )}
    </div>
  );
}
