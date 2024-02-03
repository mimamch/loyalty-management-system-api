import Transaction from "@/model/transaction";
import moment from "moment";

export const generateTransactionId = async () => {
  const prefix = "TRINV";
  const totalTransaction = ((await Transaction.count()) + 1)
    .toString()
    .padStart(6, "0");
  const date = moment().format("DDMMYYYY");
  const id = `${prefix}/${totalTransaction}/${date}`;
  return id;
};
