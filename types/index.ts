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

export interface SimulationPagination {
  limit: number;
  offset: number;
  totalItems: number;
  hasMore: boolean;
  nextOffset: number;
}

export interface SimulationResult {
  race: { id: string; name: string; laps: number; circuitName?: string };
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
  __pagination?: SimulationPagination;
  __originalStints?: Array<{ compound: string; fromLap: number; toLap: number }>;
}

export interface ResultsViewProps {
  result: SimulationResult;
}