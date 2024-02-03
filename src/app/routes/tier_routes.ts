import { Router } from "express";
import {
  addTier,
  deleteTier,
  listTier,
  updateTier,
} from "../controllers/tier_controller";

const TierRouter = Router();

TierRouter.post("/", addTier);
TierRouter.put("/", updateTier);
TierRouter.get("/", listTier);
TierRouter.delete("/:id", deleteTier);

export default TierRouter;
