import { Router } from "express";
import { addTransactionMember } from "../controllers/transaction_controller";

const TransactionRouter = Router();

TransactionRouter.post("/", addTransactionMember);

export default TransactionRouter;
