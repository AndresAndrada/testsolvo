import { Sequelize } from "sequelize";

function createSequelize(): Sequelize {
  return new Sequelize({
    dialect: "postgres",
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME ?? "f1_race_strategist",
    username: process.env.DB_USER ?? "postgres",
    password: process.env.DB_PASSWORD ?? "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 10000,
      idle: 10000,
    },
  });
}

const globalForSequelize = globalThis as unknown as { sequelize?: Sequelize };

export const sequelize = globalForSequelize.sequelize ?? createSequelize();

if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}

export default sequelize;
