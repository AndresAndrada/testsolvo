import type { NextRequest } from "next/server";
import {
  errorResponse,
  fail,
  ok,
  validationResponse,
} from "@/services/apiResponse";
import {
  simulateInlineSchema,
  simulateRequestSchema,
  type StrategyStint,
} from "@/services/strategySchema";
import {
  F1ApiError,
  getDrivers,
  getRaceById,
  getTeams,
  getTyres,
} from "@/services/f1ApiClient";
import { simulateRace } from "@/services/simulationEngine";
import Strategy from "@/models/strategy";

interface SimulationIssue {
  path: string;
  message: string;
}

function validateCoverage(
  stints: StrategyStint[],
  raceLaps: number,
  knownCompounds: Set<string>,
): SimulationIssue[] {
  const issues: SimulationIssue[] = [];

  if (stints[0].fromLap !== 1) {
    issues.push({
      path: "stints.0.fromLap",
      message: `Strategy must start at lap 1 (got ${stints[0].fromLap})`,
    });
  }

  const lastStint = stints[stints.length - 1];
  if (lastStint.toLap !== raceLaps) {
    issues.push({
      path: `stints.${stints.length - 1}.toLap`,
      message: `Strategy must cover the full race: last stint must end at lap ${raceLaps} (got ${lastStint.toLap})`,
    });
  }

  for (let i = 1; i < stints.length; i++) {
    const expectedFrom = stints[i - 1].toLap + 1;
    if (stints[i].fromLap !== expectedFrom) {
      issues.push({
        path: `stints.${i}.fromLap`,
        message: `Stint must start at lap ${expectedFrom} to avoid gaps (got ${stints[i].fromLap})`,
      });
    }
  }

  stints.forEach((stint, index) => {
    if (!knownCompounds.has(stint.compound)) {
      issues.push({
        path: `stints.${index}.compound`,
        message: `Unknown tyre compound "${stint.compound}"`,
      });
    }
  });

  return issues;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("INVALID_JSON", "Request body must be valid JSON", 400);
  }

  const parsedRequest = simulateRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return validationResponse(parsedRequest.error);
  }

  let raceId: string;
  let driverId: string;
  let stints: StrategyStint[];
  let savedStrategy: Strategy | null = null;

  if (parsedRequest.data.strategyId !== undefined) {
    try {
      savedStrategy = await Strategy.findByPk(parsedRequest.data.strategyId);
    } catch (error) {
      return errorResponse(error);
    }
    if (!savedStrategy) {
      return fail(
        "STRATEGY_NOT_FOUND",
        `Strategy ${parsedRequest.data.strategyId} not found`,
        404,
      );
    }
    raceId = savedStrategy.raceId;
    driverId = savedStrategy.driverId;
    stints = savedStrategy.stints;
  } else {
    const parsedStrategy = simulateInlineSchema.safeParse(body);
    if (!parsedStrategy.success) {
      return validationResponse(parsedStrategy.error);
    }
    raceId = parsedStrategy.data.raceId;
    driverId = parsedStrategy.data.driverId;
    stints = parsedStrategy.data.stints;
  }

  const bodyObj = body as Record<string, unknown>;
  const limit = typeof bodyObj.limit === "number" && bodyObj.limit > 0 ? Math.min(bodyObj.limit, 100) : 20;
  const offset = typeof bodyObj.offset === "number" && bodyObj.offset >= 0 ? bodyObj.offset : 0;
  
  try {
    const [race, drivers, tyres] = await Promise.all([
      getRaceById(raceId),
      getDrivers(),
      getTyres(),
    ]);

    const driver = drivers.find((d) => d.id === driverId);
    if (!driver) {
      return fail("DRIVER_NOT_FOUND", `Driver ${driverId} not found`, 404);
    }

    const teams = await getTeams();
    const team = teams.find((t) => t.id === driver.teamId);
    if (!team) {
      return fail(
        "TEAM_NOT_FOUND",
        `Team ${driver.teamId} not found for driver ${driverId}`,
        404,
      );
    }

    if (!race.circuit) {
      return fail(
        "RACE_DATA_INVALID",
        `Race ${raceId} has no circuit data available`,
        502,
      );
    }

    const issues = validateCoverage(
      stints,
      race.laps,
      new Set(tyres.map((t) => t.compound)),
    );
    if (issues.length > 0) {
      return fail(
        "STRATEGY_INVALID",
        "Strategy does not cover the race correctly",
        400,
        issues,
      );
    }

    const simulation = simulateRace({ race, driver, team, tyres, stints });

    if (savedStrategy) {
      try {
        await savedStrategy.update({
          simulationResult: {
            ...simulation,
            simulatedAt: new Date().toISOString(),
          },
        });
      } catch (error) {
        return errorResponse(error);
      }
    }

    const totalLaps = Array.isArray(simulation.laps) ? simulation.laps.length : 0;
    const paginatedLaps = Array.isArray(simulation.laps)
      ? simulation.laps.slice(offset, offset + limit)
      : [];
    const hasMore = offset + paginatedLaps.length < totalLaps;
    const nextOffset = hasMore ? offset + paginatedLaps.length : offset + paginatedLaps.length;

    return ok({
      simulation: {
        ...simulation,
        laps: paginatedLaps,
      },
      strategyId: savedStrategy ? savedStrategy.id : null,
      persisted: savedStrategy !== null,
      pagination: {
        limit,
        offset,
        totalItems: totalLaps,
        hasMore,
        nextOffset,
      },
    });
  } catch (error) {
    if (error instanceof F1ApiError && error.status === 404) {
      return fail("RACE_NOT_FOUND", `Race ${raceId} not found`, 404);
    }
    return errorResponse(error);
  }
}
