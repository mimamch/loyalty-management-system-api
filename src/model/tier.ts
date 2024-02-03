import { DataTypes } from "sequelize";
import sequelize from "./db";

const Tier = sequelize.define("Tier", {
  tierName: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  minPoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxPoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Tier;
