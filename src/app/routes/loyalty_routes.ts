import { Router } from "express";
import {
  addLoyalty,
  listAvailableLoyalty,
  listLoyalty,
} from "../controllers/loyalty_controller";

const LoyaltyRouter = Router();

LoyaltyRouter.post("/", addLoyalty);
LoyaltyRouter.get("/", listLoyalty);
LoyaltyRouter.get("/available", listAvailableLoyalty);

export default LoyaltyRouter;
