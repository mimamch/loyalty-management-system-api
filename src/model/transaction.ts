import { DataTypes } from "sequelize";
import sequelize from "./db";
import Member from "./membership";

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Transaction.belongsTo(Member, {
  foreignKey: "memberId",
});

Member.hasMany(Transaction, {
  foreignKey: "memberId",
});

export default Transaction;
