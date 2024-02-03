import { DataTypes } from "sequelize";
import PointHistory from "./point_history";
import sequelize from "./db";

const Member = sequelize.define("Member", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  joinDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referral: {
    type: DataTypes.INTEGER,
  },
  earnedPoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  redeemedPoint: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
});

Member.hasMany(Member, {
  foreignKey: "referral",
  as: "Member",
});
Member.belongsTo(Member, {
  foreignKey: "referral",
  as: "Referral",
});

export default Member;
