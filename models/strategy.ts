import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/config/database";
import type { StrategyStint } from "@/services/strategySchema";

export type { StrategyStint };
export type SimulationResult = Record<string, unknown> | null;

export interface StrategyAttributes {
  id: number;
  name: string;
  raceId: string;
  driverId: string;
  stints: StrategyStint[];
  simulationResult: SimulationResult;
  createdAt: Date;
  updatedAt: Date;
}

type StrategyCreationAttributes = Optional<
  StrategyAttributes,
  "id" | "simulationResult" | "createdAt" | "updatedAt"
>;

export class Strategy
  extends Model<StrategyAttributes, StrategyCreationAttributes>
  implements StrategyAttributes
{
  declare id: number;
  declare name: string;
  declare raceId: string;
  declare driverId: string;
  declare stints: StrategyStint[];
  declare simulationResult: SimulationResult;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Strategy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    raceId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "race_id",
    },
    driverId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "driver_id",
    },
    stints: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    simulationResult: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: "simulation_result",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "strategies",
    timestamps: true,
  },
);

export default Strategy;
