"use strict";

import { QueryInterface } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable("strategies", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      race_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      driver_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      stints: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      simulation_result: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    await queryInterface.addIndex("strategies", ["race_id"]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("strategies");
  },
};
