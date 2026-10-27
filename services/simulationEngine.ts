import type { Driver, Race, Team, TyreCompound } from "./f1ApiClient";
import type { StrategyStint } from "./strategySchema";

const DRIVER_PENALTY_SCALE = 15;
const TEAM_PENALTY_SCALE = 15;
const RAIN_PENALTY_SCALE = 60;

export interface LapDetail {
  lap: number;
  stintIndex: number;
  compound: TyreCompound["compound"];
  lapTimeSeconds: number;
  baseTimeSeconds: number;
  driverPenaltySeconds: number;
  teamPenaltySeconds: number;
  tyrePaceSeconds: number;
  wearPenaltySeconds: number;
  rainPenaltySeconds: number;
}

export interface StintSummary {
  compound: TyreCompound["compound"];
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

export function formatRaceTime(seconds: number): string {
  const totalMs = Math.round(seconds * 1000);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function computeRainPenalty(
  rainIntensity: number,
  tyre: TyreCompound,
): number {
  const { min, max } = tyre.optimalRainIntensity;
  if (rainIntensity > max) {
    return (rainIntensity - max) * RAIN_PENALTY_SCALE * (1 - tyre.wetPerformance);
  }
  if (rainIntensity < min) {
    return (min - rainIntensity) * RAIN_PENALTY_SCALE * tyre.wetPerformance;
  }
  return 0;
}

export function simulateRace(params: {
  race: Race;
  driver: Driver;
  team: Team;
  tyres: TyreCompound[];
  stints: StrategyStint[];
}): SimulationResult {
  const { race, driver, team, tyres, stints } = params;
  const circuit = race.circuit;

  if (!circuit) {
    throw new Error(`Race ${race.id} has no embedded circuit data`);
  }

  const tyreByCompound = new Map(tyres.map((t) => [t.compound, t]));
  const driverPenalty = (1 - driver.pace) * DRIVER_PENALTY_SCALE;
  const teamPenalty = (1 - team.carPerformance) * TEAM_PENALTY_SCALE;
  const rainIntensity = race.rainProbability;

  const laps: LapDetail[] = [];
  const stintSummaries: StintSummary[] = [];
  let lapTimeTotal = 0;

  stints.forEach((stint, stintIndex) => {
    const tyre = tyreByCompound.get(stint.compound);
    if (!tyre) {
      throw new Error(`Unknown tyre compound: ${stint.compound}`);
    }

    const isLastStint = stintIndex === stints.length - 1;
    const pitStopLossAfter = isLastStint ? 0 : circuit.pitStopLoss;
    let stintTime = 0;

    for (let lap = stint.fromLap; lap <= stint.toLap; lap++) {
      const stintLapIndex = lap - stint.fromLap + 1;
      const wearPenalty =
        tyre.degradation *
        circuit.tyreWear *
        (1 + (1 - driver.consistency)) *
        stintLapIndex;
      const rainPenalty = computeRainPenalty(rainIntensity, tyre);
      const lapTimeSeconds =
        circuit.baseLapTime +
        driverPenalty +
        teamPenalty +
        tyre.pace +
        wearPenalty +
        rainPenalty;

      laps.push({
        lap,
        stintIndex,
        compound: stint.compound,
        lapTimeSeconds: Number(lapTimeSeconds.toFixed(3)),
        baseTimeSeconds: circuit.baseLapTime,
        driverPenaltySeconds: Number(driverPenalty.toFixed(3)),
        teamPenaltySeconds: Number(teamPenalty.toFixed(3)),
        tyrePaceSeconds: Number(tyre.pace.toFixed(3)),
        wearPenaltySeconds: Number(wearPenalty.toFixed(3)),
        rainPenaltySeconds: Number(rainPenalty.toFixed(3)),
      });

      stintTime += lapTimeSeconds;
      lapTimeTotal += lapTimeSeconds;
    }

    const stintLaps = stint.toLap - stint.fromLap + 1;
    stintSummaries.push({
      compound: stint.compound,
      fromLap: stint.fromLap,
      toLap: stint.toLap,
      laps: stintLaps,
      stintTimeSeconds: Number(stintTime.toFixed(3)),
      avgLapTimeSeconds: Number((stintTime / stintLaps).toFixed(3)),
      pitStopLossAfterSeconds: pitStopLossAfter,
    });
  });

  const pitStops = Math.max(0, stints.length - 1);
  const pitLossSeconds = pitStops * circuit.pitStopLoss;
  const raceTimeSeconds = lapTimeTotal + pitLossSeconds;

  return {
    race: {
      id: race.id,
      name: race.name,
      laps: race.laps,
      circuitName: circuit.name,
    },
    driver: { id: driver.id, name: driver.name },
    team: { id: team.id, name: team.name },
    stints: stintSummaries,
    laps,
    totals: {
      lapTimeSeconds: Number(lapTimeTotal.toFixed(3)),
      pitLossSeconds: Number(pitLossSeconds.toFixed(3)),
      raceTimeSeconds: Number(raceTimeSeconds.toFixed(3)),
      raceTimeFormatted: formatRaceTime(raceTimeSeconds),
    },
  };
}
