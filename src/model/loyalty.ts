import { DataTypes } from "sequelize";
import sequelize from "./db";

const Loyalty = sequelize.define("Loyalty", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  // pre-requisite member to reach this loyalty
  onTransactionAmount: {
    type: DataTypes.INTEGER,
  },
  onQty: {
    type: DataTypes.INTEGER,
  },
  onFirstPurchase: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  onReferral: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  onMemberActivity: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  onMemberBirthday: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  // reward
  percentagePoint: {
    type: DataTypes.INTEGER,
  },
  maxPercentagePoint: {
    type: DataTypes.INTEGER,
  },
  fixedPoint: {
    type: DataTypes.INTEGER,
  },

  // period
  start: {
    type: DataTypes.DATE,
  },
  end: {
    type: DataTypes.DATE,
  },
});

export default Loyalty;
