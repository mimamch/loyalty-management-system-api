import { Router } from "express";
import UserRouter from "./user_routes";
import TierRouter from "./tier_routes";
import MemberRoute from "./member_routes";
import TransactionRouter from "./transaction_routes";
import LoyaltyRouter from "./loyalty_routes";

const MainRouter = Router();

MainRouter.use("/user", UserRouter);
MainRouter.use("/tier", TierRouter);
MainRouter.use("/member", MemberRoute);
MainRouter.use("/transaction", TransactionRouter);
MainRouter.use("/loyalty", LoyaltyRouter);

export default MainRouter;
