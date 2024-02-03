import { DataTypes } from "sequelize";
import sequelize from "./db";
import Transaction from "./transaction";

const TransactionProduct = sequelize.define("TransactionProduct", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productQty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subTotal: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Transaction.hasMany(TransactionProduct, {
  foreignKey: "transactionId",
});
TransactionProduct.belongsTo(Transaction, {
  foreignKey: "transactionId",
});

export default TransactionProduct;
