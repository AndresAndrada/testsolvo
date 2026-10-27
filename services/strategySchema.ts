import { z } from "zod";

export const tyreCompoundSchema = z.enum([
  "SOFT",
  "MEDIUM",
  "HARD",
  "INTERMEDIATE",
  "WET",
]);

export const stintSchema = z
  .object({
    compound: tyreCompoundSchema,
    fromLap: z.number().int().min(1),
    toLap: z.number().int().min(1),
  })
  .refine((stint) => stint.fromLap <= stint.toLap, {
    message: "fromLap must be less than or equal to toLap",
    path: ["fromLap"],
  });

const strategyCoreFields = {
  raceId: z.string().trim().min(1).max(50),
  driverId: z.string().trim().min(1).max(50),
  stints: z.array(stintSchema).min(1).max(20),
};

function hasAscendingNonOverlappingStints(strategy: {
  stints: { fromLap: number; toLap: number }[];
}): boolean {
  return strategy.stints.every(
    (stint, index) =>
      index === 0 || stint.fromLap > strategy.stints[index - 1].toLap,
  );
}

const ascendingStintsRefine: {
  message: string;
  path: string[];
} = {
  message: "Stints must be in ascending order and must not overlap",
  path: ["stints"],
};

export const createStrategySchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    ...strategyCoreFields,
  })
  .refine(hasAscendingNonOverlappingStints, ascendingStintsRefine);

export const simulateInlineSchema = z
  .object({ ...strategyCoreFields })
  .refine(hasAscendingNonOverlappingStints, ascendingStintsRefine);

export type CreateStrategyInput = z.infer<typeof createStrategySchema>;

export type StrategyStint = CreateStrategyInput["stints"][number];

export const simulateRequestSchema = z
  .object({
    strategyId: z.number().int().positive().optional(),
    name: z.string().trim().min(1).max(100).optional(),
    raceId: z.string().trim().min(1).max(50).optional(),
    driverId: z.string().trim().min(1).max(50).optional(),
    stints: z.array(stintSchema).min(1).max(20).optional(),
  })
  .refine(
    (data) =>
      data.strategyId !== undefined ||
      (data.raceId !== undefined &&
        data.driverId !== undefined &&
        data.stints !== undefined),
    {
      message:
        "Provide either strategyId or a full strategy (raceId, driverId, stints)",
    },
  );

export type SimulateRequest = z.infer<typeof simulateRequestSchema>;
