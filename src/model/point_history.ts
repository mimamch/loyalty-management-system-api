import { DataTypes } from "sequelize";
import Member from "./membership";
import sequelize from "./db";

const PointHistory = sequelize.define("PointHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  transactionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("earned", "redeemed"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  initialPoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

PointHistory.belongsTo(Member, {
  foreignKey: "memberId",
});

Member.hasMany(PointHistory, {
  foreignKey: "memberId",
});

export default PointHistory;
